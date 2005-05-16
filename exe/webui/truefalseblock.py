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
TrueFalseBlock can render and process TrueFalseIdevices as XHTML
"""

import logging
import gettext
from exe.webui.block               import Block
from exe.webui.truefalseelement    import TrueFalseElement
from exe.webui                     import common

log = logging.getLogger(__name__)
_   = gettext.gettext


# ===========================================================================
class TrueFalseBlock(Block):
    """
    TrueFalseBlock can render and process TrueFalseIdevices as XHTML
    """
    def __init__(self, idevice):
        """
        Initialize a new Block object
        """
        Block.__init__(self, idevice)
        self.idevice         = idevice
        self.questionElements  = []
        self.questionInstruc = idevice.questionInstruc
        self.keyInstruc      = idevice.keyInstruc
        self.feedbackInstruc = idevice.feedbackInstruc
        self.hintInstruc     = idevice.hintInstruc        
        
        i = 0
        for question in idevice.questions:
            self.questionElements.append(TrueFalseElement(i, idevice, question))
            i += 1

    def process(self, request):
        """
        Process the request arguments from the web server
        """
        Block.process(self, request)
    
            
        if ("addQuestion"+str(self.id)) in request.args: 
            self.idevice.addQuestion()
            self.idevice.edit = True

        for element in self.questionElements:
            element.process(request)


    def renderEdit(self, style):
        """
        Returns an XHTML string with the form element for editing this block
        """
        
        html  = "<div class=\"iDevice\">\n"
        html += "<table width =\"100%%\">"
        html += "<th>%s " % _("Questions")
        html += common.elementInstruc("question"+self.id, self.questionInstruc)
        html += "</th><th>&nbsp;%s&nbsp;&nbsp;/&nbsp;&nbsp;%s&nbsp;" % (_("T"),_("F"))
        html += "</th><th>"
        html += common.elementInstruc("key"+self.id, self.keyInstruc)
        html += "</th><th>%s " % _("Feedback")
        html += common.elementInstruc("feed"+self.id, self.feedbackInstruc)
        html += "</th><th>%s " % _("Hint")
        html += common.elementInstruc("hint"+self.id, self.hintInstruc)
        html += "</th>"

        for element in self.questionElements:
            html += element.renderEdit() 
            
        html += "</table>\n"
        value = _("Add another question")    
        html += common.submitButton("addQuestion"+str(self.id), value)
        html += "<br /><br />" + self.renderEditButtons()
        html += "</div>\n"

        return html

    
    def renderView(self, style):
        """
        Returns an XHTML string for viewing this block
        """
        html  = '<script language="JavaScript" src="common.js"></script>\n'
        html += '<script language="JavaScript" src="libot_drag.js"></script>\n'
        html += "<div class=\"iDevice\">\n"
        html += "<img class=\"iDevice_icon\" "
        html += "src=\"multichoice.gif\" />\n"
        html += "<span class=\"iDeviceTitle\">"       
        html += self.idevice.title+"</span><br/>\n"
        html += self.renderBlockView("view")    
        html += "</div>\n"

        return html
    

    def renderPreview(self, style):
        """
        Returns an XHTML string for previewing this block
        """
        html  = "<div class=\"iDevice\" "
        html += "ondblclick=\"submitLink('edit',"+self.id+", 0);\">\n"
        html += "<img class=\"iDevice_icon\" "
        html += "src=\"/style/"+style+"/multichoice.gif\" />\n"
        html += "<span class=\"iDeviceTitle\">"       
        html += self.idevice.title+"</span><br/>\n"     
        html += self.renderBlockView("preview")      
        html += self.renderViewButtons()
        html += "</div>\n"

        return html


    def renderBlockView(self, view):
        """
        Returns an XHTML string for this block
        """
        html  = "<div class=\"iDevice_inner\">\n"
        
        for element in self.questionElements:
            if (view == "view"):
                html += element.renderQuestionView()
            else:
                html += element.renderQuestionPreview()
            html += element.renderFeedbackView()
            
        html += "</div>\n"    

        return html

# ===========================================================================
