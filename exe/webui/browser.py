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
import webbrowser
import os.path

log = logging.getLogger(__name__)


def launchBrowser(config, packageName):
    """
    Launch the configured webbrowser for this platform
    """
    url = u'http://127.0.0.1:%d/%s' % (config.port, quote(packageName))
    log.info(u"url " + url)
    dfbrw=webbrowser.get()
    withdefaultbrowser=True
    if config.browser!=None:
        if os.path.exists(config.browser):
            absopath=os.path.abspath(config.browser)
            log.info(u"path browser " + absopath)
            webbrowser.register('exebrowser' , None, webbrowser.BackgroundBrowser(absopath), -1)
            config.browser = webbrowser.get('exebrowser')        
            if config.browser.open(url)== False:
                log.info(u"error " + absopath)
                withdefaultbrowser=True
            else:
                withdefaultbrowser=False   
    if withdefaultbrowser:
        config.browser = dfbrw
        config.browser.open(url, new=0, autoraise=True)
    if hasattr(config.browser, "basename"):
        log.info(u"Defined Browser: " + config.browser.basename)
    



