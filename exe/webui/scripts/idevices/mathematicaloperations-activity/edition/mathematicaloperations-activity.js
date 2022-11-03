/**
/**
 * Mathematical Operations Activity iDevice (edition code)
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
        name: _('Math Operations')
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
    iDevicePath: "/scripts/idevices/mathematicaloperations-activity/edition/",
    ci18n: {
        "msgHappen": _("Move on"),
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
        "msgLive": _("Life"),
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
        "msgCorrect": _("Correct"),
        "msgClose": _("Close"),
        "msgSolution": _("Solution"),
        "msgCheck": _("Check"),
        "msgWithoutAnswer": _("Not answered"),
        "msgReplied": _("Answered"),
        "msgCorrects": _("Right"),
        "msgIncorrects": _("Wrong"),
        "msgIncomplete": _("Not completed"),
        "msgEndTime": _("Time over."),
        "msgAllOperations": _("Your finished all the operations."),
        
    },
    init: function () {
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
        msgs.msgEUnavailableVideo = _("This video is not currently available")
        msgs.msgECompleteQuestion = _("You have to complete the question");
        msgs.msgECompleteAllOptions = _("You have to complete all the selected options");
        msgs.msgESelectSolution = _("Choose the right answer");
        msgs.msgECompleteURLYoutube = _("Type the right URL of a Youtube video");
        msgs.msgEStartEndVideo = _("You have to indicate the start and the end of the video that you want to show");
        msgs.msgEStartEndIncorrect = _("The video end value must be higher than the start one");
        msgs.msgWriteText = _("You have to type a text in the editor");
        msgs.msgSilentPoint = _("The silence time is wrong. Check the video duration.");
        msgs.msgTypeChoose = _("Please check all the answers in the right order");
        msgs.msgTimeFormat = _("Please check the time format: hh:mm:ss");
        msgs.msgProvideFB = _('Message to display when passing the game');
        msgs.msgNoSuportBrowser = _("Your browser is not compatible with this tool.");
    },
    createForm: function () {
        var html = '\
			<div id="gameQEIdeviceForm">\
                <div class="exe-idevice-info">'+_("Create basic math operation games (addition, subtraction, multiplication, division). The student will have to guess the result, operator or an operand.")+' <a href="https://youtu.be/xCkJ6iv5NGw" hreflang="es" rel="lightbox">'+_("Use Instructions")+'</a></div>\
				<div class="exe-form-tab" title="' + _('General settings') + '">\
                ' + $exeAuthoring.iDevice.gamification.instructions.getFieldset(_("Solve the following operations.")) + '\
					<fieldset class="exe-fieldset">\
						<legend><a href="#">' + _("Options") + '</a></legend>\
                        <div>\
                            <p><label for="eRMQtype">' + _("Choose what to guess:") + '\
                            <select id="eRMQtype">\
                                <option value="result">' + _("Result") + '</option>\
                                <option value="operator">' + _("Operator") + '</option>\
                                <option value="operandA">' + _("First operand") + '</option>\
                                <option value="operandB">' + _("Second operand") + '</option>\
                                <option value="random">' + _("Random") + '</option>\
                            </select>\
                            </label></p>\
                            <p><label for="eRMQnum">' + _("Number of operations:") + '\
                                <input id="eRMQnum" type="text" style="width:80px" value="10" onkeyup="$exeDevice.onlyNumbers(this)" />\
                            </label>\
                            <label for="eRMQmin">' + _("Smallest number:") + '\
                                <input id="eRMQmin" type="text" style="width:80px"  value="1" onkeyup="$exeDevice.onlyNumbers(this)" />\
                            </label>\
                            <label for="eRMQmax">' + _("Biggest number:") + '\
                                <input id="eRMQmax" type="text" style="width:80px"  value="9" onkeyup="$exeDevice.onlyNumbers(this)" />\
                            </label></p>\
                            <p><label for="eRMQdecimals">' + _("Number of decimals (operands):") + '\
                                <select id="eRMQdecimals" onchange="$exeDevice.setDecimalsInResults(this.value)">\
                                    <option value="0">0</option>\
                                    <option value="1">1</option>\
                                    <option value="2">2</option>\
                                </select>\
                            </label></p>\
                            <p><strong>' + _("Operaciones:") + '</strong>\
                                <label for="eRMQadd"><input id="eRMQadd" type="checkbox" /> ' + _("Addition") + '</label>\
                                <label for="eRMQsubs"><input id="eRMQsubs" type="checkbox" /> ' + _("Subtraction") + '</label>\
                                <label for="eRMQmult"><input id="eRMQmult" type="checkbox" checked /> ' + _("Multiplication") + '</label>\
                            </p>\
                                <label for="eRMQdiv"><input id="eRMQdiv" type="checkbox" /> ' + _("Division") + '</label>\
                            <p>\
                                <label for="eRMQdecimalsInResults"><input id="eRMQdecimalsInResults" type="checkbox" /> ' + _("Allow decimals in the results") + '</label>\
                            </p>\
                            <p>\
                                <label for="eRMQnegative"><input id="eRMQnegative" type="checkbox" /> ' + _("Allow negative results") + '</label>\
                            </p>\
                            <p>\
                                <label for="eRMQzero"><input id="eRMQzero" type="checkbox" /> ' + _("Allow zero as result") + '</label>\
                            </p>\
                            <p>\
                                <label for="eRMQShowMinimize"><input type="checkbox" id="eRMQShowMinimize"> ' + _("Show minimized.") + ' </label>\
                            </p>\
                            <p>\
                                <label for="eRMQTime">' + _("Time (minutes)") + ':\
                                <input type="number" name="eRMQTime" id="eRMQTime" value="0" min="0" max="59" /> </label>\
                                </p>\
                            <p>\
                                <label for="eRMQHasFeedBack"><input type="checkbox"  id="eRMQHasFeedBack"> ' + _("Feedback") + '. </label> \
                                <label for="eRMQPercentajeFB"><input type="number" name="eRMQPercentajeFB" id="eRMQPercentajeFB" value="100" min="5" max="100" step="5" disabled /> ' + _("&percnt; right to see the feedback") + ' </label>\
                            </p>\
                            <p id="eRMQFeedbackP" class="MTOE-EFeedbackP">\
                                <textarea id="eRMQFeedBackEditor" class="exe-html-editor"></textarea>\
                            </p>\
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

    validateData: function () {
        var instructions = tinyMCE.get('eXeGameInstructions').getContent(),
            textFeedBack = tinyMCE.get('eRMQFeedBackEditor').getContent(),
            textAfter = tinyMCE.get('eXeIdeviceTextAfter').getContent(),
            showMinimize = $('#eRMQShowMinimize').is(':checked'),
            type = $('#eRMQtype').val(),
            itinerary = $exeAuthoring.iDevice.gamification.itinerary.getValues(),
            feedBack = $('#eRMQHasFeedBack').is(':checked'),
            percentajeFB = parseInt($('#eRMQPercentajeFB').val()),
            decimalsInOperands = $("#eRMQdecimals").val(),
            decimalsInResults = $("#eRMQdecimalsInResults").is(":checked"),
            negative = $("#eRMQnegative").is(":checked"),
            zero = $("#eRMQzero").is(":checked"),
            time = parseInt($('#eRMQTime').val());
        var num = $("#eRMQnum");
        if (num.val() == "") {
            $exeDevice.showMessage(_("Please specify the number of operations"));
            num.focus();
            return false;
        }
        num = num.val();

        var min = $("#eRMQmin");
        if (min.val() == "") {
            $exeDevice.showMessage(_("Please define the minimal value of the operand"));
            min.focus();
            return false;
        }
        min = min.val();

        // max
        var max = $("#eRMQmax");
        if (max.val() == "") {
            $exeDevice.showMessage(_("Please define the highest value of the operand"));
            max.focus();
            return false;
        }
        max = max.val();


        var operations = "";
        // Add
        if ($("#eRMQadd").is(":checked")) operations += "1";
        else operations += "0";
        // Subtract
        if ($("#eRMQsubs").is(":checked")) operations += "1";
        else operations += "0";
        // Multiply
        if ($("#eRMQmult").is(":checked")) operations += "1";
        else operations += "0";
        // Divide
        if ($("#eRMQdiv").is(":checked")) operations += "1";
        else operations += "0";
        if (operations == "0000") {
            $exeDevice.showMessage(_("No operations selected"));
            return false;
        }

        var scorm = $exeAuthoring.iDevice.gamification.scorm.getValues();
        var data = {
            'typeGame': 'MathOperations',
            'instructions': instructions,
            'showMinimize': showMinimize,
            'type': type,
            'number': num,
            'operations': operations,
            'min': min,
            'max': max,
            'decimalsInOperands': decimalsInOperands,
            'decimalsInResults': decimalsInResults,
            'negative': negative,
            'zero': zero,
            'itinerary': itinerary,
            'isScorm': scorm.isScorm,
            'textButtonScorm': scorm.textButtonScorm,
            'repeatActivity': scorm.repeatActivity,
            'textFeedBack': escape(textFeedBack),
            'textAfter': escape(textAfter),
            'feedBack': feedBack,
            'percentajeFB': percentajeFB,
            'version': $exeDevice.version,
            'time':time
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
        if (v == 0) $("#eRMQdecimalsInResults").prop("disabled", false);
        else $("#eRMQdecimalsInResults").prop("checked", true).attr("disabled", "disabled");
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
            var json = $('.mathoperations-DataGame', wrapper).text();
            var dataGame = $exeDevice.isJsonString(json);
            $exeDevice.updateFieldGame(dataGame);
            var instructions = $(".mathoperations-instructions", wrapper);
            if (instructions.length == 1) {
                instructions = instructions.html() || ''
                if (tinyMCE.get('eXeGameInstructions')) {
                    tinyMCE.get('eXeGameInstructions').setContent(instructions);
                } else {
                    $("#eXeGameInstructions").val(instructions)
                }
            }

            var textFeedBack = $(".mathoperations-feedback-game", wrapper);
            if (textFeedBack.length == 1) {
                textFeedBack = textFeedBack.html() || ''
                if (tinyMCE.get('eRMQFeedBackEditor')) {
                    tinyMCE.get('eRMQFeedBackEditor').setContent(textFeedBack);
                } else {
                    $("#eRMQFeedBackEditor").val(textFeedBack)
                }
            }

            var textAfter = $(".mathoperations-extra-content", wrapper);
            if (textAfter.length == 1) {
                textAfter = textAfter.html() || ''
                if (tinyMCE.get('eXeIdeviceTextAfter')) {
                    tinyMCE.get('eXeIdeviceTextAfter').setContent(textAfter);
                } else {
                    $("#eXeIdeviceTextAfter").val(textAfter)
                }
            }
        }
    },


    save: function () {
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
        var textFeedBack = tinyMCE.get('eRMQFeedBackEditor').getContent();
        if (dataGame.instructions != "") divContent = '<div class="mathoperations-instructions gameQP-instructions">' + dataGame.instructions + '</div>';
        var html = '<div class="mathoperations-IDevice">';
        html += '<div class="mathoperations-version js-hidden">' + $exeDevice.version + '</div>';
        html += '<div class="mathoperations-feedback-game">' + textFeedBack + '</div>';
        html += divContent;
        html += '<div class="mathoperations-DataGame js-hidden">' + json + '</div>';
        var textAfter = tinyMCE.get('eXeIdeviceTextAfter').getContent();
        if (textAfter != "") {
            html += '<div class="mathoperations-extra-content">' + textAfter + '</div>';
        }
        html += '<div class="mathoperations-bns js-hidden">' + $exeDevice.msgs.msgNoSuportBrowser + '</div>';
        html += '</div>';
        return html;
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
        $('#eRMQHasFeedBack').on('change', function () {
            var marcado = $(this).is(':checked');
            if (marcado) {
                $('#eRMQFeedbackP').show();
            } else {
                $('#eRMQFeedbackP').hide();
            }
            $('#eRMQPercentajeFB').prop('disabled', !marcado);
        });
        $('#eRMQTime').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 1);
            this.value = v;
        });
        $('#eRMQTime').on('focusout', function () {
            this.value = this.value.trim() == '' ? 0 : this.value;
            this.value = this.value > 59 ? 59 : this.value;
            this.value = this.value < 0 ? 0: this.value;
        });
        $exeAuthoring.iDevice.gamification.itinerary.addEvents();
    },


    updateFieldGame: function (game) {
        $exeDevice.active = 0;
        $exeAuthoring.iDevice.gamification.itinerary.setValues(game.itinerary);
        $('#eRMQShowMinimize').prop('checked', game.showMinimize);
        $("#eRMQHasFeedBack").prop('checked', game.feedBack);
        $("#eRMQPercentajeFB").val(game.percentajeFB);
        $("#eRMQdecimals").val(game.decimalsInOperands);
        $('#eRMQtype').val(game.type);
        $("#eRMQdecimalsInResults").prop('checked', game.decimalsInResults);
        $("#eRMQnegative").prop('checked', game.negative);
        $("#eRMQzero").prop('checked', game.zero);
        $("#eRMQnum").val(game.number);
        $("#eRMQmax").val(game.max);
        $("#eRMQmin").val(game.min);
        $("#eRMQadd").prop('checked', game.operations.charAt(0) == "1");
        $("#eRMQsubs").prop('checked', game.operations.charAt(1) == "1");
        $("#eRMQmult").prop('checked', game.operations.charAt(2) == "1");
        $("#eRMQdiv").prop('checked', game.operations.charAt(3) == "1");
        $('#eRMQTime').val(game.time);
        $exeAuthoring.iDevice.gamification.scorm.setValues(game.isScorm, game.textButtonScorm, game.repeatActivity);
        if (game.textFeedBack) {
            $('#eRMQFeedbackP').show();
        } else {
            $('#eRMQFeedbackP').hide();
        }
        $('#eRMQPercentajeFB').prop('disabled', !game.feedBack);
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
        link.download = _("Game") + "MathOperations.json";
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
        } else if (game.typeGame !== 'MathOperations') {
            $exeDevice.showMessage($exeDevice.msgs.msgESelectFile);
            return;
        }
        $exeDevice.updateFieldGame(game);
        var instructions = game.instructionsExe || game.instructions,
            tAfter = game.textAfter || "",
            textFeedBack = game.textFeedBack || "";
        tinyMCE.get('eXeGameInstructions').setContent(unescape(instructions));
        tinyMCE.get('eXeIdeviceTextAfter').setContent(unescape(tAfter));
        tinyMCE.get('eRMQFeedBackEditor').setContent(unescape(textFeedBack));
        $('.exe-form-tabs li:first-child a').click();
        $exeDevice.active = 0;
        $exeDevice.showQuestion($exeDevice.active);
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