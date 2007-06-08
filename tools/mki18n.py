#!/usr/bin/python
# -*- coding: utf-8 -*-
# 
#   PYTHON MODULE:     MKI18N.PY
#                      =========
# 
#   Abstract:         Make Internationalization (i18n) files for an application.
# 
#   Copyright Pierre Rouleau. 2003. Released to public domain.
# 
#   Last update: Saturday, November 8, 2003. @ 15:55:18.
# 
#   File: ROUP2003N01::C:/dev/python/mki18n.py
# 
#   RCS $Header: //software/official/MKS/MKS_SI/TV_NT/dev/Python/rcs/mki18n.py 1.5 2003/11/05 19:40:04 PRouleau Exp $
# 
#   Update history:
# 
#   - File created: Saturday, June 7, 2003. by Pierre Rouleau
#   - 10/06/03 rcs : RCS Revision 1.1  2003/06/10 10:06:12  PRouleau
#   - 10/06/03 rcs : RCS Initial revision
#   - 23/08/03 rcs : RCS Revision 1.2  2003/06/10 10:54:27  PRouleau
#   - 23/08/03 P.R.: [code:fix] : The strings encoded in this file are encode in iso-8859-1 format.  Added the encoding
#                    notification to Python to comply with Python's 2.3 PEP 263.
#   - 23/08/03 P.R.: [feature:new] : Added the '-e' switch which is used to force the creation of the empty English .mo file.
#   - 22/10/03 P.R.: [code] : incorporated utility functions in here to make script self sufficient.
#   - 05/11/03 rcs : RCS Revision 1.4  2003/10/22 06:39:31  PRouleau
#   - 05/11/03 P.R.: [code:fix] : included the unixpath() in this file.
#   - 08/11/03 rcs : RCS Revision 1.5  2003/11/05 19:40:04  PRouleau
# 
#   RCS $Log: $
# 
# 
# -----------------------------------------------------------------------------
"""                                
mki18n allows you to internationalize your software.  You can use it to 
create the GNU .po files (Portable Object) and the compiled .mo files
(Machine Object).

mki18n module can be used from the command line or from within a script (see 
the Usage at the end of this page).

    Table of Contents
    -----------------
    
    makePO()             -- Build the Portable Object file for the application --
    catPO()              -- Concatenate one or several PO files with the application domain files. --
    makeMO()             -- Compile the Portable Object files into the Machine Object stored in the right location. --
    printUsage           -- Displays how to use this script from the command line --

    Scriptexecution      -- Runs when invoked from the command line --


NOTE:  this module uses GNU gettext utilities.

You can get the gettext tools from the following sites:

   - `GNU FTP site for gettetx`_ where several versions (0.10.40, 0.11.2, 0.11.5 and 0.12.1) are available.
     Note  that you need to use `GNU libiconv`_ to use this. Get it from the `GNU
     libiconv  ftp site`_ and get version 1.9.1 or later. Get the Windows .ZIP
     files and install the packages inside c:/gnu. All binaries will be stored
     inside  c:/gnu/bin.  Just  put c:/gnu/bin inside your PATH. You will need
     the following files: 

      - `gettext-runtime-0.12.1.bin.woe32.zip`_ 
      - `gettext-tools-0.12.1.bin.woe32.zip`_
      - `libiconv-1.9.1.bin.woe32.zip`_ 


.. _GNU libiconv:                            http://www.gnu.org/software/libiconv/
.. _GNU libiconv ftp site:                   http://www.ibiblio.org/pub/gnu/libiconv/
.. _gettext-runtime-0.12.1.bin.woe32.zip:    ftp://ftp.gnu.org/gnu/gettext/gettext-runtime-0.12.1.bin.woe32.zip           
.. _gettext-tools-0.12.1.bin.woe32.zip:      ftp://ftp.gnu.org/gnu/gettext/gettext-tools-0.12.1.bin.woe32.zip 
.. _libiconv-1.9.1.bin.woe32.zip:            http://www.ibiblio.org/pub/gnu/libiconv/libiconv-1.9.1.bin.woe32.zip

"""
# -----------------------------------------------------------------------------
# Module Import
# -------------
# 
import os
import sys
import re

