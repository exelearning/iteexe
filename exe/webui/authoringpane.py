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
from exe.webui.blockfactory import g_blockFactory
from exe.webui.titleblock   import TitleBlock
from exe.webui.linkblock    import LinkBlock
from exe.util.error         import Error

log = logging.getLogger(__name__)
_   = gettext.gettext

# ===========================================================================
class AuthoringPane(object):
    """
    AuthoringPane is responsible for creating the XHTML for the authoring
    area of the eXe web user interface.  
    """
    def __init__(self, topNode, maxDepth=1):
        self.url        = ""
        self.topNode    = topNode
        self.levelLimit = len(topNode.id) + maxDepth
        self.blocks     = []
        self.addBlocks(topNode)


    def addBlocks(self, node):
        """
        Recursively add blocks for all the nodes down to the level limit 
        which was set
        """
        self.blocks.append(TitleBlock(node))

        for idevice in node.idevices:
            block = g_blockFactory.createBlock(idevice)
            if not block:
                log.critical("Unable to render iDevice.")
                raise Error("Unable to render iDevice.")
            self.blocks.append(block)

        if self.levelLimit is None or len(node.id) < self.levelLimit:
            for child in node.children:
                self.addBlocks(child)

        else:
            self.blocks.append(LinkBlock(node))


    def process(self, request):
        """
        Delegates processing of args to blocks
        """
        self.url = request.path
        for block in self.blocks:
            block.process(request)


    def render(self):
        """
        Returns an XHTML string for viewing this pane
        """
        html  = "<form method=\"post\" action=\"%s\">\n" % self.url

        for block in self.blocks:
            html += block.render()

        html += "</form>\n"
        return html
        
# ===========================================================================
