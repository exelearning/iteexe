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
ExternalUrlBlock can render and process ExternalUrlIdevices as XHTML
"""

import logging
from exe.webui.block            import Block
from exe.webui                  import common

log = logging.getLogger(__name__)


# ===========================================================================
class ExternalUrlBlock(Block):
    """
    ExternalUrlBlock can render and process ExternalUrlIdevices as XHTML
    GenericBlock will replace it..... one day
    """
    def __init__(self, parent, idevice):
        Block.__init__(self, parent, idevice)


    def process(self, request):
        """
        Process the request arguments from the web server to see if any
        apply to this block
        """
        Block.process(self, request)
        if "url"+self.id in request.args:
            self.idevice.url = request.args["url"+self.id][0]
            if (not self.idevice.url.startswith("http://") and 
                not self.idevice.url.startswith("https://")):
                self.idevice.url = "http://" + self.idevice.url

        if "height"+self.id in request.args:
            self.idevice.height = request.args["height"+self.id][0]

    def renderEdit(self, style):
        """
        Returns an XHTML string with the form element for editing this block
        """
        html  = u"<div>\n"
        html += _(u"<strong>url:</strong> ")
        html += common.textInput("url"+self.id, self.idevice.url) 
        heightArr = [['small', '200'],
                    ['medium', '300'],
                    ['large', '500'],
                    ['super-size', '800']]
        html += _(u"<strong>Frame Height:</strong> ")
        html += common.select("height"+self.id, heightArr, "", 
                              self.idevice.height)
        html += u"<p>"       
        html += self.renderEditButtons()
        html += u"</p></div>\n"
        return html


    def renderViewContent(self):
        """
        Returns an XHTML string for previewing this block
        """
        html = u"<iframe src=\""+self.idevice.url+"\"\n"
        html += u"width=\"100%\""
        html += u" height=\""+self.idevice.height+"px\"></iframe>\n" 
        return html


from exe.engine.externalurlidevice import ExternalUrlIdevice
from exe.webui.blockfactory     import g_blockFactory
g_blockFactory.registerBlockType(ExternalUrlBlock, ExternalUrlIdevice)    

# ===========================================================================
