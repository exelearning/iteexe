# ===========================================================================
# eXe
# Copyright 2004-2006, University of Auckland
# Copyright 2004-2007 eXe Project, http://eXeLearning.org/
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
This module is for the common HTML used in all webpages.
"""

import logging
import os
from nevow                     import tags as T
from nevow.flat                import flatten
from exe                       import globals as G
from exe.engine.path           import Path
from exe.webui.blockfactory    import g_blockFactory
from exe.engine.error          import Error
from cgi                       import escape
# jrf:sorry if this a terrible mistake, I need to fix this to be able to test the translations
# from BeautifulSoup             import BeautifulSoup
from bs4                       import BeautifulSoup
import re

htmlDocType=''
lastId = 0

def newId():
    """
    Generates a sequential id unique for this exe session.
    """
    global lastId
    lastId += 1
    return 'id%d' % lastId


log = logging.getLogger(__name__)

def copyFileIfNotInStyle(file, e, outputDir):
    f = (e.imagesDir/file)
    if not (outputDir/file).exists():
        f.copyfile(outputDir/file)
def setExportDocType(value):
    global htmlDocType
    htmlDocType=value

def getExportDocType():
    # If HTML5 webui/scripts/exe_html5.js has to be in the package resources list
    return htmlDocType

def docType():
    dT = htmlDocType #getExportDocType()
    lb = "\n" #Line breaks
    """Generates the documentation type string"""
    if dT == "HTML5":
        return '<!DOCTYPE html>'+lb
    else:
        return (u'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">'+lb)

def getExtraHeadContent(package):
    # Custom HEAD (see PackagePanel.js)
    if hasattr(package, '_extraHeadContent'):
        return package._extraHeadContent
    else:
        return ''

def exportJavaScriptIdevicesFiles(iDevices, outputDir):
    """ Copy all the JS iDevices export files in outputDir """
    from exe.engine.jsidevice import JsIdevice
    # TODO: Find a way to not copy already existing files
    for idevice in iDevices:
        # We only want to copy JS iDevices resources
        if type(idevice) is JsIdevice and idevice.get_export_folder() is not None:
            iDeviceFiles = G.application.config.jsIdevicesDir/idevice.get_export_folder()
            iDeviceFiles.copyfiles(outputDir)

def printJavaScriptIdevicesScripts(mode, page):
    """ Prints the required scripts for the JS iDevices of the page """
    from exe.engine.node import Node
    html = ''

    resources = []

    # If the page doesn't have blocks, it means we are exporting
    if not hasattr(page, 'blocks'):
        if type(page) is Node:
            idevices = page.idevices
        else:
            idevices = page.node.idevices
        # Edition SCRIPTS:
        for idevice in idevices:
             # We only want to add the scripts if the iDevice is a JavaScript iDevice
             # TODO: Find a better way to do this
            if(hasattr(idevice, '_iDeviceDir')):
                # We go through all the resources
                for res in idevice.getResourcesList(appendPath = False):
                    if res not in resources:
                        resources.append(res)

                        # Add a link if it is a CSS file
                        if res.endswith('.css'):
                            html += '<link rel="stylesheet" type="text/css" href="' + res + '" />\n'
                        # Add a script tag if it is a JavaScript file
                        elif res.endswith('.js'):
                            html += '<script type="text/javascript" src="' + res + '"></script>\n'
    else:
        if mode == 'edition':
            # Edition SCRIPTS:
            for block in page.blocks:
                 # We only want to add the scripts if the iDevice is a JavaScript iDevice
                 # TODO: Find a better way to do this
                if(hasattr(block.idevice, '_iDeviceDir')):
                    # We go through all the resources
                    for res in block.idevice.getResourcesList(block.mode == 0):
                        if res not in resources:
                            resources.append(res)

                            # Add a link if it is a CSS file
                            if res.endswith('.css'):
                                html += '<link rel="stylesheet" type="text/css" href="/scripts/idevices/' + res + '" />\n'
                            # Add a script tag if it is a JavaScript file
                            elif res.endswith('.js'):
                                html += '<script type="text/javascript" src="/scripts/idevices/' + res + '"></script>\n'

                    if block.mode == 0 and "iDevice_init" not in resources:
                        resources.append("iDevice_init")

                        # Init iDevice
                        html += '<script type="text/javascript">jQuery(function(){$exeAuthoring.iDevice.init()})</script>\n'

        else:
            # Edition SCRIPTS:
            for block in page.blocks:
                 # We only want to add the scripts if the iDevice is a JavaScript iDevice
                 # TODO: Find a better way to do this
                if(hasattr(block.idevice, '_iDeviceDir')):
                    # We go through all the resources
                    for res in block.idevice.getResourcesList(appendPath = False):
                        if res not in resources:
                            resources.append(res)

                            # Add a link if it is a CSS file
                            if res.endswith('.css'):
                                html += '<link rel="stylesheet" type="text/css" href="' + res + '" />\n'
                            # Add a script tag if it is a JavaScript file
                            elif res.endswith('.js'):
                                html += '<script type="text/javascript" src="' + res + '"></script>\n'

    return html

def getJavascriptIdevicesResources(page, xmlOutput = False):
    """ Get the resources list for the page's JS iDevices """
    resources = []

    for idevice in page.node.idevices:
         # We only want to add the scripts if the iDevice is a JavaScript iDevice
         # TODO: Find a better way to do this
        if(hasattr(idevice, '_iDeviceDir')):
            resources = resources + idevice.getResourcesList(appendPath = False)


    if(xmlOutput):
        result = ""

        resourcesAux = []

        for resource in resources:
            if resource not in resourcesAux:
                resourcesAux.append(resource)

                result += "    <file href=\"" + escape(resource) + "\"/>\n"

        return result
    else:
        return resources

def getLicenseMetadata(license):
    if license == "":
        return ""

    licenses = getPackageLicenses()
    if license in licenses:
        lb = "\n" #Line breaks
        l = licenses[license][1]
        if l:
            return '<link rel="license" type="text/html" href="'+l+'" />'+lb
        else:
            return ""
    else:
        return ""

