// Games Plugin for eXeLearning
// By Ignacio Gros (http://www.gros.es/) for eXeLearning (http://exelearning.net/)
// Creative Commons Attribution-ShareAlike (http://creativecommons.org/licenses/by-sa/3.0/)
(function() {
	tinymce.PluginManager.requireLangPack('exegames');
	tinymce.create('tinymce.plugins.eXeGames', {
		init : function(ed, url) {
	
			// Register the commands so they can be invoked by using tinyMCE.activeEditor.execCommand('commandName');
			ed.addCommand('mceGamesHandler', function() {
				
				var se = ed.selection;
				// No selection and not in link
				if (se.isCollapsed() && !ed.dom.getParent(se.getNode(), 'A')) {
					// ed.windowManager.alert('tooltip.selection_error');
					// return;
				}
					
				ed.windowManager.open({
					file : url + '/exegames.htm',
					width : 550,
					height : 400,
					inline : 1
				}, {
					plugin_url : url // Plugin absolute URL
				});
			});

			ed.onInit.add(function() {
				if (ed.settings.content_css !== false) ed.dom.loadCSS(url + "/css/content.css");
				// i18n in CSS (We want the name of the games in the right language)
				if (typeof(jQuery)!='function') {
					alert(ed.getLang("exegames.jquery_is_required"));
					return false;			
				}
				var d = ed.getDoc();
				var s = '<style type="text/css">';
					s += '.exe-hangman:before{content:"'+ed.getLang("exegames.hangman")+'"}';
				s += '</style>';
				jQuery("HEAD",d).append(s);
			});			
	
			// Register plugin buttons
			ed.addButton('exegames', {title : 'exegames.title', cmd : 'mceGamesHandler', image : url + '/img/exegames.png' });
		},
	
		/**
		 * Returns information about the plugin as a name/value array.
		 * The current keys are longname, author, authorurl, infourl and version.
		 *
		 * @return {Object} Name/value array containing information about the plugin.
		 */
		getInfo : function() {
			return {
				longname : 'eXe Games',
				author : 'Ignacio Gros',
				authorurl : 'http://www.gros.es',
				version : "1.0"
			};
		}
	});
	
	// Register plugin
	tinymce.PluginManager.add('exegames', tinymce.plugins.eXeGames);
})();