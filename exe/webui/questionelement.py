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
QuestionElement is responsible for a block of option.  
Used by MultichoiceBlock and CaseStudyBlock
"""

import logging
from exe.webui           import common
from exe.webui.element   import ImageElement
from exe.webui.element             import TextAreaElement


log = logging.getLogger(__name__)
# ===========================================================================


class QuestionElement(object):
    """
    QuestionElement is responsible for a block of question. 
    Used by MultichoiceBlock CasestudyBlock.
    """

    def __init__(self, index, idevice, question):
        """
        Initialize
        'index' is our number in the list of questions
        'idevice' is a case study idevice
        'question' is a exe.engine.casestudyidevice.Question instance
        """
        self.index        = index
        self.id           = "q" + unicode(index) + "b" + idevice.id        
        self.idevice      = idevice


        self.quesId       = "quesQuestion" + unicode(index) + "b" + idevice.id
        self.feedbackId   = "quesFeedback" + unicode(index) + "b" + idevice.id

        self.question     = question
        # also split out each part for a separate TextAreaElement:

        # but first....  
        # to compensate for the strange unpickling timing when objects are 
        # loaded from an elp, ensure that proper idevices are set: 
        if question.questionTextArea.idevice is None: 
            question.questionTextArea.idevice = idevice 
        if question.feedbackTextArea.idevice is None: 
            question.feedbackTextArea.idevice = idevice

        self.question_question = TextAreaElement(question.questionTextArea)
        self.question_question.id = self.quesId 
        self.question_feedback = TextAreaElement(question.feedbackTextArea)
        self.question_feedback.id = self.feedbackId 

    def process(self, request):
        """
        Process arguments from the web server.  Return any which apply to this
        element.
        """
        log.debug("process " + repr(request.args))
        
        if self.quesId in request.args:
            self.question_question.process(request)
                        
        if self.feedbackId in request.args:
            self.question_feedback.process(request)

        if "action" in request.args and request.args["action"][0] == self.id:
            # before deleting the question object, remove any internal anchors:
            for q_field in self.question.getRichTextFields():
                 q_field.ReplaceAllInternalAnchorsLinks()  
                 q_field.RemoveAllInternalLinks()  
            self.idevice.questions.remove(self.question)
            # disable Undo once an activity has been deleted:
            self.idevice.undo = False


    def renderEdit(self):
        """
        Returns an XHTML string for editing this question element
        """

        html  = "<tr><td><b>%s</b>\n" % _("Activity")
        html += common.elementInstruc(self.idevice.questionInstruc)
        html += self.question_question.renderEdit()

        html += "<b>%s</b>\n" % _("Feedback")
        html += common.elementInstruc(self.idevice.feedbackInstruc)
        html += self.question_feedback.renderEdit()

        html += "</td><td>\n"
        html += common.submitImage(self.id, self.idevice.id, 
                                   "/images/stock-cancel.png",
                                   _("Delete question"))
        html += "</td></tr>\n"
        return html

    def doRender(self, preview=False):
        """
        Returns an XHTML string for viewing and previewing this question element
        depending on the value of 'preview'.
        """
        log.debug("renderView called")
              
        if preview: 
            html  = self.question_question.renderPreview()
        else:
            html  = self.question_question.renderView()

        if  self.question_feedback.field.content != "" :            
            html += '<div id="view%s" style="display:block;">' % self.id
            html += common.feedbackButton('btnshow' + self.id,
                        _(u"Show Feedback"),
                        onclick = "showAnswer('%s',1)" % self.id)
            html += '</div>'
            html += '<div id="hide%s" style="display:none;">' % self.id
            html += common.feedbackButton('btnhide' + self.id,
                        _(u"Hide Feedback"),
                        onclick = "showAnswer('%s',0)" % self.id)
            html += '<p>'

            html += '</p>'
            html += '</div>'
            html += '<div id="s%s" class="feedback" style=" ' % self.id
            html += 'display: none;">'

            if preview: 
                html  += self.question_feedback.renderPreview() 
            else: 
                html  += self.question_feedback.renderView()

            html += "</div><br/>\n"
        else:
            html += "<br/>\n"
        
        return html

    def renderView(self):
        """
        Returns an XHTML string for viewing this question element
        """
        return self.doRender(preview=False)
    
    def renderPreview(self):
        """
        Returns an XHTML string for previewing this question element
        """
        return self.doRender(preview=True)
    

    
# ===========================================================================
