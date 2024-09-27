# Copyright (c) 2004 Divmod.
# See LICENSE for details.

"""Provides a bidirectional channel for sending events between client
and server without refreshing the whole page.
"""

## liveevil

import warnings

warnings.warn("[0.4] nevow.liveevil is deprecated; it has been replaced with nevow.livepage. See the updated examples for new usage.", DeprecationWarning, stacklevel=2)

from twisted.internet import defer
from twisted.internet.task import LoopingCall
from twisted.internet import reactor
from twisted.python import reflect
from twisted.python import log

from nevow import events, tags
from nevow import inevow
from nevow import compy
from nevow import testutil
from nevow import context
from nevow.flat import flatten
from nevow import appserver
from nevow import guard
from nevow import static
from nevow import flat

# If you need to debug liveevil itself or your liveevil app, set this to true
DEBUG = False


def liveEvilFactory(ctx):
    return ILiveEvil(ctx.tag.getSession())


def jquote(jscript):
    return jscript.replace('\\', '\\\\').replace("'", "\\'").replace('\n', '\\n')

def _literalize(args):
    argstr = []
    for a in args:
        if isinstance(a, bool):
            argstr.append(str(a).lower())
        elif isinstance(a, (int, float, _literal)):
            argstr.append(str(a))
        else:
            argstr.append("'%s'" % (flt(a),))
    return argstr


def callJS(func, *args):
    """Return a Javascript string formatted such that the JS function named by the string 'func'
    will be called and the args specified as strings in *args will be quoted properly to prevent JS
    syntax errors.
    """
    return "%s(%s)" % (func, ','.join(_literalize(args)))


class ILiveEvil(compy.Interface):
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


ILivePage = ILiveEvil


