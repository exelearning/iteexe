# ===========================================================================
# testblockfactory
# Copyright 2005, University of Auckland
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

import unittest
from exe.webui.block        import Block
from exe.engine.idevice     import Idevice
from exe.webui.blockfactory import g_blockFactory

# ===========================================================================
class DummyBlock(Block):
    def __init__(self, idevice):
        pass

class DummyIdevice(Idevice):
    def __init__(self):
        pass

g_blockFactory.registerBlockType(DummyBlock, DummyIdevice)

# ===========================================================================
class TestBlockFactory(unittest.TestCase):
    def setUp(self):
        pass

    def testBlockFactory(self):
        myidevice = DummyIdevice()
        myblock   = g_blockFactory.createBlock(myidevice)
        self.assertEquals(type(myblock), DummyBlock)
        

if __name__ == "__main__":
    unittest.main()
