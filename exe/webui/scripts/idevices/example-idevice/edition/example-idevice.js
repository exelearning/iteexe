/**
 * Example iDevice (edition code)
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Ignacio Gros (http://gros.es/) for http://exelearning.net/
 *
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $exeDevice = {
	
	// i18n
	i18n : {
		
		// Spanish
		es : {
			"Write something:" : "Escribe algo:",
			"You should write something." : "Debes escribir algo."
		}
		
	},
	
	init : function(){
		
		// this.createForm();
		/* *************************
		***** PROVISIONAL CODE *****
		************************* */
		window.onload = function(){
			tinymce.activeEditor.remove();
			$exeDevice.createForm();
		}
		/* *************************
		***** PROVISIONAL CODE *****
		************************* */
		
	},
	
	// Create the form to insert HTML in the TEXTAREA
	createForm : function(){
		
		var html = '\
			<div id="exampleIdeviceForm">\
				<p><label for="fieldA">'+_("Write something:")+' </label><input type="text" name="fieldA" id="fieldA" /></p>\
			</div>\
		';
		
		var field = $("textarea.mceEditor").eq(0);
		field.hide().before(html);
		this.loadPreviousValues(field);
		
	},
	
	// Load the saved values in the form fields
	loadPreviousValues : function(field){

		var originalHTML = field.val();
		if (originalHTML != '') {
			// Remove HTML tags
			var wrapper = $("<div></div>");
			wrapper.html(originalHTML);
			$("#fieldA").val(wrapper.text());
		}		
		
	},
	
	save : function(){
		
		var html = '<div class="exe-exampleIdevice">';
		
			// Get the content
			var content = $("#fieldA").val();
			if (content=="") {
				eXe.app.alert(_("You should write something."));
				return false;
			}
			
			// Remove HTML tags
			var wrapper = $("<div></div>");
			wrapper.html(content);
			content = wrapper.text();
			
			html += '<p>'+content+'</p>';
		
		html += '</div>';
		
		// Return the HTML to save
		return html;
		
	}

}