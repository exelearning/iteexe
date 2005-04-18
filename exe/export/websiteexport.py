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
from   os.path  import exists, basename, join, isdir, sep
import shutil
import glob
from exe.webui.blockfactory import g_blockFactory
from exe.webui.titleblock   import TitleBlock
from exe.engine.error       import Error
from exe.webui              import common
from exe.webui.webinterface import g_webInterface
from exe.webui.element      import getUploadedFileDir

import os
log = logging.getLogger(__name__)
_   = gettext.gettext

identSpace = " "*4
nodeList = []

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
        self.html = ""
    
    def save(self):
        """
        This is the main function. It will render the page and save it to a file.
        """
        if self.node is self.node.package.root:
            filename = "index.html"
        else:
            filename = self.node.id + ".html"
            
        out = open(filename, "w")
        out.write(self.render())
        out.close()
        
    def getNavigationLink(self):
        """
        return the next link url of this page
        """
        
        nextHtmlPattern = """| <a href="%s.html">next &raquo;</a>"""
        previousHtmlPattern = """<a href="%s.html">&laquo; previous</a>"""
        totalNode = len(nodeList)
        i = nodeList.index(self.node.id)
       
        if  i == 0:
            ##is first node
            previousHtml = ""
            
            if totalNode > 1:
                nextHtml = nextHtmlPattern % nodeList[i + 1]
            else:
                nextHtml = ""
        elif i == (totalNode - 1):
            ##is last node
            nextHtml = ""
            
            if i != 1:
                previousHtml = previousHtmlPattern % nodeList[i - 1]
            else:
                ##if previous page is home page
                previousHtml = previousHtmlPattern % "index"
        else:
            if i != 1:
                previousHtml = previousHtmlPattern % nodeList[i - 1]
            else:
                ##if previous page is home page
                previousHtml = previousHtmlPattern % "index"             
            nextHtml = nextHtmlPattern %  nodeList[i + 1]
            
        return """<div class="noprt" align="right">%s %s </div>"""\
                                %(previousHtml, nextHtml) 
            
        
    def printChildren(self, node):
        """print out children"""
        html = ""
        for child in node.children:
            ##check if is direct parent node
            
            if self.node.id == child.id:
                html += identSpace * (child.level + 1) + \
                       """<div id="active">%s</div> \n"""  %(child.title)
                if len(self.node.children) >0 :
                    html += identSpace * (child.level + 1)  \
                            + """<div ID="subnav">\n""" \
                            + self.printChildren(child) +  "</div>\n"
                 
            elif child in self.node.ancestors():
                html += identSpace * (child.level + 1) \
                    + """<div><a href="%s.html">%s</a></div>\n""" % \
                       (child.id, child.title)
                html += identSpace * (child.level + 1)  \
                        + """<div ID="subnav">\n"""   \
                        + self.printChildren(child) \
                        +  identSpace * (child.level + 1) + "</div>\n"
            else:
                html += identSpace * (child.level + 1) \
                    + """<div><a href="%s.html">%s</a></div>\n""" % \
                        (child.id, child.title)
        return html

        
    def leftNavigationBar(self):
        """
        generate the left navigation string for this page
        """
    
        html = """<ul id="navlist">\n"""
        
        ##add home node
        if self.node.package.root.id == self.node.id:
            html += """<div id="active">%s</div>\n""" % self.node.title
        else:
            html += """<div><a href="index.html">%s</a></div>\n""" % \
                    (self.node.package.root.title)
                    
        nodeLength = (self.node.level + 1)
        
        for level1Node in self.node.package.root.children:
            ##if is parent node, then print out its sibiling
            ##if is current node, active and print its children
            ##else, print title
            
            if level1Node.id == self.node.id:
                ## print active tag
                html += identSpace * (nodeLength - 1)  \
                     + """<div id="active">%s</div> \n"""  % \
                        (self.node.title)
                        
                ## print direct child title
                if len(self.node.children) > 0:
                    ##show direct child, using id="subnav"
                    html += identSpace * nodeLength + """<div ID="subnav">\n"""
                    
                    for node in self.node.children:
                        html += identSpace * (nodeLength)  \
                                + """<a href="%s.html">%s</a> \n""" \
                                % (node.id, node.title)
                        
                    html += identSpace * nodeLength + "</div>\n"
                
            else:
                html += """<div><a href="%s.html">%s</a></div> \n""" % \
                        (level1Node.id, level1Node.title)
                if level1Node in self.node.ancestors():
                    html += identSpace * (level1Node.level + 1) \
                            + """<div ID="subnav">\n""" \
                            + self.printChildren(level1Node) + """</div>\n"""
                
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
        html += "<title>"+ self.node.title +"</title>\n"
        html += "<meta http-equiv=\"content-type\" content=\"text/html; "
        html += " charset=UTF-8\" />\n";
        html += "</head>\n"
        html += "<body>\n"
        
        html += "<div id=\"navcontainer\">\n"
        
        ##add left navigation html
        html += self.leftNavigationBar()       
                
        html += "</div>\n"
        
        html += "<div id=\"main\">\n"
        #html += "<div id=\"authoring_pane\">\n"
        html += TitleBlock(self.node._title).renderView()

        for idevice in self.node.idevices:
            block = g_blockFactory.createBlock(idevice)
            if not block:
                log.critical("Unable to render iDevice.")
                raise Error("Unable to render iDevice.")
            html += block.renderView()
        
        html += self.getNavigationLink()
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
        
        exeDir  = g_webInterface.config.getExeDir()
        dataDir = g_webInterface.config.getDataDir()

        os.chdir(dataDir)
        if exists(package.name):
            shutil.rmtree(package.name)

        os.mkdir(package.name)
        os.chdir(package.name)

        for styleFile in glob.glob(join(exeDir, \
                                                "style", package.style, "*")):
            shutil.copyfile(styleFile, basename(styleFile))
        
        ##copy image directory into 
        ##
        filesDir = getUploadedFileDir()
        ##course uploaded files directory
        uploadedFileDir = join(filesDir, package.name)
        ##export files directory
        exportFilesDir = join(dataDir, package.name, "images", package.name)
        print "uploadedFileDir: %s , dst:%s\n" % (uploadedFileDir, exportFilesDir)
        
        try:
            os.mkdir("images")    
        except:
            errmsg = "Error while creating images directory \n"
            log.error(errmsg)
            return errmsg
            
        shutil.copyfile(filesDir + sep + "mp3player.swf", \
         join(dataDir, package.name, "images", "mp3player.swf"))    
        if isdir(uploadedFileDir):
            try:
                shutil.copytree(uploadedFileDir,\
                        join(dataDir, package.name, "images", package.name))
            except:
                errmsg =  "fail to copy %s to %s" %\
                (uploadedFileDir, join("images", package.name))
                log.error(errmsg)
                return errmsg
        self.doExport(package)

    def doExport(self, package):
        """Cleans up the previous packages nodeList
        and performs the export"""
        # Clean up the last nodeList generated
        global nodeList
        nodeList = []
        # Fill the newly made nodeList
        nodeList.append(package.root.id)
        self.genNodeList(package.root)
        self.exportNode(package.root)

    def genNodeList(self, node):
        """
        recusively generate nodes id list and store in nodeList global variable
        for retrieving next previous link later
        """           
        for child in node.children:
            nodeList.append(child.id)
            self.genNodeList(child)

    def exportNode(self, node):
        """
        Recursive function for exporting a node
        """
        page = WebsitePage(node)
        page.save()

        for child in node.children:
            self.exportNode(child)
    
