#!/usr/bin/python
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
sys.path.insert(0, '..')
import unittest
from testconfig        import TestConfig
#from testconfigparser  import TestConfigParser, TestSections
#from testnode          import TestNode
#from testuniqueid      import TestUniqueId
##from testxmlhttp       import TestOutline
#from testpackage       import TestPackage
#from testblock         import TestBlock
#from testidevice       import TestIdevice
#from testidevicestore  import TestIdeviceStore
#from testpersist       import TestPersist
from testexport        import TestWebsiteExport 
##from testexport        import TestScormMetaExport
##from testexport        import TestScormNoMetaExport
#from testresource      import TestResource
#from testforumscache   import TestForumsCache
from testresources  import TestResources
from testblockfactory import TestBlockFactory

# ===========================================================================

if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(unittest.makeSuite(TestConfig))
#    suite.addTest(unittest.makeSuite(TestConfigParser))
#    suite.addTest(unittest.makeSuite(TestSections))
#    suite.addTest(unittest.makeSuite(TestNode))
#    suite.addTest(unittest.makeSuite(TestUniqueId))
##    suite.addTest(unittest.makeSuite(TestOutline))
#    suite.addTest(unittest.makeSuite(TestPackage))
#    suite.addTest(unittest.makeSuite(TestBlock))
    suite.addTest(TestBlockFactory())
    
#    suite.addTest(unittest.makeSuite(TestIdevice))
#    suite.addTest(unittest.makeSuite(TestIdeviceStore))
#    suite.addTest(unittest.makeSuite(TestPersist))
    suite.addTest(unittest.makeSuite(TestWebsiteExport))
##    suite.addTest(unittest.makeSuite(TestScormMetaExport))
##    suite.addTest(unittest.makeSuite(TestScormNoMetaExport))
#    suite.addTest(unittest.makeSuite(TestResource))
#    #suite.addTest(unittest.makeSuite(TestForumsCache))
    suite.addTest(unittest.makeSuite(TestResources))
    unittest.TextTestRunner(verbosity=2).run(suite)
