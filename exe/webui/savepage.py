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
import pickle
from twisted.web import static
from twisted.web.resource import Resource
from exe.webui import common
from exe.engine.packagestore import g_packageStore
from exe.webui.menupane import MenuPane

log = logging.getLogger(__name__)
_   = gettext.gettext


class SavePage(Resource):
    """
    The SavePage is responsible for saving the current project
    """
    
    def __init__(self):
        Resource.__init__(self)
        self.menuPane = MenuPane()
        self.package  = None
        
    def process(self, request):
        
        packageName = request.prepath[0]
        self.package = g_packageStore.getPackage(packageName)
        
        if "action" in request.args and "Save" == request.args["action"][0]:
            fileName = request.args["fileName"]
            outfile = open(fileName, "w")
            pickle.dump(self.package, outfile)
            

    def render_GET(self, request):
        
        # processing
      
        log.info("creating the save page")
        self.process(request)
        self.menuPane.process(request)
                        
        # Rendering
        
        html  = common.header() + common.banner()
        html += self.menuPane.render()
        html += "<br/>Please enter a file name<br/>"
        html += common.textInput("fileName") + "<br/><br/>"
        html += common.submitLink("Save", "Save", "")
        
        return html
    
    render_POST = render_GET