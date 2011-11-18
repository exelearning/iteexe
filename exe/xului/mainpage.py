# ===========================================================================
# eXe
# Copyright 2004-2005, University of Auckland
# Copyright 2006-2009 eXe Project, http://eXeLearning.org/
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
import shutil
from xml.sax.saxutils            import escape
from twisted.internet            import reactor
from twisted.web                 import static
from twisted.internet.defer      import Deferred
from nevow                       import loaders, inevow, stan
from nevow.livepage              import handler, js
from exe.xului.idevicepane       import IdevicePane
from exe.xului.outlinepane       import OutlinePane
from exe.xului.stylemenu         import StyleMenu
from exe.webui.renderable        import RenderableLivePage
from exe.xului.propertiespage    import PropertiesPage
from exe.webui.authoringpage     import AuthoringPage
from exe.export.websiteexport    import WebsiteExport
from exe.export.textexport       import TextExport
from exe.export.singlepageexport import SinglePageExport
from exe.export.scormexport      import ScormExport
from exe.export.imsexport        import IMSExport
from exe.export.ipodexport       import IpodExport
from exe.export.xliffexport      import XliffExport
from exe.importers.xliffimport      import XliffImport
from exe.engine.path             import Path, toUnicode
from exe.engine.package          import Package
from exe                         import globals as G
from tempfile                    import mkdtemp
from exe.engine.mimetex          import compile


log = logging.getLogger(__name__)


