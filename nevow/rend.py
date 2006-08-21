# Copyright (c) 2004 Divmod.
# See LICENSE for details.

"""Page, Fragment and other standard renderers.

This module contains classes and function responsible for rendering
dynamic content and a few useful mixin classes for inheriting common
functionality.

Mostly, you'll use the renderers:

 - B{Page} - Nevow's main resource type for rendering web pages and
   locating child resource.
 - B{Fragment} - useful for rendering more complex parts of a document
   that require a set of data_* and render_* methods.
 - B{sequence} - render each item in a sequence.
 - B{mapping} - publish a dictionary by filling slots
"""

from cStringIO import StringIO
import os.path
import urllib
import warnings
import traceback

from nevow.context import WovenContext, NodeNotFound, PageContext, RequestContext
from nevow import compy
from nevow import inevow
from nevow import tags
from nevow import flat
from nevow.util import log
from nevow import util

import formless
from formless import iformless

from time import time as now
try:
	import random
except ImportError:
	import whrandom as random


class RenderFactory(object):
    __implements__ = inevow.IRendererFactory,

    def renderer(self, context, name):
        """Return a renderer with the given name.
        """

        # The named renderer can be parameterised, i.e. 'renderIt one,two,three'
        args = []
        if name.find(' ') != -1:
            name, args = name.split(None, 1)
            args = [arg.strip() for arg in args.split(',')]
        
        callable = getattr(self, 'render_%s' % name, None)
        if callable is None:
            callable = lambda context, data: context.tag[
                "The renderer named '%s' was not found in %r." % (name, self)]

        if args:
            return callable(*args)

        return callable

    render_sequence = lambda self, context, data: sequence(context, data)
    render_mapping = lambda self, context, data: mapping(context, data)
    render_string = lambda self, context, data: string(context, data)
    render_xml = lambda self, context, data: context.tag.clear()[tags.xml(data)]
    render_data = lambda self, context, data_: data(context, data_)


class MacroFactory(object):
    __implements__ = inevow.IMacroFactory,

    def macro(self, ctx, name):
        """Return a macro with the given name.
        """
        # The named macro can be parameterized, i.e. 'macroFoo foo,bar,baz'
        args = []
        if name.find(' ') != -1:
            name, args = name.split(None, 1)
            args = [arg.strip() for arg in args.split(',')]

        callable = getattr(self, 'macro_%s' % name, None)
        if callable is None:
            callable = lambda ctx, *args: ctx.tag[
                "The macro named '%s' was not found in %r." % (name, self)]

        if args:
            ## Macros are expanded in TagSerializer by calling them with a single arg, the context
            return lambda ctx: callable(ctx, *args)

        return callable


class DataFactory(object):
    __implements__ = inevow.IContainer,

    def child(self, context, n):
        args = []
        if n.find(' ') != -1:
            name, args = n.split(None, 1)
            args = [arg.strip() for arg in args.split(',')]
        else:
            name = n

        callable = getattr(self, 'data_%s' % name, None)
        ## If this page doesn't have an appropriate data_* method...
        if callable is None:
            ## See if our self.original has an IContainer...
            container = inevow.IContainer(self.original, None)
            if container is None:
                util.log.msg("ERROR: The data named '%s' was not found in %r." % (name, self))
                callable = lambda context, data: context.tag["The data named '%s' was not found in %r." % (name, self)]
            else:
                ## And delegate to it if so.
                return container.child(context, n)

        if args:
            return callable(*args)

        return callable


class LiveEvilChildMixin:
    """Mixin that provides the LiveEvil child resources."""
    def child_nevow_liveOutput(self, ctx):
        from nevow import liveevil
        self.child_nevow_liveOutput = liveevil.liveOutput
        return liveevil.liveOutput

    def child_nevow_liveInput(self, ctx):
        from nevow import liveevil
        self.child_nevow_liveInput = liveevil.liveInput
        return liveevil.liveInput


