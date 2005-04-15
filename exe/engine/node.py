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
from twisted.spread import jelly
from twisted.persisted.styles import Versioned
from exe.engine.titleidevice import TitleIdevice

log = logging.getLogger(__name__)

# ===========================================================================
class Node(object, jelly.Jellyable, jelly.Unjellyable, Versioned):
    """
    Nodes provide the structure to the package hierarchy
    """

    # Class attributes
    persistenceVersion = 2

    def __init__(self, package, parent=None, title=""):
        if parent:
            assert parent is not package.draft, "Draft can't have child nodes"
            assert parent is not package.editor, "Editor can't have child nodes"
            parent.children.append(self)
        package._regNewNode(self) # Sets self.id and self.package
        self.parent   = parent
        self._title   = TitleIdevice(self, title)
        self.children = []
        self.idevices = []

    # Properties

    # id
    def getId(self): return self._id
    id = property(getId)

    # level
    def getLevel(self): return len(list(self.ancestors()))
    level = property(getLevel)

    # title
    def getTitle(self): return str(self._title)
    def setTitle(self, title): self._title.setTitle(title)
    title = property(getTitle, setTitle)

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

    def getStateFor(self, jellier):
        """
        Call Versioned.__getstate__ to store
        persistenceVersion etc...
        """
        return self.__getstate__()

    def createChild(self):
        """
        Create a child node
        """
        return Node(self.package, self)

    def delete(self):
        """
        Delete a node with all its children
        """
        # Remove ourself from the id dict and our parents child thing
        del self.package._nodeIdDict[self.id]
        if self.parent: self.parent.children.remove(self)
        # Remove all our children from our package id-dict and our own children list
        while self.children: self.children[0].delete()

    def addIdevice(self, idevice):
        """
        Add the idevice to this node, sets idevice's parentNode 
        """
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
        if self.parent: self.parent.children.remove(self)
        self.parent = newParent
        if newParent:
            c = newParent.children
            if nextSibling: 
                if type(nextSibling) is int: c.insert(nextSibling, self)
                else: c.insert(c.index(nextSibling), self)
            else: newParent.children.append(self)

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
            c = self.parent.children
            i = c.index(self)
            if i > 0:
                c.remove(self)
                c.insert(i-1, self)
                return True
        return False

    def down(self):
        """Moves the node down one vertically
        keeping its level the same.
        Returns True is successful.
        """
        if self.parent:
            c = self.parent.children
            i = c.index(self)
            c.remove(self)
            c.insert(i+1, self)
            return True
        return False

    def nextSibling(self):
        """Returns our next sibling or None"""
        if self.parent:
            c = self.parent.children
            i = c.index(self) + 1
            return i < len(c) and c[i] or None
        else:
            return None

    def __str__(self):
        """
        Return a node as a string
        """
        nodeStr = ""
        nodeStr += self.id + " "
        nodeStr += self.title + "\n"
        for child in self.children:
            nodeStr += child.__str__()
        return nodeStr

    def upgradeToVersion2(self):
        self._title = self.__dict__['title']
        
# ===========================================================================
