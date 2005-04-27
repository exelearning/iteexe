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
The WinConfig overrides the Config class with Windows specific
configuration
"""

import logging
import sys
import os
import os.path
from exe.engine.config import Config

# ===========================================================================
class WinConfig(Config):
    """
    The WinConfig overrides the Config class with Windows specific
    configuration
    """
    def __init__(self, configFile):
        """
        Initialize 
        """
        Config.__init__(self, configFile)

        # what's the windows equivalent of /etc????
        # Documents and Settings.... Application Data
        programFilesDir = self.__getDirectory(0x0026)
        exeConf = programFilesDir + "/exe/" + configFile
        if os.path.isfile(exeConf):
            self.configPath = exeConf
        
        if ("Mozilla Firefox" in os.listdir(self.exeDir) and 
            "firefox.exe" in os.listdir(self.exeDir + "\\Mozilla Firefox")):
            self.browserPath = self.exeDir + "\\Mozilla Firefox\\firefox"
        self.dataDir = self.__getDirectory(5)
                
        # TODO: get appDataDir from
        # Documents and Settings\$USER\Application Data on Windows
        self.appDataDir = self.dataDir


    def __getDirectory(self, code):
        from ctypes import WinDLL, create_string_buffer
        dll = WinDLL('shell32')
        # The '5' and the '0' from the below call come from
        # google: "ShellSpecialConstants site:msdn.microsoft.com"
        result = create_string_buffer(260)
        resource = dll.SHGetFolderPathA(None, code, None, 0, result)
        if resource != 0: 
            return '/'
        else: 
            return result.value
        

# ===========================================================================
