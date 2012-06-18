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
The MacConfig overrides the Config class with Mac specific
configuration
"""

import os
from exe.engine.linuxconfig import LinuxConfig
from exe.engine.path import Path

# ===========================================================================
class MacConfig(LinuxConfig):
    """
    The MacConfig overrides the Config class with Mac specific
    configuration. We use the same _getConfigPathOptions as LinuxConfig
    """

    def _overrideDefaultVals(self):
        """
        Sets default mac values. Uses LinuxConfig's _getConfigPathOptions.
        """
        # Override the default settings
        self.webDir      = Path("../Resources/exe")
        self.jsDir      = Path("../Resources/exe")
        self.localeDir   = Path("../Resources/exe/locale")
        self.dataDir     = Path(os.environ['HOME'])
        self.configDir   = Path(self.dataDir)/'.exe'

# ===========================================================================
