import sys
from xml.dom import pulldom
from twisted.python import usage
from twisted.application import app
import nevow

def process(filename):
    events = pulldom.parse(filename)

    for (event, node) in events:
        if event == pulldom.START_ELEMENT:
            get = getattr(node, 'getAttributeNS', None)
            if get is not None:
                value = get('http://nevow.com/ns/nevow/0.1', 'render')
                if value == 'i18n':
                    events.expandNode(node)

                    # TODO get line number out of pulldom
                    print('#: %s' % filename)
                    print('msgid ""')
                    for child in node.childNodes:
                        s = child.toxml('utf-8')
                        s = s.replace('\\', '\\\\')
                        s = s.replace('"', '\\"')
                        s = s.replace('\n', '\\n')
                        print('"%s"' % s)
                    print('msgstr ""')
                    print()

class GettextOptions(usage.Options):
    def opt_version(self):
        print('Nevow version:', nevow.__version__)
        usage.Options.opt_version(self)

    def parseArgs(self, *files):
        self['files'] = files

def runApp(config):
    print('''msgid ""
msgstr ""
"Content-Type: text/plain; charset=utf-8\\n"

''')
    for filename in config['files']:
        process(filename)

def run():
    from twisted.application import app
    app.run(runApp, GettextOptions)
