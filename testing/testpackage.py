# ===========================================================================
# testpackage
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
from os.path                 import join
from exe.engine.package      import Package
from exe.engine.config       import Config
from exe.engine.packagestore import PackageStore, g_packageStore
from exe.webui.webinterface  import g_webInterface
from exe.engine.node         import Node

# ===========================================================================
class TestPackage(unittest.TestCase):
    def setUp(self):
        g_webInterface.config = Config("exe.conf")

    def testCreatePackage(self):
        package = g_packageStore.createPackage()
        self.assert_(package)
        self.assert_(package.name)
        
    def testSaveAndLoad(self):
        package = g_packageStore.createPackage()
        package.name = "package1"
        package.author = "UoA"
        fileDir = g_webInterface.config.getDataDir()
        package.save(fileDir)
        
        filePath = join(g_webInterface.config.getDataDir(), "package1.elp")
        package1 = g_packageStore.loadPackage(filePath)
        self.assert_(package1)
        self.assertEquals(package1.author, "UoA")
        
    def testfindNode(self):
        package = g_packageStore.createPackage()
        node1 = package.root.createChild()
        self.assertEquals(package.findNode(node1.id), node1)
        
    def testLevelName(self):
        package = g_packageStore.createPackage()
        package.levelNames = ["Month", "Week", "Day"]
        self.assertEquals(package.levelName(0), "Month")
        self.assertEquals(package.levelName(1), "Week")
        self.assertEquals(package.levelName(2), "Day")
        
if __name__ == "__main__":
    unittest.main()
