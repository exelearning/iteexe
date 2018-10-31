/**
 * Interactive Video iDevice (edition code)
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Ignacio Gros (http://gros.es/) for http://exelearning.net/
 *
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
 
// To do:
// Do not allow Flash?
 
var $exeDevice = {
	
	iDevicePath : "/scripts/idevices/interactive-video/edition/",
	
	init : function(){
		
		 this.createForm();
		 
	},
	
	testIfVideoExists : function(url,type) {

		if (!top.interactiveVideoEditor) {
			eXe.app.alert(_("Could not retrieve data (Core error)") + " - 001");
		} else {
			top.interactiveVideoEditor.videoURL = url;
			top.interactiveVideoEditor.videoType = type;
		}

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
				<p>\
					<strong>'+_('Type')+':</strong> \
					<label for="interactiveVideoType-local"><input type="radio" name="interactiveVideoType" id="interactiveVideoType-local" value="local" checked="checked" /> '+_('Local file')+'</label> \
					<label for="interactiveVideoType-youtube"><input type="radio" name="interactiveVideoType" id="interactiveVideoType-youtube" value="youtube" /> '+_('Youtube')+'</label> \
					<label for="interactiveVideoType-mediateca"><input type="radio" name="interactiveVideoType" id="interactiveVideoType-mediateca" value="mediateca" /> '+_('Mediateca')+'</label> \
				</p>\
				<p id="interactiveVideo-local" class="interactiveVideoType">\
					<label for="interactiveVideoFile">'+_("File")+':</label> \
					<input type="text" id="interactiveVideoFile" class="exe-file-picker" />\
					<span class="info"><strong>'+_("Supported formats")+':</strong> OGV/OGG, webm, mp4</span>\
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
			</div>\
			<div id="interactiveVideoEditorOpener">\
				<p class="exe-block-success">'+_("Open the editor and start adding interaction...")+' <input type="button" id="interactiveVideoOpenEditor" onclick="$exeDevice.editor.start()" value="'+_("Editor")+'" /></p>\
			</div>\
		';
		
		field.before(html);
		
		$("input[name=interactiveVideoType]").change(function(){
			$exeDevice.toggleType(this.value);
		});	

		$("#interactiveVideoFile").change(function(){
			if (this.value.indexOf("/previews/")==0) {
				var e = $("#interactiveVideoEditorOpener");
				$exeDevice.interactiveVideoEditorOpenerHTML = e.html();
				var saveNowMsg = '<p class="exe-block-info">'+_("Please save your iDevice now (click on %s now) and edit it to add interaction.")+'</p>';
				saveNowMsg = saveNowMsg.replace('%s','<img style="vertical-align:top" src="'+$exeDevice.iDevicePath+'images/stock-apply.png" alt="'+_("Done")+'" />');
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
			videoType : ""
		};		
		
		this.loadPreviousValues(field);
		
	},
	
	// Load the saved values in the form fields
	loadPreviousValues : function(field){

		var originalHTML = field.val();
		if (originalHTML != '') {
			
			var wrapper = $("<div id='interactiveVideoTmpWrapper'></div>");
				wrapper.html(originalHTML);
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
			}
			// Remove the wrapper
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
			if (extension!="ogg" && extension!="ogv" && extension!="mp4" && extension!="webm") {
				eXe.app.alert(_("Supported formats")+": OGV/OGG, webm, mp4");
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

		/* Example activities
		var contents = '\
			{\
				"slides":[\
					{\
						"startTime":2,\
						"type":"text",\
						"text":"<p>Texto del <strong>2</strong> al <strong>10</strong>.</p>",\
						"endTime":10,\
						"results":{\
							"viewed":true\
						},\
						"current":false\
					},\
					{\
						"type":"singleChoice",\
						"question":"<p>¿De qué color era el caballo <strong>blanco</strong> de Santiago?</p>",\
						"answers":[\
							[ "Rojo con puntos verdes", 0],\
							[ "Azul", 0 ],\
							[ "Blanco", 1 ]\
						],\
						"startTime":15,\
						"results":null,\
						"current":false\
					},\
					{\
						"type":"image",\
						"url":"http://ipsumimage.appspot.com/800x600",\
						"description":"Imagen en el 20",\
						"startTime":20,\
						"results":null,\
						"current":false\
					},\
					{\
						"type":"multipleChoice",\
						"question":"<p>El <strong>5</strong> es...</p>",\
						"answers":[\
							[ "Un número", 1 ],\
							[ "Un número par", 0 ],\
							[ "Un número impar", 1 ],\
							[ "Un número entero", 1 ]\
						],\
						"startTime":25,\
						"results":null,\
						"current":false\
					},\
					{\
						"type":"dropdown",\
						"text":"<p>En <span style=\\"text-decoration: line-through;\\">primavera</span> y <span style=\\"text-decoration: line-through;\\">verano</span>, en la mitad <span style=\\"text-decoration: line-through;\\">sur</span> de España, el petirrojo cría en bosques ribereños y montaña.</p><p>En la misma época, pero en la mitad <span style=\\"text-decoration: line-through;\\">norte</span>, se reproduce en cualquier tipo de bosque, campiña, huerto, parque, jardines, exceptuando los parajes <span style=\\"text-decoration: line-through;\\">bajos</span>, deforestados, secos, del valle del Ebro o de la depresión del Duero.</p>",\
						"startTime":30,\
						"additionalWords":[\
							"cinco",\
							"seis"\
						],\
						"results":null,\
						"current":true\
					},\
					{\
						"type":"cloze",\
						"text":"<p>En un lugar de la <span style=\\"text-decoration: line-through;\\">Mancha</span>, de cuyo nombre no quiero acordarme, no ha mucho tiempo que <span style=\\"text-decoration: line-through;\\">vivía</span> un hidalgo de los de lanza en astillero, adarga antigua, rocín flaco y <span style=\\"text-decoration: line-through;\\">galgo</span> corredor.</p>",\
						"startTime":40,\
						"results":null,\
						"current":false\
					},\
					{\
						"type":"matchElements",\
						"text":"<p>Relaciona <strong>nombres</strong> y <strong>apellidos</strong>.</p>",\
						"startTime":45,\
						"pairs":[\
							[ "LMS", "Moodle" ],\
							[ "Blog", "WordPress" ],\
							[ "Framework PHP", "Symfony" ]\
						],\
						"results":null,\
						"current":false\
					},\
					{\
						"type":"sortableList",\
						"text":"<p>Ordena la frase de <strong>El Quijote</strong>.</p>",\
						"startTime":50,\
						"items":[\
							"En un lugar de la Mancha, ",\
							"de cuyo nombre no quiero acordarme, ",\
							"no ha mucho tiempo que vivía un hidalgo ",\
							"de los de lanza en astillero, ",\
							"adarga antigua, ",\
							"rocín flaco y galgo corredor."\
						],\
						"results":null,\
						"current":false\
					}\
				]\
			};\
			';
		*/
		
		// {"title":"Mi ejemplo","description":"<p>Descripción del ejemplo.</p>","slides":[{"startTime":5,"type":"text","text":"<p>Texto del <strong>5</strong> al <strong>10</strong>.</p>","endTime":10},{"type":"singleChoice","question":"<p>¿De qué color era el caballo <strong>blanco</strong> de Santiago?</p>","answers":[["Rojo con puntos verdes",0],["Azul",0],["Blanco",1]],"startTime":15},{"type":"image","url":"http://mediateca.educa.madrid.org/imagen/ib1uala2wdd74nm3","description":"Imagen en el 20","startTime":20},{"type":"multipleChoice","question":"<p>El <strong>5</strong> es...</p>","answers":[["Un número",1],["Un número par",0],["Un número impar",1],["Un número entero",1]],"startTime":25},{"type":"dropdown","text":"<p>Uno, <span style=\"text-decoration: line-through;\">dos</span>, tres, <span style=\"text-decoration: line-through;\">cuatro</span>.</p>","startTime":30,"additionalWords":["cinco","seis"]},{"type":"cloze","text":"<p>En un lugar de la <span style=\"text-decoration: line-through;\">Mancha</span>, de cuyo nombre no quiero acordarme, no ha mucho tiempo que <span style=\"text-decoration: line-through;\">vivía</span> un hidalgo de los de lanza en astillero, adarga antigua, rocín flaco y <span style=\"text-decoration: line-through;\">galgo</span> corredor.</p>","startTime":40},{"type":"matchElements","text":"<p>Relaciona <strong>nombres</strong> y <strong>apellidos</strong>.</p>","startTime":45,"pairs":[["Cristina","García"],["Felipe","Retortillo"],["Ignacio","Gros"]]},{"type":"sortableList","text":"<p>Ordena la frase de <strong>El Quijote</strong>.</p>","startTime":50,"items":["En un lugar de la Mancha, ","de cuyo nombre no quiero acordarme, ","no ha mucho tiempo que vivía un hidalgo ","de los de lanza en astillero, ","adarga antigua, ","rocín flaco y galgo corredor."]}]}
		
		var contents = '{}';
		if (typeof(top.interactiveVideoEditor)!='undefined') {		
			contents = JSON.stringify(top.interactiveVideoEditor.activityToSave);
		}
		
		var html = '\
			<div class="exe-interactive-video">\
				<p id="exe-interactive-video-file" class="js-hidden">\
					<a href="'+myVideo+'">'+myVideo.split('.').pop()+'</a>\
				</p>\
				<script type="text/javascript">//<![CDATA[\
					\nvar InteractiveVideo = '+contents+'\
				//]]></script>\
			</div>';
		
		// Return the HTML to save
		if (type=="local") {
			html += '<div class="sr-av"><video width="320" height="240" controls="controls" class="mediaelement"><source src="'+myVideo+'" /></video></div>';
		}
		
		alert("HTML to save:\n\n"+html);
		
		return html;
		
	}

}