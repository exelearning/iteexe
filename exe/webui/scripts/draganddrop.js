// ===========================================================================
// eXe
// Copyright 2004-2005, University of Auckland
//
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 2 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
// ===========================================================================

// This files implements the drag and drop functionality of the outline tree
netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect")

function treeDragGesture(event) {
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect")
    var tree = document.getElementById('outlineTree') 
    var treeitem = currentOutlineItem(tree)
    // Only allow dragging of treeitems below main
    if (tree.view.getIndexOfItem(treeitem) <= 1) { return }
    // Start packaging the drag data (Which we don't use but have to do anyway)
    var data = new Array(treeitem)
    var ds = Components.classes["@mozilla.org/widget/dragservice;1"].getService(Components.interfaces.nsIDragService);
    var trans = Components.classes["@mozilla.org/widget/transferable;1"].createInstance(Components.interfaces.nsITransferable);
    trans.addDataFlavor("text/plain");
    var textWrapper = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
    textWrapper.data = currentOutlineId(); // Get the id of the node bieng dragged
    trans.setTransferData("text/plain", textWrapper, textWrapper.data.length);  // double byte data
    // create an array for our drag items, though we only have one this time
    var transArray = Components.classes["@mozilla.org/supports-array;1"].createInstance(Components.interfaces.nsISupportsArray);
    // Put it into the list as an |nsISupports|
    //var data = trans.QueryInterface(Components.interfaces.nsISupports);
    transArray.AppendElement(trans);
    // Actually start dragging
    ds.invokeDragSession(treeitem, transArray, null, ds.DRAGDROP_ACTION_COPY + ds.DRAGDROP_ACTION_MOVE);
    event.preventBubble(); // This line was in an example, will test if we need it later...
}

function treeDragEnter(event) {
    event.preventBubble(); // This line was in an example, will test if we need it later...
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect")
    var ds = Components.classes["@mozilla.org/widget/dragservice;1"].getService(Components.interfaces.nsIDragService);
    var ses = ds.getCurrentSession()
    var tree = document.getElementById('outlineTree')
    //tree.treeBoxObject.onDragEnter(event)
    if (ses) { ses.canDrop = 'true' }
}

function treeDragOver(event) {
    event.preventBubble(); // This line was in an example, will test if we need it later...
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect")
    var ds = Components.classes["@mozilla.org/widget/dragservice;1"].getService(Components.interfaces.nsIDragService);
    var ses = ds.getCurrentSession()
    var tree = document.getElementById('outlineTree')
    // Get the new parent node
    var row = { }
    var col = { }
    var child = { }
    tree.treeBoxObject.getCellAt(event.pageX, event.pageY, row, col, child)
    // If they land on a treeitem node, make that node the new parent
    var parentNode = getOutlineItem(tree, row.value)
    // Can't drop onto the draft node!
    if (tree.view.getIndexOfItem(parentNode) == 0) { 
        ses.canDrop = false
    } else {
        ses.canDrop = true
    }
    // Update the feed back thing
    tree.treeBoxObject.onDragOver(event)
}

function treeDragExit(event) {
    event.preventBubble(); // This line was in an example, will test if we need it later...
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect")
    var ds = Components.classes["@mozilla.org/widget/dragservice;1"].getService(Components.interfaces.nsIDragService);
    var ses = ds.getCurrentSession()
    var tree = document.getElementById('outlineTree')
    //tree.treeBoxObject.onDragExit(event)
    ses.canDrop = true
    if (ses) { ses.canDrop = 'true' } else { alert('No session') }
}

