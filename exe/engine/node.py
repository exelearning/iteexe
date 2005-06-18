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
Nodes provide the structure to the package hierarchy
"""

import logging
from exe.engine.persist import Persistable
from exe.engine.titleidevice import TitleIdevice

log = logging.getLogger(__name__)

# ===========================================================================
class Node(Persistable):
    """
    Nodes provide the structure to the package hierarchy
    """

    # Class attributes
    persistenceVersion = 1

    def __init__(self, package, parent=None, title=""):
        if parent:
            parent.children.append(self)
        self._package = package
        self._id      = package._regNewNode(self)
        self.parent   = parent
        self._title   = TitleIdevice(self, title)
        self.children = []
        self.idevices = []

    # Properties

    # id
    def getId(self):
        """
        Returns our id.
        Used property to make it read only
        """
        return self._id
    id = property(getId)


    # package
    def getPackage(self):
        """
        Returns our package.
        Makes it read only
        """
        return self._package
    package = property(getPackage)


    # level
    def getLevel(self):
        """
        Calculates and returns our current level
        """
        return len(list(self.ancestors()))
    level = property(getLevel)


    # title
    def getTitle(self):
        """
        Returns our title as a string
        """
        return unicode(self._title)


    def setTitle(self, title):
        """
        Allows one to set the title as a string
        """
        if title != unicode(self._title):
            self._title.setTitle(title)
            self.package.isChanged = True
    title = property(getTitle, setTitle)


    # titleIDevice
    def getTitleIDevice(self):
        """Returns our title idevice"""
        return self._title
    titleIdevice = property(getTitleIDevice)


    # Normal methods

    def ancestors(self):
        """Iterates over our ancestors"""
        if self.parent: # All top level nodes have no ancestors
            node = self
            while node is not self.package.root:
                node = node.parent
                yield node


    def isAncestorOf(self, node):
        """If we are an ancestor of 'node' returns 'true'"""
        return node in self.ancestors()


    def getResources(self):
        """
        Return the resource files used by this node
        """
        resources = {}
        for idevice in self.idevices:
            for resource in idevice.getResources():
                resources[resource] = True

        return resources.keys()


    def createChild(self):
        """
        Create a child node
        """
        self.package.isChanged = True
        return Node(self.package, self)


    def delete(self):
        """
        Delete a node with all its children
        """
        # Remove ourself from the id dict and our parents child thing
        del self.package._nodeIdDict[self.id]
        if self.parent:
            self.parent.children.remove(self)

        # Remove all children from package id-dict and our own children list
        while self.children:
            self.children[0].delete()

        while self.idevices:
            self.idevices[0].delete()
  
        self.package.isChanged = True


    def addIdevice(self, idevice):
        """
        Add the idevice to this node, sets idevice's parentNode 
        """
        idevice.id = self.package.getNewIdeviceId()
        idevice.parentNode = self
        for oldIdevice in self.idevices:
            oldIdevice.edit = False
        self.idevices.append(idevice)


    def move(self, newParent, nextSibling=None):
        """
        Moves the node around in the tree.
        nextSibling can be a node object or an integer index
        """
        if newParent:
            assert newParent.package is self.package, \
                   "Can't change a node into a different package"
        if self.parent:
            self.parent.children.remove(self)
        self.parent = newParent
        if newParent:
            children = newParent.children
            if nextSibling: 
                if type(nextSibling) is int:
                    children.insert(nextSibling, self)
                else:
                    children.insert(children.index(nextSibling), self)
            else: newParent.children.append(self)

        self.package.isChanged = True


    def promote(self):
        """Convenience function.
        Moves the node one step closer to the tree root.
        Returns True is successful
        """
        if self.parent and self.parent.parent:
            self.move(self.parent.parent, None)
            return True

        return False


    def demote(self):
        """Convenience function.
        Moves the node one step further away from its parent,
        tries to keep the same position in the tree.
        Returns True is successful
        """
        if self.parent:
            idx = self.parent.children.index(self)
            if idx > 0:
                newParent = self.parent.children[idx - 1]
                self.move(newParent)
                return True

        return False


    def up(self):
        """Moves the node up one node vertically
        keeping its same level in the tree.
        Returns True is successful.
        """
        if self.parent:
            children = self.parent.children
            i = children.index(self)
            if i > 0:
                children.remove(self)
                children.insert(i-1, self)
                # Mark the package as changed
                self.package.isChanged = True
                return True

        return False


    def down(self):
        """Moves the node down one vertically
        keeping its level the same.
        Returns True is successful.
        """
        if self.parent:
            children = self.parent.children
            i = children.index(self)
            children.remove(self)
            children.insert(i+1, self)
            # Mark the package as changed
            self.package.isChanged = True
            return True

        return False


    def nextSibling(self):
        """Returns our next sibling or None"""
        if self.parent:
            children = self.parent.children
            i = children.index(self) + 1
            return i < len(children) and children[i] or None
        else:
            return None


    def __str__(self):
        """
        Return a node as a string
        """
        nodeStr = ""
        nodeStr += self.id + u" "
        nodeStr += self.title + u"\n"

        for child in self.children:
            nodeStr += child.__str__()

        return nodeStr


    def upgradeToVersion1(self):
        """Upgrades the node from version 0 to 1."""
        self._title = self.__dict__[u'title']
        
# ===========================================================================
