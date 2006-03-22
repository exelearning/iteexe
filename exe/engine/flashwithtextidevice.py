# ===========================================================================
# eXe 
# Copyright 2004-2006, University of Auckland
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
A FlashWithText Idevice is one built up from a flash file and free text.
"""

import logging
from exe.engine.idevice   import Idevice
from exe.engine.field     import TextAreaField, FlashField
from exe.engine.translate import lateTranslate

log = logging.getLogger(__name__)

# ===========================================================================
class FlashWithTextIdevice(Idevice):
    """
    A FlashWithText Idevice is one built up from a flash file and free text.
    """

    persistenceVersion = 3

    def __init__(self):
        Idevice.__init__(self, x_(u"Flash with Text"), 
                         x_(u"University of Auckland"), 
                         x_(u"""The flash with text idevice allows you to 
associate additional textual information to a flash file. This may be useful 
where you wish to provide educational instruction regarding the flash file 
the learners will view."""), u"", u"")
        self.emphasis          = Idevice.NoEmphasis
        self.flash             = FlashField(x_(u"Flash with Text"), u"")
        self.flash.idevice     = self
        self.text              = TextAreaField(x_(u"Description"),
                                 x_("""Enter the text you wish to 
                                 associate with the image."""))
        self.text.idevice      = self
        self.float             = u"left"
        self.caption           = u""
        self._captionInstruc   = x_(u"""Provide a caption for the flash you 
                                  have just inserted.""")
        self._dimensionInstruc = x_(u"""Enter the flash display 
dimensions (in pixels) and determine the alignment of the image on screen. 
The width and height dimensions will alter proportionally.""")

    # Properties
    captionInstruc   = lateTranslate('captionInstruc')
    dimensionInstruc = lateTranslate('dimensionInstruc')
    
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
        self.flash._upgradeFieldToVersion2()

    def upgradeToVersion3(self):
        """
        Upgrades to v0.13
        """
        self._captionInstruc   = x_(u"""Provide a caption for the flash you 
                                  have just inserted.""")
        self._dimensionInstruc = x_(u"""Enter the flash display 
dimensions (in pixels) and determine the alignment of the image on screen. 
The width and height dimensions will alter proportionally.""")
        self.flash._upgradeFieldToVersion3()
        
# ===========================================================================