class _literal(object):
    """Marker indicating literal JS should be included in a handler argument.
    No escaping will be performed.

    Normally arguments are embedded as strings in the javascript
    nevow_clientToServerEvent function call, and are evaluated in the
    context of this call. This puts the js variable "node" in scope.
    When literal is used, the literal string is inserted at that point in the
    argument list and will be evaluated by the JS interpreter before
    the nevow_clientToServerEvent call. The result will then be passed
    to nevow_clientToServerEvent and evaled again.
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
        return self.__class__(self._name+'['+','.join(_literalize(args))+']')

    def __str__(self):
        return self._name

literal = _literal()
flat.registerFlattener(lambda original, ctx: str(original), _literal)


document = _literal('document')

def flt(stan, quote=True, client=None):
    """Flatten some stan to a string suitable for embedding in a javascript string.

    If quote is True, apostrophe, quote, and newline will be quoted
    """
    fr = testutil.FakeRequest()
    fr.getSession().setComponent(ILiveEvil, client)
    ctx = context.RequestContext(tag=fr)
    ctx.remember(None, inevow.IData)
    fl = flatten(stan, ctx=ctx)
    if quote:
        fl = jquote(fl)
    return fl


class LiveEvil(object):
    """An object which represents the client-side webbrowser.
    """
    __implements__ = ILiveEvil,

    outputConduit = None
    noop = None
    noopStart = None
    def __init__(self, request, credentials):
        request.getSession().setComponent(ILiveEvil, self)
        # TODO set up an event hub
        self.events = events.EventNotification()
        self.outputBuffer = []
        ## This Deferred will fire when self.close() has been called
        ## *and* the client has acknowledged the close
        ## (It has gotten all events up to the close event)
        self.onClosed = defer.Deferred()
        self.closed = False

    def setOutput(self, request, session, output):
        self.closed = False
        self.outputConduit = output
        if self.outputBuffer:
            self.sendScript('\n'.join(self.outputBuffer))
            self.outputBuffer = []
        else:
            self.noop = LoopingCall(self.sendScript, 'null;')
            self.noopStart = reactor.callLater(120, self.noop.start, 120)
            ## Make sure no more noops happen after the session expires
            session.notifyOnExpire(self.cancelNoops)
            request.notifyFinish().addErrback(self.cancelNoops)

    def cancelNoops(self, _=None):
        ## Cancel any noops
        self.noop is not None and self.noop.running and self.noop.stop()
        self.noopStart is not None and self.noopStart.active() and self.noopStart.cancel()
        self.noop = None
        self.noopStart = None
        ## End cancel any noops

    def sendScript(self, script):
        """Send a JavaScript string, 'script', to the browser represented by this mind,
        and evaluate it in the context of the browser window.
        """
        if self.outputConduit:
            self.cancelNoops()
            if DEBUG: print("SENDING SCRIPT", script)
            self.outputConduit.callback(str(script))
            self.outputConduit = None
        else:
            self.outputBuffer.append(script)
            if DEBUG: print("Output buffered!", script)

    def handleInput(self, identifier, *args):
        if identifier == 'close':
            if DEBUG: print("CLIENT ACKED CLOSE")
            ## This happens in a callLater(0) from the original request
            self.onClosed.callback(None)
            self.closed = True
            self.onClosed = defer.Deferred()
        if DEBUG: print("Dispatching event to observer", identifier, args)
        try:
            ## If the identifier provided is the fully-qualified name of a callable,
            ## The function was registered with no closure and we can get to it
            ## easily.
            named = reflect.namedObject(identifier)
            named = getattr(named, 'callit', named)
            try:
                named(self, *args)
            except:
                log.err()
        except (AttributeError, ValueError):
            if DEBUG: print("Observers", self.events._subscribers)
            try:
                self.events.publish(identifier, *(self, ) + args)
            except:
                log.err()

    def close(self):
        if DEBUG: print("CLOSE WAS CALLED")
        self.call('nevow_closeLive')

    ## Here is some api your handlers can use to more easily manipulate the live page
    def flt(self, what, quote=True):
        return flt(what, quote=quote, client=self)

    def set(self, what, to):
        """Set the contents of the node with the id 'what' to the stan 'to'
        """
        if not isinstance(to, _literal):
            to = "'%s'" % (self.flt(to), )
        self.sendScript("nevow_setNode('%s', %s);" % (self.flt(what), to))

    def alert(self, what):
        """Show the user an alert 'what'
        """
        if not isinstance(what, _literal):
            what = "'%s'" % (self.flt(what), )
        self.sendScript("alert(%s);" % (what, ))

    def append(self, where, what):
        """Append the stan 'what' to the node with the id 'where'
        """
        # client.append('foo', literal("document.getNodeByID('bar')"))
        if not isinstance(what, _literal):
            what = "'%s'" % (self.flt(what), )
        self.sendScript(
            "nevow_appendNode('%s', %s);" % (self.flt(where), what))

    def call(self, func, *args):
        """Call the javascript function named 'func' with the arguments given.
        """
        self.sendScript(callJS(func, *args) + ';')
LivePage = LiveEvil

#client.call('add', 1, 2)

#add(1,2)
#add('1', '2')
class Output(object):
    __implements__ = inevow.IResource,

    def renderHTTP(self, ctx):
        request = inevow.IRequest(ctx)
        ## Make sure twisted.protocols.http doesn't leave crappy
        ## DelayedCalls around, because we manage timeouts of
        ## the output object
        request.channel._savedTimeOut = None
        request.setHeader("Cache-Control", "no-cache")
        request.setHeader("Pragma", "no-cache")
        if DEBUG: print("OUTPUT RENDER", request.uri, request)

        session = request.getSession()
        mind = session.getComponent(ILiveEvil)
        d = defer.Deferred()
        mind.setOutput(request, session, d)
        return d


liveOutput = Output()


class Input(object):
    __implements__ = inevow.IResource,

    def renderHTTP(self, ctx):
        request = inevow.IRequest(ctx)
        request.setHeader("Cache-Control", "no-cache")
        request.setHeader("Pragma", "no-cache")
        mind = request.getSession().getComponent(ILiveEvil)
        reactor.callLater(0.00000001, mind.handleInput, request.args['target'][0], *request.args.get('arguments',()))
        return "<html><body>done</body></html>"


liveInput = Input()


def _locateGlueJS():
    """Calculate and return the full path to the liveevil glue JavaScript.
    """
    import os.path
    dirname = os.path.abspath(os.path.dirname(__file__))
    return os.path.join(dirname, 'liveevil.js')


try:
    _glueJS = _locateGlueJS()

    # A static.File resource that can be used from a <link>
    glueJS = static.File(_glueJS, 'text/javascript')

    # Inline JavaScript glue. TODO: deprecate this.
    glue = tags.inlineJS(open(_glueJS).read())

    # Glue which tells livepage to only allow clientToServer events, not async serverToClient events
    inputOnlyGlue = tags.inlineJS("var auto_open = false; var liveevil_unload = true;\n" + ''.join(open(_glueJS).readlines()[1:]))
except EnvironmentError:
    glueJS = inputOnlyGlue = glue = None
    warnings.warn("Could not open liveevil.js")


ctsTemplate = "nevow_clientToServerEvent('%s',this%s);%s"
handledEventPostlude = ' return false;'


class strWithCallit(str):
    pass


def handler(*args, **kw):
    """Take a python callable and return a renderer of javascript which will invoke the Python
    callable on the server side. Normal usage is to put this in a javascript event handler,
    such as:

    >>> def render_live(ctx, data):
    ...     def clicked(client): client.alert("Clicked!")
    ... 
    ...     return a(onclick=handler(clicked))["Click me"]

    Any additional arguments which are passed to handler are assumed to be strings of
    javascript. These strings will be evaluated in the context of the client-side event,
    and the results will be sent as strings to the python callable. For example:

    >>> def render_yourName(ctx, data):
    ...     def entered(client, name): client.alert(["You entered: ", name])
    ... 
    ...     return input(type="text", onchange=handler(entered, "node.value"))

    Note that the node upon which the event is occuring will generally be bound to the
    name "this" in the javascript context.

    The javascript string emitted by the renderer will have "return false;" appended to
    prevent the "normal" action from the javascript handler from triggering. If you wish
    for the event to be sent to both the server and the normal browser handler, pass
    C{bubble=True} as a keyword argument to handler.

    The javascript string emitted by the renderer will have quoted " and & in preparation
    for insertion into a javascript handler inside a javascript attribute. If you wish to
    use the JavaScript emitted by the renderer outside a node attribute, pass:
    C{outsideAttribute=True} as a keyword argument to handler.

    C{handler} can also be used as a Python 2.4 decorator. If the first argument to handler
    is not a callable, the rest of the arguments will be partially applied (to the right) and
    a one-argument function will be returned, which can be used as a decorator. For
    example, both of the following are possible:

    >>> @handler
    ... def foo(client): pass

    >>> @handler(document.getElementById('one').value)
    ... def foo(client, value): pass
    """
    ## Handle working like a 2.4 decorator where calling handler returns a decorator
    if not callable(args[0]) or isinstance(args[0], _literal):
        return lambda callit: handler(callit, *args, **kw)

    callit = args[0]
    args = args[1:]

    bubble = kw.get('bubble')
    if bubble:
        postlude = ''
    else:
        postlude = handledEventPostlude

    if args:
        argstr = ',' + ','.join(_literalize(args))
        if kw.get('outsideAttribute'):
            ## Literalize calls flt which replaces & with &amp;
            argstr = argstr.replace('&amp;', '&')
        else:
            argstr = argstr.replace('"', '&quot;')
    else:
        argstr = ''

    if 'identifier' in kw:
        identifier = kw['identifier']
    else:
        if callit.__closure__ or (hasattr(callit, 'im_self') and callit.__self__ is not None):
            identifier = None
        else:
            identifier = reflect.qual(callit)
            rv = strWithCallit(ctsTemplate % (identifier, argstr, postlude))
            rv.callit = callit
            return rv

    def block(context, data):
        client = ILivePage(context)
        if identifier is None:
            iden = client.events.nextId()
        else:
            iden = identifier
        client.events.subscribe(iden, callit)
        return ctsTemplate % (iden, argstr, postlude )

    block.callit = callit
    return block

#handler(func, 'document.title', '"hello"')

#nevow_clientToServerEvent('wayToGetToFunc', hello, "hello")
#nevow_clientToServerEvent('wayToGetToFunc', document.title, "hello")

from twisted.cred import portal, checkers, credentials


class SimpleRealm(object):
    __implements__ = portal.IRealm,

    def __init__(self, resource):
        self.resource = resource

    def requestAvatar(self, avatarId, mind, *interfaces):
        if inevow.IResource in interfaces:
            return inevow.IResource, self.resource, lambda: None
        raise NotImplementedError("Can't support that interface")


class LiveSite(appserver.NevowSite):
    """A Site subclass which makes deploying a LivePage easier.
    Instead of having to create a realm and return your Page from
    requestAvatar, simply construct a LiveSite and pass it a Page.
    LiveSite will take care of all the cred details for you, including
    creating a realm and wrapping it in a SessionWrapper.
    """
    def __init__(self, page, *args, **kw):
        appserver.NevowSite.__init__(
            self,
            guard.SessionWrapper(
                portal.Portal(SimpleRealm(page), [checkers.AllowAnonymousAccess()]),
                mindFactory=LiveEvil),
            *args, **kw)
