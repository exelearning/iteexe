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

import sys
import os.path
import unittest
from exe.engine.uniqueidgenerator import UniqueIdGenerator

# ===========================================================================
class TestUniqueId(unittest.TestCase):
    def setUp(self):
        self.generator = UniqueIdGenerator("David's Gen", sys.argv[0])

    def testGenerate(self):
        howMany = 10000
        values  = {}
        for x in range(howMany):
            id = self.generator.generate()
            self.assertTrue(id.isalnum())
            values[id] = 1
        self.assertEqual(howMany, len(values))
        

if __name__ == "__main__":
    unittest.main()
