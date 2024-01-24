/**
/**
 * SeleccionaMedias Activity iDevice (edition code)
 * Version: 1.5
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Manuel Narvaez Martinez
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $exeDevice = {
    i18n: {
        category: _('Games'),
        name: _('Select media files')
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
    iDevicePath: "/scripts/idevices/seleccionamedias-activity/edition/",
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
        "msgTimeOver": _("Time has finished"),
        "mgsAllPhrases": _("You completed all the activities!"),
        "msgNumbersAttemps": _("Number of pending activities"),
        "msgActivities": _("Activities"),
        "msgCheck": _("Check"),
        "msgContinue": _("Continue"),
        "msgAllOK": _("Brilliant! All correct!"),
        "msgAgain": _("Please try again"),
        "msgUncompletedActivity": _("Not done activity"),
        "msgSuccessfulActivity": _("Activity: Passed. Score: %S"),
        "msgUnsuccessfulActivity": _("Activity: Not passed. Score: %S"),
        "msgChangeMode": _("Change visualization mode")

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
        msgs.msgCompleteData = _("You must indicate an image, a text or/and an audio for each letter");
        msgs.msgPairsMax = _("Maximum number of activities: 30");
        msgs.msgIDLenght = _('The report identifier must have at least 5 characters');

    },
    createForm: function () {
        var path = $exeDevice.iDevicePath,
            html = '\
            <div id="gameQEIdeviceForm">\
            <div class="exe-idevice-info">' + _("Create interactive activities in which players will have to select the correct multimedia cards.") + ' <a href="https://www.youtube.com/watch?v=t5okkUyGTl8" hreflang="es" rel="lightbox"  target="_blank">' + _("Use Instructions") + '</a></div>\
            <div class="exe-form-tab" title="' + _('General settings') + '">\
            ' + $exeAuthoring.iDevice.gamification.instructions.getFieldset(_("Select the right cards")) + '\
                <fieldset class="exe-fieldset exe-fieldset-closed">\
                    <legend><a href="#">' + _("Options") + '</a></legend>\
                    <div>\
                        <p>\
                            <label for="slcmEShowMinimize"><input type="checkbox" id="slcmEShowMinimize">' + _("Show minimized.") + '</label>\
                        </p>\
                        <p>\
                            <label for="slcmETime">' + _("Time to complete the game") + '(m):</label><input type="number" name="slcmETime" id="slcmETime" value="0" min="0" max="120" step="1" />\
                        </p>\
                        <p>\
                            <label for="slcmEAttemptsNumber">' + _("Number of attempts") + ':\
                            <input type="number" name="slcmEAttemptsNumber" id="slcmEAttemptsNumber" value="1" min="1" max="9" /> </label>\
                        </p>\
                        <p>\
                            <label for="slcmEShowSolution"><input type="checkbox" checked id="slcmEShowSolution"> ' + _("Show solutions") + '. </label> \
                        </p>\
                        <p id="slcmTimeShowDiv">\
							<label for="slcmETimeShowSolution">' + _("Time while the cards will be shown (seconds)") + ':\
							<input type="number" name="slcmETimeShowSolution" id="slcmETimeShowSolution" value="4" min="1" max="999" /> </label>\
                        </p>\
                        <p>\
                            <label for="slcmEPercentajeQuestions">' + _('% Activities') + ':</label><input type="number" name="slcmEPercentajeQuestions" id="slcmEPercentajeQuestions" value="100" min="1" max="100" />\
                            <span id="slcmENumeroPercentaje">1/1</span>\
                        </p>\
                        <p id="slcmEANumberMaxDiv">\
							<label for="slcmEANumberMaxCard">' + _("Maximum number of cards") + ':\
							<input type="number" name="slcmEANumberMaxCard" id="slcmEANumberMaxCard" value="30" min="1" max="30" /> </label>\
                        </p>\
                        <p id="slcmECustomMessagesDiv">\
                            <label for="slcmECustomMessages"><input type="checkbox" id="slcmECustomMessages">' + _("Custom messages") + '.</label>\
                        </p>\
                        <p>\
                            <label for="slcmEModeTable"><input type="checkbox" id="slcmEModeTable"> ' + _("Table mode") + '. </label> \
                        </p>\
                        <p>\
                            <label for="slcmEHasFeedBack"><input type="checkbox"  id="slcmEHasFeedBack"> ' + _("Feedback") + '. </label> \
                            <label for="slcmEPercentajeFB"></label><input type="number" name="slcmEPercentajeFB" id="slcmEPercentajeFB" value="100" min="5" max="100" step="5" disabled />\
                        </p>\
                        <p id="slcmEFeedbackP" class="SLCME-EFeedbackP">\
                            <textarea id="slcmEFeedBackEditor" class="exe-html-editor"></textarea>\
                        </p>\
                        <p>\
                            <label for="slcmEAuthor">' + _('Authorship') + ': </label><input id="slcmEAuthor" type="text" />\
                        </p>\
                        <p>\
                            <strong class="GameModeLabel"><a href="#slcmEEvaluationHelp" id="slcmEEvaluationHelpLnk" class="GameModeHelpLink" title="' + _("Help") + '"><img src="' + path + 'quextIEHelp.gif"  width="16" height="16" alt="' + _("Help") + '"/></a></strong>\
							<label for="slcmEEvaluation"><input type="checkbox" id="slcmEEvaluation"> ' + _("Progress report") + '. </label> \
							<label for="slcmEEvaluationID">' + _("Identifier") + ':\
							<input type="text" id="slcmEEvaluationID" disabled/> </label>\
                        </p>\
                        <div id="slcmEEvaluationHelp" class="SLCME-TypeGameHelp">\
                            <p>' +_("You must indicate the identifier. It can be a word, a phrase or a number of more than four characters, which you will use to mark the activities that will be taken into account in this progress report. It must be the same in all iDevices of a report and different in those of each report.") + '</p>\
                        </div>\
                    </div>\
                </fieldset>\
                <fieldset class="exe-fieldset">\
                <legend><a href="#">' + _('Activities') + '</a></legend>\
                    <div class="SLCME-EPanel" id="slcmEPanel">\
                        <div class="SLCME-ENavigationButtons" id="slcmButtonsPrhaseDiv" >\
                            <a href="#" id="slcmEAdd" class="SLCME-ENavigationButton" title="' + _('Add activity') + '"><img src="' + path + 'quextIEAdd.png"  alt="' + _('Add activity') + '" class="SLCME-EButtonImage b-add" /></a>\
                            <a href="#" id="slcmEFirst" class="SLCME-ENavigationButton"  title="' + _('First activity') + '"><img src="' + path + 'quextIEFirst.png"  alt="' + _('First activity') + '" class="SLCME-EButtonImage b-first" /></a>\
                            <a href="#" id="slcmEPrevious" class="SLCME-ENavigationButton" title="' + _('Previous activity') + '"><img src="' + path + 'quextIEPrev.png" alt="' + _('Previous activity') + '" class="SLCME-EButtonImage b-prev" /></a>\
                            <span class="sr-av">' + _("Activity number:") + '</span><span class="SLCME-NumberPhrase" id="slcmENumberPhrase">1</span>\
                            <a href="#" id="slcmENext" class="SLCME-ENavigationButton"  title="' + _('Next activity') + '"><img src="' + path + 'quextIENext.png" alt="' + _('Next activity') + '" class="SLCME-EButtonImage b-next" /></a>\
                            <a href="#" id="slcmELast" class="SLCME-ENavigationButton"  title="' + _('Last activity') + '"><img src="' + path + 'quextIELast.png" alt="' + _('Last activity') + '" class="SLCME-EButtonImage b-last" /></a>\
                            <a href="#" id="slcmEDelete" class="SLCME-ENavigationButton" title="' + _('Delete activity') + '"><img src="' + path + 'quextIEDelete.png" alt="' + _('Delete activity') + '" class="SLCME-EButtonImage b-delete" /></a>\
                            <a href="#" id="slcmECopy" class="SLCME-ENavigationButton" title="' + _('Copy activity') + '"><img src="' + path + 'quextIECopy.png" + alt="' + _('Copy activity') + '" class="SLCME-EButtonImage b-copy" /></a>\
                            <a href="#" id="slcmECut" class="SLCME-ENavigationButton" title="' + _('Cut activity') + '"><img src="' + path + 'quextIECut.png" + alt="' + _('Cut activity') + '" class="SLCME-EButtonImage b-copy" /></a>\
                            <a href="#" id="slcmEPaste" class="SLCME-ENavigationButton"  title="' + _('Paste activity') + '"><img src="' + path + 'quextIEPaste.png" alt="' + _('Paste activity') + '" class="SLCME-EButtonImage b-paste" /></a>\
                        </div>\
                        <p class="SLCME-ENumActivity" id="slcmActivityNumberDiv">' + _('Activity') + ' <span id="slcmActivityNumber">1</span></p>\
                        <p class="SLCME-ECustomMessageDef" id="slcmEDefinitionDiv">\
                            <label for="slcmEDefinition">' + _('Statement') + ':</label><input type="text" id="slcmEDefinition">\
                        </p>\
                        <p class="SLCME-ECustomMessageAudio">\
                            <label>' + _("Audio") + ':</label>\
                            <input type="text" id="slcmEURLAudioDefinition" class="exe-file-picker SLCME-EURLAudio"  />\
                            <a href="#"id="slcmEPlayAudioDefinition" class="SLCME-ENavigationButton SLCME-EPlayVideo" title="' + _("Audio") + '"><img src="' + path + 'quextIEPlay.png" alt="Play audio" class="SLCME-EButtonImage b-play" /></a>\
                        </p>\
                        <p class="SLCME-ECustomMessageDiv" id="slcmCustomMessageOKDiv">\
                            <label for="slcmEMessageOK">' + _('Success') + ':</label><input type="text" id="slcmEMessageOK"/>\
                            <label>' + _("Audio") + ':</label>\
                            <input type="text" id="slcmEURLAudioOK" class="exe-file-picker SLCME-EURLAudio"  />\
                            <a href="#"id="slcmEPlayAudioOK" class="SLCME-ENavigationButton SLCME-EPlayVideo" title="' + _("Audio") + '"><img src="' + path + 'quextIEPlay.png" alt="Play audio" class="SLCME-EButtonImage b-play" /></a>\
                        </p>\
                        <p class="SLCME-ECustomMessageDiv" id="slcmCustomMessageKODiv">\
                            <label for="slcmEMessageKO">' + _('Error') + ':</label><input type="text" id="slcmEMessageKO"/>\
                            <label>' + _("Audio") + ':</label>\
                            <input type="text" id="slcmEURLAudioKO" class="exe-file-picker SLCME-EURLAudio"  />\
                            <a href="#"id="slcmEPlayAudioKO" class="SLCME-ENavigationButton SLCME-EPlayVideo" title="' + _("Audio") + '"><img src="' + path + 'quextIEPlay.png" alt="Play audio" class="SLCME-EButtonImage b-play" /></a>\
                        </p>\
                        <p class="SLCME-EPhrase" id="slcmEPhrase">\
                        </p>\
                        <div class="SLCME-EContents" id="slcmButtonCardDiv" >\
                            <div class="SLCME-ENavigationButtons">\
                            <a href="#" id="slcmEAddC" class="SLCME-ENavigationButton" title="' + _('Add letter') + '"><img src="' + path + 'quextIEAdd.png"  alt="' + _('Add card') + '" class="SLCME-EButtonImage b-add" /></a>\
                            <a href="#" id="slcmEDeleteC" class="SLCME-ENavigationButton" title="' + _('Delete letter') + '"><img src="' + path + 'quextIEDelete.png" alt="' + _('Delete card') + '" class="SLCME-EButtonImage b-delete" /></a>\
                            <a href="#" id="slcmECopyC" class="SLCME-ENavigationButton" title="' + _('Copy letter') + '"><img src="' + path + 'quextIECopy.png" + alt="' + _('Copy card') + '" class="SLCME-EButtonImage b-copy" /></a>\
                            <a href="#" id="slcmECutC" class="SLCME-ENavigationButton" title="' + _('Cut letter') + '"><img src="' + path + 'quextIECut.png" + alt="' + _('Cut card') + '" class="SLCME-EButtonImage b-cut" /></a>\
                            <a href="#" id="slcmEPasteC" class="SLCME-ENavigationButton"  title="' + _('Paste letter') + '"><img src="' + path + 'quextIEPaste.png" alt="' + _('Paste card') + '" class="SLCME-EButtonImage b-paste" /></a>\
                        </div>\
                        </div>\
                        <div class="SLCME-ENumPhrasesDiv" id="slcmENumPhrasesDiv">\
                            <div class="SLCME-ENumPhraseS"><span class="sr-av">' + _("Phrases:") + '</span></div> <span class="SLCME-ENumPhrases" id="slcmENumPhrases">1</span>\
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

    removeCard: function () {
        var numcards = $('#slcmEPhrase').find('div.SLCME-EDatosCarta').length;

        if (numcards < 2) {
            $exeDevice.showMessage($exeDevice.msgs.msgEOneQuestion);
        } else {
            var next = $('#slcmEDatosCarta-' + $exeDevice.activeID).next('div.SLCME-EDatosCarta').data('id'),
                prev = $('#slcmEDatosCarta-' + $exeDevice.activeID).prev('div.SLCME-EDatosCarta').data('id')
            if (prev != null) {
                $('#slcmEDatosCarta-' + $exeDevice.activeID).remove();
                $exeDevice.activeID = prev;
            } else if (next != null) {
                $('#slcmEDatosCarta-' + $exeDevice.activeID).remove();
                $exeDevice.activeID = next;
            }
            $('.SLCME-EDatosCarta').removeClass('SLCME-EActive');
            $('#slcmEDatosCarta-' + $exeDevice.activeID).addClass('SLCME-EActive');
            $('#slcmEPasteC').hide();
        }
    },
    copyCard: function () {
        $exeDevice.typeEditC = 0;
        $exeDevice.idPaste = $exeDevice.activeID;
        $('#slcmEPasteC').show();
    },

    cutCard: function () {
        $exeDevice.typeEditC = 1;
        $exeDevice.idPaste = $exeDevice.activeID;
        $('#slcmEPasteC').show();
    },

    pasteCard: function () {
        if ($exeDevice.typeEditC == 0) {
            var $cardcopy = $('#slcmEDatosCarta-' + $exeDevice.idPaste),
                $cardactive = $('#slcmEDatosCarta-' + $exeDevice.activeID),
                dataCard = $exeDevice.cardToJson($cardcopy);
            dataCard.id = $exeDevice.getID();
            $cardactive.after($exeDevice.jsonToCard(dataCard, true));
            $exeDevice.activeID = dataCard.id;

        } else if ($exeDevice.typeEditC == 1) {
            $('#slcmEPasteC').hide();
            $exeDevice.typeEditC = -1;
            var $cardcopy = $('#slcmEDatosCarta-' + $exeDevice.idPaste),
                $cardactive = $('#slcmEDatosCarta-' + $exeDevice.activeID);
            if ($exeDevice.idPaste != $exeDevice.activeID) {
                $cardactive.after($cardcopy)
            }

        }
    },
    jsonToCard: function (p, inload) {
        var $card = $exeDevice.addCard(!inload);
        $card.find('.SLCME-EAuthor').eq(0).val(p.author);
        $card.find('.SLCME-EAlt').eq(0).val(p.alt);
        $card.find('.SLCME-EURLImage').eq(0).val(p.url);
        $card.find('.SLCME-EURLAudio').eq(0).val(p.audio);
        $card.find('.SLCME-EText').eq(0).val(p.eText);
        $card.find('.SLCME-ETextDiv').eq(0).text(p.eText);
        $card.find('.SLCME-EColor').eq(0).val(p.color);
        $card.find('.SLCME-EBackColor').eq(0).val(p.backcolor);
        $card.find('.SLCME-EState').eq(0).prop('checked',p.state)

        $exeDevice.showImage($exeDevice.activeID);
        if (p.eText.trim().length > 0) {
            $card.find('.SLCME-ETextDiv').show();
        } else {
            $card.find('.SLCME-ETextDiv').hide();
        }

        $card.find('.SLCME-ETextDiv').eq(0).css({
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
        var percentaje = parseInt($exeDevice.removeTags($('#slcmEPercentajeQuestions').val()));
        if (isNaN(percentaje)) {
            return;
        }
        percentaje = percentaje < 1 ? 1 : percentaje;
        percentaje = percentaje > 100 ? 100 : percentaje;
        var num = Math.round((percentaje * $exeDevice.phrasesGame.length) / 100);
        num = num == 0 ? 1 : num;
        $('#slcmENumeroPercentaje').text(num + "/" + $exeDevice.phrasesGame.length)
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
        $('.SLCME-EDatosCarta').removeClass('SLCME-EActive');
        $exeDevice.activeID = $('.SLCME-EDatosCarta').eq(0).data('id');
        $('.SLCME-EDatosCarta').eq(0).addClass('SLCME-EActive');
        $('#slcmEMessageOK').val(phrase.msgHit);
        $('#slcmEMessageKO').val(phrase.msgError);
        $('#slcmEDefinition').val(phrase.definition);
        $('#slcmENumberPhrase').text($exeDevice.active + 1);
        $('#slcmActivityNumber').text($exeDevice.active + 1);
        $('#slcmEURLAudioDefinition').val(phrase.audioDefinition);
        $('#slcmEURLAudioOK').val(phrase.audioHit);
        $('#slcmEURLAudioKO').val(phrase.audioError);
        $exeDevice.stopSound();
    },
    initPhrases: function () {
        $exeDevice.active = 0;
        $exeDevice.phrasesGame.push($exeDevice.getPhraseDefault());
        $exeDevice.addCard(false);
        $('.SLCME-ECustomMessageDiv').hide();
    },
    addCard: function (clone) {
        $exeDevice.activeID = $exeDevice.getID();
        var buttonI = clone ? '<input type="button" class="exe-pick-any-file" value=' + ('Selecciona') + ' id="_browseForslcmEURLImage-' + $exeDevice.activeID + '" onclick="$exeAuthoring.iDevice.filePicker.openFilePicker(this)">' : '',
            buttonA = clone ? '<input type="button" class="exe-pick-any-file" value=' + ('Selecciona') + ' id="_browseForslcmEURLAudio-' + $exeDevice.activeID + '" onclick="$exeAuthoring.iDevice.filePicker.openFilePicker(this)">' : '';
        $('#slcmEPhrase').find('div.SLCME-EDatosCarta').removeClass('SLCME-EActive');
        var path = $exeDevice.iDevicePath,
            card = '<div class="SLCME-EDatosCarta SLCME-EActive" id="slcmEDatosCarta-' + $exeDevice.activeID + '" data-id="' + $exeDevice.activeID + '">\
           <div class="SLCME-EMultimedia">\
                <div class="SLCME-ECard">\
                    <img class=".SLCME-EHideSLCME-EImage" id="slcmEImage-' + $exeDevice.activeID + '"  src="' + path + 'quextIEImage.png" alt="' + _("No image") + '" />\
                    <img class="SLCME-ECursor" id="slcmECursor-' + $exeDevice.activeID + '" src="' + path + 'quextIECursor.gif" alt="" />\
                    <img class=".SLCME-EHideSLCME-NoImage" id="slcmENoImage-' + $exeDevice.activeID + '" src="' + path + 'quextIEImage.png" alt="' + _("No image") + '" />\
                    <div class="SLCME-ETextDiv" id="slcmETextDiv-' + $exeDevice.activeID + '"></div>\
                </div>\
            </div>\
           <span class="SLCME-ETitleText" id="slcmETitleText-' + $exeDevice.activeID + '">' + _("Text") + '</span>\
           <div class="SLCME-EInputText" id="slcmEInputText-' + $exeDevice.activeID + '">\
                <label class="sr-av">' + _("Text") + '</label><input type="text" id="slcmEText-' + $exeDevice.activeID + '" class="SLCME-EText" />\
                <label id="slcmELblColor-' + $exeDevice.activeID + '" class="SLCME-LblColor">' + _("Font") + ': </label><input id="slcmEColor-' + $exeDevice.activeID + '"  type="color"  class="SLCME-EColor" value="#000000">\
                <label id="slcmELblBgColor-' + $exeDevice.activeID + '"  class="SLCME-LblBgColor">' + _("Background") + ': </label><input id="slcmEBgColor-' + $exeDevice.activeID + '"  type="color"   class="SLCME-EBackColor" value="#ffffff">\
            </div>\
           <span class="SLCME-ETitleImage"id="slcmETitleImage-' + $exeDevice.activeID + '">' + _("Image") + '</span>\
           <div class="SLCME-EInputImage"  id="slcmEInputImage-' + $exeDevice.activeID + '">\
               <label class="sr-av" >URL</label>\
               <input type="text" id="slcmEURLImage-' + $exeDevice.activeID + '" class="exe-file-picker SLCME-EURLImage"/>\
               ' + buttonI + '\
               <a href="#" id="slcmEPlayImage-' + $exeDevice.activeID + '" class="SLCME-ENavigationButton SLCME-EPlayVideo" title="' + _("Show") + '"><img src="' + path + 'quextIEPlay.png" alt="' + _("Show") + '" class="SLCME-EButtonImage b-play" /></a>\
               <a href="#" id="slcmEShowMore-' + $exeDevice.activeID + '" class="SLCME-ENavigationButton SLCME-EShowMore" title="' + _("More") + '"><img src="' + path + 'quextEIMore.png" alt="' + _("More") + '" class="SLCME-EButtonImage b-play" /></a>\
           </div>\
           <div class="SLCME-EAuthorAlt"  id="slcmEAuthorAlt-' + $exeDevice.activeID + '">\
               <div class="SLCME-EInputAuthor">\
                   <label>' + _("Authorship") + '</label><input type="text" class="SLCME-EAuthor" />\
               </div>\
               <div class="SLCME-EInputAlt">\
                   <label>' + _("Alternative text") + '</label><input  type="text" class="SLCME-EAlt" />\
               </div>\
           </div>\
           <span >' + _("Audio") + '</span>\
           <div class="SLCME-EInputAudio" >\
               <label class="sr-av" >URL</label>\
               <input type="text" id="slcmEURLAudio-' + $exeDevice.activeID + '" class="exe-file-picker SLCME-EURLAudio"  />\
               ' + buttonA + '\
               <a href="#"id="slcmEPlayAudio-' + $exeDevice.activeID + '" class="SLCME-ENavigationButton SLCME-EPlayVideo" title="' + _("Audio") + '"><img src="' + path + 'quextIEPlay.png" alt="Play" class="SLCME-EButtonImage b-play" /></a>\
           </div>\
           <p>\
                <label for="slcmState-' + $exeDevice.activeID + '">' + _("Correct answer") + ': <input type="checkbox" id="slcmState-' + $exeDevice.activeID + '" class="SLCME-EState"></label>\
            </p>\
       </div>';

        $('#slcmEPhrase').append(card);
        var $card = $('#slcmEPhrase').find('div.SLCME-EDatosCarta').last();
        $exeDevice.addEventCard($exeDevice.activeID);
        $exeDevice.showImage($exeDevice.activeID);
        $('#slcmETextDiv-' + $exeDevice.activeID).hide();
        return $card;
    },
    addEventCard: function (id) {
        $('#slcmEAuthorAlt-' + id).hide();
        $('#slcmEURLImage-' + id).on('change', function () {
            $exeDevice.loadImage(id);
        });
        $('#slcmEPlayImage-' + id).on('click', function (e) {
            e.preventDefault();
            $exeDevice.loadImage(id);
        });
        $('#slcmEURLAudio-' + id).on('change', function () {
            $exeDevice.loadAudio($(this).val());
        });
        $('#slcmEPlayAudio-' + id).on('click', function (e) {
            e.preventDefault();
            var audio = $('#slcmEURLAudio-' + id).val();
            $exeDevice.loadAudio(audio);
        });

        $('#slcmEShowMore-' + id).on('click', function (e) {
            e.preventDefault();
            $('#slcmEAuthorAlt-' + id).slideToggle();
        });


        $('#slcmEText-' + id).on('keyup', function () {
            $('#slcmETextDiv-' + id).text($(this).val());
            if ($(this).val().trim().length > 0) {
                $('#slcmETextDiv-' + $exeDevice.activeID).show();
            } else {
                $('#slcmETextDiv-' + $exeDevice.activeID).hide();
            }

        });

        $('#slcmEColor-' + id).on('change', function () {
            $('#slcmETextDiv-' + id).css('color', $(this).val());
        });
        $('#slcmEBgColor-' + id).on('change', function () {
            var bc = $exeDevice.hexToRgba($(this).val(), 0.7);
            $('#slcmETextDiv-' + id).css({
                'background-color': bc
            });

        });
        $('#slcmEImage-' + id).on('click', function (e) {
            $exeDevice.clickImage(id, e.pageX, e.pageY);
        });



    },
    cardToJson: function ($card) {
        var p = new Object();
        p.id = $card.data('id');
        p.type = 2
          p.author = $card.find('.SLCME-EAuthor').eq(0).val();
        p.alt = $card.find('.SLCME-EAlt').eq(0).val();
        p.url = $card.find('.SLCME-EURLImage').eq(0).val();
        p.audio = $card.find('.SLCME-EURLAudio').eq(0).val();
        p.eText = $card.find('.SLCME-EText').eq(0).val();
        p.color = $card.find('.SLCME-EColor').eq(0).val();
        p.backcolor = $card.find('.SLCME-EBackColor').eq(0).val();
        p.state = $card.find('.SLCME-EState').is(':checked')
        return p;

    },
    validatePhrase: function () {
        var correct = true,
            phrase = $exeDevice.getPhraseDefault(),
            $cards = $('#slcmEPhrase').find('div.SLCME-EDatosCarta');
        $cards.each(function() {
            var card = $exeDevice.cardToJson($(this));
            if ($exeDevice.validateCard(card)) {
                correct = false;
            } else {
                phrase.cards.push(card)
            }
        });
        if (!correct) {
            return false;
        }

        phrase.msgHit = $('#slcmEMessageOK').val();
        phrase.msgError = $('#slcmEMessageKO').val();;
        phrase.definition = $('#slcmEDefinition').val();
        phrase.audioDefinition = $('#slcmEURLAudioDefinition').val();
        phrase.audioHit = $('#slcmEURLAudioOK').val();
        phrase.audioError = $('#slcmEURLAudioKO').val();
        $exeDevice.phrasesGame[$exeDevice.active] = phrase;
        return true;
    },
    validateCard: function (p) {
        if (p.eText.length == 0 && p.url.length < 5 && p.audio.length == 0) {
            var message = $exeDevice.msgs.msgCompleteData;
            $exeDevice.showMessage(message);
            return true;
        }
        return false
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
        p.author = '';
        p.alt = '';
        p.eText = '';
        p.color = '#000000';
        p.backcolor = "#ffffff";
        p.state = false;
        return p;
    },
    loadPreviousValues: function (field) {
        var originalHTML = field.val();
        if (originalHTML != '') {
            var wrapper = $("<div></div>");
            wrapper.html(originalHTML);
            var json = $('.seleccionamedias-DataGame', wrapper).text();
            json = $exeDevice.Decrypt(json);
            var dataGame = $exeDevice.isJsonString(json),
                $audiosDef = $('.seleccionamedias-LinkAudiosDef', wrapper),
                $audiosError = $('.seleccionamedias-LinkAudiosError', wrapper),
                $audiosHit = $('.seleccionamedias-LinkAudiosHit', wrapper);
            for (var i = 0; i < dataGame.phrasesGame.length; i++) {
                var $imagesLink = $('.seleccionamedias-LinkImages-' + i, wrapper),
                    $audiosLink = $('.seleccionamedias-LinkAudios-' + i, wrapper),
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
                dataGame.phrasesGame[i].phrase  = typeof dataGame.phrasesGame[i].phrase =="null"?'':dataGame.phrasesGame[i].phrase;

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
            var instructions = $(".seleccionamedias-instructions", wrapper);
            if (instructions.length == 1) {
                instructions = instructions.html() || ''
                if (tinyMCE.get('eXeGameInstructions')) {
                    tinyMCE.get('eXeGameInstructions').setContent(instructions);
                } else {
                    $("#eXeGameInstructions").val(instructions)
                }
            }

            var textFeedBack = $(".seleccionamedias-feedback-game", wrapper);
            if (textFeedBack.length == 1) {
                textFeedBack = textFeedBack.html() || ''
                if (tinyMCE.get('slcmEFeedBackEditor')) {
                    tinyMCE.get('slcmEFeedBackEditor').setContent(textFeedBack);
                } else {
                    $("#slcmEFeedBackEditor").val(textFeedBack)
                }
            }

            var textAfter = $(".seleccionamedias-extra-content", wrapper);
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
        var textFeedBack = tinyMCE.get('slcmEFeedBackEditor').getContent();
        if (dataGame.instructions != "") divContent = '<div class="seleccionamedias-instructions gameQP-instructions">' + dataGame.instructions + '</div>';
        var linksImages = $exeDevice.createlinksImage(dataGame.phrasesGame),
            linksAudios = $exeDevice.createlinksAudio(dataGame.phrasesGame);
        var html = '<div class="seleccionamedias-IDevice">';
        html += '<div class="seleccionamedias-feedback-game">' + textFeedBack + '</div>';
        html += divContent;
        html += '<div class="seleccionamedias-DataGame js-hidden">' + json + '</div>';
        html += linksImages;
        html += linksAudios;
        var textAfter = tinyMCE.get('eXeIdeviceTextAfter').getContent();
        if (textAfter != "") {
            html += '<div class="seleccionamedias-extra-content">' + textAfter + '</div>';
        }
        html += '<div class="seleccionamedias-bns js-hidden">' + $exeDevice.msgs.msgNoSuportBrowser + '</div>';
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
                    linkImage = '<a href="' + p.url + '" class="js-hidden seleccionamedias-LinkImages-' + i + '">' + k + '</a>';
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
                    linkImage = '<a href="' + p.audio + '" class="js-hidden seleccionamedias-LinkAudios-' + i + '">' + k + '</a>';
                }
                html += linkImage;
            }
            if (typeof q.audioDefinition != "undefined" && q.audioDefinition.indexOf('http') != 0 && q.audioDefinition.length > 4) {
                linkImage = '<a href="' + q.audioDefinition + '" class="js-hidden seleccionamedias-LinkAudiosDef">' + i + '</a>';
                html += linkImage;
            }
            if (typeof q.audioHit != "undefined" && q.audioHit.indexOf('http') != 0 && q.audioHit.length > 4) {
                linkImage = '<a href="' + q.audioHit + '" class="js-hidden seleccionamedias-LinkAudiosHit">' + i + '</a>';
                html += linkImage;
            }
            if (typeof q.audioError != "undefined" && q.audioError.indexOf('http') != 0 && q.audioError.length > 4) {
                linkImage = '<a href="' + q.audioError + '" class="js-hidden seleccionamedias-LinkAudiosError">' + i + '</a>';
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
            textFeedBack = tinyMCE.get('slcmEFeedBackEditor').getContent(),
            textAfter = tinyMCE.get('eXeIdeviceTextAfter').getContent(),
            showMinimize = $('#slcmEShowMinimize').is(':checked'),
            itinerary = $exeAuthoring.iDevice.gamification.itinerary.getValues(),
            feedBack = $('#slcmEHasFeedBack').is(':checked'),
            percentajeFB = parseInt(clear($('#slcmEPercentajeFB').val())),
            customMessages = $('#slcmECustomMessages').is(':checked'),
            percentajeQuestions = parseInt(clear($('#slcmEPercentajeQuestions').val())),
            time = parseInt(clear($('#slcmETime').val())),
            showSolution = $('#slcmEShowSolution').is(':checked'),
            timeShowSolution = parseInt(clear($('#slcmETimeShowSolution').val())),
            author = $('#slcmEAuthor').val(),
            phrasesGame = $exeDevice.phrasesGame;
            evaluation = $('#slcmEEvaluation').is(':checked'),
            evaluationID = $('#slcmEEvaluationID').val(),
            id = $exeDevice.id ? $exeDevice.id : $exeDevice.generarID(),
            type = parseInt($('input.SLCME-EType[name=odntype]:checked').val()),
            modeTable = $('#slcmEModeTable').is(':checked'),
            numberMaxCards = $('#slcmEANumberMaxCard').val();
            attempsNumber = parseInt($('#slcmEAttemptsNumber').val());
        if(showSolution && timeShowSolution.length == 0) {
            eXe.app.alert($exeDevice.msgs.msgEProvideTimeSolution);
            return false;
        }
        if (phrasesGame.length == 0) {
            $exeDevice.showMessage($exeDevice.msgs.msgEOneQuestion);
            return false;
        }
        var scorm = $exeAuthoring.iDevice.gamification.scorm.getValues();
        var data = {
            'typeGame': 'SeleccionaMedias',
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
            'feedBack': feedBack,
            'percentajeFB': percentajeFB,
            'customMessages': customMessages,
            'percentajeQuestions': percentajeQuestions,
            'timeShowSolution': timeShowSolution,
            'time': time,
            'version': $exeDevice.version,
            'evaluation':evaluation,
            'evaluationID':evaluationID,
            'attempsNumber':attempsNumber,
            'numberMaxCards':numberMaxCards,
            'modeTable':modeTable,
            'id':id
        }
        return data;
    },
    showImage: function (id) {
        var $image = $('#slcmEImage-' + id),
            $nimage = $('#slcmENoImage-' + id),
            alt = $('#slcmEAlt-' + id).val(),
            url = $('#slcmEURLImage-' + id).val();
        $image.hide();
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
        $('#slcmEPasteC').hide();
        $('#slcmEAddC').on('click', function (e) {
            e.preventDefault();
            $exeDevice.addCard(true);

        });
        $('#slcmEDeleteC').on('click', function (e) {
            e.preventDefault();
            $exeDevice.removeCard();

        });

        $('#slcmECopyC').on('click', function (e) {
            e.preventDefault();
            $exeDevice.copyCard();

        });
        $('#slcmECutC').on('click', function (e) {
            e.preventDefault();
            $exeDevice.cutCard();

        });
        $('#slcmEPasteC').on('click', function (e) {
            e.preventDefault();
            $exeDevice.pasteCard();

        });
        $('#slcmEPhrase').on('click', '.SLCME-EDatosCarta', function () {
            $exeDevice.activeID = $(this).data('id');
            $('.SLCME-EDatosCarta').removeClass('SLCME-EActive');
            $(this).addClass('SLCME-EActive');
        });
        $('#slcmEPaste').hide();
        $('#slcmEAdd').on('click', function (e) {
            e.preventDefault();
            $exeDevice.addPhrase()
        });
        $('#slcmEFirst').on('click', function (e) {
            e.preventDefault();
            $exeDevice.firstPhrase()
        });
        $('#slcmEPrevious').on('click', function (e) {
            e.preventDefault();
            $exeDevice.previousPhrase();
        });
        $('#slcmENext').on('click', function (e) {
            e.preventDefault();
            $exeDevice.nextPhrase();
        });
        $('#slcmELast').on('click', function (e) {
            e.preventDefault();
            $exeDevice.lastPhrase()
        });
        $('#slcmEDelete').on('click', function (e) {
            e.preventDefault();
            $exeDevice.removePhrase()
        });
        $('#slcmECopy').on('click', function (e) {
            e.preventDefault();
            $exeDevice.copyPhrase()
        });
        $('#slcmEPaste').on('click', function (e) {
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
        $('#slcmEHasFeedBack').on('change', function () {
            var marcado = $(this).is(':checked');
            if (marcado) {
                $('#slcmEFeedbackP').slideDown();
            } else {
                $('#slcmEFeedbackP').slideUp();
            }
            $('#slcmEPercentajeFB').prop('disabled', !marcado);
        });
        $('#slcmECustomMessages').on('change', function () {
            var messages = $(this).is(':checked');
            if (messages) {
                $('.SLCME-ECustomMessageDiv').slideDown();
            } else {
                $('.SLCME-ECustomMessageDiv').slideUp();
            }
        });
        $('#slcmEPercentajeQuestions').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 3);
            this.value = v;
            if (this.value > 0 && this.value < 101) {
                $exeDevice.updateQuestionsNumber();
            }
        });
        $('#slcmEPercentajeQuestions').on('focusout', function () {
            this.value = this.value.trim() == '' ? 100 : this.value;
            this.value = this.value > 100 ? 100 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
            $exeDevice.updateQuestionsNumber();
        });
        $('#slcmEANumberMaxCard').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 2);
            this.value = v;
        });
        $('#slcmEANumberMaxCard').on('focusout', function () {
            this.value = this.value.trim() == '' ? 30 : this.value;
            this.value = this.value > 30 ? 30 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
        });
        $('#slcmETime').on('focusout', function () {
            this.value = this.value.trim() == '' ? 0 : this.value;
            this.value = this.value > 999 ? 999 : this.value;
            this.value = this.value < 0 ? 0 : this.value;

        });
        $('#slcmETime').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 3);
            this.value = v;
        });
        $('#slcmEPercentajeQuestions').on('click', function () {
            $exeDevice.updateQuestionsNumber();
        });
        $('#slcmETimeShowSolution').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 3);
            this.value = v;
        });
        $('#slcmETimeShowSolution').on('focusout', function () {
            this.value = this.value.trim() == '' ? 3 : this.value;
            this.value = this.value > 999 ? 999 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
        });
        $('#slcmEAttemptsNumber').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 1);
            this.value = v;
        });
        $('#slcmEAttemptsNumber').on('focusout', function () {
            this.value = this.value.trim() == '' ? 1 : this.value;
            this.value = this.value > 9 ? 9 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
        });
        $('#slcmEURLAudioDefinition').on('change', function () {
            $exeDevice.loadAudio($(this).val());
        });
        $('#slcmEPlayAudioDefinition').on('click', function (e) {
            e.preventDefault();
            var audio = $('#slcmEURLAudioDefinition').val();
            $exeDevice.loadAudio(audio);
        });
        $('#slcmEURLAudioOK').on('change', function () {
            $exeDevice.loadAudio($(this).val());
        });
        $('#slcmEPlayAudioOK').on('click', function (e) {
            e.preventDefault();
            var audio = $('#slcmEURLAudioOK').val();
            $exeDevice.loadAudio(audio);
        });
        $('#slcmEURLAudioKO').on('change', function () {
            $exeDevice.loadAudio($(this).val());
        });
        $('#slcmEPlayAudioKO').on('click', function (e) {
            e.preventDefault();
            var audio = $('#slcmEURLAudioKO').val();
            $exeDevice.loadAudio(audio);
        });
        $('#slcmEEvaluation').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#slcmEEvaluationID').prop('disabled', !marcado);
        });
        $("#slcmEEvaluationHelpLnk").click(function () {
            $("#slcmEEvaluationHelp").toggle();
            return false;

        });
        $exeAuthoring.iDevice.gamification.itinerary.addEvents();

    },
    loadImage: function (id) {
        var validExt = ['jpg', 'png', 'gif', 'jpeg', 'svg'],
            url = $('#slcmEURLImage-' + id).val(),
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
        $('#slcmEHasFeedBack').prop('checked', feedback);
        if (feedback) {
            $('#slcmEFeedbackP').slideDown();
        }
        if (!feedback) {
            $('#slcmEFeedbackP').slideUp();
        }
    },

    clearPhrase: function () {
        $('#slcmEPhrase').empty()
    },

    addPhrase: function () {
        if ($exeDevice.phrasesGame.length >= 30) {
            $exeDevice.showMessage($exeDevice.msgs.msgPairsMax);
            return;
        }
        var valida = $exeDevice.validatePhrase();
        if (valida) {
            $exeDevice.clearPhrase();
            $exeDevice.phrasesGame.push($exeDevice.getPhraseDefault());
            $exeDevice.addCard(true);
            $exeDevice.active = $exeDevice.phrasesGame.length - 1;
            $('#slcmENumberPhrase').text($exeDevice.phrasesGame.length);
            $exeDevice.typeEdit = -1;
            $('#slcmEPaste').hide();
            $('#slcmENumPhrases').text($exeDevice.phrasesGame.length);
            $('#slcmActivityNumber').text($exeDevice.phrasesGame.length);
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
            $('#slcmEPaste').hide();
            $('#slcmENumPhrases').text($exeDevice.phrasesGame.length);
            $('#slcmENumberPhrase').text($exeDevice.active + 1);
            $('#slcmActivityNumber').text($exeDevice.active + 1);
            $exeDevice.updateQuestionsNumber();
        }
    },

    copyPhrase: function () {
        if ($exeDevice.validatePhrase()) {
            $exeDevice.typeEdit = 0;
            $exeDevice.clipBoard = $exeDevice.phrasesGame[$exeDevice.active];
            $('#slcmEPaste').show();
        }

    },

    cutPhrase: function () {
        if ($exeDevice.validatePhrase()) {
            $exeDevice.numberCutCuestion = $exeDevice.active;
            $exeDevice.typeEdit = 1;
            $('#slcmEPaste').show();
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
        if ($exeDevice.phrasesGame.length >= 30) {
            $exeDevice.showMessage($exeDevice.msgs.msgPairsMax);
            return;
        }
        if ($exeDevice.typeEdit == 0) {
            $exeDevice.active++;
            var p = $.extend(true, {}, $exeDevice.clipBoard);
            $exeDevice.phrasesGame.splice($exeDevice.active, 0, p);
            $exeDevice.showPhrase($exeDevice.active);
            $('#slcmENumPhrases').text($exeDevice.phrasesGame.length);
        } else if ($exeDevice.typeEdit == 1) {
            $('#slcmEPaste').hide();
            $exeDevice.typeEdit = -1;
            $exeDevice.arrayMove($exeDevice.phrasesGame, $exeDevice.numberCutCuestion, $exeDevice.active);
            $exeDevice.showPhrase($exeDevice.active);
            $('#slcmENumPhrases').text($exeDevice.phrasesGame.length);
            $('#slcmENumberPhrase').text($exeDevice.active + 1);
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
        game.evaluation = typeof game.evaluation != "undefined" ? game.evaluation : false;
        game.evaluationID = typeof game.evaluationID != "undefined" ? game.evaluationID : '';
        $exeDevice.id = typeof game.id != "undefined" ? game.id : false;
        $('#slcmEShowMinimize').prop('checked', game.showMinimize);
        $("#slcmEHasFeedBack").prop('checked', game.feedBack);
        $("#slcmEPercentajeFB").val(game.percentajeFB);
        $('#slcmEPercentajeQuestions').val(game.percentajeQuestions);
        $('#slcmETime').val(game.time);
        $('#slcmETimeShowSolution').val(game.timeShowSolution);
        $('#slcmEAuthor').val(game.author);
        $('#slcmEShowSolution').prop('checked', game.showSolution);
        $exeAuthoring.iDevice.gamification.scorm.setValues(game.isScorm, game.textButtonScorm, game.repeatActivity);
        $exeDevice.phrasesGame = game.phrasesGame;
        $exeDevice.updateGameMode(game.feedBack);
        $('#slcmENumPhrases').text($exeDevice.phrasesGame.length);
        $('#slcmEPercentajeFB').prop('disabled', !game.feedBack);
        $('#slcmECustomMessages').prop('checked', game.customMessages);
        $exeDevice.updateQuestionsNumber();
        $('#slcmEEvaluation').prop('checked', game.evaluation);
        $('#slcmEEvaluationID').val(game.evaluationID);
        $("#slcmEEvaluationID").prop('disabled', (!game.evaluation));
        $('#slcmEAttemptsNumber').val(game.attempsNumber);
        $('#slcmEModeTable').prop('checked', game.modeTable);
        $('#slcmEANumberMaxCard').val(game.numberMaxCards);

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
        link.download = _("Game") + "SeleccionaMedias.json";
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
        } else if (game.typeGame !== 'SeleccionaMedias') {
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
        tinyMCE.get('slcmEFeedBackEditor').setContent(unescape(textFeedBack));
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
        var $image = $('#slcmEImage-' + id),
            $x = $('#slcmEX-' + id),
            $y = $('#slcmEY-' + id);
        var posX = epx - $image.offset().left,
            posY = epy - $image.offset().top,
            wI = $image.width() > 0 ? $image.width() : 1,
            hI = $image.height() > 0 ? $image.height() : 1,
            lI = $image.position().left,
            tI = $image.position().top;
        $x.val(posX / wI);
        $y.val(posY / hI);
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
    },


}