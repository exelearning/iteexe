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
from exe.webui.renderable import Renderable
from exe.webui.saml import prepare_nevow_request, init_saml_auth
from nevow import rend, inevow, url, tags

log = logging.getLogger(__name__)


class QuitPage(Renderable, rend.Page):
    _templateFileName = 'quit.html'
    name = 'quit'

    def __init__(self, parent, configDir):
        """
        Initialize
        """
        self.configDir = configDir
        parent.putChild(self.name, self)
        Renderable.__init__(self, parent)
        rend.Page.__init__(self)

    def renderHTTP(self, ctx):
        request = inevow.IRequest(ctx)
        session = request.getSession()
        if session.samlNameId:
            req = prepare_nevow_request(request)
            auth = init_saml_auth(req, self.configDir)
            logout_url = auth.logout(name_id=session.samlNameId, session_index=session.samlSessionIndex)
            session.samlNameId = None
            session.samlSessionIndex = None
            return url.URL.fromString(logout_url)
        session.expire()
        return rend.Page.renderHTTP(self, ctx)

    @staticmethod
    def render_title(ctx, data):
        ctx.tag.clear()
        return ctx.tag()[_("eXe Closed")]

    @staticmethod
    def render_msg1(ctx, data):
        ctx.tag.clear()
        return ctx.tag()[_("eXe has finished running in this window.")]

    @staticmethod
    def render_msg2(ctx, data):
        ctx.tag.clear()
        return ctx.tag()[_("You can close it safely.")]

    def render_msg3(self, ctx, data):
        if self.webServer.application.server:
            ctx.tag.clear()
            return ctx.tag()[tags.a(href='/')[_("Or start again...")]]
        return ctx.tag()
