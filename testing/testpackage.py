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
import pickle
import os.path
from exe.engine.package      import Package
from exe.engine.config       import Config
from exe.engine.packagestore import PackageStore, g_packageStore
from exe.webui.webinterface  import g_webInterface

# ===========================================================================
class TestPackage(unittest.TestCase):
    def setUp(self):
        g_webInterface.config = Config("exe.conf")
        

    def testCreatePackage(self):
        package = g_packageStore.createPackage()
        self.assert_(package)
        self.assert_(package.name)
        
    def testLoadExistingPackage(self):
        filePath = "C:\\exe data\\package2.elp"
        infile = open(filePath)
        package = pickle.load(infile)
        g_packageStore.addPackage(package)
        self.assert_(package)
        self.assert_(package.name)
   
if __name__ == "__main__":
    unittest.main()
