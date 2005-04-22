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
StylePane is responsible for creating the XHTML for the styles tab
"""

import logging
import gettext
from exe.webui import common
log = logging.getLogger(__name__)
_   = gettext.gettext


# ===========================================================================
class StylePane(object):
    """
    StylePane is responsible for creating the XHTML for the styles tab
    """
    def __init__(self, config, package):
        self.config  = config
        self.package = package

    def process(self, request):
        """ 
        Get current package
        """
        log.debug("process")
        
        if ("action" in request.args and 
            request.args["action"][0] == "ChangeStyle"):
            self.package.style = request.args["object"][0]
            
            
    def render(self):
        """
        Returns an XUL string for viewing this pane
        """
        log.debug("render")
        # Render the start tags
        xul = ('<!-- Styles Pane Start -->',
               '<listbox>',)
        # Render each style individually
        itemTemplate = """  <listitem label="%s" onclick="submitLink('ChangeStyle', '%s', 1)"/>"""
        options = [(style, style) for style in self.config.styles]
        for option, value in options:
            xul += (itemTemplate % (option, value),)
        # Render the end tags
        xul += ('</listbox>',
                '<!-- Styles Pane End -->',)
        return '\n'.join(xul) # Add in the newlines
        
    

    
# ===========================================================================
