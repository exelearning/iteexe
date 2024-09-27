# Copyright (c) 2004 Divmod.
# See LICENSE for details.

"""Provides a bidirectional channel for sending out-of-band
events between client and server without refreshing the whole
page.
"""


import os.path, warnings, itertools, traceback

from twisted.internet import defer, reactor
from twisted.internet.task import LoopingCall
from twisted.python import reflect, log

from nevow import events, tags, inevow, compy, testutil, context, appserver, guard, static, flat, rend, url
from nevow.flat import flatten


# If you need to debug livepage itself or your livepage app, set this to true
DEBUG = False


def jquote(jscript):
    return jscript.replace('\\', '\\\\').replace("'", "\\'").replace('\n', '\\n')


def _quoteJSArguments(args):
    argstr = []
    for a in args:
        if isinstance(a, bool):
            argstr.append(str(a).lower())
        elif isinstance(a, (int, float, _js)):
            argstr.append(str(a))
        else:
            argstr.append("'%s'" % (flt(a),))
    return argstr


def callJS(func, *args):
    """Return a Javascript string formatted such that the JS function named
    by the string 'func' will be called and the args specified as strings in
    *args will be quoted properly to prevent JS syntax errors.
    """
    return "%s(%s)" % (func, ','.join(map(str, _quoteJSArguments(args))))


class _js(object):
    """Marker indicating JavaScript should be included in a handler argument.
    No escaping will be performed.

    Normally arguments are embedded as strings in the javascript
    nevow_clientToServerEvent function call, and are evaluated in the
    context of this call. This puts the js variable 'node' in scope. When
    the js object is used, the unquoted string is inserted at that point
    in the argument list and will be evaluated by the JS interpreter
    before the nevow_clientToServerEvent call. The result will then be
    passed to nevow_clientToServerEvent and forwarded to the server.

    For example, the following:

    input(onchange=handler(foo, 'this.value'))

    Will be output as:

    nevow_clientToServerEvent('foo-identifier', 'this.value')

    Which will cause foo to be invoked on the server with the string
    'this.value', which is probably not what you want:

    foo(client, 'this.value')

    However, the following:

    input(onchange=handler(foo, js('this.value')))

    Will be output as:

    nevow_clientToServerEvent('foo-identifier', this.value)

    Which will cause foo to be invoked on the server with
    whatever the value of the input field was at the time the
    event handler fired:

    foo(client, 'fred flintstone')

    As a string. All handler arguments are always passed as strings.
    """

    def __init__(self, name=''):
        self._name = name

    def __getattr__(self, name):
        if self._name:
            return self.__class__(self._name+'.'+name)
        return self.__class__(name)

    def __call__(self, *args):
        if not self._name:
            name, = args
            return self.__class__(name)
        return self.__class__(callJS(self._name, *args))

    def __getitem__(self, args):
        if not isinstance(args, tuple):
            args = (args,)
        return self.__class__(self._name+'['+','.join(map(str, _quoteJSArguments(args)))+']')

    def __str__(self):
        return self._name


js = _js()
flat.registerFlattener(lambda original, ctx: str(original), _js)


document = _js('document')
window = _js('window')
this = _js('this')
self = _js('self')


def flt(stan, quote=True, client=None):
    """Flatten some stan to a string suitable for embedding in a javascript
    string.

    If quote is True, apostrophe, quote, and newline will be quoted
    """

    fr = testutil.FakeRequest()
    ctx = context.RequestContext(tag=fr)
    ctx.remember(client, IClientHandle)
    ctx.remember(None, inevow.IData)
    fl = flatten(stan, ctx=ctx)
    if quote:
        fl = jquote(fl)
    return fl

ctsTemplate = "nevow_clientToServerEvent('%s',this,''%s);%s"
handledEventPostlude = ' return false;'

class strWithCallit(str):
    pass

class IClientHandle(compy.Interface):
    def hookupOutput(self, output, finisher=None):
        """hook up an output conduit to this live evil instance.
        """

    def sendScript(self, script):
        """send a script through the output conduit to the browser.
        If no output conduit is yet hooked up, buffer the script
        until one is.
        """

    def handleInput(self, identifier, *args):
        """route some input from the browser to the appropriate
        destination.
        """

