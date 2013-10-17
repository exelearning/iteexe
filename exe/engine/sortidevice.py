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
This idevice makes a list of items in random order that have to be sorted
back into the correct order.  the button will then show if they are correct
or not...
"""

import logging
from exe.engine.idevice import Idevice
from exe.engine.field   import TextAreaField
from exe.engine.path      import Path, toUnicode
from exe.engine.resource  import Resource
from extendedfieldengine import *
log = logging.getLogger(__name__)

# ===========================================================================
class SortIdeviceInc(Idevice):
    """
    This is an example of a user created iDevice plugin.  If it is copied
    into the user's ~/.exe/idevices dircectory it will be loaded along with
    the system idevices.
    """
    
    persistenceVersion = 2
    
    def __init__(self, content=""):
        Idevice.__init__(self, _(u"Sort Items"), 
                         _(u"Toughra Technologies FZ LLC."), 
                         _(u"""Sortable list of items."""), "", "")
        mainFieldOrder = ['instructions', 'sortorder', 'correctoverlay', 'wrongoverlay', 'correcteffect', 'wrongeffect', 'checkbuttontext', \
                         'itemwidth', 'itemheight', 'checkbuttonstyle', 'sortableitemstyle' ]
        
        mainFieldInfo = { \
                'instructions' : ['textarea', 'Instructions', 'Instructions before sortable list'], \
                'correctoverlay' : ['textarea', 'Correctly Sorted Overlay', 'Shown when check is clicked and correct'], \
                'wrongoverlay' : ['textarea', 'Wrongly Sorted Overlay', 'Shown when check is clicked and wrong'], \
                'correcteffect' : ['choice', 'Effect for showing correct overlay', 'Effect showing correct overlay', \
                        {'choices' : EXEFIELD_JQUERYUI_EFFECTLIST } ], \
                'wrongeffect' : ['choice', 'Effect showing wrong answer overlay', 'Effect for showing wrong overlay', \
                        {'choices' : EXEFIELD_JQUERYUI_EFFECTLIST } ], \
                'checkbuttontext' : ['text', 'Text for Check Button', 'Text for Check Button',\
                                     {"defaultval" : "Check"} ], \
                'checkbuttonstyle' : ['text', 'Check Button Style (CSS)', 'CSS for check button', {"defaultval":"color: white; background-color: green;"}], \
                'itemwidth' : ['text', 'Width of an item in the list (px)', 'width', {"defaultval":"300"}], \
                'itemheight' : ['text', 'Height of an item in the list (px)', 'height', {"defaultval":"80"}], \
                'sortableitemstyle' : ['text', 'Style (CSS) for sortable items', 'Sortable Item CSS', {"defaultval":"background-color: green; color: white; margin: 10px; padding: 5px;"}],\
                'sortorder' : ['choice', 'Sort Direction', 'Sort Direction',\
                               {'choices' : [["ttb", "Top To Bottom"], ["ltr", "Left to Right"], ["rtl" , "Right to Left"]] } ] \
                }

        self.mainFieldSet = ExtendedFieldSet(self, mainFieldOrder, mainFieldInfo)
        self.mainFieldSet.makeFields()
        
        #array of TextAreaFields that are to be sorted (script will randomize it)
        self.itemsToSort = []
        self.addItemToSort()

        self.emphasis = Idevice.NoEmphasis

    def addItemToSort(self):
        newTextAreaField = TextAreaField("Sortable Item", "Text / Content of sortable item")
        newTextAreaField.idevice = self
        self.itemsToSort.append(newTextAreaField)
        
    """
    Game requires jquery and jqueryui scripts - these should be in the same
    folder as this idevice source file

    This can then be called from the process method
    """
    def uploadNeededScripts(self):
        from exe import globals
        import os,sys
        scriptFileNames = ['jquery-ui-1.10.3.custom.min.js', 'sortItems.js']
        for scriptName in scriptFileNames:
            
            from exe import globals 
            scriptSrcFilename = globals.application.config.webDir/"templates"/scriptName
            gameScriptFile = Path(scriptSrcFilename)
            if gameScriptFile.isfile():
                Resource(self, gameScriptFile)
            
            

    def upgradeToVersion1(self):
        self.mainFieldSet.fieldInfoDict['sortorder'] = ['choice', 'Sort Direction', 'Sort Direction',\
                               {'choices' : [["ttb", "Top To Bottom"], ["ltr", "Left to Right"], ["rtl" , "Right to Left"]] } ]
        self.mainFieldSet.fieldOrder =['instructions', 'sortorder', 'correctoverlay', 'wrongoverlay', 'correcteffect', 'wrongeffect', 'checkbuttontext', \
                         'itemwidth', 'itemheight', 'checkbuttonstyle', 'sortableitemstyle' ]
        self.mainFieldSet.makeFields()
        self.mainFieldSet.fields['sortorder'].content = "rtl"
           
    """
    Updated version of JQueryUI
    """       
    def upgradeToVersion2(self):
        self.uploadNeededScripts()

# ===========================================================================
def register(ideviceStore):
    """Register with the ideviceStore"""
    ideviceStore.extended.append(SortIdeviceInc())
    

# ===========================================================================
