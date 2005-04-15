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

import unittest
from exe.engine.config import Config
from exe.engine.node import Node
from exe.engine.packagestore import g_packageStore
from exe.webui.webinterface  import g_webInterface

# ===========================================================================
class TestNode(unittest.TestCase):
    def setUp(self):
        g_webInterface.config = Config("exe.conf")
        package = g_packageStore.createPackage()
        n2 = package.root       # 02
        n3 = n2.createChild()   #  |_03                               
        n4 = n3.createChild()   #  |  |_04                            
        n5 = n4.createChild()   #  |  |  |_05                         
        n6 = n5.createChild()   #  |  |  |  |_06                      
        n7 = n4.createChild()   #  |  |  |_07                         
        n8 = n4.createChild()   #  |  |  |_08
        n9 = n3.createChild()   #  |  |_09                            
        n10 = n3.createChild()  #  |  |_10                            
        n11 = n2.createChild()  #  |_11
        n12 = n2.createChild()  #  |_12
        globals().update(locals()) # Make all local vars global for easy access

    def testCreate(self):
        self.assertEqual(n3.id, '3')
        self.assert_(n3.parent is n2)
        self.assert_(n2.children[0] is n3)
        self.assert_(package.findNode('3') is n3)

    def testMove(self):
        # Test Moving nodes up down left and right etc.
        n6.move(n2,n3)
        assert n6.parent is n2
        assert n2.children[0] is n6
        assert n2.children[1] is n3
        assert str(n6.title) == 'Topic', str(n6.title)
        # Send it down a layer at the end
        n6.move(n3, None) # At the end of the list
        assert n6.parent is n3
        assert str(n6.title) == 'Section'
        assert n6 not in n2.children
        assert n3.children[-1] is n6
        assert n3.children[-2] is n10
        # Send it deeper in the middle of the list
        n6.move(n4, n8)
        assert n6.parent is n4
        assert n4.children[0] is n5, [n.id for n in n4.children]
        assert n4.children[1] is n7, [n.id for n in n4.children]
        assert n4.children[2] is n6, [n.id for n in n4.children]
        assert n4.children[3] is n8, [n.id for n in n4.children]
        assert str(n6.title) == 'Unit'
        # Just move it up one (vertically, not in the tree)
        n6.move(n4, n7)
        assert n4.children == [n5,n6,n7,n8]
        # Put it back where it was
        n6.move(n5, None)
        assert n6.parent is n5
        assert n6 not in n4.children
        assert n5.children == [n6]
        assert str(n6.title) == '?????'

    def testTitle(self):
        """Tests that we can set the title. 
        Auto title changes are tested in 
        testMove
        """
        # Change its title
        oldTitleIDevice = n6._title
        n6.title = 'n6'
        assert str(n6.title) == 'n6'
        n6.move(n3, None)
        assert str(n6.title) == 'n6'
        n6.move(n5, None)
        assert n6._title is oldTitleIDevice
        # Go back to auto title mode
        n6.title = ''
        assert n6.title == '?????'
        n6.move(n3, None)
        assert n6.title == 'Section', n6.title

    def testDelete(self):
        """
        Deletes nodes from the tree
        """
        assert package.findNode('6') is n6
        n6.delete()
        assert package.findNode('6') is None, package.findNode('6')
        assert n5.children == []
        # Delete a branch
        n4.delete()
        for n in '5678':
            assert package.findNode(n) is None, n
        assert n4.children == [] # Not necessary as long as 4 is cut of
        assert n3.children == [n9,n10]

        
if __name__ == "__main__":
    unittest.main()
