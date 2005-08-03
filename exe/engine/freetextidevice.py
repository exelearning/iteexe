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
FreeTextIdevice: just has a block of text
"""

import logging
from exe.engine.idevice import Idevice
from exe.engine.field   import TextAreaField
import gettext
_ = gettext.gettext
log = logging.getLogger(__name__)

# ===========================================================================
class FreeTextIdevice(Idevice):
    """
    FreeTextIdevice: just has a block of text
    """
    persistenceVersion = 4

    def __init__(self, content=""):
        Idevice.__init__(self, _(u"Free Text"), 
                         _(u"University of Auckland"), 
                         _(u"""The majority of a learning resource will be 
establishing context, delivering instructions and providing general information.
This provides the framework within which the learning activities are built and 
delivered."""), "", "")
        self.emphasis = Idevice.NoEmphasis
        self.content  = TextAreaField(_(u"Content"), 
_(u"This is a free text field general learning content can be entered."),
                                     content)
        self.content.idevice = self
        if content:
            self.edit = False


    def upgradeToVersion1(self):
        """
        Upgrades the node from version 0 (eXe version 0.4) to 1.
        Adds icon
        """
        self.icon = ""


    def upgradeToVersion2(self):
        """
        Upgrades the node from version 1 (not released) to 2
        Use new Field classes
        """
        self.content = TextAreaField("content", 
_(u"This is a free text field general learning content can be entered."),
                                     self.content)


    def upgradeToVersion3(self):
        """
        Upgrades the node from 2 (v0.5) to 3 (v0.6).
        Old packages will loose their icons, but they will load.
        """
        log.debug(u"Upgrading iDevice")
        self.emphasis = Idevice.NoEmphasis
        
    def upgradeToVersion4(self):
        """
        Upgrades v0.6 to v0.7.
        """
        self.lastIdevice = False
   
# ===========================================================================
