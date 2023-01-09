/**
 * Identifica Activity iDevice (edition code)
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Manuel Narváez Martínez
 * Graphic design: Ana María Zamora Moreno
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $exeDevice = {
    // i18n
    i18n: {
        name: _('Identify')
    },
    iDevicePath: "/scripts/idevices/identifica-activity/edition/",
    msgs: {},
    active: 0,
    questionsGame: [],
    typeEdit: -1,
    numberCutCuestion: -1,
    clipBoard: '',
    version: 1,
    ci18n: {
        "msgSubmit": _("Submit"),
        "msgCodeAccess": _("Access code"),
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
        "msgLoseLive": _("You lost one life"),
        "msgAllQuestions": _("Questions completed!"),
        "msgSuccesses": _("Right! | Excellent! | Great! | Very good! | Perfect!"),
        "msgFailures": _("It was not that! | Incorrect! | Not correct! | Sorry! | Error!"),
        "msgScoreScorm": _("The score can't be saved because this page is not part of a SCORM package."),
        "msgOnlySaveScore": _("You can only save the score once!"),
        "msgOnlySave": _("You can only save once"),
        "msgInformation": _("Information"),
        "msgAuthor": _("Authorship"),
        "msgOnlySaveAuto": _("Your score will be saved after each question. You can only play once."),
        "msgSaveAuto": _("Your score will be automatically saved after each question."),
        "msgYouScore": _("Your score"),
        "msgSeveralScore": _("You can save the score as many times as you want"),
        "msgYouLastScore": _("The last score saved is"),
        "msgActityComply": _("You have already done this activity."),
        "msgPlaySeveralTimes": _("You can do this activity as many times as you want"),
        "msgTryAgain": _("You need at least %s&percnt; of correct answers to get the information. Please try again."),
        "msgClose": _("Close"),
        "msgClue": _("Hint"),
        "msgShowClue": _("Show a clue"),
        "msgShowNewClue": _("Show another clue"),
        "msgUseFulInformation": _("and information that will be very useful"),
        "msgLoading": _("Loading. Please wait..."),
        "msgPoints": _("points"),
        "msgAudio": _("Audio"),
        "msgReply": _("Reply"),
        "msgAttempts": _("Attempts"),
        "msgScoreQuestion": _("Points at stake"),
        "msgAnswer": _("Please write the answer"),
        "msgYouCanTryAgain": _("You can try it again"),
        "msgGameStarted": _("The game has already started."),
        "msgGameEnd": _("Game over."),
        "msgCorrectAnswer": _("The right answer is:"),
        "msgMoveOne": _("Move on"),
        "msgUseClue":_("You used one clue. You can only get %s points."),
        "msgUseAllClues": _("You already used all the clues. You can only get %s points."),
        "msgModeWhiteBoard": _("Digital blackboard mode"),
        "msgCheckLetter": _("Check the letter"),
    },

    init: function () {
        this.ci18n.msgTryAgain = this.ci18n.msgTryAgain.replace("&percnt;", "%"); // Avoid invalid HTML
        this.setMessagesInfo();
        this.createForm();
    },
    enableForm: function (field) {
        $exeDevice.initQuestions();
        $exeDevice.loadPreviousValues(field);
        $exeDevice.addEvents();
    },
    setMessagesInfo: function () {
        var msgs = this.msgs;
        msgs.msgESelectFile = _("The selected file does not contain a valid game");
        msgs.msgEOneQuestion = _("Please provide at least one question");
        msgs.msgECompleteQuestion = _("You have to complete the question");
        msgs.msgECompleteAllClues = _("Please complete all the clues");
        msgs.msgProvideFB = _('Message to display when passing the game');
        msgs.msgNoSuportBrowser = _("Your browser is not compatible with this tool.");
        msgs.msgIndicateSolution= _("Indicate the character, object or solution to discover")

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
    showMessage: function (msg) {
        eXe.app.alert(msg);
    },
    addQuestion: function () {
        if ($exeDevice.validateQuestion() != false) {
            $exeDevice.clearQuestion();
            $exeDevice.questionsGame.push($exeDevice.getCuestionDefault());
            $exeDevice.active = $exeDevice.questionsGame.length - 1;
            $exeDevice.typeEdit = -1;
            $('#idfEPaste').hide();
            $('#idfENumQuestions').text($exeDevice.questionsGame.length);
            $('#idfENumberQuestion').val($exeDevice.questionsGame.length);
            $exeDevice.updateQuestionsNumber();
        }
    },
    removeQuestion: function () {
        if ($exeDevice.questionsGame.length < 2) {
            $exeDevice.showMessage($exeDevice.msgs.msgEOneQuestion);
            return;
        } else {
            $exeDevice.questionsGame.splice($exeDevice.active, 1);
            if ($exeDevice.active >= $exeDevice.questionsGame.length - 1) {
                $exeDevice.active = $exeDevice.questionsGame.length - 1;
            }
            $exeDevice.showQuestion($exeDevice.active);
            $exeDevice.typeEdit = -1;
            $('#idfEPaste').hide();
            $('#idfENumQuestions').text($exeDevice.questionsGame.length);
            $('#idfENumberQuestion').val($exeDevice.active + 1);
            $exeDevice.updateQuestionsNumber();
        }

    },
    copyQuestion: function () {
        if ($exeDevice.validateQuestion() != false) {
            $exeDevice.typeEdit = 0;
            $exeDevice.clipBoard = $exeDevice.questionsGame[$exeDevice.active];
            $('#idfEPaste').show();
        }

    },
    cutQuestion: function () {
        if ($exeDevice.validateQuestion() != false) {
            $exeDevice.numberCutCuestion = $exeDevice.active;
            $exeDevice.typeEdit = 1;
            $('#idfEPaste').show();

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
            $exeDevice.questionsGame.splice($exeDevice.active, 0, $exeDevice.clipBoard);
            $exeDevice.showQuestion($exeDevice.active);
        } else if ($exeDevice.typeEdit == 1) {
            $('#idfEPaste').hide();
            $exeDevice.typeEdit = -1;
            $exeDevice.arrayMove($exeDevice.questionsGame, $exeDevice.numberCutCuestion, $exeDevice.active);
            $exeDevice.showQuestion($exeDevice.active);
            $('#idfENumQuestions').text($exeDevice.questionsGame.length);
            $exeDevice.updateQuestionsNumber();
        }
    },
    nextQuestion: function () {

        if ($exeDevice.validateQuestion() != false) {
            if ($exeDevice.active < $exeDevice.questionsGame.length - 1) {
                $exeDevice.active++;
                $exeDevice.showQuestion($exeDevice.active);
            }
        }
    },
    lastQuestion: function () {
        if ($exeDevice.validateQuestion() != false) {
            if ($exeDevice.active < $exeDevice.questionsGame.length - 1) {
                $exeDevice.active = $exeDevice.questionsGame.length - 1;
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
    updateQuestionsNumber: function(){
        var percentaje=parseInt($exeDevice.removeTags($('#idfEPercentajeQuestions').val()));
        if(isNaN(percentaje)){
            return;
        }
        percentaje=percentaje<1?1:percentaje;
        percentaje=percentaje>100?100:percentaje;
        var num=Math.round((percentaje*$exeDevice.questionsGame.length)/100);
        num=num==0?1:num;
        $('#idfENumeroPercentaje').text(num+"/"+$exeDevice.questionsGame.length)
    },
    showQuestion: function (i) {
        var num = i < 0 ? 0 : i;
        num = num >= $exeDevice.questionsGame.length ? $exeDevice.questionsGame.length - 1 : num;
        var p = $exeDevice.questionsGame[num],
            numClues = 0;
        $('.IDFE-EAnwersClues').each(function (j) {
            numClues++;
            if (p.clues[j].trim() !== '') {
                p.numClues = numClues;
            }
            $(this).val(p.clues[j]);
        });

        $exeDevice.showClues(p.numberClues);
        $('#idfEQuestion').val(p.question);
        $('#idfENumQuestions').text($exeDevice.questionsGame.length);
        $('#idfEURLImage').val(p.url);
        $('#idfEXImage').val(p.x);
        $('#idfEYImage').val(p.y);
        $('#idfEAuthor').val(p.author);
        $('#idfEAlt').val(p.alt);
        $('#idfESolution').val(p.solution);
        $('#idfECluesNumber').val(p.numberClues);
        $('#idfEAttemptsNumber').val(p.attempts);
        
        $exeDevice.showImage(p.url, p.x, p.y, p.alt);
        $('.IDFE-EAnwersClues').each(function (j) {
            var clue = j < p.numClues ? p.clues[j] : '';
            $(this).val(clue);
        });
        p.audio = p.audio && p.audio != "undefined" ? p.audio : "";
        $exeDevice.stopSound();
        if (p.type != 2 && p.audio.trim().length > 4) {
            $exeDevice.playSound(p.audio.trim());
        }
        $('#idfEURLAudio').val(p.audio);
        $('#idfENumberQuestion').val(i + 1);
        $('#idfEMessageKO').val(p.msgError);
        $('#idfEMessageOK').val(p.msgHit);
    },


    drawImage: function (image, mData) {
        $(image).css({
            'left': mData.x + 'px',
            'top': mData.y + 'px',
            'width': mData.w + 'px',
            'height': mData.h + 'px'
        });
    },
    showImage: function (url, x, y, alt, type) {
        var $image = $('#idfEImage'),
            $cursor = $('#idfECursor');
        $image.hide();
        $cursor.hide();
        $image.attr('alt', alt);
        $('#idfENoImage').show();
        url = $exeDevice.extractURLGD(url);
        $image.prop('src', url)
            .on('load', function () {
                if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                    return false;
                } else {
                    var mData = $exeDevice.placeImageWindows(this, this.naturalWidth, this.naturalHeight);
                    $exeDevice.drawImage(this, mData);
                    $image.show();
                    $('#idfENoImage').hide();
                    $exeDevice.paintMouse(this, $cursor, x, y);
                    return true;
                }
            }).on('error', function () {
                return false;
            });
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


    clearQuestion: function () {
        $exeDevice.showClues(4);
        $('#idfEURLImage').val('');
        $('#idfEXImage').val('0');
        $('#idfEYImage').val('0');
        $('#idfEAttemptsNumber').val('4');
        $('#idfECluesNumber').val('4');
        $('#idfEAuthor').val('');
        $('#idfEAlt').val('');
        $('#idfEURLAudio').val('');
        $('#idfEQuestion').val('');
        $('#idfESolution').val('');
        $('.IDFE-EAnwersClues').each(function () {
            $(this).val('');
        });
        $('#idfEMessageOK').val('');
        $('#idfEMessageKO').val('');
    },
    showClues: function (number) {
        $('.IDFE-EPistaDiv').each(function (i) {
            $(this).show();
            if (i >= number) {
                $(this).hide();
            }

        });
        $('.IDFE-EAnwersClues').each(function (j) {
            if (j >= number) {
                $(this).val('');
            }

        });
    },

    createForm: function () {
        var path = $exeDevice.iDevicePath,
            html = '\
			<div id="gameQEIdeviceForm">\
                <div class="exe-idevice-info">'+_("Create activities in which the players, with some clues, will have to guess a character, an object or the solution to a problem.")+' <a href="https://youtu.be/LROSPEDRHkI" hreflang="es" rel="lightbox"  target="_blank">'+_("Use Instructions")+'</a></div>\
				<div class="exe-form-tab" title="' + _('General settings') + '">\
                ' + $exeAuthoring.iDevice.gamification.instructions.getFieldset(_("Use the clues to guess the hidden answer for each question.")) + '\
                    <fieldset class="exe-fieldset exe-fieldset-closed">\
                        <legend><a href="#">' + _("Options") + '</a></legend>\
                        <div>\
                            <p>\
                                <label for="idfEShowMinimize"><input type="checkbox" id="idfEShowMinimize">' + _("Show minimized.") + '</label>\
                            </p>\
                            <p>\
                                <label for="idfESAvancedMode"><input type="checkbox" checked id="idfESAvancedMode">' + _("Advanced mode") + '. </label>\
                            </p>\
                            <p>\
                                <label for="idfEQuestionRamdon"><input type="checkbox" id="idfEQuestionRamdon">' + _("Random questions") + '</label>\
                            </p>\
                            <p>\
                                <label for="idfECustomMessages"><input type="checkbox" id="idfECustomMessages">' + _("Custom messages") + '. </label>\
                            </p>\
                            <p>\
                                <label for="idfEShowSolution"><input type="checkbox" checked id="idfEShowSolution">' + _("Show solutions") + '. </label>\
                                <label for="idfETimeShowSolution">' + _("Show solution time (seconds)") + ' <input type="number" name="idfETimeShowSolution" id="idfETimeShowSolution" value="3" min="1" max="9" /> </label>\
                            </p>\
                            <p>\
                                <label for="idfEHasFeedBack"><input type="checkbox"  id="idfEHasFeedBack"> ' + _("Feedback") + '. </label> \
                                <label for="idfEPercentajeFB"><input type="number" name="idfEPercentajeFB" id="idfEPercentajeFB" value="100" min="5" max="100" step="5" disabled /> '+_("&percnt; right to see the feedback")+' </label>\
                            </p>\
                            <p id="idfEFeedbackP" class="IDFE-EFeedbackP">\
                                <textarea id="idfEFeedBackEditor" class="exe-html-editor"\></textarea>\
                            </p>\
                            <p>\
                                <label for="idfEPercentajeQuestions">% ' + _("Questions") + ':  <input type="number" name="idfEPercentajeQuestions" id="idfEPercentajeQuestions" value="100" min="1" max="100" /> </label>\
                                <span id="idfENumeroPercentaje">1/1</span>\
                            </p>\
                        </div>\
                    </fieldset>\
                    <fieldset class="exe-fieldset">\
                        <legend><a href="#">' + _("Questions") + '</a></legend>\
                        <div class="IDFE-EPanel" id="idfEPanel">\
                            <div class="IDFE-EPistasMedia">\
                                <div class="IDFE-EPistasGame">\
                                    <span class="IDFE-ETitleImage" id="">' + _("Message") + '</span>\
                                    <div class="IDFE-EInputImage">\
                                        <label class="sr-av">' + _("Message") + ':</label><input type="text" class="IDFE-EURLImage" id="idfEQuestion">\
                                    </div>\
                                    <span class="IDFE-ETitleImage" id="">' + _("Solution") + '</span>\
                                    <div class="IDFE-EInputImage">\
                                        <label class="sr-av">' + _("Solution") + ':</label><input type="text" class="IDFE-EURLImage" id="idfESolution">\
                                    </div>\
                                    <span class="IDFE-ETitleImage" id="idfETitleImage">' + _("Image URL") + '</span>\
                                    <div class="IDFE-Flex IDFE-EInputImage" id="idfEInputImage">\
                                        <label class="sr-av" for="idfEURLImage">' + _("Image URL") + '</label>\
                                        <input type="text" class="exe-file-picker IDFE-EURLImage"  id="idfEURLImage"/>\
                                        <a href="#" id="idfEPlayImage" class="IDFE-ENavigationButton IDFE-EPlayVideo" title="' + _("Show") + '"><img src="' + path + 'quextIEPlay.png"  alt="' + _("Show") + '" class="IDFE-EButtonImage b-play" /></a>\
                                        <a href="#" id="idfEShowMore" class="IDFE-ENavigationButton IDFE-EShowMore" title="' + _('More') + '"><img src="' + path + 'quextEIMore.png" alt="' + _('More') + '" class="IDFE-EButtonImage b-play" /></a>\
                                    </div>\
                                    <div class="IDFE-EInputCluesImage" id="idfInputCluesImage">\
                                        <div class="IDFE-ECoord">\
                                            <label for="idfEXImage">X:</label>\
                                            <input id="idfEXImage" type="text" value="0" />\
                                            <label for="idfEXImage">Y:</label>\
                                            <input id="idfEYImage" type="text" value="0" />\
                                        </div>\
                                    </div>\
                                    <div class="IDFE-EAuthorAlt"  id="idfEAuthorAlt">\
                                        <div class="IDFE-EInputAuthor">\
                                            <label>' + _('Authorship') + '</label><input id="idfEAuthor" type="text"  class="IDFE-EAuthor" />\
                                        </div>\
                                        <div class="IDFE-EInputAlt">\
                                            <label>' + _('Alt') + '</label><input  id="idfEAlt" type="text" class="IDFE-EAlt" />\
                                        </div>\
                                    </div>\
                                    <span id="idfETitleAudio">' + _("Audio") + '</span>\
                                    <div class="IDFE-EInputAudio" id="idfEInputAudio">\
                                        <label class="sr-av" for="idfEURLAudio">' + _("URL") + '</label>\
                                        <input type="text" class="exe-file-picker IDFE-EURLAudio"  id="idfEURLAudio"/>\
                                        <a href="#" id="idfEPlayAudio" class="IDFE-ENavigationButton IDFE-EPlayVideo" title="' + _("Play audio") + '"><img src="' + path + 'quextIEPlay.png" alt="' + _("Play audio") + '" class="IDFE-EButtonImage b-play" /></a>\
                                    </div>\
                                    <div>\
                                        <label for="idfEAttemptsNumber">' + _("Number of attempts") + ':</label><input type="number" name="idfEAttemptsNumber" id="idfEAttemptsNumber" value="3" min="1" max="8" step="1" />\
                                    </div>\
                                </div>\
                                <div class="IDFE-EMultiMediaClue">\
                                    <div class="IDFE-EMultimedia" id="idfEMultimedia">\
                                        <img class="IDFE-EMedia" src="' + path + 'quextIEImage.png" id="idfEImage" alt="' + _("Image") + '" />\
                                        <img class="IDFE-EMedia" src="' + path + 'quextIEImage.png" id="idfENoImage" alt="' + _("No image") + '" />\
                                        <img class="IDFE-ECursor" src="' + path + 'quextIECursor.gif" id="idfECursor" alt="" />\
                                    </div>\
                                </div>\
                            </div>\
                            <div class="IDFE-EContents">\
                                   <p>\
                                      <label for="idfECluesNumber">' + _("Number of clues") + ':</label><input type="number" name="idfECluesNumber" id="idfECluesNumber" value="4" min="2" max="8" step="1" />\
                                    </p>\
                                   <div class="IDFE-EAnswers">\
                                    <div class="IDFE-EPistaDiv">\
                                        <label > 1:</label><input type="text" class="IDFE-EPista0 IDFE-EAnwersClues"  id="idfEPista0">\
                                    </div>\
                                    <div class="IDFE-EPistaDiv">\
                                        <label>2:</label><input type="text" class="IDFE-EPista1 IDFE-EAnwersClues"  id="idfEPista1">\
                                    </div>\
                                    <div class="IDFE-EPistaDiv">\
                                        <label>3:</label><input type="text" class="IDFE-EPista2 IDFE-EAnwersClues"  id="idfEPista2">\
                                    </div>\
                                    <div class="IDFE-EPistaDiv">\
                                        <label>4:</label><input type="text" class="IDFE-EPista3 IDFE-EAnwersClues"  id="idfEPista3">\
                                    </div>\
                                    <div class="IDFE-EPistaDiv">\
                                        <label>5:</label><input type="text" class="IDFE-EPista4 IDFE-EAnwersClues" id="idfEPista4">\
                                    </div>\
                                    <div class="IDFE-EPistaDiv">\
                                        <label>6:</label><input type="text" class="IDFE-EPista5 IDFE-EAnwersClues"  id="idfEPista5">\
                                    </div>\
                                    <div class="IDFE-EPistaDiv">\
                                        <label>7:</label><input type="text" class="IDFE-EPista6 IDFE-EAnwersClues"  id="idfEPista6">\
                                    </div>\
                                    <div class="IDFE-EPistaDiv">\
                                        <label>8:</label><input type="text" class="IDFE-EPista7 IDFE-EAnwersClues"  id="idfEPista7">\
                                    </div>\
                                </div>\
                            </div>\
                            <div class="IDFE-EOrders" id="idfEOrder">\
                                <div class="IDFE-ECustomMessage">\
                                    <span class="sr-av">' + _("Hit") + '</span><span class="IDFE-EHit"></span>\
                                    <label for="idfEMessageOK">' + _("Message") + ':</label>\
                                    <input type="text" class=""  id="idfEMessageOK">\
                                </div>\
                                <div class="IDFE-ECustomMessage">\
                                    <span class="sr-av">' + _("Error") + '</span><span class="IDFE-EError"></span>\
                                    <label for="idfEMessageKO">' + _("Message") + ':</label>\
                                    <input type="text" class=""  id="idfEMessageKO">\
                                </div>\
                            </div>\
                            <div class="IDFE-ENavigationButtons">\
                                <a href="#" id="idfEAdd" class="IDFE-ENavigationButton" title="' + _("Add question") + '"><img src="' + path + 'quextIEAdd.png" alt="' + _("Add question") + '" class="IDFE-EButtonImage" /></a>\
                                <a href="#" id="idfEFirst" class="IDFE-ENavigationButton"  title="' + _("First question") + '"><img src="' + path + 'quextIEFirst.png"  alt="' + _("First question") + '" class="IDFE-EButtonImage" /></a>\
                                <a href="#" id="idfEPrevious" class="IDFE-ENavigationButton" title="' + _("Previous question") + '"><img src="' + path + 'quextIEPrev.png" alt="' + _("Previous question") + '" class="IDFE-EButtonImage" /></a>\
                                <label class="sr-av" for="idfENumberQuestion">' + _("Question number:") + ':</label><input type="text" class="IDFE-NumberQuestion"  id="idfENumberQuestion" value="1"/>\
                                <a href="#" id="idfENext" class="IDFE-ENavigationButton"  title="' + _("Next question") + '"><img src="' + path + 'quextIENext.png" alt="' + _("Next question") + '" class="IDFE-EButtonImage" /></a>\
                                <a href="#" id="idfELast" class="IDFE-ENavigationButton"  title="' + _("Last question") + '"><img src="' + path + 'quextIELast.png" alt="' + _("Last question") + '" class="IDFE-EButtonImage" /></a>\
                                <a href="#" id="idfEDelete" class="IDFE-ENavigationButton" title="' + _("Delete question") + '"><img src="' + path + 'quextIEDelete.png" alt="' + _("Delete question") + '" class="IDFE-EButtonImage" /></a>\
                                <a href="#" id="idfECopy" class="IDFE-ENavigationButton" title="' + _("Copy question") + '"><img src="' + path + 'quextIECopy.png" alt="' + _("Copy question") + '" class="IDFE-EButtonImage" /></a>\
                                <a href="#" id="idfECut" class="IDFE-ENavigationButton" title="' + _("Cut question") + '"><img src="' + path + 'quextIECut.png" alt="' + _("Cut question") + '"  class="IDFE-EButtonImage" /></a>\
                                <a href="#" id="idfEPaste" class="IDFE-ENavigationButton"  title="' + _("Paste question") + '"><img src="' + path + 'quextIEPaste.png" alt="' + _("Paste question") + '" class="IDFE-EButtonImage" /></a>\
                            </div>\
                            <div class="IDFE-ENumQuestionDiv" id="idfENumQuestionDiv">\
                               <div class="IDFE-ENumQ"><span class="sr-av">' + _("Number of questions:") + '</span></div>\ <span class="IDFE-ENumQuestions" id="idfENumQuestions">0</span>\
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

    initQuestions: function () {
        $('#idfEInputImage').css('display', 'flex');
        $("#idfMediaNormal").prop("disabled", false);
        $("#idfMediaImage").prop("disabled", false);
        $("#idfMediaText").prop("disabled", false);
        if ($exeDevice.questionsGame.length == 0) {
            var question = $exeDevice.getCuestionDefault();
            $exeDevice.questionsGame.push(question);
            this.showClues(4);
        }
        this.active = 0;
    },
    getCuestionDefault: function () {
        var p = new Object();
        p.numberClues = 4;
        p.url = '';
        p.x = 0;
        p.y = 0;
        p.author = '';
        p.alt = "";
        p.question = '';
        p.solution = '';
        p.clues = [];
        p.clues.push('');
        p.clues.push('');
        p.clues.push('');
        p.clues.push('');
        p.clues.push('');
        p.clues.push('');
        p.clues.push('');
        p.clues.push('');
        p.audio = '';
        p.msgHit = '';
        p.msgError = '';
        p.attempts = 4;
        return p;
    },
    validTime: function (time) {
        var reg = /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/;
        return (time.length == 8 && reg.test(time))
    },
    loadPreviousValues: function (field) {

        var originalHTML = field.val();
        if (originalHTML != '') {
            $exeDevice.active = 0;
            var wrapper = $("<div></div>");
            wrapper.html(originalHTML);
            var json = $('.identifica-DataGame', wrapper).text(),
                version = $('.identifica-version', wrapper).text();
            if (version.length == 1) {
                json = $exeDevice.Decrypt(json);
            }
            var dataGame = $exeDevice.isJsonString(json),
                $imagesLink = $('.identifica-LinkImages', wrapper),
                $audiosLink = $('.identifica-LinkAudios', wrapper);

            $imagesLink.each(function () {
                var iq = parseInt($(this).text());
                if (!isNaN(iq) && iq < dataGame.questionsGame.length) {
                    dataGame.questionsGame[iq].url = $(this).attr('href');
                    if (dataGame.questionsGame[iq].url.length < 4 && dataGame.questionsGame[iq].type == 1) {
                        dataGame.questionsGame[iq].url = "";
                    }
                }
            });
            for (var i = 0; i < dataGame.questionsGame.length; i++) {
                dataGame.questionsGame[i].audio = typeof dataGame.questionsGame[i].audio == "undefined" ? "" : dataGame.questionsGame[i].audio;
            }
            $audiosLink.each(function () {
                var iq = parseInt($(this).text());
                if (!isNaN(iq) && iq < dataGame.questionsGame.length) {
                    dataGame.questionsGame[iq].audio = $(this).attr('href');
                    if (dataGame.questionsGame[iq].audio.length < 4) {
                        dataGame.questionsGame[iq].audio = "";
                    }
                }
            });
            $exeDevice.active = 0;   
            var instructions = $(".identifica-instructions", wrapper);
            if (instructions.length == 1) {
                instructions = instructions.html() || ''
                if (tinyMCE.get('eXeGameInstructions')) {
                    tinyMCE.get('eXeGameInstructions').setContent(instructions);
                } else {
                    $("#eXeGameInstructions").val(instructions)
                }
            }

            var textFeedBack = $(".identifica-feedback-game", wrapper);
            if (textFeedBack.length == 1) {
                textFeedBack = textFeedBack.html() || ''
                if (tinyMCE.get('idfEFeedBackEditor')) {
                    tinyMCE.get('idfEFeedBackEditor').setContent(textFeedBack);
                } else {
                    $("#idfEFeedBackEditor").val(textFeedBack)
                }
            }

            var textAfter = $(".identifica-extra-content", wrapper);
            if (textAfter.length == 1) {
                textAfter = textAfter.html() || ''
                if (tinyMCE.get('eXeIdeviceTextAfter')) {
                    tinyMCE.get('eXeIdeviceTextAfter').setContent(textAfter);
                } else {
                    $("#eXeIdeviceTextAfter").val(textAfter)
                }
            }
            $exeAuthoring.iDevice.gamification.common.setLanguageTabValues(dataGame.msgs);
            $exeDevice.updateFieldGame(dataGame);
        }
    },
    updateGameMode: function (feedback) {

        $('#idfEPercentajeFB').prop('disabled', !feedback);
        $('#idfEHasFeedBack').prop('checked', feedback);
        if ( feedback) {
            $('#idfEFeedbackP').slideDown();
        }else {
            $('#idfEFeedbackP').slideUp();
        }
    },

    updateFieldGame: function (game) {

        $exeAuthoring.iDevice.gamification.itinerary.setValues(game.itinerary);
        game.questonsRamdo = game.questonsRamdo || false;
        game.percentajeFB = typeof game.percentajeFB != "undefined" ? game.percentajeFB : 100;
        game.feedBack = typeof game.feedBack != "undefined" ? game.feedBack : false;
        game.customMessages = typeof game.customMessages == "undefined" ? false : game.customMessages;
        game.percentajeQuestions = typeof game.percentajeQuestions == "undefined" ? 100 : game.percentajeQuestions;
        $('#idfEShowMinimize').prop('checked', game.showMinimize);
        $('#idfESAvancedMode').prop('checked', game.avancedMode);
        $('#idfEQuestionRamdon').prop('checked', game.questionsRamdon);
        $('#idfEShowSolution').prop('checked', game.showSolution);
        $('#idfETimeShowSolution').val(game.timeShowSolution)
        $('#idfETimeShowSolution').prop('disabled', !game.showSolution);
        $("#idfEHasFeedBack").prop('checked', game.feedBack);
        $("#idfEPercentajeFB").val(game.percentajeFB);
        $('#idfECustomMessages').prop('checked', game.customMessages);
        $('#idfEPercentajeQuestions').val(game.percentajeQuestions);
        $exeDevice.updateGameMode(game.feedBack);
        $exeDevice.showSelectOrder(game.customMessages);
        for (var i = 0; i < game.questionsGame.length; i++) {
            game.questionsGame[i].audio = typeof game.questionsGame[i].audio == "undefined" ? "" : game.questionsGame[i].audio;
            game.questionsGame[i].msgHit = typeof game.questionsGame[i].msgHit == "undefined" ? "" : game.questionsGame[i].msgHit;
            game.questionsGame[i].msgError = typeof game.questionsGame[i].msgError == "undefined" ? "" : game.questionsGame[i].msgError;
        }
        $exeAuthoring.iDevice.gamification.scorm.setValues(game.isScorm, game.textButtonScorm, game.repeatActivity);
        if (game.feedBack) {
            $('#idfEFeedbackP').show();
        } else {
            $('#idfEFeedbackP').hide();
        }
        $('#idfEPercentajeFB').prop('disabled', !game.feedBack);
        $exeDevice.questionsGame = game.questionsGame;
        $exeDevice.updateQuestionsNumber();
        $exeDevice.showQuestion($exeDevice.active);

    },
    showSelectOrder: function (messages, custonmScore) {
        if (messages) {
            $('.IDFE-EOrders').slideDown();
        } else {
            $('.IDFE-EOrders').slideUp();
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
    save: function () {
        if (!$exeDevice.validateQuestion()) {
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
        if (instructions != "") divContent = '<div class="identifica-instructions gameQP-instructions">' + instructions + '</div>';
        var textFeedBack = tinyMCE.get('idfEFeedBackEditor').getContent(),
            linksImages = $exeDevice.createlinksImage(dataGame.questionsGame),
            linksAudios = $exeDevice.createlinksAudio(dataGame.questionsGame),
            html = '<div class="identifica-IDevice">';
        html += divContent;
        html += '<div class="identifica-version js-hidden">' + $exeDevice.version + '</div>';
        html += '<div class="identifica-feedback-game">' + textFeedBack + '</div>';
        html += '<div class="identifica-DataGame js-hidden" >' + $exeDevice.Encrypt(json) + '</div>';
        html += linksImages;
        html += linksAudios;
        var textAfter = tinyMCE.get('eXeIdeviceTextAfter').getContent();
        if (textAfter != "") {
            html += '<div class="identifica-extra-content">' + textAfter + '</div>';
        }
        html += '<div class="identifica-bns js-hidden">' + $exeDevice.msgs.msgNoSuportBrowser + '</div>';
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
    validateQuestion: function () {
        var message = '',
            msgs = $exeDevice.msgs,
            p = new Object();
        p.numberClues = parseInt($('#idfECluesNumber').val());
        p.x = parseFloat($('#idfEXImage').val());
        p.y = parseFloat($('#idfEYImage').val());;
        p.author = $('#idfEAuthor').val();
        p.alt = $('#idfEAlt').val();
        p.url = $('#idfEURLImage').val().trim();
        p.audio = $('#idfEURLAudio').val();
        p.question = $('#idfEQuestion').val().trim();
        p.solution = $('#idfESolution').val().trim();
        p.clues = [];
        p.msgHit = $('#idfEMessageOK').val();
        p.msgError = $('#idfEMessageKO').val();
        p.attempts=parseInt($('#idfEAttemptsNumber').val());
        $exeDevice.stopSound();
        var clueEmpy = false;
        $('.IDFE-EAnwersClues').each(function (i) {
            var clue = $(this).val().trim();
            if (i < p.numberClues && clue.length == 0) {
                clueEmpy = true;
            }
            p.clues.push(clue);
        });
        if (p.solution.length==0) {
            message = msgs.msgIndicateSolution;
        } else if (clueEmpy) {
            message = msgs.msgECompleteAllClues
        }
        if (message.length == 0) {
            $exeDevice.questionsGame[$exeDevice.active] = p;
            message = true;
        } else {
            $exeDevice.showMessage(message);
            message = false;
        }
        return message;

    },

    createlinksImage: function (questionsGame) {
        var html = '';
        for (var i = 0; i < questionsGame.length; i++) {
            var linkImage = '';
            if (questionsGame[i].url.indexOf('http') != 0 ) {
                linkImage = '<a href="' + questionsGame[i].url + '" class="js-hidden identifica-LinkImages">' + i + '</a>';
            }
            html += linkImage;
        }
        return html;
    },
    createlinksAudio: function (questionsGame) {
        var html = '';
        for (var i = 0; i < questionsGame.length; i++) {
            var linkaudio = '';
            if (questionsGame[i].audio.indexOf('http') != 0 && questionsGame[i].audio.length > 4) {
                linkaudio = '<a href="' + questionsGame[i].audio + '" class="js-hidden identifica-LinkAudios">' + i + '</a>';
            }
            html += linkaudio;
        }

        return html;
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
        link.download = _("Game") + "Identifica.json";
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
        } else if (game.typeGame !== 'Identifica') {
            $exeDevice.showMessage($exeDevice.msgs.msgESelectFile);
            return;
        }
        if ($exeDevice.questionsGame.length > 1) {
            game.questionsGame = $exeDevice.importIdentifica(game)
        }
        $exeDevice.active = 0;
        $exeDevice.questionsGame = game.questionsGame;
        for (var i = 0; i < $exeDevice.questionsGame.length; i++) {
            var numOpt = 0,
                clues = $exeDevice.questionsGame[i].clues;
            for (var j = 0; j < clues.length; j++) {
                if (clues[j].trim().length == 0) {
                    $exeDevice.questionsGame[i].numberClues = numOpt;
                    break;
                }
                numOpt++;
            }
        }
        $exeDevice.updateFieldGame(game);
        var instructions = game.instructionsExe || game.instructions,
            tAfter = game.textAfter || "",
            textFeedBack = game.textFeedBack || "";
            if (tinyMCE.get('eXeGameInstructions')) {
                tinyMCE.get('eXeGameInstructions').setContent(unescape(instructions));
            } else {
                $("#eXeGameInstructions").val(unescape(instructions));
            }

            if (tinyMCE.get('idfEFeedBackEditor')) {
                tinyMCE.get('idfEFeedBackEditor').setContent(unescape(textFeedBack));
            } else {
                $("#idfEFeedBackEditor").val(unescape(textFeedBack))
            }
            if (tinyMCE.get('eXeIdeviceTextAfter')) {
                tinyMCE.get('eXeIdeviceTextAfter').setContent(unescape(tAfter));
            } else {
                $("#eXeIdeviceTextAfter").val(unescape(tAfter))
            }
        $('.exe-form-tabs li:first-child a').click();
    },
    importIdentifica: function (game) {
        var questionsGame = $exeDevice.questionsGame;
        for (var i = 0; i < game.questionsGame.length; i++) {
            var p = game.questionsGame[i];
            p.time = typeof p.time == 'undefined' ? 1 : p.time;
            p.audio = typeof p.audio == "undefined" ? "" : p.audio;
            p.hit = typeof p.hit == "undefined" ? -1 : p.hit;
            p.error = typeof p.error == "undefined" ? -1 : p.error;
            p.msgHit = typeof p.msgHit == "undefined" ? "" : p.msgHit;
            p.msgError = typeof p.msgError == "undefined" ? "" : p.msgError;
            questionsGame.push(p);
        }
        return questionsGame;
    },
    validateData: function () {
        var clear = $exeDevice.removeTags,
            instructions = $('#eXeGameInstructions').text(),
            instructionsExe = escape(tinyMCE.get('eXeGameInstructions').getContent()),
            textAfter = escape(tinyMCE.get('eXeIdeviceTextAfter').getContent()),
            textFeedBack = escape(tinyMCE.get('idfEFeedBackEditor').getContent()),
            showMinimize = $('#idfEShowMinimize').is(':checked'),
            avancedMode=  $('#idfESAvancedMode').is(':checked');
            questionsRamdon = $('#idfEQuestionRamdon').is(':checked'),
            showSolution = $('#idfEShowSolution').is(':checked'),
            timeShowSolution = parseInt(clear($('#idfETimeShowSolution').val())),
            itinerary = $exeAuthoring.iDevice.gamification.itinerary.getValues(),
            feedBack = $('#idfEHasFeedBack').is(':checked'),
            percentajeFB = parseInt(clear($('#idfEPercentajeFB').val())),
            customMessages = $('#idfECustomMessages').is(':checked'),
            percentajeQuestions=parseInt(clear($('#idfEPercentajeQuestions').val()));
        if (!itinerary) return false;
        if (feedBack && textFeedBack.trim().length == 0) {
            eXe.app.alert($exeDevice.msgs.msgProvideFB);
            return false;
        }
        if (showSolution && timeShowSolution.length == 0) {
            $exeDevice.showMessage($exeDevice.msgs.msgEProvideTimeSolution);
            return false;
        }
        var questionsGame = $exeDevice.questionsGame;
        for (var i = 0; i < questionsGame.length; i++) {
            var mquestion = questionsGame[i]
            if (mquestion.solution.length == 0) {
                $exeDevice.showMessage($exeDevice.msgs.msgIndicateSolution);
                return false;
            } 
            var completAnswer = true;
            for (var j = 0; j < mquestion.numberClues; j++) {
                if (mquestion.clues[j].length == 0) {
                    completAnswer = false;
                }
            }
            if (!completAnswer) {
                $exeDevice.showMessage($exeDevice.msgs.msgECompleteAllClues);
                return false;
            }
        }

        var scorm = $exeAuthoring.iDevice.gamification.scorm.getValues();
        var data = {
            'asignatura': '',
            "author": '',
            'typeGame': 'Identifica',
            'instructionsExe': instructionsExe,
            'instructions': instructions,
            'showMinimize': showMinimize,
            'questionsRamdon': questionsRamdon,
            'showSolution': showSolution,
            'timeShowSolution': timeShowSolution,
            'itinerary': itinerary,
            'questionsGame': questionsGame,
            'isScorm': scorm.isScorm,
            'textButtonScorm': scorm.textButtonScorm,
            'repeatActivity': scorm.repeatActivity,
            'title': '',
            'textAfter': textAfter,
            'textFeedBack': textFeedBack,
            'feedBack': feedBack,
            'percentajeFB': percentajeFB,
            'version': $exeDevice.version,
            'customMessages': customMessages,
            'percentajeQuestions':percentajeQuestions,
            'avancedMode': avancedMode
        }
        return data;
    },
    removeTags: function (str) {
        var wrapper = $("<div></div>");
        wrapper.html(str);
        return wrapper.text();
    },
    addEvents: function () {
        $('#idfEPaste').hide();
        $('#idfEAuthorAlt').hide();
        $('#idfEShowMore').on('click', function (e) {
            e.preventDefault();
            $('#idfEAuthorAlt').slideToggle();
        });
        $('#idfShowCodeAccess').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#idfCodeAccess').prop('disabled', !marcado);
            $('#idfMessageCodeAccess').prop('disabled', !marcado);
        });


        $('#idfEAdd').on('click', function (e) {
            e.preventDefault();
            $exeDevice.addQuestion()
        });
        $('#idfEFirst').on('click', function (e) {
            e.preventDefault();
            $exeDevice.firstQuestion()
        });
        $('#idfEPrevious').on('click', function (e) {
            e.preventDefault();
            $exeDevice.previousQuestion()
        });
        $('#idfENext').on('click', function (e) {
            e.preventDefault();
            $exeDevice.nextQuestion()
        });
        $('#idfELast').on('click', function (e) {
            e.preventDefault();
            $exeDevice.lastQuestion()
        });
        $('#idfEDelete').on('click', function (e) {
            e.preventDefault();
            $exeDevice.removeQuestion()
        });
        $('#idfECopy').on('click', function (e) {
            e.preventDefault();
            $exeDevice.copyQuestion()
        });
        $('#idfECut').on('click', function (e) {
            e.preventDefault();
            $exeDevice.cutQuestion()
        });
        $('#idfEPaste').on('click', function (e) {
            e.preventDefault();
            $exeDevice.pasteQuestion()
        });

        $('#gameQEIdeviceForm').on('dblclick', '#idfEImage', function () {
            $('#idfECursor').hide();
            $('#idfEXImage').val(0);
            $('#idfEYImage').val(0);
        });

        $('#idfEAttemptsNumber').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 1);
            this.value = v;
        });
        $('#idfEAttemptsNumber').on('focusout', function () {
            this.value = this.value.trim() == '' ? 3 : this.value;
            this.value = this.value > 9 ? 9 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
        });

        $('#idfECluesNumber').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 1);
            this.value = v;
        });
        $('#idfECluesNumber').on('focusout', function () {
            this.value = this.value.trim() == '' ? 4 : this.value;
            this.value = this.value > 8 ? 8 : this.value;
            this.value = this.value < 2 ? 2 : this.value;
        });

        $('#idfECluesNumber').on('change', function () {
            var num=parseInt(this.value)
            if(!isNaN(num) && (num>1 && num<9) ){
                $exeDevice.showClues(num)
            }
        });



        $('#idfETimeShowSolution').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 1);
            this.value = v;
        });

        $('#idfETimeShowSolution').on('focusout', function () {
            this.value = this.value.trim() == '' ? 3 : this.value;
            this.value = this.value > 9 ? 9 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
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
        $('#idfEShowSolution').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#idfETimeShowSolution').prop('disabled', !marcado);
        });
        $('#idfEURLImage').on('change', function () {
            var validExt = ['jpg', 'png', 'gif', 'jpeg', 'svg'],
                selectedFile = $(this).val(),
                ext = selectedFile.split('.').pop().toLowerCase();
            if ((selectedFile.indexOf('resources') == 0 || selectedFile.indexOf('/previews/') == 0) && validExt.indexOf(ext) == -1) {
                $exeDevice.showMessage(_("Supported formats") + ": jpg, jpeg, gif, png, svg");
                return false;
            }
            var url = selectedFile,
                alt = $('#idfEAlt').val(),
                x = parseFloat($('#idfEXImage').val()),
                y = parseFloat($('#idfEYImage').val());
            $exeDevice.showImage(url, x, y, alt);
        });

        $('#idfEPlayImage').on('click', function (e) {
            e.preventDefault();
            var validExt = ['jpg', 'png', 'gif', 'jpeg', 'svg'],
                selectedFile = $('#idfEURLImage').val(),
                ext = selectedFile.split('.').pop().toLowerCase();
            if ((selectedFile.indexOf('resources') == 0 || selectedFile.indexOf('/previews/') == 0) && validExt.indexOf(ext) == -1) {
                $exeDevice.showMessage(_("Supported formats") + ": jpg, jpeg, gif, png, svg");
                return false;
            }
            var url = selectedFile,
                alt = $('#idfEAlt').val(),
                x = parseFloat($('#idfEXImage').val()),
                y = parseFloat($('#idfEYImage').val());
            $exeDevice.showImage(url, x, y, alt);
        });
        $('#idfEImage').on('click', function (e) {
            $exeDevice.clickImage(this, e.pageX, e.pageY);
        });

        $('#idfECursor').on('click', function (e) {
            $(this).hide();
            $('#idfEXImage').val(0);
            $('#idfEYImage').val(0);
        });
        $('#idfEPlayAudio').on('click', function (e) {
            e.preventDefault();
            var selectedFile = $('#idfEURLAudio').val().trim();
            if (selectedFile.length > 4) {
                $exeDevice.stopSound();
                $exeDevice.playSound(selectedFile);
            }
        });

        $('#idfEURLAudio').on('change', function () {
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
        $('#idfEHasFeedBack').on('change', function () {
            var marcado = $(this).is(':checked');
            if (marcado) {
                $('#idfEFeedbackP').slideDown();
            } else {
                $('#idfEFeedbackP').slideUp();
            }
            $('#idfEPercentajeFB').prop('disabled', !marcado);
        });

        $('#idfECustomMessages').on('change', function () {
            var messages = $(this).is(':checked');
            $exeDevice.showSelectOrder(messages);
        });
        $('#idfEPercentajeQuestions').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 3);
            this.value = v;
            if(this.value>0 && this.value<101){
                $exeDevice.updateQuestionsNumber();
            }
        });
        $('#idfEPercentajeQuestions').on('click', function () {
            $exeDevice.updateQuestionsNumber();
        });
        $('#idfEPercentajeQuestions').on('focusout', function () {
            this.value = this.value.trim() == '' ? 100 : this.value;
            this.value = this.value > 100 ? 100 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
            $exeDevice.updateQuestionsNumber();
        });
        $('#idfENumberQuestion').keyup(function (e) {
            if (e.keyCode == 13) {
                var num = parseInt($(this).val());
                if (!isNaN(num) && num > 0) {
                    if ($exeDevice.validateQuestion() != false) {
                        $exeDevice.active= num < $exeDevice.questionsGame.length ? num-1 : $exeDevice.questionsGame.length-1;
                        $exeDevice.showQuestion($exeDevice.active);

                    }else{
                        $(this).val($exeDevice.active+1)
                    }
                }else{
                    $(this).val($exeDevice.active+1)
                }
            }
        });
        $exeAuthoring.iDevice.gamification.itinerary.addEvents();

    },
    clickImage: function (img, epx, epy) {
        var $cursor = $('#idfECursor'),
            $x = $('#idfEXImage'),
            $y = $('#idfEYImage'),
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
    drawImage: function (image, mData) {
        $(image).css({
            'left': mData.x + 'px',
            'top': mData.y + 'px',
            'width': mData.w + 'px',
            'height': mData.h + 'px'
        });
    },
    validateScoreQuestion: function (text) {
        var isValid = text.length > 0 && text !== '.' && text !== ',' && /^-?\d*[.,]?\d*$/.test(text);
        return isValid;
    },
    extractURLGD: function (urlmedia) {
        var sUrl = urlmedia;
        if (typeof urlmedia != "undefined" && urlmedia.length>0 && urlmedia.toLowerCase().indexOf("https://drive.google.com") == 0 && urlmedia.toLowerCase().indexOf("sharing") != -1) {
            sUrl = sUrl.replace(/https:\/\/drive\.google\.com\/file\/d\/(.*?)\/.*?\?usp=sharing/g, "https://docs.google.com/uc?export=open&id=$1");
        }
        return sUrl;
    }
}