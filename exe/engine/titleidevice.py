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
TitleIdevice: has the title for a Node
"""
#TODO Get rid of this it no longer makes sense

import logging
from exe.engine.idevice import Idevice
import gettext
log = logging.getLogger(__name__)
_ = gettext.gettext

# ===========================================================================
class TitleIdevice(Idevice):
    """
    TitleIdevice: has the title for a Node
    Not your normal iDevice
    """
    def __init__(self, parentNode, title=""):
        """Initialize"""
        log.debug("__init__ parentNode="+parentNode.id+
                  ", title="+title)
        Idevice.__init__(self, title, 
                         _("University of Auckland"), "", "", "", parentNode)
        self.edit         = False
        self.title        = title


    def __str__(self):
        """Return as a string"""
        if self.title:
            return self.title
        else:
            return self.parentNode.package.levelName(
                                    self.parentNode.level - 1)

    def setTitle(self, title):
        """Set the title, if it's been changed from the default"""
        if title != str(self):
            log.info("Changed "+self.id+" title to "+title)
            self.title = title

# ===========================================================================
