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

import sys
import types
import logging
import gettext
from exe.engine.node import Node
from exe.engine.freetextidevice import FreeTextIdevice
from exe.webui.webinterface import g_webInterface

log = logging.getLogger(__name__)
_   = gettext.gettext

# ===========================================================================
class Package:
    """
    Package represents the collection of resources the user is editing
    i.e. the "package".
    """
    def __init__(self, name, language = "English"):
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
        self.language    = language  
        introduction     = _("Welcome to eXe") + "<br/>"
        introduction    += _("To edit this text click on the pencil icon")
        self.draft.addIdevice(FreeTextIdevice(introduction))
        

    def findNode(self, nodeId):
        """
        Finds a node from its nodeId
        (nodeId can be a string or a list/tuple)
        """
        log.debug("findNode" + repr(nodeId))

        if type(nodeId) is str:
            nodeId = [int(x) for x in nodeId.split(".")]

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
        if level < len(self.levelNames):
            return self.levelNames[level]
        else:
            return _("?????")
        
    def getLanguage(self):
        filename = ""
        if self.language == "French":
            filename = "fr.mo"
        elif self.language == "German":
            filename = "ge.mo"
        elif self.language == "Chinese":
            filename = "ch.mo"
        
        if filename == "":
            return gettext.gettext
        else:
            exeDir = g_webInterface.config.exeDir
            return gettext.GNUTranslations(open(exeDir + "/po/" + filename)).gettext
        

# ===========================================================================
