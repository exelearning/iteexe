#!/bin/bash

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
#===========================================================================

#Tested with Pybabel 0.9.6

echo -e " *** Extracting messages from python exe files and jsui javascript files ***\n"
pybabel extract --keyword=x_ --project "eXe Learning" --version "1.04.1" -F pybabel.conf --sort-by-file . > exe/locale/messages.pot
echo -e "\n\n\n *** Updating *.po files ***\n"
pybabel update -D exe -i exe/locale/messages.pot -d exe/locale/ -N
echo -e "\n\n\n *** Compiling *.mo files ***\n"
pybabel compile -D exe -d exe/locale/ --statistics
echo -e "\n\n\n *** Compiling javascript for jsui files ***\n"
python tools/po2json.py --domain exe --directory exe/locale --output-dir exe/jsui/scripts/i18n
