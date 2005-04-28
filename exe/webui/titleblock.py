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
TitleBlock is for rendering node titles
"""

import logging
import gettext
from exe.webui import common
from exe.webui.block          import Block

log = logging.getLogger(__name__)
_   = gettext.gettext


# ===========================================================================
class TitleBlock(Block):
    """
    TitleBlock is for rendering node titles
    """
    def __init__(self, titleIdevice):
        #log.debug("__init__"+titleIdevice.title)
        Block.__init__(self, titleIdevice)

    def process(self, request):
        """
        User has finished editing this block
        """
        Block.process(self, request)
        
        if "nodeTitle"+self.id in request.args:
            self.idevice.setTitle(request.args["nodeTitle"+self.id][0])
        
    def renderPreview(self, style):
        """
        Returns an XHTML string for previewing this title
        """
        html  = "<div>\n"
        html += self.renderView(style)
        html += "</div>\n"
        return html

    def renderView(self, style):
        """
        Returns an XHTML string for viewing this title
        """
        html = '<p id="nodeTitle" class="nodeTitle">%s</p>\n' % str(self.idevice)
        return html
    

# ===========================================================================
