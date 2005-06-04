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
EditorElement is responsible for a block of field. Used by iDevice Editor
"""

import logging
from exe.webui import common
from exe.webui.element import Element
import gettext

log = logging.getLogger(__name__)
_   = gettext.gettext
# ===========================================================================
class EditorElement(Element):
    """
    EditorElement is responsible for a block of field.  Used by iDevice Editor
    """
    def __init__(self, field):
        """
        Initialize
        """
        Element.__init__(self, field)
#        self.index      = index
#        self.id         = u'%sb%s' % (unicode(index), idevice.id)
#        self.name       = field.name
#        "name"+self.id     = u"name" + self.id
#        self.id  = u"content" + self.id

    def process(self, request):
        """
        Process arguments from the webserver.  Return any which apply to this 
        element.
        """
        log.debug(u'process ' + repr(request.args))
        
        if "name"+self.id in request.args:
            self.field.name = request.args["name"+self.id][0]

        if "instruc"+self.id in request.args:
            self.field.instruc = request.args["instruc"+self.id][0]
                        
        if "object" in request.args and request.args["object"][0] == self.id:
            if request.args["action"][0] == "deleteField":
                self.field.idevice.fields.remove(self.field)


#    def renderPreview(self, content):
#        """
#        Returns an XHTML string for viewing or previewing this element
#        """
#        html  = u'<p class="%s">\n' % self.field.class_
#        html += content
#        html += u'</p>\n'
#        return html
#
    
# ===========================================================================

class TextEditorElement(EditorElement):
    """ 
    TextElement is a single line of text
    """
    def renderEdit(self):
        """
        Returns an XHTML string with the form element for editing this field
        """
        self.field.instruc = self.field.instruc.replace("\r", "")
        self.field.instruc = self.field.instruc.replace("\n","\\n")
        self.field.instruc = self.field.instruc.replace("'","\\'")
        
        html  = common.textInput("name"+self.id, self.field.name, 25)
        html += "<a href=\"#\" style=\"cursor:help;\" "
        html += "onclick=\"submitLink('showHide','%s',%d)\"" % (self.id, 1)
        html += "<img src=\"/images/help.gif\" border=\"0\" "
        html += "align=\"middle\"/></a> \n"
        html += common.submitImage("deleteField", self.id, 
                                   "/images/stock-cancel.png", 
                                   _("Delete"), 1)
        html += "<br/>\n"
        html += common.textInput(self.id, "", 40, "Disabled")
        html += "<br/>\n"
        html += common.richTextArea("instruc"+self.id, self.field.instruc)
        html += "<br/>"
        return html
    

    def renderPreview(self):
        """
        Returns an XHTML string with the form element for previewing this field
        """
        html  = "<b>" + self.field.name + "</b> "
        if self.field.instruc != "":
            html += common.elementInstruc("instruc"+self.id, self.field.instruc)
        html += "<br/>\n"  
        html += common.textInput(self.id, self.field.content)
        html += "<br/>\n"
        return html
    
    
# ===========================================================================

class TextAreaEditorElement(EditorElement):
    """ 
    TextElement is a single line of text
    """
    def renderEdit(self):
        """
        Returns an XHTML string with the form element for editing this field
        """
        self.field.instruc = self.field.instruc.replace("\r", "")
        self.field.instruc = self.field.instruc.replace("\n","\\n")
        self.field.instruc = self.field.instruc.replace("'","\\'")
        
        html  = common.textInput("name"+self.id, self.field.name, 25)
        html += "<a href=\"#\" style=\"cursor:help;\" "
        html += "onclick=\"submitLink('showHide','%s',%d)\"" % (self.id, 1)
        html += "<img src=\"/images/help.gif\" border=\"0\" "
        html += "align=\"middle\"/></a> \n"
        html += common.submitImage("deleteField", self.id, 
                                   "/images/stock-cancel.png", 
                                   _("Delete"),1)
        html += "<br/>\n"
        html += common.textArea(self.id, "", "Disabled")
        html += common.richTextArea("instruc"+self.id, self.field.instruc)
        html += "<br/>"
        return html
    

    def renderPreview(self):
        """
        Returns an XHTML string with the form element for previewing this field
        """
        html  = "<b>" + self.field.name + "</b> "
        if self.field.instruc != "":
            html += common.elementInstruc("instruc"+self.id, self.field.instruc)
        html += "<br/>\n" 
        html += common.textArea(self.id, self.field.content)
        html += "<br/>\n"
        return html

# ===========================================================================

class ImageEditorElement(EditorElement):
    """ 
    ImageElement is an image
    """
    DefaultImage = "sunflowers.jpg"

    def renderEdit(self):
        """
        Returns an XHTML string with the form element for editing this field
        """
        self.field.instruc = self.field.instruc.replace("\r", "")
        self.field.instruc = self.field.instruc.replace("\n","\\n")
        self.field.instruc = self.field.instruc.replace("'","\\'")

        html  = common.textInput("name"+self.id, self.field.name, 25)
        html += "<a href=\"#\" style=\"cursor:help;\" "
        html += "onclick=\"submitLink('showHide','%s',%d)\"" % (self.id, 1)
        html += "<img src=\"/images/help.gif\" border=\"0\" "
        html += "align=\"middle\"/></a> \n"
        html += common.submitImage("deleteField", self.id, 
                                   "/images/stock-cancel.png", 
                                   _("Delete"),1)
        html += "<br/>\n"
        html += common.image("img"+self.id, 
                             "/images/"+ImageEditorElement.DefaultImage,
                             self.field.width,
                             self.field.height)
        html += "<br/>"
        return html
    

    def renderPreview(self):
        """
        Returns an XHTML string with the form element for previewing this field
        """
        html  = "<b>" + self.field.name + "</b> "
        if self.field.instruc != "":
            html += common.elementInstruc("instruc"+self.id, self.field.instruc)
        html += "<br/>" 
        html += common.image("img"+self.id, 
                             "/images/"+ImageEditorElement.DefaultImage,
                             self.field.width,
                             self.field.height)
        html += "<br/>\n"
        return html
    
# ===========================================================================
