/*
 * Effects Plugin for eXeLearning
 * By Ignacio Gros (http://www.gros.es/) for eXeLearning (http://exelearning.net/)
 * Creative Commons Attribution-ShareAlike (http://creativecommons.org/licenses/by-sa/3.0/)
 */
var eXeEffects = {
	values : [
		'accordion',
		'tabs',
		'paginated',
		'carousel'
	],
	init : function() {
		mcTabs.displayTab('general_tab','general_panel');
		this.enableTypeChange();
		this.showTypeOptions();
		this.getCurrentValues();
	},	
	getCurrentValues : function(){
		
		if (!parent) {
			alert(tinyMCEPopup.getLang("exeeffects.inline_popups_plugin_is_required"));
			return false;
		}
		if (typeof(parent.jQuery)!='function') {
			alert(tinyMCEPopup.getLang("exeeffects.jquery_is_required"));
			return false;			
		}
		
		var inst = tinyMCEPopup.editor;
		var elm = inst.selection.getNode();
		var $j = parent.jQuery;
		var e = $j(elm);
		
		var inside = false;
		var vals = this.values;
		var parents;
		var classToSelect;
		for (var i=0;i<vals.length;i++) {
			parents = e.parents(".exe-"+vals[i]);
			if (parents.length>0) {
				inside = true;	
				classToSelect = "exe-"+vals[i];
			}
		}
		
		if (inside) {
			document.getElementById("insert").value=tinyMCEPopup.getLang("exeeffects.update");
			var radios = document.getElementsByName("type");
			for (var i = 0, length = radios.length; i < length; i++) {
				if (radios[i].className==classToSelect) {
					$j(radios[i]).prop("checked",true).trigger("change");
				}
			}
		}
		
	},
	insert : function(){
		
		if (!parent) {
			alert(tinyMCEPopup.getLang("exeeffects.inline_popups_plugin_is_required"));
			return false;
		}
		if (typeof(parent.jQuery)!='function') {
			alert(tinyMCEPopup.getLang("exeeffects.jquery_is_required"));
			return false;			
		}
		
		var inst = tinyMCEPopup.editor;
		var type = this.getSelectedOption("type");
		var classToAdd = "exe-"+this.values[(parseInt(type.replace("type",""))-1)];
		var elm = inst.selection.getNode();
		var $j = parent.jQuery;
		var e = $j(elm);
		
		var inside = false;
		var vals = this.values;
		var parents;
		var classToRemove;
		for (var i=0;i<vals.length;i++) {
			parents = e.parents(".exe-"+vals[i]);
			if (parents.length>0) {
				inside = true;	
				classToRemove = "exe-"+vals[i];
			}
		}
		
		if (inside) {
			var div = e.parents("."+classToRemove);
			div.attr("class",div.attr("class").replace(classToRemove,classToAdd));
			// alert(div.attr("class").replace(classToRemove,classToAdd))			
		} else {
			var c = '<div class="exe-fx '+classToAdd+'">';
				c += '<h2>'+tinyMCEPopup.getLang("exeeffects.h2")+'</h2>';
				c += '<p>'+tinyMCEPopup.getLang("exeeffects.write_your_content")+'</p>';
				c += '<h2>'+tinyMCEPopup.getLang("exeeffects.h2")+'</h2>';
				c += '<p>'+tinyMCEPopup.getLang("exeeffects.write_your_content")+'</p>';				
			c += '</div>';
			inst.execCommand('mceInsertContent', false, c);			
		}
		tinyMCEPopup.execCommand("mceEndUndoLevel");
		tinyMCEPopup.close();
	},
	enableTypeChange : function(){
		var x;
		var w = document.getElementById("types");
		var i = w.getElementsByTagName("INPUT");
		for (x=0;x<i.length;x++) {
			i[x].onchange = function(){
				eXeEffects.showTypeOptions(this.value);
			}
		}
	},
	getSelectedOption : function(n){
		var radios = document.getElementsByName(n);
		for (var i = 0, length = radios.length; i < length; i++) {
			if (radios[i].checked) {
				return radios[i].value;
				break;
			}
		}	
	},	
	showTypeOptions : function(id) {
		if (!id) var id = this.getSelectedOption("type");
		document.getElementById("type-thumb").src="img/"+id+".png";		
		document.getElementById("type-desc").innerHTML = document.getElementById(id+"-desc").innerHTML;
	}	
}
tinyMCEPopup.onInit.add(eXeEffects.init, eXeEffects);