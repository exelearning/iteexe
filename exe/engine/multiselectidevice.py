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
A Multiple Select Idevice is one built up from Questions
"""

import logging
from exe.engine.persist   import Persistable
from exe.engine.idevice   import Idevice
from exe.engine.translate import lateTranslate
from exe.engine.field     import SelectQuestionField
log = logging.getLogger(__name__)


class MultiSelectIdevice(Idevice):
    """
    A MultiSelect Idevice is one built up from question and options
    """

    def __init__(self):
        """
        Initialize 
        """
        Idevice.__init__(self,
                         x_(u"Multi-select"),
                         x_(u"University of Auckland"),
                         x_(u"""Unlike the MCQ the SCORM quiz is used to test 
the learners knowledge on a topic without providing the learner with feedback 
to the correct answer. The quiz will often be given once the learner has had 
time to learn and practice using the information or skill.
 """), u"", "question")
        self.emphasis   = Idevice.SomeEmphasis
        self.questions  = []
        self.addQuestion()
        self.systemResources += ["common.js"]
        

    def addQuestion(self):
        """
        Add a new question to this iDevice. 
        """
        question = SelectQuestionField(x_(u'Question'))
        question.idevice = self
        question.addOption()
        self.questions.append(question)

# ===========================================================================
