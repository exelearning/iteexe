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
var mejsFullScreen; 

var interaction = {
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
	i18n : {
		"start" : "Start",
		"results" : "Results",
		"slide" : "Slide",
		"score" : "Score",
		"seen" : "Seen",
		"total" : "Total",
		"seeAll" : "see all the slides and answer all the questions",
		"noSlides" : "This video has no interactive slides.",
		"goOn" : "Continue",
		"error" : "Error",
		"dataError" : "Incompatible code",
		"onlyOne" : "Only one interactive video per page.",
		"cover" : "Cover",
		"fsWarning" : "Exit the fullscreen mode (Esc) to see the current slide",
		"right" : "Right!",
		"wrong" : "Wrong",
		"sortableListInstructions" : "Drag and drop or use the arrows.",
		"up" : "Move up",
		"down" : "Move down",
		"rightAnswer" : "Right answer:",
		"notAnswered" : "Please finish the activity",
		"check" : "Check",
		"newWindow" : "New window",
		"msgOnlySaveAuto": "Your score will be saved after each question. You can only play once.",
        "msgSaveAuto": "Your score will be automatically saved after each question.",
        "msgYouScore": "Your score",
        "msgScoreScorm": "The score can't be saved because this page is not part of a SCORM package.",
        "msgYouLastScore": "The last score saved is",
        "msgActityComply": "You have already done this activity.",
        "msgPlaySeveralTimes": "You can do this activity as many times as you want",
        "msgScoreScorm": "The score can't be saved because this page is not part of a SCORM package.",
        "msgEndGameScore": "Please start the game before saving your score.",
        "msgSeveralScore": "You can save the score as many times as you want",
        "msgOnlySaveScore": "You can only save the score once!",
        "msgOnlySave": "You can only save once",
        "msgOnlySaveAuto": "Your score will be saved after each question. You can only play once.",

	},
	scorm:{
		'isScorm': 0,
		'textButtonScorm': 'Save score',
		'repeatActivity': false
	},
	scoreNIA:true,
	userName: '',
    previousScore: '',
    initialScore: '',
    hasSCORMbutton: false,
    score: 0,
    numSlides: 1000,
    scoreSlides: [],
    scoref: '0',
    gameStarted: false,
	mScorm:null,
	hasLATEX: false,
	loadSCORM_API_wrapper: function () {
        if (typeof (pipwerks) == 'undefined') $exe.loadScript('SCORM_API_wrapper.js', 'interaction.loadSCOFunctions()');
        else this.loadSCOFunctions();
    },
    loadSCOFunctions: function () {
        if (typeof (exitPageStatus) == 'undefined') $exe.loadScript('SCOFunctions.js', 'interaction.enable()');
        else this.enable();
        interaction.mScorm = scorm;
        var callSucceeded = interaction.mScorm.init();
        if (callSucceeded) {
            interaction.userName = interaction.getUserName();
            interaction.previousScore = interaction.getPreviousScore();
            interaction.mScorm.set("cmi.core.score.max", 10);
            interaction.mScorm.set("cmi.core.score.min", 0);
            interaction.initialScore = interaction.previousScore;
        }
    },
	getUserName: function () {
        var user = interaction.mScorm.get("cmi.core.student_name");
        return user
    },
    getPreviousScore: function () {
        var score = interaction.mScorm.get("cmi.core.score.raw");
        return score;
    },
    endScorm: function () {
        if (interaction.mScorm && typeof interaction.mScorm.quit == "function") {
            interaction.mScorm.quit();
        }

    },
    addButtonScore: function (isScorm, textButtonScorm) {
        var butonScore = "";
        var fB = '<div id="interactive-BottonContainer">';
        if (isScorm == 2) {
            var buttonText = textButtonScorm;
            if (buttonText != "") {
                if (this.hasSCORMbutton == false && ($("body").hasClass("exe-authoring-page") || $("body").hasClass("exe-scorm"))) {
                    this.hasSCORMbutton = true;
                    fB += '<div class="interactive-GetScore">';
                    if (!this.isInExe) fB += '<form action="#" onsubmit="return false">';
                    fB += '<p><input type="button" id="interactiveSendScore" value="' + buttonText + '" class="feedbackbutton" /> <span class="interactive-RepeatActivity" id="interactiveRepeatActivity"></span></p>';
                    if (!this.isInExe) fB += '</form>';
                    fB += '</div>';
                    butonScore = fB;
                }
            }
        } else if (isScorm == 1) {
            if (this.hasSCORMbutton == false && ($("body").hasClass("exe-authoring-page") || $("body").hasClass("exe-scorm"))) {
                this.hasSCORMbutton = true;
                fB += '<div class="interactive-GetScore">';
                fB += '<p><span class="interactive-RepeatActivity" id="interactiveRepeatActivity"></span></p>';
                fB += '</div>';
                butonScore = fB;
            }
        }
        fB = +'</div>';

        return butonScore;
    },
    updateScorm: function (isScorm, repeatActivity, prevScore) {
        var text = '',
            msgs = interaction.i18n;
        $('#interactiveSendScore').hide();
        if (isScorm === 1) {
            if (repeatActivity && prevScore !== '') {
                text = msgs.msgYouLastScore + ': ' + prevScore;
            } else if (repeatActivity && prevScore === "") {
                text = msgs.msgSaveAuto + ' ' + msgs.msgPlaySeveralTimes
            } else if (!repeatActivity && prevScore === "") {
                text = msgs.msgOnlySaveAuto;
            } else if (!repeatActivity && prevScore !== "") {
                text = msgs.msgActityComply + ' ' + msgs.msgYouLastScore + ': ' + prevScore;
            }
        } else if (isScorm === 2) {
            $('#interactiveSendScore').show();
            if (repeatActivity && prevScore !== '') {
                text = msgs.msgYouLastScore + ': ' + prevScore;
            } else if (repeatActivity && prevScore === '') {
                text = msgs.msgSeveralScore;
            } else if (!repeatActivity && prevScore === '') {
                text = msgs.msgOnlySaveScore;
            } else if (!repeatActivity && prevScore !== '') {
                $('#interactiveSendScore').hide();
                text = msgs.msgActityComply + ' ' + msgs.msgYouScore + ': ' + prevScore;
            }
        }
        $('#interactive-BottonContainer').show();
        $('#interactiveRepeatActivity').text(text);
        $('#interactiveRepeatActivity').fadeIn(1000);
    },
    sendScore: function (auto, score) {
        var msgs = interaction.i18n,
            message = '',
            score = ((score * 10) / interaction.numSlides).toFixed(2);
        if (interaction.gameStarted) {
            if (interaction.mScorm  && typeof interaction.mScorm != 'undefined') {
                if (!auto) {
                    $('#interactiveSendScore').show();
                    if (!interaction.scorm.repeatActivity && interaction.previousScore !== '') {
                        message = interaction.userName !== '' ? interaction.userName + ' ' + msgs.msgOnlySaveScore : msgs.msgOnlySaveScore;
                    } else {
                        interaction.previousScore = score;
                        interaction.mScorm.set("cmi.core.score.raw", score);
                        message = interaction.userName !== '' ? interaction.userName + '. ' + msgs.msgYouScore + ': ' + score : msgs.msgYouScore + ': ' + score
                        if (!interaction.scorm.repeatActivity) {
                            $('#interactiveSendScore').hide();
                        }

                        $('#interactiveRepeatActivity').text(msgs.msgYouScore + ': ' + score)
                        $('#interactiveRepeatActivity').show();
                    }
                } else {
                    interaction.previousScore = score;
                    score = score === "" ? 0 : score;
                    interaction.mScorm.set("cmi.core.score.raw", score);
                    $('#interactiveRepeatActivity').text(msgs.msgYouScore + ': ' + score)
                    $('#interactiveRepeatActivity').show();
                    message = "";
                }
            } else {
                message = msgs.msgScoreScorm;
            }
        } else {
            message = msgs.msgEndGameScore;
        }
        if (!auto) alert(message);
    },
    updateScore: function (question, result) {
        if(question >=interaction.scoreSlides.length) return;
        var e = interaction.scoreSlides[question],
            point = interaction.scoreNIA ? 1 : 0;
        if (e.type == "singleChoice" || e.type == "multipleChoice" || e.type == "dropdown" ||
            e.type == "matchElements" || e.type == "sortableList" || e.type == "cloze") {
            var spoint = parseFloat(result)
            if (!isNaN(spoint)) {
                point = spoint / 100;
            }
        }
        if (e.score == -1) {
            e.score = point;
            interaction.score += point;
        }
        if (interaction.scorm.isScorm == 1) {
            var scoref = ((interaction.score * 10) / interaction.numSlides).toFixed(2);
            $('#interactiveRepeatActivity').text(interaction.i18n.msgYouScore + ': ' + scoref)
            $('#interactiveRepeatActivity').show();
            interaction.sendScore(true, interaction.score)
        }

    },
	loadMathJax: function () {
        if (!window.MathJax) {
            window.MathJax = $exe.math.engineConfig;
        }
        var script = document.createElement('script');
        script.src = $exe.math.engine;
        script.async = true;
        document.head.appendChild(script);
    },

    updateLatex: function (mnodo) {
        setTimeout(function () {
            if (typeof (MathJax) != "undefined") {
                try {
                    if (MathJax.Hub && typeof MathJax.Hub.Queue == "function") {
                        MathJax.Hub.Queue(["Typeset", MathJax.Hub, '#' + mnodo]);
                    } else if (typeof MathJax.typeset == "function") {
                        var nodo = document.getElementById(mnodo);
                        MathJax.typesetClear([nodo]);
                        MathJax.typeset([nodo]);
                    }
                } catch (error) {
                    console.log('Error al refrescar cuestiones')
                }
            }

        }, 100);
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
			if (InteractiveVideo && InteractiveVideo.slides != undefined && InteractiveVideo.slides.length > 0) {
                if (interaction.scorm.isScorm > 0) {
                    interaction.updateScorm(interaction.scorm.isScorm, interaction.scorm.repeatActivity, interaction.previousScore);
                }
				var activeSlide=0;
                for (var i = 0; i < InteractiveVideo.slides.length; i++) {
                    var sr = {
                        'type': InteractiveVideo.slides[i].type,
                        'score': -1
                    }
                    interaction.scoreSlides.push(sr);
					if (sr.type == "singleChoice" || sr.type == "multipleChoice" || sr.type == "dropdown" || sr.type == "matchElements" || sr.type == "sortableList"  || sr.type == "cloze") {
						activeSlide++;
					}
                }
                interaction.numSlides = interaction.scoreNIA ? interaction.scoreSlides.length : activeSlide;
                interaction.gameStarted = true;
                $('#interactiveSendScore').off('click')
                $('#interactiveSendScore').on('click', function (e) {
                    e.preventDefault();
                    interaction.sendScore(false, interaction.score);
                });
            }
			if (play) interaction.controls.play();
		},
		show : function(action){
			var i18n = interaction.i18n;
			interaction.controls.stop();
			$("BODY").addClass("cover-on");
			var txt = i18n.goOn;
			var play = false;
			if (action=="restart") {
				txt = i18n.start;
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
					interaction.mediaElementVideo.mediaelementplayer({
						success: function(mediaElement, DOMElement, player) {
							mejsFullScreen= mediaElement.isFullScreen;
							setInterval(function() {
								if (mediaElement.isFullScreen != mejsFullScreen) {
									if (mediaElement.isFullScreen) {
										mejsFullScreen = mediaElement.isFullScreen;
									} else {
										mejsFullScreen = mediaElement.isFullScreen;
									}
								}
							}, 500);
						}
					});
					interaction.mediaElementReady = true;
					setTimeout(function(){
						if (interaction.extension=='flv') $(".mejs-overlay-button").trigger("click");
						else interaction.mediaElementVideo[0].play();
						interaction.ready();
						interaction.hasPlayed = true;
						interaction.mejs = mejs;
					},500);
				} else {
					if (interaction.extension=='flv') $(".mejs-overlay-button").trigger("click");
					else interaction.mediaElementVideo[0].play();
				}
			}
		},
		stop : function(){
			if (interaction.type=="mediateca") jwplayer().stop();
			else if (interaction.type=="youtube") interaction.player.pauseVideo();
			else if (interaction.type=="local") {
				if (interaction.extension=='flv') $(".mejs-pause button").trigger("click");
				else interaction.mediaElementVideo[0].pause();
			}
		},
		pause : function(){
			if (interaction.type=="mediateca") jwplayer().pause(true);
			else if (interaction.type=="youtube") interaction.player.pauseVideo();
			else if (interaction.type=="local") {
				if (interaction.extension=='flv') $(".mejs-pause button").trigger("click");
				else interaction.mediaElementVideo[0].pause();
			}
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
					alert(interaction.i18n.error+" - Youtube (ID)");
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
				this.extension = ref.split('.').pop().toLowerCase();
				return;
			}
			alert(interaction.i18n.error+" - "+interaction.i18n.dataError);
		}
		
	},
	init: function () {
        if ($("body").hasClass("exe-scorm")) this.loadSCORM_API_wrapper();
        else this.enable();
	},
    enable: function () {
		// Create the required HTML elements:
		
		var es = $(".exe-interactive-video");
		var text=$(".exe-interactive-video").eq(0).html()
		var hasLatex = /(?:\\\(|\\\[|\\begin\{.*?})/.test(text);
		
		var showResults = true;
		if (es.hasClass("exe-interactive-video-no-results")) showResults = false;
		
		if (es.length==0) return;
		
		if (typeof($exeAuthoring)!='undefined') this.isInExe = true;		
		
		if (es.length>1) {
			var msg = interaction.i18n.error+" - "+interaction.i18n.onlyOne;
			if (this.isInExe) eXe.app.alert(msg);
			else alert(msg);
			return false;
		}
		
		es = es.eq(0);
		
		// Default strings
		if (typeof(InteractiveVideo)!="undefined" && typeof(InteractiveVideo.i18n)!="undefined") {
			for (var _i in InteractiveVideo.i18n) {
				interaction.i18n[_i] = InteractiveVideo.i18n[_i];
			};
		}
		var i18n = interaction.i18n;
		
		
		var html = '\
			<div id="activity-wrapper">\
			<div id="activity">\
				<div id="player" style="width:448px;height:356px"></div>\
				<div id="slide"></div>\
			</div>\
		';

		if (showResults) {
			html += '\
				<div class="js-required">\
					<h2 id="activity-results-toggler"><a href="#activity-results" onclick="interaction.resultsViewer.toggle(this);return false" class="show">'+i18n.results+'</a></h2>\
					<div id="activity-results" style="display:none"></div>\
				</div>\
			';
		}

		if (typeof (InteractiveVideo) != "undefined") {
            interaction.scorm = typeof InteractiveVideo.scorm == "undefined" ?  interaction.scorm : InteractiveVideo.scorm;
			interaction.scoreNIA = typeof InteractiveVideo.scoreNIA == "undefined" ?  true : InteractiveVideo.scoreNIA;
            var buttonScorm = this.addButtonScore(interaction.scorm.isScorm, interaction.scorm.textButtonScorm);
            html += buttonScorm;
        }

		// es.html(es.html()+html);
		es[0].innerHTML += html;

		if (typeof(InteractiveVideo)=="undefined" || typeof(InteractiveVideo.slides)=="undefined" || InteractiveVideo.slides.length==0) {
			$("#player").html("<p style='text-align:center;margin:0;line-height:356px'>"+i18n.noSlides+"</p>");
			$("#activity-results-toggler").hide();
			return false;
		}

		try {
			document.createEvent("TouchEvent");
			$("BODY").addClass("is-mobile");
		} catch(e) { }
		
		if (this.inIframe()) $("body").removeClass("full-screen");
		
		this.getTypeAndId();
		
		// To review
		// Make sure that you delete all the results so you can save the new values
		for (var i=0;i<InteractiveVideo.slides.length;i++) {
			InteractiveVideo.slides[i].results = null;
		}
		
		
		$("BODY").addClass("cover-on");
		var play = '<p id="start-activity">';
		var playContent = '<a href="#" onclick="interaction.cover.hide(true);return false" id="start-link">'+i18n.start+'</a>';

		play = play+playContent+"</p>";
		// var cover = "<h2>"+$("#activity-title").html()+"</h2>";
		var cover = "";
		var coverCSS = "";
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
		
		// Cover (poster)
		if (InteractiveVideo.coverType&&InteractiveVideo.coverType=="poster") {
			var img = $(".interactive-videoIdevice .exe-interactive-video-poster");
			if (img.length==1) {
				img = img.eq(0);
				cover = "<h2 class='sr-av'>"+videoTitle+"</h2>";
				cover += "<span class='activity-cover-img-content'>"+img.html()+'</span>';
				coverCSS = ' class="activity-cover-img"';
			}
		} 		
		$("#activity").prepend('<div id="activity-cover"'+coverCSS+'><div id="activity-cover-logo"></div><div id="activity-cover-content">'+cover+'</div>'+play+'</div>');
		
		if (hasLatex && typeof (window.MathJax) == "undefined") {
			interaction.hasLATEX = true;
            interaction.loadMathJax();
        }
		if (this.type=='mediateca') {
			
			$exe.loadScript("https://mediateca.educa.madrid.org/includes/player/exelearning/jwplayer.js","interaction.ready()");
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
			width: w
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
						// To review (error: It hides the slide): interaction.slide.hide('case 1');
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
			
			if (interaction.extension=="flv") {
				
				interaction.youtubeCounter = setInterval(function(){
					interaction.track(interaction.hourToSeconds($("#player .mejs-currenttime").eq(0).text()));
				},500);
				
			} else {
			
				interaction.mediaElementVideo[0].addEventListener('playing', function (e) {
					interaction.youtubeCounter = setInterval(function(){
						interaction.track(interaction.mediaElementVideo[0].currentTime);
					},500);
					interaction.checkSlides();
				});			
			
			}
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
	secondsToHour : function(totalSec) {
		var hours = parseInt( totalSec / 3600 ) % 24;
		var minutes = parseInt( totalSec / 60 ) % 60;
		var seconds = totalSec % 60;
		return (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
	},
	resultsViewer : {
		create : function(){
			var html = "";
			var i18n = interaction.i18n;
			// var cover = "";
			// if (InteractiveVideo.cover) {
			var cover = '\
					<tr class="odd">\
						<td>&nbsp;</td>\
						<td><a href="#" onclick="interaction.cover.show();return false">'+i18n.cover+'</a> </td>\
						<td>&nbsp;</td>\
					</tr>';
			// }
			var questions = InteractiveVideo.slides;
			for (var i=0; i<questions.length; i++) {
				var e = questions[i];
				var title = title = "Actividad - "+interaction.typeNames[e.type];
				if (e.type=="image" || e.type=="text") title = "Información - "+interaction.typeNames[e.type];
				var result = "-";
				var k = "odd";
				if (i%2==0) k = "even";				
				if (interaction.type=="local" && interaction.extension=="flv") {
					html += '\
						<tr class="'+k+'">\
							<td class="order"><span>'+(i+1)+'</span> </td>\
							<td><span>'+interaction.secondsToHour(e.startTime)+'</span> </td>\
							<td class="result"><span>'+result+'</span> </td>\
						</tr>';
				} else {
					html += '\
						<tr class="'+k+'">\
							<td class="order"><span>'+(i+1)+'</span> </td>\
							<td><a href="#" onclick="interaction.seek('+i+');return false">'+interaction.secondsToHour(e.startTime)+'</a> </td>\
							<td class="result"><span>'+result+'</span> </td>\
						</tr>';					
				}
			}
			if (html!="") {
				html += '\
				<tr>\
					<th colspan="2" id="resultsSummaryTH"><span class="title">'+i18n.total+' <em>('+i18n.seeAll+')</em></span> </th>\
					<td id="resultsSummary"><span>-</span> </td>\
				</tr>';
				html = '\
				<table>\
				<colgroup>\
					<col width="10%">\
					<col width="60%">\
					<col width="30%">\
				</colgroup>\
				<tr>\
					<th><span class="title">&nbsp;</span></th>\
					<th><span class="title">'+i18n.slide+'</span> </th>\
					<th><span class="title">'+i18n.score+'</span> </th>\
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
					} else if (t==interaction.i18n.seen && interaction.scoreNIA) {
						result += 100;
						counter ++;
					}
				}

			);
			if(!interaction.scoreNIA  && counter>=interaction.numSlides) complete=true;			
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
		var k = "success";
		if (type=="alert") k = "alert";
		else if (type=="error") k = "danger";
		else if (type=="info") k = "info";
		k = "exe-block-" + k;
		var msg = '<div class="exe-block-msg '+k+'"><p>'+txt+'</p></div>';
		if (rightAnswer) msg += rightAnswer;
		$("#"+formId+"Message").html(msg);
	},
	seek : function(order){
		if (interaction.visibleSlide==order && $("BODY").hasClass("active")) {
			return false;
		}
		interaction.isSeek = true;
		if (interaction.hasPlayed!=true) {
			interaction.controls.seek(InteractiveVideo.slides[order].startTime-1);
		} else {
			interaction.controls.seek(InteractiveVideo.slides[order].startTime);
		}
	},
	isFullScreen : function(){
		if (this.type=='mediateca' && jwplayer().getFullscreen()) return true;
		else if (this.type=='youtube' && $("iframe").width()==$(window).width()) return true;
		else if (this.type=='local' && (typeof(mejsFullScreen)!='undefined' && mejsFullScreen==true)) return true;
		return false;
	},	
	slide : {
		enable : function(slide,e,order) {

			var html = "";
			var id = interaction.baseId;
			var i18n = interaction.i18n;
			var i;
			
			// Text
			if (e.type=="text") {
				slide.html(e.text);
				for (var i=0; i<InteractiveVideo.slides.length; i++) {
					if (e==InteractiveVideo.slides[i]) {
						interaction.updateResult(i,i18n.seen);
						e.results = {
							viewed : true
						};
					}
				}				
			
			// Image
			} else if (e.type=="image") {
				
				var img = new Image() ;
				img.src = $("#exe-interactive-video-img-"+e.url).attr("src");
				img.onload = function() {
					slide.html(interaction.getImage(e,img.width,img.height,img.src));
					for (var i=0; i<InteractiveVideo.slides.length; i++) {
						if (e==InteractiveVideo.slides[i]) {
							interaction.updateResult(i,i18n.seen);
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
			$("#slide").before('<a href="#slide" id="slide-link" class="sr-av">'+interaction.i18n.slide+'</a>');
			$("#slide-link").focus();			
		},
		show : function(e,order) { // e = the object
			e.current = true;
			interaction.visibleSlide = order;
			if (interaction.isFullScreen()) {
				interaction.controls.pause();
				// Not displayed with MediaElement
				if (interaction.type!="local") alert(interaction.i18n.fsWarning);
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
			interaction.updateLatex('activity-wrapper');
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
		interaction.updateScore(question, result);
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
				var i18n = interaction.i18n;
				activityForm.addClass("disabled");
				if (currentQuestion.results.score==100) {
					interaction.msg("success",i18n.right,id+"dropdownActivityForm");
				} else {
					interaction.msg("error",i18n.wrong,id+"dropdownActivityForm",interaction.dropdownActivity.getRightAnswer(rightAnswers));
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
			
			var i18n = interaction.i18n;
			var rst=0;
			if (errors) {
				var result = (rightAnswered*100/rightAnswers.length).toFixed(2);
				var extra = interaction.dropdownActivity.getRightAnswer(rightAnswers);
				interaction.msg("error",i18n.wrong,id,extra);
				interaction.dropdownActivity.saveResults(question,result,slide,selectedValues);
				rst=result;
			} else {
				interaction.msg("success",i18n.right,id);
				interaction.dropdownActivity.saveResults(question,100,slide,selectedValues);
				rst=100;
			}
		}		
	},
	sortableList : {
		create : function(slide,id,order,e) {
			var i18n = interaction.i18n;
			var currentQuestion = InteractiveVideo.slides[order];
			var html = interaction.getForm.header(id,order,'sortableList');
			if (e.text && e.text!="") html += '<div>'+e.text+'</div>';
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
			html += '<p class="instructions" id="'+id+'sortableListInstructions">'+i18n.sortableListInstructions+'</p>';
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
					interaction.msg("success",i18n.right,id+"sortableListForm");
				} else {
					interaction.msg("error",i18n.wrong,id+"sortableListForm",interaction.sortableList.getRightAnswer(e.items));
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
			var i18n = interaction.i18n;
			return '<span> <a href="#" class="up" onclick="interaction.sortableList.sortList(this,'+i+','+(i-1)+',\''+id+'\');return false" title="'+i18n.up+': '+(i+1)+' → '+i+'"><span class="sr-av">'+i18n.up+'</span></a> <a href="#" class="down" onclick="interaction.sortableList.sortList(this,'+i+','+(i+1)+',\''+id+'\');return false" title="'+i18n.down+': '+(i+1)+' → '+(i+2)+'"><span class="sr-av">'+i18n.down+'</span></a></span>';
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
			return "<p><strong>"+interaction.i18n.rightAnswer+" </strong>"+rightAnswer+"</p>";
		},
		validate : function(question,id) {
			var i18n = interaction.i18n;
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
				interaction.msg("error",i18n.wrong,id,extra);
				interaction.sortableList.saveResults(question,0,slide,selectedValues);
			} else {
				interaction.msg("success",i18n.right,id);
				interaction.sortableList.saveResults(question,100,slide,selectedValues);
			}
		}
	},	
	clozeActivity : {
		create : function(slide,id,order,e) {
			var i18n = interaction.i18n;
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
					interaction.msg("success",i18n.right,id+"clozeActivityForm");
				} else {
					interaction.msg("error",i18n.wrong,id+"clozeActivityForm",interaction.clozeActivity.getRightAnswer(rightAnswers));
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
			return "<p><strong>"+interaction.i18n.rightAnswer+" </strong>"+rightAnswer+"</p>";
		},
		validate : function(question,id) {
			
			var i18n = interaction.i18n;
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
				interaction.msg("info",i18n.notAnswered,e.id);
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
				interaction.msg("error",i18n.wrong,id,extra);
				interaction.clozeActivity.saveResults(question,result,slide,selectedValues);
			} else {
				interaction.msg("success",i18n.right,id);
				interaction.clozeActivity.saveResults(question,100,slide,selectedValues);
			}

		}
	},
	matchElements : {
		create : function(slide,id,order,e) {
			var i18n = interaction.i18n;
			var html = interaction.getForm.header(id,order,'matchElements');
			if (e.text && e.text!="") html += '<div>'+e.text+'</div>';
			html += '<div class="pairs">';
			var pairs = e.pairs;
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
					interaction.msg("success",i18n.right,id+"matchElementsForm");
				} else {
					interaction.msg("error",i18n.wrong,id+"matchElementsForm",interaction.matchElements.getRightAnswer(pairs));
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
			return "<p><strong>"+interaction.i18n.rightAnswer+" </strong>"+rightAnswer+"</p>";
		},
		validate : function(question,id) {
			var i18n = interaction.i18n;
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
				selects.eq(i).removeClass("field-with-error");
				if(selectedValue != pairs[i][1]) selects.eq(i).addClass("field-with-error");
				else rightAnswered ++;
			}
			// Not 100% answered
			if (!answered) {
				interaction.msg("info",i18n.notAnswered,id);
				return false;
			}
			slide.addClass("disabled");
			$("select",slide).attr("disabled","disabled");
			if (rightAnswered==pairs.length) {
				// 100% right
				interaction.msg("success",i18n.right,id);
				interaction.matchElements.saveResults(question,100,slide,selectedValues);				
			} else {
				// < 100%;
				var extra = interaction.matchElements.getRightAnswer(pairs);
				interaction.msg("error",i18n.wrong,id,extra);
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
			var i18n = interaction.i18n;
			if (interaction.isInExe) return '<input type="button" name="'+id+name+'FormSubmit" id="'+id+name+'FormSubmit" value="'+i18n.check+'" onclick="interaction[\''+name+'\'].validate('+order+',\''+id+name+'Form\');return false" />'
			return '<input type="submit" name="'+id+name+'FormSubmit" id="'+id+name+'FormSubmit" value="'+i18n.check+'" />'			
		}
	},
	singleChoice : {
		create : function(slide,id,order,e) {
			var i18n = interaction.i18n;
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
					interaction.msg("success",i18n.right,id+"singleChoiceForm");
				} else {
					interaction.msg("error",i18n.wrong,id+"singleChoiceForm",interaction.singleChoice.getRightAnswer(currentQuestion.answers));
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
			return "<p><strong>"+interaction.i18n.rightAnswer+" </strong>"+rightAnswer+"</p>";			
		},
		validate : function(question,id) {
			var i18n = interaction.i18n;
			var slide = $("#"+id);
			var selected = $("input[type='radio']:checked",slide);
			if (selected.length==0) {
				interaction.msg("info",i18n.notAnswered,id);
			} else {
				var selectedValue = selected.val();
				var questions = InteractiveVideo.slides[question].answers;
				slide.addClass("disabled");
				$("input[type='radio']",slide).attr("disabled","disabled");
				if (questions[selectedValue][1]==1) {
					interaction.msg("success",i18n.right,id);
					interaction.singleChoice.saveResults(question,100,slide,selectedValue);
				} else {
					var extra = interaction.singleChoice.getRightAnswer(questions);
					interaction.msg("error",i18n.wrong,id,extra);
					interaction.singleChoice.saveResults(question,0,slide,selectedValue);
				}
			}
		}
	},
	multipleChoice : {
		create : function(slide,id,order,e) {
			var i18n = interaction.i18n;
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
					interaction.msg("success",i18n.right,id+"multipleChoiceForm");
				} else {
					interaction.msg("error",i18n.wrong,id+"multipleChoiceForm",interaction.multipleChoice.getRightAnswer(currentQuestion.answers));
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
			return "<p><strong>"+interaction.i18n.rightAnswer+" </strong></p>"+rightAnswer;
		},
		validate : function(question,id) {
			var i18n = interaction.i18n;
			var slide = $("#"+id);
			var selected = $("input[type='checkbox']:checked",slide);
			if (selected.length==0) {
				interaction.msg("info",i18n.notAnswered,id);
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
				if (selected.length>rightAnswers) {
					error = true;
					rightAnswered = 0;
				}
				if (rightAnswers>rightAnswered) error = true;
				if (error) {
					var extra = interaction.multipleChoice.getRightAnswer(questions);
					interaction.msg("error",i18n.wrong,id,extra);
					// %
					var result = (rightAnswered*100/rightAnswers).toFixed(2);
					interaction.multipleChoice.saveResults(question,result,slide,selectedValues);
				} else {
					interaction.msg("success",i18n.right,id);
					// To do: save more than one selected option
					interaction.multipleChoice.saveResults(question,100,slide,selectedValues);
				}
			}
		}
	},	
	track : function(position){
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
	getImage : function(e,w,h,src){
		var maxW = 448;
		var maxH = 356;
		if ($("#activity").css("height")=="478px") {
			maxW = 640;
			maxH = 478;
		}
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
		return '<img src="'+src+'" alt="'+e.description+'" class="'+css+'" width="'+newW+'" height="'+newH+'" style="display:block;margin-top:'+((maxH-newH)/2)+'px" /><a href="'+src+'" target="_blank">'+interaction.i18n.newWindow+'</a>';
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