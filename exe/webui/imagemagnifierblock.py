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
ImageMagnifierBlock can render and process ImageMagnifierIdevices as XHTML
"""

import logging
from exe.webui.block   import Block
from exe.webui.element import TextAreaElement, MagnifierElement
from exe.webui         import common

log = logging.getLogger(__name__)


# ===========================================================================
class ImageMagnifierBlock(Block):
    """
    ImageMagnifierBlock can render and process ImageMagnifierIdevices as XHTML
    """

    name = 'imageManifier'

    def __init__(self, parent, idevice):
        """
        Initialize
        """
        Block.__init__(self, parent, idevice)
        self.imageMagnifierElement = MagnifierElement(idevice.imageMagnifier)

        # to compensate for the strange unpickling timing when objects are 
        # loaded from an elp, ensure that proper idevices are set:
        # (only applies to the image-embeddable ones, not MagnifierElement)
        if idevice.text.idevice is None: 
            idevice.text.idevice = idevice
        self.textElement  = TextAreaElement(idevice.text)

        if not hasattr(self.idevice,'undo'): 
            self.idevice.undo = True


    def process(self, request):
        """
        Process the request arguments from the web server to see if any
        apply to this block
        """
        log.debug("process " + repr(request.args))
        Block.process(self, request)

        is_cancel = common.requestHasCancel(request)

        if (u"action" not in request.args 
            or (request.args[u"action"][0] != u"delete"
                and not is_cancel)):
            self.imageMagnifierElement.process(request)
            self.textElement.process(request)

        if "action" in request.args and request.args["action"][0] == "done":
            # remove the undo flag in order to reenable it next time:
            if hasattr(self.idevice,'undo'): 
                del self.idevice.undo

        if "float"+self.id in request.args \
        and not is_cancel:
            self.idevice.float = request.args["float"+self.id][0]
            
        if "caption"+self.id in request.args \
        and not is_cancel:
            self.idevice.caption = request.args["caption"+self.id][0]
            
        if "glass"+self.id in request.args \
        and not is_cancel:
            self.idevice.imageMagnifier.glassSize = \
                request.args["glass"+self.id][0]
            
        if "initial"+self.id in request.args \
        and not is_cancel:
            self.idevice.imageMagnifier.initialZSize = \
                request.args["initial"+self.id][0]
                
        if "maxZoom"+self.id in request.args \
        and not is_cancel:
            self.idevice.imageMagnifier.maxZSize = \
                request.args["maxZoom"+self.id][0]


    def renderEdit(self, style):
        """
        Returns an XHTML string with the form elements for editing this block
        """
        log.debug("renderEdit")
        floatArr        = [[_(u'Left'), 'left'],
                          [_(u'Right'), 'right'],
                          [_(u'None'),  'none']]
        html  = u"<div class=\"iDevice\">\n"
        
        # Caption
        html += '<div class="block">'
        html += u"<strong>%s</strong>" % _(u"Caption:")
        html += common.elementInstruc(self.idevice.captionInstruc)
        html += '</div>'
        html += '<div class="block">'
        html += common.textInput("caption" + self.id, self.idevice.caption)
        html += '</div>'
        
        # Text
        html += '<div class="block">'
        html += self.textElement.renderEdit()
        html += '</div>'

        # Image
        html += self.imageMagnifierElement.renderEdit()       

        this_package = None
        if self.idevice is not None and self.idevice.parentNode is not None:
            this_package = self.idevice.parentNode.package

        # Align
        html += common.formField('select', this_package, _("Align:"),
                                 "float" + self.id, '',
                                 self.idevice.alignInstruc,
                                 floatArr, self.idevice.float)

        # Initial and Max Zoom opts
        zoomOpts = []
        for i in range(100, 201, 10):
            zoomOpts.append(('%d%%' % (i), str(i)))

        # Initial Zoom Size
        selection = self.idevice.imageMagnifier.initialZSize
        html += common.formField('select', this_package, _(u"Initial Zoom"),
                                 "initial" + self.id, '',
                                 self.idevice.initialZoomInstruc,
                                 zoomOpts, selection)
            
        # Maximum Zoom
        selection = self.idevice.imageMagnifier.maxZSize
        html += common.formField('select', this_package, _(u"Maximum zoom"),
                                 "maxZoom" + self.id, '',
                                 self.idevice.maxZoomInstruc,
                                 zoomOpts, selection)
            
        # Size of Magnifying Glass
        glassSizeArr    = [[_(u'Small'), '1'],
                          [_(u'Medium'),'2'],
                          [_(u'Large'),'3'],
                          [_(u'Extra large'),'4'],]
        html += common.formField('select', this_package, 
                                 _(u"Size of magnifying glass: "),
                                 "glass" + self.id, '',
                                 self.idevice.glassSizeInstruc,
                                 glassSizeArr, 
                                 self.idevice.imageMagnifier.glassSize)
 
        html += self.renderEditButtons(undo=self.idevice.undo)
        html += u"</div>\n"
        return html

    def renderPreview(self, style):
        """
        Returns an XHTML string for previewing this block
        """

        lb = "\n" #Line breaks
        dT = common.getExportDocType()
        figureTag = "div"
        if dT == "HTML5":
            figureTag = "figure"         
        
        html = common.ideviceHeader(self, style, "preview")
        
        html += '<div class="iDevice_content">'+lb
        html += '<'+figureTag+' class="image_text" style="width:'+str(self.idevice.imageMagnifier.width)+'px;float:'+self.idevice.float+';'
        if self.idevice.float == 'left':
            html += 'margin:0 20px 20px 0'
        if self.idevice.float == 'right':
            html += 'margin:0 0 20px 20px'
        html += '">'+lb
        html += self.imageMagnifierElement.renderPreview()
        if self.idevice.caption != '':
            html = html.replace(' alt="" ',' alt="'+self.idevice.caption.replace('"','&quot;')+'" ', 1)
            if dT == "HTML5":
                html += '<figcaption style="font-weight:bold">'+self.idevice.caption+'</figcaption>'+lb
            else:
                html += '<strong>'+self.idevice.caption+'</strong>'+lb
        html += '</'+figureTag+'>'+lb 
        text = self.textElement.renderPreview()
        if text:
            text = text.replace('"block iDevice_content"', '"iDevice_text"', 1)
            html += text
        else:
            html += '&nbsp;'
        html += '</div>'+lb # /.iDevice_content
        
        html += common.ideviceFooter(self, style, "preview")

        return html
    

    def renderView(self, style):
        """
        Returns an XHTML string for viewing this block
        """     

        lb = "\n" #Line breaks
        dT = common.getExportDocType()
        figureTag = "div"
        if dT == "HTML5":
            figureTag = "figure"        
        
        html = common.ideviceHeader(self, style, "view")
        
        html += '<div class="iDevice_content">'+lb
        html += '<'+figureTag+' class="image_text" style="width:'+str(self.idevice.imageMagnifier.width)+'px;float:'+self.idevice.float+';'
        if self.idevice.float == 'left':
            html += 'margin:0 20px 20px 0'
        if self.idevice.float == 'right':
            html += 'margin:0 0 20px 20px'
        html += '">'  
        html += lb
        html += self.imageMagnifierElement.renderView()
        if self.idevice.caption != '':
            html = html.replace(' alt="" ',' alt="'+self.idevice.caption.replace('"','&quot;')+'" ', 1)
            if dT == "HTML5":
                html += '<figcaption style="font-weight:bold">'+self.idevice.caption+'</figcaption>'+lb
            else:
                html += '<strong>'+self.idevice.caption+'</strong>'+lb
        html += '</'+figureTag+'>'+lb 
        text = self.textElement.renderView()
        if text:
            text = text.replace('"block iDevice_content"', '"iDevice_text"', 1)
            html += text
        else:
            html += '&nbsp;'
        html += '</div>'+lb # /.iDevice_content
        
        html += common.ideviceFooter(self, style, "view")

        return html

from exe.engine.imagemagnifieridevice import ImageMagnifierIdevice
from exe.webui.blockfactory           import g_blockFactory
g_blockFactory.registerBlockType(ImageMagnifierBlock, ImageMagnifierIdevice)    

# ===========================================================================
