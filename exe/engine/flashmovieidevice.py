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
A FlashWithText Idevice is one built up from a flash file and free text.
"""

import logging
from exe.engine.idevice   import Idevice
from exe.engine.field     import TextAreaField, FlashMovieField
from exe.engine.translate import lateTranslate

log = logging.getLogger(__name__)

# ===========================================================================
class FlashMovieIdevice(Idevice):
    """
    A FlashMovie Idevice is one built up from a flash file and free text.
    """
    persistenceVersion = 2

    def __init__(self):
        Idevice.__init__(self, x_(u"Flash Movie"), 
                         x_(u"University of Auckland"), 
                         x_(u"""\
This iDevice only supports the Flash Video File (.FLV) format, and will not
accept other video formats. You can however convert other movie formats
(e.g. mov, wmf etc) into the .FLV format using third party encoders. These
are not supplied with eXe. Users will also need to download the Flash 8
player from http://www.macromedia.com/ to play the video."""),
                         u"",
                         u"")
        self.emphasis         = Idevice.NoEmphasis
        self.flash            = FlashMovieField(x_(u"Flash Movie")) 
        self.flash.idevice    = self
        self.text             = TextAreaField(x_(u"Description"), x_("""Enter 
the text you wish to associate with the file."""))
        self.text.idevice     = self
        self.float            = u"left"
        self.caption          = ""
        self.captionInstruc   = x_(u"""Provide a caption for the flash movie 
you have just inserted.""")
        self.systemResources += ['videoContainer.swf']
    
    # Properties
    captionInstruc = lateTranslate('captionInstruc')


    def upgradeToVersion2(self):
        """
        Upgrades to v0.12
        """
        self._upgradeIdeviceToVersion2()
        self.flash._upgradeFieldToVersion2()
        self.systemResources += ['videoContainer.swf']

        
# ===========================================================================
