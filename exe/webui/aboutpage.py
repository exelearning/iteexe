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
from flask import Flask, render_template
from exe.engine           import version
from exe                  import globals as G

import logging

log = logging.getLogger(__name__)


# ===========================================================================
class AboutPage:
    """
    The AboutPage is responsible for showing about information
    """
    def __init__(self, app: Flask):
        self.app = app
        self.app.add_url_rule('/about', 'about', self.show_about)

    def show_about(self):
        revstring = ''
        if G.application.snap:
            revstring = ' (SNAP)'
        elif G.application.standalone:
            revstring = ' (standalone)'
        elif G.application.portable:
            revstring = ' (portable)'
        return render_template('about.html', version=version.release + revstring)

# ===========================================================================
