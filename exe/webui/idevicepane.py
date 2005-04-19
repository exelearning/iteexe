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
IdevicePane is responsible for creating the XHTML for iDevice links
"""

import logging
import gettext
from exe.engine.freetextidevice    import FreeTextIdevice
from exe.engine.genericidevice     import GenericIdevice
from exe.engine.multichoiceidevice import MultichoiceIdevice
from exe.engine.reflectionidevice  import ReflectionIdevice
from exe.engine.casestudyidevice   import CasestudyIdevice

log = logging.getLogger(__name__)
_   = gettext.gettext

# ===========================================================================
class IdevicePane(object):
    """
    IdevicePane is responsible for creating the XHTML for iDevice links
    """
    def __init__(self, package):
        """ 
        Initialize
        """ 
        self.package = package

    def process(self, request):
        """ 
        Process the request arguments to see if we're supposed to 
        add an iDevice
        """
        if ("action" in request.args and 
            request.args["action"][0] == "AddIdevice"):

            if request.args["object"][0] == "FreeTextIdevice":
                self.package.currentNode.addIdevice(FreeTextIdevice())

            elif request.args["object"][0] == "ReadingActIdevice":
                readingAct = GenericIdevice(_("Reading Activity"), 
                                            "activity-reading",
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
                self.package.currentNode.addIdevice(readingAct)
            
            elif request.args["object"][0] == "ObjectivesIdevice":
                objectives = GenericIdevice(_("Objectives"), 
                                            "objectives",
                                            _("University of Auckland"), 
_("""Objectives describe the expected outcomes of the learning and should
define what the learners will be able to do when they have completed the
learning tasks."""), 
                                            _(""))

                objectives.addField(_("Objectives"), "TextArea", "objectives",
_("""Type the learning objectives for this resource."""))
                self.package.currentNode.addIdevice(objectives)

            elif request.args["object"][0] == "PreknowledgeIdevice":
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
                
                self.package.currentNode.addIdevice(preknowledge)
            
            elif request.args["object"][0] == "ActivityIdevice":
                activity = GenericIdevice(_("Activity"), 
                                          "activity",
                                          _("University of Auckland"), 
_("""An activity can be defined as a task or set of tasks a learner must
complete. Provide a clear statement of the task and consider any conditions
that may help or hinder the learner in the performance of the task."""),
"")
                activity.addField(_("Activity"), "TextArea", "activity",
_("""Describe the tasks the learners should complete."""))
                                          
                self.package.currentNode.addIdevice(activity)
                
            elif request.args["object"][0] == "MultichoiceIdevice":
                multichoice = MultichoiceIdevice()
                multichoice.addOption()
                self.package.currentNode.addIdevice(multichoice)
                
            elif request.args["object"][0] == "ReflectionIdevice":
                reflection = ReflectionIdevice()
                self.package.currentNode.addIdevice(reflection)
                
            elif request.args["object"][0] == "CaseStudyIdevice":
                casestudy = CasestudyIdevice()
                self.package.currentNode.addIdevice(casestudy)
                
            elif request.args["object"][0] == "MultiModeIdevice":
                multiMode = GenericIdevice("", "multimode", "", "", "")
                multiMode.addField( "photoFile", "Photo", "image", "" )
                multiMode.addField( "caption", "Text", "nodeTitle", "" )
                multiMode.addField( "learningText", "TextArea", "learningText", 
                                    "" )
                multiMode.addField( "audioFile", "Audio", "audio", "" )
                self.package.currentNode.addIdevice( multiMode )
            
            
    def render(self):
        """
        Returns an XUL string for viewing this pane
        """
        log.debug("render")
        itemTemplate = ('  <listitem label="%s" '
                        """onclick="submitLink('AddIdevice', '%s', 1)"/>""")
        xul = ('<!-- iDevice Pane Start -->',
               '<listbox flex="1" style="background-color: #DFDFDF;">',
               itemTemplate % (_("Activity"), "ActivityIdevice"),
               itemTemplate % (_("Case Study"), "CaseStudyIdevice"),
               itemTemplate % (_("Free Text"), "FreeTextIdevice"),
               itemTemplate % (_("Multichoice Question"), "MultichoiceIdevice"),
               itemTemplate % (_("Objectives"), "ObjectivesIdevice"),
               itemTemplate % (_("Preknowledge"), "PreknowledgeIdevice"),
               itemTemplate % (_("Reading Activity"), "ReadingActIdevice"),
               itemTemplate % (_("Reflection"), "ReflectionIdevice"),
               itemTemplate % (_("Multi Mode"), "MultiModeIdevice"),
               '</listbox>',
               '<!-- iDevice Pane End -->',
              )
        return '\n'.join(xul) # Add in the newlines
        
    
# ===========================================================================
