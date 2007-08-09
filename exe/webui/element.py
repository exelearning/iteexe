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
Classes to XHTML elements.  Used by GenericBlock
"""
import os 
import logging
import re
import urllib
from exe.webui       import common
from exe.engine.path import Path
from exe             import globals as G

log = logging.getLogger(__name__)

def replaceLinks(matchobj, package_name):
    """ replace external links with calls to user's preferred browser """
    anchor = matchobj.group(0)
    do = re.search(r'(?i)href\s*=\s*"?([^>"]+)"?', anchor)
    # only modify links to external targets
    if do \
    and do.group(1).find('http://') >=0 \
    and not do.group(1).find('http://127.0.0.1') >= 0:
        return re.sub(r'(?i)href\s*=\s*"?([^>"]+)"?',
                r'''href="\1" onclick="window.parent.browseURL('\1'); return false"''',
                anchor)
    elif do \
    and do.group(1).startswith('resources/'):
        clean_url = urllib.quote(package_name.encode('utf-8'))
        return re.sub(r'(?i)href\s*=\s*"?([^>"]+)"?',
                r'''href="\1" onclick="window.parent.browseURL('http://127.0.0.1:%d/%s/\1'); return false"''' % (G.application.config.port, clean_url),
                anchor)
    else:
        return anchor

# ===========================================================================
class Element(object):
    """
    Base class for a XHTML element.  Used by GenericBlock
    """
    def __init__(self, field):
        """
        Initialize
        """
        self.field = field
        self.id    = field.id


    def process(self, request):
        """
        Process arguments from the web server.
        """
        msg = x_(u"ERROR Element.process called directly with %s class")
        log.error(msg % self.__class__.__name__)
        return _(msg) % self.__class__.__name__


    def renderEdit(self):
        """
        Returns an XHTML string for editing this element
        """
        msg = _(u"ERROR Element.renderEdit called directly with %s class")
        log.error(msg % self.__class__.__name__)
        return _(msg) % self.__class__.__name__


    def renderPreview(self):
        """
        Returns an XHTML string for previewing this element
        (Defaults to calling renderView.)
        """
        return self.renderView()


    def renderView(self):
        """
        Returns an XHTML string for viewing this element
        """
        msg = x_(u"ERROR Element.renderView called directly with %s class")
        log.error(msg % self.__class__.__name__)
        return _(msg) % self.__class__.__name__


# ===========================================================================
class ElementWithResources(Element):
    """
    Another Base class for a XHTML element.  
    Used by TextAreaElement, FeedbackElement, and ClozeElement,
    to handle all processing of the multiple images (and any other resources)
    which can now be included by the tinyMCE RichTextArea.
    NOTE: while this was originally where all the of embedding took place,
    it has since been moved into FieldWithResources, and this is now a rather 
    empty class, but still remains in case more processing to occur here later.
    """

    def __init__(self, field):
        """
        Initialize
        """
        Element.__init__(self, field)

        # hold onto the field's idevice for easy future reference:
        self.field_idevice = field.idevice

# ===========================================================================
class TextElement(Element):
    """
    TextElement is a single line of text
    """
    def __init__(self, field):
        """
        Initialize
        """
        Element.__init__(self, field)


    def process(self, request):
        """
        Process arguments from the web server.
        """
        if self.id in request.args:
            self.field.content = request.args[self.id][0]


    def renderEdit(self):
        """
        Returns an XHTML string with the form element for editing this field
        """
        html = common.formField('textInput', self.field.name, '',
                                self.id, '', self.field.content)
       
        return html


    def renderView(self):
        """
        Returns an XHTML string for viewing or previewing this element
        """
        return self.field.content

# ===========================================================================

class TextAreaElement(ElementWithResources):
    """
    TextAreaElement is responsible for a block of text
    """
    def __init__(self, field):
        """
        Initialize
        """
        ElementWithResources.__init__(self, field)

        self.width  = "100%"
        if (hasattr(field.idevice, 'class_') and
            field.idevice.class_ in \
                    ("activity", "objectives", "preknowledge")):
            self.height = 250
        else:
            self.height = 100


    def process(self, request):
        """
        Process arguments from the web server.
        """
        if self.id in request.args:
            # process any new images and other resources courtesy of tinyMCE:

            self.field.content_w_resourcePaths \
                = self.field.ProcessPreviewed(request.args[self.id][0])
            # likewise determining the paths for exports, etc.:
            self.field.content_wo_resourcePaths \
                    = self.field.MassageContentForRenderView( \
                                         self.field.content_w_resourcePaths)
            # and begin by choosing the content for preview mode, WITH paths:
            self.field.content = self.field.content_w_resourcePaths


    def renderEdit(self):
        """
        Returns an XHTML string with the form element for editing this field
        """
        # to render, choose the content with the preview-able resource paths:
        self.field.content = self.field.content_w_resourcePaths

        log.debug("renderEdit content="+self.field.content+
                  ", height="+unicode(self.height))
        html = common.formField('richTextArea',self.field.name,'',
                                self.id, self.field.instruc,
                                self.field.content,
                                str(self.width), str(self.height))
        return html

    def renderPreview(self, visible=True, class_="block"):
        """
        Returns an XHTML string for previewing this element
        """
        # to render, choose the content with the preview-able resource paths:
        self.field.content = self.field.content_w_resourcePaths

        content = re.sub(r'(?i)<\s*a[^>]+>',
                lambda mo: replaceLinks(mo, self.field.idevice.parentNode.package.name),
                self.field.content)
        return self.renderView(content=content, visible=visible, \
                               class_=class_, preview=True)

    def renderView(self, visible=True, class_="block", content=None, 
                    preview=False):
        """
        Returns an XHTML string for viewing or previewing this element
        """
        if visible:
            visible = 'style="display:block"'
        else:
            visible = 'style="display:none"'
        if content is None:
            if preview:
                # render the resource content with resource paths: 
                self.field.content = self.field.content_w_resourcePaths
            else:
                # render with the flattened content, withOUT resource paths: 
                self.field.content = self.field.content_wo_resourcePaths
            content = self.field.content
        return '<div id="ta%s" class="%s" %s>%s</div>' % (
            self.id, class_, visible, content)
   


# ===========================================================================
class FeedbackElement(ElementWithResources):
    """
    FeedbackElement is a text which can be show and hide
    """
    def __init__(self, field):
        """
        Initialize
        """
        ElementWithResources.__init__(self, field)

    def process(self, request):
        """
        Process arguments from the web server.
        """
        if self.id in request.args:
            # process any new images and other resources courtesy of tinyMCE:

            self.field.content_w_resourcePaths = \
                self.field.ProcessPreviewed(request.args[self.id][0])
            # likewise determining the paths for exports, etc.:
            self.field.content_wo_resourcePaths = \
                    self.field.MassageContentForRenderView( \
                         self.field.content_w_resourcePaths)
            # and begin by choosing the content for preview mode, WITH paths:
            self.field.feedback = self.field.content_w_resourcePaths

    def renderEdit(self):
        """
        Returns an XHTML string with the form element for editing this field
        """
        # to render, choose the content with the preview-able resource paths:
        self.field.feedback = self.field.content_w_resourcePaths

        html = common.formField('richTextArea',self.field.name,'',
                                self.id, self.field.instruc,
                                self.field.feedback)
        return html

    def renderView(self):
        """
        Returns an XHTML string for viewing this question element
        """
        return self.doRender(preview=False)
    
    def renderPreview(self):
        """
        Returns an XHTML string for previewing this question element
        """
        return self.doRender(preview=True)

    def doRender(self, preview=False):
        """
        Returns an XHTML string for viewing or previewing this element
        """
        if preview: 
            # to render, use the content with the preview-able resource paths:
            self.field.feedback = self.field.content_w_resourcePaths
        else:
            # to render, use the flattened content, withOUT resource paths: 
            self.field.feedback = self.field.content_wo_resourcePaths

        html = ""
        if self.field.feedback != "": 
            html += '<div class="block">\n '
            html += common.feedbackButton('btn' + self.id,
                self.field.buttonCaption,
                onclick="toggleFeedback('%s')" % self.id)
            html += '</div>\n '
            html += '<div id="fb%s" class="feedback" style="display: none;"> '\
                    % self.id
            html += self.field.feedback
            html += "</div>\n"
        return html


