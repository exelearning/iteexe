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
A QuizTest Idevice is one built up from TestQuestions
"""

import logging
from exe.engine.persist   import Persistable
from exe.engine.idevice   import Idevice
from exe.engine.translate import lateTranslate
from exe.engine.field     import TextAreaField
import re

log = logging.getLogger(__name__)


# ===========================================================================
class AnswerOption(Persistable):
    """
    A TestQuestion is built up of question and AnswerOptions.  Each
    answerOption can be rendered as an XHTML element
    """

    def __init__(self, question, idevice, answer="", isCorrect=False):
        """
        Initialize 
        """
        self.question = question
        self.idevice = idevice

        self.answerTextArea  = TextAreaField(x_(u'Option'),
                                   self.question._optionInstruc,
                                   answer)
        self.answerTextArea.idevice = idevice

        self.isCorrect = isCorrect

    def getResourcesField(self, this_resource):
        """
        implement the specific resource finding mechanism for this iDevice:
        """ 
        # be warned that before upgrading, this iDevice field could not exist:
        if hasattr(self, 'answerTextArea')\
        and hasattr(self.answerTextArea, 'images'):
            for this_image in self.answerTextArea.images: 
                if hasattr(this_image, '_imageResource') \
                and this_resource == this_image._imageResource: 
                    return self.answerTextArea

        return None

    def getRichTextFields(self):
        """
        Like getResourcesField(), a general helper to allow nodes to search 
        through all of their fields without having to know the specifics of each
        iDevice type.  
        """
        fields_list = []
        if hasattr(self, 'answerTextArea'):
            fields_list.append(self.answerTextArea)

        return fields_list

    def upgrade_setIdevice(self, idevice, question):
        """
        While some of this might typically be done in an automatic upgrade
        method called from in increased persistence version, the problem
        with that approach is that the idevice was not previously stored,
        and cannot easily be gotten at that stage of operation. 

        Rather than making such an upgrade method more messy than necessary,
        this method allows the parent TestQuestion to merely set
        itself on each of its AnswerOptions during its own upgrade.

        Helps upgrade to somewhere before version 0.25 (post-v0.24),
        taking the old unicode string fields, 
        and converting them into a image-enabled TextAreaFields:
        """
        self.idevice = idevice
        self.question = question
        self.answerTextArea    = TextAreaField(x_(u'Option'), 
                                     self.question._optionInstruc, 
                                     self.answer)
        self.answerTextArea.idevice = self.idevice

# ===========================================================================
class TestQuestion(Persistable):
    """
    A TestQuestion is built up of question and AnswerOptions.
    """
    
    persistenceVersion = 3
    
    def __init__(self, idevice, question=""):
        """
        Initialize 
        """
        self.idevice              = idevice

        self.options              = []
        self.correctAns           = -2
        self.userAns              = -1
        self._questionInstruc      = x_(u"""Enter the question stem. 
The quest should be clear and unambiguous. Avoid negative premises 
as these can tend to be ambiguous.""")
        self._optionInstruc        = x_(u"""Enter an answer option. Provide 
a range of plausible distractors (usually 3-4) as well as the correct answer. 
Click on the &lt;Add another option&gt; button to add another answer.""")
        self._correctAnswerInstruc = x_(u"""To indicate the correct answer, 
click the radio button next to the correct option.""")
    
        self.questionTextArea      = TextAreaField(x_(u'Question:'),
                                         self._questionInstruc, u'')
        self.questionTextArea.idevice = self.idevice

        self.addOption()
    
    # Properties
    questionInstruc      = lateTranslate('questionInstruc')
    optionInstruc        = lateTranslate('optionInstruc')
    correctAnswerInstruc = lateTranslate('correctAnswerInstruc')
    
    def addOption(self):
        """
        Add a new option to this question. 
        """
        self.options.append(AnswerOption(self, self.idevice))
       

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

        for this_option in self.options:
            this_field = this_option.getResourcesField(this_resource)
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
        if hasattr(self, 'questionTextArea'):
            fields_list.append(self.questionTextArea)

        for this_option in self.options:
            fields_list.extend(this_option.getRichTextFields())

        return fields_list


    def upgradeToVersion1(self):
        """
        Upgrades to v 0.13
        """
        self._optionInstruc = x_(u"""Enter an answer option. Provide 
