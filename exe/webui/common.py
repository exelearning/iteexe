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

log = logging.getLogger(__name__)


def header():
    html  = "<html><head><title>eXe</title>\n"
    html += """<meta http-equiv="content-type" content="text/html; charset=UTF-8">\n""";
    html += "</head>\n"
    return html

def banner():
    html  = "<body>\n"
    html += "<h1>eXe: eLearning XML Editor</h1>\n"
    html += "<hr/>\n"
    return html

def footer():
    html  = "</body></html>\n"
    return html
    

if __name__ == "__main__":
    print header()
    print banner()
    print footer()
