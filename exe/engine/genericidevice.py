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

import logging
from exe.engine.idevice import Idevice
import gettext
_ = gettext.gettext
log = logging.getLogger(__name__)


# ===========================================================================
class Field(object):
    """
    A Generic iDevice is built up of these fields.  Each field can be
    rendered as an XHTML element
    """
    def __init__(self, name, fieldType=None, class_="", content=""):
        """
        Initialize 
        """
        self.name      = name
        self.fieldType = fieldType
        self.content   = content
        self.class_    = class_

    def __cmp__(self, other):
        """
        Compare fields by their name, so they can be searched for in 
        GenericIdevice
        """
        return cmp(self.name, other.name)


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
        Idevice.__init__(self, title, author, purpose, tip)
        self.class_    = class_
        self.fields    = []

    def addField(self, name, fieldType, class_, content=""):
        """
        Add a new field to this iDevice.  Fields are indexed by their name.
        """
        self.fields.append(Field(name, fieldType, class_, content))

    def __setitem__(self, name, value):
        key   = Field(name)
        index = self.fields.index(key)
        self.fields[index].content = value

    def __getitem__(self, name):
        key   = Field(name)
        index = self.fields.index(key)
        return self.fields[index].content

    def __iter__(self):
        return iter(self.fields)


# ===========================================================================
