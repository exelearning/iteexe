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
import os.path
import zipfile 
from twisted.spread  import jelly
from twisted.persisted.styles import Versioned
from exe.engine.node import Node
from exe.engine.freetextidevice import FreeTextIdevice
from exe.engine.genericidevice  import GenericIdevice
from exe.engine import persist

log = logging.getLogger(__name__)
_   = gettext.gettext

# ===========================================================================
class Package(object, jelly.Jellyable, jelly.Unjellyable, Versioned):
    """
    Package represents the collection of resources the user is editing
    i.e. the "package".
    """
    persistenceVersion = 1

    filename = None

    def __init__(self, name):
        """
        Initialize 
        """
        log.debug("init " + repr(name))
        self._nextNodeId   = 0
        self._nodeIdDict   = {} # For looking up nodes by ids
        self.levelNames    = [_("Topic"), _("Section"), _("Unit")]
        self.name          = name
        self.filename      = '' # Empty if never saved/loaded
        self.draft         = Node(self, None, _("Draft"))
        self.editor        = Node(self, None, _("iDevice Editor"))
        self.currentNode   = self.draft
        self.root          = Node(self, None, _("Home"))
        self.style         = "default"
        self.author        = ""
        self.description   = ""
        introduction       = "Welcome to eXe<br/>"
        introduction      += "To edit this text click on the pencil icon"
        self.draft.addIdevice(FreeTextIdevice(introduction))
        self.isChanged     = 0
        idevice            = GenericIdevice("", "", "", "", "")
        idevice.parentNode = self.editor
        self.editor.addIdevice(idevice)
        self.idevices      = []
        
    def getStateFor(self, jellier):
        """
        Call Versioned.__getstate__ to store
        persistenceVersion etc...
        """
        return self.__getstate__()


    def findNode(self, nodeId):
        """
        Finds a node from its nodeId
        (nodeId can be a string or a list/tuple)
        """
        log.debug("findNode" + repr(nodeId))
        node = self._nodeIdDict.get(nodeId)
        if node and node.package is self:
            return node
        else: return None

    def levelName(self, level):
        """return the level name"""
        
        if level < len(self.levelNames):
            return self.levelNames[level]
        else:
            return _("?????")
        
    def save(self, filename=None):
        """
        Save package to disk
        pass an optional filename
        """
        if filename:
            # If we are bieng given a new filename...
            # Change our name to match our new filename
            name = os.path.split(filename)[1]
            self.name = os.path.splitext(name)[0]
        elif self.filename:
            # Otherwise use our last saved/loaded from filename
            filename = self.filename
        else:
            # If we don't have a last saved/loaded from filename,
            # raise an exception because, we need to have a new
            # file passed when a brand new package is saved
            raise AssertionError('No name passed when saving a new package')
        # Store our new filename for next file|save
        self.filename = filename
        # Add the extension if its not already there
        if not filename.lower().endswith('.elp'):
            filename += '.elp'
        log.debug("Will save %s to: %s" % (self.name, filename))
        self.isChanged = 0
        zippedFile = zipfile.ZipFile(filename, "w", zipfile.ZIP_DEFLATED)
        try:
            zippedFile.writestr("content.data", persist.encodeObject(self))
        finally:
            zippedFile.close()

    def load(filename):
        """Load package from disk, returns a package"""
        zippedFile = zipfile.ZipFile(filename, "r", zipfile.ZIP_DEFLATED)
        toDecode = zippedFile.read("content.data")
        newPackage = persist.decodeObject(toDecode)
        newPackage.filename = filename # Store the original filename so file|save will work
        return newPackage
    load = staticmethod(load)

    def upgradeToVersion1(self):
        """Called to upgrade from 0.3 release"""
        self._nextNodeId = 0
        self._nodeIdDict = {}
        # Also upgrade all the nodes.
        # This needs to be done here so that draft gets id 0
        # If it's done in the nodes, the ids are assigned in reverse order
        self.draft._id = self._regNewNode(self.draft)
        self.draft._package = self
        self.editor = Node(self, None, _("iDevice Editor"))
        # Add a default idevice to the editor
        idevice            = GenericIdevice("", "", "", "", "")
        idevice.parentNode = self.editor
        self.editor.addIdevice(idevice)
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
        id_ = str(self._nextNodeId)
        self._nextNodeId += 1
        self._nodeIdDict[id_] = node
        return id_
    

        
# ===========================================================================