function treeDragDrop(event) {
    event.preventBubble(); // This line was in an example, will test if we need it later...
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect")
    var ds = Components.classes["@mozilla.org/widget/dragservice;1"].getService(Components.interfaces.nsIDragService);
    var ses = ds.getCurrentSession()
    var sourceNode = ses.sourceNode
    var tree = document.getElementById('outlineTree')
    // We'll just get the node id from the source element
    var nodeId = sourceNode.firstChild.getAttribute('_exe_nodeid')
    // Get the new parent node
    var row = { }
    var col = { }
    var child = { }
    tree.treeBoxObject.getCellAt(event.pageX, event.pageY, row, col, child)
    // CRAPINESS ALERT!
    // If they're moving, (without ctrl down) the target node becomes our sibling
    // above us. If copying, the source node becomes the first child of the target node
    var targetNode = getOutlineItem(tree, row.value)
    if (ses.dragAction & ses.DRAGDROP_ACTION_COPY) {
        // Target node is our parent, sourceNode becomes first child
        var parentItem = targetNode
        var sibling = null  // Must be worked out after we get 'container' (treeitems)
        var before = true
    } else {
        // Target node is our sibling, we'll be inserted below (vertically) it on the same tree level
        var parentItem = targetNode.parentNode.parentNode
        var sibling = targetNode
        var before = false
    }
    // Do some sanity checking
    if ((sourceNode == parentItem) || (sourceNode == targetNode)) return;
    var parentItemId = parentItem.firstChild.getAttribute('_exe_nodeid')
    if (parentItemId == '0') return; // Can't choose draft as parent
    if (sibling && (tree.view.getIndexOfItem(sibling) <= 1)) { return } // Can't drag to top level
    try { if ((parentItem.getElementsByTagName('treechildren')[0].firstChild == sourceNode) && before) { return } // Can't drag into same position
    } catch(e) { } // Ignore when parentItem has no treechildren node
    // Check for recursion
    var node = targetNode.parentNode
    while (node) {
        if (node == sourceNode) { return } // Can't drag into own children
        node = node.parentNode
    }
    // Re-organise the tree...
    // See if parent is a container
    var isContainer = parentItem.getAttribute('container')
    if ((!isContainer) || (isContainer == 'false')) {
        // Make it one
        var container = parentItem.appendChild(document.createElement('treechildren'))
        parentItem.setAttribute('container', 'true')
        parentItem.setAttribute('open', 'true')
    } else {
        var container = parentItem.getElementsByTagName('treechildren')[0]
        // If still haven't got a 'treechildren' node, then make one
        if (!container) {
            var container = parentItem.appendChild(document.createElement('treechildren'))
        }
    }
    // Now we can work out our sibling if we don't already have it
    if (before) { sibling = container.firstChild }
    // Tell the server what's happening...
    var nextSiblingNodeId = null
    if (before) {
        if (sibling) { nextSiblingNodeId = sibling.firstChild.getAttribute('_exe_nodeid') }
    } else {
        if (sibling.nextSibling) { nextSiblingNodeId = sibling.nextSibling.firstChild.getAttribute('_exe_nodeid') }
    }
    nevow_clientToServerEvent('outlinePane.handleDrop',this,'', sourceNode.firstChild.getAttribute('_exe_nodeid'), parentItemId, nextSiblingNodeId)
    // Move the node
    var oldContainer = sourceNode.parentNode
    try { oldContainer.removeChild(sourceNode) } catch(e) { } // For some reason works, but still raises exception!
    if (sibling) {  // If the container has children
        // Insert either before or after the sibling
        if (before) {
            if (sibling) {
                container.insertBefore(sourceNode, sibling)
            } else {
                container.appendChild(sourceNode)
            }
        } else {
            // Append after target node
            if (sibling.nextSibling) {
                container.insertBefore(sourceNode, sibling.nextSibling)
            } else {
                container.appendChild(sourceNode)
            }
        }
    } else {
        // Otherwise, just make it be the only child
        container.appendChild(sourceNode)
    }
    // See if the old parent node is no longer a container
    if (oldContainer.childNodes.length == 0) {
        oldContainer.parentNode.setAttribute('container', 'false')
        oldContainer.parentNode.removeChild(oldContainer) // Remove the treechildren node
    }
}
