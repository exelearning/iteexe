# ===========================================================================
# eXe
# Copyright 2004-2005, University of Auckland
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

import sys
import logging
import gettext
from twisted.web import static
from twisted.web.resource import Resource
from exe.webui import common
from exe.engine.packagestore import g_packageStore

log = logging.getLogger(__name__)
_   = gettext.gettext


class AuthoringPage(Resource):
    """
    This is the main authoring page.  Responsible for handling URLs.
    Rendering is delegated to the Pane classes.
    """
    
    def __init__(self):
        Resource.__init__(self)


    def processAction(self, name, action):
        if action == "Add":
            if name not in self.listNames():
                self.putChild(name, AuthoringPage())


    def getChild(self, name, request):
        if name == '':
            return self
        else:
            if "action" in request.args:
                self.processAction(name, request.args["action"][0])

            return Resource.getChild(self, name, request)


    def render_GET(self, request):
        """Create a new package and redirect the webrowser to the URL for it"""

        # Rendering
        html  = "<html><head><title>"+_("eXe")+"</title>\n"
        html += "</head>\n"
        html += common.banner(_("eXe"))
        html += _("Welcome to eXe")
        html += common.footer()
        return html
