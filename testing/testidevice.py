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
from exe.engine.node    import Node
from exe.engine.idevice import Idevice
from exe.engine.packagestore import PackageStore
from exe                      import globals as G
import shutil
from exe.application import Application

class TestIdevice(unittest.TestCase):
    def setUp(self):
        G.application = Application()
        
        G.application.loadConfiguration()
        G.application.preLaunch()
        
        self.packageStore = PackageStore()
        self.package      = self.packageStore.createPackage()

    def testIdevice(self):
        myIdevice = Idevice("My Idevice", "UoA", "Testing", "Help tip", "icon")
        self.assertEqual(myIdevice.title, "My Idevice")
        self.assertEqual(myIdevice.author, "UoA")
        self.assertEqual(myIdevice.purpose, "Testing")
        self.assertEqual(myIdevice.tip, "Help tip")
        
    def testSetParentNode(self):
        parentNode = Node(self.package)
        idevice0 = Idevice("FirstIdevice", "", "", "", "")
        idevice0.setParentNode(parentNode)
        self.assertTrue(idevice0.parentNode is parentNode)
        
    def testIsfirstAndIsLast(self):
        parentNode = Node(self.package)
        idevice0 = Idevice("FirstIdevice", "", "", "", "")
        idevice0.setParentNode(parentNode)
        idevice1 = Idevice("SecondIdevice", "", "", "", "")
        idevice1.setParentNode(parentNode)
        idevice2 = Idevice("ThirdIdevice", "", "", "", "")
        idevice2.setParentNode(parentNode)
        
        self.assertTrue(idevice0.isFirst)
        self.assertTrue(idevice2.isLast)
        
        
    def testCmp(self):
        idevice0 = Idevice("FirstIdevice", "", "", "", "")
        idevice1 = Idevice("SecondIdevice", "", "", "", "")
        idevice2 = Idevice("ThirdIdevice", "", "", "", "")
        self.assertEqual(idevice2.__cmp__(idevice1), 1)
        self.assertEqual(idevice1.__cmp__(idevice0), 1)
        self.assertEqual(idevice0.__cmp__(idevice2), -1)
        
    def testDelete(self):
        parentNode = Node(self.package)
        idevice0 = Idevice("FirstIdevice", "", "", "", "")
        idevice0.setParentNode(parentNode)
        idevice1 = Idevice("SecondIdevice", "", "", "", "")
        idevice1.setParentNode(parentNode)
        idevice2 = Idevice("ThirdIdevice", "", "", "", "")
        idevice2.setParentNode(parentNode)
        idevice1.delete()
        if idevice1 in parentNode.idevices:
            print("delete failed")
    
    def testMove(self):
        parentNode = Node(self.package)
        idevice0 = Idevice("FirstIdevice", "", "", "", "")
        idevice0.setParentNode(parentNode)
        idevice1 = Idevice("SecondIdevice", "", "", "", "")
        idevice1.setParentNode(parentNode)
        idevice2 = Idevice("ThirdIdevice", "", "", "", "")
        idevice2.setParentNode(parentNode)
        
        idevice0.moveNext()
        self.assertEqual(parentNode.idevices[1], idevice0)
        self.assertEqual(parentNode.idevices[0], idevice1)
        
        idevice2.movePrev()
        self.assertEqual(parentNode.idevices[1], idevice2)
        self.assertEqual(parentNode.idevices[2], idevice0)
        
    def tearDown(self):
        from exe import globals
        globals.application = None
        shutil.rmtree('tmp')
        
if __name__ == "__main__":
    unittest.main()
