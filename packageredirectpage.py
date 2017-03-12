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
from exe.jsui.mainpage import MainPage
from twisted.web import error

from exe.engine.package      import Package
from apscheduler.schedulers.background import BackgroundScheduler

log = logging.getLogger(__name__)


class PackageRedirectPage(RenderableResource):
    """
    PackageRedirectPage is the first screen the user loads.  It doesn't show
    anything it just redirects the user to a new package or loads an existing 
    package.
    """
    
    name = '/'
    last_package = None
    

    def __init__(self, webServer, packagePath=None):
        """
        Initialize
        """
        RenderableResource.__init__(self, None, None, webServer)
        self.webServer = webServer
        self.packagePath = packagePath
        # See if all out main pages are not showing
        # This is a twisted timer
        self.stopping = None
        self.mainpages = {}

    def getChild(self, name, request):
        """
        Get the child page for the name given.
        This is called if our ancestors can't find our child.
        This is probably because the url is in unicode
        """
        if name == '':
            return self
        else:
            name = unicode(name, 'utf8')
            result = self.children.get(name)
            if result is not None:
                return result
            else:
                session = request.getSession()
                if self.packagePath:
                    session.packageStore.addPackage(self.package)
                    self.bindNewPackage(self.package, session)
                    self.packagePath = None
                if session.uid in self.mainpages.keys():
                    if name in self.mainpages[session.uid].keys():
                        return self.mainpages[session.uid][name]
                # This will just raise an error
                log.error("child %s not found. uri: %s" % (name, request.uri))
                log.error("Session uid: %s, Mainpages: %s" % (session.uid, self.mainpages))
                return error.NoResource("No such child resource %(resource)s. Try again clicking %(link)s" % {
                                        "resource": name.encode('utf-8'),
                                        "link": "<a href='%s'>%s</a>" % ('/', 'eXe')})


    def tick2(self,package):
	bkup = Package(package.name)
	bkup = Package('bakcup')
	package.root.copyToPackage(bkup)
	bkup.save(package.name+'.bk')



    def backup(self,package):
	print('bakupde '+package.name)
	scheduler = BackgroundScheduler()
	scheduler.add_job(self.tick2, 'interval',args=[package], seconds=30)
	scheduler.start()

    def bindNewPackage(self, package, session):
        """
        Binds 'package' to the appropriate url
        and creates a MainPage instance for it
        and a directory for the resource files
        """
        log.debug("Mainpages: %s" % self.mainpages)

        session_mainpages = self.mainpages.get(session.uid)
        if session_mainpages:
            session_mainpages[package.name] = MainPage(None, package, session, self.webServer)
        else:
            self.mainpages[session.uid] = {package.name: MainPage(None, package, session, self.webServer)}
#       log.debug("Mainpages: %s" % self.mainpages)

	self.backup(package)




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

