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
class AddNodePane(object):
    """
    AddNodePane is responsible for creating the XHTML for add nodes links
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
            
            
    def render(self):
        #Returns an XHTML string for viewing this pane
        
        html += ""
                             
        return html
        
        


    
# ===========================================================================
