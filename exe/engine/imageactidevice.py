# ===========================================================================
# eXe 
# Copyright 2004-2005, University of Auckland
#
# Idevices are mini templates which the user uses to create content in
# the package
# An Image Activity Idevice is one where there are a series of questions
# about an image.  Each question has feedback associated which can
# be displayed (presentation will hide it until selected).
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
from exe.engine.idevice import Idevice

log = logging.getLogger(__name__)

# ===========================================================================
class ImageActIdevice(Idevice):
    def __init__(self):
        pass

    def createBlock(self):
        pass


# ===========================================================================
