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
StylePane is responsible for creating the XHTML for the styles tab
"""

import logging
import gettext
from exe.webui import common
from exe.webui.webinterface import g_webInterface
log = logging.getLogger(__name__)
_   = gettext.gettext


# ===========================================================================
class StylePane(object):
    """
    StylePane is responsible for creating the XHTML for the styles tab
    """
    def __init__(self):
        self.__package = None

    def process(self, request, package):
        """ 
        Get current package
        """
        log.debug("process")
        self.__package = package
        
        if ("action" in request.args and 
            request.args["action"][0] == "ChangeStyle"):
            self.__package.style = request.args["object"][0]
            
            
    def render(self):
        """
        Returns an XHTML string for viewing this pane
        """
        log.debug("render")
        
        html = "<div>\n"
        options = [(style, style) for style in g_webInterface.config.styles]
        for option, value in options:
            html += common.submitLink("ChangeStyle", option, value, "", 1)
            html += "<br/>\n"
        
        html += "</div>\n"
        return html

        
    

    
# ===========================================================================
