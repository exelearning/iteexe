# ===========================================================================
# eXe 
# Copyright 2004-2006, University of Auckland
# Copyright 2004-2008 eXe Project, http://eXeLearning.org/
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
from exe.engine.field     import TextAreaField, MagnifierField
from exe.engine.translate import lateTranslate
log = logging.getLogger(__name__)

# ===========================================================================
class ImageMagnifierIdevice(Idevice):
    """
    A ImageMagnifier Idevice is one built up from an image and free text.
    """

    persistenceVersion = 4
    
    def __init__(self, defaultImage = None):
        Idevice.__init__(self, 
                         x_("Image Magnifier"), 
                         x_("University of Auckland"), 
                         x_("""The image magnifier is a magnifying tool enabling
 learners to magnify the view of the image they have been given. Moving the 
magnifying glass over the image allows larger detail to be studied."""), 
                         "", "")
        self.emphasis                    = Idevice.NoEmphasis
        self.imageMagnifier              = MagnifierField(
                                           x_("Choose an Image"), x_("""Click 
on the picture below or the "Add Image" button to select an image file to be 
magnified."""))
        self.imageMagnifier.idevice      = self
        self.imageMagnifier.defaultImage = defaultImage
        self.text                        = TextAreaField(x_("Text"),
                                           x_("""Enter the text you wish to 
associate with the file."""))
        self.text.idevice                = self
        self.float                       = "left"
        self.caption                     = ""
        self._captionInstruc             = x_("""Provide a caption for the 
image to be magnified.""")
        self._dimensionInstruc           = x_("""Choose the size you want 
your image to display at. The measurements are in pixels. Generally, 100 
pixels equals approximately 3cm. Leave both fields blank if you want the 
image to display at its original size.""")
        self._alignInstruc               = x_("""Alignment allows you to 
choose where on the screen the image will be positioned.""")
        self._initialZoomInstruc         = x_("""Set the initial level of zoom 
when the IDevice loads, as a percentage of the original image size""")
        self._maxZoomInstruc             = x_("""Set the maximum level of zoom, 
as a percentage of the original image size""")
        self._glassSizeInstruc           = x_("""Select the size of the magnifying glass""")
        self.systemResources            += ['mojomagnify.js']

    # Properties
    captionInstruc     = lateTranslate('captionInstruc')
    dimensionInstruc   = lateTranslate('dimensionInstruc')
    alignInstruc       = lateTranslate('alignInstruc')
    initialZoomInstruc = lateTranslate('initialZoomInstruc')
    maxZoomInstruc     = lateTranslate('maxZoomInstruc')
    glassSizeInstruc   = lateTranslate('glassSizeInstruc')

   
    def getResourcesField(self, this_resource):
        """
        implement the specific resource finding mechanism for this iDevice:
        """
        # be warned that before upgrading, this iDevice field could not exist:
        if hasattr(self, 'imageMagnifier')\
        and hasattr(self.imageMagnifier, 'imageResource'):
            if this_resource == self.imageMagnifier.imageResource:
                return self.imageMagnifier

        # be warned that before upgrading, this iDevice field could not exist:
        if hasattr(self, 'text') and hasattr(self.text, 'images'):
            for this_image in self.text.images:
                if hasattr(this_image, '_imageResource') \
                and this_resource == this_image._imageResource:
                    return self.text

        return None
       
    def getRichTextFields(self):
        """
        Like getResourcesField(), a general helper to allow nodes to search 
        through all of their fields without having to know the specifics of each
        iDevice type.  
        """
        fields_list = []
        if hasattr(self, 'text'):
            fields_list.append(self.text)

        return fields_list

    def burstHTML(self, i):
        """
        takes a BeautifulSoup fragment (i) and bursts its contents to 
        import this idevice from a CommonCartridge export
        """
        # ImageMagnifier Idevice:
        #======> WARNING - NOT YET BURSTING!!!!!!!!

        #title = i.find(name='span', attrs={'class' : 'iDeviceTitle' })
        #idevice.title = title.renderContents().decode('utf-8')
        # no title for this idevice
        # WARNING: not yet loading the image or its parameters:
        # Could be in the following tag:
        # <param name="FlashVars" \
        #   value="glassSize=2&height=189&width=267 \
        #   &initialZoomSize=100&file=sunflowers.jpg \
        #   &maxZoomSize=150&targetColor=#FF0000&borderWidth=12
                    
        #inner = i.find(name='div', attrs={'class' : 'iDevice_inner' })
        #idevice.fields[0].content = inner.renderContents().decode('utf-8')
        #idevice.fields[0].content_w_resourcePaths = inner.renderContents().decode('utf-8')
        #idevice.fields[0].content_wo_resourcePaths = inner.renderContents().decode('utf-8')

    def upgradeToVersion1(self):
        """
        Upgrades to v0.14
        """
        self._alignInstruc               = x_("""Alignment allows you to 
choose where on the screen the image will be positioned.""")
        self._initialZoomInstruc         = x_("""Set the initial level of zoom 
when the IDevice loads, as a percentage of the original image size""")
        self._maxZoomInstruc             = x_("""Set the maximum level of zoom, 
as a percentage of the original image size""")
        self._glassSizeInstruc           = x_("""This chooses the initial size 
of the magnifying glass""")
        
    def upgradeToVersion2(self):
        """
        Upgrades to v0.24
        """
        self.imageMagnifier.isDefaultImage = False
        
    def upgradeToVersion3(self):
        if 'magnifier.swf' in self.systemResources:
            self.systemResources.remove('magnifier.swf')
        if 'mojomagnify.js' not in self.systemResources:
            self.systemResources.append('mojomagnify.js')

    def upgradeToVersion4(self):
        """
        Delete icon from system resources
        """
        self._upgradeIdeviceToVersion3()
# ===========================================================================
