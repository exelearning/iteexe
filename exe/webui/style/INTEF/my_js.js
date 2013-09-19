var INTEF = {
    init : function(){
        var d = document.body.className;
        if (d!='exe-single-page') {
            d += ' js';
            var ie_v = INTEF.isIE();
            if (ie_v) {
                if (ie_v>7) INTEF.iDeviceToggler.init();
            } else INTEF.iDeviceToggler.init();
        }
    },
    isIE :function() {
        var n = navigator.userAgent.toLowerCase();
        return (n.indexOf('msie') != -1) ? parseInt(n.split('msie')[1]) : false;
    },
    iDeviceToggler : {
        init : function(){
            var t = $exe_i18n.showHide;
            var t = t.split("/");
            if (t.length!=2) return false;
            INTEF.iDeviceToggler.t1 = t[0];
            INTEF.iDeviceToggler.t2 = t[1];
            var em1 = $(".iDevice_header");
            var em0 = $(".iDevice.emphasis0");
            if ((em1.length+em0.length)>1) {
                em1.each(function(){
                    var t = INTEF.iDeviceToggler.t2;
                    var e = $(this);
                    var iDeviceID = e.parent().parent().attr("id");
                    if (!iDeviceID) return false;
                    var l = '<p class="toggle-idevice toggle-em1"><a href="#" onclick="INTEF.iDeviceToggler.toggle(this,\''+iDeviceID+'\',\'em1\')" title="'+t+'"><span>'+t+'</span></a></p>';
                    var h = e.html();
                    e.html(h+l);
                });
                em0.each(function(){
                    var t = INTEF.iDeviceToggler.t2;
                    var e = $(this);
                    var iDeviceID = e.parent().attr("id");
                    if (!iDeviceID) return false;
                    var l = '<p class="toggle-idevice toggle-em0"><a href="#" onclick="INTEF.iDeviceToggler.toggle(this,\''+iDeviceID+'\',\'em0\')" title="'+t+'"><span>'+t+'</span></a></p>';
                    var h = e.html();
                    e.before(l);
                });
            }
        },
        toggle : function(e,id,em) {
            var t = INTEF.iDeviceToggler.t2;
            var i = $("#"+id);
            var sel = ".iDevice_content";
            if (em=="em1") sel = ".iDevice_inner";
            var iC = $(sel,i);
            var c = i.attr("class");
            if (c.indexOf(" hidden-idevice")==-1) {
                t = INTEF.iDeviceToggler.t1;
                c += " hidden-idevice";
                iC.slideUp("fast");
                e.className = "show-idevice";
                e.title = t;
                e.innerHTML = "<span>"+t+"</span>";
            } else {
                c = c.replace(" hidden-idevice","");
                iC.slideDown("fast");
                e.className = "hide-idevice";
                e.title = t;
                e.innerHTML = "<span>"+t+"</span>";
            }
            i.attr("class",c);
        }
    }
}

$(function(){
    INTEF.init();
});