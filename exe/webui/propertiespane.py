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
        html += "<table border=\"0\" cellspacing=\"6\">\n"
        html += "<tr><td><b>Project title:</b></td><td>\n"
        html += common.textInput("title", self.package.root.title, 54) + "</td>"
        html += "</tr><tr><td><b>Author:</b></td><td>\n"
        html += common.textInput("author", self.package.author, 54) + "</td></tr>\n"
        html += "<tr><td valign=\"top\"><b>Description:</b></td><td>\n"
        html += common.textArea("description", self.package.description)
        html += "</td></tr>\n"
        html += "<tr><td valign=\"top\"><b>Taxonomy:</b></td>"
        html += "<td valign=\"top\">Level 1: "
        html += common.textInput("level1", self.package.levelNames[0], 20)
        html += "<p>Level 2: "
        html += common.textInput("level2", self.package.levelNames[1], 20)
        html += "<p/>\n"
        html += "<p>Level 3: "
        html += common.textInput("level3", self.package.levelNames[2], 20)
        html += "<p/></td></tr><tr><td align=\"right\">\n"
        html += common.submitButton("done", _("Done"))
        html += "</td><td>&nbsp;</td></tr></table></form>\n"
                             
        return html
        
        


    
# ===========================================================================
