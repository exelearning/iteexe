# -- coding: utf-8 --
# ===========================================================================
# eXe
# Copyright 2013, Pedro Peña Pérez, Open Phoenix IT
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
import logging
import __builtin__
from exe.engine.packagestore import PackageStore
from exe.engine.checker import Checker
from exe.engine.freetextidevice import FreeTextIdevice
from exe.engine.resource import Resource
from exe.engine.path import Path
from utils import SuperTestCase

__builtin__._ = lambda t: t

#Logging - was talking rather a lot and this test should be able to run
#independently - Mike Dawson 8/Feb/14

#logging.basicConfig(level=logging.DEBUG)
#log = logging.getLogger(__name__)


class TestChecker(unittest.TestCase):
    def setUp(self):
        SuperTestCase.check_application_for_test()
        packageStore = PackageStore()
        self.package = packageStore.createPackage()

    def prepareTestPackage(self):
        idevice = FreeTextIdevice()
        #idevice.setParentNode(self.package.root)
        self.package.root.addIdevice(idevice)
        img = Path('testing/oliver.jpg')
        resource = Resource(idevice, img)
        idevice.content.content = '<p><img src=\"resources/oliver.jpg\"/></p>'
        idevice.content.content_w_resourcePaths = idevice.content.content 
        
        assert img.md5 in self.package.resources
        assert resource in idevice.userResources
        return (resource, img, idevice)

    def testCheckVoidPackage(self):
        self.prepareTestPackage()
        checker = Checker(self.package)
        inconsistencies = checker.check()
        assert not inconsistencies

    def testResourceChangedOutside(self):
        resource, img, idevice = self.prepareTestPackage()
        resource.path.write_bytes('a', append=False)
        assert resource.path.md5 not in self.package.resources
        checker = Checker(self.package, clear=False)
        inconsistencies = checker.check()
        assert len(inconsistencies) == 3
        for inconsistency in inconsistencies:
            #log.info('Pre Fix package resources: %s' % self.package.resources)
            #log.info('Pre Fix idevice resources: %s' % idevice.userResources)
            inconsistency.fix()
            #log.info('Post Fix package resources: %s' % self.package.resources)
            #log.info('Post Fix idevice resources: %s' % idevice.userResources)
        assert img.md5 not in self.package.resources
        assert resource.path.md5 in self.package.resources
        assert resource not in idevice.userResources
        assert len(self.package.resources[resource.path.md5]) == 1
        assert self.package.resources[resource.path.md5][0] in idevice.userResources

    def testResourceRemovedOutside(self):
        resource, img, idevice = self.prepareTestPackage()
        resource.path.remove()
        checker = Checker(self.package)
        inconsistencies = checker.check()
        assert len(inconsistencies) == 1
        for inconsistency in inconsistencies:
            #log.info('Pre Fix package resources: %s' % self.package.resources)
            #log.info('Pre Fix idevice resources: %s' % idevice.userResources)
            inconsistency.fix()
        #log.info('Post Fix package resources: %s' % self.package.resources)
        #log.info('Post Fix idevice resources: %s' % idevice.userResources)
        assert resource.checksum not in self.package.resources
        assert resource not in idevice.userResources

if __name__ == "__main__":
    unittest.main()
