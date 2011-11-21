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
A multichoice Idevice is one built up from question and options
"""

import logging
from twisted.spread       import jelly
from exe.engine.idevice   import Idevice
from exe.engine.field     import QuizQuestionField, QuizOptionField
from exe.engine.translate import lateTranslate
from exe                  import globals as G
import re
log = logging.getLogger(__name__)


# ===========================================================================
class Option(jelly.Jellyable):
    """
    A Multichoice iDevice is built up of question and options.  Each option can
    be rendered as an XHTML element
    """
    def __init__(self, answer="", isCorrect=False, feedback=""):
        """
        Initialize 
        """
        self.answer    = answer
        self.isCorrect = isCorrect
        self.feedback  = feedback

# ===========================================================================
class EleccionmultiplefpdIdevice(Idevice):
    """
    A multichoice Idevice is one built up from question and options
    """
    persistenceVersion = 7

    def __init__(self, question=""):
        """
        Initialize 
        """
        Idevice.__init__(self,
                         x_(u"FPD - Actividad de Eleccion Multiple"),
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
        self.questions        = []
        self.options          = []


        # question and hint appear to be left over, and no longer applicable,
        # since they are now on a per-question basis, and part of the child
        # QuizQuestionField, but here their old attributes remain:
        self.question         = ""
        self.hint             = ""
        # eventually: somebody should confirm this and remove them, will you?

        self._hintInstruc     = x_(u"""Enter a hint here. If you
do not want to provide a hint, leave this field blank.""")
        self._questionInstruc      = x_(u"""Enter the question stem. 
The quest should be clear and unambiguous. Avoid negative premises 
as these can tend to be ambiguous.""")
        self._keyInstruc      = x_(u"""Select the correct option by clicking 
on the radio button.""")
        self._answerInstruc   = x_(u"""Enter the available choices here. 
You can add options by clicking the "Add Another Option" button. Delete options 
by clicking the red "X" next to the Option.""")
        self._feedbackInstruc = x_(u"""Type in the feedback that you want the 
