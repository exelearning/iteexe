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

import os.path
import logging
import gettext
from twisted.web.resource import Resource
from exe.webui import common
from exe.engine.packagestore import g_packageStore
from exe.webui.webinterface import g_webInterface
from exe.webui.menupane import MenuPane
from exe.export.websiteexport import WebsiteExport


log = logging.getLogger(__name__)
_   = gettext.gettext


class ExportPage(Resource):
    """
    The ExportPage is responsible for exporting the current project
    """
    def __init__(self):
        """
        Initialize
        """
        Resource.__init__(self)
        self.menuPane = MenuPane()
        self.package  = None
        self.url      = ""
        self.message  = ""
        self.scormStr = ""
        self.webStr   = ""
        

    def process(self, request):
        """
        Save the current package 
        """
        log.debug("process " + repr(request.args))
        
        self.url = request.path
        packageName = request.prepath[0]
        self.package = g_packageStore.getPackage(packageName)
        self.scormStr = ""
        self.webStr  = ""
        
        if "exportMethod" in request.args:
            if request.args["exportMethod"][0] == "webpage":
                self.webStr = "selected"

            elif request.args["exportMethod"][0] == "scorm":
                self.scormStr = "selected"
       
        if "export" in request.args:
            dataDir = g_webInterface.config.getDataDir() 
            os.chdir(dataDir)
            
            if request.args["exportMethod"][0] == "webpage":
                websiteExport = WebsiteExport(WebsiteExport.Web)
                websiteExport.exportWeb(self.package)

            elif request.args["exportMethod"][0] == "scorm":
                websiteExport = WebsiteExport(WebsiteExport.SCORM)
                websiteExport.exportScorm(self.package)
            
            self.message = \
                _("The course package has been exported successfully.")


    def render_GET(self, request):
        """
        Called for all requests to this object
        """
        
        # processing 
        log.debug("render_GET")
        self.process(request)
        self.menuPane.process(request)
                        
        # Rendering
        
        html  = common.header() + common.banner()
        html += self.menuPane.render()
        html += "<form method=\"post\" action=\"%s\">" % self.url        
        html += "<br/><b>" + self.message+ "</b><br><br/>"   
        html += """<select onchange="submit()" name="exportMethod">            
        <option value="webpage" %s>%s</option>
        <option value="scorm" %s>%s</option>
        </select>
        """ % (self.webStr, _("Web Page"), self.scormStr, _("SCORM"))
        html += _(" Please select a export method") + "<br/>"
        html += "<br/>" + common.submitButton("export", _("Export"))
        html += "<br/></form>"
        html += common.footer()
        self.message = ""
        
        return html
    
    render_POST = render_GET
