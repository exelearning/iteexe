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

from twisted.web import server, resource
from twisted.internet import reactor, defer
from nevow import compy, appserver, inevow
from nevow.i18n import languagesFactory
from exe.engine.packagestore import PackageStore
from exe import globals as G
import logging

log = logging.getLogger(__name__)


def setLocaleFromRequest(request):
    acceptedLocales = languagesFactory(request)
    for locale in acceptedLocales:
        try:
            G.application.config.locales[locale].install(unicode=True)
            break
        except KeyError:
            pass

    G.application.config.locale = locale
    return locale


class eXeResourceAdapter(appserver.OldResourceAdapter):
    def renderLocalized(self, request):
#        setLocaleFromRequest(request)
        return self.original.render(request)

    def renderHTTP(self, ctx):
        request = inevow.IRequest(ctx)
        if self.real_prepath_len is not None:
            path = request.postpath = request.prepath[self.real_prepath_len:]
            del request.prepath[self.real_prepath_len:]
        result = defer.maybeDeferred(self.renderLocalized, request).addCallback(
            self._handle_NOT_DONE_YET, request)
        return result

compy.registerAdapter(eXeResourceAdapter, resource.IResource, inevow.IResource)


class eXeRequest(appserver.NevowRequest):
    def __init__(self, *args, **kw):
        appserver.NevowRequest.__init__(self, *args, **kw)
        self.locale = None

    def gotPageContext(self, pageContext):
#         request = inevow.IRequest(pageContext)
#        self.locale = setLocaleFromRequest(request)
        appserver.NevowRequest.gotPageContext(self, pageContext)

    def getSession(self, sessionInterface = None):
        self.sitepath = [str(self.host.port)]
        log.debug("In Cookie's: %s" % self.received_cookies)
        session = appserver.NevowRequest.getSession(self, sessionInterface)
        log.debug("Out Cookie's: %s" % self.cookies)
        return session

class eXeSession(server.Session):
    def __init__(self, *args, **kwargs):
        server.Session.__init__(self, *args, **kwargs)
        self.packageStore = PackageStore()


class eXeSite(appserver.NevowSite):
    requestFactory = eXeRequest

    def makeSession(self):
        """Generate a new Session instance, and store it for future reference.
        """
        uid = self._mkuid()
        s = eXeSession(self, uid)
        session = self.sessions[uid] = s
        return session
