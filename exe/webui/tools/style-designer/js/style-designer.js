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
	},
	disableAllLinks : function(){
		$("A","#content").click(function(){
			return false;
		});
	}
}
$designer.init();