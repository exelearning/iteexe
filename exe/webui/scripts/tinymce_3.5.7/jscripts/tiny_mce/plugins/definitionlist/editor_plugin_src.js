(function() {
	tinymce.PluginManager.requireLangPack('definitionlist');
	tinymce.create('tinymce.plugins.DefinitionListPlugin', {
		init : function(ed, url) {
	
			// Register the commands so they can be invoked by using tinyMCE.activeEditor.execCommand('commandName');
			ed.addCommand('mceDefinitionList', function() {

                var se = ed.selection;

                var term = "<dt>"+ed.translate('definitionlist.term')+"</dt>\n<dd>"+ed.translate('definitionlist.definition')+"</dd>\n";
                
                // No selection and not in DL
                var p = ed.dom.getParent(se.getNode(), 'DL');
                if (se.isCollapsed() && !p) {
                    ed.windowManager.confirm(ed.translate('definitionlist.instructions'), function(s){
                        if (s) {
                            var html = '<dl class="exe-dl">\n';
                                html += term;
                                html += "</dl><br />";
                            tinyMCE.execCommand('mceInsertContent', false, html);
                        }
                    });
                } else {
                    
                    var n = ed.dom.getNext(se.getNode(), 'DT');
                    if (n) $(n).before($(term));
                    else $(p).append($(term));
                    
                    p = ed.dom.getParent(se.getNode(), 'DL');
                    var DTs = p.getElementsByTagName("DT");
                    for (i=0;i<DTs.length;i++) {
                        if(DTs[i].innerHTML==ed.translate('definitionlist.term')) {
                            ed.selection.setCursorLocation(DTs[i],1);
                        }
                    }
                }          
            
			});
			

			ed.onInit.add(function() {
				if (ed.settings.content_css !== false) ed.dom.loadCSS(url + "/css/content.css");
			});
			
			// Add an ID to each DT to create links from other pages using JS
			// Set definitionlists_auto_ids : true in the editor configuration if you want the plugin to generate an ID for each DT
			var adIDs = ed.getParam("definitionlists_auto_ids");
			if (adIDs && adIDs==true) {
				
				function getFriendlyURL(t) {
					t = t.replace(/[^\w\s]/gi, '');
					t = t.replace( /\ /g, "-" );
					t = t.toLowerCase();
					return t;
				}
				
				ed.onSaveContent.add(function(ed, o) {
					
					if ($("DT",o.content).length==0) return false;
					
					var c = o.content;
					var w = $('<div id="definitionlist-parser" style="display:none"></div>');
					$("BODY").append(w);
					w.html(c);
					
					$("DT",w).each(function(){
						var p = $(this).parent();
						if (p.length==1 && p.attr("class")=="exe-dl") {
							var t = $(this).text();
							var id = getFriendlyURL(t);
							if (id.length==0) $(this).removeAttr("id");
							else $(this).attr("id",id);
						}
					});
					
					o.content = w.html();
					w.remove();	
					
				});
			}
			// /Add an ID...
	
			// Register plugin buttons
			ed.addButton('definitionlist', {title : 'definitionlist.title', cmd : 'mceDefinitionList', image : url + '/img/definitionlist.gif' });
		},
	
		/**
		 * Returns information about the plugin as a name/value array.
		 * The current keys are longname, author, authorurl, infourl and version.
		 *
		 * @return {Object} Name/value array containing information about the plugin.
		 */
		getInfo : function() {
			return {
				longname : 'Definitions lists',
				author : 'Ignacio Gros',
				authorurl : 'http://www.gros.es',
				version : "1.0"
			};
		}
	});
	
	// Register plugin
	tinymce.PluginManager.add('definitionlist', tinymce.plugins.DefinitionListPlugin);
})();