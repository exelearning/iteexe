var PasteCodeDialog = {
	init : function() {
		var f = document.forms[0];
		// Get the selected contents as text and place it in the input
		f.htmlSource.value = tinyMCEPopup.editor.selection.getContent({format : 'text'});
	},

	insert : function() {
		var content = document.forms[0].htmlSource.value;
		if (content!="") {
			var c = "<pre><code>"+content.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')+"</code></pre>";
			var wrapper = document.forms[0].wrapper.checked;
			if (wrapper) c = "<div class='pre-code'><div>"+c+"</div></div>";
			tinyMCEPopup.editor.execCommand('mceInsertContent', false, c);
		}
		tinyMCEPopup.close();
	}
};
tinyMCEPopup.onInit.add(PasteCodeDialog.init, PasteCodeDialog);