# Copyright (c) 2004 Divmod.
# See LICENSE for details.

import os

from twisted.trial import unittest

from nevow import context
from nevow import flat
from nevow import inevow
from nevow import loaders
from nevow.tags import *

class TestDocFactories(unittest.TestCase):

    def test_stan(self):
        doc = ul(id='nav')[li['one'], li['two'], li['three']]
        df = loaders.stan(doc)
        self.assertEqual(df.load()[0], '<ul id="nav"><li>one</li><li>two</li><li>three</li></ul>')

    def test_htmlstr(self):
        doc = '<ul id="nav"><li>a</li><li>b</li><li>c</li></ul>'
        df = loaders.htmlstr(doc)
        self.assertEqual(df.load()[0], doc)

    def test_htmlfile(self):
        doc = '<ul id="nav"><li>a</li><li>b</li><li>c</li></ul>'
        temp = self.mktemp()
        f = file(temp, 'w')
        f.write(doc)
        f.close()
        df = loaders.htmlfile(temp)
        self.assertEqual(df.load()[0], doc)

    def test_htmlfile_slots(self):
        doc = '<nevow:slot name="foo">Hi there</nevow:slot>'
        temp = self.mktemp()
        f = file(temp, 'w')
        f.write(doc)
        f.close()
        df = loaders.htmlfile(temp)
        self.assertEqual(df.load()[0].children, ['Hi there'])

    def test_xmlstr(self):
        doc = '<ul id="nav"><li>a</li><li>b</li><li>c</li></ul>'
        df = loaders.xmlstr(doc)
        self.assertEqual(df.load()[0], doc)

    def test_xmlfile(self):
        doc = '<ul id="nav"><li>a</li><li>b</li><li>c</li></ul>'
        temp = self.mktemp()
        f = file(temp, 'w')
        f.write(doc)
        f.close()
        df = loaders.xmlfile(temp)
        self.assertEqual(df.load()[0], doc)

    def test_patterned(self):
        """Test fetching a specific part (a pattern) of the document.
        """
        doc = div[p[span(pattern='inner')['something']]]
        df = loaders.stan(doc, pattern='inner')
        self.assertEqual(df.load()[0].tagName, 'span')
        self.assertEqual(df.load()[0].children[0], 'something')

    def test_ignoreDocType(self):
        doc = '''<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">\n<html><body><p>Hello.</p></body></html>'''
        df = loaders.xmlstr(doc, ignoreDocType=True)
        self.assertEqual(flat.flatten(df), '<html><body><p>Hello.</p></body></html>')

    def test_ignoreComment(self):
        doc = '<!-- skip this --><p>Hello.</p>'
        df = loaders.xmlstr(doc, ignoreComment=True)
        self.assertEqual(flat.flatten(df), '<p>Hello.</p>')


