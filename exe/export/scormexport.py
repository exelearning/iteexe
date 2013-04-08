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
Exports an eXe package as a SCORM package
"""

import logging
import re
import time
import os
from cgi                           import escape
from zipfile                       import ZipFile, ZIP_DEFLATED
from exe.webui                     import common
from exe.webui.blockfactory        import g_blockFactory
from exe.engine.error              import Error
from exe.engine.path               import Path, TempDirPath
from exe.export.pages              import Page, uniquifyNames
from exe.engine.uniqueidgenerator  import UniqueIdGenerator
from exe.export.singlepage         import SinglePage
from exe.export.websiteexport      import WebsiteExport
from exe.engine.persist            import encodeObject
from exe.engine.persistxml         import encodeObjectToXML
from exe                             import globals as G

log = logging.getLogger(__name__)


# ===========================================================================
class Manifest(object):
    """
    Represents an imsmanifest xml file
    """
    def __init__(self, config, outputDir, package, pages, scormType, metadataType):
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
        self.itemStr      = ""
        self.resStr       = ""
        self.scormType    = scormType
        self.metadataType = metadataType
        self.dependencies = {}


    def createMetaData(self, template):
        """
        if user did not supply metadata title, description or creator
        then use package title, description, or creator in imslrm
        if they did not supply a package title, use the package name
        if they did not supply a date, use today
        """
        # depending on (user desired) the metadata type:
        if self.metadataType == 'DC':
            lrm = self.package.dublinCore.__dict__.copy()
        if self.metadataType == 'LOMES':
            lrm = self.package.lomEs.__dict__.copy()
        if self.metadataType == 'LOM':
            lrm = self.package.lom.__dict__.copy()
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
        xml = template % lrm
        return xml

    def save(self, filename):
        """
        Save a imsmanifest file to self.outputDir
        Two works: createXML and createMetaData
        """
        out = open(self.outputDir/filename, "w")
        if filename == "imsmanifest.xml":
            out.write(self.createXML().encode('utf8'))
        out.close()
        # now depending on metadataType, <metadata> content is diferent:
        if self.scormType == "scorm1.2" or self.scormType == "scorm2004" or self.scormType == "agrega":
            if self.metadataType == 'DC':
                # if old template is desired, select imslrm.xml file:
                # anything else, yoy should select:
                templateFilename = self.config.webDir/'templates'/'imslrmdc.xml'
            elif self.metadataType == 'LOMES':
                templateFilename = self.config.webDir/'templates'/'imslrmlomes.xml'
            elif self.metadataType == 'LOM':
                templateFilename = self.config.webDir/'templates'/'imslrmlom.xml'  
            # Now the file with metadatas. 
            # Notice that its name is independent of metadataType:   
            template = open(templateFilename, 'rb').read()
            xml = self.createMetaData(template)
            out = open(self.outputDir/'imslrm.xml', 'wb')
            out.write(xml.encode('utf8'))
            out.close()
         
    
    def createXML(self):
        """
        returning XLM string for manifest file
        """
        manifestId = unicode(self.idGenerator.generate())
        orgId      = unicode(self.idGenerator.generate())
       
        # Add the namespaces 
        
        if self.scormType == "scorm1.2":
            xmlStr  = u'<?xml version="1.0" encoding="UTF-8"?>\n'
            xmlStr += u'<!-- generated by eXe - http://exelearning.org -->\n'
            xmlStr += u'<manifest identifier="'+manifestId+'" '
            xmlStr += u'xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2" '
            xmlStr += u'xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2" '
            xmlStr += u'xmlns:imsmd="http://www.imsglobal.org/xsd/imsmd_v1p2" '
            xmlStr += u'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" '
            xmlStr += u"xsi:schemaLocation=\"http://www.imsproject.org/xsd/"
            xmlStr += u"imscp_rootv1p1p2 imscp_rootv1p1p2.xsd "        
            xmlStr += u"http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 "
            xmlStr += u"imsmd_rootv1p2p1.xsd "
            xmlStr += u"http://www.adlnet.org/xsd/adlcp_rootv1p2 "
            xmlStr += u"adlcp_rootv1p2.xsd\" "
            xmlStr += u"> \n"
            xmlStr += u"<metadata> \n"
            xmlStr += u" <schema>ADL SCORM</schema> \n"
            xmlStr += u" <schemaversion>1.2</schemaversion> \n"
            xmlStr += u" <adlcp:location>imslrm.xml"
            xmlStr += u"</adlcp:location> \n"
            xmlStr += u"</metadata> \n"
        elif self.scormType == "scorm2004" or self.scormType == "agrega":
            xmlStr  = u'<?xml version="1.0" encoding="UTF-8"?>\n'
            xmlStr += u'<!-- generated by eXe - http://exelearning.org -->\n'
            xmlStr += u'<manifest identifier="'+manifestId+'" \n'
            xmlStr += u'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \n'
            xmlStr += u'xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_v1p3" \n'
            xmlStr += u'xmlns:adlseq="http://www.adlnet.org/xsd/adlseq_v1p3" \n'
            xmlStr += u'xmlns:adlnav="http://www.adlnet.org/xsd/adlnav_v1p3" \n'
            xmlStr += u'xmlns:imsss="http://www.imsglobal.org/xsd/imsss" \n'
            xmlStr += u'xmlns:lom="http://ltsc.ieee.org/xsd/LOM" \n'
            xmlStr += u'xmlns:lomes="http://ltsc.ieee.org/xsd/LOM" \n'
            xmlStr += u'xmlns="http://www.imsglobal.org/xsd/imscp_v1p1" \n'
            xmlStr += u"xsi:schemaLocation=\"http://www.imsglobal.org/xsd/imscp_v1p1 imscp_v1p1.xsd " 
            xmlStr += u"http://ltsc.ieee.org/xsd/LOM lomCustom.xsd " 
            xmlStr += u"http://www.adlnet.org/xsd/adlcp_v1p3 adlcp_v1p3.xsd  "
            xmlStr += u"http://www.imsglobal.org/xsd/imsss imsss_v1p0.xsd  "
            xmlStr += u"http://www.adlnet.org/xsd/adlseq_v1p3 adlseq_v1p3.xsd "
            xmlStr += u"http://www.adlnet.org/xsd/adlnav_v1p3 adlnav_v1p3.xsd"
            xmlStr += u'"> \n'
            xmlStr += u"<metadata> \n"
            xmlStr += u" <schema>ADL SCORM</schema> \n"
            xmlStr += u" <schemaversion>2004 3rd Edition</schemaversion> \n"
            xmlStr += u" <adlcp:location>imslrm.xml"
            xmlStr += u"</adlcp:location> \n"
            xmlStr += u"</metadata> \n"
        elif self.scormType == "commoncartridge":
            xmlStr  = u'<?xml version="1.0" encoding="UTF-8"?>\n'
            xmlStr += u'<!-- generated by eXe - http://exelearning.org -->\n'
            xmlStr += u'<manifest identifier="'+manifestId+'" \n'
            xmlStr += u'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \n'
            xmlStr += u'xmlns="http://www.imsglobal.org/xsd/imscp_v1p1" \n'
            xmlStr += u'xsi:schemaLocation=\"http://www.imsglobal.org/xsd/imscc/imscp_v1p1 imscp_v1p1.xsd " \n'
            templateFilename = self.config.webDir/'templates'/'cc.xml'
            template = open(templateFilename, 'rb').read()
            xmlStr += self.createMetaData(template)

        # Organization

        if self.scormType == "commoncartridge":
            xmlStr += u'''<organizations>
    <organization identifier="%s" structure="rooted-hierarchy">
    <item identifier="eXeCC-%s">\n''' % (orgId,
            unicode(self.idGenerator.generate()))
        else:
            xmlStr += u"<organizations default=\""+orgId+"\">  \n"
            xmlStr += u'    <organization identifier="%s" structure="hierarchical">\n' % orgId

            if self.package.title != '':
                title = escape(self.package.title)
            else:
                title  = escape(self.package.root.titleShort)
            xmlStr += u"        <title>"+title+"</title>\n"

        if self.scormType == "commoncartridge":
            # FIXME flatten hierarchy
            for page in self.pages:
                self.genItemResStr(page)
                self.itemStr += "    </item>\n"
        else:
            depth = 0
            for page in self.pages:

                while depth > page.depth:
                    self.itemStr += "    </item>\n"
                    depth -= 1                             
                self.genItemResStr(page)         

                if self.scormType == "scorm2004":
                    if not page.node.children:
                        self.itemStr += "    </item>\n"
                        self.itemStr += u"    <imsss:sequencing>\n"
                        self.itemStr += u"        <imsss:controlMode flow=\"true\"/>\n"
                        self.itemStr += u"    </imsss:sequencing>\n"
                depth = page.depth                     
            while depth > 1:               
                self.itemStr += "        </item>\n"                        
                if self.scormType == "scorm2004":
                    if not page.node.children:
                        self.itemStr += u"    <imsss:sequencing>\n"
                        self.itemStr += u"        <imsss:controlMode flow=\"true\"/>\n"
                        self.itemStr += u"    </imsss:sequencing>\n"             
                depth -= 1

        xmlStr += self.itemStr
        if self.scormType == "commoncartridge":
            xmlStr += "    </item>\n"
        xmlStr += "  </organization>\n"
        xmlStr += "</organizations>\n"
        xmlStr += "<resources>\n"
        xmlStr += self.resStr
        xmlStr += "</resources>\n"
        xmlStr += "</manifest>\n"
        return xmlStr
        
            
    def genItemResStr(self, page):
        """
        Returning xml string for items and resources
        Notice, please: items AND resources 
        """
        itemId   = "ITEM-"+unicode(self.idGenerator.generate())
        control = itemId
        resId    = "RES-"+unicode(self.idGenerator.generate())
        filename = page.name+".html"
            
        ## ITEMS INSIDE ORGANIZATIONS
        
        self.itemStr += '        <item identifier="'+itemId+'" '
        if self.scormType != "commoncartridge":
            self.itemStr += 'isvisible="true" '

        # If self.scormType == "scorm2004" the identifierref shall not 
        # be used on <item> elements that contain other <item> elements, 
        # so:
        if self.scormType == "scorm2004":
            if not page.node.children:
                self.itemStr += 'identifierref="'+resId+'">\n'
                self.itemStr += "            <title>"
                self.itemStr += escape(page.node.titleShort)
                self.itemStr += "</title>\n"
            else:
                self.itemStr += ">\n"
                self.itemStr += "            <title>"
                self.itemStr += "->"
                self.itemStr += "</title>\n"     
                
                # create a leaf item with this resource one level beyond,
                if control == itemId:
                   self.itemStr += '        <item identifier="'+itemId+'" '
                   self.itemStr += 'identifierref="'+resId+'">\n'
                   self.itemStr += "            <title>"
                   self.itemStr += escape(page.node.titleShort)
                   self.itemStr += "</title>\n"
                   control = 0
                       
                self.itemStr += "        </item>\n"
                
        # if user selects Agrega export, ALL the items at organizations 
        # must include identifierref attribute (like SCORM1.2):
        if self.scormType == "scorm1.2" or self.scormType == "agrega":
            self.itemStr += 'identifierref="'+resId+'">\n'
            self.itemStr += "            <title>"
            self.itemStr += escape(page.node.titleShort)
            self.itemStr += "</title>\n"    
            if not page.node.children:
                self.itemStr += "        </item>\n"            
                   
        ## RESOURCES
        
        self.resStr += "  <resource identifier=\""+resId+"\" "
        self.resStr += "type=\"webcontent\" "

        # FIXME force dependency on popup_bg.gif on every page
        # because it isn't a "resource" so we can't tell which
        # pages will use it from content.css
        if self.scormType == "commoncartridge":
            self.resStr += """href="%s">
    <file href="%s"/>
    <file href="base.css"/>
    <file href="content.css"/>
    <file href="popup_bg.gif"/>""" % (filename, filename)
            if page.node.package.backgroundImg:
                self.resStr += '\n    <file href="%s"/>' % \
                        page.node.package.backgroundImg.basename()
            self.dependencies["base.css"] = True
            self.dependencies["content.css"] = True
            self.dependencies["popup_bg.gif"] = True
        else:
            if self.scormType == "scorm2004" or self.scormType == "agrega":
                self.resStr += "adlcp:scormType=\"sco\" "
                #
                self.resStr += "href=\""+filename+"\"> \n"
                self.resStr += """\
    <file href="%s"/>
    <file href="base.css"/>
    <file href="content.css"/>
    <file href="popup_bg.gif"/>
    <file href="AC_RunActiveContent.js"/>
    <file href="SCORM_API_wrapper.js"/>
    <file href="SCOFunctions.js"/>""" % filename
                self.resStr += "\n"
                fileStr = ""
            if self.scormType == "scorm1.2":
                self.resStr += "adlcp:scormtype=\"sco\" "    
                self.resStr += "href=\""+filename+"\"> \n"
                self.resStr += """\
    <file href="%s"/>
    <file href="base.css"/>
    <file href="content.css"/>
    <file href="popup_bg.gif"/>
    <file href="SCORM_API_wrapper.js"/>
    <file href="SCOFunctions.js"/>""" % filename
                self.resStr += "\n"
                fileStr = ""

        for resource in page.node.getResources():            
            fileStr += "    <file href=\""+escape(resource)+"\"/>\n"
            self.dependencies[resource] = True

        self.resStr += fileStr
        self.resStr += "  </resource>\n"


# ===========================================================================
class ScormPage(Page):
    """
    This class transforms an eXe node into a SCO
    """
    def __init__(self, name, depth, node, scormType, metadataType):
        self.scormType = scormType
        self.metadataType = metadataType
        super(ScormPage, self).__init__(name, depth, node)

    def save(self, outputDir):
        """
        This is the main function.  It will render the page and save it to a
        file.  
        'outputDir' is the name of the directory where the node will be saved to,
        the filename will be the 'self.node.id'.html or 'index.html' if
        self.node is the root node. 'outputDir' must be a 'Path' instance
        """
        out = open(outputDir/self.name+".html", "wb")
        out.write(self.render())
        out.close()


    def render(self):
        """
        Returns an XHTML string rendering this page.
        """
        html  = common.docType()
        #html += u"<html xmlns=\"http://www.w3.org/1999/xhtml\">\n"
        lenguaje = G.application.config.locale
        html += u"<html lang=\"" + lenguaje + "\" xml:lang=\"" + lenguaje + "\" xmlns=\"http://www.w3.org/1999/xhtml\">\n"
        html += u"<head>\n"
        # html += u"<title>"+_("eXe")+"</title>\n"
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
        html += u" </title>\n" 
        html += u"<meta http-equiv=\"Content-Type\" content=\"text/html; "
        html += u" charset=utf-8\" />\n";
        html += u"<!-- Created using eXe: http://exelearning.net -->\n"
        html += u"<link rel=\"stylesheet\" type=\"text/css\" href=\"base.css\" />"
        if common.hasWikipediaIdevice(self.node):
            html += u"<link rel=\"stylesheet\" type=\"text/css\" href=\"exe_wikipedia.css\" />"
        if common.hasGalleryIdevice(self.node):
            html += u"<link rel=\"stylesheet\" type=\"text/css\" href=\"exe_lightbox.css\" />"
        html += u"<link rel=\"stylesheet\" type=\"text/css\" href=\"content.css\" />"
        if common.hasGalleryIdevice(self.node):
            html += u'<script type="text/javascript" src="exe_lightbox.js"></script>\n'
        html += u'<script type="text/javascript" src="common.js"></script>\n'
        #html += u"</head>\n"
        if self.scormType == 'commoncartridge':
            html += u"</head>\n"
            html += u"<body class=\"exe-scorm\">\n"
        else:
            html += u"<script type=\"text/javascript\" "
            html += u"src=\"SCORM_API_wrapper.js\"></script>\n" 
            html += u"<script type=\"text/javascript\" "
            html += u"src=\"SCOFunctions.js\"></script>\n" 
            html += u"</head>\n"            
            html += u'<body class=\"exe-scorm\" onload="loadPage()" '
            html += u'onunload="unloadPage()">'
        html += u"<div id=\"outer\">\n"
        html += u"<div id=\"main\">\n"
        html += u"<div id=\"nodeDecoration\">\n"
        html += u"<h1 id=\"nodeTitle\">\n"
        html += escape(self.node.titleLong)
        html += u'</h1></div>\n'

        for idevice in self.node.idevices:
            html += u'<div class="%s" id="id%s">\n' % (idevice.klass,
                    idevice.id)
            block = g_blockFactory.createBlock(None, idevice)
            if not block:
                log.critical("Unable to render iDevice.")
                raise Error("Unable to render iDevice.")
            if hasattr(idevice, "isQuiz"):
                html += block.renderJavascriptForScorm()
            html += self.processInternalLinks(
                    block.renderView(self.node.package.style))
            html += u'</div>\n'     # iDevice div

        html += u"</div>\n"
        html += u"</div>\n"
        if self.node.package.scolinks:
            html += u'<div class="previousnext">'
            html += u'<a class="previouslink" '
            html += u'href="javascript: goBack();">%s</a> | <a class="nextlink" ' % _('Previous')
            html += u'href="javascript: goForward();">%s</a>' % _('Next')
            html += u'</div>'
        html += self.renderLicense()
        html += self.renderFooter()
        html += u"</body></html>\n"
        html = html.encode('utf8')
        # JR: Eliminamos los atributos de las ecuaciones
        aux = re.compile("exe_math_latex=\"[^\"]*\"")
        html = aux.sub("", html)
        aux = re.compile("exe_math_size=\"[^\"]*\"")
        html = aux.sub("", html)
        #JR: Cambio el & en los enlaces del glosario
        html = html.replace("&concept", "&amp;concept")
        # Remove "resources/" from data="resources/ and the url param
        html = html.replace("video/quicktime\" data=\"resources/", "video/quicktime\" data=\"")
        html = html.replace("application/x-mplayer2\" data=\"resources/", "application/x-mplayer2\" data=\"")
        html = html.replace("audio/x-pn-realaudio-plugin\" data=\"resources/", "audio/x-pn-realaudio-plugin\" data=\"")
        html = html.replace("<param name=\"url\" value=\"resources/", "<param name=\"url\" value=\"")
        html = html.replace('src="/'+self.node.package.name+'/resources/', 'src="')
        return html


    def processInternalLinks(self, html):
        """
        take care of any internal links which are in the form of:
           href="exe-node:Home:Topic:etc#Anchor"
        For this SCORM Export, go ahead and remove the link entirely,
        leaving only its text, since such links are not to be in the LMS.
        """
        return common.removeInternalLinks(html)
        

# ===========================================================================
class ScormExport(object):
    """
    Exports an eXe package as a SCORM package
    """
    def __init__(self, config, styleDir, filename, scormType, metadataType='DC'):
        """ 
        Initialize
        'styleDir' is the directory from which we will copy our style sheets
        (and some gifs)
        """
        self.config       = config
        self.imagesDir    = config.webDir/"images"
        self.scriptsDir   = config.webDir/"scripts"
        self.cssDir       = config.webDir/"css"
        self.templatesDir = config.webDir/"templates"
        self.schemasDir   = config.webDir/"schemas"
        self.styleDir     = Path(styleDir)
        self.filename     = Path(filename)
        self.pages        = []
        self.hasForum     = False
        self.scormType    = scormType
        self.metadataType = metadataType


    def export(self, package):
        """ 
        Export SCORM package
        """
        # First do the export to a temporary directory
        outputDir = TempDirPath()

        # copy the package's resource files
        package.resourceDir.copyfiles(outputDir)

        # copy the package's resource files, only non existant in outputDir
#        outputDirFiles = outputDir.files()
#        for rfile in package.resourceDir.files():
#            if rfile not in outputDirFiles:
#                rfile.copy(outputDir)

        # copy the package's resource files, only indexed in package.resources
#        for md5 in package.resources.values():
#            for resource in md5:
#                resource.path.copy(outputDir)

        # Export the package content
        self.pages = [ ScormPage("index", 1, package.root,
            scormType=self.scormType, metadataType=self.metadataType) ]

        self.generatePages(package.root, 2)
        uniquifyNames(self.pages)

        for page in self.pages:
            page.save(outputDir)
            if not self.hasForum:
                for idevice in page.node.idevices:
                    if hasattr(idevice, "isForum"):
                        if idevice.forum.lms.lms == "moodle":
                            self.hasForum = True
                            break

        # Create the manifest file
        manifest = Manifest(self.config, outputDir, package, self.pages, self.scormType, self.metadataType)
        manifest.save("imsmanifest.xml")
        if self.hasForum:
            manifest.save("discussionforum.xml")
        
        # Copy the style sheet files to the output dir
        # But not nav.css
        styleFiles  = [self.styleDir/'..'/'base.css']
        styleFiles += [self.styleDir/'..'/'popup_bg.gif']
        styleFiles += [f for f in self.styleDir.files("*.css")
                if f.basename() <> "nav.css"] 
        styleFiles += self.styleDir.files("*.jpg")
        styleFiles += self.styleDir.files("*.gif")
        styleFiles += self.styleDir.files("*.png")
        styleFiles += self.styleDir.files("*.js")
        styleFiles += self.styleDir.files("*.html")
        styleFiles += self.styleDir.files("*.ttf")
        styleFiles += self.styleDir.files("*.eot")
        styleFiles += self.styleDir.files("*.otf")
        styleFiles += self.styleDir.files("*.woff")
        # FIXME for now, only copy files referenced in Common Cartridge
        # this really should apply to all exports, but without a manifest
        # of the files needed by an included stylesheet it is too restrictive
        if self.scormType == "commoncartridge":
            for sf in styleFiles[:]:
                if sf.basename() not in manifest.dependencies:
                    styleFiles.remove(sf)
        self.styleDir.copylist(styleFiles, outputDir)

        # Copy the scripts
        if self.scormType == "commoncartridge":
            self.scriptsDir.copylist(('libot_drag.js',
                                      'common.js'), outputDir)
        if self.scormType == "scorm2004" or self.scormType == "agrega":
            self.scriptsDir.copylist(('AC_RunActiveContent.js',
                                      'SCORM_API_wrapper.js',
                                      'SCOFunctions.js', 
                                      'libot_drag.js',
                                      'common.js'), outputDir)     
        if self.scormType != "commoncartridge" and self.scormType != "scorm2004" and self.scormType != "agrega":
            self.scriptsDir.copylist(('AC_RunActiveContent.js',
                                      'SCORM_API_wrapper.js', 
                                      'SCOFunctions.js', 
                                      'libot_drag.js',
                                      'common.js'), outputDir)
        schemasDir = ""
        if self.scormType == "scorm1.2":
            schemasDir = self.schemasDir/"scorm1.2"
            schemasDir.copylist(('imscp_rootv1p1p2.xsd',
                                'imsmd_rootv1p2p1.xsd',
                                'adlcp_rootv1p2.xsd',
                                'ims_xml.xsd'), outputDir)
        elif self.scormType == "scorm2004" or self.scormType == "agrega":
            schemasDir = self.schemasDir/"scorm2004"
            schemasDir.copylist(('adlcp_v1p3.xsd',
                                'adlnav_v1p3.xsd',
                                'adlseq_v1p3.xsd', 
                                'datatypes.dtd', 
                                'imscp_v1p1.xsd',
                                'imsssp_v1p0.xsd',
                                'imsss_v1p0.xsd',
                                'imsss_v1p0auxresource.xsd',
                                'imsss_v1p0control.xsd',
                                'imsss_v1p0delivery.xsd',
                                'imsmd_rootv1p2p1.xsd',
                                'imsss_v1p0limit.xsd',
                                'imsss_v1p0objective.xsd',
                                'imsss_v1p0random.xsd',
                                'imsss_v1p0rollup.xsd',
                                'imsss_v1p0seqrule.xsd',
                                'imsss_v1p0util.xsd',
                                'ims_xml.xsd',
                                'lom.xsd',
                                'lomCustom.xsd',
                                'xml.xsd',
                                'XMLSchema.dtd'), outputDir)
            try:
                import shutil, errno
                shutil.copytree(schemasDir/"common", outputDir/"common")
                shutil.copytree(schemasDir/"extend", outputDir/"extend")
                shutil.copytree(schemasDir/"unique", outputDir/"unique")
                shutil.copytree(schemasDir/"vocab", outputDir/"vocab")
            except OSError as exc:
                if exc.errno == errno.ENOTDIR:
                    shutil.copy(schemasDir, outputDir)
                else: raise

        # copy players for media idevices.                
        hasFlowplayer     = False
        hasMagnifier      = False
        hasXspfplayer     = False
        hasGallery        = False
        hasWikipedia      = False
        isBreak           = False
        
        for page in self.pages:
            if isBreak:
                break
            for idevice in page.node.idevices:
                if (hasFlowplayer and hasMagnifier and hasXspfplayer and hasGallery and hasWikipedia):
                    isBreak = True
                    break
                if not hasFlowplayer:
                    if 'flowPlayer.swf' in idevice.systemResources:
                        hasFlowplayer = True
                if not hasMagnifier:
                    if 'magnifier.swf' in idevice.systemResources:
                        hasMagnifier = True
                if not hasXspfplayer:
                    if 'xspf_player.swf' in idevice.systemResources:
                        hasXspfplayer = True
                if not hasGallery:
                    if 'GalleryIdevice' == idevice.klass:
                        hasGallery = True
                if not hasWikipedia:
                    if 'WikipediaIdevice' == idevice.klass:
                        hasWikipedia = True
                        
        if hasFlowplayer:
            videofile = (self.templatesDir/'flowPlayer.swf')
            videofile.copyfile(outputDir/'flowPlayer.swf')
            controlsfile = (self.templatesDir/'flowplayer.controls.swf')
            controlsfile.copyfile(outputDir/'flowplayer.controls.swf')
        if hasMagnifier:
            videofile = (self.templatesDir/'magnifier.swf')
            videofile.copyfile(outputDir/'magnifier.swf')
        if hasXspfplayer:
            videofile = (self.templatesDir/'xspf_player.swf')
            videofile.copyfile(outputDir/'xspf_player.swf')
        if hasGallery:
            imageGalleryCSS = (self.cssDir/'exe_lightbox.css')
            imageGalleryCSS.copyfile(outputDir/'exe_lightbox.css') 
            imageGalleryJS = (self.scriptsDir/'exe_lightbox.js')
            imageGalleryJS.copyfile(outputDir/'exe_lightbox.js') 
            self.imagesDir.copylist(('exeGallery_actions.png', 'exeGallery_loading.gif'), outputDir)
        if hasWikipedia:
            wikipediaCSS = (self.cssDir/'exe_wikipedia.css')
            wikipediaCSS.copyfile(outputDir/'exe_wikipedia.css')

        if self.scormType == "scorm1.2" or self.scormType == "scorm2004" or self.scormType == "agrega":
            if package.license == "GNU Free Documentation License":
                # include a copy of the GNU Free Documentation Licence
                (self.templatesDir/'fdl.html').copyfile(outputDir/'fdl.html')
        
        if hasattr(package, 'scowsinglepage') and package.scowsinglepage:
            page = SinglePage("singlepage_index", 1, package.root)
            page.save(outputDir/"singlepage_index.html")
        if hasattr(package, 'scowwebsite') and package.scowwebsite:
            website = WebsiteExport(self.config, self.styleDir, outputDir, "website_")
            website.export(package)
            (self.styleDir/'nav.css').copyfile(outputDir/'nav.css')
        if hasattr(package, 'scowsource') and package.scowsource:
            (G.application.config.webDir/'templates'/'content.xsd').copyfile(outputDir/'content.xsd')
            (outputDir/'content.data').write_bytes(encodeObject(package))
            (outputDir/'contentv2.xml').write_bytes(encodeObjectToXML(package))

        # Zip it up!
        self.filename.safeSave(self.doZip, _('EXPORT FAILED!\nLast succesful export is %s.'), outputDir)
        # Clean up the temporary dir
        outputDir.rmtree()

    def doZip(self, fileObj, outputDir):
        """
        Actually does the zipping of the file. Called by 'Path.safeSave'
        """
        # Zip up the scorm package
        zipped = ZipFile(fileObj, "w")
        ## old method: only files could be copied:
        # for scormFile in outputDir.files():
        #    zipped.write(scormFile,
        #                 scormFile.basename().encode('utf8'),
        #                  ZIP_DEFLATED)
        ## but some folders must be included also, so:
        outputlen = len(outputDir) + 1
        for base, dirs, files in os.walk(outputDir):
            for file in files:
                fn = os.path.join(base, file)
                zipped.write(fn, fn[outputlen:].encode('utf8'), ZIP_DEFLATED)
        #
        zipped.close()

    def generatePages(self, node, depth):
        """
        Recursive function for exporting a node.
        'node' is the node that we are making a page for
        'depth' is the number of ancestors that the page has +1 (ie. root is 1)
        """
        for child in node.children:
            pageName = child.titleShort.lower().replace(" ", "_")
            pageName = re.sub(r"\W", "", pageName)
            if not pageName:
                pageName = "__"

            page = ScormPage(pageName, depth, child, scormType=self.scormType, metadataType=self.metadataType)

            self.pages.append(page)
            self.generatePages(child, depth + 1)
    
# ===========================================================================
