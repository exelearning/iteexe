/* common.js */
function new_makeMathImage_viaTinyMCE(field_name, src_latex, font_size, type, win) {
	
	var w = "";
	if (typeof(top.nevow_clientToServerEvent)!='undefined') w = top;
	else {
		alert("TinyMCE's \u0022inlinepopups\u0022 plugin is required.");
		return;
	}
	
	var local_imagePath = ""

    if (src_latex == "") {
       return;
    }

    // to help unique-ify each previewed math image:
    var preview_basename = "eXe_LaTeX_math_"+w.curr_edits_math_num
    var preview_math_imagefile = preview_basename+".gif"
    // Simplify the subsequent file-lookup process,  by just appending 
    // the ".tex" to the full image name, as such:
    var preview_math_srcfile = preview_math_imagefile+".tex"
   
    w.curr_edits_math_num += 1

    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    // pass the file information on to the server,
    // to generate the image into the server's "previews" directory:
	
	w.nevow_clientToServerEvent('generateTinyMCEmath', this, 
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
/* Form utils */
function openBrower3(img_id, source_form_element, source2_form_element, target_form_element, type, option) {
	var img = document.getElementById(img_id);
	if (img.className != "mceButtonDisabled")
		openBrowser3(source_form_element, source2_form_element, target_form_element, type, option);
}
/* TinyMCE popup */
var openBrowser3 = function(src_element_id, src2_element_id, dst_element_id, type, option) {
	var src_val = document.getElementById(src_element_id).value;
	var src2_val = document.getElementById(src2_element_id).value;		
	new_makeMathImage_viaTinyMCE(dst_element_id, src_val, src2_val, type, window);		
}

var preloadImg = null;
var orgImageWidth, orgImageHeight;

function convertURL(url, node, on_save) {
	return eval("tinyMCEPopup.windowOpener." + tinyMCE.settings['urlconverter_callback'] + "(url, node, on_save);");
}

function getMathBrowserHTML(id, source_form_element, font_size_element, target_form_element, type, prefix) {
	var html = '<p style="margin:0 10px;text-align:center"><a id="'+id+'" href="#" onclick="openBrower3(\''+id+'\',\''+source_form_element+'\',\''+font_size_element+'\',\''+target_form_element+'\',\''+type+'\',\''+prefix+'\');return false;">'+tinyMCEPopup.getLang('exemath.compile_label')+'</a></p>';
	return html;
}

function changeAppearance(){
	var ed = tinyMCEPopup.editor, f = document.forms[0], img = document.getElementById('alignSampleImg');
	if (img) {
		if (ed.getParam('inline_styles')) {
			ed.dom.setAttrib(img, 'style', f.style.value);
		} else {
			img.align = f.align.value;
			img.border = f.border.value;
			img.hspace = f.hspace.value;
			img.vspace = f.vspace.value;
		}
	}
}

function insertAction() {

	var prev = document.getElementById("prev");
	if (prev.innerHTML=='') {
		alert("Genera la imagen pulsando \u0022Previsualizar\u0022 antes de guardar");
		return;
	} else {
		var ed = tinyMCEPopup.editor, f = document.forms[0];
		//Insert and close
		var ed = tinyMCEPopup.editor, f = document.forms[0], nl = f.elements, v, args = {}, el;
		
		tinyMCEPopup.restoreSelection();
		
		// Fixes crash in Safari
		if (tinymce.isWebKit)
			ed.getWin().focus();

		if (!ed.settings.inline_styles) {
			args = {
				vspace : nl.vspace.value,
				hspace : nl.hspace.value,
				border : nl.border.value,
				align : getSelectValue(f, 'align')
			};
		} else {
			// Remove deprecated values
			args = {
				vspace : '',
				hspace : '',
				border : '',
				align : ''
			};
		}
		
		var exe_math_latex_src = nl.src.value.replace(/ /g, '%20')+".tex"
		//The path is /previews/... and eXe requires ../previews/...
		if (exe_math_latex_src.indexOf("/previews/")==0) exe_math_latex_src = ".."+exe_math_latex_src;

		tinymce.extend(args, {
			src : nl.src.value.replace(/ /g, '%20'),
			width : nl.width.value,
			height : nl.height.value,
			alt : nl.alt.value,
			style : nl.style.value,
			exe_math_latex : exe_math_latex_src
		});
		
		args.onmouseover = args.onmouseout = '';
		
		el = ed.selection.getNode();
		
		if (el && el.nodeName == 'IMG') {
			ed.dom.setAttribs(el, args);
		} else {
			tinymce.each(args, function(value, name) {
				if (value === "") {
					delete args[name];
				}
			});

			ed.execCommand('mceInsertContent', false, tinyMCEPopup.editor.dom.createHTML('img', args), {skip_undo : 1});
			ed.undoManager.add();
		}
		
		tinyMCEPopup.editor.execCommand('mceRepaint');
		tinyMCEPopup.editor.focus();
		tinyMCEPopup.close();
		
	}
	
}

function updateStyle(ty) {
	
	var dom = tinyMCEPopup.dom, b, bStyle, bColor, v, isIE = tinymce.isIE, f = document.forms[0], img = dom.create('img', {style : dom.get('style').value});

	if (tinyMCEPopup.editor.settings.inline_styles) {
		// Handle align
		
		if (ty == 'align') {
			dom.setStyle(img, 'float', '');
			dom.setStyle(img, 'vertical-align', '');

			v = getSelectValue(f, 'align');
			if (v) {
				if (v == 'left' || v == 'right')
					dom.setStyle(img, 'float', v);
				else
					img.style.verticalAlign = v;
			}			
		}

		// Handle border
		if (ty == 'border') {
			b = img.style.border ? img.style.border.split(' ') : [];
			bStyle = dom.getStyle(img, 'border-style');
			bColor = dom.getStyle(img, 'border-color');

			dom.setStyle(img, 'border', '');

			v = f.border.value;
			if (v || v == '0') {
				if (v == '0')
					img.style.border = isIE ? '0' : '0 none none';
				else {
					if (b.length == 3 && b[isIE ? 2 : 1])
						bStyle = b[isIE ? 2 : 1];
					else if (!bStyle || bStyle == 'none')
						bStyle = 'solid';
					if (b.length == 3 && b[isIE ? 0 : 2])
						bColor = b[isIE ? 0 : 2];
					else if (!bColor || bColor == 'none')
						bColor = 'black';
					img.style.border = v + 'px ' + bStyle + ' ' + bColor;
				}
			}
		}

		// Handle hspace
		if (ty == 'hspace') {
			dom.setStyle(img, 'marginLeft', '');
			dom.setStyle(img, 'marginRight', '');

			v = f.hspace.value;
			if (v) {
				img.style.marginLeft = v + 'px';
				img.style.marginRight = v + 'px';
			}
		}

		// Handle vspace
		if (ty == 'vspace') {
			dom.setStyle(img, 'marginTop', '');
			dom.setStyle(img, 'marginBottom', '');

			v = f.vspace.value;
			if (v) {
				img.style.marginTop = v + 'px';
				img.style.marginBottom = v + 'px';
			}
		}

		// Merge
		dom.get('style').value = dom.serializeStyle(dom.parseStyle(img.style.cssText), 'img');
	}
	
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

	var f = document.forms[0], tp, t = this;

	if (!f.constrain.checked || !t.preloadImg) {
		return;
	}

	if (f.width.value == "" || f.height.value == "")
		return;

	tp = (parseInt(f.width.value) / parseInt(t.preloadImg.width)) * t.preloadImg.height;
	f.height.value = tp.toFixed(0);	
	
}

function changeWidth() {

	var f = document.forms[0], tp, t = this;

	if (!f.constrain.checked || !t.preloadImg) {
		return;
	}

	if (f.width.value == "" || f.height.value == "")
		return;

	tp = (parseInt(f.height.value) / parseInt(t.preloadImg.height)) * t.preloadImg.width;
	f.width.value = tp.toFixed(0);	
	
}

/*
function onSelectMainImage(target_form_element, name, value) {

	var formObj = document.forms[0];

	formObj.alt.value = name;
	formObj.title.value = name;

	resetImageData();
	showPreviewImage(formObj.elements[target_form_element].value, false);
	
}
*/

function showPreviewImage(src, start) {

	var elm = document.getElementById('prev');
	if (src!="") {
		var formObj = document.forms[0]; 
		selectByValue(document.forms[0], 'imagelistsrc', src);
		elm.innerHTML = '<img id="previewImg" src="' + src + '" onload="updateImageData(' + start +', \'' + src + '\');" />'
	} else {
		elm.innerHTML = "";
	}
	
}

function updateImageData(start, src) {

}

function resetImageData() {
	
	//var formObj = document.forms[0];
	//formObj.width.value = formObj.height.value = "";	
	
}

function getSelectValue(form_obj, field_name) {

	var elm = form_obj.elements[field_name];

	if (elm == null || elm.options == null)
		return "";

	return elm.options[elm.selectedIndex].value;
	
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

/* My plugin */

(function() {
	var url;

	function get(id) {
		return document.getElementById(id);
	}

	window.ExeMath = {
	
		init : function() {
			
			var html = getMathBrowserHTML('srcbrowser', 'latex_source', 'math_font_size', 'src','image','exemath');
			document.getElementById("srcbrowsercontainer").innerHTML = html;

			var f = document.forms[0]; 
			var nl = f.elements; 
			var ed = tinyMCEPopup.editor; 
			var dom = ed.dom; 
			var n = ed.selection.getNode();
			//var fl = tinyMCEPopup.getParam('external_image_list', 'tinyMCEImageList');

			if (n.nodeName == 'IMG') {
			
				nl.src.value = dom.getAttrib(n, 'src');
				nl.width.value = dom.getAttrib(n, 'width');
				nl.height.value = dom.getAttrib(n, 'height');
				nl.alt.value = dom.getAttrib(n, 'alt');
				//nl.title.value = dom.getAttrib(n, 'title');
				nl.vspace.value = this.getAttrib(n, 'vspace');
				nl.hspace.value = this.getAttrib(n, 'hspace');
				nl.border.value = this.getAttrib(n, 'border');
				selectByValue(f, 'align', this.getAttrib(n, 'align'));
				nl.style.value = dom.getAttrib(n, 'style');
				nl.insert.value = ed.getLang('update');
				
				if (ed.settings.inline_styles) {
					// Move attribs to styles
					if (dom.getAttrib(n, 'align'))
						this.updateStyle('align');

					if (dom.getAttrib(n, 'hspace'))
						this.updateStyle('hspace');

					if (dom.getAttrib(n, 'border'))
						this.updateStyle('border');

					if (dom.getAttrib(n, 'vspace'))
						this.updateStyle('vspace');
				}
			}
			
			this.changeAppearance();
			this.showPreviewImage(nl.src.value, 1);
			this.getLatexCode(nl.src.value);
			
		},
		
		getLatexCode : function(src) {
		
			if (src != "") {
				// this is an exemath image to preview, meaning that it should have its .tex at: 
				// resources/eXe_LaTeX_math_#.gif.tex or  ../previews/eXe_LaTeX_math_#.gif.tex
				// request the contents of that file, to update our LaTeX source field:

				var input_filename = src+".tex";
				
				var w = "";
				if (typeof(parent.exe_package_name)!='undefined') w = parent;
				if (w!="") {
					input_filename = "/"+w.exe_package_name+"/"+input_filename;
				}
				
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
				} else {
					alert('No source math found in: ' + input_filename);
				}
				
			}		
		
		},
		
		changeAppearance : function() {
			changeAppearance();		
		},

		showPreviewImage : function(u, st) {
		
			if (!u) {
				tinyMCEPopup.dom.setHTML('prev', '');
				return;
			}

			if (!st && tinyMCEPopup.getParam("advimage_update_dimensions_onchange", true))
				this.resetImageData();

			u = tinyMCEPopup.editor.documentBaseURI.toAbsolute(u);

			if (!st)
				tinyMCEPopup.dom.setHTML('prev', '<img id="previewImg" src="' + u + '" border="0" onload="updateImageData(this);" onerror="resetImageData();" />');
			else
				tinyMCEPopup.dom.setHTML('prev', '<img id="previewImg" src="' + u + '" border="0" onload="updateImageData(this, 1);" />');
		},

		getAttrib : function(e, at) {
			var ed = tinyMCEPopup.editor, dom = ed.dom, v, v2;

			if (ed.settings.inline_styles) {
				switch (at) {
					case 'align':
						if (v = dom.getStyle(e, 'float'))
							return v;

						if (v = dom.getStyle(e, 'vertical-align'))
							return v;

						break;

					case 'hspace':
						v = dom.getStyle(e, 'margin-left')
						v2 = dom.getStyle(e, 'margin-right');

						if (v && v == v2)
							return parseInt(v.replace(/[^0-9]/g, ''));

						break;

					case 'vspace':
						v = dom.getStyle(e, 'margin-top')
						v2 = dom.getStyle(e, 'margin-bottom');
						if (v && v == v2)
							return parseInt(v.replace(/[^0-9]/g, ''));

						break;

					case 'border':
						v = 0;

						tinymce.each(['top', 'right', 'bottom', 'left'], function(sv) {
							sv = dom.getStyle(e, 'border-' + sv + '-width');

							// False or not the same as prev
							if (!sv || (sv != v && v !== 0)) {
								v = 0;
								return false;
							}

							if (sv)
								v = sv;
						});

						if (v)
							return parseInt(v.replace(/[^0-9]/g, ''));

						break;
				}
			}

			if (v = dom.getAttrib(e, at))
				return v;

			return '';
		}		
		
	};

	tinyMCEPopup.requireLangPack();
	
	tinyMCEPopup.onInit.add(function() {
		ExeMath.init();
	});
	
})();