# ===========================================================================

class PlainTextAreaElement(Element):
    """
    PlainTextAreaElement is responsible for a block of text
    """
    def __init__(self, field):
        """
        Initialize
        """
        Element.__init__(self, field)
        self.cols = "80"
        self.rows = "10"


    def process(self, request):
        """
        Process arguments from the web server.
        """
        if self.id in request.args:
            self.field.content = request.args[self.id][0]
            

    def renderEdit(self):
        """
        Returns an XHTML string with the form element for editing this field
        """
        log.debug("renderEdit content="+self.field.content+
                  ", height="+unicode(self.height))
        html = common.formField('textArea',self.field.name,'',
                                self.id, self.field.instruc,
                                self.field.content, '',
                                self.cols, self.rows)
        return html


    def renderPreview(self):
        content = re.sub(r'(?i)<\s*a[^>]+>',
                lambda mo: replaceLinks(mo, self.field.idevice.parentNode.package.name),
                self.field.content)
        return self.renderView(content=content)

    def renderView(self, visible=True, class_="block", content=None):
        """
        Returns an XHTML string for viewing or previewing this element
        """
        if content is None:
            content = self.field.content
        return content + '<br/>'
    
# ===========================================================================
class ImageElement(Element):
    """
    for image element processing
    """
    def __init__(self, field):
        """
        Initialize
        """
        Element.__init__(self, field)


    def process(self, request):
        """
        Process arguments from the web server.
        """
        if "path"+self.id in request.args:
            self.field.setImage(request.args["path"+self.id][0])

        if "width"+self.id in request.args:
            self.field.width = request.args["width"+self.id][0]

        if "height"+self.id in request.args:
            self.field.height = request.args["height"+self.id][0]
            
        if "action" in request.args and request.args["action"][0]=="addImage" and \
           request.args["object"][0]==self.id:
            self.field.idevice.edit = True


    def renderEdit(self):
        """
        Returns an XHTML string with the form element for editing this field
        """
        log.debug("renderEdit")

        if not self.field.imageResource:
            self.field.setDefaultImage()
            
        function = ""
        if hasattr(self.field, 'isFeedback') and self.field.isFeedback:
            function = "addFeedbackImage"
        else:
            function = "addImage"

        html  = u'<div class="block">'
        html += u'<b>'+self.field.name+':</b>\n'
        html += common.elementInstruc(self.field.instruc)
        html += u"</div>\n"
        html += u'<div class="block">'
        html += u'<img alt="%s" ' % _('Add Image')
        html += u'id="img%s" ' % self.id
        html += u"onclick=\"%s('%s');\" " % (function, self.id)
        if self.field.imageResource:
            html += u'src="./resources/'+self.field.imageResource.storageName+'" '
        else:
            html += u'src=""'
        if self.field.width:
            html += u"width=\""+self.field.width+"\" "
        if self.field.height:
            html += u"height=\""+self.field.height+"\" "
        html += u"/>\n"
        html += u"</div>"

        html += u'<script type="text/javascript">\n'
        html += u"document.getElementById('img"+self.id+"')."
        html += "addEventListener('load', imageChanged, true);\n"
        html += u'</script>\n'

        html += u'<div class="block">'
        html += common.textInput("path"+self.id, "", 50)
        
        html += u'<input type="button" onclick="%s(\'%s\')"' % (function, self.id)
        html += u' value="%s" />' % _(u"Select an image")
        if self.field.imageResource  and not self.field.isDefaultImage:
            html += '<p style="color: red;">'+ self.field.imageResource.storageName + '</P>'
        html += u'<div class="block"><b>%s</b></div>\n' % _(u"Display as:")
        html += u"<input type=\"text\" "
        html += u"id=\"width"+self.id+"\" "
        html += u"name=\"width"+self.id+"\" "
        html += u"value=\"%s\" " % self.field.width
        html += u"onchange=\"changeImageWidth('"+self.id+"');\" "
        html += u"size=\"4\"/>px "
        html += u"<b>by</b> \n"
        html += u"<input type=\"text\" "
        html += u"id=\"height"+self.id+"\" "
        html += u"name=\"height"+self.id+"\" "
        html += u"value=\"%s\" " % self.field.height
        html += u"onchange=\"changeImageHeight('"+self.id+"');\" "
        html += u"size=\"4\"/>px \n"
        html += u"(%s) \n" % _(u"blank for original size")
        html += u"</div>"

        return html


    def renderPreview(self):
        """
        Returns an XHTML string for previewing this image
        """
        if not self.field.imageResource:
            self.field.setDefaultImage()

        html = common.image("img"+self.id,
                            "resources/%s" % (self.field.imageResource.storageName),
                            self.field.width,
                            self.field.height)
        return html


    def renderView(self):
        """
        Returns an XHTML string for viewing this image
        """
        if not self.field.imageResource:
            self.field.setDefaultImage()

        html = common.image("img"+self.id, 
                             self.field.imageResource.storageName, 
                             self.field.width,
                             self.field.height)

        return html

    
