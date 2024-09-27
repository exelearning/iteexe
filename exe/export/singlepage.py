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
from html                     import escape
from urllib.parse                   import quote
from exe.webui.blockfactory   import g_blockFactory
from exe.engine.error         import Error
from exe.engine.path          import Path
from exe.engine.version       import release
from exe.export               import helper
from exe.export.helper        import lineBreak 
from exe.export.pages         import Page, uniquifyNames
from exe.webui                import common
from exe                      import globals as G
from gettext                  import gettext as _

log = logging.getLogger(__name__)

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
        outfile = open(filename, 'wb')
        outfile.write(self.render(self.node.package, for_print).encode('utf8'))
        outfile.close()
        
    def render(self, package, for_print = 0):
        """
        Returns an XHTML string rendering this page.
        """
        
        # Get the DocType
        docType = common.getExportDocType()
        
        # Get section and header tags
        sectionTag = 'div'
        headerTag = 'div'
        if docType == 'HTML5':
            sectionTag = 'section'
            headerTag = 'header'
            
        # Get package title
        if package.title != '':
            title = escape(package.title)
        else:
            title = escape(package.root.titleLong)
            
        # Render HTML header
        html  = self.renderHeader(title, docType, for_print)
        
        extraCSS = ''
        if package.get_loadMathEngine():
            extraCSS = ' exe-auto-math'  
        if package.get_addAccessibilityToolbar():
            extraCSS += ' exe-atools'            
        if for_print:
            # Include extra onload bit:
            html += '<body class="exe-single-page'+extraCSS+'" onload="print_page()">'
        else:
            html += '<body class="exe-single-page'+extraCSS+'">'
            
        # Script to check if JS is enabled
        html += '<script type="text/javascript">document.body.className+=" js"</script>' + lineBreak
        
        # Main content block
        html += '<div id="content">' + lineBreak
        
        # Header
        html += '<%s id="header">%s' % (headerTag, lineBreak)
        # Header content block
        html += '<div id="headerContent">' + lineBreak
        # Package title
        html += '<h1>%s</h1>%s' % (escape(title), lineBreak)
        # Close header content block
        html += '</div>' + lineBreak
        # Close header
        html += '</%s>%s' % (headerTag, lineBreak)
        
        # Main section
        html += '<%s id="main">%s' % (sectionTag, lineBreak)
        
        # Render node contents
        html += self.renderNode(package.root, docType, 1)
        
        # Close main section
        html += '</%s>%s' % (sectionTag, lineBreak)
        
        # Render the license
        html += self.renderLicense() + lineBreak
        
        # Render the footer
        html += self.renderFooter() + lineBreak
        
        # Close main content block
        html += '</div>' + lineBreak
        
        # eXe footer link
        html += common.renderExeLink(self.node.package)        
        
        # Some styles might have their own JavaScript files (see their config.xml file)
        style = G.application.config.styleStore.getStyle(self.node.package.style)
        if style.hasValidConfig():
            html += style.get_extra_body()
            
        # Close body and HTML tags
        html += '</body>' + lineBreak 
        html += '</html>'
        
        # Remove ecuation attributes
        html = helper.removeEcuationAttr(html)
        # Change glosary path
        html = helper.changeGlossaryPath(html)
        # Escape &
        html = helper.escapeAmp(html)
        # Remove "resources/" from data="resources/ and the url param
        html = helper.removeResources(html)

        return html

    def renderHeader(self, title, docType, for_print = 0):
        """
        Returns an XHTML string for the header of this page.
        """
        
        # Check what iDevices and special features the node has
        hasGallery = helper.hasGalleryIdevice(self.node)
        hasEffects = helper.hasFX(self.node)
        hasHighlighter = helper.hasSH(self.node)
        hasJSGames = helper.hasGames(self.node)
        hasWikipedia = helper.hasWikipediaIdevice(self.node)
        hasMediaelement = helper.nodeHasMediaelement(self.node)
        hasABCMusic = helper.nodeHasABCMusic(self.node)
        listIdevicesFiles = helper.addListIdevicesFiles(self.node)

        # Get package language
        lang = G.application.config.locale
        if self.node.package.dublinCore.language != '':
            lang = self.node.package.dublinCore.language
        
        # Write page DocType and HTML start tag
        if docType == 'HTML5':
            html = '<!DOCTYPE html>' + lineBreak
            html += '<html lang="%s">%s' % (lang, lineBreak)
        else:
            html = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">' + lineBreak
            html += '<html lang="%s" xml:lang="%s" xmlns="http://www.w3.org/1999/xhtml">%s' % (lang, lang, lineBreak)
        
        # HTML head start tag    
        html += '<head>' + lineBreak
        
        # Page charset
        html += '<meta http-equiv="content-type" content="text/html; charset=utf-8" />' + lineBreak
        
        # Page title
        html += '<title>%s</title>%s' % (title, lineBreak)
        
        # Favicon
        html += '<link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />' + lineBreak
        
        # If the page is not in HTML5, we need to specify the language here
        if docType != 'HTML5' and self.node.package.dublinCore.language != '':
            html += '<meta http-equiv="content-language" content="%s" />%s' % (lang, lineBreak)
        
        # Render the author META tag
        if self.node.package.author != "":
            html += '<meta name="author" content="%s" />%s' % (escape(self.node.package.author, True), lineBreak)
            
        # Render the license META tag(s)
        html += common.getLicenseMetadata(self.node.package.license)
        
        # Render the generator META tag
        html += '<meta name="generator" content="eXeLearning %s - exelearning.net" />%s' % (release, lineBreak)
        
        # Render the description META tag
        if self.node.package.description != "":
            desc = self.node.package.description
            # If the description has any double quotes, we have to escape them
            desc = desc.replace('"', '&quot;')        
            html += '<meta name="description" content="%s" />%s' % (desc, lineBreak)
            
        # Add CSS files
        html += '<link rel="stylesheet" type="text/css" href="base.css" />' + lineBreak
        if hasWikipedia:
            html += '<link rel="stylesheet" type="text/css" href="exe_wikipedia.css" />' + lineBreak
        if hasGallery:
            html += '<link rel="stylesheet" type="text/css" href="exe_lightbox.css" />' + lineBreak
        if hasEffects:
            html += '<link rel="stylesheet" type="text/css" href="exe_effects.css" />' + lineBreak
        if hasHighlighter:
            html += '<link rel="stylesheet" type="text/css" href="exe_highlighter.css" />' + lineBreak
        if hasJSGames:
            html += '<link rel="stylesheet" type="text/css" href="exe_games.css" />' + lineBreak
        if hasABCMusic:
            html += '<link rel="stylesheet" type="text/css" href="exe_abcmusic.css" />' + lineBreak           
        html += '<link rel="stylesheet" type="text/css" href="content.css" />' + lineBreak
        
        # Add HTML compatibility script to IE 9
        if docType == "HTML5" or hasMediaelement:
            html += '<!--[if lt IE 9]><script type="text/javascript" src="exe_html5.js"></script><![endif]-->' + lineBreak
        
        # Get the style
        style = G.application.config.styleStore.getStyle(self.node.package.style)
        
        # Add JS files
        if style.hasValidConfig():
            if style.get_jquery() == True:
                html += '<script type="text/javascript" src="exe_jquery.js"></script>' + lineBreak
            else:
                html += '<script type="text/javascript" src="%s"></script>%s' % (style.get_jquery(), lineBreak)
        else:
            html += '<script type="text/javascript" src="exe_jquery.js"></script>' + lineBreak
        if hasGallery:
            html += '<script type="text/javascript" src="exe_lightbox.js"></script>' + lineBreak
        if hasEffects:
            html += '<script type="text/javascript" src="exe_effects.js"></script>' + lineBreak
        if hasHighlighter:
            html += '<script type="text/javascript" src="exe_highlighter.js"></script>' + lineBreak
        html += '<script type="text/javascript" src="common_i18n.js"></script>' + lineBreak
        if hasJSGames:
            html += '<script type="text/javascript" src="exe_games.js"></script>' + lineBreak
        if hasABCMusic:
            html += '<script type="text/javascript" src="exe_abcmusic.js"></script>' + lineBreak            
        html += '<script type="text/javascript" src="common.js"></script>' + lineBreak
        gamesJS=''
        for ideviceFile in set(listIdevicesFiles):
            gamesJS+=ideviceFile
        find = set()
        cleanarray = []
        for line in gamesJS.splitlines():
            if line not in find:
                find.add(line)
                cleanarray.append(line)
        gamesJS='\n'.join(cleanarray)
        html+=gamesJS
        
        if common.hasMagnifier(self.node):
            html += '<script type="text/javascript" src="mojomagnify.js"></script>' + lineBreak
            
        # include extra print-script for onload bit
        if for_print:
            html += '<script type="text/javascript">' + lineBreak
            html += 'var interval;' + lineBreak
            html += 'function checkClose() {' + lineBreak
            html += '    if (document.hasFocus()) {' + lineBreak
            html += '        alert("' + _("You can close this window") + '");' + lineBreak
            html += '        clearInterval(interval);' + lineBreak
            #html += u'        window.close();' + lineBreak
            html += '    }' + lineBreak
            html += '}' + lineBreak
            html += 'function print_page() {' + lineBreak
            html += '     if(typeof document.hasFocus === "undefined") {' + lineBreak
            html += '         document.hasFocus = function () {' + lineBreak
            html += '             return document.visibilityState == "visible";' + lineBreak
            html += '         }' + lineBreak
            html += '     }' + lineBreak
            html += '     window.print();' + lineBreak
            html += '     interval = setInterval(checkClose, 300);' + lineBreak
            html += '}' + lineBreak
            html += '</script>' + lineBreak
            
        if style.hasValidConfig():
            html += style.get_extra_head()
            
        html += common.getExtraHeadContent(self.node.package)
        
        # Close head tag
        html += '</head>' + lineBreak
        
        return html
    
    def renderNode(self, node, docType, level):
        """
        Returns an XHTML string for this node and recurse for the children
        """
        
        # Get section and header tags
        headerTag = 'div'
        articleTag = 'div'
        if docType == 'HTML5':
            headerTag = 'header'
            articleTag = 'article'
        
        headerLevel = level
        if(level > 6):
            headerLevel = 6
        
        html = ''
        # Main node container
        html += '<%s class="node level-%d-node" id="exe-node-%s">%s' % (articleTag, level, node.id, lineBreak)
        
        # Node header container
        html += '<%s class="nodeDecoration">%s' % (headerTag, lineBreak)
        # Node title
        html += '<h1 id="%s" class="nodeTitle">%s</h1>%s' % (node.GetAnchorName(), escape(node.titleLong), lineBreak)
        # Close Node header container
        html += '</%s>%s' % (headerTag, lineBreak)
        
        # Get the node Style
        style = self.node.package.style

        # Set node export type
        node.exportType = 'singlepage'
        
        # Render node iDevices
        for idevice in node.idevices:
            if idevice.klass != 'NotaIdevice':
                e = " em_iDevice"
                if idevice.icon and idevice.icon != "":
                    _iconNameToClass = re.sub('[^A-Za-z0-9_-]+', '', idevice.icon) # Allowed CSS classNames only
                    if _iconNameToClass!="":        
                        e += ' em_iDevice_'+_iconNameToClass
                if str(idevice.emphasis) == '0':
                    e = ""
                # iDevice container
                html += '<%s class="iDevice_wrapper %s%s" id="id%s">%s' % (articleTag, idevice.klass, e, (idevice.id + '-' + node.id), lineBreak)
                
                # Try to render the iDevice
                block = g_blockFactory.createBlock(None, idevice)
                if not block:
                    log.critical('Unable to render iDevice %s.' % (idevice.klass))
                    raise Error('Unable to render iDevice.')
                
                if hasattr(idevice, "isQuiz"):
                    html += block.renderJavascriptForWeb()
                
                # Process iDevice internal links
                html += helper.processInternalLinks(self.node.package, block.renderView(style))
                
                # Replace top links with "empty" links
                html = helper.replaceTopLinks(html)
                
                # Close iDevice container
                html += '</%s>%s' % (articleTag, lineBreak)

        # Close main node container
        html += '</%s>%s' % (articleTag, lineBreak)

        # Render all child nodes
        for child in node.children:
            html += self.renderNode(child, docType, level + 1)

        return html
