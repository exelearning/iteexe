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
import os
from copy                 import deepcopy
from string               import Template
from exe.engine.persist   import Persistable
from exe.engine.path      import Path, toUnicode 

log = logging.getLogger(__name__)

# ===========================================================================


class _Resource(Persistable):
    """
    Encapsulates a resource file which belongs to some package.
    saves the user from having to know if it is renamed.

    This is a user resource, a copy of the file is made and kept with the package.
    Once all resources refering to the file have died, the copy is deleted.
    """
    
    # Class attributes
    persistenceVersion = 2

    # Default attribute values
    _package = None
    _idevice = None

    def __init__(self, owner, resourceFile):
        """
        Initialize a resource object, and copy the file into the package's
        resouceDir unless it is already there
        'owner' is either an IDevice or a Package
        'resourceFile' is the path to the file
        """
        log.debug(u"init resourceFile=%s" % resourceFile)
        # _storageName may be changed when the package is set
        self._storageName = self._fn2ascii(resourceFile)
        # self._userName is the basename name originally given by the user
        self._userName = resourceFile.encode('utf-8')
        self._originalFile = resourceFile
        try:
            self.checksum = resourceFile.md5
            from exe.engine.idevice   import Idevice 
            from exe.webui.element    import ElementWithResources
            if isinstance(owner, Idevice):
                self._idevice     = owner
                if owner.parentNode:
                    self.package  = owner.parentNode.package
                else:
                    self.package  = None
            elif isinstance(owner, ElementWithResources):
                # for support of images (and other media) via tinyMCE,
                # now allow not just idevice's to have resources, 
                # but also TextAreaElements (and any others, as needed,
                # all inheriting from ElementWithResources)
                # to hold the resources necessary in GalleryImages:
                self._idevice = owner.field_idevice
                if owner.parentNode:
                    self.package  = owner.parentNode.package
                else:
                    self.package  = None 
            else: 
                self._idevice = None 
                self.package = owner
        finally:
            # Don't need to save the original file name between sessions
            # It was just used for changing the package
            del self._originalFile

    def _setPackage(self, package):
        """
        Used to change the package.
        """
        if package is self._package: return
        oldPackage = self._package
        if self._package:
            # Remove our self from old package's list of resources
            siblings = self._package.resources[self.checksum]
            siblings.remove(self)
            if len(siblings) == 0:
                # We are the last user of this file
                del self._package.resources[self.checksum]
            oldPath = self.path
        else:
            assert hasattr(self, '_originalFile')
            oldPath = self._originalFile
        self._package = package
        if self._package:
            self._addOurselvesToPackage(oldPath)
        # Remove our old file if necessary
        if oldPackage and self.checksum not in oldPackage.resources:
            if oldPath.exists():
                oldPath.remove()
            else:
                log.error("Tried to delete a resource that's already not there anymore: "
                          "filename=\"%s\" userName=\"%s\"" % (oldPath, self.userName))
        # If our Idevice has not already moved, cut ourselves off from it
        if self._idevice and self._idevice.parentNode.package is not self._package:
            self._idevice.userResources.remove(self)
            self._idevice = None

    # Properties
    storageName = property(lambda self:self._storageName)
    userName = property(lambda self:self._userName)
    package = property(lambda self:self._package, _setPackage)
    path = property(lambda self:self._package.resourceDir/self._storageName)

    # Protected methods

    def _addOurselvesToPackage(self, oldPath):
        """
        Adds ourselves into self._package.resources.
        Don't call if self._package is None.
        Does no copying or anything. Just sticks us in the list and sets our storage name
        """
        # Add ourselves to our new package's list of resources
        siblings = self._package.resources.setdefault(self.checksum, [])
        if siblings:
            # If we're in the resource dir, and already have a filename that's different to our siblings, delete the original file
            # It probably means we're upgrading from pre-single-file-resources or someone has created the file to be imported inside the resource dir
            # We are assuming that it's not a file used by other resources...
            newName = siblings[0]._storageName
            if oldPath.dirname() == self._package.resourceDir and self._storageName != newName:
                oldPath.remove()
            self._storageName = newName
        else:
            if Path(oldPath).dirname() == self._package.resourceDir:
                log.debug(u"StorageName=%s was already in self._package resources" % self._storageName)
            else:
                filename = (self._package.resourceDir/oldPath.basename())
                storageName = self._fn2ascii(filename)
                storageName = (self._package.resourceDir/storageName).unique()
                self._storageName = str(storageName.basename())
                oldPath.copy(self.path)
        siblings.append(self)

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

    def __getinitargs__NOT__(self):
        """
        Used by copy.deepcopy, which is used by exe.engine.node.clone().
        Makes it so the copy for this resource, actually gets __init__ called
        """
        if self._idevice:
            return self._idevice, self.path
        else:
            return self._package, self.path

    def __deepcopy__(self, others={}):
        """
        Returns a copy of self, letting our package and idevice know what has happened
        'others' is the dict of id, object of everything that's been copied already
        """
        # Create a new me
        miniMe = self.__class__.__new__(self.__class__)
        others[id(self)] = miniMe
        # Do normal deep copy
        for key, val in self.__dict__.items():
            if id(val) in others:
                setattr(miniMe, key, others[id(val)])
            else:
                new = deepcopy(val, others)
                others[id(val)] = new
                setattr(miniMe, key, new)
        if miniMe.package:
            miniMe._addOurselvesToPackage(self.path)
        #if miniMe._idevice: miniMe._idevice.userResources.append(miniMe)
        return miniMe
    
    # Protected methods

    def _fn2ascii(self, filename):
        """
        Changes any filename to pure ascii, returns only the basename
        """     
        nameBase, ext = Path(Path(filename).basename()).splitext()
        # Check if the filename is ascii so that twisted can serve it
        try: nameBase.encode('ascii')
        except UnicodeEncodeError:
            nameBase = nameBase.encode('utf-8').encode('hex')
        # Encode the extension separately so that you can keep file types a bit
        # at least
        try:
            ext = ext.encode('ascii')
        except UnicodeEncodeError:
            ext = ext.encode('utf8').encode('hex')
        return str(nameBase + ext)


