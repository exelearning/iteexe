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
from exe.webui.block               import Block
from exe.webui.optionelement       import OptionElement
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
        self.optionElements  = []
        self.question        = idevice.question
        self.questionInstruc = idevice.questionInstruc
        self.keyInstruc      = idevice.keyInstruc
        self.answerInstruc   = idevice.answerInstruc
        self.feedbackInstruc = idevice.feedbackInstruc
        self.hint            = idevice.hint
        self.hintId          = "hint" + idevice.id
        self.hintInstruc     = idevice.hintInstruc
        
        i = 0
        for option in idevice.options:
            self.optionElements.append(OptionElement(i, idevice, option))
            i += 1

    def process(self, request):
        """
        Process the request arguments from the web server
        """
        Block.process(self, request)
        
        questionId = "question"+unicode(self.id)
        if questionId in request.args:
            self.idevice.question = request.args[questionId][0]
            
        if self.hintId in request.args:
            self.idevice.hint = request.args[self.hintId][0]
            
        if ("addOption"+unicode(self.id)) in request.args: 
            self.idevice.addOption()
            self.idevice.edit = True
        
        if "title"+self.id in request.args:
            self.idevice.title = request.args["title"+self.id][0]

        for element in self.optionElements:
            element.process(request)


    def renderEdit(self, style):
        """
        Returns an XHTML string with the form element for editing this block
        """
        question = self.question.replace("\r", "")
        question = question.replace("\n","\\n")
        
        hint      = self.hint.replace("\r", "")
        hint      = hint.replace("\n","\\n")
        
        html  = "<div class=\"iDevice\"><br/>\n"
        html += common.textInput("title"+self.id, self.idevice.title)
        html += u"<br/><br/>\n"
        html += "<b>" + _("Question:") + " </b>"   
        html += common.elementInstruc("question"+self.id, self.questionInstruc)
        html += common.richTextArea("question"+self.id, question)
        html += "<b>" + _("Hint:") + " </b>"   
        html += common.elementInstruc("hint"+self.id, self.hintInstruc)
        html += common.richTextArea("hint"+self.id, hint)
        html += "<table width =\"100%%\">"
        html += "<thead>"
        html += "<tr>"
        html += "<th>%s " % _("Alternatives")
        html += common.elementInstruc("answer"+self.id, self.answerInstruc)
        html += "</th>"
        html += "<th>%s"  % _("Correct")
        html += "<br/>" + _("Option")
        html += common.elementInstruc("key"+self.id, self.keyInstruc)
        html += "</th>"
        html += "<th>%s " % _("Feedback")
        html += common.elementInstruc("feed"+self.id, self.feedbackInstruc)
        html += "</th>"
        html += "</tr>"
        html += "</thead>"
        html += "<tbody>"

        for element in self.optionElements:
            html += element.renderEdit() 
            
        html += "</tbody>"
        html += "</table>\n"
        value = _("Add another option")    
        html += common.submitButton("addOption"+unicode(self.id), value)
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
        html += '<img alt="" class="iDevice_icon" '
        html += "src=\"icon_question.gif\" />\n"
        html += "<span class=\"iDeviceTitle\">"       
        html += self.idevice.title+"</span><br/>\n"
        html += "<div class=\"iDevice_inner\">\n"
        html += self.question+" &nbsp;&nbsp;\n"
        
        html += '<span style="background-image:url(\'panel-amusements.png\');">'
        html += '\n<a onmousedown="Javascript:updateCoords(event);'
        html += 'showMe(\'%s\', 350, 100);" ' % self.hintId
        html += 'style="cursor:help;align:center;vertical-align:middle;" '
        html += 'title="Hint" \n'
        html += 'href="javascript:void(0);">&nbsp;&nbsp;&nbsp;&nbsp;</a></span>'
        html += '<div id="'+self.hintId+'" '
        html += 'style="display:none; z-index:99;">'
        html += '<div style="float:right;" >'
        html += '<img alt="%s" ' % _('Close')
        html += 'src="stock-stop.png" title="%s"' % _('Close')
        html += " onmousedown=\"Javascript:hideMe();\"/></div>"
        html += '<div class="popupDivLabel">'
        html += _("Hint")
        html += '</div>\n'
        html += self.hint
        html += "</div>\n"
        html += self.renderViewContent()    
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
        html += u'<img alt="" class="iDevice_icon" '
        html += u"src=\"/style/"+style+"/icon_"+self.idevice.icon+".gif\" />\n"
        html += u"<span class=\"iDeviceTitle\">"       
        html += self.idevice.title+"</span><br/>\n"
        html += "<div class=\"iDevice_inner\">\n"
        html += self.question+" &nbsp;&nbsp;\n"
        html += common.elementInstruc(self.hintId, self.hint, 
                                      "panel-amusements.png", "Hint")
                                                                             
        html += self.renderViewContent()      
        html += "</div>\n"    
        html += self.renderViewButtons()
        html += "</div>\n"

        return html


    def renderViewContent(self):
        """
        Returns an XHTML string for this block
        """
        html  = "<table>\n"
        html += "<tbody>\n"

        for element in self.optionElements:
            html += element.renderAnswerView()
            
        html += "</tbody>\n"
        html += "</table>\n"
            
        for element in self.optionElements:
            html += element.renderFeedbackView()

        return html

from exe.engine.multichoiceidevice import MultichoiceIdevice
from exe.webui.blockfactory        import g_blockFactory
g_blockFactory.registerBlockType(MultichoiceBlock, MultichoiceIdevice)    

# ===========================================================================
