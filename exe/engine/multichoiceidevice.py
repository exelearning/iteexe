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
                         _("Multi-Choice Questions"),
                         _("University of Auckland"),
                         _("""This is an iDevice that is used to promote 
student interaction with the learning content. The text-based version of this 
iDevice is the most common sub-type used. Multiple choice items are used for 
assessment purposes during the presentation of a particular section of content 
to support students during the learning process by providing instructive 
feedback.  Alternatively, they can be used for summative purposes to gauge the 
attainment of the learning objectives or outcomes for the section concerned.  
With careful design, multiple choice items can test a range of cognitive 
levels including knowlege-based, comprehension and application questions."""),
                         _("""Developing engaging and high quality multiple 
choice items is a fine art. There are many resources available in the 
literature that cover this topic. We have found the following online resources 
useful: 1) Assessing by Multiple Choice Tests at The UK Centre for Legal 
Education (<a href="http://www.ukcle.ac.uk/resources/mcqs.html">
http://www.ukcle.ac.uk/resources/mcqs.html</a>) 2) More multiple-choice item 
writing do's and don'ts. Practical Assessment, Research & Evaluation, 4(11), 
by Robert Frary. (<a href="http://www.pareonline.net/getvn.asp?v=4&n=11">
http://www.pareonline.net/getvn.asp?v=4&n=11)</a>) 3) Exploring the potential 
of Multiple-Choice Questions in Assessment, Learning and teaching in Action, 
2003, 2(1), by Edwina Higgins and Laura Tatham. (<a 
href="http://www.ltu.mmu.ac.uk/ltia/issue4/higginstatham.shtml">
http://www.ltu.mmu.ac.uk/ltia/issue4/higginstatham.shtml</a>)."""))

        self.question   = question
        self.options    = []

    def addOption(self):
        """
        Add a new option to this iDevice. 
        """
        self.options.append(Option())

    
# ===========================================================================
