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
from exe.webui.renderable     import RenderableLivePage
from exe.webui.idevicepane    import IdevicePane
from exe.webui.authoringpage  import AuthoringPage
from exe.webui.outlinepane    import OutlinePane
from exe.webui.stylepane      import StylePane
from exe.webui.propertiespage import PropertiesPage
from exe.webui.exportpage     import ExportPage
from exe.webui.editorpage     import EditorPage

log = logging.getLogger(__name__)
_   = gettext.gettext


class MainPage(RenderableLivePage):
    """
    This is the main XUL page.  Responsible for handling URLs.
    Rendering and processing is delegated to the Pane classes.
    """
    
    _templateFileName = 'mainpage.xul'
    name = 'to_be_defined'
    
    def __init__(self, parent, package):
        """
        Initialize a new XUL page
        'package' is the package that we look after
        """
        self.name = package.name
        RenderableLivePage.__init__(self, parent, package)
        path = os.path.join(self.config.exeDir, 'templates', 'mainpage.xul')
        self.docFactory = loaders.xmlfile(path)

        # Create all the children on the left
        self.outlinePane = OutlinePane(self)
        self.idevicePane = IdevicePane(self)
        self.stylePane   = StylePane(self)
        # And in the main section
        self.authoringPage = AuthoringPage(self)
        self.propertiesPage = PropertiesPage(self)
        self.exportPage = ExportPage(self)
        self.editorPage = EditorPage(self)


    def getChild(self, name, request):
        """
        Try and find the child for the name given
        """
        if name == '':
            return self
        else:
            return super(self, self.__class__).getChild(self, name, request)

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
        setUpHandler(self.handlePackageFileName, 'getPackageFileName')
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
        return ctx.tag(src=self.package.name + '/' + ctx.tag.attributes['src'])


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
                             (request.prepath, self.package.name)))
        else:
            return ''


    def render_idevicePane(self, ctx, data):
        """Renders the idevice pane"""
        return stan.xml(self.idevicePane.render())


    def render_stylePane(self, ctx, data):
        """Renders the style pane"""
        return stan.xml(self.stylePane.render())


    def handleIsPackageDirty(self, client, ifClean, ifDirty):
        """
        Called by js to know if the package is dirty or not.
        ifClean is JavaScript to be evaled on the client if the package has
        been changed 
        ifDirty is JavaScript to be evaled on the client if the package has not
        been changed
        """
        if self.package.isChanged:
            client.sendScript(ifDirty)
        else:
            client.sendScript(ifClean)

    def handlePackageFileName(self, client, onDone):
        """
        Calls the javascript func named by 'onDone' passing as the
        only parameter the filename of our package. If the package
        has never been saved or loaded, it passes an empty string
        """
        client.call(onDone, self.package.filename)

    def handleSavePackage(self, client, filename=None):
        """Save the current package"""
        oldName = self.package.name
        self.package.save(filename)
        # Redirect the client if the package name has changed
        if self.package.name != oldName:
            self.webserver.root.delEntity(oldName)
            self.webserver.root.putChild(self.package.name, self)
            client.sendScript('top.location = "/%s"' % self.package.name)


    def handleLoadPackage(self, client, filename):
        """Load the package named 'filename'"""
        try:
            log.debug("filename and path" + filename)
            packageStore = self.webserver.application.packageStore
            package = packageStore.loadPackage(filename)
            self.root.bindNewPackage(package)
            client.sendScript('top.location = "/%s"' % package.name)
        except Exception, e:
            #from exe.webui.mainpage import MainPage
            client.sendScript('alert("Sorry, wrong file format")')
            client.sendScript('alert("%s")' % str(e))
            log.error('Error loading package "%s": %s' % (filename, str(e)))
            self.error = True
            raise
            return