def getPackageLicenses():
    '''
        "license name" : [
            c_("license name"),
            "license url",
            "css class",
            0 for old licenses and 1 for the new ones
        ]
    '''
    licenses = {
        "creative commons: attribution 4.0" : [
            c_("Creative Commons Attribution License 4.0"),
            "http://creativecommons.org/licenses/by/4.0/",
            "cc cc-by",
            1
        ],
        "creative commons: attribution - share alike 4.0" : [
            c_("Creative Commons Attribution Share Alike License 4.0"),
            "http://creativecommons.org/licenses/by-sa/4.0/",
            "cc cc-by-sa",
            1
        ],
        "creative commons: attribution - non derived work 4.0" : [
            c_("Creative Commons Attribution No Derivatives License 4.0"),
            "http://creativecommons.org/licenses/by-nd/4.0/",
            "cc cc-by-nd",
            1
        ],
        "creative commons: attribution - non commercial 4.0" : [
            c_("Creative Commons Attribution Non-commercial License 4.0"),
            "http://creativecommons.org/licenses/by-nc/4.0/",
            "cc cc-by-nc",
            1
        ],
        "creative commons: attribution - non commercial - share alike 4.0" : [
            c_("Creative Commons Attribution Non-commercial Share Alike License 4.0"),
            "http://creativecommons.org/licenses/by-nc-sa/4.0/",
            "cc cc-by-nc-sa",
            1
        ],
        "creative commons: attribution - non derived work - non commercial 4.0" : [
            c_("Creative Commons Attribution Non-commercial No Derivatives License 4.0"),
            "http://creativecommons.org/licenses/by-nc-nd/4.0/",
            "cc cc-by-nc-nd",
            1
        ],
        "license GFDL" : [
           c_("GNU Free Documentation License"),
           "http://www.gnu.org/copyleft/fdl.html",
           "gfdl",
            1
        ],
        "free software license GPL" : [
            c_("GNU General Public License"),
            "http://www.gnu.org/copyleft/gpl.html",
            "gpl",
            1
        ],
        "free software license GPL" : [
            c_("GNU General Public License"),
            "http://www.gnu.org/copyleft/gpl.html",
            "gpl",
            1
        ],
        "public domain" : [
            c_("public domain"),
            "",
            "public-domain",
            1
        ],
        "free software license EUPL" : [
            c_("free software license EUPL"),
            "",
            "free-software",
            1
        ],
        "free software license GPL" : [
            c_("free software license GPL"),
            "",
            "gpl",
            1
        ],
        "dual free content license GPL and EUPL" : [
            c_("dual free content license GPL and EUPL"),
            "",
            "gpl-eupl",
            1
        ],
        "other free software licenses" : [
            c_("other free software licenses"),
            "",
            "other-free-software",
            1
        ],
        "propietary license" : [
            c_("propietary license"),
            "",
            "propietary",
            1
        ],
        "intellectual property license" : [
            c_("intellectual property license"),
            "",
            "",
            1
        ],
        "not appropriate" : [
            c_("not appropriate"),
            "",
            "none",
            1
        ],
        # Old licenses
        "creative commons: attribution 3.0" : [
            c_("Creative Commons Attribution License 3.0"),
            "http://creativecommons.org/licenses/by/3.0/",
            "cc cc-by",
            0
        ],
        "creative commons: attribution - share alike 3.0" : [
            c_("Creative Commons Attribution Share Alike License 3.0"),
            "http://creativecommons.org/licenses/by-sa/3.0/",
            "cc cc-by-sa",
            0
        ],
        "creative commons: attribution - non derived work 3.0" : [
            c_("Creative Commons Attribution No Derivatives License 3.0"),
            "http://creativecommons.org/licenses/by-nd/3.0/",
            "cc cc-by-nd",
            0
        ],
        "creative commons: attribution - non commercial 3.0" : [
            c_("Creative Commons Attribution Non-commercial License 3.0"),
            "http://creativecommons.org/licenses/by-nc/3.0/",
            "cc cc-by-nc",
            0
        ],
        "creative commons: attribution - non commercial - share alike 3.0" : [
            c_("Creative Commons Attribution Non-commercial Share Alike License 3.0"),
            "http://creativecommons.org/licenses/by-nc-sa/3.0/",
            "cc cc-by-nc-sa",
            0
        ],
        "creative commons: attribution - non derived work - non commercial 3.0" : [
            c_("Creative Commons Attribution Non-commercial No Derivatives License 3.0"),
            "http://creativecommons.org/licenses/by-nc-nd/3.0/",
            "cc cc-by-nc-nd",
            0
        ],
        "creative commons: attribution 2.5" : [
            c_("Creative Commons Attribution License 2.5"),
            "http://creativecommons.org/licenses/by/2.5/",
            "cc cc-by",
            0
        ],
        "creative commons: attribution - share alike 2.5" : [
            c_("Creative Commons Attribution Share Alike License 2.5"),
            "http://creativecommons.org/licenses/by-sa/2.5/",
            "cc cc-by-sa",
            0
        ],
        "creative commons: attribution - non derived work 2.5" : [
            c_("Creative Commons Attribution No Derivatives License 2.5"),
            "http://creativecommons.org/licenses/by-nd/2.5/",
            "cc cc-by-nd",
            0
        ],
        "creative commons: attribution - non commercial 2.5" : [
            c_("Creative Commons Attribution Non-commercial License 2.5"),
            "http://creativecommons.org/licenses/by-nc/2.5/",
            "cc cc-by-nc",
            0
        ],
        "creative commons: attribution - non commercial - share alike 2.5" : [
            c_("Creative Commons Attribution Non-commercial Share Alike License 2.5"),
            "http://creativecommons.org/licenses/by-nc-sa/2.5/",
            "cc cc-by-nc-sa",
            0
        ],
        "creative commons: attribution - non derived work - non commercial 2.5" : [
            c_("Creative Commons Attribution Non-commercial No Derivatives License 2.5"),
            "http://creativecommons.org/licenses/by-nc-nd/2.5/",
            "cc cc-by-nc-nd",
            0
        ]
    }

    return licenses

def renderLicense(plicense,mode="export"):
    """
    Returns an XHTML string rendering the license.
    """
    if plicense in ["", "not appropriate", "None"]:
        return ""

    licenses = getPackageLicenses()

    html = ""
    lb = "\n" #Line breaks

    if plicense in licenses:
        target = ""
        if mode == "authoring":
            target = ' target="_blank"'
        html += '<div id="packageLicense" class="'+licenses[plicense][2]+'">'+lb
        html += '<p><span>'
        if licenses[plicense][1] != "":
            html += c_("Licensed under the")
            html += '</span> '
            html += '<a rel="license" href="%s"%s>%s</a>' % (licenses[plicense][1], target, licenses[plicense][0])
        else:
            html += c_("License:")+" "
            html += '</span> '
            html += licenses[plicense][0]
        if plicense == 'license GFDL':
            link = "fdl.html"
            if mode == "authoring":
                link = "/templates/fdl.html"
            html += ' <a href="'+link+'" class="local-version"'+target+'>(%s)</a>' % c_('Local Version')
        html += '</p>'+lb
        html += '</div>'+lb
    else:
        html += '<div id="packageLicense">'+lb
        html += '<p>'+plicense+'</p>'+lb
        html += '</div>'

    return html

def renderFooter(footer):
    """
    Returns an XHTML string rendering the footer.
    """
    html = ""
    if footer != "":
        dT = getExportDocType()
        footerTag = "div"
        if dT == "HTML5":
            footerTag = "footer"
        html += '<' + footerTag + ' id="siteFooter">'
        html += footer + "</" + footerTag + ">"
    return html

def themeHasConfigXML(style):
    themePath = Path(G.application.config.stylesDir/style)
    themeXMLFile = themePath.joinpath("config.xml")
    themeHasXML = False
    if themeXMLFile.exists():
        themeHasXML = True
    return themeHasXML

def javaScriptIsRequired():
    return '<span class="js-hidden js-warning">' + c_("Enable JavaScript")+'</span>'

