#!/usr/bin/python
# ===========================================================================
# eXe
# Copyright 2004-2005, University of Auckland
#
# This module is for the TwiSteD web server.
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
    Launch the webXulrunner (Firefox) for this platform
    """
    log.info(u"Broswer path: " + config.xulrunnerPath)
    url     = u'http://127.0.0.1:%d/%s' % (config.port, quote(packageName))
    log.info(u"Launch xulrunner with " + config.xulrunnerPath)
    log.info(u"url "+url)

    launchString = ('"%s" -profile "%s" %s &' % 
                    (config.xulrunnerPath, profile, url))
    log.info(u'Launching xulrunner with: %s' % launchString)
    os.system(launchString)


def createProfile(config):
    """
    Create a profile for the user to use based on the one in /usr/share/exe
    """
    appDir  = Path(os.environ["HOME"])/'.exe'
    log.info("Creating FireFox profile copied from"+
             config.webDir+"/linux-profile to "+appDir+"/linux-profile")
    if not appDir.exists():
        appDir.mkdir()
    shutil.rmtree(appDir/"linux-profile", True)
    (config.webDir/'linux-profile').copytree(appDir/'linux-profile')
