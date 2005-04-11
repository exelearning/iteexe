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
import cStringIO
from twisted.spread  import jelly
from twisted.spread  import banana
from exe.engine.node import Node
from exe.engine.freetextidevice import FreeTextIdevice
from exe.webui.webinterface import g_webInterface

log = logging.getLogger(__name__)
_   = gettext.gettext

# ===========================================================================
class Package(jelly.Jellyable):
    """
    Package represents the collection of resources the user is editing
    i.e. the "package".
    """
    def __init__(self, name):
        """
        Initialize 
        """
        log.debug("init " + repr(name))
        self.levelNames  = [_("Topic"), _("Section"), _("Unit")]
        self.name        = name
        self.draft       = Node(self, [0], _("Draft"))
        self.currentNode = self.draft
        self.root        = Node(self, [1], _("Home"))
        self.author      = ""
        self.description = ""
        self.style       = "default"
        introduction     = "Welcome to eXe<br/>"
        introduction    += "To edit this text click on the pencil icon"
        self.draft.addIdevice(FreeTextIdevice(introduction))
        self.isChanged   = 0
        

    def findNode(self, nodeId):
        """
        Finds a node from its nodeId
        (nodeId can be a string or a list/tuple)
        """
        log.debug("findNode" + repr(nodeId))

        if type(nodeId) is str:
            nodeId = [int(index) for index in nodeId.split(".")]

        if nodeId == self.draft.id: 
            return self.draft

        node  = self.root
        level = 1

        while level < len(nodeId):
            if nodeId[level] < len(node.children):
                node = node.children[nodeId[level]]
            else:
                return None
            level += 1

        return node


    def levelName(self, level):
        """return the level name"""
        
        if level < len(self.levelNames):
            return self.levelNames[level]
        else:
            return _("?????")
        
    
    def save(self, path=None):
        """Save package to disk"""
        if not path:
            path = g_webInterface.config.getDataDir()
             
        log.debug("data directory: " + path)

        self.isChanged = 0
        oldDir = os.getcwd()
        os.chdir(path)
        try:
            fileName = self.name + ".elp" 
            zippedFile = zipfile.ZipFile(fileName, "w", zipfile.ZIP_DEFLATED)

            encoder = banana.Banana()
            encoder.connectionMade()
            encoder._selectDialect("none")
            strBuffer = cStringIO.StringIO()
            encoder.transport = strBuffer
            encoder.sendEncoded(jelly.jelly(self))
            zippedFile.writestr("content.data", strBuffer.getvalue())
            zippedFile.close()
        finally:
            os.chdir(oldDir)
        

    def load(path):
        """Load package from disk, returns a package"""
        zippedFile = zipfile.ZipFile(path, "r", zipfile.ZIP_DEFLATED)
        decoder = banana.Banana()
        decoder.connectionMade()
        decoder._selectDialect("none")
        data = []
        decoder.expressionReceived = data.append
        decoder.dataReceived(zippedFile.read("content.data"))
        zippedFile.close()
        return jelly.unjelly(data[0])

    load = staticmethod(load)

# ===========================================================================
