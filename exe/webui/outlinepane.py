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
from exe.webui import common
from exe.engine.packagestore import g_packageStore
log = logging.getLogger(__name__)
_   = gettext.gettext


# ===========================================================================
class OutlinePane(object):
    """
    OutlinePane is responsible for creating the XHTML for add course outline
    """
    def __init__(self):
        self.package = None

    def process(self, request):
        """ 
        Get current package
        """
        
        packageName = request.prepath[0]
        self.package = g_packageStore.getPackage(packageName)
        
        if "action" in request.args:
            if request.args["action"] == "changeNode":
                nodeId = request.args["object"][0]
                self.package.currentNode = self.package.findNode(nodeId.split("."))

                
    def getChildrenTitles(self, node):
        """
        Recursive function for getting childern's titles 
        """
        html  =  common.submitLink(node.title, "changeNode", node.idStr())      
        if len(node.children) > 0:
            html += "<ul>\n"
            for i in range (0, len(node.children)):
                html += "<li>" + self.getChildrenTitles(node.children[i]) + "</li>\n"
                
            html += "</ul>\n"
        
        
        return html
            
    def render(self):
        #Returns an XHTML string for viewing this pane
        html = self.getChildrenTitles(self.package.root)
        return html
        
        
         


    
# ===========================================================================
