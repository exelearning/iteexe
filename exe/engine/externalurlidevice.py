# ===========================================================================
# eXe 
# Copyright 2004-2006, University of Auckland
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
ExternalUrlIdevice: just has a block of text
"""

import logging
from exe.engine.idevice import Idevice
from exe.engine.translate import lateTranslate
log = logging.getLogger(__name__)

# ===========================================================================
class ExternalUrlIdevice(Idevice):
    """
    ExternalUrlIdevice: just has a field for the url
    """
    persistenceVersion = 3

    def __init__(self, content=""):
        Idevice.__init__(self, x_(u"External Web Site"), 
                         x_(u"University of Auckland"), 
                         x_(u"""The external website iDevice loads an external website 
into an inline frame in your eXe content rather then opening it in a popup box. 
This means learners are not having to juggle windows. 
This iDevice should only be used if your content 
will be viewed by learners online."""), "", "")
        self.emphasis = Idevice.NoEmphasis
        self.url      = ""
        self.height   = "300"
       
        self._urlInstruc = x_(u"""Enter the URL you wish to display
and select the size of the area to display it in.""")

        #Properties
    urlInstruc = lateTranslate('urlInstruc')

    def getResourcesField(self, this_resource):
        """
        implement the specific resource finding mechanism for this iDevice:
        """ 
        # NOTE that the ExternalURL iDevice has NO additional resources:
        return None

      
    def getRichTextFields(self):
        """
        Like getResourcesField(), a general helper to allow nodes to search 
        through all of its fields without having to know the specifics of each 
        iDevice type.  
        """
        # ExternalURL has no rich-text fields:
        return []
        

    def upgradeToVersion1(self):
        """
        Upgrades exe to v0.10
        """
        self._upgradeIdeviceToVersion1()
    
    def upgradeToVersion2(self):
        """
        Upgrades to v0.12
        """
        self._upgradeIdeviceToVersion2()        

    def upgradeToVersion3(self):
        """
        add _urlInstruc
        """
        self._urlInstruc = x_(u"""Enter the URL you wish to display
and select the size of the area to display it in.""")
    
# ===========================================================================
