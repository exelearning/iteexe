# ===========================================================================
# __init__.py
# Copyright 2011, Mikel Larreategi, CodeSyntax Tknika
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


import codecs
# UnicodeType and StringType are no longer available in Python 3.12
# Use str for both Unicode and string types
str = str

from bs4 import BeautifulSoup

CDATA_BEGIN = "<![CDATA["
CDATA_END = "]]>"

TRANS_UNIT = '''<trans-unit id="%(id)s">
       <source xml:lang="%(source_lang)s">%(cdata_begin)s%(content)s%(cdata_end)s</source>
       <target xml:lang="%(target_lang)s">%(cdata_begin)s%(target)s%(cdata_end)s</target>
</trans-unit>
'''

XLF_TEMPLATE = '''<?xml version="1.0" encoding="UTF-8"?>
<xliff version="1.2"
       xmlns="urn:oasis:names:tc:xliff:document:1.2">
  <file original="%(original)s"
        datatype="html"
        source-language="%(source_lang)s" target-language="%(target_lang)s">
    <body>
      %(transunits)s
    </body>
  </file>
</xliff>
'''

def safe_unicode(text):
    if type(text) is UnicodeType:
        return text
    elif type(text) is StringType:
        try:
            return str(text, 'utf-8')
        except:
            return str(text, 'iso-8859-15')
    else:
        try:
            return str(text)
        except:
            return 'ERROR'


class ContentEscaper(BeautifulSoup):
    def handle_data(self, data):
        # Repace special chars with their HTML codes
        # Note: The order is important, if this is updated, xliffimport.py should be aswell
        data_end = data.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;')
        #if hasattr(self, "currentData"):
        try:
            self.currentData.append(data_end)
        except:
            self.current_data.append(data_end)

def escape_content(content):
    html = ContentEscaper(content)      
    return html.__unicode__()

class XliffExport(object):
    """
    XliffExport will export a package as an XLIFF file
    """

    def __init__(self, config, filename, source_lang = "es", target_lang = "eu", source_copied_in_target = True, wrap_cdata = False):
        self.config = config
        self.filename = filename
        self.source_copied_in_target = source_copied_in_target
        self.source_lang = source_lang
        self.target_lang = target_lang
        self.wrap_cdata = wrap_cdata
        
    def export(self, package):
        content = self.getContentForNode(package.root, 'noderoot')
        data = XLF_TEMPLATE % {'transunits': content,
                               'source_lang': self.source_lang,
                               'target_lang': self.target_lang,
                               'original': package.filename
                               }
        outfile = codecs.open(self.filename, mode='w', encoding='utf-8')
        outfile.write(data)
        outfile.close()

    def getContentForNode(self, node, id):
        content = ''
        content += '<group>'
        content += TRANS_UNIT % {'content': safe_unicode(node.getTitle()),
                                 'id': '%s-nodename' % id,
                                 'target': self.source_copied_in_target and safe_unicode(node.getTitle()) or escape_content(''),
                                 'cdata_begin': escape_content(''),
                                 'cdata_end': escape_content(''),
                                 'source_lang': self.source_lang,
                                 'target_lang': self.target_lang
                                 }
        content += '</group>'

        for idevice in node.idevices:
            content += '<group>'
            
            content += TRANS_UNIT % {'content': safe_unicode(idevice.title),
                                     'id': '%s-idev%s-title' % (id, idevice.id),
                                     'target': self.source_copied_in_target and safe_unicode(idevice.title) or escape_content(''),
                                     'cdata_begin': escape_content(''),
                                     'cdata_end': escape_content(''),
                                     'source_lang': self.source_lang,
                                     'target_lang': self.target_lang
                                     }

            
            for field in idevice.getRichTextFields():
                content += TRANS_UNIT % {'content': safe_unicode(escape_content(field.content_w_resourcePaths)),
                                         'id': '%s-idev%s-field%s' % (id, idevice.id, field.id),
                                         'target': self.source_copied_in_target and safe_unicode(escape_content(field.content_w_resourcePaths)) or escape_content(''),
                                         'cdata_begin': self.wrap_cdata and CDATA_BEGIN or escape_content(''),
                                         'cdata_end': self.wrap_cdata and CDATA_END or escape_content(''),
                                         'source_lang': self.source_lang,
                                         'target_lang': self.target_lang
                                         }

            content += '</group>'

        for descendant in node.children:
            content += self.getContentForNode(descendant, id+'-node' + descendant.id)

        return content

