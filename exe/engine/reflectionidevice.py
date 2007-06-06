# ===========================================================================
# eXe 
# Copyright 2004-2006, University of Auckland
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
from exe.engine.idevice   import Idevice
from exe.engine.translate import lateTranslate
from exe.engine.field     import TextAreaField
log = logging.getLogger(__name__)

# ===========================================================================
class ReflectionIdevice(Idevice):
    """
    A Reflection Idevice presents question/s for the student to think about
    before they look at the answer/s
    """
    persistenceVersion = 7
    
    def __init__(self, activity = "", answer = ""):
        """
        Initialize 
        """
        Idevice.__init__(self, 
                         x_(u"Reflection"),
                         x_(u"University of Auckland"), 
                         x_(u"""Reflection is a teaching method often used to 
connect theory to practice. Reflection tasks often provide learners with an 
opportunity to observe and reflect on their observations before presenting 
these as a piece of academic work. Journals, diaries, profiles and portfolios 
are useful tools for collecting observation data. Rubrics and guides can be 
effective feedback tools."""), u"", u"reflection")
        self.emphasis         = Idevice.SomeEmphasis
        self._activityInstruc = x_(u"""Enter a question for learners 
to reflect upon.""")
        self._answerInstruc   = x_(u"""Describe how learners will assess how 
they have done in the exercise. (Rubrics are useful devices for providing 
reflective feedback.)""")
        self.systemResources += ["common.js"]
        
        self.activityTextArea = TextAreaField(x_(u'Reflective question:'), 
                                    self._activityInstruc, activity)
        self.activityTextArea.idevice = self

        self.answerTextArea = TextAreaField(x_(u'Feedback:'), 
                                   self._answerInstruc, answer)
        self.answerTextArea.idevice = self

    # Properties
    activityInstruc = lateTranslate('activityInstruc')
    answerInstruc   = lateTranslate('answerInstruc')


    def upgradeToVersion1(self):
        """
        Upgrades the node from version 0 to 1.
        """
        log.debug(u"Upgrading iDevice")
        self.icon       = u"reflection"


    def upgradeToVersion2(self):
        """
        Upgrades the node from 1 (v0.5) to 2 (v0.6).
        Old packages will loose their icons, but they will load.
        """
        log.debug(u"Upgrading iDevice")
        self.emphasis = Idevice.SomeEmphasis

        
    def upgradeToVersion3(self):
        """
        Upgrades v0.6 to v0.7.
        """
        self.lastIdevice = False


    def upgradeToVersion4(self):
        """
        Upgrades to exe v0.10
        """
        self._upgradeIdeviceToVersion1()
        self._activityInstruc = self.__dict__['activityInstruc']
        self._answerInstruc   = self.__dict__['answerInstruc']
   

    def upgradeToVersion5(self):
        """
        Upgrades to exe v0.10
        """
        self._upgradeIdeviceToVersion1()


    def upgradeToVersion6(self):
        """
        Upgrades to v0.12
        """
        self._upgradeIdeviceToVersion2()
        self.systemResources += ["common.js"]


    def upgradeToVersion7(self):
        """ 
        Upgrades to somewhere before version 0.25 (post-v0.24) 
        Taking the old unicode string fields, and converting them 
        into image-enabled TextAreaFields:
        """
        self.activityTextArea = TextAreaField(x_(u'Reflective question:'), 
                                    self._activityInstruc, self.activity)
        self.activityTextArea.idevice = self
        self.answerTextArea = TextAreaField(x_(u'Feedback:'), 
                                  self._answerInstruc, self.answer)
        self.answerTextArea.idevice = self

# ===========================================================================
