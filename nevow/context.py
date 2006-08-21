# -*- test-case-name: nevow.test.test_context -*-
# Copyright (c) 2004 Divmod.
# See LICENSE for details.

from __future__ import generators

import warnings

from nevow import compy, stan
from nevow.inevow import IData, IRequest
from nevow.stan import Unset
from nevow.util import qual

# TTT: Move to web2.context

def megaGetInterfaces(adapter):
    adrs = [qual(x) for x in compy.getInterfaces(adapter)]
    ## temporarily turn this off till we need it
    if False: #hasattr(adapter, '_adapterCache'):
        adrs.extend(adapter._adapterCache.keys())
    return adrs


dataqual = qual(IData)

class WebContext(object):
    _remembrances = None
    tag = None
    _slotData = None
    parent = None
    locateHook = None

    # XXX: can we get rid of these 4 somehow?
    isAttrib = property(lambda self: False)
    inURL = property(lambda self: False)
    precompile = property(lambda self: False)
    def with(self, tag):
        warnings.warn("use WovenContext(parent, tag) instead", DeprecationWarning, stacklevel=2)
        return WovenContext(self, tag)

    def arg(self, get, default=None):
        """Placeholder until I can find Jerub's implementation of this

        Return a single named argument from the request arguments
        """
        req = self.locate(IRequest)
        return req.args.get(get, [default])[0]

    def __init__(self, parent=None, tag=None, remembrances=None):
        self.tag = tag
        sd = getattr(tag, 'slotData', None)
        if sd is not None:
            self._slotData = sd
        self.parent = parent
        self._remembrances = remembrances

    def remember(self, adapter, interface=None):
        """Remember an object that implements some interfaces.
        Later, calls to .locate which are passed an interface implemented
        by this object will return this object.

        If the 'interface' argument is supplied, this object will only
        be remembered for this interface, and not any of
        the other interfaces it implements.
        """
        if interface is None:
            interfaceList = megaGetInterfaces(adapter)
            if not interfaceList:
                interfaceList = [dataqual]
        else:
            interfaceList = [qual(interface)]
        if self._remembrances is None:
            self._remembrances = {}
        for interface in interfaceList:
            self._remembrances[interface] = adapter
        return self

    def locate(self, interface, depth=1, _default=object()):
        """Locate an object which implements a given interface.
        Objects will be searched through the context stack top
        down.
        """
        key = qual(interface)
        currentContext = self
        while True:
            if depth < 0:
                full = []
                while True:
                    try:
                        full.append(self.locate(interface, len(full)+1))
                    except KeyError:
                        break
                #print "full", full, depth
                if full:
                    return full[depth]
                return None

            _remembrances = currentContext._remembrances
            if _remembrances is not None:
                rememberedValue = _remembrances.get(key, _default)
                if rememberedValue is not _default:
                    depth -= 1
                    if not depth:
                        return rememberedValue

            # Hook for FactoryContext and other implementations of complex locating
            locateHook = currentContext.locateHook
            if locateHook is not None:
                result = locateHook(interface)
                if result is not None:
                    return result

            contextParent = currentContext.parent
            if contextParent is None:
                raise KeyError, "Interface %s was not remembered." % key

            currentContext = contextParent

    def chain(self, context):
        """For nevow machinery use only.

        Go to the top of this context's context chain, and make
        the given context the parent, thus continuing the chain
        into the given context's chain.
        """
        top = self
        while top.parent is not None:
            if top.parent.tag is None:
                ## If top.parent.tag is None, that means this context (top)
                ## is just a marker. We want to insert the current context
                ## (context) as the parent of this context (top) to chain properly.
                break
            top = top.parent
            if top is context: # this context is already in the chain; don't create a cycle
                return
        top.parent = context

    def fillSlots(self, name, stan):
        """Set 'stan' as the stan tree to replace all slots with name 'name'.
        """
        if self._slotData is None:
            self._slotData = {}
        self._slotData[name] = stan

    def locateSlotData(self, name):
        """For use by nevow machinery only, or for some fancy cases.

        Find previously remembered slot filler data.
        For use by flatstan.SlotRenderer"""
        currentContext = self
        while True:
            if currentContext._slotData:
                data = currentContext._slotData.get(name, Unset)
                if data is not Unset:
                    return data
            if currentContext.parent is None:
                raise KeyError, "Slot named '%s' was not filled." % name
            currentContext = currentContext.parent

    def clone(self, deep=True, cloneTags=True):
        ## don't clone the tags of parent contexts. I *hope* code won't be
        ## trying to modify parent tags so this should not be necessary.
        ## However, *do* clone the parent contexts themselves.
        ## This is necessary for chain(), as it mutates top-context.parent.

        if self.parent:
            parent=self.parent.clone(cloneTags=False)
        else:
            parent=None
        if cloneTags:
            tag = self.tag.clone(deep=deep)
        else:
            tag = self.tag
        if self._remembrances is not None:
            remembrances=self._remembrances.copy()
        else:
            remembrances=None
        return type(self)(
            parent = parent,
            tag = tag,
            remembrances=remembrances,
        )

    def getComponent(self, interface, registry=None, default=None):
        """Support IFoo(ctx) syntax.
        """
        try:
            return self.locate(interface)
        except KeyError:
            return default

    def __repr__(self):
        rstr = ''
        if self._remembrances:
            rstr = ', remembrances=%r' % self._remembrances
        return "%s(tag=%r%s)" % (self.__class__.__name__, self.tag, rstr)

