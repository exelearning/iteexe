/**
 * desafio Activity iDevice (edition code)
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Manuel Narváez Martínez
 * Graphic design: Ana María Zamora Moreno, Francisco Javier Pulido
 * Testers: Ricardo Málaga Floriano, Francisco Muñoz de la Peña
 * Translator: Antonio Juan Delgado García
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $exeDevice = {
    // i18n
    i18n: {
        name: _('desafio Activity'),
    },
    iDevicePath: "/scripts/idevices/desafio-activity/edition/",
    msgs: {},
    active: 0,
    typeActive:0,
    challengesGame: [],
    desafioTitle: '',
    desafioTime: 40,
    desafioSolution: '',
    desafioDescription: '',
    typeEdit: -1,
    numberCutCuestion: -1,
    clipBoard: '',
    ci18n: {
        "msgReady": _("Ready?"),
        "msgStartGame": _("Click here to start"),
        "msgSubmit": _("Submit"),
        "msgEnterCode": _("Enter the access code"),
        "msgErrorCode": _("The access code is not correct"),
        "msgGameOver": _("Game Over!"),
        "msgClue": _("Cool! The clue is:"),
        "msgNewGame": _("Click here for a new game"),
        "msgYouHas": _("You have got %1 hits and %2 misses"),
        "msgCodeAccess": _("Access code"),
        "msgPlayAgain": _("Play Again"),
        "msgRequiredAccessKey": _("Access code required"),
        "msgInformationLooking": _("Cool! The information you were looking for"),
        "msgPlayStart": _("Click here to play"),
        "msgErrors": _("Errors"),
        "msgHits": _("Hits"),
        "msgScore": _("Score"),
        "msgMinimize": _("Minimize"),
        "msgMaximize": _("Maximize"),
        "msgTime": _("Time per question"),
        "msgLive": _("Life"),
        "msgFullScreen": _("Full Screen"),
        "msgExitFullScreen": _("Exit Full Screen"),
        "msgNumQuestions": _("Number of questions"),
        "msgNoImage": _("No picture question"),
        "msgCool": _("Cool!"),
        "msgLoseT": _("You lost 330 points"),
        "msgLoseLive": _("You lost one life"),
        "msgLostLives": _("You lost all your lives!"),
        "mgsAllQuestions": _("Questions completed!"),
        "msgSuccesses": _("Right! | Excellent! | Great! | Very good! | Perfect!"),
        "msgFailures": _("It was not that! | Incorrect! | Not correct! | Sorry! | Error!"),
        "msgNotNetwork": _("You can only play this game with internet connection."),
        "msgEndGameScore": _("Please start the game before saving your score."),
        "msgScoreScorm": _("The score can't be saved because this page is not part of a SCORM package."),
        "msgQuestion": _("Question"),
        "msgAnswer": _("Answer"),
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
        "msgTryAgain": _("You need at least %s&percnt; of correct answers to get the information. Please try again."),
        "msgVideoIntro": _("Video Intro"),
        "msgClose": _("Close"),
        "msgOption": _("Option"),
        "msgRickText": _("Rich Text"),
        "msgUseFulInformation": _("and information that will be very useful"),
        "msgLoading": _("Loading. Please wait..."),
        "mgsPoints": _("points")
    },

    init: function () {
        this.setMessagesInfo();
        this.createForm();
        
    },
    setMessagesInfo: function () {
        var msgs = this.msgs;
        msgs.msgEProvideDefinition = _("Please provide the word definition or the valid URL of an image");
        msgs.msgESelectFile = _("The selected file does not contain a valid game");
        msgs.msgEURLValid = _("You must upload or indicate the valid URL of an image");
        msgs.msgEProvideWord = _("Please provide one word or phrase");
        msgs.msgEOneQuestion = _("Please provide at least one question");
        msgs.msgEUnavailableVideo = _("This video is not currently available")
        msgs.msgECompleteQuestion = _("Debes completar un reto");
        msgs.msgECompleteAllOptions = _("You have to complete all the selected options");
        msgs.msgESelectSolution = _("Choose the right answer");
        msgs.msgECompleteURLYoutube = _("Type the right URL of a Youtube video");
        msgs.msgEStartEndVideo = _("You have to indicate the start and the end of the video that you want to show");
        msgs.msgEStartEndIncorrect = _("The video end value must be higher than the start one");
        msgs.msgWriteText = _("You have to type a text in the editor");
        msgs.msgTitleChallenge = _("Debes indicar un título para el reto");
        msgs.msgDescriptionChallenge = _("Debes escribir un descripción para el reto");
        msgs.msgSolutionChallenge = _("Debes indicar un solución para el reto");
        msgs.msgTitleDesafio = _("Debes indicar un título para el desafío");
        msgs.msgDescriptionDesafio = _("Debes escribir un descripción para el desafío");
        msgs.msgSolutionDesafio = _("Debes indicar una solución para el desafio");

    },
    showMessage: function (msg) {

        eXe.app.alert(msg);
    },
    addChallenge: function () {
        $exeDevice.validateChallenge(false);
        $exeDevice.clearChallenge();
        $exeDevice.challengesGame.push($exeDevice.getChallengeDefault());
        $exeDevice.active = $exeDevice.challengesGame.length - 1;
        $('#desafioENumberChallenge').text($exeDevice.active+1);
        $exeDevice.typeEdit = -1;
        $('#desafioEPaste').hide();
        $('#desafioENumChallenges').text($exeDevice.challengesGame.length);
    },
    clearChallenge:function(){
        $('#desafioEDTitle').val('');
        $('#desafioEDSolution').val('');
        tinymce.editors[1].setContent('');
        $('#desafioEDPMessage').val('');
        $('#desafioEDPTime').val(5);

    },
    removeChallenge: function (num) {
        if ($exeDevice.challengesGame.length < 2) {
            $exeDevice.showMessage(msgs.msgEOneQuestion);
            return;
        } else {
            $exeDevice.challengesGame.splice($exeDevice.active, 1);
            if ($exeDevice.active >= $exeDevice.challengesGame.length - 1) {
                $exeDevice.active = $exeDevice.challengesGame.length - 1;
            }
            $exeDevice.showChallenge($exeDevice.active);
            $exeDevice.typeEdit = -1;
            $('#desafioEPaste').hide();
            $('#desafioENumChallenges').text($exeDevice.challengesGame.length);
            $('#desafioENumberChallenge').text($exeDevice.active + 1);
        }

    },
    copyChallenge: function () {
        $exeDevice.validateChallenge()
        $exeDevice.typeEdit = 0;
        $exeDevice.clipBoard = $exeDevice.challengesGame[$exeDevice.active];
        $('#desafioEPaste').show();

    },
    cutChallenge: function () {
        $exeDevice.validateChallenge(false);
        $exeDevice.numberCutCuestion = $exeDevice.active;
        $exeDevice.typeEdit = 1;
        $('#desafioEPaste').show();
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

    pasteChallenge: function () {
        if ($exeDevice.typeEdit == 0) {
            $exeDevice.active++;
            $exeDevice.challengesGame.splice($exeDevice.active, 0, $exeDevice.clipBoard);
            $exeDevice.showChallenge($exeDevice.active);
        } else if ($exeDevice.typeEdit == 1) {
            $('#desafioEPaste').hide();
            $exeDevice.typeEdit = -1;
            $exeDevice.arrayMove($exeDevice.challengesGame, $exeDevice.numberCutCuestion, $exeDevice.active);
            $exeDevice.showChallenge($exeDevice.active);
            $('#desafioENumChallenges').text($exeDevice.challengesGame.length);
        }
    },
    nextChallenge: function () {
        $exeDevice.validateChallenge(false);
        if ($exeDevice.active < $exeDevice.challengesGame.length - 1) {
            $exeDevice.active++;
            $exeDevice.showChallenge($exeDevice.active);
        }
    },
    lastChallenge: function () {
        $exeDevice.validateChallenge(false);
        if ($exeDevice.active < $exeDevice.challengesGame.length - 1) {
            $exeDevice.active = $exeDevice.challengesGame.length - 1;
            $exeDevice.showChallenge($exeDevice.active);
        }
    },
    previousChallenge: function () {
        $exeDevice.validateChallenge(false);
        if ($exeDevice.active > 0) {
            $exeDevice.active--;
            $exeDevice.showChallenge($exeDevice.active);
        }
    },
    firstChallenge: function () {
        $exeDevice.validateChallenge(false);
        if ($exeDevice.active > 0) {
            $exeDevice.active = 0;
            $exeDevice.showChallenge($exeDevice.active);
        }
    },
    showChallenge: function (i) {
        var num = i < 0 ? 0 : i;
        num = num >= $exeDevice.challengesGame.length ? $exeDevice.challengesGame.length - 1 : num;
        p = $exeDevice.challengesGame[num];
        $('#desafioENumQuestionDiv').show();
        $('#desafiolblEDTime').hide();
        $('#desafioEDTime').hide();
        $('#desafiolblEDType').hide();
        $('#desafioEDType').hide();
        $('#desafioENavigationButtons').show();
        $('#desafioEClueTitle').show();
        $('#desafioEClue').show();
        var c=$exeDevice.challengesGame[num];
        $('#desafioEDTitle').val(c.title);
        $('#desafioEDSolution').val(c.solution);
        if(tinyMCE.get('desafioEDescription')){
            tinyMCE.get('desafioEDescription').setContent(c.description);
        }else{
            $('#desafioEDescription').val(c.description)
        }
        $('#desafioEDPMessage').val(c.clue);
        $('#desafioEDPTime').val(c.clueTime);
        $('#desafioENumChallenges').text($exeDevice.challengesGame.length);
        $('#desafioENumberChallenge').text($exeDevice.active+1);
    },


    createForm: function () {
        var path = $exeDevice.iDevicePath,
            html = '\
			<div id="desafioIdeviceForm">\
				<div class="exe-form-tab" title="' + _('General settings') + '">\
                ' + $exeAuthoring.iDevice.gamification.instructions.getFieldset(_("Choose the right answer")) + '\
                    <fieldset class="exe-fieldset exe-fieldset-closed">\
                        <legend><a href="#">' + _("Options") + '</a></legend>\
                        <div>\
                            <p>\
                                <label for="desafioEShowMinimize"><input type="checkbox" id="desafioEShowMinimize">' + _("Show minimized.") + '</label>\
                            </p>\
                        </div>\
                    </fieldset>\
                    <fieldset class="exe-fieldset">\
                        <legend><a href="#">' + _("Questions") + '</a></legend>\
                        <div class="desafio-EPanel" id="desafioEPanel">\
                            <div class="desafioToggle">\
                                    <input class="desafio-Type" checked="checked" id="desafioEDesafio" type="radio" name="dsfDesRet" value="0" />\
                                    <label for="desafioEDesafio">' + _("Desafío") + '</label>\
                                    <input class="desafio-Type"  id="desafioEReto" type="radio" name="dsfDesRet" value="1" />\
                                    <label for="desafioEReto">' + _("Retos") + '</label>\
                            </div>\
                            <div class="desafio-EDAtaGame">\
                                <div class="desafio-EVideoIntroData">\
                                    <label for="desafioEDTitle">' + _("Title") + '<input type="text" id="desafioEDTitle" /></label>\
                                    <label for="desafioEDSolution">' + _("Solution") + '<input type="text" id="desafioEDSolution" /></label>\
                                    <label id="desafiolblEDType" for="desafioEDType">' + _("Type") + ': </label>\
                                    <select id="desafioEDType">\
                                        <option value="0">Lineal</option>\
                                        <option value="1">Libre</option>\
                                    </select>\
                                    <label id="desafiolblEDTime" for="desafioEDTime">' + _("Time") + ': </label>\
                                    <select id="desafioEDTime">\
                                    <option value="1">1m</option>\
                                    <option value="10">10m</option>\
                                    <option value="15">15m</option>\
                                    <option value="20">20m</option>\
                                    <option value="25">25m</option>\
                                    <option value="30">30m</option>\
                                    <option value="35">35m</option>\
                                    <option value="40" selected>40m</option>\
                                    <option value="40">45m</option>\
                                    <option value="50">50m</option>\
                                    <option value="55">55m</option>\
                                    <option value="60">60m</option>\
                                    <option value="70">70m</option>\
                                    <option value="80">80m</option>\
                                    <option value="90">90m</option>\
                                    <option value="120">120m</option>\
                                    <option value="150">150</option>\
                                    <option value="180">180m</option>\
                                    <option value="210">210m</option>\
                                    <option value="240">240m</option>\
                                </select>\
                                </div>\
                                <span>' + _("Description") + ':</span>\
                                <div class="desafio-EInputMedias">\
                                    <textarea id="desafioEDescription" class="exe-html-editor"\> </textarea>\
                                </div>\
                                <span id="desafioEClueTitle">' + _("Pista(Opcional)") + ':</span>\
                                <div class="desafio-EInputMedias" id="desafioEClue">\
                                <label for="desafioEDPMessage">' + _("Message") + '<input type="text" id="desafioEDPMessage" /></label>\
                                <label for="desafioEDPTime">' + _("Time") + ': </label>\
                                <select id="desafioEDPTime">\
                                <option value="1">1</option>\
                                <option value="3">3m</option>\
                                <option value="5">5m</option>\
                                <option value="10">10m</option>\
                                <option value="15">15m</option>\
                                <option value="20">20m</option>\
                                <option value="25">25m</option>\
                                <option value="30">30m</option>\
                                <option value="35">35m</option>\
                                <option value="40" selected>40m</option>\
                                <option value="40">45m</option>\
                                <option value="50">50m</option>\
                                <option value="55">55m</option>\
                                <option value="60">60m</option>\
                                <option value="70">70m</option>\
                                <option value="80">80m</option>\
                                <option value="90">90m</option>\
                                <option value="120">120m</option>\
                                <option value="150">150</option>\
                                <option value="180">180m</option>\
                                <option value="210">210m</option>\
                                <option value="240">240m</option>\
                            </select>\
                                </div>\
                            </div>\
                            <div class="desafio-ENavigationButtons" id="desafioENavigationButtons">\
                                <a href="#" id="desafioEAdd" class="desafio-ENavigationButton" title="' + _("Add question") + '"><img src="' + path + "quextAdd.png" + '"  alt="" class="desafio-EButtonImage b-add" /></a>\
                                <a href="#" id="desafioEFirst" class="desafio-ENavigationButton"  title="' + _("First question") + '"><img src="' + path + "quextFirst.png" + '"  alt="" class="desafio-EButtonImage b-first" /></a>\
                                <a href="#" id="desafioEPrevious" class="desafio-ENavigationButton" title="' + _("Previous question") + '"><img src="' + path + "quextPrev.png" + '"  alt="" class="desafio-EButtonImage b-prev" /></a>\
                                <span class="sr-av">' + _("Question number:") + '</span><span class="desafio-NumberQuestion" id="desafioENumberChallenge">1</span>\
                                <a href="#" id="desafioENext" class="desafio-ENavigationButton"  title="' + _("Next question") + '"><img src="' + path + "quextNext.png" + '"  alt="" class="desafio-EButtonImage b-next" /></a>\
                                <a href="#" id="desafioELast" class="desafio-ENavigationButton"  title="' + _("Last question") + '"><img src="' + path + "quext-last.png" + '"  alt="" class="desafio-EButtonImage b-last" /></a>\
                                <a href="#" id="desafioEDelete" class="desafio-ENavigationButton" title="' + _("Delete question") + '"><img src="' + path + "quextDelete.png" + '"  alt="" class="desafio-EButtonImage b-delete" /></a>\
                                <a href="#" id="desafioECopy" class="desafio-ENavigationButton" title="' + _("Copy question") + '"><img src="' + path + "quextCopy.png" + '"   alt="" class="desafio-EButtonImage b-copy" /></a>\
                                <a href="#" id="desafioECut" class="desafio-ENavigationButton" title="' + _("Cut question") + '"><img src="' + path + "quextCut.png" + '"  alt=""  class="desafio-EButtonImage b-cut" /></a>\
                                <a href="#" id="desafioEPaste" class="desafio-ENavigationButton"  title=' + _("Paste question") + '><img src="' + path + "quextPaste.png" + '"  alt="" class="desafio-EButtonImage b-paste" /></a>\
                            </div>\
                            <div class="desafio-ENumQuestionDiv" id="desafioENumQuestionDiv">\
                               <div class="desafio-ENumQ"><span class="sr-av">' + _("Number of questions:") + '</span></div>\
                               <span class="desafio-ENumQuestions" id="desafioENumChallenges">0</span>\
                            </div>\
                        </div>\
                    </fieldset>\
                </div>\
				' + $exeAuthoring.iDevice.gamification.itinerary.getTab() + '\
				' + $exeAuthoring.iDevice.gamification.scorm.getTab() + '\
				' + $exeAuthoring.iDevice.gamification.common.getLanguageTab(this.ci18n) + '\
				' + $exeAuthoring.iDevice.gamification.share.getTab() + '\
		    </div>\
			';
        var field = $("textarea.jsContentEditor").eq(0)
        field.before(html);
        $exeAuthoring.iDevice.tabs.init("desafioIdeviceForm");
        $exeDevice.loadPreviousValues(field);
        $exeDevice.addEvents();
        $exeAuthoring.iDevice.gamification.scorm.init();


    },
    getChallengeDefault: function () {
        var p = new Object();
        p.title = '';
        p.solution = '';
        p.description = '';
        p.clue = '';
        p.clueTime = 5;
        return p;
    },
    loadPreviousValues: function (field) {
        var originalHTML = field.val();
        if (originalHTML != '') {
            $exeDevice.active = 0;
            var wrapper = $("<div></div>");
            wrapper.html(originalHTML);
            var json = $('.desafio-DataGame', wrapper).text();
            var dataGame = $exeDevice.isJsonString(json);
            $exeDevice.desafioTitle=dataGame.desafioTitle;
            $exeDevice.active = 0;
            $exeDevice.desafioSolution=dataGame.desafioSolution;
            $exeDevice.desafioDescription=(dataGame.desafioDescription);
            $exeDevice.desafioType=dataGame.desafioType;
            $exeDevice.desafioTime=dataGame.desafioTime;
            for (var i = 0; i < dataGame.challengesGame.length; i++) {
                 dataGame.challengesGame[i].description = (dataGame.challengesGame[i].description);
            }
            $('.desafio-ChallengeDescription',wrapper).each(function(i){
                dataGame.challengesGame[i].description = $(this).html();
            });
            $exeDevice.challengesGame = dataGame.challengesGame;
            var instructions = $(".desafio-instructions", wrapper);
            $exeDevice.desafioDescription = $(".desafio-Description", wrapper).eq(0).html();
            if (instructions.length == 1) $("#eXeGameInstructions").val(instructions.html());
             // i18n
            $exeAuthoring.iDevice.gamification.common.setLanguageTabValues(dataGame.msgs);
            $exeDevice.updateFieldGame(dataGame);
        }
    },
    updateFieldGame: function (game) {
        $exeAuthoring.iDevice.gamification.itinerary.setValues(game.itinerary);
        $('#desafioEShowMinimize').prop('checked', game.showMinimize);
        $exeAuthoring.iDevice.gamification.scorm.setValues(game.isScorm, game.textButtonScorm, game.repeatActivity);
        $exeDevice.showDesafio();

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

    save: function () {
        if (!$exeDevice.validateChallenge(true)) {
            return;
        }
        if(!$exeDevice.validateDesafio(true)){
            return;
        }
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
        var instructions = tinyMCE.get('eXeGameInstructions').getContent();
        if (instructions != "") divContent = '<div class="desafio-instructions">' + instructions + '</div>';
        var html = '<div class="desafio-IDevice">';
        html += divContent;
        html += '<div class="desafio-Description  sr-av">' + $exeDevice.desafioDescription + '</div>';
        for (var i=0;i<$exeDevice.challengesGame.length;i++){
            html += '<div class="desafio-ChallengeDescription sr-av">' + $exeDevice.challengesGame[i].description + '</div>';
        }
        html += '<div class="desafio-DataGame">' + json + '</div>';
        html += '</div>';
        return html;
    },
    validateChallenge: function (validate) {
        var message = '',
            p = new Object();
        if($exeDevice.typeActive==1){
            p.title=$('#desafioEDTitle').val();
            p.solution=$('#desafioEDSolution').val();
            p.description=tinymce.editors[1].getContent();
            p.clue = $('#desafioEDPMessage').val();
            p.clueTime = parseInt($('#desafioEDPTime option:selected').val());
            if (p.title.length == 0) {
                message = $exeDevice.msgs.msgTitleChallenge;
            } else if (p.description.length == 0) {
                message = $exeDevice.msgs.msgDescriptionChallenge;
            } else if (p.solution.length == 0) {
                message = $exeDevice.msgs.msgSolutionChallenge;
            }
            $exeDevice.challengesGame[$exeDevice.active] = p;
       }
        if (message.length == 0) {
            message = true;
        } else {
            if(validate) $exeDevice.showMessage(message);
            message = false;
        }

        return message;

    },
    validateDesafio: function (validate) {
        var message = '';
            p = new Object();
        if($exeDevice.typeActive==0){
            $exeDevice.desafioTitle=$('#desafioEDTitle').val();
            $exeDevice.desafioSolution=$('#desafioEDSolution').val();
            $exeDevice.desafioDescription=tinymce.editors[1].getContent();
            $exeDevice.desafioType = parseInt($('#desafioEDType option:selected').val());
            $exeDevice.desafioTime = parseInt($('#desafioEDTime option:selected').val());

            if ($exeDevice.desafioTitle.length == 0) {
                message = $exeDevice.msgs.msgTitleDesafio;
            } else if ($exeDevice.desafioSolution.length == 0) {
                message = $exeDevice.msgs.msgSolutionDesafio;
            } else if ($exeDevice.desafioDescription ==0) {
                message = $exeDevice.msgs.msgDescriptionDesafio;
            }
        }
        if (message.length != 0) {
            if(validate) $exeDevice.showMessage(message);
            message = false;
        } else {
            message=true;
        }
        return message;

    },

    exportGame: function () {
        var desafioValid=$exeDevice.validateDesafio(true);
        if(!desafioValid){
            return;
        }
        desafioValid=$exeDevice.validateChallenge(true);
        if (!desafioValid) {
            return;
        }
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
        link.download = _("Game") + "desafio.json";
        document.getElementById('desafioIdeviceForm').appendChild(link);
        link.click();
        setTimeout(function () {
            document.getElementById('desafioIdeviceForm').removeChild(link);
            window.URL.revokeObjectURL(data);
        }, 100);
    },
    importGame: function (content) {
        var game = $exeDevice.isJsonString(content);
        if (!game || typeof game.typeGame == "undefined") {
            $exeDevice.showMessage($exeDevice.msgs.msgESelectFile);
            return;
        } else if (game.typeGame !== 'desafio') {
            $exeDevice.showMessage($exeDevice.msgs.msgESelectFile);
            return;
        }
        $exeDevice.active = 0;
        $exeDevice.desafioTitle=game.desafioTitle;
        $exeDevice.desafioSolution=game.desafioSolution;
        $exeDevice.desafioDescription=(game.desafioDescription);
        $exeDevice.desafioType=game.desafioType;
        $exeDevice.desafioTime=game.desafioTime;
        for (var i = 0; i < $exeDevice.challengesGame.length; i++) {
                game.challengesGame[i].description = (game.challengesGame[i].description);
        }
        $exeDevice.challengesGame = game.challengesGame;
        $exeDevice.updateFieldGame(game);
        var instructions = game.instructionsExe || game.instructions;
        tinymce.editors[0].setContent((instructions));
        $('.exe-form-tabs li:first-child a').click();
    },
    validateData: function () {
        var instructions = $('#eXeGameInstructions').text(),
            instructionsExe = (tinyMCE.get('eXeGameInstructions').getContent()),
            showMinimize = $('#desafioEShowMinimize').is(':checked'),
            itinerary = $exeAuthoring.iDevice.gamification.itinerary.getValues();
        if (!itinerary) return false;
        if ($exeDevice.desafioTitle.length == 0) {
            $exeDevice.showMessage($exeDevice.msgs.msgTitleDesafio);
            return false;
        } else if ($exeDevice.desafioSolution.length == 0) {
            $exeDevice.showMessage($exeDevice.msgs.msgSolutionDesafio);
            return false;
        } else if ($exeDevice.desafioDescription ==0) {
            $exeDevice.showMessage($exeDevice.msgs.msgDescriptionDesafio);
            return false;
        }
        var challengesGame = $exeDevice.challengesGame;
        for (var i = 0; i < challengesGame.length; i++) {
            mChallenge = challengesGame[i]
            if (mChallenge.title.length == 0) {
                $exeDevice.showMessage($exeDevice.msgs.msgTitleChallenge);
                return false;
            } else if (mChallenge.solution.length == 0) {
                $exeDevice.showMessage($exeDevice.msgs.msgDescriptionChallenge);
                return false;
            } else if (mChallenge.description.length == 0) {
                $exeDevice.showMessage($exeDevice.msgs.msgSolutionChallenge);
                return false;
            }

        }
        for (var i = 0; i < challengesGame.length; i++) {
            var qt = challengesGame[i];
            qt.description = (qt.description);
        }
        var scorm = $exeAuthoring.iDevice.gamification.scorm.getValues();
        var data = {
            'asignatura': '',
            "author": '',
            'typeGame': 'desafio',
            'desafioTitle': $exeDevice.desafioTitle,
            'desafioTime': $exeDevice.desafioTime,
            'desafioType': $exeDevice.desafioType,
            'desafioSolution': $exeDevice.desafioSolution,
            'desafioSolved':false,
            'desafioDescription': ($exeDevice.desafioDescription),
            'instructionsExe': instructionsExe,
            'instructions': instructions,
            'showMinimize': showMinimize,
            'itinerary': itinerary,
            'challengesGame': challengesGame,
            'isScorm': scorm.isScorm,
            'textButtonScorm': scorm.textButtonScorm,
            'repeatActivity': scorm.repeatActivity,
            'title': ''
        }
        return data;
    },
    removeTags: function (str) {
        var wrapper = $("<div></div>");
        wrapper.html(str);
        return wrapper.text();
    },
    addEvents: function () {
        if($exeDevice.challengesGame.length==0){
            var challenge=$exeDevice.getChallengeDefault();
            $exeDevice.active=0,
            $exeDevice.challengesGame.push(challenge);
        }
        $('#desafioENavigationButtons').hide();
        $('#desafioEClueTitle').hide();
        $('#desafioEClue').hide();
        $('#desafioEPaste').hide();
        $('#desafioENumQuestionDiv').hide();
        $('#desafioEUseLives').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#desafioENumberLives').prop('disabled', !marcado);
        });
        $('#desafioShowSolutions').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#desafioTimeShowSolutions').prop('disabled', !marcado);
        });

        $('#desafioShowCodeAccess').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#desafioCodeAccess').prop('disabled', !marcado);
            $('#desafioMessageCodeAccess').prop('disabled', !marcado);
        });

        $('#desafioEAdd').on('click', function (e) {
            e.preventDefault();
            $exeDevice.addChallenge()
        });
        $('#desafioEFirst').on('click', function (e) {
            e.preventDefault();
            $exeDevice.firstChallenge()
        });
        $('#desafioEPrevious').on('click', function (e) {
            e.preventDefault();
            $exeDevice.previousChallenge()
        });
        $('#desafioENext').on('click', function (e) {
            e.preventDefault();
            $exeDevice.nextChallenge()
        });
        $('#desafioELast').on('click', function (e) {
            e.preventDefault();
            $exeDevice.lastChallenge()
        });
        $('#desafioEDelete').on('click', function (e) {
            e.preventDefault();
            $exeDevice.removeChallenge()
        });
        $('#desafioECopy').on('click', function (e) {
            e.preventDefault();
            $exeDevice.copyChallenge()
        });
        $('#desafioECut').on('click', function (e) {
            e.preventDefault();
            $exeDevice.cutChallenge()
        });
        $('#desafioEPaste').on('click', function (e) {
            e.preventDefault();
            $exeDevice.pasteChallenge()
        });
        $('#desafioEDesafio').on('click', function (e) {
            $exeDevice.validateChallenge(false);
            $exeDevice.typeActive=0;
            $exeDevice.showDesafio();
        });
        $('#desafioEReto').on('click', function (e) {
            $exeDevice.validateDesafio(false);
            $exeDevice.typeActive=1;
            $exeDevice.showChallenge($exeDevice.active);
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

    showDesafio:function (){
        $exeDevice.typeActive=0;
        $('#desafiolblEDTime').show();
        $('#desafioEDTime').show();
        $('#desafiolblEDType').show();
        $('#desafioEDType').show();
        $('#desafioENavigationButtons').hide();
        $('#desafioEClueTitle').hide();
        $('#desafioEClue').hide();
        $('#desafioENumQuestionDiv').hide();
        $('#desafioEDTitle').val($exeDevice.desafioTitle);
        $('#desafioEDSolution').val($exeDevice.desafioSolution);
        $('#desafioEDTime').val($exeDevice.desafioTime);
        $('#desafioEDType').val($exeDevice.desafioType);
        if(tinyMCE.get('desafioEDescription')){
            tinyMCE.get('desafioEDescription').setContent($exeDevice.desafioDescription);
        }else{
            $('#desafioEDescription').val($exeDevice.desafioDescription)
        }
    },

}