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
    persistenceVersion = 1

    def __init__(self, package, parent=None, title=""):
        if parent:
            assert parent is not package.draft, "Draft can't have child nodes"
            assert parent is not package.editor, "Editor can't have child nodes"
            parent.children.append(self)
        package._regNewNode(self) # Sets self.id and self.package
        self.parent   = parent
        self.title    = TitleIdevice(self, title)
        self.children = []
        self.idevices = []

    # Properties

    # id
    def getId(self): return self._id
    id = property(getId)

    # level
    def getLevel(self): return len(list(self.ancestors()))
    level = property(getLevel)

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
        Moves the node around in the tree
        """
        if self.parent is not newParent:
            if newParent:
                assert newParent.package is self.package, \
                       "Can't change a node into a different package"
            if self.parent: self.parent.children.remove(self)
            self.parent = newParent
            if newParent:
                c = newParent.children
                if nextSibling: c.insert(c.index(nextSibling), self)
                else: newParent.children.insert(0, self)

    def __str__(self):
        """
        Return a node as a string
        """
        nodeStr = ""
        nodeStr += self.id + " "
        nodeStr += self.title.title + "\n"
        for child in self.children:
            nodeStr += child.__str__()
        return nodeStr
        
# ===========================================================================
