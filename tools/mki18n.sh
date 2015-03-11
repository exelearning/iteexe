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
# Pybabel doc http://babel.pocoo.org/docs/cmdline/
# Pybabel source https://github.com/mitsuhiko/babel
# Transecma (py2json.py) https://github.com/nandoflorestan/bag/tree/master/bag/web
#
#
# Changes
# -------
# 2013-10:
#     * Usage of Babel1.3 (Pedro Peña)
#         Uses python Babel 1.3 patched to include 'Language' header 
#        (https://dl.dropboxusercontent.com/s/k1i7ph2m2g4s7kx/Babel-1.3.tar.gz)
#        as discussed here:
#        https://forja.cenatic.es/tracker/index.php?func=detail&aid=1905&group_id=197&atid=883
#
#    * Changed --version from '1.04.1' to '2.0' (JRF)
#
# 2014-03-17:
#    * Changed options of pybabel update (JRF)
#         trying to fix the duplicate msgstr problem
#         comment the -N option out
#         Option -N, --no-fuzzy-matching: "do not use fuzzy matching" (default False)
#         add --ignore-obsolete
#    * Pybabel compile (JRF)
#         documented that we've never used option -f ("also include fuzzy translations") ¿?
#
# 2015-02-26:
#    * Version 2.0.2 (JRF)
#
# 2015-03-01:
#    * Update the po2json/transecma file, to the git version at 
#      https://github.com/nandoflorestan/bag/tree/master/bag/web
#
# 2015-03-10:
#    * Version 2.0.4 (JRF)
#    * (Only) MO files should go to /usr/share/locale - how?
#
#===========================================================================


export PYTHONPATH=.
project="eXeLearning"
version="2.0.4"

# 1.- Babel - Extraction of strings from *.py and *.js into new POT
echo -e " *** Extracting messages from python exe files, jsui javascript and html template files ***\n"
pybabel extract --keyword=x_ --keyword=c_ --project "$project" --version "$version" -F pybabel.conf --sort-by-file . > exe/locale/messages.pot
# tools/nevow-xmlgettext exe/jsui/templates/mainpage.html exe/webui/templates/about.html | msgcat exe/locale/messages.pot.tmp - -o exe/locale/messages.pot
# rm exe/locale/messages.pot.tmp
# Removal of fuzzy comments from the POT file
sed -i "s/^#, fuzzy\$//" exe/locale/messages.pot

# 2.- Babel - Updating the PO files of the different languages
echo -e "\n\n\n *** Updating *.po files ***\n"
pybabel update -D exe -i exe/locale/messages.pot -d exe/locale/ --ignore-obsolete
# Set correct Project-Id-Version
find exe -name exe.po | xargs sed -i 's/Project-Id-Version:.*/Project-Id-Version: '"$project $version"'\\n"/' 

# 3.- Babel - Compiling the MO files
echo -e "\n\n\n *** Compiling *.mo files ***\n"
pybabel compile -D exe -d exe/locale/ --statistics
# JRF, 2015-03-11 - Separation of PO and MO files
# pybabel compile -D exe -d exe/locale/ -o locale/ --statistics
# pybabel bugs fixing
find exe -name exe.po | xargs sed -i 'N;N;/#~ msgid ""\n#~ msgstr ""/d' # Clean wrong commented msgids
find exe -name exe.po | xargs sed -i '1!N;1!N;/#~ msgid ""\n#~ msgstr ""/d' # Clean wrong commented msgids

# 4.- Transecma - Generating the translated JS files for the different languages
echo -e "\n\n\n *** Compiling javascript for jsui files ***\n"
# python tools/po2json.py --domain exe --directory exe/locale --output-dir exe/jsui/scripts/i18n
# JRF, 2015-03-11 - new MO files directory
python tools/transecma.py --domain exe --directory exe/locale --output-dir exe/jsui/scripts/i18n
# python tools/transecma.py --domain exe --directory locale --output-dir exe/jsui/scripts/i18n

