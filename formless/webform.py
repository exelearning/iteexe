# -*- test-case-name: formless.test.test_freeform -*-

# Copyright (c) 2004 Divmod.
# See LICENSE for details.




import os
import os.path
import warnings

from nevow import inevow
from nevow.stan import slot, specialMatches
from nevow.tags import *
from nevow import util
from nevow import compy
from nevow.context import NodeNotFound

import formless
from formless import iformless
from formless.formutils import enumerate, FormDefaults, FormErrors, calculatePostURL, keyToXMLID, getError

def _locateDefaultCSS():
    """Calculate and return the full path to the default freeform CSS.
    """
    dirname = os.path.abspath(os.path.dirname(__file__))
    return os.path.join(dirname, 'freeform-default.css')



try:
    from nevow.static import File
except ImportError:
    class File(object):
        __implements__ = inevow.IResource
        def __init__(self, path, content_type='text/plain'):
            self.path = path
            self.content_type = content_type

        def locateChild(self, *args):
            from nevow import rend
            return rend.NotFound

        def renderHTTP(self, ctx):
            inevow.IRequest(ctx).setHeader('Content-type', self.content_type)
            return open(self.path).read()


defaultCSS = File(_locateDefaultCSS(), 'text/css')


class DefaultRenderer(object):
    __implements__ = inevow.IRenderer, iformless.ITypedRenderer
    complexType = False
    def rend(self, context, data):
        return StringRenderer(data)
defaultBindingRenderer = DefaultRenderer()


class BaseInputRenderer(compy.Adapter):
    __implements__ = inevow.IRenderer, iformless.ITypedRenderer
    complexType = False
    def rend(self, context, data):
        defaults = context.locate(iformless.IFormDefaults)
        value = defaults.getDefault(context.key, context)
        context.remember(data.typedValue, iformless.ITyped)

        if data.typedValue.getAttribute('immutable'):
            inp = span(id=keyToXMLID(context.key))[value]
        else:
            ##value may be a deferred; make sure to wait on it properly before calling self.input
            ## TODO: If flattening this results in an empty string, return an empty string
            inp = invisible(
                render=lambda c, value: self.input( context, invisible(), data, data.name, value ),
                data=value)

        if data.typedValue.getAttribute('hidden') or data.typedValue.getAttribute('compact'):
            return inp

        context.fillSlots( 'label', data.label )
        context.fillSlots( 'name', data.name )
        context.fillSlots( 'input', inp )
        context.fillSlots( 'error', getError(context) )
        context.fillSlots( 'description', data.description )
        context.fillSlots( 'id', keyToXMLID(context.key) )
        context.fillSlots( 'value', value )

        return context.tag

    def input(self, context, slot, data, name, value):
        raise NotImplementedError("Implement in subclass")


class PasswordRenderer(BaseInputRenderer):
    def input(self, context, slot, data, name, value):
        return [
            eval(input(id=keyToXMLID(context.key), name=name, type="password", _class="freeform-input-password")),
            " Again ",
            eval(input(name="%s____2" % name, type="password", _class="freeform-input-password")),
        ]


class PasswordEntryRenderer(BaseInputRenderer):
    def input(self, context, slot, data, name, value):
        return slot[
            eval(input(id=keyToXMLID(context.key), type='password', name=name,
                  _class='freeform-input-password'))]


class StringRenderer(BaseInputRenderer):
    def input(self, context, slot, data, name, value):
        if data.typedValue.getAttribute('hidden'):
            T="hidden"
        else:
            T="text"
        return slot[
            eval(input(id=keyToXMLID(context.key), type=T, name=name, value=value,
                  _class='freeform-input-%s' % T))]


class TextRenderer(BaseInputRenderer):
    def input(self, context, slot, data, name, value):
        return slot[
            textarea(id=keyToXMLID(context.key), name=name, _class="freeform-textarea", rows=8, cols=40)[
                value or '']]


