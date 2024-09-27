# ===========================================================================
# eXe 
# Copyright 2004-2006, University of Auckland
# Copyright 2004-2008 eXe Project, http://eXeLearning.org/
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
Fran Macias , exelearning.net
"""

import logging
from exe.engine.idevice   import Idevice
from exe.engine.translate import lateTranslate
from exe.engine.field     import TextAreaField
import re
log = logging.getLogger(__name__)

# ===========================================================================
class NotaIdevice(Idevice):
    """
    Note Idevice is for comments
    """
    persistenceVersion = 7
    
    def __init__(self, activity = "", answer = ""):
        """
        Initialize 
        """
        Idevice.__init__(self, 
                         x_(u"Note"),
                         x_(u"exelearning.net"), 
                         u"", u"Note", "")
        self.emphasis         = Idevice.SomeEmphasis
        self._commentInstruc   = u""
        self.systemResources += ["common.js"]
        


        self.commentTextArea = TextAreaField(x_(u'Comment:'), 
                                   self._commentInstruc, answer)
        self.commentTextArea.idevice = self

    # Properties
    commentInstruc   = lateTranslate('commentInstruc')


    def getResourcesField(self, this_resource):
        """
        implement the specific resource finding mechanism for this iDevice:
        """ 
        # be warned that before upgrading, this iDevice field could not exist:


        # be warned that before upgrading, this iDevice field could not exist:
        if hasattr(self, 'commentTextArea')\
        and hasattr(self.commentTextArea, 'images'):
            for this_image in self.commentTextArea.images: 
                if hasattr(this_image, '_imageResource') \
                    and this_resource == this_image._imageResource: 
                        return self.commentTextArea

        return None

    def getRichTextFields(self):
        """
        Like getResourcesField(), a general helper to allow nodes to search 
        through all of their fields without having to know the specifics of each
        iDevice type.  
        """
        fields_list = []

        if hasattr(self, 'commentTextArea'):
            fields_list.append(self.commentTextArea)

        return fields_list

    def upgradeToVersion1(self):
        """
        Upgrades the node from version 0 to 1.
        """
        log.debug(u"Upgrading iDevice")



    def upgradeToVersion2(self):
        """
        Upgrades the node from 1 (v0.5) to 2 (v0.6).
        Old packages will loose their icons, but they will load.
        """
        log.debug(u"Upgrading iDevice")
        self.emphasis = Idevice.SomeEmphasis

        
    def upgradeToVersion3(self):
        """
        Upgrades v0.6 to v0.7.
        """
        self.lastIdevice = False


    def upgradeToVersion4(self):
        """
        Upgrades to exe v0.10
        """
        self._upgradeIdeviceToVersion1()
        self._commentInstruc   = self.__dict__['commentInstruc']
   

    def upgradeToVersion5(self):
        """
        Upgrades to exe v0.10
        """
        self._upgradeIdeviceToVersion1()


    def upgradeToVersion6(self):
        """
        Upgrades to v0.12
        """
        self._upgradeIdeviceToVersion2()
        self.systemResources += ["common.js"]


    def upgradeToVersion7(self):
        """ 
        Upgrades to somewhere before version 0.25 (post-v0.24) 
        Taking the old unicode string fields, and converting them 
        into image-enabled TextAreaFields:
        """
        self.commentTextArea = TextAreaField(x_(u'Feedback:'), 
                                  self._commentInstruc, self.answer)
        self.commentTextArea.idevice = self
        
    def upgradeToVersion8(self):
        self.icon=""

# ===========================================================================
