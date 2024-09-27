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
    
    persistenceVersion = 3
    
    def __init__(self, content=""):
        Idevice.__init__(self, x_(u"Sort Items"), 
                         x_(u"Toughra Technologies FZ LLC."), 
                         x_(u"""Sortable list of items."""), "", "")
        mainFieldOrder = ['title', 'instructions', 'sortorder', 'correctoverlay', 'wrongoverlay', 'correcteffect', 'wrongeffect', 'checkbuttontext', \
                         'itemwidth', 'itemheight', 'checkbuttonstyle', 'sortableitemstyle' ]
        
        mainFieldInfo = { \
                 'title' : ['text', x_('Title'), x_('Title to show')], \
                'instructions' : ['textarea', x_('Instructions'), x_('Instructions before sortable list')], \
                'correctoverlay' : ['textarea', x_('Correctly Sorted Overlay'), x_('Shown when check is clicked and correct')], \
                'wrongoverlay' : ['textarea', x_('Wrongly Sorted Overlay'), x_('Shown when check is clicked and wrong')], \
                'correcteffect' : ['choice', x_('Effect for showing correct overlay'), x_('Effect showing correct overlay'), \
                        {'choices' : EXEFIELD_JQUERYUI_EFFECTLIST } ], \
                'wrongeffect' : ['choice', x_('Effect showing wrong answer overlay'), x_('Effect for showing wrong overlay'), \
                        {'choices' : EXEFIELD_JQUERYUI_EFFECTLIST } ], \
                'checkbuttontext' : ['text', x_('Text for Check Button'), x_('Text for Check Button'),\
                                     {"defaultval" : x_("Check")} ], \
                'checkbuttonstyle' : ['text', x_('Check Button Style (CSS)'), x_('CSS for check button'), {"defaultval":"color: white; background-color: green;", "type" : "advanced"}], \
                'itemwidth' : ['text', x_('Width of an item in the list (px)'), x_('width'), {"defaultval":"300", "type" : "advanced"}], \
                'itemheight' : ['text', x_('Height of an item in the list (px)'), x_('height'), {"defaultval":"80", "type" : "advanced"}], \
                'sortableitemstyle' : ['text', x_('Style (CSS) for sortable items'), x_('Sortable Item CSS'), {"defaultval":"background-color: green; color: white; margin: 10px; padding: 5px;", "type" : "advanced"}],\
                'sortorder' : ['choice', x_('Sort Direction'), x_('Sort Direction'),\
                               {'choices' : [["ttb", "Top To Bottom"], ["ltr", "Left to Right"], ["rtl" , "Right to Left"]] } ] \
                }
        
        """
        to make sure that these get picked up as strings that need translated
        this localization is actually done in extendedfieldengine so if the auhtor
        copies this from a machine running in one language to another the output
        of the dropdown menu will be localized at the time of rendering 
        """  
        x_("Top To Bottom")
        x_("Left to Right")
        x_("Right to Left")


        self.mainFieldSet = ExtendedFieldSet(self, mainFieldOrder, mainFieldInfo)
        self.mainFieldSet.makeFields()
        
        #array of TextAreaFields that are to be sorted (script will randomize it)
        self.itemsToSort = []
        self.addItemToSort()

        self.emphasis = Idevice.SomeEmphasis
        self.message = ""

    def addItemToSort(self):
        newTextAreaField = TextAreaField(x_("Sortable Item"), x_("Text / Content of sortable item"))
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
        self.mainFieldSet.fieldInfoDict['sortorder'] = ['choice', x_('Sort Direction'), x_('Sort Direction'),\
                               {'choices' : [["ttb", x_("Top To Bottom")], ["ltr", x_("Left to Right")], ["rtl" , x_("Right to Left")]] } ]
        self.mainFieldSet.fieldOrder =['instructions', 'sortorder', 'correctoverlay', 'wrongoverlay', 'correcteffect', 'wrongeffect', 'checkbuttontext', \
                         'itemwidth', 'itemheight', 'checkbuttonstyle', 'sortableitemstyle' ]
        self.mainFieldSet.makeFields()
        self.mainFieldSet.fields['sortorder'].content = "rtl"
           
    """
    Updated version of JQueryUI
    """       
    def upgradeToVersion2(self):
        self.uploadNeededScripts()
        
    """
    Added title field, changed emphasis
    """
    def upgradeToVersion3(self):
        self.mainFieldSet.fieldInfoDict['title'] =  ['text', x_('Title'), x_('Title to show')]
        self.mainFieldSet.fieldOrder.insert(0, "title")
        self.emphasis = Idevice.SomeEmphasis

# ===========================================================================
def register(ideviceStore):
    """Register with the ideviceStore"""
    ideviceStore.extended.append(SortIdeviceInc())
    

# ===========================================================================
