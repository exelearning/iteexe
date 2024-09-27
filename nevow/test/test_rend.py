# Copyright (c) 2004 Divmod.
# See LICENSE for details.

from twisted.internet import defer
from twisted.trial import unittest

from nevow import appserver
from nevow import compy
from nevow import inevow
from nevow import context
from nevow import flat
from nevow import rend
from nevow import loaders
from nevow.stan import slot
from nevow.tags import *
from nevow import testutil
from nevow import url
from nevow import util

import formless
from formless import webform as freeform
from formless import iformless


class req(testutil.FakeRequest):
    __implements__ = iformless.IFormDefaults
    method = 'GET'
    def __init__(self):
        testutil.FakeRequest.__init__(self)
        self.d = defer.Deferred()
        self.accumulator = ''

    def write(self, data):
        testutil.FakeRequest.write(self, data)
        self.accumulator+=data

    def getDefault(self, key, context):
        return ''

    def remember(self, object, interface):
        pass


def deferredRender(res):
    defres = req()
    d = util.maybeDeferred(res.renderHTTP,
        context.PageContext(
            tag=res, parent=context.RequestContext(
                tag=defres)))

    def done(result):
        if isinstance(result, str):
            defres.write(result)
        defres.d.callback(defres.accumulator)
        return result
    d.addCallback(done)
    return unittest.deferredResult(defres.d, 1)


