#!/usr/bin/python
# -*- coding: utf-8 -*-
# ===========================================================================
# eXe 
# Copyright 2004-2006, University of Auckland
# Copyright 2004-2008 eXe Project, http://eXeLearning.org
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
TrueFalseBlock can render and process TrueFalseIdevices as XHTML
"""

import logging
import re
from exe.webui.block               import Block
from exe.webui.truefalseelement    import TrueFalseElement
from exe.webui                     import common
from exe.webui.element             import TextAreaElement

log = logging.getLogger(__name__)


# ===========================================================================
class VerdaderofalsofpdBlock(Block):
    """
    TrueFalseBlock can render and process TrueFalseIdevices as XHTML
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
        self.feedbackInstruc = idevice.feedbackInstruc
        self.hintInstruc     = idevice.hintInstruc 

        # to compensate for the strange unpickling timing when objects are 
        # loaded from an elp, ensure that proper idevices are set:
        if idevice.instructionsForLearners.idevice is None: 
            idevice.instructionsForLearners.idevice = idevice
        self.instructionElement = \
            TextAreaElement(idevice.instructionsForLearners)

        if not hasattr(self.idevice,'undo'):
            self.idevice.undo = True
        
        i = 0
        for question in idevice.questions:
            self.questionElements.append(TrueFalseElement(i, idevice, 
                                                           question))
            i += 1

    def process(self, request):
        """
        Process the request arguments from the web server
        """
        Block.process(self, request)

        is_cancel = common.requestHasCancel(request)
    
        self.instructionElement.process(request)
            
        if ("addQuestion"+unicode(self.id)) in request.args: 
            self.idevice.addQuestion()
            self.idevice.edit = True
            # disable Undo once a question has been added: 
            self.idevice.undo = False
        
        if "title"+self.id in request.args \
        and not is_cancel:
            self.idevice.title = request.args["title"+self.id][0]

        for element in self.questionElements:
            element.process(request)

        if ("action" in request.args and request.args["action"][0] == "done" 
        or not self.idevice.edit): 
            # remove the undo flag in order to reenable it next time:
            if hasattr(self.idevice,'undo'): 
                del self.idevice.undo


    def renderEdit(self, style):
        """
        Returns an XHTML string with the form element for editing this block
        """
        
        html  = u"<div class=\"iDevice\"><br/>\n"

        # JR
	# Quitamos el prefijo "FPD -"
	if self.idevice.title.find("FPD - ") == 0:
		self.idevice.title = x_(u"Autoevaluación")

        html += common.textInput("title"+self.id, self.idevice.title)
        html += u"<br/><br/>\n"
        html += self.instructionElement.renderEdit()

        for element in self.questionElements:
            html += element.renderEdit() 
            
        value = _(u"Add another question")    
        html += common.submitButton("addQuestion"+unicode(self.id), value)
        html += u"<br /><br />" + self.renderEditButtons(undo=self.idevice.undo)
        html += u"</div>\n"

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
        html += u"<span class=\"iDeviceTitle\"><strong>"       
        html += self.idevice.title+"</strong></span>\n"     
        html += u"<div class=\"iDevice_inner\">\n"
# JR: Si hay instrucciones añadimos un &nbsp;
	aux =self.instructionElement.renderView()
	if re.search(">[\n|\r|\t]*</div>", aux):
		html += aux
	else:
		html += aux + "&nbsp;"

#       html += self.instructionElement.renderPreview()
# JR: si es la última pregunta no añadimos br        
        for element in self.questionElements:
            html += "<div class=\"question\">\n"
            html += element.renderQuestion(True)
	    html += element.renderFeedbackView(True)
	    html += element.renderNoscript(True)
	    if element == self.questionElements[len(self.questionElements) - 1]:
		html += "</div>\n"
	    else:
		html += "</div><div>&nbsp;</div>\n"
            
        html += "</div>\n"    
        html += self.renderViewButtons()
        html += "</div>\n"

        return html

    
    def renderView(self, style):
        """
        Returns an XHTML string for viewing this block
        """
        html = u'<script type="text/javascript" src="libot_drag.js"></script>'
        html += u"\n<div class=\"iDevice "
        html += u"emphasis"+unicode(self.idevice.emphasis)+"\">\n"
        html += u'<img alt="" class="iDevice_icon" '
        html += u"src=\"icon_"+self.idevice.icon+".gif\" />\n"
        html += u"<span class=\"iDeviceTitle\"><strong>"       
        html += self.idevice.title+"</strong></span>\n"
        html += u"<div class=\"iDevice_inner\">\n"
# JR: Si hay instrucciones añadimos un &nbsp;
	aux =self.instructionElement.renderView()

	if re.search(">[\n|\r|\t]*</div>", aux):
		html += aux
	else:
		html += aux + "&nbsp;"

#       html += self.instructionElement.renderPreview()
# JR: si es la última pregunta no añadimos br        
        for element in self.questionElements:
            html += "<div class=\"question\">\n"
            html += element.renderQuestion(False)
	    html += element.renderFeedbackView(False)
	    html += element.renderNoscript(False)
	    if element == self.questionElements[len(self.questionElements) - 1]:
		html += "</div>\n"
	    else:
		html += "</div><div>&nbsp;</div>\n"
            
        html += u"</div>\n"    
        html += u"</div>\n"

        return html
    


from exe.engine.verdaderofalsofpdidevice   import VerdaderofalsofpdIdevice
from exe.webui.blockfactory        import g_blockFactory
g_blockFactory.registerBlockType(VerdaderofalsofpdBlock, VerdaderofalsofpdIdevice)    

# ===========================================================================
