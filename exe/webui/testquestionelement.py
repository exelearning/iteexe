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
MultichoiceBlock can render and process MultichoiceIdevices as XHTML
"""

import logging
import gettext
from exe.webui.block               import Block
from exe.webui.testoptionelement   import TestoptionElement
from exe.webui                     import common

log = logging.getLogger(__name__)
_   = gettext.gettext


# ===========================================================================
class TestquestionElement(Object):
    """
    MultichoiceBlock can render and process MultichoiceIdevices as XHTML
    """
    def __init__(self, index, idevice, question):
        """
        Initialize
        """
        self.index      = index
        self.id         = str(index) + "b" + idevice.id        
        self.idevice    = idevice
        self.question   = question
        self.options    = []
        self.keyId      = "key" + self.id
        self.correctAns = 0
        i = 0
        for option in idevice.options:
            self.optionElements.append(TestoptionElement(i, question, option))
            i += 1

    def process(self, request):
        """
        Process the request arguments from the web server
        """
        Block.process(self, request)
        
        questionId = "question"+self.id
        if questionId in request.args:
            self.idevice.question = request.args[questionId][0]
            
        if self.keyId in request.args:
            self.correctAns = request.args[self.keyId][0]
            
        if ("addOption"+str(self.id)) in request.args: 
            self.idevice.addOption()
            self.idevice.edit = True

        for element in self.optionElements:
            element.process(request)


    def renderEdit(self, style):
        """
        Returns an XHTML string with the form element for editing this block
        """
        self.question = self.question.replace("\r", "")
        self.question = self.question.replace("\n","\\n")
        self.question = self.question.replace("'","\\'")
        
        html  = "<div class=\"iDevice\">\n"
        html += "<b>" + _("Question:") + " </b>"   
        html += common.richTextArea("question"+self.id, self.question)
        html += "<table width =\"100%%\">"
        html += "<th>%s " % _("Alternatives")
        html += common.elementInstruc("answer"+self.id, self.answerInstruc)
        html += "</th><th>%s"  % _("Correct")
        html += "<br/>" + _("Option")
        html += "</th>"

        for element in self.optionElements:
            html += element.renderEdit() 
            
        html += "</table>\n"
        value = _("Add another option")    
        html += common.submitButton("addOption"+str(self.id), value)
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
        html += self.question+"<br/>\n"
        for element in self.optionElements:
            html += element.renderView()
        
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
        html += self.question+"<br/>\n"
        for element in self.optionElements:
            html += element.renderView()                                                                        
        html += self.renderViewButtons()
        html += "</div>\n"

        return html
    
    def getCorrectAns(self):
        return self.correctAns
    
    def getNumOption(self):
        return len(self.options)


# ===========================================================================
