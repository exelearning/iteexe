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
# Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
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
# 	* Usage of Babel1.3 (Pedro Peña)
# 		Uses python Babel 1.3 patched to include 'Language' header 
#		(https://dl.dropboxusercontent.com/s/k1i7ph2m2g4s7kx/Babel-1.3.tar.gz)
# 		as discussed here: 
# 		https://forja.cenatic.es/tracker/index.php?func=detail&aid=1905&group_id=197&atid=883
#
#	* Changed --version from '1.04.1' to '2.0' (JRF)
#
# 2014-03-17:
#	* Changed options of pybabel update (JRF)
#
#===========================================================================


export PYTHONPATH=.
project="eXeLearning"
version="2.0"
# 1.- Extraction of strings from *.py and *.js into new POT
echo -e " *** Extracting messages from python exe files, jsui javascript and html template files ***\n"
pybabel extract --keyword=x_ --project "$project" --version "$version" -F pybabel.conf --sort-by-file . > exe/locale/messages.pot
#tools/nevow-xmlgettext exe/jsui/templates/mainpage.html exe/webui/templates/about.html | msgcat exe/locale/messages.pot.tmp - -o exe/locale/messages.pot
#rm exe/locale/messages.pot.tmp
# Removal of fuzzy comments from the POT file
sed -i "s/^#, fuzzy\$//" exe/locale/messages.pot
#
# 2.- Updating the PO files of the different languages
echo -e "\n\n\n *** Updating *.po files ***\n"
# Option -N, --no-fuzzy-matching: do not use fuzzy matching (default False)
# JRF, 2014-03-17 - trying to fix the duplicate msgstr problem
#    comment the -N option out
#    add --ignore-obsolete
# pybabel update -D exe -i exe/locale/messages.pot -d exe/locale/ -N
pybabel update -D exe -i exe/locale/messages.pot -d exe/locale/ --ignore-obsolete
# Set correct Project-Id-Version
find exe -name exe.po | xargs sed -i 's/Project-Id-Version:.*/Project-Id-Version: '"$project $version"'\\n"/' 
#
# 3.- Compiling the MO files
echo -e "\n\n\n *** Compiling *.mo files ***\n"
# JRF, 2014-03-17: notice that we don't use option -f (also include fuzzy translations)
pybabel compile -D exe -d exe/locale/ --statistics
# pybabel bugs fixing
find exe -name exe.po | xargs sed -i 'N;N;/#~ msgid ""\n#~ msgstr ""/d' # Clean wrong commented msgids
find exe -name exe.po | xargs sed -i '1!N;1!N;/#~ msgid ""\n#~ msgstr ""/d' # Clean wrong commented msgids
#
# 4.- Generating the translated JS files for the different languages
echo -e "\n\n\n *** Compiling javascript for jsui files ***\n"
python tools/po2json.py --domain exe --directory exe/locale --output-dir exe/jsui/scripts/i18n
