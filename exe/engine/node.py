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
    def __init__(self, id=None, title=""):
        if id is None:
            self.id   = [0]
        else:
            self.id   = id
        self.parent   = None
        self.children = []
        self.title    = title
        self.idevices = []

    def createChild(self, title):
        """Create a child node"""
        
        child        = Node(self.id + [len(self.children)], title)
        child.parent = self
        self.children.append(child)
        return child

    def moveChildPrev(self, childId):
        """Move the child to the previous"""
        
        childIndex = childId[-1]
        
        if childIndex > 0:
            temp = self.children[childIndex - 1]
            self.children[childIndex - 1]    = self.children[childIndex] 
            self.children[childIndex - 1].id = temp.id
            self.children[childIndex]        = temp
            self.children[childIndex].id     = childId        
            
    def moveChildNext(self, childId):
        """Move the child to the next"""
        childIndex = childId[-1]
        
        if childIndex < len(self.children) - 1:
            temp = self.children[childIndex + 1]
            self.children[childIndex + 1]     = self.children[childIndex] 
            self.children[childIndex + 1].id  = temp.id
            self.children[childIndex]         = temp
            self.children[childIndex].id      = childId 
            
    def delChild(self, childId):
        """Delete a child"""
        
        childIndex = childId[-1]
        del(self.children[childIndex])
        
        for i in range(childIndex, len(self.children)):
            self.children[i].id[-1] = i
            
    def promote(self):
        """Move to the upper level"""
        
        
        if len(self.id) > 1:
            parent = self.parent
            self.parent = parent.parent
            
    def idStr(self):
        return ".".join([str(x) for x in self.id])

    def deleteIdevice(self, id):
        index = 0
        for idevice in self.idevices:
            if idevice.id == id:
                del self.idevices[index]
                break
            index += 1
        
            
        

# ===========================================================================
