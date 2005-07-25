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
AuthoringPage is responsible for creating the XHTML for the authoring
area of the eXe web user interface.  
"""

import logging
import gettext
from twisted.web.resource import Resource
from exe.webui import common
from cgi import escape
from exe.webui.blockfactory    import g_blockFactory
from exe.engine.error          import Error
from exe.engine.beautifulsoup  import BeautifulSoup
from exe.webui.renderable      import RenderableResource

log = logging.getLogger(__name__)
_   = gettext.gettext

# ===========================================================================
class AuthoringPage(RenderableResource):
    """
    AuthoringPage is responsible for creating the XHTML for the authoring
    area of the eXe web user interface.  
    """
    name = u'authoring'

    def __init__(self, parent):
        """
        Initialize
        'parent' is our MainPage instance that created us
        """
        RenderableResource.__init__(self, parent)
        self.blocks  = []


    def getChild(self, name, request):
        """
        Try and find the child for the name given
        """
        if name == "":
            return self
        else:
            return Resource.getChild(self, name, request)


    def _process(self, request):
        """
        Delegates processing of args to blocks
        """  
        # Still need to call parent (mainpage.py) process
        # because the idevice pane needs to know that new idevices have been
        # added/edited..
        # TODO: Once pyxpcom comes along, we'll fix these
        self.parent.process(request)
        if ("action" in request.args and 
            request.args["action"][0] == u"saveChange"):
            log.debug(u"process savachange:::::")
            self.package.save()
            log.debug(u"package name: " + self.package.name)
        for block in self.blocks:
            block.process(request)
        log.debug(u"after authoringPage process" + repr(request.args))


    def render_GET(self, request):
        """
        Returns an XHTML string for viewing this page
        """
        log.debug(u"render")
        for key, value in request.args.items():
            request.args[key] = [unicode(value[0], 'utf8')]
        self._process(request)
        topNode     = self.package.currentNode
        self.blocks = []
        self.__addBlocks(topNode)
        html  = self.__renderHeader()
        #html += "<pre>%s</pre>\n" % str(request.args)# to be deleted
        html += u'<body onload="clearHidden();">\n'
        html += u"<form method=\"post\" "
        html += u"action=\""+request.path+"#currentBlock\""
        html += u" id=\"contentForm\">"
        html += u'<div id="main">\n'
        html += common.hiddenField(u"action")
        html += common.hiddenField(u"object")
        html += common.hiddenField(u"isChanged", u"0")
        html += u'<!-- start authoring page -->\n'
        html += u'<div id="nodeDecoration">\n'
        html += u'<p id="nodeTitle">\n'
        html += escape(topNode.title)
        html += u'</p>\n' 
        html += u'</div>\n'

        for block in self.blocks:
            html += block.render(self.package.style)

        html += u'</div>\n'
        html += common.footer()
        soup = BeautifulSoup(html, True)
        html = soup.prettify()

        return html.encode('utf8')

    render_POST = render_GET


    def __renderHeader(self):
        """Generates the header for AuthoringPage"""
        html  = common.docType()
        html += u'<html xmlns="http://www.w3.org/1999/xhtml">\n'
        html += u'<head>\n'
        html += u'<style type="text/css">\n'
        html += u'@import url(/css/exe.css);\n'
        html += u'@import url(/style/%s/content.css);\n' % self.package.style
        html += u'</style>\n'
        html += u'<script type="text/javascript" src="/scripts/common.js">'
        html += u'</script>\n'
        html += u'<script type="text/javascript" src="/scripts/fckeditor.js">'
        html += u'</script>\n'
        html += u'<script type="text/javascript" src="/scripts/libot_drag.js">'
        html += u'</script>\n'
        html += u'<title>"+_("eXe : elearning XHTML editor")+"</title>\n'
        html += u'<meta http-equiv="content-type" content="text/html; '
        html += u' charset=UTF-8" />\n'
        html += u'</head>\n'
        return html


    def __addBlocks(self, node):
        """
        Add All the blocks for the currently selected node
        """
        for idevice in node.idevices:
            block = g_blockFactory.createBlock(self, idevice)
            if not block:
                log.critical(u"Unable to render iDevice.")
                raise Error(u"Unable to render iDevice.")
            self.blocks.append(block)

# ===========================================================================
