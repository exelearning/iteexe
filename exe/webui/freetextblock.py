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
    """
    def __init__(self, parentNode, idevice):
        if idevice.edit:
            mode = Block.Edit
        else:
            mode = Block.View
        Block.__init__(self, parentNode, idevice.id, mode)
        self.idevice = idevice

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
        self.parentNode.deleteIdevice(self.id)

    def processMove(self, request):
        Block.processDelete(self, request)
        selected = request.args["move"+self.id][0]
        nodeId   = selected.split(":", 1)[0]
        node     = self.parentNode.package.findNode(nodeId)
        node.idevices.append(self.idevice)
        self.parentNode.deleteIdevice(self.id)
        self.parentNode = node


    def renderEdit(self):
        """
        Returns an XHTML string with the form element for editing this block
        """
        html  = "<div>\n"
        html += common.textArea("content"+self.id, self.idevice.content)
        html += self.renderEditButtons()
        html += "</div>\n"
        return html

    def renderView(self):
        """
        Returns an XHTML string for viewing this block
        """
        html  = "<div>\n"
        html += self.idevice.content
        html += self.renderViewButtons()
        html += "</div>\n"
        return html

g_blockFactory.registerBlockType(FreeTextBlock, FreeTextIdevice)

# ===========================================================================
