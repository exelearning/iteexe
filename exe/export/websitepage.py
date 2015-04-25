# ===========================================================================
# eXe 
# Copyright 2004-2005, University of Auckland
# Copyright 2004-2007 eXe Project, New Zealand Tertiary Education Commission
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
This class transforms an eXe node into a page on a self-contained website
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
class WebsitePage(Page):
    """
    This class transforms an eXe node into a page on a self-contained website
    """

    def save(self, outputDir, prevPage, nextPage, pages):
        """
        This is the main function. It will render the page and save it to a
        file.  'outputDir' is the directory where the filenames will be saved
        (a 'path' instance)
        """
        outfile = open(outputDir / self.name+".html", "wb")
        outfile.write(self.render(prevPage, nextPage, pages))
        outfile.close()
        

    def render(self, prevPage, nextPage, pages):
        """
        Returns an XHTML string rendering this page.
        """
        lenguaje = G.application.config.locale
        if self.node.package.dublinCore.language!="":
            lenguaje = self.node.package.dublinCore.language
        
        dT = common.getExportDocType()
        themeHasXML = common.themeHasConfigXML(self.node.package.style)
        lb = "\n" #Line breaks
        sectionTag = "div"
        articleTag = "div"
        headerTag = "div"
        navTag = "div"
        if dT == "HTML5":
            html = '<!doctype html>'+lb
            html += '<html lang="'+lenguaje+'">'+lb
            sectionTag = "section"
            articleTag = "article"
            headerTag = "header"
            navTag = "nav"
        else:
            html = u'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">'+lb
            html += u"<html lang=\"" + lenguaje + "\" xml:lang=\"" + lenguaje + "\" xmlns=\"http://www.w3.org/1999/xhtml\">"+lb
        html += u"<head>"+lb
        html += u"<link rel=\"stylesheet\" type=\"text/css\" href=\"base.css\" />"+lb
        if common.hasWikipediaIdevice(self.node):
            html += u"<link rel=\"stylesheet\" type=\"text/css\" href=\"exe_wikipedia.css\" />"+lb    
        if common.hasGalleryIdevice(self.node):
            html += u"<link rel=\"stylesheet\" type=\"text/css\" href=\"exe_lightbox.css\" />"+lb
        html += u"<link rel=\"stylesheet\" type=\"text/css\" href=\"content.css\" />"+lb
        html += u"<link rel=\"stylesheet\" type=\"text/css\" href=\"nav.css\" />"+lb
        html += u"<meta http-equiv=\"content-type\" content=\"text/html; "
        html += u" charset=utf-8\" />"+lb        
        html += u"<title>"
        if self.node.id=='0':
            if self.node.package.title!='':
                html += escape(self.node.package.title)
            else:
                html += escape(self.node.titleLong)
        else:
            if self.node.package.title!='':
                html += escape(self.node.titleLong)+" | "+escape(self.node.package.title)
            else:
                html += escape(self.node.titleLong)
        html += u" </title>"+lb
        html += u"<link rel=\"shortcut icon\" href=\"favicon.ico\" type=\"image/x-icon\" />"+lb
        if dT != "HTML5" and self.node.package.dublinCore.language!="":
            html += '<meta http-equiv="content-language" content="'+lenguaje+'" />'+lb
        if self.node.package.author!="":
            html += '<meta name="author" content="'+self.node.package.author+'" />'+lb
        html += '<meta name="generator" content="eXeLearning '+release+' - exelearning.net" />'+lb
        if self.node.id=='0':
            if self.node.package.description!="":
                html += '<meta name="description" content="'+self.node.package.description+'" />'+lb
        if dT == "HTML5" or common.nodeHasMediaelement(self.node):
            html += u'<!--[if lt IE 9]><script type="text/javascript" src="exe_html5.js"></script><![endif]-->'+lb
        style = G.application.config.styleStore.getStyle(self.node.package.style)
        
        # jQuery
        if style.hasValidConfig:
            if style.get_jquery()==True:
                html += u'<script type="text/javascript" src="exe_jquery.js"></script>'+lb
            else:
                html += u'<script type="text/javascript" src="'+style.get_jquery()+'"></script>'+lb
        else:
            html += u'<script type="text/javascript" src="exe_jquery.js"></script>'+lb
        
        if common.hasGalleryIdevice(self.node):
            html += u'<script type="text/javascript" src="exe_lightbox.js"></script>'+lb
        html += common.getJavaScriptStrings()+lb
        html += u'<script type="text/javascript" src="common.js"></script>'+lb
        if common.hasMagnifier(self.node):
            html += u'<script type="text/javascript" src="mojomagnify.js"></script>'+lb
        # Some styles might have their own JavaScript files (see their config.xml file)
        if style.hasValidConfig:
            html += style.get_extra_head()
        html += u"</head>"+lb
        html += u'<body class="exe-web-site"><script type="text/javascript">document.body.className+=" js"</script>'+lb
        html += u"<div id=\"content\">"+lb
        html += '<p id="skipNav"><a href="#main" class="sr-av">' + c_('Skip navigation')+'</a></p>'+lb

        if self.node.package.backgroundImg or self.node.package.title:
            html += u"<"+headerTag+" id=\"header\" "

            if self.node.package.backgroundImg:
                html += u" style=\"background-image: url("
                html += quote(self.node.package.backgroundImg.basename())
                html += u"); "

                if self.node.package.backgroundImgTile:
                    html += "background-repeat: repeat-x;"
                else:
                    html += "background-repeat: no-repeat;"

                html += u"\""
            html += u">"
            html += '<div id="headerContent">'
            html += escape(self.node.package.title)
            html += '</div>'
            html += u"</"+headerTag+">"+lb
        else:
            html += "<"+sectionTag+" id=\"emptyHeader\"></"+sectionTag+">"+lb			
        
        # add left navigation html
        html += u"<"+navTag+" id=\"siteNav\">"+lb
        html += self.leftNavigationBar(pages)
        html += u"</"+navTag+">"+lb
        html += "<div id='topPagination'>"+lb
        html += self.getNavigationLink(prevPage, nextPage)
        html += "</div>"+lb
        html += u"<div id=\"main-wrapper\">"+lb
        html += u"<"+sectionTag+" id=\"main\">"
        if dT != "HTML5":
            html += "<a name=\"main\"></a>"
        html += lb

        html += '<'+headerTag+' id=\"nodeDecoration\">'
        html += '<h1 id=\"nodeTitle\">'
        html += escape(self.node.titleLong)
        html += '</h1>'
        html += '</'+headerTag+'>'+lb

        for idevice in self.node.idevices:
            if idevice.klass != 'NotaIdevice':
                e=" em_iDevice"
                if unicode(idevice.emphasis)=='0':
                    e=""
                html += u'<'+articleTag+' class="iDevice_wrapper %s%s" id="id%s">%s' %  (idevice.klass, e, idevice.id, lb)
                block = g_blockFactory.createBlock(None, idevice)
                if not block:
                    log.critical("Unable to render iDevice.")
                    raise Error("Unable to render iDevice.")
                if hasattr(idevice, "isQuiz"):
                    html += block.renderJavascriptForWeb()
                if idevice.title != "Forum Discussion":
                    html += self.processInternalLinks(self.node.package,
                        block.renderView(self.node.package.style))
                html += u'</'+articleTag+'>'+lb # iDevice div

        if not themeHasXML:
            html += "<div id='bottomPagination'>"+lb
            html += self.getNavigationLink(prevPage, nextPage)
            html += "</div>"+lb
        # writes the footer for each page 
        html += self.renderLicense()
        if not themeHasXML:
        #if not style.hasValidConfig:
            html += self.renderFooter()
        html += u"</"+sectionTag+">"+lb # /main
        html += u"</div>"+lb # /main-wrapper
        if themeHasXML:
        #if style.hasValidConfig:
            html += "<div id='bottomPagination'>"+lb
            html += self.getNavigationLink(prevPage, nextPage)
            html += "</div>"+lb        
            html += self.renderFooter()
        html += u"</div>"+lb # /content
        if themeHasXML:
        #if style.hasValidConfig:
            html += style.get_extra_body()        
        html += u'</body></html>'
        html = html.encode('utf8')
        # JR: Eliminamos los atributos de las ecuaciones
        aux = re.compile("exe_math_latex=\"[^\"]*\"")
	html = aux.sub("", html)
	aux = re.compile("exe_math_size=\"[^\"]*\"")
	html = aux.sub("", html)
	#JR: Cambio el & en los enlaces del glosario
	html = html.replace("&concept", "&amp;concept")
    # Remove "resources/" from data="resources/ and the url param
	html = html.replace("video/quicktime\" data=\"resources/", "video/quicktime\" data=\"")
	html = html.replace("application/x-mplayer2\" data=\"resources/", "application/x-mplayer2\" data=\"")
	html = html.replace("audio/x-pn-realaudio-plugin\" data=\"resources/", "audio/x-pn-realaudio-plugin\" data=\"")
	html = html.replace("<param name=\"url\" value=\"resources/", "<param name=\"url\" value=\"")
        return html

    def indent(self,level):
        i = 0
        indent_text = ""
        while i < level:
            indent_text += "   "
            i+=1
        return indent_text
        
    def leftNavigationBar(self, pages):
        """
        Generate the left navigation string for this page
        """
        lb = "\n" #Line breaks
        depth = 1
        nodePath = [None] + list(self.node.ancestors()) + [self.node]

        # Open the main ul
        html = "<ul>"
        
        for page in pages:
            # If this node is deeper than the previous one, we must open a new list 
            while depth < page.depth:
                html += lb+self.indent(depth)+"<ul"

                if page.node.parent not in nodePath:
                    html += " class=\"other-section\""
                html += ">"
                depth += 1

            # If this node is higher than the previous one, we must close the list (unless we are in the first level) 
            while depth > page.depth and page.depth > 0:
                html += lb+self.indent(depth-1)+"</ul>"+lb+self.indent(depth-1)+"</li>"
                depth -= 1
            
            # The active node must have a special style
            if page.node == self.node:
                html += lb+self.indent(depth)+"<li id=\"active\"><a href=\""+quote(page.name)+".html\" "

                if page.node.children:
                    html += "class=\"active daddy"
                else:
                    html += "class=\"active no-ch"

            # A node in the path of the active node (but not the main one) 
            elif page.node in nodePath and page.node.parent != None:
                html += lb+self.indent(depth)+"<li class=\"current-page-parent\"><a href=\""+quote(page.name)+".html\" "

                if page.node.children:
                    html += "class=\"current-page-parent daddy"

            else:
                html += lb+self.indent(depth)+"<li><a href=\""+quote(page.name)+".html\" class=\""
                if page.node.children:
                    html += "daddy"
                else:
                    html += "no-ch"

            if page.depth==0:
                html += " main-node"

            html += "\">"
            html += escape(page.node.titleShort)
            html += "</a>"

            # Closing the main node is just closing a li because we want to place first level children as 'brothers' of the main node
            if page.depth==0:
                html += "</li>"

            # Closing a node without children
            if not page.node.children and page.depth!=0:
                html += "</li>"

        # If last node is not in the first level, some lists must be closed (as many as unclosed levels)
        while depth > 1:
            html += lb+self.indent(depth-1)+"</ul>"+lb+self.indent(depth-1)+"</li>"
            depth -= 1

        # Just close the main ul
        html += lb+self.indent(depth-1)+"</ul>"+lb

        return html
        
    def getNavigationLink(self, prevPage, nextPage):
        """
        return the next link url of this page
        """
        dT = common.getExportDocType()
        lb = "\n" #Line breaks
        navTag = "div"
        if dT == "HTML5":
            navTag = "nav"
        html = "<"+navTag+" class=\"pagination noprt\">"+lb

        if prevPage:
            html += "<a href=\""+quote(prevPage.name)+".html\" class=\"prev\"><span>"
            html += "<span>&laquo; </span>%s</span></a>" % c_('Previous')

        if nextPage:
            if prevPage:
                html += ' <span class="sep">| </span>'
            html += "<a href=\""+quote(nextPage.name)+".html\" class=\"next\"><span>"
            html += "%s<span> &raquo;</span></span></a>" % c_('Next')
            
        html += lb+"</"+navTag+">"+lb
        return html



    def processInternalLinks(self, package, html):
        """
        take care of any internal links which are in the form of:
           href="exe-node:Home:Topic:etc#Anchor"
        For this WebSite Export, go ahead and process the link entirely,
        using the fully exported (and unique) file names for each node.
        """
        return common.renderInternalLinkNodeFilenames(package, html)
        
