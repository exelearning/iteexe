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

import sys
sys.path.insert(0, '.')

from twisted.web.microdom import parseString
from twisted.web.domhelpers import findNodesNamed
from exe.engine.path import Path
import json
import re

if __name__ == '__main__':
    files = {'lomVocab': Path('exe') / 'webui' / 'schemas' / 'scorm2004' / 'common' / 'vocabValues.xsd',
             'lomesVocab': Path('exe') / 'webui' / 'schemas' / 'scorm2004' / 'vocab' / 'lomesvocab.xsd'}
    response = ''
    vocab = {}
    for varname, f in files.items():
        document = parseString(f.bytes(), escapeAttributes=0)
        nodes = findNodesNamed(document, 'xs:simpletype')
        for node in nodes:
            name = node.getAttribute('name', str())
            enumerations = findNodesNamed(node, 'xs:enumeration')
            vocab[name] = []
            for enumeration in enumerations:
                vocab[name].append([enumeration.getAttribute('value'), '_(%s)' % enumeration.getAttribute('value')])
        response += '%s = %s;\n\n' % (varname, json.dumps(vocab, indent=4).encode('utf-8'))
    outfile = Path('exe') / 'jsui' / 'scripts' / 'lomvocab.js'
    response = re.sub('"_\(', '_("', response)
    response = re.sub('\)"', '")', response)
    outfile.write_bytes(response)
