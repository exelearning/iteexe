# ===========================================================================
# config unittest
# Copyright 2004, University of Auckland
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
from exe.engine.node import Node

# ===========================================================================
class TestNBlock(unittest.TestCase):
    def setUp(self):
        pass

    def testCreate(self, idevice):
        block = g_blockFactory.createBlock(idevice)
        
    def testMove(self):
        root = Node(None)
        child0 = root.createChild()
        child0.title = "Child Nought"
        child1 = root.createChild()
        child1.title = "Child One"

        child0.movePrev()
        self.assertEqual(child0.id, [0,0])
        self.assertEqual(child0.title, "Child Nought")

        child1.movePrev()
        self.assertEqual(child1.id, [0,0])
        self.assertEqual(child1.title, "Child One")

        child1.moveNext()
        self.assertEqual(child1.id, [0,1])
        self.assertEqual(child1.title, "Child One")

        child0.moveNext()
        self.assertEqual(child0.id, [0,1])
        self.assertEqual(child0.title, "Child Nought")

        child0.delete()
        self.assertEqual(child1.id, [0,0])
        
    def testPromote(self):
        root = Node(None)
        child0 = root.createChild()
        child1 = root.createChild()
        child3 = root.createChild()
        child31 = child3.createChild()
        child31.promote()
        self.assertEqual(child31.id, [0,3])
        
    def testDemote(self):
        root = Node(None)
        child0 = root.createChild()
        child1 = root.createChild()
        child3 = root.createChild()
        child31 = child3.createChild()
        child1.promote()
        child1.demote()
        self.assertEqual(child1.id, [0,0,0])
        
    def testGetIdStr(self):
        root = Node(None)
        child0 = root.createChild()
        child1 = root.createChild()
        child11=child1.createChild()
        self.assertEqual(child11.getIdStr(), "0.1.0")
        
    def testStr(self):
        root = Node(None)
        root.title = "root node"
        child0 = root.createChild()
        child0.title = "first child"
        child1 = root.createChild()
        child1.title = "second child"
        child3 = root.createChild()
        child3.title = "third child"
        child31 = child3.createChild()
        child31.title = "third child's first child"

   
if __name__ == "__main__":
    unittest.main()
