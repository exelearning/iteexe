# ===========================================================================
# idevicestore unittest
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

from exe.engine.idevice      import Idevice
from exe.engine.idevicestore import IdeviceStore
from exe.engine.path         import Path
import unittest
import os
import utils


# ===========================================================================

class TestIdeviceStore(utils.SuperTestCase):

    def testLoad(self):
        """
        Tests that idevices can be loaded
        """
        store = IdeviceStore(self.app.config)
        store.load()
        self.assert_(os.path.exists("idevices/generic.data"))
        os.remove("idevices/generic.data")


if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(unittest.makeSuite(TestIdeviceStore))
    unittest.TextTestRunner(verbosity=2).run(suite)
