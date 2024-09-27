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
from urllib.parse                    import quote

log = logging.getLogger(__name__)


class XliffImportPreferencesPage(RenderableResource):
    name = 'xliffimportpreferences'

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
        html += "<html xmlns=\"http://www.w3.org/1999/xhtml\">\n"
        html += "<head>\n"
        html += "<style type=\"text/css\">\n"
        html += "@import url(/css/exe.css);\n"
        html += '@import url(/style/base.css);\n'
        html += "@import url(/style/standardwhite/content.css);</style>\n"
        html += '<script type="text/javascript" src="/scripts/common.js">'
        html += '</script>\n'
        html += '''<script language="javascript" type="text/javascript">
            function importXliff(from_source) {
                parent.nevow_clientToServerEvent('mergeXliffPackage', this, '', '%s', from_source);
                parent.Ext.getCmp("xliffimportwin").close();
            }
        </script>''' % quote(request.args['path'][0])
        html += "<title>"+_("eXe : elearning XHTML editor")+"</title>\n"
        html += "<meta http-equiv=\"content-type\" content=\"text/html; "
        html += " charset=UTF-8\"></meta>\n";
        html += "</head>\n"
        html += "<body>\n"
        html += "<div id=\"main\"> \n"
        html += "<p>&nbsp;</p>\n"
        html += "<form method=\"post\" action=\"\" "
        html += "id=\"contentForm\" >"

        # package not needed for the preferences, only for rich-text fields:
        this_package = None
        html += common.formField('checkbox', this_package, _("Import from source language"),
                                 'from_source',
                                 name = 'from_source',
                                 checked = False,
                                 title = None,
                                 instruction = _("If you choose this option, \
the import process will take the texts from source language instead of target \
language."))

        html += "<div id=\"editorButtons\"> \n"
        html += "<br/>" 
        html += common.button("ok", _("OK"), enabled=True,
                _class="button",
                onClick="importXliff(document.forms.contentForm.from_source.checked \
                )")
        html += common.button("cancel", _("Cancel"), enabled=True,
                _class="button", onClick="parent.Ext.getCmp('xliffimportwin').close()")
        html += "</div>\n"
        html += "</div>\n"
        html += "<br/></form>\n"
        html += "</body>\n"
        html += "</html>\n"
        return html.encode('utf8')


    def render_POST(self, request):
        """
        function replaced by nevow_clientToServerEvent to avoid POST message
        """
        log.debug("render_POST " + repr(request.args))
        
        # should not be invoked, but if it is... refresh
        html  = common.docType()
        html += "<html xmlns=\"http://www.w3.org/1999/xhtml\">\n"
        html += "<head></head>\n"
        html += "<body onload=\"opener.location.reload(); "
        html += "self.close();\"></body>\n"
        html += "</html>\n"
        return html.encode('utf8')
