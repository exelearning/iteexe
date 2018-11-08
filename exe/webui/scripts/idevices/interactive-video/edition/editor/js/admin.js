function toDo(s) {
	alert(s)
}
// To do: Get duration when using a local video
// To do: Check i18n
var iAdmin = {
	globals : {
		mode : "add", // add or edit
		currentSlide : "", // The order of the slide that's being edited (a number): InteractiveVideo.slides[X],
		warnWhenSave : true // Tell the user to click on Save before quitting
	},
	changeMode : function(mode) {
		if (mode=="add") {
			$("BODY").removeClass("edition-mode");
			$(".block-submit").attr("value",$i18n.Create_Frame_Submit);
			iAdmin.globals.mode = "add";		
			// Clear all the fields
			iAdmin.resetForm();
		} else {
			$("BODY").addClass("edition-mode");
			$(".block-submit").attr("value",$i18n.Update_Frame_Submit);
			iAdmin.globals.mode = "edit";	
		}
	},
	slideTypes : {
		"text" : $i18n.Text,
		"image" : $i18n.Image,
		"singleChoice" : $i18n.Single_Choice,
		"multipleChoice" : $i18n.Multiple_Choice,
		"dropdown" : $i18n.Dropdown_Activity,
		"cloze" : $i18n.Cloze_Quiz,
		"matchElements" : $i18n.Pairs_Game,
		"sortableList" : $i18n.Scrambled_List
	},
	slideTypesInstructions : {
		"text" : $i18n.Text_Instructions,
		"image" : $i18n.Image_Instructions,
		"singleChoice" : $i18n.Single_Choice_Instructions,
		"multipleChoice" : $i18n.Multiple_Choice_Instructions,
		"dropdown" : $i18n.Dropdown_Activity_Instructions,
		"cloze" : $i18n.Cloze_Quiz_Instructions,
		"matchElements" : $i18n.Pairs_Game_Instructions,
		"sortableList" : $i18n.Scrambled_List_Instructions
	},
	// hh:mm:ss to seconds
	hourToSeconds : function(str){
		var i = str.split(':');
		if (i.length==0) {
			return 0;
		} else if (i.length==1) {
			i = '00:00:'+i[0];
			i = i.split(':');
		} else if (i.length==2) {
			i = '00:'+i[0]+':'+i[1];
			i = i.split(':');
		}
		return (+i[0]) * 60 * 60 + (+i[1]) * 60 + (+i[2]); 
	},
	video : {
		hasPlayed : false,
		getPosition : function(){
			var type = iAdmin.video.type;
			if (type=="mediateca") return parseInt(jwplayer().getPosition());
			else if (type=="youtube") {
				try {
					return parseInt(iAdmin.video.player.getCurrentTime());
				} catch(e) {
					return 0;
				}
			} else {
				var video = $("#player video");
				var src = video.html();
					src = src.split('"');
					if (src.length!=3) return 0;
					src = src[1];
				var extension = src.split('.').pop().toLowerCase();
				if (extension=="flv") {
					return iAdmin.hourToSeconds($("#player .mejs-currenttime").eq(0).text());
				} else {
					return parseInt(video[0].currentTime);
				}				
			}
		},
		youtubeIsReady : function(){
			
			iAdmin.video.player = new YT.Player('player', {
				height: '356',
				width: '448',
				videoId: iAdmin.video.id,
				events: {
					'onReady': function(){
						try {
							iAdmin.video.duration = iAdmin.video.player.getDuration();	
						} catch(e) {
							
						}
					}
				}
			});
			
		},
		enable : function(url,type) {
			
			iAdmin.video.duration = 0;
			
			if (type=='mediateca') {
				
				// Get the video ID: https://mediateca.educa.madrid.org/video/...
				var id = url.replace("https://mediateca.educa.madrid.org/video/","");
					id = id.split("/");
					id = id[0];
					
				enableVideoPlayer(
					id,
					'http://mediateca.educa.madrid.org/imagen.php?id='+id+'&type=1&m=0',
					'356',
					'448'
				);					
				
			} else if (type=='youtube') {
				
				function youtube_parser(url){
					var match = url.match(regExp);
					var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
					var match = url.match(regExp);
					if (match && match[2].length == 11) {
						return match[2];
					} else {
						return false;
					}
				}				
				iAdmin.video.id = youtube_parser(url);			
				
				$("#player").html('<video width="448" height="356" controls="controls"><source src="'+url+'" /></video>');
				
				try {
				
					onYouTubeIframeAPIReady = iAdmin.video.youtubeIsReady;
					// Load the IFrame Player API code asynchronously
					var tag = document.createElement('script');
						tag.src = "https://www.youtube.com/iframe_api";
					var firstScriptTag = document.getElementsByTagName('script')[0];
						firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
					
				} catch(e) {
					
					iAdmin.appError(_("Could not retrieve data (Core error)") + " - 003 - "+_("The Youtube API might have changed."));
					return;				
					
				}
				
			} else if (type=='local') {
				
                mejs.MediaElementDefaults.flashName = "/scripts/mediaelement/" + mejs.MediaElementDefaults.flashName;
                mejs.MediaElementDefaults.silverlightName = "/scripts/mediaelement/" + mejs.MediaElementDefaults.silverlightName				
				
				$("#player").html('<video width="448" height="356" controls="controls"><source src="'+top.window.location.href+'/'+url+'" /></video>');
				// The player won't work if there's no delay. Why?
				setTimeout(function(){
					$("#player video").mediaelementplayer();	
				},500);
				
			}
			
		},		
	},
	mediaElement : {
		load : function(){
			
			
			
		},
	},
	orderSlides : function(){
		var sortable = [];
		for (var slide in InteractiveVideo.slides) {
			sortable.push([iAdmin.timeOptions.secondsToHHMMSS(InteractiveVideo.slides[slide].startTime), InteractiveVideo.slides[slide]])
		}
		sortable.sort();
		var sorted = [];
		for (var i in sortable) {
			sorted.push(sortable[i][1]);
		}
		InteractiveVideo.slides = sorted;
	},	
	getBlockInstructions : function(block) {
		var autoStop = false;
		block = block.replace("#","").replace("-block","");
		if (block=="text" || block=="image") autoStop = true;
		var html = "<ol>";
		html += '<li>Define en qué segundo aparece la diapositiva (<strong>Inicio</strong>).</li>';
		if (autoStop) {
			html += '<li>Si quieres que el vídeo se siga reproduciendo, di en qué segundo debe ocultarse la diapositiva (<strong>Fin</strong>).</li>';
		}
		html += '<li>Haz clic en <img src="images/timer.png" width="24" height="24" alt="Fotograma actual" /> para obtener el momento exacto en el que se encuentra el vídeo.</li>';
		html += "</ol>";
		html += "<h4>"+iAdmin.slideTypes[block]+"<span>("+$i18n.Text.toLowerCase()+")</span>:</h4>";
		html += "<p>"+iAdmin.slideTypesInstructions[block]+"</p>";
		html += "<p id='close-help'><input type='button' id='close-help-input' value='"+$i18n.Close_Help+"' onclick='iAdmin.toggleHelp()' /></p>";
		return html;
	},
	toggleHelp : function(){
		var html = $("html").eq(0);
		if (html.attr("class")!="help-visible") html.attr("class","help-visible");
		else html.attr("class","");
	},
	timeOptions : {
		init : function(block){
			$("#time-and-help-block").remove();
			var autoStop = '<p class="checkbox"><label for="auto-stop"><input type="checkbox" id="auto-stop" /> Detener la reproducción</label></p>';
			if (block!="#text-block" && block!="#image-block") {
				autoStop = '<p class="checkbox disabled"><label for="auto-stop"><input type="checkbox" id="auto-stop" disabled="disabled" checked="checked" /> Detener la reproducción</label></p>';
			}
			var fromToBlock = '\
				<div id="time-and-help-block">\
					<p id="from-to-help-link"><a href="#from-to-help" title="Mostrar/Ocultar la ayuda" onclick="iAdmin.toggleHelp();return false"><em>Ayuda</em></a></p>\
					<div id="from-to-help">\
						'+iAdmin.getBlockInstructions(block)+'\
					</div>\
					<div id="from-to">\
						<p id="from" class="time">\
							<strong>Inicio:</strong>\
							<input type="hidden" id="from-in-seconds" value="0" />\
							<label for="from-hh" class="sr-av">Horas:</label><input type="text" id="from-hh" maxlength="2" value="00" />:<label for="from-mm" class="sr-av">Minutos:</label><input type="text" id="from-mm" maxlength="2" value="00" />:<label for="from-ss" class="sr-av">Segundos:</label><input type="text" id="from-ss" maxlength="2" value="00" />\
							<a href="#" id="from-now" title="Fotograma actual" class="from"><span>Ahora</span></a>\
						</p>\
						'+autoStop+'\
						<p id="to" class="time">\
							<strong>Fin:</strong>\
							<input type="hidden" id="to-in-seconds" value="0" />\
							<label for="to-hh" class="sr-av">Horas:</label><input type="text" id="to-hh" maxlength="2" value="00" />:<label for="to-mm" class="sr-av">Minutos:</label><input type="text" id="to-mm" maxlength="2" value="00" />:<label for="to-ss" class="sr-av">Segundos:</label><input type="text" id="to-ss" maxlength="2" value="00" />\
							<a href="#" id="to-now" title="Fotograma actual" class="to"><span>Ahora</span></a>\
						</p>\
					</div>\
				</div>';
			$(block+"-form").prepend(fromToBlock);
			
			// Help
			$("body").removeClass("help-visible");		
			
			iAdmin.timeOptions.setDefaultValues();
		},
		setDefaultValues : function(){
			var currentSecond = iAdmin.video.getPosition();
			if (!isNaN(currentSecond)) {
				var hhmmss = iAdmin.timeOptions.secondsToHHMMSS(currentSecond);
				hhmmss = hhmmss.split(":");
				// Start and end
				$("#from-in-seconds,#to-in-seconds").val(currentSecond);
				$("#from-hh,#to-hh").val(hhmmss[0]);
				$("#from-mm,#to-mm").val(hhmmss[1]);
				$("#from-ss,#to-ss").val(hhmmss[2]);
			}
			iAdmin.timeOptions.enable();
		},
		enable : function(){
			// Time options
			$("#auto-stop").prop("checked","checked").change(function(){
				if (this.checked) {
					$("#to").hide();
				} else {
					$("#to").show();
				}
			});
			// Auto from
			$("#from-now,#to-now").click(function(){
				iAdmin.timeOptions.setValues(this);
				return false;
			});
			$("#from-to input[type=text]").keyup(function(){
				this.value = this.value.replace(/[^0-9.]/g, "");
			});		
		},
		secondsToHHMMSS : function(totalSec){
			var hours = parseInt( totalSec / 3600 ) % 24;
			var minutes = parseInt( totalSec / 60 ) % 60;
			var seconds = totalSec % 60;
			return (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
		},
		setValues : function(e,totalSec) {
			var type = e;
			if (typeof(e)!="string") type = e.className;
			if (!totalSec) totalSec = iAdmin.video.getPosition();
			var result = iAdmin.timeOptions.secondsToHHMMSS(totalSec);
			result = result.split(":");
			$("#"+type+"-hh").val(result[0]);
			$("#"+type+"-mm").val(result[1]);
			$("#"+type+"-ss").val(result[2]);
		},
		formatValues : function(totalSec){
			//var totalSec = new Date().getTime() / 1000;
		},
		validateRange : function(){
			
			// From...
			var fromHH = $("#from-hh");
			var fromMM = $("#from-mm");
			var fromSS = $("#from-ss");
			if (fromHH.val()=="" || fromMM.val()=="" || fromSS.val()=="") {
				iAdmin.msg.txt("Debes especificar el inicio (hh:mm:ss).");
				return false;
			}
			var fromHHval = parseInt(fromHH.val())*3600;
			var fromMMval = parseInt(fromMM.val())*60;
			var fromSSval = parseInt(fromSS.val());
			var totalSecFrom = fromHHval + fromMMval + fromSSval;
			if (totalSecFrom==0) {
				iAdmin.msg.txt('Revisa el apartado "Inicio". En el segundo cero se encuentra la portada.');
				return false;
			}			
			if (iAdmin.video.duration>0 && totalSecFrom>iAdmin.video.duration) {
				iAdmin.msg.txt('Revisa el apartado "Inicio". El vídeo no dura tanto.');
				return false;
			}
			
			// Update the hidden field
			iAdmin.timeOptions.setValues("from",totalSecFrom);
			$("#from-in-seconds").val(totalSecFrom);
			
			// To...
			if (!$("#auto-stop").prop("checked")) {
				var toHH = $("#to-hh");
				var toMM = $("#to-mm");
				var toSS = $("#to-ss");
				if (toHH.val()=="" || toMM.val()=="" || toSS.val()=="") {
					iAdmin.msg.txt("Debes especificar el fin (hh:mm:ss)");
					return false;
				}
				var toHHval = parseInt(toHH.val())*3600;
				var toMMval = parseInt(toMM.val())*60;
				var toSSval = parseInt(toSS.val());
				var totalSecTo = toHHval + toMMval + toSSval;
				if (iAdmin.video.duration>0 && totalSecTo>iAdmin.video.duration) {
					iAdmin.msg.txt('Revisa el apartado "Fin". El vídeo no dura tanto.');
					return false;
				}
				if (totalSecTo<=totalSecFrom) {
					iAdmin.msg.txt('Revisa el apartado "Fin". Debe ser después de "Inicio".');
					return false;
				}
				
				// Update the hidden field
				iAdmin.timeOptions.setValues("to",totalSecTo);
				$("#to-in-seconds").val(totalSecTo);				
				
			}
			
			return true;
			
		}
	},
	template : function(templateid,data){
		return document.getElementById(templateid).innerHTML.replace(/%(\w*)%/g,
		function(m,key){
			return data.hasOwnProperty(key)?data[key]:key.replace(/_/g," ");
		});
	},	
	i18n : function(){
		// document.title = $i18n.Style_Designer;
		document.getElementById("site").innerHTML=this.template("site",$i18n);
	},
	appMsg : function(msg) {
		top.eXe.app.alert(msg);
	},
	appError : function(msg) {
		this.appMsg(msg);
		top.interactiveVideoEditor.win.closeMe = true;
		top.interactiveVideoEditor.win.close();
		top.interactiveVideoEditor.win.closeMe = false;
		// $("body").hide();
	},
	init : function(){
		
		// Missing type or URL
		if (!top || !top.interactiveVideoEditor || !top.interactiveVideoEditor.videoType || !top.interactiveVideoEditor.videoURL) {
			this.appError(_("Could not retrieve data (Core error)") + " - 002");
			return;
		}
		
		this.video.type = top.interactiveVideoEditor.videoType;
		this.video.url = top.interactiveVideoEditor.videoURL;
		
		// Check if the type and the URL match
		if (this.video.type=='local') {
			if (this.video.url.indexOf("resources/")!=0) {
				this.appError(_('Type')+": "+_('Local file')+" - "+_('Please type or paste a valid URL.'));
				return;
			}
		} else if (this.video.type=='mediateca') {
			if (this.video.url.indexOf("https://mediateca.educa.madrid.org/")!=0) {
				this.appError(_('Type')+": "+_('Mediateca')+" - "+_('Please type or paste a valid URL.'));
				return;
			}
		} else if (this.video.type=='youtube') {
			if (this.video.url.indexOf("https://www.youtube.com/")!=0) {
				this.appError(_('Type')+": "+_('Youtube')+" - "+_('Please type or paste a valid URL.'));
				return;
			}
		}
		
		// Enable the player
		this.video.enable(this.video.url,this.video.type);
		
		// Translate the app
		this.i18n();

		this.timeOptions.init("#text-block");
		
		this.getPreviousValues();		
		
		this.tabs.init("image");
		this.tabs.init("singleChoice");
		this.tabs.init("multipleChoice");
		this.tabs.init("dropdown");
		this.tabs.init("matchElements");
		this.tabs.init("sortableList");
		
		// Main menu (Ayuda, Crear una portada, Crear un fotograma, Editar un fotograma)
		this.tip = $("#controls-tip");
		this.tipCurrentTitle = "";
		this.controls = $("#controls a");
		this.controls.hover(
			function(){
				var t = this.title;
				iAdmin.tipTitle = t;
				this.title = "";
				iAdmin.tip.html(t);
			},
			function(){
				iAdmin.tip.html(iAdmin.tipCurrentTitle);
				this.title = iAdmin.tipTitle;
			}
		).focus(
			function(){
				var t = this.title;
				if (t!="") iAdmin.tipTitle = t;
				this.title = "";
				iAdmin.tip.html(iAdmin.tipTitle)
			}
		).blur(
			function(){
				iAdmin.tip.html(iAdmin.tipCurrentTitle);
				this.title = iAdmin.tipTitle;
			}
		).click(function(){
			var e = $(this);
				
			iAdmin.controls.removeClass("current");
			e.addClass("current");
			$(".admin-block").hide();
			
			// Hide all the success messages and show the hidden forms
			// $(".hidden-block").removeClass();
			// $(".success-msg").html("");
			
			iAdmin.tipCurrentTitle = iAdmin.tipTitle;
			var href = e.attr("href");
			if (href == "#add-block") {			
				// Change the mode
				iAdmin.changeMode("add");
				iAdmin.timeOptions.setValues("from");
				iAdmin.timeOptions.setValues("to");				
			}
			
			$(href).fadeIn();
			return false;
		});
		
		// Top menu (Borrar, Guardar como..., Previsualizar, Guardar, Salir)
		this.topTip = $("#actions-desc");
		$("#actions a").hover(
			function(){
				var t = this.title;
				iAdmin.topTipTitle = t;
				this.title = "";
				iAdmin.topTip.html(t)
			},
			function(){
				iAdmin.topTip.html("");
				this.title = iAdmin.topTipTitle;
			}
		).focus(
			function(){
				var t = this.title;
				if (t!="") iAdmin.topTipTitle = t;
				this.title = "";
				iAdmin.topTip.html(iAdmin.topTipTitle)
			}
		).blur(
			function(){
				iAdmin.topTip.html("");
				this.title = iAdmin.topTipTitle;
			}
		).click(function(){
			iAdmin.topTip.html("");
		});		
		
		// Add type menu (Texto, etc.)
		this.typeTip = $("#block-type-description");
		this.typeControls = $("#block-types a");
		this.typeCurrentTitle = "Texto";
		this.typeControls.hover(
			function(){
				if ($("BODY").hasClass("edition-mode")) return false;
				var t = this.title;
				iAdmin.typeTipTitle = t;
				this.title = "";
				iAdmin.typeTip.html($(this).text())
			},
			function(){
				if ($("BODY").hasClass("edition-mode")) return false;
				iAdmin.typeTip.html(iAdmin.typeCurrentTitle);
				this.title = iAdmin.typeTipTitle;
			}
		).focus(
			function(){
				if ($("BODY").hasClass("edition-mode")) return false;
				var t = this.title;
				if (t!="") iAdmin.typeTipTitle = t;
				this.title = "";
				iAdmin.typeTip.html($(this).text())
			}		
		).blur(
			function(){
				if ($("BODY").hasClass("edition-mode")) return false;
				iAdmin.typeTip.html(iAdmin.typeCurrentTitle);
				this.title = iAdmin.typeTipTitle;
			}
		).click(function(){
			if ($("BODY").hasClass("edition-mode")) return false;
			
			iAdmin.resetForm();
			
			iAdmin.typeTip.html($(this).text());
			var e = $(this);
			iAdmin.typeControls.removeClass("current");
			e.addClass("current");
			$(".block-type").hide();
			var id = e.attr("href");
			var c = $(id);
			iAdmin.timeOptions.init(id);
			c.fadeIn();
			iAdmin.typeCurrentTitle = $("h3",c).html();
			return false;
		});		
		
		try {
			document.createEvent("TouchEvent");
			$("BODY").addClass("is-mobile");
		} catch(e) {
			
		}
		
		this.editors.init();
		this.msg.init();
		
		// Save buttons
		
			// Front page
			$("#frontpage-submit").click(function(){
				iAdmin.save("cover");
			});
			$("#frontpage-form").submit(function(){
				iAdmin.save("cover");
				return false;
			});
			
			// Frames
			$(".block-submit").click(function(){
				iAdmin.save(this.id.replace("-block-submit",""));
			});
			$(".block-form").submit(function(){
				iAdmin.save(this.id.replace("-block-form",""));
				return false;
			});
		
	},
	resetForm : function(){
		// Hide all the success messages and show the hidden forms
		$(".hidden-block").removeClass();
		$(".success-msg").html("");		
		// Clear all the fields
		tinyMCE.get('text-block-content').setContent("");
		iAdmin.tabs.restart("image",false);
		iAdmin.tabs.restart("singleChoice",false);
		iAdmin.tabs.restart("multipleChoice",false);
		iAdmin.tabs.restart("dropdown",false);
		tinyMCE.get('cloze-question').setContent("");
		iAdmin.tabs.restart("matchElements",false);
		iAdmin.tabs.restart("sortableList",false);
	},
	getPreviousValues : function(){
		var i = InteractiveVideo;
		$("#frontpage-title").val(i.title);
		if (i.description) $("#frontpage-content").val(i.description);
		if (i.slides) {
			iAdmin.updateFramesList(i.slides);
		}
	},
	save : function(type){
		
		// Cover
		if (type=="cover") {
			var projectTitle = $("#frontpage-title").val();
			if (projectTitle=="") {
				iAdmin.msg.txt("El título es obligatorio.");
				return false;
			}
			InteractiveVideo["title"] = projectTitle;
			InteractiveVideo["description"] = tinyMCE.get('frontpage-content').save();
			$("#frontpage-form").hide().delay(1500).fadeIn();
			$("#frontpage-form-msg").html("<p>Portada actualizada.</p>").show().delay(1000).fadeOut();
			return false;
		}
		
		if (!iAdmin.timeOptions.validateRange()) return false;
		
		// Create the slides if needed
		if (!InteractiveVideo.slides) InteractiveVideo.slides = [];
		
		// Get the slide that's being edited (its number)
		if (iAdmin.globals.mode=="edit") {
			var order = iAdmin.globals.currentSlide;
			var slide = InteractiveVideo.slides[order];
		}
		
		// Get the start and end time
		var startTime = parseInt($("#from-in-seconds").val());		
		var toInSeconds = parseInt($("#to-in-seconds").val());
		
		// Save text
		if (type == "text") {
			var txt = tinyMCE.get('text-block-content').save();
			if (txt == "") {
				iAdmin.msg.txt("Debes escribir algún texto.");
				return false;
			}

			// Add mode
			if (iAdmin.globals.mode=="add") {
				var newText = {
					"type" : "text",
					"text" : txt,
					"startTime" : startTime
				}
				if (!$("#auto-stop").prop("checked")) {
					newText.endTime = toInSeconds;
				}				
				// Add the new slide
				InteractiveVideo.slides.push(newText);
				
			// Edit mode
			} else {
				slide.startTime = startTime;
				slide.text = txt;
				if (!$("#auto-stop").prop("checked")) {
					slide.endTime = toInSeconds;
				}
			}

		} // /save -> Text
		
		// Save image
		else if (type == "image") {
			
			// Check if it's a valid URL
			var url = $("#image-page-url").val();
			if (url == "") {
				iAdmin.msg.txt("Escribe la dirección de la imagen en la Mediateca.");
				return false;
			} else if (url.indexOf("http://mediateca.educa.madrid.org/imagen/")!=0 && url.indexOf("http://mediateca.educa.madrid.org/imagen.php?id=")!=0) {
				iAdmin.msg.txt("La dirección de la Mediateca no es correcta.");
				return false;
			}
			// Transform the URL (in case the wrong option's used)
			if (url.indexOf("http://mediateca.educa.madrid.org/imagen.php?id=")==0) {
				url = url.replace("http://mediateca.educa.madrid.org/imagen.php?id=","http://mediateca.educa.madrid.org/imagen/").split("&")[0];
			}
			
			// Check the alt text
			var alt = $("#image-alt").val();
			if (alt == "") {
				iAdmin.msg.txt("Escribe un texto alternativo (describe la imagen).");
				return false;
			}			
			
			// Add mode
			if (iAdmin.globals.mode=="add") {
				var newImage = {
					"type" : "image",
					"url" : url,
					"description" : alt,
					"startTime" : startTime
				}
				if (!$("#auto-stop").prop("checked")) {
					newImage.endTime = toInSeconds;
				}				
				// Add the new slide
				InteractiveVideo.slides.push(newImage);
				
			// Edit mode
			} else {
				slide.startTime = startTime;
				slide.url = url;
				slide.description = alt;
				if (!$("#auto-stop").prop("checked")) {
					slide.endTime = toInSeconds;
				}
			}

		} // /save -> Image
		
		// Save single choice or multiple choice
		else if (type == "singleChoice" || type == "multipleChoice") {
			
			// Check the question
			var question = tinyMCE.get(type+'-question').save();
			if (question == "") {
				iAdmin.msg.txt("Debes escribir una pregunta.");
				return false;
			}
			
			// Check the answers
			var answers = [];
			var oneIsRight = false;
			for (var i=0;i<6;i++) {
				var answer = $("#"+type+"-answer-"+(i+1)).val();
				if (answer!="") {
					var isRight = $("#"+type+"-answer-"+(i+1)+"-right").prop("checked");
					if (isRight) {
						oneIsRight = true;
						isRight = 1;
					} else {
						isRight = 0;
					}
					answers.push( [ answer, isRight ]);
				}
			}
			if (answers.length<2) {
				iAdmin.msg.txt("Escribe al menos dos respuestas.");
				return false;
			}
			if (!oneIsRight) {
				iAdmin.msg.txt("No has seleccionado la respuesta correcta.");
				return false;
			}
			
			// Add mode
			if (iAdmin.globals.mode=="add") {				
				var newSlide = {
					"type" : type,
					"question" : question,
					"answers" : answers,
					"startTime" : startTime
				}
				// Add the new slide
				InteractiveVideo.slides.push(newSlide);
				
			// Edit mode
			} else {
				slide.startTime = startTime;
				slide.question = question;
				slide.answers = answers;
			}		

		} // /save -> Single choice or multiple choice
		
		// Save dropdown activity
		else if (type == "dropdown") {
			
			// Check the text
			var txt = tinyMCE.get('dropdown-question').save();
			if (txt == "") {
				iAdmin.msg.txt("Debes escribir algún texto.");
				return false;
			}
			// Check if it has words to guess
			if (txt.indexOf(": line-through")==-1) {
				iAdmin.msg.txt("No has tachado ninguna palabra.");
				return false;
			}
			
			// Additional options
			var answers = [];
			for (var i=0;i<6;i++) {
				var answer = $("#dropdown-answer-"+(i+1)).val();
				if (answer!="") {
					answers.push(answer);
				}
			}

			// Add mode
			if (iAdmin.globals.mode=="add") {				
				var newDropdown = {
					"type" : "dropdown",
					"text" : txt,
					"startTime" : startTime
				}
				// Add the additional words (if needed)
				if (answers.length>0) {
					newDropdown.additionalWords = answers;
				}				
				// Add the new slide
				InteractiveVideo.slides.push(newDropdown);
				
			// Edit mode
			} else {
				slide.startTime = startTime;
				slide.text = txt;
				if (answers.length>0) {
					slide.additionalWords = answers;
				} else {
					// Remove slide.additionalWords if needed
					// We can't just use slide.additionalWords = null;
					delete slide.additionalWords;
				}
			}

		} // /save -> Dropdown activity	

		// Save cloze activity
		else if (type == "cloze") {
			
			// Check the text
			var txt = tinyMCE.get('cloze-question').save();
			if (txt == "") {
				iAdmin.msg.txt("Debes escribir algún texto.");
				return false;
			}
			// Check if it has words to guess
			if (txt.indexOf(": line-through")==-1) {
				iAdmin.msg.txt("No has tachado ninguna palabra.");
				return false;
			}
			
			// Add mode
			if (iAdmin.globals.mode=="add") {				
				var newDropdown = {
					"type" : "cloze",
					"text" : txt,
					"startTime" : startTime
				}
				// Add the new slide
				InteractiveVideo.slides.push(newDropdown);
				
			// Edit mode
			} else {
				slide.startTime = startTime;
				slide.text = txt;
			}

		} // /save -> Cloze activity

		// Save match elements activity
		else if (type == "matchElements") {
			
			// Check the text
			var txt = tinyMCE.get('matchElements-question').save();
			if (txt == "") {
				iAdmin.msg.txt("Escribe la introducción (instrucciones, etc.).");
				return false;
			}	

			// Check the answers
			var answers = [];
			for (var i=0;i<6;i++) {
				var answerA = $("#"+type+"-answer-"+(i+1)+"A").val();
				var answerB = $("#"+type+"-answer-"+(i+1)+"B").val();
				if (answerA!=""&&answerB!="") {
					answers.push( [ answerA, answerB ]);
				}
			}
			if (answers.length<2) {
				iAdmin.msg.txt("Añade al menos dos parejas.");
				return false;
			}
			
			// Add mode
			if (iAdmin.globals.mode=="add") {				
				var newMathActivity = {
					"type" : "matchElements",
					"text" : txt,
					"startTime" : startTime,
					"pairs" : answers					
				}
				// Add the new slide
				InteractiveVideo.slides.push(newMathActivity);
				
			// Edit mode
			} else {
				slide.startTime = startTime;
				slide.text = txt;
				slide.pairs = answers;
			}

		} // /save -> Match elements activity	


		// Save sortable list
		else if (type == "sortableList") {
			
			// Check the text
			var txt = tinyMCE.get('sortableList-question').save();
			if (txt == "") {
				iAdmin.msg.txt("Escribe la pregunta (instrucciones, etc.).");
				return false;
			}	

			// Check the answers
			var answers = [];
			for (var i=0;i<6;i++) {
				var answer = $("#"+type+"-answer-"+(i+1)).val();
				if (answer!="") {
					answers.push(answer);
				}
			}
			if (answers.length<2) {
				iAdmin.msg.txt("Añade al menos dos elementos a la lista.");
				return false;
			}
			
			// Add mode
			if (iAdmin.globals.mode=="add") {	
				var newSortableList = {
					"type" : "sortableList",
					"text" : txt,
					"startTime" : startTime,
					"items" : answers					
				}
				// Add the new slide
				InteractiveVideo.slides.push(newSortableList);
				
			// Edit mode
			} else {
				slide.startTime = startTime;
				slide.text = txt;
				slide.items = answers;
			}

		} // /save -> Sortable list
		
		// Put the slides in the right order
		iAdmin.orderSlides();				
		
		// Update the list ("Editar un fotograma")
		iAdmin.updateFramesList(InteractiveVideo.slides);				
		
		// Show the success message
		iAdmin.slide.success(type);	

		// Warn the user (just once)
		if (iAdmin.globals.warnWhenSave) {
			var word = "creado";
			if (iAdmin.globals.mode=="edit") word = "editado";
			iAdmin.msg.txt('<p><strong>Importante:</strong></p><p>Has '+word+' un fotograma, pero los cambios no se guardarán hasta que pulses "Guardar".</p><p><img src="images/help/save_warning.png" width="48" height="48" alt="Guardar (icono)" /></p><p><a href="#" onclick="iAdmin.globals.warnWhenSave=false;iAdmin.msg.hide();return false">No mostrar más este mensaje</a></p>');
		}
		
	}, // /save
	
	updateFramesList : function(slides,action){
		var html = "<p>Primero debes crear algún fotograma.</p>";
		if (action == "delete") html = "<p>Has eliminado todos los fotogramas.</p>";
		var l = slides.length;
		if (l>0) {
			html = '\
				<table>\
					<thead>\
						<tr>\
							<th>Tipo </th>\
							<th>Nº </th>\
							<th>Inicio </th>\
							<th>Fin </th>\
							<th>Acciones </th>\
						</tr>\
					</thead>\
					<tbody>';
					for (var i=0;i<l;i++) {
						var klass = "even";
						if (i%2==0) klass = "odd";
						var type = iAdmin.slideTypes[slides[i].type];
						var start = slides[i].startTime;
						var startHHMMSS = iAdmin.timeOptions.secondsToHHMMSS(start);
						var end = slides[i].endTime || "-";
						if (end != "-") {
							end = '<a href="#" onclick="jwplayer().seek('+end+');return false">'+iAdmin.timeOptions.secondsToHHMMSS(end)+'</a>';
						}
						html += '\
							<tr class="'+klass+'" id="slide-'+i+'">\
								<td class="'+slides[i].type+'">'+type+' </td>\
								<td>'+(i+1)+' </td>\
								<td><a href="#" onclick="jwplayer().seek('+start+');return false">'+startHHMMSS+'</a> </td>\
								<td>'+end+' </td>\
								<td>\
									<ul>\
										<li class="edit"><a href="#" title="Editar" onclick="iAdmin.slide.edit('+i+');return false"><span>Editar</span></a></li>\
										<li class="delete"><a href="#" title="Eliminar" onclick="iAdmin.slide.del('+i+',\''+startHHMMSS+'\');return false"><span>Eliminar</span></a></li>\
									</ul>\
								</td>\
							</tr>\
						';
					}
			html += '\
					</tbody>\
				</table>';
		}
		$("#edit-block").html(html);
	},
	slide : {
		del : function(order,startHHMMSS) {
			iAdmin.msg.ask("¿Eliminar el fotograma <strong>"+startHHMMSS+"</strong>?", function(){
				iAdmin.msg.hide();
				$("#slide-"+order).fadeOut("slow",function(){
					InteractiveVideo.slides.splice(order, 1);
					$(this).remove();
					iAdmin.updateFramesList(InteractiveVideo.slides,"delete");
				});
			});
		},
		success : function(type){
			$("#"+type+"-block-form").addClass("hidden-block");
			var links = " <a href='#' onclick='$(\"#controls a[href=#edit-block]\").click();return false'>Lista de fotogramas</a>";
			links += " <a href='#' onclick='$(\"#controls a[href=#add-block]\").click();return false'>Nuevo fotograma</a>";
			var msg = "<strong>¡Fotograma creado!</strong>";
			if (iAdmin.globals.mode=="edit") msg = "<strong>¡Cambios guardados!</strong>";
			$("#"+type+"-block-msg").hide().html("<p>"+msg+links+"</p>").fadeIn();
		},
		edit : function(order){
			
			// Change the mode
			iAdmin.changeMode("edit");	

			// Reset the form
			iAdmin.resetForm();			
			
			// Get the slide, type, etc.
			var slide = InteractiveVideo.slides[order];
			var type = slide.type;
			
			// Add the time options to the right form
			iAdmin.timeOptions.init("#"+type+"-block");
			
			// Save the current slide in globals
			iAdmin.globals.currentSlide = order;
			
			// Hide the table and show the right form
				// Form
				$(".block-type").hide();
				$("#"+type+"-block").show();
				// Tab
				$("#edit-block").hide();
				$("#block-types a").each(function(){
					var e = $(this);
					if (e.attr("href")=="#"+type+"-block") {
						e.addClass("current");
						iAdmin.typeTip.html(e.text());
					} else {
						e.removeClass("current");
					}
				});	
				// Show the block
				$("#add-block").fadeIn();

			// Load the values to edit
			
			// Start time
			var start = slide.startTime;
			$("#from-in-seconds").val(start);
				// hh:mm:ss
				var startInHHMMSS = iAdmin.timeOptions.secondsToHHMMSS(start);
				startInHHMMSS = startInHHMMSS.split(":");
				$("#from-hh").val(startInHHMMSS[0]);
				$("#from-mm").val(startInHHMMSS[1]);
				$("#from-ss").val(startInHHMMSS[2]);
				
			// Start time
			var autoStop = $("#auto-stop");
			var to = $("#to");
			var toHH = $("#to-hh");
			var toMM = $("#to-mm");
			var toSS = $("#to-ss");
			var toInSeconds = $("#to-in-seconds");
			
				// Default values (hidden and 00:00:00)
				autoStop.prop("checked","checked");
				to.hide();
				toMM.val("00");
				toMM.val("00");
				toMM.val("00");
				toInSeconds.val(0);
				
				// It the slide has end time
				if (slide.endTime) {
					autoStop.prop("checked",false);
					to.show();	
					toInSeconds.val(slide.endTime);
					var endInHHMMSS = iAdmin.timeOptions.secondsToHHMMSS(slide.endTime);
					endInHHMMSS = endInHHMMSS.split(":");
					$("#to-hh").val(endInHHMMSS[0]);
					$("#to-mm").val(endInHHMMSS[1]);
					$("#to-ss").val(endInHHMMSS[2]);					
				}
			
			var end = slide.endTime;
			$("#from-in-seconds").val(start);
				// hh:mm:ss
				var startInHHMMSS = iAdmin.timeOptions.secondsToHHMMSS(start);
				startInHHMMSS = startInHHMMSS.split(":");
				$("#from-hh").val(startInHHMMSS[0]);
				$("#from-mm").val(startInHHMMSS[1]);
				$("#from-ss").val(startInHHMMSS[2]);
				
			
			// Edit text
			if (type=="text") {
				tinyMCE.get('text-block-content').setContent(slide.text);
			}
			
			// Edit image
			else if (type=="image") {
				$("#image-page-url").val(slide.url);
				iAdmin.imageList.previewImage(slide.url);
				iAdmin.tabs.show(document.getElementById("image-first-tab"),"image",true);
				$("#image-alt").val(slide.description);
			}
			
			// Edit single choice or multiple choice
			else if (type=="singleChoice" || type=="multipleChoice") {
				// Question
				tinyMCE.get(type+'-question').setContent(slide.question);
				// Answer
				var answers = slide.answers;
				for (var i=0;i<answers.length;i++) {
					$("#"+type+"-answer-"+(i+1)).val(answers[i][0]);
					var field = $("#"+type+"-answer-"+(i+1)+"-right");
					if (answers[i][1]==1) field.prop("checked","checked");
					else if (type=="multipleChoice") field.prop("checked",false);
				}
			}

			// Edit dropdown activity
			else if (type=="dropdown") {
				// Text
				tinyMCE.get('dropdown-question').setContent(slide.text);
				// Additional options
				var moreWords = slide.additionalWords;
				for (var i=0;i<moreWords.length;i++) {
					$("#dropdown-answer-"+(i+1)).val(moreWords[i]);
				}				
			}

			// Edit cloze activity
			else if (type=="cloze") {
				// Text
				tinyMCE.get('cloze-question').setContent(slide.text);
			}

			// Edit match elements activity
			else if (type=="matchElements") {
				// Text
				tinyMCE.get('matchElements-question').setContent(slide.text);
				// Pairs
				var pairs = slide.pairs;
				for (var i=0;i<pairs.length;i++) {
					var pair = pairs[i];
					$("#matchElements-answer-"+(i+1)+"A").val(pair[0]);
					$("#matchElements-answer-"+(i+1)+"B").val(pair[1]);
				}				
			}

			// Edit sortable list
			else if (type=="sortableList") {
				// Text
				tinyMCE.get('sortableList-question').setContent(slide.text);
				// Items
				var items = slide.items;
				for (var i=0;i<items.length;i++) {
					$("#sortableList-answer-"+(i+1)).val(items[i]);
				}				
			}			
			
		}
	},
	msg : {
		init : function(){
			iAdmin.message = $("#messages");
			iAdmin.messageLink = $("#messages-link");
			iAdmin.content = $("#content");
		},
		txt : function(txt,showButton){
			var tag = "p";
			if (txt.indexOf("<p>")==0) tag = "div";
			txt = '<'+tag+' class="txt">'+txt+'</'+tag+'>';
			iAdmin.content.hide();
			var exitButton = '<p class="buttons"><input type="button" id="msg-accept" value="Aceptar" onclick="iAdmin.msg.hide()" /></p>';
			if (showButton==false) exitButton = "";
			iAdmin.message.html(txt+exitButton).show();
			iAdmin.messageLink.focus();
		},
		ask : function(txt,fn) {
			iAdmin.msg.fn = fn;
			iAdmin.content.hide();
			iAdmin.message.html('<p class="txt">'+txt+'</p><p class="buttons"><input type="button" id="msg-deny" value="Cancelar" onclick="iAdmin.msg.hide()" /> <input type="button" id="msg-accept" value="OK" onclick="iAdmin.msg.go()" /></p>').show();
			iAdmin.messageLink.focus();
		},
		promt : function(txt,fn){
			iAdmin.msg.fn = fn;
			iAdmin.content.hide();
			iAdmin.message.html('<p class="txt"><label for="msg-promt">'+txt+'</label></p><p><input type="text" id="msg-promt" /></p><p class="buttons"><input type="button" id="msg-deny" value="Cancelar" onclick="iAdmin.msg.hide()" /> <input type="button" id="msg-accept" value="OK" onclick="iAdmin.msg.go()" /></p>').show();
			// $("#msg-promt").focus();
			iAdmin.messageLink.focus();
		},
		hide : function(){
			iAdmin.message.html("").hide();
			iAdmin.content.show();
		},
		go : function(){
			iAdmin.msg.fn();
		}
	},
	showFrontPage : function(){
		var e = $("#frontpage-link");
		this.controls.removeClass("current");
		e.addClass("current");
		$(".admin-block").hide();
		this.tipCurrentTitle = e.attr("title");
		this.tip.html(this.tipCurrentTitle);
		this.msg.hide();
		$("#frontpage-block").fadeIn();	
	},	
	actions : {
		del : function(){
			iAdmin.msg.ask("¿Eliminar definitivamente el contenido? El vídeo no será eliminado.",
				function(){
					toDo("To do. Eliminar.");
					// Hide all the links but the Exit one
					$("#actions li").each(function(){
						if (this.className!="exit") $(this).hide();
					});
					// Put the link description in the right place
					$("#actions-desc").css("right","95px");
					// Show a success message
					iAdmin.msg.txt("<p>Contenido <strong>eliminado</strong>.</p><p>Puedes cerrar el Editor.</p>",false);
				}
			);
		},
		reloadOriginal : function(){
			toDo("To do. Recargar el original.");
			window.location.reload();
		},
		saveAs : function(){
			iAdmin.msg.promt("Guardar como...",
				function(){
					var promt = $("#msg-promt");
					if (promt.val().length<3) {
						promt.val("Mínimo 3 caracteres");
						setTimeout(function(){
							$("#msg-promt").val("").focus();
						},1500);
						return false;
					}
					toDo("To do. Guardar como.");
					// Set the title
					$("#frontpage-title").val(promt.val());
					// Display a success message
					iAdmin.msg.txt('<p>Copia <strong>guardada</strong>.</p><p>Estás editando la nueva copia.</p><p class="buttons"><input type="button" id="msg-accept" value="Aceptar" onclick="iAdmin.showFrontPage()" /></p><p><a href="#" onclick="iAdmin.actions.reloadOriginal();return false;">Editar la original</a></p>',false);
				}
			);
		},
		preview : function(){
			window.open("../?mode=preview");
		},
		save : function(){
			var slides = InteractiveVideo.slides;
			// Remove all unnecessary values (results, etc.) added by the preview.
			for (var i=0;i<slides.length;i++) {
				delete slides[i].current;
				delete slides[i].results;
			}
			top.interactiveVideoEditor.activityToSave = InteractiveVideo;
			iAdmin.appMsg(_("Saved!") + " " + _('Click on "Exit" to finish.'));
		},	
		exit : function(){
			top.interactiveVideoEditor.win.close();
		}		
	},
	tabs : {
		init : function(block) {
			$("#"+block+"-tabs a").click(function(){
				iAdmin.tabs.show(this,block);
				return false;
			});
		},
		show : function(lnk,block){
			// Show the selected tab
			$("#"+block+"-tabs a").removeClass("current");
			$(lnk).addClass("current");
			$("."+block+"-tab-content").hide();
			var href = $(lnk).attr("href");
			$(href).fadeIn();
			// Show the user's images
			if (href=="#image-b") {
				iAdmin.imageList.init();
			}
		},
		restart : function(block,showTheFirstTab){
			// Show the first tab
			if (showTheFirstTab) {
				$("#"+block+"-tabs a").each(function(i){
					if (i==0) $(this).addClass("current");
					else $(this).removeClass("current");
				});
				$("."+block+"-tab-content").each(function(i){
					if (i==0) $(this).show();
					else $(this).hide();
				});
			}
			// Clear the forms
			var f = $("#"+block+"-block");
			$("input[type=text]",f).val("");
			// Hide the preview (see #image-page-url)
			iAdmin.imageList.previewImage("");
			$("input[type=radio]",f).prop("checked",false);
			$(".answers input[type=checkbox]",f).prop("checked",false);
			if (document.getElementById(block+'-question')) tinyMCE.get(block+'-question').setContent("");
		}
	},
	imageList : {
		init : function(){
			var userImages = $("#userImages");
			if (userImages.html()=="") {
				var imgsHTML = "<p>Aún <strong>no has subido ninguna imagen</strong> pública a la Mediateca.</p>";
				imgsHTML += "<p>Puedes usar las imágenes de otros usuarios, pero si las borran desaparecerán de tu contenido.</p>";
				var imgs = iAdmin.userImages;
				var l = imgs.length;
				var k;
				if (l>0) {
					imgsHTML = "<p>Pincha en la imagen para seleccionarla.</p>";
					imgsHTML += "<ul>";
					for (var i=0;i<l;i++) {
						imgsHTML += "<li><a href='http://mediateca.educa.madrid.org/imagen/"+imgs[i][0]+"' title="+imgs[i][0]+" class='exe-tooltip' onclick='iAdmin.imageList.showImage(this);return false'><span><img src='http://mediateca.educa.madrid.org/imagen.php?m=1&amp;type=2&amp;id="+imgs[i][0]+"' width='80' height='80' alt='' /></span></a></li>";
					}
					imgsHTML += "</ul>";
				}
				userImages.html(imgsHTML);
				iAdmin.tooltips.init("/scripts/exe_tooltips/");
			}
		},
		previewImage : function(src){
			var html = "";
			// 2 different valid URLs
			if (src.indexOf("http://mediateca.educa.madrid.org/imagen/")==0 || src.indexOf("http://mediateca.educa.madrid.org/imagen.php?id=")==0) {
				src = src.replace("http://mediateca.educa.madrid.org/imagen/","http://mediateca.educa.madrid.org/imagen.php?m=1&type=2&id=");
				// Just the thumbnail, not the big image
				src = src.replace("m=550","m=1");
				html = '<img src="'+src+'" alt="" width="80" height="80" />';
			}
			$("#selected-image").html(html);
		},
		showImage : function(e) {
			$("#image-page-url").val(e.href);
			iAdmin.tabs.show(document.getElementById("image-first-tab"),"image",true);
			iAdmin.imageList.previewImage(e.href);
		}
	},
	editors : {
		init : function(){
			$("textarea").each(function(){
				iAdmin.editors.enable(this.id);
			});
		},
		enable : function(id) {
			var strikethrough = "";
			// Dropdown and cloze will have the strikethrough button
			if (id=="dropdown-question" || id=="cloze-question") strikethrough = ' strikethrough';
			var buttons = 'undo redo | bold italic'+strikethrough+' | alignleft aligncenter | bullist numlist | link | code';
			tinymce.init({
				selector: '#'+id,
				height: 80,
				language: "all",
				width: 440,
				plugins: [
				'lists link code paste'
				],
				paste_as_text: true,
				browser_spellcheck: true,
				entity_encoding: "raw",
				toolbar: buttons,
				menubar:false,
				statusbar: false,
				content_css: "http://gros.es/tests/mediateca/interaccion/gestion/css/tinymce.css"
			});	
		}		
	},
	// Tooltips
	tooltips : {
		className : "exe-tooltip",
		init : function(path){
			this.path = path;
			this.viewport = $(window);
			var as = $("A."+iAdmin.tooltips.className);
			if (as.length>0) {
				this.links = as;
				this.loadCSS();
				this.loadJS();
			}
		},
		loadCSS : function() {
			// The callback function won't work with CSS files in Safari
			loadScript(this.path+"jquery.qtip.min.css");
		},
		loadJS : function(file) {
			loadScript(this.path+"jquery.qtip.min.js","iAdmin.tooltips.loadImageLoader()");
		},
		loadImageLoader : function(){
			loadScript(this.path+"imagesloaded.pkg.min.js","iAdmin.tooltips.run()");
		},
		run : function() {
			this.links.each(function(){
				var a = this;
				var c = this.className.replace(iAdmin.tooltips.className+" ","");
				$(this).qtip({
					position : {
						viewport : iAdmin.tooltips.viewport
					},
					content : {
						title : "",
						text : this.title
					},
					style : {
						classes : "qtip-light qtip-rounded qtip-shadow"
					}					
				});
			});
		}
	}	
}

function enableVideoPlayer(video, image, h, w) {
	jwplayer.key = 'XnH21IkIBjAQp06byW5kPeU1Eq1vLpjEllpVdA==';
    jwplayer("player").setup({
        sources: [{
            file: "http://mediateca.educa.madrid.org/streaming.php?id="+video,
            label: "480p",
            type: "mp4",
            provider: "http",
            startparam: "start"
        }],
        image: image,
        abouttext: "Mediateca",
        aboutlink: "http://mediateca.educa.madrid.org/video/"+video,
        controls: true,
        height: h,
        width: w
    });
	// jwplayer().onPause(function(e){
		// iAdmin.video.getPosition();
	// });	
	jwplayer().onPlay(function(){
		// iAdmin.video.hasPlayed = true;
		setTimeout(function(){
			iAdmin.video.duration=parseInt(jwplayer().getDuration());
		},1000);
	});	
}

function loadScript(url, callback){
	var script;
	var isCSS = false;
	if (url.split('.').pop()=="css") {
		isCSS = true;
		script = document.createElement("link")
		script.type = "text/css";
		script.rel = "stylesheet";
		script.href = url;	
	} else {
		script = document.createElement("script")
		script.type = "text/javascript";
		script.src = url;
	}
    if (script.readyState){  //IE
        script.onreadystatechange = function(){
            if (script.readyState == "loaded" ||
                    script.readyState == "complete"){
                script.onreadystatechange = null;
                if (callback) eval(callback);
            }
        };
    } else {  //Others
        script.onload = function(){
            if (callback) eval(callback);
        };
    }
    
    document.getElementsByTagName("head")[0].appendChild(script);
	
	//Capturing the load event on LINK (Safari)
	var isSafari = false;
	var ua = navigator.userAgent.toLowerCase(); 
	if (ua.indexOf('safari')!= -1 && ua.indexOf('chrome')==-1) isSafari = true;	
	if (isCSS && isSafari && callback) {
		if (typeof(loadScriptCounter)=='undefined') loadScriptCounter = 0;
		loadScriptCounter ++;
		window['loadScriptControler'+loadScriptCounter] = document.createElement('img');
		window['loadScriptControler'+loadScriptCounter].onerror = function() {
			eval(callback);
		}
		window['loadScriptControler'+loadScriptCounter].src = url;		
	}	
}