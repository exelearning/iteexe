# -- coding: utf-8 --
# ===========================================================================
# eXe
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
# Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
# ===========================================================================

"""
TemplateMenu provides a list of Templates used in eXe and handle related client events
"""

from exe.webui.livepage import allSessionClients
from exe.webui.renderable import Renderable
from twisted.web.resource import Resource
import json
import locale
import logging

log = logging.getLogger(__name__)

x_ = lambda s: s
fakeTranslate = [x_('INTEF with horizontal menu')]  # Unused var to add translatable style menu strings to pybabel
# ===========================================================================
class TemplateMenu(Renderable, Resource):
    """
    TemplateMenu provides a list of Styles used in eXe and handle related client events
    """
    name = 'templateMenu'

    def __init__(self, parent):
        """
        Initialize
        """
        Renderable.__init__(self, parent)
        if parent:
            self.parent.putChild(self.name, self)
        Resource.__init__(self)
        self.client = None
        self.config.templateStore.register(self)

    def render(self, request=None):
        """
        Returns a JSON string with the templates
        """
        log.debug("render")

        l = []
        printableTemplates = [(x.name, x.path) for x in self.config.templateStore.getTemplates()]

        def sortfunc(s1, s2):
            return locale.strcoll(s1[0], s2[0])
        locale.setlocale(locale.LC_ALL, "")
        printableTemplates.sort(sortfunc)
        for printableTemplate, template in printableTemplates:
            if printableTemplate != self.config.defaultContentTemplate:
                l.append({ "label": printableTemplate, "template": template})
        return json.dumps(l).encode('utf-8')

    def addTemplate(self, template):
        """
        Adds an Template to the list
        """
        self.client.sendScript('eXe.app.getController("Toolbar").templatesRender()', filter_func=allSessionClients)

    def delTemplate(self, template):
        """
        Delete an Template to the list
        """
        self.client.sendScript('eXe.app.getController("Toolbar").templatesRender()', filter_func=allSessionClients)

# ===========================================================================
