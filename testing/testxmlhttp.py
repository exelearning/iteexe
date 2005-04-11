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
from exe.webui.outlinepane import OutlinePane
from exe.engine.package import Package

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
        self.client = FakeClient()
        self.package = Package('temp')
        self.outline = OutlinePane(self.package)

    def testAddAndDel(self):
        """Should be able to add a node to the package"""
        def checkAdd(id_, title):
            assert ('call', ('XHAddChildTreeItem', id_, title), {}) in self.client.calls, self.client.calls
            assert str(self.package.currentNode.title) == title, title
            assert self.package.currentNode.getIdStr() == id_, id_
        self.outline.handleAddChild(self.client, '1')
        checkAdd('1.0', 'Topic')
        self.outline.handleAddChild(self.client, '1.0')
        checkAdd('1.0.0', 'Section')
        self.outline.handleAddChild(self.client, '1.0.0')
        checkAdd('1.0.0.0', 'Unit')
        self.outline.handleAddChild(self.client, '1.0.0.0')
        checkAdd('1.0.0.0.0', '?????')
        self.outline.handleAddChild(self.client, '1')
        checkAdd('1.1', 'Topic')
        self.outline.handleAddChild(self.client, '1')
        checkAdd('1.2', 'Topic')
        self.outline.handleAddChild(self.client, '1.0')
        checkAdd('1.0.1', 'Section')
        self.outline.handleAddChild(self.client, '1.0')
        checkAdd('1.0.2', 'Section')
        self.outline.handleAddChild(self.client, '1.1')
        checkAdd('1.1.0', 'Section')
        self.outline.handleAddChild(self.client, '1.1')
        checkAdd('1.1.1', 'Section')
        # Now do some deletion
        self.client.calls = []
        # Do nothing because confirm is false
        self.outline.handleDelNode(self.client, 'false', '1.0')
        assert not self.client.calls
        # Do nothing because its the draft node
        self.outline.handleDelNode(self.client, 'true', '0')
        assert not self.client.calls
        # Do nothing because its the title node
        self.outline.handleDelNode(self.client, 'true', '1')
        assert not self.client.calls
        # Now delete the selected node, should select its parent
        oldNode = self.package.currentNode
        self.outline.handleDelNode(self.client, 'true', '1.1.1')
        assert ('call', ('XHDelNode', '1.1.1'), {}) in self.client.calls, self.client.calls
        assert self.package.currentNode.getIdStr() == '1.1'
        assert self.package.findNode('1.1.1') is None
        # Now wipe out a whole tree!
        assert self.package.findNode('1.0')
        assert self.package.findNode('1.0.0')
        assert self.package.findNode('1.0.1')
        assert self.package.findNode('1.0.0.0')
        assert self.package.findNode('1.0.0.0.0')
        oldNode = self.package.currentNode
        self.outline.handleDelNode(self.client, 'true', '1.0')
        assert ('call', ('XHDelNode', '1.0'), {}) in self.client.calls, self.client.calls
        # The below line actually works because 1.1 has taken 1.0's place
        ##assert self.package.findNode('1.0') is None, self.package.findNode('1.0').getIdStr()
        ##assert self.package.findNode('1.0.0') is None
        # The old 1.1 never had any of these children...
        assert self.package.findNode('1.0.1') is None
        assert self.package.findNode('1.0.0.0') is None
        assert self.package.findNode('1.0.0.0.0') is None
        assert self.package.currentNode == oldNode, "Current node shouldn't have changed"

    def testRenNode(self):
        """Should be able to rename nodes"""
        self.outline.handleRenNode(self.client, '0', 'Scratch Pad')
        assert str(self.package.findNode('0').title) == 'Scratch Pad'
        assert ('call', ('XHRenNode', 'Scratch Pad'), {}) in self.client.calls, self.client.calls
        self.outline.handleRenNode(self.client, '1', 'Genesis')
        assert str(self.package.findNode('1').title) == 'Genesis'
        assert ('call', ('XHRenNode', 'Genesis'), {}) in self.client.calls, self.client.calls



    def testAddChildDraft(self):
        # Shuoldn't do anything for Draft object
        oldNode = self.package.currentNode
        self.outline.handleAddChild(self.client, '0')
        assert not self.client.calls
        assert oldNode is self.package.currentNode


if __name__ == "__main__":
    unittest.main()