def handler(*args, **kw):
    """Take a python callable and return a renderer of javascript which will
    invoke the Python callable on the server side. Normal usage is to put
    this in a javascript event handler, such as:

    >>> def render_live(ctx, data):
    ...     def clicked(client): client.alert("Clicked!")
    ... 
    ...     return a(onclick=handler(clicked))["Click me"]

    Any additional arguments which are passed to handler are assumed to be
    strings of javascript. These strings will be evaluated in the context of
    the client-side event, and the results will be sent as strings to the
    python callable. For example:

    >>> def render_yourName(ctx, data):
    ...     def entered(client, name): client.alert(["You entered: ", name])
    ... 
    ...     return input(type="text", onchange=handler(entered, "node.value"))

    Note that the node upon which the event is occuring will generally be
    bound to the name 'this' in the javascript context.

    The javascript string emitted by the renderer will have 'return false;'
    appended to prevent the 'normal' action from the javascript handler from
    triggering. If you wish for the event to be sent to both the server and
    the normal browser handler, pass C{bubble=True} as a keyword argument to
    handler.

    The javascript string emitted by the renderer will have quoted quote and
    amperstand in preparation for insertion into a javascript handler inside
    a javascript attribute. If you wish to use the JavaScript emitted by the
    renderer outside a node attribute, pass: C{outsideAttribute=True} as a
    keyword argument to handler.

    C{handler} can also be used as a Python 2.4 decorator. If the first
    argument to handler is not a callable, the rest of the arguments will be
    partially applied (to the right) and a one-argument function will be
    returned, which can be used as a decorator. For example, both of the
    following are possible:

    >>> @handler
    ... def foo(client): pass

    >>> @handler(document.getElementById('one').value)
    ... def foo(client, value): pass

    Each handler is assigned a unique numeric identifier, which will appear
    in the server logs in various 'nevow_liveInput' hits. If you provide a
    special keyword argument named 'identifier', it will be used instead of
    this number, which may be useful for debugging (so you can see actual
    function names in your logs instead of opaque numbers). If you choose to
    do this, make sure that the identifiers are accurate: do not register
    two different handlers (which might invoke the same method but with
    different arguments, etc) with the same identifier. """

    ## Handle working like a 2.4 decorator where calling handler returns a
    ## decorator
    if not callable(args[0]) or isinstance(args[0], _js):
        return lambda callit: handler(callit, *args, **kw)

    callit = args[0]
    args = args[1:]

    bubble = kw.get('bubble')
    if bubble:
        postlude = ''
    else:
        postlude = handledEventPostlude

    if args:
        argstr = ',' + ','.join(map(str, _quoteJSArguments(args)))
        if kw.get('outsideAttribute'):
            ## escapeJSArguments calls flt which replaces & with &amp;
            ## TODO: Test for this: is this correct?
            argstr = argstr.replace('&amp;', '&')
        else:
            argstr = argstr.replace('"', '&quot;')
    else:
        argstr = ''

    identifier = None
    if 'identifier' in kw:
        identifier = kw['identifier']

    def block(context, data):
        client = IClientHandle(context)
        if identifier is None:
            iden = client.events.nextId()
        else:
            iden = identifier
        client.events.subscribe(iden, callit)
        return tags.xml(ctsTemplate % (iden, argstr, postlude ))

    block.callit = callit
    return block


class TimeoutException(Exception):
    pass


