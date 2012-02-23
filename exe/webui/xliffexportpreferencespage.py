# -- coding: utf-8 --
# ===========================================================================
# eXe
# Copyright 2012, Pedro Peña Pérez, Open Phoenix IT
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
@author: Pedro Peña Pérez
"""

import logging
from twisted.web.resource      import Resource
from exe.webui                 import common
from exe.webui.renderable      import RenderableResource
from exe.engine.beautifulsoup import BeautifulSoup
from exe.engine.path import Path

log = logging.getLogger(__name__)


class XliffExportPreferencesPage(RenderableResource):
    name = 'xliffexportpreferences'

    def __init__(self, parent):
        """
        Initialize
        """
        RenderableResource.__init__(self, parent)

        #Extract source and target langs from dublincore.xul
        xul = Path(self.config.xulDir).joinpath('templates', 'dublincore.xul')
        bs = BeautifulSoup(xul.text())
        self.langs = bs.find(id="dc_language")
        self.updateLocaleNames()

    def updateLocaleNames(self):
        self.localeNames = []
        self.localeNames_lang = self.config.locale
        for tag in self.langs.menupopup:
            if hasattr(tag, "value") and hasattr(tag, "label"):
                localeName = tag["value"] + ": " + _(tag["label"])
                self.localeNames.append((localeName, tag["value"]))
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

        if self.localeNames_lang != self.config.locale:
            self.updateLocaleNames()

        # Rendering
        html  = common.docType()
        html += u"<html xmlns=\"http://www.w3.org/1999/xhtml\">\n"
        html += u"<head>\n"
        html += u"<style type=\"text/css\">\n"
        html += u"@import url(/css/exe.css);\n"
        html += u'@import url(/style/base.css);\n'
        html += u"@import url(/style/standardwhite/content.css);</style>\n"
        html += u'''<script language="javascript" type="text/javascript">
            function exportXliff(source, target, copy, cdata) {
                opener.nevow_clientToServerEvent('exportXliffPackage', this, '', '%s', source, target, copy, cdata);
                window.close();
            }
        </script>''' % request.args['path'][0]
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
        html += common.formField('select', this_package, _(u"Select source language"),
                                 'source',
                                 options = self.localeNames,
                                 selection = self.config.locale)

        html += common.formField('select', this_package, _(u"Select target language"),
                                 'target',
                                 options = self.localeNames,
                                 selection = 'eu')

        html += common.formField('checkbox', this_package, "",
                                 'copy',
                                 name = 'copy',
                                 checked = True,
                                 title = _(u"Copy source also in target"))

        html += common.formField('checkbox', this_package, "",
                                 'cdata',
                                 name = 'cdata',
                                 checked = False,
                                 title = _(u"Wrap fields in CDATA"))

        html += u"<div id=\"editorButtons\"> \n"
        html += u"<br/>" 
        html += common.button("ok", _("OK"), enabled=True,
                _class="button",
                onClick="exportXliff(document.forms.contentForm.source.value, \
                document.forms.contentForm.target.value, \
                document.forms.contentForm.copy.checked, \
                document.forms.contentForm.cdata.checked \
                )")
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
