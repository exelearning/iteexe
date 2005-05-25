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
"""
AuthoringPage is responsible for creating the XHTML for the authoring
area of the eXe web user interface.  
"""

import logging
import gettext
from twisted.web.resource import Resource
from exe.webui import common
from exe.webui.blockfactory import g_blockFactory
from exe.engine.error       import Error
from exe.webui.renderable import RenderableResource

log = logging.getLogger(__name__)
_   = gettext.gettext

# ===========================================================================
class AuthoringPage(RenderableResource):
    """
    AuthoringPage is responsible for creating the XHTML for the authoring
    area of the eXe web user interface.  
    """
    name = 'authoring'

    def __init__(self, parent):
        """
        Initialize
        'parent' is our MainPage instance that created us
        """
        RenderableResource.__init__(self, parent)
        self.blocks  = []


    def getChild(self, name, request):
        """
        Try and find the child for the name given
        """
        if name == "":
            return self
        else:
            return Resource.getChild(self, name, request)


    def _process(self, request):
        """
        Delegates processing of args to blocks
        """  
        self.parent.process(request)
        if ("action" in request.args and 
            request.args["action"][0] == "saveChange"):
            log.debug("process savachange:::::")
            self.package.save()
            log.debug("package name: " + self.package.name)
        for block in self.blocks:
            block.process(request)
        log.debug("after authoringPage process" + repr(request.args))


    def render_GET(self, request):
        """
        Returns an XHTML string for viewing this page
        """
        log.debug("render")
        self._process(request)
        topNode     = self.package.currentNode
        self.blocks = []
        self.__addBlocks(topNode)
        html  = self.__renderHeader()
        html += common.banner(request)
        html += "<!-- start authoring page -->\n"
        html += "<div id=\"main\">\n"
        html += "<div id=\"nodeDecoration\">\n"
        html += "<p id=\"nodeTitle\">"+topNode.getTitle()+"</p>\n" 
        html += "</div>\n"

        for block in self.blocks:
            html += block.render(self.package.style)

        html += "</div>\n"
        html += common.footer()

        return html

    render_POST = render_GET


    def __renderHeader(self):
        """Generates the header for AuthoringPage"""
        html  = common.docType()
        html += "<html xmlns=\"http://www.w3.org/1999/xhtml\">\n"
        html += "<head>\n"
        html += "<style type=\"text/css\">\n"
        html += "@import url(/css/exe.css);\n"
        html += "@import url(/style/"+self.package.style+"/content.css);\n"
        html += "</style>\n"
        html += "<script language=\"JavaScript\" src=\"/scripts/common.js\">"
        html += "</script>\n"
        html += "<script language=\"JavaScript\" src=\"/scripts/fckeditor.js\">"
        html += "</script>\n"
        html += '<script language="JavaScript" src="/scripts/libot_drag.js">'
        html += "</script>\n"
        html += "<title>"+_("eXe : elearning XHTML editor")+"</title>\n"
        html += "<meta http-equiv=\"content-type\" content=\"text/html; "
        html += " charset=UTF-8\" />\n";
        html += "</head>\n"
        return html


    def __addBlocks(self, node):
        """
        Add All the blocks for the currently selected node
        """
        for idevice in node.idevices:
            block = g_blockFactory.createBlock(idevice)
            if not block:
                log.critical("Unable to render iDevice.")
                raise Error("Unable to render iDevice.")
            self.blocks.append(block)

# ===========================================================================
