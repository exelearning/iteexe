#!/usr/bin/python
#-*- coding: utf-8 -*-
# ===========================================================================
# eXeLearning
# Copyright 2013, Jose Ramón Jiménez Reyes
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
# Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301,
# USA.
# ===========================================================================
"""
JR: The StyleManagerPage is responsible for managing styles
"""

import logging
import os
import shutil
import ssl
import certifi
import sys
from sys                       import platform
from zipfile                   import ZipFile, ZIP_DEFLATED
import json
from tempfile                  import gettempdir
from urllib                    import urlretrieve
from urlparse                  import urlsplit
import locale
from twisted.internet          import threads
from twisted.web.resource      import Resource
from twisted.web.xmlrpc        import Proxy
from exe.webui.livepage        import allSessionClients
from exe.webui.renderable      import RenderableResource
from exe.engine.path           import Path
from exe.engine.style          import Style


log = logging.getLogger(__name__)


class ImportStyleError(Exception):
    pass


class ImportStyleExistsError(ImportStyleError):
    def __init__(self, local_style, absolute_style_dir, message=''):
        self.local_style = local_style
        self.absolute_style_dir = absolute_style_dir
        if message == '':
            self.message = _('Style already exists. ')
        else:
            self.message = message

    def __str__(self):
        return self.message

    pass


