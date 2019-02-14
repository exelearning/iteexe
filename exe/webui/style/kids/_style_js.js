var myTheme = {
    init : function(){
		var ie_v = $exe.isIE();
        if (ie_v && ie_v<8) return false;
        setTimeout(function(){
            $(window).resize(function() {
                myTheme.reset();
            });
        },1000);
        var l = $('<p id="nav-toggler"><a href="#" onclick="myTheme.toggleMenu(this)" class="hide-nav" id="toggle-nav" title="'+$exe_i18n.hide+'"><span>'+$exe_i18n.menu+'</span></a></p>');
        var n = $("#siteNav");
		n.before(l);
        var url = window.location.href;
        url = url.split("?");
        if (url.length>1){
            if (url[1].indexOf("nav=false")!=-1) {
                myTheme.hideMenu();
				return false;
            }
        }
		// border-radius
		var last = "";
		$("A",n).each(function(i){
			if (i==0) this.className+=" top-right-radius";
			if ($(this).is(":visible")) last = this;
		});
		if (last!="") last.className+=" bottom-right-radius";
		this.addNavArrows(n);
    },
	setIcons : function(k){
		$(".iDevice_wrapper").each(function(i){
			if (this.className.indexOf("em_iDevice")!=-1) {
				var e = $(this);
				// Provisional solution so the user can use the iDevice Editor to choose an icon
				$(".iDevice_header",e).each(function(){
					var i = this.style.backgroundImage;
					if (i!="") $(".iDeviceTitle",this).css("background-image",i);
					this.style.backgroundImage = "none";
				});
				var t = $(".iDeviceTitle",e);
				var c = t.css("background-image");
				if (c!="") {
					t.css("background-image","none");
					e.prepend("<div class='icon_wrapper' style='background-image:"+c+"'></div>");
				}
			}
		});		
	},
	addNavArrows : function(n){
		$("ul ul .daddy",n).each(
			function(){
				this.innerHTML+=' <span>&#9658;</span>';
			}
		);
	},	
    hideMenu : function(){
        $("#siteNav").hide();
        $(document.body).addClass("no-nav");
        myTheme.params("add");
        $("#toggle-nav").attr("class","show-nav").attr("title",$exe_i18n.show);
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
    }    
}

$(function(){
    if ($("body").hasClass("exe-web-site")) {
        myTheme.init();
    }
    myTheme.setIcons(document.body.className);
});