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

// An array of js strings to evaluate on document load
// $exeAuthoring.countBase64 and $exeAuthoring.compareBase64 will not be used if exe_editor_version == 4
var Ext = parent.Ext;
var eXe = parent.eXe;
var onLoadHandlers = [clearHidden, setWmodeToFlash, loadAuthoringPluginObjects, 
	enableAnchors, httpsInNewWindow, gotoAnchor, preventEscKey, preventHistoryBack,
    loadKeymap, hideObjectTags, createLeftPanelToggler, createEmptyPageInstructions, checkIdevicesVisibility];
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
    if (multiple)
        mode = parent.eXe.view.filepicker.FilePicker.modeOpenMultiple;
    else
        mode = parent.eXe.view.filepicker.FilePicker.modeOpen;
    fp = parent.Ext.create("eXe.view.filepicker.FilePicker", {
        type: mode,
        title: multiple? parent._("Select one or more images") : parent._("Select an image"),
        modal: true,
        scope: this,
        callback: function(fp) {
            if (fp.status == parent.eXe.view.filepicker.FilePicker.returnOk) {
                if (multiple) {
		            var result = new String("");
                    for (f in fp.files) {
		                if (result != "") {
		                    result += "&";
		                }
		                result += escape(fp.files[f].path);
		            }
		            fn(result);
		        } else {
                    fn(fp.file.path);
                }
            }
            else
                fn("");
        }
    });
    fp.appendFilters([
        filter
        ? filter
        : { "typename": parent._("Image Files (.jpg, .jpeg, .png, .gif, .svg)"), "extension": "*.png", "regex": /.*\.(jpg|jpeg|png|gif|svg)$/i },
          { "typename": parent._("All Files"), "extension": "*.*", "regex": /.*$/ }
    ]);
    parent.window.focus();
    fp.show();
}

