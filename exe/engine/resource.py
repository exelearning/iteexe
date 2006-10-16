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
This module contains resource classes used for eXe
"""

import logging
import os.path
from exe.engine.persist   import Persistable
from exe.engine.path      import Path

log = logging.getLogger(__name__)

# ===========================================================================
class Resource(Persistable):
    """
    Encapsulates a resource file which belongs to some package.
    saves the user from having to know if it is renamed
    """
    
    # Class attributes
    persistenceVersion = 1

    def __init__(self, idevice, resourceFile):
        """
        Initialize a resource object, and copy the file into the package's
        resouceDir unless it is already there
        """
        log.debug(u"init resourceFile=%s" % resourceFile)
        self._package     = idevice.parentNode.package
        self._idevice     = idevice
        idevice.userResources.append(self)
        self._storageName = self._fn2ascii(resourceFile)
        if not hasattr(self._package, "resourceDir"):
            log.debug(u"package doesn't have a resourceDir, must be upgrading")
        elif resourceFile.dirname() == self._package.resourceDir:
            log.debug(u"storageName=%s was already in self._package resources" % 
                      self._storageName)
        else:
            self._copyFile(resourceFile)


    # Properties
    storageName = property(lambda self:self._storageName)
    path = property(lambda self:self._package.resourceDir/self._storageName)

    # Public methods

    def changePackage(self, package):
        """
        Change this resource to being owned by another package
        returns a tuple of (oldFilename, newFilename) iff the storageName 
        changes
        """
        log.debug(u"changePackage new package=%s" % package.name)

        if package == self._package:
            log.warning(u"already in that package")
            return None

        oldPath       = self.path
        self._package = package
        self._copyFile(oldPath)

        if self._storageName != oldPath.basename():
            return (oldPath.basename(), self._storageName)
        else:
            return None


    def delete(self):
        """
        Remove a resource from a package
        """
        if self.path.isfile():
            self.path.remove()
        self._idevice.userResources.remove(self)
        self._storageName = None


    def __unicode__(self):
        """
        return the string
        """
        return self._storageName


    # Protected methods

    def _copyFile(self, resourceFile):
        """
        copy the resourceFile given into our package's resourceDir
        """
        log.debug(u"copyFile %s" % resourceFile)
        uniqueId = 1
        while (self._package.resourceDir/self._storageName).exists():
            nameBase, ext = os.path.splitext(self._storageName)
            self._storageName = "%s%d%s" % (nameBase, uniqueId, ext)
            uniqueId += 1

        log.debug(u"storageName=%s" % self._storageName)
        resourceFile.copyfile(self._package.resourceDir/self._storageName)


    def _fn2ascii(self, filename):
        """
        Changes any filename to pure ascii
        """
        nameBase, ext = Path(Path(filename).basename()).splitext()
        # Check if the filename is ascii so that twisted can serve it
        try:
            nameBase.encode('ascii')
        except UnicodeEncodeError:
            nameBase = nameBase.encode('utf8').encode('hex')
        # Encode the extension separately so that you can keep file types a bit
        # at least
        try:
            ext = ext.encode('ascii')
        except UnicodeEncodeError:
            ext = ext.encode('utf8').encode('hex')
        return str(nameBase + ext)



# ===========================================================================

