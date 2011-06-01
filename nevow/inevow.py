# Copyright (c) 2004 Divmod.
# See LICENSE for details.


"""Nevow interface definitions.
"""


from nevow import compy


class IQ(compy.Interface):
    """Interface for querying. Adapters implement this for objects which may
    appear in the stan DOM to allow introspecting the DOM and finding nodes
    with certain qualities.
    """
    def patternGenerator(self, pattern, default=None):
        """Returns a pseudo-Tag which will generate clones of matching
        pattern tags forever, looping around to the beginning when running
        out of unique matches.
        
        If no matches are found, and default is None, raise an exception,
        otherwise, generate clones of default forever.

        You can use the normal stan syntax on the return value.
        
        Useful to find repeating pattern elements. Example rendering
        function:

        >>> def simpleSequence(context, data):
        ...   pattern = IQ(context).patternGenerator('item')
        ...   return [pattern(data=element) for element in data]
        """

    def allPatterns(self, pattern):
        """Return a list of all matching pattern tags, cloned.
        
        Useful if you just want to insert them in the output in one
        place.
        
        E.g. the sequence renderer's header and footer are found with this.
        """

    def onePattern(self, pattern):
        """Return a single matching pattern, cloned.
        If there is more than one matching pattern or no matching patterns,
        raise an exception.

        Useful in the case where you want to locate one and only one
        sub-tag and do something with it.
        """

    def keyed(self, key):
        """Locate the node with the key 'key', clone it, call fillSlots(key, clone)
        and return the clone.

        This method lets you effectively locate and mutate a node in the DOM.
        It is useful for setting the data special on a specific node, and also for
        calling fillSlots on a specific node, as well as other node-mutation operations
        such as setting a handler or assigning a class or id to a node.
        """


class IResource(compy.Interface):
    def locateChild(self, ctx, segments):
        """Locate another object which can be adapted to IResource
        Return a tuple of resource, path segments
        """

    def renderHTTP(self, ctx):
        """Render a request
        """


class IRenderer(compy.Interface):
    """Things implementing this interface are serialized by calling their
    'rend' method.
    """
    def rend(self, ctx, data):
        """Turn this instance into stan suitable for displaying it in a web page.
        """


class IRendererFactory(compy.Interface):
    """A renderer factory is capable of taking a renderer directive (a string)
    and returning a callable which when called, will render a portion of DOM.
    """
    def renderer(self, context, name):
        """Given a context object and a name, return a callable which responds
        to the signature (context, data) or (data) and returns an object which
        is flattenable.
        """


class IMacroFactory(compy.Interface):
    """A macro factory is capable of taking a macro directive (a string)
    and returning a callable which when called, will replace the portion
    of the DOM upon which the macro was placed with some different
    DOM.
    """
    def macro(self, context, name):
        """Given a context object and a name, return a callable which responds
        to the signature (context, *parameters) and returns an object which
        is flattenable.
        """


class IData(compy.Interface):
    """Any python object to be used as model data to be passed
    to view functions. Used for marking the context stack only.
    
    ANY python object is said to implement IData.
    """


class IGettable(compy.Interface):
    def get(self, context):
        """Return the data
        
        Return any object
        """


class ISettable(compy.Interface):
    def set(self, context, data):
        """Set the data

        This might be removed.
        """


class IContainer(compy.Interface):
    def child(self, context, name):
        """Return a conceptual child; an attribute, or a key,
        or the result of a function call.
    
        Returns any object; the result may be adapted to IGettable
        if possible.
        
        Return None if the adaptee does not have a child with the
        given name.
        
        TODO: Maybe returning None is bad, and .child should just
        raise whatever exception is natural
        """

class IComponentized(compy.Interface):
    """I am a mixin to allow you to be adapted in various ways persistently.

    I define a list of persistent adapters.  This is to allow adapter classes
    to store system-specific state, and initialized on demand.  The
    getComponent method implements this.  You must also register adapters for
    this class for the interfaces that you wish to pass to getComponent.

    Many other classes and utilities listed here are present in Zope3; this one
    is specific to Twisted.
    """

    def setComponent(self):
        """
        Add a component to me, for all appropriate interfaces.
        """
    
    def addComponent(self, component, ignoreClass=0, registry=None):
        """
        Add a component to me, for all appropriate interfaces.

        In order to determine which interfaces are appropriate, the component's
        provided interfaces will be scanned.

        If the argument 'ignoreClass' is True, then all interfaces are
        considered appropriate.

        Otherwise, an 'appropriate' interface is one for which its class has
        been registered as an adapter for my class according to the rules of
        getComponent.

        @return: the list of appropriate interfaces
        """

    def getComponent(self, interface, registry=None, default=None):
        """Create or retrieve an adapter for the given interface.

        If such an adapter has already been created, retrieve it from the cache
        that this instance keeps of all its adapters.  Adapters created through
        this mechanism may safely store system-specific state.

        If you want to register an adapter that will be created through
        getComponent, but you don't require (or don't want) your adapter to be
        cached and kept alive for the lifetime of this Componentized object,
        set the attribute 'temporaryAdapter' to True on your adapter class.

        If you want to automatically register an adapter for all appropriate
        interfaces (with addComponent), set the attribute 'multiComponent' to
        True on your adapter class.
        """
        
    def unsetComponent(self, interfaceClass):
        """Remove my component specified by the given interface class."""

    def removeComponent(self, component):
        """
        Remove the given component from me entirely, for all interfaces for which
        it has been registered.

        @return: a list of the interfaces that were removed.
        """        

