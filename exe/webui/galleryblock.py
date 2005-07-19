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
Gallery block can render a group of images, each with desciptions and zoom in on
a single image
"""

import logging
import gettext
from exe.engine.galleryidevice  import GALLERY_MODE, SINGLE_IMAGE_MODE
from exe.webui.block            import Block
from exe.webui                  import common
from exe.webui.element          import TextElement

log = logging.getLogger(__name__)
_   = gettext.gettext

# ===========================================================================
class GalleryBlock(Block):
    """
    Gallery block can render a group of images, each with desciptions and zoom
    in on a single image.

    Each of the GalleryImages owned by our GalleryIdevice is identified by its
    index in the 'self.idevice.images' list.
    """

    # Default Attribute Values
    thumbnailsPerRow = 5
    thumbnailSize = (96, 76)

    def __init__(self, parent, idevice):
        """
        'parent' is our parent 'Renderable' instance
        """
        Block.__init__(self, parent, idevice)
        self.currentImageIndex = 0 # The image that we are currently showing
        
    # Protected Methods

    def _generateTable(self, perCell):
        """
        Generates a table of images,
        'perCell' is called and the result put in each cell, it should take one
        argument, which is an 'exe.engine.galleryIdevice.GalleryImage' instance
        and return a list of strings that will be later joined with '\n' chars.
        """
        html = [u'<table width="100%" border="1" cellpadding="3" '
                 'cellspacing="3">',
                u'  <tbody>',
                u'    <tr>']
        thumbnailsThisRow = 0
        for image in self.idevice.images:
            if thumbnailsThisRow % self.thumbnailsPerRow == 0:
                html += ['    </tr>']
            html += [u'      <td>']
            html += perCell(image)
            html += [u'      </td>']
            thumbnailsThisRow += 1
        html += [u'    </tr>',
                 u'  </tbody>',
                 u'</table>']
        return html

    # Public Methods

    def process(self, request):
        """
        Handles a post from the webui and changes our state accordingly
        """
        log.debug("process " + repr(request.args))
        if self.mode == self.Edit:
            # New image added
            imagePath = request.args.get('newImagePath'+self.id, [None])[0]
            if imagePath:
                print 'New Image Path:', imagePath
                self.idevice.addImage(imagePath)
            # Check for each image
            toDelete = None
            for image in self.idevice.images:
                # See if the caption has changed
                newCaption = request.args.get('caption'+image.id, [None])[0]
                if newCaption is not None:
                    image.caption = newCaption
                # See if it is to be deleted
                delete = request.args.get('delete'+image.id, [None])[0]
                if delete is not None:
                    toDelete = image
            # Delete the image that was deleted
            if toDelete:
                toDelete.delete()
        elif self.idevice.mode == GALLERY_MODE:
            # Check for each image
            for image in self.idevice.images:
                # See if this image has been renamed
                newCaption = request.args.get('caption'+image.id, [None])[0]
                if newCaption is not None:
                    image.caption = newCaption
                # Zoom in on this image
                if request.args.get('zoomIn'+image.id, [''])[0]:
                    self.idevice.currentImageIndex = request.args['zoomImage%s'][0]
                    self.idevice.mode = SINGLE_IMAGE_MODE
        else:
            # Switch to gallery mode
            if ('galleryMode%s' % self.id) in request.args:
                self.idevice.mode = GALLERY_MODE
            # Next
            # Previous
        # Let our ancestor deal with the rest
        Block.process(self, request)
        
    def renderEdit(self, style):
        """
        Renders an editable array or 
        """
        html = [u'<div class="iDevice">',
                u'<p>',
                u'  <a href="javascript:addGalleryImage(\'%s\')">' % self.id,
                u'    Click here to add images',
                u'  </a>',
                common.hiddenField('newImagePath'+self.id),
                u'</p>']
        if len(self.idevice.images) == 0:
            html += [u'<div style="align:center center">',
                     u'  No Images Loaded',
                     u'</div>']
        else:
            def genCell(image):
                """Generates a single cell of our table"""
                return [u'        <a '
                         u' href="javascript:zoomGalleryImage('
                         u"""'%s')">""" % image.id,
                         u'          <img',
                         u'           alt="%s"' % image.caption,
                         u'           src="%s"/>' % image.thumbnailSrc,
                         u'        </a>',
                         u'        <span>',
                         u'        <input id="caption%s" ' % image.id,
                         u'               name="caption%s" ' % image.id,
                         u'               value="%s" ' % image.caption,
                         u'               style="align:center;width:98%;"/>',
                         u'        <a href="javascript:submitLink(',
                         u'''         'gallery.delete%s', %s, true)">''' % (image.id, self.id),
                         u'          <img src="/images/stock-delete.png"/>',
                         u'        </a>',
                         u'         '+common.hiddenField('path'+image.id),
                         u'         '+common.hiddenField('zoomIn'+image.id)]
            html += self._generateTable(genCell)
        html += [self.renderEditButtons(),
                 u'</div>']
        return u'\n    '.join(html).encode('utf8')
        
    def renderEditSingleImage(self, style):
        """
        Renders a single image, and allows the user to change its text
        """

    def renderPreview(self, style):
        """
        Renders the HTML for preview inside exe
        """
        html  = [u'<div class="iDevice emphasis%s" ' %
                 unicode(self.idevice.emphasis),
                 u' ondblclick="submitLink(\'edit\',%s, 0);">' % self.id]
        if self.idevice.mode == GALLERY_MODE:
            html += self.renderPreviewGallery(style)
        else:
            html += self.renderPreviewSingleImage(style)
        html += [self.renderViewButtons(),
                 u'</div>']
        return u'\n    '.join(html).encode('utf8')

    def renderPreviewGallery(self, style):
        """
        Shows the image in a nice gallery
        """
        if len(self.idevice.images) == 0:
            html = [u'<div style="align:center center">',
                    u'  No Images Loaded',
                    u'</div>']
        else:
            def genCell(image):
                """
                Generates a single table cell
                """
                return [u'        <a name="top">',
                        u'          <img',
                        u'           alt="%s"' % image.caption,
                        u'           src="%s"/>' % image.thumbnailSrc,
                        u'        </a>',
                        u'        <div style="align:center;width:98%;">',
                        u'          %s' % image.caption,
                        u'        </div>']
            html = self._generateTable(genCell)
        return html
        
    def renderPreviewSingleImage(self, style): pass
    def renderView(self, style): pass
