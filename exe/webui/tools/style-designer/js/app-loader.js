/*
 * eXeLearning Style Designer 1.0
 * By Ignacio Gros (http://www.gros.es/) for eXeLearning (http://exelearning.net/)
 * Creative Commons Attribution-ShareAlike (http://creativecommons.org/licenses/by-sa/3.0/)
 */
var $designer = {
	langs : ['en'], // langs : ['en','es',...], (use that if you want the Web Designer to use its own translations instead of eXe's translation mechanism)
	init : function(){
		var lang = "en";
		var sd_style = "base";
		var sd_href= window.location.href;
		var sd_href_params = this.getUrlVars(sd_href);
		if (sd_href_params['style']) {
			sd_style = sd_href_params['style'];	
		}
		this.styleId = sd_style;
		this.styleBasePath = "/style/"+sd_style+"/";
		// Get lang
		sd_href_parts = sd_href.split("lang=");
		if (sd_href_parts.length==2) {
			if (sd_href_parts[1]!="") {
				for (var i=0;i<this.langs.length;i++) {
					if (this.langs[i]===sd_href_parts[1]) lang = this.langs[i];
				}
			}
		}
		this.language = lang;
		this.getConfig();
	},
	getUrlVars : function(url) {
		// Read a page's GET URL variables and return them as an associative array.
	    var vars = [], hash;
	    var hashes = url.slice(window.location.href.indexOf('?') + 1).split('&');
	    for(var i = 0; i < hashes.length; i++)
	    {
	        hash = hashes[i].split('=');
	        vars.push(hash[0]);
	        vars[hash[0]] = hash[1];
	    }
	    return vars;
	},
	isBrowserCompatible : function(){
		var n = navigator.userAgent.toLowerCase();
		n = (n.indexOf('msie') != -1) ? parseInt(n.split('msie')[1]) : false;
		if (n && n<7) return false;
		return true;
	},
	addStylePath : function(c){
		var p = "/style/"+this.styleId+"/";
		c = c.replace(/url\(http:/g,'url--http:');
		c = c.replace(/url\(https:/g,'url--https:');
		c = c.replace(/url\(/g,'url('+p);
		c = c.replace(/url--http:/g,'url(http:');
		c = c.replace(/url--https:/g,'url(https:');
		return c;
	},	
	getStylesContent : function(type){
		var url = "/style/"+this.styleId+"/"+type+".css";
		var tag = document.getElementById("my-"+type+"-css");$.ajax({
			type: "GET",
			url: url,
			success: function(res){
				res = $designer.addStylePath(res);
				if (this.isOldBrowser) tag.cssText = res;
				else tag.innerHTML = res;
				if (type=="content") $designer.contentCSS = res;
				else $designer.navCSS = res;
			}
		});
	},
	config : {
		// It has to be defined or it won't work in IE 11
	},
	getConfig : function(){
		if (this.styleId == 'base') {
			// Use default name, author and description: 'base' style has some custom
			// values in author and description, not really suitable as starting template
			var styleConfig = {};
			
			styleConfig.styleName = '';
			
			styleConfig.authorName = 'eXeLearning.net';
			styleConfig.authorURL = 'http://exelearning.net';
			
			styleConfig.styleDescription = '';
			
			styleConfig.styleVersion = '1.0';
			var version = styleConfig.styleVersion.split('.');
			styleConfig.styleVersionMajor = version[0];
			styleConfig.styleVersionMinor = version[1];
			
			$designer.config = styleConfig;
		}
		else {
			// Load from config.xml 
			var url = "/style/"+this.styleId+"/config.xml";
			$.ajax({
				type: "GET",
				url: url,
				success: function(config){
					var styleConfig = {};
					
					var styleName = this.styleId;
					var name = $(config).find('name');
					if (name.length==1) styleName = name.eq(0).text()
					styleConfig.styleName = styleName;
				
					var authorName = "eXeLearning.net";
					var author = $(config).find('author');
					if (author.length==1) authorName = author.eq(0).text()
					styleConfig.authorName = authorName;	

					var authorURL = "http://exelearning.net";
					var url = $(config).find('author-url');
					if (url.length==1) authorURL = url.eq(0).text()
					styleConfig.authorURL = authorURL;	

					var styleDescription = "";
					var description = $(config).find('description');
					if (description.length>0) styleDescription = description.eq(0).text()
					styleConfig.styleDescription = styleDescription;

					var styleVersion = "1.0";
					var version = $(config).find('version');
					if (version.length>0) styleVersion = version.eq(0).text()
					styleConfig.styleVersion = styleVersion;				
					
					version = styleVersion.split('.');
					styleConfig.styleVersionMajor = version[0];
					styleConfig.styleVersionMinor = version[1];
					
					$designer.config = styleConfig;
				}
			});
		}
	},
	printStyles : function(type){
		// Is it IE<9?
		this.isOldBrowser = false;
		var ie = this.checkIE;
		if (ie && ie<9) this.isOldBrowser = true;		
		document.write('<link rel="stylesheet" type="text/css" href="/style/base.css" />');
		// To review: document.write('<link rel="stylesheet" type="text/css" href="/style/'+this.styleId+'/content.css" id="base-content-css" />');
		document.write('<style type="text/css" id="my-content-css"></style>');
		this.getStylesContent("content");
		if (type=='website') {
			// To review: document.write('<link rel="stylesheet" type="text/css" href="/style/'+this.styleId+'/nav.css" id="base-nav-css" />');
			document.write('<style type="text/css" id="my-nav-css"></style>');
			this.getStylesContent("nav");
		}
	},
	printExtraBody : function(){
		this.disableAllLinks();
		document.write('<script type="text/javascript" src="/style/'+this.styleId+'/_style_js.js"></script>');
		if (this.isBrowserCompatible()) this.openDesigner();
		else alert($i18n.Browser_Incompatible);
	},
	disableAllLinks : function(){
		$("A","#content").click(function(){
			return false;
		});
	},
	openDesigner : function(){
		// return false;
		// Settings
		var mypage="/tools/style-designer/";
		var myname="eXeLearning_Style_Designer";
		var w=650;
		var h=500;
		var features="";
		// / Settings
		// var style = null;
		var winl = (screen.width-w)/2;
		var wint = (screen.height-h)/2;
		if (winl < 0) winl = 0;
		if (wint < 0) wint = 0;
		var settings = 'height=' + h + ',';
		settings += 'width=' + w + ',';
		settings += 'top=' + wint + ',';
		settings += 'left=' + winl + ',';
		settings += features;
		styleDesignerPopup = window.open(mypage,myname,settings);
		if (styleDesignerPopup) styleDesignerPopup.focus();
	}
}
$designer.init();