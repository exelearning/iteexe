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
ReflectionBlock can render and process ReflectionIdevices as XHTML
"""

import logging
from exe.webui.block               import Block
from exe.webui                     import common
from exe.webui.element      import TextAreaElement

log = logging.getLogger(__name__)


# ===========================================================================
class ReflectionBlock(Block):
    """
    ReflectionBlock can render and process ReflectionIdevices as XHTML
    """
    def __init__(self, parent, idevice):
        """
        Initialize a new Block object
        """
        Block.__init__(self, parent, idevice)
        self.activityInstruc = idevice.activityInstruc
        self.answerInstruc   = idevice.answerInstruc

        # to compensate for the strange unpickling timing when objects are 
        # loaded from an elp, ensure that proper idevices are set:
        if idevice.activityTextArea.idevice is None: 
            idevice.activityTextArea.idevice = idevice
        if idevice.answerTextArea.idevice is None: 
            idevice.answerTextArea.idevice = idevice

        self.activityElement  = TextAreaElement(idevice.activityTextArea)
        self.answerElement    = TextAreaElement(idevice.answerTextArea)

        self.previewing        = False # In view or preview render

        if not hasattr(self.idevice,'undo'): 
            self.idevice.undo = True


    def process(self, request):
        """
        Process the request arguments from the web server
        """
        Block.process(self, request)

        if request.args["action"][0] != "cancel":
            self.activityElement.process(request)
            self.answerElement.process(request)
            if "title"+self.id in request.args:
                self.idevice.title = request.args["title"+self.id][0]
        

    def renderEdit(self, style):
        """
        Returns an XHTML string with the form element for editing this block
        """
        html  = "<div class=\"iDevice\"><br/>\n"
        html += common.textInput("title"+self.id, self.idevice.title)
        html += self.activityElement.renderEdit()
        html += self.answerElement.renderEdit()
        html += "<br/>" + self.renderEditButtons()
        html += "</div>\n"
        return html

    def renderPreview(self, style):
        """ 
        Remembers if we're previewing or not, 
        then implicitly calls self.renderViewContent (via Block.renderPreview) 
        """ 
        self.previewing = True 
        return Block.renderPreview(self, style)

    def renderView(self, style): 
        """ 
        Remembers if we're previewing or not, 
        then implicitly calls self.renderViewContent (via Block.renderPreview) 
        """ 
        self.previewing = False 
        return Block.renderView(self, style)


    def renderViewContent(self):
        """
        Returns an XHTML string for this block
        """
        html  = u'<script type="text/javascript" src="common.js"></script>\n'
        html += u'<div class="iDevice_inner">\n'
    
        if self.previewing: 
            html += self.activityElement.renderPreview()
        else:
            html += self.activityElement.renderView()

        html += '<div id="view%s" style="display:block;">' % self.id
        html += common.feedbackButton("btnshow"+self.id, _(u"Click here"),
                    onclick="showAnswer('%s',1)" % self.id)
        html += '</div>\n' 
        html += '<div id="hide%s" style="display:none;">' % self.id
        html += common.feedbackButton("btnshow"+self.id, _(u"Hide"),
                    onclick="showAnswer('%s',0)" % self.id)
        html += '</div>\n'
        html += '<div id="s%s" class="feedback" style=" ' % self.id
        html += 'display: none;">'

        if self.previewing: 
            html += self.answerElement.renderPreview()
        else:
            html += self.answerElement.renderView()

        html += "</div>\n"
        html += "</div>\n"
        return html
    

from exe.engine.reflectionidevice  import ReflectionIdevice
from exe.webui.blockfactory        import g_blockFactory
g_blockFactory.registerBlockType(ReflectionBlock, ReflectionIdevice)    

# ===========================================================================
