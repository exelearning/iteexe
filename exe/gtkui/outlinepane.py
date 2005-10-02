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
        gtk.Frame.__init__(self)
        self.set_size_request(250, 250)
        self.mainWindow = mainWindow
        self.package = mainWindow.package

        # create tree model
        self.model = gtk.TreeStore(gobject.TYPE_STRING, gobject.TYPE_STRING)
        self.__addNode(None, self.package.root)

        # Popup menu
        # TODO think about changing to gtk.UIManager
        menuItems = [
            # path                  key   callback      actn type
            (_("/_Add Node"),        None, self.addNode, 0, None ),
            (_("/_Delete Node"),     None, self.deleteNode, 0, None ),
            (_("/_Secret Metadata"), None, self.what, 0, None ),
        ]
        accelGrp = gtk.AccelGroup()
        self.itemFactory = gtk.ItemFactory(gtk.Menu, "<main>")
        self.itemFactory.create_items(tuple(menuItems))
#        self.add_accel_group(accelGrp)
        self.popup = self.itemFactory.get_widget("<main>")
#        self.popup = gtk.Menu()
#        self.popup.append(gtk.MenuItem("Add Node"))
#        self.popup.append(gtk.MenuItem("Delete Node"))
#        self.popup.append(gtk.MenuItem("Secret Metadata"))
        self.popup.show_all()

        # VBox and toolbar
        vBox = gtk.VBox()
        self.add(vBox)
        toolbar = gtk.Toolbar()
        vBox.pack_start(toolbar, expand=False)
        self.addNodeBtn = toolbar.append_item(_("Add Node"), None, None, None,
                                              self.addNode)
        self.deleteNodeBtn = toolbar.append_item(_("Delete Node"), None, None, 
                                                 None, self.deleteNode)
        
        # ScrolledWindow
        scrollWin = gtk.ScrolledWindow()
        vBox.pack_start(scrollWin)
        scrollWin.set_policy(gtk.POLICY_AUTOMATIC, gtk.POLICY_AUTOMATIC)

        # Tree
        self.treeView = gtk.TreeView(self.model)
        scrollWin.add_with_viewport(self.treeView)
