#!/usr/bin/python
# -*- coding: utf-8 -*-
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
# Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
# ===========================================================================


import logging
from flask import Flask, render_template
import gettext

_ = gettext.gettext

log = logging.getLogger(__name__)


# ===========================================================================
app = Flask(__name__)

@app.route('/quit')
def quit_page():
    return render_template('quit.html', title=_("eXe Closed"), msg1=_("eXe has finished running in this window."), msg2=_("You can close it safely."))
# ===========================================================================