a range of plausible distractors (usually 3-4) as well as the correct answer. 
Click on the &lt;Add another option&gt; button to add another answer.""")
        
    def upgradeToVersion2(self):
        """
        Upgrades to v 0.13
        """
        self._questionInstruc= x_(u"""Enter the question stem. 
The quest should be clear and unambiguous. Avoid negative premises 
as these can tend to be ambiguous.""")

    def upgradeToVersion3(self):
        """
        Upgrades to v 0.13
        """
        self._correctAnswerInstruc = x_(u"""To indicate the correct answer, 
click the radio button next to the correct option.""")

    def upgrade_setIdevice(self, idevice):
        """
        While some of this might typically be done in an automatic upgrade
        method called from in increased persistence version, the problem
        with that approach is that the idevice was not previously stored,
        and cannot easily be gotten at that stage of operation. 

        Rather than making such an upgrade method more messy than necessary,
        this method allows the parent TestQuestionIdevice to merely set
        itself on each of its TestQuestions during its own upgrade.

        Helps upgrade to somewhere before version 0.25 (post-v0.24),
        taking the old unicode string fields, 
        and converting them into a image-enabled TextAreaFields:
        """
        self.idevice = idevice
        self.questionTextArea    = TextAreaField(x_(u'Question:'), 
                                     self._questionInstruc, 
                                     self.question)
        self.questionTextArea.idevice = self.idevice

        # and then, need to propagate the same upgrades 
        # down through each of the options:
        for option in self.options:
            option.upgrade_setIdevice(self.idevice, self)

# ===========================================================================
class QuizTestIdevice(Idevice):
    """
    A QuizTestIdevice Idevice is one built up from question and options
    """
    persistenceVersion = 10


    def __init__(self):
        """
        Initialize 
        """
        Idevice.__init__(self,
                         x_(u"SCORM Quiz"),
                         x_(u"University of Auckland"),
                         x_(u"""Unlike the MCQ the SCORM quiz is used to test 
