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
import gettext
from exe.engine.persist import Persistable
from exe.engine.idevice import Idevice
_ = gettext.gettext
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
        self.questionInstruc      = ""
        self.optionInstruc        = ""
        self.correctAnswerInstruc = ""
        
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
    persistenceVersion = 1

    def __init__(self):
        """
        Initialize 
        """
        Idevice.__init__(self,
                         _(u"SCORM Quiz"),
                         _(u"University of Auckland"),
                         "", "", "")
        self.score      = -1 
        self.isAnswered = True
        self.passRate   = "50"
        self.questions  = []
        self.addQuestion()
        

    def addQuestion(self):
        """
        Add a new question to this iDevice. 
        """
        self.questions.append(TestQuestion())


    def getResources(self):
        """
        Return the resource files used by this iDevice
        """
        # TODO not sure if this is correct?
        return (Idevice.getResources(self) + 
                ["common.js", "lib_drag.js", "quizForScorm.js"])


# ===========================================================================
