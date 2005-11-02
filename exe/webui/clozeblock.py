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
Renders a paragraph where the content creator can choose which words the student
must fill in.
"""

import logging
import urllib
from exe.webui.block   import Block
from exe.webui         import common
from exe.webui.element import ClozeElement, TextAreaElement


log = logging.getLogger(__name__)

# ===========================================================================
class ClozeBlock(Block):
    """
    Renders a paragraph where the content creator can choose which words the
    student must fill in.
    """
    def __init__(self, parent, idevice):
        """
        Pre-create our field ids
        """
        Block.__init__(self, parent, idevice)
        self.instructionElement = \
            TextAreaElement(idevice.instructionsForLearners)
        self.clozeElement = ClozeElement(idevice.content)
        self.feedbackElement = \
            TextAreaElement(idevice.feedback)

    def process(self, request):
        """
        Handles changes in the paragraph text from editing
        """
        if "title"+self.id in request.args:
            self.idevice.title = request.args["title"+self.id][0]
        object = request.args.get('object', [''])[0]
        action = request.args.get('action', [''])[0]
        self.instructionElement.process(request)
        if object == self.id:
            self.clozeElement.process(request)
        self.feedbackElement.process(request)
        Block.process(self, request)

    def renderEdit(self, style):
        """
        Renders a screen that allows the user to enter paragraph text and choose
        which words are hidden.
        """
        html = [
            ClozeElement.renderEditScripts(),
            u'<div class="iDevice emphasis%s">' % \
              unicode(self.idevice.emphasis),
            common.textInput("title"+self.id, self.idevice.title),
            u'<p>',
            self.instructionElement.renderEdit(),
            u'</p>',
            self.clozeElement.renderEdit(),
            u'<p>',
            self.feedbackElement.renderEdit(),
            u'</p>',
            self.renderEditButtons(),
            u'</div>'
            ]
        return u'\n    '.join(html)
    
    def renderViewContent(self):
        """
        Returns an XHTML string for this block
        """
        # Only show feedback button if feedback is present
        if self.feedbackElement.field.content:
            # Cloze Idevice needs id of div for feedback content
            clozeContent = self.clozeElement.renderView(self.feedbackElement.id)
        else:
            clozeContent = self.clozeElement.renderView()
        html = [
            u'<script type="text/javascript" src="common.js"></script>\n',
            u'<div class="iDevice_inner">\n',
            u' <p>',
            self.instructionElement.renderView(),
            u' </p>',
            u' <p id="clozeContent%s">' % self.id,
            clozeContent,
            u' </p>',
            u' <p>',
            self.feedbackElement.renderView(False),
            u' </p>',
            u'</div>\n',
            ]
        return u'\n    '.join(html)

        
    
from exe.engine.clozeidevice import ClozeIdevice
from exe.webui.blockfactory  import g_blockFactory
g_blockFactory.registerBlockType(ClozeBlock, ClozeIdevice)    


# ===========================================================================
