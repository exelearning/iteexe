#!/usr/bin/python
# -*- coding: utf-8 -*-
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
# Foundation, Inc., 51 Franklin Street, Fifth Floor,
# Boston, MA  02110-1301, USA.
# ===========================================================================

"""
The LinuxConfig overrides the Config class with Linux specific
configuration
"""

import os
from exe.engine.config import Config
from exe.engine.path import Path


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
        if Path("/usr/share/exe").isdir():
            self.webDir      = Path("/usr/share/exe")
            self.jsDir       = Path("/usr/share/exe")

            # 'usr/share/exe/locale/' breaks the FHS - jrf
            # jrf - experimental
            # self.localeDir = Path("/usr/share/exe/locale")
            self.localeDir = Path("/usr/share/locale")

            self.mediaProfilePath = Path("/usr/share/exe/mediaprofiles")
        # In you don't have the application installed
        elif Path("exe").isdir():
            self.webDir     = Path("exe")
        elif Path("../exe").isdir():
            self.webDir     = Path("../exe")

        self.dataDir      = Path(os.environ['HOME'])
        self.configDir    = Path(self.dataDir)/'.exe'
        self.stylesDir    = Path(self.configDir)/'style'
        self.templatesDir = Path(self.configDir)/'content_template'
        self.lastDir      = Path(os.environ['HOME'])

        # Media converters - defaults for now
        self.videoMediaConverter_ogv = ""
        self.videoMediaConverter_3gp = '/usr/bin/ffmpeg -i %(infile)s -s qcif -vcodec h263 -acodec libvo_aacenc -ac 1 -ar 8000 -r 25 -ab 32 -y %(outfile)s'
        self.videoMediaConverter_mpg = "/usr/bin/ffmpeg -i %(infile)s -s qcif -vcodec mpeg1 -acodec wav -ac 1 -ar 8000 -r 25 -ab 32 -y %(outfile)s"
        self.audioMediaConverter_au = "/usr/bin/sox %(infile)s %(outfile)s"
        self.audioMediaConverter_wav = "/usr/bin/sox %(infile)s %(outfile)s"
        self.audioMediaConverter_mp3 = "/usr/bin/sox %(infile)s -t wav - | /usr/bin/lame -b 32 - %(outfile)s"
        self.ffmpegPath = "/usr/bin/ffmpeg"
        self.eXeUIversion = 0

    def _getConfigPathOptions(self):
        """
        Returns the best places for a linux config file
        """
        return [Path(os.environ["HOME"])/'.exe/exe.conf',
                Path('/etc/exe/exe.conf'),
                self.webDir/'exe.conf']


# ===========================================================================
