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
MenuPane is responsible for creating the XHTML for the menu links
"""

import logging
import gettext
log = logging.getLogger(__name__)
_   = gettext.gettext


# ===========================================================================
class MenuPane(object):
    """
    MenuPane is responsible for creating the XHTML for the menu links
    """
    def __init__(self):
        self.prepath = ()
        self.packageName = ""
                
    def process(self, request):
        """ 
        Get package name
        """
        log.debug("process")
        self.prepath      = request.prepath
        self.packageName  = request.prepath[0]
    
    
    def render(self):
        """
        Returns an XHTML string for the menu
        """
        log.debug("render")
        html = ""
        html = "   <!--- start header --->\n"
        html += "<div id=\"header\">\n"
        html += "<ul>\n"
            
        if self.prepath[-1] == "export":
            html += "<li id=\"current\"><a href=\"#\">" + _("Export") 
            html += "</a></li>\n" 
        else:
            html += "<li><a href = \"http:/%s/export\">%s</a></li>\n" % \
                    (self.packageName, _("Export"))
            
        if self.prepath[-1] == "load":
            html += "<li id=\"current\"><a href=\"#\">" + _("Load") 
            html += "</a></li>\n"
        else:
            html += "<li><a href = \"http:/%s/load\">%s</a></li>\n" % \
                    (self.packageName, _("Load")) 
            
        if self.prepath[-1] == "save":
            html += "<li id=\"current\"><a href=\"#\">" + _("Save") 
            html += "</a></li>\n"
        else:
            html += "<li><a href = \"http:/%s/save\">%s</a></li>\n" % \
                    (self.packageName, _("Save"))
            
        if self.prepath[-1] == "properties":
            html += "<li id=\"current\"><a href=\"#\">" + _("Properties") 
            html += "</a></li>\n"
        else:
            html += "<li><a href = \"http:/%s/properties\">%s</a></li>\n" % \
                    (self.packageName, _("Properties"))

        if len(self.prepath) == 1:
            html += "<li id=\"current\"><a href=\"#\">" + _("Authoring") 
            html += "</a></li>\n"
        else:
            html += "<li><a href = \"http:/%s\">%s</a></li>\n" % \
                    (self.packageName, _("Authoring"))

        html += "</ul>\n" 
        html += "</div>" 
        html += "&nbsp;\n"
        html += "   <!--- end header --->\n"
        return html
        
# ===========================================================================
