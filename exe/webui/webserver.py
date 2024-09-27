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

# Redirect std err for importing twisted
import sys
from io import StringIO
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
from flask import Flask
from exe.webui.aboutpage import AboutPage
from exe.webui.releasenotespage    import ReleaseNotesPage
from exe.webui.styledesigner import StyleDesigner
# jrf - legal notes
from exe.webui.legalpage import legal_page
from exe.webui.quitpage            import QuitPage
from flask import send_from_directory
from exe.webui.xliffimportpreferencespage import XliffImportPreferencesPage
from exe.webui.dirtree import DirTreePage
from exe.webui.oauthpage import OauthPage
from exe import globals as G

from exe.webui.templatemanagerpage import TemplateManagerPage

import os
import logging

# Configurar el nivel de registro para mostrar mensajes de información
logging.basicConfig(level=logging.INFO)

log = logging.getLogger(__name__)


class WebServer:
    """
    Encapsulates Flask components to serve
    all webpages and scripts
    """
    def __init__(self, application):
        self.application = application
        self.config = application.config
        self.config.localeDir = os.path.join(os.path.dirname(__file__), '..', 'locale')
        self.app = Flask(__name__)
        self.ensure_directories_exist()
        self.about = AboutPage(self.app)
        self.release_notes = ReleaseNotesPage(self.app)

    def ensure_directories_exist(self):
        """
        Ensure that necessary directories exist.
        """
        directories = [
            self.config.webDir + "/content_template",
            self.config.webDir + "/scripts/idevices",
            self.config.localeDir,
            os.path.join(self.config.localeDir, "en"),
            "/Users/ernesto/Downloads/Resources/exe/style",
            "/Users/ernesto/.exe/style"
        ]
        for directory in directories:
            if not os.path.exists(directory):
                os.makedirs(directory)
                log.info("Created missing directory: %s", directory)
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
                from twisted.internet.protocol import Factory, Protocol

                class SimpleProtocol(Protocol):
                    def dataReceived(self, data):
                        pass

                class SimpleFactory(Factory):
                    protocol = SimpleProtocol

                reactor.listenTCP(test_port_num, SimpleFactory(), 
                                  interface="127.0.0.1")
                log.debug("find_port(): still here without exception " \
                           "after listenTCP on port# %d", test_port_num)
                found_port = 1
                port_test_done = 1
            except CannotListenError as exc:
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
                          str(last_exception)))

    def run(self):
        """
        Start serving webpages from the local Flask web server
        """
        log.info("************** eXe logging started **************")
        log.info("version     = 2.9")
        log.debug("start web server running")

        # web resources
        webDir = self.config.webDir
        @self.app.route('/images/<path:filename>')
        def images(filename):
            return send_from_directory(webDir + "/images", filename)

        @self.app.route('/css/<path:filename>')
        def css(filename):
            return send_from_directory(webDir + "/css", filename)

        @self.app.route('/scripts/<path:filename>')
        def scripts(filename):
            return send_from_directory(webDir + "/scripts", filename)

        @self.app.route('/style/<path:filename>')
        def style(filename):
            return send_from_directory(self.config.stylesDir, filename)

        @self.app.route('/docs/<path:filename>')
        def docs(filename):
            return send_from_directory(webDir + "/docs", filename)

        @self.app.route('/temp_print_dirs/<path:filename>')
        def temp_print_dirs(filename):
            return send_from_directory(self.tempWebDir + "/temp_print_dirs", filename)

        @self.app.route('/previews/<path:filename>')
        def previews(filename):
            return send_from_directory(self.tempWebDir + "/previews", filename)

        @self.app.route('/templates/<path:filename>')
        def templates(filename):
            return send_from_directory(webDir + "/templates", filename)

        @self.app.route('/tools/<path:filename>')
        def tools(filename):
            return send_from_directory(webDir + "/tools", filename)

        jsDir = self.config.jsDir

        @self.app.route('/jsui/<path:filename>')
        def jsui(filename):
            return send_from_directory(jsDir + "/scripts", filename)

        @self.app.route('/')
        def index():
            return "<h1>Welcome to the eXe Web Server</h1>"

        # A port for this server was looked for earlier by find_port.
        # Ensure that it is valid (>= 0):
        while self.config.port >= 0:
            log.info("run() using eXe port# %d", self.config.port)
            try:
                reactor.run()
                break
            except OSError as e:
                if "Address already in use" in str(e):
                    log.error("Port %d is in use, trying to find another port.", self.config.port)
                    self.config.port += 1  # Increment port number
                else:
                    raise
        if self.config.port < 0:
            log.error("ERROR: webserver's run() called, but a valid port " \
                      + "was not available.")

    def monitor(self):
        if self.monitoring:
            for mainpage in list(self.root.mainpages.values()):
                for mainpage in list(mainpage.values()):
                    if mainpage.clientHandleFactory.clientHandles:
                        reactor.callLater(10, self.monitor)
                        return
            G.application.config.configParser.set('user', 'lastDir', G.application.config.lastDir)
            reactor.stop()
