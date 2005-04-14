# ===========================================================================
# config unittest
# Copyright 2004, University of Auckland
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
from exe.engine.config import Config
from exe.engine.node import Node
from exe.engine.packagestore import g_packageStore
from exe.webui.webinterface  import g_webInterface

# ===========================================================================
class TestNode(unittest.TestCase):
    def setUp(self):
        g_webInterface.config = Config("exe.conf")
        self.package = g_packageStore.createPackage()

    def testCreate(self):
        root = self.package.root
        child0 = root.createChild()
        self.assertEqual(child0.id, '3')
        self.assert_(child0.parent is root)
        self.assert_(child0 in root.children)
        self.assert_(self.package.findNode('3') is child0)

        
if __name__ == "__main__":
    unittest.main()