class TestPage(unittest.TestCase):

    def test_simple(self):
        xhtml = '<ul id="nav"><li>one</li><li>two</li><li>three</li></ul>'
        r = rend.Page(docFactory=loaders.htmlstr(xhtml))
        result = deferredRender(r)
        self.assertEqual(result, xhtml)

    def test_extend(self):
        xhtml = '<ul id="nav"><li>one</li><li>two</li><li>three</li></ul>'
        class R(rend.Page):
            docFactory = loaders.htmlstr(xhtml)
        r = R()
        result = deferredRender(r)
        self.assertEqual(result, xhtml)
            
    def test_data(self):

        xhtml = '<ul id="nav" nevow:data="numbers" nevow:render="sequence"><li nevow:pattern="item" nevow:render="string">number</li></ul>'
        
        class R(rend.Page):
            docFactory = loaders.htmlstr(xhtml)
            def data_numbers(self, context, data):
                return ['one', 'two', 'three']
        r = R()
        result = deferredRender(r)
        self.assertEqual(result, '<ul id="nav"><li>one</li><li>two</li><li>three</li></ul>')

    def test_noData(self):
        """Test when data is missing, i.e. self.original is None and no data
        directives had been used"""
        class R(rend.Page):
            docFactory = loaders.htmlstr('<p nevow:render="foo"></p>')
            def render_foo(self, ctx, data):
                return ctx.tag.clear()[data]
        r = R()
        result = deferredRender(r)
        self.assertIn('None', result)
        
    def test_render(self):

        xhtml = '<span nevow:render="replace">replace this</span>'

        class R(rend.Page):
            docFactory = loaders.htmlstr(xhtml)
            def render_replace(self, context, data):
                return context.tag.clear()['abc']

        r = R()
        result = deferredRender(r)
        self.assertEqual(result, '<span>abc</span>')
        
    def test_dataAndRender(self):

        xhtml = '''
        <table nevow:data="numbers" nevow:render="sequence">
        <tr nevow:pattern="header"><th>English</th><th>French</th></tr>
        <tr nevow:pattern="item" nevow:render="row"><td><nevow:slot name="english"/></td><td><nevow:slot name="french"/></td></tr>
        </table>
        '''

        class R(rend.Page):
            docFactory = loaders.htmlstr(xhtml)
            def data_numbers(self, context, data):
                return [
                    ['one', 'un/une'],
                    ['two', 'deux'],
                    ['three', 'trois'],
                    ]
            def render_row(self, context, data):
                context.fillSlots('english', data[0])
                context.fillSlots('french', data[1])
                return context.tag

        r = R()
        result = deferredRender(r)
        self.assertEqual(result, '<table><tr><th>English</th><th>French</th></tr><tr><td>one</td><td>un/une</td></tr><tr><td>two</td><td>deux</td></tr><tr><td>three</td><td>trois</td></tr></table>')

    def test_stanData(self):

        class R(rend.Page):
            def data_numbers(context, data):
                return ['one', 'two', 'three']
            tags = ul(data=data_numbers, render=directive('sequence'))[
                li(pattern='item')[span(render=str)]
                ]
            docFactory = loaders.stan(tags)
        
        r = R()
        result = deferredRender(r)
        self.assertEqual(result, '<ul><li>one</li><li>two</li><li>three</li></ul>')
        
    def test_stanRender(self):


        class R(rend.Page):
            def render_replace(context, data):
                return context.tag.clear()['abc']
            tags = span(render=render_replace)['replace this']
            docFactory = loaders.stan(tags)

        r = R()
        result = deferredRender(r)
        self.assertEqual(result, '<span>abc</span>')
        
    def test_stanDataAndRender(self):

        class R(rend.Page):

            def data_numbers(context, data):
                return [
                    ['one', 'un/une'],
                    ['two', 'deux'],
                    ['three', 'trois'],
                    ]

            def render_row(context, data):
                context.fillSlots('english', data[0])
                context.fillSlots('french', data[1])
                return context.tag

            tags = table(data=data_numbers, render=directive('sequence'))[
                tr(pattern='header')[th['English'], th['French']],
                tr(pattern='item', render=render_row)[td[slot('english')], td[slot('french')]],
                ]

            docFactory = loaders.stan(tags)
            
        r = R()
        result = deferredRender(r)
        self.assertEqual(result, '<table><tr><th>English</th><th>French</th></tr><tr><td>one</td><td>un/une</td></tr><tr><td>two</td><td>deux</td></tr><tr><td>three</td><td>trois</td></tr></table>')

    def test_composite(self):

        class R(rend.Page):

            def render_inner(self, context, data):
                return rend.Page(docFactory=loaders.stan(div(id='inner')))

            docFactory = loaders.stan(
                div(id='outer')[
                    span(render=render_inner)
                    ]
                )
        r = R()
        result = deferredRender(r)
        self.assertEqual(result, '<div id="outer"><div id="inner"></div></div>')

    def test_docFactoryInStanTree(self):

        class Page(rend.Page):

            def __init__(self, included):
                self.included = included
                rend.Page.__init__(self)

            def render_included(self, context, data):
                return self.included
            
            docFactory = loaders.stan(div[invisible(render=directive('included'))])

        doc = '<p>fum</p>'
        temp = self.mktemp()
        f = file(temp, 'w')
        f.write(doc)
        f.close()

        result = deferredRender(Page(loaders.stan(p['fee'])))
        self.assertEqual(result, '<div><p>fee</p></div>')
        result = deferredRender(Page(loaders.htmlstr('<p>fi</p>')))
        self.assertEqual(result, '<div><p>fi</p></div>')
        result = deferredRender(Page(loaders.xmlstr('<p>fo</p>')))
        self.assertEqual(result, '<div><p>fo</p></div>')
        result = deferredRender(Page(loaders.htmlfile(temp)))
        self.assertEqual(result, '<div><p>fum</p></div>')
        result = deferredRender(Page(loaders.xmlfile(temp)))
        self.assertEqual(result, '<div><p>fum</p></div>')
        

    def test_buffered(self):

        class Page(rend.Page):
            buffered = True
            docFactory = loaders.stan(html[head[title['test']]])

        p = Page()
        result = deferredRender(p)
        self.assertEqual(result, '<html><head><title>test</title></head></html>')
        
    def test_component(self):
        """
        Test that the data is remembered correctly when a Page is embedded in
        a component-like manner.
        """

        class Data:
            foo = 'foo'
            bar = 'bar'

        class Component(rend.Fragment):

            def render_foo(self, context, data):
                return data.foo

            def render_bar(self, context, data):
                return data.bar

            docFactory = loaders.stan(p[render_foo, ' ', render_bar])

        class Page(rend.Page):
            docFactory = loaders.stan(div[Component(Data())])

        page = Page()
        result = deferredRender(page)
        self.assertEqual(result, '<div><p>foo bar</p></div>')
        

class TestRenderFactory(unittest.TestCase):
    
    def test_dataRenderer(self):
        ctx = context.WovenContext()
        ctx.remember(rend.RenderFactory(), inevow.IRendererFactory)
        self.assertEqual(flat.flatten(p(data='foo', render=directive('data')), ctx), '<p>foo</p>')

        
