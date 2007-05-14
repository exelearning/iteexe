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

"""
The EditorPage is responsible for managing user created iDevices
"""

import logging
from twisted.web.resource      import Resource
from exe.webui                 import common
from exe.engine.genericidevice import GenericIdevice
from exe.webui.editorpane      import EditorPane
from exe.webui.renderable      import RenderableResource
from exe.engine.package        import Package
from exe.engine.path           import Path
from exe.engine.field          import MultimediaField

log = logging.getLogger(__name__)


class EditorPage(RenderableResource):
    """
    The EditorPage is responsible for managing user created iDevices
    create / edit / delete
    """

    name = 'editor'

    def __init__(self, parent):
        """
        Initialize
        """
        RenderableResource.__init__(self, parent)
        self.editorPane   = EditorPane(self.webServer)
        self.url          = ""
        self.elements     = []
        self.isNewIdevice = True
        self.message      = ""
        
    def getChild(self, name, request):
        """
        Try and find the child for the name given
        """
        if name == "":
            return self
        else:
            return Resource.getChild(self, name, request)


    def process(self, request):
        """
        Process current package 
        """
        log.debug("process " + repr(request.args))
        
        self.editorPane.process(request,"old")

        if "action" in request.args:
            if request.args["action"][0] == "changeIdevice":
                genericIdevices = self.ideviceStore.generic
                if not self.isNewIdevice:
                    ideviceId = self.editorPane.idevice.id
                    for idevice in genericIdevices:
                        if idevice.id == ideviceId:
                            break
                    copyIdevice = self.editorPane.idevice.clone()
                    self.__saveChanges(idevice, copyIdevice)
                
                for idevice in genericIdevices:
                    if idevice.title == request.args["object"][0]:
                        break
                self.isNewIdevice = False
                self.editorPane.setIdevice(idevice)               
                self.editorPane.process(request, "new")
                
        
        if (("action" in request.args and 
             request.args["action"][0] == "newIdevice")
            or "new" in request.args):
            self.__createNewIdevice(request)
            

        if "delete" in request.args:
            self.ideviceStore.delGenericIdevice(self.editorPane.idevice)
            self.ideviceStore.save()
            self.__createNewIdevice(request) 
            
        if ("action" in request.args and 
             request.args["action"][0] == "new"):
            if self.editorPane.idevice.title == "":
                self.message = _("Please enter an idevice name.")
            else:
                newIdevice = self.editorPane.idevice.clone()
                #TODO could IdeviceStore set the id in addIdevice???
                newIdevice.id = self.ideviceStore.getNewIdeviceId()
                self.ideviceStore.addIdevice(newIdevice)
                self.editorPane.setIdevice(newIdevice)
                self.ideviceStore.save()
                self.isNewIdevice = False
                
        if ("action" in request.args and 
             request.args["action"][0] == "save"): 
            genericIdevices = self.ideviceStore.generic
            for idevice in genericIdevices:
                if idevice.title == self.editorPane.idevice.title:
                    break
            copyIdevice = self.editorPane.idevice.clone()
            self.__saveChanges(idevice, copyIdevice)
            self.ideviceStore.save()
            
        if ("action" in request.args and 
             request.args["action"][0] == "export"):          
            filename = request.args["pathpackage"][0]
            self.__exportIdevice(filename)
            
        if ("action" in request.args and 
             request.args["action"][0] == "import"):
            filename = request.args["pathpackage"][0]
            self.__importIdevice(filename)
            
    def __createNewIdevice(self, request):
        """
        Create a new idevice and add to idevicestore
        """
        idevice = GenericIdevice("", "", "", "", "")
        idevice.icon = ""
        idevice.id = self.ideviceStore.getNewIdeviceId()
        self.editorPane.setIdevice(idevice)
        self.editorPane.process(request, "new")      
        self.isNewIdevice = True
          
    def __saveChanges(self, idevice, copyIdevice):
        """
        Save changes to generic idevice list.
        """
        idevice.title    = copyIdevice.title
        idevice.author   = copyIdevice.author
        idevice.purpose  = copyIdevice.purpose
        idevice.tip      = copyIdevice.tip
        idevice.fields   = copyIdevice.fields
        idevice.emphasis = copyIdevice.emphasis
        idevice.icon     = copyIdevice.icon
        idevice.systemResources = copyIdevice.systemResources 
        
    def __importIdevice(self, filename):
        
        """
        import the idevices which are not existed in current package from another package
        """
        try:       
            newPackage = Package.load(filename)
        except:
            self.message = _("Sorry, wrong file format.")
            return
        
        if newPackage:   
            newIdevice = newPackage.idevices[-1].clone()
            for currentIdevice in self.ideviceStore.generic:
                if newIdevice.title == currentIdevice.title:
                    newIdevice.title += "1"
                    break
            self.ideviceStore.addIdevice(newIdevice) 
            self.ideviceStore.save()
        else:
            self.message = _("Sorry, wrong file format.")
        
    def __exportIdevice(self, filename):
        """
        export the current generic idevices.
        """
        if not filename.endswith('.idp'):
            filename = filename + '.idp'
        name = Path(filename).namebase
        package = Package(name)
        package.idevices.append(self.editorPane.idevice.clone())
        package.save(filename)
        
        
        
    def render_GET(self, request):
        """Called for all requests to this object"""
        
        # Processing 
        log.debug("render_GET")
        self.process(request)
        
        # Rendering
        html  = common.docType()
        html += "<html xmlns=\"http://www.w3.org/1999/xhtml\">\n"
        html += "<head>\n"
        html += "<style type=\"text/css\">\n"
        html += "@import url(/css/exe.css);\n"
        html += '@import url(/style/base.css);\n'
        html += "@import url(/style/standardwhite/content.css);</style>\n"
        html += '<script type="text/javascript" src="/scripts/libot_drag.js">'
        html += '</script>\n'
        html += '<script type="text/javascript" src="/scripts/common.js">'
        html += '</script>\n'
        html += '<script type="text/javascript" src="/scripts/editor.js">'
        html += '</script>\n'
        html += "<title>"+_("eXe : elearning XHTML editor")+"</title>\n"
        html += "<meta http-equiv=\"content-type\" content=\"text/html; "
        html += " charset=UTF-8\"></meta>\n";
        html += "</head>\n"
        html += "<body>\n"
        html += "<div id=\"main\"> \n"     
        html += "<form method=\"post\" action=\""+self.url+"\" "
        html += "id=\"contentForm\" >"  
        html += common.hiddenField("action")
        html += common.hiddenField("object")
        html += common.hiddenField("isChanged", "1") 
        html += "<font color=\"red\"<b>"+self.message+"</b></font>"
        html += "<div id=\"editorButtons\"> \n"     
        html += self.renderList()
        html += self.editorPane.renderButtons(request)
        if self.isNewIdevice:
            html += "<br/>" + common.submitButton("delete", _("Delete"), 
                                                        False)
        else:
            html += "<br/>" + common.submitButton("delete", _("Delete"))
        html += '<br/><input class="button" type="button" name="save" '
        title = "none"
        if self.editorPane.idevice.edit == False:
            title = self.editorPane.idevice.title
        html += 'onclick=saveIdevice("%s") value="%s"/>' % (title, _("Save"))
        html += u'<br/><input class="button" type="button" name="import" onclick="importPackage(\'package\')"' 
        html += u' value="%s" />'  % _("Import iDevice")
        html += u'<br/><input class="button" type="button" name="export" '
        html += u'onclick="exportPackage(\'package\',\'%d\')"' % self.isNewIdevice
        html += u' value="%s" />'  % _("Export iDevice")
        html += u'<br/><input class="button" type="button" name="quit" '
        html += u'onclick=JavaScript:window.close()'         
        html += u' value="%s" />\n'  % _("Quit")
        html += common.hiddenField("pathpackage")
        html += "</fieldset>"
        html += "</div>\n"
        html += self.editorPane.renderIdevice(request)
        html += "</div>\n"
        html += "<br/></form>\n"
        html += "</body>\n"
        html += "</html>\n"
        return html.encode('utf8')
    render_POST = render_GET


    def renderList(self):
        """
        Render the list of generic iDevice
        """
        html  = "<fieldset><legend><b>" + _("Edit")+ "</b></legend>"
        html += '<select onchange="submitIdevice();" name="ideviceSelect" id="ideviceSelect">\n'
        html += "<option value = \"newIdevice\" "
        if self.isNewIdevice:
            html += "selected "
        html += ">"+ _("New iDevice") + "</option>"
        for prototype in self.ideviceStore.generic:
            html += "<option value=\""+prototype.title+"\" "
            if self.editorPane.idevice.id == prototype.id:
                html += "selected "
            title = prototype.title
            if len(title) > 16:
                title = title[:16] + "..."
            html += ">" + title + "</option>\n"
        html += "</select> \n"
        html += "</fieldset>\n"
        self.message = ""
        return html
