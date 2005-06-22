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
WikipediaBlock can render and process WikipediaIdevices as XHTML
"""

import re
import logging
import gettext
from exe.webui.block   import Block
from exe.webui         import common
from exe.webui.element import TextAreaElement

log = logging.getLogger(__name__)
_   = gettext.gettext


# ===========================================================================
class WikipediaBlock(Block):
    """
    WikipediaBlock can render and process WikipediaIdevices as XHTML
    """
    def __init__(self, parent, idevice):
        """
        Initialize
        """
        Block.__init__(self, parent, idevice)
        self.articleElement = TextAreaElement(idevice.article)
        self.articleElement.height = 300


    def process(self, request):
        """
        Process the request arguments from the web server to see if any
        apply to this block
        """
        log.debug("process " + repr(request.args))

        if u"loadWikipedia"+self.id in request.args:
            self.idevice.loadArticle(request.args[u"wikipedia"][0])
        else:
            Block.process(self, request)

            if (u"action" not in request.args or
                request.args[u"action"][0] != u"delete"):
                self.articleElement.process(request)


    def renderEdit(self, style):
        """
        Returns an XHTML string with the form elements for editing this block
        """
        log.debug("renderEdit")
        html  = u"<div class=\"iDevice\">\n"
        html += _(u"Wikipedia Article ")
        html += common.textInput(u"wikipedia", self.idevice.articleName)
        html += common.submitButton(u"loadWikipedia"+self.id, _(u"Load"))
        html += u"<br/>\n"
        html += self.articleElement.renderEdit()
        html += self.renderEditButtons()
        html += u"</div>\n"
        return html


    def renderPreview(self, style):
        """
        Returns an XHTML string for previewing this block
        """
        log.debug("renderPreview")
        html  = u"<div class=\"iDevice\" "
        html += u'emphasis="'+unicode(self.idevice.emphasis)+'" '
        html += u"ondblclick=\"submitLink('edit',"+self.id+", 0);\">\n"
        html += self.articleElement.renderPreview()
        html += self.renderViewButtons()
        html += u"</div>\n"
        return html
    

    def renderView(self, style):
        """
        Returns an XHTML string for viewing this block
        """        
        log.debug("renderView")
        content = self.articleElement.renderView()
        content = re.sub(r'src="/.*?/resources/', 'src="', content)
        html  = u'<div class="iDevice" '
        html += u'emphasis="'+unicode(self.idevice.emphasis)+'">\n'
        html += content
        html += u"</div>\n"
        return html
    

# ===========================================================================
