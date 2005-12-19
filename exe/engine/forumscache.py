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
The ForumsCache is a cache of existing forum iDevices.
"""

from exe.engine.persist import Persistable
import logging
log = logging.getLogger(__name__)

# ===========================================================================
class ForumsCache(Persistable):
    """
    The ForumsCache is a cache of existing forum iDevices.
    """


    def __init__(self):
        """
        Initialize
        """
        self.forums       = []
 

    def addForum(self, newForum):
        """
        adds a new forum.  If the forum already exists increments
        a reference count
        """
        isExist = False
        for forum in self.forums:            
            if forum.forumName == newForum.forumName:
                forum.refCount += 1
                isExist = True
                break
        if not isExist:
            self.forums.append(newForum)
            
    def deleteForum(self, forum):
        """
        decrements the reference count on a forum.  If the count
        is 0 delete the forum
        """

        forum.refCount -= 1
        if forum.refCount == 0:
            self.forums.remove(forum)
            
    def getForums(self):
        """
        return a list of all the forums
        """
        return self.forums
        

# ===========================================================================
