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
class AddNodePane(object):
    """
    AddNodePane is responsible for creating the XHTML for add nodes links
    """
    def __init__(self):
        self.package = None

    def process(self, request, package):
        """ 
        Will create a new node if that's what the user selected
        """
        self.package = package

        if "action" in request.args:
            if request.args["action"][0] == "AddLevel1Node":
                self.package.currentNode = self.package.root.createChild()
                
            if request.args["action"][0] == "AddLevel2Node":
                parentId   = self.package.currentNode.id[:2]
                parentNode = self.package.findNode(parentId)
                self.package.currentNode = parentNode.createChild()
                
            if request.args["action"][0] == "AddLevel3Node":
                parentId   = self.package.currentNode.id[:3]
                parentNode = self.package.findNode(parentId)
                self.package.currentNode = parentNode.createChild()

            
            
    def render(self):
        """
        Returns an XHTML string for viewing this pane
        """
        log.debug("render")
        
        html = common.submitLink(_("Add ") + self.package.levelNames[0], 
                                 "AddLevel1Node", "") + "<br/>\n" 
       
        if len(self.package.currentNode.id) > 1:
            html += common.submitLink(_("Add ") + self.package.levelNames[1], 
                                      "AddLevel2Node", "") + "<br/>\n"
        else:
            html += _("Add ") + self.package.levelNames[1] + "<br/>\n"
            
        if len(self.package.currentNode.id) > 2:
            html += common.submitLink(_("Add ") + self.package.levelNames[2], 
                                      "AddLevel3Node", "") + "<br/>\n"
        else:
            html += _("Add ") + self.package.levelNames[2] + "<br/>\n"
            
        return html
        
        
         


    
# ===========================================================================
