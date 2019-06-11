/**
 * Rosco Activity iDevice (edition code)
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Manuel Narvaez Martinez
 * Author: Ricardo Malaga Floriano
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $exeDevice = {
	iDevicePath: "/scripts/idevices/rosco-activity/edition/",
	msgs: {},
	i18n: {
		name: _('Rosco Activity'),
		es: {
			"Intructions": "Instrucciones",
			"Game options": "Opciones juego",
			"Game time(seconds)": "Tiempo de juego(segundos)",
			"No. Laps/Rounds": "Número de vueltas",
			"% correct answers": "% Aciertos",
			"Show solutions.": "Mostrar soluciones.",
			"Show clue.": "Mostrar pista.",
			"Show access code.": "Mostrar clave.",
			"Type/Word/Definition": "Tipo/Palabra/Definición",
			"%1 does not start with the letter %2": "%1 no comienza con la letra %2",
			"%1 does not contain the letter %2": "%1 no contiene la letra %2",
			"You must write a clue": "Debes escribir una pista",
			"You must provide the definition of the word or the valid URL of an image": "Debes indicar la definición de la palabra o una URL válida de una imagen",
			"You must provide the code to play this game": "Debes indicar la clave",
			"You must provide how to obtain the code to play this game": "Debes indicar como obtener la clave para jugar a este juego",
			"Write the correct word and click on reply. If you doubt, click on move on": "Escribe la palabra correcta. Si tienes dudas, pulsa pasar",
			"Ready?": "¿Preparado?",
			"Click here to start": "Haz clic aquí para jugar",
			"Move on": "Pasar",
			"Reply": "Responder",
			"Submit": "Enviar",
			"Enter the access code": "Introduce la clave de acceso",
			"The access code is not correct": "La clave no es correcta",
			"Click here for a new game": "Pulsa aquí para nueva partida",
			"The game is over!": "¡El juego ha finalizado!",
			"New word": "Nueva palabra",
			"Start with %1": "Comienza con %1",
			"Contain letter %1": "Contiene la %1",
			"You move on to next word": "Pasas palabra",
			"Provide a word": "Indica una palabra",
			"Cool! The clue is:": "¡Genial! La pista es: ",
			"Right!|Excellent!|Great!|Very good!|Perfect!": "¡Correcto!|¡Estupendo!|¡Genial!|¡Muy bien!|¡Perfecto!",
			"It was not that!|Not well!|Not correct!|Sorry!|Error!": "¡No era esa!|¡Has fallado!|¡Incorrecto!|¡Lo siento!|¡Error!",
			"You have got %1 correct and %2 uncorrect": "Has tenido %1 aciertos y %2 errores",
			"Provide how to get the access code": "Indica cómo obtener la clave acceso",
			"Message": "Mensaje",
			"You must indicate the valid URL of an image": "Debes escribir la URL válida de una imagen",
			"Author": "Autor",
			"Help: Tutorial video": "Ayuda: Vídeo tutorial",
			"Show solution time": "Ver la solución durante",
			"seconds": "segundos",
			"Clue": "Pista",
			"You must provide the time to view the solution": "Debes indicar el tiempo de visionado de la solución",
			"Provide the access code": "Indica una clave de acceso",
			"Provide a clue": "Indica una pista",
			"Access code": "Clave acceso",
			"Observe the letters, identify and fill in the missing the words.": "Observa las  letras, identifica y completa las palabras.",
			"You can only play this game with internet connection. Check out your conecctivity.": "Sólo puedes jugar a este juego conectado a internet. Comprueba tu conexión",
			"Click here to play": "Haz clic aquí para comenzar",
			"Show minimize.": "Mostrar minimizado.",
			"Load game": "Cargar juego",
			"Save game": "Guardar juego",
			"Save": "Guardar",
			"Game": "Juego",
			"Show Image": "Mostrar imagen",
			"Select Image": "Seleccionar imagen",
			"Start/Contain": "Comienza/Contiene",
			"Hits": "Aciertos",
			"Errors": "Errores",
			"Minimize": "Minimizar",
			"Maximize": "Maximizar",
			"Time": "Tiempo",
			"One round": "Una vuelta",
			"Two rounds": "Dos vuestas",
			"The selected file does not contain a Rosco game": "El archivo seleccionado no contiene un juego del tipo Rosco",
			"Image": "Imagen",
			"No image": "Sin imagen",
			"Access code required": "Necesaria clave de acceso",
			"Play Again": "Volver a jugar",
			"Alt": "Alt",
			"Load image": "Cargar imagen",
			"You must provide at least one word": "Debes completar al menos una palabra del juego",
			"Indicate a valid URL of an image or select one from your device": "Indica la URL de una imagen o selecciona una imagen de de equipo"

		}
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
		this.updateMessages();
		this.createForm();
		this.addEvents();
	},
	updateMessages() {
		var msgs = this.msgs;
		msgs.msgEIntrutions = _("Intructions");
		msgs.msgEGameOption = _("Options");
		msgs.msgEGameTime = _("Game time(seconds)");
		msgs.msgEnumLaps = _("No. Laps/Rounds");
		msgs.msgEPercentageCorrect = _("% correct answers");
		msgs.msgEShowSolution = _("Show solutions.");
		msgs.msgEShowSolutionTime = _("Show solution time");
		msgs.msgEShowClue = _("Show clue.");
		msgs.msgEShowCode = _("Show access code.");
		msgs.msgETypeWord = _("Questions");
		msgs.msgENotStart = _("%1 does not start with the letter %2");
		msgs.msgENotContaint = _("%1 does not contain the letter %2");
		msgs.msgEWriteClue = _("You must write a clue");
		msgs.msgEProvideDefinition = _("You must provide the definition of the word or the valid URL of an image");
		msgs.msgEProvideCode = _("You must provide the code to play this game");
		msgs.msgEProvideGetCode = _("You must provide how to obtain the code to play this game");
		msgs.msgEObserveLetter = _("Observe the letters, identify and fill in the missing the words.");
		msgs.msgEShowMInimize = _("Show minimize.");
		msgs.msgELoadGame = _("Load game");
		msgs.msgESaveGame = _("Save game");
		msgs.msgESave = _("Save");
		msgs.msgEGame = _("Game");
		msgs.msgEShowImage = _("Show Image");
		msgs.msgESelectImage = _("Select Image");
		msgs.msgEStartContain = _("Start/Contain");
		msgs.msgEHits = _("Hits");
		msgs.msgEErrors = _("Errors");
		msgs.msgEMinimize = _("Minimize");
		msgs.msgEMaximize = _("Maximize");
		msgs.msgETime = _("Time");
		msgs.msgESelectFile = _("The selected file does not contain a Rosco game");
		msgs.msgEImage = _("Image");
		msgs.msgENoImage = _("No image");
		msgs.msgEMessage = _("Message");
		msgs.msgEURLValid = _("You must indicate the valid URL of an image");
		msgs.msgEAuthor = _("Author");
		msgs.msgEHelp = _("Help: Tutorial video");
		msgs.msgEOneWord = _("You must provide at least one word");
		msgs.msgESeconds = _("seconds");
		msgs.msgEClue = _("Clue");
		msgs.msgEProvideTimeSolution = _("You must provide the time to view the solution");
		msgs.msgEAlt = _("Alt");
		msgs.msgELoadImage = _("Load image");
		msgs.msgWrote = _("Write the correct word and click on reply. If you doubt, click on move on");
		msgs.msgReady = _("Ready?");
		msgs.msgStartGame = _("Click here to start");
		msgs.msgHappen = _("Move on");
		msgs.msgReply = _("Reply");
		msgs.msgSubmit = _("Submit");
		msgs.msgEnterCode = _("Enter the access code");
		msgs.msgErrorCode = _("The access code is not correct");
		msgs.msgGameOver = _("The game is over!");
		msgs.msgNewWord = _("New word");
		msgs.msgStartWith = _("Start with %1");
		msgs.msgContaint = _("Contain letter %1");
		msgs.msgPass = _("You move on to next word");
		msgs.msgIndicateWord = _("Provide a word");
		msgs.msgClue = _("Cool! The clue is:");
		msgs.msgNewGame = _("Click here for a new game")
		msgs.msgSuccesses = _("Right!|Excellent!|Great!|Very good!|Perfect!");
		msgs.msgFailures = _("It was not that!|Not well!|Not correct!|Sorry!|Error!");
		msgs.msgYouHas = _("You have got %1 correct and %2 uncorrect");
		msgs.msgCodeAccess = _("Access code");
		msgs.msgPlayAgain = _("Play Again");
		msgs.msgRequiredAccessKey = _("Access code required");
		msgs.msgInformationLooking = _("The information you were looking for");
		msgs.msgPlayStart = _("Click here to play");
		msgs.msgNotNetwork = _("You can only play this game with internet connection. Check out your conecctivity");
		msgs.msgHits = _("Hits");
		msgs.msgErrors = _("Errors");
		msgs.msgMinimize = _("Minimize");
		msgs.msgMaximize = _("Maximize");
		msgs.msgTime = _("Time");
		msgs.msgOneRound = _("One round");
		msgs.msgTowRounds = _("Two rounds");

	},
	createForm: function () {
		var msgs = this.msgs,
			html = '\
			<div id="roscoIdeviceForm">\
				<div class="exe-form-tab" title="'+_('General settings')+'">\
					<fieldset class="exe-fieldset">\
						<legend><a href="#">' + msgs.msgEIntrutions + '</a></legend>\
						<div>\
							<p>\
								<label for="roscoInstructions" class="sr-av">' + msgs.msgEIntrutions + ': </label>\
								<textarea id="roscoInstructions" class="exe-html-editor"\>' + msgs.msgEObserveLetter + ' </textarea>\
							</p>\
						</div>\
					</fieldset>\
					<fieldset class="exe-fieldset exe-fieldset-closed">\
						<legend><a href="#">' + msgs.msgEGameOption + '</a></legend>\
						<div>\
							<p>\
								<label for="roscoShowMinimize"><input type="checkbox" id="roscoShowMinimize"> ' + msgs.msgEShowMInimize + ' </label>\
							</p>\
							<p>\
								<label for="roscoDuration">' + msgs.msgEGameTime + ': </label>\
								<input type="number" name="roscoDuration" id="roscoDuration" value="240" min="5" max="9999" step="10" required /> \
							</p>\
							<p>\
								<label for="roscoNumberTurns">' + msgs.msgEnumLaps + ': </label>\
								<input type="number" value="1" min="1" max="2" id="roscoNumberTurns" required />\
							</p>\
							<p>\
								<label for="roscoShowSolution"><input type="checkbox" checked id="roscoShowSolution"> ' + msgs.msgEShowSolution + ' </label> \
								<label for="roscoTimeShowSolution">' + msgs.msgEShowSolutionTime + ': \
									<input type="number" name="roscoTimeShowSolution" id="roscoTimeShowSolution" value="3" min="1" max="9" /> \
								' + msgs.msgESeconds + '</label>\
							</p>\
							<!-- To review :<p>\
								<label for="roscoShowClue"><input type="checkbox" id="roscoShowClue"> ' + msgs.msgEShowClue + '</label>\
								<label for="roscoClue"><span></span>' + msgs.msgEClue + ': </label>\
								<input type="text" name="roscoClue" id="roscoClue"  maxlength="50" disabled>' + this.getSelectClue() + '\
							</p>\
							<p>\
								<label for="roscoShowCodeAccess"><input type="checkbox" id="roscoShowCodeAccess"> ' + msgs.msgEShowCode + ' </label>\
								<label for="roscoCodeAccess" id="labelCodeAccess">' + msgs.msgCodeAccess + ': </label>\
								<input type="text" name="roscoCodeAccess" id="roscoCodeAccess"  maxlength="40" disabled />\
								<label for="roscoMessageCodeAccess" id="labelMessageAccess">' + msgs.msgEMessage + ': </label>\
								<input type="text" name="roscoMessageCodeAccess" id="roscoMessageCodeAccess" maxlength="200"/ disabled> \
							</p>-->\
							<!--<p id="roscoExportImport">\
								<label for="roscoImportGame">' + msgs.msgELoadGame + ': </label>\
								<input type="file" name="roscoImportGame" id="roscoImportGame" />\
								<label for="roscoExportGame">' + msgs.msgESaveGame + ': </label>\
								<input type="button" name="roscoExportGame" id="roscoExportGame" value="' + msgs.msgESave + '" />\
							</p>-->\
						</div>\
					</fieldset>\
					<fieldset class="exe-fieldset exe-fieldset-closed">\
						<legend><a href="#">' + msgs.msgETypeWord + '</a></legend>\
						<div id="roscoDataWord"><p>...</p>' + this.getWords().join('') + '</div>\
					</fieldset>\
					'+this.getItineraryOptions()+'\
				</div>\
				<div class="exe-form-tab" title="'+_('Language settings')+'">\
					<p>Language options.</p>\
				</div>\
			</div>\
			';
		var field = $("textarea.jsContentEditor").eq(0);
		field.before(html);
		this.enableTabs("roscoIdeviceForm");
		this.loadPreviousValues(field);

	},
	// To review (this should be common)
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
	// / To review
	getItineraryOptions: function(){
		var msgs = this.msgs;
		var html = '\
			<fieldset class="exe-fieldset exe-fieldset-closed">\
				<legend><a href="#">Itinerario</a></legend>\
				<div>\
					<p class="exe-block-info">Puedes hacer que haya que introducir una clave para acceder al juego. También puedes mostrar una clave al finalizarlo. Usa estas claves para crear un itinerario: no se podrá acceder a una actividad hasta haber obtenido la clave de otra, la solución a un problema... <a href="#"><span class="sr-av">Ocultar este mensaje </span>×</a></p>\
					<p>\
						<label for="roscoShowCodeAccess"><input type="checkbox" id="roscoShowCodeAccess"> Se accede con clave</label>\
					</p>\
					<p style="margin-left:1.4em;margin-bottom:1.5em">\
						<label for="roscoCodeAccess" id="labelCodeAccess"> Clave: </label>\
						<input type="text" name="roscoCodeAccess" id="roscoCodeAccess"  maxlength="40" disabled />\
						<label for="roscoMessageCodeAccess" id="labelMessageAccess">Pregunta: </label>\
						<input type="text" name="roscoMessageCodeAccess" id="roscoMessageCodeAccess" maxlength="200"/ disabled> \
					</p>\
					<p>\
						<label for="roscoShowClue"><input type="checkbox" id="roscoShowClue"> Se muestra un mensaje o clave al terminar</label>\
					</p>\
					<div style="margin-left:1.4em;margin-bottom:1.5em">\
						<p>\
							<label for="roscoClue">Mensaje: </label>\
							<input type="text" name="roscoClue" id="roscoClue"  maxlength="50" disabled>\
						</p>\
						<p>\
							<label for="roscoPercentajeClue" id="labelPercentajeClue">Porcentaje mínimo de aciertos para que se muestre el mensaje: </label>\
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
							</select>\
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
				eXe.app.alert($exeDevice.msgs.msgEURLValid);
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
						eXe.app.alert($exeDevice.msgs.msgEURLValid);
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
					eXe.app.alert($exeDevice.msgs.msgEURLValid);
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
		dataGame.msgs = $exeDevice.msgs;
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
			msgs = $exeDevice.msgs,
			fileWord = '\
			<div class="roscoWordMutimediaEdition">\
				<div class="roscoFileWordEdition">\
					<h3 class="roscoLetterEdition">' + letter + '</h3>\
					<img src="' + path + "roscoStart.png" + '" alt="' + msgs.msgEStartContain + '" class="roscoStartEdition"/>\
					<label for="" class="sr-av">'+_("Right answer")+': </label><input type="text" class="roscoWordEdition" placeholder="'+_("Right answer")+'">\
					<label for="" class="sr-av">'+_("Question")+': </label><input type="text" class="roscoDefinitionEdition" placeholder="'+_("Question")+'">\
					<img src="' + path + "roscoSelectImageInactive.png" + '" alt="' + msgs.msgESelectImage + '" class="roscoSelectImageEdition"/>\
					</div>\
					<div class="roscoImageBarEdition">\
					<div class="roscoImageEdition">\
					<div class="roscoCursorEdition"></div>\
					<img src="' + path + "roscoCursor.gif" + '" class="roscoCursorEdition" alt="Cursor" /> \
					<img src="" class="roscoHomeImageEdition" alt="' + msgs.msgENoImage + '" /> \
					<img src="' + path + "roscoHomeImage.png" + '" class="roscoNoImageEdition" alt="' + msgs.msgENoImage + '" /> \
					</div>\
					<div class="roscoBarEdition">\
					<label>' + msgs.msgEImage + ': </label><input type="text" class="exe-file-picker roscoURLImageEdition" id="roscoURLImage-' + letter + '"/>\
					<input type="text" class="roscoXImageEdition" value="0" readonly />\
					<input type="text" class="roscoYImageEdition" value="0" readonly />\
					<!-- To review :<img src="' + path + "roscoPlayImage.png" + '" alt="' + msgs.msgEShowImage + '" class="roscoPlayImageEdition"/>-->\
					</div>\
					<div class="roscoMetaData">\
					<label>' + msgs.msgEAuthor + ': </label><input type="text" class="roscoAuthorEdition" />\
					<label>' + msgs.msgEAlt + ': </label><input type="text" class="roscoAlt" />\
					<!-- To review :<img src="' + path + "roscoClose.png" + '" alt="' + msgs.msgEMinimize + '" class="roscoCloseImage"/>-->\
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
			eXe.app.alert(msgs.msgEWriteClue);
			return false;
		}
		if (showCodeAccess && codeAccess.length == 0) {
			eXe.app.alert(msgs.msgEProvideCode);
			return false;
		}
		if (showCodeAccess && messageCodeAccess.length == 0) {
			eXe.app.alert(msgs.msgEProvideGetCode);
			return false;
		}
		if (showSolution && timeShowSolution.length == 0) {
			eXe.app.alert(msgs.msgEProvideGetCode.msgEProvideTimeSolution);
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
			eXe.app.alert(msgs.msgEOneWord);
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
					var message = msgs.msgENotStart.replace('%1', word);
					message = message.replace('%2', letter);
					eXe.app.alert(message);
					return false;
				} else if (mType == 1 && !(this.startContainsAll(letter, word, mType))) {
					var message = $exeDevice.msgs.msgENotContaint.replace('%1', word);
					message = message.replace('%2', letter);
					eXe.app.alert(message);
					return false;
				} else if (($.trim(definition).length == 0) && (url.length < 10)) {
					eXe.app.alert($exeDevice.msgs.msgEProvideDefinition + ' ' + word);
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
			eXe.app.alert($exeDevice.msgs.msgESelectFile);
			return;
		}
		$exeDevice.loadDateFile(game)

	},

	getSelectClue: function () {
		var html = '<label for="roscoPercentajeClue" id="labelPercentajeClue">' + $exeDevice.msgs.msgEPercentageCorrect + ': </label>\
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
		$('#roscoDataWord img.roscoStartEdition').on('click', function () {
			var imageStart = $(this).attr('src').indexOf('roscoContains.png') != -1 ? "roscoStart.png" : "roscoContains.png";
			$(this).attr('src', $exeDevice.iDevicePath + imageStart);
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

		$('#roscoDataWord img.roscoSelectImageEdition').on('click', function () {
			$(this).parent().siblings('.roscoImageBarEdition').slideToggle();
			var $pater = $(this).parent().siblings('.roscoImageBarEdition');
			var img = $pater.find('.roscoHomeImageEdition');
			var url = $pater.find('.roscoURLImageEdition').val();
			var alt = $pater.find('.roscoAlt').val();
			var x = parseFloat($pater.find('.roscoXImageEdition').val());
			x = x ? x : 0;
			var y = parseFloat($pater.find('.roscoYImageEdition').val());
			y = y ? y : 0;
			$exeDevice.showImage(img, url, x, y, alt, 0);
		});

		$('#roscoDataWord img.roscoCloseImage').on('click', function () {
			$(this).parents('.roscoImageBarEdition').slideUp();
		});

		$('#roscoDataWord .roscoWordEdition').on('focusout', function () {
			var word = $(this).val().trim().toUpperCase();
			var letter = $(this).siblings().filter(".roscoLetterEdition").text();
			var color = $(this).val().trim() == "" ? $exeDevice.colors.black : $exeDevice.colors.blue;
			$(this).siblings().filter('.roscoLetterEdition').css("background-color", color);
			if (word.length > 0) {
				var mType = $(this).siblings().filter('.roscoStartEdition').attr('src').indexOf("roscoContains.png") != -1 ? 1 : 0;
				if (mType == 0 && !($exeDevice.startContainsAll(letter, word, mType))) {
					var message = msgs.msgENotStart.replace('%1', word);
					message = message.replace('%2', letter);
					eXe.app.alert(message);
				} else if (mType == 1 && !($exeDevice.startContainsAll(letter, word, mType))) {
					var message = msgs.msgENotContaint.replace('%1', word);
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

		$('.roscoPlayImageEdition').on('click', function (e) {
			var img = $(this).parent().siblings('.roscoImageEdition').find('.roscoHomeImageEdition');
			var url = $(this).siblings('.roscoURLImageEdition').val();
			var alt = $(this).parent().siblings(".roscoMetaData").find('.roscoAlt').val();
			var x = parseFloat($(this).siblings('.roscoXImageEdition').val());
			var y = parseFloat($(this).siblings('.roscoYImageEdition').val());
			x = x ? x : 0;
			y = y ? y : 0;
			$exeDevice.showImage(img, url, x, y, alt, 1);
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
		link.download = $exeDevice.msgs.msgEGame + "Rosco.json";
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