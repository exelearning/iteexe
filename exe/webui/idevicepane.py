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
from exe.webui                     import common
from exe.engine.freetextidevice    import FreeTextIdevice
from exe.engine.genericidevice     import GenericIdevice
from exe.engine.multichoiceidevice import MultichoiceIdevice
from exe.engine.reflectionidevice  import ReflectionIdevice

log = logging.getLogger(__name__)
_   = gettext.gettext

# TODO: at the moment we have to import the blocks as well as the iDevices
# so they are registered in the block factory
from exe.webui.freetextblock    import FreeTextBlock
from exe.webui.genericblock     import GenericBlock
from exe.webui.multichoiceblock import MultichoiceBlock
from exe.webui.reflectionblock  import ReflectionBlock


# ===========================================================================
class IdevicePane(object):
    """
    IdevicePane is responsible for creating the XHTML for iDevice links
    """
    def __init__(self):
        """ 
        Initialize
        """ 
        pass

    def process(self, request, package):
        """ 
        Process the request arguments to see if we're supposed to 
        add an iDevice
        """
        if ("action" in request.args and 
            request.args["action"][0] == "AddIdevice"):

            if request.args["object"][0] == "FreeTextIdevice":
                package.currentNode.addIdevice(FreeTextIdevice())

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
                package.currentNode.addIdevice(readingAct)
            
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
                package.currentNode.addIdevice(objectives)

            elif request.args["object"][0] == "PreknowledgeIdevice":
                preknowledge = GenericIdevice(_("Preknowledge"), 
                                              "preknowledge",
                                              "", 
_("""Prerequisite knowledge refers to the knowledge learners should already have in order to be able to effectively complete the learning. Examples of pre-knowledge can be: <ul>
<li>	Learners must have level 4 English </li>
<li>	Learners must be able to assemble standard power tools </li></ul>
"""), "")
                preknowledge.addField(_("Preknowledge"), 
                                      "TextArea", "preknowledge",
_("""Describe the prerequisite knowledge learners should have to effectively
complete this learning."""))
                
                package.currentNode.addIdevice(preknowledge)
            
            elif request.args["object"][0] == "CaseStudyIdevice":
                casestudy = GenericIdevice(_("Case Study"), 
                                           "activity-casestudy",
                                           "", 
_("""A case study is a story that conveys an educational message. A case study
can be used to present a realistic situation that enables learners to apply
their own knowledge and experience to.  When designing a case study you might
want to consider the following:<ul> 
<li>	What educational points are conveyed in the story</li>
<li>	What preparation will the learners need to do prior to working on the 
case study</li>
<li>	Where the case study fits into the rest of the course</li>
<li>	How the learners will interact with the materials and each other e.g.
if run in a classroom situation can teams be setup to work on different aspects
of the case and if so how are ideas feed back to the class</li></ul>"""), "")

                casestudy.addField(_("Story"),     "TextArea", "story",
_("""Create the case story.  A good case is one that describes a
controversy."""))

                casestudy.addField(_("Questions"), "TextArea", "questions",
_("""Enter the study question.  These questions should draw out the educational
messages presented in the case.  Consider aspects of the case like, characters,
timeliness, relevance, dilemmas."""))

                casestudy.addField(_("Feedback"),  "TextArea", "feedback",
_("""Provide feedback on the case.  This may be a summary of the main points or
concepts""")) 
                package.currentNode.addIdevice(casestudy)
            
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
                                          
                package.currentNode.addIdevice(activity)
                
            elif request.args["object"][0] == "MultichoiceIdevice":
                multichoice = MultichoiceIdevice()
                multichoice.addOption()
                package.currentNode.addIdevice(multichoice)
                
            elif request.args["object"][0] == "ReflectionIdevice":
                reflection = ReflectionIdevice()
                package.currentNode.addIdevice(reflection)
            
            
    def render(self):
        """
        Returns an XHTML string for viewing this pane
        """
        log.debug("render")
        
        html  = "<div>\n"
        html += common.submitLink("AddIdevice", "ActivityIdevice",
                                  _("Activity"))
        html += "<br/>\n"
        html += common.submitLink("AddIdevice", "CaseStudyIdevice",
                                  _("Case Study"))
        html += "<br/>\n"
        html += common.submitLink("AddIdevice", "FreeTextIdevice",
                                  _("Free Text"))
        html += "<br/>\n"
        html += common.submitLink("AddIdevice", "MultichoiceIdevice",
                                  _("Multichoice Question"))
        html += "<br/>\n"
        html += common.submitLink("AddIdevice", "ObjectivesIdevice",
                                  _("Objectives"))
        html += "<br/>\n"        
        html += common.submitLink("AddIdevice", "PreknowledgeIdevice",
                                  _("Preknowledge"))
        html += "<br/>\n"
        html += common.submitLink("AddIdevice", "ReadingActIdevice",
                                  _("Reading Activity"))
        html += "<br/>\n"        
        html += common.submitLink("AddIdevice", "ReflectionIdevice",
                                  _("Reflection"))
        html += "</div> \n"

        return html
        
    
# ===========================================================================
