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
from exe.webui                  import common
from exe.webui.block            import Block
from exe.engine.freetextidevice import FreeTextIdevice
from exe.webui.blockfactory     import g_blockFactory

log = logging.getLogger(__name__)
_   = gettext.gettext


# ===========================================================================
class FreeTextBlock(Block):
    """
    FreeTextBlock can render and process FreeTextIdevices as XHTML

    YES it's a cut and paste from SimpleBlock, GenericBlock will 
    replace them both..... one day
    """
    def __init__(self, idevice):
        Block.__init__(self, idevice)

    def process(self, request):
        Block.process(self, request)
        if "content"+self.id in request.args:
            self.idevice.content = request.args["content"+self.id][0]

    def processDone(self, request):
        Block.processDone(self, request)
        self.idevice.edit = False

    def processEdit(self, request):
        Block.processEdit(self, request)
        self.idevice.edit = True

    def processDelete(self, request):
        Block.processDelete(self, request)
        self.idevice.delete()

    def processMove(self, request):
        Block.processMove(self, request)
        nodeId = request.args["move"+self.id][0]
        #TODO tidy this up
        node   = self.idevice.parentNode.package.findNode(nodeId)
        if node is not None:
            self.idevice.setParentNode(node)
        else:
            log.error("addChildNode cannot locate "+nodeId)

    def processMovePrev(self, request):
        Block.processMovePrev(self, request)
        self.idevice.movePrev()

    def processMoveNext(self, request):
        Block.processMoveNext(self, request)
        self.idevice.moveNext()

    def renderEdit(self):
        """
        Returns an XHTML string with the form element for editing this block
        """
        html  = "<div>\n"
        html += "<script type=\"text/javascript\">\n"
        html += "<!--\n"
        html += "    var editor = new FCKeditor('content"+self.id+"');\n"
        html += "    editor.BasePath = '/scripts/';\n"
        html += "    editor.Config['CustomConfigurationsPath'] = '/scripts/armadillo.js'\n"
        html += "    editor.ToolbarSet = 'Armadillo'; \n"
        content = self.idevice.content.replace("\r", "")
        content = content.replace("\n","\\n")
        content = content.replace("'","\\'")
        html += "    editor.Value      = '"+content+"'; \n"
        html += "    editor.Create();\n"
        html += "//-->\n"
        html += "</script>\n"
        html += self.renderEditButtons()
        html += "</div>\n"
        return html

    def renderView(self):
        """
        Returns an XHTML string for viewing this block
        """
        html  = "<div>\n"
        html += self.idevice.content
        html += "</div>\n"
        return html
    
    def renderPreview(self):
        """
        Returns an XHTML string for previewing this block
        """
        html  = "<div>\n"
        html += self.idevice.content
        html += self.renderViewButtons()
        html += "</div>\n"
        return html

g_blockFactory.registerBlockType(FreeTextBlock, FreeTextIdevice)

# ===========================================================================