class FreeformChildMixin:
    """Mixin that handles locateChild for freeform segments."""
    def locateChild(self, ctx, segments):
        request = inevow.IRequest(ctx)
        ## The method or property name we are going to validate against/affect
        bindingName = None

        name = segments[0]
        if name.startswith('freeform_post!'):
            configurableName, bindingName = name.split('!')[1:3]
        elif name.startswith('freeform-action-post!'):
            configurableName, request.args['freeform-actee'] = name.split('!')[1:3]
            bindingName = request.args['freeform-action'][0]
        if bindingName:
            ctx.remember(self, inevow.IResource)
            ctx.remember(request, inevow.IRequest)
            cf = iformless.IConfigurableFactory(self)
            def checkC(c):
                if c is not None:
                    return self.webFormPost(request, self, c, ctx, bindingName, request.args)
            return util.maybeDeferred(cf.locateConfigurable, ctx, configurableName).addCallback(checkC)
        return NotFound


class ConfigurableFactory:
    """Locates configurables by looking for methods that start with
    configurable_ and end with the name of the configurable. The method
    should take a single arg (other than self) - the current context.
    """
    __implements__ = iformless.IConfigurableFactory

    def locateConfigurable(self, context, name):
        """formless.webform.renderForms calls locateConfigurable on the IConfigurableFactory
        instance it retrieves from the context. It passes the "name" that was passed to it,
        so if renderForms() was placed in the DOM, locateConfigurable will be called with
        name = ''; if renderForms('foo') was placed in the DOM, locateConfigurable will
        be called with name = 'foo'.

        This default implementation of locateConfigurable looks for a configurable_* method
        corresponding to the name which was passed.
        """
        return util.maybeDeferred(getattr(self, 'configurable_%s'%name),
                                  context).addCallback(iformless.IConfigurable)

    def configurable_(self, context):
        """Configurable factory for use when self is a configurable;
        aka it implements IConfigurable or one or more TypedInterface
        subclasses. Usage:
        
        >>> class IFoo(TypedInterface):
        ...     def bar(self): pass
        ...     bar = autocallable(bar)
        ... 
        >>> class Foo(Page):
        ...     __implements__ = IFoo,
        ... 
        ...     def bar(self):
        ...         print "bar called through the web!"
        ... 
        ...     def render_forms(self, ctx, data):
        ...         return renderForms() # or renderForms('')
        ... 
        ...     docFactory = stan(render_forms).
        """
        return self

    def configurable_original(self, ctx):
        """Configurable factory for use when self.original is a configurable;
        aka it implements IConfigurable or one or more TypedInterface
        subclasses. Usage:


        >>> class Foo(Page):
        ...     def __init__(self):
        ...         self.original = SomeConfigurable()
        ...     def render_forms(self, ctx, data):
        ...         return renderForms('original')
        ...     docFactory = stan(render_forms)
        """
        return self.original

_CARRYOVER = {}


def defaultsFactory(ctx):
    co = _CARRYOVER.get(
        ctx.tag.args.get('_nevow_carryover_', [None])[0], None)
    from formless import webform
    defaults = webform.FormDefaults()
    if co is not None:
        e = iformless.IFormErrors(co, {})
        for k, v in e.items():
            defaults.getAllDefaults(k).update(v.partialForm)
    return defaults


def errorsFactory(ctx):
    co = _CARRYOVER.get(
        ctx.tag.args.get('_nevow_carryover_', [None])[0], None)
    from formless import webform
    errs = webform.FormErrors()
    if co is not None:
        e = iformless.IFormErrors(co, {})
        for k, v in e.items():
            errs.updateErrors(k, v.errors)
            errs.setError(k, v.formErrorMessage)
    return errs


def handFactory(ctx):
    co = _CARRYOVER.get(
        ctx.tag.args.get('_nevow_carryover_', [None])[0], None)
    return inevow.IHand(co, None)


def statusFactory(ctx):
    co = _CARRYOVER.get(
        ctx.tag.args.get('_nevow_carryover_', [None])[0], None)
    return inevow.IStatusMessage(co, None)


def originalFactory(ctx):
    return ctx.tag


