/* Functions for the advimage plugin popup */

var preloadImg = null;
var orgImageWidth, orgImageHeight;

function preinit() {
	// Initialize
	tinyMCE.setWindowArg('mce_windowresize', false);

	// Import external list url javascript
	var url = tinyMCE.getParam("external_image_list_url");
	if (url != null) {
		// Fix relative
		if (url.charAt(0) != '/' && url.indexOf('://') == -1)
			url = tinyMCE.documentBasePath + "/" + url;

		document.write('<sc'+'ript language="javascript" type="text/javascript" src="' + url + '"></sc'+'ript>');
	}
}

function convertURL(url, node, on_save) {
	return eval("tinyMCEPopup.windowOpener." + tinyMCE.settings['urlconverter_callback'] + "(url, node, on_save);");
}

function getImageSrc(str) {
	var pos = -1;

	if (!str)
		return "";

	if ((pos = str.indexOf('this.src=')) != -1) {
		var src = str.substring(pos + 10);

		src = src.substring(0, src.indexOf('\''));

		if (tinyMCE.getParam('convert_urls'))
			src = convertURL(src, null, true);

		return src;
	}

	return "";
}


// setup the math browser callback:
function getMathBrowserHTML(id, source_form_element, font_size_element, target_form_element, type, prefix) {
        var option = prefix + "_" + type + "_browser_callback";
        var cb = tinyMCE.getParam(option, tinyMCE.getParam("file_browser_callback"));
        if (cb == null)
                return "";

        var html = "";

	html += '<CENTER>&nbsp;';
	html += '<BUTTON type=\"button\" name=\"PREVIEW\"';
        html += 'onclick="javascript:openBrower3(\'' + id + '\',\'' + source_form_element + '\',\'' + font_size_element + '\',\'' + target_form_element + '\', \'' + type + '\',\'' + option + '\');" ';
	html += '>';
	///////
	// add the icon image into the button:
        html += '<img id="' + id + '" src="' + themeBaseURL + '/images/exemath.gif"';
        html += ' width="20" height="18" border="0" title="' + tinyMCE.getLang('lang_exemath_compile_tooltip') + '"';
        html += ' class="mceButtonNormal" alt="' + tinyMCE.getLang('lang_exemath_compile_tooltip') + '" />';
	///////
	html += "<BR>";
	html += tinyMCE.getLang('lang_exemath_compile_label');
	html += '</BUTTON><BR>';

	html += '</CENTER>';
	html += '</a>';

        return html;
} // getMathBrowserHTML()



// very similar to getMathBrowserHTML, but to actually perform the math-compiling callback right now:
function doMathBrowser(id, source_form_element, font_size_element, target_form_element, type, prefix) {
        var option = prefix + "_" + type + "_browser_callback";
        var cb = tinyMCE.getParam(option, tinyMCE.getParam("file_browser_callback"));
        if (cb == null)
                return "";

        var html = "";

        openBrower3(id, source_form_element, font_size_element, target_form_element, type, option );

        return html;
} // doMathBrowser()


