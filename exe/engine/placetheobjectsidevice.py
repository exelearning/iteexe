# ===========================================================================
# Place the Objects Idevice for eXe Learning.   
# 
# Copyright Mike Dawson / PAIWASTOON Networking Services Ltd.
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
Place the objects game requires the player to place a number of components 
on a background area in the correct place.  This could be organs in the correct
place in the human body etc.  For these elements a TextArea field is used that
is then cropped / sized accordingly.
"""

import logging
from exe.engine.idevice import Idevice
from exe.engine.field   import TextAreaField
from exe.engine.field   import TextField
from exe.engine.field   import Field
from exe.engine.path      import Path, toUnicode
from exe.engine.resource  import Resource
log = logging.getLogger(__name__)

# ===========================================================================
class PlaceTheObjectsIdeviceInc(Idevice):
    """
    This is an example of a user created iDevice plugin.  If it is copied
    into the user's ~/.exe/idevices dircectory it will be loaded along with
    the system idevices.
    """
    def __init__(self, content=""):
        Idevice.__init__(self, _(u"Place The Objects"), 
                         _(u"Mike Dawson / PAIWASTOON Networking Services Ltd."), 
                         _(u"""User has to place various objects in the correct place."""), "", "")
        self.emphasis = Idevice.NoEmphasis
        self.content  = TextAreaField(_(u"Instructions"), 
                                      _(u"This is a free text field."), 
                                      content)
        self.content.idevice = self

        #This is the main field where objects will be dragged to
        self.mainArea = TextAreaField(_(u"Main Area"),
                                        _(u"This is the main image where the user will drag / drop items to"),
                                        "")
        self.mainArea.idevice = self

        self.gameTimeLimit = TextField(_(u"Time Limit (mm:ss)"), _(u"(Optional) Game Time Limit"), "")
        self.gameTimeLimit.idevice = self
        self.gameTimerShown = TextField(_(u"Show Timer"), _(u"Even if there is no time limit, show the timer..."), "")
        self.gameTimerShown.idevice = self

        #these are shown when there is a right / wrong response
        self.clickToStartGameArea = TextAreaField(u"Message to click game to start", u"This will when clicked start the game", "")
        self.clickToStartGameArea.idevice = self
        self.positiveResponseArea = TextAreaField(_(u"Positive Response"), u"Overlays main area when player correctly places object", "")
        self.positiveResponseArea.idevice = self
        self.negativeResponseArea = TextAreaField(u"Negative Response", u"Overlays main area when player guesses wrong", "")
        self.negativeResponseArea.idevice = self

        self.partbinNumCols = TextField("Number of Columns in part bin", "Columns part bin")
        self.partbinNumCols.idevice = self

        #This is a list of objects to place
        self.objectsToPlace = []
        self.addPlacableObject()

    """
    This will add a new placable object to the list
    """
    def addPlacableObject(self):
        newPlacableObject = PlacableObjectField("Object to Place", self)
        self.objectsToPlace.append(newPlacableObject)


    """
    Game requires jquery and jqueryui scripts - these should be in the same
    folder as this idevice source file

    This can then be called from the process method
    """
    def uploadNeededScripts(self):
        from exe import globals
        import os,sys
        scriptFileNames = ['jquery-ui-1.10.3.custom.min.js', 'placetheobjects.js']
        for scriptName in scriptFileNames:
            from exe import globals 
            scriptSrcFilename = globals.application.config.webDir/"templates"/scriptName
            gameScriptFile = Path(scriptSrcFilename)
            if gameScriptFile.isfile():
                Resource(self, gameScriptFile)


class PlacableObjectField(Field):
    """
    This class is just to hold together the fields relating to a placed object 
    """
    persistenceVersion = 3

    def __init__(self, name, idevice, instruction="An object that has a correct place in the main area", content=""):
        Field.__init__(self, name, instruction)
        self.mainContentField = TextAreaField(_(u"Placable Object"), _(u"Object to be put in place"), "")
        self.idevice = idevice
        self.mainContentField.idevice = idevice
        
        self.targetX = TextField(_(u"Correct Location (x)"), _(u"Where this object belongs in the main area x coordinate"), "0")
        self.targetX.idevice = idevice

        self.targetY = TextField(_(u"Correct Location (y)"), _(u"Where this object belongs in the main area y coordinate"), "0")
        self.targetY.idevice = idevice

        self.width = TextField(_(u"Width (pixels)"), _(u"Width of object"), "100")
        self.width.idevice = idevice

        self.height = TextField(_(u"Height (pixels)"), _(u"Height of object"), "100")
        self.height.idevice = idevice

        self.tolerance = TextField(_(u"Tolerance (pixels)"), _(u"Tolerance when dropping num of pixels"), "20")
        self.tolerance.idevice = idevice
    


# ===========================================================================
def register(ideviceStore):
    """Register with the ideviceStore"""
    ideviceStore.extended.append(PlaceTheObjectsIdeviceInc())
    

# ===========================================================================
