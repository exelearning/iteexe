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
Export Pages functions
"""

import logging

log = logging.getLogger(__name__)


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
        self.name  = name
        self.depth = depth
        self.node  = node
        
    def renderLicense(self):
        """
        Returns an XHTML string rendering the license.
        """
        licenses = {"GNU Free Documentation License":
                     "http://www.gnu.org/copyleft/fdl.html", 
                     "Creative Commons Attribution 2.5 License":
                     "http://creativecommons.org/licenses/by/2.5/",
                     "Creative Commons Attribution-ShareAlike 2.5 License":
                     "http://creativecommons.org/licenses/by-sa/2.5/",
                     "Creative Commons Attribution-NoDerivs 2.5 License":
                     "http://creativecommons.org/licenses/by-nd/2.5/",
                     "Creative Commons Attribution-NonCommercial 2.5 License":
                     "http://creativecommons.org/licenses/by-nc/2.5/",
                     "Creative Commons Attribution-NonCommercial-ShareAlike 2.5 License":
                     "http://creativecommons.org/licenses/by-nc-sa/2.5/",
                     "Creative Commons Attribution-NonCommercial-NoDerivs 2.5 License":
                     "http://creativecommons.org/licenses/by-nc-nd/2.5/",
                     "Developing Nations 2.0":
                     "http://creativecommons.org/licenses/devnations/2.0/"}
        html = ""
        
        license = self.node.package.license
        
        if license <> "None":
            html += '<p align="center">'
            html += _("Licensed under the ")
            html += '<a href="%s">%s</a></p>' % (licenses[license], license)
            
        return html
    
    def renderFooter(self):
        """
        Returns an XHTML string rendering the footer.
        """
        html = ""
        if self.node.package.footer <> "":
            html += '<p align="center">'
            html += self.node.package.footer + "</p>"
            
        return html



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
            page.name += unicode(uniquifier)

