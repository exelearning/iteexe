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
"""
Transforms an eXe node into a page on a self-contained website
"""

import logging
import gettext
import os.path
import shutil
import glob
from exe.webui.blockfactory import g_blockFactory
from exe.webui.titleblock   import TitleBlock
from exe.engine.error       import Error
from exe.webui import common
from exe.webui.webinterface import g_webInterface
from exe.export.manifest import Manifest
import os
log = logging.getLogger(__name__)
_   = gettext.gettext


# ===========================================================================
class WebsitePage(object):
    """
    This class transforms an eXe node into a page on a self-contained website
    """
    def __init__(self, node, mode):
        """
        Initialize
        """
        self.node = node
        self.html = ""
        self.mode = mode

    def save(self):
        """
        This is the main function.  It will render the page and save it to a file.
        """
        filename = self.node.getIdStr() + ".html"
        out = open(filename, "w")
        out.write(self.render())
        out.close()

    def render(self):
        """
        Returns an XHTML string rendering this page.
        """
        html  = "<?xml version=\"1.0\" encoding=\"iso-8859-1\"?>\n"
        html += "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" "
        html += " \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">\n"
        html += "<html xmlns=\"http://www.w3.org/1999/xhtml\">\n"
        html += "<head>\n"
        html += "<style type=\"text/css\">\n"
        html += "@import url(main.css);</style>\n"
        html += "<title>"+_("eXe")+"</title>\n"
        html += "<meta http-equiv=\"content-type\" content=\"text/html; "
        html += " charset=UTF-8\" />\n";
        html += "</head>\n"
        html += "<body>\n"
        html += "<div id=\"outer\">\n"
        
        if self.mode == 1:
            html += "<div id=\"navcontainer\">\n"
            for child in self.node.children:
                html += "<a href=\"%s.html\">" % child.getIdStr()
                html += str(child.title) + "</a><br/>\n"
                
            html += "</div>\n"

        html += "<div id=\"main\">\n"
        html += TitleBlock(self.node.title).renderView()

        for idevice in self.node.idevices:
            block = g_blockFactory.createBlock(idevice)
            if not block:
                log.critical("Unable to render iDevice.")
                raise Error("Unable to render iDevice.")
            html += block.renderView()

        html += "</div>\n"
        html += common.footer()

        return html

        
class WebsiteExport(object):
    """
    WebsiteExport will export a package as a website of HTML pages
    """
    Web, SCORM = (1, 2)
    def __init__(self, mode):
        self.package = None
        self.mode    = mode


    def exportWeb(self, package):
        """ 
        Export web page
        """
        self.package = package


        os.chdir(g_webInterface.config.getDataDir())
        if os.path.exists(package.name):
            shutil.rmtree(package.name)

        os.mkdir(package.name)
        os.chdir(package.name)
        exeDir = g_webInterface.config.getExeDir()

        for styleFile in glob.glob(os.path.join(exeDir, 
                                                "style", package.style, "*")):
            shutil.copyfile(styleFile, os.path.basename(styleFile))

        self.exportNode(package.root)
        
        
    # TODO: The SCORM export should be handled by its own class
    def exportScorm(self, package):
        """ 
        Export scorm
        """
        self.exportWeb(package)
        
        manifest = Manifest(package)
        manifest.save()
        
                
    def exportNode(self, node):
        """
        Recursive function for exporting a node
        """
        page = WebsitePage(node, self.mode)
        page.save()

        for child in node.children:
            self.exportNode(child)

    
# ===========================================================================
