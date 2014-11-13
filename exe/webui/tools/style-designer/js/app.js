/*
 * eXeLearning Style Designer 1.0
 * By Ignacio Gros (http://www.gros.es/) for eXeLearning (http://exelearning.net/)
 * Creative Commons Attribution-ShareAlike (http://creativecommons.org/licenses/by-sa/3.0/)
 */

/* 
* Right now the BODY tag can have any of these classes 
 * exe-web-site
* exe-single-page
* exe-scorm
* exe-ims
* exe-epub3
*/

var $appVars = [
	//Field, value length or "", starting position (Ej: color:# => 7).
	
	// General tab
	// fieldset #1
	['pageWidth',4,6,'number'],
	['pageAlign',6,7],
	['wrapperShadowColor',6,23],
	['contentBorderWidth',3,13,'number'],
	['contentBorderColor',6,1],
	// fieldset #2
	['fontFamily',''],
	['bodyColor',6,7],
	['aColor',6,7],
	['aHoverColor',6,7],	
	
	// Backgrounds tab
	// fieldset #1
	['bodyBGColor',6,18],
	['bodyBGURL',');',21],
	['bodyBGPosition',13,20],
	['bodyBGRepeat',9,18],
	// fieldset #2
	['contentBGColor',6,18],
	['contentBGURL',');',21],
	['contentBGPosition',13,20],
	['contentBGRepeat',9,18],
	
	// Header tab
	// fieldset #1
	['headerHeight',4,7,'number'],
	['headerBGColor',6,18],
	['headerBGURL',');',21],
	['headerBGPosition',13,20],
	['headerBGRepeat',9,18],
	// fieldset #2
	['hideProjectTitle','checkbox'],
	['headerTitleFontFamily',''],
	['headerTitleColor',6,7],
	['headerTitleTextShadowColor',6,25],
	['headerTitleAlign',6,11],
	['headerTitleFontSize',3,10,'number'],
	['headerTitleTopMargin',4,12,'number'],
	
	// Navigation tag
	// fieldset #1
	['hideNavigation','checkbox'],
	['horizontalNavigation','checkbox']
];

