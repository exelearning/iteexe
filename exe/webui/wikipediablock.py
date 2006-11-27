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
        
        if 'emphasis'+self.id in request.args:
            self.idevice.emphasis = int(request.args['emphasis'+self.id][0])
            
        if 'ssite'+self.id in request.args:
            self.idevice.site = request.args['ssite'+self.id][0]
            
        if 'ownUrl'+self.id in request.args:
            self.idevice.ownUrl = request.args['ownUrl'+self.id][0]

        if 'title'+self.id in request.args:
            self.idevice.title = request.args['title'+self.id][0]
            
        if ("object" in request.args and request.args["object"][0] == "site" + self.id):
            pass
        elif 'loadWikipedia'+self.id in request.args:
            # If they've hit "load" instead of "the tick"
            self.idevice.loadArticle(request.args['article'][0])
        else:
            # If they hit "the tick" instead of "load"
            Block.process(self, request)
            if (u"action" not in request.args or
                request.args[u"action"][0] != u"delete"):
                # If the text has been changed
                self.articleElement.process(request)
                
        
            
    def renderEdit(self, style):
        """
        Returns an XHTML string with the form elements for editing this block
        """
        log.debug("renderEdit")
        

        html  = u"<div class=\"iDevice\"><br/>\n"
        html += common.textInput("title" + self.id, self.idevice.title) + "<br/><br/>"

        sites = [(_(u"English Wikipedia Article"), "http://en.wikipedia.org/wiki/"),
                 (_(u"Chinese Wikipedia Article"), "http://zh.wikipedia.org/wiki/"),
                 (_(u"Dutch Wikipedia Article"),   "http://nl.wikipedia.org/wiki/"),
                 (_(u"French Wikipedia Article"),  "http://fr.wikipedia.org/wiki/"),
                 (_(u"German Wikipedia Article"),  "http://de.wikipedia.org/wiki/"),
                 (_(u"Greek Wikipedia Article"), "http://el.wikipedia.org/wiki/"),
                 (_(u"Italian Wikipedia Article"), "http://it.wikipedia.org/wiki/"),
                 (_(u"Japanese Wikipedia Article"),"http://ja.wikipedia.org/wiki/"),
                 (_(u"Polish Wikipedia Article"),  "http://pl.wikipedia.org/wiki/"),
                 (_(u"Portugese Wikipedia Article"), "http://pt.wikipedia.org/wiki/"),
                 (_(u"Slovenian Wikipedia Article"), "http://sl.wikipedia.org/wiki/"),
                 (_(u"Spanish Wikipedia Article"), "http://es.wikipedia.org/wiki/"),
                 (_(u"Swedish Wikipedia Article"), "http://sv.wikipedia.org/wiki/"),
                 (_(u"Wikibooks Article"),         "http://en.wikibooks.org/wiki/"),
                 (_(u"Wikiversity"),         "http://en.wikiversity.org/wiki/"),
                 (_(u"Wiktionary"),         "http://en.wiktionary.org/wiki/"),
                 (_(u"Wikieducator Content"),      "http://wikieducator.org/"),
                 (_(u"Other"),                     "")]          

        html += common.formField('select', _('Site'),'s',
                                 'site'+self.id,
                                 self.idevice.langInstruc,
                                 sites,
                                 self.idevice.site)

        
        url = "none"
        if self.idevice.site == "":
            url = "block"
        html += '<div style="display:%s"> %s: <br/>' % (url, _("Own site"))
        html += common.textInput("ownUrl"+self.id, self.idevice.ownUrl) + '<br/></div>'
        html += "<br/>"
        html += common.textInput("article", self.idevice.articleName)
        html += common.elementInstruc(self.idevice.searchInstruc)
        html += common.submitButton(u"loadWikipedia"+self.id, _(u"Load"))
        
        html += u"<br/>\n"
        html += self.articleElement.renderEdit()
        emphasisValues = [(_(u"No emphasis"),     Idevice.NoEmphasis),
                          (_(u"Some emphasis"),   Idevice.SomeEmphasis)]

        html += common.formField('select', _('Emphasis'),
                                 'emphasis', self.id, 
                                 '', # TODO: Instructions
                                 emphasisValues,
                                 self.idevice.emphasis)

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
            html += u"<div class=\"iDevice_inner\">\n"
        html += self.articleElement.renderPreview()
        html += u"<br/>\n"
        html += u"This article is licensed under the "
        html += u'<span style="text-decoration: underline;">'
        html += u"GNU Free Documentation License</span>. It uses material "
        html += u'from the <span style="text-decoration: underline;">article '
        html += u'"%s"</span>.<br/>\n' % self.idevice.articleName
        html += self.renderViewButtons()
        if self.idevice.emphasis != Idevice.NoEmphasis:
            html += u"</div></div>\n"
        else:
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
            html += u"<div class=\"iDevice_inner\">\n"
        html += content
        html += u"<br/>\n"
        html += _(u"This article is licensed under the ")
        html += u"<a "
        html += u"href=\"javascript:window.open('fdl.html')\">"
        html += u"%s</a>. " % _(u"GNU Free Documentation License")
        html += _(u"It uses material from the ")
        # UGLY UGLY UGLY KLUDGE for Wayne
        # "BIG please - Will you check that the Wikieducator url is changed for
        # the next release - not sure if we'll get the image thing sorted, but
        # this is pretty important strategically re the international growth of
        # eXe.  Not a new feature <smile> just a small change to a string."
        if self.idevice.site == u"http://wikieducator.org/":
            html += u"<a href=\""+self.idevice.site
        else:
            html += u"<a href=\""+self.idevice.site+u"wiki/"
        html += self.idevice.articleName+u"\">"
        html += _(u"article ") 
        html += u"\""+self.idevice.articleName+u"\"</a>.<br/>\n"
        if self.idevice.emphasis != Idevice.NoEmphasis:
            html += u"</div></div>\n"
        else:
            html += u"</div>\n"
        return html
    

from exe.engine.wikipediaidevice import WikipediaIdevice
from exe.webui.blockfactory      import g_blockFactory
g_blockFactory.registerBlockType(WikipediaBlock, WikipediaIdevice)    

# ===========================================================================
