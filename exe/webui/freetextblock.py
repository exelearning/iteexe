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
FreeTextBlock can render and process FreeTextIdevices as XHTML
"""

import logging
import gettext
from exe.webui.block            import Block
from exe.engine.freetextidevice import FreeTextIdevice
from exe.webui.element          import TextAreaElement

log = logging.getLogger(__name__)
_   = gettext.gettext


# ===========================================================================
class FreeTextBlock(Block):
    """
    FreeTextBlock can render and process FreeTextIdevices as XHTML

    YES it's a cut and paste from SimpleBlock, GenericBlock will 
    replace them both..... one day
    """
    def __init__(self, idevice):
        Block.__init__(self, idevice)
        self.contentField = TextAreaElement("content", "freetext", self.id, 
_("""This is a free text field general learning content can be entered."""))


    def process(self, request):
        """
        Process the request arguments from the web server to see if any
        apply to this block
        """
        Block.process(self, request)
        content = self.contentField.process(request)
        if content:
            self.idevice.content = content


    def renderEdit(self, dummy):
        """
        Returns an XHTML string with the form element for editing this block
        """
        html  = "<div>\n"
        html += self.contentField.renderEdit(self.idevice.content, height=200)
        html += self.renderEditButtons()
        html += "</div>\n"
        return html


    def renderView(self, dummy):
        """
        Returns an XHTML string for viewing this block
        """
        html  = "<div>\n"
        html += self.contentField.renderView(self.idevice.content)
        html += "</div>\n"
        return html
    

    def renderPreview(self, dummy):
        """
        Returns an XHTML string for previewing this block
        """
        html  = "<div "
        html += "ondblclick=\"submitLink('edit',"+self.id+", 0);\">\n"
        html += self.contentField.renderView(self.idevice.content)
        html += self.renderViewButtons()
        html += "</div>\n"
        return html

# ===========================================================================
