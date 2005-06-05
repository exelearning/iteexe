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
from exe.engine.field   import TextAreaField, ImageField
import gettext
_ = gettext.gettext
log = logging.getLogger(__name__)

# ===========================================================================
class TeacherProfileIdevice(Idevice):
    """
    A TeacherProfile Idevice is one built up from an image and free text.
    """
    def __init__(self, defaultImage = None):
        Idevice.__init__(self, _(u"Teacher Profile"), 
                         _(u"University of Auckland"), 
                         _(u"""This idevice enables you to provide a brief 
description of the teacher or other staff involved in the delivery of the 
learning.  The profile (with personal photo) can not only be used to 
communicate the role and credentials of the teacher but, also acknowledges 
the direct relationship between the learner and teacher, rather then the 
content delivery medium (the computer)."""), "", "")
        self.photo = ImageField(_(u"Photo"), 
                                _(u"We recommend you resize your photo to "
                                  u"150px x 200px"))
        self.photo.idevice      = self
        self.photo.width        = "150px"
        self.photo.height       = "200px"
        self.photo.defaultImage = defaultImage

        self.profile = TextAreaField(_(u"Profile"))
        self.profile.idevice = self
 

    def getResources(self):
        """
        Return the resource files used by this iDevice
        """
        return Idevice.getResources(self) + self.photo.getResources()
       
        
# ===========================================================================
