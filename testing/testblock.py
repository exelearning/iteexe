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

import unittest, sys
from exe.webui.block        import Block
from exe.engine.idevice     import Idevice
from exe.webui.blockfactory import g_blockFactory
from exe.webui.renderable   import Renderable
from exe.engine.node        import Node
from exe.engine.path        import Path
from utils                  import SuperTestCase, HTMLChecker
from nevow.context          import RequestContext

# ===========================================================================
class TestBlock(SuperTestCase):
    """
    Tests that blocks can render stuff
    """

    # Default Attribute Values
    ignoreErrorMsgs = [] # A list of regular expressions that match xmllint
                         # stderr output
    quickCheck = '--quick' in sys.argv

    def testAuthoringPage(self):
        """
        Generates a page of idevices and checks each ones xhtml individually
        """
        # TODO: Once we have pyxpcom, break this test out into
        # TestFreeTextBlock, TestImageWithTextBlock etc.
        # And actually do some interactive DOM testing...

        # Add some idevices to the main page
        def addIdevice(id_):
            request = self._request(action='AddIdevice', object=str(id_))
            ctx = RequestContext(request)
            return self.mainpage.authoringPage.render(request)
        for i in range(8,9):
            allHtml = addIdevice(i)
        checker = HTMLChecker(self.ignoreErrorMsgs)
        mainOk = checker.check(allHtml, False)
        if mainOk and self.quickCheck:
            return
        else:
            # Backup tmp.html
            Path('tmp.html').rename('tmpall.html')
            # Check all the idevices and blocks like each other
            ln = len(self.package.currentNode.idevices)
            assert ln >= 1, 'Should be at least one idevice, only %s' % ln
            idevice = self.package.currentNode.idevices[0]
            ln = len(self.mainpage.authoringPage.blocks)
            assert ln >= 1, 'Should be at least one block, only %s' % ln
            chunks = zip(self.mainpage.authoringPage.blocks,
                         self.package.currentNode.idevices)
            for i, (block, idevice) in enumerate(chunks):
                assert block.idevice is idevice
                viewHTML = block.renderView('default')
                previewHTML = block.renderPreview('default')
                editHTML = block.renderEdit('default')
                if not checker.check(viewHTML, True):
                    self.fail('Block "%s" generated bad view XHTML' % idevice.title)
                if not checker.check(previewHTML, True):
                    self.fail('Block "%s" generated bad preview XHTML' %
                              idevice.title)
                if not checker.check(editHTML, True):
                    self.fail('Block "%s" generated bad edit XHTML' % idevice.title)
            if not mainOk:
                # Even if all the blocks pass, still the main html is bad
                Path('tmpall.html').rename('tmp.html')
                self.fail('Authoring Page generated bad XHTML, but all the blocks '
                          'were good')


if __name__ == "__main__":
    if '--quick' in sys.argv:
        sys.argv.remove('--quick')
    unittest.main()
