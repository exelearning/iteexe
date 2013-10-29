from exe                     import globals
from exe.engine.package          import Package
import sys, os
from exe.engine.config import Config
from exe.engine.path import Path
from subprocess import call
import ConfigParser
try:
    from PIL import Image
except:
    import Image

'''
This class is designed to go over through a given exported object
and according to the media profile will convert audio, video and
images to match formats and dimensions.

This can be particularly useful for export for mobile devices

@author: mike
'''

class ExportMediaConverter(object):
    '''
    classdocs
    '''
    currentMediaConverter = None
    appConfig = None
    workingDir = None
    currentPackage = None
    autoMediaOnly = False
    

    def __init__(self, configProfileName):
        '''
        Constructor
        '''
        self.configProfileName = configProfileName
        self.configParser = None
        self.resizedImages = {}
        
        ExportMediaConverter.currentMediaConverter = self
    
    def setCurrentPackage(self, pkg):
        if self.configParser is None:
            print "setCurrentPackage says - Eh - you need to load the config values before you call me buddy"
            
        self.currentPackage = pkg
        if self.currentPackage.mxmlheight != "":
            self.configParser.set("media", "maxheight", self.currentPackage.mxmlheight)
        if self.currentPackage.mxmlwidth != "":
            self.configParser.set("media", "maxwidth", self.currentPackage.mxmlwidth)
        
    @classmethod
    def getInstance(cls):
        return ExportMediaConverter.currentMediaConverter
    
    @classmethod
    def setWorkingDir(cls, newWorkingDir):
        ExportMediaConverter.workingDir = newWorkingDir
    """
    This will remove the html tags in the list.  Takes a list
    of tags to remove, builds a regex, then does re.sub
    """
    @classmethod
    def removeHTMLTags(cls, html, tags):
        #myRegex == re.sub('<[/]?(dir|d)[^>]*>', '', text)
        myRegex = '<[/]?('
        for i in range(len(tags)):
            myRegex += tags[i]
            if i < (len(tags) - 1):
                myRegex += '|'
        myRegex += ')[^>]*>'
        import re
        return re.sub(myRegex, '', html, 0, re.MULTILINE | re.IGNORECASE)
    
    """
    This is here to remove "HTML Whitespace" e.g. empty <p>s and such
    which are added to space out feedback but on a mobile would actually
    push the feedback out of view
    """
    @classmethod 
    def trimHTMLWhiteSpace(cls, html):
        retVal = ""
        #be rid of any line that is really just a space
        retVal = html.replace("\n&nbsp;\n", "\n")
        retVal = retVal.replace("<p>&nbsp;</p>\r\n", "")
        import re
        
        #get rid of any empty paragraph tags
        retVal = re.sub("<p.?>\s*</p>", '', retVal, re.MULTILINE | re.IGNORECASE)
        return retVal
    
        
    '''
    This will load the configuration for this export media converter
    according to the given profile (see system config -> mediaProfilePath
    
    '''
    def loadConfigVals(self):
        x = 0
        #Set this as a class var - there should only be one
        ExportMediaConverter.appConfig = globals.application.config
        
        mediaProfilePath = ExportMediaConverter.appConfig.mediaProfilePath
        self.configParser = ConfigParser.RawConfigParser()
        cfgFileName = mediaProfilePath +"/" + self.configProfileName + ".ini"
        self.configParser.read(cfgFileName)
    
    def getProfileWidth(self):
        return int(self.configParser.get("media", "maxwidth"))
    
    def getProfileHeight(self):
        return int(self.configParser.get("media", "maxheight"))
    
    '''
    This will resize an image according to the rules of this media
    profile and save it.
    
    Will only act on this image if that has not already been done
    '''
    def resizeImg(self, imgPath, maxWidth = -1, maxHeight = -1, resizeInfo = {}, mediaParams = {}):
        if imgPath in self.resizedImages:
            return None
        
        if maxWidth == -1 or maxHeight == -1:
            #default to profile's width/height
            maxWidth = int(self.configParser.get("media", "maxwidth"))
            maxHeight = int(self.configParser.get("media", "maxheight"))
        
        print "Resizing %(imgname)s to %(maxwidth)d %(maxheight)d" % \
            {"imgname" : imgPath, "maxwidth" : maxWidth, "maxheight" : maxHeight}
        try:
            
            img = Image.open(imgPath)
            
            origWidth = img.size[0]
            origHeight = img.size[1]
            
            """
            check and see if we were told something before
            e.g. this has a width/height attribute
            """
            if "width" in resizeInfo:
                origWidth = resizeInfo['width']
                
            if "height" in resizeInfo:
                origHeight = resizeInfo['height']
            
            newWidth = 1
            newHeight = 1
            
            #default scale factor
            if "resizemethod" in mediaParams and mediaParams['resizemethod'] == "stretch":
                newWidth = maxWidth
                newHeight = maxHeight
            else:
                scaleFactor = float(self.configParser.get("media", "scalefactor"))
                
                newWidth = origWidth * scaleFactor
                newHeight = origHeight * scaleFactor 
                
                newFactor = scaleFactor
                
                if newWidth > maxWidth:
                    newFactor = float(maxWidth) / float(origWidth)
                    newWidth = origWidth * newFactor
                    newHeight = origHeight * newFactor
                    
                    if newHeight > maxHeight:
                        newFactor = float(maxHeight) / float(origHeight)
                        newHeight = origHeight * newFactor
                        newWidth = origWidth * newFactor
                
                if newHeight > maxHeight:
                    newFactor = float(maxHeight) / float(origHeight)
                    newWidth = origWidth * newFactor
                    newHeight = origHeight * newFactor
                    
                    if newWidth > maxWidth:
                        newFactor = float(maxWidth) / float(origWidth)
                        newHeight = origHeight * newFactor
                        newWidth = origWidth * newFactor
                
                
                
            img = img.resize((int(newWidth), int(newHeight)), Image.ANTIALIAS)
            img.save(imgPath)
            
            result =  (int(newWidth), int(newHeight))
            self.resizedImages[imgPath] = result
            
            return result
        #this is a lie because it mysteriously fails for no reason in pyclipse
        except:
            print "Skipping resize image actually... debug hack\n"
            return (maxWidth, maxHeight)
    
    '''
    Handle the image modifications stored in longdesc 
    '''
    def handleImageVersions(self, htmlContent, mediaParams = {}):
        startIndex = 0
        htmlContentLower = htmlContent.lower()
        
        #figure out which image version we are using in this profiles
        screenProfile = self.configParser.get("media", "screenprofile")
        startIndex = self._findNextTagStart(htmlContentLower, startIndex, ['img'])
        
        while startIndex != -1:
            # Use a regex here - match inside the image tag and get the numbered
            # backreference
            
            imgSrc = self._getSrcForTag(htmlContent, startIndex)
            
            currentWidth = self._getTagAttribVal(htmlContent, "width", startIndex)
            currentHeight = self._getTagAttribVal(htmlContent, "height", startIndex)
            
            resizeParams = {}
            
            if currentWidth is not None:
                resizeParams['width'] = int(currentWidth)
            if currentHeight is not None:
                resizeParams['height'] = int(currentHeight)
            
            imgPath = ExportMediaConverter.workingDir/imgSrc
            resizeResult = None
            
            if not ("noresize" in mediaParams and mediaParams["noresize"] == True): 
                if imgPath in self.resizedImages:
                    resizeResult = self.resizedImages[imgPath]
                else:
                    resizeResult = self.resizeImg(imgPath, -1, -1, resizeParams, mediaParams)
                    
            if resizeResult is not None:
                widthAttribInfo = {}
                heightAttribInfo = {}
                
                widthAttr = self._getTagAttribVal(htmlContent, "width", startIndex, widthAttribInfo)
                if widthAttr is not None:
                    htmlContent = htmlContent[:widthAttribInfo['start']] \
                        + " width=\"" + str(resizeResult[0]) + "\" " \
                        + htmlContent[widthAttribInfo['stop']:]
                        
                heightAttr = self._getTagAttribVal(htmlContent, "height", startIndex, heightAttribInfo)
                if heightAttr is not None:
                    htmlContent = htmlContent[:heightAttribInfo['start']] \
                        + " height=\"" + str(resizeResult[1]) + "\" " \
                        + htmlContent[heightAttribInfo['stop']:]
                    
            htmlContentLower = htmlContent.lower()
            
            endOfTagIndex = htmlContentLower.find(">", startIndex);
            tagContent = htmlContent[startIndex:endOfTagIndex+1]
             
            import re
            longDesc = re.sub(re.compile(r'<img (.*) longdesc\s*?=\s*?(\'|")(.*)(\'|").*>', re.MULTILINE), r'\3', tagContent)
            
            quoteUsed = re.sub(re.compile(r'<img (.*) longdesc\s*?=\s*?(\'|")(.*)(\'|").*>', re.MULTILINE), r'\2', tagContent)
            
            if longDesc != tagContent:
                # We have found something - try and explode it into key/value pairs
                nextQuotePos = longDesc.find(quoteUsed, 2) 
                if nextQuotePos != -1:
                    longDesc = longDesc[:nextQuotePos]
                
                
                longDescParts = longDesc.split(";")
                #for cropping an image
                clipPropertyNames = ["x", "y", "width", "height"]
                clipParams = {"x" : -1, "y": -1, "width": -1, "height": -1}
                
                #scaling param
                scale = 1
                #if we need to change it to use some other image
                altSrc = None
                
                #split this value: value pair
                for currentPart in longDescParts:
                    currentKeyValPair = currentPart.split(":")
                    currentKey = currentKeyValPair[0].strip()
                    currentVal = currentKeyValPair[0].strip()
                    
                    #find out for which profile this is (e.g. portrait, landscape, or square)
                    dashPos = currentKey.find("-")
                    if dashPos == -1:
                        continue
                    
                    profileName = currentKey[:dashPos]
                    if profileName == screenProfile:
                        propertyName = currentKey[dashPos+1:]
                        if propertyName == "altsrc":
                            altSrc = currentVal
                        elif propertyName == "clip":
                            clipVals = currentVal.split(",")
                            for i in range(len(clipVals)):
                                clipParams[clipPropertyNames[i]] = int(clipVals[i])
                        elif propertyName == "scale":
                            scale = float(currentVal)        
                    
                    #if there is an alt src - no processing - just replace
                    if altSrc is not None:
                        
                        firstQuote = currentVal.find("'")
                        lastQuote = currentVal.rfind("'")
                        newSrc = currentVal[firstQuote:lastQuote]
                        if newSrc[:len('resources/')] == 'resources/':
                            newSrc = newSrc[len('resources/'):]
                            
                        replacedTagContent = tagContent.replace(imgSrc, newSrc)
                        lengthNow = len(htmlContent)
                        
                        htmlContent = htmlContent[:startIndex] + replacedTagContent \
                            + htmlContent[endOfTagIndex + 1]
                        endOfTagIndex = startIndex + len(replacedTagContent)
            
            #do an else here to find those that don't have any special instructions
                    
            startIndex = endOfTagIndex + 1
            startIndex = self._findNextTagStart(htmlContentLower, startIndex, ['img'])
            
        return htmlContent
                    
    
    
    def reprocessHTML(self, html):        
        htmlContentMediaAdapted = self.handleAudioVideoTags(html)
        htmlContentMediaAdapted = self.handleImageVersions(htmlContentMediaAdapted)
        return htmlContentMediaAdapted
        
    '''
    This should go through and detect audio and video tags,
    then perform the appropriate conversions.
    
    Will then rewrite the source attribute and return a corrected
    string with the html
    
    htmlContent - the content of the HTML to process
    workingDir - the directory where the input files will be and output files should
    be saved to
    '''
    def handleAudioVideoTags(self, htmlContent, mediaParams = {}):
        htmlContentLower = htmlContent.lower()
        
        tagNames = ['audio', 'video']
        
        countAudio = 0
        countVideo = 0
        audioInFile = ""
        videoInFile = ""
        videoOutFile = ""
        
        startIndex = 0
        while startIndex != -1:
            startIndex = self._findNextTagStart(htmlContentLower, startIndex, tagNames)
            if startIndex == -1:
                break
            
            tagName = htmlContentLower[startIndex+1:startIndex+6]
            
            mediaName = self._getSrcForTag(htmlContent, startIndex)
            
            #find the media base name without the extension and the current extension
            mediaNameParts = os.path.splitext(mediaName)
            if len(mediaNameParts) < 2:
                #does not have a file extension - confused!
                #TODO: More warning stuff here
                break
            
            mediaBaseName = mediaNameParts[0]
            mediaExtension = mediaNameParts[1][1:] 
            workingDir = ExportMediaConverter.workingDir
            conversionCommandBase = ""
            inFilePath = workingDir/mediaName
                
            
            #handle audio conversion
            if tagName == "audio":
                countAudio = countAudio + 1
                
                targetFormat = self.configParser.get("media", "audioformat")
                
                if targetFormat == "au":
                    conversionCommandBase = ExportMediaConverter.appConfig.audioMediaConverter_au
                elif targetFormat == "mp3":
                    conversionCommandBase = ExportMediaConverter.appConfig.audioMediaConverter_mp3
                elif targetFormat == "ogg":
                    conversionCommandBase = ExportMediaConverter.appConfig.audioMediaConverter_ogg
                elif targetFormat == "wav":
                    conversionCommandBase = ExportMediaConverter.appConfig.audioMediaConverter_wav
                
            if tagName == "video":
                countVideo = countVideo + 1
                
                targetFormat = self.configParser.get("media", "videoformat")
                
                if targetFormat == "3gp":
                    conversionCommandBase = ExportMediaConverter.appConfig.videoMediaConverter_3gp
                elif targetFormat == "mpg":
                    conversionCommandBase = ExportMediaConverter.appConfig.videoMediaConverter_mpg
                elif targetFormat == "ogv":
                    conversionCommandBase = ExportMediaConverter.appConfig.videoMediaConverter_ogv
                elif targetFormat == "avi":
                    conversionCommandBase = ExportMediaConverter.appConfig.videoMediaConverter_avi
                
            newFileName = mediaBaseName + "." + targetFormat
            outFilePath = workingDir + "/" + newFileName
            if tagName == "audio":
                audioInFile = mediaName
            elif tagName == "video":
                videoInFile = mediaName
                videoOutFile = newFileName
            
            workingDir = Path(inFilePath).parent
            
            cmdEnv = {'PATH' : os.environ['PATH'] }
            
            exeDir = globals.application.config.exePath.parent
            mediaToolsDir = str(exeDir/"mediaconverters")
            if sys.platform[:3] == "win":
                cmdEnv['PATH'] = mediaToolsDir + os.pathsep + cmdEnv['PATH']
                cmdEnv['SYSTEMROOT'] = os.environ['SYSTEMROOT']
                
            conversionCommand = conversionCommandBase  \
                    % {"infile" : mediaName, "outfile" : newFileName}
            print "Converting: run %s\n" % conversionCommand
            call(conversionCommand, shell=True, cwd=workingDir, env=cmdEnv)
            htmlContent = htmlContent.replace(mediaName, newFileName)
                    
            # go forward so we don't find the same one again
            startIndex = startIndex + 1
        
        #see if we have one audio and one video - in which case auto mix them
        if countVideo == 1 and countAudio == 1:
            audioInFileAbs = workingDir + "/" + audioInFile
            videoInFileAbs = workingDir + "/" + videoInFile
            combinedOutFile = workingDir + "/" + videoOutFile
            
            print "Mixing Video/Audio"
            mixCommand = ExportMediaConverter.appConfig.ffmpegPath + " -i %(audioin)s -i %(videoin)s -s qcif -vcodec h263 -acodec libvo_aacenc -ac 1 -ar 8000 -r 25 -ab 32 -y -aspect 4:3 %(videoout)s" \
                % { "audioin" : audioInFileAbs, "videoin" : videoInFileAbs, "videoout" : combinedOutFile}
                
            print "Running command %s \n" % mixCommand   
            
            call(mixCommand, shell=True)
        
        #remove the <script part that exe made for FF3- compatibility
        #TODO: potential case sensitivity issue here -but exe always makes lower case...
        startScriptIndex = self._findNextTagStart(htmlContent, 0, ["script"])
        if startScriptIndex != -1:
            endScriptIndex = htmlContent.find("</script>") + 9
            htmlContent = htmlContent[:startScriptIndex] + htmlContent[endScriptIndex:]
        
        return htmlContent    
    
    '''
    Find the first auto play audio in a given set of HTML content and return the 
    URI -  assume that this is the audio that should be played for a given item.
    TODO: Fix me to check autoplay
    '''
    def findAutoAudio(self, htmlStr):
        tagNames = ['audio']
        startIndex = self._findNextTagStart(htmlStr.lower(), 0, tagNames)
        if startIndex != -1:
            return self._getSrcForTag(htmlStr, startIndex)
        else:
            return None
        
    """
    If the HTML string has an audio element in it return 
    audio="uri"
    else return blank
    """
    def makeAudioAttrs(self, htmlStr):
        audioSrc = self.findAutoAudio(htmlStr)
        if audioSrc is not None:
            return " audio=\"%s\" " % audioSrc
        else:
            return ""
        
        
    
    '''
    Fix me - make sure to put a loop in that will check there is an equals sign
    after the start pos of the attrib value
    '''
    def _getTagAttribVal(self, htmlStr, attribName, tagStartPos, attribSearchInfo = {}):
        htmlLCase = htmlStr.lower()
        
        foundStart = False
        while foundStart == False:
            srcAttribPos = htmlLCase.find(attribName, tagStartPos)
            equalSignPos = htmlLCase.find("=", srcAttribPos)
            
            if equalSignPos == -1:
                #something quite wrong - it's not really here
                return None
            
            endAttribPos = srcAttribPos + len(attribName)
            
            #if we find a character in between the end of the attrib name and 
            #  the equals sign it means we are in the wrong place really...
            foundBadChar = False
            
            for i in range(endAttribPos, equalSignPos):
                if not htmlLCase[i:i+1].isspace():
                    foundBadChar = True
                    
            
            if foundBadChar == False:
                foundStart = True
            else:
                tagStartPos = srcAttribPos + len(attribName) + 1
            
            
        
        
        if srcAttribPos == -1:
            return None
        
        singleQuotePos = htmlLCase.find("'", srcAttribPos)
        doubleQuotePos = htmlLCase.find("\"", srcAttribPos)
        
        """
        Go through the tag - find the first quote after 
        """
        startAttribVal = -1
        quoteUsed = ""
        if singleQuotePos != -1 and ( doubleQuotePos == -1 or singleQuotePos < doubleQuotePos ):
            startAttribVal = singleQuotePos
            quoteUsed = "'"
        
        if doubleQuotePos != -1 and ( singleQuotePos == -1 or doubleQuotePos < singleQuotePos ):
            startAttribVal = doubleQuotePos
            quoteUsed = "\""
        
        # This does not seem to have a src attribute    
        if startAttribVal == -1:
            return None
        
        endSrcVal = htmlLCase.find(quoteUsed, startAttribVal + 1)
        attribVal = htmlStr[startAttribVal+1:endSrcVal]
        
        attribSearchInfo['start'] = srcAttribPos
        attribSearchInfo['stop'] = endSrcVal + 1
        
        return attribVal
    
    '''
    Find the src attribute for an audio or video tag
    '''
    def _getSrcForTag(self, htmlStr, tagStartPos):
        htmlLCase = htmlStr.lower()
        srcAttribPos = htmlLCase.find("src", tagStartPos)
        
        singleQuotePos = htmlLCase.find("'", srcAttribPos)
        doubleQuotePos = htmlLCase.find("\"", srcAttribPos)
        
        """
        Go through the tag - find the first quote after 
        """
        startAttribVal = -1
        quoteUsed = ""
        if singleQuotePos != -1 and ( doubleQuotePos == -1 or singleQuotePos < doubleQuotePos ):
            startAttribVal = singleQuotePos
            quoteUsed = "'"
        
        if doubleQuotePos != -1 and ( singleQuotePos == -1 or doubleQuotePos < singleQuotePos ):
            startAttribVal = doubleQuotePos
            quoteUsed = "\""
        
        # This does not seem to have a src attribute    
        if startAttribVal == -1:
            return None
        
        endSrcVal = htmlLCase.find(quoteUsed, startAttribVal + 1)
        attribVal = htmlStr[startAttribVal+1:endSrcVal]
        return attribVal
        
        
    
    '''
    This will go through a set of html to find where a tag is 
    starting
    '''    
    def _findNextTagStart(self, htmlContent, startIndex, tagNames):
        htmlContent = htmlContent.lower()
        lowestFound = -1
        for tagName in tagNames:
            startThisTag = htmlContent.find("<" + tagName, startIndex)
            if startThisTag != -1 and ( startThisTag < lowestFound or lowestFound == -1 ): 
                lowestFound = startThisTag
        
        return lowestFound
        
        
