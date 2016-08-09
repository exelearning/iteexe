var $exeDevice = {
	i18n : {
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
			"Right!" : "¡Correcto!",
			"Sorry... The right answer is:" : "No es correcto... Respuesta correcta:"
		}
	},
	init : function(){
		/* *************************
		***** PROVISIONAL CODE *****
		************************* */
		// this.createForm();
		window.onload = function(){
			tinymce.activeEditor.remove();
			$exeDevice.createForm();
		}
		/* *************************
		***** PROVISIONAL CODE *****
		************************* */
	},
	createForm : function(){
		var field = $("textarea.mceEditor").eq(0);
		var style = '\
		<style type="text/css">\
			#sortableListForm label{display:block;font-weight:bold;margin-bottom:.2em}\
			#sortableListForm input[type=text]{width:430px}\
			#sortableListForm input.sortableListTextOption{width:500px}\
			#sortableListValuesContainer{display:none}\
		</style>\
		';
		$("HEAD").append(style)
		var html = '\
			<div id="sortableListForm">\
				<p><label for="sortableListFormInstructions">'+_i("Intructions:")+' </label><input type="text" class="sortableListTextOption" name="sortableListFormInstructions" id="sortableListFormInstructions" /></p>\
				'+this.getListsFields()+'\
				<p><label for="sortableListButtonText">'+_i("Button text:")+' </label><input type="text" class="sortableListTextOption" name="sortableListButtonText" id="sortableListButtonText" /></p>\
				<p><label for="sortableListRightText">'+_i("Text to show if right answered:")+' </label><input type="text" class="sortableListTextOption" name="sortableListRightText" id="sortableListRightText" /></p>\
				<p><label for="sortableListWrongText">'+_i("Text to show if wrongly answered:")+' </label><input type="text" class="sortableListTextOption" name="sortableListWrongText" id="sortableListWrongText" /></p>\
			</div>\
		';
		field.hide().before(html);
		this.setSavingOptions();
		this.loadPreviousValues(field);
	},
	loadPreviousValues : function(field){
		field.after('<div id="sortableListValuesContainer">'+field.val()+'</div>');
		var container = $("#sortableListValuesContainer");
		var paragraphs = $("P",container);
		var instructions = "";
		var buttonText = _i("Check");
		var rightText = _i("Right!");
		var wrongText = _i("Sorry... The right answer is:");
		if (paragraphs.length>0) {
			instructions = paragraphs.eq(0).text();
			buttonText = paragraphs.eq(1).text();
			rightText = paragraphs.eq(2).text();
			wrongText = paragraphs.eq(3).text();
		}
		$("#sortableListFormInstructions").val(instructions);
		$("LI",container).each(function(i){
			$("#sortableListFormList"+i).val(this.innerHTML);
		});
		$("#sortableListButtonText").val(buttonText);
		$("#sortableListRightText").val(rightText);
		$("#sortableListWrongText").val(wrongText);
	},
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
	removeTags : function(str) {
		var wrapper = $("<div></div>");
		wrapper.html(str);
		return wrapper.text();
	},
	setSavingOptions : function(){
		var myLink = $("IMG.submit").eq(0).parent();
		var onclick = myLink.attr("onclick");
		myLink[0].onclick = function(){
			
			var html = '<div class="exe-sortableList">';
			
				// Get the instructions
				var instructions = $("#sortableListFormInstructions").val();
				if (instructions=="") {
					eXe.app.alert(_i("Please write the instructions."));
					return false;
				}
				html += '<p class="exe-sortableList-instructions">'+$exeDevice.removeTags(instructions)+'</p>';
				
				// Get the elements to sort
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
			
			$("textarea.mceEditor").val(html);
			eval(onclick);
		}
		
	}
}
$(function(){
	if ($exeAuthoring.isEditing("SortableLists")) $exeDevice.init();
});