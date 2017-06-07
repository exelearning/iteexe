# -*- coding: utf-8 -*-
# ===========================================================================
# eXe 
# Copyright 2004-2006, University of Auckland
# Copyright 2006-2008 eXe Project, http://eXeLearning.org/
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
# ===========================================================================
# Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
# along with this program; if not, write to the Free Software

import chardet
import logging
from xml.dom              import minidom
from zipfile                   import ZipFile


log = logging.getLogger(__name__)

class Template():

    def __init__(self, templatePath):
        
        """
        Initialize 
        """
        log.debug(u"init " + repr(templatePath.basename()))

        self.file = templatePath.basename()
        self.filename = self.file.stripext()
        self.path = templatePath
        self._validConfig = False
        self._valid = False
        self._checkValid()

        if self._valid:
            # Get XML values from the config file
            xmlValues = self._loadTemplate()
            
            self._attributes = xmlValues
            self.name = xmlValues['name']

    def _loadTemplate(self):
        
        try:
            if self._valid:
                sourceZip = ZipFile(self.path, 'r')
                configxml = sourceZip.read('config.xml')
                
                try:
                    newconfigdata = configxml.decode()
                except UnicodeDecodeError:
                    configcharset = chardet.detect(configxml)
                    newconfigdata = configxml.decode(configcharset['encoding'], 'replace')
            
                xmlConfig = minidom.parseString(newconfigdata)
                
                template = xmlConfig.getElementsByTagName('template')
                                    
                # Initialize results variable
                result = dict()
                
                # If there is a main element tag
                if (len(template) > 0):
                    # Go over all the child nodes
                    for tag in template[0].childNodes:
                        if(isinstance(tag, minidom.Element)):
                            result.update({tag.tagName: tag.firstChild.nodeValue})
                    
                    if 'name' in result:
                        return result
        except:
            self._valid = False
    
    
    def _checkValid(self):
        
        sourceZip = ZipFile(self.path, 'r')
        namelist = sourceZip.namelist()
        
        if 'config.xml' in namelist and 'contentv3.xml' in namelist:
            self._valid = True
        else:
            self._valid = False

    def isValid(self):
        
        return self._valid

    def _renderProperties(self):
        
        properties = []     
        for attribute in self._attributes:
                value = self._attributes[attribute]
                properties.append({'name': attribute, 'value': value})
        return properties 
        
    def __cmp__(self, other):
        return cmp(self.name, other.name)    
# ===========================================================================
