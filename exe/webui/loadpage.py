# ===========================================================================
# eXe
# Copyright 2004-2005, University of Auckland
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

import sys
import os.path
import logging
import gettext
import pickle
from twisted.web import static
from twisted.web.resource import Resource
from exe.webui import common
from exe.engine.packagestore import g_packageStore
from exe.webui.webinterface import g_webInterface
from exe.webui.menupane import MenuPane
from exe.webui.authoringpage import AuthoringPage
from exe.webui.propertiespage import PropertiesPage
from exe.webui.savepage import SavePage
from exe.webui.webinterface import g_webInterface


log = logging.getLogger(__name__)
_   = gettext.gettext


class LoadPage(Resource):
    """
    The LoadPage is responsible for loading an existing package
    """
    
    def __init__(self):
        Resource.__init__(self)
        self.menuPane = MenuPane()
        self.package  = None
        
    def process(self, request):
        log.debug("process" + repr(request.args))
        
        packageName = request.prepath[0]
        self.package = g_packageStore.getPackage(packageName)
        
        if "load" in request.args: 
            dataDir = g_webInterface.config.getDataDir()
            os.chdir(dataDir)
            if "saveChk" in request.args:
                fileName = self.package.name + ".pkg"                
                outfile = open(fileName, "w")
                pickle.dump(self.package, outfile)
                outfile.close()
                
            
            infile = open(request.args["fileName"][0])
            package = pickle.load(infile)
            self.package = package
            g_packageStore.addPackage(package)
            

    def render_GET(self, request):
        
        # processing 
        log.debug("render_GET")
        self.process(request)
        self.menuPane.process(request)
                        
        # Rendering
        
        html  = common.header()
        html += common.banner()
        html += self.menuPane.render()
        html += "<form method=\"post\" name = \"saveForm\" action=\"%s\">" % request.path
        html += "<br/>" + _("Would you like to save current changes?") + "<br/>"
        #html += "<pre>%s</pre>\n" % str(request.args)
        html += "<input type = \"checkbox\" name = \"saveChk\" checked>"
        html += _(" Save the current package") + "<br/><br/>"    
        html += _(" Please select a file") + "<br/>"
        html += "<input type = \"file\" name = \"fileName\">"
        html += "<br/><br/>"
        html += common.submitButton("load", _("Load"))
        html += "<br/></form>"
        html += common.footer()
        
        return html
    
    def render_POST(self, request):
        """Get an existing package and redirect the webrowser to the URL for it"""
        log.debug("render_POST" + repr(request.args))
        
        self.process(request)
        package = g_packageStore.getPackage(self.package.name)
        log.info("getting an existing package name="+ package.name)
        authoringPage = AuthoringPage()
        g_webInterface.rootPage.putChild(package.name, authoringPage)
        propertiesPage = PropertiesPage()
        authoringPage.putChild("properties", propertiesPage)
        savePage = SavePage()
        authoringPage.putChild("save", savePage)
        loadpage = LoadPage()
        authoringPage.putChild("load", loadpage)        
                     
        # Rendering
        html  = "<html><head><title>"+_("eXe")+"</title>\n"
        html += "<meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\">\n";
        html += "<meta http-equiv=\"REFRESH\" content=\"0;url=http:/"
        html += package.name
        html += "\">\n"
        html += "</head>\n"
        html += common.banner(_("New Package"))
        html += _("Welcome to eXe")
        html += common.footer()
        return html

    
    