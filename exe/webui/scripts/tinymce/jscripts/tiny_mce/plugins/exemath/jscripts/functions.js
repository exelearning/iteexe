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


// r3m0: brand new function to call up the math-compiling callback in JS:
function getMathBrowserHTML(id, source_form_element, target_form_element, type, prefix) {
        var option = prefix + "_" + type + "_browser_callback";
        var cb = tinyMCE.getParam(option, tinyMCE.getParam("file_browser_callback"));
        //alert("r3m0: HERE IN!!!! getMathBrowserHTML. for id= " + id + ", source_form_element = " + source_form_element + ", target_form_element = " + target_form_element+  ", option = " + option + ", cb = " + cb);
        if (cb == null)
                return "";

        var html = "";

	//html += '<CENTER>&nbsp;{$lang_exemath_compile_label}<BR>';
	// hmmmm, the above does NOT translate!  
	// so, for now, as a test, merely put:
	//html += '<CENTER>&nbsp;until button,<BR>r3m0 say...<BR>PREVIEW:<BR>';
	html += '<CENTER>&nbsp;Preview:<BR>';
	// and see how the INSERT/UPDATE/CANCEL buttons are created, and how their $lang is used,
	// but beware that it might be more difficult to do in this getMathBrowserHTML????
	// regardless, do need to upgrade to a real button,
	// and PERHAPS one that can utilize the image as well? (no worries if not, though!)
	// MIGHT be able to include the label name to translate in the original .htm tag, as:
	//	<td id="srcbrowsercontainer" name-or-label={$lang_exemath_compile_label}>

        html += '<a id="' + id + '_link" href="javascript:openBrower2(\'' + id + '\',\'' + source_form_element + '\',\'' + target_form_element + '\', \'' + type + '\',\'' + option + '\');" onmousedown="return false;">';
	// and try to put a label with the button: 

        //html += '<img id="' + id + '" src="' + themeBaseURL + '/images/browse.gif"';
        html += '<img id="' + id + '" src="' + themeBaseURL + '/images/exemath.gif"';
//        html += ' onmouseover="this.className=\'mceButtonOver\';"';
//        html += ' onmouseout="this.className=\'mceButtonNormal\';"';
//        html += ' onmousedown="this.className=\'mceButtonDown\';"';
        html += ' width="20" height="18" border="0" title="' + tinyMCE.getLang('lang_exemath_compile_tooltip') + '"';
        //html += ' class="mceButtonNormal" alt="' + tinyMCE.getLang('lang_exemath_compile_tooltip') + '" /></a>';
        html += ' class="mceButtonNormal" alt="' + tinyMCE.getLang('lang_exemath_compile_tooltip') + '" />';
	html += '</CENTER>';
	html += '</a>';

        //alert("r3m0: still setting up image dialog via utils/form_utils.js's getBrowserHTML. returning html = " + html);

        return html;
} // getMathBrowserHTML()



