/**
 * Rubrics iDevice
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Ignacio Gros (http://gros.es/) for http://exelearning.net/
 *
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $exeExampleIdevice = {
    
	init : function(){
        
		$(".exe-rubric").each(function(instance){
			
			alert(this.innerHTML);
			
        });
		
	}
    
}

$(function(){
	
	$exeExampleIdevice.init();
	
});