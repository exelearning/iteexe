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
from exe.webui.block            import Block
from exe.webui                  import common

log = logging.getLogger(__name__)
_   = gettext.gettext


# ===========================================================================
class TeacherProfileBlock(Block):
    """
    TeacherProfileBlock can render and process TeacherProfileIdevices as XHTML
    """
    def __init__(self, idevice):
        Block.__init__(self, idevice)
        self.contentId = "content" + self.id
        self.imageId   = "image" + self.id

    def process(self, request):
        """
        Process the request arguments from the web server to see if any
        apply to this block
        """
        Block.process(self, request)
        log.info("process " + repr(request.args))
        if self.contentId in request.args:
            self.idevice.content = request.args[self.contentId][0]
        
        if self.imageId in request.args and request.args[self.imageId][0] != "":
            self.idevice.imageFile = request.args[self.imageId][0]


    def renderEdit(self, dummy):
        """
        Returns an XHTML string with the form element for editing this block
        """
        content = self.idevice.content
        content = content.replace("\r", "")
        content = content.replace("\n","\\n")
        content = content.replace("'","\\'")

        html  = "<div class=\"iDevice\">\n"
        html += "<b>%s</b><br/><br/>\n" % _("Teacher Profile")
        html += "<input id=\"fileBrowser\" "
        html += "type=\"file\" name =\"%s\"/>" % self.imageId
        html += " %s<br/><br/>\n " % _("Select a picture")
        html += common.richTextArea(self.contentId, content)+ "<br/>"
        html += self.renderEditButtons()
        html += "</div>\n"
        return html


    def renderView(self, dummy):
        """
        Returns an XHTML string for viewing this block
        """        
        html  = "<div class=\"teacherProfile\">\n"
        html += "<img src=\"/images/%s\" " % self.idevice.imageFile
        html += "style=\"padding:6px; float:left;\"/>\n" 
        html += self.idevice.content 
        html += "<div style=\"clear:both; \">"
        html += "</div></div>\n"
        return html
    

    def renderPreview(self, dummy):
        """
        Returns an XHTML string for previewing this block
        """
        html  = "<div "
        html += "ondblclick=\"submitLink('edit',"+self.id+", 0);\">\n"
        html += "<img src=\"/images/%s\" " % self.idevice.imageFile
        html += "style=\"padding:6px; float:left;\"/>\n" 
        html += self.idevice.content 
        html += "<div style=\"clear:both; \">"
        html += self.renderViewButtons()
        html += "</div></div>\n"
        return html

# ===========================================================================
