# ===========================================================================
# eXe config
# Copyright 2004-2006, University of Auckland
# Copyright 2004-2020 eXe Project, http://eXeLearning.org/
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
The Snap config overrides the Config class with Snap Package specific configuration
"""

import sys, os
from exe.engine.config import Config
from exe.engine.path import Path

# ===========================================================================
class SnapConfig(Config):
    """
    The SnapConfig overrides the Config class with ready-to-run specific configuration
    """
    
    def _overrideDefaultVals(self):
        """
        Setup with our default settings
        """

        homePath                = Path(os.environ.get('HOME'))

        xdg_config_home         = Path(os.environ.get('XDG_CONFIG_HOME'))

        if xdg_config_home:
            try:
                user_dirs_path      = xdg_config_home / 'user-dirs.dirs'
                user_dirs_data      = user_dirs_path.lines()
                for line in user_dirs_data:
                    if line[:3] == 'XDG':
                        environ_name = line.split('=')[0]
                        enviton_value = line.split('=')[1].strip().replace('$HOME',homePath).strip('"')
                        os.environ[environ_name] = enviton_value
            except:
                pass
            
        # SNAP Directories
        snapBasePath            = Path(os.environ.get('SNAP'))
        #snapBasePath            = Path('/snap/exelearning/current')
        snapUserPath            = Path(os.environ.get('SNAP_USER_COMMON'))
        #snapUserPath            = Path(os.environ.get('HOME'))

        snapSharePath           = snapBasePath / 'lib' / 'python2.7' / 'site-packages' / 'usr' /  'share'
        exePath                 = snapSharePath / 'exe'
        userConfigDir           = snapUserPath / '.exe'

        self.exePath            = exePath
        self.jsDir              = exePath
        self.webDir             = exePath
        self.mediaProfilePath   = exePath / 'exe/mediaprofiles'

        self.localeDir          = snapSharePath / 'locale'

        try:
            self.lastDir            = Path("/".join(snapUserPath.split("/")[:3]))
            self.dataDir            = Path("/".join(snapUserPath.split("/")[:3]))
        except:
            self.lastDir            = snapUserPath
            self.dataDir            = snapUserPath

        self.configDir          = userConfigDir
        self.stylesDir          = userConfigDir / 'style'
        self.templatesDir       = userConfigDir / 'content_template'

        # Media converters - defaults for now
        self.videoMediaConverter_ogv = ""
        self.videoMediaConverter_3gp = '/usr/bin/ffmpeg -i %(infile)s -s qcif -vcodec h263 -acodec libvo_aacenc -ac 1 -ar 8000 -r 25 -ab 32 -y %(outfile)s'
        self.videoMediaConverter_mpg = "/usr/bin/ffmpeg -i %(infile)s -s qcif -vcodec mpeg1 -acodec wav -ac 1 -ar 8000 -r 25 -ab 32 -y %(outfile)s"
        self.audioMediaConverter_au = "/usr/bin/sox %(infile)s %(outfile)s"
        self.audioMediaConverter_wav = "/usr/bin/sox %(infile)s %(outfile)s"
        self.audioMediaConverter_mp3 = "/usr/bin/sox %(infile)s -t wav - | /usr/bin/lame -b 32 - %(outfile)s"
        self.ffmpegPath = "/usr/bin/ffmpeg"

    def _getConfigPathOptions(self):
        """
        Returns the best places for a linux config file
        """
        return [self.configDir/'exe.conf']


# ===========================================================================
