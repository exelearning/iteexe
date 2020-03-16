/**
 * Scrambled List iDevice (edition code)
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Ignacio Gros (http://gros.es/) for http://exelearning.net/
 *
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $exeDevice = {
	
	// i18n
	// We use eXe's _ function
	name : _('Scrambled List'),

	// Max number of items
	items_no : 15,
	
	init : function(){
		 this.createForm();
	},
	
	// Create the form to insert HTML in the TEXTAREA
	createForm : function(){
		
		var html = '\
			<div id="sortableListForm">\
				<p class="exe-text-field">\
					<label for="sortableListFormInstructions">'+_("Instructions")+': </label>\
					<input type="text" class="sortableListTextOption" name="sortableListFormInstructions" id="sortableListFormInstructions" />\
				</p>\
				'+this.getListsFields()+'\
				<p class="exe-text-field">\
					<label for="sortableListButtonText">'+_("Button text")+': </label>\
					<input type="text" class="sortableListTextOption" name="sortableListButtonText" id="sortableListButtonText" onfocus="this.select()" />\
				</p>\
				<p class="exe-text-field">\
					<label for="sortableListRightText">'+_("Correct Answer Feedback Overlay")+': </label>\
					<input type="text" class="sortableListTextOption" name="sortableListRightText" id="sortableListRightText" onfocus="this.select()" />\
				</p>\
				<p class="exe-text-field">\
					<label for="sortableListWrongText">'+_("Wrong Answer Feedback Overlay")+': </label><input type="text" class="sortableListTextOption" name="sortableListWrongText" id="sortableListWrongText" onfocus="this.select()" />\
					<span class="exe-field-instructions">'+_("The right answer will be shown after this text.")+'</span>\
                </p>\
			</div>\
		';
		
		var field = $("textarea.jsContentEditor").eq(0);
		field.before(html);
		this.loadPreviousValues(field);
		
	},
	
	// Load the saved values in the form fields
	loadPreviousValues : function(field){
		
		// Default values
		var instructions = "";
		var buttonText = c_("Check");
			buttonText = buttonText[1];
		var rightText = c_("Right!");
			rightText = rightText[1];
		var wrongText = c_("Sorry... The right answer is:");		
			wrongText = wrongText[1];
		
		var originalHTML = field.val();
		if (originalHTML != '') {
		
			field.after('<div id="sortableListValuesContainer">'+originalHTML+'</div>');
			var container = $("#sortableListValuesContainer");
			var paragraphs = $("P",container);
			
			// Save values
			if (paragraphs.length==4) {
				instructions = paragraphs.eq(0).text();
				buttonText = paragraphs.eq(1).text();
				rightText = paragraphs.eq(2).text();
				wrongText = paragraphs.eq(3).text();
			}
			
			// Load the values
			$("#sortableListFormInstructions").val(instructions);
			$("LI",container).each(function(i){
				$("#sortableListFormList"+i).val(this.innerHTML);
			});
			
		}
		
		// These fields will have a default value (maybe not in the right language, but...)
		$("#sortableListButtonText").val(buttonText);
		$("#sortableListRightText").val(rightText);
		$("#sortableListWrongText").val(wrongText);
		
	},
	
	// Fields for the elements to order (up to $exeDevice.items_no)
	getListsFields : function(){
		
		var html = '<div id="sortableListFormList">';
		html += '<p><strong>'+_("Write the elements in the right order:")+'</strong></p>';
		html += '<ol>';
		for (var i=0;i<$exeDevice.items_no;i++) {
			html += '<li><label for="sortableListFormList'+i+'" class="sr-av">'+i+'</label><input type="text" name="sortableListFormList'+i+'" id="sortableListFormList'+i+'" /></p>'
		}
		html += '</ol>';
		html += '</div>';
		return html;
		
	},
	
	// Function to remove HTML tags
	removeTags : function(str) {
		var wrapper = $("<div></div>");
		wrapper.html(str);
		return wrapper.text();
	},
	
	// This function is called by eXe
	// It returns the HTML to save
	// Return false if you find any error (missing information...)
	save : function(){
		
		var html = '<div class="exe-sortableList">';
		
			// Get the instructions
			var instructions = $("#sortableListFormInstructions").val();
			if (instructions=="") {
				eXe.app.alert(_("Please write some instructions."));
				return false;
			}
			html += '<p class="exe-sortableList-instructions">'+$exeDevice.removeTags(instructions)+'</p>';
			
			// Get the elements to sort (at least 3)
			var options = "";
			var counter = 0;
			var currentFieldValue = "";
			for (var i=0;i<$exeDevice.items_no;i++) {
				currentFieldValue = $("#sortableListFormList"+i).val();
				if (currentFieldValue!="") {
					options += '<li>'+currentFieldValue+'</li>';
					counter ++;
				}
			}
			if (counter<3) {
				eXe.app.alert(_("Add at least 3 elements."));
				return false;
			}
			html += '<ul class="exe-sortableList-list">';
				html += options;
			html += '</ul>';
			
			html += '<div style="display:none">';
			
				// Button text
				var buttonText = $("#sortableListButtonText").val();
				if (buttonText=="") {
					eXe.app.alert(_("Please write the button text."));
					return false;
				}					
				html += '<p class="exe-sortableList-buttonText">'+$exeDevice.removeTags(buttonText)+'</p>';
				
				// Text when right
				var rightText = $("#sortableListRightText").val();
				if (rightText=="") {
					eXe.app.alert(_("Please write the text to show when right."));
					return false;
				}					
				html += '<p class="exe-sortableList-rightText">'+$exeDevice.removeTags(rightText)+'</p>';

				// Text when wrong
				var wrongText = $("#sortableListWrongText").val();
				if (wrongText=="") {
					eXe.app.alert(_("Please write the text to show when wrong."));
					return false;
				}					
				html += '<p class="exe-sortableList-wrongText">'+$exeDevice.removeTags(wrongText)+'</p>';					
			
			html += '</div>';
		
		html += '</div>';
		
		// Return the HTML to save
		return html;
		
	}

}