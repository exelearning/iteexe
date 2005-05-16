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
The LinuxConfig overrides the Config class with Linux specific
configuration
"""

import os
from exe.engine.config import Config
from exe.engine.path import path
import logging

# ===========================================================================
class LinuxConfig(Config):
    """
    The LinuxConfig overrides the Config class with Linux specific
    configuration
    """
    
    def _overrideDefaultVals(self):
        """
        Setup with our default settings
        """
        # Override the default settings
        self.webDir      = "/usr/share/exe"
        self.dataDir     = os.environ['HOME']
        self.appDataDir  = self.dataDir
        self.browserPath = "/usr/share/exe/firefox/firefox"
        self.styles      = []

    def _getConfigPathOptions(self):
        """
        Returns the best places for a linux config file
        """
        return [path(os.environ["HOME"])/'.exe/exe.conf',
                '/etc/exe/exe.conf',
                './exe/exe.conf']


# ===========================================================================
