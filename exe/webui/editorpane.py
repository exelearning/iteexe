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
        self.ideviceStore    = webserver.application.ideviceStore
        self.webDir          = webserver.application.config.webDir
        self.elements        = []
        self.idevice         = GenericIdevice("", "", "", "", "")
        self.purpose         = ""
        self.tip             = ""
        self.message         = ""
        self.nameInstruc     = u"""Your new idevice will appear in the iDevice 
pane with this title. This is a compulsory field and you will be prompted to 
enter a label if you try to submit your idevice without one."""
        self.authorInstruc   = u"This is an optional field."
        self.purposeInstruc  = u"""The purpose dialogue allows you to describe 
your intended purpose of the device to other potential users."""
        self.emphasisInstruc = u"""Use Emphasis to distinguish the importance 
of the information being presented in the idevice."""
        self.tipInstruc      = """A pedagogical tip allows you to describe your 
intended use and the pedagogy behind the devices development."""
        self.lineInstruc     = """Add a single text line to an iDevice. 
Useful if you want the ability to place a label within the device."""
        self.textBoxInstruc  = """Add a text entry box to an iDevice. 
Used for entering description textual content."""
        self.imageInstruc    = """Add an image to your iDevice. Enables 
the selection of an image from your stored picture files."""
        
    def process(self, request):
        """
        Process
        """
        log.debug("process " + repr(request.args))
        self.message = ""

        for element in self.elements:
            element.process(request)
        
        if "addText" in request.args:
            self.idevice.addField(TextField(u"Enter the label here",
                 u"Enter instructions for completion here"))
        
        if "addTextArea" in request.args:
            self.idevice.addField(TextAreaField(u"Enter the label here", 
                 u"Enter the instructions for completion here"))
                
        if "addImage" in request.args:
            field = ImageField(u"Enter the label here",
                               u"Enter the instructions for completion here")
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
        message = _("This is an experimental feature and "+
                    "is still in development.")
        html  = "<p align = \"center\"><b>" + message + "</b></p>"
        html += "<font color=\"red\"<b>"+self.message+"</b></font><br/>"
        html += "<div ID=\"iDevice_editor\" "
        html += "<fieldset><legend><b>" + _("iDevice elements")+ "</b></legend>"
        html += common.submitButton("addText", _("Add Text Line"))
        html += common.elementInstruc("line", self.lineInstruc) + "<br/>"
        html += common.submitButton("addTextArea", _("Add Text Box"))
        html += common.elementInstruc("textBox", self.textBoxInstruc) + "<br/>"
        html += common.submitButton("addImage", _("Add Image")) 
        html += common.elementInstruc("image", self.imageInstruc) + "<br/>"
        html += "</fieldset></div>\n"

        html += "<div style=\"margin-left: 170px;\">\n"
        html += self.renderIdevice(request)
        if self.idevice.edit:
            html += common.submitButton("edit", _("Edit"), False)
            html += "&nbsp;&nbsp;"+common.submitButton("preview", _("Preview"))
        else:
            html += common.submitButton("edit", _("Edit")) + "&nbsp;&nbsp;"
            html += common.submitButton("preview", _("Preview"), False)
        html += "&nbsp;&nbsp;"+ common.submitButton("save", _("Save"))
        html += "&nbsp;&nbsp" + common.submitButton("reset", _("Reset"))
        html += "</div>\n"

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
                var form = document.getElementById("contentForm")
            
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
            html += "<b>" + _("iDevice Name") + ": </b>\n"
            html += common.elementInstruc("name", self.nameInstruc) + "<br/>"
            html += common.textInput("title", self.idevice.title) + "<br/>\n"
            html += "<b>" + _("Author") + ": </b>\n"
            html += common.elementInstruc("author", self.authorInstruc) + "<br/>"
            html += common.textInput("author", self.idevice.author) + "<br/>\n"
            html += "<b>" + _("Purpose") + ": </b>\n"
            html += common.elementInstruc("purpose", self.purposeInstruc)
            html += "<br/>" +common.textArea("description", self.idevice.purpose) 
            html += "<b>" + _("Pedagogical Tip") + ": </b>\n"
            html += common.elementInstruc("tip", self.tipInstruc) + "<br/>"
            html += common.richTextArea("tip", self.tip) + "<br/>\n"  
            html += "<b>" + _("Emphasis") + ":</b> "
            html += "<select onchange=\"submit();\" name=\"emphasis\">\n"

            emphasisValues = {Idevice.NoEmphasis:     _(u"No emphasis"),
                              Idevice.SomeEmphasis:   _(u"Some emphasis"),
                              Idevice.StrongEmphasis: _(u"Strong emphasis")}
            for value, description in emphasisValues.items():
                html += "<option value=\""+unicode(value)+"\" "
                if self.idevice.emphasis == value:
                    html += "selected "
                html += ">" + description + "</option>\n"

            html += "</select> \n"
            html += common.elementInstruc("emphasis", self.emphasisInstruc)
            html += "<br/><br/>\n"
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
                html += '<img alt="Info" src="/images/info.png" border="0" '
                html += "align=\"middle\" /></a>\n"
                html += "<div id=\"phelp\" style=\"display:none;\">"
                html += "<div style=\"float:right;\" "
                html += '<img alt="Close" src="/images/stock-stop.png" '
                html += " title='"+_("Close")+"' border='0' align='middle' "
                html += "onmousedown=\"Javascript:hideMe();\"/></div>"
                if self.idevice.purpose != "":
                    html += "<b>Purpose:</b><br/>%s<br/>" % self.purpose
                    
                if self.idevice.tip != "":
                    html += "<b>Tip:</b><br/>%s<br/>" % self.idevice.tip
                    
                html += "</div>\n"    

        return html
        

# ===========================================================================
