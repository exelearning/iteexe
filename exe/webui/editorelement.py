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
EditorElement is responsible for a block of field. Used by iDevice Editor
"""

import logging
from exe.webui import common
import gettext

log = logging.getLogger(__name__)
_   = gettext.gettext
# ===========================================================================
class EditorElement(object):
    """
    EditorElement is responsible for a block of field.  Used by iDevice Editor
    """
    def __init__(self, index, idevice, field):
        """
        Initialize
        """
        self.index      = index
        self.id         = str(index) + "b" + idevice.id        
        self.idevice    = idevice
        self.field      = field
        self.instruc    = field.instruction 
        self.instrucId  = "instruc" + str(index)
        self.name       = field.name
        self.nameId     = "name" + self.id
        self.contentId  = "content" + self.id

    def process(self, request):
        """
        Process arguments from the webserver.  Return any which apply to this 
        element.
        """
        log.debug("process " + repr(request.args))
        
        if self.nameId in request.args:
            self.field.name = request.args[self.nameId][0]
                 
        if self.instrucId in request.args:
            self.field.instruction = request.args[self.instrucId][0]
                        
        if "object" in request.args and request.args["object"][0] == self.id:
#            if request.args["action"][0] == "showHide":
#                if self.field.showInstruc:
#                    self.field.showInstruc = False
#                else:
#                    self.field.showInstruc = True
            if request.args["action"][0] == "deleteField":
                self.idevice.fields.remove(self.field)


    def renderView(self, content):
        """
        Returns an XHTML string for viewing or previewing this element
        """
        html  = "<p class=\""+ self.field.class_ + "\">\n"
        html += content
        html += "</p>\n"
        return html

    def renderPreview(self, dummy):
        """
        Returns an XHTML string for editing this element
        """
        log.error("renderEdit called directly")
        return "ERROR: Element.renderEdit called directly"
    
    def renderEdit(self, content):
        """
        Returns an XHTML string for editing this element
        """
        log.error("renderEdit called directly")
        return "ERROR: Element.renderEdit called directly"
    
# ===========================================================================

class TextField(EditorElement):
    """ 
    TextElement is a single line of text
    """
    def renderEdit(self, request):
        """
        Returns an XHTML string with the form element for editing this field
        """
        
        self.instruc = self.instruc.replace("\r", "")
        self.instruc = self.instruc.replace("\n","\\n")
        self.instruc = self.instruc.replace("'","\\'")
        
        html  = common.textInput(self.nameId, self.field.name, 25)
        html += "<a href=\"#\" style=\"cursor:help;\" "
        html += "onclick=\"submitLink('%s','%s',%d)\"" % ("showHide", self.id, 1)
        html += "<img src=\"/images/help.gif\" border=\"0\" "
        html += "align=\"middle\"/></a> \n"
        html += common.submitImage("deleteField", self.id, 
                                   "stock-cancel.png", 
                                   _("Delete"),1)
        html += "<br/>\n"
        html += common.textInput(self.contentId, "", 40, "Disabled")
                                 
        html += "<br/>\n"
        if self.instruc == "":
            self.instruc = "Type field instruction here."
#        if self.field.showInstruc:
        html += common.richTextArea(self.instrucId, self.instruc)
#        else:
#            html += common.richTextArea(self.instrucId, self.instruc, "0%%", 0)
        html += "<br/>"
        return html
    
    def renderPreview(self, request):
        """
        Returns an XHTML string with the form element for previewing this field
        """
        html  = "<b>" + self.field.name + "</b> "
        if self.instruc != "":
            html += common.elementInstruc(self.instrucId, self.instruc)
        html += "<br/>\n" + common.textInput(self.contentId, self.field.content)
        html += "<br/><br/>\n"
        return html
    
# ===========================================================================

class TextAreaField(EditorElement):
    """ 
    TextElement is a single line of text
    """
    def renderEdit(self, request):
        """
        Returns an XHTML string with the form element for editing this field
        """
        
        self.instruc = self.instruc.replace("\r", "")
        self.instruc = self.instruc.replace("\n","\\n")
        self.instruc = self.instruc.replace("'","\\'")
        html  = common.textInput(self.nameId, self.field.name, 25)
        html += "<a href=\"#\" style=\"cursor:help;\" "
        html += "onclick=\"submitLink('%s','%s',%d)\"" % ("showHide", self.id, 1)
        html += "<img src=\"/images/help.gif\" border=\"0\" "
        html += "align=\"middle\"/></a> \n"
        html += common.submitImage("deleteField", self.id, 
                                   "stock-cancel.png", 
                                   _("Delete"),1)
        html += "<br/>\n"
        html += common.textArea(self.contentId, "", "Disabled")
        if self.instruc == "":
            self.instruc = "Type field instruction here."
#        if self.field.showInstruc:
        html += common.richTextArea(self.instrucId, self.instruc)
#        else:
#            html += common.richTextArea(self.instrucId, self.instruc, "0%%", 0)
        html += "<br/>"
        return html
    
    def renderPreview(self, request):
        """
        Returns an XHTML string with the form element for previewing this field
        """
        html  = "<b>" + self.field.name + "</b> "
        if self.instruc != "":
            html += common.elementInstruc(self.instrucId, self.instruc)
        html += "<br/>" + common.textArea(self.contentId, self.field.content)
        html += "<br/>\n"
        return html
    
    
        
    
# ===========================================================================
