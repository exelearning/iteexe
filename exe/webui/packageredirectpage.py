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
PackageRedirectPage is the first screen the user loads.  It doesn't show
anything it just redirects the user to a new package.
"""

import logging
import gettext
from twisted.web.resource import Resource
from twisted.web.error    import ForbiddenResource
from exe.webui import common
from exe.engine.packagestore  import g_packageStore
from exe.webui.mainpage  import MainPage

log = logging.getLogger(__name__)
_   = gettext.gettext


class PackageRedirectPage(Resource):
    """
    PackageRedirectPage is the first screen the user loads.  It doesn't show
    anything it just redirects the user to a new package or loads an existing 
    package.
    """
    
    def __init__(self, package = None):
        """
        Initialize
        """
        Resource.__init__(self)
        self.package = package

    def getChild(self, name, request):
        """
        Get the child page for the name given
        """
        if request.getClientIP() != '127.0.0.1':
            return ForbiddenResource(_("Access from remote clients forbidden"))
        elif name == '':
            return self
        else:
            return Resource.getChild(self, name, request)

    def render_GET(self, request):
        """
        Create a new package and redirect the webrowser to the URL for it
        """
        log.debug("render_GET" + repr(request.args))
        if self.package:
            package = self.package
        else:
            # Create new package
            package = g_packageStore.createPackage()
            log.info("Creating a new package name="+ package.name)

        mainPage = MainPage(package)
        self.putChild(package.name, mainPage)
        # Rendering
        request.redirect(package.name)
        return ''