# ===========================================================================
class MultimediaElement(Element):
    """
    for media element processing
    """
    def __init__(self, field):
        """
        Initialize
        """
        Element.__init__(self, field)


    def process(self, request):
        """
        Process arguments from the web server.
        """
        if "path"+self.id in request.args:
            self.field.setMedia(request.args["path"+self.id][0])
            
        if "caption" + self.id in request.args:
            self.field.caption = request.args["caption"+self.id][0]
        

    def renderEdit(self):
        """
        Returns an XHTML string with the form element for editing this field
        """
        log.debug("renderEdit")

        html  = ""
        html += u'<b>'+self.field.name+':</b>\n'
        html += common.elementInstruc(self.field.instruc)+'<br/>'

        html += common.textInput("path"+self.id, "", 50)
        html += u'<input type="button" onclick="addMp3(\'%s\')"' % self.id
        html += u' value="%s" />' % _(u"Select an MP3")
        
        
        if self.field.mediaResource:
            html += '<p style="color: red;">'+ self.field.mediaResource.storageName + '</P>'
            
        html += '<br/><b>%s</b><br/>' % _(u"Caption:")
        html += common.textInput("caption" + self.id, self.field.caption)
        html += common.elementInstruc(self.field.captionInstruc)+ '<br/>'


        return html

    def renderPreview(self):
        """
        Returns an XHTML string for previewing this image
        """
        html = ""
        if self.field.mediaResource:
            html = self.renderMP3(
                            '../%s/resources/%s' % (
                                self.field.idevice.parentNode.package.name,
                                self.field.mediaResource.storageName),
                            "../templates/xspf_player.swf")
        return html


    def renderView(self):
        """
        Returns an XHTML string for viewing this image
        """
        html = ""
        if self.field.mediaResource:
            html += self.renderMP3(self.field.mediaResource.storageName,                            
                                       "xspf_player.swf")

        return html
    
    def renderMP3(self, filename, mp3player):
        path = Path(filename)
        fileExtension =path.ext.lower()
        mp3Str_mat = common.flash(filename, self.field.width, self.field.height,
                              id="mp3player",
                              params = {
                                      'movie': '%s?song_url=%s&song_title=%s' % (mp3player, filename, self.field.caption),
                                      'quality': 'high',
                                      'bgcolor': '#E6E6E6'})

        mp3Str = """
        <object class="mediaplugin mp3" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
        codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab
        #version=6,0,0,0"
        id="mp3player" height="15" width="400"> 
        <param name="movie" value="%(mp3player)s?song_url=%(url)s&song_title=%(caption)s" /> 
        <param name="quality" value="high" /> 
        <param name="bgcolor" value="#ffffff" /> 
        <embed src="%(mp3player)s?song_url=%(url)s&song_title=%(caption)s" quality="high"
        bgcolor="#FFFFFF" name="mp3player" type="application/x-shockwave-flash"
        pluginspage="http://www.macromedia.com/go/getflashplayer" height="15" width="400" />
            </object>
        
        """ % {'mp3player': mp3player,
               'url':       filename,
               'caption':   self.field.caption}
        
        wmvStr = common.flash(filename, self.field.width, self.field.height,
                              id="mp3player",
                              params = {
                                      'Filename': filename,
                                      'ShowControls': 'true',
                                      'AutoRewind': 'true',
                                      'AutoStart': 'false',
                                      'AutoSize': 'true',
                                      'EnableContextMenu': 'true',
                                      'TransparentAtStart': 'false',
                                      'AnimationAtStart': 'false',
                                      'ShowGotoBar': 'false',
                                      'EnableFullScreenControls': 'true'})

        wmvStr = """
        <p class="mediaplugin">
        <object classid="CLSID:22D6f312-B0F6-11D0-94AB-0080C74C7E95"
 codebase="http://activex.microsoft.com/activex/controls/mplayer/en/nsmp2inf.cab#Version=5,1,52,701" 
        standby="Loading Microsoft Windows Media Player components..." 
        id="msplayer" align="" type="application/x-oleobject">
        <param name="Filename" value="%s">
        <param name="ShowControls" value=true />
        <param name="AutoRewind" value=true />
        <param name="AutoStart" value=false />
        <param name="Autosize" value=true />
        <param name="EnableContextMenu" value=true />
        <param name="TransparentAtStart" value=false />
        <param name="AnimationAtStart" value=false />
        <param name="ShowGotoBar" value=false />
        <param name="EnableFullScreenControls" value=true />
        <embed src="%s" name="msplayer" type="video/x-ms-wmv" 
         ShowControls="1" AutoRewind="1" AutoStart="0" Autosize="0" 
         EnableContextMenu="1" TransparentAtStart="0" AnimationAtStart="0" 
         ShowGotoBar="0" EnableFullScreenControls="1" 
pluginspage="http://www.microsoft.com/Windows/Downloads/Contents/Products/MediaPlayer/">
        </embed>
        </object></p>
        """ %(filename, filename)
        
        aviStr = """
        <p class="mediaplugin"><object width="240" height="180">
        <param name="src" value="%s">
        <param name="controller" value="true">
        <param name="autoplay" value="false">
        <embed src="%s" width="240" height="180" 
        controller="true" autoplay="false"> </embed>
        </object></p>
        """ % (filename, filename)
        
        mpgStr = """
        <p class="mediaplugin"><object width="240" height="180">
        <param name="src" value="%s">
        <param name="controller" value="true">
        <param name="autoplay" value="false">
        <embed src="%s" width="240" height="180"
        controller="true" autoplay="false"> </embed>
        </object></p>
        """ % (filename, filename)
        
        wavStr = r"""
        <input type="button" value="Hear it" 
        OnClick="document.getElementById('dummy_%s').innerHTML='<embed src=%s hidden=true loop=false>'"
        <div id="dummy_%s"></div>
        """ % (self.id, filename, self.id)
        
        movStr = """
        <p class="mediaplugin"><object classid="CLSID:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B"
                codebase="http://www.apple.com/qtactivex/qtplugin.cab" 
                height="300" width="400"
                id="quicktime" align="" type="application/x-oleobject">
        <param name="src" value="%s" />
        <param name="autoplay" value=false />
        <param name="loop" value=true />
        <param name="controller" value=true />
        <param name="scale" value="aspect" />
        <embed src="%s" name="quicktime" type="video/quicktime" 
         height="300" width="400" scale="aspect" 
         autoplay="false" controller="true" loop="true" 
         pluginspage="http://quicktime.apple.com/">
        </embed>
        </object></p>
        """ %(filename, filename)
        
        mpgStr = """
        <p class="mediaplugin"><object width="240" height="180">
        <param name="src" value="%s">
        <param name="controller" value="true">
        <param name="autoplay" value="false">
        <embed src="%s" width="240" height="180"
        controller="true" autoplay="false"> </embed>
        </object></p>
        """
        
        if fileExtension == ".mp3":
            return mp3Str
        elif fileExtension == ".wav":
            return wavStr
        elif fileExtension == ".wmv" or fileExtension == ".wma":
            return wmvStr
        elif fileExtension == ".mov":
            return movStr
        #elif fileExtension == ".mpg":
            #return mpgStr
        elif fileExtension == ".avi":
            return aviStr
        else:
            return ""
  

#============================================================================
class AttachmentElement(Element):
    """
    for attachment element processing
    """
    def __init__(self, field):
        """
        Initialize
        """
        Element.__init__(self, field)


    def process(self, request):
        """
        Process arguments from the web server.
        """
        if "path"+self.id in request.args:
            self.field.setAttachment(request.args["path"+self.id][0])
        
        
    def renderEdit(self):
        """
        Returns an XHTML string with the form element for editing this field
        """
        log.debug("renderEdit")

        html  = ""
        
        label = _(u'Filename:')
        if self.field.attachResource:
            label += u': '
            label += u'<span style="text-decoration:underline">'
            label += self.field.attachResource.storageName
            label += u'</span>\n'
        html += '<b>%s</b>' % label
        html += common.elementInstruc(self.field.instruc)+'<br/>'
        html += common.textInput("path"+self.id, "", 50)
        html += u'<input type="button" onclick="addFile(\'%s\')"' % self.id
        html += u' value="%s" /><br/>\n' % _(u"Select a file")
        
        return html
    
    def renderPreview(self):
        """
        Returns an XHTML string for previewing this image
        """
        html = ""    
        if self.field.attachResource:
            html += u"<img src='/images/stock-attach.png'> <a style=\"cursor: pointer;\" "
            html += u" onclick=\"window.parent.browseURL('"
            html += u"http://127.0.0.1:%d/" % (G.application.config.port)
            html += self.field.idevice.parentNode.package.name 
            html += u"/resources/"
            html += self.field.attachResource.storageName
            html += u"');\" >"
            html += self.field.attachResource.storageName
            html += u"</a>\n"
        return html

    def renderView(self):
        """
        Returns an XHTML string for previewing this image
        """
        html = ""
        if self.field.attachResource:
            html += u"<img src='stock-attach.png'> "
            html += u"<a style=\"cursor: pointer;\" "
            html += u" onclick=\"window.open('"
            html += self.field.attachResource.storageName
            html += u"', '_blank');\" >"
            html += self.field.attachResource.storageName
            html += u"</a><br/>\n"
        return html
    
