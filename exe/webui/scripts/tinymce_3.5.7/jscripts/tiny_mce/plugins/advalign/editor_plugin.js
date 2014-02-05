var exe_advalign = {
	check : function(editorID,currentNode,command) {
		if (command=="JustifyLeft" || command=="JustifyCenter" || command=="JustifyRight") {
			if (exe_advalign.isBlock(editorID,currentNode,command)) {
				tinyMCE.Event.preventDefault();
			}
		}
		return false;		
	},
	isBlock : function(editorID,currentNode,command){
		var is = false;
		var c = jQuery(currentNode);
		var e = c.parents();
		var ed = tinyMCE.get(editorID);
		var node = ed.selection.getNode().nodeName;
		if (node!="IMG") return is;
		
		var kA = ed.settings.advalign_class_names_array;
		var pos = command.toLowerCase();
		var k = kA[0];
		if (command=="JustifyCenter") k = kA[1];
		else if (command=="JustifyRight") k = kA[2];		
		
		e.each(function(){
			if(this.className && this.className.indexOf("exe-figure")==0) {
			
				var button = tinyMCE.activeEditor.controlManager.get(pos)
				button.setActive(false);
				
				var currK = jQuery(this).attr("class");
				if (currK.indexOf(" "+k)!=-1) {
					currK = currK.replace(" "+k,"");
				} else {
					for (z=0;z<kA.length;z++) {
						currK = currK.replace(" "+kA[z],"");
					}
					currK += " "+k;
					button.setActive(true);
				}
				var w = this.style.width;
				if (!w) {
					var img = jQuery("IMG",this).eq(0);
					if (img.length==1) {
						alert(img.attr("width"))
						var nW = img.attr("width");
						jQuery(this).css("width",nW);
					}
				}
				this.className = currK;
				is = true;
			}
		});
		
		return is;
	}
};

(function() {
	tinymce.PluginManager.requireLangPack('advalign');
	tinymce.create('tinymce.plugins.AdvAlign', {
		init : function(ed,url) {
			if (ed.settings.execcommand_callback) {
				alert(tinyMCE.i18n[tinyMCE.settings.language+".advalign.execcommand_callback_error"]);
				return false;
			} else if (typeof(jQuery)=='undefined') {	
				alert(tinyMCE.i18n[tinyMCE.settings.language+".advalign.jquery_error"]);
				return false;
			}
			ed.settings.execcommand_callback = exe_advalign.check;
			
			var defaultClassNames = "position-left,position-center,position-right";
			if (!ed.settings.advalign_class_names) ed.settings.advalign_class_names = defaultClassNames;
			ed.settings.advalign_class_names_array = new Array();
			var cN = ed.settings.advalign_class_names.split(",");
			if (cN.length!=3) cN = defaultClassNames.split(",");
			for (x=0;x<cN.length;x++) {
				ed.settings.advalign_class_names_array.push(cN[x]);
			}
		},
		createControl : function(n, cm) {
			return null;
		},
		getInfo : function() {
			return {
				longname : 'Advanced Alignment',
				author : 'José Miguel Andonegi & Ignacio Gros',
				authorurl : 'http://www.ulhi.hezkuntza.net/web/guest/inicio1',
				infourl : '',
				version : "1.0"
			};
		}
	});
	tinymce.PluginManager.add('advalign', tinymce.plugins.AdvAlign);
})();