# Copyright (c) 2004 Divmod.
# See LICENSE for details.

from __future__ import generators
from types import StringTypes
import types
import warnings

from nevow import util
from nevow.stan import Proto, Tag, xml, directive, Unset, invisible
from nevow.inevow import IRenderer, IRendererFactory, IGettable, IData, IMacroFactory
from nevow.flat import precompile, serialize
from nevow.accessors import convertToData
from nevow.context import WovenContext

allowSingleton = ('img', 'br', 'hr', 'base', 'meta', 'link', 'param', 'area',
                  'input', 'col', 'basefont', 'isindex', 'frame')


def ProtoSerializer(original, context):
    return '<%s />' % original


def _datacallback(result, context):
    context.remember(result, IData)
    return ''


def TagSerializer(original, context, contextIsMine=False):
    """
    Original is the tag.
    Context is either:
      - the context of someone up the chain (if contextIsMine is False)
      - this tag's context (if contextIsMine is True)
    """
#    print "TagSerializer:",original, "ContextIsMine",contextIsMine, "Context:",context
    visible = bool(original.tagName)
    
    if visible and context.isAttrib:
        raise RuntimeError, "Tried to render tag '%s' in an tag attribute context." % (original.tagName)

    if context.precompile and original.macro:
        toBeRenderedBy = original.macro
        ## Special case for directive; perhaps this could be handled some other way with an interface?
        if isinstance(toBeRenderedBy, directive):
            toBeRenderedBy = IMacroFactory(context).macro(context, toBeRenderedBy.name)
        original.macro = Unset
        newContext = WovenContext(context, original)
        yield serialize(toBeRenderedBy(newContext), newContext)
        return

    ## TODO: Do we really need to bypass precompiling for *all* specials?
    ## Perhaps just render?
    if context.precompile and (
        [x for x in original._specials.values() 
        if x is not None and x is not Unset]
        or original.slotData):
        ## The tags inside this one get a "fresh" parent chain, because
        ## when the context yielded here is serialized, the parent
        ## chain gets reconnected to the actual parents at that
        ## point, since the render function here could change
        ## the actual parentage hierarchy.
        nestedcontext = WovenContext(precompile=context.precompile, isAttrib=context.isAttrib)
        
        original = original.clone(deep=False)
        if not contextIsMine:
            context = WovenContext(context, original)
        context.tag.children = precompile(context.tag.children, nestedcontext)

        yield context
        return

    ## Don't render patterns
    if original.pattern is not Unset and original.pattern is not None:
        return

    if not contextIsMine:
        if original.render:
            ### We must clone our tag before passing to a render function
            original = original.clone(deep=False)
        context = WovenContext(context, original)
        
    if original.data is not Unset:
        newdata = convertToData(original.data, context)
        if isinstance(newdata, util.Deferred):
            yield newdata.addCallback(lambda newdata: _datacallback(newdata, context))
        else:
            _datacallback(newdata, context)
            
    if original.render:
        ## If we have a render function we want to render what it returns,
        ## not our tag
        toBeRenderedBy = original.render
        # erase special attribs so if the renderer returns the tag,
        # the specials won't be on the context twice.
        original._clearSpecials()
        yield serialize(toBeRenderedBy, context)
        return

    if not visible:
        for child in original.children:
            yield serialize(child, context)
        return

    yield '<%s' % original.tagName
    if original.attributes:
        attribContext = WovenContext(parent=context, precompile=context.precompile, isAttrib=True)
        for (k, v) in original.attributes.iteritems():
            if v is None:
                continue
            yield ' %s="' % k
            yield serialize(v, attribContext)
            yield '"'
    if not original.children:
        if original.tagName in allowSingleton:
            yield ' />'
        else:
            yield '></%s>' % original.tagName
    else:
        yield '>'
        for child in original.children:
            yield serialize(child, context)        
        yield '</%s>' % original.tagName


