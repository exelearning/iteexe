/**
 * plugin.js
 *
 * Copyright 2013, Daniel Thies
 * Released under LGPL License.
 *
 */

tinymce.PluginManager.add('mathslate', function(editor,url) {

        if ((typeof M === 'object') && M.mathslateURL) {
            url = M.mathslateURL;
        }

	function showDialog() {

                var cssId, linkElm, dom=editor.dom,math;

		var win, mathEditor={output: null};

		win = editor.windowManager.open({
			title: "Math Editor",
			spacing: 10,
			padding: 10,
			width: 525,
			height: 500,
                        url: url + '/mathslate.html',
			buttons: [
				{text: "Insert Inline", onclick: function() {
                                        editor.execCommand('mceInsertContent', 
                                            false, '\\('+
                                            mathEditor.output('tex')
                                            +'\\)');
					win.close();
                                        }
				},
				{text: "Insert Display", onclick: function() {
                                        editor.execCommand('mceInsertContent', 
                                            false, '\\['+
                                            mathEditor.output('tex')
                                            +'\\]');
					win.close();
                                        }
				},
				{text: "Cancel", onclick: function() {
					win.close();
                                        }
				}
			]
		},
                mathEditor
                );
	}

	editor.addButton('mathslate', {
                image : url + '/img/mathslate.png',
		tooltip: 'Insert Math',
		onclick: showDialog
	});

	editor.addMenuItem('mathslate', {
                image : url + '/img/mathslate.png',
		text: 'Insert Math',
		onclick: showDialog,
		context: 'insert'
	});
});
