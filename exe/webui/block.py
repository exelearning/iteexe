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
        self.idevice = idevice
        self.id      = idevice.id

        if idevice.edit:
            self.mode = Block.Edit
        else:
            self.mode = Block.Preview


    def process(self, request):
        log.debug("process id="+self.id)
        
        if "action" in request.args:
            if request.args["action"][0] == "PreviewAll":
                self.processDone(request)

            elif request.args["action"][0] == "EditAll":
                self.processEdit(request)
            
        if "object" in request.args and request.args["object"][0] == self.id:
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
        log.debug("processDone id="+self.id)
        self.idevice.edit = False


    def processEdit(self, request):
        log.debug("processEdit id="+self.id)
        self.idevice.edit = True


    def processDelete(self, request):
        log.debug("processDelete id="+self.id)
        self.idevice.delete()


    def processMove(self, request):
        log.debug("processMove id="+self.id)


    def processPromote(self, request):
        log.debug("processPromote id="+self.id)


    def processDemote(self, request):
        log.debug("processDemote id="+self.id)


    def processMovePrev(self, request):
        log.debug("processMovePrev id="+self.id)


    def processMoveNext(self, request):
        log.debug("processMoveNext id="+self.id)


    def render(self):
        if self.mode == Block.Edit:
            return self.renderEdit()

        elif self.mode == Block.View:
            return self.renderView()
        
        elif self.mode == Block.Preview:
            return self.renderPreview()

        else:
            return ""


    def renderEdit(self):
        """
        Returns an XHTML string with the form element for editing this block
        """
        log.error("renderEdit called directly")
        return "ERROR Block.renderEdit called directly"


    def renderEditButtons(self):
        html  = common.submitImage("done",     self.id, "stock-apply.png")
        html += common.submitImage("delete",   self.id, "stock-cancel.png")
        html += common.submitImage("movePrev", self.id, "stock-go-up.png")
        html += common.submitImage("moveNext", self.id, "stock-go-down.png")
        options  = [(_("---Move To---"),""),]

        #TODO breaking 4 levels of encapsulation is TOO MUCH!!!
        options += self.__getNodeOptions(self.idevice.parentNode.package.draft)
        options += self.__getNodeOptions(self.idevice.parentNode.package.root)
        html += common.select("move", self.id, options)
        return html


    # TODO We should probably get this list from elsewhere rather than
    # building it up for every block
    def __getNodeOptions(self, node):
        options = [("&nbsp;&nbsp;&nbsp;"*(len(node.id)-1) + str(node.title), 
                   node.getIdStr(),)]
        for child in node.children:
            options += self.__getNodeOptions(child)
        return options
            

    def renderPreview(self):
        """
        Returns an XHTML string for viewing this block
        """
        log.error("renderPreview called directly")
        return "ERROR Block.renderPreview called directly"

    
    def renderView(self):
        """
        Returns an XHTML string for viewing this block
        """
        log.error("renderView called directly")
        return "ERROR Block.renderView called directly"


    def renderViewButtons(self):
        html  = common.submitImage("edit", self.id, "stock-edit.png")
        return html

# ===========================================================================
