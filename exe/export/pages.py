# ===========================================================================
# eXe
# Copyright 2004-2005, University of Auckland
# Copyright 2004-2008 eXe Project, http://eXeLearning.org/
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
Export Pages functions
"""

import logging
from urllib import quote
from exe.webui import common


log = logging.getLogger(__name__)

# List of filenames that can't be used
# Most of this names correspond to Windows reserved names and cannot be used to name folders or files
forbiddenPageNames = ['CON', 'PRN', 'AUX', 'CLOCK$', 'NUL', 
                        'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 
                        'COM6', 'COM7', 'COM8', 'COM9', 'LPT1', 
                        'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 
                        'LPT7', 'LPT8', 'LPT9']

# ===========================================================================
class Page(object):
    """
    This is an abstraction for a page containing a node
    e.g. in a SCORM package or Website
    """
    def __init__(self, name, depth, node):
        """
        Initialize
        """
        self.name = name
        self.depth = depth
        self.node = node

    def renderLicense(self):
        """
        Returns an XHTML string rendering the license.
        """
        return common.renderLicense(self.node.package.license)

    def renderFooter(self):
        """
        Returns an XHTML string rendering the footer.
        """
        return common.renderFooter(self.node.package.footer)


# ===========================================================================
def uniquifyNames(pages):
    """
    Make sure all the page names are unique
    """
    pageNames = {}

    # First identify the duplicate names
    for page in pages:
        if page.name in pageNames:
            pageNames[page.name] = 1
        else:
            pageNames[page.name] = 0

    # Then uniquify them
    for page in pages:
        uniquifier = pageNames[page.name]
        if uniquifier:
            pageNames[page.name] = uniquifier + 1
            if uniquifier > 1:
                page.name += unicode(uniquifier)
                
        # If the page name is in the forbidden list,
        # simply append an underscore at the end of it
        if page.name.upper() in forbiddenPageNames:
            page.name += '_'
        
        # for export, temporarily set this unique name on the node itself,
        # such that any links to it can use the proper target; also
        # including the quote() & ".html", as per WebsitePage's:
        page.node.tmp_export_filename = quote(page.name) + ".html"
