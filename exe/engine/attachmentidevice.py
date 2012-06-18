# ===========================================================================
# eXe 
# Copyright 2004-2006, University of Auckland
# Copyright 2006-2009 eXe Project, http://eXeLearning.org/
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

from exe.engine.idevice   import Idevice
from exe.engine.path      import Path
from exe.engine.translate import lateTranslate
from exe.engine.resource  import Resource
from exe.engine.field     import TextAreaField

import logging
log = logging.getLogger(__name__)

# ===========================================================================
class AttachmentIdevice(Idevice):
    """
    An Attachment Idevice allows a file to be attached to a package.
    """
    persistenceVersion = 4
    
    def __init__(self):
        Idevice.__init__(self, 
                         _(u"Attachment"), 
                         _(u"University of Auckland"), 
                         _(u"The attachment iDevice is used to attach "
                             "existing files to your .elp content. For example, "
                             "you might have a PDF file or a PPT presentation "
                             "file that you wish the learners to have access "
                             "to, these can be attached and labeled to indicate "
                             "what the attachment is and how large the file is. "
                             "Learners can click on the attachment link and can "
                             "download the attachment."), u"", u"")

        self.emphasis           = Idevice.NoEmphasis
        self.label              = u''

        self._descriptionInstruc = _(u"Enter the text you wish to associate "
                                      u"with the downloaded file. You might "
                                      u"want to provide instructions on what "
                                      u"you require the learner to do once "
                                      u"the file is downloaded or how the "
                                      u"material should be used.")

        self.descriptionTextArea   = TextAreaField(_(u'Description:'), 
                                          self._descriptionInstruc, u'')
        self.descriptionTextArea.idevice = self

        self._filenameInstruc   = _(u'Click <strong>Select a file</strong>, '
                                    'browse to the file you want '
                                    'to attach and select it.')
        self._labelInstruc      = _(u"<p>"
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


    # Properties
    filenameInstruc = lateTranslate('filenameInstruc')
    labelInstruc = lateTranslate('labelInstruc')
    descriptionInstruc = lateTranslate('descriptionInstruc')


    def setAttachment(self, attachmentPath):
        """
        Store the attachment in the package
        Needs to be in a package to work.
        """ 
        log.debug(u"setAttachment "+unicode(attachmentPath))
        resourceFile = Path(attachmentPath)

        assert self.parentNode, \
               _('Attachment %s has no parentNode') % self.id
        assert self.parentNode.package, \
               _('iDevice %s has no package') % self.parentNode.id

        if resourceFile.isfile():
            if self.userResources:
                # Clear out old attachment/s
                while self.userResources:
                    self.userResources[0].delete()
            # Create the new resource
            Resource(self, resourceFile)
        else:
            log.error('File %s is not a file' % resourceFile)

    def getResourcesField(self, this_resource):
        """
        implement the specific resource finding mechanism for this iDevice:
        """
        # be warned that before upgrading, this iDevice field could not exist:
        if hasattr(self, 'descriptionTextArea')\
        and hasattr(self.descriptionTextArea, 'images'):
            for this_image in self.descriptionTextArea.images:
                if hasattr(this_image, '_imageResource') \
                and this_resource == this_image._imageResource:
                    return self.descriptionTextArea

        # if this_resource wasn't found in the above TextArea, but is still
        # listed within the iDevice's userResources, then we can assume
        # that this_resource is the attached resource, even though that
        # has no direct field.
        # As such, merely return the resource itself, to indicate that
        # it DOES belong to this iDevice, but is not a FieldWithResources:
        if this_resource in self.userResources:
            return this_resource

        return None
      
    def getRichTextFields(self):
        """
        Like getResourcesField(), a general helper to allow nodes to search 
        through all of their fields without having to know the specifics of each
        iDevice type.  
        """
        fields_list = []
        if hasattr(self, 'descriptionTextArea'):
            fields_list.append(self.descriptionTextArea)
        return fields_list
        


    def upgradeToVersion1(self):
        """
        Upgrades v0.6 to v0.7.
        """
        self.lastIdevice = False

    def upgradeToVersion2(self):
        """
        Upgrades to v0.10
        """
        self._upgradeIdeviceToVersion1()
        self._filenameInstruc    = self.__dict__.get('filenameInstruc', '')
        self._labelInstruc       = self.__dict__.get('labelInstruc', '')
        self._descriptionInstruc = self.__dict__.get('descriptionInstruc', '')


    def upgradeToVersion3(self):
        """
        Upgrades to v0.12
        """
        self._upgradeIdeviceToVersion2()
        if self.filename and self.parentNode:
            Resource(self, Path(self.filename))
        del self.filename

    def upgradeToVersion4(self):
        """
        Upgrades to somewhere before version 0.25 (post-v0.24)
        Taking the old .description unicode string field, 
        and converting it into an image-enabled TextAreaField:
        """
        self.descriptionTextArea   = TextAreaField(_(u'Description:'), 
                                         self._descriptionInstruc, 
                                         self.description)
        self.descriptionTextArea.idevice = self

# ===========================================================================
