#!/usr/bin/python
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
Main application class, pulls together everything and runs it.
"""

import os
import sys
# Make it so we can import our own nevow and twisted etc.
if os.name == 'posix':
    sys.path.insert(0, '/usr/share/exe')
from getopt import getopt, GetoptError
from exe.webui.webserver     import WebServer
# Must import reactor AFTER WebServer. It's yucky, but that's life
from twisted.internet import reactor
from exe.webui.browser       import launchBrowser
from exe.engine.idevicestore import IdeviceStore
from exe.engine.packagestore import PackageStore
from exe.engine.translate    import installSafeTranslate
from exe.engine              import version
from exe                     import globals
import logging
 
log = logging.getLogger(__name__)

# Global application variable
globals.application = None

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
        self.webServer    = None
        self.standalone   = False # Used for the ready to run exe
        assert globals.application is None, "You tried to instantiate two Application objects"
        globals.application = self

    def main(self):
        """
        Main function, starts eXe
        """
        self.processArgs()
        self.loadConfiguration()
        installSafeTranslate()
        self.preLaunch()
        self.launch()
        log.info('serving')
        self.serve()
        log.info('done serving')


    def processArgs(self):
        """
        Processes the command line arguments
        """
        try:
            options, packages = getopt(sys.argv[1:], 
                                       "hV", ["help", "version", "standalone"])
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
            elif option[0] in ("-h", "--help"):
                self.usage()
                sys.exit()
            elif option[0].lower() == '--standalone':
                self.standalone = True

    
    def loadConfiguration(self):
        """
        Loads the config file and applies all the settings
        """
        if self.standalone:
            from exe.engine.standaloneconfig import StandaloneConfig
            self.config = StandaloneConfig()
        elif sys.platform[:3] == "win":
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
        # Make it so jelly can load objects from ~/.exe/idevices
        sys.path.append(self.config.configDir/'idevices')
        self.webServer = WebServer(self)


    def serve(self):
        """
        Starts the web server,
        this func doesn't return until after the app has finished
        """
        print "Welcome to eXe: the eLearning XHTML editor"
        log.info("eXe running...")
        self.webServer.run()

    def _loadPackage(self, packagePath):
        """
        Convenience function for loading the first package that we'll browse to
        """
        try:
            package = self.packageStore.loadPackage(packagePath)
            log.debug("loading package "+package.name)
            self.webServer.root.bindNewPackage(package)
            launchBrowser(self.config, package.name)
            return package
        except Exception, e:
            log.error('Error loading first Package (%s): %s' % (packagePath, e))
            return None

    def launch(self):
        """
        launches the webbrowser
        """
        package = None
        if self.packagePath:
            package = self._loadPackage(self.packagePath)
        if not package:
            launchBrowser(self.config, "")

    def usage(self):
        """
        Print usage info
        """
        print "Usage: "+os.path.basename(sys.argv[0])+" [OPTION] [PACKAGE]"
        print "  -V, --version    print version information and exit"
        print "  -h, --help       display this help and exit"
        print "  --standalone     Run totally from current directory"
        print "Settings are read from exe.conf "
        print "in $HOME/.exe on Linux/Unix or"
        print "in Documents and Settings/<user name>/Application Data/exe "
        print "on Windows"

# ===========================================================================