class IThing(formless.TypedInterface):
    foo = formless.String()

class Thing:
    __implements__ = IThing

class TestLocateConfigurable(unittest.TestCase):

    def test_onSelf(self):

        class Page(rend.Page):
            __implements__ = rend.Page.__implements__, IThing
            docFactory = loaders.stan(html[freeform.renderForms()])

        page = Page()
        result = deferredRender(page)

    def test_onSelfOriginal(self):

        class Page(rend.Page):
            docFactory = loaders.stan(html[freeform.renderForms('original')])

        page = Page(Thing())
        result = deferredRender(page)

    def test_onKeyedConfigurable(self):

        class Page(rend.Page):

            def __init__(self):
                rend.Page.__init__(self)
                self.thing = Thing()

            def configurable_thing(self, context):
                return self.thing

            docFactory = loaders.stan(html[freeform.renderForms('thing')])

        page = Page()
        result = deferredRender(page)


class TestDeferredDefaultValue(unittest.TestCase):
    def test_deferredProperty(self):
        class IDeferredProperty(formless.TypedInterface):
            d = formless.String()

        from nevow import util
        deferred = util.Deferred()
        deferred.callback('the default value')
        class Implementation(object):
            __implements__ = IDeferredProperty,
            d = deferred

        result = deferredRender(rend.Page(Implementation(), docFactory=loaders.stan(html[freeform.renderForms('original')])))

        self.assertIn('value="the default value"', result)
            

class TestRenderString(unittest.TestCase):
    
    def test_simple(self):

        doc = div[p['foo'],p['bar']]
        result = unittest.deferredResult(
            rend.Page(docFactory=loaders.stan(doc)).renderString()
            )
        self.assertEqual(result, '<div><p>foo</p><p>bar</p></div>')

    def test_remembers(self):

        class Page(rend.Page):
            docFactory = loaders.stan(
                html[
                    body[
                        p(data=directive('foo'), render=directive('bar'))
                        ]
                    ]
                )
            def data_foo(self, ctx, data):
                return 'foo'
            def render_bar(self, ctx, data):
                return ctx.tag.clear()[data+'bar']

        result = unittest.deferredResult(Page().renderString())
        self.assertEqual(result, '<html><body><p>foobar</p></body></html>')


def getResource(root, path):
    return unittest.deferredResult(
        appserver.NevowSite(root).getPageContextForRequestContext(
            context.RequestContext(
                tag=testutil.FakeRequest(uri=path)))
    )


