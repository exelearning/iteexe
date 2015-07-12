#!/usr/bin/python
# -*- coding: utf-8 -*-
# ===========================================================================
# eXe
# Copyright 2004-2006, University of Auckland
# Copyright 2006-2007 eXe Project, New Zealand Tertiary Education Commission
# Copyright 2013, Pedro Peña Pérez, Open Phoenix IT
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
# Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
# ===========================================================================

"""
The PreferencesPage is responsible for managing eXe preferences
"""

import logging
import json
from twisted.web.resource import Resource
from exe.webui.renderable import RenderableResource
import mywebbrowser
from exe.engine.path import Path
import os.path
from exe.webui import common

log = logging.getLogger(__name__)

langNames = {
   'am': 'አማርኛ',                       # Amharic አማርኛ
   'ar': 'العربية',                       # Arabic
   'ast': 'asturianu',
   'bg': 'Български',                   # Bulgarian
   'bn': 'বাংলা',                       # Bengali
   'br': 'Brezhoneg',                  # Breton
   'ca': 'Català',                     # Catalonian
   # 'ca_VALENCIA': 'Valencià',        # Valencian Catalonian
   'ca_ES@valencia': 'Valencià',       # Valencian Catalonian
   'cs': 'Čeština, český jazyk',       # \xc4\x8cesky, Czech
   'da': 'Dansk',
   'de': 'Deutsch',                    # German
   'ee': 'Eʋegbe',                     # Ewe
   'el': 'Ελληνικά',                    # \xce\x95\xce\xbb\xce\xbb\xce\xb7\xce\xbd\xce\xb9\xce\xba\xce\xac, Greek
   'en': 'English',
   'es': 'Español',                    # Español, Spanish
   'et': 'Eesti',                      # Estonian
   'eu': 'Euskara',                    # Basque
   'fa': 'فارسی',                      # Farsi, Persian
   'fi': 'Suomi',                      # Finnish
   'fr': 'Français',                   # Fran\xc3\xa7ais, French
   'gl': 'Galego',                     # Galician
   'hr': 'Hrvatski',                   # Croatian
   'hu': 'Magyar',                     # Hungarian
   'id': 'Bahasa Indonesia',           # Indonesian
   'ig': 'Asụsụ Igbo',                 # Nunivak Cup'ig, Igbo
   'is': 'Íslenska',                   # \xc3\x8dslenska, Icelandic
   'it': 'Italiano',
   'ja': '日本語',                      # \xe6\x97\xa5\xe6\x9c\xac\xe8\xaa\x9e', Japanese
   'km': 'ភាសាខ្មែរ',                                               # Khmer, Cambodyan
   'lo': 'ພາສາລາວ',                                     # Lao, Laotian
   'mi': 'Māori',                      # M\xc4\x81ori
   'nb':  'Norsk bokmål',              # Bokm\xc3\xa5l, Norwegian Bokmål
   'nl': 'Nederlands',                 # Dutch
   'pl': 'Język polski, polszczyzna',  # J\xc4\x99zyk Polski, polszczyzna
   'pt': 'Português',                  # Portugu\xc3\xaas
   'pt_br': 'Português do Brazil',     # Brazillian Portuguese
   'ru': 'Русский',                    # Russian
   'sk': 'Slovenčina, slovenský jazyk',  # Sloven\xc4\x8dina, Slovensk\xc3\xbd Jazyk - Slovak
   'sl': 'Slovenščina',                # Sloven\xc5\xa1\xc4\x8dina - Slovene
   'sr': 'Српски / srpski',            # Srpski, serbio
   'sv': 'Svenska',                    # Swedish
   'th':  'ไทย',                                                            # \xe0\xb8\xa0\xe0\xb8\xb2\xe0\xb8\xa9\xe0\xb8\xb2\xe0\xb9\x84\xe0\xb8\x97\xe0\xb8\xa2 - Thai
   'tl': 'Wikang Tagalog, ᜏᜒᜃᜅ᜔ ᜆᜄᜎᜓᜄ᜔',  # Tagalog
   'tg': 'тоҷикӣ, toğikī, تاجیکی‎',    # Tajik
   'tr': 'Türkçe',                     # Turkish
   'tw': 'Twi',
   'uk': 'Українська',                 # Ukrainian
   'vi': 'Tiếng Việt',                 # Vietnamese
   'yo': 'Yorùbá',                     # Yoruba
   'zh': '\xe7\xae\x80\xe4\xbd\x93\xe4\xb8\xad\xe6\x96\x87',
   # 'zh_tw': '\xe7\xae\x80\xe4\xbd\x93\xe4\xb8\xad\xe6\x96\x87',
   'zh_CN': '简体中文',
   'zh_TW': '正體中文（台灣)',
   'zu': 'isiZulu'
}

browsersHidden = ('xdg-open', 'gvfs-open', 'x-www-browser', 'gnome-open', 'kfmclient', 'www-browser', 'links',
                     'elinks', 'lynx', 'w3m', 'windows-default', 'macosx', 'konqueror', 'MacOSX')
