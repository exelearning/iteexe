from twisted.trial import unittest
import os
from twisted.internet import defer
from nevow import static, util, context
from nevow.test import test_rend

class FakeRequest(test_rend.req):
    _headers = None

    def __init__(self):
        test_rend.req.__init__(self)
        self.deferred = defer.Deferred()
        self._headers = {}

    def getHeader(self, k):
        if self._headers is None:
            return None
        return self._headers.get(k)

    def setLastModified(self, x):
        pass
    def registerProducer(self, producer, x):
        producer.resumeProducing()
    def unregisterProducer(self):
        pass
    def finish(self):
        test_rend.req.finish(self)
        self.deferred.callback(None)

def deferredRender(res, req):
    d = util.maybeDeferred(res.renderHTTP,
        context.PageContext(
            tag=res, parent=context.RequestContext(
                tag=req)))

    def done(result):
        if isinstance(result, str):
            req.write(result)
        req.d.callback(req)
        return result
    d.addCallback(done)
    return unittest.deferredResult(req.d, 1)

class Range(unittest.TestCase):
    def setUp(self):
        self.tmpdir = self.mktemp()
        os.mkdir(self.tmpdir)
        name = os.path.join(self.tmpdir, 'junk')
        f = file(name, 'w')
        f.write(800 * '0123456789')
        f.close()
        self.file = static.File(name)
        self.request = FakeRequest()

    def testBodyLength(self):
        self.request._headers['range'] = 'bytes=0-1999'
        r = deferredRender(self.file, self.request)
        self.assertEqual(len(r.v), 2000)

    def testBodyContent(self):
        self.request._headers['range'] = 'bytes=0-1999'
        r = deferredRender(self.file, self.request)
        self.assertEqual(r.v, 200 * '0123456789')

    def testContentLength(self):
        """Content-Length of a request is correct."""
        self.request._headers['range'] = 'bytes=0-1999'
        r = deferredRender(self.file, self.request)
        self.assertEqual(r.headers['content-length'], '2000')

    def testContentRange(self):
        """Content-Range of a request is correct."""
        self.request._headers['range'] = 'bytes=0-1999'
        r = deferredRender(self.file, self.request)
        self.assertEqual(r.headers.get('content-range'), 'bytes 0-1999/8000')

    def testBodyLength_offset(self):
        self.request._headers['range'] = 'bytes=3-10'
        r = deferredRender(self.file, self.request)
        self.assertEqual(len(r.v), 8)

    def testBodyContent_offset(self):
        self.request._headers['range'] = 'bytes=3-10'
        r = deferredRender(self.file, self.request)
        self.assertEqual(r.v, '34567890')

    def testContentLength_offset(self):
        """Content-Length of a request is correct."""
        self.request._headers['range'] = 'bytes=3-10'
        r = deferredRender(self.file, self.request)
        self.assertEqual(r.headers['content-length'], '8')

    def testContentRange_offset(self):
        """Content-Range of a request is correct."""
        self.request._headers['range'] = 'bytes=3-10'
        r = deferredRender(self.file, self.request)
        self.assertEqual(r.headers.get('content-range'), 'bytes 3-10/8000')
