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
        """
        Initialize
        'parent' is our MainPage instance that created us
        """
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
        if ("action" in request.args and 
            request.args["action"][0] == u"saveChange"):
            log.debug(u"process savachange:::::")
            self.package.save()
            log.debug(u"package name: " + self.package.name)
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
                os.remove(os.path.join(root, name))

        log.debug(u"After authoringPage process" + repr(request.args))

    def render_GET(self, request=None):
        """
        Returns an XHTML string for viewing this page
        if 'request' is not passed, will generate psedo/debug html
        """
        log.debug(u"render_GET "+repr(request))

        if request is not None:
            # Process args
            for key, value in request.args.items():
                request.args[key] = [unicode(value[0], 'utf8')]
            self._process(request)

        topNode     = self.package.currentNode
        self.blocks = []
        self.__addBlocks(topNode)
        html  = self.__renderHeader()
        html += u'<body onload="onLoadHandler();">\n'
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
        html += u'<!-- start authoring page -->\n'
        html += u'<div id="nodeDecoration">\n'
        html += u'<p id="nodeTitle">\n'
        html += escape(topNode.titleLong)
        html += u'</p>\n'
        html += u'</div>\n'

        for block in self.blocks:
            html += block.render(self.package.style)

        html += u'</div>\n'
        html += common.footer()

        html = html.encode('utf8')
        return html

    render_POST = render_GET


    def __renderHeader(self):
        """Generates the header for AuthoringPage"""
        html  = common.docType()
        html += u'<html xmlns="http://www.w3.org/1999/xhtml">\n'
        html += u'<head>\n'
        html += u'<style type="text/css">\n'
        html += u'@import url(/css/exe.css);\n'
        html += u'@import url(/style/base.css);\n'
        html += u'@import url(/style/%s/content.css);\n' % self.package.style
        html += u'</style>\n'
        html += u'<script type="text/javascript" src="/scripts/common.js">'
        html += u'</script>\n'
        html += u'<script type="text/javascript" '
        html += u'src="/scripts/tinymce/jscripts/tiny_mce/tiny_mce.js">'
        html += u'</script>\n'
        html += u'<script type="text/javascript">\n'
        html += u'<!--\n'
        html += u"tinyMCE.init({   " 
#        html += u"content_css : \"/css/extra.css\", \n"
	html += u"content_css : \"../../../../style/FPD-MEDU/content.css\", \n"
        html += u"valid_elements : \"*[*]\",\n"
        html += u"verify_html : false, \n"
        html += u"apply_source_formatting : true, \n"
        ###########
        # testing TinyMCE's escaping/quoting of HTML:
        html += u"cleanup_on_startup : false, \n"
        #html += u"cleanup : false, \n"
        html += u"entity_encoding : \"raw\", \n"
        #############
        html += u"gecko_spellcheck : true, \n"
        html += u" mode : \"textareas\",\n"
        html += u" editor_selector : \"mceEditor\",\n"
