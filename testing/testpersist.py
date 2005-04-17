# ===========================================================================
# persist unittest
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

from exe.engine import persist 
import unittest

# ===========================================================================
class Foo:
    def __init__(self):
        self.number  = 99
        self.places  = ["Sandringham", "Roskill", "Onehunga"]
        self.ohYeah  = True

    def __eq__(self, other):
        return (self.number == other.number and 
                self.places == other.places and
                self.ohYeah == other.ohYeah)


class TestPersist(unittest.TestCase):
    def setUp(self):
        pass

    def testPersist(self):
        toEncode = Foo()
        encoded  = persist.encodeObject(toEncode)
        decoded  = persist.decodeObject(encoded)
        self.assertEqual(toEncode, decoded)
                

if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(unittest.makeSuite(TestPersist))
    unittest.TextTestRunner(verbosity=2).run(suite)
