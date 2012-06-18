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
PackageRedirectPage is the first screen the user loads.  It doesn't show
anything it just redirects the user to a new package.
"""

import logging
from exe.webui.renderable     import RenderableResource
#from exe.xului.mainpage import MainPage
from exe.jsui.mainpage import MainPage

log = logging.getLogger(__name__)


class PackageRedirectPage(RenderableResource):
    """
    PackageRedirectPage is the first screen the user loads.  It doesn't show
    anything it just redirects the user to a new package or loads an existing 
    package.
    """
    
    name = '/'

    def __init__(self, webServer):
        """
        Initialize
        """
        RenderableResource.__init__(self, None, None, webServer)
        self.webServer = webServer
        # See if all out main pages are not showing
        # This is a twisted timer
        self.stopping = None

    def getChild(self, name, request):
        """
        Get the child page for the name given.
        This is called if our ancestors can't find our child.
        This is probably because the url is in unicode
        """
        if name == '':
            return self
        else:
            result = self.children.get(unicode(name, 'utf8'))
            if result is not None:
                if len(result) == 1:
                    return result[0]
                else:
                    for mainpage in result:
                        if mainpage.packageStore == request.getSession().packageStore:
                            return mainpage
            # This will just raise an error
            return RenderableResource.getChild(self, name, request)

    def getChildWithDefault(self, path, request):
        """Retrieve a static or dynamically generated child resource from me.

        First checks if a resource was added manually by putChild, and then
        call getChild to check for dynamic resources. Only override if you want
        to affect behaviour of all child lookups, rather than just dynamic
        ones.

        This will check to see if I have a pre-registered child resource of the
        given name, and call getChild if I do not.
        """
        
        if path == '':
            return self
        result = self.children.get(unicode(path, 'utf8'))
        if result is not None:
            if len(result) == 1:
                if isinstance(result[0], MainPage):
                    if result[0].session.uid == request.getSession().uid:
                        return result[0]
                else:
                    return result[0]
            else:
                for mainpage in result:
                    if mainpage.session.uid == request.getSession().uid:
                        return mainpage

        return RenderableResource.getChild(self, path, request)
    
    def putChild(self, path, child):
        result = self.children.get(path)
        if result is None:
            self.children[path] = [child]
        else:
            result.append(child)
        child.server = self.server
        
    def bindNewPackage(self, package, session):
        """
        Binds 'package' to the appropriate url
        and creates a MainPage instance for it
        and a directory for the resource files

	    In the GTK version, this should actually
        redirect people to MainPage. Copy from
	    svn revision 1311 to re-enable gtk.
        """
        MainPage(self, package, session)


    def render_GET(self, request):
        """
        Create a new package and redirect the webrowser to the URL for it
        """
        log.debug("render_GET" + repr(request.args))
        # Create new package
        session = request.getSession()
        package = session.packageStore.createPackage()
        self.bindNewPackage(package, session)
        log.info("Created a new package name="+ package.name)
        # Tell the web browser to show it
        request.redirect(package.name.encode('utf8'))
        return ''

