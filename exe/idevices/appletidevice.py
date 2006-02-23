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

from exe.engine.idevice  import Idevice
from exe.engine.path     import Path, TempDirPath, toUnicode
from exe.engine.persist  import Persistable
from exe.engine.resource import Resource

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
        self.fileInstruc       = u""
        self.codeInstruc       = u""

    def uploadFile(self, filePath):
        """
        Store the upload files in the package
        Needs to be in a package to work.
        """ 
        log.debug(u"uploadFile "+unicode(filePath))
        resourceFile = Path(filePath)

        assert(self.parentNode,
               _('file %s has no parentNode') % self.id)
        assert(self.parentNode.package,
               _('iDevice %s has no package') % self.parentNode.id)

        if resourceFile.isfile():
            self.userResources += [ Resource(self.parentNode.package, 
                                            resourceFile) ]
        else:
            log.error('File %s is not a file' % resourceFile)
    
    
    def deleteFile(self, file):
        """
        delete a selected file
        """
        for resource in self.userResources:
            if resource.storageName == file:
                self.userResources.remove(resource)
   
# ===========================================================================
def register(ideviceStore):
    """Register with the ideviceStore"""
    ideviceStore.extended.append(AppletIdevice())    