#JR        html += u" plugins : \"table,save,advhr,advimage,advlink,emotions,media,"
	#html += u" contextmenu,paste,directionality,exemath\",\n"
        html += u" plugins : \"style,layer,table,save,advhr,advimage,advlink,emotions,iespell,insertdatetime,preview,media,searchreplace,"
        html += u" print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template,exemath\",\n"       
        html += u" theme : \"advanced\",\n"
        html += u" theme_advanced_layout_manager : \"SimpleLayout\",\n"
        html += u"theme_advanced_toolbar_location : \"top\",\n"  
        html += u" theme_advanced_buttons1 : \"newdocument,separator,"
        html += u"bold,italic,underline,fontsizeselect,forecolor,"
        html += u"backcolor,separator,sub,sup,separator,"
        html += u"justifyleft,justifycenter,justifyright,justifyfull,"
        html += u"separator,bullist,numlist,outdent,indent,separator,"
        html += u"anchor,separator,charmap,code,removeformat\",\n"
        html += u" theme_advanced_buttons2 : \"image,media,exemath,advhr,"
        html += u"fontselect,tablecontrols,separator,link,unlink,separator,"
        html += u" undo,redo\",\n"
        #html += u" theme_advanced_buttons3 : \"\",\n"
        #JR
        html += u" theme_advanced_buttons3 : \"insertlayer,moveforward,movebackward,absolute,|,styleprops,|,formatselect,codigo,glosario,idioma,cite,abbr,acronym,attribs,|,visualchars,nonbreaking,template,separator,cut,copy,paste,pastetext,pasteword,help\",\n"
        
        
       
        # the image-handling callback function for tinyMCE's image button:
        html += u"advimage_image_browser_callback : \"chooseImage_viaTinyMCE\",\n"
        # and manually entered filenames as well, via image2insert w/o file browser:
        html += u"advimage_image2insert_browser_callback : \"chooseImage_viaTinyMCE\",\n"
        # the media-handling callback function for tinyMCE's media button:
        html += u"media_media_browser_callback : \"chooseImage_viaTinyMCE\",\n"
        # and manually entered filenames as well, via media2insert w/o file browser:
        html += u"media_media2insert_browser_callback : \"chooseImage_viaTinyMCE\",\n"

        # the link-handling callback function for tinyMCE's media button:
        html += u"advlink_file_browser_callback : \"chooseImage_viaTinyMCE\",\n"
        # and manually entered filenames as well, via media2insert w/o file browser:
        html += u"advlink_file2insert_browser_callback : \"chooseImage_viaTinyMCE\",\n"

        # and the callback to generate exemath's LaTeX images via mimetex:
        html += u"exemath_image_browser_callback : \"makeMathImage_viaTinyMCE\",\n"

        # to override any browser plugin checks, and allow media to be added:
        if G.application.config.assumeMediaPlugins: 
            html += u"exe_assume_media_plugins : true,\n"

	# JR: Ajustes necesarios para FPaD
	html += u"language : \"es\",\n"
	html += u"inline_styles : true,\n"
	html += u"verify_html : true, \n"
#	html += u"relative_urls : false, \n"
	html += u"convert_urls : false, \n"
	html += u"accessibility_warnings : true, \n"
	html += u"convert_fonts_to_spans : true, \n"
	html += u"convert_newlines_to_brs : false, \n"
	html += u"element_format : \"xhtml\", \n"
	html += u"fix_list_elements : false, \n"
	html += u"force_p_newlines : true, \n"
#	html += u"forced_root_block : 'p', \n"
	html += u"apply_source_formatting : true, \n"
