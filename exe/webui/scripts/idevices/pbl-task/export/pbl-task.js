/**
 * Project Based Learning Task iDevice
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Ignacio Gros (http://gros.es/) for http://exelearning.net/
 *
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $exePBLtask = {
    
	init : function(){
		
		$(".pbl-taskIdevice").each(function(i){
			
			// Fade in each DL
			$(".pbl-task-info").delay(1500).css({
				"opacity" : 0,
				"visibility" : "visible"
			}).fadeTo("slow",1).each(function(){
				var dts = $("dt",this);
				// Set the DT width so the text can be right aligned
				if ($(this).css("text-align")=="right") {
					var width = 0;
					dts.css("width","auto").each(function(){
						var w = $(this).width();
						if (w>width) width = w;
					});
					if (width!=0) {
						dts.css("width",width+"px");
						$("dd",this).css("margin-left",width+"px");
					}
				}
				// Add a title (just in case the Style displays an icon instead of the text)
				dts.each(function(){
					$("span",this).attr("title",$(this).text());
				});
			});
			
			// Feedback toggler
			$(".feedbackbutton",this).each(function(){				
				var buttonTxt = this.value.split("|");
				// The button might have 2 texts (Show|Hide)
				if (buttonTxt.length==2) {
					this.value = buttonTxt[0];
					window['$exePBLtaskButtonText'+i] = buttonTxt;
				}
				$(this).click(function(){
					var feedback = $(this).parent().next('.feedback');
					if (feedback.is(":visible")) {
						if (typeof(window['$exePBLtaskButtonText'+i])!='undefined') this.value = window['$exePBLtaskButtonText'+i][0];
						feedback.slideUp();
					} else {
						if (typeof(window['$exePBLtaskButtonText'+i])!='undefined') this.value = window['$exePBLtaskButtonText'+i][1];
						feedback.slideDown();
					}
					return false;					
				});
			});
			
		});
		
	}
    
}

$(function(){
	$exePBLtask.init();
});