class BooleanRenderer(BaseInputRenderer):
    def input(self, context, slot, data, name, value):
        ## The only difference here is the "checked" attribute; the value is still the same because
        ## we want true to be passed to the server when the checkbox is checked and the form
        ## is posted.
        node = eval(input(id=keyToXMLID(context.key), type="checkbox", name=name, value='True', _class="freeform-input-checkbox"))
        if value:
            node(checked="checked")

        # HTML forms are so weak. If the checkbox is not checked, no value at all will be
        # in request.args with the name data.name. So let's force the value False to always
        # be in request.args[data.name]. If the checkbox is checked, the value True will
        # be first, and we will find that.
        return slot[node, eval(input(type="hidden", name=name, value="False"))]


class FileUploadRenderer(BaseInputRenderer):
    def input(self, context, slot, data, name, value):
        return slot[eval(input(id=keyToXMLID(context.key), type="file", name=name,
                          _class='freeform-input-file'))]


class ICurrentlySelectedValue(compy.Interface):
    """The currently-selected-value for the ITypedRenderer being rendered.
    """


csv = ICurrentlySelectedValue
def valToKey(c, d):
    return iformless.ITyped(c).valueToKey(d)


def isSelected(c, d):
    if csv(c) == valToKey(c, d):
        return c.tag(selected='selected')
    return c.tag




class ChoiceRenderer(BaseInputRenderer):
    default_select = select(id=slot('id'), name=slot('name'), render=directive('sequence'))[
        option(pattern="item", 
            value=valToKey, 
            render=isSelected)[
            lambda c, d: iformless.ITyped(c).stringify(d)]]

    def input(self, context, slot, data, name, value):
        tv = data.typedValue
        choices = tv.choices

        if value:
            context.remember(value, csv)
        else:
            context.remember('', csv)

        try:
            selector = context.tag.patternGenerator( 'selector' )
        except NodeNotFound:
            selector = self.default_select

        return selector(data=choices)


class RadioRenderer(ChoiceRenderer):
    default_select = span(id=slot('id'), render=directive('sequence'))[
        div(pattern="item", _class="freeform-radio-option")[
            input(type="radio", name=slot('name'), value=valToKey, render=isSelected)[
                lambda c, d: iformless.ITyped(c).stringify(d)]]]


class ObjectRenderer(compy.Adapter):
    __implements__ = inevow.IRenderer, iformless.ITypedRenderer
    complexType = True
    def rend(self, context, data):
        configurable = context.locate(iformless.IConfigurable)
        return getattr(configurable, data.name)


class NullRenderer(compy.Adapter):
    """Use a NullRenderer as the ITypedRenderer adapter when nothing should
    be included in the output.
    """
    __implements__ = inevow.IRenderer, iformless.ITypedRenderer
    def rend(self, context, data):
        return ''


class GroupBindingRenderer(compy.Adapter):
    __implements__ = inevow.IRenderer,

    def rend(self, context, data):
        context.remember(data, iformless.IBinding)

        from formless import configurable as conf

        configurable = conf.GroupConfigurable(data.boundTo, data.typedValue.interface)
        context.remember(configurable, iformless.IConfigurable)

        bindingNames = configurable.getBindingNames(context)

        def generateBindings():
            for name in bindingNames:
                bnd = configurable.getBinding(context, name)
                renderer = iformless.IBindingRenderer(bnd, defaultBindingRenderer, persist=False)
                renderer.isGrouped = True
                renderer.needsSkin = True
                yield invisible(
                    data=bnd,
                    render=renderer,
                    key=name)

        return getError(context), form(
            id=keyToXMLID(context.key),
            enctype="multipart/form-data",
            action=calculatePostURL(context, data),
            method="post",
            **{'accept-charset':'utf-8'})[
                fieldset[
                    legend(_class="freeform-form-label")[data.label],
                    eval(input(type='hidden', name='_charset_')),
                    generateBindings(),
                    eval(input(type="submit"))]]


