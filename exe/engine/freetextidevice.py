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
FreeTextIdevice: just has a block of text
"""

import logging
from exe.engine.idevice import Idevice
import gettext
_ = gettext.gettext
log = logging.getLogger(__name__)

# ===========================================================================
class FreeTextIdevice(Idevice):
    """
    FreeTextIdevice: just has a block of text
    """
    def __init__(self, content=""):
        Idevice.__init__(self, _("Free Text Area"), 
                         _("University of Auckland"), 
                         _("""The majority of a learning resource will be 
establishing context, delivering instructions and providing general information.
This provides the framework within which the learning activities are built and 
delivered."""), "", "")
        self.content = content
        if content:
            self.edit = False


# ===========================================================================
