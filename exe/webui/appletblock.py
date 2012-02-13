# ===========================================================================
# eXe 
# Copyright 2004-2005, University of Auckland
# Copyright 2004-2007 eXe Project  http://eXeLearning.org/
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
#from string            import Template

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
      
        if "code" + self.id in request.args \
        and not is_cancel:
            self.idevice.appletCode = request.args["code" + self.id][0]
                    
        if "action" in request.args and request.args["action"][0] == self.id:
            self.idevice.deleteFile(request.args["object"][0])
            self.idevice.edit = True
            self.idevice.undo = False
            
        if "action" in request.args and request.args["action"][0] == "changeType" + self.id:
            self.idevice.type = request.args["object"][0]
            self.idevice.copyFiles()
            self.idevice.edit = True
            self.idevice.undo = False
            
        if "action" in request.args and request.args["action"][0] == "done":
            # remove the undo flag in order to reenable it next time:
            if hasattr(self.idevice,'undo'): 
                del self.idevice.undo
            
        if "upload" + self.id in request.args:
            if "path" + self.id in request.args:
                filePath = request.args["path"+self.id][0]
                if filePath:
                    if self.idevice.type == "geogebra" and not filePath.endswith(".ggb"):
                        self.idevice.message = _("Please upload a .ggb file.")
                    elif self.idevice.type == "jclic" and not filePath.endswith(".jclic.zip"):
                        self.idevice.message = _("Please upload a .jclic.zip file.")
                    elif self.idevice.type == "scratch" and not filePath.endswith(".sb") or filePath.endswith(".scratch"):
                        self.idevice.message = _("Please upload a .sb or .scratch file.")
                    elif self.idevice.type == "descartes" and not (filePath.endswith(".htm") or filePath.endswith(".html")):
                        self.idevice.message = _("Please type or paste a valid URL.")
                    else:
                        if self.idevice.type == "descartes" and filePath.find(","):
                            self.idevice.uploadFile(filePath)
                        else:                     
                            self.idevice.uploadFile(filePath)       
                            self.idevice.message = ""                   
            self.idevice.edit = True    
            self.idevice.undo = False


    def renderEdit(self, style):
        """
        Returns an XHTML string with the form elements for editing this block
        """
        log.debug("renderEdit")

        html  = "<div class=\"iDevice\"><br/>\n"
        html += common.textInput("title"+self.id, self.idevice.title)
        html += u"<br/><br/>\n"
       
        types = [(_(u"Descartes"), "descartes"),
                 (_(u"Geogebra"), "geogebra"),
                 (_(u"JClic"), "jclic"),
                 (_(u"Scratch"), "scratch"),
                 (_(u"Other"), "other")]
        html += u"<b>%s</b>" % _("Applet Type")
        
        html += '<select onchange="submitChange(\'changeType%s\', \'type%s\')";' % (self.id, self.id)
        html += 'name="type%s" id="type%s">\n' % (self.id, self.id)
        
        for type, value in types:
            html += "<option value=\""+value+"\" "
            if self.idevice.type == value:
                html += "selected "
            html += ">" + type + "</option>\n"
        html += "</select> \n"
        html += common.elementInstruc(self.idevice.typeInstruc) + "<br/><br/>"
        
        if self.idevice.message <> "":
            html += '<p style="color:red"><b>' + self.idevice.message + '</b></p>'
        
        html += common.textInput("path"+self.id, "", 50)
        # html += u'<input type="button" onclick="addFile(\'%s\')"' % self.id
        
        # Descartes do not requires AddFile button:
        if self.idevice.type != "descartes":
            html += u'<input type="button" onclick="addFile(\'%s\')"' % self.id
            html += u'value="%s" />\n' % _(u"Add files")
            html += u'<input type="submit" name="%s" value="%s"' % ("upload"+self.id,
                                                                _(u"Upload"))
        else:
            html += u'<input type="submit" name="%s" value="%s"' % ("upload"+self.id,
                                                                _(u"Upload"))   
        
        html += common.elementInstruc(self.idevice.fileInstruc)
        html += u'<br/>\n'

        html += u'<b>%s</b>\n' % _(u'Applet Code:')
        html += common.elementInstruc(self.idevice.codeInstruc)
        html += u'<br/>\n'

        html += common.textArea('code'+self.id,
                                    self.idevice.appletCode,rows="12")

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
        html += self.renderEditButtons(undo=self.idevice.undo)
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
        # appletcode = appletcode.replace('\xC2\x82','&#130')
        appletcode = appletcode.replace('<applet','<applet CODEBASE="resources"')
        appletcode = appletcode.replace('<APPLET','<applet CODEBASE="resources"')       
        
        html  = u"<div class=\"iDevice "
        html += u"emphasis"+unicode(self.idevice.emphasis)+"\" "
        html += u"ondblclick=\"submitLink('edit',"+self.id+", 0);\">\n"
        html += appletcode
        html += u"<br/>"
        html += self.renderViewButtons()
        html += u"</div>\n"

        return html
    

    def renderView(self, style):
        """
        Returns an XHTML string for viewing this block
        """        
        log.debug("renderView")
        html  = u"<!-- applet iDevice -->\n"
        html += u"<div class=\"iDevice "
        html += u"emphasis"+unicode(self.idevice.emphasis)+"\">\n"

        appletcode = self.idevice.appletCode
        appletcode = appletcode.replace('&gt;', '>')
        appletcode = appletcode.replace('&lt;', '<')
        appletcode = appletcode.replace('&quot;', '"')
        appletcode = appletcode.replace('&nbsp;', '')
        # appletcode = appletcode.replace('\xC2\x82','&#130')
        html += appletcode
        html += u"<br/>"
        html += u"</div>\n"

        return html
    

# ===========================================================================
"""Register this block with the BlockFactory"""
from exe.engine.appletidevice   import AppletIdevice
from exe.webui.blockfactory     import g_blockFactory
g_blockFactory.registerBlockType(AppletBlock, AppletIdevice)    


# ===========================================================================
