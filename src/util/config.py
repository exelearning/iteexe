# ===========================================================================
# eXe config
# Copyright 2004, University of Auckland
#
# Config settings loaded from exe.conf
# Is responsible for the system-wide settings we use
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

from ConfigParser import ConfigParser
import logging
from logging import DEBUG, INFO, WARNING, ERROR, CRITICAL
import sys

# ===========================================================================
class Config:
    def __init__(self, configFile):
        self.setting = ConfigParser()
        self.setting.read(configFile)

    def setupLogging(self):
        hdlr = logging.FileHandler("exe.log")
        form = logging.Formatter('%(asctime)s %(name)s %(levelname)s %(message)s')
        log  = logging.getLogger()
        hdlr.setFormatter(form)
        log.addHandler(hdlr)
    
        for logger, level in self.setting.items("logging"):
            if logger == "root":
                logging.getLogger().setLevel(globals()[level])
            else:
                logging.getLogger(logger).setLevel(globals()[level])

# ===========================================================================
