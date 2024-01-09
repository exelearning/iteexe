var myTheme = {
	init : function(){
		// Special links
		var sLcounter = 0;
		var nTw = $("#nodeTitle");
		var nT = nTw.html();
		var nav = $("#siteNav");
		$("li",nav).each(function(i){
			var replaceTitle = false;
			var t = $(this).text();
			var last = t.substring(t.length-1,t.length);
			if (last==" ") t = t.substring(0,t.length-1); /* IE 7 requires this */
			if (t.indexOf("- ")==0 && t.indexOf(" -")==(t.length-2) && $("li",this).length==0) {
				if (nT==t) replaceTitle = true;
				t = t.substring(2);
				t = t.substring(0,t.length-2);
				if (replaceTitle) {
					// Replace the document title
					document.title = document.title.replace(nT,t);
					nTw.html(t);
				}
				$("a",this).text(t).addClass("package-link package-link-"+sLcounter);
				if (sLcounter==0 && navigator.onLine) {
					// Get the previous first level LI
					var prevLi = $(this).prev("li");
					$("a",prevLi).addClass("last-content-link");
				}
				sLcounter ++;
			}
		});
		// Check if it's an old IE
		var ie_v = $exe.isIE();
		if (ie_v && ie_v<8) return false;
		var tit = $exe_i18n.menu+" ("+$exe_i18n.hide.toLowerCase()+")";
		var navToggler = '<p id="header-options">';
				navToggler += '<a href="#" onclick="myTheme.toggleMenu(this);return false" class="hide-nav" id="toggle-nav" title="'+tit+'">';
					navToggler += '<span>'+$exe_i18n.menu+'</span>';
				navToggler += '</a>';				
			navToggler += '</p>';
		var l = $(navToggler);
		nav.before(l);
		this.positionToggler();
		$(window).resize(function(){
			myTheme.positionToggler();
		});
		var url = window.location.href;
		url = url.split("?");
		if (url.length>1){
			if (url[1].indexOf("nav=false")!=-1) {
				myTheme.hideMenu();
			}
		}
		var toTop = $("#siteNav").offset().top;
		$(window).bind('scroll', function () {
			var nav = $('#siteNav');
			if ($(window).scrollTop() > toTop) {
				var navH = nav.height();
				if (navH<$(window).height() && navH<$("#main").height()) {
					nav.addClass('fixed');
				}
			} else {
				nav.removeClass('fixed');
			}
		});
	},
	rftTitle : function(){
		var isWebSite = $("body").hasClass("exe-web-site");
		var h = $("#headerContent");
		var t = h.text();
		t = t.split(" | ");
		if (t.length==2) {
			if (isWebSite) h.html("<span>"+t[1]+"<span class='sep'> | </span></span><a href='./index.html'>"+t[0]+"</a>");
			else h.html("<span>"+t[1]+"<span class='sep'> | </span></span>"+t[0]);
		} else {
			if (isWebSite) h.html("<a href='./index.html'>"+h.text()+"</a>");
		}
	},
	hideMenu : function(){
		$("#siteNav").hide();
		$(document.body).addClass("no-nav");
		myTheme.params("add");
		var tit = $exe_i18n.menu+" ("+$exe_i18n.show.toLowerCase()+")";
		$("#toggle-nav").attr("class","show-nav").attr("title",tit);
	},
	positionToggler : function(){
		var header = $("#header");
		if (header.length==1) $("#header-options").css("top",(header.height()+61)+"px")
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
	launchWindow : function(objAnchor, objEvent) {
		// Code origin: https://www.w3.org/TR/WCAG20-TECHS/SCR24.html
		var iKeyCode, bSuccess=false;
		if (objEvent && objEvent.type == 'keypress') {
			if (objEvent.keyCode) iKeyCode = objEvent.keyCode;
			else if (objEvent.which) iKeyCode = objEvent.which;
			if (iKeyCode != 13 && iKeyCode != 32) return true;
		}
		bSuccess = window.open(objAnchor.href);
		if (!bSuccess) return true;
		return false;
	},
	common : {
		init : function(){
			if ($("body").hasClass("exe-single-page")) {
				// Open definition lists
				$('.exe-dl-toggler').each(function(){
					$("a",this).eq(0).trigger("click");
				});
			}			
			myTheme.rftTitle();
			$(".iDevice_wrapper").each(function(i){
				if (i==0 && this.className.indexOf("FreeTextIdevice")!=-1) {
					$(".iDevice",this).css("margin-top",0);
				}
			});
			// Replace the node title
			if (!$("body").hasClass("exe-web-site")) {
				var n = $("#nodeTitle");
				if ($("body").hasClass("exe-single-page")) n = $(".nodeTitle");
				n.each(function(){
					var e = $(this);
					var t = e.text();
					if (t.indexOf("- ")==0 && t.substring(t.length-2,t.length)==" -") {
						t = t.substring(2);
						t = t.substring(0,t.length-2);
						e.text(t);
					}
				});
			}
			// External links
			$("a[rel^=external]").each(function(){
				var e = $(this);
				var html = e.html();
				if (e.text()==html && html.indexOf("ventana nueva")==-1 && (!this.title || this.title.indexOf("ventana nueva")==-1)) {
					var src = "_cedec_external_link.png";
					if (typeof(exe_style)!='undefined') src = exe_style.replace("content.css","") + src;
					// Add a title (not required)
					if (!this.title) this.title = "Se abre en ventana nueva";
					else this.title += " (se abre en ventana nueva)";
					this.innerHTML += '<span class="exe-hidden-accessible"> (se abre en ventana nueva) </span><img src="'+src+'" class="external-link-img" alt="Ventana nueva" width="12" height="12" />';
					this.onclick = function(event){ return myTheme.launchWindow(this, event) }
					this.onkeypress = function(event){ return myTheme.launchWindow(this, event) }
				}
			});
		}
	}
}

$(function(){
	myTheme.common.init();
	if ($("body").hasClass("exe-web-site")) myTheme.init();
});