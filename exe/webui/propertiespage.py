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
The PropertiesPage is for user to enter or edit package's properties
"""

import logging
import gettext
from exe.webui import common
from twisted.web.resource import Resource
from exe.webui.propertiespane import PropertiesPane
from exe.webui.renderable import RenderableResource

log = logging.getLogger(__name__)
_   = gettext.gettext


class PropertiesPage(RenderableResource):
    """
    The PropertiesPage is for user to enter or edit package's properties
    """
    
    name = 'properties'

    def __init__(self, parent):
        """
        Initialize
        """
        RenderableResource.__init__(self, parent)
        self.propertiesPane = PropertiesPane(self)

    def render_GET(self, request):
        """
        Render the XHTML for the properties page
        """
        log.debug("render_GET"+ repr(request.args))
        
        # Processing
        log.info("creating the properties page")
                        
        # Rendering
        html = '\n'.join(
          ['''<?xml version="1.0" encoding="iso-8859-1"?>''',
           '''<!DOCTYPE html PUBLIC ''',
           '''"-//W3C//DTD XHTML 1.0 Strict//EN" ''',
           '''"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">''',
           '''<html xmlns="http://www.w3.org/1999/xhtml">''',
           '''<head>''',
           '''<style type="text/css">''',
           '''@import url(/css/exe.css);''',
           '''@import url(/style/default/content.css);</style>''',
           '''<script language="JavaScript" src="/scripts/common.js"></script>''',
           '''<script language="JavaScript" src="/scripts/fckeditor.js"></script>''',
           '''<script language="JavaScript" src="/scripts/libot_drag.js"></script>''',
           '''<title>eXe : elearning XHTML editor</title>''',
           '''<meta http-equiv="content-type" content="text/html;  charset=UTF-8"></meta>''',
           '''</head>'''])
        html += "<div id=\"main\"> \n"
        html += "<h3>Project Properties</h3>\n"
        html += self.propertiesPane.render()
        html += "</div> \n"
        html += "</body></html>"
        return html
    
    def render_POST(self, request):
        """
        Handles the submission of the properties form,
        creating a page that redirects the brower's top document
        back to the original package, thereby updating all the tree elements
        """
        # TODO: Make the script actually dynamically update the tree elements
        # without reloading the top form and losing our location. In fact
        # you don't even have to send this different new page,
        # You could rename the tree elements in the on submit handler or something...
        self.propertiesPane.process(request)
        log.info("after propertityPane process:"+ repr(request.args))
        return '\n'.join(
            ['<html>'
             ' <head/>',
             ' <body onload="top.location = top.location"/>',
             '</html>'])
