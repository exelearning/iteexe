# ===========================================================================
# eXe 
# Copyright 2004-2005, University of Auckland
#
# A Node is a node in the package hierarchy
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

import sys
import logging

log = logging.getLogger(__name__)

# ===========================================================================
class Node:
    def __init__(self, package):
        self.id       = [0]
        self.package  = package
        self.parent   = None
        self.title    = ""
        self.children = []
        self.idevices = []

    def getTitle(self):
        if self.title:
            return self.title
        else:
            return self.package.levelName(len(self.id) - 2);

    def getIdStr(self):
        return ".".join([str(x) for x in self.id])


    def createChild(self):
        """Create a child node"""
        child         = Node(self.package)
        child.id      = self.id + [len(self.children)]
        child.parent  = self
        self.children.append(child)
        return child


    def movePrev(self):
        """Move  to the previous"""
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
            
    def __updateChildrenIds(self):
        """ recursive update a node's children ids"""
        for child in self.children:
            child.id = self.id + [child.id[-1]]
            child.__updateChildrenIds()
                    

    def moveNext(self):
        """Move to the next"""
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
            
    def delete(self):
        """Delete a node"""
        index = self.id[-1]
        parent = self.parent
        del(parent.children[index])
        
        for i in range(index, len(parent.children)):
            parent.children[i].id[-1] = i
            parent.children[i].__updateChildrenIds()
            

    def promote(self):
        """
        Move to the upper level
        """
        index = self.id[-1]
        
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
        Move  down a level
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
            
    def findIdevice(self, id):
        index = 0
        for idevice in self.idevices:
            if idevice.id == id:
                return index
            index += 1

        return None
        

# ===========================================================================
