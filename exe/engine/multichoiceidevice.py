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
from exe.engine.idevice import Idevice
_ = gettext.gettext
log = logging.getLogger(__name__)


# ===========================================================================
class Option(object):
    """
    A Multichoice iDevice is built up of question and options.  Each option can be
    rendered as an XHTML element
    """
    def __init__(self, answer="", isCorrect=False, feedback=""):
        """
        Initialize 
        """
        self.answer    = answer
        self.isCorrect = isCorrect
        self.feedback  = feedback


# ===========================================================================
class MultichoiceIdevice(Idevice):
    """
    A multichoice Idevice is one built up from question and options
    """
    def __init__(self, question=""):
        """
        Initialize 
        """
        Idevice.__init__(self,
                         _("Multi-Choice Question"),
                         _("University of Auckland"),
                         _("""Although more often used in formal testing 
situations MCQs can be used as a testing tool to stimulate thought and  
discussion on topics students may feel a little reticent in responding to. 

When designing a MCQ test consider the following:
<ul>
<li>	What are the learning outcomes are the questions testing</li>
<li>    What intellectual skills are being tested</li>
<li>	What are the language skills of the audience</li>
<li>	Gender and cultural issues</li>
<li>	Avoid grammar language and question structures that might provide clues</li>
</ul>
 """), "")
                         
        self.question   = question
        self.options    = []
        self.questionInstruc = _("Type the question stem.")
        self.keyInstruc      = _("""To indicate the correct answer, click the 
radio button next to the correct option.""")
        self.answerInstruc   = _("""Type in each option from which students must 
choose into the appropriate options box. You can add options by clicking on the 
"ADD ANOTHER OPTION" button. You can delete options by clicking on the "x" next 
to each option.""")
        self.feedbackInstruc = _("""Type in the feedback that you want the 
student to see when selecting the particular option. If you don't complete this 
box, eXe will automatically provide default feedback as follows: "Correct answer"
 as indicated by the selection for the correct answer; or "Wrong answer" for the 
other alternatives.""")
        

    def addOption(self):
        """
        Add a new option to this iDevice. 
        """
        self.options.append(Option())

    
# ===========================================================================