#================================================================================

class MagnifierElement(Element):
    """
    for magnifier element processing
    """
    def __init__(self, field):
        """
        Initialize
        """
        Element.__init__(self, field)


    def process(self, request):
        """
        Process arguments from the web server.
        """
        self.field.message = ""
        if "path"+self.id in request.args:
            path = request.args["path"+self.id][0]
            if path.lower().endswith(".jpg") or path.lower().endswith(".jpeg"):
                self.field.setImage(request.args["path"+self.id][0])
            elif path <> "":
                self.field.message = _(u"Please select a .jpg file.")
                self.field.idevice.edit = True

        if "width"+self.id in request.args:
            self.field.width = request.args["width"+self.id][0]

        if "height"+self.id in request.args:
            self.field.height = request.args["height"+self.id][0]
            
        if "action" in request.args and request.args["action"][0]=="addJpgImage" and \
           request.args["object"][0]==self.id:
            self.field.idevice.edit = True
            
            

    def renderEdit(self):
        """
        Returns an XHTML string with the form element for editing this field
        """
        log.debug("renderEdit")
        
        if not self.field.imageResource:
            self.field.setDefaultImage()

        html  = u'<div class="block">\n'
        html += u"<b>"+self.field.name+":</b>\n"
        html += common.elementInstruc(self.field.instruc)
        html += u"</div>\n"
        html += u'<div class="block">\n'
        html += u'<img alt="%s" ' % _('Add JPEG Image')
        html += u'id="img%s" ' % self.id
        html += u"onclick=\"addJpgImage('"+self.id+"');\" "
        html += u'src="resources/%s" '%(self.field.imageResource.storageName)
        html += u"/>\n"
        html += u"</div>\n"

        html += u'<script type="text/javascript">\n'
        html += u"document.getElementById('img"+self.id+"')."
        html += "addEventListener('load', magnifierImageChanged, true);\n"
        html += u'</script>\n'

        html += u'<div class="block">\n'
        html += common.textInput("path"+self.id, "", 50)
        html += u'<input type="button" class="block" '
        html += u' onclick="addJpgImage(\'%s\')"' % self.id
        html += u' value="%s" />' % _(u"Select an image (JPG file)")
        if self.field.imageResource and not self.field.isDefaultImage:
            html += '<p style="color: red;">'+ self.field.imageResource.storageName + '</P>'
        if self.field.message <> "":
            html += '<span style="color:red">' + self.field.message + '</span>'
        
        html += u'<div class="block"><b>%s</b>' % _(u"Display as:")
        html += common.elementInstruc(self.field.idevice.dimensionInstruc)
        html += u'</div>\n'
        html += u'<input type="text" '
        html += u'id="width%s" ' % self.id
        html += u'name="width%s" ' % self.id
        html += u'value="%s" ' % self.field.width
        html += u'onchange="changeMagnifierImageWidth(\'%s\');" ' % self.id
        html += u'size="4" />&nbsp;pixels&nbsp;<strong>by</strong>&nbsp;'
        html += u'<input type="text" '
        html += u'id="height%s" ' % self.id
        html += u'name="height%s" ' % self.id
        html += u'value="%s" ' % self.field.height
        html += u'onchange="changeMagnifierImageHeight(\'%s\');" ' % self.id
        html += u'size="4" />&nbsp;pixels.\n'
        html += u'\n'
        html += u'(%s) \n' % _(u'blank for original size')
        html += u'</div>\n'

        return html


    def renderPreview(self):
        """
        Returns an XHTML string for previewing this image
        """
        if not self.field.imageResource:
            self.field.setDefaultImage()

        html = self.renderMagnifier(
                        '../%s/resources/%s' % (
                            self.field.idevice.parentNode.package.name,
                            self.field.imageResource.storageName),
                        "../templates/magnifier.swf")
        return html


    def renderView(self):
        """
        Returns an XHTML string for viewing this image
        """
        if not self.field.imageResource:
            self.field.setDefaultImage()

        html = self.renderMagnifier(self.field.imageResource.storageName,                            
                                   "magnifier.swf")


        return html
    
    def renderMagnifier(self, imageFile, magnifierFile):
        """
        Renders the magnifier flash thingie

        """
        field = self.field
        flashVars = {
            'file': imageFile,
            'width': field.width,
            'height': field.height,
            'borderWidth': '12',
            'glassSize': field.glassSize,
            'initialZoomSize': field.initialZSize,
            'maxZoomSize': field.maxZSize,
            'targetColor': '#FF0000'}
        # Format the flash vars
        flashVars = '&'.join(
            ['%s=%s' % (name, value) for
             name, value in flashVars.items()])
        return common.flash(magnifierFile, field.width, field.height,
            id='magnifier%s' % self.id,
            params = {
                'movie': magnifierFile,
                'quality': 'high',
                'scale': 'noscale',
                'salign': 'lt',
                'bgcolor': '#888888',
                'FlashVars': flashVars})
        

