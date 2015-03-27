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
	['contentBorderWidth',3,0,'number'],
	['contentBorderColor',6,1],
	// fieldset #2
	['fontFamily',''],
	['bodyColor',6,7],
	['fontSize',3,10,'number'],
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
	
	// Header and footer tab
	// fieldset #1
	['headerHeight',4,7,'number'],
	['headerBGColor',6,18],
	['headerBorderColor',6,1],
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
	// #fieldset #3
	['footerBorderColor',6,1],
	['footerColor',6,7],
	['footerTextAlign',6,11],
	['footerAColor',6,7],
	['footerAHoverColor',6,7],
	['footerFontSize',3,10,'number'],	
	// Navigation tag
	// fieldset #1
	['hideNavigation','checkbox'],
	['horizontalNavigation','checkbox'],	
	['navBGColor',6,18],
	['navHoverBGColor',6,18],
	['navAColor',6,7],
	['navAHoverColor',6,7],
	['navBorderColor',6,14],
	// fieldset #2
	['hidePagination','checkbox'],
	['useNavigationIcons','checkbox'],
	['nav2BGColor',6,18],
	['nav2HoverBGColor',6,18],
	['nav2AColor',6,7],
	['nav2AHoverColor',6,7],	
];

var $app = {
	returnFullContent : true,
	defaultValues : {
		pageWidth : "100%",
		pageAlign : "0 auto",
		wrapperShadowColor : "0 0 10px 0 #999",
		contentBorderWidth : 0,
		contentBorderColor : "DDDDDD",
		bodyBGColor : "000000", // website body background-color
		headerBorderColor : "DDDDDD",
		fontFamily : "'Open Sans',Arial,Verdana,Helvetica,sans-serif",
		bodyColor : "333333",
		aColor : "2495FF",
		contentBGColor : "F9F9F9", // IMS body background-color and website #content background-color,
		headerHeight : 120,
		headerTitleTopMargin : 70,
		navBGColor : "F9F9F9",
		navHoverBGColor : "FFFFFF",
		navAColor : "555555",
		navAHoverColor : "000000",
		navBorderColor : "DDDDDD",
		// Previous/Next and Hide/Show menu
		nav2BGColor : "333333",
		nav2HoverBGColor : "555555",
		nav2AColor : "FFFFFF",
		nav2AHoverColor : "FFFFFF",
		// Footer
		footerBorderColor : "DDDDDD",
		footerColor : "333333",
		footerAColor : "2495FF"		
	},
	mark : "/* eXeLearning Style Designer */",
	advancedMark : "/* eXeLearning Style Designer (custom CSS) */",
	defaultMark : "/* eXeLearning Style Designer (default CSS) */",
	init : function() {
	
		if (!opener) {
			this.quit($i18n.No_Opener_Error);
			return false;
		}
		
		if ($(opener).width()<800) {
			this.quit($i18n.Not_Enough_Resolution);
			return false;
		}
		
		opener.myTheme.toggleMenu = function(){
			if (opener) {
				if (typeof(Hide_Show_Menu_Disabled_Warned)=='undefined') {
					opener.alert($i18n.Hide_Show_Menu_Disabled);
					Hide_Show_Menu_Disabled_Warned = true;
				}
			}
		}
		
		this.i18n();
		
		// Is it IE<9?
		this.isOldBrowser = false;
		var ie = this.checkIE;
		if (ie && ie<9) this.isOldBrowser = true;

		$("#save").click(function(){
			alert("Save!");
			// var css = $app.composeCSS();
		});
		
		this.stylePath = opener.$designer.styleBasePath;
		this.getCurrentCSS();
		// Enable the Color Pickers after loading the current values
		
	},
	quit : function(msg){
		document.title = msg;
		$("#cssWizard").hide();
		alert(msg+"\n\n"+$i18n.Quit_Warning);
		window.close();
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
	setWidth : function(e){
		var w = $("#pageWidth");
		var v = w.val();
		if (e.value=="px") {
			if (v=="" || v=="100") w.val(985);
		} else {
			if (v=="" || v>100) w.val(100);
		}
	},
	getCurrentCSS : function(){
		
		// content.css
		var contentCSS = opener.$designer.contentCSS.split($app.mark);
		$app.baseContentCSS = contentCSS[0].replace(/\s+$/, ''); // Remove the last space
		var myContentCSS = "";
		if (contentCSS.length==2) {
			myContentCSS = contentCSS[1];
			myContentCSS = myContentCSS.replace(/(\r\n|\n|\r)/gm,"");
		}
		$app.myContentCSS = $app.removeStylePath(myContentCSS);
		$app.getAllValues("content",$app.myContentCSS);
		
		// nav.css
		var navCSS = opener.$designer.navCSS.split($app.mark);
		$app.baseNavCSS = navCSS[0].replace(/\s+$/, ''); // Remove the last space
		var myNavCSS = "";
		if (navCSS.length==2) {
			myNavCSS = navCSS[1];
			myNavCSS = myNavCSS.replace(/(\r\n|\n|\r)/gm,"");
		}
		$app.myNavCSS = $app.removeStylePath(myNavCSS);
		$app.getAllValues("nav",$app.myNavCSS);
		
	},
	addStylePath : function(c){
		c = c.replace(/url\(http:/g,'url--http:');
		c = c.replace(/url\(https:/g,'url--https:');
		c = c.replace(/url\(/g,'url('+$app.stylePath);
		c = c.replace(/url--http:/g,'url(http:');
		c = c.replace(/url--https:/g,'url(https:');
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
			if ($app.returnFullContent==true) $("#my-content-css").val($app.baseContentCSS+"\n"+$app.mark+"\n"+c);
			else $("#my-content-css").val(c);
		} else {
			if ($app.returnFullContent==true) $("#my-nav-css").val($app.baseNavCSS+"\n"+$app.mark+"\n"+c);
			else $("#my-nav-css").val(c);
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
					if (currentValue[0].indexOf("BGPosition")!=-1 || currentValue[0].indexOf("BGRepeat")!=-1 || currentValue[0]=="headerTitleAlign" || currentValue[0]=="footerTextAlign") {
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
						$app.hasHorizontalNavigation = true;
					}
					// Other navigation options
					else if (currentValue[0]=="hidePagination") {
						$("#"+currentValue[0]).prop('checked', true);
					}
					else if (currentValue[0]=="useNavigationIcons") {
						$("#useNavigationIcons").prop('checked', true);
						$("#otherNavOptions").hide();
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
						if (this.checked) o.style.display="none";
						else o.style.display="block";
					}
					else if (this.id=="useNavigationIcons") {
						var o = document.getElementById('otherNavOptions');
						if (this.checked) o.style.display="none";
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
			f_selects[z].onchange=function(){ 
				if (this.id=="pageWidthUnit") $app.setWidth(this);
				$app.getPreview(); 
			}	
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
		css=css.replace(/}/g, "\n}\n");
		css=css.replace(/\t/g,"");
		css=css.replace(/\*\//g,'*/\n');
		css=css.replace(/;\/\*/g,';\n/*');
		css = css.replace(/\n\n/gm,"\n");
		css = css.replace(/\s+$/, ''); // Remove the last space
		return css;	
	},
	composeCSS : function(){
		
		var css = new Array();
		var contentCSS = "";
		var navCSS = "";
		
		// #content
		var pageWidth = $("#pageWidth").val();
		// px or %
		// if (pageWidth>100) $("#pageWidthUnit").val("px");
		// else $("#pageWidthUnit").val("%");
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
		var fontSize = $("#fontSize").val();
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
		var headerBorderColor = $("#headerBorderColor").val();
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
		var navBGColor = $("#navBGColor").val();
		var navHoverBGColor = $("#navHoverBGColor").val();
		var navAColor = $("#navAColor").val();
		var navAHoverColor = $("#navAHoverColor").val();
		var navBorderColor = $("#navBorderColor").val();

		if (contentBGColor!="" || contentBGURL!="" || pageWidth!="" || contentBorderColor!="" || contentBorderWidth!="" || pageAlign=="left" || wrapperShadowColor!=""){
			navCSS+="#content{";
				if (pageWidth!="100" && (contentBorderColor!="" || contentBorderWidth!="")) {
					if (contentBorderWidth!="") {
						navCSS+="border-width:0 /*contentBorderWidth*/"+contentBorderWidth+"px;";
						if (contentBorderColor!="") navCSS+="border-color:/*contentBorderColor*/#"+contentBorderColor+";";
					}
				}
				if (pageWidth!="") navCSS+="/*pageWidth*/width:"+pageWidth+pageWidthUnit+";";
				if (pageAlign=="left") navCSS+="/*pageAlign*/margin:0;";
				if (wrapperShadowColor!="" && pageWidth!="100") navCSS+="/*wrapperShadowColor*/box-shadow:0 0 15px 0 #"+wrapperShadowColor+";";
				if (contentBGColor!='') navCSS+="/*contentBGColor*/background-color:#"+contentBGColor+";";
				if (contentBGURL!='') {
					if (contentBGURL.indexOf("http")!=0) contentBGURL = $app.stylePath+contentBGURL;
					navCSS+="/*contentBGURL*/background-image:url("+contentBGURL+");";
					navCSS+="/*contentBGRepeat*/background-repeat:"+contentBGRepeat+";";
					navCSS+="/*contentBGPosition*/background-position:"+contentBGPosition+";";				
				}
				if (pageWidth=="100") {
					//navCSS += "border:0;";
					//navCSS += "box-shadow:none;";
				}
			navCSS+="}";
		}
		
		var hidePagination = $("#hidePagination").prop("checked");
		var useNavigationIcons = $("#useNavigationIcons").prop("checked");
		
		if (hidePagination) {
			navCSS += "/*hidePagination*/#topPagination,#bottomPagination{display:none;}";
		}
		
		var nav2BGColor = $("#nav2BGColor").val();
		var nav2HoverBGColor = $("#nav2HoverBGColor").val();
		var nav2AColor = $("#nav2AColor").val();
		var nav2AHoverColor = $("#nav2AHoverColor").val();
		
		if (useNavigationIcons) {
			navCSS += '/*useNavigationIcons*/.pagination a span{position:absolute;overflow:hidden;clip:rect(0,0,0,0);height:0;}\
.pagination a{display:block;float:left;width:32px;height:32px;padding:0;background:url('+$app.stylePath+'_style_icons.png) no-repeat 0 0;}\
.pagination a:hover,.pagination a:focus{background:url('+$app.stylePath+'_style_icons.png) no-repeat 0 0;}\
.pagination .next{background-position:-50px 0;}\
.pagination .next:hover,.pagination .next:focus{background-position:-50px 0;}\
#bottomPagination{height:47px;position:relative;}\
#bottomPagination a{position:absolute;top:15px;right:63px;margin:0;}\
#bottomPagination .next{right:20px;}\
#nav-toggler a span{position:absolute;overflow:hidden;clip:rect(0,0,0,0);height:0;}\
#nav-toggler a{display:block;width:32px;height:32px;padding:0;background:url('+$app.stylePath+'_style_icons.png) no-repeat -100px 0;}\
#nav-toggler a:hover{background:url('+$app.stylePath+'_style_icons.png) no-repeat -100px 0;}\
#nav-toggler .show-nav{background-position:-150px 0;}\
#nav-toggler .show-nav:hover{background-position:-150px 0;}\
.pagination a,#nav-toggler a{filter:alpha(opacity=70);opacity:.7;}\
.pagination a:hover,.pagination a:focus,#nav-toggler a:hover{filter:alpha(opacity=100);opacity:1;}\
@media all and (max-width: 700px){\
#nav-toggler{height:32px;margin-bottom:10px;position:relative;}\
#nav-toggler a{padding:0;width:32px;position:absolute;left:50%;margin-left:-16px;}\
#siteNav{border-top:1px solid #ddd;}\
#bottomPagination .next{right:0;}\
}';
		} else {
			if (nav2BGColor!="" || nav2AColor!="") {
				navCSS+=".pagination a,#nav-toggler a,#skipNav a{";
					if (nav2BGColor!="") navCSS+="/*nav2BGColor*/background-color:#"+nav2BGColor+";";
					if (nav2AColor!="") navCSS+="/*nav2AColor*/color:#"+nav2AColor+";";
				navCSS+="}";
			}
			if (nav2HoverBGColor!="" || nav2AHoverColor!="") {
				navCSS+=".pagination a:hover,.pagination a:focus,#nav-toggler a:hover{";
					if (nav2HoverBGColor!="") navCSS+="/*nav2HoverBGColor*/background-color:#"+nav2HoverBGColor+";";
					if (nav2AHoverColor!="") navCSS+="/*nav2AHoverColor*/color:#"+nav2AHoverColor+";";
				navCSS+="}";
			}		
		}
		
		if (fontFamily!='' || bodyColor!='' || fontSize!=""){
			contentCSS+="body{";
				if (fontFamily!="") contentCSS+="/*fontFamily*/font-family:"+fontFamily+";";
				if (bodyColor!="") contentCSS+="/*bodyColor*/color:#"+bodyColor+";";
				if (fontSize!="") contentCSS+="/*fontSize*/font-size:"+fontSize+"%;";
			contentCSS+="}";
		}
		if (aColor!='') contentCSS+="a{/*aColor*/color:#"+aColor+";}";
		if (aHoverColor!='') contentCSS+="a:hover,a:focus{/*aHoverColor*/color:#"+aHoverColor+";}";		
		
		// BODY and #content
		if (contentBGColor!='' || contentBGURL!='' || bodyBGColor!='' || (pageAlign=='left'&&pageWidth!="100") || bodyBGURL!='') {
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
		if (headerHeight!="" || headerBGColor!="" || headerBGURL!="" || headerBorderColor!="") {
			contentCSS+="#header,#emptyHeader,#nodeDecoration{";
				if (headerHeight!="") contentCSS+="/*headerHeight*/height:"+headerHeight+"px;";
				if (headerBGColor!='') contentCSS+="/*headerBGColor*/background-color:#"+headerBGColor+";";
				if (headerBGURL!='') {
					if (headerBGURL.indexOf("http")!=0) headerBGURL = $app.stylePath+headerBGURL;
					contentCSS+="/*headerBGURL*/background-image:url("+headerBGURL+");";
					contentCSS+="/*headerBGRepeat*/background-repeat:"+headerBGRepeat+";";
					contentCSS+="/*headerBGPosition*/background-position:"+headerBGPosition+";";
				}
				if (headerBorderColor!="") contentCSS+="border:1px solid /*headerBorderColor*/#"+headerBorderColor+";";
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
			navCSS+="#siteNav,#nav-toggler{display:none;}";
			navCSS+="#main{padding-left:20px;}";
			navCSS+="@media all and (max-width: 1015px){";
				navCSS+="#main,.no-nav #main{padding-top:20px;}";	
			navCSS+="}";
		} else {
			if (navBGColor!="" || navAColor!="" || navBorderColor!="") {
				navCSS+="#siteNav,#siteNav a{";
					if (navBGColor!="") navCSS+="/*navBGColor*/background-color:#"+navBGColor+";";
					if (navAColor!="") navCSS+="/*navAColor*/color:#"+navAColor+";";
					if (navBorderColor!="") navCSS+="/*navBorderColor*/border-color:#"+navBorderColor+";";
				navCSS+="}";
				if (navBGColor!="" || navBorderColor!="") {
					navCSS+="@media screen and (min-width: 701px) and (max-width: 1015px){";
						navCSS+='#siteNav,#siteNav ul{';
							if (navBGColor!="") navCSS+='background-color:#'+navBGColor+';';
							if (navBorderColor!="") navCSS+='border-color:#'+navBorderColor+';';						
						navCSS+='}';
						if (navBGColor!="") navCSS+='#siteNav li{background-color:#'+navBGColor+';}'						
					navCSS+="}";
					if (navBorderColor!="") {
						navCSS+="@media all and (max-width: 700px){";
								navCSS+='.js #siteNav{border-top:1px solid #'+navBorderColor+';}';
						navCSS+="}";
					}
				}
			}
			if (navHoverBGColor!="" || navAHoverColor!="") {
				navCSS+="#siteNav a:hover,#siteNav a:focus{";
					if (navHoverBGColor!="") navCSS+="/*navHoverBGColor*/background-color:#"+navHoverBGColor+";";
					if (navAHoverColor!="") navCSS+="/*navAHoverColor*/color:#"+navAHoverColor+";";
				navCSS+="}";
				if (navHoverBGColor!="") {
					navCSS+="@media screen and (min-width: 701px) and (max-width: 1015px){";
						navCSS+='#siteNav li:hover,#siteNav li.sfhover{background-color:#'+navHoverBGColor+';}';
					navCSS+="}";
				}				
			}
		}
		
		// Footer
		var footerBorderColor = $("#footerBorderColor").val();
		var footerColor = $("#footerColor").val();
		var footerTextAlign = $("#footerTextAlign").val();
		var footerAColor = $("#footerAColor").val();
		var footerAHoverColor = $("#footerAHoverColor").val();
		var footerFontSize = $("#footerFontSize").val();
		
		if (footerBorderColor!="" || footerColor!="" || footerTextAlign!="" || footerFontSize!="") {
			contentCSS += "#siteFooter{";
				if (footerBorderColor!="") {
					contentCSS += "border-top:1px solid /*footerBorderColor*/#"+footerBorderColor+";"
					navCSS += ".pagination{";
						navCSS += "border-color:#"+footerBorderColor+";";
					navCSS += "}";
				}
				if (footerColor!="") contentCSS += "/*footerColor*/color:#"+footerColor+";"
				if (footerTextAlign!="") contentCSS+="/*footerTextAlign*/text-align:"+footerTextAlign+";";
				if (footerFontSize!="") contentCSS+="/*footerFontSize*/font-size:"+footerFontSize+"%;";
			contentCSS += "}";
		}
		
		if (footerAColor!="") {
			contentCSS += "#siteFooter a{";
				contentCSS += "/*footerAColor*/color:#"+footerAColor+";"
			contentCSS += "}";
		}
		
		if (footerAHoverColor!="") {
			contentCSS += "#siteFooter a:hover,#siteFooter a:focus{";
				contentCSS += "/*footerAHoverColor*/color:#"+footerAHoverColor+";"
			contentCSS += "}";
		}
		
		contentCSS = this.formatCSS(contentCSS);
		navCSS = this.formatCSS(navCSS);
		
		var horizontalNavigation = $("#horizontalNavigation").prop("checked");
		if (horizontalNavigation) {
			var hideNavigation = $("#hideNavigation").prop("checked");
			if (!hideNavigation) navCSS += this.getHorizontalNavigationCSS();
		}		
		opener.myTheme.setNavHeight();

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
				$("div.jPicker").hide();
				$app.getPreview();
			}
		);
	},
	setCSS : function(tag,css){
		if (this.isOldBrowser) tag.cssText = css;
		else tag.innerHTML = css;
	},
	getHorizontalNavigationCSS : function(){
	
		var hNavBGColor = $app.defaultValues.navBGColor;
		var navBGColor = $("#navBGColor").val();
		if (navBGColor!="") hNavBGColor = navBGColor;	

		var hNavHoverBGColor = $app.defaultValues.navHoverBGColor;
		var navHoverBGColor = $("#navHoverBGColor").val();
		if (navHoverBGColor!="") hNavHoverBGColor = navHoverBGColor;

		var hNavBorderColor = $app.defaultValues.navBorderColor;
		var navBorderColor = $("#navBorderColor").val();
		if (navBorderColor!="") hNavBorderColor = navBorderColor;
		
		var hideNavigation = $("#hideNavigation").prop("checked");
		var padding = "0 20px";
		if (hideNavigation) padding = "20px 20px 0 20px";
		
		var css = '\
/*horizontalNavigation*/\
@media screen and (min-width:701px){\
#main,.no-nav #main{padding:'+padding+'}\
#siteNav{display:table;margin-bottom:40px}\
#siteNav li:hover,#siteNav li.sfhover{background:#'+hNavHoverBGColor+'}\
#siteNav .other-section{display:block}\
#siteNav,#siteNav ul{float:left;width:100%;border-style:solid;border-width:1px 0;border-color:#'+hNavBorderColor+';margin:0;line-height:1.2em;background:#'+hNavBGColor+'}\
#siteNav ul ul{line-height:1.1em}\
#siteNav{margin-bottom:20px;position:relative;z-index:999;border-top:none;padding-right:0}\
#siteNav a{padding:.6em 15px;border:none}\
#siteNav li{float:left}\
#siteNav li ul{position:absolute;left:-999em;height:auto;width:14.4em;w\idth:13.9em;border-width:0.25em}\
* html #siteNav li ul{width:13em}\
#siteNav li li{width:13.9em}\
#siteNav li ul a,#siteNav li ul ul a{padding:.45em 15px}\
#siteNav li ul ul{margin:-2.15em 0 0 14em}\
* html #siteNav li ul ul{margin-left:13em}\
#siteNav li:hover ul ul,#siteNav li:hover ul ul ul,#siteNav li.sfhover ul ul,#siteNav li.sfhover ul ul ul{left:-999em}\
#siteNav li:hover ul,#siteNav li li:hover ul,#siteNav li li li:hover ul,#siteNav li.sfhover ul,#siteNav li li.sfhover ul,#siteNav li li li.sfhover ul{left:auto}\
#siteNav .daddy{position:relative}\
#siteNav .daddy span{display:inline;position:absolute;right:1em;font-size:.8em}\
#toggle-nav{display:none!important}\
}';
		return css;
	},
	getFinalCSS : function(css,type){
		
		// Remove all default values from the CSS to include in content.css and nav.css
		/*
		if (css.indexOf($app.defaultMark)!=-1) {
			var parts = css.split($app.defaultMark);
			if (parts.length==3) {
				css = parts[0]+parts[2];
			}
		}
		if (type=="nav") {
			var horizontalNavigation = $("#horizontalNavigation").prop("checked");
			if (horizontalNavigation) {
				css += this.getHorizontalNavigationCSS();
			}
		}		
		*/		
		
		css = this.formatCSS(css);
		if ($app.returnFullContent==true) {
				if (type=="content") css = $app.baseContentCSS+"\n\n"+$app.mark+"\n"+css;
				else css = $app.baseNavCSS+"\n\n"+$app.mark+"\n"+css;
		}
		return this.removeStylePath(css); // css is already formatted with formatCSS
		
	},
	getPreview : function(){
		
		var w = window.opener;
		if (!w) {
			this.quit($i18n.No_Opener_Error);
			return false;
		}
		
		// content.css
		var contentCSSTag = w.document.getElementById("my-content-css");
		if (!contentCSSTag) return false;
		var css = this.composeCSS();
		var contentCSS = css[0];
		contentCSS = $app.baseContentCSS+$app.advancedMark+contentCSS;
		this.setCSS(contentCSSTag,$app.baseContentCSS+contentCSS);
		
		// content.css and nav.css TEXTAREAS
		$("#my-content-css").val(this.getFinalCSS(css[0],"content"));
		$("#my-nav-css").val(this.getFinalCSS(css[1],"nav"));
		//((css[1].split($app.defaultMark)[0]);
		
		// nav.css
		var navCSSTag = w.document.getElementById("my-nav-css");
		if (!navCSSTag) return false;		
		var navCSS = css[1];
		// advancedMark
		navCSS = $app.baseNavCSS+$app.advancedMark+navCSS;
		this.setCSS(navCSSTag,navCSS);
		
		// Menu height
		w.myTheme.setNavHeight();
	}
}
$(function(){
	$app.init();
});