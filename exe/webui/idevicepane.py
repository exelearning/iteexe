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
from exe.engine.simpleidevice   import SimpleIdevice
from exe.engine.freetextidevice import FreeTextIdevice

log = logging.getLogger(__name__)
_   = gettext.gettext

from exe.webui.simpleblock   import SimpleBlock
from exe.webui.freetextblock import FreeTextBlock


# ===========================================================================
class IdevicePane(object):
    """
    IdevicePane is responsible for creating the XHTML for iDevice links
    """
    def process(self, request, package):
        """ 
        Process the request arguments to see if we're supposed to 
        add an iDevice
        """
        if ("action" in request.args and 
            request.args["action"][0] == "AddIdevice"):

            if request.args["object"][0] == "FreeTextIdevice":
                package.currentNode.addIdevice(FreeTextIdevice())

            elif request.args["object"][0] == "SimpleIdevice":
                package.currentNode.addIdevice(SimpleIdevice())
            
            
    def render(self):
        """
        Returns an XHTML string for viewing this pane
        """
        log.debug("render")
        
        html  = "<div>\n"
        
        html += common.submitLink("AddIdevice", "FreeTextIdevice",
                                  _("Free Text iDevice"))
        html += "<br/>\n"
        html += common.submitLink("AddIdevice", "SimpleIdevice", 
                                  _("Simple iDevice"))
        html += "</div> \n"

        return html
        
        


    
# ===========================================================================