class ClientHandle(object):
    """An object which represents the client-side webbrowser.
    """
    __implements__ = IClientHandle,

    outputConduit = None

    def __init__(self, handleId, refreshInterval, targetTimeoutCount):
        self.refreshInterval = refreshInterval
        self.targetTimeoutCount = targetTimeoutCount
        self.timeoutCount = 0
        self.handleId = handleId
        self.events = events.EventNotification()
        self.outputBuffer = []
        self.closed = False
        self.closeNotifications = []
        self.firstTime = True
        self.timeoutLoop = LoopingCall(self.checkTimeout)
        self.timeoutLoop.start(self.refreshInterval)

    def setOutput(self, output):
        self.timeoutCount = 0
        self.outputConduit = output
        if self.outputBuffer:
            self.sendScript('\n'.join(map(str, self.outputBuffer)))
            self.outputBuffer = []

    def checkTimeout(self):
        if self.firstTime:
            self.firstTime = False
            return
        if self.outputConduit is not None:
            ## The browser is waiting for us, send a noop.
            self.sendScript('null;')
        self.timeoutCount += 1
        if self.timeoutCount >= self.targetTimeoutCount:
            ## This connection timed out.
            self.outputGone(None, self.outputConduit)

    def outputGone(self, failure, output):
        assert output == self.outputConduit
        if failure:
            log.err(failure)
        else:
            self.outputConduit = None
            self._closeComplete(failure)
        return None

    def _closeComplete(self, failure=None):
        self.closed = True
        if self.timeoutLoop:
            self.timeoutLoop.stop()
        self.timeoutLoop = None
        for notify in self.closeNotifications[:]:
            if failure is not None:
                notify.errback(failure)
            else:
                notify.callback(None)
        self.closeNotifications = []

    def sendScript(self, script):
        """Send a JavaScript string, 'script', to the browser represented by
        this mind, and evaluate it in the context of the browser window.
        """
        output = str(script)
        if len(output) and output[0] == '<':
            #import pdb; pdb.Pdb().set_trace()
            ## This will catch exception pages, html pages written as javascript to this response, etc
            err = "ERROR: Attempting to send invalid javascript to browser: %s" % output
            log.err(RuntimeError(err))
            return
        if self.outputConduit:
            if DEBUG: print("SENDING SCRIPT", script)
            output = str(script)
            self.outputConduit.callback(output)
            self.outputConduit = None
        else:
            self.outputBuffer.append(script)
            if DEBUG: print("Output buffered!", script)

    def handleInput(self, identifier, *args):
        if self.closed:
            log.msg("Hey, got input on a closed ClientHandle")
            return
        self.timeoutCount = 0
        if identifier == 'close':
            # the nevow_closeLive that we sent causes the glue to not renew
            # the output-side xmlhttp request, so .outputConduit will be
            # None and stay that way. This means we don't need to worry
            # about self.outputGone firing later on.
            if DEBUG: print("CLIENT ACKED CLOSE")
            ## This happens in a callLater(0) from the original request
            self._closeComplete(None)
            return
        if DEBUG: print("Dispatching event to observer", identifier, args)
        try:
            self.events.publish(identifier, *(self, ) + args)
        except:
            log.err()

    def notifyOnClose(self):
        """This will return a Deferred that will be fired when the
        connection is closed 'normally', i.e. in response to handle.close()
        . If the connection is lost in any other way (because the browser
        navigated to another page, the browser was shut down, the network
        connection was lost, or the timeout was reached), this will errback
        instead."""
        d = defer.Deferred()
        self.closeNotifications.append(d)
        return d

    def close(self, executeScriptBeforeClose=""):
        if DEBUG: print("CLOSE WAS CALLED")
        d = self.notifyOnClose()
        self.call('nevow_closeLive', self.flt(executeScriptBeforeClose))
        return d

    ## Here is some api your handlers can use to more easily manipulate the
    ## live page
    def flt(self, what, quote=True):
        return flt(what, quote=quote, client=self)

    def set(self, what, to):
        """Set the contents of the node with the id 'what' to the stan 'to'
        """
        if not isinstance(to, _js):
            to = "'%s'" % (self.flt(to), )
        self.sendScript("nevow_setNode('%s', %s);" % (self.flt(what), to))

    def alert(self, what):
        """Show the user an alert 'what'
        """
        if not isinstance(what, _js):
            what = "'%s'" % (self.flt(what), )
        self.sendScript("alert(%s);" % (what, ))

    def append(self, where, what):
        """Append the stan 'what' to the node with the id 'where'
        """
        # client.append('foo', js("document.getNodeByID('bar')"))
        if not isinstance(what, _js):
            what = "'%s'" % (self.flt(what), )
        self.sendScript(
            "nevow_appendNode('%s', %s);" % (self.flt(where), what))

    def call(self, func, *args):
        """Call the javascript function named 'func' with the arguments given.
        """
        self.sendScript(callJS(func, *args) + ';')


