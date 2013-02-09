# ===========================================================================
# eXe
# Copyright 2004-2006, University of Auckland
# Copyright 2006-2007 eXe Project, New Zealand Tertiary Education Commission
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
from twisted.web.resource      import Resource
from exe.webui                 import common
from exe.webui.renderable      import RenderableResource

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

class PreferencesPage(RenderableResource):
    """
    The PreferencesPage is responsible for managing eXe preferences
    """
    name = 'preferences'

    def __init__(self, parent):
        """
        Initialize
        """
        RenderableResource.__init__(self, parent)
        self.localeNames  = []
        
        for locale in self.config.locales.keys():
            localeName  = locale + ": " 
            langName = langNames.get(locale)
            localeName += langName
            self.localeNames.append((localeName, locale))
        self.localeNames.sort()

        
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
        
        # Rendering
        html  = common.docType()
        html += u"<html xmlns=\"http://www.w3.org/1999/xhtml\">\n"
        html += u"<head>\n"
        html += u"<style type=\"text/css\">\n"
        html += u"@import url(/css/exe.css);\n"
        html += u'@import url(/style/base.css);\n'
        html += u"@import url(/style/standardwhite/content.css);</style>\n"
        html += u'''<script language="javascript" type="text/javascript">
            function setLocaleAndAnchors(l,anchors) {
                parent.nevow_clientToServerEvent('setLocale', this, '', l)
                parent.nevow_clientToServerEvent('setInternalAnchors', this, '', anchors)
                parent.Ext.getCmp('preferenceswin').close()
            }
        </script>'''
        html += u"<title>"+_("eXe : elearning XHTML editor")+"</title>\n"
        html += u"<meta http-equiv=\"content-type\" content=\"text/html; "
        html += u" charset=UTF-8\"></meta>\n";
        html += u"</head>\n"
        html += u"<body>\n"
        html += u"<div id=\"main\"> \n"     
        html += u"<form method=\"post\" action=\"\" "
        html += u"id=\"contentForm\" >"  

        # package not needed for the preferences, only for rich-text fields:
        this_package = None
        html += common.formField('select', this_package, _(u"Select Language"),
                                 'locale',
                                 options = self.localeNames,
                                 selection = self.config.locale)

        internal_anchor_options = [(_(u"Enable All Internal Linking"), "enable_all"),
                                   (_(u"Disable Auto-Top Internal Linking"), "disable_autotop"),
                                   (_(u"Disable All Internal Linking"), "disable_all")]
        html += common.formField('select', this_package, _(u"Internal Linking (for Web Site Exports only)"),
                                 'internalAnchors', 
                                 '', # TODO: Instructions
                                 options = internal_anchor_options,
                                 selection = self.config.internalAnchors)

        html += u"<div id=\"editorButtons\"> \n"     
        html += u"<br/>" 
        html += common.button("ok", _("OK"), enabled=True,
                _class="button",
                onClick="setLocaleAndAnchors(document.forms.contentForm.locale.value,"
                    "document.forms.contentForm.internalAnchors.value)")
        html += common.button("cancel", _("Cancel"), enabled=True,
                _class="button", onClick="parent.Ext.getCmp('preferenceswin').close()")
        html += u"</div>\n"
        html += u"</div>\n"
        html += u"<br/></form>\n"
        html += u"</body>\n"
        html += u"</html>\n"
        return html.encode('utf8')


    def render_POST(self, request):
        """
        function replaced by nevow_clientToServerEvent to avoid POST message
        """
        log.debug("render_POST " + repr(request.args))
        
        # should not be invoked, but if it is... refresh
        html  = common.docType()
        html += u"<html xmlns=\"http://www.w3.org/1999/xhtml\">\n"
        html += u"<head></head>\n"
        html += u"<body onload=\"opener.location.reload(); "
        html += u"self.close();\"></body>\n"
        html += u"</html>\n"
        return html.encode('utf8')

    def getSelectedLanguage(self):
        """
        It would be the TinyMCE lang
        """
        return self.config.locale
		