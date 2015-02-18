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
from nevow import compy, appserver, inevow
from nevow.i18n import languagesFactory
from exe import globals as G
import logging

log = logging.getLogger(__name__)


def getLocaleFromRequest(request):
    acceptedLocales = languagesFactory(request)
    for locale in acceptedLocales:
        if locale in G.application.config.locales:
            break

    return locale

    def renderHTTP(self, ctx):
        request = inevow.IRequest(ctx)
        if self.real_prepath_len is not None:
            path = request.postpath = request.prepath[self.real_prepath_len:]
            del request.prepath[self.real_prepath_len:]
        result = defer.maybeDeferred(self.renderLocalized, request).addCallback(
            self._handle_NOT_DONE_YET, request)
        return result

compy.registerAdapter(appserver.OldResourceAdapter, resource.IResource, inevow.IResource)


compy.registerAdapter(eXeResourceAdapter, resource.IResource, inevow.IResource)


class eXeRequest(appserver.NevowRequest):
    def getUser(self):
        # return self.args['user'][0]
        return appserver.NevowRequest.getUser(self)

    def gotPageContext(self, pageContext):
        request = inevow.IRequest(pageContext)
        session = request.getSession()
        if not session.user:
            user = request.getUser()
            if user:
                session.setUser(user)
        if session.user:
            if session.user.initialConfig:
                locale = getLocaleFromRequest(request)
                session.user.config.locale = locale
                session.user.config.configParser.set('user', 'locale', locale)
                session.user.initialConfig = False
            if session.user.config:
                G.application.config = session.user.config
                session.site.server.application.config = session.user.config
                session.site.server.preferences.config = session.user.config
                session.user.config.locales[session.user.config.locale].install(unicode=True)
            if session.user.ideviceStore:
                G.application.ideviceStore = session.user.ideviceStore
            package = session.user.packageStore.getPackage(request.prepath[0])
            if package:
                __builtins__['c_'] = lambda s: G.application.config.locales[package.lang].ugettext(s) if s else s
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
        self.user = None
        self.packageStore = None

    def setUser(self, name):
        self.user = G.application.userStore.getUser(name)
        self.packageStore = self.user.packageStore


class eXeSite(appserver.NevowSite):
    requestFactory = eXeRequest

    def __init__(self, *args, **kwargs):
        self.server = kwargs.pop('server')
        appserver.NevowSite.__init__(self, *args, **kwargs)

    def makeSession(self):
        """Generate a new Session instance, and store it for future reference.
        """
        uid = self._mkuid()
        s = eXeSession(self, uid)
        session = self.sessions[uid] = s
        return session
