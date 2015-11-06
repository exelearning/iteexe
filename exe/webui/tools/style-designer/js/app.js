/*
 * eXeLearning Style Designer 1.0
 * By Ignacio Gros (http://www.gros.es/) for eXeLearning (http://exelearning.net/)
 * Creative Commons Attribution-ShareAlike (http://creativecommons.org/licenses/by-sa/3.0/)
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
	
	// Page tab
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
	['footerBGColor',6,18],
	['footerAColor',6,7],
	
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
	['useNavigationIcons','checkbox'],
	['nav2BGColor',6,18],
	['nav2HoverBGColor',6,18],
	['nav2AColor',6,7],
	['nav2AHoverColor',6,7],
	['navigationIconsColor','radio'],
	
	// iDevices tab
	// fielset #1
	['emTitleColor',6,7],
	['emTitleBGColor',6,18],
	['emColor',6,7],
	['emAColor',6,7],
	['emBGColor',6,18],
	['emBorderColor',6,1],
	['emIconColor','radio'],
	// fielset #2
	['noEmShowBox','checkbox'],
	['noEmBGColor',6,18],
	['noEmColor',6,7],
	['noEmAColor',6,7],
	['noEmBorderColor',6,1],
	['noEmIconColor','radio']
];

var $app = {
	debug : "off", // off/on
	returnFullContent : true,
	defaultValues : {
		headerHeight : 120,
		headerTitleTopMargin : 70,
		navBGColor : "F9F9F9",
		navHoverBGColor : "FFFFFF",
		borderColor : "DDDDDD",
		shadowColor : "999999"
	},
	mark : "/* eXeLearning Style Designer */",
	advancedMark : "/* eXeLearning Style Designer (custom CSS) */",
	defaultMark : "/* eXeLearning Style Designer (default CSS) */",
	init : function() {
	
		if (!opener || !opener.opener) {
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
		
		$("#restore").click(function(){
			Ext.Msg.show({
				title: $i18n.Confirm,
				msg: $i18n.Restore_Instructions,
				buttonText: {yes:$i18n.Yes, no:$i18n.No},
				fn: function(button) {
					if (button === 'yes') {
						// Reload last saved version of current style
						var currentStyle = $app.getCurrentStyle();
						$app.loadNewStyle(currentStyle);
					}
				}
			});			
		});

		$("#saveAs").click(function(){
			$app.getPreview();
			var content = $("#my-content-css").val();
			var nav = $("#my-nav-css").val();
			$app.createStyle(content, nav, $app.getCurrentStyle());
		});

		$("#save").click(function(){
			$app.getPreview();
			var content = $("#my-content-css").val();
			var nav = $("#my-nav-css").val();
			var currentStyle = $app.getCurrentStyle();
			
			if (currentStyle == 'base') {
				// If user is editing base style it must be because style has not been saved yet,
				// open dialog to create a new one from base style
				$app.createStyle(content, nav);
			}
			else  {
				// Send POST request to update current style
 			   var data = $app.collectAjaxData(content, nav, 'saveStyle');
 			   $app.preloader.show();
 			   jQuery.ajax({
					url: '/styleDesigner',
					data: data,
					cache: false,
					contentType: false,
					processData: false,
					type: 'POST',
					success: function(response, action) {
						$app.preloader.hide();
						// Form request can success, even if the create/save operation failed
						result = JSON.parse(response);
						if (result.success) {
							Ext.Msg.alert('Success', result.message);
							opener.window.location.reload();
						}
						else {
							Ext.Msg.alert('Failed', result.message);
						}	   
					},
					failure: function(response, action) {
						$app.preloader.hide();
						Ext.Msg.alert('Failed', response.statusText);
					}
 			   });
			}
		});		

		$("#finish").click(function(){
			$app.getPreview();
			var currentStyle = $app.getCurrentStyle();
			var content = $("#my-content-css").val();
			var nav = $("#my-nav-css").val();
			
			Ext.Msg.show({
				title: $i18n.Confirm,
				msg: $i18n.Finish_confirmation,
				buttonText: {yes:$i18n.Yes, no:$i18n.No},
				fn: function(button) {
					if (button === 'yes') {
						if (currentStyle == 'base') {
							// If user is editing base style it must be because style has not been saved yet,
							// open dialog to create a new one instead
							$app.createStyle(content, nav, 'base', true);
						}
						else  {
							// Send POST request to update current style
							var data = $app.collectAjaxData(content, nav, 'saveStyle');
							$app.preloader.show();   
							jQuery.ajax({
								url: '/styleDesigner',
								data: data,
								cache: false,
								contentType: false,
								processData: false,
								type: 'POST',
								success: function(response, action) {
									$app.preloader.hide();
									// Form request can success, even if the create/save operation failed
									result = JSON.parse(response);
									if (result.success) {
										Ext.Msg.alert(
											'Success', 
											result.message,
											function(btn, txt) {
											   opener.window.close();
											   window.close();
											}
										);
									}
									else {
										Ext.Msg.alert('Failed', result.message);
									}	   
								},
								failure: function(response, action) {
									$app.preloader.hide();
									Ext.Msg.alert('Failed', response.statusText);
								}
							});
						}
					}
				}
			});
		});
		
		this.stylePath = opener.$designer.styleBasePath;
		this.getCurrentCSS();
		// Enable the Color Pickers after loading the current values
		
	},
	preloader : {
		show : function(){
			$(document.body).addClass("sending-form");
		},
		hide : function(){
			$(document.body).removeClass("sending-form");
		}
	},
	quit : function(msg){
		document.title = msg;
		$("#cssWizard").hide();
		Ext.Msg.show({
			title: "",
			msg: msg+"\n\n"+$i18n.Quit_Warning,
			buttonText: {yes:$i18n.OK},
				fn: function(button,txt) {
					if (button === 'yes') {
						window.close();
					}
				}
		});
	},
	loadNewStyle : function(newStyle){
		var currentStyle = this.getCurrentStyle();
		var currentURL = opener.window.location.href;
		var newURL;
		
		if (currentStyle != 'base') {
			newURL = currentURL.replace("style="+currentStyle,"style="+newStyle);
		}
		else {
			var queryStart = currentURL.search("\\?");
			if (queryStart == -1) {
				currentURL = currentURL + "?";
			}
			else {
				currentURL = currentURL + "&";
			}
			newURL = currentURL + "style="+newStyle;
		}
		
		opener.window.location = newURL;
	},
	getCurrentStyle : function() {
		var currentStyle = this.stylePath;
		currentStyle = currentStyle.replace("/style/","").replace("/","");
		return currentStyle;
	},
	updateTextFieldFromFile : function(e){
		// opener.parent.opener.document.getElementsByTagName("IFRAME")[0].contentWindow;
		// opener.parent.opener.window.nevow_clientToServerEvent('quit', '', '');
		var id = e.id.replace("File","");
		// Show file name in the file input
		$("#"+id).val($(e).val());
		// Save temporary file URL in hidden input
		$("#"+id+'TempURL').val(window.URL.createObjectURL(e.files[0]).toString());
		
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
		// To review: $app.baseContentCSS = contentCSS[0].replace(/\s+$/, ''); // Remove the last space
		$app.baseContentCSS = contentCSS[0];
		var myContentCSS = "";
		if (contentCSS.length==2) {
			myContentCSS = contentCSS[1];
			// myContentCSS = myContentCSS.replace(/(\r\n|\n|\r)/gm,"");
		}
		$app.myContentCSS = $app.removeStylePath(myContentCSS);
		$app.getAllValues("content",$app.myContentCSS);
		$app.loadConfig();
		
		// nav.css
		var navCSS = opener.$designer.navCSS.split($app.mark);
		// To review: $app.baseNavCSS = navCSS[0].replace(/\s+$/, ''); // Remove the last space
		$app.baseNavCSS = navCSS[0];
		var myNavCSS = "";
		if (navCSS.length==2) {
			myNavCSS = navCSS[1];
			// myNavCSS = myNavCSS.replace(/(\r\n|\n|\r)/gm,"");
		}
		$app.myNavCSS = $app.removeStylePath(myNavCSS);
		$app.getAllValues("nav",$app.myNavCSS);
		
	},
	addStylePath : function(c){
		c = $app.removeStylePath(c);
		c = c.replace(/url\(http:/g,'url--http:');
		c = c.replace(/url\(https:/g,'url--https:');
		c = c.replace(/url\(/g,'url('+$app.stylePath);
		c = c.replace(/url--http:/g,'url(http:');
		c = c.replace(/url--https:/g,'url(https:');
		
		// Replace relative paths to background images with its temporary URLs
		// (required when file is changed but not yet saved)
		var bodyBGURL_tempURL = $('#bodyBGURLTempURL').val();
		if (bodyBGURL_tempURL){
			var bodyBGURL_filename = $('#bodyBGURL').val();
			c = $app.replaceBackgroundImage(c, bodyBGURL_filename, bodyBGURL_tempURL);
		}
		var bodyBGURL_tempURL = $('#contentBGURLTempURL').val();
		if (bodyBGURL_tempURL){
			var bodyBGURL_filename = $('#contentBGURL').val();
			c = $app.replaceBackgroundImage(c, bodyBGURL_filename, bodyBGURL_tempURL);
		}
		var bodyBGURL_tempURL = $('#headerBGURLTempURL').val();
		if (bodyBGURL_tempURL){
			var bodyBGURL_filename = $('#headerBGURL').val();
			c = $app.replaceBackgroundImage(c, bodyBGURL_filename, bodyBGURL_tempURL);
		}
		
		return c;
	},
	replaceBackgroundImage : function(content, filename, fullURL) {
		var relativePath = 'background-image:url(' + $app.stylePath + filename + ')';
		var replacement = 'background-image:url(' + fullURL + ')';
		
		return content.replace(relativePath, replacement);
	},
	removeStylePath : function(c){
		var reg = new RegExp($app.stylePath, "g");
		return c.replace(reg, "");
	},
	loadConfig : function() {
		var nameField = jQuery('#styleName');
		nameField.val(opener.$designer.config.styleName).keyup(function(){
			this.value = this.value.replace(/["]+/g, '');
		});
		// Hide the name field if it's a new Style
		if (nameField.val()=="") $("#currentStyleInfo").hide().before($i18n.Save_to_name);		
		
		jQuery('#authorName').val(opener.$designer.config.authorName);
		jQuery('#authorURL').val(opener.$designer.config.authorURL);
		jQuery('#styleDescription').val(opener.$designer.config.styleDescription);
		
		// If current styleVersion is not available in the default option list,
		// append it to available options before setting value
		if (   opener.$designer.config.styleVersionMinor != 0
			|| opener.$designer.config.styleVersionMajor > 20
			|| opener.$designer.config.styleVersionMajor < 1) {
			$('#styleVersion').append($('<option>', {
			    value: opener.$designer.config.styleVersion,
			    text: opener.$designer.config.styleVersion
			}));
		}
		jQuery('#styleVersion').val(opener.$designer.config.styleVersion);
	},
	getAllValues : function(type,content){
		
		var c = content;
		
		// Advanced CSS
		var adv = c.split($app.advancedMark);
		if (adv.length==2 && adv[1]!="") {
			adv = adv[1];
			adv = adv.replace("\r\n","");
			$("#extra-"+type+"-css").val(adv);
		}
		
		// c = c.replace("\r\n\r\n","");
		c = c.replace(/(\r\n|\n|\r)/gm,"");
		
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
					} else if (currentValue[0]=="noEmIconColor"){
						var a = c.split(currentValue[0]+'*/background-image:url(')[1];
						var val = a.split(");")[0];
						if (val.indexOf("_black.png")!=-1) $("#noEmIconColor2").prop('checked',true);
						else if (val.indexOf("_white.png")!=-1) $("#noEmIconColor3").prop('checked',true);
					} else if (currentValue[0]=="emIconColor"){
						var a = c.split(currentValue[0]+'*/background-image:url(')[1];
						var val = a.split(");")[0];
						if (val.indexOf("_black.png")!=-1) $("#emIconColor2").prop('checked',true);
						else if (val.indexOf("_white.png")!=-1) $("#emIconColor3").prop('checked',true);
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
					else if (currentValue[0]=="noEmShowBox") {
						$("#noEmShowBox").prop('checked', true);
						$("#noEmBoxOptions").show();
					}
					// Other navigation options
					else if (currentValue[0]=="useNavigationIcons") {
						$("#useNavigationIcons").prop('checked', true);
						$("#otherNavOptions").hide();
						$("#navigationIconsOptions").show();
						if (c.indexOf("/*blackNavigationIcons*/")!=-1) $("#navigationIconsColor2").prop('checked', true);
						else if (c.indexOf("/*whiteNavigationIcons*/")!=-1) $("#navigationIconsColor3").prop('checked', true);
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
		
		// Regenerate the code (format it)
		this.getPreview();
		
	},
	trackChanges : function(){
		
		var f = document.getElementById("myForm");
		// INPUT fields
		var f_inputs = f.getElementsByTagName("INPUT");
		for (i=0;i<f_inputs.length;i++){
			var t= f_inputs[i].type;
			if (t=="checkbox" || t=="radio") {
				f_inputs[i].onchange=function() {
					if (this.id=="hideProjectTitle") {
						var o = document.getElementById('projectTitleOptions');
						if (this.checked) o.style.display="none";
						else o.style.display="block";
					}
					else if (this.id=="noEmShowBox") {
						var o = document.getElementById('noEmBoxOptions');
						if (this.checked) o.style.display="block";
						else o.style.display="none";
					}
					else if (this.id=="hideNavigation") {
						var o = document.getElementById('navigationOptions');
						if (this.checked) o.style.display="none";
						else o.style.display="block";
					}
					else if (this.id=="useNavigationIcons") {
						var o = document.getElementById('otherNavOptions');
						var n = document.getElementById('navigationIconsOptions');
						if (this.checked) {
							o.style.display="none";
							n.style.display="block";
						} else {
							n.style.display="none";
							o.style.display="block";
						}
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
	formatCSS : function(full) {
		var css = full;
		var adv = "";
		var hasCustomCSS = false;
		if (css.indexOf($app.advancedMark)!=-1) {
			var _css = css.split($app.advancedMark);
			css = _css[0];
			adv = _css[1];
			hasCustomCSS = true;
		}
		var css = css.replace(/(\r\n|\n|\r)/gm,"");
		css=css.replace(/{/g, "{\n");
		css=css.replace(/}/g, "\n}\n");
		css=css.replace(/\t/g,"");
		css=css.replace(/\*\//g,'*/\n');
		css=css.replace(/;\/\*/g,';\n/*');
		css = css.replace(/\n\n/gm,"\n");
		css = css.replace(/\s+$/, ''); // Remove the last space
		
		if (hasCustomCSS) return css+"\n"+$app.advancedMark+adv;
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
		
		// iDevices
		// With emphasis
		var emTitleColor = $("#emTitleColor").val();
		var emTitleBGColor = $("#emTitleBGColor").val();
		var emBorderColor = $("#emBorderColor").val();
		if (emTitleColor!="" || emTitleBGColor!="" || emBorderColor!=""){
			contentCSS += ".iDevice_header{";
				if (emTitleColor!="") contentCSS += "/*emTitleColor*/color:#"+emTitleColor+";"
				if (emTitleBGColor!="") contentCSS+="/*emTitleBGColor*/background-color:#"+emTitleBGColor+";";
				if (emBorderColor!="") contentCSS+="border-color:#"+emBorderColor+";";
			contentCSS += "}";
		}
		var emColor = $("#emColor").val();
		var emBGColor = $("#emBGColor").val();
		if (emColor!="" || emBGColor!="" || emBorderColor!=""){
			contentCSS += ".iDevice_inner{";
				if (emColor!="") contentCSS += "/*emColor*/color:#"+emColor+";"
				if (emBGColor!="") contentCSS+="/*emBGColor*/background-color:#"+emBGColor+";";
				if (emBorderColor!="") contentCSS+="border-color:/*emBorderColor*/#"+emBorderColor+";";
			contentCSS += "}";			
		}
		var emAColor = $("#emAColor").val();
		if (emAColor!=""){
			contentCSS += ".iDevice_inner a{";
				contentCSS += "/*emAColor*/color:#"+emAColor+";"
			contentCSS += "}";			
		}
		var emIconColor = $('input[name=emIconColor]:checked').val();
		var iconsExtension = "";
		if (emIconColor!='') {
			iconsExtension = "_"+emIconColor;
			contentCSS += ".iDevice_header .toggle-idevice a{/*emIconColor*/background-image:url("+this.stylePath+"_style_icons_"+emIconColor+".png);}";
		}
		// iDevice icons
		contentCSS +='\
			.iDeviceTitle{background-image:url('+this.stylePath+'icon_star'+iconsExtension+'.png);}\
			.activityIdevice .iDeviceTitle{background-image:url('+this.stylePath+'icon_assignment'+iconsExtension+'.png);}\
			.readingIdevice .iDeviceTitle{background-image:url('+this.stylePath+'icon_unread'+iconsExtension+'.png);}\
			.FileAttachIdeviceInc .iDeviceTitle{background-image:url('+this.stylePath+'icon_download'+iconsExtension+'.png);}\
			.WikipediaIdevice .iDeviceTitle{background-image:url('+this.stylePath+'icon_description'+iconsExtension+'.png);}\
			.ListaIdevice .iDeviceTitle,\
			.QuizTestIdevice .iDeviceTitle,\
			.MultichoiceIdevice .iDeviceTitle,\
			.TrueFalseIdevice .iDeviceTitle,\
			.MultiSelectIdevice .iDeviceTitle,\
			.ClozeIdevice .iDeviceTitle{background-image:url('+this.stylePath+'icon_question'+iconsExtension+'.png);}\
			.preknowledgeIdevice .iDeviceTitle{background-image:url('+this.stylePath+'icon_announcement'+iconsExtension+'.png);}\
			.GalleryIdevice .iDeviceTitle{background-image:url('+this.stylePath+'icon_media'+iconsExtension+'.png);}\
			.objectivesIdevice .iDeviceTitle{background-image:url('+this.stylePath+'icon_info'+iconsExtension+'.png);}\
			.ReflectionIdevice .iDeviceTitle{background-image:url('+this.stylePath+'icon_account'+iconsExtension+'.png);}\
		';
		// No emphasis
		var noEmColor = $("#noEmColor").val();
		var noEmShowBox = $("#noEmShowBox").prop("checked");
		if (noEmColor!="" || noEmShowBox) {
			contentCSS += ".iDevice.emphasis0{";
				if (noEmColor!="") contentCSS += "/*noEmColor*/color:#"+noEmColor+";"
				if (noEmShowBox) {
					var noEmBGColor = $("#noEmBGColor").val();
					var noEmBorderColor = $("#noEmBorderColor").val();
					if (noEmBorderColor=="") noEmBorderColor = $app.defaultValues.borderColor;
					contentCSS += "/*noEmShowBox*/padding:10px 20px;border:1px solid /*noEmBorderColor*/#"+noEmBorderColor+";border-radius:5px;";
					if (noEmBGColor!="") contentCSS+="/*noEmBGColor*/background-color:#"+noEmBGColor+";";
				}
			contentCSS += "}";
			if (noEmShowBox) contentCSS += ".hidden-idevice .emphasis0{padding:0;visibility:hidden;}";
		}
		var noEmAColor = $("#noEmAColor").val();
		if (noEmAColor!=""){
			contentCSS += ".emphasis0 a{";
				contentCSS += "/*noEmAColor*/color:#"+noEmAColor+";"
			contentCSS += "}";	
		}
		var noEmIconColor = $('input[name=noEmIconColor]:checked').val();
		if (noEmIconColor!='') {
			contentCSS += ".toggle-em0 a{/*noEmIconColor*/background-image:url("+this.stylePath+"_style_icons_"+noEmIconColor+".png);}";
		}
		
		// #nav
		var hideNavigation = $("#hideNavigation").prop("checked");
		var useNavigationIcons = $("#useNavigationIcons").prop("checked");
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
				if (pageWidth!="") {
					navCSS+="/*pageWidth*/width:"+pageWidth+pageWidthUnit+";";
					if (wrapperShadowColor=="") wrapperShadowColor = $app.defaultValues.shadowColor;
					navCSS+="/*wrapperShadowColor*/box-shadow:0 0 15px 0 #"+wrapperShadowColor+";";					
				}
				if (pageAlign=="left") navCSS+="/*pageAlign*/margin:0;";
				// if (wrapperShadowColor!="" && pageWidth!="100") navCSS+="/*wrapperShadowColor*/box-shadow:0 0 15px 0 #"+wrapperShadowColor+";";
				
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
		
		var nav2BGColor = $("#nav2BGColor").val();
		var nav2HoverBGColor = $("#nav2HoverBGColor").val();
		var nav2AColor = $("#nav2AColor").val();
		var nav2AHoverColor = $("#nav2AHoverColor").val();
		
		if (useNavigationIcons) {
			var iconsColor = "";
			var iconColorComment = "/*defaultNavigationIcons*/";
			var navigationIconsColor = $('input[name=navigationIconsColor]:checked').val();
			if (navigationIconsColor!="") {
				iconsColor += "_"+navigationIconsColor;
				iconColorComment = "/*"+navigationIconsColor+"NavigationIcons*/";
			}
			var icon = $app.stylePath+'_style_icons'+iconsColor+'.png';
			navCSS += '/*useNavigationIcons*/'+iconColorComment+'.pagination a span{position:absolute;overflow:hidden;clip:rect(0,0,0,0);height:0;}\
.pagination a,.pagination a:hover,.pagination a:focus{display:block;float:left;width:32px;height:32px;padding:0;background:url('+icon+') no-repeat 0 0;}\
.pagination .next,.pagination .next:hover,.pagination .next:focus{background-position:-50px 0;}\
.pagination .print-page,.pagination .print-page:hover,.pagination .print-page:focus{background-position:-200px 0;}\
#bottomPagination{height:72px;position:relative;overflow:hidden}\
#bottomPagination a{position:absolute;top:20px;right:74px;margin:0;}\
#bottomPagination .next{right:20px;}\
#nav-toggler a span{position:absolute;overflow:hidden;clip:rect(0,0,0,0);height:0;}\
#nav-toggler a{display:block;width:32px;height:32px;padding:0;background:url('+icon+') no-repeat -100px 0;}\
#nav-toggler a:hover{background:url('+icon+') no-repeat -100px 0;}\
#nav-toggler .show-nav{background-position:-150px 0;}\
#nav-toggler .show-nav:hover{background-position:-150px 0;}\
.pagination a,#nav-toggler a{filter:alpha(opacity=70);opacity:.7;}\
.pagination a:hover,.pagination a:focus,#nav-toggler a:hover{filter:alpha(opacity=100);opacity:1;}\
@media all and (max-width: 700px){\
#nav-toggler{height:32px;position:relative;}\
#nav-toggler a{padding:0;width:32px;position:absolute;left:50%;margin-left:-16px;}\
#siteNav{border-top:1px solid #ddd;}\
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
		
		if (fontFamily!='' || bodyColor!='' || fontSize!="" || contentBGColor!='' || contentBGURL!=''){
			contentCSS+="body{";
				if (fontFamily!="") contentCSS+="/*fontFamily*/font-family:"+fontFamily+";";
				if (bodyColor!="") contentCSS+="/*bodyColor*/color:#"+bodyColor+";";
				if (fontSize!="") contentCSS+="/*fontSize*/font-size:"+fontSize+"%;";
				// IMS, etc. body background
				if (contentBGColor!='') contentCSS+="/*contentBGColor*/background-color:#"+contentBGColor+";";
				if (contentBGURL!='') {
					if (contentBGURL.indexOf("http")!=0) contentBGURL = $app.stylePath+contentBGURL;
					contentCSS+="/*contentBGURL*/background-image:url("+contentBGURL+");";
					contentCSS+="/*contentBGRepeat*/background-repeat:"+contentBGRepeat+";";
					contentCSS+="/*contentBGPosition*/background-position:"+contentBGPosition+";";				
				}							
			contentCSS+="}";
		}
		if (aColor!='') contentCSS+="a{/*aColor*/color:#"+aColor+";}";
		
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
		
		// #header
		if (headerHeight!="" || headerBGColor!="" || headerBGURL!="" || headerBorderColor!="") {
			contentCSS+="#header,#emptyHeader,#nodeDecoration{";
				if (headerHeight!="") {
					contentCSS+="height:auto!important;";
					contentCSS+="/*headerHeight*/height:"+headerHeight+"px;";
					contentCSS+="min-height:"+headerHeight+"px;";
				}
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
		var footerBGColor = $("#footerBGColor").val();
		var footerAColor = $("#footerAColor").val();
		
		if (footerBorderColor!="" || footerColor!="" || footerTextAlign!="" || footerBGColor!='') {
			contentCSS += "#siteFooter{";
				if (footerBorderColor!="") {
					contentCSS += "border:1px solid /*footerBorderColor*/#"+footerBorderColor+";"
					navCSS += ".pagination{";
						navCSS += "border-color:#"+footerBorderColor+";";
					navCSS += "}";
				}
				if (footerColor!="") contentCSS += "/*footerColor*/color:#"+footerColor+";"
				if (footerTextAlign!="") contentCSS+="/*footerTextAlign*/text-align:"+footerTextAlign+";";
				if (footerBGColor!='') contentCSS+="/*footerBGColor*/background-color:#"+footerBGColor+";";
			contentCSS += "}";
		}
		
		if (footerBGColor!='') {
			navCSS+="#bottomPagination{";
				navCSS+="background-color:#"+footerBGColor+";";
			navCSS += "}";
		}
		
		if (footerAColor!="") {
			contentCSS += "#siteFooter a{";
				contentCSS += "/*footerAColor*/color:#"+footerAColor+";"
			contentCSS += "}";
		}
		
		contentCSS = this.formatCSS(contentCSS);
		navCSS = this.formatCSS(navCSS);
		
		var horizontalNavigation = $("#horizontalNavigation").prop("checked");
		if (horizontalNavigation) {
			var hideNavigation = $("#hideNavigation").prop("checked");
			if (!hideNavigation) navCSS += this.getHorizontalNavigationCSS();
		}		
		if (typeof(opener.myTheme.setNavHeight)!='undefined') opener.myTheme.setNavHeight();

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

		var hNavBorderColor = $app.defaultValues.borderColor;
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
		contentCSS = $app.addStylePath(contentCSS);
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
		navCSS = $app.addStylePath(navCSS);
		this.setCSS(navCSSTag,navCSS);
		
		// Menu height
		if (typeof(w.myTheme.setNavHeight)!='undefined') w.myTheme.setNavHeight();
	},
	collectAjaxData : function(content, nav, op, copyFrom) {
		if (copyFrom == undefined) {
			copyFrom = 'base';
		}
		var data = new FormData();
		
		data.append('contentcss', content);
		data.append('navcss', nav);
		if (op == 'saveStyle') {
			// Style has already been created, send the current Style Id as its directory name
			data.append('style_dirname', $app.getCurrentStyle());
		}
		data.append('action', op);
		
		// Get files uploaded to the editor form
		jQuery.each(jQuery('#bodyBGURLFile')[0].files, function(i, file) {
			data.append('bodyBGURLFile_'+i, file);
			data.append('bodyBGURLFilename_'+i, file.name);
		});
		jQuery.each(jQuery('#contentBGURLFile')[0].files, function(i, file) {
			data.append('contentBGURLFile_'+i, file);
			data.append('contentBGURLFilename_'+i, file.name);
		});
		jQuery.each(jQuery('#headerBGURLFile')[0].files, function(i, file) {
			data.append('headerBGURLFile_'+i, file);
			data.append('headerBGURLFilename_'+i, file.name);
		});
		if (op == 'createStyle') {
			data.append('copy_from', copyFrom);
		}
		
		// Get style name, author and description
		data.append('style_name', jQuery('#styleName').val());
		data.append('author', jQuery('#authorName').val());
		data.append('author_url', jQuery('#authorURL').val());
		data.append('description', jQuery('#styleDescription').val());
		data.append('version', jQuery('#styleVersion').val());
		
		return data;
	},
	createStyle : function(content, nav, copyFrom, closeDesigner){
		if (copyFrom == undefined) {
			copyFrom = 'base';
		}
		if (closeDesigner == undefined) {
			closeDesigner = false;
		}
		Ext.Msg.prompt(
			_('Create new style'),
			_('Name the new style'),
			function(button, input_value) {
				if (button === 'ok') {
					// Collect data from the main edition form except style_name,
					// that is read from this interactive form
					var data = $app.collectAjaxData(content, nav, 'createStyle', copyFrom);
		            data.set('style_name', input_value);
		            $app.preloader.show();
					jQuery.ajax({
		            	url: '/styleDesigner',
		            	data: data,
		            	cache: false,
		            	contentType: false,
		            	processData: false,
		            	type: 'POST',
		            	success: function(response, action) {
							$app.preloader.hide();
		            		// Form request can success, even if the create/save operation failed
		            		result = JSON.parse(response);
		            		if (result.success) {
		            			var message = result.message + '<br/>';
		            			if (closeDesigner) {
		            				message += _('Style Designer windows will be closed. ');
		            			}
		            			else {
		            				message += _('Page will be reloaded. ');
		            			}
		            			Ext.Msg.alert(
	            					'Success',
	            					message,
	            					function(btn, txt) {
	            						$app.loadNewStyle(result.style_dirname);
	            						if (closeDesigner) {
	            							opener.window.close();
	            							window.close();
	            						}
	            					}
		            			);
		            		}
		            		else {
		            			Ext.Msg.alert(
	            					'Failed',
	            					result.message,
	            					function(btn, txt) {
	            						createStyleWin.close();
	            					}
		            			);
		            		}
		            	},
		            	failure: function(response, action) {
							$app.preloader.hide();
		            		Ext.Msg.alert(
	            				'Failed',
	            				function(btn, txt) {
	            					createStyleWin.close();
	            				}
		            		);
		            	}
		            });
				}
			}
		);
	},
}
$(function(){
	$app.init();
});
