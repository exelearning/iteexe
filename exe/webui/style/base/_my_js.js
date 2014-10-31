var myTheme = {
    init : function(){
		var ie_v = $exe.isIE();
		if (ie_v && ie_v<8) {
			$("#topPagination").wrap("<div />");
			return false;
		}
        setTimeout(function(){
            $(window).resize(function() {
                myTheme.reset();
            });
        },1000);
		var tit = $exe_i18n.menu+" ("+$exe_i18n.hide.toLowerCase()+")";
        var l = $('<p id="nav-toggler"><a href="#" onclick="myTheme.toggleMenu(this)" class="hide-nav" id="toggle-nav" title="'+tit+'"><span>'+$exe_i18n.menu+'</span></a></p>');
        $("#siteNav").before(l);
        var url = window.location.href;
        url = url.split("?");
        if (url.length>1){
            if (url[1].indexOf("nav=false")!=-1) {
                myTheme.hideMenu();
            }
        }
		this.addNavArrows();
		this.addPaginationTitles();
    },
	addPaginationTitles : function(){
		$("A","#topPagination,#bottomPagination").each(
			function(){
				this.title = $(this).text();
			}
		);
	},
	addNavArrows : function(){
		$("#siteNav ul ul .daddy").each(
			function(){
				this.innerHTML+=' <span>&#9658;</span>';
			}
		)
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
			$("#siteNav").hide(); // No effects
			//$("#siteNav").slideUp(400,function(){
                $(document.body).addClass("no-nav");
                $("#siteFooter").show();
                myTheme.isToggling = false;
            //});
            myTheme.params("add");
        } else {
            var tit = $exe_i18n.menu+" ("+$exe_i18n.hide.toLowerCase()+")";
			l.attr("class","hide-nav").attr("title",tit);
            $(document.body).removeClass("no-nav");
			$("#siteNav").show(); // No effects
			//$("#siteNav").slideDown(400,function(){
                myTheme.isToggling = false;
            //});
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
    }    
}

$(function(){
    if (document.body.className=='exe-web-site js') {
        myTheme.init();
    }
});

$exe.iDeviceToggler.toggle = function(e,id,em){
	var t = $exe_i18n.hide;
	var i = $("#"+id);
	var sel = ".iDevice_content";
	if (em=="em1") sel = ".iDevice_inner";
	var iC = $(sel,i);
	var c = i.attr("class");
	if (typeof(c)=='undefined') return false;
	if (c.indexOf(" hidden-idevice")==-1) {
		t = $exe_i18n.show;
		c += " hidden-idevice";
		iC.hide();
		e.className = "show-idevice";
		e.title = t;
		e.innerHTML = "<span>"+t+"</span>";
	} else {
		c = c.replace(" hidden-idevice","");
		iC.show();
		e.className = "hide-idevice";
		e.title = t;
		e.innerHTML = "<span>"+t+"</span>";
	}
	i.attr("class",c);
}