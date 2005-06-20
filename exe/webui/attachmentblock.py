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
AttachmentBlock can render and process AttachmentIdevices as XHTML
"""

import logging
import gettext
from exe.webui.block   import Block
from exe.webui         import common

log = logging.getLogger(__name__)
_   = gettext.gettext


# ===========================================================================
class AttachmentBlock(Block):
    """
    AttachmentBlock can render and process AttachmentIdevices as XHTML
    """
    def __init__(self, parent, idevice):
        """
        Initialize
        """
        Block.__init__(self, parent, idevice)


    def process(self, request):
        """
        Process the request arguments from the web server to see if any
        apply to this block
        """
        log.debug("process " + repr(request.args))
        Block.process(self, request)

        if (u"action" in request.args and
            request.args[u"action"][0] == u"addFile"+self.id):
            self.idevice.setAttachment(request.args[u"object"][0])


    def renderEdit(self, style):
        """
        Returns an XHTML string with the form elements for editing this block
        """
        log.debug("renderEdit")
        html  = u"<div class=\"iDevice\">\n"
        html += u"<u>"+self.idevice.filename+u"</u>\n"
        html += u"<br/>\n"
        html += u"<a href=\"#\" onclick=\"addFile('"+self.id+"');\">"
        html += _(u"Select a file")
        html += u"</a> <br/> \n"
        html += self.renderEditButtons()
        html += u"</div>\n"
        return html


    def renderPreview(self, style):
        """
        Returns an XHTML string for previewing this block
        """
        log.debug("renderPreview")
        html  = u"<div class=\"iDevice\" "
        html += u"ondblclick=\"submitLink('edit',"+self.id+", 0);\">\n"
        html += u"<a href=\"resources/"+self.idevice.filename+"\" "
        html += u"target=\"ANewWindow\" >"
        html += self.idevice.filename
        html += u"</a> <br/> \n"
        html += self.renderViewButtons()
        html += u"</div>\n"
        return html
    

    def renderView(self, style):
        """
        Returns an XHTML string for viewing this block
        """        
        log.debug("renderView")
        html  = u"<div class=\"iDevice\">\n"
        html += u"<a href=\""+self.idevice.filename+"\" "
        html += u"target=\"ANewWindow\" >"
        html += self.idevice.filename
        html += u"</a> <br/> \n"
        html += u"</div>\n"
        return html
    

# ===========================================================================