# Try to work even with no python path
try:
    from exe.application import Application
except ImportError, error:
    if str(error) == "No module named exe.application":
        exePath = os.path.abspath(sys.argv[0])
        exeDir  = os.path.dirname(exePath)
        pythonPath = os.path.split(exeDir)[0]
        sys.path.insert(0, pythonPath)
        from exe.application import Application
    else:
        raise error

from exe.engine.path import Path
from xml.dom.ext.reader import Sax2
from xml.dom.NodeFilter import NodeFilter

# -----------------------------------------------------------------------------
# Global variables
# ----------------
# 

__author__ = "Pierre Rouleau"
__version__= "$Revision: 1.5 $"

# -----------------------------------------------------------------------------
# Public variables
# ----------------
# 
                    # iso639    : natural
                    # 2-letter  : language
                    # code      : name
iso639_languageDict = { 'aa'    : 'Afar. ',
                        'ab'    : 'Abkhazian. ',
                        'ae'    : 'Avestan. ',
                        'af'    : 'Afrikaans. ',
                        'am'    : 'Amharic. ',
                        'ar'    : 'Arabic. ',
                        'as'    : 'Assamese. ',
                        'ay'    : 'Aymara. ',
                        'az'    : 'Azerbaijani. ',
                        'ba'    : 'Bashkir. ',
                        'be'    : 'Byelorussian; Belarusian. ',
                        'bg'    : 'Bulgarian. ',
                        'bh'    : 'Bihari. ',
                        'bi'    : 'Bislama. ',
                        'bn'    : 'Bengali; Bangla. ',
                        'bo'    : 'Tibetan. ',
                        'br'    : 'Breton. ',
                        'bs'    : 'Bosnian. ',
                        'ca'    : 'Catalan. ',
                        'ce'    : 'Chechen. ',
                        'ch'    : 'Chamorro. ',
                        'co'    : 'Corsican. ',
                        'cs'    : 'Czech. ',
                        'cu'    : 'Church Slavic. ',
                        'cv'    : 'Chuvash. ',
                        'cy'    : 'Welsh. ',
                        'da'    : 'Danish. ',
                        'de'    : 'German. ',
                        'dz'    : 'Dzongkha; Bhutani. ',
                        'el'    : 'Greek. ',
                        'en'    : 'English. ',
                        'eo'    : 'Esperanto. ',
                        'es'    : 'Spanish. ',
                        'et'    : 'Estonian. ',
                        'eu'    : 'Basque. ',
                        'fa'    : 'Persian. ',
                        'fi'    : 'Finnish. ',
                        'fj'    : 'Fijian; Fiji. ',
                        'fo'    : 'Faroese. ',
                        'fr'    : 'French. ',
                        'fy'    : 'Frisian. ',
                        'ga'    : 'Irish. ',
                        'gd'    : 'Scots; Gaelic. ',
                        'gl'    : 'Gallegan; Galician. ',
                        'gn'    : 'Guarani. ',
                        'gu'    : 'Gujarati. ',
                        'gv'    : 'Manx. ',
                        'ha'    : 'Hausa (?). ',
                        'he'    : 'Hebrew (formerly iw). ',
                        'hi'    : 'Hindi. ',
                        'ho'    : 'Hiri Motu. ',
                        'hr'    : 'Croatian. ',
                        'hu'    : 'Hungarian. ',
                        'hy'    : 'Armenian. ',
                        'hz'    : 'Herero. ',
                        'ia'    : 'Interlingua. ',
                        'id'    : 'Indonesian (formerly in). ',
                        'ie'    : 'Interlingue. ',
                        'ik'    : 'Inupiak. ',
                        'io'    : 'Ido. ',
                        'is'    : 'Icelandic. ',
                        'it'    : 'Italian. ',
                        'iu'    : 'Inuktitut. ',
                        'ja'    : 'Japanese. ',
                        'jv'    : 'Javanese. ',
                        'ka'    : 'Georgian. ',
                        'ki'    : 'Kikuyu. ',
                        'kj'    : 'Kuanyama. ',
                        'kk'    : 'Kazakh. ',
                        'kl'    : 'Kalaallisut; Greenlandic. ',
                        'km'    : 'Khmer; Cambodian. ',
                        'kn'    : 'Kannada. ',
                        'ko'    : 'Korean. ',
                        'ks'    : 'Kashmiri. ',
                        'ku'    : 'Kurdish. ',
                        'kv'    : 'Komi. ',
                        'kw'    : 'Cornish. ',
                        'ky'    : 'Kirghiz. ',
                        'la'    : 'Latin. ',
                        'lb'    : 'Letzeburgesch. ',
                        'ln'    : 'Lingala. ',
                        'lo'    : 'Lao; Laotian. ',
                        'lt'    : 'Lithuanian. ',
                        'lv'    : 'Latvian; Lettish. ',
                        'mg'    : 'Malagasy. ',
                        'mh'    : 'Marshall. ',
                        'mi'    : 'Maori. ',
                        'mk'    : 'Macedonian. ',
                        'ml'    : 'Malayalam. ',
                        'mn'    : 'Mongolian. ',
                        'mo'    : 'Moldavian. ',
                        'mr'    : 'Marathi. ',
                        'ms'    : 'Malay. ',
                        'mt'    : 'Maltese. ',
                        'my'    : 'Burmese. ',
                        'na'    : 'Nauru. ',
                        'nb'    : 'Norwegian Bokmål. ',
                        'nd'    : 'Ndebele, North. ',
                        'ne'    : 'Nepali. ',
                        'ng'    : 'Ndonga. ',
                        'nl'    : 'Dutch. ',
                        'nn'    : 'Norwegian Nynorsk. ',
                        'no'    : 'Norwegian. ',
                        'nr'    : 'Ndebele, South. ',
                        'nv'    : 'Navajo. ',
                        'ny'    : 'Chichewa; Nyanja. ',
                        'oc'    : 'Occitan; Provençal. ',
                        'om'    : '(Afan) Oromo. ',
                        'or'    : 'Oriya. ',
                        'os'    : 'Ossetian; Ossetic. ',
                        'pa'    : 'Panjabi; Punjabi. ',
                        'pi'    : 'Pali. ',
                        'pl'    : 'Polish. ',
                        'ps'    : 'Pashto, Pushto. ',
                        'pt'    : 'Portuguese. ',
                        'qu'    : 'Quechua. ',
                        'rm'    : 'Rhaeto-Romance. ',
                        'rn'    : 'Rundi; Kirundi. ',
                        'ro'    : 'Romanian. ',
                        'ru'    : 'Russian. ',
                        'rw'    : 'Kinyarwanda. ',
                        'sa'    : 'Sanskrit. ',
                        'sc'    : 'Sardinian. ',
                        'sd'    : 'Sindhi. ',
                        'se'    : 'Northern Sami. ',
                        'sg'    : 'Sango; Sangro. ',
                        'si'    : 'Sinhalese. ',
                        'sk'    : 'Slovak. ',
                        'sl'    : 'Slovenian. ',
                        'sm'    : 'Samoan. ',
                        'sn'    : 'Shona. ',
                        'so'    : 'Somali. ',
                        'sq'    : 'Albanian. ',
                        'sr'    : 'Serbian. ',
                        'ss'    : 'Swati; Siswati. ',
                        'st'    : 'Sesotho; Sotho, Southern. ',
                        'su'    : 'Sundanese. ',
                        'sv'    : 'Swedish. ',
                        'sw'    : 'Swahili. ',
                        'ta'    : 'Tamil. ',
                        'te'    : 'Telugu. ',
                        'tg'    : 'Tajik. ',
                        'th'    : 'Thai. ',
                        'ti'    : 'Tigrinya. ',
                        'tk'    : 'Turkmen. ',
                        'tl'    : 'Tagalog. ',
                        'tn'    : 'Tswana; Setswana. ',
                        'to'    : 'Tonga (?). ',
                        'tr'    : 'Turkish. ',
                        'ts'    : 'Tsonga. ',
                        'tt'    : 'Tatar. ',
                        'tw'    : 'Twi. ',
                        'ty'    : 'Tahitian. ',
                        'ug'    : 'Uighur. ',
                        'uk'    : 'Ukrainian. ',
                        'ur'    : 'Urdu. ',
                        'uz'    : 'Uzbek. ',
                        'vi'    : 'Vietnamese. ',
                        'vo'    : 'Volapük; Volapuk. ',
                        'wa'    : 'Walloon. ',
                        'wo'    : 'Wolof. ',
                        'xh'    : 'Xhosa. ',
                        'yi'    : 'Yiddish (formerly ji). ',
                        'yo'    : 'Yoruba. ',
                        'za'    : 'Zhuang. ',
                        'zh'    : 'Chinese. ',
                        'zu'    : 'Zulu.'
                     }

