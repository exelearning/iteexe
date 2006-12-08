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
from exe.xului.mainpage       import MainPage
from exe.webui.renderable     import RenderableLivePage
from nevow                    import inevow
from twisted.internet         import reactor
from twisted.internet.defer   import Deferred

log = logging.getLogger(__name__)


class PackageRedirectPage(RenderableLivePage):
    """
    PackageRedirectPage is the first screen the user loads.  It doesn't show
    anything it just redirects the user to a new package or loads an existing 
    package.
    """
    
    # Default attribute values
    _templateFileName = 'root.xul'
    name = '/'
    closing = None
    package = None

    def __init__(self, webServer):
        """
        Initialize
        """
        RenderableLivePage.__init__(self, None, None, webServer)
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
                return result
            else:
                # This will just raise an error
                return RenderableResource.getChild(self, name, request)

    def bindNewPackage(self, package):
        """
        Binds 'package' to the appropriate url
        and creates a MainPage instance for it
        and a directory for the resource files

        In the GTK version, this should actually
        redirect people to MainPage. Copy from
        svn revision 1311 to re-enable gtk.
        """
        self.package = package
        MainPage(self, package)

    def goingLive(self, ctx, client):
        """
        Create a new package and stick it in a frame
        """
        if self.closing:
            self.closing.cancel()
            self.closing = None
        # Create new package
        package = self.packageStore.createPackage()
        self.bindNewPackage(package)
        log.info("Created a new package name=" + package.name)
        # Render it in a frame
        inevow.IRequest(ctx).setHeader('content-type', 'application/vnd.mozilla.xul+xml')
        # Sign up to know the connection is closed 
        # Get the clientHandle (poll every 60 seconds, call onClose if poll fails 
        # 9999 times in a row. (When dialogs are open on client polling fails) 
        self.client = self.clientFactory.newClientHandle(self, 60, 9999)
        d = Deferred()
        d.addCallbacks(self.onClose, self.onClose) 
        self.client.closeNotifications.append(d) 

    def render_frame(self, ctx, data):
        """
        Make the big iframe in the middle point to our package
        """
        return ctx.tag(src=self.package.name)

    def onClose(self, reason, data=None): 
        """ 
        Called when the user has closed the window 
        """ 
        print 'Closing'
        if self.package is not None:
            print 'Saving', self.package.name
            self.package.save(self.config.configDir/'unsavedWork.elp', True) 
        self.closing = reactor.callLater(1, reactor.stop)