class StyleManagerPage(RenderableResource):
    """
    The StyleManagerPage is responsible for managing styles
    import / export / delete
    """

    name = 'stylemanager'

    def __init__(self, parent):
        """
        Initialize
        """
        RenderableResource.__init__(self, parent)
        self.action = ""
        self.properties = ""
        self.style = ""
        self.client = None
        # Remote XML-RPC server
        log.debug("Preparing remote XML-RPC server: %s"
                  % self.config.stylesRepository.encode("ascii"))
        self.proxy = Proxy(self.config.stylesRepository.encode("ascii"))

    def getChild(self, name, request):
        """
        Try and find the child for the name given
        """
        if name == "":
            return self
        else:
            return Resource.getChild(self, name, request)

    def render_GET(self, request):
        """Called for all requests to this object

        Every JSON response sent must have an 'action' field, which value will
        determine the panel to be displayed in the WebUI
        """

        if self.action == 'Properties':
            response = json.dumps({
                                   'success': True,
                                   'properties': self.properties,
                                   'style': self.style,
                                   'action': 'Properties'})
        elif self.action == 'PreExport':
            response = json.dumps({
                                   'success': True,
                                   'properties': self.properties,
                                   'style': self.style,
                                   'action': 'PreExport'})
        elif self.action == 'StylesRepository':
            response = json.dumps({
                                   'success': True,
                                   'rep_styles': self.rep_styles,
                                   'action': 'StylesRepository'})
        else:
            response = json.dumps({
                                   'success': True,
                                   'styles': self.renderListStyles(),
                                   'action': 'List'})
        # self.action must be reset to 'List'. If user exits the Style Manager
        # window and opens it again, it must show the styles list panel, not
        # the last panel opened
        self.action = 'List'
        return response

    def render_POST(self, request):
        """ Called on client form submit

        Every form received must have an 'action' field, which value determines
        the function to be executed in the server side.
        The self.action attribute will be sent back to the client (see render_GET)
        """
        self.reloadPanel(request.args['action'][0])

        if request.args['action'][0] == 'doExport':
            self.doExportStyle(request.args['style'][0],
                               request.args['filename'][0],
                               request.args['xdata'][0])
        elif request.args['action'][0] == 'doDelete':
            self.doDeleteStyle(request.args['style'][0])
        elif request.args['action'][0] == 'doImport':
            try:
                self.doImportStyle(request.args['filename'][0])
                self.alert(
                           _(u'Success'),
                           _(u'Successfully imported style'))
            except Exception, e:
                self.alert(
                           _(u'Error'),
                           _(u'Error while installing style: %s') % str(e))
        elif request.args['action'][0] == 'doProperties':
            self.doPropertiesStyle(request.args['style'][0])
        elif request.args['action'][0] == 'doPreExport':
            self.doPreExportStyle(request.args['style'][0])
        elif request.args['action'][0] == 'doStylesRepository':
            self.doStylesRepository()
        elif request.args['action'][0] == 'doStyleImportURL':
            self.doStyleImportURL(request.args['style_import_url'][0])
        elif request.args['action'][0] == 'doStyleImportRepository':
            self.doStyleImportRepository(request.args['style_name'][0])
        elif request.args['action'][0] == 'doList':
            self.doList()

        return ''

    def reloadPanel(self, action):
        self.client.sendScript('Ext.getCmp("stylemanagerwin").down("form").reload("%s")' % (action),
                               filter_func=allSessionClients)

    def alert(self, title, mesg):
        self.client.sendScript('Ext.Msg.alert("%s","%s")' % (title, mesg),
                               filter_func=allSessionClients)

    def renderListStyles(self):
        """
        Returns a JSON response with a list of the installed styles
        and its related buttons
        """
        styles = []
        styles_sort = self.config.styleStore.getStyles()

        def sortfunc(s1, s2):
            return locale.strcoll(s1.get_name(), s2.get_name())
        locale.setlocale(locale.LC_ALL, "")
        styles_sort.sort(sortfunc)
        for style in styles_sort:
            export = True
            delete = False
            editButton = False
            properties = False
            if    style.get_dirname() != 'base' \
              and style.get_dirname() != "cedec" \
              and style.get_dirname() != "docs" \
              and style.get_dirname() != "INTEF" \
              and style.get_dirname() != "kids" \
              and style.get_dirname() != "simplepoint" \
              and style.get_dirname() != "udl":
                delete = True
            if style.hasValidConfig():
                properties = True
                if style.isStyleDesignerCompatible():
                    editButton = True
            styles.append({'style': style.get_dirname(),
                           'name': style.get_name(),
                           'editButton': editButton,
                           'exportButton': export,
                           'deleteButton': delete,
                           'propertiesButton': properties})
        return styles

    def doImportStyle(self, filename):
        """ Imports an style from a ZIP file

        Checks that it is a valid style file (has a content.css),
        that the directory does not exist (prevent overwriting),
        and if config.xml file exists, it checks that the style
        name does not exist.
        """
        styleDir = self.config.stylesDir
        log.debug("Import style from %s" % filename)
        filename = filename.decode('utf-8')
        BaseFile = os.path.basename(filename)
        targetDir = BaseFile[0:-4:]
        absoluteTargetDir = styleDir / targetDir
        try:
            sourceZip = ZipFile(filename, 'r')
        except IOError:
            # Can not create DOM object
            raise ImportStyleError(_('Could not retrieve data (Core error)'))
        if os.path.isdir(absoluteTargetDir):
            style = Style(absoluteTargetDir)
            raise ImportStyleExistsError(style, absoluteTargetDir, _('Directory exists'))
        else:
            os.mkdir(absoluteTargetDir)
            for name in sourceZip.namelist():
                sourceZip.extract(name, absoluteTargetDir)
            sourceZip.close()
            style = Style(absoluteTargetDir)
            if style.isValid():
                if not self.config.styleStore.addStyle(style):
                    absoluteTargetDir.rmtree()
                    raise ImportStyleExistsError(style, absoluteTargetDir, _('The style name already exists'))
            else:
                # Check missing files
                cssFile = style.get_style_dir()/'content.css'
                files_to_check = ['content.css']
                missing_files = []
                for f in files_to_check:
                    if not (style.get_style_dir()/f).exists():
                        missing_files.append(f)
                if missing_files:
                    # Missing files error
                    missing_files_text = ', '.join(missing_files)
                    if len(missing_files) > 1:
                        style_error =  ImportStyleError(_('Files %s does not exist or are not readable.') % missing_files_text)
                    else:
                        style_error =  ImportStyleError(_('File %s does not exist or is not readable.') % missing_files_text)
                else:
                    configStyle = style.get_style_dir()/'config.xml'
                    if configStyle.exists():
                        # We consider that if no file is missing the error is due to the format of config.xml
                        style_error = ImportStyleError(_('Wrong config.xml file format.'))
                    else:
                        # Generic error
                        style_error = ImportStyleError(_('An unknown error occurred while importing the style.'))
                # Remove the style
                absoluteTargetDir.rmtree()
                # Raise error
                raise style_error
                

        # If not error was thrown, style was successfully imported
        # Let the calling function inform the user as appropriate
        self.action = ""

    def doStylesRepository(self):
        def getStylesList(styles_list):
            """ Update styles list with data got from repository

            Update styles list with data got from repository and send to
            client order to refresh styles list in the UI
            """
            log.debug("Styles list updated from repository. ")
            self.rep_styles = styles_list
            self.client.sendScript('Ext.getCmp("stylemanagerwin").down("form").refreshStylesList(%s)'
                                   % json.dumps(self.rep_styles))
            self.client.sendScript("Ext.Msg.close();")
            # On success, show the style list from repository
            self.action = 'StylesRepository'

        def errorStylesList(value):
            log.error("Error getting styles list from repository: %s " % str(value))
            self.rep_styles = []
            self.client.sendScript('Ext.getCmp("stylemanagerwin").down("form").refreshStylesList(%s)'
                                   % json.dumps(self.rep_styles))
            self.alert(_(u'Error'),
                       _(u'Error while getting styles list from the repository'))
            # Getting styles list from repository failed, get back to
            # installed styles list
            self.action = 'List'
            self.style = ''

        try:
            self.client.sendScript("Ext.Msg.wait('%s');"% _('Please wait...'))
            log.debug("Calling remote method 'exe_styles.listStyles' from %s"
                      % self.config.stylesRepository.encode('ascii'))
            self.proxy.callRemote('exe_styles.listStyles').addCallbacks(getStylesList, errorStylesList)

        except Exception, e:
            errorStylesList(str(e))

    def overwriteLocalStyle(self, style_dir, filename):
        """ Overwrites an already installed style with a new version from file """
        log.debug(u"Overwriting style %s with style from %s" % (style_dir, filename))
        try:
            # Delete local style
            style_path = Path(style_dir)
            styleDelete = Style(style_path)
            self.__deleteStyle(styleDelete)
            # Import downloaded style
            self.doImportStyle(filename)
            self.client.sendScript("Ext.MessageBox.alert('%s', '%s')" % (_('Correct'), _('Style updated correctly')))
        except:
            self.client.sendScript("Ext.MessageBox.alert('%s', '%s')" % (_('Error'), _('An unexpected error has occurred')))
        finally:
            Path(filename).remove()

    def doStyleImportURL(self, url, style_name=''):
        """ Download style from url and import into styles directory """
        def successDownload(result):
            filename = result[0]
            try:
                log.debug("Installing style %s from %s" % (style_name, filename))
                self.doImportStyle(filename)
                self.client.sendScript('Ext.getCmp("stylemanagerwin").down("form").refreshStylesList(%s, \'%s\')'
                                       % (json.dumps(self.rep_styles), style_name))
                self.alert(_(u'Success'),
                           _(u'Style successfully downloaded and installed'))
                Path(filename).remove()
            except ImportStyleExistsError, e:
                # This might retry installation from already downloaded file, do not delete
                warnLocalStyleExists(e.absolute_style_dir, filename)

            except Exception, e:
                log.error("Error when installing style %s from %s: %s" % (style_name, filename, str(e)))
                self.client.sendScript('Ext.getCmp("stylemanagerwin").down("form").refreshStylesList(%s, \'%s\')'
                                       % (json.dumps(self.rep_styles), style_name))
                self.alert(_(u'Error'), _(u'Error while installing style'))
                Path(filename).remove()

        def warnLocalStyleExists(style_dir, downloaded_file):
            """ Shows confirmation dialog box to the user, before triggering the overwriteLocaStyle event

            A local version of this style is already installed, so a confirm dialog box must be shown to the user,
            asking if the remote style should overwrite the local one.
            1. 'Ext.Msg.confirm' shows such dialog. Accepts a callback parameter, that will be triggered when the
               user clicks ANY button: yes, no or close
            2. That callback will be a lambda function, that will trigger a different importing event in eXe's
               engine (nevow_clientToServerEvent(...))
            3. nevow_clientToServerEvent() must pass back to the engine the data needed to delete and reinstall
               this style (local style name directory and downloaded file)
            4. 'overwriteLocalStyle' event will be handled by MainPage::handleOverwriteLocalStyle, and will delete
               local style before importing the downloaded one
            """
            # 1. Ext.Msg.confirm title and description
            title = _(u'Overwrite local version of this style?')
            message = (
                _(u'Style already exists. ')
              + _(u'Importing this style will overwrite local style, this action cannot be undone. ')
              + _(u'Are you sure you want to install remote style?. ')
            )

            # 3. Prepare nevow_clientToServerEvent call, with local and remote styles info,
            #    escaping windows paths blackslashes if needed
            style_dir_js = style_dir.replace('\\', '\\\\')
            downloaded_file_js = downloaded_file.replace('\\', '\\\\')
            trigger_overwrite = ("nevow_clientToServerEvent('overwriteLocalStyle', this, '', '%s', '%s')"
                        % (style_dir_js, downloaded_file_js))

            # 2. Ext.Msg.confirm callback function. Checks the button clicked before sending event to server
            callback = ("function(btn) {console.log(btn);if (btn == 'yes') {%s;}}" % (trigger_overwrite))

            # 1. Show dialog box to user
            self.client.sendScript("Ext.Msg.confirm('%s', '%s', %s)" % (title, message, callback))

        def errorDownload(value):
            log.error("Error when downloading style from %s: %s" % (url, str(value)))
            self.rep_styles = []
            self.client.sendScript('Ext.getCmp("stylemanagerwin").down("form").refreshStylesList(%s, \'%s\')'
                                   % (json.dumps(self.rep_styles), style_name))
            self.alert(_(u'Error'),
                       _(u'Error when downloading style from repository'))

        try:
            # urlparse() returns a tuple, which elements are:
            #  0: schema -> http
            #  1: netloc -> exelearning.net
            #  2: path   -> path/to/file.zip
            url_parts = urlsplit(url)
            if (not url_parts[0]) or (not url_parts[1]) or (not url_parts[2]):
                log.error("URL %s not valid. " % url)
                self.alert(_(u'Error'), _(u'URL not valid. '))
                self.action = 'StylesRepository'
                return

            path_splited = url_parts[2].split('/')
            filename = path_splited[-1]
            filename_parts = filename.split('.')
            if filename_parts[-1].lower() != 'zip':
                self.client.sendScript('Ext.getCmp("stylemanagerwin").down("form").refreshStylesList(%s, \'%s\')'
                                       % (json.dumps(self.rep_styles), style_name))
                log.error('URL %s not valid. ' % url)
                self.alert(_(u'Error'), _(u'URL not valid. '))
                self.action = 'StylesRepository'
                return

            self.client.sendScript('Ext.MessageBox.progress("%s", "%s")' % (_('Downloading...'), _('Please wait...')))

            # Downloaded ZIP file must have the same name than the remote file,
            # otherwise file would be saved to a random temporary name, that
            # 'doImportStyle' would use as style target directory
            temp_path = gettempdir()
            filename_path = os.path.join(temp_path, filename)
            log.debug("Downloading style %s from %s into %s" % (style_name, url, filename_path))
            # Disable the verification of ssl certificates on MacOs
            #  to prevent CERTIFICATE_VERIFY_FAILED

            if (platform == 'darwin' and hasattr(sys, 'frozen')):
                # context = ssl._create_unverified_context()
                context = ssl.create_default_context(cafile='cacert.pem')
            elif platform == "darwin":
                # context = ssl._create_unverified_context()
                context = ssl.create_default_context(cafile='cacert.pem')
                #context = ssl.create_default_context(cafile=certifi.where())
            else:
                context = None
            d = threads.deferToThread(
                                      urlretrieve, url, filename_path,
                                      lambda n, b, f: self.progressDownload(n, b, f, self.client), context=context)
            d.addCallbacks(successDownload, errorDownload)

            # On success or on error, get back to repository styles list
            self.action = 'StylesRepository'

        except Exception, e:
            errorDownload(str(e))
            self.action = 'StylesRepository'

    def doStyleImportRepository(self, style_name):
        """ Download style from repository and import into styles directory """
        try:
            url = ''
            log.debug("Import style %s from repository" % style_name)
            for style in self.rep_styles:
                if style.get('name', 'not found') == style_name:
                    url = style.get('download_url', '')
                    self.doStyleImportURL(url, style_name)
                    break

            if url == '':
                log.error('Style %s download URL not found' % style_name)
                self.alert(_(u'Error'), _(u'Style download URL not found'))

            self.action = 'StylesRepository'

        except Exception, e:
            log.error('Error when getting %s URL from repository styles list: %s'
                      % (style_name, str(e)))
            self.alert(_(u'Error'),
                       _(u'Error when getting style URL from repository styles list: %s'
                         % str(e)))
            self.action = 'StylesRepository'

    def doExportStyle(self, stylename, filename, cfgxml):

        if filename != '':
            styleDir = self.config.stylesDir
            style = Style(styleDir / stylename)
            log.debug("dir %s" % style.get_style_dir())
            self.__exportStyle(style.get_style_dir(), unicode(filename), cfgxml)

    def __exportStyle(self, dirstylename, filename, cfgxml):
        """ Exports style to a ZIP file """
        if not filename.lower().endswith('.zip'):
            filename += '.zip'
        sfile = os.path.basename(filename)
        log.debug("Export style %s" % dirstylename)
        try:
            zippedFile = ZipFile(filename, "w")
            try:
                if cfgxml != '':
                    for contFile in dirstylename.files():
                        if contFile.basename() != 'config.xml':
                            zippedFile.write(
                                             unicode(contFile.normpath()),
                                             contFile.basename(),
                                             ZIP_DEFLATED)
                else:
                    for contFile in dirstylename.files():
                            zippedFile.write(unicode(
                                                     contFile.normpath()),
                                                     contFile.basename(),
                                                     ZIP_DEFLATED)
            finally:
                if cfgxml != '':
                    zippedFile.writestr('config.xml', cfgxml)
                zippedFile.close()
                self.alert(_(u'Correct'),
                           _(u'Style exported correctly: %s') % sfile)

        except IOError:
            self.alert(_(u'Error'),
                       _(u'Could not export style : %s') % filename.basename())
        self.action = ""

    def doDeleteStyle(self, style):
        try:
            styleDir = self.config.stylesDir
            styleDelete = Style(styleDir / style)
            self.__deleteStyle(styleDelete)
            self.alert(_(u'Correct'), _(u'Style deleted correctly'))
            self.reloadPanel('doList')
        except:
            self.alert(_(u'Error'), _(u'An unexpected error has occurred'))
        self.action = ""

    def __deleteStyle(self, style):
        """ Deletes the given style from local installation """
        log.debug("delete style")
        shutil.rmtree(style.get_style_dir())
        self.config.styleStore.delStyle(style)
        log.debug("delete style: %s" % style.get_name())

    def doPropertiesStyle(self, style):
        styleDir = self.config.stylesDir
        styleProperties = Style(styleDir / style)
        self.properties = styleProperties.renderPropertiesJSON()
        self.action = 'Properties'
        self.style = styleProperties.get_name()

    def doPreExportStyle(self, style):
        styleDir = self.config.stylesDir
        styleProperties = Style(styleDir / style)
        self.properties = styleProperties.renderPropertiesJSON()
        self.action = 'PreExport'
        self.style = style

    def doList(self):
        self.action = 'List'
        self.style = ''

    def progressDownload(self, numblocks, blocksize, filesize, client):
        try:
            percent = min((numblocks * blocksize * 100) / filesize, 100)
        except:
            percent = 100
        client.sendScript('Ext.MessageBox.updateProgress(%f, "%d%%", "%s")'
                          % (float(percent) / 100, percent, _("Please wait...")))
        log.debug('%3d' % (percent))
