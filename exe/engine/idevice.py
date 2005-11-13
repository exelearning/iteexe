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
from exe.engine.persist import Persistable
from exe.engine.translate import lateTranslate

log = logging.getLogger(__name__)

# ===========================================================================
class Idevice(Persistable):
    """
    The base class for all iDevices
    iDevices are mini templates which the user uses to create content in the 
    package
    """

    # Class attributes
    # see derieved classes for persistenceVersion 
    nextId = 1
    NoEmphasis, SomeEmphasis, StrongEmphasis = range(3)

    def __init__(self, title, author, purpose, tip, icon, parentNode=None):
        """Initialize a new iDevice, setting a unique id"""
        log.debug("Creating iDevice")
        self.edit        = True
        self.lastIdevice = True
        self.emphasis    = Idevice.NoEmphasis
        self.version     = 0
        self.id          = unicode(Idevice.nextId)
        Idevice.nextId  += 1
        self.parentNode  = parentNode
        self._title      = title
        self._author     = author
        self._purpose    = purpose
        self._tip        = tip
        self.icon        = icon

    # Properties
    def get_title(self):
        """
        Gives a nicely encoded and translated title that can be put inside
        xul labels (eg. <label value="my &quot;idevice&quot;">)
        """
        if self._title:
            title = _(self._title)
            title = title.replace('&', '&amp;') 
            title = title.replace('"', '&quot;')
            return title
        else:
            return u''

    def set_title(self, value):
        """
        Sets self._title
        """
        self._title = value

    title    = property(get_title, set_title)
    rawTitle = lateTranslate('title')
    author   = lateTranslate('author')
    purpose  = lateTranslate('purpose')
    tip      = lateTranslate('tip')

    def __cmp__(self, other):
        """
        Compare this iDevice with other
        """
        return cmp(self.id, other.id)


    def clone(self):
        """
        Clone an iDevice just like this one
        """
        log.debug("Cloning iDevice")
        newIdevice    = copy.deepcopy(self)
        newIdevice.id = unicode(Idevice.nextId)
        Idevice.nextId += 1
        return newIdevice

        
    def delete(self):
        """
        delete an iDevice from it's parentNode
        """
        if self.parentNode:
            self.parentNode.idevices.remove(self)
            self.parentNode = None


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


    def getResources(self):
        """
        Return the resource files used by this iDevice
        Overridden by derieved classes
        """
        if self.icon:
            return ["icon_"+self.icon+".gif"]
        else:
            return []


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
        if self.parentNode:
            self.parentNode.idevices.remove(self)
        parentNode.addIdevice(self)
        
    # Protected Methods

    def _upgradeIdeviceToVersion1(self):
        """
        Upgrades the Idevice class members fro version 0 to version 1.
        Should be called in derived classes.
        """
        self._title   = self.__dict__['title']
        self._author  = self.__dict__['author']
        self._purpose = self.__dict__['purpose']
        self._tip     = self.__dict__['tip']

# ===========================================================================
