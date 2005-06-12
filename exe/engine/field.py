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
Simple fields which can be used to build up a generic iDevice.
"""

import re
import logging
from exe.engine.persist import Persistable
from exe.engine.path    import Path
from exe.engine.idevice import Idevice
import gettext
_ = gettext.gettext
log = logging.getLogger(__name__)


# ===========================================================================
class Field(Persistable):
    """
    A Generic iDevice is built up of these fields.  Each field can be
    rendered as an XHTML element
    """
    # Class attributes
    nextId = 1

    def __init__(self, name, instruc=""):
        """
        Initialize 
        """
        self.name     = name
        self.instruc  = instruc
        self._id      = Field.nextId
        Field.nextId += 1
        self.idevice  = None


    def getId(self):
        """
        Returns our id which is a combination of our iDevice's id
        and our own number.
        """
        if self.idevice:
            fieldId = self.idevice.id + "_"
        else:
            fieldId = ""
        fieldId += unicode(self._id)
        return fieldId
    id = property(getId)


    def getResources(self):
        """
        Return the resource files (if any) used by this Field
        Overridden by derieved classes
        """
        return []

# ===========================================================================
class TextField(Field):
    """
    A Generic iDevice is built up of these fields.  Each field can be
    rendered as an XHTML element
    """
    def __init__(self, name, instruc="", content=""):
        """
        Initialize 
        """
        Field.__init__(self, name, instruc)
        self.content = content


    def setContent(self, idevice, content):
        """
        Modify content, overridden for special behaviour
        """
        self.content = content

# ===========================================================================
class TextAreaField(Field):
    """
    A Generic iDevice is built up of these fields.  Each field can be
    rendered as an XHTML element
    """
    def __init__(self, name, instruc="", content=""):
        """
        Initialize 
        """
        Field.__init__(self, name, instruc)
        self.content = content


    def setContent(self, idevice, content):
        """
        Modify content, overridden for special behaviour
        """
        self.content = content

# ===========================================================================

class ImageField(Field):
    """
    A Generic iDevice is built up of these fields.  Each field can be
    rendered as an XHTML element
    """
    def __init__(self, name, instruc=""):
        """
        """
        Field.__init__(self, name, instruc)
        self.width        = ""
        self.height       = ""
        self.imageName    = ""
        self.defaultImage = ""


    def getResources(self):
        """
        Return the resource files (if any) used by this Field
        Overridden by derieved classes
        """
        return [self.imageName]


    def setImage(self, imagePath):
        """
        Store the image pointed to by content in the package
        Needs to be in a package to work.
        """
        log.debug(u"setImage "+unicode(imagePath))
        resourceFile = Path(imagePath)

        assert(self.idevice.parentNode,
               'Image '+self.idevice.id+' has no parentNode')
        assert(self.idevice.parentNode.package,
               'iDevice '+self.idevice.parentNode.id+' has no package')

        if resourceFile.isfile():
            package = self.idevice.parentNode.package

            if self.imageName:
                package.deleteResource(self.imageName)

            self.imageName = self.id + u"_" + unicode(resourceFile.basename())
            package.addResource(resourceFile, self.imageName)

        else:
            log.error('File %s is not a file' % resourceFile)


    def setDefaultImage(self):
        """
        Set a default image to display until the user picks one
        """
        # This is kind of hacky, it's here because we can't just set
        # the an image when we create an ImageField in the idevice 
        # editor (because the idevice doesn't have a package at that
        # stage, and even if it did the image resource wouldn't be
        # copied with the idevice when it was cloned and added to
        # another package).  We should probably revisit this.
        if self.defaultImage:
            self.setImage(self.defaultImage)


# ===========================================================================
