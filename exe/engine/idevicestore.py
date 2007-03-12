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
The collection of iDevices available
"""

from exe.engine         import persist
from exe.engine.idevice import Idevice
from exe.engine.field   import TextAreaField, FeedbackField
from nevow.flat         import flatten

import imp
import sys
import logging

log = logging.getLogger(__name__)

# ===========================================================================
class IdeviceStore:
    """
    The collection of iDevices available
    """
    def __init__(self, config):
        """
        Initialize
        """
        self._nextIdeviceId = 0
        self.config         = config
        self.extended       = []
        self.generic        = []
        self.listeners      = []


    def getNewIdeviceId(self):
        """
        Returns an iDevice Id which is unique
        """
        id_ = unicode(self._nextIdeviceId)
        self._nextIdeviceId += 1
        return id_


    def getIdevices(self):
        """
        Get the idevices which are applicable for the current node of
        this package
        In future the idevices which are returned will depend
        upon the pedagogical template we are using
        """
        return self.extended + self.generic

    
    def delGenericIdevice(self, idevice):
        """
        Delete a generic idevice from idevicestore.
        """
        self.generic.remove(idevice)


    def register(self, listener):
        """
        Register a listener who is interested in changes to the
        IdeviceStore.  
        Created for IdevicePanes, but could be used by other objects
        """
        self.listeners.append(listener)


    def addIdevice(self, idevice):
        """
        Register another iDevice as available
        """
        log.debug("IdeviceStore.addIdevice")
        # idevice prototypes need to be in edit mode
        idevice.edit = True
        self.generic.append(idevice)
        for listener in self.listeners:
            listener.addIdevice(idevice)


    def load(self):
        """
        Load iDevices from the generic iDevices and the extended ones
        """
        log.debug("load iDevices")
        idevicesDir = self.config.configDir/'idevices'
        if not idevicesDir.exists():
            idevicesDir.mkdir()
        self.__loadExtended()
        self.__loadGeneric()


    def __loadExtended(self):
        """
        Load the Extended iDevices (iDevices coded in Python)
        """
        self.__loadUserExtended()

        from exe.engine.freetextidevice       import FreeTextIdevice
        from exe.engine.multimediaidevice     import MultimediaIdevice
        from exe.engine.reflectionidevice     import ReflectionIdevice
        from exe.engine.casestudyidevice      import CasestudyIdevice
        from exe.engine.truefalseidevice      import TrueFalseIdevice
        from exe.engine.imagewithtextidevice  import ImageWithTextIdevice
        from exe.engine.wikipediaidevice      import WikipediaIdevice
        from exe.engine.attachmentidevice     import AttachmentIdevice
        from exe.engine.titleidevice          import TitleIdevice
        from exe.engine.galleryidevice        import GalleryIdevice
        from exe.engine.clozeidevice          import ClozeIdevice
        from exe.engine.flashwithtextidevice  import FlashWithTextIdevice        
        from exe.engine.externalurlidevice    import ExternalUrlIdevice
        from exe.engine.imagemagnifieridevice import ImageMagnifierIdevice
        from exe.engine.mathidevice           import MathIdevice
        from exe.engine.multichoiceidevice    import MultichoiceIdevice        
        from exe.engine.rssidevice            import RssIdevice 
        from exe.engine.multiselectidevice    import MultiSelectIdevice
        from exe.engine.rawidevice            import RawIdevice

        self.extended.append(FreeTextIdevice())
        

        self.extended.append(MultichoiceIdevice())
                
        self.extended.append(ReflectionIdevice())
                
        self.extended.append(CasestudyIdevice())
        self.extended.append(TrueFalseIdevice())
        
        defaultImage = unicode(self.config.webDir/"images"/"sunflowers.jpg")
        self.extended.append(ImageWithTextIdevice(defaultImage))
        self.extended.append(ImageMagnifierIdevice(defaultImage))
        
        defaultImage = unicode(self.config.webDir/"images"/"sunflowers.jpg")
        defaultSite = 'http://%s.wikipedia.org/' % self.config.locale
        self.extended.append(WikipediaIdevice(defaultSite))
        self.extended.append(AttachmentIdevice())
        self.extended.append(GalleryIdevice())
        self.extended.append(ClozeIdevice())
        self.extended.append(FlashWithTextIdevice())
        self.extended.append(ExternalUrlIdevice())
        self.extended.append(MathIdevice())
        self.extended.append(MultimediaIdevice())
        self.extended.append(RssIdevice())
        self.extended.append(MultiSelectIdevice())
        self.extended.append(RawIdevice())

        # generate new ids for these iDevices, to avoid any clashes
        for idevice in self.extended:
            idevice.id = self.getNewIdeviceId()
  

    def __loadUserExtended(self):
        """
        Load the user-created extended iDevices which are in the idevices
        directory
        """
        idevicePath = self.config.configDir/'idevices'
        log.debug("load extended iDevices from "+idevicePath)
            
        if not idevicePath.exists():
            idevicePath.makedirs()
        sys.path = [idevicePath] + sys.path
        
        # Add to the list of extended idevices
        for path in idevicePath.listdir("*idevice.py"):
            log.debug("loading "+path)
            moduleName = path.basename().splitext()[0]
            module = __import__(moduleName, globals(), locals(), [])
            module.register(self)

        # Register the blocks for rendering the idevices
        for path in idevicePath.listdir("*block.py"):
            log.debug("loading "+path)
            moduleName = path.basename().splitext()[0]
            module = __import__(moduleName, globals(), locals(), [])
            module.register()


    def __loadGeneric(self):
        """
        Load the Generic iDevices from the appdata directory
        """
        genericPath = self.config.configDir/'idevices'/'generic.data'
        log.debug("load generic iDevices from "+genericPath)
        if genericPath.exists():
            self.generic = persist.decodeObject(genericPath.bytes())
            self.__upgradeGeneric()
        else:
            self.__createGeneric()


        # generate new ids for these iDevices, to avoid any clashes
        for idevice in self.generic:
            idevice.id = self.getNewIdeviceId()

    def __upgradeGeneric(self):
        """
        Upgrades/removes obsolete generic idevices from before
        """
        # We may have two reading activites,
        # one problably has the wrong title, 
        # the other is redundant
        readingActivitiesFound = 0
        for idevice in self.generic:
            if idevice.class_ == 'reading':
                if readingActivitiesFound == 0:
                    # Rename the first one we find
                    idevice.title = _(u"Reading Activity")
                else:
                    # Destroy the second
                    self.generic.remove(idevice)
                readingActivitiesFound += 1
                if readingActivitiesFound == 2:
                    break
        self.save()

    def __createGeneric(self):
        """
        Create the Generic iDevices which you get for free
        (not created using the iDevice editor, but could have been)
        Called when we can't find 'generic.data', generates an initial set of 
        free/builtin idevices and writes the new 'generic.data' file
        """
        from exe.engine.genericidevice import GenericIdevice

        readingAct = GenericIdevice(_(u"Reading Activity"), 
                                    u"reading",
                                    _(u"University of Auckland"), 
                                    x_(u"""<p>The Reading Activity will primarily 
