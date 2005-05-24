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

// Set to false to stop selects doing page reloads
var clickon = true 

// Takes a server tree node id eg. '1' and returns a xul treeitem elemtent
// reference
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
    // Select the root tree item
    var tree = document.getElementById('outlineTree')
    var sel = tree.view.selection
    var index = serverId2TreeId('0')  // The root section is always id '0'
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
// Basically ignores request when requesting to delete home node 
function confirmDelete() {
    var id = currentOutlineId()
    if (id != '0') {
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
    insertChildTreeItem(treeitem, newTreeItem)
}

function insertChildTreeItem(parentItem, newTreeItem, nextSibling) {
    // If we're not at the top level of the tree, become a container
    var container = parentItem.getAttribute('container')
    if ((!container) || (container == 'false')) {
        parentItem.setAttribute('container', 'true')
        parentItem.setAttribute('open', 'true')
        container = parentItem.appendChild(document.createElement('treechildren'))
    } else {
        container = parentItem.getElementsByTagName('treechildren')[0]
        // If still haven't got a 'treechildren' node, then make one
        if (!container) {
            container = parentItem.appendChild(document.createElement('treechildren'))
        }
    }
    // Append/insert the new node
    if (nextSibling) {
        container.insertBefore(newTreeItem, nextSibling)
    } else { 
        container.appendChild(newTreeItem)
    }
}

// Delete's the currently selected node
// XH means that the func is actually called by the server over xmlhttp
// item can be a dom node or a server node id
function XHDelNode(item) {
    var tree = document.getElementById('outlineTree');
    if (!item) { var treeitem = currentOutlineItem(tree) }
    else if (typeof(item) == 'string') { var treeitem = serverId2treeitem(item) }
    else { var treeitem = item }
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

// Renames the node associated with 'treeitem' to 'newName' // If 'treeitem' is not passed, uses currently selected node
function XHRenNode(newName, id) { 
    if (!id) { var treeitem = currentOutlineItem() }
    else { var treeitem = serverId2treeitem(id) }
    treeitem.getElementsByTagName('treecell')[0].setAttribute('label', newName)
    // Update the authoring page iframe
    var titleElement = top.frames[0].document.getElementById('nodeTitle')
    // Sometimes when promoting/demoting nodes
    // the title element isn't there/renedered for some reason
    // Looping doesn't fix that, so we just tell firefox
    // to reload the page
    if (!titleElement) { top.frames[0].src = top.frames[0].src }
    else if (titleElement.tagName == "INPUT") {
        titleElement.setAttribute('value', newName)
    } else {
        titleElement.firstChild.nodeValue = newName
    }
}

// Moves a node in the tree
function XHMoveNode(id, parentId, nextSiblingId) {
    clickon = false
    try {
        var node = serverId2treeitem(id)
        var oldParent = node.parentNode.parentNode
        var newParent = serverId2treeitem(parentId)
        if (nextSiblingId != 'null') {
            var nextSibling = serverId2treeitem(nextSiblingId)
        } else {
            var nextSibling = null
        }
        // Remove ourselves from our old parent
        XHDelNode(node)
        // Insert ourselves in our new parent
        if (nextSibling) {
            insertChildTreeItem(newParent, node, nextSibling)
        } else {
            insertChildTreeItem(newParent, node)
        }
    } finally {
        clickon = true
    }
    // Re-select the node we just moved
    var tree = document.getElementById('outlineTree')
    tree.view.selection.select(tree.view.getIndexOfItem(node))
}
    

// Asks the user for a new name for the currently selected node
function askNodeName() {
    var treeitem = currentOutlineItem()
    var oldLabel = treeitem.getElementsByTagName('treecell')[0].getAttribute('label')
    var name = prompt("Rename '"+oldLabel+"'\nEnter the new name", '');
    return name
}

function delTreeItem() { submitLink('deleteNode', currentOutlineId(), 1) }

// This is called when a different tree node is selected
function outlineClick() {
    if (clickon) {
        submitLink('changeNode', currentOutlineId(), 0)
    }
}

// Call this to ask the server if the package is dirty
// 'ifDirty' will be evaled if the package is dirty
function checkDirty(ifClean, ifDirty) {
    nevow_clientToServerEvent('isPackageDirty', this, '', ifClean, ifDirty)
}

// Call this to ask the server if the package is dirty
// This is higher level than checkDirty; if the package is dirty, the user will 
// be asked if they want to save their changes
// 'nextStep' is a string that will be evaled if the package is clean, or if the user wants to
// discard the changes, or after the package has been saved, if the user chooses cancel
// nextStep will not be called
function askDirty(nextStep) {
    checkDirty(nextStep, 'askSave("'+nextStep+'")')
}

// This is called by the server to ask the user if they want to save their
// package before changing filenew/fileopen
// 'onProceed' is a string that is evaluated after the package has been saved or
// the user has chosen not to save the package
function askSave(onProceed) {
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect")
    var promptClass = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
    var promptService = promptClass.getService(Components.interfaces.nsIPromptService)
    var flags = promptService.BUTTON_TITLE_SAVE * promptService.BUTTON_POS_0 +
                promptService.BUTTON_TITLE_IS_STRING * promptService.BUTTON_POS_1 +
                promptService.BUTTON_TITLE_CANCEL * promptService.BUTTON_POS_2
    var res = promptService.confirmEx(window,"Save Package first?",
                                      "The current package has been modified and not yet saved." +
                                      "Would you like to save it before loading the new package?",
                                      flags, null, 'Discard', null, '', {});
    if (res == 0) {
      // If we need to save the file
      // go through the whole save process
      fileSave(onProceed)
    } else if (res == 1) {
      // If Not to be saved, contiue the process
      eval(onProceed)
    } else if (res == 2) {
      // If cancel loading, cancel the whole process
      return
    }
}

// This is called when a user wants to create a new package
function fileNew() {
    // Ask the server if the current package is dirty
    askDirty("window.top.location = '/'")
}

// This is called when a user wants to open a new file
// It starts a chain of fileOpenX() funcs...
function fileOpen() {
    // Ask the server if the current package needs changing
    // And once we have the answer, go to fileOpen2()
    // The ansert is stored by the server in the global variable
    // isPackageDirty
    askDirty('fileOpen2()')
}

// Shows the the load dialog and actually loads the new package
function fileOpen2() {
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect")
    var nsIFilePicker = Components.interfaces.nsIFilePicker;
    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    fp.init(window, "Select a File", nsIFilePicker.modeOpen);
    fp.appendFilter("eXe Package Files","*.elp");
    fp.appendFilters(nsIFilePicker.filterAll);
    var res = fp.show();
    if (res == nsIFilePicker.returnOK) {
        nevow_clientToServerEvent('loadPackage', this, '', fp.file.path)
    }
}

// Called by the user when they want to save their package
// Also called by some java script to cause a whole
// proper save process.
// 'onProceed' is optional, if passed it will be evaluated
// once the whole package has been saved or the save process
// has been cancelled by the user.
function fileSave(onProceed) {
    if (!onProceed)
        var onProceed = '' 
    nevow_clientToServerEvent('getPackageFileName', this, '', 'fileSave2', onProceed)
}

// Takes the server's response after we asked it for the
// filename of the package we are currently editing
function fileSave2(filename, onDone) {
    if (filename) {
        // If the package has been previously saved/loaded
        // Just save it over the old file
        if (onDone) nevow_clientToServerEvent('savePackage', this, '', '', onDone)
        else nevow_clientToServerEvent('savePackage', this, '')
    } else {
        // If the package is new (never saved/loaded) show a
        // fileSaveAs dialog
        fileSaveAs(onDone)
    }
}

// Called by the user when they want to save their package
function fileSaveAs(onDone) {
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect")
    var nsIFilePicker = Components.interfaces.nsIFilePicker;
    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    fp.init(window, "Select a File", nsIFilePicker.modeSave);
    fp.appendFilter("eXe Package Files","*.elp");
    var res = fp.show();
    if (res == nsIFilePicker.returnOK || res == nsIFilePicker.returnReplace) {
        if (onDone) {
            nevow_clientToServerEvent('savePackage', this, '', fp.file.path, onDone)
        } else {
            nevow_clientToServerEvent('savePackage', this, '', fp.file.path)
        }
    } else {
        eval(onDone)
    }
}

// Called by the user to provide an image file name to add to the package
function fileAddResource() {
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect")
    var nsIFilePicker = Components.interfaces.nsIFilePicker;
    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    fp.init(window, "Select a File", nsIFilePicker.modeOpen);
    fp.appendFilters(nsIFilePicker.filterImages);
    fp.appendFilter("Sound Files", ".wav; .au; .ogg; .mp3; .mp2");
    fp.appendFilter("Video Files", ".avi; .mpeg; .mpv; .mov");
    fp.appendFilters(nsIFilePicker.filterAll);
    var res = fp.show();
    if (res == nsIFilePicker.returnOK) {
        nevow_clientToServerEvent('addResource', this, '', fp.file.path)
    }
}

// Launch the iDevice Editor Window
function toolsEditor() {
    var features  = "width=800,height=700,status=yes,resizeable=yes,"+
                    "scrollbars=yes";
    var editorWin = window.open("/editor", "iDevice Editor", features);
}

// launch brents crazy robot metadata editor and tag warehouse 
// loads the metadata editor
// of course i don't really know what to do after here ...
// but you get the idea right ;-) i just make em look purty!

function metadataEditor() {
	var features = "width=500,height=640,status=yes,resizeable=yes,"+
			"scrollbars=yes";
	var metadataWin = window.open ("/templates/metadata.xul", 
                                       "metadata editor", features);}

// load the About page

function aboutPage() {
	var features = "width=300,height=400,status=no,resizable=no";
	var aboutWin = window.open ("/templates/about.xul", "About", features);}

// Appends an iDevice
// XH means that the func is actually called by the server over xmlhttp
function XHAddIdeviceListItem(ideviceId, ideviceTitle) {
    var list = document.getElementById('ideviceList');
    // Create the new listitem
    var newListItem = document.createElement('listitem')
    newListItem.setAttribute("onclick", 
                             "submitLink('AddIdevice', "+ideviceId+", 1);")
    newListItem.setAttribute("label", ideviceTitle)
    list.appendChild(newListItem)
}


// This function takes care of all
// exports. At the moment, this means web page export
// and scorm packages, with and without meta data
// 'exportType' is passed straight to the server
// Currently valid values are:
// 'scormMeta' 'scormNoMeta' 'webSite'
function exportPackage(exportType) {
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect")
    var nsIFilePicker = Components.interfaces.nsIFilePicker;
    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    if (exportType == 'webSite') {
        fp.init(window, "Select the parent folder for export.",
                         nsIFilePicker.modeGetFolder);
        var res = fp.show();
        if (res == nsIFilePicker.returnOK) {
            nevow_clientToServerEvent('exportPackage', this, '', exportType, fp.file.path)
        }
    } else {
        fp.init(window, "Export scorm package as", nsIFilePicker.modeSave);
        fp.appendFilter("Scorm Packages", "*.zip");
        fp.appendFilter("All Files", "*.*");
        var res = fp.show();
        if (res == nsIFilePicker.returnOK || res == nsIFilePicker.returnReplace) {
            nevow_clientToServerEvent('exportPackage', this, '', exportType, fp.file.path)
        }
    }
}