#============================================================================
class ClozeElement(ElementWithResources):
    """
    Allows the user to enter a passage of text and declare that some words
    should be added later by the student
    """

    # Properties

    @property
    def editorId(self):
        """
        Returns the id string for our midas editor
        """
        return 'editorArea%s' % self.id

    @property
    def editorJs(self):
        """
        Returns the js that gets the editor document
        """
        return "document.getElementById('%s').contentWindow.document" % \
            self.editorId

    @property
    def hiddenFieldJs(self):
        """
        Returns the js that gets the hiddenField document
        """
        return "document.getElementById('cloze%s')" % self.id

    # Public Methods

    def process(self, request):
        """
        Sets the encodedContent of our field
        """
        if self.editorId in request.args:
            # process any new images and other resources courtesy of tinyMCE:

            self.field.content_w_resourcePaths = \
                self.field.ProcessPreviewed(request.args[self.editorId][0])
            # likewise determining the paths for exports, etc.:
            self.field.content_wo_resourcePaths = \
                  self.field.MassageContentForRenderView(\
                         self.field.content_w_resourcePaths)
            # and begin by choosing the content for preview mode, WITH paths:
            self.field.encodedContent = self.field.content_w_resourcePaths

            self.field.strictMarking = \
                'strictMarking%s' % self.id in request.args
            self.field.checkCaps = \
                'checkCaps%s' % self.id in request.args
            self.field.instantMarking = \
                'instantMarking%s' % self.id in request.args

    def renderEdit(self):
        """
        Enables the user to set up their passage of text
        """
        # to render, choose the content with the preview-able resource paths:
        self.field.encodedContent = self.field.content_w_resourcePaths

        html = [
            # Render the iframe box
            common.formField('richTextArea', _('Cloze Text'),'',
                             self.editorId, self.field.instruc,
                             self.field.encodedContent),
            # Render our toolbar
            u'<table style="width: 100%;">',
            u'<tbody>',
            u'<tr>',
            u'<td>',
            u'  <input type="button" value="%s" ' % _("Hide/Show Word")+
            ur"""onclick="tinyMCE.execInstanceCommand('mce_editor_1','Underline', false);"/>"""
            u'</td><td>',
            common.checkbox('strictMarking%s' % self.id,
                            self.field.strictMarking,
                            title=_(u'Strict Marking?'),
                            instruction=self.field.strictMarkingInstruc),
            u'</td><td>',
            common.checkbox('checkCaps%s' % self.id,
                            self.field.checkCaps,
                            title=_(u'Check Caps?'),
                            instruction=self.field.checkCapsInstruc),
            u'</td><td>',
            common.checkbox('instantMarking%s' % self.id,
                            self.field.instantMarking,
                            title=_(u'Instant Marking?'),
                            instruction=self.field.instantMarkingInstruc),
            u'</td>',
            u'</tr>',
            u'</tbody>',
            u'</table>',
            ]
        return '\n    '.join(html)

    def renderPreview(self, feedbackId=None, preview=True):
        """
        Just a front-end wrapper around renderView..
        """
        # set up the content for preview mode:
        preview = True
        return self.renderView(feedbackId, preview)

    def renderView(self, feedbackId=None, preview=False):
        """
        Shows the text with inputs for the missing parts
        """

        if preview: 
            # to render, use the content with the preview-able resource paths:
            self.field.encodedContent = self.field.content_w_resourcePaths
        else:
            # to render, use the flattened content, withOUT resource paths: 
            self.field.encodedContent = self.field.content_wo_resourcePaths

        html = ['<div id="cloze%s">' % self.id]
        # Store our args in some hidden fields
        def storeValue(name):
            value = str(bool(getattr(self.field, name))).lower()
            return common.hiddenField('clozeFlag%s.%s' % (self.id, name), value)
        html.append(storeValue('strictMarking'))
        html.append(storeValue('checkCaps'))
        html.append(storeValue('instantMarking'))
        if feedbackId:
            html.append(common.hiddenField('clozeVar%s.feedbackId' % self.id,
                                           'ta'+feedbackId))
        # Mix the parts together
        words = ""
        def encrypt(word):
            """
            Simple XOR encryptions
            """
            result = ''
            key = 'X'
            for letter in word:
                result += unichr(ord(key) ^ ord(letter))
                key = letter
            # Encode for javascript
            output = ''
            for char in result:
                output += '%%u%04x' % ord(char[0])
            return output.encode('base64')
        for i, (text, missingWord) in enumerate(self.field.parts):
            if text:
                html.append(text)
            if missingWord:
                words += "'" + missingWord + "',"
                # The edit box for the user to type into
                inputHtml = [
                    ' <input type="text" value="" ',
                    '        id="clozeBlank%s.%s"' % (self.id, i),
                    '    autocomplete="off"',
                    '    style="width:%sem"/>\n' % len(missingWord)]
                if self.field.instantMarking:
                    inputHtml.insert(2, '  onKeyUp="onClozeChange(this)"')
                html += inputHtml
                # Hidden span with correct answer
                html += [
                    '<span style="display: none;" ',
                    'id="clozeAnswer%s.%s">%s</span>' % (
                        self.id, i, encrypt(missingWord))]

        # Score string
        html += ['<div class="block">\n']
        if self.field.instantMarking:
            html += ['<input type="button" ',
                     'value="%s"' % _(u"Get score"),
                     'id="getScore%s"' % self.id,
                     'onclick="showClozeScore(\'%s\')"/>\n' % (self.id)]

            if feedbackId is not None:
                html += [common.feedbackButton('feedback'+self.id, 
                             _(u"Show/Hide Feedback"),
                             style="margin: 0;",
                             onclick="toggleClozeFeedback('%s')" % self.id)]
            # Set the show/hide answers button attributes
            style = 'display: inline;'
            value = _(u"Show/Clear Answers")
            onclick = "toggleClozeAnswers('%s')" % self.id
        else:
            html += [common.button('submit%s' % self.id,
                        _(u"Submit"),
                        id='submit%s' % self.id,
                        onclick="clozeSubmit('%s')" % self.id),
                     common.button(
                        'restart%s' % self.id,
                        _(u"Restart"),
                        id='restart%s' % self.id,
            style="display: none;",
                        onclick="clozeRestart('%s')" % self.id),
                     ]
            # Set the show/hide answers button attributes
            style = 'display: none;'
            value = _(u"Show Answers")
            onclick = "fillClozeInputs('%s')" % self.id
        # Show/hide answers button
        html += ['&nbsp;&nbsp;',
                 common.button(
                    '%sshowAnswersButton' % self.id,
                    value,
                    id='showAnswersButton%s' % self.id,
                    style=style,
                    onclick=onclick),
        ]
        html += ['<p id="clozeScore%s"></p>' % self.id]
        html += ['</div>\n']
        return '\n'.join(html) + '</div>'
    
    def renderText(self):
        """
        Shows the text with gaps for text file export
        """
        html = ""
        for text, missingWord in self.field.parts:
            if text:
                html += text
            if missingWord:
                for x in missingWord:
                    html += "_"
                    
        return html
    
    def renderAnswers(self):        
        """
        Shows the answers for text file export
        """
        html = ""

        html += "<p>%s: </p><p>"  % _(u"Answsers")
        answers = ""
        for i, (text, missingWord) in enumerate(self.field.parts):
            if missingWord:
                answers += str(i+1) + '.' + missingWord + ' '
        if answers <> "":        
            html += answers +'</p>'
        else:
            html = ""
                
        return html

# ===========================================================================
class FlashElement(Element):
    """
    for flash element processing
    """
    def __init__(self, field):
        """
        Initialize
        """
        Element.__init__(self, field)


    def process(self, request):
        """
        Process arguments from the web server.
        """
        if "path"+self.id in request.args:
            self.field.setFlash(request.args["path"+self.id][0])

        if "width"+self.id in request.args:
            self.field.width = request.args["width"+self.id][0]

        if "height"+self.id in request.args:
            self.field.height = request.args["height"+self.id][0]


    def renderEdit(self):
        """
        Returns an XHTML string with the form element for editing this field
        """
        log.debug("renderEdit")

        html  = u'<div class="block">'
        html += u"<b>"+self.field.name+":</b>\n"
        html += common.elementInstruc(self.field.instruc)
        html += u"</div>\n"
        html += common.textInput("path"+self.id, "", 50)
        html += u'<input type="button" onclick="addFlash(\'%s\')"' % self.id
        html += u' value="%s" />' % _(u"Select Flash Object")
        html += common.elementInstruc(self.field.fileInstruc)
        if self.field.flashResource:
            html += '<p style="color: red;">'+ self.field.flashResource.storageName + '</P>'
        html += u'<div class="block"><b>%s</b></div>\n' % _(u"Display as:")
        html += u"<input type=\"text\" "
        html += u"id=\"width"+self.id+"\" "
        html += u"name=\"width"+self.id+"\" "
        html += u"value=\"%s\" " % self.field.width
        html += u"size=\"4\" />px\n"
        html += u"by \n"
        html += u"<input type=\"text\" "
        html += u"id=\"height"+self.id+"\" "
        html += u"name=\"height"+self.id+"\" "
        html += u"value=\"%s\" " % self.field.height
        html += u"size=\"4\" />px\n"


        return html


    def renderPreview(self):
        """
        Returns an XHTML string for previewing this image
        """
        if self.field.flashResource:
            flashFile = 'resources/' + self.field.flashResource.storageName
        else:
            flashFile = ""
        html = common.flash(flashFile, self.field.width, self.field.height)
        return html


    def renderView(self):
        """
        Returns an XHTML string for viewing this flash
        """
        if self.field.flashResource:
            flashFile = self.field.flashResource.storageName
        else:
            flashFile = ""
        html = common.flash(flashFile, self.field.width, self.field.height)
        return html

