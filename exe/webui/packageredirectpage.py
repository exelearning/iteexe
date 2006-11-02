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
from exe.webui.renderable import RenderableResource
from exe.xului.mainpage   import MainPage
from twisted.web          import static

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
        self.cache = self.makeCache()
        self.styleCache = self.makeStyleCache
        # We only do ONE package at a time now!
        self.currentMainPage = None
        # This is a twisted timer
        self.stopping = None

    def makeCache(self):
        """
        Creates a dictionary of magic filenames
        """
        dontImportDirs = ['.svn', 'style', 'tinymce', 'win-profile', 'linux-profile']
        cache = {}
        for fn in self.config.resourceDir.walkfiles():
            name = str(fn.basename())
            if name in cache:
                raise Exception('Two resource files with same name: "%s" and "%s"' % (fn, cache[name].path))
            for badDir in dontImportDirs:
                if badDir in fn:
                    break
            else:
                cache[name] = static.File(fn.abspath())
        return cache

    def makeStyleCache(self):
        """
        Returns a mapping of style name to {filename -> static.File} dict
        """
        cache = {}
        for style in self.config.styles:
            cache[style] = subCache = {}
            for fn in self.config.resourceDir/'exportable'/'style'/style:
                if name in cache:
                    raise Exception('Two style files with same name: "%s" and "%s"' % (fn, cache[name].path))
                subCache[str(fn.basename())] = static.File(fn)
        return cache

    def getChild(self, name, request):
        """
        Get the child page for the name given.
        This is called if our ancestors can't find our child.
        This is probably because the url is in unicode
        """
        if name == '':
            return self
        else:
            # Get rid of any path components of 'name'
            if request.postpath:
                end = request.postpath[-1]
            else:
                end = name
            result = self.cache.get(end)
            ##print end, result.path
            if result is None:
                # Ask out 
                # Check the style cache
                result = self.styleCache.get(self.currentMainPage.packge.style)
                if result is None:
                    # This will just raise an error
                    return RenderableResource.getChild(self, name, request)
            return result

    def bindNewPackage(self, package):
        """
        Binds 'package' to the appropriate url
        and creates a MainPage instance for it
        and a directory for the resource files

        In the GTK version, this should actually
        redirect people to MainPage. Copy from
        svn revision 1311 to re-enable gtk.
        """
        # Reduce memory leaks
        if self.currentMainPage:
            del self.children[self.currentMainPage.name]
        # Now this is our "ONLY" loaded package
        self.currentMainPage = MainPage(self, package)
        print self.children

    def render_GET(self, request):
        """
        Create a new package and redirect the webrowser to the URL for it
        """
        log.debug("render_GET" + repr(request.args))
        # Create new package
        package = self.packageStore.createPackage()
        self.bindNewPackage(package)
        log.info("Created a new package name="+ package.name)
        # Tell the web browser to show it
        request.redirect(package.name.encode('utf8'))
        return ''

