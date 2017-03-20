#!/usr/bin/python
# -*- coding: utf-8 -*-
# ===========================================================================
# eXe
# Copyright 2012, Pedro Peña Pérez, Open Phoenix IT
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
# Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
# ===========================================================================

"""
This is the main Javascript page.
"""

import os
import json
import sys
import logging
import traceback
import shutil
import tempfile
import uuid
import base64
from exe.engine.version          import release, revision
from twisted.internet            import threads, reactor, defer
from exe.webui.livepage          import RenderableLivePage,\
    otherSessionPackageClients, allSessionClients, allSessionPackageClients
from nevow                       import loaders, inevow, tags
from nevow.livepage              import handler, IClientHandle
from exe.jsui.idevicepane        import IdevicePane
from exe.jsui.outlinepane        import OutlinePane
from exe.jsui.recentmenu         import RecentMenu
from exe.jsui.stylemenu          import StyleMenu
from exe.jsui.propertiespage     import PropertiesPage
from exe.webui.authoringpage     import AuthoringPage
from exe.webui.stylemanagerpage  import StyleManagerPage
from exe.webui.renderable        import File, Download
from exe.export.websiteexport    import WebsiteExport
from exe.export.textexport       import TextExport
from exe.export.singlepageexport import SinglePageExport
from exe.export.scormexport      import ScormExport
from exe.export.imsexport        import IMSExport
from exe.export.xliffexport      import XliffExport
from exe.importers.xliffimport   import XliffImport
from exe.importers.scanresources import Resources
from exe.engine.path             import Path, toUnicode, TempDirPath
from exe.engine.package          import Package
from exe                         import globals as G
from tempfile                    import mkstemp
from exe.engine.mimetex          import compile
from urllib                      import unquote, urlretrieve
from exe.engine.locationbuttons  import LocationButtons
from exe.export.epub3export      import Epub3Export
from exe.export.xmlexport        import XMLExport
from requests_oauthlib           import OAuth2Session
from exe.webui.oauthpage         import ProcomunOauth
from suds.client                 import Client

from exe.engine.lom import lomsubs
from exe.engine.lom.lomclassification import Classification
import zipfile
log = logging.getLogger(__name__)
PROCOMUN_WSDL = ProcomunOauth.BASE_URL + '/oauth_services?wsdl'


