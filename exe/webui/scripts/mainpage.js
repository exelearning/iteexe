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

// This file contains all the js related to the main xul page

// This var is needed, because initWindow is called twice for some reason
var haveLoaded = false

// Takes a server tree node id eg. '1' and returns a xul treeitem elemtent reference
function serverId2treeitem(serverId) {
    // Enumerate the tree elements until we find the correct one
    var tree = document.getElementById('outlineTree')
    var items = tree.getElementsByTagName('treeitem')
    for (var i=0; i<items.length; i++) {
        if (items[i].firstChild.getAttribute('_exe_nodeid') == serverId) {
            return items[i]
        }
    }
    return null // Should never really reach here
}

// Takes a server tree node id eg. '1' and returns a xul tree index
// Don't store this because this index changes when branches above the element
// are collapsed and expanded
function serverId2TreeId(serverId) {
    var tree = document.getElementById('outlineTree')
    var item = serverId2treeitem(serverId)
    if (item) {
        return tree.contentView.getIndexOfItem(item)
    } else {
        return '0' // Should never really reach here
    }
}

function initWindow() {
    if (haveLoaded) {return}
    // Select the Draft tree item
    var tree = document.getElementById('outlineTree')
    var sel = tree.view.selection
    var index = serverId2TreeId('0')  // The draft section is always id '0'
    var oldSelect = tree.getAttribute('onselect')
    // For some reason, onload is called whenever the form
    // in the iframe is refreshed. So to stop recursion, we
    // remove it here
    haveLoaded = true
    sel.select(index)
    tree.focus()
}

// Returns the tree item from index which can come from 'tree.getCurrentIndex'
function getOutlineItem(tree, index) {
    // Get the appropriate treeitem element
    // There's a dumb thing with trees in that mytree.currentIndex
    // Shows the index of the treeitem that's selected, but if there is a
    // collapsed branch above that treeitem, all the items in that branch are
    // not included in the currentIndex value, so
    // "var treeitem = mytree.getElementsByTagName('treeitem')[mytree.currentIndex]"
    // doesn't work. We have to do this!
    var mytree = tree
    if (!mytree) { mytree = document.getElementById('outlineTree') }
    var items = mytree.getElementsByTagName('treeitem')
    for (var i=0; i<items.length; i++) {
        if (mytree.contentView.getIndexOfItem(items[i]) == index) {
            return items[i]
        }
    }
    return null // Should never get here
}


// Returns the currently selected tree item.
function currentOutlineItem(tree) {
    // Get the appropriate treeitem element
    var mytree = tree
    if (!mytree) { mytree = document.getElementById('outlineTree') }
    return getOutlineItem(tree, mytree.currentIndex)
}

// Returns the label of the currently selected tree row
function currentOutlineLabel() {
    var treeitem = currentOutlineItem()
    return treeitem.getElementsByTagName('treecell')[0].getAttribute('label')
}

// Returns the _exe_nodeid attribute of the currently selected row item
function currentOutlineId(index)
{
    var treeitem = currentOutlineItem()
    return treeitem.getElementsByTagName('treerow')[0].getAttribute('_exe_nodeid')
}

// Confirms the deletion of the currently selected node.
// Returns true or false for server
// Basically ignores request when requesting to delete home node or draft node
function confirmDelete() {
    var id = currentOutlineId()
    if (id != '0' && id != '1') {
        return confirm('Delete "' + currentOutlineLabel() + '" node and all its children. Are you sure?')
    } else {
        return 'false' 
    }
}

// Appends a child node with name and _exe_nodeid to the currently
// selected node
// XH means that the func is actually called by the server over xmlhttp
function XHAddChildTreeItem(nodeid, name) {
    var tree = document.getElementById('outlineTree');
    var treeitem = currentOutlineItem(tree)
    var row = treeitem.getElementsByTagName('treerow')[0]
    // Create the new node
    var newTreeRow = row.cloneNode(1) // Clone the existing row
    newTreeRow.firstChild.setAttribute('label', name) // Set the treecell's label
    newTreeRow.setAttribute('_exe_nodeid', nodeid)
    var newTreeItem = document.createElement('treeitem')
    newTreeItem.appendChild(newTreeRow)
    // If we're not at the top level of the tree, become a container
    var container = treeitem.getAttribute('container')
    if ((!container) || (container == 'false')) {
        treeitem.setAttribute('container', 'true')
        treeitem.setAttribute('open', 'true')
        container = treeitem.appendChild(document.createElement('treechildren'))
    } else {
        container = treeitem.getElementsByTagName('treechildren')[0]
        // If still haven't got a 'treechildren' node, then make one
        if (!container) {
            container = treeitem.appendChild(document.createElement('treechildren'))
        }
    }
    // Append the new node
    container.appendChild(newTreeItem)
    // Select it
    tree.view.selection.select(tree.view.getIndexOfItem(newTreeItem))
}

// Delete's the currently selected node
// XH means that the func is actually called by the server over xmlhttp
function XHDelNode(treeitem) {
    var tree = document.getElementById('outlineTree');
    if (!treeitem) { var treeitem = currentOutlineItem(tree) }
    var parentItem = treeitem.parentNode.parentNode
    // Select the parent node
    if (parentItem.tagName == 'treeitem') { 
        tree.view.selection.select(tree.view.getIndexOfItem(parentItem))
    }
    // Remove our node
    var parent = treeitem.parentNode
    parent.removeChild(treeitem)
    // If we don't have any siblings, make our parent be not a container
    if (parent.childNodes.length == 0) {
        parentItem.setAttribute('container', 'false')
        parentItem.removeChild(parent) // Remove the treechildren node
    }
}

// Renames the node associated with 'treeitem' to 'newName'
// If 'treeitem' is not passed, uses currently selected node
function XHRenNode(newName, id) { 
    if (!id) { var treeitem = currentOutlineItem() }
    else { var treeitem = serverId2treeitem(id) }
    treeitem.getElementsByTagName('treecell')[0].setAttribute('label', newName)
    // Update the authoring page iframe
    var ele = top.frames[0].document.getElementById('nodeTitle')
    if (ele.tagName == "INPUT") {
        ele.setAttribute('value', newName)
    } else {
        ele.firstChild.nodeValue = newName
    }
}

// Asks the user for a new name for the currently selected node
function askNodeName() {
    var treeitem = currentOutlineItem()
    var oldLabel = treeitem.getElementsByTagName('treecell')[0].getAttribute('label')
    var name = prompt("Rename '"+oldLabel+"'\nEnter the new name", '');
    return name
}

function delTreeItem() { submitLink('deleteNode', currentOutlineId(), 1) }

function outlineClick() {
    submitLink('changeNode', currentOutlineId(), 0)
}
