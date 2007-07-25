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
from exe.engine.freetextidevice   import FreeTextIdevice
from exe                       import globals as G
import os

log = logging.getLogger(__name__)

# ===========================================================================
class FlashWithTextIdevice(Idevice):
    """
    A FlashWithText Idevice is one built up from a flash file and free text.
    """

    #persistenceVersion = 4
    # r3m0: putting this back to version 3, now that we will still keep FlashWithText around,
    # and simply disable it from the config file.
    #persistenceVersion = 3
    # or, so that we don't have to put our exe's generic.data back a version, just leave it at:
    persistenceVersion = 4



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
   
    # r3m0: testing this WITHOUT the upgrade, by just disabling from the config file:
    def NoLonger_upgradeToVersion4(self):
        """
        Converting FlashWithTextIdevice -> FreeTextIdevice,
        now that FreeText can hold embeddded .swf Flash Object media.
        
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
              FlashWithTextIdevice -> FreeTextIdevice,
        now that FreeText can hold embeddded images.
        (copied from ImageWithTextIdevice's convertToFreeText)
        """
        new_content = ""
        
        # ensure that an image resource still exists on this ImageWithText,
        # before trying to add it into the FreeText idevice.
        # Why?  corrupt packages have been seen missing resources...
        # (usually in with extra package objects as well, probably
        # from old code doing faulty Extracts, or somesuch nonesense)
        flashResource_exists = False
        if self.flash.flashResource: 
            if os.path.exists(self.flash.flashResource.path) and \
            os.path.isfile(self.flash.flashResource.path): 
                flashResource_exists = True
            else: 
                log.warn("Couldn't find FlashWithText flash when upgrading "\
                        + self.flash.flashResource.storageName)

        # Create the Flash's replaced embed object in EXACTLY the same
        # manner that our tinyMCE media plugin (currently at v2.1.0) would,
        # such that it can recognize and work with it with rountrip edits:
        if flashResource_exists: 
            new_content += "\n"
            # First, the <object> tag:
            new_content += "<object classid=\""
            new_content += "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"
            new_content += "\" codebase=\""
            new_content += "http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0"
            new_content += "\""
            if self.flash.width: 
                new_content += " width=\"" + self.flash.width + "\""
            if self.flash.height:  
                new_content += " height=\"" + self.flash.height + "\""
            new_content += ">\n"
            # then, its src param tag:
            new_content += "    <param name=\"src\" value=\"resources/"
            new_content += self.flash.flashResource.storageName
            new_content += "\" />\n"
            # then, its width param tag:
            if self.flash.width: 
                new_content += "    <param name=\"width\" value=\""
                new_content += self.flash.width
                new_content += "\" />\n"
            # then, its height param tag:
            if self.flash.height: 
                new_content += "    <param name=\"width\" value=\""
                new_content += self.flash.height
                new_content += "\" />\n"
            # and, its embed tag:
            new_content += "    <embed type=\"application/x-shockwave-flash\""
            new_content += " src=\"resources/"
            new_content += self.flash.flashResource.storageName
            new_content += "\" "
            if self.flash.width: 
                new_content += "width=\"" + self.flash.width + "\" "
            if self.flash.height:  
                new_content += "height=\"" + self.flash.height + "\" "
            new_content += "></embed>\n"
            # finally, close the object tag:
            new_content += "</object>\n"
        elif self.flash.flashResource: 
            new_content += "<BR>\n[WARNING: missing .swf Flash Object: " \
                    + self.flash.flashResource.storageName + "]\n"
        

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

        if flashResource_exists: 
            # Not sure why this can't be imported up top, but it gives 
            # ImportError: cannot import name GalleryImages, 
            # so here it be: 
            from exe.engine.galleryidevice  import GalleryImage

            full_flash_path = self.flash.flashResource.path
            new_GalleryImage = GalleryImage(replacementIdev.content, \
                    self.caption,  full_flash_path, mkThumbnail=False)

        # and move it up to the position following this node!
        while ( self.parentNode.idevices.index(replacementIdev) \
                > ( (self.parentNode.idevices.index(self) + 1))):
            replacementIdev.movePrev()

        # finally: delete THIS idevice itself, deleting it from the node
        self.delete()


# ===========================================================================
