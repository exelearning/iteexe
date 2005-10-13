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
from exe.engine.path import Path
import logging
import sys
import os
import gettext
import tempfile

# ===========================================================================
class Config:
    """
    The Config class contains the configuration information for eXe.
    """

    # Class attributes
    optionNames = {
        'system': ('webDir', 'xulDir', 'port', 'dataDir', 
                   'configDir', 'xulrunnerPath',
                   'localeDir'),
        'user': ('locale',)
    }

    def __init__(self):
        """
        Initialise
        """
        self.configPath = None
        self.configParser = ConfigParser()
        # Set default values
        # exePath is the whole path and filename of the exe executable
        encoding = sys.getfilesystemencoding()
        if encoding is None:
            encoding = 'ascii'
        self.exePath     = Path(sys.argv[0], encoding).abspath()
        # webDir is the parent directory for styles,scripts and templates
        self.webDir      = self.exePath.dirname()
        # xulDir is the parent directory for styles,scripts and templates
        self.xulDir      = self.exePath.dirname()
        # localeDir is the base directory where all the locales are stored
        self.localeDir   = self.exePath.dirname()/"locale"
        # port is the port the exe webserver will listen on
        self.port        = 8081
        # dataDir is the default directory that is shown to the user
        # to save packages and exports in
        self.dataDir     = Path(".")
        # configDir is the dir for storing user profiles
        # and user made idevices and the config file
        self.configDir   = Path(".")
        # xulrunnerPath is the entire pathname to firefox
        self.xulrunnerPath = Path("xulrunner")
        # styles is the list of style names available for loading
        self.styles      = []
        # locale the user wants (#TODO: Read from system)
        self.locale      = "en"
        # Let our children override our defaults depending
        # on the OS that we're running on
        self._overrideDefaultVals()
        # Try to make the defaults a little intelligent
        # Under devel trees, webui is the default webdir
        self.webDir = Path(self.webDir)
        if not (self.webDir/'scripts').isdir() \
           and (self.webDir/'webui').isdir():
            self.webDir /= 'webui'
        # Under devel trees, xului is the default xuldir
        self.xulDir = Path(self.xulDir)
        if not (self.xulDir/'scripts').isdir() \
           and (self.xulDir/'xului').isdir():
            self.xulDir /= 'xului'
        # Find where the config file will be saved
        self.__setConfigPath()
        # Fill in any undefined config options with our defaults
        self._writeDefaultConfigFile()
        # Now we are ready to serve the application
        self.loadSettings()
        self.setupLogging()
        self.loadStyles()
        self.loadLocales()


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
                self.configParser.setdefault(sectionName, 
                                             optionName, 
                                             defaultVal)
        self.configParser.setdefault('logging', 'root', 'ERROR')


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
        configFileOptions = map(Path, self._getConfigPathOptions())
        if "EXECONF" in os.environ:
            envconf = Path(os.environ["EXECONF"])
            if envconf.isfile():
                self.configPath = os.environ["EXECONF"]
        # Otherwise find the most appropriate existing file
        if self.configPath is None:
            for confPath in configFileOptions:
                if confPath.isfile():
                    self.configPath = confPath
                    break
            else:
                # If no config files exist, create and use the
                # first one on the list
                self.configPath = configFileOptions[0]
                folder = self.configPath.abspath().dirname()
                if not folder.exists():
                    folder.makedirs()
                self.configPath.touch()
        # Now make our configParser
        self.configParser.read(self.configPath)
        self.configParser.autoWrite = True


    def upgradeFile(self):
        """
        Called before loading the config file,
        removes or upgrades any old settings.
        """
        if self.configParser.has_section('system'):
            system = self.configParser.system
            if system.has_option('browserPath'):
                # Older config files used browserPath instead of xulrunnerPath
                # We'll just delete this unnecesary entry
                del system.browserPath
            if system.has_option('appDataDir'):
                # Older config files had configDir stored as appDataDir
                self.configDir = Path(system.appDataDir)
                # We'll just upgrade their config file for them for now...
                system.configDir = self.configDir
                del system.appDataDir
            if system.has_option('greDir'):
                # No longer used, system should automatically support
                del system.greDir


    def loadSettings(self):
        """
        Loads the settings from the exe.conf file.
        Overrides the defaults set in __init__
        """
        # Set up the parser so that if a certain value is not in the config
        # file, it will use the value from our default values
        def defVal(dummy, option):
            """If something is not in the config file, just use the default in
            'self'"""
            return getattr(self, option)
        self.configParser.defaultValue = defVal
        self.upgradeFile()
        # System Section
        if self.configParser.has_section('system'):
            system = self.configParser.system
            self.webDir      = Path(system.webDir)
            self.xulDir      = Path(system.xulDir)
            self.localeDir   = Path(system.localeDir)
            self.port        = int(system.port)
            self.xulrunnerPath = Path(system.xulrunnerPath)
            self.dataDir     = Path(system.dataDir)
            self.configDir = Path(system.configDir)
        # If the dataDir points to some other dir, fix it
        if not self.dataDir.isdir():
            self.dataDir = tempfile.gettempdir()
        # If the configDir doesn't exist (as it may be a default setting with a
        # new installation) create it
        if not self.configDir.exists():
            self.configDir.mkdir()
        # Load the "user" section
        if self.configParser.has_section('user'):
            self.locale  = self.configParser.user.locale


    def setupLogging(self):
        """
        setup logging file
        """
        hdlr   = logging.FileHandler(self.configDir/'exe.log')
        format = "%(asctime)s %(name)s %(levelname)s %(message)s"
        log    = logging.getLogger()
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

        log.info("************** eXe logging started **************")
        log.info("configPath = %s" % self.configPath)
        log.info("exePath    = %s" % self.exePath)
        log.info("webDir     = %s" % self.webDir)
        log.info("xulDir     = %s" % self.xulDir)
        log.info("localeDir  = %s" % self.localeDir)
        log.info("port       = %d" % self.port)
        log.info("dataDir    = %s" % self.dataDir)
        log.info("configDir  = %s" % self.configDir)
        log.info("locale     = %s" % self.locale)
                    

    def loadStyles(self):
        """
        Scans the eXe style directory and builds a list of styles
        """
        log = logging.getLogger()
        log.debug("loadStyles")
        self.styles = []
        styleDir    = self.webDir/"style"

        for subDir in styleDir.listdir():
            styleSheet = styleDir/subDir/'content.css'
            if styleSheet.exists():
                style = subDir.basename()
                log.debug(" loading style %s" % style)
                self.styles.append(style)


    def loadLocales(self):
        """
        Scans the eXe locale directory and builds a list of locales
        """
        log = logging.getLogger()
        log.debug("loadLocales")
        gettext.install('exe', self.localeDir, True)
        self.locales = {}
        for subDir in self.localeDir.dirs():
            if (subDir/'LC_MESSAGES'/'exe.mo').exists():
                self.locales[subDir.basename()] = \
                    gettext.translation('exe', 
                                        self.localeDir, 
                                        languages=[str(subDir.basename())])
                if subDir.basename() == self.locale:
                    locale = subDir.basename()
                    log.debug(" loading locale %s" % locale)
                    self.locales[locale].install(unicode=True)



# ===========================================================================
