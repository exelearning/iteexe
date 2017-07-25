/**
 * Information - Just a simple Text iDevice (edition code)
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Ignacio Gros (http://gros.es/) for http://exelearning.net/
 *
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $exeDevice = {
	
	init : function(){
		
		// Add some instructions
		$("TEXTAREA").before("<p>"+_('Provide information of the project or this part of the project.')+"</p>");
		
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