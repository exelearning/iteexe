/**
 * Lock iDevice (edition code)
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Manuel Narváez Martínez
 * Graphic design: Ana María Zamora Moreno, Francisco Javier Pulido
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $exeDevice = {
    // i18n
    i18n: {
        name: _('Complete')
    },
    iDevicePath: "/scripts/idevices/CMPT-activity/edition/",
    msgs: {},
    version: 1,
    ci18n: {
        "msgHappen": _("Move on"),
        "msgReply": _("Reply"),
        "msgSubmit": _("Submit"),
        "msgEnterCode": _("Enter the access code"),
        "msgErrorCode": _("The access code is not correct"),
        "msgGameOver": _("Game Over!"),
        "msgIndicateWord": _("Provide a word or phrase"),
        "msgClue": _("Cool! The clue is:"),
        "msgYouHas": _("You have got %1 hits and %2 misses"),
        "msgCodeAccess": _("Access code"),
        "msgPlayAgain": _("Play Again"),
        "msgRequiredAccessKey": _("Access code required"),
        "msgInformationLooking": _("Cool! The information you were looking for"),
        "msgPlayStart": _("Click here to play"),
        "msgErrors": _("Errors"),
        "msgMoveOne": _("Move on"),
        "msgHits": _("Hits"),
        "msgScore": _("Score"),
        "msgMinimize": _("Minimize"),
        "msgMaximize": _("Maximize"),
        "msgTime": _("Time Limit (mm:ss)"),
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
        "msgTryAgain": _("You need at least %s&percnt; of correct answers to get the information. Please try again."),
        "msgWrote": _("Write the correct word and click on Reply. If you hesitate, click on Move on."),
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
        "msgClose": _("Close"),
        "msgLoading": _("Loading. Please wait..."),
        "msgPoints": _("points"),
        "msgAudio": _("Audio"),
        "msgSolution": _("Solution"),
        "msgTry": _("Try again"),
        "msgCheck": _("Check"),
        "msgEndScore": _("You got %s right answers and %d errors."),
        "msgEndTime": _("Time over."),
        "msgGameEnd": _("You completed the activity"),
    },



    init: function () {
        this.setMessagesInfo();
        this.createForm();
    },
    setMessagesInfo: function () {
        var msgs = this.msgs;
        msgs.msgEGeneralSettings = _("General settings");
        msgs.msgEIntrucctions = _("Please write some instructions.");
        msgs.msgTime = _("Max time");
        msgs.msgERetro = _("Please write the feedback.");
        msgs.msgCodeAccess = _("Access code");
        msgs.msgEnterCodeAccess = _("Enter the access code");
        msgs.msgEInstructions = _("Instructions");
        msgs.msgEREtroalimatacion = _("Feedback");
        msgs.msgEShowMinimize = _("Show minimized.");
        msgs.msgERebootActivity = _("Repeat activity")
        msgs.msgCustomMessage = _("Error message");
        msgs.msgNumFaildedAttemps = _("Errors (number of attempts) to display the message");
        msgs.msgEnterCustomMessage = _("Please write the error message.");
        msgs.msgNoSuportBrowser = _("Your browser is not compatible with this tool.");
        msgs.msgESelectFile = _("The selected file does not contain a valid game");

    },
    showMessage: function (msg) {
        eXe.app.alert(msg);
    },

    createForm: function () {
        var msgs = this.msgs;
        var html = '\
			    <div id="gameQEIdeviceForm">\
                    <div class="exe-idevice-info">' + _("Create activities in which the student will have to fill in the blanks of a text writing or choosing an answer.") + ' <a href="https://youtu.be/NUDuvjQSTR0" hreflang="es" rel="lightbox">' + _("Use Instructions") + '</a></div>\
                    <div class="exe-form-tab" title="' + _('General settings') + '">\
                    ' + $exeAuthoring.iDevice.gamification.instructions.getFieldset(_("Read the text and complete the missing words.")) + '\
                        <fieldset class="exe-fieldset exe-fieldset-closed">\
                            <legend><a href="#">' + _("Options") + '</a></legend>\
                            <div>\
                                <p>\
                                    <span>' + _("Type") + ':</span>\
                                    <span class="CMPT-ETypes">\
                                        <input class="CMPT-Type" checked="checked" id="cmpttype0" type="radio" name="cmpttype" value="0" />\
                                        <label for="cmpttype0">' + _("Complete") + '</label>\
                                        <input class="CMPT-Type" id="cmpttype1" type="radio" name="cmpttype" value="1" />\
                                        <label for="cmpttype1">' + _("Drag and drop") + '</label>\
                                        <input class="CMPT-Type" id="cmpttype2" type="radio" name="cmpttype" value="2" />\
                                        <label for="cmpttype2">' + _("Select") + '</label>\
                                    </span>\
                                </p>\
                                <p id="cmptEWordsLimitDiv" class="CMPT-EWordsNo">\
                                    <label for="cmptEWordsLimit"><input type="checkbox" id="cmptEWordsLimit">' + _("Limit the words in each dropdown box. Write the possible options, starting with the correct one, separated by |") + '</label>\
                                </p>\
                                <p id="cmptEWordsErrorsDiv" class="CMPT-EWordsNo">\
                                    <label for="cmptEWordsErrors">' + _("Wrong words") + ':  </label><input type="text" id="cmptEWordsErrors">\
                                </p>\
                                <p>\
                                    <label for="cmptAttemptsNumber">' + _("Number of attempts") + ':\
                                    <input type="number" name="cmptAttemptsNumber" id="cmptAttemptsNumber" value="1" min="1" max="9" /> </label>\
                                </p>\
                                <p>\
                                    <label for="cmptETime">' + _("Time (minutes)") + ':\
                                    <input type="number" name="cmptETime" id="cmptETime" value="0" min="0" max="59" /> </label>\
                                </p>\
                                <p>\
                                    <label for="cmptEShowSolution"><input type="checkbox" id="cmptEShowSolution"> ' + _("Show solutions") + '. </label> \
                                </p>\
                                <p>\
                                    <label for="cmptEEstrictCheck"><input type="checkbox" id="cmptEEstrictCheck"> ' + _("Allow errors in typed words") + '. </label>\
                                    <span id="cmptEPercentajeErrorsDiv" class="CMPT-Hide">\
                                        <label for="cmptEPercentajeError">' + _("Incorrect letters allowed (&percnt;)") + ', <input type="number" name="cmptEPercentajeError" id="cmptEPercentajeError" value="20" min="0" max="100" step="5" /></label>\
                                    </span>\
                                </p>\
                                <p id="cmptECaseSensitiveDiv">\
                                     <label for="cmptECaseSensitive"><input type="checkbox" id="cmptECaseSensitive"> ' + _("Case sensitive") + '. </label>\
                                </p>\
                                <p>\
                                    <label for="cmptEWordsSize"><input type="checkbox" id="cmptEWordsSize"> ' + _("Field width proportional to the words length") + '. </label>\
                                </p>\
                                <p>\
                                    <label for="cmptEShowMinimize"><input type="checkbox" id="cmptEShowMinimize"> ' + _("Show minimized.") + ' </label>\
                                </p>\
                                <p>\
                                    <label for="cmptEHasFeedBack"><input type="checkbox"  id="cmptEHasFeedBack"> ' + _("Feedback") + '. </label> \
                                    <label for="cmptEPercentajeFB"><input type="number" name="cmptEPercentajeFB" id="cmptEPercentajeFB" value="100" min="5" max="100" step="5" disabled /> ' + _("&percnt; right to see the feedback") + '. </label>\
                                </p>\
                                <p id="cmptEFeedbackP" class="CMPT-EFeedbackP">\
                                    <textarea id="cmptEFeedBackEditor" class="exe-html-editor"></textarea>\
                                </p>\
                            </div>\
                        </fieldset>\
                        <fieldset class="exe-fieldset">\
                            <legend><a href="#">' + _("Text") + '</a></legend>\
                                <div class="CMPT-EPanel" id="cmptEPanel">\
                                    <p>\
                                        <label for="cmptEText" class="sr-av">' + _("Text") + ':</label>\
                                        <textarea id="cmptEText" class="exe-html-editor">' + _("eXeLearning is a **free** and open source editor to create **educational** resources in an **simple | easy** way. It's available for different **operating** systems.").replace(/\*\*/g, "@@") + '</textarea>\
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
        $exeDevice.loadPreviousValues(field);
        $exeDevice.addEvents();


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
    loadPreviousValues: function (field) {
        var originalHTML = field.val();
        if (originalHTML != '') {
            var wrapper = $("<div></div>");
            wrapper.html(originalHTML);
            var json = $('.completa-DataGame', wrapper).text();
            json = $exeDevice.Decrypt(json);
            var dataGame = $exeDevice.isJsonString(json)
            $exeDevice.updateFieldGame(dataGame);
            var instructions = $(".completa-instructions", wrapper);
            if (instructions.length == 1) {
                instructions = instructions.html() || ''
                if (tinyMCE.get('eXeGameInstructions')) {
                    tinyMCE.get('eXeGameInstructions').setContent(instructions);
                } else {
                    $("#eXeGameInstructions").val(instructions)
                }
            }
            var textFeedBack = $(".completa-feedback-game", wrapper);
            if (textFeedBack.length == 1) {
                textFeedBack = textFeedBack.html() || ''
                if (tinyMCE.get('cmptEFeedBackEditor')) {
                    tinyMCE.get('cmptEFeedBackEditor').setContent(textFeedBack);
                } else {
                    $("#cmptEFeedBackEditor").val(textFeedBack)
                }
            }

            var textText = $(".completa-text-game", wrapper);
            if (textText.length == 1) {
                textText = textText.html() || ''
                if (tinyMCE.get('cmptEText')) {
                    tinyMCE.get('cmptEText').setContent(textText);
                } else {
                    $("#cmptEText").val(textText)
                }
            }

            var textAfter = $(".completa-extra-content", wrapper);
            if (textAfter.length == 1) {
                textAfter = textAfter.html() || ''
                if (tinyMCE.get('eXeIdeviceTextAfter')) {
                    tinyMCE.get('eXeIdeviceTextAfter').setContent(textAfter);
                } else {
                    $("#eXeIdeviceTextAfter").val(textAfter)
                }
            }
            $exeAuthoring.iDevice.gamification.common.setLanguageTabValues(dataGame.msgs);
        }
    },
    updateFieldGame: function (game) {
        game.wordsLimit = typeof game.wordsLimit == 'undefined' ? false : game.wordsLimit;
        $exeAuthoring.iDevice.gamification.itinerary.setValues(game.itinerary);
        $('#cmptEShowMinimize').prop('checked', game.showMinimize);
        $('#cmptEShowSolution').prop('checked', game.showSolution);
        $('#cmptECaseSensitive').prop('checked', game.caseSensitive);
        $("#cmptEHasFeedBack").prop('checked', game.feedBack);
        $("#cmptEPercentajeFB").val(game.percentajeFB);
        $("#cmptEPercentajeError").val(game.percentajeError);
        $("#cmptAttemptsNumber").val(game.attempsNumber);
        $("#cmptEEstrictCheck").prop('checked', game.estrictCheck);
        $("#cmptEWordsSize").prop('checked', game.wordsSize);
        $('#cmptETime').val(game.time);
        $("#cmptEWordsErrors").val(game.wordsErrors);
        $("#cmptEWordsLimit").prop('checked', game.wordsLimit);
        $("input.CMPT-Type[name='cmpttype'][value='" + game.type + "']").prop("checked", true);
        $exeAuthoring.iDevice.gamification.scorm.setValues(game.isScorm, game.textButtonScorm, game.repeatActivity);
        if (game.feedBack) {
            $('#cmptEFeedbackP').show();
        } else {
            $('#cmptEFeedbackP').hide();
        }
        $("#cmptEWordsLimitDiv").hide();
        $('#cmptEPercentajeFB').prop('disabled', !game.feedBack);
        $("#cmptEWordsErrorsDiv").hide();
        if (game.type == 2) {
            $("#cmptEWordsLimitDiv").css({
                'display': 'flex'
            });
            $("#cmptEWordsLimitDiv").show();
        }
        if (game.type >0 && !game.wordsLimit) {
            $("#cmptEWordsErrorsDiv").css({
                'display': 'flex'
            });
            $("#cmptEWordsErrorsDiv").show();
        }
        $("#cmptEPercentajeErrorsDiv").show();
        $("#cmptECaseSensitiveDiv").hide();
        if (!game.estrictCheck) {
            $("#cmptECaseSensitiveDiv").show();
            $("#cmptEPercentajeErrorsDiv").hide();
        }

    },
    importGame: function (content) {
        var game = $exeDevice.isJsonString(content);
        if (!game || typeof game.typeGame == "undefined") {
            $exeDevice.showMessage($exeDevice.msgs.msgESelectFile);
            return;
        } else if (game.typeGame == 'Completa') {
            $exeDevice.updateFieldGame(game);
            var instructions = game.instructionsExe || game.instructions,
                tAfter = game.textAfter || "",
                textFeedBack = game.textFeedBack || "",
                textText=game.textText || "";
                if (tinyMCE.get('cmptEText')) {
                    tinyMCE.get('cmptEText').setContent(unescape(textText));
                } else {
                    $("#cmptEText").val(unescape(textText))
                }
                if (tinyMCE.get('eXeGameInstructions')) {
                    tinyMCE.get('eXeGameInstructions').setContent(unescape(instructions));
                } else {
                    $("#eXeGameInstructions").val(unescape(instructions))
                }
                if (tinyMCE.get('cmptEFeedBackEditor')) {
                    tinyMCE.get('cmptEFeedBackEditor').setContent(unescape(textFeedBack));
                } else {
                    $("#cmptEFeedBackEditor").val(unescape(textFeedBack))
                }
                if (tinyMCE.get('eXeIdeviceTextAfter')) {
                    tinyMCE.get('eXeIdeviceTextAfter').setContent(unescape(tAfter));
                } else {
                    $("#eXeIdeviceTextAfter").val(unescape(tAfter))
                }
        } else {
            $exeDevice.showMessage($exeDevice.msgs.msgESelectFile);
            return;
        }
        $('.exe-form-tabs li:first-child a').click();
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
        link.download = _("Game") + "Completa.json";
        document.getElementById('gameQEIdeviceForm').appendChild(link);
        link.click();
        setTimeout(function () {
            document.getElementById('gameQEIdeviceForm').removeChild(link);
            window.URL.revokeObjectURL(data);
        }, 100);
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
            ostr = '';
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
        var textFeedBack = tinyMCE.get('cmptEFeedBackEditor').getContent();
        if (dataGame.instructions != "") divContent = '<div class="completa-instructions gameQP-instructions">' + dataGame.instructions + '</div>';
        var html = '<div class="completa-IDevice">';
        html += '<div class="completa-feedback-game">' + textFeedBack + '</div>';
        html += divContent;
        html += '<div class="completa-DataGame js-hidden">' + json + '</div>';
        var textText = tinyMCE.get('cmptEText').getContent();
        if (textText != "") {
            html += '<div class="completa-text-game js-hidden">' + textText + '</div>';
        }
        var textAfter = tinyMCE.get('eXeIdeviceTextAfter').getContent();
        if (textAfter != "") {
            html += '<div class="completa-extra-content">' + textAfter + '</div>';
        }
        html += '<div class="cmpt-bns js-hidden">' + $exeDevice.msgs.msgNoSuportBrowser + '</div>';
        html += '</div>';
        return html;
    },


    validateData: function () {
        var instructions = tinyMCE.get('eXeGameInstructions').getContent(),
            textText = tinyMCE.get('cmptEText').getContent(),
            textFeedBack = tinyMCE.get('cmptEFeedBackEditor').getContent(),
            textAfter = tinyMCE.get('eXeIdeviceTextAfter').getContent(),
            showMinimize = $('#cmptEShowMinimize').is(':checked'),
            showSolution = $('#cmptEShowSolution').is(':checked'),
            caseSensitive = $('#cmptECaseSensitive').is(':checked'),
            estrictCheck = $('#cmptEEstrictCheck').is(':checked'),
            wordsSize = $('#cmptEWordsSize').is(':checked'),
            time = parseInt($('#cmptETime').val()),
            itinerary = $exeAuthoring.iDevice.gamification.itinerary.getValues(),
            feedBack = $('#cmptEHasFeedBack').is(':checked'),
            percentajeFB = parseInt($('#cmptEPercentajeFB').val()),
            percentajeError = parseInt($('#cmptEPercentajeError').val()),
            type = parseInt($('input[name=cmpttype]:checked').val()),
            wordsErrors = $('#cmptEWordsErrors').val(),
            wordsLimit = $('#cmptEWordsLimit').is(':checked'),
            attempsNumber = parseInt($('#cmptAttemptsNumber').val());

        if (textText.trim().length == 0) {
            eXe.app.alert($exeDevice.msgs.msgProvideFB);
            return false;
        }
        if (feedBack && textFeedBack.trim().length == 0) {
            eXe.app.alert($exeDevice.msgs.msgProvideFB);
            return false;
        }
        var scorm = $exeAuthoring.iDevice.gamification.scorm.getValues(),
            data = {
                'typeGame': 'Completa',
                'instructions': instructions,
                'textText': escape(textText),
                'showMinimize': showMinimize,
                'itinerary': itinerary,
                'caseSensitive': caseSensitive,
                'isScorm': scorm.isScorm,
                'textButtonScorm': scorm.textButtonScorm,
                'repeatActivity': scorm.repeatActivity,
                'textFeedBack': escape(textFeedBack),
                'textAfter': escape(textAfter),
                'feedBack': feedBack,
                'percentajeFB': percentajeFB,
                'version': $exeDevice.version,
                'estrictCheck': estrictCheck,
                'wordsSize': wordsSize,
                'time': time,
                'type': type,
                'wordsErrors': wordsErrors,
                'attempsNumber': attempsNumber,
                'percentajeError': percentajeError,
                'showSolution': showSolution,
                'wordsLimit': wordsLimit
            }

        return data;
    },

    addEvents: function () {
        $('#cmptEHasFeedBack').on('change', function () {
            var marcado = $(this).is(':checked');
            if (marcado) {
                $('#cmptEFeedbackP').show();
            } else {
                $('#cmptEFeedbackP').hide();
            }
            $('#cmptEPercentajeFB').prop('disabled', !marcado);
        });


        $('#gameQEIdeviceForm').on('click', 'input.CMPT-Type', function (e) {
            var type = parseInt($(this).val()),
            limit= $("#cmptEWordsLimit").is(':checked');
            $("#cmptEWordsLimitDiv").hide();
            $("#cmptEWordsErrorsDiv").hide();
            if (type == 2) {
                $("#cmptEWordsLimitDiv").css({
                    'display': 'flex'
                });
                $("#cmptEWordsLimitDiv").show();
            }

            if (type > 0 && ! limit) {
                $("#cmptEWordsErrorsDiv").css({
                    'display': 'flex'
                });
                $("#cmptEWordsErrorsDiv").show();
            }
        });
        $('#cmptEWordsLimit').on('click',  function (e) {
            var  limit= $(this).is(':checked');
            $("#cmptEWordsErrorsDiv").hide();
            if (!limit) {
                $("#cmptEWordsErrorsDiv").css({
                    'display': 'flex'
                });
                $("#cmptEWordsErrorsDiv").show();
            }
        });

        $('#cmptEEstrictCheck').on('change', function () {
            var state = $(this).is(':checked');
            $("#cmptECaseSensitiveDiv").show();
            $("#cmptEPercentajeErrorsDiv").hide();
            if (state) {
                $("#cmptECaseSensitiveDiv").hide();
                $("#cmptEPercentajeErrorsDiv").show();
            }
        });
        $('#cmptETime').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 1);
            this.value = v;
        });
        $('#cmptETime').on('focusout', function () {
            this.value = this.value.trim() == '' ? 0 : this.value;
            this.value = this.value > 59 ? 59 : this.value;
            this.value = this.value < 0 ? 0 : this.value;
        });

        $('#cmptAttemptsNumber').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 1);
            this.value = v;
        });
        $('#cmptAttemptsNumber').on('focusout', function () {
            this.value = this.value.trim() == '' ? 1 : this.value;
            this.value = this.value > 9 ? 9 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
        });

        $('#cmptEPercentajeError').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 1);
            this.value = v;
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
        $('#cmptEPercentajeError').on('focusout', function () {
            this.value = this.value.trim() == '' ? 1 : this.value;
            this.value = this.value > 100 ? 100 : this.value;
            this.value = this.value < 0 ? 0 : this.value;
        });

        $exeAuthoring.iDevice.gamification.itinerary.addEvents();


    }
}