def ideviceHeader(e, style, mode):
    dT = getExportDocType()
    lb = "\n" #Line breaks
    #Default HTML tags:
    articleTag = "div"
    headerTag = "div"
    titleTag = "h2"
    if dT == "HTML5":
        articleTag = "article"
        headerTag = "header"
        titleTag = "h1"
        if hasattr(e.idevice.parentNode, 'exportType') and e.idevice.parentNode.exportType == 'singlepage':
            titleTag = "h2"

    themePath = Path(G.application.config.stylesDir/style)
    themeXMLFile = themePath.joinpath("config.xml")
    themeHasXML = themeHasConfigXML(style)

    w = '' # Common wrapper
    o = '' # Old HTML (themes with no config.xml file)
    h = '' # New HTML
    w2 = ''
    eEm = ''

    if ((e.idevice.emphasis > 0) and (G.application.ideviceStore.isJs(e.idevice) == False)) or (
        ((e.idevice.title != "") or (e.idevice.icon != "")) and (G.application.ideviceStore.isJs(e.idevice) == True)) :

        w2 = '<div class="iDevice_inner">'+lb
        w2 += '<div class="iDevice_content_wrapper">'+lb
        eEm = ' em_iDevice'
        if e.idevice.icon != "":
            eEm += ' em_iDevice_'+e.idevice.icon

    if mode=="preview" and themeHasXML:
        w += '<'+articleTag+' class="iDevice_wrapper '+e.idevice.klass+eEm+'" id="id'+e.id+'">'+lb

    w += u"<div class=\"iDevice emphasis"+unicode(e.idevice.emphasis)+"\" "
    if mode=="preview":
        w += u"ondblclick=\"submitLink('edit', "+e.id+", 0);\""
    w += ">"+lb

    if e.idevice.emphasis > 0:

        if e.idevice.icon:
            h += '<'+headerTag+' class="iDevice_header"'
            displayIcon = True
            # The following lines should be replaced by something like:
            '''
            if hasattr(e.idevice, 'originalicon'):
                if e.idevice.icon==e.idevice.originalicon:
                    displayIcon = False
            '''
            iconExists = False
            k = e.idevice.klass
            i = e.idevice.icon
            if (k=='ListaIdevice' and i=='question') or (k=='CasestudyIdevice' and i=='casestudy') or (k=='GalleryIdevice' and i=='gallery') or (k=='ClozeIdevice' and i=='question') or (k=='ReflectionIdevice' and i=='reflection') or (k=='QuizTestIdevice' and i=='question') or (k=='TrueFalseIdevice' and i=='question') or (k=='MultiSelectIdevice' and i=='question') or (k=='MultichoiceIdevice' and i=='question'):
                displayIcon = False
            # /end
            iconPath = '/style/'+style+'/icon_'+e.idevice.icon+'.gif'
            if mode=="view":
                iconPath = 'icon_'+e.idevice.icon+'.gif'
            myIcon = themePath.joinpath("icon_" + e.idevice.icon + ".gif")
            if myIcon.exists():
                iconExists = True
            else:
                myIcon = themePath.joinpath("icon_" + e.idevice.icon + ".png")
                if myIcon.exists():
                    iconExists = True
                    iconPath = '/style/'+style+'/icon_'+e.idevice.icon+'.png'
                    if mode=="view":
                        iconPath = 'icon_'+e.idevice.icon+'.png'
            if iconExists:
                o += u'<img alt="" class="iDevice_icon" src="'+iconPath+'" />'
            if (e.idevice.icon+"Idevice") != e.idevice.klass:
                if iconExists and displayIcon:
                    h += ' style="background-image:url('+iconPath+')"'
        else:
            h += '<'+headerTag+' class="iDevice_header iDevice_header_noIcon"'
#             h += ' style="background-image:none"'
            log.debug("Idevice %s at node %s has no icon" % (e.idevice._title, e.idevice.parentNode._title))
        t = e.idevice.title
        fullT = u'<'+titleTag+' class="iDeviceTitle">'+t+'</'+titleTag+'>'
        if (t == ""):
            fullT = u'<span class="iDeviceTitle">&nbsp;</span>'
        o += u"<"+titleTag+" class=\"iDeviceTitle\">"+t+"</"+titleTag+">"
        h += '>'
        h += fullT
        h += '</'+headerTag+'>'+lb

    if e.idevice.emphasis <= 0:
        h = ""
        o = ""
    if themeHasXML:
        return w+h+w2
    else:
        return w+o+w2

def ideviceFooter(e, style, mode):
    dT = getExportDocType()
    lb = "\n" #Line breaks
    #Default HTML tags:
    articleTag = "div"
    if dT == "HTML5":
        articleTag = "article"
    themeHasXML = themeHasConfigXML(style)
    h = ''

    if ((e.idevice.emphasis > 0) and (G.application.ideviceStore.isJs(e.idevice) == False)) or (
        ((e.idevice.title != "") or (e.idevice.icon != "")) and (G.application.ideviceStore.isJs(e.idevice) == True)) :

        h = "</div>"+lb # Close iDevice_content_wrapper
        h += "</div>"+lb # Close iDevice_inner

    h += "</div>"+lb # Close iDevice
    if mode=="preview":
        h += e.renderViewButtons()
    if mode=="preview" and themeHasXML:
        h += "</"+articleTag+">"+lb # Close iDevice_wrapper
    return h

def ideviceHint(content, mode, level='h3'):
    if content!="":
        html = ''
        lb = "\n" #Line breaks
        dT = getExportDocType()
        sectionTag = "div"
        if dT == "HTML5":
            sectionTag = "section"
            level = "h1"
        #  Image paths
        if mode=="preview":
            img1 = "/images/panel-amusements.png"
            img2 = "/images/stock-stop.png"
            html += '<script type="text/javascript">$exe.hint.imgs=["'+img1+'","'+img2+'"]</script>'+lb
        # Hint content
        html += '<'+sectionTag+' class="iDevice_hint">'+lb
        html += '<'+level+' class="iDevice_hint_title">' + c_("Hint")+'</'+level+'>'+lb
        html += '<div class="iDevice_hint_content js-hidden">'+lb
        html += content
        html += '</div>'+lb
        html += '</'+sectionTag+'>'+lb
        return html

def ideviceShowEditMessage(block):
    if block.idevice.message<>"":
       return editModeHeading(block.idevice.message)
    else:
        return ""
def fieldShowEditMessageEle(element):
    if element.field.message<> "":
        return editModeHeading(element.field.message)
    else:
        return ""

# Required until a better i18n solution works
def getJavaScriptStrings(addTag = True):
    s = ''
    if addTag:
        s += '<script type="text/javascript">'
    s += '$exe_i18n={'
    s += 'previous:"'+c_("Previous")+'",'
    s += 'next:"'+c_("Next")+'",'
    s += 'show:"'+c_("Show")+'",'
    s += 'hide:"'+c_("Hide")+'",'
    s += 'showFeedback:"'+c_("Show Feedback")+'",'
    s += 'hideFeedback:"'+c_("Hide Feedback")+'",'
    s += 'correct:"'+c_("Correct")+'",'
    s += 'incorrect:"'+c_("Incorrect")+'",'
    s += 'menu:"'+c_("Menu")+'",'
    s += 'download:"'+c_("Download")+'",'
    s += 'yourScoreIs:"'+c_("Your score is ")+'",'
    s += 'dataError:"'+c_("Error recovering data")+'",'
    s += 'epubJSerror:"'+c_("This might not work in this ePub reader.")+'",'
    s += 'epubDisabled:"'+c_("This activity does not work in ePub.")+'",'
    s += 'solution:"'+c_("Solution")+'",'
    s += 'print:"'+c_("Print")+'",'
    s += 'fullSearch:"'+c_("Search in all pages")+'",'
    s += 'noSearchResults:"'+c_("No results for %")+'",'
    s += 'searchResults:"'+c_("Search results for %")+'",'
    s += 'hideResults:"'+c_("Hide results")+'",'
    s += 'more:"'+c_("More")+'",'
    s += 'search:"'+c_("Search")+'"'
    s += '};'
    if addTag:
        s += '</script>'
    else:
        s += '\n'
    return s

