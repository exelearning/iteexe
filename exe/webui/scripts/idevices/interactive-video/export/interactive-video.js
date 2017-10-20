/**
 * Interactive Video iDevice
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Ignacio Gros (http://gros.es/) for http://exelearning.net/
 *
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $exeInteractiveVideoIdevice = {
    
	init : function(){
        
		var es = $(".exe-interactive-video");
		
		if (es.length==0) return;
		
		if (es.length>1) {
			alert("Error (sólo puede haber un vídeo interactivo por página)");
			return false;
		}
		
		alert("Go!");
		
	}
    
}

$(function(){
	
	$exeInteractiveVideoIdevice.init();
	
});