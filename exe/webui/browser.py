#!/usr/bin/python
# ===========================================================================
# eXe
# Copyright 2004-2006, University of Auckland
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
from urllib import quote
from twisted.internet import reactor
 
log = logging.getLogger(__name__)


def launchBrowser(config, packageName):
    """
    Launch the webbrowser (Firefox) for this platform
    """
    log.info(u"Browser path: " + config.browserPath)
    url     = u'http://127.0.0.1:%d/%s' % (config.port, quote(packageName))
    log.info(u"url "+url)

    if sys.platform[:3] == u"win":
        profile    = "win-profile"
    else:
        profile    = "linux-profile"

    if (config.configDir/profile).exists():
        (config.configDir/profile).rmtree()
    log.info("Creating FireFox profile copied from"+
             config.webDir/profile+" to "+
             config.configDir/profile)
    (config.webDir/profile).copytree(config.configDir/profile)

    log.info("setupMoz configDir "+config.configDir+ " profile "+profile)
    log.info(u"profile = " + config.configDir/profile)

    if sys.platform[:3] == u"win":
        try:
            # Set MOZ_NO_REMOTE so exe doesn't conflict with Firefox
            os.environ["MOZ_NO_REMOTE"] = "1"
            os.spawnl(os.P_DETACH, 
                      config.browserPath,
                      config.browserPath.basename(),
                      '-profile', 
                      '"' + config.configDir/profile + '"', 
                      url)
            # ugly hack to try and fix the firefox not starting first time bug
            reactor.callLater(10, tryAgain, config, profile, url)
        except OSError:
            print u"Cannot launch Firefox, please manually run Firefox"
            print u"and go to", url     

    else:
        # Set LOGNAME so exe doesn't conflict with Firefox
        launchString  = 'LOGNAME=eXe7913 '
        launchString += config.browserPath
        launchString += ' -profile "' + config.configDir/profile + '" '
        launchString += url
        launchString += "&"
        log.info(u'Launching firefox with: ' + launchString)
        os.system(launchString)


def tryAgain(config, profile, url):
    """
    Second try of launching the browser,
    called by reactor on a timer thingy
    """
    os.spawnl(os.P_DETACH, 
              config.browserPath,
              config.browserPath.basename(),
              '-profile', 
              '"' + config.configDir/profile + '"', 
              url)

