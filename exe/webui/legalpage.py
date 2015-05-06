#!/usr/bin/python
# -*- coding: utf-8 -*-
# ===========================================================================
# eXe
# Copyright 2015, Juan Rafael Fernández,
# using work done by Pedro Peña Pérez, Open Phoenix IT
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
# Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
# ===========================================================================
"""
The LegalPage is responsible for showing legal information:
copyright, licenses... of eXeLearning and of the third libraries used.
"""

import logging
from exe.webui.renderable import Renderable
from nevow import rend

log = logging.getLogger(__name__)


# ===========================================================================
class LegalPage(Renderable, rend.Page):
    """
    The legalPage class is responsible for showing legal information:
    copyright, licenses... of eXeLearning and of the third libraries used.
    """

    _templateFileName = 'legal.html'
    name = 'legal'

    def __init__(self, parent):
        """
        Initialize
        """
        parent.putChild(self.name, self)
        Renderable.__init__(self, parent)
        rend.Page.__init__(self)

# ===========================================================================
