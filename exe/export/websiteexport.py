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
Transforms an eXe node into a page on a self-contained website
"""

import logging
import gettext
import os
import os.path
import shutil
import glob
from exe.webui.blockfactory import g_blockFactory
from exe.webui.titleblock   import TitleBlock
from exe.engine.error       import Error
from exe.webui              import common
from exe.webui.webinterface import g_webInterface
log = logging.getLogger(__name__)
_   = gettext.gettext

identSpace = " "*4
def isParent( sourceId, destId ):
    """check if destId is a parent id of sourceId"""
    result = 0
    if sourceId.len()>=len( destId ) and sourceId[: len( destId ) ] == destId:
        result = 1
    return result
    
# ===========================================================================
class WebsitePage(object):
    """
    This class transforms an eXe node into a page on a self-contained website
    """
    def __init__(self, node):
        """
        Initialize
        """
        self.node = node
       # self._package = package
        self.html = ""

    def save(self):
        """
        This is the main function.  It will render the page and save it to a file.
        """
        if self.node.getIdStr() == "1":
            filename = "index.html"
        else:
            filename = self.node.getIdStr() + ".html"
            
        out = open(filename, "w")
        out.write(self.render())
        out.close()
    
    def printSibling( self, node ):
        ##print out sibiling
        html = ""
        for child in node.children:
            ##check if is direct parent
            if self.node.id[ -1 ] == child.id:
                html += spaceIdent * len( child.node ) + """<div ID="subnav">\n""" \
#                         + printSibling( child )
            elif isParent( self.node.id, child.id ):
                html += printSibling( child )
            else:
                html += identSpace * len( child.id ) \
                    + """<div><a href="%s.html">%s</a></div>""" % ( child.getIdStr(), child.title )
        return html
        
    def leftNavibar( self ):
        html = """<ul id="navlist">"""
        nodeLength = len( self.node.id )
        
        for level1Node in self.node.package.root:
            ##if is parent node, then print out its sibiling
            ##if is current node, active and print its children
            ##else, print title
            
            if level1Node.id == self.node.id:
                ## print active tag
                html += ident * ( nodeLength - 1 ) + """<div id="active">%s</div> \n""" \
                                                        %( self.node.title )
                ## print direct child title
                if self.node.children != []:
                    html += identSpace * nodeLength + """<div ID="subnav">\n"""
                    for node in self.node.children:
                        html += identSpace * ( nodeLength +1 ) + """<a href="%s.html">%s</a> \n""" \
                                                                % ( node.getIdStr(), node.title )
                    html += identSpace * nodeLength + "</div>\n"
                
            else:
                html += """<div><a href="%s.html">%s</a></div> \n""" % ( level1Node.getIdStr(), level1Node.title )
                if isParentNode( self.node.id, level1Node.id ):
                    html += self.printSibling( level1Node )
                
        html += "</ul>"
        return html
        
    def render(self):
        """
        Returns an XHTML string rendering this page.
        """
        html  = "<?xml version=\"1.0\" encoding=\"iso-8859-1\"?>\n"
        html += "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" "
        html += " \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">\n"
        html += "<html xmlns=\"http://www.w3.org/1999/xhtml\">\n"
        html += "<head>\n"
        html += "<style type=\"text/css\">\n"
        html += "@import url(content.css);\n"
        html += "@import url(nav.css);</style>\n"
        html += "<title>"+_("eXe")+"</title>\n"
        html += "<meta http-equiv=\"content-type\" content=\"text/html; "
        html += " charset=UTF-8\" />\n";
        html += "</head>\n"
        html += "<body>\n"
        html += "<div id=\"outer\">\n"
        
        html += "<div id=\"navcontainer\">\n"
        
        for child in self.node.children:
            html += "<a href=\"%s.html\">" % child.getIdStr()
            html += str(child.title) + "</a><br/>\n"
                
        html += "</div>\n"

        html += "<div id=\"main\">\n"
        html += TitleBlock(self.node.title).renderView()

        for idevice in self.node.idevices:
            block = g_blockFactory.createBlock(idevice)
            if not block:
                log.critical("Unable to render iDevice.")
                raise Error("Unable to render iDevice.")
            html += block.renderView()

        html += "</div>\n"
        html += common.footer()
 
        return html

        
class WebsiteExport(object):
    """
    WebsiteExport will export a package as a website of HTML pages
    """
    def __init__(self):
        self.package = None


    def export(self, package):
        """ 
        Export web page
        """
        self.package = package


        os.chdir(g_webInterface.config.getDataDir())
        if os.path.exists(package.name):
            shutil.rmtree(package.name)

        os.mkdir(package.name)
        os.chdir(package.name)
        exeDir = g_webInterface.config.getExeDir()

        for styleFile in glob.glob(os.path.join(exeDir, 
                                                "style", package.style, "*")):
            shutil.copyfile(styleFile, os.path.basename(styleFile))

        self.exportNode(package.root)
        
        
    def exportNode(self, node):
        """
        Recursive function for exporting a node
        """
        page = WebsitePage(node)
        page.save()

        for child in node.children:
            self.exportNode(child)
    
# ===========================================================================
