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


from twisted.internet import reactor
from twisted.internet.error import CannotListenError
from twisted.web import server
from twisted.web import static
import os
import os.path
import sys
from exe.engine.config import Config
from exe.webui.newpackagepage import NewPackagePage
from exe.webui.webinterface import g_webInterface
import logging
 

log = logging.getLogger(__name__)

def main():
    """
    Main function, starts the webserver
    """
    config = Config("exe.conf")
    g_webInterface.config = config
    config.setupLogging("exe.log")
    log.info("Starting eXe")
    
    root   = NewPackagePage()
    g_webInterface.rootPage = root
    
    root.putChild("images",  static.File(config.exeDir+"/images"))
    root.putChild("css",     static.File(config.exeDir+"/css"))   
    root.putChild("scripts", static.File(config.exeDir+"/scripts"))
    root.putChild("style",   static.File(config.exeDir+"/style/default"))

    launchBrowser(config.port)  
    try:
        reactor.listenTCP(config.port, server.Site(root))
    except CannotListenError:
        pass
    else:
        reactor.run()


def launchBrowser(port):
    """
    Launch the webbrowser (Firefox) for this platform
    """
    if sys.platform[:3] == "win":
        import _winreg
        registry = _winreg.ConnectRegistry(None, _winreg.HKEY_LOCAL_MACHINE)
        key      = _winreg.OpenKey(registry, 
                                   r"SOFTWARE\Mozilla\Mozilla Firefox 1.0\bin")
        path     = _winreg.QueryValueEx(key, "PathToExe")[0]
        _winreg.CloseKey(key)
        _winreg.CloseKey(registry)
        
        command = path
        url = 'http://localhost:%d' % port
        log.info("Launch firefox with "+command)
        os.spawnl(os.P_DETACH, command, '"' + command + '"', url)
    else:
        os.system("firefox http://localhost:%d&"%port)
    print "Welcome to eXe: the eLearning XML editor"
    log.info("eXe running...")

if __name__ == "__main__":
    main()
