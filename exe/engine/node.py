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
from twisted.spread  import jelly
from exe.engine.titleidevice import TitleIdevice

log = logging.getLogger(__name__)

# ===========================================================================
class Node(jelly.Jellyable):
    """
    Nodes provide the structure to the package hierarchy
    """
    def __init__(self, package, id=None, title=""):
        if id is None:
            self.id       = [0]
        else:
            self.id       = id
        self.package  = package
        self.parent   = None
        self.title    = TitleIdevice(self, title)
        self.children = []
        self.idevices = []


    def getIdStr(self):
        """
        Return the node's id as a string
        """
        return ".".join([str(index) for index in self.id])


    def isAncestorOf(self, other):
        """
        Returns true if other node is an ancestor (or actually is) this node
        """
        return self.id == other.id[:len(self.id)]


    def createChild(self):
        """
        Create a child node
        """
        child         = Node(self.package)
        child.id      = self.id + [len(self.children)]
        child.parent  = self
        self.children.append(child)
        return child


    def delete(self):
        """
        Delete a node with all its children
        """
        index  = self.id[-1]
        parent = self.parent
        del(parent.children[index])
        
        # update the ids for the siblings of this node
        for i in range(index, len(parent.children)):
            parent.children[i].id[-1] = i
            parent.children[i].__updateChildrenIds()
            

    def addIdevice(self, idevice):
        """
        Add the idevice to this node, sets idevice's parentNode 
        """
        idevice.parentNode = self
        for oldIdevice in self.idevices:
            oldIdevice.edit = False
        self.idevices.append(idevice)


    def movePrev(self):
        """
        Move to the previous position
        """
        index  = self.id[-1]
        parent = self.parent
        selfId = self.id
        if index > 0:
            temp = parent.children[index - 1]
            parent.children[index - 1]    = self 
            parent.children[index - 1].id = temp.id
            parent.children[index - 1].__updateChildrenIds()
            parent.children[index]        = temp
            parent.children[index].id     = selfId               
            parent.children[index].__updateChildrenIds()
            

    def moveNext(self):
        """
        Move to the next position
        """
        index  = self.id[-1]
        parent = self.parent
        selfId = self.id
        if index < len(parent.children) - 1:
            temp = parent.children[index + 1]
            parent.children[index + 1]     = self
            parent.children[index + 1].id  = temp.id
            parent.children[index + 1].__updateChildrenIds()
            parent.children[index]         = temp
            parent.children[index].id      = selfId            
            parent.children[index].__updateChildrenIds()
            

    def promote(self):
        """
        Move this node up a level
        """
        if len(self.id) > 2:
            parent      = self.parent
            grandParent = parent.parent
            grandParent.children.append(self)
            # delete the node in old position
            self.delete()
            self.parent = grandParent
            self.id = grandParent.id + [len(grandParent.children) - 1]
            self.__updateChildrenIds()


    def demote(self):
        """
        Move this node down a level
        """
        index = self.id[-1]
        if index > 0:
            oldParent = self.parent
            newParent = oldParent.children[index - 1]
            newParent.children.append(self)
            # delete the node in old position
            self.delete()
            self.id     = newParent.id + [len(newParent.children) - 1]
            self.parent = newParent
            self.__updateChildrenIds()
            

    def __updateChildrenIds(self):
        """ 
        Recursive function for updating a node's children ids
        """
        for child in self.children:
            child.id = self.id + [child.id[-1]]
            child.__updateChildrenIds()
                    

    def __str__(self):
        """
        Return a node as a string
        """
        nodeStr = ""
        nodeStr += self.getIdStr() + " "
        nodeStr += self.title + "\n"
        for child in self.children:
            nodeStr += child.__str__()
            
        return nodeStr
        
        

# ===========================================================================
