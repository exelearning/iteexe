# ===========================================================================
# eXe
# Copyright 2004-2006, University of Auckland
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
Displays a page with an error message
"""

import logging
from exe.webui import common
from twisted.web.resource import Resource

log = logging.getLogger(__name__)


class ErrorPage(Resource):
    """
    Displays a page with an error message
    """
    
    def __init__(self, errMessage):
        """
        Initialize
        """
        Resource.__init__(self)
        self.errMessage = errMessage
        
    def render_GET(self, request):
        """
        Create a new package and redirect the webrowser to the URL for it
        """
        log.info("render_GET" + repr(request.args))
                     
        # Rendering
        html = "<html><body>" 
        html += "<b>" + self.errMessage + "</b>"
        html += common.footer()
        return html
