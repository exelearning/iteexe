var $exeAuthoring = {
    ready : function(){
        $exeAuthoring.disableAnchors();
    },
    disableAnchors : function(){
        var as = document.getElementsByTagName("A");
        var i = as.length;
        while (i--) {
            if (as[i].href) {
                if (as[i].href.indexOf("exe-node:")==0) {
                    as[i].onclick = function(){
                        return false;
                    }
                }
            }
        }    
    }
}