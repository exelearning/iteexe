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
from exe import globals as G


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
    Make sure all the page names are unique.
    If the config option for compatibility with ISO 9660 is enabled,
    cut the page names accordingly.
    """
    page_names = []

    # Extension
    extension = 'html'
    if G.application.config.cutFileName == '1':
        extension = 'htm'

    # Go through all the pages finding duplicates (and cutting names)
    for page in pages:
        page_name = page.name

        # If ISO9660 compatibility is enabled, cut file name to
        # 8 chars
        if G.application.config.cutFileName == '1':
            page_name = page_name[:8]

        # If the page name is in the forbidden list,
        # simply append an underscore at the end of it
        if page.name.upper() in forbiddenPageNames:
            page_name += '_'

        # Try to find a page name that doesn't exist
        duplicates = 0
        while page_name in page_names:
            # The first time add the number, the following replace the previous one
            if duplicates == 0:
                # Add number at the end or replace the last char if ISO9660 compatibility
                # is enabled and the name is 8 chars long
                if G.application.config.cutFileName == '1' and len(page_name) == 8:
                    page_name = page_name[:-1] + unicode(duplicates)
                else:
                    page_name += unicode(duplicates)
            else:
                # Replace previous number (if ISO9660 is enabled and we already
                # filled the 8 chars, ensure we keep it in 8 chars)
                if G.application.config.cutFileName == '1' and len(page_name) == 8:
                    page_name = page_name[:-len(str(duplicates))] + unicode(duplicates)
                else:
                    page_name = page_name[:-len(str(duplicates - 1))] + unicode(duplicates)

            duplicates += 1

        # We have a unique page name, save it so we can use it in the following ones
        page_names.append(page_name)

        # Save page name on page info
        page.name = page_name
        # For export, temporarily set this unique name on the node itself,
        # such that any links to it can use the proper target; also
        # including the quote() & ".html", as per WebsitePage's:
        page.node.tmp_export_filename = quote(page_name) + '.' +  extension
