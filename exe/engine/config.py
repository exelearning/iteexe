# ===========================================================================
# eXe config
# Copyright 2004, University of Auckland
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
Config settings loaded from exe.conf
Is responsible for the system-wide settings we use
O/S specific config classes are derieved from here
"""

from exe.engine.configparser import ConfigParser
from exe.engine.path import path
import logging
import sys
import os
import os.path
import tempfile

# ===========================================================================
class Config:
    """
    The Config class contains the configuration information for eXe.
    """

    # Class attributes
    optionNames = {
        'system': ('exePath', 'webDir', 'port',
                   'dataDir', 'appDataDir', 'browserPath')
    }

    def __init__(self):
        """
        Initialise
        """
        self.configPath = None
        # Set default values
        # exePath is the whole path and filename of the exe executable
        self.exePath     = path(sys.argv[0]).abspath() # Path to application
        # webDir is the parent directory for styles,scripts and templates
        self.webDir      = self.exePath.dirname()
        # port is the port the exe webserver will listen on
        self.port        = 8081
        # dataDir is the default directory that is shown to the user
        # to save packages and exports in
        self.dataDir     = "."
        # appDataDir is the parent dir for storing user profiles
        # and user made idevices
        self.appDataDir  = "."
        # browserPath is the entire pathname to firefox
        self.browserPath = "firefox"
        # styles is the list of style names available for loading
        self.styles      = []
        # Let our children override our defaults depending
        # on the OS that we're running on
        self._overrideDefaultVals()
        # Find where the config file will be saved
        self.__setConfigPath()
        # Fill in any undefined config options with our defaults
        self._writeDefaultConfigFile()

    def _overrideDefaultVals(self):
        """
        Override this to override the
        default config values
        """

    def _getConfigPathOptions(self):
        """
        Override this to give a list of
        possible config filenames
        in order of preference
        """
        return ['exe.conf']

    def _writeDefaultConfigFile(self):
        """
        [Over]writes 'self.configPath' with a default config file 
        (auto write is on so we don't need to write the file at the end)
        """
        for sectionName, optionNames in self.optionNames.items():
            for optionName in optionNames:
                defaultVal = getattr(self, optionName)
                self.configParser.setdefault(sectionName, optionName, defaultVal)
        self.configParser.setdefault('logging', 'root', 'DEBUG')

    def __setConfigPath(self):
        """
        sets self.configPath to the filename of the config file that we'll
        use.
        In descendant classes set self.configFileOptions to a list
        of directories where the configDir should be in order of preference.
        If no config files can be found in these dirs, it will
        force creation of the config file in the top dir
        """
        # If there's an EXECONF environment variable, use it
        self.configPath = None
        configFileOptions = map(path, self._getConfigPathOptions())
        if "EXECONF" in os.environ:
            envconf = path(os.environ["EXECONF"])
            if envconf.isfile():
                self.configPath = os.environ["EXECONF"]
        # Otherwise find the most appropriate existing file
        if self.configPath is None:
            for confPath in configFileOptions:
                if confPath.isfile():
                    self.configPath = confPath
                    break
            else:
                # If no config files exist, create and use the first one on the list
                self.configPath = configFileOptions[0]
                folder = self.configPath.abspath().dirname()
                if not folder.exists():
                    folder.makedirs()
                self.configPath.touch()
        # Now make our configParser
        self.configParser = ConfigParser()
        self.configParser.read(self.configPath)
        self.configParser.autoWrite = True

    def loadSettings(self):
        """
        Loads the settings from the exe.conf file.
        Overrides the defaults set in __init__
        """
        # Set up the parser so that if a certain value is not in the config
        # file, it will use the value from our default values
        self.configParser.defaultValue = lambda section, option: getattr(self, option)
        # System Section
        if self.configParser.has_section('system'):
            system = self.configParser.system
            self.webDir      = system.webDir
            self.port        = int(system.port)
            self.browserPath = system.browserPath
            self.dataDir     = system.dataDir
            self.appDataDir  = system.appDataDir
        # If the dataDir points to some other dir, fix it
        if not os.path.isdir(self.dataDir):
            self.dataDir = tempfile.gettempdir()

    def setupLogging(self, logFile):
        """
        setup logging file
        """

        hdlr   = logging.FileHandler(self.appDataDir+'/'+logFile)
        format = "%(asctime)s %(name)s %(levelname)s %(message)s"
        log  = logging.getLogger()
        hdlr.setFormatter(logging.Formatter(format))
        log.addHandler(hdlr)

        loggingLevels = {"DEBUG"    : logging.DEBUG,
                         "INFO"     : logging.INFO,
                         "WARNING"  : logging.WARNING,
                         "ERROR"    : logging.ERROR,
                         "CRITICAL" : logging.CRITICAL }

    
        if self.configParser.has_section('logging'):
            for logger, level in self.configParser._sections["logging"].items():
                if logger == "root":
                    logging.getLogger().setLevel(loggingLevels[level])
                else:
                    logging.getLogger(logger).setLevel(loggingLevels[level])
                    

    def loadStyles(self):
        """
        Scans the eXe style directory and builds a list of styles
        """
        self.styles = []
        styleDir    = self.webDir + "/style"

        for subDir in os.listdir(styleDir):
            styleSheet = os.path.join(styleDir, subDir, "content.css")

            if os.path.exists(styleSheet):
                self.styles.append(subDir)



# ===========================================================================
