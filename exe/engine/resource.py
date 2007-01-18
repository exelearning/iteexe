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
    persistenceVersion = 2

    # Default attribute values
    _package = None

    def __init__(self, owner, resourceFile):
        """
        Initialize a resource object, and copy the file into the package's
        resouceDir unless it is already there
        'owner' is either an IDevice or a Package
        """
        log.debug(u"init resourceFile=%s" % resourceFile)
        from exe.engine.package import Package # Friend class? :)
        self.md5 = Path(resourceFile).md5
        # _storageName may be changed when the package is set
        self._storageName = self._fn2ascii(resourceFile)
        # self._userName is the basename name originally given by the user
        self._userName = self._storageName
        self._originalFile = resourceFile
        if isinstance(owner, Package):
            self.package = owner
            self._idevice = None
        else:
            self.package      = owner.parentNode.package
            self._idevice     = owner
            self._idevice.userResources.append(self)
        # Don't need to save the original file name between sessions
        # It was just used for changing the package
        del self._originalFile

    def _setPackage(self, package):
        """
        Used to change the package.
        """
        if package is self._package: return
        toDelete = None
        if self._package:
            # Remove our self from old package's list of resources
            siblings = self._package.resources[self.md5]
            siblings.remove(self)
            if len(siblings) == 0:
                # We are the last user of this file
                del self._package.resources[self.md5]
                toDelete = self.path  # Will delete after we copy it
            # If our idevice has not already moved, cut ourselves off from it
            if self._idevice and self._idevice.parentNode.package is self._package:
                self._idevice.userResources.remove(self)
            oldPath = self.path
        else:
            assert hasattr(self, '_originalFile')
            oldPath = self._originalFile
        self._package = package
        if self._package:
            # Add ourselves to our new package's list of resources
            siblings = self._package.resources.setdefault(self.md5, [])
            if siblings:
                self._storageName = siblings[0]._storageName
            else:
                if not hasattr(self._package, "resourceDir"):
                    log.debug(u"Package doesn't have a resourceDir, must be upgrading")
                elif self._originalFile.dirname() == self._package.resourceDir:
                    log.debug(u"StorageName=%s was already in self._package resources" % self._storageName)
                else:
                    self._copyFile(oldPath)
            siblings.append(self)
        # Remove the resource file of the original package
        if toDelete:
            toDelete.remove()

    # Properties
    storageName = property(lambda self:self._storageName)
    userName = property(lambda self:self._userName)
    package = property(lambda self:self._package, _setPackage)

    @property
    def path(self):
        """
        Returns the path to the resource
        """
        if self._package:
            return self._package.resourceDir/self._storageName
        else:
            return self._storageName

    # Public methods

    def delete(self):
        """
        Remove a resource from a package
        """
        # Just unhooking from our package, does all we need
        self.package = None

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
        Changes any filename to pure ascii, returns only the basename
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

