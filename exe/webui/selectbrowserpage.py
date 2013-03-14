"""
JR: SelectBrowserPage selecciona el navegador en el que se ejecutara eXe
"""

import logging
from twisted.web.resource      import Resource
from exe.webui                 import common
from exe.webui.renderable      import RenderableResource
import mywebbrowser

log = logging.getLogger(__name__)

class SelectBrowserPage(RenderableResource):
    """
    SelectBrowserPage selecciona el navegador en el que se ejecutara eXe
    """
    name = 'selectbrowser'
    browsersHidden = ('xdg-open', 'gvfs-open', 'x-www-browser', 'gnome-open', 'kfmclient', 'www-browser', 'links', 
                     'elinks', 'lynx', 'w3m', 'windows-default', 'macosx')
    browserNames = {
                    mywebbrowser.get_iexplorer(): "Internet Explorer",
                    "safari": "Safari",
                    "opera": "Opera",
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
                    "None": "default"
                    }
    browsersAvalaibles = []

    def __init__(self, parent):
        """
        Initialize
        """
        RenderableResource.__init__(self, parent)
        
        #print(mywebbrowser._tryorder)
        for browser in mywebbrowser._tryorder:
            if (browser not in self.browsersHidden):
                self.browsersAvalaibles.append((self.browserNames[browser], browser))
        self.browsersAvalaibles.sort()
        self.browsersAvalaibles.append((_(u"Default browser in your system"), "None"))

        
    def getChild(self, name, request):
        """
        Try and find the child for the name given
        """
        if name == "":
            return self
        else:
            return Resource.getChild(self, name, request)


    def render_GET(self, request):
        """Render the select brownse"""
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
            function setBrowser(browser) {
                parent.nevow_clientToServerEvent('setBrowser', this, '', browser)
                parent.Ext.getCmp('browserwin').close()
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

        this_package = None
        if (self.config.browser.name in self.browserNames):
            browserSelected = self.config.browser.name
        else:
            browserSelected = "None"
        html += common.formField('select', this_package, _(u"Browsers installed in your system"),
                                 'browser',
                                 options = self.browsersAvalaibles,
                                 selection = browserSelected)
        html += u"<div id=\"editorButtons\"> \n"     
        html += u"<br/>" 
        html += common.button("ok", _("OK"), enabled=True,
                _class="button",
                onClick="setBrowser(document.forms.contentForm.browser.value)")
        html += common.button("cancel", _("Cancel"), enabled=True,
                _class="button", onClick="parent.Ext.getCmp('browserwin').close()")
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
		