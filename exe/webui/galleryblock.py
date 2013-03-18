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

        if not hasattr(self.idevice,'undo'):
            self.idevice.undo = True
        
    # Protected Methods

    def _generateTable(self, perCell):
        """
        Generates a table of images,
        'perCell' is called and the result put in each cell, it should take one
        argument, which is an 'exe.engine.galleryIdevice.GalleryImage' instance
        and return a list of strings that will be later joined with '\n' chars.
        """
        width = self.idevice.images[0].thumbnailSize[0]
        html = [u'<ul class="exeImageGallery" id="exeImageGallery%s">' % self.idevice.id]
        i = 0
        for image in self.idevice.images:
            i += 1
            html += ['<li>']
            html += perCell(image, i-1, self.idevice.id)
            html += ['</li>']
        html += [u'</ul><script type="text/javascript">exe_idevices.imageGallery.init(\'exeImageGallery%s\')</script>' % self.idevice.id]
        return html

    # Public Methods

    def process(self, request):
        """
        Handles a post from the webui and changes our state accordingly
        """
        log.debug("process " + repr(request.args))
        # If the commit is not to do with us forget it

        is_cancel = common.requestHasCancel(request)
        
        obj = request.args.get('object', [''])[0]
        
        if "title"+self.id in request.args \
        and not is_cancel:
            self.idevice.title = request.args["title"+self.id][0]
            if obj != self.id:
                self.idevice.recreateResources()
                self.processCaptions(request)
                    
        if obj != self.id:
            Block.process(self, request)
            return 
        # Separate out the action we want to do and the params
        action = request.args.get('action', [''])[0]
        if action.startswith('gallery.'):
            self.processGallery(action)
        if self.mode == Block.Edit \
        and not is_cancel:
            self.processCaptions(request)
        if action == 'done':
            self.idevice.recreateResources()
            # remove the undo flag in order to reenable it next time:
            if hasattr(self.idevice,'undo'): 
                del self.idevice.undo
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
                #JR: Cambiamos para que solo anada la ultima imagen y no como lo hacia antes que siempre
                #    anadia todas las imagenes otra vez
                aux = params.split('&')
                filename = aux[len(aux)-1]
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
                """ JR: Esto es lo que habia antes
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
                    self.idevice.addImage(filename)"""
                # disable Undo following such an action:
                self.idevice.undo = False
            # Edit/change an image
            if action == 'changeImage':
                data = params.split('.', 2)
                imageId = '.'.join(data[:2])
                filename = data[2]
                self.idevice.images[imageId].replace(filename)
                # disable Undo following such an action:
                self.idevice.undo = False
            # Move image one left
            if action == 'moveLeft':
                imgs = self.idevice.images
                img = imgs[params]
                index = imgs.index(img)
                if index > 0:
                    imgs[index-1], imgs[index] = imgs[index], imgs[index-1]
                # disable Undo following such an action:
                self.idevice.undo = False
            # Move image one right
            if action == 'moveRight':
                imgs = self.idevice.images
                img = imgs[params]
                index = imgs.index(img)
                if index < len(imgs):
                    imgs[index+1], imgs[index] = imgs[index], imgs[index+1]
                # disable Undo following such an action:
                self.idevice.undo = False
            # Delete an image?
            if action == 'delete':
                del self.idevice.images[params]
                # disable Undo following such an action:
                self.idevice.undo = False

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
        this_package = None
        if self.idevice is not None and self.idevice.parentNode is not None:
            this_package = self.idevice.parentNode.package
        html = [u'<div class="iDevice">',
                common.formField('textInput', this_package, _('Title'),
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
            def genCell(image, i, id):
                """Generates a single cell of our table"""
                def submitLink(method):
                    """Makes submitLink javascript code"""
                    method = 'gallery.%s.%s' % (method, image.id)
                    params = "'%s', %s, true" % (method, self.id)
                    return "javascript:submitLink(%s)" % params

                def confirmThenSubmitLink(msg, method):
                    method = 'gallery.%s.%s' % (method, image.id)
                    params = "'%s', '%s', %s, true" % (re.escape(msg), method, self.id)
                    return "javascript:confirmThenSubmitLink(%s)" % params
                changeGalleryImage = '\n'.join([
                        u'           <a title="%s"' % _(u'Change Image'),
                        u'              href="#" ',
                        u'              onclick="changeGalleryImage(' +
                        u"'%s', '%s')" % (self.id, image.id) +
                        u'">'])
                result = [changeGalleryImage,
                          u'          <img class="submit"',
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
                          u'           class="submit"'
                          u'           src="/images/stock-edit.png"/>'
                          u'        </a>']
                # Move left button
                if image.index > 0:
                    result += [
                          u'        <a title="%s"' % _(u'Move Image Left'),
                          u'           href="%s">' % submitLink('moveLeft'),
                          u'        <img alt="%s"' % _(u'Go Back'),
                          u'         class="submit"'
                          u'         src="/images/stock-go-back.png"/>'
                          u'        </a>',
                          ]
                else:
                    result += [
                          u'        <img class="submit"'
                          u'         src="/images/stock-go-back-off.png"/>']
                # Move right button
                if image.index < len(image.parent.images)-1:
                    result += [
                          u'        <a title="%s"' % _(u'Move Image Right'),
                          u'           href="%s">' % submitLink('moveRight'),
                          u'        <img alt="%s"' % _(u'Go Forward'),
                          u'         class="submit"'
                          u'         src="/images/stock-go-forward.png"/>',
                          u'        </a>',
                          ]
                else:
                    result += [
                          u'        ' + 
                          u'<img alt="%s" ' % _(u'Go Forward (Not Available)'),
                          u' class="submit"'
                          u' src="/images/stock-go-forward-off.png"/>']
                result += [
                          # Delete button
                          u'        <a title="%s"' % _(u'Delete Image'),
                          u'           href="%s">' % (confirmThenSubmitLink(_('Delete this image?'), 'delete')),
                          u'        <img class="submit" alt="%s" ' \
                                                        % _(u'Delete'),
                          u'             src="/images/stock-delete.png"/>',
                          u'        </a>',
                          u'<a href="javascript:addGalleryImage(%s)"' % id,
                          u' title="%s"><img src="/images/stock-add.png"' % _(u"Add images"),
                          u' class="submit" alt="%s" /></a>' % _(u"Add images"),
                          u'      </span>']
                return result
            html += self._generateTable(genCell)
        html += [self.renderEditButtons(undo=self.idevice.undo),
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
            html = [u'<p class="exeImageGallery no-images">',
                    _(u'No Images Loaded'),
                    u'</p>']
        else:
            def genCell(image, i, id):
                """
                Generates a single table cell
                """
                width, height = image.size
                title = image.caption
                return ['<a title="%s"' % title,
                        ' href="%s"' % urllib.quote(image.imageSrc),
                        ' rel="lightbox[exeImageGallery%s]">' % id +
                        '<img alt="%s"' % title,
                        ' width="128"'
                        ' height="128"'
                        ' src="%s" />' % urllib.quote(image.thumbnailSrc),
						'<span class="tit">%s</span>' % title,
                        '</a>']			
            html = self._generateTable(genCell)
        return u''.join(html)

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
                     u'<h2 class="iDeviceTitle">',      
                     self.idevice.title,
                     '</h2>']
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