class TestDocFactoriesCache(unittest.TestCase):

    doc = '''
    <div>
    <p nevow:pattern="1">one</p>
    <p nevow:pattern="2">two</p>
    </div>
    '''

    nsdoc = '''
    <div xmlns:nevow="http://nevow.com/ns/nevow/0.1">
    <p nevow:pattern="1">one</p>
    <p nevow:pattern="2">two</p>
    </div>
    '''

    stan = div[p(pattern='1')['one'],p(pattern='2')['two']]
        
    def test_stan(self):

        loader = loaders.stan(self.stan)
        self.assertEqual( id(loader.load()), id(loader.load()) )

        loader = loaders.stan(self.stan, pattern='1')
        self.assertEqual( id(loader.load()), id(loader.load()) )

        l1 = loaders.stan(self.stan, pattern='1')
        l2 = loaders.stan(self.stan, pattern='1')
        self.assertNotEqual( id(l1.load()), id(l2.load()) )

        l1 = loaders.stan(self.stan, pattern='1')
        l2 = loaders.stan(self.stan, pattern='2')
        self.assertNotEqual( id(l1.load()), id(l2.load()) )
        
    def test_htmlstr(self):
        
        loader = loaders.htmlstr(self.doc)
        self.assertEqual( id(loader.load()), id(loader.load()) )
        
        loader = loaders.htmlstr(self.doc, pattern='1')
        self.assertEqual( id(loader.load()), id(loader.load()) )
        
        l1 = loaders.htmlstr(self.doc, pattern='1')
        l2 = loaders.htmlstr(self.doc, pattern='1')
        self.assertNotEqual( id(l1.load()), id(l2.load()) )
        
        l1 = loaders.htmlstr(self.doc, pattern='1')
        l2 = loaders.htmlstr(self.doc, pattern='2')
        self.assertNotEqual( id(l1.load()), id(l2.load()) )
        
    def test_htmlfile(self):
        
        temp = self.mktemp()
        f = file(temp, 'w')
        f.write(self.doc)
        f.close()
        
        loader = loaders.htmlfile(temp)
        self.assertEqual( id(loader.load()), id(loader.load()) )
        
        l1 = loaders.htmlfile(temp, pattern='1')
        l2 = loaders.htmlfile(temp, pattern='1')
        self.assertNotEqual( id(l1.load()), id(l2.load()) )

        l1 = loaders.htmlfile(temp, pattern='1')
        l2 = loaders.htmlfile(temp, pattern='2')
        self.assertNotEqual( id(l1.load()), id(l2.load()) )

    def test_htmlfileReload(self):
        
        temp = self.mktemp()
        f = file(temp, 'w')
        f.write(self.doc)
        f.close()
        
        loader = loaders.htmlfile(temp)
        r = loader.load()
        self.assertEqual(id(r), id(loader.load()))
        os.utime(temp, (os.path.getatime(temp), os.path.getmtime(temp)+5))
        self.assertNotEqual(id(r), id(loader.load()))

    def test_xmlstr(self):
        
        loader = loaders.xmlstr(self.nsdoc)
        self.assertEqual( id(loader.load()), id(loader.load()) )
        
        loader = loaders.xmlstr(self.nsdoc, pattern='1')
        self.assertEqual( id(loader.load()), id(loader.load()) )
        
        l1 = loaders.xmlstr(self.nsdoc, pattern='1')
        l2 = loaders.xmlstr(self.nsdoc, pattern='1')
        self.assertNotEqual( id(l1.load()), id(l2.load()) )
        
        l1 = loaders.xmlstr(self.nsdoc, pattern='1')
        l2 = loaders.xmlstr(self.nsdoc, pattern='2')
        self.assertNotEqual( id(l1.load()), id(l2.load()) )
        
    def test_xmlfile(self):
        
        temp = self.mktemp()
        f = file(temp, 'w')
        f.write(self.nsdoc)
        f.close()
        
        loader = loaders.xmlfile(temp)
        self.assertEqual( id(loader.load()), id(loader.load()) )
        
        loader = loaders.xmlfile(temp, pattern='1')
        self.assertEqual( id(loader.load()), id(loader.load()) )
        
        l1 = loaders.xmlfile(temp, pattern='1')
        l2 = loaders.xmlfile(temp, pattern='1')
        self.assertNotEqual( id(l1.load()), id(l2.load()) )
        
        l1 = loaders.xmlfile(temp, pattern='1')
        l2 = loaders.xmlfile(temp, pattern='2')
        self.assertNotEqual( id(l1.load()), id(l2.load()) )

    def test_xmlfileReload(self):
        
        temp = self.mktemp()
        f = file(temp, 'w')
        f.write(self.nsdoc)
        f.close()
        
        loader = loaders.xmlfile(temp)
        r = loader.load()
        self.assertEqual(id(r), id(loader.load()))
        os.utime(temp, (os.path.getatime(temp), os.path.getmtime(temp)+5))
        self.assertNotEqual(id(r), id(loader.load()))

    def test_reloadAfterPrecompile(self):
        """
        """

        # Get a filename
        temp = self.mktemp()

        # Write some content
        f = file(temp, 'w')
        f.write('<p>foo</p>')
        f.close()

        # Precompile the doc
        ctx = context.WovenContext()
        doc = loaders.htmlfile(temp)
        pc = flat.precompile(flat.flatten(doc), ctx)
        
        before = ''.join(flat.serialize(pc, ctx))


        # Write the file with different content and make sure the
        # timestamp changes
        f = file(temp, 'w')
        f.write('<p>bar</p>')
        f.close()
        os.utime(temp, (os.path.getatime(temp), os.path.getmtime(temp)+5))

        after = ''.join(flat.serialize(pc, ctx))

        self.assertIn('foo', before)
        self.assertIn('bar', after)
        self.assertNotEqual(before, after)

    test_reloadAfterPrecompile.skip = \
        'Fix so that disk templates are reloaded even after a precompile. ' \
        'Probably just a matter of making the DocSerializer really lazy'

        
class TestContext(unittest.TestCase):
    """Check that each of the standard loaders supports load with and without a
    context.
    """
    
    def test_stan(self):
        doc = p['hello']
        self._withAndWithout(loaders.stan(doc))
        
    def test_xmlstr(self):
        doc = '<p>hello</p>'
        self._withAndWithout(loaders.xmlstr(doc))
        
    def test_xmlfile(self):
        temp = self.mktemp()
        f = file(temp, 'w')
        f.write('<p>hello</p>')
        f.close()
        self._withAndWithout(loaders.xmlfile(temp))
        
    def test_htmlstr(self):
        doc = '<p>hello</p>'
        self._withAndWithout(loaders.htmlstr(doc))
        
    def test_htmlfile(self):
        temp = self.mktemp()
        f = file(temp, 'w')
        f.write('<p>hello</p>')
        f.close()
        self._withAndWithout(loaders.htmlfile(temp))
        
    def _withAndWithout(self, loader):
        ctx = context.WovenContext()
        self.assertEqual(loader.load(), ['<p>hello</p>'])
        self.assertEqual(loader.load(ctx), ['<p>hello</p>'])
        

class TestParsing(unittest.TestCase):

    def test_missingSpace(self):
        doc = '<p xmlns:nevow="http://nevow.com/ns/nevow/0.1"><nevow:slot name="foo"/> <nevow:slot name="foo"/></p>'
        ## This used to say htmlstr, and this test failed because microdom ignores whitespace;
        ## This test passes fine using xmlstr. I am not going to fix this because microdom is too
        ## hard to fix. If you need this, switch to xmlstr.
        result = loaders.xmlstr(doc).load()
        # There should be a space between the two slots
        self.assertEqual(result[2], ' ')
