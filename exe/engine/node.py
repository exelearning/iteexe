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
        index = self.id[-1]
        
        if index > 0:
            temp = self.parent.children[index - 1]
            self.children[index - 1]    = self.parent.children[index] 
            self.parent.children[index - 1].id = temp.id
            self.parent.children[index]        = temp
            self.parent.children[index].id     = self.id        
            

    def moveNext(self):
        """Move to the next"""
        index = self.id[-1]
        
        if index < len(self.parent.children) - 1:
            temp = self.parent.children[index + 1]
            self.parent.children[index + 1]     = self.parent.children[index] 
            self.parent.children[index + 1].id  = temp.id
            self.parent.children[index]         = temp
            self.parent.children[index].id      = self.id 
            

    def delete(self):
        """Delete a node"""
        index = self.id[-1]
        del(self.parent.children[index])
        
        for i in range(index, len(self.parent.children)):
            self.parent.children[i].id[-1] = i
            

    def promote(self):
        """
        Move to the upper level
        """
        if len(self.id) > 2:
            oldParent = self.parent
            self.parent = oldParent.parent
            self.id = self.parent.id + [len(self.parent.children)]           
            self.parent.children.append(self)
            index = self.id[-1]
            for i in range(index, len(oldParent.children) - 1):
                oldParent.children[i] = oldParent.children[i+1]
                oldParent.children[i].id[-1] = i 
                
            oldParent.children[len(oldParent.children) - 1].delete()
            

    def demote(self):
        """
        Move  down a level
        """
        index = self.id[-1]
        if index > 0:
            oldParent = self.parent
            self.parent = oldParent.children[index - 1]
            self.id = self.parent.id + [len(self.parent.children)]
            self.parent.children.append(self)
            for i in range(index, len(oldParent.children) - 1):
                oldParent.children[i] = oldParent.children[i+1]
                oldParent.children[i].id[-1] = i 
                
            oldParent.children[len(oldParent.children) - 1].delete()
            
            
    def findIdevice(self, id):
        index = 0
        for idevice in self.idevices:
            if idevice.id == id:
                return index
            index += 1

        return None
        

# ===========================================================================
