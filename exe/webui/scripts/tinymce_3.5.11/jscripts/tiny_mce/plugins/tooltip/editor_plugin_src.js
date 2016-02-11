(function() {
	tinymce.PluginManager.requireLangPack('tooltip');
	tinymce.create('tinymce.plugins.TooltipPlugin', {
		init : function(ed, url) {
	
			// Register the commands so they can be invoked by using tinyMCE.activeEditor.execCommand('commandName');
			ed.addCommand('mceTooltip', function() {
				
				var se = ed.selection;
				// No selection and not in link
				if (se.isCollapsed() && !ed.dom.getParent(se.getNode(), 'A')) {
					ed.windowManager.alert('tooltip.selection_error');
					return;
				}
					
				ed.windowManager.open({
					file : url + '/tooltip.htm',
					width : 500,
					height : 400,
					inline : 1
				}, {
					plugin_url : url // Plugin absolute URL
				});
			});

			ed.onInit.add(function() {
				if (ed.settings.content_css !== false) ed.dom.loadCSS(url + "/css/content.css");
				// i18n in CSS (type names in the right language)
				if (typeof(jQuery)!='function') {
					alert(ed.getLang("tooltip.jquery_is_required"));
					return false;			
				}
				var d = ed.getDoc();
				var s = '<style type="text/css">';
					s += '.exe-tooltip-text:before{content:"'+ed.getLang("tooltip.title")+' - '+ed.getLang("tooltip.type2")+'"}';
				s += '</style>';
				jQuery("HEAD",d).append(s);				
			});
	
			// Register plugin buttons
			ed.addButton('tooltip', {title : 'tooltip.title', cmd : 'mceTooltip', image : url + '/img/tooltip.gif' });
		},
	
		/**
		 * Returns information about the plugin as a name/value array.
		 * The current keys are longname, author, authorurl, infourl and version.
		 *
		 * @return {Object} Name/value array containing information about the plugin.
		 */
		getInfo : function() {
			return {
				longname : 'Tooltips',
				author : 'Ignacio Gros',
				authorurl : 'http://www.gros.es',
				version : "2.0"
			};
		}
	});
	
	// Register plugin
	tinymce.PluginManager.add('tooltip', tinymce.plugins.TooltipPlugin);
})();