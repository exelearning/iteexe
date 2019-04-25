/**
 * Task iDevice (edition code)
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Ignacio Gros (http://gros.es/) for http://exelearning.net/
 *
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $exeDevice = {
	
	// We use eXe's _ function
	i18n : {
		name : _('Task')
	},
	
	init : function(){
		// Add some instructions
		var html = "\
			<fieldset id='pblTaskInfo' class='exe-fieldset'>\
				<legend>"+_('Task information')+"</legend>\
				<p>\
					<label for='pblTaskDuration'>"+_("Estimated duration")+":</label>\
					<input type='text' id='pblTaskDuration' placeholder='00:00' />\
					<label for='pblTaskDurationText'>"+_("Text to display")+":</label>\
					<input type='text' id='pblTaskDurationText' value='"+_("Duration")+":' />\
				</p>\
				<p>\
					<label for='pblTaskParticipants'>"+_("Participants")+":</label>\
					<input type='text' id='pblTaskParticipants' placeholder='"+_('Number or description')+"' />\
					<label for='pblTaskParticipantsText'>"+_("Text to display")+":</label>\
					<input type='text' id='pblTaskParticipantsText' value='"+_("Grouping")+":' />\
				</p>\
			</fieldset>\
			<div class='exe-textarea-field'>\
				<label for='pblTaskDescription'>"+_('Describe the tasks that the learners should complete:')+"</label>\
				<textarea id='pblTaskDescription' class='exe-html-editor'\></textarea>\
			</div>\
			<fieldset id='pblTaskFeedback' class='exe-fieldset exe-feedback-fieldset closed-fieldset'>\
				<legend><a href='#pblTaskFeedbackButtonText' id='pblFeedbackToggler'>"+_('Feedback')+" ("+_('Optional').toLowerCase()+")</a></legend>\
				<div>\
					<p class='exe-inline-text-field'>\
						<label for='pblTaskFeedbackButtonText'>"+_("Feedback button text")+":</label>\
						<input type='text' id='pblTaskFeedbackButtonText' value='"+_("Show Feedback")+"' />\
					</p>\
					<p>\
						<label for='pblTaskFeedbackContent' class='sr-av'>"+_('Feedback')+":</label>\
						<textarea id='pblTaskFeedbackContent' class='exe-html-editor'\></textarea>\
					</p>\
				<div>\
			</fieldset>\
			";
		
		// Insert the form
		this.textArea = $("#activeIdevice textarea");
		this.textArea.before(html);
		
		// Fieldset toggler
		$("#pblFeedbackToggler").click(function(){
			$("#pblTaskFeedback").toggleClass("closed-fieldset");
			return false;
		});		
		
		this.getPreviousValues();
		
	},
	
	getPreviousValues : function(){
		
		var content = this.textArea.val();
		var wrapper = $('<div />');
		wrapper.html(content);
		
		// Duration and participants
		var dl = $(".pbl-task-info",wrapper);
		if (dl.length==1) {
			// Duration
			// pbl-task-duration
			var durationDT = $("dt.pbl-task-duration",dl);
			var durationDD = $("dd.pbl-task-duration",dl);
			if (durationDT.length==1 && durationDT.length==1) {
				$("#pblTaskDuration").val(durationDD.html());
				$("#pblTaskDurationText").val(durationDT.text());
			}
			// pbl-task-participants
			var participantsDT = $("dt.pbl-task-participants",dl);
			var participantsDD = $("dd.pbl-task-participants",dl);
			if (participantsDT.length==1 && participantsDD.length==1) {
				$("#pblTaskParticipants").val(participantsDD.html());
				$("#pblTaskParticipantsText").val(participantsDT.text());
			}			
		}
		
		// Legacy
		var desc = $(".pbl-information",wrapper);
		if (desc.length!=1) desc = $(".pbl-task-description",wrapper);
		if (desc.length!=1) desc = $(".pbl-diary-instructions",wrapper);
		
		// Task description
		if (desc.length==1) {
			$("#pblTaskDescription").val(desc.html());
		}
		
		// Feedback button
		var feedbackButton = $(".feedbackbutton",wrapper);
		if (feedbackButton.length==1) {
			$("#pblTaskFeedbackButtonText").val(feedbackButton.val());
			$("#pblTaskFeedback").removeClass("closed-fieldset");
		}
		
		// Feedback 
		var feedback = $(".feedback",wrapper);
		if (feedback.length==1) {
			$("#pblTaskFeedbackContent").val(feedback.html());
		}
		
	},
	
	save : function(){
		
		var html = "";
		
		// Duration and participants
		var duration = $("#pblTaskDuration").val();
		var participants = $("#pblTaskParticipants").val();
		if (duration!="" || participants!="") {
			var msg = _("Please write the text to display in '%s'.");
			html += '<dl class="pbl-task-info">';
				if (duration!="") {
					var durationText = $("#pblTaskDurationText").val();
					if (durationText=="") {
						msg = msg.replace('%s',_('Duration'));
						eXe.app.alert(msg);
						return false;
					}
					html += '<dt class="pbl-task-duration"><span>'+durationText+'</span></dt><dd class="pbl-task-duration">'+duration+'</dd>';
				}
				if (participants!="") {
					var participantsText = $("#pblTaskParticipantsText").val();
					if (participantsText=="") {
						msg = msg.replace('%s',_('Participants'));
						eXe.app.alert(msg);
						return false;
					}
					html += '<dt class="pbl-task-participants"><span>'+participantsText+'</span></dt><dd class="pbl-task-participants">'+participants+'</dd>';
				}				
			html += '</dl>'
		}
		
		// Description
		var taskDesc = tinymce.editors[0].getContent();
		if (taskDesc=="") {
			
			// Error message
			var error = _("Please write the task description.");
			eXe.app.alert(error);
			
			return false;
			
		}
		
		var css = 'task-description';
		html += '<div class="pbl-'+css+'">';
			html += taskDesc;
		html += '</div>';
		
		// Task - Feedback
		var taskFeedback = tinymce.editors[1].getContent();
		if (taskFeedback!="") {
			var taskFeedbackButtonText = $("#pblTaskFeedbackButtonText").val();
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