// Asks the user for a media file, returns the path or an empty string
function askUserForMedia(fn,win) {
    var fp = parent.Ext.create("eXe.view.filepicker.FilePicker", {
        type: parent.eXe.view.filepicker.FilePicker.modeOpen,
        title: parent._("Select a file"),
        modal: true,
        scope: this,
        callback: function(fp) {
			if (fp.status == parent.eXe.view.filepicker.FilePicker.returnOk) {
				fn(fp.file.path);
				if (typeof(win)!="undefined") {
					if (exe_editor_version==3) win.document.forms[0].elements['href'].onchange();
				}
			} else {
				fn("");
			}
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
    
        // unescape, to remove the %20's for spaces, etc.:
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
        var formField = win.document.getElementById(field_name);
        
        formField.value = ""; 
    
        // PreviewImage is only available for images:
        if (type == "image") {
           win.showPreviewImage(" ");
        }
        else if (type == "media") {
           win.generatePreview(" ");
        }
    
    
        // set the tinyMCE image filename field:
        formField.value = full_previewImage_url;
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
    var formField = win.document.getElementById(field_name);
    formField.value = ""; 
    // PreviewImage is only available for images:
    if (type == "image") {
       win.showPreviewImage(" ");
    }
    // the above two commands are the only way to really 
    // ensure that we can trigger the onchange event below:

    // set the tinyMCE image filename field:
    formField.value = full_preview_url;
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

    theForm = document.getElementById('contentForm');
    if (!theForm) {
        if (top["authoringIFrame1-frame"] && top["authoringIFrame1-frame"].document)
            theForm = top["authoringIFrame1-frame"].document.getElementById('contentForm');
    }
    if (!theForm) {
        if (document.getElementsByName('authoringIFrame1-frame')[0] && document.getElementsByName('authoringIFrame1-frame')[0].contentDocument)
            theForm = document.getElementsByName('authoringIFrame')[0].contentDocument.getElementById('contentForm');
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
function execute_submitLink(action, object, changed, currentNode) 
{
    var theForm = getContentForm();

    if (theForm) {
	    theForm.action.value    = action;
	    theForm.object.value    = object;
	    theForm.isChanged.value = changed;
        if (currentNode)
            theForm.currentNode.value = currentNode;
        theForm.clientHandleId.value = top.nevow_clientHandleId;
	    runFuncArray(beforeSubmitHandlers)
	
	    theForm.submit();
    }
}
function submitLink(action, object, changed, currentNode) 
{
    var ed = "";
    if (typeof(tinyMCE)!='undefined' && tinyMCE.activeEditor) ed = tinyMCE.activeEditor;
    if (ed!="" && ed.id=="mce_fullscreen") {
        ed.execCommand('mceFullScreen');
        setTimeout(function(){
            execute_submitLink(action, object, changed, currentNode); 
        },500);
    } else {
        execute_submitLink(action, object, changed, currentNode);
    }
}

//change applet type on appletblock
function submitChange(action, selectId) 
{
    var theForm = getContentForm();

    if (theForm) {
        theForm.action.value    = action;
        var select = document.getElementById(selectId) 
        theForm.object.value    = select.value;
        theForm.isChanged.value = 1;
        theForm.clientHandleId.value = top.nevow_clientHandleId;
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

//List to track problematic browser plugins with no zindex support on authoring page
authoringPluginObjects = [];

//Activate zindex support on flash plugin objects on authoring page
//http://helpx.adobe.com/flash/kb/flash-object-embed-tag-attributes.html#main_Browser_support_for_Window_Mode__wmode__values/fplayer10.1_hardware_acceleration_04.html
function setWmodeToFlash() {
    var flashobjects = parent.Ext.DomQuery.select('object[type=application/x-shockwave-flash]', document);
    for (i in flashobjects) {
        parent.Ext.DomHelper.append(flashobjects[i], { tag: "param",  name: "wmode", value: "opaque" });
    }
}

//Load the list of problematic browser plugins tags
//Java applets not suports zindex: http://bugs.sun.com/bugdatabase/view_bug.do?bug_id=4858528
function loadAuthoringPluginObjects() {
    authoringPluginObjects = authoringPluginObjects.concat(parent.Ext.DomQuery.select('object[type!=application/x-shockwave-flash]', document));
    authoringPluginObjects = authoringPluginObjects.concat(parent.Ext.DomQuery.select('applet', document));
}

function hideObjectTags() {
	if (Ext.WindowManager.getActive()) {
	    for (var i=0; i < authoringPluginObjects.length; i++)
	        authoringPluginObjects[i].style.visibility = "hidden";
	}
}

function showObjectTags() {
    for (var i=0; i < authoringPluginObjects.length; i++)
        authoringPluginObjects[i].style.visibility = "visible";
}

function enableAnchors() {
	var exenodes = parent.Ext.DomQuery.select('a[href^=exe-node]', document);

	for (var i=0; i < exenodes.length; i++)
        exenodes[i].onclick = function() {
            var outline = parent.eXe.app.getController('Outline'),
                outline_tree = outline.getOutlineTreePanel(),
                node_anchor = this.href.split("#"),
                path = node_anchor[0].replace(/exe-node/, ':Root'),
                selected;
            outline_tree.selectPath(decodeURIComponent(path), 'text', ':');
            selected = outline_tree.getSelectionModel().getSelection()[0];
            outline.onNodeClick(null, selected);
            if (node_anchor[1] != "auto_top")
                outline.hash = node_anchor[1];
            return false;
        };
}

function httpsInNewWindow() {
	var links = parent.Ext.DomQuery.select('a[href^=https]', document);

	for (var i=0; i < links.length; i++) {
        if (!links[i].getAttribute('target')) {
            links[i].setAttribute('target', '_blank');
        }
    }
}

function gotoAnchor() {
    if (typeof(parent.eXe)!='undefined' && typeof(parent.eXe.app)!='undefined') {
        var outline = parent.eXe.app.getController('Outline');

        if (outline.hash) {
            location.hash = outline.hash;
            outline.hash = null;
        }
    }
}

function preventEscKey() {
        if (parent.Ext.isGecko || parent.Ext.isSafari)
            window.addEventListener('keydown', function(e) {(e.keyCode == 27 && e.preventDefault())});
}

function preventHistoryBack() {
	for (var i=0; i<=20; i++)
    	History.pushState(null, null, '?state=' + i);
}

function loadKeymap() {
	var toolbar = eXe.app.getController('Toolbar'),
	    authoring = Ext.ComponentQuery.query('#authoring')[0],
	    keymap = new Ext.util.KeyMap(authoring.getBody(), toolbar.keymap_config);
}
/* *********************************** */
/* WYSIWYG Editor and common settings */
/* ********************************* */

// Common settings
// Default editor
if (typeof(exe_editor_version)=='undefined') exe_editor_version=4;
var eXeLearning_settings = {
	wysiwyg_version : false, // Set to true to allow other versions
	wysiwyg_path : "/scripts/tinymce_4/js/tinymce/tinymce.min.js",
	wysiwyg_settings_path : "/scripts/tinymce_4_settings.js"
}
if (eXeLearning_settings.wysiwyg_version && exe_editor_version==3) {
	eXeLearning_settings = {
		wysiwyg_path : "/scripts/tinymce_3.5.11/jscripts/tiny_mce/tiny_mce.js",
		wysiwyg_settings_path : "/scripts/tinymce_3.5.11_settings.js"
	}
}
if (eXeLearning_settings.wysiwyg_version == false) exe_editor_version = 4;

// browse the specified URL in system browser
function browseURL(e,elm) {
    /* Links with rel="lightbox" */
    if (
        (typeof(e)=='object' && typeof(e.rel)=='string' && e.rel.indexOf('lightbox')==0) || 
        (elm && typeof(elm.rel)=='string' && elm.rel.indexOf('lightbox')==0)
    ) {
        return false;
    }
    // window.parent.nevow_clientToServerEvent('browseURL', this, '', e);
    window.open(e);
}

//TinyMCE
function getTinyMCELang(lang){
    if (lang=="ca@valencia") lang = "ca";
	var defaultLang = "en";
	for (var i=0;i<tinyMCE_languages.length;i++) {
		if (tinyMCE_languages[i]===lang) defaultLang = lang;
	}
	return defaultLang;
}

//TinyMCE file_browser_callback
var exe_tinymce = {
	
	dragDropImage : function(theTarget, node, evalAfterDone, win, win_name,
			blobName, blobBase64) {
		var local_imagePath = 'data:image/jpeg;base64,' + blobBase64;

		var unescaped_local_imagePath = unescape(local_imagePath);
		var oldImageStr = new String(blobName);

		exe_tinymce.uploaded_file_1_name = "";

		var RegExp1 = /[\ \\\/\:\%\&]/g;
		var ReplaceStr1 = new String("_");
		var newImageStr = oldImageStr.replace(RegExp1, ReplaceStr1);

		var early_preview_imageName = encodeURIComponent(newImageStr);
		var preview_imageName = early_preview_imageName.replace(RegExp1,
				ReplaceStr1);
		var full_previewImage_url = "/previews/" + preview_imageName;

		var previewTinyMCEDragDropImageDone = function() {

			var alternativeText = function(button, input_alt_value) {

				var editor = tinyMCE.activeEditor.getBody();
				var imgs = editor.getElementsByTagName("IMG");

				var n = imgs.length - 1;

				var img = imgs[n];
				img.setAttribute('width', img.width);
				img.setAttribute('height', img.height);

				if (input_alt_value.length == 0) {

					parent.Ext.Msg
							.confirm(
									"",
									_("Are you sure you want to continue without including an Image Description? Without it the image may not be accessible to some users with disabilities, or to those using a text browser, or browsing the Web with images turned off."),
									function(button) {
										if (button == "yes") {
											img.setAttribute('alt', '');
										} else {
											Ext.Msg
													.prompt(
															_('Image description'),
															_('Please provide an image description (alternative text):'),
															alternativeText);
										}
									});
				} else {

					if (button === 'ok') {
						img.setAttribute('alt', input_alt_value);
					} else {
						img.setAttribute('alt', '');
					}
				}
			}

			Ext.Msg
					.prompt(
							_('Image description'),
							_('Please provide an image description (alternative text):'),
							alternativeText);

			eXe.app.un('previewTinyMCEDragDropImageDone',
					previewTinyMCEDragDropImageDone);
		}
		eXe.app.on('previewTinyMCEDragDropImageDone',
				previewTinyMCEDragDropImageDone);

		window.parent.nevow_clientToServerEventPOST(theTarget, node,
				evalAfterDone, false, win, win_name, unescaped_local_imagePath,
				preview_imageName);

		return (full_previewImage_url);
	},
		
	chooseImage : function(field_name, url, type, win) {
		
		var fn = function(local_imagePath) {
            win.focus();

            // if the user hits CANCEL, then bail "immediately",
            // i.e., after bringing the tinyMCE image dialog back into focus, above.
            if (local_imagePath == "") {
                return;
            }

            // unescape, to remove the %20's for spaces, etc.:
            var unescaped_local_imagePath = unescape(local_imagePath);
            var oldImageStr = new String(unescaped_local_imagePath);

            /* HTML 5 */
            exe_tinymce.uploaded_file_1_name = "";

            var last_uploaded_file_path = unescaped_local_imagePath.split("\\");
            var last_uploaded_file_name = last_uploaded_file_path[last_uploaded_file_path.length - 1];
            /* Main file */
            if (field_name == "src") {
                exe_tinymce.uploaded_file_1_name = last_uploaded_file_name;
            }
            /* /HTML5 */

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
            var preview_imageName = early_preview_imageName.replace(RegExp1, ReplaceStr1);
            var full_previewImage_url = "/previews/" + preview_imageName;

            var previewTinyMCEImageDone = function() {
                // first, clear out any old value in the tinyMCE image filename field:
                var formField = win.document.getElementById(field_name);
                formField.value = "";

                // set the tinyMCE image filename field:
                formField.value = full_previewImage_url;
                // then force its onchange event:
                $(formField).trigger("change");

                // PreviewImage is only available for images:
                if (type == "image") {					
					if (exe_editor_version==3) {
						if (typeof(win.ImageDialog)!='undefined') win.ImageDialog.showPreviewImage(full_previewImage_url);
					} else {
						formField.value = full_previewImage_url;
						// Set the image dimensions
						var img = new Image() ;
						img.src = full_previewImage_url;
						img.onload = function() {
							// We know field_name, but not the IDs of the fields to set the dimensions 
							var fieldOrder = field_name;
							fieldOrder = fieldOrder.split("-")[0];
							fieldOrder = fieldOrder.split("_");
							if (fieldOrder.length==2) {
								fieldOrder = Number(fieldOrder[1]);
								$("#mceu_"+(fieldOrder+3)).val(img.width);
								$("#mceu_"+(fieldOrder+5)).val(img.height);
								exe_tinymce.current_image_size = [ img.width, img.height ];
							}
						}
					}
                }
                else if (type == "media") {
					if (exe_editor_version==3) win.window.Media.preview();
					else formField.value = full_previewImage_url;
                }

                // this onchange works, but it's dirty because it is hardcoding the
                // onChange=".." event of that field, and if that were to ever change
                // in tinyMCE, then this would be out of sync.

                // and finally, be sure to update the tinyMCE window's image data:
                if (exe_editor_version==3) {
					if (win.getImageData) {
						win.getImageData();
					} else {
						if (window.tinyMCE.getImageData) {
							window.tinyMCE.getImageData();
						}
					}
                } else {
                    // See exeimage/plugin.min.js
                    if (type == "image" && typeof(exeImageDialog)!="undefined") {
                        try {
                            exeImageDialog.updateImageDimensions(full_previewImage_url);
                        } catch(e) {
                            
                        }
                    }
                }

                eXe.app.un('previewTinyMCEImageDone', previewTinyMCEImageDone);
            };

            eXe.app.on({
                'previewTinyMCEImageDone': previewTinyMCEImageDone
            });

            // pass the file information on to the server,
            // to copy it into the server's "previews" directory:
            window.parent.nevow_clientToServerEvent('previewTinyMCEimage', this, '', win, win.name, field_name, unescaped_local_imagePath, preview_imageName)
        }
		// ask user for image or media, depending on type requested:
		if (type == "image") {
		   askUserForImage(false, fn);
		} else if (type == "media") {
		   askUserForMedia(fn);
		} else if (type == "file") {
		   // new for advlink plugin, to link ANY resource into text:
		   // re-use the Media browser, which defaults to All file types (*.*)
		   askUserForMedia(fn,win);
		} else if (type == "image2insert" || type == "media2insert" || type == "file2insert") {
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
	}//chooseImage
	
}

var $exeAuthoring = {
	countBase64 : function(ed){
		var c = ed.getBody();
		var n = 0;
		var imgs = c.getElementsByTagName("IMG");
		for (x=0;x<imgs.length;x++) {
			if (imgs[x].src.indexOf("data:")==0) {
				n += 1;
			}
		}
		if (typeof(ed.base64originalImages)=='undefined') {
			ed.base64originalImages = n;
			ed.base64Warning = false; // To avoid too many alerts (no new alerts for 2 seconds)
		}
		return n;
	},
	compareBase64 : function(ed) {
		setTimeout(function(){
			var oN = ed.base64originalImages; // Original base64 images
			var nN = $exeAuthoring.countBase64(ed);	
			if (nN>oN) {
				if (ed.base64Warning==false) {
					ed.base64Warning = true;
					setTimeout(function(){
						ed.base64Warning = false;
					},2000);
					alert(_("Embed images shouldn't be pasted directly into the editor. Please use Insert/Edit Image.")+"\n\n"+_("This change will be undone."));
				}
				ed.undoManager.undo();
			}
		},500);
	},
    errorHandler : function(origin){
        
        // Could not transform LaTeX to image
        if (origin=="handleTinyMCEmath") {
            if (exe_editor_version == 4) PasteMathDialog.preloader.hide();
        }
        
        // Could not transform MathML to image
        else if (origin=="handleTinyMCEmathML") {
            PasteMathDialog.preloader.hide();
        }

    },
    iDevice : {
        init : function() {
            
            var errorMsg = "";
            
            // Check if the object and the required methods are defined
            if (typeof($exeDevice)=='undefined') errorMsg += "$exeDevice";
            else if (typeof($exeDevice.init)=='undefined') errorMsg += "$exeDevice.init";
            else if (typeof($exeDevice.save)=='undefined') errorMsg += "$exeDevice.save";
            
            // Show a message if they are not defined
            if (errorMsg!="") {
                errorMsg = _("IDevice broken") + ": " + errorMsg + " is not defined.";
                eXe.app.alert(errorMsg);
                return;
            }
            
            // Check if the submit image exists (it will unless renderEditButtons changes)
            var myLink = $("#exe-submitButton a").eq(0);
            if (myLink.length!=1) {
                eXe.app.alert(_("Report an Issue")+": $exeAuthoring.iDevice.init (#exe-submitButton)");
                return;
            }

            // Execute $exeDevice.save onclick (to validate)
            var onclick = myLink.attr("onclick");
            myLink[0].onclick = function(){
                var html = $exeDevice.save();
                if (html) {
                    $("textarea.mceEditor, textarea.jsContentEditor").val(html);
                    // Execute the IMG default behavior if everything is OK
                    eval(onclick);
                }                
            }         
            
            // Replace the _ function
			_ = function(str){
				if (typeof($exeDevice.i18n)!="undefined") {
					var lang = $("HTML").attr("lang");
					if (typeof($exeDevice.i18n[lang])!="undefined") {
						return top.translations[str] || $exeDevice.i18n[lang][str] || str;
					}
				}
				return top.translations[str] || str;
			}
			
			// Enable the iDevice
            $exeDevice.init();
            
            // Enable TinyMCE
            if (tinymce.majorVersion==4) $exeTinyMCE.init("multiple-visible",".exe-html-editor");
            else if (tinymce.majorVersion==3) $exeTinyMCE.init("specific_textareas","exe-html-editor");
			
            // Enable the FIELDSETs Toggler
            $(".exe-fieldset legend a").click(function(){
                $(this).parent().parent().toggleClass("exe-fieldset-closed");
                return false;
            });
            
            // Enable the iDevice instructions
            $(".exe-idevice-info").each(function(){
                var e = $(this);
                e.html('<p class="exe-block-info exe-block-dismissible">'+e.html()+' <a href="#" class="exe-block-close" title="'+_("Hide")+'"><span class="sr-av">'+_("Hide")+' </span>×</a></p>');
            });
            
            // Dismissible messages
            $(".exe-block-dismissible .exe-block-close").click(function(){
                $(this).parent().fadeOut();
                return false;
            });

            // Enable color pickers (provisional solution)
            // To review: 100 ms delay because the color picker won't work when combined with $exeTinyMCE.init
            setTimeout(function(){
                $exeAuthoring.iDevice.colorPicker.init();
            },100);
			
            // Enable file uploaders
            $exeAuthoring.iDevice.filePicker.init();
            
        },
        // Gamification
        gamification : {
            common : {
                getFieldsets : function(){
                    return "";
                },
                getLanguageTab : function(fields){
                    var html = "";
                    for (var i in fields) {
                        html += '<p class="ci18n"><label for="ci18n_' + i + '">' + fields[i] + '</label> <input type="text" name="ci18n_' + i + '" id="ci18n_' + i + '" value="' + fields[i] + '" /></p>'
                    }
                    return '\
                    <div class="exe-form-tab" title="' + _('Language settings') + '">\
                        <p>' + _("Custom texts (or use the default ones):") + '</p>\
                        ' + html + '\
                    </div>'
                },
                getGamificationTab : function(){
                    return '\
                    ' + $exeAuthoring.iDevice.gamification.itinerary.getItineraryTab() + '\
                    ' + $exeAuthoring.iDevice.gamification.scorm.getScormTab()+ '\
                    ' + $exeAuthoring.iDevice.gamification.share.getShareTab();
                }
            },
            instructions : {
                getFieldset : function(str){
					return '<fieldset class="exe-fieldset exe-fieldset-closed">\
						<legend><a href="#">' + _("Instructions") + '</a></legend>\
						<div>\
							<p>\
								<label for="eXeGameInstructions" class="sr-av">' + _("Instructions") + ': </label>\
								<textarea id="eXeGameInstructions" class="exe-html-editor"\>' + str + ' </textarea>\
							</p>\
						</div>\
					</fieldset>';
                }
            },
            itinerary : {
                getTab : function(){
                    return '\
                             <div class="exe-form-tab" title="' + _('Itinerary') + '">\
                                <div class="exe-idevice-info">'+_("Use these keys to create an itinerary of challenges: It would not be possible to access a new challenge until you get the key or the solution to a problem. May be necessary to enter a password to access this game. May also show a message or password when reaching a presestablished percentage of hits.")+'</div>\
                                <p align="left">\
                                    <label for="eXeGameShowCodeAccess"><input type="checkbox" id="eXeGameShowCodeAccess" >' +_("Access code is required")+'</label>\
                                </p>\
                                <p style="margin-left:1.4em;margin-bottom:1.5em" >\
                                    <label for="eXeGameCodeAccess" id="labelCodeAccess">'+_("Access code")+':</label>\
                                    <input type="text" name="eXeGameCodeAccess" id="eXeGameCodeAccess"  maxlength="40" disabled />\
                                    <label for="eXeGameMessageCodeAccess" id="labelMessageAccess">'+_("Question")+':</label>\
                                    <input type="text" name="eXeGameMessageCodeAccess" id="eXeGameMessageCodeAccess" maxlength="200"/ disabled> \
                                </p>\
                                <p>\
                                    <label for="eXeGameShowClue"><input type="checkbox" id="eXeGameShowClue" >'+_("Show a message or password")+'</label>\
                                </p>\
                                <div style="margin-left:1.4em;margin-bottom:1.5em">\
                                    <p>\
                                        <label for="eXeGameClue">'+_("Message")+':</label>\
                                        <input type="text" name="eXeGameClue" id="eXeGameClue"  maxlength="50" disabled>\
                                    </p>\
                                    <p>\
                                        <label for="eXeGamePercentajeClue" id="labelPercentajeClue">'+_("Percentage of hits needed to display the message")+':</label>\
                                        <select id="eXeGamePercentajeClue" disabled>\
                                            <option value="10">10%</option>\
                                            <option value="20">20%</option>\
                                            <option value="30">30%</option>\
                                            <option value="40" selected>40%</option>\
                                            <option value="50">50%</option>\
                                            <option value="60">60%</option>\
                                            <option value="70">70%</option>\
                                            <option value="80">80%</option>\
                                            <option value="90">90%</option>\
                                            <option value="100">100%</option>\
                                        </select>\
                                    </p>\
                                </div>\
                            </div>';
                },
                getValues : function(){
                    var showClue = $('#eXeGameShowClue').is(':checked'),
                        clueGame = $.trim($('#eXeGameClue').val()),
                        percentageClue = parseInt($('#eXeGamePercentajeClue').children("option:selected").val()),
                        showCodeAccess = $('#eXeGameShowCodeAccess').is(':checked'),
                        codeAccess = $.trim($('#eXeGameCodeAccess').val()),
                        messageCodeAccess = $.trim($('#eXeGameMessageCodeAccess').val());

                    if (showClue && clueGame.length == 0) {
                        eXe.app.alert(_("You must write a clue"));
                        return false;
                    }
                    if (showCodeAccess && codeAccess.length == 0) {
                        eXe.app.alert( _("You must provide the code to play this game"));
                        return false;
                    }
                    if (showCodeAccess && messageCodeAccess.length == 0) {
                        eXe.app.alert(_("You must provide how to obtain the code to play this game"));
                        return false;
                    }
                    var a={
                        'showClue': showClue,
                        'clueGame': clueGame,
                        'percentageClue':percentageClue,
                        'showCodeAccess':showCodeAccess,
                        'codeAccess':codeAccess,
                        'messageCodeAccess' :messageCodeAccess
                    }
                   return a;
                },
                setValues : function(a){
                    $('#eXeGameShowClue').prop('checked', a.showClue);
                    $('#eXeGameClue').val(a.clueGame);
                    $('#eXeGamePercentajeClue').val(a.percentageClue);
                    $('#eXeGameShowCodeAccess').prop('checked', a.showCodeAccess);
                    $('#eXeGameCodeAccess').val(a.codeAccess);
                    $('#eXeGameMessageCodeAccess').val(a.messageCodeAccess);
                    $('#eXeGameClue').prop('disabled', !a.showClue);
                    $('#eXeGamePercentajeClue').prop('disabled', !a.showClue);
                    $('#eXeGameCodeAccess').prop('disabled', !a.showCodeAccess);
                    $('#eXeGameMessageCodeAccess').prop('disabled', !a.showCodeAccess);
                },
                addEvents:function(){
                    $('#eXeGameShowClue').on('change', function () {
                        var mark = $(this).is(':checked');
                        $('#eXeGameClue').prop('disabled', !mark);
                        $('#eXeGamePercentajeClue').prop('disabled', !mark);
                    });
                    $('#eXeGameShowCodeAccess').on('change', function () {
                        var mark = $(this).is(':checked');
                        $('#eXeGameCodeAccess').prop('disabled', !mark);
                        $('#eXeGameMessageCodeAccess').prop('disabled', !mark);
                    });
                }
            },
            scorm : {
                init: function(){
                    $exeAuthoring.iDevice.gamification.scorm.setValues(0,_("Save score"),false)
                    $exeAuthoring.iDevice.gamification.scorm.addEvents();
                },
                getTab : function(){
                    return '\
                                <div class="exe-form-tab" title="' + _('SCORM') + '">\
                                    <p id="eXeGameSCORMNoSave">\
                                        <label for="eXeGameSCORMNoSave"><input type="radio" name="eXeGameSCORM" id="eXeGameSCORMNoSave"  value="0"  checked /> ' + _("Do not save the score") + '</label>\
                                    </p>\
                                    <p id="eXeGameSCORMAutomatically">\
                                        <label for="eXeGameSCORMAutoSave"><input type="radio" name="eXeGameSCORM" id="eXeGameSCORMAutoSave" value="1"  /> ' + _("Automatically save the score") + '</label>\
                                    </p>\
                                    <p id="eXeGameSCORMblock">\
                                    <label for="eXeGameSCORMButtonSave"><input type="radio" name="eXeGameSCORM" id="eXeGameSCORMButtonSave" value="2" /> ' + _("Show a button to save the score") + '</label>\
                                    <span id="eXeGameSCORMoptions">\
                                        <label for="eXeGameSCORMbuttonText">' + _("Button text") + ': </label>\
                                        <input type="text" max="100" name="eXeGameSCORMbuttonText" id="eXeGameSCORMbuttonText" value="' + _("Save score") + '" /> \
                                        <label for="eXeGameSCORMRepeatActivity"><input type="checkbox" id="eXeGameSCORMRepeatActivity" checked /> ' + _("Repeat activity") + '</label>\
                                    </span>\
                                    </p>\
                                    <div id="eXeGameSCORMinstructionsAuto">\
                                        <ul>\
                                            <li>' + _("This will only work when exporting as SCORM and while editing in eXeLearning.") + '</li>\
                                            <li>' + _("The score will be automatically saved after answering each question and at the end of the game.") + '</li>\
                                            <li>' + _("Include only one game with score in the page (or it won't work).") + '</li>\
                                            <li>' + _('Do not include a "SCORM Quiz" iDevice in the same page.') + '</li>\
                                        </ul>\
                                    </div>\
                                    <div id="eXeGameSCORMinstructionsButton">\
                                        <ul>\
                                            <li>' + _("The button will only be displayed when exporting as SCORM and while editing in eXeLearning.") + '</li>\
                                            <li>' + _('Include only one activity with a "Save score" button in the page.') + '</li>\
                                            <li>' + _("Include only one game with score in the page (or it won't work).") + '</li>\
                                            <li>' + _('Do not include a "SCORM Quiz" iDevice in the same page.') + '</li>\
                                        </ul>\
                                    </div>\
                               </div>'
                },
                setValues: function(isScorm,textButtonScorm,repeatActivity,){
                    $("#eXeGameSCORMoptions").css("visibility", "hidden");
                    $("#eXeGameSCORMinstructionsButton").hide();
                    $("#eXeGameSCORMinstructionsAuto").hide();
                    if (isScorm == 0) {
                        $('#eXeGameSCORMNoSave').prop('checked', true);
                    } else if (isScorm == 1) {
                        $('#eXeGameSCORMAutoSave').prop('checked', true);
                        $('#eXeGameSCORMinstructionsAuto').show();
                    }else if (isScorm == 2) {
                        $('#eXeGameSCORMButtonSave').prop('checked', true);
                        $('#eXeGameSCORMbuttonText').val(textButtonScorm);
                        $('#eXeGameSCORMoptions').css("visibility", "visible");
                        $('#eXeGameSCORMinstructionsButton').show();
                        $('#eXeGameSCORMRepeatActivity').prop("checked", repeatActivity);
                    }
                },
                getValues: function(){
                    var isScorm = parseInt($("input[type=radio][name='eXeGameSCORM']:checked").val()),
                    textButtonScorm=$("#eXeGameSCORMbuttonText").val(),
                    repeatActivity=false;
		            if (isScorm == 2) {
                        repeatActivity=$('#eXeGameSCORMRepeatActivity').is(':checked');
                    }
                    var a={
                        'isScorm': isScorm,
                        'textButtonScorm': textButtonScorm,
                        'repeatActivity':repeatActivity
                        }
                   return a;
                },
                addEvents: function(){
                    $('input[type=radio][name="eXeGameSCORM"]').on('change', function () {
                        $("#eXeGameSCORMoptions,#eXeGameSCORMinstructionsButton,#eXeGameSCORMinstructionsAuto").hide();
                        switch ($(this).val()) {
                            case '0':
                                break;
                            case '1':
                                $("#eXeGameSCORMinstructionsAuto").hide().css({
                                    opacity: 0,
                                    visibility: "visible"
                                }).show().animate({
                                    opacity: 1
                                }, 500);
                                break;
                            case '2':
                                $("#eXeGameSCORMoptions,#eXeGameSCORMinstructionsButton").hide().css({
                                    opacity: 0,
                                    visibility: "visible"
                                }).show().animate({
                                    opacity: 1
                                }, 500);
                                break;
                        }
                    });
                }
            },
            share : {
                getTab : function(){
                    var msg = _("You can export this game so you can later use it in an iDevice of the same type. You can also use it in %s and you can import games from %s and use then here.");
                        msg = msg.replace(/%s/g, '<a href="https://quext.educarex.es/" target="_blank" rel="noopener noreferrer">QuExt</a>');
                    var html = '\
                            <div class="exe-form-tab" title="' + _('Share') + '">\
                                <div class="exe-idevice-info">' + msg + '</div>\
                                <div id="eXeGameExportImport">\
                                    <p>\
                                        <form method="POST">\
                                            <label for="eXeGameImportGame">' + _("Import") + ': </label>\
                                            <input type="file" name="eXeGameImportGame" id="eXeGameImportGame" accept=".json" />\
                                            <span class="exe-field-instructions">' + _("Supported formats") + ': JSON</span>\
                                        </form>\
                                    </p>\
                                    <p>\
                                        <input type="button" name="eXeGameExportGame" id="eXeGameExportGame" value="' + _("Export") + '" />\
                                    </p>\
                                </div>\
                            </div>'
                    return html;
                }
            }
        },
        filePicker : {
            init : function(){
                $(".exe-file-picker,.exe-image-picker").each(
                    function(){
                        var id = this.id;
                        var css = 'exe-pick-any-file';
                        var e = $(this);
                        if (e.hasClass("exe-image-picker")) css = 'exe-pick-image';
                        e.after(' <input type="button" class="'+css+'" value="'+_("Select a file")+'" id="_browseFor'+id+'" onclick="$exeAuthoring.iDevice.filePicker.openFilePicker(this)" />');
                    }
                );
            },
            openFilePicker : function(e){
                var id = e.id.replace("_browseFor","");
                var type = 'media';
                if ($(e).hasClass("exe-pick-image")) type = 'image';
                try {
                    exe_tinymce.chooseImage(id, "", type, window);
                } catch(e) {
                    eXe.app.alert(e);
                }
            }
        },
        // Save the iDevice
        save : function() {
            // Check if the object and the required methods are defined
            if (typeof($exeDevice) != 'undefined' && typeof($exeDevice.init) != 'undefined' && typeof($exeDevice.save) == 'function') {
                // Trigger the click event so the form is submitted
                $("#exe-submitButton a").trigger("click");
            }
        },
        // iDevice tabs
        tabs : {
            init : function(id){
                var tabs = $("#" + id + " .exe-form-tab");
                var list = '';
                var tabId;
                var e;
                var txt;
                tabs.each(function (i) {
                    var klass = "exe-form-active-tab";
                    tabId = id + "Tab" + i;
                    e = $(this);
                    e.attr("id", tabId);
                    txt = e.attr("title");
                    if (txt == '') txt = (i + 1);
                    if (i > 0) {
                        e.hide();
                        klass = "";
                    }
                    list += '<li><a href="#' + tabId + '" class="' + klass + '">' + txt + '</a></li>';
                });
                if (list != "") {
                    list = '<ul id="' + id + 'Tabs" class="exe-form-tabs exe-advanced">' + list + '</ul>';
                    tabs.eq(0).before(list);
                    var as = $("#" + id + "Tabs a");
                    as.click(function () {
                        as.attr("class", "");
                        $(this).addClass("exe-form-active-tab");
                        tabs.hide();
                        $($(this).attr("href")).show();
                        return false;
                    });
                }                
            },
            restart : function(){
                $("#activeIdevice .exe-form-tabs a").eq(0).trigger("click");
            }
        },
        colorPicker : {
            init : function(){
                var colorFields = $(".exe-color-picker");
                if (colorFields.length>0) {
                    $exeAuthoring.iDevice.colorPicker.fields = colorFields;
                    $exe.loadScript("/tools/color-picker/js/jpicker-1.1.6.min.js","$exeAuthoring.iDevice.colorPicker.getCSS()");
                }
            },
            getCSS : function(){
                $exe.loadScript("/tools/color-picker/css/jpicker.css","$exeAuthoring.iDevice.colorPicker.getStrings()");
            },
            getStrings : function(){
                $exe.loadScript("/tools/color-picker/langs/all.js","$exeAuthoring.iDevice.colorPicker.enable()");
            },
            enable : function(){
                $.fn.jPicker.defaults.images.clientPath='/tools/color-picker/images/';	
                $exeAuthoring.iDevice.colorPicker.fields.jPicker(
                    {
                        window:{
                            title: $Color_Picker_i18n.Color_Picker,
                            effects:{
                                type:'show',
                                speed:{
                                    show : 0,
                                    hide : 0
                                }
                            }
                        },
                        localization : $Color_Picker_i18n.Color_Picker_Strings
                    },
                    function(color, context){
                        // Save color
                        $("body").removeClass("with-color-picker");
                        $("div.jPicker").hide();
                    },
                    function(color, context){
                        // Live callback
                    },
                    function(color, context){
                        // Cancel button clicked
                        $("body").removeClass("with-color-picker");
                    }			
                );
                $(".jPicker .Icon").click(function(){
                    // Add a CSS class to the BODY so the picker is always visible
                    $("body").addClass("with-color-picker");
                    // Color picker position
                    $(".jPicker.Container").css("top",$(document).scrollTop()+"px");
                });
            }
        }
    },
    // Some iDevices (like Cloze Activity) have a button to select (underline) words
    toggleWordInEditor : function(id){
        if (exe_editor_version==3) tinyMCE.execInstanceCommand(id, 'Underline', false);
        else tinyMCE.activeEditor.getDoc().execCommand('Underline', false, false);
    },    
    changeFlowPlayerPathInIE : function(){
        var objs = document.getElementsByTagName("OBJECT");
        var i = objs.length;
        while (i--) {
            if(objs[i].type=="application/x-shockwave-flash" && objs[i].data.indexOf("/flowPlayer.swf")!=-1) {
                objs[i].style.display="none";
                var h = objs[i].height;
                var w = objs[i].width;
                var s = objs[i].data;
                var e = document.createElement("DIV");
                var o = objs[i].innerHTML;
                o = o.replace("'playlist': [ { 'url': 'resources/","'playlist': [ {'url':'http://"+window.location.host+"/"+exe_package_name+"/resources/");
                e.innerHTML = '<object data="'+s+'" width="'+w+'"height="'+h+'">'+o+'</object>';
                objs[i].parentNode.insertBefore(e,objs[i]);                                
            }
        }        
    },
    setYoutubeWmode : function(){
        var v = document.getElementsByTagName("IFRAME");
        for (i=0;i<v.length;i++) {
            var s = v[i].src;
            if (s.indexOf("http://www.youtube.com")==0 && s.indexOf("wmode=")==-1) {
                var c = "?";
                if (s.indexOf("?")!=-1) c = "&";
                s += c+"wmode=transparent";
                v[i].src = s;
            }
        }
    },
    disableSVGInMediaElement : function(){
        $(document.body).addClass("no-svg");
    },
    IE11hacks : function(){
        var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
        if (isIE11) {
            $("object").each(function(){
                var i = this.innerHTML;
                if (i.indexOf("<param")!=-1 && i.indexOf("exe_flv")!=-1 && i.indexOf("wmode")==-1) {
                    // Add wmode transparent and reload the HTML
                    var par = $(this).parent();
                    if (par.length==1) {
                        this.innerHTML += '<param name="wmode" value="transparent">';
                        par.html(par.html());
                    }
                }
            });				
        }
    },
    ready : function(){
        if (top.Ext) {
            $exeAuthoring.disableSVGInMediaElement();
            $exeAuthoring.setYoutubeWmode();
            // To review (see https://github.com/exelearning/iteexe/issues/127)
            $exeAuthoring.IE11hacks();
            if (top.Ext.isIE) {
                $exeAuthoring.changeFlowPlayerPathInIE();
            }
            eXe.app.fireEvent('authoringLoaded');
			// Links to the elp file won't work before exporting
			$("a[href='exe-package:elp']").click(function(){
				eXe.app.alert(_('Go to Tools - Preview to see this working'));
				return false;
			});
        }
    }
}
// Access from the top window so it's easier to call some methods (like errorHandler)
top.$exeAuthoring = $exeAuthoring;
//new functions from common.js
function magnifierImageChanged(event) {
    var id = event.currentTarget.getAttribute('id');
    var elementId = id.substring(3, id.length);
    var image  = document.getElementById('img'+elementId);
    var width  = document.getElementById('width'+elementId);
    var height = document.getElementById('height'+elementId);
	    image.removeAttribute('height');
		image.removeAttribute('width');
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
    } else if (image.hasAttribute('src')) {
        image.removeAttribute('width');
        width.value = image.width;
    } else {
        width.value = "";
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
    } else if (image.hasAttribute('src')) {
        image.removeAttribute('height');
        height.value = image.height;
    } else {
        height.value = "";
    }
    width.value  = image.width;
}
function changeMagnifierImageWidth(elementId) {
    var image  = document.getElementById('img'+elementId);
    var width  = document.getElementById('width'+elementId);
    var height = document.getElementById('height'+elementId);
    image.removeAttribute('height');
    if (width.value) {
        image.width  = width.value;
    } else {
        image.removeAttribute('width');
    }
    
}
function changeMagnifierImageHeight(elementId) {
    var image  = document.getElementById('img'+elementId);
    var width  = document.getElementById('width'+elementId);
    var height = document.getElementById('height'+elementId);
    image.removeAttribute('width');
    if (height.value) {
        image.height = height.value;
    } else {
        image.removeAttribute('height');
    }
    
}

/* Draggable instructions */
function showMessageBox(id) {
	Ext.MessageBox.show({
		title: document.getElementById(id+"title").innerHTML,
		msg: document.getElementById(id+"content").innerHTML,
		buttons: Ext.MessageBox.OK,
		icon: 'info',
        modal: false
	});
}

function selectStyleIcon(icon, e, iconSrc, idiDevice) {
	var div = document.getElementById("styleIcons");
	var imgs = div.getElementsByTagName("IMG");
	for (var i = 0; i < imgs.length; i++) {
		imgs[i].style.border = "1px solid #E8E8E8";
	}
	e.style.border = "1px solid #333333";

	var fieldIcon = '#iconiDevice' + idiDevice;

	$("#activeIdevice #iconiDevice").attr("src", iconSrc);
	$(fieldIcon).val(icon);

	var deleteIcon = '#deleteIcon' + idiDevice;
	$(deleteIcon).show();

}


function deleteIcon(idiDevice) {
    var fieldIcon = '#iconiDevice'+idiDevice;
    $("#activeIdevice #iconiDevice").attr("src", '/images/empty.gif');
    $(fieldIcon).val('');
    
    var deleteIcon = '#deleteIcon'+idiDevice;
    $(deleteIcon).hide();
}

function createLeftPanelToggler(){
    eXe.app.createLeftPanelToggler(true);
}

function createEmptyPageInstructions(){
	eXe.app.createEmptyPageInstructions();	
}

function checkIdevicesVisibility(){
	eXe.app.checkIdevicesVisibility();	
}