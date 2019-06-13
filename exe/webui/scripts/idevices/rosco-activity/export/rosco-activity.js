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
		black: "#1c1b1b",
		blue: '#0099cc',
		green: '#009245',
		red: '#ff0000',
		white: '#ffffff',
		yellow: '#f3d55a'
	},

	letters: "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ",

	angleSize: "",

	radiusLetter: 16,

	options: [],

	msgs: {
	},

	hasSCORMbutton: false,

	isInExe: false,

	init: function () {
		this.activities = $('.rosco-IDevice');
		if (this.activities.length == 0) return;
		if (typeof ($exeAuthoring) != 'undefined' && $("#exe-submitButton").length > 0) {
			this.activities.hide();
			if (typeof (_) != 'undefined') this.activities.before('<p>' + _('Rosco') + '</p>');
			return;
		}
		$eXeRosco.angleSize = 2 * Math.PI / 27;
		if (typeof ($exeAuthoring) != 'undefined') this.isInExe = true;
		this.idevicePath = this.isInExe ? "/scripts/idevices/rosco-activity/export/" : "";
		$eXeRosco.loadGame();
	},

	loadGame: function () {
		$eXeRosco.options = [];
		$('.rosco-IDevice').each(function (i) {
			var dl = $(".rosco-DataGame", this);
			var imagesLink=$('.rosco-LinkImages', this);
			var option = $eXeRosco.loadDataGame(dl,imagesLink);
			$eXeRosco.options.push(option);
			var rosco = $eXeRosco.createInterfaceRosco(i);
			dl.before(rosco).remove();
			var msg = $eXeRosco.msgs.msgPlayStart;
			$('#roscoGameMinimize-' + i).hide();
			$('#roscoGameContainer-' + i).hide();
			if (!navigator.onLine) {
				msg = $eXeRosco.msgs.msgNotNetwork;
				$('#roscoGameMinimize-' + i).css({
					'cursor': 'auto'
				}).show();
			} else if ($eXeRosco.options[i].showMinimize) {
				$('#roscoGameMinimize-' + i).css({
					'cursor': 'pointer'
				}).show();
			} else {
				$('#roscoGameContainer-' + i).show();
			}
			$('#roscoMessageMinimize-' + i).text(msg);
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

	loadDataGame: function (data,imgsLink) {
		var json=data.text();
		var mOptions=$eXeRosco.isJsonString(json);
		imgsLink.each(function (index) {
			mOptions.wordsGame[index].url=$(this).attr('href');
		});
		$eXeRosco.msgs = mOptions.msgs;

		return mOptions;
	},

	createInterfaceRosco: function (instance) {
		var aLetters = this.getLettersRosco(instance),
			sTime = this.getTimeToString(this.options[instance].durationGame),
			msgs = $eXeRosco.msgs,
			html = '',
			path = $eXeRosco.idevicePath;
		html += '<div class="rosco-MainContainer">\
				<div class="rosco-GameMinimize" id="roscoGameMinimize-' + instance + '">\
				   <a href="#" class="roscoLinkSelectImage"> <img src="' + path + "rosco-icon.png" + '" class="rosco-Icon" id="roscoIcon-' + instance + '" alt="' + msgs.msgMinimize + '">\
					<div  class="rosco-MessageMinimize" id="roscoMessageMinimize-' + instance + '">' + msgs.msgPlayStart + '</div>\
				</div>\
				<div class="rosco-GameContainer" id="roscoGameContainer-' + instance + '">\
					<div class="rosco-GameScoreBoard" id="roscoGameScoreBoard-' + instance + '">\
						<div class="rosco-GameScores"id="roscoGameScores-' + instance + '">\
							<img src="' + path + "rosco-uparrow.png" + '" class="rosco-UpArrow" id="roscoUpArrow-' + instance + '" alt="' + msgs.msgMaximize + '">\
							<div class="rosco-ResultsGame" id="roscoHitsGame-' + instance + '">\
								<img src="' + path + "roscoHits.png" + '" class="rosco-HitIcons" id="roscoHits-' + instance + '" alt="' + msgs.msgHits + '">\
								<p  id="pHits-' + instance + '">0</p>\
							</div>\
							<div class="rosco-ResultsGame" id="roscoErrorsGame-' + instance + '">\
								<img src="' + path + "roscoErrors.png" + '" class="rosco-ErrorIcons" id="roscoErrors-' + instance + '" alt="' + msgs.msgErrors + '">\
								<p id="pErrors-' + instance + '">0</p>\
							</div>\
						</div>\
							<div class="rosco-TimeTurn"id="roscoTimeTurn-' + instance + '">\
							<div  class="rosco-DurationGame"  id="roscoDurationGame-' + instance + '">\
								<img src="' + path + "roscoClock.png" + '" class="rosco-clockIcons" id="roscoClock-' + instance + '" alt="' + msgs.msgTime + '">\
								<p  id="pTime-' + instance + '">' + sTime + '</p>\
							</div>\
							<img src="' + path + "roscoOneTurns.png" + '" class="rosco-TurnIcons" id="roscoTurn-' + instance + '" alt="' + msgs.msgOneRound + '">\
							<img src="' + path + "roscoPlayCircle.png" + '" class="rosco-TypeGame" id="roscoTypeGame-' + instance + '" alt="' + msgs.msg + '">\
						</div>\
					</div>\
					<div class="rosco-Letters" id="roscoLetters-' + instance + '">' + aLetters + '</div>\
					<div class="rosco-Author" id="roscoAuthor-' + instance + '"></div>\
					<div class="rosco-Image" id="roscoImage-' + instance + '">\
						<img src="' + path + "roscoCursor.gif" + '" class="rosco-Cursor" alt="Cursor" id="roscoCursor-' + instance + '"/> \
						<img src="' + path + "roscoHome.png" + '" class="rosco-HomeImage" alt="Image" id="roscoHomeImage-' + instance + '"/> \
						<img src="' + path + "roscoHome.png" + '" class="rosco-NoImage" alt="No Image" id="roscoNoImage-' + instance + '"/> \
					</div>\
					<div class="rosco-Solution" id="roscoSolution-' + instance + '">\
							<p id="pSolution-' + instance + '">' + msgs.msgReady + '</p>\
					</div>\
					<div  class="rosco-TypeDefinition"  id="roscoTypeDefinition-' + instance + '">\
						<p  id="pStartWith-' + instance + '">' + msgs.msgStartGame + '</p>\
					</div>\
					<div  class="rosco-Definition" id="roscoDefinition-' + instance + '">\
						<p id="pDefinition-' + instance + '">' + msgs.msgWrote + '.</p>\
					</div>\
					<div  class="rosco-AnswerButtons"  id="roscoAnswerButtons-' + instance + '">\
						<input type="button" value="' + msgs.msgHappen + '" id="btnPass-' + instance + '">\
						<input type="text" class="rosco-AnswerEdit" id="edAnswer-' + instance + '">\
						<input type="button" value="' + msgs.msgReply + '"  id="btnAnswer-' + instance + '">\
					</div>\
					<div  class="rosco-CodeAccess"  id="roscoCodeAccess-' + instance + '">\
						<label for="edCodeAccess-' + instance + '" id="labelMessageAccess">' + msgs.msgCodeAccess + '</label>\
						<input type="text" class="rosco-AnswerEdit" id="edCodeAccess-' + instance + '">\
						<input type="button" value="' + msgs.msgSubmit + '" id="btnSubmitCodeAccess-' + instance + '">\
					</div>\
				</div>\
				<div id="roscoGame-' + instance + '"class="rosco-Game">\
					<canvas class="rosco-Canvas" id="roscoCanvas-' + instance + '" width="360px" height="360px">\
						Your browser does not support the HTML5 canvas tag\
					</canvas>\
				</div>\
			</div>';
		return html
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
		var msgs = $eXeRosco.msgs,
			mOptions = $eXeRosco.options[instance];
		$('#edAnswer-' + instance).val("");
		$('#btnAnswer-' + instance).prop('disabled', true);
		$('#btnPass-' + instance).prop('disabled', true);
		$('#edAnswer-' + instance).prop('disabled', true);
		if (mOptions.showCodeAccess) {
			$('#roscoAnswerButtons-' + instance).hide();
			$('#roscoCodeAccess-' + instance).show();
			$('#pDefinition-' + instance).text(mOptions.messageCodeAccess);
			$('#pStartWith-' + instance).text(msgs.msgEnterCode);
			$('#edCodeAccess-' + instance).focus();
		} else {
			$('#roscoAnswerButtons-' + instance).show();
			$('#roscoCodeAccess-' + instance).hide();
			$('#pDefinition-' + instance).text(msgs.msgWrote);
			$('#pStartWith-' + instance).text(msgs.msgStartGame);
			$('#roscoTypeDefinition-' + instance).css('cursor', 'pointer').attr('unselectable', 'on');
			$('#roscoTypeDefinition-' + instance).on('click', function () {
				$eXeRosco.startGame(instance);
			});
		}
		$('#btnSubmitCodeAccess-' + instance).on('click', function () {
			var keyIntroduced = $.trim($('#edCodeAccess-' + instance).val()).toUpperCase(),
				correctKey = $.trim(mOptions.codeAccess).toUpperCase();
			if (keyIntroduced == correctKey) {
				$('#roscoAnswerButtons-' + instance).show();
				$('#roscoCodeAccess-' + instance).hide();
				$('#roscoTypeDefinition-' + instance).css('cursor', 'pointer').attr('unselectable', 'on');
				$('#roscoTypeDefinition-' + instance).on('click', function () {
					$eXeRosco.startGame(instance);
				});
				$eXeRosco.startGame(instance);
			} else {
				$('#pStartWith-' + instance).text(msgs.msgErrorCode);
				$('#edCodeAccess-' + instance).val('');
			}
		});

		$("#roscoGameMinimize-" + instance).on('click touchstart', function (e) {

			if (navigator.onLine) {
				$("#roscoGameContainer-" + instance).show()
				$("#roscoGameMinimize-" + instance).hide();
			} else {
				$('#roscoMessageMinimize-' + instance).text(msgs.msgNotNetwork);
				$("#roscoGameMinimize-" + instance).css('cursor', 'auto')
			}
		});

		$("#roscoUpArrow-" + instance).on('click touchstart', function (e) {
			$("#roscoGame-" + instance).hide();
			$("#roscoGameContainer-" + instance).hide();
			$("#roscoGameMinimize-" + instance).css('visibility', 'visible').show();
			if (!navigator.onLine) {
				$('#roscoMessageMinimize-' + instance).text(msgs.msgNotNetwork);
				$("#roscoGameMinimize-" + instance).css('cursor', 'auto')
			}
		});

		$('#edCodeAccess-' + instance).on("keydown", function (event) {
			if (event.which == 13 || event.keyCode == 13) {
				$('#btnSubmitCodeAccess-' + instance).trigger('click');
				return false;
			}
			return true;
		});
		var mTime = mOptions.durationGame,
			sTime = $eXeRosco.getTimeToString(mTime),
			imgTurn = mOptions.numberTurns == 2 ? $eXeRosco.idevicePath + 'roscoTwoTurns.png' : $eXeRosco.idevicePath + 'roscoOneTurns.png',
			altTurn = mOptions.numberTurns == 2 ? $eXeRosco.idevicePath  + 'One turn' : 'Two turns'
		$('#roscoTurn-' + instance).attr('src', imgTurn);
		$('#roscoTurn-' + instance).attr('alt', altTurn);
		$('#pTime-' + instance).text(sTime);
		$('#btnPass-' + instance).on('click', function () {
			$eXeRosco.passWord(instance);
		});
		$('#btnAnswer-' + instance).on('click', function () {
			$eXeRosco.answerQuetion(instance);
		});
		$('#edAnswer-' + instance).on("keydown", function (event) {
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
		$('#roscoLetters-' + instance).show();;
		$('#roscoGame-' + instance).hide();
		$('#roscoSolution-' + instance).show();
		$('#roscoTypeGame-' + instance).attr('src', $eXeRosco.idevicePath + "roscoPlayCircle.png");
		$('#roscoTypeGame-' + instance).on('click', function () {
			var src = $(this).attr('src');
			if (src.indexOf('roscoPlayCircle') != -1) {
				$('#roscoTypeGame-' + instance).attr('src', $eXeRosco.idevicePath + "roscoPlayRows.png");
				$('#roscoLetters-' + instance).hide();
				$('#roscoSolution-' + instance).hide();
				$('#roscoGame-' + instance).show();
			} else {
				$('#roscoTypeGame-' + instance).attr('src', $eXeRosco.idevicePath + "roscoPlayCircle.png");
				$('#roscoLetters-' + instance).show();
				$('#roscoSolution-' + instance).show();
				$('#roscoGame-' + instance).hide();
			}
		});
		$eXeRosco.drawText($eXeRosco.msgs.msgReady, $eXeRosco.colors.blue, instance)
		$('#pSolution-' + instance).css('color', $eXeRosco.colors.blue);
		$('#pStartWith-' + instance).css('color', $eXeRosco.colors.red);
		$eXeRosco.drawRows(instance);
	},

	startGame: function (instance) {
		var mOptions = $eXeRosco.options[instance];
		if (mOptions.gameStarted) {
			return;
		}
		mOptions.hits = 0;
		mOptions.solucion = '';
		mOptions.errors = 0;
		mOptions.score = 0;
		mOptions.counter = mOptions.durationGame;
		mOptions.gameActived = false;
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
				$eXeRosco.gameOver(instance);
				return;
			}
		}, 1000);
		$('#roscoTypeDefinition-' + instance).css('cursor', 'default');
		$('#pHits-' + instance).text(mOptions.hits);
		$('#pErrors-' + instance).text(mOptions.errors);
		$('#btnAnswer-' + instance).prop('disabled', false);
		$('#btnPass-' + instance).prop('disabled', false);
		$('#edAnswer-' + instance).prop('disabled', false).focus();
		$('#pStartWith-' + instance).css('color', $eXeRosco.colors.black);
		mOptions.gameActived = true;
		$eXeRosco.newWord(instance);
		mOptions.gameStarted = true;
	},

	uptateTime: function (tiempo, instance) {
		var mTime = $eXeRosco.getTimeToString(tiempo),
			mOptions = $eXeRosco.options[instance];
		$('#pTime-' + instance).text(mTime);
		if (mOptions.gameActived) {
			$eXeRosco.drawLetterActive(mOptions.activeWord, instance);
		}
	},

	getTimeToString: function (iTime) {
		var mMinutes = parseInt(iTime / 60) % 60,
			mSeconds = iTime % 60;
		return (mMinutes < 10 ? "0" + mMinutes : mMinutes) + ":" + (mSeconds < 10 ? "0" + mSeconds : mSeconds);
	},

	getRetroFeedMessages: function (iHit) {
		var sMessages = iHit ? $eXeRosco.msgs.msgSuccesses.split('|') : $eXeRosco.msgs.msgFailures.split('|');
		return sMessages[Math.floor(Math.random() * sMessages.length)];
	},

	gameOver: function (instance) {
		var msgs = $eXeRosco.msgs,
			mOptions = $eXeRosco.options[instance];
		clearInterval(mOptions.counterClock);
		$eXeRosco.uptateTime(mOptions.counter, instance);
		$('#pStartWith-' + instance).text(msgs.msgNewGame);
		var msg = msgs.msgYouHas.replace('%1', mOptions.hits);
		msg = msg.replace('%2', mOptions.errors)
		$('#pDefinition-' + instance).text(msg);
		$('#btnAnswer-' + instance).prop('disabled', true);
		$('#btnPass-' + instance).prop('disabled', true);
		$('#edAnswer-' + instance).prop('disabled', true);
		mOptions.activeWord = 0;
		mOptions.answeredWords = 0;
		$eXeRosco.drawRosco(instance);
		$eXeRosco.drawText(msgs.msgGameOver, $eXeRosco.colors.red, instance);
		$('#roscoTypeDefinition-' + instance).css('cursor', 'pointer').attr('unselectable', 'on');
		$('#edAnswer-' + instance).val('');
		$('#pSolution-' + instance).text(msgs.msgGameOver).css("color", $eXeRosco.colors.blue);
		$('#pStartWith-' + instance).css('color', $eXeRosco.colors.red);
		$eXeRosco.showImage('', 0, 0, '','', instance);
		mOptions.gameStarted = false;
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
		$('#pSolution-' + instance).css("color", color).text(texto);
	},

	showWord: function (activeLetter, instance) {
		var msgs = $eXeRosco.msgs,
			mWord = $eXeRosco.options[instance].wordsGame[activeLetter],
			definition = mWord.definition,
			letter = $eXeRosco.letters.charAt(activeLetter),
			start = mWord.type == 0 ? msgs.msgStartWith : msgs.msgContaint;
		start = start.replace('%1', letter);
		$('#pDefinition-' + instance).text(definition);
		$('#pStartWith-' + instance).text(start);
		$('#edAnswer-' + instance).val("");
		$('#pSolution-' + instance).val('');
		$eXeRosco.drawRosco(instance);
		$eXeRosco.drawText('', $eXeRosco.colors.blue, instance);
		$eXeRosco.options[instance].gameActived = true;
		$('#btnAnswer-' + instance).prop('disabled', false);
		$('#btnPass-' + instance).prop('disabled', false);
		$eXeRosco.showImage(mWord.url, mWord.x, mWord.y, mWord.author, mWord.alt, instance);
		$('#edAnswer-' + instance).prop('disabled', false).focus();
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
		if (mActiveWord == -10) {
			$eXeRosco.gameOver(instance);
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
			if (numActiveWord > 26) {
				if (mOptions.activeGameSpin < mOptions.numberTurns) {
					if (mOptions.answeredWords >= mOptions.validWords) {
						end = false
						return -10;
					}
					mOptions.activeGameSpin++;
					$('#roscoTurn-' + instance).attr('src', $eXeRosco.idevicePath + 'roscoOneTurns.png');
					$('#roscoTurn-' + instance).attr('alt', 'One turn');
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
			$('#edAnswer-' + instance).focus();
		}
		var letter = '#letterR' + $eXeRosco.letters.charAt(mOptions.activeWord) + '-' + instance;
		$(letter).css({
			'background-color': $eXeRosco.colors.blue,
			'color': $eXeRosco.colors.white
		});
		$eXeRosco.drawRosco(instance);
	},

	answerQuetion: function (instance) {
		var msgs = $eXeRosco.msgs,
			mOptions = $eXeRosco.options[instance];
		if (mOptions.gameActived == false) {
			return;
		}
		mOptions.gameActived = false;
		var letter = $eXeRosco.letters[mOptions.activeWord],
			answord = $('#edAnswer-' + instance).val();
		if ($.trim(answord) == "") {
			mOptions.gameActived = true;
			$eXeRosco.drawText(msgs.msgIndicateWord, $eXeRosco.colors.red, instance);
			return;
		}
		var message = "",
			Hit = true,
			word = $.trim(mOptions.wordsGame[mOptions.activeWord].word.toUpperCase());
		$('#btnAnswer-' + instance).prop('disabled', true);
		$('#btnPass-' + instance).prop('disabled', true);
		$('#edAnswer-' + instance).prop('disabled', true);
		var answord = $.trim($('#edAnswer-' + instance).val().toUpperCase());
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
		$('#pHits-' + instance).text(mOptions.hits);
		$('#pErrors-' + instance).text(mOptions.errors);
		if (mOptions.showClue && percentageHits >= mOptions.percentageClue) {
			$eXeRosco.gameOver(instance);
			clearInterval(mOptions.relojContador);
			$eXeRosco.drawMessage(true, mOptions.clueGame, true, instance);
			return;
		}
		letter = '#letterR' + letter + '-' + instance;
		$(letter).css({
			'background-color': mBackColor,
			'color': mFontColor
		});
		$eXeRosco.drawRosco(instance);
		message = mOptions.showSolution ? message : msgs.msgNewWord;
		var timeShowSolution = mOptions.showSolution ? mOptions.timeShowSolution * 1000 : 1000;
		setTimeout(function () {
			$eXeRosco.newWord(instance)
		}, timeShowSolution);
		$eXeRosco.drawMessage(Hit, word.toUpperCase(), false, instance);
	},
	
	drawMessage: function (Hit, word, pista, instance) {
		var mOptions = $eXeRosco.options[instance],
			mAnimo = $eXeRosco.getRetroFeedMessages(Hit),
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
			mAnimo = $eXeRosco.msgs.msgClue;
			posTextoAnimoY = yMessage - 15;
			porTextoPalabraY = posTextoAnimoY + 30;
			posTextoAnimoX = xCenter - ctxt.measureText(mAnimo).width / 2;
			$eXeRosco.wrapText(ctxt, mAnimo + ' ' + word, xMessage + 13, yMessage - 32, 257, 24);
			$('#pSolution-' + instance).css("color", lColor).text(mAnimo + word);
			return;
		}
		ctxt.fillText(mAnimo, posTextoAnimoX, posTextoAnimoY);
		$('#pSolution-' + instance).text(mAnimo);
		if (mOptions.showSolution) {
			word = word.replace(/[|]/g, ' o ');
			$('#pSolution-' + instance).text(mAnimo + ' ' + word);
			ctxt.fillText(mAnimo, posTextoAnimoX, posTextoAnimoY);
			$eXeRosco.wrapText(ctxt, word, xMessage + 10, posTextoAnimoY + 10, 257, 24);
		}
		$('#pSolution-' + instance).css("color", lColor);
		$('#edAnswer-' + instance).focus();
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
					angle = ($eXeRosco.angleSize * (iNumber + 20)) % 27,
					radiusLetter = $eXeRosco.radiusLetter,
					xCenter = $eXeRosco.mcanvas.width / 2,
					yCenter = $eXeRosco.mcanvas.height / 2,
					radius = $eXeRosco.mcanvas.width / 2 - radiusLetter * 2,
					yPoint = yCenter + radius * Math.sin(angle),
					xPoint = xCenter + radius * Math.cos(angle),
					font = ' bold 20px sans-serif ';
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
			var angle = ($eXeRosco.angleSize * (i + 20)) % 27,
				yPoint = yCenter + radius * Math.sin(angle),
				xPoint = xCenter + radius * Math.cos(angle),
				font = ' bold 20px sans-serif ';
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
