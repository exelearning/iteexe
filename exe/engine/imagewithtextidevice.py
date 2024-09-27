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
A ImageWithText Idevice is one built up from an image and free text.
"""

import logging
from exe.engine.idevice   import Idevice
from exe.engine.field     import TextAreaField, ImageField
from exe.engine.translate import lateTranslate
from exe.engine.freetextidevice   import FreeTextIdevice
from exe                       import globals as G
import os

log = logging.getLogger(__name__)

# ===========================================================================
class ImageWithTextIdevice(Idevice):
    """
    A ImageWithText Idevice is one built up from an image and free text.
    """
    persistenceVersion = 8

    def __init__(self, defaultImage = None):
        Idevice.__init__(self, 
                         x_("Image with Text"), 
                         x_("University of Auckland"), 
                         x_("""<p>
The image with text iDevice can be used in a number of ways to support both
the emotional (affective) and learning task (cognitive) dimensions of eXe
content. 
</p><p>
<b>Integrating visuals with verbal summaries</b>
</p><p>
Cognitive psychologists indicate that presenting learners with a
representative image and corresponding verbal summary (that is presented
simultaneously) can reduce cognitive load and enhance learning retention.
This iDevice can be used to present an image (photograph, diagram or
graphic) with a brief verbal summary covering the main points relating to
the image. For example, if you were teaching the functions of a four-stroke
combustion engine, you could have a visual for each of the four positions of
the piston with a brief textual summary of the key aspects of each visual.
</p>"""), "", "")
        self.emphasis           = Idevice.NoEmphasis
        self.image              = ImageField(x_("Image"), "")
        self.image.idevice      = self
        self.image.defaultImage = defaultImage
        self.text               = TextAreaField(x_("Text"),
                                                x_("""Enter the text you wish to 
                                                associate with the image."""))
        self.text.idevice       = self
        self.float              = "left"
        self.caption            = ""
        self._captionInstruc    = x_("""Provide a caption for the image 
you have just inserted.""")

    # Properties
    captionInstruc = lateTranslate('captionInstruc')
    
    def upgradeToVersion1(self):
        """
        Called to upgrade from 0.5 release
        """
        self.float = "left"
       

    def upgradeToVersion2(self):
        """
        Called to upgrade from 0.6 release
        """
        self.caption  = ""
        self.emphasis = Idevice.NoEmphasis
        

    def upgradeToVersion3(self):
        """
        Upgrades v0.6 to v0.7.
        """
        self.lastIdevice = False

        
    def upgradeToVersion4(self):
        """
        Upgrades to exe v0.10
        """
        self._upgradeIdeviceToVersion1()


    def upgradeToVersion5(self):
        """
        Upgrades to v0.12
        """
        log.debug("upgrade to version 5")
        self._upgradeIdeviceToVersion2()        
        self.image._upgradeFieldToVersion2()
        
    def upgradeToVersion6(self):
        """
        Called to upgrade from 0.13 release
        """
        self._captionInstruc  = x_("""Provide a caption for the image 
