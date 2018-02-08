import re
from exe.webui                  import common
from webassets.filter.rjsmin    import RJSMin

# This is used in case cssmin is bundled with eXe (as in portable versions)
# and it's included inside a module itself (which makes the function be in cssmin.cssmin.cssmin()).
# If that is the case, simply import the module cssmin inside this main module.
import cssmin
if not hasattr(cssmin, 'cssmin'):
    from cssmin import cssmin

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
    
def nodeHasABCMusic(node):
    hasABCMusic = common.hasABCMusic(node)
    if not hasABCMusic:
        for child in node.children:
            if nodeHasABCMusic(child):
                return True
    return hasABCMusic

def addListIdevicesFiles(node):
    listIdevicesFiles = []
    listIdevicesFiles.append(common.printJavaScriptIdevicesScripts('export',node))
    for child in node.children:
        if len(child.children) >0:
            listIdevicesFilesChild = addListIdevicesFiles(child)
            listIdevicesFiles.extend(listIdevicesFilesChild)
        else:
            listIdevicesFiles.append(common.printJavaScriptIdevicesScripts('export',child))
    return listIdevicesFiles

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

def exportMinFileJS(listFiles, outputDir):
    """
    Minify JS file for exporting
    
    This function will only keep the first comment if it has the following format:
        * It starts with /*!
        * It ends with */
        
    If the comment doesn't follow this rules or if it isn't in the 
    first line (blank lines doesn't count), it will be erased
    """
    
    minifier = RJSMin();
    
    # Go over all the files in the list
    for inputFile in listFiles:
        # Open current file in "read" mode
        inputFileStream = open( inputFile['path'], 'r')
        # Open output file in "write" mode
        outputFile = open(outputDir / inputFile['basename'], 'w')
        
        licenseComment = ''
        
        # Get the first line of the file
        line = inputFileStream.readline()
        # If the first line is empty, get the next one until one with content pops up
        while line.strip(' ') == '\n':
            line = inputFileStream.readline()
        
        # If the line starts with /*! it means is the license comment
        if line.startswith('/*!'):
            # Add this line to the comment
            licenseComment = licenseComment + line
            
            # Add all the lines until the end of the comment
            while not line.endswith('*/\n'):
                line = inputFileStream.readline() 
                licenseComment = licenseComment + line
        
        # If there is a license comment, write it to the ouput file
        if licenseComment != '':
            outputFile.write(licenseComment)
        
        # Write the minified code to the ouput file
        minifier.output(inputFileStream, outputFile)
        
        # Close the files
        inputFileStream.close() 
        outputFile.close()
        
def exportMinFileCSS(list_files, output_dir):
    """
    Minify CSS files in list_files for exporting and copy them to output_dir
    """
    for file in list_files:
        # Open input (read only mode) and ouput (write mode) file streams
        input_stream = open(file['path'], 'r')
        output_stream = open(output_dir/file['basename'], 'w')
        
        # This flag is used to prevent us from leaving the loop while reading a multiline comment
        inside_comment = False
        for line in input_stream.readlines():
            # We only want to keep the comment if it's in the first written line of the file
            if not inside_comment and line.strip() != '' and not line.startswith('/*'):
                break
            
            # Don't write blank lines at the start of the file
            if line.strip() == '':
                continue
            
            # Find the end of the license comment
            comment_end = line.find("*/")
            
            # If the comment doesn't end here just write the line to the output file
            if comment_end < 0:
                inside_comment = True
                output_stream.write(line)
            # Otherwise, we write the file and leave the loop 
            else:
                output_stream.write(line)
                break
        
        # Put the cursor at the start of the input file since cssmin
        # doesn't do it automatically and we have already read the entire file
        input_stream.seek(0)

        # Write the minified CSS to the output file and close it
        output_stream.write(cssmin.cssmin(input_stream.read()))
        output_stream.close()
