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
from exe.engine import version

import os
import logging
import signal
import sys

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

    def run(self):
        """
        Start serving webpages from the local Flask web server
        """
        log.info("************** eXe logging started **************")
        log.info("Serving Flask app '%s'", __name__)
        log.info("version     = %s", version.version)
        log.info("configPath  = %s", self.config.configPath)
        log.info("exePath     = %s", os.path.abspath(__file__))
        log.info("libPath     = %s", os.path.dirname(os.__file__))
        log.info("browser     = %s", self.config.browser if hasattr(self.config, 'browser') else 'None')
        log.info("webDir      = %s", self.config.webDir)
        log.info("jsDir       = %s", self.config.jsDir)
        log.info("localeDir   = %s", self.config.localeDir)
        log.info("port        = %d", self.config.port)
        log.info("dataDir     = %s", self.config.dataDir)
        log.info("configDir   = %s", self.config.configDir)
        log.info("locale      = %s", self.config.locale)
        locale_path = os.path.join(self.config.localeDir, self.config.locale)
        if not os.path.exists(locale_path):
            log.warning("Locale '%s' not found, defaulting to 'en'", self.config.locale)
            self.config.locale = 'en'
            locale_path = os.path.join(self.config.localeDir, self.config.locale)
            if not os.path.exists(locale_path):
                os.makedirs(locale_path)
                log.info("Created missing directory: %s", locale_path)
        log.info("internalAnchors = %s", self.config.internalAnchors)
        if hasattr(self.config, 'license'):
            log.info("License = %s", self.config.license)
        else:
            log.warning("License attribute not found in config")
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

        # Start the Flask server
        log.info("Starting Flask server on port: %d", self.config.port)
        # Handle SIGINT to gracefully shutdown the server
        def signal_handler(sig, frame):
            log.info("Shutting down the server...")
            sys.exit(0)

        signal.signal(signal.SIGINT, signal_handler)

        self.app.run(host='127.0.0.1', port=self.config.port)

    def monitor(self):
        if self.monitoring:
            for mainpage in list(self.root.mainpages.values()):
                for mainpage in list(mainpage.values()):
                    if mainpage.clientHandleFactory.clientHandles:
                        reactor.callLater(10, self.monitor)
                        return
            G.application.config.configParser.set('user', 'lastDir', G.application.config.lastDir)
            reactor.stop()
