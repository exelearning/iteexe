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
Gallery Idevice. Enables you to easily manage a bunch of images and thumbnails
"""

import logging
from exe.engine.idevice import Idevice
from exe.engine.field   import TextField
from exe.engine.path    import Path
from exe.engine.persist import Persistable
import Image
import gettext
_ = gettext.gettext
log = logging.getLogger(__name__)

# ===========================================================================
class GalleryImage(Persistable):
    """
    Holds a gallery image and its caption. Can produce a thumbnail
    and line itself up with its siblings.
    """

    # Class attributes
    resourcesUrl = 'resources/'

    # Default attribute values
    _parent = None
    _caption = None
    _id = None
    thumbnailSize = (128, 128)
    size = thumbnailSize
    bgColour = 0x808080

    def __init__(self, parent, caption, originalImagePath):
        """
        'parent' is a GalleryIdevice instance
        'caption' is some text that will be displayed with the image
        'originalImagePath' is the local path to the image
        """
        self.parent = parent
        self._caption = TextField(caption)
        self._imageFilename = None
        self._thumbnailFilename = None
        self._saveFiles(originalImagePath)

    def _saveFiles(self, originalImagePath):
        """
        Copies the image file and saves the thumbnail file
        'originalImagePath' is a Path instance
        """
        originalImagePath = Path(originalImagePath)
        # Copy the original image
        filenameTemplate = ('gallery%%s%s.png' % self.id)
        self._imageFilename = filenameTemplate % 'Image'
        package = self.parent.parentNode.package
        package.addResource(originalImagePath, self.imageFilename)
        # Create the thumbnail
        self._thumbnailFilename = filenameTemplate % "Thumbnail"
        image = Image.open(originalImagePath)
        self.size = image.size
        image.thumbnail(self.thumbnailSize, Image.ANTIALIAS)
        image2 = Image.new('RGBA', self.thumbnailSize, (0xFF,0,0,0))
        width1, height1 = image.size
        width2, height2 = image2.size
        left = (width2 - width1) / 2.
        top = (height2 - height1) / 2.
        image2.paste(image, (left, top))
        image2.save(self.thumbnailFilename)

    # Public Methods

    def delete(self):
        """
        Removes our files from resources and removes us from our parent's list
        """
        self.imageFilename.remove()
        self.thumbnailFilename.remove()
        self.parent = None

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

    def set_caption(self, value):
        """
        Lets you set our caption as a string
        """
        self._caption.content = value

    def get_imageFilename(self):
        """
        Returns the full path to the image
        """
        return self.parent.parentNode.package.resourceDir/self._imageFilename

    def set_imageFilename(self, filename):
        """
        Totally changes the image to point to a new filename
        """
        if self._imageFilename:
            self.imageFilename.remove()
            self.thumbnailFilename.remove()
        self._saveFiles(filename)

    def get_thumbnailFilename(self):
        """
        Returns the full path to the thumbnail
        """
        return self.parent.parentNode.package.resourceDir/self._thumbnailFilename

    # Properties

    imageFilename = property(get_imageFilename, set_imageFilename)
    thumbnailFilename = property(get_thumbnailFilename)
    parent  = property(lambda self: self._parent, set_parent)
    caption = property(lambda self: unicode(self._caption.content), set_caption)
    src = property(lambda self: '%s%s' % 
                   (self.resourcesUrl , self._imageFilename))
    thumbnailSrc = property(lambda self: '%s%s' %
                            (self.resourcesUrl, self._thumbnailFilename))
    # id is unique on this page even out side of the block
    id = property(lambda self: self._id)
    index = property(lambda self: self.parent.images.index(self))


# ===========================================================================
class GalleryImages(Persistable, list):
    """
    Allows easy access to gallery images
    """

    def __init__(self, idevice):
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


# ===========================================================================
class GalleryIdevice(Idevice):
    """
    Gallery Idevice. Enables you to easily manage a bunch of images and
    thumbnails.
    """

    def __init__(self, parentNode=None):
        Idevice.__init__(self, _(u"Image Gallery"), 
                         _(u"University of Auckland"), 
                         _(u"This Idevice exists to show a group of images in "
                            "an easily understandable way. For example to show "
                            "many different sample solutions in the form of "
                            "images"),
                         _(u"Use this Idevice if you have a lot of images to "
                            "show."),
                            "",
                            parentNode)
        self.emphasis = Idevice.SomeEmphasis
        self.nextImageId = 0
        self.images = GalleryImages(self)
        self.currentImageIndex = 0

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

