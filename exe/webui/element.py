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

import logging
from exe.webui import common

log = logging.getLogger(__name__)

# ===========================================================================
def createElement(elementType, name, class_, blockId):
    """
    Factory method for creating Elements
    """
    if elementType == "Text":
        return TextElement(name, class_, blockId)
    elif elementType == "TextArea":
        return TextAreaElement(name, class_, blockId)
    return None

# ===========================================================================
class Element(object):
    """
    Base class for a XHTML element.  Used by GenericBlock
    """
    def __init__(self, name, class_, blockId):
        """
        Initialize
        """
        self.name     = name
        self.class_   = class_
        self.blockId  = blockId
        self.id       = class_+blockId


    def process(self, request):
        """
        Process arguments from the webserver.  Return any which apply to this 
        element.
        """
        if self.id in request.args:
            return request.args[self.id][0]
        else:
            return None


    def renderView(self, content):
        """
        Returns an XHTML string for viewing or previewing this element
        """
        html  = "<p class=\""+self.class_+"\">\n"
        html += content
        html += "</p>\n"
        return html


    def renderEdit(self, dummy):
        """
        Returns an XHTML string for editing this element
        """
        log.error("renderEdit called directly")
        return "ERROR: Element.renderEdit called directly"



# ===========================================================================
class TextElement(Element):
    """ 
    TextElement is a single line of text
    """
    def renderEdit(self, content):
        """
        Returns an XHTML string with the form element for editing this field
        """
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
        html += common.richTextArea(self.id, content)
        
        return html


# ===========================================================================
