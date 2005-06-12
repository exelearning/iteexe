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
from exe.engine.path import Path
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
        self.webDir      = Path("/usr/share/exe")
        self.dataDir     = Path(os.environ['HOME'])
        self.configDir   = Path(self.dataDir)/'.exe'
        browserPath = self.webDir/'firefox/firefox'
        if browserPath.isfile():
            self.browserPath = browserPath
        self.styles      = []

    def _getConfigPathOptions(self):
        """
        Returns the best places for a linux config file
        """
        return [Path(os.environ["HOME"])/'.exe/exe.conf',
                Path('/etc/exe/exe.conf'),
                Path('./exe/exe.conf')]


# ===========================================================================
