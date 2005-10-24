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
    applicationPath = config.xulDir/'exe'/'application.ini'
    log.info(u"xulrunnerPath  = " + config.xulrunnerPath)
    log.info(u"applicatonPath = " + applicationPath)
    log.info(u"xulrunnerFlags = " + config.xulrunnerFlags)
    
    if sys.platform[:3] == u"win":
        os.spawnl(os.P_NOWAIT, config.xulrunnerPath,
                  config.xulrunnerPath.basename(),
                  config.xulrunnerFlags,
                  applicationPath)

    else:
        launchString  = config.xulrunnerPath
        launchString += " " + applicationPath + " "
        launchString += config.xulrunnerFlags
        launchString += "&"
        log.info(u'Launching xulrunner with: ' + launchString)
        os.system(launchString)
