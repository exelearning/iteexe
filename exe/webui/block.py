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
Block is the base class for the classes which are responsible for 
rendering and processing Idevices in XHTML
"""

import logging
import gettext
from exe.webui import common


log = logging.getLogger(__name__)
_   = gettext.gettext

# ===========================================================================
class Block(object):
    """
    Block is the base class for the classes which are responsible for 
    rendering and processing Idevices in XHTML
    """
    nextId = 0
    Edit, Preview, View, Hidden = range(4)

    def __init__(self, idevice):
        """
        Initialize a new Block object
        """
        self.idevice = idevice
        self.id      = idevice.id
        self.purpose = idevice.purpose
        self.tip     = idevice.tip
        self.package = idevice.parentNode.package

        if idevice.edit:
            self.mode = Block.Edit
        else:
            self.mode = Block.Preview


    def process(self, request):
        """
        Process the request arguments from the web server to see if any
        apply to this block
        """
        log.debug("process id="+self.id)
        
        if "action" in request.args:
            if request.args["action"][0] == "PreviewAll":
                self.processDone(request)

            elif request.args["action"][0] == "EditAll":
                self.processEdit(request)
            
        if "object" in request.args and request.args["object"][0] == self.id:
            self.package.isChanged = 1
            if request.args["action"][0] == "done":               
                self.processDone(request)
                

            elif request.args["action"][0] == "edit":
                self.processEdit(request)
              
            elif request.args["action"][0] == "delete":
                self.processDelete(request)
                
            elif request.args["action"][0] == "move":
                self.processMove(request)
                
            elif request.args["action"][0] == "movePrev":
                self.processMovePrev(request)
                
            elif request.args["action"][0] == "moveNext":
                self.processMoveNext(request)
                
            elif request.args["action"][0] == "promote":
                self.processPromote(request)
                
            elif request.args["action"][0] == "demote":
                self.processDemote(request)
                


    def processDone(self, request):
        """
        User has finished editing this block
        """
        log.debug("processDone id="+self.id)
        self.idevice.edit = False


    def processEdit(self, request):
        """
        User has started editing this block
        """
        log.debug("processEdit id="+self.id)
        self.idevice.edit = True


    def processDelete(self, request):
        """
        Delete this block and the associated iDevice
        """
        log.debug("processDelete id="+self.id)
        self.idevice.delete()


    def processMove(self, request):
        """
        Move this iDevice to a different node
        """
        log.debug("processMove id="+self.id)
        nodeId = request.args["move"+self.id][0]
        #TODO tidy this up
        node   = self.idevice.parentNode.package.findNode(nodeId)
        if node is not None:
            self.idevice.setParentNode(node)
        else:
            log.error("addChildNode cannot locate "+nodeId)


    def processPromote(self, request):
        """
        Promote this node up the hierarchy tree
        """
        log.debug("processPromote id="+self.id)


    def processDemote(self, request):
        """
        Demote this node down the hierarchy tree
        """
        log.debug("processDemote id="+self.id)


    def processMovePrev(self, request):
        """
        Move this block back to the previous position
        """
        log.debug("processMovePrev id="+self.id)
        self.idevice.movePrev()


    def processMoveNext(self, request):
        """
        Move this block forward to the next position
        """
        log.debug("processMoveNext id="+self.id)
        self.idevice.moveNext()


    def render(self):
        """
        Returns the appropriate XHTML string for whatever mode this block is in
        """
        html = ""
        if self.mode == Block.Edit:
            html += self.renderEdit()
            html += '<a name="currentBlock"></a>\n'


        elif self.mode == Block.View:
            html = self.renderView()
        
        elif self.mode == Block.Preview:
            html = self.renderPreview()

        return html


    def renderEdit(self):
        """
        Returns an XHTML string with the form element for editing this block
        """
        log.error("renderEdit called directly")
        return "ERROR Block.renderEdit called directly"


    def renderEditButtons(self):
        """
        Returns an XHTML string for the edit buttons
        """
        html  = common.submitImage("done", self.id, 
                                   "stock-apply.png", 
                                   _("Done"),1)
        html += common.submitImage("delete", self.id, 
                                   "stock-cancel.png", 
                                   _("Delete"),1)

        if self.idevice.isFirst():
            html += common.image("stock-go-up-off.png")
        else:
            html += common.submitImage("movePrev", self.id, 
                                       "stock-go-up.png", 
                                       _("Move Up"),1)

        if self.idevice.isLast():
            html += common.image("stock-go-down-off.png")
        else:
            html += common.submitImage("moveNext", self.id, 
                                       "stock-go-down.png", 
                                       _("Move Down"),1)

        options  = [(_("---Move To---"), "")]
        #TODO breaking 4 levels of encapsulation is TOO MUCH!!!
        options += self.__getNodeOptions(self.idevice.parentNode.package.draft)
        options += self.__getNodeOptions(self.idevice.parentNode.package.root)
        html += common.select("move", self.id, options)

        if self.purpose != "" or self.tip != "":
            html += "<a title=\""+_("Pedagogical Help")+"\" "
            html += "onmousedown=\"Javascript:updateCoords(event);\" "
            html += "onclick=\"Javascript:showMe('p%s', 420, 240);\" " % self.id
            html += "href=\"Javascript:void(0)\" style=\"cursor:help;\"> " 
            html += "<img src=\"/images/info.png\" border=\"0\" "
            html += "align=\"middle\" /></a>\n"
            html += "<div id=\"p%s\" style=\"display:none;\">" % self.id
            html += "<div style=\"float:right;\" "
            html += "<img src=\"images/stock-stop.png\" "
            html += " title=\""+_("Close")+"\" border=\"0\" align=\"middle\" "
            html += "onmousedown=\"Javascript:hideMe();\"/></div>"
            if self.purpose != "":
                html += "<b>Purpose:</b><br/>%s<br/>" % self.purpose
                
            if self.tip != "":
                html += "<b>Tip:</b><br/>%s<br/>" % self.tip
                
            html += "</div>\n"        
        
        return html


    def __getNodeOptions(self, node):
        """
        TODO We should probably get this list from elsewhere rather than
        building it up for every block
        """
        options = [("&nbsp;&nbsp;&nbsp;"*(len(node.id)-1) + str(node.title), 
                   node.id)]
        for child in node.children:
            options += self.__getNodeOptions(child)
        return options
            

    def renderPreview(self):
        """
        Returns an XHTML string for previewing this block during editing
        overriden by derieved classes
        """
        log.error("renderPreview called directly")
        return "ERROR Block.renderPreview called directly"

    
    def renderView(self):
        """
        Returns an XHTML string for viewing this block, 
        i.e. when exported as a webpage or SCORM package
        overriden by derieved classes
        """
        log.error("renderView called directly")
        return "ERROR Block.renderView called directly"


    def renderViewButtons(self):
        """
        Returns an XHTML string for the view buttons
        """
        html  = common.submitImage("edit", self.id, 
                                   "stock-edit.png", 
                                   _("Edit"), self.package.isChanged)
        return html

# ===========================================================================
