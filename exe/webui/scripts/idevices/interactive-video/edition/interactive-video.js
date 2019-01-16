/**
 * Interactive Video iDevice (edition code)
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Ignacio Gros (http://gros.es/) for http://exelearning.net/
 *
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
 
// To review:
// Do not allow Flash?
 
var $exeDevice = {
	
	iDevicePath : "/scripts/idevices/interactive-video/edition/",
	
	init : function(){
		
		 this.createForm();
		 
	},
	
	ci18n : {
		"start" : _("Start"),
		"results" : _("Results"),
		"slide" : _("Slide (frame)"),
		"score" : _("Score"),
		"seen" : _("Seen"),
		"total" : _("Total"),
		"seeAll" : _("see all the slides and answer all the questions"),
		"noSlides" : _("This video has no interactive slides."),
		"goOn" : _("Continue"),
		"error" : _("Error"),
		"dataError" : _("Incompatible code"),
		"onlyOne" : _("Ony one interactive video per page."),
		"cover" : _("Cover"),
		"fsWarning" : _("Exit the fullscreen mode (Esc) to see the current slide"),
		"right" : _("Right!"),
		"wrong" : _("Wrong"),
		"sortableListInstructions" : _("Drag and drop or use the arrows."),
		"up" : _("Move up"),
		"down" : _("Move down"),
		"rightAnswer" : _("Right answer:"),
		"notAnswered" : _("Please finish the activity"),
		"check" : _("Check"),
		"newWindow" : _("New Window")
	},
	
	enableTabs : function(id){
		
		var tabs = $("#"+id+" .exe-form-tab");
		var list = '';
		var tabId;
		var e;
		var txt;
		tabs.each(function(i){
			var klass = "exe-form-active-tab";
			tabId = id+"Tab"+i;
			e = $(this);
			e.attr("id",tabId);
			txt = e.attr("title");
			if (txt=='') txt = (i+1);
			if (i>0) {
				e.hide();
				klass = "";
			}
			list += '<li><a href="#'+tabId+'" class="'+klass+'">'+txt+'</a></li>';
		});
		if (list!="") {
			list = '<ul id="'+id+'Tabs" class="exe-form-tabs">'+list+'</ul>';
			tabs.eq(0).before(list);
			var as = $("#"+id+"Tabs a");
			as.click(function(){
				as.attr("class","");
				$(this).addClass("exe-form-active-tab");
				tabs.hide();
				$($(this).attr("href")).show();
				return false;
			});
		}
		
	},
	
	testIfVideoExists : function(url,type) {

		if (!top.interactiveVideoEditor) {
			eXe.app.alert(_("Could not retrieve data (Core error)") + " - 001");
		} else {
			top.interactiveVideoEditor.videoURL = url;
			top.interactiveVideoEditor.videoType = type;
			top.interactiveVideoEditor.imageList = [];
		}

	},
	// Custom text fields
	getLanguageFields : function(){
		var html = "";
		var fields = this.ci18n;
		for (var i in fields) {
			html += '<p class="ci18n"><label for="ci18n_'+i+'">'+fields[i]+'</label> <input type="text" name="ci18n_'+i+'" id="ci18n_'+i+'" value="'+fields[i]+'" /></p>'
		}
		return html;
	},
	// Create the form to insert HTML in the TEXTAREA
	createForm : function(){
		
		var html = '';
		
		var field = $("textarea.jsContentEditor").eq(0);
		
		// Only one Interactive Video iDevice per page
		if ($(".iDevice_wrapper.interactive-videoIdevice").length>0) {
			html = '<p>'+_('You can only add one Interactive Video iDevice per page.')+'</p>';
			field.before(html);
			return;
		}
		
		html = '\
			<div id="interactiveVideoIdeviceForm">\
				<div class="exe-form-tab" title="General settings">\
					<p>\
						<strong>'+_('Type')+':</strong> \
						<label for="interactiveVideoType-local"><input type="radio" name="interactiveVideoType" id="interactiveVideoType-local" value="local" checked="checked" /> '+_('Local file')+'</label> \
						<label for="interactiveVideoType-youtube"><input type="radio" name="interactiveVideoType" id="interactiveVideoType-youtube" value="youtube" /> '+_('Youtube')+'</label> \
						<label for="interactiveVideoType-mediateca"><input type="radio" name="interactiveVideoType" id="interactiveVideoType-mediateca" value="mediateca" /> '+_('Mediateca')+'</label> \
					</p>\
					<p id="interactiveVideo-local" class="interactiveVideoType">\
						<label for="interactiveVideoFile">'+_("File")+':</label> \
						<input type="text" id="interactiveVideoFile" class="exe-file-picker" />\
						<span class="info"><strong>'+_("Supported formats")+':</strong> OGV/OGG, webm, mp4, flv</span>\
					</p>\
					<p id="interactiveVideo-youtube" class="interactiveVideoType">\
						<label for="interactiveVideoYoutubeURL">'+_("URL")+':</label> \
						<input type="text" id="interactiveVideoYoutubeURL" />\
						<span class="info"><strong>'+_("Example")+':</strong> <a href="https://www.youtube.com/watch?v=v_rGjOBtvhI" target="_blank">https://www.youtube.com/watch?v=v_rGjOBtvhI</a></span>\
					</p>\
					<p id="interactiveVideo-mediateca" class="interactiveVideoType">\
						<label for="interactiveVideoMediatecaURL">'+_("URL")+':</label> \
						<input type="text" id="interactiveVideoMediatecaURL" />\
						<span class="info"><strong>'+_("Example")+':</strong> <a href="https://mediateca.educa.madrid.org/video/3vmgyeluy8c35xzj" target="_blank">https://mediateca.educa.madrid.org/video/3vmgyeluy8c35xzj</a></span>\
					</p>\
					<p>\
						<label for="interactiveVideoShowResults"><input type="checkbox" name="interactiveVideoShowResults" id="interactiveVideoShowResults" checked="checked" /> '+_("Show results")+'</label>\
					</p>\
					<div id="interactiveVideoEditorOpener">\
						<p class="exe-block-success">'+_("Open the editor and start adding interaction...")+' <input type="button" id="interactiveVideoOpenEditor" onclick="$exeDevice.editor.start()" value="'+_("Editor")+'" /></p>\
					</div>\
				</div>\
				<div class="exe-form-tab" title="Language settings">\
					<p>'+_("Custom texts (or use the default ones):")+'</p>\
					'+this.getLanguageFields()+'\
				</div>\
			</div>\
		';
		
		html += ''
		
		field.before(html);
		
		this.enableTabs("interactiveVideoIdeviceForm");
		
		$("input[name=interactiveVideoType]").change(function(){
			$exeDevice.toggleType(this.value);
		});	

		$("#interactiveVideoFile").change(function(){
			if (this.value.indexOf("/previews/")==0) {
				var e = $("#interactiveVideoEditorOpener");
				$exeDevice.interactiveVideoEditorOpenerHTML = e.html();
				var saveNowMsg = '<p class="exe-block-info">'+_("Please save your iDevice now (click on %s now) and edit it to add interaction.")+'</p>';
				saveNowMsg = saveNowMsg.replace('%s','<img style="vertical-align:top" src="'+$exeDevice.iDevicePath+'images/stock-apply.png" alt="'+_("Done")+'" />');
				var extension = this.value.split('.').pop().toLowerCase();
				if (extension=="flv") {
					eXe.app.alert(_("Format")+": flv - "+_("Recommended type")+": ogv/ogg, webm, mp4");
				}				
				e.html(saveNowMsg).fadeIn();
			}
		});
		
		$("#interactiveVideoYoutubeURL").change(function(){
			var e = $("#interactiveVideoEditorOpener");
			if (this.value.indexOf("https://www.youtube.com/watch?v=")==0) {
				$exeDevice.testIfVideoExists(this.value,"youtube");
				e.fadeIn();
			} else {
				e.hide();
			}
		}).keyup(function(){
			var e = $("#interactiveVideoEditorOpener");
			if (this.value.indexOf("https://www.youtube.com/watch?v=")==0) {
				$exeDevice.testIfVideoExists(this.value,"youtube");
				e.fadeIn();
			} else {
				e.hide();
			}
		});
		
		$("#interactiveVideoMediatecaURL").change(function(){
			var e = $("#interactiveVideoEditorOpener");
			if (this.value.indexOf("https://mediateca.educa.madrid.org/video/")==0) {
				$exeDevice.testIfVideoExists(this.value,"mediateca");
				e.fadeIn();
			} else {
				e.hide();
			}
		}).keyup(function(){
			var e = $("#interactiveVideoEditorOpener");
			if (this.value.indexOf("https://mediateca.educa.madrid.org/video/")==0) {
				$exeDevice.testIfVideoExists(this.value,"mediateca");
				e.fadeIn();
			} else {
				e.hide();
			}
		});
		
		// Create the object to contain all data
		top.interactiveVideoEditor = {
			ask : true,
			activityToSave : {
				slides : []
			},
			videoURL : "",
			videoType : "",
			i18n : {}
		};		
		
		this.loadPreviousValues(field);
		
	},
	
	// Load the saved values in the form fields
	loadPreviousValues : function(field){

		var originalHTML = field.val();
		if (originalHTML != '') {
			
			var wrapper = $("<div id='interactiveVideoTmpWrapper'></div>");
				wrapper.html(originalHTML);
				// Check the CSS class (Show/Hide results)
				if ($("div",wrapper).eq(0).hasClass("exe-interactive-video-no-results")) {
					$("#interactiveVideoShowResults").prop("checked",false);
				}
				// Get the file
				var videoWrapper = $("#exe-interactive-video-file a",wrapper);
				var type = "local";
				if (videoWrapper.length==1) {
					var videoURL = videoWrapper.attr("href");
					var n = "File";
					var disabled = "disabled";
					if (videoURL.indexOf("https://mediateca.educa.madrid.org/")==0) {
						n = "MediatecaURL";
						disabled = false;
						type = "mediateca";
					} else if (videoURL.indexOf("www.youtube.com")>-1) {
						n = "YoutubeURL";			
						disabled = false;
						type = "youtube";
					}
					$("#interactiveVideoType-"+type).prop("checked","checked").trigger("change");
					$("#interactiveVideo"+n).val(videoURL).prop("disabled",disabled);
					$("#interactiveVideoEditorOpener").fadeIn();
					// Get the video URL and type
					top.interactiveVideoEditor.videoURL = videoURL;
					top.interactiveVideoEditor.videoType = type;					
				}
			$('body').append(wrapper);
			
			// Get the data
			if (typeof(InteractiveVideo)=='object' && typeof(InteractiveVideo.slides)=='object') {
				top.interactiveVideoEditor.activityToSave = InteractiveVideo;
				if (typeof(InteractiveVideo.i18n)=='object') {
					for (var i in InteractiveVideo.i18n) {
						var v = InteractiveVideo.i18n[i];
						if (v!="") $("#ci18n_"+i).val(v);
					}
				}
			}
			// Save the list of images and remove the wrapper
			top.interactiveVideoEditor.imageList = $(".exe-interactive-video-img img",wrapper);
			$('#interactiveVideoTmpWrapper').remove();
		}	
		
	},
	
	toggleType : function(v) {
		
		var btn = $("#interactiveVideoEditorOpener");
		// To review: btn.hide();
		$(".interactiveVideoType").hide();
		$("#interactiveVideo-"+v).fadeIn();
		// Hide the "Please save your iDevice now and edit it to add interaction." message.
		if (typeof($exeDevice.interactiveVideoEditorOpenerHTML)!='undefined') {
			btn.html($exeDevice.interactiveVideoEditorOpenerHTML);
		}
		// $("#interactiveVideoFile,#interactiveVideoYoutubeURL,#interactiveVideoMediatecaURL").val("");
		// if (top.interactiveVideoEditor.videoType)
		// Change the video type
		top.interactiveVideoEditor.videoType = v;
		if ($exeDevice.interactiveVideoEditorOpenerHTML) {
			// Keep displaying the "Save now" text if needed
			if (v=="local") $("#interactiveVideoFile").trigger("change");
			else $("#interactiveVideoEditorOpener").html($exeDevice.interactiveVideoEditorOpenerHTML);
		}
		
	},
	
	editor : {
		
		start : function(){
			
			var win = new Ext.Window({
				height:Ext.getBody().getViewSize().height*.85,
				width:Ext.getBody().getViewSize().width*.95,
				modal: true,
				resizable: false,
				maximizable: true,
				id: 'interactiveVideoEditor',
				title: _("Editor"),
				items: {
					xtype: 'uxiframe',
					src: $exeDevice.iDevicePath+"editor/",
					height: '100%'
				},
				closable: true,
				listeners: {
					beforeclose:function(win) {
						if(win.closeMe) {
							win.closeMe = false;
							return true;
						}
						Ext.Msg.show({
							title: _("Confirm"),
							msg: _("If you have made changes and have not saved them, they will be lost. Do you really want to quit?"),
							buttons:Ext.Msg.YESNO,
							callback:function(btn) {
								if('yes' === btn) {
									win.closeMe = true;
									win.close();
								}
							}
						});
						return false;
					}
				}				
			});
			// Save the window in the object that contains all data so you can close it, etc.
			top.interactiveVideoEditor.win = win;
			// Save the chooseImage function to use it in the editor
			top.interactiveVideoEditor.exe_tinymce = exe_tinymce;
			// Open the window
			win.show();
			
		}
		
	},
	
	save : function(){
		
		var myVideo = "";
		
		var type = $('input[name=interactiveVideoType]:checked').val();
		
		if (type=='local') {
			
			myVideo = $("#interactiveVideoFile").val();
			if (myVideo=="") {
				eXe.app.alert(_("Required")+": "+_("File"));
				return false;
			}
			var extension = myVideo.split('.').pop().toLowerCase();
			if (extension!="ogg" && extension!="ogv" && extension!="mp4" && extension!="webm" && extension!="flv") {
				eXe.app.alert(_("Supported formats")+": ogv/ogg, webm, mp4, flv");
				return false;
			}
			
		}
		
		else if (type=='youtube') {
			
			myVideo = $("#interactiveVideoYoutubeURL").val();
			if (myVideo.indexOf("https://www.youtube.com/watch?v=")!=0) {
				eXe.app.alert(_("Wrong URL. Expected format:")+" https://www.youtube.com/watch?v=v_rGjOBtvhI");
				return false;
			}
			
		}
		
		else if (type=='mediateca') {
			
			myVideo = $("#interactiveVideoMediatecaURL").val();
			if (myVideo.indexOf("https://mediateca.educa.madrid.org/video/")!=0) {
				eXe.app.alert(_("Wrong URL. Expected format:")+" https://mediateca.educa.madrid.org/video/3vmgyeluy8c35xzj");
				return false;
			}
			
		}
		
		var contents = '{}';
		if (typeof(top.interactiveVideoEditor)!='undefined') {		
		
			var imgsHTML = "";
			// Check for images:
			var slides = top.interactiveVideoEditor.activityToSave.slides;
			if (slides) {
				for (var i=0;i<slides.length;i++) {
					var slide = slides[i];
					if (slide.type=="image") {
						if (typeof(slide.url)=="string") {
							var check = slide.url.split("/resources/");
							// Updated image: The URL is something like http://localhost:51235/videos-interactivos-001/resources/my_file.jpg
							// So you have to remove anything before "resources/"
							if (check.length==2) {
								slide.url = "resources/"+check[1];
							} else {
								// To review
							}
						} else {
							// It's a number, so the image must be in the original HTML code
							// slide.url = imgs.eq(i).attr("src");
							var imgs = top.interactiveVideoEditor.imageList;
							for (var i=0;i<imgs.length;i++) {	
								var img = $(imgs[i]);
								if (img.attr("id")=="exe-interactive-video-img-"+i) {
									slide.url = img.attr("src");
								}
							}
						}
						imgsHTML += '<p class="exe-interactive-video-img"><img src="'+slide.url+'" id="exe-interactive-video-img-'+i+'" alt="" /></p>';
						slide.url = i;						
					}
				}
			}	
			
			var fields = this.ci18n;
			// Default value
			var i18n = fields;
			// Overwrite custom values
			for (var i in fields) {
				var fVal = $("#ci18n_"+i).val();
				if (fVal!="") i18n[i] = fVal;
			}

			top.interactiveVideoEditor.activityToSave.i18n = i18n;
		
			contents = JSON.stringify(top.interactiveVideoEditor.activityToSave);
			
		}
		
		var extraCSS = "";
		if ($("#interactiveVideoShowResults").is(":checked")==false) extraCSS = " exe-interactive-video-no-results";
		
		var html = '\
			<div class="exe-interactive-video'+extraCSS+'">\
				<p id="exe-interactive-video-file" class="js-hidden">\
					<a href="'+myVideo+'">'+myVideo.split('.').pop()+'</a>\
				</p>\
				<script type="text/javascript">//<![CDATA[\
					\nvar InteractiveVideo = '+contents+'\
				//]]></script>\
			</div>';
		
		// Return the HTML to save
		if (type=="local") {
			html += '<p class="sr-av"><video width="320" height="240" controls="controls" class="mediaelement"><source src="'+myVideo+'" /></video></p>';
		}
		
		// Add the images at the end of the code	
		html += imgsHTML;
		
		return html;
		
	}

}