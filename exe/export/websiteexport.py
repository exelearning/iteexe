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
WebsiteExport will export a package as a website of HTML pages
"""

import logging
import re
import imp
from cgi                      import escape
from exe.webui.blockfactory   import g_blockFactory
from exe.engine.error         import Error
from exe.engine.path          import Path, TempDirPath
from exe.export.pages         import uniquifyNames
from exe.export.websitepage   import WebsitePage
from zipfile                  import ZipFile, ZIP_DEFLATED

log = logging.getLogger(__name__)

# ===========================================================================
class WebsiteExport(object):
    """
    WebsiteExport will export a package as a website of HTML pages
    """
    def __init__(self, config, styleDir, filename):
        """
        'stylesDir' is the directory where we can copy the stylesheets from
        'outputDir' is the directory that will be [over]written
        with the website
        """
        self.config       = config
        self.imagesDir    = config.webDir/"images"
        self.scriptsDir   = config.webDir/"scripts"
        self.templatesDir = config.webDir/"templates"
        self.stylesDir    = Path(styleDir)
        self.filename     = Path(filename)
        self.pages        = []

    def exportZip(self, package):
        """ 
        Export web site
        Cleans up the previous packages pages and performs the export
        """
        
        outputDir = TempDirPath()
        self.copyFiles(package, outputDir)

        # Import the Website Page class.  If the style has it's own page class
        # use that, else use the default one.
        if (self.stylesDir/"websitepage.py").exists():
            global WebsitePage
            module = imp.load_source("websitepage", 
                                     self.stylesDir/"websitepage.py")
            WebsitePage = module.WebsitePage

        self.pages = [ WebsitePage("index", 1, package.root) ]
        self.generatePages(package.root, 1)
        uniquifyNames(self.pages)

        prevPage = None
        thisPage = self.pages[0]

        for nextPage in self.pages[1:]:
            thisPage.save(outputDir, prevPage, nextPage, self.pages)
            prevPage = thisPage
            thisPage = nextPage

        thisPage.save(outputDir, prevPage, None, self.pages)
        # Zip up the website package
        self.filename.safeSave(self.doZip, _('EXPORT FAILED!\nLast succesful export is %s.'), outputDir)
        # Clean up the temporary dir
        outputDir.rmtree()

    def doZip(self, fileObj, outputDir):
        """
        Actually saves the zip data. Called by 'Path.safeSave'
        """
        zipped = ZipFile(fileObj, "w")
        for scormFile in outputDir.files():
            zipped.write(scormFile, scormFile.basename().encode('utf8'), ZIP_DEFLATED)
        zipped.close()
        
    def export(self, package):
        """ 
        Export web site
        Cleans up the previous packages pages and performs the export
        """
        outputDir = self.filename
        if not outputDir.exists(): 
            outputDir.mkdir()
        
        self.copyFiles(package, outputDir)


        # Import the Website Page class.  If the style has it's own page class
        # use that, else use the default one.
        if (self.stylesDir/"websitepage.py").exists():
            global WebsitePage
            module = imp.load_source("websitepage", 
                                     self.stylesDir/"websitepage.py")
            WebsitePage = module.WebsitePage

        self.pages = [ WebsitePage("index", 1, package.root) ]
        self.generatePages(package.root, 1)
        uniquifyNames(self.pages)

        prevPage = None
        thisPage = self.pages[0]

        for nextPage in self.pages[1:]:
            thisPage.save(outputDir, prevPage, nextPage, self.pages)
            prevPage = thisPage
            thisPage = nextPage

        thisPage.save(outputDir, prevPage, None, self.pages)


    def copyFiles(self, package, outputDir):
        """
        Copy all the files used by the website.
        """
        # Copy the style sheet files to the output dir
        styleFiles  = [self.stylesDir/'..'/'base.css']
        styleFiles += [self.stylesDir/'..'/'popup_bg.gif']
        styleFiles += self.stylesDir.files("*.css")
        styleFiles += self.stylesDir.files("*.jpg")
        styleFiles += self.stylesDir.files("*.gif")
        styleFiles += self.stylesDir.files("*.png")
        styleFiles += self.stylesDir.files("*.js")
        styleFiles += self.stylesDir.files("*.html")
        self.stylesDir.copylist(styleFiles, outputDir)

        # copy the package's resource files
        package.resourceDir.copyfiles(outputDir)
            
        # copy script files.
        self.scriptsDir.copylist(('libot_drag.js', 'common.js'), 
                                  outputDir)

        # copy video container file for flash movies.
        self.templatesDir.copylist(('videoContainer.swf', 'magnifier.swf',
                                    'xspf_player.swf'), outputDir)
                                    
        # copy a copy of the GNU Free Documentation Licence
        (self.templatesDir/'fdl.html').copyfile(outputDir/'fdl.html')


    def generatePages(self, node, depth):
        """
        Recursively generate pages and store in pages member variable
        for retrieving later
        """           
        for child in node.children:
            pageName = child.titleShort.lower().replace(" ", "_")
            pageName = re.sub(r"\W", "", pageName)
            if not pageName:
                pageName = "__"

            self.pages.append(WebsitePage(pageName, depth, child))
            self.generatePages(child, depth + 1)

