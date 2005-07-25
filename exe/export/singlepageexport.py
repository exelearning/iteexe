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
SinglePageExport will export a package as a website of HTML pages
"""

import logging
import gettext
from exe.webui.blockfactory   import g_blockFactory
from exe.engine.error         import Error
from exe.engine.path          import Path
from exe.engine.beautifulsoup import BeautifulSoup

log = logging.getLogger(__name__)
_   = gettext.gettext


# ===========================================================================
class SinglePageExport(object):
    """
    SinglePageExport will export a package as a website of HTML pages
    """
    def __init__(self, stylesDir, outputDir, imagesDir, scriptsDir):
        """
        'stylesDir' is the directory where we can copy the stylesheets from
        'outputDir' is the directory that will be [over]written
        with the website
        """
        self.html       = ""
        self.style      = None
        self.name       = None
        self.stylesDir  = Path(stylesDir)
        self.outputDir  = Path(outputDir)
        self.imagesDir  = Path(imagesDir)
        self.scriptsDir = Path(scriptsDir)

        # Create the output dir if it doesn't already exist
        if not self.outputDir.exists(): 
            self.outputDir.mkdir()


    def export(self, package):
        """ 
        Export web site
        Cleans up the previous packages pages and performs the export
        """
        self.style = package.style
        self.copyFiles(package)

        self.html  = self.renderHeader(package.name)
        self.html += u"<body>\n"
        self.html += u"<div id=\"main\">\n"
        self.renderNode(package.root)
        self.html += u"</div>\n"
        self.html += u"</body></html>\n"
        soup = BeautifulSoup(self.html, True)
        self.html = soup.prettify()

        self.save(self.outputDir/"index.html")


    def copyFiles(self, package):
        """
        Copy all the files used by the website.
        """
        # TODO Need to tidy this up!!!

        # Copy the style sheets to the output dir
        self.stylesDir.copyfiles(self.outputDir)
        # But not nav.css
        (self.outputDir/'nav.css').remove() 

        # TODO these two should be part of the style
        self.imagesDir.copylist(('panel-amusements.png', 'stock-stop.png'), 
                          self.outputDir)

        # copy the package's resource files
        package.resourceDir.copyfiles(self.outputDir)
            

    def renderHeader(self, name):
        """
        Returns an XHTML string for the header of this page.
        """
        html  = u"<?xml version=\"1.0\" encoding=\"iso-8859-1\"?>\n"
        html += u"<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" "
        html += u" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">\n"
        html += u"<html xmlns=\"http://www.w3.org/1999/xhtml\">\n"
        html += u"<head>\n"
        html += u"<style type=\"text/css\">\n"
        html += u"@import url(content.css);\n"
        html += u"</style>"
        html += u"<title>"
        html += name
        html += "</title>\n"
        html += u"<meta http-equiv=\"content-type\" content=\"text/html; "
        html += u" charset=UTF-8\" />\n";
        html += u"</head>\n"
        return html


    def renderNode(self, node):
        """
        Returns an XHTML string for this node and recurse for the children
        """
        self.html += '<div id=\"nodeDecoration\">'
        self.html += '<p id=\"nodeTitle\">'
        self.html += node.title
        self.html += '</p></div>\n'

        for idevice in node.idevices:
            block = g_blockFactory.createBlock(None, idevice)
            if not block:
                log.critical("Unable to render iDevice.")
                raise Error("Unable to render iDevice.")
            self.html += block.renderView(self.style)

        for child in node.children:
            self.renderNode(child)
        

    def save(self, filename):
        """
        Save page to a file.  
        'outputDir' is the directory where the filenames will be saved
        (a 'path' instance)
        """
        outfile = open(filename, "w")
        outfile.write(self.html.encode('utf8'))
        outfile.close()
        
# ===========================================================================
