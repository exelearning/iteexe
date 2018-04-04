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

from babel._compat import StringIO
from babel.messages.pofile import read_po, write_po
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

if __name__ == "__main__":
    # Load eXe configuration
    application = Application()
    application.processArgs()
    application.loadConfiguration()
    application.config.loadLocales()

    # The locale path must always be the last parameter
    locale_path = Path(sys.argv[-1])

    try:
        # Try to get templates' strings
        execfile(application.config.templatesDir / 'strings.py')

        print(u'Re-adding HTML to template translations')

        # Load all locale catalogs
        locale_catalogs = {}
        for name, locale in application.config.locales.iteritems():
            current_locale = {}
            current_locale['locale'] = locale

            locale_catalogs[name] = current_locale

        for sub_dir in locale_path.dirs():
            if (sub_dir / 'LC_MESSAGES' / 'exe.po').exists():
                catalog_stream = open(sub_dir / 'LC_MESSAGES' / 'exe.po', 'r')
                catalog_string = catalog_stream.read()
                catalog_stream.close()

                if os.path.basename(sub_dir) in locale_catalogs:
                    locale_catalogs[os.path.basename(sub_dir)]['catalog'] = read_po(StringIO(catalog_string))
                    locale_catalogs[os.path.basename(sub_dir)]['path'] = sub_dir / 'LC_MESSAGES' / 'exe.po'

        for path, template in templates.iteritems():
            for node in template['nodes']:
                for idevice in node['idevices']:
                    for field in idevice['fields']:
                        for name, locale in locale_catalogs.iteritems():
                            if 'catalog' not in locale:
                                continue

                            translated_text = []

                            for text in field['translatable_text']:
                                translated_text.append(locale['locale'].ugettext(text))

                            translated_string = field['template'] % tuple(translated_text)

                            locale['catalog'].add(field['raw_value'], translated_string)

        # Write every catalog with the new values
        for name, locale in locale_catalogs.iteritems():
            if 'catalog' not in locale:
                continue

            buf = StringIO()
            write_po(buf, locale['catalog'])

            po_stream = open(locale['path'], 'w')
            #po_stream.write(buf.getvalue().decode('utf-8'))
            po_stream.write(buf.getvalue())
            po_stream.close()

    # If the file doesn't exist just do nothing
    except IOError as e:
        print(u'Template strings file does not exist, no action is necessary.')
