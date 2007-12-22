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

    persistenceVersion = 2
    
    def __init__(self, defaultMedia = None):
        Idevice.__init__(self, 
                         x_(u"MP3"), 
                         x_(u"Auckland University of Technology"), 
                         x_(u"The MP3 iDevice allows you to attach an MP3 " 
                            "media file to your content along with relevant textual"
                            "learning instructions."),
                         u"", 
                         u"")
        self.emphasis                    = Idevice.NoEmphasis
        self.media                       = MultimediaField(
                                           x_(u"Choose an MP3 file"),
                                           x_(u""
            "<ol>"
            "  <li>Click &lt;Select an MP3&gt; and browse to the MP3 "
            "      file you wish to insert</li>"
            " <li>Click on the dropdown menu to select the position "
            "       that you want the file displayed on screen.</li>"
            "  <li>Enter an optional caption for your file.</li>"
            " <li>Associate any relevant text to the MP3 file.</li>"
            " <li>Choose the type of style you would like the iDevice to"
            "       display e.g. 'Some emphasis' "
            "applies a border and icon to the iDevice content displayed.</li>"
            "</ol>"
            ))
        self.media.idevice               = self
        self.text                        = TextAreaField(x_(u"Text"),
                                           x_("""Enter the text you wish to 
associate with the file."""))
        self.text.idevice                = self
        self.float                       = u"left"
        self.caption                     = u""
        self.icon                        = u"multimedia"
        self._captionInstruc             = x_(u"""Provide a caption for the 
MP3 file. This will appear in the players title bar as well.""")
       
        self._alignInstruc               = x_(u"""Alignment allows you to 
choose where on the screen the media player will be positioned.""")
        self.systemResources += ['xspf_player.swf']
       
    # Properties
    captionInstruc     = lateTranslate('captionInstruc')
    alignInstruc       = lateTranslate('alignInstruc')


    def getResourcesField(self, this_resource):
        """
        implement the specific resource finding mechanism for this iDevice:
        """
        # be warned that before upgrading, this iDevice field could not exist:
        if hasattr(self, 'media') and hasattr(self.media, 'mediaResource'):
            if this_resource == self.media.mediaResource:
                return self.media

        # be warned that before upgrading, this iDevice field could not exist:
        if hasattr(self, 'text') and hasattr(self.text, 'images'):
            for this_image in self.text.images:
                if hasattr(this_image, '_imageResource') \
                and this_resource == this_image._imageResource:
                    return self.text

        return None
       

    def upgradeToVersion2(self):
        """
        (We skipped version 1 by accident)
        Upgrades to 0.22
        """
        self.systemResources += ['xspf_player.swf']
    

   
# ===========================================================================
