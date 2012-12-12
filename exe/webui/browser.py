#!/usr/bin/python
# ===========================================================================
# eXe
# Copyright 2004-2006, University of Auckland
# Copyright 2004-2008 eXe Project, http://www.eXeLearning.org/
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

import logging
from urllib import quote
import webbrowser
import sys

log = logging.getLogger(__name__)

def launchBrowser(config, packageName):
    """
    Launch the configured webbrowser for this platform
    """
    if config.browser == None and sys.platform[:6] == "darwin":
        config.browser = webbrowser.get("safari")
    else:
        config.browser = webbrowser.get(config.browser)
    if hasattr(config.browser, "basename"):
        log.info(u"Defined Browser: " + config.browser.basename)
    url = u'http://127.0.0.1:%d/%s' % (config.port, quote(packageName))
    log.info(u"url "+url)

    config.browser.open(url)
