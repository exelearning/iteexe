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
import re
from exe.webui              import common
from exe.webui.blockfactory import g_blockFactory
from exe.webui.titleblock   import TitleBlock
from exe.engine.error       import Error
from exe.engine.path        import Path, TempDirPath
from exe.export.manifest    import Manifest
from exe.export.pages       import uniquifyNames
from zipfile import ZipFile, ZIP_DEFLATED

log = logging.getLogger(__name__)
_   = gettext.gettext


# ===========================================================================
class ScormPage(object):
    """
    This class transforms an eXe node into a SCO
    """
    def __init__(self, name, depth, node):
        """
        Initialize
        """
        self.name  = name
        self.depth = depth
        self.node  = node


    def save(self, outdir):
        """
        This is the main function.  It will render the page and save it to a
        file.  
        'outdir' is the name of the directory where the node will be saved to,
        the filename will be the 'self.node.id'.html or 'index.html' if
        self.node is the root node. 'outdir' must be a 'Path' instance
        """
        out = open(outdir/self.name+".html", "w")
        out.write(self.render())
        out.close()


    def render(self):
        """
        Returns an XHTML string rendering this page.
        """
        html  = common.docType()
        html += "<html xmlns=\"http://www.w3.org/1999/xhtml\">\n"
        html += "<head>\n"
        html += "<title>"+_("eXe")+"</title>\n"
        html += "<meta http-equiv=\"content-type\" content=\"text/html; "
        html += " charset=UTF-8\" />\n";
        html += "<style type=\"text/css\">\n"
        html += "@import url(content.css);\n"
        html += "</style>\n"
        html += "<script type=\"text/javascript\" language=\"javascript\" "
        html += "src=\"APIWrapper.js\"></script>\n" 
        html += "<script type=\"text/javascript\" language=\"javascript\" "
        html += "src=\"SCOFunctions.js\"></script>\n" 
        html += "</head>\n"
        html += "<body onunLoad=\"return unloadPage()\">\n"
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


class WebCTScormPage(ScormPage):
    """
    This class transforms an eXe node into a SCO for WebCT
    """
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
        html += "</head>\n"
        html += "<body>\n"
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
        html += "</body></html>\n"
        return html

        
class ScormExport(object):
    """
    Exports an eXe package as a SCORM package
    """
    def __init__(self, config, styleDir, scriptsDir, filename):
        """ Initialize
        'styleDir' is the directory from which we will copy our style sheets
        (and some gifs) 'scriptsDir' is the directory from which we will copy
        our javascripts 'filename' is the name of the scorm package to be
        output
        """
        self.config     = config
        self.styleDir   = Path(styleDir)
        self.scriptsDir = Path(scriptsDir)
        self.filename   = Path(filename)
        self.pages      = []


    def export(self, package, addMetadata=True, addScormType=True):
        """ 
        Export SCORM package
        """
        # First do the export to a temporary directory
        outdir = TempDirPath()

        # Copy the style sheets and images
        self.styleDir.copyfiles(outdir)
        (outdir/'nav.css').remove() # But not nav.css

        # Copy the scripts
        self.scriptsDir.copylist(('APIWrapper.js', 'SCOFunctions.js'), outdir)

        # Export the package content
        if addMetadata:
            self.pages = [ ScormPage("index", 1, package.root) ]
        else:
            self.pages = [ WebCTScormPage("index", 1, package.root) ]

        self.generatePages(package.root, addMetadata, 2)
        uniquifyNames(self.pages)

        for page in self.pages:
            page.save(outdir)

        # Create the manifest file
        manifest = Manifest(self.config, outdir, package, self.pages,
                            addMetadata, addScormType)
        manifest.save()

        # Zip up the scorm package
        zipped = ZipFile(self.filename, "w")
        for scormFile in outdir.files():
            zipped.write(scormFile, str(scormFile.basename()), ZIP_DEFLATED)
        zipped.close()

        # Clean up the temporary dir
        outdir.rmtree()
                

    def generatePages(self, node, addMetadata, depth):
        """
        Recursive function for exporting a node.
        'outdir' is the temporary directory that we are exporting to
        before creating zip file
        """
        for child in node.children:
            pageName = child.title.lower().replace(" ", "_")
            pageName = re.sub(r"\W", "", pageName)
            if not pageName:
                pageName = "__"

            if addMetadata:
                page = ScormPage(pageName, depth, child)
            else:
                page = WebCTScormPage(pageName, depth, child)

            self.pages.append(page)
            self.generatePages(child, addMetadata, depth + 1)
    
# ===========================================================================
