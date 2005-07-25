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
from exe.webui         import common

log = logging.getLogger(__name__)
_   = gettext.gettext


# ===========================================================================
class ImageWithTextBlock(Block):
    """
    ImageWithTextBlock can render and process ImageWithTextIdevices as XHTML
    """

    name = 'imageWithText'

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
            
        if "float"+self.id in request.args:
            self.idevice.float = request.args["float"+self.id][0]
            
        if "caption"+self.id in request.args:
            self.idevice.caption = request.args["caption"+self.id][0]


    def renderEdit(self, style):
        """
        Returns an XHTML string with the form elements for editing this block
        """
        log.debug("renderEdit")
        html  = u"<div class=\"iDevice\">\n"
        html += u"<p>"
        html += self.imageElement.renderEdit()       
        html += u"<b>%s</b>\n " % _("Float:")
        floatArr    = [[_(u'Left'), 'left'],
                      [_(u'Right'), 'right'],
                      [_(u'None'),  'none']]
        html += common.select("float"+self.id, 
                              floatArr, selection=self.idevice.float)
        html += u"</p>\n"
        html += u"<b>%s </b>" % _(u"Caption:")
        html += common.textInput("caption" + self.id, self.idevice.caption)
        html += "<br/>" + self.textElement.renderEdit()
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
        html += u"<div class=\"image_text\" style=\""
	html += u"width:" + str(self.idevice.image.width) + "px; "
        html += u"float:%s;\">\n" % self.idevice.float
        html += u"<div class=\"image\">\n"
        html += self.imageElement.renderPreview()
        html += u"" + self.idevice.caption + "</div>"
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
        html += u"<div class=\"image_text\" style=\""
        html += u"width:" + str(self.idevice.image.width) + "px; "
        html += u"float:%s;\">\n" % self.idevice.float
        html += u"<div class=\"image\">\n"
        html += self.imageElement.renderView()
        html += u"<br/>" + self.idevice.caption + "</div>"
        html += u"</div>\n"
        html += self.textElement.renderView()
        html += u"<div style=\"clear:both;\">"
        html += u"</div>\n"
        html += u"</div>\n"
        return html
    

# ===========================================================================
