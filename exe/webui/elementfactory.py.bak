# ===========================================================================
# eXe 
# Copyright 2004-2006, University of Auckland
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
ElementFactory is responsible for creating the right element object to match
a given field.
"""

import logging
from exe.engine.field  import TextField, TextAreaField, ImageField, FeedbackField
from exe.engine.field  import MultimediaField, FlashField, AttachmentField
from exe.webui.element import TextElement, TextAreaElement, ImageElement
from exe.webui.element import FeedbackElement, MultimediaElement, FlashElement
from exe.webui.element import AttachmentElement

log = logging.getLogger(__name__)

# ===========================================================================
class ElementFactory(object):
    """
    ElementFactory is responsible for creating the right element object to match
    a given field.  Elements register themselves with the factory, specifying
    which fields they can render
    """
    def __init__(self):
        """
        Initialize
        """
        self.elementTypeMap = {TextField:      TextElement,
                               TextAreaField:  TextAreaElement,
                               ImageField:     ImageElement,
                               FeedbackField:  FeedbackElement,
                               FlashField:     FlashElement,
                               MultimediaField: MultimediaElement,
                               AttachmentField: AttachmentElement}

    def createElement(self, field):
        """
        Returns a Element object which can render this field
        """
        elementType = self.elementTypeMap.get(field.__class__)

        if elementType:
            # Create an instance of the appropriate element class
            log.debug(u"createElement "+elementType.__class__.__name__+
                      u" for "+field.__class__.__name__)
            return elementType(field)
        else:
            log.error(u"No element type registered for " +
                      field.__class__.__name__)
            return None

g_elementFactory = ElementFactory()
# ===========================================================================
