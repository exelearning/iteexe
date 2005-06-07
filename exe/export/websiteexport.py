# ===========================================================================
# eXe 
# Copyright 2004-2005, University of Auckland
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
WebsiteExport will export a package as a website of HTML pages
"""

import logging
import gettext
import re
import os
from exe.webui.blockfactory import g_blockFactory
from exe.webui.titleblock   import TitleBlock
from exe.engine.error       import Error
from exe.engine.path        import Path
from exe.engine.config      import Config
from exe.export.pages       import uniquifyNames

log = logging.getLogger(__name__)
_   = gettext.gettext


# ===========================================================================
class WebsitePage(object):
    """
    This class transforms an eXe node into a page on a self-contained website
    """
    def __init__(self, name, depth, node):
        """
        Initialize
        """
        self.name  = name
        self.depth = depth
        self.node  = node
    

    def save(self, outputDir, prevPage, nextPage, pages):
        """
        This is the main function. It will render the page and save it to a
        file.  'outputDir' is the directory where the filenames will be saved
        (a 'path' instance)
        """
        outfile = open(outputDir / self.name+".html", "w")
        outfile.write(self.render(prevPage, nextPage, pages))
        outfile.close()
        

    def render(self, prevPage, nextPage, pages):
        """
        Returns an XHTML string rendering this page.
        """
        html  = u"<?xml version=\"1.0\" encoding=\"iso-8859-1\"?>\n"
        html += u"<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" "
        html += u" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">\n"
        html += u"<html xmlns=\"http://www.w3.org/1999/xhtml\">\n"
        html += u"<head>\n"
        html += u"<style type=\"text/css\">\n"
        html += u"@import url(content.css);\n"
        html += u"@import url(nav.css);</style>\n"
        for idevice in self.node.idevices:
            if idevice.title == "Quiz Test":
                html += u"<script language=\"javascript\" "
                html += u"src=\"quizForWeb.js\"></script>\n"
                break
            
        html += u"<title>%s</title>\n" % self.node.title
        html += u"<meta http-equiv=\"content-type\" content=\"text/html; "
        html += u" charset=UTF-8\" />\n";
        html += u"</head>\n"
        html += u"<body>\n"
        
        # add left navigation html
        html += u"<div id=\"navcontainer\">\n"
        html += self.leftNavigationBar(pages)
        html += u"</div>\n"
        html += u"<div id=\"main\">\n"

        style = self.node.package.style
        html += TitleBlock(None, self.node._title).renderView(style)

        for idevice in self.node.idevices:
            block = g_blockFactory.createBlock(None, idevice)
            if not block:
                log.critical("Unable to render iDevice.")
                raise Error("Unable to render iDevice.")
            html += block.renderView(style)
        
        html += self.getNavigationLink(prevPage, nextPage)
        html += u"</div>\n"
        html += u"</body></html>\n"
        return html.encode('utf8')

        
    def leftNavigationBar(self, pages):
        """
        Generate the left navigation string for this page
        """
        depth    = 1
        nodePath = [None] + list(self.node.ancestors()) + [self.node]

        html = "<ul id=\"navlist\">\n"

        for page in pages:
            if page.node.parent in nodePath:
                while depth < page.depth:
                    html += "<div id=\"subnav\">\n"
                    depth += 1
                while depth > page.depth:
                    html += "</div>\n"
                    depth -= 1

                if page.node == self.node:
                    html += "<div id=\"active\">"
                    html += page.node.title
                    html += "</div>\n"
                else:
                    html += "<div><a href=\""+page.name+".html\">"
                    html += page.node.title
                    html += "</a></div>\n"

        html += "</ul>\n"
        return html
        
        
    def getNavigationLink(self, prevPage, nextPage):
        """
        return the next link url of this page
        """
        html = "<div class=\"noprt\" align=\"right\">"

        if prevPage:
            html += "<a href=\""+prevPage.name+".html\">"
            html += "&laquo; previous</a>"

        if nextPage:
            if prevPage:
                html += " | "
            html += "<a href=\""+nextPage.name+".html\">"
            html += "next &raquo;</a>"""
            
        html += "</div>\n"
        return html

        
# ===========================================================================
class WebsiteExport(object):
    """
    WebsiteExport will export a package as a website of HTML pages
    """
    def __init__(self, stylesDir, outputDir, imagesDir, scriptsDir):
        """
        'stylesDir' is the directory where we can copy the stylesheets from
        'outputDir' is the directory that will be [over]written
        with the website
        """
        self.pages      = []
        self.stylesDir  = Path(stylesDir)
        self.outputDir  = Path(outputDir)
        self.imagesDir  = Path(imagesDir)
        self.scriptsDir = Path(scriptsDir)

        # Create the output dir if it doesn't already exist
        if not self.outputDir.exists(): 
            self.outputDir.mkdir()


    def export(self, package):
        """ 
        Export web site
        Cleans up the previous packages pages and performs the export
        """
        self.copyFiles(package)

        self.pages = [ WebsitePage("index", 1, package.root) ]
        self.generatePages(package.root, 1)
        uniquifyNames(self.pages)

        prevPage = None
        thisPage = self.pages[0]

        for nextPage in self.pages[1:]:
            thisPage.save(self.outputDir, prevPage, nextPage, self.pages)
            prevPage = thisPage
            thisPage = nextPage

        thisPage.save(self.outputDir, prevPage, None, self.pages)


    def copyFiles(self, package):
        """
        Copy all the files used by the website.
        """
        # TODO Need to tidy this up!!!

        # Copy the style sheets to the output dir
        self.stylesDir.copyfiles(self.outputDir)

        # TODO these two should be part of the style
        self.imagesDir.copylist(('panel-amusements.png', 'stock-stop.png'), 
                          self.outputDir)

        # copy the package's resource files
        package.resourceDir.copyfiles(self.outputDir)
            
        # copy script files.
        # TODO quiz scripts belong in the packages resourcesDir?
        if (os.path.isfile(self.scriptsDir+ "/quizForWeb.js") and 
            os.path.isfile(self.scriptsDir+ "/quizForScorm.js")):
            self.scriptsDir.copylist(('libot_drag.js', 'common.js',
                                      'quizForWeb.js'), self.outputDir)
            os.remove(self.scriptsDir+ "/quizForWeb.js")
            os.remove(self.scriptsDir+ "/quizForScorm.js")
        else:
            self.scriptsDir.copylist(('libot_drag.js', 'common.js'), 
                                     self.outputDir)
            

    def generatePages(self, node, depth):
        """
        Recursively generate pages and store in pages member variable
        for retrieving later
        """           
        for child in node.children:
            pageName = child.title.lower().replace(" ", "_")
            pageName = re.sub(r"\W", "", pageName)
            if not pageName:
                pageName = "__"

            self.pages.append(WebsitePage(pageName, depth, child))
            self.generatePages(child, depth + 1)