# Required until a better i18n solution works
def getGamesJavaScriptStrings(addTag = True):
    s = ''
    if addTag:
        s += '<script type="text/javascript">'
    s += '$exe_i18n.exeGames={'
    s += 'hangManGame:"'+c_('Hangman Game')+'",'
    s += 'accept:"'+c_("Accept")+'",'
    s += 'yes:"'+c_("Yes")+'",'
    s += 'no:"'+c_("No")+'",'
    s += 'right:"'+c_("Correct")+'",'
    s += 'wrong:"'+c_("Wrong")+'",'
    s += 'rightAnswer:"'+c_("Right answer")+'",'
    s += 'stat:"'+c_("Status")+'",'
    s += 'selectedLetters:"'+c_("Selected letters")+'",'
    s += 'word:"'+c_("Word")+'",'
    s += 'words:"'+c_("Words")+'",'
    s += 'play:"'+c_("Play")+'",'
    s += 'playAgain:"'+c_("Restart")+'",'
    s += 'results:"'+c_("Results")+'",'
    s += 'total:"'+c_("Total")+'",'
    s += 'otherWord:"'+c_("Another word")+'",'
    s += 'gameOver:"'+c_("Game over.")+'",'
    s += 'confirmReload:"'+c_("Reload the game?")+'",'
    s += 'clickOnPlay:\''+c_('Click on "Play" to start a new game.')+'\','
    s += 'clickOnOtherWord:\''+c_('Click on "Another word" to continue.')+'\','
    s += 'az:"'+c_("abcdefghijklmnopqrstuvwxyz")+'"'
    s += '};'
    if addTag:
        s += '</script>'
    else:
        s += '\n'
    return s

def header(style=u'default'):
    """Generates the common header XHTML"""
    # NB: Authoring Page has its own header
    return (docType() +
            u'<html xmlns="http://www.w3.org/1999/xhtml">\n'
            u'<head>\n'
            u'<style type="text/css">\n'
            u'  @import url(/css/exe.css);\n'
            u'  @import url(/style/base.css);\n'
            u'  @import url(/style/%s/content.css);</style>\n'
            u'<script type="text/javascript" src="/scripts/common.js">'
            u'</script>\n'
            u'<title>%s</title>\n'
            u'<meta http-equiv="content-type" '
            u' content="text/html; charset=UTF-8"></meta>\n'
            u'</head>\n'
            % (style, c_('eXe : elearning XHTML editor')))


def footer():
    """Generates the common page footer XHTML"""
    return u'</form></body></html>\n'


def hiddenField(name, value=u""):
    """Adds a hidden field to a form"""
    html  = u"<input type=\"hidden\" "
    html += u"name=\"%s\" " % name
    html += u"id=\"%s\" " % name
    html += u"value=\"%s\"/>\n" % value
    return html


def textInput(name, value=u"", size=40, disabled=u"", **kwargs):
    """Adds a text input to a form"""
    html  = u"<input type=\"text\" "
    html += u"name=\"%s\" " % name
    html += u"id=\"%s\" " % name
    html += u"value=\"%s\" " % value
    html += u"size=\"%s\" " % size
    for key, val in kwargs.items():
        html += u' %s="%s"' % (key.replace('_', ''), val.replace('"', '\\"'))
    html += disabled+u" />\n"
    return html


def textArea(name, value="", disabled="", cols="80", rows="8", cssClass="", package=None):
    """Adds a text area to a form"""
    log.debug(u"textArea %s" % value)
    html  = u'<textarea name="%s" ' % name
    html += 'id = "%s"' % name
    if disabled:
        html += u'disabled="disabled" '
    html += u'style=\"width:100%"'
    html += u'cols="%s" rows="%s" class="%s">' %(cols, rows, cssClass)
    # to counter TinyMCE's ampersand-processing:
    safe_value = value.replace('&','&amp;')
    if (cssClass=="jsContentEditor"):
        if safe_value != value:
            value = safe_value
            log.debug(u"jsContentEditor pre-processed value to: %s" % value)    
    html += value
    html += u'</textarea>'
    
    html_js = ''
    # There's probably an editor in the JavaScript iDevice, so we add the nodes list (tinymce_anchors)
    if (cssClass=="jsContentEditor"):
        html_js = '<script type="text/javascript">if (typeof(tinymce_anchors)=="undefined") var tinymce_anchors = [];'    
        ########
        # add exe_tmp_anchor tags
        # for ALL anchors available in the entire doc!
        # (otherwise TinyMCE will only see those anchors within this field)
        if package is not None and hasattr(package, 'anchor_fields') \
        and package.anchor_fields is not None \
        and G.application.config.internalAnchors!="disable_all" :
            # only add internal anchors for
            # config.internalAnchors = "enable_all" or "disable_autotop"
            log.debug(u"textArea adding exe_tmp_anchor tags for user anchors.")
            for anchor_field in package.anchor_fields:
                anchor_field_path = anchor_field.GetFullNodePath()
                for anchor_name in anchor_field.anchor_names:
                    full_anchor_name = anchor_field_path + "#" + anchor_name
                    html_js += u'tinymce_anchors'
                    html_js += u'.push("%s");' % full_anchor_name
        # and below the user-defined anchors, also show "auto_top" anchors for ALL:
        if package is not None and package.root is not None \
        and G.application.config.internalAnchors=="enable_all" :
            # only add auto_top anchors for
            # config.internalAnchors = "enable_all"
            # log.debug(u"textArea adding exe_tmp_anchor auto_top for ALL nodes.")
            node_anchors = True
            if node_anchors:
                root_node = package.root
                anchor_node_path = root_node.GetFullNodePath() + "#auto_top"
                html_js += u'tinymce_anchors'
                html_js += u'.push("%s");' % anchor_node_path
                for this_node in root_node.walkDescendants():
                    anchor_node_path = this_node.GetFullNodePath() + "#auto_top"
                    html_js += u'tinymce_anchors'
                    html_js += u'.push("%s");' % anchor_node_path
        # these exe_tmp_anchor tags will be removed when processed by
        # FieldWithResources' ProcessPreviewed()
        ########
        html_js  += '</script>'
    
    return html + html_js


def richTextArea(name, value="", width="100%", height=100, cssClass='mceEditor', package=None):
    """Adds a editor to a form"""
    log.debug(u"richTextArea %s, height=%s" % (value, height))
    # to counter TinyMCE's ampersand-processing:
    safe_value = value.replace('&','&amp;')
    if safe_value != value:
        value = safe_value
        log.debug(u"richTextArea pre-processed value to: %s" % value)
    html  = u'<textarea name="%s" ' % name
    html_js  = '<script type="text/javascript">if (typeof(tinymce_anchors)=="undefined") var tinymce_anchors = [];'
    html += u'style=\"width:' + width + '; height:' + str(height) + 'px;" '
    html += u'class=\"%s\" ' % cssClass
    html += u'cols="52" rows="8">'
    ########
    # add exe_tmp_anchor tags
    # for ALL anchors available in the entire doc!
    # (otherwise TinyMCE will only see those anchors within this field)
    if package is not None and hasattr(package, 'anchor_fields') \
    and package.anchor_fields is not None \
    and G.application.config.internalAnchors!="disable_all" :
        # only add internal anchors for
        # config.internalAnchors = "enable_all" or "disable_autotop"
        log.debug(u"richTextArea adding exe_tmp_anchor tags for user anchors.")
        for anchor_field in package.anchor_fields:
            anchor_field_path = anchor_field.GetFullNodePath()
            for anchor_name in anchor_field.anchor_names:
                full_anchor_name = anchor_field_path + "#" + anchor_name
                html_js += u'tinymce_anchors'
                html_js += u'.push("%s");' % full_anchor_name
    # and below the user-defined anchors, also show "auto_top" anchors for ALL:
    if package is not None and package.root is not None \
    and G.application.config.internalAnchors=="enable_all" :
        # only add auto_top anchors for
        # config.internalAnchors = "enable_all"
        # log.debug(u"richTextArea adding exe_tmp_anchor auto_top for ALL nodes.")
        node_anchors = True
        if node_anchors:
            root_node = package.root
            anchor_node_path = root_node.GetFullNodePath() + "#auto_top"
            html_js += u'tinymce_anchors'
            html_js += u'.push("%s");' % anchor_node_path
            for this_node in root_node.walkDescendants():
                anchor_node_path = this_node.GetFullNodePath() + "#auto_top"
                html_js += u'tinymce_anchors'
                html_js += u'.push("%s");' % anchor_node_path
    # these exe_tmp_anchor tags will be removed when processed by
    # FieldWithResources' ProcessPreviewed()
    ########
    html += value
    html += u'</textarea>'
    html_js  += '</script>'
    new_html = html+html_js
    return new_html


