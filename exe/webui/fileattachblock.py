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
            fileElement = FileElement(fileField)
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
        
        if showDesc == True:
            if self.idevice.icon:
                html += u'<img alt="%s" ' % _(u'IDevice Icon')
                html += u'     class="iDevice_icon" '
                html += u"src=\"/style/"+style
                html += u"/icon_"+self.idevice.icon+".gif\"/>\n"
            if self.idevice.emphasis > 0:
                html += u"<span class=\"iDeviceTitle\">"
                html += self.idevice.title
                html += u"</span>\n"
                html += u"<div class=\"iDevice_inner\">\n"
        
        if showDesc == True:
            if previewMode == True:
                html += self.introHTMLElement.renderPreview()
            else:
                html += self.introHTMLElement.renderView()
            
                html += "<ul class='exe_filelist_ul'>"    
        
        prefix = ""
        if previewMode == True:
            prefix = "resources/" 
        
            
        for fileElement in self.fileAttachmentElements:
            if showDesc == False:
                if previewMode == True:
                    html += fileElement.renderPreview()
                else:
                    html += fileElement.renderView()
                
                html += "<br/>"
            else:
                html += "<li class='exe_filelist_content'><a target='_blank' href='%(prefix)s%(filename)s'>%(desc)s</a></li>" % \
                    {"filename" : fileElement.getFileName(), "desc" : fileElement.getDescription(),\
                     "prefix" : prefix}
                
        if showDesc == True:
            html += "</ul>"
        
        
        if previewMode == True:
            html += self.renderViewButtons()
        
        
        if showDesc == True:
            """End decoration"""
            html += u"</div>\n"
        
        return html

    def renderPreview(self, style):
        """
        Returns an XHTML string for previewing this block
        """
        html  = u"<div class=\"iDevice "
        html += u"emphasis"+unicode(self.idevice.emphasis)+"\" "
        html += u"ondblclick=\"submitLink('edit',"+self.id+", 0);\">\n"
        
        html += self._renderMain(style, True)
        
        #end of idevice
        html += "</div>\n"
        
        
        
        
        return html


    def renderView(self, style):
        """
        Returns an XHTML string for viewing this block
        """
        html  = u"<div class=\"iDevice "
        html += u"emphasis"+unicode(self.idevice.emphasis)+"\">\n"
        
        html += self._renderMain(style, False)
        
        html += u"</div>\n"
        return html
    

# ===========================================================================

"""Register this block with the BlockFactory"""
from exe.engine.fileattachidevice import FileAttachIdeviceInc
from exe.webui.blockfactory     import g_blockFactory
g_blockFactory.registerBlockType(FileAttachBlockInc, FileAttachIdeviceInc)    

# ===========================================================================
