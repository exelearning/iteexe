# ===========================================================================
# eXe 
# Copyright 2004-2005, University of Auckland
#
# IdeviceStore is simply the collection of all the Idevices available
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
The collection of iDevices available
"""

import logging

log = logging.getLogger(__name__)

# ===========================================================================
class IdeviceStore:
    """
    The collection of iDevices available
    at the moment this class is not being used
    """
    def __init__(self):
        pass

    def addIdevice(self, idevice):
        """
        Register another iDevice as available
        """
        log.debug("IdeviceStore.addIdevice")


# ===========================================================================
