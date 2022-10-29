/**
/**
 * Math problems Activity iDevice (edition code)
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Ignacio Gros
 * Author: Manuel Narvaez Martinez
 * Graphic design: Ana María Zamora Moreno
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $exeDevice = {
    i18n: {
        category: _('Games'),
        name: _('Math Problems')
    },
    msgs: {},
    defaultSettings: {
        type: "result", // result, operator, operandA, operandB, random (to guess)
        number: 10, // Number or operations
        operations: '1111', // Add, subtract, multiply, divide,
        min: -1000, // Smallest number included
        max: 1000, // Highest number included
        decimals: 0, // Allow decimals
        decimalsInResults: 1, // Allow decimals in results
        negative: 1, // Allow negative results
        zero: 1 // Allow zero in results
    },
    iDevicePath: "/scripts/idevices/mathproblems-activity/edition/",
    ci18n: {
        "msgReply": _("Reply"),
        "msgSubmit": _("Submit"),
        "msgEnterCode": _("Enter the access code"),
        "msgErrorCode": _("The access code is not correct"),
        "msgGameOver": _("Game Over!"),
        "msgClue": _("Cool! The clue is:"),
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
        "msgTime": _("Time Limit (mm:ss)"),
        "msgFullScreen": _("Full Screen"),
        "msgExitFullScreen": _("Exit Full Screen"),
        "msgNumQuestions": _("Number of questions"),
        "mgsAllQuestions": _("Questions completed!"),
        "msgSuccesses": _("Right! | Excellent! | Great! | Very good! | Perfect!"),
        "msgFailures": _("It was not that! | Incorrect! | Not correct! | Sorry! | Error!"),
        "msgTryAgain": _("You need at least %s&percnt; of correct answers to get the information. Please try again."),
        "msgEndGameScore": _("Please start the game before saving your score."),
        "msgScoreScorm": _("The score can't be saved because this page is not part of a SCORM package."),
        "msgAnswer": _("Answer"),
        "msgOnlySaveScore": _("You can only save the score once!"),
        "msgOnlySave": _("You can only save once"),
        "msgInformation": _("Information"),
        "msgYouScore": _("Your score"),
        "msgOnlySaveAuto": _("Your score will be saved after each question. You can only play once."),
        "msgSaveAuto": _("Your score will be automatically saved after each question."),
        "msgYouScore": _("Your score"),
        "msgSeveralScore": _("You can save the score as many times as you want"),
        "msgYouLastScore": _("The last score saved is"),
        "msgActityComply": _("You have already done this activity."),
        "msgPlaySeveralTimes": _("You can do this activity as many times as you want"),
        "msgPrevious": _("Previous"),
        "msgNext": _("Next"),
        "msgQuestion": _("Question"),
        "msgCorrect": _("Right!"),
        "msgClose": _("Close"),
        "msgNotCorrect": _("Sorry... The right answer is:"),
        "msgSolution": _("Solution"),
        "msgCheck": _("Check"),
        "msgEndGameM": _("You finished the game. Your score is %s."),
        "msgFeedBack": _("FeedBack"),
        "msgFeedBack": _("No image"),
    },
    version: 1,
    active: 0,
    questions: [],
    typeEdit: -1,
    init: function () {
        this.setMessagesInfo();
        this.createForm();
    },
    setMessagesInfo: function () {
        var msgs = this.msgs;
        msgs.msgESelectFile = _("The selected file does not contain a valid game");
        msgs.msgWriteText = _("You have to type a text in the editor");
        msgs.msgEOneQuestion = _("Please provide at least one question");
        msgs.msgNoSuportBrowser = _("Your browser is not compatible with this tool.");
        msgs.msgProvideFB = _('Message to display when passing the game');

    },
    createForm: function () {
        var html = '\
			<div id="gameQEIdeviceForm">\
                <div class="exe-idevice-info">' + _("Create random basic math problems.") + ' <a href="https://youtu.be/xCkJ6iv5NGw" hreflang="es" rel="lightbox">' + _("Use Instructions") + '</a></div>\
				<div class="exe-form-tab" title="' + _('General settings') + '">\
                ' + $exeAuthoring.iDevice.gamification.instructions.getFieldset(_("Solve the following math problems.")) + '\
                    <fieldset class="exe-fieldset exe-fieldset-closed">\
                        <legend><a href="#">' + _("Options") + '</a></legend>\
                        <div>\
                            <p>\
                                <label for="eCQShowMinimize"><input type="checkbox" id="eCQShowMinimize"> ' + _("Show minimized.") + ' </label>\
                            </p>\
                            <p>\
                                <label for="eCQOptionsRamdon"><input type="checkbox" id="eCQOptionsRamdon"> ' + _("Random questions") + ' </label>\
                            </p>\
                            <p>\
                                <label for="eCQShowSolution"><input type="checkbox" checked id="eCQShowSolution"> ' + _("Show solutions") + '. </label> \
                                <label for="eCQTimeShowSolution">' + _("Show solution time (seconds)") + ':\
                                <input type="number" name="eCQTimeShowSolution" id="eCQTimeShowSolution" value="3" min="1" max="9" /> </label>\
                            </p>\
                            <p>\
                                <label for="eCQHasFeedBack"><input type="checkbox"  id="eCQHasFeedBack"> ' + _("Feedback") + '. </label> \
                                <label for="eCQPercentajeFB"><input type="number" name="eCQPercentajeFB" id="eCQPercentajeFB" value="100" min="5" max="100" step="5" disabled /> ' + _("&percnt; right to see the feedback") + ' </label>\
                            </p>\
                            <p id="eCQFeedbackP" class="MTOE-EFeedbackP">\
                                <textarea id="eCQFeedBackEditor" class="exe-html-editor"\></textarea>\
                            </p>\
                            <p>\
                                <label for="eCQPercentajeQuestions">% ' + _("Questions") + ':  <input type="number" name="eCQPercentajeQuestions" id="eCQPercentajeQuestions" value="100" min="1" max="100" /> </label>\
                                <span id="eCQNumeroPercentaje">1/1</span>\
                            </p>\
                            <p style="display:none">\
                                <label for="eCQModeBoard"><input type="checkbox" id="eCQModeBoard"> ' + _("Modo pizarra digital") + ' </label>\
                            </p>\
                        </div>\
                    </fieldset>\
                    <fieldset class="exe-fieldset" style="position:relative">\
						<legend><a href="#">' + _("Problems") + '</a></legend>\
                        <div>\
                            <p><label for="eCQmin">' + _("Smallest number:") + '\
                                <input id="eCQmin" type="text" style="width:80px"  value="1" onkeyup="$exeDevice.onlyNumbers(this)" />\
                            </label>\
                            <label for="eCQmax">' + _("Highest number:") + '\
                                <input id="eCQmax" type="text" style="width:80px" value="10"  onkeyup="$exeDevice.onlyNumbers(this)"  />\
                            </label></p>\
                            <p><label for="eCQdecimals">' + _("Decimals:") + '\
                                <select id="eCQdecimals">\
                                    <option value="0">' + _('No decimals') + '</option>\
                                    <option value="1">1</option>\
                                    <option value="2">2</option>\
                                    <option value="3">3</option>\
                                </select>\
                            </label></p>\
                            <p>\
                                <label for="eCQTime">' + _("Time(minutes)") + ':\
                                <input type="number" name="eCQTime" id="eCQTime" value="3" min="1" max="59" /> </label>\
                                </p>\
                         </div>\
                         <p><label for="eCQformula">' + _("Formula") + ':\
                            <input id="eCQformula" type="text" style="width:200px" value="' + _("{b}*{h}/2") + '" />\
                         </label></p>\
                        <p>\
                            <label for="eCQwording">' + _("Question text:") + '</label>\
                            <textarea name="eCQwording" id="eCQwording" class="exe-html-editor" cols="90" rows="6">' + _("Calculate in square metres the surface of a triangle with a base of {b}m and a height of {h}m") + '</textarea>\
                        <p>\
                        <p>\
                            <a href="#" id="eCQfeedbackLink">' + _("Feedback (optional)") + '</a>\
                            <div  id="eCQfeedbackQuestionDiv" style="display:none">\
                                <label for="eCQfeedbackQuestion" class="sr-av">' + _("Feedback (optional)") + '</label>\
                                <textarea name="eCQfeedbackQuestion" id="eCQfeedbackQuestion" class="exe-html-editor" cols="90" rows="4"></textarea>\
                                <span class="info">' + _("Use the Feedback to add an explanation or the right formula&hellip;") + '</span>\
                            </div>\
                        <p>\
                          <div class="MTOE-ENavigationButtons">\
                                <a href="#" id="eCQAdd" class="MTOE-ENavigationButton" title="' + _("Add question") + '"><img src="' + $exeDevice.iDevicePath + 'quextIEAdd.png"  alt="' + _("Add question") + '" class="MTOE-EButtonImage b-add" /></a>\
                                <a href="#" id="eCQFirst" class="MTOE-ENavigationButton"  title="' + _("First question") + '"><img src="' + $exeDevice.iDevicePath + 'quextIEFirst.png"  alt="' + _("First question") + '" class="MTOE-EButtonImage b-first" /></a>\
                                <a href="#" id="eCQPrevious" class="MTOE-ENavigationButton" title="' + _("Previous question") + '"><img src="' + $exeDevice.iDevicePath + 'quextIEPrev.png" alt="' + _("Previous question") + '" class="MTOE-EButtonImage b-prev" /></a>\
                                <label class="sr-av" for="eCQNumberQuestion">' + _("Question number:") + ':</label><input type="text" class="MTOE-NumberQuestion"  id="eCQNumberQuestion" value="1"/>\
                                <a href="#" id="eCQNext" class="MTOE-ENavigationButton"  title="' + _("Next question") + '"><img src="' + $exeDevice.iDevicePath + 'quextIENext.png" alt="' + _("Next question") + '" class="MTOE-EButtonImage b-next" /></a>\
                                <a href="#" id="eCQLast" class="MTOE-ENavigationButton"  title="' + _("Last question") + '"><img src="' + $exeDevice.iDevicePath + 'quextIELast.png" alt="' + _("Last question") + '" class="MTOE-EButtonImage b-last" /></a>\
                                <a href="#" id="eCQDelete" class="MTOE-ENavigationButton" title="' + _("Delete question") + '"><img src="' + $exeDevice.iDevicePath + 'quextIEDelete.png" alt="' + _("Delete question") + '" class="MTOE-EButtonImage b-delete" /></a>\
                                <a href="#" id="eCQCopy" class="MTOE-ENavigationButton" title="' + _("Copy question") + '"><img src="' + $exeDevice.iDevicePath + 'quextIECopy.png" + alt="' + _("Copy question") + '" class="MTOE-EButtonImage b-copy" /></a>\
                                <a href="#" id="eCQCut" class="MTOE-ENavigationButton" title="' + _("Cut question") + '"><img src="' + $exeDevice.iDevicePath + 'quextIECut.png" + alt="' + _("Cut question") + '"  class="MTOE-EButtonImage b-cut" /></a>\
                                <a href="#" id="eCQPaste" class="MTOE-ENavigationButton"  title="' + _("Paste question") + '"><img src="' + $exeDevice.iDevicePath + 'quextIEPaste.png" alt="' + _("Paste question") + '" class="MTOE-EButtonImage b-paste" /></a>\
                        </div>\
                        <div class="MTOE-ENumQuestionDiv" id="eCQENumQuestionDiv">\
                        <div class="MTOE-ENumQ"><span class="sr-av">' + _("Number of questions:") + '</span></div>\ <span class="MTOE-ENumQuestions" id="eCQNumQuestions">1</span>\
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
        var field = $("textarea.jsContentEditor").eq(0)
        field.before(html);
        $exeAuthoring.iDevice.tabs.init("gameQEIdeviceForm");
        $exeAuthoring.iDevice.gamification.scorm.init();
        $exeDevice.enableForm(field);
    },
    getCuestionDefault: function () {
        var p = new Object();
        p.min = 1;
        p.max = 10;
        p.decimals = 0;
        p.wording = '';
        p.formula = '';
        p.textFeedBack = '';
        p.time = 3;

        return p;
    },
    showQuestion: function (i) {
        var num = i < 0 ? 0 : i;
        num = num >= $exeDevice.questions.length ? $exeDevice.questions.length - 1 : num;
        var p = $exeDevice.questions[num];
        $('#eCQmin').val(p.min);
        $("#eCQmax").val(p.max)
        $('#eCQTime').val(p.time);

        $('#eCQdecimals').val(p.decimals);
        $('#eCQformula').val(p.formula);
        if (tinyMCE.get('eCQwording')) {
            tinyMCE.get('eCQwording').setContent(p.wording);
        } else {
            $("#eCQwording").val(p.wording)
        }
        if (tinyMCE.get('eCQfeedbackQuestion')) {
            tinyMCE.get('eCQfeedbackQuestion').setContent(p.textFeedBack);
        } else {
            $("#eCQfeedbackQuestion").val(p.textFeedBack)
        }
        $('#eCQNumQuestions').text($exeDevice.questions.length);
        $('#eCQNumberQuestion').val($exeDevice.active + 1);
        $('#eCQfeedbackQuestionDiv').hide()
        if (p.textFeedBack.length > 0) {
            $('#eCQfeedbackQuestionDiv').show();
        }
    },
    clearTags(text) {
        var txt = text.replace(/\\"/g, '"');
        return txt;
    },

    addQuestion: function () {
        if ($exeDevice.validateQuestion() != false) {
            $exeDevice.clearQuestion();
            $exeDevice.questions.push($exeDevice.getCuestionDefault());
            $exeDevice.active = $exeDevice.questions.length - 1;
            $('#eCQNumberQuestion').val($exeDevice.questions.length);
            $exeDevice.typeEdit = -1;
            $('#eCQPaste').hide();
            $('#eCQNumQuestions').text($exeDevice.questions.length);
            $('#eCQNumberQuestion').val($exeDevice.active + 1);
            $exeDevice.updateQuestionsNumber();
        }
    },

    removeQuestion: function () {
        if ($exeDevice.questions.length < 2) {
            $exeDevice.showMessage($exeDevice.msgs.msgEOneQuestion);
        } else {
            $exeDevice.questions.splice($exeDevice.active, 1);
            if ($exeDevice.active >= $exeDevice.questions.length - 1) {
                $exeDevice.active = $exeDevice.questions.length - 1;
            }
            $exeDevice.showQuestion($exeDevice.active);
            $exeDevice.typeEdit = -1;
            $('#eCQPaste').hide();
            $('#eCQNumQuestions').text($exeDevice.questions.length);
            $('#eCQNumberQuestion').val($exeDevice.active + 1);
            $exeDevice.updateQuestionsNumber();
        }

    },

    copyQuestion: function () {
        if ($exeDevice.validateQuestion() != false) {
            $exeDevice.typeEdit = 0;
            $exeDevice.clipBoard = Object.assign({}, $exeDevice.questions[$exeDevice.active]);
            $('#eCQPaste').show();
        }

    },

    cutQuestion: function () {
        if ($exeDevice.validateQuestion() != false) {
            $exeDevice.numberCutCuestion = $exeDevice.active;
            $exeDevice.typeEdit = 1;
            $('#eCQPaste').show();

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
            $exeDevice.questions.splice($exeDevice.active, 0, $exeDevice.clipBoard);
            $exeDevice.showQuestion($exeDevice.active);
        } else if ($exeDevice.typeEdit == 1) {
            $('#eCQPaste').hide();
            $exeDevice.typeEdit = -1;
            $exeDevice.arrayMove($exeDevice.questions, $exeDevice.numberCutCuestion, $exeDevice.active);
            $exeDevice.showQuestion($exeDevice.active);
            $('#eCQNumQuestions').text($exeDevice.questions.length);
            $('#eCQNumberQuestion').val($exeDevice.active + 1);
            $exeDevice.updateQuestionsNumber();
        }
    },

    nextQuestion: function () {
        if ($exeDevice.validateQuestion() != false) {
            if ($exeDevice.active < $exeDevice.questions.length - 1) {
                $exeDevice.active++;
                $exeDevice.showQuestion($exeDevice.active);

            }
        }
    },

    lastQuestion: function () {
        if ($exeDevice.validateQuestion() != false) {
            if ($exeDevice.active < $exeDevice.questions.length - 1) {
                $exeDevice.active = $exeDevice.questions.length - 1;
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
    clearQuestion: function () {
        $('#eCQmin').val('1');
        $('#eCQmax').val('10');
        $('#eCQdecimals').val('0');
        $('#eCQTime').val('3');
        $("#eCQformula").val('')
        tinyMCE.get('eCQwording').setContent('');
        tinyMCE.get('eCQfeedbackQuestion').setContent('');
    },
    updateQuestionsNumber: function () {
        var percentaje = parseInt($exeDevice.removeTags($('#eCQPercentajeQuestions').val()));
        if (isNaN(percentaje)) {
            return;
        }
        percentaje = percentaje < 1 ? 1 : percentaje;
        percentaje = percentaje > 100 ? 100 : percentaje;
        var num = Math.round((percentaje * $exeDevice.questions.length) / 100);
        num = num == 0 ? 1 : num;
        $('#eCQNumeroPercentaje').text(num + "/" + $exeDevice.questions.length)
    },
    removeTags: function (str) {
        var wrapper = $("<div></div>");
        wrapper.html(str);
        return wrapper.text();
    },

    validateQuestion: function () {
        var message = '',
            msgs = $exeDevice.msgs,
            p = new Object();
        p.min = parseInt($("#eCQmin").val());
        p.max = parseInt($("#eCQmax").val());
        p.decimals = parseInt($("#eCQdecimals").val());
        p.time = parseInt($("#eCQTime").val());
        if(tinyMCE.get('eCQwording')){
            p.wording = tinyMCE.get('eCQwording').getContent();
        }else{
            p.wording=$('#eCQwording').val()
        }
        if(tinyMCE.get('eCQfeedbackQuestion')){
            p.textFeedBack = tinyMCE.get('eCQfeedbackQuestion').getContent();
        }else{
            p.textFeedBack=$('#eCQfeedbackQuestion').val()
        }
   
        
        p.formula = $("#eCQformula").val();
        if (p.min.length == 0 || p.max.length == 0) {
            message = _("Only the Feedback is optional");
        } else if (p.formula.trim().length == 0) {
            message = _("Only the Feedback is optional");
        } else if (p.wording.trim().length == 0) {
            message = _("Please write the question text");
        } else {
            var expresion = /\{[a-zA-z]\}/g,
                vf = p.formula.match(expresion),
                vw = p.wording.match(expresion);
            if (vf && vw) {
                if (vf.length > 0) {
                    vf = vf.filter($exeDevice.onlyUnique);
                } else {
                    message = _("Only the Feedback is optional");
                }
                if (vw.length > 0) {
                    vw = vw.filter($exeDevice.onlyUnique);
                }
                if (vf.length != vw.length) {
                    message = _("The question text and the formula should have the same variables");
                }
            }else{
                message = _("The question text and the formula should have the same variables");
            }



        }
        if (message.length == 0) {
            $exeDevice.questions[$exeDevice.active] =  Object.assign({}, p);;
            message = true;
        } else {
            $exeDevice.showMessage(message);
            message = false;
        }

        return message;
    },
    onlyUnique: function (value, index, self) {
        return self.indexOf(value) === index;
    },



    validateData: function () {
        var clear = $exeDevice.removeTags,
            instructions = '',
            textAfter = '',
            showMinimize = $('#eCQShowMinimize').is(':checked'),
            optionsRamdon = $('#eCQOptionsRamdon').is(':checked'),
            showSolution = $('#eCQShowSolution').is(':checked'),
            modeBoard = $('#eCQModeBoard').is(':checked'),
            timeShowSolution = parseInt(clear($('#eCQTimeShowSolution').val())),
            itinerary = $exeAuthoring.iDevice.gamification.itinerary.getValues(),
            feedBack = $('#eCQHasFeedBack').is(':checked'),
            percentajeFB = parseInt(clear($('#eCQPercentajeFB').val())),
            percentajeQuestions = parseInt(clear($('#eCQPercentajeQuestions').val())),
            textFeedBack='';
            if(tinyMCE.get('eCQFeedBackEditor')){
                textFeedBack = tinyMCE.get('eCQFeedBackEditor').getContent();
            }else{
                textFeedBack = S('#eCQFeedBackEditor').val();
            } 
            
            if(tinyMCE.get('eXeIdeviceTextAfter')){
                textAfter = tinyMCE.get('eXeIdeviceTextAfter').getContent();
            }else{
                textAfter = S('#eXeIdeviceTextAfter').val();
            } 

            if(tinyMCE.get('eXeGameInstructions')){
                instructions = tinyMCE.get('eXeGameInstructions').getContent();
            }else{
                instructions = S('#eXeGameInstructions').val();
            } 
            feedBack = $('#eCQHasFeedBack').is(':checked')

        if (showSolution && timeShowSolution.length == 0) {
            eXe.app.alert($exeDevice.msgs.msgEProvideTimeSolution);
            return false;
        }
        if ((feedBack) && textFeedBack.trim().length == 0) {
            eXe.app.alert($exeDevice.msgs.msgProvideFB);
            return false;
        }
        var questions = $exeDevice.questions;
        if (questions.length == 0) {
            eXe.app.alert($exeDevice.msgs.msgEOneQuestion);
            return false;
        }
        var scorm = $exeAuthoring.iDevice.gamification.scorm.getValues();
        var data = {
            'typeGame': 'MathProblems',
            'instruccions': instructions,
            'showMinimize': showMinimize,
            'optionsRamdon': optionsRamdon,
            'showSolution': showSolution,
            'timeShowSolution': timeShowSolution,
            'itinerary': itinerary,
            'percentajeQuestions': percentajeQuestions,
            'modeBoard': modeBoard,
            'questions': questions,
            'feedBack': feedBack,
            'textFeedBack':  textFeedBack,
            'percentajeFB': percentajeFB,
            'scorm': scorm,
            'textAfter': textAfter,
            'version': $exeDevice.version,
        }
        return data;
    },
    onlyNumbers: function (e) {
        var str = e.value;
        var lastCharacter = str.slice(-1);
        if (isNaN(parseFloat(lastCharacter))) {
            e.value = str.substring(0, str.length - 1);
        }
    },
    setDecimalsInResults: function (v) {
        if (v == 0) $("#eCQdecimalsInResults").prop("disabled", false);
        else $("#eCQdecimalsInResults").prop("checked", true).attr("disabled", "disabled");
    },
    enableForm: function (field) {
        $exeDevice.loadPreviousValues(field);
        $exeDevice.addEvents();
    },

    loadPreviousValues: function (field) {
        var originalHTML = field.val();
        if (originalHTML != '') {
            var wrapper = $("<div></div>");
            wrapper.html(originalHTML);
            var json = $('.mathproblems-DataGame', wrapper).text(),
                $wordings = $('.mathproblems-LinkWordings', wrapper),
                $feeebacks = $('.mapa-LinkFeedBacks', wrapper),
                djson= $exeDevice.Decrypt(json);
                dataGame = $exeDevice.isJsonString(djson);
            $exeDevice.questions = dataGame.questions;
            $exeDevice.active = 0;
            $exeDevice.setTexts(dataGame.questions, $wordings, $feeebacks)
            $exeDevice.updateFieldGame(dataGame);
            var instructions = $(".mathproblems-instructions", wrapper);
            if (instructions.length == 1) {
                instructions = instructions.html() || ''
                if (tinyMCE.get('eXeGameInstructions')) {
                    tinyMCE.get('eXeGameInstructions').setContent(instructions);
                } else {
                    $("#eXeGameInstructions").val(instructions)
                }
            }

            var textFeedBack = $(".mathproblems-feedback-game", wrapper);
            if (textFeedBack.length == 1) {
                textFeedBack = textFeedBack.html() || ''
                if (tinyMCE.get('eCQFeedBackEditor')) {
                    tinyMCE.get('eCQFeedBackEditor').setContent(textFeedBack);
                } else {
                    $("#eCQFeedBackEditor").val(textFeedBack)
                }
            }

            var textAfter = $(".mathproblems-extra-content", wrapper);
            if (textAfter.length == 1) {
                textAfter = textAfter.html() || ''
                if (tinyMCE.get('eXeIdeviceTextAfter')) {
                    tinyMCE.get('eXeIdeviceTextAfter').setContent(textAfter);
                } else {
                    $("#eXeIdeviceTextAfter").val(textAfter)
                }
            }
            $exeDevice.showQuestion(0);
        }

    },

    saveTexts: function (pts) {
        var medias = {
            'wordings': '',
            'feedbacks': '',
        }
        for (var i = 0; i < pts.length; i++) {
            var p = pts[i];
            if (typeof p.wording != "undefined") {
                var w=$exeDevice.clearTags(p.wording)
                medias.wordings += '<div class="js-hidden mathproblems-LinkWordings" data-id="' + i + '">' + w + '</div>';
                //p.wording = '';
            }
            if (typeof p.textFeedBack != "undefined" && p.textFeedBack.length > 0) {
                medias.feedbacks += '<div class="js-hidden mathproblems-LinkFeedBacks" data-id="' + i + '">' + $exeDevice.clearTags(p.textFeedBack) + '</div>';
                //p.textFeedBack = '';
            }
        }
       
        return medias
    },
    setTexts: function (questions, $wordings, $feedbacks) {
        
        for (var i = 0; i < questions.length; i++) {
            var p = questions[i];
            if (p.wording != "undefined" && p.wording.length > 0) {
                $exeDevice.setWording(p, $wordings, i);
            }
            if (p.textFeedBack != "undefined" && p.textFeedBack.length > 0) {
                $exeDevice.setFeedBack(p, $feedbacks, i);
            }
        }
    },

    setWording: function (p, $wordings, number) {
        $wordings.each(function () {
            var id = parseInt($(this).data('id'));
            if (id == number) {
                p.wording = $exeDevice.clearTags($(this).html());
                return;
            }
        });
    },

    setFeedBack: function (p, $feedbacks, number) {
        $feedbacks.each(function () {
            var id = parseInt($(this).data('id'));
            if (id == number) {
                p.textFeedBack = $exeDevice.clearTags($(this).html());
                return;
            }
        });
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
        var medias = $exeDevice.saveTexts(dataGame.questions);
        medias = medias.wordings + medias.feedbacks;
        var json = JSON.stringify(dataGame),
            divContent = "",
            textFeedBack = tinyMCE.get('eCQFeedBackEditor').getContent(),
            instructions = tinyMCE.get('eXeGameInstructions').getContent(),
            textAfter = tinyMCE.get('eXeIdeviceTextAfter').getContent();
            json = $exeDevice.Encrypt(json);
        if (instructions != "") divContent = '<div class="mathproblems-instructions mathproblems-instructions">' + instructions + '</div>';
        var html = '<div class="mathproblems-IDevice">';
        html += '<div class="mathproblems-feedback-game js-hidden">' + textFeedBack + '</div>';
        html += divContent;
        html += '<div class="mathproblems-DataGame js-hidden">' + json + '</div>';
        html += medias;
        if (textAfter != "") {
            html += '<div class="mathproblems-extra-content">' + textAfter + '</div>';
        }
        html += '<div class="mathproblems-bns js-hidden">' + $exeDevice.msgs.msgNoSuportBrowser + '</div>';
        html += '</div>';
        return html;
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
    
    showMessage: function (msg) {
        eXe.app.alert(msg);
    },


    addEvents: function () {
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

        $('#eCQTime').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 1);
            this.value = v;
        });
        $('#eCQTime').on('focusout', function () {
            this.value = this.value.trim() == '' ? 1 : this.value;
            this.value = this.value > 59 ? 59 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
        });

        $('#eCQPaste').hide();
        $('#eCQAdd').on('click', function (e) {
            e.preventDefault();
            $exeDevice.addQuestion()
        });
        $('#eCQFirst').on('click', function (e) {
            e.preventDefault();
            $exeDevice.firstQuestion()
        });

        $('#eCQPrevious').on('click', function (e) {
            e.preventDefault();
            $exeDevice.previousQuestion()
        });
        $('#eCQNext').on('click', function (e) {
            e.preventDefault();
            $exeDevice.nextQuestion()
        });
        $('#eCQLast').on('click', function (e) {
            e.preventDefault();
            $exeDevice.lastQuestion()
        });
        $('#eCQDelete').on('click', function (e) {
            e.preventDefault();
            $exeDevice.removeQuestion()
        });
        $('#eCQCopy').on('click', function (e) {
            e.preventDefault();
            $exeDevice.copyQuestion()
        });
        $('#eCQCut').on('click', function (e) {
            e.preventDefault();
            $exeDevice.cutQuestion()
        });
        $('#eCQPaste').on('click', function (e) {
            e.preventDefault();
            $exeDevice.pasteQuestion()
        });
        $('#eCQPercentajeQuestions').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 3);
            this.value = v;
            if (this.value > 0 && this.value < 101) {
                $exeDevice.updateQuestionsNumber();
            }
        });
        $('#eCQPercentajeQuestions').on('click', function () {
            $exeDevice.updateQuestionsNumber();
        });
        $('#eCQPercentajeQuestions').on('focusout', function () {
            this.value = this.value.trim() == '' ? 100 : this.value;
            this.value = this.value > 100 ? 100 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
            $exeDevice.updateQuestionsNumber();
        });


        $('#eCQfeedbackLink').on('click', function (e) {
            e.preventDefault();
            $('#eCQfeedbackQuestionDiv').fadeToggle()
        })
        $('#eCQHasFeedBack').on('change', function () {
            var marcado = $(this).is(':checked');
            if (marcado) {
                $('#eCQFeedbackP').slideDown();
            } else {
                $('#eCQFeedbackP').slideUp();
            }
            $('#eCQPercentajeFB').prop('disabled', !marcado);
        });
        $exeAuthoring.iDevice.gamification.itinerary.addEvents();
    },


    updateFieldGame: function (game) {
        $exeDevice.active = 0;
        $('#eCQShowMinimize').prop('checked', game.showMinimize);
        $('#eCQOptionsRamdon').prop('checked', game.optionsRamdon);
        $('#eCQShowSolution').prop('checked', game.showSolution);
        $('#eCQTimeShowSolution').val(game.timeShowSolution)
        $('#eCQTimeShowSolution').prop('disabled', !game.showSolution);
        $("#eCQHasFeedBack").prop('checked', game.feedBack);
        $("#eCQPercentajeFB").val(game.percentajeFB);
        $('#eCQPercentajeQuestions').val(game.percentajeQuestions);
        $('#eCQModeBoard').prop("checked", game.modeBoard);
        $('#eCQPercentajeFB').prop('disabled', !game.feedBack);
        $('#eCQHasFeedBack').prop('checked', game.feedBack);
        if ( game.feedBack) {
            $('#eCQFeedbackP').slideDown();
        }else {
            $('#eCQFeedbackP').slideUp();
        }
        $exeDevice.questions = game.questions;
        $exeAuthoring.iDevice.gamification.itinerary.setValues(game.itinerary);
        $exeDevice.updateQuestionsNumber();
        $exeAuthoring.iDevice.gamification.scorm.setValues(game.scorm.isScorm, game.scorm.textButtonScorm, game.scorm.repeatActivity);
    
    },
    exportGame: function () {
        if (!$exeDevice.validateQuestion()) {
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
        link.download = _("Game") + "MathProblems.json";
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
            $exeDevice.showMessage($exeDevice.msgs.msgESelectFile);
            return;
        } else if (game.typeGame !== 'MathProblems') {
            $exeDevice.showMessage($exeDevice.msgs.msgESelectFile);
            return;
        }
        $exeDevice.updateFieldGame(game);
        
        var instructions = game.instructionsExe || game.instructions || "",
            tAfter = game.textAfter || "",
            textFeedBack = game.textFeedBack || "";

            if (tinyMCE.get('eXeGameInstructions')) {
                tinyMCE.get('eXeGameInstructions').setContent(instructions);
            } else {
                $("#eXeGameInstructions").val(instructions)
            }
            if (tinyMCE.get('eCQFeedBackEditor')) {
                tinyMCE.get('eCQFeedBackEditor').setContent(textFeedBack);
            } else {
                $("#eCQFeedBackEditor").val(textFeedBack)
            }

            if (tinyMCE.get('eXeIdeviceTextAfter')) {
                tinyMCE.get('eXeIdeviceTextAfter').setContent(tAfter);
            } else {
                $("#eXeIdeviceTextAfter").val(tAfter)
            }

        $('.exe-form-tabs li:first-child a').click();
        $exeDevice.showQuestion(0)
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


}