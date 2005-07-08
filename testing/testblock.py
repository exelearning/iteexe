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
from utils                  import SuperTestCase, HTMLChecker
from nevow.context          import RequestContext

# ===========================================================================
class TestBlock(SuperTestCase):
    """
    Tests that blocks can render stuff
    """

    # TODO: In trunk, we shouldn't ignore any error messages
    ignoreErrorMsgs = [
        'No declaration for attribute border of element img',
        'Element img does not carry attribute alt',
        'Element body content does not follow the DTD, expecting (p | h1 | h2 '
         '| h3 | h4 | h5 | h6 | div | ul | ol | dl | pre | hr | blockquote | '
         'address | fieldset | table | form | noscript | ins | del | script)*, '
         'got (a a img img select a div )',
        'No declaration for attribute align of element img',
        'Element script does not carry attribute type',
        'No declaration for attribute language of element script',
        'Element form content does not follow the DTD, expecting (p | h1 | h2 '
         '| h3 | h4 | h5 | h6 | div | ul | ol | dl | pre | hr | blockquote | '
         'address | fieldset | table | noscript | ins | del | script)*, got '
         '(input input input div ).',
        'No declaration for attribute name of element form',
        'No declaration for attribute onload of element form',
        'Element table content does not follow the DTD, expecting (caption? , '
         '(col* | colgroup*) , thead? , tfoot? , (tbody+ | tr+)), got '
         '(th th th tr )',
        'Element form content does not follow the DTD, expecting (p | h1 | h2 '
         '| h3 | h4 | h5 | h6 | div | ul | ol | dl | pre | hr | blockquote | '
         'address | fieldset | table | noscript | ins | del | script)*, got '
         '(input input input div )',
        ]

    def testAuthoringPage(self):
        """Creates a block for a freetext idevice
        and makes it render"""
        # Pretend to add an idevice
        request = self._request(action='AddIdevice', object='1')
        ctx = RequestContext(request)
        html = self.mainpage.authoringPage.render(request)
        tidier = HTMLChecker(html, True, self.ignoreErrorMsgs)
        if not tidier.check():
            self.fail('Authoring Page generated bad XHTML')
        ln = len(self.package.currentNode.idevices)
        assert ln >= 1, 'Should be at least one idevice, only %s' % ln
        idevice = self.package.currentNode.idevices[0]
        ln = len(self.mainpage.authoringPage.blocks)
        assert ln >= 1, 'Should be at least one block, only %s' % ln
        block = self.mainpage.authoringPage.blocks[0]
        assert block.idevice is idevice
        html = block.renderEditButtons()
        tidier = HTMLChecker(html, False, self.ignoreErrorMsgs)
        if not tidier.check():
            self.fail('Authoring Page generated bad XHTML')

        

if __name__ == "__main__":
    unittest.main()