# ===========================================================================
class FlashMovieElement(Element):
    """
    for flash movie element processing
    """
    def __init__(self, field):
        """
        Initialize
        """
        Element.__init__(self, field)


    def process(self, request):
        """
        Process arguments from the web server.
        """
        self.field.message = ""
        if "path"+self.id in request.args:
            path = request.args["path"+self.id][0]
            if path.endswith(".flv"):
                self.field.setFlash(request.args["path"+self.id][0])
            elif path <> "":
                self.field.message = _(u"Please select a .flv file.")
                self.field.idevice.edit = True


    def renderEdit(self):
        """
        Returns an XHTML string with the form element for editing this field
        """
        log.debug("renderEdit")

        html  = u'<div class="block">'
        html += u"<b>"+self.field.name+":</b>"
        html += common.elementInstruc(self.field.fileInstruc)
        html += u"</div>"
        html += common.textInput("path"+self.id, "", 50)
        html += u'<input type="button" onclick="addFlashMovie(\'%s\')"' % self.id
        html += u' value="%s" />\n' % _(u"Select a flash video")
        if self.field.flashResource:
            html += '<p style="color: red;">'+ self.field.flashResource.storageName + '</P>'
        if self.field.message <> "":
            html += '<span style="color:red">' + self.field.message + '</span>'


        return html


    def renderPreview(self):
        """
        Returns an XHTML string for previewing this image
        """
        if self.field.flashResource:
            flashFile = 'resources/%s' % (
                self.field.flashResource.storageName)
        else:
            flashFile = ""
        return common.flashMovie(flashFile, self.field.width,
                                 self.field.height, '../templates/',
                                 autoplay='false')


    def renderView(self):
        """
        Returns an XHTML string for viewing this flash
        """
        if self.field.flashResource:
            flashFile = self.field.flashResource.storageName
        else:
            flashFile = ""

        html = common.flashMovie(flashFile,
                                 self.field.width,
                                 self.field.height,
                                 autoplay='true')
                                 

        return html

# ===========================================================================

class MathElement(Element):
    """
    MathElement is a single line of text
    """
    def __init__(self, field):
        """
        Initialize
        """
        Element.__init__(self, field)


    def process(self, request):
        """
        Process arguments from the web server.
        """
        if 'fontsize'+self.id in request.args:
            self.field.fontsize = int(request.args["fontsize"+self.id][0])        
        if 'preview'+self.id in request.args:
            self.field.idevice.edit = True
        if 'input'+self.id in request.args and \
            not(request.args[u"action"][0] == u"delete" and 
                request.args[u"object"][0]==self.field.idevice.id):
            self.field.latex = request.args['input'+self.id][0]         
        


    def renderEdit(self):
        """
        Returns an XHTML string with the form element for editing this field
        """
        webDir = G.application.config.webDir
        greekDir = Path(webDir+'/images/maths/greek letters')
        oprationDir = Path(webDir+'/images/maths/binary oprations')
        relationDir = Path(webDir+'/images/maths/relations')
        html = u'<div class="block">'
        html += u"<b>"+self.field.name+":</b>\n"
        html += common.elementInstruc(self.field.instruc)
        html += u"<br/></div>\n"
        # Latex input
        html += '<div class="maths">\n'

        for file in greekDir.files():
            if file.ext == ".gif" or file.ext == ".png":
                symbol = file.namebase
                html += common.insertSymbol("input"+self.id, 
                        u"/images/maths/greek letters/%s", 
                                            "%s", r"\\%s") % (symbol, symbol,
                                                                file.basename())
        html += u"<br/>"        
        for file in oprationDir.files():
            if file.ext == ".gif" or file.ext == ".png":
                symbol = file.namebase
                html += common.insertSymbol("input"+self.id, 
                        u"/images/maths/binary oprations/%s", 
                                            "%s", r"\\%s") % (symbol, symbol,
                                                                file.basename())
        html += u"<br/>"        
        for file in relationDir.files():
            if file.ext == ".gif" or file.ext == ".png":
                symbol = file.namebase
                html += common.insertSymbol("input"+self.id, 
                        u"/images/maths/relations/%s", 
                                            "%s", r"\\%s") % (symbol, symbol,
                                                                file.basename())
        html += "<br />" 
        html += common.insertSymbol("input"+self.id, "", "",
                            r"\\begin{verbatim}\\end{verbatim}", _("text"), 14)
        html += common.insertSymbol("input"+self.id, "", "", r"\\\\\n", _("newline"))
        # font size select
        html += '<br/>'
        html +=  _("Select a font size: ")
        html += "<select name=\"fontsize%s\">\n" % self.id
        template = '  <option value="%s"%s>%s</option>\n' 
        for i in range(1, 11):
            if i == self.field.fontsize:
                html += template % (str(i), ' selected="selected"', str(i))
            else:
                html += template % (str(i), '', str(i))
        html += "</select>\n"
        html += "</div>\n"
        html += common.textArea('input'+self.id, self.field.latex)
        
        # Preview
        html += '<div class="block">\n'
        html += common.submitButton('preview'+self.id, _('Preview'))
        html += common.elementInstruc(self.field.previewInstruc) + '<br/>'
        if self.field.gifResource:
            html += '<p>'
            html += '<img src="resources/%s" /></p>' % (self.field.gifResource.storageName) 
            html += "</div>\n"
        else:
            html += '<br/>'
        return html

    def renderPreview(self):
        """
        Returns an XHTML string for viewing or previewing this element
        """
        html = ""
        if self.field.gifResource:
            html += '<div class="block">\n'
            html += '<p align="center">'
            html += '<img src="resources/%s" /></p>' % (self.field.gifResource.storageName) 
            html += '</div>\n'
        return html

    def renderView(self):
        """
        Returns an XHTML string for viewing or previewing this element
        """
        html = ""
        if self.field.gifResource:
            html += '<div class="block">\n'
            html += '<p align="center">'
            html += '<img src="%s" /></p>' % (self.field.gifResource.storageName) 
            html += "</div>\n"
        return html

