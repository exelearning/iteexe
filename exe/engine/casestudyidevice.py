# ===========================================================================
# eXe 
# Copyright 2004-2006, University of Auckland
# Copyright 2006-2007 eXe Project, New Zealand Tertiary Education Commission
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
from exe.engine.persist   import Persistable
from exe.engine.idevice   import Idevice
from exe.engine.field     import ImageField
from exe.engine.translate import lateTranslate
from exe.engine.path      import toUnicode
from exe                  import globals as G
from exe.engine.field     import TextAreaField
import os

log = logging.getLogger(__name__)

# Constants
DEFAULT_IMAGE = 'empty.gif'

# ===========================================================================
class Question(Persistable):
    """
    A Case iDevice is built up of question and options.  Each option can 
    be rendered as an XHTML element
    """
    persistenceVersion = 1
    def __init__(self, idevice):
        """
        Initialize 
        """
        self.questionTextArea = TextAreaField(u'', u'', u'')
        self.questionTextArea.idevice = idevice 

        self.feedbackTextArea = TextAreaField(u'', u'', u'')
        self.feedbackTextArea.idevice = idevice

    def setupImage(self, idevice):
        """
        Creates our image field: no longer needed for new content since 
        images are now embedded straight into the feedbackTextArea,
        but this routine is kept around for upgrade paths from old elps.
        """
        self.image = ImageField(x_(u"Image"),
                                x_(u"Choose an optional image to be shown to the student "
                                    "on completion of this question")) 
        self.image.idevice = idevice
        self.image.defaultImage = idevice.defaultImage
        self.image.isFeedback   = True

    def getResourcesField(self, this_resource):
        """
        implement the specific resource finding mechanism for this iDevice's
        Question object:
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
        return fields_list
        
        
    def upgradeToVersion1(self):
        """
        Upgrades to version 0.24
        """
        log.debug(u"Upgrading iDevice")
        self.image.isFeedback   = True
    

    def embedImageInFeedback(self):
        """
        Actually do the Converting of each question's
              CaseStudyIdevice's image -> embedded in its feedback field,
        now that its TextField can hold embeddded images.
        """

        new_content = ""

        # if no image resource even exists, then no need to continue:
        # is there a defined?
        if self.image is None or self.image.imageResource is None:
            return

        # likewise, only proceed if the image resource file is found:
        if not os.path.exists(self.image.imageResource.path) \
        or not os.path.isfile(self.image.imageResource.path):
            return

        # and if it's just the default blank image, then nothing to do either:
        if self.image.isDefaultImage:
            return

        # get the current image resource info:
        new_content += "<img src=\"resources/" \
                + self.image.imageResource.storageName + "\" "
        if self.image.height: 
            new_content += "height=\"" + self.image.height + "\" "
        if self.image.width: 
            new_content += "width=\"" + self.image.width + "\" "
        new_content += "/> \n"

        # prepend the new image content to any already existing feedback, 
        # using its content WITH the resources path:
        new_content += "<BR>\n"
        new_content += self.feedbackTextArea.content_w_resourcePaths
        self.feedbackTextArea.content_w_resourcePaths = new_content

        # set that to its default content:
        self.feedbackTextArea.content = \
                self.feedbackTextArea.content_w_resourcePaths

        # and massage its content for exporting without resource paths:
        self.feedbackTextArea.content_wo_resourcePaths = \
                self.feedbackTextArea.MassageContentForRenderView( \
                   self.feedbackTextArea.content_w_resourcePaths)

        # in passing GalleryImage into feedbackTextArea, a FieldWithResources,
        # the field needs to be sure to have an updated parentNode, 
        # courtesy of its idevice: 
        self.feedbackTextArea.setParentNode()
        # (note: FieldWithResources *usually* take care of this automatically
        # within ProcessPreviewedImages(), but here in this upgrade
        # path, we are bypassing the general purpose ProcessPreviewed().)

        # Not sure why this can't be imported up top, but it gives 
        # ImportError: cannot import name GalleryImages, 
        # so here it be: 
        from exe.engine.galleryidevice  import GalleryImage

        full_image_path = self.image.imageResource.path
        # note: unapplicable caption set to '' in the 2nd parameter:
        new_GalleryImage = GalleryImage(self.feedbackTextArea, \
                '',  full_image_path, mkThumbnail=False)

        # finally, go ahead and clear out the current image object,
        # which is best (and most safely) done by setting it back to default:
        self.image.setDefaultImage()
        
# ===========================================================================
class CasestudyIdevice(Idevice):
    """
    A multichoice Idevice is one built up from question and options
    """
    persistenceVersion = 8

    def __init__(self, story="", defaultImage=None):
        """
        Initialize 
        """
        Idevice.__init__(self,
                         x_(u"Case Study"),
                         x_(u"University of Auckland"), 
                         x_(u"""A case study is a device that provides learners 
