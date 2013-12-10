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
from exe.export.exportmediaconverter import ExportMediaConverter
from exe.export.xmlpage import XMLPage
"""
HangmanBlock can render and process HangmanIdevices as XHTML and Javascript to
make a game
"""

import logging
from exe.webui.block            import Block
from exe.webui.element          import TextAreaElement
from exe.webui.element                 import ImageElement
from exe.webui                  import common
from exe.webui.element          import TextElement
from exe.engine.extendedfieldengine import field_engine_is_delete_request

log = logging.getLogger(__name__)


# ===========================================================================
class HangmanBlockInc(Block):
    """
    ExampleBlock can render and process ExampleIdevices as XHTML
    GenericBlock will replace it..... one day
    """
    def __init__(self, parent, idevice):
        Block.__init__(self, parent, idevice)
        self.titleElement = TextElement(idevice.titleField)
        self.contentElement = TextAreaElement(idevice.content)
        self.contentElement.height = 250
        self.chanceImageElements = []

        #go through all image fields in the list and create an image element linked to that field
        for chanceImageField in idevice.chanceImageFields:
            newImgElement = ImageElement(chanceImageField)
            self.chanceImageElements.append(newImgElement)

        self.wordElements = []
        self.hintElements = []
        #go through all of the word fields and hint fields and create an 
        for wordIndex, word in enumerate(idevice.wordTextFields):
            newWordElement = TextElement(word)
            self.wordElements.append(newWordElement)
            newHintElement = TextElement(idevice.hintTextFields[wordIndex])
            self.hintElements.append(newHintElement)

        #make an element for the alphabet
        self.alphabetElement = TextElement(idevice.alphabet)

        #element for the messages that are shown to the player
        self.wrongGuessTextElement = TextAreaElement(self.idevice.wrongGuessMessageField)
        self.lostLevelTextElement = TextAreaElement(self.idevice.lostLevelMessageField)
        self.levelPassedTextElement = TextAreaElement(self.idevice.levelPasssedMessageField)
        self.gameWonTextElement = TextAreaElement(self.idevice.gameWonMessageField)
        
        self.letterButtonStyleElement = TextElement(self.idevice.letterButtonStyle)
        self.wrongLetterButtonStyleElement = TextElement(self.idevice.wrongLetterButtonStyle)
        self.rightLetterButtonStyleElement = TextElement(self.idevice.rightLetterButtonStyle)

        self.hintFieldStyleElement = TextElement(self.idevice.hintFieldStyle)
        self.wordAreaStyleElement = TextElement(self.idevice.wordAreaStyle)

        self.resetButtonTextElement = TextElement(self.idevice.resetButtonText)
        self.resetButtonStyleElement = TextElement(self.idevice.resetButtonStyle)
            

    def process(self, request):
        """
        Process the request arguments from the web server to see if any
        apply to this block
        """
        
        #Make sure that we don't do anything when it's time to die...
        Block.process(self, request)
        self.idevice.message = ""
        
        if field_engine_is_delete_request(request):
            return
        
        self.idevice.addGameScript()

        self.titleElement.process(request)
        self.idevice.title = self.titleElement.renderView()
        self.alphabetElement.process(request)
        self.wrongGuessTextElement.process(request)
        self.lostLevelTextElement.process(request)
        self.levelPassedTextElement.process(request)
        self.gameWonTextElement.process(request)

        self.letterButtonStyleElement.process(request)
        self.wrongLetterButtonStyleElement.process(request)
        self.rightLetterButtonStyleElement.process(request)
        self.hintFieldStyleElement.process(request)
        self.wordAreaStyleElement.process(request)

        self.resetButtonTextElement.process(request)
        self.resetButtonStyleElement.process(request)
        
        #see if we need to delete a word
        blankWords = False
        for wordIndex in range(0, len(self.wordElements)):
            if self.wordElements[wordIndex].renderView() == "":
                blankWords = True
            elif self.hintElements[wordIndex].renderView() == "":
                blankWords = True
        
        if blankWords is True:
            self.idevice.message = _("One or more words or hints are blank.  Please do not have any blank hints or words - you can delete unused ones.")
            self.idevice.edit = True
        
        
        #see if we need to add another chance
        if ("addChance"+unicode(self.id)) in request.args: 
            self.idevice.addChance()
            self.idevice.edit = True
            # disable Undo once a question has been added:
            self.idevice.undo = False
        
        if("addWord"+unicode(self.id)) in request.args:
            self.idevice.addWord()
            self.idevice.edit = True
            self.idevice.undo = False

        content = self.contentElement.process(request)
        for imgElement in self.chanceImageElements:
            imgElement.process(request)
            if "action" in request.args and request.args["action"][0] == imgElement.id:
                self.idevice.chanceImageFields.remove(imgElement.field)
                imgElement.field.idevice.undo = False
                imgElement.field.idevice.edit = True
            

        for wordElement in self.wordElements:
            wordElement.process(request)
            if "action" in request.args and request.args["action"][0] == wordElement.id:
                wordIdx = self.wordElements.index(wordElement)
                self.idevice.wordTextFields.remove(wordElement.field)
                self.idevice.hintTextFields.remove(self.hintElements[wordIdx].field)
                wordElement.field.idevice.undo = False
                wordElement.field.idevice.edit = True
        
        for hintElement in self.hintElements:
            hintElement.process(request)

        if content:
            self.idevice.content = content

    #
    # Get an TextArea render back according to mode
    def _renderHTMLElement(self, mode, element, containerId = None):
        retVal = ""
        idStr = ""
        if containerId is not None:
            idStr = " id='%s' " % containerId
        retVal += "<div %s >" % idStr
        if mode == "preview":
            retVal += element.renderPreview()
        else:
            retVal += element.renderView()
        
        retVal += "</div>"
        return retVal
    #
    # This will generate the HTML elements and javascript that will be required
    # for this to be shown as a Javascript game in the web browser
    # 
    def _renderGame(self, style, mode = "view"):
        hangmanGameId = "hangman" + self.id
        
        resPath = ""
        if mode ==  "preview":
            resPath = "resources/"       
        
        html = u"<script src='" + resPath + "hangman.js' type='text/javascript'></script>\n"
        html += common.ideviceHeader(self, style, mode)
        html += "<div id='hangman%(gameId)smessageStore' style='display: none'>" % {"gameId" : hangmanGameId}
        html += self._renderHTMLElement(mode, self.wrongGuessTextElement, "hmwrong" + hangmanGameId)
        html += self._renderHTMLElement(mode, self.lostLevelTextElement, "hmlost" + hangmanGameId)
        html += self._renderHTMLElement(mode, self.levelPassedTextElement, "hmpassed" + hangmanGameId)
        html += self._renderHTMLElement(mode, self.gameWonTextElement, "hmwon" + hangmanGameId)
        
        html += "</div>"
        html += u"<script type='text/javascript'>\n"

        #Go through the images and find out the max height and maxwidth
        imgMaxHeight = 0
        imgMaxWidth = 0

        for imgElement in self.chanceImageElements:
            if imgElement.field.imageResource and imgElement.field.imageResource is not None:
                if(int(imgElement.field.width) > imgMaxWidth):
                    imgMaxWidth = int(imgElement.field.width)

                if(imgElement.field.height > imgMaxHeight):
                    imgMaxHeight = int(imgElement.field.height)
        

        #Makes a javascript array of the list of words that the user has given
        html += "hangman_words['%s'] = new Array();\n" % hangmanGameId
        html += "hangman_buttonStyles['%s'] = new Array();\n" % hangmanGameId
        for wordIndex, word in enumerate(self.wordElements):
            html += u"hangman_words['%(gameId)s'][%(index)d] = new Array('%(word)s', '%(hint)s');\n" % \
                {"index" : wordIndex, "word" : word.renderView(), \
                "hint" : self.hintElements[wordIndex].renderView(), \
                "gameId" : hangmanGameId }
        
        #make the style for the buttons
        html += "hangman_buttonStyles['%(gameId)s'][HANGMAN_BEFORE_GUESS] = \"%(style)s\";\n" \
                % {"gameId" : hangmanGameId, "style" : self.letterButtonStyleElement.renderView()}
        html += "hangman_buttonStyles['%(gameId)s'][HANGMAN_CORRECT_GUESS] = \"%(style)s\";\n" \
                % {"gameId" : hangmanGameId, "style" : self.rightLetterButtonStyleElement.renderView()}
        html += "hangman_buttonStyles['%(gameId)s'][HANGMAN_WRONG_GUESS] = \"%(style)s\";\n" \
                % {"gameId" : hangmanGameId, "style" : self.wrongLetterButtonStyleElement.renderView()}

        #Makes a javscript string of the alphabet that the user can guess from
        html += u"hangman_alphabet['%(gameId)s'] = '%(alphabet)s';\n" % \
        {"alphabet" : self.alphabetElement.renderView(), \
        "gameId" : hangmanGameId }

        #Makes an array of the ids of the divs that hold the chance images
        html += u"hangman_chanceimgids['%s'] = new Array();\n" % hangmanGameId
        for imgIndex, imgElement in enumerate(self.chanceImageElements):
            html += "hangman_chanceimgids['%(gameId)s'][%(index)d] = '%(imgdivid)s';\n" % \
                {"index" : imgIndex, "imgdivid" : "hangman" + self.id + "img" + imgElement.id, \
                "gameId" : hangmanGameId }

        #Make the messages for this game
        html += u"playerMessages['%s'] = new Array();\n" % hangmanGameId
        
        
        
        messagesStr = """
        
        playerMessages['%(gameid)s']['wrongguess'] = 
            document.getElementById('hmwrong%(gameid)s').innerHTML;
        playerMessages['%(gameid)s']['lostlevel'] =
            document.getElementById('hmlost%(gameid)s').innerHTML;
        playerMessages['%(gameid)s']['levelpassed'] = 
            document.getElementById('hmpassed%(gameid)s').innerHTML;
        playerMessages['%(gameid)s']['gamewon'] = 
            document.getElementById('hmwon%(gameid)s').innerHTML;
        </script>
        """ % {"gameid" : hangmanGameId }
        
        html += messagesStr
        

        html += "<div id='hangman" + self.id + "_img'>"
        #render view of these images
        for imgElement in self.chanceImageElements:
            if imgElement.field.imageResource and imgElement.field.imageResource is not None:
                html += "<div id='hangman" + self.id + "img" + imgElement.id + "' style='display: none'>"
            
                if mode == "view":
                    html += imgElement.renderView()
                else:       
                    html += imgElement.renderPreview()
                html += "</div>"
       
        html += "</div>"

        messageTopMargin = (imgMaxHeight - 30) / 2
        gameWidth = max(600, imgMaxWidth)
        gameAreaHTML = """
<div id="%(gameId)s_gamearea" style='width: %(width)dpx;' class='exehangman_gamearea'>
        <div class='exehangman_alertarea' id="%(gameId)s_alertarea" style='position: absolute; z-index: 10; text-align: center; border: 1px; background-color: white; width: %(width)dpx; margin-top: %(messagetopmargin)dpx; visibility: hidden'>
        &#160;
        </div>
        <div id="%(gameId)s_imgarea" style='height: %(height)dpx; z-index: 1;' class='exehangman_imgarea'>
        </div>

        <input type='text' style='%(hintStyle)s' id='%(gameId)s_hintarea' style='width: %(width)dpx' class='exehangman_hintarea'/>
        <input type='text' style='%(wordStyle)s' id='%(gameId)s_wordarea' style='width: %(width)dpx' class='exehangman_wordarea'/>
        <div id="%(gameId)s_letterarea" class='exehangman_letterarea'>
        </div>
        <input class='exehangman_resetbutton' type='button' value='%(resetText)s' style='%(resetStyle)s' onclick='restartLevel("%(gameId)s")'/>
</div>

        """ % { "gameId" : hangmanGameId, "width" : gameWidth, "height": imgMaxHeight, \
                "messagetopmargin" : messageTopMargin, 'hintStyle' : self.hintFieldStyleElement.renderView(), \
                'wordStyle' : self.wordAreaStyleElement.renderView(), 'resetText' : self.resetButtonTextElement.renderView(), \
                'resetStyle' : self.resetButtonStyleElement.renderView() }
        html += gameAreaHTML
        html += "<script type='text/javascript'>setupGame('%s');</script>" % hangmanGameId

        return html



    def renderEdit(self, style):
        """
        Returns an XHTML string with the form element for editing this block
        """
        html  = u"<div>\n"
        html += common.ideviceShowEditMessage(self)
        
        
        html += self.titleElement.renderEdit()
        html += self.contentElement.renderEdit()
        html += self.alphabetElement.renderEdit()

        #messages to show the user for different events
        html += self.wrongGuessTextElement.renderEdit()
        html += self.lostLevelTextElement.renderEdit()
        html += self.levelPassedTextElement.renderEdit()
        html += self.gameWonTextElement.renderEdit()
        html += self.resetButtonTextElement.renderEdit()

        divId = "fieldtype_advanced"  + self.id
        html += "<input name='showbox" + divId + "' type='checkbox' onchange='$(\"#" + divId + "\").toggle()'/>"
        
        html += _("Show Advanced Options") + "<br/>"
        html += "<div id='" + divId + "' style='display: none' "
        html += ">"
        
        #styles for buttons
        html += self.letterButtonStyleElement.renderEdit()
        html += self.wrongLetterButtonStyleElement.renderEdit()
        html += self.rightLetterButtonStyleElement.renderEdit()

        #style of the text fields
        html += self.hintFieldStyleElement.renderEdit()
        html += self.wordAreaStyleElement.renderEdit()

        html += self.resetButtonStyleElement.renderEdit()
        html += "</div>"
        
        #render edit of these images
        for imgElement in self.chanceImageElements:
            html += imgElement.renderEdit()
            html += common.submitImage(imgElement.id, imgElement.field.idevice.id, 
                                   "/images/stock-cancel.png",
                                   _("Remove This Life")) + "<br/>"

        addChanceButtonLabel = _("Add Chance")
        html += common.submitButton("addChance"+unicode(self.id), addChanceButtonLabel)
        html += "<br/>"

        #show words to be guessed
        html += _("<h2>Words to Guess</h2>")
        for wordIndex in range(0, len(self.wordElements)):
            word = self.wordElements[wordIndex]
            html += word.renderEdit()
            html += self.hintElements[wordIndex].renderEdit()
            html += "<br/>"
            if wordIndex > 0:
                html += common.submitImage(word.id, word.field.idevice.id, 
                                   "/images/stock-cancel.png",
                                   _("Remove This Word")) + "<br/>"
        
        html += common.submitButton("addWord"+unicode(self.id), _("Add Word"))        
        html += "<br/>"
        html += self.renderEditButtons()
        html += u"</div>\n"
        return html


    def renderPreview(self, style):
        """
        Returns an XHTML string for previewing this block
        """
        html  = u"<div class=\"iDevice "
        html += u"emphasis"+unicode(self.idevice.emphasis)+"\" "
        html += u"ondblclick=\"submitLink('edit',"+self.id+", 0);\">\n"
        html += self.contentElement.renderView()
        html += self._renderGame(style, mode = "preview")

        html += self.renderViewButtons()
        html += "</div>\n"
        return html

    def renderXML(self, style):
        xml = u""
        
        mediaConverter = ExportMediaConverter.getInstance()
        width = mediaConverter.getProfileWidth()
        height = mediaConverter.getProfileHeight()
        
        if mediaConverter is not None:
            for imgElement in  self.chanceImageElements:
                if imgElement.field.imageResource is not None:
                    mediaConverter.resizeImg(XMLPage.currentOutputDir/imgElement.field.imageResource.storageName, \
                         width, height, {}, {"resizemethod" : "stretch"})
        
        xml += "<idevice type='hangman' id='%s'>\n" % self.idevice.id
        xml += "<chanceimages>\n"
        for imgElement in  self.chanceImageElements:
            if imgElement.field.imageResource is not None:
                xml += "<img src='%s'/>\n" % imgElement.field.imageResource.storageName
            
        xml += "</chanceimages>\n"
        
        xml += "<alphabet>%s</alphabet>\n" % self.alphabetElement.renderView()
        xml += "<wrongguessmessage><![CDATA[ %s ]]></wrongguessmessage>\n" % self.wrongGuessTextElement.renderView()
        xml += "<lostlevelmessage><![CDATA[ %s ]]></lostlevelmessage>\n" % self.lostLevelTextElement.renderView()
        xml += "<levelpassedmessage><![CDATA[ %s ]]></levelpassedmessage>\n" % self.levelPassedTextElement.renderView()
        xml += "<gamewonmessage><![CDATA[ %s ]]></gamewonmessage>\n" % self.gameWonTextElement.renderView()
        
        xml += "<words>"
        for wordIndex in range(0, len(self.wordElements)):
            word = self.wordElements[wordIndex]
            if word != "":
                xml += "<word>\n<hint>%(hint)s</hint>\n<answer>%(answer)s</answer>\n</word>\n" \
                    % {"answer" : word.renderView() , "hint" : self.hintElements[wordIndex].renderView()}
            
        xml += "</words>\n"
        
        xml += "</idevice>\n"
        return xml


    def renderView(self, style):
        """
        Returns an XHTML string for viewing this block
        """
        html  = u"<div class=\"iDevice "
        html += u"emphasis"+unicode(self.idevice.emphasis)+"\">\n"
        html += self.contentElement.renderView()
        html += self._renderGame(style, mode = "view")
        html += u"</div>\n"
        return html
    

# ===========================================================================
"""Register this block with the BlockFactory"""
from exe.engine.hangmanidevice import HangmanIdeviceInc
from exe.webui.blockfactory     import g_blockFactory
g_blockFactory.registerBlockType(HangmanBlockInc, HangmanIdeviceInc)    

# ===========================================================================
