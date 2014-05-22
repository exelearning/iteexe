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
        licenses = {"license GFDL": "http://www.gnu.org/copyleft/fdl.html",
                    "creative commons: attribution 2.5": "http://creativecommons.org/licenses/by/2.5/",
                    "creative commons: attribution - share alike 2.5": "http://creativecommons.org/licenses/by-sa/2.5/",
                    "creative commons: attribution - non derived work 2.5": "http://creativecommons.org/licenses/by-nd/2.5/",
                    "creative commons: attribution - non commercial 2.5": "http://creativecommons.org/licenses/by-nc/2.5/",
                    "creative commons: attribution - non commercial - share alike 2.5": "http://creativecommons.org/licenses/by-nc-sa/2.5/",
                    "creative commons: attribution - non derived work - non commercial 2.5": "http://creativecommons.org/licenses/by-nc-nd/2.5/",
                    "creative commons: attribution 3.0": "http://creativecommons.org/licenses/by/3.0/",
                    "creative commons: attribution - share alike 3.0": "http://creativecommons.org/licenses/by-sa/3.0/",
                    "creative commons: attribution - non derived work 3.0": "http://creativecommons.org/licenses/by-nd/3.0/",
                    "creative commons: attribution - non commercial 3.0": "http://creativecommons.org/licenses/by-nc/3.0/",
                    "creative commons: attribution - non commercial - share alike 3.0": "http://creativecommons.org/licenses/by-nc-sa/3.0/",
                    "creative commons: attribution - non derived work - non commercial 3.0": "http://creativecommons.org/licenses/by-nc-nd/3.0/",
                    "creative commons: attribution 4.0": "http://creativecommons.org/licenses/by/4.0/",
                    "creative commons: attribution - share alike 4.0": "http://creativecommons.org/licenses/by-sa/4.0/",
                    "creative commons: attribution - non derived work 4.0": "http://creativecommons.org/licenses/by-nd/4.0/",
                    "creative commons: attribution - non commercial 4.0": "http://creativecommons.org/licenses/by-nc/4.0/",
                    "creative commons: attribution - non commercial - share alike 4.0": "http://creativecommons.org/licenses/by-nc-sa/4.0/",
                    "creative commons: attribution - non derived work - non commercial 4.0": "http://creativecommons.org/licenses/by-nc-nd/4.0/",
                    "free software license GPL": "http://www.gnu.org/copyleft/gpl.html"
                   }
        licenses_names = {"license GFDL": c_("GNU Free Documentation License"),
                          "creative commons: attribution 2.5": c_("Creative Commons Attribution License 2.5"),
                          "creative commons: attribution - share alike 2.5": c_("Creative Commons Attribution Share Alike License 2.5"),
                          "creative commons: attribution - non derived work 2.5": c_("Creative Commons Attribution No Derivatives License 2.5"),
                          "creative commons: attribution - non commercial 2.5": c_("Creative Commons Attribution Non-commercial License 2.5"),
                          "creative commons: attribution - non commercial - share alike 2.5": c_("Creative Commons Attribution Non-commercial Share Alike License 2.5"),
                          "creative commons: attribution - non derived work - non commercial 2.5": c_("Creative Commons Attribution Non-commercial No Derivatives License 2.5"),
                          "creative commons: attribution 3.0": c_("Creative Commons Attribution License 3.0"),
                          "creative commons: attribution - share alike 3.0": c_("Creative Commons Attribution Share Alike License 3.0"),
                          "creative commons: attribution - non derived work 3.0": c_("Creative Commons Attribution No Derivatives License 3.0"),
                          "creative commons: attribution - non commercial 3.0": c_("Creative Commons Attribution Non-commercial License 3.0"),
                          "creative commons: attribution - non commercial - share alike 3.0": c_("Creative Commons Attribution Non-commercial Share Alike License 3.0"),
                          "creative commons: attribution - non derived work - non commercial 3.0": c_("Creative Commons Attribution Non-commercial No Derivatives License 3.0"),
                          "creative commons: attribution 4.0": c_("Creative Commons Attribution License 4.0"),
                          "creative commons: attribution - share alike 4.0": c_("Creative Commons Attribution Share Alike License 4.0"),
                          "creative commons: attribution - non derived work 4.0": c_("Creative Commons Attribution No Derivatives License 4.0"),
                          "creative commons: attribution - non commercial 4.0": c_("Creative Commons Attribution Non-commercial License 4.0"),
                          "creative commons: attribution - non commercial - share alike 4.0": c_("Creative Commons Attribution Non-commercial Share Alike License 4.0"),
                          "creative commons: attribution - non derived work - non commercial 4.0": c_("Creative Commons Attribution Non-commercial No Derivatives License 4.0"),
                          "free software license GPL": c_("GNU General Public License")
                         }

        html = ""

        plicense = self.node.package.license

        if plicense in licenses:
            html += '<p align="center">'
            html += c_("Licensed under the")
            html += ' <a rel="license" href="%s">%s</a>' % (licenses[plicense], licenses_names[plicense])
            if plicense == 'license GFDL':
                html += ' <a href="fdl.html">(%s)</a>' % c_('Local Version')
            html += '</p>'

        return html

    def renderFooter(self):
        """
        Returns an XHTML string rendering the footer.
        """
        dT = common.getExportDocType()
        footerTag = "div"
        if dT == "HTML5":
            footerTag = "footer"

        html = ""
        if self.node.package.footer != "":
            html += '<' + footerTag + ' id="siteFooter">'
            html += self.node.package.footer + "</" + footerTag + ">"

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
        # for export, temporarily set this unique name on the node itself,
        # such that any links to it can use the proper target; also
        # including the quote() & ".html", as per WebsitePage's:
        page.node.tmp_export_filename = quote(page.name) + ".html"
