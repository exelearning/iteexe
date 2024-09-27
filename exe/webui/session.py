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

from flask import session
from exe.engine.packagestore import PackageStore
from exe import globals as G
import logging

log = logging.getLogger(__name__)


class eXeSession:
    def __init__(self):
        self.packageStore = PackageStore()
        self.oauthToken = {}

    def getSession(self):
        return session

    def getPackageName(self, request):
        try:
            return request.headers.get('Referer').split('/')[-1]
        except:
            return None

class eXeSession(server.Session):
    def __init__(self, *args, **kwargs):
        server.Session.__init__(self, *args, **kwargs)
        self.packageStore = PackageStore()
        self.oauthToken = {}


class eXeSite(appserver.NevowSite):
    requestFactory = eXeRequest

    def makeSession(self):
        """Generate a new Session instance, and store it for future reference.
        """
        uid = self._mkuid()
        s = eXeSession(self, uid)
        session = self.sessions[uid] = s
        return session
