# ===========================================================================
# eXe
# Copyright 2004-2006, University of Auckland
# Copyright 2004-2011 eXe Project, http://eXeLearning.org/
# Copyright 2015 Mercedes Cotelo Lois <mclois@gmail.com>
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
The ReleaseNotesPage is responsible for showing Release Notes information
"""

import os
import codecs
from flask import Blueprint, render_template_string
from exe.engine           import version

import logging

log = logging.getLogger(__name__)


class ReleaseNotesPage:
    """
    The ReleaseNotesPage is responsible for showing Release Notes information
    """
    _templateFileName = 'release-notes.html'
    name = 'release-notes'

    def __init__(self, app):
        self.app = app
        self.blueprint = Blueprint(self.name, __name__, template_folder='templates')
        self.app.register_blueprint(self.blueprint)

    @staticmethod
    def route(blueprint):
        @blueprint.route('/release-notes')
        def show():
            return render_template_string(ReleaseNotesPage.render_changelog())
    def show(self):
        return render_template_string(self.render_changelog())

    def render_version(self, ctx, data):
        return ctx.tag()[version.release]

    def render_changelog(self, ctx, data):
        try:
            # When eXe is run on an regular installation, ChangeLog file is in the webDir
            changelog_file = os.path.join(self.config.webDir, 'ChangeLog')
            changelog_contents = codecs.open(changelog_file, 'r', 'utf-8').read()
        except IOError:
            # When eXe is launched in dev enviroment, ChangeLog file is in the project root
            try:
                changelog_file = os.path.join(self.config.exePath, '../ChangeLog')
                changelog_contents = codecs.open(changelog_file, 'r', 'utf-8').read()
            except IOError:
                # fail silently if we can't read either of the files
                changelog_contents = ''
                pass
        return ctx.tag()[changelog_contents]
