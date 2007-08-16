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
This class transforms an eXe node into a page on a self-contained website
"""

import logging
import re
from cgi                      import escape
from urllib                   import quote
from exe.webui.blockfactory   import g_blockFactory
from exe.engine.error         import Error
from exe.engine.path          import Path
from exe.export.pages         import Page, uniquifyNames

log = logging.getLogger(__name__)


# ===========================================================================
class WebsitePage(Page):
    """
    This class transforms an eXe node into a page on a self-contained website
    """

    def save(self, outputDir, prevPage, nextPage, pages):
        """
        This is the main function. It will render the page and save it to a
        file.  'outputDir' is the directory where the filenames will be saved
        (a 'path' instance)
        """
        outfile = open(outputDir / self.name+".html", "w")
        outfile.write(self.render(prevPage, nextPage, pages))
        outfile.close()
        

    def render(self, prevPage, nextPage, pages):
        """
        Returns an XHTML string rendering this page.
        """
    
        html  = u"<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
        html += u'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 '
        html += u'Transitional//EN" '
        html += u'"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n'
        html += u"<html xmlns=\"http://www.w3.org/1999/xhtml\">\n"
        html += u"<!-- Created using eXe: http://exelearning.org -->\n"
        html += u"<head>\n"
        html += u"<style type=\"text/css\">\n"
        html += u"@import url(base.css);\n"
        html += u"@import url(content.css);\n"
        html += u"@import url(nav.css);</style>\n"
        html += u"<title> " 
        html += escape(self.node.titleLong)
        html += u" </title>\n" 
        html += u"<meta http-equiv=\"Content-Type\" content=\"text/html; "
        html += u" charset=utf-8\" />\n";
        html += u'<script type="text/javascript" src="common.js"></script>\n'
        html += u"</head>\n"
        html += u"<body>\n"
        html += u"<div id=\"content\">\n"

        if self.node.package.backgroundImg or self.node.package.title:
            html += u"<div id=\"header\" "

            if self.node.package.backgroundImg:
                html += u" style=\"background-image: url("
                html += quote(self.node.package.backgroundImg.basename())
                html += u"); "

                if self.node.package.backgroundImgTile:
                    html += "background-repeat: repeat-x;"
                else:
                    html += "background-repeat: no-repeat;"

                html += u"\""
            html += u">\n"
            html += escape(self.node.package.title)
            html += u"</div>\n"
        
        # add left navigation html
        html += u"<div id=\"navcontainer\">\n"
        html += self.leftNavigationBar(pages)
        html += u"</div>\n"
        html += u"<div id=\"main\">\n"

        style = self.node.package.style
        html += '<div id=\"nodeDecoration\">'
        html += '<p id=\"nodeTitle\">'
        html += escape(self.node.titleLong)
        html += '</p></div>\n'

        for idevice in self.node.idevices:
            block = g_blockFactory.createBlock(None, idevice)
            if not block:
                log.critical("Unable to render iDevice.")
                raise Error("Unable to render iDevice.")
            if hasattr(idevice, "isQuiz"):
                html += block.renderJavascriptForWeb()
            if idevice.title != "Forum Discussion":
                html += block.renderView(style)
        
        html += self.getNavigationLink(prevPage, nextPage)
        # writes the footer for each page 
        html += self.renderLicense()
        html += self.renderFooter()
        html += u"</div>\n"
        html += u"</div>\n"
        html += u"</body></html>\n"
        html = html.encode('utf8')
        return html

        
    def leftNavigationBar(self, pages):
        """
        Generate the left navigation string for this page
        """
        depth    = 1
        nodePath = [None] + list(self.node.ancestors()) + [self.node]

        html = "<ul id=\"navlist\">\n"

        for page in pages:
            if page.node.parent in nodePath:
                while depth < page.depth:
                    html += "<div id=\"subnav\" "
                    if page.node.children:
                        html += "class=\"withChild\""
                    else:
                        html += "class=\"withoutChild\""
                    html += ">\n"
                    depth += 1
                while depth > page.depth:
                    html += "</div>\n"
                    depth -= 1

                if page.node == self.node:
                    html += "<div id=\"active\" "
                    if page.node.children:
                        html += "class=\"withChild\""
                    else:
                        html += "class=\"withoutChild\""
                    html += ">"
                    html += escape(page.node.titleShort)
                    html += "</div>\n"
                else:
                    html += "<div><a href=\""+quote(page.name)+".html\" "
                    if page.node.children:
                        html += "class=\"withChild\""
                    else:
                        html += "class=\"withoutChild\""
                    html += ">"
                    html += escape(page.node.titleShort)
                    html += "</a></div>\n"

        while depth > 1:
            html += "</div>\n"
            depth -= 1
        html += "</ul>\n"
        return html
        
        
    def getNavigationLink(self, prevPage, nextPage):
        """
        return the next link url of this page
        """
        html = "<div class=\"noprt\" align=\"right\">"

        if prevPage:
            html += "<a href=\""+quote(prevPage.name)+".html\">"
            html += "&laquo; %s</a>" % _('Previous')

        if nextPage:
            if prevPage:
                html += " | "
            html += "<a href=\""+quote(nextPage.name)+".html\">"
            html += " %s &raquo;</a>" % _('Next')
            
        html += "</div>\n"
        return html


