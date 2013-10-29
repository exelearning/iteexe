# Copyright (c) 2004 Divmod.
# See LICENSE for details.

from nevow.compy import Interface, implements


class ITyped(Interface):
    """Typeds correspond roughly to <input> tags in HTML, or
    with a complex type, more than one <input> tag whose input
    is processed and coerced as a unit.
    """
    def coerce(self, val, configurable):
        """Coerce the input 'val' from a string into a value suitable 
        for the type described by the implementor. If coercion fails, 
        coerce should raise InputError with a suitable error message 
        to be shown to the user. 'configurable' is the configurable object
        in whose context the coercion is taking place.
        
        May return a Deferred.
        """

    label = property(doc="""The short label which will describe this
        parameter/properties purpose to the user.""")
    
    description = property(doc="""A long description which further describes the sort
        of input the user is expected to provide.""")
    
    default = property(doc="""A default value that may be used as an initial value in
        the form.""")

    complexType = property(doc="""Whether or not this Typed
        is a "simple" type and the infrastructure should render label,
        description, and error UI automatically, or this type is
        "complex" in which case it will be required to render all UI
        including UI which is normally common to all Typed UI.
        
        This MAY BE DEPRECATED if a better implementation is
        devised.
        """)



class IBinding(Interface):
    """A Binding corresponds (very) roughly to a <form> tag in HTML.
    A Binding is an object which associates a string name with a Typed
    instance. At the most basic level, Binding instances represent named
    python properties and methods.
    """
    def getArgs(self):
        """Return a copy of this bindings Typed instances; if this binding is a
        Property binding, it will be a list of one Typed istance; if this binding is a
        MethodBinding, it will be a list of all the Typed instances describing
        the method's arguments.
        
        These copies are used during the duration of a form post (initial 
        rendering, form posting, error handling and error correction) to 
        store the user-entered values temporarily in the case of an error
        in one or more input values.
        """

    def getViewName(self):
        """Todo: remove?
        """

    def configure(self, boundTo, results):
        """Configure the object "boundTo" in the manner appropriate
        to this Binding; if this binding represents a property, set the
        property; if this binding represents a method, call the method.
        """

    def coerce(self, val, configurable):
        """TODO This is dumb. remove it and leave it on ITyped
        
        Make the code that calls coerce call it on the typed directly
        """

    default = property(doc="""The default value for this binding.""")




class IInputProcessor(Interface):
    """handle a post for a given binding
    """
    def process(self, context, boundTo, data):
        """do something to boundTo in response to some data

        Raise a formless.InputError if there is a problem
        """


## Freeform interfaces

class IConfigurableFactory(Interface):
    """A configurable factory is used to find and/or create configurables.
    A "Configurable" object is any object which either:
     - Implements IConfigurable directly
     - Implements a TypedInterface, thus providing enough information
       about the types of objects needed to allow the user to change
       the object as long as the input is validated
    """
    def locateConfigurable(self, context, name):
        """Return the configurable that responds to the name.
        """


class IConfigurableKey(Interface):
    """The key of the configurable which is being rendered
    """


class IFormDefaults(Interface):
    """Default values for the current form
    """
    def setDefault(self, key, value, context=None):
        """Sets the 'key' parameter to the default 'value'
        """

    def getDefault(self, key, context=None):
        """Gets the default value from the parameter 'key'
        """

    def getAllDefaults(self, key):
        """Gets the defaults dict for the 'key' autocallable
        
        >>> class IMyForm(annotate.TypedInterface):
        ...     def doSomething(self, name=annotate.String()):
        ...         pass
        ...     doSomething = annotate.autocallable(doSomething)
        >>> class Page(rend.Page):
        ...     __implements__ = rend.Page.__implements__, IMyForm
        ...     docFactory = loaders.stan(t.html[t.head[t.title['foo']],t.body[render_forms]])
        ...     
        ...     def render_forms(self, ctx, data):
        ...         defaults_dict = iformless.IFormDefaults(ctx).getAllDefaults('doSomething')
        ...         defaults_dict['name'] = 'fooo'
        ...         return webform.renderForms()
        """

    def clearAll(self):
        """Clears all the default values 
        """

class IFormErrors(Interface):
    """An object which keeps track of which forms have which errors
    """


class IBindingRenderer(Interface):
    """Something which can render a formless Binding.

    A Binding represents an atomic form which can be
    submitted to cause a named thing to occur;
    a MethodBinding will cause a method to be called;
    a PropertyBinding will cause a property to change.
    """


class IActionRenderer(Interface):
    """An alternate rendering of a formless Binding which
    is usually represented as a smaller, no-input-fields
    toolbar-style button. Should call a MethodBinding.

    An action is distinct from a MethodBinding in that
    an action does not explicitly solicit input from the user,
    but instead gathers all the information it needs to run
    a method from implicit context, such as the render
    context, or the current state of the selection.
    """


class ITypedRenderer(Interface):
    """Something which can render a formless Typed.
    Renders input fields in html which will gather information
    from the user which will be passed to the Typed.coerce
    method when the entire form is submitted.
    """


class IRedirectAfterPost(Interface):
    """A marker interface which can be set to something which can be cast
    to a string to indicate that the browser should be redirected to the
    resultant url after posting the form successfully. This component can
    be set by any form post validators, or by the configurable method which
    is being automatically called if it has access to the request.

    Set this using the following:

    request.setComponent(IRedirectAfterPost, "http://example.com/")
    """


## Configurable interfaces

class IAutomaticConfigurable(Interface):
    """An object is said to implement IAutomaticConfigurable if
    it __implements__ any TypedInterfaces. When this object
    is configured, discovering binding names, discovering bindings,
    and posting forms along with calling methods in response to
    form posts and setting properties in response to form posts.
    """


class IConfigurable(Interface):
    """An adapter which implements TypedInterfaces for an object
    of the type for which it is registered, provides properties
    which will get and set properties of the adaptee, and methods
    which will perform operations on the adaptee when called.
    
    Web Specific Note: When you implement this interface, you should
    subclass freeform.Configurable instead of implementing directly,
    since it contains convenience functionality which eases implementing
    IConfigurable.
    """
    def getBindingNames(self, context):
        """Return a list of binding names which are the names of all
        the forms which will be rendered for this object when this
        object is configured.
        """

    def getBinding(self, context, name):
        """Return a Binding instance which contains Typed instances
        which describe how to render a form which will gather input
        for the 'name' binding (either a property or a method)
        """

    def postForm(self, context, bindingName, arguments):
        """Handle a form post which configures something about this
        object.
        """

    postLocation = property(doc="""The location of this object in the
    URL. Forms described by bindings returned from getBindingNames
    will be posted to postLocation + '/freeform_post!' + bindingName
    """)

    def __adapt__(other, default=None):
        from formless.annotate import TypedInterface
        if implements(other, TypedInterface):
            from formless.configurable import TypedInterfaceConfigurable
            return TypedInterfaceConfigurable(other)
        if hasattr(Interface, '__adapt__'):
            return Interface.__class__.__adapt__(IConfigurable, other)
        return default




## Under consideration for deprecation


class IActionableType(Interface):
    """A type which can have action methods associated with it.
    Currently only List. Probably can be extended to more things.
    """
    def attachActionBindings(self, possibleActions):
        """Attach some MethodBinding instances if they are actions
        for this ActionableType.
        """

    def getActionBindings(self):
        """Return a list of the MethodBinding instances which represent
        actions which may be taken on this ActionableType.
        """