class Fragment(DataFactory, RenderFactory, MacroFactory):
    """A fragment is a renderer that can be embedded in a stan document and
    hooks its template (from the docFactory) up to its data_ and render_
    methods, i.e. it remembers itself as the IRendererFactory and IContainer.
    
    Fragment primarily serves as the base for Page, Nevow's web resource, but
    it can be used for more complex rendering. For instance, a fragment might
    be used to encapsulate the rendering of a complex piece of data where the
    template is read from disk and contains standard renderers (sequence,
    mapping etc) and/or custom render methods.
    """
    __implements__ = (
        inevow.IRenderer,
        inevow.IGettable,
        RenderFactory.__implements__,
        DataFactory.__implements__,
        MacroFactory.__implements__)
    
    docFactory = None
    original = None

    def __init__(self, original=None, docFactory=None):
        if original is not None:
            self.original = original
        self.toremember = []
        self._context = None
        if docFactory is not None:
            self.docFactory = docFactory

    def get(self, context):
        return self.original

    def rend(self, context, data):
        self.rememberStuff(context)

        # This tidbit is to enable us to include Page objects inside
        # stan expressions and render_* methods and the like. But
        # because of the way objects can get intertwined, we shouldn't
        # leave the pattern changed.
        old = self.docFactory.pattern
        self.docFactory.pattern = 'content'
        self.docFactory.precompiledDoc = None
        try:
            doc = self.docFactory.load(context)
            self.docFactory.pattern = old
            self.docFactory.precompiledDoc = None
        except NodeNotFound:
            self.docFactory.pattern = old
            self.docFactory.precompiledDoc = None
            doc = self.docFactory.load(context)
        return doc

    def remember(self, obj, inter=None):
        """Remember an object for an interface on new PageContexts which are
        constructed around this Page. Whenever this Page is involved in object
        traversal in the future, all objects will be visible to .locate() calls
        at the level of a PageContext wrapped around this Page and all contexts
        below it.

        This does not affect existing Context instances.
        """
        self.toremember.append((obj, inter))

    def rememberStuff(self, ctx):
        ctx.remember(self, inevow.IRenderer)
        ctx.remember(self, inevow.IRendererFactory)
        ctx.remember(self, inevow.IMacroFactory)
        ctx.remember(self, inevow.IData)


class ChildLookupMixin(FreeformChildMixin, LiveEvilChildMixin):
    ##
    # IResource methods
    ##

    children = None
    def locateChild(self, ctx, segments):
        """Locate a child page of this one. ctx is a
        nevow.context.PageContext representing the parent Page, and segments
        is a tuple of each element in the URI. An tuple (page, segments) should be 
        returned, where page is an instance of nevow.rend.Page and segments a tuple 
        representing the remaining segments of the URI. If the child is not found, return
        NotFound instead.

        locateChild is designed to be easily overridden to perform fancy lookup tricks.
        However, the default locateChild is useful, and looks for children in three places, 
        in this order:

         - in a dictionary, self.children
         - a member of self named child_<childname>. This can be either an
           attribute or a method. If an attribute, it should be an object which
           can be adapted to IResource. If a method, it should take the context
           and return an object which can be adapted to IResource.
         - by calling self.childFactory(ctx, name). Name is a single string instead
           of a tuple of strings. This should return an object that can be adapted 
           to IResource.
        """

        if self.children is not None:
            r = self.children.get(segments[0], None)
            if r is not None:
                return r, segments[1:]

        w = getattr(self, 'child_%s'%segments[0], None)
        if w is not None:
            if inevow.IResource(w, default=None) is not None:
                return w, segments[1:]
            r = w(ctx)
            if r is not None:
                return r, segments[1:]

        r = self.childFactory(ctx, segments[0])
        if r is not None:
            return r, segments[1:]

        return FreeformChildMixin.locateChild(self, ctx, segments)

    def childFactory(self, ctx, name):
        """Used by locateChild to return children which are generated
        dynamically. Note that higher level interfaces use only locateChild,
        and only nevow.rend.Page.locateChild uses this.

        segment is a string represnting one element of the URI. Request is a
        nevow.appserver.NevowRequest.

        The default implementation of this always returns None; it is intended
        to be overridden."""
        rv = self.getDynamicChild(name, ctx)
        if rv is not None:
            warnings.warn("getDynamicChild is deprecated; use childFactory instead.", stacklevel=1)
        return rv

    def getDynamicChild(self, segment, request):
        """Deprecated, use childFactory instead. The name is different and the
        order of the arguments is reversed."""
        return None

    def putChild(self, name, child):
        if self.children is None:
            self.children = {}
        self.children[name] = child
    

