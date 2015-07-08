# ===========================================================================
# eXe 
# Copyright 2004-2005, University of Auckland
# Copyright 2004-2008 eXe Project, http://eXeLearning.org/
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
This class transforms an eXe node into a page on a single page website
"""

import logging
import re
from cgi                      import escape
from urllib                   import quote
from exe.webui.blockfactory   import g_blockFactory
from exe.engine.error         import Error
from exe.engine.path          import Path
from exe.engine.version       import release
from exe.export.pages         import Page, uniquifyNames
from exe.webui                import common
from exe                      import globals as G

log = logging.getLogger(__name__)


# ===========================================================================
class SinglePage(Page):
    """
    This class transforms an eXe node into a page on a single page website
    """
        
    def save(self, filename, for_print=0):
        """
        Save page to a file.  
        'outputDir' is the directory where the filenames will be saved
        (a 'path' instance)
        """
        outfile = open(filename, "wb")
        outfile.write(self.render(self.node.package,for_print).encode('utf8'))
        outfile.close()
        
    def render(self, package, for_print=0):
        """
        Returns an XHTML string rendering this page.
        """
        dT = common.getExportDocType()
        lb = "\n" #Line breaks
        sectionTag = "div"
        headerTag = "div"
        if dT == "HTML5":
            sectionTag = "section"
            headerTag = "header"
            
        if package.title!='':
            title = escape(package.title)
        else:
            title = escape(package.root.titleLong)
        html  = self.renderHeader(title, for_print)
        if for_print:
            # include extra onload bit:
            html += u'<body class="exe-single-page" onload="print_page()">'
        else:
            html += u'<body class="exe-single-page">'
        html += u'<script type="text/javascript">document.body.className+=" js"</script>'+lb
        html += u"<div id=\"content\">"+lb
        html += u"<"+headerTag+" id=\"header\">"
        html += u"<div id=\"headerContent\">"
        html += "<h1>"+escape(package.title)+"</h1>"
        html += u"</div>"
        html += u"</"+headerTag+">"+lb
        html += u"<"+sectionTag+" id=\"main\">"+lb
        html += self.renderNode(package.root, 1)
        html += u"</"+sectionTag+">"+lb
        html += self.renderLicense()+lb
        html += self.renderFooter()+lb
        html += u"</div>"+lb # Close content
        # Some styles might have their own JavaScript files (see their config.xml file)
        style = G.application.config.styleStore.getStyle(self.node.package.style)
        if style.hasValidConfig:
            html += style.get_extra_body()        
        html += u'</body></html>'
        
        # JR: Eliminamos los atributos de las ecuaciones
        aux = re.compile("exe_math_latex=\"[^\"]*\"")
        html = aux.sub("", html)
        aux = re.compile("exe_math_size=\"[^\"]*\"")
        html = aux.sub("", html)
        #JR: Cambio la ruta de los enlaces del glosario y el &
        html = html.replace("../../../../../mod/glossary", "../../../../mod/glossary")
        html = html.replace("&concept", "&amp;concept")
        # Remove "resources/" from data="resources/ and the url param
        html = html.replace("video/quicktime\" data=\"resources/", "video/quicktime\" data=\"")
        html = html.replace("application/x-mplayer2\" data=\"resources/", "application/x-mplayer2\" data=\"")
        html = html.replace("audio/x-pn-realaudio-plugin\" data=\"resources/", "audio/x-pn-realaudio-plugin\" data=\"")
        html = html.replace("<param name=\"url\" value=\"resources/", "<param name=\"url\" value=\"")

        return html


    def renderHeader(self, name, for_print=0):
        """
        Returns an XHTML string for the header of this page.
        """
        lb = "\n" #Line breaks
        def hasGalleryIdevice(node):
            hasGallery = common.hasGalleryIdevice(node)
            if not hasGallery:
                for child in node.children:
                    if hasGalleryIdevice(child):
                        return True
            return hasGallery
        
        hasGallery = hasGalleryIdevice(self.node)
        
        def hasFX(node):
            hasEffects = common.hasFX(node)
            if not hasEffects:
                for child in node.children:
                    if hasFX(child):
                        return True
            return hasEffects
        
        hasEffects = hasFX(self.node)
        
        def hasWikipediaIdevice(node):
            hasWikipedia = common.hasWikipediaIdevice(node)
            if not hasWikipedia:
                for child in node.children:
                    if hasWikipediaIdevice(child):
                        return True
            return hasWikipedia
        
        hasWikipedia = hasWikipediaIdevice(self.node)

        def nodeHasMediaelement(node):
            hasMediaelement = common.nodeHasMediaelement(node)
            if not hasMediaelement:
                for child in node.children:
                    if nodeHasMediaelement(child):
                        return True
            return hasMediaelement

        self.hasMediaelement = nodeHasMediaelement(self.node)

        lenguaje = G.application.config.locale
        if self.node.package.dublinCore.language!="":
            lenguaje = self.node.package.dublinCore.language
        dT = common.getExportDocType()
        if dT == "HTML5":
            html = '<!doctype html>'+lb
            html += '<html lang="'+lenguaje+'">'+lb
        else:
            html = u'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">'+lb
            html += u"<html lang=\"" + lenguaje + "\" xml:lang=\"" + lenguaje + "\" xmlns=\"http://www.w3.org/1999/xhtml\">"+lb
        html += u"<head>"+lb
        html += u"<meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\" />"+lb
        html += u"<title>"
        html += name
        html += "</title>"+lb
        html += u"<link rel=\"shortcut icon\" href=\"favicon.ico\" type=\"image/x-icon\" />"+lb
        if dT != "HTML5" and self.node.package.dublinCore.language!="":
            html += '<meta http-equiv="content-language" content="'+lenguaje+'" />'+lb
        if self.node.package.author!="":
            html += '<meta name="author" content="'+self.node.package.author+'" />'+lb
        html += common.getLicenseMetadata(self.node.package.license)
        html += '<meta name="generator" content="eXeLearning '+release+' - exelearning.net" />'+lb
        if self.node.package.description!="":
            html += '<meta name="description" content="'+self.node.package.description+'" />'+lb
        html += u"<link rel=\"stylesheet\" type=\"text/css\" href=\"base.css\" />"+lb
        if hasWikipedia:
            html += u"<link rel=\"stylesheet\" type=\"text/css\" href=\"exe_wikipedia.css\" />"+lb
        if hasGallery:
            html += u"<link rel=\"stylesheet\" type=\"text/css\" href=\"exe_lightbox.css\" />"+lb
        if hasEffects:
            html += u"<link rel=\"stylesheet\" type=\"text/css\" href=\"exe_effects.css\" />"+lb
        html += u"<link rel=\"stylesheet\" type=\"text/css\" href=\"content.css\" />"+lb
        if dT == "HTML5" or self.hasMediaelement:
            html += u'<!--[if lt IE 9]><script type="text/javascript" src="exe_html5.js"></script><![endif]-->'+lb
        style = G.application.config.styleStore.getStyle(self.node.package.style)
        
        # jQuery
        if style.hasValidConfig:
            if style.get_jquery() == True:
                html += u'<script type="text/javascript" src="exe_jquery.js"></script>'+lb
            else:
                html += u'<script type="text/javascript" src="'+style.get_jquery()+'"></script>'+lb
        else:
            html += u'<script type="text/javascript" src="exe_jquery.js"></script>'+lb
            
        if hasGallery:
            html += u'<script type="text/javascript" src="exe_lightbox.js"></script>'+lb
        if hasEffects:
            html += u'<script type="text/javascript" src="exe_effects.js"></script>'+lb
        html += common.getJavaScriptStrings()+lb
        html += u'<script type="text/javascript" src="common.js"></script>'+lb
        if common.hasMagnifier(self.node):
            html += u'<script type="text/javascript" src="mojomagnify.js"></script>'+lb
        if for_print:
            # include extra print-script for onload bit 
            html += u'<script type="text/javascript">' + lb
            html += u'var interval;' + lb
            html += u'function checkClose() {' + lb
            html += u'    if (document.hasFocus()) {' + lb
            html += u'        alert("' + _("You can close this window") + '");' + lb
            html += u'        clearInterval(interval);' + lb
#             html += u'        window.close();' + lb
            html += u'    }' + lb
            html += u'}' + lb
            html += u'function print_page() {' + lb
            html += u'     if(typeof document.hasFocus === "undefined") {' + lb
            html += u'         document.hasFocus = function () {' + lb
            html += u'             return document.visibilityState == "visible";' + lb
            html += u'         }' + lb
            html += u'     }' + lb
            html += u'     window.print();' + lb
            html += u'     interval = setInterval(checkClose, 300);' + lb
            html += u'}' + lb
            html += u'</script>' + lb
        if style.hasValidConfig:
            html += style.get_extra_head()
        html += u"</head>"+lb
        return html
    
    #JR: modifico esta funcion para que ponga hX en cada nodo
    def renderNode(self, node, nivel):
        """
        Returns an XHTML string for this node and recurse for the children
        """
        dT = common.getExportDocType()
        lb = "\n" #Line breaks
        headerTag = "div"
        articleTag = "div"
        if dT == "HTML5":
            headerTag = "header"
            articleTag = "article"
        
        html = ""
        html += '<'+articleTag+' class="node level-'+str(nivel)+'-node">'+lb
        html += '<'+headerTag+' class=\"nodeDecoration\">'
        html += u'<h1 id=\"' + node.GetAnchorName() + '\" class=\"nodeTitle\">'
        html += escape(node.titleLong)
        html += '</h1></'+headerTag+'>'+lb
        
        style = self.node.package.style

        for idevice in node.idevices:
            if idevice.klass != 'NotaIdevice':
                e=" em_iDevice"
                if unicode(idevice.emphasis)=='0':
                    e=""            
                html += u'<'+articleTag+' class="iDevice_wrapper %s%s" id="id%s">%s' % (idevice.klass, e, (idevice.id+"-"+node.id), lb)
                block = g_blockFactory.createBlock(None, idevice)
                if not block:
                    log.critical("Unable to render iDevice.")
                    raise Error("Unable to render iDevice.")
                if hasattr(idevice, "isQuiz"):
                    html += block.renderJavascriptForWeb()
                html += self.processInternalLinks(self.node.package,block.renderView(style))
                html = html.replace('href="#auto_top"', 'href="#"')
                html += u'</'+articleTag+'>'+lb # iDevice div

        html += '</'+articleTag+'>'+lb # node div

        for child in node.children:
            html += self.renderNode(child, nivel+1)

        return html



    def processInternalLinks(self, package, html):
        """
        take care of any internal links which are in the form of::
           
           href="exe-node:Home:Topic:etc#Anchor"

        For this SinglePage Export, go ahead and keep the #Anchor portion,
        but remove the 'exe-node:Home:Topic:etc', since it is all 
        exported into the same file.
        """
        return common.renderInternalLinkNodeAnchor(package, html)
        
        

