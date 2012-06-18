# Copyright (c) 2004 Divmod.
# See LICENSE for details.

"""Builtin template loaders that supply a Page or renderer with a
document to render.

Nevow provides the following DocFactory loaders by default:

  - B{stan} - turn a stan tag tree into a DocFactory
  - B{xmlfile} - load a well formed XML document from file
  - B{htmlfile} - load a HTML file from disk
  - B{xmlstr} - load a well formed XML document from a string
  - B{htmlstr} - load a HTML document from a string

Unless absolutely necessary you should use either the stan loader or
one of the xml loaders. The html loaders should only be used for badly
formed HTML documents, i.e. if your HTML developer hasn't heard of
XHTML yet. Even then, you should probably try to educate the HTML
developer first ;-).
"""

import warnings

import os.path

from nevow import context
from nevow import inevow
from nevow import tags
from nevow import flat
from nevow.flat import flatsax

class DocFactory:
    """Base class for document factories. I am responsible for loading a document
    template for the renderer to use.
    """

    __implements__ = inevow.IDocFactory,
    
    pattern = None
    precompiledDoc = None

    def __init__(self, pattern=None):
        import warnings
        warnings.warn(
            "[v0.4] DocFactory is deprecated - it just made things more complicated. Please update the %r loader."%self.__class__,
            DeprecationWarning,
            stacklevel=2)
        if pattern:
            self.pattern = pattern

    def precompile(self, parent):
        ctx = context.WovenContext(parent=parent, precompile=True)
        from nevow import flat
        doc = flat.precompile(self.getDoc(), ctx)
        if self.pattern:
            tag = tags.invisible[doc]
            doc = [tag.onePattern(self.pattern)]
        return doc

    def load(self, ctx=None):
        """Load and return the document for the renderer"""
        if self.precompiledDoc is None:
            self.precompiledDoc = self.precompile(ctx)
        return self.precompiledDoc
        

class stan(object):
    """A stan tags document factory"""
    
    __implements__ = inevow.IDocFactory,
    
    stan = None
    pattern = None
    _cache = None

    def __init__(self, stan=None, pattern=None):
        if stan is not None:
            self.stan = stan
        if pattern is not None:
            self.pattern = pattern

    def load(self, ctx=None):
        if self._cache is None:
            stan = flat.precompile(self.stan, ctx)
            if self.pattern is not None:
                stan = inevow.IQ(stan).onePattern(self.pattern)
            self._cache = stan
        return self._cache


class htmlstr(object):
    """A document factory for HTML contained in a string"""

    __implements__ = inevow.IDocFactory,
    
    template = None
    pattern = None
    beExtremelyLenient = True
    _cache = None

    def __init__(self, template=None, pattern=None, beExtremelyLenient=None):
        if template is not None:
            self.template = template
        if pattern is not None:
            self.pattern = pattern
        if beExtremelyLenient is not None:
            self.beExtremelyLenient = beExtremelyLenient
            
    def load(self, ctx=None):
        if self._cache is None:
            from twisted.web import microdom
            doc = microdom.parseString(self.template, beExtremelyLenient=self.beExtremelyLenient)
            doc = flat.precompile(doc, ctx)
            if self.pattern is not None:
                doc = inevow.IQ(doc).onePattern(self.pattern)
            self._cache = doc
        return self._cache


class htmlfile(object):
    """A document factory for an HTML disk template"""

    __implements__ = inevow.IDocFactory,
    
    template = None
    pattern = None
    templateDir = ''
    beExtremelyLenient = True
    
    _filename = None
    _mtime = None
    _cache = None

    def __init__(self, template=None, pattern=None, templateDir=None, beExtremelyLenient=None):
        if template is not None:
            self.template = template
        if pattern is not None:
            self.pattern = pattern
        if templateDir is not None:
            self.templateDir = templateDir
        if beExtremelyLenient is not None:
            self.beExtremelyLenient = beExtremelyLenient
        self._filename = os.path.join(self.templateDir, self.template)
        
    def load(self, ctx=None):
        mtime = os.path.getmtime(self._filename)
        if mtime != self._mtime or self._cache is None:
            from twisted.web import microdom
            doc = microdom.parse(self._filename, beExtremelyLenient=self.beExtremelyLenient)
            doc = flat.precompile(doc, ctx)
            if self.pattern is not None:
                doc = inevow.IQ(doc).onePattern(self.pattern)
            self._mtime = mtime
            self._cache = doc
        return self._cache

        
class xmlstr(object):

    __implements__ = inevow.IDocFactory,
    
    template = None
    pattern = None
    ignoreDocType = None
    ignoreComment = None
    _cache = None
    
    def __init__(self, template=None, pattern=None, ignoreDocType=False, ignoreComment=False):
        if template is not None:
            self.template = template
        if pattern is not None:
            self.pattern = pattern
        if ignoreDocType is not None:
            self.ignoreDocType = ignoreDocType
        if ignoreComment is not None:
            self.ignoreComment = ignoreComment

    def load(self, ctx=None):
        if self._cache is None:
            doc = flatsax.parseString(self.template, self.ignoreDocType, self.ignoreComment)
            doc = flat.precompile(doc, ctx)
            if self.pattern is not None:
                doc = inevow.IQ(doc).onePattern(self.pattern)
            self._cache = doc
        return self._cache
        

class xmlfile(object):
    
    __implements__ = inevow.IDocFactory,

    template = None
    templateDir = None
    pattern = None
    ignoreDocType = False
    ignoreComment = False

    _filename = None
    _mtime = None
    _cache = None

    def __init__(self, template=None, pattern=None, templateDir=None, ignoreDocType=None, ignoreComment=None):
        self._cache = {}
        if template is not None:
            self.template = template
        if pattern is not None:
            self.pattern = pattern
        if templateDir is not None:
            self.templateDir = templateDir
        if ignoreDocType is not None:
            self.ignoreDocType = ignoreDocType
        if ignoreComment is not None:
            self.ignoreComment = ignoreComment
        if self.templateDir is not None:
            self._filename = os.path.join(self.templateDir, self.template)
        else:
            self._filename = self.template
        
    def load(self, ctx=None):
        mtime, doc = self._cache.get((self._filename, self.pattern), (None,None))
        self._mtime = os.path.getmtime(self._filename)
        if mtime == self._mtime:
            return doc
        doc = flatsax.parse(open(self._filename), self.ignoreDocType, self.ignoreComment)
        doc = flat.precompile(doc)
        if self.pattern is not None:
            doc = inevow.IQ(doc).onePattern(self.pattern)
        self._cache[(self._filename, self.pattern)] = self._mtime, doc
        return doc
