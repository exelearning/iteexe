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

import sys
import logging
from exe.webui import common

log = logging.getLogger(__name__)

# ===========================================================================
def createElement(elementType, name, blockId):
    """Factory method for creating Elements"""
    if elementType == "Text":
        return TextElement(name, blockId)
    elif elementType == "TextArea":
        return TextAreaElement(name, blockId)
    elif elementType == "Icon":
        return IconElement(name, blockId)

# ===========================================================================
class Element(object):
    def __init__(self, name, blockId):
        self.name     = name
        self.blockId  = blockId
        self.id       = name+blockId


    def process(self, request):
        if self.id in request.args:
            return request.args[self.id][0]
        else:
            return None


    def renderView(self, content):
        html  = "<p class=\""+self.name+"\">\n"
        html += content
        html += "</p>\n"
        return html


    def renderEdit(self, content):
        log.error("renderEdit called directly")
        return "ERROR: Element.renderEdit called directly"



# ===========================================================================
class TextElement(Element):
    """ TextElement is a single line of text"""
    def renderEdit(self, content):
        html  = "<b>"+self.name+":</b><br/>\n"
        html += common.textInput(self.id, content)
        html += "<br/>\n"
        return html


# ===========================================================================
class TextAreaElement(Element):
    """
    TextAreaElement is responsible for a block of text
    """
    def renderEdit(self, content):
        """
        Returns an XHTML string with the form element for editing this field
        """
        content = content.replace("\r", "")
        content = content.replace("\n","\\n")
        content = content.replace("'","\\'")

        html  = "<b>"+self.name+":</b><br/>\n"
        html += "<script type=\"text/javascript\">\n"
        html += "<!--\n"
        html += "    var editor = new FCKeditor('"+self.id+"');\n"
        html += "    editor.BasePath = '/scripts/';\n"
        html += "    editor.Config['CustomConfigurationsPath'] ="
        html += " '/scripts/armadillo.js';\n"
        html += "    editor.ToolbarSet = 'Armadillo'; \n"
        html += "    editor.Value      = '"+content+"'; \n"
        html += "    editor.Create();\n"
        html += "//-->\n"
        html += "</script>\n"
        return html


# ===========================================================================
class IconElement(Element):
    """ IconElement is a picture thing"""

    def renderView(self, content):
        html  = "<img src=\"style/"+self.name+"\"/>\n"
        return html

    def renderEdit(self, content):
        return ""



# ===========================================================================
