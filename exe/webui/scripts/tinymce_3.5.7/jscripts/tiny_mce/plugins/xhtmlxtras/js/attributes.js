/**
 * attributes.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 */

function init() {
	tinyMCEPopup.resizeToInnerSize();
	var inst = tinyMCEPopup.editor;
	var dom = inst.dom;
	var elm = inst.selection.getNode();
	var f = document.forms[0];
	var onclick = dom.getAttrib(elm, 'onclick');

	setFormValue('title', dom.getAttrib(elm, 'title'));
	setFormValue('id', dom.getAttrib(elm, 'id'));
	setFormValue('style', dom.getAttrib(elm, "style"));
	setFormValue('dir', dom.getAttrib(elm, 'dir'));
	setFormValue('lang', dom.getAttrib(elm, 'lang'));
	setFormValue('tabindex', dom.getAttrib(elm, 'tabindex', typeof(elm.tabindex) != "undefined" ? elm.tabindex : ""));
	setFormValue('accesskey', dom.getAttrib(elm, 'accesskey', typeof(elm.accesskey) != "undefined" ? elm.accesskey : ""));
	setFormValue('onfocus', dom.getAttrib(elm, 'onfocus'));
	setFormValue('onblur', dom.getAttrib(elm, 'onblur'));
	setFormValue('onclick', onclick);
	setFormValue('ondblclick', dom.getAttrib(elm, 'ondblclick'));
	setFormValue('onmousedown', dom.getAttrib(elm, 'onmousedown'));
	setFormValue('onmouseup', dom.getAttrib(elm, 'onmouseup'));
	setFormValue('onmouseover', dom.getAttrib(elm, 'onmouseover'));
	setFormValue('onmousemove', dom.getAttrib(elm, 'onmousemove'));
	setFormValue('onmouseout', dom.getAttrib(elm, 'onmouseout'));
	setFormValue('onkeypress', dom.getAttrib(elm, 'onkeypress'));
	setFormValue('onkeydown', dom.getAttrib(elm, 'onkeydown'));
	setFormValue('onkeyup', dom.getAttrib(elm, 'onkeyup'));
	className = dom.getAttrib(elm, 'class');

	addClassesToList('classlist', 'advlink_styles');
	selectByValue(f, 'classlist', className, true);
	if(is_reserved_class(elm.classList)==true)
		document.getElementById("classlist").disabled = true;

	TinyMCE_EditableSelects.init();
}

function setFormValue(name, value) {
	if(value && document.forms[0].elements[name]){
		document.forms[0].elements[name].value = value;
	}
}

function insertAction() {
	var inst = tinyMCEPopup.editor;
	var elm = inst.selection.getNode();
	
	// The New eXeLearning
	var c = inst.selection.getContent();
	if (c!="" && elm.localName!="span") {
		
		var f = document.forms[0];
		
		var title = f.elements.title.value;
		var id = f.elements.id.value;
		var style = f.elements.style.value;
		var klass = getSelectValue(f, 'classlist');
		var dir = f.elements.dir.value;
		var lang = f.elements.lang.value;
		var tabindex = f.elements.tabindex.value;
		var accesskey = f.elements.accesskey.value;
		var onfocus = f.elements.onfocus.value;
		var onblur = f.elements.onblur.value;
		var onclick = f.elements.onclick.value;
		var ondblclick = f.elements.ondblclick.value;
		var onmousedown = f.elements.onmousedown.value;
		var onmouseup = f.elements.onmouseup.value;
		var onmouseover = f.elements.onmouseover.value;
		var onmousemove = f.elements.onmousemove.value;
		var onmouseout = f.elements.onmouseout.value;
		var onkeypress = f.elements.onkeypress.value;
		var onkeydown = f.elements.onkeydown.value;
		var onkeyup = f.elements.onkeyup.value;
		
		var newElm = inst.dom.create('span', {
			title : title,
			id : id,
			style : style,
			class : klass,
			dir : dir,
			lang : lang,
			tabindex : tabindex,
			accesskey : accesskey,
			onfocus : onfocus,
			onblur : onblur,
			onclick : onclick,
			ondblclick : ondblclick,
			onmousedown : onmousedown,
			onmouseup : onmouseup,
			onmouseover : onmouseover,
			onmousemove : onmousemove,
			onmouseout : onmouseout,
			onkeypress : onkeypress,
			onkeydown : onkeydown,
			onkeyup : onkeyup
		}, c);
		
		inst.selection.setNode(newElm);
		inst.dom.select(inst.selection.getNode(newElm));
		tinyMCEPopup.execCommand("mceEndUndoLevel");
		tinyMCEPopup.close();
		
		return false;
		
	}
	// The New eXeLearning

	setAllAttribs(elm);
	tinyMCEPopup.execCommand("mceEndUndoLevel");
	tinyMCEPopup.close();
}

function setAttrib(elm, attrib, value) {
	var formObj = document.forms[0];
	var valueElm = formObj.elements[attrib.toLowerCase()];
	var inst = tinyMCEPopup.editor;
	var dom = inst.dom;

	if (typeof(value) == "undefined" || value == null) {
		value = "";

		if (valueElm)
			value = valueElm.value;
	}

	dom.setAttrib(elm, attrib.toLowerCase(), value);
}

/* The new exelearning: audio and video are affected by class change, so we don't change class in some cases */
function is_reserved_class(class_array) {
	var reserved_classes = ["mceItemMedia", "mceItemVideo", "mceItemAudio", "mceItemAudio", "mceItemQuickTime", "mceItemRealMedia"]; 
    for(var i=0; i<class_array.length; i++) {
		for(var j=0; j<reserved_classes.length; j++) {
			if (class_array[i] == reserved_classes[j]) return true;
		}
    }
	return false;
}
/* The new exelearning */

function setAllAttribs(elm) {
	var f = document.forms[0];

	setAttrib(elm, 'title');
	setAttrib(elm, 'id');
	setAttrib(elm, 'style');
	if(is_reserved_class(elm.classList)==false)
		setAttrib(elm, 'class', getSelectValue(f, 'classlist'));
	setAttrib(elm, 'dir');
	setAttrib(elm, 'lang');
	setAttrib(elm, 'tabindex');
	setAttrib(elm, 'accesskey');
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
//	if (tinyMCE.isMSIE5)
//		elm.outerHTML = elm.outerHTML;
}

function insertAttribute() {
	tinyMCEPopup.close();
}

tinyMCEPopup.onInit.add(init);
tinyMCEPopup.requireLangPack();
