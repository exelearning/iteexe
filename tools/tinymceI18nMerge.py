# -- coding: utf-8 --
# ===========================================================================
# eXe
# Copyright 2013, Pedro Peña Pérez, Open Phoenix IT
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

''' Add to corresponding po file the tinymce lang strings
    Depends on demjson python module to parse json and polib. "apt-get install python-demjson python-polib"
'''
from exe.engine.path import Path
import demjson
import polib

if __name__ == '__main__':
    basedir = Path() / 'exe' / 'webui' / 'scripts' / 'tinymce_3.5.7' / 'jscripts' / 'tiny_mce'
    pos = {}
    for path in basedir.walk('en*.js'):
        pathdir = path.dirname()
        f = path.bytes()
        s = '{' + f.partition('{')[2]
        s = s.rpartition('}')[0] + '}'
        srcjson = demjson.decode(s)
        for pathfile in pathdir.files():
            if pathfile.basename() not in ['en.js', 'en_dlg.js'] and len(pathfile.basename()) == len(path.basename()):
                fl = pathfile.bytes()
                sl = '{' + fl.partition('{')[2]
                sl = sl.rpartition('}')[0] + '}'
                langjson = demjson.decode(sl)

                def append_string(string, key, json, srcstring):
                    if type(string) == dict:
                        for k, v in string.items():
                            try:
                                append_string(v, k, string, srcstring[k])
                            except:
                                if 'en' in srcstring:
                                    append_string(v, k, string, srcstring['en'])
                                else:
                                    print "Error: string %s not in %s" % (k, path)
                    else:
                        if string:
                            lang = pathfile.basename()[0:2]
                            if lang not in pos:
                                po = Path() / 'exe' / 'locale' / lang / 'LC_MESSAGES' / 'exe.po'
                                pos[lang] = (polib.pofile(po), po)
                            entry = polib.POEntry(
                                msgid=srcstring,
                                msgstr=string
                            )
                            pos[lang][0].append(entry)
                append_string(langjson, None, None, srcjson)
    for po, pofile in pos.values():
        po.save(pofile)
