 /**
 * $Id: editor_plugin_src.js 42 2006-08-08 14:32:24Z spocke $
 *
 * @author Moxiecode - based on work by Andrew Tetlaw
 * @copyright Copyright © 2004-2007, Moxiecode Systems AB, All rights reserved.
 */

function initCommonAttributes(elm) {
	var formObj = document.forms[0];
	if (elm.className == 'glosario' && elm.nodeName == 'A') {
		var onclick = tinyMCE.getAttrib(elm, 'onclick');
		var aux = onclick.split("open('")[1].split("',''")[0];
		var aux1 = aux.substring(aux.indexOf('concept=')+8);
		var aux2 = aux1.split('(');
		var pos = aux1.indexOf(aux2[aux2.length - 1]);
		var ciclo = aux1.substring(pos, aux1.length - 1);
		var termino = aux1.substring(0, pos - 4);
		setFormValue('termino', termino.replace(/%20/g, ' '));
		setFormValue('ciclo', ciclo); 
	}
	var padre = elm.parentNode;
	if (elm.className == 'texto_izquierda' && elm.nodeName == 'DIV' && padre.className.indexOf('codigo') > -1 && padre.nodeName == 'DIV') {
		var contenido = elm.getElementsByTagName('code');
		var codigo = "";
		for (var i = 0; i < contenido.length; i++) {
			codigo += contenido[i].innerHTML;
			if (i < contenido.length - 1) codigo += '\n';
		}
		codigo = codigo.replace(/&lt;/g, '<');
		codigo = codigo.replace(/&gt;/g, '>');
		codigo = codigo.replace(/&amp;/g, '&');
		setFormValue('codigo', codigo); 
	}
	if (elm.nodeName == 'CODE') {
		//var codigo = elm.getElementsByTagName('code').innerHTML;
		var codigo = elm.innerText;
		codigo = codigo.replace(/&lt;/g, '<');
		codigo = codigo.replace(/&gt;/g, '>');
		codigo = codigo.replace(/&amp;/g, '&');
		setFormValue('codigo', codigo);
	}
	if (elm == null) {
		setFormValue('codigo', SXE.inst.selection.getSelectedText());
	}
	// Setup form data for common element attributes
	setFormValue('title', tinyMCE.getAttrib(elm, 'title'));
	setFormValue('id', tinyMCE.getAttrib(elm, 'id'));
	selectByValue(formObj, 'class', tinyMCE.getAttrib(elm, 'class'), true);
	setFormValue('style', tinyMCE.getAttrib(elm, 'style'));
	selectByValue(formObj, 'dir', tinyMCE.getAttrib(elm, 'dir'));
	setFormValue('lang', tinyMCE.getAttrib(elm, 'lang'));
	setFormValue('onfocus', tinyMCE.getAttrib(elm, 'onfocus'));
	setFormValue('onblur', tinyMCE.getAttrib(elm, 'onblur'));
	setFormValue('onclick', tinyMCE.getAttrib(elm, 'onclick'));
	setFormValue('ondblclick', tinyMCE.getAttrib(elm, 'ondblclick'));
	setFormValue('onmousedown', tinyMCE.getAttrib(elm, 'onmousedown'));
	setFormValue('onmouseup', tinyMCE.getAttrib(elm, 'onmouseup'));
	setFormValue('onmouseover', tinyMCE.getAttrib(elm, 'onmouseover'));
	setFormValue('onmousemove', tinyMCE.getAttrib(elm, 'onmousemove'));
	setFormValue('onmouseout', tinyMCE.getAttrib(elm, 'onmouseout'));
	setFormValue('onkeypress', tinyMCE.getAttrib(elm, 'onkeypress'));
	setFormValue('onkeydown', tinyMCE.getAttrib(elm, 'onkeydown'));
	setFormValue('onkeyup', tinyMCE.getAttrib(elm, 'onkeyup'));
}

function setFormValue(name, value) {
	if(document.forms[0].elements[name]) document.forms[0].elements[name].value = value;
}

