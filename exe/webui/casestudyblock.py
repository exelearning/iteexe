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
CasestudyBlock can render and process CasestudyIdevices as XHTML
"""

import logging
import gettext
from exe.webui.block               import Block
from exe.engine.casestudyidevice   import CasestudyIdevice
from exe.webui.questionelement     import QuestionElement
from exe.webui                     import common

log = logging.getLogger(__name__)
_   = gettext.gettext


# ===========================================================================
class CasestudyBlock(Block):
    """
    CasestudyBlock can render and process CasestudyIdevices as XHTML
    """
    def __init__(self, idevice):
        """
        Initialize a new Block object
        """
        Block.__init__(self, idevice)
        self.idevice         = idevice
        self.questionElements  = []
        self.story           = idevice.story
        self.questionInstruc = idevice.questionInstruc
        self.storyInstruc    = idevice.storyInstruc
        self.feedbackInstruc = idevice.feedbackInstruc
        i = 0
        
        for question in idevice.questions:
            self.questionElements.append(QuestionElement(i, idevice, question))
            i += 1

    def process(self, request):
        """
        Process the request arguments from the web server
        """
        Block.process(self, request)
        storyId = "story" + str(self.id)
        if storyId in request.args:
            self.idevice.story = request.args[storyId][0]
            
        if ("addQuestion"+str(self.id)) in request.args: 
            self.idevice.addQuestion()

        for element in self.questionElements:
            element.process(request)


    def renderEdit(self, style):
        """
        Returns an XHTML string with the form element for editing this block
        """
        self.story = self.story.replace("\r", "")
        self.story = self.story.replace("\n","\\n")
        self.story = self.story.replace("'","\\'")
        html  = "<div class=\"iDevice\">\n"
        html += "<b>" + _("Story:") + " </b>" 
        html += common.elementInstruc("story"+self.id, self.storyInstruc)
        html += common.richTextArea("story"+self.id, self.story)
        html += "<table width =\"100%%\">\n"
        
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
        Returns an XHTML string for viewing this block (exporting)
        """
        html  = "<div class=\"iDevice\">\n"
        html += "<img class=\"iDevice_icon\" "
        html += "src=\"casestudy.gif\" />\n"
        html += "<span class=\"iDeviceTitle\">"       
        html += self.idevice.title+"</span>\n"
        html += "<div class=\"iDevice_inner\">\n"
        html += self.renderBlockView()    
        html += "</div>\n" 
        html += "</div>\n"
        return html
    

    def renderPreview(self, style):
        """
        Returns an XHTML string for previewing this block
        """
        html  = "<div class=\"iDevice\" "
        html += "ondblclick=\"submitLink('edit',"+self.id+", 0);\">\n"
        html += "<img class=\"iDevice_icon\" "
        html += "src=\"/style/"+style+"/casestudy.gif\" />\n"
        html += "<span class=\"iDeviceTitle\">"       
        html += self.idevice.title+"</span>\n"
        html += "<div class=\"iDevice_inner\">\n"
        html += self.renderBlockView()      
        html += "</div>\n" 
        html += self.renderViewButtons()
        html += "</div>\n"
        return html


    def renderBlockView(self):
        """
        Returns an XHTML string for this block
        """
        html  = self.story+"<br/><br/>\n"
            
        for element in self.questionElements:
            html += element.renderView()
            
        return html

# ===========================================================================
