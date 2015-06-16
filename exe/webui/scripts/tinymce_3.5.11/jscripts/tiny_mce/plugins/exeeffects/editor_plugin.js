// Effects Plugin for eXeLearning
// By Ignacio Gros (http://www.gros.es/) for eXeLearning (http://exelearning.net/)
// Creative Commons Attribution-ShareAlike (http://creativecommons.org/licenses/by-sa/3.0/)
(function() {
	tinymce.PluginManager.requireLangPack('exeeffects');
	tinymce.create('tinymce.plugins.eXeEffects', {
		init : function(ed, url) {
	
			// Register the commands so they can be invoked by using tinyMCE.activeEditor.execCommand('commandName');
			ed.addCommand('mceEffectHandler', function() {
				
				var se = ed.selection;
				// No selection and not in link
				if (se.isCollapsed() && !ed.dom.getParent(se.getNode(), 'A')) {
					// ed.windowManager.alert('tooltip.selection_error');
					// return;
				}
					
				ed.windowManager.open({
					file : url + '/exeeffects.htm',
					width : 500,
					height : 400,
					inline : 1
				}, {
					plugin_url : url // Plugin absolute URL
				});
			});

			ed.onInit.add(function() {
				if (ed.settings.content_css !== false) ed.dom.loadCSS(url + "/css/content.css");
				// i18n in CSS (We want the name of the effects in the right language)
				if (typeof(jQuery)!='function') {
					alert(ed.getLang("exeeffects.jquery_is_required"));
					return false;			
				}
				var d = ed.getDoc();
				var s = '<style type="text/css">';
					s += '.exe-fx.exe-accordion:before{content:"'+ed.getLang("exeeffects.type1")+'"}';
					s += '.exe-fx.exe-tabs:before{content:"'+ed.getLang("exeeffects.type2")+'"}';
					s += '.exe-fx.exe-paginated:before{content:"'+ed.getLang("exeeffects.type3")+'"}';
					s += '.exe-fx.exe-carousel:before{content:"'+ed.getLang("exeeffects.type4")+'"}';
				s += '</style>';
				jQuery("HEAD",d).append(s);
			});			
	
			// Register plugin buttons
			ed.addButton('exeeffects', {title : 'exeeffects.title', cmd : 'mceEffectHandler', image : url + '/img/exeeffects.png' });
		},
	
		/**
		 * Returns information about the plugin as a name/value array.
		 * The current keys are longname, author, authorurl, infourl and version.
		 *
		 * @return {Object} Name/value array containing information about the plugin.
		 */
		getInfo : function() {
			return {
				longname : 'eXe Effects',
				author : 'Ignacio Gros',
				authorurl : 'http://www.gros.es',
				version : "1.0"
			};
		}
	});
	
	// Register plugin
	tinymce.PluginManager.add('exeeffects', tinymce.plugins.eXeEffects);
})();