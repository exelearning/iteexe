var eXeAssistant = {
    currentPos : 0,
    init : function(){
        this.i18n();
        this.setupLinks();
        this.toggler.init();
    },
    template : function(e,data){
        return e.innerHTML.replace(/%(\w*)%/g,
        function(m,key){
            return data.hasOwnProperty(key)?data[key]:"";
        });
    },
    i18n : function(){
        document.title = _("Assistant");
        var e = document.getElementById("assistant");
        e.innerHTML=this.template(e,$i18n);
		// Replace some strings
		var i = document.getElementById("iDevices");
		if (i) i.innerHTML = i.innerHTML.replace(" iDevices"," <strong>iDevices</strong>")
    },
    toggler : {
        init : function(){
            var t = document.getElementById("tabs-toggler");
            if (t) {
                var a = t.getElementsByTagName("A");
                if (a.length==1) {
                    a[0].onclick = function(){
                        eXeAssistant.toggler.go(this);
                        return false;
                    }
                }
            }        
        },
        go : function(e) {
            var tag = document.getElementsByTagName("HTML");
            if (!tag || tag.length!=1) return false;
            tag = tag[0];
            if (e.className=="") {
                tag.className = "maximized";
                e.className = "active";
            } else {
                tag.className = "";
                e.className = "";
            }
        }
    },
    openDialog : function(id,tit,url,w,h){
        var helpDialog = new top.Ext.Window ({
          height: top.eXe.app.getMaxHeight(w),
          width: h,
          modal: true,
          resizable: false,
          id: id,
          title: tit,
          items: {
              xtype: 'uxiframe',
              src: url,
              height: '100%'
          }
        });
        helpDialog.show();      
    },
    setupLinks : function() {
        $("#tabs a").click(function(){
            var h = this.href;
            h = h.split("#")[1];
            eXeAssistant.displayTab(h,this);
            return false;
        }); 
        $(".trigger").click(function(){
            var e = $(this);
            var url = e.attr("href");
            var id = url.replace("-","");
            var tit = e.text();
            var w = 700;
            var h = 420;            
            var c = this.className;
                c = c.split(" ");
            if (c.length==2) {
                c = c[1];
                c = c.split("-");
                if(c.length==3) {
                    var _w = parseInt(c[1]);
                    if (!isNaN(_w) && _w>w) w = _w;
                    var _h = parseInt(c[2]);
                    if (!isNaN(_h) && _h>h) h = _h;                    
                }
            }
            eXeAssistant.openDialog(id,tit,url,w,h);
            return false;
        });
        $(".next").click(function(i){
            var h = this.href;
            h = h.split("#")[1];
            eXeAssistant.displayTab(h);
            return false;
        });
        $("#prev").attr("title",_('Previous')).click(function(){
            $("#tabs a").eq(eXeAssistant.currentPos-1).trigger("click");
        });
        $("#next").attr("title",_('Next')).click(function(){
            $("#tabs a").eq(eXeAssistant.currentPos+1).trigger("click");
        });      
    },
    displayTab : function(id,e) {
        var pos = parseInt(id.replace("tab",""));
        var tabs = $(".tab");
        tabs.hide();
        $("#"+id).show();
        $("#tabs a").attr("class","");
        
        eXeAssistant.currentPos = pos;
        $("#current").text(pos+1);
        
        // Hide/Show pagination
        if (pos==0) {
            $("#prev").css("visibility","hidden");
        } else {
            $("#prev").css("visibility","visible");
        }
        if (pos>=(tabs.length-1)) {
            $("#next").css("visibility","hidden");
        } else {
            $("#next").css("visibility","visible");
        }
        
        if (!e) var e = $("#tabs a").eq(pos)[0];
        e.className = "current";
    }
}
$(function(){
   eXeAssistant.init(); 
});