#!/usr/bin/env python3

"""Transecma is a Python solution for javascript internationalization.
It was written in 2012 by Nando Florestan.
Babel already has a javascript extractor (a function that goes through
javascript code finding translation strings and writing them to a
.POT translation template file).
In this module there is a jquery template extractor, so if you use jquery
templates, they can be internationalized using traditional gettext tools.
The .pot file can be converted to .po files using Babel or GNU gettext.
Each of these .po files is to contain a translation to one language.
These .po files are edited by translators in special utilities such as
*poedit* or *gtranslator*.
This module also contains po2json, a command that converts .po
translation files into javascript files, so the translation may finally
happen on the client, in a browser, through javascript code.
The final part of the solution is transecma.js, a javascript file that
contains functions to perform translations based on the
translation dictionary discussed above, as well as interpolate them
with values from your application.
So how do I set this up?
========================
In your javascript files and jquery template files, mark some strings for
internationalization::
    alert(_("This is supposed to be translated."));
    // You may use tr() and gettext() in addition to _().
Install bag and Babel::
    easy_install -UZ bag Babel
In the locale/ directory of your web application, add a "js_mapping.conf"
file with contents like these::
    [javascript: **.js]
    [jquery_templates: **.tmpl.html]
The above tells Babel what extractor to use for what file extensions.
Now we start using pybabel according to
http://babel.edgewall.org/wiki/Documentation/0.9/cmdline.html
Refer to the above documentation in order to understand the following
commands.
First use ``pybabel extract`` to generate a js.pot translation template file::
    pybabel extract -k tr --omit-header --sort-by-file
    -F app/locale/js_mapping.conf -o app/locale/js.pot app/static/js/
(If you are using Pyramid, this is similar to ``setup.py extract_messages``,
however it focuses on javascript and creates a separate .pot file.)
Now and then you may create a new translation. Example for Portuguese::
    pybabel init -l pt -D js -i app/locale/js.pot -d app/locale/
You will frequently use ``pybabel update`` to refresh the translations
based on new .pot contents::
    pybabel update -D js -i app/locale/js.pot -d app/locale/
(This is similar to ``setup.py update_catalog``.)
Now you can use tools such as gtranslator or poedit to fill in the .po
translation files::
    gtranslator app/locale/pt/LC_MESSAGES/js.po
Finally use the ``po2json`` command (available if you installed
the *bag* package) to "compile" translations into .js files::
    po2json -i -d app/locale -o app/static/js/i18n/
(This is similar to ``setup.py compile_catalog``.)
Transecma does *not* help you with the problem of adding to your pages
a <script> tag that loads the javascript file that contains the translations
that correspond to your user's locale. This problem depends on which
web framework you are using, but it should be very easy to solve.
Here is an example using Pyramid and Genshi:
.. code-block:: html
      <script py:if="not locale_code.startswith('en')" type='text/javascript'
        src="${static_path('static/js/i18n/{0}.js'.format(locale_code))}"
        ></script>
      <script py:if="locale_code.startswith('en')" type='text/javascript'
        src="${static_path('static/js/i18n/transecma.js')}"></script>
In the above example, we assume the default language of the application
is English. So, for languages other than English, we load the
corresponding translations file (which may include the transecma library).
For English, we only load the library itself, otherwise we would miss
its functions, especially interpol().
"""


import os
import re


here = os.path.abspath(os.path.dirname(__file__))


def exists(path):
    """Test whether a path exists. Returns False for broken symbolic links."""
    try:
        os.stat(path)
    except os.error:
        return False
    return True


def extract_jquery_templates(fileobj, keywords, comment_tags, options):
    """Extract translation messages from query template files.
    This is a plugin to Babel, written according to
     http://babel.edgewall.org/wiki/Documentation/0.9/messages.html#writing-extraction-methods
    :param fileobj: the file-like object the messages should be extracted
                    from
    :param keywords: a list of keywords (i.e. function names) that should
                     be recognized as translation functions
    :param comment_tags: a list of translator tags to search for and
                         include in the results
    :param options: a dictionary of additional options (optional)
    :return: an iterator over ``(lineno, funcname, message, comments)``
             tuples
    :rtype: ``iterator``
    """
    # print('Keywords: {0}. Options: {1}'.format(keywords, options))
    encoding = options.get('encoding', 'utf-8')
    comments = []
    funcname = None

    def new_regex(keyword, quote):
        # TODO: Allow plural messages, too
        return re.compile(
            keyword +
            "\(" +     # open parentheses to call function
            quote +    # string start
            # TODO: Allow an escaped quote:
            "([^" + quote + "]+)" +  # capture: anything but a quote
            quote +    # string end
            "\)"       # close parentheses (function call)
        )
    rx = []
    for keyword in keywords:
        rx.append(new_regex(keyword, '"'))
        rx.append(new_regex(keyword, "'"))
    # We have compiled our regular expressions, so now use them on the file
    for lineno, line in enumerate(fileobj, 1):
        line = line.decode(encoding)
        for r in rx:
            for match in r.finditer(line):
                yield (lineno, funcname, match.group(1), comments)


