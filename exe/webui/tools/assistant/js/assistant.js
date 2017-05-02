var eXeAssistant = {
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
        document.title = $i18n.string_001;
        var e = document.getElementById("assistant");
        e.innerHTML=this.template(e,$i18n);
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
    setupLinks : function() {
        $("#tabs a").click(function(){
            var h = this.href;
            h = h.split("#")[1];
            eXeAssistant.displayTab(h,this);
            return false;
        }); 
        $(".trigger").click(function(){
            var h = this.href;
            h = h.split("#")[1];
            $(top.document.getElementById(h)).trigger("click");
            return false;
        });
        $(".next").click(function(i){
            var h = this.href;
            h = h.split("#")[1];
            eXeAssistant.displayTab(h);
            return false;
        });
    },
    displayTab : function(id,e) {
        $(".tab").hide();
        $("#"+id).show();
        $("#tabs a").attr("class","");
        if (!e) var e = $("#tabs a").eq(parseInt(id.replace("tab","")))[0];
        e.className = "current";
    }
}
$(function(){
   eXeAssistant.init(); 
});