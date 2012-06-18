# -- coding: utf-8 --
# ===========================================================================
# eXe
# Copyright 2012, Pedro Peña Pérez, Open Phoenix IT
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
# ===========================================================================

import logging
from exe.webui.renderable import _RenderablePage
from exe.webui.authoringpage import AuthoringPage
import nevow
from nevow.livepage import LivePage, DefaultClientHandleFactory, _js,\
    ClientHandle, IClientHandle
from nevow import inevow, rend, tags
import traceback
from twisted.internet import defer, reactor

log = logging.getLogger(__name__)


class eXeClientHandle(ClientHandle):
    __implements__ = IClientHandle

    def alert(self, what, onDone=None):
        """Show the user an alert 'what'
        """
        if not isinstance(what, _js):
            what = "'%s'" % (self.flt(what), )
        if onDone:
            self.sendScript("Ext.Msg.alert('',%s, function() { %s });" % (what, onDone))
        else:
            self.sendScript("Ext.Msg.alert('',%s);" % (what, ))


class eXeClientHandleFactory(DefaultClientHandleFactory):
    clientHandleClass = eXeClientHandle

    def newClientHandle(self, ctx, refreshInterval, targetTimeoutCount):
        handle = DefaultClientHandleFactory.newClientHandle(self, ctx, refreshInterval, targetTimeoutCount)
        log.debug('New client handle %s. Handles %s' % (handle.handleId, self.clientHandles))
        return handle

clientHandleFactory = eXeClientHandleFactory()


class Output(object):
    __implements__ = inevow.IResource,

    def renderHTTP(self, ctx):
        request = inevow.IRequest(ctx)
        ## Make sure twisted.protocols.http doesn't leave crappy
        ## DelayedCalls around, because we manage timeouts of
        ## the output object
        try:
            request.channel._savedTimeOut = None
            request.setHeader("Cache-Control", "no-cache")
            request.setHeader("Pragma", "no-cache")
            request.setHeader("Connection", "close")
            request.write('')

            handleId = ctx.arg('client-handle-id')

            d = defer.Deferred()
            clientHandle = clientHandleFactory.getHandleForId(handleId)
            request.notifyFinish().addErrback(clientHandle.outputGone, d)
            clientHandle.setOutput(d)
        except Exception, e:
            traceback.print_stack()
            return "alert('Exception on server: %s')" % e.replace("'", '"')
        return d


class Input(object):
    __implements__ = inevow.IResource,

    def renderHTTP(self, ctx):
        request = inevow.IRequest(ctx)
        request.setHeader("Cache-Control", "no-cache")
        request.setHeader("Pragma", "no-cache")
        handleId = ctx.arg('client-handle-id')
        # get the clientHandle
        clientHandle = clientHandleFactory.getHandleForId(handleId)
        reactor.callLater(0.00000001, clientHandle.handleInput,
                          request.args['target'][0],
                          *request.args.get('arguments',()))
        return '<html><body>Input event.</body></html>'


class RenderableLivePage(_RenderablePage, LivePage):
    """
    This class is both a renderable and a LivePage/Resource
    """

    def __init__(self, parent, package=None, config=None):
        """
        Same as Renderable.__init__ but
        """
        LivePage.__init__(self)
        _RenderablePage.__init__(self, parent, package, config)
        self.clientHandleFactory = clientHandleFactory

    def renderHTTP(self, ctx):
        "Disable cache of live pages"
        request = inevow.IRequest(ctx)
        request.setHeader('Expires', 'Fri, 25 Nov 1966 08:22:00 EST')
        request.setHeader("Cache-Control", "no-store, no-cache, must-revalidate")
        request.setHeader("Pragma", "no-cache")
        # each time the page is rendered, it gets a new ClientHandle
        handle = clientHandleFactory.newClientHandle(
            ctx,
            self.refreshInterval,
            self.targetTimeoutCount)
#        handle.authoringPage = AuthoringPage(self)
        ctx.remember(handle, IClientHandle)
        self.goingLive(ctx, handle)
        return rend.Page.renderHTTP(self, ctx)

    child_nevow_liveOutput = Output()
    child_nevow_liveInput = Input()

    def render_liveglue(self, ctx, data):
        return tags.script(src='/jsui/nevow_glue.js')
