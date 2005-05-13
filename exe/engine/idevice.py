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
The base class for all iDevices
"""

import copy
import logging
from twisted.spread  import jelly
from twisted.persisted.styles import Versioned

log = logging.getLogger(__name__)

# ===========================================================================
class Idevice(jelly.Jellyable, jelly.Unjellyable, Versioned):
    """
    The base class for all iDevices
    iDevices are mini templates which the user uses to create content in the 
    package
    """
    nextId = 1
    NoEmphasis, SomeEmphasis, StrongEmphasis = range(3)

    def __init__(self, title, author, purpose, tip, parentNode=None):
        """Initialize a new iDevice, setting a unique id"""
        self.edit       = True
        self.emphasis   = Idevice.NoEmphasis
        self.version    = 0
        self.id         = str(Idevice.nextId)
        Idevice.nextId += 1
        self.parentNode = parentNode
        self.title      = title
        self.author     = author
        self.purpose    = purpose
        self.tip        = tip
        self.emphasis   = Idevice.NoEmphasis


    def __cmp__(self, other):
        return cmp(self.id, other.id)


    def clone(self):
        """
        Clone an iDevice just like this one
        """
        #I'm thinking I should override __deepcopy__, but I just don't get it
        newIdevice    = copy.deepcopy(self)
        newIdevice.id = str(Idevice.nextId)
        Idevice.nextId += 1
        return newIdevice

        
    def delete(self):
        """delete an iDevice from it's parentNode"""
        if self.parentNode:
            self.parentNode.idevices.remove(self)
            self.parentNode = None


    def getStateFor(self, jellier):
        """
        Call Versioned.__getstate__ to store
        persistenceVersion etc...
        """
        return self.__getstate__()


    def isFirst(self):
        """
        Return true if this is the first iDevice in this node
        """
        index = self.parentNode.idevices.index(self)
        return index == 0


    def isLast(self):
        """
        Return true if this is the last iDevice in this node
        """
        index = self.parentNode.idevices.index(self)
        return index == len(self.parentNode.idevices) - 1


    def movePrev(self):
        """
        Move to the previous position
        """
        parentNode = self.parentNode
        index = parentNode.idevices.index(self)
        if index > 0:
            temp = parentNode.idevices[index - 1]
            parentNode.idevices[index - 1] = self
            parentNode.idevices[index]     = temp


    def moveNext(self):
        """
        Move to the next position
        """
        parentNode = self.parentNode
        index = parentNode.idevices.index(self)
        if index < len(parentNode.idevices) - 1:
            temp = parentNode.idevices[index + 1]
            parentNode.idevices[index + 1] = self
            parentNode.idevices[index]     = temp


    def setParentNode(self, parentNode):
        """
        Change parentNode
        """
        self.delete()
        parentNode.addIdevice(self)

# ===========================================================================
