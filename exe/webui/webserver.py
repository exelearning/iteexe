#!/usr/bin/python
# -*- coding: utf-8 -*-
# ===========================================================================
# eXe
# Copyright 2004-2006, University of Auckland
# Copyright 2006-2007 eXe Project, New Zealand Tertiary Education Commission
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
# Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
# ===========================================================================

"""
WebServer module
"""

# Redirect std err for importing twisted and nevow
import sys
from cStringIO import StringIO
sys.stderr, oldStdErr = StringIO(), sys.stderr
sys.stdout, oldStdOut = StringIO(), sys.stdout
try:
    from twisted.internet              import reactor
    from twisted.internet.error        import CannotListenError
    from exe.webui.packageredirectpage import PackageRedirectPage
finally:
    sys.stderr = oldStdErr
    sys.stdout = oldStdOut
from exe.webui.editorpage          import EditorPage
from exe.webui.stylemanagerpage    import StyleManagerPage
from exe.webui.preferencespage     import PreferencesPage
from exe.webui.aboutpage           import AboutPage
from exe.webui.releasenotespage    import ReleaseNotesPage
from exe.webui.styledesigner import StyleDesigner
# jrf - legal notes
from exe.webui.legalpage import LegalPage
from exe.webui.quitpage            import QuitPage
from exe.webui.iecmwarning         import IECMWarningPage
from exe.webui.renderable          import File
from exe.webui.xliffimportpreferencespage import XliffImportPreferencesPage
from exe.webui.dirtree import DirTreePage
from exe.webui.session import eXeSite
from exe.webui.oauthpage import OauthPage
from exe import globals as G

from exe.webui.templatemanagerpage import TemplateManagerPage

import logging
log = logging.getLogger(__name__)


class WebServer:
    """
    Encapsulates some twisted components to serve
    all webpages, scripts and nevow functionality
    """
    def __init__(self, application, packagePath=None):
        """
        Initialize
        """
        self.application = application
        self.config = application.config
        self.tempWebDir = application.tempWebDir
        self.root = PackageRedirectPage(self, packagePath)
        self.editor = EditorPage(self.root)
        self.stylemanager = StyleManagerPage(self.root)
        self.preferences = PreferencesPage(self.root)
        self.xliffimportpreferences = XliffImportPreferencesPage(self.root)
        self.dirtree = DirTreePage(self.root)
        self.about = AboutPage(self.root)
        self.releasenotes = ReleaseNotesPage(self.root)
        self.styledesigner = StyleDesigner(self.root)
        # jrf - legal notes
        self.legal = LegalPage(self.root)
        self.quit = QuitPage(self.root)
        self.iecmwaring = IECMWarningPage(self.root)
        self.oauth = OauthPage(self.root)
        self.monitoring = False
        
        self.templatemanager = TemplateManagerPage(self.root)       
    
    def find_port(self):
        """
        Previously part of the run() method, this will find the port for this
        server.  Moved outside such that it could be called prior to run()
        [via application's serve()], which doesn't get called until the
        client has already been started [via application's launch()].
        Instead, we want to determine the server's port first [via
        application's prelaunch()] such that the client knows it.
        Note: for safety down the road once run() is called, the port will
        be set to -1 if none is found.
        """
        # check the configured port.  If not available, then
        # loop through a range of available ports to try and find a free one:
        port_test_done = 0
        found_port = 0
        found_other_eXe = 0
        test_port_num = self.config.port
        test_port_count = 0

        # could set a maximum range within the users's config file,
        # but for now, just hardcode a max:
        max_port_tests = 5000
        while not port_test_done:
            test_port_num = self.config.port + test_port_count
            try:
                log.debug("find_port(): trying to listenTCP on port# %d",
                        test_port_num)
                reactor.listenTCP(test_port_num, 
                                  eXeSite(self.root),
                                  interface="127.0.0.1")
                log.debug("find_port(): still here without exception " \
                           "after listenTCP on port# %d", test_port_num)
                found_port = 1
                port_test_done = 1
            except CannotListenError, exc:
                log.debug("find_port(): caught exception after listenTCP " \
                         + "on port# %d, exception = %s", test_port_num, exc)
                last_exception = exc
                test_port_count += 1
                if test_port_count >= max_port_tests:
                    port_test_done = 1

        if found_port:
            self.config.port = test_port_num
            log.info("find_port(): found available eXe port# %d", 
                      self.config.port)
        else:
            self.config.port = -1
            if found_other_eXe:
                log.error("find_port(): found another eXe server running " \
                            + "on port# %d; only one eXe server allowed " \
                            + "to run at a time", test_port_num)
            else:
                log.error("find_port(): Can't listen on interface 127.0.0.1"\
                        + ", ports %s-%s, last exception: %s" % \
                         (self.config.port, test_port_num,  \
                          unicode(last_exception)))

    def run(self):
        """
        Start serving webpages from the local web server
        """
        log.debug("start web server running")

        # web resources
        webDir = self.config.webDir
        self.root.putChild("images", File(webDir + "/images"))
        self.root.putChild("css", File(webDir + "/css"))
        self.root.putChild("scripts", File(webDir + "/scripts"))
        self.root.putChild("style", File(self.config.stylesDir))
        self.root.putChild("docs", File(webDir + "/docs"))
        self.root.putChild("temp_print_dirs",
                              File(self.tempWebDir + "/temp_print_dirs"))
        self.root.putChild("previews",
                              File(self.tempWebDir + "/previews"))
        self.root.putChild("templates", File(webDir + "/templates"))
        self.root.putChild("tools", File(webDir + "/tools"))

        # new ExtJS 4.0 Interface
        jsDir = self.config.jsDir
        self.root.putChild("jsui", File(jsDir + "/scripts"))

        # A port for this server was looked for earlier by find_port.
        # Ensure that it is valid (>= 0):
        if self.config.port >= 0:
            log.info("run() using eXe port# %d", self.config.port)
            reactor.run()
        else:
            log.error("ERROR: webserver's run() called, but a valid port " \
                    + "was not available.")

    def monitor(self):
        if self.monitoring:
            for mainpage in self.root.mainpages.values():
                for mainpage in mainpage.values():
                    if mainpage.clientHandleFactory.clientHandles:
                        reactor.callLater(10, self.monitor)
                        return
            G.application.config.configParser.set('user', 'lastDir', G.application.config.lastDir)
            reactor.stop()
