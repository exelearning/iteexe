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

import sys
import logging
import gettext
import os.path
from exe.webui.webinterface import g_webInterface
import os
import zipfile
import glob
log = logging.getLogger(__name__)

# ===========================================================================
class Manifest(object):
    def __init__(self, package):
        self.title       = str(package.root.title)
        self.node        = package.root
        self.xmlStr      = ""
        self.name        = package.name
        self.author      = package.author
        self.description = package.description

    def save(self):
        """
        save a imsmanifest file and zip it with html files
        """
        filename = "imsmanifest.xml"
        out = open(filename, "w")
        out.write(self.createXML())
        out.close()
        
        os.chdir("..")
        zipFileName = self.name + ".zip"
        zipFile = zipfile.ZipFile(zipFileName, "w")
        for name in glob.glob(self.name+"/*"):
            zipFile.write(name, os.path.basename(name), zipfile.ZIP_DEFLATED)
            
        zipFile.close()
            
        
    def createXML(self):
        """
        returning XLM string for manifest file
        """
        
        self.xmlStr += """<?xml version="1.0" encoding="UTF-8"?>
    <manifest identifier="MANIFEST1" xmlns="http://www.imsglobal.org/xsd/imscp_v1p1" 
    xmlns:imsmd="http://www.imsglobal.org/xsd/imsmd_v1p2" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xsi:schemaLocation="http://www.imsglobal.org/xsd/imscp_v1p1 imscp_v1p1.xsd
    http://www.imsglobal.org/xsd/imsmd_v1p2 imsmd_v1p2p2.xsd">
       <metadata>      
           <schema>IMS Content</schema>
           <schemaversion>1.1.3</schemaversion>
           <dc:title>%s</dc:title>
           <dc:creator>%s</dc:creator>
           <dc:description>%s</dc:description>
           <dc:language>en-US</dc:language>
        </metadata>
        <organizations default="Toc1"> 
            <organization identifier="Toc1" structure="hierarchical"> 
             <title>%s</title> 
        """ % (self.title, self.author, self.description,self.title)
        
        self.xmlStr += self.getItemStr(self.node)
        self.xmlStr += """
            </organization>
        </organizations>
        <resources>
        """
        self.xmlStr += self.getResourseStr(self.node)
        self.xmlStr += "</resources> \n </manifest>\n"
        return self.xmlStr
        
            
    def getItemStr(self, node):
        """
        returning xlm string for items
        """
        itemStr = ""
        id = node.getIdStr().replace(".", "-")
        itemStr += """
            <item identifier="ITEM-%s" isvisible="true" identifierref="RESOURSE-%s">
                <title>%s</title>
            """ %(id, id, str(node.title))

        for child in node.children:
            itemStr += self.getItemStr(child)
        itemStr += "</item>"  
        
        return itemStr

    def getResourseStr(self, node):
        """
        Returning xml string for resourses
        """
        resStr = ""
        filename = node.getIdStr()+ ".html"
        id = node.getIdStr().replace(".", "-")
        resStr += """
            <resource identifier="RESOURSE-%s" type="webcontent" href="%s">
                <file href="%s"/>
            </resource>
            """ %(id, filename, filename)
            
        for child in node.children:
            resStr += self.getResourseStr(child)
        
        return resStr       
        
        
        
            
# ===========================================================================