function insertDateTime(id) {
	document.getElementById(id).value = getDateTime(new Date(), "%Y-%m-%dT%H:%M:%S");
}

function getDateTime(d, fmt) {
	fmt = fmt.replace("%D", "%m/%d/%y");
	fmt = fmt.replace("%r", "%I:%M:%S %p");
	fmt = fmt.replace("%Y", "" + d.getFullYear());
	fmt = fmt.replace("%y", "" + d.getYear());
	fmt = fmt.replace("%m", addZeros(d.getMonth()+1, 2));
	fmt = fmt.replace("%d", addZeros(d.getDate(), 2));
	fmt = fmt.replace("%H", "" + addZeros(d.getHours(), 2));
	fmt = fmt.replace("%M", "" + addZeros(d.getMinutes(), 2));
	fmt = fmt.replace("%S", "" + addZeros(d.getSeconds(), 2));
	fmt = fmt.replace("%I", "" + ((d.getHours() + 11) % 12 + 1));
	fmt = fmt.replace("%p", "" + (d.getHours() < 12 ? "AM" : "PM"));
	fmt = fmt.replace("%%", "%");

	return fmt;
}

function addZeros(value, len) {
	var i;

	value = "" + value;

	if (value.length < len) {
		for (i=0; i<(len-value.length); i++)
			value = "0" + value;
	}

	return value;
}

function selectByValue(form_obj, field_name, value, add_custom, ignore_case) {
	if (!form_obj || !form_obj.elements[field_name])
		return;

	var sel = form_obj.elements[field_name];

	var found = false;
	for (var i=0; i<sel.options.length; i++) {
		var option = sel.options[i];

		if (option.value == value || (ignore_case && option.value.toLowerCase() == value.toLowerCase())) {
			option.selected = true;
			found = true;
		} else
			option.selected = false;
	}

	if (!found && add_custom && value != '') {
		var option = new Option('Value: ' + value, value);
		option.selected = true;
		sel.options[sel.options.length] = option;
	}

	return found;
}

function setAttrib(elm, attrib, value) {
	var formObj = document.forms[0];
	var valueElm = formObj.elements[attrib.toLowerCase()];

	if (typeof(value) == "undefined" || value == null) {
		value = "";

		if (valueElm)
			value = valueElm.value;
	}

	if (value != "") {
		if (attrib == "style")
			attrib = "style.cssText";

		if (attrib.substring(0, 2) == 'on')
			value = 'return true;' + value;

		if (attrib == "class") {
			tinyMCE.addCSSClass(elm, value);
			return;
		}

		elm.setAttribute(attrib.toLowerCase(), value);
		
	} else
		elm.removeAttribute(attrib);
}

