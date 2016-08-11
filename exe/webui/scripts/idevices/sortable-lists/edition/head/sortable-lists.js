/**
 * Sortable Lists iDevice (edition code)
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Ignacio Gros (http://gros.es/) for http://exelearning.net/
 *
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $exeDevice = {
	
	// iDevice className (unique)
	cssClass : "SortableLists",
	
	// i18n
	i18n : {
		
		// Spanish
		es : {
			"Intructions:" : "Instrucciones:",
			"Write the elements in the right order:" : "Añade los elementos de la lista (ordenados):",
			"Please write the instructions." : "Debes escribir las instrucciones.",
			"Add at least 3 elements." : "Añade al menos 3 elementos.",
			"Button text:" : "Texto del botón:",
			"Text to show if right answered:" : "Texto a mostrar si contesta correctamente:",
			"Text to show if wrongly answered:" : "Texto a mostrar si no responde correctamente:",
			"Check" : "Comprobar",
			"Please write the button text." : "Debes escribir el texto del botón.",
			"Please write the text to show when right." : "Debes escribir el texto a mostrar si se contesta correctamente.",
			"Please write the text to show when wrong." : "Debes escribir el texto a mostrar si no responde correctamente.",
			"The right answer will be shown after this text." : "La respuesta correcta se mostrará después de este texto.",
			"Right!" : "¡Correcto!",
			"Sorry... The right answer is:" : "No es correcto... Respuesta correcta:"
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
			<div id="sortableListForm">\
				<p><label for="sortableListFormInstructions">'+_i("Intructions:")+' </label><input type="text" class="sortableListTextOption" name="sortableListFormInstructions" id="sortableListFormInstructions" /></p>\
				'+this.getListsFields()+'\
				<p><label for="sortableListButtonText">'+_i("Button text:")+' </label><input type="text" class="sortableListTextOption" name="sortableListButtonText" id="sortableListButtonText" /></p>\
				<p><label for="sortableListRightText">'+_i("Text to show if right answered:")+' </label><input type="text" class="sortableListTextOption" name="sortableListRightText" id="sortableListRightText" /></p>\
				<p>\
                <label for="sortableListWrongText">'+_i("Text to show if wrongly answered:")+' </label><input type="text" class="sortableListTextOption" name="sortableListWrongText" id="sortableListWrongText" />\
                <span id="sortableListWrongTextTip">'+_i("The right answer will be shown after this text.")+'</span>\
                </p>\
			</div>\
		';
		
		var field = $("textarea.mceEditor").eq(0);
		field.hide().before(html);
		this.loadPreviousValues(field);
		
	},
	
	// Load the saved values in the form fields
	loadPreviousValues : function(field){
		
		var originalHTML = field.val();
		if (originalHTML == '') return;
		
		field.after('<div id="sortableListValuesContainer">'+originalHTML+'</div>');
		var container = $("#sortableListValuesContainer");
		var paragraphs = $("P",container);
		
		// Default values
		var instructions = "";
		var buttonText = _i("Check");
		var rightText = _i("Right!");
		var wrongText = _i("Sorry... The right answer is:");
		
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
		$("#sortableListButtonText").val(buttonText);
		$("#sortableListRightText").val(rightText);
		$("#sortableListWrongText").val(wrongText);
		
	},
	
	// Fields for the elements to order (up to 9)
	getListsFields : function(){
		
		var html = '<div id="sortableListFormList">';
		html += '<p><strong>'+_i("Write the elements in the right order:")+'</strong></p>';
		html += '<ol>';
		for (var i=0;i<9;i++) {
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
				eXe.app.alert(_i("Please write the instructions."));
				return false;
			}
			html += '<p class="exe-sortableList-instructions">'+$exeDevice.removeTags(instructions)+'</p>';
			
			// Get the elements to sort (at least 3)
			var options = "";
			var counter = 0;
			var currentFieldValue = "";
			for (var i=0;i<9;i++) {
				currentFieldValue = $("#sortableListFormList"+i).val();
				if (currentFieldValue!="") {
					options += '<li>'+currentFieldValue+'</li>';
					counter ++;
				}
			}
			if (counter<3) {
				eXe.app.alert(_i("Add at least 3 elements."));
				return false;
			}
			html += '<ul class="exe-sortableList-list">';
				html += options;
			html += '</ul>';
			
			html += '<div style="display:none">';
			
				// Button text
				var buttonText = $("#sortableListButtonText").val();
				if (buttonText=="") {
					eXe.app.alert(_i("Please write the button text."));
					return false;
				}					
				html += '<p class="exe-sortableList-buttonText">'+$exeDevice.removeTags(buttonText)+'</p>';
				
				// Text when right
				var rightText = $("#sortableListRightText").val();
				if (rightText=="") {
					eXe.app.alert(_i("Please write the text to show when right."));
					return false;
				}					
				html += '<p class="exe-sortableList-rightText">'+$exeDevice.removeTags(rightText)+'</p>';

				// Text when wrong
				var wrongText = $("#sortableListWrongText").val();
				if (wrongText=="") {
					eXe.app.alert(_i("Please write the text to show when wrong."));
					return false;
				}					
				html += '<p class="exe-sortableList-wrongText">'+$exeDevice.removeTags(wrongText)+'</p>';					
			
			html += '</div>';
		
		html += '</div>';
		
		// Return the HTML to save
		return html;
		
	}

}

// Init the editor
$exeAuthoring.iDevice.init("SortableLists");
$(function() {
	if ($exeAuthoring.isEditing("SortableLists")) {
		$exeDevice.init();
	}
});