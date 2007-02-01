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
A multichoice Idevice is one built up from question and options
"""

import logging
from exe.engine.persist   import Persistable
from exe.engine.idevice   import Idevice
from exe.engine.field     import ImageField
from exe.engine.translate import lateTranslate
from exe.engine.path      import toUnicode

log = logging.getLogger(__name__)

# Constants
DEFAULT_IMAGE = 'empty.gif'

# ===========================================================================
class Question(Persistable):
    """
    A Case iDevice is built up of question and options.  Each option can 
    be rendered as an XHTML element
    """

    def __init__(self, idevice):
        """
        Initialize 
        """
        self.question  = u''
        self.feedback  = u''
        self.setupImage(idevice)

    def setupImage(self, idevice):
        """
        Creates our image field
        """
        self.image = ImageField(x_(u"Image"),
                                x_(u"Choose an optional image to be shown to the student "
                                    "on completion of this question")) 
        self.image.idevice = idevice
        self.image.defaultImage = idevice.defaultImage
    

# ===========================================================================
class CasestudyIdevice(Idevice):
    """
    A multichoice Idevice is one built up from question and options
    """
    persistenceVersion = 6

    def __init__(self, story="", defaultImage=None):
        """
        Initialize 
        """
        Idevice.__init__(self,
                         x_(u"Case Study"),
                         x_(u"University of Auckland"), 
                         x_(u"""A case study is a device that provides learners 
with a simulation that has an educational basis. It takes a situation, generally 
based in reality, and asks learners to demonstrate or describe what action they 
would take to complete a task or resolve a situation. The case study allows 
learners apply their own knowledge and experience to completing the tasks 
assigned. when designing a case study consider the following:<ul> 
<li>	What educational points are conveyed in the story</li>
<li>	What preparation will the learners need to do prior to working on the 
case study</li>
<li>	Where the case study fits into the rest of the course</li>
<li>	How the learners will interact with the materials and each other e.g.
if run in a classroom situation can teams be setup to work on different aspects
of the case and if so how are ideas feed back to the class</li></ul>"""), 
                         "",
                         u"casestudy")
        self.emphasis     = Idevice.SomeEmphasis
        
        self.story        = story
        self.questions    = []
        self._storyInstruc = x_(u"""Create the case story. A good case is one 
that describes a controversy or sets the scene by describing the characters 
involved and the situation. It should also allow for some action to be taken 
in order to gain resolution of the situation.""")
        self._questionInstruc = x_(u"""Describe the activity tasks relevant 
to the case story provided. These could be in the form of questions or 
instructions for activity which may lead the learner to resolving a dilemma 
presented. """)
        self._feedbackInstruc = x_(u"""Provide relevant feedback on the 
situation.""")
        if defaultImage is None:
            from exe.application import application
            defaultImage = application.config.webDir/'images'/DEFAULT_IMAGE
        self.defaultImage = toUnicode(defaultImage)
        self.addQuestion()

    # Properties
    storyInstruc    = lateTranslate('storyInstruc')
    questionInstruc = lateTranslate('questionInstruc')
    feedbackInstruc = lateTranslate('feedbackInstruc')
    storyInstruc    = lateTranslate('storyInstruc')
    questionInstruc = lateTranslate('questionInstruc')
    feedbackInstruc = lateTranslate('feedbackInstruc')
 
    def addQuestion(self):
        """
        Add a new question to this iDevice. 
        """
        self.questions.append(Question(self))


    def upgradeToVersion1(self):
        """
        Upgrades the node from version 0 to 1.
        Old packages will loose their icons, but they will load.
        """
        log.debug(u"Upgrading iDevice")
        self.icon = "casestudy"
   

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
        self._storyInstruc    = self.__dict__['storyInstruc']
        self._questionInstruc = self.__dict__['questionInstruc']
        self._feedbackInstruc = self.__dict__['feedbackInstruc']

    def upgradeToVersion5(self):
        """
        Upgrades to v0.12
        """
        self._upgradeIdeviceToVersion2()
        
    def upgradeToVersion6(self):
        """
        Upgrades for v0.18
        """
        from exe.application import application
        self.defaultImage = toUnicode(application.config.webDir/'images'/DEFAULT_IMAGE)
        for question in self.questions:
            question.setupImage(self)


# ===========================================================================
