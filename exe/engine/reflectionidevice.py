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

import logging
from exe.engine.idevice import Idevice

log = logging.getLogger(__name__)


# ===========================================================================
class Question(object):
    """
    A Reflection iDevice is built up of these questions.  Each question can be
    rendered as an XHTML element
    """
    def __init__(self):
        """
        Initialize 
        """
        self.question   = ""
        self.answer     = ""
        self.showAmswer = False
 

# ===========================================================================
class ReflectionIdevice(Idevice):
    """
    A generic Idevice is one built up from simple fields... as such it
    can have a multitude of different forms all of which are just simple
    XHTML fields.
    """
    def __init__(self, description=""):
        """
        Initialize 
        """
        Idevice.__init__(self)
        self.description = description
        self.questions   = []

    def addQuestion(self):
        """
        Add a new question to this iDevice.
        """
        self.questions.append(Question())




# ===========================================================================
