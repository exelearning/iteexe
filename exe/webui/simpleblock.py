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
from exe.webui.block          import Block
from exe.engine.simpleidevice import SimpleIdevice
from exe.webui.blockfactory   import g_blockFactory

log = logging.getLogger(__name__)
_   = gettext.gettext


# ===========================================================================
class SimpleBlock(Block):
    """
    SimpleBlock can render and process SimpleIdevices as XHTML
    """
    def __init__(self, idevice):
        self.idevice = idevice

    def renderEdit(self):
        """
        Returns an XHTML string with the form element for editing this block
        """
        pass

    def renderView(self):
        """
        Returns an XHTML string for viewing this block
        """
        pass

g_blockFactory.registerBlockType(SimpleBlock, SimpleIdevice)

# ===========================================================================
