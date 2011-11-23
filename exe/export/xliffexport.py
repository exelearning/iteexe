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



from types import UnicodeType, StringType
import codecs


# Just in case: sometimes it's needed to
# escape the content of the source tag
# we can use CDATA sections for that:
# <![CDATA[ %(content)s ]]>

TRANS_UNIT = u'''<trans-unit id="%(id)s">
       <source xml:lang="es">
       %(content)s
       </source>
       <target>
       %(target)s
       </target>
</trans-unit>
'''

XLF_TEMPLATE = u'''<xliff version="1.2"
       xmlns="urn:oasis:names:tc:xliff:document:1.2">
  <file original="file.elp"
        datatype="html"
        source-language="es" target-language="en">
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
            return unicode(text, 'utf-8')
        except:
            return unicode(text, 'iso-8859-15')
    else:
        try:
            return unicode(text)
        except:
            return u'ERROR'


class XliffExport(object):
    """
    XliffExport will export a package as an XLIFF file
    """

    def __init__(self, config, filename, source_copied_in_target):
        self.config = config
        self.filename = filename
        self.source_copied_in_target = source_copied_in_target
        
    def export(self, package):
        content = self.getContentForNode(package.root, 'noderoot')
        data = XLF_TEMPLATE % {'transunits': content}
        outfile = codecs.open(self.filename, mode='w', encoding='utf-8')
        outfile.write(data)
        outfile.close()

    def getContentForNode(self, node, id):
        content = u''
        content += '<group>'
        content += TRANS_UNIT % {'content': safe_unicode(node.getTitle()),
                                 'id': '%s-nodename' % id,
                                 'target': self.source_copied_in_target and safe_unicode(node.getTitle()) or u'',
                                 }
        content += '</group>'

        for idevice in node.idevices:
            content += '<group>'
            
            content += TRANS_UNIT % {'content': safe_unicode(idevice.title),
                                     'id': '%s-idev%s-title' % (id, idevice.id),
                                     'target': self.source_copied_in_target and safe_unicode(idevice.title) or u'',
                                     }

            
            for field in idevice.getRichTextFields():
                content += TRANS_UNIT % {'content': safe_unicode(field.content),
                                         'id': '%s-idev%s-field%s' % (id, idevice.id, field.id),
                                         'target': self.source_copied_in_target and safe_unicode(field.content) or u'',
                                         }

            content += '</group>'

        for descendant in node.children:
            content += self.getContentForNode(descendant, id+'-node' + descendant.id)

        return content

