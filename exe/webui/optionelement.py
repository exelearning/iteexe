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
class OptionElement(object):
    """
    OptionElment is responsible for a block of text.  Used by GenericBlock
    """
    def __init__(self, id, idevice, option):
        """
        Initialize
        """
        self.id         = id
        self.idevice    = idevice
        self.option     = option
        self.answer     = option.answer
        self.isCorrect  = option.isCorrect
        self.feedback   = option.feedback
        self.answerId   = "optionAnswer"+ str(id) + idevice.id
        self.keyId      = "optionKey" + idevice.id        
        self.value      = str(id) + "b" + idevice.id
        self.feedbackId = "optionFeedback" + str(id) + idevice.id
        self.optionId   = "option" + idevice.id
        
        


    def process(self, request):
        """
        Process arguments from the webserver.  Return any which apply to this 
        element.
        """
        log.debug("process " + repr(request.args))
        
        if self.answerId in request.args:
            self.option.answer = request.args[self.answerId][0]
                        
        if self.keyId in request.args:
            if request.args[self.keyId][0] == self.value:
                self.option.isCorrect = True 
                log.debug("option " + repr(self.option.isCorrect))
            else:
                self.option.isCorrect = False
        
        if self.feedbackId in request.args:
            self.option.feedback = request.args[self.feedbackId][0]
            
        if "object" in request.args and request.args["object"][0] == str(self.id):
            if request.args["action"][0] == "deleteOption":
                self.idevice.options.remove(self.option)


    def renderEdit(self):
        """
        Returns an XHTML string for editing this option element
        """
        self.answer = self.answer.replace("\r", "")
        self.answer = self.answer.replace("\n", "\\n")
        self.answer = self.answer.replace("'", "\\'")
        self.answer = self.answer.replace("\"", "\\\"")
        
        self.feedback = self.feedback.replace("\r", "")
        self.feedback = self.feedback.replace("\n", "\\n")
        self.feedback = self.feedback.replace("'", "\\'")
        self.feedback = self.feedback.replace('"', '\\"')
        html = "<tr><td>"
        html += common.option(self.keyId, self.isCorrect, self.value)#+ "<br/>"
        html += "</td><td>"
        html += common.richTextArea(self.answerId, self.answer)
        html += "</td><td>"
        html += common.richTextArea(self.feedbackId, self.feedback)
        html += "</td><td>"
        html += common.submitImage("deleteOption",   str(self.id), "stock-cancel.png")
        html += "</td></tr>\n"
        html += "</p>\n"
        return html


    def renderAnswerView(self):
        """
        Returns an XHTML string for viewing and previewing this option element
        """
        log.debug("renderView called")
        self.answer = self.answer.replace("\r", "")
        self.answer = self.answer.replace("\n", "\\n")
      #  self.answer = self.answer.replace("'", "\\'")
      #  self.answer = self.answer.replace("\"", "\\\"")
        
        
#        self.feedback = self.feedback.replace('"', '\\"')
        
        length = len(self.idevice.options)
        html  = '<tr><td>'
        html += '<input type = "radio" name = "%s" ' % self.optionId
        html += 'id = "%s"' % self.value
        html += 'onclick = "getFeedback(%d,%d,\'%s\')"/>' % (self.id, 
                                               length,self.idevice.id)
        html += '</td><td>'
        html += self.answer + "</td></tr>\n"
       
        return html
    
    def renderFeedbackView(self):
        self.feedback = self.feedback.replace("\r", "")
        self.feedback = self.feedback.replace("\n", "\\n")
    #    self.feedback = self.feedback.replace("'", "\\'")
        feedbackStr = ""
        if self.feedback != "":
            feedbackStr = self.feedback
        else:
            if self.isCorrect:
                feedbackStr = _("Congratulations, your answer is correct!")
            else:
                feedbackStr = _("Sorry, wrong answer.")
        html  = '<div id="s%s" style="color: rgb(0, 51, 204);' % self.value
        html += 'display: none;">' 
        html += feedbackStr + '</div>\n'
        
        return html
        
    
# ===========================================================================
