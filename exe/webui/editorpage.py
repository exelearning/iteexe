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
The EditorPage is responsible for managing user created iDevices
"""

import logging
import gettext
from twisted.web.resource      import Resource
from exe.webui                 import common
from exe.engine.genericidevice import GenericIdevice
from exe.webui.editorpane      import EditorPane
from exe.webui.renderable      import RenderableResource

log = logging.getLogger(__name__)
_   = gettext.gettext


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
        self.editorPane   = EditorPane(self.webserver)
        self.url          = ""
        self.elements     = []

        
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

        if "action" in request.args:
            if request.args["action"][0] == "changeIdevice":
                self.editorPane.idevice = GenericIdevice("", "", "", "", "")
        
        self.editorPane.process(request)


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
        html += "@import url(/style/standardwhite/content.css);</style>\n"
        html += '<script language="JavaScript" src="/scripts/fckeditor.js">'
        html += '</script>\n'
        html += '<script language="JavaScript" src="/scripts/libot_drag.js">'
        html += '</script>\n'
        html += '<script language="JavaScript" src="/scripts/common.js">'
        html += '</script>\n'
        html += "<title>"+_("eXe : elearning XHTML editor")+"</title>\n"
        html += "<meta http-equiv=\"content-type\" content=\"text/html; "
        html += " charset=UTF-8\"></meta>\n";
        html += "</head>\n"
        html += "<body>\n"
        html += "<div id=\"main\"> \n"     
        html += "<form method=\"post\" action=\""+self.url+"\" "
        html += "name=\"contentForm\" >"  
        html += common.hiddenField("action")
        html += common.hiddenField("object")
        html += common.hiddenField("isChanged", "1") 
#        html += self.renderList()
        html += self.editorPane.render(request)
        html += "<br/></form>"
        html += "</div> \n"
        html += common.footer()
        return html.encode('utf8')
    render_POST = render_GET


    def renderList(self):
        """
        Render the list of generic iDevice
        """
        html  = "<p>"
        for prototype in self.ideviceStore.generic:
            html += "<a href=\"#\" "
            html += "onclick=\"submitLink('changeIdevice', "
            html += "'"+prototype.id+"','1')\" />" 
            html += prototype.title + "</a><br/> \n"
        html += "</p>\n"
        return html
