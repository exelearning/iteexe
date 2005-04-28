# ===========================================================================
# testcmlhttp
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
from exe.webui.outlinepane         import OutlinePane
from exe.engine.package            import Package
from exe.webui.webserver           import WebServer
from exe.webui.packageredirectpage import PackageRedirectPage
from exe.application               import Application

class FakeClient(object):
    """Pretends to be a webnow client object"""

    def __init__(self):
        self.calls = [] # All methods called on this object

    def logCall(self, _name_, *args, **kwargs):
        self.calls.append((_name_, args, kwargs))

    def __getattr__(self, name):
        """Always returns a callable"""
        return lambda *args, **kwargs: self.logCall(name, *args, **kwargs)


class TestOutline(unittest.TestCase):

    def setUp(self):
        class MyConfig:
            def __init__(self):
                self.port       = 8081
                self.dataDir    = "."
                self.webDir     = "."
                self.exeDir     = "."
                self.appDataDir = "."
                self.styles     = ["default"]
        app = Application()
        app.config = MyConfig()
        app.preLaunch()
        self.client = FakeClient()
        self.package = Package('temp')
        app.server.root.bindNewPackage(self.package)
        self.outline = app.server.root.children['temp'].outlinePane
        #self.outline = OutlinePane(None, None, None, server)

    def testAddAndDel(self):
        """Should be able to add a node to the package"""
        def checkAdd(id_, title):
            assert ('call', ('XHAddChildTreeItem', id_, title), {}) in self.client.calls, self.client.calls
            assert str(self.package.currentNode.title) == title, title
            assert self.package.currentNode.id == id_, id_
        self.outline.handleAddChild(self.client, '2') # Home/root node
        checkAdd('3', 'Topic')    # 1.0
        self.outline.handleAddChild(self.client, '3')
        checkAdd('4', 'Section')  # 1.0.0
        self.outline.handleAddChild(self.client, '4')
        checkAdd('5', 'Unit')     # 1.0.0.0
        self.outline.handleAddChild(self.client, '5')
        checkAdd('6', '?????')    # 1.0.0.0.0
        self.outline.handleAddChild(self.client, '2')
        checkAdd('7', 'Topic')    # 1.1
        self.outline.handleAddChild(self.client, '2')
        checkAdd('8', 'Topic')    # 1.2
        self.outline.handleAddChild(self.client, '3')
        checkAdd('9', 'Section')  # 1.0.1
        self.outline.handleAddChild(self.client, '3')
        checkAdd('10', 'Section') # 1.0.2
        self.outline.handleAddChild(self.client, '4')
        checkAdd('11', 'Unit') # 1.0.0.1
        self.outline.handleAddChild(self.client, '4')
        checkAdd('12', 'Unit') # 1.0.0.2
        # Check that we are parent and children attributes are bieng created properly
        n12 = self.package.findNode('12')
        n4 = self.package.findNode('4')
        assert n12.parent is n4, n12.parent
        assert n12 in n4.children
        assert n4.parent.id == '3'
        assert n4.parent.parent.id == '2'
        assert n4.parent.parent.parent is None
        # Tree now looks like this
        # 00
        # 01
        # 02
        #  |_03
        #  |  |_04
        #  |  |  |_05
        #  |  |  |  |_06
        #  |  |  |_11
        #  |  |  |_12
        #  |  |_09
        #  |  |_10
        #  |_07
        #  |_08
        # Now do some deletion
        self.client.calls = []
        # Do nothing because confirm is false
        self.outline.handleDelNode(self.client, 'false', '4') # Del 
        assert not self.client.calls
        assert self.package.findNode('4')
        # Do nothing because its the draft node
        self.outline.handleDelNode(self.client, 'true', '0')
        assert not self.client.calls
        assert self.package.findNode('0')
        # Do nothing because its the editor node
        self.outline.handleDelNode(self.client, 'true', '1')
        assert not self.client.calls
        assert self.package.findNode('1')
        # Do nothing because its the home node
        self.outline.handleDelNode(self.client, 'true', '2')
        assert not self.client.calls
        assert self.package.findNode('2')
        # Now delete the selected node, should select its parent
        oldNode = self.package.currentNode
        self.package.currentNode = self.package.findNode('5')
        self.outline.handleDelNode(self.client, 'true', '5')
        assert ('call', ('XHDelNode', '5'), {}) in self.client.calls, self.client.calls
        assert self.package.currentNode.id == '4', self.package.currentNode.id
        assert self.package.findNode('5') is None
        assert self.package.findNode('6') is None
        # Now wipe out a whole tree!
        assert self.package.findNode('3')
        assert self.package.findNode('4')
        assert self.package.findNode('11')
        assert self.package.findNode('12')
        assert self.package.findNode('9')
        assert self.package.findNode('10')
        oldNode = self.package.currentNode
        self.outline.handleDelNode(self.client, 'true', '3')
        assert ('call', ('XHDelNode', '3'), {}) in self.client.calls, self.client.calls
        # Check that all its children are gone
        assert self.package.findNode('3') is None
        assert self.package.findNode('4') is None
        assert self.package.findNode('11') is None
        assert self.package.findNode('12') is None
        assert self.package.findNode('9') is None
        assert self.package.findNode('10') is None
        assert self.package.currentNode == oldNode, "Current node shouldn't have changed"

    def testRenNode(self):
        """Should be able to rename nodes"""
        self.outline.handleRenNode(self.client, '0', 'Scratch Pad')
        assert str(self.package.findNode('0').title) == 'Scratch Pad'
        assert ('sendScript', ('XHRenNode("Scratch Pad")',), {}) in self.client.calls, self.client.calls
        self.outline.handleRenNode(self.client, '1', 'Genesis')
        assert str(self.package.findNode('1').title) == 'Genesis'
        assert ('sendScript', ('XHRenNode("Genesis")',), {}) in self.client.calls, self.client.calls

    def testAddChildDraft(self):
        # Shuoldn't do anything for Draft object
        oldNode = self.package.currentNode
        self.outline.handleAddChild(self.client, '0')
        assert not self.client.calls
        assert oldNode is self.package.currentNode


if __name__ == "__main__":
    unittest.main()
