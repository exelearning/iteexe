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
A Reflection Idevice presents question/s for the student to think about
before they look at the answer/s
"""

import logging
from exe.engine.idevice   import Idevice
from exe.engine.translate import lateTranslate
from exe.engine.field     import TextAreaField, Feedback2Field
from exe.engine.config import x_
import re
log = logging.getLogger(__name__)

# ===========================================================================
class ReflectionIdevice(Idevice):
    """
    A Reflection Idevice presents question/s for the student to think about
    before they look at the answer/s
    """
    persistenceVersion = 9
    
    def __init__(self, activity = "", answer = ""):
        """
        Initialize 
        """
        Idevice.__init__(self, 
                         x_("Reflection"),
                         x_("University of Auckland"), 
                         x_("""Reflection is a teaching method often used to 
connect theory to practice. Reflection tasks often provide learners with an 
opportunity to observe and reflect on their observations before presenting 
these as a piece of academic work. Journals, diaries, profiles and portfolios 
are useful tools for collecting observation data. Rubrics and guides can be 
effective feedback tools."""), "", "reflection")
        self.emphasis         = Idevice.SomeEmphasis
        self._activityInstruc = x_("""Enter a question for learners 
to reflect upon.""")
        self._answerInstruc   = x_("""Describe how learners will assess how 
they have done in the exercise (rubrics are useful devices for providing 
reflective feedback).""")
        self.systemResources += ["common.js"]
        
        self.activityTextArea = TextAreaField(x_('Reflective question:'), 
                                    self._activityInstruc, activity)
        self.activityTextArea.idevice = self

        self.answerTextArea = Feedback2Field(x_('Feedback:'), 
                                   self._answerInstruc, answer,'')
        self.answerTextArea.idevice = self

    # Properties
    activityInstruc = lateTranslate('activityInstruc')
    answerInstruc   = lateTranslate('answerInstruc')


    def getResourcesField(self, this_resource):
        """
        implement the specific resource finding mechanism for this iDevice:
        """ 
        # be warned that before upgrading, this iDevice field could not exist:
        if hasattr(self, 'activityTextArea')\
        and hasattr(self.activityTextArea, 'images'):
            for this_image in self.activityTextArea.images: 
                if hasattr(this_image, '_imageResource') \
                    and this_resource == this_image._imageResource: 
                        return self.activityTextArea

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
        if hasattr(self, 'activityTextArea'):
            fields_list.append(self.activityTextArea)
        if hasattr(self, 'answerTextArea'):
            fields_list.append(self.answerTextArea)

        return fields_list

    def burstHTML(self, i):
        """
        takes a BeautifulSoup fragment (i) and bursts its contents to 
        import this idevice from a CommonCartridge export
        """
        # Reflection Idevice:
        title = i.find(name='h2', attrs={'class' : 'iDeviceTitle' })
        self.title = title.renderContents().decode('utf-8')

        reflections = i.findAll(name='div', attrs={'id' : re.compile('^ta') })
        # should be exactly two of these:
        # 1st = field[0] == Activity
        if len(reflections) >= 1:
            self.activityTextArea.content_wo_resourcePaths = \
                    reflections[0].renderContents().decode('utf-8')
            # and add the LOCAL resource paths back in:
            self.activityTextArea.content_w_resourcePaths = \
                    self.activityTextArea.MassageResourceDirsIntoContent( \
                        self.activityTextArea.content_wo_resourcePaths)
            self.activityTextArea.content = \
                    self.activityTextArea.content_w_resourcePaths
            _btfeedBack= inner.find(name='input', attrs={'name' : re.compile('^toggle-feedback-') })
            self.answerTextArea.buttonCaption=_btfeedBack
        # 2nd = field[1] == Answer
        if len(reflections) >= 2:
            self.answerTextArea.content_wo_resourcePaths = \
                    reflections[1].renderContents().decode('utf-8')
            # and add the LOCAL resource paths back in:
            self.answerTextArea.content_w_resourcePaths = \
                    self.answerTextArea.MassageResourceDirsIntoContent( \
                        self.answerTextArea.content_wo_resourcePaths)
            self.answerTextArea.content = \
                    self.answerTextArea.content_w_resourcePaths
            _btfeedBack= inner.find(name='input', attrs={'name' : re.compile('^toggle-feedback-') })
            self.answerTextArea.buttonCaption=_btfeedBack

    def upgradeToVersion1(self):
        """
        Upgrades the node from version 0 to 1.
        """
        log.debug("Upgrading iDevice")
        self.icon       = "reflection"


    def upgradeToVersion2(self):
        """
        Upgrades the node from 1 (v0.5) to 2 (v0.6).
        Old packages will loose their icons, but they will load.
        """
        log.debug("Upgrading iDevice")
        self.emphasis = Idevice.SomeEmphasis

        
    def upgradeToVersion3(self):
        """
        Upgrades v0.6 to v0.7.
        """
        self.lastIdevice = False


    def upgradeToVersion4(self):
        """
        Upgrades to exe v0.10
        """
        self._upgradeIdeviceToVersion1()
        self._activityInstruc = self.__dict__['activityInstruc']
        self._answerInstruc   = self.__dict__['answerInstruc']
   

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
        self.systemResources += ["common.js"]


    def upgradeToVersion7(self):
        """ 
        Upgrades to somewhere before version 0.25 (post-v0.24) 
        Taking the old unicode string fields, and converting them 
        into image-enabled TextAreaFields:
        """
        self.activityTextArea = TextAreaField(x_('Reflective question:'), 
                                    self._activityInstruc, self.activity)
        self.activityTextArea.idevice = self
        self.answerTextArea = TextAreaField(x_('Feedback:'), 
                                  self._answerInstruc, self.answer)
        self.answerTextArea.idevice = self

    def upgradeToVersion8(self):
        """
        Delete icon from system resources
        """
        self._upgradeIdeviceToVersion3()
# ===========================================================================
