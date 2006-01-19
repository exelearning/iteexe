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
from exe.webui.block   import Block
from exe.webui         import common
from exe.webui.element import TextAreaElement
from exe.engine.idevice   import Idevice

log = logging.getLogger(__name__)


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

        if u"emphasis"+self.id in request.args:
            self.idevice.emphasis = int(request.args["emphasis"+self.id][0])

        if u"loadWikipedia"+self.id in request.args:
            self.idevice.site = request.args["site"][0]
            self.idevice.loadArticle(request.args["article"][0])
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
        sites = [(_(u"English Wikipedia Article"), "http://en.wikipedia.org/"),
                 (_(u"Chinese Wikipedia Article"), "http://zh.wikipedia.org/"),
                 (_(u"German Wikipedia Article"),  "http://de.wikipedia.org/"),
                 (_(u"French Wikipedia Article"),  "http://fr.wikipedia.org/"),
                 (_(u"Japanese Wikipedia Article"),"http://ja.wikipedia.org/"),
                 (_(u"Italian Wikipedia Article"), "http://il.wikipedia.org/"),
                 (_(u"Polish Wikipedia Article"),  "http://pl.wikipedia.org/"),
                 (_(u"Dutch Wikipedia Article"),   "http://nl.wikipedia.org/"),
                 (_(u"Portugese Wikipedia Article"),
                                                   "http://pt.wikipedia.org/"),
                 (_(u"Spanish Wikipedia Article"), "http://es.wikipedia.org/"),
                 (_(u"Swedish Wikipedia Article"), "http://sv.wikipedia.org/"),
                 (_(u"Wikibooks Article"),         "http://en.wikibooks.org/")]
        html += common.select("site", sites,
                              selection=self.idevice.site)
        html += common.textInput("article", self.idevice.articleName)
        html += common.submitButton(u"loadWikipedia"+self.id, _(u"Load"))
        html += common.elementInstruc("loadWikipedia"+self.id, 
                                      self.idevice.loadInstruc)
        html += u"<br/>\n"
        html += self.articleElement.renderEdit()
        emphasisValues = [(_(u"No emphasis"),     Idevice.NoEmphasis),
                          (_(u"Some emphasis"),   Idevice.SomeEmphasis),
                          (_(u"Strong emphasis"), Idevice.StrongEmphasis)]
        html += common.select("emphasis", emphasisValues,
                              self.id,
                              self.idevice.emphasis)
        html += u"<br/><br/>\n"
        html += self.renderEditButtons()
        html += u"</div>\n"
        return html


    def renderPreview(self, style):
        """
        Returns an XHTML string for previewing this block
        """
        log.debug("renderPreview")
        html  = u"<div class=\"iDevice "
        html += u"emphasis"+unicode(self.idevice.emphasis)+"\" "
        html += u"ondblclick=\"submitLink('edit',"+self.id+", 0);\">\n"
        if self.idevice.emphasis != Idevice.NoEmphasis:
            if self.idevice.icon:
                html += u'<img alt="idevice icon" class="iDevice_icon" '
                html += u" src=\"/style/"+style
                html += "/icon_"+self.idevice.icon+".gif\"/>\n"
            html += u"<span class=\"iDeviceTitle\">"
            html += self.idevice.title
            html += u"</span>\n"
        html += self.articleElement.renderPreview()
        html += u"<br/>\n"
        html += u"This article is licensed under the "
        html += u"<u>GNU Free Documentation License</u>. It uses material "
        html += u"from the <u>article " 
        html += u"\""+self.idevice.articleName+u"\"</u>.<br/>\n"
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
        html  = u"<div class=\"iDevice "
        html += u"emphasis"+unicode(self.idevice.emphasis)+"\">\n"
        if self.idevice.emphasis != Idevice.NoEmphasis:
            if self.idevice.icon:
                html += u'<img alt="iDevice icon" class="iDevice_icon" '
                html += u" src=\"icon_"+self.idevice.icon+".gif\"/>\n"
            html += u"<span class=\"iDeviceTitle\">"
            html += self.idevice.title
            html += u"</span>\n"
        html += content
        html += u"<br/>\n"
        html += u"This article is licensed under the "
        html += u"<a target=\"_blank\" "
        html += u"href=\"fdl.html\">"
        html += u"GNU Free Documentation License</a>. It uses material "
        html += u"from the <a href=\""+self.idevice.site+u"wiki/"
        html += self.idevice.articleName+u"\">"
        html += u"article " + u"\""+self.idevice.articleName+u"\"</a>.<br/>\n"
        html += u"</div>\n"
        return html
    

from exe.engine.wikipediaidevice import WikipediaIdevice
from exe.webui.blockfactory      import g_blockFactory
g_blockFactory.registerBlockType(WikipediaBlock, WikipediaIdevice)    

# ===========================================================================
