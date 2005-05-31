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
An iDevice built up from simple fields.
"""

import logging
from exe.engine.persist import Persistable
from exe.engine.path    import Path
from exe.engine.idevice import Idevice
import gettext
_ = gettext.gettext
log = logging.getLogger(__name__)


# ===========================================================================
# TODO merge these field classes with the ones used by the Idevice Editor
class Field(Persistable):
    """
    A Generic iDevice is built up of these fields.  Each field can be
    rendered as an XHTML element
    """
    def __init__(self, name, fieldType=None, class_="", 
                 instruction="", content=""):
        """
        Initialize 
        """
        self.name        = name
        self.fieldType   = fieldType
        self.content     = content
        self.class_      = class_
        self.instruction = instruction

    def __cmp__(self, other):
        """
        Compare fields by their name, so they can be searched for in 
        GenericIdevice
        """
        return cmp(self.name, other.name)


    def setContent(self, idevice, content):
        """
        Modify content, overridden for special behaviour
        """
        self.content = content

# ===========================================================================
class ImageField(Field):
    """
    A Generic iDevice is built up of these fields.  Each field can be
    rendered as an XHTML element
    """
    def __init__(self, name, fieldType=None, class_="", 
                 instruction="", content=""):
        """
        """
        Field.__init__(self, name, fieldType, class_, instruction, content)


    def setContent(self, idevice, content):
        """
        store the image pointed to by content in the package
        """
        # TODO This is gross misuse of the content property
        # rethink how I'm doing this
        resourceFile = Path(content)
        if resourceFile.isfile():
            self.content = idevice.addResource(resourceFile)
        else:
            log.error('File %s is not a file' % resourceFile)



# ===========================================================================
class GenericIdevice(Idevice):
    """
    A generic Idevice is one built up from simple fields... as such it
    can have a multitude of different forms all of which are just simple
    XHTML fields.
    """
    def __init__(self, title, class_, author, purpose, tip):
        """
        Initialize 
        """
        Idevice.__init__(self, title, author, purpose, tip, "generic")
        self.class_    = class_
        if class_ in ("objectives", "activity", "reading", "preknowledge"):
            self.icon = class_
        self.fields    = []


    def addField(self, name, fieldType, class_, instruction="", content=""):
        """
        Add a new field to this iDevice.  Fields are indexed by their name.
        """
        # TODO use a factory!!!
        if fieldType == "Image":
            self.fields.append(ImageField(name, fieldType, class_, 
                                          instruction, content)) 
        else:
            self.fields.append(Field(name, fieldType, class_, 
                                     instruction, content)) 

    def __setitem__(self, name, value):
        key   = Field(name)
        index = self.fields.index(key)
        self.fields[index].setContent(self, value)


    def __getitem__(self, name):
        key   = Field(name)
        index = self.fields.index(key)
        return self.fields[index].content


    def __iter__(self):
        return iter(self.fields)


    def upgradeToVersion1(self):
        """
        Upgrades the node from version 0 to 1.
        Old packages will loose their icons, but they will load.
        """
        log.debug("Upgrading iDevice")
        if self.class_ in ("objectives", "activity", "reading", "preknowledge"):
            self.icon = class_
        else:
            self.icon = "generic"

# ===========================================================================
