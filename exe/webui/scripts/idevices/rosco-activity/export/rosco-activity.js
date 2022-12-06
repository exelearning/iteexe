/**
 * Rosco Activity iDevice (Export)
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * 
 * Author: Manuel Narváez Martínez
 * Author: Ricardo Málaga Floriano
 * Author: Ignacio Gros
 * Iconos: Ana María Zamora Moreno y Francisco Javier Pulido
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 *
 */
var $eXeRosco = {
	idevicePath: "",
	mcanvas: {
		width: 360,
		height: 360
	},
	colors: {
		black: "#f9f9f9",
		blue: '#5877c6',
		green: '#00a300',
		red: '#b3092f',
		white: '#ffffff',
		yellow: '#f3d55a',
		blackl: '#333333'


	},
	letters: "",
	angleSize: "",
	radiusLetter: 16,
	options: [],
	msgs: {},
	hasSCORMbutton: false,
	isInExe: false,
	userName: '',
	previousScore: '',
	initialScore: '',
	hasLATEX: false,
	init: function () {
		this.activities = $('.rosco-IDevice');
		if (this.activities.length == 0) return;
		if (!$eXeRosco.supportedBrowser('rosco')) return;
		if (typeof ($exeAuthoring) != 'undefined' && $("#exe-submitButton").length > 0) {
			this.activities.hide();
			if (typeof (_) != 'undefined') this.activities.before('<p>' + _('A-Z Quiz Game') + '</p>');
			return;
		}
		if (typeof ($exeAuthoring) != 'undefined') this.isInExe = true;
		this.idevicePath = this.isInExe ? "/scripts/idevices/rosco-activity/export/" : "";
		if ($("body").hasClass("exe-scorm")) this.loadSCORM_API_wrapper();
		else this.enable();
	},
	loadSCORM_API_wrapper: function () {
		if (typeof (pipwerks) == 'undefined') $exe.loadScript('SCORM_API_wrapper.js', '$eXeRosco.loadSCOFunctions()');
		else this.loadSCOFunctions();
	},
	loadSCOFunctions: function () {
		if (typeof (exitPageStatus) == 'undefined') $exe.loadScript('SCOFunctions.js', '$eXeRosco.enable()');
		else this.enable();
		$eXeRosco.mScorm = scorm;
		var callSucceeded = $eXeRosco.mScorm.init();
		if (callSucceeded) {
			$eXeRosco.userName = $eXeRosco.getUserName();
			$eXeRosco.previousScore = $eXeRosco.getPreviousScore();
			$eXeRosco.mScorm.set("cmi.core.score.max", 10);
			$eXeRosco.mScorm.set("cmi.core.score.min", 0);
			$eXeRosco.initialScore = $eXeRosco.previousScore;
		}
	},
	updateScorm: function (prevScore, repeatActivity, instance) {
		var mOptions = $eXeRosco.options[instance],
			text = '';
		$('#roscoSendScore-' + instance).hide();
		if (mOptions.isScorm === 1) {
			if (repeatActivity && prevScore !== '') {
				text = mOptions.msgs.msgSaveAuto + ' ' + mOptions.msgs.msgYouLastScore + ': ' + prevScore;
			} else if (repeatActivity && prevScore === "") {
				text = mOptions.msgs.msgSaveAuto + ' ' + mOptions.msgs.msgPlaySeveralTimes;
			} else if (!repeatActivity && prevScore === "") {
				text = mOptions.msgs.msgOnlySaveAuto;
			} else if (!repeatActivity && prevScore !== "") {
				text = mOptions.msgs.msgActityComply + ' ' + mOptions.msgs.msgYouLastScore + ': ' + prevScore;
			}
		} else if (mOptions.isScorm === 2) {
			$('#roscoSendScore-' + instance).show();
			if (repeatActivity && prevScore !== '') {
				text = mOptions.msgs.msgPlaySeveralTimes + ' ' + mOptions.msgs.msgYouLastScore + ': ' + prevScore;
			} else if (repeatActivity && prevScore === '') {
				text = mOptions.msgs.msgSeveralScore;
			} else if (!repeatActivity && prevScore === '') {
				text = mOptions.msgs.msgOnlySaveScore;
			} else if (!repeatActivity && prevScore !== '') {
				$('#roscoSendScore-' + instance).hide();
				text = mOptions.msgs.msgActityComply + ' ' + mOptions.msgs.msgYouScore + ': ' + prevScore;
			}
		}
		$('#roscoRepeatActivity-' + instance).text(text);
		$('#roscoRepeatActivity-' + instance).fadeIn(1000);
	},

	getUserName: function () {
		var user = $eXeRosco.mScorm.get("cmi.core.student_name");
		return user
	},
	getPreviousScore: function () {
		var score = $eXeRosco.mScorm.get("cmi.core.score.raw");
		return score;
	},
	endScorm: function () {
		$eXeRosco.mScorm.quit();
	},
	enable: function () {
		$eXeRosco.loadGame();

	},
	Decrypt: function (str) {
		if (!str) str = "";
		str = (str == "undefined" || str == "null") ? "" : str;
		str = unescape(str)
		try {
			var key = 146;
			var pos = 0;
			var ostr = '';
			while (pos < str.length) {
				ostr = ostr + String.fromCharCode(key ^ str.charCodeAt(pos));
				pos += 1;
			}

			return ostr;
		} catch (ex) {
			return '';
		}
	},
	loadGame: function () {
		$eXeRosco.options = [];
		$('.rosco-IDevice').each(function (i) {
			var version = $(".rosco-version", this).eq(0).text(),
				dl = $(".rosco-DataGame", this),
				imagesLink = $('.rosco-LinkImages', this),
				audiosLink = $('.rosco-LinkAudios', this),
				option = $eXeRosco.loadDataGame(dl, imagesLink, audiosLink, version);
			option.radiusLetter = 16 + Math.floor((27 - option.letters.length) / 3);
			option.angleSize = 2 * Math.PI / option.letters.length;
			$eXeRosco.options.push(option);
			var rosco = $eXeRosco.createInterfaceRosco(i);
			dl.before(rosco).remove();
			var msg = $eXeRosco.options[i].msgs.msgPlayStart;
			$('#roscoGameMinimize-' + i).hide();
			$('#roscoGameContainer-' + i).hide();
			$('#roscoGame-' + i).hide();
			if ($eXeRosco.options[i].showMinimize) {
				$('#roscoGameMinimize-' + i).css({
					'cursor': 'pointer'
				}).show();
			} else {
				$('#roscoGameContainer-' + i).show();
				$('#roscoGame-' + i).show();
			}
			$('#roscoMessageMaximize-' + i).text(msg);
			$eXeRosco.addEvents(i);
		});
		if ($eXeRosco.hasLATEX && typeof (MathJax) == "undefined") {
			$eXeRosco.loadMathJax();
		}

	},

	isJsonString: function (str) {
		try {
			var o = JSON.parse(str, null, 2);
			if (o && typeof o === "object") {
				return o;
			}
		} catch (e) {}
		return false;
	},

	loadDataGame: function (data, imgsLink, audiosLink, version) {
		var json = data.text();
		version = typeof version == "undefined" || version == '' ? 0 : parseInt(version);
		if (version > 0) {
			json = $eXeRosco.Decrypt(json);
		}
		var mOptions = $eXeRosco.isJsonString(json),
			hasLatex = /(?:\\\(|\\\[|\\begin\{.*?})/.test(json);
		if (hasLatex) {
			$eXeRosco.hasLATEX = true;
		}
		mOptions.playerAudio = "";
		mOptions.gameOver = false;
		mOptions.modeBoard = typeof mOptions.modeBoard == "undefined" ? false : mOptions.modeBoard;
		imgsLink.each(function (index) {
			mOptions.wordsGame[index].url = $(this).attr('href');
			if (mOptions.wordsGame[index].url.length < 4) {
				mOptions.wordsGame[index].url = "";
			}
		});
		audiosLink.each(function (index) {
			mOptions.wordsGame[index].audio = $(this).attr('href');
			if (mOptions.wordsGame[index].audio.length < 4) {
				mOptions.wordsGame[index].audio = "";
			}
		});
		for (var i = 0; i < mOptions.wordsGame.length; i++) {
			if (version < 2) {
				mOptions.wordsGame[i].audio = typeof mOptions.wordsGame[i].audio == 'undefined' ? '' : mOptions.wordsGame[i].audio
			}
			mOptions.wordsGame[i].url = $eXeRosco.extractURLGD(mOptions.wordsGame[i].url);
		}
		return mOptions;
	},

	createInterfaceRosco: function (instance) {
		var aLetters = this.getLettersRosco(instance),
			sTime = this.getTimeToString(this.options[instance].durationGame),
			msgs = this.options[instance].msgs,
			html = '',
			path = $eXeRosco.idevicePath;
		html += '<div class="rosco-Main">\
				<div class="rosco-MainContainer" id="roscoMainContainer-' + instance + '">\
				<div class="rosco-GameMinimize" id="roscoGameMinimize-' + instance + '">\
				<a href="#" class="rosco-LinkMaximize" id="roscoLinkMaximize-' + instance + '" title="' + msgs.msgMaximize + '"><img src="' + path + 'rosco-icon.png" class="rosco-IconMinimize" id="roscoIcon-' + instance + '" alt="">\
					<div  class="rosco-MessageMaximize" id="roscoMessageMaximize-' + instance + '">' + msgs.msgPlayStart + '</div></a>\
				</div>\
				<div class="rosco-GameContainer" id="roscoGameContainer-' + instance + '">\
					<div class="rosco-GameScoreBoard">\
						<div class="rosco-GameScores">\
							<strong class="sr-av">' + msgs.msgHits + ':</strong>\
							<div class="exeQuextIcons exeQuextIcons-Hit" title="' + msgs.msgHits + '"></div>\
							<p  id="roscotPHits-' + instance + '">0</p>\
							<strong class="sr-av">' + msgs.msgErrors + ':</strong>\
							<div class="exeQuextIcons  exeQuextIcons-Error" title="' + msgs.msgErrors + '"></div>\
							<p id="roscotPErrors-' + instance + '">0</p>\
						</div>\
						<div class="rosco-TimeNumber">\
							<strong class="sr-av">' + msgs.msgTime + ':</strong>\
							<div class="exeQuextIcons  exeQuextIcons-Time" title="' + msgs.msgTime + '"></div>\
							<p class="rosco-PTime"  id="roscoPTime-' + instance + '">' + sTime + '</p>\
							<div class="exeQuextIcons  exeQuextIcons-OneRound" id="roscoNumberRounds-' + instance + '" title="' + msgs.msgOneRound + '"></div>\
							<strong class="sr-av" id="roscoNumberRoundsSpan-' + instance + '">' + msgs.msgOneRound + ':</strong>\
							<a href="#" class="rosco-LinkArrowMinimize" id="roscoLinkArrowMinimize-' + instance + '" title="' + msgs.msgMinimize + '">\
								<strong class="sr-av">' + msgs.msgMinimize + ':</strong>\
								<div class="exeQuextIcons exeQuextIcons-Minimize"></div>\
							</a>\
							<a href="#" class="rosco-LinkTypeGame" id="roscoLinkTypeGame-' + instance + '" title="' + msgs.msgHideRoulette + '">\
								<strong class="sr-av">' + msgs.msgHideRoulette + ':</strong>\
								<div class="exeQuextIcons exeQuextIcons-RoscoRows" id="roscoTypeGame-' + instance + '"></div>\
							</a>\
							<a href="#" class="rosco-LinkFullScreen" id="roscoLinkFullScreen-' + instance + '" title="' + msgs.msgFullScreen + '">\
                        		<strong class="sr-av">' + msgs.msgFullScreen + ':</strong>\
                        		<div class="exeQuextIcons exeQuextIcons-FullScreen" id="roscoFullScreen-' + instance + '"></div>\
                			</a>\
						</div>\
					</div>\
					<div class="rosco-Letters" id="roscoLetters-' + instance + '">' + aLetters + '</div>\
					<div class="rosco-ShowClue" id="roscoShowClue-' + instance + '">\
						<div class="sr-av">' + msgs.msgClue + ':</div>\
						<p class="rosco-PShowClue rosco-parpadea" id="roscoPShowClue-' + instance + '"></p>\
			   		</div>\
					<div class="rosco-Multimedia" id="roscoMultimedia-' + instance + '">\
						<div class="rosco-Protector" id="roscoProtector-' + instance + '"></div>\
						<img src="' + path + 'exequextcursor.gif" class="rosco-Cursor" alt="" id="roscoCursor-' + instance + '"/> \
						<img src="" class="rosco-Image" alt="' + msgs.msgNoImage + '" id="roscoHomeImage-' + instance + '"/> \
						<img src="' + path + 'roscoHome.png" class="rosco-NoImage" alt="' + msgs.msgNoImage + '" id="roscoNoImage-' + instance + '"/> \
						<a href="#" class="rosco-LinkAudio" id="roscoLinkAudio-' + instance + '" title="' + msgs.msgAudio + '"><img src="' + path + 'exequextaudio.png" alt="' + msgs.msgAudio + '"></a>\
					</div>\
					<div class="rosco-AuthorLicence" id="roscoAutorLicence-' + instance + '">\
						<div class="sr-av">' + msgs.msgAuthor + ':</div>\
						<p id="roscoAuthor-' + instance + '"></p>\
					</div>\
						<div class="rosco-Messages" id="roscoMessages-' + instance + '">\
							<p id="roscoPMessages-' + instance + '">' + msgs.msgReady + '</p>\
					</div>\
					<div class="sr-av" id="roscoStartGameSRAV-' + instance + '">' + msgs.msgPlayStart + ':</div>\
					<div class="rosco-StartGame"><a href="#" id="roscoStartGame-' + instance + '"></a></div>\
					<div class= "rosco-QuestionDiv" id="roscoQuestionDiv-' + instance + '">\
						<div  class="rosco-TypeDefinition"  id="roscoTypeDefinition-' + instance + '">\
							<p  id="roscoPStartWith-' + instance + '">' + msgs.msgStartWith + '</p>\
						</div>\
						<div  class="rosco-Definition" id="roscoDefinition-' + instance + '">\
							<h3 class="sr-av">' + msgs.msgQuestion + ':</h3>\
							<p id="roscoPDefinition-' + instance + '"></p>\
						</div>\
						<div class="rosco-DivReply" id="roscoDivReply-' + instance + '">\
							<a href="#" id="roscoBtnMoveOn-' + instance + '" title="' + msgs.msgMoveOne + '">\
								<strong class="sr-av">' + msgs.msgMoveOne + '</strong>\
								<div class="exeQuextIcons-MoveOne"></div>\
							</a>\
							<input type="text" value="" class="rosco-EdReply" id="roscoEdReply-' + instance + '" autocomplete="off">\
							<a href="#" id="roscoBtnReply-' + instance + '" title="' + msgs.msgReply + '">\
								<strong class="sr-av">' + msgs.msgReply + '</strong>\
								<div class="exeQuextIcons-Submit"></div>\
							</a>\
						</div>\
					</div>\
					<div class="rosco-DivInstructions" id="roscoDivInstructions-' + instance + '">' + msgs.msgWrote + '</div>\
				</div>\
				<div id="roscoGame-' + instance + '"class="rosco-Game">\
					<canvas class="rosco-Canvas" id="roscoCanvas-' + instance + '" width="360px" height="360px">\
						Your browser does not support the HTML5 canvas tag\
					</canvas>\
				</div>\
				<div class="rosco-Cubierta" id="roscoCubierta-' + instance + '" style="display:none">\
					<div class="rosco-CodeAccessDiv" id="roscoCodeAccessDiv-' + instance + '">\
						<div class="rosco-MessageCodeAccessE" id="roscoMesajeAccesCodeE-' + instance + '"></div>\
						<div class="rosco-DataCodeAccessE">\
							<label for="roscoEdCodeAccess-' + instance + '" class="sr-av">' + msgs.msgCodeAccess + ':</label><input type="text" class="rosco-CodeAccessE" id="roscoEdCodeAccess-' + instance + '" placeholder="' + msgs.msgCodeAccess + '">\
							<a href="#" id="roscoCodeAccessButton-' + instance + '" title="' + msgs.msgReply + '">\
							<strong class="sr-av">' + msgs.msgReply + '</strong>\
							<div class="exeQuextIcons-Submit"></div>\
							</a>\
						</div>\
					</div>\
                </div>\
            </div>\
			</div>\
			<div class="rosco-DivModeBoard" id="roscoDivModeBoard-' + instance + '">\
				<a href="#" class="rosco-ModeBoard" id="roscoModeBoardOK-' + instance + '" title="">' + msgs.msgCorrect + '</a>\
				<a href="#" class="rosco-ModeBoard" id="roscoModeBoardMoveOn-' + instance + '" title="">' + msgs.msgMoveOne + '</a>\
				<a href="#" class="rosco-ModeBoard" id="roscoModeBoardKO-' + instance + '" title="">' + msgs.msgIncorrect + '</a>\
			</div>\
			' + this.addButtonScore(instance) +
			'</div>';
		return html
	},
	showCubiertaOptions(mode, instance) {
		if (mode === false) {
			$('#roscoCubierta-' + instance).fadeOut();
			return;
		}
		$('#roscoCubierta-' + instance).fadeIn();
	},
	changeTextInit: function (big, message, instance) {
		var html = message;
		if (big) {
			html = '<a href="#">' + message + '</a>';
			$('#roscoDivReply-' + instance).css("visibility", "hidden");
		}

	},
	addButtonScore: function (instance) {
		var mOptions = $eXeRosco.options[instance];
		var butonScore = "";
		if (mOptions.isScorm == 2) {
			var buttonText = mOptions.textButtonScorm;
			if (buttonText != "") {
				if (this.hasSCORMbutton == false && ($("body").hasClass("exe-authoring-page") || $("body").hasClass("exe-scorm"))) {
					this.hasSCORMbutton = true;
					var fB = '<div class="rosco-GetScore"  id="roscoButonScoreDiv-' + instance + '">';
					if (!this.isInExe) fB += '<form action="#" onsubmit="return false">';
					fB += '<p><input type="button" id="roscoSendScore-' + instance + '" value="' + buttonText + '" class="feedbackbutton" /> <span class="rosco-RepeatActivity" id="roscoRepeatActivity-' + instance + '"></span></p>';
					if (!this.isInExe) fB += '</form>';
					fB += '</div>';
					butonScore = fB;
				}
			}
		} else if (mOptions.isScorm == 1) {
			if (this.hasSCORMbutton == false && ($("body").hasClass("exe-authoring-page") || $("body").hasClass("exe-scorm"))) {
				this.hasSCORMbutton = true;
				var fB = '<div class="rosco-GetScore" id="roscoButonScoreDiv-' + instance + '">';
				fB += '<p><span class="rosco-RepeatActivity" id="roscoRepeatActivity-' + instance + '"></span></p>';
				fB += '</div>';
				butonScore = fB;
			}
		}
		return butonScore;
	},
	sendScore: function (instance, auto) {
		var mOptions = $eXeRosco.options[instance],
			message = '',
			score = ((mOptions.hits * 10) / mOptions.validWords).toFixed(2);
		if (mOptions.gameStarted || mOptions.gameOver) {
			if (typeof $eXeRosco.mScorm != 'undefined') {
				if (!auto) {
					if (!mOptions.repeatActivity && $eXeRosco.previousScore !== '') {
						message = $eXeRosco.userName !== '' ? $eXeRosco.userName + ' ' + mOptions.msgs.msgOnlySaveScore : mOptions.msgs.msgOnlySaveScore;
					} else {
						$eXeRosco.previousScore = score;
						$eXeRosco.mScorm.set("cmi.core.score.raw", score);
						message = $eXeRosco.userName !== '' ? $eXeRosco.userName + ', ' + $exe_i18n.yourScoreIs + ' ' + score : $exe_i18n.yourScoreIs + ' ' + score;
						if (!mOptions.repeatActivity) {
							$('#roscoSendScore-' + instance).hide();
						}
						$('#roscoRepeatActivity-' + instance).text($exe_i18n.yourScoreIs + ' ' + score)
						$('#roscoRepeatActivity-' + instance).show();
					}
				} else {
					$eXeRosco.previousScore = score;
					score = score === "" ? 0 : score;
					$eXeRosco.mScorm.set("cmi.core.score.raw", score);
					$('#roscoRepeatActivity-' + instance).text($exe_i18n.yourScoreIs + ' ' + score)
					$('#roscoRepeatActivity-' + instance).show();
					message = "";
				}
			} else {
				message = mOptions.msgs.msgScoreScorm;
			}

		} else {
			var hasClass = $("body").hasClass("exe-scorm");
			message = (hasClass) ? mOptions.msgs.msgEndGameScore : mOptions.msgs.msgScoreScorm;
		}
		if (!auto) alert(message);
	},
	getLettersRosco: function (instance) {
		var mLetters = [],
			mOptions = $eXeRosco.options[instance],
			letras = mOptions.letters;
		for (var i = 0; i < mOptions.wordsGame.length; i++) {
			var letter = '<div class="rosco-Letter rosco-LetterBlack" id="letterR' + letras[i] + '-' + instance + '">' + letras[i] + '</div>',
				word = $.trim(mOptions.wordsGame[i].word);
			if (word.length > 0) {
				letter = '<div class="rosco-Letter" id="letterR' + letras[i] + '-' + instance + '">' + $eXeRosco.getRealLetter(letras[i]) + '</div>';
			}
			mLetters.push(letter);
		}
		var html = mLetters.join('');
		return html;
	},

	addEvents: function (instance) {
		var mOptions = $eXeRosco.options[instance];
		$('#roscoHomeImage-' + instance).hide();
		$('#roscoCursor-' + instance).hide();
		$('#roscoQuestionDiv-' + instance).hide();
		$('#roscoStartGame-' + instance).show();
		$('#roscoPShowClue-' + instance).hide();
		if (mOptions.itinerary.showCodeAccess) {
			$('#roscoMesajeAccesCodeE-' + instance).text(mOptions.itinerary.messageCodeAccess);
			$('#roscoCodeAccessDiv-' + instance).show();
			$('#roscoStartGame-' + instance).hide();
			$('#roscoDivInstructions-' + instance).hide();
			$eXeRosco.showCubiertaOptions(true, instance)
			//$('#roscoEdCodeAccess-' + instance).focus();
		}
		$('#roscoCodeAccessButton-' + instance).on('click', function (e) {
			e.preventDefault();
			var keyIntroduced = $.trim($('#roscoEdCodeAccess-' + instance).val()).toUpperCase(),
				correctKey = $.trim(mOptions.itinerary.codeAccess).toUpperCase();
			if (keyIntroduced == correctKey) {
				$eXeRosco.showCubiertaOptions(false, instance);
				$eXeRosco.startGame(instance);
			} else {
				$('#roscoMesajeAccesCodeE-' + instance).fadeOut(300).fadeIn(200).fadeOut(300).fadeIn(200);
				$('#roscoEdCodeAccess-' + instance).val('');
			}
		});
		$('#roscoStartGame-' + instance).text(mOptions.msgs.msgStartGame);
		$('#roscoStartGame-' + instance).on('click', function (e) {
			e.preventDefault();
			$eXeRosco.startGame(instance);
		})

		$("#roscoLinkMaximize-" + instance).on('click touchstart', function (e) {
			e.preventDefault();
			$("#roscoGameContainer-" + instance).show();
			$("#roscoGame-" + instance).show();
			$("#roscoGameMinimize-" + instance).hide();
			$('#roscoTypeGame-' + instance).removeClass('exeQuextIcons-RoscoRows');
			$('#roscoTypeGame-' + instance).addClass('exeQuextIcons-RoscoCanvas');
			$('#roscoLinkTypeGame-' + instance).find('span').text(mOptions.msgs.msgHideRoulette);
			$('#roscoLinkTypeGame-' + instance).attr('title', mOptions.msgs.msgHideRoulette);
		});

		$("#roscoLinkArrowMinimize-" + instance).on('click touchstart', function (e) {
			e.preventDefault();
			$("#roscoGame-" + instance).hide();
			$('#roscoLetters-' + instance).hide();
			$("#roscoGameContainer-" + instance).hide();
			$("#roscoGameMinimize-" + instance).css('visibility', 'visible').show();
		});

		$('#roscoEdCodeAccess-' + instance).on("keydown", function (event) {
			if (event.which == 13 || event.keyCode == 13) {
				$('#roscoCodeAccessButton-' + instance).trigger('click');
				return false;
			}
			return true;
		});
		var mTime = mOptions.durationGame,
			sTime = $eXeRosco.getTimeToString(mTime),
			altTurn = mOptions.numberTurns === 1 ? mOptions.msgOneRound : mOptions.msgTowRounds;
		if (mOptions.numberTurns === 1) {
			$('#roscoNumberRounds-' + instance).addClass("exeQuextIcons-OneRound").removeClass("exeQuextIcons-TwoRounds").attr('alt', 'One turn');
		} else {
			$('#roscoNumberRounds-' + instance).addClass("exeQuextIcons-TwoRounds").removeClass("exeQuextIcons-OneRound").attr('alt', 'Two turns');
		}
		$('#roscoNumberRoundsSpan-' + instance).text(altTurn);
		$('#roscoPTime-' + instance).text(sTime);
		$('#roscoBtnMoveOn-' + instance).on('click', function (e) {
			e.preventDefault();
			$eXeRosco.passWord(instance);
		});
		$('#roscoBtnReply-' + instance).on('click', function (e) {
			e.preventDefault();
			$eXeRosco.answerQuetion(instance);
		});
		$('#roscoEdReply-' + instance).on("keydown", function (event) {
			if (event.which == 13 || event.keyCode == 13) {
				$eXeRosco.answerQuetion(instance);
				return false;
			}
			return true;
		});
		var id = 'roscoCanvas-' + instance,
			rosco = document.getElementById(id);
		mOptions.ctxt = rosco.getContext("2d");
		$eXeRosco.drawRosco(instance);
		$('#roscoLetters-' + instance).hide();;
		$('#roscoMessages-' + instance).hide();
		$('#roscoTypeGame-' + instance).removeClass('exeQuextIcons-RoscoRows');
		$('#roscoTypeGame-' + instance).addClass('exeQuextIcons-RoscoCanvas');
		$('#roscoLinkTypeGame-' + instance).on('click', function (e) {
			e.preventDefault();
			var alt = mOptions.msgs.msgHideRoulette;
			if ($('#roscoTypeGame-' + instance).hasClass('exeQuextIcons-RoscoCanvas')) {
				$('#roscoTypeGame-' + instance).addClass('exeQuextIcons-RoscoRows');
				$('#roscoTypeGame-' + instance).removeClass('exeQuextIcons-RoscoCanvas');
				$('#roscoLetters-' + instance).show();
				$('#roscoMessages-' + instance).show();
				$('#roscoGame-' + instance).hide();
				alt = mOptions.msgs.msgShowRoulette;
			} else {
				$('#roscoTypeGame-' + instance).addClass('exeQuextIcons-RoscoCanvas');
				$('#roscoTypeGame-' + instance).remove('exeQuextIcons-RoscoRows');
				$('#roscoLetters-' + instance).hide();
				$('#roscoMessages-' + instance).hide();
				$('#roscoGame-' + instance).show();
			}
			$('#roscoLinkTypeGame-' + instance).attr('title', alt);
			$('#roscoLinkTypeGame-' + instance).find('span').text(alt);

		});
		$eXeRosco.drawText(mOptions.msgs.msgReady, $eXeRosco.colors.blue, instance);
		$('#roscoPMessages-' + instance).css('color', $eXeRosco.colors.blackl);
		$eXeRosco.drawRows(instance);
		$("#roscoSendScore-" + instance).click(function (e) {
			e.preventDefault();
			$eXeRosco.sendScore(instance, false);
		});
		if (mOptions.isScorm > 0) {
			$eXeRosco.updateScorm($eXeRosco.previousScore, mOptions.repeatActivity, instance);
		}
		$(window).on('unload', function () {
			if (typeof $eXeRosco.mScorm != "undefined") {
				$eXeRosco.endScorm();
			}
		});
		$('#roscoTypeGame-' + instance).show();
		if ($('#roscoMainContainer-' + instance).width() < 670) {
			$('#roscoTypeGame-' + instance).addClass('exeQuextIcons-RoscoRows');
			$('#roscoTypeGame-' + instance).removeClass('exeQuextIcons-RoscoCanvas');
			$('#roscoLetters-' + instance).show();
			$('#roscoMessages-' + instance).show();
			$('#roscoGame-' + instance).hide();
			$('#roscoTypeGame-' + instance).hide();
		}

		window.addEventListener('resize', function () {
			$('#roscoTypeGame-' + instance).show();
			if ($('#roscoMainContainer-' + instance).width() < 670) {
				$('#roscoTypeGame-' + instance).addClass('exeQuextIcons-RoscoRows');
				$('#roscoTypeGame-' + instance).removeClass('exeQuextIcons-RoscoCanvas');
				$('#roscoLetters-' + instance).show();
				$('#roscoMessages-' + instance).show();
				$('#roscoGame-' + instance).hide();
				$('#roscoTypeGame-' + instance).hide();
			}
			$eXeRosco.refreshImageActive(instance);
		});

		$('#roscoLinkAudio-' + instance).on('click', function (e) {
			e.preventDefault();
			var audio = mOptions.wordsGame[mOptions.activeWord].audio;
			$eXeRosco.stopSound(instance);
			$eXeRosco.playSound(audio, instance);
		});

		$("#roscoLinkFullScreen-" + instance).on('click touchstart', function (e) {
			e.preventDefault();
			var element = document.getElementById('roscoMainContainer-' + instance);
			$eXeRosco.toggleFullscreen(element, instance);
		});
		$('#roscoModeBoardOK-' + instance).on('click', function (e) {
			e.preventDefault();
			$eXeRosco.answerQuetionBoard(true, instance)

		});
		$('#roscoModeBoardKO-' + instance).on('click', function (e) {
			e.preventDefault();
			$eXeRosco.answerQuetionBoard(false, instance)

		});
		$('#roscoModeBoardMoveOn-' + instance).on('click', function (e) {
			e.preventDefault();
			$eXeRosco.passWord(instance);
		});


	},

	startGame: function (instance) {
		var mOptions = $eXeRosco.options[instance];
		if (mOptions.gameStarted) {
			return;
		}
		$('#roscoStartGame-' + instance).hide();
		$('#roscoCodeAccessDiv-' + instance).hide();
		$('#roscoQuestionDiv-' + instance).show();
		$('#roscoDivInstructions-' + instance).hide();
		mOptions.obtainedClue = false;
		mOptions.hits = 0;
		mOptions.solucion = '';
		mOptions.errors = 0;
		mOptions.score = 0;
		mOptions.counter = mOptions.durationGame;
		mOptions.gameActived = false;
		mOptions.gameOver = false;
		mOptions.activeGameSpin = 1;
		mOptions.validWords = 0;
		mOptions.answeredWords = 0;
		mOptions.activeWord = -1;
		for (var i = 0; i < mOptions.wordsGame.length; i++) {
			mOptions.wordsGame[i].state = mOptions.wordsGame[i].word.trim().length == 0 ? 0 : 1;
			var mBackColor = $eXeRosco.colors.black;
			if (mOptions.wordsGame[i].state == 1) {
				mOptions.validWords++;
				mBackColor = $eXeRosco.colors.blue;
			}
			var letter = '#letterR' + mOptions.letters.charAt(i) + '-' + instance;
			$(letter).css({
				'background-color': mBackColor,
				'color': $eXeRosco.colors.white
			})
		}
		$eXeRosco.uptateTime(mOptions.durationGame, instance);
		$eXeRosco.drawRosco(instance);
		mOptions.counterClock = setInterval(function () {
			$eXeRosco.uptateTime(mOptions.counter, instance);
			mOptions.counter--;
			if (mOptions.counter <= 0) {
				clearInterval(mOptions.counterClock)
				$eXeRosco.gameOver(1, instance);
				return;
			}
		}, 1000);
		mOptions.obtainedClue = false;
		$('#roscoPShowClue-' + instance).text('');
		$('#roscoPShowClue-' + instance).hide();
		$('#roscotPHits-' + instance).text(mOptions.hits);
		$('#roscotPErrors-' + instance).text(mOptions.errors);
		$('#roscoBtnReply-' + instance).prop('disabled', false);
		$('#roscoBtnMoveOn-' + instance).prop('disabled', false);
		$('#roscoEdReply-' + instance).prop('disabled', false).focus();
		var mTime = mOptions.durationGame,
			sTime = $eXeRosco.getTimeToString(mTime),
			altTurn = mOptions.numberTurns === 1 ? mOptions.msgOneRound : mOptions.msgTowRounds;
		if (mOptions.numberTurns === 1) {
			$('#roscoNumberRounds-' + instance).addClass("exeQuextIcons-OneRound").removeClass("exeQuextIcons-TwoRounds").attr('alt', 'One turn');
		} else {
			$('#roscoNumberRounds-' + instance).addClass("exeQuextIcons-TwoRounds").removeClass("exeQuextIcons-OneRound").attr('alt', 'Two turns');
		}
		$('#roscoNumberRoundsSpan-' + instance).text(altTurn);
		$('#roscoPTime-' + instance).text(sTime);
		mOptions.gameActived = true;
		$eXeRosco.newWord(instance);
		mOptions.gameStarted = true;

	},

	uptateTime: function (tiempo, instance) {
		var mTime = $eXeRosco.getTimeToString(tiempo),
			mOptions = $eXeRosco.options[instance];
		$('#roscoPTime-' + instance).text(mTime);
		if (mOptions.gameActived) {
			$eXeRosco.drawLetterActive(mOptions.activeWord, instance);
		}
	},

	getTimeToString: function (iTime) {
		var mMinutes = parseInt(iTime / 60) % 60,
			mSeconds = iTime % 60;
		return (mMinutes < 10 ? "0" + mMinutes : mMinutes) + ":" + (mSeconds < 10 ? "0" + mSeconds : mSeconds);
	},

	getRetroFeedMessages: function (iHit, instance) {
		var mOptions = $eXeRosco.options[instance],
			msgs = mOptions.msgs;
		var sMessages = iHit ? msgs.msgSuccesses.split('|') : msgs.msgFailures.split('|');
		return sMessages[Math.floor(Math.random() * sMessages.length)];
	},

	gameOver: function (type, instance) {
		var mOptions = $eXeRosco.options[instance],
			msgs = mOptions.msgs;
		clearInterval(mOptions.counterClock);
		$eXeRosco.uptateTime(mOptions.counter, instance);
		$('#roscoDivModeBoard-' + instance).hide();

		var msg = msgs.msgYouHas.replace('%1', mOptions.hits);
		msg = msg.replace('%2', mOptions.errors)
		$('#roscoMessages-' + instance).show();
		$('#roscoStartGame-' + instance).show();
		$('#roscoQuestionDiv-' + instance).hide();

		$('#roscoDivInstructions-' + instance).show();
		mOptions.activeWord = 0;
		mOptions.answeredWords = 0;
		mOptions.gameOver = true;
		$eXeRosco.drawRosco(instance);
		$eXeRosco.drawText(msgs.msgGameOver, $eXeRosco.colors.red, instance);
		$('#roscoEdReply-' + instance).val('');
		$eXeRosco.showImage('', 0, 0, '', '', instance);
		mOptions.gameStarted = false;
		if (mOptions.isScorm == 1) {
			if (mOptions.repeatActivity || $eXeRosco.initialScore === '') {
				var score = ((mOptions.hits * 10) / mOptions.validWords).toFixed(2);
				$eXeRosco.sendScore(instance, true);
				$('#roscoRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score);
				$eXeRosco.initialScore = score;
			}
		}
		$('#roscoPMessages-' + instance).text(msg).css("color", $eXeRosco.colors.blackl);
		$eXeRosco.stopSound(instance);
		$('#roscoLinkAudio-' + instance).hide();
	},

	drawText: function (texto, color, instance) {
		var ctxt = $eXeRosco.options[instance].ctxt,
			mOptions = $eXeRosco.options[instance],
			whidthCtxt = $eXeRosco.mcanvas.width,
			heightCtxt = $eXeRosco.mcanvas.height,
			radiusLetter = mOptions.radiusLetter,
			xCenter = whidthCtxt / 2,
			yCenter = heightCtxt / 2,
			wText = whidthCtxt - 7 * radiusLetter,
			xMessage = xCenter - wText / 2,
			yMessage = yCenter,
			font = 'bold 18px sans-serif';
		ctxt.font = font;
		var whidthText = ctxt.measureText(texto).width,
			xText = xCenter - whidthText / 2,
			yText = yMessage;
		ctxt.fillStyle = 'transparent';
		ctxt.fillRect(xMessage, yMessage, wText, 30);
		ctxt.textAlig = "center";
		ctxt.textBaseline = 'top';
		ctxt.fillStyle = color;
		ctxt.fillText(texto, xText, yText + 3);
		ctxt.closePath();
		$('#roscoPMessages-' + instance).css("color", color).text(texto);
	},

	showWord: function (activeLetter, instance) {
		var mOptions = $eXeRosco.options[instance],
			msgs = mOptions.msgs,
			mWord = mOptions.wordsGame[activeLetter],
			definition = mWord.definition,
			letter = $eXeRosco.getRealLetter(mOptions.letters.charAt(activeLetter)),
			start = mWord.type == 0 ? msgs.msgStartWith : msgs.msgContaint;
		start = start.replace('%1', letter);
		$('#roscoPDefinition-' + instance).text(definition);
		$('#roscoPStartWith-' + instance).text(start);
		$('#roscoEdReply-' + instance).val("");
		$('#roscoPMessages-' + instance).val('');
		$('#roscoLinkAudio-' + instance).hide();
		$eXeRosco.drawRosco(instance);
		$eXeRosco.drawText('', $eXeRosco.colors.blue, instance);
		$eXeRosco.options[instance].gameActived = true;
		$('#roscoBtnReply-' + instance).prop('disabled', false);
		$('#roscoBtnMoveOn-' + instance).prop('disabled', false);
		$eXeRosco.showImage(mWord.url, mWord.x, mWord.y, mWord.author, mWord.alt, instance);
		$('#roscoEdReply-' + instance).prop('disabled', false).focus();
		if (mOptions.isScorm == 1) {
			if (mOptions.repeatActivity || $eXeRosco.initialScore === '') {
				var score = ((mOptions.hits * 10) / mOptions.validWords).toFixed(2);
				$eXeRosco.sendScore(instance, true);
				$('#roscoRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score);

			}
		}
		if (mWord.audio.length > 4) {
			$('#roscoLinkAudio-' + instance).show();
		}

		$eXeRosco.stopSound(instance);
		if (mWord.audio.trim().length > 4) {
			$eXeRosco.playSound(mWord.audio.trim(), instance);
		}
		if (mOptions.modeBoard) {
			$('#roscoDivModeBoard-' + instance).css('display', 'flex');
			$('#roscoDivModeBoard-' + instance).fadeIn();
		}
		var html = $('#roscoPDefinition-' + instance).html(),
			latex = /(?:\\\(|\\\[|\\begin\{.*?})/.test(html);
		if (latex) {
			$eXeRosco.updateLatex('roscoPDefinition-' + instance)
		}
	},

	playSound: function (selectedFile, instance) {
		var mOptions = $eXeRosco.options[instance];
		selectedFile = $eXeRosco.extractURLGD(selectedFile);
		mOptions.playerAudio = new Audio(selectedFile);
		mOptions.playerAudio.addEventListener("canplaythrough", function (event) {
			mOptions.playerAudio.play();
		});

	},
	stopSound: function (instance) {
		var mOptions = $eXeRosco.options[instance];
		if (mOptions.playerAudio && typeof mOptions.playerAudio.pause == "function") {
			mOptions.playerAudio.pause();
		}
	},

	showImage: function (url, x, y, author, alt, instance) {
		var $cursor = $('#roscoCursor-' + instance),
			$noImage = $('#roscoNoImage-' + instance),
			$Image = $('#roscoHomeImage-' + instance),
			$Author = $('#roscoAuthor-' + instance);
		$Image.attr('alt', 'No image');
		$cursor.hide();
		$Image.hide();
		$noImage.hide();
		if ($.trim(url).length == 0) {
			$cursor.hide();
			$Image.hide();
			$noImage.show();
			$Author.text('');
			return false;
		};
		$Image.prop('src', url)
			.on('load', function () {
				if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
					$cursor.hide();
					$Image.hide();
					$noImage.show();
					$Author.text('');
					return false;
				} else {
					var mData = $eXeRosco.placeImageWindows(this, this.naturalWidth, this.naturalHeight);
					$eXeRosco.drawImage(this, mData);
					$Image.show();
					$cursor.show();
					$noImage.hide();
					$Author.text(author);
					$Image.attr('alt', alt);
					$eXeRosco.paintMouse(this, $cursor, x, y);
					return true;
				}
			}).on('error', function () {
				$cursor.hide();
				$Image.hide();
				$noImage.show();
				$Author.text('');
				return false;
			});
	},

	drawImage: function (image, mData) {
		$(image).css({
			'left': mData.x + 'px',
			'top': mData.y + 'px',
			'width': mData.w + 'px',
			'height': mData.h + 'px'
		});
	},

	paintMouse: function (image, cursor, x, y) {
		x = parseFloat(x) || 0;
		y = parseFloat(y) || 0;
		$(cursor).hide();
		if (x > 0 || y > 0) {
			var wI = $(image).width() > 0 ? $(image).width() : 1,
				hI = $(image).height() > 0 ? $(image).height() : 1,
				lI = $(image).position().left + (wI * x),
				tI = $(image).position().top + (hI * y);
			$(cursor).css({
				left: lI + 'px',
				top: tI + 'px',
				'z-index': 3000
			});
			$(cursor).show();
		}
	},

	placeImageWindows: function (image, naturalWidth, naturalHeight) {
		var wDiv = $(image).parent().width() > 0 ? $(image).parent().width() : 1,
			hDiv = $(image).parent().height() > 0 ? $(image).parent().height() : 1,
			varW = naturalWidth / wDiv,
			varH = naturalHeight / hDiv,
			wImage = wDiv,
			hImage = hDiv,
			xImagen = 0,
			yImagen = 0;
		if (varW > varH) {
			wImage = parseInt(wDiv);
			hImage = parseInt(naturalHeight / varW);
			yImagen = parseInt((hDiv - hImage) / 2);
		} else {
			wImage = parseInt(naturalWidth / varH);
			hImage = parseInt(hDiv);
			xImagen = parseInt((wDiv - wImage) / 2);
		}
		return {
			w: wImage,
			h: hImage,
			x: xImagen,
			y: yImagen
		}
	},

	newWord: function (instance) {
		var mOptions = $eXeRosco.options[instance],
			mActiveWord = $eXeRosco.updateNumberWord(mOptions.activeWord, instance);
		if (mOptions.gameOver) return;
		if (mActiveWord == -10) {
			$eXeRosco.gameOver(0, instance);
		} else {
			mOptions.activeWord = mActiveWord;
			$eXeRosco.showWord(mActiveWord, instance)
		}
	},

	refreshImageActive: function (instance) {
		var mOptions = $eXeRosco.options[instance],
			mWord = mOptions.wordsGame[mOptions.activeWord];

		$eXeRosco.showImage('', 0, 0, '', '', instance)
		if (typeof mWord == "undefined") {
			return;
		}
		if (mWord.url.length > 3) {
			$eXeRosco.showImage(mWord.url, mWord.x, mWord.y, mWord.author, mWord.alt, instance);
		}

	},
	updateNumberWord: function (quextion, instance) {
		var end = true,
			numActiveWord = quextion,
			mOptions = $eXeRosco.options[instance];
		while (end) {
			numActiveWord++;
			if (numActiveWord > mOptions.letters.length - 1) {
				if (mOptions.activeGameSpin < mOptions.numberTurns) {
					if (mOptions.answeredWords >= mOptions.validWords) {
						end = false
						return -10;
					}
					mOptions.activeGameSpin++;
					$('#roscoNumberRounds-' + instance).addClass("exeQuextIcons-OneRound").removeClass("exeQuextIcons-TwoRounds").attr('alt', 'Two turns');
					$('#roscoNumberRoundsSpan-' + instance).text(mOptions.msgOneRound);
					numActiveWord = 0;
				} else {
					end = false
					return -10;
				}
			}
			var state = mOptions.wordsGame[numActiveWord].state;
			if (state == 1) {
				end = false
				return numActiveWord;
			}
		}
	},
	passWord: function (instance) {
		var mOptions = $eXeRosco.options[instance];
		mOptions.gameActived = false;
		var letter = '#letterR' + mOptions.letters.charAt(mOptions.activeWord) + '-' + instance;
		$(letter).css({
			'background-color': $eXeRosco.colors.blue,
			'color': $eXeRosco.colors.white
		});
		$eXeRosco.newWord(instance);
		if (mOptions.gameStarted) {
			$eXeRosco.drawText('', $eXeRosco.colors.blue, instance);
			$('#roscoEdReply-' + instance).focus();
		}
		var letter = '#letterR' + mOptions.letters.charAt(mOptions.activeWord) + '-' + instance;
		$(letter).css({
			'background-color': $eXeRosco.colors.blue,
			'color': $eXeRosco.colors.white
		});
		$eXeRosco.drawRosco(instance);
	},

	answerQuetion: function (instance) {
		var mOptions = $eXeRosco.options[instance],
			msgs = mOptions.msgs;
		if (mOptions.gameActived == false) {
			return;
		}
		mOptions.gameActived = false;
		var letter = mOptions.letters[mOptions.activeWord],
			answord = $('#roscoEdReply-' + instance).val();
		if ($.trim(answord) == "") {
			mOptions.gameActived = true;
			$eXeRosco.drawText(msgs.msgIndicateWord, $eXeRosco.colors.red, instance);
			return;
		}
		var message = "",
			Hit = true,
			word = $.trim(mOptions.wordsGame[mOptions.activeWord].word);
		$('#roscoBtnReply-' + instance).prop('disabled', true);
		$('#roscoBtnMoveOn-' + instance).prop('disabled', true);
		$('#roscoEdReply-' + instance).prop('disabled', true);

		word = mOptions.caseSensitive ? word : word.toUpperCase();
		answord = mOptions.caseSensitive ? answord : answord.toUpperCase();
		var mFontColor = $eXeRosco.colors.white,
			mBackColor = $eXeRosco.colors.blue;
		if ($eXeRosco.checkWord(word, answord)) {
			mOptions.hits++
			mOptions.wordsGame[mOptions.activeWord].state = 2;
			Hit = true;
			mFontColor = $eXeRosco.colors.white;
			mBackColor = $eXeRosco.colors.green
		} else {
			mOptions.wordsGame[mOptions.activeWord].state = 3;
			mOptions.errors++;
			Hit = false;
			mFontColor = $eXeRosco.colors.white;
			mBackColor = $eXeRosco.colors.red;
		}
		var percentageHits = (mOptions.hits / mOptions.validWords) * 100;
		mOptions.answeredWords++;
		$('#roscotPHits-' + instance).text(mOptions.hits);
		$('#roscotPErrors-' + instance).text(mOptions.errors);
		var timeShowSolution = mOptions.showSolution ? mOptions.timeShowSolution * 1000 : 1000;
		var clue = false;
		if (mOptions.itinerary.showClue && percentageHits >= mOptions.itinerary.percentageClue) {
			if (!mOptions.obtainedClue) {
				mOptions.obtainedClue = true;
				timeShowSolution = 4000;
				clue = true;
				$('#roscoPShowClue-' + instance).show();
				$('#roscoPShowClue-' + instance).text(mOptions.msgs.msgInformation + ': ' + mOptions.itinerary.clueGame);
			}
		}
		letter = '#letterR' + letter + '-' + instance;
		$(letter).css({
			'background-color': mBackColor,
			'color': mFontColor
		});
		$eXeRosco.drawRosco(instance);
		message = mOptions.showSolution ? message : msgs.msgNewWord;
		setTimeout(function () {
			$eXeRosco.newWord(instance)
		}, timeShowSolution);
		$eXeRosco.drawMessage(Hit, word, clue, instance);
	},

	answerQuetionBoard: function (value, instance) {
		var mOptions = $eXeRosco.options[instance],
			msgs = mOptions.msgs;
		if (mOptions.gameActived == false) {
			return;
		}
		mOptions.gameActived = false;
		$('#roscoBtnReply-' + instance).prop('disabled', true);
		$('#roscoBtnMoveOn-' + instance).prop('disabled', true);
		$('#roscoEdReply-' + instance).prop('disabled', true);
		var message = "",
			Hit = true,
			word = $.trim(mOptions.wordsGame[mOptions.activeWord].word);
		word = mOptions.caseSensitive ? word : word.toUpperCase();
		var mFontColor = $eXeRosco.colors.white,
			mBackColor = $eXeRosco.colors.blue;
		if (value) {
			mOptions.hits++
			mOptions.wordsGame[mOptions.activeWord].state = 2;
			Hit = true;
			mFontColor = $eXeRosco.colors.white;
			mBackColor = $eXeRosco.colors.green
		} else {
			mOptions.wordsGame[mOptions.activeWord].state = 3;
			mOptions.errors++;
			Hit = false;
			mFontColor = $eXeRosco.colors.white;
			mBackColor = $eXeRosco.colors.red;
		}
		var percentageHits = (mOptions.hits / mOptions.validWords) * 100;
		mOptions.answeredWords++;
		$('#roscotPHits-' + instance).text(mOptions.hits);
		$('#roscotPErrors-' + instance).text(mOptions.errors);
		var timeShowSolution = mOptions.showSolution ? mOptions.timeShowSolution * 1000 : 1000;
		var clue = false;
		if (mOptions.itinerary.showClue && percentageHits >= mOptions.itinerary.percentageClue) {
			if (!mOptions.obtainedClue) {
				mOptions.obtainedClue = true;
				timeShowSolution = 4000;
				clue = true;
				$('#roscoPShowClue-' + instance).show();
				$('#roscoPShowClue-' + instance).text(mOptions.msgs.msgInformation + ': ' + mOptions.itinerary.clueGame);
			}
		}
		var letter = mOptions.letters[mOptions.activeWord],
			letter = '#letterR' + letter + '-' + instance;
		$(letter).css({
			'background-color': mBackColor,
			'color': mFontColor
		});
		$eXeRosco.drawRosco(instance);
		message = mOptions.showSolution ? message : msgs.msgNewWord;
		setTimeout(function () {
			$eXeRosco.newWord(instance)
		}, timeShowSolution);
		$eXeRosco.drawMessage(Hit, word, clue, instance);
	},

	drawMessage: function (Hit, word, pista, instance) {
		var mOptions = $eXeRosco.options[instance],
			mAnimo = $eXeRosco.getRetroFeedMessages(Hit, instance),
			ctxt = mOptions.ctxt,
			whidthCtxt = $eXeRosco.mcanvas.width,
			heightCtxt = $eXeRosco.mcanvas.height,
			wCuadro = whidthCtxt - 70,
			xMessage = whidthCtxt / 2 - wCuadro / 2,
			yMessage = heightCtxt / 2,
			xCenter = whidthCtxt / 2,
			font = 'bold 18px sans-serif';
		ctxt.font = font;
		var anchoTextoAnimo = ctxt.measureText(mAnimo).width;
		var posTextoAnimoX = xCenter - anchoTextoAnimo / 2;
		var posTextoAnimoY = mOptions.showSolution ? yMessage - 10 : yMessage;
		ctxt.fillStyle = $eXeRosco.colors.white;
		var lColor = Hit ? $eXeRosco.colors.green : $eXeRosco.colors.red;
		ctxt.strokeStyle = "#DDDDDD";
		ctxt.lineWidth = 2;
		$eXeRosco.roundRect(xMessage + 5, 130, 277, 120, 8, true, true, ctxt);
		ctxt.textAlig = "center";
		ctxt.textBaseline = 'top';
		ctxt.fillStyle = lColor;
		if (pista) {
			mAnimo = mOptions.msgs.msgInformation;
			posTextoAnimoY = yMessage - 15;
			posTextoAnimoX = xCenter - ctxt.measureText(mAnimo).width / 2;
			$eXeRosco.wrapText(ctxt, mAnimo + ': ' + mOptions.itinerary.clueGame, xMessage + 13, yMessage - 32, 257, 24);
			$('#roscoPMessages-' + instance).css("color", lColor).text(mAnimo + ': ' + mOptions.itinerary.clueGame);
			return;
		}
		ctxt.fillText(mAnimo, posTextoAnimoX, posTextoAnimoY);
		$('#roscoPMessages-' + instance).text(mAnimo);
		if (mOptions.showSolution) {
			//word = word.replace(/[|]/g, ' o ');
			$('#roscoPMessages-' + instance).text(mAnimo + ' ' + word);
			ctxt.fillText(mAnimo, posTextoAnimoX, posTextoAnimoY);
			$eXeRosco.wrapText(ctxt, word, xMessage + 10, posTextoAnimoY + 10, 257, 24);
		}
		$('#roscoPMessages-' + instance).css("color", lColor);
		$('#roscoEdReply-' + instance).focus();
	},

	drawLetterActive: function (iNumber, instance) {
		var mOptions = $eXeRosco.options[instance];
		if (mOptions.gameActived) {
			var activeWord = mOptions.activeWord,
				word = mOptions.wordsGame[activeWord],
				mFontColor = $eXeRosco.colors.white,
				mBackColor = $eXeRosco.colors.blue;
			if (word.state == 2) {
				mFontColor = $eXeRosco.colors.white;
				mBackColor = $eXeRosco.colors.green;

			} else if (word.state == 3) {
				mFontColor = $eXeRosco.colors.white;
				mBackColor = $eXeRosco.colors.red;

			} else if (mOptions.activaLetra) {
				mFontColor = $eXeRosco.colors.black;
				mBackColor = $eXeRosco.colors.yellow;
			}
			if (iNumber == activeWord) {
				var letter = "",
					mLetter = mOptions.letters.charAt(iNumber);
				letter = '#letterR' + mLetter + '-' + instance;
				mLetter = $eXeRosco.getRealLetter(mOptions.letters.charAt(iNumber));
				$(letter).css({
					'background-color': mBackColor,
					'color': mFontColor
				});
				var ctxt = mOptions.ctxt,
					angle = (mOptions.angleSize * (iNumber + mOptions.letters.length - 6)) % mOptions.letters.length,
					radiusLetter = mOptions.radiusLetter,
					xCenter = $eXeRosco.mcanvas.width / 2,
					yCenter = $eXeRosco.mcanvas.height / 2,
					radius = $eXeRosco.mcanvas.width / 2 - radiusLetter * 2,
					yPoint = yCenter + radius * Math.sin(angle),
					xPoint = xCenter + radius * Math.cos(angle),
					font = $eXeRosco.getFontSizeLetters(instance);
				ctxt.beginPath();
				ctxt.strokeStyle = $eXeRosco.colors.white;
				ctxt.arc(xPoint, yPoint, radiusLetter, 0, 2 * Math.PI);
				ctxt.fillStyle = mBackColor;
				ctxt.fill();
				ctxt.font = font;
				ctxt.lineWidth = 2;
				var whidthLetter = ctxt.measureText(mLetter).width;
				ctxt.textAlig = "center"
				ctxt.textBaseline = 'middle';
				ctxt.fillStyle = mFontColor;
				ctxt.fillText(mLetter, xPoint - whidthLetter / 2, yPoint + 2);
				ctxt.closePath();
			}
			mOptions.activaLetra = mOptions.activaLetra ? false : true;
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
	checkWord: function (word, answord) {

		var sWord = $.trim(word).replace(/\s+/g, " ").replace(/\.$/, "").replace(/\,$/, "").replace(/\;$/, ""),
			sAnsWord = $.trim(answord).replace(/\s+/g, " ").replace(/\.$/, "").replace(/\,$/, "").replace(/\;$/, "");
		sWord = $.trim(sWord);
		sAnsWord = $.trim(sAnsWord);
		if (sWord.indexOf('|') == -1) {
			return sWord == sAnsWord;
		}
		var words = sWord.split('|');
		for (var i = 0; i < words.length; i++) {
			var mword = $.trim(words[i]).replace(/\.$/, "").replace(/\,$/, "").replace(/\;$/, "");
			if (mword == sAnsWord) {
				return true;
			}
		}
		return false;
	},

	wrapText: function (context, text, x, y, maxWidth, lineHeight) {
		var mx = x,
			words = text.split(' '),
			my = words.length < 12 ? y + 20 : y,
			line = '',
			testWidth = 0;
		for (var n = 0; n < words.length; n++) {
			var testLine = line + words[n] + ' ',
				metrics = context.measureText(testLine);
			testWidth = metrics.width;
			if (testWidth > maxWidth && n > 0) {
				var lineWidth = context.measureText(line).width;
				mx = x + (maxWidth - lineWidth) / 2 + 5;
				context.fillText(line, mx, my);
				line = words[n] + ' ';
				my += lineHeight;
			} else {
				line = testLine;
			}
		}
		mx = x + (maxWidth - (context.measureText(line).width)) / 2 + 5;
		context.fillText(line, mx, my);
	},

	roundRect: function (x, y, width, height, radius, fill, stroke, ctxt) {
		if (typeof stroke == 'undefined') {
			stroke = true;
		}
		if (typeof radius === 'undefined') {
			radius = 5;
		}
		if (typeof radius === 'number') {
			radius = {
				tl: radius,
				tr: radius,
				br: radius,
				bl: radius
			};
		} else {
			var defaultRadius = {
				tl: 0,
				tr: 0,
				br: 0,
				bl: 0
			};
			for (var side in defaultRadius) {
				radius[side] = radius[side] || defaultRadius[side];
			}
		}
		ctxt.beginPath();
		ctxt.moveTo(x + radius.tl, y);
		ctxt.lineTo(x + width - radius.tr, y);
		ctxt.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
		ctxt.lineTo(x + width, y + height - radius.br);
		ctxt.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
		ctxt.lineTo(x + radius.bl, y + height);
		ctxt.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
		ctxt.lineTo(x, y + radius.tl);
		ctxt.quadraticCurveTo(x, y, x + radius.tl, y);
		ctxt.closePath();
		$eXeRosco.setShadow(ctxt, "rgba(100, 100, 100, 0.5)", 3, 3, 4);
		if (stroke) {
			ctxt.stroke();
		}
		if (fill) {
			ctxt.fill();
		}
		$eXeRosco.setShadow(ctxt, "white", 0, 0, 0);
	},
	drawRosco: function (instance) {
		var ctxt = $eXeRosco.options[instance].ctxt,
			whidthCtxt = $eXeRosco.mcanvas.width,
			heightCtxt = $eXeRosco.mcanvas.height,
			mOptions = $eXeRosco.options[instance];
		ctxt.clearRect(0, 0, whidthCtxt, heightCtxt);
		var radiusLetter = mOptions.radiusLetter,
			xCenter = Math.round(whidthCtxt / 2),
			yCenter = Math.round(heightCtxt / 2),
			radius = whidthCtxt / 2 - radiusLetter * 2,
			letter = "";
		for (var i = 0; i < mOptions.letters.length; i++) {
			letter = $eXeRosco.getRealLetter(mOptions.letters.charAt(i));
			var angle = (mOptions.angleSize * (i + mOptions.letters.length - 6)) % mOptions.letters.length,
				yPoint = yCenter + radius * Math.sin(angle),
				xPoint = xCenter + radius * Math.cos(angle),
				font = $eXeRosco.getFontSizeLetters(instance);
			ctxt.beginPath();
			ctxt.lineWidth = 0;
			ctxt.strokeStyle = $eXeRosco.colors.black;
			ctxt.arc(xPoint, yPoint, radiusLetter, 0, 2 * Math.PI);
			var state = $eXeRosco.options[instance].wordsGame[i].state,
				color = $eXeRosco.getColorState(state);
			$eXeRosco.setShadow(ctxt, "rgba(0, 0, 0, 0.5)", 3, 3, 4);
			ctxt.fillStyle = color;
			ctxt.fill();
			$eXeRosco.setShadow(ctxt, "white", 0, 0, 0);
			ctxt.font = font;
			var whidthLetter = ctxt.measureText(letter).width;
			ctxt.textAlig = "center"
			ctxt.textBaseline = 'middle';
			ctxt.fillStyle = $eXeRosco.colors.white;
			ctxt.fillText(letter, xPoint - whidthLetter / 2, yPoint + 2);
			ctxt.closePath();
		}
	},
	getRealLetter: function (letter) {
		var mletter = letter;
		if (letter == '0') {
			mletter = 'L·L'
		} else if (letter == '1') {
			mletter = 'SS'
		}
		return mletter;
	},
	getCaracterLetter: function (letter) {
		var caracter = letter;
		if (letter == "L·L") {
			caracter = '0'
		} else if (letter == "SS") {
			caracter = '1';
		}
		return caracter;
	},
	getFontSizeLetters: function (instance) {
		var mOptions = $eXeRosco.options[instance],
			mFont = "20px",
			fontS = ' bold %1 sans-serif ';
		if (mOptions.letters.length < 18) {
			mFont = "24px"
		}
		if (mOptions.letters.length < 24) {
			mFont = "22px"
		} else if (mOptions.letters.length < 32) {
			mFont = "20px"
		} else if (mOptions.letters.length < 36) {
			mFont = "16px"
		} else if (mOptions.letters.length < 40) {
			mFont = "14px"
		} else if (mOptions.letters.length < 44) {
			mFont = "12px"
		} else if (mOptions.letters.length < 50) {
			mFont = "10px"
		} else if (mOptions.letters.length < 100) {
			mFont = "8px"
		}
		fontS = fontS.replace('%1', mFont);
		return fontS;

	},
	drawRows: function (instance) {
		var mOptions = $eXeRosco.options[instance],
			mBackColor = "",
			letter = "",
			mFontColor = $eXeRosco.colors.white;
		for (var i = 0; i < mOptions.wordsGame.length; i++) {
			mOptions.wordsGame[i].state = mOptions.wordsGame[i].word.trim().length == 0 ? 0 : 1;
			mBackColor = mOptions.wordsGame[i].state == 1 ? $eXeRosco.colors.blue : $eXeRosco.colors.black;
			letter = '#letterR' + mOptions.letters.charAt(i) + '-' + instance;
			$(letter).css({
				'background-color': mBackColor,
				'color': mFontColor
			});
		}
	},
	setShadow: function (ctx, color, ox, oy, blur) {
		ctx.shadowColor = color;
		ctx.shadowOffsetX = ox;
		ctx.shadowOffsetY = oy;
		ctx.shadowBlur = blur;
	},
	getColorState: function (state) {
		var color = $eXeRosco.colors.blue;
		switch (state) {
			case 0:
				color = $eXeRosco.colors.black;
				break;
			case 1:
				color = $eXeRosco.colors.blue;
				break;
			case 2:
				color = $eXeRosco.colors.green;
				break
			case 3:
				color = $eXeRosco.colors.red;
				break
			default:
				color = $eXeRosco.colors.blue;
				break;
		}
		return color;
	},
	exitFullscreen: function () {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		}
	},
	getFullscreen: function (element) {
		if (element.requestFullscreen) {
			element.requestFullscreen();
		} else if (element.mozRequestFullScreen) {
			element.mozRequestFullScreen();
		} else if (element.webkitRequestFullscreen) {
			element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
		} else if (element.msRequestFullscreen) {
			element.msRequestFullscreen();
		}
	},
	toggleFullscreen: function (element, instance) {
		var element = element || document.documentElement;
		if (!document.fullscreenElement && !document.mozFullScreenElement &&
			!document.webkitFullscreenElement && !document.msFullscreenElement) {
			$eXeRosco.getFullscreen(element);
		} else {
			$eXeRosco.exitFullscreen(element);
		}
		$eXeRosco.refreshImageActive(instance);
	},
	supportedBrowser: function (idevice) {
		var sp = !(window.navigator.appName == 'Microsoft Internet Explorer' || window.navigator.userAgent.indexOf('MSIE ') > 0);
		if (!sp) {
			var bns = $('.' + idevice + '-bns').eq(0).text() || 'Your browser is not compatible with this tool.';
			$('.' + idevice + '-instructions').text(bns);
		}
		return sp;
	},
	getURLAudioMediaTeca: function (url) {
		if (url) {
			var matc = url.indexOf("https://mediateca.educa.madrid.org/audio/") != -1;
			var matc1 = url.indexOf("https://mediateca.educa.madrid.org/video/") != -1;

			if (matc) {
				var id = url.split("https://mediateca.educa.madrid.org/audio/")[1].split("?")[0];
				id = 'https://mediateca.educa.madrid.org/streaming.php?id=' + id;
				return id;
			}
			if (matc1) {
				var id = url.split("https://mediateca.educa.madrid.org/video/")[1].split("?")[0];
				id = 'https://mediateca.educa.madrid.org/streaming.php?id=' + id;
				return id;
			} else {
				return false;
			}
		} else {
			return false;
		}
	},
	extractURLGD: function (urlmedia) {
		var sUrl = urlmedia;
		if (typeof urlmedia != "undefined" && urlmedia.length > 0 && urlmedia.toLowerCase().indexOf("https://drive.google.com") == 0 && urlmedia.toLowerCase().indexOf("sharing") != -1) {
			sUrl = sUrl.replace(/https:\/\/drive\.google\.com\/file\/d\/(.*?)\/.*?\?usp=sharing/g, "https://docs.google.com/uc?export=open&id=$1");
		} else if (typeof urlmedia != "undefined" && urlmedia.length > 10 && $eXeRosco.getURLAudioMediaTeca(urlmedia)) {
			sUrl = $eXeRosco.getURLAudioMediaTeca(urlmedia);
		}
		return sUrl;
	}
}

$(function () {
	$eXeRosco.init();
});