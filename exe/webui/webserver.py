#!/usr/bin/python
# ===========================================================================
# eXe
# Copyright 2004-2005, University of Auckland
#
# This module is for the TwiSteD web server.
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
Webserver module
"""


from twisted.internet import reactor
from twisted.internet.error import CannotListenError
from nevow import appserver
from twisted.web import static
import os
import os.path
import sys
from exe.engine.config import Config
from exe.webui.packageredirectpage import PackageRedirectPage
#from exe.engine.packagestore  import g_packageStore
from exe.webui.errorpage import ErrorPage
import logging
import gettext
_   = gettext.gettext
 
log = logging.getLogger(__name__)

class WebServer:
    def __init__(self, config):
        self.config = config
        self.root   = None

    def run(self):
        root = PackageRedirectPage(self.config)   
        webDir = self.config.webDir
        root.putChild("images",  static.File(webDir+"/images"))
        root.putChild("css",     static.File(webDir+"/css"))   
        root.putChild("scripts", static.File(webDir+"/scripts"))
        root.putChild("style",   static.File(webDir+"/style"))
        self.root = root

        try:
            reactor.listenTCP(self.config.port, appserver.NevowSite(root), 
                              interface="127.0.0.1")
        except CannotListenError:
            pass
        else:
            reactor.run()

"""
    isWrongfile = False
    root = None
    if len(sys.argv) > 1:
        filePath = sys.argv[1] 
        try:  
            package = g_packageStore.loadPackage(filePath)
        except:
            errMessage  = _("Wrong file format,")
            errMessage += _(" please shut down eXe and try again")
            print errMessage
            root = ErrorPage(errMessage)
            isWrongfile = True
        else:
            root = PackageRedirectPage(package)
    else:   
        root   = PackageRedirectPage()   
    
    if not isWrongfile:
        g_webInterface.rootPage = root
        #TODO Find a better way to deal with these globals :-(
        g_webInterface.packageStore = g_packageStore
        
        root.putChild("images",  static.File(config.exeDir+"/images"))
        root.putChild("css",     static.File(config.exeDir+"/css"))   
        root.putChild("scripts", static.File(config.exeDir+"/scripts"))
        root.putChild("style",   static.File(config.exeDir+"/style"))

    launchBrowser(config.port)  
    try:
        reactor.listenTCP(config.port, appserver.NevowSite(root), interface="127.0.0.1")
    except CannotListenError:
        pass
    else:
        reactor.run()
"""

if __name__ == "__main__":
    class MyConfig:
        def __init__(self):
            self.port    = 8081
            self.dataDir = "."
            self.webDir  = "."
            self.exeDir  = "."
            self.styles  = ["default"]
    server = WebServer(MyConfig())
    server.run()