class Page(Fragment, ConfigurableFactory, ChildLookupMixin):
    """A page is the main Nevow resource and renders a document loaded
    via the document factory (docFactory).
    """

    __implements__ = Fragment.__implements__, inevow.IResource, ConfigurableFactory.__implements__

    buffered = False

    beforeRender = None
    afterRender = None
    addSlash = None

    flattenFactory = lambda self, *args: flat.flattenFactory(*args)

    def renderHTTP(self, ctx):
        if self.beforeRender is not None:
            return util.maybeDeferred(self.beforeRender,ctx).addCallback(
                    lambda result,ctx: self._renderHTTP(ctx),ctx)
        return self._renderHTTP(ctx)

    def _renderHTTP(self, ctx):
        request = inevow.IRequest(ctx)
        ## XXX request is really ctx now, change the name here
        if self.addSlash and inevow.ICurrentSegments(ctx)[-1] != '':
            request.redirect(request.URLPath().child(''))
            return ''
            
        log.msg(http_render=None, uri=request.uri)

        self.rememberStuff(ctx)

        def finishRequest():
            carryover = request.args.get('_nevow_carryover_', [None])[0]
            if carryover is not None and _CARRYOVER.has_key(carryover):
                del _CARRYOVER[carryover]
            if self.afterRender is not None:
                return util.maybeDeferred(self.afterRender,ctx)

        if self.buffered:
            io = StringIO()
            writer = io.write
            def finisher(result):
                request.write(io.getvalue())
                return util.maybeDeferred(finishRequest).addCallback(lambda r: result)
        else:
            writer = request.write
            def finisher(result):
                return util.maybeDeferred(finishRequest).addCallback(lambda r: result)

        doc = self.docFactory.load(ctx)
        ctx =  WovenContext(ctx, tags.invisible[doc])

        return self.flattenFactory(doc, ctx, writer, finisher)

    def rememberStuff(self, ctx):
        Fragment.rememberStuff(self, ctx)
        ctx.remember(self, inevow.IResource)

    def renderString(self):
        """Render this page outside of the context of a web request, returning
        a Deferred which will result in a string.

        If twisted is not installed, this method will return a string result immediately,
        and this method is equivalent to renderSynchronously.
        """
        io = StringIO()
        writer = io.write

        def finisher(result):
            return io.getvalue()

        ctx = PageContext(tag=self)
        self.rememberStuff(ctx)
        doc = self.docFactory.load(ctx)
        ctx =  WovenContext(ctx, tags.invisible[doc])

        return self.flattenFactory(doc, ctx, writer, finisher)

    def renderSynchronously(self):
        """Render this page synchronously, returning a string result immediately.
        Raise an exception if a Deferred is required to complete the rendering
        process.
        """
        io = StringIO()

        ctx = PageContext(tag=self)
        self.rememberStuff(ctx)
        doc = self.docFactory.load(ctx)
        ctx =  WovenContext(ctx, tags.invisible[doc])

        def raiseAlways(item):
            raise NotImplementedError("renderSynchronously can not support"
                " rendering: %s" % (item, ))

        list(flat.iterflatten(doc, ctx, io.write, raiseAlways))

        return io.getvalue()

    def child_(self, ctx):
        """When addSlash is True, a page rendered at a url with no
        trailing slash and a page rendered at a url with a trailing
        slash will be identical. addSlash is useful for the root
        resource of a site or directory-like resources.
        """
        # Only allow an empty child, by default, if it's on the end
        # and we're a directoryish resource (addSlash = True)
        if self.addSlash and len(inevow.IRemainingSegments(ctx)) == 1:
            return self
        
        # After deprecation is removed, this should return None
        warnings.warn(
            "Allowing an empty child ('/') of resources automatically is "
            "deprecated. If the class '%s' is a directory-index-like resource, "
            "please add addSlash=True to the class definition." %
            (self.__class__), DeprecationWarning, 2)
        
        return self

    def webFormPost(self, request, res, configurable, ctx, bindingName, args):
        def redirectAfterPost(aspects):
            redirectAfterPost = request.getComponent(iformless.IRedirectAfterPost, None)
            if redirectAfterPost is None:
                ref = request.getHeader('referer') or ''
            else:
                ## Use the redirectAfterPost url
                ref = str(redirectAfterPost)
            from nevow import url
            refpath = url.URL.fromString(ref)
            magicCookie = '%s%s%s' % (now(),request.getClientIP(),random.random())
            refpath = refpath.replace('_nevow_carryover_', magicCookie)
            _CARRYOVER[magicCookie] = C = compy.Componentized(aspects)
            request.redirect(str(refpath))
            from nevow import static
            return static.Data('You posted a form to %s' % bindingName, 'text/plain'), ()
        return util.maybeDeferred(
            configurable.postForm, ctx, bindingName, args
        ).addCallback(
            self.onPostSuccess, request, ctx, bindingName, redirectAfterPost
        ).addErrback(
            self.onPostFailure, request, ctx, bindingName, redirectAfterPost
        )

    def onPostSuccess(self, result, request, ctx, bindingName, redirectAfterPost):
        if result is None:
            message = "%s success." % formless.nameToLabel(bindingName)
        else:
            message = result
            
        return redirectAfterPost({inevow.IHand: result, inevow.IStatusMessage: message})

    def onPostFailure(self, reason, request, ctx, bindingName, redirectAfterPost):
        reason.trap(formless.ValidateError)
        return redirectAfterPost({iformless.IFormErrors: {bindingName: reason.value}})


