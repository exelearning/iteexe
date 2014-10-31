/*
 * eXeLearning Style Designer 1.0
 * By Ignacio Gros (http://www.gros.es/) for eXeLearning (http://exelearning.net/)
 * Creative Commons Attribution-ShareAlike (http://creativecommons.org/licenses/by-sa/3.0/)
 */
var $designer = {
	init : function(){	
		var sd_style = "base";
		var sd_href= window.location.href;
		var sd_href_parts = sd_href.split("?style=");
		if (sd_href_parts.length==2) sd_style = sd_href_parts[1];
		this.styleId = sd_style;
	},
	printStyles : function(type){
		document.write('<link rel="stylesheet" type="text/css" href="/style/base.css" />');
		document.write('<link rel="stylesheet" type="text/css" href="/style/'+this.styleId+'/content.css" />');
		if (type=='website') document.write('<link rel="stylesheet" type="text/css" href="/style/'+this.styleId+'/nav.css" />');
	},
	printExtraBody : function(){
		this.disableAllLinks();
		document.write('<script type="text/javascript" src="/style/'+this.styleId+'/_my_js.js"></script>');
		this.openDesigner();
	},
	disableAllLinks : function(){
		$("A","#content").click(function(){
			return false;
		});
	},
	openDesigner : function(){
		// Settings
		var mypage="/tools/style-designer/";
		var myname="eXeLearning_Style_Designer";
		var w=650;
		var h=500;
		var features="";
		// / Settings
		var win = null;
		var winl = (screen.width-w)/2;
		var wint = (screen.height-h)/2;
		if (winl < 0) winl = 0;
		if (wint < 0) wint = 0;
		var settings = 'height=' + h + ',';
		settings += 'width=' + w + ',';
		settings += 'top=' + wint + ',';
		settings += 'left=' + winl + ',';
		settings += features;
		win = window.open(mypage,myname,settings);
		if (win) win.focus();
	}
}
$designer.init();