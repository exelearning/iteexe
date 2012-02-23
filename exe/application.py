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
import time
import re
import getpass

from tempfile import mkdtemp
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
from exe.engine.path         import TempDirPath
import logging
import re

log = logging.getLogger(__name__)

class Windows_Log(object):
    """
    Logging for py2exe application
    """
    def __init__(self, level):
        self.level = level
    def write(self, text):
        log.log(self.level, text)
if sys.platform[:3] == "win" and not (sys.argv[0].endswith("exe_do") or \
                                      sys.argv[0].endswith("exe_do.exe")):
    # put stderr and stdout into the log file
    sys.stdout = Windows_Log(logging.INFO)
    sys.stderr = Windows_Log(logging.ERROR)
del Windows_Log

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
        self.persistNonPersistants = False  
        self.tempWebDir   = mkdtemp('.eXe')
        self.afterUpgradeHandlers = []
        assert globals.application is None, "You tried to instantiate two Application objects"
        globals.application = self

    def main(self):
        """
        Main function, starts eXe
        """
        self.processArgs()

        self.loadConfiguration()
        try:
            username = getpass.getuser()
        except ImportError:
            username = ''
        eXeStart = globals.application.tempWebDir
        eXeStart = re.sub("[\/|\\\\][^\/|\\\\]*$","",eXeStart)
        eXeStart = eXeStart + '/tmpExeStartupTime.' + username

        if os.path.exists(eXeStart):
            inStartFH=open(eXeStart, "r")
            lastRunTimeS = 0
            for line in inStartFH:
                try:
                    lastRunTimeS = int(line)
                except ValueError:
                    lastRunTimeS = 0
            inStartFH.close()
            log.debug('lastRunTimeS: ' + `lastRunTimeS`)

            currentTime = int (time.time())
            currentTime2 = int (time.time())
            log.info('currentTime: ' + `currentTime`)
            if(currentTime <= lastRunTimeS + 3 and currentTime >= lastRunTimeS):
                #self.xulMessage(_('eXe appears to already be running'))
                #log.info('eXe appears to already be running: <html:br/>lastRunTimes: ' + `lastRunTimeS` + '<html:br/> currentTime: ' + `currentTime` + '<html:br/>currentTime2: ' + `currentTime2`)
                return None

        else:
            log.info('eXeStart: ' + eXeStart)
            log.info('tempWebDir: ' + globals.application.tempWebDir)

        # if a document was double clicked to launch on Win32,
        #   make sure we have the long pathname
        if sys.platform[:3] == "win" and self.packagePath is not None:
            self.packagePath = self.config.getLongPathName(self.packagePath)

        installSafeTranslate()
        self.preLaunch()
        # preLaunch() has called find_port() to set config.port (the IP port #)
        if self.config.port >= 0:
            self.launch()
            log.info('serving')
            self.serve()
            log.info('done serving')
        else:
            #self.xulMessage(_('eXe appears to already be running'))
            log.error('eXe appears to already be running')
            log.error('looks like the eXe server was not able to find a valid port; terminating...')
        shutil.rmtree(self.tempWebDir, True)
        try:
            os.remove(eXeStart)
        except OSError:
            pass

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
        # and determine the web server's port before launching the client, so it can use the same port#:
        self.webServer.find_port()


    def serve(self):
        """
        Starts the web server,
        this func doesn't return until after the app has finished
        """
        print "Welcome to eXe: the eLearning XHTML editor"
        log.info("eXe running...")
        self.webServer.run()

    def _loadPackage(self, packagePath):
        #"""
        #Convenience function for loading the first package that we'll browse to
        #"""
        try:
            #XXXX xxxx
            log.info("webDir: " + self.config.webDir)
            log.info("tempWebDir: " + self.tempWebDir)
            inSplashFile =  self.config.webDir + "/docs/splash.xulTemplate"

            outSplashFile = self.config.webDir + "/docs/splash.xul"
            outSplashData = self.config.webDir + "/docs/splash.dat"

            outSplashFile = self.tempWebDir + "/splash.xul"
            outSplashData = self.tempWebDir + "/splash.dat"

            log.info("inSplashFile: " + inSplashFile)
            log.info("outSplashFile: " + outSplashFile)
            log.info("outSplashData: " + outSplashData)

            #resets any splash page data
            outSplashFH = open(outSplashData, "w")
            outSplashFH.write("")
            outSplashFH.close()

            inSplashFH = open(inSplashFile, "r")
            outSplashFH = open(outSplashFile, "w")
            pleaseWaitLoad = _(u'Please wait until loading finishes')
            for line in inSplashFH:
                line = line.replace("LOADING_FILE_NAME", packagePath)
                try:
                    # this can fail in non UTF-8 uris
                    line = line.replace("PLEASE_WAIT_LOAD", pleaseWaitLoad)
                except:
                    pass
                outSplashFH.write(line)
            inSplashFH.close()
            outSplashFH.close()
   
            log.info("packagePath: " + packagePath)

            launchBrowser(self.config, outSplashFile, "splash")
            shutil.copyfile(self.config.webDir + '/images/exe_logo.png', 
                                      self.tempWebDir + '/exe_logo.png')

            package = self.packageStore.loadPackage(packagePath)
            port = self.config.port
            editorUrl = u'http://127.0.0.1:%d/%s' % (port, package.name)
            log.info("package.name: "+package.name)
            log.info("editorUrl: " + editorUrl)
            log.info("TempDirPath: " + editorUrl)
            outSplashFH = open(outSplashData, "w")
            outSplashFH.write("1000;" + editorUrl)
            outSplashFH.close()

            self.webServer.root.bindNewPackage(package)
            return package

        except Exception, e:
            log.error('Error loading first Package (%s): %s' % (packagePath, e))
            message = _(u'Sorry, wrong file format')

            outSplashFH=open(globals.application.tempWebDir + \
                               '/splash.dat',"w")
            message = re.sub(";",":",message)
            port = self.config.port
            outSplashFH.write("1000;http://127.0.0.1:" + `port` + "/;" + \
                               message)
            outSplashFH.close()

            return None



    def xulMessage(self, msg):
        """
        launches the web browser and displays a message 
        without the need of a running/responding webserver
        """
        inXulMsgFile =  self.config.webDir + "/docs/xulMsg.xulTemplate"
        outXulMsgFile = self.tempWebDir + "/xulMsg.xul"
        log.info("outXulMsgFile: " + outXulMsgFile)
        log.info("xulMessage: " + msg)

        inXulMsgFH = open(inXulMsgFile, "r")
        outXulMsgFH = open(outXulMsgFile, "w")
        for line in inXulMsgFH:
            line = re.sub("XUL_MESSAGE", msg, line)
            outXulMsgFH.write(line)
        inXulMsgFH.close()
        outXulMsgFH.close()
        launchBrowser(self.config, outXulMsgFile, "xulMsg")
        shutil.copyfile(self.config.webDir + '/images/exe_logo.png', self.tempWebDir + '/exe_logo.png')
        #allow sufficient time for the file to be read before exiting 
        #which automatically deletes the tempWebDir and all files
        time.sleep(3)

    def launch(self):
        """
        launches the webbrowser
        """

        if self.packagePath:
            package = self.packageStore.loadPackage(self.packagePath)
            self.webServer.root.bindNewPackage(package)
            launchBrowser(self.config, package.name, "")
        else:
            launchBrowser(self.config, "", "")

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
