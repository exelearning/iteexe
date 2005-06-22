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
OptionElement is responsible for a block of option.  Used by MultichoiceBlock
"""

import logging
from exe.webui import common
import gettext

log = logging.getLogger(__name__)
_   = gettext.gettext
# ===========================================================================
class OptionElement(object):
    """
    OptionElement is responsible for a block of option.  Used by
    MultichoiceBlock 
    """
    def __init__(self, index, idevice, option):
        """
        Initialize
        """
        self.index      = index
        self.id         = unicode(index) + "b" + idevice.id        
        self.idevice    = idevice
        self.option     = option
        self.answerId   = "optionAnswer"+ unicode(index) + "b" + idevice.id
        self.keyId      = "optionKey" + idevice.id        
        self.feedbackId = "optionFeedback" + unicode(index) + "b" + idevice.id
        

    def process(self, request):
        """
        Process arguments from the webserver.  Return any which apply to this 
        element.
        """
        log.debug("process " + repr(request.args))
        
        if self.answerId in request.args:
            self.option.answer = request.args[self.answerId][0]
                        
        if self.keyId in request.args:
            if request.args[self.keyId][0] == self.id:
                self.option.isCorrect = True 
                log.debug("option " + repr(self.option.isCorrect))
            else:
                self.option.isCorrect = False
        
        if self.feedbackId in request.args:
            self.option.feedback = request.args[self.feedbackId][0]
            
        if "action" in request.args and request.args["action"][0] == self.id:
            self.idevice.options.remove(self.option)


    def renderEdit(self):
        """
        Returns an XHTML string for editing this option element
        """
        answer   = self.option.answer
        feedback = self.option.feedback
        
        answer = answer.replace("\r", "")
        answer = answer.replace("\n", "\\n")
        answer = answer.replace("'", "\\'")
        answer = answer.replace("\"", "\\\"")
        
        feedback = feedback.replace("\r", "")
        feedback = feedback.replace("\n", "\\n")
        feedback = feedback.replace("'", "\\'")
        feedback = feedback.replace('"', '\\"')
        html = "<tr><td>"
        html += common.richTextArea(self.answerId, answer)
        html += "</td><td align = \"center\">\n"
        html += common.option(self.keyId, self.option.isCorrect, self.id)        
        html += "</td><td>\n"
        html += common.richTextArea(self.feedbackId, feedback)
        html += "</td><td>\n"
        html += common.submitImage(self.id, self.idevice.id, 
                                   "/images/stock-cancel.png",
                                   _("Delete option"))
        html += "</td></tr>\n"
        html += "</p>\n"
        return html


    def renderAnswerView(self):
        """
        Returns an XHTML string for viewing and previewing this option element
        """
        log.debug("renderView called")
        self.option.answer = self.option.answer.replace("\r", "")
        self.option.answer = self.option.answer.replace("\n", "\\n")
  
        length = len(self.idevice.options)
        html  = '<tr><td>'
        html += '<input type = "radio" name = "option%s" ' % self.idevice.id
        html += 'id = "%s"' % self.id
        html += 'onclick = "getFeedback(%d,%d,\'%s\')"/>' % (self.index, 
                                                length, self.idevice.id)
        html += '</td><td>\n'
        html += self.option.answer + "</td></tr>\n"
       
        return html
    

    def renderFeedbackView(self):
        """
        return xhtml string for display this option's feedback
        """
        self.option.feedback = self.option.feedback.replace("\r", "")
        self.option.feedback = self.option.feedback.replace("\n", "\\n")
        feedbackStr = ""
        if self.option.feedback != "":
            feedbackStr = self.option.feedback
        else:
            if self.option.isCorrect:
                feedbackStr = _("Correct")
            else:
                feedbackStr = _("Incorrect")
        html  = '<div id="s%s" style="color: rgb(0, 51, 204);' % self.id
        html += 'display: none;">' 
        html += feedbackStr + '</div>\n'
        
        return html
        
    
# ===========================================================================
