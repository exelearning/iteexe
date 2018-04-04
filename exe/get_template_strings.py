#!/usr/bin/python
# ===========================================================================
# eXe
# Copyright 2018, CeDeC
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

import os
import sys

from datetime import datetime
from HTMLParser import HTMLParser

# Make it so we can import our own nevow and twisted etc.
if os.name == 'posix':
    sys.path.insert(0, '/usr/share/exe')

# Try to work even with no python path
try:
    from exe.application import Application
except ImportError, error:
    if str(error) == "No module named exe.application":
        exePath = os.path.abspath(sys.argv[0])
        exeDir = os.path.dirname(exePath)
        pythonPath = os.path.split(exeDir)[0]
        sys.path.insert(0, pythonPath)
        from exe.application import Application
    else:
        import traceback
        traceback.print_exc()
        sys.exit(1)

from exe.engine.path import Path
from exe.engine.package import Package
from exe.engine.template import Template

def normalize_text(text):
    """
    Normalizes the received text before writing it to the output file.

    :type text: string
    :param text: Text that will be normalized.

    :rtype: string
    :return: The normalized text.
    """
    return text.replace(u'\'', u'\\\'')

def get_node_strings(node):
    """
    Returns a list of dictionaries containing all the strings of the node (and its descendants).

    :type node: exe.engine.node.Node
    :param node: Node to get all strings.

    :rtype: list
    :return: A list of dictionaries with all the node and its descendants strings.
    """
    node_strings = {}

    # Node title
    node_strings['title'] = node.title
    node_strings['idevices'] = {}

    # For each Idevice
    for index, idevice in enumerate(node.idevices):
        # Get Idevice title
        node_strings['idevices']['idevice_' + str(index)] = {
            'title': idevice.title,
            'fields': {}
        }

        # For each field
        for field_index, field in enumerate(idevice.getRichTextFields()):
            # Get content (only content with resource paths)
            node_strings['idevices']['idevice_' + str(index)]['fields']['field_' + str(field_index)] = {
                # If the template was created on Windows, the new line separator
                # would be \r\n instead of \n (used by Babel on Ubuntu)
                'content_w_resourcePaths': "\n".join(field.content_w_resourcePaths.splitlines())
            }

    # Convert the strings object into a list
    strings = [node_strings]

    # Add this nodes decendants' strings
    for child in node.walkDescendants():
        strings.extend(get_node_strings(child))

    return strings

class FieldHtmlParser(HTMLParser):
    def __init__(self):
        # initialize the base class
        HTMLParser.__init__(self)

        self.reset()
        self.NEWTAGS = []
        self.NEWATTRS = []
        self.HTMLDATA = []
    def handle_starttag(self, tag, attrs):
        self.NEWTAGS.append(tag)
        self.NEWATTRS.append(attrs)
    def handle_data(self, data):
        self.HTMLDATA.append(data)

