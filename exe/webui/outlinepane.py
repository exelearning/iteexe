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
                    self.package.currentNode = node.createChild()
                else:
                    log.error("addChildNode cannot locate "+nodeId)

            elif request.args["action"][0] == "deleteNode":
                node = self.package.findNode(nodeId)
                if node is not None:
                    node.delete()
                    if node.isAncestorOf(self.package.currentNode):
                        self.package.currentNode = self.package.root
                else:
                    log.error("deleteNode cannot locate "+nodeId)


            
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
        """Renders all the children of a node as a list"""
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
        """Renders a node either as a link, or as the bold current node"""
        html = ""
        if node == self.package.currentNode:
            html += "<b>" + node.getTitle() + "</b>"
        else:
            html += common.submitLink("changeNode", node.getIdStr(), 
                                      node.getTitle())
        return html

        
    def __renderActions(self, node):
        """Renders the add and delete action icons"""
        html  = " "
        childLevel = self.package.levelName(len(node.id) - 1)
        html += common.submitImage("addChildNode", node.getIdStr(),
                                   "stock-new.png", _("Add ")+childLevel )
        html += common.submitImage("deleteNode", node.getIdStr(),
                                   "stock-cancel.png", _("Delete"))

        return html


    
# ===========================================================================
