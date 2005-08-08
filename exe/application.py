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
The Main Application Object
"""

import os
import sys
from getopt import getopt, GetoptError
from exe.webui.webserver     import WebServer
# must import reactor AFTER WebServer. It's yucky, but that's life
from twisted.internet import reactor
from exe.webui.mainwindow    import MainWindow
from exe.engine.idevicestore import IdeviceStore
from exe.engine.packagestore import PackageStore
from exe.engine              import version
import logging
import gettext
_   = gettext.gettext
 
log = logging.getLogger(__name__)


class Application:
    """
    Main application class, pulls together everything and runs it.
    """

    def __init__(self):
        """
        Initialize
        """
        self.config       = None
        self.packageStore = None
        self.ideviceStore = None
        self.packagePath  = None
        self.server       = None


    def main(self):
        """
        Main function, starts eXe
        """
        self.processArgs()
        self.loadConfiguration()
        self.preLaunch()
        reactor.callWhenRunning(self.launch)
        self.serve()


    def processArgs(self):
        """
        Processes the command line arguments
        """
        try:
            options, packages = getopt(sys.argv[1:], 
                                       "hV", ["help", "version"])
        except GetoptError:
            self.usage()
            sys.exit(2)

        if len(packages) == 1:
            self.packagePath = packages[0]

        elif len(packages) > 1:
            self.usage()
            sys.exit(2)

        for option in options:
            if option[0] in ("-V", "--version"):
                print "eXe", version.version
                sys.exit()
            if option[0] in ("-h", "--help"):
                self.usage()
                sys.exit()

    
    def loadConfiguration(self):
        """
        Loads the config file and applies all the settings
        """
        if sys.platform[:3] == "win":
            from exe.engine.winconfig import WinConfig
            self.config = WinConfig()
        elif sys.platform[:6] == "darwin":
            from exe.engine.macconfig import MacConfig
            self.config = MacConfig()
        else:
            from exe.engine.linuxconfig import LinuxConfig
            self.config = LinuxConfig()
        log.debug("logging set up")


    def preLaunch(self):
        """
        Sets ourself up for running 
        Needed for unit tests
        """
        log.debug("preLaunch")
        self.packageStore = PackageStore()
        self.ideviceStore = IdeviceStore(self.config)
        self.ideviceStore.load()
        self.server = WebServer(self)


    def serve(self):
        """
        Starts the web server,
        this func doesn't return until after the app has finished
        """
        print "Welcome to eXe: the eLearning XHTML editor"
        log.info("eXe running...")
        self.server.run()
    
    def launch(self):
        """
        launches the webbrowser
        """
        if self.packagePath:
            package = self.packageStore.loadPackage(self.packagePath)
            log.debug("loading package "+package.name)
            self.server.root.bindNewPackage(package)
            window = MainWindow(self, package.name)
            window.show_all()
        else:
            window = MainWindow(self, "")
            window.show_all()

    def usage(self):
        """
        Print usage info
        """
        print "Usage: "+os.path.basename(sys.argv[0])+" [OPTION] [PACKAGE]"
        print "  -V, --version    print version information and exit"
        print "  -h, --help       display this help and exit"
        print "Settings are read from exe.conf "
        print "in $HOME/.exe on Linux/Unix or"
        print "in Documents and Settings/<user name>/Application Data/exe "
        print "on Windows"
