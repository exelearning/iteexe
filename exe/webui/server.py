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
from twisted.web import server
from twisted.web import static
import os
import os.path
import sys
from exe.engine.config import Config
from exe.webui.newpackagepage import NewPackagePage
from exe.webui.webinterface   import g_webInterface
from exe.engine.packagestore  import g_packageStore
import logging
 
log = logging.getLogger(__name__)

def main():
    """
    Main function, starts the webserver
    """
    config = Config("exe.conf")
    config.setupLogging("exe.log")
    config.loadStyles()
    g_webInterface.config = config
    log.info("Starting eXe")
    
    root   = NewPackagePage()
    g_webInterface.rootPage = root

    #TODO Find a better way to deal with these globals :-(
    g_webInterface.packageStore = g_packageStore
    
    root.putChild("images",  static.File(config.exeDir+"/images"))
    root.putChild("css",     static.File(config.exeDir+"/css"))   
    root.putChild("scripts", static.File(config.exeDir+"/scripts"))
    root.putChild("style",   static.File(config.exeDir+"/style"))

    launchBrowser(config.port)  
    try:
        reactor.listenTCP(config.port, server.Site(root), interface="127.0.0.1")
    except CannotListenError:
        pass
    else:
        reactor.run()


def launchBrowser(port):
    """
    Launch the webbrowser (Firefox) for this platform
    """
    if sys.platform[:3] == "win":
        #TODO refactor this into a separate function or class
        
        if not g_webInterface.config.browserPath:
            try:
                import _winreg
                registry = _winreg.ConnectRegistry(None, 
                                                   _winreg.HKEY_LOCAL_MACHINE)
                key1 = _winreg.OpenKey(registry, 
                                       r"SOFTWARE\Mozilla\Mozilla Firefox")
                currentVersion = _winreg.QueryValueEx(key1, "CurrentVersion")[0]
                _winreg.CloseKey(key1)
                regPath = "SOFTWARE\\Mozilla\\Mozilla Firefox\\" + \
                          currentVersion + "\\Main"
                log.info("regPath Path:" + regPath)
                key2 = _winreg.OpenKey(registry, regPath)
                g_webInterface.config.browserPath = \
                          _winreg.QueryValueEx(key2, "PathToExe")[0]  
                log.info("Firefox Path:" + g_webInterface.config.browserPath)
                _winreg.CloseKey(key2)
                _winreg.CloseKey(registry)
            except WindowsError:
                g_webInterface.config.browserPath = None

        if not g_webInterface.config.browserPath:
            standardPath = "c:/program files/mozilla/bin/firefox"
            if os.path.exists(standardPath):
                g_webInterface.config.browserPath = standardPath
        
        if g_webInterface.config.browserPath:
            command = g_webInterface.config.browserPath
            log.info("Broswer path: " + command)
            url     = 'http://localhost:%d' % port
            log.info("Launch firefox with "+command)
            try:
                os.spawnl(os.P_DETACH, command, '"' + command + '"', url)
            except OSError:
                print "Cannot launch Firefox, please manually run Firefox"
                print "and go to", url     
    else:
        standardPath = g_webInterface.config.browserPath
        if standardPath:            
            os.system("%s http://localhost:%d&"%(standardPath, port))
        else:
            if sys.platform[:6] == "darwin":
                macPath = "/Applications/Firefox.app/Contents/MacOS/firefox"
                os.system("%s http://localhost:%d&"%(macPath, port))
            else:
                os.system("firefox http://localhost:%d&"%port)
        

    print "Welcome to eXe: the eLearning XML editor"
    log.info("eXe running...")

if __name__ == "__main__":
    main()
