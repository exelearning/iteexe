/*
 * eXeLearning Style Designer 1.0
 * By Ignacio Gros (http://www.gros.es/) for eXeLearning (http://exelearning.net/)
 * Creative Commons Attribution-ShareAlike (http://creativecommons.org/licenses/by-sa/3.0/)
 */

var $appVars = [
	//Field, value length or "", starting position (Ej: color:# => 7).
	
	// #general tab
	// fieldset #1
	['pageWidth',4,6,'number'],
	['pageAlign',6,7],
	['wrapperShadowColor',6,23],
	['contentBorderWidth',3,13,'number'],
	['contentBorderColor',6,1],
	// fieldset #2
	['bodyBGColor',6,18]
	/*
	// fieldset #1	
	['contentBGColor',6,18]
	*/
];

var $app = {
	defaultValues : {
		pageWidth : "985px",
		pageAlign : "0 auto",
		wrapperShadowColor : "0 0 10px 0 #999",
		contentBorderWidth : 1,
		contentBorderColor : "ddd",
		bodyBGColor : "fff" // website body background-color
	},
	mark : "/* eXeLearning Style Designer */",
	advancedMark : "/* eXeLearning Style Designer (custom CSS) */",
	defaultMark : "/* eXeLearning Style Designer (default CSS) */",
	init : function() {
		
		this.i18n();
		
		// Is it IE<9?
		this.isOldBrowser = false;
		var ie = this.checkIE;
		if (ie && ie<9) this.isOldBrowser = true;

		$("#save").click(function(){
			alert("Save.\n\nElimina el margin:0 auto de #content en nav.css antes\n\nY el text-align:center;");
			// var css = $app.composeCSS();
		});
		
		this.getCurrentCSS();
		// Enable the Color Pickers after loading the current values
		
	},
	updateTextFieldFromFile : function(e){
		//opener.parent.opener.document.getElementsByTagName("IFRAME")[0].contentWindow;
		//opener.parent.opener.window.nevow_clientToServerEvent('quit', '', '');
		var id = e.id.replace("File","");
		$("#"+id).val($(e).val());
	},
	openBrowser : function(id){
		/*
		var elem = document.getElementById("theFile");
		if(elem && document.createEvent) {
			var evt = document.createEvent("MouseEvents");
			evt.initEvent("click", true, false);
			node.dispatchEvent(evt);
		}
		*/
		$("#"+id+"File").click();
	},
	getCurrentCSS : function(){
		
		// content.css
		var contentCSSFile = opener.document.getElementById("base-content-css");
		var url = contentCSSFile.href;
		$.ajax({
			type: "GET",
			url: url,
			success: function(res){
				var contentCSS = res.split($app.mark);
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
		url = url.replace("content.css","nav.css")
		$.ajax({
			type: "GET",
			url: url,
			success: function(res){
				var navCSS = res.split($app.mark);
				$app.baseNavCSS = navCSS[0];
				var myNavCSS = "";
				if (navCSS.length==2) {
					myNavCSS = navCSS[1];
				}
				$app.myNavCSS = myNavCSS;
				$app.getAllValues("nav",$app.myNavCSS);
			}
		});
		
	},
	getAllValues : function(type,content){
		
		var c = content.replace("\r\n\r\n","");
		
		// Advanced CSS
		var adv = c.split($app.advancedMark);
		if (adv.length==2 && adv[1]!="") {
			adv = adv[1];
			if (adv.indexOf("\r\n")==0) adv = adv.replace("\r\n","");
			$("#extra-"+type+"-css").val(adv);
		}
		
		if (type=="content") {
			//$("#my-content-css").val($app.baseContentCSS+"\n"+$app.mark+"\n\n"+c);
			$("#my-content-css").val(c);
		} else {
			//$("#my-nav-css").val($app.baseNavCSS+"\n"+$app.mark+"\n\n"+c);
			$("#my-nav-css").val(c);
		}
		
		var val;
		for (i=0;i<$appVars.length;i++) {
			var currentValue = $appVars[i];
			var index = c.indexOf("/*"+currentValue[0]+"*/");
			if(index!=-1){
				if (typeof(currentValue[1])=='number') {
					val = c.substr(index+(currentValue[0].length+4)+currentValue[2],currentValue[1]);
					if (currentValue[3]=='number') val = parseFloat(val);
					if (currentValue[1]!='checkbox') $("#"+currentValue[0]).val(val);
					// Set % or px
					if (currentValue[0]=="pageWidth") {
						if (val>100) $("#pageWidthUnit").val("px");
						else $("#pageWidthUnit").val("%");
					}
					// Center or left
					if (currentValue[0]=="pageAlign") {
						if (val.indexOf("0;")==0) $("#pageAlign").val("left");
					}
				}
			}
		}
		
		// Enable the Color Pickers
		this.enableColorPickers();
		
		// Enable real time preview
		this.trackChanges();
		
	},
	trackChanges : function(){
		
		var f = document.getElementById("myForm");
		// INPUT fields
		var f_inputs = f.getElementsByTagName("INPUT");
		for (i=0;i<f_inputs.length;i++){
			var t= f_inputs[i].type;
			if (t=="checkbox") {
				$app.getPreview();
			} else {
				f_inputs[i].onblur=function(){ $app.getPreview(); }
			}
		}
		// SELECT
		var f_selects = f.getElementsByTagName("SELECT");
		for (z=0;z<f_selects.length;z++){
			f_selects[z].onchange=function(){ $app.getPreview(); }	
		}
		// Advanced tab
		document.getElementById("extra-content-css").onkeyup=function(){ $app.getPreview(); }
		document.getElementById("extra-nav-css").onkeyup=function(){ $app.getPreview(); }
		
	},
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
		
		// #content
		var pageWidth = $("#pageWidth").val();
		var pageWidthUnit = $("#pageWidthUnit").val();
		var pageAlign = $("#pageAlign").val();
		var wrapperShadowColor = $("#wrapperShadowColor").val();
		var contentBorderColor = $("#contentBorderColor").val();
		var contentBorderWidth = $("#contentBorderWidth").val();
		var contentBGColor = $("#contentBGColor").val();
		
		// Default border width if not defined
		if (contentBorderColor!="" && contentBorderWidth=="") contentBorderWidth = $app.defaultValues.contentBorderWidth;
		// Default border color if not defined
		if (contentBorderWidth!="" && contentBorderColor=="") contentBorderColor = $app.defaultValues.contentBorderColor;

		//if (pageWidth>100) $("#pageWidthUnit").val("px");
		//else $("#pageWidthUnit").val("%");
		
		if (pageWidth!="" || contentBorderColor!="" || contentBorderWidth!="" || pageAlign=="left" || wrapperShadowColor!="" || contentBGColor!=""){
			navCSS+="#content{";
				if (contentBorderColor!="" || contentBorderWidth!="") {
					//while (contentBorderWidth.length<3) contentBorderWidth="0"+contentBorderWidth;
					navCSS+="/*contentBorderWidth*/border-right:"+contentBorderWidth+"px solid /*contentBorderColor*/#"+contentBorderColor+";";
					navCSS+= "border-left:"+contentBorderWidth+"px solid #"+contentBorderColor+";";
				}
				if (pageWidth!="") navCSS+="/*pageWidth*/width:"+pageWidth+pageWidthUnit+";";
				if (pageAlign=="left") navCSS+="/*pageAlign*/margin:0;";
				//if (contentBGColor!="") navCSS+="/*contentBGColor*/background-color:#"+contentBGColor+";";
				if (wrapperShadowColor!="") navCSS+="/*wrapperShadowColor*/box-shadow:0 0 15px 0 #"+wrapperShadowColor+";";
			navCSS+="}";
		}
		
		// BODY
		// site
		var bodyBGColor = $("#bodyBGColor").val();
		if (bodyBGColor!='' || pageAlign=='left') {
			navCSS+="body{"
				if (pageAlign=='left') navCSS+="text-align:left;";
				if (bodyBGColor!='') navCSS+="/*bodyBGColor*/background-color:#"+bodyBGColor+";";
			navCSS+="}";
		}
		// page or IMS
		if (contentBGColor!='') {
			//contentCSS+="body{";
				//contentCSS+="/*contentBGColor*/background-color:#"+contentBGColor+";";
			//contentCSS+="}";
		}
		
		// Default
		if (pageWidth=="" || pageAlign=="center" || wrapperShadowColor=="" || contentBorderColor=="") {
			navCSS+=$app.defaultMark;
			navCSS+="#content{";
				if (pageWidth=="") navCSS+="width:"+$app.defaultValues.pageWidth+";";
				if (pageAlign=="center") navCSS+="margin:"+$app.defaultValues.pageAlign+";";
				if (wrapperShadowColor=="") navCSS+="box-shadow:"+$app.defaultValues.wrapperShadowColor+";";
				if (contentBorderColor=="") {
					navCSS+="border-left:"+contentBorderWidth+"px solid #"+$app.defaultValues.contentBorderColor+";";
					navCSS+="border-right:"+contentBorderWidth+"px solid #"+$app.defaultValues.contentBorderColor+";";
				}
			navCSS+="}";
			navCSS+=$app.defaultMark;
		}
		if (pageAlign=='center' || bodyBGColor=='') {
			navCSS+="body{"
				if (pageAlign=='center') navCSS+="text-align:center;";
				if (bodyBGColor=='') navCSS+="background-color:#"+$app.defaultValues.bodyBGColor+";";
			navCSS+="}"
		}
		
		contentCSS = this.formatCSS(contentCSS);
		navCSS = this.formatCSS(navCSS);

		// Advanced tab
		var advContentCSS = $("#extra-content-css").val();
		if (advContentCSS!="") contentCSS += "\n"+$app.advancedMark+"\n"+advContentCSS;	
		var advNavCSS = $("#extra-nav-css").val();
		if (advNavCSS!="") navCSS += "\n"+$app.advancedMark+"\n"+advNavCSS;
		
		css.push(contentCSS);
		css.push(navCSS);
		
		return css;
	},
	enableColorPickers : function(){
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
	getFinalCSS : function(css){
		// Remove all default values from the CSS to include in content.css and nav.css
		if (css.indexOf($app.defaultMark)!=-1) {
			var parts = css.split($app.defaultMark);
			if (parts.length==3) {
				return parts[0]+parts[2];
			}
		}
		return css;
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
		$("#my-content-css").val(this.getFinalCSS(css[0]));
		$("#my-nav-css").val(this.getFinalCSS(css[1]));
		//((css[1].split($app.defaultMark)[0]);
		
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