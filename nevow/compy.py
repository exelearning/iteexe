# Copyright (c) 2004 Divmod.
# See LICENSE for details.

"""COMponents for PYthon

Compy 386

Borrowed from Twisted and hacked mercilessly."""


# system imports
import types
import warnings
import weakref

from nevow.util import qual, namedAny, uniquify, allYourBase


def newImplements(*ifaces):
    """Declare that a class implements an interface. You can use this at class level
    instead of __implements__. For example:
    
    >>> class Foo(object):
    ...     implements(inevow.IResource)
    ... 
    ...     def locateChild(self, ctx, segments):
    ...         return self, ()
    ... 
    ...     def renderHTTP(self, ctx):
    ...         return "<html>Hello World</html>"
    """
    import inspect
    locs = inspect.currentframe().f_back.f_locals
    locs['__implements__'] = locs.get('__implements__', ()) + ifaces


ALLOW_DUPLICATES = 0

class _Nothing:
    """
    An alternative to None - default value for functions which raise if default not passed.
    """

class _NoImplementor:
    """
    Same as _Nothing but used by MetaInterface.__call__
    """

def getRegistry(r=None):
    if r is None:
        return theAdapterRegistry
    else:
        return r

class CannotAdapt(NotImplementedError):
    """
    Can't adapt some object to some Interface.
    """
    pass

class MetaInterface(type):
    def __call__(self, adaptable, default=_Nothing, persist=None, registry=None):
        """
        Try to adapt `adaptable' to self; return `default' if it was passed, otherwise
        raise L{CannotAdapt}.
        """
        adapter = default
        registry = getRegistry(registry)
        ## getComponent check for cross-compatibility with twisted Componentized
        if implements(adaptable, IComponentized) or getattr(adaptable, 'getComponent', None):
            adapter = adaptable.getComponent(self, registry, default=_NoImplementor)

        if adapter is default or adapter is _NoImplementor:
            adapter = registry.getAdapter(
                adaptable, self, _NoImplementor, persist=persist)
        if adapter is _NoImplementor:
            if getattr(self, '__adapt__', None):
                adapter = self.__adapt__.__func__(adaptable, default)
            else:
                adapter = default

        if adapter is _Nothing:
            if getattr(adaptable, '__class__', None):
                t = qual(adaptable.__class__)
            else:
                t = qual(type(adaptable))
            raise CannotAdapt("%s (type %s) cannot be adapted to %s." %
                              (adaptable, t, self))
        return adapter


class Interface(metaclass=MetaInterface):
    """Base class for interfaces.

    Interfaces define and document an interface for a class. An interface
    class's name must begin with I, and all its methods should have no
    implementation code.

    Objects that implement an interface should have an attribute __implements__,
    that should be either an Interface subclass or a tuple, or tuple of tuples,
    of such Interface classes.

    A class whose instances implement an interface should list the interfaces
    its instances implement in a class-level __implements__.

    For example::

        | class IAdder(Interface):
        |     'Objects implementing this interface can add objects.'
        |
        |     def add(self, a, b):
        |         'Add two objects together and return the result.'
        |
        | class Adder:
        |
        |     __implements__ = IAdder
        |
        |     def add(self, a, b):
        |         return a + b


    You can call an Interface with a single argument; If the passed object can
    be adapted to the Interface in some way, the adapter will be returned.
    """

    def adaptWith(self, using, to, registry=None):
        registry = getRegistry(registry)
        registry.registerAdapter(using, self, to)

    adaptWith = classmethod(adaptWith)


class Flat(tuple):
    pass


def tupleTreeToList(t, l=None):
    """Convert an instance, or tree of tuples, into list."""
    if l is None: l = []
    if isinstance(t, tuple):
        for o in t:
            tupleTreeToList(o, l)
    else:
        l.append(t)
    return Flat(l)


def implements(obj, interfaceClass):
    """Return boolean indicating if obj implements the given interface."""
    if getattr(obj, '__implements__', None) is None:
        return False

    if type(obj.__implements__) is not Flat:
        obj.__implements__ = Flat(tupleTreeToList(obj.__implements__))
    for i in obj.__implements__:
        if issubclass(i, interfaceClass):
            return True

    return False
 

def getInterfaces(obj, attr='__implements__'):
    """Return list of all interfaces an object implements, using a particular
    attribute name.  For example, if you wish to discover what interfaces a
    class implements directly, pass '__class_implements__' as the attribute
    name.
    """
    if getattr(obj, attr, None) is None:
        return []

    result = []
    L = getattr(obj, attr, ())
    if type(L) is not Flat:
        L = tupleTreeToList(L)
        setattr(obj, attr, L)
    for i in L:
        if i not in result:
            result.append(i)
        result.extend(allYourBase(i, Interface))
    if Interface in result:
        result.remove(Interface)
    return result


