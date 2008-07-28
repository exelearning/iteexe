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
        
        for locale, translation in self.config.locales.items():
            localeName  = locale + ": " 
            langName = translation.info().get('x-exe-language', None)
            if langName == None:
                langName = translation.info().get('x-poedit-language', 'English')
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
                opener.nevow_clientToServerEvent('setLocale', this, '', l)
                opener.nevow_clientToServerEvent('setInternalAnchors', this, '', anchors)
                window.close()
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
                _class="button", onClick="window.close()")
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
