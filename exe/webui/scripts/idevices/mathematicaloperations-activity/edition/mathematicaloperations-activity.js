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
        modo: 0,
        type: "result", // result, operator, operandA, operandB, random (to guess)
        number: 10, // Number or operations
        operations: '1111', // Add, subtract, multiply, divide,
        min: -1000, // Smallest number included
        max: 1000, // Highest number included
        decimalsInOperands: 0, // Allow decimals
        decimalsInResults: 1, // Allow decimals in results
        negative: 1, // Allow negative results
        zero: 1 // Allow zero in results
    },
    iDevicePath: "/scripts/idevices/mathematicaloperations-activity/edition/",
    id: false,
    domains:[],
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
        "msgAllOperations": _("You finished all the operations."),
        "msgFracctionNoValid": _("Escribe una fracción valida."),
        "msgOperatNotValid": _("Escribe un operador válido:+-x*/:"),
        "msgNewGame": _("Pulsa aquí para volver jugar"),
        "msgUncompletedActivity": _("Actividad no realizada"),
        "msgSuccessfulActivity": _("Actividad superada. Puntuación: %s"),
        "msgUnsuccessfulActivity": _("Actividad no superada. Puntuación: %s"),
        "msgTypeGame": _('Math Operations')
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
        msgs.msgIDLenght = _('El identificador del informe debe tener al menos 5 caracteres');

    },
    createForm: function () {
        var html = '\
			<div id="gameQEIdeviceForm">\
                <div class="exe-idevice-info">' + _("Create basic math operation games (addition, subtraction, multiplication, division). The student will have to guess the result, operator or an operand.") + ' <a href="https://youtu.be/BMWJ5E2QVTc" hreflang="es" rel="lightbox" target="_blank">' + _("Use Instructions") + '</a></div>\
				<div class="exe-form-tab" title="' + _('General settings') + '">\
                ' + $exeAuthoring.iDevice.gamification.instructions.getFieldset(_("Solve the following operations.")) + '\
					<fieldset class="exe-fieldset">\
						<legend><a href="#">' + _("Options") + '</a></legend>\
                        <div>\
                            <p id="eRMQFractionsDiv" style="diplay:none">\
                                <label for="eRMQFractions"><input id="eRMQFractions" type="checkbox" /> ' + _("Fracciones") + '.</label>\
                            </p>\
                            <p>\
                                <label for="eRMQtype">' + _("Choose what to guess:") + '\
                                    <select id="eRMQtype">\
                                        <option value="result">' + _("Result") + '</option>\
                                        <option value="operator">' + _("Operator") + '</option>\
                                        <option value="operandA">' + _("First operand") + '</option>\
                                        <option value="operandB">' + _("Second operand") + '</option>\
                                        <option value="random">' + _("Random") + '</option>\
                                    </select>\
                                </label>\
                            </p>\
                            <p>\
                                <label for="eRMQnum">' + _("Number of operations:") + '\
                                    <input id="eRMQnum" type="text" style="width:80px" value="10" onkeyup="$exeDevice.onlyNumbers(this)" />\
                                </label>\
                                <label for="eRMQmin">' + _("Smallest number:") + '\
                                    <input id="eRMQmin" type="text" style="width:80px"  value="1" onkeyup="$exeDevice.onlyNumbers(this)" />\
                                </label>\
                                <label for="eRMQmax">' + _("Biggest number:") + '\
                                    <input id="eRMQmax" type="text" style="width:80px"  value="9" onkeyup="$exeDevice.onlyNumbers(this)" />\
                                </label>\
                            </p>\
                            <p id="eRMQdecimalsDiv">\
                                <label for="eRMQdecimals">' + _("Number of decimals (operands):") + '\
                                    <select id="eRMQdecimals" onchange="$exeDevice.setDecimalsInResults(this.value)">\
                                        <option value="0">0</option>\
                                        <option value="1">1</option>\
                                        <option value="2">2</option>\
                                    </select>\
                                </label>\
                            </p>\
                            <p>\
                                <strong>' + _("Operations:") + '</strong>\
                                <label for="eRMQadd"><input id="eRMQadd" type="checkbox" /> ' + _("Addition") + '</label>\
                                <label for="eRMQsubs"><input id="eRMQsubs" type="checkbox" /> ' + _("Subtraction") + '</label>\
                                <label for="eRMQmult"><input id="eRMQmult" type="checkbox" checked /> ' + _("Multiplication") + '</label>\
                                <label for="eRMQdiv"><input id="eRMQdiv" type="checkbox" /> ' + _("Division") + '</label>\
                            </p>\
                            <p id="eRMQdecimalsResultDiv">\
                                <label for="eRMQdecimalsInResults"><input id="eRMQdecimalsInResults" type="checkbox" /> ' + _("Allow decimals in the results") + '</label>\
                            </p>\
                            <p id="eRMQSolutionDiv"  style="display:none">\
                                <label for="eRMQSolution"><input id="eRMQSolution" type="checkbox"  checked/> ' + _("Fracción irreducible.") + '</label>\
                            </p>\
                            <p id="eRMQnegativeDiv">\
                                <label for="eRMQnegative"><input id="eRMQnegative" type="checkbox" /> ' + _("Allow negative results") + '</label>\
                            </p>\
                            <p id="eRMQNegativesFracctionsDiv" style="display:none">\
                                <label for="eRMQNegativesFracctions"><input id="eRMQNegativesFracctions" type="checkbox" /> ' + _("Permitir negativos") + '.</label>\
                            </p>\
                            <p id="eRMQZeroDiv">\
                                <label for="eRMQzero"><input id="eRMQzero" type="checkbox" /> ' + _("Allow zero as result") + '</label>\
                            </p>\
                            <p id="eRMQErrorRelativeDiv">\
                                <input class="MTOE-ErrorType" id="eRMQRelative" type="checkbox" name="eRMQtype" value="0" />\
                                <label for="eRMQRelative">Error relativo</label>\
                                <label for="eRMQPercentajeRelative" class="sr-av">Error relativo</label><input type="number" name="eRMQPercentajeRelative" id="eRMQPercentajeRelative" value="0" min="0" max="1" step="0.01" style="display:none; width:70px"/>\
                            </p>\
                            <p id="eRMQErrorAsoluteDiv">\
                                <input class="MTOE-ErrorType" id="eRMQAbsolute" type="checkbox" name="eRMQtype" value="1" />\
                                <label for="eRMQAbsolute">Error Absoluto</label>\
                                <label for="eRMQPercentajeAbsolute" class="sr-av">Error Absoluto</label><input type="number" name="eRMQPercentajeAbsolute" id="eRMQPercentajeAbsolute" value="0" min="0" max="99.0" step="0.01" style="display:none; width:70px" />\
                            </p>\
                            <p>\
                                <label for="eRMQShowMinimize"><input type="checkbox" id="eRMQShowMinimize"> ' + _("Show minimized.") + '</label>\
                            </p>\
                            <p>\
                                <label for="eRMQTime">' + _("Time (minutes)") + ':\
                                <input type="number" name="eRMQTime" id="eRMQTime" value="0" min="0" max="59" /> </label>\
                                </p>\
                            <p>\
                                <label for="eRMQHasFeedBack"><input type="checkbox"  id="eRMQHasFeedBack"> ' + _("Feedback") + '. </label> \
                                <label for="eRMQPercentajeFB"><input type="number" name="eRMQPercentajeFB" id="eRMQPercentajeFB" value="100" min="5" max="100" step="5" disabled /> ' + _("&percnt; right to see the feedback") + '.</label>\
                            </p>\
                            <p id="eRMQFeedbackP" class="MTOE-EFeedbackP">\
                                <textarea id="eRMQFeedBackEditor" class="exe-html-editor"></textarea>\
                            </p>\
                            <p>\
                                <strong class="GameModeLabel"><a href="#eRMQEEvaluationHelp" id="eRMQEEvaluationHelpLnk" class="GameModeHelpLink" title="' + _("Help") + '"><img src="' + $exeDevice.iDevicePath + 'quextIEHelp.gif"  width="16" height="16" alt="' + _("Help") + '"/></a></strong>\
								<label for="eRMQEEvaluation"><input type="checkbox" id="eRMQEEvaluation"> ' + _("Informe de progreso") + '. </label> \
								<label for="eRMQEEvaluationID">' + _("Identificador") + ':\
								<input type="text" id="eRMQEEvaluationID" disabled/> </label>\
                            </p>\
                            <div id="eRMQEEvaluationHelp" class="MTOE-TypeGameHelp">\
                                <p>' +_("Debes indicar el identificador, puede ser una palabra, una frase o un número de más de cuatro caracteres, que utilizarás para marcar las actividades que serán tenidas en cuenta en este informe de progreso.</p><p> Debe ser <strong>el mismo </strong> en todos los iDevices de un informe y diferente en los de cada informe.</p>") + '</p>\
                            </div>\
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
            decimalsInOperands = parseInt($("#eRMQdecimals").val()),
            decimalsInResults = $("#eRMQdecimalsInResults").is(":checked"),
            negative = $("#eRMQnegative").is(":checked"),
            solution = $("#eRMQSolution").is(":checked"),
            negativeFractions = $("#eRMQNegativesFracctions").is(":checked"),
            zero = $("#eRMQzero").is(":checked"),
            time = parseInt($('#eRMQTime').val()),
            errorRelative = parseFloat($('#eRMQPercentajeRelative').val()),
            errorAbsolute = parseFloat($('#eRMQPercentajeAbsolute').val()),
            errorType = 0,
            mode = $("#eRMQFractions").is(":checked") ? 1 : 0,
            evaluation = $('#eRMQEEvaluation').is(':checked'),
            evaluationID = $('#eRMQEEvaluationID').val(),
            id = $exeDevice.id ? $exeDevice.id : $exeDevice.generarID();
        if ($('#eRMQRelative').is(':checked')) {
            errorType = 1;
        } else if ($('#eRMQAbsolute').is(':checked')) {
            errorType = 2;
        }
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

        if (parseInt(min) >= parseInt(max)) {
            $exeDevice.showMessage(_("El número más alto debe ser mayor que el número más pequeño"));
            return false;
        }
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
        if (evaluation && evaluationID.length < 5) {
            eXe.app.alert($exeDevice.msgs.msgIDLenght);
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
            'time': time,
            'errorAbsolute': errorAbsolute,
            'errorRelative': errorRelative,
            'errorType': errorType,
            'mode': mode,
            'negativeFractions': negativeFractions,
            'solution': solution,
            'evaluation':evaluation,
            'evaluationID':evaluationID,
            'id': id
        }
        return data;
    },
    onlyNumbers: function (e) {
        var valorActual = e.value;
        var valorSoloNumeros = valorActual.replace(/[^0-9]/g, '');
        e.value = valorSoloNumeros;

    },
    onlyNumbers1: function (e) {
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
            this.value = this.value < 0 ? 0 : this.value;
        });
        $('#eRMQRelative').on('change', function (e) {
            var type = $(this).is(':checked') ? 1 : 0;
            $exeDevice.setErrorType(type)
        });
        $('#eRMQAbsolute').on('change', function (e) {
            var type = $(this).is(':checked') ? 2 : 0;
            $exeDevice.setErrorType(type)
        });
        $('#eRMQPercentajeRelative').on('keypress', function (evt) {
            var ASCIICode = (evt.which) ? evt.which : evt.keyCode
            if (ASCIICode != 0o54 && ASCIICode != 0o56 && ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
                return false;
            return true;
        });
        $('#eRMQPercentajeRelative').on('focusout', function () {
            this.value = this.value.trim() == '' ? 0 : this.value;
            this.value = this.value > 1 ? 1 : this.value;
            this.value = this.value < 0 ? 0 : this.value;
        });
        $('#eRMQPercentajeAbsolute').on('keypress', function (evt) {
            var ASCIICode = (evt.which) ? evt.which : evt.keyCode
            if (ASCIICode != 0o54 && ASCIICode != 0o56 && ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
                return false;
            return true;
        });
        $('#eRMQPercentajeAbsolute').on('focusout', function () {
            this.value = this.value.trim() == '' ? 0 : this.value;
            this.value = this.value > 100 ? 100 : this.value;
            this.value = this.value < 0 ? 0 : this.value;
        });;
        $exeAuthoring.iDevice.gamification.itinerary.addEvents();
        $('#eRMQFractions').on('change', function (e) {
            var number = $(this).is(':checked') ? 1 : 0;
            $exeDevice.changeGameMode(number)
        });
        $('#eRMQEEvaluation').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#eRMQEEvaluationID').prop('disabled', !marcado);
        });
        $("#eRMQEEvaluationHelpLnk").click(function () {
            $("#eRMQEEvaluationHelp").toggle();
            return false;
        });
    },
    setErrorType: function (type) {
        $('#eRMQAbsolute').prop('checked', false)
        $('#eRMQRelative').prop('checked', false);
        $('#eRMQPercentajeAbsolute').hide();
        $('#eRMQPercentajeRelative').hide();
        if (type == 1) {
            $('#eRMQRelative').prop('checked', true);
            $('#eRMQPercentajeRelative').show();;
        } else if (type == 2) {
            $('#eRMQAbsolute').prop('checked', true);
            $('#eRMQPercentajeAbsolute').show();;
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
        $exeAuthoring.iDevice.gamification.itinerary.setValues(game.itinerary);
        game.mode = typeof game.mode == "undefined" ? 0 : game.mode;
        game.solution = typeof game.solution == "undefined" ? true : game.solution;
        game.errorType = typeof game.errorType == "undefined" ? 0 : game.errorType;
        game.errorRelative = typeof game.errorRelative == "undefined" ? 0.0 : game.errorRelative;
        game.errorAbsolute = typeof game.errorAbsolute == "undefined" ? 0.0 : game.errorAbsolute;
        game.negativeFractions = typeof game.negativeFractions == "undefined" ? false : game.negativeFractions;
        game.evaluation = typeof game.evaluation != "undefined" ? game.evaluation : false;
        game.evaluationID = typeof game.evaluationID != "undefined" ? game.evaluationID : '';
        $exeDevice.id = typeof game.id != "undefined" ? game.id : false;
        $('#eRMQShowMinimize').prop('checked', game.showMinimize);
        $("#eRMQHasFeedBack").prop('checked', game.feedBack);
        $("#eRMQPercentajeFB").val(game.percentajeFB);
        $("#eRMQdecimals").val(game.decimalsInOperands);
        $('#eRMQtype').val(game.type);
        $("#eRMQdecimalsInResults").prop('checked', game.decimalsInResults);
        $("#eRMQnegative").prop('checked', game.negative);
        $("#eRMQSolution").prop('checked', game.solution);
        $("#eRMQNegativesFracctions").prop('checked', game.negativeFractions);
        $("#eRMQzero").prop('checked', game.zero);
        $("#eRMQnum").val(game.number);
        $("#eRMQmax").val(game.max);
        $("#eRMQmin").val(game.min);
        $("#eRMQadd").prop('checked', game.operations.charAt(0) == "1");
        $("#eRMQsubs").prop('checked', game.operations.charAt(1) == "1");
        $("#eRMQmult").prop('checked', game.operations.charAt(2) == "1");
        $("#eRMQdiv").prop('checked', game.operations.charAt(3) == "1");
        $('#eRMQPercentajeRelative').val(game.errorRelative);
        $('#eRMQPercentajeAbsolute').val(game.errorAbsolute);
        $('#eRMQTime').val(game.time);
        $("#eRMQFractions").prop('checked', game.mode == 1);
        $('#eRMQEEvaluation').prop('checked', game.evaluation);
        $('#eRMQEEvaluationID').val(game.evaluationID);
        $("#eRMQEEvaluationID").prop('disabled', (!game.evaluation))
        $exeDevice.setErrorType(game.errorType);
        $exeDevice.changeGameMode(game.mode)
        $exeAuthoring.iDevice.gamification.scorm.setValues(game.isScorm, game.textButtonScorm, game.repeatActivity);
        if (game.textFeedBack) {
            $('#eRMQFeedbackP').show();
        } else {
            $('#eRMQFeedbackP').hide();
        }
        $('#eRMQPercentajeFB').prop('disabled', !game.feedBack);
    },
    changeGameMode: function (mode) {
        if (mode == 1) {
            $('#eRMQdecimalsDiv').hide();
            $('#eRMQdecimalsResultDiv').hide();
            $('#eRMQZeroDiv').hide();
            $('#eRMQErrorRelativeDiv').hide();
            $('#eRMQErrorAsoluteDiv').hide();
            $('#eRMQNegativesFracctionsDiv').show();
            $('#eRMQSolutionDiv').show();
            $('#eRMQnegativeDiv').hide();
        } else {
            $('#eRMQdecimalsDiv').show();
            $('#eRMQdecimalsResultDiv').show();
            $('#eRMQZeroDiv').show();
            $('#eRMQErrorRelativeDiv').show();
            $('#eRMQErrorAsoluteDiv').show();
            $('#eRMQNegativesFracctionsDiv').hide();
            $('#eRMQSolutionDiv').hide();
            $('#eRMQnegativeDiv').show();
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
        if (tinyMCE.get('eRMQFeedBackEditor')) {
            tinyMCE.get('eRMQFeedBackEditor').setContent(unescape(textFeedBack));
        } else {
            $("#eRMQFeedBackEditor").val(unescape(textFeedBack))
        }
        if (tinyMCE.get('eXeIdeviceTextAfter')) {
            tinyMCE.get('eXeIdeviceTextAfter').setContent(unescape(tAfter));
        } else {
            $("#eXeIdeviceTextAfter").val(unescape(tAfter))
        }
        $('.exe-form-tabs li:first-child a').click();
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