# ===========================================================================
# eXe
# Copyright 2004, University of Auckland
#
# Config settings loaded from exe.conf
# Is responsible for the system-wide settings we use
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
This module contains exception classes used for eXe specific errors
"""

import logging

log = logging.getLogger(__name__)

# ===========================================================================
class Error(Exception):
    """
    Exception class used for eXe specific errors
    """
    def __init__(self, value):
        """
        Initialize 
        """
        Exception.__init__(self)
        self.value = value
        log.debug("init", self.value)

    def __str__(self):
        """
        return the error string
        """
        return repr(self.value)

# ===========================================================================

