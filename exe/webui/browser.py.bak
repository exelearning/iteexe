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
import mywebbrowser
from exe.engine.path import Path
from exe             import globals as G

log = logging.getLogger(__name__)


def launchBrowser(config, packageName):
    """
    Launch the configured webbrowser for this platform
    """
    url = u'%s/%s' % (G.application.exeAppUri, quote(packageName))
    log.info(u"url " + url)
    dfbrw=mywebbrowser.get()
    withdefaultbrowser=True
    if config.browser!=None:
        try:
            config.browser = mywebbrowser.get(config.browser)
            if not config.browser.open(url):
                log.error("Unable to open defined browser: " + config.browser.name)
                withdefaultbrowser = True
            else:
                withdefaultbrowser = False
        except:
            browser_path = Path(config.browser)
            if browser_path.exists():
                log.info(u"path browser " + browser_path.abspath())
                mywebbrowser.register("custom-browser" , None, mywebbrowser.BackgroundBrowser(browser_path.abspath()), -1)
                config.browser = mywebbrowser.get("custom-browser")
                if not config.browser.open(url):
                    log.error("Unable to open custom defined browser: " + browser_path.abspath())
                    withdefaultbrowser=True
                else:
                    withdefaultbrowser=False   
    if withdefaultbrowser:
        config.browser = dfbrw
        config.browser.open(url, new=0, autoraise=True)
    if hasattr(config.browser, "name"):
        log.info(u"Defined Browser: " + config.browser.name)
    



