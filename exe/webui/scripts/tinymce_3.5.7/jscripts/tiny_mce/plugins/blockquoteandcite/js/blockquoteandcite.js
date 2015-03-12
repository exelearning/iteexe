function initCommonAttributes(elm) {
	var dom = tinyMCEPopup.editor.dom;
	if (elm.nodeName == 'BLOCKQUOTE') {
		var childs = elm.childNodes;
		var qlang = dom.getAttrib(elm, 'lang');
		var alang = "";
		if (childs.length == 2) {
			var quote = childs[0].innerHTML;
			var author = childs[1].innerHTML;
			alang = dom.getAttrib(childs[1], 'lang');
		} else if (childs.length == 1) {
			var quote = childs[0].innerHTML;
			var author = "";
		}
		setFormValue('blockquote', quote);
		setFormValue('blockquoteLang', qlang);
		setFormValue('author', author);
		setFormValue('authorLang', alang);
		if (elm.className.indexOf("styled-qc")==-1) document.forms[0].elements['styled'].checked=false;
	}
}

function setFormValue(n,v) {
	var e = document.forms[0].elements[n];
	if (e) e.value = v;
}

function init() {
	
	var elm = tinyMCEPopup.editor.dom.getParent(tinyMCEPopup.editor.selection.getNode(), 'blockquote');
	var s = tinyMCE.activeEditor.selection.getContent();
	
	if (s.length > 0 && elm == null) {
		setFormValue('blockquote', s);
	}
	
	var action = "insert";
	
	if (elm!=null && elm.nodeName=='BLOCKQUOTE') {
		action = "update";
		initCommonAttributes(elm);
		document.getElementById("remove").style.display = 'block';
	}

	document.forms[0].insert.value = tinyMCEPopup.getLang(action, 'Insert', true);
	
}

function insertQuote() {
    
	var elm = tinyMCEPopup.editor.dom.getParent(tinyMCEPopup.editor.selection.getNode(), 'blockquote');
	var formObj = document.forms[0];
	var quote = formObj.elements['blockquote'];	
	var styled = formObj.elements['styled'].checked;	
	
	if (quote.value == "") {
		tinyMCEPopup.alert(tinyMCEPopup.getLang('blockquoteandcite.no_quote'));
		return;
	}
	
	var author = document.forms[0].author;
	
	if (author.value == "") {
		tinyMCEPopup.alert(tinyMCEPopup.getLang('blockquoteandcite.no_author'));
		return;
	}

	tinyMCEPopup.execCommand('mceBeginUndoLevel');
	
	var q = quote.value;
	var a = author.value;
	var qL = formObj.elements['blockquoteLang'].value;
	var aL = formObj.elements['authorLang'].value;
	
	var cssClass = "exe-quote-cite";
	if (styled) cssClass += " styled-qc";
	var h = '<blockquote class="'+cssClass+'"';
	if (qL != "") h += ' lang="' + qL + '"';
	h += '><p>' + q + '</p>';
	if (a != "") {
		h = h + '<cite';
		if (aL != "") h = h + ' lang="' + aL + '"';
		h = h + '>' + a + '</cite>';
	}
	h += '</blockquote>';
	
	if (elm == null) {
		h += "&nbsp;";
		tinyMCEPopup.execCommand('mceInsertRawHTML', false, h);
	} else {
		tinyMCEPopup.editor.dom.remove(elm);
		tinyMCE.execCommand('mceInsertContent', false, h);
	}
	
	tinyMCEPopup.editor.nodeChanged();
	tinyMCEPopup.execCommand('mceEndUndoLevel');
	tinyMCEPopup.close();
}

function removeQuote() {
	var elm = tinyMCEPopup.editor.dom.getParent(tinyMCEPopup.editor.selection.getNode(), 'blockquote');
	if (elm){
		tinyMCEPopup.execCommand('mceBeginUndoLevel');
		tinyMCEPopup.editor.dom.remove(elm);
		tinyMCEPopup.editor.nodeChanged();
		tinyMCEPopup.execCommand('mceEndUndoLevel');
	}
	tinyMCEPopup.close();
}

tinyMCEPopup.onInit.add(init);
