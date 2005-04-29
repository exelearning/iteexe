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
The EditorPage is responsible for managing iDevices
"""

import logging
import gettext
from twisted.web.resource    import Resource
from exe.webui               import common
from exe.webui.editorelement import TextField, TextAreaField
from exe.engine.genericidevice import GenericIdevice
from exe.webui.editorpane    import EditorPane
from exe.webui.renderable import RenderableResource



log = logging.getLogger(__name__)
_   = gettext.gettext


class EditorPage(RenderableResource):
    """
    The EditorPage is responsible for managing iDevices
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
        self.noStr        = ""
        self.someStr      = ""
        self.strongStr    = ""
        self.purpose      = ""
        self.tip          = ""

        
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
        html  = common.header() 
        html += "<body>\n"
        html += "<div id=\"main\"> \n"     
        html += "<form method=\"post\" action=\""+self.url+"\" "
        html += "name=\"contentForm\" >"  
        html += common.hiddenField("action")
        html += common.hiddenField("object")
        html += common.hiddenField("isChanged", "1") 
        html += "<pre>%s</pre>\n" % str(request.args) # to be deleted later
#        html += self.renderList()
        html += self.editorPane.render(request)
        html += "<br/></form>"
        html += "</div> \n"
        html += common.footer()
        return html
    render_POST = render_GET


    def renderList(self):
        html  = "<p>"
        for prototype in self.ideviceStore.generic:
            html += "<a href=\"#\" "
            html += "onclick=\"submitLink('changeIdevice', "
            html += "'"+prototype.id+"','1')\" />" 
            html += prototype.title + "</a><br/> \n"
        html += "</p>\n"

        return html
