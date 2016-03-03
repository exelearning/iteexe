var PasteCodeDialog = {
	init : function() {
		
		// To review
		_ = parent._;
		var body = document.body;
		body.innerHTML=this.i18n();
		body.style.display="block";
		// / To review
		
		this.popup = parent.tinymce.activeEditor.windowManager.getWindows()[0];		
		var sel = parent.tinymce.activeEditor.selection;
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
				if (block.nodeName=="DIV" && block.className=="pre-code") {
					PasteCodeDialog.isWrapped = true;
					wrapper.checked = true;
				}
				
			} else {
				wrapper.checked = false;
			}
			
		}
		// Set the content
		document.forms[0].htmlSource.value = v;
	},
	getString : function(str) {
		return parent.tinymce.EditorManager.i18n.data.all[str];
	},
	i18n : function(){
		var data = parent.tinymce.EditorManager.i18n.data.all;
		return document.body.innerHTML.replace(/{#pastecode.(\w*)}/g,
		function(m,key){
			return data.hasOwnProperty(key)?data[key]:"";
		});
	},
	insert : function() {
		var content = document.forms[0].htmlSource.value;
		if (content!="") {
			
			var ed = parent.tinymce.activeEditor;
			var t = content.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
			var wrapper = document.forms[0].wrapper.checked;
			var c = "<pre><code>"+t+"</code></pre><br />";
			
			if (wrapper) c = "<div class='pre-code'><div><pre><code>"+t+"</code></pre></div></div><br />";
			else {
				if (PasteCodeDialog.initialValue!="") c = "<code>"+t+"</code>";
			}
			
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
							// It's wrapped, so we just update the content
							node.innerHTML = t;
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
		this.popup.close();
	},
	close : function(){
		this.popup.close();
	}
};
window.onload = function(){
	PasteCodeDialog.init();
}