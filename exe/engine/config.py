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
"""

from ConfigParser import ConfigParser
import logging
from logging import DEBUG, INFO, WARNING, ERROR, CRITICAL
import sys
import os
import os.path

# ===========================================================================
class Config:
    """
    The Config class contains the configuration information for eXe.
    It loads the settings from the exe.conf file which is in the same
    directory as the eXe program.
    """
    def __init__(self, configFile):
        """
        Initialize 
        """
        if sys.platform[:3] == "win":
            from exe.engine.winshell import personal_folder
            self.dataDir = personal_folder()
        else:
            self.dataDir = os.environ["HOME"]

        if not os.path.isdir(self.dataDir):
            self.dataDir = "/"

        self.exePath = os.path.abspath(sys.argv[0])
        self.exeDir  = os.path.dirname(self.exePath)
 
        self.setting = ConfigParser()
        self.setting.read(self.exeDir+"/"+configFile)

        if self.setting.has_option("system", "port"):
            self.port = self.setting.getint("system", "port")
        else:
            self.port = 8081

        if self.setting.has_option("system", "browser-path"):
            self.browserPath = self.setting.get("system", "browser-path")
        else:
            self.browserPath = None

        self.styles = []

    def setupLogging(self, logFile):
        """
        setup logging file
        """
        hdlr   = logging.FileHandler(self.exeDir+'/'+logFile)
        format = "%(asctime)s %(name)s %(levelname)s %(message)s"
        log  = logging.getLogger()
        hdlr.setFormatter(logging.Formatter(format))
        log.addHandler(hdlr)

        loggingLevels = {"DEBUG"    : DEBUG,
                         "INFO"     : INFO,
                         "WARNING"  : WARNING,
                         "ERROR"    : ERROR,
                         "CRITICAL" : CRITICAL }

    
        for logger, level in self.setting.items("logging"):
            if logger == "root":
                logging.getLogger().setLevel(loggingLevels[level])
            else:
                logging.getLogger(logger).setLevel(loggingLevels[level])
                

    def loadStyles(self):
        """
        Scans the eXe style directory and builds a list of styles
        """
#        self.styles = []
        styleDir    = self.exeDir + "/style"

        for subDir in os.listdir(styleDir):
            styleSheet = os.path.join(styleDir, subDir, "editing.css")

            if os.path.exists(styleSheet):
                self.styles.append(subDir)

        
    def getDataDir(self):
        """
        get user My Documents directory
        """
        return self.dataDir
    
    def getExeDir(self):
        """
        get eXe running directory
        """
        return self.exeDir

#g_Config = Config("exe.conf")
# ===========================================================================
