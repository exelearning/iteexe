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
The PropertiesPage is for user to enter or edit package's properties
"""

import logging
from exe.webui.propertiespane import PropertiesPane
from exe.webui.renderable import RenderableLivePage
from nevow import loaders, inevow, stan
from nevow.livepage import handler, js
from exe.engine.path import Path

log = logging.getLogger(__name__)


class PropertiesPage(RenderableLivePage):
    """
    The PropertiesPage is for user to enter or edit package's properties
    """
    _templateFileName = 'properties.xul'
    name = 'properties'

    def __init__(self, parent):
        """
        Initialize
        """
        RenderableLivePage.__init__(self, parent)
        mainxul = Path(self.config.xulDir).joinpath('templates', 'properties.xul')
        self.docFactory  = loaders.xmlfile(mainxul)
        self.client = None
        self.fieldsReceived = set()

        # Processing
        log.info("creating the properties page")
                        
    def goingLive(self, ctx, client):
        """Called each time the page is served/refreshed"""
        inevow.IRequest(ctx).setHeader('content-type', 'application/vnd.mozilla.xul+xml')

        hndlr = handler(self.handleSubmit, identifier='submit')
        hndlr(ctx, client) # Stores it

        hndlr = handler(self.submitProjectProperties,
                        identifier='submitProjectProperties')
        hndlr(ctx, client) # Stores it

        hndlr = handler(self.fillInField, identifier='fillInField')
        hndlr(ctx, client) # Stores it

        hndlr = handler(self.recieveFieldData, identifier='recieveFieldData')
        hndlr(ctx, client) # Stores it

        hndlr = handler(self.translate, identifier='translate')
        hndlr(ctx, client) # Stores it

    def handleSubmit(self, client, title, creator, subject, description, 
                     publisher, contributor, date, type, format, identifier,
                     source, language, relation, coverage, rights):
        self.package.dublinCore.title = title
        self.package.dublinCore.creator = creator
        self.package.dublinCore.subject = subject
        self.package.dublinCore.description = description
        self.package.dublinCore.publisher = publisher
        self.package.dublinCore.contributor = contributor
        self.package.dublinCore.date = date
        self.package.dublinCore.type = type
        self.package.dublinCore.format = format 
        self.package.dublinCore.identifier = identifier
        self.package.dublinCore.source = source
        self.package.dublinCore.language = language
        self.package.dublinCore.relation = relation
        self.package.dublinCore.coverage = coverage
        self.package.dublinCore.rights = rights
        client.alert(_(u'Properties Updated'))
        client.sendScript(js('top.location = top.location;'))

    def __getattribute__(self, name):
        """
        Provides auto field fill-ins
        """
        if name.startswith('render_'):
            localName = name[7:] # Get rid of render
            # Name contains pp_abc to get package.abc or dc_abc to get dc.abc
            # pp means Project Properties
            # dc means Dublin Core
            # eo means Export Options
            if '_' in localName:
                obj, name = self.fieldId2obj(localName)
                return lambda ctx, data: ctx.tag(value=getattr(obj, localName))
        return RenderableLivePage.__getattribute__(self, name)

    def submitProjectProperties(self, client,
                                title, author, description,
                                level1, level2, level3):
        """
        Handles the submission of the project properties
        """
        self.package.title = title
        self.package.author = author
        self.package.description = description
        self.package.level1 = level1
        self.package.level2 = level2
        self.package.level3 = level3
        client.alert(_(u'Project Properties Updated'))
        client.sendScript(js('top.location = top.location;'))

    def fieldId2obj(self, fieldId):
        """
        Takes a field id of the form xx_name and returns the object associated
        with xx and name. These can be used with getattr and setattr
        """
        if '_' in fieldId:
            part, name = fieldId.split('_', 1)
            # Get the object
            if part == 'pp':
                obj = self.package
            if part == 'dc':
                obj = self.package.dublinCore
            if part == 'eo':
                obj = self.package.exportOptions
            if hasattr(obj, name):
                return obj, name
        raise ValueError("field id '%s' doesn't refer "
                         "to a valid object attribute" % fieldId)

    def fillInField(self, client, fieldId):
        """
        Makes the server fill in the value of a field on the client. 
        n:render for people who don't have LivePage objects for xul overlays
        """
        # Get the object
        obj, name = self.fieldId2obj(fieldId)
        value = getattr(obj, name)
        client.sendScript(js(
            'document.getElementById("%s").value = "%s"' % \
                (fieldId, value.encode('utf-8'))))

    def recieveFieldData(self, client, fieldId, value, number, total):
        """
        Called by client to give us a value from a certain field
        """
        number = int(number)
        total = int(total)
        if number == 0:
            self.fieldsReceived = set([0])
        else:
            self.fieldsReceived.add(fieldId)
        obj, name = self.fieldId2obj(fieldId)
        setattr(obj, name, value)
        client.sendScript(js(
            'document.getElementById("%s").style.color = "black"' % fieldId))
        if len(self.fieldsReceived) == total - 1:
            client.sendScript(js('alert("%s")' % _('Settings saved')))

    def translate(self, client, elementId, attribute, data):
        """
        Translates a string from an element
        """
        if data.strip() and data != 'undefined':
            newText = _(data)
            if newText != data and elementId != '':
                newText = newText.replace('\\', '\\\\').replace("'", "\\'").replace('\n', '\\n')
                if elementId:
                    if attribute == '!contents!':
                        client.sendScript(js(
                            "document.getElementById(\"%s\").firstChild.data = '%s');" % 
                                (elementId, newText)))
                    else:
                        client.sendScript(js(
                            "document.getElementById(\"%s\").setAttribute('%s', '%s');" % 
                                (elementId, attribute, newText)))
