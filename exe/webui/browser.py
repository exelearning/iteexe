#!/usr/bin/python
# ===========================================================================
# eXe
# Copyright 2004-2006, University of Auckland
# Copyright 2007 eXe Project, New Zealand Tertiary Education Commission
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
import re
import logging
from urllib import quote
from twisted.internet import reactor
 
log = logging.getLogger(__name__)

def setVersionInPrefs(version_string, profile_dir):
    prefs = os.path.join(profile_dir, "prefs.js")
    try:
        lines = open(prefs, 'rt').readlines()
        prefs = open(prefs, 'wt')
        for line in lines:
            if line.find("extensions.lastAppVersion") > -1:
                line = re.sub(r'\d+\.\d+\.\d+\.\d+',
                        version_string, line, 1)
                log.info(u"updated browser version in prefs: " + line)
            prefs.write(line)
    except IOError:
        log.info(u"Unable to update version number in Firefox preferences")

def setBrowserVersion(browserPath, profile_dir):
    version = os.popen(browserPath + " -v", "r").read()
    log.info(u"Firefox version: " + version)
    vs = re.search(r"(?P<vs>\d+\.\d+\.\d+\.\d+)", version)
    if vs:
        setVersionInPrefs(vs.group('vs'), profile_dir)

def launchBrowser(config, packageName):
    """
    Launch the webbrowser (Firefox) for this platform
    """
    log.info(u"Browser path: " + config.browserPath)
    url     = u'http://127.0.0.1:%d/%s' % (config.port, quote(packageName))
    url = "-chrome file://\"" + config.webDir + "/docs/splash.xul\""

    log.info(u"url "+url)

    profile_src = "linux-profile"
    if sys.platform[:3] == u"win":
        profile     = "linux-profile"
    else:
        # workaround Debian/Ubuntu firefox launching script that requires
        # ':/' in the pathname
        profile = "linux-profile:"

    if (config.configDir/profile).exists():
        (config.configDir/profile).rmtree()
    log.info("Creating FireFox profile copied from"+
             config.webDir/profile_src+" to "+
             config.configDir/profile)
    # Copy over the tree
    (config.webDir/profile_src).copytreeFilter(config.configDir/profile,
            filterDir=lambda dirName: dirName.basename() != '.svn')

    # if in debug mode, don't allow eXeex to remove all the Firefox "debug" features
    # lines containing 'debug' are deleted from the XUL file
    if log.getEffectiveLevel() == logging.DEBUG:
        try:
            exeex_xul = config.configDir/profile/"extensions/exeex@exelearning.org/chrome/content/exeex.xul"
            exxul = open(exeex_xul, 'rt').readlines()
            outf = open(exeex_xul, 'wt')
            for line in exxul:
                if line.find('debug') < 0:
                    outf.write(line)
            outf.close()
        except IOError:
            log.debug(u"Unable to modify eXeex for debug mode")

    log.info("setupMoz configDir "+config.configDir+ " profile "+profile)
    log.info(u"profile = " + config.configDir/profile)

    # if using the system Firefox, set the version so user doesn't see
    # the extension update check
    if sys.platform[:5] == u"linux":
        setBrowserVersion(config.browserPath, config.configDir/profile)
    elif sys.platform[:3] == u"win":
        setVersionInPrefs('2.0.0.1', config.configDir/profile)

    if sys.platform[:3] == u"win":
        try:
            # Set MOZ_NO_REMOTE so that eXe doesn't conflict with
            # other versions or profiles of Firefox.
            os.environ["MOZ_NO_REMOTE"] = "1"
            os.spawnl(os.P_DETACH, 
                      config.browserPath,
                      config.browserPath.basename(),
                      '-profile', 
                      '"' + config.configDir/profile + '"', 
                      url)
            log.info(u'Launching firefox: ' + config.configDir/profile )
            log.info(u'Launching firefox: ' + url)
        except OSError:
            print u"Cannot launch Firefox, please manually run Firefox"
            print u"and go to", url     

    else:
        # Set LOGNAME so exe doesn't conflict with Firefox
        launchString  = 'LOGNAME=eXe7913 '
        launchString += config.browserPath
        launchString += ' -profile "' + config.configDir/profile + '/" '
        launchString += url
        launchString += "&"
        log.info(u'Launching firefox: ' + launchString)
        os.system(launchString)
