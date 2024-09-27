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
Gallery Idevice. Enables you to easily manage a bunch of images and thumbnails
"""

import codecs
import logging
import os

from copy import copy, deepcopy
from PIL import Image, ImageDraw
from twisted.persisted.styles import requireUpgrade

from exe                  import globals as G
from exe.engine.field     import TextField
from exe.engine.idevice   import Idevice
from exe.engine.path      import Path, TempDirPath, toUnicode
from exe.engine.persist   import Persistable
from exe.engine.resource  import Resource
from exe.engine.translate import lateTranslate
from exe.webui.common     import docType

log = logging.getLogger(__name__)

class _ShowsResources(Persistable):
    """
    Base class for gallery and gallery image.
    In Preview mode, resourcesUrl = 'resources/' but in export mode, resourcesUrl = None.
    Doing it this way, we don't need seperate functions for preview and view/export.
    The ideal solution would be to not have the URL to resources change ever.
    """

    # Class attribute
    resourcesUrl = 'resources/'

    @staticmethod
    def export():
        """
        Turns on export mode.
        """
        _ShowsResources.resourcesUrl = ''

    @staticmethod
    def preview():
        """
        Turns on preview mode.
        """
        _ShowsResources.resourcesUrl = 'resources/'


# ===========================================================================
class GalleryImage(_ShowsResources):
    """
    Holds a gallery image and its caption. Can produce a thumbnail
    and a preview, popup window.
    """
    persistenceVersion = 3

    # Default attribute values
    _parent       = None
    _caption       = None
    _id           = None
    thumbnailSize = (175, 175)
    size          = thumbnailSize
    bgColour      = 0x808080


    def __init__(self, parent, caption, originalImagePath, mkThumbnail=True):
        """
        An instance is created each time an image is included inside the Gallery
        'parent' is a GalleryIdevice instance
        'caption' is some text that will be displayed with the image
        'originalImagePath' is the local path to the image
        'mkThumbnail' allows easier other, non-image, embedding
                      by not attempting a thumbnail where not applicable.
        """
        self.parent             = parent
        self._caption            = TextField(caption)
        self._imageResource     = None
        self._thumbnailResource = None
        self.makeThumbnail = mkThumbnail      
        self._saveFiles(originalImagePath)
        
    def _saveFiles(self, originalImagePath=None):
        """
        Copies the image file and saves the thumbnail file
        'originalImagePath' is a Path instance
        setting 'originalImagePath' to None, will just recreate the
        thumbnail resources from the existing image resource.
        """       
        # protect against corrupt elps with images/resources which have 
        # somehow gone missing (appears to have been due to faulty Extracts)
        if originalImagePath is not None:
            if not os.path.exists(originalImagePath) \
            or not os.path.isfile(originalImagePath):
                # If we can't find the image, apologize to the user...
                log.error("Couldn't find image: %s\n" % (originalImagePath))
                # and then gracefully bow out of the rest of this:
                originalImagePath = None
                # IDEALLY: want to also load and place a "broken image" here,
                # but for now, at least exit gracefully, yah?
                return

        if originalImagePath is not None:
            originalImagePath = Path(originalImagePath)

            # Copy the original image
            self._imageResource = Resource(self.parent, originalImagePath)
        # Create the thumbnail
        if not self.makeThumbnail or self._thumbnailResource is not None:
            return
        try:
            image = Image.open(toUnicode(self._imageResource.path))
        except Exception, e:
            # If we can't load the image, apologize to the user...
            log.error("Couldn't load image: %s\nBecause: %s" % (self._imageResource.path, str(e)))
            image = Image.new('RGBA', self.thumbnailSize, (0xFF, 0, 0, 0))
            self._msgImage(image, _(u"No Thumbnail Available. Could not load original image."))
        self.size = image.size
        try:
            image.thumbnail(self.thumbnailSize, Image.ANTIALIAS)
        except Exception, e:
            # If we can't load the image, apologize to the user...
            log.error("Couldn't shrink image: %s\nBecause: %s" % (self._imageResource.path, str(e)))
            image = Image.new('RGBA', self.thumbnailSize, (0xFF, 0, 0, 0))
            self._msgImage(image, _(u"No Thumbnail Available. Could not shrink original image."))
        image2 = Image.new('RGBA', self.thumbnailSize, (0xFF, 0, 0, 0))
        width1, height1 = image.size
        width2, height2 = image2.size
        left = int(round((width2 - width1) / 2.))
        top = int(round((height2 - height1) / 2.))
        try:
            image2.paste(image, (left, top))
        except IOError:
            # If we cannot handle this type of image, print a nice message in
            # the thumbnail
            self._defaultThumbnail(image2)

        tmpDir = TempDirPath()
        thumbnailPath = Path(tmpDir/self._imageResource.path.namebase + "Thumbnail.png").unique()
        try:
            image2.save(thumbnailPath)
            self._thumbnailResource = Resource(self.parent, thumbnailPath)
        finally:
            thumbnailPath.remove()
            
    def replace(self, originalImagePath):
        """
        JR: Reemplazamos la imagen actual y su thumbnail
        """       
        package = self.parent.parentNode.package
        
        #Borramos la imagen antigua y su miniatura
        if self._imageResource:
            self._imageResource.delete()
        if self.makeThumbnail and self._thumbnailResource:
            self._thumbnailResource.delete()
        
        #Creamos la imagen
        if originalImagePath is not None:
            originalImagePath = Path(originalImagePath)
            self._imageResource = Resource(self.parent, originalImagePath)
        #Creamos la miniatura
        try:
            image = Image.open(toUnicode(self._imageResource.path))
        except Exception, e:
            log.error("Couldn't load image: %s\nBecause: %s" % (self._imageResource.path, str(e)))
            image = Image.new('RGBA', self.thumbnailSize, (0xFF, 0, 0, 0))
            self._msgImage(image, _(u"No Thumbnail Available. Could not load original image."))
        self.size = image.size
        try:
            image.thumbnail(self.thumbnailSize, Image.ANTIALIAS)
        except Exception, e:
            log.error("Couldn't shrink image: %s\nBecause: %s" % (self._imageResource.path, str(e)))
            image = Image.new('RGBA', self.thumbnailSize, (0xFF, 0, 0, 0))
            self._msgImage(image, _(u"No Thumbnail Available. Could not shrink original image."))
        image2 = Image.new('RGBA', self.thumbnailSize, (0xFF, 0, 0, 0))
        width1, height1 = image.size
        width2, height2 = image2.size
        left = int(round((width2 - width1) / 2.))
        top = int(round((height2 - height1) / 2.))
        try:
            image2.paste(image, (left, top))
        except IOError:
            self._defaultThumbnail(image2)
        tmpDir = TempDirPath()
        thumbnailPath = Path(tmpDir/self._imageResource.path.namebase + "Thumbnail.png").unique()
        try:
            image2.save(thumbnailPath)
            self._thumbnailResource = Resource(self.parent, thumbnailPath)
        finally:
            thumbnailPath.remove()

    def _defaultThumbnail(self, image):
        """
        Draws a nice default thumbnail on 'image'
        """
        self._msgImage(image,
            _(u"No Thumbnail Available. Could not shrink image."))

    def _msgImage(self, image, msg):
        """
        Puts a message in an image
        """
        draw = ImageDraw.Draw(image)
        draw.rectangle([(0, 0), self.thumbnailSize], fill="black")
        words = msg.split(' ')
        size = draw.textsize(msg)
        top = 1

        # Word wrap
        while words:
            if top > self.thumbnailSize[1]:
                # Ran over bottom
                break
            # Find the longest string of words that can fit on this line
            for ln in range(len(words), -1, -1):
                size = draw.textsize(' '.join(words[:ln]))
                if size[0] <= self.thumbnailSize[0]: 
                    break
            draw.text((1, top), ' '.join(words[:ln]))
            words = words[ln:]
            top += size[1]

    # Public Methods

    def delete(self):
        """
        Removes our files from resources and removes us from our parent's list
        """
        if self._imageResource:
            self._imageResource.delete()
        if self.makeThumbnail and self._thumbnailResource:
            self._thumbnailResource.delete()
        self.parent = None # This also removes our self from our parent's list

    # Property Handlers

    def set_parent(self, parent):
        """
        Used for changing the parent attribute, handles adding and removing from
        parents images list
        """
        if self._parent is not parent:
            if self._parent:
                self._parent.images.remove(self)
                self._id = None
            if parent:
                parent.images.append(self)
                self._id = parent.genImageId()
            self._parent = parent

    def get_imageFilename(self):
        """
        Returns the full path to the image
        """
        return self._imageResource.path

    def set_imageFilename(self, filename):
        """
        Totally changes the image to point to a new filename
        """
        if self._imageResource:
            self._imageResource.delete()
            if self.makeThumbnail and self._thumbnailResource: 
                self._thumbnailResource.delete()
        self._saveFiles(filename)

    def get_thumbnailFilename(self):
        """
        Returns the full path to the thumbnail
        """
        if (not self.makeThumbnail) or (not self._thumbnailResource): 
            return None
        return self._thumbnailResource.path

    def set_caption(self, value):
        """
        Set's the text of our caption
        """
        self._caption.content = value

    def __repr__(self):
        """
        Represents 'GalleryImage' as a string for the programmer
        """
        return '<GalleryImage for "' + self.get_imageFilename() + '">'



    # Properties

    imageFilename = property(get_imageFilename, set_imageFilename)
    thumbnailFilename = property(get_thumbnailFilename)
    caption = property(lambda self: self._caption.content, set_caption)
    parent  = property(lambda self: self._parent, set_parent)
    imageSrc = property(lambda self: '%s%s' % (self.resourcesUrl , self._imageResource.storageName))

    thumbnailSrc = property(lambda self: '%s%s' % (self.resourcesUrl, self._thumbnailResource.storageName))
    # note that the above thumbnailSrc might also eventually want some 
    # error checking for cases where self.makeThumbnail == false
    # For now, though, it is left to the objects using makeThumbnail==false
    # to not inappropriately reference thumbnailSrc.

    # id is unique on this page even out side of the block
    id = property(lambda self: self._id)
    index = property(lambda self: self.parent.images.index(self))

    def upgradeToVersion1(self):
        """
        Called to upgrade from 0.10 to 0.11
        """
        # Create the HTML popup window
        self._htmlFilename = Path(self._imageFilename).namebase + '.html'

    def _upgradeImageToVersion2(self):
        """
        Upgrades to exe v0.12
        """
        # In case upgradeToVersion1 above has not been called yet
        requireUpgrade(self)
        self._imageResource = Resource(self.parent, Path(self._imageFilename))
        self._thumbnailResource = Resource(self.parent, Path(self._thumbnailFilename))
        self._htmlResource = Resource(self.parent, Path(self._htmlFilename))
        del self._imageFilename
        del self._thumbnailFilename
        del self._htmlFilename

    def _deleteHTMLResource(self):
        """
        Delete our HTML Resource
        """
        if hasattr(self, '_htmlResource') and self._htmlResource:
            self._htmlResource.delete()
            del self._htmlResource

    def upgradeToVersion2(self):
        """
        Upgrades to verison 0.20
        """
        G.application.afterUpgradeHandlers.append(self._deleteHTMLResource)

    def upgradeToVersion3(self):
        """
        Adds new makeThumnail, to support non-image media
        """
        self.makeThumbnail = True

# ===========================================================================
class GalleryImages(Persistable, list):
    """
    Allows easy access to gallery images
    """

    def __init__(self, idevice):
        """
        Just takes the idevice who it is working for
        """
        list.__init__(self)
        self.idevice = idevice

    def __getstate__(self):
        """
        Enables jellying of our list items
        """
        result = Persistable.__getstate__(self)
        result['.listitems'] = list(self)
        return result

    def __setstate__(self, state):
        """
        Enables jellying of our list items
        """
        for item in state['.listitems']:
            self.append(item)
        del state['.listitems']
        Persistable.__setstate__(self, state)

    # Sequence handler functions

    def __getitem__(self, index):
        """
        Allows one to retrieve an image by index or id
        """
        if isinstance(index, int) or isinstance(index, slice):
            return list.__getitem__(self, index)
        else:
            for image in self:
                if image.id == index:
                    return image
            else:
                raise KeyError(index)

    def __delitem__(self, index):
        """
        Cleanly removes the image and its filens
        """
        self[index].delete()

    def __deepcopy__(self, memo):
        """
        Makes sure deepcopy doesn't double the entries in our list
        """
        result = GalleryImages(deepcopy(self.idevice, memo))
        memo[id(self)] = result
        for image in self:
            result.append(deepcopy(image, memo))
        return result

    def __repr__(self):
        """
        Represents 'GalleryImages' as a string for the programmer
        """
        return '<GalleryImages for "' + repr(self.idevice) + '", containing: ' + repr(self[0:len(self)]) + '>'


# ===========================================================================
class GalleryIdevice(_ShowsResources, Idevice):
    """
    Gallery Idevice. Enables you to easily manage a bunch of images and
    thumbnails.
    """

    # Class attributes
    persistenceVersion = 8
    previewSize        = (320.0, 240.0)
    
    # Default attribute values
    _htmlResource      = None

    def __init__(self, parentNode=None):
        """
        Sets up the idevice title and instructions etc
        """
        Idevice.__init__(self, 
                         x_(u"Image Gallery"), 
                         x_(u"eXe Project"), 
                         x_(u"""<p>Where you have a number of images that relate 
