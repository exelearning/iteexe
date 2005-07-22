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
from exe.webui                  import common

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
                
        if "title"+self.id in request.args:
            self.idevice.title = request.args["title"+self.id][0]


    def renderEdit(self, style):
        """
        Returns an XHTML string with the form element for editing this block
        """
        html  = "<div><br/>\n"
        html += common.textInput("title"+self.id, self.idevice.title) 
        html += u"<br/><br/>\n"
        for element in self.elements:
            html += element.renderEdit() + "<br/>"
        html += "<br/>"
        html += self.renderEditButtons()
        html += "</div>\n"
        return html


    def renderPreview(self, style):
        """
        Returns an XHTML string for previewing this block during editing
        """
        html  = u"<div class=\"iDevice "
        html += u"emphasis"+unicode(self.idevice.emphasis)+"\" "
        html += u"ondblclick=\"submitLink('edit', "+self.id+", 0);\">\n"
        if self.idevice.icon:
            html += u'<img alt="" class="iDevice_icon" '
            html += u"src=\"/style/"+style+"/icon_"+self.idevice.icon+".gif\"/>\n"
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
        html  = u"<div class=\"iDevice "
        html += u"emphasis"+unicode(self.idevice.emphasis)+"\">\n"
        if self.idevice.icon:
            html += u'<img alt="" class="iDevice_icon" '
            html += u"src=\"icon_"+self.idevice.icon+".gif\"/>\n"
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
