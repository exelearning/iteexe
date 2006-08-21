# Copyright (c) 2004 Divmod.
# See LICENSE for details.

import urlparse

from nevow import context, url
from nevow import tags
from nevow.testutil import TestCase, FakeRequest
from nevow.flat import flatten

theurl = "http://www.foo.com:80/a/nice/path/?zot=23&zut"

# RFC1808 relative tests. Not all of these pass yet.
rfc1808_relative_link_base='http://a/b/c/d;p?q#f'
rfc1808_relative_link_tests = [
    # "Normal"
    ('g:h', 'g:h'),
    ('g', 'http://a/b/c/g'),
    ('./g', 'http://a/b/c/g'),
    ('g/', 'http://a/b/c/g/'),
    ('/g', 'http://a/g'),
    ('//g', 'http://g'),
    ('?y', 'http://a/b/c/d;p?y'),
    ('g?y', 'http://a/b/c/g?y'),
    ('g?y/./x', 'http://a/b/c/g?y/./x'),
    ('#s', 'http://a/b/c/d;p?q#s'),
    ('g#s', 'http://a/b/c/g#s'),
    ('g#s/./x', 'http://a/b/c/g#s/./x'),
    ('g?y#s', 'http://a/b/c/g?y#s'),
    #(';x', 'http://a/b/c/d;x'),
    ('g;x', 'http://a/b/c/g;x'),
    ('g;x?y#s', 'http://a/b/c/g;x?y#s'),
    ('.', 'http://a/b/c/'),
    ('./', 'http://a/b/c/'),
    ('..', 'http://a/b/'),
    ('../', 'http://a/b/'),
    ('../g', 'http://a/b/g'),
    #('../..', 'http://a/'),
    #('../../', 'http://a/'),
    ('../../g', 'http://a/g'),
    
    # "Abnormal"
    ('', 'http://a/b/c/d;p?q#f'),
    #('../../../g', 'http://a/../g'),
    #('../../../../g', 'http://a/../../g'),
    #('/./g', 'http://a/./g'),
    #('/../g', 'http://a/../g'),
    ('g.', 'http://a/b/c/g.'),
    ('.g', 'http://a/b/c/.g'),
    ('g..', 'http://a/b/c/g..'),
    ('..g', 'http://a/b/c/..g'),
    ('./../g', 'http://a/b/g'),
    ('./g/.', 'http://a/b/c/g/'),
    ('g/./h', 'http://a/b/c/g/h'),
    ('g/../h', 'http://a/b/c/h'),
    #('http:g', 'http:g'),          # Not sure whether the spec means
    #('http:', 'http:'),            # these two are valid tests or not.
    ]


class FR(FakeRequest):
    def prePathURL(Self):
        return theurl

