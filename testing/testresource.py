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
from exe.engine.node           import Node
from exe.engine.genericidevice import GenericIdevice
from exe.engine.idevice        import Idevice
from exe.engine.path           import Path
from utils                     import SuperTestCase


# ===========================================================================
class TestResource(SuperTestCase):

    def setUp(self):
        SuperTestCase.setUp(self)
        self.packageStore = self.app.packageStore
        #self.package      = self.packageStore.createPackage()

    def testCreateAndDelete(self):
        """
        Test we have a resource directory and resource files can be stored in
        """
        myIdevice = Idevice("My Idevice", "UoA", "Testing", "Help tip", "icon", self.package.root)
        oliver = Resource(myIdevice, Path("oliver.jpg"))
        self.assert_((self.package.resourceDir/"oliver.jpg").exists())
        oliver.delete()
        self.assert_(not (self.package.resourceDir/"oliver.jpg").exists())

    def testReferenceCounting(self):
        """
        Make 3 resources with different names but same md5, ensure they are reference counted properly
        """
        res1 = Path('my.resource1.bin')
        res2 = Path('my.resource2.bin')
        res3 = Path('my.resource3.bin')
        for res in (res1, res2, res3):
            res.write_bytes('SOME NICE DATA')
        res1md5 = res1.md5
        res4 = Path('tmp/my.resource1.bin')
        if not res4.dirname().exists():
            res4.dirname().makedirs()
        res4.write_bytes('SOME *DIFFERENT* DATA')
        res4md5 = res4.md5
        res1, res2, res3, res4 = map(lambda f: Resource(self.package, f), (res1, res2, res3, res4))
        assert res1.storageName == 'my.resource1.bin', res1.storageName
        assert res2.storageName == 'my.resource1.bin'
        assert res3.storageName == 'my.resource1.bin'
        assert res4.storageName == 'my.resource11.bin'
        assert res4.userName == 'my.resource1.bin'
        assert len(self.package.resources) == 2
        assert len(self.package.resources[res1.path.md5]) == 3
        assert len(self.package.resources[res4.path.md5]) == 1
        assert self.package.resources[res4md5][0] is res4
        # Now start deleting things
        res4path = Path(res4.path)
        assert res4path.exists()
        res4.delete()
        assert not res4path.exists()
        assert res4md5 not in self.package.resources
        assert not res4path.exists()
        res1path = Path(res1.path)
        assert res1path.exists()
        res2.delete()
        assert res1path.exists()
        assert res2 not in self.package.resources[res1md5]
        res1.delete()
        assert res1path.exists()
        assert res1 not in self.package.resources[res1md5]
        res3.delete()
        assert res1md5 not in self.package.resources
        assert not res1path.exists()

if __name__ == "__main__":
    unittest.main()