class MainPage(RenderableLivePage):
    """
    This is the main Javascript page.  Responsible for handling URLs.
    """

    _templateFileName = 'mainpage.html'
    name = 'to_be_defined'

    def __init__(self, parent, package, session, config):
        """
        Initialize a new Javascript page
        'package' is the package that we look after
        """
        self.name = package.name
        self.session = session
        RenderableLivePage.__init__(self, parent, package, config)
        self.putChild("resources", File(package.resourceDir))
        self.tempDir = TempDirPath()
        self.putChild("temp", Download(self.tempDir, 'application/octet-stream', ('*')))
        # styles directory
        # self.putChild("stylecss", File(self.config.stylesDir)

        mainjs = Path(self.config.jsDir).joinpath('templates', 'mainpage.html')
        self.docFactory = loaders.htmlfile(mainjs)

        # Create all the children on the left
        self.outlinePane = OutlinePane(self)
        self.idevicePane = IdevicePane(self)
        self.styleMenu = StyleMenu(self)
        self.recentMenu = RecentMenu(self)

        # And in the main section
        self.propertiesPage = PropertiesPage(self)
        self.authoringPage = None
        self.previewPage = None
        self.printPage = None
        self.authoringPages = {}
        self.classificationSources = {}

        G.application.resourceDir = Path(package.resourceDir)

        self.location_buttons = LocationButtons()

    def __repr__(self):
        return super(MainPage, self).__repr__() + repr(self.authoringPages)

    def child_authoring(self, ctx):
        """
        Returns the authoring page that corresponds to
        the url http://127.0.0.1:port/package_name/authoring
        """
        request = inevow.IRequest(ctx)
        if 'clientHandleId' in request.args:
            clientid = request.args['clientHandleId'][0]
            if clientid not in self.authoringPages:
                self.authoringPages[clientid] = AuthoringPage(self)
                self.children.pop('authoring')
            return self.authoringPages[clientid]
        else:
            raise Exception('No clientHandleId in request')

    def child_preview(self, ctx):
        if not self.package.previewDir:
            stylesDir = self.config.stylesDir / self.package.style
            self.package.previewDir = TempDirPath()
            self.exportWebSite(None, self.package.previewDir, stylesDir)
            self.previewPage = File(self.package.previewDir / self.package.name)
        return self.previewPage

    def child_print(self, ctx):
        if not self.package.printDir:
            stylesDir = self.config.stylesDir / self.package.style
            self.package.printDir = TempDirPath()
            self.exportSinglePage(None, self.package.printDir, self.config.webDir, stylesDir, True)
            self.printPage = File(self.package.printDir / self.package.name)
        return self.printPage

    def child_taxon(self, ctx):
        """
        Doc
        """
        request = inevow.IRequest(ctx)
        data = []
        if 'source' in request.args:
            if 'identifier' in request.args:
                source = request.args['source'][0]
                if source:
                    if source not in self.classificationSources:

                        self.classificationSources[source] = Classification()
                        try:
                            self.classificationSources[source].setSource(source, self.config.configDir)
                        except:
                            pass
                    identifier = request.args['identifier'][0]
                    if identifier == 'false':
                        identifier = False
                    if source.startswith("etb-lre_mec-ccaa"):
                        stype = 2
                    else:
                        stype = 1
                    try:
                        data = self.classificationSources[source].getDataByIdentifier(identifier, stype=stype)
                    except:
                        pass

        return json.dumps({'success': True, 'data': data})

    def child_temp_file(self, ctx):
        request = inevow.IRequest(ctx)
        filetype = request.args.get('filetype', [''])[0]
        path = self.tempDir / uuid.uuid4() + filetype[1:]
        return json.dumps({'success': True, 'path': path, 'name': path.basename()})

    def goingLive(self, ctx, client):
        """Called each time the page is served/refreshed"""
        # inevow.IRequest(ctx).setHeader('content-type', 'application/vnd.mozilla.xul+xml')
        # Set up named server side funcs that js can call
        def setUpHandler(func, name, *args, **kwargs):
            """
            Convience function link funcs to hander ids
            and store them
            """
            kwargs['identifier'] = name
            hndlr = handler(func, *args, **kwargs)
            hndlr(ctx, client)     # Stores it
        setUpHandler(self.handleIsPackageDirty, 'isPackageDirty')
        setUpHandler(self.handlePackageFileName, 'getPackageFileName')
        setUpHandler(self.handleSavePackage, 'savePackage')
        setUpHandler(self.handleLoadPackage, 'loadPackage')
        setUpHandler(self.recentMenu.handleLoadRecent, 'loadRecent')
        # Task 1080, jrf
        # setUpHandler(self.handleLoadTutorial, 'loadTutorial')
        setUpHandler(self.recentMenu.handleClearRecent, 'clearRecent')
        setUpHandler(self.handleImport, 'importPackage')
        setUpHandler(self.handleCancelImport, 'cancelImportPackage')
        setUpHandler(self.handleExport, 'exportPackage')
        setUpHandler(self.handleExportProcomun, 'exportProcomun')
        setUpHandler(self.handleXliffExport, 'exportXliffPackage')
        setUpHandler(self.handleQuit, 'quit')
        setUpHandler(self.handleMergeXliffPackage, 'mergeXliffPackage')
        setUpHandler(self.handleInsertPackage, 'insertPackage')
        setUpHandler(self.handleExtractPackage, 'extractPackage')
        setUpHandler(self.outlinePane.handleSetTreeSelection, 'setTreeSelection')
        setUpHandler(self.handleRemoveTempDir, 'removeTempDir')
        setUpHandler(self.handleTinyMCEimageChoice, 'previewTinyMCEimage')
        setUpHandler(self.handleTinyMCEimageDragDrop, 'previewTinyMCEimageDragDrop')
        setUpHandler(self.handleTinyMCEmath, 'generateTinyMCEmath')
        setUpHandler(self.handleTinyMCEmathML, 'generateTinyMCEmathML')
        setUpHandler(self.handleTestPrintMsg, 'testPrintMessage')
        setUpHandler(self.handleReload, 'reload')
        setUpHandler(self.handleSourcesDownload, 'sourcesDownload')

        # For the new ExtJS 4.0 interface
        setUpHandler(self.outlinePane.handleAddChild, 'AddChild')
        setUpHandler(self.outlinePane.handleDelNode, 'DelNode')
        setUpHandler(self.outlinePane.handleRenNode, 'RenNode')
        setUpHandler(self.outlinePane.handlePromote, 'PromoteNode')
        setUpHandler(self.outlinePane.handleDemote, 'DemoteNode')
        setUpHandler(self.outlinePane.handleUp, 'UpNode')
        setUpHandler(self.outlinePane.handleDown, 'DownNode')
        setUpHandler(self.handleCreateDir, 'CreateDir')
        setUpHandler(self.handleOverwriteLocalStyle, 'overwriteLocalStyle')

        self.idevicePane.client = client
        self.styleMenu.client = client
        self.webServer.stylemanager.client = client

        if not self.webServer.monitoring:
            self.webServer.monitoring = True
            self.webServer.monitor()

    def render_config(self, ctx, data):
        request = inevow.IRequest(ctx)
        session = request.getSession()
        config = {
            'lastDir': G.application.config.lastDir,
            'locationButtons': self.location_buttons.buttons,
            'lang': G.application.config.locale.split('_')[0],
            'showPreferences': G.application.config.showPreferencesOnStart == '1' and not G.application.preferencesShowed,
            'loadErrors': G.application.loadErrors,
            'showIdevicesGrouped': G.application.config.showIdevicesGrouped == '1',
            'authoringIFrameSrc': '%s/authoring?clientHandleId=%s' % (
                self.package.name, IClientHandle(ctx).handleId
            ),
            'pathSep': os.path.sep,
            'server': G.application.server,
            'user_root': '/'
        }
        if session.user:
            config['user'] = session.user.name
            config['user_picture'] = session.user.picture
            config['user_root'] = session.user.root
        G.application.preferencesShowed = True
        G.application.loadErrors = []
        return tags.script(type="text/javascript")["var config = %s" % json.dumps(config)]

    def render_jsuilang(self, ctx, data):
        return ctx.tag(src="../jsui/i18n/" + unicode(G.application.config.locale) + ".js")

    def render_extjslang(self, ctx, data):
        return ctx.tag(src="../jsui/extjs/locale/ext-lang-" + unicode(G.application.config.locale) + ".js")

    def render_htmllang(self, ctx, data):
        lang = G.application.config.locale.replace('_', '-').split('@')[0]
        attribs = {'lang': unicode(lang), 'xml:lang': unicode(lang), 'xmlns': 'http://www.w3.org/1999/xhtml'}
        return ctx.tag(**attribs)

    def render_version(self, ctx, data):
        return [tags.p()["Version: %s" % release],
                tags.p()["Revision: ",
                         tags.a(href='%s/commits/%s' % (self.config.baseGitWebURL, revision),
                                target='_blank')[revision]
                        ]
               ]

    def handleTestPrintMsg(self, client, message):
        """
        Prints a test message, and yup, that's all!
        """
        print "Test Message: ", message, " [eol, eh!]"

    def handleIsPackageDirty(self, client, ifClean, ifDirty):
        """
        Called by js to know if the package is dirty or not.
        ifClean is JavaScript to be eval'ed on the client if the package has
        been changed
        ifDirty is JavaScript to be eval'ed on the client if the package has not
        been changed
        """
        if self.package.isChanged:
            client.sendScript(ifDirty)
        else:
            client.sendScript(ifClean)

    def handlePackageFileName(self, client, onDone, onDoneParam):
        """
        Calls the javascript func named by 'onDone' passing as the
        only parameter the filename of our package. If the package
        has never been saved or loaded, it passes an empty string
        'onDoneParam' will be passed to onDone as a param after the
        filename
        """
        client.call(onDone, unicode(self.package.filename), onDoneParam)

    def b4save(self, client, inputFilename, ext, msg):
        """
        Call this before saving a file to get the right filename.
        Returns a new filename or 'None' when attempt to override
        'inputFilename' is the filename given by the user
        'ext' is the extension that the filename should have
        'msg' will be shown if the filename already exists
        """
        if not inputFilename.lower().endswith(ext):
            inputFilename += ext
            if Path(inputFilename).exists():
                explanation = _(u'"%s" already exists.\nPlease try again with a different filename') % inputFilename
                msg = u'%s\n%s' % (msg, explanation)
                client.alert(msg)
                raise Exception(msg)
        return inputFilename

    def handleSavePackage(self, client, filename=None, onDone=None):
        """
        Save the current package
        'filename' is the filename to save the package to
        'onDone' will be evaled after saving instead or redirecting
        to the new location (in cases of package name changes).
        (This is used where the user goes file|open when their
        package is changed and needs saving)
        """
        filename = Path(filename, 'utf-8')
        saveDir = filename.dirname()
        if saveDir and not saveDir.isdir():
            client.alert(_(u'Cannot access directory named ') + unicode(saveDir) + _(u'. Please use ASCII names.'))
            return
        oldName = self.package.name
        # If the script is not passing a filename to us,
        # Then use the last filename that the package was loaded from/saved to
        if not filename:
            filename = self.package.filename
            assert filename, 'Somehow save was called without a filename on a package that has no default filename.'
        # Add the extension if its not already there and give message if not saved
        filename = self.b4save(client, filename, '.elp', _(u'SAVE FAILED!'))
        try:
            self.package.save(filename)  # This can change the package name
        except Exception, e:
            client.alert(_('SAVE FAILED!\n%s') % str(e))
            raise
        # Tell the user and continue
        if onDone:
            client.filePickerAlert(_(u'Package saved to: %s') % filename, onDone)
        elif self.package.name != oldName:
            # Redirect the client if the package name has changed
            self.webServer.root.putChild(self.package.name, self)
            log.info('Package saved, redirecting client to /%s' % self.package.name)
            client.filePickerAlert(_(u'Package saved to: %s') % filename, 'eXe.app.gotoUrl("/%s")' % self.package.name.encode('utf8'), \
                         filter_func=otherSessionPackageClients)
        else:
            client.filePickerAlert(_(u'Package saved to: %s') % filename, filter_func=otherSessionPackageClients)

    def handleLoadPackage(self, client, filename, filter_func=None):
        """Load the package named 'filename'"""
        package = self._loadPackage(client, filename, newLoad=True)
        self.session.packageStore.addPackage(package)
        self.webServer.root.bindNewPackage(package, self.session)
        client.sendScript((u'eXe.app.gotoUrl("/%s")' % \
                          package.name).encode('utf8'), filter_func=filter_func)

    # No longer used - Task 1080, jrf
    # def handleLoadTutorial(self, client):
    #    """
    #    Loads the tutorial file, from the Help menu
    #    """
    #    filename = self.config.webDir.joinpath("docs")\
    #            .joinpath("eXe-tutorial.elp")
    #    self.handleLoadPackage(client, filename)

    def progressDownload(self, numblocks, blocksize, filesize, client):
        try:
            percent = min((numblocks * blocksize * 100) / filesize, 100)
        except:
            percent = 100
        client.sendScript('Ext.MessageBox.updateProgress(%f, "%d%%", "Downloading...")' % (float(percent) / 100, percent))
        log.info('%3d' % (percent))

    def handleSourcesDownload(self, client):
        """
        Download taxon sources from url and deploy in $HOME/.exe/classification_sources
        """
        url = 'https://github.com/exelearning/classification_sources/raw/master/classification_sources.zip'
        client.sendScript('Ext.MessageBox.progress("Sources Download", "Connecting to classification sources repository...")')
        d = threads.deferToThread(urlretrieve, url, None, lambda n, b, f: self.progressDownload(n, b, f, client))

        def successDownload(result):
            filename = result[0]
            if not zipfile.is_zipfile(filename):
                return None

            zipFile = zipfile.ZipFile(filename, "r")
            try:
                zipFile.extractall(G.application.config.configDir)
                client.sendScript('Ext.MessageBox.updateProgress(1, "100%", "Success!")')
            finally:
                Path(filename).remove()

        d.addCallback(successDownload)

    def handleOverwriteLocalStyle(self, client, style_dir, downloaded_file):
        """
        Delete locally installed style and import new version from URL
        """
        stylemanager = StyleManagerPage(self)
        stylemanager.client = client
        stylemanager.overwriteLocalStyle(style_dir, downloaded_file)

    def handleReload(self, client):
        self.location_buttons.updateText()
        client.sendScript('eXe.app.gotoUrl()', filter_func=allSessionClients)

    def handleRemoveTempDir(self, client, tempdir, rm_top_dir):
        """
        Removes a temporary directory and any contents therein
        (from the bottom up), and yup, that's all!

        #
        # swiped from an example on:
        #     http://docs.python.org/lib/os-file-dir.html
        ################################################################
        # Delete everything reachable from the directory named in 'top',
        # assuming there are no symbolic links.
        # CAUTION:  This is dangerous!  For example, if top == '/', it
        # could delete all your disk files.
        """
        top = tempdir
        for root, dirs, files in os.walk(top, topdown=False):
            for name in files:
                os.remove(os.path.join(root, name))
            for name in dirs:
                os.rmdir(os.path.join(root, name))
        ##################################################################
        # and finally, go ahead and remove the top-level tempdir itself:
        if int(rm_top_dir) != 0:
            os.rmdir(tempdir)

    def handleTinyMCEimageChoice(self, client, tinyMCEwin, tinyMCEwin_name, \
                             tinyMCEfield, local_filename, preview_filename):
        """
        Once an image is selected in the file browser that is spawned by the
        TinyMCE image dialog, copy this file (which is local to the user's
        machine) into the server space, under a preview directory
        (after checking if this exists, and creating it if necessary).
        Note that this IS a "cheat", in violation of the client-server
        separation, but can be done since we know that the eXe server is
        actually sitting on the client host.
        """
        server_filename = ""
        errors = 0

        log.debug('handleTinyMCEimageChoice: image local = ' + local_filename
                + ', base=' + os.path.basename(local_filename))

        webDir = Path(G.application.tempWebDir)
        previewDir = webDir.joinpath('previews')

        if not previewDir.exists():
            log.debug("image previews directory does not yet exist; " \
                    + "creating as %s " % previewDir)
            previewDir.makedirs()
        elif not previewDir.isdir():
            client.alert( \
                _(u'Preview directory %s is a file, cannot replace it') \
                % previewDir)
            log.error("Couldn't preview tinyMCE-chosen image: " +
                      "Preview dir %s is a file, cannot replace it" \
                      % previewDir)
            errors += 1

        if errors == 0:
            log.debug('handleTinyMCEimageChoice: originally, local_filename='
                    + local_filename)
            local_filename = unicode(local_filename, 'utf-8')
            log.debug('handleTinyMCEimageChoice: in unicode, local_filename='
                    + local_filename)

            localImagePath = Path(local_filename)
            log.debug('handleTinyMCEimageChoice: after Path, localImagePath= '
                    + localImagePath)
            if not localImagePath.exists() or not localImagePath.isfile():
                client.alert( \
                     _(u'Local file %s is not found, cannot preview it') \
                     % localImagePath)
                log.error("Couldn't find tinyMCE-chosen image: %s" \
                        % localImagePath)
                errors += 1

        try:
            # joinpath needs its join arguments to already be in Unicode:
            #preview_filename = toUnicode(preview_filename);
            # but that's okay, cuz preview_filename is now URI safe, right?
            log.debug('URIencoded preview filename=' + preview_filename)

            server_filename = previewDir.joinpath(preview_filename)
            log.debug("handleTinyMCEimageChoice copying image from \'"\
                    + local_filename + "\' to \'" \
                    + server_filename.abspath() + "\'.")
            shutil.copyfile(local_filename, \
                    server_filename.abspath())

            # new optional description file to provide the
            # actual base filename, such that once it is later processed
            # copied into the resources directory, it can be done with
            # only the basename.   Otherwise the resource filenames
            # are too long for some users, preventing them from making
            # backup CDs of the content, for example.
            #
            # Remember that the full path of the
            # file is only used here as an easy way to keep the names
            # unique WITHOUT requiring a roundtrip call from the Javascript
            # to this server, and back again, a process which does not
            # seem to work with tinyMCE in the mix.  BUT, once tinyMCE's
            # part is done, and this image processed, it can be returned
            # to just its basename, since the resource parts have their
            # own unique-ification mechanisms already in place.

            descrip_file_path = Path(server_filename + ".exe_info")
            log.debug("handleTinyMCEimageChoice creating preview " \
                    + "description file \'" \
                    + descrip_file_path.abspath() + "\'.")
            descrip_file = open(descrip_file_path, 'wb')

            # safety measures against TinyMCE, otherwise it will
            # later take ampersands and entity-escape them into '&amp;',
            # and filenames with hash signs will not be found, etc.:
            unspaced_filename = local_filename.replace(' ', '_')
            unhashed_filename = unspaced_filename.replace('#', '_num_')
            unamped_local_filename = unhashed_filename.replace('&', '_and_')
            log.debug("and setting new file basename as: "
                    + unamped_local_filename)
            my_basename = os.path.basename(unamped_local_filename)

            descrip_file.write((u"basename=" + my_basename).encode('utf-8'))
            descrip_file.flush()
            descrip_file.close()

            client.sendScript('eXe.app.fireEvent("previewTinyMCEImageDone")')

        except Exception, e:
            client.alert(_('SAVE FAILED!\n%s') % str(e))
            log.error("handleTinyMCEimageChoice unable to copy local image "
                    + "file to server prevew, error = " + str(e))
            raise

    def handleTinyMCEimageDragDrop(self, client, tinyMCEwin, tinyMCEwin_name, \
                              local_filename, preview_filename):
        server_filename = ""
        errors = 0

        log.debug('handleTinyMCEimageChoice: image local = ' + local_filename
                + ', base=' + os.path.basename(local_filename))

        webDir = Path(G.application.tempWebDir)
        previewDir = webDir.joinpath('previews')

        if not previewDir.exists():
            log.debug("image previews directory does not yet exist; " \
                    + "creating as %s " % previewDir)
            previewDir.makedirs()
        elif not previewDir.isdir():
            client.alert(\
                _(u'Preview directory %s is a file, cannot replace it') \
                % previewDir)
            log.error("Couldn't preview tinyMCE-chosen image: " +
                      "Preview dir %s is a file, cannot replace it" \
                      % previewDir)
            errors += 1

        if errors == 0:
            log.debug('handleTinyMCEimageChoice: originally, local_filename='
                    + local_filename)
            log.debug('handleTinyMCEimageChoice: in unicode, local_filename='
                    + local_filename)

            localImagePath = Path(local_filename)
            log.debug('handleTinyMCEimageChoice: after Path, localImagePath= '
                    + localImagePath)

        try:
            log.debug('URIencoded preview filename=' + preview_filename)

            server_filename = previewDir.joinpath(preview_filename)

            descrip_file_path = Path(server_filename + ".exe_info")
            log.debug("handleTinyMCEimageDragDrop creating preview " \
                    + "description file \'" \
                    + descrip_file_path.abspath() + "\'.")
            descrip_file = open(server_filename, 'wb')

            local_filename = local_filename.replace('data:image/jpeg;base64,', '')
            descrip_file.write(base64.b64decode(local_filename))
            descrip_file.flush()
            descrip_file.close()

            client.sendScript('eXe.app.fireEvent("previewTinyMCEDragDropImageDone")')

        except Exception, e:
            client.alert(_('SAVE FAILED!\n%s') % str(e))
            log.error("handleTinyMCEimageDragDrop unable to copy local image "
                    + "file to server prevew, error = " + str(e))
            raise

    def handleTinyMCEmath(self, client, tinyMCEwin, tinyMCEwin_name, \
                             tinyMCEfield, latex_source, math_fontsize, \
                             preview_image_filename, preview_math_srcfile):
        """
        Based off of handleTinyMCEimageChoice(),
        handleTinyMCEmath() is similar in that it places a .gif math image
        (and a corresponding .tex LaTeX source file) into the previews dir.
        Rather than copying the image from a user-selected directory, though,
        this routine actually generates the math image using mimetex.
        """
        server_filename = ""
        errors = 0

        webDir = Path(G.application.tempWebDir)
        previewDir = webDir.joinpath('previews')

        if not previewDir.exists():
            log.debug("image previews directory does not yet exist; " \
                    + "creating as %s " % previewDir)
            previewDir.makedirs()
        elif not previewDir.isdir():
            client.alert( \
                _(u'Preview directory %s is a file, cannot replace it') \
                % previewDir)
            log.error("Couldn't preview tinyMCE-chosen image: " +
                      "Preview dir %s is a file, cannot replace it" \
                      % previewDir)
            errors += 1

        #if errors == 0:
        #    localImagePath = Path(local_filename)
        #    if not localImagePath.exists() or not localImagePath.isfile():
        #        client.alert( \
        #             _(u'Image file %s is not found, cannot preview it') \
        #             % localImagePath)
        #        log.error("Couldn't find tinyMCE-chosen image: %s" \
        #                % localImagePath)
        #        callback_errors = "Image file %s not found, cannot preview" \
        #                % localImagePath
        #        errors += 1

        # the mimetex usage code was swiped from the Math iDevice:
        if latex_source != "":

            # first write the latex_source out into the preview_math_srcfile,
            # such that it can then be passed into the compile command:
            math_filename = previewDir.joinpath(preview_math_srcfile)
            math_filename_str = math_filename.abspath().encode('utf-8')
            log.info("handleTinyMCEmath: using LaTeX source: " + latex_source)
            log.debug("writing LaTeX source into \'" \
                    + math_filename_str + "\'.")
            math_file = open(math_filename, 'wb')
            # do we need to append a \n here?:
            math_file.write(latex_source)
            math_file.flush()
            math_file.close()

            try:
                use_latex_sourcefile = math_filename_str
                tempFileName = compile(use_latex_sourcefile, math_fontsize, \
                        latex_is_file=True)
            except Exception, e:
                client.alert(_('Could not create the image') + " (LaTeX)","$exeAuthoring.errorHandler('handleTinyMCEmath')")
                log.error("handleTinyMCEmath unable to compile LaTeX using "
                        + "mimetex, error = " + str(e))
                raise

            # copy the file into previews
            server_filename = previewDir.joinpath(preview_image_filename)
            log.debug("handleTinyMCEmath copying math image from \'"\
                    + tempFileName + "\' to \'" \
                    + server_filename.abspath().encode('utf-8') + "\'.")
            shutil.copyfile(tempFileName, \
                    server_filename.abspath().encode('utf-8'))

            # Delete the temp file made by compile
            Path(tempFileName).remove()
        return

    def handleTinyMCEmathML(self, client, tinyMCEwin, tinyMCEwin_name, \
                             tinyMCEfield, mathml_source, math_fontsize, \
                             preview_image_filename, preview_math_srcfile):
        """
        See self.handleTinyMCEmath
        To do: This should generate an image from MathML code, not from LaTeX code.
        """

        # Provisional (just an alert message)
        client.alert(_('Could not create the image') + " (MathML)","$exeAuthoring.errorHandler('handleTinyMCEmathML')")
        return

        server_filename = ""
        errors = 0

        webDir = Path(G.application.tempWebDir)
        previewDir = webDir.joinpath('previews')

        if not previewDir.exists():
            log.debug("image previews directory does not yet exist; " \
                    + "creating as %s " % previewDir)
            previewDir.makedirs()
        elif not previewDir.isdir():
            client.alert( \
                _(u'Preview directory %s is a file, cannot replace it') \
                % previewDir)
            log.error("Couldn't preview tinyMCE-chosen image: " +
                      "Preview dir %s is a file, cannot replace it" \
                      % previewDir)
            errors += 1

        # the mimetex usage code was swiped from the Math iDevice:
        if mathml_source != "":

            # first write the mathml_source out into the preview_math_srcfile,
            # such that it can then be passed into the compile command:
            math_filename = previewDir.joinpath(preview_math_srcfile)
            math_filename_str = math_filename.abspath().encode('utf-8')
            log.info("handleTinyMCEmath: using LaTeX source: " + mathml_source)
            log.debug("writing LaTeX source into \'" \
                    + math_filename_str + "\'.")
            math_file = open(math_filename, 'wb')
            # do we need to append a \n here?:
            math_file.write(mathml_source)
            math_file.flush()
            math_file.close()

            try:
                use_mathml_sourcefile = math_filename_str
                tempFileName = compile(use_mathml_sourcefile, math_fontsize, \
                        latex_is_file=True)
            except Exception, e:
                client.alert(_('Could not create the image') + " (MathML)","$exeAuthoring.errorHandler('handleTinyMCEmathML')")
                log.error("handleTinyMCEmathML unable to compile MathML using "
                        + "mimetex, error = " + str(e))
                raise

            # copy the file into previews
            server_filename = previewDir.joinpath(preview_image_filename)
            log.debug("handleTinyMCEmath copying math image from \'"\
                    + tempFileName + "\' to \'" \
                    + server_filename.abspath().encode('utf-8') + "\'.")
            shutil.copyfile(tempFileName, \
                    server_filename.abspath().encode('utf-8'))

            # Delete the temp file made by compile
            Path(tempFileName).remove()
        return

    def getResources(self, dirname, html, client):
        Resources.cancel = False
        self.importresources = Resources(dirname, self.package.findNode(client.currentNodeId), client)