function init() {
	tinyMCEPopup.resizeToInnerSize();

	var formObj = document.forms[0];
	var inst = tinyMCE.getInstanceById(tinyMCE.getWindowArg('editor_id'));
	var elm = inst.getFocusElement();
	var action = "insert";
	var html = "";

	// Image list src
	html = getImageListHTML('imagelistsrc','src','onSelectMainImage');
	if (html == "")
		document.getElementById("imagelistsrcrow").style.display = 'none';
	else
		document.getElementById("imagelistsrccontainer").innerHTML = html;


	// Src browser
	html = getMathBrowserHTML('srcbrowser', 'latex_source', 'math_font_size', 'src','image','exemath');
	document.getElementById("srcbrowsercontainer").innerHTML = html;

	// Resize some elements
	if (isVisible('srcbrowser'))
		document.getElementById('src').style.width = '260px';

	// Check action
	if (elm != null && elm.nodeName == "IMG")
		action = "update"; 

	formObj.insert.value = tinyMCE.getLang('lang_' + action, 'Insert', true); 

	if (action == "update") {
		var src = tinyMCE.getAttrib(elm, 'src');

		src = convertURL(src, elm, true);

		// Use mce_src if found
		var mceRealSrc = tinyMCE.getAttrib(elm, 'mce_src');
		if (mceRealSrc != "") {
			src = mceRealSrc;

			if (tinyMCE.getParam('convert_urls'))
				src = convertURL(src, elm, true);
		}

		// Setup form data
		var style = tinyMCE.parseStyle(tinyMCE.getAttrib(elm, "style"));

		// Store away old size
		orgImageWidth = trimSize(getStyle(elm, 'width'))
		orgImageHeight = trimSize(getStyle(elm, 'height'));

		formObj.src.value    = src;
		formObj.alt.value    = tinyMCE.getAttrib(elm, 'alt');

		// testing font_size:
		formObj.math_font_size.value    = tinyMCE.getAttrib(elm, 'exe_math_size');


		formObj.title.value  = tinyMCE.getAttrib(elm, 'title');

		formObj.border.value = trimSize(getStyle(elm, 'border', 'borderWidth'));
		formObj.vspace.value = tinyMCE.getAttrib(elm, 'vspace');
		formObj.hspace.value = tinyMCE.getAttrib(elm, 'hspace');
		formObj.width.value  = orgImageWidth;
		formObj.height.value = orgImageHeight;
		formObj.id.value  = tinyMCE.getAttrib(elm, 'id');
		formObj.dir.value  = tinyMCE.getAttrib(elm, 'dir');
		formObj.lang.value  = tinyMCE.getAttrib(elm, 'lang');
		formObj.style.value  = tinyMCE.serializeStyle(style);


		// Select by the values
		if (tinyMCE.isMSIE)
			selectByValue(formObj, 'align', getStyle(elm, 'align', 'styleFloat'));
		else
			selectByValue(formObj, 'align', getStyle(elm, 'align', 'cssFloat'));

		addClassesToList('classlist', 'advimage_styles');

		selectByValue(formObj, 'classlist', tinyMCE.getAttrib(elm, 'class'));
		selectByValue(formObj, 'imagelistsrc', src);

		updateStyle();
		showPreviewImage(src, true);
		changeAppearance();

		window.focus();
	} else
		addClassesToList('classlist', 'advimage_styles');

	// If option enabled default contrain proportions to checked
	if (tinyMCE.getParam("advimage_constrain_proportions", true))
		formObj.constrain.checked = true;

}

function setSwapImageDisabled(state) {
	var formObj = document.forms[0];

	formObj.onmousemovecheck.checked = !state;

	setBrowserDisabled('overbrowser', state);
	setBrowserDisabled('outbrowser', state);

	if (formObj.imagelistover)
		formObj.imagelistover.disabled = state;

	if (formObj.imagelistout)
		formObj.imagelistout.disabled = state;

	formObj.onmouseoversrc.disabled = state;
	formObj.onmouseoutsrc.disabled  = state;
}

function setAttrib(elm, attrib, value) {
	var formObj = document.forms[0];
	var valueElm = formObj.elements[attrib];

	if (typeof(value) == "undefined" || value == null) {
		value = "";

		if (valueElm)
			value = valueElm.value;
	}

	if (value != "") {
		elm.setAttribute(attrib, value);

		if (attrib == "style")
			attrib = "style.cssText";

		if (attrib == "longdesc")
			attrib = "longDesc";

		if (attrib == "width") {
			attrib = "style.width";
			value = value + "px";
			value = value.replace(/%px/g, 'px');
		}

		if (attrib == "height") {
			attrib = "style.height";
			value = value + "px";
			value = value.replace(/%px/g, 'px');
		}

		if (attrib == "class")
			attrib = "className";

		eval('elm.' + attrib + "=value;");
	} else {
		if (attrib == 'class')
			elm.className = '';

		elm.removeAttribute(attrib);
	}
}

