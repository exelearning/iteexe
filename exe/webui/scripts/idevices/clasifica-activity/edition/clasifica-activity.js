/**
/**
 * Clasifica Activity iDevice (edition code)
 * Version: 0.8
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Manuel Narvaez Martinez
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $exeDevice = {
    i18n: {
        category: _('Games'),
        name: _('Clasifica')
    },
    msgs: {},
    active: 0,
    wordsGame: [],
    groups: [_('Grupo') + ' ' + 1, _('Grupo') + ' ' + 2, _('Grupo') + ' ' + 3, _('Grupo') + ' ' + 4],
    numberGroups: 2,
    typeEdit: -1,
    numberCutCuestion: -1,
    clipBoard: '',
    iDevicePath: "/scripts/idevices/clasifica-activity/edition/",
    playerAudio: "",
    playerAudio: "",
    isVideoType: false,
    numberCards: 3,
    version: 0.8,
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
        "msgFullScreen": _("Full Screen"),
        "msgExitFullScreen": _("Exit Full Screen"),
        "msgNumQuestions": _("Number of questions"),
        "msgNoImage": _("No picture question"),
        "msgCool": _("Cool!"),
        "msgSuccesses": _("Right! | Excellent! | Great! | Very good! | Perfect!"),
        "msgFailures": _("It was not that! | Incorrect! | Not correct! | Sorry! | Error!"),
        "msgTryAgain": _("You need at least %s&percnt; of correct answers to get the information. Please try again."),
        "msgEndGameScore": _("Please start the game before saving your score."),
        "msgScoreScorm": _("The score can't be saved because this page is not part of a SCORM package."),
        "msgOnlySaveScore": _("You can only save the score once!"),
        "msgOnlySave": _("You can only save once"),
        "msgInformation": _("Information"),
        "msgYouScore": _("Your score"),
        "msgAuthor": _("Authorship"),
        "msgOnlySaveAuto": _("Your score will be saved after each question. You can only play once."),
        "msgSaveAuto": _("Your score will be automatically saved after each question."),
        "msgYouScore": _("Your score"),
        "msgSeveralScore": _("You can save the score as many times as you want"),
        "msgYouLastScore": _("The last score saved is"),
        "msgActityComply": _("You have already done this activity."),
        "msgPlaySeveralTimes": _("You can do this activity as many times as you want"),
        "msgClose": _("Close"),
        "msgAudio": _("Audio"),
        "msgYes": _("Yes"),
        "msgNo": _("No"),
        "msgTimeOver": _("Tu tiempo ha finalizado. Inténtalo de nuevo"),
        "mgsGameStart": _("¡El juego ha comenzado! Arrastra cada tarjeta hasta su contenedor"),
        "msgSelectCard": _("Selecciona otra tarjeta"),
        "msgSelectCardOne": _("Selecciona una tarjeta"),
        "msgReboot": _("Reiniciar"),
        "msgTestPassed": _("¡Genial! ¡Prueba superada!"),
        "msgTestFailed": _("No has superado la prueba. Inténtalo de nuevo"),
        "msgRebootGame": _("¿Deseas reiniciar esta partida?"),
        "msgContinue": _("Continuar"),
        "msgShowAnswers": _("Comprobar resultados"),
        "msgUnansweredQuestions": _("Te han quedado %s tarjetas por colocar correctamente. ¿Quieres intentarlo de nuevo?"),
        "msgAllCorrect": _("¡Genial! ¡Todo perfecto!"),
        "msgTooManyTries": _("¡Estupendo! Has resuelto esta actividad en %s intentos. ¡Seguro que puedes hacerlo más rápido!"),
        "msgQ5": _("No has colocado %s tarjetas en su lugar. ¡Inténtalo de nuevo!"),
        "msgQ7": _("¡Estupendo! Has clasificado correctamente la mayor parte de las tarjetas, %s, pero aún puedes mejorar"),
        "msgQ9": _("¡Magnífico! Tan sólo te han quedado %s tarjetas por colocar correctamente. Busca la perfección"),
        "msgSaveGameAuto": _("Su puntuación se guardará automáticamente al finalizar el juego."),
        "msgOnlySaveGameAuto": _("Su puntuación se guardará automáticamente al finalizar el juego. Sólo puedes jugar una vez."),
        "msgEndGamerScore": _("Sólo puedes guardar tu puntuación tras finalizar la partida."),
        "msgUncompletedActivity": _("Actividad no realizada"),
        "msgSuccessfulActivity": _("Actividad superada. Puntuación: %s"),
        "msgUnsuccessfulActivity": _("Actividad no superada. Puntuación: %s"),
    },
    init: function () {
        this.ci18n.msgTryAgain = this.ci18n.msgTryAgain.replace("&percnt;", "%"); // Avoid invalid HTML
        this.setMessagesInfo();
        this.createForm();

    },
    setMessagesInfo: function () {
        var msgs = this.msgs;
        msgs.msgESelectFile = _("The selected file does not contain a valid game");
        msgs.msgEOneQuestion = _("Please provide at least one question");
        msgs.msgProvideFB = _('Message to display when passing the game');
        msgs.msgNoSuportBrowser = _("Your browser is not compatible with this tool.");
        msgs.msgCompleteData = _("Debes indicar una imagen, un texto o/y un audio para cada tarjeta");
        msgs.msgPairsMax = _("Número máximo tarjetas a clasificar 25");
        msgs.msgCompleteBoth = _("Debes indicar una imagen y un texto para esta tarjeta");
        msgs.msgCompleteText = _("Debes indicar un texto o sonido para esta tarjeta");
        msgs.msgCompleteImage = _("Debes indicar una imagen o sonido para esta tarjeta");
        msgs.msgIDLenght = _('El identificador del informe debe tener al menos 5 caracteres');

    },
    createForm: function () {
        var path = $exeDevice.iDevicePath,
            html = '\
            <div id="gameQEIdeviceForm">\
            <div class="exe-idevice-info">' + _("Crea actividades interactivas en las que los jugadores tendrán que clasificar tarjetas con imágenes, textos y/o sonidos.") + ' <a href="https://youtu.be/f0cv7ouY2qc" hreflang="es" rel="lightbox"  target="_blank">' + _("Use Instructions") + '</a></div>\
            <div class="exe-form-tab" title="' + _('General settings') + '">\
            ' + $exeAuthoring.iDevice.gamification.instructions.getFieldset(_("Arrastra cada tarjeta hasta su contendor.")) + '\
                <fieldset class="exe-fieldset exe-fieldset-closed">\
                    <legend><a href="#">' + _("Options") + '</a></legend>\
                    <div>\
                        <p>\
                            <span>' + _("Nivel de dificultad") + ':</span>\
                            <input class="CQE-ELevel"  id="clasificaL1" type="radio" name="qtxgamelevel" value="0"  />\
                            <label for="clasificaL1">' + _('Básico') + '</label>\
                            <input class="CQE-ELevel" id="clasificaL2" type="radio" name="qtxgamelevel" value="1"  />\
                            <label for="clasificaL2">' + _('Medio') + '</label>\
                            <input class="CQE-ELevel" checked id="clasificaL3" type="radio" name="qtxgamelevel" value="2"  />\
                            <label for="clasificaL3">' + _('Avanzado') + '</label>\
                        </p>\
                        <p>\
                            <label for="clasificaECustomMessages"><input type="checkbox" id="clasificaECustomMessages">' + _("Mensajes personalizados") + '.</label>\
                        </p>\
                        <p>\
                        <span class="CQE-EInputMedias">\
                            <span>' + _("Número de categorías") + ':</span>\
                            <input class="CQE-Number" checked="checked" id="quextNumber2" type="radio" name="qxtnumber" value="2" />\
                            <label for="quextNumber2">' + _("2") + '</label>\
                            <input class="CQE-Number"  id="quextNumber3" type="radio" name="qxtnumber" value="3" />\
                            <label for="quextNumber3">' + _("3") + '</label>\
                            <input class="CQE-Number"  id="quextNumber4" type="radio" name="qxtnumber" value="4" />\
                            <label for="quextNumber4">' + _("4") + '</label>\
                        </span>\
                        </p>\
                        <p>\
                            <label for="clasificaTitle0">' + _("Categoría") + ' 1:</label><input type="text"  id="clasificaTitle0" class="CQE-EGroup" value="' + _('Grupo') + ' 1"/>\
                        </p>\
                        <p >\
                            <label for="clasificaTitle1">' + _("Categoría") + ' 2:</label><input type="text"  id="clasificaTitle1" class="CQE-EGroup"  value="' + _('Grupo') + ' 2"/>\
                        </p>\
                        <p>\
                            <label for="clasificaTitle2">' + _("Categoría") + ' 3:</label><input type="text"  id="clasificaTitle2" class="CQE-EGroup" value="' + _('Grupo') + ' 3"/>\
                        </p>\
                        <p >\
                            <label for="clasificaTitle3">' + _("Categoría") + ' 4:</label><input type="text"  id="clasificaTitle3" class="CQE-EGroup"  value="' + _('Grupo') + ' 3"/>\
                        </p>\
                        <p>\
                            <label for="clasificaEShowMinimize"><input type="checkbox" id="clasificaEShowMinimize">' + _("Show minimized.") + '</label>\
                        </p>\
                        <p>\
                        <label for="clasificaETime">' + _("Tiempo") + '(m):</label><input type="number" name="clasificaETime" id="clasificaETime" value="0" min="0" max="120" step="1" />\
                        </p>\
                        <p>\
                            <label for="clasificaEHasFeedBack"><input type="checkbox"  id="clasificaEHasFeedBack"> ' + _("Feedback") + '. </label> \
                            <label for="clasificaEPercentajeFB"></label><input type="number" name="clasificaEPercentajeFB" id="clasificaEPercentajeFB" value="100" min="5" max="100" step="5" disabled />\
                        </p>\
                        <p id="clasificaEFeedbackP" class="CQE-EFeedbackP">\
                            <textarea id="clasificaEFeedBackEditor" class="exe-html-editor"></textarea>\
                        </p>\
                        <p>\
                            <label for="clasificaEPercentajeQuestions">% Preguntas:</label><input type="number" name="clasificaEPercentajeQuestions" id="clasificaEPercentajeQuestions" value="100" min="1" max="100" />\
                            <span id="clasificaENumeroPercentaje">1/1</span>\
                        </p>\
                        <p>\
                            <label for="clasificaEAuthor">' + _("Authorship") + ': </label><input id="clasificaEAuthor" type="text" />\
                        </p>\
                        <p>\
                            <strong class="GameModeLabel"><a href="#clasificaEEvaluationHelp" id="clasificaEEvaluationHelpLnk" class="GameModeHelpLink" title="' + _("Help") + '"><img src="' + path + 'quextIEHelp.gif"  width="16" height="16" alt="' + _("Help") + '"/></a></strong>\
							<label for="clasificaEEvaluation"><input type="checkbox" id="clasificaEEvaluation"> ' + _("Informe de progreso") + '. </label> \
							<label for="clasificaEEvaluationID">' + _("Identificador") + ':\
							<input type="text" id="clasificaEEvaluationID" disabled/> </label>\
                        </p>\
                        <div id="clasificaEEvaluationHelp" class="CQE-TypeGameHelp">\
                            <p>' +_("Debes indicar el identificador, puede ser una palabra, una frase o un número de más de cuatro caracteres, que utilizarás para marcar las actividades que serán tenidas en cuenta en este informe de progreso.</p><p> Debe ser <strong>el mismo </strong> en todos los idevices de un informe y diferente en los de cada informe.</p>") + '</p>\
                        </div>\
                    </div>\
                </fieldset>\
                <fieldset class="exe-fieldset">\
                <legend><a href="#">' +_("Cards") + '</a></legend>\
                <div class="CQE-EPanel">\
                    <div class="CQE-Data">\
                        ' + $exeDevice.createCards(1) + '\
                        <div class="CQE-EOrders CQE-Hide" id="clasificaEOrder">\
                            <div class="CQE-ECustomMessage">\
                                <span class="sr-av">' + _("Hit") + '</span><span class="CQE-EHit"></span>\
                                <label for="clasificaEMessageOK">Mensaje:</label><input type="text" class=""  id="clasificaEMessageOK">\
                            </div>\
                            <div class="CQE-ECustomMessage">\
                                <span class="sr-av">' + _("Error") + '</span><span class="CQE-EError"></span>\
                                <label for="clasificaEMessageKO">Mensaje:</label><input type="text" class=""  id="clasificaEMessageKO">\
                            </div>\
                       </div>\
                        <div class="CQE-ENumQuestionDiv" id="clasificaENumQuestionDiv">\
                            <div class="CQE-ENumQ"><span class="sr-av">Pregunta</span></div> <span class="CQE-ENumQuestions" id="clasificaENumQuestions">0</span>\
                        </div>\
                    </div>\
                    <div class="CQE-EContents">\
                        <div class="CQE-ENavigationButtons">\
                            <a href="#" id="clasificaEAdd" class="CQE-ENavigationButton" title="' + _('Add question') + '"><img src="' + path + 'quextIEAdd.png"  alt="' + _('Add question') + '" class="CQE-EButtonImage b-add" /></a>\
                            <a href="#" id="clasificaEFirst" class="CQE-ENavigationButton"  title="' + _('First question') + '"><img src="' + path + 'quextIEFirst.png"  alt="' + _('First question') + '" class="CQE-EButtonImage b-first" /></a>\
                            <a href="#" id="clasificaEPrevious" class="CQE-ENavigationButton" title="' + _('Previous question') + '"><img src="' + path + 'quextIEPrev.png" alt="' + _('Previous question') + '" class="CQE-EButtonImage b-prev" /></a>\
                            <span class="sr-av">' + _("Question number:") + '</span><span class="CQE-NumberQuestion" id="clasificaENumberQuestion">1</span>\
                            <a href="#" id="clasificaENext" class="CQE-ENavigationButton"  title="' + _('Next question') + '"><img src="' + path + 'quextIENext.png" alt="' + _('Next question') + '" class="CQE-EButtonImage b-next" /></a>\
                            <a href="#" id="clasificaELast" class="CQE-ENavigationButton"  title="' + _('Last question') + '"><img src="' + path + 'quextIELast.png" alt="' + _('Last question') + '" class="CQE-EButtonImage b-last" /></a>\
                            <a href="#" id="clasificaEDelete" class="CQE-ENavigationButton" title="' + _('Delete question') + '"><img src="' + path + 'quextIEDelete.png" alt="' + _('Delete question') + '" class="CQE-EButtonImage b-delete" /></a>\
                            <a href="#" id="clasificaECopy" class="CQE-ENavigationButton" title="' + _('Copy question') + '"><img src="' + path + 'quextIECopy.png" + alt="' + _('Copy question') + '" class="CQE-EButtonImage b-copy" /></a>\
                            <a href="#" id="clasificaEPaste" class="CQE-ENavigationButton"  title="' + _('Paste question') + '"><img src="' + path + 'quextIEPaste.png" alt="' + _('Paste question') + '" class="CQE-EButtonImage b-paste" /></a>\
                        </div>\
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
    createCards: function (num) {
        var cards = '',
            path = $exeDevice.iDevicePath;
        for (var i = 0; i < num; i++) {
            var card = '<div class="CQE-DatosCarta" id="clasificaEDatosCarta">\
           <p class="CQE-ECardHeader">\
               <span>\
                  <span>Tipo:</span>\
                   <input class="CQE-Type" checked id="clasificaEMediaImage" type="radio" name="qxtmediatype" value="0"  />\
                   <label for="clasificaEMediaImage">' + _("Image") + '</label>\
                   <input class="CQE-Type"  id="clasificaEMediaText" type="radio" name="qxtmediatype" value="1"  />\
                   <label for="clasificaEMediaText">' + _("Text") + '</label>\
                   <input class="CQE-Type"  id="clasificaEMediaBoth" type="radio" name="qxtmediatype" value="2"  />\
                   <label for="clasificaEMediaBoth">' + _("Ambos") + '</label>\
                </span>\
                    <span>\
                    <label for="=clasificaEGroupSelect">' + _('Grupo') + ':</label>\
                    <select id="clasificaEGroupSelect">\
                        <option value="0">' + _('Grupo') + ' 1</option>\
                        <option value="1">' + _('Grupo') + ' 2</option>\
                        <option value="2">' + _('Grupo') + ' 2</option>\
                        <option value="3">' + _('Grupo') + ' 3</option>\
                    </select>\
                </span>\
           </p>\
           <div class="CQE-EMultimedia" id="clasificaEMultimedia">\
                <div class="CQE-Card">\
                    <img class="CQE-Hide CQE-Image" src="' + path + "quextIEImage.png" + '" id="clasificaEImage" alt="' + _("No image") + '" />\
                    <img class="CQE-ECursor" src="' + path + 'quextIECursor.gif" id="clasificaECursor" alt="" />\
                    <img class="CQE-Hide CQE-Image" src="' + path + "quextIEImage.png" + '" id="clasificaENoImage" alt="' + _("No image") + '" />\
                    <div  id="clasificaETextDiv" class="CQE-ETextDiv"></div>\
                </div>\
            </div>\
           <span class="CQE-ETitleText" id="clasificaETitleText">' + _("Text") + '</span>\
           <div class="CQE-EInputImage" id="clasificaEInputText">\
                <label for="clasificaEText" class="sr-av">' + _("Text") + '</label><input id="clasificaEText" type="text" />\
                <label for="clasificaEColor">' + _("Fuente") + ': </label><input type="color" id="clasificaEColor" name="clasificaEColor" value="#000000">\
                <label for="clasificaEBackColor">' + _("Fondo") + ': </label><input type="color" id="clasificaEBackColor" name="clasificaEBackColor" value="#ffffff">\
            </div>\
           <span class="CQE-ETitleImage" id="clasificaETitleImage">' + _("Image") + '</span>\
           <div class="CQE-EInputImage" id="clasificaEInputImage">\
               <label class="sr-av" for="clasificaEURLImage">URL</label>\
               <input type="text" class="exe-file-picker CQE-EURLImage"  id="clasificaEURLImage"/>\
               <a href="#" id="clasificaEPlayImage" class="CQE-ENavigationButton CQE-EPlayVideo" title="' + _("Show") + '"><img src="' + path + 'quextIEPlay.png" alt="' + _("Show") + '" class="CQE-EButtonImage b-play" /></a>\
               <a href="#" id="clasificaShowAlt" class="CQE-ENavigationButton CQE-EPlayVideo" title="' + _("More") + '"><img src="' + path + 'quextEIMore.png" alt="' + _("More") + '" class="CQE-EButtonImage b-play" /></a>\
           </div>\
           <div class="CQE-ECoord">\
                   <label for="clasificaEXImage">X:</label>\
                   <input id="clasificaEXImage" type="text" value="0" />\
                   <label for="clasificaEXImage">Y:</label>\
                   <input id="clasificaEYImage" type="text" value="0" />\
           </div>\
           <div class="CQE-EAuthorAlt" id="clasificaEAuthorAlt">\
               <div class="CQE-EInputAuthor" id="clasificaEInputAuthor">\
                   <label for="clasificaEAuthor">' + _("Author") + '</label><input id="clasificaEAuthor" type="text" />\
               </div>\
               <div class="CQE-EInputAlt" id="clasificaEInputAlt">\
                   <label for="clasificaEAlt">' + _("Texto alternativo") + '</label><input id="clasificaEAlt" type="text" />\
               </div>\
           </div>\
           <span id="clasificaETitleAudio">' + _("Audio") + '</span>\
           <div class="CQE-EInputAudio" id="clasificaEInputAudio">\
               <label class="sr-av" for="clasificaEURLAudio">URL</label>\
               <input type="text" class="exe-file-picker CQE-EURLAudio"  id="clasificaEURLAudio"/>\
               <a href="#" id="clasificaEPlayAudio" class="CQE-ENavigationButton CQE-EPlayVideo" title="' + _("Audio") + '"><img src="' + path + 'quextIEPlay.png" alt="Play" class="CQE-EButtonImage b-play" /></a>\
           </div>\
       </div>';
            cards += card;

        }

        return cards;

    },
    enableForm: function (field) {
        $exeDevice.initQuestions();
        $exeDevice.loadPreviousValues(field);
        $exeDevice.addEvents();
    },
    updateQuestionsNumber: function () {
        var percentaje = parseInt($exeDevice.removeTags($('#clasificaEPercentajeQuestions').val()));
        if (isNaN(percentaje)) {
            return;
        }
        percentaje = percentaje < 1 ? 1 : percentaje;
        percentaje = percentaje > 100 ? 100 : percentaje;
        var num = Math.round((percentaje * $exeDevice.wordsGame.length) / 100);
        num = num == 0 ? 1 : num;
        $('#clasificaENumeroPercentaje').text(num + "/" + $exeDevice.wordsGame.length)
    },
    showQuestion: function (i) {
        var num = i < 0 ? 0 : i;
        num = num >= $exeDevice.wordsGame.length ? $exeDevice.wordsGame.length - 1 : num;
        var p = $exeDevice.wordsGame[num];
        $exeDevice.changeTypeQuestion(p.type);
        $('#clasificaEURLImage').val(p.url);
        $('#clasificaEXImage').val(p.x);
        $('#clasificaEYImage').val(p.y);
        $('#clasificaEAuthor').val(p.author);
        $('#clasificaEAlt').val(p.alt);
        $('#clasificaEText').val(p.eText)
        $('#clasificaETextDiv').text(p.eText);
        $('#clasificaEColor').val(p.color);
        $('#clasificaEBackColor').val(p.backcolor);
        if (p.type == 0 || p.type == 2) {
            $exeDevice.showImage(p.url, p.x, p.y, p.alt);
        }
        if (p.type == 1) {
            $('#clasificaETextDiv').css({
                'color': p.color,
                'background-color': p.backcolor,
            })
        } else if (p.type == 2) {
            $('#clasificaETextDiv').css({
                'color': '#000',
                'background-color': 'rgba(255, 255, 255, 0.7)'
            })
        }
        $('#clasificaEGroupSelect').val(p.group);
        $('#clasificaEURLAudio').val(p.audio);
        $('#clasificaEMessageOK').val(p.msgHit);
        $('#clasificaEMessageKO').val(p.msgError);
        $('#clasificaENumberQuestion').text(i + 1);
        $exeDevice.stopSound();
    },

    initQuestions: function () {
        $('#clasificaEInputImage').css('display', 'flex');
        $("#clasificaEMediaImage").prop("disabled", false);
        $("#clasificaEMediaText").prop("disabled", false);
        $("#clasificaEMediaBoth").prop("disabled", false);
        $('#clasificaEAuthorAlt').hide();

        if ($exeDevice.wordsGame.length == 0) {
            var question = $exeDevice.getCuestionDefault();
            $exeDevice.wordsGame.push(question);
            this.changeTypeQuestion(0)
        }
        this.active = 0;
    },

    changeTypeQuestion: function (type) {
        var p = $exeDevice.wordsGame[$exeDevice.active]
        $('#clasificaETitleAltImage').hide();
        $('#clasificaETitleImage').hide();
        $('#clasificaEInputImage').hide();
        $('#clasificaEImage').hide();
        $('#clasificaECover').hide();
        $('#clasificaECursor').hide();
        $('#clasificaENoImage').hide();
        $('#clasificaETextDiv').hide();
        $('#clasificaETitleText').hide();
        $('#clasificaEInputText').hide();
        $("input[name='qxtmediatype'][value='" + type + "']").prop("checked", true);
        switch (type) {
            case 0:
                $('#clasificaEImage').show();
                $('#clasificaETitleImage').show();
                $('#clasificaEInputImage').show();
                $exeDevice.showImage($('#clasificaEURLImage').val(), $('#clasificaEXImage').val(), $('#clasificaEYImage').val(), $('#clasificaEAlt').val())
                break;
            case 1:
                $('#clasificaETextDiv').show();
                $('#clasificaETitleText').show();
                $('#clasificaEInputText').show();
                $('#clasificaEColor').show();
                $('#clasificaEBackColor').show();
                $('label[for=clasificaEBackColor]').show();
                $('label[for=clasificaEColor]').show();
                $('#clasificaEAuthorAlt').hide();
                $('#clasificaETextDiv').css({
                    'color': $('#clasificaEColor').val(),
                    'background-color': $('#clasificaEBackColor').val()
                })
                break;
            case 2:
                $('#clasificaETitleAltImage').show();
                $('#clasificaETitleImage').show();
                $('#clasificaEInputImage').show();
                $('#clasificaEImage').show();
                $('#clasificaECover').show();
                $('#clasificaECursor').show();
                $('#clasificaENoImage').show();
                $('#clasificaETextDiv').show();
                $('#clasificaETitleText').show();
                $('#clasificaEInputText').show();
                $('#clasificaEColor').hide();
                $('#clasificaEBackColor').hide();
                $('label[for=clasificaEBackColor]').hide();
                $('label[for=clasificaEColor]').hide();
                $('#clasificaETextDiv').css({
                    'color': '#000',
                    'background-color': 'rgba(255, 255, 255, 0.7)'
                });
                break;
            default:
                break;
        }
    },

    getCuestionDefault: function () {
        var p = new Object();
        p.type = 0;
        p.url = '';
        p.audio = "";
        p.x = 0;
        p.y = 0;
        p.author = '';
        p.alt = '';
        p.eText = '';
        p.type1 = 0;
        p.msgError = '';
        p.msgHit = '';
        p.group = 0;
        p.color = '#000';
        p.backcolor = '#fff';
        return p;
    },
    loadPreviousValues: function (field) {
        var originalHTML = field.val();
        if (originalHTML != '') {
            var wrapper = $("<div></div>");
            wrapper.html(originalHTML);
            var json = $('.clasifica-DataGame', wrapper).text();
            json = $exeDevice.Decrypt(json);
            var dataGame = $exeDevice.isJsonString(json),
                $imagesLink = $('.clasifica-LinkImages', wrapper),
                $audiosLink = $('.clasifica-LinkAudios', wrapper);
            $imagesLink.each(function () {
                var iq = parseInt($(this).text());
                if (!isNaN(iq) && iq < dataGame.wordsGame.length) {
                    dataGame.wordsGame[iq].url = $(this).attr('href');
                    if (dataGame.wordsGame[iq].url.length < 4 && dataGame.wordsGame[iq].type == 1) {
                        dataGame.wordsGame[iq].url = "";
                    }
                }
            });
            $audiosLink.each(function () {
                var iq = parseInt($(this).text());
                if (!isNaN(iq) && iq < dataGame.wordsGame.length) {
                    dataGame.wordsGame[iq].audio = $(this).attr('href');
                    if (dataGame.wordsGame[iq].audio.length < 4) {
                        dataGame.wordsGame[iq].audio = "";
                    }
                }
            });
            $exeDevice.updateFieldGame(dataGame);
            var instructions = $(".clasifica-instructions", wrapper);
            if (instructions.length == 1) {
                instructions = instructions.html() || ''
                if (tinyMCE.get('eXeGameInstructions')) {
                    tinyMCE.get('eXeGameInstructions').setContent(instructions);
                } else {
                    $("#eXeGameInstructions").val(instructions)
                }
            }
            var textFeedBack = $(".clasifica-feedback-game", wrapper);
            if (textFeedBack.length == 1) {
                textFeedBack = textFeedBack.html() || ''
                if (tinyMCE.get('clasificaEFeedBackEditor')) {
                    tinyMCE.get('clasificaEFeedBackEditor').setContent(textFeedBack);
                } else {
                    $("#clasificaEFeedBackEditor").val(textFeedBack)
                }
            }
            var textAfter = $(".clasifica-extra-content", wrapper);
            if (textAfter.length == 1) {
                textAfter = textAfter.html() || ''
                if (tinyMCE.get('eXeIdeviceTextAfter')) {
                    tinyMCE.get('eXeIdeviceTextAfter').setContent(textAfter);
                } else {
                    $("#eXeIdeviceTextAfter").val(textAfter)
                }
            }
            $exeAuthoring.iDevice.gamification.common.setLanguageTabValues(dataGame.msgs);
            $exeDevice.showQuestion(0);
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
        if (!$exeDevice.validateQuestion()) {
            return false;
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
        var textFeedBack = tinyMCE.get('clasificaEFeedBackEditor').getContent();
        if (dataGame.instructions != "") divContent = '<div class="clasifica-instructions">' + dataGame.instructions + '</div>';
        var linksImages = $exeDevice.createlinksImage(dataGame.wordsGame),
            linksAudios = $exeDevice.createlinksAudio(dataGame.wordsGame);
        var html = '<div class="clasifica-IDevice">';
        html += '<div class="clasifica-feedback-game">' + textFeedBack + '</div>';
        html += divContent;
        html += '<div class="clasifica-DataGame js-hidden">' + json + '</div>';
        html += linksImages;
        html += linksAudios;
        var textAfter = tinyMCE.get('eXeIdeviceTextAfter').getContent();
        if (textAfter != "") {
            html += '<div class="clasifica-extra-content">' + textAfter + '</div>';
        }
        html += '<div class="clasifica-bns js-hidden">' + $exeDevice.msgs.msgNoSuportBrowser + '</div>';
        html += '</div>';
        return html;
    },

    createlinksImage: function (wordsGame) {
        var html = '';
        for (var i = 0; i < wordsGame.length; i++) {
            var linkImage = '';
            if (typeof wordsGame[i].url != "undefined" && (wordsGame[i].type == 0 || wordsGame[i].type == 2) && wordsGame[i].url.length > 0 && !wordsGame[i].url.indexOf('http') == 0) {
                linkImage = '<a href="' + wordsGame[i].url + '" class="js-hidden clasifica-LinkImages">' + i + '</a>';
            }
            html += linkImage;
        }
        return html;
    },

    createlinksAudio: function (wordsGame) {
        var html = '';
        for (var i = 0; i < wordsGame.length; i++) {
            var linkImage = '';
            if (typeof wordsGame[i].audio != "undefined" && !wordsGame[i].audio.indexOf('http') == 0 && wordsGame[i].audio.length > 4) {
                linkImage = '<a href="' + wordsGame[i].audio + '" class="js-hidden clasifica-LinkAudios">' + i + '</a>';
            }
            html += linkImage;
        }
        return html;
    },

    validateQuestion: function () {
        var message = '',
            msgs = $exeDevice.msgs,
            p = new Object(),
            message = '';
        p.type = parseInt($('input[name=qxtmediatype]:checked').val());
        p.x = parseFloat($('#clasificaEXImage').val());
        p.y = parseFloat($('#clasificaEYImage').val());
        p.author = $('#clasificaEAuthor').val();
        p.alt = $('#clasificaEAlt').val();
        p.url = $('#clasificaEURLImage').val().trim();
        p.audio = $('#clasificaEURLAudio').val();
        p.eText = $('#clasificaEText').val();
        p.color = $('#clasificaEColor').val();
        p.backcolor = $('#clasificaEBackColor').val();
        p.group = parseInt($('#clasificaEGroupSelect option:selected').val());
        p.msgHit = $('#clasificaEMessageOK').val();
        p.msgError = $('#clasificaEMessageKO').val();
        $exeDevice.stopSound();
        if (p.type == 0 && p.url.length < 5 && p.audio.length == 0) {
            message = msgs.msgCompleteImage;
        } else if (p.type == 1 && p.eText.length == 0 && p.audio.length == 0) {
            message = msgs.msgCompleteText;
        } else if (p.type == 2 && (p.eText.length == 0 || p.url.length == 0)) {
            message = msgs.msgCompleteBoth;
        }
        if (p.type == 0) {
            p.eText = '';
        } else if (p.type == 1) {
            p.url = ''
        } else if (p.type == 2) {
            p.color = '#000'
            p.backcolor = 'rgba(255, 255, 255, 0.7)'
        }


        if (message.length == 0) {
            $exeDevice.wordsGame[$exeDevice.active] = p;
            message = true;
        } else {
            $exeDevice.showMessage(message);
            message = false;
        }
        return message;
    },
    showMessage: function (msg) {
        eXe.app.alert(msg);
    },

    validateData: function () {
        var clear = $exeDevice.removeTags,
            instructions = tinyMCE.get('eXeGameInstructions').getContent(),
            textFeedBack = tinyMCE.get('clasificaEFeedBackEditor').getContent(),
            textAfter = tinyMCE.get('eXeIdeviceTextAfter').getContent(),
            showMinimize = $('#clasificaEShowMinimize').is(':checked'),
            itinerary = $exeAuthoring.iDevice.gamification.itinerary.getValues(),
            feedBack = $('#clasificaEHasFeedBack').is(':checked'),
            percentajeFB = parseInt(clear($('#clasificaEPercentajeFB').val())),
            customMessages = $('#clasificaECustomMessages').is(':checked'),
            percentajeQuestions = parseInt(clear($('#clasificaEPercentajeQuestions').val())),
            time = parseInt(clear($('#clasificaETime').val())),
            author = $('#clasificaEAuthor').val(),
            numberGroups = parseInt($('input[name=qxtnumber]:checked').val()),
            gameLevel = parseInt($('input[name=qtxgamelevel]:checked').val()),
            evaluation = $('#clasificaEEvaluation').is(':checked'),
            evaluationID = $('#clasificaEEvaluationID').val(),
            id = $exeDevice.id ? $exeDevice.id : $exeDevice.generarID();
        if (evaluation && evaluationID.length < 5) {
            eXe.app.alert($exeDevice.msgs.msgIDLenght);
            return false;
        }
        if ($exeDevice.wordsGame.length == 0) {
            $exeDevice.showMessage($exeDevice.msgs.msgEOneQuestion);
            return false;
        }
        var nogroups = false
        $('.CQE-EGroup').each(function (i) {
            if (i < numberGroups) {
                var text = $(this).val().trim();
                $exeDevice.groups[i] = text;
                if (text.length == 0) {
                    nogroups = true;
                }
            }
        });
        if (nogroups) {
            $exeDevice.showMessage('Debes indicar un nombre para todos los grupos seleccionados');
            return false;
        }
        for (var i = 0; i < $exeDevice.wordsGame.length; i++) {
            var mquestion = $exeDevice.wordsGame[i];
            if ((mquestion.type == 0) && (mquestion.url.length < 4) && mquestion.audio.length == 0) {
                $exeDevice.showMessage($exeDevice.msgs.msgCompleteData);
                return false;
            } else if ((mquestion.type == 1) && (mquestion.eText.length = 0) && mquestion.audio.length == 0) {
                $exeDevice.showMessage($exeDevice.msgs.msgCompleteData);
                return false;
            }

        }
        var scorm = $exeAuthoring.iDevice.gamification.scorm.getValues();
        var data = {
            'typeGame': 'Clasifica',
            'author': author,
            'instructions': instructions,
            'showMinimize': showMinimize,
            'itinerary': itinerary,
            'wordsGame': $exeDevice.wordsGame,
            'isScorm': scorm.isScorm,
            'textButtonScorm': scorm.textButtonScorm,
            'repeatActivity': scorm.repeatActivity,
            'textFeedBack': escape(textFeedBack),
            'textAfter': escape(textAfter),
            'feedBack': feedBack,
            'percentajeFB': percentajeFB,
            'customMessages': customMessages,
            'percentajeQuestions': percentajeQuestions,
            'time': time,
            'version': $exeDevice.version,
            'groups': $exeDevice.groups,
            'numberGroups': numberGroups,
            'gameLevel': gameLevel,
            'evaluation':evaluation,
            'evaluationID':evaluationID,
            'id':id

        }
        return data;
    },
    showImage: function (url, x, y, alt) {
        var $image = $('#clasificaEImage'),
            $cursor = $('#clasificaECursor'),
            $nimage = $('#clasificaENoImage');
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
            'left': mData.x + 'px',
            'top': mData.y + 'px',
            'width': mData.w + 'px',
            'height': mData.h + 'px'
        });
    },

    addEvents: function () {
        $('#clasificaEPaste').hide();
        $('.CQE-EPanel').on('click', 'input.CQE-Type', function (e) {
            var type = parseInt($(this).val());
            $exeDevice.changeTypeQuestion(type);
        });
        $('#clasificaEAdd').on('click', function (e) {
            e.preventDefault();
            $exeDevice.addQuestion()
        });
        $('#clasificaEFirst').on('click', function (e) {
            e.preventDefault();
            $exeDevice.firstQuestion()
        });
        $('#clasificaEPrevious').on('click', function (e) {
            e.preventDefault();
            $exeDevice.previousQuestion();
        });
        $('#clasificaENext').on('click', function (e) {
            e.preventDefault();
            $exeDevice.nextQuestion();
            return false;
        });
        $('#clasificaELast').on('click', function (e) {
            e.preventDefault();
            $exeDevice.lastQuestion()
        });
        $('#clasificaEDelete').on('click', function (e) {
            e.preventDefault();
            $exeDevice.removeQuestion()
        });
        $('#clasificaECopy').on('click', function (e) {
            e.preventDefault();
            $exeDevice.copyQuestion()
        });
        $('#clasificaEPaste').on('click', function (e) {
            e.preventDefault();
            $exeDevice.pasteQuestion()
        });
        $('#clasificaEPlayAudio').on('click', function (e) {
            e.preventDefault();
            var selectedFile = $('#clasificaEURLAudio').val().trim();
            if (selectedFile.length > 4) {
                $exeDevice.stopSound();
                $exeDevice.playSound(selectedFile);
            }
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
        $('#clasificaEURLImage').on('change', function () {
            var validExt = ['jpg', 'png', 'gif', 'jpeg', 'svg'],
                selectedFile = $(this).val(),
                ext = selectedFile.split('.').pop().toLowerCase();
            if ((selectedFile.indexOf('resources') == 0 || selectedFile.indexOf('/previews/') == 0) && validExt.indexOf(ext) == -1) {
                $exeDevice.showMessage(_("Supported formats") + ": jpg, jpeg, gif, png, svg");
                return false;
            }
            var url = selectedFile,
                alt = $('#clasificaEAlt').val(),
                x = parseFloat($('#clasificaEXImage').val()),
                y = parseFloat($('#clasificaEYImage').val());
            $('#clasificaEImage').hide();
            $('#clasificaEImage').attr('alt', 'No image');
            $('#clasificaECursor').hide();
            $('#clasificaENoImage').show();
            if (url.length > 0) {
                $exeDevice.showImage(url, x, y, alt);
            }
        });
        $('#clasificaEPlayImage').on('click', function (e) {
            e.preventDefault();
            var validExt = ['jpg', 'png', 'gif', 'jpeg', 'svg'],
                selectedFile = $('#clasificaEURLImage').val(),
                ext = selectedFile.split('.').pop().toLowerCase();
            if ((selectedFile.indexOf('resources') == 0 || selectedFile.indexOf('/previews/') == 0) && validExt.indexOf(ext) == -2) {
                $exeDevice.showMessage(_("Supported formats") + ": jpg, jpeg, gif, png, svg");
                return false;
            }
            var url = selectedFile,
                alt = $('#clasificaEAlt').val(),
                x = parseFloat($('#clasificaEXImage').val()),
                y = parseFloat($('#clasificaEYImage').val());
            $('#clasificaEImage').hide();
            $('#clasificaEImage').attr('alt', 'No image');
            $('#clasificaECursor').hide();
            $('#clasificaENoImage').show();
            if (url.length > 0) {
                $exeDevice.showImage(url, x, y, alt);
            }
        });
        $('#clasificaEImage').on('click', function (e) {
            $exeDevice.clickImage(this, e.pageX, e.pageY);
        });
        $('#clasificaECursor').on('click', function (e) {
            $(this).hide();
            $('#clasificaEXImage').val(0);
            $('#clasificaEYImage').val(0);
        });

        $('#clasificaEURLAudio').on('change', function () {
            var selectedFile = $(this).val().trim();
            if (selectedFile.length == 0) {
                $exeDevice.showMessage(_("Supported formats") + ": mp3, ogg, wav");
            } else {
                if (selectedFile.length > 4) {
                    $exeDevice.stopSound();
                    $exeDevice.playSound(selectedFile);
                }
            }
        });
        $('#clasificaEHasFeedBack').on('change', function () {
            var marcado = $(this).is(':checked');
            if (marcado) {
                $('#clasificaEFeedbackP').slideDown();
            } else {
                $('#clasificaEFeedbackP').slideUp();
            }
            $('#clasificaEPercentajeFB').prop('disabled', !marcado);
        });
        $('#clasificaECustomMessages').on('change', function () {
            var messages = $(this).is(':checked');
            $exeDevice.showSelectOrder(messages);
        });
        $('#clasificaEPercentajeQuestions').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 3);
            this.value = v;
            if (this.value > 0 && this.value < 101) {
                $exeDevice.updateQuestionsNumber();
            }
        });
        $('#clasificaEPercentajeQuestions').on('focusout', function () {
            this.value = this.value.trim() == '' ? 100 : this.value;
            this.value = this.value > 100 ? 100 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
            $exeDevice.updateQuestionsNumber();
        });
        $('#clasificaETime').on('focusout', function () {
            this.value = this.value.trim() == '' ? 0 : this.value;
            this.value = this.value > 999 ? 999 : this.value;
            this.value = this.value < 0 ? 0 : this.value;

        });
        $('#clasificaETime').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 3);
            this.value = v;
        });
        $('#clasificaEPercentajeQuestions').on('click', function () {
            $exeDevice.updateQuestionsNumber();
        });
        $('.CQE-Data').find('.exe-pick-any-file').val('Selecciona');
        $exeDevice.showGroups($exeDevice.numberGroups);
        $('input.CQE-Number').on('click', function () {
            var number = parseInt($(this).val());
            $exeDevice.showGroups(number);
        });
        $('.CQE-EGroup').on('keyup', function () {
            var id = this.id;
            var num = parseInt(id[id.length - 1]);
            $exeDevice.groups[num] = this.value;
            $('#clasificaEGroupSelect option[value=' + num + ']').text(this.value);
        });
        $('.CQE-EGroup').on('focusout', function () {
            var id = this.id;
            var num = parseInt(id[id.length - 1]);
            $exeDevice.groups[num] = this.value;
            $('#clasificaEGroupSelect option[value=' + num + ']').text(this.value);
        });
        $('#clasificaEText').on('keyup', function () {
            $('#clasificaETextDiv').text(this.value);
        });
        $('#clasificaEText').on('focusout', function () {
            $('#clasificaETextDiv').text(this.value);
        });
        $('input.CQE-ELevel').on('click', function () {
            var number = parseInt($(this).val());
            if (number != 1) {
                $('#clasificaECustomMessages').fadeIn();
                $('label[for=clasificaECustomMessages]').fadeIn();
                if ($('#clasificaECustomMessages').is(':checked')) {
                    $exeDevice.showSelectOrder(true);
                } else {
                    $exeDevice.showSelectOrder(false);
                }
            } else {
                $('#clasificaECustomMessages').fadeOut();
                $('label[for=clasificaECustomMessages]').fadeOut();
                $exeDevice.showSelectOrder(false);
            }
        });

        $('#clasificaShowAlt').on('click', function (e) {
            e.preventDefault();
            $("#clasificaEAuthorAlt").slideToggle();
        });
        $('#clasificaEBackColor').on('change', function () {
            $('#clasificaETextDiv').css('background-color', $(this).val());
        });
        $('#clasificaEColor').on('change', function () {
            $('#clasificaETextDiv').css('color', $(this).val());
        })
        $('#clasificaEEvaluation').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#clasificaEEvaluationID').prop('disabled', !marcado);
        });
        $("#clasificaEEvaluationHelpLnk").click(function () {
            $("#clasificaEEvaluationHelp").toggle();
            return false;
        });
        $exeAuthoring.iDevice.gamification.itinerary.addEvents();
    },

    showGroups: function (number) {
        $('.CQE-EGroup').hide();
        $('.CQE-EGroup').each(function (i) {
            var id = $(this).attr('id');
            $('label[for="' + id + '"]').hide();
            if (i < number) {
                $(this).show();
                $('label[for="' + id + '"]').show();
            }
            $(this).val($exeDevice.groups[i])
        });
        $('#clasificaEGroupSelect').find('option').each(function (i) {
            $(this).hide();
            if (i < number) {
                $(this).show();
                $(this).text($exeDevice.groups[i]);
            }
        })

    },

    showSelectOrder: function (messages) {
        if (messages) {
            $('.CQE-EOrders').slideDown();
        } else {
            $('.CQE-EOrders').slideUp();
        }
    },

    updateGameMode: function (feedback) {
        $('#clasificaEHasFeedBack').prop('checked', feedback);
        if (feedback) {
            $('#clasificaEFeedbackP').slideDown();
        }
        if (!feedback) {
            $('#clasificaEFeedbackP').slideUp();
        }
    },

    clearQuestion: function () {
        $('.CQE-Type')[0].checked = true;
        $('#clasificaEURLImage').val('');
        $('#clasificaEXImage').val('0');
        $('#clasificaEYImage').val('0');
        $('#clasificaEAuthor').val('');
        $('#clasificaEAlt').val('');
        $('#clasificaEText').val('');
        $('#clasificaETextDiv').text('');
        $('#clasificaEURLAudio').val('');
        $('#clasificaEColor').val('#000000');
        $('#clasificaEBackColor').val('#ffffff');
        $exeDevice.changeTypeQuestion(0);
    },

    addQuestion: function () {
        if ($exeDevice.wordsGame.length >= 25) {
            $exeDevice.showMessage($exeDevice.msgs.msgPairsMax);
            return;
        }
        var valida = $exeDevice.validateQuestion();
        if (valida) {
            $exeDevice.clearQuestion();
            $exeDevice.wordsGame.push($exeDevice.getCuestionDefault());
            $exeDevice.active = $exeDevice.wordsGame.length - 1;
            $('#clasificaENumberQuestion').text($exeDevice.wordsGame.length);
            $exeDevice.typeEdit = -1;
            $('#clasificaEPaste').hide();
            $('#clasificaENumQuestions').text($exeDevice.wordsGame.length);
            $exeDevice.updateQuestionsNumber();
        }
    },

    removeQuestion: function () {
        if ($exeDevice.wordsGame.length < 2) {
            $exeDevice.showMessage($exeDevice.msgs.msgEOneQuestion);
        } else {
            $exeDevice.wordsGame.splice($exeDevice.active, 1);
            if ($exeDevice.active >= $exeDevice.wordsGame.length - 1) {
                $exeDevice.active = $exeDevice.wordsGame.length - 1;
            }
            $exeDevice.showQuestion($exeDevice.active);
            $exeDevice.typeEdit = -1;
            $('#clasificaEPaste').hide();
            $('#clasificaENumQuestions').text($exeDevice.wordsGame.length);
            $('#clasificaENumberQuestion').text($exeDevice.active + 1);
            $exeDevice.updateQuestionsNumber();
        }

    },

    copyQuestion: function () {

        if ($exeDevice.validateQuestion() != false) {
            $exeDevice.typeEdit = 0;
            $exeDevice.clipBoard = $exeDevice.wordsGame[$exeDevice.active];
            $('#clasificaEPaste').show();
        }

    },

    cutQuestion: function () {
        if ($exeDevice.validateQuestion() != false) {
            $exeDevice.numberCutCuestion = $exeDevice.active;
            $exeDevice.typeEdit = 1;
            $('#clasificaEPaste').show();

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

    pasteQuestion: function () {
        if ($exeDevice.wordsGame.length >= 25) {
            $exeDevice.showMessage($exeDevice.msgs.msgPairsMax);
            return;
        }
        if ($exeDevice.typeEdit == 0) {
            $exeDevice.active++;
            var p = $.extend(true, {}, $exeDevice.clipBoard);
            $exeDevice.wordsGame.splice($exeDevice.active, 0, p);
            $exeDevice.showQuestion($exeDevice.active);
            $('#clasificaENumQuestions').text($exeDevice.wordsGame.length);
        } else if ($exeDevice.typeEdit == 1) {
            $('#clasificaEPaste').hide();
            $exeDevice.typeEdit = -1;
            $exeDevice.arrayMove($exeDevice.wordsGame, $exeDevice.numberCutCuestion, $exeDevice.active);
            $exeDevice.showQuestion($exeDevice.active);
            $('#clasificaENumQuestions').text($exeDevice.wordsGame.length);
            $exeDevice.updateQuestionsNumber();
        }
    },

    nextQuestion: function () {
        if ($exeDevice.validateQuestion() != false) {
            if ($exeDevice.active < $exeDevice.wordsGame.length - 1) {
                $exeDevice.active++;
                $exeDevice.showQuestion($exeDevice.active);
            }
        }
    },

    lastQuestion: function () {
        if ($exeDevice.validateQuestion() != false) {
            if ($exeDevice.active < $exeDevice.wordsGame.length - 1) {
                $exeDevice.active = $exeDevice.wordsGame.length - 1;
                $exeDevice.showQuestion($exeDevice.active);
            }
        }
    },

    previousQuestion: function () {
        if ($exeDevice.validateQuestion() != false) {
            if ($exeDevice.active > 0) {
                $exeDevice.active--;
                $exeDevice.showQuestion($exeDevice.active);
            }
        }
    },

    firstQuestion: function () {
        if ($exeDevice.validateQuestion() != false) {
            if ($exeDevice.active > 0) {
                $exeDevice.active = 0;
                $exeDevice.showQuestion($exeDevice.active);
            }
        }
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

    updateFieldGame: function (game) {
        $exeDevice.active = 0;
        $exeAuthoring.iDevice.gamification.itinerary.setValues(game.itinerary);
        game.percentajeFB = typeof game.percentajeFB != "undefined" ? game.percentajeFB : 100;
        game.feedBack = typeof game.feedBack != "undefined" ? game.feedBack : false;
        game.customMessages = typeof game.customMessages == "undefined" ? false : game.customMessages;
        game.percentajeQuestions = typeof game.percentajeQuestions == "undefined" ? 100 : game.percentajeQuestions;
         game.evaluation = typeof game.evaluation != "undefined" ? game.evaluation : false;
        game.evaluationID = typeof game.evaluationID != "undefined" ? game.evaluationID : '';
        $exeDevice.id = typeof game.id != "undefined" ? game.id : false;
        $('#clasificaEShowMinimize').prop('checked', game.showMinimize);
        $("#clasificaEHasFeedBack").prop('checked', game.feedBack);
        $("#clasificaEPercentajeFB").val(game.percentajeFB);
        $('#clasificaEPercentajeQuestions').val(game.percentajeQuestions);
        $('#clasificaETime').val(game.time);
        $('#clasificaEAuthor').val(game.author);
        $("input.CQE-Number[name='qxtnumber'][value='" + game.numberGroups + "']").prop("checked", true);
        $('#clasificaECustomMessages').prop('checked', game.customMessages);
        $('#clasificaEEvaluation').prop('checked', game.evaluation);
        $('#clasificaEEvaluationID').val(game.evaluationID);
        $("#clasificaEEvaluationID").prop('disabled', (!game.evaluation));
        $exeDevice.wordsGame = game.wordsGame;
        $exeDevice.updateGameMode(game.feedBack);
        $('#clasificaENumQuestions').text($exeDevice.wordsGame.length);
        $('#clasificaEPercentajeFB').prop('disabled', !game.feedBack);
        $("input.CQE-ELevel[name='qtxgamelevel'][value='" + game.gameLevel + "']").prop("checked", true);
        $exeDevice.showSelectOrder(game.customMessages && game.gameLevel != 1);
        $exeDevice.updateQuestionsNumber();
        $exeDevice.groups = game.groups;
        $exeDevice.numberGroups = game.numberGroups;
        $exeDevice.showGroups($exeDevice.numberGroups);
        $exeAuthoring.iDevice.gamification.scorm.setValues(game.isScorm, game.textButtonScorm, game.repeatActivity);


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
        link.download = _("Game") + "Clasifica.json";
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
        } else if (game.typeGame !== 'Clasifica') {
            eXe.app.alert($exeDevice.msgs.msgESelectFile);
            return;
        }
        $exeDevice.updateFieldGame(game);
        var instructions = game.instructionsExe || game.instructions,
            tAfter = game.textAfter || "",
            textFeedBack = game.textFeedBack || "";
        tinyMCE.get('eXeGameInstructions').setContent(unescape(instructions));
        tinyMCE.get('eXeIdeviceTextAfter').setContent(unescape(tAfter));
        tinyMCE.get('clasificaEFeedBackEditor').setContent(unescape(textFeedBack));
        $('.exe-form-tabs li:first-child a').click();
        $exeDevice.showQuestion(0);
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
        }
    },

    clickImage: function (img, epx, epy) {
        var $cursor = $('#clasificaECursor'),
            $x = $('#clasificaEXImage'),
            $y = $('#clasificaEYImage'),
            $img = $(img);
        var posX = epx - $img.offset().left,
            posY = epy - $img.offset().top,
            wI = $img.width() > 0 ? $img.width() : 1,
            hI = $img.height() > 0 ? $img.height() : 1,
            lI = $img.position().left,
            tI = $img.position().top;
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