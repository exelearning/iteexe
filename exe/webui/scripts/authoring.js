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
function askUserForImage(multiple, fn, filter) {
    var fp, mode;
    if (multiple) {
        console.log("Not implemented");
        return "";
    }
    else
        mode = parent.eXe.view.filepicker.FilePicker.modeOpen;
    fp = parent.Ext.create("eXe.view.filepicker.FilePicker", {
        type: mode,
        title: parent._("Select an image"),
        modal: true,
        scope: this,
        callback: function(fp) {
            if (fp.status == parent.eXe.view.filepicker.FilePicker.returnOk) {
                if (multiple) {
//		            var result = new String("");
//		            var lastFile = null;
//		            var file     = null;
//		            while (fp.files.hasMoreElements()) {
//		                file = fp.files.getNext().QueryInterface(Components.interfaces.nsIFile)
//		                if (file == lastFile) {
//		                    break;
//		                }
//		                lastFile = file;
//		                if (result != "") {
//		                    result += "&";
//		                }
//		                result += escape(file.path);
//		            }
//		            return result;
		        } else {
                    fn(fp.file.path);
                }
            }
            else
                fn("");
        }
    });
    fp.appendFilters([
        filter? filter : { "typename": parent._("Image Files (.jpg, .jpeg, .png, .gif)"), "extension": "*.png", "regex": /.*\.(jpg|jpeg|png|gif)$/i },
        { "typename": parent._("All Files"), "extension": "*.*", "regex": /.*$/ }
    ]);
    parent.window.focus();
    fp.show();
}

// Asks the user for a media file, returns the path or an empty string
function askUserForMedia(fn) {
    var fp = parent.Ext.create("eXe.view.filepicker.FilePicker", {
        type: parent.eXe.view.filepicker.FilePicker.modeOpen,
        title: parent._("Select a file"),
        modal: true,
        scope: this,
        callback: function(fp) {
            if (fp.status == parent.eXe.view.filepicker.FilePicker.returnOk)
                fn(fp.file.path);
            else
                fn("");
        }
    });
    fp.appendFilters([
        { "typename": parent._("All Files"), "extension": "*.*", "regex": /.*$/ },
        { "typename": parent._("Flash Movie (.flv)"), "extension": "*.png", "regex": /.*\.flv$/i },
        { "typename": parent._("Flash Object (.swf)"), "extension": "*.png", "regex": /.*\.swf$/i },
        { "typename": parent._("Quicktime Files (.mov, .qt, .mpg, .mp3, .mp4, .mpeg)"), "extension": "*.png", "regex": /.*\.(mov|qt|mpg|mp3|mp4|mpeg)$/i },
        { "typename": parent._("Windows Media Player Files (.avi, .wmv, .wm, .asf, .asx, .wmx, .wvx)"), "extension": "*.png", "regex": /.*\.(avi|wmv|wm|asf|asx|wmx|wvx)$/i },
        { "typename": parent._("RealMedia Audio Files (.rm, .ra, .ram, .mp3)"), "extension": "*.png", "regex": /.*\.(rm|ra|ram|mp3)$/i }
    ]);
    parent.window.focus();
    fp.show();
}

// Called by the user to provide an image or flash file name to add to the package
function addImage(elementId, filter) {
    var fn = function(imagePath) {
	    if (imagePath != "") {
	        var image = document.getElementById('img'+elementId);
	        image.removeAttribute('width');
	        image.removeAttribute('height');
	        var path  = document.getElementById('path'+elementId);
	        path.value = imagePath;
	        image.src  = 'file://'+imagePath;
	        var theForm = getContentForm();
	        theForm.action.value = "addImage";
	        theForm.object.value = elementId;
	        theForm.submit();
	    }
    }
    askUserForImage(false, fn, filter);
}

// Called by the user to provide an image feedback to add to a case study idevice question
function addFeedbackImage(elementId) {
    var fn = function(imagePath) {
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
	        width.value = "100";
	        height.value = "";
	        theForm.submit();
	        changeImageWidth(elementId);
	        theForm.submit();
	    }
    }
    askUserForImage(false, fn);
}