# ===========================================================================
class SelectOptionElement(Element):
    """
    SelectOptionElement is responsible for a block of option.  Used by
    SelectQuestionElement.
    Which is used as part of the Multi-Select iDevice.
    """
    def __init__(self, field):
        """
        Initialize
        """
        Element.__init__(self, field)
        self.index = 0

        # to compensate for the strange unpickling timing when objects are 
        # loaded from an elp, ensure that proper idevices are set:
        if field.answerTextArea.idevice is None: 
            field.answerTextArea.idevice = idevice
        self.answerElement = TextAreaElement(field.answerTextArea)
        self.answerId = "ans"+self.id
        self.answerElement.id = self.answerId

    def process(self, request):
        """
        Process arguments from the web server.  
        Return any which apply to this element.
        """
        log.debug("process " + repr(request.args))
        
        if self.answerId in request.args:
            self.answerElement.process(request)
                        
        if "c"+self.id in request.args:
            self.field.isCorrect = True 
            log.debug("option " + repr(self.field.isCorrect))
        elif "ans"+self.id in request.args:
            self.field.isCorrect = False
            
        if "action" in request.args and \
           request.args["action"][0] == "del"+self.id:
            self.field.question.options.remove(self.field)


    def renderEdit(self):
        """
        Returns an XHTML string for editing this option element
        code is pretty much straight from the Multi-Option aka QuizOption
        """
        html  = u"<tr><td align=\"left\"><b>%s</b>" % _("Option")
        html += common.elementInstruc(self.field.question._optionInstruc)

        header = ""
        if self.index == 0:
            header = _("Correct") + " " + _("Option")

        html += u"</td><td align=\"right\"><b>%s</b>\n" % header
        html += u"</td><td>\n"
        if self.index == 0: 
             html += common.elementInstruc(self.field.question._correctAnswerInstruc)
        html += "</td></tr><tr><td colspan=2>\n" 

        # rather than using answerElement.renderEdit(),
        # access the appropriate content_w_resourcePaths attribute directly,
        # since this is in a customised output format 
        # (in a table, with an extra delete-option X to the right)
        html += common.richTextArea("ans"+self.id, 
                          self.answerElement.field.content_w_resourcePaths)
        
        html += "</td><td align=\"center\">\n"
        html += common.checkbox("c"+self.id, 
                              self.field.isCorrect, self.index)
        html += "<br><br><br><br>\n"
        html += common.submitImage("del"+self.id, self.field.idevice.id, 
                                   "/images/stock-cancel.png",
                                   _(u"Delete option"))
        html += "</td></tr>\n"

        return html


    def renderView(self, preview=False):
        """
        Returns an XHTML string for viewing this option element
        """
        log.debug("renderView called with preview = " + str(preview))
        ident = self.field.question.id + str(self.index)
        html  = '<tr><td>'      
        html += u'<input type="checkbox" id="%s"' % ident
        html += u' value="%s" />\n' %str(self.field.isCorrect)
                
        ansIdent = "ans" + self.field.question.id + str(self.index)
        html += '</td><td><div id="%s" style="color:black">\n' % ansIdent
        if preview: 
            html += self.answerElement.renderPreview()
        else:
            html += self.answerElement.renderView()
        html += "</div></td></tr><tr><td></td><td>\n"
        html += '<div id ="%s" style="display:none;color:rgb(0,51,204)">\n' %(ident + '1')
        html += _("Correct") + "</div>"
        html += '<div id ="%s" style="display:none;color:rgb(0,51,204)">\n' %(ident + '0')
        html += _("Incorrect") + "</td></tr></div>"
        return html
    
    
# ===========================================================================
class SelectquestionElement(Element):
    """
    SelectQuestionElement is responsible for a block of question.  
    Used by QuizTestBlock
    Which is used as part of the Multi-Select iDevice.
    """
            
    def __init__(self, field):
        """
        Initialize
        """
        Element.__init__(self, field)

        # to compensate for the strange unpickling timing when objects are 
        # loaded from an elp, ensure that proper idevices are set:
        if field.questionTextArea.idevice is None: 
            field.questionTextArea.idevice = idevice
        if field.feedbackTextArea.idevice is None: 
            field.feedbackTextArea.idevice = idevice

        self.questionElement = TextAreaElement(field.questionTextArea)
        self.questionId = "question"+self.id
        self.questionElement.id = self.questionId
        self.feedbackElement = TextAreaElement(field.feedbackTextArea)
        self.feedbackId = "feedback"+self.id 
        self.feedbackElement.id = self.feedbackId

        self.options    = []
        i = 0
        for option in self.field.options:
            ele = SelectOptionElement(option)
            ele.index = i
            self.options.append(ele)
            i += 1

    def process(self, request):
        """
        Process the request arguments from the web server
        """
        log.info("process " + repr(request.args))
        
        if self.questionId in request.args:
            self.questionElement.process(request)
            
        if ("addOption"+unicode(self.id)) in request.args: 
            self.field.addOption()
            self.field.idevice.edit = True
            
        if self.feedbackId in request.args:
            self.feedbackElement.process(request)
            
        if "action" in request.args and \
           request.args["action"][0] == "del" + self.id:
            self.field.idevice.questions.remove(self.field)

        for element in self.options:
            element.process(request)


    def renderEdit(self):
        """
        Returns an XHTML string with the form element for editing this element
        """
        html  = u"<div class=\"iDevice\">\n"
        html += u"<b>" + _("Question:") + " </b>" 
        html += common.elementInstruc(self.field.questionInstruc)
        html += u" " + common.submitImage("del" + self.id, 
                                   self.field.idevice.id, 
                                   "/images/stock-cancel.png",
                                   _("Delete question"))
        # rather than using questionElement.renderEdit(),
        # access the appropriate content_w_resourcePaths attribute directly,
        # since this is in a customised output format 
        # (an extra delete-question X to the right of the question-mark)
        html += common.richTextArea("question"+self.id, 
                       self.questionElement.field.content_w_resourcePaths)

        html += u"<table width =\"100%%\">"
        html += u"<thead>"
        html += u"<tr>"
        html += u"<th>%s " % _("Options")
        html += common.elementInstruc(self.field.optionInstruc)
        html += u"</th>"
        html += u"</tr>"
        html += u"</thead>"
        html += u"<tbody>"
        
        for element in self.options:
            html += element.renderEdit() 
            
        html += u"</tbody>"
        html += u"</table>\n"

        value = _(u"Add another Option")    
        html += common.submitButton("addOption"+self.id, value)
        html += u"<br />"

        html += self.feedbackElement.renderEdit()

        html += u"</div>\n"

        return html

    def renderView(self,img=None):
        """ 
        Returns an XHTML string for viewing this question element 
        """ 
        return self.doRender(img, preview=False)

    def renderPreview(self,img=None):
        """ 
        Returns an XHTML string for viewing this question element 
        """ 
        return self.doRender(img, preview=True)
    

    def doRender(self, img, preview=False):
        """
        Returns an XHTML string for viewing this element
        """

        if preview: 
            html  = self.questionElement.renderPreview()
        else: 
            html  = self.questionElement.renderView()

        html += "<table>"
        for element in self.options:
            html += element.renderView(preview)      
        html += "</table>"   
        html += '<input type="button" name="submitSelect"' 
        html += ' value="%s" ' % _("Show Feedback")
        html += 'onclick="showFeedback(%d,\'%s\')"/> ' %(len(self.field.options),self.field.id) 
        html += "<br/>\n"
        html += '<div id="%s" style="display:none">' % ("f"+self.field.id)

        if preview: 
            html  += self.feedbackElement.renderPreview()
        else: 
            html  += self.feedbackElement.renderView()

        html += '</div><br/>'

        return html


    
