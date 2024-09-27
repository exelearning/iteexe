# Copyright (c) 2004 Divmod.
# See LICENSE for details.


from nevow import inevow
from nevow import appserver
from nevow import testutil
from nevow import util
from nevow import testutil


class Render:
    __implements__ = inevow.IResource,

    rendered = False

    def locateChild(self, request, segs):
        return self, ()

    def renderHTTP(self, request):
        self.rendered = True
        return ''


class TestLookup(testutil.TestCase):
    def getResourceFor(self, root, url):
        r = testutil.FakeRequest()
        self.request = r
        r.postpath = url.split('/')
        deferred = util.maybeDeferred(appserver.NevowSite(root).getResourceFor, r)
        return util.deferredResult(
            deferred
        )

    def test_leafIsRoot(self):
        root = Render()
        result = self.getResourceFor(root, 'foo/bar/baz')
        self.assertIdentical(result.tag, root)

    def test_children(self):
        class FirstTwo(Render):
            def locateChild(self, request, segs):
                return LastOne(), segs[2:]

        class LastOne(Render):
            def locateChild(self, request, segs):
                return Render(), segs[1:]

        result = self.getResourceFor(FirstTwo(), 'foo/bar/baz')
        self.assertIdentical(result.tag.__class__, Render)

    def test_oldresource(self):
        from twisted.web import resource
        r = resource.Resource()
        r.putChild('foo', r)
        result = self.getResourceFor(r, 'foo')
        self.assertIdentical(r, result.tag.original)

    def test_deferredChild(self):
        class Deferreder(Render):
            def locateChild(self, request, segs):
                d = util.succeed((self, segs[1:]))
                return d

        r = Deferreder()
        result = self.getResourceFor(r, 'foo')
        self.assertIdentical(r, result.tag)
        
    def test_cycle(self):
        class Resource(object):
            __implements__ = inevow.IResource,
            def locateChild(self, ctx, segments):
                if segments[0] == 'self':
                    return self, segments
                return self, segments[1:]
        root = Resource()
        self.assertRaises(AssertionError, self.getResourceFor, root, 'self')
        self.getResourceFor(root, 'notself')


class TestSiteAndRequest(testutil.TestCase):
    def renderResource(self, resource, path):
        s = appserver.NevowSite(resource)
        r = appserver.NevowRequest(testutil.FakeChannel(s), True)
        r.path = path
        D = r.process()
        return util.deferredResult(D)

    def test_deferredRender(self):
        class Deferreder(Render):
            def renderHTTP(self, request):
                return util.succeed("hello")

        result = self.renderResource(Deferreder(), 'foo')
        self.assertEqual(result, "hello")

    def test_regularRender(self):
        class Regular(Render):
            def renderHTTP(self, request):
                return "world"

        result = self.renderResource(Regular(), 'bar')
        self.assertEqual(result, 'world')

    def test_returnsResource(self):
        class Res2(Render):
            def renderHTTP(self, ctx):
                return "world"
            
        class Res1(Render):
            def renderHTTP(self, ctx):
                return Res2()

        result = self.renderResource(Res1(), 'bar')
        self.assertEqual(result, 'world')

