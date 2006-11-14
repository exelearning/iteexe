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
from os.path                   import join
from exe.engine.package        import Package
from exe.engine.resource       import Resource
from exe.engine.config         import Config
from exe.engine.packagestore   import PackageStore
from exe.engine.node           import Node
from exe.engine.genericidevice import GenericIdevice
from exe.engine.path           import Path


# ===========================================================================
class TestResource(unittest.TestCase):
    def setUp(self):
        self.packageStore = PackageStore()
        self.package      = self.packageStore.createPackage()


    def testCreateAndDelete(self):
        """
        Test we have a resource directory and resource files can be stored in
        """
        myIdevice = Idevice("My Idevice", "UoA", "Testing", "Help tip", "icon", self.package.root)
        oliver = Resource(myIdevice, Path("oliver.jpg"))
        self.assert_((self.package.resourceDir/"oliver.jpg").exists())
        oliver.delete()
        self.assert_(not (self.package.resourceDir/"oliver.jpg").exists())


    def testSaveAndLoad(self):
        pass
        

if __name__ == "__main__":
    unittest.main()
