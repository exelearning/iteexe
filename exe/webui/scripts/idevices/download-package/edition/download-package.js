/**
 * Download Package iDevice (edition code)
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Ignacio Gros (http://gros.es/) for http://exelearning.net/
 *
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $exeDevice = {
	
    // We use eXe's _ function
	i18n : {
		name : _('Download content')
	},
	
	warningMessage : '<p class="exe-block-info">'+_('Before adding a download link to your page, please go to the Properties tab and check if the information is right.')+'</p>',
	
	init : function(){
		
		 this.createForm();
	},
	
	// Create the form to insert HTML in the TEXTAREA
	createForm : function(){
		
		var field = $("textarea.jsContentEditor").eq(0);
		
		var data1 = '-';
		var data2 = '-';
		var data3 = '-';
		var data4 = '-';
		
		var _data1 = top.document.getElementById('pp_title');
		if (_data1 && _data1.value && _data1.value!="") {
			data1 = _data1.value;
		}
		
		var _data2 = top.document.getElementById('pp_description');
		if (_data2 && _data2.value && _data2.value!="") {
			data2 = _data2.value;
		}

		var _data3 = top.document.getElementById('pp_author');
		if (_data3 && _data3.value && _data3.value!="") {
			data3 = _data3.value;
		}

		var _data4 = top.document.getElementById('pp_newlicense');
		if (_data4 && _data4.value && _data4.value!="") {
			data4 = _data4.value;
		}

		if (data1=='-' && data2=='-' && data3=='-' && data4=='-') {
			field.before($exeDevice.warningMessage);
			return false;
		}
		
		var defaultContent = '\
			<table class="exe-table">\
				<caption>'+_("General information about this educational resource")+' </caption>\
				<tbody>\
					<tr>\
						<th>'+_('Title')+' </th>\
						<td>'+data1+' </td>\
					</tr>\
					<tr>\
						<th>'+_('General description')+' </th>\
						<td>'+data2+' </td>\
					</tr>\
					<tr>\
						<th>'+_('Author')+' </th>\
						<td>'+data3+' </td>\
					</tr>\
					<tr>\
						<th>'+_('License')+' </th>\
						<td>'+data4+' </td>\
					</tr>\
				</tbody>\
			</table>\
			<p style="text-align:center">'+_("This content was created with eXeLearning, your Free and Open Source Editor to create Educational Resources.").replace('eXeLearning','<a href="http://exelearning.net/">eXeLearning</a>')+'</p>';
		
		var html = '\
			<div id="eXeDownloadPackageForm">\
				<p><label for="dpiDescription">'+_("Add a link to download the elp file. Write some use instructions and customize your download link.")+'</label></p>\
				<p><textarea id="dpiDescription" class="exe-html-editor">'+defaultContent+'</textarea></p>\
				<fieldset>\
					<legend>'+_("Download link")+'</legend>\
					<p>\
						<label for="dpiButtonText">'+_("Button text:")+' </label><input type="text" id="dpiButtonText" value="'+_("Download elp file")+'" /> \
						<label for="dpiButtonFontSize" class="dpi-label-col">'+_("Font size")+': </label>\
						<select id="dpiButtonFontSize">\
							<option value="1" selected="selected">100%</option>\
							<option value="1.25">125%</option>\
							<option value="1.5">150%</option>\
						</select>\
					</p>\
					<p>\
						<label for="dpiButtonBGcolor">'+_("Background Color")+': </label><input type="text" id="dpiButtonBGcolor" class="exe-color-picker" /> \
						<label for="dpiButtonTextColor" class="dpi-label-col">'+_("Text Color")+': </label><input type="text" id="dpiButtonTextColor" class="exe-color-picker" /> \
					</p>\
				</fieldset>\
			</div>\
		';
		
		field.before(html);
		this.loadPreviousValues(field);
		
	},
	
	rgb2hex : function(color){
		var rgb = color.replace(/\s/g,'').match(/^rgba?\((\d+),(\d+),(\d+)/i);
		return (rgb && rgb.length === 4) ? ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) + ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) + ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : color;
	},	
	
	// Load the saved values in the form fields
	loadPreviousValues : function(field){

		var originalHTML = field.val();
		if (originalHTML != '') {
			
			var wrapper = $("<div></div>");
			wrapper.html(originalHTML);
			
			// Instructions
			var dpiDescription = $(".exe-download-package-instructions",wrapper);
			if (dpiDescription.length==1 && dpiDescription.html()!="") {
				$("#dpiDescription").val(dpiDescription.html());
			}
			
			// Button
			var downloadButton = $(".exe-download-package-link a",wrapper);
			
			if (downloadButton.length==1) {
				
				// Button text
				var dpiButtonText = downloadButton.text();
				if (dpiButtonText!="") {
					$("#dpiButtonText").val(dpiButtonText);
				}
				
				// Font size
				var dpiButtonFontSize = downloadButton.css("font-size");
				if (dpiButtonFontSize=='1.25em') $("#dpiButtonFontSize").val("1.25");
				else if (dpiButtonFontSize=='1.5em') $("#dpiButtonFontSize").val("1.5");
				
				// Background color
				var dpiButtonBGcolor = downloadButton.css("background-color");
					dpiButtonBGcolor = $exeDevice.rgb2hex(dpiButtonBGcolor);
				if (dpiButtonBGcolor.length==6) $("#dpiButtonBGcolor").val(dpiButtonBGcolor);
				
				// Text color
				var dpiButtonTextColor = downloadButton.css("color");
					dpiButtonTextColor = $exeDevice.rgb2hex(dpiButtonTextColor);
				if (dpiButtonTextColor.length==6) $("#dpiButtonTextColor").val(dpiButtonTextColor);			
				
			}
			
		}		
		
	},
	
	save : function(){
		
		// Get the content
		
		if (tinymce.editors.length==0) return $exeDevice.warningMessage; // The .exe-block-info is displayed
		
		// Intructions
		var dpiDescription = tinymce.editors[0].getContent();
		if (dpiDescription=="") {
			eXe.app.alert(_("Please provide some instructions or information about the resource."));
			return false;
		}
		
		// Button text
		var dpiButtonText = $("#dpiButtonText").val();
		// Remove HTML tags (just in case)
		var wrapper = $("<div></div>");
		wrapper.html(dpiButtonText);
		dpiButtonText = wrapper.text();		
		if (dpiButtonText=="") {
			eXe.app.alert(_("You should write the button text."));
			return false;
		}
		
		// Extra CSS
		var css = "";
		var dpiButtonFontSize = $("#dpiButtonFontSize").val();
		if (dpiButtonFontSize!='1') css += 'font-size:'+dpiButtonFontSize+'em;'
		var dpiButtonBGcolor = $("#dpiButtonBGcolor").val();
		if (dpiButtonBGcolor!='' && dpiButtonBGcolor.length==6) css += 'background-color:#'+dpiButtonBGcolor+';'
		var dpiButtonTextColor = $("#dpiButtonTextColor").val();
		if (dpiButtonTextColor!='' && dpiButtonTextColor.length==6) css += 'color:#'+dpiButtonTextColor+';'
		if (css!="") css = ' style="'+css+'"';
						
		var html = '<div class="exe-download-package-instructions">'+dpiDescription+'</div>';
			html += '<p class="exe-download-package-link"><a href="exe-package:elp"'+css+'>'+dpiButtonText+'</a></p>';
			
		// Return the HTML to save
		return html;
		
	}

}