def EntitySerializer(original, context):
    if original.name in ['amp', 'gt', 'lt', 'quot']:
        return '&%s;' % original.name
    return '&#%s;' % original.num


def StringSerializer(original, context):
    ## quote it
    if context.isAttrib:
        return original.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;")
    elif context.inURL:
        import urllib
        return urllib.quote(original)
    else:
        return original.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def NoneWarningSerializer(original, context):
    if context.isAttrib:
        ## We don't want the big red None warning inside a html attribute. Just leave it blank.
        return ''
    elif context.inURL:
        return ''
    return '<span style="font-size: xx-large; font-weight: bold; color: red; border: thick solid red;">None</span>'


def StringCastSerializer(original, context):
    return StringSerializer(str(original), context)


def ListSerializer(original, context):
    for item in original:
        yield serialize(item, context)


def XmlSerializer(original, context):
    return original.content


def RawSerializer(original, context):
    return original


PASS_SELF = object()


def FunctionSerializer_nocontext(original):
    code = getattr(original, 'func_code', None)
    if code is None:
        return True
    argcount = code.co_argcount
    if argcount == 1:
        return True
    if argcount == 3:
        return PASS_SELF
    return False

def FunctionSerializer(original, context, nocontextfun=FunctionSerializer_nocontext):
    if context.precompile:
        return WovenContext(tag=invisible(render=original))
    else:
        data = convertToData(context.locate(IData), context)
        try:
            nocontext = nocontextfun(original)
            if nocontext is True:
                result = original(data)
            else:
                if nocontext is PASS_SELF:
                    renderer = context.locate(IRenderer)
                    result = original(renderer, context, data)
                else:
                    result = original(context, data)
        except StopIteration:
            raise RuntimeError, "User function %r raised StopIteration." % original
        serialized = serialize(result, context)
        if isinstance(serialized, (util.Deferred)):
            return serialized.addCallback(lambda r: serialize(r, context))
        return serialized


def DeferredSerializer(original, context):
    return original


def MethodSerializer(original, context):
    def nocontext(original):
        func = getattr(original, 'im_func', None)
        code = getattr(func, 'func_code', None)
        return code is None or code.co_argcount == 2
    return FunctionSerializer(original, context, nocontext)


def RendererSerializer(original, context):
    def nocontext(original):
        func = getattr(original, 'im_func', None)
        code = getattr(func, 'func_code', None)
        return code is None or code.co_argcount == 2
    return FunctionSerializer(original.rend, context, nocontext)

def DirectiveSerializer(original, context):
    if context.precompile:
        return original
    
    rendererFactory = context.locate(IRendererFactory)
    renderer = rendererFactory.renderer(context, original.name)
    return serialize(renderer, context)

def SlotSerializer(original, context):
    if context.precompile:
        try:
            return serialize(context.locateSlotData(original.name), context)
        except KeyError:
            original.children = precompile(original.children, context)
        return original
    try:
        data = context.locateSlotData(original.name)
    except KeyError:
        if original.default is None:
            raise
        return serialize(original.default, context)
    return serialize(data, context)

def ContextSerializer(original, context):
    originalContext = original.clone(deep=False)
    originalContext.precompile = context and context.precompile or False
    originalContext.chain(context)
    try:
        return TagSerializer(originalContext.tag, originalContext, contextIsMine=True)
    except Exception, e:
        handler = context.locate(inevow.ICanHandleException)
        if handler:
            return handler.renderInlineError(context, util.Failure(e))
        else:
            log.err(e)
            return """<div style="border: 1px dashed red; color: red; clear: both">[[ERROR]]</div>"""
                              




def CommentSerializer(original, context):
    yield "<!--"
    for x in original.children:
        yield serialize(x, context)
    yield "-->"


def DocFactorySerializer(original, ctx):
    """Serializer for document factories.
    """
    return serialize(original.load(ctx), ctx)

