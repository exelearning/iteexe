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
        sectionTag = "div"
        headerTag = "div"
        if dT == "HTML5":
            sectionTag = "section"
            headerTag = "header"
        html  = self.renderHeader(package.title, for_print)
        if for_print:
            # include extra onload bit:
            html += u'<body class="exe-single-page" onload="print_page()">'
        else:
            html += u'<body class="exe-single-page">'
        html += u"<"+sectionTag+" id=\"content\">"
        html += u"<"+headerTag+" id=\"header\">"
        html += "<h1>"+escape(package.title)+"</h1>"
        html += u"</"+headerTag+">"
        html += u"<"+sectionTag+" id=\"main\">"
        html += self.renderNode(package.root, 1)
        html += u"</"+sectionTag+">"
        if self.hasMediaelement:
            html += u"<script>$('.mediaelement').mediaelementplayer();</script>"
        html += self.renderLicense()
        html += self.renderFooter()
        html += u"</"+sectionTag+">"
        # Some styles might have their own JavaScript files (see their config.xml file)
        style = G.application.config.styleStore.getStyle(self.node.package.style)
        if style.hasValidConfig:
            html += style.get_extra_body()        
        html += u"</body></html>"
        
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
            html  = u"<?xml version=\"1.0\" encoding=\"UTF-8\"?>"+lb
            html += u'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">'+lb
            html += u"<html lang=\"" + lenguaje + "\" xml:lang=\"" + lenguaje + "\" xmlns=\"http://www.w3.org/1999/xhtml\">"+lb
        html += u"<head>"+lb
        html += u"<title>"
        html += name
        html += "</title>"
        html += u"<link rel=\"shortcut icon\" href=\"favicon.ico\" type=\"image/x-icon\" />"+lb
        html += u"<meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\" />"+lb
        if dT != "HTML5" and self.node.package.dublinCore.language!="":
            html += '<meta http-equiv="content-language" content="'+lenguaje+'" />'+lb
        if self.node.package.author!="":
            html += '<meta name="author" content="'+self.node.package.author+'" />'+lb
        html += '<meta name="generator" content="eXeLearning - exelearning.net" />'+lb     
        if self.node.package.description!="":
            html += '<meta name="description" content="'+self.node.package.description+'" />'+lb
        html += u"<link rel=\"stylesheet\" type=\"text/css\" href=\"base.css\" />"+lb
        if hasWikipedia:
            html += u"<link rel=\"stylesheet\" type=\"text/css\" href=\"exe_wikipedia.css\" />"+lb
        if hasGallery:
            html += u"<link rel=\"stylesheet\" type=\"text/css\" href=\"exe_lightbox.css\" />"+lb
        if self.hasMediaelement:
            html += u"<link rel=\"stylesheet\" type=\"text/css\" href=\"mediaelementplayer.css\" />"+lb
        html += u"<link rel=\"stylesheet\" type=\"text/css\" href=\"content.css\" />"+lb
        if dT == "HTML5":
            html += u'<!--[if lt IE 9]><script type="text/javascript" src="exe_html5.js"></script><![endif]-->'+lb
        if hasGallery:
            html += u'<script type="text/javascript" src="exe_lightbox.js"></script>'+lb
        if self.hasMediaelement:
            html += u'<script type="text/javascript" src="jquery.js"></script>'+lb
            html += u'<script type="text/javascript" src="mediaelement-and-player.min.js"></script>'+lb
        html += u'<script type="text/javascript" src="common.js"></script>'+lb
        if common.hasMagnifier(self.node):
            html += u'<script type="text/javascript" src="mojomagnify.js"></script>'+lb
        if for_print:
            # include extra print-script for onload bit 
            html += u'<script type="text/javascript">function print_page(){window.print();window.close();}</script>'+lb
        style = G.application.config.styleStore.getStyle(self.node.package.style)
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
        sectionTag = "div"
        headerTag = "div"
        articleTag = "div"
        if dT == "HTML5":
            sectionTag = "section"
            headerTag = "header"
            articleTag = "article"
            nivel = 1
        
        html = ""
        html += '<'+articleTag+' class="node">'+lb
        html += '<'+headerTag+' class=\"nodeDecoration\">'
        html += '<h' + str(nivel) + ' class=\"nodeTitle\">'
        html += escape(node.titleLong)
        html += '</h' + str(nivel) + '></'+headerTag+'>'+lb
        
        style = self.node.package.style

        for idevice in node.idevices:
            if idevice.klass != 'NotaIdevice':
                e=" em_iDevice"
                if unicode(idevice.emphasis)=='0':
                    e=""            
                html += u'<'+sectionTag+' class="iDevice_wrapper %s%s" id="id%s">%s' % (idevice.klass, e, (idevice.id+"-"+node.id), lb)
                block = g_blockFactory.createBlock(None, idevice)
                if not block:
                    log.critical("Unable to render iDevice.")
                    raise Error("Unable to render iDevice.")
                if hasattr(idevice, "isQuiz"):
                    html += block.renderJavascriptForWeb()
                html += self.processInternalLinks(block.renderView(style))
                html = html.replace('href="#auto_top"', 'href="#"')
                html += u'</'+sectionTag+'>'+lb # iDevice div

        html += '</'+articleTag+'>'+lb # node div

        for child in node.children:
            html += self.renderNode(child, nivel+1)

        return html



    def processInternalLinks(self, html):
        """
        take care of any internal links which are in the form of:
           href="exe-node:Home:Topic:etc#Anchor"
        For this SinglePage Export, go ahead and keep the #Anchor portion,
        but remove the 'exe-node:Home:Topic:etc', since it is all 
        exported into the same file.
        """
        return common.removeInternalLinkNodes(html)
        
        

