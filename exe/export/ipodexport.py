# ===========================================================================
# eXe 
# Copyright 2004-2005, University of Auckland
# Copyright 2007 Tairawhiti Polytechnic
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
IpodExport will export a package as a folder full of iPod Notes
"""

import logging
import re
from cgi                      import escape
from exe.webui.blockfactory   import g_blockFactory
from exe.engine.error         import Error
from exe.engine.path          import Path, TempDirPath
from exe.export.pages         import uniquifyNames
from exe.export.ipodpage      import IpodPage

log = logging.getLogger(__name__)

# ===========================================================================
class IpodExport(object):
    """
    IpodExport will export a package as iPod folder tree
    """
    def __init__(self, config, filename):
        """
        'outputDir' is the directory that will be [over]written
        """
        self.config       = config
        self.filename     = Path(filename)
        self.pages        = []

    def export(self, package):
        """ 
        Export as iPod notes
        Cleans up the previous packages pages and performs the export
        """
        outputDir = self.filename
        if not outputDir.exists(): 
            outputDir.mkdir()
        fileDir = outputDir/"{files}"
        fileDir.mkdir()

        self.pages = [ IpodPage("index", 1, package.root) ]
        self.generatePages(package.root, 1)
        uniquifyNames(self.pages)

        prevPage = None
        thisPage = self.pages[0]

        for nextPage in self.pages[1:]:
            thisPage.save(fileDir, prevPage, nextPage, self.pages)
            prevPage = thisPage
            thisPage = nextPage

        thisPage.save(fileDir, prevPage, None, self.pages)
        self.writeNavigation(outputDir, package)

    def generatePages(self, node, depth):
        """
        Recursively generate pages and store in pages member variable
        for retrieving later
        """           
        for child in node.children:
            pageName = child.titleShort.lower().replace(" ", "_")
            pageName = re.sub(r"\W", "", pageName)
            if not pageName:
                pageName = "__"

            self.pages.append(IpodPage(pageName, depth, child))
            self.generatePages(child, depth + 1)

    def writeNavigation(self, outputDir, package):
        html = "<title>%s</title>\n" % escape(package.title)
        for page in self.pages:
            html += '<a href="{files}/%s.txt" nopush>%s%s</a>\n' % (
                    page.name,
                    '  ' * page.depth,
                    page.node.titleShort)

        outfile = open(outputDir / "index.linx", "wt")
        outfile.write(html)
        outfile.close()

