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
PropertiesPane is responsible for creating the XHTML for the properties pane
"""

import logging
import gettext
from exe.webui import common
from exe.webui.webinterface import g_webInterface

log = logging.getLogger(__name__)
_   = gettext.gettext


# ===========================================================================
class PropertiesPane(object):
    """
    PropertiesPane is responsible for creating the XHTML for the properties pane
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
        self.package = g_webInterface.packageStore.getPackage(packageName)  
             
        if "title" in request.args:
            self.package.root.title.title = request.args["title"][0]
            
        if "author" in request.args:   
            self.package.author = request.args["author"][0]
            
        if "description" in request.args:    
            self.package.description = request.args["description"][0]
            
        if "style" in request.args:    
            self.package.style = request.args["style"][0]
            
        if "level1" in request.args:    
            self.package.levelNames[0] = request.args["level1"][0]
            
        if "level2" in request.args:    
            self.package.levelNames[1] = request.args["level2"][0]
            
        if "level3" in request.args:    
            self.package.levelNames[2] = request.args["level3"][0]
        
            
    def render(self):
        """Returns an XHTML string for viewing this pane"""
        log.debug("render")
        
        html  = "<form method=\"post\" action=\"%s\">" % self.url
        html += "<b>Package title:</b><br/>\n"
        html += common.textInput("title", self.package.root.title) + "<br/>\n"
        html += "<b>Author:</b><br/>\n"
        html += common.textInput("author", self.package.author) + "<br/>\n"
        html += "<b>Description:</b><br/>\n"
        html += common.textArea("description", self.package.description)
        html += "<br/>\n"
        html += "<b>Taxonomy:</b><br/>\n" 
        html += "Level 1 <br/>\n"
        html += common.textInput("level1", self.package.levelNames[0])
        html += "<br/>\n"
        html += "Level 2 <br/>\n"
        html += common.textInput("level2", self.package.levelNames[1])
        html += "<br/>\n"
        html += "Level 3 <br/>\n"
        html += common.textInput("level3", self.package.levelNames[2])
        html += "<br/>\n"
        html += common.submitButton("done", _("Done"))
        html += "<br/></form>\n"
                             
        return html
        
        


    
# ===========================================================================
