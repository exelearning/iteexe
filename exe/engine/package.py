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

    def __init__(self, name):
        """
        Initialize 
        """
        log.debug("init " + repr(name))
        self._nextNodeId   = 0
        self._nodeIdDict   = {} # For looking up nodes by ids
        self.levelNames    = [_("Topic"), _("Section"), _("Unit")]
        self.name          = name
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
        
    
    def save(self, path=None):
        """Save package to disk"""
        if not path:
            #TODO this changes?
            #path = g_webInterface.config.getDataDir()
            path = "."
             
        log.debug("data directory: " + path)

        self.isChanged = 0
        oldDir = os.getcwd()
        os.chdir(path)
        try:
            fileName = self.name + ".elp" 
            zippedFile = zipfile.ZipFile(fileName, "w", zipfile.ZIP_DEFLATED)
            zippedFile.writestr("content.data", persist.encodeObject(self))
            zippedFile.close()
        finally:
            os.chdir(oldDir)

    def load(path):
        """Load package from disk, returns a package"""
        zippedFile = zipfile.ZipFile(path, "r", zipfile.ZIP_DEFLATED)
        toDecode = zippedFile.read("content.data")
        return persist.decodeObject(toDecode)
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
