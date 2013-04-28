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
MultimediaBlock can render and process MultimediaIdevices as XHTML
"""

import logging
from exe.webui.block    import Block
from exe.webui.element  import TextAreaElement, MultimediaElement
from exe.webui          import common
from exe.engine.idevice import Idevice

log = logging.getLogger(__name__)


# ===========================================================================
class MultimediaBlock(Block):
    """
    ImageWithTextBlock can render and process ImageWithTextIdevices as XHTML
    """

    name = 'MultimediaWithText'

    def __init__(self, parent, idevice):
        """
        Initialize
        """
        Block.__init__(self, parent, idevice)
        self.mediaElement = MultimediaElement(idevice.media)

        # to compensate for the strange unpickling timing when objects are 
        # loaded from an elp, ensure that proper idevices are set:
        # (only applies to the image-embeddable ones, not MultimediaElement)
        if idevice.text.idevice is None: 
            idevice.text.idevice = idevice
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
            self.mediaElement.process(request)
            self.textElement.process(request)

        if 'emphasis'+self.id in request.args:
            self.idevice.emphasis = int(request.args['emphasis'+self.id][0])
            
        if "float"+self.id in request.args:
            self.idevice.float = request.args["float"+self.id][0]
            
        if "title"+self.id in request.args:
            self.idevice.title = request.args["title"+self.id][0]
      
    def renderEdit(self, style):
        """
        Returns an XHTML string with the form elements for editing this block
        """
        log.debug("renderEdit")
        html  = u"<div class=\"iDevice\">\n"
        html += common.textInput("title"+self.id, self.idevice.title) + '<br/><br/>'
        html += self.mediaElement.renderEdit()       
        floatArr    = [[_(u'Left'), 'left'],
                      [_(u'Right'), 'right'],
                      [_(u'None'),  'none']]

        this_package = None
        if self.idevice is not None and self.idevice.parentNode is not None:
            this_package = self.idevice.parentNode.package
        html += common.formField('select', this_package, _("Align:"),
                                 "float" + self.id, '',
                                 self.idevice.alignInstruc,
                                 floatArr, self.idevice.float)
        #html += u'<div class="block">' #<b>%s</b></div>' % _(u"Caption:")
        #html += common.textInput("caption" + self.id, self.idevice.media.caption)
        #html += common.elementInstruc(self.idevice.media.captionInstruc)
        html += "<br/>" + self.textElement.renderEdit()
        emphasisValues = [(_(u"No emphasis"),     Idevice.NoEmphasis),
                          (_(u"Some emphasis"),   Idevice.SomeEmphasis)]

        html += common.formField('select', this_package, _('Emphasis'),
                                 'emphasis', self.id, 
                                 '', # TODO: Instructions
                                 emphasisValues,
                                 self.idevice.emphasis)
        html += self.renderEditButtons()
        html += u"</div>\n"
        return html


    def renderPreview(self, style):
        """
        Returns an XHTML string for previewing this block
        """
        log.debug("renderPreview")
        html = common.ideviceHeader(self, style, "preview")
        html += u"<div class=\"media\">"
        html += self.mediaElement.renderPreview()
        html += "</div>"
        html += self.textElement.renderPreview()
        html += common.ideviceFooter(self, style, "preview")        
        return html
    

    def renderView(self, style):
        """
        Returns an XHTML string for viewing this block
        """        
        log.debug("renderView")
        html = common.ideviceHeader(self, style, "view")
        html += u"<div class=\"media\">"
        html += self.mediaElement.renderView()
        html += "</div>"
        html += self.textElement.renderView()
        html += common.ideviceFooter(self, style, "view")
        return html
    

from exe.engine.multimediaidevice import MultimediaIdevice
from exe.webui.blockfactory       import g_blockFactory
g_blockFactory.registerBlockType(MultimediaBlock, MultimediaIdevice)    


# ===========================================================================