class ISession(IComponentized):
    """A web session

    You can locate a Session object to represent a unique web session using
    ISession(ctx). This default session implementation uses cookies to
    store a session identifier in the user's browser. 

    uid: Session uid

    TODO: Need better docs; what's a session and why and how do you use it
    """

    def setLifetime(self, lifetime):
        """Set the approximate lifetime of this session, in seconds.

        This is highly imprecise, but it allows you to set some general
        parameters about when this session will expire.  A callback will be
        scheduled each 'lifetime' seconds, and if I have not been 'touch()'ed
        in half a lifetime, I will be immediately expired.
        
        If you need to change the lifetime of all the sessions change sessionsLifeTime
        attribute in class guard.SessionWrapper
        """

    def notifyOnExpire(self, callback):
        """Call this callback when the session expires or logs out.
        """

    def expire(self):
        """Expire/logout of the session.
        """

    def touch(self):
        """Refresh the session
        """

class IGuardSession(ISession):
    """ A web session base interface
    Needed for guard to do its dirty job

    guard: SessionWrapper object
    """
    def portalLogout(self, port):
        """Logout from portal port
        """

class IRequest(IComponentized):
    """A HTTP request.

    Subclasses should override the process() method to determine how
    the request will be processed.
    
    @ivar method: The HTTP method that was used.
    @ivar uri: The full URI that was requested (includes arguments).
    @ivar path: The path only (arguments not included).
    @ivar args: All of the arguments, including URL and POST arguments.
    @type args: A mapping of strings (the argument names) to lists of values.
                i.e., ?foo=bar&foo=baz&quux=spam results in
                {'foo': ['bar', 'baz'], 'quux': ['spam']}.
    @ivar received_headers: All received headers
    """
    # Methods for received request
    def getHeader(self, key):
        """Get a header that was sent from the network.
        """
        
    def getCookie(self, key):
        """Get a cookie that was sent from the network.
        """    


    def getAllHeaders(self):
        """Return dictionary of all headers the request received."""

    def getRequestHostname(self):
        """Get the hostname that the user passed in to the request.

        This will either use the Host: header (if it is available) or the
        host we are listening on if the header is unavailable.
        """

    def getHost(self):
        """Get my originally requesting transport's host.

        Don't rely on the 'transport' attribute, since Request objects may be
        copied remotely.  For information on this method's return value, see
        twisted.internet.tcp.Port.
        """
        
    def getClientIP(self):
        pass
    def getClient(self):
        pass
    def getUser(self):
        pass
    def getPassword(self):
        pass
    def isSecure(self):
        pass

    def getSession(self, sessionInterface = None):
        pass
    
    def URLPath(self):
        pass

    def prePathURL(self):
        pass

    def rememberRootURL(self):
        """
        Remember the currently-processed part of the URL for later
        recalling.
        """
        
    def getRootURL(self):
        """
        Get a previously-remembered URL.
        """
        
    # Methods for outgoing request
    def finish(self):
        """We are finished writing data."""

    def write(self, data):
        """
        Write some data as a result of an HTTP request.  The first
        time this is called, it writes out response data.
        """

    def addCookie(self, k, v, expires=None, domain=None, path=None, max_age=None, comment=None, secure=None):
        """Set an outgoing HTTP cookie.

        In general, you should consider using sessions instead of cookies, see
        twisted.web.server.Request.getSession and the
        twisted.web.server.Session class for details.
        """

    def setResponseCode(self, code, message=None):
        """Set the HTTP response code.
        """

    def setHeader(self, k, v):
        """Set an outgoing HTTP header.
        """

    def redirect(self, url):
        """Utility function that does a redirect.

        The request should have finish() called after this.
        """

    def setLastModified(self, when):
        """Set the X{Last-Modified} time for the response to this request.

        If I am called more than once, I ignore attempts to set
        Last-Modified earlier, only replacing the Last-Modified time
        if it is to a later value.

        If I am a conditional request, I may modify my response code
        to L{NOT_MODIFIED} if appropriate for the time given.

        @param when: The last time the resource being returned was
            modified, in seconds since the epoch.
        @type when: number
        @return: If I am a X{If-Modified-Since} conditional request and
            the time given is not newer than the condition, I return
            L{http.CACHED<CACHED>} to indicate that you should write no
            body.  Otherwise, I return a false value.
        """

    def setETag(self, etag):
        """Set an X{entity tag} for the outgoing response.

        That's \"entity tag\" as in the HTTP/1.1 X{ETag} header, \"used
        for comparing two or more entities from the same requested
        resource.\"

        If I am a conditional request, I may modify my response code
        to L{NOT_MODIFIED<twisted.protocols.http.NOT_MODIFIED>} or
        L{PRECONDITION_FAILED<twisted.protocols.http.PRECONDITION_FAILED>},
        if appropriate for the tag given.

        @param etag: The entity tag for the resource being returned.
        @type etag: string
        @return: If I am a X{If-None-Match} conditional request and
            the tag matches one in the request, I return
            L{CACHED<twisted.protocols.http.CACHED>} to indicate that
            you should write no body.  Otherwise, I return a false
            value.
        """

    def setHost(self, host, port, ssl=0):
        """Change the host and port the request thinks it's using.

        This method is useful for working with reverse HTTP proxies (e.g.
        both Squid and Apache's mod_proxy can do this), when the address
        the HTTP client is using is different than the one we're listening on.

        For example, Apache may be listening on https://www.example.com, and then
        forwarding requests to http://localhost:8080, but we don't want HTML produced
        by Twisted to say 'http://localhost:8080', they should say 'https://www.example.com',
        so we do:

        >>> request.setHost('www.example.com', 443, ssl=1)

        This method is experimental.
        """