def generateAppFil():
    """
    Generates app.fil
    """
    exe = Path('exe')
    toSearch = [
        (exe,          '*.py'),
        (exe/'engine', '*.py'),
        (exe/'export', '*.py'),
        (exe/'webui',  '*.py'),
        (exe/'idevices', '*.py'),
        (exe/'xului',  '*.py'),
    ]
    output = open('app.fil', 'w')
    for pth, glb in toSearch:
        for fn in Path(pth).glob(glb):
            output.write(fn + '\n')

def makePO(applicationDirectoryPath,  applicationDomain=None, verbose=1) :
    """Build the Portable Object Template file for the application.

    makePO builds the .pot file for the application stored inside 
    a specified directory by running xgettext for all application source 
    files.  It finds the name of all files by looking for a file called 'app.fil'. 
    If this file does not exists, makePo raises an IOError exception.
    By default the application domain (the application
    name) is the same as the directory name but it can be overridden by the 
    'applicationDomain' argument.

    makePO always creates a new file called messages.pot.  If it finds files 
    of the form app_xx.po where 'app' is the application name and 'xx' is one 
    of the ISO 639 two-letter language codes, makePO resynchronizes those 
    files with the latest extracted strings (now contained in messages.pot). 
    This process updates all line location number in the language-specific
    .po files and may also create new entries for translation (or comment out 
    some).  The .po file is not changed, instead a new file is created with 
    the .new extension appended to the name of the .po file.

    By default the function does not display what it is doing.  Set the 
    verbose argument to 1 to force it to print its commands.
    """
    if applicationDomain is None:
        applicationName = fileBaseOf(applicationDirectoryPath,withPath=0)
    else:
        applicationName = applicationDomain
    currentDir = os.getcwd()
    messages_pot = Path('exe/locale/messages.pot')
    # Use xgettext to make the base messages.pot (with header, etc.)
    if messages_pot.exists():
        messages_pot.remove()
    messages_pot.touch()
    cmd = 'xgettext -kx_ -s -j --no-wrap --output=exe/locale/messages.pot --from-code=utf8 exe/engine/package.py'
    if verbose: print cmd
    os.system(cmd)                                                
    if not os.path.exists('app.fil'):
        raise IOError(2,'No module file: app.fil')

    # Steps:                                  
    #  Use xgettext to parse all application modules
    #  The following switches are used:
    #  
    #   -s                          : sort output by string content (easier to use when we need to merge several .po files)
    #   --files-from=app.fil        : The list of files is taken from the file: app.fil
    #   --output=                   : specifies the name of the output file (using a .pot extension)
    cmd = 'xgettext -kx_ -s -j --no-wrap --output=exe/locale/messages.pot --from-code=utf8 %s'
    if verbose: print cmd
    for fn in open('app.fil'):
        print 'Extracting from', fn,
        os.system(cmd % fn[:-1])

    makeXulPO(applicationDirectoryPath, applicationDomain, verbose)

    # Merge new pot with .po files
    localeDirs = Path('exe/locale')
    for filename in localeDirs.walkfiles('*_*.po'):
        cmd = "msgmerge -U --no-wrap %s exe/locale/messages.pot" % filename
        if verbose: print cmd
        os.system(cmd)