def image(name, value, width="", height="", alt=None, cssClass=None):
    """Returns the XHTML for an image"""
    if alt is None:
        alt = name
    log.debug(u"image %s" % value)
    html  = u"<img id=\"%s\" " % name
    html += u'alt="%s" ' % alt
    if width:
        html += u"width=\"%s\" " % width
    if height:
        html += u"height=\"%s\" " % height
    if cssClass:
        html += u"class=\"%s\" " % cssClass
    html += u"src=\"%s\" " % value
    html += u"/>\n"
    return html

def flash(src, width, height, id_=None, params=None, **kwparams):
    """Returns the XHTML for flash.
    'params' is a dictionary of name, value pairs that will be turned into a
    bunch of <param> tags"""
    log.debug(u"flash %s" % src)
    stan = \
        T._object(type='application/x-shockwave-flash',
                 width=width,
                 height=height,
                 **kwparams)
    if id_:
        stan.attributes['id'] = id_
    stan.attributes['data'] = src
    if params is None:
        params = {}
    params.setdefault('movie', src)
    for name, value in params.items():
        stan = stan[T.param(name=name, value=value)]
    return unicode(flatten(stan).replace('&amp;', '&'), 'utf8')

def flashMovie(movie, width, height, resourcesDir='', autoplay='false'):
    """Returns the XHTML for a flash movie"""
    log.debug(u"flash %s" % movie)
    src = resourcesDir + 'flowPlayer.swf'
    params={'movie': src,
            'allowScriptAccess' :'sameDomain',
            'quality' :'high',
            'scale':'noScale',
            'wmode':'transparent',
            'allowNetworking':'all',
            'flashvars' : 'config={ '
                'autoPlay: %(autoplay)s, '
                'loop: false, '
                'initialScale: \'scale\', '
                'showLoopButton: false, '
                'showPlayListButtons: false, '
                'playList: [ { url: \'%(movie)s\' }, ]'
            '}' % {'movie': movie, 'autoplay': autoplay}
            }
    return flash(src, width, height, id="flowPlayer", params=params)


def submitButton(name, value, enabled=True, **kwargs):
    """Adds a submit button to a form"""
    lb = "\n" #Line breaks
    html  = '<input class="button" type="submit" name="%s" ' % name
    html += 'value="%s" ' % value
    if not enabled:
        html += ' disabled="disabled"'
    for key, val in kwargs.items():
        html += ' %s="%s"' % (key.replace('_', ''), val.replace('"', '\\"'))
    html += ' />'+lb
    return html


def button(name, value, enabled=True, **kwargs):
    """Adds a NON-submit button to a form"""
    lb = "\n" #Line breaks
    html  = '<input type="button" name="%s"' % name
    html += ' value="%s"' % value
    if not enabled:
        html += ' disabled="disabled"'
    for key, val in kwargs.items():
        html += u' %s="%s"' % (key.replace('_', ''), val.replace('"', '\\"'))
    html += ' />'+lb
    return html

def feedbackBlock(id,feedback,buttonCaption=""):
    buttonText = c_('Show Feedback')
    changeText = 'true'
    buttonCaptionArr=[]
    buttonTextAll = buttonText
    if buttonCaption != "":
        buttonTextAll = buttonCaption
        buttonCaptionArr=buttonCaption.split('|')
        buttonText=buttonCaptionArr[0]
        changeText = 'false' # Do not change the text on click if the text is defined by the user or the iDevice
    lb = "\n" #Line breaks
    dT = getExportDocType()
    sectionTag = "div"
    titleTag = "h3"
    if dT == "HTML5":
        sectionTag = "section"
        titleTag = "h1"
    html = '<form name="feedback-form-'+id+'" action="#" onsubmit="return false" class="feedback-form">'
    html += lb
    html += '<div class="block iDevice_buttons feedback-button js-required">'+lb
    html += '<p>'
    html += '<script type="text/javascript">var feedback'+id+'text = "'+buttonTextAll+'";</script>'
    html += '<input type="button" name="toggle-feedback-'+id+'" value="'+ buttonText+'" class="feedbackbutton feedback-toggler" />'
    html += '</p>'+lb
    html += '</div>'+lb
    html += '<'+sectionTag+' id="feedback-'+id+'" class="feedback js-feedback js-hidden">'+lb
    html += '<'+titleTag+' class="js-sr-av">'+ c_('Feedback')+'</'+titleTag+'>'+lb
    html += feedback
    html += "</"+sectionTag+">"+lb
    html += "</form>"+lb
    return html


def feedbackButton(name, value=None, enabled=True, **kwparams):
    """Adds a feedback button"""
    if value is None:
        value = c_(u'Feedback')
    kwparams.setdefault('class', 'feedbackbutton')
    return button(name, value, enabled, **kwparams)


def submitImage(action, object_, imageFile, title=u"", isChanged=1, relative=False):
    """
    Adds an image link which will trigger the javascript needed to
    post a form with the action and object passed in the args
    """
    onclick = "submitLink('%s', '%s', %d);" % (action, object_, isChanged)
    titleText = u''
    if title:
        titleText = u'title="%s" ' % title
    relativeText = u''
    if relative:
        relativeText = u'style="position:relative;z-index:100000"'
    html  = u'<a %s' % titleText
    html += u' href="#" onclick="%s" %s>' % (onclick, relativeText)
    html += u'<img alt="%s" class="submit" width="16" height="16" src="%s" />' % (title, imageFile)
    html += u'</a>\n'
    return html

def insertSymbol(name, image, title, string, text ='', num=0):
    """
    Adds an image link which will trigger the javascript needed to
    post a form with the action and object passed in the args
    """
    onclick = "$exe.insertSymbol('%s', '%s', %d);" % (name, string, num)
    html = u'<a onclick="%s" ' % onclick
    html += u'title="%s">' % title
    html += text
    if image <> "":
        html += u'<img alt="%s" src="%s"/>' % ('symbol', image)
    html += u'</a>\n'
    return html

def confirmThenSubmitImage(message, action, object_, imageFile,
                           title=u"", isChanged=1):
    """
    Adds an image link which will trigger the javascript needed to
    post a form with the action and object passed in the args
    """
    html  = u"<a "
    if title:
        html += u"title=\""+title+"\" "
    html += " href=\"#\" "
    html += "onclick=\"confirmThenSubmitLink('"+re.escape(message)+"', '"+action+"', "
    html += "'"+object_+"', "+unicode(isChanged)+");\" >"
    html += u'<img alt="%s" class="submit" width="16" height="16" src="%s" />' % (title, imageFile)
    html += u'</a>\n'
    return html

def option(name, checked, value):
    """Add a option input"""
    chkStr = u''
    if checked:
        chkStr = u'checked="checked"'
    html  = (u'<input type="radio" name="%s"'
             u' value="%s" %s/>\n' %
              (name, value, chkStr))
    return html


def checkbox(name, checked, value="", title="", instruction=""):
    """Add a checkbox"""
    chkStr = u''
    if checked:
        chkStr = u'checked'
    html = ''
    if title:
        html += u'<b>%s</b>' % title
    html += (u'<input type="checkbox" name="%s"'
             u' value="%s" %s/>\n' %
              (name, value, chkStr))
    if instruction:
        html += elementInstruc(instruction)
    return html


