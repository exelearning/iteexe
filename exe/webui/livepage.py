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
from twisted.web.template import Element, XMLFile, renderer, tags
from twisted.web.server import Request
from twisted.web.resource import Resource
from twisted.web.static import File
from twisted.web.util import redirectTo

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


class RenderableLivePage(_RenderablePage, Resource):
    """
    This class is both a renderable and a Resource
    """

    def __init__(self, parent, package=None, config=None):
        """
        Same as Renderable.__init__ but
        """
        Resource.__init__(self)
        _RenderablePage.__init__(self, parent, package, config)

    def render(self, request):
        request.setHeader('Expires', 'Fri, 25 Nov 1966 08:22:00 EST')
        request.setHeader("Cache-Control", "no-store, no-cache, must-revalidate")
        request.setHeader("Pragma", "no-cache")
        return Resource.render(self, request)

    def render_liveglue(self, request):
        return tags.script(src='/jsui/nevow_glue.js')