def makeXulPO(applicationDirectoryPath,  applicationDomain=None, verbose=0):
    """Searches through xul files and appends to messages.pot"""
    if verbose:
        print "Importing xul templates..."
    path = Path(applicationDirectoryPath)
    messages = pot2dict('exe/locale/messages.pot')
    messageCommentTemplate = '\n#: %s:%s\nmsgid "'
    seq = len(messages)
    skipPaths = (
          applicationDirectoryPath/'exe/webui/firefox',
        )
    for fn in path.walkfiles():
        if fn.ext.lower() == '.xul':
            for skipPath in skipPaths:
                if fn.startswith(skipPath):
                    print 'IGNORING', fn
                    break
            else:
                if verbose:
                    print "template: ", fn
                reader = Sax2.Reader()
                doc = reader.fromStream(file(fn, 'rb'))
                xul2dict(doc, messages, seq, fn.relpath())
    pot = Path('exe/locale/messages.pot') 
    if pot.exists(): 
        pot.remove() 
    pot.touch() 
    dict2pot(messages, 'exe/locale/messages.pot')

def doTranslate(node, toTranslate, messages, seq, filename):
    """Add message to be translated to the messages dict
    """
    attributes = ' '.join(['%s="%s"' % (attr.name, attr.value) for attr
                           in node.attributes.values()])
    tagStr = '<%s %s>' % (node.nodeName, attributes)
    if toTranslate in messages:
        order, comments, msgStr = messages[toTranslate]
        comments += ('#: %s:%s' % (filename, tagStr),)
        messages[toTranslate] = order, comments, msgStr
    else:
        messages[toTranslate] = seq, \
            ('#: %s:%s' % (filename, tagStr),), ''
        seq += 1
    return messages, seq

