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
A Reflection Idevice presents question/s for the student to think about
before they look at the answer/s
"""

import logging
from exe.engine.idevice import Idevice
import gettext
_ = gettext.gettext
log = logging.getLogger(__name__)

# ===========================================================================
class ReflectionIdevice(Idevice):
    """
    A Reflection Idevice presents question/s for the student to think about
    before they look at the answer/s
    """
    def __init__(self, activity = "", answer = ""):
        """
        Initialize 
        """
        Idevice.__init__(self, 
                         _("Reflection"),
                         _("University of Auckland"), 
                         _("""Reflection is a teaching method often used to 
connect theory to practice. Reflection tasks often provide learners with an 
opportunity to observe and reflect on their observations before presenting 
these as a piece of academic work. Journals, diaries, profiles and portfolios 
are useful tools for collecting observation data. Rubrics and guides can be 
effective feedback tools."""), "", "reflection")
        self.activity       = activity
        self.answer          = answer
        self.activityInstruc = _("""Enter details of the activity learners 
must reflect upon.""")
        self.answerInstruc    = _("""Describe how learners will assess how 
they have done in the exercise. (Rubrics are useful devices for providing 
reflective feedback.)""")


    def upgradeToVersion1(self):
        """
        Upgrades the node from version 0 to 1.
        Old packages will loose their icons, but they will load.
        """
        log.debug("Upgrading iDevice")
        self.icon       = "reflection"


# ===========================================================================
