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
from exe.engine.packagestore import PackageStore, g_packageStore
from exe.engine.package      import Package
from exe.engine.node         import Node

# ===========================================================================
class TestEngine(unittest.TestCase):
    def setUp(self):
        pass

    def testCreatePackage(self):
        package = g_packageStore.createPackage()
        self.assert_(package)
        self.assert_(package.name)
        
    def testAddNode(self):
        root = Node()
        child0 = root.createChild()
        print "child0 id:", child0.id
        print "root id:", root.id
        self.assertEqual(child0.id[:-1], root.id)
        child1 = root.createChild()
        root.moveChildPrev(child0.id)        
        root.moveChildPrev(child1.id)
        print "child1 id:", child1.id
        root.moveChildNext(child1.id)
        print "child1 id:", child1.id
        root.moveChildNext(child0.id)
        root.delChild(child0.id)
        print "child1 id:", child1.id
        child11=child1.createChild()
        print "child11 string id:", child11.idStr()

    def testFindNode(self):
        package = g_packageStore.createPackage()
        node0  = package.root.createChild()
        node1  = package.root.createChild()
        node10 = node1.createChild()
        found  = package.findNode([1,0])
        self.assertEqual(found, node10)
        found  = package.findNode([])
        self.assertEqual(found, package.root)
        found  = package.findNode([0])
        self.assertEqual(found, node0)
        found  = package.findNode([1,2])
        self.assertEqual(found, None)

if __name__ == "__main__":
    unittest.main()
