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

import sys
import logging
import gettext
from exe.webui import common
from exe.engine.packagestore import g_packageStore

log = logging.getLogger(__name__)
_   = gettext.gettext


# ===========================================================================
class PropertiesPane(object):
    """
    PropertiesPane is responsible for creating the XHTML for the package pane
    """
    def __init__(self):
        self.package = None
        self.url     = ""

    def process(self, request):
        """ 
        Process what the user has submitted
        """
        self.url    = request.path
        packageName = request.prepath[0]
        self.package = g_packageStore.getPackage(packageName)  
             
        if "title" in request.args:
            self.package.root.title.title = request.args["title"][0]
            
        if "author" in request.args:   
            self.package.author = request.args["author"][0]
            
        if "description" in request.args:    
            self.package.description = request.args["description"][0]
            
        if "level1" in request.args:    
            self.package.levelNames[0] = request.args["level1"][0]
            
        if "level2" in request.args:    
            self.package.levelNames[1] = request.args["level2"][0]
            
        if "level3" in request.args:    
            self.package.levelNames[2] = request.args["level3"][0]
        
            
    def render(self):
        """Returns an XHTML string for viewing this pane"""
        log.debug("render")
        _ = self.package.getLanguage()
        html  = "<form method=\"post\" action=\"%s\">" % self.url
        html += "<b>Package title:</b><br/>"
        html += common.textInput("title", self.package.root.title) + "<br/>"
        html += "<b>Author:</b><br/>"
        html += common.textInput("author", self.package.author) + "<br/>"
        html += "<b>Description:</b><br/>"
        html += common.textArea("description", self.package.description)
        html += "<br/>"
        html += "<b>Taxonomy:</b><br/>" 
        html += "Level 1 <br/>"
        html += common.textInput("level1", self.package.levelNames[0]) + "<br/>"
        html += "Level 2 <br/>"
        html += common.textInput("level2", self.package.levelNames[1]) + "<br/>"
        html += "Level 3 <br/>"
        html += common.textInput("level3", self.package.levelNames[2]) + "<br/>"
        html += "<br/>" + common.submitButton("done", _("Done"))
        html += "<br/></form>"
                             
        return html
        
        


    
# ===========================================================================
