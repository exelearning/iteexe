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
        self.story             = idevice.story
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
        storyId = u"story" + unicode(self.id)
        if storyId in request.args:
            self.idevice.story = request.args[storyId][0]
            
        if (u"addQuestion"+unicode(self.id)) in request.args: 
            self.idevice.addQuestion()
            self.idevice.edit = True
            
        if "title"+self.id in request.args:
            self.idevice.title = request.args["title"+self.id][0]
            
        if request.args[u"action"][0] != u"delete":
            for element in self.questionElements:
                element.process(request)


    def renderEdit(self, style):
        """
        Returns an XHTML string with the form element for editing this block
        """
        html  = u'<div class="iDevice"><br/>\n'
        html += common.textInput("title"+self.id, self.idevice.title)
        html += common.formField('richTextArea', _(u'Story:'),
                                 'story', self.id,
                                 self.storyInstruc,
                                 self.story)

        html += u'<div class="block">'
        html += u"<strong>%s</strong>" % _("Question(s)")
        html += u'</div>'
        html += u'<table width ="100%">\n'
        
        for element in self.questionElements:
            html += element.renderEdit() 
         
        html += u"</table>\n"
        value = _(u"Add another question")    
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
        html  = u"<div class=\"iDevice_inner\">\n"
        html += self.story + u"<br/>\n"
            
        if self.previewing:
            for element in self.questionElements:
                html += element.renderPreview()
        else:
            for element in self.questionElements:
                html += element.renderView()

        html += u"</div>\n"

        return html

from exe.engine.casestudyidevice import CasestudyIdevice
from exe.webui.blockfactory      import g_blockFactory
g_blockFactory.registerBlockType(CasestudyBlock, CasestudyIdevice)    

# ===========================================================================