def elementInstruc(instruc, imageFile="help.gif", label=None):
    """Add a help instruction for a element"""
    if label is None:
        label = _(u"Instructions")
    if not instruc.strip():
        html = u''
    else:
        id_ = newId()
        html  = u'<a href="javascript:void(o)" '
        html += u' title="%s" ' % _(u'Click for completion instructions')
        html += u'onclick="showMessageBox(\'%s\');" ' % id_
        html += u'style="cursor:help;margin-left:5px">'
        html += u'<img class="help" alt="%s" ' % _(u'Click for completion instructions')
        html += u'src="/images/%s" style="vertical-align:middle;"/>' % imageFile
        html += u'</a>\n'
        html += u'<span style="display:none;">'
        html += u'<span id="%stitle">%s</span> ' % (id_, label)
        html += u'<span id="%scontent">%s</span>' % (id_, instruc)
        html += u'</span>\n'
    return html

def formField(type_, package, caption, action, object_='', instruction='', \
        *args, **kwargs):
    """
    A standard way for showing any form field nicely
    package is only needed for richTextArea, to present all available internal anchors.
    """
    tag = 'p'
    css = 'exe-text-field'
    id = action+object_

    if type_ == 'select':
        css = 'exe-select-field'
    elif type_ == 'richTextArea':
        tag = 'div'
        css = 'exe-textarea-field'
    elif type_ == 'textArea':
        tag = 'div'
        css = 'exe-plain-textarea-field'
    elif type_ == 'checkbox':
        css = 'exe-checkbox-field'

    html  = '<'+tag+' class="'+css+'">'
    if caption!="" and type!='checkbox':
        html += '<label for="'+id+'"'
        if type_ == 'richTextArea':
            html += ' id="'+id+'-editor-label"' # ID to create the Show/Hide Editor Link
        html += '>%s</label>' % caption
    if instruction:
        html += elementInstruc(instruction)
    if type_ == 'select':
        html += select(action, object_, *args, **kwargs)
    elif type_ == 'richTextArea':
        html += richTextArea(action+object_, package=package, *args, **kwargs)
    elif type_ == 'textArea':
        html += textArea(action+object_, *args, **kwargs)
    elif type_ == 'textInput':
        html += textInput(action+object_, *args, **kwargs)
    elif type_ == 'checkbox':
        if caption!="":
            html += '<label for="'+args+'">'
        html += checkbox(*args, **kwargs)
        if caption!="":
            html += caption
            html += ' </label>'
    html += '</'+tag+'>'
    return html

def select(action, object_='', options=[], selection=None):
    """Adds a dropdown selection to a form"""
    html  = u'<select '
    html += u'name="'+action+object_+'" '

    if action and object_:
        # If the user gives an object_ create an onchange handler
        html += u'onchange="submitLink(\''+action+'\', \''+object_+'\');"'

    html += u'>\n'

    for option, value in options:
        html += u' <option value="'+unicode(value)+'" '
        if value == selection:
            html += u'selected="selected" '
        html += u'>'
        html += option
        html += u'</option>\n'
    html += u'</select>\n'

    return html

def editModeHeading(text):
    """
    Provides a styled editSectionHeading
    """
    return u'<p class="editModeHeading">%s</p>' % text



def removeInternalLinks(html, anchor_name=""):
    """
    take care of any internal links which are in the form of:
       href="exe-node:Home:Topic:etc#Anchor"
    For this non-Web  Export, go ahead and remove the link entirely,
    leaving only its text, since such links are not to be in the LMS.
    Used by:  SCORM, IMS, and Common Cartridge exports
    (note that the Text and iPod exports already remove any HTML tags)
    """
    # use lower-case for the exe-node, for TinyMCE copy/paste compatibility
    intlink_start = 'href="exe-node:'
    intlink_pre   = 'href="'
    last_end_pos = 0
    next_link_pos = html.find(intlink_start)
    while next_link_pos >= 0:
        link_name_start_pos = next_link_pos + len(intlink_pre)
        link_name_end_pos = html.find('"', link_name_start_pos)
        if link_name_end_pos >= 0:
            link_name = html[link_name_start_pos : link_name_end_pos]
            href_link_name = html[next_link_pos : link_name_end_pos]
            if anchor_name == "":
                # if no specific one specified, then removing all of them:
                log.warn("Export removing internal link: " + link_name)
                # otherwise we don't yet know if this link should be removed

            # Okay, try backing up to find the beginning <a of the href:
            # =====> Ideally, eventually do the full tag processing here!
            openA_start_pos = html.rfind('<a ', last_end_pos, next_link_pos)
            openA_end_pos = -1
            if openA_start_pos >= 0:
                openA_end_pos = html.find('>', openA_start_pos)
            closeA_start_pos = -1
            if openA_end_pos >= 0:
                closeA_start_pos = html.find('</a>', openA_end_pos)
            closeA_end_pos = -1
            if closeA_start_pos >= 0:
                closeA_end_pos = closeA_start_pos + len('</a>')

            # okay, hopefully have all the positions by now:
            full_link_name = ""
            link_text = ""
            if closeA_end_pos >= 0:
                full_link_name = html[openA_start_pos : closeA_end_pos]
                link_text = html[openA_end_pos+1 : closeA_start_pos]

            # try the easy way out here, and instead of backing up a few
            # characters (but: what if other attributes such as popups?)
            # and trying to remove the entire <a href="...">..</a> tag pair,
            # just clear out the href="..." part, which should essentially
            # default to a no-op, eh?
            if full_link_name and link_text:
                # finally, FOR SCORM EXPORT,
                # remove this particular node name:
                # and try removing the entire href="" bit of it,
                # still leaving the <a ...></a>

                # now this routine is also coded to allow the removal of
                # a single anchor.  If so, ensure that it IS the requested:
                if anchor_name == "" or anchor_name == link_name:
                    html = html.replace(full_link_name, link_text, 1)

        # else the href quote is unclosed.  ignore, eh?
        last_end_pos = next_link_pos+1
        next_link_pos = html.find(intlink_start, last_end_pos)

    return html

def removeInternalLinkNodes(html):
    """
    take care of any internal links which are in the form of:
       href="exe-node:Home:Topic:etc#Anchor"
    For this SinglePage Export, go ahead and keep the #Anchor portion,
    but remove the 'exe-node:Home:Topic:etc' Node portion,
    since it is all exported into the same file.
    """
    # use lower-case for the exe-node, for TinyMCE copy/paste compatibility
    intlink_start = 'href="exe-node:'
    intlink_pre   = 'href="'
    next_link_pos = html.find(intlink_start)
    while next_link_pos >= 0:
        link_name_start_pos = next_link_pos + len(intlink_pre)
        link_name_end_pos = html.find('"', link_name_start_pos)
        if link_name_end_pos >= 0:
            link_name = html[link_name_start_pos : link_name_end_pos]
            log.debug("Export rendering internal link, without nodename: "
                    + link_name)
            # assuming that any '#'s in the node name have been escaped,
            # the first '#' should be the actual anchor:
            node_name_end_pos = link_name.find('#')
            if node_name_end_pos < 0:
                # no hash found, => use the whole thing as the node name:
                node_name_end_pos = len(link_name) - 1
            link_node_name = link_name[0 : node_name_end_pos]
            if link_node_name:
                # finally, FOR SINGLE-PAGE EXPORT,
                # remove this particular node name:
                old_node_name = intlink_pre + link_node_name
                no_node_name = intlink_pre
                html = html.replace(old_node_name, no_node_name, 1)
        # else the href quote is unclosed.  ignore, eh?
        next_link_pos = html.find(intlink_start, next_link_pos+1)

    return html



