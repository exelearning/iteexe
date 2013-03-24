#!/usr/bin/python
# -*- coding: utf-8 -*-
# ===========================================================================
# Bloque para el iDevice Para Saber más creado para la FPD por 
# José Ramón Jiménez Reyes
# ===========================================================================
"""
Para Saber mas bloque
"""

import logging
from exe.webui.block               import Block
from exe.webui                     import common
from exe.webui.element      import TextAreaElement

log = logging.getLogger(__name__)


# ===========================================================================
class ParasabermasfpdBlock(Block):

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

        # JR
	# Quitamos el prefijo "FPD -"
	if self.idevice.title.find("FPD - ") == 0:
		self.idevice.title = x_(u"A Step Ahead")

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
#        html  = u'<script type="text/javascript" src="common.js"></script>\n'
#        html += u'<div class="iDevice_inner">\n'
	html = u'<div class="iDevice_inner">\n'
    
        if self.previewing: 
            html += self.activityElement.renderPreview()
        else:
            html += self.activityElement.renderView()

        html += "</div>\n"
        return html

from exe.engine.parasabermasfpdidevice  import ParasabermasfpdIdevice
from exe.webui.blockfactory        import g_blockFactory
g_blockFactory.registerBlockType(ParasabermasfpdBlock, ParasabermasfpdIdevice)    

# ===========================================================================