class TestLocateChild(unittest.TestCase):

    def test_inDict(self):
        class Child(rend.Page):
            pass
        class Parent(rend.Page):
            pass
        p = Parent()
        p.putChild('child', Child())
        r = getResource(p, '/child')
        self.assertTrue(compy.implements(r.tag, inevow.IResource))

    def test_resourceAttr(self):
        class Child(rend.Page):
            pass
        class Parent(rend.Page):
            child_child = Child()
        p = Parent()
        r = getResource(p, '/child')
        self.assertTrue(compy.implements(r.tag, inevow.IResource))

    def test_methodAttr(self):
        class Child(rend.Page):
            pass
        class Parent(rend.Page):
            def child_now(self, request):
                return Child()
            def child_defer(self, request):
                return defer.succeed(None).addCallback(lambda x: Child())
        p = Parent()
        r = getResource(p, '/now')

        self.assertTrue(compy.implements(r.tag, inevow.IResource))

        r = getResource(p, '/defer')

        self.assertTrue(compy.implements(r.tag, inevow.IResource))

    def test_getDynamicChild(self):
        class Child(rend.Page):
            pass
        class Parent(rend.Page):
            def getDynamicChild(self, name, request):
                if name == 'now':
                    return Child()
                if name == 'defer':
                    return defer.succeed(None).addCallback(lambda x: Child())
        p = Parent()
        r = getResource(p, '/now')
        self.assertTrue(compy.implements(r.tag, inevow.IResource))

        r = getResource(p, '/defer')
        self.assertTrue(compy.implements(r.tag, inevow.IResource))

    def test_oldResource(self):
        from twisted.web import twcgi
        class Parent(rend.Page):
            child_child = twcgi.CGIScript('abc.cgi')
        p = Parent()
        r = getResource(p, '/child')
        self.assertTrue(compy.implements(r.tag, inevow.IResource))

    def test_noneChild(self):
        class Parent(rend.Page):
            def child_child(self, request):
                return None
            def geyDynamicChild(self, name, request):
                return None
        p = Parent()
        r = getResource(p, '/child')
        self.assertTrue(isinstance(r.tag, rend.FourOhFour))

        r = getResource(p, '/other')
        self.assertTrue(isinstance(r.tag, rend.FourOhFour))

    def test_missingRemembrances(self):

        class IThing(compy.Interface):
            pass

        class Page(rend.Page):
            
            def render_it(self, ctx, data):
                return ctx.locate(IThing)

            def child_child(self, ctx):
                ctx.remember("Thing", IThing)
                return defer.succeed(Page())

            docFactory = loaders.stan(html[render_it])
            
        page = Page()
        r = getResource(page, '/child')
        self.assertTrue(compy.implements(r.tag, inevow.IResource))

    def test_redirectToURL(self):
        redirectTarget = "http://example.com/bar"
        class RedirectingPage(rend.Page):
            def locateChild(self, ctx, segments):
                return url.URL.fromString(redirectTarget), ()

        page = RedirectingPage()
        r = getResource(page, '/url')
        ## Render the redirect.
        r.tag.renderHTTP(r)
        req = inevow.IRequest(r)
        self.assertEqual(req.redirected_to, redirectTarget)

    def test_redirectQuoting(self):
        class RedirectingPage(rend.Page):
            def locateChild(self, ctx, segments):
                return url.URL.fromString(self.original), ()

        def doRedirect(url):
            page = RedirectingPage(url)
            r = getResource(page, '/url')
            r.tag.renderHTTP(r)
            return inevow.IRequest(r).redirected_to

        funkyCharacters = 'http://example.com/foo!!bar'
        self.assertEqual(
            doRedirect(funkyCharacters),
            funkyCharacters)

        queryParam = 'http://example.com/foo!@$bar?b!@z=123'
        self.assertEqual(
            doRedirect(queryParam),
            queryParam)

    def test_stringChild(self):
        theString = "<html>Hello, world</html>"
        class StringChildPage(rend.Page):
            def child_foo(self, ctx):
                return theString
        page = StringChildPage()
        c = getResource(page, '/foo')
        self.assertEqual(deferredRender(c.tag), theString)

    def test_freeformChildMixin_nonTrue(self):
        """Configurables that have c.__nonzero__()==False are accepted."""
        class SimpleConf(object):
            __implements__ = iformless.IConfigurable,
            # mock mock
            def postForm(self, ctx, bindingName, args):
                return 'SimpleConf OK'
        class FormPage(rend.Page):
            addSlash = True
            def configurable_(self, ctx):
                return SimpleConf()
        page = FormPage()

        r = getResource(page, 'foo')
        self.assertTrue(isinstance(r.tag, rend.FourOhFour))

        r = getResource(page, 'freeform_post!!foo')
        self.assertFalse(isinstance(r.tag, rend.FourOhFour))
        self.assertEqual(deferredRender(r.tag), 'You posted a form to foo')

        SimpleConf.__nonzero__ = lambda x: False

        r = getResource(page, 'freeform_post!!foo')
        self.assertFalse(isinstance(r.tag, rend.FourOhFour))
        self.assertEqual(deferredRender(r.tag), 'You posted a form to foo')

        
class TestStandardRenderers(unittest.TestCase):
    
    def test_data(self):
        ctx = context.WovenContext()

        ctx.remember('foo', inevow.IData)
        tag = p(render=rend.data)
        self.assertEqual(flat.flatten(tag, ctx), '<p>foo</p>')

        ctx.remember('\xc2\xa3'.decode('utf-8'), inevow.IData)
        tag = p(render=rend.data)
        self.assertEqual(flat.flatten(tag, ctx), '<p>\xc2\xa3</p>')
        
        ctx.remember([1,2,3,4,5], inevow.IData)
        tag = p(render=rend.data)
        self.assertEqual(flat.flatten(tag, ctx), '<p>12345</p>')
        
        ctx.remember({'foo':'bar'}, inevow.IData)
        tag = p(data=directive('foo'), render=rend.data)
        self.assertEqual(flat.flatten(tag, ctx), '<p>bar</p>')
        
