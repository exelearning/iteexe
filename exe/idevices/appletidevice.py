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
Java Applet Idevice. Enables you to embed java applet in the browser
"""

import Image, ImageDraw
from twisted.persisted.styles import requireUpgrade
import logging

from exe.engine.idevice   import Idevice
from exe.engine.path      import Path, toUnicode
from exe.engine.persist   import Persistable
from exe.engine.resource  import Resource
from exe.engine.translate import lateTranslate

log = logging.getLogger(__name__)

# ===========================================================================

class AppletIdevice(Idevice):
    """
    Java Applet Idevice. Enables you to embed java applet in the browser
    """


    def __init__(self, parentNode=None):
        """
        Sets up the idevice title and instructions etc
        """
        Idevice.__init__(self, 
                         x_(u"Java Applet"), 
                         x_(u"University of Auckland"), 
                         u"",
                         u"",
                         u"",
                             parentNode)
        self.emphasis          = Idevice.NoEmphasis
        self.appletCode        = u""
        self._fileInstruc      = x_(u"""Add all the files provided for the applet
except the .txt file one at a time using the add files and upload buttons. The 
files, once loaded will be displayed beneath the Applet code field.""")
        self._codeInstruc      = x_(u""""Find the .txt file (in the applet file) 
and open it. Copy the contents of this file <ctrl A, ctrl C> into the applet 
code field.""")
        
    # Properties    
    fileInstruc = lateTranslate('fileInstruc')
    codeInstruc = lateTranslate('codeInstruc')

    def uploadFile(self, filePath):
        """
        Store the upload files in the package
        Needs to be in a package to work.
        """ 
        log.debug(u"uploadFile "+unicode(filePath))
        resourceFile = Path(filePath)
        assert(self.parentNode, _('file %s has no parentNode') % self.id)
        assert(self.parentNode.package, _('iDevice %s has no package') % self.parentNode.id)
        if resourceFile.isfile():
             Resource(self, resourceFile)
        else:
            log.error('File %s is not a file' % resourceFile)
    
    
    def deleteFile(self, fileName):
        """
        Delete a selected file
        """
        for resource in self.userResources:
            if resource.storageName == fileName:
                resource.delete()
                break
   
# ===========================================================================
def register(ideviceStore):
    """Register with the ideviceStore"""
    ideviceStore.extended.append(AppletIdevice())    