# ===========================================================================
class QuizOptionElement(Element):
    """
    QuizOptionElement is responsible for a block of option.  Used by
    QuizQuestionElement.
    Which is used as part of the Multi-Choice iDevice.
    """

    def __init__(self, field):
        """
        Initialize
        """
        Element.__init__(self, field)
        self.index = 0

        # to compensate for the strange unpickling timing when objects are 
        # loaded from an elp, ensure that proper idevices are set:
        if field.answerTextArea.idevice is None: 
            field.answerTextArea.idevice = idevice
        if field.feedbackTextArea.idevice is None: 
            field.feedbackTextArea.idevice = idevice

        self.answerElement = TextAreaElement(field.answerTextArea)
        self.answerId = "ans"+self.id
        self.answerElement.id = self.answerId
        self.feedbackElement = TextAreaElement(field.feedbackTextArea)
        self.feedbackId = "f"+self.id
        self.feedbackElement.id = self.feedbackId

    def process(self, request):
        """
        Process arguments from the web server.  
        Return any which apply to this element.
        """
        log.debug("process " + repr(request.args))
        
        if self.answerId in request.args: 
            self.answerElement.process(request)
            
        if self.feedbackId in request.args: 
            self.feedbackElement.process(request)
                        
        if ("c"+self.field.question.id in request.args and 
            request.args["c"+self.field.question.id][0]==str(self.index)):
            self.field.isCorrect = True 
        elif "ans"+self.id in request.args:
            self.field.isCorrect = False
            
        if "action" in request.args and \
           request.args["action"][0] == "del"+self.id:
            self.field.question.options.remove(self.field)


    def renderEdit(self):
        """
        Returns an XHTML string for editing this option element
        """
        html  = u"<tr><td align=\"left\"><b>%s</b>" % _("Option")
        html += common.elementInstruc(self.field.idevice.answerInstruc)

        header = ""
        if self.index == 0:
            header = _("Correct") + " " + _("Option")

        html += u"</td><td align=\"right\"><b>%s</b>\n" % header
        html += u"</td><td>\n"
        if self.index == 0: 
            html += common.elementInstruc(self.field.idevice.keyInstruc)
        html += "</td></tr><tr><td colspan=2>\n" 

        # rather than using answerElement.renderEdit(),
        # access the appropriate content_w_resourcePaths attribute directly,
        # since this is in a customised output format 
        # (in a table, with an extra delete-option X to the right)
        html += common.richTextArea("ans"+self.id, 
                          self.answerElement.field.content_w_resourcePaths)
        
        html += "</td><td align=\"center\">\n"
        html += common.option("c"+self.field.question.id, 
                              self.field.isCorrect, self.index)   
        html += "<br><br><br><br>\n"
        html += common.submitImage("del"+self.id, self.field.idevice.id, 
                                   "/images/stock-cancel.png",
                                   _(u"Delete option"))
        html += "</td></tr>\n"

        html += "<tr><td align=\"left\"><b>%s</b>" % _("Feedback")
        html += common.elementInstruc(self.field.idevice.feedbackInstruc)
        html += "</td><td></td></tr><tr><td colspan=2>\n" 
         
        # likewise, rather than using feedbackElement.renderEdit(),
        # access the appropriate content_w_resourcePaths attribute directly,
        # since this is in a customised output format 
        # (though less so now that the header isn't even centered)
        html += common.richTextArea('f'+self.id, 
                         self.feedbackElement.field.content_w_resourcePaths)
         
        html += "</td></tr>\n"

        return html
    
    def renderAnswerView(self, preview=False):
        """
        Returns an XHTML string for viewing and previewing this option element
        """
        log.debug("renderView called with preview = " + str(preview))
  
        length = len(self.field.question.options)
        html  = '<tr><td>'
        html += '<input type="radio" name="option%s" ' \
                            % self.field.question.id
        html += 'id="i%s" ' % self.id
        html += 'onclick="getFeedback(%d,%d,\'%s\',\'multi\')"/>' \
                            % (self.index, length, self.field.question.id)
        html += '</td><td>\n'
        if preview:
            html += self.answerElement.renderPreview()
        else:
            html += self.answerElement.renderView()
        html += "</td></tr>\n"
       
        return html
    

    def renderFeedbackView(self, preview=False):
        """
        return xhtml string for display this option's feedback
        """
        feedbackStr = ""
        if self.feedbackElement.field.content != "": 
            if preview: 
                feedbackStr = self.feedbackElement.renderPreview() 
            else: 
                feedbackStr = self.feedbackElement.renderView()
        else:
            if self.field.isCorrect:
                feedbackStr = _("Correct")
            else:
                feedbackStr = _("Wrong")
        html  = '<div id="sa%sb%s" style="color: rgb(0, 51, 204);' \
                      % (str(self.index), self.field.question.id)
        html += 'display: none;">' 
        html += feedbackStr 
        html += '</div>\n'
        
        return html


# ===========================================================================

class QuizQuestionElement(Element):
    """
    QuizQuestionElement is responsible for a block of question.  
    Used by QuizTestBlock
    Which is used as part of the Multi-Choice iDevice.
    """
            
    def __init__(self, field):
        """
        Initialize
        """
        Element.__init__(self, field)

        # to compensate for the strange unpickling timing when objects are 
        # loaded from an elp, ensure that proper idevices are set:
        if field.questionTextArea.idevice is None: 
            field.questionTextArea.idevice = idevice
        if field.hintTextArea.idevice is None: 
            field.hintTextArea.idevice = idevice

        self.questionElement = TextAreaElement(field.questionTextArea)
        self.questionId = "question"+self.id
        self.questionElement.id = self.questionId
        self.hintElement = TextAreaElement(field.hintTextArea)
        self.hintId = "hint"+self.id
        self.hintElement.id = self.hintId

        self.options    = []
        i = 0
        for option in self.field.options:
            ele = QuizOptionElement(option)
            ele.index = i
            self.options.append(ele)
            i += 1

    def process(self, request):
        """
        Process the request arguments from the web server
        """
        log.info("process " + repr(request.args))
        
        if self.questionId in request.args: 
            self.questionElement.process(request)
            
        if self.hintId in request.args: 
            self.hintElement.process(request)
            
        if ("addOption"+unicode(self.id)) in request.args: 
            self.field.addOption()
            self.field.idevice.edit = True
            
            
        if "action" in request.args and \
           request.args["action"][0] == "del" + self.id:
            self.field.idevice.questions.remove(self.field)

        for element in self.options:
            element.process(request)


    def renderEdit(self):
        """
        Returns an XHTML string with the form element for editing this element
        """
        html = u" "+common.submitImage("del"+self.id, self.field.idevice.id,  
                "/images/stock-cancel.png", 
                _("Delete question")) 

        html += self.questionElement.renderEdit()

        html += self.hintElement.renderEdit()

        html += "<table width =\"100%%\">"
        html += "<tbody>"

        for element in self.options:
            html += element.renderEdit() 
            
        html += "</tbody>"
        html += "</table>\n"

        value = _("Add another option")    
        html += common.submitButton("addOption"+unicode(self.id), value)

        return html

    def renderView(self, img1=None, img2=None):
        """ 
        Returns an XHTML string for viewing this question element 
        """ 
        return self.doRender(img1, img2, preview=False)

    def renderPreview(self, img1=None, img2=None):
        """ 
        Returns an XHTML string for viewing this question element 
        """ 
        return self.doRender(img1, img2, preview=True)
    
    def doRender(self, img1, img2, preview=False):
        """
        Returns an XHTML string for viewing this element
        """
        if preview: 
            html  = self.questionElement.renderPreview()
        else:
            html  = self.questionElement.renderView()
        html += " &nbsp;&nbsp;\n"

        if self.hintElement.field.content:
            html += '<span '
            html += ' style="background-image:url(\'%s\');">' % img1
            html += '\n<a onmousedown="javascript:updateCoords(event);'
            html += 'showMe(\'hint%s\', 350, 100);" ' % self.id
            html += 'style="cursor:help;align:center;vertical-align:middle;" '
            html += 'title="Hint" \n'
            html += 'onmouseover="javascript:void(0);">&nbsp;&nbsp;&nbsp;&nbsp;</a>'
            html += '</span>'
            html += '<div id="hint'+self.id+'" '
            html += 'style="display:none; z-index:99;">'
            html += '<div style="float:right;" >'
            html += '<img alt="%s" ' % _('Close')
            html += 'src="%s" title="%s"' % (img2, _('Close'))
            html += " onmousedown=\"javascript:hideMe();\"/></div>"
            html += '<div class="popupDivLabel">'
            html += _("Hint")
            html += '</div>\n'

            if preview: 
                html  += self.hintElement.renderPreview()
            else: 
                html  += self.hintElement.renderView()

            html += "</div>\n"
        html += "<table>\n"
        html += "<tbody>\n"

        for element in self.options:
            html += element.renderAnswerView(preview)
            
        html += "</tbody>\n"
        html += "</table>\n"
            
        for element in self.options:
            html += element.renderFeedbackView(preview)

        return html