// Called by the user to provide an image or flash file name to add to the package
function addJpgImage(elementId) {
    var filter = { "typename": parent._("JPEG Files (.jpg, .jpeg)"), "extension": "*.png", "regex": /.*\.(jpg|jpeg)$/i };
    addImage(elementId, filter);
}

// Called by the user to provide one or more image files name to add to the package
function addGalleryImage(galleryId) {
    var fn = function(imagePath) {
	    if (imagePath != "") {
	        // Save the change
	        submitLink("gallery.addImage."+imagePath, galleryId, true);
	    }
    }
    askUserForImage(true, fn);
}

// Called by the user to change an existing gallery image
function changeGalleryImage(galleryId, imageId) {
    var fn = function(imagePath) {
	    if (imagePath != "") {
	        // Save the change
	        submitLink("gallery.changeImage."+imageId+"."+imagePath, galleryId, true);
	    }
    }
    askUserForImage(false, fn);
}

// Called by the tinyMCE (as per the user's request) to provide an 
// image file name to add to the package's field and idevice
function chooseImage_viaTinyMCE(field_name, url, type, win) {
    var fn = function(local_imagePath) {
        win.focus();
    
        // if the user hits CANCEL, then bail "immediately",
        // i.e., after bringing the tinyMCE image dialog back into focus, above.
        if (local_imagePath == "") {
           return;
        }
    
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
        var early_preview_imageName = encodeURIComponent(newImageStr);
        // and one more escaping of the '%'s to '_'s, to flatten for simplicity:
        var preview_imageName  = early_preview_imageName.replace(RegExp1, ReplaceStr1);
        var full_previewImage_url = "/previews/"+preview_imageName;
    
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
    // ask user for image or media, depending on type requested:
    if (type == "image") {
       askUserForImage(false, fn);
    }
    else if (type == "media") {
       askUserForMedia(fn);
    }
    else if (type == "file") {
       // new for advlink plugin, to link ANY resource into text:
       // re-use the Media browser, which defaults to All file types (*.*)
       askUserForMedia(fn);
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
        fn(url);
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
    var filter = [
        { "typename": parent._("Flash Movie (.flv)"), "extension": "*.*", "regex": /.*\.flv$/i },
        { "typename": parent._("All Files"), "extension": "*.*", "regex": /.*$/ }
    ];
    addFile(blockId, parent._("Select a file"), filter);
}

// Called by the user to provide a flash file name to add to the package
function addFlash(blockId) {
    var filter = [
        { "typename": parent._("Flash Object (.swf)"), "extension": "*.*", "regex": /.*\.swf$/i },
        { "typename": parent._("All Files"), "extension": "*.*", "regex": /.*$/ }
    ];
    addFile(blockId, parent._("Select a file"), filter);
}

function addMp3(blockId) {
    var filter = [
        { "typename": parent._("MP3 Audio (.mp3)"), "extension": "*.*", "regex": /.*\.mp3$/i },
        { "typename": parent._("All Files"), "extension": "*.*", "regex": /.*$/ }
    ];
    addFile(blockId, parent._("Select an mp3 file"), filter);
}

// Called by the user to provide a package name in order to get the user created idevices
// used by idevice editor
function addFile(blockId, title, filter) {
    var fp = parent.Ext.create("eXe.view.filepicker.FilePicker", {
        type: parent.eXe.view.filepicker.FilePicker.modeOpen,
        title: title? title : parent._("Select a package"),
        modal: true,
        scope: this,
        callback: function(fp) {
            if (fp.status == parent.eXe.view.filepicker.FilePicker.returnOk) {
		        var path  = document.getElementById('path'+blockId);
                path.type  = 'text';
		        path.value = fp.file.path;
            }
        }
    });
    fp.appendFilters( filter? filter : [{ "typename": parent._("All Files"), "extension": "*.*", "regex": /.*$/ }]);
    parent.window.focus();
    fp.show();
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
    parent.Ext.Msg.confirm("", message, function(button) {
        if (button == "yes")
	        submitLink(action, object, changed);
    });
}
