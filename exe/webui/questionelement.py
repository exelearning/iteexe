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

import logging
from exe.webui import common
import gettext

log = logging.getLogger(__name__)
_   = gettext.gettext
# ===========================================================================
class QuestionElement(object):
    """
    QuestionElment is responsible for a block of text.  Used by ReflectionBlock
    """
    def __init__(self, index, idevice, question):
        """
        Initialize
        """
        self.index      = index
        self.id         = str(index) + "b" + idevice.id        
        self.idevice    = idevice
        self.question   = question
        self.questionId = "question" + str(index) + "b" + idevice.id          
        self.answerId   = "questionAnswer"+ str(index) + "b" + idevice.id
  
    
    def process(self, request):
        """
        Process arguments from the webserver.  Return any which apply to this 
        element.
        """
        log.debug("process " + repr(request.args))
        
        if self.questionId in request.args:
            self.question.question = request.args[self.questionId][0]
            
        if self.answerId in request.args:
            self.question.answer = request.args[self.answerId][0]
            
        if "object" in request.args and request.args["object"][0] == self.id:
            if request.args["action"][0] == "deleteQuestion":
                self.idevice.questions.remove(self.question)


    def renderEdit(self):
        """
        Returns an XHTML string for editing this option element
        """
        #answer   = self.option.answer
        #feedback = self.option.feedback
        
        #answer = answer.replace("\r", "")
        #answer = answer.replace("\n", "\\n")
        #answer = answer.replace("'", "\\'")
        #answer = answer.replace("\"", "\\\"")
        
        #feedback = feedback.replace("\r", "")
        #feedback = feedback.replace("\n", "\\n")
        #feedback = feedback.replace("'", "\\'")
        #feedback = feedback.replace('"', '\\"')
        html  = "<tr><td>"
        html += str(self.index + 1)
        html += "</td><td>"
        html += common.textArea(self.questionId, self.question.question)
        html += "</td><td>"
        html += common.textArea(self.answerId, self.question.answer)
        html += "</td><td>"
        html += common.submitImage("deleteQuestion", self.id, "stock-cancel.png")
        html += "</td></tr>\n"
        html += "</p>\n"
        return html


    def renderQuestionView(self):
        """
        Returns an XHTML string for viewing and previewing this option element
        """
        log.debug("renderView called")
       # self.option.answer = self.option.answer.replace("\r", "")
       # self.option.answer = self.option.answer.replace("\n", "\\n")
        html  = "<tr><td>"
        html += str(self.index +1)
        html += "</td><td>"
        html += self.question.question
        
        html += "</td></tr>\n"
       
        return html
    
    def renderAnswerView(self):
        """
        return xhtml string for display this option's feedback
        """
        #self.option.feedback = self.option.feedback.replace("\r", "")
        #self.option.feedback = self.option.feedback.replace("\n", "\\n")
        #feedbackStr = ""
    
        html  = "<tr><td>"
        html += str(self.index + 1)
        html += "</td><td>"
        html += self.question.answer
        html += "</td></tr>\n"
        
        return html
        
    
# ===========================================================================
