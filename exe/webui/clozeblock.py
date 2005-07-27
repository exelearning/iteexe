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
import gettext
import urllib
from exe.webui.block            import Block
from exe.webui                  import common

log = logging.getLogger(__name__)
_   = gettext.gettext

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
        self.clozeContentId = 'clozeContent%s' % self.id

    def process(self, request):
        """
        Handles changes in the paragraph text from editing
        """
        object = request.args.get('object', [''])[0]
        action = request.args.get('action', [''])[0]
        if object == self.id and action == 'done':
            self.idevice.content = request.args.get(self.clozeContentId,[''])[0]
        Block.process(self, request)

    def renderEdit(self, style):
        """
        Renders a screen that allows the user to enter paragraph text and choose
        which words are hidden.
        """
        html = [
            u'<div class="iDevice emphasis%s">' %
            unicode(self.idevice.emphasis),
            common.textArea(self.clozeContentId, self.idevice.content),
            self.renderEditButtons(),
            u'</div>'
            ]
        return u'\n    '.join(html).encode('utf8')

    def renderPreview(self, style):
        """
        Renders the HTML for preview inside exe
        """
        html  = [u'<div class="iDevice emphasis%s" ' %
                 unicode(self.idevice.emphasis),
                 u' ondblclick="submitLink(\'edit\',%s, 0);">' % self.id,
                 u'  <p id="clozeContent%s">' % self.id,
                 '<br/>'.join(self.idevice.content.split('\n')),
                 u'  </p>',
                 self.renderViewButtons(),
                 u'</div>']
        return u'\n    '.join(html).encode('utf8')
        
    def renderView(self, style):
        """
        Renders the html for export
        """
        html  = [u'<div class="iDevice emphasis%s">' %
                 unicode(self.idevice.emphasis),
                 u'  <p id="clozeContent%s">' % self.id,
                 '<br/>'.join(self.idevice.content.split('\n')),
                 u'  </p>',
                 u'</div>']
        return u'\n    '.join(html).encode('utf8')