def superInterfaces(interface):
    """Given an interface, return list of super-interfaces (including itself)."""
    result = [interface]
    result.extend(allYourBase(interface, Interface))
    result = uniquify(result)
    result.remove(Interface)
    return result


def classToInterfaces(k):
    l = getInterfaces(k)
    l.insert(0, k)
    return l


class _Wrapper(object):
    """Makes any object be able to be dict key."""

    __slots__ = ["a"]

    def __init__(self, a):
        self.a = a


class AdapterRegistry:

    def __init__(self):
        # mapping between (<class>, <interface>) and <adapter class>
        # all values are qualstrings
        self.adapterRegistry = {}
        self.adapterPersistence = weakref.WeakValueDictionary()
        self.adapterOrigPersistence = weakref.WeakValueDictionary()
    
    def persistAdapter(self, original, iface, adapter):
        self.adapterPersistence[(id(original), iface)] = adapter
        # make sure as long as adapter is alive the original object is alive
        self.adapterOrigPersistence[_Wrapper(original)] = adapter
    
    def registerAdapter(self, adapterFactory, origInterface, *interfaceClasses):
        """Register an adapter class.

        An adapter class is expected to implement the given interface, by
        adapting instances implementing 'origInterface'. An adapter class's
        __init__ method should accept one parameter, an instance implementing
        'origInterface'.
        """
        assert interfaceClasses, "You need to pass an Interface"
        
        isStr = type(adapterFactory) is str
        if (type(origInterface) is str) != isStr:
            raise ValueError("Either all arguments must be strings or all must be objects.")

        global ALLOW_DUPLICATES
        for interfaceClass in interfaceClasses:
            if (type(interfaceClass) is str) != isStr:
                raise ValueError("Either all arguments must be strings or all must be objects.")
            
            if (not ALLOW_DUPLICATES and (origInterface, interfaceClass) in self.adapterRegistry):
                raise ValueError(
                    "an adapter (%s) was already registered." % (
                        self.adapterRegistry[(origInterface, interfaceClass)]))
            self.adapterRegistry[(origInterface, interfaceClass)] = adapterFactory

    def getAdapterFactory(self, fromInterface, toInterface, default):
        """Return registered adapter for a given class and interface.
        """
        R = self.adapterRegistry.get((fromInterface, toInterface), None)
        if R is None:
            adapterQual = self.adapterRegistry.get((qual(fromInterface), qual(toInterface)), None)
            if adapterQual is None:
                return default
            R = namedAny(adapterQual)
            R.__implements__ = tupleTreeToList(getattr(R, '__implements__', ()))
            self.adapterRegistry[(fromInterface, toInterface)] = R
        return R

    ## provisional shim for twisted Componentized compatibility
    getAdapterClassWithInheritance = getAdapterFactory

    def getAdapter(self, obj, interfaceClass, default=_Nothing,
                   adapterClassLocator=None, persist=None):
        """Return an object that implements the given interface.

        The result will be a wrapper around the object passed as a parameter, or
        the parameter itself if it already implements the interface. If no
        adapter can be found, the 'default' parameter will be returned.
        """
        if implements(obj, interfaceClass):
            return obj

        if persist != False:
            pkey = (id(obj), interfaceClass)
            if pkey in self.adapterPersistence:
                return self.adapterPersistence[pkey]

        if getattr(obj, '__class__', None):
            klas = obj.__class__
        else:
            klas = type(obj)
        for fromInterface in classToInterfaces(klas):
            adapterFactory = ( (adapterClassLocator or self.getAdapterFactory)(
                fromInterface, interfaceClass, None) )
            if adapterFactory is not None:
                adapter = adapterFactory(obj)
                if persist:
                    self.persistAdapter(obj, interfaceClass, adapter)
                return adapter
        if default is _Nothing:
            raise NotImplementedError(
                '%s instance does not implement %s, and there is no registered adapter.' % (
                    obj, interfaceClass))
        return default


theAdapterRegistry = AdapterRegistry()

def registerAdapter(adapterFactory, origInterface, *interfaceClasses):
    for inter in interfaceClasses:
        if getattr(inter, '__name__', inter).endswith('ISerializable'):
            warnings.warn("ISerializable is deprecated; please use nevow.flat.registerFlattener instead: %s %s" % (adapterFactory, origInterface), stacklevel=2)
            from nevow.flat import registerFlattener
            registerFlattener(adapterFactory, origInterface)
            return

    theAdapterRegistry.registerAdapter(adapterFactory, origInterface, *interfaceClasses)

getAdapterFactory = theAdapterRegistry.getAdapterFactory
getAdapterClass = theAdapterRegistry.getAdapterFactory
getAdapter = theAdapterRegistry.getAdapter


