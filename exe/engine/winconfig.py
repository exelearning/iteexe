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

from exe.engine.config import Config
from exe.engine.path   import Path

# Constants for directory name codes
APPDATA        = 0x001a
COMMON_APPDATA = 0x0023
MYDOCUMENTS    = 0x0005 # Code for c:\documents and settings\myuser\My Documents
PROGRAMFILES   = 0x0026

# ===========================================================================
class WinConfig(Config):
    """
    The WinConfig overrides the Config class with Windows specific
    configuration
    """

    def _overrideDefaultVals(self):
        """Sets the default values
        for windows"""
        exeDir = self.exePath.dirname()
        self.firefoxPath = exeDir/'Mozilla Firefox'/'firefox.exe'
        if not self.firefoxPath.isfile():
            programFiles = Path(self.__getWinFolder(PROGRAMFILES))
            self.firefoxPath = programFiles/'Mozilla Firefox'/'firefox.exe'
        self.dataDir   = Path(self.__getWinFolder(MYDOCUMENTS))
        self.configDir = Path(self.__getWinFolder(APPDATA))/'exe'

    def _getConfigPathOptions(self):
        """
        Returns the best options for the
        location of the config file under windows
        """
        # Find out where our nice config file is
        folders = map(self.__getWinFolder, [APPDATA, COMMON_APPDATA])
        # Add unique dir names
        folders = [folder/'exe' for folder in folders] 
        folders.append(self.__getInstallDir())
        folders.append('.')
        # Filter out non existant folders
        options = [folder/'exe.conf' for folder in map(Path, folders)]
        return options

    def __getWinFolder(self, code):
        """
        Gets one of the windows famous directorys
        depending on 'code'
        Possible values can be found at:
        http://msdn.microsoft.com/library/default.asp?url=/library/en-us/shellcc/platform/shell/reference/enums/csidl.asp#CSIDL_WINDOWS
        """
        from ctypes import WinDLL, create_unicode_buffer
        dll = WinDLL('shell32')
        # The '5' and the '0' from the below call come from
        # google: "ShellSpecialConstants site:msdn.microsoft.com"
        result = create_unicode_buffer(260)
        resource = dll.SHGetFolderPathW(None, code, None, 0, result)
        if resource != 0: 
            return Path('')
        else: 
            return Path(result.value)
                
    def __getInstallDir(self):
        """
        Returns the path to where we were installed
        """
        from _winreg import OpenKey, QueryValue, HKEY_LOCAL_MACHINE
        try:
            exeKey = None
            softwareKey = None
            try:
                softwareKey = OpenKey(HKEY_LOCAL_MACHINE, 'SOFTWARE')
                exeKey = OpenKey(softwareKey, 'exe')
                return Path(QueryValue(exeKey, ''))
            finally:
                if exeKey:
                    exeKey.Close()
                if softwareKey:
                    softwareKey.Close()
        except WindowsError:
            return Path('')


# ===========================================================================
