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
A ImageWithText Idevice is one built up from an image and free text.
"""

import logging
from exe.engine.idevice import Idevice
from exe.engine.field   import TextAreaField, FlashField
import gettext
_ = gettext.gettext
log = logging.getLogger(__name__)

# ===========================================================================
class FlashWithTextIdevice(Idevice):
    """
    A FalshWithText Idevice is one built up from an flash and free text.
    """

    def __init__(self, defaultImage = None):
        Idevice.__init__(self, _(u"Falsh with Text"), 
                         _(u"University of Auckland"), 
                         _(u""), u"", u"")
        self.emphasis = Idevice.NoEmphasis
        self.flash = FlashField(_(u"Flash"), 
                                _(u""))
        self.flash.idevice      = self

        self.text = TextAreaField(_(u"Text"))
        self.text.idevice = self
        self.float        = u"left"
        self.caption      = u""
 

    def getResources(self):
        """
        Return the resource files used by this iDevice
        """
        return Idevice.getResources(self) + self.flash.getResources()
       

    def delete(self):
        """
        Delete the flash when this iDevice is deleted
        """
        self.flash.delete()
        Idevice.delete(self)


    
        
# ===========================================================================
