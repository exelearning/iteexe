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
from exe.engine.packagestore import g_packageStore
log = logging.getLogger(__name__)
_   = gettext.gettext


# ===========================================================================
class OutlinePane(object):
    """
    OutlinePane is responsible for creating the XHTML for the package outline
    """
    def __init__(self):
        self.package = None

    def process(self, request, package):
        """ 
        Get current package
        """
        log.debug("process")
        self.package = package
        
        if "action" in request.args:
            nodeId = request.args["object"][0]

            if request.args["action"][0] == "changeNode":
                node = self.package.findNode(nodeId)
                if node is not None:
                    self.package.currentNode = node
                else:
                    log.error("changeNode cannot locate "+nodeId)

            elif request.args["action"][0] == "addChildNode":
                node = self.package.findNode(nodeId)
                if node is not None:
                    node.createChild()
                else:
                    log.error("addChildNode cannot locate "+nodeId)

            elif request.args["action"][0] == "deleteNode":
                node = self.package.findNode(nodeId)
                if node is not None:
                    node.delete()
                else:
                    log.error("deleteNode cannot locate "+nodeId)

            elif request.args["action"][0] == "movePrevNode":
                node = self.package.findNode(nodeId)
                if node is not None:
                    node.movePrev()
                else:
                    log.error("movePrevNode cannot locate "+nodeId)

            elif request.args["action"][0] == "moveNextNode":
                node = self.package.findNode(nodeId)
                if node is not None:
                    node.moveNext()
                else:
                    log.error("moveNextNode cannot locate "+nodeId)

            elif request.args["action"][0] == "promoteNode":
                node = self.package.findNode(nodeId)
                if node is not None:
                    node.promote()
                else:
                    log.error("promoteNode cannot locate "+nodeId)

            elif request.args["action"][0] == "demoteNode":
                node = self.package.findNode(nodeId)
                if node is not None:
                    node.demote()
                else:
                    log.error("demoteNode cannot locate "+nodeId)

            
    def render(self):
        """
        Returns an XHTML string for viewing this pane
        """
        log.debug("render")
        
        html  = "<!-- start outline pane -->\n"
        html += "<div id=\"outline\">\n"
        html += "<ul>\n"
        html += "<li>" 
        html += self.__renderNode(self.package.draft)
        html += "</li>\n" 
        html += "<li>" 
        html += "<div id=\"node_actions\">" 
        html += self.__renderNode(self.package.root)
        html += common.submitImage("addChildNode", 
                                   self.package.root.getIdStr(), 
                                   "stock-new.png",
                                   title=_("Add ")+self.package.levelName(0))
        html += self.__renderChildren(self.package.root)
        html += "</div>" 
        html += "</li>\n" 
        html += "</ul>\n"
        html += "</div>\n"
        html += "<!-- end outline pane -->\n"

        return html


    def __renderChildren(self, node):
        html = ""
        if node.children:
            html += "<ul>\n"
            for child in node.children:
                html += "<li>" 
                html += "<div id=\"node_actions\">" 
                html += self.__renderNode(child)
                html += self.__renderActions(child)
                html += "</div>" 
                html += self.__renderChildren(child)
                html += "</li>\n" 
                
            html += "</ul>\n"

        return html


    def __renderNode(self, node):
        html = ""
        if node == self.package.currentNode:
            html += "<b>" + node.getTitle() + "</b>"
        else:
            html += common.submitLink("changeNode", node.getIdStr(), 
                                      node.getTitle())
        return html

        
    def __renderActions(self, node):
        html  = " "
        childLevel = self.package.levelName(len(node.id) - 1)
#        html += common.submitLink("addChildNode", node.getIdStr(), 
#                                  _("Add ")+childLevel, "action")      
        id = node.getIdStr()

        html += common.submitImage("addChildNode", id, 
                                   "stock-new.png", _("Add ")+childLevel )
        html += common.submitImage("deleteNode", id, 
                                   "stock-cancel.png", _("Delete"))

        if len(node.id) > 2:
            html += common.submitImage("promoteNode", id, 
                                       "stock-goto-top.png", _("Promote"))
        else:
            html += common.image("stock-goto-top-off.png")

        if len(node.id) > 1 and node.id[-1] > 0:
            html += common.submitImage("demoteNode", id, 
                                       "stock-goto-bottom.png", _("Demote"))
        else:
            html += common.image("stock-goto-bottom-off.png")

        if node.id[-1] > 0:
            html += common.submitImage("movePrevNode", id, 
                                       "stock-go-up.png", _("Move Up"))
        else:
            html += common.image("stock-go-up-off.png")

        if node.id[-1] < len(node.parent.children) - 1:
            html += common.submitImage("moveNextNode", id, 
                                       "stock-go-down.png", _("Move Down"))
        else:
            html += common.image("stock-go-down-off.png")

        return html


    
# ===========================================================================