class BaseBindingRenderer(compy.Adapter):
    __implements__ = inevow.IRenderer,

    isGrouped = False
    needsSkin = False
    def calculateDefaultSkin(self, context):
        if self.isGrouped:
            frm = invisible
            butt = ''
            fld = invisible
        else:
            frm = form(
                id=slot('form-id'),
                action=slot('form-action'),
                method="post",
                enctype="multipart/form-data",
                **{'accept-charset':'utf-8'}
                )
            butt = slot('form-button')
            fld = fieldset[eval(input(type='hidden', name='_charset_'))]

        ## Provide default skin since no skin was provided for us.
        context.tag.clear()[
            frm[fld[legend(_class="freeform-form-label")[ slot('form-label') ],
                    div(_class="freeform-form-description")[slot('form-description')],
                    div(_class="freeform-form-error")[ slot('form-error') ],

                    slot('form-arguments'), butt ]]]

    def fillForm(self, context, data):
        context.fillSlots( 'form-id', keyToXMLID(context.key) )
        context.fillSlots( 'form-action', calculatePostURL(context, data) )
        context.fillSlots( 'form-name', data.name )
        context.fillSlots( 'form-error', getError(context) )


class PropertyBindingRenderer(BaseBindingRenderer):
    def rend(self, context, data):
        context.remember(data, iformless.IBinding)
        context.remember(data.typedValue, iformless.ITyped)
        typedRenderer = iformless.ITypedRenderer(data.typedValue, defaultBindingRenderer, persist=False)
        if typedRenderer.complexType:
            return invisible(data=data, render=typedRenderer)

        if self.needsSkin or not context.tag.children:
            self.calculateDefaultSkin(context)

        if self.isGrouped or data.typedValue.getAttribute('immutable'):
            subm = ''
        else:
            subm = eval(input(type="submit", name="change", value="Change"))

        self.fillForm(context, data)
        context.fillSlots( 'form-label', '' )
        context.fillSlots( 'form-description', '' )

        try:
            content_pattern = context.tag.patternGenerator( 'binding' )
        except NodeNotFound:
            content_pattern = freeformDefaultContentPattern

        context.fillSlots(
            'form-arguments',
            content_pattern(
                data=data, render=typedRenderer, key=data.name))

        context.fillSlots('form-button', subm)

        return context.tag


freeformDefaultContentPattern = invisible[
    label(_class="freeform-label", _for=slot('id'))[ slot('label') ],
    span(_class="freeform-input")[ slot('input') ],
    div(_class="freeform-error")[ slot('error') ],
    div(_class="freeform-description")[label(_for=slot('id'))[ slot('description') ]]].freeze()


class MethodBindingRenderer(BaseBindingRenderer):
    def rend(self, context, data):
        if data.getAttribute('invisible'):
            return ''

        context.remember(data, iformless.IBinding)

        if self.needsSkin or not context.tag.children:
            self.calculateDefaultSkin(context)

        self.fillForm(context, data)
        context.fillSlots( 'form-label', data.label )
        context.fillSlots( 'form-description', data.description )
        context.fillSlots( 'form-arguments', list(self.generateArguments(context, data.getArgs())))

        if not self.isGrouped:
            try:
                button_pattern = context.tag.onePattern( 'form-button' )
            except NodeNotFound:
                button_pattern = invisible[ slot('input') ]

            button_pattern.fillSlots( 'input', eval(input(type='submit', value=data.action or data.label)) )

            context.fillSlots( 'form-button', button_pattern )

        return context.tag(key=None)

    def generateArguments(self, context, args):
        default_content_pattern = None
        content_pattern = None
        for argument in args:
            try:
                content_pattern = context.tag.patternGenerator( 'argument!!%s' % argument.name )
            except NodeNotFound:
                if default_content_pattern is None:
                    try:
                        default_content_pattern = context.tag.patternGenerator( 'argument' )
                    except NodeNotFound:
                        default_content_pattern = freeformDefaultContentPattern
                content_pattern = default_content_pattern
            renderer = iformless.ITypedRenderer(
                argument.typedValue, defaultBindingRenderer, persist=False)
            pat = content_pattern(
                key=argument.name,
                data=argument,
                render=renderer,
                remember={iformless.ITyped: argument.typedValue})
            context.fillSlots( 'argument!!%s' % argument.name, pat )
            yield pat


