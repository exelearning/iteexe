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
from exe.webui.block          import Block
from exe.webui.blockfactory   import g_blockFactory

log = logging.getLogger(__name__)
_   = gettext.gettext


# ===========================================================================
class TitleBlock(Block):
    """
    TitleBlock is for rendering node titles
    """
    def __init__(self, node):
        Block.__init__(self, node.parent, "i"+node.getIdStr())
        self.node = node

#    def process(self, request):
#        log.debug("process "+self.id+repr(request))
#        Block.process(self, request)
    def processDone(self, request):
        self.node.title = request.args["nodeTitle"+self.id][0]
        log.info("Changed "+self.id+" title to "+self.node.title)

    def processMovePrev(self, request):
        log.debug("processMovePrev "+self.id)
        self.node.movePrev()

    def processMoveNext(self, request):
        log.debug("processMoveNext "+self.id)
        self.node.moveNext()

    def processPromote(self, request):
        log.debug("processPromote "+self.id)
        self.node.promote()

    def processDemote(self, request):
        log.debug("processDemote "+self.id)
        self.node.demote()

        

    def renderEdit(self):
        """
        Returns an XHTML string with the form element for editing this title
        """
        html  = "<div>\n"
        html += common.textInput("nodeTitle"+self.id, self.node.title)

        childLevel = self.node.package.levelName(len(self.node.id) - 1)

        if len(self.node.id) > 2:
            html += common.submitImage("promote", self.id,
                                       "stock-goto-top.png", _("Promote"))
#        else:
#            html += common.image("stock-goto-top-off.png")

        if len(self.node.id) > 1 and self.node.id[-1] > 0:
            html += common.submitImage("demote", self.id,
                                       "stock-goto-bottom.png", _("Demote"))
#        else:
#            html += common.image("stock-goto-bottom-off.png")

        if self.node.id[-1] > 0:
            html += common.submitImage("movePrev", self.id,
                                       "stock-go-up.png", _("Move Up"))
#        else:
#            html += common.image("stock-go-up-off.png")

        if (len(self.node.id) > 1 and 
            self.node.id[-1] < len(self.node.parent.children) - 1):
            html += common.submitImage("moveNext", self.id,
                                       "stock-go-down.png", _("Move Down"))
#        else:
#            html += common.image("stock-go-down-off.png")
        
        html += common.submitLink("done", self.id, _("Done")) + " "
        html += common.submitImage("PreviewAll", self.id,
                                       "stock-apply.png", _("Preview"))
        html += common.submitImage("EditAll", self.id,
                                       "stock-edit.png", _("Edit view"))
        html += "</div>\n"
        return html


    def renderView(self):
        """
        Returns an XHTML string for viewing this title
        """
        html  = "<div>\n"
        html += "<h1 class=\"nodeTitle\">" + self.node.getTitle() + "</h1>"
        html += "</div>\n"
        return html
    
    def renderPreview(self):
        """
        Returns an XHTML string for previewing this title
        """
        html  = "<div>\n"
        html += "<h1 class=\"nodeTitle\">" + self.node.getTitle() + "</h1>"
        html += common.submitButton("edit"+self.id, _("Edit"))
        html += "</div>\n"
        return html

# ===========================================================================
