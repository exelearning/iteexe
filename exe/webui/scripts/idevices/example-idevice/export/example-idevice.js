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
			$(this).append("<p style='color:blue'><strong>example-idevice.js</strong> (instance "+instance+")</p>");
        });
	}
    
}

$(function(){
	$exeExampleIdevice.init();
});