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
from exe.engine.idevicestore import IdeviceStore
from exe.engine.packagestore import PackageStore
from exe.engine.userconfig import UserConfig


class User(object):
    def __init__(self, name, configPath, picture=None):
        self.name = name
        self.picture = picture
        self.packageStore = PackageStore()
        configPath = configPath.abspath() / name
        self.root = configPath / 'fs'
        self.initialConfig = True
        if configPath.exists():
            self.initialConfig = False
        self.config = UserConfig(configPath)
        self.ideviceStore = IdeviceStore(self.config)
        self.ideviceStore.load()
        if not self.root.exists():
            self.root.mkdir()
