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

import logging
import gettext
from exe.webui import common
from exe.engine.packagestore import g_packageStore
from exe.engine.package import Package
log = logging.getLogger(__name__)
_   = gettext.gettext


# ===========================================================================
class LanguagePane(object):
    """
    LanguagePane is responsible for creating the XHTML for the language options
    """
    def __init__(self):
        self.package = None
        enStr = ""
        frStr = ""
        geStr = ""
        chStr = ""
                
    def process(self, request):
        """ 
        Get package and assign language to the package
        """
        self.package = g_packageStore.getPackage(request.prepath[0])
        self.enStr = ""
        self.frStr = ""
        self.geStr = ""
        self.chStr = ""
        
        log.debug("process " + repr(request.args))
                                             
        if "language" in request.args:         
            if request.args["language"][0]=='English':
                self.package.language = "English"
                self.enStr="selected"     
                
            elif request.args["language"][0]=='French':
                self.package.language = "French"
                self.frStr="selected"
                
            elif request.args["language"][0]=='German':
                self.package.language = "German"
                self.geStr="selected"
                
            elif request.args["language"][0]=='Chinese':
                self.package.language = "Chinese"
                self.chStr="selected"
                
        if self.package.language == "French":
            self.frStr = "selected"
        elif self.package.language == "German":
            self.geStr = "selected"
        elif self.package.language == "Chinese":
            self.chStr = "selected"
        else:
            self.enStr = "selected"
                   
    
    def render(self):
        """
        Returns an XHTML string for the language option
        """
        _ = self.package.getLanguage()
        html = '<form method="post" action="http:/'
        html += self.package.name
        html += '">\n'
        html += '<select onchange="submit()" name="language">\n'           
        html += '<option value="English" %s>%s</option>\n' %(self.enStr, _("English"))
        html += '<option value="French" %s>%s</option>\n' %(self.frStr, _("French"))
        html += '<option value="German" %s>%s</option>\n' %(self.geStr, _("German"))
        html += '<option value="Chinese" %s>%s</option>\n' %(self.chStr, _("Chinese"))
        html += '</select>%s<br/>\n' % _("Please select a language")
        html += '<br/></form>'
        
        return html
        
# ===========================================================================
