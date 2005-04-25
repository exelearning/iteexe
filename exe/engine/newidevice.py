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
from twisted.spread     import jelly
from exe.engine.idevice import Idevice
import gettext
_ = gettext.gettext
log = logging.getLogger(__name__)


# ===========================================================================
class NewField(jelly.Jellyable):
    """
    A New iDevice is built up of these newfields.  Each field can be
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
        self.showInstruc = False


# ===========================================================================
class NewIdevice(Idevice):
    """
    A new Idevice is one built up from new fields... as such it
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


    def addField(self, name, fieldType, class_, instruction="", content=""):
        """
        Add a new field to this iDevice. 
        """
        self.fields.append(NewField(name, fieldType, class_, 
                                    instruction, content)) 

   


# ===========================================================================
