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
	iDevicePath: "/scripts/idevices/rosco-activity/edition/",
	msgs: {},

	ci18n: {
		"msgReady": _("Ready?"),
		"msgStartGame": _("Click here to start"),
		"msgHappen": _("Move on"),
		"msgReply": _("Reply"),
		"msgSubmit": _("Submit"),
		"msgEnterCode": _("Enter the access code"),
		"msgErrorCode": _("The access code is not correct"),
		"msgGameOver": _("The game is over!"),
		"msgNewWord": _("New word"),
		"msgStartWith": _("Start with %1"),
		"msgContaint": _("Contain letter %1"),
		"msgPass": _("You move on to next word"),
		"msgIndicateWord": _("Provide a word"),
		"msgClue": _("Cool! The clue is:"),
		"msgNewGame": _("Click here for a new game"),
		"msgYouHas": ("You have got %1 correct and %2 uncorrect"),
		"msgCodeAccess": _("Access code"),
		"msgPlayAgain": _("Play Again"),
		"msgRequiredAccessKey": _("Access code required"),
		"msgInformationLooking": _("The information you were looking for"),
		"msgPlayStart": _("Click here to play"),
		"msgErrors": _("Errors"),
		"msgMinimize": _("Minimize"),
		"msgMaximize": _("Maximize"),
		"msgHits": _("Hits"),
		"msgTime": _("Time"),
		"msgOneRound": _("One round"),
		"msgTowRounds": _("Two rounds"),
		"msgImage": _("Image"),
		"msgNoImage": _("No image"),
		"msgWrote": _("Write the correct word and click on reply. If you doubt, click on move on"),
		"msgNotNetwork": _("You can only play this game with internet connection. Check out your conecctivity"),
		"msgSuccesses": _("Right! | Excellent! | Great! | Very good! | Perfect!"),
		"msgFailures": _("It was not that! | Not well! | Not correct! | Sorry! | Error!")

	},
	colors: {
		black: "#1c1b1b",
		blue: '#0099cc',
		verde: '#009245',
		red: '#ff0000',
		white: '#ffffff',
		yellow: '#f3d55a'
	},
	letters: "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ",
	init: function () {
		this.setMessagesInfo();
		this.createForm();
		this.addEvents();
	},
	setMessagesInfo() {
		var msgs = this.msgs;
		msgs.msgNotStart = _("%1 does not start with the letter %2");
		msgs.msgNotContain = _("%1 does not contain the letter %2");
		msgs.msgWriteClue = _("You must write a clue");
		msgs.msgProvideDefinition = _("You must provide the definition of the word or the valid URL of an image");
		msgs.msgProvideCode = _("You must provide the code to play this game");
		msgs.msgProvideGetCode = _("You must provide how to obtain the code to play this game");
		msgs.msgGame = _("Game");
		msgs.msgSelectFile = _("The selected file does not contain a Rosco game");
		msgs.msgURLValid = _("You must indicate the valid URL of an image");
		msgs.msgOneWord = _("You must provide at least one word");
		msgs.msgProvideTimeSolution = _("You must provide the time to view the solution");

	},
	createForm: function () {
        var path = $exeDevice.iDevicePath;
        var wordInstructions = _('Provide a word and its definition. May toggle between: "Word starts" or "Word contains", by clicking on %s');
            wordInstructions = wordInstructions.replace("%s",'<img src="' + path + "roscoIcoStart.png" + '" alt="' + _("Start/Contain")+ '" title="' + _("Start/Contain")+ '" />')
		var html = '\
			<div id="roscoIdeviceForm">\
				<div class="exe-form-tab" title="' + _('General settings') + '">\
					<fieldset class="exe-fieldset exe-fieldset-closed">\
						<legend><a href="#">' + _("Instructions")+ '</a></legend>\
						<div>\
							<p>\
								<label for="roscoInstructions" class="sr-av">' +  _("Instructions")+ ': </label>\
								<textarea id="roscoInstructions" class="exe-html-editor"\>' + _("Observe the letters, identify and fill in the missing the words.")+ ' </textarea>\
							</p>\
						</div>\
					</fieldset>\
					<fieldset class="exe-fieldset">\
						<legend><a href="#">' + _("Options") + '</a></legend>\
						<div>\
							<p>\
								<label for="roscoShowMinimize"><input type="checkbox" id="roscoShowMinimize"> ' +  _("Show minimized.")+ ' </label>\
							</p>\
							<p>\
								<label for="roscoDuration">' + _("Game time(seconds)") + ': </label>\
								<input type="number" name="roscoDuration" id="roscoDuration" value="240" min="5" max="9999" step="10" required /> \
							</p>\
							<p>\
								<label for="roscoNumberTurns">' + _("No. Rounds")+ ': </label>\
								<input type="number" value="1" min="1" max="2" id="roscoNumberTurns" required />\
							</p>\
							<p>\
								<label for="roscoShowSolution"><input type="checkbox" checked id="roscoShowSolution"> ' + _("Show solutions")+ '. </label> \
								<label for="roscoTimeShowSolution">' + _("Show solution time")+ ': \
									<input type="number" name="roscoTimeShowSolution" id="roscoTimeShowSolution" value="3" min="1" max="9" /> \
								' + _("seconds") + '</label>\
							</p>\
						</div>\
					</fieldset>\
					<fieldset class="exe-fieldset">\
						<legend><a href="#">' + _("Words")+ '</a></legend>\
						<div id="roscoDataWord"><p class="exe-block-info exe-block-dismissible">'+wordInstructions+' <a href="#" class="exe-block-close" title="'+_("Hide")+'"><span class="sr-av">'+_("Hide")+' </span>×</a></p>'
						+ this.getWords().join('') + '</div>\
					</fieldset>\
					' + $exeAuthoring.iDevice.itinerary.getFieldset() + '\
					' + this.getExportImportGame() + '\
				</div>\
				<div class="exe-form-tab" title="' + _('Language settings') + '">\
				<p>' + _("Custom texts (or use the default ones):") + '</p>\
				' + this.getLanguageFields() + '\
				</div>\
			</div>\
			';
		var field = $("textarea.jsContentEditor").eq(0);
		field.before(html);
		this.enableTabs("roscoIdeviceForm");
		this.loadPreviousValues(field);

	},
	getLanguageFields: function () {
		var html = "";
		var fields = this.ci18n;
		for (var i in fields) {
			html += '<p class="ci18n"><label for="ci18n_' + i + '">' + fields[i] + '</label> <input type="text" name="ci18n_' + i + '" id="ci18n_' + i + '" value="' + fields[i] + '" /></p>'
		}
		return html;
	},
	// To review (this should be common)
	enableTabs: function (id) {
		var tabs = $("#" + id + " .exe-form-tab");
		var list = '';
		var tabId;
		var e;
		var txt;
		tabs.each(function (i) {
			var klass = "exe-form-active-tab";
			tabId = id + "Tab" + i;
			e = $(this);
			e.attr("id", tabId);
			txt = e.attr("title");
			if (txt == '') txt = (i + 1);
			if (i > 0) {
				e.hide();
				klass = "";
			}
			list += '<li><a href="#' + tabId + '" class="' + klass + '">' + txt + '</a></li>';
		});
		if (list != "") {
			list = '<ul id="' + id + 'Tabs" class="exe-form-tabs exe-advanced">' + list + '</ul>';
			tabs.eq(0).before(list);
			var as = $("#" + id + "Tabs a");
			as.click(function () {
				as.attr("class", "");
				$(this).addClass("exe-form-active-tab");
				tabs.hide();
				$($(this).attr("href")).show();
				return false;
			});
		}

	},

	getExportImportGame: function () {
        var msg = _("You can export this game to a JSON file so you can later use it in an iDevice of the same type. You can also use it in %s and you can import games from %s and use then here.");
            msg = msg.replace(/%s/g,'<a href="https://quext.educarex.es/" target="_blank" rel="noopener noreferrer">QuExt</a>');
		var html = '\
			<fieldset class="exe-fieldset exe-fieldset-closed exe-advanced">\
				<legend><a href="#">'+_("Advanced")+'</a></legend>\
				<div>\
					<p class="exe-block-info exe-block-dismissible">'+msg+' <a href="#" class="exe-block-close" title="'+_("Hide")+'"><span class="sr-av">'+_("Hide")+'</span>×</a></p>\
					<div id="roscoExportImport">\
                        <p>\
                            <label for="roscoImportGame">' + _("Load game")+ ': </label>\
                            <input type="file" name="roscoImportGame" id="roscoImportGame" />\
                        </p>\
                        <p>\
                            <label for="roscoExportGame">' + _("Save game")+ ': </label>\
                            <input type="button" name="roscoExportGame" id="roscoExportGame" value="' + _("Save")+ '" />\
                        </p>\
                    </div>\
				</div>\
			</fieldset>';
		return html;
	},
	loadPreviousValues: function (field) {
		var originalHTML = field.val();
		if (originalHTML != '') {
			var wrapper = $("<div></div>");
			wrapper.html(originalHTML);
			var json = $('.rosco-DataGame', wrapper).text();
			var dataGame = $exeDevice.isJsonString(json);
			var $imagesLink = $('.rosco-LinkImages', wrapper);
			$imagesLink.each(function (index) {
				dataGame.wordsGame[index].url = $(this).attr('href');
			});
			$('#roscoDuration').val(dataGame.durationGame)
			$('#roscoNumberTurns').val(dataGame.numberTurns);
			$('#roscoShowSolution').prop("checked", dataGame.showSolution);
			$('#roscoShowMinimize').prop("checked", dataGame.showMinimize);
			$('#roscoShowClue').prop("checked", dataGame.showClue);
			$('#roscoTimeShowSolution').val(dataGame.timeShowSolution);
			$('#roscoShowCodeAccess').prop("checked", dataGame.showCodeAccess);
			$('#roscoClue').val(dataGame.clueGame)
			$('#roscoPercentajeClue').val(dataGame.percentageClue);
			$('#roscoCodeAccess').val(dataGame.codeAccess)
			$('#roscoMessageCodeAccess').val(dataGame.messageCodeAccess);
			$('.roscoWordEdition').each(function (index) {
				$(this).val(dataGame.wordsGame[index].word);
			});
			$('.roscoDefinitionEdition').each(function (index) {
				$(this).val(dataGame.wordsGame[index].definition);
			});
			$('.roscoAuthorEdition').each(function (index) {
				$(this).val(dataGame.wordsGame[index].author);
			});
			$('.roscoAlt').each(function (index) {
				$(this).val(dataGame.wordsGame[index].alt);
			});
			$('.roscoURLImageEdition').each(function (index) {
				$(this).val(dataGame.wordsGame[index].url);
			});
			$('.roscoXImageEdition').each(function (index) {
				$(this).val(dataGame.wordsGame[index].x);
			});
			$('.roscoYImageEdition').each(function (index) {
				$(this).val(dataGame.wordsGame[index].y);
			});
			$('.roscoStartEdition').each(function (index) {
				var imageStart = (dataGame.wordsGame[index].type == 1) ? "roscoContains.png" : "roscoStart.png";
				$(this).attr('src', $exeDevice.iDevicePath + imageStart);
			});
			$('.roscoSelectImageEdition').each(function (index) {
				var imageSelect = $.trim(dataGame.wordsGame[index].url).length > 0 ? "roscoSelectImage.png" : "roscoSelectImageInactive.png";
				$(this).attr('src', $exeDevice.iDevicePath + imageSelect);
			});
			var imagesLink = $('.rosco-LinkImages', wrapper);
			$('.imagesLink').each(function (index) {
				var imageSelect = $.trim(dataGame.wordsGame[index].url).length > 0 ? "roscoSelectImage.png" : "roscoSelectImageInactive.png";
				$(this).attr('src', $exeDevice.iDevicePath + imageSelect);
			});

			$('div.roscoLetterEdition').each(function (index) {
				var longitud = (dataGame.wordsGame[index].word).length;
				var color = longitud > 0 ? $exeDevice.colors.blue : $exeDevice.colors.black;
				$(this).css('background-color', color);
			});
			$('#roscoClue').prop('disabled', !dataGame.showClue);
			$('#roscoPercentajeClue').prop('disabled', !dataGame.showClue);
			$('#roscoCodeAccess').prop('disabled', !dataGame.showCodeAccess);
			$('#roscoMessageCodeAccess').prop('disabled', !dataGame.showCodeAccess);
			$('#roscoTimeShowSolution').prop('disabled', !dataGame.showSolution);
			var instructions = $(".rosco-instructions", wrapper);
			if (instructions.length == 1) $("#roscoInstructions").val(instructions.html());
		}
	},

	clickImage: function (img, epx, epy) {
		var $cursor = $(img).siblings('.roscoCursorEdition')
		$x = $(img).parent().siblings('.roscoBarEdition').find('.roscoXImageEdition'),
			$y = $(img).parent().siblings('.roscoBarEdition').find('.roscoYImageEdition'),
			posX = epx - $(img).offset().left,
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
		var $cursor = image.siblings('.roscoCursorEdition');
		var $noImage = image.siblings('.roscoNoImageEdition');
		var $iconSelection = image.parents('.roscoWordMutimediaEdition').find('.roscoSelectImageEdition');
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

	save: function () {
		var dataGame = this.validateData();
		if (!dataGame) {
			return false;
		}
		var fields = this.ci18n;
		var i18n = fields;
		for (var i in fields) {
			var fVal = $("#ci18n_" + i).val();
			if (fVal != "") i18n[i] = fVal;
		}
		dataGame.msgs = i18n;
		var json = JSON.stringify(dataGame),
			divContent = "";
		if (dataGame.instructions != "") divContent = '<div class="rosco-instructions">' + dataGame.instructions + '</div>';
		var linksImages = $exeDevice.createlinksImage(dataGame.wordsGame);
		var html = '<div class="rosco-IDevice">';
		html += divContent;
		html += '<div class="rosco-DataGame">' + json + '</div>';
		html += linksImages;
		html += '</div>';
		return html;
	},

	createlinksImage: function (wordsGame) {
		var html = '';
		for (var i = 0; i < wordsGame.length; i++) {
			var linkImage = '<a href="' + wordsGame[i].url + '" class="js-hidden rosco-LinkImages">' + i + '</a>';
			html += linkImage;
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
			mWord = $.trim(word.toUpperCase());
		mWord = (type == 0) ? mWord.slice(0, 1) : mWord.substr(1);
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
			start = mWord.indexOf(letter) != -1;
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
		var path = $exeDevice.iDevicePath,
			fileWord = '\
				<div class="roscoWordMutimediaEdition">\
					<div class="roscoFileWordEdition">\
						<h3 class="roscoLetterEdition">' + letter + '</h3>\
						<a href="#" class="roscoLinkStart" title="'+_("Start/Contain letter")+'"><img src="' + path + "roscoStart.png" + '" alt="' + _("The word starts with...")+ '" class="roscoStartEdition"/></a>\
						<label for="" class="sr-av">' + _("Word") + ': </label><input type="text" class="roscoWordEdition" placeholder="' + _("Word") + '">\
						<label for="" class="sr-av">' + _("Definition") + ': </label><input type="text" class="roscoDefinitionEdition" placeholder="' + _("Definition") + '">\
						<a href="#" class="roscoLinkSelectImage" title="'+_("Show/Hide image")+'"><img src="' + path + "roscoSelectImageInactive.png" + '" alt="' + _("Select Image") + '" class="roscoSelectImageEdition"/></a>\
					</div>\
					<div class="roscoImageBarEdition">\
						<div class="roscoImageEdition">\
							<div class="roscoCursorEdition"></div>\
							<img src="' + path + "roscoCursor.gif" + '" class="roscoCursorEdition" alt="Cursor" /> \
							<img src="" class="roscoHomeImageEdition" alt="' + _("No image")+ '" /> \
							<img src="' + path + "roscoHomeImage.png" + '" class="roscoNoImageEdition" alt="' + _("No image") + '" /> \
						</div>\
						<div class="roscoBarEdition">\
							<label>' + _("Image") + ': </label><input type="text" class="exe-file-picker roscoURLImageEdition" id="roscoURLImage-' + letter + '" placeholder="'+_("Indicate a valid URL of an image or select one from your device")+'"/>\
							<input type="text" class="roscoXImageEdition" value="0" readonly />\
							<input type="text" class="roscoYImageEdition" value="0" readonly />\
						</div>\
						<div class="roscoMetaData">\
							<label for="roscoAlt'+letter+'">Alt: </label><input type="text" id="roscoAlt'+letter+'" class="roscoAlt" />\
                            <label for="roscoAuthorEdition'+letter+'">' + _("Authorship") + ': </label><input type="text" id="roscoAuthorEdition'+letter+'" class="roscoAuthorEdition" />\
							<a href="#" class="roscoLinkClose" title="'+_("Hide image")+'"><img src="' + path + "roscoClose.png" + '" alt="' + _("Minimize")+ '" class="roscoCloseImage"/></a>\
						</div>\
						<hr class="roscoSeparacion"/>\
					</div>\
				</div>'

		return fileWord;
	},

	getWords: function () {
		var rows = [];
		for (var i = 0; i < this.letters.length; i++) {
			letter = this.letters.charAt(i);
			var wordData = this.getDataWord(letter);
			rows.push(wordData);

		}
		return rows;
	},

	validateData: function () {
		var clear = $exeDevice.removeTags,
			msgs = $exeDevice.msgs,
			instructions = tinymce.editors[0].getContent(),
			showMinimize = $('#roscoShowMinimize').is(':checked'),
			showSolution = $('#roscoShowSolution').is(':checked'),
			showClue = $('#roscoShowClue').is(':checked'),
			clueGame = clear($.trim($('#roscoClue').val())),
			percentageClue = parseInt($('#roscoPercentajeClue').children("option:selected").val()),
			showCodeAccess = $('#roscoShowCodeAccess').is(':checked'),
			codeAccess = clear($.trim($('#roscoCodeAccess').val())),
			messageCodeAccess = clear($.trim($('#roscoMessageCodeAccess').val())),
			timeShowSolution = parseInt(clear($.trim($('#roscoTimeShowSolution').val()))),
			durationGame = parseInt(clear($('#roscoDuration').val())),
			numberTurns = parseInt(clear($('#roscoNumberTurns').val()));
		if (showClue && clueGame.length == 0) {
			eXe.app.alert(msgs.msgWriteClue);
			return false;
		}
		if (showCodeAccess && codeAccess.length == 0) {
			eXe.app.alert(msgs.msgProvideCode);
			return false;
		}
		if (showCodeAccess && messageCodeAccess.length == 0) {
			eXe.app.alert(msgs.msgProvideGetCode);
			return false;
		}
		if (showSolution && timeShowSolution.length == 0) {
			eXe.app.alert(msgs.msgProvideGetCode.msgEProvideTimeSolution);
			return false;
		}

		var words = [];
		var zr = true;
		$('.roscoWordEdition').each(function () {
			var word = clear($(this).val().toUpperCase().trim());
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
			var t = $(this).attr('src');
			var type = t.indexOf('roscoContains') != -1 ? 1 : 0;
			types.push(type);
		});
		for (var i = 0; i < this.letters.length; i++) {
			var letter = this.letters.charAt(i);
			var word = $.trim(words[i]).toUpperCase();
			var definition = $.trim(definitions[i]);
			var url = $.trim(urls[i]);
			var mType = types[i];
			if (word.length > 0) {
				if (mType == 0 && !(this.startContainsAll(letter, word, mType))) {
					var message =  _("%1 does not start with the letter %2").replace('%1', word);
					message = message.replace('%2', letter);
					eXe.app.alert(message);
					return false;
				} else if (mType == 1 && !(this.startContainsAll(letter, word, mType))) {
					var message = $exeDevice.msgs.msgNotContain.replace('%1', word);
					message = message.replace('%2', letter);
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
			p.word = $.trim(words[i]).toUpperCase();
			p.definition = definitions[i];
			p.type = types[i];
			p.alt = alts[i];
			p.author = authors[i];
			p.url = urls[i];
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
		var data = {
			'typeGame': 'Rosco',
			'instructions': instructions,
			'timeShowSolution': timeShowSolution,
			'durationGame': durationGame,
			'numberTurns': numberTurns,
			'instructions': instructions,
			'showSolution': showSolution,
			'showMinimize': showMinimize,
			'showClue': showClue,
			'clueGame': clueGame,
			'percentageClue': percentageClue,
			'showCodeAccess': showCodeAccess,
			'codeAccess': codeAccess,
			'messageCodeAccess': messageCodeAccess,
			'wordsGame': wordsGame
		}
		return data;
	},

	importGame: function (content) {
		var game = $exeDevice.isJsonString(content);
		if (!game || !game.typeGame || game.typeGame != 'Rosco') {
			eXe.app.alert($exeDevice.msgs.msgSelectFile);
			return;
		}
		$exeDevice.loadDateFile(game)

	},

	getSelectClue: function () {
		var html = '<label for="roscoPercentajeClue" id="labelPercentajeClue">' + _("% correct answers"); + ': </label>\
		<select id="roscoPercentajeClue" disabled>\
			<option value="10">10%</option>\
			<option value="20">20%</option>\
			<option value="30">30%</option>\
			<option value="40" selected>40%</option>\
			<option value="50">50%</option>\
			<option value="60">60%</option>\
			<option value="70">70%</option>\
			<option value="80">80%</option>\
			<option value="90">90%</option>\
			<option value="100">100%</option>\
		  </select>';
		return html;
	},

	addEvents: function () {
		var msgs = $exeDevice.msgs;
		$('#roscoDataWord a.roscoLinkStart').on('click', function (e) {
			e.preventDefault();
			var imageStart = $(this).find('.roscoStartEdition').attr('src').indexOf('roscoContains.png') != -1 ? "roscoStart.png" : "roscoContains.png";
            // Add an alternative text to the icon
            var alt = _("The word starts with...");
            if (imageStart=="roscoContains.png") alt = _("The word contains...");
			$(this).find('.roscoStartEdition').attr('src', $exeDevice.iDevicePath + imageStart).attr("alt",alt);
		});

		$('#roscoDataWord input.roscoURLImageEdition').on('change', function () {
			var validExt = ['jpg', 'png', 'gif', 'jpeg', 'svg'];
			var selectedFile = $(this).val();
			var ext = selectedFile.split('.').pop().toLowerCase();
			if ((selectedFile.indexOf('resources') == 0 || selectedFile.indexOf('/previews/') == 0) && validExt.indexOf(ext) == -1) {
				eXe.app.alert(_("Supported formats") + ": jpg, jpeg, gif, png, svg");
				return false;
			}
			var img = $(this).parent().siblings('.roscoImageEdition').find('.roscoHomeImageEdition');
			var url = selectedFile;
			var alt = $(this).parent().siblings(".roscoMetaData").find('.roscoAlt').val();
			var x = parseFloat($(this).siblings('.roscoXImageEdition').val());
			var y = parseFloat($(this).siblings('.roscoYImageEdition').val());
			x = x ? x : 0;
			y = y ? y : 0;
			$exeDevice.showImage(img, url, x, y, alt, 1);
		});

		$('#roscoDataWord a.roscoLinkSelectImage').on('click', function (e) {
			e.preventDefault();
			console.log($(this).parents('.roscoFileWordEdition'));
			$(this).parent().siblings('.roscoImageBarEdition').slideToggle();
			var $pater = $(this).parents('.roscoFileWordEdition').find('.roscoImageBarEdition');
			var img = $pater.find('.roscoHomeImageEdition');
			var url = $pater.find('.roscoURLImageEdition').val();
			var alt = $pater.find('.roscoAlt').val();
			var x = parseFloat($pater.find('.roscoXImageEdition').val());
			x = x ? x : 0;
			var y = parseFloat($pater.find('.roscoYImageEdition').val());
			y = y ? y : 0;
			$exeDevice.showImage(img, url, x, y, alt, 0);
		});

		$('#roscoDataWord a.roscoLinkClose').on('click', function (e) {
			e.preventDefault();
			$(this).parents('.roscoImageBarEdition').slideUp();
		});

		$('#roscoDataWord .roscoWordEdition').on('focusout', function () {
			var word = $(this).val().trim().toUpperCase();
			var letter = $(this).siblings().filter(".roscoLetterEdition").text();
			var color = $(this).val().trim() == "" ? $exeDevice.colors.black : $exeDevice.colors.blue;
			$(this).siblings().filter('.roscoLetterEdition').css("background-color", color);
			if (word.length > 0) {
				var mType = $(this).parent().find('.roscoStartEdition').attr('src').indexOf("roscoContains.png") != -1 ? 1 : 0;
				if (mType == 0 && !($exeDevice.startContainsAll(letter, word, mType))) {
					var message = msgs.msgNotStart.replace('%1', word);
					message = message.replace('%2', letter);
					eXe.app.alert(message);
				} else if (mType == 1 && !($exeDevice.startContainsAll(letter, word, mType))) {
					var message = msgs.msgNotContain.replace('%1', word);
					message = message.replace('%2', letter);
					eXe.app.alert(message);
				}
			}
		});

		$('#roscoShowClue').on('change', function () {
			var mark = $(this).is(':checked');
			$('#roscoClue').prop('disabled', !mark);
			$('#roscoPercentajeClue').prop('disabled', !mark);
		});

		$('#roscoShowCodeAccess').on('change', function () {
			var mark = $(this).is(':checked');
			$('#roscoCodeAccess').prop('disabled', !mark);
			$('#roscoMessageCodeAccess').prop('disabled', !mark);
		});

		$('#roscoShowSolution').on('change', function () {
			var mark = $(this).is(':checked');
			$('#roscoTimeShowSolution').prop('disabled', !mark);
		});

		$('.roscoHomeImageEdition').on('click', function (e) {
			$exeDevice.clickImage(this, e.pageX, e.pageY);
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
			$('#roscoExportImport').show();
			$('#roscoImportGame').on('change', function (e) {
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
			$('#roscoExportGame').on('click', function () {
				$exeDevice.exportGame();
			})
		} else {
			$('#roscoExportImport').hide();
		}
	},
	loadDateFile: function (game) {
		$('#roscoShowMinimize').prop('checked', game.showMinimize);
		$('#roscoShowClue').prop('checked', game.showClue);
		$('#roscoClue').val(game.clueGame)
		$('#roscoPercentajeClue').val(game.percentageClue);
		$('#roscoShowCodeAccess').prop('checked', game.showCodeAccess);
		$('#roscoCodeAccess').val(game.codeAccess)
		$('#roscoMessageCodeAccess').val(game.messageCodeAccess);
		$('#roscoDuration').val(game.durationGame)
		$('#roscoNumberTurns').val(game.numberTurns);
		$('#roscoShowSolution').prop('checked', game.showSolution);
		$('#roscoTimeShowSolution').val(game.timeShowSolution);
		var wordsGame = game.wordsGame;
		$('.roscoWordEdition').each(function (index) {
			$(this).val(wordsGame[index].word);
		});
		$('.roscoDefinitionEdition').each(function (index) {
			$(this).val(wordsGame[index].definition);
		});
		$('.roscoAuthorEdition').each(function (index) {
			$(this).val(wordsGame[index].author);
		});
		$('.roscoURLImageEdition').each(function (index) {
			$(this).val(wordsGame[index].url);
		});
		$('.roscoXImageEdition').each(function (index) {
			$(this).val(wordsGame[index].x);
		});
		$('.roscoYImageEdition').each(function (index) {
			$(this).val(wordsGame[index].y);
		});
		$('.roscoStartEdition').each(function (index) {
			var imageStart = wordsGame[index].type == 1 ? "roscoContains.png" : "roscoStart.png";
			$(this).attr('src', $exeDevice.iDevicePath + imageStart);
		});
		$('.roscoSelectImageEdition').each(function (index) {
			var imageSelect = $.trim(wordsGame[index].url).length > 0 ? "roscoSelectImage.png" : "roscoSelectImageInactive.png";
			$(this).attr('src', $exeDevice.iDevicePath + imageSelect);
		});
		$('div.roscoLetterEdition').each(function (index) {
			var longitud = (wordsGame[index].word).length;
			var color = longitud > 0 ? $exeDevice.colors.blue : $exeDevice.colors.black;
			$(this).css('background-color', color);

		});
		$('#roscoClue').prop('disabled', !game.showClue);
		$('#roscoPercentajeClue').prop('disabled', !game.showClue);
		$('#roscoCodeAccess').prop('disabled', !game.showCodeAccess);
		$('#roscoMessageCodeAccess').prop('disabled', !game.showCodeAccess);
		$('#roscoTimeShowSolution').prop('disabled', !game.showSolution);
		tinymce.editors[0].setContent(game.instructions);
	},

	exportGame: function () {
		var dataGame = this.validateData();
		if (!dataGame) {
			return false;
		}
		var blob = JSON.stringify(dataGame);
		var newBlob = new Blob([blob], {
			type: "text/plain"
		})
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
	}

}