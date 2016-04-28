/* 
	exelearning's exemath plugin for TinyMCE 3.5.4.1
	Adapted by Ignacio Gros (http://www.gros.es) 
	eXeLearning version: intef6.2 (available at https://forja.cenatic.es/frs/?group_id=197) 
	Last eXeLearning version download page: http://exelearning.net/descargas/
*/
(function() {
	tinymce.PluginManager.requireLangPack('exemath');
	tinymce.create('tinymce.plugins.eXeMathPlugin', {
		init : function(ed, url) {
			
			// Register commands
			ed.addCommand('mceExeMath', function() {
				ed.windowManager.open({
					file : url + '/exemath.htm',
					width : 650,
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
				//author : 'Moxiecode / eXeLearning.org / Gros.es',
				author : 'See plugin code',				
				//infourl : '',
				version : tinymce.majorVersion + "." + tinymce.minorVersion
			};
		},
	
	});

	// Register plugin
	tinymce.PluginManager.add('exemath', tinymce.plugins.eXeMathPlugin);
})();