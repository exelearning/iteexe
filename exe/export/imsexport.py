#!/usr/bin/env python
#-*- coding: utf-8 -*-
# ===========================================================================
# eXe 
# Copyright 2004-2005, University of Auckland
# Copyright 2004-2008 eXe Project, http://eXeLearning.org/
# Copyright 2008-2014 eXeLearning.net, http://exelearning.net/
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
Exports an eXe package as an IMS Content Package
"""

import logging
import copy
import time
import StringIO
import re
from cgi                           import escape
from zipfile                       import ZipFile, ZIP_DEFLATED
from exe.webui                     import common
from exe.webui.blockfactory        import g_blockFactory
from exe.engine.error              import Error
from exe.engine.path               import Path, TempDirPath
from exe.engine.resource           import Resource
from exe.engine.version            import release
from exe.export.pages              import Page, uniquifyNames
from exe.engine.uniqueidgenerator  import UniqueIdGenerator
from exe                      	   import globals as G
from exe.engine.persist            import encodeObject
from exe.engine.persistxml         import encodeObjectToXML
from exe.engine.lom                import lomsubs
from helper                        import exportMinFileJS 
from helper                        import exportMinFileCSS
from exe.webui.common              import getFilesCSSToMinify
from exe.webui.common              import getFilesJSToMinify
log = logging.getLogger(__name__)


# ===========================================================================
class Manifest(object):
    """
    Represents an imsmanifest xml file
    """
    def __init__(self, config, outputDir, package, pages, metadataType):
        """
        Initialize
        'outputDir' is the directory that we read the html from and also output
        the mainfest.xml 
        """
        self.config       = config
        self.outputDir    = outputDir
        self.package      = package
        self.idGenerator  = UniqueIdGenerator(package.name, config.exePath)
        self.pages        = pages
        self.metadataType = metadataType
        self.itemStr      = ""
        self.resStr       = ""


    def createMetaData(self):
        """
        if user did not supply metadata title, description or creator
        then use package title, description, or creator in imslrm
        if they did not supply a package title, use the package name
        if they did not supply a date, use today
        """
        xml = ''
        namespace = 'lom:'
        # depending on (user desired) the metadata type:
        if self.metadataType == 'LOMES':
            output = StringIO.StringIO()
            metadata = copy.deepcopy(self.package.lomEs)
            title = metadata.get_general().get_title() or lomsubs.titleSub([])
            if not title.get_string():
                title.add_string(lomsubs.LangStringSub(self.package.lang.encode('utf-8'), self.package.name))
                metadata.get_general().set_title(title)
            if self.package.exportSource:
                technical = metadata.get_technical()
                if not technical:
                    technical = lomsubs.technicalSub('technical')
                    metadata.set_technical(technical)
                opr = technical.get_otherPlatformRequirements()
                if not opr:
                    opr = lomsubs.otherPlatformRequirementsSub()
                    technical.set_otherPlatformRequirements(opr)
                for platform in opr.get_string():
                    if platform.get_valueOf_() == self.package.lomESPlatformMark:
                        found = True
                if not found:
                    opr.add_string(lomsubs.LangStringSub(self.package.lang.encode('utf-8'), self.package.lomESPlatformMark))
            metadata.export(output, 0, namespace_=namespace, pretty_print=False)
            xml = output.getvalue()
        if self.metadataType == 'LOM':
            output = StringIO.StringIO()
            metadata = copy.deepcopy(self.package.lom)
            title = metadata.get_general().get_title() or lomsubs.titleSub([])
            if not title.get_string():
                title.add_string(lomsubs.LangStringSub(self.package.lang.encode('utf-8'), self.package.name))
                metadata.get_general().set_title(title)
            metadata.export(output, 0, namespace_=namespace, pretty_print=False)
            xml = output.getvalue()
        if self.metadataType == 'DC':
            lrm = self.package.dublinCore.__dict__.copy()
            # use package values in absentia:
            if lrm.get('title', '') == '':
                lrm['title'] = self.package.title
            if lrm['title'] == '':
                lrm['title'] = self.package.name
            if lrm.get('description', '') == '':
                lrm['description'] = self.package.description
            if lrm['description'] == '':
                lrm['description'] = self.package.name
            if lrm.get('creator', '') == '':
                lrm['creator'] = self.package.author
            if lrm['date'] == '':
                lrm['date'] = time.strftime('%Y-%m-%d')
            # if they don't look like VCARD entries, coerce to fn:
            for f in ('creator', 'publisher', 'contributors'):
                if re.match('.*[:;]', lrm[f]) == None:
                    lrm[f] = u'FN:' + lrm[f]
            templateFilename = self.config.webDir/'templates'/'imslrm.xml'
            template = open(templateFilename, 'rb').read()
            xml = template % lrm
            out = open(self.outputDir/'imslrm.xml', 'wb')
            out.write(xml.encode('utf8'))
            out.close()
            xml = '<adlcp:location>imslrm.xml</adlcp:location>'
        return xml


    def save(self, filename):
        """
        Save a imsmanifest file to self.outputDir
        """
        out = open(self.outputDir/filename, "w")
        if filename == "imsmanifest.xml":
            out.write(self.createXML().encode('utf8'))
        out.close()


    def createXML(self):
        """
        returning XLM string for manifest file
        """
        manifestId = self.idGenerator.generate()
        orgId      = self.idGenerator.generate()
        
        xmlStr = u"""<?xml version="1.0" encoding="UTF-8"?>
        <!-- Generated by eXe - http://exelearning.net -->
        <manifest identifier="%s" 
        xmlns="http://www.imsglobal.org/xsd/imscp_v1p1"
        xmlns:imsmd="http://www.imsglobal.org/xsd/imsmd_v1p2" 
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:lom="http://ltsc.ieee.org/xsd/LOM"
        """ % manifestId 
        xmlStr += "\n "
        xmlStr += "xsi:schemaLocation=\"http://www.imsglobal.org/xsd/"
        xmlStr += "imscp_v1p1 imscp_v1p1.xsd "        
        xmlStr += "http://www.imsglobal.org/xsd/imsmd_v1p2 imsmd_v1p2p2.xsd\""
        xmlStr += "> \n"
        xmlStr += "<metadata> \n"
        xmlStr += " <schema>IMS Content</schema> \n"
        xmlStr += " <schemaversion>1.1.3</schemaversion> \n"
        xmlStr += " %(metadata)s\n" 
        xmlStr += "</metadata> \n"
        xmlStr += "<organizations default=\""+orgId+"\">  \n"
        xmlStr += "<organization identifier=\""+orgId
        xmlStr += "\" structure=\"hierarchical\">  \n"

        xmlStr = xmlStr % {'metadata': self.createMetaData()}
        if self.package.title != '':
            title = escape(self.package.title)
        else:
            title  = escape(self.package.root.titleShort)
        xmlStr += u"<title>"+title+"</title>\n"
        
        depth = 0
        for page in self.pages:
            while depth >= page.depth:
                self.itemStr += "</item>\n"
                depth -= 1
            self.genItemResStr(page)
            depth = page.depth

        while depth >= 1:
            self.itemStr += "</item>\n"
            depth -= 1

        xmlStr += self.itemStr
        xmlStr += "</organization>\n"
        xmlStr += "</organizations>\n"
        xmlStr += "<resources>\n"
        xmlStr += self.resStr
        xmlStr += "</resources>\n"
        xmlStr += "</manifest>\n"
        return xmlStr
        
            
    def genItemResStr(self, page):
        """
        Returning xml string for items and resources
        """
        itemId   = "ITEM-"+unicode(self.idGenerator.generate())
        resId    = "RES-"+unicode(self.idGenerator.generate())
        # If ISO9660 compatible mode is active, we want '.htm' as the extension 
        ext = 'html'
        if G.application.config.cutFileName == '1':
            ext = 'htm'

        filename = page.name + '.' + ext
            
        
        self.itemStr += "<item identifier=\""+itemId+"\" isvisible=\"true\" "
        self.itemStr += "identifierref=\""+resId+"\">\n"
        self.itemStr += "    <title>"
        self.itemStr += escape(page.node.titleShort)
        self.itemStr += "</title>\n"
        
        self.resStr += "<resource identifier=\""+resId+"\" "
        self.resStr += "type=\"webcontent\" "

        self.resStr += "href=\""+filename+"\"> \n"
        self.resStr += """\
    <file href="%s"/>
    <file href="base.css"/>
    <file href="content.css"/>""" % filename
        self.resStr += "\n"
        fileStr = ""
        
        dT = common.getExportDocType()
        if dT == "HTML5" or common.nodeHasMediaelement(page.node):
            self.resStr += '    <file href="exe_html5.js"/>\n'

        resources = page.node.getResources()
        my_style = G.application.config.styleStore.getStyle(page.node.package.style)
        if common.nodeHasMediaelement(page.node):
            resources = resources + [f.basename() for f in (self.config.webDir/"scripts"/'mediaelement').files()]
        if common.nodeHasTooltips(page.node):
            resources = resources + [f.basename() for f in (self.config.webDir/"scripts"/'exe_tooltips').files()]
        if common.hasGalleryIdevice(page.node):
            resources = resources + [f.basename() for f in (self.config.webDir/"scripts"/'exe_lightbox').files()]
        if common.hasFX(page.node):
            resources = resources + [f.basename() for f in (self.config.webDir/"scripts"/'exe_effects').files()]
        if common.hasSH(page.node):
            resources = resources + [f.basename() for f in (self.config.webDir/"scripts"/'exe_highlighter').files()]
        if common.hasGames(page.node):
            resources = resources + [f.basename() for f in (self.config.webDir/"scripts"/'exe_games').files()]
        if common.hasABCMusic(page.node):
            resources = resources + [f.basename() for f in (self.config.webDir/"scripts"/'tinymce_4'/'js'/'tinymce'/'plugins'/'abcmusic'/'export').files()]
        if my_style.hasValidConfig:
            if my_style.get_jquery() == True:
                self.resStr += '    <file href="exe_jquery.js"/>\n'
        else:
            self.resStr += '    <file href="exe_jquery.js"/>\n'

        for resource in resources:
            fileStr += "    <file href=\""+escape(resource)+"\"/>\n"
            
        # Get all JS iDevices resources
        fileStr += common.getJavascriptIdevicesResources(page, xmlOutput = True)            

        self.resStr += fileStr
        self.resStr += "</resource>\n"


# ===========================================================================
class IMSPage(Page):
    """
    This class transforms an eXe node into a SCO 
    """  
    def __init__(self, name, depth, node, metadataType):
        self.metadataType = metadataType
        super(IMSPage, self).__init__(name, depth, node)


    def save(self, outputDir, pages):
        """
        This is the main function.  It will render the page and save it to a
        file.  
        'outputDir' is the name of the directory where the node will be saved to,
        the filename will be the 'self.node.id'.html or 'index.html' if
        self.node is the root node. 'outputDir' must be a 'Path' instance
        """
        ext = 'html'
        if G.application.config.cutFileName == '1':
            ext = 'htm'
        out = open(outputDir/self.name + '.' + ext, "wb")
        out.write(self.render(pages))
        out.close()
        

    def render(self,pages):
        """
        Returns an XHTML string rendering this page.
        """
        dT = common.getExportDocType()
        lb = "\n" #Line breaks
        sectionTag = "div"
        articleTag = "div"
        headerTag = "div"
        if dT == "HTML5":
            sectionTag = "section"  
            articleTag = "article"
            headerTag = "header"
        html  = common.docType()
        lenguaje = G.application.config.locale
        if self.node.package.dublinCore.language!="":
            lenguaje = self.node.package.dublinCore.language
        html += u"<html lang=\"" + lenguaje + "\" xml:lang=\"" + lenguaje + "\" xmlns=\"http://www.w3.org/1999/xhtml\">"+lb
        html += u"<head>"+lb
        html += u"<meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\" />"+lb
        html += u"<title>"
        if self.node.id=='0':
            if self.node.package.title!='':
                html += escape(self.node.package.title)
            else:
                html += escape(self.node.titleLong)
        else:
            if self.node.package.title!='':
                html += escape(self.node.titleLong)+" | "+escape(self.node.package.title)
            else:
                html += escape(self.node.titleLong)
        html += u" </title>"+lb   
        if dT != "HTML5" and self.node.package.dublinCore.language!="":
            html += '<meta http-equiv="content-language" content="'+lenguaje+'" />'+lb
        if self.node.package.author!="":
            html += '<meta name="author" content="'+self.node.package.author+'" />'+lb
        html += common.getLicenseMetadata(self.node.package.license)      
        html += '<meta name="generator" content="eXeLearning '+release+' - exelearning.net" />'+lb
        if self.node.id=='0':
            if self.node.package.description!="":
                desc = self.node.package.description
                desc = desc.replace('"', '&quot;')            
                html += '<meta name="description" content="'+desc+'" />'+lb
        html += u"<link rel=\"stylesheet\" type=\"text/css\" href=\"base.css\" />"+lb
        if common.hasWikipediaIdevice(self.node):
            html += u"<link rel=\"stylesheet\" type=\"text/css\" href=\"exe_wikipedia.css\" />"+lb    
        if common.hasGalleryIdevice(self.node):
            html += u"<link rel=\"stylesheet\" type=\"text/css\" href=\"exe_lightbox.css\" />"+lb
        if common.hasFX(self.node):
            html += u"<link rel=\"stylesheet\" type=\"text/css\" href=\"exe_effects.css\" />"+lb
        if common.hasSH(self.node):
            html += u"<link rel=\"stylesheet\" type=\"text/css\" href=\"exe_highlighter.css\" />"+lb
        if common.hasGames(self.node):
            html += u"<link rel=\"stylesheet\" type=\"text/css\" href=\"exe_games.css\" />"+lb
        if common.hasABCMusic(self.node):
            html += u"<link rel=\"stylesheet\" type=\"text/css\" href=\"exe_abcmusic.css\" />"+lb
        html += u"<link rel=\"stylesheet\" type=\"text/css\" href=\"content.css\" />"+lb
        if dT == "HTML5" or common.nodeHasMediaelement(self.node):
            html += u'<!--[if lt IE 9]><script type="text/javascript" src="exe_html5.js"></script><![endif]-->'+lb
        style = G.application.config.styleStore.getStyle(self.node.package.style)
        
        # jQuery
        if style.hasValidConfig:
            if style.get_jquery() == True:
                html += u'<script type="text/javascript" src="exe_jquery.js"></script>'+lb
            else:
                html += u'<script type="text/javascript" src="'+style.get_jquery()+'"></script>'+lb
        else:
            html += u'<script type="text/javascript" src="exe_jquery.js"></script>'+lb
        
        if common.hasGalleryIdevice(self.node):
            html += u'<script type="text/javascript" src="exe_lightbox.js"></script>'+lb
        if common.hasFX(self.node):
            html += u'<script type="text/javascript" src="exe_effects.js"></script>'+lb
        if common.hasSH(self.node):
            html += u'<script type="text/javascript" src="exe_highlighter.js"></script>'+lb
        html += common.getJavaScriptStrings()+lb
        if common.hasGames(self.node):
            # The games require additional strings
            html += common.getGamesJavaScriptStrings() + lb
            html += u'<script type="text/javascript" src="exe_games.js"></script>'+lb
        if common.hasABCMusic(self.node):
            html += u'<script type="text/javascript" src="exe_abcmusic.js"></script>'+lb
        html += u'<script type="text/javascript" src="common.js"></script>'+lb
        
        # Add JS iDevices  Scripts
        html += common.printJavaScriptIdevicesScripts('export', self)
        
        if common.hasMagnifier(self.node):
            html += u'<script type="text/javascript" src="mojomagnify.js"></script>'+lb
        # Some styles might have their own JavaScript files (see their config.xml file)
        if style.hasValidConfig:
            html += style.get_extra_head()
        html += common.getExtraHeadContent(self.node.package)
        html += u"</head>"+lb
        html += u'<body class="exe-ims" id="exe-node-'+self.node.id+'"><script type="text/javascript">document.body.className+=" js"</script>'+lb
        html += u"<div id=\"outer\">"+lb
        html += u"<"+sectionTag+" id=\"main\">"+lb
        html += u"<"+headerTag+" id=\"nodeDecoration\">"
        html += u"<div id=\"headerContent\">"
        html += u'<h1 id=\"nodeTitle\">'
        html += escape(self.node.titleLong)
        html += u'</h1>'
        html += u'</div>'
        html += u"</"+headerTag+">"+lb

        self.node.exportType = 'ims'
        
        for idevice in self.node.idevices:
            if idevice.klass != 'NotaIdevice':
                e=" em_iDevice"
                if unicode(idevice.emphasis)=='0':
                    e=""
                html += u'<'+articleTag+' class="iDevice_wrapper %s%s" id="id%s">%s' % (idevice.klass, e, idevice.id, lb)
                block = g_blockFactory.createBlock(None, idevice)
                if not block:
                    log.critical("Unable to render iDevice.")
                    raise Error("Unable to render iDevice.")
                if hasattr(idevice, "isQuiz"):
                    html += block.renderJavascriptForWeb()
                if idevice.title != "Forum Discussion":
                    html += self.processInternalLinks(
                        block.renderView(self.node.package.style))
            html += u'</'+articleTag+'>'+lb # iDevice div

        if self.node.package.get_addPagination():
            html += "<div class = 'pagination' align='right'>" + c_('Page %i of %i') % (pages.index(self) + 1,len(pages))+ "</div>"+lb 
            
        html += u"</"+sectionTag+">"+lb # /#main
        html += self.renderLicense()
        html += self.renderFooter()
        html += u"</div>"+lb # /#outer
        if style.hasValidConfig:
            html += style.get_extra_body() 
        html += u'</body></html>'
        html = html.encode('utf8')
        # JRJ: Eliminamos los atributos de las ecuaciones
        # Let's elliminate the attibutes of the equations
        aux = re.compile("exe_math_latex=\"[^\"]*\"")
        html = aux.sub("", html)
        aux = re.compile("exe_math_size=\"[^\"]*\"")
        html = aux.sub("", html)
        #JRJ: Cambio el & en los enlaces del glosario
        # Then let's change the & of the glossary links
        html = html.replace("&concept", "&amp;concept")
        # Remove "resources/" from data="resources/ and the url param
        html = html.replace("video/quicktime\" data=\"resources/", "video/quicktime\" data=\"")
        html = html.replace("application/x-mplayer2\" data=\"resources/", "application/x-mplayer2\" data=\"")
        html = html.replace("audio/x-pn-realaudio-plugin\" data=\"resources/", "audio/x-pn-realaudio-plugin\" data=\"")
        html = html.replace("<param name=\"url\" value=\"resources/", "<param name=\"url\" value=\"")
        return html


    def processInternalLinks(self, html):
        """
        take care of any internal links which are in the form of:
           href="exe-node:Home:Topic:etc#Anchor"
        For this IMS Export, go ahead and remove the link entirely,
        leaving only its text, since such links are not to be in the LMS.
        """
        return common.removeInternalLinks(html)
        
        
# ===========================================================================
class IMSExport(object):
    """
    Exports an eXe package as a SCORM package
    """
    def __init__(self, config, styleDir, filename):
        """ Initialize
        'styleDir' is the directory from which we will copy our style sheets
        (and some gifs)
        """
        self.config       = config
        self.imagesDir    = config.webDir/"images"
        self.scriptsDir   = config.webDir/"scripts"
        self.cssDir       = config.webDir/"css"
        self.templatesDir = config.webDir/"templates"
        self.schemasDir   = config.webDir/"schemas/ims"
        self.styleDir     = Path(styleDir)
        self.filename     = Path(filename)
        self.pages        = []


    def export(self, package):
        """ 
        Export SCORM package
        """
        # First do the export to a temporary directory
        outputDir = TempDirPath()

        self.metadataType = package.exportMetadataType


        # Copy the style files to the output dir
        # But not nav.css
        styleFiles = [self.styleDir/'..'/'popup_bg.gif']
        styleFiles += self.styleDir.files("*.*")
        if "nav.css" in styleFiles:
            styleFiles.remove("nav.css")
        self.styleDir.copylist(styleFiles, outputDir)

        # copy the package's resource files
        for resourceFile in package.resourceDir.walkfiles():
            file = package.resourceDir.relpathto(resourceFile)
            
            if ("/" in file):
                Dir = Path(outputDir/file[:file.rindex("/")])
                if not Dir.exists():
                    Dir.makedirs()
            
                resourceFile.copy(outputDir/Dir)
            else:
                resourceFile.copy(outputDir)
        
        listCSSFiles=getFilesCSSToMinify('ims', self.styleDir)
        exportMinFileCSS(listCSSFiles, outputDir)
            
        # Export the package content
        self.pages = [ IMSPage("index", 1, package.root,
           metadataType=self.metadataType) ]

        self.generatePages(package.root, 2)
        uniquifyNames(self.pages)

        for page in self.pages:
            page.save(outputDir, self.pages)

        # Create the manifest file
        manifest = Manifest(self.config, outputDir, package, self.pages, self.metadataType)
        manifest.save("imsmanifest.xml")
        
        # Copy the scripts
        
        # jQuery
        my_style = G.application.config.styleStore.getStyle(page.node.package.style)
        if my_style.hasValidConfig:
            if my_style.get_jquery() == True:
                jsFile = (self.scriptsDir/'exe_jquery.js')
                jsFile.copyfile(outputDir/'exe_jquery.js')
                
        else:
            jsFile = (self.scriptsDir/'exe_jquery.js')
            jsFile.copyfile(outputDir/'exe_jquery.js')   
                
        dT = common.getExportDocType()
        if dT == "HTML5":
            jsFile = (self.scriptsDir/'exe_html5.js')
            jsFile.copyfile(outputDir/'exe_html5.js')

        listFiles=getFilesJSToMinify('ims', self.scriptsDir)        
        exportMinFileJS(listFiles, outputDir)
        
        self.schemasDir.copylist(('imscp_v1p1.xsd',
                                  'imsmd_v1p2p2.xsd',
                                  'lom.xsd',
                                  'lomCustom.xsd',
                                  'ims_xml.xsd'), outputDir)

        # copy players for media idevices.                
        hasFlowplayer     = False
        hasMagnifier      = False
        hasXspfplayer     = False
        hasGallery        = False
        hasFX             = False
        hasSH             = False
        hasGames          = False
        hasWikipedia      = False
        isBreak           = False
        hasInstructions   = False
        hasMediaelement   = False
        hasTooltips       = False
        hasABCMusic       = False
        
        for page in self.pages:
            if isBreak:
                break
            for idevice in page.node.idevices:
                if (hasFlowplayer and hasMagnifier and hasXspfplayer and hasGallery and hasFX and hasSH and hasGames and hasWikipedia and hasInstructions and hasMediaelement and hasTooltips and hasABCMusic):
                    isBreak = True
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
                if not hasABCMusic:
                    hasABCMusic = common.ideviceHasABCMusic(idevice)

        if hasFlowplayer:
            videofile = (self.templatesDir/'flowPlayer.swf')
            videofile.copyfile(outputDir/'flowPlayer.swf')
            controlsfile = (self.templatesDir/'flowplayer.controls.swf')
            controlsfile.copyfile(outputDir/'flowplayer.controls.swf')
        if hasMagnifier:
            videofile = (self.templatesDir/'mojomagnify.js')
            videofile.copyfile(outputDir/'mojomagnify.js')
        if hasXspfplayer:
            videofile = (self.templatesDir/'xspf_player.swf')
            videofile.copyfile(outputDir/'xspf_player.swf')
        if hasGallery:
            exeLightbox = (self.scriptsDir/'exe_lightbox')
            exeLightbox.copyfiles(outputDir)
        if hasFX:
            exeEffects = (self.scriptsDir/'exe_effects')
            exeEffects.copyfiles(outputDir)
        if hasSH:
            exeSH = (self.scriptsDir/'exe_highlighter')
            exeSH.copyfiles(outputDir)
        if hasGames:
            exeGames = (self.scriptsDir/'exe_games')
            exeGames.copyfiles(outputDir)
        if hasWikipedia:
            wikipediaCSS = (self.cssDir/'exe_wikipedia.css')
            wikipediaCSS.copyfile(outputDir/'exe_wikipedia.css')
        if hasInstructions:
            common.copyFileIfNotInStyle('panel-amusements.png', self, outputDir)
            common.copyFileIfNotInStyle('stock-stop.png', self, outputDir)
        if hasMediaelement:
            mediaelement = (self.scriptsDir/'mediaelement')
            mediaelement.copyfiles(outputDir)
            if dT != "HTML5":
                jsFile = (self.scriptsDir/'exe_html5.js')
                jsFile.copyfile(outputDir/'exe_html5.js')
        if hasTooltips:
            exe_tooltips = (self.scriptsDir/'exe_tooltips')
            exe_tooltips.copyfiles(outputDir)
        if hasABCMusic:
            pluginScripts = (self.scriptsDir/'tinymce_4/js/tinymce/plugins/abcmusic/export')
            pluginScripts.copyfiles(outputDir)     
        if hasattr(package, 'exportSource') and package.exportSource:
            (G.application.config.webDir/'templates'/'content.xsd').copyfile(outputDir/'content.xsd')
            (outputDir/'content.data').write_bytes(encodeObject(package))
            (outputDir/'contentv3.xml').write_bytes(encodeObjectToXML(package))


        if package.license == "license GFDL":
            # include a copy of the GNU Free Documentation Licence
            (self.templatesDir/'fdl.html').copyfile(outputDir/'fdl.html')
            
        # Copy JS iDevices files
        common.exportJavaScriptIdevicesFiles(page.node.idevices, outputDir)
            
        # Zip it up!
        self.filename.safeSave(self.doZip, _('EXPORT FAILED!\nLast succesful export is %s.'), outputDir)
        # Clean up the temporary dir
        outputDir.rmtree()

    def doZip(self, fileObj, outputDir):
        """
        Actually does the zipping of the file. Called by 'Path.safeSave'
        """
        zipped = ZipFile(fileObj, "w")
        for scormFile in outputDir.walkfiles():
            zipped.write(scormFile,
                    outputDir.relpathto(scormFile), ZIP_DEFLATED)
        zipped.close()

    def generatePages(self, node, depth):
        """
        Recursive function for exporting a node.
        'outputDir' is the temporary directory that we are exporting to
        before creating zip file
        """
        for child in node.children:
            pageName = child.titleShort.lower().replace(" ", "_")
            pageName = re.sub(r"\W", "", pageName)
            if G.application.config.cutFileName == "1":
                pageName = pageName[0:8]
            if not pageName:
                pageName = "__"

            page = IMSPage(pageName, depth, child, metadataType=self.metadataType)

            self.pages.append(page)
            self.generatePages(child, depth + 1)

    def hasUncutResources(self):
        """
        Check if any of the resources in the exported package has an uncut filename
        """
        for page in self.pages:
            for idevice in page.node.idevices:
                for resource in idevice.userResources:
                    if type(resource) == Resource and len(resource.storageName) > 12:
                        return True
        return False

# ===========================================================================
