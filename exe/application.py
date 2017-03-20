#!/usr/bin/python
# ===========================================================================
# eXe
# Copyright 2004-2006, University of Auckland
# Copyright 2004-2008 eXe Project, http://eXeLearning.org/
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
import shutil
import logging

# Make it so we can import our own nevow and twisted etc.
if os.name == 'posix' and not ('--standalone' in sys.argv or '--portable' in sys.argv):
    sys.path.insert(0, '/usr/share/exe')
from exe.engine.userstore import UserStore
from getopt import getopt, GetoptError
from exe.webui.webserver import WebServer
from exe.webui.browser import launchBrowser
from exe.engine.package import Package
from exe.engine import version
from exe import globals
from tempfile import mkdtemp
from twisted.internet import reactor
from twisted.scripts.twistd import daemonize, checkPID
from exe.engine.idevicestore import IdeviceStore


log = logging.getLogger(__name__)
PID_FILE = '/var/run/exe/exe.pid'


class WindowsLog(object):
    """
    Logging for py2exe application
    """

    def __init__(self, level):
        self.level = level

    def write(self, text):
        log.log(self.level, text)


if sys.platform[:3] == "win" and not (sys.argv[0].endswith("exe_do") or
                                      sys.argv[0].endswith("exe_do.exe")):
    # put stderr and stdout into the log file
    sys.stdout = WindowsLog(logging.INFO)
    sys.stderr = WindowsLog(logging.ERROR)
del WindowsLog

# Global application variable
globals.application = None


class Application:
    """
    Main application class, pulls together everything and runs it.
    """

    version = 1

    def __init__(self):
        """
        Initialize
        """
        self.config = None
        self.defaultConfig = None
        self.userStore = None
        self.packagePath = None
        self.webServer = None
        self.exeAppUri = None
        self.standalone = False  # Used for the ready to run exe
        self.portable = False  # FM: portable mode
        self.server = False
        self.interface = None
        self.persistNonPersistants = False
        self.tempWebDir = mkdtemp('.eXe')
        self.resourceDir = None
        self.afterUpgradeHandlers = []
        self.preferencesShowed = False
        self.loadErrors = []
        assert globals.application is None, "You tried to instantiate two Application objects"
        globals.application = self

    def main(self):
        """
        Main function, starts eXe
        """
        self.processArgs()
        self.loadConfiguration()
        self.preLaunch()
        # preLaunch() has called find_port() to set config.port (the IP port #)
        self.exeAppUri = 'http://localhost:%d' % self.config.port
        self.upgrade()
        if self.config.port >= 0:
            if self.server:
                pidfile = PID_FILE
                if not self.standalone:
                    daemonize()
                else:
                    pidfile = 'exe/config/exe.pid'
                checkPID(pidfile)
                open(pidfile, 'wb').write(str(os.getpid()))
            else:
                reactor.callWhenRunning(self.launch)
            log.info('serving')
            self.serve()
            log.info('done serving')
        else:
            log.error('eXe appears to already be running')
            log.error('looks like the eXe server was not able to find a valid port; terminating...')
        shutil.rmtree(self.tempWebDir, True)

    def upgrade(self):
        """Execute all upgraToVersionX functions from stored version to actual version"""
        version_file = self.config.configDir / 'version'
        storedVersion = 0
        if version_file.exists():
            storedVersion = int(version_file.bytes())
        for v in xrange(storedVersion + 1, self.version + 1):
            method = getattr(Application, 'upgradeToVersion%d' % v, None)
            if method:
                method(self)
        version_file.write_text(str(self.version))

    def upgradeToVersion1(self):
        """Hide experimental idevices"""
        log.info('Upgrading to version 1')
        if not hasattr(self, 'ideviceStore'):
            return

        for idevice in self.ideviceStore.getIdevices():
            lower_title = idevice._title.lower()
            if self.config.idevicesCategories.get(lower_title, '') == ['Experimental']:
                self.config.hiddeniDevices.append(lower_title)
                self.config.configParser.set('idevices', lower_title, '0')

    def processArgs(self):
        """
        Processes the command line arguments
        """
        try:
            options, packages = getopt(sys.argv[1:],
                                       "hV", ["help", "version", "standalone", "portable", "server", "interface="])
        except GetoptError:
            self.usage()
            sys.exit(2)

        log.debug('options: %s, packages: %s' % (options, packages))
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
            elif option[0].lower() == '--portable':
                self.standalone = True
                self.portable = True
            elif option[0].lower() == '--server':
                self.server = True
            elif option[0].lower() == '--interface':
                self.interface = option[1]

    def loadConfiguration(self):
        """
        Loads the config file and applies all the settings
        """
        if self.standalone:
            from exe.engine.standaloneconfig import StandaloneConfig

            configKlass = StandaloneConfig
        elif sys.platform[:3] == "win":
            from exe.engine.winconfig import WinConfig

            configKlass = WinConfig
        elif sys.platform[:6] == "darwin":
            from exe.engine.macconfig import MacConfig

            configKlass = MacConfig
        else:
            from exe.engine.linuxconfig import LinuxConfig

            configKlass = LinuxConfig
        try:
            self.config = configKlass()
        except:
            configPath = configKlass.getConfigPath()
            backup = configPath + '.backup'
            configPath.move(backup)
            self.config = configKlass()
            self.loadErrors.append(
                _(u'An error has occurred when loading your config. A backup is saved at %s') % backup)
        self.defaultConfig = self.config
        self.userStore = UserStore(self.config.configDir)
        log.debug("logging set up")

    def createIdeviceStore(self):
        self.ideviceStore = IdeviceStore(self.config)
        try:
            self.ideviceStore.load()
        except:
            backup = self.config.configDir / 'idevices.backup'
            if backup.exists():
                backup.rmtree()
            (self.config.configDir / 'idevices').move(backup)
            self.loadErrors.append(
               _(u'An error has occurred when loading your Idevice Store. A backup is saved at %s') % backup)
            self.ideviceStore.load()
        # Make it so jelly can load objects from ~/.exe/idevices
        sys.path.append(self.config.configDir/'idevices')

    def preLaunch(self):
        """
        Sets ourself up for running
        Needed for unit tests
        """
        log.debug("preLaunch")

        if not self.server:
            self.createIdeviceStore()

        self.webServer = WebServer(self, self.packagePath)
        # and determine the web server's port before launching the client, so it can use the same port#:
        self.webServer.find_port()


    def serve(self):
        """
        Starts the web server,
        this func doesn't return until after the app has finished
        """
        print "Welcome to eXe: the EXtremely Easy to use eLearning authoring tool"
        log.info("eXe running...")
        self.webServer.run()

    def launch(self):
        """
        launches the webbrowser
        """

        if self.packagePath:
            try:
                package = Package.load(self.packagePath)
                self.webServer.root.package = package
                launchBrowser(self.config, package.name)
            except:
                self.webServer.root.packagePath = None
                launchBrowser(self.config, "")
        else:
            launchBrowser(self.config, "")

    def usage(self):
        """
        Print usage info
        """
        self.loadConfiguration()
        print _("""eXeLearning, the EXtremely Easy to use eLearning authoring tool
   Usage: %s [OPTION] [PACKAGE]
  -V, --version    print version information and exit
  -h, --help       display this help and exit
  --standalone     Run totally from current directory
  --portable       Run in portable mode
Settings are read from exe.conf in $HOME/.exe on Linux/Unix/Mac OS or
in Documents and Settings/<user name>/Application Data/exe on Windows XP or
Users/<user name>/AppData/Roaming/exe on Windows 7""") % os.path.basename(sys.argv[0])

# ===========================================================================