def xul2dict(doc, messages, seq, filename):
    """Recursively translates some "stan" contexts and
    fills out the messages dict, which should be passed to dict2pot later
    """
    walker = doc.createTreeWalker(doc.documentElement,
                                  NodeFilter.SHOW_ELEMENT, None, 0)
    node = walker.currentNode
    while 1:
        # IF YOU CHANGE THE BELOW RULES, CHANGE THEIR COPY IN:
        #   exe/webui/renderable.py
        # Here we have some rules:
        # 1. if a tag has a 'label' and an 'accesskey' attribute the 
        # whole string is taken for translation like this:
        #    'label="english" accesskey="e"'
        # 2. If a tag has only a label attribute only that is taken
        # for translation: 'english'
        # 3. If a tag is a label tag, only its value is taken for
        # translation: <label value="hello"> becomes 'hello'
        # 4. If a tag is a key tag, translate just the key part.
        # We can do this because the whole tag is stuck in the comment
        # part so the translator can use that.
        # 5. For 'window' tags, the 'title' attribute is translated
        if node is None:
            break
        toTranslate = None
        if node.nodeName == 'description':
            for subnode in node.childNodes:
                if subnode.nodeName == '#text':
                    messages, seq = doTranslate(node, subnode.data,
                            messages, seq, filename)
            # mark that we've handled all the parts here
            toTranslate = None
        elif node.hasAttribute('label'):
            if node.hasAttribute('accesskey'):
                toTranslate = 'label="%s" accesskey="%s"' % (
                    node.getAttribute('label'),
                    node.getAttribute('accesskey'))
            else:
                toTranslate = node.getAttribute('label')
        elif node.nodeName == 'label':
            toTranslate = node.getAttribute('value')
        elif node.nodeName == 'key':
            if node.hasAttribute('key'):
                toTranslate = node.getAttribute('key')
            else:
                toTranslate = node.getAttribute('keycode')
        elif node.hasAttribute('window'):
            toTranslate = node.getAttribute('title')

        if toTranslate:
            # Write it in the file
            messages, seq = doTranslate(node, toTranslate,
                    messages, seq, filename)

        # Next node
        node = walker.nextNode()


