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

import os
import sys
import logging
import traceback
from twisted.web                 import static
from twisted.internet            import reactor
from twisted.internet.defer      import Deferred
from nevow                       import loaders, inevow, stan, tags, url, util
from nevow.livepage              import js, IClientHandle
from exe.xului.idevicepane       import IdevicePane
from exe.xului.outlinepane       import OutlinePane
from exe.xului.stylemenu         import StyleMenu
from exe.webui.renderable        import RenderableLivePage
from exe.webui.propertiespage    import PropertiesPage
from exe.webui.authoringpage     import AuthoringPage
from exe.export.websiteexport    import WebsiteExport
from exe.export.singlepageexport import SinglePageExport
from exe.export.scormexport      import ScormExport
from exe.export.imsexport        import IMSExport
from exe.engine.path             import Path

log = logging.getLogger(__name__)


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
        self.putChild("resources", static.File(package.resourceDir))

        mainxul = Path(self.config.xulDir).joinpath('templates', 'mainpage.xul')
        self.docFactory  = loaders.xmlfile(mainxul)

        # Create all the children on the left
        self.outlinePane = OutlinePane(self)
        self.idevicePane = IdevicePane(self)
        self.styleMenu   = StyleMenu(self)

        # And in the main section
        self.authoringPage  = AuthoringPage(self)
        self.propertiesPage = PropertiesPage(self)

    def _closeComplete(self, failure=None):
        """
        We override this from nevow.livepage's implementation
        to fix a bug in livepage
        """
        import pdb
        pdb.set_trace()
        if self.closed:
            return
        self.closed = True
        # TODO: As soon as livepage adds this line in their code, we won't need
        # to override this method anymore
        if self.timeoutLoop.running:
            self.timeoutLoop.stop()
        self.timeoutLoop = None
        for notify in self.closeNotifications[:]:
            if failure is not None:
                notify.errback(failure)
            else:
                notify.callback(None)
        self.closeNotifications = []

    def onClose(self, reason, data=None):
        """
        Called when the user has closed the window
        """
        print 'Closing', reason
        if self.package.isChanged:
            self.package.save(self.config.configDir/'unsavedWork.elp', True)

    def getChild(self, name, request):
        """
        Try and find the child for the name given
        """
        if name == '':
            return self
        else:
            return super(self, self.__class__).getChild(self, name, request)

    def renderHTTP(self, ctx):
        """Called each time the page is served/refreshed"""
        inevow.IRequest(ctx).setHeader('content-type',
                                       'application/vnd.mozilla.xul+xml')
        RenderableLivePage.renderHTTP(self, ctx)

    # Render Methods

    def render_addChild(self, ctx, data):
        """Fills in the oncommand handler for the 
        add child button and short cut key"""
        return ctx.tag(oncommand = js.server.handle('outlinePane.addChild',
                                                    js.currentOutlineId()))

    def render_delNode(self, ctx, data):
        """Fills in the oncommand handler for the 
        delete child button and short cut key"""
        return ctx.tag(oncommand = js.server.handle('outlinePane.delNode',
                                                    js.confirmDelete(),
                                                    js.currentOutlineId()))

    def render_renNode(self, ctx, data):
        """Fills in the oncommand handler for the 
        rename node button and short cut key"""
        return ctx.tag(oncommand = js.server.handle('outlinePane.renNode',
                                                    js.currentOutlineId(),
                                                    js.askNodeName()))

    def render_prePath(self, ctx, data):
        """Fills in the package name to certain urls in the xul"""
        request = inevow.IRequest(ctx)
        return ctx.tag(src = self.package.name + '/' + ctx.tag.attributes['src'])

    # The node moving buttons

    def render_promote(self, ctx, data):
        """Fills in the oncommand handler for the 
        Promote button and shortcut key"""
        return ctx.tag(oncommand = js.server.handle('outlinePane.promote',
                                                    js.currentOutlineId()))

    def render_demote(self, ctx, data):
        """Fills in the oncommand handler for the 
        Demote button and shortcut key"""
        return ctx.tag(oncommand = js.server.handle('outlinePane.demote',
                                                    js.currentOutlineId()))

    def render_up(self, ctx, data):
        """Fills in the oncommand handler for the 
        Up button and shortcut key"""
        return ctx.tag(oncommand = js.server.handle('outlinePane.up',
                                                    js.currentOutlineId()))

    def render_down(self, ctx, data):
        """Fills in the oncommand handler for the 
        Down button and shortcut key"""
        return ctx.tag(oncommand = js.server.handle('outlinePane.down',
                                                    js.currentOutlineId()))

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

    def render_liveglue(self, ctx, data):
        """
        Here we override and replace what livepage.py does.
        We tell the browser where to find nevow_glue.js properly
        """
        # Get the clientHandle
        client = self.clientFactory.newClientHandle(self, 0, 0)
        ctx.remember(client)
        self.client = client
        # Sign up to know the connection is closed
        d = Deferred()
        d.addCallbacks(self.onClose, self.onClose)
        client.closeNotifications.append(d)
        # Render the js
        handleId = "'", client.handleId, "'"
        return [
            tags.script(language="JavaScript")[
                "var nevow_clientHandleId = ", handleId ,";"],
            tags.script(language="JavaScript",
                        src='/xulscripts/nevow_glue.js')
            ]

    def handle_isPackageDirty(self, ctx, ifClean='', ifDirty=''):
        """
        Called by js to know if the package is dirty or not.
        ifClean is JavaScript to be evaled on the client if the package has
        been changed 
        ifDirty is JavaScript to be evaled on the client if the package has not
        been changed
        """
        client = IClientHandle(ctx)
        if self.package.isChanged:
            client.send(js(ifDirty))
        else:
            client.send(js(ifClean))


    def handle_packageFileName(self, ctx, onDone, onDoneParam):
        """
        Calls the javascript func named by 'onDone' passing as the
        only parameter the filename of our package. If the package
        has never been saved or loaded, it passes an empty string
        'onDoneParam' will be passed to onDone as a param after the
        filename
        """
        client = IClientHandle(ctx)
        client.call(onDone, Path(self.package.filename), onDoneParam)


    def handle_savePackage(self, ctx, filename=None, onDone=None):
        """Save the current package
        'filename' is the filename to save the package to
        'onDone' will be evaled after saving instead or redirecting
        to the new location (in cases of package name changes).
        (This is used where the user goes file|open when their 
        package is changed and needs saving)
        """
        client     = IClientHandle(ctx)
        filename   = Path(filename)
        exportDir  = filename.dirname()
        if exportDir and not exportDir.exists():
            client.alert(_(u'Cannot access directory named ') +
                         unicode(exportDir) +
                         _(u'. Please use ASCII names.'))
            return
        
        oldName = self.package.name
        # If the script is not passing a filename to us,
        # Then use the last filename that the package was loaded from/saved to
        if not filename:
            filename = self.package.filename
            assert (filename, 
                    ('Somehow save was called without a filename '
                     'on a package that has no default filename.'))
        # Add the extension if its not already there
        if not filename.lower().endswith('.elp'):
            filename += '.elp'
        self.package.save(filename) # This can change the package name
        # Delete the "unsavedWork.elp' file so it's not loaded next time we
        # start exe
        (self.config.configDir/'unsavedWork.elp').remove()
        # Tell the user and continue
        client.alert(_(u'Package saved to: %s' % filename))
        if onDone:
            client.send(js(onDone))
        elif self.package.name != oldName:
            # Redirect the client if the package name has changed
            self.webServer.root.putChild(self.package.name, self)
            log.info('Package saved, redirecting client to /%s'
                     % self.package.name)
            client.send(js(u'top.location = "/%s"' %
                           self.package.name.encode('utf8')))


    def handle_loadPackage(self, ctx, filename):
        """Load the package named 'filename'"""
        print 'LOAD PACKAGE'
        client = IClientHandle(ctx)
        try:
            filename = unicode(filename, 'utf8')
            log.debug("filename and path" + filename)
            packageStore = self.webServer.application.packageStore
            package = packageStore.loadPackage(filename)
            self.root.bindNewPackage(package)
            client.send(js((u'top.location = "/%s"' % 
                            package.name).encode('utf8')))
        except Exception, exc:
            if log.getEffectiveLevel() == logging.DEBUG:
                client.alert(_(u'Sorry, wrong file format:\n%s') % unicode(exc))
            else:
                client.alert(_(u'Sorry, wrong file format'))
            log.error((u'Error loading package "%s": %s') % \
                      (filename, unicode(exc)))
            log.error((u'Traceback:\n%s' % traceback.format_exc()))
            raise

    def handle_pageUnloaded(self, ctx):
        """
        Called after a refresh or window close. Save the page
        """
        # Save the package in the config dir
        self.client.send(js.alert('Page Unloaded Matey'))
        self.package.save(self.config.configDir/'unsavedWork.elp', True)

    def handle_export(self, ctx, exportType, filename):
        """
        Called by js. 
        'exportType' can be one of 'scormMeta' 'scormNoMeta' 'scormNoScormType'
        'webSite'
        Exports the current package to one of the above formats
        'filename' is a file for scorm pages, and a directory for websites
        """ 
        client     = IClientHandle(ctx)
        webDir     = Path(self.config.webDir)
        stylesDir  = webDir.joinpath('style', self.package.style)

        exportDir  = Path(filename).dirname()
        if exportDir and not exportDir.exists():
            client.alert(_(u'Cannot access directory named ') +
                         unicode(exportDir) +
                         _(u'. Please use ASCII names.'))
            return

        if exportType == 'singlePage':
            self.exportSinglePage(client, filename, webDir, stylesDir)

        elif exportType == 'webSite':
            self.exportWebSite(client, filename, webDir, stylesDir)

        elif exportType == "scorm":
            self.exportScorm(client, filename, stylesDir)

        else:
            self.exportIMS(client, filename, stylesDir)


    def exportSinglePage(self, ctx, filename, webDir, stylesDir):
        """
        Export 'client' to a single web page,
        'webDir' is just read from config.webDir
        'stylesDir' is where to copy the style sheet information from
        """
        client     = IClientHandle(ctx)
        imagesDir  = webDir.joinpath('images')
        scriptsDir = webDir.joinpath('scripts')
        # filename is a directory where we will export the website to
        # We assume that the user knows what they are doing
        # and don't check if the directory is already full or not
        # and we just overwrite what's already there
        filename = Path(filename)
        # Append the package name to the folder path if necessary
        if filename.basename() != self.package.name:
            filename /= self.package.name
        if not filename.exists():
            filename.makedirs()
        elif not filename.isdir():
            client.alert(_(u'Filename %s is a file, cannot replace it') % 
                         filename)
            log.error("Couldn't export web page: "+
                      "Filename %s is a file, cannot replace it" % filename)
            return
        else:
            # Wipe it out
            filename.rmtree()
            filename.mkdir()
        # Now do the export
        singlePageExport = SinglePageExport(stylesDir, filename, 
                                            imagesDir, scriptsDir)
        singlePageExport.export(self.package)
        # Show the newly exported web site in a new window
        if hasattr(os, 'startfile'):
            os.startfile(filename)
        else:
            filename /= 'index.html'
            os.system("firefox "+filename+"&")


    def exportWebSite(self, ctx, filename, webDir, stylesDir):
        """
        Export 'client' to a web site,
        'webDir' is just read from config.webDir
        'stylesDir' is where to copy the style sheet information from
        """
        client     = IClientHandle(ctx)
        imagesDir  = webDir.joinpath('images')
        scriptsDir = webDir.joinpath('scripts')
        # filename is a directory where we will export the website to
        # We assume that the user knows what they are doing
        # and don't check if the directory is already full or not
        # and we just overwrite what's already there
        filename = Path(filename)
        # Append the package name to the folder path if necessary
        if filename.basename() != self.package.name:
            filename /= self.package.name
        if not filename.exists():
            filename.makedirs()
        elif not filename.isdir():
            client.alert(_(u'Filename %s is a file, cannot replace it') % 
                         filename)
            log.error("Couldn't export web page: "+
                      "Filename %s is a file, cannot replace it" % filename)
            return
        else:
            # Wipe it out
            filename.rmtree()
            filename.mkdir()
        # Now do the export
        websiteExport = WebsiteExport(stylesDir, filename, 
                                      imagesDir, scriptsDir)
        websiteExport.export(self.package)
        # Show the newly exported web site in a new window
        if hasattr(os, 'startfile'):
            os.startfile(filename)
        else:
            filename /= 'index.html'
            os.system("firefox "+filename+"&")


    def exportScorm(self, client, filename, stylesDir):
        """
        Exports this package to a scorm package file
        """
        filename = Path(filename)
        log.debug(u"exportScorm, filaneme=%s" % filename)
        # Append an extension if required
        #if not filename.lower().endswith('.zip'): 
        if not filename.ext.lower() == '.zip': 
            filename += '.zip'
        # Remove any old existing files
        if filename.exists(): 
            filename.remove()
        # Do the export
        scormExport = ScormExport(self.config, stylesDir, filename)
        scormExport.export(self.package)
        client.alert(_(u'Exported to %s') % filename)


    def exportIMS(self, client, filename, stylesDir):
        """
        Exports this package to a ims package file
        """
        log.debug(u"exportIMS")
        # Append an extension if required
        if not filename.lower().endswith('.zip'): 
            filename += '.zip'
        filename = Path(filename)
        # Remove any old existing files
        if filename.exists(): 
            filename.remove()
        # Do the export
        imsExport = IMSExport(self.config, stylesDir, filename)
        imsExport.export(self.package)
        client.alert(_(u'Exported to %s' % filename))
