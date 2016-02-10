var PasteCodeDialog = {
	init : function() {
		var f = document.forms[0];
		var sel = tinyMCEPopup.editor.selection;
		var node = sel.getNode();
		
		// Get the selected contents as text and place it in the input
		var v = sel.getContent({format : 'text'});
		PasteCodeDialog.initialValue = v;
		PasteCodeDialog.isCodeTag = false;
		PasteCodeDialog.isInPRE = false;
		PasteCodeDialog.isWrapped = false;
		
		if (node.nodeName=="CODE"){
			PasteCodeDialog.isCodeTag = true;
			var c = node.innerHTML;
			c = c.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
			v = c;
			var wrapper = document.forms[0].wrapper;
			
			// Check if it's  <pre><code></code></pre> and if it has wrapper
			var pre = node.parentNode;
			if (pre.nodeName == "PRE") {
				
				PasteCodeDialog.isInPRE = true;
				wrapper.checked = false;
				
				var block = pre.parentNode.parentNode;
				var k = block.className;
				if (block.nodeName=="DIV" && (k=="pre-code" || k.indexOf("highlighted-code")==0)) {
					PasteCodeDialog.isWrapped = true;
					wrapper.checked = true;
					// Syntax highlighting
					if (k.indexOf("highlighted-code")==0) {
						document.forms[0].highlight.checked = true;
						// Trigger onchange
						PasteCodeDialog.toggle('highlightOptions',true);
						// Check the highlighting options
						// highlighted-code code-style-2 language-js line-numbers hightlight-1-2and5
						if (k.indexOf(" code-style-2")!=-1) document.getElementById("highlightTheme").value = "code-style-2"; // Dark
						if (k.indexOf(" language-")!=-1) {
							var lang = k.split("language-");
							if (lang.length>1) {
								lang = lang[1].split(" ");
								lang = lang[0];
								if (lang!="") document.getElementById("highlightLang").value = lang;
							}
						}
						if (k.indexOf(" line-numbers")!=-1) {
							document.forms[0].highlightLineNo.checked = true;
						}
						if (k.indexOf(" hightlight-")!=-1) {
							var lines = k.split(" hightlight-");
							if (lines.length>1) {
								lines = lines[1].split(" ");
								lines = lines[0];
								if (lines!="") {
									lines = lines.replace(/\and/g, ',');
									document.getElementById("highlightLines").value = lines;
								}
							}
						}
					} // / Syntax highlighting
				} else {
					PasteCodeDialog.toggle('highlightCheck',false);
				}
				
			} else {
				wrapper.checked = false;
			}
			
		} else {
			// PasteCodeDialog.isCodeTag == false
			// New content... Remember the user's preferences:
			var cookie = tinymce.util.Cookie;
			var _c = cookie.get("tinymcePasteCodePluginOptions")
			if (_c) {
				var _c = _c.split("|");
				if (_c.length==5) { // In case there are different versions of the plugin
					var wrapper = _c[0]; // wrapper
					if (wrapper=="true") {
						
						wrapper.checked = true;
						PasteCodeDialog.toggle('highlightCheck',true);
						
						var highlight = _c[1]; // highlight
						if (highlight=="true") {
							
							document.forms[0].highlight.checked = true;
							PasteCodeDialog.toggle('highlightOptions',true);
							
							var lang = _c[2]; // lang
							if (lang!="") {
								document.forms[0].highlightLang.value = lang;
							}
							
							var skin = _c[3]; // skin
							if (skin!="") {
								document.forms[0].highlightTheme.value = skin;
							}
							
							var showLines = _c[4]; // showLines
							if (showLines=="true") {
								document.forms[0].highlightLineNo.checked = true;
							}
							
						}
					}
				}
			}
		}
		
		f.htmlSource.value = v;
	},
	
	checkPageRange : function(e) {
		var v = e.value;
		var l = v[v.length-1];
		if (l!="," && l!="-" && l!="0" && l!="1" && l!="2" && l!="3" && l!="4" && l!="5" && l!="6" && l!="7" && l!="8" && l!="9") e.value = v.replace(v.slice(-1), "");
	},
	
	toggle : function(id,val) {
		var optionsAreVisible = false;
		var display = "none";
		if (val==true) {
			display = "block";
			if (id=="highlightCheck") {
				display = "inline"; // It's a SPAN
				if (document.forms[0].highlight.checked) {
					document.getElementById("highlightOptions").style.display = "block";
					optionsAreVisible = true;
				}
			} else if (id=="highlightOptions") {
				optionsAreVisible = true;
			}
			
		} else {
			if (id=="highlightCheck") document.getElementById("highlightOptions").style.display = "none";
		}
		document.getElementById(id).style.display=display;
		var h = "250";
		if (optionsAreVisible) h = "149";
		document.getElementById("htmlSource").style.height = h+"px";
	},

	insert : function() {
		var content = document.forms[0].htmlSource.value;
		if (content!="") {
			
			var ed = tinyMCEPopup.editor;
			var t = content.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
			var wrapper = document.forms[0].wrapper.checked;
			var highlight = document.forms[0].highlight.checked;
			var lang = document.forms[0].highlightLang.value;
			var skin = document.forms[0].highlightTheme.value;
			var showLines = document.forms[0].highlightLineNo.checked;
			var linesToShow = document.forms[0].highlightLines.value;			
			var extra = "";
			if (!PasteCodeDialog.isCodeTag) extra = "<br />";
			var c = "<pre><code>"+t+"</code></pre>"+extra;
			
			if (wrapper) {
				var defaultClass = "pre-code";
				if (highlight) {
					defaultClass = "highlighted-code";
					// Dark or default
					if (skin!="") defaultClass += " "+skin;
					// Language
					if (lang!="") defaultClass += " language-"+lang;
					// Show line numbers + Highlight specific lines
					if (showLines || linesToShow!="") {
						defaultClass += " line-numbers";
						if (linesToShow!="") {
							defaultClass += " hightlight-"+linesToShow.replace(/\,/g, 'and');
						}
					}
				}
				c = "<div class='"+defaultClass+"'><div><pre><code>"+t+"</code></pre></div></div>"+extra;
			} else {
				if (PasteCodeDialog.initialValue!="") c = "<code>"+t+"</code>";
			}
			
			// Set the cookie to remember the user's preferences (wrapper, highlight, lang, skin, showLines)
			var cookie = tinymce.util.Cookie;
			var cValue = wrapper+"|"+highlight+"|"+lang+"|"+skin+"|"+showLines;
			cookie.set("tinymcePasteCodePluginOptions", cValue, new Date(new Date().getFullYear() + 1, 12, 31))			
			
			if (PasteCodeDialog.isCodeTag==false) {
			
				ed.execCommand('mceInsertContent', false, c);
				
			} else {
				
				var node = ed.selection.getNode();
				var pre = node.parentNode;
				var block = pre.parentNode.parentNode;
				
				// The  current CODE tag is inside a PRE tag
				if (PasteCodeDialog.isInPRE) {
					if (wrapper) {
						if (PasteCodeDialog.isWrapped) {
							// It's wrapped, so we just update the content and the class of the wrapper
							node.innerHTML = t;
							block.className = defaultClass;
						} else {
							// It's a PRE tag, but not wrapped, so we wrap it
							ed.dom.remove(pre);
							ed.execCommand('mceInsertContent', false, c);
						}
					} else {
						if (PasteCodeDialog.isWrapped) {
							// It was wrapped, so we remove the wrapper and just add the new content
							ed.dom.remove(block);
							ed.execCommand('mceInsertContent', false, c);
						} else {
							// It has no wrapper, so we just update the content
							node.innerHTML = t;
						}
					}
				} else {
					// The  current CODE tag is not inside a PRE tag
					if (wrapper) {
						// It has no wrapper, so we wrap it
						ed.dom.remove(node);
						ed.execCommand('mceInsertContent', false, c);
					} else {
						// We just update the content
						node.innerHTML = t;
					}
				}
				
			}
		}
		tinyMCEPopup.close();
	}
};
tinyMCEPopup.onInit.add(PasteCodeDialog.init, PasteCodeDialog);