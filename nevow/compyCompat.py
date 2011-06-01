# Copyright (c) 2004 Divmod.
# See LICENSE for details.

"""Compatibility wrapper over new twisted.python.components,
so that nevow works with it. This module shadows nevow.compy
when using the new Twisted's Zope components system.
"""

import warnings
from twisted.python.components import *
warnings.filterwarnings('ignore', category=ComponentsDeprecationWarning)
from twisted.python.reflect import namedAny as _namedAny

CannotAdapt = TypeError
class _NamedAnyError(Exception):
    'Internal error for when importing fails.'

_registerAdapter = registerAdapter
def registerAdapter(adapterFactory, origInterface, *interfaceClasses):
    class RandomClazz(object):
        pass
    def namedAny(name):
        if name == '__builtin__.function':
            name='types.FunctionType'
        elif name == '__builtin__.method':
            return RandomClazz # Hack
        elif name == '__builtin__.instancemethod':
            name='types.MethodType'
        elif name == '__builtin__.NoneType':
            name='types.NoneType'
        elif name == '__builtin__.generator':
            name='types.GeneratorType'
        try:
            return _namedAny(name)
        except (AttributeError, ImportError):
            raise _NamedAnyError("Name %s not found." % name)

    isStr = type(adapterFactory) is str
    if (type(origInterface) is str) != isStr:
        raise ValueError("Either all arguments must be strings or all must be objects.")
    
    for interfaceClass in interfaceClasses:
        if (type(interfaceClass) is str) != isStr:
            raise ValueError("Either all arguments must be strings or all must be objects.")

    if isStr:
        try:
            # print "registerAdapter:",adapterFactory, origInterface, interfaceClasses
            adapterFactory = namedAny(adapterFactory)
            origInterface = namedAny(origInterface)
            interfaceClasses = [namedAny(x) for x in interfaceClasses]
        except _NamedAnyError, nae:
            print 'NamedAnyError:', nae
            return
        # print "_registerAdapter:",adapterFactory, origInterface, interfaceClasses
    if 'nevow.inevow.ISerializable' in interfaceClasses or filter(
            lambda o: getattr(o, '__name__', None) == 'ISerializable', interfaceClasses):
        warnings.warn("ISerializable is deprecated. Please use nevow.flat.registerFlattener instead.", stacklevel=2)
        from nevow import flat
        flat.registerFlattener(adapterFactory, origInterface)
    _registerAdapter(adapterFactory, origInterface, *interfaceClasses)


class IComponentized(Interface):
    pass

_Componentized = Componentized
class Componentized(_Componentized):
    __implements__ = (IComponentized,)
    
    def __init__(self, adapterCache=None):
        _Componentized.__init__(self)
        if adapterCache:
            for k, v in adapterCache.items():
                self.setComponent(k, v)

from zope.interface import implements as newImplements
