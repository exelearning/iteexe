# ===========================================================================
# eXe 
# Copyright 2004-2006, University of Auckland
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
TestQuestionElement is responsible for a block of question.  
Used by QuizTestBlock
"""

import logging
from exe.webui.testoptionelement   import TestoptionElement
from exe.webui                     import common
from exe.webui.element   import TextAreaElement

log = logging.getLogger(__name__)


# ===========================================================================
class TestquestionElement(object):
    """
    TestQuestionElement is responsible for a block of question.  
    Used by QuizTestBlock
    """
    def __init__(self, index, idevice, question):
        """
        Initialize
        """
        self.index      = index
        self.id         = unicode(index) + "b" + idevice.id        
        self.idevice    = idevice

        # to compensate for the strange unpickling timing when objects are 
        # loaded from an elp, ensure that proper idevices are set:
        if question.questionTextArea.idevice is None: 
            question.questionTextArea.idevice = idevice
        self.questionElement = TextAreaElement(question.questionTextArea)
        self.question   = question

        self.questionId = "question"+self.id
        self.questionElement.id = self.questionId

        self.options    = []
        self.keyId      = "key" + self.id
        i = 0
        for option in question.options:
            self.options.append(TestoptionElement(i,
                                                  question, 
                                                  self.id, 
                                                  option,
                                                  idevice))
            i += 1

    def process(self, request):
        """
        Process the request arguments from the web server
        """
        log.info("process " + repr(request.args))
        if self.questionId in request.args: 
            self.questionElement.process(request)
            
        if ("addOption"+unicode(self.id)) in request.args: 
            self.question.addOption()
            self.idevice.edit = True
            
        if "action" in request.args and request.args["action"][0] == self.id:
            self.idevice.questions.remove(self.question)

        for element in self.options:
            element.process(request)


    def renderEdit(self):
        """
        Returns an XHTML string with the form element for editing this element
        """
        html  = u"<div class=\"iDevice\">\n"
        html += self.questionElement.renderEdit()

        html += u"<table width =\"100%%\">"
        html += u"<thead>"
        html += u"<tr>"
        html += u"<th>%s " % _("Options")
        html += common.elementInstruc(self.question.optionInstruc)
        html += u"</th><th align=\"left\">%s "  % _("Correct")
        html += common.elementInstruc(self.question.correctAnswerInstruc)
        html += u"<br/>" + _("Option")
        html += u"</th>"
        html += u"</tr>"
        html += u"</thead>"
        html += u"<tbody>"

        for element in self.options:
            html += element.renderEdit() 
            
        html += u"</tbody>"
        html += u"</table>\n"
        value = _(u"Add another Option")    
        html += common.submitButton("addOption"+unicode(self.id), value)
        html += u"<br />"
        html += u"</div>\n"

        return html

    
    def renderPreview(self):
        """
        Returns an XHTML string for previewing this element
        """
        return self.renderView(preview=True)

    def renderView(self, preview=False):
        """
        Returns an XHTML string for viewing this element
        """
        html  = "<b>"
        if preview: 
            html += self.questionElement.renderPreview()
        else:
            html += self.questionElement.renderView()
        html += "</b><br/>\n"

        html += "<table>"
        for element in self.options:
            if preview: 
                html += element.renderPreview()      
            else:
                html += element.renderView()      
        html += "</table>"   
        
        return html
    
    
    def getCorrectAns(self):
        """
        return the correct answer for the question
        """
        return self.question.correctAns

    
    def getNumOption(self):
        """
        return the number of options
        """
        return len(self.question.options)


# ===========================================================================
