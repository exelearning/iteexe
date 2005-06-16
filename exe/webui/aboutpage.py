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
The EditorPage is responsible for managing iDevices
"""

import logging
import gettext
from twisted.web.resource import Resource
from exe.webui.renderable import RenderableResource
from exe.engine.version   import project, release, revision


log = logging.getLogger(__name__)
_   = gettext.gettext


class AboutPage(RenderableResource):
    """
    The AboutPage is responsible for showing about imformation
    """

    name = 'about'

    def __init__(self, parent):
        """
        Initialize
        """
        RenderableResource.__init__(self, parent)

        
    def getChild(self, name, request):
        """
        Try and find the child for the name given
        """
        if name == "":
            return self
        else:
            return Resource.getChild(self, name, request)

    def render_GET(self, request):
        """Called for all requests to this object"""
        
        # Processing 
        log.debug("render_GET")
        # Rendering
        request.setHeader('content-type',
                          'application/vnd.mozilla.xul+xml')
        xulStr= """<?xml version="1.0"?> 
        
        <?xml-stylesheet href="chrome://global/skin/" type="text/css"?> 
        <?xml-stylesheet href="/css/aboutDialog.css" type="text/css"?>
        
        <window xmlns:html="http://www.w3.org/1999/xhtml"
                xmlns="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul"
                id="aboutDialog"
                title="About eXe"
                style="width: 299px">
            
          <deck id="modes" flex="1">
            <vbox flex="1" id="clientBox">
              <label id="version" value="%s Version %s"/>
              <label style="text-align: center;" value="$Revision: %s $" />
              <description id="copyright">Copyright University of Auckland, 2005.<html:br/>
        
              </description>
              <vbox id="detailsBox" align="center" flex="1">
                <iframe id="creditsIframe" src="/docs/credits.xhtml" width="280px" flex="1"/>
              </vbox>
            </vbox>
          </deck>
          <separator class="groove" id="groove"/>
        
        </window>""" %(project, release, revision)
        return xulStr.encode('utf8')
    
    render_POST = render_GET

