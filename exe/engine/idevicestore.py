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

#from exe.engine.config  import g_config

import os.path
from exe.engine import persist

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
        # TODO I originally planned Extended and Generic iDevices to
        # be handled polymorphically, need to reconsider this
        self.config   = config
        self.extended = []
        self.generic  = []
        self.listeners = []


    def getIdevices(self, package):
        """
        Get the idevices which are applicable for the current node of
        this package
        Sorted by title
        """
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
        self.loadExtended()
        self.loadGeneric()


    def loadExtended(self):
        from exe.engine.freetextidevice    import FreeTextIdevice
        from exe.engine.multichoiceidevice import MultichoiceIdevice
        from exe.engine.reflectionidevice  import ReflectionIdevice
        from exe.engine.casestudyidevice   import CasestudyIdevice
        from exe.engine.truefalseidevice   import TrueFalseIdevice
        from exe.engine.quiztestidevice    import QuizTestIdevice

        self.extended.append(FreeTextIdevice())
        
        multichoice = MultichoiceIdevice()
        multichoice.addOption()
        self.extended.append(multichoice)
                
        self.extended.append(ReflectionIdevice())
                
        self.extended.append(CasestudyIdevice())
        self.extended.append(TrueFalseIdevice())
        self.extended.append(QuizTestIdevice())
  

    def loadGeneric(self):
        """
        Load the Generic iDevices from the appdata directory
        """
        genericPath = self.config.appDataDir + "/idevices/generic.data"
        log.debug("load generic iDevices from "+genericPath)
        if os.path.exists(genericPath):
            fileIn = open(genericPath, "rb")
            self.generic = persist.decodeObject(fileIn.read())
        else:
            self.createGeneric()
            self.save()


    def createGeneric(self):
        from exe.engine.genericidevice import GenericIdevice

        readingAct = GenericIdevice(_("Reading Activity"), 
                                    "reading",
                                    _("University of Auckland"), 
_("""Provide learners with structure to their reading activity. This helps put
the activity in context for the learner. It is also important to correctly
reference any reading materials you refer to as this models best practice to
the learners. Not always essential if covered in the course content but
providing feedback to the learner on some of the main points covered in the
reading may also add value to the activity."""), 
                                     "") 
        readingAct.addField(_("What to read"), 
                            "TextArea", "reading_what",
_("""Provide details of the reading materials learners should  read."""))
        readingAct.addField(_("Why it should be read"), 
                            "TextArea", "reading_why",
_("""Describe the rationale behind the selection of the reading and how it will
enrich the learning."""))
        readingAct.addField(_("Reference"), 
                            "TextArea", "reading_reference",
_("""Provide full reference details to the reading materials selected. The
reference style used will depend on the preference of your department or
faculty."""))
        readingAct.addField(_("Feedback"), 
                            "TextArea", "reading_feedback",
_("""The use of this element is flexible.  Use it to provide a summary of the
points covered in the reading, or as a starting point for further analysis of
the reading by posing a question or providing a statement to begin a
debate."""))
        self.generic.append(readingAct)
    
        objectives = GenericIdevice(_("Objectives"), 
                                    "objectives",
                                    _("University of Auckland"), 
_("""Objectives describe the expected outcomes of the learning and should
define what the learners will be able to do when they have completed the
learning tasks."""), 
                                    _(""))

        objectives.addField(_("Objectives"), "TextArea", "objectives",
_("""Type the learning objectives for this resource."""))
        self.generic.append(objectives)

        preknowledge = GenericIdevice(_("Preknowledge"), 
                                      "preknowledge",
                                      "", 
_("""Prerequisite knowledge refers to the knowledge learners should already
have in order to be able to effectively complete the learning. Examples of
pre-knowledge can be: <ul>
<li>	Learners must have level 4 English </li>
<li>	Learners must be able to assemble standard power tools </li></ul>
"""), "")
        preknowledge.addField(_("Preknowledge"), 
                              "TextArea", "preknowledge",
_("""Describe the prerequisite knowledge learners should have to effectively
complete this learning."""))
        self.generic.append(preknowledge)
        
        activity = GenericIdevice(_("Activity"), 
                                  "activity",
                                  _("University of Auckland"), 
_("""An activity can be defined as a task or set of tasks a learner must
complete. Provide a clear statement of the task and consider any conditions
that may help or hinder the learner in the performance of the task."""),
"")
        activity.addField(_("Activity"), "TextArea", "activity",
_("""Describe the tasks the learners should complete."""))
        self.generic.append(activity)
                                  


    def save(self):
        """
        Save the Generic iDevices to the appdata directory
        """
        idevicesDir = self.config.appDataDir + "/idevices"
        if not os.path.exists(idevicesDir):
            os.mkdir(idevicesDir)
        fileOut = open(idevicesDir + "/generic.data", "wb")
        fileOut.write(persist.encodeObject(self.generic))



     

# ===========================================================================
