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
    
    persistenceVersion = 3
    
    def __init__(self, content=""):
        Idevice.__init__(self, _(u"Memory Match Game"), 
                         _(u"Toughra Technologies FZ LLC."),
                         _(u"""Memory Match Game Maker."""), "", "")
        self.message = ""
        
        mainFieldOrder = ['title', 'instructions', 'rows', 'cols', 'splitPairs', 'feedbackpositive', 'feedbacknegative', 'feedbackstyle', 'cellwidth', 'cellheight', \
                            'hidetime', 'coverImg', 'cellbackImg', 'revealedBackground', 'positivefeedbackeffect', \
                            'negativefeedbackeffect', 'useTimer', 'timertext', 'timerstyle', 'hideAfterMatch', 'hideAfterMatchEffect', 'cellpadding',\
                            'cellspacing', 'cellstyle']

        mainFieldsInfo = {  'title' : ['text', _('Title'), _('Title')], \
                            'instructions' : ['textarea', _('Instructions to show'), _('Instructions')],\
                            'rows' : ['text', _('Number of Rows'), _('Number of Rows'), {'defaultval' : '2'}],\
                            'cols' : ['text', _('Number of Columns'), _('Number of Columns'), {'defaultval' : '2'}],\
                            'splitPairs' : ['choice', _('Split Question/Answer Pairs'), _('Split Question/Answer Pairs'),\
                                {'choices' : [['true', 'Yes'], ['false', 'No']] }],\
                            'feedbackpositive' : ['textarea', _('Feedback to show on correct match'), _('Positive Feedback')],\
                            'feedbacknegative' : ['textarea', _('Feedback to show on incorrect pair'), _('Negative Feedback')],\
                            'feedbackstyle' : ['text', _('Style of Feedback Area (CSS)'), _('CSS style for feedback area'), {'type': 'advanced'}],\
                            'cellwidth' : ['text', _('Width of Cells (in pixels)'), _('Cell Width px'), {'defaultval' : '100'}],\
                            'cellheight' : ['text', _('Height of Cells (in pixels)'), _('Cell Height px'), {'defaultval' : '100'}],\
                            'hidetime' : ['text', _('Time after which to re-hide incorrect match (ms)'), _('Time to hide'), {'defaultval' : '1000', 'type': 'advanced'}],\
                            'coverImg' : ['image', _('Cover Image for cells (shown before selected)'), _('Cover Img'), {'defaultval' : 'memmatch_covercelldefault.png'}],\
                            'cellbackImg' : ['image', _('Background Image for cells (shown after selected)'), _('Back Img'), {'defaultval' : 'memmatch_showcelldefaultbg.png'}],\
                            'revealedBackground' : ['image', _('Background image behind cells shown as cells are hidden'), _('Bg Img')],\
                            'positivefeedbackeffect' : ['choice', _('Effect for showing positive feedback'), _('Positive Feedback Effect'),\
                                {'choices' : EXEFIELD_JQUERYUI_EFFECTLIST } ],\
                            'negativefeedbackeffect' : ['choice', _('Effect for showing negative feedback'), _('Negative Feedback Effect'),\
                                {'choices' : EXEFIELD_JQUERYUI_EFFECTLIST } ],\
                            'useTimer' : ['choice', _('Show / Use a timer?'), _('Use Timer?'), {'choices' : [['true', 'Yes'], ['false', 'No']]} ],\
                            'hideAfterMatch' : ['choice', _('Hide Cells after match made?'), _('Hide after match'), \
                                {'choices' : [['true', 'Yes'], ['false', 'No']]} ],\
                            'hideAfterMatchEffect' : ['choice', _('Effect when hiding cells after match'), _('Hide after match effect'), \
                                {'choices' : EXEFIELD_JQUERYUI_EFFECTLIST } ],\
                            'cellpadding' : ['text', _('Cell Padding in table'), _('Cell Padding'), {'defaultval' : '0','type': 'advanced'}],\
                            'cellspacing' : ['text', _('Cell Spacing of table'), _('Cell Spacing'), {'defaultval' : '0','type': 'advanced'}],\
                            'cellstyle' : ['text', _('Cell Default Style (CSS)'), _('Cell Style CSS'), {'defaultval' : 'text-align: center; font: 18pt bold','type': 'advanced'}],\
                            'timertext' : ['text', _('Text of Timer Label'), _('Timer Text'), {'type': 'advanced'}],\
                            'timerstyle' : ['text', _('CSS of Timer Field'), _('Timer CSS'), {'type': 'advanced'}]\
                        }
        self.mainFieldSet = ExtendedFieldSet(self, mainFieldOrder, mainFieldsInfo)
        self.mainFieldSet.makeFields()
        
        #the pairs of matching items
        self.matchPairFields = []

        self.emphasis = Idevice.SomeEmphasis
        
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

    def upradeToVersion2(self):
        self.message = ""
        self.emphasis = Idevice.SomeEmphasis
        self.mainFieldSet.fieldOrder.insert(0, "title")
        self.mainFieldSet.fieldInfoDict['title'] = ['text', _('Title'), _('Title')]
        self.mainFieldSet.makeFields()
        
    def upgradeToVersion3(self):
        self.mainFieldSet.fieldInfoDict['coverImg'][3] = {'defaultval' : 'memmatch_covercelldefault.png'}
        self.mainFieldSet.fieldInfoDict['cellbackImg'][3] = {'defaultval' : 'memmatch_showcelldefaultbg.png'}
    
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
        mainFieldsInfo = {'match1' : ['textarea', _('Match Tile 1'), _('Match Tile1')],\
                                'match2' : ['textarea', _('Match Tile 2'), _('Match Tile2')] }
                                
        self.mainFields = ExtendedFieldSet(self.idevice, mainFieldOrder, mainFieldsInfo)


# ===========================================================================
def register(ideviceStore):
    """Register with the ideviceStore"""
    ideviceStore.extended.append(MemoryMatchIdeviceInc())
    

# ===========================================================================
