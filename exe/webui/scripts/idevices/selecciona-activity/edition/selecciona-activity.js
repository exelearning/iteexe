/**
 * Select Activity iDevice (edition code)
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Manuel Narváez Martínez
 * Graphic design: Ana María Zamora Moreno, Francisco Javier Pulido
 * Testers: Ricardo Málaga Floriano, Francisco Muñoz de la Peña
 * Translator: Antonio Juan Delgado García
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 * Versión: 3.1
 */
var $exeDevice = {
    // i18n
    i18n: {
        name: _('Select Activity'),
        alt: _('Multiple Choice Quiz')
    },
    iDevicePath: "/scripts/idevices/selecciona-activity/edition/",
    msgs: {},
    active: 0,
    selectsGame: [],
    youtubeLoaded: false,
    player: '',
    playerIntro: '',
    timeUpdateInterval: '',
    timeUpdateVIInterval: '',
    timeVideoFocus: 0,
    timeVIFocus: true,
    typeEdit: -1,
    numberCutCuestion: -1,
    clipBoard: '',
    activeSilent: false,
    silentVideo: 0,
    tSilentVideo: 0,
    endSilent: 0,
    isVideoType: false,
    isVideoIntro: 0,
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
        "msgAllQuestions": _("Questions completed!"),
        "msgSuccesses": _("Right! | Excellent! | Great! | Very good! | Perfect!"),
        "msgFailures": _("It was not that! | Incorrect! | Not correct! | Sorry! | Error!"),
        "msgNotNetwork": _("You can only play this game with internet connection."),
        "msgEndGameScore": _("Please start the game before saving your score."),
        "msgScoreScorm": _("The score can't be saved because this page is not part of a SCORM package."),
        "msgQuestion": _("Question"),
        "msgAnswer": _("Check"),
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
        "msgTryAgain": _("You need at least %s&percnt; of correct answers to get the information. Please try again."),
        "msgVideoIntro": _("Video Intro"),
        "msgClose": _("Close"),
        "msgOption": _("Option"),
        "msgRickText": _("Rich Text"),
        "msgUseFulInformation": _("and information that will be very useful"),
        "msgLoading": _("Loading. Please wait..."),
        "msgOrders": _("Please order the answers"),
        "msgIndicateWord": _("Provide a word or phrase"),
        "msgMoveOne": _("Move on"),
        "msgPoints": _("points"),
        "msgEndGameScore": _("Please start playing first..."),
        "msgAudio": _("Audio"),
        "msgCorrect": _("Correct"),
		"msgIncorrect": _("Incorrect")
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
        msgs.msgEProvideDefinition = _("Please provide the word definition or the valid URL of an image");
        msgs.msgESelectFile = _("The selected file does not contain a valid game");
        msgs.msgEURLValid = _("You must upload or indicate the valid URL of an image");
        msgs.msgEProvideWord = _("Please provide one word or phrase");
        msgs.msgStartWith = _("Starts with %1");
        msgs.msgContaint = _("Contains letter %1");
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
        msgs.msgProvideSolution = _("Please write the solution");
        msgs.msgEDefintion = _("Please provide the word definition");
        msgs.msgProvideFB = _('Message to display when passing the game');
        msgs.msgNotHitCuestion = _('The question marked as next in case of success does not exist.');
        msgs.msgNotErrorCuestion = _('The question marked as next in case of error does not exist.');
        msgs.msgNoSuportBrowser = _("Your browser is not compatible with this tool.");

    },
    loadYoutubeApi: function () {
        onYouTubeIframeAPIReady = $exeDevice.youTubeReady;
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        tag.async = true;
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    },

    youTubeReady: function () {
        $exeDevice.player = new YT.Player('seleccionaEVideo', {
            width: '100%',
            height: '100%',
            videoId: '',
            playerVars: {
                'color': 'white',
                'autoplay': 1,
                'controls': 1
            },
            events: {
                'onReady': $exeDevice.onPlayerReady,
                'onError': $exeDevice.onPlayerError
            }
        });
        $exeDevice.playerIntro = new YT.Player('seleccionaEVI', {
            width: '100%',
            height: '100%',
            videoId: '',
            playerVars: {
                'color': 'white',
                'autoplay': 0,
                'controls': 1
            },
            events: {
                'onReady': $exeDevice.onPlayerReady,
                'onError': $exeDevice.onPlayerError
            }

        });
    },

    onPlayerReady: function (event) {
        if ($exeDevice.isVideoType) {
            $exeDevice.showVideoQuestion();
        } else if ($exeDevice.isVideoIntro == 1) {
            $('#seleccionaEVideoIntroPlay').click();
            var idv = $exeDevice.getIDYoutube($('#seleccionaEVideoIntro').val()),
                iVI = $exeDevice.hourToSeconds($('#seleccionaEVIStart').val()),
                fVI = $exeDevice.hourToSeconds($('#seleccionaEVIEnd').val()) > 0 ? $exeDevice.hourToSeconds($('#seleccionaEVIEnd').val()) : 9000;
            if (fVI <= iVI) {
                $exeDevice.showMessage($exeDevice.msgs.msgEStartEndIncorrect);
                return;
            }
            $('#seleccionaEVIURL').val($('#seleccionaEVideoIntro').val());
            $('#seleccionaEVIDiv').show();
            $('#seleccionaEVI').show();
            $('#seleccionaEVINo').hide();
            $('#seleccionaENumQuestionDiv').hide();
            $exeDevice.startVideoIntro(idv, iVI, fVI);
        } else if ($exeDevice.isVideoIntro == 2) {
            var idv = $exeDevice.getIDYoutube($('#seleccionaEVIURL').val()),
                iVI = $exeDevice.hourToSeconds($('#seleccionaEVIStart').val()),
                fVI = $exeDevice.hourToSeconds($('#seleccionaEVIEnd').val()) > 0 ? $exeDevice.hourToSeconds($('#seleccionaEVIEnd').val()) : 9000;
            if (fVI <= iVI) {
                $exeDevice.showMessage($exeDevice.msgs.msgEStartEndIncorrect);
                return;
            }
            $exeDevice.startVideoIntro(idv, iVI, fVI);
        }
    },

    updateSoundVideo: function () {
        if ($exeDevice.activeSilent) {
            if ($exeDevice.player && typeof $exeDevice.player.getCurrentTime === "function") {
                var time = Math.round($exeDevice.player.getCurrentTime());
                if (time == $exeDevice.silentVideo) {
                    $exeDevice.player.mute();
                } else if (time == $exeDevice.endSilent) {
                    $exeDevice.player.unMute();
                }
            }
        }
    },

    updateTimerDisplay: function () {
        if ($exeDevice.player) {
            if (typeof $exeDevice.player.getCurrentTime === "function") {
                var time = $exeDevice.secondsToHour($exeDevice.player.getCurrentTime());
                $('#seleccionaEVideoTime').text(time);
                $exeDevice.updateSoundVideo();
            }
        }
    },

    updateTimerVIDisplay: function () {
        if ($exeDevice.playerIntro) {
            if (typeof $exeDevice.playerIntro.getCurrentTime === "function") {
                var time = $exeDevice.secondsToHour($exeDevice.playerIntro.getCurrentTime());
                $('#seleccionaEVITime').text(time);
            }
        }
    },

    updateProgressBar: function () {
        $('#progress-bar').val((player.getCurrentTime() / player.getDuration()) * 100);
    },

    onPlayerError: function (event) {
        //$exeDevice.showMessage("El video seleccionado no está disponible")
    },

    startVideo: function (id, start, end) {
        var mstart = start < 1 ? 0.1 : start;
        if ($exeDevice.player) {
            if (typeof $exeDevice.player.loadVideoById === "function") {
                $exeDevice.player.loadVideoById({
                    'videoId': id,
                    'startSeconds': mstart,
                    'endSeconds': end
                });
            }
            clearInterval($exeDevice.timeUpdateInterval);
            $exeDevice.timeUpdateInterval = setInterval(function () {
                $exeDevice.updateTimerDisplay();
            }, 1000);
        }

    },

    startVideoIntro: function (id, start, end) {
        var mstart = start < 1 ? 0.1 : start;
        if ($exeDevice.playerIntro) {
            if (typeof $exeDevice.playerIntro.loadVideoById === "function") {
                $exeDevice.playerIntro.loadVideoById({
                    'videoId': id,
                    'startSeconds': mstart,
                    'endSeconds': end
                });
            }

            clearInterval($exeDevice.timeUpdateVIInterval);
            $exeDevice.timeUpdateVIInterval = setInterval(function () {
                $exeDevice.updateTimerVIDisplay();
            }, 1000);

        }
    },

    stopVideoIntro: function () {
        if ($exeDevice.playerIntro) {
            if (typeof $exeDevice.playerIntro.pauseVideo === "function") {
                $exeDevice.playerIntro.pauseVideo();
            }
            clearInterval($exeDevice.timeUpdateInterval);
        }
    },

    playVideo: function () {
        if ($exeDevice.player) {
            clearInterval($exeDevice.timeUpdateInterval);
            if (typeof $exeDevice.player.playVideo === "function") {
                $exeDevice.player.playVideo();
            }
            $exeDevice.timeUpdateInterval = setInterval(function () {
                $exeDevice.updateTimerDisplay();
            }, 1000);
        }
    },

    stopVideo: function () {
        if ($exeDevice.player) {
            clearInterval($exeDevice.timeUpdateInterval);
            if (typeof $exeDevice.player.pauseVideo === "function") {
                $exeDevice.player.pauseVideo();
            }
        }
    },

    muteVideo: function (mute) {
        if ($exeDevice.player) {
            if (mute) {
                if (typeof $exeDevice.player.mute === "function") {
                    $exeDevice.player.mute();
                }
            } else {
                if (typeof $exeDevice.player.unMute === "function") {
                    $exeDevice.player.unMute();
                }
            }
        }
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
            $exeDevice.selectsGame.push($exeDevice.getCuestionDefault());
            $exeDevice.active = $exeDevice.selectsGame.length - 1;
            $exeDevice.typeEdit = -1;
            $('#seleccionaEPaste').hide();
            $('#seleccionaENumQuestions').text($exeDevice.selectsGame.length);
            $('#seleccionaENumberQuestion').val($exeDevice.selectsGame.length);
            $exeDevice.updateSelectOrder();
        }
    },

    removeQuestion: function () {
        if ($exeDevice.selectsGame.length < 2) {
            $exeDevice.showMessage($exeDevice.msgs.msgEOneQuestion);
            return;
        } else {
            $exeDevice.selectsGame.splice($exeDevice.active, 1);
            if ($exeDevice.active >= $exeDevice.selectsGame.length - 1) {
                $exeDevice.active = $exeDevice.selectsGame.length - 1;
            }
            $exeDevice.showQuestion($exeDevice.active);
            $exeDevice.typeEdit = -1;
            $('#seleccionaEPaste').hide();
            $('#seleccionaENumQuestions').text($exeDevice.selectsGame.length);
            $('#seleccionaENumberQuestion').val($exeDevice.active + 1);
            $exeDevice.updateSelectOrder();
        }
    },

    copyQuestion: function () {
        if ($exeDevice.validateQuestion() != false) {
            $exeDevice.typeEdit = 0;
            $exeDevice.clipBoard = $exeDevice.selectsGame[$exeDevice.active];
            $('#seleccionaEPaste').show();

        }
    },

    cutQuestion: function () {
        if ($exeDevice.validateQuestion() != false) {
            $exeDevice.numberCutCuestion = $exeDevice.active;
            $exeDevice.typeEdit = 1;
            $('#seleccionaEPaste').show();
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
            $exeDevice.selectsGame.splice($exeDevice.active, 0, $exeDevice.clipBoard);
            $exeDevice.showQuestion($exeDevice.active);
        } else if ($exeDevice.typeEdit == 1) {
            $('#seleccionaEPaste').hide();
            $exeDevice.typeEdit = -1;
            $exeDevice.arrayMove($exeDevice.selectsGame, $exeDevice.numberCutCuestion, $exeDevice.active);
            $exeDevice.showQuestion($exeDevice.active);
            $('#seleccionaENumQuestions').text($exeDevice.selectsGame.length);
        }
        $exeDevice.updateSelectOrder();
    },

    nextQuestion: function () {

        if ($exeDevice.validateQuestion() != false) {
            if ($exeDevice.active < $exeDevice.selectsGame.length - 1) {
                $exeDevice.active++;
                $exeDevice.showQuestion($exeDevice.active);
            }
        }
    },

    lastQuestion: function () {
        if ($exeDevice.validateQuestion() != false) {
            if ($exeDevice.active < $exeDevice.selectsGame.length - 1) {
                $exeDevice.active = $exeDevice.selectsGame.length - 1;
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
    updateSelectOrder: function () {

        $('#seleccionaGotoCorrect').find('option').remove();
        $('#seleccionaGotoCorrect').append($('<option>', {
            value: -2,
            text: _('End')
        }));
        $('#seleccionaGotoCorrect').append($('<option>', {
            value: -1,
            text: _('Next')
        }));
        for (var j = 0; j < $exeDevice.selectsGame.length; j++) {
            $('#seleccionaGotoCorrect').append($('<option>', {
                value: j,
                text: '' + (j + 1)
            }));
        }
        $('#seleccionaGotoCorrect').val($exeDevice.selectsGame[$exeDevice.active].hit);

        $('#seleccionaGotoIncorrect').find('option').remove();
        $('#seleccionaGotoIncorrect').append($('<option>', {
            value: -2,
            text: _('End')
        }));
        $('#seleccionaGotoIncorrect').append($('<option>', {
            value: -1,
            text: _('Next')
        }));
        for (var i = 0; i < $exeDevice.selectsGame.length; i++) {
            $('#seleccionaGotoIncorrect').append($('<option>', {
                value: i,
                text: '' + (i + 1)
            }));
        }
        $('#seleccionaGotoIncorrect').val($exeDevice.selectsGame[$exeDevice.active].error);
        $exeDevice.updateQuestionsNumber();

    },
    updateQuestionsNumber: function () {
        var percentaje = parseInt($exeDevice.removeTags($('#seleccionaEPercentajeQuestions').val()));
        if (isNaN(percentaje)) {
            return;
        }
        percentaje = percentaje < 1 ? 1 : percentaje;
        percentaje = percentaje > 100 ? 100 : percentaje;
        var num = Math.round((percentaje * $exeDevice.selectsGame.length) / 100);
        num = num == 0 ? 1 : num;
        $('#seleccionaENumeroPercentaje').text(num + "/" + $exeDevice.selectsGame.length);
    },
    showQuestion: function (i) {
        $exeDevice.clearQuestion();
        var num = i < 0 ? 0 : i;
        num = num >= $exeDevice.selectsGame.length ? $exeDevice.selectsGame.length - 1 : num;
        var p = $exeDevice.selectsGame[num],
            numOptions = 0;
        if (p.typeSelect != 2) {
            $('.gameQE-EAnwersOptions').each(function (j) {
                numOptions++;
                if (p.options[j].trim() !== '') {
                    p.numOptions = numOptions;
                }
                $(this).val(p.options[j]);
            });
        } else {
            $('#seleccionaESolutionWord').val(p.solutionQuestion);
            $('#seleccionaPercentageShow').val(p.percentageShow);
            $('#seleccionaEDefinitionWord').val(p.quextion);
        }
        $exeDevice.stopVideo();
        $exeDevice.showTypeQuestion(p.typeSelect);
        $exeDevice.changeTypeQuestion(p.type);
        $exeDevice.showOptions(p.numberOptions);
        $('#seleccionaEQuestion').val(p.quextion);
        $('#seleccionaENumQuestions').text($exeDevice.selectsGame.length);
        if (p.type == 1) {
            $('#seleccionaEURLImage').val(p.url);
            $('#seleccionaEXImage').val(p.x);
            $('#seleccionaEYImage').val(p.y);
            $('#seleccionaEAuthor').val(p.author);
            $('#seleccionaEAlt').val(p.alt);
            $exeDevice.showImage(p.url, p.x, p.y, p.alt);
        } else if (p.type == 2) {
            $('#seleccionaECheckSoundVideo').prop('checked', p.soundVideo == 1);
            $('#seleccionaECheckImageVideo').prop('checked', p.imageVideo == 1);
            $('#seleccionaEURLYoutube').val(p.url);
            $('#seleccionaEInitVideo').val($exeDevice.secondsToHour(p.iVideo));
            $('#seleccionaEEndVideo').val($exeDevice.secondsToHour(p.fVideo));
            $('#seleccionaESilenceVideo').val($exeDevice.secondsToHour(p.silentVideo));
            $('#seleccionaETimeSilence').val(p.tSilentVideo);
            $exeDevice.silentVideo = p.silentVideo;
            $exeDevice.tSilentVideo = p.tSilentVideo;
            $exeDevice.activeSilent = (p.soundVideo == 1) && (p.tSilentVideo > 0) && (p.silentVideo >= p.iVideo) && (p.iVideo < p.fVideo);
            $exeDevice.endSilent = p.silentVideo + p.tSilentVideo;
            if (typeof YT == "undefined") {
                $exeDevice.isVideoType = true;
                $exeDevice.loadYoutubeApi();
            } else {
                $exeDevice.showVideoQuestion();
            }

        } else if (p.type == 3) {
            tinyMCE.get('seleccionaEText').setContent(unescape(p.eText));
        }

        $('.gameQE-EAnwersOptions').each(function (j) {
            var option = j < p.numOptions ? p.options[j] : '';
            $(this).val(option);
        });
        p.audio = p.audio && p.audio != "undefined" ? p.audio : "";
        $exeDevice.stopSound();
        if (p.type != 2 && p.audio.trim().length > 4) {
            $exeDevice.playSound(p.audio.trim());
        }
        $('#seleccionaEURLAudio').val(p.audio);
        $('#seleccionaGotoCorrect').val(p.hit);
        $('#seleccionaGotoIncorrect').val(p.error);
        $('#seleccionaEMessageOK').val(p.msgHit);
        $('#seleccionaEMessageKO').val(p.msgError);
        $('#seleccionaENumberQuestion').val(i + 1);
        $('#seleccionaEScoreQuestion').val(1);
        if (typeof (p.customScore) != "undefined") {
            $('#seleccionaEScoreQuestion').val(p.customScore);
        }
        $("input.gameQE-Number[name='slcnumber'][value='" + p.numberOptions + "']").prop("checked", true)
        $("input.gameQE-Type[name='slcmediatype'][value='" + p.type + "']").prop("checked", true);
        $exeDevice.checkQuestions(p.solution);
        $("input.gameQE-Times[name='slctime'][value='" + p.time + "']").prop("checked", true);
        $("input.gameQE-TypeSelect[name='slctypeselect'][value='" + p.typeSelect + "']").prop("checked", true);
    },
    checkQuestions: function (solution) {
        $("input.gameQE-ESolution[name='slcsolution']").prop("checked", false);
        for (var i = 0; i < solution.length; i++) {
            var sol = solution[i];
            $("input.gameQE-ESolution[name='slcsolution'][value='" + sol + "']").prop("checked", true);
        }
        $('#selecionaESolutionSelect').text(solution);

    },
    showVideoYoutube: function (quextion) {
        var id = $exeDevice.getIDYoutube(quextion.url);
        $('#seleccionaEImageVideo').hide();
        $('#seleccionaENoVideo').hide();
        $('#seleccionaEVideo').hide();
        if (id) {
            $exeDevice.startVideo(id, quextion.iVideo, quextion.fVideo);
            $('#seleccionaEVideo').show();
            if (quextion.imageVideo == 0) {
                $('#seleccionaEImageVideo').show();
            }
            if (quextion.soundVideo == 0) {
                $('#seleccionaEImageVideo').show();
                $exeDevice.muteVideo(true)
            } else {
                $exeDevice.muteVideo(false)
            }
        } else {
            $exeDevice.showMessage($exeDevice.msgs.msgEUnavailableVideo);
            $('#seleccionaENoVideo').show();
        }
    },
    showVideoQuestion: function () {
        var soundVideo = $('#seleccionaECheckSoundVideo').is(':checked') ? 1 : 0,
            imageVideo = $('#seleccionaECheckImageVideo').is(':checked') ? 1 : 0,
            iVideo = $exeDevice.hourToSeconds($('#seleccionaEInitVideo').val()),
            fVideo = $exeDevice.hourToSeconds($('#seleccionaEEndVideo').val()),
            url = $('#seleccionaEURLYoutube').val().trim(),
            id = $exeDevice.getIDYoutube(url);
        $exeDevice.silentVideo = $exeDevice.hourToSeconds($('#seleccionaESilenceVideo').val().trim());
        $exeDevice.tSilentVideo = parseInt($('#seleccionaETimeSilence').val());
        $exeDevice.activeSilent = (soundVideo == 1) && ($exeDevice.tSilentVideo > 0) && ($exeDevice.silentVideo >= iVideo) && (iVideo < fVideo);
        $exeDevice.endSilent = $exeDevice.silentVideo + $exeDevice.tSilentVideo;
        if (fVideo <= iVideo) fVideo = 36000;
        $('#seleccionaENoImageVideo').hide();
        $('#seleccionaENoVideo').show();
        $('#seleccionaEVideo').hide();
        if (id) {
            $exeDevice.startVideo(id, iVideo, fVideo);
            $('#seleccionaEVideo').show();
            $('#seleccionaENoVideo').hide();
            if (imageVideo == 0) {
                $('#seleccionaEVideo').hide();
                $('#seleccionaENoImageVideo').show();
            }
            if (soundVideo == 0) {
                $exeDevice.muteVideo(true)
            } else {
                $exeDevice.muteVideo(false)
            }
        } else {
            $exeDevice.showMessage($exeDevice.msgs.msgEUnavailableVideo);
            $('#seleccionaENoVideo').show();
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

    showImage: function (url, x, y, alt, type) {
        var $image = $('#seleccionaEImage'),
            $cursor = $('#seleccionaECursor');
        $image.hide();
        $cursor.hide();
        $image.attr('alt', alt);
        $('#seleccionaENoImage').show();
        url = $exeDevice.extractURLGD(url);
        $image.prop('src', url)
            .on('load', function () {
                if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                    if (type == 1) {
                        $exeDevice.showMessage($exeDevice.msgs.msgEURLValid);
                    }
                    return false;
                } else {
                    var mData = $exeDevice.placeImageWindows(this, this.naturalWidth, this.naturalHeight);
                    $exeDevice.drawImage(this, mData);
                    $image.show();
                    $('#seleccionaENoImage').hide();
                    $exeDevice.paintMouse(this, $cursor, x, y);
                    return true;
                }
            }).on('error', function () {
                if (type == 1) {
                    $exeDevice.showMessage($exeDevice.msgs.msgEURLValid);
                }
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
        $exeDevice.changeTypeQuestion(0);
        $exeDevice.showOptions(4);
        $exeDevice.showSolution('');
        $('.gameQE-Type')[0].checked = true;
        $('.gameQE-Times')[0].checked = true;
        $('.gameQE-Number')[2].checked = true;
        $('#seleccionaEURLImage').val('');
        $('#seleccionaEXImage').val('0');
        $('#seleccionaEYImage').val('0');
        $('#seleccionaEAuthor').val('');
        $('#seleccionaEAlt').val('');
        $('#seleccionaEURLAudio').val('');
        $('#seleccionaEURLYoutube').val('');
        $('#seleccionaEInitVideo').val('00:00:00');
        $('#seleccionaEEndVideo').val('00:00:00');
        $('#seleccionaECheckSoundVideo').prop('checked', true);
        $('#seleccionaECheckImageVideo').prop('checked', true);
        $("input.gameQE-ESolution[name='slcsolution']").prop("checked", false);
        $('#selecionaESolutionSelect').text('');
        tinyMCE.get('seleccionaEText').setContent('');
        $('#seleccionaEQuestion').val('');
        $('#seleccionaESolutionWord').val('');
        $('#seleccionaEDefinitionWord').val('');
        $('.gameQE-EAnwersOptions').each(function () {
            $(this).val('');
        });
        $('#seleccionaEMessageOK').val('');
        $('#seleccionaEMessageKO').val('');
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
    changeTypeQuestion: function (type) {

        $('#seleccionaETitleAltImage').hide();
        $('#seleccionaEAuthorAlt').hide();
        $('#seleccionaETitleImage').hide();
        $('#seleccionaEInputImage').hide();
        $('#seleccionaETitleVideo').hide();
        $('#seleccionaEInputVideo').hide();
        $('#seleccionaEInputAudio').show();
        $('#seleccionaETitleAudio').show();
        $('#seleccionaEInputOptionsVideo').hide();
        $('#seleccionaInputOptionsImage').hide();
        if (tinyMCE.get('seleccionaEText')) {
            tinyMCE.get('seleccionaEText').hide();
        }

        $('#seleccionaEText').hide();
        $('#seleccionaEVideo').hide();
        $('#seleccionaEImage').hide();
        $('#seleccionaENoImage').hide();
        $('#seleccionaECover').hide();
        $('#seleccionaECursor').hide();
        $('#seleccionaENoImageVideo').hide();
        $('#seleccionaENoVideo').hide();
        switch (type) {
            case 0:
                $('#seleccionaECover').show();
                break;
            case 1:
                $('#seleccionaENoImage').show();
                $('#seleccionaETitleImage').show();
                $('#seleccionaEInputImage').show();
                $('#seleccionaEAuthorAlt').show();
                $('#seleccionaECursor').show();
                $('#seleccionaInputOptionsImage').show();
                $exeDevice.showImage($('#seleccionaEURLImage').val(), $('#seleccionaEXImage').val(), $('#seleccionaEYImage').val(), $('#seleccionaEAlt').val(), 0)
                break;
            case 2:
                $('#seleccionaEImageVideo').show();
                $('#seleccionaETitleVideo').show();
                $('#seleccionaEInputVideo').show();
                $('#seleccionaENoVideo').show();
                $('#seleccionaEVideo').show();
                $('#seleccionaEInputOptionsVideo').show();
                $('#seleccionaEInputAudio').hide();
                $('#seleccionaETitleAudio').hide();
                break;
            case 3:
                $('#seleccionaEText').show();
                if (tinyMCE.get('seleccionaEText')) {
                    tinyMCE.get('seleccionaEText').show();
                }
                break;
            default:
                break;
        }
    },
    showOptions: function (number) {
        $('.gameQE-EOptionDiv').each(function (i) {
            $(this).show();
            if (i >= number) {
                $(this).hide();
                $exeDevice.showSolution('');
            }

        });
        $('.gameQE-EAnwersOptions').each(function (j) {
            if (j >= number) {
                $(this).val('');
            }

        });
    },
    showSolution: function (solution) {
        $("input.gameQE-ESolution[name='slcsolution']").prop("checked", false);
        for (var i = 0; i < solution.length; i++) {
            var sol = solution[i];
            $('.gameQE-ESolution')[solution].checked = true;
            $("input.gameQE-ESolution[name='slcsolution'][value='" + sol + "']").prop("checked", true)
        }
        $('#selecionaESolutionSelect').text(solution);


    },
    createForm: function () {
        var path = $exeDevice.iDevicePath,
            html = '\
			<div id="gameQEIdeviceForm">\
                <div class="exe-idevice-info">' + _("Create activities with multiple choice questions or questions in which you have to put the answers in the right order.") + ' <a href="https://youtu.be/GSQmT8tpXH4" hreflang="es" rel="lightbox"  target="_blank">' + _("Use Instructions") + '</a></div>\
				<div class="exe-form-tab" title="' + _('General settings') + '">\
                ' + $exeAuthoring.iDevice.gamification.instructions.getFieldset(_("Choose the right answers and click on the Check button.")) + '\
                        <fieldset class="exe-fieldset exe-fieldset-closed">\
                            <legend><a href="#">' + _("Options") + '</a></legend>\
                            <div>\
                                <p>\
                                    <label for="seleccionaEShowMinimize"><input type="checkbox" id="seleccionaEShowMinimize">' + _("Show minimized.") + '</label>\
                                </p>\
                                <p>\
                                    <strong class="GameModeLabel"><a href="#seleccionaEOrderHelp" id="seleccionaEOrderHelpLnk" class="GameModeHelpLink" title="' + _('Help') + '"><img src="' + path + 'quextIEHelp.gif" width="16" height="16" alt="' + _('Help') + '"/></a> ' + _("Questions order") + ':</strong>\
                                     <input class="gameQE-TypeOrder" checked="checked" id="seleccionaEOrderLinear" type="radio" name="slcgameorder" value="0" />\
                                    <label for="seleccionaEOrderLinear">' + _("Default") + '</label>\
                                    <input class="gameQE-TypeOrder"  id="seleccionaEOrderRamdon" type="radio" name="slcgameorder" value="1" />\
                                    <label for="seleccionaEOrderRamdon">' + _("Random") + '</label>\
                                    <input class="gameQE-TypeOrder"  id="seleccionaEOrderThree" type="radio" name="slcgameorder" value="2" />\
                                    <label for="seleccionaEOrderThree">' + _("Tree") + '</label>\
                                </p>\
                                <div id="seleccionaEOrderHelp" class="gameQE-TypeGameHelp">\
                                    <ul>\
                                        <li><strong>' + _("Default") + ': </strong>' + _("Order defined by the author.") + '</li>\
                                         <li><strong>' + _("Random") + ': </strong>' + _("Different order each time you run the game.") + '</li>\
                                         <li><strong>' + _("Tree") + ': </strong>' + _("The questions will change depending on the answers.") + '</li>\
                                    </ul>\
                                </div>\
                                <p>\
                                    <label for="seleccionaECustomMessages"><input type="checkbox" id="seleccionaECustomMessages">' + _("Custom messages") + '. </label>\
                                </p>\
                                <p>\
                                    <label for="seleccionaEAnswersRamdon"><input type="checkbox" id="seleccionaEAnswersRamdon">' + _("Random options") + '</label>\
                                </p>\
                                <p>\
                                    <label for="seleccionaEShowSolution"><input type="checkbox" checked id="seleccionaEShowSolution">' + _("Show solutions") + '. </label>\
                                    <label for="seleccionaETimeShowSolution">' + _("Show solution time (seconds)") + ' <input type="number" name="seleccionaETimeShowSolution" id="seleccionaETimeShowSolution" value="3" min="1" max="9" /> </label>\
                                </p>\
                                <p>\
                                    <label for="seleccionaEAudioFeedBack"><input type="checkbox" id="seleccionaEAudioFeedBack">' + _("Play audio when displaying the solution") + '.</label>\
                                </p>\
                                <p>\
                                    <label for="seleccionaECustomScore"><input type="checkbox" id="seleccionaECustomScore">' + _("Custom score") + '. </label>\
                                </p>\
                                <p>\
                                <strong class="GameModeLabel"><a href="#seleccionaEGameModeHelp" id="seleccionaEGameModeHelpLnk" class="GameModeHelpLink" title="' + _("Help") + '"><img src="' + path + 'quextIEHelp.gif" width="16" height="16" alt="' + _("Help") + '"/></a> ' + _("Score") + ':</strong>\
                                    <input class="gameQE-TypeGame" checked="checked" id="seleccionaETypeActivity" type="radio" name="slcgamemode" value="1" />\
                                    <label for="seleccionaETypeActivity">' + _("0 to 10") + '</label>\
                                    <input class="gameQE-TypeGame" id="seleccionaEGameMode" type="radio" name="slcgamemode" value="0" />\
                                    <label for="seleccionaEGameMode">' + _("Points and lives") + '</label>\
                                    <input class="gameQE-TypeGame"  id="seleccionaETypeReto" type="radio" name="slcgamemode" value="2" />\
                                    <label for="seleccionaETypeReto">' + _("No score") + '</label>\
                                </p>\
                                <div id="seleccionaEGameModeHelp" class="gameQE-TypeGameHelp">\
                                    <ul>\
                                        <li><strong>' + _("0 to 10") + ': </strong>' + _("No lives, 0 to 10 score, right/wrong answers counter... A more educational context.") + '</li>\
                                         <li><strong>' + _("Points and lives") + ': </strong>' + _("Just like a game: Try to get a high score (thousands of points) and not to loose your lives.") + '</li>\
                                         <li><strong>' + _("No score") + ': </strong>' + _("No score and no lives. You have to answer right to get some information (a feedback).") + '</li>\
                                    </ul>\
                                </div>\
                                <p>\
                                    <label for="seleccionaEUseLives"><input type="checkbox" checked id="seleccionaEUseLives"> ' + _("Use lives") + '. </label> \
                                    <label for="seleccionaENumberLives">' + _("Number of lives") + ':\
                                    <input type="number" name="seleccionaENumberLives" id="seleccionaENumberLives" value="3" min="1" max="5" /> </label>\
                                </p>\
                                <p>\
                                    <label for="seleccionaEHasFeedBack"><input type="checkbox"  id="seleccionaEHasFeedBack"> ' + _("Feedback") + ': </label> \
                                    <label for="seleccionaEPercentajeFB"><input type="number" name="seleccionaEPercentajeFB" id="seleccionaEPercentajeFB" value="100" min="5" max="100" step="5" disabled />' + _("&percnt; right to see the feedback") + '</label>\
                                </p>\
                                <p id="seleccionaEFeedbackP" class="gameQE-EFeedbackP">\
                                    <textarea id="seleccionaEFeedBackEditor" class="exe-html-editor"\></textarea>\
                                </p>\
                                <p class="gameQE-Flex">\
                                    <label for="seleccionaEVideoIntro">' + _("Video Intro") + ':</label><input type="text" id="seleccionaEVideoIntro" /><a href="#" class="gameQE-ButtonLink" id="seleccionaEVideoIntroPlay"  title="' + _("Play video intro") + '"><img src="' + path + 'quextIEPlay.png"  alt="' + _("Play") + '" class="gameQE-EButtonImage" /></a>\
                                </p>\
                                <p>\
                                    <label for="seleccionaEPercentajeQuestions">% ' + _("Questions") + ':  <input type="number" name="seleccionaEPercentajeQuestions" id="seleccionaEPercentajeQuestions" value="100" min="1" max="100" /> </label>\
                                    <span id="seleccionaENumeroPercentaje">1/1</span>\
                                </p>\
                                <p>\
                                    <label for="seleccionaModeBoard"><input type="checkbox" id="seleccionaModeBoard"> ' + _("Digital blackboard mode") + ' </label>\
                                </p>\
                        </div>\
                    </fieldset>\
                    <fieldset class="exe-fieldset">\
                        <legend><a href="#">' + _("Questions") + '</a></legend>\
                        <div class="gameQE-EPanel" id="seleccionaEPanel">\
                            <div class="gameQE-EOptionsMedia">\
                                <div class="gameQE-EOptionsGame">\
                                    <p>\
                                        <span>' + _("Type") + ':</span>\
                                        <span class="gameQE-EInputType">\
                                            <input class="gameQE-TypeSelect" checked id="seleccionaTypeChoose" type="radio" name="slctypeselect" value="0"/>\
                                            <label for="seleccionaTypeSelect">' + _("Select") + '</label>\
                                            <input class="gameQE-TypeSelect"  id="seleccionaTypeOrders" type="radio" name="slctypeselect" value="1"/>\
                                            <label for="seleccionaTypeOrders">' + _("Order") + '</label>\
                                            <input class="gameQE-TypeSelect"  id="seleccionaTypeWord" type="radio" name="slctypeselect" value="2"/>\
                                            <label for="seleccionaTypeWord">' + _("Word") + '</label>\
                                        </span>\
                                    </p>\
                                    <p>\
                                        <span>' + _("Multimedia Type") + ':</span>\
                                        <span class="gameQE-EInputMedias">\
                                            <input class="gameQE-Type" checked="checked" id="seleccionaMediaNormal" type="radio" name="slcmediatype" value="0" disabled />\
                                            <label for="seleccionaMediaNormal">' + _("None") + '</label>\
                                            <input class="gameQE-Type"  id="seleccionaMediaImage" type="radio" name="slcmediatype" value="1" disabled />\
                                            <label for="seleccionaMediaImage">' + _("Image") + '</label>\
                                            <input class="gameQE-Type"  id="seleccionaMediaVideo" type="radio" name="slcmediatype" value="2" disabled />\
                                            <label for="seleccionaMediaVideo">' + _("Video") + '</label>\
                                            <input class="gameQE-Type"  id="seleccionaMediaText" type="radio" name="slcmediatype" value="3" disabled />\
                                            <label for="seleccionaMediaText">' + _("Text") + '</label>\
                                        </span>\
                                    </p>\
                                    <p>\
                                        <span id="seleccionaOptionsNumberSpan">' + _("Options Number") + ':</span>\
                                        <span class="gameQE-EInputNumbers" id="seleccionaEInputNumbers" >\
                                            <input class="gameQE-Number" id="numQ2" type="radio" name="slcnumber" value="2" />\
                                            <label for="numQ2">2</label>\
                                            <input class="gameQE-Number" id="numQ3" type="radio" name="slcnumber" value="3" />\
                                            <label for="numQ3">3</label>\
                                            <input class="gameQE-Number" id="numQ4" type="radio" name="slcnumber" value="4" checked="checked" />\
                                            <label for="numQ4">4</label>\
                                        </span>\
                                    </p>\
                                    <p>\
                                        <span id="seleccionaPercentageSpan">' + _("Percentage of letters to show (%)") + ':</span>\
                                        <span class="gameQE-EPercentage" id="seleccionaPercentage">\
                                            <input type="number" name="seleccionaPercentageShow" id="seleccionaPercentageShow" value="35" min="0" max="100" step="5" /> </label>\
                                        </span>\
                                    </p>\
                                    <p>\
                                        <span>' + _("Time per question") + ':</span>\
                                        <span class="gameQE-EInputTimes">\
                                            <input class="gameQE-Times" checked="checked" id="q15s" type="radio" name="slctime" value="0" />\
                                            <label for="q15s">15s</label>\
                                            <input class="gameQE-Times" id="q30s" type="radio" name="slctime" value="1" />\
                                            <label for="q30s">30s</label>\
                                            <input class="gameQE-Times" id="q1m" type="radio" name="slctime" value="2" />\
                                            <label for="q1m">1m</label>\
                                            <input class="gameQE-Times" id="q3m" type="radio" name="slctime" value="3" />\
                                            <label for="q3m">3m</label>\
                                            <input class="gameQE-Times" id="q5m" type="radio" name="slctime" value="4" />\
                                            <label for="q5m">5m</label>\
                                            <input class="gameQE-Times" id="q10m" type="radio" name="slctime" value="5" />\
                                            <label for="q10m">10m</label>\
                                        </span>\
                                    <p>\
                                    <p id="seleccionaEScoreQuestionDiv" class="gameQE-ScoreQuestionDiv">\
                                        <label for="seleccionaEScoreQuestion"><span>' + _("Score") + '</span>:</label><input type="number" name="seleccionaEScoreQuestion" id="seleccionaEScoreQuestion" value="1" min="0"  max="100" step="0.05"/>\
                                    </p>\
                                    <span class="gameQE-ETitleImage" id="seleccionaETitleImage">' + _("Image URL") + ':</span>\
                                    <div class="gameQE-EInputImage gameQE-Flex" id="seleccionaEInputImage">\
                                        <label class="sr-av" for="seleccionaEURLImage">' + _("Image URL") + '</label>\
                                        <input type="text" class="exe-file-picker gameQE-EURLImage"  id="seleccionaEURLImage"/>\
                                        <a href="#" id="seleccionaEPlayImage" class="gameQE-ENavigationButton gameQE-EPlayVideo" title="' + _("Show") + '"><img src="' + path + 'quextIEPlay.png" alt="' + _("Show") + '" class="gameQE-EButtonImage b-play" /></a>\
                                    </div>\
                                    <div class="gameQE-EInputOptionsImage" id="seleccionaInputOptionsImage">\
                                        <div class="gameQE-ECoord">\
                                            <label for="seleccionaEXImage">X:</label>\
                                            <input id="seleccionaEXImage" type="text" value="0" />\
                                            <label for="seleccionaEXImage">Y:</label>\
                                            <input id="seleccionaEYImage" type="text" value="0" />\
                                        </div>\
                                    </div>\
                                    <span class="gameQE-ETitleVideo" id="seleccionaETitleVideo">' + _("Youtube URL") + ':</span>\
                                    <div class="gameQE-EInputVideo gameQE-Flex" id="seleccionaEInputVideo">\
                                        <label class="sr-av" for="seleccionaEURLYoutube">' + _("Youtube URL") + '</label>\
                                        <input id="seleccionaEURLYoutube" type="text" />\
                                        <a href="#" id="seleccionaEPlayVideo" class="gameQE-ENavigationButton gameQE-EPlayVideo" title="' + _("Play video") + '"><img src="' + path + 'quextIEPlay.png" alt="' + _("Play video") + '" class="gameQE-EButtonImage b-play" /></a>\
                                    </div>\
                                    <div class="gameQE-EInputOptionsVideo" id="seleccionaEInputOptionsVideo">\
                                        <div>\
                                            <label for="seleccionaEInitVideo">' + _("Start") + ':</label>\
                                            <input id="seleccionaEInitVideo" type="text" value="00:00:00" maxlength="8" />\
                                            <label for="seleccionaEEndVideo">' + _("End") + ':</label>\
                                            <input id="seleccionaEEndVideo" type="text" value="00:00:00" maxlength="8" />\
                                            <button class="gameQE-EVideoTime" id="seleccionaEVideoTime" type="button">00:00:00</button>\
                                        </div>\
                                        <div>\
                                            <label for="seleccionaESilenceVideo">' + _("Silence") + ':</label>\
                                            <input id="seleccionaESilenceVideo" type="text" value="00:00:00" maxlength="8" />\
                                            <label for="seleccionaETimeSilence">' + _("Time (s)") + ':</label>\
                                            <input type="number" name="seleccionaETimeSilence" id="seleccionaETimeSilence" value="0" min="0" max="120" /> \
                                        </div>\
                                        <div>\
                                            <label for="seleccionaECheckSoundVideo">' + _("Audio") + ':</label>\
                                            <input id="seleccionaECheckSoundVideo" type="checkbox" checked="checked" />\
                                            <label for="seleccionaECheckImageVideo">' + _("Image") + ':</label>\
                                            <input id="seleccionaECheckImageVideo" type="checkbox" checked="checked" />\
                                        </div>\
                                    </div>\
                                    <div class="gameQE-EAuthorAlt" id="seleccionaEAuthorAlt">\
                                        <div class="gameQE-EInputAuthor" id="seleccionaInputAuthor">\
                                            <label for="seleccionaEAuthor"><span>' + _("Authorship") + '</span>: </label>\
                                            <input id="seleccionaEAuthor" type="text" />\
                                        </div>\
                                        <div class="gameQE-EInputAlt" id="seleccionaInputAlt">\
                                            <label for="seleccionaEAlt"><span>' + _("Alternative text") + ':</span> </label>\
                                            <input id="seleccionaEAlt" type="text" />\
                                        </div>\
                                    </div>\
                                    <span id="seleccionaETitleAudio">' + _("Audio") + ':</span>\
                                    <div class="gameQE-EInputAudio" id="seleccionaEInputAudio">\
                                        <label class="sr-av" for="seleccionaEURLAudio">' + _("URL") + ':</label>\
                                        <input type="text" class="exe-file-picker gameQE-EURLAudio"  id="seleccionaEURLAudio"/>\
                                        <a href="#" id="seleccionaEPlayAudio" class="gameQE-ENavigationButton gameQE-EPlayVideo" title="' + _("Play audio") + '"><img src="' + path + 'quextIEPlay.png" alt="' + _("Play audio") + '" class="gameQE-EButtonImage b-play" /></a>\
                                    </div>\
                                </div>\
                                <div class="gameQE-EMultiMediaOption">\
                                    <div class="gameQE-EMultimedia" id="seleccionaEMultimedia">\
                                        <textarea id="seleccionaEText"></textarea>\
                                        <img class="gameQE-EMedia" src="' + path + 'quextIEImage.png"  id="seleccionaEImage" alt="' + _("Image") + '" />\
                                        <img class="gameQE-EMedia" src="' + path + 'quextIEImage.png"  id="seleccionaENoImage" alt="' + _("No image") + '" />\
                                        <div class="gameQE-EMedia" id="seleccionaEVideo"></div>\
                                        <img class="gameQE-EMedia" src="' + path + 'quextIENoImageVideo.png" id="seleccionaENoImageVideo" alt="" />\
                                        <img class="gameQE-EMedia" src="' + path + 'quextIENoVideo.png" id="seleccionaENoVideo" alt="" />\
                                        <img class="gameQE-ECursor" src="' + path + 'quextIECursor.gif" id="seleccionaECursor" alt="" />\
                                        <img class="gameQE-EMedia" src="' + path + 'quextIECoverSelecciona.png" id="seleccionaECover" alt="' + _("No image") + '" />\
                                    </div>\
                                </div>\
                            </div>\
                            <div class="gameQE-EContents">\
                                <div id="seleccionaESolitionOptions" class="gameQE-SolitionOptionsDiv" ><span>' + _("Question") + ':</span><span><span>' + _("Solution") + ': </span><span id="selecionaESolutionSelect"></span></span></div>\
                                    <div class="gameQE-EQuestionDiv" id="seleccionaEQuestionDiv">\
                                        <label class="sr-av">' + _("Question") + ':</label><input type="text" class="gameQE-EQuestion" id="seleccionaEQuestion">\
                                   </div>\
                                <div class="gameQE-EAnswers" id="seleccionaEAnswers">\
                                    <div class="gameQE-EOptionDiv">\
                                        <label class="sr-av">' + _("Solution") + ' A:</label><input type="checkbox" class="gameQE-ESolution" name="slcsolution" id="seleccionaESolution0" value="A" />\
                                        <label >A</label><input type="text" class="gameQE-EOption0 gameQE-EAnwersOptions" id="seleccionaEOption0">\
                                    </div>\
                                    <div class="gameQE-EOptionDiv">\
                                        <label class="sr-av">' + _("Solution") + ' B:</label><input type="checkbox" class="gameQE-ESolution" name="slcsolution" id="seleccionaESolution1" value="B" />\
                                        <label >B</label><input type="text" class="gameQE-EOption1 gameQE-EAnwersOptions"  id="seleccionaEOption1">\
                                    </div>\
                                    <div class="gameQE-EOptionDiv">\
                                        <label class="sr-av">' + _("Solution") + ' C:</label><input type="checkbox" class="gameQE-ESolution" name="slcsolution" id="seleccionaESolution2" value="C" />\
                                        <label >C</label><input type="text" class="gameQE-EOption2 gameQE-EAnwersOptions"  id="seleccionaEOption2">\
                                    </div>\
                                    <div class="gameQE-EOptionDiv">\
                                        <label class="sr-av">' + _("Solution") + ' D:</label><input type="checkbox"  class="gameQE-ESolution" name="slcsolution" id="seleccionaESolution3" value="D" />\
                                        <label >D</label><input type="text" class="gameQE-EOption3 gameQE-EAnwersOptions"  id="seleccionaEOption3">\
                                    </div>\
                                </div>\
                                <div class="gameQE-EWordDiv gameQE-DP" id="selecionaEWordDiv">\
                                    <div class="gameQE-ESolutionWord"><label for="seleccionaESolutionWord"><span>' + _("Word/Phrase") + ':</span> </label><input type="text"  id="seleccionaESolutionWord"/></div>\
                                    <div class="gameQE-ESolutionWord"><label for="seleccionaEDefinitionWord"><span>' + _("Definition") + ':</span> </label><input type="text"  id="seleccionaEDefinitionWord"/></div>\
                                </div>\
                            </div>\
                            <div class="gameQE-EOrders" id="seleccionaEOrder">\
                                <div class="gameQE-ECustomMessage">\
                                    <span class="sr-av">' + _("Hit") + '</span><span class="gameQE-EHit"></span>\
                                    <label for="seleccionaEMessageOK">' + _("Message") + ':</label>\
                                    <input type="text" class=""  id="seleccionaEMessageOK">\
                                    <label for="seleccionaGotoCorrect">' + _("Go to") + ':</label>\
                                    <select name="seleccionaGotoCorrect" id="seleccionaGotoCorrect">\
                                        <option value="-2">' + _('End') + '</option>\
                                        <option value="-1" selected>' + _('Next') + '</option>\
                                        <option value="0">' + 1 + '</option>\
                                    </select>\
                                </div>\
                                <div class="gameQE-ECustomMessage">\
                                    <span class="sr-av">' + _("Error") + '</span><span class="gameQE-EError"></span>\
                                    <label for="seleccionaEMessageKO">' + _("Message") + ':</label>\
                                    <input type="text" class=""  id="seleccionaEMessageKO">\
                                    <label for="seleccionaGotoIncorrect">' + _("Go to") + ':</label>\
                                    <select name="seleccionaGotoIncorrect" id="seleccionaGotoIncorrect">\
                                        <option value="-2">' + _('End') + '</option>\
                                        <option value="-1" selected>' + _('Next') + '</option>\
                                        <option value="0">' + 1 + '</option>\
                                    </select>\
                                </div>\
                            </div>\
                            <div class="gameQE-ENavigationButtons">\
                                <a href="#" id="seleccionaEAdd" class="gameQE-ENavigationButton" title="' + _("Add question") + '"><img src="' + path + 'quextIEAdd.png" alt="' + _("Add question") + '" class="gameQE-EButtonImage" /></a>\
                                <a href="#" id="seleccionaEFirst" class="gameQE-ENavigationButton"  title="' + _("First question") + '"><img src="' + path + 'quextIEFirst.png" alt="' + _("First question") + '" class="gameQE-EButtonImage" /></a>\
                                <a href="#" id="seleccionaEPrevious" class="gameQE-ENavigationButton" title="' + _("Previous question") + '"><img src="' + path + 'quextIEPrev.png" alt="' + _("Previous question") + '" class="gameQE-EButtonImage" /></a>\
                                <label class="sr-av" for="seleccionaENumberQuestion">' + _("Question number:") + ':</label><input type="text" class="gameQE-NumberQuestion"  id="seleccionaENumberQuestion" value="1"/>\
                                <a href="#" id="seleccionaENext" class="gameQE-ENavigationButton"  title="' + _("Next question") + '"><img src="' + path + 'quextIENext.png" alt="' + _("Next question") + '" class="gameQE-EButtonImage" /></a>\
                                <a href="#" id="seleccionaELast" class="gameQE-ENavigationButton"  title="' + _("Last question") + '"><img src="' + path + 'quextIELast.png" alt="' + _("Last question") + '" class="gameQE-EButtonImage" /></a>\
                                <a href="#" id="seleccionaEDelete" class="gameQE-ENavigationButton" title="' + _("Delete question") + '"><img src="' + path + 'quextIEDelete.png"  alt="' + _("Delete question") + '" class="gameQE-EButtonImage" /></a>\
                                <a href="#" id="seleccionaECopy" class="gameQE-ENavigationButton" title="' + _("Copy question") + '"><img src="' + path + 'quextIECopy.png"  alt="' + _("Copy question") + '" class="gameQE-EButtonImage" /></a>\
                                <a href="#" id="seleccionaECut" class="gameQE-ENavigationButton" title="' + _("Cut question") + '"><img src="' + path + 'quextIECut.png" alt="' + _("Cut question") + '"  class="gameQE-EButtonImage" /></a>\
                                <a href="#" id="seleccionaEPaste" class="gameQE-ENavigationButton"  title="' + _("Paste question") + '"><img src="' + path + 'quextIEPaste.png"  alt="' + _("Paste question") + '" class="gameQE-EButtonImage" /></a>\
                            </div>\
                            <div class="gameQE-EVIDiv" id="seleccionaEVIDiv">\
                                <div class="gameQE-EVIV">\
                                    <div class="gameQE-EMVI">\
                                        <div class="gameQE-EVI" id="seleccionaEVI"></div>\
                                        <img class="gameQE-ENoVI" src="' + path + "quextIENoVideo.png" + '" id="seleccionaEVINo" alt="" />\
                                    </div>\
                                </div>\
                                <div class="gameQE-EVIOptions">\
                                    <label for="seleccionaEVIURL">' + _("Youtube URL") + ':</label>\
                                    <input id="seleccionaEVIURL" type="text" />\
                                    <a href="#" id="seleccionaEVIPlayI" class="gameQE-ENavigationButton gameQE-EPlayVideo" title="' + _("Play video intro") + '"><img src="' + path + 'quextIEPlay.png" alt="' + _("Play video intro") + '" class="gameQE-EButtonImage b-playintro" /></a>\
                                    <label for="seleccionaEVIStart">' + _("Start") + ':</label>\
                                    <input id="seleccionaEVIStart" type="text" value="00:00:00" readonly />\
                                    <label for="seleccionaEVIEnd">' + _("End") + ':</label>\
                                    <input id="seleccionaEVIEnd" type="text" value="00:00:00" readonly />\
                                    <button class="gameQE-EVideoTime" id="seleccionaEVITime" type="button">00:00:00</button>\
                                </div>\
                                <input type="button" class="gameQE-EVIClose" id="seleccionaEVIClose" value="' + _("Close") + '" />\
                            </div>\
                            <div class="gameQE-ENumQuestionDiv" id="seleccionaENumQuestionDiv">\
                                <div class="gameQE-ENumQ"><span class="sr-av">' + _("Number of questions:") + '</span></div>\ <span class="gameQE-ENumQuestions" id="seleccionaENumQuestions">0</span>\
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
        //$exeDevice.loadYoutubeApi();
        $exeAuthoring.iDevice.tabs.init("gameQEIdeviceForm");
        $exeAuthoring.iDevice.gamification.scorm.init();
        tinymce.init({
            selector: '#seleccionaEText',
            height: 157,
            language: "all",
            width: 400,
            plugins: [
                'code paste textcolor'
            ],
            paste_as_text: true,
            entity_encoding: "raw",
            toolbar: 'undo redo | removeformat | fontselect | formatselect | fontsizeselect |  bold italic underline |  alignleft aligncenter alignright alignjustify | forecolor backcolor ',
            fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
            menubar: false,
            statusbar: false,
            setup: function (ed) {
                ed.on('init', function (e) {
                    $exeDevice.enableForm(field);
                });
            }
        });

    },
    initQuestions: function () {
        $('#seleccionaEInputImage').css('display', 'flex');
        $('#seleccionaEInputVideo').css('display', 'flex');
        $("#seleccionaMediaNormal").prop("disabled", false);
        $("#seleccionaMediaImage").prop("disabled", false);
        $("#seleccionaMediaText").prop("disabled", false);
        $("#seleccionaMediaVideo").prop("disabled", false);

        $('#seleccionaGotoCorrect').hide();
        $('#seleccionaGotoIncorrect').hide();
        $('label[for="seleccionaGotoCorrect"]').hide();
        $('label[for="seleccionaGotoIncorrect"]').hide();
        if ($exeDevice.selectsGame.length == 0) {
            var question = $exeDevice.getCuestionDefault();
            $exeDevice.selectsGame.push(question);
            this.changeTypeQuestion(0)
            this.showOptions(4);
            this.showSolution('');
        }
        $exeDevice.showTypeQuestion(0);
        this.active = 0;
    },
    getCuestionDefault: function () {
        var p = new Object();
        p.typeSelect = 0;
        p.type = 0;
        p.time = 0;
        p.numberOptions = 4;
        p.url = '';
        p.x = 0;
        p.y = 0;
        p.author = '';
        p.alt = "";
        p.soundVideo = 1;
        p.imageVideo = 1;
        p.iVideo = 0;
        p.fVideo = 0;
        p.eText = '';
        p.quextion = '';
        p.options = [];
        p.options.push('');
        p.options.push('');
        p.options.push('');
        p.options.push('');
        p.solution = '';
        p.silentVideo = 0;
        p.tSilentVideo = 0;
        p.solutionWord = '';
        p.audio = '';
        p.hit = -1;
        p.error = -1;
        p.msgHit = '';
        p.msgError = '';
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
            var json = $exeDevice.Decrypt($('.selecciona-DataGame', wrapper).text()),
                version = $('.selecciona-version', wrapper).text();
            var dataGame = $exeDevice.isJsonString(json),
                $imagesLink = $('.selecciona-LinkImages', wrapper),
                $audiosLink = $('.selecciona-LinkAudios', wrapper);
            dataGame.modeBoard = typeof dataGame.modeBoard == "undefined" ? false : dataGame.modeBoard;

            $imagesLink.each(function () {
                var iq = parseInt($(this).text());
                if (!isNaN(iq) && iq < dataGame.selectsGame.length) {
                    dataGame.selectsGame[iq].url = $(this).attr('href');
                    if (dataGame.selectsGame[iq].url.length < 4 && dataGame.selectsGame[iq].type == 1) {
                        dataGame.selectsGame[iq].url = "";
                    }
                }
            });
            var hasYoutube = false;
            for (var i = 0; i < dataGame.selectsGame.length; i++) {
                dataGame.selectsGame[i].audio = typeof dataGame.selectsGame[i].audio == "undefined" ? "" : dataGame.selectsGame[i].audio;
                if (i > 0 && dataGame.selectsGame[i].type == 2) {
                    hasYoutube = true;
                }
            }

            $audiosLink.each(function () {
                var iq = parseInt($(this).text());
                if (!isNaN(iq) && iq < dataGame.selectsGame.length) {
                    dataGame.selectsGame[iq].audio = $(this).attr('href');
                    if (dataGame.selectsGame[iq].audio.length < 4) {
                        dataGame.selectsGame[iq].audio = "";
                    }
                }
            });
            $exeDevice.active = 0;
            var instructions = $(".selecciona-instructions", wrapper);
            if (instructions.length == 1) {
                instructions = instructions.html() || ''
                if (tinyMCE.get('eXeGameInstructions')) {
                    tinyMCE.get('eXeGameInstructions').setContent(instructions);
                } else {
                    $("#eXeGameInstructions").val(instructions)
                }
            }

            var textFeedBack = $(".selecciona-feedback-game", wrapper);
            if (textFeedBack.length == 1) {
                textFeedBack = textFeedBack.html() || ''
                if (tinyMCE.get('seleccionaEFeedBackEditor')) {
                    tinyMCE.get('seleccionaEFeedBackEditor').setContent(textFeedBack);
                } else {
                    $("#seleccionaEFeedBackEditor").val(textFeedBack)
                }
            }

            var textAfter = $(".selecciona-extra-content", wrapper);
            if (textAfter.length == 1) {
                textAfter = textAfter.html() || ''
                if (tinyMCE.get('eXeIdeviceTextAfter')) {
                    tinyMCE.get('eXeIdeviceTextAfter').setContent(textAfter);
                } else {
                    $("#eXeIdeviceTextAfter").val(textAfter)
                }
            }
            if (hasYoutube) {
                $exeDevice.loadYoutubeApi();
            }
            $exeAuthoring.iDevice.gamification.common.setLanguageTabValues(dataGame.msgs);
            $exeDevice.updateFieldGame(dataGame);
        }
    },
    updateGameMode: function (gamemode, feedback, useLives) {
        $("#seleccionaEUseLives").prop('disabled', true);
        $("#seleccionaENumberLives").prop('disabled', true);
        $('#seleccionaEPercentajeFB').prop('disabled', !feedback && gamemode != 2);
        $('#seleccionaEHasFeedBack').prop('disabled', gamemode == 2);
        $('#seleccionaEHasFeedBack').prop('checked', feedback);
        if (gamemode == 2 || feedback) {
            $('#seleccionaEFeedbackP').slideDown();
        }
        if (gamemode != 2 && !feedback) {
            $('#seleccionaEFeedbackP').slideUp();
        }
        if (gamemode == 0) {
            $("#seleccionaEUseLives").prop('disabled', false);
            $("#seleccionaENumberLives").prop('disabled', !useLives);
        }
    },
    updateFieldGame: function (game) {
        $exeAuthoring.iDevice.gamification.itinerary.setValues(game.itinerary);
        game.answersRamdon = game.answersRamdon || false;
        game.percentajeFB = typeof game.percentajeFB != "undefined" ? game.percentajeFB : 100;
        game.gameMode = typeof game.gameMode != "undefined" ? game.gameMode : 0;
        game.feedBack = typeof game.feedBack != "undefined" ? game.feedBack : false;
        game.customScore = typeof game.customScore == "undefined" ? false : game.customScore;
        game.audioFeedBach = typeof game.audioFeedBach == "undefined" ? false : game.audioFeedBach;
        game.customMessages = typeof game.customMessages == "undefined" ? false : game.customMessages;
        game.percentajeQuestions = typeof game.percentajeQuestions == "undefined" ? 100 : game.percentajeQuestions;

        if (typeof game.order == "undefined") {
            game.order = game.optionsRamdon ? 1 : 0;
        }
        $('#seleccionaEShowMinimize').prop('checked', game.showMinimize);
        $('#seleccionaEAnswersRamdon').prop('checked', game.answersRamdon);
        $('#seleccionaEUseLives').prop('checked', game.useLives);
        $('#seleccionaENumberLives').val(game.numberLives);
        $('#seleccionaEVideoIntro').val(game.idVideo);
        $('#seleccionaEShowSolution').prop('checked', game.showSolution);
        $('#seleccionaETimeShowSolution').prop('disabled', !game.showSolution);
        $('#seleccionaETimeShowSolution').val(game.timeShowSolution);
        $('#seleccionaModeBoard').prop("checked", game.modeBoard);
        $('#seleccionaENumberLives').prop('disabled', !game.useLives);
        $('#seleccionaEVIURL').val(game.idVideo);
        $('#seleccionaEVIEnd').val($exeDevice.secondsToHour(game.endVideo));
        $('#seleccionaEVIStart').val($exeDevice.secondsToHour(game.startVideo));
        $('#seleccionaECustomScore').prop('checked', game.customScore);
        $('#seleccionaECustomScore').prop('disabled', game.order == 2);
        $('#seleccionaEPercentajeQuestions').prop('disabled', game.order == 2);
        $('#seleccionaECustomMessages').prop('checked', game.customMessages);
        $('#seleccionaECustomMessages').prop('disabled', game.order == 2);
        $('#seleccionaEAudioFeedBack').prop('checked', game.audioFeedBach);
        $('#seleccionaEScoreQuestionDiv').hide();
        $("#seleccionaEHasFeedBack").prop('checked', game.feedBack);
        $("#seleccionaEPercentajeFB").val(game.percentajeFB);
        $("input.gameQE-TypeGame[name='slcgamemode'][value='" + game.gameMode + "']").prop("checked", true);
        $("input.gameQE-TypeOrder[name='slcgameorder'][value='" + game.order + "']").prop("checked", true);
        $("#seleccionaEUseLives").prop('disabled', game.gameMode == 0);
        $("#seleccionaENumberLives").prop('disabled', (game.gameMode == 0 && game.useLives));
        $('#seleccionaEPercentajeQuestions').val(game.percentajeQuestions);

        $exeDevice.updateGameMode(game.gameMode, game.feedBack, game.useLives);
        $exeDevice.showSelectOrder(game.order, game.customMessages, game.customScore);
        for (var i = 0; i < game.selectsGame.length; i++) {
            game.selectsGame[i].audio = typeof game.selectsGame[i].audio == "undefined" ? "" : game.selectsGame[i].audio;
            game.selectsGame[i].hit = typeof game.selectsGame[i].hit == "undefined" ? -1 : game.selectsGame[i].hit;
            game.selectsGame[i].error = typeof game.selectsGame[i].error == "undefined" ? -1 : game.selectsGame[i].error;
            game.selectsGame[i].msgHit = typeof game.selectsGame[i].msgHit == "undefined" ? "" : game.selectsGame[i].msgHit;
            game.selectsGame[i].msgError = typeof game.selectsGame[i].msgError == "undefined" ? "" : game.selectsGame[i].msgError;
            game.selectsGame[i].typeSelect = typeof game.selectsGame[i].typeSelect == "undefined" ? "" : game.selectsGame[i].typeSelect;
            game.selectsGame[i].solutionQuestion = typeof game.selectsGame[i].solutionQuestion == "undefined" ? "" : game.selectsGame[i].solutionQuestion;
        }
        if (game.feedBack || game.gameMode == 2) {
            $('#seleccionaEFeedbackP').show();
        } else {
            $('#seleccionaEFeedbackP').hide();
        }
        $('#seleccionaEPercentajeFB').prop('disabled', !game.feedBack);
        $exeAuthoring.iDevice.gamification.scorm.setValues(game.isScorm, game.textButtonScorm, game.repeatActivity);
        $exeDevice.selectsGame = game.selectsGame;
        $exeDevice.updateSelectOrder();
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
    getIDYoutube: function (url) {
        if (url) {
            var match = url.match(regExp);
            var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            var match = url.match(regExp);
            if (match && match[2].length == 11) {
                return match[2];
            } else {
                return false;
            }
        } else {
            return false;
        }
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
        if (instructions != "") divContent = '<div class="selecciona-instructions gameQP-instructions">' + instructions + '</div>';
        var textFeedBack = tinyMCE.get('seleccionaEFeedBackEditor').getContent(),
            linksImages = $exeDevice.createlinksImage(dataGame.selectsGame),
            linksAudios = $exeDevice.createlinksAudio(dataGame.selectsGame),
            html = '<div class="selecciona-IDevice">';
        html += divContent;
        html += '<div class="selecciona-version js-hidden">' + $exeDevice.version + '</div>';
        html += '<div class="selecciona-feedback-game">' + textFeedBack + '</div>';
        html += '<div class="selecciona-DataGame js-hidden" >' + $exeDevice.Encrypt(json) + '</div>';
        html += linksImages;
        html += linksAudios;
        var textAfter = tinyMCE.get('eXeIdeviceTextAfter').getContent();
        if (textAfter != "") {
            html += '<div class="selecciona-extra-content">' + textAfter + '</div>';
        }
        html += '<div class="selecciona-bns js-hidden">' + $exeDevice.msgs.msgNoSuportBrowser + '</div>';
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
        p.type = parseInt($('input[name=slcmediatype]:checked').val());
        p.time = parseInt($('input[name=slctime]:checked').val());
        p.numberOptions = parseInt($('input[name=slcnumber]:checked').val());
        p.typeSelect = parseInt($('input[name=slctypeselect]:checked').val())
        p.x = parseFloat($('#seleccionaEXImage').val());
        p.y = parseFloat($('#seleccionaEYImage').val());;
        p.author = $('#seleccionaEAuthor').val();
        p.alt = $('#seleccionaEAlt').val();
        p.customScore = parseFloat($('#seleccionaEScoreQuestion').val());
        p.url = $('#seleccionaEURLImage').val().trim();
        p.audio = $('#seleccionaEURLAudio').val();
        p.hit = parseInt($('#seleccionaGotoCorrect').val());
        p.error = parseInt($('#seleccionaGotoIncorrect').val());
        p.msgHit = $('#seleccionaEMessageOK').val();
        p.msgError = $('#seleccionaEMessageKO').val();
        $exeDevice.stopSound();
        $exeDevice.stopVideo();
        if (p.type == 2) {
            p.url = $exeDevice.getIDYoutube($('#seleccionaEURLYoutube').val().trim()) ? $('#seleccionaEURLYoutube').val() : '';
        }
        p.soundVideo = $('#seleccionaECheckSoundVideo').is(':checked') ? 1 : 0;
        p.imageVideo = $('#seleccionaECheckImageVideo').is(':checked') ? 1 : 0;
        p.iVideo = $exeDevice.hourToSeconds($('#seleccionaEInitVideo').val().trim());
        p.fVideo = $exeDevice.hourToSeconds($('#seleccionaEEndVideo').val().trim());
        p.silentVideo = $exeDevice.hourToSeconds($('#seleccionaESilenceVideo').val().trim());
        p.tSilentVideo = parseInt($('#seleccionaETimeSilence').val());
        p.eText = tinyMCE.get('seleccionaEText').getContent();
        p.quextion = $('#seleccionaEQuestion').val().trim();
        p.options = [];
        p.solution = $('#selecionaESolutionSelect').text().trim();
        p.solutionQuestion = "";
        if (p.typeSelect == 2) {
            p.quextion = $('#seleccionaEDefinitionWord').val().trim();
            p.solution = "";
            p.solutionQuestion = $('#seleccionaESolutionWord').val();
        }
        p.percentageShow = parseInt($('#seleccionaPercentageShow').val());
        var optionEmpy = false;
        var validExt = ['mp3', 'ogg', 'wav'],
            extaudio = p.audio.split('.').pop().toLowerCase();
        $('.gameQE-EAnwersOptions').each(function (i) {
            var option = $(this).val().trim();
            if (i < p.numberOptions && option.length == 0) {
                optionEmpy = true;
            }
            if (p.typeSelect == 2) {
                option = "";
            }
            p.options.push(option);
        });
        if (p.typeSelect == 1 && p.solution.length != p.numberOptions) {
            message = msgs.msgTypeChoose;
        } else if (p.typeSelect != 2 && p.quextion.length == 0) {
            message = msgs.msgECompleteQuestion;
        } else if (p.typeSelect != 2 && optionEmpy) {
            message = msgs.msgECompleteAllOptions
        } else if (p.type == 1 && p.url.length < 5) {
            message = msgs.msgEURLValid;
        } else if (p.type == 2 && p.url.length == 0) {
            message = msgs.msgECompleteURLYoutube;
        } else if (p.type == 2 && (p.iVideo.length == 0 || p.fVideo.length == 0)) {
            message = msgs.msgEStartEndVideo;
        } else if (p.type == 2 && p.iVideo >= p.fVideo) {
            message = msgs.msgEStartEndIncorrect;
        } else if (p.type == 3 && p.eText.length == 0) {
            message = msgs.msgWriteText;
        } else if (p.type == 2 && !$exeDevice.validTime($('#seleccionaEInitVideo').val()) || !$exeDevice.validTime($('#seleccionaEEndVideo').val())) {
            message = $exeDevice.msgs.msgTimeFormat
        } else if (p.type == 2 && p.tSilentVideo > 0 && !$exeDevice.validTime($('#seleccionaESilenceVideo').val())) {
            message = msgs.msgTimeFormat;
        } else if (p.type == 2 && p.tSilentVideo > 0 && (p.silentVideo < p.iVideo || p.silentVideo >= p.fVideo)) {
            message = msgs.msgSilentPoint;
        } else if (p.typeSelect == 2 && p.solutionQuestion.trim().length == 0) {
            message = $exeDevice.msgs.msgEProvideWord;
        } else if (p.typeSelect == 2 && p.quextion.trim().length == 0) {
            message = $exeDevice.msgs.msgEDefintion;
        }
        var order = parseInt($('input[name=slcgameorder]:checked').val());
        if (order == 2) {
            if (p.hit >= $exeDevice.selectsGame.length) {
                message = $exeDevice.msgs.msgNotHitCuestion;
            }
            if (p.error >= $exeDevice.selectsGame.length) {
                message = $exeDevice.msgs.msgNotErrorCuestion;
            }
        }

        if (message.length == 0) {
            $exeDevice.selectsGame[$exeDevice.active] = p;
            message = true;
        } else {
            $exeDevice.showMessage(message);
            message = false;
        }
        return message;

    },
    createlinksImage: function (selectsGame) {
        var html = '';
        for (var i = 0; i < selectsGame.length; i++) {
            var linkImage = '';
            if (selectsGame[i].type == 1 && !selectsGame[i].url.indexOf('http') == 0) {
                linkImage = '<a href="' + selectsGame[i].url + '" class="js-hidden selecciona-LinkImages">' + i + '</a>';
            }
            html += linkImage;
        }
        return html;
    },
    createlinksAudio: function (selectsGame) {
        var html = '';
        for (var i = 0; i < selectsGame.length; i++) {
            var linkaudio = '';
            if (selectsGame[i].type != 2 && !selectsGame[i].audio.indexOf('http') == 0 && selectsGame[i].audio.length > 4) {
                linkaudio = '<a href="' + selectsGame[i].audio + '" class="js-hidden selecciona-LinkAudios">' + i + '</a>';
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
        link.download = _("Game") + "Selecciona.json";
        document.getElementById('gameQEIdeviceForm').appendChild(link);
        link.click();
        setTimeout(function () {
            document.getElementById('gameQEIdeviceForm').removeChild(link);
            window.URL.revokeObjectURL(data);
        }, 100);
    },

    importGameOld: function (content) {
        var game = $exeDevice.isJsonString(content);
        if (!game || typeof game.typeGame == "undefined") {
            $exeDevice.showMessage($exeDevice.msgs.msgESelectFile);
            return;
        } else if (game.typeGame !== 'Selecciona') {
            $exeDevice.showMessage($exeDevice.msgs.msgESelectFile);
            return;
        }
        $exeDevice.active = 0;
        $exeDevice.selectsGame = game.selectsGame;
        for (var i = 0; i < $exeDevice.selectsGame.length; i++) {
            if (game.selectsGame[i].type == 3) {
                game.selectsGame[i].eText = unescape(game.selectsGame[i].eText);
            }
            var numOpt = 0,
                options = $exeDevice.selectsGame[i].options;
            for (var j = 0; j < options.length; j++) {
                if (options[j].trim().length == 0) {
                    $exeDevice.selectsGame[i].numberOptions = numOpt;
                    break;
                }
                numOpt++;
            }
        }
        $exeDevice.updateFieldGame(game);
        var instructions = game.instructionsExe || game.instructions,
            tAfter = game.textAfter || "",
            textFeedBack = game.textFeedBack || "";
        tinyMCE.get('eXeGameInstructions').setContent(unescape(instructions));
        tinyMCE.get('eXeIdeviceTextAfter').setContent(unescape(tAfter));
        tinyMCE.get('seleccionaEFeedBackEditor').setContent(unescape(textFeedBack));
        $('.exe-form-tabs li:first-child a').click();
    },
    validateData: function () {
        var clear = $exeDevice.removeTags,
            instructions = $('#eXeGameInstructions').text(),
            instructionsExe = escape(tinyMCE.get('eXeGameInstructions').getContent()),
            textAfter = escape(tinyMCE.get('eXeIdeviceTextAfter').getContent()),
            textFeedBack = escape(tinyMCE.get('seleccionaEFeedBackEditor').getContent()),
            showMinimize = $('#seleccionaEShowMinimize').is(':checked'),
            modeBoard = $('#seleccionaModeBoard').is(':checked'),
            optionsRamdon = false,
            answersRamdon = $('#seleccionaEAnswersRamdon').is(':checked'),
            showSolution = $('#seleccionaEShowSolution').is(':checked'),
            timeShowSolution = parseInt(clear($('#seleccionaETimeShowSolution').val())),
            useLives = $('#seleccionaEUseLives').is(':checked'),
            numberLives = parseInt(clear($('#seleccionaENumberLives').val())),
            idVideo = $('#seleccionaEVideoIntro').val(),
            endVideo = $exeDevice.hourToSeconds($('#seleccionaEVIEnd').val()),
            startVideo = $exeDevice.hourToSeconds($('#seleccionaEVIStart').val()),
            itinerary = $exeAuthoring.iDevice.gamification.itinerary.getValues(),
            customScore = $('#seleccionaECustomScore').is(':checked'),
            customMessages = $('#seleccionaECustomMessages').is(':checked'),
            feedBack = $('#seleccionaEHasFeedBack').is(':checked'),
            percentajeFB = parseInt(clear($('#seleccionaEPercentajeFB').val())),
            gameMode = parseInt($('input[name=slcgamemode]:checked').val()),
            order = parseInt($('input[name=slcgameorder]:checked').val()),
            audioFeedBach = $('#seleccionaEAudioFeedBack').is(':checked'),
            percentajeQuestions = parseInt(clear($('#seleccionaEPercentajeQuestions').val()));

        if (!itinerary) return false;
        if ((gameMode == 2 || feedBack) && textFeedBack.trim().length == 0) {
            eXe.app.alert($exeDevice.msgs.msgProvideFB);
            return false;
        }
        if (showSolution && timeShowSolution.length == 0) {
            $exeDevice.showMessage($exeDevice.msgs.msgEProvideTimeSolution);
            return false;
        }
        var selectsGame = $exeDevice.selectsGame;
        for (var i = 0; i < selectsGame.length; i++) {
            var mquestion = selectsGame[i]
            mquestion.customScore = typeof (mquestion.customScore) == "undefined" ? 1 : mquestion.customScore;
            if (mquestion.quextion.length == 0) {
                $exeDevice.showMessage($exeDevice.msgs.msgECompleteQuestion);
                return false;
            } else if ((mquestion.type == 1) && (mquestion.url.length < 10)) {
                $exeDevice.showMessage($exeDevice.msgs.msgEURLValid);
                return false;
            } else if ((mquestion.type == 2) && !($exeDevice.getIDYoutube(mquestion.url))) {
                $exeDevice.showMessage($exeDevice.msgs.msgECompleteURLYoutube);
                return false;
            }
            if (mquestion.typeSelect == 2) {
                if (mquestion.solutionQuestion.length == 0) {
                    $exeDevice.showMessage($exeDevice.msgs.msgProvideSolution);
                    return false;
                }
            } else {
                var completAnswer = true;
                for (var j = 0; j < mquestion.numberOptions; j++) {
                    if (mquestion.options[j].length == 0) {
                        completAnswer = false;
                    }
                }
                if (!completAnswer) {
                    $exeDevice.showMessage($exeDevice.msgs.msgECompleteAllOptions);
                    return false;
                }
            }
        }
        for (var i = 0; i < selectsGame.length; i++) {
            var qt = selectsGame[i]
            if (qt.type == 1 && qt.url.length < 4) {
                qt.x = 0
                qt.y = 0;
                qt.author = '';
                qt.alt = '';
            } else if (qt.type == 2 && qt.url.length < 4) {
                qt.iVideo = 0
                qt.fVideo = 0;
                qt.author = '';
                qt.alt = '';
            } else if (qt.type == 3) {
                qt.eText = qt.eText;
            }
        }
        var scorm = $exeAuthoring.iDevice.gamification.scorm.getValues();
        var data = {
            'asignatura': '',
            "author": '',
            'authorVideo': '',
            'typeGame': 'Selecciona',
            'endVideo': endVideo,
            'idVideo': idVideo,
            'startVideo': startVideo,
            'instructionsExe': instructionsExe,
            'instructions': instructions,
            'showMinimize': showMinimize,
            'optionsRamdon': optionsRamdon,
            'answersRamdon': answersRamdon,
            'showSolution': showSolution,
            'timeShowSolution': timeShowSolution,
            'useLives': useLives,
            'numberLives': numberLives,
            'itinerary': itinerary,
            'selectsGame': selectsGame,
            'isScorm': scorm.isScorm,
            'textButtonScorm': scorm.textButtonScorm,
            'repeatActivity': scorm.repeatActivity,
            'title': '',
            'customScore': customScore,
            'textAfter': textAfter,
            'textFeedBack': textFeedBack,
            'gameMode': gameMode,
            'feedBack': feedBack,
            'percentajeFB': percentajeFB,
            'order': order,
            'customMessages': customMessages,
            'version': 3.1,
            'percentajeQuestions': percentajeQuestions,
            'audioFeedBach': audioFeedBach,
            'modeBoard':modeBoard
        }
        return data;
    },

    removeTags: function (str) {
        var wrapper = $("<div></div>");
        wrapper.html(str);
        return wrapper.text();
    },
    showTypeQuestion: function (type) {
        if (type == 2) {
            $('#seleccionaEAnswers').hide();
            $('#seleccionaEQuestionDiv').hide();
            $('#gameQEIdeviceForm .gameQE-ESolutionSelect').hide();
            $('#seleccionaOptionsNumberSpan').hide();
            $('#seleccionaEInputNumbers').hide();
            $('#seleccionaPercentageSpan').show();
            $('#seleccionaPercentage').show();
            $('#selecionaEWordDiv').show();
            $('#seleccionaESolitionOptions').hide();

        } else {
            $('#seleccionaEAnswers').show();
            $('#seleccionaEQuestionDiv').show();
            $('#gameQEIdeviceForm .gameQE-ESolutionSelect').show();
            $('#seleccionaOptionsNumberSpan').show();
            $('#seleccionaEInputNumbers').show();
            $('#seleccionaPercentageSpan').hide();
            $('#seleccionaPercentage').hide();
            $('#selecionaEWordDiv').hide();
            $('#seleccionaESolitionOptions').show();
        }
    },
    addEvents: function () {
        $('#seleccionaEPaste').hide();
        $('#seleccionaEUseLives').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#seleccionaENumberLives').prop('disabled', !marcado);
        });
        $('#seleccionaEInitVideo, #seleccionaEEndVideo, #seleccionaESilenceVideo').on('focusout', function () {
            if (!$exeDevice.validTime(this.value)) {
                $(this).css({
                    'background-color': 'red',
                    'color': 'white'
                });
            }
        });
        $('#seleccionaEInitVideo, #seleccionaEEndVideo, #seleccionaESilenceVideo').on('click', function () {
            $(this).css({
                'background-color': 'white',
                'color': '#2c6d2c'
            });

        });

        $('#seleccionaShowCodeAccess').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#seleccionaCodeAccess').prop('disabled', !marcado);
            $('#seleccionaMessageCodeAccess').prop('disabled', !marcado);
        });
        $('.gameQE-EPanel').on('click', 'input.gameQE-Type', function (e) {
            var type = parseInt($(this).val());
            $exeDevice.changeTypeQuestion(type);
        });
        $('.gameQE-EPanel').on('click', 'input.gameQE-TypeSelect', function (e) {
            var type = parseInt($(this).val());
            $exeDevice.showTypeQuestion(type);
        });
        $('.gameQE-EPanel').on('click', 'input.gameQE-Number', function (e) {
            var number = parseInt($(this).val());
            $exeDevice.showOptions(number);
        });
        $('#seleccionaEAdd').on('click', function (e) {
            e.preventDefault();
            $exeDevice.addQuestion();
        });
        $('#seleccionaEFirst').on('click', function (e) {
            e.preventDefault();
            $exeDevice.firstQuestion();
        });
        $('#seleccionaEPrevious').on('click', function (e) {
            e.preventDefault();
            $exeDevice.previousQuestion();
        });
        $('#seleccionaENext').on('click', function (e) {
            e.preventDefault();
            $exeDevice.nextQuestion();
        });
        $('#seleccionaELast').on('click', function (e) {
            e.preventDefault();
            $exeDevice.lastQuestion();
        });
        $('#seleccionaEDelete').on('click', function (e) {
            e.preventDefault();
            $exeDevice.removeQuestion();
        });
        $('#seleccionaECopy').on('click', function (e) {
            e.preventDefault();
            $exeDevice.copyQuestion()
        });
        $('#seleccionaECut').on('click', function (e) {
            e.preventDefault();
            $exeDevice.cutQuestion()
        });
        $('#seleccionaEPaste').on('click', function (e) {
            e.preventDefault();
            $exeDevice.pasteQuestion();
        });

        $('#seleccionaEPlayVideo').on('click', function (e) {
            e.preventDefault();
            if (!$exeDevice.getIDYoutube($('#seleccionaEURLYoutube').val().trim())) {
                $exeDevice.showMessage($exeDevice.msgs.msgECompleteURLYoutube);
                return;
            }
            if (typeof YT == "undefined") {
                $exeDevice.isVideoType = true;
                $exeDevice.loadYoutubeApi();
            } else {
                $exeDevice.showVideoQuestion();
            }
        });

        $(' #seleccionaECheckSoundVideo').on('change', function () {
            if (!$exeDevice.getIDYoutube($('#seleccionaEURLYoutube').val().trim())) {
                $exeDevice.showMessage($exeDevice.msgs.msgECompleteURLYoutube);
                return;
            }
            if (typeof YT == "undefined") {
                $exeDevice.isVideoType = true;
                $exeDevice.loadYoutubeApi();
            } else {
                $exeDevice.showVideoQuestion();
            }
        });

        $('#seleccionaECheckImageVideo').on('change', function () {
            if (!$exeDevice.getIDYoutube($('#seleccionaEURLYoutube').val().trim())) {
                $exeDevice.showMessage($exeDevice.msgs.msgECompleteURLYoutube);
                return;
            }
            if (typeof YT == "undefined") {
                $exeDevice.isVideoType = true;
                $exeDevice.loadYoutubeApi();
            } else {
                $exeDevice.showVideoQuestion();
            }
        });


        $('#seleccionaENumberLives').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 1);
            this.value = v;
        });
        $('#seleccionaENumberLives').on('focusout', function () {
            this.value = this.value.trim() == '' ? 3 : this.value;
            this.value = this.value > 5 ? 5 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
        });
        $('#seleccionaETimeShowSolution').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 1);
            this.value = v;
        });
        $('#seleccionaETimeShowSolution').on('focusout', function () {
            this.value = this.value.trim() == '' ? 3 : this.value;
            this.value = this.value > 9 ? 9 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
        });

        $('#seleccionaENumberLives').on('focusout', function () {
            this.value = this.value.trim() == '' ? 3 : this.value;
            this.value = this.value > 5 ? 5 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
        });
        $('#seleccionaETimeSilence').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 1);
            this.value = v;
        });
        $('#seleccionaPercentageShow').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 3);
            this.value = v;
        });
        $('#seleccionaPercentageShow').on('focusout', function () {
            this.value = this.value.trim() == '' ? 35 : this.value;
            this.value = this.value > 100 ? 100 : this.value;
            this.value = this.value < 0 ? 0 : this.value;
        });


        $('#seleccionaEScoreQuestion').on('focusout', function () {
            if (!$exeDevice.validateScoreQuestion($(this).val())) {
                $(this).val(1);
            }
        });
        $('#gameQEIdeviceForm').on('dblclick', '#seleccionaEImage', function () {
            $('#seleccionaECursor').hide();
            $('#seleccionaEXImage').val(0);
            $('#seleccionaEYImage').val(0);
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

        $('#seleccionaEInitVideo').css('color', '#2c6d2c');
        $('#seleccionaEInitVideo').on('click', function (e) {
            e.preventDefault();
            $exeDevice.timeVideoFocus = 0;
            $('#seleccionaEInitVideo').css('color', '#2c6d2c');
            $('#seleccionaEEndVideo').css('color', '#000000');
            $('#seleccionaESilenceVideo').css('color', '#000000');
        });
        $('#seleccionaEEndVideo').on('click', function (e) {
            e.preventDefault();
            $exeDevice.timeVideoFocus = 1;
            $('#seleccionaEEndVideo').css('color', '#2c6d2c');
            $('#seleccionaEInitVideo').css('color', '#000000');
            $('#seleccionaESilenceVideo').css('color', '#000000');
        });
        $('#seleccionaESilenceVideo').on('click', function (e) {
            e.preventDefault();
            $exeDevice.timeVideoFocus = 2;
            $('#seleccionaESilenceVideo').css('color', '#2c6d2c');
            $('#seleccionaEEndVideo').css('color', '#000000');
            $('#seleccionaEInitVideo').css('color', '#000000');
        });

        $('#seleccionaENumberLives').on('focusout', function () {
            this.value = this.value.trim() == '' ? 3 : this.value;
            this.value = this.value > 5 ? 5 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
        });

        $('#seleccionaEVideoTime').on('click', function (e) {
            e.preventDefault();
            var $timeV = '';
            switch ($exeDevice.timeVideoFocus) {
                case 0:
                    $timeV = $('#seleccionaEInitVideo');
                    break;
                case 1:
                    $timeV = $('#seleccionaEEndVideo');
                    break;
                case 2:
                    $timeV = $('#seleccionaESilenceVideo');
                    break;
                default:
                    break;
            }
            $timeV.val($('#seleccionaEVideoTime').text());
            $timeV.css({
                'background-color': 'white',
                'color': '#2c6d2c'
            });
        });
        $('#seleccionaEVIStart').css('color', '#2c6d2c');
        $('#seleccionaEVIStart').on('click', function (e) {
            e.preventDefault();
            $exeDevice.timeVIFocus = true;
            $('#seleccionaEVIStart').css('color', '#2c6d2c');
            $('#seleccionaEVIEnd').css('color', '#000000');
        });
        $('#seleccionaEVIEnd').on('click', function (e) {
            e.preventDefault();
            $exeDevice.timeVIFocus = false;
            $('#seleccionaEVIEnd').css('color', '#2c6d2c');
            $('#seleccionaEVIStart').css('color', '#000000');
        });
        $('#seleccionaEVITime').on('click', function (e) {
            e.preventDefault();
            var $timeV = $exeDevice.timeVIFocus ? $('#seleccionaEVIStart') : $('#seleccionaEVIEnd');
            $timeV.val($('#seleccionaEVITime').text());
        });
        $('#seleccionaUseLives').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#seleccionaNumberLives').prop('disabled', !marcado);
        });
        $('#seleccionaEShowSolution').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#seleccionaETimeShowSolution').prop('disabled', !marcado);
        });

        $('.gameQE-ESolution').on('change', function (e) {
            var marcado = $(this).is(':checked'),
                value = $(this).val();
            $exeDevice.clickSolution(marcado, value);
        });

        $('#seleccionaECustomScore').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#seleccionaEScoreQuestionDiv').hide();
            if (marcado) {
                $('#seleccionaEScoreQuestionDiv').show();
            }
        });

        $('#seleccionaEURLImage').on('change', function () {
            var validExt = ['jpg', 'png', 'gif', 'jpeg', 'svg'],
                selectedFile = $(this).val(),
                ext = selectedFile.split('.').pop().toLowerCase();
            if ((selectedFile.indexOf('resources') == 0 || selectedFile.indexOf('/previews/') == 0) && validExt.indexOf(ext) == -1) {
                $exeDevice.showMessage(_("Supported formats") + ": jpg, jpeg, gif, png, svg");
                return false;
            }
            var url = selectedFile,
                alt = $('#seleccionaEAlt').val(),
                x = parseFloat($('#seleccionaEXImage').val()),
                y = parseFloat($('#seleccionaEYImage').val());
            $exeDevice.showImage(url, x, y, alt);
        });

        $('#seleccionaEPlayImage').on('click', function (e) {
            e.preventDefault();
            var validExt = ['jpg', 'png', 'gif', 'jpeg', 'svg'],
                selectedFile = $('#seleccionaEURLImage').val(),
                ext = selectedFile.split('.').pop().toLowerCase();
            if ((selectedFile.indexOf('resources') == 0 || selectedFile.indexOf('/previews/') == 0) && validExt.indexOf(ext) == -1) {
                $exeDevice.showMessage(_("Supported formats") + ": jpg, jpeg, gif, png, svg");
                return false;
            }
            var url = selectedFile,
                alt = $('#seleccionaEAlt').val(),
                x = parseFloat($('#seleccionaEXImage').val()),
                y = parseFloat($('#seleccionaEYImage').val());
            $exeDevice.showImage(url, x, y, alt);
        });

        $('#seleccionaEImage').on('click', function (e) {
            $exeDevice.clickImage(this, e.pageX, e.pageY);
        });
        $('#seleccionaEVideoIntroPlay').on('click', function (e) {
            e.preventDefault();
            var idv = $exeDevice.getIDYoutube($('#seleccionaEVideoIntro').val());
            if (!idv) {
                $('#seleccionaEVINo').show();
                $('#seleccionaEVI').hide();
                $exeDevice.showMessage($exeDevice.msgs.msgECompleteURLYoutube);
                return;
            }
            if (typeof YT == "undefined") {
                $exeDevice.isVideoIntro = 1;
                $exeDevice.loadYoutubeApi();
            } else {
                var iVI = $exeDevice.hourToSeconds($('#seleccionaEVIStart').val()),
                    fVI = $exeDevice.hourToSeconds($('#seleccionaEVIEnd').val()) > 0 ? $exeDevice.hourToSeconds($('#seleccionaEVIEnd').val()) : 9000;
                $('#seleccionaEVIURL').val($('#seleccionaEVideoIntro').val());
                $('#seleccionaEVIDiv').show();
                $('#seleccionaEVI').show();
                $('#seleccionaEVINo').hide();
                $('#seleccionaENumQuestionDiv').hide();
                $exeDevice.startVideoIntro(idv, iVI, fVI);
            }
        });
        $('#seleccionaEVIPlayI').on('click', function (e) {
            e.preventDefault();
            var idv = $exeDevice.getIDYoutube($('#seleccionaEVIURL').val());
            if (!idv) {
                $exeDevice.showMessage($exeDevice.msgs.msgECompleteURLYoutube);
                return;
            }
            if (typeof YT == "undefined") {
                $exeDevice.isVideoIntro = 2;
                $exeDevice.loadYoutubeApi();
            } else {
                var iVI = $exeDevice.hourToSeconds($('#seleccionaEVIStart').val()),
                    fVI = $exeDevice.hourToSeconds($('#seleccionaEVIEnd').val()) > 0 ? $exeDevice.hourToSeconds($('#seleccionaEVIEnd').val()) : 9000;
                if (fVI <= iVI) {
                    $exeDevice.showMessage($exeDevice.msgs.msgEStartEndIncorrect);
                    return;
                }
                $exeDevice.startVideoIntro(idv, iVI, fVI);
            }
        });
        $('#seleccionaEVIClose').on('click', function (e) {
            e.preventDefault();
            $('#seleccionaEVideoIntro').val($('#seleccionaEVIURL').val());
            $('#seleccionaEVIDiv').hide();
            $('#seleccionaENumQuestionDiv').show();
            $exeDevice.stopVideoIntro();
        });
        $('#seleccionaECursor').on('click', function (e) {
            $(this).hide();
            $('#seleccionaEXImage').val(0);
            $('#seleccionaEYImage').val(0);
        });
        $('#seleccionaEPlayAudio').on('click', function (e) {
            e.preventDefault();
            var selectedFile = $('#seleccionaEURLAudio').val().trim();
            if (selectedFile.length > 4) {
                $exeDevice.stopSound();
                $exeDevice.playSound(selectedFile);
            }
        });

        $('#seleccionaEURLAudio').on('change', function () {
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
        $('#seleccionaEHasFeedBack').on('change', function () {
            var marcado = $(this).is(':checked');
            if (marcado) {
                $('#seleccionaEFeedbackP').slideDown();
            } else {
                $('#seleccionaEFeedbackP').slideUp();
            }
            $('#seleccionaEPercentajeFB').prop('disabled', !marcado);
        });

        $('#gameQEIdeviceForm').on('click', 'input.gameQE-TypeGame', function (e) {
            var gm = parseInt($(this).val()),
                fb = $('#seleccionaEHasFeedBack').is(':checked'),
                ul = $('#seleccionaEUseLives').is(':checked');
            $exeDevice.updateGameMode(gm, fb, ul);
        });

        $('.gameQE-TypeOrder').on('click', function (e) {
            var type = parseInt($(this).val()),
                messages = $('#seleccionaECustomMessages').is(':checked'),
                customS = $('#seleccionaECustomScore').is(':checked');
            $exeDevice.showSelectOrder(type, messages, customS);

        });

        $('#seleccionaECustomMessages').on('change', function () {
            var messages = $(this).is(':checked'),
                type = parseInt($('input[name=slcgameorder]:checked').val()),
                customS = $('#seleccionaECustomScore').is(':checked');
            $exeDevice.showSelectOrder(type, messages, customS);
        });
        // Help link
        $("#seleccionaEGameModeHelpLnk").click(function () {
            $("#seleccionaEGameModeHelp").toggle();
            return false;
        });

        $("#seleccionaEOrderHelpLnk").click(function () {
            $("#seleccionaEOrderHelp").toggle();
            return false;
        });
        $('#seleccionaEPercentajeQuestions').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 3);
            this.value = v;
            if (this.value > 0 && this.value < 101) {
                $exeDevice.updateQuestionsNumber();
            }
        });
        $('#seleccionaEPercentajeQuestions').on('click', function () {
            $exeDevice.updateQuestionsNumber();
        });
        $('#seleccionaEPercentajeQuestions').on('focusout', function () {
            this.value = this.value.trim() == '' ? 100 : this.value;
            this.value = this.value > 100 ? 100 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
            $exeDevice.updateQuestionsNumber();
        });
        $('#seleccionaENumberQuestion').keyup(function (e) {
            if (e.keyCode == 13) {
                var num = parseInt($(this).val());
                if (!isNaN(num) && num > 0) {
                    if ($exeDevice.validateQuestion() != false) {
                        $exeDevice.active = num < $exeDevice.selectsGame.length ? num - 1 : $exeDevice.selectsGame.length - 1;
                        $exeDevice.showQuestion($exeDevice.active);

                    } else {
                        $(this).val($exeDevice.active + 1)
                    }
                } else {
                    $(this).val($exeDevice.active + 1)
                }

            }
        });
        $exeAuthoring.iDevice.gamification.itinerary.addEvents();
    },
    showSelectOrder: function (type, messages, custonmScore) {
        if (type == 2 || messages) {
            $('.gameQE-EOrders').slideDown();
        } else {
            $('.gameQE-EOrders').slideUp();
        }
        $('#seleccionaECustomMessages').prop('disabled', type == 2);
        $('#seleccionaEPercentajeQuestions').prop('disabled', type == 2);
        if (type == 2) {
            $('#seleccionaGotoCorrect').show();
            $('#seleccionaGotoIncorrect').show();
            $('label[for="seleccionaGotoCorrect"]').show();
            $('label[for="seleccionaGotoIncorrect"]').show();
        } else {
            $('#seleccionaGotoCorrect').hide();
            $('#seleccionaGotoIncorrect').hide();
            $('label[for="seleccionaGotoCorrect"]').hide();
            $('label[for="seleccionaGotoIncorrect"]').hide();
        }
        $('#seleccionaEScoreQuestionDiv').hide();
        if (type == 2 || custonmScore) {
            $('#seleccionaEScoreQuestionDiv').show();
        }
    },

    clickSolution: function (checked, value) {
        var solutions = $('#selecionaESolutionSelect').text();

        if (checked) {
            if (solutions.indexOf(value) == -1) {
                solutions += value;
            }
        } else {
            solutions = solutions.split(value).join('')
        }
        $('#selecionaESolutionSelect').text(solutions);
    },
    clickImage: function (img, epx, epy) {
        var $cursor = $('#seleccionaECursor'),
            $x = $('#seleccionaEXImage'),
            $y = $('#seleccionaEYImage'),
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
    importGame: function (content) {
        var game = $exeDevice.isJsonString(content);
        if (!game || typeof game.typeGame == "undefined") {
            $exeDevice.showMessage($exeDevice.msgs.msgESelectFile);
            return;
        } else if (game.typeGame == 'Selecciona') {
            game.selectsGame = $exeDevice.importSelecciona(game);
            $exeDevice.active = 0;
            $exeDevice.updateFieldGame(game);
            var instructions = game.instructionsExe || game.instructions,
                tAfter = game.textAfter || "",
                textFeedBack = game.textFeedBack || "";
            tinyMCE.get('eXeGameInstructions').setContent(unescape(instructions));
            tinyMCE.get('eXeIdeviceTextAfter').setContent(unescape(tAfter));
            tinyMCE.get('seleccionaEFeedBackEditor').setContent(unescape(textFeedBack));
        } else if (game.typeGame == 'Oca') {
            $exeDevice.selectsGame = $exeDevice.importSelecciona(game);
            $exeDevice.updateSelectOrder();
        } else if (game.typeGame == 'QuExt') {
            $exeDevice.selectsGame = $exeDevice.importQuExt(game);
            $exeDevice.updateSelectOrder();
        } else if (game.typeGame == 'Adivina') {
            $exeDevice.selectsGame = $exeDevice.importAdivina(game);
            $exeDevice.updateSelectOrder();
        } else if (game.typeGame == 'Rosco') {
            $exeDevice.selectsGame = $exeDevice.importRosco(game);
            $exeDevice.updateSelectOrder();
        } else {
            $exeDevice.showMessage($exeDevice.msgs.msgESelectFile);
            return;
        }
        $exeDevice.active = 0;
        $exeDevice.deleteEmptyQuestion();
        $exeDevice.showQuestion($exeDevice.active);
        $('.exe-form-tabs li:first-child a').click();
    },
    importQuExt: function (data) {
        for (var i = 0; i < data.questionsGame.length; i++) {
            var p = $exeDevice.getCuestionDefault();
            var cuestion = data.questionsGame[i],
                solution = 'ABCD';
            p.typeSelect = 0;
            p.type = cuestion.type;
            p.time = cuestion.time;
            p.numberOptions = cuestion.numberOptions;
            p.url = cuestion.url;
            p.x = cuestion.x;
            p.y = cuestion.y;
            p.author = cuestion.author;
            p.alt = cuestion.alt;
            p.soundVideo = cuestion.soundVideo;
            p.imageVideo = cuestion.imageVideo;
            p.iVideo = cuestion.iVideo;
            p.fVideo = cuestion.fVideo;
            p.eText = cuestion.eText;
            p.quextion = cuestion.quextion;
            p.options = [];
            for (var j = 0; j < cuestion.options.length; j++) {
                p.options.push(cuestion.options[j]);
            }
            var numOpt = 0;
            for (var j = 0; j < p.options.length; j++) {
                if (p.options[j].trim().length == 0) {
                    p.numberOptions = numOpt;
                    break;
                }
                numOpt++;
            }
            if (p.type == 3) {
                p.eText = unescape(p.eText)
            }
            p.audio = typeof cuestion.audio == "undefined" ? "" : cuestion.audio;
            p.hit = typeof cuestion.hit == "undefined" ? -1 : cuestion.hit;
            p.error = typeof cuestion.error == "undefined" ? -1 : cuestion.error;
            p.msgHit = typeof cuestion.msgHit == "undefined" ? "" : cuestion.msgHit;
            p.msgError = typeof cuestion.msgError == "undefined" ? "" : cuestion.msgError;
            p.options = cuestion.options;
            p.solution = solution.charAt(cuestion.solution);
            p.silentVideo = cuestion.silentVideo;
            p.tSilentVideo = cuestion.tSilentVideo;
            p.solutionQuestion = '';
            p.percentageShow = 35;
            $exeDevice.selectsGame.push(p);
        }
        return $exeDevice.selectsGame;
    },
    deleteEmptyQuestion: function () {
        if ($exeDevice.selectsGame.length > 1) {
            var quextion = $('#seleccionaEQuestion').val().trim(),
                typeSelect = parseInt($('input[name=slctypeselect]:checked').val()),
                solutionQuestion = "";
            if (typeSelect == 2) {
                solutionQuestion = $('#seleccionaESolutionWord').val();
                quextion = $('#seleccionaEDefinitionWord').val().trim();
                if (quextion.length == 0 && solutionQuestion.length == 0) {
                    $exeDevice.removeQuestion();
                }
            } else {
                var empty = true;
                $('.gameQE-EAnwersOptions').each(function (i) {
                    var option = $(this).val().trim();
                    if (option.length > 0) {
                        empty = false;
                    }
                });
                if (quextion.length == 0 && solutionQuestion.length == 0) {
                    $exeDevice.removeQuestion();
                }
            }
        }
    },
    extractURLGD: function (urlmedia) {
        var sUrl = urlmedia;
        if (typeof urlmedia != "undefined" && urlmedia.length > 0 && urlmedia.toLowerCase().indexOf("https://drive.google.com") == 0 && urlmedia.toLowerCase().indexOf("sharing") != -1) {
            sUrl = sUrl.replace(/https:\/\/drive\.google\.com\/file\/d\/(.*?)\/.*?\?usp=sharing/g, "https://docs.google.com/uc?export=open&id=$1");
        }
        return sUrl;
    },
    importAdivina: function (data) {
        for (var i = 0; i < data.wordsGame.length; i++) {
            var p = $exeDevice.getCuestionDefault();
            var cuestion = data.wordsGame[i];
            p.typeSelect = 2;
            p.type = cuestion.url.length > 10 ? 1 : 0;
            p.time = cuestion.time || $exeDevice.getIndexTime(data.timeQuestion);
            p.numberOptions = 4;
            p.url = cuestion.url;
            p.x = cuestion.x;
            p.y = cuestion.y;
            p.author = cuestion.author;
            p.alt = cuestion.alt;
            p.soundVideo = 1;
            p.imageVideo = 1;
            p.iVideo = 0;
            p.fVideo = 0;
            p.eText = '';
            p.quextion = cuestion.definition;
            p.options = [];
            p.options.push('');
            p.options.push('');
            p.options.push('');
            p.options.push('');
            p.audio = typeof cuestion.audio == "undefined" ? "" : cuestion.audio;
            p.hit = typeof cuestion.hit == "undefined" ? -1 : cuestion.hit;
            p.error = typeof cuestion.error == "undefined" ? -1 : cuestion.error;
            p.msgHit = typeof cuestion.msgHit == "undefined" ? "" : cuestion.msgHit;
            p.msgError = typeof cuestion.msgError == "undefined" ? "" : cuestion.msgError;
            p.solution = '';
            p.silentVideo = 0;
            p.tSilentVideo = 0;
            p.solutionQuestion = cuestion.word;
            p.percentageShow = cuestion.percentageShow || data.percentageShow;
            $exeDevice.selectsGame.push(p);
        }
        return $exeDevice.selectsGame;
    },
    importRosco: function (data) {
        for (var i = 0; i < data.wordsGame.length; i++) {
            var p = $exeDevice.getCuestionDefault(),
                cuestion = data.wordsGame[i],
                start = cuestion.type = 1 ? $exeDevice.msgs.msgContaint.replace('%1', cuestion.letter) : $exeDevice.msgs.msgStartWith.replace('%1', cuestion.letter);
            p.typeSelect = 2;
            p.type = cuestion.url.length > 10 ? 1 : 0;
            p.time = cuestion.time || $exeDevice.getIndexTime(data.timeQuestion);
            p.numberOptions = 4;
            p.url = cuestion.url;
            p.x = cuestion.x;
            p.y = cuestion.y;
            p.author = cuestion.author;
            p.alt = cuestion.alt;
            p.soundVideo = 1;
            p.imageVideo = 1;
            p.iVideo = 0;
            p.fVideo = 0;
            p.eText = '';
            p.quextion = start + ': ' + cuestion.definition;
            p.options = [];
            p.options.push('');
            p.options.push('');
            p.options.push('');
            p.options.push('');
            p.audio = typeof cuestion.audio == "undefined" ? "" : cuestion.audio;
            p.hit = typeof cuestion.hit == "undefined" ? -1 : cuestion.hit;
            p.error = typeof cuestion.error == "undefined" ? -1 : cuestion.error;
            p.msgHit = typeof cuestion.msgHit == "undefined" ? "" : cuestion.msgHit;
            p.msgError = typeof cuestion.msgError == "undefined" ? "" : cuestion.msgError;
            p.solution = '';
            p.silentVideo = 0;
            p.tSilentVideo = 0;
            p.solutionQuestion = cuestion.word;
            p.percentageShow = cuestion.percentageShow || data.percentageShow;
            if (p.solutionQuestion.trim().length > 0) {
                $exeDevice.selectsGame.push(p);
            }
        }
        return $exeDevice.selectsGame;
    },
    importSelecciona: function (data) {
        for (var i = 0; i < data.selectsGame.length; i++) {
            var p = $exeDevice.getCuestionDefault();
            var cuestion = data.selectsGame[i];
            p.typeSelect = cuestion.typeSelect;
            p.type = cuestion.type;
            p.time = cuestion.time;
            p.numberOptions = cuestion.numberOptions;
            p.url = cuestion.url;
            p.x = cuestion.x;
            p.y = cuestion.y;
            p.author = cuestion.author;
            p.alt = cuestion.alt;
            p.soundVideo = cuestion.soundVideo;
            p.imageVideo = cuestion.imageVideo;
            p.iVideo = cuestion.iVideo;
            p.fVideo = cuestion.fVideo;
            p.eText = cuestion.eText;
            p.quextion = cuestion.quextion;
            p.options = [];
            for (var j = 0; j < cuestion.options.length; j++) {
                p.options.push(cuestion.options[j]);
            }
            var numOpt = 0;
            for (var j = 0; j < p.options.length; j++) {
                if (p.options[j].trim().length == 0) {
                    p.numberOptions = numOpt;
                    break;
                }
                numOpt++;
            }
            if (p.type == 3) {
                p.eText = unescape(p.eText)
            }
            p.audio = typeof cuestion.audio == "undefined" ? "" : cuestion.audio;
            p.hit = typeof cuestion.hit == "undefined" ? -1 : cuestion.hit;
            p.error = typeof cuestion.error == "undefined" ? -1 : cuestion.error;
            p.msgHit = typeof cuestion.msgHit == "undefined" ? "" : cuestion.msgHit;
            p.msgError = typeof cuestion.msgError == "undefined" ? "" : cuestion.msgError;
            p.options = cuestion.options;
            p.solution = cuestion.solution;
            p.silentVideo = cuestion.silentVideo;
            p.tSilentVideo = cuestion.tSilentVideo;
            p.solutionQuestion = cuestion.solutionQuestion;
            p.percentageShow = cuestion.percentageShow;
            $exeDevice.selectsGame.push(p);
        }
        return $exeDevice.selectsGame;
    },
    getIndexTime: function (time) {
        var index = 0;
        switch (time) {
            case 15:
                index = 0;
                break;
            case 30:
                index = 1;
                break;
            case 60:
                index = 2;
                break;
            case 180:
                index = 3;
                break;
            case 300:
                index = 4;
            case 600:
                index = 5;
                break;
            case 900:
                index = 6;
                break;
            default:
                index = time;
                break;
        }
        return index;
    }
}