# ===========================================================================
# eXe 
# Copyright 2004-2006, University of Auckland
# Copyright 2004-2008 eXe Project, http://eXeLearning.org/
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
TestOptionElement is responsible for a block of option.  Used by 
TestquestionElement.
"""

import logging
from exe.webui import common
from exe.webui.element import TextAreaElement

log = logging.getLogger(__name__)
# ===========================================================================
class TestoptionElement(object):
    """
    TestOptionElement is responsible for a block of option.  Used by
    TestquestionElement.  
    == SCORM Quiz Testoption, 
    pretty much the same as MultiSelect's SelectoptionElement,
    but with enough subtle variations that you'd better pay attention :-)
    """
    def __init__(self, index, question, questionId, option, idevice):
        """
        Initialize
        """
        self.index      = index
        self.id         = unicode(index) + "q" + questionId       
        self.question   = question
        self.questionId = questionId
        self.option     = option
        self.answerId   = "optionAnswer"+ unicode(index) + "q" + questionId
        self.keyId      = "key" + questionId   
        self.idevice    = idevice
        self.checked    = False

        # to compensate for the strange unpickling timing when objects are 
        # loaded from an elp, ensure that proper idevices are set:
        # (only applies to the image-embeddable ones, not FlashElement)
        if option.answerTextArea.idevice is None: 
            option.answerTextArea.idevice = idevice
        self.answerElement = TextAreaElement(option.answerTextArea)
        self.answerElement.id = self.answerId

        if not hasattr(self.idevice,'undo'): 
            self.idevice.undo = True
  
        
    def process(self, request):
        """
        Process arguments from the web server.  Return any which apply to this 
        element.
        """
        log.debug("process " + repr(request.args))

        is_cancel = common.requestHasCancel(request)
      
        if self.answerId in request.args \
        and not is_cancel:
            self.answerElement.process(request)
                        
        if "c"+self.keyId in request.args \
        and not is_cancel:
            if request.args["c"+self.keyId][0] == self.id:
                self.option.isCorrect = True 
                self.question.correctAns = self.index
                log.debug("option " + repr(self.option.isCorrect))
            else:
                self.option.isCorrect = False
                
        if self.keyId in request.args \
        and not is_cancel:
            if request.args[self.keyId][0] == unicode(self.index):
                self.question.userAns = self.index
            
        if "action" in request.args and request.args["action"][0] == self.id:
            # before deleting the option object, remove any internal anchors:
            for o_field in self.option.getRichTextFields():
                 o_field.ReplaceAllInternalAnchorsLinks()  
                 o_field.RemoveAllInternalLinks()  
            self.question.options.remove(self.option)
            # disable Undo once an option has been deleted: 
            self.idevice.undo = False


    def renderEdit(self):
        """
        Returns an XHTML string for editing this option element
        """
        html  = u"<tr><td align=\"left\"><b>%s</b>" % _("Option")
        html += common.elementInstruc(self.question.optionInstruc)

        header = ""
        if self.index == 0: 
            header = _("Correct Option")

        html += u"</td><td align=\"right\"><b>%s</b>\n" % header
        html += u"</td><td>\n"
        if self.index == 0: 
             html += common.elementInstruc(self.question.correctAnswerInstruc)
        html += "</td></tr><tr><td colspan=2>\n"

        # rather than using answerElement.renderEdit(),
        # access the appropriate content_w_resourcePaths attribute directly,
        # since this is in a customised output format 
        # (in a table, with an extra delete-option X to the right)

        this_package = None 
        if self.answerElement.field_idevice is not None \
        and self.answerElement.field_idevice.parentNode is not None: 
            this_package = self.answerElement.field_idevice.parentNode.package

        html += common.richTextArea(self.answerId,
                self.answerElement.field.content_w_resourcePaths,
                package=this_package)

        html += "</td><td align=\"center\">\n"
        html += common.option("c"+self.keyId, 
                self.option.isCorrect, self.id)
        html += "<br><br><br><br>\n"
        html += common.submitImage(self.id, self.idevice.id, 
                                   "/images/stock-cancel.png",
                                   _(u"Delete option"))
        html += "</td></tr>\n"

        return html


    def renderPreview(self):
        """
        Returns an XHTML string for previewing this option element
        """
        return self.renderView(preview=True)

    def renderView(self, preview=False):
        """
        Returns an XHTML string for viewing this option element
        """
        log.debug("renderView called")

        html  = '<tr><td>'
        html += common.option(self.keyId, 0, unicode(self.index))
        html += '</td><td>\n'
        
        if preview: 
            html += self.answerElement.renderPreview()
        else:            
            html += self.answerElement.renderView()
        html += "</td></tr>\n"
       
        return html
    
   
    
# ===========================================================================
