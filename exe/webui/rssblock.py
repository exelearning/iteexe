# ===========================================================================
# eXe 
# Copyright 2004-2006, University of Auckland
# Copyright 2004-2008 eXe Project, http://eXeLearning.org
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
RssBlock can render and process RssIdevices as XHTML
"""

import re
import logging
from exe.webui.block    import Block
from exe.webui          import common
from exe.webui.element  import TextAreaElement
from exe.engine.idevice import Idevice

log = logging.getLogger(__name__)


# ===========================================================================
class RssBlock(Block):
    """
    RssBlock can render and process RssIdevices as XHTML
    """
    def __init__(self, parent, idevice):
        """
        Initialize
        """
        Block.__init__(self, parent, idevice)

        # to compensate for the strange unpickling timing when objects are 
        # loaded from an elp, ensure that proper idevices are set:
        if idevice.rss.idevice is None: 
            idevice.rss.idevice = idevice

        self.rssElement = TextAreaElement(idevice.rss)
        self.rssElement.height = 300

        if not hasattr(self.idevice,'undo'): 
            self.idevice.undo = True


    def process(self, request):
        """
        Process the request arguments from the web server to see if any
        apply to this block
        """
        log.debug("process " + repr(request.args))

        is_cancel = common.requestHasCancel(request)
        
        if 'emphasis'+self.id in request.args \
        and not is_cancel:
            self.idevice.emphasis = int(request.args['emphasis'+self.id][0])
            
        if 'site'+self.id in request.args \
        and not is_cancel:
            self.idevice.site = request.args['site'+self.id][0]

        if 'title'+self.id in request.args \
        and not is_cancel:
            self.idevice.title = request.args['title'+self.id][0]
            
        if "url" + self.id in request.args \
        and not is_cancel:
            self.idevice.url = request.args['url'+ self.id][0]

        if 'loadRss'+self.id in request.args \
        and not is_cancel:
            # disable Undo once a question has been added:
            self.idevice.undo = False
            self.idevice.loadRss(request.args['url'+ self.id][0])
        else:
            Block.process(self, request)
            if (u"action" not in request.args or
                request.args[u"action"][0] != u"delete"):
                # If the text has been changed
                self.rssElement.process(request)
            if "action" in request.args \
            and request.args["action"][0] == "done":
                # remove the undo flag in order to reenable it next time:
                if hasattr(self.idevice,'undo'): 
                    del self.idevice.undo

    def renderEdit(self, style):
        """
        Returns an XHTML string with the form elements for editing this block
        """
        log.debug("renderEdit")

        html  = u"<div class=\"iDevice\"><br/>\n"
        html += common.textInput("title" + self.id, self.idevice.title)

        html += '<br/><br/>RSS URL ' + common.textInput("url" + self.id,
                                                        self.idevice.url)
        html += common.submitButton(u"loadRss"+self.id, _(u"Load"))
        html += common.elementInstruc(self.idevice.urlInstruc)
        html += u"<br/>\n"
        html += self.rssElement.renderEdit()
        emphasisValues = [(_(u"No emphasis"),     Idevice.NoEmphasis),
                          (_(u"Some emphasis"),   Idevice.SomeEmphasis)]
        
        this_package = None
        if self.idevice is not None and self.idevice.parentNode is not None:
            this_package = self.idevice.parentNode.package
        html += common.formField('select', this_package, _('Emphasis'),
                                 'emphasis', self.id, 
                                 '', # TODO: Instructions
                                 emphasisValues,
                                 self.idevice.emphasis)

        html += self.renderEditButtons(undo=self.idevice.undo)
        html += u"</div>\n"
        return html


    def renderPreview(self, style):
        """
        Returns an XHTML string for previewing this block
        """
        log.debug("renderPreview")
        html = common.ideviceHeader(self, style, "preview", True) # True = include iDevice_inner div
        html += self.rssElement.renderPreview()
        html += common.ideviceFooter(self, style, "preview", True)
        return html
    

    def renderView(self, style):
        """
        Returns an XHTML string for viewing this block
        """        
        log.debug("renderView")
        content = self.rssElement.renderView()
        content = re.sub(r'src="/.*?/resources/', 'src="', content)
        html = common.ideviceHeader(self, style, "view", True) # True = include iDevice_inner div
        html += content
        html += common.ideviceFooter(self, style, "view", True)
        return html
    

from exe.engine.rssidevice  import RssIdevice
from exe.webui.blockfactory import g_blockFactory
g_blockFactory.registerBlockType(RssBlock, RssIdevice)    

# ===========================================================================
