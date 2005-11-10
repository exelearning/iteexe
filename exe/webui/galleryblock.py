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
    unicodeRe = re.compile(r'(%u(\d|[A-F,a-f])+)')

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
            html += perCell(image)
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
        if "title"+self.id in request.args:
            self.idevice.title = request.args["title"+self.id][0]
            
        obj = request.args.get('object', [''])[0]
        if obj != self.id:
            Block.process(self, request)
            return 
        # Separate out the action we want to do and the params
        action = request.args.get('action', [''])[0]
        if action.startswith('gallery.'):
            self.processGallery(action)
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
                filenames = map(urllib.unquote, params.split('&'))
                for filename in filenames:
                    # Unquote unicode chars
                    while 1:
                        match = self.unicodeRe.search(filename)
                        if not match: 
                            break
                        start, end = match.span()
                        code = unichr(int(filename[start+2:end], 16))
                        filename = filename[:start] + code + filename[end:]
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
                common.textInput("title"+self.id, self.idevice.title),
                u'<p style="text-align: left;">',
                u'  <a href="javascript:addGalleryImage(\'%s\')">' % self.id,
                u'  <img alt="add images" style="vertical-align: text-bottom;" '
                u' src="/images/stock-insert-image.png" ' +
                u' /> %s' % _(u"Add images"),
                u'   </a>',
                common.hiddenField('newImagePath'+self.id),
                u'</p>']

        if len(self.idevice.images) == 0:
            html += [u'<div style="align:center center">',
                     _(u'No Images Loaded'),
                     u'</div>']
        else:
            def genCell(image):
                """Generates a single cell of our table"""
                def submitLink(method):
                    """Makes submitLink javascript code"""
                    method = 'gallery.%s.%s' % (method, image.id)
                    params = "'%s', %s, true" % (method, self.id)
                    return "javascript:submitLink(%s)" % params
                changeGalleryImage = [
                        u'           onclick="changeGalleryImage(' +
                        u"'%s', '%s')" % (self.id, image.id) +
                        u'"']
                result = [u'          <img'] + \
                          changeGalleryImage + \
                         [u'           alt="%s"' % image.caption,
                          u'           style="align:center top;"',
                          u'           src="%s"/>' % image.thumbnailSrc,
                          u'        <span>',
                          u'        <input id="caption%s" ' % image.id,
                          u'               name="caption%s" ' % image.id,
                          u'               value="%s" ' % image.caption,
                          u'               style="align:center;width:98%;"/>',
                          # Edit button
                          u'          <img '] + \
                          changeGalleryImage + \
                         [u'               src="/images/stock-edit.png"/>']
                # Move left button
                if image.index > 0:
                    result += [
                          u'        <img onclick="%s"' % submitLink('moveLeft'),
                          u'             src="/images/stock-go-back.png"/>'
                          ]
                else:
                    result += [
                          u'        <img src="/images/stock-go-back-off.png"/>']
                # Move right button
                if image.index < len(image.parent.images)-1:
                    result += [
                          u'       <img onclick="%s"' % submitLink('moveRight'),
                          u'            src="/images/stock-go-forward.png"/>']
                else:
                    result += [
                          u'        ' + 
                          u'<img src="/images/stock-go-forward-off.png"/>']
                result += [
                          # Delete button
                          u'        <img onclick="%s"' % submitLink('delete'),
                          u'             src="/images/stock-delete.png"/>',
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
        if len(self.idevice.images) == 0:
            html = [u'   <div style="align:center center">',
                    _(u'No Images Loaded'),
                    u'</div>']
        else:
            def genCell(image):
                """
                Generates a single table cell
                """
                width, height = image.size
                return [u'        <img onclick="javascript:window.open(',
                        u"'%s', 'galleryImage', " % image.src +
                        u"'menubar=no,alwaysRaised=yes,dependent=yes," +
                        u"width=%s," % (width+20) +
                        u"height=%s,scrollbars=yes," % (height+30) +
                        u"screenX='+((screen.width/2)-(%s/2))+" % (width) +
                        u"',screenY='+((screen.height/2)-(%s/2))" % (height) +
                        u');"',
                        u'           style="cursor: pointer; align:center top;"',
                        u'           alt="%s"' % image.caption,
                        u'           src="%s"/>' % image.thumbnailSrc,
                        u'        <div style="align:center;width=100%">',
                        u'          %s' % (image.caption or '&nbsp;'),
                        u'        </div>']
            html = self._generateTable(genCell)
        return u'\n    '.join(html)
        
    def renderView(self, style):
        """
        Renders the html for export
        """
        # Temporarily change the resources Url for exporting the images nicely
        if len(self.idevice.images) > 0:
            cls = self.idevice.images[0].__class__
            oldUrl, cls.resourcesUrl = cls.resourcesUrl, ''
        try:
            html  = [u'<div class="iDevice emphasis%s" ' %
                     unicode(self.idevice.emphasis),
                     u'>',
                     u'<img alt="" class="iDevice_icon" ',
                     u'src="icon_'+self.idevice.icon+'.gif" />'
                     u'<span class="iDeviceTitle">',      
                     self.idevice.title,
                     '</span><br/>']
            html += [self.renderViewContent()]
            html += [u'</div>']
            return u'\n    '.join(html)
        finally:
            # Put the resource url back
            if len(self.idevice.images) > 0:
                cls.resourcesUrl = oldUrl
                
from exe.engine.galleryidevice  import GalleryIdevice
from exe.webui.blockfactory     import g_blockFactory
g_blockFactory.registerBlockType(GalleryBlock, GalleryIdevice)    

# ===========================================================================
