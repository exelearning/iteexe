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
Represents an imsmanifest xml file
"""

import logging
from exe.engine.uniqueidgenerator  import UniqueIdGenerator
log = logging.getLogger(__name__)

# ===========================================================================
class Manifest(object):
    """
    Represents an imsmanifest xml file
    """
    def __init__(self, config, outdir, package, pages,
                 addMetadata=True, addScormType=True):
        """
        Initialize
        'outdir' is the directory that we read the html from and also output
        the mainfest.xml 
        """
        self.outdir       = outdir
        self.package      = package
        self.addMetadata  = addMetadata
        self.addScormType = addScormType
        self.idGenerator  = UniqueIdGenerator(package.name, config.exePath)
        self.pages        = pages
        self.itemStr      = ""
        self.resStr       = ""


    def save(self):
        """
        Save a imsmanifest file to self.outdir
        """
        filename = "imsmanifest.xml"
        out = open(self.outdir/filename, "w")
        out.write(self.createXML())
        out.close()
        

    def createXML(self):
        """
        returning XLM string for manifest file
        """
        manifestId = unicode(self.idGenerator.generate())
        orgId      = unicode(self.idGenerator.generate())
        
        xmlStr = u"""<?xml version="1.0" encoding="UTF-8"?>
        <manifest identifier="%s" 
        xmlns="http://www.imsglobal.org/xsd/imscp_v1p1" 
        xmlns:imsmd="http://www.imsglobal.org/xsd/imsmd_v1p2" 
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
        """ % manifestId 

        if self.addMetadata:
            xmlStr += "xmlns:dc=\"http://purl.org/dc/elements/1.1/\" "
            
        if self.addScormType:
            xmlStr += "xmlns:adlcp=\"http://www.adlnet.org/xsd/adlcp_rootv1p2\""
            xmlStr += "\n "
        xmlStr += "xsi:schemaLocation=\"http://www.imsglobal.org/xsd/"
        xmlStr += "imscp_v1p1 imscp_v1p1.xsd "        
        xmlStr += "http://www.imsglobal.org/xsd/imsmd_v1p2 imsmd_v1p2p2.xsd\""
        xmlStr += "> \n"
        xmlStr += "<metadata> \n"
        xmlStr += " <schema>ADL SCORM</schema> \n"
        xmlStr += "<schemaversion>CAM 1.3</schemaversion> \n"

        title  = unicode(self.package.root.title)
        if self.addMetadata:
            author = self.package.author
            desc   = self.package.description
            xmlStr += "<dc:title>"+title+"</dc:title>\n"
            xmlStr += "<dc:creator>"+author+"</dc:creator>\n"
            xmlStr += "<dc:description>"+desc+"</dc:description>\n"
            xmlStr += "<dc:language>en-US</dc:language>\n"

        xmlStr += "</metadata> \n"
        xmlStr += "<organizations default=\""+orgId+"\">  \n"
        xmlStr += "<organization identifier=\""+orgId
        xmlStr += "\" structure=\"hierarchical\">  \n"
        xmlStr += "<title>"+title+"</title>\n"
        
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
        Returning xlm string for items and resources
        """
        itemId   = "ITEM-"+unicode(self.idGenerator.generate())
        resId    = "RES-"+unicode(self.idGenerator.generate())
        filename = page.name+".html"
            
        
        self.itemStr += "<item identifier=\""+itemId+"\" isvisible=\"true\" "
        self.itemStr += "identifierref=\""+resId+"\">\n"
        self.itemStr += "    <title>"+unicode(page.node.title)+"</title>\n"
        
        self.resStr += "<resource identifier=\""+resId+"\" "
        self.resStr += "type=\"webcontent\" "

        if self.addScormType:
            self.resStr += "adlcp:scormType=\"sco\" "
        self.resStr += "href=\""+filename+"\"> \n"
        self.resStr += """\
    <file href="%s"/>
    <file href="content.css"/>
    <file href="APIWrapper.js"/>
    <file href="SCOFunctions.js"/>""" %filename
        self.resStr += "\n"
        fileStr = ""

        # TODO: Fix this hack with some real object-orientated code
        # TODO: Should parse html files to find references to images
        for pngFile in self.outdir.glob("*.png"):
            fileStr += "    <file href=\""+pngFile.basename()+"\"/>\n"
        for gifFile in self.outdir.glob("*.gif"):
            fileStr += "    <file href=\""+gifFile.basename()+"\"/>\n"
        fileStr += '    <file href ="common.js"/>\n'
        fileStr += '    <file href ="libot_drag.js"/>\n'
        self.resStr += fileStr
        self.resStr += "</resource>\n"

            
#===============================================================================