def sequence(context, data):
    """Renders each item in the sequence using patterns found in the
    children of the element.

    Sequence recognises the following patterns:

     - header: Rendered at the start, before the first item. If multiple
       header patterns are provided they are rendered together in the
       order they were defined.
            
     - footer: Just like the header only renderer at the end, after the
       last item.
    
     - item: Rendered once for each item in the sequence. If multiple
       item patterns are provided then the pattern is cycled in the
       order defined.
        
     - divider: Rendered once between each item in the sequence. Multiple
       divider patterns are cycled.

     - empty: Rendered instead of item and divider patterns when the
       sequence contains no items.

    Example::

     <table nevow:render="sequence" nevow:data="peopleSeq">
       <tr nevow:pattern="header">
         <th>name</th>
         <th>email</th>
       </tr>
       <tr nevow:pattern="item" class="odd">
         <td>name goes here</td>
         <td>email goes here</td>
       </tr>
       <tr nevow:pattern="item" class="even">
         <td>name goes here</td>
         <td>email goes here</td>
       </tr>
       <tr nevow:pattern="empty">
         <td colspan="2"><em>they've all gone!</em></td>
       </tr>
     </table>
            
    """
    tag = context.tag
    headers = tag.allPatterns('header')
    pattern = tag.patternGenerator('item')
    divider = tag.patternGenerator('divider', default=tags.invisible)
    content = [(pattern(data=element), divider(data=element)) for element in data]
    if not content:
        content = tag.allPatterns('empty')
    else:
        ## No divider after the last thing.
        content[-1] = content[-1][0]
    footers = tag.allPatterns('footer')
    
    return tag.clear()[ headers, content, footers ]


def mapping(context, data):
    """Fills any slots in the element's children with data from a
    dictionary. The dict keys are used as the slot names, the dict
    values are used as filling.

    Example::

     <tr nevow:render="mapping" nevow:data="personDict">
       <td><nevow:slot name="name"/></td>
       <td><nevow:slot name="email"/></td>
     </tr>
    """
    for k, v in data.items():
        context.fillSlots(k, v)
    return context.tag


def string(context, data):
    return context.tag.clear()[str(data)]
    
    
def data(context, data):
    """Replace the tag's content with the current data.
    """
    return context.tag.clear()[data]


class FourOhFour:
    """A simple 404 (not found) page.
    """
    __implements__ = inevow.IResource,

    notFound = "<html><head><title>Page Not Found</title><head><body>Sorry, but I couldn't find the object you requested.</body></html>"
    original = None

    def locateChild(self, ctx, segments):
        return NotFound

    def renderHTTP(self, ctx):
        from twisted.protocols import http
        inevow.IRequest(ctx).setResponseCode(404)
        try:
            notFoundHandler = ctx.locate(inevow.ICanHandleNotFound)
            return notFoundHandler.renderHTTP_notFound(PageContext(parent=ctx, tag=notFoundHandler))
        except KeyError, e:
            return self.notFound
        except:
            log.err()
            return self.notFound

    def __nonzero__(self):
        return False


# Not found singleton
NotFound = None, ()
