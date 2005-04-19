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
The SavePage is responsible for saving the current project
"""

import logging
import gettext
from twisted.web.resource import Resource
from exe.webui import common
from exe.engine.packagestore import g_packageStore
from exe.webui.webinterface  import g_webInterface
from exe.webui.menupane      import MenuPane
from exe.webui.editorelement import TextField, TextAreaField
from exe.engine.genericidevice import GenericIdevice


log = logging.getLogger(__name__)
_   = gettext.gettext


class EditorPage(Resource):
    """
    The SavePage is responsible for saving the current project
    """
   # Edit, Preview, View = range(3)
    def __init__(self):
        """
        Initialize
        """
        Resource.__init__(self)
        self.package  = None
        self.url      = ""
        self.elements = []
        self.idevice  = None
        self.menuPane = MenuPane()
        self.mode = 1
        
    def process(self, request):
        """
        process current package 
        """
        log.debug("process " + repr(request.args))
        
        self.url = request.path
        packageName = request.prepath[0]
        self.package = g_packageStore.getPackage(packageName)
        self.idevice = self.package.editor.idevices[0]
        if self.idevice.edit:
            self.mode = 1
        else:
            self.mode = 2
        
        
        
        if "addText" in request.args:
            self.idevice.addField("Type label here", "Text", "", "")
        
        if "addTextArea" in request.args:
            self.idevice.addField("Type label here", "TextArea", "", "")
                
        if "title" in request.args:
            self.idevice.title = request.args["title"][0] 
        if "author" in request.args:
            self.idevice.author = request.args["author"][0] 
        if "description" in request.args:
            self.idevice.purpose = request.args["description"][0] 
        if "tip" in request.args:
            self.idevice.tip = request.args["tip"][0] 
        if "preview" in request.args:
            self.idevice.edit = False
        if "edit" in request.args:
            self.idevice.edit = True
        if "reset" in request.args:
            idevice = GenericIdevice("", "", "", "", "")
            idevice.parentNode = self.package.editor
            self.package.editor.idevices.remove(self.idevice)
            self.package.editor.addIdevice(idevice)
            self.idevice = idevice

        self.__buildElements()      
        
        
    def __buildElements(self):
        
        self.elements = []
        i = 0    
        for field in self.idevice.fields:
            if field.fieldType == "Text":
                self.elements.append(TextField(i,self.idevice, field))
            elif field.fieldType == "TextArea":
                self.elements.append(TextAreaField(i,self.idevice, field))
            i += 1
        
            
    def renderIdevice(self, request):
        
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
            }

            function showInstruc(id){
                if (document.getElementById(id).style.display == "block")
                    document.getElementById(id).style.display = "none";
                else
                    document.getElementById(id).style.display = "block";
            }\n"""
        html += "//-->\n"
        html += "</script>\n"
        
        if self.idevice.edit:
            html += "<b>" + _("Idevice Name") + "</b><br/>\n"
            html += common.textInput("title", self.idevice.title) + "<br/>"
            html += "<b>" + _("Author") + "</b><br/>\n"
            html += common.textInput("author", self.idevice.author) + "<br/>"
            html += "<b>" + _("Description") + "</b><br/>\n"
            html += common.textArea("description", self.idevice.purpose) + "<br/>"
            html += "<b>" + _("Pedagogical Help") + "</b><br/>\n"
            html += common.richTextArea("tip", self.idevice.tip) + "<br/>\n"           
            for element in self.elements:
                html += element.renderEdit(request)       
        else:
            for element in self.elements:
                html += element.renderPreview(request) 
                
        return html
        

    def render_GET(self, request):
        """Called for all requests to this object"""
        
        # Processing 
        log.debug("render_GET")
        self.process(request)
        self.menuPane.process(request) 
        
        for element in self.elements:
            element.process(request)
            
        self.__buildElements()
        # Rendering
        html  = common.header() 
        html += "<body>\n"
        html += "<div id=\"main\"> \n"     
        html += "<form method=\"post\" action=\"%s\" " % self.url
        html += "name=\"contentForm\" >"  
        html += common.hiddenField("action")
        html += common.hiddenField("object")
        html += common.hiddenField("isChanged", self.package.isChanged) 
        html += "<pre>%s</pre>\n" % str(request.args) # to be deleted later
        html += "<table cellpadding=\"2\" cellspacing=\"2\" border=\"1\" "
        html += "style=\"width: 100%\"><tr valign=\"top\"><td>\n"
        html += "<b>" + _("Available iDevice elements:")+ "</b><br/><br/>"
        html += common.submitButton("addText", _("Add Text Field"))+"<br/>"
        html += common.submitButton("addTextArea", _("Add Text Area")) + "<br/>"
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
        html += "<br/></form>"
        html += "</div> \n"
        html += common.footer()
        
        return html
    
    render_POST = render_GET
