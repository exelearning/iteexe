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
StyleMenu is responsible for creating the XHTML for the styles menu
"""

import logging
import gettext
from exe.webui.renderable import Renderable
from nevow import stan
log = logging.getLogger(__name__)
_   = gettext.gettext


# ===========================================================================
class StyleMenu(Renderable):
    """
    StyleMenu is responsible for creating the XHTML for the styles menu
    """
    name = 'stylePane'

    def process(self, request):
        """ 
        Get current package
        """
        log.debug("process")
        
        if ("action" in request.args and 
            request.args["action"][0] == "ChangeStyle"):
            log.debug("changing style to "+args["object"][0])
            self.package.style = request.args["object"][0]
            
            
    def render(self, ctx, data):
        """
        Returns an XUL string for viewing this pane
        """
        log.debug("render")
        # Render the start tags
        xul  = "<!-- Styles Pane Start -->\n"
        xul += "<menupopup>\n"

        # Render each style individually
        for style in self.config.styles:
            xul += "  <menuitem label=\""+style+"\" "
            xul += "onclick=\"submitLink('ChangeStyle', '"+style+"', 1);\"/>\n"

        # Render the end tags
        xul += "</menupopup>\n"
        xul += "<!-- Styles Pane End -->\n"
        return stan.xml(xul)
        
    
# ===========================================================================
