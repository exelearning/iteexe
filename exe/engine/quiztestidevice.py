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
A QuizTest Idevice is one built up from TestQuestions
"""

import logging
from exe.engine.persist import Persistable
from exe.engine.idevice import Idevice
log = logging.getLogger(__name__)


# ===========================================================================
class AnswerOption(Persistable):
    """
    A TestQuestion is built up of question and AnswerOptions.  Each
    answerOption can be rendered as an XHTML element
    """
    def __init__(self, answer="", isCorrect=False):
        """
        Initialize 
        """
        self.answer    = answer
        self.isCorrect = isCorrect


# ===========================================================================
class TestQuestion(Persistable):
    """
    A TestQuestion is built up of question and AnswerOptions.
    """
    def __init__(self, question=""):
        """
        Initialize 
        """
        self.question             = question
        self.options              = []
        self.correctAns           = -2
        self.userAns              = -1
        self.addOption()
        self.questionInstruc      = _(u"Type the question stem.")
        self.optionInstruc        = ""
        self.correctAnswerInstruc = _(u"""To indicate the correct answer, 
click the radio button next to the correct option.""")
        
    def addOption(self):
        """
        Add a new option to this question. 
        """
        self.options.append(AnswerOption())



# ===========================================================================
class QuizTestIdevice(Idevice):
    """
    A QuizTestIdevice Idevice is one built up from question and options
    """
    persistenceVersion = 6

    def __init__(self):
        """
        Initialize 
        """
        Idevice.__init__(self,
                         x_(u"SCORM Quiz Experimental"),
                         x_(u"University of Auckland"),
                         x_(u"""Although more often used in formal testing 
situations MCQs can be used as a testing tool to stimulate thought and  
discussion on topics students may feel a little reticent in responding to. 

When designing a MCQ test consider the following:
<ul>
<li> What are the learning outcomes are the questions testing</li>
<li>    What intellectual skills are being tested</li>
<li> What are the language skills of the audience</li>
<li> Gender and cultural issues</li>
<li> Avoid grammar language and question structures that might provide 
     clues</li>
</ul>
 """), x_(u"""When building an MCQ consider the following: <ul>
<li> Language use phrases that learners are familiar with and have 
encountered in their study </li>
<li> Keep responses concise </li>
<li> There should be some consistency between the stem and the responses </li>
<li> Provide enough options to challenge learners to think about their response
</li>
<li> Try to make sure that correct responses are not more detailed than the 
distractors </li>
<li> Distractors should be incorrect but plausible </li>
</ul>
"""), "", "question")
        self.emphasis   = Idevice.SomeEmphasis
        self.score      = -1 
        self.isAnswered = True
        self.passRate   = "50"
        self.questions  = []
        self.addQuestion()
        self.systemResources += ["common.js", "libot_drag.js"]
        

    def addQuestion(self):
        """
        Add a new question to this iDevice. 
        """
        self.questions.append(TestQuestion())


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
        Upgrades to exe v0.10
        """
        self._upgradeIdeviceToVersion1()
  

    def upgradeToVersion6(self):
        """
        Upgrades to v0.12
        """
        self._upgradeIdeviceToVersion2()      
        self.systemResources += ["common.js", "libot_drag.js"]

# ===========================================================================