class FactoryContext(WebContext):
    """A context which allows adapters to be registered against it so that an object
    can be lazily created and returned at render time. When ctx.locate is called
    with an interface for which an adapter is registered, that adapter will be used
    and the result returned.
    """
    cache = None
    def locateHook(self, interface):
        if self.cache is None:
            self.cache = {}
        else:
            adapter = self.cache.get(interface, None)
            if adapter is not None:
                return adapter

        ## Prevent infinite recursion from interface(self) calling self.getComponent calling self.locate
        ## Shadow the class getComponent
        def shadow(interface, registry=None, default=None):
            if registry:
                return registry.getAdapter(self, interface, default)
            return default
        self.getComponent = shadow
        adapter = interface(self, None)
        ## Remove shadowing
        if getattr(self, 'getComponent', None) is shadow:
            del self.getComponent

        if adapter is not None:
            self.cache[interface] = adapter
            return adapter
        return None


class SiteContext(FactoryContext):
    """A SiteContext is created and installed on a NevowSite upon initialization.
    It will always be used as the root context, and can be used as a place to remember
    things sitewide.
    """
    pass


class RequestContext(FactoryContext):
    """A RequestContext has adapters for the following interfaces:

    ISession
    IFormDefaults
    IFormErrors
    IHand
    IStatusMessage
    """
    pass

def getRequestContext(self):
    top = self.parent
    while not isinstance(top, RequestContext):
        top = top.parent
    return top

class PageContext(FactoryContext):
    """A PageContext has adapters for the following interfaces:

    IRenderer
    IRendererFactory
    IData
    """

    def __init__(self, *args, **kw):
        FactoryContext.__init__(self, *args, **kw)
        if self.tag is not None and hasattr(self.tag, 'toremember'):
            for i in self.tag.toremember:
                self.remember(*i)

# TTT: To stay here.
NodeNotFound = stan.NodeNotFound # XXX: DeprecationWarning?
TooManyNodes = stan.TooManyNodes # XXX: DeprecationWarning?