be used to check a learner's comprehension of a given text. This can be done 
by asking the learner to reflect on the reading and respond to questions about 
the reading, or by having them complete some other possibly more physical task 
based on the reading.</p>"""),
                                    x_(u"<p>Teachers should keep the following "
                                        "in mind when using this iDevice: </p>"
                                        "<ol>"
                                        "<li>"
                                        "Think about the number of "
                                        "different types of activity "
                                        "planned for your resource that "
                                        "will be visually signalled in the "
                                        "content. Avoid using too many "
                                        "different types or classification "
                                        "of activities otherwise learner "
                                        "may become confused. Usually three "
                                        "or four different types are more "
                                        "than adequate for a teaching "
                                        "resource."
                                        "</li>"
                                        "<li>"
                                        "From a visual design "
                                        "perspective, avoid having two "
                                        "iDevices immediately following "
                                        "each other without any text in "
                                        "between. If this is required, "
                                        "rather collapse two questions or "
                                        "events into one iDevice. "
                                        "</li>"
                                        "<li>"
                                        "Think "
                                        "about activities where the "
                                        "perceived benefit of doing the "
                                        "activity outweighs the time and "
                                        "effort it will take to complete "
                                        "the activity. "
                                        "</li>"
                                        "</ol>")) 
        readingAct.emphasis = Idevice.SomeEmphasis
        readingAct.addField(TextAreaField(_(u"What to read"), 
_(u"""Enter the details of the reading including reference details. The 
referencing style used will depend on the preference of your faculty or 
department.""")))
        readingAct.addField(TextAreaField(_(u"Activity"), 
_(u"""Describe the tasks related to the reading learners should undertake. 
This helps demonstrate relevance for learners.""")))

        readingAct.addField(FeedbackField(_(u"Feedback"), 
_(u"""Use feedback to provide a summary of the points covered in the reading, 
or as a starting point for further analysis of the reading by posing a question 
or providing a statement to begin a debate.""")))

        self.generic.append(readingAct)
    
        objectives = GenericIdevice(_(u"Objectives"), 
                                    u"objectives",
                                    _(u"University of Auckland"), 
_(u"""Objectives describe the expected outcomes of the learning and should
define what the learners will be able to do when they have completed the
learning tasks."""), 
                                    u"")
        objectives.emphasis = Idevice.SomeEmphasis

        objectives.addField(TextAreaField(_(u"Objectives"),
_(u"""Type the learning objectives for this resource.""")))
        self.generic.append(objectives)

        preknowledge = GenericIdevice(_(u"Preknowledge"), 
                                      u"preknowledge",
                                      "", 
_(u"""Prerequisite knowledge refers to the knowledge learners should already
have in order to be able to effectively complete the learning. Examples of
pre-knowledge can be: <ul>
<li>        Learners must have level 4 English </li>
<li>        Learners must be able to assemble standard power tools </li></ul>
"""), u"")
        preknowledge.emphasis = Idevice.SomeEmphasis
        preknowledge.addField(TextAreaField(_(u"Preknowledge"), 
_(u"""Describe the prerequisite knowledge learners should have to effectively
complete this learning.""")))
        self.generic.append(preknowledge)
        
        activity = GenericIdevice(_(u"Activity"), 
                                  u"activity",
                                  _(u"University of Auckland"), 
_(u"""An activity can be defined as a task or set of tasks a learner must
complete. Provide a clear statement of the task and consider any conditions
that may help or hinder the learner in the performance of the task."""),
u"")
        activity.emphasis = Idevice.SomeEmphasis
        activity.addField(TextAreaField(_(u"Activity"),
_(u"""Describe the tasks the learners should complete.""")))
        self.generic.append(activity)

        self.save()


    def __createReading011(self):
        """
        Create the Reading Activity 0.11
        We do this only once when the user first runs eXe 0.11
        """
        from exe.engine.genericidevice import GenericIdevice

        readingAct = GenericIdevice(_(u"Reading Activity 0.11"), 
                                    u"reading",
                                    _(u"University of Auckland"), 
                                    x_(u"""<p>The reading activity, as the name 
