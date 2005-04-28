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
The ExportPage is responsible for exporting the current project
"""

import logging
import gettext
import os.path
from twisted.web.resource     import Resource
from exe.webui                import common
from exe.export.websiteexport import WebsiteExport
from exe.export.scormexport   import ScormExport
from exe.webui.renderable import RenderableResource


log = logging.getLogger(__name__)
_   = gettext.gettext


class ExportPage(RenderableResource):
    """
    The ExportPage is responsible for exporting the current project
    """

    name = 'export'

    def __init__(self, parent):
        """
        Initialize
        """
        RenderableResource.__init__(self, parent)
        self.url       = ""
        self.message   = ""
        self.scormStr  = ""
        self.scormStr2 = ""
        self.webStr    = ""

    def process(self, request):
        """
        Save the current package 
        """
        log.debug("process " + repr(request.args))
        
        self.url       = request.path
        dataDir        = self.config.dataDir
        self.scormStr  = ""
        self.scormStr2 = ""
        self.webStr    = ""
        
        if "exportMethod" in request.args:
            if request.args["exportMethod"][0] == "webpage":
                self.webStr = "selected"

            elif request.args["exportMethod"][0] == "scorm":
                self.scormStr = "selected"
       
            elif request.args["exportMethod"][0] == "scorm-no-metadata":
                self.scormStr2 = "selected"
       
        if "export" in request.args:            
            oldDir = os.path.abspath('.')
            os.chdir(dataDir)
            try:
                if request.args["exportMethod"][0] == "webpage":
                    websiteExport = WebsiteExport(self.config)
                    websiteExport.export(self.package)

                elif request.args["exportMethod"][0] == "scorm":
                    scormExport = ScormExport(self.config)
                    scormExport.export(self.package, True)
                
                elif request.args["exportMethod"][0] == "scorm-no-metadata":
                    scormExport = ScormExport(self.config)
                    scormExport.export(self.package, False)
                
                self.message = \
                    _("The course package has been exported successfully.")
            finally:
                os.chdir(oldDir)
            
        if ("action" in request.args and 
            request.args["action"][0] == "saveChange"):
            log.debug("process save change:")
            self.package.save()


    def render_GET(self, request):
        """
        Called for all requests to this object
        """
        
        # processing 
        log.debug("render_GET")
        self.process(request)
                        
        # Rendering
        
        html  = common.header() + common.banner(request)
        html += "<div id=\"main\"> \n"
        html += "<h3>Export Project</h3>\n"
        html += "<form method=\"post\" action=\"%s\" " % self.url
        html += "name=\"contentForm\">" 
        html += common.hiddenField("action")
        html += common.hiddenField("isChanged", self.package.isChanged)
        html += "<br/><b>" + self.message+ "</b><br><br/>"   
        html += _("Export project as:") + "<br/>\n"
        html += "<select onchange=\"submit();\" name=\"exportMethod\">\n"
        html += "<option value=\"webpage\" "+self.webStr+">"+_("Web Page")
        html += "</option>\n"
        html += "<option value=\"scorm\" "+self.scormStr+">"+_("SCORM Package")
        html += "</option>\n"
        html += "<option value=\"scorm-no-metadata\" "+self.scormStr2+">"
        html += _("SCORM Package - (WebCT)")
        html += "</option>\n"
        html += "</select>\n"
        html += "<br/><br/>" + common.submitButton("export", _("Export"))
        html += "<br/></form>\n"
        html += "</div> \n"
        html += common.footer()
        self.message = ""
        
        return html
    
    render_POST = render_GET
