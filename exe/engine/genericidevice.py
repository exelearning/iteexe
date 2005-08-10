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

from exe.engine.idevice import Idevice
# For backward compatibility Jelly expects to find a Field class
from exe.engine.field   import Field, TextField, TextAreaField
import logging
import gettext
_ = gettext.gettext
log = logging.getLogger(__name__)


# ===========================================================================
class GenericIdevice(Idevice):
    """
    A generic Idevice is one built up from simple fields... as such it
    can have a multitude of different forms all of which are just simple
    XHTML fields.
    """
    persistenceVersion = 4
    
    def __init__(self, title, class_, author, purpose, tip):
        """
        Initialize 
        """
        Idevice.__init__(self, title, author, purpose, tip, "generic")
        self.class_    = class_
        if class_ in ("objectives", "activity", "reading", "preknowledge"):
            self.icon = class_
        self.fields    = []


    def clone(self):
        """
        Clone a Generic iDevice just like this one
        """
        miniMe = Idevice.clone(self)
        for field in miniMe.fields:
            field.idevice = miniMe
        return miniMe


    def addField(self, field):
        """
        Add a new field to this iDevice.  Fields are indexed by their id.
        """
        if field.idevice:
            log.error(u"Field already belonging to "+field.idevice.title+
                      u" added to "+self.title)
        field.idevice = self
        self.fields.append(field)


    def __iter__(self):
        return iter(self.fields)

 
    def getResources(self):
        """
        Return the resource files used by this iDevice
        """
        resources = Idevice.getResources(self) + ["common.js", "lib_drag.js"]
        for field in self.fields:
            resources += field.getResources()
        return resources
    

    def delete(self):
        """
        Delete the fields when this iDevice is deleted
        """
        for field in self.fields:
            field.delete()
        Idevice.delete(self)
       

    def upgradeToVersion1(self):
        """
        Upgrades the node from version 0 (eXe version 0.4) to 1.
        Adds icon
        """
        log.debug("Upgrading iDevice")
        if self.class_ in ("objectives", "activity", "reading", "preknowledge"):
            self.icon = self.class_
        else:
            self.icon = "generic"


    def upgradeToVersion2(self):
        """
        Upgrades the node from version 1 (not released) to 2
        Use new Field classes
        """
        oldFields   = self.fields
        self.fields = []
        for oldField in oldFields:
            if oldField.fieldType == "Text":
                self.addField(TextField(oldField.name,
                                        oldField.instruction,
                                        oldField.content))
            elif oldField.fieldType == "TextArea":
                self.addField(TextAreaField(oldField.name,
                                            oldField.instruction,
                                            oldField.content))
            else:
                log.error(u"Unknown field type in upgrade "+oldField.fieldType)


    def upgradeToVersion3(self):
        """
        Upgrades the node from 2 (v0.5) to 3 (v0.6).
        Old packages will loose their icons, but they will load.
        """
        log.debug(u"Upgrading iDevice")
        self.emphasis = Idevice.SomeEmphasis


    def upgradeToVersion4(self):
        """
        Upgrades v0.6 to v0.7.
        """
        self.lastIdevice = False

# ===========================================================================
