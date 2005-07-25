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
import sys
import logging
import gettext
import shutil
from exe.engine.path import Path
from urllib import quote
_   = gettext.gettext
 
log = logging.getLogger(__name__)

def launchBrowser(config, packageName):
    """
    Launch the webbrowser (Firefox) for this platform
    """
    log.info(u"Broswer path: " + config.browserPath)
    url     = u'http://localhost:%d/%s' % (config.port, quote(packageName))
    log.info(u"Launch firefox with "+config.browserPath)
    log.info(u"url "+url)

    if sys.platform[:3] == u"win":
        # TODO: Should we copy this to config.appDataDir?
        profile = config.webDir+'/win-profile'
        log.info(u"profile "+profile)
        try:
            os.spawnl(os.P_DETACH, config.browserPath, 
                      u'"'+config.browserPath+'"', 
                      u'-profile', u'"'+profile+u'"', url)
        except OSError:
            print u"Cannot launch Firefox, please manually run Firefox"
            print u"and go to", url     
    else:
        # TODO: Should be using the profile dir from config, not overrideing it!
        profile = Path(os.environ["HOME"])/'.exe/linux-profile'
        createProfile(config)

        log.info(u"profile "+profile)
        launchString = ('"%s" -profile "%s" %s &' % 
                        (config.browserPath, profile, url))
        log.info(u'Launching browser with: %s' % launchString)
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
