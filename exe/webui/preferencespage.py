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
The PreferencesPage is responsible for managing eXe preferences
"""

import logging
from twisted.web.resource      import Resource
from exe.webui                 import common
from exe.webui.renderable      import RenderableResource

log = logging.getLogger(__name__)


class PreferencesPage(RenderableResource):
    """
    The PreferencesPage is responsible for managing eXe preferences
    """
    name = 'preferences'

    def __init__(self, parent):
        """
        Initialize
        """
        RenderableResource.__init__(self, parent)
        self.url          = ""
        self.message      = ""
        self.localeNames  = []
        
        for locale, translation in self.config.locales.items():
            localeName  = locale + ": " 
            localeName += translation.info().get('x-poedit-language', '')
            self.localeNames.append((localeName, locale))

        
    def getChild(self, name, request):
        """
        Try and find the child for the name given
        """
        if name == "":
            return self
        else:
            return Resource.getChild(self, name, request)


    def process(self, request):
        """
        Process current package 
        """
        log.debug("process " + repr(request.args))
        
        if "action" in request.args:
            if request.args["action"][0] == "changeIdevice":
                pass
            
    def render_GET(self, request):
        """Called for all requests to this object"""
        
        # Processing 
        log.debug("render_GET")
        self.process(request)
        
        # Rendering
        html  = common.docType()
        html += "<html xmlns=\"http://www.w3.org/1999/xhtml\">\n"
        html += "<head>\n"
        html += "<style type=\"text/css\">\n"
        html += "@import url(/css/exe.css);\n"
        html += "@import url(/style/standardwhite/content.css);</style>\n"
        html += '<script type="text/javascript" src="/scripts/fckeditor.js">'
        html += '</script>\n'
        html += "<title>"+_("eXe : elearning XHTML editor")+"</title>\n"
        html += "<meta http-equiv=\"content-type\" content=\"text/html; "
        html += " charset=UTF-8\"></meta>\n";
        html += "</head>\n"
        html += "<body>\n"
        html += "<div id=\"main\"> \n"     
        html += "<form method=\"post\" action=\""+self.url+"\" "
        html += "id=\"contentForm\" >"  
        html += common.hiddenField("action")
        html += common.hiddenField("object")
        html += common.select("locale", self.localeNames)
        html += "<font color=\"red\"<b>"+self.message+"</b></font>"
        html += "<div id=\"editorButtons\"> \n"     
        html += "<br/>" + common.submitButton("save", _("Save"))
        html += "</div>\n"
        html += "</div>\n"
        html += "<br/></form>\n"
        html += "</body>\n"
        html += "</html>\n"
        return html.encode('utf8')
    render_POST = render_GET


