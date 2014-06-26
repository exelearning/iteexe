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
FPD - True/False Activity
A true false idevice is one built up from question and options
"""

import logging
from exe.engine.persist   import Persistable
from exe.engine.idevice   import Idevice
from exe.engine.translate import lateTranslate
from exe.engine.field     import TextAreaField
import re
log = logging.getLogger(__name__)


# ===========================================================================
class TrueFalseQuestion(Persistable):
    """
    A TrueFalse iDevice is built up of questions.  Each question can
    be rendered as an XHTML element
    """

    def __init__(self, idevice, question="", isCorrect=False, feedback="", hint=""):
        """
        Initialize 
        """

        self.idevice = idevice
        self.questionTextArea = TextAreaField(x_(u'Question:'), 
                                    self.idevice.questionInstruc, question)
        self.questionTextArea.idevice = idevice
        self.isCorrect = isCorrect
        self.feedbackTextArea = TextAreaField(x_(u'Feedback'), 
                                    self.idevice.feedbackInstruc, feedback)
        self.feedbackTextArea.idevice = idevice
        self.hintTextArea = TextAreaField(x_(u'Hint'), 
                                self.idevice.hintInstruc, hint)
        self.hintTextArea.idevice = idevice


    def getResourcesField(self, this_resource):
        """
        implement the specific resource finding mechanism for this iDevice:
        """ 
        # be warned that before upgrading, this iDevice field could not exist:
        if hasattr(self, 'questionTextArea')\
        and hasattr(self.questionTextArea, 'images'):
            for this_image in self.questionTextArea.images: 
                if hasattr(this_image, '_imageResource') \
                    and this_resource == this_image._imageResource: 
                        return self.questionTextArea

        # be warned that before upgrading, this iDevice field could not exist:
        if hasattr(self, 'feedbackTextArea')\
        and hasattr(self.feedbackTextArea, 'images'):
            for this_image in self.feedbackTextArea.images: 
                if hasattr(this_image, '_imageResource') \
                    and this_resource == this_image._imageResource: 
                        return self.feedbackTextArea

        # be warned that before upgrading, this iDevice field could not exist:
        if hasattr(self, 'hintTextArea')\
        and hasattr(self.hintTextArea, 'images'):
            for this_image in self.hintTextArea.images: 
                if hasattr(this_image, '_imageResource') \
                    and this_resource == this_image._imageResource: 
                        return self.hintTextArea

        return None

    def getRichTextFields(self):
        """
        Like getResourcesField(), a general helper to allow nodes to search 
        through all of their fields without having to know the specifics of each
        iDevice type.  
        """
        fields_list = []
        if hasattr(self, 'questionTextArea'):
            fields_list.append(self.questionTextArea)
        if hasattr(self, 'feedbackTextArea'):
            fields_list.append(self.feedbackTextArea)
        if hasattr(self, 'hintTextArea'):
            fields_list.append(self.hintTextArea)

        return fields_list
                   

    def upgrade_setIdevice(self, idevice):
        """
        While some of this might typically be done in an automatic upgrade
        method called from in increased persistence version, the problem
        with that approach is that the idevice was not previously stored,
        and cannot easily be gotten at that stage of operation. 

        Rather than making such an upgrade method more messy than necessary,
        this method allows the parent TrueFalseIdevice to merely set
        itself on each of its TrueFalseQuestions during its own upgrade.

        Helps upgrade to somewhere before version 0.25 (post-v0.24),
        taking the old unicode string fields, 
        and converting them into a image-enabled TextAreaFields:
        """

        self.idevice = idevice
        self.questionTextArea = TextAreaField(x_(u'Question:'), 
                                    self.idevice.questionInstruc, self.question)
        self.questionTextArea.idevice = self.idevice
        self.feedbackTextArea = TextAreaField(x_(u'Feedback'), 
                                    self.idevice.feedbackInstruc, self.feedback)
        self.feedbackTextArea.idevice = self.idevice
        self.hintTextArea = TextAreaField(x_(u'Hint'), 
                                self.idevice.hintInstruc, self.hint)
        self.hintTextArea.idevice = self.idevice

# ===========================================================================
class VerdaderofalsofpdIdevice(Idevice):
    """
    A TrueFalse Idevice is one built up from question and options
    """
    persistenceVersion = 12

    def __init__(self):
        """
        Initialize 
        """
        Idevice.__init__(self,
                         x_(u"FPD - True/False Activity"),
                         x_(u"University of Auckland"),
                         x_(u"""True/false questions present a statement where 
the learner must decide if the statement is true. This type of question works 
well for factual information and information that lends itself to either/or 
responses."""), u"", u"autoevaluacionfpd")
#        self.emphasis   = Idevice.SomeEmphasis
        self.emphasis   = "_autoevaluacionfpd"
        self._hintInstruc     = x_(u"""A hint may be provided to assist the 
learner in answering the question.""")
        self.questions        = []
        self._questionInstruc = x_(u"""Type the question stem. The question 