// r3m0: double new function to actually DO the math-compiling callback in JS:
// (goodies swiped from getMathBrowserHTML(), this actually performs the callback right now)
function doMathBrowser(id, source_form_element, target_form_element, type, prefix) {
        var option = prefix + "_" + type + "_browser_callback";
        var cb = tinyMCE.getParam(option, tinyMCE.getParam("file_browser_callback"));
        //alert("r3m0: HERE IN!!!! doMathBrowser. for id= " + id + ", source_form_element = " + source_form_element + ", target_form_element = " + target_form_element+  ", option = " + option + ", cb = " + cb);
        if (cb == null)
                return "";

        var html = "";

        //html += '<a id="' + id + '_link" href="javascript:openBrower2(\'' + id + '\',\'' + source_form_element + '\',\'' + target_form_element + '\', \'' + type + '\',\'' + option + '\');" onmousedown="return false;">';
	// perhaps this needs to refer to the tinyMCE object for the following openBrower2()???:
        openBrower2(id, source_form_element , target_form_element , type , option );

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
        //alert('r3m0: in init(), getImageListHTML just returned html='+html);
	if (html == "")
		document.getElementById("imagelistsrcrow").style.display = 'none';
	else
		document.getElementById("imagelistsrccontainer").innerHTML = html;

	// Image list oversrc
//	html = getImageListHTML('imagelistover','onmouseoversrc');
//	if (html == "")
//		document.getElementById("imagelistoverrow").style.display = 'none';
//	else
//		document.getElementById("imagelistovercontainer").innerHTML = html;

	// Image list outsrc
//	html = getImageListHTML('imagelistout','onmouseoutsrc');
//	if (html == "")
//		document.getElementById("imagelistoutrow").style.display = 'none';
//	else
//		document.getElementById("imagelistoutcontainer").innerHTML = html;

	// Src browser
	//html = getBrowserHTML('srcbrowser','src','image','advimage');
	//html = getMathBrowserHTML('srcbrowser', 'title', 'src','image','exemath');
	html = getMathBrowserHTML('srcbrowser', 'latex_source', 'src','image','exemath');
	document.getElementById("srcbrowsercontainer").innerHTML = html;

	// Over browser
//	html = getBrowserHTML('oversrcbrowser','onmouseoversrc','image','advimage');
//	document.getElementById("onmouseoversrccontainer").innerHTML = html;

	// Out browser
//	html = getBrowserHTML('outsrcbrowser','onmouseoutsrc','image','advimage');
//	document.getElementById("onmouseoutsrccontainer").innerHTML = html;

	// Longdesc browser
//	html = getBrowserHTML('longdescbrowser','longdesc','file','advimage');
//	document.getElementById("longdesccontainer").innerHTML = html;

	// Resize some elements
	if (isVisible('srcbrowser'))
		document.getElementById('src').style.width = '260px';

//	if (isVisible('oversrcbrowser'))
//		document.getElementById('onmouseoversrc').style.width = '260px';

//	if (isVisible('outsrcbrowser'))
//		document.getElementById('onmouseoutsrc').style.width = '260px';

//	if (isVisible('longdescbrowser'))
//		document.getElementById('longdesc').style.width = '180px';

	// Check action
	if (elm != null && elm.nodeName == "IMG")
		action = "update"; 
	//alert('r3m0: start of init(), and action now = '+action);

	formObj.insert.value = tinyMCE.getLang('lang_' + action, 'Insert', true); 

	if (action == "update") {
		var src = tinyMCE.getAttrib(elm, 'src');
//		var onmouseoversrc = getImageSrc(tinyMCE.cleanupEventStr(tinyMCE.getAttrib(elm, 'onmouseover')));
//		var onmouseoutsrc = getImageSrc(tinyMCE.cleanupEventStr(tinyMCE.getAttrib(elm, 'onmouseout')));

		src = convertURL(src, elm, true);
	        //alert('r3m0: in init(), after convertURL, src= '+src);

		// Use mce_src if found
		var mceRealSrc = tinyMCE.getAttrib(elm, 'mce_src');
		if (mceRealSrc != "") {
			src = mceRealSrc;

			if (tinyMCE.getParam('convert_urls'))
				src = convertURL(src, elm, true);
		}
		//alert('r3m0: in init(), after mceRealSrc, src= '+src);

//		if (onmouseoversrc != "" && tinyMCE.getParam('convert_urls'))
//			onmouseoversrc = convertURL(onmouseoversrc, elm, true);

//		if (onmouseoutsrc != "" && tinyMCE.getParam('convert_urls'))
//			onmouseoutsrc = convertURL(onmouseoutsrc, elm, true);

		// Setup form data
		var style = tinyMCE.parseStyle(tinyMCE.getAttrib(elm, "style"));

		// Store away old size
		orgImageWidth = trimSize(getStyle(elm, 'width'))
		orgImageHeight = trimSize(getStyle(elm, 'height'));

		//alert('r3m0: in init(), before formObjs...');

		formObj.src.value    = src;
		formObj.alt.value    = tinyMCE.getAttrib(elm, 'alt');

		formObj.title.value  = tinyMCE.getAttrib(elm, 'title');
		formObj.border.value = trimSize(getStyle(elm, 'border', 'borderWidth'));
		formObj.vspace.value = tinyMCE.getAttrib(elm, 'vspace');
		formObj.hspace.value = tinyMCE.getAttrib(elm, 'hspace');
		formObj.width.value  = orgImageWidth;
		formObj.height.value = orgImageHeight;
//		formObj.onmouseoversrc.value = onmouseoversrc;
//		formObj.onmouseoutsrc.value  = onmouseoutsrc;
		formObj.id.value  = tinyMCE.getAttrib(elm, 'id');
		formObj.dir.value  = tinyMCE.getAttrib(elm, 'dir');
		formObj.lang.value  = tinyMCE.getAttrib(elm, 'lang');
//		formObj.longdesc.value  = tinyMCE.getAttrib(elm, 'longdesc');
//		formObj.usemap.value  = tinyMCE.getAttrib(elm, 'usemap');
		formObj.style.value  = tinyMCE.serializeStyle(style);


		// Select by the values
		if (tinyMCE.isMSIE)
			selectByValue(formObj, 'align', getStyle(elm, 'align', 'styleFloat'));
		else
			selectByValue(formObj, 'align', getStyle(elm, 'align', 'cssFloat'));

		addClassesToList('classlist', 'advimage_styles');

		selectByValue(formObj, 'classlist', tinyMCE.getAttrib(elm, 'class'));
		selectByValue(formObj, 'imagelistsrc', src);
//		selectByValue(formObj, 'imagelistover', onmouseoversrc);
//		selectByValue(formObj, 'imagelistout', onmouseoutsrc);

		updateStyle();
		//alert('r3m0: in init(),  just before showPreviewImage with src='+src);
		showPreviewImage(src, true);
		//alert('r3m0: in init(),  just after showPreviewImage with src='+src);
		changeAppearance();

		window.focus();
	} else
		addClassesToList('classlist', 'advimage_styles');

	// If option enabled default contrain proportions to checked
	if (tinyMCE.getParam("advimage_constrain_proportions", true))
		formObj.constrain.checked = true;

	// Check swap image if valid data
//	if (formObj.onmouseoversrc.value != "" || formObj.onmouseoutsrc.value != "")
//		setSwapImageDisabled(false);
//	else
//		setSwapImageDisabled(true);
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

        //alert('r3m0: testing new call to do one final math-image generate before the insert.');
	// MAY want to also set a flag if the latex_source has changed, using an onChange() on it,
	// to see if this is even necessary, but begin for forcing it:
	doMathBrowser('srcbrowser', 'latex_source', 'src','image','exemath');
        //alert('r3m0: AFTER new call to do one final math-image generate; continuing with the insert.');


	var elm = inst.getFocusElement();
	var formObj = document.forms[0];
	var src = formObj.src.value;
//	var onmouseoversrc = formObj.onmouseoversrc.value;
//	var onmouseoutsrc = formObj.onmouseoutsrc.value;

	if (!AutoValidator.validate(formObj)) {
		alert(tinyMCE.getLang('lang_invalid_data'));
		return false;
	}

	if (tinyMCE.getParam("accessibility_warnings")) {
		if (formObj.alt.value == "" && !confirm(tinyMCE.getLang('lang_advimage_missing_alt', '', true)))
			return;
	}

//	if (onmouseoversrc && onmouseoversrc != "")
//		onmouseoversrc = "this.src='" + convertURL(onmouseoversrc, tinyMCE.imgElement) + "';";

//	if (onmouseoutsrc && onmouseoutsrc != "")
//		onmouseoutsrc = "this.src='" + convertURL(onmouseoutsrc, tinyMCE.imgElement) + "';";

	if (elm != null && elm.nodeName == "IMG") {
		setAttrib(elm, 'src', convertURL(src, tinyMCE.imgElement));
		setAttrib(elm, 'mce_src', src);

		// r3m0: trying to force the exe_math_latex attribute:
		//setAttrib(elm, 'exe_math_latex', 'bogus1=UpdatedExistingMathImage');
                // UPDATE: this IS used in updating an existing image!!!!!
		// TRY THIS FIRST: but beware of generating NEW images - may need to update it somehow???
		setAttrib(elm, 'exe_math_latex', src+'.tex');
		// the above looks great for first time, new images!
		// the only issue being that the .gifs are stored as "../previews/",
		// so, making that match here:
		//setAttrib(elm, 'exe_math_latex', '..'+src+'.tex');
		//////////////////////////////////
		// Okay, here's the deal :-)
		// This is the UPDATE page, so typically images will come in at source = "/resources/..."
		// BUT, it's possible for the image to be freshly generated again, in which
		// case it will come in with source = "/previews/...",
		// but remember that this (and advimage itself, from which this came),
		// has the "feature" somewhere that source = "/previews" will be saved out somewhere
		// as source = "../previews", AND that this "feature" is actually used in eXe to
		// distinguish between images and media (which properly keeps "/previews").
		// So, while the INSERT mode, below, always forces the "../previews" for new images,
		// only do so here if this one is coming again from previews:
		if (src.substr(0,"/previews".length) == "/previews") {
		   setAttrib(elm, 'exe_math_latex', '..'+src+'.tex');
		}


		setAttrib(elm, 'alt');
		setAttrib(elm, 'title');
		setAttrib(elm, 'border');
		setAttrib(elm, 'vspace');
		setAttrib(elm, 'hspace');
		setAttrib(elm, 'width');
		setAttrib(elm, 'height');
//		setAttrib(elm, 'onmouseover', onmouseoversrc);
//		setAttrib(elm, 'onmouseout', onmouseoutsrc);
		setAttrib(elm, 'id');
		setAttrib(elm, 'dir');
		setAttrib(elm, 'lang');
		setAttrib(elm, 'longdesc');
		setAttrib(elm, 'usemap');
		setAttrib(elm, 'style');
		setAttrib(elm, 'class', getSelectValue(formObj, 'classlist'));
		setAttrib(elm, 'align', getSelectValue(formObj, 'align'));

		//tinyMCEPopup.execCommand("mceRepaint");

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

		// r3m0: trying to force the exe_math_latex attribute:
		// html += makeAttrib('exe_math_latex', 'bogus2=NewMathImage');
		// try to maintain the source name, if possible:
		//html += makeAttrib('exe_math_latex', src+'.tex');
		// the above looks great for first time, new images!
		// the only issue being that the .gifs are stored as "../previews/",
		// so, making that match here:
		html += makeAttrib('exe_math_latex', '..'+src+'.tex');
		// BUT: beware of how this might work (or not) with the images once resourcified,
		// for those ARE properly shown as being stored in "/resources/".
		// MIGHT need to either make this smarter here, or back in ProcessPreviewedImages.
		// Ahhhhhhh, maybe that one will just be done in the UPDATE part, yah?
		// Leave this to ProcessPreviewedImages to take into account, and for /previews only!
                // that way, they'll also match when a math-image is Updated, showing it as ../previews.
                // for INSERT: this IS used in creating a new image!!!!!

		html += makeAttrib('alt');
		html += makeAttrib('title');
		html += makeAttrib('border');
		html += makeAttrib('vspace');
		html += makeAttrib('hspace');
		html += makeAttrib('width');
		html += makeAttrib('height');
//		html += makeAttrib('onmouseover', onmouseoversrc);
//		html += makeAttrib('onmouseout', onmouseoutsrc);
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
		img.border = formObj.border.value;
		img.hspace = formObj.hspace.value;
		img.vspace = formObj.vspace.value;
	}
}

