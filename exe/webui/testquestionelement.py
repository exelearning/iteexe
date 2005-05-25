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
class TestquestionElement(object):
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
        i = 0
        for option in question.options:
            self.options.append(TestoptionElement(i, question, self.id, 
                                                  option, idevice))
            i += 1

    def process(self, request):
        """
        Process the request arguments from the web server
        """
        log.info("process " + repr(request.args))
        questionId = "question"+self.id
        if questionId in request.args:
            self.question.question = request.args[questionId][0]
            
        if ("addOption"+str(self.id)) in request.args: 
            self.question.addOption()
            self.idevice.edit = True
            
        if "action" in request.args and request.args["action"][0] == self.id:
            self.idevice.questions.remove(self.question)

        self.question.userAns = -1
        for element in self.options:
            element.process(request)


    def renderEdit(self):
        """
        Returns an XHTML string with the form element for editing this block
        """
        question = self.question.question
        question = question.replace("\r", "")
        question = question.replace("\n","\\n")
        question = question.replace("'","\\'")
        
        html  = "<div class=\"iDevice\">\n"
        html += "<b>" + _("Question:") + " </b>"   
        html += common.submitImage(self.id, self.idevice.id, 
                                   "stock-cancel.png",
                                   _("Delete Question"))
        html += common.richTextArea("question"+self.id, question)
        html += "<table width =\"100%%\">"
        html += "<th>%s " % _("Alternatives")
        html += "</th><th>%s"  % _("Correct")
        html += "<br/>" + _("Option")
        html += "</th>"

        for element in self.options:
            html += element.renderEdit() 
            
        html += "</table>\n"
        value = _("Add another option")    
        html += common.submitButton("addOption"+str(self.id), value)
        html += "<br />"
        html += "</div>\n"

        return html

    
    def renderView(self):
        """
        Returns an XHTML string for viewing this block
        """
  
        html  = "<b>" + self.question.question +"</b><br/>\n"
        html += "<table>"
        for element in self.options:
            html += element.renderView()      
        html += "</table>"   
        

        return html
    

    def renderPreview(self):
        """
        Returns an XHTML string for previewing this block
        """
       
        html  = "<b>" + self.question.question +"</b><br/>\n"
        html += "<table>"
        for element in self.options:
            html += element.renderView()      
        html += "</table>"                                                                    


        return html
    
    def getCorrectAns(self):
        return self.correctAns
    
    def getNumOption(self):
        return len(self.options)


# ===========================================================================
