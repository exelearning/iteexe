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
A ImageMagnifier Idevice is one built up from an image and free text.
"""

import logging
from exe.engine.idevice   import Idevice
from exe.engine.field     import TextAreaField, MultimediaField
from exe.engine.translate import lateTranslate
log = logging.getLogger(__name__)

# ===========================================================================
class MultimediaIdevice(Idevice):
    """
    A Multimedia Idevice is one built up from an Multimedia file and free text.
    """

    persistenceVersion = 1
    
    def __init__(self, defaultMedia = None):
        Idevice.__init__(self, 
                         x_(u"MP3 With Text"), 
                         x_(u"University of Auckland"), 
                         x_(u""), 
                         u"", u"")
        self.emphasis                    = Idevice.NoEmphasis
        self.media                       = MultimediaField(
                                           x_(u"Choose a MP3 file"), x_(u"""Click 
on the picture below or the "Add MP3" button to select a MP3 file to be 
embed."""))
        self.media.idevice               = self
        self.text                        = TextAreaField(x_(u"Text"),
                                           x_("""Enter the text you wish to 
associate with the file."""))
        self.text.idevice                = self
        self.float                       = u"left"
        self.caption                     = u""
        self.icon                        = u"inter"
        self._captionInstruc             = x_(u"""Provide a caption for the 
MP3 file.""")
       
        self._alignInstruc               = x_(u"""Alignment allows you to 
choose where on the screen the media player will be positioned.""")
       
    # Properties
    captionInstruc     = lateTranslate('captionInstruc')
    alignInstruc       = lateTranslate('alignInstruc')
   
def register(ideviceStore):
    """Register with the ideviceStore"""
    ideviceStore.extended.append(MultimediaIdevice())

   
# ===========================================================================