function changeMouseMove() {
	var formObj = document.forms[0];

//	setSwapImageDisabled(!formObj.onmousemovecheck.checked);
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

	// r3m0: trying to force the exe_math_latex attribute:
	//setAttrib(elm, 'exe_math_latex', 'bogus1');
	formObj.exe_math_latex.value    = 'bogus4';

	resetImageData();
	showPreviewImage(formObj.elements[target_form_element].value, false);
}

function showPreviewImage(src, start) {
	var formObj = document.forms[0]; 
        //alert('r3m0: called showPreviewImage() in exemaths functions.js!!! at step A, src='+src+',start='+start);


	selectByValue(document.forms[0], 'imagelistsrc', src);
        //alert('r3m0: called showPreviewImage() in exemaths functions.js!!! at step A2, src now='+src);

	var elm = document.getElementById('prev');
	var src = src == "" ? src : tinyMCE.convertRelativeToAbsoluteURL(tinyMCE.settings['base_href'], src);
        //alert('r3m0: called showPreviewImage() in exemaths functions.js!!! at step B, elm='+elm+', src='+src);

	if (!start && tinyMCE.getParam("advimage_update_dimensions_onchange", true))
		resetImageData();

        //alert('r3m0: called showPreviewImage() in exemaths functions.js!!! at step C');

	if (src == "")
		elm.innerHTML = "";
	else {
		//elm.innerHTML = '<img id="previewImg" src="' + src + '" border="0" onload="updateImageData(' + start + ');" onerror="resetImageData();" />'
		// r3m0: add the src to the exemath previews, 
		// such that updateImageData() can load its .tex source as well:
		elm.innerHTML = '<img id="previewImg" src="' + src + '" border="0" onload="updateImageData(' + start +', \'' + src + '\');" onerror="resetImageData();" />'
	}

        //alert('r3m0: called showPreviewImage() in exemaths functions.js!!! at step D');
}

