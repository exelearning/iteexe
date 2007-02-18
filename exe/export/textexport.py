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
TextPageExport will export a package as a text file.
"""

import os
from cgi                      import escape
from exe.webui.blockfactory   import g_blockFactory
from exe.engine.error         import Error
from exe.engine.path          import Path
from exe.engine.htmlToText    import HtmlToText

import logging
log = logging.getLogger(__name__)


# ===========================================================================
class TextExport(object):
    """
    TextExport will export a package as a text file
    """
    def __init__(self, filename):
        
        self.html         = ""
        self.filename         = filename

    def export(self, package):
        """ 
        Export web site
        Cleans up the previous packages pages and performs the export
        """
        
        self.html  = "***" + escape(package.title) + "***"
        self.renderNode(package.root)
        if package.license <> "None":
            self.html += "<br/>***" + _("Licensed under the ")
            self.html += package.license + "***<br/>"
        if package.footer <> "":
            self.html += "<p>" + package.footer + "</p>"
        self.save(self.filename)


    
    def renderNode(self, node):
        """
        Returns an XHTML string for this node and recurse for the children
        """

        self.html += os.linesep*2 + "**" + escape(node.titleLong) + "**"


        for idevice in node.idevices:
            block = g_blockFactory.createBlock(None, idevice)
            if not block:
                log.critical("Unable to render iDevice.")
                raise Error("Unable to render iDevice.")
            if hasattr(idevice, 'isCloze'):
                self.html += block.renderText()
            else:
                self.html += block.renderView('default')

        for child in node.children:
            self.renderNode(child)
        print self.html

    def save(self, filename):
        """
        Save page to a file.  
        """
        converter = HtmlToText(self.html)
        text = converter.convertToText()
        outfile = open(filename, "w")
        outfile.write(text.encode('utf8'))
        outfile.close()
        
# ===========================================================================