suggests, should ask the learner to perform some form of activity. This activity 
should be directly related to the text the learner has been asked to read. 
Feedback to the activity where appropriate, can provide the learner with some 
reflective guidance.</p>"""),
                                    x_(u"Teachers should keep the following "
                                        "in mind when using this iDevice: "
                                        "<ol>"
                                        "<li>"
                                        "Think about the number of "
                                        "different types of activity "
                                        "planned for your resource that "
                                        "will be visually signalled in the "
                                        "content. Avoid using too many "
                                        "different types or classification "
                                        "of activities otherwise learner "
                                        "may become confused. Usually three "
                                        "or four different types are more "
                                        "than adequate for a teaching "
                                        "resource."
                                        "</li>"
                                        "<li>"
                                        "From a visual design "
                                        "perspective, avoid having two "
                                        "iDevices immediately following "
                                        "each other without any text in "
                                        "between. If this is required, "
                                        "rather collapse two questions or "
                                        "events into one iDevice. "
                                        "</li>"
                                        "<li>"
                                        "Think "
                                        "about activities where the "
                                        "perceived benefit of doing the "
                                        "activity outweighs the time and "
                                        "effort it will take to complete "
                                        "the activity. "
                                        "</li>"
                                        "</ol>")) 
        readingAct.emphasis = Idevice.SomeEmphasis
        readingAct.addField(TextAreaField(_(u"What to read"), 
_(u"""Enter the details of the reading including reference details. The 
referencing style used will depend on the preference of your faculty or 
department.""")))
        readingAct.addField(TextAreaField(_(u"Activity"), 
_(u"""Describe the tasks related to the reading learners should undertake. 
This helps demonstrate relevance for learners.""")))

        readingAct.addField(FeedbackField(_(u"Feedback"), 
_(u"""Use feedback to provide a summary of the points covered in the reading, 
or as a starting point for further analysis of the reading by posing a question 
or providing a statement to begin a debate.""")))
        self.generic.append(readingAct)
    
        objectives = GenericIdevice(_(u"Objectives"), 
                                    u"objectives",
                                    _(u"University of Auckland"), 
_(u"""Objectives describe the expected outcomes of the learning and should
define what the learners will be able to do when they have completed the
learning tasks."""), 
                                    u"")
        objectives.emphasis = Idevice.SomeEmphasis

        objectives.addField(TextAreaField(_(u"Objectives"),
_(u"""Type the learning objectives for this resource.""")))
        self.generic.append(objectives)

        preknowledge = GenericIdevice(_(u"Preknowledge"), 
                                      u"preknowledge",
                                      "", 
_(u"""Prerequisite knowledge refers to the knowledge learners should already
have in order to be able to effectively complete the learning. Examples of
pre-knowledge can be: <ul>
<li>        Learners must have level 4 English </li>
<li>        Learners must be able to assemble standard power tools </li></ul>
"""), u"")
        preknowledge.emphasis = Idevice.SomeEmphasis
        preknowledge.addField(TextAreaField(_(u"Preknowledge"), 
_(u"""Describe the prerequisite knowledge learners should have to effectively
complete this learning.""")))
        self.generic.append(preknowledge)
        
        activity = GenericIdevice(_(u"Activity"), 
                                  u"activity",
                                  _(u"University of Auckland"), 
_(u"""An activity can be defined as a task or set of tasks a learner must
complete. Provide a clear statement of the task and consider any conditions
that may help or hinder the learner in the performance of the task."""),
u"")
        activity.emphasis = Idevice.SomeEmphasis
        activity.addField(TextAreaField(_(u"Activity"),
_(u"""Describe the tasks the learners should complete.""")))
        self.generic.append(activity)

        self.save()


    def save(self):
        """
        Save the Generic iDevices to the appdata directory
        """
        idevicesDir = self.config.configDir/'idevices'
        if not idevicesDir.exists():
            idevicesDir.mkdir()
        fileOut = open(idevicesDir/'generic.data', 'wb')
        fileOut.write(persist.encodeObject(self.generic))

# ===========================================================================
