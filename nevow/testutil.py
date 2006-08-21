# Copyright (c) 2004 Divmod.
# See LICENSE for details.


from nevow import compy, inevow


class FakeChannel:
    def __init__(self, site):
        self.site = site


class FakeSite:
    pass


class FakeSession(compy.Componentized):
    def __init__(self, avatar):
        compy.Componentized.__init__(self)
        self.avatar = avatar
    def getLoggedInRoot(self):
        return self.avatar


fs = FakeSession(None)


class FakeRequest(compy.Componentized):
    __implements__ = inevow.IRequest,
    args = {}
    failure = None
    context = None

    def __init__(self, headers=None, args=None, avatar=None, uri=''):
        compy.Componentized.__init__(self)
        self.uri = uri
        self.prepath = ['']
        self.postpath = uri.split('?')[0].split('/')
        self.headers = headers or {}
        self.args = args or {}
        self.sess = FakeSession(avatar)
        self.site = FakeSite()
        self.received_headers = {}

    def URLPath(self):
        from nevow import url
        return url.URL.fromString('')

    def getSession(self):
        return self.sess

    v = ''
    def write(self, x):
        self.v += x

    finished=False
    def finish(self):
        self.finished = True

    def getHeader(self, key):
        d = {
            'referer': '/',
            }
        return d[key]

    def setHeader(self, key, val):
        self.headers[key] = val

    def redirect(self, url):
        self.redirected_to = url

    def getRootURL(self):
        return ''

    def processingFailed(self, f):
        self.failure = f

    def setResponseCode(self, code):
        self.code = code
        
    def prePathURL(self):
        return 'http://localhost/%s'%'/'.join(self.prepath)

    def getClientIP(self):
        return '127.0.0.1'


try:
    from twisted.trial import unittest
    FailTest = unittest.FailTest
except:
    import unittest
    class FailTest(Exception): pass


import sys
class TestCase(unittest.TestCase):
    hasBools = (sys.version_info >= (2,3))
    _assertions = 0

    # This should be migrated to Twisted.
    def failUnlessSubstring(self, containee, container, msg=None):
        self._assertions += 1
        if container.find(containee) == -1:
            raise unittest.FailTest, (msg or "%r not in %r" % (containee, container))
    def failIfSubstring(self, containee, container, msg=None):
        self._assertions += 1
        if container.find(containee) != -1:
            raise unittest.FailTest, (msg or "%r in %r" % (containee, container))
    
    assertSubstring = failUnlessSubstring
    assertNotSubstring = failIfSubstring

    def assertNotIdentical(self, first, second, msg=None):
        self._assertions += 1
        if first is second:
            raise FailTest, (msg or '%r is %r' % (first, second))

    def failIfIn(self, containee, container, msg=None):
        self._assertions += 1
        if containee in container:
            raise FailTest, (msg or "%r in %r" % (containee, container))

    def assertApproximates(self, first, second, tolerance, msg=None):
        self._assertions += 1
        if abs(first - second) > tolerance:
            raise FailTest, (msg or "%s ~== %s" % (first, second))


if not hasattr(TestCase, 'mktemp'):
    def mktemp(self):
        import tempfile
        return tempfile.mktemp()
    TestCase.mktemp = mktemp