class ButtonRenderer(compy.Adapter):
    __implements__ = inevow.IRenderer,

    def rend(self, context, data):
        return eval(input(type='submit', value=data.label))


freeformDefaultForm = div(_class="freeform-form").freeze()


def renderForms(configurableKey='', bindingNames=None, bindingDefaults=None):
    """Render forms for either the named configurable, or, if no configurableKey is given,
    the main configurable. If no bindingNames are given, forms will be
    rendered for all bindings described by the configurable.

    @param configurableKey: The name of the configurable to render.  The empty
    string indicates ctx.locate(IRenderer).

    @param bindingNames: The names of the bindings to render.  None indicates
    all bindings.

    @param bindingDefaults: A dict mapping bindingName: bindingDefault.  For example,
    given the TypedInterface::

            >>> class IMyForm(annotate.TypedInterface):
            ...     def doSomething(self, name=annotate.String()):
            ...         pass
            ...     doSomething = annotate.autocallable(doSomething)
            ...     def doNothing(self name=annotate.String()):
            ...         pass
            ...     doNothing = annotate.autocallable(doNothing)
            ...     def doMoreThings(self name=annotate.String(), things=annotate.String()):
            ...         pass
            ...     doMoreThings = annotate.autocallable(doMoreThings)

        One might call renderForms() like this::

            return webform.renderForms(
                '',
                bindingDefaults={'doSomething': {'name': 'jimbo'},
                                 # Change 'name' default, don't change 'things'
                                 'doMoreThings': {'things': 'jimbo'}
                                 })

        This would cause a form to be rendered which will call doSomething when
        submitted, and would have "jimbo" filled out as the default value for
        the name field, as well as a form which will call doMoreThings (with no
        default value filled in for 'name' but 'jimbo' filled in for 'things').
    """

    assert bindingNames is None or bindingDefaults is None, "Only specify bindingNames or bindingDefaults"

    if bindingNames is not None:
        bindingDefaults = dict.fromkeys(bindingNames, {})

    def formRenderer(ctx, data):
        cf = ctx.locate(iformless.IConfigurableFactory)
        return util.maybeDeferred(cf.locateConfigurable, ctx, configurableKey
                                  ).addCallback(_formRenderIt)

    def _formRenderIt(configurable):
        def _innerFormRenderIt(context, data):
            tag = context.tag
            # Remember the key for when the form post URL is generated.
            context.remember(configurableKey, iformless.IConfigurableKey)
            if configurable is None:
                warnings.warn(
                    "No configurable was found which provides enough type information for freeform to be able to render forms; %r" % (cf, ))
                yield ''
                return
            context.remember(configurable, iformless.IConfigurable)

            formDefaults = iformless.IFormDefaults(context)

            available = configurable.getBindingNames(context)
            bindings = []

            default_binding_pattern = None

            for name in available:
                if bindingDefaults is not None:
                    if name not in bindingDefaults:
                        continue
                    defs = formDefaults.getAllDefaults(name)
                    defs.update(bindingDefaults[name])

                bnd = configurable.getBinding(context, name)
                renderer = iformless.IBindingRenderer(bnd, defaultBindingRenderer, persist=False)
                try:
                    binding_pattern = tag.patternGenerator( 'freeform-form!!%s' % name )
                except NodeNotFound:
                    if default_binding_pattern is None:
                        try:
                            default_binding_pattern = tag.patternGenerator( 'freeform-form' )
                        except NodeNotFound:
                            default_binding_pattern = freeformDefaultForm
                    binding_pattern = default_binding_pattern
                if binding_pattern is freeformDefaultForm:
                    renderer.needsSkin = True
                yield binding_pattern(data = bnd, render = renderer, key = name)
        return _innerFormRenderIt
    return invisible(render=formRenderer)

