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
The TemplateManagerPage is responsible for managing templates
"""

import json
import logging
import os
from zipfile                   import ZipFile

from exe.engine.path import Path
from exe.engine.template      import Template
from exe.webui.livepage        import allSessionClients
from exe.webui.renderable      import RenderableResource
from exe                         import globals as G
from exe.engine.package import Package
from exe.export.pages            import forbiddenPageNames


log = logging.getLogger(__name__)


class ImportTemplateError(Exception):
    pass


class ImportTemplateExistsError(ImportTemplateError):
    def __init__(self, local_template, absolute_template_dir, message=''):
        self.local_template = local_template
        self.absolute_template_dir = absolute_template_dir
        if message == '':
            self.message = 'Error importing template, local template already exists. '
        else:
            self.message = message

    def __str__(self):
        return self.message

    pass


class TemplateManagerPage(RenderableResource):
    """
    The TemplateManagerPage is responsible for managing templates
    import / export / delete
    """

    name = 'templatemanager'

    def __init__(self, parent):
        """
        Initialize
        """
        RenderableResource.__init__(self, parent)
        self.action = ""
        self.properties = ""
        self.template = ""
        self.client = None

    def render_GET(self, request):
        """Called for all requests to this object

        Every JSON response sent must have an 'action' field, which value will
        determine the panel to be displayed in the WebUI
        """

        if self.action == 'Properties':
            response = json.dumps({
                                   'success': True,
                                   'properties': self.properties,
                                   'template': self.template,
                                   'action': 'Properties'})
        elif self.action == 'PreExport':
            response = json.dumps({
                                   'success': True,
                                   'properties': self.properties,
                                   'template': self.template,
                                   'action': 'PreExport'})
        else:
            response = json.dumps({
                                   'success': True,
                                   'templates': self.renderListTemplates(),
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
            self.doExportTemplate(request.args['template'][0],
                               request.args['filename'][0])
        elif request.args['action'][0] == 'doDelete':
            self.doDeleteTemplate(request.args['template'][0])
        elif request.args['action'][0] == 'doImport':
            try:
                self.doImportTemplate(request.args['filename'][0])
                self.alert(
                           _('Success'),
                           _('Successfully imported template'))
            except Exception as e:
                self.alert(
                           _('Error'),
                           _('Error while installing template: %s') % str(e))
        elif request.args['action'][0] == 'doProperties':
            self.doPropertiesTemplate(request.args['template'][0])
        elif request.args['action'][0] == 'doPreExport':
            self.doPreExportTemplate(request.args['template'][0])
        elif request.args['action'][0] == 'doEdit':
            self.doEditTemplate(request.args['template'][0])
        elif request.args['action'][0] == 'doList':
            self.doList()

        return ''

    def reloadPanel(self, action):

        self.client.sendScript('Ext.getCmp("templatemanagerwin").down("form").reload("%s")' % (action),
                               filter_func=allSessionClients)

    def alert(self, title, mesg):

        self.client.sendScript('Ext.Msg.alert("%s","%s")' % (title, mesg),
                               filter_func=allSessionClients)

    def renderListTemplates(self):
        """
        Returns a JSON response with a list of the installed templates
        and its related buttons
        """
        templates = []
        templateStores = self.config.templateStore.getTemplates()

        for template in templateStores:
                export = True
                delete = False
                properties = True
                edit = template.isEditable()
                if template.name != 'Base' and template.name != self.config.defaultContentTemplate and edit:
                    delete = True
                if template.name != self.config.defaultContentTemplate:
                    templates.append({'template': template.file,
                               'name': template.name,
                               'exportButton': export,
                               'deleteButton': delete,
                               'propertiesButton': properties,
                               'editButton': edit})
        return templates

    def doImportTemplate(self, filename):
        """ Imports an template from a ELT file

        Checks that it is a valid template file,
        that the directory does not exist (prevent overwriting)
        """
        log.debug("Import template from %s" % filename)

        filename = Path(filename)
        baseFile = filename.basename()
        absoluteTargetDir = self.config.templatesDir / baseFile

        try:
            ZipFile(filename, 'r')
        except IOError:
            raise ImportTemplateError('Can not create dom object')

        if os.path.exists(absoluteTargetDir):

            template = Template(absoluteTargetDir)
            raise ImportTemplateExistsError(template, absoluteTargetDir, 'Template already exists')
        else:

            filename.copyfile(absoluteTargetDir)
            template = Template(absoluteTargetDir)

            if template.isValid():

                    if not self.config.templateStore.addTemplate(template):

                        absoluteTargetDir.remove()
                        raise ImportTemplateExistsError(template, absoluteTargetDir, 'The template name already exists')
            else:

                absoluteTargetDir.remove()
                raise ImportTemplateExistsError(template, absoluteTargetDir, 'Incorrect template format')

        self.action = ""

    def doExportTemplate(self, template, filename):

        if filename != '':
            templateExport = Template(self.config.templatesDir / template)
            self.__exportTemplate(templateExport, str(filename))

    def __exportTemplate(self, dirTemplateName, filename):
        """ Exports template """
        if not filename.lower().endswith('.elt'):
            filename += '.elt'

        name = str(Path(filename).basename().splitext()[0])
        if name.upper() in forbiddenPageNames:
            self.alert(_('Error'),
                       _("SAVE FAILED! '%s' is not a valid name for a template") % str(name))
            return

        sfile = os.path.basename(filename)
        log.debug("Export template %s" % dirTemplateName)
        try:
            dirTemplateName.path.copyfile(filename)

            self.alert(_('Correct'),
                       _('Template exported correctly: %s') % sfile)
        except IOError:
            self.alert(_('Error'),
                       _('Could not export template : %s') % filename.basename())
        self.action = ""

    def doDeleteTemplate(self, template):

        # Get the current authoring page

        for mainpages in list(self.parent.mainpages.values()):
            for mainpage in list(mainpages.values()):
                if self.client.handleId in mainpage.authoringPages:
                    authoringPage = mainpage.authoringPages[self.client.handleId]

        try:
            if authoringPage.package.filename == (self.config.templatesDir / template):
                self.alert(_('Error'), _('It is not possible to delete an opened template.'))
                return
            templateDelete = Template(self.config.templatesDir / template)
            self.__deleteTemplate(templateDelete)
            self.alert(_('Correct'), _('Template deleted correctly'))
            self.reloadPanel('doList')
        except:
            self.alert(_('Error'), _('An unexpected error has occurred'))
        self.action = ""

    def __deleteTemplate(self, template):
        """ Deletes the given template from local installation """
        log.debug("delete template")
        templatePath = template.path
        templatePath.remove()
        self.config.templateStore.delTemplate(template)

    def doPropertiesTemplate(self, template):
        templateProperties = Template(self.config.templatesDir / template)
        self.properties = templateProperties._renderProperties()
        self.action = 'Properties'
        self.template = templateProperties.name

    def doPreExportTemplate(self, template):
        templateExport = Template(self.config.templatesDir / template)
        self.properties = templateExport._renderProperties()
        self.action = 'PreExport'
        self.template = template

    def doList(self):

        self.action = 'List'
        self.template = ''

    def doEditTemplate(self, template):
        try:
            templateEdit = Package.load(Template(self.config.templatesDir / template).path, isTemplate=True)
            self.webServer.root.bindNewPackage(templateEdit, self.client.session)
            self.client.sendScript(('eXe.app.gotoUrl("/%s")' % \
                          templateEdit.name).encode('utf8'))
        except:
            self.alert(_('Error'), _('An unexpected error has occurred'))

