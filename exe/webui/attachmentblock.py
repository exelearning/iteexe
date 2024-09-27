# ===========================================================================
# eXe 
# Copyright 2004-2006, University of Auckland
# Copyright 2006-2007 eXe Project, New Zealand Tertiary Education Commission
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

import os.path
from exe.webui.block   import Block
from exe.webui         import common
from exe.webui.element import TextAreaElement
from exe               import globals as G

import logging
log = logging.getLogger(__name__)


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

        # to compensate for the strange unpickling timing when objects are 
        # loaded from an elp, ensure that proper idevices are set:
        if idevice.descriptionTextArea.idevice is None: 
            idevice.descriptionTextArea.idevice = idevice
        
        self.descriptionElement = TextAreaElement(idevice.descriptionTextArea)


    def process(self, request):
        """
        Process the request arguments from the web server to see if any
        apply to this block
        """
        log.debug("process " + repr(request.args))
        Block.process(self, request)

        if ("action" not in request.args or
            request.args["action"][0] != "delete"):
            if "label" + self.id in request.args:
                self.idevice.label = request.args["label" + self.id][0]
                
            self.descriptionElement.process(request)

            if "path" + self.id in request.args:
                attachmentPath = request.args["path"+self.id][0]

                if attachmentPath:
                    self.idevice.setAttachment(attachmentPath)
                
                if self.idevice.label == "":
                    self.idevice.label = os.path.basename(attachmentPath)


    def renderEdit(self, style):
        """
        Returns an XHTML string with the form elements for editing this block
        """
        log.debug("renderEdit")
        html  = '<div class="iDevice">\n'
        html += '<div class="block">\n'

        label = _('Filename:')
        if self.idevice.userResources:
            label += ': '
            label += '<span style="text-decoration:underline">'
            label += self.idevice.userResources[0].storageName
            label += '</span>\n'
        html += '<div>' 
        this_package = None
        if self.idevice is not None and self.idevice.parentNode is not None:
            this_package = self.idevice.parentNode.package
        html += common.formField('textInput',
                                 this_package,
                                 label,
                                 'path'+self.id, '',
                                 self.idevice.filenameInstruc,
                                 size=40)
        html += '<input type="button" onclick="addFile(\'%s\')"' % self.id
        html += ' value="%s" />\n' % _("Select a file")
        html += '</div><br style="clear:both;" />' 
        html += '</div>\n'
        html += '<div class="block">\n'
        html += '\n<b>%s</b>\n' % _('Label:')
        html += common.elementInstruc(self.idevice.labelInstruc)
        html += '</div>\n'
        html += common.textInput('label'+self.id, self.idevice.label)
        html += self.descriptionElement.renderEdit()
        html += '<div class="block">\n'
        html += self.renderEditButtons()
        html += '</div>\n'
        html += '\n</div>\n'

        return html


    def renderPreview(self, style):
        """
        Returns an XHTML string for previewing this block
        """
        log.debug("renderPreview")
        html  = "<div class=\"iDevice "
        html += "emphasis"+str(self.idevice.emphasis)+"\" "
        html += "ondblclick=\"submitLink('edit',"+self.id+", 0);\">\n"

        if self.idevice.userResources:
            html += "<img src='/images/stock-attach.png'> <a style=\"cursor: pointer;\" "
            html += " onclick=\"browseURL('"
            html += "%s/" % (G.application.exeAppUri)
            html += self.package.name
            html += "/resources/"
            html += self.idevice.userResources[0].storageName
            html += "');\" >"
            html += self.idevice.label
            html += "</a>\n"

        html += '<div class="block">\n'
        html += self.descriptionElement.renderPreview()
        html += "</div>\n"
        html += self.renderViewButtons()
        html += "</div>\n"

        return html
    

    def renderView(self, style):
        """
        Returns an XHTML string for viewing this block
        """        
        log.debug("renderView")
        html  = "<!-- attachment iDevice -->\n"
        html += "<div class=\"iDevice "
        html += "emphasis"+str(self.idevice.emphasis)+"\">\n"

        if self.idevice.userResources:
            html += "<img src='stock-attach.png'> "
            html += "<a href=\"#\" onclick=\"window.open('"
            html += self.idevice.userResources[0].storageName
            html += "', '_blank');\" >"
            html += self.idevice.label
            html += "</a> \n"

        html += '<div class="block">\n'
        html += self.descriptionElement.renderView()
        html += "</div>"
        html += "</div>\n"

        return html
    

from exe.engine.attachmentidevice import AttachmentIdevice
from exe.webui.blockfactory     import g_blockFactory
g_blockFactory.registerBlockType(AttachmentBlock, AttachmentIdevice)    


# ===========================================================================
