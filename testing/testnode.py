# ===========================================================================
# node unittest
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
from exe.engine.node import Node
from exe.engine.packagestore import PackageStore

# ===========================================================================
class TestNode(unittest.TestCase):
    def setUp(self):
        packageStore = PackageStore()
        package      = packageStore.createPackage()
        n0 = package.root       # 00
        n1 = n0.createChild()   #  |_01                               
        n2 = n1.createChild()   #  |  |_02                            
        n3 = n2.createChild()   #  |  |  |_03                         
        n4 = n3.createChild()   #  |  |  |  |_04                      
        n5 = n2.createChild()   #  |  |  |_05                         
        n6 = n2.createChild()   #  |  |  |_06
        n7 = n1.createChild()   #  |  |_07                            
        n8 = n1.createChild()   #  |  |_08                            
        n9 = n0.createChild()   #  |_09
        n10 = n0.createChild()  #  |_10
        globals().update(locals()) # Make all local vars global for easy access

    def testCreate(self):
        self.assertEqual(n1.id, '1')
        self.assert_(n1.parent is n0)
        self.assert_(n0.children[0] is n1)
        self.assert_(package.findNode('1') is n1)

    def testMove(self):
        # Test Moving nodes up down left and right etc.
        n4.move(n0,n1)
        assert n4.parent is n0
        assert n0.children[0] is n4
        assert n0.children[1] is n1
        assert unicode(n4.title) == 'Topic', unicode(n4.title)
        # Send it down a layer at the end
        n4.move(n1, None) # At the end of the list
        assert n4.parent is n1
        assert unicode(n4.title) == 'Section'
        assert n4 not in n0.children
        assert n1.children[-1] is n4
        assert n1.children[-2] is n8
        # Send it deeper in the middle of the list
        n4.move(n2, n6)
        assert n4.parent is n2
        assert n2.children[0] is n3, [n.id for n in n2.children]
        assert n2.children[1] is n5, [n.id for n in n2.children]
        assert n2.children[2] is n4, [n.id for n in n2.children]
        assert n2.children[3] is n6, [n.id for n in n2.children]
        assert unicode(n4.title) == 'Unit'
        # Just move it up one (vertically, not in the tree)
        n4.move(n2, n5)
        assert n2.children == [n3,n4,n5,n6]
        # Put it back where it was
        n4.move(n3, None)
        assert n4.parent is n3
        assert n4 not in n2.children
        assert n3.children == [n4]
        assert unicode(n4.title) == '?????'

    def testTitle(self):
        """Tests that we can set the title. 
        Auto title changes are tested in 
        testMove
        """
        # Change its title
        n4.title = 'n4'
        assert unicode(n4.title) == 'n4'
        assert unicode(n4.description) == 'n4'
        n4.move(n1, None)
        assert unicode(n4.title) == 'n4'
        assert unicode(n4.description) == 'n4'
        n4.move(n3, None)

        # Change its description
        n4.description = 'my description'
        assert unicode(n4.title) == 'n4'
        assert unicode(n4.description) == 'my description'

        # Go back to auto title mode
        n4.title = ''
        assert n4.title == '?????'
        n4.move(n1, None)
        assert n4.title == 'Section', n4.title

    def testDelete(self):
        """
        Deletes nodes from the tree
        """
        assert package.findNode('4') is n4
        n4.delete()
        assert package.findNode('4') is None, package.findNode('4')
        assert n3.children == []
        # Delete a branch
        n2.delete()
        for n in '3456':
            assert package.findNode(n) is None, n
        assert n2.children == [] # Not necessary as long as 4 is cut of
        assert n1.children == [n7,n8]

        
if __name__ == "__main__":
    unittest.main()