function updateImageData(start, src) {
	var formObj = document.forms[0];

	preloadImg = document.getElementById('previewImg');

	if (!start && formObj.width.value == "")
		formObj.width.value = preloadImg.width;

	if (!start && formObj.height.value == "")
		formObj.height.value = preloadImg.height;

	updateStyle();

	//////////////////////////////////////
	// with hardcoded example for now, expecting "/previews/example_math.tex"
	// NOTE: for some reason the alerts seem to cause problems during this stage of the image's load.
	if (src != "") {
	   // this is an exemath image to preview, meaning that it should have its .tex at: 
	   // 	/previews/eXe_LaTeX_math_#.gif.tex
	   //var input_filename = "/previews/example_math.tex"
	   var input_filename = src+".tex" 
	   //alert('r3m0: testing to load in the corresponding data file from:' + input_filename); 
	   objXml = new XMLHttpRequest();

	   //alert('r3m0: after xmlhttprequest.');
	   objXml.open("GET",input_filename,false);
	   //alert('r3m0: after open with a GET');
	   objXml.send(null);
	   //alert('r3m0: after send');
	   //alert(objXml.responseText);

// NEXT UP in this prototype:
// See how to get the input_filename from the image element's "exemath_..." attribute,
// which SHOULD have already been loaded by this point, but could be in another instance
// of this Javascript code?  hmmmmmm....
// Assuming that we CAN get access to this,
// a) if the attribute is NOT found (as might be the case for a brand-new image),
//    then just break out of the following, no worries.
// b) UNLESS.... what about the case where a math image is called to update?
//	the first time it loads will be fine, cuz it'll use that attribute (if able to find :-)),
//	BUT, what if future calls to Generate Math Image result in the new images,
//	but leave the old attribute lying around in memory?  it would keep reverting back to the
//	old LaTeX source, even though the image will have been properly updated.
//	Coder beware :-)
//	If this turns out to be  a problem, can we ensure that either
//	- the system updates its own exemath attribute first,
//	- or that we force that attribute in the image itself?  hmmm, that logic's not right.
//	MIGHT need to make assumptions about the file name being the same as the imagename + .tex ???
// and to do this, might be as easy as simply adding the 'src' value to the:
// 		onload="updateImageData(' + start + ')
// call that's set to the image in: showPreviewImage(src, start)
          
	   var found_source = 1;
	   if (objXml.responseText == "" || (objXml.responseText.substr(0,"<html>".length) == "<html>" && objXml.responseText.indexOf("404 - No Such Resource") >= 0 && objXml.responseText.indexOf("File not found") >= 0)) {
	       // then we can be pretty darned sure that it wasn't found :-)
	       found_source = 0;
	   }

	   if (found_source) {
	      //alert('r3m0: found source LaTeX = ' + objXml.responseText);
	      latex_source_elem = document.getElementById('latex_source');
	      latex_source_elem.value = objXml.responseText;
	   }
	   else {
	      // OR, have the above 
	      // (a) see if the return text starts with <html>, 
	      //	unless it actually starts with the "http://127.0.0.1:<port#>"
	      //	which it shouldn't.
	      // and
	      // (b) also check 404 or for 'File not found.' in the embedded HTML
	      // <html>
	      // <head><title>404 - No Such Resource</title></head>
	      // <body><h1>No Such Resource</h1>
	      // <p>File not found.</p>
	      // </body></html>
	      //alert('r3m0: no or empty source math found in: ' + input_filename +  ' .  returned was: ' + objXml.responseText);
	      alert('Warning: no source math found in: ' + input_filename);
	      // can we log a warning somewhere?  at least a better alert?  
	      // or just quietly don't have it there (to avoid translation issues)?
	   }
	}


	// Q: should objXml then be deleted once complete? we don't want no RAM-leaks, eh!
}

function resetImageData() {
	var formObj = document.forms[0];
        //alert('r3m0: called resetImageData()!!!! previously, formObj width='+formObj.width.value+', and height='+formObj.height.value);
	formObj.width.value = formObj.height.value = "";	
}

function getSelectValue(form_obj, field_name) {
	var elm = form_obj.elements[field_name];

	if (elm == null || elm.options == null)
		return "";

	return elm.options[elm.selectedIndex].value;
}

function getImageListHTML(elm_id, target_form_element, onchange_func) {
        //alert('r3m0: called getImageList()');
	if (typeof(tinyMCEImageList) == "undefined" || tinyMCEImageList.length == 0)
		return "";
        //alert('r3m0: and still in getImageList()');

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

	// tinyMCE.debug('-- image list start --', html, '-- image list end --');
}

//////////////////////////////////////
// insertAtCursor() and insertSymbol()
// both swiped straight from common.js:

//insertAtCursor(document.formName.fieldName, ?~Qthis value?~R);
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

//used by maths idevice
function insertSymbol(id, string, num){
    var ele = document.getElementById(id);
    insertAtCursor(ele, string, num)
}



// While loading
preinit();
