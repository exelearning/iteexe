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
WikipediaBlock can render and process WikipediaIdevices as XHTML
"""

import re
import logging
from exe.webui.block   import Block
from exe.webui         import common
from exe.webui.element import TextAreaElement
from exe.engine.idevice   import Idevice
from exe.engine.resource  import Resource
from exe                  import globals as G

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

        # to compensate for the strange unpickling timing when objects are 
        # loaded from an elp, ensure that proper idevices are set:
        if idevice.article.idevice is None: 
            idevice.article.idevice = idevice
        self.articleElement = TextAreaElement(idevice.article)
        self.articleElement.height = 300
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
            # disable Undo once an emphasis has changed: 
            self.idevice.undo = False
            
        if 'ssite'+self.id in request.args \
        and not is_cancel:
            self.idevice.site = request.args['ssite'+self.id][0]
            
        if 'ownUrl'+self.id in request.args \
        and not is_cancel:
            self.idevice.ownUrl = request.args['ownUrl'+self.id][0]

        if 'title'+self.id in request.args \
        and not is_cancel:
            self.idevice.title = request.args['title'+self.id][0]
            
        if ("object" in request.args and request.args["object"][0] == "site" + self.id):
            pass
        elif 'loadWikipedia'+self.id in request.args:
            # If they've hit "load" instead of "the tick"
            self.idevice.loadArticle(request.args['article'][0])
            # disable Undo once an article has been loaded: 
            self.idevice.undo = False
        else:
            # If they hit "the tick" instead of "load"
            Block.process(self, request)
            if (u"action" not in request.args \
            or request.args[u"action"][0] != u"delete"):
                # If the text has been changed
                self.articleElement.process(request)
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
        html += common.textInput("title" + self.id, self.idevice.title) + "<br/><br/>"

        sites = [(_(u"English Wikipedia Article"), "http://en.wikipedia.org/wiki/"),
                 (_(u"Basque Wikipedia Article"), "http://eu.wikipedia.org/wiki/"),
                 (_(u"Catalan Wikipedia Article"), "http://ca.wikipedia.org/wiki/"),
                 (_(u"Chinese Wikipedia Article"), "http://zh.wikipedia.org/wiki/"),
                 (_(u"Dutch Wikipedia Article"),   "http://nl.wikipedia.org/wiki/"),
                 (_(u"French Wikipedia Article"),  "http://fr.wikipedia.org/wiki/"),
                 (_(u"German Wikipedia Article"),  "http://de.wikipedia.org/wiki/"),
                 (_(u"Galician Wikipedia Article"),  "http://gl.wikipedia.org/wiki/"),    
                 (_(u"Greek Wikipedia Article"), "http://el.wikipedia.org/wiki/"),
                 (_(u"Italian Wikipedia Article"), "http://it.wikipedia.org/wiki/"),
                 (_(u"Japanese Wikipedia Article"),"http://ja.wikipedia.org/wiki/"),
                 (_(u"Magyar Wikipedia Article"),"http://hu.wikipedia.org/wiki/"),
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

        this_package = None
        if self.idevice is not None and self.idevice.parentNode is not None:
            this_package = self.idevice.parentNode.package
        
        wikipediaURL = self.idevice.site
        
        if (wikipediaURL=="http://en.wikipedia.org/" 
        or wikipediaURL=="http://eu.wikipedia.org/" 
        or wikipediaURL=="http://ca.wikipedia.org/" 
        or wikipediaURL=="http://zh.wikipedia.org/" 
        or wikipediaURL=="http://nl.wikipedia.org/" 
        or wikipediaURL=="http://fr.wikipedia.org/" 
        or wikipediaURL=="http://de.wikipedia.org/" 
        or wikipediaURL=="http://gl.wikipedia.org/"  
        or wikipediaURL=="http://el.wikipedia.org/" 
        or wikipediaURL=="http://it.wikipedia.org/" 
        or wikipediaURL=="http://ja.wikipedia.org/" 
        or wikipediaURL=="http://hu.wikipedia.org/" 
        or wikipediaURL=="http://pl.wikipedia.org/" 
        or wikipediaURL=="http://pt.wikipedia.org/" 
        or wikipediaURL=="http://sl.wikipedia.org/" 
        or wikipediaURL=="http://es.wikipedia.org/" 
        or wikipediaURL=="http://sv.wikipedia.org/"):
            wikipediaURL = wikipediaURL+"wiki/"
        
        html += common.formField('select', this_package, _('Site'),'s',
                                 'site'+self.id,
                                 self.idevice.langInstruc,
                                 sites,
                                 wikipediaURL)

        
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
        html = common.ideviceHeader(self, style, "preview")
        html += self.articleElement.renderPreview() 
        html += common.ideviceFooter(self, style, "preview")
        return html
    

    def renderView(self, style):
        """
        Returns an XHTML string for viewing this block
        """        
        log.debug("renderView")
        content = self.articleElement.renderView()
        # content = re.sub(r'src="resources/', 'src="', content)
        content = re.sub(r'src="%s/newPackage.*/resources/'%(G.application.exeAppUri), 'src="', content)
        content = re.sub(r'src="/newPackage.*/resources/', 'src="', content)
        content = re.sub(r'src=\'/newPackage.*/resources/', 'src="', content)
        content = re.sub(r'src=\"/newPackage.*/resources/', 'src="', content)
        html = common.ideviceHeader(self, style, "view")
        html += content        
        html += common.ideviceFooter(self, style, "view")
        return html
    

from exe.engine.wikipediaidevice import WikipediaIdevice
from exe.webui.blockfactory      import g_blockFactory
g_blockFactory.registerBlockType(WikipediaBlock, WikipediaIdevice)    

# ===========================================================================
