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
from exe.engine.packagestore  import g_packageStore
from exe.webui.webinterface   import g_webInterface
from exe.webui.idevicepane    import IdevicePane
from exe.webui.authoringpage  import AuthoringPage
from exe.webui.outlinepane    import OutlinePane
from exe.webui.stylepane      import StylePane
from exe.webui.propertiespage import PropertiesPage
from exe.webui.savepage       import SavePage
from exe.webui.exportpage     import ExportPage
from exe.webui.editorpage     import EditorPage

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
        path = os.path.join(g_webInterface.config.exeDir,
                            'templates', 'mainpage.xul')
        self.docFactory = loaders.xmlfile(path)
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
        """Called each time the page is served/refreshed"""
        inevow.IRequest(ctx).setHeader('content-type',
                                       'application/vnd.mozilla.xul+xml')
        # Set up named server side funcs that js can call
        def setUpHandler(func, name, *args, **kwargs):
            kwargs['identifier'] = name
            hndlr = handler(func, *args, **kwargs)
            hndlr(ctx, client) # Stores it
        setUpHandler(self.handleIsPackageDirty, 'isPackageDirty')
        setUpHandler(self.handleSavePackage, 'savePackage')
        setUpHandler(self.handleLoadPackage, 'loadPackage')

    def render_addChild(self, ctx, data):
        """Fills in the oncommand handler for the 
        add child button and short cut key"""
        return ctx.tag(oncommand=handler(self.outlinePane.handleAddChild,
                       js('currentOutlineId()')))

    def render_delNode(self, ctx, data):
        """Fills in the oncommand handler for the 
        delete child button and short cut key"""
        return ctx.tag(oncommand=handler(self.outlinePane.handleDelNode,
                       js("confirmDelete()"),
                       js('currentOutlineId()')))

    def render_renNode(self, ctx, data):
        """Fills in the oncommand handler for the 
        rename node button and short cut key"""
        return ctx.tag(oncommand=handler(self.outlinePane.handleRenNode,
                       js('currentOutlineId()'),
                       js('askNodeName()')))

    def render_prePath(self, ctx, data):
        """Fills in the package name to certain urls in the xul"""
        request = inevow.IRequest(ctx)
        return ctx.tag(src=request.prepath[0] + '/' + ctx.tag.attributes['src'])

    # The node moving buttons
    def _passHandle(self, ctx, name):
        """Ties up a handler for the promote, demote,
        up and down buttons. (Called by below funcs)"""
        attr = getattr(self.outlinePane, 'handle%s' % name)
        return ctx.tag(oncommand=handler(attr, js('currentOutlineId()')))

    def render_promote(self, ctx, data):
        """Fills in the oncommand handler for the 
        Promote button and shortcut key"""
        return self._passHandle(ctx, 'Promote')

    def render_demote(self, ctx, data):
        """Fills in the oncommand handler for the 
        Demote button and shortcut key"""
        return self._passHandle(ctx, 'Demote')

    def render_up(self, ctx, data):
        """Fills in the oncommand handler for the 
        Up button and shortcut key"""
        return self._passHandle(ctx, 'Up')

    def render_down(self, ctx, data):
        """Fills in the oncommand handler for the 
        Down button and shortcut key"""
        return self._passHandle(ctx, 'Down')

    def render_debugInfo(self, ctx, data):
        """Renders debug info to the top
        of the screen if logging is set to debug level
        """
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
        """Renders the outline tree"""
        # Create a scecial server side func that the 
        # Drag and drop js can call
        dropHandler = handler(self.outlinePane.handleDrop,
                              identifier='outlinePane.handleDrop')
        # The below call stores the handler so we can call it
        # as a server 
        dropHandler(ctx, data) 
        return stan.xml(self.outlinePane.render())

    def render_idevicePane(self, ctx, data):
        """Renders the idevice pane"""
        return stan.xml(self.idevicePane.render())

    def render_stylePane(self, ctx, data):
        """Renders the style pane"""
        return stan.xml(self.stylePane.render())

    def handleIsPackageDirty(self, client):
        """Called by js to know if the package is dirty or not"""
        if self.package.isChanged: client.sendScript('isPackageDirty = true')
        else: client.sendScript('isPackageDirty = false')
        print 'package dirty = ', self.package.isChanged

    def handleSavePackage(self, client):
        """Save the current package"""
        self.package.save()
        print 'package saved'

    def handleLoadPackage(self, client, filename):
        """Load the current package"""
        print 'loading package', filename
        try:  
            log.debug("filename and path" + filename)
            package = g_packageStore.loadPackage(filename)
            from exe.webui.mainpage import MainPage
            mainPage = MainPage(package)
            g_webInterface.rootPage.putChild(package.name, mainPage)
            client.sendScript('top.location = "/%s"' % package.name)
        except Exception, e:
            print 'ERROR:',
            print str(e)
            client.sendScript('alert("Sorry, wrong file format")')
            log.error('Error loading package "%s": %s' % (filename, str(e)))
            self.error = True
            return
        print 'package loaded'
