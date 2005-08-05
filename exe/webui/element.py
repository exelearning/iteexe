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

        if (hasattr(field.idevice, 'class_') and 
            field.idevice.class_ in ("activity", "objectives", "preknowledge")):
            self.height = 250
        else:
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
        html += u"/>\n"

        html += u'<script type="text/javascript">\n'
        html += u"document.getElementById('img"+self.id+"')."
        html += "addEventListener('load', imageChanged, true);\n"
        html += u'</script>\n'
        html += u"</p>\n"

        html += u"<a href=\"#\" onclick=\"addImage('"+self.id+"');\">"
        html += u"<img alt=\"add images\" "
        html += u"style=\"vertical-align: text-bottom;\" "
        html += u"src=\"/images/stock-insert-image.png\" /> " 
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
class ClozeElement(Element):
    """
    Allows the user to enter a passage of text and declare that some words
    should be added later by the student
    """

    def process(self, request):
        """
        Sets the rawContent of our field
        """
        if self.id in request.args:
            self.field.rawContent = request.args[self.id][0]

    def renderEdit(self):
        """
        Enables the user to set up their passage of text
        """
        html = [
            u'<p>',
            u'  <b>%s</b>' % self.field.name,
            common.elementInstruc(self.id, self.field.instruc),
            u'</p>',
            u'<p>',
            common.textArea(self.id, self.field.rawContent),
            u'</p>']
        return '\n    '.join(html)

    def renderView(self):
        """
        Shows the text with inputs for the missing parts
        """
        html = []
        # Mix the parts together
        for i, (text, missingWord) in enumerate(self.field.parts):
            if text:
                html.append(text)
            if missingWord:
                html += [
                    ' <input type="text" value="" ',
                    '        id="clz%s%s"' % (self.id, i),
                    '  oninput="onClozeChange(this, \'%s\')"/>' % missingWord]
        return '\n'.join(html)
    
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
        Process arguments from the webserver.
        """
        if "path"+self.id in request.args:
            self.field.setFlash(request.args["path"+self.id][0])
            print "flash path: ", request.args["path"+self.id][0]

        if "width"+self.id in request.args:
            self.field.width = request.args["width"+self.id][0]

        if "height"+self.id in request.args:
            self.field.height = request.args["height"+self.id][0]


    def renderEdit(self):
        """
        Returns an XHTML string with the form element for editing this field
        """
        log.debug("renderEdit")

        html  = u"<b>"+self.field.name+":</b>\n"
        html += common.elementInstruc(self.id, self.field.instruc)
        html += u"<br/>\n"
        html += u"<a href=\"#\" onclick=\"addFile('"+self.id+"');\">"
        html += _(u"Select a flash file")
        html += u"</a><br/>\n"
        html += u"<p><b>%s</b>\n" % _(u"Display as:")
        html += u"<input type=\"text\" "
        html += u"id=\"width"+self.id+"\" " 
        html += u"name=\"width"+self.id+"\" " 
        html += u"value=\"%s\" " % self.field.width
        html += u"size=\"4\" />\n"
        html += u"x\n"
        html += u"<input type=\"text\" "
        html += u"id=\"height"+self.id+"\" " 
        html += u"name=\"height"+self.id+"\" " 
        html += u"value=\"%s\" " % self.field.height
        html += u"size=\"4\" />\n"
        html += u"(%s) \n" % _(u"blank for original size")
        html += common.hiddenField("path"+self.id)

        
        return html


    def renderPreview(self):
        """
        Returns an XHTML string for previewing this image
        """

        html = common.flash("flash"+self.id, 
                             "", 
                             self.field.width,
                             self.field.height)
        return html


    def renderView(self):
        """
        Returns an XHTML string for viewing this flash
        """

        html = common.flash("flash"+self.id, 
                             self.field.flashName, 
                             self.field.width,
                             self.field.height)
        
        return html

