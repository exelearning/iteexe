# Copyright (c) 2004 Divmod.
# See LICENSE for details.

from nevow.testutil import TestCase

from nevow.flat.flatsax import parse, parseString
from nevow.flat import flatten

def norm(s):
    return ' '.join(s.split())

class Basic(TestCase):

    def test_parseString(self):
        xml = '''<html></html>'''
        self.failUnlessEqual(norm(xml), norm(flatten(parseString(xml))))

    def test_attrs(self):
        xml = '''<p class="foo"></p>'''
        self.failUnlessEqual(norm(xml), norm(flatten(parseString(xml))))

    def test_xmlns(self):
        xml = '''<html xmlns="http://www.w3.org/1999/xhtml"></html>'''
        self.failUnlessEqual(norm(xml), norm(flatten(parseString(xml))))

    def test_processingInstruction(self):
        xml = '''<html></html>'''
        self.failUnlessEqual(norm(xml), norm(flatten(parseString(xml))))

    def test_doctype(self):
        xml = '''<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n<html></html>'''
        self.failUnlessEqual(norm(xml), norm(flatten(parseString(xml))))

    def test_entities(self):
        xml = """<p>&amp;</p>"""
        self.failUnlessEqual(norm(xml), norm(flatten(parseString(xml))))

    def test_cdata(self):
        xml = '''<script type="text/javascript"><![CDATA[&lt;abc]]></script>'''
        self.failUnlessEqual(norm(xml), norm(flatten(parseString(xml))))
    
    def test_comment(self):
        xml = '''<!-- comment &amp;&pound; --><html></html>'''
        self.failUnlessEqual(norm(xml), norm(flatten(parseString(xml))))

    def test_unicodeComment(self):
        xml = '''<!-- \xc2\xa3 --><html></html>'''
        self.failUnlessEqual(norm(xml), norm(flatten(parseString(xml))))

    def test_xmlAttr(self):
        xml = '''<html xml:lang="en"></html>'''
        self.failUnlessEqual(norm(xml), norm(flatten(parseString(xml))))

    def test_badNamespace(self):
        xml = '''<html foo:bar="wee"><abc:p>xyz</abc:p></html>'''
        self.failUnlessEqual(norm(xml), norm(flatten(parseString(xml))))
    test_badNamespace.skip = 'the standard 2.3 sax parser likes all namespaces to be defined so this test fails. it does pass with python-xml'

    def test_switchns(self):
        xml = '''<html xmlns="http://www.w3.org/1999/xhtml"><p>in default namespace</p><div xmlns:foo="http://www.w3.org/1999/xhtml"><foo:p>in foo namespace</foo:p></div></html>'''
        self.failUnlessEqual(norm(xml), norm(flatten(parseString(xml))))
    test_switchns.todo = 'fix me sometime'
