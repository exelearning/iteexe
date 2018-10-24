/**
 * Interactive Video iDevice
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Ignacio Gros (http://gros.es/) for http://exelearning.net/
 *
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 *
 * Loading icon generated with http://www.ajaxload.info/
 */
 
var interaction = {
	debug : true,
	encrypt : false,
	isPreview : false,
	isSeek : false,
	baseId : "interaction",
	isInExe : false,
	mediaElementReady : false,
	typeNames : {
		text : "Texto",
		image : "Imagen",
		singleChoice : "Respuesta única",
		multipleChoice : "Respuesta múltiple",
		dropdown : "Desplegable",
		cloze : "Rellenar huecos",
		matchElements : "Emparejado",
		sortableList : "Lista desordenada"
	},
	i18n : function(str) {
		
		return str;
		
	},	
	inIframe : function() {
		try {
			return window.self !== window.top;
		} catch (e) {
			return true;
		}
	},	
	cover : {
		hide : function(play){
			$("BODY").removeClass("cover-on");
			if (play) interaction.controls.play();
		},
		show : function(action){
			interaction.controls.stop();
			$("BODY").addClass("cover-on");
			var txt = "Continuar";
			var play = false;
			if (action=="restart") {
				txt = "Empezar";
				play = true;
			}
			$("#start-link").text(txt).click(function(){
				interaction.cover.hide(play);
				return false;
			});
		}
	},
	randomizeArray : function(o){
		var original = [];
		for (var w=0;w<o.length;w++) original.push(o[w]);
		for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		var hasChanged = false;
		for (var y=0;y<o.length;y++){
			if (!hasChanged && original[y]!=o[y]) hasChanged = true;
		}
		if (hasChanged) return o;
		else return this.randomizeArray(original);
	},	
	// Base64 Decode
	// Base64 code from Tyler Akins -- http://rumkin.com	
	decode64 : function(e) {
		var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		var n = "";
		var r, i, s;
		var o, u, a, f;
		var l = 0;
		// Remove all characters that are not A-Z, a-z, 0-9, +, /, or =
		e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		do {
			o = t.indexOf(e.charAt(l++));
			u = t.indexOf(e.charAt(l++));
			a = t.indexOf(e.charAt(l++));
			f = t.indexOf(e.charAt(l++));
			r = o << 2 | u >> 4;
			i = (u & 15) << 4 | a >> 2;
			s = (a & 3) << 6 | f;
			n = n + String.fromCharCode(r);
			if (a != 64) {
				n = n + String.fromCharCode(i)
			}
			if (f != 64) {
				n = n + String.fromCharCode(s)
			}
		} while (l < e.length);
		return n
	},	
	externalLinks : function(id){
		$("#"+id+" A").each(function(){
			if (this.target!="_blank") {
				this.innerHTML += "<img src='http://mediateca.educa.madrid.org/images/icons/external_link.gif' width='13' height='10' alt='Ventana nueva' class='external-icon' />";
				this.onclick = function(){
					window.open(this.href);
					return false;
				}
				if (this.title=="") this.title = "Ventana nueva";
				else this.title += " (ventana nueva)";
				$(this).addClass("external-link");
			}
		});
	},
	controls : {
		play : function(){
			if (interaction.type=="mediateca") {
				if (typeof(jwplayer)=='undefined') return;
				jwplayer().play();
			}
			else if (interaction.type=="youtube") {
				interaction.player.playVideo();
			}
			else if (interaction.type=="local") {
				if (interaction.mediaElementReady==false) {
					interaction.mediaElementVideo = $("#player video");
					interaction.mediaElementVideo.mediaelementplayer();
					interaction.mediaElementReady = true;
					setTimeout(function(){
						interaction.mediaElementVideo[0].play();
						interaction.ready();
						interaction.hasPlayed = true;
					},500);
				} else {
					interaction.mediaElementVideo[0].play();
				}
			}
		},
		stop : function(){
			if (interaction.type=="mediateca") jwplayer().stop();
			else if (interaction.type=="youtube") interaction.player.pauseVideo();
			else if (interaction.type=="local") interaction.mediaElementVideo[0].pause();
		},
		pause : function(){
			if (interaction.type=="mediateca") jwplayer().pause(true);
			else if (interaction.type=="youtube") interaction.player.pauseVideo();
			else if (interaction.type=="local") interaction.mediaElementVideo[0].pause();
		},
		seek : function(sec){
			if (interaction.type=="mediateca") {
				jwplayer().seek(sec);
			} else if (interaction.type=="youtube") {
				interaction.player.seekTo(sec);
				interaction.player.pauseVideo();
				interaction.track(sec);
			} else if (interaction.type=="local") {
				interaction.mediaElementVideo[0].setCurrentTime(sec);
			}
		}
	},
	restart : function(){
		if (confirm("\u00BFBorrar tus resultados y empezar de nuevo?")) {
			var questions = InteractiveVideo.slides;
			for (var i=0;i<questions.length;i++){
				questions[i].results = null;
			}
			interaction.resultsViewer.create();
			$("BODY").removeClass("activity-completed");
			// if (InteractiveVideo.cover) 
			interaction.cover.show("restart");
		}
	},
	getTypeAndId : function(){
		
		var w = $("#exe-interactive-video-file");
		
		var as = $("a",w);
		
		if (as.length==1) {
			var ref = as.eq(0).attr("href");
			// Mediateca (EducaMadrid)
			if (ref.indexOf("https://mediateca.educa.madrid.org/video/")==0) {
				this.type = 'mediateca';
				this.id = ref.split("https://mediateca.educa.madrid.org/video/")[1].split("?")[0];
				return;
			}
			// Youtube
			else if (ref.indexOf("//youtu.be/")>-1 || ref.indexOf("//www.youtube.com")>-1) {
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
				var id = youtube_parser(ref);
				if (!id) {
					alert("Error (no se pudo recuperar el ID del vídeo de Youtube)");
					return false;
				}
				this.id = id;
				this.type = 'youtube';
				return;
			}
			// Local
			else if (ref.indexOf("resources/")==0 || (ref.indexOf("http")!=0 && ref.indexOf("//")!=0)) {
				this.file = ref;
				this.type = 'local';
				return;
			}
			alert("Error (código imcompatible con el proveedor)");
		}
		
	},
	init : function(){
		
		// Create the required HTML elements:
		
		var es = $(".exe-interactive-video");
		
		if (es.length==0) return;
		
		if (es.length>1) {
			alert("Error (sólo puede haber un vídeo interactivo por página)");
			return false;
		}
		
		es = es.eq(0);
		
		var html = '\
			<div id="activity-wrapper">\
			<div id="activity">\
				<div id="player" style="width:448px;height:356px"></div>\
				<div id="slide"></div>\
			</div>\
			<div class="js-required">\
				<h2 id="activity-results-toggler"><a href="#activity-results" onclick="interaction.resultsViewer.toggle(this);return false" class="show">Resultados</a></h2>\
				<div id="activity-results" style="display:none"></div>\
			</div>\
		';
		
		if (typeof($exeAuthoring)!='undefined') this.isInExe = true;
		
		// es.html(es.html()+html);
		es[0].innerHTML += html;
		
		if (this.encrypt && !this.isPreview) eval(interaction.decode64(InteractiveVideo));
		
		if (typeof(InteractiveVideo)=="undefined" || typeof(InteractiveVideo.slides)=="undefined" || InteractiveVideo.slides.length==0) {
			$("#player").html("<p style='text-align:center;margin:0;line-height:356px'>La actividad no tiene fotogramas.</p>");
			$("#activity-results-toggler").hide();
			return false;
		}
		
		try {
			document.createEvent("TouchEvent");
			$("BODY").addClass("is-mobile");
		} catch(e) { }
		
		$(window).on('beforeunload', function(){
			// To review: return '¿Abandonar la página?';
		});
		
		if (this.inIframe()) $("body").removeClass("full-screen");
		
		this.getTypeAndId();
		
		this.hasResults = false;

		if (window.location.href.indexOf("?results=0")==-1 && !this.isPreview) {
			
			// In this case the results are not part of the activity
			if (typeof(InteractiveVideoResults)!="undefined") {
				if (InteractiveVideoResults.length == InteractiveVideo.slides.length) {
					for (var i=0;i<InteractiveVideo.slides.length;i++) {
						InteractiveVideo.slides[i].results = InteractiveVideoResults[i];
					}
					this.hasResults = true;
				} else {
					alert("Error (respuestas desvinculadas de la actividad).");
					return false;
				}
			}
			
		} else {
			// Make sure that you delete all the results so you can save the new values
			for (var i=0;i<InteractiveVideo.slides.length;i++) {
				InteractiveVideo.slides[i].results = null;
			}
		}
		
		
		$("BODY").addClass("cover-on");
		var play = '<p id="start-activity">';
		var playContent = '<a href="#" onclick="interaction.cover.hide(true);return false" id="start-link">Empezar</a>';
		var resetContent = '<a href="#" onclick="interaction.cover.hide(true);return false" id="reset-link" style="display:none">Empezar de nuevo</a>'
		if (this.hasResults && !this.isPreview) playContent = '<a href="#" onclick="interaction.cover.hide(true);return false" id="start-link">Ver con mis resultados</a>';
		play = play+playContent+"</p>";
		// var cover = "<h2>"+$("#activity-title").html()+"</h2>";
		var cover = "";
		var videoTitle = "...";
		if (InteractiveVideo.title) videoTitle = InteractiveVideo.title;
		else {
			var iDeviceTitle = $(".interactive-videoIdevice .iDeviceTitle");
			if (iDeviceTitle.length>0) {
				iDeviceTitle = iDeviceTitle.eq(0);
				if (iDeviceTitle.html()!="&nbsp;" && iDeviceTitle.text().replace(/ /g,'')!="") {
					videoTitle = iDeviceTitle.text();
				}
			}
		}
		if (!(InteractiveVideo.description && videoTitle=="...")) cover = "<h2>"+videoTitle+"</h2>";
		if (InteractiveVideo.description) cover += InteractiveVideo.description;
		$("#activity").prepend('<div id="activity-cover"><div id="activity-cover-logo"></div><div id="activity-cover-content">'+cover+'</div>'+play+'</div>');
		interaction.externalLinks("activity-cover-content");
		
		if (this.type=='mediateca') {
			
			$exe.loadScript("http://mediateca.educa.madrid.org/includes/player/7.6.1/jwplayer.js","interaction.ready()");
			return;
			
		}
		
		else if (this.type=='youtube') {
			
			onYouTubeIframeAPIReady = interaction.ready;
			// Load the IFrame Player API code asynchronously
			var tag = document.createElement('script');
				tag.src = "https://www.youtube.com/iframe_api";
			var firstScriptTag = document.getElementsByTagName('script')[0];
				firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
			
		}
		
		else if (this.type=='local') {
			
			$("#player").html('<video width="448" height="356" controls="controls"><source src="'+this.file+'" /></video>');
			
		}
		
		// interaction.ready();
		
	},
	enableJWPlayer : function(id, h, w){
		// if (inIframe()) h = checkVideoPlayerHeight(h);
		// var video = "mtdrp7s34zmc88je";
		jwplayer.key = 'XnH21IkIBjAQp06byW5kPeU1Eq1vLpjEllpVdA==';
		var img = 'http://mediateca.educa.madrid.org/imagen.php?id='+id+'&type=1&m=0';
		jwplayer("player").setup({
			sources: [{
				file: "http://mediateca.educa.madrid.org/streaming.php?id="+id,
				label: "480p",
				type: "mp4",
				provider: "http",
				startparam: "start"
			}],
			image: img,
			logo: {
				file: "http://mediateca.educa.madrid.org/images/player/educamadrid.png",
				link: "http://mediateca.educa.madrid.org/video/"+id,
				hide: true
			},
			abouttext: "Mediateca",
			aboutlink: "http://mediateca.educa.madrid.org/ayuda.php",
			// controls: false,
			height: h,
			width: w,
			sharing: {
				heading: "Comparte este v\u00EDdeo",
				code: encodeURI('<iframe src="http://mediateca.educa.madrid.org/video/'+id+'/fs" width="420" height="315" frameborder="0" scrolling="no" allowfullscreen></iframe>'),
				link: 'http://mediateca.educa.madrid.org/video/'+id
			}
		});
	},
	checkSlides : function(){
		if (interaction.isSeek) {
			if ($("BODY").hasClass("active")) {
				// Check if it has endTime
				var slide = $("#slide");
				var c = slide.attr("class");
				if (c=="image" || c=="text") { 
					if(!InteractiveVideo.slides[interaction.visibleSlide].endTime) {
						interaction.slide.hide('case 1');
					}
				} else {
					// setTimeout(function(){
						// interaction.slide.hide('case 2');
					// },100);
				}
			}
		}
		interaction.isSeek = false;
	},
	ready : function() {
		
		interaction.orderSlides();
		
		if (this.type=="mediateca") {
		
			// Enlable the player and track the video
			interaction.enableJWPlayer(this.id,'356','448');
			
			jwplayer().onTime(function(e){
				interaction.track(e.position);
			});
			
			// If the video is playing, the slides should be hidden
			jwplayer().onPlay(function(){
				interaction.hasPlayed = true;
				interaction.checkSlides();
			});
			
			interaction.complete();
		
		}
		
		else if (interaction.type=="youtube") {
			
			interaction.player = new YT.Player('player', {
				height: '356',
				width: '448',
				videoId: interaction.id,
				events: {
					'onReady': function(){
						interaction.complete();
					},
					'onStateChange': function(e){
						interaction.hasPlayed = true;
						interaction.youtubeCounter = setInterval(function(){
							interaction.track(interaction.player.getCurrentTime());
						},500);
						interaction.checkSlides();
					}
				}
			});		
			
		}
		
		else if (interaction.type=="local") {
			
			interaction.complete();
			
			interaction.mediaElementVideo[0].addEventListener('playing', function (e) {
				interaction.youtubeCounter = setInterval(function(){
					interaction.track(interaction.mediaElementVideo[0].currentTime);
				},500);
				interaction.checkSlides();
			});			
			
		}
		
	},
	complete : function(){
		// Create the results viewer
		interaction.resultsViewer.create();
		// Set the max-width
		$(window).load(function(){
			interaction.setMaxWidth();
		}).resize(function(){
			interaction.setMaxWidth();
		});		
	},
	setMaxWidth : function(){
		var w = $("#activity-wrapper").width();
		$("#player").css("max-width",(w/2)+"px");
	},
	orderSlides : function(){
		var sortable = [];
		for (var slide in InteractiveVideo.slides) {
			sortable.push([interaction.secondsToHour(InteractiveVideo.slides[slide].startTime), InteractiveVideo.slides[slide]])
		}
		sortable.sort();
		var sorted = [];
		for (var i in sortable) {
			sorted.push(sortable[i][1]);
		}
		InteractiveVideo.slides = sorted;
	},
	secondsToHour : function(totalSec) {
		var hours = parseInt( totalSec / 3600 ) % 24;
		var minutes = parseInt( totalSec / 60 ) % 60;
		var seconds = totalSec % 60;
		return (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
	},
	resultsViewer : {
		create : function(){
			var html = "";
			// var cover = "";
			// if (InteractiveVideo.cover) {
			var cover = '\
					<tr class="odd">\
						<td>&nbsp;</td>\
						<td><a href="#" onclick="interaction.cover.show();return false">Portada</a> </td>\
						<td>&nbsp;</td>\
						<td>&nbsp;</td>\
					</tr>';
			// }
			var questions = InteractiveVideo.slides;
			for (var i=0; i<questions.length; i++) {
				var e = questions[i];
				var title = title = "Actividad - "+interaction.typeNames[e.type];
				if (e.type=="image" || e.type=="text") title = "Información - "+interaction.typeNames[e.type];
				var result = "-";
				if (!interaction.isPreview && interaction.hasResults && e.results) {
					if (e.type=="singleChoice" || e.type=="multipleChoice" || e.type=="dropdown" || e.type=="cloze" || e.type=="matchElements" || e.type=="sortableList") result = interaction.formatResult(e.results.score)+"%";
					else if (e.results.viewed==1) result = "Vista";
				}
				var k = "odd";
				if (i%2==0) k = "even";				
				html += '\
					<tr class="'+k+'">\
						<td class="order"><span>'+(i+1)+'</span> </td>\
						<td class="question"><a href="#" onclick="interaction.seek('+i+');return false">'+title+'</a> </td>\
						<td><a href="#" onclick="interaction.seek('+i+');return false">'+interaction.secondsToHour(e.startTime)+'</a> </td>\
						<td class="result"><span>'+result+'</span> </td>\
					</tr>';
			}
			if (html!="") {
				html += '\
				<tr>\
					<th colspan="3" id="resultsSummaryTH"><span class="title">Total <em>(debes ver <span class="full-version">todas </span>las diapositivas y contestar <span class="full-version">todas </span>las preguntas)</em></span> </th>\
					<td id="resultsSummary"><span>-</span> </td>\
				</tr>';
				html = '\
				<table>\
				<colgroup>\
					<col width="5%">\
					<col width="60%">\
					<col width="20%">\
					<col width="15%">\
				</colgroup>\
				<tr>\
					<th><span class="title">&nbsp;</span></th>\
					<th><span class="title">Diapositiva</span> </th>\
					<th><span class="title">Minuto</span> </th>\
					<th><span class="title">Puntuación</span> </th>\
				</tr>'+cover+html+'</table>';
				$("#activity-results").html(html);
				interaction.table = $("#activity-results");
				var tds = $(".result",interaction.table);
				interaction.resultsViewer.getFinalResult(tds);
			}
		},
		getFinalResult : function(tds){
			var complete = true;
			var result = 0;
			var counter = 0;
			tds.each(
				function(){
					var t = $(this).text();
					if (t=="- ") complete = false;
					if (t.indexOf("%")!=-1) {
						result += parseFloat(t);
						counter ++;
					} else if (t=="Vista") {
						result += 100;
						counter ++;
					}
				}
			);
			if (complete) {
				$("#resultsSummary").html("<span>"+interaction.formatResult((result/counter).toFixed(2))+"%</span>");
				$("BODY").addClass("activity-completed");
			}			
		},
		toggle : function(e){
			if (interaction.isWorking) return false;
			interaction.isWorking = true;
			var block = $("#activity-results");
			if (e.className=="show") {
				block.fadeIn(500,function(){
					e.className = "hide";
					interaction.isWorking = false;
				});
			} else {
				block.fadeOut(500,function(){
					e.className = "show";
					interaction.isWorking = false;
				});				
			}
		}		
	},
	msg : function(type,txt,formId,rightAnswer){
		var msg = '<div class="msg '+type+'-msg"><p>'+txt+'</p></div>';
		if (rightAnswer) msg += rightAnswer;
		$("#"+formId+"Message").html(msg);
	},
	seek : function(order){
		if (interaction.visibleSlide==order && $("BODY").hasClass("active")) {
			if (this.debug) alert("This is the current slide: "+order);
			return false;
		}
		interaction.isSeek = true;
		if (interaction.hasPlayed!=true) {
			if (this.debug) alert("The video has not been played.");
			interaction.controls.seek(InteractiveVideo.slides[order].startTime-1);
		} else {
			interaction.controls.seek(InteractiveVideo.slides[order].startTime);
		}
	},
	isFullScreen : function(){
		if (this.type=='mediateca' && jwplayer().getFullscreen()) return true;
		else if (this.type=='youtube' && $("iframe").width()==$(window).width()) return true;
		return false;
	},	
	slide : {
		enable : function(slide,e,order) {

			var html = "";
			var id = interaction.baseId;
			var i;
			
			// Text
			if (e.type=="text") {
				slide.html(e.text);
				interaction.externalLinks("slide");
				for (var i=0; i<InteractiveVideo.slides.length; i++) {
					if (e==InteractiveVideo.slides[i]) {
						interaction.updateResult(i,"Vista");
						e.results = {
							viewed : true
						};
					}
				}				
			
			// Image
			} else if (e.type=="image") {
				var img = new Image() ;
				if (e.url.indexOf('://mediateca.educa.madrid.org/imagen/')>-1) img.src = e.url.replace("http://mediateca.educa.madrid.org/imagen/","https://mediateca.educa.madrid.org/imagen.php?id=")+"&type=2&m=550";
				else img.src = e.url;
				img.onload = function() {
					slide.html(interaction.getImage(e,img.width,img.height));
					for (var i=0; i<InteractiveVideo.slides.length; i++) {
						if (e==InteractiveVideo.slides[i]) {
							interaction.updateResult(i,"Vista");
							e.results = {
								viewed : true
							};
						}
					}
				}
			
			// Single choice
			} else if (e.type=="singleChoice") {
				interaction.singleChoice.create(slide,id,order,e);
				
			// Multiple choice
			} else if (e.type=="multipleChoice") {
				interaction.multipleChoice.create(slide,id,order,e);
			
			// Dropdown
			} else if (e.type=="dropdown") {
				interaction.dropdownActivity.create(slide,id,order,e);

			// Cloze
			} else if (e.type=="cloze") {
				interaction.clozeActivity.create(slide,id,order,e);
			
			// Match elements
			} else if (e.type=="matchElements") {
				interaction.matchElements.create(slide,id,order,e);

			// Unsorted list
			} else if (e.type=="sortableList") {
				interaction.sortableList.create(slide,id,order,e);
			}				
			
			$("BODY").addClass("active");
			$("#slide").before('<a href="#slide" id="slide-link" class="sr-av">Inicio de la diapositiva</a>');
			$("#slide-link").focus();			
		},
		show : function(e,order) { // e = the object
			e.current = true;
			interaction.visibleSlide = order;
			if (interaction.isFullScreen()) {
				interaction.controls.pause();
				alert("Hay información adicional. Cierra la pantalla completa para verla (tecla Esc).");
			}
			if (!e.endTime) interaction.controls.pause();

			var slide = $("#slide");
			slide.html("");
			slide.attr("class",e.type);
			
			if ($("BODY").hasClass("active") || interaction.isSeek) {
				$("#activity").css("width","100%");
				interaction.slide.enable(slide,e,order);
			} else {
				$("#player").css("margin-left",0);
				$("#activity").css("width","100%");
				interaction.slide.enable(slide,e,order);
			}
			
		},
		hide : function(trigger){
			interaction.visibleSlide = "";
			$("#activity").css("width","50%");
			$("BODY").removeClass("active");
		}
	},
	formatResult : function(result) {
		return result.toString().replace(".00","").replace(".",",");
	},
	updateResult : function(question,result) {
		var tds = $(".result",interaction.table);
		tds.eq(question).html("<span>"+result+"</span>");
		interaction.resultsViewer.getFinalResult(tds);
	},	
	dropdownActivity : {
		create : function(slide,id,order,e) {
			var html = interaction.getForm.header(id,order,'dropdownActivity');			
			html += '<p class="question">'+e.text+'</p>';
			html += '<p class="actions">';
				html += interaction.getForm.sendButton(id,order,'dropdownActivity');
			html += '</p>';
			html += '<div id="'+id+'dropdownActivityFormMessage">';
			html += '</div>';
			html += interaction.getForm.footer();
			slide.html(html);
			// Options
			var opts = [];			
			var spans = $("SPAN","#"+id+"dropdownActivityForm");
			var rightAnswers = [];
			spans.each(
				function(i){
					if(this.style.textDecoration=='line-through') {
						var t = $(this).text();
						opts.push(t);
						rightAnswers.push(t);
						$(this).hide().attr("id","right-answer-"+id+"-"+i);
					}
				}
			);
			// Add more words
			if (e.additionalWords) {
				for (var z=0;z<e.additionalWords.length;z++) {
					opts.push(e.additionalWords[z]);
				}
			}
			//Create the select:
			var newV = interaction.randomizeArray(opts);
			var newOptions = '<option value=""> </option>';
			for (var x=0;x<newV.length;x++){
				var val = newV[x];
				var h = '<option value="'+val+'">'+val+'</option>';
				newOptions += h;
			}
			//Add the selects:
			spans.each(
				function(i){
					if(this.style.textDecoration=='line-through') {
						var sel = $('<select id="answer-'+id+'-'+i+'" name="answer-'+id+'-'+i+'">'+newOptions+'</select>');
						$(this).before(sel);
					}
				}
			);
			var activityForm = $("#"+id+"dropdownActivityForm");
			activityForm.show();
			
			//Show the previous results
			var currentQuestion = InteractiveVideo.slides[order];
			if (currentQuestion.results) {
				activityForm.addClass("disabled");
				if (currentQuestion.results.score==100) {
					interaction.msg("success","¡Correcto!",id+"dropdownActivityForm");
				} else {
					interaction.msg("error","No es correcto",id+"dropdownActivityForm",interaction.dropdownActivity.getRightAnswer(rightAnswers));
				}
				var selectedValues = currentQuestion.results.selectedValues;
				var selectFields = $("SELECT",activityForm);
				for (var w=0;w<selectedValues.length;w++) {
					selectFields.eq(w).val(selectedValues[w]).attr("disabled","disabled");
					if (selectedValues[w]!=spans.eq(w).text()) selectFields.eq(w).attr("class","field-with-error");
				}			
			}			
			
		},
		saveResults : function(question,result,slide,selectedValues){
			var currentQuestion = InteractiveVideo.slides[question];
			if (!currentQuestion.results) {
				currentQuestion.results = {
					score : result,
					selectedValues : selectedValues
				};
			}
			result = interaction.formatResult(result);
			interaction.updateResult(question,result+"%");			
		},
		getRightAnswer : function(rightAnswers) {
			var rightAnswer = "";
			for (var i=0;i<rightAnswers.length;i++) {
				rightAnswer += "<li>"+rightAnswers[i]+"</li>";
			}
			if (rightAnswer!="") rightAnswer = "<ul>"+rightAnswer+"</ul>";
			return "<p><strong>Respuesta correcta: </strong>"+rightAnswer+"</p>";
		},
		validate : function(question,id) {
			
			var e = document.getElementById(id);
			
			var answers = e.getElementsByTagName("SELECT");
			var answered = true;
			var errors = false;
			var rightAnswers = [];
			var rightAnswered = 0;
			for (i=0;i<answers.length;i++) {
				if(typeof(answers[i].options)!='undefined') {
					var currFieldValue = answers[i].value;
					// Fill-in all the fields
					if (currFieldValue=='') answered = false;
					var currFieldId = answers[i].id;
					var rightAnswer = $("#right-"+currFieldId).text();
					var css = "";
					if(rightAnswer!=currFieldValue) {
						css = "field-with-error";
						errors = true;
					}
					else rightAnswered ++;
					answers[i].className=css;
				}				
			}
			// Get the right answers
			$("SPAN",e).each(
				function(i){
					if(this.style.textDecoration=='line-through') {
						rightAnswers.push($(this).text());
					}
				}
			);		
			
			if (!answered) {
				interaction.msg("info","Aún no has completado la actividad",e.id);
				return false;
			}
			
			var slide = $("#"+id);
			var selectedValues = [];
			slide.addClass("disabled");
			$("SELECT",slide).each(function(){
				selectedValues.push(this.value);
			}).attr("disabled","disabled");			
			if (errors) {
				var result = (rightAnswered*100/rightAnswers.length).toFixed(2);
				var extra = interaction.dropdownActivity.getRightAnswer(rightAnswers);
				interaction.msg("error","No es correcto",id,extra);
				interaction.dropdownActivity.saveResults(question,result,slide,selectedValues);
			} else {
				interaction.msg("success","¡Correcto!",id);
				interaction.dropdownActivity.saveResults(question,100,slide,selectedValues);
			}
			
		}		
	},
	sortableList : {
		create : function(slide,id,order,e) {
			var currentQuestion = InteractiveVideo.slides[order];
			var html = interaction.getForm.header(id,order,'sortableList');
			var intro = "Ordena los elementos:";
			if (e.text && e.text!="") intro = e.text;			
			html += '<p class="question">'+intro+'</p>';
			html += '<ul id="'+id+'sortableList" class="sortable">';
				if (!currentQuestion.results) {
					var toSort = [];
					for (w=0;w<e.items.length;w++) {
						toSort.push(e.items[w]);
					}
					var lis = interaction.randomizeArray(toSort);
					html += interaction.sortableList.getListHTML(lis,id);
				} else {
					var userAnswers = "";
					var selectedValues = currentQuestion.results.selectedValues;
					for (var h=0;h<selectedValues.length;h++) {
						html += '<li>'+e.items[selectedValues[h]]+'</li>';
					}
				}
			html += '</ul>';
			html += '<p class="instructions" id="'+id+'sortableListInstructions">Pincha y arrastra los elementos o usa las flechas.</p>';
			html += '<p class="actions">';
				html += interaction.getForm.sendButton(id,order,'sortableList');
			html += '</p>';
			html += '<div id="'+id+'sortableListFormMessage">';
			html += '</div>';
			html += interaction.getForm.footer();
			
			slide.html(html);
			
			//Show the previous results
			if (currentQuestion.results) {
				$("#"+id+"sortableListForm").addClass("disabled");
				if (currentQuestion.results.score==100) {
					interaction.msg("success","¡Correcto!",id+"sortableListForm");
				} else {
					interaction.msg("error","No es correcto",id+"sortableListForm",interaction.sortableList.getRightAnswer(e.items));
				}
			} else {
				$("#"+id+"sortableList").sortable().bind('sortupdate', function(e, ui) {
					$("#"+id+"sortableListInstructions").hide();
					interaction.sortableList.updateLinks(id);
				});
			}

			$("#"+id+"sortableListForm").show();			
			
		},
		getLinksHTML : function(i,id){
			return '<span> <a href="#" class="up" onclick="interaction.sortableList.sortList(this,'+i+','+(i-1)+',\''+id+'\');return false" title="Subir a la posición '+i+'"><span class="sr-av">Subir</span></a> <a href="#" class="down" onclick="interaction.sortableList.sortList(this,'+i+','+(i+1)+',\''+id+'\');return false" title="Bajar a la posición '+(i+2)+'"><span class="sr-av">Bajar</span></a></span>';
		},
		updateLinks : function(id) {
			var ul = $("#"+id+"sortableList");
			var lis = $("li",ul);
			$("SPAN",ul).remove();
			lis.each(function(i){
				this.className = "";
				if (i==0) this.className = "first";
				if ((i+1)==lis.length) this.className = "last";
				this.innerHTML += interaction.sortableList.getLinksHTML(i,id);
			});
		},		
		getListHTML : function(lis,id) {
			var html = "";
			for (var i=0;i<lis.length;i++) {
				html += '<li';
				if (i==0) html += ' class="first"';
				if ((i+1)==lis.length) html += ' class="last"';
				html += '>'+lis[i]+interaction.sortableList.getLinksHTML(i,id)+'</li>';
			}
			return html;
		},
		sortList : function(e,a,b,id){ // LI - FROM - TO
			$("#"+id+"sortableListInstructions").hide();
			var list = $("#"+id+"sortableList");
			list.sortable("destroy");
			var lis = $("LI",list);
			if (b<0 || b>(lis.length-1)) return false;
			var newList = [];
			var li, prev, current, next;
			for (var i=0;i<lis.length;i++) {
				// li = $(lis[i]).text().split("<span>")[0].split("<SPAN>")[0];
				// alert(li)
				li = lis[i].innerHTML.split("<span>")[0].split("<SPAN>")[0];
				newList.push(li);
				if (i==(a-1)) prev = li;
				else if (i==a) current = li;
				else if (i==(a+1)) next = li;
			}
			newList[b] = current;
			if (b<a) { // Up
				newList[a] = prev;
			} else { // Down
				newList[a] = next;
			}
			list.html(interaction.sortableList.getListHTML(newList,id)).sortable();
		},
		saveResults : function(question,result,slide,selectedValues){
			var currentQuestion = InteractiveVideo.slides[question];
			if (!currentQuestion.results) {
				currentQuestion.results = {
					score : result,
					selectedValues : selectedValues
				};
			}
			result = interaction.formatResult(result);
			interaction.updateResult(question,result+"%");
		},
		getRightAnswer : function(rightAnswers) {
			var rightAnswer = "";
			for (var i=0;i<rightAnswers.length;i++) {
				rightAnswer += "<li>"+rightAnswers[i]+"</li>";
			}
			if (rightAnswer!="") rightAnswer = "<ul>"+rightAnswer+"</ul>";
			return "<p><strong>Respuesta correcta: </strong>"+rightAnswer+"</p>";
		},
		validate : function(question,id) {
			var slide = $("#"+id);
			var lis = InteractiveVideo.slides[question].items;	
			var error = false;
			var selectedValues = [];
			var answer;
			var answers = $(".sortable LI").each(function(i){
				answer = $(this).html().split("<span>")[0];
				answer = answer.split("<SPAN>")[0];
				if (answer!=lis[i]) error = true;
				selectedValues.push(lis.indexOf(answer));
			});
			slide.addClass("disabled");
			$("#"+id.replace("Form","")).sortable("destroy");
			if (error) {
				var extra = interaction.sortableList.getRightAnswer(lis);
				interaction.msg("error","No es correcto",id,extra);
				interaction.sortableList.saveResults(question,0,slide,selectedValues);
			} else {
				interaction.msg("success","¡Correcto!",id);
				interaction.sortableList.saveResults(question,100,slide,selectedValues);
			}
		}
	},	
	clozeActivity : {
		create : function(slide,id,order,e) {
			var html = interaction.getForm.header(id,order,'clozeActivity');
			html += '<p class="question">'+e.text+'</p>';
			html += '<p class="actions">';
				html += interaction.getForm.sendButton(id,order,'clozeActivity');
			html += '</p>';
			html += '<div id="'+id+'clozeActivityFormMessage">';
			html += '</div>';
			html += interaction.getForm.footer();
			slide.html(html);
			// Options
			var opts = new Array();			
			var spans = $("SPAN","#"+id+"clozeActivityForm");
			var rightAnswers = [];
			spans.each(
				function(i){
					var l = this.innerHTML.length;
					if(this.style.textDecoration=='line-through') {
						var f = $('<input type="text" name="answer-'+id+'-'+i+'" id="answer-'+id+'-'+i+'" style="width:'+l+'em" />')
						rightAnswers.push($(this).text());
						$(this).hide().attr("id","right-answer-"+id+"-"+i).before(f);
					}
				}
			);			
			
			var activityForm = $("#"+id+"clozeActivityForm");
			activityForm.show();
			
			//Show the previous results
			var currentQuestion = InteractiveVideo.slides[order];
			if (currentQuestion.results) {
				var myForm = $("#"+id+"clozeActivityForm");
				myForm.addClass("disabled");
				if (currentQuestion.results.score==100) {
					interaction.msg("success","¡Correcto!",id+"clozeActivityForm");
				} else {
					interaction.msg("error","No es correcto",id+"clozeActivityForm",interaction.clozeActivity.getRightAnswer(rightAnswers));
				}
				var selectedValues = currentQuestion.results.selectedValues;
				var selectFields = $("INPUT[type=text]",activityForm);
				for (var w=0;w<selectedValues.length;w++) {
					selectFields.eq(w).val(selectedValues[w]).attr("disabled","disabled");
					if (selectedValues[w]!=spans.eq(w).text()) selectFields.eq(w).attr("class","field-with-error");
				}				
			}			
			
		},
		saveResults : function(question,result,slide,selectedValues){
			var currentQuestion = InteractiveVideo.slides[question];
			if (!currentQuestion.results) {
				currentQuestion.results = {
					score : result,
					selectedValues : selectedValues
				};
			}
			result = interaction.formatResult(result);
			interaction.updateResult(question,result+"%");			
		},
		getRightAnswer : function(rightAnswers) {
			var rightAnswer = "";
			for (var i=0;i<rightAnswers.length;i++) {
				rightAnswer += "<li>"+rightAnswers[i]+"</li>";
			}
			if (rightAnswer!="") rightAnswer = "<ul>"+rightAnswer+"</ul>";
			return "<p><strong>Respuesta correcta: </strong>"+rightAnswer+"</p>";
		},
		validate : function(question,id) {
			
			var e = document.getElementById(id);
			var answers = e.getElementsByTagName("INPUT");
			var answered = true;
			var errors = false;
			var rightAnswers = [];
			var rightAnswered = 0;
			for (i=0;i<answers.length;i++) {
				if(answers[i].type=='text') {
					var currFieldValue = answers[i].value;
					if (currFieldValue=='') answered = false;
					var currFieldId = answers[i].id;
					var rightAnswer = $("#right-"+currFieldId).text();
					rightAnswers.push(rightAnswer);
					var css = "";
					if(rightAnswer!=currFieldValue) {
						css = "field-with-error";
						errors = true;
					}					
					else rightAnswered ++;
					answers[i].className=css;
				}		
			}
			
			if (!answered) {
				interaction.msg("info","Aún no has completado la actividad",e.id);
				return false;
			}
			
			var slide = $("#"+id);
			var selectedValues = [];
			$("INPUT[type=text]",slide).each(function(){
				selectedValues.push(this.value);
			}).attr("disabled","disabled");
			slide.addClass("disabled");
			if (errors) {
				var result = (rightAnswered*100/rightAnswers.length).toFixed(2);
				var extra = interaction.clozeActivity.getRightAnswer(rightAnswers);
				interaction.msg("error","No es correcto",id,extra);
				interaction.clozeActivity.saveResults(question,result,slide,selectedValues);
			} else {
				interaction.msg("success","¡Correcto!",id);
				interaction.clozeActivity.saveResults(question,100,slide,selectedValues);
			}
			
		}
	},
	matchElements : {
		create : function(slide,id,order,e) {
			var html = interaction.getForm.header(id,order,'matchElements');
			var intro = "Empareja los elementos:";
			if (e.text && e.text!="") intro = e.text;
			html += '<p class="question">'+intro+'</p>';
			html += '<div class="pairs">';
			var pairs = e.pairs;
			// var pairsA = [];
			var pairsB = [];
			for (var i=0;i<pairs.length;i++) {
				pairsB.push(pairs[i][1]);
			}
			
			var newPairs;
			for (var z=0;z<pairs.length;z++) {
				newPairs = interaction.randomizeArray(pairsB);
				var pairsBhtml = "";
				for (var w=0;w<newPairs.length;w++) {
					pairsBhtml += '<option value="'+newPairs[w]+'">'+newPairs[w]+'</option>';
				}				
				html += '\
				<p class="pair">\
					<label for="a-'+order+'-'+z+'" class="sr-av">'+(z+1)+'. </label>\
					<select name="a-'+order+'-'+z+'" id="a-'+order+'-'+z+'" disabled="disabled" class="random-a">\
						<option value="'+pairs[z][0]+'">'+pairs[z][0]+'</option>\
					</select>\
					 - <label for="b-'+order+'-'+z+'" class="sr-av">'+(z+1)+'B. </label>\
					<select name="b-'+order+'-'+z+'" id="b-'+order+'-'+z+'" class="random-b">\
						<option value=""></option>\
						'+pairsBhtml+'\
					</select>\
				</p>';
			}
			html += '</div>';
			html += '<p class="actions">';
				html += interaction.getForm.sendButton(id,order,'matchElements');
			html += '</p>';
			html += '<div id="'+id+'matchElementsFormMessage">';
			html += '</div>';
			html += interaction.getForm.footer();
			slide.html(html);
			
			var activityForm = $("#"+id+"matchElementsForm");
			activityForm.show();
			
			//Show the previous results
			var currentQuestion = InteractiveVideo.slides[order];
			if (currentQuestion.results) {
				activityForm.addClass("disabled");
				if (currentQuestion.results.score==100) {
					interaction.msg("success","¡Correcto!",id+"matchElementsForm");
				} else {
					interaction.msg("error","No es correcto",id+"matchElementsForm",interaction.matchElements.getRightAnswer(pairs));
				}
				var selectedValues = currentQuestion.results.selectedValues;
				var questionFields = $("SELECT.random-a",activityForm);
				var selectFields = $("SELECT.random-b",activityForm);
				for (var w=0;w<selectedValues.length;w++) {
					var selectedValue = selectedValues[w];
					selectFields.eq(w).val(selectedValue).attr("disabled","disabled");
					// Get the right value
					var question = questionFields.eq(w).val();
					var rightValue;
					for (var x=0;x<pairs.length;x++) {
						var pair = pairs[x];
						if (pair[0]==question) rightValue = pair[1];
					}
					if (selectedValue!=rightValue) selectFields.eq(w).attr("class","field-with-error");
				}				
			}	
			
		},
		saveResults : function(question,result,slide,selectedValues){
			var currentQuestion = InteractiveVideo.slides[question];
			if (!currentQuestion.results) {
				currentQuestion.results = {
					score : result,
					selectedValues : selectedValues
				};
			}
			result = interaction.formatResult(result);
			interaction.updateResult(question,result+"%");			
		},
		getRightAnswer : function(rightAnswers) {
			var rightAnswer = "";
			for (var i=0;i<rightAnswers.length;i++) {
				rightAnswer += "<li>"+rightAnswers[i][0]+" - "+rightAnswers[i][1]+"</li>";
			}
			if (rightAnswer!="") rightAnswer = "<ul>"+rightAnswer+"</ul>";
			return "<p><strong>Respuesta correcta: </strong>"+rightAnswer+"</p>";
		},
		validate : function(question,id) {
			var slide = $("#"+id);
			var pairs = InteractiveVideo.slides[question].pairs;
			var answered = true;
			var selects = $("SELECT.random-b",slide);
			var selectedValue;
			// var rightAnswers = [];
			var selectedValues = [];
			var rightAnswered = 0;
			for (var i=0;i<pairs.length;i++) {
				selectedValue = selects.eq(i).val();
				selectedValues.push(selectedValue);
				if (selectedValue == "") answered = false;				
				var css = "";
				if(selectedValue != pairs[i][1]) css = "field-with-error";
				else rightAnswered ++;
				selects.eq(i).attr("class",css);
			}
			// Not 100% answered
			if (!answered) {
				interaction.msg("info","Intenta emparejar todos los elementos",id);
				return false;
			}
			slide.addClass("disabled");
			$("select",slide).attr("disabled","disabled");
			if (rightAnswered==pairs.length) {
				// 100% right
				interaction.msg("success","¡Correcto!",id);
				interaction.matchElements.saveResults(question,100,slide,selectedValues);				
			} else {
				// < 100%;
				var extra = interaction.matchElements.getRightAnswer(pairs);
				interaction.msg("error","No es correcto",id,extra);
				// %
				var result = (rightAnswered*100/pairs.length).toFixed(2);
				interaction.matchElements.saveResults(question,result,slide,selectedValues);				
			}
			
		}
	},
	getForm : {
		header : function(id, order, name){
			if (interaction.isInExe) return '<div id="'+id+name+'Form">';
			return '<form id="'+id+name+'Form" action="#" onsubmit="interaction[\''+name+'\'].validate('+order+',this.id);return false">';
		},
		footer : function(){
			if (interaction.isInExe) return '</div>';
			return '</form>';
		},
		sendButton : function(id, order, name){
			if (interaction.isInExe) return '<input type="button" name="'+id+name+'FormSubmit" id="'+id+name+'FormSubmit" value="Enviar" onclick="interaction[\''+name+'\'].validate('+order+',\''+id+name+'Form\');return false" />'
			return '<input type="submit" name="'+id+name+'FormSubmit" id="'+id+name+'FormSubmit" value="Enviar" />'			
		}
	},
	singleChoice : {
		create : function(slide,id,order,e) {
			var html = interaction.getForm.header(id,order,'singleChoice');
			html += '<p class="question">'+e.question+'</p>';
			html += '<div class="answers">';
			for (var i=0;i<e.answers.length;i++) {
			html += '<p>';
				html += '<label for="'+id+'singleChoiceFormAnswer'+i+'">';
				html += '<input type="radio" name="'+id+'singleChoiceFormAnswer" id="'+id+'singleChoiceFormAnswer'+i+'" value="'+i+'" /> ';
				html += e.answers[i][0];
				html += '</label>';
				html += '</p>';
			}
			html += '</div>';
			html += '<p class="actions">';
				html += interaction.getForm.sendButton(id,order,'singleChoice');
			html += '</p>';
			html += '<div id="'+id+'singleChoiceFormMessage">';
			html += '</div>';
			html += interaction.getForm.footer();
			slide.html(html);
			
			//Show the previous results
			var currentQuestion = InteractiveVideo.slides[order];
			if (currentQuestion.results) {
				var myForm = $("#"+id+"singleChoiceForm");
				myForm.addClass("disabled");
				$("input[type='radio']",myForm).each(function(){
					if (this.value==currentQuestion.results.selectedValue) this.checked = true;
				}).attr("disabled","disabled");
				if (currentQuestion.results.score==100) {
					interaction.msg("success","¡Correcto!",id+"singleChoiceForm");
				} else {
					interaction.msg("error","No es correcto",id+"singleChoiceForm",interaction.singleChoice.getRightAnswer(currentQuestion.answers));
				}
			}
			
		},
		saveResults : function(question,result,slide,selectedValue){
			var currentQuestion = InteractiveVideo.slides[question];
			if (!currentQuestion.results) {
				currentQuestion.results = {
					score : result,
					selectedValue : selectedValue
				};
			}
			interaction.updateResult(question,result+"%");
		},
		getRightAnswer : function(questions){
			var rightAnswer = "";
			for (var i=0;i<questions.length;i++) {
				if (questions[i][1]==1) rightAnswer = questions[i][0];
			}
			return "<p><strong>Respuesta correcta: </strong>"+rightAnswer+"</p>";			
		},
		validate : function(question,id) {
			var slide = $("#"+id);
			var selected = $("input[type='radio']:checked",slide);
			if (selected.length==0) {
				interaction.msg("info","Selecciona una respuesta",id);
			} else {
				var selectedValue = selected.val();
				var questions = InteractiveVideo.slides[question].answers;
				slide.addClass("disabled");
				$("input[type='radio']",slide).attr("disabled","disabled");
				if (questions[selectedValue][1]==1) {
					interaction.msg("success","¡Correcto!",id);
					interaction.singleChoice.saveResults(question,100,slide,selectedValue);
				} else {
					var extra = interaction.singleChoice.getRightAnswer(questions);
					interaction.msg("error","No es correcto",id,extra);
					interaction.singleChoice.saveResults(question,0,slide,selectedValue);
				}
			}
		}
	},
	multipleChoice : {
		create : function(slide,id,order,e) {
			var html = interaction.getForm.header(id,order,'multipleChoice');
			html += '<p class="question">'+e.question+'</p>';
			html += '<div class="answers">';
			for (var i=0;i<e.answers.length;i++) {
			html += '<p>';
				html += '<label for="'+id+'multipleChoiceFormAnswer'+i+'">';
				html += '<input type="checkbox" name="'+id+'multipleChoiceFormAnswer" id="'+id+'multipleChoiceFormAnswer'+i+'" value="'+i+'" /> ';
				html += e.answers[i][0];
				html += '</label>';
				html += '</p>';
			}
			html += '</div>';
			html += '<p class="actions">';
				html += interaction.getForm.sendButton(id,order,'multipleChoice');
			html += '</p>';			
			html += '<div id="'+id+'multipleChoiceFormMessage">';
			html += '</div>';
			html += interaction.getForm.footer();
			slide.html(html);
			var currentQuestion = InteractiveVideo.slides[order];
			if (currentQuestion.results) {
				var myForm = $("#"+id+"multipleChoiceForm");
				myForm.addClass("disabled");
				$("input[type='checkbox']",myForm).each(function(){
					var selectedValues = currentQuestion.results.selectedValues;
					for (var z=0;z<selectedValues.length;z++) {
						if (selectedValues[z]==this.value) this.checked = true;
					}
				}).attr("disabled","disabled");
				if (currentQuestion.results.score==100) {
					interaction.msg("success","¡Correcto!",id+"multipleChoiceForm");
				} else {
					interaction.msg("error","No es correcto",id+"multipleChoiceForm",interaction.multipleChoice.getRightAnswer(currentQuestion.answers));
				}
			}			
		},
		saveResults : function(question,result,slide,selectedValues){
			var currentQuestion = InteractiveVideo.slides[question];
			if (!currentQuestion.results) {
				currentQuestion.results = {
					score : result,
					selectedValues : selectedValues
				};
			}
			result = interaction.formatResult(result);
			interaction.updateResult(question,result+"%");			
		},
		getRightAnswer : function(questions){
			var rightAnswers = [];
			for (var i=0;i<questions.length;i++) {
				if (questions[i][1]==1) rightAnswers.push(questions[i][0]);
			}
			var rightAnswer = "<ul>";
			for (var z=0;z<rightAnswers.length;z++) {
				rightAnswer += "<li>"+rightAnswers[z]+"</li>";
				
			}
			rightAnswer += "</ul>";
			return "<p><strong>Respuesta correcta: </strong></p>"+rightAnswer;
		},
		validate : function(question,id) {
			var slide = $("#"+id);
			var selected = $("input[type='checkbox']:checked",slide);
			if (selected.length==0) {
				interaction.msg("info","Selecciona una respuesta",id);
			} else {
				slide.addClass("disabled");
				$("input[type='checkbox']",slide).attr("disabled","disabled");
				var questions = InteractiveVideo.slides[question].answers;
				// Check if it has errors
				var error = false;
				var selectedValues = [];
				var rightAnswered = 0;
				// 1/2 Check if the selected ones are right
				selected.each(function(){
					var selectedValue = this.value;
					selectedValues.push(selectedValue);
					if (questions[selectedValue][1]!=1) error = true;
					else rightAnswered ++;
				});
				// 2/2 Check if those which are not selected should have been selected
				// Right answers
				var rightAnswers = 0;
				for (var i=0;i<questions.length;i++) {
					if (questions[i][1]==1) {
						rightAnswers ++;
					}
				}
				if (rightAnswers>rightAnswered) error = true;
				if (error) {
					var extra = interaction.multipleChoice.getRightAnswer(questions);
					interaction.msg("error","No es correcto",id,extra);
					// %
					var result = (rightAnswered*100/rightAnswers).toFixed(2);
					interaction.multipleChoice.saveResults(question,result,slide,selectedValues);
				} else {
					interaction.msg("success","¡Correcto!",id);
					// To do: guardar más de una opción seleccionada
					interaction.multipleChoice.saveResults(question,100,slide,selectedValues);
				}
			}
		}
	},	
	track : function(position){
		// To review now
		var position = Math.round(position).toString();
		var slides = InteractiveVideo.slides;
		var i = slides.length;
		var e;
		while (i--) {
			e = slides[i];
			if (e.startTime.toString()==position) {
				if (e.current==false) {
					this.slide.show(e,i);
				} else {
					
				}
			} else if (e.endTime && e.endTime.toString()==position) {
				this.slide.hide('case 3');
			} else {
				e.current = false;
			}
		}
	},	
	getImage : function(e,w,h){
		var maxW = 448;
		var maxH = 356;
		var newW = w;
		var newH = h;
		var css = "square";
		
		if (w==h) { // Square
			if (w>maxW || h>maxW) {
				newW = maxW;
				newH = maxW;
			}
		} else if (w>h) { // Horizontal
			css = "horizontal";
			if (w>maxW || h>maxW) {
				newW = maxW;
				newH = Math.round(h*newW/w);
			}
		} else { // Vertical
			css = "vertical";
			if (w>maxW || h>maxW) {
				newH = maxW;
				newW = Math.round(h*newH/h);
			}
		}
		if (newH>maxH) {
			newW = Math.round(maxH*newW/newH);
			newH = maxH;
		}	
		var url = e.url;
		if (e.url.indexOf('://mediateca.educa.madrid.org/imagen/')>-1) url = e.url.replace("http://mediateca.educa.madrid.org/imagen/","https://mediateca.educa.madrid.org/imagen.php?id=")+"&type=2&m=550";		
		return '<img src="'+url+'" alt="'+e.description+'" class="'+css+'" width="'+newW+'" height="'+newH+'" style="display:block;margin-top:'+((356-newH)/2)+'px" /><a href="'+e.url+'" target="_blank">Abrir en ventana nueva</a>';
	}	
}

$(function(){
	
	interaction.init();
	
});

/*
 * HTML5 Sortable jQuery Plugin
 * https://github.com/voidberg/html5sortable
 *
 * Original code copyright 2012 Ali Farhadi.
 * This version is mantained by Alexandru Badiu <andu@ctrlz.ro> & Lukas Oppermann <lukas@vea.re>
 *
 *
 * Released under the MIT license.
 */
!function(e,t){"function"==typeof define&&define.amd?define(["jquery"],t):"object"==typeof exports?module.exports=t(require("jquery")):e.sortable=t(e.jQuery)}(this,function(e){"use strict";var t,a,r=e(),n=[],i=function(e){e.off("dragstart.h5s"),e.off("dragend.h5s"),e.off("selectstart.h5s"),e.off("dragover.h5s"),e.off("dragenter.h5s"),e.off("drop.h5s")},o=function(e){e.off("dragover.h5s"),e.off("dragenter.h5s"),e.off("drop.h5s")},d=function(e,t){e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text",""),e.dataTransfer.setDragImage&&e.dataTransfer.setDragImage(t.item,t.x,t.y)},s=function(e,t){return t.x||(t.x=parseInt(e.pageX-t.draggedItem.offset().left)),t.y||(t.y=parseInt(e.pageY-t.draggedItem.offset().top)),t},l=function(e){return{item:e[0],draggedItem:e}},f=function(e,t){var a=l(t);a=s(e,a),d(e,a)},h=function(e,t){return"undefined"==typeof e?t:e},g=function(e){e.removeData("opts"),e.removeData("connectWith"),e.removeData("items"),e.removeAttr("aria-dropeffect")},c=function(e){e.removeAttr("aria-grabbed"),e.removeAttr("draggable"),e.removeAttr("role")},u=function(e,t){return e[0]===t[0]?!0:void 0!==e.data("connectWith")?e.data("connectWith")===t.data("connectWith"):!1},p=function(e){var t=e.data("opts")||{},a=e.children(t.items),r=t.handle?a.find(t.handle):a;o(e),g(e),r.off("mousedown.h5s"),i(a),c(a)},m=function(t){var a=t.data("opts"),r=t.children(a.items),n=a.handle?r.find(a.handle):r;t.attr("aria-dropeffect","move"),n.attr("draggable","true");var i=(document||window.document).createElement("span");"function"!=typeof i.dragDrop||a.disableIEFix||n.on("mousedown.h5s",function(){-1!==r.index(this)?this.dragDrop():e(this).parents(a.items)[0].dragDrop()})},v=function(e){var t=e.data("opts"),a=e.children(t.items),r=t.handle?a.find(t.handle):a;e.attr("aria-dropeffect","none"),r.attr("draggable",!1),r.off("mousedown.h5s")},b=function(e){var t=e.data("opts"),a=e.children(t.items),r=t.handle?a.find(t.handle):a;i(a),r.off("mousedown.h5s"),o(e)},x=function(i,o){var s=e(i),l=String(o);return o=e.extend({connectWith:!1,placeholder:null,dragImage:null,disableIEFix:!1,placeholderClass:"sortable-placeholder",draggingClass:"sortable-dragging",hoverClass:!1},o),s.each(function(){var i=e(this);if(/enable|disable|destroy/.test(l))return void x[l](i);o=h(i.data("opts"),o),i.data("opts",o),b(i);var s,g,c,p=i.children(o.items),v=null===o.placeholder?e("<"+(/^ul|ol$/i.test(this.tagName)?"li":"div")+' class="'+o.placeholderClass+'"/>'):e(o.placeholder).addClass(o.placeholderClass);if(!i.attr("data-sortable-id")){var I=n.length;n[I]=i,i.attr("data-sortable-id",I),p.attr("data-item-sortable-id",I)}if(i.data("items",o.items),r=r.add(v),o.connectWith&&i.data("connectWith",o.connectWith),m(i),p.attr("role","option"),p.attr("aria-grabbed","false"),o.hoverClass){var C="sortable-over";"string"==typeof o.hoverClass&&(C=o.hoverClass),p.hover(function(){e(this).addClass(C)},function(){e(this).removeClass(C)})}p.on("dragstart.h5s",function(r){r.stopImmediatePropagation(),o.dragImage?(d(r.originalEvent,{item:o.dragImage,x:0,y:0}),console.log("WARNING: dragImage option is deprecated and will be removed in the future!")):f(r.originalEvent,e(this),o.dragImage),t=e(this),t.addClass(o.draggingClass),t.attr("aria-grabbed","true"),s=t.index(),a=t.height(),g=e(this).parent(),t.parent().triggerHandler("sortstart",{item:t,placeholder:v,startparent:g})}),p.on("dragend.h5s",function(){t&&(t.removeClass(o.draggingClass),t.attr("aria-grabbed","false"),t.show(),r.detach(),c=e(this).parent(),t.parent().triggerHandler("sortstop",{item:t,startparent:g}),(s!==t.index()||g.get(0)!==c.get(0))&&t.parent().triggerHandler("sortupdate",{item:t,index:c.children(c.data("items")).index(t),oldindex:p.index(t),elementIndex:t.index(),oldElementIndex:s,startparent:g,endparent:c}),t=null,a=null)}),e(this).add([v]).on("drop.h5s",function(a){return u(i,e(t).parent())?(a.stopPropagation(),r.filter(":visible").after(t),t.trigger("dragend.h5s"),!1):void 0}),p.add([this]).on("dragover.h5s dragenter.h5s",function(n){if(u(i,e(t).parent())){if(n.preventDefault(),n.originalEvent.dataTransfer.dropEffect="move",p.is(this)){var d=e(this).height();if(o.forcePlaceholderSize&&v.height(a),d>a){var s=d-a,l=e(this).offset().top;if(v.index()<e(this).index()&&n.originalEvent.pageY<l+s)return!1;if(v.index()>e(this).index()&&n.originalEvent.pageY>l+d-s)return!1}t.hide(),v.index()<e(this).index()?e(this).after(v):e(this).before(v),r.not(v).detach()}else r.is(this)||e(this).children(o.items).length||(r.detach(),e(this).append(v));return!1}})})};return x.destroy=function(e){p(e)},x.enable=function(e){m(e)},x.disable=function(e){v(e)},e.fn.sortable=function(e){return x(this,e)},x}); 