class MainPage(RenderableLivePage):
    """
    This is the main XUL page.  Responsible for handling URLs.
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

        # translate the "don't close the window" message
        red_x = _("Please use eXe's\n   File... Quit\nmenu to close eXe.")

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
        inevow.IRequest(ctx).setHeader('content-type', 'application/vnd.mozilla.xul+xml')
        # Set up named server side funcs that js can call
        def setUpHandler(func, name, *args, **kwargs):
            """
            Convience function link funcs to hander ids
            and store them
            """
            kwargs['identifier'] = name
            hndlr = handler(func, *args, **kwargs)
            hndlr(ctx, client) # Stores it
        setUpHandler(self.handleIsPackageDirty,  'isPackageDirty')
        setUpHandler(self.handlePackageFileName, 'getPackageFileName')
        setUpHandler(self.handleSavePackage,     'savePackage')
        setUpHandler(self.handleLoadPackage,     'loadPackage')
        setUpHandler(self.handleLoadRecent,      'loadRecent')
        setUpHandler(self.handleLoadTutorial,    'loadTutorial')
        setUpHandler(self.handleClearRecent,     'clearRecent')
        setUpHandler(self.handleExport,          'exportPackage')
        setUpHandler(self.handleQuit,            'quit')
        setUpHandler(self.handleBrowseURL,       'browseURL')
        setUpHandler(self.handleMergeXliffPackage,   'mergeXliffPackage')
        setUpHandler(self.handleInsertPackage,   'insertPackage')
        setUpHandler(self.handleExtractPackage,  'extractPackage')
        setUpHandler(self.outlinePane.handleSetTreeSelection,  
                                                 'setTreeSelection')
        setUpHandler(self.handleClearAndMakeTempPrintDir,
                                                 'makeTempPrintDir')
        setUpHandler(self.handleRemoveTempDir,   'removeTempDir')
        setUpHandler(self.handleTinyMCEimageChoice,   'previewTinyMCEimage')
        setUpHandler(self.handleTinyMCEmath,     'generateTinyMCEmath')
        setUpHandler(self.handleTestPrintMsg,    'testPrintMessage')
        setUpHandler(self.handleSetLocale,       'setLocale')
        setUpHandler(self.handleSetInternalAnchors,  'setInternalAnchors')

        self.idevicePane.client = client
        # Render the js 
        handleId = "'", client.handleId, "'" 


    def render_mainMenu(self, ctx, data):
        """Mac menubars are not shown
        so make it a toolbar"""
        if sys.platform[:6] == "darwin":
            ctx.tag.tagName = 'toolbar'
        return ctx.tag

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
                       js('askNodeName()'), bubble=True))


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

    def render_recentProjects(self, ctx, data):
        """
        Fills in the list of recent projects menu
        """
        result = ['<menupopup id="recent-projects-popup">\n']
        for num, path in enumerate(self.config.recentProjects):
            result.append('  <menuitem label="%(num)s. %(path)s"'
                          ' accesskey="%(num)s"'
                          ' oncommand="fileOpenRecent(\'%(num)s\')"/>' %
                          {'num': num + 1, 'path': escape(path)})
        result.append('  <menuseparator/>')
        result.append('  <menuitem label="%s"'
                      ' oncommand="fileRecentClear()"/>' %
                      _('Clear Recent Projects List'))
        result.append('</menupopup>')
        return stan.xml('\n'.join(result))

    def render_debugInfo(self, ctx, data):
        """Renders debug info to the to
        of the screen if logging is set to debug level
        """
        if log.getEffectiveLevel() == logging.DEBUG:
            # TODO: Needs to be updated by xmlhttp or xmlrpc
            request = inevow.IRequest(ctx)
            return stan.xml(('<hbox id="header">\n'
                             '    <label>%s</label>\n'
                             '    <label>%s</label>\n'
                             '</hbox>\n' %
                             ([escape(x) for x in request.prepath],
                              escape(self.package.name))))
        else:
            return ''

    # Handle Methods

    # purely a quick test method for printing from the client->server:
    def handleTestPrintMsg(self, client, message): 
        """ 
        Prints a test message, and yup, that's all! 
        """ 
        print "Test Message: ", message, " [eol, eh!]"

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
        Returns a new filename or 'None' when attempt to overide
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
        filename = Path(filename)
        saveDir  = filename.dirname()
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
            self.package.save(filename) # This can change the package name
        except Exception, e:
            client.alert(_('SAVE FAILED!\n%s' % str(e)))
            raise
        # Tell the user and continue
        client.alert(_(u'Package saved to: %s' % filename))
        if onDone:
            client.sendScript(onDone)
        elif self.package.name != oldName:
            # Redirect the client if the package name has changed
            self.webServer.root.putChild(self.package.name, self)
            log.info('Package saved, redirecting client to /%s' % self.package.name)
            client.sendScript('top.location = "/%s"' % self.package.name.encode('utf8'))


    def handleLoadPackage(self, client, filename):
        """Load the package named 'filename'"""
        package = self._loadPackage(client, filename, newLoad=True)
        packageStore = self.webServer.application.packageStore
        packageStore.addPackage(package)
        self.root.bindNewPackage(package)
        client.sendScript((u'top.location = "/%s"' % \
                          package.name).encode('utf8'))
 
    def handleLoadRecent(self, client, number):
        """
        Loads a file from our recent files list
        """
        filename = self.config.recentProjects[int(number) - 1]
        self.handleLoadPackage(client, filename)

    def handleLoadTutorial(self, client):
        """
        Loads the tutorial file, from the Help menu
        """
        filename = self.config.webDir.joinpath("docs")\
                .joinpath("eXe-tutorial.elp")
        self.handleLoadPackage(client, filename)

    def handleClearRecent(self, client):
        """
        Clear the recent project list
        """
        G.application.config.recentProjects = []
        G.application.config.configParser.write()
        # rerender the menus
        client.sendScript('top.location = "/%s"' % self.package.name.encode('utf8'))

    def handleSetLocale(self, client, locale):
        """
        Set locale using Nevow instead of a POST
        """
        G.application.config.locale = locale
        G.application.config.locales[locale].install(unicode=True)
        G.application.config.configParser.set('user', 'locale', locale)
        client.sendScript((u'top.location = "/%s"' % \
                          self.package.name).encode('utf8'))

    def handleSetInternalAnchors(self, client, internalAnchors):
        """
        Set locale using Nevow instead of a POST
        """
        G.application.config.internalAnchors = internalAnchors
        G.application.config.configParser.set('user', 'internalAnchors', internalAnchors)
        client.sendScript((u'top.location = "/%s"' % \
                          self.package.name).encode('utf8'))
 
    def handleRemoveTempDir(self, client, tempdir, rm_top_dir):
        """
        Removes a temporary directory and any contents therein
        (from the bottom up), and yup, that's all!
        """
        #
        # swiped from an example on:
        #     http://docs.python.org/lib/os-file-dir.html
        top = tempdir
        ################################################################
        # Delete everything reachable from the directory named in 'top',
        # assuming there are no symbolic links.
        # CAUTION:  This is dangerous!  For example, if top == '/', it
        # could delete all your disk files.
        for root, dirs, files in os.walk(top, topdown=False):
            for name in files:
                os.remove(os.path.join(root, name))
            for name in dirs:
                os.rmdir(os.path.join(root, name))
        ##################################################################
        # and finally, go ahead and remove the top-level tempdir itself:
        if (int(rm_top_dir) != 0):
            os.rmdir(tempdir)

    def get_printdir_relative2web(self, exported_dir):
        """
        related to the following ClearParentTempPrintDirs(), return a
        local URL corresponding to the exported_dir
        """
        rel_name = exported_dir[len(G.application.tempWebDir):]
        if sys.platform[:3] == "win":
            rel_name = rel_name.replace('\\', '/')
        if rel_name.startswith('/'):
            rel_name = rel_name[1:]
        http_relative_pathname = "http://127.0.0.1:" + str(self.config.port) \
                                     + '/' + rel_name
        log.debug('printdir http_relative_pathname=' + http_relative_pathname)
        return http_relative_pathname

    def ClearParentTempPrintDirs(self, client, log_dir_warnings):
        """
        Determine the parent temporary printing directory, and clear them 
        if safe to do so (i.e., if not the config dir itself, for example)
        Makes (if necessary), and clears out (if applicable) the parent 
        temporary directory.
        The calling handleClearAndMakeTempPrintDir() shall then make a 
        specific print-job subdirectory.
        """
        #
        # Create the parent temp print dir as hardcoded under the webdir, as:
        #           http://temp_print_dirs
        # (eventually may want to allow this information to be configured by
        #  the user, stored in globals, etc.)
        web_dirname = G.application.tempWebDir
        under_dirname = os.path.join(web_dirname,"temp_print_dirs")
        clear_tempdir = 0
        dir_warnings = ""

        # but first need to ensure that under_dirname itself is available; 
        # if not, create it:
        if cmp(under_dirname,"") != 0:
            if os.path.exists(under_dirname):
                if (os.path.isdir(under_dirname)):
                    # Yes, this directory already exists.  
                    # pre-clean it, keeping the clutter down:
                    clear_tempdir = 1
                else:
                    dir_warnings = "WARNING: The desired Temporary Print " \
                            + "Directory, \"" + under_dirname \
                            + "\", already exists, but as a file!\n"
                    if log_dir_warnings:
                        log.warn("ClearParentTempPrintDirs(): The desired " \
                                + "Temporary Print Directory, \"%s\", " \
                                + "already exists, but as a file!", \
                                under_dirname)
                    under_dirname = web_dirname
                    # but, we can't just put the tempdirs directly underneath
                    # the webDir, since no server object exists for it.
                    # So, as a quick and dirty solution, go ahead and put 
                    # them in the images folder:
                    under_dirname = os.path.join(under_dirname,"images")

                    dir_warnings += "    RECOMMENDATION: please " \
                            + "remove/rename this file to allow eXe easier "\
                            + "management of its temporary print files.\n"
                    dir_warnings += "     eXe will create the temporary " \
                           + "printing directory directly under \"" \
                           + under_dirname + "\" instead, but this might "\
                           +"leave some files around after eXe terminates..."
                    if log_dir_warnings:
                        log.warn("    RECOMMENDATION: please remove/rename "\
                            + "this file to allow eXe easier management of "\
                            + "its temporary print files.")
                        log.warn("     eXe will create the temporary " \
                            + "printing directory directly under \"%s\" " \
                            + "instead, but this might leave some files " \
                            + "around after eXe terminates...", \
                            under_dirname)
                    # and note that we do NOT want to clear_tempdir 
                    # on the config dir itself!!!!!
            else:
                os.makedirs(under_dirname)
                # and while we could clear_tempdir on it, there's no need to.
        if clear_tempdir : 
            # before making this particular print job's temporary print 
            # directory underneath the now-existing temp_print_dirs, 
            # go ahead and clear out temp_print_dirs such that we have 
            # AT MOST one old temporary set of print job files still existing
            # once eXe terminates:
            rm_topdir = "0"  
            # note: rm_topdir is passed in as a STRING since 
            # handleRemoveTempDir expects as such from nevow's 
            # clientToServerEvent() call:
            self.handleRemoveTempDir(client, under_dirname, rm_topdir)

        return under_dirname, dir_warnings

    def handleClearAndMakeTempPrintDir(self, client, suffix, prefix, \
                                        callback):
        """
        Makes a temporary printing directory, and yup, that's pretty much it!
        """

        # First get the name of the parent temp directory, after making it 
        # (if necessary) and clearing (if applicable):
        log_dir_warnings = 1  
        (under_dirname, dir_warnings) = self.ClearParentTempPrintDirs( \
                                             client, log_dir_warnings)

        # Next, go ahead and create this particular print job's temporary 
        # directory under the parent temp directory:
        temp_dir = mkdtemp(suffix, prefix, under_dirname) 

        # Finally, pass the created temp_dir back to the expecting callback:
        client.call(callback, temp_dir, dir_warnings)

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
        callback_errors = ""
        errors = 0

        log.debug('handleTinyMCEimageChoice: image local = ' + local_filename 
                + ', base=' + os.path.basename(local_filename))

        webDir     = Path(G.application.tempWebDir)
        previewDir  = webDir.joinpath('previews')

        if not previewDir.exists():
            log.debug("image previews directory does not yet exist; " \
                    + "creating as %s " % previewDir)
            previewDir.makedirs()
        elif not previewDir.isdir():
            client.alert( \
                _(u'Preview directory %s is a file, cannot replace it') \
                % previewDir)
            log.error("Couldn't preview tinyMCE-chosen image: "+
                      "Preview dir %s is a file, cannot replace it" \
                      % previewDir)
            callback_errors =  "Preview dir is a file, cannot replace"
            errors += 1

        if errors == 0:
            log.debug('handleTinyMCEimageChoice: originally, local_filename='
                    + local_filename)
            local_filename = unicode(local_filename, 'utf-8')
            log.debug('handleTinyMCEimageChoice: in unicode, local_filename='
                    + local_filename)

            localImagePath = Path(local_filename)
            log.debug('handleTinyMCEimageChoice: after Path, localImagePath= '
                    + localImagePath);
            if not localImagePath.exists() or not localImagePath.isfile():
                client.alert( \
                     _(u'Local file %s is not found, cannot preview it') \
                     % localImagePath)
                log.error("Couldn't find tinyMCE-chosen image: %s" \
                        % localImagePath)
                callback_errors = "Image file %s not found, cannot preview" \
                        % localImagePath
                errors += 1

        try:
            # joinpath needs its join arguments to already be in Unicode:
            #preview_filename = toUnicode(preview_filename);
            # but that's okay, cuz preview_filename is now URI safe, right?
            log.debug('URIencoded preview filename=' + preview_filename);

            server_filename = previewDir.joinpath(preview_filename);
            log.debug("handleTinyMCEimageChoice copying image from \'"\
                    + local_filename + "\' to \'" \
                    + server_filename.abspath() + "\'.");
            shutil.copyfile(local_filename, \
                    server_filename.abspath());

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

            descrip_file_path = Path(server_filename+".exe_info")
            log.debug("handleTinyMCEimageChoice creating preview " \
                    + "description file \'" \
                    + descrip_file_path.abspath() + "\'.");
            descrip_file = open(descrip_file_path, 'wb')

            # safety measures against TinyMCE, otherwise it will 
            # later take ampersands and entity-escape them into '&amp;',
            # and filenames with hash signs will not be found, etc.:
            unspaced_filename  = local_filename.replace(' ','_')
            unhashed_filename  = unspaced_filename.replace('#', '_num_')
            unamped_local_filename  = unhashed_filename.replace('&', '_and_')
            log.debug("and setting new file basename as: " 
                    + unamped_local_filename);
            my_basename = os.path.basename(unamped_local_filename)
            descrip_file.write((u"basename="+my_basename).encode('utf-8'))

            descrip_file.flush()
            descrip_file.close()

        except Exception, e:
            client.alert(_('SAVE FAILED!\n%s' % str(e)))
            log.error("handleTinyMCEimageChoice unable to copy local image "\
                    +"file to server prevew, error = " + str(e))
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
        callback_errors = ""
        errors = 0

        webDir     = Path(G.application.tempWebDir)
        previewDir  = webDir.joinpath('previews')

        if not previewDir.exists():
            log.debug("image previews directory does not yet exist; " \
                    + "creating as %s " % previewDir)
            previewDir.makedirs()
        elif not previewDir.isdir():
            client.alert( \
                _(u'Preview directory %s is a file, cannot replace it') \
                % previewDir)
            log.error("Couldn't preview tinyMCE-chosen image: "+
                      "Preview dir %s is a file, cannot replace it" \
                      % previewDir)
            callback_errors =  "Preview dir is a file, cannot replace"
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
        if latex_source <> "":

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
                client.alert(_('MimeTeX compile failed!\n%s' % str(e)))
                log.error("handleTinyMCEmath unable to compile LaTeX using "\
                    +"mimetex, error = " + str(e))
                raise

            # copy the file into previews
            server_filename = previewDir.joinpath(preview_image_filename);
            log.debug("handleTinyMCEmath copying math image from \'"\
                    + tempFileName + "\' to \'" \
                    + server_filename.abspath().encode('utf-8') + "\'.");
            shutil.copyfile(tempFileName, \
                    server_filename.abspath().encode('utf-8'));

            # Delete the temp file made by compile 
            Path(tempFileName).remove()
        return
    

    def handleExport(self, client, exportType, filename, print_callback=''):
        """
        Called by js. 
        Exports the current package to one of the above formats
        'exportType' can be one of 'singlePage' 'webSite' 'zipFile' 'ipod'
                     'textFile' or 'scorm'
        'filename' is a file for scorm pages, and a directory for websites
        """ 
        webDir     = Path(self.config.webDir)
        stylesDir  = webDir.joinpath('style', self.package.style)

        exportDir  = Path(filename).dirname()
        if exportDir and not exportDir.exists():
            client.alert(_(u'Cannot access directory named ') +
                         unicode(exportDir) +
                         _(u'. Please use ASCII names.'))
            return

        """ 
        adding the print feature in using the same export functionality:
        """
        if exportType == 'singlePage' or exportType == 'printSinglePage':
            printit = 0
            if exportType == 'printSinglePage':
                printit = 1
            exported_dir = self.exportSinglePage(client, filename, webDir, \
                                                 stylesDir, printit)
            # the above will return None if the desired exported directory
            # already exists (printing always goes to a new temp dir, though):
            if printit == 1 and not exported_dir is None:
                web_printdir = self.get_printdir_relative2web(exported_dir)
                # now that this has ben exported, go ahead and trigger 
                # the requested printing callback:
                client.call(print_callback, filename, exported_dir, \
                            web_printdir)

        elif exportType == 'webSite':
            self.exportWebSite(client, filename, stylesDir)
            
        elif exportType == 'zipFile':
            filename = self.b4save(client, filename, '.zip', _(u'EXPORT FAILED!'))
            self.exportWebZip(client, filename, stylesDir)
        elif exportType == 'textFile':
            self.exportText(client, filename)
        elif exportType == 'ipod':
            self.exportIpod(client, filename)
        elif exportType == "scorm":
            filename = self.b4save(client, filename, '.zip', _(u'EXPORT FAILED!'))
            self.exportScorm(client, filename, stylesDir, "scorm1.2")
        elif exportType == "scorm2004":
            filename = self.b4save(client, filename, '.zip', _(u'EXPORT FAILED!'))
            self.exportScorm(client, filename, stylesDir, "scorm2004")
        elif exportType == "commoncartridge":
            filename = self.b4save(client, filename, '.zip', _(u'EXPORT FAILED!'))
            self.exportScorm(client, filename, stylesDir, "commoncartridge")
        elif exportType == "xliff":
            self.exportXliff(client, filename)
        else:
            filename = self.b4save(client, filename, '.zip', _(u'EXPORT FAILED!'))
            self.exportIMS(client, filename, stylesDir)

    def handleQuit(self, client):
        """
        Stops the server
        """
        # first, go ahead and clear out any temp job files still in 
        # the temporary print directory:
        log_dir_warnings = 0  
        # don't warn of any issues with the directories at quit, 
        # since already warned at initial directory creation
        (parent_temp_print_dir, dir_warnings) = \
                self.ClearParentTempPrintDirs(client, log_dir_warnings)

        reactor.stop()

    def handleBrowseURL(self, client, url):
        """visit the specified URL using the system browser
        
        if the URL contains %s, substitute the local webDir
        if the URL contains %t, show a temp file containing NEWS and README """
        if url.find('%t') > -1:
            release_notes = os.path.join(G.application.tempWebDir,
                    'Release_Notes.html')
            f = open(release_notes, 'wt')
            f.write('''<html><head><title>eXe Release Notes</title></head>
                <body><h1>News</h1><pre>\n''')
            try:
                news = open(os.path.join(self.config.webDir, 'NEWS'),
                        'rt').read()
                readme = open(os.path.join(self.config.webDir, 'README'),
                        'rt').read()
                f.write(news)
                f.write('</pre><hr><h1>Read Me</h1><pre>\n')
                f.write(readme)
            except IOError:
                # fail silently if we can't read either of the files
                pass
            f.write('</pre></body></html>')
            f.close()
            url = url.replace('%t', release_notes)
        else:
            url = url.replace('%s', self.config.webDir)
        log.debug(u'browseURL: ' + url)
        if hasattr(os, 'startfile'):
            os.startfile(url)
        elif sys.platform[:6] == "darwin":
            import webbrowser
            webbrowser.open(url, new=True)
        else:
            os.system("firefox " + url + "&")

    def handleMergeXliffPackage(self, client, filename, from_source):
        """
        Parse the XLIFF file and import the contents based on
        translation-unit id-s
        """
        try:
            importer = XliffImport(self.package, filename)
            importer.parseAndImport(bool(int(from_source)))
            client.alert(_(u'Correct XLIFF import'))
        except Exception,e:
            client.alert(_(u'Error importing XLIFF: %s') % e)
            
        client.sendScript((u'top.location = "/%s"' % \
                           self.package.name).encode('utf8'))


    def handleInsertPackage(self, client, filename):
        """
        Load the package and insert in current node
        """
        loadedPackage = self._loadPackage(client, filename, newLoad=False,
                                          destinationPackage=self.package)
        newNode = loadedPackage.root.copyToPackage(self.package, 
                                                   self.package.currentNode)
        # trigger a rename of all of the internal nodes and links,
        # and to add any such anchors into the dest package via isMerge:
        newNode.RenamedNodePath(isMerge=True)

        client.sendScript((u'top.location = "/%s"' % \
                          self.package.name).encode('utf8'))


    def handleExtractPackage(self, client, filename, existOk):
        """
        Create a new package consisting of the current node and export
        'existOk' means the user has been informed of existance and ok'd it
        """
        filename  = Path(filename)
        saveDir = filename.dirname()
        if saveDir and not saveDir.exists():
            client.alert(_(u'Cannot access directory named ') + unicode(saveDir) + _(u'. Please use ASCII names.'))
            return

        # Add the extension if its not already there
        if not filename.lower().endswith('.elp'):
            filename += '.elp'

        if Path(filename).exists() and existOk != 'true':
            msg = _(u'"%s" already exists.\nPlease try again with a different filename') % filename
            client.alert(_(u'EXTRACT FAILED!\n%s' % msg))
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
            client.alert(_('EXTRACT FAILED!\n%s' % str(e)))
            raise
        client.alert(_(u'Package extracted to: %s' % filename))

    # Public Methods

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
            imagesDir    = webDir.joinpath('images')
            scriptsDir   = webDir.joinpath('scripts')
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
                client.alert(_(u'Filename %s is a file, cannot replace it') % 
                             filename)
                log.error("Couldn't export web page: "+
                          "Filename %s is a file, cannot replace it" % filename)
                return
            else:
                client.alert(_(u'Folder name %s already exists. '
                                'Please choose another one or delete existing one then try again.') % filename)           
                return 
            # Now do the export
            singlePageExport = SinglePageExport(stylesDir, filename, \
                                         imagesDir, scriptsDir, templatesDir)
            singlePageExport.export(self.package, printFlag)
        except Exception, e:
            client.alert(_('SAVE FAILED!\n%s' % str(e)))
            raise
        # Show the newly exported web site in a new window
        if not printFlag:
           self._startFile(filename)
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
                client.alert(_(u'Filename %s is a file, cannot replace it') % 
                             filename)
                log.error("Couldn't export web page: "+
                          "Filename %s is a file, cannot replace it" % filename)
                return
            else:
                client.alert(_(u'Folder name %s already exists. '
                                'Please choose another one or delete existing one then try again.') % filename)           
                return 
            # Now do the export
            websiteExport = WebsiteExport(self.config, stylesDir, filename)
            websiteExport.export(self.package)
        except Exception, e:
            client.alert(_('EXPORT FAILED!\n%s') % str(e))
            raise
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
            client.alert(_('EXPORT FAILED!\n%s' % str(e)))
            raise
        client.alert(_(u'Exported to %s') % filename)
        
    def exportText(self, client, filename):
        try:
            filename = Path(filename)
            log.debug(u"exportWebsite, filename=%s" % filename)
            # Append an extension if required
            if not filename.lower().endswith('.txt'):
                filename += '.txt'
                if Path(filename).exists():
                    msg = _(u'"%s" already exists.\nPlease try again with a different filename') % filename
                    client.alert(_(u'EXPORT FAILED!\n%s' % msg))
                    return
            # Do the export
            textExport = TextExport(filename)
            textExport.export(self.package)
        except Exception, e:
            client.alert(_('EXPORT FAILED!\n%s' % str(e)))
            raise
        client.alert(_(u'Exported to %s') % filename)
        
    def exportIpod(self, client, filename):
        """
        Export 'client' to an iPod Notes folder tree
        'webDir' is just read from config.webDir
        """
        try:
            # filename is a directory where we will export the notes to
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
                client.alert(_(u'Folder name %s already exists. '
                                'Please choose another one or delete existing one then try again.') % filename)           
                return 
            # Now do the export
            ipodExport = IpodExport(self.config, filename)
            ipodExport.export(self.package)
        except Exception, e:
            client.alert(_('EXPORT FAILED!\n%s') % str(e))
            raise
        client.alert(_(u'Exported to %s') % filename)


    def exportXliff(self, client, filename):
        """
        Exports this package to a XLIFF file
        """
        try:
            filename = Path(filename)
            log.debug(u"exportXliff, filename=%s" % filename)
            xliffExport = XliffExport(self.config, filename)
            xliffExport.export(self.package)
        except Exception,e:
            client.alert(_('EXPORT FAILED!\n%s' % str(e)))
            raise
        client.alert(_(u'Exported to %s') % filename)


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
                    client.alert(_(u'EXPORT FAILED!\n%s' % msg))
                    return
            # Do the export
            scormExport = ScormExport(self.config, stylesDir, filename, scormType)
            scormExport.export(self.package)
        except Exception, e:
            client.alert(_('EXPORT FAILED!\n%s' % str(e)))
            raise
        client.alert(_(u'Exported to %s') % filename)

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
                    client.alert(_(u'EXPORT FAILED!\n%s' % msg))
                    return
            # Do the export
            imsExport = IMSExport(self.config, stylesDir, filename)
            imsExport.export(self.package)
        except Exception, e:
            client.alert(_('EXPORT FAILED!\n%s' % str(e)))
            raise
        client.alert(_(u'Exported to %s' % filename))

    # Utility methods
    def _startFile(self, filename):
        """
        Launches an exported web site or page
        """
        if hasattr(os, 'startfile'):
            try:
                os.startfile(filename)
            except UnicodeEncodeError:
                os.startfile(filename.encode(Path.fileSystemEncoding))
        elif sys.platform[:6] == "darwin":
            import webbrowser
            filename /= 'index.html'
            webbrowser.open('file://'+filename)
        else:
            filename /= 'index.html'
            log.debug(u"firefox file://"+filename+"&")
            os.system("firefox file://"+filename+"&")

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

