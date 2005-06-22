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
The EditorPane is responsible for creating new idevice
"""

import logging
import gettext
from exe.webui                 import common
from exe.engine.field          import TextField, TextAreaField, ImageField
from exe.webui.editorelement   import TextEditorElement
from exe.webui.editorelement   import TextAreaEditorElement
from exe.webui.editorelement   import ImageEditorElement
from exe.engine.idevice        import Idevice
from exe.engine.genericidevice import GenericIdevice


log = logging.getLogger(__name__)
_   = gettext.gettext


# ===========================================================================
class EditorPane(object):
    """
    The EditorPane is responsible for creating new idevice
    """
    def __init__(self, webserver):
        """
        Initialize
        """
        self.ideviceStore = webserver.application.ideviceStore
        self.webDir       = webserver.application.config.webDir
        self.elements     = []
        self.idevice      = GenericIdevice("", "", "", "", "")
        self.purpose      = ""
        self.tip          = ""
        self.message      = ""

        
    def process(self, request):
        """
        Process
        """
        log.debug("process " + repr(request.args))
        self.message = ""

        for element in self.elements:
            element.process(request)
        
        if "addText" in request.args:
            self.idevice.addField(TextField(u"Type label here",
                                            u"Type field instructions here"))
        
        if "addTextArea" in request.args:
            self.idevice.addField(TextAreaField(u"Type label here", 
                                             u"Type field instructions here"))
                
        if "addImage" in request.args:
            field = ImageField(u"Type label here",
                               u"Type field instructions here")
            imagePath = self.webDir/"images"/ImageEditorElement.DefaultImage
            field.defaultImage = unicode(imagePath.abspath())
            self.idevice.addField(field)
                
        if "title" in request.args:
            self.idevice.title = request.args["title"][0] 

        if "author" in request.args:
            self.idevice.author = request.args["author"][0] 

        if "description" in request.args:
            self.idevice.purpose = request.args["description"][0] 

        if "tip" in request.args:
            self.idevice.tip = request.args["tip"][0] 

        if "preview" in request.args:
            if self.idevice.title == "":
                self.message = _("Please enter an idevice name.")
            else:
                self.idevice.edit = False

        if "edit" in request.args:
            self.idevice.edit = True

        if "reset" in request.args:
            idevice = GenericIdevice("", "", "", "", "")
            idevice.parentNode = None
            self.idevice = idevice

        if "save" in request.args:
            if self.idevice.title == "":
                self.message = _("Please enter an idevice name.")
            else:
                self.ideviceStore.addIdevice(self.idevice.clone())
                self.ideviceStore.save()
            
        if "emphasis" in request.args:
            self.idevice.emphasis = int(request.args["emphasis"][0])
        
        self.__buildElements()  
            
        
    def __buildElements(self):
        """
        Building up element array
        """
        self.elements  = []
        elementTypeMap = {TextField:      TextEditorElement,
                          TextAreaField:  TextAreaEditorElement,
                          ImageField:     ImageEditorElement}
        
        for field in self.idevice.fields:
            elementType = elementTypeMap.get(field.__class__)

            if elementType:
                # Create an instance of the appropriate element class
                log.debug(u"createElement "+elementType.__class__.__name__+
                          u" for "+field.__class__.__name__)
                self.elements.append(elementType(field))
            else:
                log.error(u"No element type registered for " +
                          field.__class__.__name__)
        
            
    def render(self, request):
        """
        Render the idevice being edited
        """
        message = _("This is an experimental feature, "+
                    "it is still in development.")
        html  = "<h2 align = \"center\">" + message + "</h2><br/>"
        html += "<br/><font color=\"red\"<b>"+self.message+"</b></font><br/>"
        html += "<table cellpadding=\"2\" cellspacing=\"2\" border=\"0\" "
        html += "style=\"width: 100%\"><tr valign=\"top\"><td width=\"30%\">\n"
        html += "<b>" + _("Available iDevice elements:")+ "</b><br/><br/>"
        html += common.submitButton("addText", _("Add Text Field"))+"<br/>"
        html += common.submitButton("addTextArea", _("Add Text Area")) + "<br/>"
        html += common.submitButton("addImage", _("Add Image")) + "<br/>"
        html += "<p>\n"
        html += "Future buttons could include<br/>functionality for: <br/>\n"
        html += "<ul><li>Limited interaction<br/>(eg hiding feedback)</li>\n"
        html += "<li>Options for incorporating<br/>"
        html += "different media objects</li>\n"
        html += "<li>Linking images with specific<br/>iDevices</li></ul>\n"
        html += "</p>\n"
        html += "</td><td>\n"

        html += self.renderIdevice(request)
        html += "</td></tr><tr><td></td><td>\n"
        if self.idevice.edit:
            html += common.submitButton("edit", _("Edit"), False)
            html += "&nbsp;&nbsp;"+common.submitButton("preview", _("Preview"))
        else:
            html += common.submitButton("edit", _("Edit")) + "&nbsp;&nbsp;"
            html += common.submitButton("preview", _("Preview"), False)
        html += "&nbsp;&nbsp;"+ common.submitButton("save", _("Save"))
        html += "&nbsp;&nbsp" + common.submitButton("reset", _("Reset"))
        html += "</td></tr></table>\n"

        return html


    def renderIdevice(self, request):
        """
        Returns an XHTML string for rendering the new idevice
        """
        html  = "<script type=\"text/javascript\">\n"
        html += "<!--\n"
        html += """
            function submitLink(action, object, changed) 
            {
                var form = document.contentForm
            
                form.action.value = action;
                form.object.value = object;
                form.isChanged.value = changed;
                form.submit();
            }\n"""
        html += "//-->\n"
        html += "</script>\n"
        
        self.purpose = self.idevice.purpose.replace("\r", "<br/>")
        
        self.tip = self.idevice.tip.replace("\r", "")
        self.tip = self.tip.replace("\n","\\n")
        self.tip = self.tip.replace("'","\\'")
        
        if self.idevice.edit:
            html += "<b>" + _("Idevice Name") + "</b><br/>\n"
            html += common.textInput("title", self.idevice.title) + "<br/>\n"
            html += "<b>" + _("Author") + "</b><br/>\n"
            html += common.textInput("author", self.idevice.author) + "<br/>\n"
            html += "<b>" + _("Purpose") + "</b><br/>\n"
            html += common.textArea("description", self.idevice.purpose) 
            html += "<b>" + _("Pedagogical Tip") + "</b><br/>\n"
            html += common.richTextArea("tip", self.tip) + "<br/>\n"  
            html += "<b>" + _("Emphasis") + "</b> "
            html += "<select onchange=\"submit();\" name=\"emphasis\">\n"

            emphasisValues = {Idevice.NoEmphasis:     _(u"No emphasis"),
                              Idevice.SomeEmphasis:   _(u"Some emphasis"),
                              Idevice.StrongEmphasis: _(u"Strong emphasis")}
            for value, description in emphasisValues:
                html += "<option value=\""+unicode(value)+"\" "
                if self.idevice.emphasis == value:
                    html += "selected "
                html += ">" + description + "</option>\n"

            html += "</select><br/><br/>\n"
            for element in self.elements:
                html += element.renderEdit()       
        else:
            html += "<b>" + self.idevice.title + "</b><br/><br/>"
            for element in self.elements:
                html += element.renderPreview()               
            if self.idevice.purpose != "" or self.idevice.tip != "":
                html += "<a title=\""+_("Pedagogical Help")+"\" "
                html += "onmousedown=\"Javascript:updateCoords(event);\" "
                html += "onclick=\"Javascript:showMe('phelp', 420, 240);\" " 
                html += "href=\"Javascript:void(0)\" style=\"cursor:help;\"> " 
                html += "<img src=\"/images/info.png\" border=\"0\" "
                html += "align=\"middle\" /></a>\n"
                html += "<div id=\"phelp\" style=\"display:none;\">"
                html += "<div style=\"float:right;\" "
                html += "<img src=\"/images/stock-stop.png\" "
                html += " title='"+_("Close")+"' border='0' align='middle' "
                html += "onmousedown=\"Javascript:hideMe();\"/></div>"
                if self.idevice.purpose != "":
                    html += "<b>Purpose:</b><br/>%s<br/>" % self.purpose
                    
                if self.idevice.tip != "":
                    html += "<b>Tip:</b><br/>%s<br/>" % self.idevice.tip
                    
                html += "</div>\n"    

        return html
        

# ===========================================================================
