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
                                            "", "", "")
                readingAct.addField(_("What to read"), 
                                    "TextArea", "reading_what")
                readingAct.addField(_("Why it should be read"), 
                                    "TextArea", "reading_why")
                readingAct.addField(_("Reference"), 
                                    "TextArea", "reading_reference")
                readingAct.addField(_("Feedback"), 
                                    "TextArea", "reading_feedback")
                package.currentNode.addIdevice(readingAct)
            
            elif request.args["object"][0] == "ObjectivesIdevice":
                objectives = GenericIdevice(_("Objectives"), 
                                            "objectives",
                                            _("University of Auckland"), 
                                            _("""The purpose of a learning objective is to inform the learners what they should be able to do after completing a specific part of the learning materials. Objectives do facilitate access to the learning content, and direct learners to what teachers consider important. However, they do have the disadvantage of potentially suppressing incidental learning."""), 
                                            _("""When thinking about learning objectives ask yourself: What must the learner be able to do after completing this course, section or unit? Think about the levels of difficulty for your objectives. It useful to distinguish between two levels: 1. The knowledge level (usually easy) and relates to facts, concepts. methods etc. 2. Knowledge plus application (more difficult), for instance applying, integrating or evaluating."""))

                objectives.addField(_("Objectives"), "TextArea", "objectives",
                                    _("""List the learning objectives for this section of the content."""))
                package.currentNode.addIdevice(objectives)

            elif request.args["object"][0] == "PreknowledgeIdevice":
                preknowledge = GenericIdevice(_("Preknowledge"), 
                                              "preknowledge",
                                              "", "", "")
                preknowledge.addField(_("Preknowledge"), 
                                      "TextArea", "preknowledge")
                package.currentNode.addIdevice(preknowledge)
            
            elif request.args["object"][0] == "CaseStudyIdevice":
                casestudy = GenericIdevice(_("Case Study"), 
                                           "activity-casestudy",
                                           "", "", "")
                casestudy.addField(_("CaseStudy"), "TextArea", "casestudy")
                package.currentNode.addIdevice(casestudy)
            
            elif request.args["object"][0] == "ActivityIdevice":
                activity = GenericIdevice(_("Activity"), 
                                          "activity",
                                          "", "", "")
                activity.addField(_("Activity"), "TextArea", "activity")
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