def pot2dict(filename):
    """
    Loads a pot file into a dictionary in the format
    {msgid: (seq#, comment, msgstr)}
    """
    lines = open(filename)
    result = {}
    # States
    START, IN_MSGID, IN_MSGSTR = 0,1,2
    state = START
    # Data
    comments = []
    msgid = ''
    msgstr = ''
    seq = 0
    for line in lines:
        if state == START:
            if line.startswith('#'):
                comments.append(line[:-1])
            elif line.startswith('msgid "'):
                state = IN_MSGID
                msgid = eval(line[6:-1])
        elif state == IN_MSGID:
            if line.startswith('"'):
                msgid += eval(line)
            elif line.startswith('msgstr "'):
                state = IN_MSGSTR
                msgstr = eval(line[7:-1])
        elif state == IN_MSGSTR:
            if line.startswith('"'):
                msgstr += eval(line)
            elif not line.strip():
                state = START
                result[unicode(msgid, 'utf8')] = (seq, [unicode(comment, 'utf8') for comment in comments], unicode(msgstr, 'utf8')) 
                comments = []
                msgid = ''
                msgstr = ''
                seq += 1
    if msgid not in result:
        result[unicode(msgid, 'utf8')] = (seq, [unicode(comment, 'utf8') for comment in comments], unicode(msgstr, 'utf8')) 
    return result

def dict2pot(dct, filename, verbose=False):
    """
    Writes out a dct in the format {msgid: (seq#, comments, msgstr)}
    to a file named filename
    'dct' is the dict in the format {msgid: (seq#, comments, msgstr)}
    'filename' is the name of the output file, which will be overwritten if
    exists or created
    """
    output = open(filename, 'w')
    if verbose:
        def write(data):
            print data,
            output.write(data)
    else:
        write = output.write
    data = [(seq, comments, msgid, msgstr) for
            msgid, (seq, comments, msgstr) in
            dct.items()]
    for seq, comments, msgid, msgstr in sorted(data):
        # comments
        write('\n')
        for line in comments:
            write('%s\n' % line.encode('utf8'))
        # Msgid
        msgid = msgid.encode('utf8').replace('"', r'\"')
        if '\n' in msgid or len(msgid) > 80:
            write('msgid ""\n')
            write(multiLineOutput(msgid))
        else:
            write('msgid "%s"\n' % msgid)
        # Msgstr
        msgstr = msgstr.encode('utf8').replace('"', r'\"')
        if '\n' in msgstr or len(msgstr) > 80:
            write('msgstr ""\n')
            write(multiLineOutput(msgstr))
        else:
            write('msgstr "%s"\n' % msgstr)


def multiLineOutput(string):
    """
    Reformats a string for multiline output to a pot file
    """
    result = ''
    lines = string.split('\n')
    for line in lines[:-1]:
        result += '"%s\\n"\n' % line
    if lines[-1]:
        result += '"%s"\n' % lines[-1]
    return result


# -----------------------------------------------------------------------------
# c a t P O ( )         -- Concatenate one or several PO files with the application domain files. --
# ^^^^^^^^^^^^^
# 
def catPO(applicationDirectoryPath, listOf_extraPo, applicationDomain=None, targetDir=None, verbose=0) :
    """Concatenate one or several PO files with the application domain files.
    """

    if applicationDomain is None:
        applicationName = fileBaseOf(applicationDirectoryPath,withPath=0)
    else:
        applicationName = applicationDomain
    currentDir = os.getcwd()
    os.chdir(applicationDirectoryPath)                    

    for langCode in iso639_languageDict.keys():
        if langCode == 'en':
            pass
        else:
            langPOfileName = "exe/locale/%s_%s.po" % (applicationName , langCode)
            if os.path.exists(langPOfileName):                  
                fileList = ''
                for fileName in listOf_extraPo:
                    fileList += ("exe/locale/%s_%s.po " % (fileName,langCode))
                cmd = "msgcat -s --no-wrap %s %s > %s.cat" % (langPOfileName, fileList, langPOfileName)
                if verbose: print cmd
                os.system(cmd)
                if targetDir is None:
                    pass
                else:
                    mo_targetDir = "exe/locale/%s/%s/LC_MESSAGES" % (targetDir,langCode)                      
                    cmd = "msgfmt --output-file=%s/%s.mo %s_%s.po.cat" % (mo_targetDir,applicationName,applicationName,langCode)
                    if verbose: print cmd
                    os.system(cmd)
    os.chdir(currentDir)

