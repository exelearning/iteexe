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
import sys
import os
import os.path
import tempfile

# ===========================================================================
class Config:
    """
    The Config class contains the configuration information for eXe.
    It loads the settings from the exe.conf file.
    """
    def __init__(self, configFile):
        """
        Initialize 
        """

        self.setting = ConfigParser()
        self.exePath = os.path.abspath(sys.argv[0])
        self.exeDir  = os.path.dirname(self.exePath)
        
        exeConf = None
        
        if os.environ["EXECONF"] and os.path.isfile(os.environ["EXECONF"]):
            exeConf = os.environ["EXECONF"]              
        elif sys.platform[:3] == "win":
            confPath = "C:\\Program Files\\exe\\" + configFile
            if os.path.isfile(confPath):
                exeConf = confPath
        elif sys.platform[:5] == "linux":
            confPath = "/usr/share/exe" + configFile
            if os.path.isfile(confPath):
                exeConf = confPath
                
        if not exeConf:
            exeConf = self.exeDir+"/"+configFile 
                
        self.setting.read(exeConf)
        
       # print "exeDir: %s \n" %self.exeDir
 
        if sys.platform[:3] == "win":
            self.exeDir  = os.path.dirname(self.exePath)

        elif sys.platform[:5] == "linux":
            self.exeDir  = "/usr/share/exe"

        else:
            self.exeDir  = os.path.dirname(self.exePath)
        
        
        
        if self.setting.has_option("system", "port"):
            self.port = self.setting.getint("system", "port")
        else:
            self.port = 8081

        if self.setting.has_option("system", "browser-path"):
            self.browserPath = self.setting.get("system", "browser-path")
        else:
            self.browserPath = None
            
        if self.setting.has_option("system", "data-dir"):
            self.dataDir = self.setting.get("system", "data-dir")
        else:
            if sys.platform[:3] == "win":
                from ctypes import WinDLL, create_string_buffer
                dll = WinDLL('shell32')
                # The '5' and the '0' from the below call come from
                # google: "ShellSpecialConstants site:msdn.microsoft.com"
                p = create_string_buffer(260)
                res = dll.SHGetFolderPathA(None, 5, None, 0, p)
                if res != 0: 
                    self.dataDir = '/'
                else: 
                    self.dataDir = p.value
            else:
                self.dataDir = os.environ["HOME"]
                
        if not os.path.isdir(self.dataDir):
            self.dataDir = "/"    
 
        self.styles = []

    def setupLogging(self, logFile):
        """
        setup logging file
        """
        hdlr   = logging.FileHandler(self.dataDir+'/'+logFile)
        format = "%(asctime)s %(name)s %(levelname)s %(message)s"
        log  = logging.getLogger()
        hdlr.setFormatter(logging.Formatter(format))
        log.addHandler(hdlr)

        loggingLevels = {"DEBUG"    : logging.DEBUG,
                         "INFO"     : logging.INFO,
                         "WARNING"  : logging.WARNING,
                         "ERROR"    : logging.ERROR,
                         "CRITICAL" : logging.CRITICAL }

    
        for logger, level in self.setting.items("logging"):
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
