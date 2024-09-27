# Copyright (c) 2004 Divmod.
# See LICENSE for details.



from twisted.internet import defer

from nevow import stan
from nevow import context
from nevow import tags
from nevow import entities
from nevow import inevow
from nevow import flat
from nevow import rend
from nevow import compy
from nevow.testutil import FakeRequest, TestCase

proto = stan.Proto('hello')


class Base(TestCase):
    contextFactory = context.WovenContext
    def renderer(self, context, data):
        return lambda context, data: ""

    def setupContext(self, precompile=False, setupRequest=lambda r:r):
        fr = setupRequest(FakeRequest())
        ctx = context.RequestContext(tag=fr)
        ctx.remember(fr, inevow.IRequest)
        ctx.remember(None, inevow.IData)
        ctx = context.WovenContext(parent=ctx, precompile=precompile)
        return ctx

    def render(self, tag, precompile=False, data=None, setupRequest=lambda r: r, setupContext=lambda c:c):
        ctx = self.setupContext(precompile, setupRequest)
        ctx = setupContext(ctx)
        if precompile:
            return flat.precompile(tag, ctx)
        else:
            try:
                from twisted.trial import util
                from nevow.flat import twist
            except ImportError:
                return flat.flatten(tag, ctx)
            else:
                L = []
                util.deferredResult(twist.deferflatten(tag, ctx, L.append))
                return ''.join(L)


class TestSimpleSerialization(Base):
    def test_serializeProto(self):
        self.assertEqual(self.render(proto), '<hello />')

    def test_serializeTag(self):
        tag = proto(someAttribute="someValue")
        self.assertEqual(self.render(tag), '<hello someAttribute="someValue"></hello>')

    def test_serializeChildren(self):
        tag = proto(someAttribute="someValue")[
            proto
        ]
        self.assertEqual(self.render(tag), '<hello someAttribute="someValue"><hello /></hello>')

    def test_serializeWithData(self):
        tag = proto(data=5)
        self.assertEqual(self.render(tag), '<hello></hello>')

    def test_adaptRenderer(self):
        ## This is an implementation of the "adapt" renderer
        def _(context, data):
            return context.tag[
                data
            ]
        tag = proto(data=5, render=_)
        self.assertEqual(self.render(tag), '<hello>5</hello>')

    def test_serializeDataWithRenderer(self):
        tag = proto(data=5, render=str)
        self.assertEqual(self.render(tag), '5')

    def test_noContextRenderer(self):
        def _(data):
            return data
        tag = proto(data=5, render=_)
        self.assertEqual(self.render(tag), '5')
        tag = proto(data=5, render=lambda data: data)
        self.assertEqual(self.render(tag), '5')

    def test_aBunchOfChildren(self):
        tag = proto[
            "A Child",
            5,
            "A friend in need is a friend indeed"
        ]
        self.assertEqual(self.render(tag), '<hello>A Child5A friend in need is a friend indeed</hello>')

    def test_basicPythonTypes(self):
        tag = proto(data=5)[
            "A string; ",
            "A unicode string; ",
            5, " (An integer) ",
            1.0, " (A float) ",
            1, " (A long) ",
            True, " (A bool) ",
            ["A ", "List; "],
            stan.xml("<xml /> Some xml; "),
            lambda data: "A function"
        ]
        if self.hasBools:
            self.assertEqual(self.render(tag), "<hello>A string; A unicode string; 5 (An integer) 1.0 (A float) 1 (A long) True (A bool) A List; <xml /> Some xml; A function</hello>")
        else:
            self.assertEqual(self.render(tag), "<hello>A string; A unicode string; 5 (An integer) 1.0 (A float) 1 (A long) 1 (A bool) A List; <xml /> Some xml; A function</hello>")

    def test_escaping(self):
        tag = proto(foo="<>&\"'")["<>&\"'"]
        self.assertEqual(self.render(tag), '<hello foo="&lt;&gt;&amp;&quot;\'">&lt;&gt;&amp;"\'</hello>')


