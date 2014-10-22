# ===========================================================================
# eXe
# Copyright 2004-2006, University of Auckland
# Copyright 2004-2011 eXe Project, http://eXeLearning.org/
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
The AboutPage is responsible for showing about information
"""

from twisted.web.resource import Resource
from exe.webui.renderable import Renderable
from nevow                import rend, tags
from exe.engine           import version

import logging

log = logging.getLogger(__name__)


# ===========================================================================
class AboutPage(Renderable, rend.Page):
    """
    The AboutPage is responsible for showing about information
    """
    _templateFileName = 'about.html'
    name = 'about'

    def __init__(self, parent):
        """
        Initialize
        """
        parent.putChild(self.name, self)
        Renderable.__init__(self, parent)
        rend.Page.__init__(self)

    def render_version(self, ctx, data):
        return ctx.tag()[version.release]

    def render_revision(self, ctx, data):
        return ctx.tag()[tags.a(href='%s;a=shortlog;h=%s' % (self.config.baseGitWebURL, version.revision),
                                target='_blank')[version.revision]
                        ]

# ===========================================================================
