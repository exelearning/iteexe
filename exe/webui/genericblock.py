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
GenericBlock can render and process GenericIdevices as XHTML
"""

import logging
from exe.webui.block            import Block
from exe.webui.elementfactory   import g_elementFactory
from exe.webui                  import common

log = logging.getLogger(__name__)


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
        if not hasattr(self.idevice,'undo'): 
            self.idevice.undo = True


    def process(self, request):
        """
        Process the request arguments from the web server
        """
        is_cancel = common.requestHasCancel(request)

        Block.process(self, request)
        if (u"action" not in request.args or
            request.args[u"action"][0] != u"delete"):
            for element in self.elements:
                element.process(request)
                
        if "title"+self.id in request.args \
        and not is_cancel:
            self.idevice.title = request.args["title"+self.id][0]

    def renderEdit(self, style):
        """
        Returns an XHTML string with the form element for editing this block
        """
        html  = u'<div><div class="block">\n'
        html += common.textInput("title"+self.id, self.idevice.title) 
        html += u"</div>\n"
        for element in self.elements:
            html += element.renderEdit() + "<br/>"
        html += self.renderEditButtons()
        html += u"</div>\n"
        return html


    def renderPreview(self, style):
        """
        Returns an XHTML string for previewing this block during editing
        """
        html = common.ideviceHeader(self, style, "preview")
        for element in self.elements:
            html += element.renderPreview()
        html += common.ideviceFooter(self, style, "preview")
        return html

    def renderXML(self, style):
        aTitle = self.idevice.title
        aIcon = self.idevice.icon
        xml = ""
        if len(self.elements) > 0:
            return self.elements[0].renderXML(None, "idevice", self.idevice.id, title=aTitle, icon=aIcon)
        return xml

    
    def renderView(self, style):
        """
        Returns an XHTML string for viewing this block, 
        i.e. when exported as a webpage or SCORM package
        """
        html = common.ideviceHeader(self, style, "view")
        for element in self.elements:
            html += element.renderView()
        html += common.ideviceFooter(self, style, "view")
        return html

from exe.engine.genericidevice import GenericIdevice
from exe.webui.blockfactory    import g_blockFactory
g_blockFactory.registerBlockType(GenericBlock, GenericIdevice)    

# ===========================================================================
