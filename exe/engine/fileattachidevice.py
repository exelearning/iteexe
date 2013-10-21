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
File Attachment iDevice can be used by content authors to attach arbitary
files
"""

import logging
from exe.engine.idevice import Idevice
from exe.engine.field   import TextAreaField
from extendedfieldengine    import *
log = logging.getLogger(__name__)

# ===========================================================================
class FileAttachIdeviceInc(Idevice):
    
    persistenceVersion = 2
    
    def __init__(self, content=""):
        Idevice.__init__(self, _(u"File Attachments"), 
                         _(u"Toughra Technologies FZ LLC."), 
                         _(u"""File Attachments Idevice."""), "", "")
        self.emphasis = Idevice.SomeEmphasis
        
        self.fileAttachmentFields = []
        self.fileAttachmentsDesc = []
        
        self.showDesc = ChoiceField(self, [["yes" , "Yes"], ["no" , "No"]],\
                                    "Show description and link", "Show Description")
        self.showDesc.idevice = self
        
        self.introHTML = TextAreaField("Intro Text", "Intro Text")
        self.introHTML.idevice = self
        self.addFileAttachmentField()
        
        #because it looks like a paperclip :)
        self.icon = "assignment"
        
    def addFileAttachmentField(self):
        newFileField = FileField(self)
        self.fileAttachmentFields.append(newFileField)

    def delFileAttachmentField(self, index):
        pass
    
    def upgradeToVersion2(self):
        self.emphasis = Idevice.SomeEmphasis
        self.fileAttachmentsDesc = []
        self.showDesc = ChoiceField(self, [["yes" , "Yes"], ["no" , "No"]],\
                                    "Show description and link", "Show Description")
        self.showDesc.content = "no"
        self.introHTML = TextAreaField("Intro Text")
        self.icon = "assignment"

# ===========================================================================
def register(ideviceStore):
    """Register with the ideviceStore"""
    ideviceStore.extended.append(FileAttachIdeviceInc())
    

# ===========================================================================
