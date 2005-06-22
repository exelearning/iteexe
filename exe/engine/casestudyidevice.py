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
from exe.engine.persist import Persistable
from exe.engine.idevice import Idevice
_ = gettext.gettext
log = logging.getLogger(__name__)


# ===========================================================================
class Question(Persistable):
    """
    A Case iDevice is built up of question and options.  Each option can 
    be rendered as an XHTML element
    """
    def __init__(self, question="", feedback=""):
        """
        Initialize 
        """
        self.question  = question
        self.feedback  = feedback


# ===========================================================================
class CasestudyIdevice(Idevice):
    """
    A multichoice Idevice is one built up from question and options
    """
    persistenceVersion = 1

    def __init__(self, story=""):
        """
        Initialize 
        """
        Idevice.__init__(self,
                         _(u"Case Study"),
                         _(u"University of Auckland"), 
                         _(u"""A case study is a story that conveys an 
educational message. A case study can be used to present a realistic situation
that enables learners to apply their own knowledge and experience to.  When 
designing a case study you might want to consider the following:<ul> 
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
        self.storyInstruc = _(u"""Create the case story.  A good case is one 
that describes a controversy.""")
        self.questionInstruc = _(u"""Enter the study question.  These questions 
should draw out the educational messages presented in the case.  Consider 
aspects of the case like, characters, timeliness, relevance, dilemmas.""")
        self.feedbackInstruc = _(u"""Provide feedback on the question.  This may
be a summary of the main points or concepts.""")
        self.addQuestion()
        
 
    def addQuestion(self):
        """
        Add a new question to this iDevice. 
        """
        self.questions.append(Question())


    def upgradeToVersion1(self):
        """
        Upgrades the node from version 0 to 1.
        Old packages will loose their icons, but they will load.
        """
        log.debug(u"Upgrading iDevice")
        self.icon = "casestudy"
    
# ===========================================================================
