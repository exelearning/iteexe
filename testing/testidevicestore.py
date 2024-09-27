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

from exe.engine.idevicestore import IdeviceStore
import unittest
import utils
import os


# ===========================================================================

class TestIdeviceStore(utils.SuperTestCase):

    def testLoad(self):
        """
        Tests that idevices can be loaded
        """
        self.assertTrue(isinstance(self.app.ideviceStore, IdeviceStore))
        self.assertTrue(os.path.exists("tmp/idevices/allgeneric.data"))
        self.assertTrue(os.path.exists("tmp/idevices/extended.data"))
        self.assertTrue(os.path.exists("tmp/idevices/showgeneric.data"))

    def testLangsWithoutDuplicateIdeviceTitles(self):
        langsWithDuplicateIdeviceTitles = {}
        for lang, locale in list(self.app.config.locales.items()):
            lang = str(lang)
            locale.install(str=True)
            titles = set()
            for idevice in self.app.ideviceStore.getIdevices():
                if idevice.title in titles:
                    if lang in langsWithDuplicateIdeviceTitles:
                        langsWithDuplicateIdeviceTitles[lang].append(idevice._title)
                    else:
                        langsWithDuplicateIdeviceTitles[lang] = [idevice._title]
                titles.add(idevice.title)
        if langsWithDuplicateIdeviceTitles:
            raise Exception(langsWithDuplicateIdeviceTitles)

if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(unittest.makeSuite(TestIdeviceStore))
    unittest.TextTestRunner(verbosity=2).run(suite)