student to see when selecting the particular option. If you don't complete this 
box, eXe will automatically provide default feedback as follows: "Correct 
answer" as indicated by the selection for the correct answer; or "Wrong answer"
for the other options.""")
        self.systemResources += ["common.js", "libot_drag.js",
                                 "panel-amusements.png", "stock-stop.png"]
        self.message          = ""

        self.addQuestion()

    # Properties
    hintInstruc     = lateTranslate('hintInstruc')
    questionInstruc = lateTranslate('questionInstruc')
    keyInstruc      = lateTranslate('keyInstruc')
    answerInstruc   = lateTranslate('answerInstruc')
    feedbackInstruc = lateTranslate('feedbackInstruc')

        
    def addQuestion(self):
        """
        Add a new question to this iDevice. 
        """
        question = QuizQuestionField(self, x_(u'Question'))
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
        # Multi-choice Idevice:
        title = i.find(name='span', attrs={'class' : 'iDeviceTitle' })
        self.title = title.renderContents().decode('utf-8')

        inner = i.find(name='div', attrs={'class' : 'iDevice_inner' })
        # copied and modified from CaseStudy:

        mc_questions = inner.findAll(name='div', attrs={'class' : 'question'})
        if len(mc_questions) < 1:
            # need to remove the default 1st question
            del self.questions[0]

        for question_num in range(len(mc_questions)):
            if question_num > 0:
                # only created with the first question, add others:
                self.addQuestion()

            question = mc_questions[question_num]

            questions = question.findAll(name='div', 
                    attrs={'class' : 'block' , 
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


            hints = question.findAll(name='div', 
                    attrs={'class' : 'block' , 'id' : re.compile('^tahint') })
            if len(hints) == 1:
                # no warning otherwise, since hint is optional
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
                self.questions[question_num].hintTextArea.content = ""
                self.questions[question_num].hintTextArea.content_w_resourcePaths \
                        = ""
                self.questions[question_num].hintTextArea.content_wo_resourcePaths \
                        = ""
            options = question.findAll(name='div', 
                    attrs={'class' : 'block' , 'id' : re.compile('^taans') })
            feedbacks = question.findAll(name='div', 
                    attrs={'id' : re.compile('^sa') })
            # the feedbacks now have the correctness
            # of the option embedded as well, in the even_steven :-)
            #####
            # NOTE also that feedbacks will just have Correct or Wrong
            # (perhaps translated? but no divs, that's the important part!)
            # but if one was defined, it will appear in a div such as:
            # <div id="taf18_5" class="block" style="display:block">FB</div> 
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

                inner_feedback = feedbacks[option_loop].find(name='div', 
                        id=re.compile('^taf')) 
                if inner_feedback:
                    self.questions[question_num].options[option_loop].feedbackTextArea.content_wo_resourcePaths \
                            = inner_feedback.renderContents().decode('utf-8')
                    # and add the LOCAL resource paths back in:
                    self.questions[question_num].options[option_loop].feedbackTextArea.content_w_resourcePaths \
                            = self.questions[question_num].options[option_loop].feedbackTextArea.MassageResourceDirsIntoContent( \
                                self.questions[question_num].options[option_loop].feedbackTextArea.content_wo_resourcePaths)
                    self.questions[question_num].options[option_loop].feedbackTextArea.content \
                            = self.questions[question_num].options[option_loop].feedbackTextArea.content_w_resourcePaths
                else:
                    # no user-defined feedback, just using the default:
                    self.questions[question_num].options[option_loop].feedbackTextArea.content \
                            = ""
                    self.questions[question_num].options[option_loop].feedbackTextArea.content_w_resourcePaths \
                            = ""
                    self.questions[question_num].options[option_loop].feedbackTextArea.content_wo_resourcePaths \
                            = ""

                # and finally, see if this is a correct answer:
                even_score = int(feedbacks[option_loop].attrMap['even_steven'])
                if not (even_score % 2):
                    # i.e., if it IS even, then this is correct:
                    self.questions[question_num].options[option_loop].isCorrect \
                            = True

                            


    def upgradeToVersion1(self):
        """
        Called to upgrade from 0.4 release
        """
        self.hint  = ""
        self.icon  = "autoevaluacionfpd"
        self.__dict__['hintInstruc'] = \
                     x_(u"Enter a hint here. If you do not want to provide a "
                        u"hint, leave this field blank.")


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
        Upgrades to exe v0.10
        """
        self._upgradeIdeviceToVersion1()
        self._hintInstruc     = self.__dict__['hintInstruc']
        self._questionInstruc = self.__dict__['questionInstruc']
        self._keyInstruc      = self.__dict__['keyInstruc']
        self._answerInstruc   = self.__dict__['answerInstruc']
        self._feedbackInstruc = self.__dict__['feedbackInstruc']


    def upgradeToVersion6(self):
        """
        Upgrades to v0.12
        """
        self._upgradeIdeviceToVersion2()
        self.systemResources += ["common.js", "libot_drag.js",
                                 "panel-amusements.png", "stock-stop.png"]
        
    def upgradeToVersion7(self):
        """
        Upgrades to v0.19
        """
        self.questions = []
        length = len(self.options)
        if length >0:
            self.addQuestion()
            self.questions[0].hint = self.hint
            self.questions[0].question = self.question
            
            for i in range(1, length):
                self.questions[0].addOption()
                i += 1
            for i in range(0, length):
                self.questions[0].options[i].answer    = self.options[i].answer
                self.questions[0].options[i].feedback  = self.options[i].feedback
                self.questions[0].options[i].isCorrect = self.options[i].isCorrect
                self.questions[0].options[i].question  = self.questions[0]
                self.questions[0].options[i].idevice   = self
                i += 1
 
            self.question = ""
            self.options  = []
            self.hint     = ""

    def upgradeTo8SafetyCheck(self):
        """
        Handles the post-upgrade issues which require all of its child objects
        to have already been upgraded, not just this multichoiceidevice itself.
        But this is essentially a missing upgradeToVersion8 (as described in,
        and called by, its TwistedRePersist, to follow)
        """
        if not hasattr(self, 'questions'):
            # not sure why it wouldn't even have this, but define it:
            self.questions        = []
        if len(self.questions) == 0:
            # no question defined yet, nothing to upgrade there:
            return
        if not hasattr(self.questions[0], 'question'):
            # does NOT have a self.questions[0].question anymore 
            # -> already new enough. 
            return

        if (self.questions[0].question != 
                self.questions[0].questionTextArea.content):
            # .question is the original pre-upgrade string,
            # and .questionTextArea has been created to hold its content,
            # but is now created as the latest persistenceVersion,==1.
            # Therefore the actual data was not yet properly migrated
            # from .question to .questionTextArea, and this is caused by
            # forcing the upgrade call that we know to be needed:
            self.questions[0].upgradeToVersion1()

            # next up, ensure that each options has been properly upgraded:
            length = len(self.questions[0].options)
            if length >0:
                for i in range(0, length):
                    # note that even though it is an older multichoice,
                    # newer options could have been added, which might
                    # not have the .answer or .feedback:
                    if hasattr(self.questions[0].options[i], 'answer'):
                        # from the original self.options[i].answer
                        if (self.questions[0].options[i].answer != 
                            self.questions[0].options[i].answerTextArea): 
                            # As with .question -> .questionTextArea, .answer 
                            # was not yet properly migrated to .answerTextArea,
                            # and this is caused by forcing the upgrade call 
                            # that we know to be needed:
                            self.questions[0].options[i].upgradeToVersion1() 
                        # finally, delete the old answer: 
                        del self.questions[0].options[i].answer
                    if hasattr(self.questions[0].options[i], 'feedback'): 
                        # and finally, delete the old feedback: 
                        del self.questions[0].options[i].feedback

        # finally, delete the old question and hint:
        if hasattr(self.questions[0], 'question'):
            del self.questions[0].question
        if hasattr(self.questions[0], 'hint'):
            del self.questions[0].hint

    def TwistedRePersist(self):
        """
        Handles any post-upgrade issues 
        (such as typically re-persisting non-persistent data)
        In this case, this is to handle a MultiChoiceIdevice Upgrade case
        that slipped between the cracks....
        """
        # A missing upgrade path should have been implemented as 
        #    upgradeToVersion8
        # but it's now too late to put in a version8,
        # primarily because we have frozen our persistence versions:
        # as of v1.00, so that all >= v1.00 elps are compatible.

        # But rather than doing the missing upgrade right here, 
        # after multichoiceidevice itself has gone through its other upgrades,
        # we need to ensure that all of its related objects have also gone
        # through their upgrades.
        # So, put this as an afterUpgradeHandler:
        G.application.afterUpgradeHandlers.append(self.upgradeTo8SafetyCheck)


# ===========================================================================
