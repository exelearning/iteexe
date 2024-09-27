# -*- test-case-name: twisted.web.test.test_xml -*-
#
# Copyright (c) 2001-2004 Twisted Matrix Laboratories.
# See LICENSE for details.

#

"""Some fairly inadequate testcases for Twisted XML support."""



from twisted.trial.unittest import TestCase

from twisted.web import sux

from twisted.web import microdom

from twisted.web import domhelpers

class Sux0r(sux.XMLParser):
    def __init__(self):
        self.tokens = []

    def getTagStarts(self):
        return [token for token in self.tokens if token[0] == 'start']

    def gotTagStart(self, name, attrs):
        self.tokens.append(("start", name, attrs))

    def gotText(self, text):
        self.tokens.append(("text", text))

class SUXTest(TestCase):

    def testBork(self):
        s = "<bork><bork><bork>"
        ms = Sux0r()
        ms.connectionMade()
        ms.dataReceived(s)
        self.assertEqual(len(ms.getTagStarts()),3)


class MicroDOMTest(TestCase):

    def testCaseSensitiveSoonCloser(self):
	s = """
	      <HTML><BODY>
	      <P ALIGN="CENTER">
		<A HREF="http://www.apache.org/"><IMG SRC="/icons/apache_pb.gif"></A>
	      </P>

	      <P>
		This is an insane set of text nodes that should NOT be gathered under
		the A tag above.
	      </P>
	      </BODY></HTML>
	    """
	d = microdom.parseString(s, beExtremelyLenient=1)
        l = domhelpers.findNodesNamed(d.documentElement, 'a')
	n = domhelpers.gatherTextNodes(l[0],1).replace('&nbsp;',' ')
	self.assertEqual(n.find('insane'), -1)

    def testUnEntities(self):
	s = """
		<HTML>
		    This HTML goes between Stupid <=CrAzY!=> Dumb. 
		</HTML>
	    """
	d = microdom.parseString(s, beExtremelyLenient=1)
	n = domhelpers.gatherTextNodes(d)
	self.assertNotEqual(n.find('>'), -1)

    def testEmptyError(self):
        self.assertRaises(sux.ParseError, microdom.parseString, "")

    def testTameDocument(self):
        s = """
        <test>
         <it>
          <is>
           <a>
            test
           </a>
          </is>
         </it>
        </test>
        """
        d = microdom.parseString(s)
        self.assertEqual(
            domhelpers.gatherTextNodes(d.documentElement).strip() ,'test')

    def testAwfulTagSoup(self):
        s = """
        <html>
        <head><title> I send you this message to have your advice!!!!</titl e
        </headd>

        <body bgcolor alink hlink vlink>

        <h1><BLINK>SALE</blINK> TWENTY MILLION EMAILS & FUR COAT NOW
        FREE WITH `ENLARGER'</h1>

        YES THIS WONDERFUL AWFER IS NOW HERER!!!

        <script LANGUAGE="javascript">
function give_answers() {
if (score < 70) {
alert("I hate you");
}}
        </script><a href=/foo.com/lalal name=foo>lalal</a>
        </body>
        </HTML>
        """
        d = microdom.parseString(s, beExtremelyLenient=1)
        l = domhelpers.findNodesNamed(d.documentElement, 'blink')
        self.assertEqual(len(l), 1)

    def testScriptLeniency(self):
        s = """
        <script>(foo < bar) and (bar > foo)</script>
        <script language="javascript">foo </scrip bar </script>
        <script src="foo">
        <script src="foo">baz</script>
        <script /><script></script>
        """
        d = microdom.parseString(s, beExtremelyLenient=1)
        self.assertEqual(d.firstChild().firstChild().firstChild().data,
                          "(foo < bar) and (bar > foo)")
        self.assertEqual(d.firstChild().getElementsByTagName("script")[1].firstChild().data,
                          "foo </scrip bar ")

    def testScriptLeniencyIntelligence(self):
        # if there is comment or CDATA in script, the autoquoting in bEL mode
        # should not happen
        s = """<script><!-- lalal --></script>"""
        self.assertEqual(microdom.parseString(s, beExtremelyLenient=1).firstChild().toxml(), s)
        s = """<script><![CDATA[lalal]]></script>"""
        self.assertEqual(microdom.parseString(s, beExtremelyLenient=1).firstChild().toxml(), s)
        s = """<script> // <![CDATA[
        lalal
        //]]></script>"""
        self.assertEqual(microdom.parseString(s, beExtremelyLenient=1).firstChild().toxml(), s)
        
    def testPreserveCase(self):
        s = '<eNcApSuLaTe><sUxor></sUxor><bOrk><w00T>TeXt</W00t></BoRk></EnCaPsUlAtE>'
        s2 = s.lower().replace('text', 'TeXt')
        # these are the only two option permutations that *can* parse the above
        d = microdom.parseString(s, caseInsensitive=1, preserveCase=1)
        d2 = microdom.parseString(s, caseInsensitive=1, preserveCase=0)
        # caseInsensitive=0 preserveCase=0 is not valid, it's converted to
        # caseInsensitive=0 preserveCase=1
        d3 = microdom.parseString(s2, caseInsensitive=0, preserveCase=1)
        d4 = microdom.parseString(s2, caseInsensitive=1, preserveCase=0)
        d5 = microdom.parseString(s2, caseInsensitive=1, preserveCase=1)
        # this is slightly contrived, toxml() doesn't need to be identical
        # for the documents to be equivalent (i.e. <b></b> to <b/>),
        # however this assertion tests preserving case for start and
        # end tags while still matching stuff like <bOrk></BoRk>
        self.assertEqual(d.documentElement.toxml(), s)
        self.assertTrue(d.isEqualToDocument(d2), "%r != %r" % (d.toxml(), d2.toxml()))
        self.assertTrue(d2.isEqualToDocument(d3), "%r != %r" % (d2.toxml(), d3.toxml()))
        # caseInsensitive=0 on the left, NOT perserveCase=1 on the right
        ## XXX THIS TEST IS TURNED OFF UNTIL SOMEONE WHO CARES ABOUT FIXING IT DOES
        #self.failIf(d3.isEqualToDocument(d2), "%r == %r" % (d3.toxml(), d2.toxml()))
        self.assertTrue(d3.isEqualToDocument(d4), "%r != %r" % (d3.toxml(), d4.toxml()))
        self.assertTrue(d4.isEqualToDocument(d5), "%r != %r" % (d4.toxml(), d5.toxml()))

    def testDifferentQuotes(self):
        s = '<test a="a" b=\'b\' />'
        d = microdom.parseString(s)
        e = d.documentElement
        self.assertEqual(e.getAttribute('a'), 'a')
        self.assertEqual(e.getAttribute('b'), 'b')

    def testLinebreaks(self):
        s = '<test \na="a"\n\tb="#b" />'
        d = microdom.parseString(s)
        e = d.documentElement
        self.assertEqual(e.getAttribute('a'), 'a')
        self.assertEqual(e.getAttribute('b'), '#b')

    def testMismatchedTags(self):
        for s in '<test>', '<test> </tset>', '</test>':
            self.assertRaises(microdom.MismatchedTags, microdom.parseString, s)

    def testComment(self):
        s = "<bar><!--<foo />--></bar>"
        d = microdom.parseString(s)
        e = d.documentElement
        self.assertEqual(e.nodeName, "bar")
        c = e.childNodes[0]
        self.assertTrue(isinstance(c, microdom.Comment))
        self.assertEqual(c.value, "<foo />")
        c2 = c.cloneNode()
        self.assertTrue(c is not c2)
        self.assertEqual(c2.toxml(), "<!--<foo />-->")

    def testText(self):
        d = microdom.parseString("<bar>xxxx</bar>").documentElement
        text = d.childNodes[0]
        self.assertTrue(isinstance(text, microdom.Text))
        self.assertEqual(text.value, "xxxx")
        clone = text.cloneNode()
        self.assertTrue(clone is not text)
        self.assertEqual(clone.toxml(), "xxxx")

    def testEntities(self):
        nodes = microdom.parseString("<b>&amp;&#12AB;</b>").documentElement.childNodes
        self.assertEqual(len(nodes), 2)
        self.assertEqual(nodes[0].data, "&amp;")
        self.assertEqual(nodes[1].data, "&#12AB;")
        self.assertEqual(nodes[0].cloneNode().toxml(), "&amp;")
        for n in nodes:
            self.assertTrue(isinstance(n, microdom.EntityReference))

    def testCData(self):
        s = '<x><![CDATA[</x>\r\n & foo]]></x>'
        cdata = microdom.parseString(s).documentElement.childNodes[0]
        self.assertTrue(isinstance(cdata, microdom.CDATASection))
        self.assertEqual(cdata.data, "</x>\r\n & foo")
        self.assertEqual(cdata.cloneNode().toxml(), "<![CDATA[</x>\r\n & foo]]>")

    def testSingletons(self):
        s = "<foo><b/><b /><b\n/></foo>"
        s2 = "<foo><b/><b/><b/></foo>"
        nodes = microdom.parseString(s).documentElement.childNodes
        nodes2 = microdom.parseString(s2).documentElement.childNodes
        self.assertEqual(len(nodes), 3)
        for (n, n2) in zip(nodes, nodes2):
            self.assertTrue(isinstance(n, microdom.Element))
            self.assertEqual(n.nodeName, "b")
            self.assertTrue(n.isEqualToNode(n2))

    def testAttributes(self):
        s = '<foo a="b" />'
        node = microdom.parseString(s).documentElement

        self.assertEqual(node.getAttribute("a"), "b")
        self.assertEqual(node.getAttribute("c"), None)
        self.assertTrue(node.hasAttribute("a"))
        self.assertTrue(not node.hasAttribute("c"))
        a = node.getAttributeNode("a")
        self.assertEqual(a.value, "b")

        node.setAttribute("foo", "bar")
        self.assertEqual(node.getAttribute("foo"), "bar")

    def testChildren(self):
        s = "<foo><bar /><baz /><bax>foo</bax></foo>"
        d = microdom.parseString(s).documentElement
        self.assertEqual([n.nodeName for n in d.childNodes], ["bar", "baz", "bax"])
        self.assertEqual(d.lastChild().nodeName, "bax")
        self.assertEqual(d.firstChild().nodeName, "bar")
        self.assertTrue(d.hasChildNodes())
        self.assertTrue(not d.firstChild().hasChildNodes())

    def testMutate(self):
        s = "<foo />"
        s1 = '<foo a="b"><bar/><foo/></foo>'
        s2 = '<foo a="b">foo</foo>'
        d = microdom.parseString(s).documentElement
        d1 = microdom.parseString(s1).documentElement
        d2 = microdom.parseString(s2).documentElement

        d.appendChild(d.cloneNode())
        d.setAttribute("a", "b")
        child = d.childNodes[0]
        self.assertEqual(child.getAttribute("a"), None)
        self.assertEqual(child.nodeName, "foo")

        d.insertBefore(microdom.Element("bar"), child)
        self.assertEqual(d.childNodes[0].nodeName, "bar")
        self.assertEqual(d.childNodes[1], child)
        for n in d.childNodes:
            self.assertEqual(n.parentNode, d)
        self.assertTrue(d.isEqualToNode(d1))

        d.removeChild(child)
        self.assertEqual(len(d.childNodes), 1)
        self.assertEqual(d.childNodes[0].nodeName, "bar")

        t = microdom.Text("foo")
        d.replaceChild(t, d.firstChild())
        self.assertEqual(d.firstChild(), t)
        self.assertTrue(d.isEqualToNode(d2))

    def testSearch(self):
        s = "<foo><bar id='me' /><baz><foo /></baz></foo>"
        s2 = "<fOo><bAr id='me' /><bAz><fOO /></bAz></fOo>"
        d = microdom.parseString(s)
        d2 = microdom.parseString(s2, caseInsensitive=0, preserveCase=1)
        d3 = microdom.parseString(s2, caseInsensitive=1, preserveCase=1)

        root = d.documentElement
        self.assertEqual(root.firstChild(), d.getElementById('me'))
        self.assertEqual(d.getElementsByTagName("foo"),
                          [root, root.lastChild().firstChild()])

        root = d2.documentElement
        self.assertEqual(root.firstChild(), d2.getElementById('me'))
        self.assertEqual(d2.getElementsByTagName('fOo'), [root])
        self.assertEqual(d2.getElementsByTagName('fOO'),
                          [root.lastChild().firstChild()])
        self.assertEqual(d2.getElementsByTagName('foo'), [])

        root = d3.documentElement
        self.assertEqual(root.firstChild(), d3.getElementById('me'))
        self.assertEqual(d3.getElementsByTagName('FOO'),
                          [root, root.lastChild().firstChild()])
        self.assertEqual(d3.getElementsByTagName('fOo'),
                          [root, root.lastChild().firstChild()])

    def testDoctype(self):
        s = ('<?xml version="1.0"?>'
        '<!DOCTYPE foo PUBLIC "baz" "http://www.example.com/example.dtd">'
        '<foo></foo>')
        s2 = '<foo/>'
        d = microdom.parseString(s)
        d2 = microdom.parseString(s2)
        self.assertEqual(d.doctype, 'foo PUBLIC "baz" "http://www.example.com/example.dtd"')
        self.assertEqual(d.toxml(), s)
        self.assertFalse(d.isEqualToDocument(d2))
        self.assertTrue(d.documentElement.isEqualToNode(d2.documentElement))

    samples = [("<img/>", "<img />"),
               ("<foo A='b'>x</foo>", '<foo A="b">x</foo>'),
               ("<foo><BAR /></foo>", "<foo><BAR></BAR></foo>"),
               ("<foo>hello there &amp; yoyoy</foo>", "<foo>hello there &amp; yoyoy</foo>"),
               ]

    def testOutput(self):
        for s, out in self.samples:
            d = microdom.parseString(s, caseInsensitive=0)
            d2 = microdom.parseString(out, caseInsensitive=0)
            testOut = d.documentElement.toxml()
            self.assertEqual(out, testOut)
            self.assertTrue(d.isEqualToDocument(d2))

    def testErrors(self):
        for s in ["<foo>&am</foo>", "<foo", "<f>&</f>", "<() />"]:
            self.assertRaises(Exception, microdom.parseString, s)

    def testCaseInsensitive(self):
        s  = "<foo a='b'><BAx>x</bax></FOO>"
        s2 = '<foo a="b"><bax>x</bax></foo>'
        s3 = "<FOO a='b'><BAx>x</BAx></FOO>"
        s4 = "<foo A='b'>x</foo>"
        d = microdom.parseString(s)
        d2 = microdom.parseString(s2)
        d3 = microdom.parseString(s3, caseInsensitive=1)
        d4 = microdom.parseString(s4, caseInsensitive=1, preserveCase=1)
        d5 = microdom.parseString(s4, caseInsensitive=1, preserveCase=0)
        d6 = microdom.parseString(s4, caseInsensitive=0, preserveCase=0)
        out = microdom.parseString(s).documentElement.toxml()
        self.assertRaises(microdom.MismatchedTags, microdom.parseString,
            s, caseInsensitive=0)
        self.assertEqual(out, s2)
        self.assertTrue(d.isEqualToDocument(d2))
        self.assertTrue(d.isEqualToDocument(d3))
        self.assertTrue(d4.documentElement.hasAttribute('a'))
        self.assertFalse(d6.documentElement.hasAttribute('a'))
        self.assertEqual(d4.documentElement.toxml(), '<foo A="b">x</foo>')
        self.assertEqual(d5.documentElement.toxml(), '<foo a="b">x</foo>')
    def testEatingWhitespace(self):
        s = """<hello>
        </hello>"""
        d = microdom.parseString(s)
        self.assertTrue(not d.documentElement.hasChildNodes(),
                        d.documentElement.childNodes)
        self.assertTrue(d.isEqualToDocument(microdom.parseString('<hello></hello>')))

    def testLenientAmpersand(self):
        prefix = "<?xml version='1.0'?>"
        # we use <pre> so space will be preserved
        for i, o in [("&", "&amp;"),
                     ("& ", "&amp; "),
                     ("&amp;", "&amp;"),
                     ("&hello monkey", "&amp;hello monkey")]:
            d = microdom.parseString("%s<pre>%s</pre>" % (prefix, i), beExtremelyLenient=1)
            self.assertEqual(d.documentElement.toxml(), "<pre>%s</pre>" % o)
        # non-space preserving
        d = microdom.parseString("%s<t>hello & there</t>", beExtremelyLenient=1)
        self.assertEqual(d.documentElement.toxml(), "<t>hello &amp; there</t>")
    
    def testInsensitiveLenient(self):
        # testing issue #537
        d = microdom.parseString("<?xml version='1.0'?><bar><xA><y>c</Xa> <foo></bar>", beExtremelyLenient=1)
        self.assertEqual(d.documentElement.firstChild().toxml(), "<xa><y>c</y></xa>")

    def testSpacing(self):
        # testing issue #414
        s = "<?xml version='1.0'?><p><q>smart</q> <code>HairDryer</code></p>"
        d = microdom.parseString(s, beExtremelyLenient=1)
        expected = "<p><q>smart</q> <code>HairDryer</code></p>"
        actual = d.documentElement.toxml()
        self.assertEqual(expected, actual)

    testSpacing.todo = "AAARGH white space swallowing screws this up"

    def testLaterCloserSimple(self):
        s = "<ul><li>foo<li>bar<li>baz</ul>"
        d = microdom.parseString(s, beExtremelyLenient=1)
        expected = "<ul><li>foo</li><li>bar</li><li>baz</li></ul>"
        actual = d.documentElement.toxml()
        self.assertEqual(expected, actual)

    def testLaterCloserTable(self):
        s = ("<table>"
             "<tr><th>name<th>value<th>comment"
             "<tr><th>this<td>tag<td>soup"
             "<tr><th>must<td>be<td>handled"
             "</table>")
        expected = ("<table>"
                    "<tr><th>name</th><th>value</th><th>comment</th></tr>"
                    "<tr><th>this</th><td>tag</td><td>soup</td></tr>"
                    "<tr><th>must</th><td>be</td><td>handled</td></tr>"
                    "</table>")
        d = microdom.parseString(s, beExtremelyLenient=1)
        actual = d.documentElement.toxml()
        self.assertEqual(expected, actual)
        
    testLaterCloserTable.todo = "Table parsing needs to be fixed."
    
    def testLaterCloserDL(self):
        s = ("<dl>"
             "<dt>word<dd>definition"
             "<dt>word<dt>word<dd>definition<dd>definition"
             "</dl>")
        expected = ("<dl>"
                    "<dt>word</dt><dd>definition</dd>"
                    "<dt>word</dt><dt>word</dt><dd>definition</dd><dd>definition</dd>"
                    "</dl>")
        d = microdom.parseString(s, beExtremelyLenient=1)
        actual = d.documentElement.toxml()
        self.assertEqual(expected, actual)

    def testLaterCloserDL2(self):
        s = ("<dl>"
             "<dt>word<dd>definition<p>more definition"
             "<dt>word"
             "</dl>")
        expected = ("<dl>"
                    "<dt>word</dt><dd>definition<p>more definition</p></dd>"
                    "<dt>word</dt>"
                    "</dl>")
        d = microdom.parseString(s, beExtremelyLenient=1)
        actual = d.documentElement.toxml()
        self.assertEqual(expected, actual)

    testLaterCloserDL2.todo = "unclosed <p> messes it up."
    
    def testUnicodeTolerance(self):
        import struct
        s = '<foo><bar><baz /></bar></foo>'
        j =('<?xml version="1.0" encoding="UCS-2" ?>\r\n<JAPANESE>\r\n'
            '<TITLE>\u5c02\u9580\u5bb6\u30ea\u30b9\u30c8 </TITLE></JAPANESE>')
        j2=('\xff\xfe<\x00?\x00x\x00m\x00l\x00 \x00v\x00e\x00r\x00s\x00i\x00o'
            '\x00n\x00=\x00"\x001\x00.\x000\x00"\x00 \x00e\x00n\x00c\x00o\x00d'
            '\x00i\x00n\x00g\x00=\x00"\x00U\x00C\x00S\x00-\x002\x00"\x00 \x00?'
            '\x00>\x00\r\x00\n\x00<\x00J\x00A\x00P\x00A\x00N\x00E\x00S\x00E'
            '\x00>\x00\r\x00\n\x00<\x00T\x00I\x00T\x00L\x00E\x00>\x00\x02\\'
            '\x80\x95\xb6[\xea0\xb90\xc80 \x00<\x00/\x00T\x00I\x00T\x00L\x00E'
            '\x00>\x00<\x00/\x00J\x00A\x00P\x00A\x00N\x00E\x00S\x00E\x00>\x00')
        def reverseBytes(s):
            fmt = str(len(s) / 2) + 'H'
            return struct.pack('<' + fmt, *struct.unpack('>' + fmt, s))
        urd = microdom.parseString(reverseBytes(s.encode('UTF-16')))
        ud = microdom.parseString(s.encode('UTF-16'))
        sd = microdom.parseString(s)
        self.assertTrue(ud.isEqualToDocument(sd))
        self.assertTrue(ud.isEqualToDocument(urd))
        ud = microdom.parseString(j)
        urd = microdom.parseString(reverseBytes(j2))
        sd = microdom.parseString(j2)
        self.assertTrue(ud.isEqualToDocument(sd))
        self.assertTrue(ud.isEqualToDocument(urd))

        # test that raw text still gets encoded
        # test that comments get encoded
        j3=microdom.parseString('<foo/>')
        hdr='<?xml version="1.0"?>'
        div=microdom.lmx().text('\u221a', raw=1).node
        de=j3.documentElement
        de.appendChild(div)
        de.appendChild(j3.createComment('\u221a'))
        self.assertEqual(j3.toxml(), hdr+
                          '<foo><div>\u221a</div><!--\u221a--></foo>'.encode('utf8'))

    def testNamedChildren(self):
        tests = {"<foo><bar /><bar unf='1' /><bar>asdfadsf</bar>"
                         "<bam/></foo>" : 3,
                 '<foo>asdf</foo>' : 0,
                 '<foo><bar><bar></bar></bar></foo>' : 1,
                 }
        for t in list(tests.keys()):
            node = microdom.parseString(t).documentElement
            result = domhelpers.namedChildren(node, 'bar')
            self.assertEqual(len(result), tests[t])
            if result:
                self.assertTrue(hasattr(result[0], 'tagName'))

    def testCloneNode(self):
        s = '<foo a="b"><bax>x</bax></foo>'
        node = microdom.parseString(s).documentElement
        clone = node.cloneNode(deep=1)
        self.failIfEquals(node, clone)
        self.assertEqual(len(node.childNodes), len(clone.childNodes))
        c1, c2 = node.firstChild(), clone.firstChild()
        self.failIfEquals(c1, c2)
        self.assertEqual(len(c1.childNodes), len(c2.childNodes))
        self.failIfEquals(c1.firstChild(), c2.firstChild())
        self.assertEqual(s, clone.toxml())
        self.assertEqual(node.namespace, clone.namespace)

    def testCloneDocument(self):
        # sorry bout the >80 cols, but whitespace is a sensitive thing
        s = '''<?xml version="1.0"?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><foo></foo>'''

        node = microdom.parseString(s)
        clone = node.cloneNode(deep=1)
        self.failIfEquals(node, clone)
        self.assertEqual(len(node.childNodes), len(clone.childNodes))
        self.assertEqual(s, clone.toxml())

        self.assertTrue(clone.isEqualToDocument(node))
        self.assertTrue(node.isEqualToDocument(clone))


    def testLMX(self):
        n = microdom.Element("p")
        lmx = microdom.lmx(n)
        lmx.text("foo")
        b = lmx.b(a="c")
        b.foo()["z"] = "foo"
        b.foo()
        b.add("bar", c="y")

        s = '<p>foo<b a="c"><foo z="foo"></foo><foo></foo><bar c="y"></bar></b></p>'
        self.assertEqual(s, n.toxml())

    def testDict(self):
        n = microdom.Element("p")
        d = {n : 1} # will fail if Element is unhashable

    def testEscaping(self):
        # issue 590
        raw = "&'some \"stuff\"', <what up?>"
        cooked = "&amp;'some &quot;stuff&quot;', &lt;what up?&gt;"
        esc1 = microdom.escape(raw)
        self.assertEqual(esc1, cooked)
        self.assertEqual(microdom.unescape(esc1), raw)

    def testNamespaces(self):
        s = '''
        <x xmlns="base">
        <y />
        <y q="1" x:q="2" y:q="3" />
        <y:y xml:space="1">here is    some space </y:y>
        <y:y />
        <x:y />
        </x>
        '''
        d = microdom.parseString(s)
        # at least make sure it doesn't traceback
        s2 = d.toprettyxml()
        self.assertEqual(d.documentElement.namespace,
                          "base")
        self.assertEqual(d.documentElement.getElementsByTagName("y")[0].namespace,
                          "base")
        self.assertEqual(d.documentElement.getElementsByTagName("y")[1].getAttributeNS('base','q'),
                          '1')
        
        d2 = microdom.parseString(s2)
        self.assertEqual(d2.documentElement.namespace,
                          "base")
        self.assertEqual(d2.documentElement.getElementsByTagName("y")[0].namespace,
                          "base")
        self.assertEqual(d2.documentElement.getElementsByTagName("y")[1].getAttributeNS('base','q'),
                          '1')
