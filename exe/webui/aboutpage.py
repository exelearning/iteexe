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
The AboutPage is responsible for showing about information
"""

import logging
import gettext
from twisted.web.resource import Resource
from exe.webui.renderable import RenderableResource
from exe.engine           import version

log = logging.getLogger(__name__)
_   = gettext.gettext


# ===========================================================================
class AboutPage(RenderableResource):
    """
    The AboutPage is responsible for showing about information
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
        log.debug("render_GET")

        # Rendering
        request.setHeader('content-type',
                          'application/vnd.mozilla.xul+xml')
        xul  = u'<?xml version="1.0"?> \n'
        xul += u'<?xml-stylesheet href="chrome://global/skin/" '
        xul += u'type="text/css"?> \n'
        xul += u'<?xml-stylesheet href="/css/aboutDialog.css"  '
        xul += u'type="text/css"?>\n'
        
        xul += u'<window xmlns:html="http://www.w3.org/1999/xhtml"\n'
        xul += u'        xmlns="http://www.mozilla.org/keymaster/gatekeeper/'
        xul += u'there.is.only.xul"\n'
        xul += u'        id="aboutDialog"\n'
        xul += u'        title="About eXe"\n'
        xul += u'        style="width: 299px">\n'
        xul += u'  <deck id="modes" flex="1">\n'
        xul += u'    <vbox flex="1" id="clientBox">\n'
        xul += u'      <label id="version" \n'
        xul += u'             value="eXe Version '+version.release+'"/>\n'
        xul += u'      <label style="text-align: center;" \n'
        xul += u'             value="Revision: '+version.revision+'" />\n'
        xul += u'      <description id="copyright">Copyright University of '
        xul += u'Auckland, 2005.<html:br/>\n'
        xul += u'email: exe@auckland.ac.nz\n'
        xul += u'      </description>\n'
        xul += u'      <vbox id="detailsBox" align="center" flex="1">\n'
        xul += u'        <iframe id="creditsIframe" \n'
        xul += u'                src="/docs/credits.xhtml" \n'
        xul += u'                width="280px" flex="1"/>\n'
        xul += u'      </vbox>\n'
        xul += u'    </vbox>\n'
        xul += u'  </deck>\n'
        xul += u'  <separator class="groove" id="groove"/>\n'
        xul += u'</window>\n'

        return xul.encode('utf8')
    
    render_POST = render_GET

# ===========================================================================
