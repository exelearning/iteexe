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
This Idevice makes a memory match game
"""

import logging
from exe.engine.idevice import Idevice
from exe.engine.field   import TextAreaField
from exe.engine.field   import Field
from exe.engine.path      import Path, toUnicode
from exe.engine.resource  import Resource
from extendedfieldengine import *
log = logging.getLogger(__name__)

# ===========================================================================
class MemoryMatchIdeviceInc(Idevice):
    """
    This is an example of a user created iDevice plugin.  If it is copied
    into the user's ~/.exe/idevices dircectory it will be loaded along with
    the system idevices.
    """
    def __init__(self, content=""):
        Idevice.__init__(self, _(u"Memory Match Game"), 
                         _(u"Toughra Technologies FZ LLC."),
                         _(u"""Memory Match Game Maker."""), "", "")

        mainFieldOrder = ['instructions', 'rows', 'cols', 'splitPairs', 'feedbackpositive', 'feedbacknegative', 'feedbackstyle', 'cellwidth', 'cellheight', \
                            'hidetime', 'coverImg', 'cellbackImg', 'revealedBackground', 'positivefeedbackeffect', \
                            'negativefeedbackeffect', 'useTimer', 'timertext', 'timerstyle', 'hideAfterMatch', 'hideAfterMatchEffect', 'cellpadding',\
                            'cellspacing', 'cellstyle']

        mainFieldsInfo = {  'instructions' : ['textarea', 'Instructions to show', 'Instructions'],\
                            'rows' : ['text', 'Number of Rows', 'Number of Rows', {'defaultval' : '2'}],\
                            'cols' : ['text', 'Number of Columns', 'Number of Columns', {'defaultval' : '2'}],\
                            'splitPairs' : ['choice', 'Split Question/Answer Pairs', 'Split Question/Answer Pairs',\
                                {'choices' : [['true', 'Yes'], ['false', 'No']] }],\
                            'feedbackpositive' : ['textarea', 'Feedback to show on correct match', 'Positive Feedback'],\
                            'feedbacknegative' : ['textarea', 'Feedback to show on incorrect pair', 'Negative Feedback'],\
                            'feedbackstyle' : ['text', 'Style of Feedback Area (CSS)', 'CSS style for feedback area'],\
                            'cellwidth' : ['text', 'Width of Cells (in pixels)', 'Cell Width px', {'defaultval' : '100'}],\
                            'cellheight' : ['text', 'Height of Cells (in pixels)', 'Cell Height px', {'defaultval' : '100'}],\
                            'hidetime' : ['text', 'Time after which to re-hide incorrect match (ms)', 'Time to hide', {'defaultval' : '1000'}],\
                            'coverImg' : ['image', 'Cover Image for cells (shown before selected)', 'Cover Img'],\
                            'cellbackImg' : ['image', 'Background Image for cells (shown after selected)', 'Back Img'],\
                            'revealedBackground' : ['image', 'Background image behind cells shown as cells are hidden', 'Bg Img'],\
                            'positivefeedbackeffect' : ['choice', 'Effect for showing positive feedback', 'Positive Feedback Effect',\
                                {'choices' : EXEFIELD_JQUERYUI_EFFECTLIST } ],\
                            'negativefeedbackeffect' : ['choice', 'Effect for showing negative feedback', 'Negative Feedback Effect',\
                                {'choices' : EXEFIELD_JQUERYUI_EFFECTLIST } ],\
                            'useTimer' : ['choice', 'Show / Use a timer?', 'Use Timer?', {'choices' : [['true', 'Yes'], ['false', 'No']]} ],\
                            'hideAfterMatch' : ['choice', 'Hide Cells after match made?', 'Hide after match', \
                                {'choices' : [['true', 'Yes'], ['false', 'No']]} ],\
                            'hideAfterMatchEffect' : ['choice', 'Effect when hiding cells after match', 'Hide after match effect', \
                                {'choices' : EXEFIELD_JQUERYUI_EFFECTLIST } ],\
                            'cellpadding' : ['text', 'Cell Padding in table', 'Cell Padding', {'defaultval' : '0'}],\
                            'cellspacing' : ['text', 'Cell Spacing of table', 'Cell Spacing', {'defaultval' : '0'}],\
                            'cellstyle' : ['text', 'Cell Default Style (CSS)', 'Cell Style CSS', {'defaultval' : 'text-align: center; font: 18pt bold'}],\
                            'timertext' : ['text', 'Text of Timer Label', 'Timer Text'],\
                            'timerstyle' : ['text', 'CSS of Timer Field', 'Timer CSS']\
                        }
        self.mainFieldSet = ExtendedFieldSet(self, mainFieldOrder, mainFieldsInfo)
        self.mainFieldSet.makeFields()
        
        #the pairs of matching items
        self.matchPairFields = []

        self.emphasis = Idevice.NoEmphasis
        
    """
    Game requires jquery (modified slower refresh rate) and jqueryui scripts - these should be in the same
    folder as this idevice source file

    This can then be called from the process method
    """
    def uploadNeededScripts(self):
        from exe import globals
        import os,sys
        scriptFileNames = ['jquery-ui-1.10.3.custom.min.js', 'memmatch-0.1.js']
        for scriptName in scriptFileNames:
            from exe import globals 
            scriptSrcFilename = globals.application.config.webDir/"templates"/scriptName
            gameScriptFile = Path(scriptSrcFilename)
            if gameScriptFile.isfile():
                Resource(self, gameScriptFile)

    
    def setNumMatchingPairs(self):
        numRows = int(self.mainFieldSet.fields['rows'].content)
        numCols = int(self.mainFieldSet.fields['cols'].content)
        
        numPairsExisting = len(self.matchPairFields)
        
        numPairsNeeded = int((numRows * numCols) / 2)
        if numPairsNeeded > numPairsExisting:
            for index in range(numPairsExisting, numPairsNeeded):
                newMatchPairField = MemoryMatchPairField(self)
                self.matchPairFields.append(newMatchPairField)
        elif numPairsNeeded < numPairsExisting:
            #too many - delete some
            del self.matchPairFields[numPairsNeeded:numPairsExisting]
        
        
        
            
        

class MemoryMatchPairField(Field):
    """Represents a matching pair in the memory match game"""
    
    persistenceVersion = 3
    
    def __init__(self, idevice, desc="Memory Match Pair Field", help="Memory Match Pair Field"):
        Field.__init__(self, desc, help)
        self.idevice = idevice
        
        mainFieldOrder  = ['match1', 'match2']
        mainFieldsInfo = {'match1' : ['textarea', 'Match Tile 1', 'Match Tile1'],\
                                'match2' : ['textarea', 'Match Tile 2', 'Match Tile2'] }
                                
        self.mainFields = ExtendedFieldSet(self.idevice, mainFieldOrder, mainFieldsInfo)


# ===========================================================================
def register(ideviceStore):
    """Register with the ideviceStore"""
    ideviceStore.extended.append(MemoryMatchIdeviceInc())
    

# ===========================================================================
