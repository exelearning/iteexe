# -- coding: utf-8 --
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
# Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
# ===========================================================================

"""
The PreferencesPage is responsible for managing eXe preferences
"""

import logging
import json
from twisted.web.resource      import Resource
from exe.webui.renderable      import RenderableResource
import mywebbrowser
from exe.engine.path import Path
import os.path

log = logging.getLogger(__name__)

langNames = {
    'fi': 'Finnish',
    'hr': 'Croatian',
    'ig': "Nunivak Cup'ig",
    'lo': 'Lao; Laotian',
    'pt_br': 'Brazillian Portuguese',
    'ru': 'Russian',
    'tg': 'Tajik',
    'yo': 'Yoruba',
    'el': '\xce\x95\xce\xbb\xce\xbb\xce\xb7\xce\xbd\xce\xb9\xce\xba\xce\xac',
    'en': 'English',
    'zh': '\xe7\xae\x80\xe4\xbd\x93\xe4\xb8\xad\xe6\x96\x87',
    'ee': 'Ewe',
    'vi': 'Vietnamese',
    'is': '\xc3\x8dslenska',
    'it': 'Italiano',
    'eu': 'Euskara',
    'zu': 'isiZulu',
    'cs': '\xc4\x8cesky',
    'et': 'Eesti',
    'gl': 'Galego',
    'id': 'Indonesian',
    'es': 'Espa\xc3\xb1ol',
    'nl': 'Nederlands',
    'pt': 'Portugu\xc3\xaas',
    'tw': 'Twi',
    'nb': 'Bokm\xc3\xa5l',
    'tr': 'Turkish',
    'tl': 'Tagalog',
    'th': '\xe0\xb8\xa0\xe0\xb8\xb2\xe0\xb8\xa9\xe0\xb8\xb2\xe0\xb9\x84\xe0\xb8\x97\xe0\xb8\xa2',
    'ca': 'Catal\xc3\xa0',
    'ca_VALENCIA': 'Valenci\xc3\xa0',
    'pl': 'J\xc4\x99zyk Polski, polszczyzna',
    'fr': 'Fran\xc3\xa7ais',
    'bg': 'Bulgarian',
    'zh_tw': '\xe7\xae\x80\xe4\xbd\x93\xe4\xb8\xad\xe6\x96\x87',
    'da': 'Dansk',
    'br': 'Breton',
    'hu': 'Magyar',
    'ja': '\xe6\x97\xa5\xe6\x9c\xac\xe8\xaa\x9e',
    'sr': 'Srpski',
    'mi': 'M\xc4\x81ori',
    'sv': 'Svenska',
    'km': 'Khmer',
    'sk': 'Sloven\xc4\x8dina, Slovensk\xc3\xbd Jazyk',
    'de': 'Deutsch',
    'uk': 'Ukrainian',
    'sl': 'Sloven\xc5\xa1\xc4\x8dina'
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
        self.doctypes=['XHTML','HTML5']
            

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
        return json.dumps({'success': True, 'data': data, 'locales': self.localeNames, 'browsers': self.browsers})

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
            self.config.editorMode=editormodesel
            self.config.configParser.set('user', 'editorMode', editormodesel)
            doctypesel = request.args['docType'][0]
            self.config.docType = doctypesel
            self.config.configParser.set('user', 'docType', doctypesel)
            browser = request.args['browser'][0]
            if browser == "None":
                browser = None
            try:
                self.config.browser = mywebbrowser.get(browser)
            except Exception as e:
                browser_path = Path(browser)
                if browser_path.exists():
                    mywebbrowser.register('custom-browser' , None, mywebbrowser.BackgroundBrowser(browser_path.abspath()), -1)
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
