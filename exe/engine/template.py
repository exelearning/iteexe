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
from exe.engine.path           import Path, TempDirPath, toUnicode

import collections
if hasattr(collections, 'OrderedDict'):
    OrderedDict = collections.OrderedDict
else:
    from . import ordereddict
    OrderedDict = ordereddict.OrderedDict

log = logging.getLogger(__name__)

class Template():
    """
    Base class for all content templates
    """
    persistenceVersion = 1

    def __init__(self, template_path):
        """
        Initialize
        """
        log.debug('Template init: ' + repr(template_path.basename()))

        # Initialize base properties
        self.file = template_path.basename()
        self.filename = self.file.stripext()
        self.path = template_path
        self._validConfig = False
        self._valid = False

        self._name = ''
        self._is_base_template = False
        self._author = ''
        self._author_url = ''

        self._checkValid()

        xml_values = None
        if self._valid:
            # Get XML values from the config file
            xml_values = self._loadTemplate()

        if self._valid and self._validConfig and xml_values is not None:
            self._attributes = xml_values

            # xml node : [ label , 0=textfield 1=textarea , order into form]
            _attributespre = {
                '_name': ['Name', 0, 0],
                '_author': ['Author', 0, 1],
                '_author_url': ['Author URL', 0, 2]
            }

            for attr in list(xml_values.keys()):
                internal_attribute = '_' + attr.replace('-', '_')
                setattr(self, internal_attribute, xml_values[attr])

            # _is_base_template should be always a boolean
            if not type(self._is_base_template) is bool:
                self._is_base_template = bool(self._is_base_template)

            self._attributes = OrderedDict(sorted(list(_attributespre.items()), key=lambda t: t[1][2]))

    def get_name(self):
        """
        Get name property.
        """
        return _(self._name)
    
    def set_name(self, name):
        """
        Set new value for name property.
        """
        self._name = name

    def get_author(self):
        """
        Get author property.
        """
        return self._author
    
    def set_author(self, author):
        """
        Set new value for author property.
        """
        self._author = author

    def get_author_url(self):
        """
        Get author URL property.
        """
        return self._author_url
    
    def set_author_url(self, author_url):
        """
        Set new value for author URL property.
        """
        self._author_url = author_url
    
    # Template public properties
    name = property(get_name, set_name)
    author = property(get_author, set_author)
    author_url = property(get_author_url, set_author_url)

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
                        self._validConfig = True
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
        for attribute in list(self._attributes.keys()):
            value = getattr(self, attribute)
            properties.append({'name': _(self._attributes[attribute][0]), 'value': value})

        return properties 

    def __cmp__(self, other):
        """
        Compare two templates with each other
        """
        return cmp(self.name, other.name)

    def isEditable(self):
        """
        Returns True if the template is Editable
        """
        return not self._is_base_template

    def upgradeToVersion1(self):
        """
        Add author and author's URL
        """
        self._author = ''
        self._author_url = ''
