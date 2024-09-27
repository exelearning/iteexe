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
This is an example of a user created iDevice plugin.  If it is copied
into the user's ~/.exe/idevices dircectory it will be loaded along with
the system idevices.
"""

import logging
from exe.engine.idevice import Idevice
from exe.engine.field   import TextAreaField
log = logging.getLogger(__name__)

# ===========================================================================
class ExampleIdevice(Idevice):
    """
    This is an example of a user created iDevice plugin.  If it is copied
    into the user's ~/.exe/idevices dircectory it will be loaded along with
    the system idevices.
    """
    def __init__(self, content=""):
        Idevice.__init__(self, _("Example Example"), 
                         _("University of Auckland"), 
                         _("""This is an example of a user created
iDevice plugin."""), "", "")
        self.emphasis = Idevice.NoEmphasis
        self.content  = TextAreaField(_("Example"), 
                                      _("This is a free text field."), 
                                      content)
        self.content.idevice = self


# ===========================================================================
def register(ideviceStore):
    """Register with the ideviceStore"""
    ideviceStore.extended.append(ExampleIdevice())
    

# ===========================================================================
