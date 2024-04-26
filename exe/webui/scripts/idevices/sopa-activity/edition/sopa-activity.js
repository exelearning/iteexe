/**
/**
 * Sopa Activity iDevice (edition code)
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Manuel Narvaez Martinez
 * Dineño: Ana María Zamora Moreno
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $exeDevice = {
    i18n: {
        category: _('Games'),
        name: _('Word Search')
    },
    msgs: {},
    active: 0,
    wordsGame: [],
    timeQuestion: 30,
    percentajeShow: 35,
    typeEdit: -1,
    numberCutCuestion: -1,
    clipBoard: '',
    version: 2,
    iDevicePath: "/scripts/idevices/sopa-activity/edition/",
    playerAudio: "",
    id: false,
    ci18n: {
        "msgReply": _("Reply"),
        "msgEnterCode": _("Enter the access code"),
        "msgErrorCode": _("The access code is not correct"),
        "msgClue": _("Cool! The clue is:"),
        "msgCodeAccess": _("Access code"),
        "msgPlayStart": _("Click here to play"),
        "msgHits": _("Hits"),
        "msgScore": _("Score"),
        "msgMinimize": _("Minimize"),
        "msgMaximize": _("Maximize"),
        "msgTime": _("Time Limit (mm:ss)"),
        "msgFullScreen": _("Full Screen"),
        "msgExitFullScreen": _("Exit Full Screen"),
        "msgNumQuestions": _("Number of questions"),
        "msgNoImage": _("No picture question"),
        "msgSuccesses": _("Right! | Excellent! | Great! | Very good! | Perfect!"),
        "msgFailures": _("It was not that! | Incorrect! | Not correct! | Sorry! | Error!"),
        "msgTryAgain": _("You need at least %s&percnt; of correct answers to get the information. Please try again."),
        "msgScoreScorm": _("The score can't be saved because this page is not part of a SCORM package."),
        "msgOnlySaveScore": _("You can only save the score once!"),
        "msgOnlySave": _("You can only save once"),
        "msgInformation": _("Information"),
        "msgOnlySaveAuto": _("Your score will be saved after each question. You can only play once."),
        "msgSaveAuto": _("Your score will be automatically saved after each question."),
        "msgSeveralScore": _("You can save the score as many times as you want"),
        "msgYouLastScore": _("The last score saved is"),
        "msgActityComply": _("You have already done this activity."),
        "msgPlaySeveralTimes": _("You can do this activity as many times as you want"),
        "msgClose": _("Close"),
        "msgPoints": _("points"),
        "msgAudio": _("Audio"),
        "msgWordsFind": _("You found all the words. Your score is %s."),
        "msgEndGameScore": _("Please start playing first..."),
        "mgsGameStart": _("The game has already started."),
        "msgYouScore": _("Score"),
        "msgEndTime": _("Game time is over. Your score is %s."),
        "msgEnd": _("Finish"),
        "msgEndGameM": _("You finished the game. Your score is %s."),
        "msgUncompletedActivity": _("Incomplete activity"),
        "msgSuccessfulActivity": _("Activity: Passed. Score: %s"),
        "msgUnsuccessfulActivity": _("Activity: Not passed. Score: %s"),
        "msgTypeGame": _('Word Search')

    },
    init: function () {
        this.ci18n.msgTryAgain = this.ci18n.msgTryAgain.replace("&percnt;", "%"); // Avoid invalid HTML
        this.setMessagesInfo();
        this.createForm();
    },
    setMessagesInfo: function () {
        var msgs = this.msgs;
        msgs.msgEProvideDefinition = _("Please provide the word definition");
        msgs.msgESelectFile = _("The selected file does not contain a valid game");
        msgs.msgEURLValid = _("You must upload or indicate the valid URL of an image");
        msgs.msgEProvideWord = _("Please provide one word or phrase");
        msgs.msgEOneQuestion = _("Please provide at least one question");
        msgs.msgECompleteQuestion = _("You have to complete the question");
        msgs.msgECompleteAllOptions = _("You have to complete all the selected options");
        msgs.msgESelectSolution = _("Choose the right answer");
        msgs.msgWriteText = _("You have to type a text in the editor");
        msgs.msgTypeChoose = _("Please check all the answers in the right order");
        msgs.msgTimeFormat = _("Please check the time format: hh:mm:ss");
        msgs.msgProvideFB = _('Message to display when passing the game');
        msgs.msgNoSuportBrowser = _("Your browser is not compatible with this tool.");
        msgs.msgIDLenght = _('The report identifier must have at least 5 characters');
    },

    importText: function(content){
        var lines = content.split('\n'),
             lineFormat = /^([^#]+)#([^#]+)(#([^#]+))?(#([^#]+))?$/,
             questions = JSON.parse(JSON.stringify($exeDevice.wordsGame));
             valids= 0;
         lines.forEach(function(line) {
            var p = $exeDevice.getCuestionDefault();
            if (lineFormat.test(line)) {
                var linarray = line.trim().split("#");
                p.word = linarray[0];
                p.definition = linarray[1];
                if(p.word.trim().length>0 && p.definition.trim().length>0 ){
                    questions.push(p);
                    valids++;
                }
            }
        });
        return valids > 0 ? questions : false;
    },

    importAdivina: function (data) {
        for (var i = 0; i < data.wordsGame.length; i++) {
            var p = $exeDevice.getCuestionDefault(),
                cuestion = data.wordsGame[i];
            p.word = cuestion.word;
            p.definition = cuestion.definition;
            p.url = cuestion.url;
            p.audio = typeof cuestion.audio == "undefined" ? "" : cuestion.audio;
            p.x = cuestion.x;
            p.y = cuestion.y;
            p.author = cuestion.author;
            p.alt = cuestion.alt;
            p.solution = '';
            $exeDevice.wordsGame.push(p);
        }
        return $exeDevice.wordsGame;
    },
    importRosco: function (data) {
        for (var i = 0; i < data.wordsGame.length; i++) {
            var p = $exeDevice.getCuestionDefault(),
                cuestion = data.wordsGame[i];
            p.word = cuestion.word;
            p.definition = cuestion.definition;
            p.url = cuestion.url;
            p.audio = typeof cuestion.audio == "undefined" ? "" : cuestion.audio;
            p.x = cuestion.x;
            p.y = cuestion.y;
            p.author = cuestion.author;
            p.alt = cuestion.alt;
            p.solution = '';
            if(p.word && p.word.length >0 && p.definition && p.definition.length > 0){
                $exeDevice.wordsGame.push(p);
            }
        }
        return $exeDevice.wordsGame;
    },
    createForm: function () {
        var field = $("textarea.jsContentEditor").eq(0)
        if ($(".iDevice_wrapper.SopaIdevice").length > 0) {
            html = '<p>' + _('Only one Word Search game per page.') + '</p>';
            field.before(html);
            return;
        }

        var path = $exeDevice.iDevicePath,
            html = '\
			<div id="gameQEIdeviceForm">\
                <div class="exe-idevice-info">' + _("Create word search games with additional text, images or sound.") + ' <a href="https://descargas.intef.es/cedec/exe_learning/Manuales/manual_exe29/sopa_de_letras.html" hreflang="es" target="_blank">' + _("Use Instructions") + '</a></div>\
				<div class="exe-form-tab" title="' + _('General settings') + '">\
                ' + $exeAuthoring.iDevice.gamification.instructions.getFieldset(_("Find the hidden words.")) + '\
					<fieldset class="exe-fieldset exe-fieldset-closed">\
						<legend><a href="#">' + _("Options") + '</a></legend>\
                        <div>\
						<p>\
							<label for="sopaEShowMinimize"><input type="checkbox" id="sopaEShowMinimize"> ' + _("Show minimized.") + ' </label>\
                        </p>\
                        <p>\
							<label for="sopaETime">' + _("Time (minutes)") + ':\
							<input type="number" name="sopaETime" id="sopaETime" value="0" min="0" max="59" /> </label>\
                        </p>\
                        <p>\
							<label for="sopaEShowResolve"><input type="checkbox" id="sopaEShowResolve" checked> ' + _('Show "Solve" button.') + ' </label>\
                        </p>\
                        <p>\
                            <span>' + _('Accept') + ': </span>\
                            <label for="sopaEDiagonals"><input type="checkbox"  id="sopaEDiagonals"> ' + _("Diagonal") + '. </label> \
                            <label for="sopaEReverses"><input type="checkbox"  id="sopaEReverses"> ' + _("Inverse") + '. </label> \
                        </p>\
                        <p>\
                            <label for="sopaEHasFeedBack"><input type="checkbox"  id="sopaEHasFeedBack"> ' + _("Feedback") + '. </label> \
                            <label for="sopaEPercentajeFB"><input type="number" name="sopaEPercentajeFB" id="sopaEPercentajeFB" value="100" min="5" max="100" step="5" disabled /> ' + _("&percnt; right to see the feedback") + ' </label>\
                        </p>\
                        <p id="sopaEFeedbackP" class="SPE-EFeedbackP">\
                            <textarea id="sopaEFeedBackEditor" class="exe-html-editor"></textarea>\
                        </p>\
                        <p>\
                            <label for="sopaEPercentajeQuestions">% ' + _("Words") + ':  <input type="number" name="sopaEPercentajeQuestions" id="sopaEPercentajeQuestions" value="100" min="1" max="100" /> </label>\
                            <span id="sopaENumeroPercentaje">1/1</span>\
                        </p>\
                        <p>\
                            <strong class="GameModeLabel"><a href="#sopaEEvaluationHelp" id="sopaEEvaluationHelpLnk" class="GameModeHelpLink" title="' + _("Help") + '"><img src="' + path + 'quextIEHelp.gif"  width="16" height="16" alt="' + _("Help") + '"/></a></strong>\
							<label for="sopaEEvaluation"><input type="checkbox" id="sopaEEvaluation"> ' + _("Progress report") + '. </label> \
							<label for="sopaEEvaluationID">' + _("Identifier") + ':\
							<input type="text" id="sopaEEvaluationID" disabled/> </label>\
                        </p>\
                        <div id="sopaEEvaluationHelp" class="SPE-TypeGameHelp">\
                            <p>' +_("You must indicate the ID. It can be a word, a phrase or a number of more than four characters. You will use this ID to mark the activities covered by this progress report. It must be the same in all iDevices of a report and different in each report.") + '</p>\
                        </div>\
                    </div>\
                    </fieldset>\
                    <fieldset class="exe-fieldset">\
                    <legend><a href="#">' + _("Words/Phrases") + '</a></legend>\
                    <div class="SPE-EPanel" id="sopaEPanel">\
                        <div class="SPE-EOptionsMedia">\
                            <div class="SPE-EOptionsGame">\
                                <span class="SPE-sopaETitleAudio" >' + _("Word") + '</span>\
                                <div class="SPE-EInputImage">\
                                    <label class="sr-av" for="sopaESolutionWord">' + _("Word/Phrase") + ': </label>\
                                    <input type="text"  id="sopaESolutionWord"/>\
                                </div>\
                                <span class="SPE-sopaETitleAudio">' + _("Definition") + '</span>\
                                <div class="SPE-EInputImage">\
                                    <label class="sr-av" for="sopaEDefinitionWord">' + _("Definition") + ': </label>\
                                    <input type="text"  id="sopaEDefinitionWord"/>\
                                </div>\
                                <span class="SPE-ETitleImage" id="sopaETitleImage">' + _("Image URL") + '</span>\
                                <div class="SPE-EInputImage" id="sopaEInputImage">\
                                    <label class="sr-av" for="sopaEURLImage">' + _("Image URL") + '</label>\
                                    <input type="text" class="exe-file-picker SPE-EURLImage"  id="sopaEURLImage"/>\
                                    <a href="#" id="sopaEPlayImage" class="SPE-ENavigationButton SPE-EPlayVideo" title="' + _("Show") + '"><img src="' + path + 'quextIEPlay.png" alt="' + _("Show") + '" class="SPE-EButtonImage b-play" /></a>\
                                    <a href="#" id="sopaEShowMore" class="SPE-ENavigationButton SPE-EShowMore" title="' + _("More") + '"><img src="' + path + 'quextEIMore.png" alt="' + _("More") + '" class="SPE-EButtonImage b-play" /></a>\
                                </div>\
                                <div class="SPE-EInputOptionsImage" id="sopaEInputOptionsImage"></div>\
                                <div class="SPE-ECoord">\
                                        <label for="sopaEXImage">X:</label>\
                                        <input id="sopaEXImage" type="text" value="0" />\
                                        <label for="sopaEXImage">Y:</label>\
                                        <input id="sopaEYImage" type="text" value="0" />\
                                </div>\
                                <div class="SPE-EAuthorAlt"  id="sopaEAuthorAlt">\
                                    <div class="SPE-EInputAuthor">\
                                            <label>' + _('Authorship') + '</label><input id="sopaEAuthor" type="text"  class="SPE-EAuthor" />\
                                    </div>\
                                    <div class="SPE-EInputAlt">\
                                        <label>' + _('Alt') + '</label><input  id="sopaEAlt" type="text" class="SPE-EAlt" />\
                                    </div>\
                                </div>\
                                <span id="sopaETitleAudio">' + _("Audio") + '</span>\
                                <div class="SPE-EInputAudio" id="sopaEInputAudio">\
                                    <label class="sr-av" for="sopaEURLAudio">' + _("URL") + '</label>\
                                    <input type="text" class="exe-file-picker SPE-EURLAudio"  id="sopaEURLAudio"/>\
                                    <a href="#" id="sopaEPlayAudio" class="SPE-ENavigationButton SPE-EPlayVideo" title="' + _("Play audio") + '"><img src="' + path + 'quextIEPlay.png" alt="' + _("Play audio") + '" class="SPE-EButtonImage b-play" /></a>\
                                </div>\
                            </div>\
                            <div class="SPE-EMultiMediaOption">\
                                <div class="SPE-EMultimedia" id="sopaEMultimedia">\
                                    <img class="SPE-EMedia" src="' + path + 'quextIEImage.png" id="sopaEImage" alt="' + _("Image") + '" />\
                                    <img class="SPE-EMedia" src="' + path + 'quextIEImage.png" id="sopaENoImage" alt="' + _("No image") + '" />\
                                    <img class="SPE-ECursor" src="' + path + 'quextIECursor.gif" id="sopaECursor" alt="" />\
                                </div>\
                            </div>\
                        </div>\
                        <div class="SPE-EContents">\
                            <div class="SPE-ENavigationButtons">\
                                <a href="#" id="sopaEAdd" class="SPE-ENavigationButton" title="' + _("Add question") + '"><img src="' + path + 'quextIEAdd.png"  alt="' + _("Add question") + '" class="SPE-EButtonImage b-add" /></a>\
                                <a href="#" id="sopaEFirst" class="SPE-ENavigationButton"  title="' + _("First question") + '"><img src="' + path + 'quextIEFirst.png"  alt="' + _("First question") + '" class="SPE-EButtonImage b-first" /></a>\
                                <a href="#" id="sopaEPrevious" class="SPE-ENavigationButton" title="' + _("Previous question") + '"><img src="' + path + 'quextIEPrev.png" alt="' + _("Previous question") + '" class="SPE-EButtonImage b-prev" /></a>\
                                <label class="sr-av" for="sopaENumberQuestion">' + _("Question number:") + ':</label><input type="text" class="SPE-NumberQuestion"  id="sopaENumberQuestion" value="1"/>\
                                <a href="#" id="sopaENext" class="SPE-ENavigationButton"  title="' + _("Next question") + '"><img src="' + path + 'quextIENext.png" alt="' + _("Next question") + '" class="SPE-EButtonImage b-next" /></a>\
                                <a href="#" id="sopaELast" class="SPE-ENavigationButton"  title="' + _("Last question") + '"><img src="' + path + 'quextIELast.png" alt="' + _("Last question") + '" class="SPE-EButtonImage b-last" /></a>\
                                <a href="#" id="sopaEDelete" class="SPE-ENavigationButton" title="' + _("Delete question") + '"><img src="' + path + 'quextIEDelete.png" alt="' + _("Delete question") + '" class="SPE-EButtonImage b-delete" /></a>\
                                <a href="#" id="sopaECopy" class="SPE-ENavigationButton" title="' + _("Copy question") + '"><img src="' + path + 'quextIECopy.png" + alt="' + _("Copy question") + '" class="SPE-EButtonImage b-copy" /></a>\
                                <a href="#" id="sopaECut" class="SPE-ENavigationButton" title="' + _("Cut question") + '"><img src="' + path + 'quextIECut.png" + alt="' + _("Cut question") + '"  class="SPE-EButtonImage b-cut" /></a>\
                                <a href="#" id="sopaEPaste" class="SPE-ENavigationButton"  title="' + _("Paste question") + '"><img src="' + path + 'quextIEPaste.png" alt="' + _("Paste question") + '" class="SPE-EButtonImage b-paste" /></a>\
                            </div>\
                        </div>\
                        <div class="SPE-ENumQuestionDiv" id="sopaENumQuestionDiv">\
                            <div class="SPE-ENumQ"><span class="sr-av">' + _("Number of questions:") + '</span></div>\ <span class="SPE-ENumQuestions" id="sopaENumQuestions">0</span>\
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
        field.before(html);
        $exeAuthoring.iDevice.tabs.init("gameQEIdeviceForm");
        $exeAuthoring.iDevice.gamification.scorm.init();
        this.enableForm(field);
    },
    enableForm: function (field) {
        $exeDevice.initQuestions();
        $exeDevice.loadPreviousValues(field);
        $exeDevice.addEvents();
    },
    updateQuestionsNumber: function () {
        var percentaje = parseInt($exeDevice.removeTags($('#sopaEPercentajeQuestions').val()));
        if (isNaN(percentaje)) {
            return;
        }
        percentaje = percentaje < 1 ? 1 : percentaje;
        percentaje = percentaje > 100 ? 100 : percentaje;
        var num = Math.round((percentaje * $exeDevice.wordsGame.length) / 100);
        num = num == 0 ? 1 : num;
        $('#sopaENumeroPercentaje').text(num + "/" + $exeDevice.wordsGame.length)
    },
    showQuestion: function (i) {
        var num = i < 0 ? 0 : i;
        num = num >= $exeDevice.wordsGame.length ? $exeDevice.wordsGame.length - 1 : num;
        var p = $exeDevice.wordsGame[num];
        $exeDevice.changeTypeQuestion();
        $('#sopaEDefinitionWord').val(p.definition);
        $('#sopaENumQuestions').text($exeDevice.wordsGame.length);
        $('#sopaESolutionWord').val(p.word);
        $('#sopaEPercentageShow').val(p.percentageShow);
        $('#sopaEURLImage').val(p.url);
        $('#sopaEXImage').val(p.x);
        $('#sopaEYImage').val(p.y);
        $('#sopaEAuthor').val(p.author);
        $('#sopaEAlt').val(p.alt);
        $exeDevice.showImage(p.url, p.x, p.y, p.alt);

        $exeDevice.stopSound();
        if (p.audio.trim().length > 4) {
            $exeDevice.playSound(p.audio.trim());
        }
        $('#sopaEURLAudio').val(p.audio);
        $('#sopaENumberQuestion').val(i + 1);
    },

    initQuestions: function () {
        $('#sopaEInputImage').css('display', 'flex');
        $("#sopaEMediaNormal").prop("disabled", false);
        $("#sopaEMediaImage").prop("disabled", false);
        if ($exeDevice.wordsGame.length == 0) {
            var question = $exeDevice.getCuestionDefault();
            $exeDevice.wordsGame.push(question);
            this.changeTypeQuestion()
        }
        this.active = 0;
    },

    changeTypeQuestion: function () {
        $('#sopaEAuthorAlt').hide();
        $exeDevice.showImage($('#sopaEURLImage').val(), $('#sopaEXImage').val(), $('#sopaEYImage').val(), $('#sopaEAlt').val())
    },


    getCuestionDefault: function () {
        var p = new Object();
        p.word = '';
        p.definition = '';
        p.url = '';
        p.audio = '';
        p.x = 0;
        p.y = 0;
        p.author = '';
        p.alt = '';
        p.solution = '';
        return p;
    },
    loadPreviousValues: function (field) {
        var originalHTML = field.val();
        if (originalHTML != '') {
            var wrapper = $("<div></div>");
            wrapper.html(originalHTML);
            var json = $('.sopa-DataGame', wrapper).text(),
                version = $('.sopa-version', wrapper).text();

            if (version.length == 1) {
                json = $exeDevice.Decrypt(json);
            }
            var dataGame = $exeDevice.isJsonString(json),
                $imagesLink = $('.sopa-LinkImages', wrapper),
                $audiosLink = $('.sopa-LinkAudios', wrapper);
            version = version == '' ? 0 : parseInt(version);

            $imagesLink.each(function () {
                var iq = parseInt($(this).text());
                if (!isNaN(iq) && iq < dataGame.wordsGame.length) {
                    dataGame.wordsGame[iq].url = $(this).attr('href');
                    if (dataGame.wordsGame[iq].url.length < 4) {
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
            var instructions = $(".sopa-instructions", wrapper);
            if (instructions.length == 1) {
                instructions = instructions.html() || ''
                if (tinyMCE.get('eXeGameInstructions')) {
                    tinyMCE.get('eXeGameInstructions').setContent(instructions);
                } else {
                    $("#eXeGameInstructions").val(instructions)
                }
            }

            var textFeedBack = $(".sopa-feedback-game", wrapper);
            if (textFeedBack.length == 1) {
                textFeedBack = textFeedBack.html() || ''
                if (tinyMCE.get('sopaEFeedBackEditor')) {
                    tinyMCE.get('sopaEFeedBackEditor').setContent(textFeedBack);
                } else {
                    $("#sopaEFeedBackEditor").val(textFeedBack)
                }
            }

            var textAfter = $(".sopa-extra-content", wrapper);
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
    getIndexTime: function (tm) {
        var tms = [15, 30, 60, 180, 300, 600, 900],
            itm = tms.indexOf(tm);
        itm = itm < 0 ? 1 : itm;
        return itm;
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
        var textFeedBack = tinyMCE.get('sopaEFeedBackEditor').getContent();
        if (dataGame.instructions != "") divContent = '<div class="sopa-instructions gameQP-instructions">' + dataGame.instructions + '</div>';
        var linksImages = $exeDevice.createlinksImage(dataGame.wordsGame),
            linksAudios = $exeDevice.createlinksAudio(dataGame.wordsGame);
        var html = '<div class="sopa-IDevice">';
        html += '<div class="sopa-version js-hidden">' + $exeDevice.version + '</div>';
        html += '<div class="sopa-feedback-game">' + textFeedBack + '</div>';
        html += divContent;
        html += '<div class="sopa-DataGame js-hidden">' + json + '</div>';
        html += linksImages;
        html += linksAudios;
        var textAfter = tinyMCE.get('eXeIdeviceTextAfter').getContent();
        if (textAfter != "") {
            html += '<div class="sopa-extra-content">' + textAfter + '</div>';
        }
        html += '<div class="sopa-bns js-hidden">' + $exeDevice.msgs.msgNoSuportBrowser + '</div>';
        html += '</div>';
        return html;
    },

    createlinksImage: function (wordsGame) {
        var html = '';
        for (var i = 0; i < wordsGame.length; i++) {
            var linkImage = '';
            if (!wordsGame[i].url.indexOf('http') == 0) {
                linkImage = '<a href="' + wordsGame[i].url + '" class="js-hidden sopa-LinkImages">' + i + '</a>';
            }
            html += linkImage;
        }
        return html;
    },

    createlinksAudio: function (wordsGame) {
        var html = '';
        for (var i = 0; i < wordsGame.length; i++) {
            var linkImage = '';
            if (!wordsGame[i].audio.indexOf('http') == 0 && wordsGame[i].audio.length > 4) {
                linkImage = '<a href="' + wordsGame[i].audio + '" class="js-hidden sopa-LinkAudios">' + i + '</a>';
            }
            html += linkImage;
        }
        return html;
    },

    validateQuestion: function () {
        var message = '',
            msgs = $exeDevice.msgs,
            p = new Object();
        p.word = $('#sopaESolutionWord').val().trim();
        p.definition = $('#sopaEDefinitionWord').val();
        p.x = parseFloat($('#sopaEXImage').val());
        p.y = parseFloat($('#sopaEYImage').val());;
        p.author = $('#sopaEAuthor').val();
        p.alt = $('#sopaEAlt').val();
        p.url = $('#sopaEURLImage').val().trim();
        p.audio = $('#sopaEURLAudio').val();
        $exeDevice.stopSound();

        p.percentageShow = parseInt($('#sopaEPercentageShow').val());
        if (p.word.length == 0) {
            message = $exeDevice.msgs.msgEProvideWord;
        } else if (p.definition.length == 0) {
            message = $exeDevice.msgs.msgEProvideDefinition;
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
            textFeedBack = tinyMCE.get('sopaEFeedBackEditor').getContent(),
            textAfter = tinyMCE.get('eXeIdeviceTextAfter').getContent(),
            showMinimize = $('#sopaEShowMinimize').is(':checked'),
            showResolve = $('#sopaEShowResolve').is(':checked'),
            itinerary = $exeAuthoring.iDevice.gamification.itinerary.getValues(),
            feedBack = $('#sopaEHasFeedBack').is(':checked'),
            percentajeFB = parseInt(clear($('#sopaEPercentajeFB').val())),
            percentajeQuestions = parseInt(clear($('#sopaEPercentajeQuestions').val())),
            time = parseInt(clear($('#sopaETime').val())),
            diagonals = $('#sopaEDiagonals').is(':checked'),
            reverses = $('#sopaEReverses').is(':checked'),
            evaluation = $('#sopaEEvaluation').is(':checked'),
            evaluationID = $('#sopaEEvaluationID').val(),
            id = $exeDevice.id ? $exeDevice.id : $exeDevice.generarID();
        if (feedBack && textFeedBack.trim().length == 0) {
            eXe.app.alert($exeDevice.msgs.msgProvideFB);
            return false;
        }
        var wordsGame = $exeDevice.wordsGame;
        if (wordsGame.length == 0) {
            eXe.app.alert($exeDevice.msgs.msgEOneQuestion);
            return false;
        }
        if (evaluation && evaluationID.length < 5) {
            eXe.app.alert($exeDevice.msgs.msgIDLenght);
            return false;
        }
        for (var i = 0; i < wordsGame.length; i++) {
            var mquestion = wordsGame[i];
            if (mquestion.word.length == 0) {
                $exeDevice.showMessage($exeDevice.msgs.msgEProvideWord);
                return false;
            } else if ((mquestion.definition.length == 0) && (mquestion.url.length < 4)) {
                eXe.app.alert($exeDevice.msgs.msgEProvideDefinition + ' ' + mquestion.word);
                return false;
            }
        }
        var scorm = $exeAuthoring.iDevice.gamification.scorm.getValues();
        var data = {
            'typeGame': 'Sopa',
            'instructions': instructions,
            'showMinimize': showMinimize,
            'itinerary': itinerary,
            'wordsGame': wordsGame,
            'isScorm': scorm.isScorm,
            'textButtonScorm': scorm.textButtonScorm,
            'repeatActivity': scorm.repeatActivity,
            'textFeedBack': escape(textFeedBack),
            'textAfter': escape(textAfter),
            'feedBack': feedBack,
            'percentajeFB': percentajeFB,
            'version': 1,
            'percentajeQuestions': percentajeQuestions,
            'time': time,
            'diagonals': diagonals,
            'reverses': reverses,
            'showResolve': showResolve,
            'evaluation':evaluation,
            'evaluationID':evaluationID,
            'id': id
        }
        return data;
    },
    showImage: function (url, x, y, alt, type) {
        var $image = $('#sopaEImage'),
            $cursor = $('#sopaECursor');
        $image.hide();
        $cursor.hide();
        $image.attr('alt', alt);
        $('#sopaENoImage').show();
        url = $exeDevice.extractURLGD(url);
        $image.prop('src', url)
            .on('load', function () {
                if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                    return false;
                } else {
                    var mData = $exeDevice.placeImageWindows(this, this.naturalWidth, this.naturalHeight);
                    $exeDevice.drawImage(this, mData);
                    $image.show();
                    $('#sopaENoImage').hide();
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
        $('#sopaEPaste').hide();
        $('#sopaEAdd').on('click', function (e) {
            e.preventDefault();
            $exeDevice.addQuestion()
        });
        $('#sopaEFirst').on('click', function (e) {
            e.preventDefault();
            $exeDevice.firstQuestion()
        });
        $('#sopaEPrevious').on('click', function (e) {
            e.preventDefault();
            $exeDevice.previousQuestion()
        });
        $('#sopaENext').on('click', function (e) {
            e.preventDefault();
            $exeDevice.nextQuestion()
        });
        $('#sopaELast').on('click', function (e) {
            e.preventDefault();
            $exeDevice.lastQuestion()
        });
        $('#sopaEDelete').on('click', function (e) {
            e.preventDefault();
            $exeDevice.removeQuestion()
        });
        $('#sopaECopy').on('click', function (e) {
            e.preventDefault();
            $exeDevice.copyQuestion()
        });
        $('#sopaECut').on('click', function (e) {
            e.preventDefault();
            $exeDevice.cutQuestion()
        });
        $('#sopaEPaste').on('click', function (e) {
            e.preventDefault();
            $exeDevice.pasteQuestion()
        });
        $('#sopaEPlayAudio').on('click', function (e) {
            e.preventDefault();
            var selectedFile = $('#sopaEURLAudio').val().trim();
            if (selectedFile.length > 4) {
                $exeDevice.stopSound();
                $exeDevice.playSound(selectedFile);
            }
        });

        $('#sopaEPercentageShow').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 3);
            this.value = v;
        });
        $('#sopaEPercentageShow').on('focusout', function () {
            this.value = this.value.trim() == '' ? 35 : this.value;
            this.value = this.value > 100 ? 100 : this.value;
            this.value = this.value < 0 ? 0 : this.value;
        });

        if (window.File && window.FileReader && window.FileList && window.Blob) {
            $('#eXeGameExportImport .exe-field-instructions').eq(0).text( _("Supported formats") + ': json, txt');
            $('#eXeGameExportImport').show();
            $('#eXeGameImportGame').attr('accept', '.txt, .json, .xml');
            $('#eXeGameImportGame').on('change', function (e) {
                var file = e.target.files[0];
                if (!file) {
                    eXe.app.alert(_("Select a file")  + " (txt, json)");
                    return;
                }
                if (!file.type || !(file.type.match('text/plain') || file.type.match('application/json') || file.type.match('application/xml') || file.type.match('text/xml'))) {
                    eXe.app.alert(_("Select a file")  + " (txt, json)");
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

        $('#sopaEURLImage').on('change', function () {
            var validExt = ['jpg', 'png', 'gif', 'jpeg', 'svg'],
                selectedFile = $(this).val(),
                ext = selectedFile.split('.').pop().toLowerCase();
            if ((selectedFile.indexOf('resources') == 0 || selectedFile.indexOf('/previews/') == 0) && validExt.indexOf(ext) == -1) {
                $exeDevice.showMessage(_("Supported formats") + ": jpg, jpeg, gif, png, svg");
                return false;
            }
            var url = selectedFile,
                alt = $('#sopaEAlt').val(),
                x = parseFloat($('#sopaEXImage').val()),
                y = parseFloat($('#sopaEYImage').val());
            $exeDevice.showImage(url, x, y, alt);
        });

        $('#sopaEPlayImage').on('click', function (e) {
            e.preventDefault();
            var validExt = ['jpg', 'png', 'gif', 'jpeg', 'svg'],
                selectedFile = $('#sopaEURLImage').val(),
                ext = selectedFile.split('.').pop().toLowerCase();
            if ((selectedFile.indexOf('resources') == 0 || selectedFile.indexOf('/previews/') == 0) && validExt.indexOf(ext) == -1) {
                $exeDevice.showMessage(_("Supported formats") + ": jpg, jpeg, gif, png, svg");
                return false;
            }
            var url = selectedFile,
                alt = $('#sopaEAlt').val(),
                x = parseFloat($('#sopaEXImage').val()),
                y = parseFloat($('#sopaEYImage').val());
            $exeDevice.showImage(url, x, y, alt);
        });

        $('#sopaEImage').on('click', function (e) {
            $exeDevice.clickImage(this, e.pageX, e.pageY);
        });
        $('#sopaECursor').on('click', function (e) {
            $(this).hide();
            $('#sopaEXImage').val(0);
            $('#sopaEYImage').val(0);
        });

        $('#sopaEURLAudio').on('change', function () {
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
        $('#sopaEHasFeedBack').on('change', function () {
            var marcado = $(this).is(':checked');
            if (marcado) {
                $('#sopaEFeedbackP').show();
            } else {
                $('#sopaEFeedbackP').hide();
            }
            $('#sopaEPercentajeFB').prop('disabled', !marcado);
        });


        $('#sopaEPercentajeQuestions').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 3);
            this.value = v;
            if (this.value > 0 && this.value < 101) {
                $exeDevice.updateQuestionsNumber();
            }
        });
        $('#sopaEPercentajeQuestions').on('click', function () {
            $exeDevice.updateQuestionsNumber();
        });
        $('#sopaEPercentajeQuestions').on('focusout', function () {
            this.value = this.value.trim() == '' ? 100 : this.value;
            this.value = this.value > 100 ? 100 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
            $exeDevice.updateQuestionsNumber();
        });
        $('#sopaENumberQuestion').keyup(function (e) {
            if (e.keyCode == 13) {
                var num = parseInt($(this).val());
                if (!isNaN(num) && num > 0) {
                    if ($exeDevice.validateQuestion() != false) {
                        $exeDevice.active = num < $exeDevice.wordsGame.length ? num - 1 : $exeDevice.wordsGame.length - 1;
                        $exeDevice.showQuestion($exeDevice.active);

                    } else {
                        $(this).val($exeDevice.active + 1)
                    }
                } else {
                    $(this).val($exeDevice.active + 1)
                }

            }
        });
        $('#sopaEShowMore').on('click', function (e) {
            e.preventDefault();
            $('#sopaEAuthorAlt').slideToggle();
            if ($('#sopaEAuthorAlt').is(":visible")) {
                $('#sopaEAuthorAlt').css('display', 'flex')
            }
        });
        $('#sopaETime').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 1);
            this.value = v;
        });
        $('#sopaETime').on('focusout', function () {
            this.value = this.value.trim() == '' ? 0 : this.value;
            this.value = this.value > 59 ? 59 : this.value;
            this.value = this.value < 0 ? 0 : this.value;
        });
        $('#sopaEEvaluation').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#sopaEEvaluationID').prop('disabled', !marcado);
        });
        $("#sopaEEvaluationHelpLnk").click(function () {
            $("#sopaEEvaluationHelp").toggle();
            return false;

        });
        $exeAuthoring.iDevice.gamification.itinerary.addEvents();
    },

    clearQuestion: function () {

        //$("input.myclass[name='myname'][value='the_value']").prop("checked", true);
        $('#sopaEURLImage').val('');
        $('#sopaEXImage').val('0');
        $('#sopaEYImage').val('0');
        $('#sopaEAuthor').val('');
        $('#sopaEAlt').val('');
        $('#sopaEDefinitionWord').val('');
        $('#sopaESolutionWord').val('');
        $('#sopaEURLAudio').val('');
        $exeDevice.changeTypeQuestion();
    },

    addQuestion: function () {
        if ($exeDevice.validateQuestion() != false) {
            $exeDevice.clearQuestion();
            $exeDevice.wordsGame.push($exeDevice.getCuestionDefault());
            $exeDevice.active = $exeDevice.wordsGame.length - 1;
            $('#sopaENumberQuestion').val($exeDevice.wordsGame.length);
            $exeDevice.typeEdit = -1;
            $('#sopaEPaste').hide();
            $('#sopaENumQuestions').text($exeDevice.wordsGame.length);
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
            $('#sopaEPaste').hide();
            $('#sopaENumQuestions').text($exeDevice.wordsGame.length);
            $('#sopaENumberQuestion').val($exeDevice.active + 1);
            $exeDevice.updateQuestionsNumber();
        }

    },

    copyQuestion: function () {
        if ($exeDevice.validateQuestion() != false) {
            $exeDevice.typeEdit = 0;
            $exeDevice.clipBoard = $exeDevice.wordsGame[$exeDevice.active];
            $('#sopaEPaste').show();
        }

    },

    cutQuestion: function () {
        if ($exeDevice.validateQuestion() != false) {
            $exeDevice.numberCutCuestion = $exeDevice.active;
            $exeDevice.typeEdit = 1;
            $('#sopaEPaste').show();

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
        if ($exeDevice.typeEdit == 0) {
            $exeDevice.active++;
            $exeDevice.wordsGame.splice($exeDevice.active, 0, $exeDevice.clipBoard);
            $exeDevice.showQuestion($exeDevice.active);
        } else if ($exeDevice.typeEdit == 1) {
            $('#sopaEPaste').hide();
            $exeDevice.typeEdit = -1;
            $exeDevice.arrayMove($exeDevice.wordsGame, $exeDevice.numberCutCuestion, $exeDevice.active);
            $exeDevice.showQuestion($exeDevice.active);
            $('#sopaENumQuestions').text($exeDevice.wordsGame.length);
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
        game.percentajeQuestions = typeof game.percentajeQuestions == "undefined" ? 100 : game.percentajeQuestions;
        game.percentageShow = $exeDevice.percentageShow;
        game.evaluation = typeof game.evaluation != "undefined" ? game.evaluation : false;
        game.evaluationID = typeof game.evaluationID != "undefined" ? game.evaluationID : '';
        $exeDevice.id = typeof game.id != "undefined" ? game.id : false;
        $('#sopaEShowMinimize').prop('checked', game.showMinimize);
        $('#sopaEShowResolve').prop('checked', game.showResolve);
        $("#sopaEHasFeedBack").prop('checked', game.feedBack);
        $("#sopaEDiagonals").prop('checked', game.diagonals);
        $("#sopaEReverses").prop('checked', game.reverses)
        $('#sopaETime').val(game.time);
        $("#sopaEPercentajeFB").val(game.percentajeFB);
        $('#sopaEPercentajeQuestions').val(game.percentajeQuestions);
        $('#sopaEEvaluation').prop('checked', game.evaluation);
        $('#sopaEEvaluationID').val(game.evaluationID);
        $("#sopaEEvaluationID").prop('disabled', (!game.evaluation));
        $exeAuthoring.iDevice.gamification.scorm.setValues(game.isScorm, game.textButtonScorm, game.repeatActivity);
        $exeDevice.wordsGame = game.wordsGame;
        if (game.feedBack) {
            $('#sopaEFeedbackP').show();
        } else {
            $('#sopaEFeedbackP').hide();
        }
        $('#sopaEPercentajeFB').prop('disabled', !game.feedBack);
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
        link.download = _("Activity") + "-Sopa.json";
        document.getElementById('gameQEIdeviceForm').appendChild(link);
        link.click();
        setTimeout(function () {
            document.getElementById('gameQEIdeviceForm').removeChild(link);
            window.URL.revokeObjectURL(data);
        }, 100);
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
            p.definition = question.definition;
            p.word = question.word;
            if (p.word.length > 0 && p.definition.length > 0) {
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
        var valids = 0;
        wordsJson.forEach(function(word) {
            var p = $exeDevice.getCuestionDefault();
            p.definition = word.definition;
            p.word = word.word;
            if (p.word.length > 0 && p.definition.length > 0) {
                $exeDevice.wordsGame.push(p);
                valids++;
            }
        });
        return valids > 0 ? $exeDevice.wordsGame : false;
    },
    importGame: function (content, filetype) {
        var game = $exeDevice.isJsonString(content);
        if (content && content.includes('\u0000')){
            $exeDevice.showMessage(_('Sorry, wrong file format'));
            return;
        } else if (!game && content){
            var words = false;
            if(filetype.match('text/plain')){
                words = $exeDevice.importText(content);
            }else if(filetype.match('application/xml') || filetype.match('text/xml')){
                words =  $exeDevice.importMoodle(content);
            }
            if (words && words.length > 1){
                $exeDevice.wordsGame = words;
            }else{
                $exeDevice.showMessage(_('Sorry, wrong file format'));
                return;
            }
        } else if (!game || typeof game.typeGame == "undefined") {
            $exeDevice.showMessage($exeDevice.msgs.msgESelectFile);
            return;
        } else if (game.typeGame == 'Sopa') {
            $exeDevice.active = 0;
            game.id = $exeDevice.generarID();
            $exeDevice.updateFieldGame(game);
            var instructions = game.instructionsExe || game.instructions,
                tAfter = game.textAfter || "",
                textFeedBack = game.textFeedBack || "";
            if (tinyMCE.get('eXeGameInstructions')) {
                tinyMCE.get('eXeGameInstructions').setContent(unescape(instructions));
            } else {
                $("#eXeGameInstructions").val(unescape(instructions))
            }
            if (tinyMCE.get('sopaEFeedBackEditor')) {
                tinyMCE.get('sopaEFeedBackEditor').setContent(unescape(textFeedBack));
            } else {
                $("#sopaEFeedBackEditor").val(unescape(textFeedBack))
            }
            if (tinyMCE.get('eXeIdeviceTextAfter')) {
                tinyMCE.get('eXeIdeviceTextAfter').setContent(unescape(tAfter));
            } else {
                $("#eXeIdeviceTextAfter").val(unescape(tAfter))
            }
        } else if (game.typeGame == 'Adivina') {
            $exeDevice.importAdivina(game);
        } else if (game.typeGame == 'Rosco') {
            $exeDevice.importRosco(game);
        } else {
            $exeDevice.showMessage($exeDevice.msgs.msgESelectFile);
            return;
        }
        $exeDevice.active = 0;
        $exeDevice.showQuestion($exeDevice.active);
        $exeDevice.deleteEmptyQuestion();
        $exeDevice.updateQuestionsNumber();
        $('.exe-form-tabs li:first-child a').click();
    },
    deleteEmptyQuestion: function () {
        if ($exeDevice.wordsGame.length > 1) {
            var word = $('#sopaESolutionWord').val().trim();
            if (word.trim().length == 0) {
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
        var time = Math.round(totalSec);
        var hours = parseInt(time / 3600) % 24;
        var minutes = parseInt(time / 60) % 60;
        var seconds = time % 60;
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
        var $cursor = $('#sopaECursor'),
            $x = $('#sopaEXImage'),
            $y = $('#sopaEYImage'),
            $img = $(img),
            posX = epx - $img.offset().left,
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