class DefaultClientHandleFactory(object):
    clientHandleClass = ClientHandle

    def __init__(self):
        self.clientHandles = {}
        self.handleCounter = itertools.count().__next__

    def newClientHandle(self, ctx, refreshInterval, targetTimeoutCount):
        handleid = inevow.ISession(ctx).uid + '-' + str(self.handleCounter())
        handle = self.clientHandleClass(handleid,
                                        refreshInterval, targetTimeoutCount)
        self.clientHandles[handleid] = handle
        handle.notifyOnClose().addCallback(self.deleteHandle, handleid=handleid)
        return handle

    def deleteHandle(self, _=None, handleid=None):
        del self.clientHandles[handleid]

    def getHandleForId(self, handleId):
        """Override this to restore old handles on demand."""
        if handleId not in self.clientHandles:
            log.msg("No handle for ID %s" % handleId)
        return self.clientHandles[handleId]

clientHandleFactory = DefaultClientHandleFactory()

class Output(object):
    __implements__ = inevow.IResource,

    def renderHTTP(self, ctx):
        request = inevow.IRequest(ctx)
        ## Make sure twisted.protocols.http doesn't leave crappy
        ## DelayedCalls around, because we manage timeouts of
        ## the output object
        try:
            request.channel._savedTimeOut = None
            request.setHeader("Cache-Control", "no-cache")
            request.setHeader("Pragma", "no-cache")
            request.setHeader("Connection", "close")
            request.write('')
            if DEBUG: print("OUTPUT RENDER", request.uri, request)
    
            handleId = ctx.arg('client-handle-id')
    
            d = defer.Deferred()
            clientHandle = clientHandleFactory.getHandleForId(handleId)
            request.notifyFinish().addErrback(clientHandle.outputGone, d)
            clientHandle.setOutput(d)
        except Exception as e:
            traceback.print_stack()
            return "alert('Exception on server: %s')" % e.replace("'", '"')
        return d


class Input(object):
    __implements__ = inevow.IResource,

    def renderHTTP(self, ctx):
        request = inevow.IRequest(ctx)
        request.setHeader("Cache-Control", "no-cache")
        request.setHeader("Pragma", "no-cache")
        handleId = ctx.arg('client-handle-id')
        # get the clientHandle
        clientHandle = clientHandleFactory.getHandleForId(handleId)
        reactor.callLater(0.00000001, clientHandle.handleInput,
                          request.args['target'][0],
                          *request.args.get('arguments',()))
        return '<html><body>Input event.</body></html>'


class LivePage(rend.Page):
    refreshInterval = 30
    targetTimeoutCount = 3

    def renderHTTP(self, ctx):
        # each time the page is rendered, it gets a new ClientHandle
        handle = clientHandleFactory.newClientHandle(
            ctx,
            self.refreshInterval,
            self.targetTimeoutCount)
        ctx.remember(handle, IClientHandle)
        self.goingLive(ctx, handle)
        return rend.Page.renderHTTP(self, ctx)

    def goingLive(self, ctx, handle):
        """This particular LivePage instance is 'going live' from the
        perspective of the ClientHandle 'handle'. Override this to
        get notified when a new browser window observes this page.

        This means that a new user is now looking at the page, an old
        user has refreshed the page, or an old user has opened a new
        window or tab onto the page.

        This is the first time the ClientHandle instance is available
        for general use by the server. This Page may wish to keep
        track of the ClientHandle instances depending on how your
        application is set up.
        """
        pass

    child_nevow_liveOutput = Output()
    child_nevow_liveInput = Input()
    # child_nevow_glue.js = static.File # see below

    def render_liveid(self, ctx, data):
        return tags.script(type="text/javascript")[
            "var nevow_clientHandleId = '", IClientHandle(ctx).handleId, "';"]

    def render_liveglue(self, ctx, data):
        return tags.script(src=url.here.child('nevow_glue.js'))


setattr(
    LivePage,
    'child_nevow_glue.js',
    static.File(
        os.path.join(os.path.split(__file__)[0], 'liveglue.js'),
        'text/javascript'))


glue = tags.directive('liveid'), tags.directive('liveglue')