#        self.treeView.connect('row-activated', self.rowActivated)
        self.treeView.connect('button_press_event', self.treeClicked)
        self.treeView.set_rules_hint(True)
        self.treeView.set_search_column(0)
        self.treeView.expand_row((0,), open_all=True)

        # add columns to the tree view
        column = gtk.TreeViewColumn('Outline', gtk.CellRendererText(), text=0)
        self.treeView.append_column(column)
        selection = self.treeView.get_selection()
        selection.select_path((0,))
        selection.connect('changed', self.rowSelected)


    def __addNode(self, parentIter, node):
        """
        Renders all children recursively.
        """
        treeIter = self.model.append(parentIter, (node.title, node.id))

        # Recursively render children
        for child in node.children:
            self.__addNode(treeIter, child)
    

    def setPackage(self, package):
        self.package = package
        # create tree model
        self.model = gtk.TreeStore(gobject.TYPE_STRING, gobject.TYPE_STRING)
        self.__addNode(None, self.package.root)
        self.treeView.set_model(self.model)
        self.treeView.expand_row((0,), open_all=True)
        selection = self.treeView.get_selection()
        selection.select_path((0,))

    
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


    def rowActivated(self, treeView, nodePath, column):
        print treeView, nodePath, column


    def addNode(self, *args):
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
            

    def what(self, *args):
        from pprint import pprint; pprint(args)


    def treeClicked(self, treeView, event):
        if event.button == 3:
            x = int(event.x)
            y = int(event.y)
            time = event.time
            pthinfo = treeView.get_path_at_pos(x, y)
            if pthinfo != None:
                path, col, cellx, celly = pthinfo
                treeView.grab_focus()
                treeView.set_cursor(path, col, 0)
                self.popup.popup(None, None, None, event.button, time)
            return 1

    def process(self, request):
        """ 
        Get current package
        """
        log.debug("process")
        
        if "action" in request.args:
            nodeId = request.args["object"][0]
            package = self.package

            if request.args["action"][0] == "changeNode":
                node = package.findNode(nodeId)
                if node is not None:
                    package.currentNode = node
                else:
                    log.error("changeNode cannot locate "+nodeId)

            elif request.args["action"][0] == "addChildNode":
                node = package.findNode(nodeId)
                if node is not None:
                    package.currentNode = node.createChild()
                else:
                    log.error("addChildNode cannot locate "+nodeId)

            elif (nodeId != package.root.id and 
                  request.args["action"][0] == "deleteNode"):
                node = package.findNode(nodeId)
                if node is not None:
                    node.delete()
                    if node.isAncestorOf(package.currentNode):
                        package.currentNode = package.root
                else:
                    log.error("deleteNode cannot locate "+nodeId)

            
    def handleDelNode(self, client, confirm, nodeId):
        """Called from xmlhttp. 
        'confirm' is a string. It is 'false' if the user or the gui has
        cancelled the deletion 'nodeId' is the nodeId
        """
        if confirm == 'true':
            node = self.package.findNode(nodeId)
            if node is not None and node is not self.package.root:
                # Actually remove the elements in the dom
                client.call('XHDelNode', nodeId)
                # Update our server version of the package
                if (node.isAncestorOf(self.package.currentNode) or 
                    node is self.package.currentNode):
                    self.package.currentNode = node.parent
                node.delete()
            else:
                log.error("deleteNode cannot locate " + nodeId)


    def handleRenNode(self, client, nodeId, newName):
        """Called from xmlhttp"""
        if newName in ('', 'null'): 
            return
        node = self.package.findNode(nodeId)
        node.title = unicode(newName, 'utf8')
        client.sendScript('XHRenNode("%s")' % newName.replace('"', '\\"'))


    def _doJsRename(self, client, node):
        """
        Recursively renames all children to their default names on
        the client if the node's default name has not been overriden
        """
        if not node._title:
            client.call('XHRenNode', node.title.replace('"', '\\"'), node.id)
        for child in node.children: 
            self._doJsRename(client, child)


    def handleDrop(self, client, sourceNodeId, parentNodeId, nextSiblingNodeId):
        """Handles the end of a drag drop operation..."""
        source = self.package.findNode(sourceNodeId)
        parent = self.package.findNode(parentNodeId)
        nextSibling = self.package.findNode(nextSiblingNodeId)
        if source and parent:
            # If the node has a default title and is changing levels
            # Make the client rename the node after we've moved it
            doRename = (not source.title and 
                        parent is not source.parent)
            # Do the move
            if nextSibling:
                assert nextSibling.parent is parent, \
                       '"sibling" has different parent: [%s/%s] [%s/%s]' % \
                        (parent.id, parent.title, nextSibling.id, 
                         nextSibling.title)
                source.move(parent, nextSibling)
                log.info("Dragging %s under %s before %s" % 
                         (source.title, parent.title, nextSibling.title))
            else:
                source.move(parent)
                log.info("Dragging %s under %s at start" % 
                         (source.title, parent.title))
            # Rename on client if it will have changed
            if doRename:
                # Recursively rename all nodes on the client
                self._doJsRename(client, source)
        else:
            log.error("Can't drag and drop tree items")


    def _doJsMove(self, client, node):
        """Makes the javascipt move a node,
        the 'node' param should already have been moved 
        to the new position. This makes the client catch up
        to the server"""
        sibling = node.nextSibling() 
        if sibling:
            siblingId = sibling.id
        else:
            siblingId = 'null'

        if node.parent:
            client.call('XHMoveNode', node.id, node.parent.id, siblingId)


    def handlePromote(self, client, sourceNodeId):
        """Promotes a node"""
        node = self.package.findNode(sourceNodeId)
        if node.promote():
            self._doJsMove(client, node)
            self._doJsRename(client, node)


    def handleDemote(self, client, sourceNodeId):
        """Demotes a node"""
        node = self.package.findNode(sourceNodeId)
        if node.demote():
            self._doJsMove(client, node)
            self._doJsRename(client, node)


    def handleUp(self, client, sourceNodeId):
        """Moves a node up its list of siblings"""
        node = self.package.findNode(sourceNodeId)
        if node.up():
            self._doJsMove(client, node)
            self._doJsRename(client, node)


    def handleDown(self, client, sourceNodeId):
        """Moves a node down its list of siblings"""
        node = self.package.findNode(sourceNodeId)
        if node.down():
            self._doJsMove(client, node)
            self._doJsRename(client, node)


    def encode2nicexml(self, string):
        """
        Turns & into &amp; etc
        """
        xmlEntities = [('&', '&amp;'),
                       ('"', '&quot;'),
                       ("'", '&apos;'),
                       ('<', '&lt;'),
                       ('>', '&gt;')]
        for src, dest in xmlEntities:
            string = string.replace(src, dest)
        return string
# ===========================================================================
