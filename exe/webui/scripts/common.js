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

// This module is for the common Javascript used in all webpages.

// Called upon loading the page this function clears the hidden
// action and object fields so they can be used by submitLink
var objBrowse = navigator.appName;

// Asks the user for an image, returns the path or an empty string
function askUserForImage() {
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var nsIFilePicker = Components.interfaces.nsIFilePicker;
    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    fp.init(window, "Select an image", nsIFilePicker.modeOpen);
    fp.appendFilter("Image Files", "*.jpg; *.jpeg; *.png; *.gif");
    fp.appendFilters(nsIFilePicker.filterAll);
    var res = fp.show();
    if (res == nsIFilePicker.returnOK) {
        return fp.file.path
    } else {
        return ""
    }
}

// Called by the user to provide an image file name to add to the package
function addImage(elementId) {
    var imagePath = askUserForImage()
    if (imagePath != "") {
        var image = document.getElementById('img'+elementId);
        image.removeAttribute('width');
        image.removeAttribute('height');
        var path  = document.getElementById('path'+elementId);
        path.value = fp.file.path;
        image.src  = 'file://'+fp.file.path;
    }
}

// Called by the user to provide an image file name to add to the package
function addGalleryImage(galleryId) {
    var imagePath = askUserForImage()
    if (imagePath != "") {
        var path  = document.getElementById('newImagePath'+galleryId);
        path.value = imagePath;
        // Save the change
        submitLink("edit", galleryId, true);
    }
}



function imageChanged(event) {
    var id = event.currentTarget.getAttribute('id');
    var elementId = id.substring(3, id.length);
    var image  = document.getElementById('img'+elementId);
    var width  = document.getElementById('width'+elementId);
    var height = document.getElementById('height'+elementId);
    width.value  = image.width;
    height.value = image.height;
}


function changeImageWidth(elementId) {
    var image  = document.getElementById('img'+elementId);
    var width  = document.getElementById('width'+elementId);
    var height = document.getElementById('height'+elementId);
    image.removeAttribute('height');
    if (width.value) {
        image.width  = width.value;
    } else {
        image.removeAttribute('width');
        width.value  = image.width;
    }
    height.value = image.height;
}


function changeImageHeight(elementId) {
    var image  = document.getElementById('img'+elementId);
    var width  = document.getElementById('width'+elementId);
    var height = document.getElementById('height'+elementId);
    image.removeAttribute('width');
    if (height.value) {
        image.height = height.value;
    } else {
        image.removeAttribute('height');
        height.value = image.height;
    }
    width.value  = image.width;
}


// Called by the user to provide a file name to add to the package
function addFile(blockId) {
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var nsIFilePicker = Components.interfaces.nsIFilePicker;
    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    fp.init(window, "Select an file", nsIFilePicker.modeOpen);
    fp.appendFilters(nsIFilePicker.filterAll);
    var res = fp.show();
    if (res == nsIFilePicker.returnOK) {
        var path  = document.getElementById('path'+blockId);
        path.value = fp.file.path;
    }
}


function showMe(ident, w, h)
{
    var elmDiv = document.getElementById('popupmessage');

    hideMe();
        
    if (!elmDiv || 
        elmDiv.innerHTML != document.getElementById(ident).innerHTML){

        elmDiv = document.createElement('div');
        elmDiv.id = 'popupmessage';
        elmDiv.className="popupDiv";
        elmDiv.style.cssText = 'position:absolute; left: ' + 
                               (xpos) + 'px; top: '+(ypos - h/2) + 
                               'px; width: ' + w + 'px;';
        elmDiv.innerHTML = document.getElementById(ident).innerHTML;
        document.body.appendChild(elmDiv);
        new dragElement('popupmessage');
    }
}
            

function hideMe() {
    var elmDiv = document.getElementById('popupmessage');
    if (elmDiv) {
        // removes the div from the document
        elmDiv.parentNode.removeChild(elmDiv);
    }
}


function updateCoords(e) {
    if (objBrowse == "Microsoft Internet Explorer") {
        xpos = e.offsetX;
        ypos = e.offsetY;

    } else {
        xpos = e.pageX;
        ypos = e.pageY;
    }
}


function clearHidden()
{
    var form = top["authoringIFrame1"].document.getElementById('contentForm')
    if (!form) {
        // try and find the form for the authoring page
        form = document.getElementById('contentForm')
    }
    form.action.value = "";
    form.object.value = "";
}


// Sets the hidden action and object fields, then submits the 
// contentForm to the server
function submitLink(action, object, changed) 
{
    var form = top["authoringIFrame1"].document.getElementById('contentForm')
    if (!form) {
        // try and find the form for the authoring page
        form = document.getElementById('contentForm')
    }
    form.action.value    = action;
    form.object.value    = object;
    form.isChanged.value = changed;
    form.submit();
}


// Check the user really really wants to do this before submitting
function confirmThenSubmitLink(message, action, object, changed) 
{
    if (confirm(message)) {
        submitLink(action, object, changed);
    }
}


function beforeUnload(){
    if (document.getElementById("contentFrame").contentDocument.contentForm.isChanged.value=="1")
        if (window.confirm("Do you want to save the package?"))
            saveChange("saveChange")
}


function saveChange(action){
    document.getElementById("contentFrame").contentDocument.contentForm.isChanged.value = 0
    document.getElementById("contentFrame").contentDocument.contentForm.action.value = action;
    document.getElementById("contentFrame").contentDocument.contentForm.submit();
}


function getFeedback(optionId, optionsNum, ideviceId) {
    for (i = 0; i< optionsNum; i++) {   
        id = "s" + i + "b" +ideviceId
        if(i == optionId)
            document.getElementById(id).style.display = "block";
        else
            document.getElementById(id).style.display = "None";
    }
}



