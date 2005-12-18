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
A Forum Idevice is one built up from forum imformation ans discussion.
"""

import logging
from exe.engine.idevice import Idevice

log = logging.getLogger(__name__)

# ===========================================================================
class ForumIdevice(Idevice):
    """
    A Forum Idevice is one built up from forum imformation ans discussion.
    """
    
    persistenceVersion = 2

    def __init__(self):
        Idevice.__init__(self, x_(u"Forum Discussion"), 
                         x_(u"University of Auckland"), 
                         "", "", "")
        self.forumName           = ""
        self.type                = "general"
        self.introduction        = ""
        self.studentpost         = "2"
        self.subscription        = "0"
        self.groupmode           = "0"
        self.visible             = "1"
        self.discussionSubject   = ""
        self.discussionMessage   = ""
        self.nameInstruc         = ""
        self.typeInstruc         = ""
        self.introInstruc        = ""
        self.postInstruc         = ""
        self.subscInstruc        = ""
        self.groupInstruc        = ""
        self.visibleInstruc      = ""
        self.subjectInstruc      = ""
        self.messageInstruc      = ""
 

    def getResources(self):
        """
        Return the resource files used by this iDevice
        """
        return Idevice.getResources(self)
    
   
    def upgradeToVersion1(self):
        """
        Upgrades exe to v0.10
        """
        self._upgradeIdeviceToVersion1()
    

    def upgradeToVersion2(self):
        """
        Upgrades to v0.12
        """
        self._upgradeIdeviceToVersion2()


# ===========================================================================