you have just inserted.""")

    def upgradeToVersion7(self):
        """
        Called to upgrade to version 0.24
        """
        self.image.isFeedback = False

    def upgradeToVersion8(self):
        """
        Converting ImageWithTextIdevice -> FreeTextIdevice,
        now that FreeText can hold embeddded images.

        BUT - due to the inconsistent loading of the objects via unpickling,
        since the resources aren't necessarily properly loaded and upgraded,
        NOR is the package necessarily, as it might not even have a list of
        resources yet, all of this conversion code must be done in an
        afterUpgradeHandler
        """ 
        G.application.afterUpgradeHandlers.append(self.convertToFreeText)

    def convertToFreeText(self):
        """
        Actually do the Converting of 
              ImageWithTextIdevice -> FreeTextIdevice,
        now that FreeText can hold embeddded images.
        """
        new_content = ""

        # ensure that an image resource still exists on this ImageWithText,
        # before trying to add it into the FreeText idevice.
        # Why?  corrupt packages have been seen missing resources...
        # (usually in with extra package objects as well, probably
        # from old code doing faulty Extracts, or somesuch nonesense)
        imageResource_exists = False
        if self.image.imageResource:
            # also ensure that it has the correct md5 checksum, since there was 
            # a period in which resource checksums were being created before
            # the resource zip file was fully closed, and not flushed out:
            self.image.imageResource.checksumCheck()

            if os.path.exists(self.image.imageResource.path) and \
            os.path.isfile(self.image.imageResource.path): 
                imageResource_exists = True
            else:
                log.warn("Couldn't find ImageWithText image when upgrading "\
                        + self.image.imageResource.storageName)

        if imageResource_exists:
            new_content += "<img src=\"resources/" \
                    + self.image.imageResource.storageName + "\" " 
            if self.image.height:
                new_content += "height=\"" + self.image.height + "\" " 
            if self.image.width:
                new_content += "width=\"" + self.image.width + "\" " 
            new_content += "/> \n"
        elif self.image.imageResource:
            new_content += "<BR>\n[WARNING: missing image: " \
                    + self.image.imageResource.storageName + "]\n"


        if self.caption != "": 
            new_content += "<BR>\n[" + self.caption + "]\n"

        if self.text.content != "": 
            new_content += "<P>\n" + self.text.content + "\n"
        # note: this is given a text field which itself did NOT yet have
        # any embedded media! easier, eh?

        replacementIdev = FreeTextIdevice(new_content)


        ###########
        # now, copy that content field's content into its _w_resourcePaths,
        # and properly remove the resource directory via Massage....
        # for its _wo_resourcePaths:
        # note that replacementIdev's content field's content 
        # is automatically set at its constructor (above),
        # as is the default content_w_resourcePaths (a copy of content)
        # AND the default content_wo_resourcePaths (a copy of content),
        # so only need to update the content_wo_resourcePaths:
        replacementIdev.content.content_wo_resourcePaths = \
                replacementIdev.content.MassageContentForRenderView( \
                    replacementIdev.content.content_w_resourcePaths)
        # Design note: ahhhhh, the above is a good looking reason to possibly
        # have the MassageContentForRenderView() method
        # just assume its content_w_resourcePaths as the input
        # and write the output to its content_wo_resourcePaths.....
        #######
        
        # next step, add the new IDevice into the same node as this one
        self.parentNode.addIdevice(replacementIdev)
        
        # in passing GalleryImage into the FieldWithResources, 
        # that content field needs to be sure to have an updated 
        # parentNode, courtesy of its idevice: 
        replacementIdev.content.setParentNode()

        # and semi-manually add/create the current image
        # resource into the FreeTextIdevice's TextAreaField, content.
        # the content text will have already been taken care of above,
        # including the ideal <img src=...> including resources path,
        # but still need the actual image resource:
        
        if imageResource_exists:
            # Not sure why this can't be imported up top, but it gives 
            # ImportError: cannot import name GalleryImages, 
            # so here it be: 
            from exe.engine.galleryidevice  import GalleryImage 
            
            full_image_path = self.image.imageResource.path
            new_GalleryImage = GalleryImage(replacementIdev.content, \
                    self.caption,  full_image_path, mkThumbnail=False)

        # and move it up to the position following this node!
        while ( self.parentNode.idevices.index(replacementIdev) \
                > ( (self.parentNode.idevices.index(self) + 1))):
            replacementIdev.movePrev()

        # finally: delete THIS idevice itself, deleting it from the node
        self.delete()

   
    def getResourcesField(self, this_resource):
        """
        implement the specific resource finding mechanism for this iDevice:
        """
        # be warned that before upgrading, this iDevice field could not exist:
        if hasattr(self, 'image') and hasattr(self.image, 'imageResource'):
            if this_resource == self.image.imageResource:
                return self.image

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

                
# ===========================================================================
