#!/usr/bin/python
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
# Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
# ===========================================================================

"""
WebServer module
"""

# Redirect std err for importing twisted and nevow
import os
import sys
import socket  # to test ports already in use...
from cStringIO import StringIO
sys.stderr, oldStdErr = StringIO(), sys.stderr
sys.stdout, oldStdOut = StringIO(), sys.stdout
try:
    from twisted.internet              import reactor
    from twisted.web                   import server
    from twisted.internet.error        import CannotListenError
    from twisted.web                   import resource
    from twisted.internet              import defer
    from nevow                         import compy
    from nevow                         import appserver
    from nevow                         import inevow
    from nevow.i18n                    import languagesFactory
    from twisted.web                   import static
finally:
    print sys.stderr
    sys.stderr = oldStdErr
    print sys.stdout
    sys.stdout = oldStdOut
from exe.webui.packageredirectpage import PackageRedirectPage
from exe.webui.editorpage          import EditorPage
from exe.webui.preferencespage     import PreferencesPage
from exe.webui.xliffexportpreferencespage import XliffExportPreferencesPage
from exe.webui.xliffimportpreferencespage import XliffImportPreferencesPage
from exe.webui.dirtree import DirTreePage
from exe.webui.aboutpage           import AboutPage
from exe                           import globals as G
from exe.engine.packagestore import PackageStore


import logging
log = logging.getLogger(__name__)

def setLocaleFromRequest(request):
    acceptedLocales = languagesFactory(request)
    for locale in acceptedLocales:
        try:
            G.application.config.locales[locale].install(unicode=True)
            break
        except KeyError:
            pass
    
    G.application.config.locale = locale
    return locale

class eXeResourceAdapter(appserver.OldResourceAdapter):
    def renderLocalized(self, request):
#        setLocaleFromRequest(request)
        return self.original.render(request)
        
    def renderHTTP(self, ctx):
        request = inevow.IRequest(ctx)
        if self.real_prepath_len is not None:
            path = request.postpath = request.prepath[self.real_prepath_len:]
            del request.prepath[self.real_prepath_len:]
        result = defer.maybeDeferred(self.renderLocalized, request).addCallback(
            self._handle_NOT_DONE_YET, request)
        return result

compy.registerAdapter(eXeResourceAdapter, resource.IResource, inevow.IResource)


class eXeRequest(appserver.NevowRequest):
    def __init__(self, *args, **kw):
        appserver.NevowRequest.__init__(self, *args, **kw)
        self.locale = None

    def gotPageContext(self, pageContext):
        request = inevow.IRequest(pageContext)
#        self.locale = setLocaleFromRequest(request)
        appserver.NevowRequest.gotPageContext(self, pageContext)

class eXeSession(server.Session):
    def __init__(self, *args, **kwargs):
        server.Session.__init__(self, *args, **kwargs)
        self.packageStore = PackageStore()


class eXeSite(appserver.NevowSite):
    requestFactory = eXeRequest

    def makeSession(self):
        """Generate a new Session instance, and store it for future reference.
        """
        uid = self._mkuid()
        s = eXeSession(self, uid)
        session = self.sessions[uid] = s
        reactor.callLater(1800, s.checkExpired)
        return session
    

