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
Cloze Idevice. Shows a paragraph where the student must fill in the blanks
"""

import logging
from exe.engine.idevice import Idevice
from exe.engine.path    import Path
from exe.engine.field   import ClozeField, TextAreaField
from exe.engine.persist import Persistable
import Image
log = logging.getLogger(__name__)

# ===========================================================================
class ClozeIdevice(Idevice):
    """
    Holds a paragraph with words missing that the student must fill in
    """
    
    persistenceVersion = 2

    def __init__(self, parentNode=None):
        """
        Sets up the idevice title and instructions etc
        """
        Idevice.__init__(self, x_(u"Cloze Activity"),
                         x_(u"University of Auckland"), 
                         x_(u"<p>Cloze tests or exercises are texts or "
                             "sentences where some words or phrases have "
                             "been deleted. Students must fill in the "
                             "missing words. They are often used for the "
                             "following purposes:</p>"
                             "<ol>"
                             "<li>To check knowledge of core course "
                             "concepts (this could be a pre-check, "
                             "formative exercise, or summative check).</li>"
                             "<li>To check reading comprehension.</li>"
                             "<li>To check vocabulary knowledge (usually "
                             "for non-native English speakers).</li>"
                             "<li>To check word formation and/or grammatical "
                             "competence. </li>"),
                         x_(u"<dl>"
                             "  <dt>If your goal is to test understanding "
                             "of core concepts or reading comprehension"
                             "  </dt>"
                             "  <dd>"
                             "    <p>"
                             "  Write a summary of the concept or reading. "
                             "  This should be long enough to adequately test "
                             "your target knowledge, but short enough not to"
                             "induce fatigue. Less than one typed page is"
                             "probably adequate, but you may want to write"
                             "considerably less for young students or"
                             "beginners."
                             "    </p>"
                             "    <p>"
                             "Select the words in the text that"
                             "are key to understanding the concepts. These"
                             "will probably be verbs, nouns, and key adverbs."
                             "Choose alternatives with one clear answer."
                             "    </p>"
                             "  </dd>"
                             "  <dt>"
                             "If your goal is to test vocabulary knowledge"
                             "  </dt>"
                             "  <dd>"
                             "Write a text using the target vocabulary. This"
                             "text should be coherent and cohesive, and be of"
                             "an appropriate length. Highlight the target"
                             "words in the text. Choose alternatives with one"
                             "clear answer."
                             "  </dd>"
                             "  <dt>"
                             "If your goal is to test word"
                             "formation/grammar:"
                             "  </dt>"
                             "  <dd>"
                             "  <p>"
                             "Write a text using the "
                             "target forms. This text should be coherent and"
                             "cohesive, and be of an appropriate length."
                             "Remember that the goal is not vocabulary"
                             "knowledge, so the core meanings of the stem"
                             "words should be well known to the students."
                             "  </p>"
                             "  <p>"
                             "Highlight the target words in the text. Provide"
                             "alternatives with the same word stem, but"
                             "different affixes. It is a good idea to get a"
                             "colleague to test the test/exercise to make"
                             "sure there are no surprises!"
                             "  </p>"),
                            u"question",
                             parentNode)
        self.instructionsForLearners = TextAreaField(
            x_(u'Instructions For Learners'),
            x_(u'Provide instructions to learners on what '
                'they must do to complete the cloze exercise.'),
            x_(u'Read the paragraph below and '
                'fill in the missing words'))
        self.instructionsForLearners.idevice = self
        self._content = ClozeField(x_(u'Cloze'), 
            x_(u'Enter the text for your cloze exercise by pasting or '
                'typing into the cloze field. To select the words you wish '
                'to hide double click on the word and click the '
                '<i>Hide/Show Word</i> button.'))
        self._content.idevice = self
        self.feedback = TextAreaField(x_(u'Feedback'),
            x_(u'Enter any feedback you wish to provide the learner '
                'with-in the feedback field. This field can be left blank.'))
        self.feedback.idevice = self
        self.emphasis = Idevice.SomeEmphasis

    def getResources(self):
        """
        Return the resource files used by this iDevice
        """
        return Idevice.getResources(self) + ["common.js"]

    # Properties
    content = property(lambda self: self._content, 
                       doc="Read only, use 'self.content.encodedContent = x' "
                           "instead")

    def upgradeToVersion1(self):
        """
        Upgrades exe to v0.10
        """
        self._upgradeIdeviceToVersion1()
        self.instructionsForLearners = TextAreaField(
            x_(u'Instructions For Learners'),
            x_(u'Put instructions for learners here'),
            x_(u'Read the paragraph below and '
                'fill in the missing words'))
        self.instructionsForLearners.idevice = self
        self.feedback = TextAreaField(x_(u'Feedback'))
        self.feedback.idevice = self


    def upgradeToVersion2(self):
        """
        Upgrades exe to v0.11
        """
        self.content.autoCompletion = True
        self.content.autoCompletionInstruc =  _(u"Allow auto completion when "
                                                u"user filling the gaps.")

