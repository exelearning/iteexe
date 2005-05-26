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
from exe.engine.multichoiceidevice import MultichoiceIdevice
from exe.webui.optionelement       import OptionElement
from exe.webui                     import common

log = logging.getLogger(__name__)
_   = gettext.gettext


# ===========================================================================
class MultichoiceBlock(Block):
    """
    MultichoiceBlock can render and process MultichoiceIdevices as XHTML
    """
    def __init__(self, idevice):
        """
        Initialize a new Block object
        """
        Block.__init__(self, idevice)
        self.idevice         = idevice
        self.optionElements  = []
        self.question        = idevice.question
        self.questionInstruc = idevice.questionInstruc
        self.keyInstruc      = idevice.keyInstruc
        self.answerInstruc   = idevice.answerInstruc
        self.feedbackInstruc = idevice.feedbackInstruc
        self.hint            = idevice.hint
        self.hintId          = "hint" + idevice.id
        self.hintInstruc     = idevice.hintInstruc
        
        i = 0
        for option in idevice.options:
            self.optionElements.append(OptionElement(i, idevice, option))
            i += 1

    def process(self, request):
        """
        Process the request arguments from the web server
        """
        Block.process(self, request)
        
        questionId = "question"+str(self.id)
        if questionId in request.args:
            self.idevice.question = request.args[questionId][0]
            
        if self.hintId in request.args:
            self.idevice.hint = request.args[self.hintId][0]
            
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
        html += common.elementInstruc("question"+self.id, self.questionInstruc)
        html += common.richTextArea("question"+self.id, self.question)
        html += "<b>" + _("Hint:") + " </b>"   
        html += common.elementInstruc("hint"+self.id, self.hintInstruc)
        html += common.richTextArea("hint"+self.id, self.hint)
        html += "<table width =\"100%%\">"
        html += "<th>%s " % _("Alternatives")
        html += common.elementInstruc("answer"+self.id, self.answerInstruc)
        html += "</th><th>%s"  % _("Correct")
        html += "<br/>" + _("Option")
        html += common.elementInstruc("key"+self.id, self.keyInstruc)
        html += "</th><th>%s " % _("Feedback")
        html += common.elementInstruc("feed"+self.id, self.feedbackInstruc)
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
        html += self.question+" &nbsp;&nbsp;\n"
        
        html += '<span style="background-image:url(\'panel-amusements.png\');">'
        html += '\n<a onmousedown="Javascript:updateCoords(event);'
        html += 'showMe(\'i%s\', 350, 100);" ' % self.hintId
        html += 'border="0" align="middle" \n'
        html += 'style="cursor:help;" title="Instructions for completion" \n'
        html += 'href="javascript:void(0);">&nbsp;&nbsp;&nbsp;&nbsp;</a></span>'
        html += "<div id='i%s' style='display:none; z-index:99;'>" % self.hintId 
        html += "<div style=\"float:right;\" >"
        html += '<img src="stock-stop.png" title="'+_("Close")+'" ' 
        html += " onmousedown=\"Javascript:hideMe();\"/></div>"
        html += "<b>%s:</b><br/>%s<br/>" % (_("Hint"), self.hint)                
        html += "</div>\n"
        
        html += self.renderViewContent()    
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
        html += self.question+" &nbsp;&nbsp;\n"
        html += common.elementInstruc(self.hintId, self.hint, 
                                      "panel-amusements.png", "Hint")
                                                                             
        html += self.renderViewContent()      
        html += self.renderViewButtons()
        html += "</div>\n"

        return html


    def renderViewContent(self):
        """
        Returns an XHTML string for this block
        """
        html  = "<div class=\"iDevice_inner\">\n"
        html += "<script type=\"text/javascript\">\n"
        html += "<!--\n"
        html += """
        function getFeedback(optionId, optionsNum, ideviceId) {
            for (i = 0; i< optionsNum; i++) {   
                id = "s" + i + "b" +ideviceId
                if(i == optionId)
                    document.getElementById(id).style.display = "block";
                else
                    document.getElementById(id).style.display = "None";
            }
        }\n"""  
      
        html += "//-->\n"
        html += "</script>\n"
        html += "<table>"
        for element in self.optionElements:
            html += element.renderAnswerView()
            
        html += "</table>"
            
        for element in self.optionElements:
            html += element.renderFeedbackView()
        html += "</div>\n"    

        return html

# ===========================================================================
