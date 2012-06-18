// ===========================================================================
// eXe
// Copyright 2004-2005, University of Auckland
// Copyright 2004-2008 eXe Project, http://eXeLearning.org/
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
var onLoadHandlers = [clearHidden, window.parent.enableButtons];
var beforeSubmitHandlers = new Array();

// Called on document load
function onLoadHandler() {
    runFuncArray(onLoadHandlers)
}

curr_edits_math_num = 1
// for unique mimetex images from exemath. will reset to #1 w/ each new edit, 
// but will create  unique math# within each edit session to the previews dir.

// Strings to be translated
SELECT_AN_IMAGE    = "Select an image";
IMAGE_FILES        = "Image Files (.jpg, .jpeg, .png, .gif)";
JPEG_FILES         = "JPEG Files (.jpg, .jpeg)";
SELECT_A_FILE      = "Select a file";
FLASH_MOVIE        = "Flash Movie (.flv)";
FLASH_OBJECT       = "Flash Object (.swf)";
SELECT_AN_MP3_FILE = "Select an mp3 file";
MP3_AUDIO          = "MP3 Audio (.mp3)";
SHOCKWAVE_FILES    = "Shockwave Director Files (.dcr)"
QUICKTIME_FILES    = "Quicktime Files (.mov, .qt, .mpg, .mp3, .mp4, .mpeg)"
WINDOWSMEDIA_FILES = "Windows Media Player Files (.avi, .wmv, .wm, .asf, .asx, .wmx, .wvx)"
REALMEDIA_AUDIO    = "RealMedia Audio Files (.rm, .ra, .ram, .mp3)"



SELECT_A_PACKAGE   = "Select a package";
//YOUR_SCORE_IS      = "Your score is ";
YOUR_SCORE_IS      = "Tu puntuación es ";


