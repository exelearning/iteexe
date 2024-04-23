/**
/**
 * Descubre Activity iDevice (edition code)
 * Version: 1
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Manuel Narvaez Martinez
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $exeDevice = {
    i18n: {
        category: _('Games'),
        name: _('Discover')
    },
    msgs: {},
    active: 0,
    wordsGame: [],
    typeEdit: -1,
    numberCutCuestion: -1,
    clipBoard: '',
    iDevicePath: "/scripts/idevices/descubre-activity/edition/",
    playerAudio: "",
    playerAudio: "",
    isVideoType: false,
    version: 1,
    id: false,
    NUMMAXCARD: 4,
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
        "msgAuthor": _("Authorship"),
        "msgReboot": _("Restart"),
        "msgTimeOver": _("Time is up. Please try again"),
        "msgAllAttemps": _("You finished all the attempts! Please try again"),
        "mgsAllCards": _("You found all the pairs!"),
        "mgsAllTrios": _("You found all the trios!"),
        "mgsAllQuartets": _("You found all the quartets!"),
        "mgsGameStart": _("The game has started! Select two cards"),
        "mgsGameStart3": _("The game has started! Select three cards"),
        "mgsGameStart4": _("The game has started! Select four cards"),
        "msgNumbersAttemps": _("Number of attemps"),
        "msgPairs": _("Pairs"),
        "msgTrios": _("Trios"),
        "msgQuarts": _("Quartets"),
        "msgAttempts": _("Attempts"),
        "msgCompletedPair": _("You completed a pair. Keep going!"),
        "msgCompletedTrio": _("You completed a trio. Keep going!"),
        "msgCompletedQuartet": _("You completed a quartet. Keep going!"),
        "msgSelectCard": _("Choose another card"),
        "msgSelectCardOne": _("Choose a card"),
        "msgRookie": _("Initial"),
        "msgExpert": _("Medium"),
        "msgMaster": _("Advanced"),
        "msgLevel": _("Level"),
        "msgSelectLevel": _("Select a level"),
        "msgUncompletedActivity": _("Incomplete activity"),
        "msgSuccessfulActivity": _("Activity: Passed. Score: %s"),
        "msgUnsuccessfulActivity": _("Activity: Not passed. Score: %s"),
        "msgTypeGame": _('Discover')
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
        msgs.msgFewAttempts = _("The number of attempts has to be bigger or equal to the number of pairs in the game. Please select 0 for infinite an unlimited number of attempts");
        msgs.msgCompleteData = _("You must indicate an image, a text or/and an audio for each card");
        msgs.msgPairsMax = _("Maximum number of pairs: 20");
        msgs.msgIDLenght = _('The report identifier must have at least 5 characters');

    },
    createForm: function () {
        var path = $exeDevice.iDevicePath,
            html = '\
            <div id="gameQEIdeviceForm">\
            <div class="exe-idevice-info">' + _("Create interactive activities in which players will have to discover pairs, trios or card quartets with images, texts and/or sounds.") + ' <a href="https://descargas.intef.es/cedec/exe_learning/Manuales/manual_exe29/descubre.html" hreflang="es" target="_blank">' + _("Use Instructions") + '</a></div>\
            <div class="exe-form-tab" title="' + _('General settings') + '">\
            ' + $exeAuthoring.iDevice.gamification.instructions.getFieldset(_("Birds of a feather flock together.")) + '\
                <fieldset class="exe-fieldset exe-fieldset-closed">\
                    <legend><a href="#">' + _("Options") + '</a></legend>\
                    <div>\
                        <p>\
                            <label for="descubreEShowMinimize"><input type="checkbox" id="descubreEShowMinimize">' + _("Show minimized.") + '</label>\
                        </p>\
                        <p>\
                            <span>' + _("Type") + ';</span>\
                            <input class="Descubre-GameMode" checked id="descubreGame2" type="radio" name="qtxgamemode" value="0"  />\
                            <label for="descubreGame2">' + _("Pairs") + '</label>\
                            <input class="Descubre-GameMode"  id="descubreGame3" type="radio" name="qtxgamemode" value="1"  />\
                            <label for="descubreGame3">' + _("Trios") + '</label>\
                            <input class="Descubre-GameMode"  id="descubreGame4" type="radio" name="qtxgamemode" value="2"  />\
                            <label for="descubreGame4">' + _("Quartets") + '</label>\
                        </p>\
                        <p>\
                            <span>' + _("Difficulty levels") + ':</span>\
                            <input class="Descubre-GameLevel" checked id="descubreL1" type="radio" name="qtxgamelevels" value="1"  />\
                            <label for="descubreL1">1</label>\
                            <input class="Descubre-GameLevel" id="descubreL2" type="radio" name="qtxgamelevels" value="2"  />\
                            <label for="descubreL2">2</label>\
                            <input class="Descubre-GameLevel" id="descubreL3" type="radio" name="qtxgamelevels" value="3"  />\
                            <label for="descubreL3">3</label>\
                        </p>\
                        <p>\
                            <label for="descubreEShowCards"><input type="checkbox" id="descubreEShowCards">' + _("Visible letters") + '.</label>\
                        </p>\
                        <p>\
							<label for="descubreETimeShowSolution">' + _("Time while the cards will be shown (seconds)") + ':\
							<input type="number" name="descubreETimeShowSolution" id="descubreETimeShowSolution" value="3" min="1" max="999" /> </label>\
                        </p>\
                        <p>\
                            <label for="descubreECustomMessages"><input type="checkbox" id="descubreECustomMessages">' + _("Custom messages") + '.</label>\
                        </p>\
                        <p>\
                        <label for="descubreETime">' + _("Time (minutes)") + ':</label><input type="number" name="descubreETime" id="descubreETime" value="0" min="0" max="120" step="1" />\
                        </p>\
                        <p>\
                            <label for="descubreEAttempts">' + _("Number of attemps") + ':</label><input type="number" name="descubreEAttempts" id="descubreEAttempts" value="0" min="0" max="100" step="1" />\
                        </p>\
                        <p>\
                            <label for="descubreEShowSolution"><input type="checkbox" checked id="descubreEShowSolution"> ' + _("Show solutions") + '. </label> \
                        </p>\
                        <p>\
                            <label for="descubreEHasFeedBack"><input type="checkbox"  id="descubreEHasFeedBack"> ' + _("Feedback") + '. </label> \
                            <label for="descubreEPercentajeFB"></label><input type="number" name="descubreEPercentajeFB" id="descubreEPercentajeFB" value="100" min="5" max="100" step="5" disabled />\
                        </p>\
                        <p id="descubreEFeedbackP" class="Descubre-EFeedbackP">\
                            <textarea id="descubreEFeedBackEditor" class="exe-html-editor"></textarea>\
                        </p>\
                        <p>\
                            <label for="descubreEPercentajeQuestions">% Preguntas:</label><input type="number" name="descubreEPercentajeQuestions" id="descubreEPercentajeQuestions" value="100" min="1" max="100" />\
                            <span id="descubreENumeroPercentaje">1/1</span>\
                        </p>\
                        <p>\
                            <label for="descubreEAuthor">' + _("Authorship") + ': </label><input id="descubreEAuthor" type="text" />\
                        </p>\
                        <p>\
                            <strong class="GameModeLabel"><a href="#descubreEEvaluationHelp" id="descubreEEvaluationHelpLnk" class="GameModeHelpLink" title="' + _("Help") + '"><img src="' + path + 'quextIEHelp.gif"  width="16" height="16" alt="' + _("Help") + '"/></a></strong>\
							<label for="descubreEEvaluation"><input type="checkbox" id="descubreEEvaluation"> ' + _("Progress report") + '. </label> \
							<label for="descubreEEvaluationID">' + _("Identifier") + ':\
							<input type="text" id="descubreEEvaluationID" disabled/> </label>\
                        </p>\
                        <div id="descubreEEvaluationHelp" class="Descubre-TypeGameHelp">\
                            <p>' +_("You must indicate the ID. It can be a word, a phrase or a number of more than four characters. You will use this ID to mark the activities covered by this progress report. It must be the same in all iDevices of a report and different in each report.") + '</p>\
                        </div>\
                    </div>\
                </fieldset>\
                <fieldset class="exe-fieldset">\
                <legend><a href="#">Parejas</a></legend>\
                <div class="Descubre-EPanel" id="descubreEPanel-0">\
                    <div class="Descubre-Pareja">\
                        ' + $exeDevice.createCards(this.NUMMAXCARD) + '\
                    </div>\
                    <div class="Descubre-EContents">\
                        <div class="Descubre-EOrders Descubre-Hide" id="descubreEOrder">\
                            <div class="Descubre-ECustomMessage">\
                                <span class="sr-av">' + _("Success") + '</span><span class="Descubre-EHit"></span>\
                                <label for="descubreEMessageOK">Mensaje:</label>\
                                    <input type="text" class=""  id="descubreEMessageOK">\
                            </div>\
                       </div>\
                        <div class="Descubre-ENavigationButtons">\
                            <a href="#" id="descubreEAdd" class="Descubre-ENavigationButton" title="' + _('Add question') + '"><img src="' + path + 'quextIEAdd.png"  alt="' + _('Add question') + '" class="Descubre-EButtonImage b-add" /></a>\
                            <a href="#" id="descubreEFirst" class="Descubre-ENavigationButton"  title="' + _('First question') + '"><img src="' + path + 'quextIEFirst.png"  alt="' + _('First question') + '" class="Descubre-EButtonImage b-first" /></a>\
                            <a href="#" id="descubreEPrevious" class="Descubre-ENavigationButton" title="' + _('Previous question') + '"><img src="' + path + 'quextIEPrev.png" alt="' + _('Previous question') + '" class="Descubre-EButtonImage b-prev" /></a>\
                            <span class="sr-av">' + _("Question number:") + '</span><span class="Descubre-NumberQuestion" id="descubreENumberQuestion">1</span>\
                            <a href="#" id="descubreENext" class="Descubre-ENavigationButton"  title="' + _('Next question') + '"><img src="' + path + 'quextIENext.png" alt="' + _('Next question') + '" class="Descubre-EButtonImage b-next" /></a>\
                            <a href="#" id="descubreELast" class="Descubre-ENavigationButton"  title="' + _('Last question') + '"><img src="' + path + 'quextIELast.png" alt="' + _('Last question') + '" class="Descubre-EButtonImage b-last" /></a>\
                            <a href="#" id="descubreEDelete" class="Descubre-ENavigationButton" title="' + _('Delete question') + '"><img src="' + path + 'quextIEDelete.png" alt="' + _('Delete question') + '" class="Descubre-EButtonImage b-delete" /></a>\
                            <a href="#" id="descubreECopy" class="Descubre-ENavigationButton" title="' + _('Copy question') + '"><img src="' + path + 'quextIECopy.png" + alt="' + _('Copy question') + '" class="Descubre-EButtonImage b-copy" /></a>\
                            <a href="#" id="descubreEPaste" class="Descubre-ENavigationButton"  title="' + _('Paste question') + '"><img src="' + path + 'quextIEPaste.png" alt="' + _('Paste question') + '" class="Descubre-EButtonImage b-paste" /></a>\
                        </div>\
                    </div>\
                    <div class="Descubre-ENumQuestionDiv" id="descubreENumQuestionDiv">\
                        <div class="Descubre-ENumQ"><span class="sr-av">Pregunta</span></div> <span class="Descubre-ENumQuestions" id="descubreENumQuestions">0</span>\
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
                    <legend><a href='#'>" + _('Additional content') + " (" + _('Optional').toLowerCase() + ")</a></legend>\
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
            var card = '<div class="Descubre-DatosCarta" id="descubreEDatosCarta-' + i + '">\
           <p class="Descubre-ECardHeader">\
               <span>\
                  <span>Tipo:</span>\
                   <input class="Descubre-Type-' + i + '" checked id="descubreEMediaImage-' + i + '" type="radio" name="qxtmediatype-' + i + '" value="0"  />\
                   <label for="descubreEMediaImage">' + _("Image") + '</label>\
                   <input class="Descubre-Type-' + i + '"  id="descubreEMediaText-' + i + '" type="radio" name="qxtmediatype-' + i + '" value="1"  />\
                   <label for="descubreEMediaText">' + _("Text") + '</label>\
                   <input class="Descubre-Type-' + i + '"  id="descubreEMediaBoth-' + i + '" type="radio" name="qxtmediatype-' + i + '" value="2"  />\
                   <label for="descubreEMediaBoth-"' + i + '>' + _("Both") + '</label>\
                </span>\
           </p>\
           <div class="Descubre-EMultimedia" id="descubreEMultimedia-' + i + '">\
                <div class="Descubre-Card">\
                    <img class="Descubre-Hide Descubre-Image" src="' + path + "quextIEImage.png" + '" id="descubreEImage-' + i + '" alt="' + _("No image") + '" />\
                    <img class="Descubre-ECursor" src="' + path + 'quextIECursor.gif" id="descubreECursor-' + i + '" alt="" />\
                    <img class="Descubre-Hide Descubre-Image" src="' + path + "quextIEImage.png" + '" id="descubreENoImage-' + i + '" alt="' + _("No image") + '" />\
                    <div id="descubreETextDiv-' + i + '" class="Descubre-ETextDiv"></div>\
                </div>\
            </div>\
           <span class="Descubre-ETitleText" id="descubreETitleText-' + i + '">' + _("Text") + '</span>\
           <div class="Descubre-EInputImage" id="descubreEInputText-' + i + '">\
                <label for="descubreEText-' + i + '" class="sr-av">' + _("Text") + '</label><input id="descubreEText-' + i + '" type="text" />\
                <label for="descubreEColor-' + i + '">' + _("Color") + ': </label><input type="color" id="descubreEColor-' + i + '" name="descubreEColor-' + i + '" value="#000000">\
                <label for="descubreEBackColor-' + i + '">' + _("Background") + ': </label><input type="color" id="descubreEBackColor-' + i + '" name="descubreEBackColor-' + i + '" value="#ffffff">\
            </div>\
           <span class="Descubre-ETitleImage" id="descubreETitleImage-' + i + '">' + _("Image") + '</span>\
           <div class="Descubre-EInputImage" id="descubreEInputImage-' + i + '">\
               <label class="sr-av" for="descubreEURLImage-' + i + '">URL</label>\
               <input type="text" class="exe-file-picker Descubre-EURLImage"  id="descubreEURLImage-' + i + '"/>\
               <a href="#" id="descubreEPlayImage-' + i + '" class="Descubre-ENavigationButton Descubre-EPlayVideo" title="' + _("Show") + '"><img src="' + path + 'quextIEPlay.png" alt="' + _("Show") + '" class="Descubre-EButtonImage b-play" /></a>\
               <a href="#" id="descubreShowAlt-' + i + '" class="Descubre-ENavigationButton Descubre-EPlayVideo" title="' + _("More") + '"><img src="' + path + 'quextEIMore.png" alt="' + _("More") + '" class="Descubre-EButtonImage b-play" /></a>\
           </div>\
           <div class="Descubre-ECoord">\
                   <label for="descubreEXImage-' + i + '">X:</label>\
                   <input id="descubreEXImage-' + i + '" type="text" value="0" />\
                   <label for="descubreEXImage-' + i + '">Y:</label>\
                   <input id="descubreEYImage-' + i + '" type="text" value="0" />\
           </div>\
           <div class="Descubre-EAuthorAlt" id="descubreEAuthorAlt-' + i + '">\
               <div class="Descubre-EInputAuthor" id="descubreEInputAuthor-' + i + '">\
                   <label for="descubreEAuthor-' + i + '">' + _("Authorship") + '</label><input id="descubreEAuthor-' + i + '" type="text" />\
               </div>\
               <div class="Descubre-EInputAlt" id="descubreEInputAlt-' + i + '">\
                   <label for="descubreEAlt-' + i + '">' + _("Alternative text") + '</label><input id="descubreEAlt-' + i + '" type="text" />\
               </div>\
           </div>\
           <span id="descubreETitleAudio-' + i + '">' + _("Audio") + '</span>\
           <div class="Descubre-EInputAudio" id="descubreEInputAudio-' + i + '">\
               <label class="sr-av" for="descubreEURLAudio-' + i + '">URL</label>\
               <input type="text" class="exe-file-picker Descubre-EURLAudio"  id="descubreEURLAudio-' + i + '"/>\
               <a href="#" id="descubreEPlayAudio-' + i + '" class="Descubre-ENavigationButton Descubre-EPlayVideo" title="' + _("Audio") + '"><img src="' + path + 'quextIEPlay.png" alt="Play" class="Descubre-EButtonImage b-play" /></a>\
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
        var percentaje = parseInt($exeDevice.removeTags($('#descubreEPercentajeQuestions').val()));
        if (isNaN(percentaje)) {
            return;
        }
        percentaje = percentaje < 1 ? 1 : percentaje;
        percentaje = percentaje > 100 ? 100 : percentaje;
        var num = Math.round((percentaje * $exeDevice.wordsGame.length) / 100);
        num = num == 0 ? 1 : num;
        $('#descubreENumeroPercentaje').text(num + "/" + $exeDevice.wordsGame.length)
    },
    showQuestion: function (i) {
        var num = i < 0 ? 0 : i;
        num = num >= $exeDevice.wordsGame.length ? $exeDevice.wordsGame.length - 1 : num;
        var q = $exeDevice.wordsGame[num];
        $exeDevice.changeTypeQuestion(q.data[0].type, q.data[1].type, q.data[2].type, q.data[3].type);
        for (var k = 0; k < $exeDevice.NUMMAXCARD; k++) {
            var p = q.data[k];
            $('#descubreEText-' + k).val(p.eText)
            $('#descubreETextDiv-' + k).text(p.eText);
            $('#descubreEColor-' + k).val(p.color);
            $('#descubreEBackColor-' + k).val(p.backcolor);
            $('#descubreEURLImage-' + k).val(p.url);
            $('#descubreEXImage-' + k).val(p.x);
            $('#descubreEYImage-' + k).val(p.y);
            $('#descubreEAuthor-' + k).val(p.author);
            $('#descubreEAlt-' + k).val(p.alt);
            if (p.type == 0 || p.type == 2) {
                $exeDevice.showImage(p.url, p.x, p.y, p.alt, k);
            }
            if (p.type == 1) {
                $('#descubreETextDiv-' + k).css({
                    'color': p.color,
                    'background-color': p.backcolor,
                })
            } else if (p.type == 2) {
                $('#descubreETextDiv-' + k).css({
                    'color': '#000',
                    'background-color': 'rgba(255, 255, 255, 0.7)'
                })
            }
            $('#descubreEURLAudio-' + k).val(p.audio);
            $('input.Descubre-Type-' + k + '[name="qxtmediatype-' + k + '"][value="' + p.type + '"]').prop("checked", true);
        }

        $('#descubreEMessageOK').val(q.msgHit);
        $('#descubreEMessageKO').val(q.msgError);
        $('#descubreENumberQuestion').text(i + 1);
        $exeDevice.stopSound();
    },

    initQuestions: function () {
        for (var i = 0; i < $exeDevice.NUMMAXCARD; i++) {
            $('#descubreEInputImage-' + i).css('display', 'flex');
            $('#descubreEMediaImage-' + i).prop("disabled", false);
            $('#descubreEMediaText-' + i).prop("disabled", false);
            $('#descubreEMediaBoth-' + i).prop("disabled", false);
            $('#descubreEAuthorAlt-' + i).hide();
        }
        $("#descubreEDatosCarta-2").hide();
        $("#descubreEDatosCarta-3").hide();
        if ($exeDevice.wordsGame.length == 0) {
            var question = $exeDevice.getCuestionDefault();
            $exeDevice.wordsGame.push(question);
            this.changeTypeQuestion(0, 0, 0, 0)
        }
        this.active = 0;
    },

    changeTypeQuestion: function (type0, type1, type2, type3) {
        var types = [type0, type1, type2, type3]
        for (var i = 0; i < $exeDevice.NUMMAXCARD; i++) {
            $('#descubreETitleAltImage-' + i).hide();
            $('#descubreEAuthorAlt-' + i).hide();
            $('#descubreETitleImage-' + i).hide();
            $('#descubreEInputImage-' + i).hide();
            $('#descubreEText-' + i).hide();
            $('#descubreEImage-' + i).hide();
            $('#descubreECover-' + i).hide();
            $('#descubreECursor-' + i).hide();
            $('#descubreENoImage-' + i).hide();
            $('#descubreETitleText-' + i).hide();
            $('#descubreEInputText-' + i).hide();
            $('#descubreEColor-' + i).hide();
            $('#descubreETextDiv-' + i).hide();
            $('#descubreEBackColor-' + i).hide();
            $('label[for=descubreEBackColor-' + i + ']').hide();
            $('label[for=descubreEColor-' + i + ']').hide();
            switch (types[i]) {
                case 0:
                    $('#descubreEImage-' + i).show();
                    $('#descubreETitleImage-' + i).show();
                    $('#descubreEInputImage-' + i).show();
                    $exeDevice.showImage($('#descubreEURLImage-' + i).val(), $('#descubreEXImage-' + i).val(), $('#descubreEYImage-' + i).val(), $('#descubreEAlt-' + i).val(), i)

                    break;
                case 1:
                    $('#descubreEText-' + i).show();
                    $('#descubreETitleText-' + i).show();
                    $('#descubreEInputText-' + i).show();
                    $('#descubreEColor-' + i).show();
                    $('#descubreEBackColor-' + i).show();
                    $('label[for=descubreEBackColor-' + i + ']').show();
                    $('label[for=descubreEColor-' + i + ']').show();
                    $('#descubreETextDiv-' + i).show();
                    $('#descubreETextDiv-' + i).css({
                        'color': $('#descubreEColor-' + i).val(),
                        'background-color': $('#descubreEBackColor-' + i).val()
                    })
                    break;
                case 2:
                    $('#descubreEImage-' + i).show();
                    $('#descubreETitleImage-' + i).show();
                    $('#descubreEInputImage-' + i).show();
                    $('#descubreEText-' + i).show();
                    $('#descubreETitleText-' + i).show();
                    $('#descubreEInputText-' + i).show();
                    $('#descubreEColor-' + i).show();
                    $('#descubreEBackColor-' + i).show();
                    $('label[for=descubreEBackColor-' + i + ']').show();
                    $('label[for=descubreEColor-' + i + ']').show();
                    $('#descubreETextDiv-' + i).show();
                    $('#descubreETextDiv-' + i).css({
                        'color': '#000',
                        'background-color': 'rgba(255, 255, 255, 0.7)'
                    });
                    $exeDevice.showImage($('#descubreEURLImage-' + i).val(), $('#descubreEXImage-' + i).val(), $('#descubreEYImage-' + i).val(), $('#descubreEAlt-' + i).val(), i)
                    break;
                default:
                    break;
            }
        }

    },


    getCuestionDefault: function () {
        var q = new Object();
        q.data = [];
        for (var i = 0; i < $exeDevice.NUMMAXCARD; i++) {
            var p = new Object();
            p.type = 0;
            p.url = '';
            p.audio = '';
            p.x = 0;
            p.y = 0;
            p.author = '';
            p.alt = '';
            p.eText = '';
            p.color = '#000000';
            p.backcolor = "#ffffff";
            q.data.push(p)
        }
        q.msgError = '';
        q.msgHit = '';

        return q;
    },
    loadPreviousValues: function (field) {
        var originalHTML = field.val();
        if (originalHTML != '') {
            var wrapper = $("<div></div>");
            wrapper.html(originalHTML);
            var json = $('.descubre-DataGame', wrapper).text();
            json = $exeDevice.Decrypt(json);
            var dataGame = $exeDevice.isJsonString(json),
                $imagesLink0 = $('.descubre-LinkImages-0', wrapper),
                $audiosLink0 = $('.descubre-LinkAudios-0', wrapper),
                $imagesLink1 = $('.descubre-LinkImages-1', wrapper),
                $audiosLink1 = $('.descubre-LinkAudios-1', wrapper),
                $imagesLink2 = $('.descubre-LinkImages-2', wrapper),
                $audiosLink2 = $('.descubre-LinkAudios-2', wrapper),
                $imagesLink3 = $('.descubre-LinkImages-3', wrapper),
                $audiosLink3 = $('.descubre-LinkAudios-3', wrapper),
                linkImages = [$imagesLink0, $imagesLink1, $imagesLink2, $imagesLink3],
                linkAudios = [$audiosLink0, $audiosLink1, $audiosLink2, $audiosLink3];
            if (typeof dataGame.version == "undefined" || dataGame.version < 1) {
                $imagesLink0.each(function () {
                    var iq = parseInt($(this).text());
                    if (!isNaN(iq) && iq < dataGame.wordsGame.length) {
                        dataGame.wordsGame[iq].url0 = $(this).attr('href');
                        if (dataGame.wordsGame[iq].url0.length < 4 && dataGame.wordsGame[iq].type0 == 1) {
                            dataGame.wordsGame[iq].url0 = "";
                        }
                    }
                });

                $audiosLink0.each(function () {
                    var iq = parseInt($(this).text());
                    if (!isNaN(iq) && iq < dataGame.wordsGame.length) {
                        dataGame.wordsGame[iq].audio0 = $(this).attr('href');
                        if (dataGame.wordsGame[iq].audio0.length < 4) {
                            dataGame.wordsGame[iq].audio0 = "";
                        }
                    }
                });
                $imagesLink1.each(function () {
                    var iq = parseInt($(this).text());
                    if (!isNaN(iq) && iq < dataGame.wordsGame.length) {
                        dataGame.wordsGame[iq].url1 = $(this).attr('href');
                        if (dataGame.wordsGame[iq].url1.length < 4 && dataGame.wordsGame[iq].type1 == 1) {
                            dataGame.wordsGame[iq].url1 = "";
                        }
                    }
                });

                $audiosLink1.each(function () {
                    var iq = parseInt($(this).text());
                    if (!isNaN(iq) && iq < dataGame.wordsGame.length) {
                        dataGame.wordsGame[iq].audio1 = $(this).attr('href');
                        if (dataGame.wordsGame[iq].audio1.length < 4) {
                            dataGame.wordsGame[iq].audio1 = "";
                        }
                    }
                });
                $imagesLink2.each(function () {
                    var iq = parseInt($(this).text());
                    if (!isNaN(iq) && iq < dataGame.wordsGame.length) {
                        dataGame.wordsGame[iq].url2 = $(this).attr('href');
                        if (dataGame.wordsGame[iq].url2.length < 4 && dataGame.wordsGame[iq].type2 == 1) {
                            dataGame.wordsGame[iq].url2 = "";
                        }
                    }
                });

                $audiosLink2.each(function () {
                    var iq = parseInt($(this).text());
                    if (!isNaN(iq) && iq < dataGame.wordsGame.length) {
                        dataGame.wordsGame[iq].audio2 = $(this).attr('href');
                        if (dataGame.wordsGame[iq].audio2.length < 4) {
                            dataGame.wordsGame[iq].audio2 = "";
                        }
                    }
                });

                var words = [];
                for (var j = 0; j < dataGame.wordsGame.length; j++) {
                    var p = $exeDevice.getCuestionDefault();
                    p.data[0].type = dataGame.wordsGame[j].type0 || 0;
                    p.data[1].type = dataGame.wordsGame[j].type1 || 0;
                    p.data[2].type = dataGame.wordsGame[j].type2 || 0;
                    p.data[3].type = 0;

                    p.data[0].url = dataGame.wordsGame[j].url0 || '';
                    p.data[1].url = dataGame.wordsGame[j].url1 || '';
                    p.data[2].url = dataGame.wordsGame[j].url2 || '';
                    p.data[3].url = '';

                    p.data[0].audio = dataGame.wordsGame[j].audio0 || '';
                    p.data[1].audio = dataGame.wordsGame[j].audio1 || '';
                    p.data[2].audio = dataGame.wordsGame[j].audio2 || '';
                    p.data[3].audio = '';

                    p.data[0].x = dataGame.wordsGame[j].x0 || 0;
                    p.data[1].x = dataGame.wordsGame[j].x1 || 0;
                    p.data[2].x = dataGame.wordsGame[j].x2 || 0;
                    p.data[3].x = 0;

                    p.data[0].y = dataGame.wordsGame[j].y0 || 0;
                    p.data[1].y = dataGame.wordsGame[j].y1 || 0;
                    p.data[2].y = dataGame.wordsGame[j].y2 || 0;
                    p.data[3].y = 0;

                    p.data[0].author = dataGame.wordsGame[j].autmor0 || '';
                    p.data[1].author = dataGame.wordsGame[j].autmor1 || '';
                    p.data[2].author = dataGame.wordsGame[j].autmor2 || '';
                    p.data[3].author = '';

                    p.data[0].alt = dataGame.wordsGame[j].alt0 || '';
                    p.data[1].alt = dataGame.wordsGame[j].alt1 || '';
                    p.data[2].alt = dataGame.wordsGame[j].alt2 || '';
                    p.data[3].alt = '';

                    p.data[0].eText = dataGame.wordsGame[j].eText0 || '';
                    p.data[1].eText = dataGame.wordsGame[j].eText1 || '';
                    p.data[2].eText = dataGame.wordsGame[j].eText2 || '';
                    p.data[3].eText = '';

                    p.data[0].backcolor = "#ffffff";
                    p.data[1].backcolor = "#ffffff";
                    p.data[2].backcolor = "#ffffff";
                    p.data[3].backcolor = "#ffffff";

                    p.data[0].color = "#00000";
                    p.data[1].color = "#00000";
                    p.data[2].color = "#00000";
                    p.data[3].color = "#00000";
                    p.msgError = '';
                    p.msgHit = '';
                    words.push(p)

                }
                dataGame.wordsGame = words;

            } else {
                for (var k = 0; k < linkImages.length; k++) {
                    var $linImg = linkImages[k];
                    $linImg.each(function () {
                        var iq = parseInt($(this).text());
                        if (!isNaN(iq) && iq < dataGame.wordsGame.length) {
                            var p = dataGame.wordsGame[iq].data[k];
                            p.url = $(this).attr('href');
                            if (p.url.length < 4 && p.type == 1) {
                                p.url = "";
                            }
                        }
                    });
                    var $linkAudio = linkAudios[k];
                    $linkAudio.each(function () {
                        var iq = parseInt($(this).text());
                        if (!isNaN(iq) && iq < dataGame.wordsGame.length) {
                            var p = dataGame.wordsGame[iq].data[k];
                            p.audio = $(this).attr('href');
                            if (p.audio.length < 4) {
                                p.audio = "";
                            }
                        }
                    });

                }

            }



            $exeDevice.updateFieldGame(dataGame);
            var instructions = $(".descubre-instructions", wrapper);
            if (instructions.length == 1) {
                instructions = instructions.html() || ''
                if (tinyMCE.get('eXeGameInstructions')) {
                    tinyMCE.get('eXeGameInstructions').setContent(instructions);
                } else {
                    $("#eXeGameInstructions").val(instructions)
                }
            }

            var textFeedBack = $(".descubre-feedback-game", wrapper);
            if (textFeedBack.length == 1) {
                textFeedBack = textFeedBack.html() || ''
                if (tinyMCE.get('descubreEFeedBackEditor')) {
                    tinyMCE.get('descubreEFeedBackEditor').setContent(textFeedBack);
                } else {
                    $("#descubreEFeedBackEditor").val(textFeedBack)
                }
            }

            var textAfter = $(".descubre-extra-content", wrapper);
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
        var textFeedBack = tinyMCE.get('descubreEFeedBackEditor').getContent();
        if (dataGame.instructions != "") divContent = '<div class="descubre-instructions gameQP-instructions">' + dataGame.instructions + '</div>';
        var linksImages = $exeDevice.createlinksImage(dataGame.wordsGame),
            linksAudios = $exeDevice.createlinksAudio(dataGame.wordsGame);
        var html = '<div class="descubre-IDevice">';
        html += '<div class="descubre-feedback-game">' + textFeedBack + '</div>';
        html += divContent;
        html += '<div class="descubre-DataGame js-hidden">' + json + '</div>';
        html += linksImages;
        html += linksAudios;
        var textAfter = tinyMCE.get('eXeIdeviceTextAfter').getContent();
        if (textAfter != "") {
            html += '<div class="descubre-extra-content">' + textAfter + '</div>';
        }
        html += '<div class="descubre-bns js-hidden">' + $exeDevice.msgs.msgNoSuportBrowser + '</div>';
        html += '</div>';
        return html;
    },

    createlinksImage: function (wordsGame) {
        var html = '';
        for (var i = 0; i < wordsGame.length; i++) {
            var q = wordsGame[i];
            for (var k = 0; k < $exeDevice.NUMMAXCARD; k++) {
                var p = q.data[k],
                    linkImage = '';
                if (typeof p.url != "undefined" && (p.type == 0 || p.type==2)  && p.url.length > 0 && p.url.indexOf('http') != 0) {
                    linkImage = '<a href="' + p.url + '" class="js-hidden descubre-LinkImages-' + k + '">' + i + '</a>';
                }
                html += linkImage;
            }
        }

        return html;
    },

    createlinksAudio: function (wordsGame) {
        var html = '';

        for (var i = 0; i < wordsGame.length; i++) {
            var q = wordsGame[i];
            for (var k = 0; k < $exeDevice.NUMMAXCARD; k++) {
                var p = q.data[k],
                    linkImage = '';
                if (typeof p.audio != "undefined" && p.audio.indexOf('http') != 0 && p.audio.length > 4) {
                    linkImage = '<a href="' + p.audio + '" class="js-hidden descubre-LinkAudios-' + k + '">' + i + '</a>';
                }
                html += linkImage;
            }
        }
        return html;
    },

    validateQuestion: function () {
        var message = '',
            msgs = $exeDevice.msgs,
            gameMode = parseInt($('input[name=qtxgamemode]:checked').val()),
            message = '',
            q = new Object();
        q.data = [];
        for (var k = 0; k < $exeDevice.NUMMAXCARD; k++) {
            var p = new Object();
            p.type = parseInt($('input[name=qxtmediatype-' + k + ']:checked').val());
            p.x = parseFloat($('#descubreEXImage-' + k).val());
            p.y = parseFloat($('#descubreEYImage-' + k).val());;
            p.author = $('#descubreEAuthor-' + k).val();
            p.alt = $('#descubreEAlt-' + k).val();
            p.url = $('#descubreEURLImage-' + k).val().trim();
            p.audio = $('#descubreEURLAudio-' + k).val();
            p.eText = $('#descubreEText-' + k).val();
            p.color = $('#descubreEColor-' + k).val();
            p.backcolor = $('#descubreEBackColor-' + k).val();
            q.data.push(p)
        }
        q.msgHit = $('#descubreEMessageOK').val();
        q.msgError = $('#descubreEMessageKO').val();
        $exeDevice.stopSound();
        var num_cards = 2;
        if (gameMode == 1) {
            num_cards = 3;
        } else if (gameMode == 2) {
            num_cards = 4;
        }
        for (var j = 0; j < num_cards; j++) {
            if (q.data[j].type == 0 && q.data[j].url.length < 5 && q.data[j].audio.length == 0) {
                message = msgs.msgCompleteData;
                break;
            } else if (q.data[j].type == 1 && q.data[j].eText.length == 0 && q.data[j].audio.length == 0) {
                message = msgs.msgCompleteData;
                break;
            }
        }
        if (message.length == 0) {
            $exeDevice.wordsGame[$exeDevice.active] = q;
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
            textFeedBack = tinyMCE.get('descubreEFeedBackEditor').getContent(),
            textAfter = tinyMCE.get('eXeIdeviceTextAfter').getContent(),
            showMinimize = $('#descubreEShowMinimize').is(':checked'),
            itinerary = $exeAuthoring.iDevice.gamification.itinerary.getValues(),
            caseSensitive = $('#descubreECaseSensitive').is(':checked'),
            feedBack = $('#descubreEHasFeedBack').is(':checked'),
            percentajeFB = parseInt(clear($('#descubreEPercentajeFB').val())),
            customMessages = $('#descubreECustomMessages').is(':checked'),
            showCards = $('#descubreEShowCards').is(':checked'),
            percentajeQuestions = parseInt(clear($('#descubreEPercentajeQuestions').val())),
            time = parseInt(clear($('#descubreETime').val())),
            attempts = parseInt(clear($('#descubreEAttempts').val())),
            timeShowSolution = parseInt(clear($('#descubreETimeShowSolution').val())),
            author = $('#descubreEAuthor').val(),
            showSolution = $('#descubreEShowSolution').is(':checked'),
            gameMode = parseInt($('input[name=qtxgamemode]:checked').val()),
            gameLevels = parseInt($('input[name=qtxgamelevels]:checked').val()),
            wordsGame = $exeDevice.wordsGame,
            evaluation = $('#descubreEEvaluation').is(':checked'),
            evaluationID = $('#descubreEEvaluationID').val(),
            id = $exeDevice.id ? $exeDevice.id : $exeDevice.generarID();
        if (evaluation && evaluationID.length < 5) {
            eXe.app.alert($exeDevice.msgs.msgIDLenght);
            return false;
        }
        if (wordsGame.length == 0) {
            $exeDevice.showMessage($exeDevice.msgs.msgEOneQuestion);
            return false;
        }

        if (gameLevels == 3 && wordsGame.length < 3) {
            $exeDevice.showMessage("Para un juego con tres niveles de dificultad necesita al menos tres cuestiones");
            return false;
        } else if (gameLevels == 2 && wordsGame.length < 2) {
            $exeDevice.showMessage("Para un juego con dos niveles de dificultad necesita al menos dos cuestiones");
            return false;
        }
        var num_cards = 2;
        if (gameMode == 1) {
            num_cards = 3;
        } else if (gameMode == 2) {
            num_cards = 4;
        }

        for (var i = 0; i < wordsGame.length; i++) {
            for (var j = 0; j < num_cards; j++) {
                var p = wordsGame[i].data[j];
                if ((p.type == 0) && (p.url.length < 4) && p.audio.length < 4) {
                    $exeDevice.showMessage($exeDevice.msgs.msgCompleteData);
                    return false;
                } else if ((p.type == 1) && (p.length = 0) && p.audio.length == 0) {
                    $exeDevice.showMessage($exeDevice.msgs.msgCompleteData);
                    return false;
                }
            }

        }
        if (attempts > 0 && attempts < (wordsGame.length * percentajeQuestions / 100)) {
            $exeDevice.showMessage($exeDevice.msgs.msgFewAttempts);
            return false;
        }
        var scorm = $exeAuthoring.iDevice.gamification.scorm.getValues();
        var data = {
            'typeGame': 'Descubre',
            'author': author,
            'instructions': instructions,
            'showMinimize': showMinimize,
            'showSolution': showSolution,
            'itinerary': itinerary,
            'wordsGame': wordsGame,
            'isScorm': scorm.isScorm,
            'textButtonScorm': scorm.textButtonScorm,
            'repeatActivity': scorm.repeatActivity,
            'textFeedBack': escape(textFeedBack),
            'textAfter': escape(textAfter),
            'caseSensitive': caseSensitive,
            'feedBack': feedBack,
            'percentajeFB': percentajeFB,
            'version': 2,
            'customMessages': customMessages,
            'percentajeQuestions': percentajeQuestions,
            'timeShowSolution': timeShowSolution,
            'time': time,
            'attempts': attempts,
            'gameMode': gameMode,
            'gameLevels': gameLevels,
            'showCards': showCards,
            'version': $exeDevice.version,
            'evaluation':evaluation,
            'evaluationID':evaluationID,
            'id':id

        }
        return data;
    },
    showImage: function (url, x, y, alt, nimg) {
        var $image = $('#descubreEImage-0'),
            $cursor = $('#descubreECursor-0'),
            $nimage = $('#descubreENoImage-0');
        if (nimg == 1) {
            $image = $('#descubreEImage-1');
            $cursor = $('#descubreECursor-1');
            $nimage = $('#descubreENoImage-1');
        } else if (nimg == 2) {
            $image = $('#descubreEImage-2');
            $cursor = $('#descubreECursor-2');
            $nimage = $('#descubreENoImage-2');
        } else if (nimg == 3) {
            $image = $('#descubreEImage-3');
            $cursor = $('#descubreECursor-3');
            $nimage = $('#descubreENoImage-3');
        }
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
        $exeDevice.playerAudio.addEventListener("canplaythrough", function (event) {
            $exeDevice.playerAudio.play();
        });
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
        $('#descubreEPaste').hide();
        $('input.Descubre-GameMode').on('click', function (e) {
            $('#descubreEDatosCarta-2').hide();
            $('#descubreEDatosCarta-3').hide();
            var type = parseInt($(this).val());
            if (type == 1) {
                $('#descubreEDatosCarta-2').show();
            } else if (type == 2) {
                $('#descubreEDatosCarta-2').show();
                $('#descubreEDatosCarta-3').show();
            }
        });

        $('.Descubre-EPanel').on('click', 'input.Descubre-Type-0', function (e) {
            var type0 = parseInt($(this).val()),
                type1 = parseInt($('input[name=qxtmediatype-1]:checked').val()),
                type2 = parseInt($('input[name=qxtmediatype-2]:checked').val()),
                type3 = parseInt($('input[name=qxtmediatype-3]:checked').val());
            $exeDevice.changeTypeQuestion(type0, type1, type2, type3);
        });
        $('.Descubre-EPanel').on('click', 'input.Descubre-Type-1', function (e) {
            var type1 = parseInt($(this).val()),
                type0 = parseInt($('input[name=qxtmediatype-0]:checked').val()),
                type2 = parseInt($('input[name=qxtmediatype-2]:checked').val()),
                type3 = parseInt($('input[name=qxtmediatype-3]:checked').val());
            $exeDevice.changeTypeQuestion(type0, type1, type2, type3);
        });
        $('.Descubre-EPanel').on('click', 'input.Descubre-Type-2', function (e) {
            var type2 = parseInt($(this).val()),
                type0 = parseInt($('input[name=qxtmediatype-0]:checked').val()),
                type1 = parseInt($('input[name=qxtmediatype-1]:checked').val()),
                type3 = parseInt($('input[name=qxtmediatype-3]:checked').val());

            $exeDevice.changeTypeQuestion(type0, type1, type2, type3);
        });
        $('.Descubre-EPanel').on('click', 'input.Descubre-Type-3', function (e) {
            var type3 = parseInt($(this).val()),
                type0 = parseInt($('input[name=qxtmediatype-0]:checked').val()),
                type1 = parseInt($('input[name=qxtmediatype-1]:checked').val()),
                type2 = parseInt($('input[name=qxtmediatype-2]:checked').val());

            $exeDevice.changeTypeQuestion(type0, type1, type2, type3);
        });
        $('#descubreEAdd').on('click', function (e) {
            e.preventDefault();
            $exeDevice.addQuestion()
        });
        $('#descubreEFirst').on('click', function (e) {
            e.preventDefault();
            $exeDevice.firstQuestion()
        });
        $('#descubreEPrevious').on('click', function (e) {
            e.preventDefault();
            $exeDevice.previousQuestion();
        });
        $('#descubreENext').on('click', function (e) {
            e.preventDefault();
            $exeDevice.nextQuestion();
            return false;

        });
        $('#descubreELast').on('click', function (e) {
            e.preventDefault();
            $exeDevice.lastQuestion()
        });
        $('#descubreEDelete').on('click', function (e) {
            e.preventDefault();
            $exeDevice.removeQuestion()
        });
        $('#descubreECopy').on('click', function (e) {
            e.preventDefault();
            $exeDevice.copyQuestion()
        });
        $('#descubreEPaste').on('click', function (e) {
            e.preventDefault();
            $exeDevice.pasteQuestion()
        });

        if (window.File && window.FileReader && window.FileList && window.Blob) {
            $('#eXeGameExportImport .exe-field-instructions').eq(0).text( _("Supported formats") + ': json, txt');
            $('#eXeGameExportImport').show();
            $('#eXeGameImportGame').attr('accept', '.txt, .json, .xml');
            $('#eXeGameImportGame').on('change', function (e) {
                var file = e.target.files[0];
                if (!file) {
                    eXe.app.alert(_('Por favor, selecciona un archivo de texto (.txt) o un archivo JSON (.json)'));
                    return;
                }
                if (!file.type || !(file.type.match('text/plain') || file.type.match('application/json') || file.type.match('application/xml') || file.type.match('text/xml'))) {
                    eXe.app.alert(_('Por favor, selecciona un archivo de texto (.txt) o un archivo JSON (.json)'));
                    return;
                }
                var reader = new FileReader();
                reader.onload = function (e) {
                    $exeDevice.importGame(e.target.result, file.type);
                };
                reader.readAsText(file);
            });
            $('#eXeGameExportGame').on('click', function () {
                $exeDevice.exportGame();
            })
        } else {
            $('#eXeGameExportImport').hide();
        }


        $('#descubreEHasFeedBack').on('change', function () {
            var marcado = $(this).is(':checked');
            if (marcado) {
                $('#descubreEFeedbackP').slideDown();
            } else {
                $('#descubreEFeedbackP').slideUp();
            }
            $('#descubreEPercentajeFB').prop('disabled', !marcado);
        });
        $('#descubreECustomMessages').on('change', function () {
            var messages = $(this).is(':checked');
            $exeDevice.showSelectOrder(messages);
        });
        $('#descubreEShowCards').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#descubreETimeShowSolution').prop('disabled', marcado);
        });
        $('#descubreEPercentajeQuestions').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 3);
            this.value = v;
            if (this.value > 0 && this.value < 101) {
                $exeDevice.updateQuestionsNumber();
            }
        });
        $('#descubreEPercentajeQuestions').on('focusout', function () {
            this.value = this.value.trim() == '' ? 100 : this.value;
            this.value = this.value > 100 ? 100 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
            $exeDevice.updateQuestionsNumber();
        });

        $('#descubreETime').on('focusout', function () {
            this.value = this.value.trim() == '' ? 0 : this.value;
            this.value = this.value > 999 ? 999 : this.value;
            this.value = this.value < 0 ? 0 : this.value;

        });
        $('#descubreETime').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 3);
            this.value = v;
        });
        $('#descubreEAttempts').on('focusout', function () {
            this.value = this.value.trim() == '' ? 0 : this.value;
            this.value = this.value > 999 ? 999 : this.value;
            this.value = this.value < 0 ? 0 : this.value;

        });
        $('#descubreEAttempts').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 3);
            this.value = v;
        });
        $('#descubreEPercentajeQuestions').on('click', function () {
            $exeDevice.updateQuestionsNumber();
        });
        $('#descubreETimeShowSolution').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 3);
            this.value = v;
        });
        $('#descubreETimeShowSolution').on('focusout', function () {
            this.value = this.value.trim() == '' ? 3 : this.value;
            this.value = this.value > 999 ? 999 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
        });

        $('#descubreEURLImage-0').on('change', function () {
            $exeDevice.loadImage(0, $(this).val());
        });
        $('#descubreEURLImage-1').on('change', function () {
            $exeDevice.loadImage(1, $(this).val());
        });
        $('#descubreEURLImage-2').on('change', function () {
            $exeDevice.loadImage(2, $(this).val());
        });
        $('#descubreEURLImage-3').on('change', function () {
            $exeDevice.loadImage(3, $(this).val());
        });

        $('#descubreEPlayImage-0').on('click', function (e) {
            e.preventDefault()
            $exeDevice.loadImage(0, $('#descubreEURLImage-0').val());
        });
        $('#descubreEPlayImage-1').on('click', function (e) {
            e.preventDefault()
            $exeDevice.loadImage(1, $('#descubreEURLImage-1').val());
        });
        $('#descubreEPlayImage-2').on('click', function (e) {
            e.preventDefault()
            $exeDevice.loadImage(2, $('#descubreEURLImage-2').val());
        });
        $('#descubreEPlayImage-3').on('click', function (e) {
            e.preventDefault()
            $exeDevice.loadImage(3, $('#descubreEURLImage-3').val());
        });

        $('#descubreEURLAudio-0').on('change', function () {
            $exeDevice.loadAudio($(this).val());
        });
        $('#descubreEURLAudio-1').on('change', function () {
            $exeDevice.loadAudio($(this).val());
        });
        $('#descubreEURLAudio-2').on('change', function () {
            $exeDevice.loadAudio($(this).val());
        });
        $('#descubreEURLAudio-3').on('change', function () {
            $exeDevice.loadAudio($(this).val());
        });

        $('#descubreEPlayAudio-0').on('click', function (e) {
            e.preventDefault()
            $exeDevice.loadAudio($('#descubreEURLAudio-0').val());
        });
        $('#descubreEPlayAudio-1').on('click', function (e) {
            e.preventDefault()
            $exeDevice.loadAudio($('#descubreEURLAudio-1').val());
        });
        $('#descubreEPlayAudio-2').on('click', function (e) {
            e.preventDefault()
            $exeDevice.loadAudio($('#descubreEURLAudio-2').val());
        });
        $('#descubreEPlayAudio-3').on('click', function (e) {
            e.preventDefault()
            $exeDevice.loadAudio($('#descubreEURLAudio-3').val());
        });

        $('#descubreEText-0').on('keyup', function () {
            $('#descubreETextDiv-0').text($(this).val());
        });
        $('#descubreEText-1').on('keyup', function () {
            $('#descubreETextDiv-1').text($(this).val());
        });
        $('#descubreEText-2').on('keyup', function () {
            $('#descubreETextDiv-2').text($(this).val());
        });
        $('#descubreEText-3').on('keyup', function () {
            $('#descubreETextDiv-3').text($(this).val());
        });

        $('#descubreEBackColor-0').on('change', function () {
            $('#descubreETextDiv-0').css('background-color', $(this).val());
        });
        $('#descubreEBackColor-1').on('change', function () {
            $('#descubreETextDiv-1').css('background-color', $(this).val());
        });
        $('#descubreEBackColor-2').on('change', function () {
            $('#descubreETextDiv-2').css('background-color', $(this).val());
        });
        $('#descubreEBackColor-3').on('change', function () {
            $('#descubreETextDiv-3').css('background-color', $(this).val());
        });

        $('#descubreEColor-0').on('change', function () {
            $('#descubreETextDiv-0').css('color', $(this).val());
        });
        $('#descubreEColor-1').on('change', function () {
            $('#descubreETextDiv-1').css('color', $(this).val());
        });
        $('#descubreEColor-2').on('change', function () {
            $('#descubreETextDiv-2').css('color', $(this).val());
        });
        $('#descubreEColor-3').on('change', function () {
            $('#descubreETextDiv-3').css('color', $(this).val());
        });


        $('#descubreEImage-0').on('click', function (e) {
            $exeDevice.clickImage(this, e.pageX, e.pageY, 0);
        });
        $('#descubreEImage-1').on('click', function (e) {
            $exeDevice.clickImage(this, e.pageX, e.pageY, 1);
        });

        $('#descubreEImage-2').on('click', function (e) {
            $exeDevice.clickImage(this, e.pageX, e.pageY, 2);
        });
        $('#descubreEImage-3').on('click', function (e) {
            $exeDevice.clickImage(this, e.pageX, e.pageY, 3);
        });


        $('#descubreECursor-0').on('click', function (e) {
            $(this).hide();
            $('#descubreEXImage-0').val(0);
            $('#descubreEYImage-0').val(0);
        });
        $('#descubreECursor-1').on('click', function (e) {
            $(this).hide();
            $('#descubreEXImage-1').val(0);
            $('#descubreEYImage-1').val(0);
        });
        $('#descubreECursor-2').on('click', function (e) {
            $(this).hide();
            $('#descubreEXImage-2').val(0);
            $('#descubreEYImage-2').val(0);
        });
        $('#descubreECursor-3').on('click', function (e) {
            $(this).hide();
            $('#descubreEXImage-3').val(0);
            $('#descubreEYImage-3').val(0);
        });

        $('#descubreShowAlt-0').on('click', function (e) {
            e.preventDefault();
            $('#descubreEAuthorAlt-0').slideToggle();
        });
        $('#descubreShowAlt-1').on('click', function (e) {
             e.preventDefault();
            $('#descubreEAuthorAlt-1').slideToggle();
        });
        $('#descubreShowAlt-2').on('click', function (e) {
            e.preventDefault();
            $('#descubreEAuthorAlt-2').slideToggle();
        });
        $('#descubreShowAlt-3').on('click', function (e) {

            e.preventDefault();
            $('#descubreEAuthorAlt-3').slideToggle();
        });
        $('#descubreEEvaluation').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#descubreEEvaluationID').prop('disabled', !marcado);
        });
        $("#descubreEEvaluationHelpLnk").click(function () {
            $("#descubreEEvaluationHelp").toggle();
            return false;

        })

        $exeAuthoring.iDevice.gamification.itinerary.addEvents();
    },
    loadImage: function (number, url) {
        var validExt = ['jpg', 'png', 'gif', 'jpeg', 'svg'],
            selectedFile = url,
            ext = selectedFile.split('.').pop().toLowerCase();
        if ((selectedFile.indexOf('resources') == 0 || selectedFile.indexOf('/previews/') == 0) && validExt.indexOf(ext) == -1) {
            $exeDevice.showMessage(_("Supported formats") + ": jpg, jpeg, gif, png, svg");
            return false;
        }
        var url = selectedFile,
            alt = $('#descubreEAlt-' + number).val(),
            x = parseFloat($('#descubreEXImage-' + number).val()),
            y = parseFloat($('#descubreEYImage-' + number).val());
        $('#descubreEImage-' + number).hide();
        $('#descubreEImage-' + number).attr('alt', 'No image');
        $('#descubreECursor-' + number).hide();
        $('#descubreENoImage-' + number).show();
        if (url.length > 0) {
            $exeDevice.showImage(url, x, y, alt, number);
        }

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
    showSelectOrder: function (messages) {
        if (messages) {
            $('.Descubre-EOrders').slideDown();
        } else {
            $('.Descubre-EOrders').slideUp();
        }
    },



    updateGameMode: function (feedback) {
        $('#descubreEHasFeedBack').prop('checked', feedback);
        if (feedback) {
            $('#descubreEFeedbackP').slideDown();
        }
        if (!feedback) {
            $('#descubreEFeedbackP').slideUp();
        }
    },

    clearQuestion: function () {
        for (var i = 0; i < $exeDevice.NUMMAXCARD; i++) {

            $('.Descubre-Type-' + i)[0].checked = true;
            $('#descubreEURLImage-' + i).val('');
            $('#descubreEXImage-' + i).val('0');
            $('#descubreEYImage-' + i).val('0');
            $('#descubreEAuthor-' + i).val('');
            $('#descubreEAlt-' + i).val('');
            $('#descubreEText-' + i).val('');
            $('#descubreEURLAudio-' + i).val('');
            $('#descubreEColor-' + i).val('#000000');
            $('#descubreEBackColor-' + i).val('#ffffff');
        }
        $exeDevice.changeTypeQuestion(0, 0, 0, 0);
    },

    addQuestion: function () {
        if ($exeDevice.wordsGame.length >= 20) {
            $exeDevice.showMessage($exeDevice.msgs.msgPairsMax);
            return;
        }
        var valida = $exeDevice.validateQuestion();
        if (valida) {
            $exeDevice.clearQuestion();
            $exeDevice.wordsGame.push($exeDevice.getCuestionDefault());
            $exeDevice.active = $exeDevice.wordsGame.length - 1;
            $('#descubreENumberQuestion').text($exeDevice.wordsGame.length);
            $exeDevice.typeEdit = -1;
            $('#descubreEPaste').hide();
            $('#descubreENumQuestions').text($exeDevice.wordsGame.length);
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
            $('#descubreEPaste').hide();
            $('#descubreENumQuestions').text($exeDevice.wordsGame.length);
            $('#descubreENumberQuestion').text($exeDevice.active + 1);
            $exeDevice.updateQuestionsNumber();
        }

    },

    copyQuestion: function () {
        if ($exeDevice.validateQuestion() != false) {
            $exeDevice.typeEdit = 0;
            $exeDevice.clipBoard = $exeDevice.wordsGame[$exeDevice.active];
            $('#descubreEPaste').show();
        }

    },

    cutQuestion: function () {
        if ($exeDevice.validateQuestion() != false) {
            $exeDevice.numberCutCuestion = $exeDevice.active;
            $exeDevice.typeEdit = 1;
            $('#descubreEPaste').show();

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
        if ($exeDevice.wordsGame.length >= 20) {
            $exeDevice.showMessage($exeDevice.msgs.msgPairsMax);
            return;
        }
        if ($exeDevice.typeEdit == 0) {
            $exeDevice.active++;
            var p = $.extend(true, {}, $exeDevice.clipBoard);
            $exeDevice.wordsGame.splice($exeDevice.active, 0, p);
            $exeDevice.showQuestion($exeDevice.active);
            $('#descubreENumQuestions').text($exeDevice.wordsGame.length);
        } else if ($exeDevice.typeEdit == 1) {
            $('#descubreEPaste').hide();
            $exeDevice.typeEdit = -1;
            $exeDevice.arrayMove($exeDevice.wordsGame, $exeDevice.numberCutCuestion, $exeDevice.active);
            $exeDevice.showQuestion($exeDevice.active);
            $('#descubreENumQuestions').text($exeDevice.wordsGame.length);
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

    updateFieldGame: function (game) {
        $exeDevice.active = 0;
        $exeAuthoring.iDevice.gamification.itinerary.setValues(game.itinerary);
        game.percentajeFB = typeof game.percentajeFB != "undefined" ? game.percentajeFB : 100;
        game.feedBack = typeof game.feedBack != "undefined" ? game.feedBack : false;
        game.customMessages = typeof game.customMessages == "undefined" ? false : game.customMessages;
        game.timeShowSolution = typeof game.timeShowSolution == "undefined" ? 3 : game.timeShowSolution;
        game.showSolution = typeof game.showSolution == "undefined" ? true : game.showSolution;
        game.gameMode = typeof game.gameMode == "undefined" ? 0 : game.gameMode;
        game.gameLevels = typeof game.gameLevels == "undefined" ? 1 : game.gameLevels;
        game.showCards = typeof game.showCards == "undefined" ? false : game.showCards;
        game.percentajeQuestions = typeof game.percentajeQuestions == "undefined" ? 100 : game.percentajeQuestions;
        game.evaluation = typeof game.evaluation != "undefined" ? game.evaluation : false;
        game.evaluationID = typeof game.evaluationID != "undefined" ? game.evaluationID : '';
        $exeDevice.id = typeof game.id != "undefined" ? game.id : false;
        $('#descubreEShowMinimize').prop('checked', game.showMinimize);
        $('#descubreECaseSensitive').prop('checked', game.caseSensitive);
        $("#descubreEHasFeedBack").prop('checked', game.feedBack);
        $("#descubreEPercentajeFB").val(game.percentajeFB);
        $('#descubreECustomMessages').prop('checked', game.customMessages);
        $('#descubreEShowCards').prop('checked', game.showCards);
        $('#descubreEPercentajeQuestions').val(game.percentajeQuestions);
        $('#descubreETime').val(game.time);
        $('#descubreEAttempts').val(game.attempts);
        $('#descubreETimeShowSolution').val(game.timeShowSolution);
        $('#descubreEAuthor').val(game.author);
        $('#descubreETimeShowSolution').prop('disabled', game.showCards);
        $('#descubreEShowSolution').prop('checked', game.showSolution);
        $("input[name='qtxgamemode'][value='" + game.gameMode + "']").prop("checked", true);
        $("input[name='qtxgamelevels'][value='" + game.gameLevels + "']").prop("checked", true);
        if (game.gameMode == 1) {
            $('#descubreEDatosCarta-2').show();
        } else if (game.gameMode == 2) {
            $('#descubreEDatosCarta-2').show();
            $('#descubreEDatosCarta-3').show();
        }
        $('#descubreEEvaluation').prop('checked', game.evaluation);
        $('#descubreEEvaluationID').val(game.evaluationID);
        $("#descubreEEvaluationID").prop('disabled', (!game.evaluation));
        $exeAuthoring.iDevice.gamification.scorm.setValues(game.isScorm, game.textButtonScorm, game.repeatActivity);
        $exeDevice.showSelectOrder(game.customMessages);
        $exeDevice.wordsGame = game.wordsGame;
        $exeDevice.updateGameMode(game.feedBack);
        $('#descubreENumQuestions').text($exeDevice.wordsGame.length);
        $('#descubreEPercentajeFB').prop('disabled', !game.feedBack);
        $exeDevice.updateQuestionsNumber();
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
        link.download = _("Activity") + "-Descubre.json";
        document.getElementById('gameQEIdeviceForm').appendChild(link);
        link.click();
        setTimeout(function () {
            document.getElementById('gameQEIdeviceForm').removeChild(link);
            window.URL.revokeObjectURL(data);
        }, 100);
    },
    importText: function(content){
        var lines = content.split('\n'),
             lineFormat = /^([^#]+)#([^#]+)(#([^#]+))?(#([^#]+))?$/,
             questions = [];
             types = [0, 0, 0]
         lines.forEach(function(line) {
            if (lineFormat.test(line)) {
                var q = $exeDevice.getCuestionDefault();
                var linarray = line.trim().split("#");
                var typeGame = linarray.length - 2;
                types[typeGame]++;
                for (var i = 0; i < q.data.length; i++){
                    if(i < linarray.length){
                        q.data[i].type = 1;
                        q.data[i].eText =linarray[i];
                    }
                }
                questions.push(q);
            }
        });
        var gameMode = 2;
        if(types[0] > 0){
            gameMode = 0
        }else if(types[1] > 0){
            gameMode = 1
        }
        if(types[gameMode] > 0){
            $("input[name='qtxgamemode'][value='" + gameMode + "']").prop("checked", true);
            $('#descubreEDatosCarta-2').hide();
            $('#descubreEDatosCarta-3').hide();
            if (gameMode == 1) {
                $('#descubreEDatosCarta-2').show();
            } else if (gameMode == 2) {
                $('#descubreEDatosCarta-2').show();
                $('#descubreEDatosCarta-3').show();
            }
            return questions
        } else {
            return false
        }
    },
    importMoodle(xmlString) {
        var xmlDoc = $.parseXML(xmlString),
            $xml = $(xmlDoc);
        if ($xml.find("GLOSSARY").length > 0) {
            return $exeDevice.importGlosary(xmlString);
        }
        else if ($xml.find("quiz").length > 0) {
            return $exeDevice.importCuestionaryXML(xmlString);
        } else {
            return false;
        }
      },
    importCuestionaryXML: function(xmlText) {
        var parser = new DOMParser(),
            xmlDoc = parser.parseFromString(xmlText, "text/xml"),
            $xml = $(xmlDoc);

        if ($xml.find("parsererror").length > 0) {
            return false;
        }
        var $quiz = $xml.find("quiz").first();
        if ($quiz.length === 0) {
            return false;
        }
        var wordsJson = [];
        $quiz.find("question").each(function() {
            var $question = $(this),
                type = $question.attr('type');
            if (type !== 'shortanswer') {
                return true
            }
            var questionText = $question.find("questiontext").first().text().trim(),
                $answers = $question.find("answer"),
                word = '',
                maxFraction = -1;
            $answers.each(function() {
                var $answer = $(this),
                    answerText = $answer.find('text').eq(0).text(),
                    currentFraction = parseInt($answer.attr('fraction'));
                if (currentFraction > maxFraction) {
                    maxFraction = currentFraction;
                    word = answerText;
                }
            });
            if (word && word.length > 0 && questionText && questionText.length > 0  ) {
                wordsJson.push({
                    definition: $exeDevice.removeTags(questionText),
                    word: $exeDevice.removeTags(word),
                });
            }
        });
        var validQuestions = [];
        wordsJson.forEach(function(question) {
            var p = $exeDevice.getCuestionDefault();
                p.data[0].type = 1;
                p.data[0].eText =question.word;
                p.data[1].type = 1;
                p.data[1].eText =question.definition;
            if (question.word.length > 0 && question.definition.length > 0) {
                $exeDevice.wordsGame.push(p);
                validQuestions.push(p);
            }
        });

        return validQuestions.length > 0 ? $exeDevice.wordsGame : false;
    },
    importGlosary: function(xmlText) {
        var parser = new DOMParser(),
            xmlDoc = parser.parseFromString(xmlText, "text/xml"),
            $xml = $(xmlDoc);
        if ($xml.find("parsererror").length > 0) {
            return false;
        }
        var $entries = $xml.find("ENTRIES").first();
        if ($entries.length === 0) {
            return false;
        }
        var wordsJson = [];
        $entries.find("ENTRY").each(function() {
            var $this = $(this),
                concept = $this.find("CONCEPT").text(),
                definition = $this.find("DEFINITION").text().replace(/<[^>]*>/g, '');  // Elimina HTML
            if (concept && definition) {
                wordsJson.push({
                    word: concept,
                    definition: definition
                });
            }
        });
        var validQuestions = [];
        wordsJson.forEach(function(question) {
            var p = $exeDevice.getCuestionDefault();
                p.data[0].type = 1;
                p.data[0].eText =question.word;
                p.data[1].type = 1;
                p.data[1].eText =question.definition;
            if (question.word.length > 0 && question.definition.length > 0) {
                $exeDevice.wordsGame.push(p);
                validQuestions.push(p);
            }
        });
        return validQuestions.length > 0 ? $exeDevice.wordsGame : false;
    },
    importGame: function (content, filetype) {
        var game = $exeDevice.isJsonString(content);
        if (content && content.includes('\u0000')){
            $exeDevice.showMessage(_('El formato de las preguntas del archivo no es correcto'));
            return;
        } else if (!game && content){
            var valids = false;
            if(filetype.match('text/plain')){
                valids = $exeDevice.importText(content);
            }else if(filetype.match('application/xml') || filetype.match('text/xml')){
                valids =  $exeDevice.importMoodle(content);
            }
            if (valids){
               $exeDevice.wordsGame = valids;
               $('#descubreENumQuestions').text(valids.length)
            } else {
                $exeDevice.showMessage(_('El formato de las preguntas del archivo no es correcto'));
                return;
            }
        } else if (!game || typeof game.typeGame == "undefined") {
            $exeDevice.showMessage($exeDevice.msgs.msgESelectFile);
            return;
        } else if (game.typeGame == 'Descubre') {
            game.id = $exeDevice.generarID();
            $exeDevice.updateFieldGame(game);
            var instructions = game.instructionsExe || game.instructions,
                tAfter = game.textAfter || "",
                textFeedBack = game.textFeedBack || "";
            tinyMCE.get('eXeGameInstructions').setContent(unescape(instructions));
            tinyMCE.get('eXeIdeviceTextAfter').setContent(unescape(tAfter));
            tinyMCE.get('descubreEFeedBackEditor').setContent(unescape(textFeedBack));
        } else if (game.typeGame !== 'Descubre') {
            eXe.app.alert($exeDevice.msgs.msgESelectFile);
            return;
        }
        $exeDevice.active = 0;
        $exeDevice.showQuestion($exeDevice.active);
        $exeDevice.deleteEmptyQuestion();
        $exeDevice.updateQuestionsNumber();
        $('.exe-form-tabs li:first-child a').click();
    },
    deleteEmptyQuestion: function () {
        var url = $('#descubreEURLImage-0').val().trim(),
            audio = $('#descubreEURLAudio-0').val().trim(),
            eText = $('#descubreEText-0').val().trim();
        if ($exeDevice.wordsGame && $exeDevice.wordsGame.length > 1) {
            if (url.length < 3 && audio.length < 3 && eText.trim().length == 0) {
                $exeDevice.removeQuestion();
            }
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

    clickImage: function (img, epx, epy, type) {
        var $cursor = $('#descubreECursor-0'),
            $x = $('#descubreEXImage-0'),
            $y = $('#descubreEYImage-0'),
            $img = $(img);
        if (type == 1) {
            $cursor = $('#descubreECursor-1');
            $x = $('#descubreEXImage-1');
            $y = $('#descubreEYImage-1');

        } else if (type == 2) {
            $cursor = $('#descubreECursor-2');
            $x = $('#descubreEXImage-2');
            $y = $('#descubreEYImage-2');

        } else if (type == 3) {
            $cursor = $('#descubreECursor-3');
            $x = $('#descubreEXImage-3');
            $y = $('#descubreEYImage-3');

        }
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