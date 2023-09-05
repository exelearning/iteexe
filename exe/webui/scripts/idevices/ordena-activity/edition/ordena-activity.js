/**
/**
 * Ordena Activity iDevice (edition code)
 * Version: 1.5
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Manuel Narvaez Martinez
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $exeDevice = {
    i18n: {
        category: _('Games'),
        name: _('Ordena')
    },
    msgs: {},
    active: 0,
    activeCard: 0,
    activeID: "",
    phrasesGame: [],
    phrase: {},
    typeEdit: -1,
    typeEditC: -1,
    idPaste: '',
    numberCutCuestion: -1,
    clipBoard: '',
    iDevicePath: "/scripts/idevices/ordena-activity/edition/",
    playerAudio: "",
    version: 1.5,
    id:false,
    ci18n: {
        "msgSubmit": _("Submit"),
        "msgClue": _("Cool! The clue is:"),
        "msgCodeAccess": _("Access code"),
        "msgPlayAgain": _("Play Again"),
        "msgPlayStart": _("Click here to play"),
        "msgErrors": _("Errors"),
        "msgHits": _("Hits"),
        "msgScore": _("Score"),
        "msgMinimize": _("Minimize"),
        "msgMaximize": _("Maximize"),
        "msgLive": _("Life"),
        "msgFullScreen": _("Full Screen"),
        "msgExitFullScreen": _("Exit Full Screen"),
        "msgNumQuestions": _("Number of questions"),
        "msgNoImage": _("No picture question"),
        "msgCool": _("Cool!"),
        "msgLoseT": _("You lost 330 points"),
        "msgSuccesses": _("Right! | Excellent! | Great! | Very good! | Perfect!"),
        "msgFailures": _("It was not that! | Incorrect! | Not correct! | Sorry! | Error!"),
        "msgTryAgain": _("You need at least %s&percnt; of correct answers to get the information. Please try again."),
        "msgEndGameScore": _("Please start the game before saving your score."),
        "msgScoreScorm": _("The score can't be saved because this page is not part of a SCORM package."),
        "msgOnlySaveScore": _("You can only save the score once!"),
        "msgOnlySave": _("You can only save once"),
        "msgInformation": _("Information"),
        "msgYouScore": _("Your score"),
        "msgAuthor": _("Author"),
        "msgOnlySaveAuto": _("Your score will be saved after each question. You can only play once."),
        "msgSaveAuto": _("Your score will be automatically saved after each question."),
        "msgYouScore": _("Your score"),
        "msgSeveralScore": _("You can save the score as many times as you want"),
        "msgYouLastScore": _("The last score saved is"),
        "msgActityComply": _("You have already done this activity."),
        "msgPlaySeveralTimes": _("You can do this activity as many times as you want"),
        "msgClose": _("Close"),
        "msgAudio": _("Audio"),
        "msgTimeOver": _("Tu tiempo ha finalizado. Inténtalo de nuevo"),
        "msgAllAttemps": _("¡Has agotado todos los intentos!. Prueba de nuevo"),
        "mgsAllPhrases": _("¡Has ordenado todas las actividades!"),
        "msgAttempts": _("Intentos"),
        "msgNumbersAttemps": _("Número de intentos"),
        "msgAuthor": _("Autoría"),
        "msgReboot": _("Reiniciar"),
        "msgActivities": _("Actividades"),
        "msgCheck": _("Comprobar"),
        "msgNextPhrase": _("Siguiente actividad"),
        "msgContinue": _("Continuar"),
        "msgPositions": _("Posiciones correctas"),
        "msgAllOK": _("¡Genial! Todo correcto ¡A por otra!"),
        "msgAgain": _("Inténtalo de nuevo"),
        "msgUncompletedActivity": _("Actividad no realizada"),
        "msgSuccessfulActivity": _("Actividad superada. Puntuación: %s"),
        "msgUnsuccessfulActivity": _("Actividad no superada. Puntuación: %s")

    },
    init: function () {
        this.ci18n.msgTryAgain = this.ci18n.msgTryAgain.replace("&percnt;", "%"); // Avoid invalid HTML
        this.setMessagesInfo();
        this.createForm();
    },
    setMessagesInfo: function () {
        var msgs = this.msgs;
        msgs.msgESelectFile = _("The selected file does not contain a valid game");
        msgs.msgEURLValid = _("You must upload or indicate the valid URL of an image");
        msgs.msgEOneQuestion = _("Please provide at least one question");
        msgs.msgTypeChoose = _("Please check all the answers in the right order");
        msgs.msgTimeFormat = _("Please check the time format: hh:mm:ss");
        msgs.msgProvideFB = _('Message to display when passing the game');
        msgs.msgNoSuportBrowser = _("Your browser is not compatible with this tool.");
        msgs.msgFewAttempts = _("El número de intentos tiene que ser mayor o igual que el número de frases del juego. Indica 0 para un número infinito de intentos");
        msgs.msgCompleteData = _("Debes indicar una imagen, un texto o/y un audio para cada carta");
        msgs.msgPairsMax = _("Número máximo de frases: 20");
        msgs.msgCardsColumn = _("Con las cabeceras fijas, el número de cartas debe ser mayor que el número de columnas");
        msgs.msgIDLenght = _('El identificador del informe debe tener al menos 5 caracteres');

    },
    createForm: function () {
        var path = $exeDevice.iDevicePath,
            html = '\
            <div id="gameQEIdeviceForm">\
            <div class="exe-idevice-info">' + _("Crea actividades interactivas en las que los jugadores tendrán que ordenar tarjetas con imágenes, textos y/o sonidos.") + ' <a href="https://youtu.be/f0cv7ouY2qc" hreflang="es" rel="lightbox"  target="_blank">' + _("Use Instructions") + '</a></div>\
            <div class="exe-form-tab" title="' + _('General settings') + '">\
            ' + $exeAuthoring.iDevice.gamification.instructions.getFieldset(_("Arrastra cada carta hasta su posición correcta")) + '\
                <fieldset class="exe-fieldset exe-fieldset-closed">\
                    <legend><a href="#">' + _("Options") + '</a></legend>\
                    <div>\
                        <p>\
                            <label for="ordenaEShowMinimize"><input type="checkbox" id="ordenaEShowMinimize">' + _("Show minimized.") + '</label>\
                        </p>\
                        <p>\
							<label for="ordenaETimeShowSolution">' + _("Tiempo durante el que se mostrarán las cartas(segundos)") + ':\
							<input type="number" name="ordenaETimeShowSolution" id="ordenaETimeShowSolution" value="3" min="1" max="999" /> </label>\
                        </p>\
                        <p>\
                            <label for="ordenaECustomMessages"><input type="checkbox" id="ordenaECustomMessages">' + _("Mensajes personalizados") + '.</label>\
                        </p>\
                        <p>\
                            <label for="ordenaETime">' + _("Tiempo") + '(m):</label><input type="number" name="ordenaETime" id="ordenaETime" value="0" min="0" max="120" step="1" />\
                        </p>\
                        <p>\
                            <label for="ordenaEShowSolution"><input type="checkbox" checked id="ordenaEShowSolution"> ' + _("Show solutions") + '. </label> \
                        </p>\
                        <p>\
                            <label for="ordenaEHasFeedBack"><input type="checkbox"  id="ordenaEHasFeedBack"> ' + _("Feedback") + '. </label> \
                            <label for="ordenaEPercentajeFB"></label><input type="number" name="ordenaEPercentajeFB" id="ordenaEPercentajeFB" value="100" min="5" max="100" step="5" disabled />\
                        </p>\
                        <p id="ordenaEFeedbackP" class="ODNE-EFeedbackP">\
                            <textarea id="ordenaEFeedBackEditor" class="exe-html-editor"></textarea>\
                        </p>\
                        <p>\
                            <label for="ordenaEPercentajeQuestions">' + _('% Actividades') + ':</label><input type="number" name="ordenaEPercentajeQuestions" id="ordenaEPercentajeQuestions" value="100" min="1" max="100" />\
                            <span id="ordenaENumeroPercentaje">1/1</span>\
                        </p>\
                        <p>\
                            <label for="ordenaEAuthor">' + _('Author') + ': </label><input id="ordenaEAuthor" type="text" />\
                        </p>\
                        <p>\
                        <span>' + _('Columnas') + ':</span>\
                        <span class="ODNE-EInputColumns">\
                            <input class="ODNE-EColumns" id="odn0" checked type="radio" name="odncolumns" value="0" />\
                            <label for="odn1">No</label>\
                            <input class="ODNE-EColumns" id="odn1" type="radio" name="odncolumns" value="1" />\
                            <label for="odn1">1</label>\
                            <input class="ODNE-EColumns" id="odn2" type="radio" name="odncolumns" value="2" />\
                            <label for="odn2">2</label>\
                            <input class="ODNE-EColumns" id="odn3" type="radio" name="odncolumns" value="3" />\
                            <label for="odn3">3</label>\
                            <input class="ODNE-EColumns" id="odn4" type="radio" name="odncolumns" value="4" />\
                            <label for="odn4">4</label>\
                            <input class="ODNE-EColumns" id="odn4" type="radio" name="odncolumns" value="5" />\
                            <label for="odn4">5</label>\
                        </span>\
                        </p>\
                        <p id="ordenaCustomizeCard" style="display:none;">\
                            <label for="ordenaMaxWidth"><input type="checkbox" checked  id="ordenaMaxWidth">' + _('Máximo ancho') + '.</label>\
                            <label for="ordenaCardHeight">' + _('Alto (px)') + ':\
                            <input type="number" name="ordenaCardHeight" id="ordenaCardHeight" value="200" min="0" max="1000" /> </label>\
                        </p>\
                        <p id="ordenaFixedHeaders"  style="display:none;">\
                            <label for="ordenaOrderedColumns"><input type="checkbox"  id="ordenaOrderedColumns">' + _('Cabeceras fijas') + '.</label>\
                        </p>\
                        <p>\
                            <label for="ordenaStartAutomatically"><input type="checkbox"  id="ordenaStartAutomatically">' + _('Inicio automático') + '</label>\
                        </p>\
                        <p>\
                            <strong class="GameModeLabel"><a href="#ordenaEEvaluationHelp" id="ordenaEEvaluationHelpLnk" class="GameModeHelpLink" title="' + _("Help") + '"><img src="' + path + 'quextIEHelp.gif"  width="16" height="16" alt="' + _("Help") + '"/></a></strong>\
							<label for="ordenaEEvaluation"><input type="checkbox" id="ordenaEEvaluation"> ' + _("Informe de progreso") + '. </label> \
							<label for="ordenaEEvaluationID">' + _("Identificador") + ':\
							<input type="text" id="ordenaEEvaluationID" disabled/> </label>\
                        </p>\
                        <div id="ordenaEEvaluationHelp" class="FLCRDS-TypeGameHelp">\
                            <p>' +_("Debes indicar el identificador, puede ser una palabra, una frase o un número de más de cuatro caracteres, que utilizarás para marcar las actividades que serán tenidas en cuenta en este informe de progreso.</p><p> Debe ser <strong>el mismo </strong> en todos los idevices de un informe y diferente en los de cada informe.</p>") + '</p>\
                        </div>\
                    </div>\
                </fieldset>\
                <fieldset class="exe-fieldset">\
                <legend><a href="#">' + _('Actividades') + '</a></legend>\
                    <div class="ODNE-EPanel" id="ordenaEPanel">\
                    <div class="ODNE-ENavigationButtons">\
                        <a href="#" id="ordenaEAdd" class="ODNE-ENavigationButton" title="' + _('Añadir actividad') + '"><img src="' + path + 'quextIEAdd.png"  alt="' + _('Añadir actividad') + '" class="ODNE-EButtonImage b-add" /></a>\
                        <a href="#" id="ordenaEFirst" class="ODNE-ENavigationButton"  title="' + _('Priemra actividad') + '"><img src="' + path + 'quextIEFirst.png"  alt="' + _('Primera actividad') + '" class="ODNE-EButtonImage b-first" /></a>\
                        <a href="#" id="ordenaEPrevious" class="ODNE-ENavigationButton" title="' + _('Anterior actividad') + '"><img src="' + path + 'quextIEPrev.png" alt="' + _('Anterior actividad') + '" class="ODNE-EButtonImage b-prev" /></a>\
                        <span class="sr-av">' + _("Actividad número:") + '</span><span class="ODNE-NumberPhrase" id="ordenaENumberPhrase">1</span>\
                        <a href="#" id="ordenaENext" class="ODNE-ENavigationButton"  title="' + _('Siguiente actividad') + '"><img src="' + path + 'quextIENext.png" alt="' + _('Próxima actividad') + '" class="ODNE-EButtonImage b-next" /></a>\
                        <a href="#" id="ordenaELast" class="ODNE-ENavigationButton"  title="' + _('ültima actividad') + '"><img src="' + path + 'quextIELast.png" alt="' + _('ültima actividad') + '" class="ODNE-EButtonImage b-last" /></a>\
                        <a href="#" id="ordenaEDelete" class="ODNE-ENavigationButton" title="' + _('Borrar actividad') + '"><img src="' + path + 'quextIEDelete.png" alt="' + _('Borrar actividad') + '" class="ODNE-EButtonImage b-delete" /></a>\
                        <a href="#" id="ordenaECopy" class="ODNE-ENavigationButton" title="' + _('Copiar actividad') + '"><img src="' + path + 'quextIECopy.png" + alt="' + _('Copiar actividad') + '" class="ODNE-EButtonImage b-copy" /></a>\
                        <a href="#" id="ordenaECut" class="ODNE-ENavigationButton" title="' + _('Cortar actividad') + '"><img src="' + path + 'quextIECut.png" + alt="' + _('Cortar actividad') + '" class="ODNE-EButtonImage b-copy" /></a>\
                        <a href="#" id="ordenaEPaste" class="ODNE-ENavigationButton"  title="' + _('Pegar actividad') + '"><img src="' + path + 'quextIEPaste.png" alt="' + _('Pegar actividad') + '" class="ODNE-EButtonImage b-paste" /></a>\
                    </div>\
                    <p class="ODNE-ENumActivity">' + _('Actividad') + ' <span id="ordenaActivityNumber">1</span></p>\
                    <p class="ODNE-ECustomMessageDef" id="ordenaEDefinitionDiv">\
                        <label for="ordenaEDefinition">' + _('Enunciado') + ':</label><input type="text" id="ordenaEDefinition">\
                        <label>' + _("Audio") + ':</label>\
                        <input type="text" id="ordenaEURLAudioDefinition" class="exe-file-picker ODNE-EURLAudio"  />\
                        <a href="#"id="ordenaEPlayAudioDefinition" class="ODNE-ENavigationButton ODNE-EPlayVideo" title="' + _("Audio") + '"><img src="' + path + 'quextIEPlay.png" alt="Play audio" class="ODNE-EButtonImage b-play" /></a>\
                    </p>\
                    <p class="ODNE-ECustomMessageDiv">\
                        <label for="ordenaEMessageOK">' + _('Acierto') + ':</label><input type="text" id="ordenaEMessageOK"/>\
                        <label>' + _("Audio") + ':</label>\
                        <input type="text" id="ordenaEURLAudioOK" class="exe-file-picker ODNE-EURLAudio"  />\
                        <a href="#"id="ordenaEPlayAudioOK" class="ODNE-ENavigationButton ODNE-EPlayVideo" title="' + _("Audio") + '"><img src="' + path + 'quextIEPlay.png" alt="Play audio" class="ODNE-EButtonImage b-play" /></a>\
                    </p>\
                    <p class="ODNE-ECustomMessageDiv">\
                        <label for="ordenaEMessageKO">' + _('Error') + ':</label><input type="text" id="ordenaEMessageKO"/>\
                        <label>' + _("Audio") + ':</label>\
                        <input type="text" id="ordenaEURLAudioKO" class="exe-file-picker ODNE-EURLAudio"  />\
                        <a href="#"id="ordenaEPlayAudioKO" class="ODNE-ENavigationButton ODNE-EPlayVideo" title="' + _("Audio") + '"><img src="' + path + 'quextIEPlay.png" alt="Play audio" class="ODNE-EButtonImage b-play" /></a>\
                    </p>\
                    <p class="ODNE-EPhrase" id="ordenaEPhrase">\
                    </p>\
                    <div class="ODNE-EContents">\
                        <div class="ODNE-ENavigationButtons">\
                        <a href="#" id="ordenaEAddC" class="ODNE-ENavigationButton" title="' + _('Añadir carta') + '"><img src="' + path + 'quextIEAdd.png"  alt="' + _('Añadir card') + '" class="ODNE-EButtonImage b-add" /></a>\
                        <a href="#" id="ordenaEDeleteC" class="ODNE-ENavigationButton" title="' + _('Borrar carta') + '"><img src="' + path + 'quextIEDelete.png" alt="' + _('Borrar card') + '" class="ODNE-EButtonImage b-delete" /></a>\
                        <a href="#" id="ordenaECopyC" class="ODNE-ENavigationButton" title="' + _('Copiar carta') + '"><img src="' + path + 'quextIECopy.png" + alt="' + _('Copiar card') + '" class="ODNE-EButtonImage b-copy" /></a>\
                        <a href="#" id="ordenaECutC" class="ODNE-ENavigationButton" title="' + _('Cortar carta') + '"><img src="' + path + 'quextIECut.png" + alt="' + _('Cortar card') + '" class="ODNE-EButtonImage b-cut" /></a>\
                        <a href="#" id="ordenaEPasteC" class="ODNE-ENavigationButton"  title="' + _('Pegar carta') + '"><img src="' + path + 'quextIEPaste.png" alt="' + _('Pegar card') + '" class="ODNE-EButtonImage b-paste" /></a>\
                    </div>\
                    </div>\
                    <div class="ODNE-ENumPhrasesDiv" id="ordenaENumPhrasesDiv">\
                        <div class="ODNE-ENumPhraseS"><span class="sr-av">' + _("Phrases:") + '</span></div> <span class="ODNE-ENumPhrases" id="ordenaENumPhrases">0</span>\
                    </div>\
                </div>\
                </fieldset>\
                ' + $exeDevice.getTextFieldset("after") + '\
            </div>\
            ' + $exeAuthoring.iDevice.gamification.itinerary.getTab() + '\
				' + $exeAuthoring.iDevice.gamification.scorm.getTab() + '\
				' + $exeAuthoring.iDevice.gamification.common.getLanguageTab(this.ci18n) + '\
				' + $exeAuthoring.iDevice.gamification.share.getTab() + '\
        </div>\
			';
        var field = $("textarea.jsContentEditor").eq(0)
        field.before(html);
        $exeAuthoring.iDevice.tabs.init("gameQEIdeviceForm");
        $exeAuthoring.iDevice.gamification.scorm.init();
        this.enableForm(field);

    },
    generarID: function () {
        var fecha = new Date(),
            a = fecha.getUTCFullYear(),
            m = fecha.getUTCMonth() + 1,
            d = fecha.getUTCDate(),
            h = fecha.getUTCHours(),
            min = fecha.getUTCMinutes(),
            s = fecha.getUTCSeconds(),
            o = fecha.getTimezoneOffset();

        var IDE = `${a}${m}${d}${h}${min}${s}${o}`;
        return IDE;
    },

    getTextFieldset: function (position) {
        if (typeof (position) != "string" || (position != "after" && position != "before")) return "";
        var tit = _('Content after');
        var id = "After";
        if (position == "before") {
            tit = _('Content before');
            id = "Before";
        }
        return "<fieldset class='exe-fieldset exe-feedback-fieldset exe-fieldset-closed'>\
                    <legend><a href='#'>" + _('Contenido adicional') + " (" + _('Optional').toLowerCase() + ")</a></legend>\
                    <div>\
                        <p>\
                            <label for='eXeIdeviceText" + id + "' class='sr-av'>" + tit + ":</label>\
                            <textarea id='eXeIdeviceText" + id + "' class='exe-html-editor'\></textarea>\
                        </p>\
                    <div>\
				</fieldset>";
    },

    removeCard: function () {
        var numcards = $('#ordenaEPhrase').find('div.ODNE-EDatosCarta').length;

        if (numcards < 2) {
            $exeDevice.showMessage($exeDevice.msgs.msgEOneQuestion);
        } else {
            var next = $('#ordenaEDatosCarta-' + $exeDevice.activeID).next('div.ODNE-EDatosCarta').data('id'),
                prev = $('#ordenaEDatosCarta-' + $exeDevice.activeID).prev('div.ODNE-EDatosCarta').data('id')
            if (prev != null) {
                $('#ordenaEDatosCarta-' + $exeDevice.activeID).remove();
                $exeDevice.activeID = prev;
            } else if (next != null) {
                $('#ordenaEDatosCarta-' + $exeDevice.activeID).remove();
                $exeDevice.activeID = next;
            }
            $('.ODNE-EDatosCarta').removeClass('ODNE-EActive');
            $('#ordenaEDatosCarta-' + $exeDevice.activeID).addClass('ODNE-EActive');
            $('#ordenaEPasteC').hide();

        }
    },
    copyCard: function () {
        $exeDevice.typeEditC = 0;
        $exeDevice.idPaste = $exeDevice.activeID;
        $('#ordenaEPasteC').show();

    },

    cutCard: function () {
        $exeDevice.typeEditC = 1;
        $exeDevice.idPaste = $exeDevice.activeID;
        $('#ordenaEPasteC').show();
    },

    pasteCard: function () {
        if ($exeDevice.typeEditC == 0) {
            var $cardcopy = $('#ordenaEDatosCarta-' + $exeDevice.idPaste),
                $cardactive = $('#ordenaEDatosCarta-' + $exeDevice.activeID),
                dataCard = $exeDevice.cardToJson($cardcopy);
            dataCard.id = $exeDevice.getID();
            $cardactive.after($exeDevice.jsonToCard(dataCard, true));
            $exeDevice.activeID = dataCard.id;

        } else if ($exeDevice.typeEditC == 1) {
            $('#ordenaEPasteC').hide();
            $exeDevice.typeEditC = -1;
            var $cardcopy = $('#ordenaEDatosCarta-' + $exeDevice.idPaste),
                $cardactive = $('#ordenaEDatosCarta-' + $exeDevice.activeID);
            if ($exeDevice.idPaste != $exeDevice.activeID) {
                $cardactive.after($cardcopy)
            }

        }
    },
    jsonToCard: function (p, inload) {
        var $card = $exeDevice.addCard(!inload),
            id = $card.data('id');
        $card.find('.ODNE-EX').eq(0).val(p.x);
        $card.find('.ODNE-EY').eq(0).val(p.y);
        $card.find('.ODNE-EAuthor').eq(0).val(p.author);
        $card.find('.ODNE-EAlt').eq(0).val(p.alt);
        $card.find('.ODNE-EURLImage').eq(0).val(p.url);
        $card.find('.ODNE-EURLAudio').eq(0).val(p.audio);
        $card.find('.ODNE-EText').eq(0).val(p.eText);
        $card.find('.ODNE-ETextDiv').eq(0).text(p.eText);
        $card.find('.ODNE-EColor').eq(0).val(p.color);
        $card.find('.ODNE-EBackColor').eq(0).val(p.backcolor);
        $exeDevice.showImage($exeDevice.activeID);
        if (p.eText.trim().length > 0) {
            $card.find('.ODNE-ETextDiv').show();
        } else {
            $card.find('.ODNE-ETextDiv').hide();
        }

        $card.find('.ODNE-ETextDiv').eq(0).css({
            'color': p.color,
            'background-color': $exeDevice.hexToRgba(p.backcolor, 0.7)
        });
        return $card;
    },

    getID: function () {
        return Math.floor(Math.random() * Date.now())
    },
    enableForm: function (field) {
        $exeDevice.initPhrases();
        $exeDevice.loadPreviousValues(field);
        $exeDevice.addEvents();
    },
    updateQuestionsNumber: function () {
        var percentaje = parseInt($exeDevice.removeTags($('#ordenaEPercentajeQuestions').val()));
        if (isNaN(percentaje)) {
            return;
        }
        percentaje = percentaje < 1 ? 1 : percentaje;
        percentaje = percentaje > 100 ? 100 : percentaje;
        var num = Math.round((percentaje * $exeDevice.phrasesGame.length) / 100);
        num = num == 0 ? 1 : num;
        $('#ordenaENumeroPercentaje').text(num + "/" + $exeDevice.phrasesGame.length)
    },
    showPhrase: function (i, inload) {
        var num = i < 0 ? 0 : i;
        $exeDevice.active = num >= $exeDevice.phrasesGame.length ? $exeDevice.phrasesGame.length - 1 : num;
        var phrase = $exeDevice.phrasesGame[num];
        $exeDevice.clearPhrase();
        for (var k = 0; k < phrase.cards.length; k++) {
            var p = phrase.cards[k];
            $exeDevice.jsonToCard(p, inload);
        }
        $('.ODNE-EDatosCarta').removeClass('ODNE-EActive');
        $exeDevice.activeID = $('.ODNE-EDatosCarta').eq(0).data('id');
        $('.ODNE-EDatosCarta').eq(0).addClass('ODNE-EActive');
        $('#ordenaEMessageOK').val(phrase.msgHit);
        $('#ordenaEMessageKO').val(phrase.msgError);
        $('#ordenaEDefinition').val(phrase.definition);
        $('#ordenaENumberPhrase').text($exeDevice.active + 1);
        $('#ordenaActivityNumber').text($exeDevice.active + 1);
        $('#ordenaEURLAudioDefinition').val(phrase.audioDefinition);
        $('#ordenaEURLAudioOK').val(phrase.audioHit);
        $('#ordenaEURLAudioKO').val(phrase.audioError);


        $exeDevice.stopSound();
    },
    initPhrases: function () {
        $exeDevice.active = 0;
        $exeDevice.phrasesGame.push($exeDevice.getPhraseDefault());
        $exeDevice.addCard(false);
        $('.ODNE-ECustomMessageDiv').hide();
    },
    addCard: function (clone) {
        $exeDevice.activeID = $exeDevice.getID();
        var buttonI = clone ? '<input type="button" class="exe-pick-any-file" value=' + ('Selecciona') + ' id="_browseForordenaEURLImage-' + $exeDevice.activeID + '" onclick="$exeAuthoring.iDevice.filePicker.openFilePicker(this)">' : '',
            buttonA = clone ? '<input type="button" class="exe-pick-any-file" value=' + ('Selecciona') + ' id="_browseForordenaEURLAudio-' + $exeDevice.activeID + '" onclick="$exeAuthoring.iDevice.filePicker.openFilePicker(this)">' : '';
        $('#ordenaEPhrase').find('div.ODNE-EDatosCarta').removeClass('ODNE-EActive');
        var path = $exeDevice.iDevicePath,
            card = '<div class="ODNE-EDatosCarta ODNE-EActive" id="ordenaEDatosCarta-' + $exeDevice.activeID + '" data-id="' + $exeDevice.activeID + '">\
           <div class="ODNE-EMultimedia">\
                <div class="ODNE-ECard">\
                    <img class=".ODNE-EHideODNE-EImage" id="ordenaEImage-' + $exeDevice.activeID + '"  src="' + path + 'quextIEImage.png" alt="' + _("No image") + '" />\
                    <img class="ODNE-ECursor" id="ordenaECursor-' + $exeDevice.activeID + '" src="' + path + 'quextIECursor.gif" alt="" />\
                    <img class=".ODNE-EHideODNE-NoImage" id="ordenaENoImage-' + $exeDevice.activeID + '" src="' + path + 'quextIEImage.png" alt="' + _("No image") + '" />\
                    <div class="ODNE-ETextDiv" id="ordenaETextDiv-' + $exeDevice.activeID + '"></div>\
                </div>\
            </div>\
           <span class="ODNE-ETitleText" id="ordenaETitleText-' + $exeDevice.activeID + '">' + _("Text") + '</span>\
           <div class="ODNE-EInputText" id="ordenaEInputText-' + $exeDevice.activeID + '">\
                <label class="sr-av">' + _("Text") + '</label><input type="text" id="ordenaEText-' + $exeDevice.activeID + '" class="ODNE-EText" />\
                <label id="ordenaELblColor-' + $exeDevice.activeID + '" class="ODNE-LblColor">' + _("Fuente") + ': </label><input id="ordenaEColor-' + $exeDevice.activeID + '"  type="color"  class="ODNE-EColor" value="#000000">\
                <label id="ordenaELblBgColor-' + $exeDevice.activeID + '"  class="ODNE-LblBgColor">' + _("Fondo") + ': </label><input id="ordenaEBgColor-' + $exeDevice.activeID + '"  type="color"   class="ODNE-EBackColor" value="#ffffff">\
            </div>\
           <span class="ODNE-ETitleImage"id="ordenaETitleImage-' + $exeDevice.activeID + '">' + _("Image") + '</span>\
           <div class="ODNE-EInputImage"  id="ordenaEInputImage-' + $exeDevice.activeID + '">\
               <label class="sr-av" >URL</label>\
               <input type="text" id="ordenaEURLImage-' + $exeDevice.activeID + '" class="exe-file-picker ODNE-EURLImage"/>\
               ' + buttonI + '\
               <a href="#" id="ordenaEPlayImage-' + $exeDevice.activeID + '" class="ODNE-ENavigationButton ODNE-EPlayVideo" title="' + _("Show") + '"><img src="' + path + 'quextIEPlay.png" alt="' + _("Show") + '" class="ODNE-EButtonImage b-play" /></a>\
               <a href="#" id="ordenaEShowMore-' + $exeDevice.activeID + '" class="ODNE-ENavigationButton ODNE-EShowMore" title="' + _("More") + '"><img src="' + path + 'quextEIMore.png" alt="' + _("More") + '" class="ODNE-EButtonImage b-play" /></a>\
           </div>\
           <div class="ODNE-ECoord">\
                   <label >X:</label>\
                   <input id="ordenaEX-' + $exeDevice.activeID + '" class="ODNE-EX" type="text" value="0" />\
                   <label >Y:</label>\
                   <input id="ordenaEY' + $exeDevice.activeID + '" class="ODNE-EY" type="text" value="0" />\
           </div>\
           <div class="ODNE-EAuthorAlt"  id="ordenaEAuthorAlt-' + $exeDevice.activeID + '">\
               <div class="ODNE-EInputAuthor">\
                   <label>' + _("Author") + '</label><input type="text" class="ODNE-EAuthor" />\
               </div>\
               <div class="ODNE-EInputAlt">\
                   <label>' + _("Texto alternativo") + '</label><input  type="text" class="ODNE-EAlt" />\
               </div>\
           </div>\
           <span >' + _("Audio") + '</span>\
           <div class="ODNE-EInputAudio" >\
               <label class="sr-av" >URL</label>\
               <input type="text" id="ordenaEURLAudio-' + $exeDevice.activeID + '" class="exe-file-picker ODNE-EURLAudio"  />\
               ' + buttonA + '\
               <a href="#"id="ordenaEPlayAudio-' + $exeDevice.activeID + '" class="ODNE-ENavigationButton ODNE-EPlayVideo" title="' + _("Audio") + '"><img src="' + path + 'quextIEPlay.png" alt="Play" class="ODNE-EButtonImage b-play" /></a>\
           </div>\
       </div>';

        $('#ordenaEPhrase').append(card);
        var $card = $('#ordenaEPhrase').find('div.ODNE-EDatosCarta').last();
        $exeDevice.addEventCard($exeDevice.activeID);
        $exeDevice.showImage($exeDevice.activeID);
        $('#ordenaETextDiv-' + $exeDevice.activeID).hide();
        return $card;
    },
    addEventCard: function (id) {
        $('#ordenaEAuthorAlt-' + id).hide();
        $('#ordenaEURLImage-' + id).on('change', function () {
            $exeDevice.loadImage(id);
        });
        $('#ordenaEPlayImage-' + id).on('click', function (e) {
            e.preventDefault();
            $exeDevice.loadImage(id);
        });
        $('#ordenaEURLAudio-' + id).on('change', function () {
            $exeDevice.loadAudio($(this).val());
        });
        $('#ordenaEPlayAudio-' + id).on('click', function (e) {
            e.preventDefault();
            var audio = $('#ordenaEURLAudio-' + id).val();
            $exeDevice.loadAudio(audio);
        });

        $('#ordenaEShowMore-' + id).on('click', function (e) {
            e.preventDefault();
            $('#ordenaEAuthorAlt-' + id).slideToggle();
        });


        $('#ordenaEText-' + id).on('keyup', function () {
            $('#ordenaETextDiv-' + id).text($(this).val());
            if ($(this).val().trim().length > 0) {
                $('#ordenaETextDiv-' + $exeDevice.activeID).show();
            } else {
                $('#ordenaETextDiv-' + $exeDevice.activeID).hide();
            }

        });

        $('#ordenaEColor-' + id).on('change', function () {
            $('#ordenaETextDiv-' + id).css('color', $(this).val());
        });
        $('#ordenaEBgColor-' + id).on('change', function () {
            var bc = $exeDevice.hexToRgba($(this).val(), 0.7);
            $('#ordenaETextDiv-' + id).css({
                'background-color': bc
            });

        });
        $('#ordenaEImage-' + id).on('click', function (e) {
            $exeDevice.clickImage(id, e.pageX, e.pageY);
        });
        $('#ordenaECursor-' + id).on('click', function (e) {
            $(this).hide();
            $('#ordenaEX-' + id).val(0);
            $('#ordenaEY-' + id).val(0);
        });


    },
    cardToJson: function ($card) {
        var p = new Object();
        p.id = $card.data('id');
        p.type = 2
        p.x = parseFloat($card.find('.ODNE-EX').eq(0).val());
        p.y = parseFloat($card.find('.ODNE-EY').eq(0).val());
        p.author = $card.find('.ODNE-EAuthor').eq(0).val();
        p.alt = $card.find('.ODNE-EAlt').eq(0).val();
        p.url = $card.find('.ODNE-EURLImage').eq(0).val();
        p.audio = $card.find('.ODNE-EURLAudio').eq(0).val();
        p.eText = $card.find('.ODNE-EText').eq(0).val();
        p.color = $card.find('.ODNE-EColor').eq(0).val();
        p.backcolor = $card.find('.ODNE-EBackColor').eq(0).val();
        return p;

    },
    validatePhrase: function () {
        var correct = true,
            phrase = $exeDevice.getPhraseDefault(),
            $cards = $('#ordenaEPhrase').find('div.ODNE-EDatosCarta'),
            orderedColumns = $('#ordenaOrderedColumns').is(':checked'),
            gameColumns = parseInt($('input.ODNE-EColumns[name=odncolumns]:checked').val());
        $cards.each(function name() {
            var card = $exeDevice.cardToJson($(this));
            if (!$exeDevice.validateCard(card)) {
                correct = false;
            } else {
                phrase.cards.push(card)
            }
        });
        if (gameColumns > 1 && orderedColumns) {
            if (phrase.cards.length <= gameColumns) {
                $exeDevice.showMessage($exeDevice.msgs.msgCardsColumn);
                return false;
            }
        }
        if (!correct) {
            return false;
        }

        phrase.msgHit = $('#ordenaEMessageOK').val();
        phrase.msgError = $('#ordenaEMessageKO').val();;
        phrase.definition = $('#ordenaEDefinition').val();
        phrase.audioDefinition = $('#ordenaEURLAudioDefinition').val();
        phrase.audioHit = $('#ordenaEURLAudioOK').val();
        phrase.audioError = $('#ordenaEURLAudioKO').val();

        $exeDevice.phrasesGame[$exeDevice.active] = phrase;
        return true;
    },
    validateCard: function (p) {
        var message = '';
        if (p.eText.length == 0 && p.url.length < 5 && p.audio.length == 0) {
            message = $exeDevice.msgs.msgCompleteData;
            $exeDevice.showMessage(message);
        }
        return message == ''
    },

    hexToRgba: function (hex, opacity) {
        return 'rgba(' + (hex = hex.replace('#', '')).match(new RegExp('(.{' + hex.length / 3 + '})', 'g')).map(function (l) {
            return parseInt(hex.length % 2 ? l + l : l, 16)
        }).concat(isFinite(opacity) ? opacity : 1).join(',') + ')';
    },

    getPhraseDefault: function () {
        var q = new Object();
        q.cards = [];
        q.msgError = '';
        q.msgHit = '';
        q.definition = '';
        q.audioDefinition = '';
        q.audioHit = '';
        q.audioError = '';
        return q;
    },

    getCardDefault: function () {
        var p = new Object();
        p.id = "";
        p.type = 2;
        p.url = '';
        p.audio = '';
        p.x = 0;
        p.y = 0;
        p.author = '';
        p.alt = '';
        p.eText = '';
        p.color = '#000000';
        p.backcolor = "#ffffff";
        return p;
    },

    loadPreviousValues: function (field) {
        var originalHTML = field.val();
        if (originalHTML != '') {
            var wrapper = $("<div></div>");
            wrapper.html(originalHTML);
            var json = $('.ordena-DataGame', wrapper).text();
            json = $exeDevice.Decrypt(json);
            var dataGame = $exeDevice.isJsonString(json),
                $audiosDef = $('.ordena-LinkAudiosDef', wrapper),
                $audiosError = $('.ordena-LinkAudiosError', wrapper),
                $audiosHit = $('.ordena-LinkAudiosHit', wrapper);
            for (var i = 0; i < dataGame.phrasesGame.length; i++) {
                var $imagesLink = $('.ordena-LinkImages-' + i, wrapper),
                    $audiosLink = $('.ordena-LinkAudios-' + i, wrapper),
                    cards = dataGame.phrasesGame[i].cards;
                $imagesLink.each(function () {
                    var iq = parseInt($(this).text());
                    if (!isNaN(iq) && iq < cards.length) {
                        cards[iq].url = $(this).attr('href');
                        if (cards[iq].url < 4) {
                            cards[iq].url = "";
                        }
                    }
                });
                $audiosLink.each(function () {
                    var iqa = parseInt($(this).text());
                    if (!isNaN(iqa) && iqa < cards.length) {
                        cards[iqa].audio = $(this).attr('href');
                        if (cards[iqa].audio.length < 4) {
                            cards[iqa].audio = "";
                        }
                    }
                });

            }
            $audiosDef.each(function () {
                var iqa = parseInt($(this).text());
                if (!isNaN(iqa) && iqa < dataGame.phrasesGame.length) {
                    dataGame.phrasesGame[iqa].audioDefinition = $(this).attr('href');
                    if (dataGame.phrasesGame[iqa].audioDefinition.length < 4) {
                        dataGame.phrasesGame[iqa].audioDefinition = "";
                    }
                }
            });
            $audiosError.each(function () {
                var iqa = parseInt($(this).text());
                if (!isNaN(iqa) && iqa < dataGame.phrasesGame.length) {
                    dataGame.phrasesGame[iqa].audioError = $(this).attr('href');
                    if (dataGame.phrasesGame[iqa].audioError.length < 4) {
                        dataGame.phrasesGame[iqa].audioError = "";
                    }
                }
            });
            $audiosHit.each(function () {
                var iqa = parseInt($(this).text());
                if (!isNaN(iqa) && iqa < dataGame.phrasesGame.length) {
                    dataGame.phrasesGame[iqa].audioHit = $(this).attr('href');
                    if (dataGame.phrasesGame[iqa].audioHit.length < 4) {
                        dataGame.phrasesGame[iqa].audioHit = "";
                    }
                }
            });


            $exeDevice.updateFieldGame(dataGame);
            var instructions = $(".ordena-instructions", wrapper);
            if (instructions.length == 1) {
                instructions = instructions.html() || ''
                if (tinyMCE.get('eXeGameInstructions')) {
                    tinyMCE.get('eXeGameInstructions').setContent(instructions);
                } else {
                    $("#eXeGameInstructions").val(instructions)
                }
            }

            var textFeedBack = $(".ordena-feedback-game", wrapper);
            if (textFeedBack.length == 1) {
                textFeedBack = textFeedBack.html() || ''
                if (tinyMCE.get('ordenaEFeedBackEditor')) {
                    tinyMCE.get('ordenaEFeedBackEditor').setContent(textFeedBack);
                } else {
                    $("#ordenaEFeedBackEditor").val(textFeedBack)
                }
            }

            var textAfter = $(".ordena-extra-content", wrapper);
            if (textAfter.length == 1) {
                textAfter = textAfter.html() || ''
                if (tinyMCE.get('eXeIdeviceTextAfter')) {
                    tinyMCE.get('eXeIdeviceTextAfter').setContent(textAfter);
                } else {
                    $("#eXeIdeviceTextAfter").val(textAfter)
                }
            }
            $exeAuthoring.iDevice.gamification.common.setLanguageTabValues(dataGame.msgs);
            $exeDevice.showPhrase(0, true);


        }
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
        if (!$exeDevice.validatePhrase()) {
            return;
        }
        var dataGame = $exeDevice.validateData();

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
        var textFeedBack = tinyMCE.get('ordenaEFeedBackEditor').getContent();
        if (dataGame.instructions != "") divContent = '<div class="ordena-instructions gameQP-instructions">' + dataGame.instructions + '</div>';
        var linksImages = $exeDevice.createlinksImage(dataGame.phrasesGame),
            linksAudios = $exeDevice.createlinksAudio(dataGame.phrasesGame);
        var html = '<div class="ordena-IDevice">';
        html += '<div class="ordena-feedback-game">' + textFeedBack + '</div>';
        html += divContent;
        html += '<div class="ordena-DataGame js-hidden">' + json + '</div>';
        html += linksImages;
        html += linksAudios;
        var textAfter = tinyMCE.get('eXeIdeviceTextAfter').getContent();
        if (textAfter != "") {
            html += '<div class="ordena-extra-content">' + textAfter + '</div>';
        }
        html += '<div class="ordena-bns js-hidden">' + $exeDevice.msgs.msgNoSuportBrowser + '</div>';
        html += '</div>';
        return html;
    },

    createlinksImage: function (phrasesGame) {
        var html = '';
        for (var i = 0; i < phrasesGame.length; i++) {
            var q = phrasesGame[i];
            for (var k = 0; k < q.cards.length; k++) {
                var p = q.cards[k],
                    linkImage = '';
                if (typeof p.url != "undefined" && p.url.length > 4 && p.url.indexOf('http') != 0) {
                    linkImage = '<a href="' + p.url + '" class="js-hidden ordena-LinkImages-' + i + '">' + k + '</a>';
                }
                html += linkImage;
            }
        }
        return html;
    },


    createlinksAudio: function (phrasesGame) {
        var html = '';

        for (var i = 0; i < phrasesGame.length; i++) {
            var q = phrasesGame[i];
            for (var k = 0; k < q.cards.length; k++) {
                var p = q.cards[k],
                    linkImage = '';
                if (typeof p.audio != "undefined" && p.audio.indexOf('http') != 0 && p.audio.length > 4) {
                    linkImage = '<a href="' + p.audio + '" class="js-hidden ordena-LinkAudios-' + i + '">' + k + '</a>';
                }
                html += linkImage;
            }
            if (typeof q.audioDefinition != "undefined" && q.audioDefinition.indexOf('http') != 0 && q.audioDefinition.length > 4) {
                linkImage = '<a href="' + q.audioDefinition + '" class="js-hidden ordena-LinkAudiosDef">' + i + '</a>';
                html += linkImage;
            }
            if (typeof q.audioHit != "undefined" && q.audioHit.indexOf('http') != 0 && q.audioHit.length > 4) {
                linkImage = '<a href="' + q.audioHit + '" class="js-hidden ordena-LinkAudiosHit">' + i + '</a>';
                html += linkImage;
            }
            if (typeof q.audioError != "undefined" && q.audioError.indexOf('http') != 0 && q.audioError.length > 4) {
                linkImage = '<a href="' + q.audioError + '" class="js-hidden ordena-LinkAudiosError">' + i + '</a>';
                html += linkImage;
            }

        }
        return html;
    },

    showMessage: function (msg) {
        eXe.app.alert(msg);
    },

    validateData: function () {
        var clear = $exeDevice.removeTags,
            instructions = tinyMCE.get('eXeGameInstructions').getContent(),
            textFeedBack = tinyMCE.get('ordenaEFeedBackEditor').getContent(),
            textAfter = tinyMCE.get('eXeIdeviceTextAfter').getContent(),
            showMinimize = $('#ordenaEShowMinimize').is(':checked'),
            itinerary = $exeAuthoring.iDevice.gamification.itinerary.getValues(),
            caseSensitive = $('#ordenaECaseSensitive').is(':checked'),
            feedBack = $('#ordenaEHasFeedBack').is(':checked'),
            percentajeFB = parseInt(clear($('#ordenaEPercentajeFB').val())),
            customMessages = $('#ordenaECustomMessages').is(':checked'),
            percentajeQuestions = parseInt(clear($('#ordenaEPercentajeQuestions').val())),
            time = parseInt(clear($('#ordenaETime').val())),
            timeShowSolution = parseInt(clear($('#ordenaETimeShowSolution').val())),
            cardHeight = parseInt(clear($('#ordenaCardHeight').val())),
            startAutomatically = $('#ordenaStartAutomatically').is(':checked'),
            /*Fran Melendo*/
            gameColumns = parseInt($('input.ODNE-EColumns[name=odncolumns]:checked').val()),
            author = $('#ordenaEAuthor').val(),
            showSolution = $('#ordenaEShowSolution').is(':checked'),
            maxWidth = $('#ordenaMaxWidth').is(':checked'),
            orderedColumns = $('#ordenaOrderedColumns').is(':checked'),
            phrasesGame = $exeDevice.phrasesGame;
            evaluation = $('#ordenaEEvaluation').is(':checked'),
            evaluationID = $('#ordenaEEvaluationID').val(),
            id = $exeDevice.id ? $exeDevice.id : $exeDevice.generarID();
            if (evaluation && evaluationID.length < 5) {
                eXe.app.alert($exeDevice.msgs.msgIDLenght);
                return false;
            }
        if (phrasesGame.length == 0) {
            $exeDevice.showMessage($exeDevice.msgs.msgEOneQuestion);
            return false;
        }
        var scorm = $exeAuthoring.iDevice.gamification.scorm.getValues();
        var data = {
            'typeGame': 'Ordena',
            'author': author,
            'instructions': instructions,
            'showMinimize': showMinimize,
            'showSolution': showSolution,
            'itinerary': itinerary,
            'phrasesGame': phrasesGame,
            'isScorm': scorm.isScorm,
            'textButtonScorm': scorm.textButtonScorm,
            'repeatActivity': scorm.repeatActivity,
            'textFeedBack': escape(textFeedBack),
            'textAfter': escape(textAfter),
            'caseSensitive': caseSensitive,
            'feedBack': feedBack,
            'percentajeFB': percentajeFB,
            'customMessages': customMessages,
            'percentajeQuestions': percentajeQuestions,
            'timeShowSolution': timeShowSolution,
            'time': time,
            'version': $exeDevice.version,
            'maxWidth': maxWidth,
            'cardHeight': cardHeight, //Fran Melendo, nuevos campos
            'startAutomatically': startAutomatically,
            'orderedColumns': orderedColumns,
            'gameColumns': gameColumns,
            'evaluation':evaluation,
            'evaluationID':evaluationID,
            'id':id
        }
        return data;
    },
    showImage: function (id) {
        var $cursor = $('#ordenaECursor-' + id),
            $image = $('#ordenaEImage-' + id),
            $nimage = $('#ordenaENoImage-' + id),
            x = parseFloat($('#ordenaEX-' + id).val()),
            y = parseFloat($('#ordenaEY-' + id).val()),
            alt = $('#ordenaEAlt-' + id).val(),
            url = $('#ordenaEURLImage-' + id).val();
        $image.hide();
        $cursor.hide();
        $image.attr('alt', alt);
        $nimage.show();
        $image.prop('src', url)
            .on('load', function () {
                if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                    return false;
                } else {
                    var mData = $exeDevice.placeImageWindows(this, this.naturalWidth, this.naturalHeight);
                    $exeDevice.drawImage(this, mData);
                    $image.show();
                    $nimage.hide();
                    $exeDevice.paintMouse(this, $cursor, x, y);
                    return true;
                }
            }).on('error', function () {
                return false;
            });
    },



    playSound: function (selectedFile) {
        var selectFile = $exeDevice.extractURLGD(selectedFile);
        $exeDevice.playerAudio = new Audio(selectFile);
        $exeDevice.playerAudio.play().catch(error => console.error("Error playing audio:", error));
    },
    
    stopSound() {
        if ($exeDevice.playerAudio && typeof $exeDevice.playerAudio.pause == "function") {
            $exeDevice.playerAudio.pause();
        }
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

    drawImage: function (image, mData) {
        $(image).css({
            'position': 'absolute',
            'left': mData.x + 'px',
            'top': mData.y + 'px',
            'width': mData.w + 'px',
            'height': mData.h + 'px'
        });
    },

    addEvents: function () {
        $('#ordenaEPasteC').hide();
        $('#ordenaEAddC').on('click', function (e) {
            e.preventDefault();
            $exeDevice.addCard(true);

        });
        $('#ordenaEDeleteC').on('click', function (e) {
            e.preventDefault();
            $exeDevice.removeCard();

        });

        $('#ordenaECopyC').on('click', function (e) {
            e.preventDefault();
            $exeDevice.copyCard();

        });
        $('#ordenaECutC').on('click', function (e) {
            e.preventDefault();
            $exeDevice.cutCard();

        });
        $('#ordenaEPasteC').on('click', function (e) {
            e.preventDefault();
            $exeDevice.pasteCard();

        });
        $('#ordenaEPhrase').on('click', '.ODNE-EDatosCarta', function () {
            $exeDevice.activeID = $(this).data('id');
            $('.ODNE-EDatosCarta').removeClass('ODNE-EActive');
            $(this).addClass('ODNE-EActive');
        });
        $('#ordenaEPaste').hide();
        $('input.ODNE-GameMode').on('click', function (e) {
            $('#ordenaEDatosCarta-2').hide();
            $('#ordenaEDatosCarta-3').hide();
            var type = parseInt($(this).val());
            if (type == 1) {
                $('#ordenaEDatosCarta-2').show();
            } else if (type == 2) {
                $('#ordenaEDatosCarta-2').show();
                $('#ordenaEDatosCarta-3').show();
            }
        });

        $('#ordenaEAdd').on('click', function (e) {
            e.preventDefault();
            $exeDevice.addPhrase()
        });
        $('#ordenaEFirst').on('click', function (e) {
            e.preventDefault();
            $exeDevice.firstPhrase()
        });
        $('#ordenaEPrevious').on('click', function (e) {
            e.preventDefault();
            $exeDevice.previousPhrase();
        });
        $('#ordenaENext').on('click', function (e) {
            e.preventDefault();
            $exeDevice.nextPhrase();
        });
        $('#ordenaELast').on('click', function (e) {
            e.preventDefault();
            $exeDevice.lastPhrase()
        });
        $('#ordenaEDelete').on('click', function (e) {
            e.preventDefault();
            $exeDevice.removePhrase()
        });
        $('#ordenaECopy').on('click', function (e) {
            e.preventDefault();
            $exeDevice.copyPhrase()
        });
        $('#ordenaEPaste').on('click', function (e) {
            e.preventDefault();
            $exeDevice.pastePhrase()
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


        $('#ordenaEHasFeedBack').on('change', function () {
            var marcado = $(this).is(':checked');
            if (marcado) {
                $('#ordenaEFeedbackP').slideDown();
            } else {
                $('#ordenaEFeedbackP').slideUp();
            }
            $('#ordenaEPercentajeFB').prop('disabled', !marcado);
        });
        $('#ordenaECustomMessages').on('change', function () {
            var messages = $(this).is(':checked');
            if (messages) {
                $('.ODNE-ECustomMessageDiv').slideDown();
            } else {
                $('.ODNE-ECustomMessageDiv').slideUp();
            }
        });
        $('#ordenaEPercentajeQuestions').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 3);
            this.value = v;
            if (this.value > 0 && this.value < 101) {
                $exeDevice.updateQuestionsNumber();
            }
        });
        $('#ordenaEPercentajeQuestions').on('focusout', function () {
            this.value = this.value.trim() == '' ? 100 : this.value;
            this.value = this.value > 100 ? 100 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
            $exeDevice.updateQuestionsNumber();
        });

        $('#ordenaETime').on('focusout', function () {
            this.value = this.value.trim() == '' ? 0 : this.value;
            this.value = this.value > 999 ? 999 : this.value;
            this.value = this.value < 0 ? 0 : this.value;

        });
        //Fran Melendo: Validadores de los nuevos campos del mod:

        $('#ordenaCardHeight').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 3);
            this.value = v;
        });
        $('#ordenaCardHeight').on('focusout', function () {
            this.value = this.value.trim() == '' ? 0 : this.value;
            this.value = this.value > 1000 ? 1000 : this.value;
            this.value = this.value < 0 ? 0 : this.value;
        });
        //Fran Melendo: Fin validadores del mod
        $('#ordenaETime').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 3);
            this.value = v;
        });

        $('#ordenaEPercentajeQuestions').on('click', function () {
            $exeDevice.updateQuestionsNumber();
        });
        $('#ordenaETimeShowSolution').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 3);
            this.value = v;
        });
        $('#ordenaETimeShowSolution').on('focusout', function () {
            this.value = this.value.trim() == '' ? 3 : this.value;
            this.value = this.value > 999 ? 999 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
        });
        $('#ordenaEURLAudioDefinition').on('change', function () {
            $exeDevice.loadAudio($(this).val());
        });
        $('#ordenaEPlayAudioDefinition').on('click', function (e) {
            e.preventDefault();
            var audio = $('#ordenaEURLAudioDefinition').val();
            $exeDevice.loadAudio(audio);
        });
        $('#ordenaEURLAudioOK').on('change', function () {
            $exeDevice.loadAudio($(this).val());
        });
        $('#ordenaEPlayAudioOK').on('click', function (e) {
            e.preventDefault();
            var audio = $('#ordenaEURLAudioOK').val();
            $exeDevice.loadAudio(audio);
        });
        $('#ordenaEURLAudioKO').on('change', function () {
            $exeDevice.loadAudio($(this).val());
        });
        $('#ordenaEPlayAudioKO').on('click', function (e) {
            e.preventDefault();
            var audio = $('#ordenaEURLAudioKO').val();
            $exeDevice.loadAudio(audio);
        });
        $('#ordenaMaxWidth').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#ordenaCardHeight').prop('disabled', !marcado);
        });
        $('#gameQEIdeviceForm').css({
            'max-width': '100%'
        });
        $('#gameQEIdeviceForm').on('change', 'input.ODNE-EColumns', function (e) {

            var number = parseInt($(this).val()),
                ordered = $('#ordenaOrderedColumns').is(':checked');
            if (number == 0) {
                $('#ordenaCustomizeCard').hide();
            } else {
                $('#ordenaCustomizeCard').show();
            }

            if (number > 1) {
                $('#ordenaFixedHeaders').show();
            } else {
                $('#ordenaFixedHeaders').hide();
            }

            $exeDevice.resizePanel(ordered, number);
        });

        $('#ordenaOrderedColumns').on('change', function () {
            var number = parseInt($('input.ODNE-EColumns[name=odncolumns]:checked').val()),
                ordered = $(this).is(':checked');
            $exeDevice.resizePanel(ordered, number);

        });
        $('#ordenaEEvaluation').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#ordenaEEvaluationID').prop('disabled', !marcado);
        });
        $("#ordenaEEvaluationHelpLnk").click(function () {
            $("#ordenaEEvaluationHelp").toggle();
            return false;

        });

        var gameColumns = parseInt($('input.ODNE-EColumns[name=odncolumns]:checked').val()),
            orderedColumns = $('#ordenaOrderedColumns').is(':checked');
        $exeDevice.resizePanel(orderedColumns, gameColumns);

        $exeAuthoring.iDevice.gamification.itinerary.addEvents();
    },
    resizePanel: function (ordered, number) {
        var wd = 1100;
        if (ordered && number > 0) {
            wd = ($('div.ODNE-EDatosCarta').eq(0).width() * (number + 1)) - 100;
        }
        wd = wd < 700 ? 800 : wd;
        $('#ordenaEPhrase').width(wd)
        $('#ordenaEPhrase').css({
            'max-width': wd + 'px'
        });
        $('#gameQEIdeviceForm').css({
            'max-width': wd + 'px'
        });
        $('#gameQEIdeviceForm').width(wd);
    },
    loadImage: function (id) {
        var validExt = ['jpg', 'png', 'gif', 'jpeg', 'svg'],
            url = $('#ordenaEURLImage-' + id).val(),
            ext = url.split('.').pop().toLowerCase();
        if ((url.indexOf('resources') == 0 || url.indexOf('/previews/') == 0) && validExt.indexOf(ext) == -1) {
            $exeDevice.showMessage(_("Supported formats") + ": jpg, jpeg, gif, png, svg");
            return false;
        }
        $exeDevice.showImage(id);

    },
    loadAudio: function (url) {
        var validExt = ['mp3', 'ogg', 'waw'],
            ext = url.split('.').pop().toLowerCase();
        if ((url.indexOf('resources') == 0 || url.indexOf('/previews/') == 0) && validExt.indexOf(ext) == -1) {
            $exeDevice.showMessage(_("Supported formats") + ": jpg, jpeg, gif, png, svg");
            return false;
        } else {
            if (url.length > 4) {
                $exeDevice.stopSound();
                $exeDevice.playSound(url);
            }
        }

    },



    updateGameMode: function (feedback) {
        $('#ordenaEHasFeedBack').prop('checked', feedback);
        if (feedback) {
            $('#ordenaEFeedbackP').slideDown();
        }
        if (!feedback) {
            $('#ordenaEFeedbackP').slideUp();
        }
    },

    clearPhrase: function () {
        $('#ordenaEPhrase').empty()
    },

    addPhrase: function () {
        if ($exeDevice.phrasesGame.length >= 20) {
            $exeDevice.showMessage($exeDevice.msgs.msgPairsMax);
            return;
        }
        var valida = $exeDevice.validatePhrase();
        if (valida) {
            $exeDevice.clearPhrase();
            $exeDevice.phrasesGame.push($exeDevice.getPhraseDefault());
            $exeDevice.addCard(true);
            $exeDevice.active = $exeDevice.phrasesGame.length - 1;
            $('#ordenaENumberPhrase').text($exeDevice.phrasesGame.length);
            $exeDevice.typeEdit = -1;
            $('#ordenaEPaste').hide();
            $('#ordenaENumPhrases').text($exeDevice.phrasesGame.length);
            $('#ordenaActivityNumber').text($exeDevice.phrasesGame.length);
            $exeDevice.updateQuestionsNumber();
        }
    },


    removePhrase: function () {
        if ($exeDevice.phrasesGame.length < 2) {
            $exeDevice.showMessage($exeDevice.msgs.msgEOneQuestion);
        } else {
            $exeDevice.phrasesGame.splice($exeDevice.active, 1);
            if ($exeDevice.active >= $exeDevice.phrasesGame.length - 1) {
                $exeDevice.active = $exeDevice.phrasesGame.length - 1;
            }
            $exeDevice.showPhrase($exeDevice.active);
            $exeDevice.typeEdit = -1;
            $('#ordenaEPaste').hide();
            $('#ordenaENumPhrases').text($exeDevice.phrasesGame.length);
            $('#ordenaENumberPhrase').text($exeDevice.active + 1);
            $('#ordenaActivityNumber').text($exeDevice.active + 1);
            $exeDevice.updateQuestionsNumber();
        }
    },

    copyPhrase: function () {
        if ($exeDevice.validatePhrase()) {
            $exeDevice.typeEdit = 0;
            $exeDevice.clipBoard = $exeDevice.phrasesGame[$exeDevice.active];
            $('#ordenaEPaste').show();
        }

    },

    cutPhrase: function () {
        if ($exeDevice.validatePhrase()) {
            $exeDevice.numberCutCuestion = $exeDevice.active;
            $exeDevice.typeEdit = 1;
            $('#ordenaEPaste').show();
        }
    },

    arrayMove: function (arr, oldIndex, newIndex) {
        if (newIndex >= arr.length) {
            var k = newIndex - arr.length + 1;
            while (k--) {
                arr.push(undefined);
            }
        }
        arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
    },

    pastePhrase: function () {
        if ($exeDevice.phrasesGame.length >= 20) {
            $exeDevice.showMessage($exeDevice.msgs.msgPairsMax);
            return;
        }
        if ($exeDevice.typeEdit == 0) {
            $exeDevice.active++;
            var p = $.extend(true, {}, $exeDevice.clipBoard);
            $exeDevice.phrasesGame.splice($exeDevice.active, 0, p);
            $exeDevice.showPhrase($exeDevice.active);
            $('#ordenaENumPhrases').text($exeDevice.phrasesGame.length);
        } else if ($exeDevice.typeEdit == 1) {
            $('#ordenaEPaste').hide();
            $exeDevice.typeEdit = -1;
            $exeDevice.arrayMove($exeDevice.phrasesGame, $exeDevice.numberCutCuestion, $exeDevice.active);
            $exeDevice.showPhrase($exeDevice.active);
            $('#ordenaENumPhrases').text($exeDevice.phrasesGame.length);
            $('#ordenaENumberPhrase').text($exeDevice.active + 1);
            $exeDevice.updateQuestionsNumber();
        }
    },

    nextPhrase: function () {
        if ($exeDevice.validatePhrase()) {
            if ($exeDevice.active < $exeDevice.phrasesGame.length - 1) {
                $exeDevice.active++;
                $exeDevice.showPhrase($exeDevice.active);
            }
        }
    },

    lastPhrase: function () {
        if ($exeDevice.validatePhrase()) {
            if ($exeDevice.active < $exeDevice.phrasesGame.length - 1) {
                $exeDevice.active = $exeDevice.phrasesGame.length - 1;
                $exeDevice.showPhrase($exeDevice.active);
            }
        }
    },

    previousPhrase: function () {
        if ($exeDevice.validatePhrase()) {
            if ($exeDevice.active > 0) {
                $exeDevice.active--;
                $exeDevice.showPhrase($exeDevice.active);
            }
        }
    },

    firstPhrase: function () {
        if ($exeDevice.validatePhrase()) {
            if ($exeDevice.active > 0) {
                $exeDevice.active = 0;
                $exeDevice.showPhrase($exeDevice.active);
            }
        }
    },

    updateFieldGame: function (game) {
        $exeDevice.active = 0;
        $exeAuthoring.iDevice.gamification.itinerary.setValues(game.itinerary);
        game.maxWidth = typeof game.maxWidth == "undefined" ? false : game.maxWidth;
        game.orderedColumns = typeof game.orderedColumns == "undefined" ? false : game.orderedColumns;
        game.cardHeight = typeof game.cardHeight == "undefined" ? 200 : game.cardHeight;
        game.startAutomatically = typeof game.startAutomatically == "undefined" ? false : game.startAutomatically;
        game.evaluation = typeof game.evaluation != "undefined" ? game.evaluation : false;
        game.evaluationID = typeof game.evaluationID != "undefined" ? game.evaluationID : '';
        $exeDevice.id = typeof game.id != "undefined" ? game.id : false;

        $('#ordenaEShowMinimize').prop('checked', game.showMinimize);
        $('#ordenaECaseSensitive').prop('checked', game.caseSensitive);
        $("#ordenaEHasFeedBack").prop('checked', game.feedBack);
        $("#ordenaEPercentajeFB").val(game.percentajeFB);
        $('#ordenaEPercentajeQuestions').val(game.percentajeQuestions);
        $('#ordenaETime').val(game.time);
        $('#ordenaETimeShowSolution').val(game.timeShowSolution);
        $('#ordenaEAuthor').val(game.author);
        $('#ordenaEShowSolution').prop('checked', game.showSolution);
        $exeAuthoring.iDevice.gamification.scorm.setValues(game.isScorm, game.textButtonScorm, game.repeatActivity);
        $exeDevice.phrasesGame = game.phrasesGame;
        $exeDevice.updateGameMode(game.feedBack);
        $('#ordenaENumPhrases').text($exeDevice.phrasesGame.length);
        $('#ordenaEPercentajeFB').prop('disabled', !game.feedBack);
        $('#ordenaECustomMessages').prop('checked', game.customMessages);
        $("input.ODNE-EColumns[name='odncolumns'][value='" + game.gameColumns + "']").prop("checked", true);
        $exeDevice.updateQuestionsNumber();
        $('#ordenaCardHeight').val(game.cardHeight); //Fran Melendo: 
        $('#ordenaCardHeight').prop('disabled', !game.maxWidth);
        $('#ordenaStartAutomatically').prop('checked', game.startAutomatically); //Fran Melendo:
        $('#ordenaMaxWidth').prop('checked', game.maxWidth);
        $('#ordenaOrderedColumns').prop('checked', game.orderedColumns);
        $('#ordenaEEvaluation').prop('checked', game.evaluation);
        $('#ordenaEEvaluationID').val(game.evaluationID);
        $("#ordenaEEvaluationID").prop('disabled', (!game.evaluation));
   
        if (game.customMessages) {
            $('.ODNE-ECustomMessageDiv').slideDown();
        } else {
            $('.ODNE-ECustomMessageDiv').slideUp();
        }
        if (game.gameColumns > 0) {
            $('#ordenaCustomizeCard').show();

        } else {
            $('#ordenaCustomizeCard').hide();
        }
        if (game.gameColumns > 1) {
            $('#ordenaFixedHeaders').show();
        } else {
            $('#ordenaFixedHeaders').hide();
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
        link.download = _("Game") + "Ordena.json";
        document.getElementById('gameQEIdeviceForm').appendChild(link);
        link.click();
        setTimeout(function () {
            document.getElementById('gameQEIdeviceForm').removeChild(link);
            window.URL.revokeObjectURL(data);
        }, 100);
    },

    importGame: function (content) {
        var game = $exeDevice.isJsonString(content);
        if (!game || typeof game.typeGame == "undefined") {
            eXe.app.alert($exeDevice.msgs.msgESelectFile);
            return;
        } else if (game.typeGame !== 'Ordena') {
            eXe.app.alert($exeDevice.msgs.msgESelectFile);
            return;
        }
        game.id = $exeDevice.generarID();
        $exeDevice.updateFieldGame(game);
        var instructions = game.instructionsExe || game.instructions,
            tAfter = game.textAfter || "",
            textFeedBack = game.textFeedBack || "";
        tinyMCE.get('eXeGameInstructions').setContent(unescape(instructions));
        tinyMCE.get('eXeIdeviceTextAfter').setContent(unescape(tAfter));
        tinyMCE.get('ordenaEFeedBackEditor').setContent(unescape(textFeedBack));
        $('.exe-form-tabs li:first-child a').click();
        $exeDevice.showPhrase(0, false);
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

    hourToSeconds: function (str) {
        var i = str.split(':');
        if (i.length == 0) {
            return 0;
        } else if (i.length == 1) {
            i = '00:00:' + i[0];
            i = i.split(':');
        } else if (i.length == 2) {
            i = '00:' + i[0] + ':' + i[1];
            i = i.split(':');
        }
        return (+i[0]) * 60 * 60 + (+i[1]) * 60 + (+i[2]);
    },

    secondsToHour: function (totalSec) {
        var time = Math.round(totalSec),
            hours = parseInt(time / 3600) % 24,
            minutes = parseInt(time / 60) % 60,
            seconds = time % 60;
        return (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
    },

    validTime: function (time) {
        var reg = /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/;
        return (time.length == 8 && reg.test(time))
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
        };

    },

    clickImage: function (id, epx, epy) {
        var $cursor = $('#ordenaECursor-' + id),
            $image = $('#ordenaEImage-' + id),
            $x = $('#ordenaEX-' + id),
            $y = $('#ordenaEY-' + id);
        var posX = epx - $image.offset().left,
            posY = epy - $image.offset().top,
            wI = $image.width() > 0 ? $image.width() : 1,
            hI = $image.height() > 0 ? $image.height() : 1,
            lI = $image.position().left,
            tI = $image.position().top;
        $x.val(posX / wI);
        $y.val(posY / hI);
        $cursor.css({
            left: posX + lI,
            top: posY + tI,
            'z-index': 3000
        });
        $cursor.show();
    },
    removeTags: function (str) {
        var wrapper = $("<div></div>");
        wrapper.html(str);
        return wrapper.text();
    },
    extractURLGD: function (urlmedia) {
        urlmedia = urlmedia || '';
        var sUrl = urlmedia || '';
        if (urlmedia.toLowerCase().indexOf("https://drive.google.com") == 0 && urlmedia.toLowerCase().indexOf("sharing") != -1) {
            sUrl = sUrl.replace(/https:\/\/drive\.google\.com\/file\/d\/(.*?)\/.*?\?usp=sharing/g, "https://docs.google.com/uc?export=open&id=$1");
        }
        return sUrl;
    }

}