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
from webassets.utils import common_path_prefix
"""
GenericBlock can render and process GenericIdevices as XHTML
"""

import logging
from exe.webui.block            import Block
from exe.webui.elementfactory   import g_elementFactory
from exe.webui                  import common

from exe                       import globals as G
from exe.engine.path           import Path

log = logging.getLogger(__name__)


# ===========================================================================
class JsBlock(Block):
    """
    JsBlockIdevice can render and process JsIdevices as XHTML
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

        if "iconiDevice"+self.id in request.args \
        and not is_cancel:
            self.idevice.icon = request.args["iconiDevice"+self.id][0]
            
            
    def renderEdit(self, style):
        """
        Returns an XHTML string with the form element for editing this block
        """
        html  = u'<div><div class="block">\n'
        html += common.textInput("title"+self.id, self.idevice.title)
        html += common.hiddenField("iconiDevice"+self.id, self.idevice.icon)
        html += u'<a style="margin-right:.5em" href="javascript:void(0)" '
        html += u'onclick="showMessageBox(\'iconpanel\');">'
        html += u'%s</a>' % _('Select an icon')
        icon = self.idevice.icon
        
        if icon != "":
        
            iconExists = False
            myIcon = Path(G.application.config.stylesDir/style/"icon_" + self.idevice.icon + ".gif")
            if myIcon.exists():
                iconExists = True
            else:
                myIcon = Path(G.application.config.stylesDir/style/"icon_" + self.idevice.icon + ".png")
                if myIcon.exists():
                    iconExists = True
            if iconExists:
                html += '<img style="vertical-align:middle;max-width:60px;height:auto" '
                name = 'iconiDevice' + self.id
                html += u"name=\"%s\" " % name
                html += u"id=\"%s\" " % 'iconiDevice'
                html += 'src="/style/%s/icon_%s' % (style, icon)
                html += '%s"/>' % myIcon.ext 
                html += u'<a onclick="deleteIcon(%s)" ' % (self.id)
                html += u"id=\"deleteIcon%s\" " % self.id
                html += 'class="deleteIcon"'
                html += 'title="delete">'
                html += u'<img alt="%s" style="vertical-align:middle; margin-left:5px" src="%s"/>' % ('delete', '/images/stock-delete.png')
                html += '</a><br />\n' 
        else:
            html += '<img style="vertical-align:middle;max-width:60px;height:auto" '
            name = 'iconiDevice' + self.id
            html += u"name=\"%s\" " % name
            html += u"id=\"%s\" " % 'iconiDevice'
            html += 'src=%s' % ('/images/empty.gif')
            html += '>'
            html += u'<a onclick="deleteIcon(%s)" ' % (self.id)
            html += u"id=\"deleteIcon%s\" " % self.id
            html += 'class="deleteIcon"'
            html += 'style="display: none"'
            html += 'title="delete">'
            html += u'<img alt="%s" style="vertical-align:middle; margin-left:5px" src="%s"/>' % ('delete', '/images/stock-delete.png')
            html += '</a><br />\n' 
        html += u'<div style="display:none;z-index:99;">'
        html += u'<div id="iconpaneltitle">'+_("Icons")+'</div>'
        html += u'<div id="iconpanelcontent">'
        html += self.__renderIcons(style)
        html += u'</div>'
        html += u'</div>\n'

        html += u"</div>\n"
        for element in self.elements:
            html += element.renderEdit() + "<br />"
        html += self.renderEditButtons()
        html += u"</div>\n"
        return html
    
    def __renderIcons(self, style):
        """
        Return xhtml string for dispay all icons
        """
        iconpath  = Path(G.application.config.stylesDir/style)
        iconfiles = iconpath.files("icon_*")
        html = '<div id="styleIcons"><div style="height:300px;overflow:auto">'
        
        for iconfile in iconfiles:
            iconname = iconfile.namebase
            icon     = iconname.split("_", 1)[1]
            
            iconExists = False
            iconExtension = "gif"
            myIcon = Path(G.application.config.stylesDir/style/iconname + ".gif")
            if myIcon.exists():
                iconExists = True
                iconValue = icon+'.'+iconExtension  
                iconSrc = '/style/%s/icon_%s' % (style, iconValue)
            else:
                myIcon = Path(G.application.config.stylesDir/style/iconname + ".png")
                if myIcon.exists():
                    iconExists = True 
                    iconExtension = "png"
                    iconValue = icon+'.'+iconExtension
                    iconSrc = '/style/%s/icon_%s' % (style, iconValue)
            
            if iconExists:
                filename = "/style/%s/%s.%s" % (style, iconname, iconExtension)
                html += u'<div style="float:left; text-align:center; width:105px;\n'
                html += u'margin-right:10px; margin-bottom:15px" > '
                html += u'<img src="%s" \n' % filename
                html += u"style=\"border:1px solid #E8E8E8;padding:5px;cursor:pointer;max-width:60px;height:auto\" onclick=\"window[0].selectStyleIcon('%s',this, '%s', '%s')\" title=\"%s.%s\">\n" % (icon, iconSrc, self.id, icon ,iconExtension)
                html += u'<br /><span style="display:inline-block;width:100px;overflow:hidden;text-overflow:ellipsis">%s.%s</span></div>\n' % (icon, iconExtension)
        
        html += '</div></div>'
        
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

from exe.engine.jsidevice import JsIdevice
from exe.webui.blockfactory    import g_blockFactory
g_blockFactory.registerBlockType(JsBlock, JsIdevice)    

# ===========================================================================
