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
import nevow
from nevow.livepage import LivePage, DefaultClientHandleFactory, _js,\
    ClientHandle, IClientHandle, jquote
from nevow import inevow, tags

log = logging.getLogger(__name__)

def allClients(client1, client2):
    return True

def otherClients(client1, client2):
    return client1.handleId != client2.handleId

def allSessionClients(client1, client2):
    return client1.handleId[:32] == client2.handleId[:32]

def otherSessionClients(client1, client2):
    return otherClients(client1, client2) and allSessionClients(client1, client2)

def allSessionPackageClients(client1, client2):
    return client1.packageName == client2.packageName and allSessionClients(client1, client2)

def otherSessionPackageClients(client1, client2):
    return otherClients(client1, client2) and allSessionPackageClients(client1, client2)


class eXeClientHandle(ClientHandle):
    __implements__ = IClientHandle

    def sendScript(self, script, filter_func=None):
        if filter_func:
            for client in nevow.livepage.clientHandleFactory.clientHandles.values():
                if filter_func(client, self):
                    ClientHandle.sendScript(client, script)
        else:
            ClientHandle.sendScript(self, script)

    def _exec(self, what, js_func, onDone=None, filter_func=False):
        if not isinstance(what, _js):
            what = "'%s'" % (self.flt(what), )
        if onDone:
            script = "%s('',%s, function() { %s });" % (js_func, what, onDone)
        else:
            script = "%s('',%s);" % (js_func, what, )
        if filter_func and onDone:
            for client in nevow.livepage.clientHandleFactory.clientHandles.values():
                if filter_func(client, self):
                    client.sendScript(onDone)
        self.sendScript(script)

    def alert(self, what, onDone=None, filter_func=False):
        """Show the user an alert 'what'
        """
        self._exec(what, 'Ext.Msg.alert', onDone, filter_func)

    def filePickerAlert(self, what, onDone=None, filter_func=False):
        self._exec(what, 'eXe.app.filepicker.alert', onDone, filter_func)

    def notifyStatus(self, title, msg):
        self.sendScript("eXe.controller.eXeViewport.prototype.eXeNotificationStatus('%s', '%s');" % (jquote(title), jquote(msg)), filter_func=allSessionClients)

    def hideStatus(self):
        self.sendScript('Ext.ComponentQuery.query("#eXeNotification")[0].hide();', filter_func=allSessionClients)

    def notifyNotice(self, title, msg, type):
        self.sendScript("eXe.controller.eXeViewport.prototype.eXeNotificationNotice('%s','%s', '%s');" % (jquote(title), jquote(msg), jquote(type)), filter_func=allSessionClients)


class eXeClientHandleFactory(DefaultClientHandleFactory):
    clientHandleClass = eXeClientHandle

    def newClientHandle(self, ctx, refreshInterval, targetTimeoutCount):
        handle = DefaultClientHandleFactory.newClientHandle(self, ctx, refreshInterval, targetTimeoutCount)
        handle.currentNodeId = ctx.tag.package.currentNode.id
        handle.packageName = ctx.tag.package.name
        handle.session = inevow.ISession(ctx)
        log.debug('New client handle %s. Handles %s' % (handle.handleId, self.clientHandles))
        return handle

nevow.livepage.clientHandleFactory = eXeClientHandleFactory()

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
        self.clientHandleFactory = nevow.livepage.clientHandleFactory

    def renderHTTP(self, ctx):
        request = inevow.IRequest(ctx)
        request.setHeader('Expires', 'Fri, 25 Nov 1966 08:22:00 EST')
        request.setHeader("Cache-Control", "no-store, no-cache, must-revalidate")
        request.setHeader("Pragma", "no-cache")
        return LivePage.renderHTTP(self, ctx)

    def render_liveglue(self, ctx, data):
        return tags.script(src='/jsui/nevow_glue.js')
