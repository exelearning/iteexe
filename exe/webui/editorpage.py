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
The EditorPage is responsible for creating new idevice
"""

import logging
import gettext
from twisted.web.resource import Resource
from exe.webui import common
from exe.engine.packagestore import g_packageStore
from exe.webui.editorelement import TextField, TextAreaField
from exe.engine.newidevice   import NewIdevice


log = logging.getLogger(__name__)
_   = gettext.gettext


class EditorPage(Resource):
    """
    The EditorPage is responsible for creating new idevice
    """
    def __init__(self):
        """
        Initialize
        """
        Resource.__init__(self)
        self.package   = None
        self.url       = ""
        self.elements  = []
        self.idevice   = None
        self.noStr     = ""
        self.someStr   = ""
        self.strongStr = ""
        self.purpose   = ""
        self.tip       = ""
        
    def process(self, request):
        """
        process current package 
        """
        log.debug("process " + repr(request.args))
        
        self.url = request.path
        packageName = request.prepath[0]
        self.package = g_packageStore.getPackage(packageName)
        self.idevice = self.package.editor.idevices[0]
        
        self.__buildElements()  
        
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
            idevice = NewIdevice("", "", "", "", "")
            idevice.parentNode = self.package.editor
            self.package.editor.idevices.remove(self.idevice)
            self.package.editor.addIdevice(idevice)
            self.idevice = idevice
            
        self.noStr     = ""
        self.someStr   = ""
        self.strongStr = ""
                
        if "emphasis" in request.args:
            if request.args["emphasis"][0] == "no":
                self.noStr = "selected"
                self.idevice.emphasis = 0

            elif request.args["emphasis"][0] == "some":
                self.someStr = "selected"
                self.idevice.emphasis = 1
       
            elif request.args["emphasis"][0] == "strong":
                self.strongStr = "selected"
                self.idevice.emphasis = 2

            
        
        
    def __buildElements(self):
        
        """
        Building up element array
        """
        
        self.elements = []
        i = 0    
        for field in self.idevice.fields:
            if field.fieldType == "Text":
                self.elements.append(TextField(i, self.idevice, field))
            elif field.fieldType == "TextArea":
                self.elements.append(TextAreaField(i, self.idevice, field))
            i += 1
        
            
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
            html += "<b>" + _("Description") + "</b><br/>\n"
            html += common.textArea("description", self.idevice.purpose) 
            html += "<b>" + _("Pedagogical Help") + "</b><br/>\n"
            html += common.richTextArea("tip", self.tip) + "<br/>\n"  
            html += "<b>" + _("Emphasis") + "</b> "
            html += "<select onchange=\"submit();\" name=\"emphasis\">\n"
            html += "<option value=\"no\" "+self.noStr+">"+_("No emphasis")
            html += "</option>\n"
            html += "<option value=\"some\" "+self.someStr+">"+_("Some emphasis")
            html += "</option>\n"
            html += "<option value=\"strong\" "+self.strongStr+">"
            html += _("Strong emphasis")
            html += "</option>\n"
            html += "</select><br/><br/>\n"
            for element in self.elements:
                html += element.renderEdit(request)       
        else:
            html += "<b>" + self.idevice.title + "</b><br/><br/>"
            for element in self.elements:
                html += element.renderPreview(request)               
            if self.idevice.purpose != "" or self.idevice.tip != "":
                html += "<a title=\""+_("Pedagogical Help")+"\" "
                html += "onmousedown=\"Javascript:updateCoords(event);\" "
                html += "onclick=\"Javascript:showMe('phelp', 420, 240);\" " 
                html += "href=\"Javascript:void(0)\" style=\"cursor:help;\"> " 
                html += "<img src=\"/images/info.png\" border=\"0\" "
                html += "align=\"middle\" /></a>\n"
                html += "<div id=\"phelp\" style=\"display:none;\">"
                html += "<div style=\"float:right;\" "
                html += "<img src=\"images/stock-stop.png\" "
                html += " title='"+_("Close")+"' border='0' align='middle' "
                html += "onmousedown=\"Javascript:hideMe();\"/></div>"
                if self.idevice.purpose != "":
                    html += "<b>Purpose:</b><br/>%s<br/>" % self.purpose
                    
                if self.idevice.tip != "":
                    html += "<b>Tip:</b><br/>%s<br/>" % self.idevice.tip
                    
                html += "</div>\n"    
                
        return html
        

    def render_GET(self, request):
        """Called for all requests to this object"""
        
        # Processing 
        log.debug("render_GET")
        self.process(request)
        
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
       # html += "<pre>%s</pre>\n" % str(request.args) # to be deleted later
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
