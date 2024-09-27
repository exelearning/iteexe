# -- coding: utf-8 --
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
# Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
# ===========================================================================
"""
RecentMenu provides a list of Recent Projects used in eXe and handle related client events
"""

import logging
from exe.webui.renderable import Renderable
from twisted.web.resource import Resource
from exe import globals as G
import json
from xml.sax.saxutils import escape

log = logging.getLogger(__name__)

# ===========================================================================
class RecentMenu(Renderable, Resource):
    """
    RecentMenu provides a list of Recent Projects used in eXe and handle related client events
    """
    name = 'recentMenu'

    def __init__(self, parent):
        """ 
        Initialize
        """ 
        Renderable.__init__(self, parent)
        if parent:
            self.parent.putChild(self.name, self)
        Resource.__init__(self)
        self.client = None

    def handleLoadRecent(self, client, number):
        """
        Loads a file from our recent files list
        """
        filename = self.parent.config.recentProjects[int(number) - 1]
        self.parent.handleLoadPackage(client, filename)

    def handleClearRecent(self, client):
        """
        Clear the recent project list
        """
        G.application.config.recentProjects = []
        G.application.config.configParser.write()

    def render(self, request=None):
        """
        Returns a JSON string with the recent projects
        """
        log.debug("Render")

        l = []
        for num, path in enumerate(self.parent.config.recentProjects):
            l.append({'num': num + 1, 'path': escape(path)})
        return json.dumps(l).encode('utf-8')

# ===========================================================================
