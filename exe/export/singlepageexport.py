# ===========================================================================
# eXe 
# Copyright 2004-2005, University of Auckland
# Copyright 2004-2008 eXe Project, http://eXeLearning.org/
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

from cgi                      import escape
from exe.webui.blockfactory   import g_blockFactory
from exe.engine.error         import Error
from exe.engine.path          import Path
from exe.export.singlepage    import SinglePage
from exe.webui                import common
from exe                      import globals as G
import os

import logging
log = logging.getLogger(__name__)


# ===========================================================================
class SinglePageExport(object):
    """
    SinglePageExport will export a package as a website of HTML pages
    """
    def __init__(self, stylesDir, outputDir, imagesDir, scriptsDir, cssDir, templatesDir):
        """
        'stylesDir' is the directory where we can copy the stylesheets from
        'outputDir' is the directory that will be [over]written
        with the website
        """
        self.html         = ""
        self.style        = None
        self.name         = None
        self.stylesDir    = Path(stylesDir)
        self.outputDir    = Path(outputDir)
        self.imagesDir    = Path(imagesDir)
        self.scriptsDir   = Path(scriptsDir)
        self.cssDir       = Path(cssDir)
        self.templatesDir = Path(templatesDir)
	self.page         = None

        # Create the output dir if it doesn't already exist
        if not self.outputDir.exists(): 
            self.outputDir.mkdir()


    def export(self, package, for_print=0):
        """ 
        Export web site
        Cleans up the previous packages pages and performs the export
        """
        self.style = package.style       
	
	self.page = SinglePage("index", 1, package.root)

        self.page.save(self.outputDir/"index.html", for_print)
	
	self.copyFiles(package)


    def copyFiles(self, package):
        """
        Copy all the files used by the website.
        """
        # Copy the style sheet files to the output dir
        # But not nav.css
        if os.path.isdir(self.stylesDir):
            # Copy the style sheet files to the output dir
            styleFiles  = [self.stylesDir/'..'/'base.css']
            styleFiles += [self.stylesDir/'..'/'popup_bg.gif']
            styleFiles += self.stylesDir.files("*.css")
            if "nav.css" in styleFiles:
                styleFiles.remove("nav.css")
            styleFiles += self.stylesDir.files("*.jpg")
            styleFiles += self.stylesDir.files("*.gif")
            styleFiles += self.stylesDir.files("*.png")
            styleFiles += self.stylesDir.files("*.js")
            styleFiles += self.stylesDir.files("*.html")
            styleFiles += self.stylesDir.files("*.ico")
            styleFiles += self.stylesDir.files("*.ttf")
            styleFiles += self.stylesDir.files("*.eot")
            styleFiles += self.stylesDir.files("*.otf")
            styleFiles += self.stylesDir.files("*.woff")
            self.stylesDir.copylist(styleFiles, self.outputDir)
            
        # copy the package's resource files
        package.resourceDir.copyfiles(self.outputDir)

        # copy script files.
        my_style = G.application.config.styleStore.getStyle(package.style)
        
        # jQuery
        if my_style.hasValidConfig:
            if my_style.get_jquery() == True:
                jsFile = (self.scriptsDir/'exe_jquery.js')
                jsFile.copyfile(self.outputDir/'exe_jquery.js')
        else:
            jsFile = (self.scriptsDir/'exe_jquery.js')
            jsFile.copyfile(self.outputDir/'exe_jquery.js')
            
        jsFile = (self.scriptsDir/'common.js')
        jsFile.copyfile(self.outputDir/'common.js')
        dT = common.getExportDocType()
        if dT == "HTML5":
            jsFile = (self.scriptsDir/'exe_html5.js')
            jsFile.copyfile(self.outputDir/'exe_html5.js')

        #JR Metemos los reproductores necesarios
        self.compruebaReproductores(self.page.node)


        if package.license == "GNU Free Documentation License":
            # include a copy of the GNU Free Documentation Licence
            (self.templatesDir/'fdl.html').copyfile(self.outputDir/'fdl.html')

    def compruebaReproductores(self, node):
        """
        Comprobamos si hay que meter algun reproductor
        """
        
    	# copy players for media idevices.                
        hasFlowplayer     = False
        hasMagnifier      = False
        hasXspfplayer     = False
        hasGallery        = False
        hasWikipedia      = False
        hasInstructions   = False
        hasMediaelement   = False

    	for idevice in node.idevices:
    	    if (hasFlowplayer and hasMagnifier and hasXspfplayer and hasGallery and hasWikipedia and hasInstructions and hasMediaelement):
    	    	break
    	    if not hasFlowplayer:
    	    	if 'flowPlayer.swf' in idevice.systemResources:
    	    		hasFlowplayer = True
    	    if not hasMagnifier:
    	    	if 'mojomagnify.js' in idevice.systemResources:
    	    		hasMagnifier = True
    	    if not hasXspfplayer:
    		    if 'xspf_player.swf' in idevice.systemResources:
    			    hasXspfplayer = True
            if not hasGallery:
                hasGallery = common.ideviceHasGallery(idevice)
            if not hasWikipedia:
    			if 'WikipediaIdevice' == idevice.klass:
    				hasWikipedia = True
            if not hasInstructions:
    			if 'TrueFalseIdevice' == idevice.klass or 'MultichoiceIdevice' == idevice.klass or 'VerdaderofalsofpdIdevice' == idevice.klass or 'EleccionmultiplefpdIdevice' == idevice.klass:
    				hasInstructions = True
            if not hasMediaelement:
                    hasMediaelement = common.ideviceHasMediaelement(idevice)
                            
        if hasFlowplayer:
            videofile = (self.templatesDir/'flowPlayer.swf')
            videofile.copyfile(self.outputDir/'flowPlayer.swf')
            controlsfile = (self.templatesDir/'flowplayer.controls.swf')
            controlsfile.copyfile(self.outputDir/'flowplayer.controls.swf')
        if hasMagnifier:
            videofile = (self.templatesDir/'mojomagnify.js')
            videofile.copyfile(self.outputDir/'mojomagnify.js')
        if hasXspfplayer:
            videofile = (self.templatesDir/'xspf_player.swf')
            videofile.copyfile(self.outputDir/'xspf_player.swf')
        if hasGallery:
            imageGalleryCSS = (self.cssDir/'exe_lightbox.css')
            imageGalleryCSS.copyfile(self.outputDir/'exe_lightbox.css') 
            imageGalleryJS = (self.scriptsDir/'exe_lightbox.js')
            imageGalleryJS.copyfile(self.outputDir/'exe_lightbox.js') 
            self.imagesDir.copylist(('exe_lightbox_close.png', 'exe_lightbox_loading.gif', 'exe_lightbox_next.png', 'exe_lightbox_prev.png'), self.outputDir)
        if hasWikipedia:
            wikipediaCSS = (self.cssDir/'exe_wikipedia.css')
            wikipediaCSS.copyfile(self.outputDir/'exe_wikipedia.css')
        if hasInstructions:
            common.copyFileIfNotInStyle('panel-amusements.png', self, self.outputDir)
            common.copyFileIfNotInStyle('stock-stop.png', self, self.outputDir)
        if hasMediaelement:
            mediaelement = (self.scriptsDir/'mediaelement')
            mediaelement.copyfiles(self.outputDir)
            dT = common.getExportDocType()
            if dT != "HTML5":
                jsFile = (self.scriptsDir/'exe_html5.js')
                jsFile.copyfile(self.outputDir/'exe_html5.js')

        for child in node.children:
            self.compruebaReproductores(child)


# ===========================================================================