def findLinkedField(package, exe_node_path, anchor_name):
    """
    find the field which corresponds to the exe_node_name of the form:
    C{"exe-node:Home:Topic:etc"} of the C{href="exe-node:Home:Topic:etc#Anchor"}
    rather than searching through the entire node-tree, shortcut straight
    to the package's list of anchor_fields
    """
    if hasattr(package, 'anchor_fields') and package.anchor_fields:
        for anchor_field in package.anchor_fields:
            if anchor_field.GetFullNodePath() == exe_node_path:
                if anchor_name:
                    # now ensure that this field has an anchor of this name:
                    if anchor_name in  anchor_field.anchor_names:
                        # break out and return this matching field's node:
                        #return anchor_field.idevice.parentNode
                        return anchor_field
                else:
                    # with no anchor_name, there is no way to further
                    # determine if this is the correct field/node or not,
                    # so just break out and return the first matching one:
                    #return anchor_field.idevice.parentNode
                    return anchor_field

    return None


def findLinkedNode(package, exe_node_path, anchor_name, check_fields=True):
    """
    find the node which corresponds to the exe_node_name of the form:
       "exe-node:Home:Topic:etc" of the  href="exe-node:Home:Topic:etc#Anchor"
    just a wrapper around common.findLinkedField()
    """
    linked_node = None
    linked_field = None
    if check_fields:
        linked_field = findLinkedField(package, exe_node_path, anchor_name)
    if linked_field and linked_field.idevice is not None:
        linked_node = linked_field.idevice.parentNode
    elif anchor_name == u"auto_top" and package is not None and package.root:
        # allow the node "auto_top" to be found,
        # even if no anchors are explicitly specified.
        # IF this node has already been linked to:
        if hasattr(package, 'anchor_nodes') and package.anchor_nodes:
            for anchor_node in package.anchor_nodes:
                if anchor_node.GetFullNodePath() == exe_node_path:
                    return anchor_node
        # and for those which have not yet been linked to,
        # go ahead and do a complete and proper walkthru all package nodes:
        root_node = package.root
        this_node_path = root_node.GetFullNodePath()
        if this_node_path == exe_node_path:
            return root_node
        else:
            for this_node in root_node.walkDescendants():
                this_node_path = this_node.GetFullNodePath()
                if this_node_path == exe_node_path:
                    return this_node

    return linked_node

def getAnchorNameFromLinkName(link_name):
    """
    little helper to pull out of the (possibly optional?) Anchor from
       href="exe-node:Home:Topic:etc#Anchor"
    """
    anchor_name = ""
    anchor_pos = link_name.find('#')
    if anchor_pos >= 0:
        # hash found, => strip off the anchor:
        anchor_name = link_name[anchor_pos + 1 : ]
    return anchor_name

def enableLinksToElp(package, html):
    '''
    Links to exe-package:elp
    Replace exe-package:elp with the elp name
    Use # instead of the elp name if the package's not been saved (no name...)
    '''
    soup = BeautifulSoup(html, features = "lxml")
    hasElp = False
    for link in soup.findAll('a'):
        if (link.get('href')=='exe-package:elp') and hasattr(package, 'name'):
            lnk = '#'
            if hasattr(package, 'filename') and (package.filename!=""):
                lnk = package.name+".elp"
            log.debug("There is a link to the elp file: " + link.get('href'))
            link['href'] = link['href'].replace("exe-package:elp", lnk)
            hasElp = True
    if hasElp:
        html = str(soup)
    return html

def renderInternalLinkNodeFilenames(package, html):
    """
    take care of any internal links which are in the form of:
       href="exe-node:Home:Topic:etc#Anchor"
    For this WebSite Export, go ahead and keep the #Anchor portion,
    but replace the 'exe-node:Home:Topic:etc' Node portion,
    with the actual target's filename, now temporarily stored in the
    Node's tmp_export_filename attribute, after being processed by
    the export's Page:uniquifyNames()
    """
    found_all_anchors = True
    # use lower-case for the exe-node, for TinyMCE copy/paste compatibility
    intlink_start = 'href="exe-node:'
    intlink_pre   = 'href="'
    next_link_pos = html.find(intlink_start)
    while next_link_pos >= 0:
        link_name_start_pos = next_link_pos + len(intlink_pre)
        link_name_end_pos = html.find('"', link_name_start_pos)
        if link_name_end_pos >= 0:
            link_name = html[link_name_start_pos : link_name_end_pos]
            log.debug("Export rendering internal link: " + link_name)
            # assuming that any '#'s in the node name have been escaped,
            # the first '#' should be the actual anchor:
            node_name_end_pos = link_name.find('#')
            if node_name_end_pos < 0:
                # no hash found, => use the whole thing as the node name:
                node_name_end_pos = len(link_name) - 1
                link_anchor_name = ""
            else:
                link_anchor_name = link_name[node_name_end_pos+1 : ]
            link_node_name = link_name[0 : node_name_end_pos]

            found_node = None
            if link_node_name:
                # Okay, FOR WEBSITE EXPORT, need to find the actual node
                # being referenced by this link, and its actual export filename:
                found_node = findLinkedNode(package, link_node_name,
                        link_anchor_name)
                if found_node and hasattr(found_node, 'tmp_export_filename'):
                    # Finally, replace this particular node name
                    # with its actual export filename:
                    old_node_name = intlink_pre + link_node_name
                    new_node_name = intlink_pre + found_node.tmp_export_filename
                    if link_anchor_name:
                        old_node_name = old_node_name + "#" + link_anchor_name
                        if link_anchor_name != u"auto_top":
                            new_node_name = new_node_name + "#" + link_anchor_name
                    html = html.replace(old_node_name, new_node_name, 1)

            if found_node is None:
                found_all_anchors = False
                log.warn('Export unable to find corresponding node&anchor; '
                        + 'unable to render link to: ' + link_name)

        # else the href quote is unclosed.  ignore, eh?
        next_link_pos = html.find(intlink_start, next_link_pos+1)

    if not found_all_anchors:
        # then go ahead and clear out any remaining invalid links:
        html = removeInternalLinks(html)

    # Keep the links to the elp file (if the elp file exists).
    html = enableLinksToElp(package, html)

    return html

def renderInternalLinkNodeAnchor(package, html):
    """
    take care of any internal links which are in the form of:
       href="exe-node:Home:Topic:etc#Anchor"
    For Singlepage Export, go ahead and keep the 'exe-node:Home:Topic:etc' portion
    preceeded by # symbol and remove #Anchor portion
    """
    found_all_anchors = True
    # use lower-case for the exe-node, for TinyMCE copy/paste compatibility
    intlink_start = 'href="exe-node:'
    intlink_pre   = 'href="'
    next_link_pos = html.find(intlink_start)
    while next_link_pos >= 0:
        link_name_start_pos = next_link_pos + len(intlink_pre)
        link_name_end_pos = html.find('"', link_name_start_pos)
        if link_name_end_pos >= 0:
            link_name = html[link_name_start_pos : link_name_end_pos]
            log.debug("Export rendering internal link: " + link_name)
            # assuming that any '#'s in the node name have been escaped,
            # the first '#' should be the actual anchor:
            node_name_end_pos = link_name.find('#')
            if node_name_end_pos < 0:
                # no hash found, => use the whole thing as the node name:
                node_name_end_pos = len(link_name) - 1
                link_anchor_name = ""
            else:
                link_anchor_name = link_name[node_name_end_pos+1 : ]
            link_node_name = link_name[0 : node_name_end_pos]

            found_node = None
            if link_node_name:
                # Okay, FOR singlepage EXPORT, check the existance of the actual node
                # being referenced by this link, and if it does not exist, remove it:
                found_node = findLinkedNode(package, link_node_name,
                        link_anchor_name)
                if found_node :
                    # Finally, replace this particular node name
                    # with an anchor:
                    # old_node_name = intlink_pre + link_node_name
                    old_node_name = link_name
                    new_node_name = "#" + found_node.GetAnchorName()
                    html = html.replace(old_node_name, new_node_name, 1)

            if found_node is None:
                found_all_anchors = False
                log.warn('Export unable to find corresponding node&anchor; '
                        + 'unable to render link to: ' + link_name)

        # else the href quote is unclosed.  ignore, eh?
        next_link_pos = html.find(intlink_start, next_link_pos+1)

    if not found_all_anchors:
        # then go ahead and clear out any remaining invalid links:
        html = removeInternalLinks(html)

    return html

