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
Click In Order makes an activity where the user has to click a given
area according to a hint that gets shown
"""

import logging
from exe.engine.idevice import Idevice
from exe.engine.field   import TextAreaField
from exe.engine.field   import TextField
from exe.engine.field   import Field
from exe.engine.path      import Path, toUnicode
from exe.engine.resource  import Resource
from extendedfieldengine import ChoiceField

log = logging.getLogger(__name__)

INDEX_TITLEFIELD = 0
INDEX_INSTRUCTIONFIELD = 1
INDEX_DEFAULTVALUEFIELD = 2

# ===========================================================================
class ClickInOrderIdeviceInc(Idevice):
    
    persistenceVersion = 2
    
    """
    Click in order according to the hint game...
    """
    def __init__(self, content=""):
        Idevice.__init__(self, _(u"Click In Order Game"), 
                         _(u"PAIWASTOON Networking Services Ltd."), 
                         _(u"""Click in Order according to the hint on the map."""), "", "")
        self.emphasis = Idevice.SomeEmphasis
        self.message = ""
        
        self.titleField = TextField(_("Title"), _("Title"))
        
        """
        List of the text area fields that are here Id which will be generated mapped to the title and help in an array
        """
        self.textAreaFieldNames = {\
                'Instructions' : [_('Game Instructions'), _('Instructions to show in leading paragraph')],\
                'CompleteFeedback' : [_('Game Won Feedback Overlay'), _('Shown over when the game is won')],\
                'PositiveFeedback' : [_('Correct Answer Feedback Overlay'), _('Shown over game when correct answer given')],\
                'NegativeFeedback' : [_('Wrong Answer Feedback Overlay'), _('Shown over game when wrong answer is given')],\
                'MainArea' : [_('Main Area To Show'), _('The Main Game Area on which to locate items')],\
                'ClickToStartArea' : [_('Area shown before the game starts'), _('User will click on this to start the game')]\
                }
        self.textAreaFields = {}
        for textAreaFieldName, textAreaDesc in self.textAreaFieldNames.iteritems():
            self.textAreaFields[textAreaFieldName] = TextAreaField(textAreaDesc[INDEX_TITLEFIELD], \
                textAreaDesc[INDEX_INSTRUCTIONFIELD], "")
            self.textAreaFields[textAreaFieldName].idevice = self

        self.textFieldsBasic = ["width", "height"]
        self.textFieldsAdvanced = ["elementCounterStyle", "hintWidth", "hintHeight", "hintAreaStyle", "timerStyle"]
        
        self.textFieldNames = {\
                'width' : [_('Game Width'), _('Width of game area (in pixels)'), '300'],\
                'height' : [_('Game Height'), _('Height of game area (in pixels)'), '300'],\
                'elementCounterStyle' : [_('Style of Element Counter'), _('Use CSS to style element that counts number items found')],\
                'hintWidth' : [ _('Hint Width'), _('Width (px) of hint area'), '300'],\
                'hintHeight' : [ _('Hint Height'), _('Height (px) of hint area'), '50'],\
                'hintAreaStyle' : [_('Hint Area Style'), _('Style of Hint Area')],\
                'timerStyle' : [_('Style of timer Element'), _('Style of timer (CSS)')]
                }
        self.textFields = {}
        for textFieldName, textFieldDesc in self.textFieldNames.iteritems():
            if len(textFieldDesc) >= INDEX_DEFAULTVALUEFIELD+1:
                self.textFields[textFieldName] = TextField(textFieldDesc[INDEX_TITLEFIELD], \
                   textFieldDesc[INDEX_INSTRUCTIONFIELD], textFieldDesc[INDEX_DEFAULTVALUEFIELD])
            else:
                self.textFields[textFieldName] = TextField(textFieldDesc[INDEX_TITLEFIELD], \
                textFieldDesc[INDEX_INSTRUCTIONFIELD])
            
            self.textFields[textFieldName].idevice = self

        #Game Mode Choice
        gameModeChoice = [ ['0', 'Dont Shuffle'], ['1', 'Shuffle'] ]
        #so these are seen for localization
        _("Dont Shuffle")
        _("Shuffle")
        
        timerModeChoice = [ ['0', 'No Timer'], ['1', 'Stopwatch Mode'] ]
        _("No Timer")
        _("Stopwatch Mode")
        
        self.questionOrderChoiceField = ChoiceField(self, gameModeChoice, _("Shuffle Questions"), _("Randomize question order or not"))
        self.timerChoiceField = ChoiceField(self, timerModeChoice, _("Use Timer?"), _("Use a Timer"))
        
        #these are the areas that can actually be clicked on
        self.clickableAreaFields = []
        self.addClickableField()

    def addClickableField(self):
        newClickableArea = ClickInOrderClickableAreaField(_("Clickable Area"), self)
        self.clickableAreaFields.append(newClickableArea)

    """
    Game requires jquery and jqueryui scripts - these should be in the same
    folder as this idevice source file

    This can then be called from the process method
    """
    def uploadNeededScripts(self):
        from exe import globals
        import os,sys
        scriptFileNames = ['jquery-ui-1.10.3.custom.min.js', 'clickinorder.js']
        for scriptName in scriptFileNames:
            from exe import globals 
            scriptSrcFilename = globals.application.config.webDir/"templates"/scriptName
            gameScriptFile = Path(scriptSrcFilename)
            if gameScriptFile.isfile():
                Resource(self, gameScriptFile)

    def upgradeToVersion2(self):
        self.message = ""


"""
This class represents an area that can be clicked in the sequence.  It has a top/left/width/height property, 
a hide delay, a hint and a showme item
"""
class ClickInOrderClickableAreaField(Field):
    
    persistenceVersion = 4

    def __init__(self, name, idevice, instruction="A place to click on in the main area", content=""):
        Field.__init__(self, name, instruction)
        self.idevice = idevice
        self.message = ""
        self.textFieldNames = {\
                'top' : [_('Top (Y) Coord'), _('Top CSS top property')],\
                'left' : [_('Left (X) Coord'), _('Left CSS left property')],\
                'width' : [_('Width (px)'), _('Width of clickable area')],\
                'height' : [_('Height (px)'), _('Height of clickable area')],\
                'hideDelay' : [_('Delay (ms) to hide revealed contents'), _('After delay ms hide the content prev revealed')]\
                }
        self.textFields = {}

        for textFieldName, textFieldDetails in self.textFieldNames.iteritems():
            self.textFields[textFieldName] = TextField(textFieldDetails[INDEX_TITLEFIELD],\
                textFieldDetails[INDEX_INSTRUCTIONFIELD])
            self.textFields[textFieldName].idevice = self.idevice
        
        self.textAreaFieldNames = {\
                'Hint' : [_('Hint to Show for this item'), _('The hint that will appear under the map for this item')],\
                'ShowMe' : [_('Item Revealed'), _('The Item that will be revealed in place')]\
        }

        self.textAreaFields = {}

        for textAreaFieldName, textAreaFieldDetails in self.textAreaFieldNames.iteritems():
            self.textAreaFields[textAreaFieldName] = TextAreaField(textAreaFieldDetails[INDEX_TITLEFIELD],\
                textAreaFieldDetails[INDEX_INSTRUCTIONFIELD], "")
            self.textAreaFields[textAreaFieldName].idevice = self.idevice

    def upgradeToVersion4(self):
        self.message = ""
# ===========================================================================
def register(ideviceStore):
    """Register with the ideviceStore"""
    ideviceStore.extended.append(ClickInOrderIdeviceInc())
    

# ===========================================================================
