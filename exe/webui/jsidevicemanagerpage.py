#!/usr/bin/python
# -*- coding: utf-8 -*-
# ===========================================================================
# eXeLearning
# Copyright 2017, CeDeC
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
The JsIdeviceManagerPage is responsible for managing jsidevices
"""

import logging
import os
import shutil
from zipfile                   import ZipFile, ZIP_DEFLATED
import json
from twisted.web.resource      import Resource
from exe.webui.livepage        import allSessionClients
from exe.webui.renderable      import RenderableResource
from exe.engine.jsidevice      import JsIdevice


log = logging.getLogger(__name__)


class ImportJsIdeviceError(Exception):
    pass


class ImportjsideviceExistsError(ImportJsIdeviceError):
    def __init__(self, local_jsidevice, absolute_jsidevice_dir, message=''):
        self.local_jsidevice = local_jsidevice
        self.absolute_jsidevice_dir = absolute_jsidevice_dir
        if message == '':
            self.message = u'Error importing jsidevice, local jsidevice already exists. '
        else:
            self.message = message

    def __str__(self):
        return self.message

    pass


class JsIdeviceManagerPage(RenderableResource):
    """
    The JsIdeviceManagerPage is responsible for managing jsidevices
    import / export / delete
    """

    name = 'jsidevicemanager'

    def __init__(self, parent):
        """
        Initialize
        """
        RenderableResource.__init__(self, parent)
        self.action = ""
        self.properties = ""
        self.jsidevice = ""
        self.client = None

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
                                   'jsidevice': self.jsidevice,
                                   'action': 'Properties'})
        elif self.action == 'PreExport':
            response = json.dumps({
                                   'success': True,
                                   'properties': self.properties,
                                   'jsidevice': self.jsidevice,
                                   'action': 'PreExport'})          
        else:
            response = json.dumps({
                                   'success': True,
                                   'jsidevices': self.renderListJsIdevices(),
                                   'action': 'List'})
            
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
            self.doExportJsIdevice(request.args['jsidevice'][0],
                               request.args['filename'][0])
        elif request.args['action'][0] == 'doDelete':
            self.doDeleteJsIdevice(request.args['jsidevice'][0])
        elif request.args['action'][0] == 'doImport':
            try:
                self.doImportJsIdevice(request.args['filename'][0])
                self.alert(
                           _(u'Success'),
                           _(u'Successfully imported jsidevice'))
            except Exception, e:
                self.alert(
                           _(u'Error'),
                           _(u'Error while installing jsidevice: %s') % str(e))
        elif request.args['action'][0] == 'doProperties':
            self.doPropertiesJsIdevice(request.args['jsidevice'][0])
        elif request.args['action'][0] == 'doPreExport':
            self.doPreExportJsIdevice(request.args['jsidevice'][0])
        elif request.args['action'][0] == 'doList':
            self.doList()

        return ''

    def reloadPanel(self, action):
        self.client.sendScript('Ext.getCmp("jsidevicemanagerwin").down("form").reload("%s")' % (action),
                               filter_func=allSessionClients)

    def alert(self, title, mesg):
        self.client.sendScript('Ext.Msg.alert("%s","%s")' % (title, mesg),
                               filter_func=allSessionClients)

    def renderListJsIdevices(self):
        """
        Returns a JSON response with a list of the installed jsidevices
        and its related buttons
        """
        jsidevices = []
        idevices = self.ideviceStore.getIdevices()

        for idevice in idevices:
            if self.ideviceStore.isJs(idevice):
                export = True
                delete = True
                properties = True
                jsidevices.append({'jsidevice': idevice.get_dirname(),
                               'name': idevice.get_title(),
                               'exportButton': export,
                               'deleteButton': delete,
                               'propertiesButton': properties})
        return jsidevices

    def doImportJsIdevice(self, filename):
        """ Imports an jsidevice from a ZIP file

        Checks that it is a valid jsidevice file,
        that the directory does not exist (prevent overwriting),
        and if config.xml file exists, it checks that the jsidevice
        name does not exist.
        """
        jsIdeviceDir = self.config.webDir / 'scripts' / 'idevices'
        log.debug("Import jsidevice from %s" % filename)
        filename = filename.decode('utf-8')
        BaseFile = os.path.basename(filename)
        targetDir = BaseFile[0:-4:]
        absoluteTargetDir = jsIdeviceDir / targetDir
        try:
            sourceZip = ZipFile(filename, 'r')
        except IOError:
            raise ImportJsIdeviceError('Can not create dom object')
        if os.path.isdir(absoluteTargetDir):
            jsidevice = JsIdevice(absoluteTargetDir)
            raise ImportjsideviceExistsError(jsidevice, absoluteTargetDir, u'jsidevice directory already exists')
        else:
            os.mkdir(absoluteTargetDir)
            for name in sourceZip.namelist():
                sourceZip.extract(name, absoluteTargetDir)
            sourceZip.close()
            jsidevice = JsIdevice(absoluteTargetDir)
            if jsidevice.isValid():
                if self.ideviceStore.isJs(jsidevice):
                    if not self.ideviceStore.addIdevice(jsidevice):
                        absoluteTargetDir.rmtree()
                        raise ImportjsideviceExistsError(jsidevice, absoluteTargetDir, u'The jsidevice name already exists')
            else:
                absoluteTargetDir.rmtree()
                raise ImportjsideviceExistsError(jsidevice, absoluteTargetDir, u'Incorrect jsidevice format')

        self.action = ""

    def doExportJsIdevice(self, jsIdeviceName, filename):

        if filename != '':
            jsIdeviceDir = self.config.webDir / 'scripts' / 'idevices'
            jsidevice = JsIdevice(jsIdeviceDir / jsIdeviceName)
            log.debug("dir %s" % jsidevice.get_jsidevice_dir())
            self.__exportJsIdevice(jsidevice.get_jsidevice_dir(), unicode(filename))

    def __exportJsIdevice(self, dirJsIdeviceName, filename):
        """ Exports jsidevice to a ZIP file """
        if not filename.lower().endswith('.zip'):
            filename += '.zip'
        sfile = os.path.basename(filename)
        log.debug("Export jsidevice %s" % dirJsIdeviceName)
        try:
            zippedFile = ZipFile(filename, "w")
            try:
                
                for child in dirJsIdeviceName.listdir():
                    if child.isdir():
                        
                        for item in child.walk():
                            zippedFile.write(unicode(
                                                 item.normpath()),
                                                 item.normpath().replace(dirJsIdeviceName.normpath(), ''),
                                                 ZIP_DEFLATED)
                    else:
                            zippedFile.write(unicode(
                                                 child.normpath()),
                                                 child.basename(),
                                                 ZIP_DEFLATED)                
            finally:
                zippedFile.close()
                self.alert(_(u'Correct'),
                           _(u'jsidevice exported correctly: %s') % sfile)

        except IOError:
            self.alert(_(u'Error'),
                       _(u'Could not export jsidevice : %s') % filename.basename())
        self.action = ""

    def doDeleteJsIdevice(self, jsidevice):
        try:
            jsIdeviceDir = self.config.webDir / 'scripts' / 'idevices'
            jsIdeviceDelete = JsIdevice(jsIdeviceDir / jsidevice)
            self.__deletejsidevice(jsIdeviceDelete)
            self.alert(_(u'Correct'), _(u'jsidevice deleted correctly'))
            self.reloadPanel('doList')
        except:
            self.alert(_(u'Error'), _(u'An unexpected error has occurred'))
        self.action = ""

    def __deletejsidevice(self, jsidevice):
        """ Deletes the given jsidevice from local installation """
        log.debug("delete jsidevice")
        shutil.rmtree(jsidevice.get_jsidevice_dir())
        self.ideviceStore.delIdevice(jsidevice)
        log.debug("delete jsidevice: %s" % jsidevice.get_title())

    def doPropertiesJsIdevice(self, jsidevice):
        jsIdeviceDir = self.config.webDir / 'scripts' / 'idevices'
        jsIdeviceProperties = JsIdevice(jsIdeviceDir / jsidevice)
        self.properties = jsIdeviceProperties.renderProperties()
        self.action = 'Properties'
        self.jsidevice = jsIdeviceProperties.get_title()

    def doPreExportJsIdevice(self, jsidevice):
        jsIdeviceDir = self.config.webDir / 'scripts' / 'idevices'
        jsIdeviceProperties = JsIdevice(jsIdeviceDir / jsidevice)
        self.properties = jsIdeviceProperties.renderProperties()
        self.action = 'PreExport'
        self.jsidevice = jsidevice

    def doList(self):
        self.action = 'List'
        self.jsidevice = ''
        
