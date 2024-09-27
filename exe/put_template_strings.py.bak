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

from babel._compat         import StringIO
from babel.messages.pofile import read_po, write_po
# Make it so we can import our own nevow and twisted etc.
if os.name == 'posix':
    sys.path.insert(0, '/usr/share/exe')

# Try to work even with no python path
try:
    from exe.application import Application
except ImportError as error:
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

if __name__ == "__main__":
    # Load eXe configuration
    application = Application()
    application.processArgs()
    application.loadConfiguration()

    # We have to make sure eXe has english configured as its language to prevent it
    # from pre-translating the templates
    application.config.locale = 'en'
    application.config.loadLocales()

    # The locale path must always be the last parameter
    locale_path = Path(sys.argv[-1])

    try:
        # Try to get templates' strings
        exec(compile(open(application.config.templatesDir / 'strings.py', "rb").read(), application.config.templatesDir / 'strings.py', 'exec'))

        print('Re-adding HTML to template translations')

        # Load all locale catalogs
        locale_catalogs = {}
        for name, locale in application.config.locales.items():
            current_locale = {}
            current_locale['locale'] = locale

            locale_catalogs[name] = current_locale

        # Load the catalogs from the temp directory
        for sub_dir in locale_path.dirs():
            if (sub_dir / 'LC_MESSAGES' / 'exe.po').exists() and os.path.basename(sub_dir) in locale_catalogs:
                catalog_stream = open(sub_dir / 'LC_MESSAGES' / 'exe.po', 'r')
                catalog_string = catalog_stream.read()
                catalog_stream.close()

                locale_catalogs[os.path.basename(sub_dir)]['catalog'] = read_po(StringIO(catalog_string))
                locale_catalogs[os.path.basename(sub_dir)]['path'] = sub_dir / 'LC_MESSAGES' / 'exe.po'

        # Go through all the templates, nodes, idevices and fields
        for path, template in templates.items():
            for node in template['nodes']:
                for idevice in node['idevices']:
                    for field in idevice['fields']:
                        # For each locale
                        for name, locale in locale_catalogs.items():
                            # If there is no catalog, just go to the next locale
                            if 'catalog' not in locale:
                                continue

                            # Get the translated test and insert it into the template
                            translated_text = []
                            for prop in field:
                                for text in prop['translatable_text']:
                                    translated_text.append(locale['locale'].ugettext(text))
                                translated_string = prop['template'] % tuple(translated_text)

                                # Add the new translation to the catalog
                                locale['catalog'].add(prop['raw_value'], translated_string)

        # Write every catalog with the new values
        for name, locale in locale_catalogs.items():
            # Again, if there is not catalog, simply go to the next one
            if 'catalog' not in locale:
                continue

            # Write the catalog to a string
            buf = StringIO()
            write_po(buf, locale['catalog'])

            # And the string to the file
            po_stream = open(locale['path'], 'w')
            po_stream.write(buf.getvalue())
            po_stream.close()

    # If the file doesn't exist just do nothing
    except IOError as e:
        print('Template strings file does not exist, no action is necessary.')
