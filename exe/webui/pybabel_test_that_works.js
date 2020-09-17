// Babel 2.3.4 (Windows) finds the string to translate
// Babel 2.4.0 (Ubuntu) finds the string to translate
justAnExample('example', function() {
	
	example = {
		
		i18n : {
			stringToTranslate : _("String to translate B")
		},		
		
		test : function(){
			
			win = editor.windowManager.open({
				title: example.i18n.stringToTranslate,
				width: 600,
				height: 350
			});
			example.getValues();
			
		}
		
	}
	
	editor.addButton('example', {
		image: url + '/img/example.png',
		tooltip: example.i18n.stringToTranslate,
		onclick: example.doSomething
	});
	
});