if __name__ == "__main__":
    # Load eXe configuration
    application = Application()
    application.processArgs()
    application.loadConfiguration()

    # We have to make sure eXe has english configured as its language to prevent it
    # from pre-translating the templates
    application.config.locale = 'en'
    application.config.loadLocales()

    # Open output file and write generation date
    file_w = open(application.config.templatesDir / u'strings.py', 'w');
    file_w.write(u'# Generated on %s\n' % str(datetime.now()))

    file_w.write(u'\ntemplates = {\n')
    file_r = open(application.config.templatesDir / '..' / 'aboutpage.py', 'r')
    # Go through all templates
    package_index = 0
    for file_name in [f for f in os.listdir(application.config.templatesDir) if os.path.splitext(f)[1] == '.elt']:
        print(u'extracting messages from %s' % (application.config.templatesDir / file_name))

        # Load the template
        template = Template(application.config.templatesDir / file_name)
        # Load the template as a package
        package = Package.load(application.config.templatesDir / file_name, newLoad=True);

        # Write template header and definition start
        file_w.write(u'\t# Template: %s\n\t\'template_%i\': {\n' % (file_name, package_index))

        # Template name
        file_w.write(u'\t\t\'template_name\': _(u\'%s\'),\n' % normalize_text(template.name))
        # Template author
        if template.author != u'':
            file_w.write(u'\t\t\'template_author\': _(u\'%s\'),\n' % normalize_text(template.author))

        # Level names
        if package.get_level1() != u'':
            file_w.write(u'\t\t\'level1\': _(u\'%s\'),\n' % normalize_text(package.get_level1()))
        if package.get_level2() != u'':
            file_w.write(u'\t\t\'level2\': _(u\'%s\'),\n' % normalize_text(package.get_level2()))
        if package.get_level3() != u'':
            file_w.write(u'\t\t\'level3\': _(u\'%s\'),\n' % normalize_text(package.get_level3()))

        # Title
        if package.title != u'':
            file_w.write(u'\t\t\'title\': _(u\'%s\'),\n' % normalize_text(package.title))

        # Description
        if package.description != u'':
            file_w.write(u'\t\t\'description\': _(u\'%s\'),\n' % normalize_text(package.description))

        # Objectives
        if package.objectives != u'':
            file_w.write(u'\t\t\'objectives\': _(u\'%s\'),\n' % normalize_text(package.objectives))

        # Preknowledge
        if package.preknowledge != u'':
            file_w.write(u'\t\t\'preknowledge\': _(u\'%s\'),\n' % normalize_text(package.preknowledge))

        if package.author != u'':
            file_w.write(u'\t\t\'author\': _(u\'%s\'),\n' % normalize_text(package.author))

        # Get node strings
        node_strings = get_node_strings(package.root)

        file_w.write(u'\t\t\'nodes\': [\n')
        for node in node_strings:
            file_w.write(u'\t\t\t{\n')
            file_w.write(u'\t\t\t\t\'title\': _(u\'%s\'),\n' % normalize_text(node['title']))

            file_w.write(u'\t\t\t\t\'idevices\': [\n')
            for idevice in node['idevices'].itervalues():
                file_w.write(u'\t\t\t\t\t{\n')
                file_w.write(u'\t\t\t\t\t\t\'title\': _(u\'%s\'),\n' % normalize_text(idevice['title']))

                file_w.write(u'\t\t\t\t\t\t\'fields\': [\n')

                for field in idevice['fields'].itervalues():
                    file_w.write(u'\t\t\t\t\t\t\t{\n')

                    file_w.write(u'\t\t\t\t\t\t\t\t\'raw_value\': u\'\'\'%s\'\'\',\n' % normalize_text(field['content_w_resourcePaths']))

                    parser = FieldHtmlParser()
                    parser.feed(field['content_w_resourcePaths'])
                    translatablehtml = parser.HTMLDATA
                    trabslatabletext = u''
                    template = field['content_w_resourcePaths'].replace(u'%', u'%%')
                    # Go through all the strings filtering out the ones that should not be translated
                    for translatablestring in [f for f in translatablehtml if f.strip() != u'' and f != u'.' and f != u'...']:
                        template = template.replace(translatablestring, '%s', 1)
                        trabslatabletext += u'\t\t\t\t\t\t\t\t\t_(u\'%s\'),\n' % normalize_text(translatablestring)

                    file_w.write(u'\t\t\t\t\t\t\t\t\'template\': u\'\'\'%s\'\'\',\n' % normalize_text(template))
                    file_w.write(u'\t\t\t\t\t\t\t\t\'translatable_text\': [\n')
                    file_w.write(trabslatabletext)
                    file_w.write(u'\t\t\t\t\t\t\t\t]\n')

                    file_w.write(u'\t\t\t\t\t\t\t},\n')

                file_w.write(u'\t\t\t\t\t\t]\n')

                file_w.write(u'\t\t\t\t\t},\n')

            file_w.write(u'\t\t\t\t]\n')
            file_w.write(u'\t\t\t},\n')

        file_w.write(u'\t\t]\n')

        # Close template definition
        file_w.write(u'\t},\n')

        package_index += 1

    file_w.write(u'}\n')

    file_w.close()
