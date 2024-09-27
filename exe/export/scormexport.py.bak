#!/usr/bin/env python
#-*- coding: utf-8 -*-
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
import copy
import re
import time
import os
import imp
import StringIO
from cgi                           import escape
from zipfile                       import ZipFile, ZIP_DEFLATED
from exe.webui                     import common
from exe.engine.path               import Path, TempDirPath
from exe.export.pages              import uniquifyNames
from exe.engine.resource           import Resource
from exe.engine.uniqueidgenerator  import UniqueIdGenerator
from exe.export.singlepage         import SinglePage
from exe.export.websiteexport      import WebsiteExport
from exe.engine.persist            import encodeObject
from exe.engine.persistxml         import encodeObjectToXML
from exe                           import globals as G
from exe.export.scormpage          import ScormPage
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

    def _validateMetaData(self, metadata):

        modifiedMetaData = False
        fieldsModified = []

        if metadata.get_general().get_description():
            for description in metadata.get_general().get_description():
                strings = description.get_string()
                for string in strings:
                    value = string.get_valueOf_()
#                     general description: The field must be 1000 characters maximum, standard SCORM 2.1
                    if len(value) > 1000:
                        string.set_valueOf_(value[:1000])
                        modifiedMetaData = True
                        fieldsModified.append(_('general description'))

        if metadata.get_educational():
            for educational in metadata.get_educational():
                if educational.get_description():
                    for description in educational.get_description():
                        strings = description.get_string()
                        for string in strings:
                            value = string.get_valueOf_()
