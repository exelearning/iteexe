/* Functions for the advlink plugin popup */

tinyMCEPopup.requireLangPack();

var templates = {
	"window.open" : "window.open('${url}','${target}','${options}')"
};

function preinit() {
	var url;

	if (url = tinyMCEPopup.getParam("external_link_list_url"))
		document.write('<script language="javascript" type="text/javascript" src="' + tinyMCEPopup.editor.documentBaseURI.toAbsolute(url) + '"></script>');
}

function changeClass() {
	var f = document.forms[0];

	f.classes.value = getSelectValue(f, 'classlist');
}

function init() {
	tinyMCEPopup.resizeToInnerSize();

	var formObj = document.forms[0];
	var inst = tinyMCEPopup.editor;
	var elm = inst.selection.getNode();
	var action = "insert";
	var html;
	// The New eXeLearning (JR)
	// By José Ramón Jiménez Reyes
	// Creative Commons Attribution 4.0 International: http://creativecommons.org/licenses/by/4.0/
	var elmSize;
	// / JR

	document.getElementById('hrefbrowsercontainer').innerHTML = getBrowserHTML('hrefbrowser','href','file','advlink');
	document.getElementById('popupurlbrowsercontainer').innerHTML = getBrowserHTML('popupurlbrowser','popupurl','file','advlink');
	document.getElementById('targetlistcontainer').innerHTML = getTargetListHTML('targetlist','target');

	// Link list
	html = getLinkListHTML('linklisthref','href');
	if (html == "")
		document.getElementById("linklisthrefrow").style.display = 'none';
	else
		document.getElementById("linklisthrefcontainer").innerHTML = html;

	// Anchor list
	html = getAnchorListHTML('anchorlist','href');
	if (html == "")
		document.getElementById("anchorlistrow").style.display = 'none';
	else
		document.getElementById("anchorlistcontainer").innerHTML = html;

	// Resize some elements
	if (isVisible('hrefbrowser'))
		document.getElementById('href').style.width = '260px';

	if (isVisible('popupurlbrowser'))
		document.getElementById('popupurl').style.width = '180px';

	elm = inst.dom.getParent(elm, "A");
	if (elm == null) {
		var prospect = inst.dom.create("p", null, inst.selection.getContent());
		if (prospect.childNodes.length === 1) {
			elm = prospect.firstChild;
		}
	}

	if (elm != null && elm.nodeName == "A") {
		action = "update";
		// The New eXeLearning (JR)
		elmSize = elm.nextSibling;
		// /JR
	}

	formObj.insert.value = tinyMCEPopup.getLang(action, 'Insert', true);

	setPopupControlsDisabled(true);
	// The New eXeLearning (JR)
	setDownloadFileControlsDisabled(true);
	// /JR

	if (action == "update") {
		var href = inst.dom.getAttrib(elm, 'href');
		var onclick = inst.dom.getAttrib(elm, 'onclick');
		var linkTarget = inst.dom.getAttrib(elm, 'target') ? inst.dom.getAttrib(elm, 'target') : "_self";

		// Setup form data
		setFormValue('href', href);
		setFormValue('title', inst.dom.getAttrib(elm, 'title'));
		setFormValue('id', inst.dom.getAttrib(elm, 'id'));
		setFormValue('style', inst.dom.getAttrib(elm, "style"));
		setFormValue('rel', inst.dom.getAttrib(elm, 'rel'));
		setFormValue('rev', inst.dom.getAttrib(elm, 'rev'));
		setFormValue('charset', inst.dom.getAttrib(elm, 'charset'));
		setFormValue('hreflang', inst.dom.getAttrib(elm, 'hreflang'));
		setFormValue('dir', inst.dom.getAttrib(elm, 'dir'));
		setFormValue('lang', inst.dom.getAttrib(elm, 'lang'));
		setFormValue('tabindex', inst.dom.getAttrib(elm, 'tabindex', typeof(elm.tabindex) != "undefined" ? elm.tabindex : ""));
		setFormValue('accesskey', inst.dom.getAttrib(elm, 'accesskey', typeof(elm.accesskey) != "undefined" ? elm.accesskey : ""));
		setFormValue('type', inst.dom.getAttrib(elm, 'type'));
		setFormValue('onfocus', inst.dom.getAttrib(elm, 'onfocus'));
		setFormValue('onblur', inst.dom.getAttrib(elm, 'onblur'));
		setFormValue('onclick', onclick);
		setFormValue('ondblclick', inst.dom.getAttrib(elm, 'ondblclick'));
		setFormValue('onmousedown', inst.dom.getAttrib(elm, 'onmousedown'));
		setFormValue('onmouseup', inst.dom.getAttrib(elm, 'onmouseup'));
		setFormValue('onmouseover', inst.dom.getAttrib(elm, 'onmouseover'));
		setFormValue('onmousemove', inst.dom.getAttrib(elm, 'onmousemove'));
		setFormValue('onmouseout', inst.dom.getAttrib(elm, 'onmouseout'));
		setFormValue('onkeypress', inst.dom.getAttrib(elm, 'onkeypress'));
		setFormValue('onkeydown', inst.dom.getAttrib(elm, 'onkeydown'));
		setFormValue('onkeyup', inst.dom.getAttrib(elm, 'onkeyup'));
		setFormValue('target', linkTarget);
		setFormValue('classes', inst.dom.getAttrib(elm, 'class'));
		// The New eXeLearning (JR)
		if (elmSize != null && typeof(elmSize.innerHTML) != "undefined" && elmSize.innerHTML != "" && elmSize.nodeName == 'SPAN' && elmSize.className == 'exe-link-data file-size') {
			
			var title = inst.dom.getAttrib(elm, 'title');
			
			var t = title.replace(/\[.*\]/,"");
			if (t[t.length-1] == " ") t = t.substring(0, t.length - 1);
			setFormValue('title', t);			
			
			var size = elmSize.innerHTML.replace(/<abbr(.)*">/,"").replace("</abbr>","");
			size = size.replace(" (","");
			var parts = size.split(" - ");
			if (parts.length==2) {
				var type = parts[0];
				var p2 = parts[1].split(" ");
				if (p2.length==2) {
					size = p2[0];
					var unit = p2[1].replace(")","");
					setFormValue('sizelink', size);
					setFormValue('magnitudelist', unit);
					// Get the size in KB
					var bytes = "";
					if (unit == "B") bytes = size;
					else if (unit == "KB") bytes = (size * 1024);
					else if (unit == "MB") bytes = (size * 1024 * 1024);
					else bytes = (size * 1024 * 1024 * 1024);
					setFormValue('sizelinkbytes', bytes);
				}
			}
			
			if (title.indexOf("[") != -1 && title.indexOf(" - ") != -1)	setFormValue('filetype', title.split("[")[1].split("-")[0].trim());
			
			setDownloadFileControlsDisabled(false,true);
		}
		// /JR

		// Parse onclick data
		if (onclick != null && onclick.indexOf('window.open') != -1)
			parseWindowOpen(onclick);
		else
			parseFunction(onclick);

		// Select by the values
		selectByValue(formObj, 'dir', inst.dom.getAttrib(elm, 'dir'));
		selectByValue(formObj, 'rel', inst.dom.getAttrib(elm, 'rel'));
		selectByValue(formObj, 'rev', inst.dom.getAttrib(elm, 'rev'));
		selectByValue(formObj, 'linklisthref', href);

		if (href.charAt(0) == '#')
			selectByValue(formObj, 'anchorlist', href);
			
		// The New eXeLearning
		else if (href.indexOf("exe-node:")==0 || href=='exe-package:elp')
			selectByValue(formObj, 'anchorlist', href);
		// /The New eXeLearning	

		addClassesToList('classlist', 'advlink_styles');

		selectByValue(formObj, 'classlist', inst.dom.getAttrib(elm, 'class'), true);
		selectByValue(formObj, 'targetlist', linkTarget, true);
	} else
		addClassesToList('classlist', 'advlink_styles');
}

function checkPrefix(n) {
	if (n.value && Validator.isEmail(n) && !/^\s*mailto:/i.test(n.value) && confirm(tinyMCEPopup.getLang('advlink_dlg.is_email')))
		n.value = 'mailto:' + n.value;

	if (/^\s*www\./i.test(n.value) && confirm(tinyMCEPopup.getLang('advlink_dlg.is_external')))
		n.value = 'http://' + n.value;
}

function setFormValue(name, value) {
	document.forms[0].elements[name].value = value;
}

function parseWindowOpen(onclick) {
	var formObj = document.forms[0];

	// Preprocess center code
	if (onclick.indexOf('return false;') != -1) {
		formObj.popupreturn.checked = true;
		onclick = onclick.replace('return false;', '');
	} else
		formObj.popupreturn.checked = false;

	var onClickData = parseLink(onclick);

	if (onClickData != null) {
		formObj.ispopup.checked = true;
		setPopupControlsDisabled(false);

		var onClickWindowOptions = parseOptions(onClickData['options']);
		var url = onClickData['url'];

		formObj.popupname.value = onClickData['target'];
		formObj.popupurl.value = url;
		formObj.popupwidth.value = getOption(onClickWindowOptions, 'width');
		formObj.popupheight.value = getOption(onClickWindowOptions, 'height');

		formObj.popupleft.value = getOption(onClickWindowOptions, 'left');
		formObj.popuptop.value = getOption(onClickWindowOptions, 'top');

		if (formObj.popupleft.value.indexOf('screen') != -1)
			formObj.popupleft.value = "c";

		if (formObj.popuptop.value.indexOf('screen') != -1)
			formObj.popuptop.value = "c";

		formObj.popuplocation.checked = getOption(onClickWindowOptions, 'location') == "yes";
		formObj.popupscrollbars.checked = getOption(onClickWindowOptions, 'scrollbars') == "yes";
		formObj.popupmenubar.checked = getOption(onClickWindowOptions, 'menubar') == "yes";
		formObj.popupresizable.checked = getOption(onClickWindowOptions, 'resizable') == "yes";
		formObj.popuptoolbar.checked = getOption(onClickWindowOptions, 'toolbar') == "yes";
		formObj.popupstatus.checked = getOption(onClickWindowOptions, 'status') == "yes";
		formObj.popupdependent.checked = getOption(onClickWindowOptions, 'dependent') == "yes";

		buildOnClick();
	}
}

function parseFunction(onclick) {
	var formObj = document.forms[0];
	var onClickData = parseLink(onclick);

	// TODO: Add stuff here
}

function getOption(opts, name) {
	return typeof(opts[name]) == "undefined" ? "" : opts[name];
}

function setPopupControlsDisabled(state) {
	var formObj = document.forms[0];

	formObj.popupname.disabled = state;
	formObj.popupurl.disabled = state;
	formObj.popupwidth.disabled = state;
	formObj.popupheight.disabled = state;
	formObj.popupleft.disabled = state;
	formObj.popuptop.disabled = state;
	formObj.popuplocation.disabled = state;
	formObj.popupscrollbars.disabled = state;
	formObj.popupmenubar.disabled = state;
	formObj.popupresizable.disabled = state;
	formObj.popuptoolbar.disabled = state;
	formObj.popupstatus.disabled = state;
	formObj.popupreturn.disabled = state;
	formObj.popupdependent.disabled = state;

	setBrowserDisabled('popupurlbrowser', state);
}

function parseLink(link) {
	link = link.replace(new RegExp('&#39;', 'g'), "'");

	var fnName = link.replace(new RegExp("\\s*([A-Za-z0-9\.]*)\\s*\\(.*", "gi"), "$1");

	// Is function name a template function
	var template = templates[fnName];
	if (template) {
		// Build regexp
		var variableNames = template.match(new RegExp("'?\\$\\{[A-Za-z0-9\.]*\\}'?", "gi"));
		var regExp = "\\s*[A-Za-z0-9\.]*\\s*\\(";
		var replaceStr = "";
		for (var i=0; i<variableNames.length; i++) {
			// Is string value
			if (variableNames[i].indexOf("'${") != -1)
				regExp += "'(.*)'";
			else // Number value
				regExp += "([0-9]*)";

			replaceStr += "$" + (i+1);

			// Cleanup variable name
			variableNames[i] = variableNames[i].replace(new RegExp("[^A-Za-z0-9]", "gi"), "");

			if (i != variableNames.length-1) {
				regExp += "\\s*,\\s*";
				replaceStr += "<delim>";
			} else
				regExp += ".*";
		}

		regExp += "\\);?";

		// Build variable array
		var variables = [];
		variables["_function"] = fnName;
		var variableValues = link.replace(new RegExp(regExp, "gi"), replaceStr).split('<delim>');
		for (var i=0; i<variableNames.length; i++)
			variables[variableNames[i]] = variableValues[i];

		return variables;
	}

	return null;
}

function parseOptions(opts) {
	if (opts == null || opts == "")
		return [];

	// Cleanup the options
	opts = opts.toLowerCase();
	opts = opts.replace(/;/g, ",");
	opts = opts.replace(/[^0-9a-z=,]/g, "");

	var optionChunks = opts.split(',');
	var options = [];

	for (var i=0; i<optionChunks.length; i++) {
		var parts = optionChunks[i].split('=');

		if (parts.length == 2)
			options[parts[0]] = parts[1];
	}

	return options;
}

function buildOnClick() {
	var formObj = document.forms[0];

	if (!formObj.ispopup.checked) {
		formObj.onclick.value = "";
		return;
	}

	var onclick = "window.open('";
	var url = formObj.popupurl.value;

	onclick += url + "','";
	onclick += formObj.popupname.value + "','";

	if (formObj.popuplocation.checked)
		onclick += "location=yes,";

	if (formObj.popupscrollbars.checked)
		onclick += "scrollbars=yes,";

	if (formObj.popupmenubar.checked)
		onclick += "menubar=yes,";

	if (formObj.popupresizable.checked)
		onclick += "resizable=yes,";

	if (formObj.popuptoolbar.checked)
		onclick += "toolbar=yes,";

	if (formObj.popupstatus.checked)
		onclick += "status=yes,";

	if (formObj.popupdependent.checked)
		onclick += "dependent=yes,";

	if (formObj.popupwidth.value != "")
		onclick += "width=" + formObj.popupwidth.value + ",";

	if (formObj.popupheight.value != "")
		onclick += "height=" + formObj.popupheight.value + ",";

	if (formObj.popupleft.value != "") {
		if (formObj.popupleft.value != "c")
			onclick += "left=" + formObj.popupleft.value + ",";
		else
			onclick += "left='+(screen.availWidth/2-" + (formObj.popupwidth.value/2) + ")+',";
	}

	if (formObj.popuptop.value != "") {
		if (formObj.popuptop.value != "c")
			onclick += "top=" + formObj.popuptop.value + ",";
		else
			onclick += "top='+(screen.availHeight/2-" + (formObj.popupheight.value/2) + ")+',";
	}

	if (onclick.charAt(onclick.length-1) == ',')
		onclick = onclick.substring(0, onclick.length-1);

	onclick += "');";

	if (formObj.popupreturn.checked)
		onclick += "return false;";

	// tinyMCE.debug(onclick);

	formObj.onclick.value = onclick;

	if (formObj.href.value == "")
		formObj.href.value = url;
}

function setAttrib(elm, attrib, value) {
	var formObj = document.forms[0];
	var valueElm = formObj.elements[attrib.toLowerCase()];
	var dom = tinyMCEPopup.editor.dom;

	if (typeof(value) == "undefined" || value == null) {
		value = "";

		if (valueElm)
			value = valueElm.value;
	}

	// Clean up the style
	if (attrib == 'style')
		value = dom.serializeStyle(dom.parseStyle(value), 'a');

	dom.setAttrib(elm, attrib, value);
}

function getAnchorListHTML(id, target) {
	var ed = tinyMCEPopup.editor, nodes = ed.dom.select('a'), name, i, len, html = "";
	// The New eXeLearning
	html += '<option value="exe-package:elp">' + tinyMCEPopup.getLang('advlink_dlg.link_to_the_elp') + '</option>';
	// / The New eXeLearning

	for (i=0, len=nodes.length; i<len; i++) {
		if ((name = ed.dom.getAttrib(nodes[i], "name")) != "")
			html += '<option value="#' + name + '">' + name + '</option>';

		if ((name = nodes[i].id) != "" && !nodes[i].href)
			html += '<option value="#' + name + '">' + name + '</option>';
	}
	
	// The New eXeLearning
	var tName = tinymce.activeEditor.editorId;
	//var arrayName = "tinymce_"+tName+"_anchors";
    var arrayName = "tinymce_anchors";
	var w = window.parent;
	if (w) {
		if (typeof w[arrayName]=="object") {
			var myArray = w[arrayName];
			for (i=0;i<myArray.length;i++){
				var lbl = tinyMCEPopup.getLang("advlink_dlg.node")+": ";
				var n = myArray[i].replace("exe-node:",lbl);
				var checkN = n.split("#");
				if (checkN[1]=="auto_top") n = n.replace("#auto_top","");
				n = decodeURIComponent(n);
				var newOption = '<option value="' + myArray[i] + '">' + n + '</option>';
				if (html.indexOf(newOption)==-1) html += newOption;
			}
		}
	}
	// /The New eXeLearning	

	if (html == "")
		return "";

	html = '<select id="' + id + '" name="' + id + '" class="mceAnchorList"'
		+ ' onchange="this.form.' + target + '.value=this.options[this.selectedIndex].value"'
		+ '>'
		+ '<option value="">---</option>'
		+ html
		+ '</select>';

	return html;
}

function insertAction() {
	var inst = tinyMCEPopup.editor;
	var elm, elementArray, i, elmSize;
	// The New eXeLearning (JR)
	var form = document.forms[0];
	// /JR

	elm = inst.selection.getNode();
	checkPrefix(document.forms[0].href);

	elm = inst.dom.getParent(elm, "A");

	// Remove element if there is no href
	if (!document.forms[0].href.value) {
		i = inst.selection.getBookmark();
		inst.dom.remove(elm, 1);
		inst.selection.moveToBookmark(i);
		tinyMCEPopup.execCommand("mceEndUndoLevel");
		tinyMCEPopup.close();
		return;
	}
	// The New eXeLearning (JR)
	if (form.sizelink.value == "" && form.isdownloadfile.checked) {
		tinyMCEPopup.alert(tinyMCEPopup.getLang('advlink_dlg.missing_file_size'));
		return;
	} 
	if (form.filetype.value == "" && form.isdownloadfile.checked) {
		tinyMCEPopup.alert(tinyMCEPopup.getLang('advlink_dlg.missing_file_type'));
		return;
	} 
	// /JR

	// Create new anchor elements
	if (elm == null) {
		inst.getDoc().execCommand("unlink", false, null);
		tinyMCEPopup.execCommand("mceInsertLink", false, "#mce_temp_url#", {skip_undo : 1});

		elementArray = tinymce.grep(inst.dom.select("a"), function(n) {return inst.dom.getAttrib(n, 'href') == '#mce_temp_url#';});
		for (i=0; i<elementArray.length; i++)
			setAllAttribs(elm = elementArray[i]);
		// The New eXeLearning (JR)
		if (form.sizelink.value != "" && form.isdownloadfile.checked) {
			elmSize = document.createElement('span');
			elmSize.className = "exe-link-data file-size";
			elmSize.innerHTML = getSizeHTML();
			//elm.parentNode.appendChild(elmSize);
			elm.parentNode.insertBefore(elmSize,elm);
			elm = exchangeElements(elm, elmSize);
			//elm.title = elm.title.replace(/\[.*\]/,"") + getSuffixTitle();
			elm.title = getFullTitle(elm.title);
			// Add a space after the SPAN element
			if (elm.nextSibling!=null) {
				var sep = document.createTextNode(".");
				var ref = elm.nextSibling;
				ref.parentNode.insertBefore(sep,ref.nextSibling);
			}			
		}
		// /JR
	} else {
		setAllAttribs(elm);
		// The New eXeLearning (JR)
		if (form.sizelink.value != "" && form.isdownloadfile.checked) {
			elmSize = elm.nextSibling;
			if (elmSize == null || (elmSize.nodeName != 'SPAN' && elmSize.className != 'exe-link-data file-size')) {
				elmSize = document.createElement('span');
				elmSize.className = "exe-link-data file-size";
				elmSize.innerHTML = getSizeHTML();
				//elm.parentNode.appendChild(elmSize);
				elm.parentNode.insertBefore(elmSize, elm);
				elm = exchangeElements(elm, elmSize);
				//elm.title = elm.title.replace(/\[.*\]/,"") + getSuffixTitle();
				elm.title = getFullTitle(elm.title);
			}
			else {
				elmSize.innerHTML = getSizeHTML();
				//elm.title = elm.title.replace(/\[.*\]/,"") + getSuffixTitle();
				elm.title = getFullTitle(elm.title);
			}
		}
		else {
			elmSize = elm.nextSibling;
			if (elmSize != null && elmSize.className == "exe-link-data file-size")
				elm.parentNode.removeChild(elmSize);
		}
		// /JR
	}

	// Don't move caret if selection was image
	if (elm.childNodes.length != 1 || elm.firstChild.nodeName != 'IMG') {
		inst.focus();
		inst.selection.select(elm);
		inst.selection.collapse(0);
		tinyMCEPopup.storeSelection();
	}

	tinyMCEPopup.execCommand("mceEndUndoLevel");
	tinyMCEPopup.close();
}

// The New eXeLearning (JR)
function findSize(file) {
	if (file.indexOf("resources/")==0) {
		file = top.window.location.href + "/" + file;
	}
	var xhr = new XMLHttpRequest();
	xhr.open("head", file, true);
	xhr.onreadystatechange = function() {
		if (this.readyState == this.DONE) setSize(xhr.getResponseHeader("Content-Length"));
		else setSize(null);
	};
	xhr.send();
}

function setSize(size) {
	var form = document.forms[0];
	if (size != null) {
		form.sizelink.value = size;
		form.magnitudelist.value = "B";
		updateSizeBytes();
	}
	else {
		form.sizelink.value = "";
		form.magnitudelist.value = "B";
		form.sizelinkbytes.value = 0;
	}
}

function truncateDecimals (num, digits) {
	var numS = num.toString();
	var decPos = numS.indexOf('.');
	if (decPos == -1) decPos = numS.indexOf(',');
        var substrLength = decPos == -1 ? numS.length : 1 + decPos + digits;
        var trimmedResult = numS.substr(0, substrLength);
        var finalResult = isNaN(trimmedResult) ? 0 : trimmedResult;

	return parseFloat(finalResult);
}

function updateSizeBytes() {
	var form = document.forms[0];
	var size = parseFloat(form.sizelink.value);
	var magnitude = form.magnitudelist.value;
	if (magnitude == "B") form.sizelinkbytes.value = size;
	else if (magnitude == "KB") form.sizelinkbytes.value = size * 1024;
	else if (magnitude == "MB") form.sizelinkbytes.value = size * 1024 * 1024;
	else if (magnitude == "GB") form.sizelinkbytes.value = size * 1024 * 1024 * 1024;
}

function changeMagnitude() {
	var form = document.forms[0];
	var magnitude = form.magnitudelist.value;
	var sizebytes = parseFloat(form.sizelinkbytes.value);
	if (magnitude == "B") form.sizelink.value = sizebytes;
	else if (magnitude == "KB") form.sizelink.value = truncateDecimals(sizebytes / 1024, 2);
	else if (magnitude == "MB") form.sizelink.value = truncateDecimals(sizebytes / 1024 / 1024, 2);
	else if (magnitude == "GB") form.sizelink.value = truncateDecimals(sizebytes / 1024 / 1024 / 1024, 2);
}

function filenameChanged(filename) {
	if (filename != "") {
		var ext = getFileExtension(filename).toLowerCase();
		var form = document.forms[0];
		if (form.isdownloadfile.checked) {
			form.filetype.value = ext;
			findSize(filename);
		}
	}
}

function getFileExtension(filename) {
	var aux = filename.split(".");
	if( aux.length === 1 || ( aux[0] === "" && aux.length === 2 ) ) {
		return "";
	}
	aux = aux.pop();
	aux = aux.split("/")[0];
	aux = aux.split("?")[0];
	return aux;
}
function setDownloadFileControlsDisabled(state,isInit) {
	var formObj = document.forms[0];

	formObj.sizelink.disabled = state;
	formObj.magnitudelist.disabled = state;
	formObj.filetype.disabled = state;
	
	formObj.isdownloadfile.checked = !state;
	var note = document.getElementById("notedownload");
	if (state) {
		note.style.display = 'none';
	} else {
		note.style.display = 'block';
		if (isInit!=true) filenameChanged(formObj.href.value);
	}
}

function exchangeElements(element1, element2)
{
    var clonedElement1 = element1.cloneNode(true);
    var clonedElement2 = element2.cloneNode(true);

    element2.parentNode.replaceChild(clonedElement1, element2);
    element1.parentNode.replaceChild(clonedElement2, element1);

    return clonedElement1;
}

function getSizeHTML() {
	var form = document.forms[0];
	var magnitude = form.magnitudelist.value;
	var type = form.filetype.value;
	var magnAcron = "";
	var sizeHTML = "";
	if (form.sizelink.value != "") {
		if (magnitude == "B")
			magnAcron = '<abbr lang="en" title="Bytes">B</abbr>';
		else if (magnitude == "KB")
			magnAcron = '<abbr lang="en" title="KiloBytes">KB</abbr>';
		else if (magnitude == "MB")
			magnAcron = '<abbr lang="en" title="MegaBytes">MB</abbr>';
		else if (magnitude == "GB")
			magnAcron = '<abbr lang="en" title="GigaBytes">GB</abbr>';
	}
	if (form.sizelink.value != "") {
		sizeHTML = " ("+ type + " - " + form.sizelink.value + " " + magnAcron + ")";
	}
	return sizeHTML;
}

function getFullTitle(t) {
	var form = document.forms[0];
	var size = form.sizelink.value;
	var magnitude = form.magnitudelist.value;
	var type = form.filetype.value;
	var magnitude = form.magnitudelist.value;
	var res = "";
	if (size != "" && type != "") {
		res = "[" + type + " - " + size + " " + magnitude + "]";
		if (t!="") {
			// Remove this characters from the title: [ ] ( )  - 
			t = t.replace(/\[/g,'');
			t = t.replace(/\]/g,'');
			t = t.replace(/\(/g,'');
			t = t.replace(/\)/g,'');
			t = t.replace(/\ - /g,' ');
			res = t + " " + res;
		}
	}
	return res;
}
// /JR

function setAllAttribs(elm) {
	var formObj = document.forms[0];
	var href = formObj.href.value.replace(/ /g, '%20');
	var target = getSelectValue(formObj, 'targetlist');

	setAttrib(elm, 'href', href);
	setAttrib(elm, 'title');
	setAttrib(elm, 'target', target == '_self' ? '' : target);
	setAttrib(elm, 'id');
	setAttrib(elm, 'style');
	setAttrib(elm, 'class', getSelectValue(formObj, 'classlist'));
	setAttrib(elm, 'rel');
	setAttrib(elm, 'rev');
	setAttrib(elm, 'charset');
	setAttrib(elm, 'hreflang');
	setAttrib(elm, 'dir');
	setAttrib(elm, 'lang');
	setAttrib(elm, 'tabindex');
	setAttrib(elm, 'accesskey');
	setAttrib(elm, 'type');
	setAttrib(elm, 'onfocus');
	setAttrib(elm, 'onblur');
	setAttrib(elm, 'onclick');
	setAttrib(elm, 'ondblclick');
	setAttrib(elm, 'onmousedown');
	setAttrib(elm, 'onmouseup');
	setAttrib(elm, 'onmouseover');
	setAttrib(elm, 'onmousemove');
	setAttrib(elm, 'onmouseout');
	setAttrib(elm, 'onkeypress');
	setAttrib(elm, 'onkeydown');
	setAttrib(elm, 'onkeyup');

	// Refresh in old MSIE
	if (tinyMCE.isMSIE5)
		elm.outerHTML = elm.outerHTML;
}

function getSelectValue(form_obj, field_name) {
	var elm = form_obj.elements[field_name];

	if (!elm || elm.options == null || elm.selectedIndex == -1)
		return "";

	return elm.options[elm.selectedIndex].value;
}

function getLinkListHTML(elm_id, target_form_element, onchange_func) {
	if (typeof(tinyMCELinkList) == "undefined" || tinyMCELinkList.length == 0)
		return "";

	var html = "";

	html += '<select id="' + elm_id + '" name="' + elm_id + '"';
	html += ' class="mceLinkList" onchange="this.form.' + target_form_element + '.value=';
	html += 'this.options[this.selectedIndex].value;';

	if (typeof(onchange_func) != "undefined")
		html += onchange_func + '(\'' + target_form_element + '\',this.options[this.selectedIndex].text,this.options[this.selectedIndex].value);';

	html += '"><option value="">---</option>';

	for (var i=0; i<tinyMCELinkList.length; i++)
		html += '<option value="' + tinyMCELinkList[i][1] + '">' + tinyMCELinkList[i][0] + '</option>';

	html += '</select>';

	return html;

	// tinyMCE.debug('-- image list start --', html, '-- image list end --');
}

function getTargetListHTML(elm_id, target_form_element) {
	var targets = tinyMCEPopup.getParam('theme_advanced_link_targets', '').split(';');
	var html = '';

	html += '<select id="' + elm_id + '" name="' + elm_id + '" onchange="this.form.' + target_form_element + '.value=';
	html += 'this.options[this.selectedIndex].value;">';
	html += '<option value="_self">' + tinyMCEPopup.getLang('advlink_dlg.target_same') + '</option>';
	html += '<option value="_blank">' + tinyMCEPopup.getLang('advlink_dlg.target_blank') + ' (_blank)</option>';
	html += '<option value="_parent">' + tinyMCEPopup.getLang('advlink_dlg.target_parent') + ' (_parent)</option>';
	html += '<option value="_top">' + tinyMCEPopup.getLang('advlink_dlg.target_top') + ' (_top)</option>';

	for (var i=0; i<targets.length; i++) {
		var key, value;

		if (targets[i] == "")
			continue;

		key = targets[i].split('=')[0];
		value = targets[i].split('=')[1];

		html += '<option value="' + key + '">' + value + ' (' + key + ')</option>';
	}

	html += '</select>';

	return html;
}

// While loading
preinit();
tinyMCEPopup.onInit.add(init);
