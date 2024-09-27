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
from exe                  import globals as G

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
        log.debug("init resourceFile=%s" % resourceFile)
        # Warnign that will be shown to the user if they try
        # to cut an unknown extension
        self.warningMsg = ''
        # _storageName may be changed when the package is set
        self._storageName = self._fn2ascii(resourceFile)
        # self._userName is the basename name originally given by the user

        self._storageName = self._fn2ascii(resourceFile)

        # Check if filename is too long
        if len(self._storageName) > 100:
            self._storageName = self._storageName[-100:]
            reduce_filename = 1
        else:
            reduce_filename = 0
        
        # self._userName is the basename name originally given by the user
        if reduce_filename:
            _userName = resourceFile.dirname() / self._storageName
            self._userName = _userName.encode('utf-8')
        else:
            self._userName = resourceFile.encode('utf-8')

        self._originalFile = resourceFile

        if reduce_filename:
            self._originalFile.copy(self._userName)
            self._originalFile = Path(self._userName)

        try:
            self.checksum = resourceFile.md5
            from exe.engine.idevice   import Idevice 
            from exe.engine.field     import FieldWithResources
            if isinstance(owner, Idevice):
                self._idevice     = owner
                if owner.parentNode:
                    self.package  = owner.parentNode.package
                else:
                    self.package  = None
            elif isinstance(owner, FieldWithResources):
                # support of embedded images, on the field itself:
                self._idevice = owner.idevice
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

        # new safety mechanism for old corrupt packages which
        # have non-existent resources that are being deleted:
        if not hasattr(self, 'checksum') or self.checksum is None:
            if package is None:
                log.warn("Resource " + repr(self) + " has no checksum " \
                        + "(probably no source file), but is being removed "\
                        + "anyway, so ignoring.")
            else: 
                if hasattr(self._package, 'resourceDir'):
                    log.warn("Resource " + repr(self) + " has no checksum " \
                        + "(probably old resource), and is being added to "\
                        + "valid package " + repr(package) )
                    log.warn("This resource should have been upgraded first!" \
                            + " Will be ignoring...")
                else:
                    log.warn("Resource " + repr(self) + " has no checksum " \
                        + "(probably no source file), and was being added to "\
                        + "invalid package " + repr(package) 
                        + "; setting to None.")
                # either way, play it safe and set its package to None and bail:
                self._package = None
            return

        if self._package and hasattr(self._package, 'resources')\
        and self.checksum in self._package.resources:
            # Remove our self from old package's list of resources
            siblings = self._package.resources[self.checksum]
            try: 
                # remove any multiple occurrences of this as well:
                # (as might in corrupt files)
                while self in siblings: 
                    siblings.remove(self) 
            except Exception as e:
                # this can occur with old corrupt files, wherein the resource 
                # was not actually properly connected to the package.  
                # Proceed anyhow, as if it just removed...
                bogus_condition = 1
            if len(siblings) == 0:
                # We are the last user of this file
                del self._package.resources[self.checksum]
            oldPath = self.path

        elif hasattr(self, '_originalFile'):
            oldPath = self._originalFile
        else:
            log.warn("Tried to remove a resource (\"" + repr(self)
                    + "\") from what seems to be a "
                    + "corrupt package: \"" + repr(self._package) 
                    + "\"; setting oldPackage to None.")
            # but let the new package fall right through, trying:
            oldPath = None
            oldPackage = None

        self._package = package
        if self._package:
            self._addOurselvesToPackage(oldPath)
        # Remove our old file if necessary
        if oldPackage and self.checksum not in oldPackage.resources:
            # ensure that oldPath really is an actual Path object as well.
            # on old corrupt files, oldPath is sometimes coming in as a 
            # string, perhaps when no resourceDir on its corrupt package(?).
            if oldPath and isinstance(oldPath, Path) and oldPath.exists():
                try: 
                    oldPath.remove()
                except WindowsError:
                    pass
            else:
                log.error("Tried to delete a resource that's already not "
                    + " there anymore: filename=\"%s\" "
                    + "userName=\"%s\"" % (oldPath, self.userName))
        # If our Idevice has not already moved, cut ourselves off from it
        if self._idevice \
        and self._idevice.parentNode.package is not self._package:
            if self in self._idevice.userResources:
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
        # new safety mechanism for old corrupt packages which
        # have non-existent resources that are being deleted and such:
        if not hasattr(self, 'checksum') or self.checksum is None:
            if self._package is None:
                log.warn("Resource " + repr(self) + " has no checksum " \
                        + "(probably no source file), but is being removed "\
                        + "anyway, so ignoring.")
                return
            else:
                if oldPath.isfile():
                    log.warn("Resource " + repr(self) + " has no checksum; " \
                            + " adding and continuing...")
                    # see if a few basic checks here can get it going to add:
                    self.checksum = oldPath.md5
                else: 
                    log.warn("Resource " + repr(self) + " has no checksum " \
                        + "(and no source file), and was being added to "\
                        + "package " + repr(self._package) + "; ignoring.")
                    return

        # Add ourselves to our new package's list of resources

        if not hasattr(self._package, 'resources'):
            log.error("_AddOurselvesToPackage called with an invalid package: " 
                    + " no resources on package " + repr(self._package)
                    + "; possibly after a deepcopy")
            return
        if not hasattr(self._package, 'resourceDir'):
            log.error("_AddOurselvesToPackage called with an invalid package: " 
                    + " no resourceDir on package " + repr(self._package)
                    + "; possibly an old/corrupt resource or package")
            return

        # We want to prevent eXe from removing images while loading a package as
        # it won't update the references to that resource
        # Check if there are any resources exactly like this
        siblings = self._package.resources.setdefault(self.checksum, [])
            
        if siblings:
            # If we're in the resource dir, and already have a filename that's different to our siblings, delete the original file
            # It probably means we're upgrading from pre-single-file-resources or someone has created the file to be imported inside the resource dir
            # We are assuming that it's not a file used by other resources...
            
            if not self._package.isLoading:    
            
                newName = siblings[0]._storageName
                if oldPath.dirname() == self._package.resourceDir and self._storageName != newName:
                    oldPath.remove()
                self._storageName = newName
        else:
            if Path(oldPath).dirname() == self._package.resourceDir:
                log.debug("StorageName=%s was already in self._package resources" % self._storageName)
            else:
                filename = (self._package.resourceDir/oldPath.basename())
                storageName = self._fn2ascii(filename)
                if G.application.config.cutFileName == "1" and self._package != None:
                    if self._package.isChanged:
                        original = (self._package.resourceDir/storageName)
                        storageName = self.uniquePath(original, 0)
                    else:
                        storageName = (self._package.resourceDir/storageName).unique()
                else:
                    storageName = (self._package.resourceDir/storageName).unique()
                    
                self._storageName = str(Path(storageName).basename())

                oldPath.copyfile(self.path)
        if self.checksum or self._package.isLoading:
            siblings.append(self)
            
    #Create unique path for the images     
    def uniquePath(self,original, unique):
        if original.exists() and original.isfile():
            unique += 1  
            # Get the position of the last '.' which is equivalent of the extension
            position = original.rindex('.')
            outExtension = original[0:position]
            # Get size of uniquifield more the point
            length = len(str(unique)) + 1
            unifique = outExtension[:-length]
            #Adding the uniquifield
            unifique += '.' + str(unique)
            # Replace the changes
            finalPath = original.replace(outExtension, unifique)
            if Path(finalPath).exists():
                return self.uniquePath(Path(finalPath), unique)
            else:
                return finalPath
        else:
            return original

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
        for key, val in list(self.__dict__.items()):
            if id(val) in others:
                setattr(miniMe, key, others[id(val)])
            else:
                new = deepcopy(val, others)
                others[id(val)] = new
                setattr(miniMe, key, new)
        if miniMe.package:
            miniMe._addOurselvesToPackage(self.path)
        return miniMe
    
    # Protected methods

    def _fn2ascii(self, filename):
        """
        Changes any filename to pure ascii, returns only the basename
        """
        nameBase, ext = Path(Path(filename).basename()).splitext()
        #nameBase = Path(filename).basename()
        # Check if the filename is ascii so that twisted can serve it
        #JR: Convertimos el nombre del fichero a algunos caracteres ascii validos
        import unicodedata
        import string
        #if the variable is actived and package is set and change, format name of images and extension
        if G.application.config.cutFileName == "1" and self._package != None:
            if self._package.isChanged:
                nameBase = nameBase[0:8]
                ext = self.cutExtension(ext, nameBase)
        validFilenameChars = "~,()[]-_. %s%s" % (string.ascii_letters, string.digits)
        if type(nameBase) == str:
            nameBase = str(nameBase)
        if type(ext) == str:
            ext = str(ext)
        cleanedBasename = unicodedata.normalize('NFKD', nameBase).encode('ASCII', 'ignore')
        nameBase = ''.join(c for c in cleanedBasename if c in validFilenameChars)
        cleanedExt = unicodedata.normalize('NFKD', ext).encode('ASCII', 'ignore')
        ext = ''.join(c for c in cleanedExt if c in validFilenameChars)
        if nameBase == "":
            nameBase = cleanedBasename.encode('utf-8').encode('hex')
            if nameBase == "":
                nameBase = 'unnamed'
        if ext == "":
            ext = cleanedExt.encode('utf-8').encode('hex')
        #JR
        #nameBase, ext = Path(Path(filename).basename()).splitext()
        #try: nameBase.encode('ascii')
        #except UnicodeEncodeError:
        #    nameBase = nameBase.encode('utf-8').encode('hex')
        # Encode the extension separately so that you can keep file types a bit
        # at least
        #try:
        #    ext = ext.encode('ascii')
        #except UnicodeEncodeError:
        #    ext = ext.encode('utf8').encode('hex')
        #return str(nameBase + ext)
        return str(nameBase + ext)

    def cutExtension(self,ext,nameBase):
        """
        Cut the extension to a maximum of 3 chars.
        If the extension is bigger than that and we don't know it,
        show a warning to the user.
        """
        if len(ext) > 4:
            if ext == '.jpeg':
                return '.jpg'
            elif ext == '.jpg2':
                return '.jp2'
            elif ext == '.ilbm':
                return '.iff'
            elif ext == '.tpic':
                return '.tga'
            elif ext == '.tiff':
                return '.tif'
            elif ext == '.svgz':
                return '.svg'
            else:
                self.warningMsg = (_('Unknown extension %s of file %s%s can\'t be transformed to ISO 9660.') % (ext, nameBase, ext))
                return ext
        else:
            return ext


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
        if hasattr(self, '_package') and self._package\
        and hasattr(self._package, 'resourceDir'):
            return self._package.resourceDir/self._storageName
        else:
            return self._storageName

    def checksumCheck(self):
        """
        Ensures the the md5 is correct.             
        There was a period in which resource checksums were being created 
        before the resource zip file was fully closed, and not flushed out
        """
        # The following self.path.isfile() is now wrapped in a try/except
        # because apparently some very old and corrupt files
        # seems to THINK it has a resource, but the following
        # check of self.path.isfile() throws an exception for:
        #     <type 'exceptions.AttributeError'>: 
        #     'str' object has no attribute 'isfile'
        # because self.path (the property defined above) may not be able
        # to find self._package, and therefore returns only _storageName.
        try: 
            if self.path.isfile(): 
                new_md5 = self.path.md5 
            else: 
                new_md5 = None
        except Exception as e:
            bogus_condition = 1
            # But see if we can recover anyhow.  
            # See if this was caused bcause no self._package,
            # and therefore no self._package/resourceDir is defined.
            # If this is the case, and it's from a corrupt old idevice,
            # then  see if we can find the resourceDir of the new package
            # into which it is being loaded, and use that to determine 
            # the resource and its checksum:
            found_resource = False
            this_resource_path = ""
            if hasattr(self, '_idevice') and self._idevice is not None:
                if hasattr(self._idevice, 'parentNode') \
                and self._idevice.parentNode is not None:
                    if hasattr(self._idevice.parentNode, 'package')\
                    and self._idevice.parentNode.package is not None:
                        if hasattr(self._idevice.parentNode.package, \
                                'resourceDir')\
                        and self._idevice.parentNode.package.resourceDir \
                        is not None: 
                            this_resource_path = \
                                self._idevice.parentNode.package.resourceDir \
                                + "/" + self._storageName
                            if os.path.isfile(this_resource_path):
                                found_resource = True
                                new_md5 = this_resource_path.md5
                                # and try setting its valid package as well:
                                self._package = self._idevice.parentNode.package
                                # such that the calling ImageWithText idevice
                                # can properly find this resource and convert
                                # it (it's the only place calling this :-) )
                                # NOTE: since this really is only being called
                                # to convert this old corrupt resource from
                                # ImageWithText, and delete the ImageWithText,
                                # do not bother with any of the other normal
                                # issues of adding a resource to a package,
                                # (primarily the _addOurselvesToPackage()
                                #  activities such as adding to the package's
                                #  resources.setdefault(self.checksum, []) etc)
                                # since _setPackage() will now safely handle
                                # removal of an invalid resource.
            if not found_resource:
                new_md5 = None 
                log.warn('Failed to do a checksumCheck on resource ' 
                    + repr(self)
                    + ', with unknown path, but storageName = ' 
                    + repr(self._storageName)) 
            else:
                log.warn('checksumCheck not able to find resource path '
                        + 'directly, since no package, but did find a path '
                        + 'to it at: ' + this_resource_path)

        if not hasattr(self, 'checksum'):
            log.warn("checksumCheck() found NO checksum attribute for " 
                    + repr(self) + "; setting to new md5 of: " + str(new_md5))
            self.checksum = new_md5
            # go ahead and add this to the package, as well:
            if new_md5 is not None and hasattr(self._package, 'resources'): 
                # And add our new md5 to the package's list of resources:
                siblings = self._package.resources.setdefault(new_md5, [])
                if self not in siblings:
                    # prevent doubling-up 
                    # (as might occur when cleaning corrupt files)
                    siblings.append(self)

        elif self.checksum != new_md5: 
            old_md5 = self.checksum
            log.warn("checksumCheck() found old md5 for " + repr(self) 
                    + "; replacing with: " + str(new_md5)) 
            self.checksum = new_md5

            # go ahead and adjust this within the package, as well:
            if hasattr(self._package, 'resources'): 
                # Remove our old md5 from the package's list of resources:
                siblings = self._package.resources.get(old_md5, [])
                # remove any multiple occurrences of this as well:
                # (as might in corrupt files)
                while self in siblings: 
                    siblings.remove(self)
                if len(siblings) == 0:
                    # We are the last user of this file
                    self._package.resources.pop(old_md5, None)
                if new_md5 is not None: 
                    # And add our new md5 to the package's list of resources:
                    siblings = self._package.resources.setdefault(new_md5, [])

                    if self not in siblings:
                        # prevent doubling-up 
                        # (as might occur when cleaning corrupt files)
                        siblings.append(self)


    def upgradeToVersion2(self):
        """
        a wrapper to addSelfToPackageList(self), such that it might be called
        after the package has been loaded and upgraded.  Otherwise, due 
        to the seemingly random upgrading of the package and resource objects,
        this might be called too early.
        """
        G.application.afterUpgradeHandlers.append(self.addSelfToPackageList)


    def addSelfToPackageList(self):
        """
        For upgradeToVersion2, to version 0.20 of exe.
        Puts user resources in our package's list
        """
        # List our selves in our package's resources list
        if self._package:
            if not hasattr(self._package, 'resourceDir'):
                # the package itself appears to be entirely bogus:
                log.warn("resource " + repr(self) + " in addSelfToPackage with "
                        + "invalid self._package = \"" + self._package._name 
                        + "\" " + repr(self._package) 
                        + ". Setting to None and returning")
                # rather than going through self._setPackage(), which will
                # cause further problems trying to disconnect from this invalid
                # one, just go ahead and set self._package directly:
                self._package = None
                return
            if not hasattr(self._package, 'resources'):
                # Because jelly seems to have no order of upgrading children and parents
                # We have to modify the package here!
                self._package.resources = {}
        elif self._package is None:
            log.warn("resource " + repr(self) + " in addSelfToPackageList with "
                    + "self._package = None (perhaps a zombie already deleted?). "
                    + "Returning.")
            return

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


    def renameForMerging(self, newPackage):
        """
        to help the merging code in twisted/persisted/styles.py
        when it finds that this resource's storageName is already 
        in use with the merging destination package, newPackage.
        Finds a new unique name by prepending "m1_", "m2_", etc...
        note: new name should, of course, be unique to both the resource's
        current source package, as well as the destinateion newPackage.
        """ 
        old_name = self._storageName
        found_new_name = False
        new_name_attempt = 0
        preMergePackage = self.package

        # make sure that this possibly old resource HAS a proper checksum:
        self.checksumCheck()

        if self.checksum in newPackage.resources:
            # okay, this resource IS already in the newPackage,
            # but does it have the same name?
            if self._storageName  \
            == newPackage.resources[self.checksum][0]._storageName:
                # nothing else to do, so leave found_name_name as False:
                found_new_name = False
            else:
                # names differ!
                # ==> we need to rebuild the iDevice content from below,
                # but just set the new_name as that which is already
                # stored in the newPackage:
                new_name = newPackage.resources[self.checksum][0]._storageName
                found_new_name = True
            
        while not found_new_name: 
            # try prepending a merge suffix to the storageName, 
            # and see if that already exists in EITHER the src OR dst package.
            # try "m1_", or "m2_", etc...
            new_name_attempt += 1 
            new_name_suffix = "m" \
                + str(new_name_attempt) + "_"
            new_name = new_name_suffix \
                + self.storageName 

            if newPackage.findResourceByName(new_name) is None \
            and preMergePackage.findResourceByName(new_name) is None:
                found_new_name = True

        if found_new_name:
            log.warn("Renaming Resource from \""
                    + self.storageName + "\" to \""
                    + new_name)
            # rename the actual file, which is still located
            # in the preMergePackage temporary resourceDir:
            old_path = Path(preMergePackage.resourceDir)\
                    .joinpath(self.storageName) 
            new_path = Path(preMergePackage.resourceDir)\
                    .joinpath(new_name)
            newFullFileName = Path(old_path).rename(new_path)

            def updateIdevice(self):
                from exe.engine.appletidevice    import AppletIdevice
                from exe.engine.galleryidevice   import GalleryIdevice

                if isinstance(self._idevice, AppletIdevice):
                    # note that it COULD make it this far IF an AppletIdevice
                    # has the same resource, but by a different storageName, as
                    # another iDevice in the destination package:
                    raise Exception(_("renamed a Resource for an Applet Idevice, and it should not have even made it this far!"))

                elif isinstance(self._idevice, GalleryIdevice):
                    # Re-generate the GalleryIdevice popupHTML,
                    # but it's best to re-generate as an AfterUpgradeHandler,
                    # since its OTHER resources (some of which might themselves
                    # be renamed with the merge) might not have been updated yet!
                    if self._idevice._createHTMLPopupFile not in \
                    G.application.afterUpgradeHandlers:
                        G.application.afterUpgradeHandlers.append(
                            self._idevice._createHTMLPopupFile)

                else:
                    # if this is one of the many iDevices (generic or otherwise)
                    # which uses a FieldWithResources field, then the content
                    # will need to be changed directly.

                    this_field = self._idevice.getResourcesField(self)
                    from exe.engine.field            import FieldWithResources
                    if this_field is not None\
                    and isinstance(this_field, FieldWithResources):
                        # 1. just change .content_w_resourcePaths directly:
                        old_resource_path = "resources/" + old_name
                        new_resource_path = "resources/" + new_name
                        this_field.content_w_resourcePaths = \
                            this_field.content_w_resourcePaths.replace(
                                old_resource_path, new_resource_path)
                        # 2. copy .content_w_resourcePaths  directly into .content
                        # ONLY IF .content is already defined!
                        if hasattr(this_field, 'content'):
                            this_field.content = this_field.content_w_resourcePaths
                        # 3. re-create .content_wo_resourcePaths through Massage*()
                        # ONLY IF .content_wo_resourcePaths is already defined!
                        if hasattr(this_field, 'content_wo_resourcePaths'):
                            this_field.content_wo_resourcePaths = \
                                    this_field.MassageContentForRenderView()
                    else:
                        # Any other iDevice is assumed to simply have a direct
                        # link to the resource and need nothing else done.
                        # ==> nothing else to do, eh?
                        log.warn("Unaware of any other specific resource-renaming "
                                + "activities necessary for this type of idevice: "
                                + repr(self._idevice))

            # and update the renamed storage name:
            old_name = self._storageName
            for resource in preMergePackage.resources[self.checksum]:
                if resource._storageName == old_name:
                    resource._storageName = new_name
                    # And also update references to this resource
                    # in its content, according to the specific _idevice
                    updateIdevice(resource)

    def launch_testForZombies(self):
        """
        a wrapper to testForZombieResources(self), such that it might be called
        after the package has been loaded and upgraded.  Otherwise, due 
        to the seemingly random upgrading of the package and resource objects,
        this might be called too early.
        """
        # launch the zombie resource check on any resource without an idevice:
        # (knowing that in some cases, this could indeed still be valid)
        if self._idevice is None:
            G.application.afterUpgradeHandlers.append(
                    self.testForZombieResources)

    def testForAndDeleteZombieResources(self):
        """
        A quick wrapper around testForZombieResources to force the
        deleteZombie parameter to True (normally defaults to False).
        This additional wrapper is here such that the afterUpgradeHandler
        can call this directly, and not require any particular parameters.
        """
        self.testForZombieResources(deleteZombie=True)

    def testForZombieResources(self, deleteZombie=False):
        """ 
        testing a possible post-load confirmation that this resource 
        is indeed attached to something.  
        to be called from twisted/persist/styles.py upon load of a Resource.

        to accomodate random loading issues, in which, for example, two
        resource objects pointing to the same file are loaded, and one is
        a zombie to be deleted - we want to ensure that the valid one has
        been found and properly re-attach all non-zombies before actually 
        deleting any resources and inadvertently deleting the resource file!
        
        With a new deleteZombie parameter, this supports a first-pass call
        which merely tries to re-attach any potential zombie resources.
        If STILL a zombie, then the launched 2nd-pass test can delete it.
        """
        # make sure that this possibly old resource HAS a proper checksum:
        self.checksumCheck()

        if self._package is not None\
        and not hasattr(self._package, 'resources'):
            # perhaps the package has not yet loaded up?
            if not deleteZombie:
                log.warn("1st pass: Checking zombie Resource \"" + str(self) 
                    + "\", but package does not yet have resources;"
                    + " ignoring for now.")
                # but add the second-pass call, 
                # after cycling through all other resources 1 time:
                G.application.afterUpgradeHandlers.append(
                    self.testForAndDeleteZombieResources)
                return
            else:
                log.warn("2nd pass: Checking zombie Resource \"" + str(self) 
                    + "\", but package does not yet have resources. deleting.")
                G.application.afterUpgradeZombies2Delete.append(self)
                return

        if self._package is None \
        or self.checksum not in self._package.resources:
            # most definitely appears to be a zombie:
            if deleteZombie: 
                log.warn("Removing zombie Resource \"" + str(self) 
                        + "\"; not in package resources.") 
                G.application.afterUpgradeZombies2Delete.append(self)
            else:
                log.warn("1st pass: not yet removing zombie Resource \""
                        + str(self) + "\"; not in package resources.")
                # but add the second-pass call, 
                # after cycling through all other resources 1 time:
                G.application.afterUpgradeHandlers.append(
                    self.testForAndDeleteZombieResources)
                return

        elif self._package is not None and self._idevice is None\
        and self != self._package._backgroundImg:
            # okay, this resource IS listed in the package's resources,
            # but does not have an idevice, nor is it a background image.
            # So....
            # cycle through all of the package nodes to find any idevice
            # for which this is indeed a resource, and reset the _idevice
            # field on this resource once found, 
            # OR, determine that it actually is a zombie:
            found_idevice = None

            if self._package.root: 
                root_and_children = list(self._package.root.walkDescendants())
                root_and_children.append(self._package.root)
                for this_node in root_and_children:
                    for this_idevice in this_node.idevices:
                        just_found_idevice = False

                        if self in this_idevice.userResources:
                            just_found_idevice = True
                        else: 
                            this_field = this_idevice.getResourcesField(self) 
                            if this_field is not None: 
                                just_found_idevice = True

                        if just_found_idevice:
                            # now go ahead and report and reattach:
                            if found_idevice:
                                log.warn("Multiple idevices found for "
                                        + " non-zombie Resource \"" + str(self)
                                        + "\" when re-attaching.")
                            just_found_idevice = True
                            found_idevice = this_idevice
                            found_idevice.userResources.append(self)
                            self._idevice = found_idevice
                            log.warn("Re-attached non-zombie Resource \""
                                    + str(self) + "\" to iDevice: "
                                    + repr(found_idevice))

            # if not found in ANY idevice, it probably IS a zombie
            if found_idevice is None:
                if deleteZombie: 
                    log.warn("Removing zombie Resource \"" + str(self) 
                            + "\"; no corresponding iDevice found.") 
                    G.application.afterUpgradeZombies2Delete.append(self)
                else: 
                    log.warn("1st pass: not yet removing zombie Resource \""
                        + str(self) + "\"; no corresponding iDevice found.")
                    # but add the second-pass call, 
                    # after cycling through all other resources 1 time:
                    G.application.afterUpgradeHandlers.append(
                        self.testForAndDeleteZombieResources)
        elif self._package is not None and self._idevice is not None\
        and self != self._package._backgroundImg:
            if self._idevice.getResourcesField(self) is None:
                if deleteZombie: 
                    log.warn("Removing zombie Resource \"" + str(self) 
                            + "\"; no corresponding iDevice found.") 
                    G.application.afterUpgradeZombies2Delete.append(self)
                else: 
                    log.warn("1st pass: not yet removing zombie Resource \""
                        + str(self) + "\"; no corresponding iDevice found.")
                    # but add the second-pass call, 
                    # after cycling through all other resources 1 time:
                    G.application.afterUpgradeHandlers.append(
                        self.testForAndDeleteZombieResources)
# ===========================================================================
