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
MathIdevice: just has a block of text
"""

import logging
from exe.engine.idevice import Idevice
from exe.engine.field   import MathField
log = logging.getLogger(__name__)
from exe.engine.path      import Path
from exe.engine.freetextidevice   import FreeTextIdevice
from exe                       import globals as G
import os


# ===========================================================================
class MathIdevice(Idevice):
    """
    MathIdevice: just has a block of text
    """

    persistenceVersion = 1
    

    def __init__(self, instruc="", latex=""):
        Idevice.__init__(self, _(u"Maths"), 
                         _(u"University of Auckland"), 
                         _("""The mathematical language LATEX has been 
                        used to enable your to insert mathematical formula 
                        into your content. It does this by translating 
                        LATEX into an image which is then displayed
                         within your eXe content. We would recommend that 
                        you use the Free Text iDevice to provide 
                        explanatory notes and learning instruction around 
                        this graphic."""),
                        "", 
                        "")
        self.emphasis = Idevice.NoEmphasis
        self.content  = MathField(_(u"Maths"), 
                                      _(u"""You can use the toolbar or enter latex manually into the textarea. """))
        self.content.idevice = self

    def getResourcesField(self, this_resource):
        """
        implement the specific resource finding mechanism for this iDevice:
        """
        # be warned that before upgrading, this iDevice field could not exist:
        if hasattr(self, 'content') and hasattr(self.content, 'gifResource'):
            if this_resource == self.content.gifResource:
                return self.content

        return None
       
      
    def getRichTextFields(self):
        """
        Like getResourcesField(), a general helper to allow nodes to search 
        through all of their fields without having to know the specifics of each
        iDevice type.  
        """
        # Math iDevice has no rich-text fields:
        return []
        

    def upgradeToVersion1(self):
        """
        Converting MathsIdevice -> FreeTextIdevice,
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
              MathsIdevice -> FreeTextIdevice,
        now that FreeText can hold embeddded images.
        """
        new_content = ""

        # ensure that an image resource still exists on this ImageWithText,
        # before trying to add it into the FreeText idevice.
        # Why?  corrupt packages have been seen missing resources...
        # (usually in with extra package objects as well, probably
        # from old code doing faulty Extracts, or somesuch nonesense)
        imageResource_exists = False

        if not self.content.gifResource is None:
            if os.path.exists(self.content.gifResource.path) and \
            os.path.isfile(self.content.gifResource.path): 
                imageResource_exists = True
            else:
                log.warn("Couldn't find Maths image when upgrading "\
                        + self.content.gifResource.storageName)

        if imageResource_exists:
            new_content += "<img src=\"resources/" \
                    + self.content.gifResource.storageName + "\" " 
            # create the expected math resource url for comparison later,
            # once we do actually create it:
            math_resource_url="resources/" \
                    + self.content.gifResource.storageName + ".tex\" " 
            new_content += "exe_math_latex=\"" + math_resource_url + "\" "
            new_content += "exe_math_size=\"" + repr(self.content.fontsize) \
                    + "\" "
            # no height or width for math images, eh? nope.
            new_content += "/> \n"

        elif self.content.gifResource:
            new_content += "<BR>\n[WARNING: missing image: " \
                    + self.content.gifResource.storageName + "]\n"


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
            
            full_image_path = self.content.gifResource.path
            # with empty caption:
            new_GalleryImage = GalleryImage(replacementIdev.content, \
                    '',  full_image_path, mkThumbnail=False)

            # and....  write the latex_source out into the preview_math_srcfile
            # such that it can then be passed into the compile command.
            # Using the desired name (image.gif.tex), write it into tempWebDir:
            webDir = Path(G.application.tempWebDir)
            source_tex_name = self.content.gifResource.storageName+".tex"
            math_path = webDir.joinpath(source_tex_name)
            math_filename_str = math_path.abspath().encode('utf-8')

            log.debug("convertToFreeText: writing LaTeX source into \'" \
                                        + math_filename_str + "\'.")
            math_file = open(math_filename_str, 'wb')
            # do we need to append a \n here?:
            math_file.write(self.content.latex)
            math_file.flush()
            math_file.close()

            # finally, creating a resource for the latex_source as well:
            new_GalleryLatex = GalleryImage(replacementIdev.content, \
                    '', math_filename_str, mkThumbnail=False) 
            new_GalleryLatexResource = new_GalleryLatex._imageResource
            mathsrc_resource_path = new_GalleryLatexResource._storageName
            # and re-concatenate from the global resources name, 
            # to build the webUrl to the resource: 
            mathsrc_resource_url = new_GalleryLatex.resourcesUrl \
                    + mathsrc_resource_path
                
            # AND compare with the newly built resource_url from above,
            # to ensure that we've got what we had expected, jah!
            if (mathsrc_resource_url != math_resource_url): 
                log.warn('The math source was resource-ified differently ' \
                        + 'than expected, to: ' + mathsrc_resource_url \
                        + '; the source will need to be recreated.') 
                # right. we COULD go ahead and change the exe_math_latex
                # attribute to point to the actual mathsrc_resource_url,
                # EXCEPT that the entire exemath plugin is currently built
                # with the idea that the source .tex file will always be named
                # as the mathimage.gif.tex, and this exe_math_latex tag
                # is really just letting the rest of the world know that 
                # there IS corresponding source expected there.
                # If exemath is to ever change and use the actual contents
                # of this exe_math_latex tag (rather than just appended .tex),
                # then this could be revisited here.

            else: 
                log.debug('math source was resource-ified properly to: ' \
                        + mathsrc_resource_url)


        # and move the new idevice up to the position following this node!
        while ( self.parentNode.idevices.index(replacementIdev) \
                > ( (self.parentNode.idevices.index(self) + 1))):
            replacementIdev.movePrev()

        # finally: delete THIS idevice itself, deleting it from the node
        self.delete()

                
# ===========================================================================


# ===========================================================================
