#!/usr/bin/env python
# -*- coding: utf-8 -*-
# ===========================================================================
# Bloque para el iDevice "Citas para pensar" creado para la FPD por 
# José Ramón Jiménez Reyes
# (Block for the iDevice Quotation created for the FPD project
# by José Ramón Jiménez Reyes)
# ===========================================================================
"""
FPD - Quotation
"""

import logging
from exe.webui.block               import Block
from exe.webui                     import common
from exe.webui.element      import TextAreaElement

log = logging.getLogger(__name__)


# ===========================================================================
class CitasparapensarfpdBlock(Block):

    def __init__(self, parent, idevice):
        """
        Initialize a new Block object
        """
        Block.__init__(self, parent, idevice)
        self.activityInstruc = idevice.activityInstruc

        # to compensate for the strange unpickling timing when objects are 
        # loaded from an elp, ensure that proper idevices are set:
        if idevice.activityTextArea.idevice is None: 
            idevice.activityTextArea.idevice = idevice

        self.activityElement  = TextAreaElement(idevice.activityTextArea)

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
		self.idevice.title = x_(u"Quotation")

	html += common.textInput("title"+self.id, self.idevice.title)
        html += self.activityElement.renderEdit()
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
        else:
            html = self.activityElement.renderView()

        return html

from exe.engine.citasparapensarfpdidevice  import CitasparapensarfpdIdevice
from exe.webui.blockfactory        import g_blockFactory
g_blockFactory.registerBlockType(CitasparapensarfpdBlock, CitasparapensarfpdIdevice)    

# ===========================================================================
