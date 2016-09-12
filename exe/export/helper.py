import re
from exe.webui          import common
from slimit             import minify
# Line breaks
lineBreak = u'\n'

def removeEcuationAttr(html):
    """
    Remove ecuations attributes from a HTML page
    """
    
    aux = re.compile("exe_math_latex=\"[^\"]*\"")
    html = aux.sub("", html)
    aux = re.compile("exe_math_size=\"[^\"]*\"")
    html = aux.sub("", html)
    return html

def changeGlossaryPath(html):
    """
    Changes the glossary path from a HTML page
    """
    
    return html.replace("../../../../../mod/glossary", "../../../../mod/glossary")

def escapeAmp(html):
    """
    Replaces & with its HTML escaped form &amp;
    """
    
    return html.replace("&concept", "&amp;concept")

def removeResources(html):
    """
    Remove "resources/" from data="resources/ and the url param
    """
    
    html = html.replace("video/quicktime\" data=\"resources/", "video/quicktime\" data=\"")
    html = html.replace("application/x-mplayer2\" data=\"resources/", "application/x-mplayer2\" data=\"")
    html = html.replace("audio/x-pn-realaudio-plugin\" data=\"resources/", "audio/x-pn-realaudio-plugin\" data=\"")
    html = html.replace("<param name=\"url\" value=\"resources/", "<param name=\"url\" value=\"")
    
    return html

def hasGalleryIdevice(node):
    hasGallery = common.hasGalleryIdevice(node)
    if not hasGallery:
        for child in node.children:
            if hasGalleryIdevice(child):
                return True
    return hasGallery

def hasFX(node):
    hasEffects = common.hasFX(node)
    if not hasEffects:
        for child in node.children:
            if hasFX(child):
                return True
    return hasEffects

def hasSH(node):
    hasHighlighter = common.hasSH(node)
    if not hasHighlighter:
        for child in node.children:
            if hasSH(child):
                return True
    return hasHighlighter

def hasGames(node):
    hasJSGames = common.hasGames(node)
    if not hasJSGames:
        for child in node.children:
            if hasGames(child):
                return True
    return hasJSGames

def hasWikipediaIdevice(node):
    hasWikipedia = common.hasWikipediaIdevice(node)
    if not hasWikipedia:
        for child in node.children:
            if hasWikipediaIdevice(child):
                return True
    return hasWikipedia

def nodeHasMediaelement(node):
    hasMediaelement = common.nodeHasMediaelement(node)
    if not hasMediaelement:
        for child in node.children:
            if nodeHasMediaelement(child):
                return True
    return hasMediaelement

def replaceTopLinks(html):
    return html.replace('href="#auto_top"', 'href="#"')

def processInternalLinks(package, html):
    """
    take care of any internal links which are in the form of::
       
       href="exe-node:Home:Topic:etc#Anchor"

    For this SinglePage Export, go ahead and keep the #Anchor portion,
    but remove the 'exe-node:Home:Topic:etc', since it is all 
    exported into the same file.
    """
    return common.renderInternalLinkNodeAnchor(package, html)

def exportMinFileJS(listFiles, listOutPutFiles):
    
    for i in range(len(listFiles)):
        files = open( listFiles[i], 'r')
        outPutFiles = open( listOutPutFiles[i], 'w')
        for linea in files.readlines():
            if not(linea.find('//')):
                outPutFiles.write(linea)
            else:
                files.seek(0)
                break
        
        outPutFiles.write(minify(files.read(), mangle=False, mangle_toplevel=False))
        outPutFiles.close()
