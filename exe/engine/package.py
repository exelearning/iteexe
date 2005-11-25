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
import zipfile 
from exe.engine.path            import Path, TempDirPath, toUnicode
from exe.engine.node            import Node
from exe.engine.genericidevice  import GenericIdevice
from exe.engine.forumidevice    import ForumIdevice
from exe.engine.persist         import Persistable, encodeObject, decodeObject

log = logging.getLogger(__name__)

# ===========================================================================
class Package(Persistable):
    """
    Package represents the collection of resources the user is editing
    i.e. the "package".
    """
    persistenceVersion = 5
    nonpersistant      = ['resourceDir', 'filename']

    # Default attribute values
    # This is set when the package is saved as a temp copy file
    tempFile      = False

    def __init__(self, name):
        """
        Initialize 
        """
        log.debug(u"init " + repr(name))
        self._nextIdeviceId = 0
        self._nextNodeId    = 0
        # For looking up nodes by ids
        self._nodeIdDict    = {} 

        self._levelNames    = [x_(u"Topic"), x_(u"Section"), x_(u"Unit")]
        self._name         = name

        # Empty if never saved/loaded
        self.filename      = u''

        self.root          = Node(self, None, _(u"Home"))
        self.currentNode   = self.root
        self.style         = u"default"
        self._author       = u""
        self._description  = u""
        self.isChanged     = 0
        self.idevices      = []
        self.forums        = []

        # Temporary directory to hold resources in
        self.resourceDir = TempDirPath()

    # Property Handlers
    def set_name(self, value):
        self._name = toUnicode(value)
    def set_author(self, value):
        self._author = toUnicode(value)
    def set_description(self, value):
        self._description = toUnicode(value)

    # Properties
    name = property(lambda self:self._name, set_name)
    author = property(lambda self:self._author, set_author)
    description = property(lambda self:self._description, set_description)

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
        if level < len(self._levelNames):
            return _(self._levelNames[level])
        else:
            return _(u"?????")
        

    def save(self, filename=None, tempFile=False):
        """
        Save package to disk
        pass a 'filename' for 'save as...'
        set 'tempFile' to True to not remember that we saved it here
        """
        self.tempFile = tempFile
        if filename:
            # If we are being given a new filename...
            # Change our name to match our new filename
            name = Path(filename).splitpath()[1]
            if not tempFile:
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
        if tempFile:
            self.nonpersistant.remove('filename')
            try:
                self.doSave(filename)
            finally:
                self.nonpersistant.append('filename')
        else:
            # Update our new filename for future saves
            self.filename = filename
            self.doSave(filename)

    def doSave(self, filename):
        """
        Actually does the saving once all the other stuff has been sorted out
        """
        log.debug(u"Will save %s to: %s" % (self.name, filename))
        self.isChanged = 0
        try:
            # On some systems you need 'unicode' filenames
            zippedFile = zipfile.ZipFile(Path(filename), 
                                         "w", zipfile.ZIP_DEFLATED)
        except IOError:
            # On some you need 'encoded' filenames!
            filename = Path(filename).encode(Path.fileSystemEncoding),
            zippedFile = zipfile.ZipFile(filename,
                                         "w", zipfile.ZIP_DEFLATED)
        
        try:
            for resourceFile in self.resourceDir.files():
                zippedFile.write(unicode(resourceFile.normpath()),
                                 resourceFile.name.encode('utf8'))
            zippedFile.writestr("content.data", encodeObject(self))
        finally:
            zippedFile.close()


    @staticmethod
    def load(filename):
        """
        Load package from disk, returns a package
        """
        if not zipfile.is_zipfile(filename):
            return None

        zippedFile = zipfile.ZipFile(filename, "r", zipfile.ZIP_DEFLATED)
        toDecode   = zippedFile.read(u"content.data")
        newPackage = decodeObject(toDecode)
        
        if newPackage.tempFile:
            # newPackage.filename was stored as it's original filename
            newPackage.tempFile = False
        else:
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


    def addResource(self, resourceFile, storageName):
        """
        Add an image/audio/video resource to the package.
        Returns the last part of the url to access this resource
        'resourceFile' is a 'path' instance pointing to a local file where we
        can load the resource from. 
        """
        resourceFile.copyfile(self.resourceDir/storageName)


    def deleteResource(self, storageName):
        """
        Remove a resource from a package
        """
        resourceFile = self.resourceDir/storageName
        resourceFile.remove()


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


    def getNewIdeviceId(self):
        """
        Returns an iDevice Id which is unique for this package.
        """
        id_ = unicode(self._nextIdeviceId)
        self._nextIdeviceId += 1
        return id_


    def upgradeToVersion2(self):
        """
        Called to upgrade from 0.4 release
        """
        getattr(self, 'draft').delete()
        getattr(self, 'editor').delete()
        delattr(self, 'draft')
        delattr(self, 'editor')
        # Need to renumber nodes because idevice node and draft nodes are gone
        self._nextNodeId = 0
        def renumberNode(node):
            """
            Gives the old node a number
            """
            node._id = self._regNewNode(node)
            for child in node.children:
                renumberNode(child)
        renumberNode(self.root)


    def upgradeToVersion3(self):
        """
        Also called to upgrade from 0.4 release
        """
        self._nextIdeviceId = 0


    def upgradeToVersion4(self):
        """
        Puts properties in their place
        Also called to upgrade from 0.8 release
        """
        self._name = toUnicode(self.__dict__['name'])
        self._author = toUnicode(self.__dict__['author'])
        self._description = toUnicode(self.__dict__['description'])

    def upgradeToVersion5(self):
        """
        For version 0.11
        """
        self._levelNames = self.levelNames
        del self.levelNames
    
# ===========================================================================
