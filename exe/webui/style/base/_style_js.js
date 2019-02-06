var myTheme = {
	init : function(){
		var ie_v = $exe.isIE();
		if (ie_v && ie_v<8) return false;
		setTimeout(function(){
			$(window).resize(function() {
				myTheme.reset();
			});
		},1000);
		var l = $('<p id="nav-toggler"><a href="#" onclick="myTheme.toggleMenu(this);return false" class="hide-nav" id="toggle-nav" title="'+$exe_i18n.hide+'"><span>'+$exe_i18n.menu+'</span></a></p>');
		$("#siteNav").before(l);
		$("#topPagination .pagination").prepend('<a href="#" onclick="window.print();return false" title="'+$exe_i18n.print+'" class="print-page"><span>'+$exe_i18n.print+'</span></a> ');
		this.addNavArrows();
		this.bigInputs();		
		var url = window.location.href;
		url = url.split("?");
		if (url.length>1){
			if (url[1].indexOf("nav=false")!=-1) {
				myTheme.hideMenu();
				return false;
			}
		}
		myTheme.setNavHeight();
		// We execute this more than once because sometimes the height changes because of the videos, etc.
		setTimeout(function(){
			myTheme.setNavHeight();
		},1000);
		$(window).load(function(){
			myTheme.setNavHeight();
		});
	},
	isMobile : function(){
		try {
			document.createEvent("TouchEvent");
			return true; 
		} catch(e) {
			return false;
		}
	},	
	bigInputs : function(){
		if (this.isMobile()) {
			$(".MultiSelectIdevice,.MultichoiceIdevice,.QuizTestIdevice,.TrueFalseIdevice").each(function(){
				$('input:radio',this).screwDefaultButtons({
					image: 'url("_style_input_radio.png")',
					width: 30,
					height: 30
				});
				$('input:checkbox',this).screwDefaultButtons({
					image: 'url("_style_input_checkbox.png")',
					width: 30,
					height: 30
				});
				$(this).addClass("custom-inputs");
			});
		}		
	},
	addNavArrows : function(){
		$("#siteNav ul ul .daddy").each(
			function(){
				this.innerHTML+='<span> &#9658;</span>';
			}
		);
	},	
	hideMenu : function(){
		$("#siteNav").hide();
		$(document.body).addClass("no-nav");
		myTheme.params("add");
		$("#toggle-nav").attr("class","show-nav").attr("title",$exe_i18n.show);
	},
	setNavHeight : function(){
		var n = $("#siteNav");
		var c = $("#main-wrapper");
		var nH = n.height();
		var cH = c.height();
		var isMobile = $("#siteNav").css("float")=="none";
		if (cH<nH) {
			cH = nH;
			if (!isMobile) c.height(cH);
		}
		var h = (cH-nH+40)+"px";
		var m = 0;
		if (isMobile) {
			h = 0;
			m = "15px";
		} else if (n.css("display")=="table") {
			h = 0;
		}
		n.css({
			"padding-bottom":h,
			"margin-bottom":m
		});
	},
	toggleMenu : function(e){
		if (typeof(myTheme.isToggling)=='undefined') myTheme.isToggling = false;
		if (myTheme.isToggling) return false;
		
		var l = $("#toggle-nav");
		
		if (!e && $(window).width()<900 && l.css("display")!='none') return false; // No reset in mobile view
		if (!e) l.attr("class","show-nav").attr("title",$exe_i18n.show); // Reset
		
		myTheme.isToggling = true;
		
		if (l.attr("class")=='hide-nav') {       
			l.attr("class","show-nav").attr("title",$exe_i18n.show);
			$("#siteFooter").hide();
			$("#siteNav").slideUp(400,function(){
				$(document.body).addClass("no-nav");
				$("#siteFooter").show();
				myTheme.isToggling = false;
			}); 
			myTheme.params("add");
		} else {
			l.attr("class","hide-nav").attr("title",$exe_i18n.hide);
			$(document.body).removeClass("no-nav");
			$("#siteNav").slideDown(400,function(){
				myTheme.isToggling = false;
				myTheme.setNavHeight();
			});
			myTheme.params("delete");            
		}
		
	},
	param : function(e,act) {
		if (act=="add") {
			var ref = e.href;
			var con = "?";
			if (ref.indexOf(".html?")!=-1 || ref.indexOf(".htm?")!=-1) con = "&";
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
		myTheme.setNavHeight();
	},
	getCustomIcons : function(){
		// Provisional solution so the user can use the iDevice Editor to choose an icon
		$(".iDevice_header").each(function(){
			var i = this.style.backgroundImage;
			if (i!="") $(".iDeviceTitle",this).css("background-image",i);
			this.style.backgroundImage = "none";
		});
	}
}
$(function(){
	if ($("body").hasClass("exe-web-site")) {
		myTheme.init();
	}
	myTheme.getCustomIcons();
});

/*!
 * ScrewDefaultButtons v2.0.6
 * http://screwdefaultbuttons.com/
 *
 * Licensed under the MIT license.
 * Copyright 2013 Matt Solano http://mattsolano.com
 *
 * Date: Mon February 25 2013
 */(function(e,t,n,r){var i={init:function(t){var n=e.extend({image:null,width:50,height:50,disabled:!1},t);return this.each(function(){var t=e(this),r=n.image,i=t.data("sdb-image");i&&(r=i);r||e.error("There is no image assigned for ScrewDefaultButtons");t.wrap("<div >").css({display:"none"});var s=t.attr("class"),o=t.attr("onclick"),u=t.parent("div");u.addClass(s);u.attr("onclick",o);u.css({"background-image":r,width:n.width,height:n.height,cursor:"pointer"});var a=0,f=-n.height;if(t.is(":disabled")){a=-(n.height*2);f=-(n.height*3)}t.on("disableBtn",function(){t.attr("disabled","disabled");a=-(n.height*2);f=-(n.height*3);t.trigger("resetBackground")});t.on("enableBtn",function(){t.removeAttr("disabled");a=0;f=-n.height;t.trigger("resetBackground")});t.on("resetBackground",function(){t.is(":checked")?u.css({backgroundPosition:"0 "+f+"px"}):u.css({backgroundPosition:"0 "+a+"px"})});t.trigger("resetBackground");if(t.is(":checkbox")){u.on("click",function(){t.is(":disabled")||t.change()});u.addClass("styledCheckbox");t.on("change",function(){if(t.prop("checked")){t.prop("checked",!1);u.css({backgroundPosition:"0 "+a+"px"})}else{t.prop("checked",!0);u.css({backgroundPosition:"0 "+f+"px"})}})}else if(t.is(":radio")){u.addClass("styledRadio");var l=t.attr("name");u.on("click",function(){!t.prop("checked")&&!t.is(":disabled")&&t.change()});t.on("change",function(){if(t.prop("checked")){t.prop("checked",!1);u.css({backgroundPosition:"0 "+a+"px"})}else{t.prop("checked",!0);u.css({backgroundPosition:"0 "+f+"px"});var n=e('input[name="'+l+'"]').not(t);n.trigger("radioSwitch")}});t.on("radioSwitch",function(){u.css({backgroundPosition:"0 "+a+"px"})});var c=e(this).attr("id"),h=e('label[for="'+c+'"]');h.on("click",function(){u.trigger("click")})}if(!e.support.leadingWhitespace){var c=e(this).attr("id"),h=e('label[for="'+c+'"]');h.on("click",function(){u.trigger("click")})}})},check:function(){return this.each(function(){var t=e(this);i.isChecked(t)||t.change()})},uncheck:function(){return this.each(function(){var t=e(this);i.isChecked(t)&&t.change()})},toggle:function(){return this.each(function(){var t=e(this);t.change()})},disable:function(){return this.each(function(){var t=e(this);t.trigger("disableBtn")})},enable:function(){return this.each(function(){var t=e(this);t.trigger("enableBtn")})},isChecked:function(e){return e.prop("checked")?!0:!1}};e.fn.screwDefaultButtons=function(t,n){if(i[t])return i[t].apply(this,Array.prototype.slice.call(arguments,1));if(typeof t=="object"||!t)return i.init.apply(this,arguments);e.error("Method "+t+" does not exist on jQuery.screwDefaultButtons")};return this})(jQuery);