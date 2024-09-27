#!/usr/bin/env python
# -*- coding: utf-8 -*-
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
FPD - ReflectionBlock 
can render and process ReflectionIdevices as XHTML
"""

import logging
from exe.webui.block               import Block
from exe.webui                     import common
from exe.webui.element      import TextAreaElement

log = logging.getLogger(__name__)


# ===========================================================================
class ReflectionfpdBlock(Block):
    """
    ReflectionfpdBlock can render and process ReflectionIdevices as XHTML
    """
    def __init__(self, parent, idevice):
        """
        Initialize a new Block object
        """
        Block.__init__(self, parent, idevice)
        self.activityInstruc = idevice.activityInstruc
        self.answerInstruc   = idevice.answerInstruc

        # to compensate for the strange unpickling timing when objects are 
        # loaded from an elp, ensure that proper idevices are set:
        if idevice.activityTextArea.idevice is None: 
            idevice.activityTextArea.idevice = idevice
        if idevice.answerTextArea.idevice is None: 
            idevice.answerTextArea.idevice = idevice

        self.activityElement  = TextAreaElement(idevice.activityTextArea)
        self.answerElement    = TextAreaElement(idevice.answerTextArea)

        self.previewing        = False # In view or preview render

        if not hasattr(self.idevice,'undo'): 
            self.idevice.undo = True


    def process(self, request):
        """
        Process the request arguments from the web server
        """
        Block.process(self, request)

        is_cancel = common.requestHasCancel(request)

        if not is_cancel:
            self.activityElement.process(request)
            self.answerElement.process(request)
            if "title"+self.id in request.args:
                self.idevice.title = request.args["title"+self.id][0]
        

    def renderEdit(self, style):
        """
        Returns an XHTML string with the form element for editing this block
        """
        html  = "<div class=\"iDevice\"><br/>\n"

   # JRJ
	# Quitamos el prefijo "FPD -"
	# (let's remove the "FPD -" prefix)
	if self.idevice.title.find("FPD - ") == 0:
		self.idevice.title = x_("Think About It")

        html += common.textInput("title"+self.id, self.idevice.title)
        html += self.activityElement.renderEdit()
        html += self.answerElement.renderEdit()
        html += "<br/>" + self.renderEditButtons()
        html += "</div>\n"
        return html

    def renderPreview(self, style):
        """ 
        Remembers if we're previewing or not, 
        then implicitly calls self.renderViewContent (via Block.renderPreview) 
        """ 
        self.previewing = True 
        return Block.renderPreview(self, style)

    def renderView(self, style): 
        """ 
        Remembers if we're previewing or not, 
        then implicitly calls self.renderViewContent (via Block.renderPreview) 
        """ 
        self.previewing = False 
        return Block.renderView(self, style)


    def renderViewContent(self):
        """
        Returns an XHTML string for this block
        """
        
        if self.previewing: 
            html = self.activityElement.renderPreview()
            feedback = self.answerElement.renderPreview()
        else:
            html = self.activityElement.renderView()
            feedback = self.answerElement.renderView()
            
        html += common.feedbackBlock(self.id,feedback)

        return html
    

from exe.engine.reflectionfpdidevice  import ReflectionfpdIdevice
from exe.webui.blockfactory        import g_blockFactory
g_blockFactory.registerBlockType(ReflectionfpdBlock, ReflectionfpdIdevice)    

# ===========================================================================
