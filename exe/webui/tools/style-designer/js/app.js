/*
 * eXeLearning Style Designer 1.0
 * By Ignacio Gros (http://www.gros.es/) for eXeLearning (http://exelearning.net/)
 * Creative Commons Attribution-ShareAlike (http://creativecommons.org/licenses/by-sa/3.0/)
 */

var $appVars = [
	//Field, value length or "", starting position (Ej: color:# => 7).
	['websiteBodyBGColor',6,18],			
	['contentBGColor',6,18]
];

var $app = {
	init : function() {
		
		this.i18n();
		
		// Is it IE<9?
		this.isOldBrowser = false;
		var ie = this.checkIE;
		if (ie && ie<9) this.isOldBrowser = true;

		$("#save").click(function(){
			alert("Save");
			// var css = $app.composeCSS();
		});
		
		this.getCurrentCSS();
		// Enable the Color Pickers after loading the current values
		
	},
	getCurrentCSS : function(){
		
		// content.css
		var contentCSSFile = opener.document.getElementById("base-content-css");
		var url = contentCSSFile.href;
		$.ajax({
			type: "GET",
			url: url,
			success: function(res){
				var contentCSS = res.split("/* eXeLearning Style Designer */");
				$app.baseContentCSS = contentCSS[0];
				var myContentCSS = "";
				if (contentCSS.length==2) {
					myContentCSS = contentCSS[1];
				}
				$app.myContentCSS = myContentCSS;
				$app.getAllValues("content",$app.myContentCSS);
			}
		});
		
		// nav.css
		var navCSSFile = opener.document.getElementById("base-nav-css");
		if (navCSSFile) {
			url = navCSSFile.href;
			$.ajax({
				type: "GET",
				url: url,
				success: function(res){
					var navCSS = res.split("/* eXeLearning Style Designer */");
					$app.baseNavCSS = navCSS[0];
					var myNavCSS = "";
					if (navCSS.length==2) {
						myNavCSS = navCSS[1];
					}
					$app.myNavCSS = myNavCSS;
					$app.getAllValues("nav",$app.myNavCSS);
				}
			});
		}
		
	},
	getAllValues : function(type,content){
		var val;
		for (i=0;i<$appVars.length;i++) {
			var currentValue = $appVars[i];
			var index = content.indexOf("/*"+currentValue[0]+"*/");
			if(index!=-1){
				if (typeof(currentValue[1])=='number') {
					val = content.substr(index+(currentValue[0].length+4)+currentValue[2],currentValue[1]);
					if (currentValue[3]=='number') val = parseFloat(val);
					if (currentValue[1]!='checkbox') $("#"+currentValue[0]).val(val);
				}
			}
		}
		// Enable the Color Pickers
		this.enableColorPicker();
	},
	/*
	getCurrentValues : function(cssFile,content){
		if (cssFile=="content") {
			$app.getAllValues($appVars,content);
		}
	},
	*/
	template : function(templateid,data){
		return document.getElementById(templateid).innerHTML.replace(/%(\w*)%/g,
		function(m,key){
			return data.hasOwnProperty(key)?data[key]:"";
		});
	},
	i18n : function(){
		document.title = $i18n.Style_Designer;
		document.getElementById("cssWizard").innerHTML=this.template("cssWizard",$i18n);
	},
	showTab : function(id) {
		$("li","#tabs").attr("class","");
		$("#"+id+"-tab").attr("class","current");
		$("div.panel").removeClass("current");
		$("#"+id).addClass("current");
	},
	checkIE : function(){
		var n = navigator.userAgent.toLowerCase();
		return (n.indexOf('msie') != -1) ? parseInt(n.split('msie')[1]) : false;
	},
	getRadioButtonsValue : function(radioObj) {
		if(!radioObj) return "";
		var radioLength = radioObj.length;
		if(radioLength == undefined)
			if(radioObj.checked) return radioObj.value;
			else return "";
		for(var i = 0; i < radioLength; i++) {
			if(radioObj[i].checked) return radioObj[i].value;
		}
		return "";
	},
	formatCSS : function(css) {
		css=css.replace(/{/g, "{\n");
		css=css.replace(/}/g, "}\n\n");
		css=css.replace(/;/g, ";\n");
		return css;	
	},
	composeCSS : function(){
		
		var css = new Array();
		var contentCSS = "";
		var navCSS = "";
		
		//body
		var websiteBodyBGColor = $("#websiteBodyBGColor").val();
		
		if (websiteBodyBGColor!='') {
			
			navCSS+="body{"
				navCSS+="/*websiteBodyBGColor*/background-color:#"+websiteBodyBGColor+";";
			navCSS+="}"
			
		}
		
		var contentBGColor = $("#contentBGColor").val();
		if (contentBGColor!='') {
			
			contentCSS+="body{"
				contentCSS+="/*contentBGColor*/background-color:#"+contentBGColor+";";
			contentCSS+="}"
			
			navCSS+="#content{"
				navCSS+="/*contentBGColor*/background-color:#"+contentBGColor+";";
			navCSS+="}"
			
		}
		
		contentCSS = this.formatCSS(contentCSS);
		navCSS = this.formatCSS(navCSS);
		css.push(contentCSS);
		css.push(navCSS);
		
		return css;
	},
	enableColorPicker : function(){
		$.fn.jPicker.defaults.images.clientPath='images/jpicker/';	
		$('.color').jPicker(
			{
				window:{
					title: $i18n.Color_Picker,
					position:{
						x: 'top',
						y: 'left'
					},
					effects:{
						type:'show',
						speed:{
							show : 0,
							hide : 0
						}
					}
				},
				localization : $i18n.Color_Picker_Strings
			},
			function(color, context){
				$app.getPreview();
			}
		);
	},
	setCSS : function(tag,css){
		if (this.isOldBrowser) tag.cssText = css;
		else tag.innerHTML = css;
	},
	getPreview : function(){
		
		var w = window.opener;
		if (!w) return false;
		
		// content.css
		var contentCSSTag = w.document.getElementById("my-content-css");
		if (!contentCSSTag) return false;
		var css = this.composeCSS();
		var contentCSS = css[0];
		this.setCSS(contentCSSTag,contentCSS);
		
		// content.css and nav.css TEXTAREAS
		$("#my-content-css").val(css[0]);
		$("#my-nav-css").val(css[1]);
		
		// nav.css
		var navCSSTag = w.document.getElementById("my-nav-css");
		if (!navCSSTag) return false;		
		var navCSS = css[1];
		this.setCSS(navCSSTag,navCSS);
	}
}
$(function(){
	$app.init();
});