class TestComplexSerialization(Base):
    def test_precompileWithRenderer(self):
        tag = tags.html[
            tags.body[
                tags.div[
                    tags.p["Here's a string"],
                    tags.p(data=5, render=str)
                ]
            ]
        ]
        prelude, context, postlude = self.render(tag, precompile=True)
        self.assertEqual(prelude, "<html><body><div><p>Here's a string</p>")
        self.assertEqual(context.tag.tagName, "p")
        self.assertEqual(context.tag.data, 5)
        self.assertEqual(context.tag.render, str)
        self.assertEqual(postlude, '</div></body></html>')

    def test_precompileSlotData(self):
        """Test that tags with slotData are not precompiled out of the
        stan tree.
        """
        tag = tags.p[tags.slot('foo')]
        tag.fillSlots('foo', 'bar')
        precompiled = self.render(tag, precompile=True)
        self.assertEqual(self.render(precompiled), '<p>bar</p>')

    def makeComplex(self):
        return tags.html[
            tags.body[
                tags.table(data=5)[
                    tags.tr[
                        tags.td[
                            tags.span(render=str)
                        ],
                    ]
                ]
            ]
        ]

    def test_precompileTwice(self):
        def render_same(context, data):
            return context.tag
        
        doc = tags.html[
            tags.body(render=render_same, data={'foo':5})[
                tags.p["Hello"],
                tags.p(data=tags.directive('foo'))[
                    str
                ]
            ]
        ]
        result1 = self.render(doc, precompile=True)
        result2 = self.render(doc, precompile=True)
        rendered = self.render(result2)
        self.assertEqual(rendered, "<html><body><p>Hello</p><p>5</p></body></html>")

    def test_precompilePrecompiled(self):
        def render_same(context, data):
            return context.tag
        
        doc = tags.html[
            tags.body(render=render_same, data={'foo':5})[
                tags.p["Hello"],
                tags.p(data=tags.directive('foo'))[
                    str
                ]
            ]
        ]
        result1 = self.render(doc, precompile=True)
        result2 = self.render(result1, precompile=True)
        rendered = self.render(result2)
        self.assertEqual(rendered, "<html><body><p>Hello</p><p>5</p></body></html>")

    def test_precompileDoesntChangeOriginal(self):
        doc = tags.html(data="foo")[tags.p['foo'], tags.p['foo']]
        
        result = self.render(doc, precompile=True)
        rendered = self.render(result)
        
        self.assertEqual(len(doc.children), 2)
        self.assertEqual(rendered, "<html><p>foo</p><p>foo</p></html>")

    def test_precompileNestedDynamics(self):
        tag = self.makeComplex()
        prelude, dynamic, postlude = self.render(tag, precompile=True)
        self.assertEqual(prelude, '<html><body>')
        
        self.assertEqual(dynamic.tag.tagName, 'table')
        self.assertTrue(dynamic.tag.children)
        self.assertEqual(dynamic.tag.data, 5)
        
        childPrelude, childDynamic, childPostlude = dynamic.tag.children
        
        self.assertEqual(childPrelude, '<tr><td>')
        self.assertEqual(childDynamic.tag.tagName, 'span')
        self.assertEqual(childDynamic.tag.render, str)
        self.assertEqual(childPostlude, '</td></tr>')
        
        self.assertEqual(postlude, '</body></html>')

    def test_precompileThenRender(self):
        tag = self.makeComplex()
        prerendered = self.render(tag, precompile=True)
        self.assertEqual(self.render(prerendered), '<html><body><table><tr><td>5</td></tr></table></body></html>')

    def test_precompileThenMultipleRenders(self):
        tag = self.makeComplex()
        prerendered = self.render(tag, precompile=True)
        self.assertEqual(self.render(prerendered), '<html><body><table><tr><td>5</td></tr></table></body></html>')
        self.assertEqual(self.render(prerendered), '<html><body><table><tr><td>5</td></tr></table></body></html>')

    def test_patterns(self):
        tag = tags.html[
            tags.body[
                tags.ol(data=["one", "two", "three"], render=rend.sequence)[
                    tags.li(pattern="item")[
                        str
                    ]
                ]
            ]
        ]
        self.assertEqual(self.render(tag), "<html><body><ol><li>one</li><li>two</li><li>three</li></ol></body></html>")

    def test_precompilePatternWithNoChildren(self):
        tag = tags.img(pattern='item')
        pc = flat.precompile(tag)
        self.assertEqual(pc[0].tag.children, [])

    def test_slots(self):
        tag = tags.html[
            tags.body[
                tags.table(data={'one': 1, 'two': 2}, render=rend.mapping)[
                    tags.tr[tags.td["Header one."], tags.td["Header two."]],
                    tags.tr[
                        tags.td["One: ", tags.slot("one")],
                        tags.td["Two: ", tags.slot("two")]
                    ]
                ]
            ]
        ]
        self.assertEqual(self.render(tag), "<html><body><table><tr><td>Header one.</td><td>Header two.</td></tr><tr><td>One: 1</td><td>Two: 2</td></tr></table></body></html>")

    def test_slotAttributeEscapingWhenPrecompiled(self):

        def render_searchResults(ctx, remoteCursor):
            ctx.fillSlots('old-query', '"meow"')
            return ctx.tag

        tag = tags.invisible(render=render_searchResults)[
            tags.input(value=tags.slot('old-query')),
        ]

        # this test passes if the precompile test is skipped.
        precompiled = self.render(tag, precompile=True)

        self.assertEqual(self.render(precompiled), '<input value="&quot;meow&quot;" />')

    test_slotAttributeEscapingWhenPrecompiled.todo = 'this is a bug and should be fixed.'

    def test_nestedpatterns(self):
        def data_table(context, data):  return [[1,2,3],[4,5,6]]
        def data_header(context, data):  return ['col1', 'col2', 'col3']
        tag = tags.html[
            tags.body[
                tags.table(data=data_table, render=rend.sequence)[
                    tags.tr(pattern='header', data=data_header, render=rend.sequence)[
                        tags.td(pattern='item')[str]
                    ],
                    tags.tr(pattern='item', render=rend.sequence)[
                        tags.td(pattern='item')[str]
                    ]
                ]
            ]
        ]
        self.assertEqual(self.render(tag), "<html><body><table><tr><td>col1</td><td>col2</td><td>col3</td></tr><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>4</td><td>5</td><td>6</td></tr></table></body></html>")

    def test_cloning(self):
        def data_foo(context, data):  return [{'foo':'one'}, {'foo':'two'}]

      # tests nested lists without precompilation (precompilation flattens the lists)
        def render_test(context, data):
            return tags.ul(render=rend.sequence)[
                    tags.li(pattern='item')[
                        'foo', (((tags.invisible(data=tags.directive('foo'), render=str),),),)
                    ]
                ]

        # tests tags inside attributes (weird but useful)
        document = tags.html(data=data_foo)[
            tags.body[
                tags.ul(render=rend.sequence)[
                  tags.li(pattern='item')[
                    tags.a(href=('test/', tags.invisible(data=tags.directive('foo'), render=str)))['link']
                  ]
                ],
                render_test
            ]
        ]
        document=self.render(document, precompile=True)
        self.assertEqual(self.render(document), '<html><body><ul><li><a href="test/one">link</a></li><li><a href="test/two">link</a></li></ul><ul><li>fooone</li><li>footwo</li></ul></body></html>')

    def test_singletons(self):
        for x in ('img', 'br', 'hr', 'base', 'meta', 'link', 'param', 'area',
            'input', 'col', 'basefont', 'isindex', 'frame'):
            self.assertEqual(self.render(tags.Proto(x)()), '<%s />' % x)

    def test_nosingleton(self):
        for x in ('div', 'span', 'script', 'iframe'):
            self.assertEqual(self.render(tags.Proto(x)()), '<%(tag)s></%(tag)s>' % {'tag': x})

    def test_nested_data(self):
        def checkContext(ctx, data):
            self.assertEqual(data, "inner")
            self.assertEqual(ctx.locate(inevow.IData, depth=2), "outer")
            return 'Hi'
        tag = tags.html(data="outer")[tags.span(render=lambda ctx,data: ctx.tag, data="inner")[checkContext]]
        self.assertEqual(self.render(tag), "<html><span>Hi</span></html>")

    def test_nested_remember(self):
        class IFoo(compy.Interface):
            pass
        class Foo(str):
            __implements__ = IFoo
            
        def checkContext(ctx, data):
            self.assertEqual(ctx.locate(IFoo), Foo("inner"))
            self.assertEqual(ctx.locate(IFoo, depth=2), Foo("outer"))
            return 'Hi'
        tag = tags.html(remember=Foo("outer"))[tags.span(render=lambda ctx,data: ctx.tag, remember=Foo("inner"))[checkContext]]
        self.assertEqual(self.render(tag), "<html><span>Hi</span></html>")
        
    def test_deferredRememberInRenderer(self):
        class IFoo(compy.Interface):
            pass
        def rememberIt(ctx, data):
            ctx.remember("bar", IFoo)
            return defer.succeed(ctx.tag)
        def locateIt(ctx, data):
            return IFoo(ctx)
        tag = tags.invisible(render=rememberIt)[tags.invisible(render=locateIt)]
        self.assertEqual(self.render(tag), "bar")

    def test_dataContextCreation(self):
        data = {'foo':'oof', 'bar':'rab'}
        doc = tags.p(data=data)[tags.slot('foo'), tags.slot('bar')]
        doc.fillSlots('foo', tags.invisible(data=tags.directive('foo'), render=str))
        doc.fillSlots('bar', lambda ctx,data: data['bar'])
        self.assertEqual(flat.flatten(doc), '<p>oofrab</p>')

    def test_leaky(self):
        def foo(ctx, data):
            ctx.tag.fillSlots('bar', tags.invisible(data="two"))
            return ctx.tag

        result = self.render(
            tags.div(render=foo, data="one")[
                tags.slot("bar"),
                tags.invisible(render=str)])

        self.assertEqual(result, '<div>one</div>')

        
