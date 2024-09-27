# ===========================================================================
# testidevice
# Copyright 2005, University of Auckland
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

import unittest
from exe.engine.forumscache    import ForumsCache
from exe.engine.forumidevice   import ForumIdevice


class TestForumsCache(unittest.TestCase):
    def setUp(self):
        self.forumsCache = ForumsCache()
        
    def testAddForum(self):
        forum1 = ForumIdevice()
        forum1.forumName = "My first forum"
        forum2 = ForumIdevice()
        forum2.forumName = "My second forum"
        forum3 = ForumIdevice()
        forum3.forumName = "My third forum"
        forum1.forumsCache = self.forumsCache
        forum2.forumsCache = self.forumsCache
        forum3.forumsCache = self.forumsCache
        self.forumsCache.addForum(forum1)
        self.forumsCache.addForum(forum2)
        self.forumsCache.addForum(forum3)
        self.forumsCache.addForum(forum1)
        forums = self.forumsCache.forums
        self.assertEqual(len(forums), 3)
        for forum in forums:
            if forum.forumName == "My first forum":
                self.assertEqual(forum.refCount, 2)
            if forum.forumName == "My second forum":
                self.assertEqual(forum.refCount, 1)
                
            
        
    def testGetForums(self):

        forum1 = ForumIdevice()
        forum1.forumName = "My first forum"
        forum2 = ForumIdevice()
        forum2.forumName = "My second forum"
        forum3 = ForumIdevice()
        forum3.forumName = "My third forum"
        forum4 = ForumIdevice()
        forum4.forumName = "My 4th forum"
        forum1.forumsCache = self.forumsCache
        forum2.forumsCache = self.forumsCache
        forum3.forumsCache = self.forumsCache
        forum4.forumsCache = self.forumsCache
        self.forumsCache.addForum(forum1)
        self.forumsCache.addForum(forum2)
        self.forumsCache.addForum(forum3)
        self.forumsCache.addForum(forum4)
        self.forumsCache.addForum(forum1)
        forums = self.forumsCache.getForums()
        self.assertEqual(len(forums), 4)
        forums = forum1.forumsCache.getForums()
        self.assertEqual(len(forums), 4)
        

    def testDeleteForum(self):
        
        forum1 = ForumIdevice()
        forum1.forumName = "My first forum"
        forum2 = ForumIdevice()
        forum2.forumName = "My second forum"
        forum3 = ForumIdevice()
        forum3.forumName = "My third forum"
        forum4 = ForumIdevice()
        forum4.forumName = "My first forum"
        forum1.forumsCache = self.forumsCache
        forum2.forumsCache = self.forumsCache
        forum3.forumsCache = self.forumsCache
        forum4.forumsCache = self.forumsCache
        self.forumsCache.addForum(forum1)
        self.forumsCache.addForum(forum2)
        self.forumsCache.addForum(forum3)
        self.forumsCache.addForum(forum4)
        
        forums = self.forumsCache.getForums()
        for forum in forums:
            if forum.forumName == "My first forum":
                self.forumsCache.deleteForum(forum)
                break                
        self.assertEqual(len(forums), 3)
        
        for forum in forums:
            if forum.forumName == "My first forum":
                self.assertEqual(forum.refCount, 1)
                break
            
        for forum in forums:
            if forum.forumName == "My third forum":
                self.forumsCache.deleteForum(forum)
                break        
        self.assertEqual(len(forums), 2)

        
        
if __name__ == "__main__":
    unittest.main()
