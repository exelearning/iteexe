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
BlockFactory is responsible for creating the right block object to match
a given Idevice.
"""

import logging

log = logging.getLogger(__name__)

# ===========================================================================
class BlockFactory(object):
    """
    BlockFactory is responsible for creating the right block object to match
    a given Idevice.  Blocks register themselves with the factory, specifying
    which Idevices they can render
    """
    def __init__(self):
        """Initialize BlockFactory"""
        self.blockTypes = []


    def registerBlockType(self, blockType, ideviceType):
        """
        Block classes call this function when they are imported
        """
        log.debug(u"registerBlockType "+ 
                  blockType.__name__ + u"<=>" +  ideviceType.__name__)
        self.blockTypes.append((blockType, ideviceType))


    def createBlock(self, parent, idevice):
        """
        Returns a Block object which can render this Idevice
        """
        for blockType, ideviceType in self.blockTypes:
            if isinstance(idevice, ideviceType):
                log.info(u"createBlock "+blockType.__name__+u" for "+
                          idevice.__class__.__name__)
                return blockType(parent, idevice)
        
        log.error(u"No blocktype registered for "+ idevice.__class__.__name__)
        return None
        

g_blockFactory = BlockFactory()


# ===========================================================================
