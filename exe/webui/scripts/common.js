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

// An array of js strings to evaluate on document load
var onLoadHandlers = [clearHidden];
var beforeSubmitHandlers = [];

// Called on document load
function onLoadHandler() {
    runFuncArray(onLoadHandlers)
}

// Calls function in an array where each 'row' of the array is in the format:
// func
// or
// [func, arg]
function runFuncArray(handlers) {
    for (var i=0; i < handlers.length; i++) {
        var row = handlers[i] 
        if (typeof row=="function")
            row()
        else {
            // row[0] is a function, row[1] are its args
            row[0].apply(this, row[1]);
        }
    }
}

// Asks the user for an image, returns the path or an empty string
function askUserForImage(multiple) {
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var nsIFilePicker = Components.interfaces.nsIFilePicker;
    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    if (multiple) {
        var mode = nsIFilePicker.modeOpenMultiple;
    } else {
        var mode = nsIFilePicker.modeOpen;
    }
    fp.init(window, "Select an image", mode);
    fp.appendFilter("Image Files", "*.jpg; *.jpeg; *.png; *.gif");
    fp.appendFilters(nsIFilePicker.filterAll);
    var res = fp.show();
    if (res == nsIFilePicker.returnOK) {
        if (multiple) {
            var result = new String("");
            var lastFile = null;
            var file     = null;
            while (fp.files.hasMoreElements()) {
                file = fp.files.getNext().QueryInterface(Components.interfaces.nsIFile)
                if (file == lastFile) {
                    break;
                }
                lastFile = file;
                if (result != "") {
                    result += "&";
                }
                result += escape(file.path);
            }
            return result;
        } else {
            return fp.file.path;
        }
    } else {
        return ""
    }
}

// Called by the user to provide an image or flash file name to add to the package
function addImage(elementId) {
    var imagePath = askUserForImage()
    if (imagePath != "") {
        var image = document.getElementById('img'+elementId);
        image.removeAttribute('width');
        image.removeAttribute('height');
        var path  = document.getElementById('path'+elementId);
        path.value = imagePath;
        image.src  = 'file://'+imagePath;
    }
}

// Called by the user to provide one or more image files name to add to the package
function addGalleryImage(galleryId) {
    var imagePath = askUserForImage(true);
    if (imagePath != "") {
        // Save the change
        submitLink("gallery.addImage."+imagePath, galleryId, true);
    }
}

// Called by the user to change an existing gallery image
function changeGalleryImage(galleryId, imageId) {
    var imagePath = askUserForImage(false)
    if (imagePath != "") {
        // Save the change
        submitLink("gallery.changeImage."+imageId+"."+imagePath, galleryId, true);
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


// Called upon loading the page this function clears the hidden
// action and object fields so they can be used by submitLink
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
    runFuncArray(beforeSubmitHandlers)
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


function getFeedback(optionId, optionsNum, ideviceId, mode) {
    for (i = 0; i< optionsNum; i++) { 
        if (mode == "multi")
            id = "sa" + i + "b" +ideviceId
        else
            id = "s" + i + "b" +ideviceId
        if(i == optionId)
            document.getElementById(id).style.display = "block";
        else
            document.getElementById(id).style.display = "None";
    }
}


// Functions for cloze IDevice /////////////////////////////////////////////////

function onClozeChange(ele, word) {
    if (ele.value.toLowerCase() == word.toLowerCase()) 
        ele.style.backgroundColor = "yellow";
    else if (!ele.value)
        ele.style.backgroundColor = null;
    else
        ele.style.backgroundColor = "red";
};

// show or hide the feedback for reflection idevice
function showAnswer(id,isShow) {
    if (isShow==1) {
        document.getElementById("s"+id).style.display = "block";
        document.getElementById("hide"+id).style.display = "block";
        document.getElementById("view"+id).style.display = "none";
    }else{
        document.getElementById("s"+id).style.display = "none";
        document.getElementById("hide"+id).style.display = "none";
        document.getElementById("view"+id).style.display = "block";
    }
}

//Clear all student answers for cloze idevice
function clearAll(length, ident) {
    for (i=0; i<length; i++) {
        document.getElementById("clz"+ident+i).value="";
        document.getElementById("clz"+ident+i).style.backgroundColor="white"
    }
    showFeedback(ident, 0)
}

//Calculate the score for cloze idevice
function calScore(length, ident) {
    score = 0
    for (i=0; i<length; i++) {
        if (document.getElementById("clz"+ident+i).style.backgroundColor=="yellow")
            score++
    }
    alert("Your score is " + score +"/" + length + ".")
}

function answerAll(length, ident){
    for (i=0; i<length; i++){
        document.getElementById("clz"+ident+i).value = wordArray[i];
        document.getElementById("clz"+ident+i).style.backgroundColor="yellow";
    }
    showFeedback(ident, 1)
}

// show or hide the feedback for cloze idevice
function showFeedback(id,isShow) {
    if (isShow==1) {
        document.getElementById("s"+id).style.display = "block";
    } else {
        document.getElementById("s"+id).style.display = "none";
    }
}
