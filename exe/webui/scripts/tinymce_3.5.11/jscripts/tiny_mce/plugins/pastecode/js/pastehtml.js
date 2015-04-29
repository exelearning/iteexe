var PasteHtmlDialog = {
	init : function() {
		var f = document.forms[0];
		// Get the selected contents as text and place it in the input
		f.htmlSource.value = tinyMCEPopup.editor.selection.getContent({format : 'text'});
	},
	insert : function() {
		var content = document.forms[0].htmlSource.value;
		tinyMCEPopup.editor.execCommand('mceInsertContent', false, content);
		tinyMCEPopup.close();
	}
};
tinyMCEPopup.onInit.add(PasteHtmlDialog.init, PasteHtmlDialog);