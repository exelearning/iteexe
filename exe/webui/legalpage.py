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
from flask import Blueprint, render_template

log = logging.getLogger(__name__)


# ===========================================================================
legal_page = Blueprint('legal_page', __name__)

@legal_page.route('/legal')
def legal():
    """Show legal information: copyright, licenses, etc."""
    return render_template('legal.html')

# ===========================================================================
