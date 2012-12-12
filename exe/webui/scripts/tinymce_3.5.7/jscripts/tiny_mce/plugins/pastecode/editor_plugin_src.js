(function() {
	tinymce.PluginManager.requireLangPack('pastecode');
	tinymce.create('tinymce.plugins.PasteCodePlugin', {
		init : function(ed, url) {
	
			// Register the commands so they can be invoked by using tinyMCE.activeEditor.execCommand('commandName');
			ed.addCommand('mcePasteCode', function() {
				ed.windowManager.open({
					file : url + '/pastecode.htm',
					width : 500,
					height : 400,
					inline : 1
				}, {
					plugin_url : url // Plugin absolute URL
				});
			});
			ed.addCommand('mcePasteHtml', function() {
				ed.windowManager.open({
					file : url + '/pastehtml.htm',
					width : 500,
					height : 400,
					inline : 1
				}, {
					plugin_url : url // Plugin absolute URL
				});
			});

			ed.onInit.add(function() {
				if (ed.settings.content_css !== false) ed.dom.loadCSS(url + "/css/content.css");
			});
	
			// Register plugin buttons
			ed.addButton('pastehtml', {title : 'pastecode.paste_html_desc', cmd : 'mcePasteHtml', image : url + '/img/pastehtml.gif' });
			ed.addButton('pastecode', {title : 'pastecode.paste_code_desc', cmd : 'mcePasteCode', image : url + '/img/pastecode.gif' });
		},
	
		/**
		 * Returns information about the plugin as a name/value array.
		 * The current keys are longname, author, authorurl, infourl and version.
		 *
		 * @return {Object} Name/value array containing information about the plugin.
		 */
		getInfo : function() {
			return {
				longname : 'Paste code',
				author : 'Ignacio Gros',
				authorurl : 'http://www.gros.es',
				version : "2.0"
			};
		}
	});
	
	// Register plugin
	tinymce.PluginManager.add('pastecode', tinymce.plugins.PasteCodePlugin);
})();