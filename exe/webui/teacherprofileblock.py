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
TeacherProfileBlock can render and process TeacherProfileIdevices as XHTML
"""

import logging
import gettext
from exe.webui.block   import Block
from exe.webui         import common
from exe.webui.element import TextAreaElement, ImageElement

log = logging.getLogger(__name__)
_   = gettext.gettext


# ===========================================================================
class TeacherProfileBlock(Block):
    """
    TeacherProfileBlock can render and process TeacherProfileIdevices as XHTML
    """
    def __init__(self, parent, idevice):
        Block.__init__(self, parent, idevice)
        self.photoElement   = ImageElement(idevice.photo)
        self.profileElement = TextAreaElement(idevice.profile)


    def process(self, request):
        """
        Process the request arguments from the web server to see if any
        apply to this block
        """
        log.debug("process " + repr(request.args))
        Block.process(self, request)
        self.photoElement.process(request)
        self.profileElement.process(request)


    def renderEdit(self, style):
        """
        Returns an XHTML string with the form elements for editing this block
        """
        html  = u"<div class=\"iDevice\">\n"
        html += u"<b>"+_(u"Teacher Profile")+u"</b><br/>\n"
        html += self.photoElement.renderEdit()
        html += u"<br/>\n"
        html += self.profileElement.renderEdit()
        html += self.renderEditButtons()
        html += u"</div>\n"
        return html


    def renderPreview(self, style):
        """
        Returns an XHTML string for previewing this block
        """
        html  = u"<div class=\"iDevice\" "
        html += "ondblclick=\"submitLink('edit',"+self.id+", 0);\">\n"
        html += u"<div style=\"padding:6px; float:left;\"/>\n" 
        html += self.photoElement.renderPreview()
        html += u"</div>\n"
        html += self.profileElement.renderPreview()
        html += u"<div style=\"clear:both;\">"
        html += u"</div>\n"
        html += u"</div>\n"
        return html
    

    def renderView(self, style):
        """
        Returns an XHTML string for viewing this block
        """        
        html  = u"<div class=\"iDevice\">\n"
        html += u"<div style=\"padding:6px; float:left;\"/>\n" 
        html += self.photoElement.renderView()
        html += u"</div>\n"
        html += self.profileElement.renderView()
        html += u"<div style=\"clear:both;\">"
        html += u"</div>\n"
        html += u"</div>\n"
        return html
    

# ===========================================================================
