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
MathIdevice: just has a block of text
"""

import logging
from exe.engine.idevice import Idevice
from exe.engine.field   import MathField
log = logging.getLogger(__name__)


# ===========================================================================
class MathIdevice(Idevice):
    """
    MathIdevice: just has a block of text
    """
    

    def __init__(self, instruc="", latex=""):
        Idevice.__init__(self, x_(u"Maths"), 
                         x_(u"University of Auckland"), 
                         x_("""The mathematical language LATEX has been 
                        used to enable you to create mathematical formula 
                        within you content. It does this by translating the 
                        LATEX into a graphical image which is then displayed
                         within your eXe content. We would recommend that 
                        you use the Free Text iDevice to provide 
                        explanatory notes and learning instruction around 
                        this graphic."""),
                        "", 
                        "")
        self.emphasis = Idevice.NoEmphasis
        self.content  = MathField(x_(u"Maths"), 
                                      x_(u"""You can use the toolbar or enter latex manually into the textarea. """))
        self.content.idevice = self





# ===========================================================================