def requestHasCancel(request):
    """
    simply detect if the current request contains an action of type cancel.
    """
    is_cancel = False
    if u"action" in request.args \
    and request.args[u"action"][0]==u"cancel":
        is_cancel = True
    return is_cancel

def hasWikipediaIdevice(node):
    for idevice in node.idevices:
        if idevice.klass == 'WikipediaIdevice':
            return True
    return False

def ideviceHasFX(idevice):
    block = g_blockFactory.createBlock(None, idevice)
    if not block:
        log.critical("Unable to render iDevice.")
        raise Error("Unable to render iDevice.")
    content = block.renderView('default')
    if re.search(' class=[\'"]exe-fx', content):
        return True
    return False

# Syntax highlighting
def ideviceHasSH(idevice):
    block = g_blockFactory.createBlock(None, idevice)
    if not block:
        log.critical("Unable to render iDevice.")
        raise Error("Unable to render iDevice.")
    content = block.renderView('default')
    if re.search(' class=[\'"]highlighted-code', content):
        return True
    return False

def ideviceHasGames(idevice):
    block = g_blockFactory.createBlock(None, idevice)
    if not block:
        log.critical("Unable to render iDevice.")
        raise Error("Unable to render iDevice.")
    content = block.renderView('default')
    if re.search(' class=[\'"]exe-game ', content):
        return True
    return False

def ideviceHasElpLink(idevice,package):
    '''
    Check if there is a link to the elp file (and the elp file exists)
    The links to the elp file (exe-package:elp) will be replaced by:
        1. # if the file does not exist (no name because it's not been saved)
        2. The elp file name if the elp exists
    '''
    if hasattr(package, 'filename') and (package.filename!=""):
        block = g_blockFactory.createBlock(None, idevice)
        if not block:
            log.critical("Unable to render iDevice.")
            raise Error("Unable to render iDevice.")
        content = block.renderView('default')
        if re.search('<a .*href="exe-package:elp"', content):
            return True
    return False

def ideviceHasGallery(idevice):
    if idevice.klass == 'GalleryIdevice':
        return True
    block = g_blockFactory.createBlock(None, idevice)
    if not block:
        log.critical("Unable to render iDevice.")
        raise Error("Unable to render iDevice.")
    content = block.renderView('default')
    if re.search(' rel=[\'"]lightbox', content):
        return True
    return False

def hasFX(node):
    for idevice in node.idevices:
        if ideviceHasFX(idevice):
            return True
    return False

# Syntax highlighting
def hasSH(node):
    for idevice in node.idevices:
        if ideviceHasSH(idevice):
            return True
    return False

def hasGames(node):
    for idevice in node.idevices:
        if ideviceHasGames(idevice):
            return True
    return False

def hasElpLink(node):
    for idevice in node.idevices:
        if ideviceHasElpLink(idevice,node.package):
            return True
    return False

def hasGalleryIdevice(node):
    for idevice in node.idevices:
        if ideviceHasGallery(idevice):
            return True
    return False

def hasMagnifier(node):
    for idevice in node.idevices:
        if idevice.klass == 'ImageMagnifierIdevice':
            return True
    return False


def ideviceHasMediaelement(idevice):
    block = g_blockFactory.createBlock(None, idevice)
    if not block:
        log.critical("Unable to render iDevice.")
        raise Error("Unable to render iDevice.")
    content = block.renderView('default')
    if re.search('<(video|audio) .*class=[\'"]mediaelement', content):
        return True
    # Multimedia galleries (mp3, mp4, flv, ogg, ogv)
    cont = content.lower()
    if re.search('href=".*.mp3" rel="lightbox', cont) or re.search('href=".*.mp4" rel="lightbox', cont) or re.search('href=".*.flv" rel="lightbox', cont) or re.search('href=".*.ogg" rel="lightbox', cont) or re.search('href=".*.ogv" rel="lightbox', cont):
        return True
    return False


def nodeHasMediaelement(node):
    for idevice in node.idevices:
        if ideviceHasMediaelement(idevice):
            return True
    return False

def ideviceHasTooltips(idevice):
    block = g_blockFactory.createBlock(None, idevice)
    if not block:
        log.critical("Unable to render iDevice.")
        raise Error("Unable to render iDevice.")
    content = block.renderView('default')
    if re.search('<a .*class=[\'"]exe-tooltip ', content):
        return True
    return False


def nodeHasTooltips(node):
    for idevice in node.idevices:
        if ideviceHasTooltips(idevice):
            return True
    return False


def hasABCMusic(node):
    for idevice in node.idevices:
        if ideviceHasABCMusic(idevice):
            return True
    return False

def ideviceHasABCMusic(idevice):
    block = g_blockFactory.createBlock(None, idevice)
    if not block:
        log.critical("Unable to render iDevice.")
        raise Error("Unable to render iDevice.")
    content = block.renderView('default')

    if re.search(' class=[\'"]abc-music', content):
        return True
    return False

## Added for [#2501] Add masteryscore to manifest in evaluable nodes
## Maybe we should reorder all this common code and move it to an Objecto Oriented logic
def hasQuizTest(node):
    for idevice in node.idevices:
        if hasattr(idevice, "isQuiz"):
            if idevice.isQuiz == True:
                return True
    return False

## Added for [#2501] Add masteryscore to manifest in evaluable nodes
## Maybe we should reorder all this common code and move it to an Objecto Oriented logic
def getQuizTestPassRate(node):
    for idevice in node.idevices:
        if hasattr(idevice, "isQuiz"):
            if idevice.isQuiz == True:
                return idevice.passRate
    return False

def getFilesJSToMinify(type, scriptsDir):
    # Read about these files format (comments) in exportMinFileJS (helper.py)
    listJSFiles=[]
    if(type =='ims'):
        listJSFiles+=[{'path':scriptsDir/'common.js','basename':'common.js'}]
    elif(type=='epub3'):
        listJSFiles+=[{'path':scriptsDir/'common.js','basename':'common.js'}]
    elif(type=='scorm'):
        listJSFiles+=[{'path':scriptsDir/'common.js','basename':'common.js'}]
    elif(type=='singlepage'):
        listJSFiles+=[{'path':scriptsDir/'common.js','basename':'common.js'}]
    elif(type=='website'):
        listJSFiles+=[{'path':scriptsDir/'common.js','basename':'common.js'}]

    return listJSFiles


def getFilesCSSToMinify(type, styleDir):
    '''
    Returns a list of CSS files that should by minified
    depending on the export type
    '''
    list_css_files = []

    # Whatever the type is, we always include base.css
    # But if the style has a base.css file, we should always
    # include that one
    if os.path.isfile(styleDir/'base.css'):
        list_css_files += [{ 'path': styleDir/'base.css', 'basename': 'base.css' }]
    else:
        list_css_files += [{ 'path': styleDir/'..'/'base.css', 'basename': 'base.css' }]

    return list_css_files