should be clear and unambiguous. Avoid negative premises as these can tend to 
be ambiguous.""")
        self._keyInstruc      = ""
        self._feedbackInstruc = x_(u"""Enter any feedback you wish to provide 
to the learner. This field may be left blank. if this field is left blank 
default feedback will be provided.""")
        self.questions.append(TrueFalseQuestion(self))
        self.systemResources += ["common.js", "panel-amusements.png", "stock-stop.png"]
        self.instructionsForLearners = TextAreaField(
            x_(u'Instructions'),
            x_(u"""Provide instruction on how the True/False Question should be 
completed."""),
            u'')
                
        self.instructionsForLearners.idevice = self
        

    # Properties
    hintInstruc     = lateTranslate('hintInstruc')
    questionInstruc = lateTranslate('questionInstruc')
    keyInstruc      = lateTranslate('keyInstruc')
    feedbackInstruc = lateTranslate('feedbackInstruc')


    def addQuestion(self):
        """
        Add a new question to this iDevice. 
        """
        self.questions.append(TrueFalseQuestion(self))


    def getResourcesField(self, this_resource):
        """
        implement the specific resource finding mechanism for this iDevice:
        """ 
        # be warned that before upgrading, this iDevice field could not exist:
        if hasattr(self, 'instructionsForLearners')\
        and hasattr(self.instructionsForLearners, 'images'):
            for this_image in self.instructionsForLearners.images: 
                if hasattr(this_image, '_imageResource') \
                    and this_resource == this_image._imageResource: 
                        return self.instructionsForLearners

        for this_question in self.questions:
            this_field = this_question.getResourcesField(this_resource)
            if this_field is not None:
                return this_field

        return None

    def getRichTextFields(self):
        """
        Like getResourcesField(), a general helper to allow nodes to search 
        through all of their fields without having to know the specifics of each
        iDevice type.  
        """
        fields_list = []
        if hasattr(self, 'instructionsForLearners'):
            fields_list.append(self.instructionsForLearners)

        for this_question in self.questions:
            fields_list.extend(this_question.getRichTextFields())

        return fields_list


    def burstHTML(self, i):
        """
        takes a BeautifulSoup fragment (i) and bursts its contents to 
        import this idevice from a CommonCartridge export
        """
        # True-False Idevice:
        title = i.find(name='span', attrs={'class' : 'iDeviceTitle' })
        self.title = title.renderContents().decode('utf-8')

        inner = i.find(name='div', attrs={'class' : 'iDevice_inner' })

        instruct = inner.find(name='div', attrs={'class' : 'block' , 
                'style' : 'display:block' })
        self.instructionsForLearners.content_wo_resourcePaths = \
                instruct.renderContents().decode('utf-8')
        # and add the LOCAL resource paths back in:
        self.instructionsForLearners.content_w_resourcePaths = \
                self.instructionsForLearners.MassageResourceDirsIntoContent( \
                    self.instructionsForLearners.content_wo_resourcePaths)
        self.instructionsForLearners.content = \
                self.instructionsForLearners.content_w_resourcePaths

        # copied and modified from Multi-Select, and others :-) :

        tf_questions = inner.findAll(name='div', attrs={'class' : 'question'})
        if len(tf_questions) < 1:
            # need to remove the default 1st question
            del self.questions[0]

        for question_num in range(len(tf_questions)):
            if question_num > 0:
                # only created with the first question, add others:
                self.addQuestion()

            question = tf_questions[question_num]

            questions = question.findAll(name='div', attrs={'class' : 'block', 
                    'id' : re.compile('^taquestion') })
            if len(questions) == 1:
                # ELSE: should warn of unexpected result!
                inner_question = questions[0]
                self.questions[question_num].questionTextArea.content_wo_resourcePaths \
                        = inner_question.renderContents().decode('utf-8')
                # and add the LOCAL resource paths back in:
                self.questions[question_num].questionTextArea.content_w_resourcePaths \
                        = self.questions[question_num].questionTextArea.MassageResourceDirsIntoContent( \
                            self.questions[question_num].questionTextArea.content_wo_resourcePaths)
                self.questions[question_num].questionTextArea.content = \
                        self.questions[question_num].questionTextArea.content_w_resourcePaths

            answer_true = question.find(name='div', 
                    attrs={'id' : re.compile('^s0b') })
            answer_false = question.find(name='div', 
                    attrs={'id' : re.compile('^s1b') })
            # true-false only has 1 feedback per question:
            feedbacks = question.findAll(name='div', 
                    attrs={'id' : re.compile('^sfb') })
            # true-false only has 1 hint per question:
            hints = question.findAll(name='div', 
                    attrs={'id' : re.compile('^tahint') })

            # and finally, see if this is a correct answer:
            even_score = int(answer_true.attrMap['even_steven'])
            if not (even_score % 2):
                # i.e., if it IS even, then this is correct:
                self.questions[question_num].isCorrect = True

            if len(hints) >= 1:
                inner_hint = hints[0]
                self.questions[question_num].hintTextArea.content_wo_resourcePaths \
                        = inner_hint.renderContents().decode('utf-8')
                # and add the LOCAL resource paths back in:
                self.questions[question_num].hintTextArea.content_w_resourcePaths \
                        = self.questions[question_num].hintTextArea.MassageResourceDirsIntoContent( \
                            self.questions[question_num].hintTextArea.content_wo_resourcePaths)
                self.questions[question_num].hintTextArea.content = \
                        self.questions[question_num].hintTextArea.content_w_resourcePaths
            else:
                # no user-defined feedback, just using the default:
                self.questions[question_num].hintTextArea.content = ""
                self.questions[question_num].hintTextArea.content_w_resourcePaths \
                        = ""
                self.questions[question_num].hintTextArea.content_wo_resourcePaths \
                        = ""


            if len(feedbacks) >= 1:
                inner_feedback = feedbacks[0]
                self.questions[question_num].feedbackTextArea.content_wo_resourcePaths \
                        = inner_feedback.renderContents().decode('utf-8')
                # and add the LOCAL resource paths back in:
                self.questions[question_num].feedbackTextArea.content_w_resourcePaths \
                        = self.questions[question_num].feedbackTextArea.MassageResourceDirsIntoContent( \
                            self.questions[question_num].feedbackTextArea.content_wo_resourcePaths)
                self.questions[question_num].feedbackTextArea.content = \
                        self.questions[question_num].feedbackTextArea.content_w_resourcePaths
            else:
                # no user-defined feedback, just using the default:
                self.questions[question_num].feedbackTextArea.content = ""
                self.questions[question_num].feedbackTextArea.content_w_resourcePaths \
                        = ""
                self.questions[question_num].feedbackTextArea.content_wo_resourcePaths \
                        = ""


    def upgradeToVersion1(self):
        """
        Upgrades the node from version 0 to 1.
        Old packages will loose their icons, but they will load.
        """
        log.debug(u"Upgrading iDevice")
        self.icon = u"autoevaluacionfpd"


    def upgradeToVersion2(self):
        """
        Upgrades the node from 1 (v0.5) to 2 (v0.6).
        Old packages will loose their icons, but they will load.
        """
        log.debug(u"Upgrading iDevice")
#        self.emphasis   = Idevice.SomeEmphasis
        self.emphasis   = "_autoevaluacionfpd"
        

    def upgradeToVersion3(self):
        """
        Upgrades the node from 1 (v0.6) to 2 (v0.7).
        Change icon from 'multichoice' to 'question'
        """
        log.debug(u"Upgrading iDevice icon")
        self.icon = "autoevaluacionfpd"


    def upgradeToVersion4(self):
        """
        Upgrades v0.6 to v0.7.
        """
        self.lastIdevice = False

    def upgradeToVersion5(self):
        """
        Upgrades exe to v0.10
        """
        self._upgradeIdeviceToVersion1()
        self._hintInstruc = self.__dict__['hintInstruc']
        self._questionInstruc = self.__dict__['questionInstruc']
        self._keyInstruc = self.__dict__['keyInstruc']

    def upgradeToVersion6(self):
        """
        Upgrades exe to v0.11
        """
        self._feedbackInstruc = x_(u"""Type in the feedback that you want the 
