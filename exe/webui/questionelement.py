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
QuestionElement is responsible for a block of option.  Used by MultichoiceBlock
"""

import logging
from exe.webui import common
import gettext

log = logging.getLogger(__name__)
_   = gettext.gettext
# ===========================================================================
class QuestionElement(object):
    """
    QuestionElment is responsible for a block of question. 
    Used by CasestudyBlock.
    """
    def __init__(self, index, idevice, question):
        """
        Initialize
        'index' is our number in the list of questions
        'idevice' is a case study idevice
        'question' is a exe.engine.casestudyidevice.Question instance
        """
        self.index      = index
        self.id         = "q" + unicode(index) + "b" + idevice.id        
        self.idevice    = idevice
        self.question   = question
        self.quesId     = "quesQuestion" + unicode(index) + "b" + idevice.id
        self.feedbackId = "quesFeedback" + unicode(index) + "b" + idevice.id
        

    def process(self, request):
        """
        Process arguments from the webserver.  Return any which apply to this
        element.
        """
        log.debug("process " + repr(request.args))
        
        if self.quesId in request.args:
            self.question.question = request.args[self.quesId][0]
                        
        if self.feedbackId in request.args:
            self.question.feedback = request.args[self.feedbackId][0]
            
        if "action" in request.args and request.args["action"][0] == self.id:
            self.idevice.questions.remove(self.question)



    def renderEdit(self):
        """
        Returns an XHTML string for editing this question element
        """
        question = self.question.question
        feedback = self.question.feedback
        
        question = question.replace("\r", "")
        question = question.replace("\n", "\\n")
        question = question.replace("'", "\\'")
        question = question.replace("\"", "\\\"")
        
        feedback = feedback.replace("\r", "")
        feedback = feedback.replace("\n", "\\n")
        feedback = feedback.replace("'", "\\'")
        feedback = feedback.replace('"', '\\"')
        html  = "<tr><td><b>%s</b>\n" % _("Question")
        html += common.elementInstruc(self.quesId, self.idevice.questionInstruc)
        html += common.richTextArea(self.quesId, question)
        html += "<b>%s</b>\n" % _("Feedback")
        html += common.elementInstruc(self.feedbackId, 
                                      self.idevice.feedbackInstruc)
        html += common.richTextArea(self.feedbackId, feedback)
        html += "</td><td>\n"
        html += common.submitImage(self.id, self.idevice.id, 
                                   "/images/stock-cancel.png",
                                   _("Delete question"))
        html += "</td></tr>\n"
        
        return html


    def renderView(self):
        """
        Returns an XHTML string for viewing and previewing this question element
        """
        log.debug("renderView called")
        self.question.question = self.question.question.replace("\r", "")
        self.question.feedback = self.question.feedback.replace("\n", "\\n")

        html  = "<script type=\"text/javascript\">\n"
        html += "<!--\n"
        html += """
            function showAnswer(id,isShow){
                if (isShow==1){
                    document.getElementById("s"+id).style.display = "block";
                    document.getElementById("hide"+id).style.display = "block";
                    document.getElementById("view"+id).style.display = "none";
                }else{
                    document.getElementById("s"+id).style.display = "none";
                    document.getElementById("hide"+id).style.display = "none";
                    document.getElementById("view"+id).style.display = "block";
                }
            }\n"""           
        html += "//-->\n"
        html += "</script>\n"
        html += "<b>%s</b><br/>" % _("Question")      
        html += self.question.question  
        html += '<div id="view%s" style="display:block;">' % self.id
        html += '<input type="button" name="btnshow%s" ' % self.id
        html += 'value ="Click here" ' 
        html += 'onclick="showAnswer(\'%s\',1)"/></div>\n ' % self.id
        html += '<div id="hide%s" style="display:none;">' % self.id
        html += '<input type="button" name="btnhide%s" ' % self.id 
        html += 'value="Hide" '
        html += 'onclick="showAnswer(\'%s\',0)"/></div>\n ' % self.id
        html += '<div id="s%s" class="feedback" style=" ' % self.id
        html += 'display: none;">'
        html += self.question.feedback
        html += "</div><br/>\n"
        
        return html
    

    
# ===========================================================================
