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
import sys
import logging
import gettext
_   = gettext.gettext
 
log = logging.getLogger(__name__)

def launchBrowser(config, packageName):
    """
    Launch the webbrowser (Firefox) for this platform
    """
    log.info("Broswer path: " + config.browserPath)
    url     = 'http://localhost:%d/%s' % (config.port, packageName)
    profile = config.exeDir+'/win-profile'
    log.info("Launch firefox with "+config.browserPath)
    log.info("profile "+profile)
    log.info("url "+url)

    if sys.platform[:3] == "win":
        try:
            os.spawnl(os.P_DETACH, config.browserPath, 
                      '"'+config.browserPath+'"', 
                      '-profile', '"'+profile+'"', url)
        except OSError:
            print "Cannot launch Firefox, please manually run Firefox"
            print "and go to", url     
    else:
        os.system(config.browserPath+" "+url+"&")