#                     educational description: The field must be 1000 characters maximum, standard SCORM 2.1
                            if len(value) > 1000:
                                string.set_valueOf_(value[:1000])
                                modifiedMetaData = True
                                fieldsModified.append(_('educational description'))

        return {'modifiedMetaData': modifiedMetaData, 'fieldsModified': fieldsModified}

    def createMetaData(self, template):
        """
        if user did not supply metadata title, description or creator
        then use package title, description, or creator in imslrm
        if they did not supply a package title, use the package name
        if they did not supply a date, use today
        """
        xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
        namespace = 'xmlns="http://ltsc.ieee.org/xsd/LOM" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://ltsc.ieee.org/xsd/LOM lomCustom.xsd"'

        modifiedMetaData = False

        # depending on (user desired) the metadata type:
        if self.metadataType == 'LOMES':
            output = StringIO.StringIO()
            metadata = copy.deepcopy(self.package.lomEs)
            title = metadata.get_general().get_title() or lomsubs.titleSub([])
            if not title.get_string():
                title.add_string(lomsubs.LangStringSub(self.package.lang.encode('utf-8'), self.package.name))
                metadata.get_general().set_title(title)
            if self.scormType == "scorm1.2":
                modifiedMetaData = self._validateMetaData(metadata)

            if self.package.exportSource:
                technical = metadata.get_technical()
                if not technical:
                    technical = lomsubs.technicalSub('technical')
                    metadata.set_technical(technical)
                opr = technical.get_otherPlatformRequirements()
                if not opr:
                    opr = lomsubs.otherPlatformRequirementsSub()
                    technical.set_otherPlatformRequirements(opr)
                opr.add_string(lomsubs.LangStringSub(self.package.lang.encode('utf-8'), 'editor: eXe Learning'))

                found = False
                for platform in opr.get_string():
                    if platform.get_valueOf_() == self.package.lomESPlatformMark:
                        found = True
                if not found:
                    opr.add_string(lomsubs.LangStringSub(self.package.lang.encode('utf-8'), self.package.lomESPlatformMark))

            metadata.export(output, 0, namespacedef_=namespace, pretty_print=False)
            xml += output.getvalue()
        if self.metadataType == 'LOM':
            output = StringIO.StringIO()
            metadata = copy.deepcopy(self.package.lom)
            title = metadata.get_general().get_title() or lomsubs.titleSub([])
            if not title.get_string():
                title.add_string(lomsubs.LangStringSub(self.package.lang.encode('utf-8'), self.package.name))
                metadata.get_general().set_title(title)

            if self.scormType == "scorm1.2":
                modifiedMetaData = self._validateMetaData(metadata)

            metadata.export(output, 0, namespacedef_=namespace, pretty_print=False)
            xml += output.getvalue()
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
            xml = template % lrm

        return {'xml': xml, 'modifiedMetaData' : modifiedMetaData}

    def save(self, filename):
        """
        Save a imsmanifest file to self.outputDir
        Two works: createXML and createMetaData
        """
        modifiedMetaData = False

        out = open(self.outputDir/filename, "w")
        if filename == "imsmanifest.xml":
            out.write(self.createXML().encode('utf8'))
        out.close()
        # now depending on metadataType, <metadata> content is diferent:
        if self.scormType == "scorm1.2" or self.scormType == "scorm2004":
            if self.metadataType == 'DC':
                # if old template is desired, select imslrm.xml file:\r
                # anything else, yoy should select:
                templateFilename = self.config.webDir/'templates'/'imslrm.xml'
                template = open(templateFilename, 'rb').read()
            elif self.metadataType == 'LOMES':
                template = None
            elif self.metadataType == 'LOM':
                template = None
            # Now the file with metadatas.
            # Notice that its name is independent of metadataType:
            metaData = self.createMetaData(template)
            xml = metaData['xml']
            modifiedMetaData = metaData['modifiedMetaData']
            out = open(self.outputDir/'imslrm.xml', 'wb')
            out.write(xml.encode('utf8'))
            out.close()

        return modifiedMetaData

    def createXML(self):
        """
        returning XLM string for manifest file
        """
        manifestId = unicode(self.idGenerator.generate())
        orgId      = unicode(self.idGenerator.generate())

        # Add the namespaces

        if self.scormType == "scorm1.2":
            xmlStr  = u'<?xml version="1.0" encoding="UTF-8"?>\n'
            xmlStr += u'<!-- Generated by eXe - http://exelearning.net -->\n'
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
        elif self.scormType == "scorm2004":
            xmlStr  = u'<?xml version="1.0" encoding="UTF-8"?>\n'
            xmlStr += u'<!-- Generated by eXe - http://exelearning.net -->\n'
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
            xmlStr += u" <schemaversion>2004 4th Edition</schemaversion> \n"
            xmlStr += u" <adlcp:location>imslrm.xml"
            xmlStr += u"</adlcp:location> \n"
            xmlStr += u"</metadata> \n"
        elif self.scormType == "commoncartridge":
            xmlStr = u'''<?xml version="1.0" encoding="UTF-8"?>
<!-- generated by eXe - http://exelearning.net -->
<manifest identifier="%s"
xmlns="http://www.imsglobal.org/xsd/imscc/imscp_v1p1"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xsi:schemaLocation="http://www.imsglobal.org/xsd/imscc/imscp_v1p1 imscp_v1p1.xsd">\n''' % manifestId
            templateFilename = self.config.webDir/'templates'/'cc.xml'
            template = open(templateFilename, 'rb').read()
            metaData = self.createMetaData(template)
            xmlStr += metaData['xml']

        # ORGANIZATION

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
                self.itemStr += " </item>\n"
            self.itemStr += "    </item>\n"
        else:
            depth = 0
            for page in self.pages:
                while depth >= page.depth:
                    self.itemStr += "</item>\n"
                    if depth > page.depth and self.scormType == "scorm2004":
                            self.itemStr += '''  <imsss:sequencing>
    <imsss:controlMode choice="true" choiceExit="true" flow="true" forwardOnly="false"/>
  </imsss:sequencing>'''
                    depth -= 1
                if page.node.children and self.scormType == "scorm2004":
                    # Add fake node with original title
                    itemId   = "ITEM-"+unicode(self.idGenerator.generate())
                    self.itemStr += '<item identifier="'+itemId+'" '
                    self.itemStr += 'isvisible="true">\n'
                    self.itemStr += "    <title>"
                    self.itemStr += escape(page.node.titleShort)
                    self.itemStr += "</title>\n"

                    # Increase actual depth because fake node added. Next iteration closes the fake node
                    depth = page.depth + 1
                else:
                    depth = page.depth
                self.genItemResStr(page)

            while depth >= 1:
                self.itemStr += "</item>\n"
                if depth > 1 and self.scormType == "scorm2004":
                    self.itemStr += '''  <imsss:sequencing>
    <imsss:controlMode choice="true" choiceExit="true" flow="true" forwardOnly="false"/>
  </imsss:sequencing>'''
                depth -= 1

        xmlStr += self.itemStr

        if self.scormType == "scorm2004":
            xmlStr += '''  <imsss:sequencing>
    <imsss:controlMode choice="true" choiceExit="true" flow="true" forwardOnly="false"/>
  </imsss:sequencing>'''
        xmlStr += "  </organization>\n"
        xmlStr += "</organizations>\n"

        # RESOURCES

        xmlStr += "<resources>\n"
        xmlStr += self.resStr


        # If NOT commoncartridge, finally, special resource with
        # all the common files, as binded with de active style ones:
        if self.scormType != "commoncartridge":
            if self.scormType == "scorm1.2":
                xmlStr += """  <resource identifier="COMMON_FILES" type="webcontent" adlcp:scormtype="asset">\n"""
            else:
                xmlStr += """  <resource identifier="COMMON_FILES" type="webcontent" adlcp:scormType="asset">\n"""
            my_style = G.application.config.styleStore.getStyle(page.node.package.style)
            for x in my_style.get_style_dir().files('*.*'):
                xmlStr += """    <file href="%s"/>\n""" % x.basename()
            # we do want base.css and some images:
            xmlStr += """    <file href="base.css"/>\n"""
            xmlStr += """    <file href="popup_bg.gif"/>\n"""
            if self.package.get_addExeLink():
                xmlStr += """    <file href="exe_powered_logo.png"/>\n"""
            # now the javascript files:
            xmlStr += """    <file href="SCORM_API_wrapper.js"/>\n"""
            xmlStr += """    <file href="SCOFunctions.js"/>\n"""
            xmlStr += """    <file href="common.js"/>\n"""
            xmlStr += """    <file href="common_i18n.js"/>\n"""
            if my_style.hasValidConfig():
                if my_style.get_jquery() == True:
                    xmlStr += """    <file href="exe_jquery.js"/>\n"""
            else:
                xmlStr += """    <file href="exe_jquery.js"/>\n"""

            # SCORM 1.2 and SCORM 2004:
            # So that certain platforms do not delete the necessary files so that the resources can be editable
            if page.node.package.exportSource:
                xmlStr += """    <file href="content.xsd"/>\n"""
                xmlStr += """    <file href="content.data"/>\n"""
                xmlStr += """    <file href="contentv3.xml"/>\n"""
                xmlStr += """    <file href="imslrm.xml"/>\n"""

            xmlStr += "  </resource>\n"

        # no more resources:
        xmlStr += "</resources>\n"
        xmlStr += "</manifest>\n"
        return xmlStr


    def genItemResStr(self, page):
        """
        Returning xml string for items and resources
        """
        itemId   = "ITEM-"+unicode(self.idGenerator.generate())
        resId    = "RES-"+unicode(self.idGenerator.generate())
        ext = 'html'
        if G.application.config.cutFileName == "1":
                ext = 'htm'

        filename = page.name + '.' + ext


        self.itemStr += '<item identifier="'+itemId+'" '
        if self.scormType != "commoncartridge":
            self.itemStr += 'isvisible="true" '
        self.itemStr += 'identifierref="'+resId+'">\n'
        self.itemStr += "    <title>"
        self.itemStr += escape(page.node.titleShort)
        self.itemStr += "</title>\n"

        ## SCORM 12 specific metadata: Mastery Score is an ADL extension to the IMS Content Packaging Information Model
        ## Added for FR [#2501] Add masteryscore to manifest in evaluable nodes
        if self.scormType == "scorm1.2" and common.hasQuizTest(page.node):
            self.itemStr += "    <adlcp:masteryscore>%s</adlcp:masteryscore>\n" % common.getQuizTestPassRate(page.node)

        ## RESOURCES

        self.resStr += "  <resource identifier=\""+resId+"\" "
        self.resStr += "type=\"webcontent\" "

        # FIXME force dependency on popup_bg.gif on every page
        # because it isn't a "resource" so we can't tell which
        # pages will use it from content.css
        if self.scormType == "commoncartridge":
            fileStr = ""
            self.resStr += """href="%s">
    <file href="%s"/>
    <file href="base.css"/>
    <file href="popup_bg.gif"/>
    <file href="exe_jquery.js"/>
    <file href="common_i18n.js"/>
    <file href="common.js"/>\n""" % (filename, filename)
            my_style = G.application.config.styleStore.getStyle(page.node.package.style)   
            for x in my_style.get_style_dir().files('*.*'):
                fileStr += """    <file href="%s"/>\n""" % x.basename()
                self.dependencies[x.basename()] = True    
            if page.node.package.get_addExeLink():
                self.resStr += '    <file href="exe_powered_logo.png"/>\n'                
                self.dependencies["exe_powered_logo.png"] = True
            # CC export require content.* any place inside the manifest:
            if page.node.package.exportSource and page.depth == 1:
                self.resStr += '    <file href="content.xsd"/>\n'
                self.resStr += '    <file href="content.data"/>\n'
                self.resStr += '    <file href="contentv3.xml"/>\n'
            if page.node.package.backgroundImg:
                self.resStr += '\n    <file href="%s"/>' % \
                        page.node.package.backgroundImg.basename()
            self.dependencies["base.css"] = True
            self.dependencies["content.css"] = True
            self.dependencies["popup_bg.gif"] = True
            if page.node.package.get_addExeLink():
                self.dependencies["exe_powered_logo.png"] = True
        else:
            if self.scormType == "scorm2004":
                self.resStr += "adlcp:scormType=\"sco\" "
                self.resStr += "href=\""+filename+"\"> \n"
                self.resStr += "    <file href=\""+filename+"\"/> \n"
                fileStr = ""
            if self.scormType == "scorm1.2":
                self.resStr += "adlcp:scormtype=\"sco\" "
                self.resStr += "href=\""+filename+"\"> \n"
                self.resStr += "    <file href=\""+filename+"\"/> \n"
                fileStr = ""

        dT = common.getExportDocType()
        if dT == "HTML5" or common.nodeHasMediaelement(page.node):
            self.resStr += '    <file href="exe_html5.js"/>\n'

        resources = page.node.getResources()

        if common.nodeHasMediaelement(page.node):
            resources = resources + [f.basename() for f in (self.config.webDir/"scripts"/'mediaelement').files()]
            if dT != "HTML5":
                self.scriptsDir = self.config.webDir/"scripts"
                jsFile = (self.scriptsDir/'exe_html5.js')
                jsFile.copyfile(self.outputDir/'exe_html5.js')

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
            
        # Accessibility toolbar files
        if page.node.package.get_addAccessibilityToolbar():            
            resources = resources + [f.basename() for f in (self.config.webDir / "scripts" / 'exe_atools').files()]

        for resource in resources:
            fileStr += "    <file href=\""+escape(resource)+"\"/>\n"
            self.dependencies[resource] = True

        if common.hasElpLink(page.node):
            fileStr += "    <file href=\""+page.node.package.name+".elp\"/>\n"

        self.resStr += fileStr

        self.resStr += common.getJavascriptIdevicesResources(page, xmlOutput = True)

        # adding the dependency with the common files collected:
        if self.scormType != "commoncartridge":
            self.resStr += """    <dependency identifierref="COMMON_FILES"/>"""

        # and no more:
        self.resStr += '\n'
        self.resStr += "  </resource>\n"



