# ===========================================================================
# eXe 
# Copyright 2004-2005, University of Auckland
# Copyright 2007 Tairawhiti Polytechnic
# Copyright 2004-2007 eXe Project, New Zealand Tertiary Education Commission
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
This class transforms an eXe node into a page of iPod Notes
"""

import logging
import re
from cgi                      import escape
from urllib                   import quote
from exe.webui.blockfactory   import g_blockFactory
from exe.engine.error         import Error
from exe.engine.path          import Path
from exe.export.pages         import Page, uniquifyNames
from exe.engine.htmlToText    import HtmlToText

log = logging.getLogger(__name__)


# ===========================================================================
class IpodPage(Page):
    """
    This class transforms an eXe node into an iPod Note page
    """

    def save(self, outputDir, prevPage, nextPage, pages):
        """
        This is the main function. It will render the page and save it to a
        file.  'outputDir' is the directory where the filenames will be saved
        (a 'path' instance)
        """
        outfile = open(outputDir / self.name+".txt", "wt")
        outfile.write(self.render(prevPage, nextPage, pages))
        outfile.close()
        

    def render(self, prevPage, nextPage, pages):
        """
        Returns an XHTML string rendering this page.
        """
    
        html  = u"<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
        html += u"<title>" 
        html += escape(self.node.titleLong)
        html += u"</title>\n" 

        body = ""
        for idevice in self.node.idevices:
            block = g_blockFactory.createBlock(None, idevice)
            if not block:
                log.critical("Unable to render iDevice.")
                raise Error("Unable to render iDevice.")
            if hasattr(idevice, "isCloze"):
                body += block.renderText()
            if idevice.title != "Forum Discussion":
                body += block.renderView('default')

        converter = HtmlToText(body)
        text = converter.convertToText()
        text = text.replace('&', '&amp;')
        text = text.replace('>', '&gt;')
        text = text.replace('<', '&lt;')
        text = text.replace('\r\n', ' ')
        # eliminate blank lines at the beginning of the body
        text = re.sub(r'^\n+', '', text)
        # collapse multiple blank lines
        text = re.sub(r'\n{3,}', '\n\n', text)

        foot = self.getNavigationLink(prevPage, nextPage)

        # trim near the max length
        bodylen = 4050 - len(html) - len(foot)
        if len(text) > bodylen:
            text = text[:text.rfind(' ', 1, bodylen)] + '...\n'

        html = html + text + foot
        # writes the footer for each page 
        #html += self.renderLicense()
        #html += self.renderFooter()
        html = html.encode('utf8')
        return html

    def getNavigationLink(self, prevPage, nextPage):
        """
        return the next link url of this page
        """

        html = ""

        if prevPage:
            html += '<a href="'+prevPage.name+'.txt" nopush>'
            html += "&laquo; %s</a>" % _('Previous')

        html += ' '

        if nextPage:
            html += '<a href="'+nextPage.name+'.txt" nopush>'
            html += "%s &raquo;</a>" % _('Next')
            
        return html

