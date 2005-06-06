# ===========================================================================
# testblock
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
from exe.webui.renderable   import Renderable
from exe.engine.node        import Node
from exe.application        import Application
from utils                  import SuperTestCase, HTMLTidy

# ===========================================================================
class TestBlock(SuperTestCase):
    """
    Tests that blocks can render stuff
    """

    def testBlock(self):
        """Creates a block for a freetext idevice
        and makes it render"""
        # Pretend to add an idevice
        request = self._request(action='AddIdevice', object='1')
        self.mainpage.authoringPage.render(request)
        ln = len(self.package.currentNode.idevices)
        assert ln >= 1, 'Should be at least one idevice, only %s' % ln
        idevice = self.package.currentNode.idevices[0]
        ln = len(self.mainpage.authoringPage.blocks)
        assert ln >= 1, 'Should be at least one block, only %s' % ln
        block = self.mainpage.authoringPage.blocks[0]
        assert block.idevice is idevice
        print dir(self)
        html = block.renderEditButtons()
        tidier = HTMLTidy(html)
        tidier.check()

        

if __name__ == "__main__":
    unittest.main()
