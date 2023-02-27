/**
 * Example iDevice
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Ignacio Gros (http://gros.es/) for http://exelearning.net/
 *
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 *
 * eXeLearning KIDS logo (export/example-idevice-logo.png) by Francisco Javier Pulido Cuadrado, under CC BY-SA too.
 */
var $myExampleIdevice = {
	
	// Anything included in the export folder will be exported if the iDevice is used.
	// Vanilla JS or jQuery. Do whatever you need.
    
	init : function(){
        
		$(".myExampleIdevice").each(function(){
			
			// Find the activity wrapper's ID
			var div = $(".iDevice_content",this);
			if (div.length!=1) return;
			var id = div.attr("id");
			
			// Make the buttons do something
			var btns = $(".exe-custom-btns button",this);
			if (btns.length!=2) return;
			
			btns.eq(0).on("click",function(){
				alert("This is just an example.");
			});
			
			btns.eq(1).on("click",function(){
				$myExampleIdevice.toggleFullscreen(document.getElementById(id));
			});
			
        });
		
	},
	
	exitFullscreen: function () {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		}
	},
	
	getFullscreen: function (element) {
		if (element.requestFullscreen) {
			element.requestFullscreen();
		} else if (element.mozRequestFullScreen) {
			element.mozRequestFullScreen();
		} else if (element.webkitRequestFullscreen) {
			element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
		} else if (element.msRequestFullscreen) {
			element.msRequestFullscreen();
		}
	},
	
	toggleFullscreen: function (element) {
		var element = element || document.documentElement;
		if (!document.fullscreenElement && !document.mozFullScreenElement &&
			!document.webkitFullscreenElement && !document.msFullscreenElement) {
			$myExampleIdevice.getFullscreen(element);
		} else {
			$myExampleIdevice.exitFullscreen(element);
		}
	}	
    
}

$(function(){
	
	$myExampleIdevice.init();
	
});