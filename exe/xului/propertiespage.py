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
    _templateFileName = 'dublincore.xul'
    name = 'properties'

    def __init__(self, parent):
        """
        Initialize
        """
        RenderableLivePage.__init__(self, parent)
        mainxul = Path(self.config.xulDir).joinpath('templates', 'dublincore.xul')
        self.docFactory  = loaders.xmlfile(mainxul)
        self.client = None

        # Processing
        log.info("creating the properties page")
                        
    def goingLive(self, ctx, client):
        """Called each time the page is served/refreshed"""
        inevow.IRequest(ctx).setHeader('content-type', 'application/vnd.mozilla.xul+xml')
        hndlr = handler(self.handleSubmit, identifier='submit')
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
        if name.startswith('render_') and \
           hasattr(self.package.dublinCore, name[7:]):
            return lambda ctx, data: ctx.tag(
                value=getattr(self.package.dublinCore, name[7:]))
        return RenderableLivePage.__getattribute__(self, name)

    def render_POST(self, request):
        """
        Handles the submission of the properties form,
        creating a page that redirects the brower's top document
        back to the original package, thereby updating all the tree elements
        """
        # TODO: Make the script actually dynamically update the tree elements
        # without reloading the top form and losing our location. In fact
        # you don't even have to send this different new page,
        # You could rename the tree elements in the on submit handler or
        # something...
        log.info("after propertityPane process:"+ repr(request.args))
        return '\n'.join(
            ['<html>'
             ' <head/>',
             ' <body onload="top.location = top.location"/>',
             '</html>']).encode('utf8')