#	html += u"valid_elements : \"[strong/b,em/i]\",\n"
#	html += u"visual_table_class: \"tabla\", \n"
	html += u"inline_styles : true,\n"
	html += u"theme_advanced_blockformats : \"p,blockquote,div,h1,h2,h3,h4,h5,h6\", \n"
	html += u" valid_elements : \""
	html += "a[accesskey|charset|class|coords|dir<ltr?rtl|href|hreflang|id|lang|name"
  	html += "|onblur|onclick|ondblclick|onfocus|onkeydown|onkeypress|onkeyup"
  	html += "|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|rel|rev"
  	html += "|shape<circle?default?poly?rect|style|tabindex|title|target|type],"
	html += "abbr[class|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown|onkeypress"
  	html += "|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|style"
  	html += "|title],"
	html += "acronym[class|dir<ltr?rtl|id|id|lang|onclick|ondblclick|onkeydown|onkeypress"
  	html += "|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|style"
  	html += "|title],"
	html += "address[class|align|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown"
  	html += "|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover"
  	html += "|onmouseup|style|title],"
	html += "applet[align<bottom?left?middle?right?top|alt|archive|class|code|codebase"
  	html += "|height|hspace|id|name|object|style|title|vspace|width],"
	html += "area[accesskey|alt|class|coords|dir<ltr?rtl|href|id|lang|nohref<nohref"
  	html += "|onblur|onclick|ondblclick|onfocus|onkeydown|onkeypress|onkeyup"
  	html += "|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup"
  	html += "|shape<circle?default?poly?rect|style|tabindex|title|target],"
	html += "base[href|target],"
	html += "basefont[color|face|id|size],"
	html += "bdo[class|dir<ltr?rtl|id|lang|style|title],"
	html += "big[class|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown|onkeypress"
  	html += "|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|style"
  	html += "|title],"
	html += "blockquote[cite|class|dir<ltr?rtl|id|lang|onclick|ondblclick"
  	html += "|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout"
  	html += "|onmouseover|onmouseup|style|title],"
	html += "body[alink|background|bgcolor|class|dir<ltr?rtl|id|lang|link|onclick"
  	html += "|ondblclick|onkeydown|onkeypress|onkeyup|onload|onmousedown|onmousemove"
  	html += "|onmouseout|onmouseover|onmouseup|onunload|style|title|text|vlink],"
	html += "br[class|clear<all?left?none?right|id|style|title],"
	html += "button[accesskey|class|dir<ltr?rtl|disabled<disabled|id|lang|name|onblur"
  	html += "|onclick|ondblclick|onfocus|onkeydown|onkeypress|onkeyup|onmousedown"
  	html += "|onmousemove|onmouseout|onmouseover|onmouseup|style|tabindex|title|type"
  	html += "|value],"
	html += "caption[align<bottom?left?right?top|class|dir<ltr?rtl|id|lang|onclick"
  	html += "|ondblclick|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove"
  	html += "|onmouseout|onmouseover|onmouseup|style|title],"
	html += "center[class|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown|onkeypress"
  	html += "|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|style"
  	html += "|title],"
	html += "cite[class|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown|onkeypress"
  	html += "|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|style"
  	html += "|title],"
	html += "code[class|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown|onkeypress"
  	html += "|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|style"
  	html += "|title],"
	html += "col[align<center?char?justify?left?right|char|charoff|class|dir<ltr?rtl|id"
  	html += "|lang|onclick|ondblclick|onkeydown|onkeypress|onkeyup|onmousedown"
  	html += "|onmousemove|onmouseout|onmouseover|onmouseup|span|style|title"
  	html += "|valign<baseline?bottom?middle?top|width],"
	html += "colgroup[align<center?char?justify?left?right|char|charoff|class|dir<ltr?rtl"
  	html += "|id|lang|onclick|ondblclick|onkeydown|onkeypress|onkeyup|onmousedown"
  	html += "|onmousemove|onmouseout|onmouseover|onmouseup|span|style|title"
  	html += "|valign<baseline?bottom?middle?top|width],"
	html += "dd[class|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown|onkeypress|onkeyup"
  	html += "|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|style|title],"
	html += "del[cite|class|datetime|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown"
  	html += "|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover"
  	html += "|onmouseup|style|title],"
	html += "dfn[class|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown|onkeypress"
  	html += "|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|style"
  	html += "|title],"
	html += "dir[class|compact<compact|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown"
  	html += "|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover"
  	html += "|onmouseup|style|title],"
	html += "div[align<center?justify?left?right|class|dir<ltr?rtl|id|lang|onclick"
  	html += "|ondblclick|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove"
  	html += "|onmouseout|onmouseover|onmouseup|style|title],"
	html += "dl[class|compact<compact|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown"
  	html += "|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover"
  	html += "|onmouseup|style|title],"
	html += "dt[class|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown|onkeypress|onkeyup"
  	html += "|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|style|title],"
	html += "em/i[class|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown|onkeypress"
  	html += "|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|style"
  	html += "|title],"
	html += "fieldset[class|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown|onkeypress"
  	html += "|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|style"
  	html += "|title],"
	html += "font[class|color|dir<ltr?rtl|face|id|lang|size|style|title],"
	html += "form[accept|accept-charset|action|class|dir<ltr?rtl|enctype|id|lang"
  	html += "|method<get?post|name|onclick|ondblclick|onkeydown|onkeypress|onkeyup"
  	html += "|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|onreset|onsubmit"
  	html += "|style|title|target],"
	html += "frame[class|frameborder|id|longdesc|marginheight|marginwidth|name"
  	html += "|noresize<noresize|scrolling<auto?no?yes|src|style|title],"
	html += "frameset[class|cols|id|onload|onunload|rows|style|title],"
	html += "h1[align<center?justify?left?right|class|dir<ltr?rtl|id|lang|onclick"
  	html += "|ondblclick|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove"
  	html += "|onmouseout|onmouseover|onmouseup|style|title],"
	html += "h2[align<center?justify?left?right|class|dir<ltr?rtl|id|lang|onclick"
  	html += "|ondblclick|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove"
  	html += "|onmouseout|onmouseover|onmouseup|style|title],"
	html += "h3[align<center?justify?left?right|class|dir<ltr?rtl|id|lang|onclick"
  	html += "|ondblclick|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove"
  	html += "|onmouseout|onmouseover|onmouseup|style|title],"
	html += "h4[align<center?justify?left?right|class|dir<ltr?rtl|id|lang|onclick"
  	html += "|ondblclick|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove"
  	html += "|onmouseout|onmouseover|onmouseup|style|title],"
	html += "h5[align<center?justify?left?right|class|dir<ltr?rtl|id|lang|onclick"
  	html += "|ondblclick|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove"
  	html += "|onmouseout|onmouseover|onmouseup|style|title],"
	html += "h6[align<center?justify?left?right|class|dir<ltr?rtl|id|lang|onclick"
  	html += "|ondblclick|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove"
  	html += "|onmouseout|onmouseover|onmouseup|style|title],"
	html += "head[dir<ltr?rtl|lang|profile],"
	html += "hr[align<center?left?right|class|dir<ltr?rtl|id|lang|noshade<noshade|onclick"
  	html += "|ondblclick|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove"
  	html += "|onmouseout|onmouseover|onmouseup|size|style|title|width],"
	html += "html[dir<ltr?rtl|lang|version],"
	html += "iframe[align<bottom?left?middle?right?top|class|frameborder|height|id"
  	html += "|longdesc|marginheight|marginwidth|name|scrolling<auto?no?yes|src|style"
  	html += "|title|width],"
	html += "img[align<bottom?left?middle?right?top|alt|border|class|dir<ltr?rtl|height"
  	html += "|hspace|id|ismap<ismap|lang|longdesc|name|onclick|ondblclick|onkeydown"
  	html += "|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover"
  	html += "|onmouseup|src|style|title|usemap|vspace|width|exe_math_latex|exe_math_size],"
	html += "input[accept|accesskey|align<bottom?left?middle?right?top|alt"
  	html += "|checked<checked|class|dir<ltr?rtl|disabled<disabled|id|ismap<ismap|lang"
  	html += "|maxlength|name|onblur|onclick|ondblclick|onfocus|onkeydown|onkeypress"
  	html += "|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|onselect"
  	html += "|readonly<readonly|size|src|style|tabindex|title"
  	html += "|type<button?checkbox?file?hidden?image?password?radio?reset?submit?text"
  	html += "|usemap|value],"
	html += "ins[cite|class|datetime|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown"
  	html += "|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover"
  	html += "|onmouseup|style|title],"
	html += "isindex[class|dir<ltr?rtl|id|lang|prompt|style|title],"
	html += "kbd[class|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown|onkeypress"
  	html += "|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|style"
  	html += "|title],"
	html += "label[accesskey|class|dir<ltr?rtl|for|id|lang|onblur|onclick|ondblclick"
  	html += "|onfocus|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout"
  	html += "|onmouseover|onmouseup|style|title],"
	html += "legend[align<bottom?left?right?top|accesskey|class|dir<ltr?rtl|id|lang"
  	html += "|onclick|ondblclick|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove"
  	html += "|onmouseout|onmouseover|onmouseup|style|title],"
	html += "li[class|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown|onkeypress|onkeyup"
  	html += "|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|style|title|type"
  	html += "|value],"
	html += "link[charset|class|dir<ltr?rtl|href|hreflang|id|lang|media|onclick"
  	html += "|ondblclick|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove"
  	html += "|onmouseout|onmouseover|onmouseup|rel|rev|style|title|target|type],"
	html += "map[class|dir<ltr?rtl|id|lang|name|onclick|ondblclick|onkeydown|onkeypress"
  	html += "|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|style"
  	html += "|title],"
	html += "menu[class|compact<compact|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown"
  	html += "|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover"
  	html += "|onmouseup|style|title],"
	html += "meta[content|dir<ltr?rtl|http-equiv|lang|name|scheme],"
	html += "noframes[class|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown|onkeypress"
  	html += "|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|style"
  	html += "|title],"
	html += "noscript[class|dir<ltr?rtl|id|lang|style|title],"
	html += "object[align<bottom?left?middle?right?top|archive|border|class|classid"
  	html += "|codebase|codetype|data|declare|dir<ltr?rtl|height|hspace|id|lang|name"
  	html += "|onclick|ondblclick|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove"
  	html += "|onmouseout|onmouseover|onmouseup|standby|style|tabindex|title|type|usemap"
  	html += "|vspace|width],"
	html += "ol[class|compact<compact|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown"
  	html += "|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover"
  	html += "|onmouseup|start|style|title|type],"
	html += "optgroup[class|dir<ltr?rtl|disabled<disabled|id|label|lang|onclick"
  	html += "|ondblclick|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove"
  	html += "|onmouseout|onmouseover|onmouseup|style|title],"
	html += "option[class|dir<ltr?rtl|disabled<disabled|id|label|lang|onclick|ondblclick"
  	html += "|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout"
  	html += "|onmouseover|onmouseup|selected<selected|style|title|value],"
	html += "p[align<center?justify?left?right|class|dir<ltr?rtl|id|lang|onclick"
  	html += "|ondblclick|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove"
  	html += "|onmouseout|onmouseover|onmouseup|style|title],"
	html += "param[id|name|type|value|valuetype<DATA?OBJECT?REF],"
	html += "pre/listing/plaintext/xmp[align|class|dir<ltr?rtl|id|lang|onclick|ondblclick"
  	html += "|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout"
  	html += "|onmouseover|onmouseup|style|title|width],"
	html += "q[cite|class|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown|onkeypress"
  	html += "|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|style"
  	html += "|title],"
	html += "s[class|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown|onkeypress|onkeyup"
  	html += "|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|style|title],"
	html += "samp[class|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown|onkeypress"
  	html += "|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|style"
  	html += "|title],"
	html += "script[charset|defer|language|src|type],"
	html += "select[class|dir<ltr?rtl|disabled<disabled|id|lang|multiple<multiple|name"
  	html += "|onblur|onchange|onclick|ondblclick|onfocus|onkeydown|onkeypress|onkeyup"
  	html += "|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|size|style"
  	html += "|tabindex|title],"
	html += "small[class|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown|onkeypress"
  	html += "|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|style"
  	html += "|title],"
	html += "span[align<center?justify?left?right|class|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown"
  	html += "|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover"
  	html += "|onmouseup|style|title],"
	html += "strike[class|class|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown"
  	html += "|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover"
  	html += "|onmouseup|style|title],"
	html += "strong/b[class|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown|onkeypress"
  	html += "|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|style"
  	html += "|title],"
	html += "style[dir<ltr?rtl|lang|media|title|type],"
	html += "sub[class|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown|onkeypress"
  	html += "|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|style"
  	html += "|title],"
	html += "sup[class|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown|onkeypress"
  	html += "|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|style"
  	html += "|title],"
	html += "table[align<center?left?right|bgcolor|border|cellpadding|cellspacing|class"
  	html += "|dir<ltr?rtl|frame|height|id|lang|onclick|ondblclick|onkeydown|onkeypress"
  	html += "|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|rules"
  	html += "|style|summary|title|width],"
	html += "tbody[align<center?char?justify?left?right|char|class|charoff|dir<ltr?rtl|id"
  	html += "|lang|onclick|ondblclick|onkeydown|onkeypress|onkeyup|onmousedown"
  	html += "|onmousemove|onmouseout|onmouseover|onmouseup|style|title"
  	html += "|valign<baseline?bottom?middle?top],"
	html += "td[abbr|align<center?char?justify?left?right|axis|bgcolor|char|charoff|class"
  	html += "|colspan|dir<ltr?rtl|headers|height|id|lang|nowrap<nowrap|onclick"
  	html += "|ondblclick|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove"
  	html += "|onmouseout|onmouseover|onmouseup|rowspan|scope<col?colgroup?row?rowgroup"
  	html += "|style|title|valign<baseline?bottom?middle?top|width],"
	html += "textarea[accesskey|class|cols|dir<ltr?rtl|disabled<disabled|id|lang|name"
  	html += "|onblur|onclick|ondblclick|onfocus|onkeydown|onkeypress|onkeyup"
  	html += "|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|onselect"
  	html += "|readonly<readonly|rows|style|tabindex|title],"
	html += "tfoot[align<center?char?justify?left?right|char|charoff|class|dir<ltr?rtl|id"
  	html += "|lang|onclick|ondblclick|onkeydown|onkeypress|onkeyup|onmousedown"
  	html += "|onmousemove|onmouseout|onmouseover|onmouseup|style|title"
  	html += "|valign<baseline?bottom?middle?top],"
	html += "th[abbr|align<center?char?justify?left?right|axis|bgcolor|char|charoff|class"
  	html += "|colspan|dir<ltr?rtl|headers|height|id|lang|nowrap<nowrap|onclick"
  	html += "|ondblclick|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove"
  	html += "|onmouseout|onmouseover|onmouseup|rowspan|scope<col?colgroup?row?rowgroup"
  	html += "|style|title|valign<baseline?bottom?middle?top|width],"
	html += "thead[align<center?char?justify?left?right|char|charoff|class|dir<ltr?rtl|id"
  	html += "|lang|onclick|ondblclick|onkeydown|onkeypress|onkeyup|onmousedown"
  	html += "|onmousemove|onmouseout|onmouseover|onmouseup|style|title"
  	html += "|valign<baseline?bottom?middle?top],"
	html += "title[dir<ltr?rtl|lang],"
	html += "tr[abbr|align<center?char?justify?left?right|bgcolor|char|charoff|class"
  	html += "|rowspan|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown|onkeypress"
  	html += "|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|style"
  	html += "|title|valign<baseline?bottom?middle?top],"
	html += "tt[class|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown|onkeypress|onkeyup"
  	html += "|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|style|title],"
	html += "u[class|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown|onkeypress|onkeyup"
  	html += "|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|style|title],"
	html += "ul[class|compact<compact|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown"
  	html += "|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover"
  	html += "|onmouseup|style|title|type],"
	html += "var[class|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown|onkeypress"
  	html += "|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|style"
  	html += "|title]\",\n"
  	
        html += u"theme_advanced_statusbar_location : \"bottom\",\n"
        html += u"    theme_advanced_resize_horizontal : false,\n"
        html += u"    theme_advanced_resizing : true\n"
        html += u" });\n"
        html += u"//-->\n"
        html += u"</script>\n"
        html += u'<script type="text/javascript" src="/scripts/libot_drag.js">'
        html += u'</script>\n'
        html += u'<title>"+_("eXe : elearning XHTML editor")+"</title>\n'
        html += u'<meta http-equiv="content-type" content="text/html; '
        html += u' charset=UTF-8" />\n'
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