function setAllCommonAttribs(elm) {
	if (elm.className == 'glosario' && elm.nodeName == 'A') {
		var formObj = document.forms[0];
		var termino = formObj.elements['termino'].value;
		termino = termino.replace(/\s/g, '%20').replace(/'/g, '%27');
		var ciclo = formObj.elements['ciclo'].value;
		var lang = formObj.elements['lang'].value;
		var s = SXE.inst.selection.getSelectedText();
		//SXE.removeNode(elm);
		//elm = document.createElement('a');
		//elm.innerText = s;
		var h = '<a class="glosario" href="../../../../../mod/glossary/showentry.php?displayformat=dictionary&concept='; 
		h = h + termino + "%20(" + ciclo + ')" onclick="';
		h = h + "window.open('../../../../../mod/glossary/showentry.php?displayformat=dictionary&amp;concept="
		h = h + termino + "%20(" + ciclo + ')" ';
		if (lang != "")
			h = h + 'lang="' + lang + '" ';
		h = h + '>' + s + "</a>";
		elm.setAttribute('href', "../../../../../mod/glossary/showentry.php?displayformat=dictionary&concept=" + termino + "%20(" + ciclo + ")");
		elm.setAttribute('onclick', "window.open('../../../../../mod/glossary/showentry.php?displayformat=dictionary&amp;concept=" + termino + "%20(" + ciclo + ")','','scrollbars=yes,width=600,height=250');return false;");
		elm.setAttribute('title', "Ver la definici\u00f3n de \"" + termino.replace(/%20/g, ' ') + "\" (Se abre en una nueva ventana)"); 
		setAttrib(elm, 'lang');
		tinyMCE.execCommand('mceInsertContent', false, h);
	}
	else if (elm.className == 'codigo' && elm.nodeName == 'DIV') {
		/*var formObj = document.forms[0];
		var codigo = formObj.elements['codigo'].value;
		var pre = document.createElement('pre');
		if (typeof pre.textContent != 'undefined') {
		        pre.textContent = codigo;
		} else {
		        pre.innerText = codigo;
		}
		elm.appendChild(pre);*/
	}
	else {
		setAttrib(elm, 'title');
		setAttrib(elm, 'id');
		setAttrib(elm, 'class');
		setAttrib(elm, 'style');
		setAttrib(elm, 'dir');
		setAttrib(elm, 'lang');
	}
	/*setAttrib(elm, 'onfocus');
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
	setAttrib(elm, 'onkeyup');*/
}

SXE = {
	currentAction : "insert",
	inst : tinyMCE.getInstanceById(tinyMCE.getWindowArg('editor_id')),
	updateElement : null
}

SXE.focusElement = SXE.inst.getFocusElement();

SXE.initElementDialog = function(element_name) {
	element_name = element_name.toLowerCase();
	
	var elm = tinyMCE.getParentElement(SXE.focusElement, element_name);
	
	if (element_name == 'glosario') {
		elm = tinyMCE.getParentElement(SXE.focusElement, 'a');
	}
	else if (element_name == 'idioma') {
		elm = tinyMCE.getParentElement(SXE.focusElement, 'span');
	}
	else if (element_name == 'codigo') {
		var s = SXE.inst.selection.getSelectedText();
		if(s.length > 0) {
			if (SXE.inst.selection.getSelectedHTML().indexOf('<code>') > -1) {
				/*var elms = SXE.focusElement.getElementsByTagName('CODE');
				for (var i=0; i<elms.length; i++) {
				alert(elms[i].innerHTML)
					if (elms[i].innerHTML.indexOf(s) > -1)
						elm = elms[i];
				}*/
				elm = document.createElement('code');
				elm.innerText = s;
			}
			else {
				elm = null;
				setFormValue('codigo', s);
			}
		}
		else {
			elm = tinyMCE.getParentElement(SXE.focusElement, 'div');
		}
	}
	else {
		addClassesToList('class', 'xhtmlxtras_styles');
		TinyMCE_EditableSelects.init();
	}
	if ((elm != null && elm.nodeName == element_name.toUpperCase()) || (elm != null && elm.nodeName == 'A' && element_name == 'glosario') || (elm!=null && elm.nodeName == 'DIV' && element_name == 'codigo') || (elm != null && elm.nodeName == 'CODE' && element_name == 'codigo') || (elm != null && elm.nodeName == 'SPAN' && element_name == 'idioma')) {
		SXE.currentAction = "update";
	}	

	if (SXE.currentAction == "update") {
		initCommonAttributes(elm);
		SXE.updateElement = elm;
	}

	document.forms[0].insert.value = tinyMCE.getLang('lang_' + SXE.currentAction, 'Insert', true); 
}

SXE.insertElement = function(element_name) {
	var s = SXE.inst.selection.getSelectedText(), h, tagName;
	if (element_name == 'glosario') {
		var elm = tinyMCE.getParentElement(SXE.focusElement, 'a');
	}
	else if (element_name == 'idioma') {
		var elm = tinyMCE.getParentElement(SXE.focusElement, 'span');
	}
	else if (element_name == 'codigo') {
		if (s.length > 0) {
			if (SXE.inst.selection.getSelectedHTML().indexOf('<code>') > -1) {
				var elms = SXE.focusElement.getElementsByTagName('CODE');
				for (var i=0; i<elms.length; i++) {
					if (elms[i].innerText.indexOf(s) > -1)
						elm = elms[i];
				}
			}
		}
		else {
			var elm = tinyMCE.getParentElement(SXE.focusElement, 'div');
		}
	}
	else {
		var elm = tinyMCE.getParentElement(SXE.focusElement, element_name);
	}

	tinyMCEPopup.execCommand('mceBeginUndoLevel');
	if (elm == null) {
		if(s.length > 0) {
			tagName = element_name;

			if (tinyMCE.isIE && !tinyMCE.isOpera && element_name.indexOf('html:') == 0)
				element_name = element_name.substring(5).toLowerCase();
			if (tagName == 'glosario') {
				h = '<a class="glosario" id="#sxe_temp_' + element_name + '#">' + s + '</a>';
			}
			else if (tagName == 'codigo') {
				var formObj = document.forms[0];
				var codigo = formObj.elements['codigo'].value;
				codigo = codigo.replace(/&/g, '&amp;');
				codigo = codigo.replace(/</g, '&lt;');
				h = '<code id="#sxe_temp_' + element_name + '#">' + codigo + '</code>';
			}
			else if (tagName == 'idioma') {
				h = '<span id="#sxe_temp_' + element_name + '#">' + s + '</span>';
			}
			else {
				h = '<' + tagName + ' id="#sxe_temp_' + element_name + '#">' + s + '</' + tagName + '>';
			}

			tinyMCEPopup.execCommand('mceInsertContent', false, h);

			if (tagName == 'glosario') {
				var elementArray = tinyMCE.getElementsByAttributeValue(SXE.inst.getBody(), 'a', 'id', '#sxe_temp_' + element_name + '#');
			}
			else if (tagName == 'codigo') {
				var elementArray = tinyMCE.getElementsByAttributeValue(SXE.inst.getBody(), 'code', 'id', '#sxe_temp_' + element_name + '#');
			}
			else if (tagName == 'idioma') {
				var elementArray = tinyMCE.getElementsByAttributeValue(SXE.inst.getBody(), 'span', 'id', '#sxe_temp_' + element_name + '#');
			}
			else {
				var elementArray = tinyMCE.getElementsByAttributeValue(SXE.inst.getBody(), element_name, 'id', '#sxe_temp_' + element_name + '#');
			}
			for (var i=0; i<elementArray.length; i++) {

				var elm = elementArray[i];

				elm.id = '';
				elm.setAttribute('id', '');
				elm.removeAttribute('id');

				setAllCommonAttribs(elm);
			}
		}
		else if (element_name == 'codigo') {
			var formObj = document.forms[0];
			var codigo = formObj.elements['codigo'].value;
			if (codigo != "") {
				codigo = codigo.replace(/&/g, '&amp;');
				codigo = codigo.replace(/</g, '&lt;');
				codigo = codigo.replace(/\t/g, '     ');

				var lineas = codigo.split('\n');
				var max = 0;
				var h = "";
				for (var i=0; i < lineas.length; i++) {
					if (lineas[i].length > max) max = lineas[i].length;
					h += '<pre><code>' + lineas[i] + '</code></pre>';
				}
				h = '<div class="codigo elemento_centrado" style="width:' + (max*0.55+6) + 'em;"><div class="texto_izquierda">' + h + '</div></div>';
				tinyMCE.execCommand('mceInsertContent', false, h);
			}
		}
	} else if (element_name == 'codigo') {
		if(s.length > 0) {
			var formObj = document.forms[0];
			var codigo = formObj.elements['codigo'].value;
			codigo = codigo.replace(/&/g, '&amp;');
			codigo = codigo.replace(/</g, '&lt;');
			SXE.removeNode(elm);
			elm = document.createElement('code');
			elm.innerText = codigo;
			tinyMCE.execCommand('mceInsertContent', false, elm);
			//setAllCommonAttribs(elm);
		}
		else {
			var raiz = tinyMCE.getParentNode(elm, function(n) { return n.className.indexOf('codigo') > -1; }, null);
			SXE.removeNode(raiz);
			var formObj = document.forms[0];
			var codigo = formObj.elements['codigo'].value;
			if (codigo != "") {
				codigo = codigo.replace(/&/g, '&amp;');
				codigo = codigo.replace(/</g, '&lt;');
				codigo = codigo.replace(/\t/g, '     ');
	
				var lineas = codigo.split('\n');
				var max = 0;
				var h = "";
				for (var i=0; i < lineas.length; i++) {
					if (lineas[i].length > max) max = lineas[i].length;
					h += '<pre><code>' + lineas[i] + '</code></pre>';
				}
				h = '<div class="codigo elemento_centrado" style="width:' + (max*0.55+6) + 'em;"><div class="texto_izquierda">' + h + '</div></div>';
				tinyMCE.execCommand('mceInsertContent', false, h);
			}
		}
	} else {
		setAllCommonAttribs(elm);
	}	
 
	tinyMCE.triggerNodeChange();
	tinyMCEPopup.execCommand('mceEndUndoLevel');
}

SXE.removeNode = function(elm){
	/*if (elm) {
		var hijos = elm.childNodes;
		if (hijos) {
			for (var i=0; i<hijos.length; i++) {
				SXE.removeNode(hijos[i]);
				tinyMCE.execCommand('mceRemoveNode', false, hijos[i]);
			}
		}
		tinyMCE.execCommand('mceRemoveNode', false, elm);
	}*/
	var rng = elm.ownerDocument.createRange();
	rng.setStartBefore(elm);
	rng.setEndAfter(elm);
	rng.deleteContents();
}

SXE.removeElement = function(element_name){
	element_name = element_name.toLowerCase();
	if (element_name == 'glosario') element_name = 'a';
	if (element_name == 'idioma') element_name = 'span';
	var s = SXE.inst.selection.getSelectedText();
	if (element_name == 'codigo') {
		if (s.length > 0) {
			var elm = null;
			if (SXE.inst.selection.getSelectedHTML().indexOf('<code>') > -1) {
				elm = tinyMCE.getParentElement(SXE.focusElement, 'code');
			}
		}
		else {
			var elm = tinyMCE.getParentNode(SXE.focusElement, function(n) { return n.className.indexOf('codigo') > -1; }, null);
		}
	}
	else {
		var elm = tinyMCE.getParentElement(SXE.focusElement, element_name);
	}
//	if(elm && elm.nodeName == element_name.toUpperCase()){
	if (elm){
		tinyMCEPopup.execCommand('mceBeginUndoLevel');
		if (elm.nodeName == 'DIV' && element_name == 'codigo') {
			SXE.removeNode(elm);
		}
		else {
			tinyMCE.execCommand('mceRemoveNode', false, elm);
		}
		tinyMCE.triggerNodeChange();
		tinyMCEPopup.execCommand('mceEndUndoLevel');
	}
}

SXE.showRemoveButton = function() {
		document.getElementById("remove").style.display = 'block';
}

SXE.containsClass = function(elm,cl) {
	return (elm.className.indexOf(cl) > -1) ? true : false;
}

SXE.removeClass = function(elm,cl) {
	if(elm.className == null || elm.className == "" || !SXE.containsClass(elm,cl)) {
		return true;
	}
	var classNames = elm.className.split(" ");
	var newClassNames = "";
	for (var x = 0, cnl = classNames.length; x < cnl; x++) {
		if (classNames[x] != cl) {
			newClassNames += (classNames[x] + " ");
		}
	}
	elm.className = newClassNames.substring(0,newClassNames.length-1); //removes extra space at the end
}

SXE.addClass = function(elm,cl) {
	if(!SXE.containsClass(elm,cl)) elm.className ? elm.className += " " + cl : elm.className = cl;
	return true;
}
