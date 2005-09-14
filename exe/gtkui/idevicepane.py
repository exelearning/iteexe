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
IdevicePane is responsible for creating the XHTML for iDevice links
"""

import gtk
import gobject
import logging

log = logging.getLogger(__name__)

# ===========================================================================
class IdevicePane(gtk.Frame):
    """
    IdevicePane is responsible for creating the XHTML for iDevice links
    """
    def __init__(self, ideviceStore):
        """ 
        Initialize
        """ 
        gtk.Frame.__init__(self)
        self.set_size_request(250, 250)

        self.ideviceStore = ideviceStore
        self.prototypes   = {}
        self.ideviceStore.register(self)
        log.debug("Load appropriate iDevices")

        for prototype in self.ideviceStore.getIdevices():
            log.debug("add "+prototype.title)
            self.prototypes[prototype.id] = prototype

        # create tree model
        model = gtk.ListStore(gobject.TYPE_STRING,)
        model.set_sort_column_id(0, gtk.SORT_ASCENDING)
        for prototype in self.prototypes.values():
            model.append((prototype.title,))

        # ScrolledWindow
        scrollWin = gtk.ScrolledWindow()
        self.add(scrollWin)
        scrollWin.set_policy(gtk.POLICY_AUTOMATIC, gtk.POLICY_AUTOMATIC)

        # create tree view
        self.treeView = gtk.TreeView(model)
        scrollWin.add_with_viewport(self.treeView)
        self.treeView.set_rules_hint(True)
        self.treeView.set_search_column(0)
        self.treeView.connect('row-activated', self.rowActivated)

        # add columns to the tree view
        column = gtk.TreeViewColumn('iDevices', gtk.CellRendererText(), text=0)
        column.set_sort_column_id(0)
        self.treeView.append_column(column)


    def rowActivated(self, treeView, nodePath, column):
        print treeView, nodePath, column


        
# ===========================================================================
