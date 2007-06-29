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
CasestudyBlock can render and process CasestudyIdevices as XHTML
"""

import logging
from exe.webui.block               import Block
from exe.webui.questionelement     import QuestionElement
from exe.webui.element             import ImageElement
from exe.webui                     import common
from exe.webui.element             import TextAreaElement


log = logging.getLogger(__name__)


# ===========================================================================
class CasestudyBlock(Block):
    """
    CasestudyBlock can render and process CasestudyIdevices as XHTML
    """
    def __init__(self, parent, idevice):
        """
        Initialize a new Block object
        """
        Block.__init__(self, parent, idevice)
        self.idevice           = idevice
        self.questionElements  = []

        # to compensate for the strange unpickling timing when objects are 
        # loaded from an elp, ensure that proper idevices are set:
        if idevice.storyTextArea.idevice is None: 
            idevice.storyTextArea.idevice = idevice

        self.storyElement      = TextAreaElement(idevice.storyTextArea)

        self.questionInstruc   = idevice.questionInstruc
        self.storyInstruc      = idevice.storyInstruc
        self.feedbackInstruc   = idevice.feedbackInstruc
        self.previewing        = False # In view or preview render 
        i = 0
        
        for question in idevice.questions:
            self.questionElements.append(QuestionElement(i, idevice, question))
            i += 1


    def process(self, request):
        """
        Process the request arguments from the web server
        """
        Block.process(self, request)

        self.storyElement.process(request)
            
        if (u"addQuestion"+unicode(self.id)) in request.args: 
            self.idevice.addQuestion()
            self.idevice.edit = True
            
        if "title"+self.id in request.args:
            self.idevice.title = request.args["title"+self.id][0]
            
        if "action" in request.args and request.args[u"action"][0] != u"delete":
            for element in self.questionElements:
                element.process(request)


    def renderEdit(self, style):
        """
        Returns an XHTML string with the form element for editing this block
        """
        self.previewing = True

        html  = u'<div class="iDevice"><br/>\n'
        html += common.textInput("title"+self.id, self.idevice.title)
        html += self.storyElement.renderEdit()

        for element in self.questionElements:
            html += element.renderEdit() 
         
        html += u"</table>\n"
        value = _(u"Add another activity")    
        html += common.submitButton(u"addQuestion"+unicode(self.id), value)
        html += u"<br /><br />" + self.renderEditButtons()
        html += u"</div>\n"
        return html

    def renderView(self, style):
        """
        Remembers if we're previewing or not,
        then implicitly calls self.renderViewContent (via Block.renderView)
        """
        self.previewing = False
        return Block.renderView(self, style)
    
    def renderPreview(self, style):
        """
        Remembers if we're previewing or not,
        then implicitly calls self.renderViewContent (via Block.renderPreview)
        """
        self.previewing = True
        return Block.renderPreview(self, style)
    
    def renderViewContent(self):
        """
        Returns an XHTML string for this block
        """
        log.debug("renderViewContent called with previewing mode = " + str(self.previewing))

        html  = u"<div class=\"iDevice_inner\">\n"

        if self.previewing:
            html += self.storyElement.renderPreview()
            html + u"<br/>\n"
            for element in self.questionElements:
                html += element.renderPreview()
        else:
            html += self.storyElement.renderView()
            html + u"<br/>\n"
            for element in self.questionElements:
                html += element.renderView()

        html += u"</div>\n"

        return html

from exe.engine.casestudyidevice import CasestudyIdevice
from exe.webui.blockfactory      import g_blockFactory
g_blockFactory.registerBlockType(CasestudyBlock, CasestudyIdevice)    

# ===========================================================================
