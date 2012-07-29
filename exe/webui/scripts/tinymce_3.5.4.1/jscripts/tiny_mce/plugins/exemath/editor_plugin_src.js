(function() {
	tinymce.PluginManager.requireLangPack('exemath');
	tinymce.create('tinymce.plugins.eXeMathPlugin', {
		init : function(ed, url) {
			
			// Register commands
			ed.addCommand('mceExeMath', function() {
				ed.windowManager.open({
					file : url + '/exemath.htm',
					width : 600,
					height : 620,
					inline : 1
				}, {
					plugin_url : url					
				});
			});

			// Register buttons
			ed.addButton('exemath', {title : 'exemath.desc', cmd : 'mceExeMath', image : url + '/img/exemath.gif' });

		},

		getInfo : function() {
			return {
				longname : 'eXeMath 2.0',
				author : 'Ignacio Gros',
				authorurl : 'http://www.gros.es/',
				//infourl : '',
				version : tinymce.majorVersion + "." + tinymce.minorVersion
			};
		},
	
	});

	// Register plugin
	tinymce.PluginManager.add('exemath', tinymce.plugins.eXeMathPlugin);
})();