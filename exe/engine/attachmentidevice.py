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
An Attachment Idevice allows a file to be attached to a package.
"""

from exe.engine.idevice  import Idevice
from exe.engine.path     import Path

import logging
import gettext
_ = gettext.gettext
log = logging.getLogger(__name__)

# ===========================================================================
class AttachmentIdevice(Idevice):
    """
    An Attachment Idevice allows a file to be attached to a package.
    """
    persistenceVersion = 1
    
    def __init__(self):
        Idevice.__init__(self, 
                         _(u"Attachment"), 
                         _(u"University of Auckland"), 
                         _(u""), 
                         u"", u"")
        self.emphasis           = Idevice.NoEmphasis
        self.filename           = u""
        self.filenameInstruc    = (u'Click <strong>Select a file</strong>, '
                                    'browse to the file you want '
                                   'to attach and select it.')
        self.label              = u""
        self.labelInstruc       = (u"<p>"
                                    "Assign a label for the attachment. It "
                                    "is useful to include the type of file. "
                                    "Eg. pdf, ppt, etc."
                                    "</p>"
                                    "<p>"
                                    "Including the size is also recommended so "
                                    "that after your package is exported "
                                    "to a web site, people will have an idea "
                                    "how long it would take to download this "
                                    "attachment."
                                    "</p>"
                                    "<p>"
                                    "For example: "
                                    "<code>Sales Forecast.doc (500kb)</code>"
                                    "</p>")
        self.description        = u""
        self.descriptionInstruc = (u"Provide a brief description of the "
                                    "file")

    def getResources(self):
        """
        Return the resource files used by this iDevice
        """
        return Idevice.getResources(self) + [ self.filename ]


    def setAttachment(self, attachmentPath):
        """
        Store the attachment in the package
        Needs to be in a package to work.
        """ 
        log.debug(u"setAttachment "+unicode(attachmentPath))
        resourceFile = Path(attachmentPath)

        assert(self.parentNode,
               'Attachment '+self.id+' has no parentNode')
        assert(self.parentNode.package,
               'iDevice '+self.parentNode.id+' has no package')

        if resourceFile.isfile():
            package = self.parentNode.package

            if self.filename:
                package.deleteResource(self.filename)

            self.filename = self.id + u"_" + unicode(resourceFile.basename())
            package.addResource(resourceFile, self.filename)

        else:
            log.error('File %s is not a file' % resourceFile)


    def delete(self):
        """
        Delete the attachment from the package
        Needs to be in a package to work.
        """
        assert(self.parentNode,
               'Attachment '+self.id+' has no parentNode')
        assert(self.parentNode.package,
               'iDevice '+self.parentNode.id+' has no package')

        if self.filename:
            self.parentNode.package.deleteResource(self.filename)
            self.filename = u""

        Idevice.delete(self)
        
    def upgradeToVersion1(self):
        """
        Upgrades v0.6 to v0.7.
        """
        self.lastIdevice = False

# ===========================================================================
