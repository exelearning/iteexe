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
from exe.engine.uid  import UIDGenerator
log = logging.getLogger(__name__)

# ===========================================================================
class Manifest(object):
    """
    Represents an imsmanifest xml file
    """
    def __init__(self, outdir, package, addMetadata=True):
        """
        Initialize
        'outdir' is the directory that we read the html from and also output the mainfest.xml
        """
        self.outdir      = outdir
        self.package     = package
        self.addMetadata = addMetadata
        self.title       = str(package.root.title)
        self.node        = package.root
        self.xmlStr      = ""
        self.name        = package.name
        self.author      = package.author
        self.desc        = package.description
        self.idGenerator = UIDGenerator(package.name)
        self.itemStr     = ""
        self.resStr      = ""

    def save(self):
        """
        Save a imsmanifest file to self.outdir
        """
        filename = "imsmanifest.xml"
        out = open(self.outdir / filename, "w")
        out.write(self.createXML())
        out.close()
        
    def createXML(self):
        """
        returning XLM string for manifest file
        """
        manifestId = str(self.idGenerator.generate())
        orgId      = str(self.idGenerator.generate())
        
        xmlStr = """<?xml version="1.0" encoding="UTF-8"?>
        <manifest identifier="%s" 
        xmlns="http://www.imsglobal.org/xsd/imscp_v1p1" 
        xmlns:imsmd="http://www.imsglobal.org/xsd/imsmd_v1p2" 
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        """ % manifestId 

        if self.addMetadata:
            xmlStr += "xmlns:dc=\"http://purl.org/dc/elements/1.1/\" \n"
            
        xmlStr += "xmlns:adlcp=\"http://www.adlnet.org/xsd/adlcp_rootv1p2\" "
        xmlStr += "xsi:schemaLocation=\"http://www.imsglobal.org/xsd/"
        xmlStr += "imscp_v1p1 imscp_v1p1.xsd \n"        
        xmlStr += "http://www.imsglobal.org/xsd/imsmd_v1p2 imsmd_v1p2p2.xsd\""
        xmlStr += "> \n"
        xmlStr += "<metadata> \n"
        xmlStr += " <schema>IMS Content</schema> \n"
        xmlStr += "<schemaversion>1.1.3</schemaversion> \n"

        if self.addMetadata:
            xmlStr += "<dc:title>"+self.title+"</dc:title>\n"
            xmlStr += "<dc:creator>"+self.author+"</dc:creator>\n"
            xmlStr += "<dc:description>"+self.desc+"</dc:description>\n"
            xmlStr += "<dc:language>en-US</dc:language>\n"

        xmlStr += "</metadata> \n"
        xmlStr += "<organizations default=\""+orgId+"\">  \n"
        xmlStr += "<organization identifier=\""+orgId
        xmlStr += "\" structure=\"hierarchical\">  \n"
        xmlStr += " <title>"+self.title+"</title> \n "
        
        
        self.genItemResStr(self.node)
        
        xmlStr += self.itemStr
        xmlStr += """
            </organization>
        </organizations>
    <resources>
        """
        xmlStr += self.resStr
        xmlStr += "</resources>\n</manifest>\n"
        return xmlStr
        
            
    def genItemResStr(self, node):
        """
        Returning xlm string for items and resources
        """
        itemId = str(self.idGenerator.generate())
        resId  = str(self.idGenerator.generate())
        if node is node.package.root:
            filename = "index.html"
        else:
            filename = node.id + ".html"
            
        
        self.itemStr += """
            <item identifier="ITEM-%s" isvisible="true" identifierref="RES-%s">
                <title>%s</title>
            """ %(itemId, resId, str(node.title))
        
        self.resStr += """
            <resource identifier="RES-%s" type="webcontent" adlcp:scormType="sco"
             href="%s">
                <file href="%s"/>
                <file href="content.css"/>
                <file href="APIWrapper.js"/>
                <file href="SCOFunctions.js"/>
                """ %(resId, filename, filename)
        fileStr = ""
        # TODO: Fix this hack with some real object-orientated code
        # TODO: Should parse html files to find references to images
        for pngFile in self.outdir.glob("*.png"):
            fileStr += "                <file href=\""+pngFile.basename()+"\"/>\n"
        for gifFile in self.outdir.glob("*.gif"):
            fileStr += "                <file href=\""+gifFile.basename()+"\"/>\n"
                    
        self.resStr += fileStr
        self.resStr += "            </resource>\n"

        for child in node.children:
            self.genItemResStr(child)
        
        self.itemStr += "            </item>\n"
            
#===============================================================================
