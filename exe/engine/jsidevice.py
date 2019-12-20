# ===========================================================================
# eXe
# Copyright 2004-2006, University of Auckland
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
An JavaScript iDevice definition
"""

from exe.engine.idevice import Idevice
# For backward compatibility Jelly expects to find a Field class
from exe.engine.field                               import Field, TextField, TextAreaField, FeedbackField
from exe.engine.field                               import ImageField, AttachmentField
from exe.engine.path                                import Path
from exe.engine.exceptions.invalidconfigjsidevice   import InvalidConfigJsIdevice
from xml.dom                                        import minidom
import re
import logging
import os

# Initialize logger
log = logging.getLogger(__name__)

# ===========================================================================
class JsIdevice(Idevice):
    """
    A JavaScript Idevice definition
    """
    persistenceVersion = 1

    def __init__(self, iDeviceDir=None):
        """
        Initialize JS IDevice
        """
        self._iDeviceDir = str(iDeviceDir)

        self._valid         = False
        self._checkValid()

        if self._valid:

            # Get XML values from the config file
            xmlValues = self.__loadIdevice()
            # Add the values not present on the XML
            xmlValues = self.__fillIdeviceDefaultValues(xmlValues)

            self._attributes = xmlValues

            # xml node : [ label , 0=textfield 1=textarea , order into form]
            _attributespre ={
                   'title': ['Title',0,0],
                   'category': ['Category',0,1],
                   'css-class': ['CSS class',0,2],
                   'icon': ['Icon',0,3]
                   }

            self._attributes= sorted(_attributespre.items(), key=lambda t: t[1][2])

            # Initialize the IDevice instance
            Idevice.__init__(self, xmlValues['title'], xmlValues['author'], xmlValues['purpose'], xmlValues['tip'], xmlValues['icon'])

            # CSS class
            self.class_ = xmlValues['css-class']

            if 'category' in xmlValues:
                self.ideviceCategory = xmlValues['category']

            if 'icon' in xmlValues:
                self.icon = xmlValues['icon']


            # Initialize field arrays
            self.fields  = []
            self.nextFieldId = 0

            # Set IDevice emphasis
            self.emphasis = Idevice.SomeEmphasis

            # Add default JS Idevice fields
            self.__addDefaultFields()


    def __loadIdevice(self):
        """
        Load IDevice configuration from its config.xml file
        """
        try:
            if self._valid:
                # Check if the folder has a config.xml file
                configFile = Path(self._iDeviceDir + '/config.xml')
                if configFile.exists():
                    # Get config data
                    configData = open(configFile).read()
                    try:
                        newConfigData = configData.decode()
                    except UnicodeDecodeError:
                        configCharset = chardet.detect(configData)
                        newConfigData = configData.decode(configCharset['encoding'], 'replace')

                    # Parse the XML file
                    xmlConfig = minidom.parseString(newConfigData)

                    # Get main element
                    xmlIdevice = xmlConfig.getElementsByTagName('idevice')

                    # Initialize results variable
                    result = dict()

                    # If there is a main element tag
                    if (len(xmlIdevice) > 0):
                        # Go over all the child nodes
                        for tag in xmlIdevice[0].childNodes:
                            # Only process the node if it is an Element
                            # This means only tags get processed
                            if(isinstance(tag, minidom.Element)):
                                # Add the tag name and value to the result dictionary
                                result.update({tag.tagName: tag.firstChild.nodeValue})

                        if 'title' in result and 'css-class' in result:
                            return result
                        else:
                            raise InvalidConfigJsIdevice(Path(self._iDeviceDir).basename(), 'Mandatory fields not found.')
                else:
                    raise InvalidConfigJsIdevice(Path(self._iDeviceDir).basename(), 'config.xml file doesn\'t exist.')
        except IOError as ioerror:
            # If we can't load an iDevice, we simply continue with the rest (and log it)
            log.debug("iDevice " + Path(self._iDeviceDir).basename() + " doesn't appear to have a valid \"config.xml\" file")
            raise InvalidConfigJsIdevice(Path(self._iDeviceDir).basename(), ioerror.message)

    def _checkValid(self):
        config = Path(self._iDeviceDir)/'config.xml'
        edition = Path(self._iDeviceDir)/'edition'

        if config.exists() and edition.exists() :
            self._valid = True
        else:
            self._valid = False

    def isValid(self):
        return self._valid

    def clone(self):
        """
        Clone a JS iDevice just like this one
        """
        miniMe = Idevice.clone(self)
        for field in miniMe.fields:
            field.idevice = miniMe
        return miniMe

    # Add the iDevice default fields
    def __addDefaultFields(self):
        """ A JS iDevice only has a Textarea with no instructions """
        self.addField(TextAreaField(""))



    def addField(self, field):
        """
        Add a new field to this iDevice.  Fields are indexed by their id.
        """
        if field.idevice:
            log.error(u"Field already belonging to %s added to %s" %
                      (field.idevice.title, self.title))
        field.idevice = self
        self.fields.append(field)

    def getUniqueFieldId(self):
        """
        Returns a unique id (within this idevice) for a field
        of the form ii_ff where ii is the idevice and ff the field
        """
        self.calcNextFieldId()
        result = self.id + '_' + unicode(self.nextFieldId)
        self.nextFieldId += 1
        log.debug(u"UniqueFieldId: %s" % (result))
        return result

    def calcNextFieldId(self):
        """
        initializes nextFieldId if it is still 0
        """
        if not hasattr(self, 'nextFieldId'):
            self.nextFieldId = 0
        if self.nextFieldId == 0:
            log.debug(u"nextFieldId==0 for self.class_ %s" % (self.class_))
            maxId = 0
            for field in self.fields:
                if isinstance(field.id, unicode):
                    log.debug(u"** field.id = u: %s" % (field.id))
                    # only look at the part after the (last) underbar
                    c = field.id.split('_')
                    if int(c[-1]) > maxId:
                        maxId = int(c[-1])
                else:
                    log.error(u"** field.id is not unicode= %d" % (field.id))
                    if field.id > maxId:
                        maxId = field.id
            self.nextFieldId = maxId + 1

    def __iter__(self):
        return iter(self.fields)

    def getResourcesField(self, this_resource):
        """
        Implement the specific resource finding mechanism for these JS iDevices
        TODO: This is an exact copy from Generic iDevice
        """
        from exe.engine.field            import FieldWithResources
        if hasattr(self, 'fields'):
            # check through each of this idevice's fields,
            # to see if it is supposed to be there.
            for this_field in self.fields:
                if isinstance(this_field, FieldWithResources) \
                and hasattr(this_field, 'images') :
                    # field is capable of embedding resources
                    for this_image in this_field.images:
                        if hasattr(this_image, '_imageResource') \
                        and this_resource == this_image._imageResource:
                            return this_field

        # else, not found in the above loop:
        return None


    def getRichTextFields(self):
        """
        Like getResourcesField(), a general helper to allow nodes to search
        through all of their fields without having to know the specifics of each
        iDevice type.
        TODO: This is an exact copy from Generic iDevice
        """
        # All of Generic iDevice's rich-text fields are in... fields!
        # Some of the fields may NOT be rich-text, though,
        # so this needs a bit more parsing:
        fields_list = []

        from exe.engine.field            import FieldWithResources
        if hasattr(self, 'fields'):
            for this_field in self.fields:
                if isinstance(this_field, FieldWithResources):
                    fields_list.append(this_field)

        return fields_list

    def burstHTML(self, i):
        """
        takes a BeautifulSoup fragment (i) and bursts its contents to
        import this idevice from a CommonCartridge export
        TODO: This is an exact copy from Generic iDevice
        """
        # Generic Idevice, with content in fields[]:
        title = i.find(name='h2',
                attrs={'class' : 'iDeviceTitle' })
        self.title = title.renderContents().decode('utf-8')

        if self.class_ in ("objectives", "activity", "preknowledge", "generic"):
            inner = i.find(name='div',
                attrs={'class' : 'iDevice_inner' })
            inner_content = inner.find(name='div',
                    attrs={'id' : re.compile('^ta') })
            self.fields[0].content_wo_resourcePaths = \
                inner_content.renderContents().decode('utf-8')
            # and add the LOCAL resources back in:
            self.fields[0].content_w_resourcePaths = \
                self.fields[0].MassageResourceDirsIntoContent( \
                self.fields[0].content_wo_resourcePaths)
            self.fields[0].content = self.fields[0].content_w_resourcePaths

        elif self.class_ == "reading":
            readings = i.findAll(name='div', attrs={'id' : re.compile('^ta') })
            # should be exactly two of these:
            # 1st = field[0] == What to Read
            if len(readings) >= 1:
                self.fields[0].content_wo_resourcePaths = \
                        readings[0].renderContents().decode('utf-8')
                # and add the LOCAL resource paths back in:
                self.fields[0].content_w_resourcePaths = \
                    self.fields[0].MassageResourceDirsIntoContent( \
                        self.fields[0].content_wo_resourcePaths)
                self.fields[0].content = \
                    self.fields[0].content_w_resourcePaths
            # 2nd = field[1] == Activity
            if len(readings) >= 2:
                self.fields[1].content_wo_resourcePaths = \
                        readings[1].renderContents().decode('utf-8')
                # and add the LOCAL resource paths back in:
                self.fields[1].content_w_resourcePaths = \
                    self.fields[1].MassageResourceDirsIntoContent(\
                        self.fields[1].content_wo_resourcePaths)
                self.fields[1].content = \
                    self.fields[1].content_w_resourcePaths
            # if available, feedback is the 3rd field:
            feedback = i.find(name='div', attrs={'class' : 'feedback' , \
                    'id' : re.compile('^fb')  })
            if feedback is not None:
                self.fields[2].content_wo_resourcePaths = \
                    feedback.renderContents().decode('utf-8')
                # and add the LOCAL resource paths back in:
                self.fields[2].content_w_resourcePaths = \
                    self.fields[2].MassageResourceDirsIntoContent( \
                        self.fields[2].content_wo_resourcePaths)
                self.fields[2].content = \
                        self.fields[2].content_w_resourcePaths

    def __fillIdeviceDefaultValues(self, values):
        """
        Fill the values required for the IDevice contructor but not
        present on the config.xml
        """
        keys = ['title', 'author', 'purpose', 'tip', 'icon']

        for key in keys:
            if key not in values:
                values[key] = ''

        return values

    def getResourcesList(self, editMode = False, ordered = True, appendPath = True):
        """ Get a list of the iDevice resources """
        resources = list()

        # Check export resources
        export_resources_path = Path(self._iDeviceDir) / 'export'
        if export_resources_path.exists():
            for res in os.listdir(export_resources_path):
                if appendPath:
                    resources.append(str(Path(self._iDeviceDir).basename() + '/export/' + res))
                else:
                    resources.append(str(res))

        # Check edition resources
        edition_resources_path = Path(self._iDeviceDir) / 'edition'
        if(editMode) and edition_resources_path.exists():
            for res in os.listdir(edition_resources_path):
                if appendPath:
                    resources.append(str(Path(self._iDeviceDir).basename() + '/edition/' + res))
                else:
                    resources.append(str(res))

        # Order the list
        if(ordered):
            resources.sort(key = lambda x: x.split('/')[-1])

        return resources

    def get_export_folder(self):
        return self._exportFolder

    def get_dirname(self):
        return Path(self._iDeviceDir).basename()

    def get_jsidevice_dir(self):
        return Path(self._iDeviceDir)

    def renderProperties(self):
        properties = []
        for attribute in self._attributes:

            if attribute[0] == 'css-class':
                value = self.class_
            elif attribute[0] == 'category':
                value = self.ideviceCategory
            else:
                value = getattr(self, attribute[0])
            name = attribute[1][0]
            properties.append({'name': _(name), 'value': value})

        return properties
# ===========================================================================
