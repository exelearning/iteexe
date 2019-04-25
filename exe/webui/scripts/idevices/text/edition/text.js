/**
 * Text (with optional feedback) iDevice (edition code)
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Ignacio Gros (http://gros.es/) for http://exelearning.net/
 *
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $exeDevice = {
	
	// We use eXe's _ function
	i18n : {
		name : _('Text')
	},
	
	init : function(){
		// Create the form
		var html = "\
			<div class='exe-textarea-field'>\
				<label for='textIdeviceContent'>"+_('Text')+":</label>\
				<textarea id='textIdeviceContent' class='exe-html-editor'\></textarea>\
			</div>\
			<fieldset id='textIdeviceFeedback' class='exe-fieldset exe-feedback-fieldset closed-fieldset'>\
				<legend><a href='#textIdeviceFeedbackButtonText' id='textIdeviceFeedbackToggler'>"+_('Feedback')+" ("+_('Optional').toLowerCase()+")</a></legend>\
				<div>\
                    <p class='exe-inline-text-field'>\
                        <label for='textIdeviceFeedbackButtonText'>"+_("Feedback button text")+":</label>\
                        <input type='text' id='textIdeviceFeedbackButtonText' value='"+_("Show Feedback")+"' />\
                    </p>\
                    <p>\
						<label for='textIdeviceFeedbackContent' class='sr-av'>"+_('Feedback')+":</label>\
						<textarea id='textIdeviceFeedbackContent' class='exe-html-editor'\></textarea>\
					</p>\
                </div>\
			</fieldset>\
			";
		
		// Insert the form
        this.textArea = $("#activeIdevice textarea");
        this.textArea.before(html);
        
        // Fieldset toggler
        $("#textIdeviceFeedbackToggler").click(function(){
            $("#textIdeviceFeedback").toggleClass("closed-fieldset");
            return false;
        });
		
		this.getPreviousValues();
        
		// Focus on the title right after adding the iDevice
        var titleField = $("#activeIdevice input[type='text']").eq(0);
        if (titleField.val()==_('Text')) titleField.val("").focus();        
		
	},
	
	getPreviousValues : function(){
		
		var content = this.textArea.val();
		var wrapper = $('<div />');
		wrapper.html(content);
		
		// Text
        var desc = $(".exe-text",wrapper);
		if (desc.length==1) {
			$("#textIdeviceContent").val(desc.html());
		}
		
		// Feedback button
		var feedbackButton = $(".feedbackbutton",wrapper);
		if (feedbackButton.length==1) {
			$("#textIdeviceFeedbackButtonText").val(feedbackButton.val());
            $("#textIdeviceFeedback").removeClass("closed-fieldset");
		}
		
		// Feedback 
		var feedback = $(".feedback",wrapper);
		if (feedback.length==1) {
			$("#textIdeviceFeedbackContent").val(feedback.html());
		}
		
	},
	
	save : function(){
		
		var html = "";
		
		// Text (required)
		var taskDesc = tinymce.editors[0].getContent();
		if (taskDesc=="") {
			
			// Error message
			var error = _("Please write some information.");		
			eXe.app.alert(error);
			return false;
			
		}
		
		html += '<div class="exe-text">';
			html += taskDesc;
		html += '</div>';
		
		// Optional feedback
		var taskFeedback = tinymce.editors[1].getContent();
		if (taskFeedback!="") {
			var taskFeedbackButtonText = $("#textIdeviceFeedbackButtonText").val();
			if (taskFeedbackButtonText=="") {
				var error = _("Please fill in this field: '%s'.");
					error = error.replace('%s',_("Feedback button text"));
				eXe.app.alert(error);
				return false;				
			}
			html += '<div class="iDevice_buttons feedback-button js-required">';
				html += '<input type="button" class="feedbackbutton" value="'+taskFeedbackButtonText+'" />';
			html += '</div>';
			html += '<div class="feedback js-feedback js-hidden">';
				html += taskFeedback;
			html += '</div>';
		}
		
		return html;
		
	}

}