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
The collection of iDevices available
"""

from exe.engine import persist
from exe.engine.path import Path
from exe.engine.idevice import Idevice
from exe.engine.field import TextField, TextAreaField, ImageField 

import logging
import gettext
_   = gettext.gettext

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
        # TODO I originally planned Extended and Generic iDevices to
        # be handled polymorphically, need to reconsider this
        self.config    = config
        self.extended  = []
        self.generic   = []
        self.listeners = []


    def getIdevices(self):
        """
        Get the idevices which are applicable for the current node of
        this package
        """
        # TODO: in future the idevices which are returned will depend
        # upon the pedagogical template we are using
        return self.extended + self.generic


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
        self.__loadExtended()
        self.__loadGeneric()


    def __loadExtended(self):
        """
        Load the Extended iDevices (iDevices coded in Python)
        """
        from exe.engine.freetextidevice       import FreeTextIdevice
        from exe.engine.multichoiceidevice    import MultichoiceIdevice
        from exe.engine.reflectionidevice     import ReflectionIdevice
        from exe.engine.casestudyidevice      import CasestudyIdevice
        from exe.engine.truefalseidevice      import TrueFalseIdevice
        from exe.engine.quiztestidevice       import QuizTestIdevice
        from exe.engine.teacherprofileidevice import TeacherProfileIdevice

        self.extended.append(FreeTextIdevice())
        
        multichoice = MultichoiceIdevice()
        multichoice.addOption()
        self.extended.append(multichoice)
                
        self.extended.append(ReflectionIdevice())
                
        self.extended.append(CasestudyIdevice())
        self.extended.append(TrueFalseIdevice())
        self.extended.append(QuizTestIdevice())

        defaultImage = self.config.webDir/"images"/"smileyface.png"
        self.extended.append(TeacherProfileIdevice(defaultImage))
  

    def __loadGeneric(self):
        """
        Load the Generic iDevices from the appdata directory
        """
        genericPath = self.config.configDir/'idevices'/'generic.data'
        log.debug("load generic iDevices from "+genericPath)
        if genericPath.exists():
            self.generic = persist.decodeObject(genericPath.bytes())

            # generate new ids for these iDevices, to avoid any clashes
            for idevice in self.generic:
                idevice.id = unicode(Idevice.nextId)
                Idevice.nextId += 1
        else:
            self.__createGeneric()
            self.save()

    def __createGeneric(self):
        """
        Create the Generic iDevices which you get for free
        (not created using the iDevice editor, but could have been)
        """
        from exe.engine.genericidevice import GenericIdevice

        readingAct = GenericIdevice(_(u"Reading Activity"), 
                                    u"reading",
                                    _(u"University of Auckland"), 
_(u"""Provide learners with structure to their reading activity. This helps put
the activity in context for the learner. It is also important to correctly
reference any reading materials you refer to as this models best practice to
the learners. Not always essential if covered in the course content but
providing feedback to the learner on some of the main points covered in the
reading may also add value to the activity."""), "") 
        readingAct.addField(TextAreaField(_(u"What to read"), 
_(u"""Provide details of the reading materials learners should  read.""")))
        readingAct.addField(TextAreaField(_(u"Why it should be read"), 
_(u"""Describe the rationale behind the selection of the reading and how it will
enrich the learning.""")))
        readingAct.addField(TextAreaField(_(u"Reference"), 
_(u"""Provide full reference details to the reading materials selected. The
reference style used will depend on the preference of your department or
faculty.""")))
        readingAct.addField(TextAreaField(_(u"Feedback"), 
_(u"""The use of this element is flexible.  Use it to provide a summary of the
points covered in the reading, or as a starting point for further analysis of
the reading by posing a question or providing a statement to begin a
debate.""")))
        self.generic.append(readingAct)
    
        objectives = GenericIdevice(_(u"Objectives"), 
                                    u"objectives",
                                    _(u"University of Auckland"), 
_(u"""Objectives describe the expected outcomes of the learning and should
define what the learners will be able to do when they have completed the
learning tasks."""), 
                                    _(u""))

        objectives.addField(TextAreaField(_(u"Objectives"),
_(u"""Type the learning objectives for this resource.""")))
        self.generic.append(objectives)

        preknowledge = GenericIdevice(_(u"Preknowledge"), 
                                      u"preknowledge",
                                      "", 
_(u"""Prerequisite knowledge refers to the knowledge learners should already
have in order to be able to effectively complete the learning. Examples of
pre-knowledge can be: <ul>
<li>	Learners must have level 4 English </li>
<li>	Learners must be able to assemble standard power tools </li></ul>
"""), "")
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
"")
        activity.addField(TextAreaField(_(u"Activity"),
_(u"""Describe the tasks the learners should complete.""")))
        self.generic.append(activity)


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
