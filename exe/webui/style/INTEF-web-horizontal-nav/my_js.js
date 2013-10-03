var myTheme = {
    init : function(){
        $(window).resize(function() {
            myTheme.reset();
        });    
        var t = $exe_i18n.showHide;
        var l = $('<p id="nav-toggler"><a href="#" onclick="myTheme.toggleMenu()" class="hide-nav" id="toggle-nav"><span>'+t+'</span></a></p>');
        $("#siteNav").before(l);
        var url = window.location.href;
        url = url.split("?");
        if (url.length>1){
            if (url[1].indexOf("nav=false")!=-1 && $(window).width()<700) {
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
        $("#main").css({"padding-left":p});
        myTheme.params("add");
        $("#toggle-nav").attr("class","show-nav");
    },
    toggleMenu : function(){
        var c = $("#main");
        var l = $("#toggle-nav");
        if (l.attr("class")=='hide-nav') {       
            l.attr("class","show-nav");
            $("#siteNav").slideUp(400,function(){
                var p = "20px"; //Padding
                if ($(window).width()<700) {
                    p = "10px";
                }                
                $("#main").css({"padding-left":p});
            }); 
            myTheme.params("add");
        } else {
            l.attr("class","hide-nav");
            var p = "20px"; //Padding
            if ($(window).width()<700) {
                p = "10px";
            }
            $("#main").css({"padding-left":p});
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
        $("#toggle-nav").attr("class","show-nav");
        myTheme.toggleMenu();        
    }    
}

$(function(){
    if (document.body.className=='exe-web-site') {
        myTheme.init();
    }
});