class TestMultipleRenderWithDirective(Base):
    def test_it(self):
        class Cool(object):
            def __init__(self):
                self.counter = 0

            def count(self, context, data):
                self.counter += 1
                return self.counter

        it = Cool()

        tag = tags.html(data={'counter': it.count})[
            tags.invisible(data=tags.directive('counter'))[
                str
            ]
        ]
        precompiled = self.render(tag, precompile=True)
        val = self.render(precompiled)
        self.assertSubstring('1', val)
        val2 = self.render(precompiled)
        self.assertSubstring('2', val2)


class TestEntity(Base):
    def test_it(self):
        val = self.render(entities.nbsp)
        self.assertEqual(val, '&#160;')

    def test_nested(self):
        val = self.render(tags.html(src=entities.quot)[entities.amp])
        self.assertEqual(val, '<html src="&quot;">&amp;</html>')

    def test_xml(self):
        val = self.render([entities.lt, entities.amp, entities.gt])
        self.assertEqual(val, '&lt;&amp;&gt;')


class TestNoneAttribute(Base):
    def test_simple(self):
        val = self.render(tags.html(foo=None)["Bar"])
        self.assertEqual(val, "<html>Bar</html>")

    def test_slot(self):
        val = self.render(tags.html().fillSlots('bar', None)(foo=tags.slot('bar'))["Bar"])
        self.assertEqual(val, "<html>Bar</html>")
    test_slot.todo = "We need to be able to roll back time in order to not output the attribute name"


class TestKey(Base):
    def test_nested(self):
        val = []
        def appendKey(ctx, data):
            val.append(ctx.key)
            return ctx.tag
        self.render(
            tags.div(key="one", render=appendKey)[
                tags.div(key="two", render=appendKey)[
                    tags.div(render=appendKey)[
                        tags.div(key="four", render=appendKey)]]])
        self.assertEqual(val, ["one", "one.two", "one.two", "one.two.four"])

