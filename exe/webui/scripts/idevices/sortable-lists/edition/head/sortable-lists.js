var $exeDevice = {
    i18n : {
        es : {
            "Intructions:" : "Instrucciones:",
            "Write the elements in the right order:" : "Añade los elementos de la lista (ordenados):",
            "Please write the instructions." : "Debes escribir las instrucciones.",
            "Add at least 3 elements." : "Añade al menos 3 elementos."
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
			#sortableListFormInstructions{width:600px}\
			#sortableListValuesContainer{display:none}\
		</style>\
		';
		$("HEAD").append(style)
		var html = '\
			<div id="sortableListForm">\
				<p><label for="sortableListFormInstructions">'+_i("Intructions:")+' </label><input type="text" name="sortableListFormInstructions" id="sortableListFormInstructions" /></p>\
				'+this.getListsFields()+'\
			</div>\
		';
		field.hide().before(html);
		this.setSavingOptions();
		this.loadPreviousValues(field);
	},
	loadPreviousValues : function(field){
		field.after('<div id="sortableListValuesContainer">'+field.val()+'</div>');
		var container = $("#sortableListValuesContainer");
		var instructions = $("P",container).eq(0).html();
		$("#sortableListFormInstructions").val(instructions);
		$("LI",container).each(function(i){
			$("#sortableListFormList"+i).val(this.innerHTML);
		});
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
	setSavingOptions : function(){
		var myLink = $("IMG.submit").eq(0).parent();
		var onclick = myLink.attr("onclick");
		myLink[0].onclick = function(){
			var html = "";
			var instructions = $("#sortableListFormInstructions").val();
			if (instructions=="") {
				eXe.app.alert(_i("Please write the instructions."));
				return false;
			}
			html += '<p>'+instructions+'</p>';
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
			html += '<ul class="exe-sortableList">';
			html += options;
			html += '</ul>';
            $("textarea.mceEditor").val(html);
            eval(onclick);
		}
		
	}
}
$(function(){
    if ($exeAuthoring.isEditing("SortableLists")) $exeDevice.init();
});