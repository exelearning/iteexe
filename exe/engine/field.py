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

import logging
from exe.engine.persist   import Persistable
from exe.engine.path      import Path
from exe.engine.translate import lateTranslate
from HTMLParser           import HTMLParser
from exe.engine.flvreader import FLVReader
import re
import re
import urllib
log = logging.getLogger(__name__)


# ===========================================================================
class Field(Persistable):
    """
    A Generic iDevice is built up of these fields.  Each field can be
    rendered as an XHTML element
    """
    # Class attributes
    nextId = 1

    persistenceVersion = 1

    def __init__(self, name, instruc=""):
        """
        Initialize 
        """
        self._name     = name
        self._instruc  = instruc
        self._id       = Field.nextId
        Field.nextId  += 1
        self.idevice   = None

    # Properties
    name    = lateTranslate('name')
    instruc = lateTranslate('instruc')

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


    def delete(self):
        """
        Do any special processing when deleted
        Overridden by derieved classes
        """
        pass


    def upgradeToVersion1(self):
        """
        Upgrades to exe v0.10
        """
        self._name    = self.__dict__['name']
        # Pre 0.5 packages need special care
        if self.__dict__.has_key('instruc'):
            self._instruc = self.__dict__['instruc']
        else:
            self._instruc = self.__dict__['instruction']


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



