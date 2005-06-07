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
import unittest, sys
from exe.engine.configparser import ConfigParser
from exe.engine.path import Path
import utils

# ===========================================================================
class TestConfig(utils.SuperTestCase):

    def _setupConfigFile(self, configParser):
        """
        Setup our own config file
        """
        utils.SuperTestCase._setupConfigFile(self, configParser)
        # Create an empty dir to stick the config file
        tmp = Path('tmp')
        if not tmp.exists():
            tmp.mkdir()
        logfn = tmp/'exe.log'
        if logfn.exists():
            logfn.remove()
        configParser.system.configDir = tmp
        configParser.logging.root = 'ERROR'
        configParser.logging.foo = 'DEBUG'
        configParser.logging.foo = 'DEBUG'

    def testSetupLogging(self):
        """
        Tests that the correct logging directory is made
        """
        # See if we can read it
        Config._getConfigPathOption  = lambda s: ['test.conf']
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
        resultFile = open("tmp/exe.log")
        i = 0
        for line in resultFile.readlines():
            self.assertEqual(line[24:].strip(), results[i])
            i += 1
                
    def testUpgradeAppDir(self):
        """
        Tests that config files with
        'appDataDir' are upgraded to 'configDir'
        """
        # Write the old style config file
        configPath = Path(u'test.exe.conf')
        if configPath.exists():
            configPath.remove()
        oldParser = ConfigParser()
        system = oldParser.addSection('system')
        system.appDataDir = 'my old app data dir'
        oldParser.write(configPath)
        del system
        del oldParser
        # Make the config instance load it
        Config._getConfigPathOptions = lambda self: ['test.exe.conf']
        myconfig = Config()
        myconfig.loadSettings()
        # Check if it reads the old value into the new variable
        assert not hasattr(myconfig, 'appDataDir')
        self.assertEquals(myconfig.configPath, 'test.exe.conf')
        self.assertEquals(myconfig.configDir, 'my old app data dir')
        # Check if it has upgraded the file and added in some nice default values
        newParser = ConfigParser()
        newParser.read(configPath)
        self.assertEquals(newParser.system.configDir, 'my old app data dir')



if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(unittest.makeSuite(TestConfig))
    unittest.TextTestRunner(verbosity=2).run(suite)
