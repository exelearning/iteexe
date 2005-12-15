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
A true false idevice is one built up from question and options
"""

import logging
from exe.engine.persist   import Persistable
from exe.engine.idevice   import Idevice
from exe.engine.translate import lateTranslate
log = logging.getLogger(__name__)


# ===========================================================================
class TrueFalseQuestion(Persistable):
    """
    A Multichoice iDevice is built up of question and options.  Each option can
    be rendered as an XHTML element
    """
    def __init__(self, question="", isCorrect=False, feedback="", hint=""):
        """
        Initialize 
        """
        self.question  = question
        self.isCorrect = isCorrect
        self.feedback  = feedback
        self.hint      = hint
        

# ===========================================================================
class TrueFalseIdevice(Idevice):
    """
    A multichoice Idevice is one built up from question and options
    """
    persistenceVersion = 6

    def __init__(self):
        """
        Initialize 
        """
        Idevice.__init__(self,
                         x_(u"True-False Question"),
                         x_(u"University of Auckland"),
                         x_(u"""True/false questions present a statement where 
the learner must decide if the statement is true. This type of question works 
well for factual information and information that lends itself to either/or 
responses."""), u"", u"question")
        self.emphasis         = Idevice.SomeEmphasis
        self._hintInstruc     = x_(u"Type the question's hint here.")
        self.questions        = []
        self._questionInstruc = x_(u"Type the question stem.")
        self._keyInstruc      = ""
        self._feedbackInstruc = x_(u"""Type in the feedback that you want the 
student to see when selecting the particular question. If you don't complete
this box, eXe will automatically provide default feedback as follows: 
"Correct answer" as indicated by the selection for the correct answer; or 
"Wrong answer" for the other alternatives.""")
        self.questions.append(TrueFalseQuestion())
        

    # Properties
    hintInstruc     = lateTranslate('hintInstruc')
    questionInstruc = lateTranslate('questionInstruc')
    keyInstruc      = lateTranslate('keyInstruc')
    feedbackInstruc = lateTranslate('feedbackInstruc')


    def getResources(self):
        """
        Return the resource files used by this iDevice
        """
        return Idevice.getResources(self) + ["common.js", 
                                             "libot_drag.js",
                                             "panel-amusements.png",
                                             "stock-stop.png"]
       

    def addQuestion(self):
        """
        Add a new question to this iDevice. 
        """
        self.questions.append(TrueFalseQuestion())


    def upgradeToVersion1(self):
        """
        Upgrades the node from version 0 to 1.
        Old packages will loose their icons, but they will load.
        """
        log.debug(u"Upgrading iDevice")
        self.icon = u"multichoice"


    def upgradeToVersion2(self):
        """
        Upgrades the node from 1 (v0.5) to 2 (v0.6).
        Old packages will loose their icons, but they will load.
        """
        log.debug(u"Upgrading iDevice")
        self.emphasis = Idevice.SomeEmphasis
        

    def upgradeToVersion3(self):
        """
        Upgrades the node from 1 (v0.6) to 2 (v0.7).
        Change icon from 'multichoice' to 'question'
        """
        log.debug(u"Upgrading iDevice icon")
        self.icon = "question"


    def upgradeToVersion4(self):
        """
        Upgrades v0.6 to v0.7.
        """
        self.lastIdevice = False

    def upgradeToVersion5(self):
        """
        Upgrades exe to v0.10
        """
        self._upgradeIdeviceToVersion1()
        self._hintInstruc = self.__dict__['hintInstruc']
        self._questionInstruc = self.__dict__['questionInstruc']
        self._keyInstruc = self.__dict__['keyInstruc']

    def upgradeToVersion6(self):
        """
        Upgrades exe to v0.11
        """
        self._feedbackInstruc = x_(u"""Type in the feedback that you want the 
student to see when selecting the particular question. If you don't complete
this box, eXe will automatically provide default feedback as follows: 
"Correct answer" as indicated by the selection for the correct answer; or 
"Wrong answer" for the other alternatives.""")
    
# ===========================================================================
