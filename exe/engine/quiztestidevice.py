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
A multichoice Idevice is one built up from question and options
"""

import logging
import gettext
from twisted.spread     import jelly
from exe.engine.idevice import Idevice
_ = gettext.gettext
log = logging.getLogger(__name__)


# ===========================================================================
class AnswerOption(jelly.Jellyable):
    """
    A Multichoice iDevice is built up of question and options.  Each option can be
    rendered as an XHTML element
    """
    def __init__(self, answer="", isCorrect=False):
        """
        Initialize 
        """
        self.answer    = answer
        self.isCorrect = isCorrect


# ===========================================================================

class TestQuestion(jelly.Jellyable):
    """
    A Multichoice iDevice is built up of question and options.  Each option can be
    rendered as an XHTML element
    """
    def __init__(self, question=""):
        """
        Initialize 
        """
        self.question = question
        self.options  = []
        
    def addOption(self):
        """
        Add a new option to this iDevice. 
        """
        self.questions.append(Option())



# ===========================================================================
class QuizTestIdevice(Idevice):
    """
    A QuizTestIdevice Idevice is one built up from question and options
    """
    persistenceVersion = 1

    def __init__(self, question=""):
        """
        Initialize 
        """
        Idevice.__init__(self,
                         _("Quiz Test"),
                         _("University of Auckland"),
                         "", "")
                         
        self.questions         = []
        self.addQuestion()
        

    def addQuestion(self):
        """
        Add a new option to this iDevice. 
        """
        self.questions.append(TestQuestion())


    
# ===========================================================================
