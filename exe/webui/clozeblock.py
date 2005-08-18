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
from exe.webui.element import ClozeElement


log = logging.getLogger(__name__)

# ===========================================================================
class ClozeBlock(Block):
    """
    Renders a paragraph where the content creator can choose which words the student
    must fill in.
    """
    def __init__(self, parent, idevice):
        """
        Pre-create our field ids
        """
        Block.__init__(self, parent, idevice)
        self.clozeElement = ClozeElement(idevice.content)

    def process(self, request):
        """
        Handles changes in the paragraph text from editing
        """
        object = request.args.get('object', [''])[0]
        action = request.args.get('action', [''])[0]
        if object == self.id:
            self.clozeElement.process(request)
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
            self.clozeElement.renderEdit(),
            self.renderEditButtons(),
            u'</div>'
            ]
        return u'\n    '.join(html).encode('utf8')
    
    def renderViewContent(self):
        """
        Returns an XHTML string for this block
        """
        html  = u'<script type="text/javascript" src="common.js"></script>\n'
        html += u'<div class="iDevice_inner">\n'
        html += u' <p id="clozeContent%s">' % self.id
        html += self.clozeElement.renderView()
        html += u'  </p>'
        
        return html
        
    

