# babelizer.py - API for simple access to babelfish.altavista.com.
#                Requires python 2.0 or better.
#
# See it in use at http://babel.MrFeinberg.com/

"""API for simple access to babelfish.altavista.com.

Summary:

    import babelizer
   
	print ' '.join(babelizer.available_languages)

    print babelizer.translate( 'How much is that doggie in the window?',
		                       'English', 'French' )

    def babel_callback(phrase):
		print phrase
		sys.stdout.flush()
		
	babelizer.babelize( 'I love a reigning knight.',
						'English', 'German',
						callback = babel_callback )

available_languages
    A list of languages available for use with babelfish.

translate( phrase, from_lang, to_lang )
    Uses babelfish to translate phrase from from_lang to to_lang.

babelize(phrase, from_lang, through_lang, limit = 12, callback = None)
    Uses babelfish to translate back and forth between from_lang and
    through_lang until either no more changes occur in translation or
    limit iterations have been reached, whichever comes first.  Takes
    an optional callback function which should receive a single
    parameter, being the next translation.  Without the callback
    returns a list of successive translations.

It's only guaranteed to work if 'english' is one of the two languages
given to either of the translation methods.

Both translation methods throw exceptions which are all subclasses of
BabelizerError.  They include

LanguageNotAvailableError
    Thrown on an attempt to use an unknown language.

BabelfishChangedError
    Thrown when babelfish.altavista.com changes some detail of their
    layout, and babelizer can no longer parse the results or submit
    the correct form (a not infrequent occurance).

BabelizerIOError
    Thrown for various networking and IO errors.

Version: $Id: babelizer.py,v 1.4 2001/06/04 21:25:09 Administrator Exp $
Author: Jonathan Feinberg <jdf@pobox.com>
"""
import re, string, urllib
from tempfile import TemporaryFile

"""
Various patterns I have encountered in looking for the babelfish result.
We try each of them in turn, based on the relative number of times I've
seen each of these patterns.  $1.00 to anyone who can provide a heuristic
for knowing which one to use.   This includes AltaVista employees.
"""
__where = [ 
    re.compile(r'<td bgcolor=white class=s><div style=padding:10px;>([^<]*)'),]

__languages = { 'english'   : 'en',
                'french'    : 'fr',
                'spanish'   : 'es',
                'german'    : 'de',
                'italian'   : 'it',
                'portugese' : 'pt',
              }

"""
  All of the available language names.
"""
available_languages = [ x.title() for x in __languages.keys() ]

"""
  Calling translate() or babelize() can raise a BabelizerError
"""
class BabelizerError(Exception):
    pass

class LanguageNotAvailableError(BabelizerError):
    pass
class BabelfishChangedError(BabelizerError):
    pass
class BabelizerIOError(BabelizerError):
    pass

def clean(text):
    return ' '.join(string.replace(text.strip(), "\n", ' ').split())

def translate(phrase, from_lang, to_lang):
    phrase = clean(phrase)
    try:
        from_code = __languages[from_lang.lower()]
        to_code = __languages[to_lang.lower()]
    except KeyError, lang:
        raise LanguageNotAvailableError(lang)
    
    params = urllib.urlencode( { #'BabelFishFrontPage' : 'yes',
                                 'doit' : 'done',
                                 'intl' : '1',
                                 'tt' : 'urltext',
                                 'trtext' : phrase,
                                 #'urltext' : phrase,
                                 'lp' : from_code + '_' + to_code } )
    try:
        response = urllib.urlopen('http://babelfish.altavista.com/tr', params)
    except IOError, what:
        raise BabelizerIOError("Couldn't talk to server: %s" % what)
    except:
        print "Unexpected error:", sys.exc_info()[0]

    html = response.read()
    for regex in __where:
        match = regex.search(html)
        if match: break
    if not match:
        open('tmp.html', 'w').write(html)
        raise BabelfishChangedError("Can't recognize translated string.")
    return clean(match.group(1))

def babelize(phrase, from_language, through_language, limit = 12, callback = None):
    phrase = clean(phrase)
    seen = { phrase: 1 }
    if callback:
        callback(phrase)
    else:
        results = [ phrase ]
    flip = { from_language: through_language, through_language: from_language }
    next = from_language
    for i in range(limit):
        phrase = translate(phrase, next, flip[next])
        if seen.has_key(phrase): break
        seen[phrase] = 1
        if callback:
            callback(phrase)
        else:
            results.append(phrase)
        next = flip[next]
    if not callback: return results

def autoTranslate(poFile, language='Spanish'):
    """
    Reads in a po/pot file and automatically translates all the message ids to
    messages
    """
    noTags = re.compile("(<[^>]*>)|(\\n)|(\\t)|(&[^;]{2,4};)")
    msgid = ''
    inId = inStr = False
    #outFile = TemporaryFile()
    outFile = open('exe_es2.po', 'w')
    def doTranslate(msgid):
        if not msgid:
            outFile.write('msgstr ""\n')
            return
        msgstr = translate(noTags.sub('', msgid), 'English', language)
        print
        print 'in:', msgid
        print 'out:', msgstr
        outFile.write('msgstr "%s"' % msgstr)
    for line in poFile:
        if inStr:
            if line and line[0] != '"':
                inStr = False
        elif inId:
            if line[0] == '"':
                outFile.write(line)
                msgid += line[1:-1]
            else:
                # Got a whole id, now translate it
                print 'MULTI'
                doTranslate(msgid)
                inId = False
        else:
            if line.startswith('msgstr "'):
                inStr = True
            else:
                outFile.write(line)
            if line.startswith('msgid "'):
                if line[7] == '"':
                    msgid = ''
                    inId = True
                    print 'in id'
                elif line[7:-1]:
                    print 'SINGLE'
                    doTranslate(line[7:-2])
    outFile.close()


def po2dict(poFile):
    """
    Converts a po/pot file to a dict of
    {msgid: (comment, msgstr)}
    """
    msgid = msgstr = comment = ''
    inId = inStr = False
    result = {}
    for line in poFile:
        if line[0] == '#':
            comment += line[2:]
        elif line[:7] == 'msgid "':
            if line[7] == '"':
                inId = True
                inStr = False
                msgid = ''
            else:
                # Got an id
                msgid = line[7:-2]
        elif line[:8] == 'msgstr "':
            if line[8] == '"':
                inStr = True
                inId = False
                msgstr = ''
            else:
                # Got a pair
                result[msgid] = comment, line[8:-2]
                inId = inStr = False
                msgid = msgstr = comment = ''
            continue
        elif inId:
            if line[0] == '"':
                msgid += line[1:-2]
            else:
                inId = False
        elif inStr:
            if line[0] == '"':
                msgstr += line[1:-2]
            else:
                # Got pair
                result[msgid] = comment, msgstr
                inId = inStr = False
                msgid = msgstr = comment = ''
    # Check if we've just finished the last msgstr
    if inStr:
        result[msgid] = comment, msgstr
    return result

if __name__ == '__main__':
    #autoTranslate(open('exe_es.po'))
    dct = po2dict(open('exe_es.po'))
    from pprint import pprint
    #pprint(dct)
    print dct[''][0]
    print dct[''][1]
