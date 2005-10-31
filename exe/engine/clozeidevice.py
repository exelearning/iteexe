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
Cloze Idevice. Shows a paragraph where the student must fill in the blanks
"""

import logging
from exe.engine.idevice import Idevice
from exe.engine.path    import Path
from exe.engine.field   import ClozeField, TextAreaField
from exe.engine.persist import Persistable
import Image
log = logging.getLogger(__name__)

# ===========================================================================
class ClozeIdevice(Idevice):
    """
    Holds a paragraph with words missing that the student must fill in
    """
    
    persistenceVersion = 1

    def __init__(self, parentNode=None):
        """
        Sets up the idevice title and instructions etc
        """
        Idevice.__init__(self, _(u"Cloze Activity"),
                         x_(u"University of Auckland"), 
                         x_(u"This Idevice is used to help students learn "
                            u"passages of text and to develop an understanding "
                            u"of the way words are used in a certain subject or "
                            u"language"),
                         x_(u"Take a passage of text and put some gaps in it by "
                            u"putting underscores (_) on either side of the "
                            u"word. For example: <i>The third _word_ in this "
                            u"text not be shown to students</i>.<br/>When "
                            u"checking the student's entry, case is ignored"),
                            u"question",
                             parentNode)
        self.instructionsForLearners = TextAreaField(
            x_(u'Instructions For Learners'),
            x_(u'Put instructions for learners here'),
            x_(u'Read the paragraph below and '
                'fill in the missing words'))
        self.instructionsForLearners.idevice = self
        self._content = ClozeField(x_(u'Cloze'), 
            x_(u'<p>Enter a passage of text, to make a gap that the user must '
                'fill put underscores (_) on either side of the word. For '
                'example:</p>'
                'The fith and last _words_ of this text need to be filled in '
                'by the _student_'))
        self._content.idevice = self
        self.feedback = TextAreaField(x_(u'Feedback'), 
                                      x_(u'Place feedback here'))
        self.feedback.idevice = self
        self.emphasis = Idevice.SomeEmphasis

    def getResources(self):
        """
        Return the resource files used by this iDevice
        """
        return Idevice.getResources(self) + ["common.js"]

    # Properties
    content = property(lambda self: self._content, 
                       doc="Read only, use 'self.content.encodedContent = x' "
                           "instead")

    def upgradeToVersion1(self):
        """
        Upgrades exe to v0.10
        """
        self._upgradeIdeviceToVersion1()
        self.instructionsForLearners = TextAreaField(
            x_(u'Instructions For Learners'),
            x_(u'Put instructions for learners here'),
            x_(u'Read the paragraph below and '
                'fill in the missing words'))
        self.instructionsForLearners.idevice = self
        self.feedback = TextAreaField(x_(u'Feedback'))
        self.feedback.idevice = self