class Adapter:
    """I am the default implementation of an Adapter for some interface.

    This docstring contains a limerick, by popular demand::

        Subclassing made Zope and TR
        much harder to work with by far.
            So before you inherit,
            be sure to declare it
        Adapter, not PyObject*

    @cvar temporaryAdapter: If this is True, the adapter will not be
          persisted on the Componentized.
    @cvar multiComponent: If this adapter is persistent, should it be
          automatically registered for all appropriate interfaces.
    """

    # These attributes are used with Componentized.

    temporaryAdapter = 0
    multiComponent = 1

    def __init__(self, original):
        """Set my 'original' attribute to be the object I am adapting.
        """
        self.original = original

    def getComponent(self, interface, registry=None, default=None):
        """
        I forward getComponent to self.original if it has it, otherwise I
        simply return default.
        """
        try:
            f = self.original.getComponent
        except AttributeError:
            return default
        else:
            return f(interface, registry=registry, default=default)

    def isuper(self, iface, adapter):
        """
        Forward isuper to self.original
        """
        return self.original.isuper(iface, adapter)

class IComponentized(Interface):
    pass


class Componentized(object):
    __implements__ = IComponentized,

    """I am a mixin to allow you to be adapted in various ways persistently.

    I define a list of persistent adapters.  This is to allow adapter classes
    to store system-specific state, and be initialized on demand.  The
    getComponent method implements this.  You must also register adapters for
    this class for the interfaces that you wish to pass to getComponent.

    Many other classes and utilities listed here are present in Zope3; this one
    is specific to Twisted.
    """

    persistenceVersion = 1

    def __init__(self, adapterCache=None):
        self._adapterCache = A = {}
        if adapterCache:
            for k, v in list(adapterCache.items()):
                A[qual(k)] = v

    def __repr__(self):
        return "%s(%r)" % (self.__class__.__name__, self._adapterCache, )

    def locateAdapterClass(self, klass, interfaceClass, default, registry=None):
        return getRegistry(registry).getAdapterFactory(klass, interfaceClass, default)

    def setAdapter(self, interfaceClass, adapterClass):
        self.setComponent(interfaceClass, adapterClass(self))

    def addAdapter(self, adapterClass, ignoreClass=0, registry=None):
        """Utility method that calls addComponent.  I take an adapter class and
        instantiate it with myself as the first argument.

        @return: The adapter instantiated.
        """
        adapt = adapterClass(self)
        self.addComponent(adapt, ignoreClass, registry)
        return adapt

    def setComponent(self, interfaceClass, component):
        """
        """
        self._adapterCache[qual(interfaceClass)] = component

    def addComponent(self, component, ignoreClass=0, registry=None):
        """
        Add a component to me, for all appropriate interfaces.

        In order to determine which interfaces are appropriate, the component's
        __implements__ attribute will be scanned.

        If the argument 'ignoreClass' is True, then all interfaces are
        considered appropriate.

        Otherwise, an 'appropriate' interface is one for which its class has
        been registered as an adapter for my class according to the rules of
        getComponent.

        @return: the list of appropriate interfaces
        """
        for iface in tupleTreeToList(component.__implements__):
            if (ignoreClass or
                (self.locateAdapterClass(self.__class__, iface, None, registry)
                 == component.__class__)):
                self._adapterCache[qual(iface)] = component
        
    def unsetComponent(self, interfaceClass):
        """Remove my component specified by the given interface class."""
        del self._adapterCache[qual(interfaceClass)]

    def removeComponent(self, component):
        """
        Remove the given component from me entirely, for all interfaces for which
        it has been registered.

        @return: a list of the interfaces that were removed.
        """
        if (isinstance(component, type) or
            isinstance(component, type)):
            warnings.warn("passing interface to removeComponent, you probably want unsetComponent", DeprecationWarning, 1)
            self.unsetComponent(component)
            return [component]
        l = []
        for k, v in list(self._adapterCache.items()):
            if v is component:
                del self._adapterCache[k]
                l.append(namedAny(k))
        return l

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
        registry = getRegistry(registry)
        k = qual(interface)
        if k in self._adapterCache:
            return self._adapterCache[k]
        elif implements(self, interface):
            return self
        else:
            adapter = registry.getAdapter(self, interface, default,
                                          lambda k, ik, d:
                                          self.locateAdapterClass(k, ik, d, registry))
            if adapter is not None and adapter is not _Nothing and not (
                getattr(adapter, "temporaryAdapter", None) and
                adapter.temporaryAdapter):
                self._adapterCache[k] = adapter
                if (getattr(adapter, "multiComponent", None) and
                    adapter.multiComponent and
                    getattr(adapter, '__implements__', None)):
                    self.addComponent(adapter)
            return adapter

    def upgradeToVersion1(self):
        # To let Componentized instances interact correctly with
        # rebuild(), we cannot use class objects as dictionary keys.
        for (k, v) in list(self._adapterCache.items()):
            self._adapterCache[qual(k)] = v


__all__ = ["Interface", "implements", "getInterfaces", "superInterfaces",
           "registerAdapter", "getAdapterFactory", "getAdapterClass",
           "getAdapter", "Componentized", "AdapterRegistry", "Adapter"]
