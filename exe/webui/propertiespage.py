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
The PropertiesPage is for user to enter or edit package's properties
"""

import logging
import gettext
from exe.webui import common
from twisted.web.resource import Resource
from exe.webui.propertiespane import PropertiesPane
from exe.webui.menupane import MenuPane

log = logging.getLogger(__name__)
_   = gettext.gettext


class PropertiesPage(Resource):
    """
    The PropertiesPage is for user to enter or edit package's properties
    """
    
    def __init__(self):
        """
        Initialize
        """
        Resource.__init__(self)
        self.menuPane       = MenuPane()
        self.propertiesPane = PropertiesPane()

    def render_GET(self, request):
        """
        Render the XHTML for the properties page
        """
        log.debug("render_GET"+ repr(request.args))
        
        # Processing
        log.info("creating the properties page")
        self.propertiesPane.process(request)
        self.menuPane.process(request)
                        
        # Rendering
        html  = common.header() + common.banner()
        html += self.menuPane.render()
        html += self.propertiesPane.render()
        html += common.footer()
        return html
    
    render_POST = render_GET
