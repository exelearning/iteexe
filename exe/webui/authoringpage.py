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
AuthoringPage is responsible for creating the XHTML for the authoring
area of the eXe web user interface.  
"""
import os
import logging
import time
import exceptions
import sys
from twisted.web.resource    import Resource
from exe.webui               import common
from cgi                     import escape
import exe.webui.builtinblocks
from exe.webui.blockfactory  import g_blockFactory
from exe.engine.error        import Error
from exe.webui.renderable    import RenderableResource
from exe.engine.path         import Path
from exe                     import globals as G

log = logging.getLogger(__name__)

# ===========================================================================
class AuthoringPage(RenderableResource):
    """
    AuthoringPage is responsible for creating the XHTML for the authoring
    area of the eXe web user interface.  
    """
    name = u'authoring'

    def __init__(self, parent):
        RenderableResource.__init__(self, parent)
        self.blocks  = []

    def getChild(self, name, request):
        """
        Try and find the child for the name given
        """
        if name == "":
            return self
        else:
            return Resource.getChild(self, name, request)


    def _process(self, request):
        """
        Delegates processing of args to blocks
        """  
        # Still need to call parent (mainpage.py) process
        # because the idevice pane needs to know that new idevices have been
        # added/edited..
        self.parent.process(request)
        for block in self.blocks:
            block.process(request)
        # now that each block and corresponding elements have been processed,
        # it's finally safe to remove any images/etc which made it into 
        # tinyMCE's previews directory, as they have now had their 
        # corresponding resources created:
        webDir     = Path(G.application.tempWebDir) 
        previewDir  = webDir.joinpath('previews')
        for root, dirs, files in os.walk(previewDir, topdown=False): 
            for name in files:
                if sys.platform[:3] == "win":
                    for i in range(3):
                        try:
                            os.remove(os.path.join(root, name))
                            break
                        except exceptions.WindowsError:
                            time.sleep(0.3)
                else:
                    os.remove(os.path.join(root, name))
        topNode = self.package.currentNode
        if "action" in request.args:
            if request.args["action"][0] == u"changeNode":
                topNode = self.package.findNode(request.args["object"][0])
            elif "currentNode" in request.args:
                topNode = self.package.findNode(request.args["currentNode"][0])
        elif "currentNode" in request.args:
            topNode = self.package.findNode(request.args["currentNode"][0])

        log.debug(u"After authoringPage process" + repr(request.args))
        return topNode

    def render_GET(self, request=None):
        """
        Returns an XHTML string for viewing this page
        if 'request' is not passed, will generate psedo/debug html
        """
        log.debug(u"render_GET "+repr(request))

        topNode = self.package.root
        if request is not None:
            # Process args
            for key, value in request.args.items():
                request.args[key] = [unicode(value[0], 'utf8')]
            topNode = self._process(request)

        #Update other authoring pages that observes the current package
        if "action" in request.args:
            if request.args['clientHandleId'][0] == "":
                raise(Exception("Not clientHandleId defined"))
            activeClient = None
            for client in self.parent.clientHandleFactory.clientHandles.values():
                if request.args['clientHandleId'][0] != client.handleId:
                    if client.handleId in self.parent.authoringPages:
                        destNode = None
                        if request.args["action"][0] == "move":
                            destNode = request.args["move" + request.args["object"][0]][0]
                        client.call('eXe.app.getController("MainTab").updateAuthoring', request.args["action"][0], \
                            request.args["object"][0], request.args["isChanged"][0], request.args["currentNode"][0], destNode)
                else:
                    activeClient = client

            if request.args["action"][0] == "done":
                if activeClient:
                    return "<body onload='location.replace(\"" + request.path + "?clientHandleId=" + activeClient.handleId + "\")'/>"
                else:
                    log.error("No active client")

        self.blocks = []
        self.__addBlocks(topNode)
        html  = self.__renderHeader()
        html += u'<body onload="onLoadHandler();" class="exe-authoring-page js">\n'
        html += u"<form method=\"post\" "

        if request is None:
            html += u'action="NO_ACTION"'
        else:
            html += u"action=\""+request.path+"#currentBlock\""
        html += u" id=\"contentForm\">"
        html += u'<div id="main">\n'
        html += common.hiddenField(u"action")
        html += common.hiddenField(u"object")
        html += common.hiddenField(u"isChanged", u"0")
        html += common.hiddenField(u"currentNode", unicode(topNode.id))
        html += common.hiddenField(u'clientHandleId', request.args['clientHandleId'][0])
        html += u'<!-- start authoring page -->\n'
        html += u'<div id="nodeDecoration">\n'
        html += u'<div id="headerContent">\n'
        html += u'<h1 id="nodeTitle">\n'
        html += escape(topNode.titleLong)
        html += u'</h1>\n'
        html += u'</div>\n'
        html += u'</div>\n'

        for block in self.blocks:
            html += block.render(self.package.style)

        html += u'</div>'
        style = G.application.config.styleStore.getStyle(self.package.style)
        
        html += common.renderLicense(self.package.license,"authoring")
        html += common.renderFooter(self.package.footer)
        
        if style.hasValidConfig:
            html += style.get_edition_extra_body()
        html += '<script type="text/javascript">$exeAuthoring.ready()</script>\n'
        html += common.footer()

        html = html.encode('utf8')
        return html

    render_POST = render_GET


    def __renderHeader(self):
		#TinyMCE lang (user preference)
        myPreferencesPage = self.webServer.preferences
        
        """Generates the header for AuthoringPage"""
        html  = common.docType()
        #################################################################################
        #################################################################################
        
        html += u'<html xmlns="http://www.w3.org/1999/xhtml" lang="'+myPreferencesPage.getSelectedLanguage()+'">\n'
        html += u'<head>\n'
        html += u"<link rel=\"stylesheet\" type=\"text/css\" href=\"/css/exe.css\" />"
        
        # Use the Style's base.css file if it exists
        themePath = Path(G.application.config.stylesDir/self.package.style)
        themeBaseCSS = themePath.joinpath("base.css")
        if themeBaseCSS.exists():
            html += u"<link rel=\"stylesheet\" type=\"text/css\" href=\"/style/%s/base.css\" />" % self.package.style
        else:
            html += u"<link rel=\"stylesheet\" type=\"text/css\" href=\"/style/base.css\" />"
            
        html += u"<link rel=\"stylesheet\" type=\"text/css\" href=\"/css/exe_wikipedia.css\" />"
        html += u"<link rel=\"stylesheet\" type=\"text/css\" href=\"/scripts/exe_effects/exe_effects.css\" />"
        html += u"<link rel=\"stylesheet\" type=\"text/css\" href=\"/scripts/exe_highlighter/exe_highlighter.css\" />"
        html += u"<link rel=\"stylesheet\" type=\"text/css\" href=\"/scripts/exe_games/exe_games.css\" />"
        html += u"<link rel=\"stylesheet\" type=\"text/css\" href=\"/scripts/tinymce_4/js/tinymce/plugins/abcmusic/export/exe_abcmusic.css\" />" #93 (to do)
        html += u"<link rel=\"stylesheet\" type=\"text/css\" href=\"/style/%s/content.css\" />" % self.package.style
        if G.application.config.assumeMediaPlugins: 
            html += u"<script type=\"text/javascript\">var exe_assume_media_plugins = true;</script>\n"
        #JR: anado una variable con el estilo
        estilo = u'/style/%s/content.css' % self.package.style
        html += common.getJavaScriptStrings()
        # The games require additional strings
        html += common.getGamesJavaScriptStrings()
        html += u"<script type=\"text/javascript\">"
        html += u"var exe_style = '%s';top.exe_style = exe_style;" % estilo
        # editorpane.py uses exe_style_dirname to auto-select the current style (just a provisional solution)
        html += u"var exe_style_dirname = '%s'; top.exe_style_dirname = exe_style_dirname;" % self.package.style
        html += u"var exe_package_name='"+self.package.name+"';"
        html += 'var exe_export_format="'+common.getExportDocType()+'".toLowerCase();'
        html += 'var exe_editor_mode="'+myPreferencesPage.getEditorMode()+'";'
        html += 'var exe_editor_version="'+myPreferencesPage.getEditorVersion()+'";'
        html += '</script>\n'        
        html += u'<script type="text/javascript" src="../jsui/native.history.js"></script>\n'
        html += u'<script type="text/javascript" src="/scripts/authoring.js"></script>\n'
        html += u'<script type="text/javascript" src="/scripts/exe_jquery.js"></script>\n'
        html += u'<script type="text/javascript" src="/scripts/exe_lightbox/exe_lightbox.js"></script>\n'
        html += u'<script type="text/javascript" src="/scripts/exe_effects/exe_effects.js"></script>\n'
        html += u'<script type="text/javascript" src="/scripts/exe_highlighter/exe_highlighter.js"></script>\n'
        html += u'<script type="text/javascript" src="/scripts/exe_games/exe_games.js"></script>\n'
        html += u'<script type="text/javascript" src="/scripts/tinymce_4/js/tinymce/plugins/abcmusic/export/exe_abcmusic.js"></script>\n' #93 (to do)
        html += u'<script type="text/javascript" src="/scripts/common.js"></script>\n'
        html += '<script type="text/javascript">document.write(unescape("%3Cscript src=\'" + eXeLearning_settings.wysiwyg_path + "\' type=\'text/javascript\'%3E%3C/script%3E"));</script>';
        html += '<script type="text/javascript">document.write(unescape("%3Cscript src=\'" + eXeLearning_settings.wysiwyg_settings_path + "\' type=\'text/javascript\'%3E%3C/script%3E"));</script>';
        html += common.printJavaScriptIdevicesScripts('edition',self)
        html += u'<title>"+_("eXe : elearning XHTML editor")+"</title>\n'
        html += u'<meta http-equiv="content-type" content="text/html; '
        html += u' charset=UTF-8" />\n'
        style = G.application.config.styleStore.getStyle(self.package.style)
        if style.hasValidConfig:
            html += style.get_edition_extra_head()        
        html += u'</head>\n'
        return html


    def __addBlocks(self, node):
        """
        Add All the blocks for the currently selected node
        """
        for idevice in node.idevices:
            block = g_blockFactory.createBlock(self, idevice)
            if not block:
                log.critical(u"Unable to render iDevice.")
                raise Error(u"Unable to render iDevice.")
            self.blocks.append(block)

# ===========================================================================
