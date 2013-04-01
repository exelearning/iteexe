# -- coding: utf-8 --
# ===========================================================================
# eXe
# Copyright 2012, Pedro Pe�a P�rez, Open Phoenix IT
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


import logging
from exe.webui.renderable import Renderable
from nevow  import rend

log = logging.getLogger(__name__)


# ===========================================================================
class QuitPage(Renderable, rend.Page):
    _templateFileName = 'quit.html'
    name = 'quit'

    def __init__(self, parent):
        """
        Initialize
        """
        parent.putChild(self.name, self)
        Renderable.__init__(self, parent)
        rend.Page.__init__(self)

    def render_title(self, ctx, data):
        ctx.tag.clear()
        return ctx.tag()[_("eXe Closed")]

    def render_msg1(self, ctx, data):
        ctx.tag.clear()
        return ctx.tag()[_("eXe has finished running in this window.")]

    def render_msg2(self, ctx, data):
        ctx.tag.clear()
        return ctx.tag()[_("You can close it safely.")]
# ===========================================================================
