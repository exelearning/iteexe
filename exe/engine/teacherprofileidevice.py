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
A TeacherProfile Idevice is one built up from an image and free text.
"""

import logging
from exe.engine.idevice import Idevice
import gettext
_ = gettext.gettext
log = logging.getLogger(__name__)

# ===========================================================================
class TeacherProfileIdevice(Idevice):
    """
    A TeacherProfile Idevice is one built up from an image and free text.
    """
    def __init__(self, content="", imageFile = ""):
        Idevice.__init__(self, _("Teacher Profile"), 
                         _("University of Auckland"), 
                         "", "", "")
        self.content        = content
        self.imageFile      = imageFile
        self.contentInstruc = ""
        self.imageInstruc   = ""
        
# ===========================================================================