# ===========================================================================
class FeedbackField(Field):
    """
    A Generic iDevice is built up of these fields.  Each field can be
    rendered as an XHTML element
    """
    def __init__(self, name, instruc=""):
        """
        Initialize 
        """
        Field.__init__(self, name, instruc)
        self.buttonCaption = _(u"Click Here")
        self.feedback      = ""



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
        Store the image in the package
        Needs to be in a package to work.
        """
        log.debug(u"setImage "+unicode(imagePath))
        resourceFile = Path(imagePath)

        assert(self.idevice.parentNode,
               'Image '+self.idevice.id+' has no parentNode')
        assert(self.idevice.parentNode.package,
               'iDevice '+self.idevice.parentNode.id+' has no package')

        if resourceFile.isfile():
            self.delete()
            package = self.idevice.parentNode.package

            self.imageName = self.id + u"_" + unicode(resourceFile.basename())
            package.addResource(resourceFile, self.imageName)

        else:
            log.error('File %s is not a file' % resourceFile)


    def delete(self):
        """
        Delete the image from the package
        Needs to be in a package to work.
        """
        assert(self.idevice.parentNode,
               'Image '+self.idevice.id+' has no parentNode')
        assert(self.idevice.parentNode.package,
               'iDevice '+self.idevice.parentNode.id+' has no package')

        if self.imageName:
            package = self.idevice.parentNode.package
            package.deleteResource(self.imageName)


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

class ClozeHTMLParser(HTMLParser):
    """
    Separates out gaps from our raw cloze data
    """

    # Default attribute values
    result = None
    inGap = False
    lastGap = ''
    lastText = ''
    whiteSpaceRe = re.compile(r'\s+')
    paragraphRe = re.compile(r'(\r\n\r\n)([^\r]*)(\1)')

    def reset(self):
        """
        Make our data ready
        """
        HTMLParser.reset(self)
        self.result = []
        self.inGap = False
        self.lastGap = ''
        self.lastText = ''

    def handle_starttag(self, tag, attrs):
        """
        Turn on inGap if necessary
        """
        if tag.lower() == 'span':
            attrs = dict(attrs)
            style = attrs.get('style', '')
            if 'underline' in style:
                self.inGap = True
        elif tag.lower() == 'br':
            if self.inGap:
                self.lastGap += '<br/>' 
            else:
                self.lastText += '<br/>' 

    def handle_endtag(self, tag):
        """
        Turns of inGap
        """
        if tag.lower() == 'span' and self.inGap:
            self.inGap = False
            self._endGap()

    def _endGap(self):
        """
        Handles finding the end of gap
        """
        # Tidy up and possibly split the gap
        gapString = self.lastGap.strip()
        gapWords = self.whiteSpaceRe.split(gapString)
        gapSpacers = self.whiteSpaceRe.findall(gapString)
        if len(gapWords) > len(gapSpacers):
            gapSpacers.append(None)
        gaps = zip(gapWords, gapSpacers)
        lastText = self.lastText
        for gap, text in gaps:
            if gap == '<br/>':
                self.result.append((lastText, None))
            else:
                self.result.append((lastText, gap))
            lastText = text
        self.lastGap = ''
        self.lastText = ''

    def handle_data(self, data):
        """
        Adds the data to either lastGap or lastText
        """
        if self.inGap:
            self.lastGap += data
        else:
            self.lastText += data

    def close(self):
        """
        Fills in the last bit of result
        """
        if self.lastText:
            self._endGap()
            #self.result.append((self.lastText, self.lastGap))
        HTMLParser.close(self)


# ===========================================================================

class ClozeField(Field):
    """
    This field handles a passage with words that the student must fill in
    """

    # Class Attributes
    regex = re.compile('(%u)((\d|[A-F]){4})', re.UNICODE)

    def __init__(self, name, instruc):
        """
        Initialise
        """
        Field.__init__(self, name, instruc)
        self.parts = []
        self._encodedContent = ''
        self.autoCompletion = True
        self.autoCompletionInstruc = _(u"""Allow auto completion when 
                                       user filling the gaps.""")

    # Property handlers
    def set_encodedContent(self, value):
        """
        Cleans out the encoded content as it is passed in. Makes clean XHTML.
        """
        value = value.replace('&quot;', '"')
        value = value.replace('&amp;', '&')
        parser = ClozeHTMLParser()
        parser.feed(value)
        parser.close()
        self.parts = parser.result
        encodedContent = ''
        for shown, hidden in parser.result:
            encodedContent += shown
            if hidden:
                encodedContent += ' <span'
                encodedContent += \
                    '  style=&quot;text-decoration:underline&quot;>'
                encodedContent += hidden
                encodedContent += '</span> ' 
        self._encodedContent = encodedContent
    
    # Properties
    encodedContent = property(lambda self: self._encodedContent, 
                              set_encodedContent)

    def upgradeToVersion1(self):
        """
        Upgrades to exe v0.11
        """
        self.autoCompletion = True
        self.autoCompletionInstruc = _(u"""Allow auto completion when 
                                       user filling the gaps.""")
# ===========================================================================


class FlashField(Field):
    """
    A Generic iDevice is built up of these fields.  Each field can be
    rendered as an XHTML element
    """
    def __init__(self, name, instruc=""):
        """
        """
        Field.__init__(self, name, instruc)
        self.width        = 300
        self.height       = 250
        self.flashName    = ""


    def getResources(self):
        """
        Return the resource files (if any) used by this Field
        Overridden by derieved classes
        """
        return [self.flashName]


    def setFlash(self, flashPath):
        """
        Store the image in the package
        Needs to be in a package to work.
        """
        log.debug(u"setFlash "+unicode(flashPath))
        resourceFile = Path(flashPath)

        assert(self.idevice.parentNode,
               'Flash '+self.idevice.id+' has no parentNode')
        assert(self.idevice.parentNode.package,
               'iDevice '+self.idevice.parentNode.id+' has no package')

        if resourceFile.isfile():
            self.delete()
            package = self.idevice.parentNode.package

            self.flashName = self.id + u"_" + unicode(resourceFile.basename())
            package.addResource(resourceFile, self.flashName)

        else:
            log.error('File %s is not a file' % resourceFile)


    def delete(self):
        """
        Delete the flash from the package
        Needs to be in a package to work.
        """
        assert(self.idevice.parentNode,
               'Flash '+self.idevice.id+' has no parentNode')
        assert(self.idevice.parentNode.package,
               'iDevice '+self.idevice.parentNode.id+' has no package')

        if self.flashName:
            package = self.idevice.parentNode.package
            package.deleteResource(self.flashName)


# ===========================================================================

class FlashMovieField(Field):
    """
    A Generic iDevice is built up of these fields.  Each field can be
    rendered as an XHTML element
    """
    def __init__(self, name, instruc=""):
        """
        """
        Field.__init__(self, name, instruc)
        self.width        = 300
        self.height       = 250
        self.flashName    = ""


    def getResources(self):
        """
        Return the resource files (if any) used by this Field
        Overridden by derieved classes
        """
        return [self.flashName]


    def setFlash(self, flashPath):
        """
        Store the image in the package
        Needs to be in a package to work.
        """
        log.debug(u"setFlash "+unicode(flashPath))
        resourceFile = Path(flashPath)

        assert(self.idevice.parentNode,
               'Flash '+self.idevice.id+' has no parentNode')
        assert(self.idevice.parentNode.package,
               'iDevice '+self.idevice.parentNode.id+' has no package')

        if resourceFile.isfile():
            self.delete()
            package = self.idevice.parentNode.package

            self.flashName = self.id + u"_" + unicode(resourceFile.basename())
            package.addResource(resourceFile, self.flashName)
            flvDic = FLVReader(resourceFile)
            self.height = flvDic["height"] +30        
            self.width = flvDic["width"]

        else:
            log.error('File %s is not a file' % resourceFile)


    def delete(self):
        """
        Delete the flash from the package
        Needs to be in a package to work.
        """
        assert(self.idevice.parentNode,
               'Flash '+self.idevice.id+' has no parentNode')
        assert(self.idevice.parentNode.package,
               'iDevice '+self.idevice.parentNode.id+' has no package')

        if self.flashName:
            package = self.idevice.parentNode.package
            package.deleteResource(self.flashName)


# ===========================================================================


class DiscussionField(Field):
    def __init__(self, name, instruc="", content="" ):
                 
        """
        Initialize 
        """
        Field.__init__(self, name, instruc)
        self.content = content
        self.instruc = "Type a discussion topic here."

    
# ===========================================================================