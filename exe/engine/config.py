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

from ConfigParser import ConfigParser
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
    def __init__(self, configFile):
        """
        Initialize 
        """
        self.exePath = os.path.abspath(sys.argv[0])

        # TODO: get rid of exeDir
        self.exeDir  = self.webDir  = os.path.dirname(self.exePath)
        self.configPath = self.exeDir+"/"+configFile

        self.port       = 8081
        self.dataDir    = "."
        self.appDataDir = "."
        self.styles     = []

        
    def loadSettings(self):
        """
        Loads the settings from the exe.conf file.
        Overrides the defaults set in __init__
        """
        if "EXECONF" in os.environ and os.path.isfile(os.environ["EXECONF"]):
            self.configPath = os.environ["EXECONF"]
            
        setting = ConfigParser()
        setting.read(self.configPath)

        if setting.has_option("system", "exe-dir"):
            self.exeDir = setting.get("system", "exe-dir")

        if setting.has_option("system", "web-dir"):
            self.webDir = setting.get("system", "web-dir")

        if setting.has_option("system", "port"):
            self.port = setting.getint("system", "port")

        if setting.has_option("system", "browser-path"):
            self.browserPath = setting.get("system", "browser-path")
            
        if setting.has_option("system", "data-dir"):
            self.dataDir = setting.get("system", "data-dir")
                
        if not os.path.isdir(self.dataDir):
            self.dataDir = tempfile.gettempdir()


    def setupLogging(self, logFile):
        """
        setup logging file
        """
        setting = ConfigParser()
        setting.read(self.configPath)

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

    
        for logger, level in setting.items("logging"):
            if logger == "root":
                logging.getLogger().setLevel(loggingLevels[level])
            else:
                logging.getLogger(logger).setLevel(loggingLevels[level])
                

    def loadStyles(self):
        """
        Scans the eXe style directory and builds a list of styles
        """
        self.styles = []
        styleDir    = self.exeDir + "/style"

        for subDir in os.listdir(styleDir):
            styleSheet = os.path.join(styleDir, subDir, "content.css")

            if os.path.exists(styleSheet):
                self.styles.append(subDir)



# ===========================================================================