function makeAttrib(attrib, value) {
	var formObj = document.forms[0];
	var valueElm = formObj.elements[attrib];

	if (typeof(value) == "undefined" || value == null) {
		value = "";

		if (valueElm)
			value = valueElm.value;
	}

	if (value == "")
		return "";

	// XML encode it
	value = value.replace(/&/g, '&amp;');
	value = value.replace(/\"/g, '&quot;');
	value = value.replace(/</g, '&lt;');
	value = value.replace(/>/g, '&gt;');

	return ' ' + attrib + '="' + value + '"';
}

function insertAction() {
	var inst = tinyMCE.getInstanceById(tinyMCE.getWindowArg('editor_id'));

        // force a final math-image generate before the insert, in case any LaTeX has changed:
	doMathBrowser('srcbrowser', 'latex_source', 'math_font_size', 'src','image','exemath');


	var elm = inst.getFocusElement();
	var formObj = document.forms[0];
	var src = formObj.src.value;
        var font_size = formObj.math_font_size.value;

	if (!AutoValidator.validate(formObj)) {
		alert(tinyMCE.getLang('lang_invalid_data'));
		return false;
	}

	if (elm != null && elm.nodeName == "IMG") {
		setAttrib(elm, 'src', convertURL(src, tinyMCE.imgElement));
		setAttrib(elm, 'mce_src', src);

		setAttrib(elm, 'exe_math_latex', src+'.tex');
		// This is the UPDATE page, so typically images will come in at source = "/resources/..."
		// BUT, it's possible for the image to be freshly generated again, in which
		// case it will come in with source = "/previews/...",
		// but remember that this (and advimage itself, from which this came),
		// has the "feature" somehow that source = "/previews" will be saved out somewhere
		// as source = "../previews", AND that this "feature" is actually used in eXe to
		// distinguish between images and media (which properly keeps "/previews").
		// So, while the INSERT mode, below, always forces the "../previews" for new images,
		// only do so here if this one is coming again from previews:
		if (src.substr(0,"/previews".length) == "/previews") {
		   setAttrib(elm, 'exe_math_latex', '..'+src+'.tex');
		}


		setAttrib(elm, 'exe_math_size', font_size);
		setAttrib(elm, 'alt');

	        var keep_title = formObj.title.value;
		setAttrib(elm, 'title', keep_title);

		setAttrib(elm, 'border');
		setAttrib(elm, 'vspace');
		setAttrib(elm, 'hspace');
		setAttrib(elm, 'width');
		setAttrib(elm, 'height');
		setAttrib(elm, 'id');
		setAttrib(elm, 'dir');
		setAttrib(elm, 'lang');
		setAttrib(elm, 'longdesc');
		setAttrib(elm, 'usemap');
		setAttrib(elm, 'style');
		setAttrib(elm, 'class', getSelectValue(formObj, 'classlist'));
		setAttrib(elm, 'align', getSelectValue(formObj, 'align'));

		// Repaint if dimensions changed
		if (formObj.width.value != orgImageWidth || formObj.height.value != orgImageHeight)
			inst.repaint();

		// Refresh in old MSIE
		if (tinyMCE.isMSIE5)
			elm.outerHTML = elm.outerHTML;
	} else {
		var html = "<img";

		html += makeAttrib('src', convertURL(src, tinyMCE.imgElement));
		html += makeAttrib('mce_src', src);

		// The corresponding generated math .gifs are stored as "../previews/",
		// so, making that match here:
		html += makeAttrib('exe_math_latex', '..'+src+'.tex');
		// this INSERT mode, therefore, always forces the "../previews" for new images.
                // See the above UPDATE mode comments for a bit more explanation.
		// Leave this to our ProcessPreviewedImages to take into account, and for /previews only!
                // that way, they'll also match when a math-image is Updated, showing it as ../previews.

		html += makeAttrib('exe_math_size', font_size);

		html += makeAttrib('alt');
		html += makeAttrib('title');
		html += makeAttrib('border');
		html += makeAttrib('vspace');
		html += makeAttrib('hspace');
		html += makeAttrib('width');
		html += makeAttrib('height');
		html += makeAttrib('id');
		html += makeAttrib('dir');
		html += makeAttrib('lang');
		html += makeAttrib('longdesc');
		html += makeAttrib('usemap');
		html += makeAttrib('style');
		html += makeAttrib('class', getSelectValue(formObj, 'classlist'));
		html += makeAttrib('align', getSelectValue(formObj, 'align'));
		html += " />";

		tinyMCEPopup.execCommand("mceInsertContent", false, html);
	}

	tinyMCE._setEventsEnabled(inst.getBody(), false);
	tinyMCEPopup.close();
}

function cancelAction() {
	tinyMCEPopup.close();
}

function changeAppearance() {
	var formObj = document.forms[0];
	var img = document.getElementById('alignSampleImg');

	if (img) {
		img.align = formObj.align.value;

		img.title = formObj.title.value;

		img.border = formObj.border.value;
		img.hspace = formObj.hspace.value;
		img.vspace = formObj.vspace.value;
	}
}

function changeMouseMove() {
	var formObj = document.forms[0];
}

function updateStyle() {
	var formObj = document.forms[0];
	var st = tinyMCE.parseStyle(formObj.style.value);

	if (tinyMCE.getParam('inline_styles', false)) {
		st['width'] = formObj.width.value == '' ? '' : formObj.width.value + "px";
		st['height'] = formObj.height.value == '' ? '' : formObj.height.value + "px";
		st['border-width'] = formObj.border.value == '' ? '' : formObj.border.value + "px";
		st['margin-top'] = formObj.vspace.value == '' ? '' : formObj.vspace.value + "px";
		st['margin-bottom'] = formObj.vspace.value == '' ? '' : formObj.vspace.value + "px";
		st['margin-left'] = formObj.hspace.value == '' ? '' : formObj.hspace.value + "px";
		st['margin-right'] = formObj.hspace.value == '' ? '' : formObj.hspace.value + "px";
	} else {
		st['width'] = st['height'] = st['border-width'] = null;

		if (st['margin-top'] == st['margin-bottom'])
			st['margin-top'] = st['margin-bottom'] = null;

		if (st['margin-left'] == st['margin-right'])
			st['margin-left'] = st['margin-right'] = null;
	}

	formObj.style.value = tinyMCE.serializeStyle(st);
}

function styleUpdated() {
	var formObj = document.forms[0];
	var st = tinyMCE.parseStyle(formObj.style.value);

	if (st['width'])
		formObj.width.value = st['width'].replace('px', '');

	if (st['height'])
		formObj.height.value = st['height'].replace('px', '');

	if (st['margin-top'] && st['margin-top'] == st['margin-bottom'])
		formObj.vspace.value = st['margin-top'].replace('px', '');

	if (st['margin-left'] && st['margin-left'] == st['margin-right'])
		formObj.hspace.value = st['margin-left'].replace('px', '');

	if (st['border-width'])
		formObj.border.value = st['border-width'].replace('px', '');
}

function changeHeight() {
	var formObj = document.forms[0];

	if (!formObj.constrain.checked || !preloadImg) {
		updateStyle();
		return;
	}

	if (formObj.width.value == "" || formObj.height.value == "")
		return;

	var temp = (parseInt(formObj.width.value) / parseInt(preloadImg.width)) * preloadImg.height;
	formObj.height.value = temp.toFixed(0);
	updateStyle();
}

function changeWidth() {
	var formObj = document.forms[0];

	if (!formObj.constrain.checked || !preloadImg) {
		updateStyle();
		return;
	}

	if (formObj.width.value == "" || formObj.height.value == "")
		return;

	var temp = (parseInt(formObj.height.value) / parseInt(preloadImg.height)) * preloadImg.width;
	formObj.width.value = temp.toFixed(0);
	updateStyle();
}

function onSelectMainImage(target_form_element, name, value) {
	var formObj = document.forms[0];

	formObj.alt.value = name;
	formObj.title.value = name;

	resetImageData();
	showPreviewImage(formObj.elements[target_form_element].value, false);
}

function showPreviewImage(src, start) {
	var formObj = document.forms[0]; 

	selectByValue(document.forms[0], 'imagelistsrc', src);

	var elm = document.getElementById('prev');
	var src = src == "" ? src : tinyMCE.convertRelativeToAbsoluteURL(tinyMCE.settings['base_href'], src);

	if (!start && tinyMCE.getParam("advimage_update_dimensions_onchange", true))
		resetImageData();

	if (src == "")
		elm.innerHTML = "";
	else {
		elm.innerHTML = '<img id="previewImg" src="' + src + '" border="0" onload="updateImageData(' + start +', \'' + src + '\');" onerror="resetImageData();" />'
	}

}

function updateImageData(start, src) {
	var formObj = document.forms[0];

	preloadImg = document.getElementById('previewImg');

	if (!start && formObj.width.value == "")
		formObj.width.value = preloadImg.width;

	if (!start && formObj.height.value == "")
		formObj.height.value = preloadImg.height;

	updateStyle();

	if (src != "") {
	   // this is an exemath image to preview, meaning that it should have its .tex at: 
	   // 	resources/eXe_LaTeX_math_#.gif.tex or  ../previews/eXe_LaTeX_math_#.gif.tex
           // request the contents of that file, to update our LaTeX source field:

	   var input_filename = src+".tex" 
	   objXml = new XMLHttpRequest();
	   objXml.open("GET",input_filename,false);
	   objXml.send(null);

	   var found_source = 1;
	   if (objXml.responseText == "" || (objXml.responseText.substr(0,"<html>".length) == "<html>" && objXml.responseText.indexOf("404 - No Such Resource") >= 0 && objXml.responseText.indexOf("File not found") >= 0)) {
	       // then we can be pretty darned sure that it wasn't found :-)
	       found_source = 0;
	   }

	   if (found_source) {
	      latex_source_elem = document.getElementById('latex_source');
	      latex_source_elem.value = objXml.responseText;
	   }
	   else {
	      alert('Warning: no source math found in: ' + input_filename);
	   }
	}
}

function resetImageData() {
	var formObj = document.forms[0];
	formObj.width.value = formObj.height.value = "";	
}

function getSelectValue(form_obj, field_name) {
	var elm = form_obj.elements[field_name];

	if (elm == null || elm.options == null)
		return "";

	return elm.options[elm.selectedIndex].value;
}

function getImageListHTML(elm_id, target_form_element, onchange_func) {
	if (typeof(tinyMCEImageList) == "undefined" || tinyMCEImageList.length == 0)
		return "";

	var html = "";

	html += '<select id="' + elm_id + '" name="' + elm_id + '"';
	html += ' class="mceImageList" onfocus="tinyMCE.addSelectAccessibility(event, this, window);" onchange="this.form.' + target_form_element + '.value=';
	html += 'this.options[this.selectedIndex].value;';

	if (typeof(onchange_func) != "undefined")
		html += onchange_func + '(\'' + target_form_element + '\',this.options[this.selectedIndex].text,this.options[this.selectedIndex].value);';

	html += '"><option value="">---</option>';

	for (var i=0; i<tinyMCEImageList.length; i++)
		html += '<option value="' + tinyMCEImageList[i][1] + '">' + tinyMCEImageList[i][0] + '</option>';

	html += '</select>';

	return html;
}

//////////////////////////////////////
// insertAtCursor() and insertSymbol()
// both swiped straight from common.js,
// for the old maths idevice:

function insertAtCursor(myField, myValue, num) {
    //MOZILLA/NETSCAPE support

    if (myField.selectionStart || myField.selectionStart == '0') {
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;
        myField.value = myField.value.substring(0, startPos)
            + myValue
            + myField.value.substring(endPos, myField.value.length);
        myField.selectionStart = startPos + myValue.length - num
    } else {
        myField.value += myValue;
    }
    myField.selectionEnd = myField.selectionStart
    myField.focus();
}

function insertSymbol(id, string, num){
    var ele = document.getElementById(id);
    insertAtCursor(ele, string, num)
}



// While loading
preinit();
