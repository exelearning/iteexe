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
from twisted.web import server
from twisted.web import static
import os
import sys
from exe.engine.config import Config
from exe.webui.newpackagepage import NewPackagePage
from exe.webui.webinterface import g_webInterface
import logging

log = logging.getLogger(__name__)

def main():
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print "Usage:",sys.argv[0],"[port]"
            sys.exit(1)
    else:
        port = 8081
      
    config = Config("exe.conf")
    g_webInterface.config = config
    config.setupLogging("exe.log")
    log.info("Starting eXe")
    config.setDataDir()
    
    root   = NewPackagePage()
    g_webInterface.rootPage = root
    
    root.putChild("images", static.File("images"))
    root.putChild("css", static.File("css"))   
 
    reactor.listenTCP(port, server.Site(root))
    reactor.callWhenRunning(launchBrowser, port)
    reactor.run()


def launchBrowser(port):
    if sys.platform[:3] == "win":
        os.system("start http://localhost:%d"%port)        
    else:
        os.system("htmlview http://localhost:%d&"%port)
    print "Welcome to eXe: the eLearning XML editor"
    log.info("eXe running...")

if __name__ == "__main__":
    main()