var $app = {
	// Debug
	includeDefaultStyles : false,
	returnFullContent : false,
	// /Debug
	defaultValues : {
		pageWidth : "985px",
		pageAlign : "0 auto",
		wrapperShadowColor : "0 0 10px 0 #999",
		contentBorderWidth : 1,
		contentBorderColor : "ddd",
		bodyBGColor : "FFF", // website body background-color
		fontFamily : "Arial, Verdana, Helvetica, sans-serif",
		bodyColor : "333",
		aColor : "2495FF",
		contentBGColor : "FFF", // IMS body background-color and website #content background-color,
		headerHeight : 100,
		headerTitleTopMargin : 60
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
			alert("Save!");
			// var css = $app.composeCSS();
		});
		
		this.stylePath = opener.document.getElementById("base-content-css").href.replace("content.css","");
		this.getCurrentCSS();
		// Enable the Color Pickers after loading the current values
		
	},
	updateTextFieldFromFile : function(e){
		//opener.parent.opener.document.getElementsByTagName("IFRAME")[0].contentWindow;
		//opener.parent.opener.window.nevow_clientToServerEvent('quit', '', '');
		var id = e.id.replace("File","");
		$("#"+id).val($(e).val());
		$app.getPreview();
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
	addStylePath : function(c){
		c = c.replace(/url\(http:/g,'url--http:');
		c = c.replace(/url\(/g,'url('+$app.stylePath);
		c = c.replace(/url--http:/g,'url(http:');
		return c;
	},
	removeStylePath : function(c){
		var reg = new RegExp($app.stylePath, "g");
		return c.replace(reg, "");
	},
	getAllValues : function(type,content){
		
		var c = content.replace("\r\n\r\n","");
		
		// Advanced CSS
		var adv = c.split($app.advancedMark);
		if (adv.length==2 && adv[1]!="") {
			adv = adv[1];
			$("#extra-"+type+"-css").val(adv);
		}
		
		// Get CSS onload
		if (type=="content") {
			if ($app.returnFullContent==true) $("#my-content-css").val($app.baseContentCSS+"\n"+$app.mark+"\n\n"+c);
			else $("#my-content-css").val(this.formatCSS(c));
		} else {
			if ($app.returnFullContent==true) $("#my-nav-css").val($app.baseNavCSS+"\n"+$app.mark+"\n\n"+c);
			else $("#my-nav-css").val(this.formatCSS(c));
		}
		
		var val;
		for (var i=0;i<$appVars.length;i++) {
			var currentValue = $appVars[i];
			var index = c.indexOf("/*"+currentValue[0]+"*/");
			if (index!=-1){
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
					// We get anything before the next rule (background-position and background-repeat)
					if (currentValue[0].indexOf("BGPosition")!=-1 || currentValue[0].indexOf("BGRepeat")!=-1 || currentValue[0]=="headerTitleAlign") {
						val = val.split(";");
						val = val[0];
						$("#"+currentValue[0]).val(val);
					}				
				} else {
					if (currentValue[0].indexOf("BGURL")!=-1){
						var a = c.split(currentValue[0]+'*/background-image:url(')[1];
						var val = a.split(");")[0];
						$("#"+currentValue[0]).val(val);
					}
					// Font family
					else if (currentValue[0].indexOf('ontFamily')!=-1){
						var a = c.split(currentValue[0]+'*/font-family:')[1];
						var val = a.split(";")[0];
						$("#"+currentValue[0]).val(val);
					// Header title
					} else if (currentValue[0]=="hideProjectTitle") {
						$("#hideProjectTitle").prop('checked', true);
						$("#projectTitleOptions").hide();
					} 
					// Navigation
					else if (currentValue[0]=="hideNavigation") {
						$("#hideNavigation").prop('checked', true);
						$("#navigationOptions").hide();
					}
					else if (currentValue[0]=="horizontalNavigation") {
						$("#horizontalNavigation").prop('checked', true);
					}					
				}
			} 
			else {
				// Set some default values (usability)
				if (type=="content" && (currentValue[0]=="headerHeight" || currentValue[0]=="headerTitleTopMargin")) {
					$("#"+currentValue[0]).val($app.defaultValues[currentValue[0]]);
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
				f_inputs[i].onchange=function() {
					if (this.id=="hideProjectTitle") {
						var o = document.getElementById('projectTitleOptions');
						if (this.checked) o.style.display="none";
						else o.style.display="block";
					}
					else if (this.id=="hideNavigation") {
						var o = document.getElementById('navigationOptions');
						if (this.checked) {
							// To do: Hide menu if ti's visible
							//if (window.opener) {
								//$("#toggle-nav",opener.document).unbind("click");
								//if ($("#siteNav",opener.document).is(":visible") && navToggler.is(":visible") && navToggler.attr("class")=="show-nav") navToggler.click();
							//}
							o.style.display="none";
						}
						else o.style.display="block";
					}
					$app.getPreview(); 
				}
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
		css = css.replace(/(\r\n|\n|\r)/gm,"");
		css=css.replace(/{/g, "{\n");
		css=css.replace(/}/g, "}\n\n");
		css=css.replace(/;/g, ";\n");
		css=css.replace(/\n$/, ""); // Remove the last \n
		css=css.replace($app.advancedMark,$app.advancedMark+"\n")
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
		
		// #content (website) and body (IMS, etc.)
		var contentBGColor = $("#contentBGColor").val();
		var contentBGURL = $("#contentBGURL").val();
		var contentBGPosition = $("#contentBGPosition").val();
		var contentBGRepeat = $("#contentBGRepeat").val();

		// body (content.css)
		var fontFamily = $("#fontFamily").val();
		var bodyColor = $("#bodyColor").val();
		var aColor = $("#aColor").val();
		var aHoverColor = $("#aHoverColor").val();

		// body (website)
		var bodyBGColor = $("#bodyBGColor").val();
		var bodyBGURL = $("#bodyBGURL").val();
		var bodyBGPosition = $("#bodyBGPosition").val();
		var bodyBGRepeat = $("#bodyBGRepeat").val();

		// header
		var headerHeight = $("#headerHeight").val();
		var headerBGColor = $("#headerBGColor").val();
		var headerBGURL = $("#headerBGURL").val();
		var headerBGPosition = $("#headerBGPosition").val();
		var headerBGRepeat = $("#headerBGRepeat").val();
		var hideProjectTitle = $("#hideProjectTitle").prop("checked");
		var headerTitleFontFamily = $("#headerTitleFontFamily").val();
		var headerTitleColor = $("#headerTitleColor").val();
		var headerTitleTextShadowColor = $("#headerTitleTextShadowColor").val();
		var headerTitleAlign = $("#headerTitleAlign").val();
		var headerTitleFontSize = $("#headerTitleFontSize").val();
		var headerTitleTopMargin = $("#headerTitleTopMargin").val();
		
		// #nav
		var hideNavigation = $("#hideNavigation").prop("checked");
		var horizontalNavigation = $("#horizontalNavigation").prop("checked");
		
		// Default border width if not defined
		if (contentBorderWidth=="") contentBorderWidth = $app.defaultValues.contentBorderWidth;

		if (contentBGColor!="" || contentBGURL!="" || pageWidth!="" || contentBorderColor!="" || contentBorderWidth!=$app.defaultValues.contentBorderWidth || pageAlign=="left" || wrapperShadowColor!=""){
			navCSS+="#content{";
				if (contentBorderColor!="" || contentBorderWidth!=$app.defaultValues.contentBorderWidth) {
					navCSS+="/*contentBorderWidth*/border-right:"+contentBorderWidth+"px solid /*contentBorderColor*/#"+contentBorderColor+";";
					navCSS+= "border-left:"+contentBorderWidth+"px solid #"+contentBorderColor+";";
				}
				if (pageWidth!="") navCSS+="/*pageWidth*/width:"+pageWidth+pageWidthUnit+";";
				if (pageAlign=="left") navCSS+="/*pageAlign*/margin:0;";
				if (wrapperShadowColor!="") navCSS+="/*wrapperShadowColor*/box-shadow:0 0 15px 0 #"+wrapperShadowColor+";";
				if (contentBGColor!='') navCSS+="/*contentBGColor*/background-color:#"+contentBGColor+";";
				if (contentBGURL!='') {
					if (contentBGURL.indexOf("http")!=0) contentBGURL = $app.stylePath+contentBGURL;
					navCSS+="/*contentBGURL*/background-image:url("+contentBGURL+");";
					navCSS+="/*contentBGRepeat*/background-repeat:"+contentBGRepeat+";";
					navCSS+="/*contentBGPosition*/background-position:"+contentBGPosition+";";				
				}				
			navCSS+="}";
		}
		
		if (fontFamily!='' || bodyColor!=''){
			contentCSS+="body{";
				if (fontFamily!="") contentCSS+="/*fontFamily*/font-family:"+fontFamily+";";
				if (bodyColor!="") contentCSS+="/*bodyColor*/color:#"+bodyColor+";";
			contentCSS+="}";
		}
		if (aColor!='') contentCSS+="a{/*aColor*/color:#"+aColor+";}";
		if (aHoverColor!='') contentCSS+="a:hover,a:focus{/*aHoverColor*/color:#"+aHoverColor+";}";		
		
		// BODY and #content
		if (contentBGColor!='' || contentBGURL!='' || bodyBGColor!='' || pageAlign=='left' || bodyBGURL!='') {
			navCSS+="body{"
				if (pageAlign=='left') navCSS+="text-align:left;";
				if (bodyBGColor!='') navCSS+="/*bodyBGColor*/background-color:#"+bodyBGColor+";";
				if (bodyBGURL!='') {
					if (bodyBGURL.indexOf("http")!=0) bodyBGURL = $app.stylePath+bodyBGURL;
					navCSS+="/*bodyBGURL*/background-image:url("+bodyBGURL+");";
					navCSS+="/*bodyBGRepeat*/background-repeat:"+bodyBGRepeat+";";
					navCSS+="/*bodyBGPosition*/background-position:"+bodyBGPosition+";";				
				}
			navCSS+="}";
		}
		// IMS
		if (contentBGColor!='' || contentBGURL!='') {		
			contentCSS+=".exe-single-page,.exe-scorm,.exe-ims,.exe-epub3{";
				if (contentBGColor!='') contentCSS+="/*contentBGColor*/background-color:#"+contentBGColor+";";
				if (contentBGURL!='') {
					if (contentBGURL.indexOf("http")!=0) contentBGURL = $app.stylePath+contentBGURL;
					contentCSS+="/*contentBGURL*/background-image:url("+contentBGURL+");";
					contentCSS+="/*contentBGRepeat*/background-repeat:"+contentBGRepeat+";";
					contentCSS+="/*contentBGPosition*/background-position:"+contentBGPosition+";";				
				}				
			contentCSS+="}";
		}
		
		// #header
		if (headerHeight==$app.defaultValues.headerHeight) headerHeight = "";
		if (headerHeight!="" || headerBGColor!="" || headerBGURL!="") {
			contentCSS+="#header,#emptyHeader,#nodeDecoration{";
				if (headerHeight!="") contentCSS+="/*headerHeight*/height:"+headerHeight+"px;";
				if (headerBGColor!='') contentCSS+="/*headerBGColor*/background-color:#"+headerBGColor+";";
				if (headerBGURL!='') {
					if (headerBGURL.indexOf("http")!=0) headerBGURL = $app.stylePath+headerBGURL;
					contentCSS+="/*headerBGURL*/background-image:url("+headerBGURL+");";
					contentCSS+="/*headerBGRepeat*/background-repeat:"+headerBGRepeat+";";
					contentCSS+="/*headerBGPosition*/background-position:"+headerBGPosition+";";				
				}				
			contentCSS+="}";
		}
		
		if (!hideProjectTitle) {
			if (headerTitleFontFamily==fontFamily) headerTitleFontFamily = "";
			if (headerTitleTopMargin==$app.defaultValues.headerTitleTopMargin) headerTitleTopMargin = "";
			if (headerTitleTopMargin!="" || headerTitleFontFamily!="" || headerTitleColor!="" || headerTitleTextShadowColor!="" || headerTitleAlign!="" || headerTitleFontSize!="") {
				contentCSS+="#headerContent{";
					if (headerTitleTopMargin!="") contentCSS+="/*headerTitleTopMargin*/padding-top:"+headerTitleTopMargin+"px;";
					if (headerTitleFontFamily!="") contentCSS+="/*headerTitleFontFamily*/font-family:"+headerTitleFontFamily+";";
					if (headerTitleColor!="") contentCSS+="/*headerTitleColor*/color:#"+headerTitleColor+";";
					if (headerTitleTextShadowColor!="") contentCSS+="/*headerTitleTextShadowColor*/text-shadow:1px 1px 1px #"+headerTitleTextShadowColor+";";
					if (headerTitleAlign!="") contentCSS+="/*headerTitleAlign*/text-align:"+headerTitleAlign+";";
					if (headerTitleFontSize!="") contentCSS+="/*headerTitleFontSize*/font-size:"+headerTitleFontSize+"%;";
				contentCSS+="}";
			}
		} else {
			contentCSS+="#headerContent{";
				contentCSS+="/*hideProjectTitle*/position:absolute!important;clip:rect(1px 1px 1px 1px);clip:rect(1px,1px,1px,1px);";
			contentCSS+="}";
		}
		
		// #nav		
		if (hideNavigation) {
			navCSS+="/*hideNavigation*/";
			navCSS+= "#siteNav,#nav-toggler{display:none;}";
			navCSS+="#main{padding-left:20px;}";
			navCSS+="@media all and (max-width: 1015px){";
				navCSS+="#main,.no-nav #main{padding-top:20px;}";	
			navCSS+="}";
		} else {
			if (horizontalNavigation) {
				var hNavCSS = "\
					#main,.no-nav #main{padding:0 20px;}\
					#main-wrapper{float:none;width:100%;}\
					#siteFooter{padding-left:20px;}\
					#siteNav li:hover,#siteNav li.sfhover{background:#f9f9f9;}\
					#siteNav .other-section{display:block;}\
					#siteNav .main-node{font-weight:normal;font-variant:normal;letter-spacing:0;font-size:1em;}\
					#siteNav,#siteNav ul{float:left;width:100%;list-style:none;padding:0;border-style:solid;border-width:1px 0;border-color:#ddd;margin:0;line-height:1.2em;background:#fff;}\
					#siteNav ul ul{line-height:1.1em;}\
					#siteNav{margin-bottom:20px;position:relative;z-index:999;border-top:none;}\
					#siteNav a{display:block;text-decoration:none;padding:.4em 15px;border:none;}\
					#siteNav li{float:left;}\
					#siteNav li ul{position:absolute;left:-999em;height:auto;width:14.4em;w\idth:13.9em;border-width:0.25em;}\
					* html #siteNav li ul{width:13em;}\
					#siteNav li li{padding-right:1em;width:12.9em;}\
					#siteNav li ul a,#siteNav li ul ul a{padding:.45em 15px;}\
					#siteNav li ul ul{margin:-2.15em 0 0 14em;}\
					* html #siteNav li ul ul{margin-left:13em;}\
					#siteNav li:hover ul ul,#siteNav li:hover ul ul ul,#siteNav li.sfhover ul ul,#siteNav li.sfhover ul ul ul{left:-999em;}\
					#siteNav li:hover ul,#siteNav li li:hover ul,#siteNav li li li:hover ul,#siteNav li.sfhover ul,#siteNav li li.sfhover ul,#siteNav li li li.sfhover ul{left:auto;}\
					#siteNav .daddy{position:relative;}\
					#siteNav .daddy span{display:inline;position:absolute;right:0;font-size:.8em;}\
					#toggle-nav{display:none;}\
				";
				//navCSS += hNavCSS;
			}
		}
		
		// Default values
		var defaultContentCSS = "";
		var defaultNavCSS = "";
		
		if (fontFamily=='' || bodyColor==''){
			defaultContentCSS+="body{";
				if (fontFamily=="") defaultContentCSS+="font-family:"+$app.defaultValues.fontFamily+";";
				if (bodyColor=="") defaultContentCSS+="color:#"+$app.defaultValues.bodyColor+";";
			defaultContentCSS+="}";
		}
		
		if (contentBGColor=='' || contentBGURL==''){
			defaultContentCSS+=".exe-single-page,.exe-scorm,.exe-ims,.exe-epub3{";
				if (contentBGColor=='') defaultContentCSS+="background-color:#"+$app.defaultValues.contentBGColor+";";
				if (contentBGURL=='') defaultContentCSS += "background-image:none;";				
			defaultContentCSS+="}";
		}		
		
		if (aColor=='') defaultContentCSS+="a{color:#"+$app.defaultValues.aColor+";}";
		if (aHoverColor=='') {
			if (aColor=='') defaultContentCSS+="a:hover,a:focus{color:#"+$app.defaultValues.aColor+";}";
			else defaultContentCSS+="a:hover,a:focus{color:#"+aColor+";}";
		}
		
		if (contentBGColor=='' || contentBGURL=='' || pageWidth=="" || pageAlign=="center" || wrapperShadowColor=="" || contentBorderColor=="" && contentBorderWidth==$app.defaultValues.contentBorderWidth) {
			defaultNavCSS+="#content{";
				if (pageWidth=="") defaultNavCSS+="width:"+$app.defaultValues.pageWidth+";";
				if (pageAlign=="center") defaultNavCSS+="margin:"+$app.defaultValues.pageAlign+";";
				if (wrapperShadowColor=="") defaultNavCSS+="box-shadow:"+$app.defaultValues.wrapperShadowColor+";";
				if (contentBorderColor=="") {
					defaultNavCSS+="border-left:"+contentBorderWidth+"px solid #"+$app.defaultValues.contentBorderColor+";";
					defaultNavCSS+="border-right:"+contentBorderWidth+"px solid #"+$app.defaultValues.contentBorderColor+";";
				}
				if (contentBGColor=='') defaultNavCSS+="background-color:#"+$app.defaultValues.contentBGColor+";";
				if (contentBGURL=='') defaultNavCSS += "background-image:none;";				
			defaultNavCSS+="}";
		}
		
		if (pageAlign=='center' || bodyBGColor=='' || bodyBGURL=='') {
			defaultNavCSS+="body{"
				if (pageAlign=='center') defaultNavCSS+="text-align:center;";
				if (bodyBGColor=='') defaultNavCSS+="background-color:#"+$app.defaultValues.bodyBGColor+";";
				if (bodyBGURL=='') defaultNavCSS += "background-image:none;";
			defaultNavCSS+="}"
		}
		
		if (headerHeight=="" || headerBGColor=="" || headerBGURL=="") {
			defaultContentCSS+="#header,#emptyHeader,#nodeDecoration{";
				if (headerHeight=="") defaultContentCSS+="height:"+$app.defaultValues.headerHeight+"px;";
				if (headerBGColor=='') defaultContentCSS+="background-color:inherit;";
				if (headerBGURL=='') defaultContentCSS+="background-image:none;";
			defaultContentCSS+="}";
		}
		
		if (!hideProjectTitle || headerTitleTopMargin=="" || headerTitleFontFamily=="" || headerTitleColor=="" || headerTitleTextShadowColor=="" || headerTitleAlign=="" || headerTitleFontSize=="") {
			defaultContentCSS+="#headerContent{";
				if (!hideProjectTitle) defaultContentCSS+="position:static!important;clip:rect(auto auto auto auto);clip:rect(auto,auto,auto,auto);";
				if (headerTitleTopMargin=="") defaultContentCSS+="padding-top:"+$app.defaultValues.headerTitleTopMargin+"px;";
				if (headerTitleFontFamily=="") {
					headerTitleFontFamily = fontFamily;
					if (fontFamily=='') headerTitleFontFamily = $app.defaultValues.fontFamily;
					defaultContentCSS+="font-family:"+headerTitleFontFamily+";";
				}
				if (headerTitleColor=="") {
					headerTitleColor = bodyColor;
					if (bodyColor=='') headerTitleColor = $app.defaultValues.bodyColor;
					defaultContentCSS+="color:#"+headerTitleColor+";";
				}
				if (headerTitleTextShadowColor=="") defaultContentCSS+="text-shadow:none;";
				if (headerTitleAlign=="") defaultContentCSS+="text-align:left;";
				if (headerTitleFontSize=="") defaultContentCSS+="font-size:100%;";
			defaultContentCSS+="}";
		}	

		if (!hideNavigation) {
			defaultNavCSS+="/*hideNavigation*/";
			defaultNavCSS+= "#siteNav,#nav-toggler{display:block;}";
			defaultNavCSS+="#main{padding-left:250px;}";
			defaultNavCSS+="@media all and (max-width: 1015px){";
				defaultNavCSS+="#main{padding-top:0;}";	
			defaultNavCSS+="}";
		}
		
		if (defaultContentCSS!="") defaultContentCSS=$app.defaultMark+defaultContentCSS+$app.defaultMark;
		if (defaultNavCSS!="") defaultNavCSS=$app.defaultMark+defaultNavCSS+$app.defaultMark;
		contentCSS += defaultContentCSS;
		navCSS += defaultNavCSS;
		
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
		
		if ($app.includeDefaultStyles==true) return this.removeStylePath(css);
		
		// Remove all default values from the CSS to include in content.css and nav.css
		if (css.indexOf($app.defaultMark)!=-1) {
			var parts = css.split($app.defaultMark);
			if (parts.length==3) {
				css = parts[0]+parts[2];
			}
		}
		return this.removeStylePath(css); // css is already formatted with formatCSS
		
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