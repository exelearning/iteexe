// Ignacio Gros (http://www.gros.es) for eXeLearning.net
// Based in OtherXtras by José Ramón Jiménez Reyes para eXeLearning.net
(function() {
	tinymce.PluginManager.requireLangPack('blockquoteandcite');
	tinymce.create('tinymce.plugins.BlockQuoteAndCite', {
		init : function(ed, url) {

			ed.addCommand('mceBlockQuoteAndCite', function() {
				ed.windowManager.open({
					file : url + '/blockquoteandcite.htm',
					width : 450,
					height : 320,
					inline : 1
				});
			});
			
			ed.onInit.add(function() {
				if (ed.settings.content_css !== false) ed.dom.loadCSS(url + "/css/content.css");
			});			

			ed.addButton('blockquoteandcite', {title : 'blockquoteandcite.title', cmd : 'mceBlockQuoteAndCite', image : url + '/img/blockquoteandcite.png' });
            
			ed.onNodeChange.add(function(ed, cm, n, co) {
				n = ed.dom.getParent(n,'BLOCKQUOTE');

				cm.setActive('blockquoteandcite', co);
				cm.setActive('blockquoteandcite', 0);
                if (n && n.nodeName=="BLOCKQUOTE") {
                    cm.setActive('blockquoteandcite', true);
                }
			});
            
		},

		getInfo : function() {
			return {
				longname : 'Cite (based in Other Xtras Plugin)',
				author : 'José Ramón Jiménez Reyes (modified by Ignacio Gros)',
				authorurl : '',
				infourl : '',
				version : "1.0"
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('blockquoteandcite', tinymce.plugins.BlockQuoteAndCite);
})();
