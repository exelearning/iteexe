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
        self.title = str(package.root.title)
        self.node = package.root
        self.xmlStr = ""
        self.name = package.name

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
<!--This is a Reload version 2.0.1 SCORM 1.2 Content Package document-->
<!--Spawned from the Reload Content Package Generator - http://www.reload.ac.uk-->
<manifest xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2" xmlns:imsmd="http://www.imsglobal.org/xsd/imsmd_rootv1p2p1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2" identifier="MANIFEST-942DE505-084F-5979-5843-B76BFE75364E" xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
            <organizations default="Toc1"> 
                <organization identifier="Toc1" structure="hierarchical"> 
                 <title>%s</title> 
        """ % (self.title)
        
        self.xmlStr += self.getItemStr(self.node)
        self.xmlStr += """
            </organization>
        </organizations>
        <resourses>
        """
        self.xmlStr += self.getResourseStr(self.node)
        self.xmlStr += "</resourses> \n </manifest>\n"
        return self.xmlStr
        
            
    def getItemStr(self, node):
        """
        returning xlm string for items
        """
        itemStr = ""
        id = node.getIdStr().replace(".", "-")
        itemStr += """
            <item identifier="ITEM%s" isvisible="true" identifierref="RESOURSE%s">
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
            <resource identifier="RESOURSE%s" type="webcontent" 
            adlcp:scormtype="asset" href="%s">
                <file href="%s"/>
            </resource>
            """ %(id, filename, filename)
            
        for child in node.children:
            resStr += self.getResourseStr(child)
        
        return resStr       
        
        
        
            
# ===========================================================================
