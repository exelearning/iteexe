# Copyright (c) 2004 Divmod.
# See LICENSE for details.


from nevow import inevow, tags, flat, testutil, context, loaders, stan

from nevow.inevow import IQ


simple = tags.html[tags.div(pattern="foo")]
tooMany = tags.html[tags.div(pattern="foo"), tags.div(pattern="foo")]
notEnough = tags.html[tags.div[tags.span["Hello"]]]


class TestOne(testutil.TestCase):
    def test_tagQuery(self):
        new = IQ(simple).onePattern('foo')
        self.assertEquals(new.tagName, 'div')

    def test_tagTooMany(self):
        self.assertRaises(stan.TooManyNodes, IQ(tooMany).onePattern, 'foo')

    def test_tagNotEnough(self):
        self.assertRaises(stan.NodeNotFound, IQ(notEnough).onePattern, 'foo')

    def test_contextQuery(self):
        C = context.WovenContext(tag=simple)
        new = IQ(C).onePattern('foo')
        self.assertEquals(new.tagName, 'div')

    def test_contextTooMany(self):
        C = context.WovenContext(tag=tooMany)
        self.assertRaises(stan.TooManyNodes, IQ(C).onePattern, 'foo')

    def test_contextNotEnough(self):
        self.assertRaises(
            stan.NodeNotFound, 
            IQ(context.WovenContext(tag=notEnough)).onePattern, 'foo')

    def test_contextTagQuery(self):
        T = simple.clone(deep=False)
        T.pattern = "outer"
        C = context.WovenContext(tag=T)
        new = IQ(C).onePattern('outer')
        self.assertEquals(new.tagName, 'html')

    def test_contextTagTooMany(self):
        tooMany = tags.html(pattern="foo")[ tags.div(pattern="foo") ]
        self.assertRaises(stan.TooManyNodes, IQ(context.WovenContext(tag=tooMany)).onePattern, 'foo')

    def test_listQuery(self):
        P = flat.precompile(simple)
        new = IQ(P).onePattern('foo')
        self.assertEquals(new.tagName, 'div')

    def test_listTooMany(self):
        P = flat.precompile(tooMany)
        self.assertRaises(stan.TooManyNodes, IQ(P).onePattern, 'foo')

    def test_listNotEnough(self):
        P = flat.precompile(notEnough)
        self.assertRaises(stan.NodeNotFound, IQ(P).onePattern, 'foo')

    def test_loaderQuery(self):
        L = loaders.stan(simple)
        new = IQ(L).onePattern('foo')
        self.assertEquals(new.tagName, 'div')

    def test_loaderTooMany(self):
        L = loaders.stan(tooMany)
        self.assertRaises(stan.TooManyNodes, IQ(L).onePattern, 'foo')

    def test_loaderNotEnough(self):
        L = loaders.stan(notEnough)
        self.assertRaises(stan.NodeNotFound, IQ(L).onePattern, 'foo')


multiple = tags.html[tags.div(pattern="foo", bar="one"), tags.span(pattern="foo", bar="two")]


class TestAll(testutil.TestCase):
    def verify(self, them):
        them = list(them)
        self.assertEquals(len(them), 2)
        self.assertEquals(them[0].tagName, 'div')
        self.assertEquals(them[1].tagName, 'span')
        self.assertEquals(them[0].attributes['bar'], 'one')
        self.assertEquals(them[1].attributes['bar'], 'two')

    def testTagPatterns(self):
        self.verify(
            IQ(multiple).allPatterns('foo'))

    def testContextPatterns(self):
        self.verify(
            IQ(context.WovenContext(tag=multiple)).allPatterns('foo'))

    def testListPatterns(self):
        self.verify(
            IQ(flat.precompile(multiple)).allPatterns('foo'))

    def testLoaderPatterns(self):
        self.verify(
            IQ(loaders.stan(multiple)).allPatterns('foo'))


class TestGenerator(testutil.TestCase):
    def verify(self, it):
        one = it(color="red")
        two = it(color="blue")
        three = it(color="green")
        four = it(color="orange")
        self.assertEquals(one.attributes['color'], 'red')
        self.assertEquals(one.attributes['bar'], 'one')
        self.assertEquals(two.attributes['color'], 'blue')
        self.assertEquals(two.attributes['bar'], 'two')
        self.assertEquals(three.attributes['color'], 'green')
        self.assertEquals(three.attributes['bar'], 'one')
        self.assertEquals(four.attributes['color'], 'orange')
        self.assertEquals(four.attributes['bar'], 'two')

    def testTagGenerators(self):
        self.verify(
            IQ(multiple).patternGenerator('foo'))

    def testTagMissing(self):
        self.assertRaises(stan.NodeNotFound, IQ(notEnough).patternGenerator, 'foo')

    def testContextGenerators(self):
        self.verify(
            IQ(context.WovenContext(tag=multiple)).patternGenerator('foo'))

    def testContextMissing(self):
        self.assertRaises(stan.NodeNotFound, IQ(context.WovenContext(tag=notEnough)).patternGenerator, 'foo')

    def testListGenerators(self):
        self.verify(
            IQ(flat.precompile(multiple)).patternGenerator('foo'))

    def testListMissing(self):
        self.assertRaises(stan.NodeNotFound, IQ(flat.precompile(notEnough)).patternGenerator, 'foo')

    def testLoaderGenerators(self):
        self.verify(
            IQ(loaders.stan(multiple)).patternGenerator('foo'))

    def testTagMissing(self):
        self.assertRaises(stan.NodeNotFound, IQ(loaders.stan(notEnough)).patternGenerator, 'foo')

    def testClonableDefault(self):
        orig = tags.p["Hello"]
        gen = IQ(flat.precompile(notEnough)).patternGenerator('foo', orig)
        new = gen.next()
        self.assertEquals(new.tagName, 'p')
        self.assertNotIdentical(orig, new)

    def testNonClonableDefault(self):
        gen = IQ(flat.precompile(notEnough)).patternGenerator('foo', 'bar')
        new = gen.next()
        self.assertEquals(new, 'bar')

    def testXmlMissing(self):
        self.assertRaises(stan.NodeNotFound, IQ(stan.xml('<html>hello</html>')).patternGenerator, 'foo')