class WebServer:
    """
    Encapsulates some twisted components to serve
    all webpages, scripts and nevow functionality
    """
    def __init__(self, application):
        """
        Initialize
        """
        self.application = application
        self.config      = application.config
        self.tempWebDir  = application.tempWebDir
        self.root        = PackageRedirectPage(self)   
        self.editor      = EditorPage(self.root)
        self.preferences = PreferencesPage(self.root)
        self.xliffexportpreferences = XliffExportPreferencesPage(self.root)
        self.xliffimportpreferences = XliffImportPreferencesPage(self.root)
        self.dirtree     = DirTreePage(self.root)
        self.about       = AboutPage(self.root)


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
                                  interface="0.0.0.0")
                log.debug("find_port(): still here without exception " \
                           "after listenTCP on port# %d", test_port_num)
                found_port = 1
                port_test_done = 1
            except CannotListenError, exc:
                log.debug("find_port(): caught exception after listenTCP " \
                         + "on port# %d, exception = %s", test_port_num, exc)
                last_exception = exc
                ###########################
                # Since we can connect to this port, see if it's already 
                # running an eXe server, as we only want 1 running at a time:
                #
                test_this_host = "127.0.0.1"
                log.debug("find_port(): appears that a service is already " \
                      + "running on port# %d, seeing if it is another eXe", \
                      test_port_num)
                s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                s.connect((test_this_host, test_port_num))
                # unset any blocking:
                s.setblocking(0)
                # set timeout to reasonably "large enough", but not "too 
                # large" (note that google, e.g., sometimes requires 3secs):
                s.settimeout(3)                
                # and send a basic HTTP request to obtain the server info:
                s.send('GET / HTTP/1.0\r\n\r\n')
                try:
                    data = s.recv(1024)
                    log.debug("find_port(): socket test of existing port " \
                            + "gave result of: %s", repr(data))
                    exe_server_string = "Server: eXeTwistedWeb/" 
                    # above followed by the actual TwistedWeb version number
                    exe_server_string_pos = data.find(exe_server_string)
                    if exe_server_string_pos >= 0:
                        log.debug("find_port(): appears that another eXe " \
                           + "server is running on port# %d; terminating.", \
                           test_port_num)
                        found_other_eXe = 1                        
                        port_test_done = 1
                    else:
                        log.debug("find_port(): port# %d not in use by a newer eXe server, but checking if it is Twisted server, in general...", test_port_num)
                        # or, for older versions of eXe, check for regular ol' TwistedWeb server:
                        twisted_server_string = "Server: TwistedWeb/" # followed by the Actual TwistedWeb version number
                        twisted_server_string_pos = data.find(twisted_server_string)
                        if twisted_server_string_pos >= 0:
                            log.debug("find_port(): appears that an earlier version of an eXe server might already running on port# %d; terminating.", test_port_num)
                            found_other_eXe = 1                        
                            port_test_done = 1
                except socket.error, msg:
                    log.debug("find_port(): timeout on socket port# %d, " \
                            + "probably not an eXe so continuing search.  " \
                            + "[timeout exception = %s]", test_port_num, \
                            str(msg))
                s.close()  
                #
                ##########################
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
        self.root.putChild("images",      static.File(webDir+"/images"))
        self.root.putChild("css",         static.File(webDir+"/css"))   
        self.root.putChild("scripts",     static.File(webDir+"/scripts"))
        self.root.putChild("style",       static.File(webDir+"/style"))
        self.root.putChild("docs",        static.File(webDir+"/docs"))
        self.root.putChild("temp_print_dirs",
                              static.File(self.tempWebDir+"/temp_print_dirs"))
        self.root.putChild("previews",    
                              static.File(self.tempWebDir+"/previews"))

        # xul resources
        xulDir = self.config.xulDir
        self.root.putChild("xulscripts",  static.File(xulDir+"/scripts"))
        self.root.putChild("xultemplates",  static.File(xulDir+"/templates"))
        self.root.putChild("templates",   static.File(webDir+"/templates"))

        # sub applications
#        self.root.putChild("editor",      self.editor)
#        self.root.putChild("preferences", self.preferences)
#        self.root.putChild("xliffexport", self.xliffexportpreferences)
#        self.root.putChild("xliffimport", self.xliffimportpreferences)
#        self.root.putChild("about",       self.about)

        # new ExtJS 4.0 Interface
        jsDir = self.config.jsDir
        self.root.putChild("jsui", static.File(jsDir + "/scripts"))
        
        # A port for this server was looked for earlier by find_port.  
        # Ensure that it is valid (>= 0):
        if self.config.port >= 0:
            log.info("run() using eXe port# %d", self.config.port)
            reactor.run()
        else:
            log.error("ERROR: webserver's run() called, but a valid port " \
                    + "was not available.")

