# ===========================================================================
# eXe 
# Copyright 2004-2006, University of Auckland
# Copyright 2004-2008 eXe Project, http://eXeLearning.org/
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
FPD - Cloze Activity (Modified)
Cloze Idevice. Shows a paragraph where the student must fill in the blanks
"""

import logging
from exe.engine.idevice import Idevice
from exe.engine.path    import Path
from exe.engine.field   import ClozelangField, TextAreaField
from exe.engine.persist import Persistable
try:
    from PIL import Image
except:
    import Image
import re
log = logging.getLogger(__name__)

# ===========================================================================
class ClozelangfpdIdevice(Idevice):
    """
    Holds a paragraph with words missing that the student must fill in
    """
    
    persistenceVersion = 5

    def __init__(self, parentNode=None):
        """
        Sets up the idevice title and instructions etc
        """
        Idevice.__init__(self, x_(u"FPD - Cloze Activity (Modified)"),
                         x_(u"University of Auckland"), 
                         x_(u"<p>Cloze exercises are texts or "
                             "sentences where students must fill in "
                             "missing words. They are often used for the "
                             "following purposes:</p>"
                             "<ol>"
                             "<li>To check knowledge of core course "
                             "concepts (this could be a pre-check, "
                             "formative exercise, or summative check).</li>"
                             "<li>To check reading comprehension.</li>"
                             "<li>To check vocabulary knowledge.</li>"
                             "<li>To check word formation and/or grammatical "
                             "competence. </li></ol>"),
                         x_(u"<dl>"
                             "  <dt>If your goal is to test understanding "
                             "of core concepts or reading comprehension"
                             "  </dt>"
                             "  <dd>"
                             "    <p>"
                             "  Write a summary of the concept or reading long "
                             " enough to adequately test the target's "
                             "knowledge, but short enough not to "
                             "induce fatigue. Less than one typed page is "
                             "probably adequate, but probably "
                             "considerably less for young students or "
                             "beginners."
                             "    </p>"
                             "    <p>"
                             "Select words in the text that"
                             "are key to understanding the concepts. These"
                             "will probably be verbs, nouns, and key adverbs."
                             "Choose alternatives with one clear answer."
                             "    </p>"
                             "  </dd>"
                             "  <dt>"
                             "If your goal is to test vocabulary knowledge"
                             "  </dt>"
                             "  <dd>"
                             "<p>Write a text using the target vocabulary. This "
                             "text should be coherent and cohesive, and be of "
                             "an appropriate length. Highlight the target "
                             "words in the text. Choose alternatives with one "
                             "clear answer.</p>"
                             "  </dd>"
                             "  <dt>"
                             "If your goal is to test word "
                             "formation/grammar:"
                             "  </dt>"
                             "  <dd>"
                             "  <p>"
                             "Write a text using the "
                             "target forms. This text should be coherent and "
                             "cohesive, and be of an appropriate length. "
                             "Remember that the goal is not vocabulary "
                             "knowledge, so the core meanings of the stem "
                             "words should be well known to the students."
                             "  </p>"
                             "  <p>"
                             "Highlight the target words in the text. Provide "
                             "alternatives with the same word stem, but "
                             "different affixes. It is a good idea to get a "
                             "colleague to test the test/exercise to make "
                             "sure there are no surprises!"
                             "  </p>"
                             "  </dd>"
                             "</dl>"),
                            u"autoevaluacionfpd",
                             parentNode)
        self.instructionsForLearners = TextAreaField(
            x_(u'Instructions'),
            x_(u"""Provide instruction on how the cloze activity should be 
completed. Default text will be entered if there are no changes to this field.
"""), "")
#            x_(u'Read the paragraph below and fill in the missing words.'))
        self.instructionsForLearners.idevice = self
        self._content = ClozelangField(x_(u'Clozelang'), 
            x_(u"""<p>Enter the text for the cloze activity in to the cloze field 