# -----------------------------------------------------------------------------
# m a k e M O ( )         -- Compile the Portable Object files into the Machine Object stored in the right location. --
# ^^^^^^^^^^^^^^^
# 
def makeMO(applicationDirectoryPath,targetDir=None,applicationDomain=None, verbose=0, forceEnglish=0) :
    """Compile the Portable Object files into the Machine Object stored in the right location.

    makeMO converts all translated language-specific PO files located inside 
    the  application directory into the binary .MO files stored inside the 
    LC_MESSAGES sub-directory for the found locale files.

    makeMO searches for all files that have a name of the form 'app_xx.po' 
    inside the application directory specified by the first argument.  The 
    'app' is the application domain name (that can be specified by the 
    applicationDomain argument or is taken from the directory name). The 'xx' 
    corresponds to one of the ISO 639 two-letter language codes.

    makeMo stores the resulting files inside a sub-directory of `targetDir` 
    called xx/LC_MESSAGES where 'xx' corresponds to the 2-letter language 
    code.
    """                       
    if targetDir is None:
        targetDir = 'exe/locale'
    if verbose:
        print "Target directory for .mo files is: %s" % targetDir
    targetDir = Path(targetDir)
            
    if applicationDomain is None:
        applicationName = fileBaseOf(applicationDirectoryPath,withPath=0)
    else:
        applicationName = applicationDomain
    currentDir = os.getcwd()
    os.chdir(applicationDirectoryPath)                    

    exp = re.compile(r'exe_(.*)\.po')
    
    for filename in targetDir.walkfiles('*_*.po'):
        langCode = exp.match(filename.basename()).group(1)
        mo_targetDir = targetDir/langCode/'LC_MESSAGES'
        if not mo_targetDir.exists():
            mo_targetDir.makedirs()
        cmd = "msgfmt -f --statistics -c --output-file=%s.mo %s" % (
               mo_targetDir/applicationName,filename)
        if verbose:
            print cmd
        os.system(cmd)

    os.chdir(currentDir)
   
# -----------------------------------------------------------------------------
# p r i n t U s a g e         -- Displays how to use this script from the command line - 
# ^^^^^^^^^^^^^^^^^^^
#
def printUsage(errorMsg=None) :
    """Displays how to use this script from the command line."""
    print """
    ##################################################################################
    #   mki18n :   Make internationalization files.                                  #
    #              Uses the GNU gettext system to create PO (Portable Object) files  #
    #              from source code, coimpile PO into MO (Machine Object) files.     #        
    #              Supports C,C++,Python source files.                               #
    #                                                                                #
    #   Usage: mki18n {OPTION} [appDirPath]                                          #
    #                                                                                #
    #   Options:                                                                     #
    #     -e               : When -m is used, forces English .mo file creation       #
    #     -h               : prints this help                                        #
    #     -m               : make MO from existing PO files                          #
    #     -p               : make PO, update PO files: Creates a new messages.pot    #
    #                        file. Creates a dom_xx.po.new for every existing        #
    #                        language specific .po file. ('xx' stands for the ISO639 #
    #                        two-letter language code and 'dom' stands for the       #
    #                        application domain name).  mki18n requires that you     #
    #                        write a 'app.fil' file  which contains the list of all  #
    #                        source code to parse.                                   #
    #     -v               : verbose (prints comments while running)                 #
    #     --domain=appName : specifies the application domain name.  By default      #
    #                        the directory name is used.                             #
    #     --moTarget=dir : specifies the directory where .mo files are stored.       #
    #                      If not specified, the target is './locale'                #
    #                                                                                #
    #   You must specify one of the -p or -m option to perform the work.  You can    #
    #   specify the path of the target application.  If you leave it out mki18n      #
    #   will use the current directory as the application main directory.            #        
    #                                                                                #
    ##################################################################################"""
    if errorMsg:
        print "\n   ERROR: %s" % errorMsg

