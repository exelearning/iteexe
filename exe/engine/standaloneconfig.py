# ===========================================================================
# eXe config
# Copyright 2004-2006, University of Auckland
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
The StandAlone config overrides the Config class with Standalone specific
configuration
"""

import sys, os
from exe.engine.config import Config
from exe.engine.path import Path

# ===========================================================================
class StandaloneConfig(Config):
    """
    The StandaloneConfig overrides the Config class with ready-to-run specific
    configuration
    """
    
    def _overrideDefaultVals(self):
        """
        Setup with our default settings
        """
        self.exePath = Path(sys.argv[0])
        if self.exePath.isfile():
            self.exePath = self.exePath.dirname()
        exePath = self.exePath
        # Override the default settings
        self.webDir        = exePath
        self.dataDir       = exePath/'packages'
        if not self.dataDir.exists():
            self.dataDir.makedirs()
        self.configDir     = exePath/'config'
        self.localeDir     = exePath/'locale'
        self.stylesDir     = Path(exePath/'style').abspath()
        self.xulrunnerPath = exePath/'xulrunner/xulrunner'
        self.styles        = []
        self.lastDir       = exePath

    def _getConfigPathOptions(self):
        """
        Returns the best places for a linux config file
        """
        return [self.configDir/'exe.conf']


# ===========================================================================
