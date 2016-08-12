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

import os
from exe.engine.path          import Path
from exe.export.singlepage    import SinglePage
from exe.webui                import common
from exe                      import globals as G
from exe.engine.persist       import encodeObject
from exe.engine.persistxml    import encodeObjectToXML
from slimit                   import minify

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
        if hasattr(package, 'exportSource') and package.exportSource and not for_print:
            (G.application.config.webDir/'templates'/'content.xsd').copyfile(self.outputDir/'content.xsd')
            (self.outputDir/'content.data').write_bytes(encodeObject(package))
            (self.outputDir/'contentv3.xml').write_bytes(encodeObjectToXML(package))

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
        
        # Minify common.js file
        commonFile = open(self.scriptsDir/'common_src.js', 'r')
        commonOutputFile = open(self.outputDir/'common.js', 'w')
        commonOutputFile.write(minify(commonFile.read(), mangle=True, mangle_toplevel=True))
        
        dT = common.getExportDocType()
        if dT == "HTML5":
            jsFile = (self.scriptsDir/'exe_html5.js')
            jsFile.copyfile(self.outputDir/'exe_html5.js')
            
        # Incluide eXe's icon if the Style doesn't have one
        themePath = Path(G.application.config.stylesDir/package.style)
        themeFavicon = themePath.joinpath("favicon.ico")
        if not themeFavicon.exists():
            faviconFile = (self.imagesDir/'favicon.ico')
            faviconFile.copyfile(self.outputDir/'favicon.ico')

        #JR Metemos los reproductores necesarios
        self.compruebaReproductores(self.page.node)


        if package.license == "license GFDL":
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
        hasFX             = False
        hasSH             = False
        hasGames          = False
        hasWikipedia      = False
        hasInstructions   = False
        hasMediaelement   = False
        hasTooltips       = False

    	for idevice in node.idevices:
    	    if (hasFlowplayer and hasMagnifier and hasXspfplayer and hasGallery and hasFX and hasSH and hasGames and hasWikipedia and hasInstructions and hasMediaelement and hasTooltips):
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
            if not hasFX:
                hasFX = common.ideviceHasFX(idevice)
            if not hasSH:
                hasSH = common.ideviceHasSH(idevice)
            if not hasGames:
                hasGames = common.ideviceHasGames(idevice)
            if not hasWikipedia:
    			if 'WikipediaIdevice' == idevice.klass:
    				hasWikipedia = True
            if not hasInstructions:
    			if 'TrueFalseIdevice' == idevice.klass or 'MultichoiceIdevice' == idevice.klass or 'VerdaderofalsofpdIdevice' == idevice.klass or 'EleccionmultiplefpdIdevice' == idevice.klass:
    				hasInstructions = True
            if not hasMediaelement:
                    hasMediaelement = common.ideviceHasMediaelement(idevice)
            if not hasTooltips:
                hasTooltips = common.ideviceHasTooltips(idevice)
                            
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
            exeLightbox = (self.scriptsDir/'exe_lightbox')
            exeLightbox.copyfiles(self.outputDir)
        if hasFX:
            exeEffects = (self.scriptsDir/'exe_effects')
            exeEffects.copyfiles(self.outputDir)
        if hasSH:
            exeSH = (self.scriptsDir/'exe_highlighter')
            exeSH.copyfiles(self.outputDir)
        if hasGames:
            exeGames = (self.scriptsDir/'exe_games')
            exeGames.copyfiles(self.outputDir)
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
        if hasTooltips:
            exe_tooltips = (self.scriptsDir/'exe_tooltips')
            exe_tooltips.copyfiles(self.outputDir)

        for child in node.children:
            self.compruebaReproductores(child)


# ===========================================================================
