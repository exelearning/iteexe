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
ExternalUrlIdevice: just has a block of text
"""

import logging
from exe.engine.idevice import Idevice
log = logging.getLogger(__name__)

# ===========================================================================
class ExternalUrlIdevice(Idevice):
    """
    ExternalUrlIdevice: just has a field for the url
    """

    persistenceVersion = 1

    def __init__(self, content=""):
        Idevice.__init__(self, x_(u"External Web Site"), 
                         x_(u"University of Auckland"), 
                         x_(u"""For use if you need to include an external
web page into your content. Rather than popup an external window, which can have some
problematic usability consequences, this iDevice loads the appropriate content 
into an inline frame. Use only if your content will be online."""), "", "")
        self.emphasis = Idevice.NoEmphasis
        self.url      = ""
        self.height   = "300"

    def upgradeToVersion1(self):
        """
        Upgrades exe to v0.10
        """
        self._upgradeIdeviceToVersion1()
    
# ===========================================================================
