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
		yellow: '#f3d55a'
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
	init: function () {
		this.activities = $('.rosco-IDevice');
		if (this.activities.length == 0) return;
		if (typeof ($exeAuthoring) != 'undefined' && $("#exe-submitButton").length > 0) {
			this.activities.hide();
			if (typeof (_) != 'undefined') this.activities.before('<p>' + _('A-Z Quiz Game') + '</p>');
			return;
		}
		$eXeRosco.angleSize = 2 * Math.PI / 27;
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
	loadGame: function () {
		$eXeRosco.options = [];
		$('.rosco-IDevice').each(function (i) {
			var dl = $(".rosco-DataGame", this);
			var imagesLink = $('.rosco-LinkImages', this);
			var option = $eXeRosco.loadDataGame(dl, imagesLink);
			$eXeRosco.options.push(option);
			$eXeRosco.letters=option.letters;
			$eXeRosco.radiusLetter=16+ Math.floor((27-option.letters.length)/3);
			$eXeRosco.angleSize = 2 * Math.PI / option.letters.length;
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

	loadDataGame: function (data, imgsLink) {
		var json = data.text(),
			mOptions = $eXeRosco.isJsonString(json);
		mOptions.gameOver = false;
		imgsLink.each(function (index) {
			mOptions.wordsGame[index].url = $(this).attr('href');
		});

		return mOptions;
	},

	createInterfaceRosco: function (instance) {
		var aLetters = this.getLettersRosco(instance),
			sTime = this.getTimeToString(this.options[instance].durationGame),
			msgs = this.options[instance].msgs,
			html = '',
			path = $eXeRosco.idevicePath;
		html += '<div class="rosco-Main">\
				<div class="rosco-MainContainer">\
				<div class="rosco-GameMinimize" id="roscoGameMinimize-' + instance + '">\
				<a href="#" class="rosco-LinkMaximize" id="roscoLinkMaximize-' + instance + '" title="' + msgs.msgMaximize + '"><img src="' + path + 'rosco-icon.png" class="rosco-Icon" id="roscoIcon-' + instance + '" alt="' + msgs.msgMinimize + '">\
					<div  class="rosco-MessageMaximize" id="roscoMessageMaximize-' + instance + '">' + msgs.msgPlayStart + '</div></a>\
				</div>\
				<div class="rosco-GameContainer" id="roscoGameContainer-' + instance + '">\
					<div class="rosco-GameScoreBoard">\
						<div class="rosco-GameScores">\
							<a href="#" class="rosco-LinkArrowMinimize" id="roscoLinkArrowMinimize-' + instance + '" title="' + msgs.msgMinimize + '">\
								<strong><span class="sr-av">' + msgs.msgMinimize + ':</span></strong>\
								<div class="exeQuextIcons exeQuextIcons-Minimize"></div>\
							</a>\
							<div class="exeQuext-ResultGame">\
								<strong><span class="sr-av">' + msgs.msgHits + ':</span></strong>\
								<div class="exeQuextIcons exeQuextIcons-Hit"></div>\
								<p  id="roscotPHits-' + instance + '">0</p>\
							</div>\
							<div class="exeQuext-ResultGame">\
								<strong><span class="sr-av">' + msgs.msgErrors + ':</span></strong>\
								<div class="exeQuextIcons  exeQuextIcons-Error"></div>\
								<p id="roscotPErrors-' + instance + '">0</p>\
							</div>\
						</div>\
						<div class="rosco-TimeTurn">\
							<div  class="rosco-DurationGame">\
								<strong><span class="sr-av">' + msgs.msgTime + ':</span></strong>\
								<div class="exeQuextIcons  exeQuextIcons-Time"></div>\
								<p  id="roscoPTime-' + instance + '">' + sTime + '</p>\
							</div>\
							<strong><span class="sr-av"  id="roscoNumberRoundsSpan-' + instance + '">' + msgs.msgOneRound + ':</span></strong>\
							<div class="exeQuextIcons  exeQuextIcons-OneRound" id="roscoNumberRounds-' + instance + '"></div>\
						    <a href="#" class="rosco-LinkTypeGame" id="roscoLinkTypeGame-' + instance + '" title="' + msgs.msgHideRoulette + '">\
								<strong><span class="sr-av">' + msgs.msgHideRoulette + ':</span></strong>\
								<div class="exeQuextIcons exeQuextIcons-RoscoRows" id="roscoTypeGame-' + instance + '"></div>\
							</a>\
						</div>\
					</div>\
					<div class="rosco-Letters" id="roscoLetters-' + instance + '">' + aLetters + '</div>\
					<div class="rosco-ShowClue" id="roscoShowClue-' + instance + '">\
						<div class="sr-av">' + msgs.msgClue + ':</div>\
						<p class="rosco-PShowClue" id="roscoPShowClue-' + instance + '"></p>\
			   		</div>\
					<div class="rosco-Image" id="roscoImage-' + instance + '">\
						<img src="' + path + 'roscoCursor.gif" class="rosco-Cursor" alt="Cursor" id="roscoCursor-' + instance + '"/> \
						<img src="" class="rosco-HomeImage" alt="' + msgs.msgNoImage + '" id="roscoHomeImage-' + instance + '"/> \
						<img src="' + path + 'roscoHome.png" class="rosco-NoImage" alt="' + msgs.msgNoImage + '" id="roscoNoImage-' + instance + '"/> \
					</div>\
					<div class="rosco-Author" id="roscoAuthor-' + instance + '"></div>\
					<div class="rosco-Solution" id="roscoSolution-' + instance + '">\
							<p id="roscoPSolution-' + instance + '">' + msgs.msgReady + '</p>\
					</div>\
					<div  class="rosco-TypeDefinition"  id="roscoTypeDefinition-' + instance + '">\
						<p  id="roscoPStartWith-' + instance + '">' + msgs.msgStartGame + '</p>\
					</div>\
					<div  class="rosco-Definition" id="roscoDefinition-' + instance + '">\
						<h3 class="sr-av">' + msgs.msgQuestion + ':</h3>\
						<p id="roscoPDefinition-' + instance + '">' + msgs.msgWrote + '.</p>\
					</div>\
					<div  class="rosco-AnswerButtons"  id="roscoAnswerButtons-' + instance + '">\
						<input type="button" value="' + msgs.msgHappen + '" id="roscoBtnPass-' + instance + '">\
						<input type="text" class="rosco-AnswerEdit" id="roscoEdAnswer-' + instance + '">\
						<input type="button" value="' + msgs.msgReply + '"  id="roscoBtnAnswer-' + instance + '">\
					</div>\
					<div  class="rosco-CodeAccess"  id="roscoCodeAccess-' + instance + '">\
						<label for="roscoEdCodeAccess-' + instance + '" id="labelMessageAccess">' + msgs.msgCodeAccess + '</label>\
						<h3 class="sr-av">' + msgs.msgAnswer + ':</h3>\
						<input type="text" class="rosco-AnswerEdit" id="roscoEdCodeAccess-' + instance + '" autocomplete="false">\
						<input type="button" value="' + msgs.msgSubmit + '" id="roscoBtnSubmitCodeAccess-' + instance + '">\
					</div>\
				</div>\
				<div id="roscoGame-' + instance + '"class="rosco-Game">\
					<canvas class="rosco-Canvas" id="roscoCanvas-' + instance + '" width="360px" height="360px">\
						Your browser does not support the HTML5 canvas tag\
					</canvas>\
				</div>\
			</div>' + this.addButtonScore(instance) +
			'</div>';
		return html
	},
	changeTextInit: function (big, message, instance) {
		var html = message;
		if (big) {
			html = '<a href="#">' + message + '</a>';
			$('#roscoAnswerButtons-' + instance).css("visibility","hidden");
		}
		$('#roscoPStartWith-' + instance).html(html);
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
		var letras = this.letters,
			mLetters = [],
			mOptions = $eXeRosco.options[instance];
		for (var i = 0; i < mOptions.wordsGame.length; i++) {
			var letter = '<div class="rosco-Letter rosco-LetterBlack" id="letterR' + letras[i] + '-' + instance + '">' + letras[i] + '</div>',
				word = $.trim(mOptions.wordsGame[i].word);
			if (word.length > 0) {
				letter = '<div class="rosco-Letter" id="letterR' + letras[i] + '-' + instance + '">' + letras[i] + '</div>';
			}
			mLetters.push(letter);
		}
		html = mLetters.join('');
		return html;
	},

	addEvents: function (instance) {
		var mOptions = $eXeRosco.options[instance],
			msgs = mOptions.msgs;
		$('#roscoEdAnswer-' + instance).val("");
		$('#roscoBtnAnswer-' + instance).prop('disabled', true);
		$('#roscoBtnPass-' + instance).prop('disabled', true);
		$('#roscoEdAnswer-' + instance).prop('disabled', true);
		if (mOptions.itinerary.showCodeAccess) {
			$('#roscoAnswerButtons-' + instance).hide();
			$('#roscoCodeAccess-' + instance).show();
			$('#roscoPDefinition-' + instance).text(mOptions.itinerary.messageCodeAccess);
			$eXeRosco.changeTextInit(false, '', instance);
			$('#roscoEdCodeAccess-' + instance).focus();
		} else {
			$('#roscoAnswerButtons-' + instance).show();
			$('#roscoCodeAccess-' + instance).hide();
			$('#roscoPDefinition-' + instance).text(msgs.msgWrote);
			$eXeRosco.changeTextInit(true, msgs.msgStartGame, instance);
			$('#roscoPStartWith-' + instance).on('click', 'a', function (e) {
				e.preventDefault();
				$eXeRosco.startGame(instance);
			});
		}
		$('#roscoBtnSubmitCodeAccess-' + instance).on('click', function () {
			var keyIntroduced = $.trim($('#roscoEdCodeAccess-' + instance).val()).toUpperCase(),
				correctKey = $.trim(mOptions.itinerary.codeAccess).toUpperCase();
			if (keyIntroduced == correctKey) {
				$('#roscoAnswerButtons-' + instance).show();
				$('#roscoCodeAccess-' + instance).hide();
				$('#roscoPStartWith-' + instance).on('click', 'a', function (e) {
					e.preventDefault();
					$eXeRosco.startGame(instance);
				});
				$eXeRosco.startGame(instance);
			} else {
				$eXeRosco.changeTextInit(false, msgs.msgErrorCode, instance);
				$('#roscoEdCodeAccess-' + instance).val('');
			}
		});

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
				$('#roscoBtnSubmitCodeAccess-' + instance).trigger('click');
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
		$('#roscoBtnPass-' + instance).on('click', function () {
			$eXeRosco.passWord(instance);
		});
		$('#roscoBtnAnswer-' + instance).on('click', function () {
			$eXeRosco.answerQuetion(instance);
		});
		$('#roscoEdAnswer-' + instance).on("keydown", function (event) {
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
		$('#roscoSolution-' + instance).hide();
		$('#roscoTypeGame-' + instance).removeClass('exeQuextIcons-RoscoRows');
		$('#roscoTypeGame-' + instance).addClass('exeQuextIcons-RoscoCanvas');
		$('#roscoLinkTypeGame-' + instance).on('click', function (e) {
			e.preventDefault();
			var alt = mOptions.msgs.msgHideRoulette;
			if ($('#roscoTypeGame-' + instance).hasClass('exeQuextIcons-RoscoCanvas')) {
				$('#roscoTypeGame-' + instance).addClass('exeQuextIcons-RoscoRows');
				$('#roscoTypeGame-' + instance).removeClass('exeQuextIcons-RoscoCanvas');
				$('#roscoLetters-' + instance).show();
				$('#roscoSolution-' + instance).show();
				$('#roscoGame-' + instance).hide();
				alt = mOptions.msgs.msgShowRoulette;
			} else {
				$('#roscoTypeGame-' + instance).addClass('exeQuextIcons-RoscoCanvas');
				$('#roscoTypeGame-' + instance).remove('exeQuextIcons-RoscoRows');
				$('#roscoLetters-' + instance).hide();
				$('#roscoSolution-' + instance).hide();
				$('#roscoGame-' + instance).show();
			}
			$('#roscoLinkTypeGame-' + instance).attr('title', alt);
			$('#roscoLinkTypeGame-' + instance).find('span').text(alt);

		});
		$eXeRosco.drawText(mOptions.msgs.msgReady, $eXeRosco.colors.blue, instance);
		$('#roscoPSolution-' + instance).css('color', $eXeRosco.colors.blue);
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
		if (window.innerWidth < 800) {
			$('#roscoTypeGame-' + instance).addClass('exeQuextIcons-RoscoRows');
			$('#roscoTypeGame-' + instance).removeClass('exeQuextIcons-RoscoCanvas');
			$('#roscoLetters-' + instance).show();
			$('#roscoSolution-' + instance).show();
			$('#roscoGame-' + instance).hide();
			$('#roscoTypeGame-' + instance).hide();
		}
	},

	startGame: function (instance) {
		var mOptions = $eXeRosco.options[instance];
		if (mOptions.gameStarted) {
			return;
		}
		$('#roscoAnswerButtons-' + instance).css("visibility","visible");
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
			var letter = '#letterR' + $eXeRosco.letters.charAt(i) + '-' + instance;
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
		$('#roscotPHits-' + instance).text(mOptions.hits);
		$('#roscotPErrors-' + instance).text(mOptions.errors);
		$('#roscoBtnAnswer-' + instance).prop('disabled', false);
		$('#roscoBtnPass-' + instance).prop('disabled', false);
		$('#roscoEdAnswer-' + instance).prop('disabled', false).focus();
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
		$eXeRosco.changeTextInit(true, msgs.msgNewGame, instance);
		var msg = msgs.msgYouHas.replace('%1', mOptions.hits);
		msg = msg.replace('%2', mOptions.errors)
		$('#roscoPDefinition-' + instance).text(msg);
		$('#roscoBtnAnswer-' + instance).prop('disabled', true);
		$('#roscoBtnPass-' + instance).prop('disabled', true);
		$('#roscoEdAnswer-' + instance).prop('disabled', true);
		mOptions.activeWord = 0;
		mOptions.answeredWords = 0;
		mOptions.gameOver = true;
		$eXeRosco.drawRosco(instance);
		$eXeRosco.drawText(msgs.msgGameOver, $eXeRosco.colors.red, instance);
		$('#roscoEdAnswer-' + instance).val('');
		$('#roscoPSolution-' + instance).text(msgs.msgGameOver).css("color", $eXeRosco.colors.blue);
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
	},

	drawText: function (texto, color, instance) {
		var ctxt = $eXeRosco.options[instance].ctxt,
			whidthCtxt = $eXeRosco.mcanvas.width,
			heightCtxt = $eXeRosco.mcanvas.height,
			radiusLetter = $eXeRosco.radiusLetter,
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
		ctxt.fillStyle = $eXeRosco.colors.white;;
		ctxt.fillRect(xMessage, yMessage, wText, 30);
		ctxt.textAlig = "center";
		ctxt.textBaseline = 'top';
		ctxt.fillStyle = color;
		ctxt.fillText(texto, xText, yText + 3);
		ctxt.closePath();
		$('#roscoPSolution-' + instance).css("color", color).text(texto);
	},

	showWord: function (activeLetter, instance) {
		var mOptions = $eXeRosco.options[instance],
			msgs = mOptions.msgs,
			mWord = mOptions.wordsGame[activeLetter],
			definition = mWord.definition,
			letter = $eXeRosco.letters.charAt(activeLetter),
			start = mWord.type == 0 ? msgs.msgStartWith : msgs.msgContaint;
		start = start.replace('%1', letter);
		$('#roscoPDefinition-' + instance).text(definition);
		$eXeRosco.changeTextInit(false, start, instance);
		$('#roscoEdAnswer-' + instance).val("");
		$('#roscoPSolution-' + instance).val('');
		$eXeRosco.drawRosco(instance);
		$eXeRosco.drawText('', $eXeRosco.colors.blue, instance);
		$eXeRosco.options[instance].gameActived = true;
		$('#roscoBtnAnswer-' + instance).prop('disabled', false);
		$('#roscoBtnPass-' + instance).prop('disabled', false);
		$eXeRosco.showImage(mWord.url, mWord.x, mWord.y, mWord.author, mWord.alt, instance);
		$('#roscoEdAnswer-' + instance).prop('disabled', false).focus();
		if (mOptions.isScorm == 1) {
			if (mOptions.repeatActivity || $eXeRosco.initialScore === '') {
				var score = ((mOptions.hits * 10) / mOptions.validWords).toFixed(2);
				$eXeRosco.sendScore(instance, true);
				$('#roscoRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score);

			}
		}
	},

	showImage: function (url, x, y, author, alt, instance) {
		var $cursor = $('#roscoCursor-' + instance),
			$noImage = $('#roscoNoImage-' + instance),
			$Image = $('#roscoHomeImage-' + instance),
			$Author = $('#roscoAuthor-' + instance);
		$Image.attr('alt', 'No image');
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
			$eXeRosco.gameOver(instance, 0);
		} else {
			mOptions.activeWord = mActiveWord;
			$eXeRosco.showWord(mActiveWord, instance)
		}
	},

	updateNumberWord: function (quextion, instance) {
		var end = true,
			numActiveWord = quextion,
			mOptions = $eXeRosco.options[instance];
		while (end) {
			numActiveWord++;
			if (numActiveWord > $eXeRosco.letters.length-1) {
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
		var letter = '#letterR' + $eXeRosco.letters.charAt(mOptions.activeWord) + '-' + instance;
		$(letter).css({
			'background-color': $eXeRosco.colors.blue,
			'color': $eXeRosco.colors.white
		});
		$eXeRosco.newWord(instance);
		if (mOptions.gameStarted) {
			$eXeRosco.drawText('', $eXeRosco.colors.blue, instance);
			$('#roscoEdAnswer-' + instance).focus();
		}
		var letter = '#letterR' + $eXeRosco.letters.charAt(mOptions.activeWord) + '-' + instance;
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
		var letter = $eXeRosco.letters[mOptions.activeWord],
			answord = $('#roscoEdAnswer-' + instance).val();
		if ($.trim(answord) == "") {
			mOptions.gameActived = true;
			$eXeRosco.drawText(msgs.msgIndicateWord, $eXeRosco.colors.red, instance);
			return;
		}
		var message = "",
			Hit = true,
			word = $.trim(mOptions.wordsGame[mOptions.activeWord].word.toUpperCase());
		$('#roscoBtnAnswer-' + instance).prop('disabled', true);
		$('#roscoBtnPass-' + instance).prop('disabled', true);
		$('#roscoEdAnswer-' + instance).prop('disabled', true);
		var answord = $.trim($('#roscoEdAnswer-' + instance).val().toUpperCase());
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
		var clue=false;
		if (mOptions.itinerary.showClue && percentageHits >= mOptions.itinerary.percentageClue) {
			if (!mOptions.obtainedClue) {
				mOptions.obtainedClue = true;
				timeShowSolution = 4000;
				clue=true;
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
		$eXeRosco.drawMessage(Hit, word.toUpperCase(), clue, instance);
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
		ctxt.strokeStyle = "#555555";
		ctxt.lineWidth = 2;
		$eXeRosco.roundRect(xMessage + 5, 130, 277, 120, 8, true, true, ctxt);
		ctxt.textAlig = "center";
		ctxt.textBaseline = 'top';
		ctxt.fillStyle = lColor;
		if (pista) {
			mAnimo = mOptions.msgs.msgInformation;
			posTextoAnimoY = yMessage - 15;
			porTextoPalabraY = posTextoAnimoY + 30;
			posTextoAnimoX = xCenter - ctxt.measureText(mAnimo).width / 2;
			$eXeRosco.wrapText(ctxt, mAnimo + ': ' + mOptions.itinerary.clueGame, xMessage + 13, yMessage - 32, 257, 24);
			$('#roscoPSolution-' + instance).css("color", lColor).text(mAnimo +': '+ mOptions.itinerary.clueGame);
			return;
		}
		ctxt.fillText(mAnimo, posTextoAnimoX, posTextoAnimoY);
		$('#roscoPSolution-' + instance).text(mAnimo);
		if (mOptions.showSolution) {
			//word = word.replace(/[|]/g, ' o ');
			$('#roscoPSolution-' + instance).text(mAnimo + ' ' + word);
			ctxt.fillText(mAnimo, posTextoAnimoX, posTextoAnimoY);
			$eXeRosco.wrapText(ctxt, word, xMessage + 10, posTextoAnimoY + 10, 257, 24);
		}
		$('#roscoPSolution-' + instance).css("color", lColor);
		$('#roscoEdAnswer-' + instance).focus();
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
					mLetter = $eXeRosco.letters.charAt(iNumber);
				letter = '#letterR' + mLetter + '-' + instance;
				$(letter).css({
					'background-color': mBackColor,
					'color': mFontColor
				});
				var ctxt = mOptions.ctxt,
					angle = ($eXeRosco.angleSize * (iNumber + $eXeRosco.letters.length -6)) % $eXeRosco.letters.length,
					radiusLetter = $eXeRosco.radiusLetter,
					xCenter = $eXeRosco.mcanvas.width / 2,
					yCenter = $eXeRosco.mcanvas.height / 2,
					radius = $eXeRosco.mcanvas.width / 2 - radiusLetter * 2,
					yPoint = yCenter + radius * Math.sin(angle),
					xPoint = xCenter + radius * Math.cos(angle),
					font = $eXeRosco.getFontSizeLetters();
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

	checkWord: function (word, answord) {
		if (word.indexOf('|') == -1) {
			return $.trim(word.toUpperCase()) == $.trim(answord.toUpperCase());
		}
		var words = word.split('|');
		for (var i = 0; i < words.length; i++) {
			if ($.trim(words[i]).toUpperCase() == $.trim(answord.toUpperCase())) {
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
		$eXeRosco.setShadow(ctxt, "rgba(0, 0, 0, 0.5)", 7, 7, 10);
		if (fill) {
			ctxt.fill();
		}
		if (stroke) {
			ctxt.stroke();
		}
		$eXeRosco.setShadow(ctxt, "white", 0, 0, 0);
	},

	drawRosco: function (instance) {
		var ctxt = $eXeRosco.options[instance].ctxt,
			whidthCtxt = $eXeRosco.mcanvas.width,
			heightCtxt = $eXeRosco.mcanvas.height;
		ctxt.clearRect(0, 0, whidthCtxt, heightCtxt);
		var radiusLetter = $eXeRosco.radiusLetter,
			xCenter = Math.round(whidthCtxt / 2),
			yCenter = Math.round(heightCtxt / 2),
			radius = whidthCtxt / 2 - radiusLetter * 2,
			letter = "";
		for (var i = 0; i < $eXeRosco.letters.length; i++) {
			letter = $eXeRosco.letters.charAt(i);
			var angle = ($eXeRosco.angleSize * (i + $eXeRosco.letters.length-6)) % $eXeRosco.letters.length,
				yPoint = yCenter + radius * Math.sin(angle),
				xPoint = xCenter + radius * Math.cos(angle),
				font = $eXeRosco.getFontSizeLetters();
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
	getFontSizeLetters: function(){
		var mFont="20px",
		fontS=' bold %1 sans-serif ';
		if($eXeRosco.letters.length<18){
			mFont="24px"
		}if($eXeRosco.letters.length<24){
			mFont="22px"
		}else if($eXeRosco.letters.length<32){
			mFont="20px"
		}else if($eXeRosco.letters.length<36){
			mFont="16px"
		}else if($eXeRosco.letters.length<40){
			mFont="14px"
		}else if($eXeRosco.letters.length<44){
			mFont="12px"
		}else if($eXeRosco.letters.length<50){
			mFont="10px"
		}else if($eXeRosco.letters.length<100){
			mFont="8px"
		}
		fontS= fontS.replace('%1', mFont);
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
			letter = '#letterR' + $eXeRosco.letters.charAt(i) + '-' + instance;
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
	}
}
$(function () {
	$eXeRosco.init();
});