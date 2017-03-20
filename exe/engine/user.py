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
from twisted.internet import utils


import logging
log = logging.getLogger(__name__)


class Quota(object):
    def __init__(self, path, size):
        """
        :type path: Path
        :type size: int
        """
        self.size = size
        self.path = path

    def enable(self):
        if not self.path.ismount():
            datafile = self.path + '.ext3'
            if not datafile.exists():
                cmd = '/bin/dd of=%s count=0 seek=%d bs=%d' % (datafile, self.size + 3, 2**20)
                cmd = cmd.split()
                utils.getProcessValue(cmd[0], cmd[1:]).addCallback(self.mkfs, datafile)
            else:
                self.mount(0, datafile)

    def mkfs(self, value, datafile):
        if value:
            log.error('dd command failed with exit value %d' % value)
        else:
            cmd = '/sbin/mkfs.ext3 -F -q %s' % datafile
            cmd = cmd.split()
            utils.getProcessValue(cmd[0], cmd[1:]).addCallback(self.mount, datafile)

    def mount(self, value, datafile):
        if value:
            log.error('mkfs.ext3 command failed with exit value %d' % value)
        else:
            cmd = '/usr/bin/fuseext2 %s %s -o rw+,nonempty' % (datafile, self.path)
            cmd = cmd.split()
            utils.getProcessValue(cmd[0], cmd[1:]).addCallback(self.check_mount)

    def check_mount(self, value):
        if value:
            log.error('mount command failed with exit value %d' % value)


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
        self.quota = None
        if self.config.quota:
            log.info('Enabling disk quota for user %s' % self.name)
            self.quota = Quota(self.root, self.config.quota)
            self.quota.enable()
