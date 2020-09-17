// Babel 2.3.4 (Windows) finds the string to translate
// Babel 2.4.0 (Ubuntu) does not
justAnExample('example', function() {
	
	example = {
		
		test : function(){
			
			win = editor.windowManager.open({
				title: _('String to translate A'),
				width: 600,
				height: 350
			});
			example.getValues();
			
		}
		
	}
	
	editor.addButton('example', {
		image: url + '/img/example.png',
		tooltip: _('String to translate A'),
		onclick: example.doSomething
	});
	
});