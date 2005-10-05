#!/usr/bin/python
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
Main Window module
"""

import sys
import shutil
import gtk
import gobject
import gtkmozembed
import time

import logging
log = logging.getLogger(__name__)

READY, BUSY, LOADPENDING, BLOCKED = range(4)

class BrowserPane(gtk.Frame):
    """
    Main window class
    """
    def __init__(self, mainWindow):
        """
        Initialize
        """
        log.debug("create MozEmbed browser")
        gtk.Frame.__init__(self)

        self.mainWindow = mainWindow
        self.config     = mainWindow.config
        self.isBlocked  = False
        self.url        = "http://127.0.0.1:%d" % self.config.port

        self.scrollWin = gtk.ScrolledWindow()
        self.add(self.scrollWin)
        self.scrollWin.set_policy(gtk.POLICY_AUTOMATIC, gtk.POLICY_AUTOMATIC)
        # setupMoz must be called before MozEmbed.__init__
        self.setupMoz()

        self.browser = gtkmozembed.MozEmbed()
        self.status     = READY
        self.scrollWin.add_with_viewport(self.browser)

        self.browser.connect("location", self.newLocation, "location")
#        self.browser.connect("visibility", self.what, "visibility")
#        self.browser.connect("net-start", self.netStarted)
#        self.browser.connect("net-stop",  self.netStopped)
#        self.browser.connect("open-uri",  self.openUri)
#        self.browser.connect("js-status", self.javaScriptStatus)
#        self.browser.connect("net-state",  self.what, "net-state")
#        self.browser.connect("progress",  self.what, "progress")
        self.currentLink = ""
#        self.browser.connect("link-message",  self.linkMessage, "link-message")
        self.loadUrl()


    def setupMoz(self):
        """
        Setup the component and profile paths for the Mozilla
        Gecko Runtime Engine
        """
        log.info(u"setupMoz greDir "+self.config.greDir)
        gtkmozembed.gtk_moz_embed_set_comp_path(self.config.greDir)

        if sys.platform[:3] == u"win":
            profile    = "win-profile"
        else:
            profile    = "linux-profile"

        if not (self.config.configDir/profile).exists():
            log.info("Creating FireFox profile copied from"+
                     self.config.webDir/profile+" to "+
                     self.config.configDir/profile)
            (self.config.webDir/profile).copytree(self.config.configDir/profile)

        log.info("setupMoz configDir "+self.config.configDir+
                 " profile "+profile)
        gtkmozembed.gtk_moz_embed_set_profile_path(self.config.configDir, 
                                                   profile)


    def refresh(self):
        """
        replace the browser with a new instance
        """
        self.browser.reload(gtkmozembed.FLAG_RELOADNORMAL)


    def loadUrl(self):
        """
        Load the package url in the browser
        Stupid, but it seems we need to load twice after doing a post
        REASON: gtkmozembed doesn't handle #currentBlock anchor?????
        """
        if self.status == READY:
            url = self.url+"/"+self.mainWindow.package.name+"/authoringPage"
            log.debug("loadUrl "+url)
            self.browser.load_url(url)
        else:
            log.debug("loadUrl status -> LOADPENDING")
            self.status = LOADPENDING


    def netStarted(self, *dummy):
        """
        Change status while we're waiting for the network
        """
        log.debug("netStarted status -> BUSY")
        print("netStarted status BUSY")
        if self.status == READY:
            self.status = BUSY
        else:
            self.status = BLOCKED


    def netStopped(self, *dummy):
        """
        Change status now network is finished, process pending loads
        """
        if self.status == LOADPENDING:
            log.debug("netStopped status LOADPENDING -> READY")
            print("netStopped status LOADPENDING -> READY")
            self.status = READY
            self.loadUrl()
        else:
            log.debug("netStopped status -> READY")
            print("netStopped status -> READY")
#            self.browser.show()
            self.status = READY


    def openUri(self, *dummy):
        """
        The user wants to load a new page, check status before allowing 
        """
        print "openUri", self.browser.get_location(), 
        print self.currentLink
        from pprint import pprint; pprint(dummy)
        if self.currentLink.startswith("exe://"):
            return True
        else:
            return False


    def javaScriptStatus(self, *dummy):
        """
        Note JavaScript gave a status
        """
        from pprint import pprint; pprint(dummy)
        status = self.browser.get_js_status()
        log.debug("javaScriptStatus "+status)
        print("javaScriptStatus "+status)


    def newLocation(self, *dummy):
        """
        Note we've changed location
        """
        url = self.browser.get_location()
        log.debug("newLocation "+url)
        self.mainWindow.newLocation(url)


    def linkMessage(self, *args):
        """
        Note a link hover
        """
        self.currentLink = self.browser.get_link_message()


    def what(self, *args):
        """
        Note we've changed location
        """
        from pprint import pprint; pprint(args)