the learners knowledge on a topic without providing the learner with feedback 
to the correct answer. The quiz will often be given once the learner has had 
time to learn and practice using the information or skill.
 """), u"", "question")
        self.isQuiz     = True
        self.emphasis   = Idevice.SomeEmphasis
        self.score      = -1 
        self.isAnswered = True
        self.passRate   = "50"
        self.questions  = []
        self.addQuestion()
        self.systemResources += ["common.js"]
        

    def addQuestion(self):
        """
        Add a new question to this iDevice. 
        """
        self.questions.append(TestQuestion(self))

    def getResourcesField(self, this_resource):
        """
        implement the specific resource finding mechanism for this iDevice:
        """
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

        for this_question in self.questions:
            fields_list.extend(this_question.getRichTextFields())

        return fields_list

    def burstHTML(self, i):
        """
        takes a BeautifulSoup fragment (i) and bursts its contents to 
        import this idevice from a CommonCartridge export
        """
        # SCORM QuizTest Idevice:
        title = i.find(name='h2', attrs={'class' : 'iDeviceTitle' })
        self.title = title.renderContents().decode('utf-8')

        inner = i.find(name='div', attrs={'class' : 'iDevice_inner' })

        passrate = inner.find(name='div', attrs={'class' : 'passrate' })
        self.passRate = passrate.attrMap['value'].decode('utf-8')

        # copied and modified from Multi-Select:

        sc_questions = inner.findAll(name='div', attrs={'class' : 'question'})
        if len(sc_questions) < 1:
            # need to remove the default 1st question
            del self.questions[0]

        for question_num in range(len(sc_questions)):
            if question_num > 0:
                # only created with the first question, add others:
                self.addQuestion()

            question = sc_questions[question_num]

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
                self.questions[question_num].questionTextArea.content \
                        = self.questions[question_num].questionTextArea.content_w_resourcePaths

            options = question.findAll(name='div', attrs={'class' : 'block', 
                    'id' : re.compile('^taoptionAnswer') })
            answers = question.findAll(name='input', attrs={'type' : 'radio'})
            if len(options) < 1:
                # need to remove the default 1st option
                del self.questions[question_num].options[0]

            for option_loop in range(0, len(options)):
                if option_loop >= 1:
                    # more options than created by default:
                    self.questions[question_num].addOption()

                self.questions[question_num].options[option_loop].answerTextArea.content_wo_resourcePaths \
                        = options[option_loop].renderContents().decode('utf-8')
                # and add the LOCAL resource paths back in:
                self.questions[question_num].options[option_loop].answerTextArea.content_w_resourcePaths \
                        = self.questions[question_num].options[option_loop].answerTextArea.MassageResourceDirsIntoContent( \
                            self.questions[question_num].options[option_loop].answerTextArea.content_wo_resourcePaths)
                self.questions[question_num].options[option_loop].answerTextArea.content \
                        = self.questions[question_num].options[option_loop].answerTextArea.content_w_resourcePaths
                # and finally, see if this is a correct answer:
                this_answer = answers[option_loop].attrMap['value']
                if this_answer == "0":
                    # then this option is correct:
                    self.questions[question_num].options[option_loop].isCorrect\
                            = True
                    # and SCORM quiz also has an overall correctAnswer;
                    # since it only allows one answer, this must be it:
                    self.questions[question_num].correctAns = option_loop


    def upgradeToVersion2(self):
        """
        Upgrades the node from 1 (v0.5) to 2 (v0.6).
        Old packages will loose their icons, but they will load.
        """
        log.debug(u"Upgrading iDevice")
        self.emphasis = Idevice.SomeEmphasis
        

    def upgradeToVersion3(self):
        """
        Upgrades the node from 1 (v0.6) to 2 (v0.7).
        Change icon from 'multichoice' to 'question'
        """
        log.debug(u"Upgrading iDevice icon")
        self.icon = "question"

        
    def upgradeToVersion4(self):
        """
        Upgrades v0.6 to v0.7.
        """
        self.lastIdevice = False

   
    def upgradeToVersion5(self):
        """
        Upgrades to exe v0.10
        """
        self._upgradeIdeviceToVersion1()
  

    def upgradeToVersion6(self):
        """
        Upgrades to v0.12
        """
        self._upgradeIdeviceToVersion2()      
        self.systemResources += ["common.js", "libot_drag.js"]


    def upgradeToVersion7(self):
        """
        Upgrades to v0.14
        """
        # Note: the following routine doesn't appear to exist anymore,
        # so now that the persistence version is finally upgrading to 7,
        # (and then, actually on to 8) this is no longer works, go figure!
        #####
        #self._upgradeIdeviceToVersion3()      
        ####

        self.isQuiz = True

    def upgradeToVersion8(self):
        """ 
        Upgrades to somewhere before version 0.25 (post-v0.24) 
        Taking the TestQuestions' old unicode string fields, 
        and converting them into a image-enabled TextAreaFields:
        """
        for question in self.questions:
            question.upgrade_setIdevice(self)

    def upgradeToVersion9(self):
        if "libot_drag.js" in self.systemResources:
            self.systemResources.remove("libot_drag.js")

    def upgradeToVersion10(self):
        """
        Delete icon from system resources
        """
        self._upgradeIdeviceToVersion3()
## ===========================================================================
#def register(ideviceStore):
    #"""Register with the ideviceStore"""
    #ideviceStore.extended.append(QuizTestIdevice()) 
