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
import gettext
from twisted.spread     import jelly
from exe.engine.idevice import Idevice
_ = gettext.gettext
log = logging.getLogger(__name__)


# ===========================================================================
class TrueFalseQuestion(jelly.Jellyable):
    """
    A Multichoice iDevice is built up of question and options.  Each option can be
    rendered as an XHTML element
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
    def __init__(self):
        """
        Initialize 
        """
        Idevice.__init__(self,
                         _("True-False Question"),
                         _("University of Auckland"),
                         "", "")
                         
        self.hintInstruc     = _("Typy the question's hint here.")
        self.questions         = []
        self.questionInstruc = _("Type the question stem.")
        self.keyInstruc      = ""
        self.feedbackInstruc = _("""Type in the feedback that you want the 
student to see when selecting the particular question. If you don't complete this 
box, eXe will automatically provide default feedback as follows: "Correct answer"
 as indicated by the selection for the correct answer; or "Wrong answer" for the 
other alternatives.""")
        
        self.questions.append(TrueFalseQuestion())
        

    def addQuestion(self):
        """
        Add a new question to this iDevice. 
        """
        self.questions.append(TrueFalseQuestion())

    
# ===========================================================================
