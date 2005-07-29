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
TrueFalseElement is responsible for a block of question. Used by TrueFalseBlock.
"""

import logging
from exe.webui import common
import gettext

log = logging.getLogger(__name__)
_   = gettext.gettext
# ===========================================================================
class TrueFalseElement(object):
    """
    TrueFalseElement is responsible for a block of question. 
    Used by TrueFalseBlock.
    """
    def __init__(self, index, idevice, question):
        """
        Initialize
        """
        self.index      = index
        self.id         = unicode(index) + "b" + idevice.id        
        self.idevice    = idevice
        self.question   = question
        self.questionId = "question"+ unicode(index) + "b" + idevice.id
        self.keyId      = "Key" + unicode(index) + "b" + idevice.id       
        self.feedbackId = "feedback" + unicode(index) + "b" + idevice.id 
        self.hintId     = "hint" + unicode(index) + "b" + idevice.id 
        

    def process(self, request):
        """
        Process arguments from the webserver.  Return any which apply to this 
        element.
        """
        log.debug("process " + repr(request.args))
        
        if self.questionId in request.args:
            self.question.question = request.args[self.questionId][0]
            
        if self.hintId in request.args:
            self.question.hint = request.args[self.hintId][0]
                        
        if self.keyId in request.args:
            if request.args[self.keyId][0] == "true":
                self.question.isCorrect = True 
                log.debug("question " + repr(self.question.isCorrect))
            else:
                self.question.isCorrect = False        
        
        if self.feedbackId in request.args:
            self.question.feedback = request.args[self.feedbackId][0]
            
        if "action" in request.args and request.args["action"][0] == self.id:
            self.idevice.questions.remove(self.question)


    def renderEdit(self):
        """
        Returns an XHTML string for editing this option element
        """
        question = self.question.question
        feedback = self.question.feedback
        hint     = self.question.hint
        
        question = question.replace("\r", "")
        question = question.replace("\n", "\\n")
        question = question.replace("'", "\\'")
        question = question.replace("\"", "\\\"")
        
        feedback = feedback.replace("\r", "")
        feedback = feedback.replace("\n", "\\n")
        feedback = feedback.replace("'", "\\'")
        feedback = feedback.replace('"', '\\"')
        
        hint = hint.replace("\r", "")
        hint = hint.replace("\n", "\\n")
        hint = hint.replace("'", "\\'")
        hint = hint.replace('"', '\\"')
        
        html = "<tr><td>"
        html += common.richTextArea(self.questionId, question)
        html += "</td><td>\n"
        html += common.option(self.keyId, self.question.isCorrect, "true") 
        #html += "</td><td>\n"
        html += common.option(self.keyId, not self.question.isCorrect, "false")
        html += "</td><td></td><td>\n"
        html += common.richTextArea(self.feedbackId, feedback)
        html += "</td><td>\n"
        html += common.richTextArea(self.hintId, hint)
        html += "</td><td>\n"
        html += common.submitImage(self.id, self.idevice.id, 
                                   "/images/stock-cancel.png",
                                   _("Delete option"))
        html += "</td></tr>\n"
        return html
    
    def renderQuestionView(self):
        """
        Returns an XHTML string for viewing this question element
        """
        html  = self.renderQuestion()
        html += '<span style="background-image:url(\'panel-amusements.png\');">'
        html += '\n<a onmousedown="Javascript:updateCoords(event);'
        html += 'showMe(\'i%s\', 350, 100);" ' % self.hintId
        html += 'style="cursor:help;" title="Instructions for completion" \n'
        html += 'href="javascript:void(0);">&nbsp;&nbsp;&nbsp;&nbsp;</a></span>'
        html += "<div id='i%s' style='display:none; z-index:99;'>" % self.hintId
        html += "<div style=\"float:right;\" >"
        html += '<img alt="%s" ' % _("Close")
        html += 'src="stock-stop.png" title="%s" ' % _("Close")
        html += " onmousedown=\"Javascript:hideMe();\"/></div>"
        html += "<b>%s:</b><br/>%s<br/>" % (_("Hint"), self.question.hint)
        html += "</div>\n"
        
        return html
    
    def renderQuestionPreview(self):
        #TODO merge renderQuestionView and renderQuestionPreview
        """
        Returns an XHTML string for previewing this question element
        """
        html  = self.renderQuestion()
        html += " &nbsp;&nbsp;\n"
        html += common.elementInstruc(self.hintId, self.question.hint, 
                                      "panel-amusements.png", "Hint")
        return html

    def renderQuestion(self):
        """
        Returns an XHTML string for viewing and previewing this question element
        """
        log.debug("renderPreview called")
    
        html  = "<br/><br/><b>" +unicode(self.index + 1) + ". " 
        html += self.question.question + "</b><br/><br/>"
        html += _("True") + " " 
        html += self.__option(0, 2, "true") + "\n"
        html += _("False") + " " 
        html += self.__option(1, 2, "false") + "\n"
       
        return html
    
    def __option(self, index, length, true):
        """Add a option input"""
        html  = '<input type="radio" name="option%s" ' % self.id
        html += 'id="%s%s" ' % (true, self.id)
        html += 'onclick="getFeedback(%d,%d,\'%s\')"/>' % (index, 
                                                length, self.id)
        return html
    
    def renderFeedbackView(self):
        """
        return xhtml string for display this option's feedback
        """

        if self.question.isCorrect:
            feedbackStr1 = _("Correct!") + " " + self.question.feedback
            feedbackStr2 = _("Incorrect!") + " " + self.question.feedback
        else:
            feedbackStr1 = _("Incorrect! ") + " " + self.question.feedback
            feedbackStr2 = _("Correct! ") + " " + self.question.feedback
            
        feedbackId1 = "0" + "b" + self.id
        feedbackId2 = "1" + "b" + self.id
        html  = '<div id="s%s" style="color: rgb(0, 51, 204);' % feedbackId1
        html += 'display: none;">' 
        html += feedbackStr1 + '</div>\n'
        html += '<div id="s%s" style="color: rgb(0, 51, 204);' % feedbackId2
        html += 'display: none;">' 
        html += feedbackStr2 + '</div>\n'
        
        return html
        
    
# ===========================================================================