to each other or to a particular learning exercise you may wish to display 
these in a gallery context rather then individually.</p>"""),
                         x_(u"Use this Idevice if you have a lot of images to "
                             "show."),
                             "gallery",
                             parentNode)
        self.emphasis          = Idevice.SomeEmphasis
        self.nextImageId       = 0
        self.images            = GalleryImages(self)
        self.currentImageIndex = 0
        self.userResources     = []
        self._titleInstruc     = x_(u'Enter a title for the gallery')
        self._addImageInstr    = x_(u"Click on the Add images button to select "
                                    u"an image file. The image will appear "
                                    u"below where you will be able to label "
                                    u"it. It's always good practice to put "
                                    u"the file size in the label.")
        '''
        self.systemResources += ['exe_lightbox.css']
            etc.
            See scormexport.py and imsexport.py (if common.hasGalleryIdevice(page.node): ...)
            Those files can now be required even if an Image Gallery is not present.
        '''

    # Properties
    addImageInstr = lateTranslate('addImageInstr')
    titleInstruc = lateTranslate('titleInstruc')

    def TwistedRePersist(self):
        if hasattr(self, 'systemResources'):
            self.systemResources = []
        if hasattr(self, 'htmlSrc'):
            del self.htmlSrc
        if hasattr(self, '_htmlResource'):
            if hasattr(self._htmlResource, 'delete'):
                self._htmlResource.delete()
            self._htmlResource = None

        #pedro_pena: Fix bug #1661
        if hasattr(self, 'images'):
            if type(self.images) == list:
                images = self.images
                from exe.engine.galleryidevice  import GalleryImages
                self.images = GalleryImages(self)
                while len(images) > 0:
                    self.images.append(images.pop())

    def getResourcesField(self, this_resource):
        """
        implement the specific resource finding mechanism for this iDevice:
        """
        # be warned that before upgrading, this iDevice field could not exist:
        if hasattr(self, 'images'):
            for this_image in self.images:
                if hasattr(this_image, '_imageResource') \
                and this_resource == this_image._imageResource:
                    return self.images
        return None
       
    def getRichTextFields(self):
        """
        Like getResourcesField(), a general helper to allow nodes to search 
        through all of their fields without having to know the specifics of each
        iDevice type.  
        """
        # GalleryIdevice has no rich-text fields:
        return []
        
    def burstHTML(self, i):
        """
        takes a BeautifulSoup fragment (i) and bursts its contents to 
        import this idevice from a CommonCartridge export
        """
        resourceDir = self.parentNode.package.resourceDir
        
        # GalleryImage Idevice:
        title = i.find(name='h2', attrs={'class' : 'iDeviceTitle' })
        self.title = title.renderContents().decode('utf-8')

        images = i.findAll(name='div', attrs={'class' : 'gallery_image' })
        # image src is stored in the image div tag's value
        captions = i.findAll(name='div', attrs={'class' : 'caption' })
        popup = i.find(name='div', attrs={'class' : 'gallery_popup' })

        for image_loop in range(len(images)):
            image = images[image_loop].attrMap['value'].decode('utf-8')
            caption = captions[image_loop].renderContents().decode('utf-8')
            gallery_image = self.addImage(resourceDir/image)
            gallery_image._caption.content = caption

    def genImageId(self):
        """Generate a unique id for an image.
        Called by 'GalleryImage'"""
        self.nextImageId += 1
        return '%s.%s' % (self.id, self.nextImageId - 1)

    def addImage(self, imagePath):
        """
        Adds a new image to the last taking an image path.
        Generates the thumbnail and the image in
        the resources directory.
        """
        return GalleryImage(self, '', imagePath)

    def recreateResources(self):
        """
        Recreates all the thumbnails and html pages from the original image
        resources.
        """
        log.debug(u'recreateResources for %d images' % (len(self.images)))
        for image in self.images:
            image._saveFiles()

    def _killBadImages(self):
        """
        Kills images that have somehow gotten corrupted and lost their
        reference to their resource (See #601)
        """
        for i in range(len(self.images)-1, -1, -1):
            image = self.images[i]
            if hasattr(image, '_htmlResource'): 
                if image._imageResource is None or image._htmlResource is None:
                    del self.images[i]

    # Upgrade Methods

    def upgradeToVersion1(self):
        """
        Upgrades the node to exe version 0.7
        """
        self.lastIdevice = False

    def upgradeToVersion2(self):
        """
        Upgrades exe to v0.10
        """
        self._upgradeIdeviceToVersion1()

    def upgradeToVersion3(self):
        """
        Upgrades to v0.12
        """
        self._upgradeIdeviceToVersion2()
        for image in self.images:
            image._upgradeImageToVersion2()

    def upgradeToVersion4(self):
        """
        Upgrades to v0.13
        """
        # Recreate all the html and thumbnail resources
        G.application.afterUpgradeHandlers.append(self.recreateResources)

    def upgradeToVersion5(self):
        """
        Upgrades to v0.19
        Some old resources had no storageName.
        """
        self.userResources = [res for res in self.userResources if res.storageName is not None]

    def upgradeToVersion6(self):
        """
        Upgrades to exe version 0.20.alpha (nightlies)
        Some packages were corrupted (See #601).
        """
        # TODO: See what caused this corruption. See #601.
        G.application.afterUpgradeHandlers.append(self._killBadImages)

    def upgradeToVersion7(self):
        """ 
        a wrapper to upgrade_recreateResources(self), such that it might be called 
        after the package has been loaded and upgraded.  Otherwise, due 
        to the seemingly random upgrading of the package and resource objects, 
        this might be called too early.
        """
        G.application.afterUpgradeHandlers.append(self.upgrade_recreateResources)

    def upgradeToVersion8(self):
        """
        Delete icon from system resources
        """
        self._upgradeIdeviceToVersion3()

    def upgrade_recreateResources(self):
        """
        Upgrades to Version 0.20
        """
        package = self.parentNode.package
        # This hack is needed, because jelly doesn't upgrade things in order.
        # Sometimes the child is loaded before the parent
        if not hasattr(package, 'resources'):
            package.resources = {}
        self.recreateResources()


