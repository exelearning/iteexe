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
This is the main XUL page.
"""

import logging
import gettext
import os
from twisted.web.resource     import Resource
from nevow                    import loaders, inevow, stan
from nevow.livepage           import handler, LivePage, js
from exe.webui                import common
from exe.webui.webinterface   import g_webInterface
from exe.engine.packagestore  import g_packageStore
from exe.webui.idevicepane    import IdevicePane
from exe.webui.authoringpage  import AuthoringPage
from exe.webui.outlinepane    import OutlinePane
from exe.webui.menupane       import MenuPane
from exe.webui.stylepane      import StylePane
from exe.webui.propertiespage import PropertiesPage
from exe.webui.savepage       import SavePage
from exe.webui.loadpage       import LoadPage
from exe.webui.exportpage     import ExportPage
from exe.webui.editorpage     import EditorPage
from twisted.web              import static

log = logging.getLogger(__name__)
_   = gettext.gettext

class MainPage(LivePage):
    """
    This is the main XUL page.  Responsible for handling URLs.
    Rendering and processing is delegated to the Pane classes.
    """
    
    def __init__(self, package):
        """
        Initialize a new XUL page
        """
        LivePage.__init__(self)
        self.docFactory = loaders.xmlfile(os.path.join(g_webInterface.config.exeDir, 'templates/mainpage.xul'))
        self.package = package
        # Create all the children on the left
        self.outlinePane   = OutlinePane(package)
        self.idevicePane   = IdevicePane(package)
        self.stylePane     = StylePane(package)
        # And in the main section
        self.authoringPage = AuthoringPage(self) # This is really a page now...
        self.putChild("authoring", self.authoringPage)
        self.propertiesPage = PropertiesPage()
        self.putChild("properties", self.propertiesPage)
        self.savePage = SavePage()
        self.putChild("save", self.savePage)
        self.loadpage = LoadPage(self)
        self.putChild("load", self.loadpage) 
        self.exportPage = ExportPage()
        self.putChild("export", self.exportPage)
        self.editorPage = EditorPage()
        self.putChild("editor", self.editorPage)

    def getChild(self, name, request):
        """
        Try and find the child for the name given
        """
        if name == '':
            return self
        else:
            return Resource.getChild(self, name, request)

    def process(self, request):
        """Because all posts go to our child forms now,
        self.authoringPage who receives the POST call,
        actually calls process on us, its parent
        and we in turn call process on all our trees and stuff"""
        self.outlinePane.process(request)
        self.idevicePane.process(request)
        self.stylePane.process(request)
        # TODO: Put debug info into the XUL page? (Ask if anyone needs it.
        # Could be changed into print statements on the server)

    def goingLive(self, ctx, client):
        inevow.IRequest(ctx).setHeader('content-type',
                                       'application/vnd.mozilla.xul+xml')

    def render_addChild(self, ctx, data):
        return ctx.tag(oncommand=handler(self.outlinePane.handleAddChild, js('currentOutlineId()')))

    def render_delNode(self, ctx, data):
        return ctx.tag(oncommand=handler(self.outlinePane.handleDelNode,
                       js("confirmDelete()"),
                       js('currentOutlineId()')))

    def render_renNode(self, ctx, data):
        return ctx.tag(oncommand=handler(self.outlinePane.handleRenNode,
                       js('currentOutlineId()'),
                       js('askNodeName()')))

    def render_prePath(self, ctx, data):
        request = inevow.IRequest(ctx)
        return ctx.tag(src=request.prepath[0] + '/' + ctx.tag.attributes['src'])

    def render_debugInfo(self, ctx, data):
        if log.getEffectiveLevel() == logging.DEBUG:
            # TODO: Needs to be updated by xmlhttp or xmlrpc
            request = inevow.IRequest(ctx)
            return stan.xml(('<hbox id="header">\n'
                             '    <label>%s</label>\n'
                             '    <label>%s</label>\n'
                             '</hbox>\n' %
                             (request.prepath, request.prepath[0])))
        else:
            return ''

    def render_outlinePane(self, ctx, data):
        # Create a scecial server side func that the 
        # Drag and drop js can call
        h = handler(self.outlinePane.handleDrop, identifier='outlinePane.handleDrop')
        h(ctx, data) # Calling this stores the handler...
        return stan.xml(self.outlinePane.render())

    def render_idevicePane(self, ctx, data):
        return stan.xml(self.idevicePane.render())

    def render_stylePane(self, ctx, data):
        return stan.xml(self.stylePane.render())

