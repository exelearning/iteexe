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
from exe.engine.field   import ClozeField
from exe.engine.persist import Persistable
import Image
import gettext
_ = gettext.gettext
log = logging.getLogger(__name__)

# ===========================================================================
class ClozeIdevice(Idevice):
    """
    Holds a paragraph with words missing that the student must fill in
    """

    def __init__(self, parentNode=None):
        """
        Sets up the idevice title and instructions etc
        """
        Idevice.__init__(self, _(u"Cloze Idevice"),
                         _(u"University of Auckland"), 
                         _(u"This Idevice is used to help students learn "
                           u"passages of text and to develop an understanding "
                           u"of the way words are used in a certain subject or "
                           u"language"),
                         _(u"Take a passage of text and put some gaps in it by "
                           u"putting underscores (_) on either side of the "
                           u"word. For example: <i>The third _word_ in this text "
                           u"not be shown to students</i>.<br/>"
                           u"When checking the student's entry, case is ignored"),
                            "",
                            parentNode)
        self._content = ClozeField(_(u'Cloze'), 
            _(u'<p>Enter a passage of text, to make a gap that the user must '
               'fill put underscores (_) on either side of the word. For '
               'example:</p>'
               'The fith and last _words_ of this text need to be filled in '
               'by the _student_'))


    # Properties
    content = property(lambda self: self._content, 
                       doc="Read only, use 'self.content.rawContent = x' "
                           "instead")
