# -- coding: utf-8 --
# ===========================================================================
# eXe
# Copyright 2015, Pedro Peña Pérez, Open Phoenix IT
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

from exe.engine.linuxconfig import LinuxConfig
from exe import globals


class UserConfig(LinuxConfig):
    def __init__(self, path):
        self.path = path
        super(UserConfig, self).__init__()

    def _overrideDefaultVals(self):
        super(UserConfig, self)._overrideDefaultVals()
        self.configDir = self.path
        self.lastDir = self.configDir / 'fs'
        self.quota = globals.application.defaultConfig.quota

    def _getConfigPathOptions(self):
        return [self.configDir/'exe.conf']

    def setupLogging(self):
        pass