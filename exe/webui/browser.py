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
Browser module
"""


import os
import os.path
import shutil
import sys
import logging
import gettext
from urllib import quote
_   = gettext.gettext
 
log = logging.getLogger(__name__)

def launchBrowser(config, packageName):
    """
    Launch the webbrowser (Firefox) for this platform
    """
    log.info("Broswer path: " + config.browserPath)
    url     = 'http://localhost:%d/%s' % (config.port, quote(packageName))
    log.info("Launch firefox with "+config.browserPath)
    log.info("url "+url)

    if sys.platform[:3] == "win":
        profile = config.exeDir+'/win-profile'
        log.info("profile "+profile)
        try:
            os.spawnl(os.P_DETACH, config.browserPath, 
                      '"'+config.browserPath+'"', 
                      '-profile', '"'+profile+'"', url)
        except OSError:
            print "Cannot launch Firefox, please manually run Firefox"
            print "and go to", url     
    else:
        profile = os.environ["HOME"]+'/.exe/linux-profile'
        if not os.path.exists(profile):
            createProfile(config)

        log.info("profile "+profile)
        os.system('"'+config.browserPath+'" -profile "'+profile+
                  '" -chrome '+url+'&')


def createProfile(config):
    """
    Create a profile for the user to use based on the one in /usr/share/exe
    """
    appDir  = os.environ["HOME"]+'/.exe'
    log.info("Creating FireFox profile copied from"+
             config.exeDir+"/linux-profile to "+appDir+"/linux-profile")
    if not os.path.exists(appDir):
        os.mkdir(appDir)
    shutil.copytree(config.exeDir+"/linux-profile", appDir+"/linux-profile")
        

