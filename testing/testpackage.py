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
from utils                     import SuperTestCase
from exe.engine.package        import Package
from exe.engine.config         import Config
from exe.engine.packagestore   import PackageStore
from exe.engine.node           import Node
from exe.engine.genericidevice import GenericIdevice
from exe.engine.path           import Path


# ===========================================================================
class TestPackage(SuperTestCase):


    def testCreatePackage(self):
        package      = self.package
        self.assert_(package)
        self.assert_(package.name)
        

    def testSaveAndLoad(self):
        packageStore = PackageStore()
        package = packageStore.createPackage()
        # Check that it has been given a default name
        self.assertEquals(package.name, "newPackage")
        package.author = "UoA"
        package.description = "Nice test package"
        Config._getConfigPathOptions = lambda s: ['exe.conf']
        config  = Config()
        filePath = config.dataDir/'package1.elp'
        package.save(filePath)
        
        package1 = Package.load(filePath)
        self.assert_(package1)
        self.assertEquals(package1.author, "UoA")
        self.assertEquals(package1.description, "Nice test package")
        # Package name should have been set when it was saved
        self.assertEquals(package.name, "package1")
        self.assertEquals(package1.name, "package1")
        

    def testfindNode(self):
        package = self.package
        node1 = package.root.createChild()
        self.assertEquals(package.findNode(node1.id), node1)
        

    def testLevelName(self):
        package = self.package
        package._levelNames = ["Month", "Week", "Day"]
        self.assertEquals(package.levelName(0), "Month")
        self.assertEquals(package.levelName(1), "Week")
        self.assertEquals(package.levelName(2), "Day")


    def testNodeIds(self):
        package = self.package
        assert package._nextNodeId == 1, package._nextNodeId
        assert package.findNode(package.root.id) is package.root
        newNode = Node(package, package.root)
        assert package.findNode('123') is None
        assert package.findNode(newNode.id) is newNode
        # Save the package
        package.name = 'testing'
        package.save('testing.elp')
        # load the package
        package2 = package.load('testing.elp')
        def checkInst(inst1, inst2):
            d1 = inst1.__dict__
            d2 = inst2.__dict__
            for key, val in d1.items():
                val2 = d2.get(key)
                if key == 'parentNode' and isinstance(val, Node):
                    assert val2.title.title == val.title.title
                elif key == 'package':
                    assert val is package
                    assert val2 is package2
                elif isinstance(val, list):
                    assert len(val) == len(val2)
                    for i, i2 in zip(val, val2):
                        if isinstance(i, basestring):
                            assert (i == i2, 
                                    '%s.%s: [%s/%s]' % 
                                    (inst1.__class__.__name__, key, i2, i))
                        else:
                            checkInst(i, i2)
                elif key == '_nodeIdDict' and isinstance(val, dict):
                    assert len(val) == len(val2)
                    for nodeName in val:
                        assert val2.has_key(nodeName)
                elif isinstance(val, Node):
                    pass
                elif key in Package.nonpersistant:
                    # Non persistent should exist after load
                    # but not be the same
                    assert d2.has_key(key)
                elif key == 'dublinCore':
                    checkInst(val, val2)
                else:
                    # Everything else must match
                    self.assertEquals(val, val2)
                    assert val == val2, '%s.%s: %s/%s' % (inst1.__class__.__name__, key, val2, val)
        checkInst(package, package2)

    def testExtract(self):    
        """
        Extracts a node of a package
        """
        package = self.package.load('extractionTestPackage.elp')
        if package is None:
            self.fail('extractionTestPackage.elp doesn\'t exist')
        # Select the first child of the first node
        package.currentNode = package.root.children[0]
        # Perform the extraction
        newPackage = package.extractNode()
        # Compare the packages
        assert newPackage.title == package.currentNode.title
        for checksum in newPackage.resources.keys():
            reses1 = newPackage.resources[checksum]
            reses2 = package.resources[checksum]
            for res1, res2 in zip(reses1, reses2):
                self.assertEqual(res1.storageName, res2.storageName)
                assert res1.checksum == res2.checksum == checksum
        # Walk the node tree's in both packages to compare them (and collect references to resources)
        nodes1 = [package.currentNode] + list(package.currentNode.walkDescendants())
        nodes2 = [newPackage.root] + list(newPackage.root.walkDescendants())
        allResources = []
        for node1, node2 in zip(nodes1, nodes2):
            for idevice1, idevice2 in zip(node1.idevices, node2.idevices):
                if isinstance(idevice1, GenericIdevice):
                    self.assertEquals(idevice1.nextFieldId, idevice2.nextFieldId)
                allResources += idevice1.userResources
                self.assertEqual(idevice1.title, idevice2.title)
                self.assertEqual([res.checksum for res in idevice1.userResources], [res.checksum for res in idevice2.userResources])
        # Copy's resources should be the same as all the resources we just collected
        newPackageResourceKeys = set(newPackage.resources.keys())
        self.failUnlessEqual(newPackageResourceKeys, set([res.checksum for res in allResources]))
        self.failUnless(newPackageResourceKeys < set(package.resources.keys()))



        
if __name__ == "__main__":
    unittest.main()
