# Copyright (c) 2004 Divmod.
# See LICENSE for details.


from nevow import context
from nevow.tags import *
from nevow import testutil
from nevow.util import Deferred

from nevow import rend
from nevow import loaders


def deferit(data):
    return data.d


def deferdot(data):
    return data.d2


class RenderHelper(testutil.TestCase):
    def renderIt(self):
        req = testutil.FakeRequest()
        self.r.renderHTTP(context.PageContext(tag=self.r, parent=context.RequestContext(tag=req)))
        return req


class LaterRenderTest(RenderHelper):
    
    def setUp(self):
        self.d = Deferred()
        self.d2 = Deferred()
        self.r = rend.Page(
            docFactory=loaders.stan(
                html(data=self)[
                    'Hello ', invisible[invisible[invisible[invisible[deferit]]]],
                    deferdot,
                    ]
                )
            )

    def test_deferredSupport(self):
        req = self.renderIt()
        self.assertEqual(req.v, '<html>Hello ')
        self.d.callback("world")
        self.assertEqual(req.v, '<html>Hello world')
        self.d2.callback(".")
        self.assertEqual(req.v, '<html>Hello world.</html>')


    def test_deferredSupport2(self):
        req = self.renderIt()
        self.assertEqual(req.v, '<html>Hello ')
        self.d2.callback(".")
        self.assertEqual(req.v, '<html>Hello ')
        self.d.callback("world")
        self.assertEqual(req.v, '<html>Hello world.</html>')

    def test_deferredSupport3(self):
        self.r.buffered = True
        req = self.renderIt()
        self.assertEqual(req.v, '')
        self.d.callback("world")
        self.assertEqual(req.v, '')
        self.d2.callback(".")
        self.assertEqual(req.v, '<html>Hello world.</html>')


class LaterDataTest(RenderHelper):
    def data_later(self, context, data):
        return self.d

    def data_later2(self, context, data):
        return self.d2

    def setUp(self):
        self.d = Deferred()
        self.d2 = Deferred()
        self.r = rend.Page(docFactory=loaders.stan(
            html(data=self.data_later)[
                'Hello ', str, ' and '
                'goodbye ',str,
                span(data=self.data_later2, render=str)]))

    def test_deferredSupport(self):
        req = self.renderIt()
        self.assertEqual(req.v, '')
        self.d.callback("world")
        self.assertEqual(req.v, '<html>Hello world and goodbye world')
        self.d2.callback(".")
        self.assertEqual(req.v, '<html>Hello world and goodbye world.</html>')

