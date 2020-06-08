#!/bin/bash

# ===========================================================================
# eXe
# Copyright 2012-2013, Pedro Peña Pérez, Open Phoenix IT
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
#
# Help
#-----
# Pybabel doc http://babel.pocoo.org/en/latest/cmdline.html
# Pybabel source https://github.com/python-babel/babel
# Transecma (py2json.py) https://github.com/nandoflorestan/bag/tree/master/bag/web
#
#
# Changes
# -------
# See the header of mki18n-extract.sh
#
#===========================================================================


export PYTHONPATH=.
tmp=$(mktemp -d)

# 1.- pyBabel - Compiling the MO files before re-adding HTML
echo -e " *** Compiling *.mo files before re-adding HTML ***\n"
pybabel compile -D exe -d exe/locale --statistics

# 2.- eXe - Update temp locale files with templates translations
echo -e "\n\n\n *** Adding template strings to generated *.po files ***\n"
cp -r exe/locale $tmp
# Not possible at the moment using Python 3
python exe/put_template_strings.py --standalone $tmp/locale

# pybabel bugs fixing
find exe -name exe.po | xargs sed -i 'N;N;/#~ msgid ""\n#~ msgstr ""/d' # Clean wrong commented msgids
find $tmp -name exe.po | xargs sed -i 'N;N;/#~ msgid ""\n#~ msgstr ""/d' # Clean wrong commented msgids
find exe -name exe.po | xargs sed -i '1!N;1!N;/#~ msgid ""\n#~ msgstr ""/d' # Clean wrong commented msgids
find $tmp -name exe.po | xargs sed -i '1!N;1!N;/#~ msgid ""\n#~ msgstr ""/d' # Clean wrong commented msgids

# 3.- pyBabel - Compiling the MO files
echo -e "\n\n\n *** Compiling *.mo files ***\n"
pybabel compile -D exe -d $tmp/locale --statistics
find exe/locale -name exe.mo -delete
cp -r $tmp/locale exe -n -v

# 4.- Transecma - Generating the translated JS files for the different languages
echo -e "\n\n\n *** Compiling javascript for jsui files ***\n"
python3 tools/po2json3.py --domain exe --directory exe/locale --output-dir exe/jsui/scripts/i18n

# Remove temp dir
rm -r $tmp
