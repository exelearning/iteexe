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
Simple fields which can be used to build up a generic iDevice.
"""

import logging
from exe.engine.persist   import Persistable
from exe.engine.path      import Path
from exe.engine.resource  import Resource
from exe.engine.translate import lateTranslate
from exe.engine.mimetex   import compile
from HTMLParser           import HTMLParser
from exe.engine.flvreader import FLVReader
from htmlentitydefs       import name2codepoint
from exe                  import globals as G
import os
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
    persistenceVersion = 3
    nextId = 1

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
            
    def setIDevice(self, idevice):
        """
        Gives ourselves a new ID unique to the new idevice.
        """
        if hasattr(idevice, 'getUniqueFieldId'):
            self._id = idevice.getUniqueFieldId()
        self._idevice = idevice
        
    def getIDevice(self):
        if hasattr(self, '_idevice'):
            return self._idevice
        else:
            return None
    idevice = property(getIDevice, setIDevice)

    def upgradeToVersion1(self):
        """
        Upgrades to exe v0.10
        """
        self._name = self.__dict__['name']
        del self.__dict__['name']
        # Pre 0.5 packages need special care
        if self.__dict__.has_key('instruc'):
            self._instruc = self.__dict__['instruc']
        else:
            self._instruc = self.__dict__['instruction']

    def upgradeToVersion2(self):
        """
        Upgrades to 0.21
        """
        if 'idevice' in self.__dict__:
            self._idevice = self.__dict__['idevice']
            del self.__dict__['idevice']

    def _upgradeFieldToVersion2(self):
        """
        Called from Idevices to upgrade fields to exe v0.12
        """
        pass
    
    def _upgradeFieldToVersion3(self):
        """
        Called from Idevices to upgrade fields to exe v0.24
        """
        pass

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
class FieldWithResources(Field):
    """
    A Generic iDevice is built up of these fields.  Each field can be
    rendered as an XHTML element.
    Used by TextAreaField, FeedbackField, and ClozeField to encapsulate 
    all the multi-resource handling which can now be included 
    via the tinyMCE RichTextArea.
    """

    persistenceVersion = 1

    def __init__(self, name, instruc="", content=""):
        """
        Initialize 
        """
        Field.__init__(self, name, instruc)
        self.content = content

        # to allow the easiest transition into using this FieldWithResources
        # to hold any number of image (and other) resources, the above
        # content field will still be the main attribute of this object,
        # used in the initial process() as well as output in the selected
        # View/Preview contexts.  But to hold the proper resource paths
        # for these View/Preview contexts, a couple more attributes are
        # introduced:

        # 1, with the paths relative to the resource tree (for Preview)
        self.content_w_resourcePaths = content
        # 2, the paths for AFTER the resources have been exported & flattened:
        self.content_wo_resourcePaths = content

        # Note: usually the corresponding element's render methods can be used,
        # and the above two content_[w/wo]_resourcePaths not used directly,
        # but there will be times in some idevices where specialized
        # rendering might be necessary.


        # Not sure why this can't be imported up top, but it gives 
        # ImportError: cannot import name GalleryImages,
        # so here it be:
        from exe.engine.galleryidevice  import GalleryImages
        ############
        # using GalleryImages' ease in handling all the resource details.
        # the following are expected by GalleryImages:
        self.images = GalleryImages(self)
        self.nextImageId       = 0
        self.parentNode = None
        if hasattr(self.idevice, 'parentNode'): 
            self.parentNode = self.idevice.parentNode
        ############
            
    # genImageId is needed for GalleryImage:    
    def genImageId(self): 
        """
        Generate a unique id for an image. 
        Called by 'GalleryImage'
        """ 
        self.nextImageId += 1 
        return '%s.%s' % (self.id, self.nextImageId - 1)

    def setParentNode(self):
        """
        Mechanism by which the idevice's parentNode is triggered
        into being recognized by this field.  Normally not needed
        until the addition of resources using GalleryImage, this
        is because the field appears to be intially constructed 
        on a cloneable idevice, which doesn't yet have a parentNode
        even defined!
        NOTE: a property might be a MUCH better approach to this.
        """
        self.parentNode = None
        if hasattr(self.idevice, 'parentNode'): 
            self.parentNode = self.idevice.parentNode

    def ProcessPreviewedImages(self, content):
        """
        to build up the corresponding resources from any images (etc.) added
        in by the tinyMCE image-browser plug-in,
        which will have put them into src="../previews/"
        """
        new_content = content

        # By this point, tinyMCE's javascript file browser handler:
        #         common.js's: chooseImage_viaTinyMCE() 
        # has already copied the file into the web-server's relative 
        # directory "/previews", BUT, something in tinyMCE's handler 
        # switches "/previews" to "../previews", so beware.....
        # 
        # At least it does NOT quote anything, and shows it as, for example: 
        #   <img src="../previews/%Users%r3m0w%Pictures%Remos_MiscPix% \
        #        SampleImage.JPG" height="161" width="215" /> 
        # old quoting-handling is still included in the following parsing,
        # which HAD allowed users to manually enter src= "file://..." URLs, 
        # but with the image now copied into previews, such URLS are no more.

        # DESIGN NOTE: eventually the following processing should be
        # enhanced to look at the HTML tags passed in, and ensure that
        # what is being found as 'src="../previews/.."' is really within
        # an IMG tag, etc.
        # For now, though, this easy parsing is working well:
        search_str = "src=\"../previews/" 
        found_pos = new_content.find(search_str) 
        while found_pos >= 0: 
            end_pos = new_content.find('\"', found_pos+len(search_str)) 
            if end_pos == -1: 
                # now unlikely that this has already been quoted out, 
                # since the search_str INCLUDES a \", but check anyway:
                end_pos = new_content.find('&quot', found_pos+1) 
            else: 
                # okay, the end position \" was found, BUT beware of this 
                # strange case, where the image file:/// URLs 
                # were entered manually in one part of it 
                # (and therefore escaped to &quot), AND another quote occurs 
                # further below (perhaps even in a non-quoted file:/// via 
                # a tinyMCE browser, but really from anything!) 
                # So..... see if a &quot; is found in the file-name, and 
                # if so, back the end_pos up to there.  
                # NOTE: until actually looking at the HTML tags, and/or
                # we might be able to do this more programmatically by 
                # first seeing HOW the file:// is initially quoted, 
                # whether by a \" or by &quot;, but for now, 
                # just check this one.
                end_pos2 = new_content.find('&quot', found_pos+1) 
                if end_pos2 > 0 and end_pos2 < end_pos:
                    end_pos = end_pos2
            if end_pos >= found_pos:
               # next, extract the actual file url, to be replaced later 
               # by the local resource file:
               file_url_str = new_content[found_pos:end_pos] 
               # and to get the actual file path, 
               # rather than the complete URL:
               input_file_name_str = file_url_str[len(search_str):]

               log.debug("ProcessPreviewedImages: found file = " \
                           + input_file_name_str)

               webDir     = Path(G.application.tempWebDir)
               previewDir  = webDir.joinpath('previews')
               server_filename = previewDir.joinpath(input_file_name_str);

               # and now, extract just the filename string back out of that:
               file_name_str = server_filename.abspath().encode('utf-8');

               # Be sure to check that this file even exists before even 
               # attempting to create a corresponding GalleryImage resource:
               if os.path.exists(file_name_str) \
               and os.path.isfile(file_name_str): 
                   # in passing GalleryImage into the FieldWithResources,
                   # this field needs to be sure to have an updated
                   # parentNode, courtesy of its idevice:
                   self.setParentNode()
                   
                   # Not sure why this can't be imported up top, but it gives 
                   # ImportError: cannot import name GalleryImages, 
                   # so here it be:
                   from exe.engine.galleryidevice  import GalleryImage

                   # note: the middle GalleryImage field is an used caption:
                   new_GalleryImage = GalleryImage(self, \
                                                    '', file_name_str)
                   new_GalleryImageResource = new_GalleryImage._imageResource
                   resource_path = new_GalleryImageResource._storageName
                   # and re-concatenate from the global resources name, 
                   # to build the webUrl to the resource:
                   resource_url = new_GalleryImage.resourcesUrl+resource_path
                   # and finally, go ahead and replace the filename:
                   new_content = new_content.replace(file_url_str, 
                                                     "src=\""+resource_url)
                   log.debug("ProcessPreviewedImages: built resource: " \
                           + resource_url)
               else:
                   log.warn("file '"+file_name_str+"' does not exist; " \
                           + "unable to include it as a possible image " \
                           + "resource for this TextAreaElement.")
                   # IDEALLY: would like to replace the entire 
                   #  <img src=.....> tag with text saying "[WARNING:...]",
                   # but this requires more parsing than we have already done
                   # and should really wait until the full-on HTML tags
                   # are checked, in which case an ALT tag can be used.
                   # For now, merely replacing the filename itself with some
                   # warning text that includes the filename:
                   filename_warning = "src=\"WARNING_FILE="+file_name_str \
                           +"=DOES_NOT_EXIST"
                   new_content = new_content.replace(file_url_str, 
                                                     filename_warning)
                   # note: while this technique IS less than ideal, 
                   # also remember that files will typically be
                   # selected using the Image browser, and "should" 
                   # therefore "always" exist. :-)
    
                   # DESIGN NOTE: see how GalleryImage's _saveFiles() does
                   # the "No Thumbnail Available. Could not load original..."
            else:
               # end_pos < found_pos (probably == -1)
               log.warn("ProcessPreviewedImages: file URL string appears " \
                        + "to NOT have a terminating quote.")
    
            # Find the next source image in the content, continuing the loop:
            found_pos = new_content.find(search_str, found_pos+1) 
        
        return new_content

    
    def MassageImageContentForRenderView(self, content):
        """
        Returns an XHTML string for viewing this resource-laden element 
        upon export, since the resources will be flattened no longer exist 
        in the system resources directory....
        """
        # this is used for exports/prints, etc., and needs to ensure that 
        # any resource paths are removed:
        resources_url_src = "src=\"resources/"
        exported_src = "src=\""
        export_content = content.replace(resources_url_src,exported_src)
        return export_content


    def upgradeToVersion1(self):
        """
        Upgrade to allow the images embedded via tinyMCE to
        persist with this field
        """
        # Not sure why this can't be imported up top, but it gives 
        # ImportError: cannot import name GalleryImages,
        # so here it be:
        from exe.engine.galleryidevice  import GalleryImages

        self.images = GalleryImages(self)
        self.nextImageId       = 0
        self.parentNode = None
        if hasattr(self.idevice, 'parentNode'): 
            self.parentNode = self.idevice.parentNode



# ===========================================================================
class TextAreaField(FieldWithResources):
    """
    A Generic iDevice is built up of these fields.  Each field can be
    rendered as an XHTML element

    Note that TextAreaFields can now hold any number of image resources,
    which will typically be inserted by way of tinyMCE.
    """
    persistenceVersion = 1

    def __init__(self, name, instruc="", content=""):
        """
        Initialize 
        """
        FieldWithResources.__init__(self, name, instruc, content)

    def upgradeToVersion1(self):
        """
        Upgrades to somewhere before version 0.25 (post-v0.24) 
        to reflect that TextAreaField now inherits from FieldWithResources,
        and will need its corresponding fields populated from content.
        """ 
        self.content_w_resourcePaths = self.content 
        self.content_wo_resourcePaths = self.content
        # NOTE: we don't need to actually process any of those contents for 
        # image paths, either, since this is an upgrade from pre-images!

# ===========================================================================
class FeedbackField(FieldWithResources):
    """
    A Generic iDevice is built up of these fields.  Each field can be
    rendered as an XHTML element
    """

    persistenceVersion = 2

    def __init__(self, name, instruc=""):
        """
        Initialize 
        """
        FieldWithResources.__init__(self, name, instruc)

        self._buttonCaption = x_(u"Click Here")

        self.feedback      = ""
        # Note: now that FeedbackField extends from FieldWithResources,
        # the above feedback attribute will likely be used much less than
        # the following new content attribute, but remains in case needed.
        self.content      = ""
    
    # Properties
    buttonCaption = lateTranslate('buttonCaption')

    def upgradeToVersion1(self):
        """
        Upgrades to version 0.14
        """
        self.buttonCaption = self.__dict__['buttonCaption']

    def upgradeToVersion2(self):
        """
        Upgrades to somewhere before version 0.25 (post-v0.24) 
        to reflect that FeedbackField now inherits from FieldWithResources,
        and will need its corresponding fields populated from content.
        [see also the related (and likely redundant) upgrades to FeedbackField 
         in: idevicestore.py's  __upgradeGeneric() for readingActivity, 
         and: genericidevice.py's upgradeToVersion9() for the same]
        """ 
        self.content = self.feedback 
        self.content_w_resourcePaths = self.feedback 
        self.content_wo_resourcePaths = self.feedback
        # NOTE: we don't need to actually process any of those contents for 
        # image paths, either, since this is an upgrade from pre-images!

# ===========================================================================

class ImageField(Field):
    """
    A Generic iDevice is built up of these fields.  Each field can be
    rendered as an XHTML element
    """
    persistenceVersion = 3
    # Default value
    isDefaultImage = True

    def __init__(self, name, instruc=""):
        """
        """
        Field.__init__(self, name, instruc)
        self.width         = ""
        self.height        = ""
        self.imageResource = None
        self.defaultImage  = ""
        self.isDefaultImage = True
        self.isFeedback    = False

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
            if self.imageResource:
                self.imageResource.delete()
            self.imageResource = Resource(self.idevice, resourceFile)
            self.isDefaultImage  = False
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
            self.isDefaultImage = True

    def _upgradeFieldToVersion2(self):
        """
        Upgrades to exe v0.12
        """
        log.debug("ImageField upgrade field to version 2")
        idevice = self.idevice or self.__dict__.get('idevice')
        package = idevice.parentNode.package
        # This hack is due to the un-ordered ness of jelly restoring and upgrading
        if not hasattr(package, 'resources'):
            package.resources = {}
        imgPath = package.resourceDir/self.imageName
        if self.imageName and idevice.parentNode:
            self.imageResource = Resource(idevice, imgPath)
        else:
            self.imageResource = None
        del self.imageName
        
    def _upgradeFieldToVersion3(self):
        """
        Upgrades to exe v0.24
        """
        self.isFeedback    = False
# ===========================================================================

class MagnifierField(Field):
    """
    A Generic iDevice is built up of these fields.  Each field can be
    rendered as an XHTML element
    """
    persistenceVersion = 2
    
    def __init__(self, name, instruc=""):
        """
        """
        Field.__init__(self, name, instruc)
        self.width         = "100"
        self.height        = "100"
        self.imageResource = None
        self.defaultImage  = ""
        self.glassSize     = "2"
        self.initialZSize  = "100"
        self.maxZSize      = "150"
        self.message       = ""
        self.isDefaultImage= True


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
            if self.imageResource:
                self.imageResource.delete()
            self.imageResource = Resource(self.idevice, resourceFile)
            self.isDefaultImage = False
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
            self.isDefaultImage = True
            
    def _upgradeFieldToVersion2(self):
        """
        Upgrades to exe v0.24
        """
        self.message   = ""
        self.isDefaultImage = False
            
#===============================================================================

class MultimediaField(Field):
    """
    A Generic iDevice is built up of these fields.  Each field can be
    rendered as an XHTML element
    """
    persistenceVersion = 2
    def __init__(self, name, instruc=""):
        """
        """
        Field.__init__(self, name, instruc)
        self.width         = "320"
        self.height        = "100"
        self.mediaResource = None
        self.caption       = ""
        self._captionInstruc = x_(u"""Provide a caption for the 
MP3 file. This will appear in the players title bar as well.""")
    # Properties
    captionInstruc    = lateTranslate('captionInstruc')

    def setMedia(self, mediaPath):
        """
        Store the media file in the package
        Needs to be in a package to work.
        """
        log.debug(u"setMedia "+unicode(mediaPath))
        
        resourceFile = Path(mediaPath)

        assert(self.idevice.parentNode,
               'Media '+self.idevice.id+' has no parentNode')
        assert(self.idevice.parentNode.package,
               'iDevice '+self.idevice.parentNode.id+' has no package')

        if resourceFile.isfile():
            if self.mediaResource:
                self.mediaResource.delete()
            self.mediaResource = Resource(self.idevice, resourceFile)
            if '+' in self.mediaResource.storageName:
                path = self.mediaResource.path
                newPath = path.replace('+','')
                Path(path).rename(newPath)
                self.mediaResource._storageName = \
                    self.mediaResource.storageName.replace('+','')
                self.mediaResource._path = newPath
        else:
            log.error('File %s is not a file' % resourceFile)
            
    def upgradeToVersion2(self):
        """
        Upgrades to exe v0.20
        """
        Field.upgradeToVersion2(self)
        if hasattr(Field, 'updateToVersion2'):
            Field.upgradeToVersion2(self)
        if hasattr(self.idevice, 'caption'):
            self.caption = self.idevice.caption
        elif self.mediaResource:
            self.caption = self.mediaResource.storageName 
        else:
            self.caption   = ""

        self._captionInstruc = x_(u"""Provide a caption for the 
MP3 file. This will appear in the players title bar as well.""")
            
            
            
#==============================================================================

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
        if not self.inGap:
            if tag.lower() == 'u':
                self.inGap = True
            elif tag.lower() == 'span':
                style = dict(attrs).get('style', '')
                if 'underline' in style:
                    self.inGap = True
                else:
                    self.writeTag(tag, attrs)
            elif tag.lower() == 'br':
                self.lastText += '<br/>' 
            else:
                self.writeTag(tag, attrs)

    def writeTag(self, tag, attrs=None):
        """
        Outputs a tag "as is"
        """
        if attrs is None:
            self.lastText += '</%s>' % tag
        else:
            attrs = ['%s="%s"' % (name, val) for name, val in attrs]
            if attrs:
                self.lastText += '<%s %s>' % (tag, ' '.join(attrs))
            else:
                self.lastText += '<%s>' % tag

    def handle_endtag(self, tag):
        """
        Turns off inGap
        """
        if self.inGap:
            if tag.lower() == 'u':
                self.inGap = False
                self._endGap()
            elif tag.lower() == 'span':
                self.inGap = False
                self._endGap()
        elif tag.lower() != 'br':
            self.writeTag(tag)

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
        # Split gaps up on whitespace
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
class ClozeField(FieldWithResources):
    """
    This field handles a passage with words that the student must fill in
    And can now support multiple images (and any other resources) via tinyMCE
    """

    regex = re.compile('(%u)((\d|[A-F]){4})', re.UNICODE)
    persistenceVersion = 3

    def __init__(self, name, instruc):
        """
        Initialise
        """
        FieldWithResources.__init__(self, name, instruc)
        self.parts = []
        self._encodedContent = ''
        self.rawContent = ''
        self._setVersion2Attributes()

    def _setVersion2Attributes(self):
        """
        Sets the attributes that were added in persistenceVersion 2
        """
        self.strictMarking = False
        self._strictMarkingInstruc = \
            x_(u"<p>If left unchecked a small number of spelling and "
                "capitalization errors will be accepted. If checked only "
                "an exact match in spelling and capitalization will be accepted."
                "</p>"
                "<p><strong>For example:</strong> If the correct answer is "
                "<code>Elephant</code> then both <code>elephant</code> and "
                "<code>Eliphant</code> will be judged "
                "<em>\"close enough\"</em> by the algorithm as it only has "
                "one letter wrong, even if \"Check Capitilization\" is on."
                "</p>"
                "<p>If capitalization checking is off in the above example, "
                "the lowercase <code>e</code> will not be considered a "
                "mistake and <code>eliphant</code> will also be accepted."
                "</p>"
                "<p>If both \"Strict Marking\" and \"Check Capitalization\" "
                "are set, the only correct answer is \"Elephant\". If only "
                "\"Strict Marking\" is checked and \"Check Capitalization\" "
                "is not, \"elephant\" will also be accepted."
                "</p>")
        self.checkCaps = False
        self._checkCapsInstruc = \
            x_(u"<p>If this option is checked, submitted answers with "
                "different capitalization will be marked as incorrect."
                "</p>")
        self.instantMarking = False
        self._instantMarkingInstruc = \
            x_(u"""<p>If this option is set, each word will be marked as the 
learner types it rather than all the words being marked the end of the 
exercise.</p>""")

    # Property handlers
    def set_encodedContent(self, value):
        """
        Cleans out the encoded content as it is passed in. Makes clean XHTML.
        """
        for key, val in name2codepoint.items():
            value = value.replace('&%s;' % key, unichr(val))
        # workaround for Microsoft Word which incorrectly quotes font names
        value = re.sub(r'font-family:\s*"([^"]+)"', r'font-family: \1', value)
        parser = ClozeHTMLParser()
        parser.feed(value)
        parser.close()
        self.parts = parser.result
        encodedContent = ''
        for shown, hidden in parser.result:
            encodedContent += shown
            if hidden:
                encodedContent += ' <u>'
                encodedContent += hidden
                encodedContent += '</u> ' 
        self._encodedContent = encodedContent
    
    # Properties
    encodedContent        = property(lambda self: self._encodedContent, 
                                     set_encodedContent)
    strictMarkingInstruc  = lateTranslate('strictMarkingInstruc')
    checkCapsInstruc      = lateTranslate('checkCapsInstruc')
    instantMarkingInstruc = lateTranslate('instantMarkingInstruc')

    def upgradeToVersion1(self):
        """
        Upgrades to exe v0.11
        """
        self.autoCompletion = True
        self.autoCompletionInstruc = _(u"""Allow auto completion when 
                                       user filling the gaps.""")

    def upgradeToVersion2(self):
        """
        Upgrades to exe v0.12
        """
        Field.upgradeToVersion2(self)
        strictMarking = not self.autoCompletion
        del self.autoCompletion
        del self.autoCompletionInstruc
        self._setVersion2Attributes()
        self.strictMarking = strictMarking

    def upgradeToVersion3(self):
        """
        Upgrades to somewhere before version 0.25 (post-v0.24) 
        to reflect that ClozeField now inherits from FieldWithResources,
        and will need its corresponding fields populated from content.
        """ 
        self.content = self.encodedContent
        self.content_w_resourcePaths = self.encodedContent
        self.content_wo_resourcePaths = self.encodedContent
        # NOTE: we don't need to actually process any of those contents for 
        # image paths, either, since this is an upgrade from pre-images!

# ===========================================================================

class FlashField(Field):
    """
    A Generic iDevice is built up of these fields.  Each field can be
    rendered as an XHTML element
    """

    def __init__(self, name, instruc=""):
        """
        Set default elps.
        """
        Field.__init__(self, name, instruc)
        self.width         = 300
        self.height        = 250
        self.flashResource = None
        self._fileInstruc   = x_("""Only select .swf (Flash Objects) for 
this iDevice.""")

    #properties
    fileInstruc = lateTranslate('fileInstruc')
    
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
            if self.flashResource:
                self.flashResource.delete()
            self.flashResource = Resource(self.idevice, resourceFile)

        else:
            log.error('File %s is not a file' % resourceFile)


    def _upgradeFieldToVersion2(self):
        """
        Upgrades to exe v0.12
        """
        if hasattr(self, 'flashName'): 
            if self.flashName and self.idevice.parentNode:
                self.flashResource = Resource(self.idevice, Path(self.flashName))
            else:
                self.flashResource = None
            del self.flashName


    def _upgradeFieldToVersion3(self):
        """
        Upgrades to exe v0.13
        """
        self._fileInstruc   = x_("""Only select .swf (Flash Objects) for 
this iDevice.""")

# ===========================================================================

class FlashMovieField(Field):
    """
    A Generic iDevice is built up of these fields.  Each field can be
    rendered as an XHTML element
    """
    persistenceVersion = 4
    
    def __init__(self, name, instruc=""):
        """
        """
        Field.__init__(self, name, instruc)
        self.width         = 320
        self.height        = 240
        self.flashResource = None
        self.message       = ""
        self._fileInstruc   = x_("""Only select .flv (Flash Video Files) for 
this iDevice.""")

    #properties
    fileInstruc = lateTranslate('fileInstruc')
    
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
            if self.flashResource:
                self.flashResource.delete()
            try:
                flvDic = FLVReader(resourceFile)
                self.height = flvDic.get("height", 240)+30
                self.width = flvDic.get("width", 320)
                self.flashResource = Resource(self.idevice, resourceFile)
                #if not width and not height:
                    # If we have no width or height, default to 100x130
                    #self.width = 100
                    #self.height = 130
                ##else:
                    # If we have one, make it squareish
                    # If we have both, use them
                    #if height: self.height = height 
                    #else: self.height = width 
                    #if width: self.width = width
                    #else: self.width =height 
                    
                #self.flashResource = Resource(self.idevice, resourceFile)
            except AssertionError: 
                log.error('File %s is not a flash movie' % resourceFile)

        else:
            log.error('File %s is not a file' % resourceFile)


    def _upgradeFieldToVersion2(self):
        """
        Upgrades to exe v0.12
        """
        if hasattr(self, 'flashName'):
            if self.flashName and self.idevice.parentNode:
                self.flashResource = Resource(self.idevice, Path(self.flashName))
            else:
                self.flashResource = None
            del self.flashName


    def _upgradeFieldToVersion3(self):
        """
        Upgrades to exe v0.14
        """
        self._fileInstruc   = x_("""Only select .flv (Flash Video Files) for 
this iDevice.""")

    def _upgradeFieldToVersion4(self):
        """
        Upgrades to exe v0.20.3
        """
        self.message   = ""
# ===========================================================================


class DiscussionField(Field):
    def __init__(self, name, instruc=x_("Type a discussion topic here."), content="" ):
        """
        Initialize 
        """
        Field.__init__(self, name, instruc)
        self.content = content

#=========================================================================


class MathField(Field):
    """
    A Generic iDevice is built up of these fields.  Each field can be
    rendered as an XHTML element
    """
    
    persistenceVersion = 1

    def __init__(self, name, instruc="", latex=""):
        """
        Initialize 
        'self._latex' is a string of latex
        'self.gifResource' is a resouce that points to a cached gif
        rendered from the latex
        """
        Field.__init__(self, name, instruc)
        self._latex      = latex # The latex entered by the user
        self.gifResource = None
        self.fontsize    = 4
        self._instruc    = x_(u""
            "<p>" 
            "Select symbols from the text editor below or enter LATEX manually"
            " to create mathematical formula."
            " To preview your LATEX as it will display use the &lt;Preview&gt;"
            " button below."
            "</p>"
            )
        self._previewInstruc = x_("""Click on Preview button to convert 
                                  the latex into an image.""")

       
    # Property Handlers
    
    def get_latex(self):
        """
        Returns latex string
        """
        return self._latex
        
    def set_latex(self, latex):
        """
        Replaces current gifResource
        """
        if self.gifResource is not None:
            self.gifResource.delete()
            self.gifResource = None
        if latex <> "":
            tempFileName = compile(latex, self.fontsize)
            self.gifResource = Resource(self.idevice, tempFileName)
            # Delete the temp file made by compile
            Path(tempFileName).remove()
        self._latex = latex
        
    def get_gifURL(self):
        """
        Returns the url to our gif for putting inside
        <img src=""/> tag attributes
        """
        if self.gifResource is None:
            return ''
        else:
            return self.gifResource.path
        
    def _upgradeFieldToVersion1(self):
        """
        Upgrades to exe v0.19
        """
        self.fontsize = "4"
    
    # Properties
    
    latex = property(get_latex, set_latex)
    gifURL = property(get_gifURL)
    instruc = lateTranslate('instruc')
    previewInstruc = lateTranslate('previewInstruc')
    
# ===========================================================================
class QuizOptionField(Field):
    """
    A Question is built up of question and options.  Each
    option can be rendered as an XHTML element
    Used by the QuizQuestionField, as part of the Multi-Choice iDevice.
    """

    persistenceVersion = 1

    def __init__(self, question, idevice, name="", instruc=""):
        """
        Initialize 
        """
        Field.__init__(self, name, instruc)
        self.isCorrect = False
        self.question  = question
        self.idevice = idevice

        self.answerTextArea = TextAreaField(x_(u'Option'), 
                                  idevice._answerInstruc, x_(u''))
        self.answerTextArea.idevice = idevice

        self.feedbackTextArea = TextAreaField(x_(u'Feedback'), 
                                    idevice._feedbackInstruc, x_(u''))
        self.feedbackTextArea.idevice = idevice

    def upgradeToVersion1(self):
        """
        Upgrades to somewhere before version 0.25 (post-v0.24) 
        to reflect the new TextAreaFields now in use for images.
        """ 
        self.answerTextArea = TextAreaField(x_(u'Option'), 
                                  self.idevice._answerInstruc, self.answer)
        self.answerTextArea.idevice = self.idevice
        self.feedbackTextArea = TextAreaField(x_(u'Feedback'), 
                                    self.idevice._feedbackInstruc, 
                                    self.feedback)
        self.feedbackTextArea.idevice = self.idevice

#===============================================================================

class QuizQuestionField(Field):
    """
    A Question is built up of question and Options.
    Used as part of the Multi-Choice iDevice.
    """

    persistenceVersion = 1
    
    def __init__(self, idevice, name, instruc=""):
        """
        Initialize 
        """
        Field.__init__(self, name, instruc)

        self.options              = []
        self.idevice              = idevice
        self.questionTextArea     = TextAreaField(x_(u'Question'), 
                                        idevice._questionInstruc, x_(u''))
        self.questionTextArea.idevice     = idevice
        self.hintTextArea         = TextAreaField(x_(u'Hint'), 
                                        idevice._hintInstruc, x_(u''))
        self.hintTextArea.idevice         = idevice

    def addOption(self):
        """
        Add a new option to this question. 
        """
        option = QuizOptionField(self, self.idevice)
        self.options.append(option)

    def upgradeToVersion1(self):
        """
        Upgrades to somewhere before version 0.25 (post-v0.24) 
        to reflect the new TextAreaFields now in use for images.
        """ 
        self.questionTextArea     = TextAreaField(x_(u'Question'), 
                                        self.idevice._questionInstruc, 
                                        self.question)
        self.questionTextArea.idevice = self.idevice
        self.hintTextArea         = TextAreaField(x_(u'Hint'), 
                                        self.idevice._hintInstruc, self.hint)
        self.hintTextArea.idevice  = self.idevice

# ===========================================================================
class SelectOptionField(Field):
    """
    A Question is built up of question and options.  Each
    option can be rendered as an XHTML element
    Used by the SelectQuestionField, as part of the Multi-Select iDevice.
    """
    persistenceVersion = 1

    def __init__(self, question, idevice, name="", instruc=""):
        """
        Initialize 
        """
        Field.__init__(self, name, instruc)
        self.isCorrect = False
        self.question  = question
        self.idevice = idevice

        self.answerTextArea    = TextAreaField(x_(u'Options'), 
                                     question._optionInstruc, x_(u''))
        self.answerTextArea.idevice = idevice


    def upgradeToVersion1(self):
        """
        Upgrades to somewhere before version 0.25 (post-v0.24) 
        to reflect the new TextAreaFields now in use for images.
        """ 
        self.answerTextArea    = TextAreaField(x_(u'Options'), 
                                     self.question._optionInstruc, 
                                     self.answer)
        self.answerTextArea.idevice = self.idevice

#===============================================================================

class SelectQuestionField(Field):
    """
    A Question is built up of question and Options.
    Used as part of the Multi-Select iDevice.
    """

    persistenceVersion = 1
    
    def __init__(self, idevice, name, instruc=""):
        """
        Initialize 
        """
        Field.__init__(self, name, instruc)

        self.idevice              = idevice

        self._questionInstruc      = x_(u"""Enter the question stem. 
The question should be clear and unambiguous. Avoid negative premises as these 
can tend to confuse learners.""")
        self.questionTextArea = TextAreaField(x_(u'Question:'), 
                                    self.questionInstruc, x_(u''))
        self.questionTextArea.idevice = idevice

        self.options              = []
        self._optionInstruc        = x_(u"""Enter the available choices here. 
You can add options by clicking the "Add another option" button. Delete options by 
clicking the red X next to the option.""")

        self._correctAnswerInstruc = x_(u"""Select as many correct answer 
options as required by clicking the check box beside the option.""")

        self.feedbackInstruc       = x_(u"""Type in the feedback you want 
to provide the learner with.""")
        self.feedbackTextArea = TextAreaField(x_(u'Feedback:'), 
                                    self.feedbackInstruc, x_(u''))
        self.feedbackTextArea.idevice = idevice
    
    
    # Properties
    questionInstruc      = lateTranslate('questionInstruc')
    optionInstruc        = lateTranslate('optionInstruc')
    correctAnswerInstruc = lateTranslate('correctAnswerInstruc')
    
    def addOption(self):
        """
        Add a new option to this question. 
        """
        option = SelectOptionField(self, self.idevice)
        self.options.append(option)

    def upgradeToVersion1(self):
        """
        Upgrades to somewhere before version 0.25 (post-v0.24) 
        to reflect the new TextAreaFields now in use for images.
        """ 
        self.questionTextArea = TextAreaField(x_(u'Question:'), 
                                    self.questionInstruc, self.question)
        self.questionTextArea.idevice = self.idevice
        self.feedbackTextArea = TextAreaField(x_(u'Feedback:'), 
                                    self.feedbackInstruc, self.feedback)
        self.feedbackTextArea.idevice = self.idevice


# ===========================================================================

class AttachmentField(Field):
    """
    A Generic iDevice is built up of these fields.  Each field can be
    rendered as an XHTML element
    """

    def __init__(self, name, instruc=""):
        """
        """
        Field.__init__(self, name, instruc)
        self.attachResource = None

    def setAttachment(self, attachPath):
        """
        Store the attachment file in the package
        Needs to be in a package to work.
        """
        log.debug(u"setAttachment "+unicode(attachPath))
        resourceFile = Path(attachPath)

        assert(self.idevice.parentNode,
               'Attach '+self.idevice.id+' has no parentNode')
        assert(self.idevice.parentNode.package,
               'iDevice '+self.idevice.parentNode.id+' has no package')

        if resourceFile.isfile():
            if self.attachResource:
                self.attachResource.delete()
            self.attachResource = Resource(self.idevice, resourceFile)
        else:
            log.error('File %s is not a file' % resourceFile)
        
# ===========================================================================

