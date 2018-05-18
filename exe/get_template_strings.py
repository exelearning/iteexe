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
import re
import sys

from datetime   import datetime
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

from exe.engine.package  import Package
from exe.engine.path     import Path
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

    # Add this node decendants' strings
    for child in node.walkDescendants():
        strings.extend(get_node_strings(child))

    return strings

class FieldHtmlParser(HTMLParser):
    """
    This class will be used to extract the string from the HTML.

    :see: HTMLParser
    """
    def __init__(self):
        """
        Object initialization.
        """
        # initialize the base class
        HTMLParser.__init__(self)

        # Reset the properties
        self.reset()

        # Declare our own properties
        self.HTMLDATA = []
    def handle_data(self, data):
        """
        This function will be called when the parser finds a
        fragment of translatable text.

        :type data: str
        :param data: The translatable test found.
        """
        # Add the translatable text, its line number and the offset
        # to the data list
        datadict = {
            'data': data,
            'line': self.lineno,
            'offset': self.offset,
            'type': 'data'
        }

        self.HTMLDATA.append(datadict)

    def handle_starttag(self, tag, attrs):
        """
        This function will be called when the parser finds a
        fragment of translatable text.

        :type tag: str
        :param tag: Name of the found tag.
        :type attrs: list
        :param attrs: Attributes declared for the tag.
        """
        # Convert the attributes list to a dictionary to make it more easily searchable
        attrs_dict = dict(attrs)

        # This list contains every property of any tag that can be translated
        translatable_attributes = [
            # Input form elements' value
            u'value',
            # Alternative text for images
            u'alt',
            # Title for links
            u'title'
        ]

        for attr_name in translatable_attributes:
            if attr_name in attrs_dict:
                # Add the translatable text, its line number and the offset
                # to the data list
                datadict = {
                    'data': attrs_dict[attr_name],
                    'fulldata': self._HTMLParser__starttag_text,
                    'line': self.lineno,
                    'offset': self.offset,
                    'tag': tag,
                    'attr': attr_name,
                    'type': 'tag'
                }

                self.HTMLDATA.append(datadict);

if __name__ == "__main__":
    # Load eXe configuration
    application = Application()
    application.processArgs()
    application.loadConfiguration()

    # We have to make sure eXe has english configured as its language to prevent it
    # from pre-translating the templates
    application.config.locale = 'en'
    application.config.loadLocales()

    # List of strings that shouldn't make it to the .po files
    excluded_strings = [
        u'',
        u'.',
        u'...',
        u'\n'
    ]

    # Open output file and write generation date
    file_w = open(application.config.templatesDir / u'strings.py', 'w');
    file_w.write(u'# Generated on %s\n' % str(datetime.now()))

    file_w.write(u'\ntemplates = {\n')

    # Go through all templates (only take into account .elt files)
    package_index = 0
    for file_name in [f for f in os.listdir(application.config.templatesDir) if os.path.splitext(f)[1] == '.elt']:
        print(u'Extracting messages from %s...' % (application.config.templatesDir / file_name))

        # Load the template as a package
        template = Template(application.config.templatesDir / file_name)
        package = Package.load(application.config.templatesDir / file_name, newLoad=True);

        # Write template header comment and definition start
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

        # Go through all nodes
        file_w.write(u'\t\t\'nodes\': [\n')
        for node in node_strings:
            # Node title
            file_w.write(u'\t\t\t{\n')
            file_w.write(u'\t\t\t\t\'title\': _(u\'%s\'),\n' % normalize_text(node['title']))

            # Node idevices
            file_w.write(u'\t\t\t\t\'idevices\': [\n')
            for idevice in node['idevices'].itervalues():
                # Idevice title
                file_w.write(u'\t\t\t\t\t{\n')
                file_w.write(u'\t\t\t\t\t\t\'title\': _(u\'%s\'),\n' % normalize_text(idevice['title']))

                # Idevice fields
                file_w.write(u'\t\t\t\t\t\t\'fields\': [\n')
                for field in idevice['fields'].itervalues():
                    file_w.write(u'\t\t\t\t\t\t\t{\n')

                    # Write the raw value (just as a reference)
                    file_w.write(u'\t\t\t\t\t\t\t\t\'raw_value\': u\'\'\'%s\'\'\',\n' % normalize_text(field['content_w_resourcePaths']))

                    # Parse the HTML inside the field
                    parser = FieldHtmlParser()
                    parser.feed(field['content_w_resourcePaths'])

                    # Get the HTML translatable text
                    translatablehtml = parser.HTMLDATA
                    translatabletext = u''

                    # Get the template (we need to replace % ocurrences to prevent Python from replacing them
                    # when we get the HTML back in the translations)
                    template = field['content_w_resourcePaths'].replace(u'%', u'%%')

                    # Init the dict that will hold the diferrences in the offset for each line
                    offset_diff = {}

                    # Go through all the strings filtering out the ones that should not be translated
                    for translatablestring in [f for f in translatablehtml if f['data'].strip() not in excluded_strings]:
                        # Get the offset
                        offset = translatablestring['offset']

                        if translatablestring['type'] == 'tag':
                            offset += re.search(r"\b" + translatablestring['attr'] + "=", translatablestring['fulldata']).start()
                            offset += len(translatablestring['attr']) + 2

                        # For any line different from the first one, we have to take into account
                        # the length of all the other lines that came before (including the line breaks)
                        if translatablestring['line'] > 1:
                            lines = template.split(u'\n')

                            for i in range(0, translatablestring['line'] - 1):
                                offset += len(lines[i])

                            # This will add the line breaks (split removes them)
                            offset += translatablestring['line'] - 1

                        # We also have to take into account that if we already replaced some text
                        # in this line this text won't be at the correct offset
                        if translatablestring['line'] in offset_diff:
                            offset -= offset_diff[translatablestring['line']]
                        else:
                            offset_diff[translatablestring['line']] = 0

                        # Save the offset difference adding the length of the text replaces minus 2 (%s)
                        offset_diff[translatablestring['line']] += len(translatablestring['data']) - 2

                        # Replace the text in the template with %s
                        template = template[:offset] + u'%s' + template[offset + len(translatablestring['data']):]
                        # And add the text to the list
                        translatabletext += u'\t\t\t\t\t\t\t\t\t_(u\'%s\'),\n' % normalize_text(translatablestring['data'])

                    # Write the template to the strings file
                    file_w.write(u'\t\t\t\t\t\t\t\t\'template\': u\'\'\'%s\'\'\',\n' % normalize_text(template))

                    # And also the translatable strings found in it
                    file_w.write(u'\t\t\t\t\t\t\t\t\'translatable_text\': [\n')
                    file_w.write(translatabletext)
                    file_w.write(u'\t\t\t\t\t\t\t\t]\n')

                    # Close field definition
                    file_w.write(u'\t\t\t\t\t\t\t},\n')

                # Close field list
                file_w.write(u'\t\t\t\t\t\t]\n')

                # Close idevice definition
                file_w.write(u'\t\t\t\t\t},\n')

            # Close idevice list
            file_w.write(u'\t\t\t\t]\n')
            # Close node definition
            file_w.write(u'\t\t\t},\n')

        # Close node list
        file_w.write(u'\t\t]\n')

        # Close template definition
        file_w.write(u'\t},\n')

        # Remove the package so the temp folder doesn't stay
        del package
        package_index += 1
    # Close file definition
    file_w.write(u'}\n')

    # Close the file
    file_w.close()
