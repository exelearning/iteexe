# ===========================================================================
# eXe 
# Copyright 2004-2005, University of Auckland
# $Id: idevicepane.py 1162 2005-08-18 05:40:48Z matthew $
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
"""
Provides a TreeModel interface to the IdeviceStore
"""

import gtk
import gobject
import logging

log = logging.getLogger(__name__)

# ===========================================================================
#TODO!!! Make this work!!!
class IdevicesModel(gtk.GenericTreeModel):
    """
    Provides a TreeModel interface to the IdeviceStore
    """
    def __init__(self, ideviceStore):
        """ 
        Initialize
        """ 
        gtk.GenericTreeModel.__init__(self)
        self.ideviceStore = ideviceStore

        # We own the references to the iterators.
        # or at least I hope we do
        self.set_property ('leak_references', 0)

        self.columnTypes = (gobject.TYPE_STRING,)
        
    # The GenericTreeModel interface consists of the following methods that
    # must be implemented in your custom tree model:
    def on_get_flags(self):
        """
        The model is a list only, and never has children
        """
        return gtk.TREE_MODEL_LIST_ONLY
    

    def on_get_n_columns(self):
        """
        The number of columns supported by the treemodel.
        """
        return len(self.columnTypes)
    

    def on_get_column_type(self, column):
        """
        Returns the type of the column.
        """
        return self.columnTypes[column]


    def on_get_path(self, treeIter):
        """
        Returns the tree path referenced by iter.
        """
        print treeIter
        return treeIter.treeIterPath
    

    def on_get_iter(self, treePath):
        """
        Returns a new gtk.TreeIter pointing to path. 
        This method raises a ValueError exception if path is not a valid tree
        path.  
        """
        print treePath
        return iter(self.ideviceStore.getIdevices())


    def on_get_value(self, treeIter, column):
        """
        Returns the value at column at the path pointed to by iter.
        """
        if column == 0:
            return treeIter.title
        else:
            raise AssertionError("no column %i" % column)


    def on_iter_next(self, treeIter):
        """
        Returns a gtk.TreeIter pointing at the row at the current level after
        the row referenced by iter. 
        If there is no next row, None is returned.  iter is unchanged.  
        """
        try:
            return treeIter.next()
        except StopIteration:
            return None
    

    def on_iter_children(self, treeIter):
        """
        This is a list, so there are no children
        """
        return None

        
    def on_iter_n_children(self, treeIter):
        """
        This is a list, so there are no children
        """
        return 0
    

    def on_iter_has_child(self, treeIter):
        """
        This is a list, so there are no children
        """
        return False

    def on_iter_nth_child(self, treeIter, n):
        """
        This is a list, so there are no children
        """
        return None
    

    def on_iter_parent(self, treeIter):
        """
        This is a list, so there are no children
        """
        return None