class ISerializable(compy.Interface):
    """DEPRECATED. Use nevow.flat.registerFlattener instead of registering
    an ISerializable adapter.
    """
    def serialize(self, context):
        """Serialize the adaptee, with the given context
        stack if necessary.
        """

class IStatusMessage(compy.Interface):
    """A marker interface, which should be set on the user's web session
    to an object which can be cast to a string, which will be shown to the
    user to indicate the status of the most recent operation.
    """


class IHand(compy.Interface):
    """A marker interface which indicates what object the user is currently
    holding in their hand. This is conceptually the "result" of the last operation;
    this interface can be used to mark a status string which indicates whether
    the most recent operation completed successfully, or can be used to hold
    an object which resulted from the most recent operation.
    """


class ICanHandleException(compy.Interface):
    def renderHTTP_exception(self, request, failure):
        """Render an exception to the given request object.
        """

    def renderInlineException(self, context, reason):
        """Return stan representing the exception, to be printed in the page,
        not replacing the page."""


class ICanHandleNotFound(compy.Interface):
    def renderHTTP_notFound(self, request):
        """Render a not found message to the given request.
        """


class IEventMaster(compy.Interface):
    pass


class IDocFactory(compy.Interface):
    """Interface for objects that load and parse templates for Nevow's
    renderers.
    
    The load method's context arg is optional. Loaders should be written to cope
    with no context arg and either create a new context (if necessary) or raise
    a ValueError if the context of the caller is important.
    
    If a context is passed to load() it should *not* be passed on to the
    flattener/precompiler; a new context should be created if necessary. This
    measure is to ensure that nothing remembered in the caller's context, i.e.
    personal information in the session, leaks into the template until it is
    actually rendered.
    """
    
    def load(self, ctx=None):
        """Load a template and return a stan document tree.
        """


class ISession(compy.Interface):
    """A web session

    You can locate a Session object to represent a unique web session using
    ctx.locate(ISession). This default session implementation uses cookies to
    store a session identifier in the user's browser. 
    
    TODO: Need better docs; what's a session and why and how do you use it
    """


class IRemainingSegments(compy.Interface):
    """During the URL traversal process, requesting this from the context
    will result in a tuple of the segments remaining to be processed.
    
    Equivalent to request.postpath in twisted.web
    """


class ICurrentSegments(compy.Interface):
    """Requesting this from the context will result in a tuple of path segments
    which have been consumed to reach the current Page instance during
    the URL traversal process.

    Equivalent to request.prepath in twisted.web
    """


class IViewParameters(compy.Interface):
    """An interface used by url.viewhere. When this interface is remembered
    above a url.viewhere embedded in a page, and the url to the current page
    is rendered, this object will be consulted for additional manipulations
    to perform on the url object before returning it.
    """
    def __iter__(self):
        """Return an iterator which yields a series of (command, args, kw) triples, 
        where 'command' is a string, indicating which url method to call, 'args' is a 
        list indicating the arguments to be passed to this method, and 'kw' is a dict 
        of keyword arguments to pass to this method.
        """

class II18NConfig(compy.Interface):
    """
    Interface for I18N configuration.

    @ivar domain: the gettext domain

    @type domain: str

    @ivar localeDir: path to the messages files or None to use the
    system default

    @type localeDir: str or None
    """
    domain = None
    localeDir = None

        
class ILanguages(compy.Interface):
    """
    Marker interface for the sequence of strings that defines the
    languages requested by the user.
    """
    
