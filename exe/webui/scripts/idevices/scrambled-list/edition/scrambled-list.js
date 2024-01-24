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
	name: _('Scrambled List'),

	// Max number of items
	items_no: 15,

	ideviceID: false,

	init: function () {
		this.createForm();
	},
	iDevicePath: "/scripts/idevices/scrambled-list/edition/",
	// Create the form to insert HTML in the TEXTAREA
	createForm: function () {

		var html = '\
			<div id="sortableListForm">\
				<p class="exe-text-field">\
					<label for="sortableListFormInstructions">' + _("Instructions") + ': </label>\
					<textarea id="sortableListFormInstructions" class="exe-html-editor"\></textarea>\
				</p>\
				' + this.getListsFields() + '\
				<p class="exe-text-field">\
					<label for="sortableListButtonText">' + _("Button text") + ': </label>\
					<input type="text" class="sortableListTextOption" name="sortableListButtonText" id="sortableListButtonText" onfocus="this.select()" />\
				</p>\
				<p class="exe-text-field">\
					<label for="sortableListRightText">' + _("Correct Answer Feedback Overlay") + ': </label>\
					<input type="text" class="sortableListTextOption" name="sortableListRightText" id="sortableListRightText" onfocus="this.select()" />\
				</p>\
				<p class="exe-text-field">\
					<label for="sortableListWrongText">' + _("Wrong Answer Feedback Overlay") + ': </label><input type="text" class="sortableListTextOption" name="sortableListWrongText" id="sortableListWrongText" onfocus="this.select()" />\
					<span class="exe-field-instructions">' + _("The right answer will be shown after this text.") + '</span>\
                </p>\
				<p>\
                	<strong><a href="#sortableListEvaluationHelp" id="sortableListEvaluationHelpLnk" title="' + _("Help") + '"><img src="' + $exeDevice.iDevicePath + 'quextIEHelp.gif"  width="16" height="16" alt="' + _("Help") + '"/></a></strong>\
					<label for="sortableListEvaluation"><input type="checkbox" id="sortableListEvaluation"> ' + _("Progress report") + '. </label> \
					<label for="sortableListEvaluationID">' + _("Identifier") + ':\
					<input type="text" id="sortableListEvaluationID" disabled style="width:200px"/> </label>\
                </p>\
				<div id="sortableListEvaluationHelp" style="display:none">\
                    <p>' +_("You must indicate the identifier. It can be a word, a phrase or a number of more than four characters, which you will use to mark the activities that will be taken into account in this progress report. It must be the same in all iDevices of a report and different in those of each report.") + '</p>\
                </div>\
                ' + $exeAuthoring.iDevice.common.getTextFieldset("after") + '\
			</div>\
		';

		var field = $("textarea.jsContentEditor").eq(0);
		field.before(html);
		this.loadPreviousValues(field);

	},

	generarID: function () {
		var fecha = new Date(),
			a = fecha.getUTCFullYear(),
			m = fecha.getUTCMonth() + 1,
			d = fecha.getUTCDate(),
			h = fecha.getUTCHours(),
			min = fecha.getUTCMinutes(),
			s = fecha.getUTCSeconds(),
			o = fecha.getTimezoneOffset();

		var IDE = `${a}${m}${d}${h}${min}${s}${o}`;
		return IDE;
	},

	// Load the saved values in the form fields
	loadPreviousValues: function (field) {

		// Default values
		var instructions = "";
		var buttonText = c_("Check");
		buttonText = buttonText[1];
		var rightText = c_("Right!");
		rightText = rightText[1];
		var wrongText = c_("Sorry... The right answer is:");
		wrongText = wrongText[1];
		var evaluationID = "";
		var ideviceID = false;



		var originalHTML = field.val();
		if (originalHTML != '') {

			field.after('<div id="sortableListValuesContainer">' + originalHTML + '</div>');
			var container = $("#sortableListValuesContainer");

			// Instructions
			var instructions = $(".exe-sortableList-instructions", container);
			if (instructions.length == 1) {
				instructions = instructions.html();
				$("#sortableListFormInstructions").val(instructions);
			}

			// Button text
			var buttonTextContainer = $(".exe-sortableList-buttonText", container);
			if (buttonTextContainer.length == 1 && buttonTextContainer.text() != "") buttonText = buttonTextContainer.text();

			// Right text
			var rightTextContainer = $(".exe-sortableList-rightText", container);
			if (rightTextContainer.length == 1 && rightTextContainer.text() != "") {
				rightText = rightTextContainer.text();
			}

			// Wrong text
			var wrongTextContainer = $(".exe-sortableList-wrongText", container);
			if (wrongTextContainer.length == 1 && wrongTextContainer.text() != "") {
				wrongText = wrongTextContainer.text();
			}

			// List
			$(".exe-sortableList-list li", container).each(function (i) {
				$("#sortableListFormList" + i).val(this.innerHTML);
			});

			// Text after
			var textAfter = $(".exe-sortableList-textAfter", container);
			if (textAfter.length == 1) {
				textAfter = textAfter.html();
				$("#eXeIdeviceTextAfter").val(textAfter);
			}

			
			var evaluationIDContainer = $(".exe-sortableList-evaluationID", container);
			if (evaluationIDContainer.length == 1 && evaluationIDContainer.text() != "") evaluationID = evaluationIDContainer.text();

			var ideviceIDContainer = $(".exe-sortableList-ideviceID", container);
			if (ideviceIDContainer.length == 1 && ideviceIDContainer.text() != "") ideviceID= ideviceIDContainer.text();

		}

		// These fields will have a default value (maybe not in the right language, but...)
		$("#sortableListButtonText").val(buttonText);
		$("#sortableListRightText").val(rightText);
		$("#sortableListWrongText").val(wrongText);


		$('#sortableListEvaluation').prop('checked', evaluationID.length > 4);
		$('#sortableListEvaluationID').val(evaluationID);
		$("#sortableListEvaluationID").prop('disabled', (evaluationID.length < 5));

		$exeDevice.ideviceID = ideviceID;

		$('#sortableListEvaluation').on('change', function () {
			var marcado = $(this).is(':checked');
			$('#sortableListEvaluationID').prop('disabled', !marcado);
		});
		$("#sortableListEvaluationHelpLnk").click(function () {
			$("#sortableListEvaluationHelp").toggle();
			return false;

		});


	},

	// Fields for the elements to order (up to $exeDevice.items_no)
	getListsFields: function () {

		var html = '<div id="sortableListFormList">';
		html += '<p><strong>' + _("Write the elements in the right order:") + '</strong></p>';
		html += '<ol>';
		for (var i = 0; i < $exeDevice.items_no; i++) {
			html += '<li><label for="sortableListFormList' + i + '" class="sr-av">' + i + '</label><input type="text" name="sortableListFormList' + i + '" id="sortableListFormList' + i + '" /></p>'
		}
		html += '</ol>';
		html += '</div>';
		return html;

	},

	// Function to remove HTML tags
	removeTags: function (str) {
		var wrapper = $("<div></div>");
		wrapper.html(str);
		return wrapper.text();
	},

	// This function is called by eXe
	// It returns the HTML to save
	// Return false if you find any error (missing information...)
	save: function () {

		var html = '<div class="exe-sortableList">';

		// Get the instructions
		var instructions = tinymce.editors[0].getContent();
		if (instructions == "") {
			eXe.app.alert(_("Please write some instructions."));
			return false;
		}
		html += '<div class="exe-sortableList-instructions">' + instructions + '</div>';

		// Get the elements to sort (at least 3)
		var options = "";
		var counter = 0;
		var currentFieldValue = "";
		for (var i = 0; i < $exeDevice.items_no; i++) {
			currentFieldValue = $("#sortableListFormList" + i).val();
			if (currentFieldValue != "") {
				options += '<li>' + currentFieldValue + '</li>';
				counter++;
			}
		}
		if (counter < 3) {
			eXe.app.alert(_("Add at least 3 elements."));
			return false;
		}
		var evaluation = $('#sortableListEvaluation').is(':checked'),
			evaluationID = evaluation ? $('#sortableListEvaluationID').val() : '',
			ideviceID = $exeDevice.ideviceID ? $exeDevice.ideviceID : $exeDevice.generarID(),
			msgUncompletedActivity = c_("Not done activity"),
			msgUnsuccessfulActivity = c_("Activity: Not passed. Score: %S"),
			msgSuccessfulActivity = c_("Activity: Passed. Score: %S"),
			msgTypeIDevice = c_("Scrambled List");
		
		msgUncompletedActivity = msgUncompletedActivity[1];
		msgSuccessfulActivity = msgSuccessfulActivity[1];
		msgUnsuccessfulActivity = msgUnsuccessfulActivity[1];
		msgTypeIDevice = msgTypeIDevice[1];

		var evaluationMessages = msgUncompletedActivity + '#' + msgSuccessfulActivity + '#' + msgUnsuccessfulActivity + '#' + msgTypeIDevice;

		if (evaluation && evaluationID.length < 5) {
			eXe.app.alert(('El identificador del informe debe tener al menos cinco caracteres'));
			return false;
		}
		html += '<ul class="exe-sortableList-list">';
		html += options;
		html += '</ul>';

		html += '<div style="display:none">';

		// Button text
		var buttonText = $("#sortableListButtonText").val();
		if (buttonText == "") {
			eXe.app.alert(_("Please write the button text."));
			return false;
		}
		html += '<p class="exe-sortableList-buttonText">' + $exeDevice.removeTags(buttonText) + '</p>';

		// Text when right
		var rightText = $("#sortableListRightText").val();
		if (rightText == "") {
			eXe.app.alert(_("Please write the text to show when right."));
			return false;
		}
		html += '<p class="exe-sortableList-rightText">' + $exeDevice.removeTags(rightText) + '</p>';

		html += '<div class="exe-sortableList-ideviceID js-hidden">' + ideviceID + '</div>'
		html += '<div class="exe-sortableList-evaluationID js-hidden">' + evaluationID + '</div>';
		html += '<div class="exe-sortableList-evaluationMessages js-hidden">' + evaluationMessages + '</div>'

		// Text when wrong
		var wrongText = $("#sortableListWrongText").val();
		if (wrongText == "") {
			eXe.app.alert(_("Please write the text to show when wrong."));
			return false;
		}
		html += '<p class="exe-sortableList-wrongText">' + $exeDevice.removeTags(wrongText) + '</p>';

		html += '</div>';

		// Get the optional text
		var textAfter = tinymce.editors[1].getContent();
		if (textAfter != "") {
			html += '<div class="exe-sortableList-textAfter">' + textAfter + '</div>';
		}

		html += '</div>';

		// Return the HTML to save
		return html;

	}

}