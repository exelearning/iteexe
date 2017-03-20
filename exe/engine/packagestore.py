# ===========================================================================
# eXe 
# Copyright 2004-2006, University of Auckland
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
"""
PackageStore is responsible for managing the Packages which the eXe server
has loaded, (and loading and saving them?)
"""

import logging
from exe.engine.package      import Package
log = logging.getLogger(__name__)


# ===========================================================================
class PackageStore:
    """
    PackageStore is responsible for managing the Packages which the eXe server
    has loaded, and loading and saving them
    """
    def __init__(self):
        self.loaded       = {}


    def createPackage(self):
        """
        Creates a package
        """
        log.debug(u"createPackage")
        # Make up an initial unique name
        i = 1
        name = u"newPackage"
        while name in self.loaded:
            name = u"newPackage" + unicode(i)
            i += 1                    
        package = Package(name)
        self.loaded[package.name] = package

        return package


    def getPackage(self, name):
        """
        Get package using the name
        """
        return self.loaded.get(name)
    

    def addPackage(self, package):
        """
        Add a package
        """
        self.loaded[package.name] = package


    def saveAll(self):
        """
        Save all the packages in the package store out to disk
        """
        for package in self.loaded.values():
            package.save()


    def loadPackage(self, path):
        """
        Load a package from disk, add it to the store and return it
        """
        package = Package.load(path)
        self.loaded[package.name] = package
        return package


# ===========================================================================
