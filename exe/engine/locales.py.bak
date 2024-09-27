# ===========================================================================
# eXe config
# Copyright 2004-2006, University of Auckland
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

"""
Auto chooses locale
"""

import os
import locale

def chooseDefaultLocale(localeDir):
    """
    Given a directory with a bunch of sub dirs (en, es, en.US, etc.)
    Returns the name of the most appropriate sub dir for this system
    """
    lang, encoding = locale.getdefaultlocale()
    if lang is None:
        lang = 'en'
    if encoding is None:
        encoding = 'utf-8'
    localeName = '%s.%s' % (lang, encoding)
    # Now find the best match from the dirs
    myLang, myCountry, myEncoding = splitLocaleName(localeName)
    possibleDirs = []
    if localeDir.isdir():
        for sub in localeDir.dirs():
            if (sub/'LC_MESSAGES'/'exe.mo').exists():
                lang, country, encoding = splitLocaleName(sub.basename())
                points = 0
                if lang == myLang:
                    points += 1
                if country == myCountry:
                    points += 1
                if encoding == myEncoding:
                    points += 1
                if points:
                    possibleDirs.append((points, sub.basename()))
        possibleDirs.sort()
        if possibleDirs:
            return str(possibleDirs[-1][-1])
    return 'en'

def splitLocaleName(localeName):
    """
    Takes a locale name and returns
    langCode, country, encoding
    eg.
      en_NZ.UTF-8
    becomes
      'en', 'NZ', 'UTF-8'
    eg.
      es
    becomes
      'es', '', 'ASCII'
    """
    country = ''
    encoding = 'ASCII'
    if '_' in localeName:
        lang, country = localeName.split('_', 1)
        if '.' in country:
            country, encoding = country.split('.', 1)
    else:
        lang = localeName
        if '.' in lang:
            lang, encoding = lang.split('.', 1)
    return lang, country, encoding
