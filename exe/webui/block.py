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

log = logging.getLogger(__name__)
_   = gettext.gettext

# ===========================================================================
class Block(object):
    """
    Block is the base class for the classes which are responsible for 
    rendering and processing Idevices in XHTML
    """
    nextId    = 0

    def __init__(self, edit=False):
        self.id   = Block.nextId
        self.edit = edit
        Block.nextId += 1 

    def process(self, request):
        if "done%d" % self.id in request.args:
            self.processDone(request)
        elif "edit%d" % self.id in request.args:
            self.processEdit(request)

    def processDone(self, request):
        self.edit = False

    def processEdit(self, request):
        self.edit = True

    def render(self):
        if self.edit:
            return self.renderEdit()
        else:
            return self.renderView()

    def renderEdit(self):
        """
        Returns an XHTML string with the form element for editing this block
        """
        log.error("renderEdit called directly")
        return "ERROR Block.renderEdit called directly"

    def renderEditButtons(self):
        html  = common.submitButton("done%d" % self.id,   _("Done"))
        html += common.submitButton("delete%d" % self.id, _("Delete"))
        return html

    def renderView(self):
        """
        Returns an XHTML string for viewing this block
        """
        log.error("renderView called directly")
        return "ERROR Block.renderView called directly"

    def renderViewButtons(self):
        html  = common.submitButton("edit%d" % id, _("Edit"))
        return html

# ===========================================================================
