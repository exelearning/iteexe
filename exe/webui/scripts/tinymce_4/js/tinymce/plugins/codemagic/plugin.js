/**
 *
 *
 * @author Josh Lobe
 * http://ultimatetinymcepro.com
 */
 
jQuery(document).ready(function($) {


	tinymce.PluginManager.add('codemagic', function(editor, url) {
		
		
		editor.addButton('codemagic', {
			
			image: url + '/images/codemagic.png',
			tooltip: 'Code Magic',
			onclick: open_codemagic
		});
		
		function open_codemagic() {
			
			editor.windowManager.open({
					
				title: 'Code Magic',
				width: 900,
				height: 700,
				url: url+'/codemagic.htm'
			})
		}
		
	});
});