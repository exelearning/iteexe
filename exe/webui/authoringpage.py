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

import logging
import gettext
from twisted.web.resource import Resource

from exe.webui import common
from exe.engine.packagestore import g_packageStore
from exe.webui.idevicepane   import IdevicePane
from exe.webui.authoringpane import AuthoringPane
from exe.webui.outlinepane   import OutlinePane
from exe.webui.menupane      import MenuPane

log = logging.getLogger(__name__)
_   = gettext.gettext


class AuthoringPage(Resource):
    """
    This is the main authoring page.  Responsible for handling URLs.
    Rendering and processing is delegated to the Pane classes.
    """
    
    def __init__(self):
        """
        Initialize a new authoring page
        """
        Resource.__init__(self)
        self.outlinePane   = OutlinePane()
        self.authoringPane = AuthoringPane()
        self.idevicePane   = IdevicePane()
        self.menuPane      = MenuPane()


    def getChild(self, name, request):
        """
        Try and find the child for the name given
        """
        if name == '':
            return self
        else:
            return Resource.getChild(self, name, request)


    def render_GET(self, request):
        """
        Called for all requests to this object
        """
        log.debug("render_GET" + repr(request.args))
        
        package = g_packageStore.getPackage(request.prepath[0])

        # Processing
        self.idevicePane.process(request, package)
        self.authoringPane.process(request)
        self.outlinePane.process(request, package)
        self.menuPane.process(request)
        
        html  = common.header()
        html += common.banner()

        if log.getEffectiveLevel() == logging.DEBUG:
            html += "<pre>"+repr(request.args)+"</pre>\n"
            html += "<pre>"+repr(package.currentNode.id)+"</pre>\n"

        html += "<form method=\"post\" action=\"%s\"" % request.path
        html += " name=\"contentForm\" onload=\"clearHidden();\" >\n"
        html += common.hiddenField("action")
        html += common.hiddenField("object")
        html += self.menuPane.render()
        html += "<div id=\"workbox\" class=\"outline-on\">\n"
        html += "<div id=\"workbox-top\">"
        html += "<a id=\"outline-off\" href=\"javascript:chooseTab(0)\" "
        html += "class=\"on\">Outline</a>"
        html += "<a id=\"iDevices-off\" href=\"javascript:chooseTab(1)\"  "
        html += " class=\"off\">iDevices</a>"
        html += "<a id=\"styles-off\" href=\"javascript:chooseTab(2)\" "
        html += "class=\"off\">Styles</a>"
        html += "<a id=\"close-workbox\" class=\"img\" "
        html += "href=\"javascript:toggleworkbox(0), toggleFix(0);\">"
        html += "<img border=\"0\" src=\"/images/hide.gif\" /></a>\n"
        html += "<a id=\"open-workbox\" class=\"img\" "
        html += " href=\"javascript:toggleworkbox(1), toggleFix(1);\">"
        html += "<img border=\"0\" src=\"/images/show.gif\" /></a>\n"
        html += "</div>\n"
        
        # workbox content
        html += "<div id=\"workbox-content\">\n"

        html += "<div id=\"styles-above\" class=\"links\">\n"
        html += "<span id=\"no-links\">eXe styles</span>\n"
        html += "</div>"

        html += "<div id=\"iDevices-above\" class=\"links\">\n"
        html += "<span class=\"name\">"
        html += self.idevicePane.render()
        html += "</span></div>\n"

        html += "<div id=\"outline-above\" class=\"links\">\n"
        html += "<span class=\"name\">"
        html += self.outlinePane.render()
        html += "</span></div>\n"
        html += "<div id=\"other-modules\">\n"
        html += "</div>"
        html += "</div>"
        html += "</div>\n"
        html += self.authoringPane.render(package.currentNode)
        html += "</form>\n"
        html += common.footer()
        return html

    render_POST = render_GET


