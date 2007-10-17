# ===========================================================================
# eXe 
# Copyright 2004-2006, University of Auckland
# Copyright 2004-2007 eXe Project, http://eXeLearning.org/
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
from exe.webui.block               import Block
from exe.webui.element             import QuizQuestionElement
from exe.webui                     import common

log = logging.getLogger(__name__)



# ===========================================================================
class MultichoiceBlock(Block):
    """
    MultichoiceBlock can render and process MultichoiceIdevices as XHTML
    """
    def __init__(self, parent, idevice):
        """
        Initialize a new Block object
        """
        Block.__init__(self, parent, idevice)
        self.idevice         = idevice
        self.questionElements  = []
        self.questionInstruc = idevice.questionInstruc
        self.keyInstruc      = idevice.keyInstruc
        self.answerInstruc   = idevice.answerInstruc
        self.feedbackInstruc = idevice.feedbackInstruc
      #  self.hint            = idevice.hint
        self.hintInstruc     = idevice.hintInstruc

        
        for question in idevice.questions:
            self.questionElements.append(QuizQuestionElement(question))


    def process(self, request):
        """
        Process the request arguments from the web server
        """
        Block.process(self, request)
        self.idevice.message = ""
  
    
        if ("addQuestion"+unicode(self.id)) in request.args: 
            self.idevice.addQuestion()
            self.idevice.edit = True
        
        if "title"+self.id in request.args:
            self.idevice.title = request.args["title"+self.id][0]

        for element in self.questionElements:
            element.process(request)
        
        if ("action" in request.args and request.args["action"][0] == "done"
            or not self.idevice.edit):
            for question in self.idevice.questions:
                isAnswered = False
                for option in question.options:
                    if option.isCorrect:
                        isAnswered = True
                        break
                if not isAnswered: 
                    self.idevice.edit = True
                    self.idevice.message = \
                        x_("Please select a correct answer for each question.")
                    break
 
        
    def renderEdit(self, style):
        """
        Returns an XHTML string with the form element for editing this block
        """
        html  = "<div class=\"iDevice\"><br/>\n"
        if self.idevice.message<>"":
            html += common.editModeHeading(self.idevice.message)
        html += common.textInput("title"+self.id, self.idevice.title) + '<br/>'
            
        for element in self.questionElements:
            html += element.renderEdit() 
            html += "<br/>"
            
        html += "<br/>"
        value = _("Add another question")    
        html += common.submitButton("addQuestion"+unicode(self.id), value)
        html += "<br /><br />" + self.renderEditButtons()
        html += "</div>\n"

        return html

    
    def renderView(self, style):
        """
        Returns an XHTML string for viewing this block
        """
        html  = u'<script type="text/javascript" src="common.js"></script>\n'
        html += u'<script type="text/javascript" src="libot_drag.js"></script>\n'
        html += u"<div class=\"iDevice "
        html += u"emphasis"+unicode(self.idevice.emphasis)+"\">\n"
        html += u'<img alt="%s" ' % _(u'IDevice Question Icon')
        html += u'     class="iDevice_icon" '
        html += "src=\"icon_question.gif\" />\n"
        html += "<span class=\"iDeviceTitle\">"       
        html += self.idevice.title+"</span><br/>\n"
        html += "<div class=\"iDevice_inner\">\n"
        
        for element in self.questionElements:
            html += element.renderView("panel-amusements.png","stock-stop.png")  
            html += "<br/>"
            
        html += "</div>\n"
        html += "</div>\n"

        return html
    

    def renderPreview(self, style):
        """
        Returns an XHTML string for previewing this block
        """
        html  = u"<div class=\"iDevice "
        html += u"emphasis"+unicode(self.idevice.emphasis)+"\" "
        html += u"ondblclick=\"submitLink('edit',"+self.id+", 0);\">\n"
        html += u'<img alt="%s" ' % _(u'IDevice Icon')
        html += u'     class="iDevice_icon" '
        html += u"src=\"/style/"+style+"/icon_"+self.idevice.icon+".gif\" />\n"
        html += u"<span class=\"iDeviceTitle\">"       
        html += self.idevice.title+"</span><br/>\n"
        html += "<div class=\"iDevice_inner\">\n"

        for element in self.questionElements:
            html += element.renderPreview("/images/panel-amusements.png", 
                                          "/images/stock-stop.png") 
            html += "<br/>"
            
        html += "</div>\n"    
        html += self.renderViewButtons()
        html += "</div>\n"

        return html



from exe.engine.multichoiceidevice import MultichoiceIdevice
from exe.webui.blockfactory        import g_blockFactory
g_blockFactory.registerBlockType(MultichoiceBlock, MultichoiceIdevice)    

# ===========================================================================
