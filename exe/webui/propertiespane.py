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
        Write description
        """
        self.url    = request.path
        packageName = request.prepath[0]
        self.package = g_packageStore.getPackage(packageName)      
        if "title" in request.args:
            self.package.title = request.args["title"][0]
            
        if "author" in request.args:   
            self.package.author = request.args["author"][0]
            
        if "description" in request.args:    
            self.package.description = request.args["description"][0]
        
            
    def render(self):
        #Returns an XHTML string for viewing this pane
        
        html  = "<form method=\"post\" action=\"%s\">" % self.url
        html += "<b>Course title:</b><br/>"
        html += "<input type=\"text\" name=\"title\" " 
        html += "value=\"%s\" " % self.package.title
        html += "size=\"60\"><br/>" 
        html += "<b>Author:</b><br/>"
        html += "<input type=\"text\" name=\"author\" "
        html += "value=\"%s\"" % self.package.author
        html += "size=\"60\"><br/>" 
        html += "<b>Description:</b><br/>"
        html += "<textarea name=\"description\" "
        html += "cols=\"59\" rows=\"8\">%s" % self.package.description
        html += "</textarea><br/>" 
        html += "<input type=\"submit\" name=\"done\" "
        html += "value=\"%s\">" %  _("Done")
        html += "<br/></form>"
                             
        return html
        
        


    
# ===========================================================================
