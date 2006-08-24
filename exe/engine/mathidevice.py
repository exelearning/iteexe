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
MathIdevice: just has a block of text
"""

import logging
from exe.engine.idevice import Idevice
from exe.engine.field   import MathField
log = logging.getLogger(__name__)


# ===========================================================================
class MathIdevice(Idevice):
    """
    MathIdevice: just has a block of text
    """
    

    def __init__(self, instruc="", latex=""):
        Idevice.__init__(self, x_(u"Maths"), 
                         x_(u"University of Auckland"), 
                         x_(u"""The majority of a learning resource will be 
establishing context, delivering instructions and providing general information.
This provides the framework within which the learning activities are built and 
delivered."""), "", "")
        self.emphasis = Idevice.NoEmphasis
        self.content  = MathField(x_(u"Maths"), 
                                      x_(u"""Use this field to enter latex. """))
        self.content.idevice = self



   # def upgradeToVersion1(self):
    #    """
     #   Upgrades the node from version 0 (eXe version 0.4) to 1.
      #  Adds icon
       # """
        #self.icon = ""


# ===========================================================================
