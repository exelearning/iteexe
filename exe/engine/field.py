# ===========================================================================
# eXe 
# Copyright 2004-2006, University of Auckland
# Copyright 2006-2007 eXe Project, New Zealand Tertiary Education Commission
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
from exe.engine.path      import Path, toUnicode
from exe.engine.resource  import Resource
from exe.engine.translate import lateTranslate
from exe.engine.mimetex   import compile
from HTMLParser           import HTMLParser
from exe.engine.flvreader import FLVReader
from htmlentitydefs       import name2codepoint
from exe.engine.htmlToText import HtmlToText
from twisted.persisted.styles import Versioned
from exe                  import globals as G
import os
import re
import urllib
import shutil

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

    def __getstate__(self): 
        """
        Override Persistable's getstate, to recognize when this is an actual
        file save (in which case, do not save the nonpersistant attributes),
        or a copy (as used in in file insert, to merge other files).
        Currently, only node's copyToPackage will indicate that this is 
        for a copy, by setting G.application.persistNonPersistants

        Return which variables we should persist
        """
        if G.application.persistNonPersistants:
            toPersist = self.__dict__
        else: 
            toPersist = dict([(key, value) 
                    for key, value in self.__dict__.items() 
                    if key not in self.nonpersistant])
    
        return Versioned.__getstate__(self, toPersist)

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

    persistenceVersion = 2

    # do not save the following redundant fields with the .elp, but instead 
    # regenerate them from content_w_resourcePaths in 'TwistedRePersist':
    nonpersistant      = ['content', 'content_wo_resourcePaths']

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

    def TwistedRePersist(self): 
        """ 
        to be called by twisted after any upgrades to this class, 
        but before any of its subclass upgrades occur:
        """
        if hasattr(self, "content_w_resourcePaths"):
            log.debug('TwistedRePersist for FieldWithResources')
            # recreate the content and content_wo_resourcePaths 
            # from the persistent content_w_resourcePaths:

            # set default content for previewing mode:
            self.content = self.content_w_resourcePaths 

            # and content for exporting/printing:
            self.content_wo_resourcePaths = \
                self.MassageContentForRenderView(self.content_w_resourcePaths)

        #else: looks like an earlier elp, created < 0.95
        # let its subclass just fall through its normal upgrade path to 
        # generate content_w_resourcePaths from its content, no worries.


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

    
    def RemoveZombieResources(self, resources_in_use):
        """
        Given the list of resources still in use, compare to this
        still listed in the images[] resource list, and remove
        any zombies, resources in images[] that are longer in use.

        # note: when deleting a resource which was embedded multiple times
        # in this same field, note that the following algorithm will really
        # only acknowledge when the FINAL deletion of the that resource
        # occurs, and will therefore print a REMOVING message for each
        # occurrence that the resource HAD, even if those had already
        # been previously removed.  While this could be modified to
        # only print that final message once (or even further modified
        # to remove extra resource objects when they become no longer used,
        # and the corresponding extra "confirmed resource" messages),
        # it is deemed that AT THIS POINT in time, that anything beyond the
        # writing of this comment just isn't really worth the time :-)
        """

        # that said, now check each of the resources currently stored, 
        # and see which of these are still in use:
        # (looking for both %20-escaped spaces and non-escaped spaces)

        # use reverse for loop to delete old user resources 
        num_images=len(self.images)  
        for image_num in range(num_images-1, -1, -1): 
            embedded_resource = self.images[image_num]
            embedded_res_name = embedded_resource._imageResource.storageName
            if embedded_res_name in resources_in_use or  \
               embedded_res_name.replace(" ", "%20") in resources_in_use:
                log.debug("confirmed resource is still active in this field: "\
                        + embedded_res_name) 
            else:
                log.debug("resource no longer used in this field, REMOVING: "\
                        + embedded_res_name) 
                # now, delete this resource from the list AND the actual
                # resource directory, if it's not still in use elsewhere:
                del self.images[image_num]

    def ListActiveResources(self, content):
        """
        Find and return the name of all active image resources,
        to help find those no longer in use and in need of purging.
        This finds images and media as well, since they both use src="...".

        It now also finds any math-images' paired exe_math_latex sources, too!

        And NOW also finds ANY other resource file embedded as an href via
        the advlink text-link plugin.

        And the embedded mp3s that use xspf_player.swf;
        """
        resources_in_use =  []
        search_strings = ["src=\"resources/", "exe_math_latex=\"resources/", \
                "href=\"resources/", \
                "src=\"../templates/xspf_player.swf?song_url=resources/"]

        for search_num in range(len(search_strings)): 
            search_str = search_strings[search_num] 
            embedded_mp3 = False
            if search_str == \
                "src=\"../templates/xspf_player.swf?song_url=resources/":
                embedded_mp3 = True
            found_pos = content.find(search_str) 
            while found_pos >= 0: 
                if not embedded_mp3:
                    # i.e., most normal search strings, look for terminating ":
                    end_pos = content.find('\"', found_pos+len(search_str)) 
                else:
                    # the xspf_player src search strings should end on the 
                    # next parameter, &song_title=:
                    end_pos = content.find('&song_title=', 
                            found_pos+len(search_str)) 
                    if end_pos <= 0:
                        # since TinyMCE can turn & into &amp;, also look for:
                        end_pos = content.find('&amp;song_title=', 
                            found_pos+len(search_str)) 
                # assume well-formed with matching quote: 
                if end_pos > 0: 
                    # extract the actual resource name, after src=\"resources:
                    resource_str = content[found_pos+len(search_str):end_pos] 
                    # NEXT: add it to the resources_in_use, if not already!
                    resources_in_use.append(resource_str)
                # Find the next source image in the content, continuing:
                found_pos = content.find(search_str, found_pos+1) 

        return resources_in_use

    def ProcessPreviewed(self, content): 
        """
        to build up the corresponding resources from any images (etc.) added
        in by the tinyMCE image-browser plug-in,
        which will have put them into src="../previews/"
        This is a wrapper around the specific types of previews,
        images, media, etc..
        """
        #################################
        # overall safety check:
        # while most iDevices only call process if their action != "delete",
        # some can still go ahead and call process even after being deleted!
        # So, ensure that we are actually still attached in a package:
        if not hasattr(self.idevice, 'parentNode') \
        or self.idevice.parentNode is None: 
            log.debug('ProcessPreviewed called, but without a '
                       + 'idevice.parentNode; probably from a new object '
                       + 'that was immediately deleted; bailing.')
            return content

        #################################
        # Part 0: remove any previous math source files which are no 
        # longer in use; otherwise we get naming discrepencies in the case
        # that identical math source is used with a new previewed math image
        # (e.g., when changing only the font size)
        resources_in_use = self.ListActiveResources(content)
        self.RemoveZombieResources(resources_in_use)

        #################################
        # Part 1: process any newly added resources
        new_content = self.ProcessPreviewedImages(content)
        new_content = self.ProcessPreviewedMedia(new_content)
        new_content = self.ProcessPreviewedLinkResources(new_content)

        #################################
        # Part 2: remove any freshly removed resources via
        # a new resource counting mechanism, to determine which
        # resources are no longer in use, and need purging.

        resources_in_use = self.ListActiveResources(new_content)
        # and eventually, maybe something like:
        #new_content.append(ProcessPreviewedMedia(new_content))
        # but note: the media resources are actually found within
        # ListActiveResources() as well!  So no need at this time.

        self.RemoveZombieResources(resources_in_use)

        return new_content

    # A note on the eventual ProcessPreviewedMedia(): 
    # since these are no longer IMAGES, per se, to be stored as resources,
    # they might NOT work as well with GalleryImage, especially since
    # thumbnails will not need to be, nor be able to be, created.
    # So, start of down the path of non-GalleryImage-embedded resources
    # for media, and if all works out well, it might be very well worth
    # revisiting the ProcessPreviewedImages and moving those away from
    # the GalleryImage resources as well.

    # typical media embedded using the following sort of structure:
    ########################################################################
    #<object classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B" \
    # codebase="http://www.apple.com/qtactivex/qtplugin.cab#version=6,0,2,0" \
    # width="100" height="100">
    #    <param name="width" value="100" />
    #    <param name="height" value="100" />
    #    <param name="scale" value="tofit" />
    #    <param name="src" value="/previews/morphines_shame.mov" />
    #    <embed type="video/quicktime" width="100" height="100" scale="tofit" \
    #       src="/previews/morphines_shame.mov"></embed>
    #</object>
    ########################################################################
    # So, going with two assumptions for the tinyMCE-embedded preview media:
    # 1) that the previewed filename will first show up as:
    #       <param name="src" value="/previews/MEDIA_FILE" />
    # 2) that it will soon thereafter follow, with the same name, in:
    #       <embed .... src="/previews/MEDIA_FILE"></embed>
    #####
    # Perhaps once this implementation is created and is working,
    # and especially once moving into the proper XHTML tag-based parsing,
    # a re-combination of the Media and Images can take place.
    # But for now, at least, do just process them separately.
    #####
    def ProcessPreviewedMedia(self, content):
        """
        STOLEN from ProcessPreviewedImages(), the functionality here is
        EXTREMELY close, yet just different enough to make it worth
        processing in a separate pass.

        To build up the corresponding resources from any media (etc.) added
        in by the tinyMCE media-browser plug-in,
        which will have put them into src="/previews/"
        NOTE: subtle difference from images that go into src="../previews/"
        AND: rather than a simple <img src="../previews/IMAGEFILE"> tag,
        the media will be embedded in a more complex multi-line multi-tag,
        as shown above before this routine.
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

        # image was: search_str = "src=\"../previews/" 
        # 1st media string, look for <param name="src" value="/previews/...":
        search_str = "<param name=\"src\" value=\"/previews/" 

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
               # which may now be:
               # "<param name="src" value="/previews/MEDIA_FILE"

               # and to get the actual file path, 
               # rather than the complete URL:

               # first compensate for how TinyMCE HTML-escapes accents, etc:
               pre_input_file_name_str = file_url_str[len(search_str):]
               log.debug("ProcessPreviewedMedia: found escaped file = " \
                           + pre_input_file_name_str)
               converter = HtmlToText(pre_input_file_name_str)
               input_file_name_str = converter.convertToText()

               log.debug("ProcessPreviewedMedia: unescaped filename = " \
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

                   # first, determine if this is an eXe MP3, which replicates
                   # the old MP3 iDevice behaviour by also embedding its
                   # player, XSPF_PLAYER:
                   embed_mp3_player = False
                   exe_mp3_parmline = "<param name=\"exe_mp3\" " \
                           + "value=\"/previews/" \
                           + pre_input_file_name_str
                   if new_content.find(exe_mp3_parmline) >= 0:
                       embed_mp3_player = True
                       log.debug('ProcessPreviewedMedia: this is an eXe mp3.')

                   # likewise, determine if this is an eXe FLV, which replicates
                   # the old Flash Movie iDevice behaviour by also embedding its
                   # player, flowPlayer.swf:
                   embed_flv_player = False
                   exe_flv_parmline = "<param name=\"exe_flv\" " \
                           + "value=\"/previews/" \
                           + pre_input_file_name_str
                   if new_content.find(exe_flv_parmline) >= 0:
                       embed_flv_player = True
                       log.debug('ProcessPreviewedMedia: this is an eXe flv.')
                       if embed_mp3_player:
                           # shouldn't see both tags, but if we do, then go with FLV,
                           # and just override the mp3 entirely, for easier handling:
                           log.warn('ProcessPreviewedMedia: using FLV rather than mp3!')
                           embed_mp3_player = False

                   # Although full filenames (including flatted representations
                   # of their source directory tree) were used to help keep the
                   # filenames here in previewDir unique, this does cause
                   # problems with the filenames being too long, if they
                   # are kept that way.
                   # So.... if an optional .exe_info file is coupled to
                   # this one, go ahead and read in its original basename,
                   # in order to rename the file back to something shorter.
                   # After all, the resource process has its own uniqueifier.

                   # test for the optional .exe_info:
                   basename_value = ""
                   descrip_file_path = Path(server_filename + ".exe_info")
                   if os.path.exists(descrip_file_path) \
                   and os.path.isfile(descrip_file_path): 
                       descrip_file = open(descrip_file_path, 'rb')
                       basename_info = descrip_file.read().decode('utf-8')
                       log.debug("ProcessPreviewedMedia: decoded basename = " \
                           + basename_info)
                       # split out the value of this "basename=file" key 
                       basename_key_str = "basename="
                       basename_found_pos = basename_info.find(basename_key_str) 
                       # should be right there at the very beginning:
                       if basename_found_pos == 0: 
                           basename_value = \
                                   basename_info[len(basename_key_str):] 
                           # BEWARE: don't just change its name here in this 
                           # dir, since it might be needed multiple times, and 
                           # we won't want to delete it yet, but not deleting 
                           # it might lead to name collision, so, make a 
                           # temporary subdir bases, &: 

                           # copy previewDir/longfile to
                           #             previewDir/bases/basename
                           # (don't worry if this overwrites a previous one)
                           bases_dir = previewDir.joinpath('allyourbase')
                           if not bases_dir.exists():
                               bases_dir.makedirs()
                           # joinpath needs its arguments to be in Unicode:
                           base_file_name = bases_dir.joinpath( \
                                   toUnicode(basename_value))
                           base_file_str = base_file_name.abspath()
                           log.debug("ProcessPreviewedMedia: copied to "
                                  + "basefile = " + base_file_str)
                           shutil.copyfile(file_name_str, base_file_str)
                        
                           # finally, change the name that's used in the 
                           # resource creation in the below GalleryImage
                           file_name_str = base_file_str

                   # in passing GalleryImage into the FieldWithResources,
                   # this field needs to be sure to have an updated
                   # parentNode, courtesy of its idevice:
                   self.setParentNode()
                   
                   # Not sure why this can't be imported up top, but it gives 
                   # ImportError: cannot import name GalleryImages, 
                   # so here it be:
                   from exe.engine.galleryidevice  import GalleryImage

                   # note: the middle GalleryImage field is currently
                   # an unused caption:
                   new_GalleryImage = GalleryImage(self, \
                                                    '', file_name_str, \
                                                    mkThumbnail=False)
                   new_GalleryImageResource = new_GalleryImage._imageResource
                   resource_path = new_GalleryImageResource._storageName
                   # and re-concatenate from the global resources name, 
                   # to build the webUrl to the resource:
                   resource_url = new_GalleryImage.resourcesUrl+resource_path 
                   
                   if embed_mp3_player:
                       # then precede the url with the xspf mp3 player info:
                       resource_url = "../templates/xspf_player.swf" \
                               + "?song_url=" + resource_url \
                               + "&song_title=" + resource_path \
                       # do NOT embed the mp3 player as a resource,
                       # merely copy it out upon export, as indicated by:
                       self.idevice.systemResources += ['xspf_player.swf']

                   if embed_flv_player:
                       # the resource_url can be left the same, and...
                       # do NOT embed the flv player as a resource,
                       # merely copy it out upon export, as indicated by:
                       self.idevice.systemResources += ['flowPlayer.swf']


                   # and finally, go ahead and replace the filename for:
                   #search_str = "<param name=\"src\" value=\"/previews/" 
                   new_src_string = "<param name=\"src\" value=\""+resource_url
                   new_content = new_content.replace(file_url_str, 
                                                     new_src_string)
                   log.debug("ProcessPreviewedMedia: built resource: " \
                           + resource_url)

                   ########
                   # and since the media object is listed twice, also
                   # do a replace for its corresponding <embed> tag.
                   # NOTE: definitely being lax about the following search;
                   # ideally we would ensure that it's within an <embed>
                   # tag that is within the same <object> tag as this, etc.,
                   # before applying the full replace.
                   # BUT, since we'll also be replacing this entire tag-
                   # parsing mechanism, no worries, just do it:
                   #######
                   embed_search_str = "src=\"/previews/"+pre_input_file_name_str

                   embed_replace_str = "src=\"" + resource_url
                   new_content = new_content.replace(embed_search_str,
                                                     embed_replace_str)

                   ######
                   # and one more place that it needs to change, in the 
                   # case of the Windows Media Player, which has been
                   # hacked in tinyMCE to now include a data source
                   # in the initial object tag, and now using media
                   # type = x-ms-wmv
                   ######
                   embed_search_str = "x-ms-wmv\" data=\"/previews/"\
                           + pre_input_file_name_str
                   embed_replace_str = "x-ms-wmv\" data=\"" + resource_url
                   new_content = new_content.replace(embed_search_str,
                                                     embed_replace_str)

                   #####
                   # and if this is an embedded MP3, go ahead and update its
                   # exe_mp3 parm as well:
                   #####
                   if embed_mp3_player:
                       embed_search_str = "<param name=\"exe_mp3\" " \
                           + "value=\"/previews/" \
                           + pre_input_file_name_str
                       embed_replace_str = "<param name=\"exe_mp3\" " \
                           + "value=\"" + resource_url
                       new_content = new_content.replace(embed_search_str,
                                                     embed_replace_str)

                   #####
                   # and if this is an embedded FLV, go ahead and update its
                   # exe_flv parm as well:
                   #####
                   if embed_flv_player:
                       embed_search_str = "<param name=\"exe_flv\" " \
                           + "value=\"/previews/" \
                           + pre_input_file_name_str
                       embed_replace_str = "<param name=\"exe_flv\" " \
                           + "value=\"" + resource_url
                       new_content = new_content.replace(embed_search_str,
                                                     embed_replace_str)
                       # as well as its flashvars param, 
                       # which contains a playlist url:
                       embed_search_str = "playList: [ { url: '/previews/" \
                           + pre_input_file_name_str
                       embed_replace_str = "playList: [ { url: '" + resource_url
                       new_content = new_content.replace(embed_search_str,
                                                     embed_replace_str)

               else:
                   log.warn("file '"+file_name_str+"' does not exist; " \
                           + "unable to include it as a possible media " \
                           + "resource for this TextAreaElement.")
                   ########
                   # But, let's just go ahead and leave the old src attributes
                   # untouched..... at least for this case of the media.
                   # again, a better scheme is to be put into place here
                   # once the tag-parsing mechanism is brought into place.
                   ########

                   # IDEALLY: would like to replace the entire 
                   #  <img src=.....> tag with text saying "[WARNING:...]",
                   # but this requires more parsing than we have already done
                   # and should really wait until the full-on HTML tags
                   # are checked, in which case an ALT tag can be used.
            else:
               # end_pos < found_pos (probably == -1)
               log.warn("ProcessPreviewedMedia: file URL string appears " \
                        + "to NOT have a terminating quote.")
    
            # Find the next source image in the content, continuing the loop:
            found_pos = new_content.find(search_str, found_pos+1) 
        
        return new_content
        # end ProcessPreviewedMedia()


    def ProcessPairedMathSource(self, content, preview_math_src, \
            math_image_resource_filename, math_image_resource_url):
        """
        to build up the corresponding LaTeX math-source file resources 
        from any math images added.  called from ProcessPreviewedImages().
        """
        new_content = content
        log.debug('ProcessPairedMathSource: processing ' \
                + 'exe_math_latex='+preview_math_src)
        # we are given the exe_math_latex attribute =: 
        #       "src=\"../previews/eXe_LaTeX_math_1.gif.tex\""
        # 1. strip out just the filename:
        # BUT SAVE preview_math_file for later string replacement....
        quoteless_math_src  = preview_math_src.replace("\"","")
        preview_math_file = quoteless_math_src.replace("src=","")
        math_file = preview_math_file.replace("../previews/","")

        #log.debug('   looking for preview exe_math_latex file: ' + math_file);
        # 2. check for the file existing in the previews dir
        webDir     = Path(G.application.tempWebDir)
        previewDir  = webDir.joinpath('previews')
        full_math_filename = previewDir.joinpath(math_file);

        # and now, extract just the filename string back out of that:
        math_file_name_str = full_math_filename.abspath().encode('utf-8');

        # Be sure to check that this file even exists before even 
        # attempting to create a corresponding GalleryImage resource:
        if os.path.exists(math_file_name_str) \
        and os.path.isfile(math_file_name_str): 
            # 3. If (and only if) the resource_path name differs from it,
            expected_mathsrc_resource_filename = \
                    math_image_resource_filename+".tex"
            if (math_file != expected_mathsrc_resource_filename):
                log.debug('Note: it no longer syncs to the image file, '\
                        + 'which is now named: ' \
                        + math_image_resource_filename)
                # 3a.   then go ahead and copy to the new filename,
                #    using the allyourbase subdirectory, just in case: 
                # copy previewDir/longfile to
                #             previewDir/bases/basename 
                # (don't worry if this overwrites a previous one) 
                bases_dir = previewDir.joinpath('allyourbase') 
                if not bases_dir.exists(): 
                    bases_dir.makedirs() 
                base_file_name = bases_dir.joinpath(\
                        expected_mathsrc_resource_filename) 
                base_file_str = \
                    base_file_name.abspath().encode('utf-8') 
                log.debug('To keep sync with the math image resource, ' \
                        + 'copying math source to: ' + base_file_str \
                        + ' (before resource-ifying).')
                shutil.copyfile(math_file_name_str, base_file_str)

                # 3b. set the new math filenames:
                full_math_filename = base_file_name
                math_file_name_str = base_file_str

            else:
                log.debug('And this exe_math_latex file still syncs with the '
                        + 'image file.')

            # 4. make the actual resource via GalleryImage 

            # Not sure why this can't be imported up top, but it gives 
            # ImportError: cannot import name GalleryImages, 
            # so here it be: 
            from exe.engine.galleryidevice  import GalleryImage

            # note: the middle GalleryImage field is currently 
            # an unused caption: 
            new_GalleryImage = GalleryImage(self, \
                    '', math_file_name_str, \
                    mkThumbnail=False) 
            new_GalleryImageResource = new_GalleryImage._imageResource 
            mathsrc_resource_path = new_GalleryImageResource._storageName 
            # and re-concatenate from the global resources name, 
            # to build the webUrl to the resource: 
            mathsrc_resource_url = new_GalleryImage.resourcesUrl \
                    + mathsrc_resource_path

            # AND compare with the newly built resource_url from above,
            # to ensure that we've got what we had expected, jah!
            if (mathsrc_resource_url != math_image_resource_url+".tex"):
                log.warn('The math source was resource-ified differently ' \
                        + 'than expected, to: ' + mathsrc_resource_url \
                        + '; using it anyhow')
            else:
                log.debug('math source was resource-ified properly to: ' \
                        + mathsrc_resource_url)

            # 5. do a global string replace of the old attribute with the new,
            #rebuilding the full attribute to: "href=\"/ <path w/ resources> \""
            from_str = "exe_math_latex=\""+preview_math_file+"\""
            to_str =   "exe_math_latex=\""+mathsrc_resource_url+"\""
            #log.debug('replacing exe_math_latex from: ' + from_str \
            #        + ', to: ' + to_str + '.')
            new_content = new_content.replace(from_str, to_str)

            return new_content

        else:
            log.warn('ProcessPairedMathSource did not find math source at: '\
                    + full_math_filename + '; original LaTeX will be absent.')
            return content

        # end ProcessPairedMathSource()

    def ProcessPreviewedLinkResources(self, content):
        """
        NOTE: now that we have 3 versions of ProcessPreviewed*(),
        it might be time to begin exploring a much better, consolidated, 
        approach!  But for now, quickly throw in yet another variation,
        designed to look for <a href="../previews/....">text</a>

        As per ProcessPreviewedMedia(), this was:
        STOLEN from ProcessPreviewedImages(), the functionality here is
        EXTREMELY close, yet just different enough to make it worth
        processing in a separate pass.

        To build up the corresponding resources from any resource added
        in by the tinyMCE advlink-browser plug-in.
        """
        new_content = content

        # first, clear out any empty hrefs:
        #   <a href="/">
        # These should be stopped in the plugin itself, but until then:
        # (and yes, a regexp would be better here! == next up.)
        empty_image_str1 = "<a href=\"/\">"
        empty_image_str2 = "<a href=\"../\">"
        if new_content.find(empty_image_str1) >= 0 \
        or new_content.find(empty_image_str2) >= 0: 
            #new_content = new_content.replace(empty_image_str, "");
            # rather than just pulling out this first tag, though,
            # (and searching for, or leaving the following </a>),
            # howzabout pointing it a nonexistant resource, which
            # will also utilize their default web browser:
            default_href = "<a href=\"resources/.missingURL\">"
            new_content = new_content.replace(empty_image_str1, default_href);
            new_content = new_content.replace(empty_image_str2, default_href);
            log.warn("Empty href tag(s) pointed to resources/.missingURL");

        # By this point, tinyMCE's javascript file browser handler:
        #         common.js's: chooseImage_viaTinyMCE() 
        # has already copied the file into the web-server's relative 
        # directory "/previews", BUT, something in tinyMCE's handler 
        # switches "/previews" to "../previews", so beware.....
        # 

        # DESIGN NOTE: eventually the following processing should be
        # enhanced to look at the HTML tags passed in, and ensure that
        # what is being found as 'href="../previews/.."' is really within
        # an A tag, etc.
        # For now, though, this easy parsing is working well:
        search_str = "href=\"../previews/" 

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

               # first compensate for how TinyMCE HTML-escapes accents:
               pre_input_file_name_str = file_url_str[len(search_str):]
               log.debug("ProcessPreviewedLinkResources: found escaped file = "\
                           + pre_input_file_name_str)
               converter = HtmlToText(pre_input_file_name_str)
               input_file_name_str = converter.convertToText()

               log.debug("ProcessPreviewedLinkResources: unescaped filename = "\
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

                   # Although full filenames (including flatted representations
                   # of their source directory tree) were used to help keep the
                   # filenames here in previewDir unique, this does cause
                   # problems with the filenames being too long, if they
                   # are kept that way.
                   # So.... if an optional .exe_info file is coupled to
                   # this one, go ahead and read in its original basename,
                   # in order to rename the file back to something shorter.
                   # After all, the resource process has its own uniqueifier.

                   # test for the optional .exe_info:
                   basename_value = ""
                   descrip_file_path = Path(server_filename + ".exe_info")
                   if os.path.exists(descrip_file_path) \
                   and os.path.isfile(descrip_file_path): 
                       descrip_file = open(descrip_file_path, 'rb')
                       basename_info = descrip_file.read().decode('utf-8')
                       log.debug("ProcessPreviewedLinkResources: decoded "
                           + "basename = " + basename_info)
                       # split out the value of this "basename=file" key 
                       basename_key_str = "basename="
                       basename_found_pos = basename_info.find(basename_key_str) 
                       # should be right there at the very beginning:
                       if basename_found_pos == 0: 
                           basename_value = \
                                   basename_info[len(basename_key_str):] 
                           # BEWARE: don't just change its name here in this 
                           # dir, since it might be needed multiple times, and 
                           # we won't want to delete it yet, but not deleting 
                           # it might lead to name collision, so, make a 
                           # temporary subdir bases, &: 

                           # copy previewDir/longfile to
                           #             previewDir/bases/basename
                           # (don't worry if this overwrites a previous one)
                           bases_dir = previewDir.joinpath('allyourbase')
                           if not bases_dir.exists():
                               bases_dir.makedirs()
                           # joinpath needs its arguments to be in Unicode:
                           base_file_name = bases_dir.joinpath( \
                                   toUnicode(basename_value))
                           base_file_str =  base_file_name.abspath()
                           log.debug("ProcessPreviewedLinkResources: copied "
                                  + " to basefile = " + base_file_str)

                           shutil.copyfile(file_name_str, base_file_str)
                        
                           # finally, change the name that's used in the 
                           # resource creation in the below GalleryImage
                           file_name_str = base_file_str

                   # in passing GalleryImage into the FieldWithResources,
                   # this field needs to be sure to have an updated
                   # parentNode, courtesy of its idevice:
                   self.setParentNode()
                   
                   # Not sure why this can't be imported up top, but it gives 
                   # ImportError: cannot import name GalleryImages, 
                   # so here it be:
                   from exe.engine.galleryidevice  import GalleryImage

                   # note: the middle GalleryImage field is currently
                   # an unused caption:
                   new_GalleryImage = GalleryImage(self, \
                                                    '', file_name_str, \
                                                    mkThumbnail=False)
                   new_GalleryImageResource = new_GalleryImage._imageResource
                   resource_path = new_GalleryImageResource._storageName
                   # and re-concatenate from the global resources name, 
                   # to build the webUrl to the resource:
                   resource_url = new_GalleryImage.resourcesUrl+resource_path
                   # and finally, go ahead and replace the filename:
                   new_src_string = "href=\""+resource_url

                   new_content = new_content.replace(file_url_str, 
                                                     new_src_string)
                   log.debug("ProcessPreviewedLinkResources: built resource: "\
                           + resource_url)



               else:
                   log.warn("file '"+file_name_str+"' does not exist; " \
                           + "unable to include it as a possible file " \
                           + "resource for this TextAreaElement.")
                   # IDEALLY: would like to replace the entire 
                   #  <img src=.....> tag with text saying "[WARNING:...]",
                   # but this requires more parsing than we have already done
                   # and should really wait until the full-on HTML tags
                   # are checked, in which case an ALT tag can be used.
                   # For now, merely replacing the filename itself with some
                   # warning text that includes the filename:

                   #filename_warning = "src=\"WARNING_FILE="+file_name_str \
                   #        +"=DOES_NOT_EXIST"
                   # just like for empty hrefs,
                   # howzabout pointing it a nonexistant resource, which
                   # will also utilize their default web browser:
                   filename_warning = "href=\"resources/.missingURL"
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
               log.warn("ProcessPreviewedLinkResources: file URL string " \
                        + "appears to NOT have a terminating quote.")
    
            # Find the next source image in the content, continuing the loop:
            found_pos = new_content.find(search_str, found_pos+1) 
        
        return new_content
        # end ProcessPreviewedLinkResources()


    def ProcessPreviewedImages(self, content):
        """
        to build up the corresponding resources from any images (etc.) added
        in by the tinyMCE image-browser plug-in,
        which will have put them into src="../previews/"

        Now updated to include special math images as well, as generated
        by our custom exemath plugin to TinyMCE.  These are to follow the
        naming convention of "eXe_LaTeX_math_#.gif" (where the # is only
        guaranteed to be unique per Preview session, and can therefore end
        up being resource-ified into "eXe_LaTeX_math_#.#.gif"). Furthermore,
        they are to be paired with a source LateX file which is to be of
        the same name, followed by .tex, e.g., "eXe_LaTeX_math_#.gif.tex"
        (and to maintain this pairing, as a resource will need to be named
        "eXe_LaTeX_math_#.#.gif.tex" if applicable, where this does differ
        slightly from what could be its automatic unique-ified 
        resource-ification of: "eXe_LaTeX_math_#.gif.#.tex"!!!)
        """
        new_content = content

        # first, clear out any empty images.
        # Image and the new Math are unfortunately capable
        # of submitting an empty image, which will show as:
        #   <img src="/" />
        # (note that at least the media plugin still embeds a full 
        #  and valid empty-media tag, so no worries about them.)
        # These should be stopped in the plugin itself, but until then:
        empty_image_str = "<img src=\"/\" />"
        if new_content.find(empty_image_str)  >= 0: 
            new_content = new_content.replace(empty_image_str, "");
            log.warn("Empty image tag(s) removed from content");


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
        # BEWARE OF THE ABOVE in regards to ProcessPreviewedMedia(),
        # which takes advantage of the fact that the embedded media
        # actually gets stored as src="previews/".
        # If this little weirdness of Images being stored as src="../previews/"
        # even changes to src="previews/", so more processing will be needed!

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

               # first compensate for how TinyMCE HTML-escapes accents:
               pre_input_file_name_str = file_url_str[len(search_str):]
               log.debug("ProcessPreviewedImages: found escaped file = " \
                           + pre_input_file_name_str)
               converter = HtmlToText(pre_input_file_name_str)
               input_file_name_str = converter.convertToText()

               log.debug("ProcessPreviewedImages: unescaped filename = " \
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

                   # Although full filenames (including flatted representations
                   # of their source directory tree) were used to help keep the
                   # filenames here in previewDir unique, this does cause
                   # problems with the filenames being too long, if they
                   # are kept that way.
                   # So.... if an optional .exe_info file is coupled to
                   # this one, go ahead and read in its original basename,
                   # in order to rename the file back to something shorter.
                   # After all, the resource process has its own uniqueifier.

                   # test for the optional .exe_info:
                   basename_value = ""
                   descrip_file_path = Path(server_filename + ".exe_info")
                   if os.path.exists(descrip_file_path) \
                   and os.path.isfile(descrip_file_path): 
                       descrip_file = open(descrip_file_path, 'rb')
                       basename_info = descrip_file.read().decode('utf-8')
                       log.debug("ProcessPreviewedImages: decoded basename = " \
                           + basename_info)
                       # split out the value of this "basename=file" key 
                       basename_key_str = "basename="
                       basename_found_pos = basename_info.find(basename_key_str) 
                       # should be right there at the very beginning:
                       if basename_found_pos == 0: 
                           basename_value = \
                                   basename_info[len(basename_key_str):] 
                           # BEWARE: don't just change its name here in this 
                           # dir, since it might be needed multiple times, and 
                           # we won't want to delete it yet, but not deleting 
                           # it might lead to name collision, so, make a 
                           # temporary subdir bases, &: 

                           # copy previewDir/longfile to
                           #             previewDir/bases/basename
                           # (don't worry if this overwrites a previous one)
                           bases_dir = previewDir.joinpath('allyourbase')
                           if not bases_dir.exists():
                               bases_dir.makedirs()
                           # joinpath needs its arguments to be in Unicode:
                           base_file_name = bases_dir.joinpath( \
                                   toUnicode(basename_value))
                           base_file_str =  base_file_name.abspath()
                           log.debug("ProcessPreviewedImages: copied to "
                                  + "basefile = " + base_file_str)

                           shutil.copyfile(file_name_str, base_file_str)
                        
                           # finally, change the name that's used in the 
                           # resource creation in the below GalleryImage
                           file_name_str = base_file_str

                   # in passing GalleryImage into the FieldWithResources,
                   # this field needs to be sure to have an updated
                   # parentNode, courtesy of its idevice:
                   self.setParentNode()
                   
                   # Not sure why this can't be imported up top, but it gives 
                   # ImportError: cannot import name GalleryImages, 
                   # so here it be:
                   from exe.engine.galleryidevice  import GalleryImage

                   # note: the middle GalleryImage field is currently
                   # an unused caption:
                   new_GalleryImage = GalleryImage(self, \
                                                    '', file_name_str, \
                                                    mkThumbnail=False)
                   new_GalleryImageResource = new_GalleryImage._imageResource
                   resource_path = new_GalleryImageResource._storageName
                   # and re-concatenate from the global resources name, 
                   # to build the webUrl to the resource:
                   resource_url = new_GalleryImage.resourcesUrl+resource_path
                   # and finally, go ahead and replace the filename:
                   new_src_string = "src=\""+resource_url

                   ##########################################################
                   # POSSIBLE CODE FOR JIMT & COUNTRYMIKE FOR CSS & ALIGNMENT:
                   ###
                   #new_src_string = "class=\"eXe_image\" " + new_src_string
                   ###
                   # BUT BEWARE:
                   # while this will prepend the "class=" to the "src=" string,
                   # these will be re-arranged with further processing of the
                   # field's element, and WORSE:
                   # if tinyMCE is RMB-opened on that image while editting the
                   # element (e.g., to change its size), that class attribute
                   # will no longer exist!
                   # SO: this might be another please to do true tag-based
                   # processing, and not only for new images, but existing too.
                   # OR: is there a way for tinyMCE to recognize+keep classes?
                   ##########################################################

                   new_content = new_content.replace(file_url_str, 
                                                     new_src_string)
                   log.debug("ProcessPreviewedImages: built resource: " \
                           + resource_url)

                   # check to see if this was an exemath image.
                   # If so, then go ahead and handle its counterpart
                   # LaTeX source file as well.
                   # Begin by seeing if this file began with the naming scheme:
                   # WARNING: THERE MIGHT BE A DISCREPENCY:
                   # the math source are being stored as "/previews/..."
                   # while the actual images are still getting "../previews".
                   # So, COULD take that into account here, OR...
                   # just making them match up back in exemath.
                   # (can more easily do here...)
                   # BUT, BEWARE of any problems due to this once they
                   # are resourcified! and further UPDATE edits are done.
                   if resource_path.find("eXe_LaTeX_math_") >= 0:
                   
                       # Remember that the actual image is 
                       #preview_math_src=file_url_str.replace("../previews",\
                       #        "/previews") + ".tex\""
                       # "../previews" is now set in exemath to match:
                       preview_math_src = file_url_str + ".tex\""

                       new_content = self.ProcessPairedMathSource(new_content,\
                               preview_math_src, resource_path, resource_url)


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
        # end ProcessPreviewedImages()


    def MassageContentForRenderView(self, content): 
        """
        Returns an XHTML string for viewing this resource-laden element 
        upon export, since the resources will be flattened no longer exist 
        in the system resources directory....
        This is a wrapper around the specific types of previews,
        images, media, etc..
        """
        new_content = self.MassageImageContentForRenderView(content)
        new_content = self.MassageMediaContentForRenderView(new_content)
        new_content = self.MassageLinkResourceContentForRenderView(new_content)

        return new_content 
    
    
    def MassageMediaContentForRenderView(self, content):
        """
        Stolen and Modified straight from MassageImageContentForRenderView()
        Returns an XHTML string for viewing this resource-laden element 
        upon export, since the resources will be flattened no longer exist 
        in the system resources directory....
        """
        ###########################
        # this is used for exports/prints, etc., and needs to ensure that 
        # any resource paths are removed:
        resources_url_src = "src=\"resources/"
        exported_src = "src=\""
        export_content = content.replace(resources_url_src,exported_src)

        # for embedded media, that takes care of the <embed> tag part,
        # but there's another media occurrence that contains the src param:
        #     "<param name=\"src\" value=\""+resource_url
        resources_url_src = "<param name=\"src\" value=\"resources/"
        exported_src = "<param name=\"src\" value=\""
        export_content = export_content.replace(resources_url_src,exported_src)

        ###########################
        # and now, for Windows Media Player, there's another hack 
        # that requires yet another data massaging: 
        resources_url_src = "x-ms-wmv\" data=\"resources/" 
        exported_src = "x-ms-wmv\" data=\"" 
        export_content = export_content.replace(resources_url_src,exported_src)

        ###########################
        # for mp3 using the embedded XSPF player (which will be exported and
        # no longer require the ../templates prefix), also need to look for 
        # each occurrence of...  
        # a) the mp3 <embed> tag's:
        #   "src=\"../templates/xspf_player.swf?song_url=resources/"
        resources_url_src = \
                "src=\"../templates/xspf_player.swf?song_url=resources/"
        exported_src =  "src=\"xspf_player.swf?song_url="
        export_content = export_content.replace(resources_url_src,exported_src)
        # b) the exe_mp3 info <embed> tag's:
        #   "exe_mp3=\"../templates/xspf_player.swf?song_url=resources/"
        resources_url_src = \
                "exe_mp3=\"../templates/xspf_player.swf?song_url=resources/"
        exported_src =  "exe_mp3=\"xspf_player.swf?song_url="
        export_content = export_content.replace(resources_url_src,exported_src)
        # AND c) the mp3's <param> tag's:
        #  "<param name=\"src\" \
        #       value=\"../templates/xspf_player.swf?song_url=resources/"
        resources_url_src = "<param name=\"src\" "\
                + "value=\"../templates/xspf_player.swf?song_url=resources/"
        exported_src = "<param name=\"src\" value=\"xspf_player.swf?song_url="
        export_content = export_content.replace(resources_url_src,exported_src)
        # AND d) the exe_mp3's info <param> tag's:
        #  "<param name=\"exe_mp3\" \
        #       value=\"../templates/xspf_player.swf?song_url=resources/"
        resources_url_src = "<param name=\"exe_mp3\" "\
                + "value=\"../templates/xspf_player.swf?song_url=resources/"
        exported_src = "<param name=\"exe_mp3\" "\
                + "value=\"xspf_player.swf?song_url="
        export_content = export_content.replace(resources_url_src,exported_src)
        # FINALLY, note that all 4 of the above MP3 replacements probably
        # could have been done by simply replacing:
        #     "../templates/xspf_player.swf?song_url=resources/"
        # regardless of the context, but it seemed a bit safer to ensure
        # that they were be replaced in expected locations only.
        
        ###########################
        # for flv using the embedded flowplayer (which will be exported and
        # no longer require the ../templates prefix), also need to look for 
        # each occurrence of...  
        # a) the flv <object> tag's:
        #   "data=\"../templates/flowPlayer.swf"
        resources_url_src = \
                "data=\"../templates/flowPlayer.swf"
        exported_src =  "data=\"flowPlayer.swf"
        export_content = export_content.replace(resources_url_src,exported_src)
        # b) the flv <param> tag's:
        #   <param name="data" value="../templates/flowPlayer.swf"
        resources_url_src = "<param name=\"data\" "\
                + "value=\"../templates/flowPlayer.swf"
        exported_src = "<param name=\"data\" value=\"flowPlayer.swf"
        export_content = export_content.replace(resources_url_src,exported_src)
        # c) the exe_flv info <embed> tag's:
        #   "exe_flv=\"resources/"
        resources_url_src = \
                "exe_flv=\"resources/"
        exported_src =  "exe_flv=\""
        export_content = export_content.replace(resources_url_src,exported_src)
        # d) the exe_flv's info <param> tag's:
        #  "<param name=\"exe_flv\" \
        #       value=\"resources/"
        resources_url_src = "<param name=\"exe_flv\" "\
                + "value=\"resources/"
        exported_src = "<param name=\"exe_flv\" "\
                + "value=\""
        export_content = export_content.replace(resources_url_src,exported_src)
        # and finally, e) the flashvars playlist url:
        #    playList: [ { url: 'resources/'
        resources_url_src = "playList: [ { url: 'resources/" 
        exported_src = "playList: [ { url: '" 
        export_content = export_content.replace(resources_url_src,exported_src)



        return export_content

    def MassageLinkResourceContentForRenderView(self, content):
        """
        Stolen and Modified straight from MassageImageContentForRenderView()
        Returns an XHTML string for viewing this resource-laden element 
        upon export, since the resources will be flattened no longer exist 
        in the system resources directory....
        """
        # this is used for exports/prints, etc., and needs to ensure that 
        # any resource paths are removed:
        resources_url_src = "href=\"resources/"
        exported_src = "href=\""
        export_content = content.replace(resources_url_src,exported_src)

        return export_content

    
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

        # and any math-image's counterpart LaTeX source files,
        # since they are exported as resources as well:
        resources_url_src = "exe_math_latex=\"resources/"
        exported_src = "exe_math_latex=\""
        export_content = export_content.replace(resources_url_src,exported_src)

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

    def upgradeToVersion2(self):
        """ 
        remove any extraneous thumbnails which were created with some of the 
        earlier embedded resources, in v0.95 - v0.98, due to the earlier use
        of GalleryImages, which, be default, would create such a thumbail.
        """
        for image in self.images:
            if (not hasattr(image, 'makeThumbnail') or image.makeThumbnail) \
            and image._thumbnailResource:
                # note: embedded image thumbnails were automatically 
                # generated before the addition of the makeThumbnail flag.
                log.debug('FieldWithResource: removing unused thumbnail: '\
                        + repr(image._thumbnailResource.storageName))
                image._thumbnailResource.delete()
                image._thumbnailResource = None
                image.makeThumbnail = False



# ===========================================================================
class TextAreaField(FieldWithResources):
    """
    A Generic iDevice is built up of these fields.  Each field can be
    rendered as an XHTML element

    Note that TextAreaFields can now hold any number of image resources,
    which will typically be inserted by way of tinyMCE.
    """
    persistenceVersion = 1

    # these will be recreated in FieldWithResources' TwistedRePersist:
    nonpersistant      = ['content', 'content_wo_resourcePaths']

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

    # these will be recreated in FieldWithResources' TwistedRePersist:
    nonpersistant      = ['content', 'content_wo_resourcePaths']

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

    # these will be recreated in FieldWithResources' TwistedRePersist:
    nonpersistant      = ['content', 'content_wo_resourcePaths']

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
                                  idevice._answerInstruc, u'')
        self.answerTextArea.idevice = idevice

        self.feedbackTextArea = TextAreaField(x_(u'Feedback'), 
                                    idevice._feedbackInstruc, u'')
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
                                        idevice._questionInstruc, u'')
        self.questionTextArea.idevice     = idevice
        self.hintTextArea         = TextAreaField(x_(u'Hint'), 
                                        idevice._hintInstruc, u'')
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
                                     question._optionInstruc, u'')
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
                                    self.questionInstruc, u'')
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
                                    self.feedbackInstruc, u'')
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

