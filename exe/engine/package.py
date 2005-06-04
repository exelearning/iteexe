# ===========================================================================
# eXe 
# Copyright 2004-2005, University of Auckland
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
Package represents the collection of resources the user is editing
i.e. the "package".
"""

import logging
import gettext
import zipfile 
import shutil
from exe.engine.path            import Path, TempDirPath
from exe.engine.node            import Node
from exe.engine.genericidevice  import GenericIdevice
from exe.engine.persist         import Persistable, encodeObject, decodeObject

log = logging.getLogger(__name__)
_   = gettext.gettext

# ===========================================================================
class PackageError(Exception):
    """Used for defining package specific errors"""

class Package(Persistable):
    """
    Package represents the collection of resources the user is editing
    i.e. the "package".
    """
    persistenceVersion = 2
    nonpersistant      = ['resourceDir', 'config', 'filename']

    def __init__(self, name):
        """
        Initialize 
        """
        log.debug(u"init " + repr(name))
        self._nextNodeId   = 0
        # For looking up nodes by ids
        self._nodeIdDict   = {} 

        self.levelNames    = [_(u"Topic"), _(u"Section"), _(u"Unit")]
        self.name          = name

        # Empty if never saved/loaded
        self.filename      = u''

        self.root          = Node(self, None, _(u"Home"))
        self.currentNode   = self.root
        self.style         = u"default"
        self.author        = ""
        self.description   = ""
        self.isChanged     = 0
        self.idevices      = []

        # Temporary directory to hold resources in
        self.resourceDir = TempDirPath()
        

    def findNode(self, nodeId):
        """
        Finds a node from its nodeId
        (nodeId can be a string or a list/tuple)
        """
        log.debug(u"findNode" + repr(nodeId))
        node = self._nodeIdDict.get(nodeId)
        if node and node.package is self:
            return node
        else: 
            return None


    def levelName(self, level):
        """
        Return the level name
        """
        if level < len(self.levelNames):
            return self.levelNames[level]
        else:
            return _(u"?????")
        

    def save(self, filename=None):
        """
        Save package to disk
        pass an optional filename
        """
        filename = Path(filename)
        if filename:
            # If we are being given a new filename...
            # Change our name to match our new filename
            name = filename.splitpath()[1]
            self.name = unicode(name.basename().splitext()[0])
        elif self.filename:
            # Otherwise use our last saved/loaded from filename
            filename = Path(self.filename)
        else:
            # If we don't have a last saved/loaded from filename,
            # raise an exception because, we need to have a new
            # file passed when a brand new package is saved
            raise AssertionError(u'No name passed when saving a new package')

        # Store our new filename for next file|save
        self.filename = filename

        # Add the extension if its not already there
        if not filename.lower().endswith(u'.elp'):
            filename += u'.elp'

        log.debug(u"Will save %s to: %s" % (self.name, filename))
        self.isChanged = 0
        zippedFile = zipfile.ZipFile(filename, "w", zipfile.ZIP_DEFLATED)
        
        try:
            for resourceFile in self.resourceDir.files():
                zippedFile.write(unicode(resourceFile.normpath()),
                                 resourceFile.name.encode('utf8'))
            zippedFile.writestr("content.data", encodeObject(self))

        finally:
            zippedFile.close()


    def load(filename):
        """
        Load package from disk, returns a package
        """
        if not zipfile.is_zipfile(filename):
            return None

        zippedFile = zipfile.ZipFile(filename, "r", zipfile.ZIP_DEFLATED)
        toDecode   = zippedFile.read(u"content.data")
        newPackage = decodeObject(toDecode)

        # newPackage.filename is the name that the package was last loaded from
        # or saved to
        newPackage.filename = Path(filename)

        # Need to add a TempDirPath because it is a nonpersistant member
        newPackage.resourceDir = TempDirPath()

        # Extract resource files from package to temporary directory
        for filename in zippedFile.namelist():
            if filename != u"content.data":
                outFile = open(newPackage.resourceDir/filename, "wb")
                outFile.write(zippedFile.read(filename))
                
        return newPackage
    load = staticmethod(load)


    def addResource(self, resourceFile, storageName):
        """
        Add an image/audio/video resource to the package.
        Returns the last part of the url to access this resource
        'resourceFile' is a 'path' instance pointing to a local file where we
        can load the resource from
        """
        if not resourceFile.exists():
            raise PackageError(_(u'Resource file not found'))
        if not resourceFile.isfile():
            raise PackageError(_(u'Received a path to a non file'))
        try:
            resourceFile.copyfile(self.resourceDir/storageName)
        except shutil.Error, error:
            raise PackageError(u"Couldn't copy file: %s" % unicode(error))
        except IOError, error:
            raise PackageError(u"Couldn't copy file: %s" % unicode(error))


    def deleteResource(self, storageName):
        """
        Remove a resource from a package
        """
        resourceFile = self.resourceDir/storageName
        if not resourceFile.exists():
            raise PackageError(_(u'Resource file not found'))
        if not resourceFile.isfile():
            raise PackageError(_(u'Received a path to a non file'))
        try:
            resourceFile.remove()
        except IOError, error:
            raise PackageError(u"Couldn't remove file: %s" % unicode(error))


    def upgradeToVersion1(self):
        """
        Called to upgrade from 0.3 release
        """
        self._nextNodeId = 0
        self._nodeIdDict = {}

        # Also upgrade all the nodes.
        # This needs to be done here so that draft gets id 0
        # If it's done in the nodes, the ids are assigned in reverse order
        draft = getattr(self, 'draft')
        draft._id = self._regNewNode(draft)
        draft._package = self
        setattr(self, 'editor', Node(self, None, _(u"iDevice Editor")))

        # Add a default idevice to the editor
        idevice = GenericIdevice("", "", "", "", "")
        editor = getattr(self, 'editor')
        idevice.parentNode = editor
        editor.addIdevice(idevice)
        def superReg(node):
            """Registers all our nodes
            because in v0 they were not registered
            in this way"""
            node._id = self._regNewNode(node)
            node._package = self
            for child in node.children:
                superReg(child)
        superReg(self.root)


    def _regNewNode(self, node):
        """
        Called only by nodes, 
        stores the node in our id lookup dict
        returns a new unique id
        """
        id_ = unicode(self._nextNodeId)
        self._nextNodeId += 1
        self._nodeIdDict[id_] = node
        return id_


    def upgradeToVersion2(self):
        """
        Called to upgrade from 0.4 release
        """
        getattr(self, 'draft').delete()
        getattr(self, 'editor').delete()
        delattr(self, 'draft')
        delattr(self, 'editor')
        def renumberNode(node):
            """
            Gives the old node a number
            """
            node._id = unicode(int(node.id) - 2)
            for child in node.children:
                renumberNode(child)
        renumberNode(self.root)

    
# ===========================================================================
