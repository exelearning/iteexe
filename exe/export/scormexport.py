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
from exe.webui              import common
from exe.webui.blockfactory import g_blockFactory
from exe.webui.titleblock   import TitleBlock
from exe.engine.error       import Error
from exe.engine.path        import path, TempDirPath
from exe.export.manifest    import Manifest
from zipfile import ZipFile, ZIP_DEFLATED
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

    def save(self, outdir):
        """
        This is the main function.  It will render the page and save it to a
        file.  
        'outdir' is the name of the directory where the node will be saved to,
        the filename will be the 'self.node.id'.html or 'index.html' if self.node is
        the root node. 'outdir' must be a 'path' instance
        """
        if self.node is self.node.package.root:
            filename = "index.html"
        else:
            filename = self.node.id + ".html"
        out = open(outdir / filename, "w")
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
        html += "<script type=\"text/javascript\" language=\"javascript\" "
        html += "src=\"SCOFunctions.js\"></script>\n" 
        html += "</head>\n"
        html += "<body onLoad=\"loadPage();\" "
        html += "onunLoad=\"return unloadPage();\"> "
        html += "<div id=\"outer\">\n"
        
        html += "<div id=\"main\">\n"
        html += TitleBlock(self.node._title).renderView(self.node.package.style)

        for idevice in self.node.idevices:
            block = g_blockFactory.createBlock(idevice)
            if not block:
                log.critical("Unable to render iDevice.")
                raise Error("Unable to render iDevice.")
            html += block.renderView(self.node.package.style)

        html += "</div>\n"
        html += "</div>\n"
        html += "<script language=\"javascript\">\n"
	html += "loadPage();\n"
	html += "doContinue('completed');</script>\n"  
        html += "</body></html>\n"
        return html

        
class ScormExport(object):
    """
    Exports an eXe package as a SCORM package
    """
    def __init__(self, config, styleDir, scriptsDir, filename):
        """ Initialize
        'styleDir' is the directory from which we will copy our style sheets (and some gifs)
        'scriptsDir' is the directory from which we will copy our javascripts
        'filename' is the name of the scorm package to be output
        """
        self.styleDir   = path(styleDir)
        self.scriptsDir = path(scriptsDir)
        self.filename   = path(filename)
        self.config     = config

    def export(self, package, addMetadata=True):
        """ 
        Export SCORM package
        """
        # First do the export to a temporary directory
        outdir = TempDirPath()
        # Copy the style sheets and images
        self.styleDir.copyfiles(outdir)
        (outdir / 'nav.css').remove() # But not nav.css
        # Copy the scripts
        self.scriptsDir.copylist(('APIWrapper.js', 'SCOFunctions.js'), outdir)
        # Export the package content
        self.exportNode(package.root, outdir)
        # Create the manifest file
        manifest = Manifest(self.config, outdir, package, addMetadata)
        manifest.save()
        # Zip up the scorm package
        zipped = ZipFile(self.filename, "w")
        for fn in outdir.files():
            zipped.write(fn, fn.basename(), ZIP_DEFLATED)
        zipped.close()
        # Clean up the temporary dir
        outdir.rmtree()
                
    def exportNode(self, node, outdir):
        """
        Recursive function for exporting a node.
        'outdir' is the temporary directory that we are exporting to
        before creating zip file
        """
        page = ScormPage(node)
        page.save(outdir)
        for child in node.children:
            self.exportNode(child, outdir)
    
# ===========================================================================
