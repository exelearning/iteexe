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
import gettext
from exe.webui.block               import Block
from exe.webui.blockfactory        import g_blockFactory
from exe.engine.reflectionidevice  import ReflectionIdevice
from exe.webui.questionelement     import QuestionElement
from exe.webui                     import common

log = logging.getLogger(__name__)
_   = gettext.gettext


# ===========================================================================
class ReflectionBlock(Block):
    """
    ReflectionBlock can render and process ReflectionIdevices as XHTML
    """
    def __init__(self, idevice):
        """
        Initialize a new Block object
        """
        Block.__init__(self, idevice)
        self.idevice = idevice
        self.questionElements = []
        self.description = idevice.description

        i = 0
        for question in idevice.questions:
            self.questionElements.append(QuestionElement(i, idevice, question))                                              
            i += 1

    def process(self, request):
        """
        Process the request arguments from the web server
        """
        Block.process(self, request)
        
        descId = "desc"+str(self.id)
        if descId in request.args:
            self.idevice.description = request.args[descId][0]
            
        if ("addQuestion"+str(self.id)) in request.args: 
            self.idevice.addQuestion()

        for element in self.questionElements:
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
        html  = "<b>" + _("Description:") + "</b><br/>"       
        html += common.textArea("desc"+self.id, self.description)
        html += "<div>\n"
        html += "<table><th>%s</th>" % ""
        html += "<th>%s</th>" % _("Question:")
        html += "<th>%s</th>" % _("Answer:")

        for element in self.questionElements:
            html += element.renderEdit() 
            
        html += "</table>\n"
            
        html += common.submitButton("addQuestion"+str(self.id), _("AddQuestion"))
        html += "<br/>" + self.renderEditButtons()
        html += "</div>\n"
        return html


    def renderView(self):
        """
        Returns an XHTML string for viewing this block
        """
        html  = "<script type=\"text/javascript\">\n"
        html += "<!--\n"
        html += """
                function showAnswer(blockId){
                    var buttonName = "button" + blockId
                    if (window.form[0].buttonName.value=="Show Answers") {              
                        document.getElementById(id).style.display = "none";
                        window.form[0].buttonName.value=="Hide Answers"
                    }else{
                        document.getElementById(id).style.display = "block";
                        window.form[0].buttonName.value=="Show Answers"
                    }
                }\n"""           
        html += "//-->\n"
        html += "</script>\n"
        html += "<div id=\"iDevice\">\n"
        html += "<b>" + self.question + "</b><br/>"
        html += "<table>"
        for element in self.questionElements:
            html += element.renderquestionView()       
                       
        html += "</table>"
        html += '<input type="button" name = "%s" value = "Show Answers"' % self.id
        html += 'onclick = "showAnswer("%s")"/>' % self.id
        html += ' View our suggested answers. <br/> \n'
        
        for element in self.questionElements:
            html += element.renderAnswerView()
    
        html += "</div>\n"
        return html
    

    def renderPreview(self):
        """
        Returns an XHTML string for previewing this block
        """
        html  = "<script type=\"text/javascript\">\n"
        html += "<!--\n"
        html += """
                function showAnswer(id){            
                        document.getElementById(id).style.display = "block";
                }\n"""           
        html += "//-->\n"
        html += "</script>\n"
        html += "<div id=\"iDevice\">\n"
        html += "<b>" + self.description + "</b><br/>"
        html += "<table>"
        for element in self.questionElements:
            html += element.renderQuestionView()       
        buttonName = "button" + self.id              
        html += "</table>"
        html += '<input type="button" name ="%s"' % buttonName
        html += ' value ="%s"' % _("Click here")
      #  buttonName1 = "document.contentForm." + buttonName
        html += 'onclick ="showAnswer(\'%s\');"/>' %("s"+self.id) 
        html += ' View our suggested answers. <br/> \n'
        
        html += '<div id="s%s" style="color: rgb(0, 51, 204);' % self.id
        #display = "none"
        html += 'display: none;">' 
        
        html += "<table>"       
        for element in self.questionElements:
            html += element.renderAnswerView()
            
        html += "</table>"
            
        html += '</div>\n'
        html += self.renderViewButtons()
        html += "</div>\n"
        return html


g_blockFactory.registerBlockType(ReflectionBlock, ReflectionIdevice)


# ===========================================================================