class TestURL(TestCase):
    def test_fromString(self):
        urlpath = url.URL.fromString(theurl)
        self.assertEquals(theurl, str(urlpath))

    def test_fromRequest(self):
        urlpath = url.URL.fromRequest(FR())
        self.assertEquals(theurl, str(urlpath))
        
    def test_fromContext(self):

        r = FakeRequest(uri='/a/b/c')
        urlpath = url.URL.fromContext(context.RequestContext(tag=r))
        self.assertEquals('http://localhost/', str(urlpath))

        r.prepath = ['a']
        urlpath = url.URL.fromContext(context.RequestContext(tag=r))
        self.assertEquals('http://localhost/a', str(urlpath))

        r = FakeRequest(uri='/a/b/c?foo=bar')
        r.prepath = ['a','b']
        urlpath = url.URL.fromContext(context.RequestContext(tag=r))
        self.assertEquals('http://localhost/a/b?foo=bar', str(urlpath))
        
    def test_equality(self):
        urlpath = url.URL.fromString(theurl)
        self.failUnlessEqual(urlpath, url.URL.fromString(theurl))
        self.failIfEqual(urlpath, url.URL.fromString('ftp://www.anotherinvaliddomain.com/foo/bar/baz/?zot=21&zut'))

    def test_parent(self):
        urlpath = url.URL.fromString(theurl)
        self.assertEquals("http://www.foo.com:80/a/nice/?zot=23&zut",
                          str(urlpath.parent()))
    
    def test_parentdir(self):
        urlpath = url.URL.fromString(theurl)
        self.assertEquals("http://www.foo.com:80/a/nice/?zot=23&zut",
                          str(urlpath.parentdir()))
        urlpath = url.URL.fromString('http://www.foo.com/a')
        self.assertEquals("http://www.foo.com/",
                          str(urlpath.parentdir()))
        urlpath = url.URL.fromString('http://www.foo.com/a/')
        self.assertEquals("http://www.foo.com/",
                          str(urlpath.parentdir()))
        urlpath = url.URL.fromString('http://www.foo.com/a/b')
        self.assertEquals("http://www.foo.com/",
                          str(urlpath.parentdir()))
        urlpath = url.URL.fromString('http://www.foo.com/a/b/')
        self.assertEquals("http://www.foo.com/a/",
                          str(urlpath.parentdir()))
        urlpath = url.URL.fromString('http://www.foo.com/a/b/c')
        self.assertEquals("http://www.foo.com/a/",
                          str(urlpath.parentdir()))
        urlpath = url.URL.fromString('http://www.foo.com/a/b/c/')
        self.assertEquals("http://www.foo.com/a/b/",
                          str(urlpath.parentdir()))
        urlpath = url.URL.fromString('http://www.foo.com/a/b/c/d')
        self.assertEquals("http://www.foo.com/a/b/",
                          str(urlpath.parentdir()))
        urlpath = url.URL.fromString('http://www.foo.com/a/b/c/d/')
        self.assertEquals("http://www.foo.com/a/b/c/",
                          str(urlpath.parentdir()))

    def test_parent_root(self):
        urlpath = url.URL.fromString('http://www.foo.com/')
        self.assertEquals("http://www.foo.com/",
                          str(urlpath.parentdir()))
        self.assertEquals("http://www.foo.com/",
                          str(urlpath.parentdir().parentdir()))

    def test_child(self):
        urlpath = url.URL.fromString(theurl)
        self.assertEquals("http://www.foo.com:80/a/nice/path/gong?zot=23&zut",
                          str(urlpath.child('gong')))
        self.assertEquals("http://www.foo.com:80/a/nice/path/gong/?zot=23&zut",
                          str(urlpath.child('gong/')))
        self.assertEquals(
            "http://www.foo.com:80/a/nice/path/gong/double?zot=23&zut",
            str(urlpath.child('gong/double')))
        self.assertEquals(
            "http://www.foo.com:80/a/nice/path/gong/double/?zot=23&zut",
            str(urlpath.child('gong/double/')))

    def test_child_init_tuple(self):
        self.assertEquals(
            "http://www.foo.com/a/b/c",
            str(url.URL(netloc="www.foo.com",
                        pathsegs=['a', 'b']).child("c")))

    def test_child_init_root(self):
        self.assertEquals(
            "http://www.foo.com/c",
            str(url.URL(netloc="www.foo.com").child("c")))

    def test_sibling(self):
        urlpath = url.URL.fromString(theurl)
        self.assertEquals(
            "http://www.foo.com:80/a/nice/path/sister?zot=23&zut",
            str(urlpath.sibling('sister')))
        # use an url without trailing '/' to check child removal
        theurl2 = "http://www.foo.com:80/a/nice/path?zot=23&zut"
        urlpath = url.URL.fromString(theurl2)
        self.assertEquals(
            "http://www.foo.com:80/a/nice/sister?zot=23&zut",
            str(urlpath.sibling('sister')))

    def test_curdir(self):
        urlpath = url.URL.fromString(theurl)
        self.assertEquals(theurl, str(urlpath))
        # use an url without trailing '/' to check object removal
        theurl2 = "http://www.foo.com:80/a/nice/path?zot=23&zut"
        urlpath = url.URL.fromString(theurl2)
        self.assertEquals("http://www.foo.com:80/a/nice/?zot=23&zut",
                          str(urlpath.curdir()))
        
    def test_click(self):
        urlpath = url.URL.fromString(theurl)
        # a null uri should be valid (return here)
        self.assertEquals("http://www.foo.com:80/a/nice/path/?zot=23&zut",
                          str(urlpath.click("")))
        # a simple relative path remove the query
        self.assertEquals("http://www.foo.com:80/a/nice/path/click",
                          str(urlpath.click("click")))
        # an absolute path replace path and query
        self.assertEquals("http://www.foo.com:80/click",
                          str(urlpath.click("/click")))
        # replace just the query
        self.assertEquals("http://www.foo.com:80/a/nice/path/?burp",
                          str(urlpath.click("?burp")))
        # one full url to another should not generate '//' between netloc and pathsegs 
        self.failIfIn("//foobar", str(urlpath.click('http://www.foo.com:80/foobar')))

        # from a url with no query clicking a url with a query,
        # the query should be handled properly
        u = url.URL.fromString('http://www.foo.com:80/me/noquery')
        self.failUnlessEqual('http://www.foo.com:80/me/17?spam=158',
                             str(u.click('/me/17?spam=158')))
                             
        # Check that everything from the path onward is removed when the click link
        # has no path.
        u = url.URL.fromString('http://localhost/foo?abc=def')
        self.failUnlessEqual(str(u.click('http://www.python.org')), 'http://www.python.org/')
        
    def test_rfc1808(self):
        """Test the relative link resolving stuff I found in rfc1808 section 5.
        """
        def unsplit(u):
            return urlparse.urlunsplit( (u.scheme, u.netloc, u.path, '&'.join(u.query), u.fragment) )
        base = url.URL.fromString(rfc1808_relative_link_base)
        for link, result in rfc1808_relative_link_tests:
            #print link
            self.failUnlessEqual(result, unsplit(base.click(link)))
      
    def test_clickCollapse(self):
        tests = [
            ['http://localhost/', '.', 'http://localhost/'],
            ['http://localhost/', '..', 'http://localhost/'],
            ['http://localhost/a/b/c', '.', 'http://localhost/a/b/'],
            ['http://localhost/a/b/c', '..', 'http://localhost/a/'],
            ['http://localhost/a/b/c', './d/e', 'http://localhost/a/b/d/e'],
            ['http://localhost/a/b/c', '../d/e', 'http://localhost/a/d/e'],
            ['http://localhost/a/b/c', '/./d/e', 'http://localhost/d/e'],
            ['http://localhost/a/b/c', '/../d/e', 'http://localhost/d/e'],
            ['http://localhost/a/b/c/', '../../d/e/', 'http://localhost/a/d/e/'],
            ['http://localhost/a/./c', '../d/e', 'http://localhost/d/e'],
            ['http://localhost/a/./c/', '../d/e', 'http://localhost/a/d/e'],
            ['http://localhost/a/b/c/d', './e/../f/../g', 'http://localhost/a/b/c/g'],
            ['http://localhost/a/b/c', 'd//e', 'http://localhost/a/b/d//e'],
            ]
        for start, click, result in tests:
            self.assertEquals(
                str(url.URL.fromString(start).click(click)),
                result
                )
        
    def test_add(self):
        urlpath = url.URL.fromString(theurl)
        self.assertEquals(
            "http://www.foo.com:80/a/nice/path/?zot=23&zut&burp",
            str(urlpath.add("burp")))
        self.assertEquals(
            "http://www.foo.com:80/a/nice/path/?zot=23&zut&burp=xxx",
            str(urlpath.add("burp", "xxx")))
        self.assertEquals(
            "http://www.foo.com:80/a/nice/path/?zot=23&zut&burp=xxx&zing",
            str(urlpath.add("burp", "xxx").add("zing")))
        # note the inversion!
        self.assertEquals(
            "http://www.foo.com:80/a/nice/path/?zot=23&zut&zing&burp=xxx",
            str(urlpath.add("zing").add("burp", "xxx")))
        # note the two values for the same name
        self.assertEquals(
            "http://www.foo.com:80/a/nice/path/?zot=23&zut&burp=xxx&zot=32",
            str(urlpath.add("burp", "xxx").add("zot", 32)))

    def test_add_noquery(self):
        # fromString is a different code path, test them both
        self.assertEquals(
            "http://www.foo.com:80/a/nice/path/?foo=bar",
            str(url.URL.fromString("http://www.foo.com:80/a/nice/path/")
                .add("foo", "bar")))
        self.assertEquals(
            "http://www.foo.com/?foo=bar",
            str(url.URL(netloc="www.foo.com").add("foo", "bar")))

    def test_replace(self):
        urlpath = url.URL.fromString(theurl)    
        self.assertEquals(
            "http://www.foo.com:80/a/nice/path/?zot=32&zut",
            str(urlpath.replace("zot", 32)))
        # replace name without value with name/value and vice-versa
        self.assertEquals(
            "http://www.foo.com:80/a/nice/path/?zot&zut=itworked",
            str(urlpath.replace("zot").replace("zut", "itworked")))
        # Q: what happens when the query has two values and we replace?
        # A: we replace both values with a single one
        self.assertEquals(
            "http://www.foo.com:80/a/nice/path/?zot=32&zut",
            str(urlpath.add("zot", "xxx").replace("zot", 32)))

    def test_fragment(self):
        urlpath = url.URL.fromString(theurl)
        self.assertEquals(
            "http://www.foo.com:80/a/nice/path/?zot=23&zut#hiboy",
            str(urlpath.anchor("hiboy")))
        self.assertEquals(
            "http://www.foo.com:80/a/nice/path/?zot=23&zut",
            str(urlpath.anchor()))
        self.assertEquals(
            "http://www.foo.com:80/a/nice/path/?zot=23&zut",
            str(urlpath.anchor('')))

    def test_clear(self):
        urlpath = url.URL.fromString(theurl)    
        self.assertEquals(
            "http://www.foo.com:80/a/nice/path/?zut",
            str(urlpath.clear("zot")))
        self.assertEquals(
            "http://www.foo.com:80/a/nice/path/?zot=23",
            str(urlpath.clear("zut")))
        # something stranger, query with two values, both should get cleared
        self.assertEquals(
            "http://www.foo.com:80/a/nice/path/?zut",
            str(urlpath.add("zot", 1971).clear("zot")))
        # two ways to clear the whole query
        self.assertEquals(
            "http://www.foo.com:80/a/nice/path/",
            str(urlpath.clear("zut").clear("zot")))
        self.assertEquals(
            "http://www.foo.com:80/a/nice/path/",
            str(urlpath.clear()))

    def test_secure(self):
        self.assertEquals(str(url.URL.fromString('http://localhost/').secure()), 'https://localhost/')
        self.assertEquals(str(url.URL.fromString('http://localhost/').secure(True)), 'https://localhost/')
        self.assertEquals(str(url.URL.fromString('https://localhost/').secure()), 'https://localhost/')
        self.assertEquals(str(url.URL.fromString('https://localhost/').secure(False)), 'http://localhost/')
        self.assertEquals(str(url.URL.fromString('http://localhost/').secure(False)), 'http://localhost/')
        self.assertEquals(str(url.URL.fromString('http://localhost/foo').secure()), 'https://localhost/foo')
        self.assertEquals(str(url.URL.fromString('http://localhost/foo?bar=1').secure()), 'https://localhost/foo?bar=1')
        self.assertEquals(str(url.URL.fromString('http://localhost/').secure(port=443)), 'https://localhost/')
        self.assertEquals(str(url.URL.fromString('http://localhost:8080/').secure(port=8443)), 'https://localhost:8443/')
        self.assertEquals(str(url.URL.fromString('https://localhost:8443/').secure(False, 8080)), 'http://localhost:8080/')
        

    def test_eq_same(self):
        u = url.URL.fromString('http://localhost/')
        self.failUnless(u == u, "%r != itself" % u)

    def test_eq_similar(self):
        u1 = url.URL.fromString('http://localhost/')
        u2 = url.URL.fromString('http://localhost/')
        self.failUnless(u1 == u2, "%r != %r" % (u1, u2))

    def test_eq_different(self):
        u1 = url.URL.fromString('http://localhost/a')
        u2 = url.URL.fromString('http://localhost/b')
        self.failIf(u1 == u2, "%r != %r" % (u1, u2))

    def test_eq_apples_vs_oranges(self):
        u = url.URL.fromString('http://localhost/')
        self.failIf(u == 42, "URL must not equal a number.")
        self.failIf(u == object(), "URL must not equal an object.")

    def test_ne_same(self):
        u = url.URL.fromString('http://localhost/')
        self.failIf(u != u, "%r == itself" % u)

    def test_ne_similar(self):
        u1 = url.URL.fromString('http://localhost/')
        u2 = url.URL.fromString('http://localhost/')
        self.failIf(u1 != u2, "%r == %r" % (u1, u2))

    def test_ne_different(self):
        u1 = url.URL.fromString('http://localhost/a')
        u2 = url.URL.fromString('http://localhost/b')
        self.failUnless(u1 != u2, "%r == %r" % (u1, u2))

    def test_ne_apples_vs_oranges(self):
        u = url.URL.fromString('http://localhost/')
        self.failUnless(u != 42, "URL must differ from a number.")
        self.failUnless(u != object(), "URL must be differ from an object.")

