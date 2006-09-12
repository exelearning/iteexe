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
AppletBlock can render and process AppletIdevices as XHTML
"""

import os.path
from exe.webui.block   import Block
from exe.webui         import common

import logging
log = logging.getLogger(__name__)


# ===========================================================================
class AppletBlock(Block):
    """
    AttachmentBlock can render and process AttachmentIdevices as XHTML
    """
    def __init__(self, parent, idevice):
        """
        Initialize
        """
        Block.__init__(self, parent, idevice)


    def process(self, request):
        """
        Process the request arguments from the web server to see if any
        apply to this block
        """
        log.debug("process " + repr(request.args))
        Block.process(self, request)
      
           
        if "code" + self.id in request.args:
            self.idevice.appletCode = (request.args["code" + self.id][0])
          
                    
        if "action" in request.args and request.args["action"][0] == self.id:
            self.idevice.deleteFile(request.args["object"][0])
            self.idevice.edit = True
            
        if "upload" + self.id in request.args:
            if "path" + self.id in request.args:
                filePath = request.args["path"+self.id][0]
                if filePath:
                    self.idevice.uploadFile(filePath)                     
            self.idevice.edit = True    



    def renderEdit(self, style):
        """
        Returns an XHTML string with the form elements for editing this block
        """
        log.debug("renderEdit")

        html  = "<div class=\"iDevice\"><br/>\n"
        html += common.textInput("title"+self.id, self.idevice.title)
        html += u"<br/><br/>\n"
        html += common.textInput("path"+self.id, "", 50)
        html += u'<input type="button" onclick="addFile(\'%s\')"' % self.id
        html += u'value="%s" />\n' % _(u"Add files")
        html += u'<input type="submit" name="%s" value="%s"' % ("upload"+self.id,
                                                                _(u"Upload"))
        html += common.elementInstruc(self.idevice.fileInstruc)
        html += u'<br/>\n'

        html += u'<b>%s</b>\n' % _(u'Applet Code:')
        html += common.elementInstruc(self.idevice.codeInstruc)
        html += u'<br/>\n'

        html += common.textArea('code'+self.id,
                                    self.idevice.appletCode)

        if self.idevice.userResources:
            html += '<table>'
            for resource in self.idevice.userResources:
                html += '<tr><td>%s</td><td>' % resource.storageName
                html += common.submitImage(self.id, resource.storageName,
                                           "/images/stock-cancel.png",
                                           _("Delete File"))
                html += '</td></tr>\n'
            html += '</table>'
           
        html += u'<br/>\n'
        html += self.renderEditButtons()
        html += u'\n</div>\n'

        return html


    def renderPreview(self, style):
        """
        Returns an XHTML string for previewing this block
        """
        log.debug("renderPreview")
        appletcode = self.idevice.appletCode
        appletcode = appletcode.replace('&gt;', '>')
        appletcode = appletcode.replace('&lt;', '<')
        appletcode = appletcode.replace('&quot;', '"')
        appletcode = appletcode.replace('&nbsp;', '')
        appletcode = appletcode.replace('<applet','<applet CODEBASE="resources"')
        appletcode = appletcode.replace('<APPLET','<applet CODEBASE="resources"')
        
        html  = u"<div class=\"iDevice "
        html += u"emphasis"+unicode(self.idevice.emphasis)+"\" "
        html += u"ondblclick=\"submitLink('edit',"+self.id+", 0);\">\n"
        html += appletcode
        html += self.renderViewButtons()
        html += u"</div>\n"

        return html
    

    def renderView(self, style):
        """
        Returns an XHTML string for viewing this block
        """        
        log.debug("renderView")
        html  = u"<!-- applet iDevice -->\n"
        html += u"<div class=\"iDevice\> "
        html += u"emphasis"+unicode(self.idevice.emphasis)+"\">\n"

        appletcode = self.idevice.appletCode
        appletcode = appletcode.replace('&gt;', '>')
        appletcode = appletcode.replace('&lt;', '<')
        appletcode = appletcode.replace('&quot;', '"')
        appletcode = appletcode.replace('&nbsp;', '')
        html += appletcode
        html += u"</div>\n"

        return html
    

# ===========================================================================
def register():
    """Register this block with the BlockFactory"""
    from appletidevice              import AppletIdevice
    from exe.webui.blockfactory     import g_blockFactory
    g_blockFactory.registerBlockType(AppletBlock, AppletIdevice)    


# ===========================================================================