// Calls function in an array where each 'row' of the array is in the format:
// func
// or
// [func, arg]
function runFuncArray(handlers) {
    for (var i=0; i < handlers.length; i++) {
        var row = handlers[i] 
        if (typeof row=="function")
            row()
        else
            if (row) {
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
    fp.init(window, SELECT_AN_IMAGE, mode);
    fp.appendFilter(IMAGE_FILES, "*.jpg; *.jpeg; *.png; *.gif");
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

// Asks the user for a media file, returns the path or an empty string
function askUserForMedia() {
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var nsIFilePicker = Components.interfaces.nsIFilePicker;
    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    var mode = nsIFilePicker.modeOpen;
    fp.init(window, SELECT_A_FILE, mode);
    // default filter to ALL:
    fp.appendFilters(nsIFilePicker.filterAll);
    // but also add filters for each media type supported by tinyMCE's media plugin:
    fp.appendFilter(FLASH_OBJECT, "*.swf");
    fp.appendFilter(QUICKTIME_FILES, "*.mov; *.qt; *.mpg; *.mp3; *.mp4; *.mpeg");
    //fp.appendFilter(SHOCKWAVE_FILES, "*.dcr");
    fp.appendFilter(WINDOWSMEDIA_FILES, "*.avi; *.wmv; *.wm; *.asf; *.asx; *.wmx; *.wvx");
    fp.appendFilter(REALMEDIA_AUDIO, "*.rm; *.ra; *.ram; *.mp3");
    var res = fp.show();
    if (res == nsIFilePicker.returnOK) {
        return fp.file.path;
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
        var theForm = getContentForm();
        theForm.action.value = "addImage"
        theForm.object.value = elementId 
        theForm.submit()
    }
}

// Called by the user to provide an image feedback to add to a case study idevice question
function addFeedbackImage(elementId) {
    var imagePath = askUserForImage()
    if (imagePath != "") {
        var image = document.getElementById('img'+elementId);
        image.removeAttribute('width');
        image.removeAttribute('height');
        var path  = document.getElementById('path'+elementId);
        path.value = imagePath;
        image.src  = 'file://'+imagePath;
        var theForm = getContentForm();
        theForm.action.value = "addImage"
        theForm.object.value = elementId 
        var width = document.getElementById('width'+elementId);
        var height = document.getElementById('height'+elementId);
        width.value = "100"
        height.value = ""
        theForm.submit()
        changeImageWidth(elementId)
        theForm.submit()
        
    }
}

// Called by the user to provide an image or flash file name to add to the package
function addJpgImage(elementId) {
    var imagePath = askUserForJpgImage()
    if (imagePath != "") {
        var image = document.getElementById('img'+elementId);
        image.removeAttribute('width');
        image.removeAttribute('height');
        var path  = document.getElementById('path'+elementId);
        path.value = imagePath;
        image.src  = 'file://'+imagePath;
        var theForm = getContentForm();
        theForm.action.value = "addJpgImage"
        theForm.object.value = elementId 
        theForm.submit()
    }
}

// Asks the user for a jpg image, returns the path or an empty string
function askUserForJpgImage(multiple) {
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var nsIFilePicker = Components.interfaces.nsIFilePicker;
    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    if (multiple) {
        var mode = nsIFilePicker.modeOpenMultiple;
    } else {
        var mode = nsIFilePicker.modeOpen;
    }
    fp.init(window, SELECT_AN_IMAGE, mode);
    fp.appendFilter(JPEG_FILES, "*.jpg; *.jpeg");
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

// Called by the tinyMCE (as per the user's request) to provide an 
// image file name to add to the package's field and idevice
function chooseImage_viaTinyMCE(field_name, url, type, win) {

    var local_imagePath = ""
    // ask user for image or media, depending on type requested:
    if (type == "image") {
       local_imagePath = askUserForImage(false);
    }
    else if (type == "media") {
       local_imagePath = askUserForMedia();
    }
    else if (type == "file") {
       // new for advlink plugin, to link ANY resource into text:
       // re-use the Media browser, which defaults to All file types (*.*)
       local_imagePath = askUserForMedia();
    }
    else if (type == "image2insert" || type == "media2insert" || type == "file2insert") {
        if (type == "file2insert" && url.indexOf('#') >= 0) {
            // looks like a link to an internal anchor due to the #, so do
            // not proceed any further, since there is no more action necessary:
            return;
            // UNLESS this causes problems with embedding real filenames w/ #!!
            // But this will only be for links or filenames typed by hand;
            // those textlink URLs inserted via its file browser will use 
            // type=file rather than type=file2insert
        }
        // new direct insert capabilities, no file browser needed.
        // just copy the passed-in URL directly, no browser necessary:
        local_imagePath = url;
    }

    win.focus();

    // if the user hits CANCEL, then bail "immediately",
    // i.e., after bringing the tinyMCE image dialog back into focus, above.
    if (local_imagePath == "") {
       return;
    }

    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    // UNescape, to remove the %20's for spaces, etc.:
    var unescaped_local_imagePath = unescape(local_imagePath);
    var oldImageStr = new String(unescaped_local_imagePath);

    // and replace path delimiters (':', '\', or '/') or '%', ' ', or '&' 
    // with '_':
    var RegExp1 = /[\ \\\/\:\%\&]/g;
    var ReplaceStr1 = new String("_");
    var newImageStr = oldImageStr.replace(RegExp1, ReplaceStr1);

    // For simplicity across various file encoding schemes, etc.,
    // just ensure that the TinyMCE media window also gets a URI safe link, 
    // for doing its showPreview():
    early_preview_imageName = encodeURIComponent(newImageStr);
    // and one more escaping of the '%'s to '_'s, to flatten for simplicity:
    preview_imageName  = early_preview_imageName.replace(RegExp1, ReplaceStr1);
    full_previewImage_url = "/previews/"+preview_imageName;

    // pass the file information on to the server,
    // to copy it into the server's "previews" directory:
    window.parent.nevow_clientToServerEvent('previewTinyMCEimage', this, 
                  '', win, win.name, field_name, unescaped_local_imagePath, 
                  preview_imageName)

    // first, clear out any old value in the tinyMCE image filename field:
    win.document.forms[0].elements[field_name].value = ""; 

    // PreviewImage is only available for images:
    if (type == "image") {
       win.showPreviewImage(" ");
    }
    else if (type == "media") {
       win.generatePreview(" ");
    }


    // set the tinyMCE image filename field:
    win.document.forms[0].elements[field_name].value = full_previewImage_url;
    // then force its onchange event:

    // PreviewImage is only available for images:
    if (type == "image") {
       win.showPreviewImage(full_previewImage_url);
    }
    else if (type == "media") {
       win.generatePreview(full_previewImage_url);
    }

    // this onchange works, but it's dirty because it is hardcoding the 
    // onChange=".." event of that field, and if that were to ever change 
    // in tinyMCE, then this would be out of sync.

    // and finally, be sure to update the tinyMCE window's image data:
    if (win.getImageData) {
        win.getImageData();
    }
    else {
        if (window.tinyMCE.getImageData) {
           window.tinyMCE.getImageData();
        }
    }    
}

// Called by the tinyMCE (as per the user's request) to generate an 
// image file of the specified math (LaTeX source, compiled by mimetex)
// to add to the package's field and idevice
function makeMathImage_viaTinyMCE(field_name, src_latex, font_size, type, win) {

    var local_imagePath = ""

    if (src_latex == "") {
       return;
    }

    // to help unique-ify each previewed math image:
    var preview_basename = "eXe_LaTeX_math_"+curr_edits_math_num
    var preview_math_imagefile = preview_basename+".gif"
    // Simplify the subsequent file-lookup process,  by just appending 
    // the ".tex" to the full image name, as such:
    var preview_math_srcfile = preview_math_imagefile+".tex"
   
    curr_edits_math_num += 1

    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    // pass the file information on to the server,
    // to generate the image into the server's "previews" directory:
    window.parent.nevow_clientToServerEvent('generateTinyMCEmath', this, 
                  '', win, win.name, field_name, 
                  src_latex, font_size, preview_math_imagefile, 
                  preview_math_srcfile)

    // once the image has been generated, it SHOULD be sitting here:
    var full_preview_url = "/previews/"+preview_math_imagefile;

    win.focus();

    // clear out any old value in the tinyMCE image filename field:
    win.document.forms[0].elements[field_name].value = ""; 
    // PreviewImage is only available for images:
    if (type == "image") {
       win.showPreviewImage(" ");
    }
    // the above two commands are the only way to really 
    // ensure that we can trigger the onchange event below:

    // set the tinyMCE image filename field:
    win.document.forms[0].elements[field_name].value = full_preview_url;
    // then force its onchange event:
    // PreviewImage is only available for images:
    if (type == "image") {
       win.showPreviewImage(full_preview_url);
    }

}


// Called by the user to provide a flash movie file name to add to the package
function addFlashMovie(blockId) {
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var nsIFilePicker = Components.interfaces.nsIFilePicker;
    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    fp.init(window, SELECT_A_FILE, nsIFilePicker.modeOpen);
    fp.appendFilter(FLASH_MOVIE, "*.flv");
    fp.appendFilters(nsIFilePicker.filterAll);
    var res = fp.show();
    if (res == nsIFilePicker.returnOK) {
        var path  = document.getElementById('path'+blockId);
        path.type  = 'text';
        path.value = fp.file.path;
    }
}

// Called by the user to provide a flash file name to add to the package
function addFlash(blockId) {
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var nsIFilePicker = Components.interfaces.nsIFilePicker;
    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    fp.init(window, SELECT_A_FILE, nsIFilePicker.modeOpen);
    fp.appendFilter(FLASH_OBJECT, "*.swf");
    fp.appendFilters(nsIFilePicker.filterAll);
    var res = fp.show();
    if (res == nsIFilePicker.returnOK) {
        var path  = document.getElementById('path'+blockId);
        path.type  = 'text';
        path.value = fp.file.path;
    }
}

function addMp3(blockId) {
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var nsIFilePicker = Components.interfaces.nsIFilePicker;
    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    fp.init(window, SELECT_AN_MP3_FILE, nsIFilePicker.modeOpen);
    fp.appendFilter(MP3_AUDIO, "*.mp3");
    fp.appendFilters(nsIFilePicker.filterAll);
    var res = fp.show();
    if (res == nsIFilePicker.returnOK) {
        var path  = document.getElementById('path'+blockId);
        path.type  = 'text';
        path.value = fp.file.path;
    }
}


// Called by the user to provide a package name in order to get the user created idevices
// used by idevice editor
function addFile(blockId) {
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var nsIFilePicker = Components.interfaces.nsIFilePicker;
    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    fp.init(window, SELECT_A_PACKAGE, nsIFilePicker.modeOpen);
    fp.appendFilters(nsIFilePicker.filterAll);
    var res = fp.show();
    if (res == nsIFilePicker.returnOK) {
        var path  = document.getElementById('path'+blockId);
        path.value = fp.file.path;
    }
}

function uploadFile(blockId) {
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var nsIFilePicker = Components.interfaces.nsIFilePicker;
    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    fp.init(window, SELECT_A_FILE, nsIFilePicker.modeOpen);
    fp.appendFilters(nsIFilePicker.filterAll);
    var res = fp.show();
    if (res == nsIFilePicker.returnOK) {
        var path  = document.getElementById('path'+blockId);
        path.value = fp.file.path;
    }
    var theForm = getContentForm();
    theForm.submit();
}


function getContentForm() {
    var theForm;

    if (top["authoringIFrame1"] && top["authoringIFrame1"].document)
        theForm = top["authoringIFrame1"].document.getElementById('contentForm')
    if (!theForm) {
        // try and find the form for the authoring page
        theForm = document.getElementById('contentForm')
    }
    if (!theForm) {
        if (document.getElementById('authoringIFrame') && document.getElementById('authoringIFrame').contentDocument)
            theForm = document.getElementById('authoringIFrame').contentDocument.getElementById('contentForm')
    }
    
    return theForm;
}
// Called upon loading the page this function clears the hidden
// action and object fields so they can be used by submitLink
function clearHidden()
{
    var theForm = getContentForm();

    if (theForm) {
	    theForm.action.value = "";
	    theForm.object.value = "";
    }
}

// Sets the hidden action and object fields, then submits the 
// contentForm to the server
function submitLink(action, object, changed) 
{
    var theForm = getContentForm();

    if (theForm) {
	    theForm.action.value    = action;
	    theForm.object.value    = object;
	    theForm.isChanged.value = changed;
	    runFuncArray(beforeSubmitHandlers)
	
	    theForm.submit();
    }
}


// Check the user really really wants to do this before submitting
function confirmThenSubmitLink(message, action, object, changed) 
{
    if (confirm(message)) {
        submitLink(action, object, changed);
    }
}
