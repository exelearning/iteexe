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

import os.path
import logging
import gettext
import pickle
import os
from twisted.web.resource import Resource
from exe.webui import common
from exe.engine.packagestore import g_packageStore
from exe.webui.webinterface import g_webInterface
from exe.webui.menupane import MenuPane


log = logging.getLogger(__name__)
_   = gettext.gettext


class SavePage(Resource):
    """
    The SavePage is responsible for saving the current project
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
        self.isSaved  = False
        
    def process(self, request):
        """
        Save the current package 
        """
        log.debug("process " + repr(request.args))
        
        self.isSaved = False
        self.url = request.path
        packageName = request.prepath[0]
        self.package = g_packageStore.getPackage(packageName)
        
        if "save" in request.args:
            dataDir = g_webInterface.config.getDataDir() 
            os.chdir(dataDir)
            fileName = request.args["fileName"][0]
            if not fileName.endswith(".elp"):
                fileName = fileName + ".elp"
              
            log.info("saving " + fileName)
            outfile = open(fileName, "w")
            pickle.dump(self.package, outfile)
            self.package.name = os.path.splitext(os.path.basename(fileName))[0]
            self.message = _("The course package has been saved successfully.")

    def render_GET(self, request):
        """Called for all requests to this object"""
        
        # Processing 
        log.debug("render_GET")
        self.process(request)
        self.menuPane.process(request)
                        
        # Rendering
        html  = common.header() + common.banner()
        html += self.menuPane.render()
        html += "<form method=\"post\" action=\"%s\">" % self.url        
        html += "<br/><b>" + self.message+ "</b>"           
        html += "<br/>%s<br/>" % _("Please enter a filename")
        html += common.textInput("fileName", self.package.name+".elp")
        html += "<br/><br/>"
        html += common.submitButton("save", _("Save"))
        html += "<br/></form>"
        html += common.footer()
        self.message = ""
        
        return html
    
    render_POST = render_GET
