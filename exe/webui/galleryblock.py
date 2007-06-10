# ===========================================================================
# eXe 
# Copyright 2004-2006, University of Auckland
# Copyright 2007 New Zealand Tertiary Education Commission
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
Gallery block can render a group of images, each with desciptions and popup on
a single image
"""

import logging
import urllib
import re
from exe.webui.block            import Block
from exe.webui                  import common

log = logging.getLogger(__name__)

# ===========================================================================
class GalleryBlock(Block):
    """
    Gallery block can render a group of images, each with desciptions and popup
    on a single image.

    Each of the GalleryImages owned by our GalleryIdevice is identified by its
    index in the 'self.idevice' list.
    """

    # Default Attribute Values
    thumbnailsPerRow = 4
    thumbnailSize = (96, 96)
    unicodeRe = re.compile(r'(%u(\d|[A-F,a-f]){4})|(%(\d|[A-F,a-f]){2})')

    def __init__(self, parent, idevice):
        """
        'parent' is our parent 'Renderable' instance
        """
        Block.__init__(self, parent, idevice)
        
    # Protected Methods

    def _generateTable(self, perCell):
        """
        Generates a table of images,
        'perCell' is called and the result put in each cell, it should take one
        argument, which is an 'exe.engine.galleryIdevice.GalleryImage' instance
        and return a list of strings that will be later joined with '\n' chars.
        """
        width = self.idevice.images[0].thumbnailSize[0]
        html = [u'<table width="100%" border="0" cellpadding="3" '
                 'cellspacing="0" style="margin:4px; border-style:groove;">',
                u'  <tbody>']
        i = 0
        for image in self.idevice.images:
            i += 1
            if i == 1:
                html += ['    <tr>']
            html += [u'      <td width="%spx">' % (width+6)]
            html += perCell(image, i-1)
            html += [u'      </td>']
            if i == self.thumbnailsPerRow:
                html += ['    </tr>']
                i = 0
        if 0 < i < self.thumbnailsPerRow :
            html += ['<td></td>'] * (self.thumbnailsPerRow - i)
            html.append('</tr>')
        html += [u'  </tbody>',
                 u'</table>']
        return html

    # Public Methods

    def process(self, request):
        """
        Handles a post from the webui and changes our state accordingly
        """
        log.debug("process " + repr(request.args))
        # If the commit is not to do with us forget it
        
        obj = request.args.get('object', [''])[0]
        
        if "title"+self.id in request.args:
            self.idevice.title = request.args["title"+self.id][0]
            if obj != self.id:
                self.idevice.recreateResources()
                    
        if obj != self.id:
            Block.process(self, request)
            return 
        # Separate out the action we want to do and the params
        action = request.args.get('action', [''])[0]
        if action.startswith('gallery.'):
            self.processGallery(action)
        if action == 'done':
            self.idevice.recreateResources()
        if self.mode == Block.Edit:
            self.processCaptions(request)
        # Let our ancestor deal with the rest
        Block.process(self, request)

    def processGallery(self, action):
        """
        Processes gallery specific actions
        """
        action, params = action.split('.', 2)[1:]
        # There are certain events that we only care about when in edit mode
        if self.mode == Block.Edit:
            # See if we will delete an image
            # Add an image
            if action == 'addImage':
                # Decode multiple filenames
                for filename in params.split('&'):
                    # Unquote normal and unicode chars
                    match = self.unicodeRe.search(filename)
                    while match:
                        start, end = match.span()
                        if match.groups()[0]:
                            numStart = start + 2 # '%u'
                        else:
                            numStart = start + 1 # '%'
                        code = unichr(int(filename[numStart:end], 16))
                        filename = filename[:start] + code + filename[end:]
                        match = self.unicodeRe.search(filename)
                    self.idevice.addImage(filename)
            # Edit/change an image
            if action == 'changeImage':
                data = params.split('.', 2)
                imageId = '.'.join(data[:2])
                filename = data[2]
                self.idevice.images[imageId].imageFilename = filename
            # Move image one left
            if action == 'moveLeft':
                imgs = self.idevice.images
                img = imgs[params]
                index = imgs.index(img)
                if index > 0:
                    imgs[index-1], imgs[index] = imgs[index], imgs[index-1]
            # Move image one right
            if action == 'moveRight':
                imgs = self.idevice.images
                img = imgs[params]
                index = imgs.index(img)
                if index < len(imgs):
                    imgs[index+1], imgs[index] = imgs[index], imgs[index+1]
            # Delete an image?
            if action == 'delete':
                del self.idevice.images[params]

    def processCaptions(self, request): 
        """
        Processes changes to all the image captions
        """
        # Check all the image captions for changes
        for image in self.idevice.images:
            # See if the caption has changed
            newCaption = request.args.get('caption'+image.id, [None])[0]
            if newCaption is not None:
                image.caption = newCaption

    def renderEdit(self, style):
        """
        Renders a table of thumbnails allowing the user to
        move/add/delete/change each gallery image
        """
        html = [u'<div class="iDevice">',
                common.formField('textInput', _('Title'),
                                 "title"+self.id, '',
                                 self.idevice.titleInstruc,
                                 self.idevice.title),
                u'<div class="block">',
                u'<input type="button" ',
                u'onclick="addGalleryImage(\'%s\')"' % self.id,
                u'value="%s" />\n' % _(u"Add images"),
                common.elementInstruc(self.idevice.addImageInstr),
                u'</div>',
                ]

        if len(self.idevice.images) == 0:
            html += [u'<div style="align:center center">',
                     _(u'No Images Loaded'),
                     u'</div>']
        else:
            def genCell(image, i):
                """Generates a single cell of our table"""
                def submitLink(method):
                    """Makes submitLink javascript code"""
                    method = 'gallery.%s.%s' % (method, image.id)
                    params = "'%s', %s, true" % (method, self.id)
                    return "javascript:submitLink(%s)" % params
                changeGalleryImage = '\n'.join([
                        u'           <a title="%s"' % _(u'Change Image'),
                        u'              href="#" ',
                        u'              onclick="changeGalleryImage(' +
                        u"'%s', '%s')" % (self.id, image.id) +
                        u'">'])
                result = [changeGalleryImage,
                          u'          <img',
                          u'           alt="%s"' % image.caption,
                          u'           style="align:center top;"',
                          u'           src="%s"/>' % image.thumbnailSrc,
                          u'        </a>',
                          u'        <span>',
                          u'        <input id="caption%s" ' % image.id,
                          u'               name="caption%s" ' % image.id,
                          u'               value="%s" ' % image.caption,
                          u'               style="align:center;width:98%;"/>',
                          # Edit button
                          changeGalleryImage,
                          u'          <img alt="%s"' % _(u'Change Image'),
                          u'           src="/images/stock-edit.png"/>'
                          u'        </a>']
                # Move left button
                if image.index > 0:
                    result += [
                          u'        <a title="%s"' % _(u'Move Image Left'),
                          u'           href="javascript:%s">' % submitLink('moveLeft'),
                          u'        <img alt="%s"' % _(u'Go Back'),
                          u'         src="/images/stock-go-back.png"/>'
                          u'        </a>',
                          ]
                else:
                    result += [
                          u'        <img src="/images/stock-go-back-off.png"/>']
                # Move right button
                if image.index < len(image.parent.images)-1:
                    result += [
                          u'        <a title="%s"' % _(u'Move Image Right'),
                          u'           href="javascript:%s">' % submitLink('moveRight'),
                          u'        <img alt="%s"' % _(u'Go Forward'),
                          u'         src="/images/stock-go-forward.png"/>',
                          u'        </a>',
                          ]
                else:
                    result += [
                          u'        ' + 
                          u'<img alt="%s" ' % _(u'Go Forward (Not Available)'),
                          u' src="/images/stock-go-forward-off.png"/>']
                result += [
                          # Delete button
                          u'        <a title="%s"' % _(u'Delete Image'),
                          u'           href="javascript:%s">' % submitLink('delete'),
                          u'        <img alt="%s" ' % _(u'Delete'),
                          u'             src="/images/stock-delete.png"/>',
                          u'        </a>',
                          u'      </span>']
                return result
            html += self._generateTable(genCell)
        html += [self.renderEditButtons(),
                 u'</div>']
        return u'\n    '.join(html)

    def processDelete(self, request):
        """
        Override's deleting the Idevice to remove all the package resource files
        too.
        """
        for image in self.idevice.images[::-1]:
            image.delete()
        Block.processDelete(self, request)
        
    def renderViewContent(self):
        """
        HTML shared by view and preview
        """
        cls = self.idevice.__class__
        if len(self.idevice.images) == 0:
            html = [u'   <div style="align:center center">',
                    _(u'No Images Loaded'),
                    u'</div>']
        else:
            def genCell(image, i):
                """
                Generates a single table cell
                """
                width, height = image.size
                title = _(u'Show %s Image') % image.caption
                return [u'        <a title="%s" ' % title,
                        u'         href="#"',
                        u'         onclick="window.open(',
                        u"'%s?i=%d', 'galleryImage', " % (self.idevice.htmlSrc, i) +
                        u"'menubar=no,alwaysRaised=yes,dependent=yes," +
                        u"width=640," +
                        u"height=480,scrollbars=yes," +
                        u"screenX='+((screen.width/2)-(640/2))+" +
                        u"',screenY='+((screen.height/2)-(480/2))" +
                        u');"',
                        u'           style="cursor: pointer; align:center top;">',
                        u'          <img alt="%s"' % title,
                        u'               src="%s"/>' % image.thumbnailSrc,
                        u'        </a>',
                        u'        <div style="align:center;width=100%">',
                        u'          %s' % (image.caption or '&nbsp;'),
                        u'        </div>']
            html = self._generateTable(genCell)
        return u'\n    '.join(html)

    def renderPreview(self, style):
        """
        Renders html for teacher preview inside of exe
        """
        cls = self.idevice.__class__
        cls.preview()
        return Block.renderPreview(self, style)
        
    def renderView(self, style):
        """
        Renders the html for export
        """
        # Temporarily change the resources Url for exporting the images nicely
        cls = self.idevice.__class__
        cls.export()
        try:
            html  = [u'<div class="iDevice emphasis%s" ' %
                     unicode(self.idevice.emphasis),
                     u'>',
                     u'<img alt="%s" ' % _(u'IDevice Icon'),
                     u'     class="iDevice_icon" ',
                     u'src="icon_'+self.idevice.icon+'.gif" />'
                     u'<span class="iDeviceTitle">',      
                     self.idevice.title,
                     '</span><br/>']
            html += [self.renderViewContent()]
            html += [u'</div>']
            return u'\n    '.join(html)
        finally:
            # Put everything back into the default preview mode
            cls.preview()

from exe.engine.galleryidevice  import GalleryIdevice
from exe.webui.blockfactory     import g_blockFactory
g_blockFactory.registerBlockType(GalleryBlock, GalleryIdevice)    

# ===========================================================================
