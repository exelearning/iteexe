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
TestOptionElement is responsible for a block of option.  Used by 
TestquestionElement.
"""

import logging
from exe.webui import common

log = logging.getLogger(__name__)
# ===========================================================================
class TestoptionElement(object):
    """
    TestOptionElement is responsible for a block of option.  Used by
    TestquestionElement.
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
  
        

    def process(self, request):
        """
        Process arguments from the web server.  Return any which apply to this 
        element.
        """
        log.debug("process " + repr(request.args))
        
        if self.answerId in request.args:
            self.option.answer = request.args[self.answerId][0]
                        
        if "c"+self.keyId in request.args:
            if request.args["c"+self.keyId][0] == self.id:
                self.option.isCorrect = True 
                self.question.correctAns = self.index
                log.debug("option " + repr(self.option.isCorrect))
            else:
                self.option.isCorrect = False
                
        if self.keyId in request.args:
            if request.args[self.keyId][0] == unicode(self.index):
                self.question.userAns = self.index
            
        if "action" in request.args and request.args["action"][0] == self.id:
            self.question.options.remove(self.option)


    def renderEdit(self):
        """
        Returns an XHTML string for editing this option element
        """
        html = u"<tr><td>"
        html += common.richTextArea(self.answerId, self.option.answer)
        html += "</td><td align=\"center\">\n"
        html += common.option("c"+self.keyId, self.option.isCorrect, self.id)
        html += "</td><td>\n"
        html += common.submitImage(self.id, self.idevice.id, 
                                   "/images/stock-cancel.png",
                                   _(u"Delete option"))
        html += "</td></tr>\n"
        return html


    def renderView(self):
        """
        Returns an XHTML string for viewing this option element
        """
        log.debug("renderView called")

        html  = '<tr><td>'
        html += common.option(self.keyId, 0, unicode(self.index))
        html += '</td><td>\n'
        html += self.option.answer + "</td></tr>\n"
       
        return html
    
   
    
# ===========================================================================