class ScormExport(object):
    """
    Exports an eXe package as a SCORM package
    """
    def __init__(self, config, styleDir, filename, scormType):
        """
        Initialize
        'styleDir' is the directory from which we will copy our style sheets
        (and some gifs)
        """
        self.config          = config
        self.imagesDir       = config.webDir/"images"
        self.scriptsDir      = config.webDir/"scripts"
        self.cssDir          = config.webDir/"css"
        self.templatesDir    = config.webDir/"templates"
        self.schemasDir      = config.webDir/"schemas"
        self.styleDir        = Path(styleDir)
        self.filename        = Path(filename)
        self.pages           = []
        self.hasForum        = False
        self.scormType       = scormType
        self.styleSecureMode = config.styleSecureMode


    def export(self, package):
        """
        Export SCORM package
        """
        # First do the export to a temporary directory
        outputDir = TempDirPath()

        self.metadataType = package.exportMetadataType

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
        # Import the Scorm Page class , if the secure mode is off.  If the style has it's own page class
        # use that, else use the default one.
        if self.styleSecureMode=="0":
            if (self.styleDir/"scormpage.py").exists():
                global ScormPage
                module = imp.load_source("ScormPage",self.styleDir/"scormpage.py")
                ScormPage = module.ScormPage


        self.pages = [ ScormPage("index", 1, package.root,
            scormType=self.scormType, metadataType=self.metadataType) ]

        self.generatePages(package.root, 2)
        uniquifyNames(self.pages)

        for page in self.pages:
            page.save(outputDir, self.pages)
            if not self.hasForum:
                for idevice in page.node.idevices:
                    if hasattr(idevice, "isForum"):
                        if idevice.forum.lms.lms == "moodle":
                            self.hasForum = True
                            break

        # Create the manifest file
        manifest = Manifest(self.config, outputDir, package, self.pages, self.scormType, self.metadataType)
        modifiedMetaData = manifest.save("imsmanifest.xml")

        # Create lang file
        langFile = open(outputDir + '/common_i18n.js', "w")
        langFile.write(common.getJavaScriptStrings(False))
        langFile.close()

        if self.hasForum:
            manifest.save("discussionforum.xml")

        # Copy the style files to the output dir

        styleFiles = [self.styleDir/'..'/'popup_bg.gif']
        if package.get_addExeLink():
            styleFiles += [self.styleDir/'..'/'exe_powered_logo.png']
        # And with all the files of the style we avoid problems:
        styleFiles += self.styleDir.files("*.*")
        if self.scormType == "commoncartridge":
            for sf in styleFiles[:]:
                if sf.basename() not in manifest.dependencies:
                    styleFiles.remove(sf)
        self.styleDir.copylist(styleFiles, outputDir)

        listCSSFiles=getFilesCSSToMinify('scorm', self.styleDir)
        exportMinFileCSS(listCSSFiles, outputDir)

        # Copy the scripts

        dT = common.getExportDocType()
        if dT == "HTML5":
            #listFiles+=[self.scriptsDir/'exe_html5.js']
            #listOutFiles+=[outputDir/'exe_html5.js']
            jsFile = (self.scriptsDir/'exe_html5.js')
            jsFile.copyfile(outputDir/'exe_html5.js')

        # jQuery
        my_style = G.application.config.styleStore.getStyle(page.node.package.style)
        if my_style.hasValidConfig():
            if my_style.get_jquery() == True:
                #listFiles+=[self.scriptsDir/'exe_jquery.js']
                #listOutFiles+=[outputDir/'exe_jquery.js']
                jsFile = (self.scriptsDir/'exe_jquery.js')
                jsFile.copyfile(outputDir/'exe_jquery.js')
        else:
            #listFiles+=[self.scriptsDir/'exe_jquery.js']
            #listOutFiles+=[outputDir/'exe_jquery.js']
            jsFile = (self.scriptsDir/'exe_jquery.js')
            jsFile.copyfile(outputDir/'exe_jquery.js')

        if self.scormType == "commoncartridge" or self.scormType == "scorm2004" or self.scormType == "scorm1.2":
            listFiles=getFilesJSToMinify('scorm', self.scriptsDir)

        exportMinFileJS(listFiles, outputDir)

        if self.scormType == "scorm2004" or self.scormType == "scorm1.2":
            self.scriptsDir.copylist(('SCORM_API_wrapper.js',
                                      'SCOFunctions.js'), outputDir)

        # about SCHEMAS:
        schemasDir = ""
        if self.scormType == "scorm1.2":
            schemasDir = self.schemasDir/"scorm1.2"
            schemasDir.copylist(('imscp_rootv1p1p2.xsd',
                                'imsmd_rootv1p2p1.xsd',
                                'adlcp_rootv1p2.xsd',
                                'lom.xsd',
                                'lomCustom.xsd',
                                'ims_xml.xsd'), outputDir)
        elif self.scormType == "scorm2004":
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
        hasFX             = False
        hasSH             = False
        hasGames          = False
        hasElpLink        = False
        hasWikipedia      = False
        isBreak           = False
        hasInstructions   = False
        hasMediaelement   = False
        hasTooltips       = False
        hasABCMusic       = False
        listIdevicesFiles = []

        for page in self.pages:
            if isBreak:
                break
            for idevice in page.node.idevices:
                if (hasFlowplayer and hasMagnifier and hasXspfplayer and hasGallery and hasFX and hasSH and hasGames and hasElpLink and hasWikipedia and hasInstructions and hasMediaelement and hasTooltips and hasABCMusic):
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
                if not hasElpLink:
                    hasElpLink = common.ideviceHasElpLink(idevice,package)
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
                if hasattr(idevice, "_iDeviceDir"):
                    listIdevicesFiles.append((idevice.get_jsidevice_dir()/'export'))

            common.exportJavaScriptIdevicesFiles(page.node.idevices, outputDir);

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
            # Add game js string to common_i18n
            langGameFile = open(outputDir + '/common_i18n.js', "a")
            langGameFile.write(common.getGamesJavaScriptStrings(False))
            langGameFile.close()
        if hasElpLink or package.get_exportElp():
            # Export the elp file
            currentPackagePath = Path(package.filename)
            currentPackagePath.copyfile(outputDir/package.name+'.elp')
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
        if hasTooltips:
            exe_tooltips = (self.scriptsDir/'exe_tooltips')
            exe_tooltips.copyfiles(outputDir)
        if hasABCMusic:
            pluginScripts = (self.scriptsDir/'tinymce_4/js/tinymce/plugins/abcmusic/export')
            pluginScripts.copyfiles(outputDir)
        ext = ".html"
        if G.application.config.cutFileName == "1":
            ext = ".htm"

        if self.scormType == "scorm1.2" or self.scormType == "scorm2004":
            if package.license == "license GFDL":
                # include a copy of the GNU Free Documentation Licence
                (self.templatesDir/'fdl' + ext).copyfile(outputDir/'fdl' + ext)

        if hasattr(package, 'scowsinglepage') and package.scowsinglepage:
            page = SinglePage("singlepage_index", 1, package.root)
            page.save(outputDir/"singlepage_index" + ext)
            # Incluide eXe's icon if the Style doesn't have one
            themePath = Path(G.application.config.stylesDir/package.style)
            themeFavicon = themePath.joinpath("favicon.ico")
            if not themeFavicon.exists():
                faviconFile = (self.imagesDir/'favicon.ico')
                faviconFile.copyfile(outputDir/'favicon.ico')
        if hasattr(package, 'scowwebsite') and package.scowwebsite:
            website = WebsiteExport(self.config, self.styleDir, outputDir, "website_")
            website.export(package)
            (self.styleDir/'nav.css').copyfile(outputDir/'nav.css')
            # Incluide eXe's icon if the Style doesn't have one
            themePath = Path(G.application.config.stylesDir/package.style)
            themeFavicon = themePath.joinpath("favicon.ico")
            if not themeFavicon.exists():
                faviconFile = (self.imagesDir/'favicon.ico')
                faviconFile.copyfile(outputDir/'favicon.ico')
        if hasattr(package, 'exportSource') and package.exportSource:
            (G.application.config.webDir/'templates'/'content.xsd').copyfile(outputDir/'content.xsd')
            (outputDir/'content.data').write_bytes(encodeObject(package))
            (outputDir/'contentv3.xml').write_bytes(encodeObjectToXML(package))
        # Copy the accessibility toolbar files to the output dir
        if package.get_addAccessibilityToolbar():            
            addAccessibilityToolbarFiles = (self.scriptsDir / 'exe_atools')
            addAccessibilityToolbarFiles.copyfiles(outputDir)

        # Zip it up!
        self.filename.safeSave(self.doZip, _('EXPORT FAILED!\nLast succesful export is %s.'), outputDir)
        # Clean up the temporary dir
        outputDir.rmtree()


        return modifiedMetaData

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
                fn = Path(os.path.join(base, file))
                if fn[:4] == '\\\\?\\': # device_namespace_prefix in windows
                    filename = fn[5:][outputlen].encode('utf8')
                else:
                    filename = fn[outputlen:].encode('utf8')
                zipped.write(fn, filename, ZIP_DEFLATED)
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
