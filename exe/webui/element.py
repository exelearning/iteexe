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
Classes to XHTML elements.  Used by GenericBlock
"""
import gettext
import logging
from exe.webui       import common

log = logging.getLogger(__name__)
_   = gettext.gettext


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
        Process arguments from the webserver. 
        """
        log.error(u"process called directly")
        return u"ERROR Element.process called directly"


    def renderEdit(self):
        """
        Returns an XHTML string for editing this element
        """
        log.error(u"renderEdit called directly")
        return u"ERROR Element.renderEdit called directly"


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
        log.error(u"renderView called directly")
        return u"ERROR Element.renderView called directly"


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
        Process arguments from the webserver. 
        """
        if self.id in request.args:
            self.field.content = request.args[self.id][0]


    def renderEdit(self):
        """
        Returns an XHTML string with the form element for editing this field
        """
        html  = u"<b>"+self.field.name+":</b>\n"
        html += common.elementInstruc(self.id, self.field.instruc)
        html += u"<br/>\n"
        html += common.textInput(self.id, self.field.content)
        html += "<br/>\n"

        return html
    

    def renderView(self):
        """
        Returns an XHTML string for viewing or previewing this element
        """
        return self.field.content


# ===========================================================================
class TextAreaElement(Element):
    """
    TextAreaElement is responsible for a block of text
    """
    def __init__(self, field):
        """
        Initialize
        """
        Element.__init__(self, field)
        self.width  = "100%"
        self.height = 100

 
    def process(self, request):
        """
        Process arguments from the webserver. 
        """
        if self.id in request.args:
            self.field.content = request.args[self.id][0]


    def renderEdit(self):
        """
        Returns an XHTML string with the form element for editing this field
        """
        content = self.field.content
        log.debug("renderEdit content="+content+
                  ", height="+unicode(self.height))

        content = content.replace("\r", "")
        content = content.replace("\n","\\n")
        content = content.replace("'","\\'")

        html  = u"<b>"+self.field.name+":</b>\n"
        html += common.elementInstruc(self.id, self.field.instruc)
        html += u"<br/>\n"
        html += common.richTextArea(self.id, content, self.width, self.height)

        return html


    def renderView(self):
        """
        Returns an XHTML string for viewing or previewing this element
        """
        return self.field.content

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
        Process arguments from the webserver.
        """
        if "path"+self.id in request.args:
            self.field.setImage(request.args["path"+self.id][0])

        if "width"+self.id in request.args:
            self.field.width = request.args["width"+self.id][0]

        if "height"+self.id in request.args:
            self.field.height = request.args["height"+self.id][0]


    def renderEdit(self):
        """
        Returns an XHTML string with the form element for editing this field
        """
        log.debug("renderEdit")

        if self.field.imageName == "":
            self.field.setDefaultImage()

        html  = u"<b>"+self.field.name+":</b>\n"
        html += common.elementInstruc(self.id, self.field.instruc)
        html += u"<br/>\n"
        html += u'<img alt="" '
        html += u'id="img%s" ' % self.id
        html += u"onclick=\"addImage('"+self.id+"');\" "
        html += u"src=\"resources/"+self.field.imageName+"\" "
        if self.field.width:
            html += u"width=\""+self.field.width+"\" " 
        if self.field.height:
            html += u"height=\""+self.field.height+"\" " 
        # TODO: This was removed for xhtml comliance. Find out what it did!
        #html += u"onload=\"imageChanged('"+self.id+"');\" "
        html += u"/>\n"

        html += u'<script type="text/javascript">\n'
        ##html += u"""document.getElementById("img%s").setAttribute("onload", "imageChanged('%s');") """ % (self.id, self.id)
        html += u"""document.getElementById("img%s").addEventListener("load", imageChanged, true); """ % self.id
        html += u'</script>\n'
        html += u"<br/>\n"

        html += u"<a href=\"#\" onclick=\"addImage('"+self.id+"');\">"
        html += _(u"Select an image")
        html += u"</a><br/>\n"
        html += u"<p><b>%s</b>\n" % _(u"Display as:")
        html += u"<input type=\"text\" "
        html += u"id=\"width"+self.id+"\" " 
        html += u"name=\"width"+self.id+"\" " 
        html += u"value=\"%s\" " % self.field.width
        html += u"onchange=\"changeImageWidth('"+self.id+"');\" "
        html += u"size=\"4\" />\n"
        html += u"x\n"
        html += u"<input type=\"text\" "
        html += u"id=\"height"+self.id+"\" " 
        html += u"name=\"height"+self.id+"\" " 
        html += u"value=\"%s\" " % self.field.height
        html += u"onchange=\"changeImageHeight('"+self.id+"');\" "
        html += u"size=\"4\" />\n"
        html += u"(%s) \n" % _(u"blank for original size")
        html += common.hiddenField("path"+self.id)
        #html += u"</p>\n"
        
        return html


    def renderPreview(self):
        """
        Returns an XHTML string for previewing this image
        """
        if self.field.imageName == "":
            self.field.setDefaultImage()

        html = common.image("img"+self.id, 
                             "resources/"+self.field.imageName, 
                             self.field.width,
                             self.field.height)
        return html


    def renderView(self):
        """
        Returns an XHTML string for viewing this image
        """
        if self.field.imageName == "":
            self.field.setDefaultImage()

        html = common.image("img"+self.id, 
                             self.field.imageName, 
                             self.field.width,
                             self.field.height)
        
        return html

# ===========================================================================
