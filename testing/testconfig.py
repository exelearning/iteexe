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

from exe.engine.config import Config
import logging
from logging import DEBUG, INFO, WARNING, ERROR, CRITICAL
import unittest

# ===========================================================================
class TestConfig(unittest.TestCase):
    def setUp(self):
        pass

    def testSetupLogging(self):
        myconfig = Config("test.conf")
        open("test.log", "w").write("")
        myconfig.setupLogging("test.log")
        rootLog = logging.getLogger()
        fooLog  = logging.getLogger("foo")
        barLog  = logging.getLogger("bar")
        self.assertEqual(fooLog.level,  DEBUG)
        self.assertEqual(rootLog.level, ERROR)

        rootLog.debug("This")
        rootLog.warning("is free")
        rootLog.error("software")
        rootLog.critical("you can")
        fooLog.debug("distribute")
        fooLog.info("is free")
        fooLog.error("and/or modify")
        barLog.debug("Temple Place")
        barLog.warning("Boston")
        barLog.error("Massachusetts")

        results = ["root ERROR software", "root CRITICAL you can", 
                   "foo DEBUG distribute", "foo INFO is free", 
                   "foo ERROR and/or modify", "bar ERROR Massachusetts"]
        resultFile = open("test.log")
        i = 0
        for line in resultFile.readlines():
            self.assertEqual(line[24:].strip(), results[i])
            i += 1
                

if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(unittest.makeSuite(TestConfig))
    unittest.TextTestRunner(verbosity=2).run(suite)