class Resource(_Resource):
    """
    This is a user resource, a copy of the file is made and kept with the package.
    Once all resources refering to the file have died, the copy is deleted.
    """

    persistenceVersion = 2

    def __init__(self, owner, resourceFile):
        """
        Initialize a resource object, and copy the file into the package's
        resouceDir unless it is already there
        'owner' is either an IDevice or a Package
        'resourceFile' is the path to the file
        """
        self.checksum = Path(resourceFile).md5 # Just use the path name as a unique ID
        _Resource.__init__(self, owner, resourceFile)
        if self._idevice:
            self._idevice.userResources.append(self)

    @property
    def path(self):
        """
        Returns the path to the resource
        """
        if self._package:
            return self._package.resourceDir/self._storageName
        else:
            return self._storageName

    def upgradeToVersion2(self):
        """
        For upgrades to version 0.20 of exe.
        Puts user resources in our package's list
        """
        # List our selves in our package's resources list
        if self._package:
            if not hasattr(self._package, 'resources'):
                # Because jelly seems to have no order of upgrading children and parents
                # We have to modify the package here!
                self._package.resources = {}
        self._userName = self._storageName
        if self.path.isfile():
            self.checksum = self.path.md5
            self._originalFile = self.path  # Pretend we're a newly added file
            try:
                self._addOurselvesToPackage(self.path)
            finally:
                del self._originalFile
        else:
            log.error('Resource file "%s" not found. Deleting resource object' % self.path)
            if self._idevice:
                self._idevice.userResources.remove(self)

    def __repr__(self):
        """
        Represents 'Resource' as a string for the programmer
        """
        return '<%s.%s for "%s" at %s>' % (__name__, self.__class__.__name__, self._storageName, id(self))


# ===========================================================================
