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
ImageWithTextBlock can render and process ImageWithTextIdevices as XHTML
"""

import logging
import gettext
from exe.webui.block   import Block
from exe.webui.element import TextAreaElement, ImageElement

log = logging.getLogger(__name__)
_   = gettext.gettext


# ===========================================================================
class ImageWithTextBlock(Block):
    """
    ImageWithTextBlock can render and process ImageWithTextIdevices as XHTML
    """
    def __init__(self, parent, idevice):
        """
        Initialize
        """
        Block.__init__(self, parent, idevice)
        self.imageElement = ImageElement(idevice.image)
        self.textElement  = TextAreaElement(idevice.text)


    def process(self, request):
        """
        Process the request arguments from the web server to see if any
        apply to this block
        """
        log.debug("process " + repr(request.args))
        Block.process(self, request)

        if (u"action" not in request.args or
            request.args[u"action"][0] != u"delete"):
            self.imageElement.process(request)
            self.textElement.process(request)


    def renderEdit(self, style):
        """
        Returns an XHTML string with the form elements for editing this block
        """
        log.debug("renderEdit")
        html  = u"<div class=\"iDevice\">\n"
        html += self.imageElement.renderEdit()
        html += u"<br/>\n"
        html += self.textElement.renderEdit()
        html += self.renderEditButtons()
        html += u"</div>\n"
        return html


    def renderPreview(self, style):
        """
        Returns an XHTML string for previewing this block
        """
        log.debug("renderPreview")
        html  = u"<div class=\"iDevice "
        html += u"emphasis"+unicode(self.idevice.emphasis)+"\" "
        html += "ondblclick=\"submitLink('edit',"+self.id+", 0);\">\n"
        html += u"<div style=\"padding:6px; float:left;\"/>\n" 
        html += self.imageElement.renderPreview()
        html += u"</div>\n"
        html += self.textElement.renderPreview()
        html += u"<div style=\"clear:both;\">"
        html += u"</div>\n"
        html += self.renderViewButtons()
        html += u"</div>\n"
        return html
    

    def renderView(self, style):
        """
        Returns an XHTML string for viewing this block
        """        
        log.debug("renderView")
        html  = u"<div class=\"iDevice "
        html += u"emphasis"+unicode(self.idevice.emphasis)+"\">\n"
        html += u"<div style=\"padding:6px; float:left;\"/>\n" 
        html += self.imageElement.renderView()
        html += u"</div>\n"
        html += self.textElement.renderView()
        html += u"<div style=\"clear:both;\">"
        html += u"</div>\n"
        html += u"</div>\n"
        return html
    

# ===========================================================================
