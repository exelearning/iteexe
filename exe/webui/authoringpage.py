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
from exe.webui.titleblock   import TitleBlock
from exe.engine.error       import Error
from exe.engine.packagestore import g_packageStore

log = logging.getLogger(__name__)
_   = gettext.gettext

# ===========================================================================
class AuthoringPage(Resource):
    """
    AuthoringPage is responsible for creating the XHTML for the authoring
    area of the eXe web user interface.  
    """
    def __init__(self, parent):
        """
        Initialize
        'parent' is our MainPage instance that created us
        """
        self.blocks     = []
        self.levelLimit = 0
        self.parent = parent
        self.package = parent.package

    def _process(self, request):
        """
        Delegates processing of args to blocks
        """  
        packageName = request.prepath[0]
        self.parent.process(request)
        if ("action" in request.args and 
            request.args["action"][0] == "saveChange"):
            log.debug("process savachange:::::")
            self.package.save()
            log.debug("package name: " + packageName)
        for block in self.blocks:
            block.process(request)
        log.debug("after authoringPage process" + repr(request.args))


    def render_GET(self, request):
        """
        Returns an XHTML string for viewing this page
        TODO: needs to get topNode, maxDepth=1 from somewhere
        """
        log.debug("render")
        self._process(request)
        topNode = self.package.currentNode
        maxDepth = 1
        self.levelLimit = len(topNode.id) + maxDepth
        self.blocks     = []
        self.__addBlocks(topNode)
        html = self.__renderHeader()
        html += common.banner(request)
        html += "<!-- start authoring page -->\n"
        html += "<div id=\"authoring_page\">\n"

        for block in self.blocks:
            html += block.render()

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
        html += "@import url(/style/"+self.package.style+"/content.css);</style>\n"
        html += "<link rel=\"alternate stylesheet\" type=\"text/css\" "
        html += " media=\"screen\"" 
        html += "title=\"garden\" href=\"style/garden/content.css\" />" 
        html += "<link rel=\"alternate stylesheet\" type=\"text/css\" "
        html += " media=\"screen\"" 
        html += "title=\"mojave\" href=\"style/mojave/content.css\" />" 
        html += "<script language=\"JavaScript\" src=\"/scripts/common.js\">"
        html += "</script>\n"
        html += "<script language=\"JavaScript\" src=\"/scripts/fckeditor.js\">"
        html += "</script>\n"
        html += "<title>"+_("eXe : elearning XHTML editor")+"</title>\n"
        html += "<meta http-equiv=\"content-type\" content=\"text/html; "
        html += " charset=UTF-8\" />\n";
        html += "</head>\n"
        return html

    def __addBlocks(self, node):
        """
        Recursively add blocks for all the nodes down to the level limit 
        which was set
        """
        self.blocks.append(TitleBlock(node.title))

        for idevice in node.idevices:
            block = g_blockFactory.createBlock(idevice)
            if not block:
                log.critical("Unable to render iDevice.")
                raise Error("Unable to render iDevice.")
            self.blocks.append(block)

        for child in node.children:
            if len(child.id) < self.levelLimit:
                self.__addBlocks(child)

# ===========================================================================
