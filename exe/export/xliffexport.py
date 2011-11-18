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
       <target></target>
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

    def __init__(self, config, filename):
        self.config = config
        self.filename = filename
        
    def export(self, package):
        content = self.getContentForNode(package.root, 'noderoot')
        data = XLF_TEMPLATE % {'transunits': content}
        outfile = codecs.open(self.filename, mode='w', encoding='utf-8')
        outfile.write(data)
        outfile.close()

    def getContentForNode(self, node, id):
        content = u''
        for idevice in node.idevices:
            content += '<group>'
            
            content += TRANS_UNIT % {'content': safe_unicode(idevice.title),
                                     'id': '%s-idev%s-title' % (id, idevice.id),
                                     }

            
            for field in idevice.getRichTextFields():
                content += TRANS_UNIT % {'content': safe_unicode(field.content),
                                         'id': '%s-idev%s-field%s' % (id, idevice.id, field.id),
                                         }

            content += '</group>'

        for descendant in node.children:
            content += self.getContentForNode(descendant, id+'-node' + descendant.id)

        return content

