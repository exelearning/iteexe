/**
 * Project Based Learning Task iDevice (edition code)
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Ignacio Gros (http://gros.es/) for http://exelearning.net/
 *
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $exeDevice = {
	
	instructions : {
		information : _('Provide information of the project or this part of the project.'),
		task : _('Describe the tasks that the learners should complete:'),
		diary : _("The Learning Diary is focused on the student's reflection and reasoning to construct their own learning. Please write some instructions.")
	},
	
	init : function(){
		// Add some instructions
		var html = "\
			<fieldset>\
				<legend>"+_('Options')+"</legend>\
				<p>"+_("Write the title, select an icon and choose a type...")+"</p>\
				<p>\
					<strong>"+_("Type:")+"</strong> \
					<label for='pblToolsType-information'><input type='radio' name='pblToolsType' id='pblToolsType-information' value='information' checked='checked' /> "+_("Information")+"</label> \
					<label for='pblToolsType-task'><input type='radio' name='pblToolsType' id='pblToolsType-task' value='task' /> "+_("Task")+"</label> \
					<label for='pblToolsType-diary'><input type='radio' name='pblToolsType' id='pblToolsType-diary' value='diary' /> "+_("Learning Diary")+"</label> \
				</p>\
			</fieldset>\
			<fieldset id='pblTaskInfo'>\
				<legend>"+_('Task information')+"</legend>\
				<p>\
					<label for='pblTaskDuration'>"+_("Estimated duration:")+"</label>\
					<input type='text' id='pblTaskDuration' placeholder='00:00' />\
					<label for='pblTaskDurationText'>"+_("Text to display:")+"</label>\
					<input type='text' id='pblTaskDurationText' value='"+_("Duration:")+"' />\
				</p>\
				<p>\
					<label for='pblTaskParticipants'>"+_("Participants:")+"</label>\
					<input type='text' id='pblTaskParticipants' placeholder='Number of participants in each group' />\
					<label for='pblTaskParticipantsText'>"+_("Text to display:")+"</label>\
					<input type='text' id='pblTaskParticipantsText' value='"+_("Participants:")+"' />\
				</p>\
			</fieldset>\
			<p><label for='pblTaskDescription'>"+_('Provide information of the project or this part of the project.')+"</label></p>\
			<p><textarea id='pblTaskDescription' class='pblTaskEditor'\></textarea></p>\
			<fieldset id='pblTaskFeedback'>\
				<legend>"+_('Feedback (optional)')+"</legend>\
				<p>\
					<label for='pblTaskFeedbackButtonText'>"+_("Feedback button text:")+"</label>\
					<input type='text' id='pblTaskFeedbackButtonText' value='"+_("Show Feedback")+"' />\
				</p>\
				<p><label for='pblTaskFeedbackContent'>"+_('Feedback:')+"</label></p>\
				<p><textarea id='pblTaskFeedbackContent' class='pblTaskEditor'\></textarea></p>\
			</fieldset>\
			";
		
		$("TEXTAREA").hide().before(html);
		
		$("input[name=pblToolsType]").change(function(){
			$exeDevice.toggleType(this.value);
		});
		
		this.getPreviousValues();
		
		// Enable TinyMCE
		if (tinymce.majorVersion==4) $exeTinyMCE.init("multiple-visible",".pblTaskEditor");
		else if (tinymce.majorVersion==3) $exeTinyMCE.init("specific_textareas","pblTaskEditor");
		
	},
	
	getPreviousValues : function(){
		
		var content = $("TEXTAREA.jsContentEditor").val();
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
		
		// Check the type
		// .pbl-information
		var desc = $(".pbl-information",wrapper);
		if (desc.length!=1) {
			// .pbl-task-description
			desc = $(".pbl-task-description",wrapper);
			if (desc.length==1) {
				// Change type
				$("#pblToolsType-task").attr("checked","checked").trigger("change");
			} else {
				// .pbl-diary-instructions
				desc = $(".pbl-diary-instructions",wrapper);
				if (desc.length==1) {
					// Change type
					$("#pblToolsType-diary").attr("checked","checked").trigger("change");
				}
			}
		}
		
		// Task description
		if (desc.length==1) {
			$("#pblTaskDescription").val(desc.html());
		}
		
		// Feedback button
		var feedbackButton = $(".feedbackbutton",wrapper);
		if (feedbackButton.length==1) {
			$("#pblTaskFeedbackButtonText").val(feedbackButton.val());
		}
		
		// Feedback 
		var feedback = $(".feedback",wrapper);
		if (feedback.length==1) {
			$("#pblTaskFeedbackContent").val(feedback.html());
		}
		
	},
	
	save : function(){
		
		var html = "";
		
		var type = $('input[name=pblToolsType]:checked').val();
		
		// Task - Duration and participants
		if (type=='task') {
			var duration = $("#pblTaskDuration").val();
			var participants = $("#pblTaskParticipants").val();
			if (duration!="" || participants!="") {
				html += '<dl class="pbl-task-info">';
					if (duration!="") {
						var durationText = $("#pblTaskDurationText").val();
						if (durationText=="") {
							eXe.app.alert(_("Please write the text to display in 'Duration'."));
							return false;
						}
						html += '<dt class="pbl-task-duration"><span>'+durationText+'</span></dt><dd class="pbl-task-duration">'+duration+'</dd>';
					}
					if (participants!="") {
						var participantsText = $("#pblTaskParticipantsText").val();
						if (participantsText=="") {
							eXe.app.alert(_("Please write the text to display in 'Participants'."));
							return false;
						}
						html += '<dt class="pbl-task-participants"><span>'+participantsText+'</span></dt><dd class="pbl-task-participants">'+participants+'</dd>';
					}				
				html += '</dl>'
			}
		}
		
		// Description
		var taskDesc = tinymce.editors[0].getContent();
		if (taskDesc=="") {
			
			// Error message
			var error = _("Please write some information.");
			if (type=='task') error = _("Please write the task description.");
			else if (type=='diary') error = _("Please write some instructions.");			
			
			eXe.app.alert(error);
			return false;
			
		}
		
		var css = type;
		if (type=='task') css = 'task-description';
		else if (type=='diary') css = 'diary-instructions';
		html += '<div class="pbl-'+css+'">';
			html += taskDesc;
		html += '</div>';
		
		// Task - Feedback
		if (type=='task') {
			var taskFeedback = tinymce.editors[1].getContent();
			if (taskFeedback!="") {
				var taskFeedbackButtonText = $("#pblTaskFeedbackButtonText").val();
				if (taskFeedbackButtonText=="") {
					eXe.app.alert(_("Please write the feedback button text."));
					return false;				
				}
				html += '<div class="iDevice_buttons feedback-button js-required">';
					html += '<input type="button" class="feedbackbutton" value="'+taskFeedbackButtonText+'" />';
				html += '</div>';
				html += '<div class="feedback js-feedback js-hidden">';
					html += taskFeedback;
				html += '</div>';
			}
		}
		
		return html;
		
	},
	
	toggleType : function(type) {
		
		$("label[for=pblTaskDescription]").text(this.instructions[type]);
		
		if (type == 'task') $("#pblTaskInfo,#pblTaskFeedback").fadeIn();
		else $("#pblTaskInfo,#pblTaskFeedback").hide();
		
	}

}