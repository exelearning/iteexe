(function() {
	tinymce.PluginManager.requireLangPack('addcontent');
	tinymce.create('tinymce.plugins.AddContent', {
		init : function(ed, url) {
	
			// Register the commands so they can be invoked by using tinyMCE.activeEditor.execCommand('commandName');
			ed.addCommand('mceAddContent', function() {
				tinyMCE.activeEditor.dom.add(tinyMCE.activeEditor.getBody(), 'p', {}, '...');
			});
	
			// Register plugin buttons
			ed.addButton('addcontent', {title : 'addcontent.add_content', cmd : 'mceAddContent', image : url + '/img/addcontent.png' });
		},
	
		/**
		 * Returns information about the plugin as a name/value array.
		 * The current keys are longname, author, authorurl, infourl and version.
		 *
		 * @return {Object} Name/value array containing information about the plugin.
		 */
		getInfo : function() {
			return {
				longname : 'Add Content',
				author : 'Philipp Urlich',
				authorurl : 'http://soma.urlich.ch/',
				version : "1.0"
			};
		}
	});
	
	// Register plugin
	tinymce.PluginManager.add('addcontent', tinymce.plugins.AddContent);
})();