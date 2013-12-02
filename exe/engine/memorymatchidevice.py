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
    
    persistenceVersion = 4
    
    def __init__(self, content=""):
        Idevice.__init__(self, x_(u"Memory Match Game"), 
                         x_(u"Toughra Technologies FZ LLC."),
                         x_(u"""Memory Match Game Maker."""), "", "")
        self.message = ""
        
        mainFieldOrder = ['title', 'instructions', 'rows', 'cols', 'splitPairs', 'feedbackpositive', 'feedbacknegative', 'feedbackstyle',  \
                            'hidetime', 'coverImg', 'cellbackImg', 'revealedBackground', 'positivefeedbackeffect', \
                            'negativefeedbackeffect', 'useTimer', 'timertext', 'timerstyle', 'hideAfterMatch', 'hideAfterMatchEffect', 'cellpadding',\
                            'cellspacing', 'cellstyle']

        mainFieldsInfo = {  'title' : ['text', x_('Title'), x_('Title')], \
                            'instructions' : ['textarea', x_('Instructions to show'), x_('Instructions')],\
                            'rows' : ['text', x_('Number of Rows'), x_('Number of Rows'), {'defaultval' : '2'}],\
                            'cols' : ['text', x_('Number of Columns'), x_('Number of Columns'), {'defaultval' : '2'}],\
                            'splitPairs' : ['choice', x_('Split Question/Answer Pairs'), x_('Split Question/Answer Pairs'),\
                                {'choices' : [['true', x_('Yes')], ['false', x_('No')]] }],\
                            'feedbackpositive' : ['textarea', x_('Feedback to show on correct match'), x_('Positive Feedback')],\
                            'feedbacknegative' : ['textarea', x_('Feedback to show on incorrect pair'), x_('Negative Feedback')],\
                            'feedbackstyle' : ['text', x_('Style of Feedback Area (CSS)'), x_('CSS style for feedback area'), {'type': 'advanced'}],\
                            'cellwidth' : ['text', x_('Width of Cells (in pixels)'), x_('Cell Width px'), {'defaultval' : '100'}],\
                            'cellheight' : ['text', x_('Height of Cells (in pixels)'), x_('Cell Height px'), {'defaultval' : '100'}],\
                            'hidetime' : ['text', x_('Time after which to re-hide incorrect match (ms)'), x_('Time to hide'), {'defaultval' : '1000', 'type': 'advanced'}],\
                            'coverImg' : ['image', x_('Cover Image for cells (shown before selected)'), x_('Cover Img'), {'defaultval' : 'memmatch_covercelldefault.png'}],\
                            'cellbackImg' : ['image', x_('Background Image for cells (shown after selected)'), x_('Back Img'), {'defaultval' : 'memmatch_showcelldefaultbg.png'}],\
                            'revealedBackground' : ['image', x_('Background image behind cells shown as cells are hidden'), x_('Bg Img')],\
                            'positivefeedbackeffect' : ['choice', x_('Effect for showing positive feedback'), x_('Positive Feedback Effect'),\
                                {'choices' : EXEFIELD_JQUERYUI_EFFECTLIST } ],\
                            'negativefeedbackeffect' : ['choice', x_('Effect for showing negative feedback'), x_('Negative Feedback Effect'),\
                                {'choices' : EXEFIELD_JQUERYUI_EFFECTLIST } ],\
                            'useTimer' : ['choice', x_('Show / Use a timer?'), x_('Use Timer?'), {'choices' : [['true', 'Yes'], ['false', 'No']]} ],\
                            'hideAfterMatch' : ['choice', x_('Hide Cells after match made?'), x_('Hide after match'), \
                                {'choices' : [['true', x_('Yes')], ['false', x_('No')]]} ],\
                            'hideAfterMatchEffect' : ['choice', x_('Effect when hiding cells after match'), x_('Hide after match effect'), \
                                {'choices' : EXEFIELD_JQUERYUI_EFFECTLIST } ],\
                            'cellpadding' : ['text', x_('Cell Padding in table'), x_('Cell Padding'), {'defaultval' : '0','type': 'advanced'}],\
                            'cellspacing' : ['text', x_('Cell Spacing of table'), x_('Cell Spacing'), {'defaultval' : '0','type': 'advanced'}],\
                            'cellstyle' : ['text', x_('Cell Default Style (CSS)'), x_('Cell Style CSS'), {'defaultval' : 'text-align: center; font: 18pt bold','type': 'advanced'}],\
                            'timertext' : ['text', x_('Text of Timer Label'), x_('Timer Text'), {'type': 'advanced'}],\
                            'timerstyle' : ['text', x_('CSS of Timer Field'), x_('Timer CSS'), {'type': 'advanced'}]\
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
        scriptFileNames = ['jquery-ui-1.10.3.custom.min.js', 'memmatch-0.2.js']
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
        self.mainFieldSet.fieldInfoDict['title'] = ['text', x_('Title'), x_('Title')]
        self.mainFieldSet.makeFields()
        
    def upgradeToVersion3(self):
        self.mainFieldSet.fieldInfoDict['coverImg'][3] = {'defaultval' : 'memmatch_covercelldefault.png'}
        self.mainFieldSet.fieldInfoDict['cellbackImg'][3] = {'defaultval' : 'memmatch_showcelldefaultbg.png'}
    
    """
    Changed javascript
    """
    def upgradeToVersion4(self):
        self.uploadNeededScripts()
    
    
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
    
    def __init__(self, idevice, desc=x_("Memory Match Pair Field"), help=x_("Memory Match Pair Field")):
        Field.__init__(self, desc, help)
        self.idevice = idevice
        
        mainFieldOrder  = ['match1', 'match2']
        mainFieldsInfo = {'match1' : ['textarea', x_('Match Tile 1'), x_('Match Tile1')],\
                                'match2' : ['textarea', x_('Match Tile 2'), x_('Match Tile2')] }
                                
        self.mainFields = ExtendedFieldSet(self.idevice, mainFieldOrder, mainFieldsInfo)


# ===========================================================================
def register(ideviceStore):
    """Register with the ideviceStore"""
    ideviceStore.extended.append(MemoryMatchIdeviceInc())
    

# ===========================================================================