class Serialization(TestCase):
    def testQuoting(self):
        context = None
        scheme = 'http'
        loc = 'localhost'
        path = ('baz', 'buz')
        query = [("foo", "bar"), ("baz", "=quux"), ("foobar", "?")]
        fragment = 'futz'
        u = url.URL(scheme, loc, path, query, fragment)
        s = flatten(url.URL(scheme, loc, path, query, fragment))
        
        parsedScheme, parsedLoc, parsedPath, parsedQuery, parsedFragment = urlparse.urlsplit(s)
        
        self.assertEquals(scheme, parsedScheme)
        self.assertEquals(loc, parsedLoc)
        self.assertEquals('/' + '/'.join(path), parsedPath)
        self.assertEquals(query, url.unquerify(parsedQuery))
        self.assertEquals(fragment, parsedFragment)

    def test_slotQueryParam(self):
        original = 'http://foo/bar?baz=bamf'
        u = url.URL.fromString(original)
        u = u.add('toot', tags.slot('param'))

        def fillIt(ctx, data):
            ctx.fillSlots('param', 5)
            return ctx.tag

        self.assertEquals(flatten(tags.invisible(render=fillIt)[u]), original + '&toot=5')

    def test_childQueryParam(self):
        original = 'http://foo/bar'
        u = url.URL.fromString(original)
        u = u.child(tags.slot('param'))

        def fillIt(ctx, data):
            ctx.fillSlots('param', 'baz')
            return ctx.tag

        self.assertEquals(flatten(tags.invisible(render=fillIt)[u]), original + '/baz')

    def test_rfc1808(self):
        """Test the relative link resolving stuff I found in rfc1808 section 5.
        """
        base = url.URL.fromString(rfc1808_relative_link_base)
        for link, result in rfc1808_relative_link_tests:
            #print link
            self.failUnlessEqual(result, flatten(base.click(link)))
    test_rfc1808.todo = 'Many of these fail miserably at the moment; often with a / where there shouldn\'t be'
    