by either pasting text from another source or by typing text directly into the 
field.</p><p> To select words to hide, double click on the word to select it and 
click on the Hide/Show Word button below.</p><p>Use pipe character | to define more than one correct answer. I.e.: dog|cat|bird</p>"""))
        self._content.idevice = self
        self.feedback = TextAreaField(x_(u'Feedback'),
            x_(u'Enter any feedback you wish to provide the learner '
                'with-in the feedback field. This field can be left blank.'))
        self.feedback.idevice = self
#        self.emphasis   = Idevice.SomeEmphasis
        self.emphasis   = "_autoevaluacionfpd"
        self.systemResources += ["common.js"]
        self.isCloze = True


    # Properties
    content = property(lambda self: self._content, 
                       doc="Read only, use 'self.content.encodedContent = x' "
                           "instead")

    def getResourcesField(self, this_resource): 
        """ 
        implement the specific resource finding mechanism for this iDevice: 
        """ 
        # be warned that before upgrading, this iDevice field could not exist:
        if hasattr(self, '_content') and hasattr(self._content, 'images'):
            for this_image in self._content.images: 
                if hasattr(this_image, '_imageResource') \
                and this_resource == this_image._imageResource: 
                    return self._content

        # be warned that before upgrading, this iDevice field could not exist:
        if hasattr(self, 'instructionsForLearners')\
        and hasattr(self.instructionsForLearners, 'images'):
            for this_image in self.instructionsForLearners.images: 
                if hasattr(this_image, '_imageResource') \
                and this_resource == this_image._imageResource: 
                    return self.instructionsForLearners

        # be warned that before upgrading, this iDevice field could not exist:
        if hasattr(self, 'feedback') and hasattr(self.feedback, 'images'):
            for this_image in self.feedback.images: 
                if hasattr(this_image, '_imageResource') \
                and this_resource == this_image._imageResource: 
                    return self.feedback
        
        return None

      
    def getRichTextFields(self):
        """
        Like getResourcesField(), a general helper to allow nodes to search 
        through all of their fields without having to know the specifics of each
        iDevice type.  
        """
        fields_list = []
        if hasattr(self, '_content'):
            fields_list.append(self._content)
        if hasattr(self, 'instructionsForLearners'):
            fields_list.append(self.instructionsForLearners)
        if hasattr(self, 'feedback'):
            fields_list.append(self.feedback)
        return fields_list
        
    def burstHTML(self, i):
        """
        takes a BeautifulSoup fragment (i) and bursts its contents to 
        import this idevice from a CommonCartridge export
        """
        # Cloze Idevice:
        title = i.find(name='span', attrs={'class' : 'iDeviceTitle' })
        self.title = title.renderContents().decode('utf-8')

        inner = i.find(name='div', attrs={'class' : 'iDevice_inner' })

        instruct = inner.find(name='div', 
                attrs={'class' : 'block' , 'style' : 'display:block' })
        self.instructionsForLearners.content_wo_resourcePaths = \
                instruct.renderContents().decode('utf-8')
        # and add the LOCAL resource paths back in:
        self.instructionsForLearners.content_w_resourcePaths = \
                self.instructionsForLearners.MassageResourceDirsIntoContent( \
                    self.instructionsForLearners.content_wo_resourcePaths)
        self.instructionsForLearners.content = \
                self.instructionsForLearners.content_w_resourcePaths

        content = inner.find(name='div', attrs={'id' : re.compile('^clozelang') })
        rebuilt_contents = ""
        for this_content in content.contents:
            if not this_content.__str__().startswith('<input'):
                if this_content.__str__().startswith('<span'):
                    # Now, decode the answer
                    # with code reverse-engineered from:
                    # a) Cloze's getClozeAnswer() in common.js
                    # b) ClozeElement's renderView() + encrypt()
                    answer = ""
                    code_key = 'X'
                    code = this_content.renderContents()
                    code = code.decode('base64')
                    # now in the form %uABCD%uEFGH%uIJKL....
                    char_pos = 0
                    while char_pos < len(code):
                        # first 2 chars = %u, replace with 0x to get int
                        # next 4 = the encoded unichr
                        this_code_char = "0x" + code[char_pos+2 : char_pos+6]
                        this_code_ord = int(this_code_char, 16)
                        letter = chr(ord(code_key)^this_code_ord)
                        answer += letter
                        # key SHOULD be ^'d by letter, but seems to be:
                        code_key = letter
                        char_pos += 6
                    rebuilt_contents += "<U>" + answer + "</U>"
                elif not this_content.__str__().startswith('<div'):
                    # this should be the un-clozed text:
                    rebuilt_contents +=  this_content.__str__()
        self._content.content_wo_resourcePaths = rebuilt_contents
        # and add the LOCAL resource paths back in:
        self._content.content_w_resourcePaths = \
                self._content.MassageResourceDirsIntoContent( \
                    self._content.content_wo_resourcePaths)
        self._content.content = self._content.content_w_resourcePaths

        feedback = inner.find(name='div', attrs={'class' : 'feedback' })
        self.feedback.content_wo_resourcePaths = \
                feedback.renderContents().decode('utf-8')
        # and add the LOCAL resource paths back in:
        self.feedback.content_w_resourcePaths = \
                self.feedback.MassageResourceDirsIntoContent( \
                    self.feedback.content_wo_resourcePaths)
        self.feedback.content = self.feedback.content_w_resourcePaths

        # and each cloze flag field (strict, case, instant):
        flag_strict = inner.find(name='input', 
                attrs={'id' : re.compile('^clozelangFlag.*strictMarking$') })
        if flag_strict.attrMap['value']=="true":
            self._content.strictMarking = True
        flag_caps = inner.find(name='input', 
                attrs={'id' : re.compile('^clozelangFlag.*checkCaps$') })
        if flag_caps.attrMap['value']=="true":
            self._content.checkCaps = True
        flag_instant = inner.find(name='input', 
                attrs={'id' : re.compile('^clozelangFlag.*instantMarking$') })
        if flag_instant.attrMap['value']=="true":
            self._content.instantMarking = True
	flag_score = inner.find(name='input', 
                attrs={'id' : re.compile('^clozelangFlag.*showScore$') })
        if flag_score.attrMap['value']=="true":
            self._content.showScore = True

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

    def upgradeToVersion3(self):
        """
        Upgrades to v0.12
        """
        self._upgradeIdeviceToVersion2()
        self.systemResources += ["common.js"]
        
    def upgradeToVersion4(self):
        """
        Upgrades to v0.20.3
        """
        self.isCloze = True

    def upgradeToVersion5(self):
        self._content = ClozelangField(x_(u'Clozelang'), 
            x_(u"""<p>Enter the text for the cloze activity in to the cloze field 
by either pasting text from another source or by typing text directly into the 
field.</p><p> To select words to hide, double click on the word to select it and 
click on the Hide/Show Word button below.</p><p>Use pipe character | to define more than one correct answer. I.e.: dog|cat|bird</p>"""))
        self._content.idevice = self
# ===========================================================================
