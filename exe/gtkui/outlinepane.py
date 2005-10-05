# ===========================================================================
# eXe 
# Copyright 2004-2005, University of Auckland
# $Id$
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
OutlinePane is responsible for creating the package outline tree
"""

import gtk
import gobject

import logging
log = logging.getLogger(__name__)


# ===========================================================================
class OutlinePane(gtk.Frame):
    """
    OutlinePane is responsible for creating the package outline tree
    """
    def __init__(self, mainWindow):
        """
        Initialize Pane
        """
        gtk.Frame.__init__(self)
        self.set_size_request(250, 250)
        self.mainWindow = mainWindow
        self.package = mainWindow.package

        # Create tree model
        self.model = gtk.TreeStore(gobject.TYPE_STRING, gobject.TYPE_STRING)
        self.__addNode(None, self.package.root)

        # Popup menu
        # TODO think about changing to gtk.UIManager
        menuItems = [
            # path                  key   callback      actn type
            (_("/_Add Node"),       None, self.addNode,    0, None ),
            (_("/_Delete Node"),    None, self.deleteNode, 0, None ),
            (_("/_Rename Node"),    None, self.renameNode, 0, None ),
        ]
        accelGrp = gtk.AccelGroup()
        self.itemFactory = gtk.ItemFactory(gtk.Menu, "<main>")
        self.itemFactory.create_items(tuple(menuItems))
        self.popup = self.itemFactory.get_widget("<main>")
        self.popup.show_all()

        # VBox and toolbar
        vBox = gtk.VBox()
        self.add(vBox)
        toolbar = gtk.Toolbar()
        vBox.pack_start(toolbar, expand=False)
        toolbar.append_item(_("Add Node"), None, None, None, self.addNode)
        toolbar.append_item(_("Delete"),   None, None, None, self.deleteNode)
        toolbar.append_item(_("Rename"),   None, None, None, self.renameNode)
        
        # ScrolledWindow
        scrollWin = gtk.ScrolledWindow()
        vBox.pack_start(scrollWin)
        scrollWin.set_policy(gtk.POLICY_AUTOMATIC, gtk.POLICY_AUTOMATIC)

        # Tree
        self.treeView = gtk.TreeView(self.model)
        scrollWin.add_with_viewport(self.treeView)
        self.treeView.connect('button_press_event', self.treeClicked)
        self.treeView.connect('row-activated',      self.renameNode)
        self.treeView.set_rules_hint(True)
        self.treeView.set_search_column(0)
        self.treeView.expand_row((0,), open_all=True)
        self.treeView.set_reorderable(True)
        dragTarget = [("exe.engine.node", gtk.TARGET_SAME_WIDGET, 0)]
        self.treeView.enable_model_drag_source(gtk.gdk.BUTTON1_MASK,
                                               dragTarget,
                                               gtk.gdk.ACTION_MOVE)
        self.treeView.connect("drag-data-get", self.dragDataGet)
        self.treeView.enable_model_drag_dest(dragTarget,
                                             gtk.gdk.ACTION_MOVE)
        self.treeView.connect("drag-data-received", self.dragDataReceived)

        # Add columns to the tree view
        column = gtk.TreeViewColumn('Outline', gtk.CellRendererText(), text=0)
        self.treeView.append_column(column)
        selection = self.treeView.get_selection()
        selection.select_path((0,))
        selection.connect('changed', self.rowSelected)
        

    def __addNode(self, parentIter, node):
        """
        Add all children recursively.
        """
        treeIter = self.model.append(parentIter, (node.title, node.id))

        # Recursively render children
        for child in node.children:
            self.__addNode(treeIter, child)


    def setPackage(self, package):
        """
        Set a new package to be displayed
        """
        self.package = package
        # create tree model
        self.model = gtk.TreeStore(gobject.TYPE_STRING, gobject.TYPE_STRING)
        self.__addNode(None, self.package.root)
        self.treeView.set_model(self.model)
        self.treeView.expand_row((0,), open_all=True)
        selection = self.treeView.get_selection()
        selection.select_path((0,))
    

    def treeClicked(self, treeView, event):
        """
        Handle Right Mouse clicks
        """
        if event.button == 3:
            x = int(event.x)
            y = int(event.y)
            time = event.time
            pathInfo = treeView.get_path_at_pos(x, y)
            if pathInfo != None:
                path, col, cellx, celly = pathInfo
                treeView.grab_focus()
                treeView.set_cursor(path, col, 0)
                self.popup.popup(None, None, None, event.button, time)
            return 1


    def rowSelected(self, selection): 
        """
        Handle single click events on idevice pane
        """
        model, treePaths = selection.get_selected_rows()
        if treePaths:
            treeIter = self.model.get_iter(treePaths[0])
            nodeId   = self.model.get_value(treeIter, 1)
            node     = self.package.findNode(nodeId)
            self.package.currentNode = node
            self.mainWindow.loadUrl()


    def addNode(self, *args):
        """
        Add a new node to the package
        """
        selection = self.treeView.get_selection()
        model, treePaths = selection.get_selected_rows()
        if treePaths:
            treeIter = self.model.get_iter(treePaths[0])
            nodeId   = self.model.get_value(treeIter, 1)
            parent   = self.package.findNode(nodeId)
            child    = parent.createChild()
            self.package.currentNode = child
            childIter = self.model.append(treeIter, (child.title, child.id))
            childPath = self.model.get_path(childIter)
            self.treeView.expand_to_path(childPath)
            selection.select_iter(childIter)
            self.mainWindow.loadUrl()
        

    def deleteNode(self, *args):
        """
        Delete a node from the package
        """
        selection = self.treeView.get_selection()
        model, treePaths = selection.get_selected_rows()
        if treePaths:
            treeIter = self.model.get_iter(treePaths[0])
            nodeId   = self.model.get_value(treeIter, 1)
            node     = self.package.findNode(nodeId)
            if node is not None and node is not self.package.root:
                self.package.currentNode = node.parent
                parentIter = self.model.iter_parent(treeIter)
                node.delete()
                self.model.remove(treeIter)
                parentPath = self.model.get_path(parentIter)
                self.treeView.expand_to_path(parentPath)
                selection.select_iter(parentIter)
                self.mainWindow.loadUrl()
            

    def renameNode(self, *args):
        """
        Rename a node 
        """
        selection = self.treeView.get_selection()
        model, treePaths = selection.get_selected_rows()
        if treePaths:
            treeIter = self.model.get_iter(treePaths[0])
            nodeId   = self.model.get_value(treeIter, 1)
            node     = self.package.findNode(nodeId)

            popup = gtk.Dialog(_(u"Rename Node"),
                               self.mainWindow,
                               gtk.DIALOG_MODAL,
                               (gtk.STOCK_CANCEL, gtk.RESPONSE_CANCEL,
                                gtk.STOCK_OK,     gtk.RESPONSE_OK))
            popup.set_default_response(gtk.RESPONSE_OK)
            nameEntry = gtk.Entry()
            nameEntry.set_text(node.title)
            nameEntry.set_activates_default(True)
            popup.vbox.pack_start(nameEntry)
            popup.show_all()
            response = popup.run()

            if response == gtk.RESPONSE_OK:
                node.title = nameEntry.get_text()
                self.model.set_value(treeIter, 0, node.title)
                self.mainWindow.loadUrl()

            popup.destroy()


    def dragDataGet(self, treeView, context, selection, info, timestamp):
        treeSelection = treeView.get_selection()
        model, treeIter = treeSelection.get_selected()
        value = model.get_value(treeIter, 1)
        selection.set("text/plain", 8, value)


    def dragDataReceived(self, treeView, context, x, y, 
                         selection, info, timestamp):
        """
        Handle drag n drop
        """
        droppedId = selection.data
        dropped   = self.package.findNode(droppedId)
        dropInfo  = treeView.get_dest_row_at_pos(x, y)
        model     = treeView.get_model()

        if dropped is self.package.root:
            context.finish(False, True, timestamp)
            return

        if dropInfo:
            treeIter      = self.model.get_iter(dropInfo[0])
            destinationId = self.model.get_value(treeIter, 1)
            destination   = self.package.findNode(destinationId)

            if (dropInfo[1] == gtk.TREE_VIEW_DROP_INTO_OR_BEFORE or
                dropInfo[1] == gtk.TREE_VIEW_DROP_INTO_OR_AFTER or
                destination is self.package.root):
                dropped.move(destination)
                newIter = model.append(treeIter, (dropped.title, dropped.id))
                newPath = model.get_path(newIter)
                treeView.expand_to_path(newPath)

            elif dropInfo[1] == gtk.TREE_VIEW_DROP_BEFORE:
                dropped.move(destination.parent, destination.previousSibling())
                model.insert_before(None, treeIter, (dropped.title, dropped.id))

            else:
                dropped.move(destination.parent, destination)
                model.insert_after(None, treeIter, (dropped.title, dropped.id))

        else:
            if self.package.root.children:
                firstChild = self.package.root.children[0]
            else:
                firstChild = None
            dropped.move(self.package.root, firstChild)
            model.prepend(model.get_iter((0,)), (dropped.title, dropped.id))

        if context.action == gtk.gdk.ACTION_MOVE:
            context.finish(True, True, timestamp)


# ===========================================================================
