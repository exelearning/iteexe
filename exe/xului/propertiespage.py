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
The PropertiesPage is for user to enter or edit package's properties.

It works with AJAX magic.

It has 3 functions:
1. Translate the user interface of the xulpages on the fly (translate)
2. Fill in xul fields from engine object attributes when the page loads (fillInField)
3. Recieve user changes to those attributes (recieveFieldData)

All fields are assumed to be string fields, except for a small list of
attribute names found in 'PropertiesPage.booleanFieldNames' class attribute. To
add any other type of field, create a similar list as this.

There is more documentation in the headers of the files in xului/templates
diretory about how to add fields etc.
"""

import logging
from exe.webui.renderable     import RenderableLivePage
from nevow                    import loaders, inevow, stan
from nevow.livepage           import handler, js
from exe.engine.path          import Path, toUnicode
import re


log = logging.getLogger(__name__)


class PropertiesPage(RenderableLivePage):
    """
    The PropertiesPage is for user to enter or edit package's properties
    """
    _templateFileName = 'properties.xul'
    name = 'properties'
    # List of field names that contain boolean values
    booleanFieldNames = ('pp_scolinks', 'pp_backgroundImgTile')
    # List of field names that contain image values
    imgFieldNames     = ('pp_backgroundImg',)
    # Used for url encoding with unicode support
    reUni = re.compile('(%u)([0-9,A-F,a-f]{4})')
    reChr = re.compile('(%)([0-9,A-F,a-f]{2})')
    reRaw = re.compile('(.)')

    def __init__(self, parent):
        """
        Initialize
        """
        RenderableLivePage.__init__(self, parent)
        mainxul = Path(self.config.xulDir).joinpath('templates', 
                                                    'properties.xul')
        self.docFactory  = loaders.xmlfile(mainxul)
        self.client = None
        self.fieldsReceived = set()

        # Processing
        log.info("creating the properties page")
                        
    def goingLive(self, ctx, client):
        """Called each time the page is served/refreshed"""
        inevow.IRequest(ctx).setHeader('content-type', 'application/vnd.mozilla.xul+xml')

        hndlr = handler(self.fillInField, identifier='fillInField')
        hndlr(ctx, client) # Stores it

        hndlr = handler(self.recieveFieldData, identifier='recieveFieldData')
        hndlr(ctx, client) # Stores it

        hndlr = handler(self.translate, identifier='translate')
        hndlr(ctx, client) # Stores it


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
        if fieldId in self.booleanFieldNames:
            client.sendScript(js(
                'document.getElementById("%s").checked = %s' % \
                    (fieldId, str(value).lower())))
        elif fieldId in self.imgFieldNames:
            encoded = ''
            for char in value:
                encoded += '%%u%04x' % ord(char[0])
            client.sendScript(js(
                'document.getElementById("%s").src = unescape("%s")' % \
                    (fieldId, encoded)))
        else:
            # Remove enters
            encoded = ''
            for char in value:
                encoded += '%%u%04x' % ord(char[0])
            client.sendScript(js(
                'document.getElementById("%s").value = unescape("%s")' % \
                    (fieldId, encoded)))

    def recieveFieldData(self, client, fieldId, value, total, onDone=None):
        """
        Called by client to give us a value from a certain field
        """
        total = int(total)
        self.fieldsReceived.add(fieldId)
        obj, name = self.fieldId2obj(fieldId)
        # Decode the value
        decoded = ''
        toSearch = value
        def getMatch():
            if toSearch and toSearch[0] == '%':
                match1 = self.reUni.search(toSearch)
                match2 = self.reChr.search(toSearch)
                if match1 and match2:
                    if match1.start() < match2.start():
                        return match1
                    else:
                        return match2
                else:
                    return match1 or match2
            else:
                return self.reRaw.search(toSearch)
        match = getMatch()
        while match:
            num = match.groups()[-1]
            if len(num) > 1:
                decoded += unichr(int(num, 16))
            else:
                decoded += num
            toSearch = toSearch[match.end():]
            match = getMatch()
        # Check the field type
        if fieldId in self.booleanFieldNames:
            setattr(obj, name, decoded[0].lower() == 't')
        elif fieldId in self.imgFieldNames:
            setattr(obj, name, toUnicode(decoded))
        else:
            # Must be a string
            setattr(obj, name, toUnicode(decoded))
        client.sendScript(js(
            'document.getElementById("%s").style.color = "black"' % fieldId))
        if len(self.fieldsReceived) == total:
            self.fieldsReceived = set()
            client.sendScript(js.alert(
                (u"%s" % _('Settings saved')).encode('utf8')))
            if onDone:
                client.sendScript(js(onDone))

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
                            "document.getElementById(\"%s\").firstChild.data = '%s';" % 
                                (elementId, newText.encode('utf-8'))))
                    else:
                        client.sendScript(js(
                            "document.getElementById(\"%s\").setAttribute('%s', '%s');" % 
                                (elementId, attribute, newText.encode('utf-8'))))
