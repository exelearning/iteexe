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
import gettext
from exe.webui import common
from exe.webui.block          import Block
from exe.webui.blockfactory   import g_blockFactory

log = logging.getLogger(__name__)
_   = gettext.gettext


# ===========================================================================
class TitleBlock(Block):
    """
    TitleBlock is for rendering node titles
    """
    def __init__(self, node):
        Block.__init__(self, node.parent, "i"+node.idStr())
        self.node = node

    def process(self, request):
        Block.process(self, request)
        if "nodeTitle"+self.id in request.args:
            self.node.title = request.args["nodeTitle"+self.id][0]

    def renderEdit(self):
        """
        Returns an XHTML string with the form element for editing this title
        """
        html  = "<div>\n"
        html += common.textInput("nodeTitle"+self.id, self.node.title)
        html += common.submitButton("done"+self.id, _("Done"))
        html += "</div>\n"
        return html


    def renderView(self):
        """
        Returns an XHTML string for viewing this title
        """
        html  = "<div>\n"
        html += "<h1 class=\"nodeTitle\">" + self.node.title + "</h1>"
        html += common.submitButton("edit"+self.id, _("Edit"))
        html += "</div>\n"
        return html

# ===========================================================================
