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
from twisted.web.resource import Resource

log = logging.getLogger(__name__)
_   = gettext.gettext


# ===========================================================================
class PropertiesPane(object):
    """
    PropertiesPane is responsible for creating the XHTML for the package pane
    """
    def __init__(self):
        pass


    def render(self):
        """
        Returns an XHTML string for viewing this pane
        """
        return ""
        
    def process(self, request):
        """
        Write description
        """
        pass
        
        
class TestPage(Resource):
    def __init__(self):
        Resource.__init__(self)
        self.pane = PropertiesPane()

    def getChild(self, name, request):
        if name == '':
            return self
        else:
            return Resource.getChild(self, name, request)

    def render_GET(self, request):
        self.pane.process(request)
        html = "<html><head><title>TestPage</title></head><body>"
        html += self.pane.render()
        html += "</body></html>"
        return html
                  


# ===========================================================================
