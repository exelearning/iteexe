/**
 * Rosco Activity iDevice (edition code)
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Manuel Narvaez Martinez
 * Author: Ricardo Malaga Floriano
 * Author: Ignacio Gros
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $exeDevice = {
	title: _("A-Z Quiz Game"),
	iDevicePath: "/scripts/idevices/rosco-activity/edition/",
	msgs: {},
	roscoVersion: 2,
	ci18n: {
		"msgReady": _("Ready?"),
		"msgStartGame": _("Click here to start"),
		"msgHappen": _("Move on"),
		"msgReply": _("Reply"),
		"msgSubmit": _("Submit"),
		"msgEnterCode": _("Enter the access code"),
		"msgErrorCode": _("The access code is not correct"),
		"msgGameOver": _("Game Over!"),
		"msgNewWord": _("New word"),
		"msgStartWith": _("Starts with %1"),
		"msgContaint": _("Contains letter %1"),
		"msgPass": _("Move on to the next word"),
		"msgIndicateWord": _("Provide a word"),
		"msgClue": _("Cool! The clue is:"),
		"msgNewGame": _("Click here for a new game"),
		"msgYouHas": _("You have got %1 hits and %2 misses"),
		"msgCodeAccess": _("Access code"),
		"msgPlayAgain": _("Play Again"),
		"msgRequiredAccessKey": _("Access code required"),
		"msgInformationLooking": _("The information you were looking for"),
		"msgPlayStart": _("Click here to play"),
		"msgErrors": _("Errors"),
		"msgMinimize": _("Minimize"),
		"msgMaximize": _("Maximize"),
		"msgHits": _("Hits"),
		"msgTime": _("Time Limit (mm:ss)"),
		"msgOneRound": _("One round"),
		"msgTowRounds": _("Two rounds"),
		"msgImage": _("Image"),
		"msgNoImage": _("No image"),
		"msgWrote": _("Write the correct word and click on Reply. If you hesitate, click on Move on."),
		"msgNotNetwork": _("You can only play this game with internet connection."),
		"msgSuccesses": _("Right! | Excellent! | Great! | Very good! | Perfect!"),
		"msgFailures": _("It was not that! | Incorrect! | Not correct! | Sorry! | Error!"),
		"msgEndGameScore": _("Please start the game before saving your score."),
		"msgScoreScorm": _("The score can't be saved because this page is not part of a SCORM package."),
		"msgShowRoulette": _("Show word wheel"),
		"msgHideRoulette": _("Hide word wheel"),
		"msgQuestion": _("Question"),
		"msgAnswer": _("Answer"),
		"msgOnlySaveScore": _("You can only save the score once!"),
		"msgOnlySave": _("You can only save once"),
		"msgInformation": _("Information"),
		"msgYouScore": _("Your score"),
		"msgOnlySaveAuto": _("Your score will be saved after each question. You can only play once."),
		"msgSaveAuto": _("Your score will be automatically saved after each question."),
		"msgAuthor": _("Authorship"),
		"msgSeveralScore": _("You can save the score as many times as you want"),
		"msgYouLastScore": _("The last score saved is"),
		"msgActityComply": _("You have already done this activity."),
		"msgPlaySeveralTimes": _("You can do this activity as many times as you want"),
		"msgFullScreen": _("Full Screen"),
		"msgExitFullScreen": _("Exit Full Screen"),
		"msgMoveOne": _("Move on"),
		"msgAudio": _("Audio"),
		"msgCorrect": _("Correct"),
		"msgIncorrect": _("Incorrect"),
		"msgWhiteBoard": _("Digital blackboard")
	},
	colors: {
		black: "#1c1b1b",
		blue: '#0099cc',
		verde: '#009245',
		red: '#ff0000',
		white: '#ffffff',
		yellow: '#f3d55a',
		grey: '#818181'
	},
	letters: _("abcdefghijklmnopqrstuvwxyz").toUpperCase(),
	modeBoard:false,
	init: function () {
		this.letters = $exeDevice.replaceLetters(this.letters);
		this.setMessagesInfo();
		this.createForm();
		this.addEvents();
	},
	setMessagesInfo: function () {
		var msgs = this.msgs;
		msgs.msgNotStart = _("%1 does not start with letter %2");
		msgs.msgNotContain = _("%1 does not contain letter %2");
		msgs.msgProvideDefinition = _("Please provide the word definition or the valid URL of an image");
		msgs.msgGame = _("Game");
		msgs.msgSelectFile = _("The selected file does not contain a valid game");
		msgs.msgURLValid = _("You must upload or indicate the valid URL of an image");
		msgs.msgOneWord = _("Please provide at least one word");
		msgs.msgProvideTimeSolution = _("You must provide the time to view the solution");
		msgs.msgNoSuportBrowser = _("Your browser is not compatible with this tool.");

	},
	createForm: function () {
		var path = this.iDevicePath,
			wordInstructions = _('Provide a word and its definition. May toggle between: "Word starts" or "Word contains", by clicking on %s');
		wordInstructions = wordInstructions.replace("%s", '<img src="' + path + 'roscoIcoStart.png" alt="' + _("Starts with/Contains") + '" title="' + _("Starts with/Contains") + '" />')
		var html = '\
			<div id="roscoIdeviceForm">\
				<div class="exe-idevice-info">'+_("Create activities in which students are given a definition and they have to guess the word that starts with a letter or contains a letter.")+' <a href="https://youtu.be/es8bjnEuyIE" hreflang="es" rel="lightbox"  target="_blank">'+_("Use Instructions")+'</a></div>\
				<div class="exe-form-tab" title="' + _('General settings') + '">\
                    ' + $exeAuthoring.iDevice.gamification.instructions.getFieldset(_("Observe the letters, identify and fill in the missing words.")) + '\
					<fieldset class="exe-fieldset exe-fieldset-closed">\
						<legend><a href="#">' + _("Options") + '</a></legend>\
						<div>\
							<p>\
								<label for="roscoShowMinimize"><input type="checkbox" id="roscoShowMinimize"> ' + _("Show minimized.") + ' </label>\
							</p>\
							<p>\
								<label for="roscoDuration">' + _("Game time (seconds)") + ': </label>\
								<input type="number" name="roscoDuration" id="roscoDuration" value="240" min="5" max="9999" step="10" required /> \
							</p>\
							<p>\
								<label for="roscoNumberTurns">' + _("Number of rounds") + ': </label>\
								<input type="number" value="1" min="1" max="2" id="roscoNumberTurns" required />\
							</p>\
							<p>\
								<label for="roscoShowSolution"><input type="checkbox" checked id="roscoShowSolution"> ' + _("Show solutions") + '. </label> \
								<label for="roscoTimeShowSolution">' + _("Show solution in") + ': \
									<input type="number" name="roscoTimeShowSolution" id="roscoTimeShowSolution" value="3" min="1" max="9" /> \
								' + _("seconds") + '</label>\
							</p>\
							<p>\
								<label for="roscoCaseSensitive"><input type="checkbox" id="roscoCaseSensitive"> ' + _("Case sensitive") + ' </label>\
							</p>\
							<p>\
								<label for="roscoModeBoard"><input type="checkbox" id="roscoModeBoard"> ' + _("Digital blackboard mode") + ' </label>\
							</p>\
						</div>\
					</fieldset>\
					<fieldset class="exe-fieldset">\
						<legend><a href="#">' + _("Words") + '</a></legend>\
						<div id="roscoDataWord">\
                            <div class="exe-idevice-info">' + wordInstructions + '</div>\
							' + this.getWords().join('') + '\
                        </div>\
					</fieldset>\
					' + $exeAuthoring.iDevice.common.getTextFieldset("after") + '\
				</div>\
				' + $exeAuthoring.iDevice.gamification.itinerary.getTab() + '\
				' + $exeAuthoring.iDevice.gamification.scorm.getTab() + '\
				' + $exeAuthoring.iDevice.gamification.common.getLanguageTab(this.ci18n) + '\
				' + $exeAuthoring.iDevice.gamification.share.getTab() + '\
			</div>\
			';
		var field = $("textarea.jsContentEditor").eq(0);
		field.before(html);
		$exeAuthoring.iDevice.tabs.init("roscoIdeviceForm");
		$exeAuthoring.iDevice.gamification.scorm.init();
		this.loadPreviousValues(field);
	},
	getLetters: function (dataGame) {
		if (typeof dataGame.letters == "undefined") {
			dataGame.letters = '';
			for (var i = 0; i < dataGame.wordsGame.length; i++) {
				dataGame.letters += dataGame.wordsGame[i].letter;
			}
		}
		return dataGame.letters;
	},
	updateFieldGame: function (dataGame) {
		$exeDevice.letters = $exeDevice.getLetters(dataGame);
		$('#roscoDataWord').append($exeDevice.getWords().join(''));
		$('#roscoDuration').val(dataGame.durationGame)
		$('#roscoNumberTurns').val(dataGame.numberTurns);
		$('#roscoShowSolution').prop("checked", dataGame.showSolution);
		$('#roscoShowMinimize').prop("checked", dataGame.showMinimize);
		$('#roscoTimeShowSolution').val(dataGame.timeShowSolution);
		$('#roscoModeBoard').prop("checked", dataGame.modeBoard);
		$('#roscoTimeShowSolution').prop('disabled', !dataGame.showSolution);
		for (var i = 0; i < dataGame.wordsGame[i].length; i++) {
			dataGame.wordsGame[i].audio = typeof dataGame.wordsGame[i].audio == "undefined" ? '' : dataGame.wordsGame[i].audio;
		}

		$('#roscoCaseSensitive').prop('checked', dataGame.caseSensitive);

		$('.roscoWordEdition').each(function (index) {
			var word = index < dataGame.wordsGame.length ? dataGame.wordsGame[index].word : "";
			$(this).val(word);
		});
		$('.roscoDefinitionEdition').each(function (index) {
			var definition = index < dataGame.wordsGame.length ? dataGame.wordsGame[index].definition : "";
			$(this).val(definition);
		});
		$('.roscoAuthorEdition').each(function (index) {
			var author = index < dataGame.wordsGame.length ? dataGame.wordsGame[index].author : "";
			$(this).val(author);
		});
		$('.roscoAlt').each(function (index) {
			var alt = index < dataGame.wordsGame.length ? dataGame.wordsGame[index].alt : "";
			$(this).val(alt);
		});
		$('.roscoURLImageEdition').each(function (index) {
			var url = index < dataGame.wordsGame.length ? dataGame.wordsGame[index].url : "";
			$(this).val(url);
		});
		$('.roscoURLAudioEdition').each(function (index) {
			var audio = index < dataGame.wordsGame.length ? dataGame.wordsGame[index].audio : "";
			$(this).val(audio);
		});
		$('.roscoXImageEdition').each(function (index) {
			var x = index < dataGame.wordsGame.length ? dataGame.wordsGame[index].x : 0;
			$(this).val(x);
		});
		$('.roscoYImageEdition').each(function (index) {
			var y = index < dataGame.wordsGame.length ? dataGame.wordsGame[index].y : 0;
			$(this).val(y);
		});
		$('.roscoStartEdition').each(function (index) {
			var type = index < dataGame.wordsGame.length ? dataGame.wordsGame[index].type : 1;
			var imageStart = (type) ? "roscoContains.png" : "roscoStart.png";
			$(this).attr('src', $exeDevice.iDevicePath + imageStart);
		});
		$('.roscoSelectImageEdition').each(function (index) {
			var url = index < dataGame.wordsGame.length ? dataGame.wordsGame[index].url : "";
			var imageSelect = $.trim(url).length > 0 ? "roscoSelectImage.png" : "roscoSelectImageInactive.png";
			$(this).attr('src', $exeDevice.iDevicePath + imageSelect);
		});
		$('.imagesLink').each(function (index) {
			var url = index < dataGame.wordsGame.length ? dataGame.wordsGame[index].url : "";
			var imageSelect = $.trim(url).length > 0 ? "roscoSelectImage.png" : "roscoSelectImageInactive.png";
			$(this).attr('src', $exeDevice.iDevicePath + imageSelect);
		});
		$('h3.roscoLetterEdition').each(function (index) {
			var word = index < dataGame.wordsGame.length ? dataGame.wordsGame[index].word : "";
			var longitud = word.length;
			var color = longitud > 0 ? $exeDevice.colors.blue : $exeDevice.colors.grey;
			$(this).css('background-color', color);
		});
		$exeAuthoring.iDevice.gamification.itinerary.setValues(dataGame.itinerary);
		$exeAuthoring.iDevice.gamification.scorm.setValues(dataGame.isScorm, dataGame.textButtonScorm, dataGame.repeatActivity);

	},

	loadPreviousValues: function (field) {
		var originalHTML = field.val();
		if (originalHTML != '') {
			var wrapper = $("<div></div>");
			wrapper.html(originalHTML);
			var json = $('.rosco-DataGame', wrapper).text(),
				version = $('.rosco-version', wrapper).text();
			if (version.length == 1) {
				json = $exeDevice.Decrypt(json);
			}

			var dataGame = $exeDevice.isJsonString(json);
			dataGame.modeBoard=typeof dataGame.modeBoard =="undefined"?false:dataGame.modeBoard;
			$exeDevice.modeBoard=dataGame.modeBoard;
			version = version == '' || typeof version == 'undefined' ? 0 : parseInt(version);
			for (var i = 0; i < dataGame.wordsGame.length; i++) {
				if (version < 2) {
					dataGame.wordsGame[i].audio = '';
				}
			}

			var $imagesLink = $('.rosco-LinkImages', wrapper),
				$audiosLink = $('.rosco-LinkAudios', wrapper);

			$imagesLink.each(function (index) {
				dataGame.wordsGame[index].url = $(this).attr('href');
				if (dataGame.wordsGame[index].url.length < 4) {
					dataGame.wordsGame[index].url = "";
				}
			});

			$audiosLink.each(function (index) {
				dataGame.wordsGame[index].audio = $(this).attr('href');
				if (dataGame.wordsGame[index].audio.length < 4) {
					dataGame.wordsGame[index].audio = "";
				}
			});


			$exeDevice.updateFieldGame(dataGame);
			var instructions = $(".rosco-instructions", wrapper);
			if (instructions.length == 1) $("#eXeGameInstructions").val(instructions.html());
			// i18n
			$exeAuthoring.iDevice.gamification.common.setLanguageTabValues(dataGame.msgs);
			// Text after
			var textAfter = $(".rosco-extra-content", wrapper);
			if (textAfter.length == 1) $("#eXeIdeviceTextAfter").val(textAfter.html());
		}
	},
	clickImage: function (img, epx, epy) {
		var $cursor = $(img).siblings('.roscoCursorEdition'),
			$x = $(img).parent().siblings('.roscoBarEdition').find('.roscoXImageEdition'),
			$y = $(img).parent().siblings('.roscoBarEdition').find('.roscoYImageEdition');
		if (epx == 0 && epy == 0) {
			$x.val(0);
			$y.val(0);
			$cursor.hide();
			return;
		}
		var posX = epx - $(img).offset().left,
			posY = epy - $(img).offset().top,
			wI = $(img).width() > 0 ? $(img).width() : 1,
			hI = $(img).height() > 0 ? $(img).height() : 1,
			lI = $(img).position().left,
			tI = $(img).position().top;
		$x.val(posX / wI);
		$y.val(posY / hI);
		$cursor.css({
			left: posX + lI,
			top: posY + tI,
			'z-index': 3000
		});
		$cursor.show();
	},
	paintMouse: function (image, cursor, x, y) {
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
	showImage: function (image, url, x, y, alt, type) {
		var $cursor = image.siblings('.roscoCursorEdition'),
			$noImage = image.siblings('.roscoNoImageEdition'),
			$iconSelection = image.parents('.roscoWordMutimediaEdition').find('.roscoSelectImageEdition');
		$iconSelection.attr('src', $exeDevice.iDevicePath + 'roscoSelectImageInactive.png');
		image.attr('alt', '');
		if ($.trim(url).length == 0) {
			$cursor.hide();
			image.hide();
			$noImage.show();
			if (type == 1) {
				eXe.app.alert($exeDevice.msgs.msgURLValid);
			}
			return false;
		};
		url = $exeDevice.extractURLGD(url);
		image.prop('src', url)
			.on('load', function () {
				if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
					$cursor.hide();
					image.hide();
					$noImage.show();
					if (type == 1) {
						eXe.app.alert($exeDevice.msgs.msgURLValid);
					}
					return false;
				} else {
					var mData = $exeDevice.placeImageWindows(this, this.naturalWidth, this.naturalHeight);
					$exeDevice.drawImage(this, mData);
					image.attr('alt', alt);
					image.show();
					$cursor.show();
					$noImage.hide();
					$exeDevice.paintMouse(this, $cursor, x, y);
					$iconSelection.attr('src', $exeDevice.iDevicePath + 'roscoSelectImage.png');
					return true;
				}
			}).on('error', function () {
				$cursor.hide();
				image.hide();
				$noImage.show();
				if (type == 1) {
					eXe.app.alert($exeDevice.msgs.msgURLValid);
				}
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
	Encrypt: function (str) {
		if (!str) str = "";
		str = (str == "undefined" || str == "null") ? "" : str;
		try {
			var key = 146;
			var pos = 0;
			var ostr = '';
			while (pos < str.length) {
				ostr = ostr + String.fromCharCode(str.charCodeAt(pos) ^ key);
				pos += 1;
			}
			return escape(ostr);
		} catch (ex) {
			return '';
		}
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
	save: function () {
		var dataGame = this.validateData();
		if (!dataGame) {
			return false;
		}
		var fields = this.ci18n,
			i18n = fields;
		for (var i in fields) {
			var fVal = $("#ci18n_" + i).val();
			if (fVal != "") i18n[i] = fVal;
		}
		dataGame.msgs = i18n;
		var json = JSON.stringify(dataGame),
			divContent = "";
		json = $exeDevice.Encrypt(json);
		if (dataGame.instructions != "") divContent = '<div class="rosco-instructions gameQP-instructions">' + dataGame.instructions + '</div>';
		var linksImages = $exeDevice.createlinksImage(dataGame.wordsGame),
			linksAudios = $exeDevice.createlinksAudio(dataGame.wordsGame),
			html = '<div class="rosco-IDevice">';
		html += '<div class="rosco-version js-hidden">' + $exeDevice.roscoVersion + '</div>';
		html += divContent;
		html += '<div class="rosco-DataGame js-hidden">' + json + '</div>';
		html += linksImages;
		html += linksAudios;
		var textAfter = tinymce.editors[1].getContent();
		if (textAfter != "") {
			html += '<div class="rosco-extra-content">' + textAfter + '</div>';
		}
		html += '<div class="rosco-bns js-hidden">' + $exeDevice.msgs.msgNoSuportBrowser + '</div>';
		html += '</div>';
		return html;
	},
	createlinksImage: function (wordsGame) {
		var html = '';
		for (var i = 0; i < wordsGame.length; i++) {
			if (typeof wordsGame[i].url != "undefined") {
				var linkImage = '<a href="' + wordsGame[i].url + '" class="js-hidden rosco-LinkImages">' + i + '</a>';
				if (wordsGame[i].url.length == 0) {
					linkImage = '<a href="#" class="js-hidden rosco-LinkImages">' + i + '</a>';
				}
				html += linkImage;
			}
		}
		return html;
	},
	createlinksAudio: function (wordsGame) {
		var html = '';
		for (var i = 0; i < wordsGame.length; i++) {
			if (typeof wordsGame[i].audio != "undefined") {
				var linkAudio = '<a href="' + wordsGame[i].audio + '" class="js-hidden rosco-LinkAudios">' + i + '</a>';
				if (wordsGame[i].audio.length == 0) {
					linkAudio = '<a href="#" class="js-hidden rosco-LinkAudios">' + i + '</a>';
				}
				html += linkAudio;
			}

		}
		return html;
	},
	removeTags: function (str) {
		var wrapper = $("<div></div>");
		wrapper.html(str);
		return wrapper.text();
	},
	startContains: function (letter, word, type) {
		var start = false,
			vocalLetter = "AEIOU",
			mWord = $.trim(word.toUpperCase()),
			mletter = $exeDevice.getRealLetter(letter);
		mWord = (type == 0) ? mWord.slice(0, mletter.length) : mWord.substr(1);
		if (vocalLetter.indexOf(letter) != -1) {
			if (letter == "A" && /[AÁÀÂÄ]/.test(mWord)) {
				start = true;
			} else if (letter == "E" && /[EÉÈÊË]/.test(mWord)) {
				start = true;
			} else if (letter == "I" && /[IÍÌÎÏ]/.test(mWord)) {
				start = true;
			} else if (letter == "O" && /[OÓÒÔÖ]/.test(mWord)) {
				start = true;
			} else if (letter == "U" && /[UÚÙÛÜ]/.test(mWord)) {
				start = true;
			}
		} else {
			start = mWord.indexOf(mletter) != -1;
		}
		return start;
	},
	startContainsAll: function (letter, word, type) {
		var words = word.split('|'),
			start = true;
		for (var i = 0; i < words.length; i++) {
			var sWord = $.trim(words[i]).toUpperCase();
			if (this.startContains(letter, sWord, type) == false) {
				start = false;
				break;
			}
		}
		return start;
	},
	getDataWord: function (letter) {
		var mLetter = $exeDevice.getRealLetter(letter),
			path = $exeDevice.iDevicePath,
			fileWord = '\
				<div class="roscoWordMutimediaEdition">\
					<div class="roscoFileWordEdition">\
						<h3 class="roscoLetterEdition">' + mLetter + '</h3>\
						<a href="#" class="roscoLinkStart" title="' + _("Click here to toggle between Word starts with... and Word contains...") + '"><img src="' + path + 'roscoStart.png" alt="' + _("The word starts with...") + '" class="roscoStartEdition"/></a>\
						<label class="sr-av">' + _("Word") + ': </label><input type="text" class="roscoWordEdition" placeholder="' + _("Word") + '">\
						<label class="sr-av">' + _("Definition") + ': </label><input type="text" class="roscoDefinitionEdition" placeholder="' + _("Definition") + '">\
						<a href="#" class="roscoLinkSelectImage" title="' + _("Show/Hide image") + '"><img src="' + path + 'roscoSelectImageInactive.png" alt="' + _("Select Image") + '" class="roscoSelectImageEdition"/></a>\
					</div>\
					<div class="roscoImageBarEdition">\
						<div class="roscoImageEdition">\
							<img src="' + path + 'quextIECursor.gif" class="roscoCursorEdition" alt="" /> \
							<img src="" class="roscoHomeImageEdition" alt="' + _("No image") + '" /> \
							<img src="' + path + 'roscoHomeImage.png" class="roscoNoImageEdition" alt="' + _("No image") + '" /> \
						</div>\
						<div class="roscoBarEdition">\
							<label>' + _("Image") + ': </label><input type="text" class="exe-file-picker roscoURLImageEdition" id="roscoURLImage-' + letter + '" placeholder="' + _("Indicate a valid URL of an image or select one from your device") + '"/>\
							<label class="sr-av">X: </label><input type="text" class="roscoXImageEdition" value="0" readonly />\
							<label class="sr-av">Y: </label><input type="text" class="roscoYImageEdition" value="0" readonly />\
						</div>\
						<div class="roscoMetaData">\
							<label for="roscoAlt' + letter + '">Alt: </label><input type="text" id="roscoAlt' + letter + '" class="roscoAlt" />\
							<label for="roscoAuthorEdition' + letter + '">' + _("Authorship") + ': </label><input type="text" id="roscoAuthorEdition' + letter + '" class="roscoAuthorEdition" />\
						</div>\
						<div class="roscoAudioDiv">\
							<label for="roscoEURLAudio' + letter + '">' + _("Audio") + ': </label>\
							<input type="text" class="exe-file-picker roscoURLAudioEdition"  id="roscoEURLAudio' + letter + '"  placeholder="' + _("Indicate a valid URL of an audio or select one from your device") + '"/>\
							<a href="#" class="roscoPlayAudio" title="' + _("Play audio") + '" id="roscoPlayAudio' + letter + '" ><img src="' + path + 'quextIEPlay.png" alt="' + _("Play audio") + '" class="roscoIconoPlayAudio"/></a>\
							<a href="#" class="roscoLinkClose" title="' + _("Hide image") + '"><img src="' + path + 'roscoClose.png" alt="' + _("Minimize") + '" class="roscoCloseImage"/></a>\
						</div>\
						<hr class="roscoSeparation"/>\
					</div>\
				</div>';

		return fileWord;
	},
	getWords: function () {
		$('.roscoWordMutimediaEdition').remove();
		var rows = [];
		for (var i = 0; i < this.letters.length; i++) {
			var letter = this.letters.charAt(i),
				wordData = this.getDataWord(letter);
			rows.push(wordData);
		}
		return rows;

	},
	validateData: function () {
		var clear = $exeDevice.removeTags,
			msgs = $exeDevice.msgs,
			instructions = tinymce.editors[0].getContent(),
			textAfter = tinymce.editors[1].getContent(),
			showMinimize = $('#roscoShowMinimize').is(':checked'),
			showSolution = $('#roscoShowSolution').is(':checked'),
			modeBoard = $('#roscoModeBoard').is(':checked'),
			timeShowSolution = parseInt(clear($.trim($('#roscoTimeShowSolution').val()))),
			durationGame = parseInt(clear($('#roscoDuration').val())),
			numberTurns = parseInt(clear($('#roscoNumberTurns').val())),
			itinerary = $exeAuthoring.iDevice.gamification.itinerary.getValues(),
			caseSensitive = $('#roscoCaseSensitive').is(':checked'),
			itinerary = $exeAuthoring.iDevice.gamification.itinerary.getValues();
		if (!itinerary) return false;
		if (showSolution && timeShowSolution.length == 0) {
			eXe.app.alert(msgs.msgProvideTimeSolution);
			return false;
		}
		var words = [],
			zr = true;
		$('.roscoWordEdition').each(function () {
			var word = clear($(this).val().trim());
			words.push(word);
			if (word.length > 0) zr = false;
		});
		if (zr) {
			eXe.app.alert(msgs.msgOneWord);
			return false;
		}
		var definitions = [];
		$('.roscoDefinitionEdition').each(function () {
			var definition = clear($(this).val());
			definitions.push(definition);
		});
		var authors = [];
		$('.roscoAuthorEdition').each(function () {
			var author = clear($(this).val());
			authors.push(author);
		});
		var alts = [];
		$('.roscoAlt').each(function () {
			var alt = clear($(this).val());
			alts.push(alt);
		});
		var urls = [];
		$('.roscoURLImageEdition').each(function () {
			urls.push($(this).val());
		});

		var audios = [];
		$('.roscoURLAudioEdition').each(function () {
			audios.push($(this).val());
		});
		var xs = [];
		$('.roscoXImageEdition').each(function () {
			xs.push($(this).val());
		});
		var ys = [];
		$('.roscoYImageEdition').each(function () {
			ys.push($(this).val());
		});
		var types = [];
		$('.roscoStartEdition').each(function () {
			var t = $(this).attr('src'),
				type = t.indexOf('roscoContains') != -1 ? 1 : 0;
			types.push(type);
		});
		for (var i = 0; i < this.letters.length; i++) {
			var letter = this.letters.charAt(i),
				mletter = $exeDevice.getRealLetter(letter),
				word = $.trim(words[i]),
				definition = $.trim(definitions[i]),
				url = $.trim(urls[i]),
				mType = types[i];
			if (word.length > 0) {
				if (!$exeDevice.modeBoard && mType == 0 && !(this.startContainsAll(letter, word, mType))) {
					var message = _("%1 does not start with letter %2").replace('%1', word);
					message = message.replace('%2', mletter);
					eXe.app.alert(message);
					return false;
				} else if(!$exeDevice.modeBoard && mType == 1 && !(this.startContainsAll(letter, word, mType))) {
					var message = $exeDevice.msgs.msgNotContain.replace('%1', word);
					message = message.replace('%2', mletter);
					eXe.app.alert(message);
					return false;
				} else if (($.trim(definition).length == 0) && (url.length < 10)) {
					eXe.app.alert($exeDevice.msgs.msgProvideDefinition + ' ' + word);
					return false;
				}
			}
		}
		var wordsGame = [];
		for (var i = 0; i < this.letters.length; i++) {
			var p = new Object();
			p.letter = this.letters.charAt(i);
			p.word = $.trim(words[i]);
			p.definition = definitions[i];
			p.type = types[i];
			p.alt = alts[i];
			p.author = authors[i];
			p.url = urls[i];
			p.audio = audios[i];
			p.x = parseFloat(xs[i]);
			p.y = parseFloat(ys[i]);
			if (p.word.length == 0) {
				p.definition = '';
				p.url = '';
				p.x = 0
				p.y = 0;
				p.author = '';
				p.alt = '';
			}
			if (p.url.length < 8) {
				p.x = 0
				p.y = 0;
				p.author = '';
				p.alt = '';
			}
			wordsGame.push(p);
		}
		var scorm = $exeAuthoring.iDevice.gamification.scorm.getValues();
		var data = {
			'typeGame': 'Rosco',
			'instructions': instructions,
			'timeShowSolution': timeShowSolution,
			'durationGame': durationGame,
			'numberTurns': numberTurns,
			'instructions': instructions,
			'showSolution': showSolution,
			'showMinimize': showMinimize,
			'itinerary': itinerary,
			'wordsGame': wordsGame,
			'isScorm': scorm.isScorm,
			'textButtonScorm': scorm.textButtonScorm,
			'repeatActivity': scorm.repeatActivity,
			'letters': this.letters,
			'textAfter': escape(textAfter),
			'caseSensitive': caseSensitive,
			'version': 2,
			'modeBoard':modeBoard

		}
		return data;
	},
	replaceLetters: function (letters) {
		return letters.toUpperCase()
			.replace(/[,\s]/g, '')
			.replace(/L·L/g, '0')
			.replace(/SS/g, '1');
	},
	getRealLetter: function (letter) {
		var mletter = letter;
		if (letter == "0") {
			mletter = 'L·L'
		} else if (letter == "1") {
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
	importGame: function (content) {
		var game = $exeDevice.isJsonString(content);
		if (!game || typeof game.typeGame == "undefined") {
			eXe.app.alert($exeDevice.msgs.msgSelectFile);
			return;
		} else if (game.typeGame !== 'Rosco') {
			eXe.app.alert($exeDevice.msgs.msgSelectFile);
			return;
		}
		$exeDevice.updateFieldGame(game);
		tinymce.editors[0].setContent(game.instructions);
		var tAfter = game.textAfter || '';
		tinymce.editors[1].setContent(unescape(tAfter));
		$('.exe-form-tabs li:first-child a').click();
	},
	addEvents: function () {
		var msgs = $exeDevice.msgs;
		$('#roscoDataWord a.roscoLinkStart').on('click', function (e) {
			e.preventDefault();
			var imageStart = $(this).find('.roscoStartEdition').attr('src').indexOf('roscoContains.png') != -1 ? "roscoStart.png" : "roscoContains.png";
			var alt = _("The word starts with...");
			if (imageStart == "roscoContains.png") alt = _("The word contains...");
			$(this).find('.roscoStartEdition').attr('src', $exeDevice.iDevicePath + imageStart).attr("alt", alt);
		});
		$('#roscoDataWord input.roscoURLImageEdition').on('change', function () {
			var validExt = ['jpg', 'png', 'gif', 'jpeg', 'svg'],
				selectedFile = $(this).val(),
				ext = selectedFile.split('.').pop().toLowerCase();
			if ((selectedFile.indexOf('resources') == 0 || selectedFile.indexOf('/previews/') == 0) && validExt.indexOf(ext) == -1) {
				eXe.app.alert(_("Supported formats") + ": jpg, jpeg, gif, png, svg");
				return false;
			}
			var img = $(this).parent().siblings('.roscoImageEdition').find('.roscoHomeImageEdition'),
				url = selectedFile,
				alt = $(this).parent().siblings(".roscoMetaData").find('.roscoAlt').val(),
				x = parseFloat($(this).siblings('.roscoXImageEdition').val()),
				y = parseFloat($(this).siblings('.roscoYImageEdition').val());
			x = x ? x : 0;
			y = y ? y : 0;
			$exeDevice.showImage(img, url, x, y, alt, 1);
		});
		$('#roscoDataWord input.roscoURLAudioEdition').on('change', function () {
			var selectedFile = $(this).val();
			if (selectedFile.length == 0) {
				eXe.app.alert(_("Supported formats") + ": mp3', 'ogg', 'wav'");
			} else {
				if (selectedFile.length > 4) {
					$exeDevice.playSound(selectedFile);
				}
			}
		});

		$('#roscoDataWord a.roscoPlayAudio').on('click', function (e) {
			e.preventDefault();
			var $audio = $(this).parent().find('.roscoURLAudioEdition').first(),
				selectedFile = $audio.val();
			if (selectedFile.length == 0) {
				eXe.app.alert(_("Supported formats") + ": mp3', 'ogg', 'wav'");
			} else {
				if (selectedFile.length > 4) {
					$exeDevice.playSound(selectedFile);
				}
			}
		});

		$('#roscoDataWord a.roscoLinkSelectImage').on('click', function (e) {
			e.preventDefault();
			var $pater = $(this).parent().siblings('.roscoImageBarEdition'),
				img = $pater.find('.roscoHomeImageEdition'),
				url = $pater.find('.roscoURLImageEdition').val(),
				alt = $pater.find('.roscoAlt').val(),
				y = parseFloat($pater.find('.roscoYImageEdition').val()),
				x = parseFloat($pater.find('.roscoXImageEdition').val());
			x = x ? x : 0;
			y = y ? y : 0;
			$pater.slideToggle();
			$exeDevice.stopSound();
			$exeDevice.showImage(img, url, x, y, alt, 0);
		});
		$('#roscoDataWord a.roscoLinkClose').on('click', function (e) {
			e.preventDefault();
			$exeDevice.stopSound();
			$(this).parents('.roscoImageBarEdition').slideUp();
		});
		$('#roscoDataWord .roscoWordEdition').on('focusout', function () {
			var word = $(this).val().trim(),
				letter = $(this).siblings().filter(".roscoLetterEdition").text(),
				color = $(this).val().trim() == "" ? $exeDevice.colors.grey : $exeDevice.colors.blue,
				mletter = $exeDevice.getCaracterLetter(letter);
			$(this).siblings().filter('.roscoLetterEdition').css("background-color", color);
			if (word.length > 0) {
				var mType = $(this).parent().find('.roscoStartEdition').attr('src').indexOf("roscoContains.png") != -1 ? 1 : 0;
				if (!$exeDevice.modeBoard  && mType == 0 && !($exeDevice.startContainsAll(mletter, word, mType))) {
					var message = msgs.msgNotStart.replace('%1', word);
					message = message.replace('%2', letter);
					eXe.app.alert(message);
				} else if (!$exeDevice.modeBoard && mType == 1 && !($exeDevice.startContainsAll(mletter, word, mType))) {
					var message = msgs.msgNotContain.replace('%1', word);
					message = message.replace('%2', letter);
					eXe.app.alert(message);
				}
			}
		});
		$('#roscoShowSolution').on('change', function () {
			var mark = $(this).is(':checked');
			$('#roscoTimeShowSolution').prop('disabled', !mark);
		});
		$('#roscoModeBoard').on('change', function () {
			$exeDevice.modeBoard= $(this).is(':checked');

		});
		$('.roscoHomeImageEdition').on('click', function (e) {
			$exeDevice.clickImage(this, e.pageX, e.pageY);
		});
		$('.roscoWordMutimediaEdition').on('dblclick', 'img.roscoHomeImageEdition', function () {
			$exeDevice.clickImage(this, 0, 0);
		});
		$('.roscoWordMutimediaEdition').on('click', '.roscoCursorEdition', function (e) {
			var $x = $(this).parent().siblings('.roscoBarEdition').find('.roscoXImageEdition'),
				$y = $(this).parent().siblings('.roscoBarEdition').find('.roscoYImageEdition');
			$x.val(0);
			$y.val(0);
			$(this).hide();

		});
		$('#roscoDuration').on('keyup', function () {
			var v = this.value;
			v = v.replace(/\D/g, '');
			v = v.substring(0, 4);
			this.value = v;
		});
		$('#roscoNumberTurns').on('keyup', function () {
			var v = this.value;
			v = v.replace(/\D/g, '');
			v = v.substring(0, 1);
			this.value = v;
		});
		$('#roscoTimeShowSolution').on('keyup', function () {
			var v = this.value;
			v = v.replace(/\D/g, '');
			v = v.substring(0, 1);
			this.value = v;
		});
		$('#roscoNumberTurns').on('focusout', function () {
			this.value = this.value.trim() == '' ? 1 : this.value;
			this.value = this.value > 2 ? 2 : this.value;
			this.value = this.value < 1 ? 1 : this.value;
		});
		$('#roscoDuration').on('focusout', function () {
			this.value = this.value.trim() == '' ? 240 : this.value;
		});
		$('#roscoTimeShowSolution').on('focusout', function () {
			this.value = this.value.trim() == '' ? 3 : this.value;
			this.value = this.value > 9 ? 9 : this.value;
			this.value = this.value < 1 ? 1 : this.value;
		});
		if (window.File && window.FileReader && window.FileList && window.Blob) {
			$('#eXeGameExportImport').show();
			$('#eXeGameImportGame').on('change', function (e) {
				var file = e.target.files[0];
				if (!file) {
					return;
				}
				var reader = new FileReader();
				reader.onload = function (e) {
					$exeDevice.importGame(e.target.result);
				};
				reader.readAsText(file);
			});
			$('#eXeGameExportGame').on('click', function () {
				$exeDevice.exportGame();
			})
		} else {
			$('#eXeGameExportImport').hide();
		}
		$exeAuthoring.iDevice.gamification.itinerary.addEvents();
	},
	playSound: function (selectedFile) {
		$exeDevice.stopSound();
		var selectFile = $exeDevice.extractURLGD(selectedFile);
		$exeDevice.playerAudio = new Audio(selectFile);
		$exeDevice.playerAudio.addEventListener("canplaythrough", function (event) {
			$exeDevice.playerAudio.play();
		});
	},
	stopSound: function() {
		if ($exeDevice.playerAudio && typeof $exeDevice.playerAudio.pause == "function") {
			$exeDevice.playerAudio.pause();
		}
	},
	exportGame: function () {
		var dataGame = this.validateData();
		if (!dataGame) {
			return false;
		}
		var blob = JSON.stringify(dataGame),
			newBlob = new Blob([blob], {
				type: "text/plain"
			});
		if (window.navigator && window.navigator.msSaveOrOpenBlob) {
			window.navigator.msSaveOrOpenBlob(newBlob);
			return;
		}
		const data = window.URL.createObjectURL(newBlob);
		var link = document.createElement('a');
		link.href = data;
		link.download = $exeDevice.msgs.msgGame + "Rosco.json";
		document.getElementById('roscoIdeviceForm').appendChild(link);
		link.click();
		setTimeout(function () {
			document.getElementById('roscoIdeviceForm').removeChild(link);
			window.URL.revokeObjectURL(data);
		}, 100);
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
        } else if (typeof urlmedia != "undefined" && urlmedia.length > 10 && $exeDevice.getURLAudioMediaTeca(urlmedia)) {
            sUrl = $exeDevice.getURLAudioMediaTeca(urlmedia);
        }
        return sUrl;
    }
}