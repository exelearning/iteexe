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
Exports an eXe package as a SCORM package
"""

import logging
import gettext
import os
import os.path
import shutil
import glob
import tempfile
from exe.webui              import common
from exe.webui.blockfactory import g_blockFactory
from exe.webui.titleblock   import TitleBlock
from exe.engine.error       import Error
from exe.export.manifest    import Manifest
log = logging.getLogger(__name__)
_   = gettext.gettext


# ===========================================================================
class ScormPage(object):
    """
    This class transforms an eXe node into a SCO
    """
    def __init__(self, node):
        """
        Initialize
        """
        self.node = node

    def save(self):
        """
        This is the main function.  It will render the page and save it to a
        file.  
        """
        if self.node is self.node.package.root:
            filename = "index.html"
        else:
            filename = self.node.id + ".html"
            
        out = open(filename, "w")
        out.write(self.render())
        out.close()

    def render(self):
        """
        Returns an XHTML string rendering this page.
        """
        html  = common.docType()
        html += "<html xmlns=\"http://www.w3.org/1999/xhtml\">\n"
        html += "<head>\n"
        html += "<meta http-equiv=\"content-type\" content=\"text/html; "
        html += " charset=UTF-8\" />\n";
        html += "<title>"+_("eXe")+"</title>\n"
        html += "<style type=\"text/css\">\n"
        html += "@import url(content.css);\n"
	html += "</style>\n"
        html += "<script type=\"text/javascript\" language=\"javascript\" "
	html += "src=\"APIWrapper.js\"></script>\n" 
        html += "</head>\n"
        html += "<body onLoad=\"doLMSInitialize();\" "
        html += "onunLoad=\"doLMSFinish();\">\n"
        html += "<div id=\"outer\">\n"
        
        html += "<div id=\"main\">\n"
        html += TitleBlock(self.node._title).renderView()

        for idevice in self.node.idevices:
            block = g_blockFactory.createBlock(idevice)
            if not block:
                log.critical("Unable to render iDevice.")
                raise Error("Unable to render iDevice.")
            html += block.renderView()

        html += "</div>\n"
        html += "</body></html>\n"
        return html

        
class ScormExport(object):
    """
    Exports an eXe package as a SCORM package
    """
    def __init__(self, config):
        """
        Initialize
        """
        self.config = config

    def export(self, package, addMetadata=True):
        """ 
        Export SCORM package
        """
        os.chdir(tempfile.gettempdir())
        if os.path.exists(package.name):
            shutil.rmtree(package.name)

        os.mkdir(package.name)
        os.chdir(package.name)
        exeDir = self.config.exeDir

        for styleFile in glob.glob(os.path.join(exeDir, 
                                                "style", package.style, "*")):
            # Don't copy the nav.css file  
            # TODO: Find a better way to handle nav.css
            if os.path.basename(styleFile) != "nav.css":
                shutil.copyfile(styleFile, os.path.basename(styleFile))

        self.exportNode(package.root)
        
        manifest = Manifest(self.config, package, addMetadata)
        manifest.save()
        shutil.move(package.name+".zip", self.config.dataDir)
        shutil.rmtree(package.name)

                
    def exportNode(self, node):
        """
        Recursive function for exporting a node
        """
        page = ScormPage(node)
        page.save()

        for child in node.children:
            self.exportNode(child)
    
# ===========================================================================