browserNames = {
                "internet-explorer": "Internet Explorer",
                "safari": "Safari",
                "opera": "Opera",
                "opera-stable": "Opera Stable",
                "chrome": "Google Chrome",
                "google-chrome": "Google Chrome",
                "chromium": "Chromium",
                "chromium-browser": "Chromium",
                "grail": "Grail",
                "skipstone": "Skipstone",
                "galeon": "Galeon",
                "epiphany": "Epiphany",
                "mosaic": "Mosaic",
                "kfm": "Kfm",
                "konqueror": "Konqueror",
                "firefox": "Mozilla Firefox",
                "mozilla-firefox": "Mozilla Firefox",
                "firebird": "Mozilla Firebird",
                "mozilla-firebird": "Mozilla Firebird",
                "iceweasel": "Iceweasel",
                "iceape": "Iceape",
                "seamonkey": "Seamonkey",
                "mozilla": "Mozilla",
                "netscape": "Netscape",
                "midori": "Midori",
                "None": "default"
        }


class PreferencesPage(RenderableResource):
    """
    The PreferencesPage is responsible for managing eXe preferences
    """
    name = 'preferences'

    browsersAvalaibles = []

    def __init__(self, parent):
        """
        Initialize
        """
        RenderableResource.__init__(self, parent)
        self.localeNames = []
        self.browsers = []
        self.licensesNames=[]

        for locale in self.config.locales.keys():
            localeName = locale + ": "
            langName = langNames.get(locale)
            localeName += langName
            self.localeNames.append({'locale': locale, 'text': localeName})
        self.localeNames.sort()
        for browser in mywebbrowser._browsers:
            if (browser not in browsersHidden):
                if browser in browserNames:
                    self.browsersAvalaibles.append((browserNames[browser], browser))
        self.browsersAvalaibles.sort()
        self.browsersAvalaibles.append((_(u"Default browser in your system"), "None"))
        for browser in self.browsersAvalaibles:
            self.browsers.append({'browser': browser[1], 'text': browser[0]})
        a=common.getLicenses()
        for licenses in common.getLicenses():
            self.licensesNames.append({'licenseName': licenses,'text':_(licenses)})



    def getChild(self, name, request):
        """
        Try and find the child for the name given
        """
        if name == "":
            return self
        else:
            return Resource.getChild(self, name, request)

    def render_GET(self, request):
        """Render the preferences"""
        log.debug("render_GET")
        data = {}
        try:
            data['editorMode'] = self.config.editorMode
            data['docType'] = self.config.docType
            data['locale'] = self.config.locale
            data['internalAnchors'] = self.config.internalAnchors
            data['googleApiClientID'] = self.config.googleApiClientID
            data['defaultLicense'] = self.config.defaultLicense
            browserSelected = "None"
            for bname, item in mywebbrowser._browsers.items():
                if bname not in browsersHidden:
                    klass, instance = item
                    if instance == self.config.browser:
                        browserSelected = bname
                        break
            if browserSelected == "custom-browser":
                if os.path.exists(self.config.browser.name):
                    browserSelected = self.config.browser.name
            data['browser'] = browserSelected
            data['showPreferencesOnStart'] = self.config.showPreferencesOnStart
        except Exception as e:
            log.exception(e)
            return json.dumps({'success': False, 'errorMessage': _("Failed to get preferences")})
        return json.dumps({'success': True, 'data': data, 'locales': self.localeNames, 'browsers': self.browsers,'licensesNames':self.licensesNames})

    def render_POST(self, request):
        """
        function replaced by nevow_clientToServerEvent to avoid POST message
        """
        log.debug("render_POST " + repr(request.args))
        data = {}
        try:
            locale = request.args['locale'][0]
            self.config.locale = locale
            self.config.locales[locale].install(unicode=True)
            self.config.configParser.set('user', 'locale', locale)

            internalAnchors = request.args['internalAnchors'][0]
            self.config.internalAnchors = internalAnchors
            self.config.configParser.set('user', 'internalAnchors', internalAnchors)

            editormodesel = request.args['editorMode'][0]
            self.config.editorMode = editormodesel
            self.config.configParser.set('user', 'editorMode', editormodesel)

            doctypesel = request.args['docType'][0]
            self.config.docType = doctypesel
            self.config.configParser.set('user', 'docType', doctypesel)

            googleApiClientID = request.args['googleApiClientID'][0]
            self.config.googleApiClientID = googleApiClientID
            self.config.configParser.set('user', 'googleApiClientID', googleApiClientID)
            
            defaultLicense = request.args['defaultLicense'][0]
            self.config.defaultLicense = defaultLicense
            self.config.configParser.set('user', 'defaultLicense', defaultLicense)
            
            browser = request.args['browser'][0]
            if browser == "None":
                browser = None
            try:
                self.config.browser = mywebbrowser.get(browser)
            except Exception as e:
                browser_path = Path(browser)
                if browser_path.exists():
                    mywebbrowser.register('custom-browser', None, mywebbrowser.BackgroundBrowser(browser_path.abspath()), -1)
                    self.config.browser = mywebbrowser.get('custom-browser')
                else:
                    raise e
            self.config.configParser.set('system', 'browser', browser)
            
            showPreferencesOnStart = request.args['showPreferencesOnStart'][0]
            self.config.showPreferencesOnStart = showPreferencesOnStart
            self.config.configParser.set('user', 'showPreferencesOnStart', showPreferencesOnStart)
        except Exception as e:
            log.exception(e)
            return json.dumps({'success': False, 'errorMessage': _("Failed to save preferences")})
        return json.dumps({'success': True, 'data': data})

    def getSelectedLanguage(self):
        """
        It would be the TinyMCE lang
        """
        return self.config.locale

    def getEditorMode(self):
        """
        It would be the TinyMCE lang
        """
        return self.config.editorMode
