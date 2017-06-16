/**
 * Example iDevice
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Ignacio Gros (http://gros.es/) for http://exelearning.net/
 *
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 *
 * eXeLearning KIDS logo (export/example-idevice.png) by Francisco Javier Pulido Cuadrado, under CC BY-SA too.
 */
var $exeExampleIdevice = {
    
	init : function(){
        
		$(".exe-exampleIdevice").each(function(instance){
			
			/*
			
			The definition list (DL) will be replaced by this HTML:
			
				<p>
					<input type="button" class="feedbackbutton" value="Button text" onclick="jQuery('#feedbackID').toggle()" />
				</p>
				
				<div class="feedback" id="feedbackID" style="display:none">
					<p>Your name</p>
				</div>
			
			*/			
			
			var dl = $("dl",this); // Definition list
			var dt = $("dt",dl).text(); // Button text
			var dd = $("dd",dl).text(); // Your name
			
			var html = '<p><input type="button" class="feedbackbutton" value="'+dt+'" onclick="jQuery(\'#exe-exampleIdevice-feedback-'+instance+'\').toggle()" /></p>';
				html += '<div class="feedback" id="exe-exampleIdevice-feedback-'+instance+'" style="display:none"><p>'+dd+'</p></div>';
			
			dl.before(html).remove();
			
        });
		
	}
    
}

$(function(){
	
	$exeExampleIdevice.init();
	
});