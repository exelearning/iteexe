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
from exe.webui.exportpage import ExportPage


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
        self.err = False
        self.message  = ""
        
    def process(self, request):
        log.debug("process" + repr(request.args))
        
        self.err = False              
        packageName = request.prepath[0]
        self.package = g_packageStore.getPackage(packageName)

        if "action" in request.args and request.args["action"][0] == "Load":           
            if "saveChk" in request.args:
                dataDir = g_webInterface.config.getDataDir()
                os.chdir(dataDir)
                fileName = self.package.name + ".elp"                
                outfile = open(fileName, "w")
                pickle.dump(self.package, outfile)
                outfile.close()
                
            try:            
                filePath = request.args["object"][0]
                log.debug("filename and path" + filePath)
                infile = open(filePath)
                package = pickle.load(infile)                
            except:
                self.message = _("Sorry, wrong file format.")
                self.err = True
            else:
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
        html += "<br/><b>" + self.message + "</b><br/>"
        html += "<form method=\"post\" name=\"contentForm\" onload=\"clearHidden();"
        html += "\"action=\"%s\">\n" % request.path
        html += common.hiddenField("action")
        html += common.hiddenField("object")
        html += "<br/>" + _("Would you like to save current changes?") + "<br/>\n"
        html += "<pre>%s</pre>\n" % str(request.args)
        html += "<input type=\"checkbox\" name=\"saveChk\" checked>\n"
        html += _(" Save the current package") + "<br/><br/>\n"    
        html += _(" Please select a file") + "<br/>\n"
        html += "<input type = \"file\" name = \"fileName\">\n"
        html += "<br/><br/>"
        html += "<a href=\"#\" onclick=\"submitLink('Load',   document.contentForm.fileName.value); \">%s</a>\n" % _("Load")
        html += "<br/></form>\n"        
        html += common.footer()
        self.message = ""
        
        return html
    
    def render_POST(self, request):
        """Get an existing package and redirect the webrowser to the URL for it"""
        log.debug("render_POST" + repr(request.args))
        
        self.process(request)
        if self.err:
            return self.render_GET(request)
        else:
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
            exportPage = ExportPage()
            authoringPage.putChild("export", exportPage)
                         
            # Rendering
            html  = "<html><head><title>"+_("eXe")+"</title>\n"
            html += "<meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\">\n";
            html += "<meta http-equiv=\"REFRESH\" content=\"0;url=http:/"
            html += package.name
            html += "\">\n"
            html += "</head>\n"
            html += common.banner()
            html += _("Welcome to eXe")
            html += common.footer()
            return html

    
    