def po2dict(stream, locale, use_fuzzy=False):
    """Given a *stream* (a file-like object) and a locale, returns a
    dictionary of the message IDs and translation strings.
    """
    from babel.messages.pofile import read_po
    catalog = read_po(stream, locale)
    messages = [m for m in catalog if m.string]
    if not use_fuzzy:
        messages[1:] = [m for m in messages[1:] if not m.fuzzy]
    messages.sort()
    return {message.id: message.string for message in messages}


def make_json(structure, variable_name=None, indent=1, **k):
    """Converts something into a json string, optionally attributing the result
    to a variable.
    It also escapes the forward slash, making the result suitable
    to be included in an HTML <script> tag.
    """
    import json
    s = json.dumps(structure, indent=indent, **k).replace('/', '\/')
    return "{0} = {1};\n".format(variable_name, s) if variable_name \
        else s


def po2json(po_path, locale, variable_name=None, use_fuzzy=None):
    """Compiles one .po file into JSON and returns the resulting string."""
    with open(po_path) as file:
        d = po2dict(file, locale, use_fuzzy=use_fuzzy)
    return make_json(d, variable_name=variable_name)


def compile_dir(dir, domain, out_dir, variable_name=None, use_fuzzy=None,
                encoding='utf8', include_lib=False):
    """Given a *dir*, goes through all locale subdirectories in it,
    reads the .po translation files pertaining to *domain*, and then converts
    the translations to javascript files, which are written out to the
    directory *out_dir* and assigned to a *variable_name*.
    If *include_lib* is True, the contents of transecma.js are appended to
    the end of each of the output files.
    """
    import codecs
    if include_lib:
        with codecs.open(os.path.join(here, 'transecma.js'),
                         encoding='utf8') as f:
            lib = f.read()
    else:
        lib = ''
    jobs = []
    if not exists(out_dir):
        os.makedirs(out_dir)
    for locale in os.listdir(dir):
        po_path = os.path.join(dir, locale, 'LC_MESSAGES', domain + '.po')
        if os.path.exists(po_path):
            out_path = os.path.join(out_dir, locale + '.js')
            jobs.append((locale, po_path, out_path))
    for locale, po_path, out_path in jobs:
        print(('    Creating {0}'.format(out_path)))
        s = po2json(
            po_path, locale, variable_name=variable_name, use_fuzzy=use_fuzzy)
        with codecs.open(out_path, 'w', encoding=encoding) as writer:
            writer.write(s)
            if include_lib:
                writer.write('\n')
                writer.write(lib)


def po2json_command():
    """This function is an entry point; it is turned into a console script
    when the package is installed.
    po2json is a command that converts .PO translation files into javascript
    JSON files. This is a step in web application internationalization.
    Example usage::
        po2json -i -d $OUTDIR -o $JS_DIR
    For help with the arguments, type::
        po2json -h
    """
    from argparse import ArgumentParser
    p = ArgumentParser(
        description='Converts .po files into .js files '
        'for web application internationalization.')
    p.add_argument('--domain', '-D', dest='domain', default='js',
                   help="domain of PO files (default '%(default)s')")
    p.add_argument('--directory', '-d', dest='dir',
                   metavar='DIR', help='base directory of catalog files')
    p.add_argument('--output-dir', '-o', dest='out_dir', metavar='DIR',
                   help="name of the output directory for .js files")
    p.add_argument(
        '--use-fuzzy', '-f', dest='use_fuzzy', action='store_true',
        default=False,
        help='also include fuzzy translations (default %(default)s)')
    p.add_argument('--variable', '-n', dest='variable_name',
                   default='translations',
                   help="javascript variable name for the translations object")
    p.add_argument(
        '--include-lib', '-i', dest='include_lib', default=False,
        action='store_true', help='include transecma.js in the output')
    d = p.parse_args()
    if not d.dir:
        p.print_usage()
        return
    compile_dir(d.dir, d.domain, d.out_dir, variable_name=d.variable_name,
                use_fuzzy=d.use_fuzzy, include_lib=d.include_lib)


if __name__ == '__main__':
    po2json_command()