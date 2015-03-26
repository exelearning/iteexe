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
        $("#siteNav").before(l);
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
		var h = cH-nH+40;
		var m = 0;
		if ($("#siteNav").css("float")=="none") {
			h = 0;
			m = 15;
		}
		if (n.css("display")!="table") {
			n.css({
				"padding-bottom":h+"px",
				"margin-bottom":m+"px"
			});
		}
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
		myTheme.setNavHeight();
    }    
}

$(function(){
    if (document.body.className=='exe-web-site js') {
        myTheme.init();
    }
});