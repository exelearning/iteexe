var myTheme = {
	collapseActivities : false, // Minimize interactive activities
	// Activities (to minify if collapseActivities is true)
	// Activities using any of these icons will be minified too: icon_udl_exp_tarea, icon_udl_exp_interactivo
	activities : [
		"Lista",
		"QuizTest",
		"ScrambledList",
		"Multichoice",
		"MultiSelect",
		"TrueFalse",
		"Cloze",
		"interactive-video",
		"GeoGebra",
		"Eleccionmultiplefpd",
		"Clozefpd",
		"Clozelangfpd",
		"Seleccionmultiplefpd",
		"Verdaderofalsofpd",
		"Ejercicioresueltofpd"
	],
	init : function(){
		var ie_v = $exe.isIE();
		if (ie_v && ie_v<8) return false;
		setTimeout(function(){
			$(window).resize(function() {
				myTheme.reset();
			});
		},1000);
		var tit = $exe_i18n.menu+" ("+$exe_i18n.hide.toLowerCase()+")";
		var navToggler = '<p id="header-options">';
				navToggler += '<a href="#" class="hide-nav" id="toggle-nav" title="'+tit+'">';
					navToggler += '<span>'+$exe_i18n.menu+'</span>';
				navToggler += '</a>';
			navToggler += '</p>';
		var l = $(navToggler);
		var nav = $("#siteNav");
		nav.before(l);
		$("#toggle-nav").click(function(){
			myTheme.toggleMenu(this);
			return false;
		});
		$("#print-page").click(function(){
			window.print();
			return false;
		});		
		if ( $("A",nav).attr("class").indexOf("active")==0 ) $("BODY").addClass("home-page");
		var url = window.location.href;
		url = url.split("?");
		if (url.length>1){
			if (url[1].indexOf("nav=false")!=-1) {
				myTheme.hideMenu();
			}
		}
		// Set the min-height for the content wrapper
		$("#main-wrapper").css("min-height",(nav.height()+25)+"px");
	},
	init2 : function(){
		var ie_v = $exe.isIE();
		if (ie_v && ie_v<8) return false;
		setTimeout(function(){
			$(window).resize(function() {
				myTheme.reset();
			});
		},1000);
		var tit = $exe_i18n.menu+" ("+$exe_i18n.hide.toLowerCase()+")";
		var navToggler = '<p id="header-options">';
				navToggler += '<a href="#" class="hide-nav" id="toggle-nav" title="'+tit+'">';
					navToggler += '<span>'+$exe_i18n.menu+'</span>';
				navToggler += '</a>';
			navToggler += '</p>';
		var l = $(navToggler);
		var nav = $("#siteNav");
		nav.before(l);
		$("#toggle-nav").click(function(){
			myTheme.toggleMenu(this);
			return false;
		});
		$("#print-page").click(function(){
			window.print();
			return false;
		});		
		if ( $("A",nav).attr("class").indexOf("active")==0 ) $("BODY").addClass("home-page");
		var url = window.location.href;
		url = url.split("?");
		if (url.length>1){
			if (url[1].indexOf("nav=false")!=-1) {
				myTheme.hideMenu();
			}
		}
		// Set the min-height for the content wrapper
		$("#main-wrapper").css("min-height",(nav.height()+25)+"px");
		myTheme.hideMenu();
	
	},
	hideMenu : function(){
		$("#siteNav").hide();
		$(document.body).addClass("no-nav");
		myTheme.params("add");
		var tit = $exe_i18n.menu+" ("+$exe_i18n.show.toLowerCase()+")";
		$("#toggle-nav").attr("class","show-nav").attr("title",tit);
	},
	toggleMenu : function(e){
		if (typeof(myTheme.isToggling)=='undefined') myTheme.isToggling = false;
		if (myTheme.isToggling) return false;
		
		var l = $("#toggle-nav");
		
		if (!e && $(window).width()<900 && l.css("display")!='none') return false; // No reset in mobile view
		if (!e) {
			var tit = $exe_i18n.menu+" ("+$exe_i18n.show.toLowerCase()+")";
			l.attr("class","show-nav").attr("title",tit); // Reset
		}
		
		myTheme.isToggling = true;
		
		if (l.attr("class")=='hide-nav') {  
			var tit = $exe_i18n.menu+" ("+$exe_i18n.show.toLowerCase()+")";
			l.attr("class","show-nav").attr("title",tit);
			$("#siteFooter").hide();
			$("#siteNav").slideUp(400,function(){
				$(document.body).addClass("no-nav");
				$("#siteFooter").show();
				myTheme.isToggling = false;
			}); 
			myTheme.params("add");
		} else {
			var tit = $exe_i18n.menu+" ("+$exe_i18n.hide.toLowerCase()+")";
			l.attr("class","hide-nav").attr("title",tit);
			$(document.body).removeClass("no-nav");
			$("#siteNav").slideDown(400,function(){
				myTheme.isToggling = false;
			});
			myTheme.params("delete");			
		}
		
	},
	param : function(e,act) {
		if (act=="add") {
			var ref = e.href;
			var con = "?";
			if (ref.indexOf(".html?")!=-1) con = "&";
			var param = "nav=false";
			if (ref.indexOf(param)==-1) {
				ref += con+param;
				e.href = ref;					
			}			
		} else {
			// This will remove all params
			var ref = e.href;
			ref = ref.split("?");
			e.href = ref[0];
		}
	},
	params : function(act){
		$("A",".pagination").each(function(){
			myTheme.param(this,act);
		});
	},
	reset : function() {
		myTheme.toggleMenu();		
	},
	common : {
		init : function(c){
			var iDevices = $(".iDevice_wrapper");
			var firstIsText = false;
			iDevices.each(function(i){
				if (iDevices.length>1 && i==0 && this.className.indexOf("FreeTextIdevice")!=-1) {
					$(".iDevice",this).css("margin-top",0);
					firstIsText = true;
				}
				// Use common CSS class names (so they have a similar presentation)
				if (!$(this).hasClass("UDLcontentIdevice")) {
					var header = $(".iDevice_header",this);
					var icon = header.css("background-image");
					if (typeof(icon)=='string'){
						if (icon.indexOf("icon_udl_eng")!=-1) $(this).addClass("em_iDevice_udl_eng_like");
						if (icon.indexOf("icon_udl_exp")!=-1) $(this).addClass("em_iDevice_udl_exp_like");
						if (icon.indexOf("icon_udl_rep")!=-1) $(this).addClass("em_iDevice_udl_rep_like");
					}
				}
			}); 
			if (myTheme.collapseActivities) {
				var as = myTheme.activities;
				var editor = $("#activeIdevice");
				if (typeof(_)!='function' || editor.length!=1) {
					if ($(".iDevice").length>1) {
						for (var z=0;z<as.length;z++){
							var a = as[z];
							// Minimize those iDevices (like clicking on .toggle-idevice a)
							var aW = $(".iDevice_wrapper."+a+"Idevice");
							aW.addClass("hidden-idevice");
							$(".toggle-idevice a",aW).attr("class","show-idevice");
							$(".iDevice_inner",aW).hide();
							if(a=='GeoGebra') $("div.auto-geogebra",aW).addClass("disableAutoScale"); // Prevent zoom problems when the iDevice is minified
						}
						// The iDevices with the icon_udl_exp_tarea are minified too
						$(".iDevice_wrapper").each(function(){
							var header = $(".iDevice_header",this);
							if (header.length==1) {
								var img = header.attr("style");
								if (typeof(img)=='string' && (img.indexOf("icon_udl_exp_tarea.svg")!=-1||img.indexOf("icon_udl_exp_interactivo.svg")!=-1)) {
									var aW = $(this);
									aW.addClass("hidden-idevice");
									$(".toggle-idevice a",aW).attr("class","show-idevice");
									$(".iDevice_inner",aW).hide();
								}
							}
						});
						// You can toggle the iDevice clicking on any part of its header
						$(".iDevice_header").click(function(){
							$(".toggle-idevice a",this).trigger("click");
						}).css("cursor","pointer");
					}
				}
			}			
		}
	}
}

$(function(){
	if ($("body").hasClass("exe-web-site")) {
		if($(window).width()<829 && $(window).height()<1800){
			myTheme.init2();
		} else {
			myTheme.init();
		}
	}
	myTheme.common.init();
});