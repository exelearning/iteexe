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

'''Envelop with eXe translation function ("_") all tinymce english lang strings
   Depends on demjson python module to parse json. "apt-get install python-demjson"
'''


from exe.engine.path import Path
import demjson

if __name__ == '__main__':
    basedir = Path() / 'exe' / 'webui' / 'scripts' / 'tinymce_3.5.11' / 'jscripts' / 'tiny_mce'
    for path in basedir.walk('en*.js'):
        pathdir = path.dirname()
        f = path.bytes()
        s = '{' + f.partition('{')[2]
        s = s.rpartition('}')[0] + '}'
        json = demjson.decode(s)
        replacements = []

        def update_string(string):
            global f, replacements
            if type(string) == dict:
                for v in string.values():
                    update_string(v)
            else:
                if string:
                    string = string.replace('\n', '\\n')
                    string = string.replace("\'", "\\'")
                    if string not in replacements:
                        replacements.append(string)
                        ocurrences1 = f.count('"%s"' % string)
                        ocurrences2 = f.count("'%s'" % string)
                        if ocurrences1 > 0:
                            strtpl = '"%s"'
                        elif ocurrences2 > 0:
                            strtpl = "'%s'"
                        else:
                            print "%s String not found: %s" % (path, string)
                            return
                        f = f.replace(strtpl % string, ('_(' + strtpl + ')') % string)
        update_string(json)
        path.write_bytes(f)