with a simulation that has an educational basis. It takes a situation, generally 
based in reality, and asks learners to demonstrate or describe what action they 
would take to complete a task or resolve a situation. The case study allows 
learners apply their own knowledge and experience to completing the tasks 
assigned. when designing a case study consider the following:<ul> 
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
        
        self._storyInstruc = x_(u"""Create the case story. A good case is one 
that describes a controversy or sets the scene by describing the characters 
involved and the situation. It should also allow for some action to be taken 
in order to gain resolution of the situation.""")
        self.storyTextArea = TextAreaField(x_(u'Story:'), self._storyInstruc, story)
        self.storyTextArea.idevice = self


        self.questions    = []
        self._questionInstruc = x_(u"""Describe the activity tasks relevant 
to the case story provided. These could be in the form of questions or 
instructions for activity which may lead the learner to resolving a dilemma 
presented. """)
        self._feedbackInstruc = x_(u"""Provide relevant feedback on the 
situation.""")
        if defaultImage is None:
            defaultImage = G.application.config.webDir/'images'/DEFAULT_IMAGE
        self.defaultImage = toUnicode(defaultImage)
        self.addQuestion()

    # Properties
    storyInstruc    = lateTranslate('storyInstruc')
    questionInstruc = lateTranslate('questionInstruc')
    feedbackInstruc = lateTranslate('feedbackInstruc')
    storyInstruc    = lateTranslate('storyInstruc')
    questionInstruc = lateTranslate('questionInstruc')
    feedbackInstruc = lateTranslate('feedbackInstruc')
 
    def addQuestion(self):
        """
        Add a new question to this iDevice. 
        """
        self.questions.append(Question(self))

    def getResourcesField(self, this_resource):
        """
        implement the specific resource finding mechanism for this iDevice:
        """
        # be warned that before upgrading, this iDevice field could not exist:
        if hasattr(self, 'storyTextArea')\
        and hasattr(self.storyTextArea, 'images'):
            for this_image in self.storyTextArea.images:
                if hasattr(this_image, '_imageResource') \
                and this_resource == this_image._imageResource:
                    return self.storyTextArea

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
        if hasattr(self, 'storyTextArea'):
            fields_list.append(self.storyTextArea)

        for this_question in self.questions:
            fields_list.extend(this_question.getRichTextFields())

        return fields_list
        

    def upgradeToVersion1(self):
        """
        Upgrades the node from version 0 to 1.
        Old packages will loose their icons, but they will load.
        """
        log.debug(u"Upgrading iDevice")
        self.icon = "casestudy"
   

    def upgradeToVersion2(self):
        """
        Upgrades the node from 1 (v0.5) to 2 (v0.6).
        Old packages will loose their icons, but they will load.
        """
        log.debug(u"Upgrading iDevice")
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
        self._storyInstruc    = self.__dict__['storyInstruc']
        self._questionInstruc = self.__dict__['questionInstruc']
        self._feedbackInstruc = self.__dict__['feedbackInstruc']

    def upgradeToVersion5(self):
        """
        Upgrades to v0.12
        """
        self._upgradeIdeviceToVersion2()
        
    def upgradeToVersion6(self):
        """
        Upgrades for v0.18
        """
        self.defaultImage = toUnicode(G.application.config.webDir/'images'/DEFAULT_IMAGE)
        for question in self.questions:
            question.setupImage(self)

    def upgradeToVersion7(self):
        """
        Upgrades to somewhere before version 0.25 (post-v0.24)
        Taking the old unicode string fields, 
        and converting them into a image-enabled TextAreaFields:
        """
        self.storyTextArea = TextAreaField(x_(u'Story:'), 
                                 self._storyInstruc, self.story)
        self.storyTextArea.idevice = self
        for question in self.questions:
            question.questionTextArea = TextAreaField(u'', 
                                            u'', question.question)
            question.questionTextArea.idevice = self
            question.feedbackTextArea = TextAreaField(u'', 
                                            u'', question.feedback)
            question.feedbackTextArea.idevice = self

    def upgradeToVersion8(self):
        """
        Converting CaseStudyIdevice's image -> embedded image in its feedback
        field, a TextField than can now hold embedded images.

        BUT - due to the inconsistent loading of the objects via unpickling,
        since the resources aren't necessarily properly loaded and upgraded,
        NOR is the package necessarily, as it might not even have a list of
        resources yet, all of this conversion code must be done in an
        afterUpgradeHandler  
        (as perhaps should have been done for the previous upgradeToVersion7)
        """
        G.application.afterUpgradeHandlers.append(self.embedImagesInFeedback)

    def embedImagesInFeedback(self):
        """
        Loop through each question, to call their conversion:
              CaseStudyIdevice's image -> embedded in its feedback field,
        now that its TextField can hold embeddded images.
        """
        for question in self.questions:
            question.embedImageInFeedback()

# ===========================================================================
