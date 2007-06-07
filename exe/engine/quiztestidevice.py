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
A QuizTest Idevice is one built up from TestQuestions
"""

import logging
from exe.engine.persist   import Persistable
from exe.engine.idevice   import Idevice
from exe.engine.translate import lateTranslate
from exe.engine.field     import TextAreaField

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
                                         self._questionInstruc, x_(u''))
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
    #persistenceVersion = 6
    # r3m0, try:
    #persistenceVersion = 7
    ###### WHOAAAAH!!!!!!!
    # possible bugfix for Jim? the above SHOULD have been at 7 already!
    # so now:
    persistenceVersion = 8


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
        self.systemResources += ["common.js", "libot_drag.js"]
        

    def addQuestion(self):
        """
        Add a new question to this iDevice. 
        """
        self.questions.append(TestQuestion(self))


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
        # r3m0: note, the following doesn't appear to exist anymore,
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

## ===========================================================================
#def register(ideviceStore):
    #"""Register with the ideviceStore"""
    #ideviceStore.extended.append(QuizTestIdevice()) 
