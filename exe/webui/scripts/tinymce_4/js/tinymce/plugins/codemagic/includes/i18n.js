/**
 *
 *
 * @author Ignacio Gros
 * http://gros.es
 */
 
var $codeMagicLangs = {
	template : function(templateid){
		return document.getElementById(templateid).innerHTML.replace(/%(\w*)%/g,
		function(m,key){
			var str = key.replace(/_/g," ");
			if (parent && parent.tinyMCE) return parent.tinyMCE.translate(str);
			return str;
		});
	},
	init : function(){
		document.getElementById("body").innerHTML=this.template("body");
	}
};

jQuery(function(){
	$codeMagicLangs.init();
});