class WovenContext(WebContext):
    key = None
    isAttrib = False
    inURL = False
    precompile = False

    def __init__(self, parent=None, tag=None, precompile=None, remembrances=None, key=None, isAttrib=None, inURL=None):
        WebContext.__init__(self, parent, tag, remembrances)
        if self.parent:
            self.precompile = parent.precompile
            self.isAttrib = parent.isAttrib
            self.inURL = parent.inURL

        if self.tag is not None:
            if self.tag.remember is not Unset:
                self.remember(tag.remember)
            if key is None:
                key = self.tag.key

        if key is not None and key is not Unset:
            if self.parent is not None and getattr(self.parent, 'key', None):
                self.key = '.'.join((self.parent.key, key))
            else:
                self.key = key
            #print "KEY", `self.key`
        else:
            ## Bubble the value down to the bottom so it's always immediately accessible
            if self.parent is not None:
                self.key = getattr(self.parent, 'key', '')

        if precompile is not None: self.precompile = precompile
        if isAttrib is not None: self.isAttrib = isAttrib
        if inURL is not None: self.inURL = inURL

    def __repr__(self):
        rstr = ''
        if self._remembrances:
            rstr = ', remembrances=%r' % self._remembrances
        attribstr=''
        if self.isAttrib:
            attribstr=", isAttrib=True"
        urlStr = ''
        if self.inURL:
            urlStr = ', inURL=True'
        return "%s(tag=%r%s%s%s)" % (self.__class__.__name__, self.tag, rstr,attribstr,urlStr)

    def patternGenerator(self, pattern, default=None):
        warnings.warn("use Tag.patternGenerator instead", DeprecationWarning, stacklevel=2)
        return self.tag.patternGenerator(pattern, default)

    def allPatterns(self, pattern):
        warnings.warn("use Tag.allPatterns instead", DeprecationWarning, stacklevel=2)
        return self.tag.allPatterns(pattern)

    def onePattern(self, pattern):
        warnings.warn("use Tag.onePattern instead", DeprecationWarning, stacklevel=2)
        return self.tag.onePattern(pattern)

    def clone(self, deep=True, cloneTags=True):
        cloned = WebContext.clone(self, deep, cloneTags)
        cloned.isAttrib = self.isAttrib
        cloned.inURL = self.inURL
        return cloned


requestWarning = (
    "All inevow.IResource APIs now take a Context object instead of the Request; "
    "Please adapt the context to IRequest before attempting to access attributes of "
    "the request.")


def getFromRequest(name):
    def get(self):
        warnings.warn(requestWarning, stacklevel=2)
        return getattr(self.locate(IRequest), name)
    return property(get)


def setOnRequest(name):
    def get(self):
        warnings.warn(requestWarning, stacklevel=2)
        return getattr(self.locate(IRequest), name)

    def set(self, new):
        warnings.warn(requestWarning, stacklevel=2)
        setattr(self.locate(IRequest), name, new)

    return property(get, set)


toSetOnRequest = ['args', 'content', 'fields', 'isSecure', 'method', 'path', 'postpath', 'prepath', 'receieved_headers', 'setupSession', 'session', 'uri']


for x in toSetOnRequest:
    setattr(PageContext, x, setOnRequest(x))


toGetFromRequest = ['URLPath',
 'addCookie',
 'appRootURL',
 'channel',
 'childLink',
 'chunked',
 'client',
 'clientproto',
 'code',
 'code_message',
 'connectionLost',
 'cookies',
 'etag',
 'finish',
 'finished',
 'getAllHeaders',
 'getClient',
 'getClientIP',
 'getCookie',
 'getHeader',
 'getHost',
 'getPassword',
 'getRequestHostname',
 'getRootURL',
 'getSession',
 'getUser',
 'gotLength',
 'handleContentChunk',
 'headers',
 'host',
 'isSecure',
 'lastModified',
 'noLongerQueued',
 'notifications',
 'notifyFinish',
 'parseCookies',
 'path',
 'prePathURL',
 'processingFailed',
 'producer',
 'queued',
 'received_cookies',
 'redirect',
 'registerProducer',
 'rememberRootURL',
 'removeComponent',
 'sentLength',
 'setAdapter',
 'setComponent',
 'setETag',
 'setHeader',
 'setHost',
 'setLastModified',
 'setResponseCode',
 'sibLink',
 'site',
 'stack',
 'startedWriting',
 'transport',
 'unregisterProducer',
 'unsetComponent',
 'uri',
 'write']


for x in toGetFromRequest:
    setattr(PageContext, x, getFromRequest(x))