#        import cProfile
#        import lsprofcalltree
#        p = cProfile.Profile()
#        p.runctx( "resources.insertNode()",globals(),locals())
#        k = lsprofcalltree.KCacheGrind(p)
#        data = open('exeprof.kgrind', 'w+')
#        k.output(data)
#        data.close()
        self.importresources.insertNode([html.partition(dirname + os.sep)[2]])

    def handleImport(self, client, importType, path, html=None):
        if importType == 'html':
            if (not html):
                client.call('eXe.app.getController("Toolbar").importHtml2', path)
            else:
                d = threads.deferToThread(self.getResources, path, html, client)
                d.addCallback(self.handleImportCallback, client)
                d.addErrback(self.handleImportErrback, client)
                client.call('eXe.app.getController("Toolbar").initImportProgressWindow', _(u'Importing HTML...'))
        if importType.startswith('lom'):
            try:
                setattr(self.package, importType, lomsubs.parse(path))
                client.call('eXe.app.getController("MainTab").lomImportSuccess', importType)
            except Exception, e:
                client.alert(_('LOM Metadata import FAILED!\n%s') % str(e))

    def handleImportErrback(self, failure, client):
        client.alert(_(u'Error importing HTML:\n') + unicode(failure.getBriefTraceback()), \
                     (u'eXe.app.gotoUrl("/%s")' % self.package.name).encode('utf8'), filter_func=otherSessionPackageClients)

    def handleImportCallback(self, resources, client):
        client.call('eXe.app.getController("Toolbar").closeImportProgressWindow')
        client.sendScript((u'eXe.app.gotoUrl("/%s")' % \
                      self.package.name).encode('utf8'), filter_func=allSessionPackageClients)

    def handleCancelImport(self, client):
        log.info('Cancel import')
        Resources.cancelImport()

    def handleExportProcomun(self, client):
        if not client.session.oauthToken.get('procomun'):
            verify = False
            if hasattr(sys, 'frozen'):
                verify = 'cacerts.txt'
            oauth2Session = OAuth2Session(ProcomunOauth.CLIENT_ID, redirect_uri=ProcomunOauth.REDIRECT_URI)
            oauth2Session.verify = verify
            authorization_url, state = oauth2Session.authorization_url(ProcomunOauth.AUTHORIZATION_BASE_URL)
            self.webServer.oauth.procomun.saveState(state, oauth2Session, client)

            client.call('eXe.app.getController("Toolbar").getProcomunAuthToken', authorization_url)

            return

        title = 'Procomún'
        statusTitle = _(u'Publishing document to Procomún')

        def exportScorm():
            client.notifyStatus(statusTitle, _(u'Exporting package as SCORM'))
            stylesDir = self.config.stylesDir / self.package.style
            fd, filename = mkstemp('.zip')
            os.close(fd)
            scorm = ScormExport(self.config, stylesDir, filename, 'scorm1.2')
            scorm.export(self.package)

            return filename

        def publish(filename):
            token = client.session.oauthToken['procomun']
            headers = {'Authorization': 'Bearer %s' % str(token['access_token']),
                       'Connection': 'close'}

            procomun = Client(PROCOMUN_WSDL, headers=headers)

            ode = procomun.factory.create('xsd:anyType')

            ode.file = base64.b64encode(open(filename, 'rb').read())
            ode.file_name = self.package.name

            client.notifyStatus(statusTitle, _(u'Starting authorized connection to Procomún API'))
            result = procomun.service.odes_soap_create(ode)

            parsedResult = {}
            for item in result.item:
                parsedResult[item.key] = item.value
                if str(item.key) == 'data':
                    parsedResult[item.key] = {}
                    if item.value:
                        parsedResult[item.key][item.value.item.key] = item.value.item.value

            if parsedResult['status'] == 'true':
                link_url = ProcomunOauth.BASE_URL + '/ode/view/%s' % parsedResult['data']['documentId']
                client.notifyStatus(statusTitle, _(u'Package exported to <a href="%s" target="_blank" title="Click to visit exported site">%s</a>') % (link_url, self.package.title))
            else:
                client.hideStatus()
                client.notifyNotice(title, _(u'Error exporting package %s to Procomún: %s') % (self.package.name, parsedResult['message']), 'error')

        d = threads.deferToThread(exportScorm)
        d.addCallback(lambda filename: threads.deferToThread(publish, filename))

    def handleExport(self, client, exportType, filename):
        """
        Called by js.
        Exports the current package to one of the above formats
        'exportType' can be one of 'singlePage' 'webSite' 'zipFile'
                     'textFile' or 'scorm'
        'filename' is a file for scorm pages, and a directory for websites
        """
        webDir = Path(self.config.webDir)
        #stylesDir  = webDir.joinpath('style', self.package.style)
        stylesDir = self.config.stylesDir / self.package.style
        filename = Path(filename, 'utf-8')
        exportDir = Path(filename).dirname()
        if exportDir and not exportDir.exists():
            client.alert(_(u'Cannot access directory named ') +
                         unicode(exportDir) +
                         _(u'. Please use ASCII names.'))
            return

        """
        adding the print feature in using the same export functionality:
        """
        if exportType == 'singlePage':
            self.exportSinglePage(client, filename, webDir, stylesDir, False)
        elif exportType == 'webSite':
            self.exportWebSite(client, filename, stylesDir)
        elif exportType == 'csvReport':
            self.exportReport(client, filename, stylesDir)
        elif exportType == 'zipFile':
            filename = self.b4save(client, filename, '.zip', _(u'EXPORT FAILED!'))
            self.exportWebZip(client, filename, stylesDir)
        elif exportType == 'textFile':
            self.exportText(client, filename)
        elif exportType == 'scorm1.2':
            filename = self.b4save(client, filename, '.zip', _(u'EXPORT FAILED!'))
            self.exportScorm(client, filename, stylesDir, "scorm1.2")
        elif exportType == "scorm2004":
            filename = self.b4save(client, filename, '.zip', _(u'EXPORT FAILED!'))
            self.exportScorm(client, filename, stylesDir, "scorm2004")
        elif exportType == "agrega":
            filename = self.b4save(client, filename, '.zip', _(u'EXPORT FAILED!'))
            self.exportScorm(client, filename, stylesDir, "agrega")
        elif exportType == 'epub3':
            filename = self.b4save(client, filename, '.epub', _(u'EXPORT FAILED!'))
            self.exportEpub3(client, filename, stylesDir)
        elif exportType == "commoncartridge":
            filename = self.b4save(client, filename, '.zip', _(u'EXPORT FAILED!'))
            self.exportScorm(client, filename, stylesDir, "commoncartridge")
        elif exportType == 'mxml':
            self.exportXML(client, filename, stylesDir)
        else:
            filename = self.b4save(client, filename, '.zip', _(u'EXPORT FAILED!'))
            self.exportIMS(client, filename, stylesDir)

    def handleQuit(self, client):
        """
        Close client session and stops the server if necessary
        """
        client.close("window.location = \"quit\";")
        # self.authoringPages.pop(client.handleId)
        # self.webServer.root.mainpages[self.session.uid].pop(self.package.name)

        if not self.webServer.application.server:
            if len(self.clientHandleFactory.clientHandles) <= 1:
                self.webServer.monitoring = False
                G.application.config.configParser.set('user', 'lastDir', G.application.config.lastDir)
                try:
                    shutil.rmtree(G.application.tempWebDir, True)
                    shutil.rmtree(G.application.resourceDir, True)
                except:
                    log.debug('Don\'t delete temp directorys. ')
                reactor.callLater(2, reactor.stop)
            else:
                log.debug("Not quiting. %d clients alive." % len(self.clientHandleFactory.clientHandles))

    def handleMergeXliffPackage(self, client, filename, from_source):
        """
        Parse the XLIFF file and import the contents based on
        translation-unit id-s
        """
        from_source = True if from_source == "true" else False
        try:
            importer = XliffImport(self.package, unquote(filename))
            importer.parseAndImport(from_source)
            client.alert(_(u'Correct XLIFF import'), (u'eXe.app.gotoUrl("/%s")' % \
                           self.package.name).encode('utf8'), filter_func=otherSessionPackageClients)
        except Exception, e:
            client.alert(_(u'Error importing XLIFF: %s') % e, (u'eXe.app.gotoUrl("/%s")' % \
                           self.package.name).encode('utf8'), filter_func=otherSessionPackageClients)

    def handleInsertPackage(self, client, filename):
        """
        Load the package and insert in current node
        """
        package = self._loadPackage(client, filename, newLoad=True)
        tmpfile = Path(tempfile.mktemp())
        package.save(tmpfile)
        loadedPackage = self._loadPackage(client, tmpfile, newLoad=False,
                                          destinationPackage=self.package)
        newNode = loadedPackage.root.copyToPackage(self.package,
                                                   self.package.currentNode)
        # trigger a rename of all of the internal nodes and links,
        # and to add any such anchors into the dest package via isMerge:
        newNode.RenamedNodePath(isMerge=True)
        try:
            tmpfile.remove()
        except:
            pass
        client.sendScript((u'eXe.app.gotoUrl("/%s")' % \
                          self.package.name).encode('utf8'), filter_func=allSessionPackageClients)

    def handleExtractPackage(self, client, filename, existOk):
        """
        Create a new package consisting of the current node and export
        'existOk' means the user has been informed of existance and ok'd it
        """
        filename = Path(filename, 'utf-8')
        saveDir = filename.dirname()
        if saveDir and not saveDir.exists():
            client.alert(_(u'Cannot access directory named ') + unicode(saveDir) + _(u'. Please use ASCII names.'))
            return

        # Add the extension if its not already there
        if not filename.lower().endswith('.elp'):
            filename += '.elp'

        if Path(filename).exists() and existOk != 'true':
            msg = _(u'"%s" already exists.\nPlease try again with a different filename') % filename
            client.alert(_(u'EXTRACT FAILED!\n%s') % msg)
            return

        try:
            # Create a new package for the extracted nodes
            newPackage = self.package.extractNode()

            # trigger a rename of all of the internal nodes and links,
            # and to remove any old anchors from the dest package,
            # and remove any zombie links via isExtract:
            newNode = newPackage.root
            if newNode:
                newNode.RenamedNodePath(isExtract=True)

            # Save the new package
            newPackage.save(filename)
        except Exception, e:
            client.alert(_('EXTRACT FAILED!\n%s') % str(e))
            raise
        client.filePickerAlert(_(u'Package extracted to: %s') % filename)

    def handleCreateDir(self, client, currentDir, newDir):
        try:
            d = Path(currentDir, 'utf-8') / newDir
            d.makedirs()
            client.sendScript(u"""eXe.app.getStore('filepicker.DirectoryTree').load({
                callback: function() {
                    eXe.app.fireEvent( "dirchange", %s );
                }
            })""" % json.dumps(d))
        except OSError:
            client.alert(_(u"Directory exists"))
        except:
            log.exception("")

    # Public Methods

    """
    Exports to Ustad Mobile XML
    """
    def exportXML(self, client, filename, stylesDir):
        try:
            xmlExport = XMLExport(self.config, stylesDir, filename)
            xmlExport.export(self.package)
        except Exception, e:
            client.alert(_('EXPORT FAILED!\n%s') % str(e))
            raise

    def exportSinglePage(self, client, filename, webDir, stylesDir, \
                         printFlag):
        """
        Export 'client' to a single web page,
        'webDir' is just read from config.webDir
        'stylesDir' is where to copy the style sheet information from
        'printFlag' indicates whether or not this is for print
                    (and whatever else that might mean)
        """
        try:
            imagesDir = webDir.joinpath('images')
            scriptsDir = webDir.joinpath('scripts')
            cssDir = webDir.joinpath('css')
            templatesDir = webDir.joinpath('templates')
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
                if client:
                    client.alert(_(u'Filename %s is a file, cannot replace it') %
                             filename)
                log.error("Couldn't export web page: " +
                          "Filename %s is a file, cannot replace it" % filename)
                return
            else:
                if client:
                    client.alert(_(u'Folder name %s already exists. '
                                'Please choose another one or delete existing one then try again.') % filename)           
                return 
            # Now do the export
            singlePageExport = SinglePageExport(stylesDir, filename, \
                                         imagesDir, scriptsDir, cssDir, templatesDir)
            singlePageExport.export(self.package, printFlag)
        except Exception, e:
            if client:
                client.alert(_('SAVE FAILED!\n%s') % str(e))
            raise
        # Show the newly exported web site in a new window
        if not printFlag:
            self._startFile(filename)
            if client:
                client.alert(_(u'Exported to %s') % filename)

        # and return a string of the actual directory name,
        # in case the package name was added, etc.:
        return filename.abspath().encode('utf-8')
        # WARNING: the above only returns the RELATIVE pathname

    def exportWebSite(self, client, filename, stylesDir):
        """
        Export 'client' to a web site,
        'webDir' is just read from config.webDir
        'stylesDir' is where to copy the style sheet information from
        """

        try:
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
                if client:
                    client.alert(_(u'Filename %s is a file, cannot replace it') %
                             filename)
                log.error("Couldn't export web page: " +
                          "Filename %s is a file, cannot replace it" % filename)
                return
            else:
                if client:
                    client.alert(_(u'Folder name %s already exists. '
                                'Please choose another one or delete existing one then try again.') % filename)
                return
            # Now do the export
            websiteExport = WebsiteExport(self.config, stylesDir, filename)
            websiteExport.export(self.package)
        except Exception, e:
            if client:
                client.alert(_('EXPORT FAILED!\n%s') % str(e))
            raise
        if client:
            client.alert(_(u'Exported to %s') % filename)
            # Show the newly exported web site in a new window
            self._startFile(filename)

    def exportWebZip(self, client, filename, stylesDir):
        try:
            log.debug(u"exportWebsite, filename=%s" % filename)
            filename = Path(filename)
            # Do the export
            filename = self.b4save(client, filename, '.zip', _(u'EXPORT FAILED!'))
            websiteExport = WebsiteExport(self.config, stylesDir, filename)
            websiteExport.exportZip(self.package)
        except Exception, e:
            client.alert(_('EXPORT FAILED!\n%s') % str(e))
            raise
        client.filePickerAlert(_(u'Exported to %s') % filename)

    def exportText(self, client, filename):
        try:
            filename = Path(filename)
            log.debug(u"exportWebsite, filename=%s" % filename)
            # Append an extension if required
            if not filename.lower().endswith('.txt'):
                filename += '.txt'
                if Path(filename).exists():
                    msg = _(u'"%s" already exists.\nPlease try again with a different filename') % filename
                    client.alert(_(u'EXPORT FAILED!\n%s') % msg)
                    return
            # Do the export
            textExport = TextExport(filename)
            textExport.export(self.package)
        except Exception, e:
            client.alert(_('EXPORT FAILED!\n%s') % str(e))
            raise
        client.filePickerAlert(_(u'Exported to %s') % filename)

    def handleXliffExport(self, client, filename, source, target, copy, cdata):
        """
        Exports this package to a XLIFF file
        """
        copy = True if copy == "true" else False
        cdata = True if cdata == "true" else False
        try:
            filename = Path(unquote(filename))
            log.debug(u"exportXliff, filename=%s" % filename)
            if not filename.lower().endswith('.xlf'):
                filename += '.xlf'
            xliffExport = XliffExport(self.config, filename, source, target, copy, cdata)
            xliffExport.export(self.package)
        except Exception, e:
            client.alert(_('EXPORT FAILED!\n%s') % str(e))
            raise
        client.filePickerAlert(_(u'Exported to %s') % filename)

    def exportScorm(self, client, filename, stylesDir, scormType):
        """
        Exports this package to a scorm package file
        """
        try:
            filename = Path(filename)
            log.debug(u"exportScorm, filename=%s" % filename)
            # Append an extension if required
            if not filename.lower().endswith('.zip'):
                filename += '.zip'
                if Path(filename).exists():
                    msg = _(u'"%s" already exists.\nPlease try again with a different filename') % filename
                    client.alert(_(u'EXPORT FAILED!\n%s') % msg)
                    return
            # Do the export
            scormExport = ScormExport(self.config, stylesDir, filename, scormType)
            scormExport.export(self.package)
        except Exception, e:
            client.alert(_('EXPORT FAILED!\n%s') % str(e))
            raise
        client.filePickerAlert(_(u'Exported to %s') % filename)

    def exportEpub3(self, client, filename, stylesDir):
        try:
            log.debug(u"exportEpub3, filename=%s" % filename)
            filename = Path(filename)
            # Do the export
            filename = self.b4save(client, filename, '.epub', _(u'EXPORT FAILED!'))
            epub3Export = Epub3Export(self.config, stylesDir, filename)
            epub3Export.export(self.package)
            # epub3Export.exportZip(self.package)
        except Exception, e:
            client.alert(_('EXPORT FAILED!\n%s' % str(e)))
            raise
        client.filePickerAlert(_(u'Exported to %s') % filename)

    def exportReport(self, client, filename, stylesDir):
        """
        Generates this package report to a file
        """
        try:
            log.debug(u"exportReport")
            # Append an extension if required
            if not filename.lower().endswith('.csv'):
                filename += '.csv'
                if Path(filename).exists():
                    msg = _(u'"%s" already exists.\nPlease try again with a different filename') % filename
                    client.alert(_(u'EXPORT FAILED!\n%s' % msg))
                    return
            # Do the export
            websiteExport = WebsiteExport(self.config, stylesDir, filename, report=True)
            websiteExport.export(self.package)
        except Exception, e:
            client.alert(_('EXPORT FAILED!\n%s' % str(e)))
            raise
        client.filePickerAlert(_(u'Exported to %s' % filename))

    def exportIMS(self, client, filename, stylesDir):
        """
        Exports this package to a ims package file
        """
        try:
            log.debug(u"exportIMS")
            # Append an extension if required
            if not filename.lower().endswith('.zip'):
                filename += '.zip'
                if Path(filename).exists():
                    msg = _(u'"%s" already exists.\nPlease try again with a different filename') % filename
                    client.alert(_(u'EXPORT FAILED!\n%s') % msg)
                    return
            # Do the export
            imsExport = IMSExport(self.config, stylesDir, filename)
            imsExport.export(self.package)
        except Exception, e:
            client.alert(_('EXPORT FAILED!\n%s') % str(e))
            raise
        client.filePickerAlert(_(u'Exported to %s') % filename)

    # Utility methods
    def _startFile(self, filename):
        """
        Launches an exported web site or page
        """
        if not G.application.server:
            if hasattr(os, 'startfile'):
                try:
                    os.startfile(filename)
                except UnicodeEncodeError:
                    os.startfile(filename.encode(Path.fileSystemEncoding))
            else:
                filename /= 'index.html'
                G.application.config.browser.open('file://'+filename)

    def _loadPackage(self, client, filename, newLoad=True,
                     destinationPackage=None):
        """Load the package named 'filename'"""
        try:
            encoding = sys.getfilesystemencoding()
            if encoding is None:
                encoding = 'utf-8'
            filename2 = toUnicode(filename, encoding)
            log.debug("filename and path" + filename2)
            # see if the file exists AND is readable by the user
            try:
                open(filename2, 'rb').close()
            except IOError:
                filename2 = toUnicode(filename, 'utf-8')
                try:
                    open(filename2, 'rb').close()
                except IOError:
                    client.alert(_(u'File %s does not exist or is not readable.') % filename2)
                    return None
            package = Package.load(filename2, newLoad, destinationPackage)
            if package is None:
                raise Exception(_("Couldn't load file, please email file to bugs@exelearning.org"))
        except Exception, exc:
            if log.getEffectiveLevel() == logging.DEBUG:
                client.alert(_(u'Sorry, wrong file format:\n%s') % unicode(exc))
            else:
                client.alert(_(u'Sorry, wrong file format'))
            log.error(u'Error loading package "%s": %s' % (filename2, unicode(exc)))
            log.error(u'Traceback:\n%s' % traceback.format_exc())
            raise
        return package
