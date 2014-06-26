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
FPD - Multi Select Activity
A Multiple Select Idevice is one built up from Questions
"""

import logging
from exe.engine.persist   import Persistable
from exe.engine.idevice   import Idevice
from exe.engine.translate import lateTranslate
from exe.engine.field     import SelectQuestionField
import re
log = logging.getLogger(__name__)


class SeleccionmultiplefpdIdevice(Idevice):
    """
    A MultiSelect Idevice is one built up from question and options
    """
    
    persistenceVersion = 2

    def __init__(self):
        """
        Initialize 
        """
        Idevice.__init__(self,
                         x_(u"FPD - Multi Select Activity"),
                         x_(u"University of Auckland"),
                         x_(u"""Although more often used in formal testing 
situations MCQs can be used as a testing tool to stimulate thought and  
discussion on topics students may feel a little reticent in responding to. 

When designing a MCQ test consider the following:
<ul>
<li> What learning outcomes are the questions testing</li>
<li>    What intellectual skills are being tested</li>
<li> What are the language skills of the audience</li>
<li> Gender and cultural issues</li>
<li> Avoid grammar language and question structures that might provide 
     clues</li>
</ul>
 """), x_(u"""When building an MCQ consider the following: <ul>
<li> Use phrases that learners are familiar with and have 
encountered in their study </li>
<li> Keep responses concise </li>
<li> There should be some consistency between the stem and the responses </li>
<li> Provide enough options to challenge learners to think about their response
</li>
<li> Try to make sure that correct responses are not more detailed than the 
distractors </li>
<li> Distractors should be incorrect but plausible </li>
</ul>
"""), u"autoevaluacionfpd")
#        self.emphasis   = Idevice.SomeEmphasis
        self.emphasis   = "_autoevaluacionfpd"
        self.questions  = []
        self.addQuestion()
        self.systemResources += ["common.js"]
        

    def addQuestion(self):
        """
        Add a new question to this iDevice. 
        """
        question = SelectQuestionField(self, x_(u'Question'))
        question.addOption()
        self.questions.append(question)

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
        # MultiSelect Idevice:
        title = i.find(name='span', attrs={'class' : 'iDeviceTitle' })
        self.title = title.renderContents().decode('utf-8')

        inner = i.find(name='div', attrs={'class' : 'iDevice_inner' })
        # copied and modified from Multi-Choice:

        ms_questions = inner.findAll(name='div', attrs={'class' : 'question'})
        if len(ms_questions) < 1:
            # need to remove the default 1st question
            del self.questions[0]

        for question_num in range(len(ms_questions)):
            if question_num > 0:
                # only created with the first question, add others:
                self.addQuestion()

            question = ms_questions[question_num]

            questions = question.findAll(name='div', attrs={'class' : 'block' , 'id' : re.compile('^taquestion') })
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

            options = question.findAll(name='div', attrs={'class' : 'block' , 
                    'id' : re.compile('^taans') })
            answers = question.findAll(name='input', 
                    attrs={'type' : 'checkbox'})
            # multi-select only has 1 feedback per question:
            feedbacks = question.findAll(name='div', 
                    attrs={'id' : re.compile('^tafeedback') })
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
                #if not (even_score % 2):
                this_answer = answers[option_loop].attrMap['value']
                if this_answer == "True":
                    # then this option is correct:
                    self.questions[question_num].options[option_loop].isCorrect\
                            = True

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
        Delete icon from system resources
        """
        self._upgradeIdeviceToVersion3()

    def upgradeToVersion2(self):
        if self._title == u"FPD - Actividad de Seleccion Multiple":
            self._title = u"FPD - Multi Select Activity"
# ===========================================================================