# -----------------------------------------------------------------------------
# f i l e B a s e O f ( )         -- Return base name of filename --
# ^^^^^^^^^^^^^^^^^^^^^^^
# 
def fileBaseOf(filename,withPath=0) :
   """fileBaseOf(filename,withPath) ---> string

   Return base name of filename.  The returned string never includes the extension.
   Use os.path.basename() to return the basename with the extension.  The 
   second argument is optional.  If specified and if set to 'true' (non zero) 
   the string returned contains the full path of the file name.  Otherwise the 
   path is excluded.

   [Example]
   >>> fn = 'd:/dev/telepath/tvapp/code/test.html'
   >>> fileBaseOf(fn)
   'test'
   >>> fileBaseOf(fn)
   'test'
   >>> fileBaseOf(fn,1)
   'd:/dev/telepath/tvapp/code/test'
   >>> fileBaseOf(fn,0)
   'test'
   >>> fn = 'abcdef'
   >>> fileBaseOf(fn)
   'abcdef'
   >>> fileBaseOf(fn,1)
   'abcdef'
   >>> fn = "abcdef."
   >>> fileBaseOf(fn)
   'abcdef'
   >>> fileBaseOf(fn,1)
   'abcdef'
   """            
   pos = filename.rfind('.')             
   if pos > 0:
      filename = filename[:pos]
   if withPath:
      return filename
   else:
      return os.path.basename(filename)
# -----------------------------------------------------------------------------
# m k d i r ( )         -- Create a directory (and possibly the entire tree) --
# ^^^^^^^^^^^^^
# 
def mkdir(directory) :
   """Create a directory (and possibly the entire tree).

   The os.mkdir() will fail to create a directory if one of the 
   directory in the specified path does not exist.  mkdir()
   solves this problem.  It creates every intermediate directory
   required to create the final path. Under Unix, the function 
   only supports forward slash separator, but under Windows and MacOS
   the function supports the forward slash and the OS separator (backslash
   under windows).
   """ 

   # translate the path separators
   directory = unixpath(directory)
   # build a list of all directory elements
   aList = filter(lambda x: len(x)>0, directory.split('/'))
   theLen = len(aList)                     
   # if the first element is a Windows-style disk drive
   # concatenate it with the first directory
   if aList[0].endswith(':'):
      if theLen > 1:
         aList[1] = aList[0] + '/' + aList[1]
         del aList[0]      
         theLen -= 1         
   # if the original directory starts at root,
   # make sure the first element of the list 
   # starts at root too
   if directory[0] == '/':     
      aList[0] = '/' + aList[0]
   # Now iterate through the list, check if the 
   # directory exists and if not create it
   theDir = ''
   for i in range(theLen):
      theDir += aList[i]
      if not os.path.exists(theDir):
         os.mkdir(theDir)
      theDir += '/'   
      
# -----------------------------------------------------------------------------
# u n i x p a t h ( )         -- Return a path name that contains Unix separator. --
# ^^^^^^^^^^^^^^^^^^^
# 
def unixpath(thePath) :
   r"""Return a path name that contains Unix separator.

   [Example]
   >>> unixpath(r"d:\test")
   'd:/test'
   >>> unixpath("d:/test/file.txt")
   'd:/test/file.txt'
   >>> 
   """
   thePath = os.path.normpath(thePath)
   if os.sep == '/':
      return thePath
   else:
      return thePath.replace(os.sep,'/')

# ----------------------------------------------------------------------------- 

# S c r i p t   e x e c u t i o n               -- Runs when invoked from the command line --
# ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
# 
if __name__ == "__main__":
    # Move to the right dir
    curdir = Path('.').abspath()
    if curdir.basename() == 'exe':
        if 'locale' in [p.relpath() for p in curdir.dirs()]:
            (curdir/'..').chdir()
    elif curdir.basename() == 'locale':
        (curdir/'..'/'..').chdir()
    print 'Running from: %s' % Path('.').abspath()
    # Fill out the options
    option = {}
    option['forceEnglish'] = 0
    option['mo'] = 0
    option['po'] = 0        
    option['verbose'] = 1
    option['domain'] = None
    option['moTarget'] = Path('exe/locale').abspath()
    option['domain'] = 'exe'
    if option['verbose']:
        print "Application domain used is: '%s'" % option['domain']        
        print 'Generating file list: app.fil'
    # Generate the list of files to use
    generateAppFil()
    # Make the .po files
    try:
        makePO(Path('.'),option['domain'],option['verbose'])
    except IOError, e:
        printUsage(e[1] + '\n   You must write a file app.fil that contains the list of all files to parse.')
    # Compile the result
    makeMO('.',option['moTarget'],option['domain'],option['verbose'],option['forceEnglish'])
    sys.exit(1)            
            

# -----------------------------------------------------------------------------