student to see when selecting the particular question. If you don't complete
this box, eXe will automatically provide default feedback as follows: 
"Correct answer" as indicated by the selection for the correct answer; or 
"Wrong answer" for the other alternatives.""")

    def upgradeToVersion7(self):
        """
        Upgrades to v0.12
        """
        self._upgradeIdeviceToVersion2()        
        self.systemResources += ["common.js", "libot_drag.js",
                                 "panel-amusements.png", "stock-stop.png"]
        
    def upgradeToVersion8(self):
        """
        Upgrades to v0.15
        """
        self.instructionsForLearners = TextAreaField(
            x_(u'Instructions'),
            x_(u"""Provide instruction on how the True/False Question should be 
completed."""),
            x_(u'Read the paragraph below and '
                'fill in the missing words.'))
        self.instructionsForLearners.idevice = self
   

    def upgradeToVersion9(self):
        """ 
        Upgrades to somewhere before version 0.25 (post-v0.24) 
        Taking the TrueFalseQuestions' old unicode string fields, 
        and converting them into a image-enabled TextAreaFields:
        """
        for question in self.questions: 
            question.upgrade_setIdevice(self)

    def upgradeToVersion10(self):
        if "libot_drag.js" in self.systemResources:
            self.systemResources.remove("libot_drag.js")

    def upgradeToVersion11(self):
        """
        Delete icon from system resources
        """
        self._upgradeIdeviceToVersion3()

    def upgradeToVersion12(self):
        if self._title == u"FPD - Actividad de Verdadero/Falso":
            self._title = u"FPD - True/False Activity"
# ===========================================================================
