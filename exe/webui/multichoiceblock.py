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
from exe.webui.blockfactory        import g_blockFactory
from exe.engine.multichoiceidevice import MultichoiceIdevice
from exe.webui.optionelement       import OptionElement
from exe.webui                     import common

log = logging.getLogger(__name__)
_   = gettext.gettext


# ===========================================================================
class MultichoiceBlock(Block):
    """
    MultichoiceBlock can render and process MultichoiceIdevices as XHTML
    """
    def __init__(self, idevice):
        """
        Initialize a new Block object
        """
        Block.__init__(self, idevice)
        self.idevice = idevice
        self.optionElements = []
        self.question = idevice.question
        self.questionInstruc = idevice.questionInstruc
        self.keyInstruc      = idevice.keyInstruc
        self.answerInstruc   = idevice.answerInstruc
        self.feedbackInstruc = idevice.feedbackInstruc
        i = 0
        for option in idevice.options:
            self.optionElements.append(OptionElement(i, idevice, option))
            i += 1

    def process(self, request):
        """
        Process the request arguments from the web server
        """
        Block.process(self, request)
        
        quesId = "ques"+str(self.id)
        if quesId in request.args:
            self.idevice.question = request.args[quesId][0]
            
        if ("addOption"+str(self.id)) in request.args: 
            self.idevice.addOption()

        for element in self.optionElements:
            element.process(request)


    def processMove(self, request):
        """
        Move this iDevice to a different node
        """
        Block.processMove(self, request)
        nodeId = request.args["move"+self.id][0]
        node   = self.idevice.parentNode.package.findNode(nodeId)
        if node is not None:
            self.idevice.setParentNode(node)
        else:
            log.error("addChildNode cannot locate "+nodeId)


    def processMovePrev(self, request):
        """
        Move this block back to the previous position
        """
        Block.processMovePrev(self, request)
        self.idevice.movePrev()


    def processMoveNext(self, request):
        """
        Move this block forward to the next position
        """
        Block.processMoveNext(self, request)
        self.idevice.moveNext()


    def renderEdit(self):
        """
        Returns an XHTML string with the form element for editing this block
        """
    
        self.question = self.question.replace("\r", "")
        self.question = self.question.replace("\n","\\n")
        self.question = self.question.replace("'","\\'")
        html  = "<b>" + _("Question:") + " </b>"   
        html += common.elementInstructions("ques"+self.id, self.questionInstruc)
        html += common.richTextArea("ques"+self.id, self.question)
        html += "<div id=\"iDevice\" class=\"multichoice\">\n"
        html += "<table width =\"100%%\"><th>%s " % _("Key")
        html += common.elementInstructions("key"+self.id, self.keyInstruc)
        html += "</th><th>%s " % _("Answer")
        html += common.elementInstructions("ans"+self.id, self.answerInstruc)
        html += "</th><th>%s " % _("Feedback")
        html += common.elementInstructions("feed"+self.id, self.feedbackInstruc)
        html += "</th>"

        for element in self.optionElements:
            html += element.renderEdit() 
            
        html += "</table>\n"
        value = _("Add another option")    
        html += common.submitButton("addOption"+str(self.id), value)
        html += "<br /><br />" + self.renderEditButtons()
        html += "</div>\n"
        return html

    def renderBlockView(self):
        """
        Returns an XHTML string for this block
        """
        html  = "<script type=\"text/javascript\">\n"
        html += "<!--\n"
        html += """
                function getFeedback(optionId, optionsNum, ideviceId){
                
                    for (i = 0; i< optionsNum; i++){   
                        id = "s" + i + "b" +ideviceId
                        if(i == optionId)
                            document.getElementById(id).style.display = "block";
                        else
                            document.getElementById(id).style.display = "None";
                    }
                }\n"""            
        html += "//-->\n"
        html += "</script>\n"
        html += "<b>" + self.question + "</b><br/>"
        html += "<table>"
        for element in self.optionElements:
            html += element.renderAnswerView()
            
        html += "</table>"
            
        for element in self.optionElements:
            html += element.renderFeedbackView()
            
        return html
    
    def renderView(self):
        """
        Returns an XHTML string for viewing this block
        """
        html  = "<div id=\"iDevice\" class=\"multichoice\">\n"
        html += self.renderBlockView()    
        html += "</div>\n"
        return html
    

    def renderPreview(self):
        """
        Returns an XHTML string for previewing this block
        """
        html  = "<div id=\"iDevice\" class=\"multichoice\">\n"
        html += self.renderBlockView()      
        html += self.renderViewButtons()
        html += "</div>\n"
        return html


g_blockFactory.registerBlockType(MultichoiceBlock, MultichoiceIdevice)


# ===========================================================================
