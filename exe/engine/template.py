# ===========================================================================
# eXe 
# Copyright 2017, CeDeC
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

import chardet
import logging
from xml.dom              import minidom
from zipfile              import ZipFile

import collections
if hasattr(collections, 'OrderedDict'):
    OrderedDict = collections.OrderedDict
else:
    import ordereddict
    OrderedDict = ordereddict.OrderedDict

log = logging.getLogger(__name__)

class Template():
    """
    Base class for all content templates
    """
    def __init__(self, template_path):
        """
        Initialize
        """
        log.debug(u"init " + repr(template_path.basename()))

        # Initialize base properties
        self.file = template_path.basename()
        self.filename = self.file.stripext()
        self.path = template_path
        self._validConfig = False
        self._valid = False
        self._checkValid()

        if self._valid:
            # Get XML values from the config file
            xml_values = self._loadTemplate()
            
            self._attributes = xml_values
            self.name = xml_values['name']
            
            # xml node : [ label , 0=textfield 1=textarea , order into form]
            _attributespre ={
                   'name': ['Name',0,0]
                   }
    
            self._attributes= OrderedDict(sorted(_attributespre.items(), key=lambda t: t[1][2]))
            

    def _loadTemplate(self):
        """
        Load template information from its XML config file
        """
        try:
            # Only try to load it if it's a valid template
            if self._valid:
                source_zip = ZipFile(self.path, 'r')
                configxml = source_zip.read('config.xml')
                
                try:
                    newconfigdata = configxml.decode()
                except UnicodeDecodeError:
                    configcharset = chardet.detect(configxml)
                    newconfigdata = configxml.decode(configcharset['encoding'], 'replace')

                xml_config = minidom.parseString(newconfigdata)

                # Initialize results variable
                result = dict()

                # Get main <template> tag
                template_tag = xml_config.getElementsByTagName('template')
                
                # If there is a main element tag
                if len(template_tag) > 0:
                    # Go over all the child nodes
                    for tag in template_tag[0].childNodes:
                        if isinstance(tag, minidom.Element):
                            result.update({tag.tagName: tag.firstChild.nodeValue})
                    
                    if 'name' in result:
                        return result
        except:
            self._valid = False
    
    def _checkValid(self):
        """
        Perform basic checks to ensure the template is valid 
        """
        source_zip = ZipFile(self.path, 'r')
        namelist = source_zip.namelist()
        
        # To be valid it must have a config.xml and a contentv3.xml
        # Further checks regarding config.xml will be done when trying to load it
        if 'config.xml' in namelist and 'contentv3.xml' in namelist:
            self._valid = True
        else:
            self._valid = False

    def isValid(self):
        """
        Returns True if the template is valid, False otherwise
        """
        return self._valid

    def _renderProperties(self):
        """
        Returns a list of all the template properties
        """
        properties = []
        for attribute in self._attributes.keys():
            value = getattr(self, attribute)
            properties.append({'name': _(self._attributes[attribute][0]), 'value': value})

        return properties 
        
    def __cmp__(self, other):
        """
        Compare two templates with each other
        """
        return cmp(self.name, other.name)    
