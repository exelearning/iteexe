var myTheme = {
    init : function(){
		var ie_v = $exe.isIE();
		if (ie_v && ie_v<8) return false;		
        $(window).resize(function() {
            myTheme.reset();
        });    
        var l = $('<p id="nav-toggler"><a href="#" onclick="myTheme.toggleMenu()" class="hide-nav" id="toggle-nav" title="'+$exe_i18n.hide+'"><span>'+$exe_i18n.menu+'</span></a></p>');
        $("#siteNav").before(l);
        var url = window.location.href;
        url = url.split("?");
        if (url.length>1){
            if (url[1].indexOf("nav=false")!=-1) {
                myTheme.hideMenu();
            }
        }
    },
    hideMenu : function(){
        $("#siteNav").hide();
        var p = "20px"; //Padding
        if ($(window).width()<700) {
            p = "10px";
        }          
        $("#main").css({"width":"auto","padding-left":p,"float":"none"});
		$(document.body).addClass("no-nav");
        myTheme.params("add");
        $("#toggle-nav").attr("class","show-nav").attr("title",$exe_i18n.show);
    },
    toggleMenu : function(){
        var c = $("#main");
        var l = $("#toggle-nav");
        if (l.attr("class")=='hide-nav') {       
            l.attr("class","show-nav").attr("title",$exe_i18n.show);
			$(document.body).addClass("no-nav");
            $("#siteFooter").hide();
			$("#siteNav").slideUp(400,function(){
                var p = "20px"; //Padding
                if ($(window).width()<700) {
                    p = "10px";
                }                
                $("#main").css({"width":"auto","padding-left":p,"float":"none"});
				$("#siteFooter").show();
            }); 
            myTheme.params("add");
        } else {
            l.attr("class","hide-nav").attr("title",$exe_i18n.hide);
            var w = "715px"; //Width
            var f = "right"; //Float
            var p = "0"; //Padding
            var ww = $(window).width();
            if(ww>700 && ww<1015) {
                w = "auto";
                f = "none";
                p = "20px";         
            } else if (ww<700) {
                w = "auto";
                f = "none";
                p = "10px";
            }
            $("#main").css({"width":w,"padding-left":p,"float":f});
            $(document.body).removeClass("no-nav");
			$("#siteNav").slideDown();
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
        $("#toggle-nav").attr("class","show-nav").attr("title",$exe_i18n.show);
        myTheme.toggleMenu();        
    }    
}

$(function(){
    if (document.body.className=='exe-web-site') {
        myTheme.init();
    }
});