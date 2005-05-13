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
Export Pages functions
"""

import logging
import gettext
import re

log = logging.getLogger(__name__)
_   = gettext.gettext


# ===========================================================================

# TODO include a base class for Web and Scorm Pages here

def uniquifyNames(pages):
    """
    Make sure all the page names are unique
    """
    pageNames = {}

    # First identify the duplicate names
    for page in pages:
        if page.name in pageNames:
            pageNames[page.name] = 1
        else:
            pageNames[page.name] = 0

    # Then uniquify them
    for page in pages:
        uniquifier = pageNames[page.name]
        if uniquifier:
            pageNames[page.name] = uniquifier + 1
            page.name += str(uniquifier)

