# ===========================================================================
# eXe
# Copyright 2004-2005, University of Auckland
#
# This module is for the common HTML used in all webpages.
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

import sys
import logging
import gettext

log = logging.getLogger(__name__)
_   = gettext.gettext


def header():
    html  = "<html>\n"
    html  = "<head>\n"
    html += "<title>"+_("eXe")+"</title>\n"
    html += "<meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\">\n";
    html += "</head>\n"
    return html

def banner(heading = _("eXe: eLearning XML Editor")): 
    html  = "<body>\n"
    html += "<h1>"+heading+"</h1>\n"
    html += "<hr/>\n"
    return html

def footer():
    html  = "</body></html>\n"
    return html
    
def hiddenField(name, value=""):
    html  = "<input type=\"hidden\" name=\"%s\" " % name
    html += "value=\"%s\">\n" % value
    return html

def textInput(name, value=""):
    html  = "<input type=\"text\" name=\"%s\" " % name
    html += "value=\"%s\"" % value
    html += "size=\"60\">\n" 
    return html

def textArea(name, value=""):
    html  = "<textarea name=\"%s\" " % name
    html += "cols=\"52\" rows=\"8\">%s" % value
    html += "</textarea><br/>" 
    return html

def submitButton(name, value, enabled=True):
    if enabled:
        disable = ""
    else:
        disable = "disabled"
    html  = "<input type=\"submit\" name=\"%s\" " % name
    html += "value=\"%s\" " %  value
    html += disable+" >\n"
    return html



if __name__ == "__main__":
    print header()
    print banner()
    print textInput("text")
    print textArea("area")
    print submitButton("ok", "OK")
    print footer()
