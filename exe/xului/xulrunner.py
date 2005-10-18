#!/usr/bin/python
# ===========================================================================
# eXe
# Copyright 2004-2005, University of Auckland
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
Xulrunner module
"""


import os
import sys
import logging
import shutil
from exe.engine.path import Path
from urllib import quote
 
log = logging.getLogger(__name__)

def launchXulrunner(config, packageName):
    """
    Launch Xulrunner with the eXe application
    """
    log.info(u"Browser path: " + config.xulrunnerPath)
    log.info(u"Launch xulrunner with " + config.xulrunnerPath)
    os.spawnl(os.P_NOWAIT, config.xulrunnerPath,
              config.xulrunnerPath.basename(),
              config.xulDir/'exe'/'application.ini')
