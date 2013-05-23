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
        dT = common.getExportDocType()
        sectionTag = "div"
        headerTag = "div"
        navTag = "div"
        if dT == "HTML5":
            html = '<!doctype html>'
            html += '<html lang="'+lenguaje+'">'
            sectionTag = "section"
            headerTag = "header"
            navTag = "nav"
        else:
            html  = u"<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
            html += u'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">'
            html += u"<html lang=\"" + lenguaje + "\" xml:lang=\"" + lenguaje + "\" xmlns=\"http://www.w3.org/1999/xhtml\">"
        html += u"<head>"
        html += u"<link rel=\"stylesheet\" type=\"text/css\" href=\"base.css\" />"
        if common.hasWikipediaIdevice(self.node):
            html += u"<link rel=\"stylesheet\" type=\"text/css\" href=\"exe_wikipedia.css\" />"        
        if common.hasGalleryIdevice(self.node):
            html += u"<link rel=\"stylesheet\" type=\"text/css\" href=\"exe_lightbox.css\" />"
        html += u"<link rel=\"stylesheet\" type=\"text/css\" href=\"content.css\" />"
        html += u"<link rel=\"stylesheet\" type=\"text/css\" href=\"nav.css\" />"     
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
        html += u" </title>" 
        html += u"<link rel=\"shortcut icon\" href=\"favicon.ico\" type=\"image/x-icon\" />"
        html += u"<meta http-equiv=\"Content-Type\" content=\"text/html; "
        html += u" charset=utf-8\" />";
        html += '<meta name="generator" content="eXeLearning - exelearning.net" />'
        if dT == "HTML5":
            html += u'<!--[if lt IE 9]><script type="text/javascript" src="exe_html5.js"></script><![endif]-->'
        if common.hasGalleryIdevice(self.node):
            html += u'<script type="text/javascript" src="exe_lightbox.js"></script>'
        html += u'<script type="text/javascript" src="common.js"></script>'
        if common.hasMagnifier(self.node):
            html += u'<script type="text/javascript" src="mojomagnify.js"></script>'
        html += u"</head>\n"
        html += u"<body>"
        html += u"<"+sectionTag+" id=\"content\">"

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
            html += escape(self.node.package.title)
            html += u"</"+headerTag+">"
        else:
            html += "<"+sectionTag+" id=\"emptyHeader\"></"+sectionTag+">"
        
        # add left navigation html
        html += u"<"+navTag+" id=\"siteNav\">"
        html += self.leftNavigationBar(pages)
        html += u"</"+navTag+">"
        html += "<"+sectionTag+" id='topPagination'>"
        html += self.getNavigationLink(prevPage, nextPage)
        html += "</"+sectionTag+">"
        html += u"<"+sectionTag+" id=\"main\">"

        style = self.node.package.style
        html += '<'+headerTag+' id=\"nodeDecoration\">'
        html += '<h1 id=\"nodeTitle\">'
        html += escape(self.node.titleLong)
        html += '</h1></'+headerTag+'>'

        for idevice in self.node.idevices:
            if idevice.klass != 'NotaIdevice':
                e=" em_iDevice"
                if unicode(idevice.emphasis)=='0':
                    e=""
                html += u'<'+sectionTag+' class="iDevice_wrapper %s%s" id="id%s">' %  (idevice.klass, e, idevice.id)
                block = g_blockFactory.createBlock(None, idevice)
                if not block:
                    log.critical("Unable to render iDevice.")
                    raise Error("Unable to render iDevice.")
                if hasattr(idevice, "isQuiz"):
                    html += block.renderJavascriptForWeb()
                if idevice.title != "Forum Discussion":
                    html += self.processInternalLinks(self.node.package,
                        block.renderView(style))
                html += u'</'+sectionTag+'>' # iDevice div
        
        html += "<"+sectionTag+" id='bottomPagination'>"
        html += self.getNavigationLink(prevPage, nextPage)
        html += "</"+sectionTag+">"
        # writes the footer for each page 
        html += self.renderLicense()
        html += self.renderFooter()
        html += u"</"+sectionTag+">" # /main
        html += u"</"+sectionTag+">" # /content
        html += u"</body></html>"
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

        
    def leftNavigationBar(self, pages, inSameLevelTitle = True, excludeTitle = False):
        """
        Generate the left navigation string for this page
        """
        if inSameLevelTitle:
            depth = 1
        else:
            depth = 0
        nodePath = [None] + list(self.node.ancestors()) + [self.node]

        html = "<ul>"
        
        for page in pages:
            if page.node.parent == None and not inSameLevelTitle:
                page.depth = 0
            if page.node.parent == None and excludeTitle:
                depth = 1
                continue
            while depth < page.depth:
                html += "<ul"

                if page.node.parent not in nodePath:
                    html += " class=\"other-section\""
                html += ">"
                depth += 1

            while depth > page.depth:
                html += "</ul></li>"
                depth -= 1
            
            if page.node == self.node:
                html += "<li id=\"active\"><a href=\""+quote(page.name)+".html\" "

                if page.node.children:
                    html += "class=\"active daddy"
                else:
                    html += "class=\"active no-ch"

            elif page.node in nodePath and page.node.parent != None:
                html += "<li class=\"current-page-parent\"><a href=\""+quote(page.name)+".html\" "

                if page.node.children:
                    html += "class=\"current-page-parent daddy"

            else:
                html += "<li><a href=\""+quote(page.name)+".html\" class=\""
                if page.node.children:
                    html += "daddy"
                else:
                    html += "no-ch"

            if page.node.id=="0":
                html += " main-node"

            html += "\">"
            html += escape(page.node.titleShort)
            html += "</a>"

            if inSameLevelTitle and page.node.id=="0":
                html += "</li>"

            if not page.node.children and page.node.id!="0":
                html += "</li>"

        if excludeTitle or inSameLevelTitle:
            html += "</ul>"
        else:
            html += "</ul></li></ul>"
        
        return html
        
        
    def getNavigationLink(self, prevPage, nextPage):
        """
        return the next link url of this page
        """
        dT = common.getExportDocType()
        sectionTag = "div"
        if dT == "HTML5":
            sectionTag = "section"
        html = "<"+sectionTag+" class=\"pagination noprt\">"

        if prevPage:
            html += "<a href=\""+quote(prevPage.name)+".html\" class=\"prev\">"
            html += "<span>&laquo; </span>%s</a>" % _('Previous')

        if nextPage:
            if prevPage:
                html += " | "
            html += "<a href=\""+quote(nextPage.name)+".html\" class=\"next\">"
            html += " %s<span> &raquo;</span></a>" % _('Next')
            
        html += "</"+sectionTag+">"
        return html



    def processInternalLinks(self, package, html):
        """
        take care of any internal links which are in the form of:
           href="exe-node:Home:Topic:etc#Anchor"
        For this WebSite Export, go ahead and process the link entirely,
        using the fully exported (and unique) file names for each node.
        """
        return common.renderInternalLinkNodeFilenames(package, html)
        
