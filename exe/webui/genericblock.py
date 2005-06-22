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
GenericBlock can render and process GenericIdevices as XHTML
"""

import logging
import gettext
from exe.webui.block            import Block
from exe.webui.elementfactory   import g_elementFactory

log = logging.getLogger(__name__)
_   = gettext.gettext


# ===========================================================================
class GenericBlock(Block):
    """
    GenericBlock can render and process GenericIdevices as XHTML
    """
    def __init__(self, parent, idevice):
        Block.__init__(self, parent, idevice)
        self.elements = []
        for field in self.idevice:
            self.elements.append(g_elementFactory.createElement(field))


    def process(self, request):
        """
        Process the request arguments from the web server
        """
        Block.process(self, request)
        if (u"action" not in request.args or
            request.args[u"action"][0] != u"delete"):
            for element in self.elements:
                element.process(request)


    def renderEdit(self, style):
        """
        Returns an XHTML string with the form element for editing this block
        """
        html  = "<div>\n"
        for element in self.elements:
            html += element.renderEdit()

        html += self.renderEditButtons()
        html += "</div>\n"
        return html


    def renderPreview(self, style):
        """
        Returns an XHTML string for previewing this block during editing
        """
        html  = u'<div class="iDevice" '
        html += u'ondblclick="submitLink(\'edit\', %s, 0);">\n' % self.id
        if self.idevice.icon:
            html += u"<img class=\"iDevice_icon\" "
            html += u"src=\"/style/"+style+"/"+self.idevice.icon+".gif\"/>\n"
        html += u"<span class=\"iDeviceTitle\">"
        html += self.idevice.title
        html += u"</span>\n"
        html += u"<div class=\"iDevice_inner\">\n"
        for element in self.elements:
            html += element.renderPreview()
            html += u"<br/>\n"
        html += self.renderViewButtons()
        html += u"</div>\n"
        html += u"</div>\n"
        return html

    
    def renderView(self, style):
        """
        Returns an XHTML string for viewing this block, 
        i.e. when exported as a webpage or SCORM package
        """
        html  = u'<div class="iDevice">\n'
        if self.idevice.icon:
            html += u"<img class=\"iDevice_icon\" "
            html += u"src=\""+self.idevice.icon+".gif\"/>\n"
        html += u"<span class=\"iDeviceTitle\">"
        html += self.idevice.title
        html += u"</span>\n"
        html += u"<div class=\"iDevice_inner\">\n"
        for element in self.elements:
            html += element.renderView()
            html += u"<br/>\n"
        html += u"</div>\n"
        html += u"</div>\n"
        return html

# ===========================================================================
