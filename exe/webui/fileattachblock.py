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
FileAttachBlockInc will render the File Attachments Idevice

"""

import logging
from exe.webui.block            import Block
from exe.webui.element          import TextAreaElement
from exe.engine.extendedfieldengine        import *
log = logging.getLogger(__name__)


# ===========================================================================
#
# File Attach Block renders associated Idevice allows the user to attach multiple
# files as required
#
class FileAttachBlockInc(Block):
    """
    ExampleBlock can render and process ExampleIdevices as XHTML
    GenericBlock will replace it..... one day
    """
    def __init__(self, parent, idevice):
        Block.__init__(self, parent, idevice)
        self.fileAttachmentElements = []
        for fileField in self.idevice.fileAttachmentFields:
            fileElement = FileElement(fileField, False)
            self.fileAttachmentElements.append(fileElement)
        
        self.showDescBlock = ChoiceElement(idevice.showDesc)
        self.introHTMLElement = TextAreaElement(idevice.introHTML)
        

    def process(self, request):
        """
        Process the request arguments from the web server to see if any
        apply to this block
        """
        Block.process(self, request)
        is_cancel = common.requestHasCancel(request)
        
        self.showDescBlock.process(request)
        self.introHTMLElement.process(request)
        
        showDesc = False
        if self.showDescBlock.renderView() == "yes":
            showDesc = True
        
        if showDesc == True:
            self.idevice.emphasis = Idevice.SomeEmphasis
        else:
            self.idevice.emphasis = Idevice.NoEmphasis
        
        for fileElement in self.fileAttachmentElements:
            fileElement.process(request)
            if field_engine_is_delete(fileElement, request, self.idevice.fileAttachmentFields):
                #fileElement.field.deleteFile()
                field_engine_check_delete(fileElement, request, self.idevice.fileAttachmentFields)
            
        if "addFileAttachment" + unicode(self.id) in request.args:
            self.idevice.addFileAttachmentField()            
            self.idevice.edit = True
            self.idevice.undo = False
            
        #check the title - lifted from genericblock
        if "title"+self.id in request.args \
        and not is_cancel:
            self.idevice.title = request.args["title"+self.id][0]

    def renderEdit(self, style):
        """
        Returns an XHTML string with the form element for editing this block
        """
        html  = _(u"<div>\n")
        html += _("<h2>File Attachment</h2>")
        html += _("<p>Here you can attach arbitary files to the package that will be included with the export</p>")
        html += _("<p>You can choose to display links or not below</p>")
        
        html += _("<strong>Title:</strong><br/>")
        html += common.textInput("title"+self.id, self.idevice.title)
        html += "<br/>"
        html += self.showDescBlock.renderEdit()
        html += self.introHTMLElement.renderEdit()
        
        
        for fileElement in self.fileAttachmentElements:
            html += fileElement.renderEdit()
            html += "<hr/>"
        
        html += "<br/>"    
        html += common.submitButton("addFileAttachment"+unicode(self.id), _("Add Another File Attachment"))
        html += "<br/>"
        html += self.renderEditButtons()
        html += u"</div>\n"
        return html


    def _renderMain(self, style, previewMode = False):
        """Decoration """
        showDesc = False
        if self.showDescBlock.renderView() == "yes":
            showDesc = True
        
        html = u""
        viewMode = "view"
        if previewMode == True:
            viewMode = "preview"
            
        if viewMode=="view" and showDesc==False:
            return ""
        
        html = common.ideviceHeader(self, style, viewMode)
        
        if showDesc == True:
            if previewMode == True:
                html += self.introHTMLElement.renderPreview()
            else:
                html += self.introHTMLElement.renderView()
            
            html += "<ul class='exeFileList'>"    
        
        prefix = ""
        if previewMode == True:
            prefix = "resources/" 
        

        if showDesc == False and previewMode == True:
            html += "<p><strong> " + _("File List (this list shows only in preview mode):") + "</strong></p>"
        
                    
        for fileElement in self.fileAttachmentElements:
            if showDesc == False:
                if previewMode == True:
                    html += fileElement.renderPreview()
                else:
                    html += fileElement.renderView()
            else:
                html += "<li><a href='%(prefix)s%(filename)s' target='_blank'>%(desc)s" % \
                    {"filename" : fileElement.getFileName(), "desc" : fileElement.getDescription(),\
                     "prefix" : prefix}
                html += "<span> (" + c_('New Window')+")</span></a></li>\n"
                
        if showDesc == True:
            html += "</ul>"
        
        
        html += common.ideviceFooter(self, style, viewMode)
        
        return html

    def renderPreview(self, style):
        """
        Returns an XHTML string for previewing this block
        """
        
        html = self._renderMain(style, True)
        
        #end of idevice
        
        
        
        
        return html


    def renderView(self, style):
        """
        Returns an XHTML string for viewing this block
        """
        html = self._renderMain(style, False)
        
        
        return html
    

# ===========================================================================

"""Register this block with the BlockFactory"""
from exe.engine.fileattachidevice import FileAttachIdeviceInc
from exe.webui.blockfactory     import g_blockFactory
g_blockFactory.registerBlockType(FileAttachBlockInc, FileAttachIdeviceInc)    

# ===========================================================================
