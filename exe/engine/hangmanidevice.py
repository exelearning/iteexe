# ===========================================================================
#
# Hangman Style Game Idevice for eXe
#
# Copyright (C) Mike Dawson Toughra Technologies FZ LLC 2012-2013
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2 of the License, or
# (at your option) any later version.
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
This is an idevice that will create a hangman game for the user.  The author
can define how many chances the user has to guess the letters in the word.

Each wrong choice leads to losing a life and going down one level.  When all
chances are used the game is lost, if the letters are guessed the game is won
"""

import logging
from exe.engine.idevice import Idevice
from exe.engine.field   import TextAreaField
from exe.engine.field   import ImageField
from exe.engine.field   import TextField
from exe.engine.path      import Path, toUnicode
from exe.engine.resource  import Resource

log = logging.getLogger(__name__)

# ===========================================================================
class HangmanIdeviceInc(Idevice):
    
    persistenceVersion = 3
    
    def __init__(self, content=""):
        Idevice.__init__(self, _(u"Hangman Game"), 
                         _(u"Mike Dawson, Toughra Technologies FZ LLC"), 
                         _(u"""Hangman style word game with customizable images."""), "", "")
        self.emphasis = Idevice.SomeEmphasis
        self.message = ""
        
        self.titleField = TextField(_("Title"), _("Title"))

        self.chanceImageFields = []
        self.content  = TextAreaField(_(u"Instructions"), 
                                      _(u"Instructions for Game."), 
                                      content)
        self.content.idevice = self

        #the words that the player will have to guess
        self.wordTextFields = []

        #the corresponding hints that will be shown for the player in game
        self.hintTextFields = []

        self.content.idevice = self
        self.addChance()
        self.addWord()

        #the alphabet (available letters)
        self.alphabet = TextField(_(u"Alphabet to Select From"), _(u"Alphabet to show players"), \
                                  _("abcdefghijklmnopqrstuvwxyz"))
        self.alphabet.idevice = self

        #messages for the player
        self._initNewAlerts()
        
        self.letterButtonStyle = TextField(_("Letter Button Style"), \
                _("Style of button to start with"), "color: white; background-color: blue;")
        self.letterButtonStyle.idevice = self

        self.wrongLetterButtonStyle = TextField(_("Letter Button Style Wrong Guess"), \
                _("Style of letter button after wrong guess"), "color: white; background-color: red;")
        self.wrongLetterButtonStyle.idevice = self

        self.rightLetterButtonStyle = TextField(_("Letter Button Style Right Guess"), \
                _("Style of letter button after correct guess"), "color: white; background-color : green;")
        self.rightLetterButtonStyle.idevice = self
        
        self.hintFieldStyle = TextField(_("Style of Hint Text Field"), _("Hint Text Field CSS"))
        self.hintFieldStyle.idevice = self

        self.wordAreaStyle = TextField(_("Style of Word Display Field"), _("Word Display CSS"))
        self.wordAreaStyle.idevice = self

        self.resetButtonText = TextField(_("Restart Level Button Text"), _("Text for reset button"), _("Restart"))
        self.resetButtonText.idevice = self

        self.resetButtonStyle = TextField(_("Restart Level Button Style (CSS)"), _("Style of Reset Button"), "background-color: blue; color: white;")  
        self.resetButtonStyle.idevice = self

    def _initNewAlerts(self):
        self.wrongGuessMessageField = TextAreaField(_(u"Wrong Guess Message"), \
                _(u"Player will see this message when they guess a letter wrong"), "")
        self.wrongGuessMessageField.idevice = self
        self.lostLevelMessageField = TextAreaField(_(u"Lost Level Message"), \
                _(u"Player will see this message when they loose the level"), "")
        self.lostLevelMessageField.idevice = self
        self.levelPasssedMessageField = TextAreaField(_(u"Level Passed Message"), \
                _(u"Player will see this message when they guess the word correctly"), "")
        self.levelPasssedMessageField.idevice = self
        self.gameWonMessageField = TextAreaField(_(u"Game Won Message"), \
                _(u"Player will see this message when they guess all words correctly"), "")
        self.gameWonMessageField.idevice = self


    #add the javascript to the package
    def addGameScript(self):
        from exe import globals
        import os,sys
            
        scriptSrcFilename = globals.application.config.webDir/"templates"/"hangman.js"
        log.debug("Script filename = " + scriptSrcFilename)
        
        #assert(self.parentNode,
        #       'Image '+self.id+' has no parentNode')
        #assert(self.parentNode.package,
        #       'iDevice '+self.parentNode.id+' has no package')

        gameScriptFile = Path(scriptSrcFilename)
        if gameScriptFile.isfile():
            Resource(self, gameScriptFile)


    #Adds a chance and image for the player
    def addChance(self):
        newLevelImageField = ImageField(u"chance", u"")
        newLevelImageField.idevice = self
        self.chanceImageFields.append(newLevelImageField)

    #adds a word to the list of those to guess
    def addWord(self):
        newWordTextField = TextField(_(u"Word to Guess"), _(u"Word To Guess"), "")
        newWordTextField.idevice = self
        newWordHintField = TextField(_(u"Hint to Show User"), _(u"Hint for Word"), "")
        newWordHintField.idevice = self
        self.wordTextFields.append(newWordTextField)
        self.hintTextFields.append(newWordHintField)
    
    #some nasty hard coded backward compatibility to archive files
    #used for Afghan literacy project.  Will not effect anyone else    
    def upgradeToVersion2(self):
        self.lostLevelMessageField = TextAreaField(_(u"Lost Level Message"), \
                _("Player will see this message when they loose the level"), "<img src='smallcross.png'/>")
        self.lostLevelMessageField.idevice = self
        
        self.levelPasssedMessageField = TextAreaField(_(u"Level Passed Message"), \
                _(u"Player will see this message when they guess the word correctly"), "<img src='smallcheck.png'/>")
        self.levelPasssedMessageField.idevice = self
        
        self.gameWonMessageField = TextAreaField(_(u"Game Won Message"), \
            _(u"Player will see this message when they guess all words correctly"), "<img src='smallcheck.png'/>")
        self.gameWonMessageField.idevice = self
        
        self.wrongGuessMessageField = TextAreaField(_(u"Wrong Guess Message"), \
                _(u"Player will see this message when they guess a letter wrong"),  "<img src='smallcross.png'/>")
        self.wrongGuessMessageField.idevice = self

    def upgradeToVersion3(self):
        self.message = ""
        self.titleField = TextField(_("Title"), _("Title"))
# ===========================================================================
def register(ideviceStore):
    """Register with the ideviceStore"""
    ideviceStore.extended.append(HangmanIdeviceInc())
    

# ===========================================================================
