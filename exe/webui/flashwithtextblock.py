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
FlashWithTextBlock can render and process FlashWithTextIdevices as XHTML
"""

import logging
from exe.webui.block   import Block
from exe.webui.element import TextAreaElement, FlashElement
from exe.webui         import common

log = logging.getLogger(__name__)


# ===========================================================================
class FlashWithTextBlock(Block):
    """
    FlashWithTextBlock can render and process FlashWithTextIdevices as XHTML
    """

    name = 'flashWithText'

    def __init__(self, parent, idevice):
        """
        Initialize
        """
        Block.__init__(self, parent, idevice)
        self.flashElement = FlashElement(idevice.flash)

        # to compensate for the strange unpickling timing when objects are 
        # loaded from an elp, ensure that proper idevices are set:
        # (only applies to the image-embeddable ones, not FlashElement)
        if idevice.text.idevice is None: 
            idevice.text.idevice = idevice
        self.textElement  = TextAreaElement(idevice.text)


    def process(self, request):
        """
        Process the request arguments from the web server to see if any
        apply to this block
        """
        log.debug("process " + repr(request.args))
        Block.process(self, request)

        if ("action" not in request.args or
            request.args["action"][0] != "delete"):
            self.flashElement.process(request)
            self.textElement.process(request)
            
        if "float"+self.id in request.args:
            self.idevice.float = request.args["float"+self.id][0]
            
        if "caption"+self.id in request.args:
            self.idevice.caption = request.args["caption"+self.id][0]


    def renderEdit(self, style):
        """
        Returns an XHTML string with the form elements for editing this block
        """
        log.debug("renderEdit")
        html  = "<div class=\"iDevice\">\n"
        html += self.flashElement.renderEdit()  
        floatArr    = [[_('Left'), 'left'],
                      [_('Right'), 'right'],
                      [_('None'),  'none']]

        this_package = None
        if self.idevice is not None and self.idevice.parentNode is not None:
            this_package = self.idevice.parentNode.package
        html += common.formField('select', this_package, _("Align:"),
                                 "float" + self.id,
                                 options = floatArr,
                                 selection = self.idevice.float)
        html += "\n"
        html += "<b>%s </b>" % _("Caption:")
        html += common.textInput("caption" + self.id, self.idevice.caption)
        html += common.elementInstruc(self.idevice.captionInstruc)
        html += "<br/>" + self.textElement.renderEdit()
        html += self.renderEditButtons()
        html += "</div>\n"
        return html


    def renderPreview(self, style):
        """
        Returns an XHTML string for previewing this block
        """
        log.debug("renderPreview")
        html  = "\n<!-- flash with text iDevice -->\n"
        html  = "<div class=\"iDevice "
        html += "emphasis"+str(self.idevice.emphasis)+"\" "
        html += "ondblclick=\"submitLink('edit',"+self.id+", 0);\">\n"
        html += "<div class=\"flash_text\" style=\""
        html += "width:" + str(self.idevice.flash.width) + "px; "
        html += "float:%s;\">\n" % self.idevice.float
        html += "<div class=\"flash\">\n"
        html += self.flashElement.renderPreview()
        html += "" + self.idevice.caption + "</div>"
        html += "</div>\n"
        html += self.textElement.renderPreview()
        html += "<br/>\n"        
        html += "<div style=\"clear:both;\">"
        html += "</div>\n"
        html += self.renderViewButtons()
        html += "</div>\n"
        return html
    

    def renderView(self, style):
        """
        Returns an XHTML string for viewing this block
        """        
        log.debug("renderView")
        html  = "\n<!-- Flash with text iDevice -->\n"
        html += "<div class=\"iDevice "
        html += "emphasis"+str(self.idevice.emphasis)+"\">\n"
        html += "<div class=\"flash_text\" style=\""
        html += "width:" + str(self.idevice.flash.width) + "px; "
        html += "float:%s;\">\n" % self.idevice.float
        html += "<div class=\"flash\">\n"
        html += self.flashElement.renderView()
        html += "<br/>" + self.idevice.caption + "</div>"
        html += "</div>\n"
        html += self.textElement.renderView()
        html += "<div style=\"clear:both;\">"
        html += "</div>\n"
        html += "</div><br/>\n"
        return html
    

from exe.engine.flashwithtextidevice import FlashWithTextIdevice
from exe.webui.blockfactory          import g_blockFactory
g_blockFactory.registerBlockType(FlashWithTextBlock, FlashWithTextIdevice)    

# ===========================================================================
