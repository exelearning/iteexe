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
from exe.webui import common
from exe.engine.node import Node
from exe.webui.block import Block
from exe.engine.packagestore import g_packageStore

log = logging.getLogger(__name__)
_   = gettext.gettext


# ===========================================================================
class LinkBlock(Block):
    """
    LinkBlock can render nodes as links
    """
    def __init__(self, node):
        Block.__init__(self, node.parent, node.getIdStr(), mode=Block.View)
        self.node    = node
        self.package = node.package


    def processDelete(self, request):
        log.debug("processDelete id="+self.id)
        nodeId = request.args["object"][0]
        self.package.findNode(nodeId).delete()

    def processPromote(self, request):
        log.debug("processPromote id="+self.id)
        nodeId = request.args["object"][0]
        self.package.findNode(nodeId).promote()

    def processDemote(self, request):
        log.debug("processDemote id="+self.id)
        nodeId = request.args["object"][0]
        self.package.findNode(nodeId).demote()

    def processMovePrev(self, request):
        log.debug("processMovePrev id="+self.id)
        nodeId = request.args["object"][0]
        self.package.findNode(nodeId).movePrev()

    def processMoveNext(self, request):
        log.debug("processMoveNext id="+self.id)
        nodeId = request.args["object"][0]
        self.package.findNode(nodeId).moveNext()

    def renderView(self):
        """
        Returns an XHTML string for viewing this link
        """
        log.debug("renderView")
        id    = self.node.getIdStr()

        #NB: We depend on OutlinePane handling this action
        html  = common.submitLink("changeNode", id, self.node.getTitle())

        html += common.submitImage("delete",   id, "stock-cancel.png")
        html += common.submitImage("promote",  id, "stock-go-back.png")
        html += common.submitImage("demote",   id, "stock-go-forward.png")
        html += common.submitImage("movePrev", id, "stock-go-up.png")
        html += common.submitImage("moveNext", id, "stock-go-down.png")
        html += "<br/>\n"
        return html
      
# ===========================================================================
