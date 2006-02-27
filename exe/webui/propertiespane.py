# ==========================================================================
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
PropertiesPane is responsible for creating the XHTML for the properties 
pane
"""

import logging
from exe.webui import common
from exe.webui.renderable import Renderable

log = logging.getLogger(__name__)


# ==========================================================================
class PropertiesPane(Renderable):
    """
    PropertiesPane is responsible for creating the XHTML for the properties
    pane
    """
    name = 'propertiesPane'

    def __init__(self, parent):
        Renderable.__init__(self, parent)
        self.url          = ""

    def process(self, request):
        """ 
        Process what the user has submitted
        """
        self.url     = request.path
        
        if ("action" in request.args and 
            request.args["action"][0] == "saveChange"):
            log.debug("process save change for propertity pane")
            self.package.save()
             
        if "done" in request.args:
            self.package.isChanged = 1
        
        if "title" in request.args:            
            self.package.root.title = request.args["title"][0]
            
        if "author" in request.args:   
            self.package.author = request.args["author"][0]
            
        if "description" in request.args:    
            self.package.description = request.args["description"][0]
            
        if "style" in request.args:    
            self.package.style = request.args["style"][0]
            
        if "level1" in request.args:    
            self.package._levelNames[0] = unicode(request.args["level1"][0],
                                                 'utf8')
            
        if "level2" in request.args:    
            self.package._levelNames[1] = unicode(request.args["level2"][0],
                                                 'utf8')
            
        if "level3" in request.args:    
            self.package._levelNames[2] = unicode(request.args["level3"][0],
                                                 'utf8')
        
            
    def render(self):
        """Returns an XHTML string for viewing this pane"""
        log.debug("render")
        html  = u''
        html += u'<a name="currentBlock"/>'
        html += u"<form method=\"post\" action=\"%s\" " % self.url
        html += u"id=\"contentForm\" " 
        html += u'onSubmit="return handleSubmit()">\n' 
        html += common.hiddenField("action")
        html += common.hiddenField("isChanged", self.package.isChanged)
        html += common.hiddenField("posting", self.package.isChanged)
        html += u"<table border=\"0\" cellspacing=\"6\">\n"
        html += u"<tr><td><b>%s</b></td><td>\n" % _(u"Project title:")
        html += common.textInput("title", self.package.root.title, 53) 
        html += u"</td>"
        html += u"</tr><tr><td><b>"
        html += _(u"Author")
        html += u":</b></td><td>\n"
        html += common.textInput("author", self.package.author, 53) 
        html += u"</td></tr>\n"
        html += u"<tr><td valign=\"top\"><b>"
        html += _(u"Description")
        html += u":</b></td><td>\n"
        html += common.textArea("description", self.package.description)
        html += u"</td></tr>\n"
        html += u"<tr><td valign=\"top\"><b>"
        html += _(u"Taxonomy")
        html += u":</b></td>\n"
        html += u"<td valign=\"top\">"
        html += _(u"Level 1: ")
        html += common.textInput("level1", self.package.levelName(0), 20)
        html += u'<div class="block">'
        html += _(u"Level 2: ")
        html += common.textInput("level2", self.package.levelName(1), 20)
        html += u"</div>\n"
        html += u'<div class="block">'
        html += _(u"Level 3: ")
        html += common.textInput("level3", self.package.levelName(2), 20)
        html += u"</div></td></tr><tr><td align=\"right\">\n"       
        html += common.submitButton('done', _(u'Done'))
        html += u"</td><td>&nbsp;</td></tr></table></form>\n"
        return html
        
        
# ==========================================================================
