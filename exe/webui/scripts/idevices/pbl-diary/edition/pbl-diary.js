/**
 * Learning Diary - Just a simple Text iDevice (edition code)
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Ignacio Gros (http://gros.es/) for http://exelearning.net/
 *
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $exeDevice = {
	
	init : function(){
		
		// Add some instructions
		$("TEXTAREA").before("<p>"+_("The Learning Diary is focused on the student's reflection and reasoning to construct their own learning.")+"</p>");
		
		// Enable TinyMCE
		if (tinymce.majorVersion==4) $exeTinyMCE.init("single",".jsContentEditor");
		else if (tinymce.majorVersion==3) $exeTinyMCE.init("specific_textareas","jsContentEditor");
		
	},
	
	save : function(){
		
		// Just return true
		// authoring.js will save the content
		// See $exeAuthoring.iDevice.init
		return true;
		
	}

}