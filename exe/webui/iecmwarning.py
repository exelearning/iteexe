# -- coding: utf-8 --
# ===========================================================================
# eXe
# Copyright 2013, Pedro Pe�a P�rez, Open Phoenix IT
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
from flask import Flask, render_template
import gettext

_ = gettext.gettext

log = logging.getLogger(__name__)


app = Flask(__name__)

@app.route('/iecmwarning')
def iecm_warning_page():
    return render_template('ie-cm-warning.html', 
                           title=_("eXe problem"),
                           msg1=_("The Compatibility View of your browser (Internet Explorer) is turned on."),
                           msg2=_("Please click on the Compatibility View button to turn it off:"),
                           msg3=_("Then restart eXe.."))
