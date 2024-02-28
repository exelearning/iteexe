/**
 * QuExt Activity iDevice (edition code)
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
        name: _('QuExt Activity')
    },
    iDevicePath: "/scripts/idevices/quext-activity/edition/",
    msgs: {},
    active: 0,
    questionsGame: [],
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
    version: 2,
    isVideoType: false,
    isVideoIntro: 0,
    localPlayer: null,
    localPlayerIntro: null,
    id: false,
    ci18n: {
        "msgStartGame": _("Click here to start"),
        "msgSubmit": _("Submit"),
        "msgClue": _("Cool! The clue is:"),
        "msgNewGame": _("Click here for a new game"),
        "msgCodeAccess": _("Access code"),
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
        "msgScoreScorm": _("The score can't be saved because this page is not part of a SCORM package."),
        "msgQuestion": _("Question"),
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
        "msgVideoIntro": _("Video Intro"),
        "msgClose": _("Close"),
        "msgOption": _("Option"),
        "msgUseFulInformation": _("and information that will be very useful"),
        "msgLoading": _("Loading. Please wait..."),
        "msgPoints": _("points"),
        "msgAudio": _("Audio"),
        "msgEndGameScore": _("Please start playing first..."),
        "msgUncompletedActivity": _("Incomplete activity"),
        "msgSuccessfulActivity": _("Activity: Passed. Score: %s"),
        "msgUnsuccessfulActivity": _("Activity: Not passed. Score: %s"),
        "msgTypeGame": _('QuExt')
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
        msgs.msgEOneQuestion = _("Please provide at least one question");
        msgs.msgEUnavailableVideo = _("This video is not currently available")
        msgs.msgECompleteQuestion = _("You have to complete the question");
        msgs.msgECompleteAllOptions = _("You have to complete all the selected options");
        msgs.msgESelectSolution = _("Choose the right answer");
        msgs.msgECompleteURLYoutube = _("Please type or paste a valid URL.");
        msgs.msgEStartEndVideo = _("You have to indicate the start and the end of the video that you want to show");
        msgs.msgEStartEndIncorrect = _("The video end value must be higher than the start one");
        msgs.msgWriteText = _("You have to type a text in the editor");
        msgs.msgSilentPoint = _("The silence time is wrong. Check the video duration.");
        msgs.msgTimeFormat = _("Please check the time format: hh:mm:ss");
        msgs.msgProvideFB = _('Message to display when passing the game');
        msgs.msgNoSuportBrowser = _("Your browser is not compatible with this tool.");

    },
    loadYoutubeApi: function () {
        onYouTubeIframeAPIReady = $exeDevice.youTubeReady;
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    },
    youTubeReady: function () {
        $("#quextMediaVideo").prop("disabled", false);
        $exeDevice.player = new YT.Player('quextEVideo', {
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
        $exeDevice.playerIntro = new YT.Player('quextEVI', {
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
            var idv = $exeDevice.getIDYoutube($('#quextEVideoIntro').val()),
                iVI = $exeDevice.hourToSeconds($('#quextEVIStart').val()),
                fVI = $exeDevice.hourToSeconds($('#quextEVIEnd').val()) > 0 ? $exeDevice.hourToSeconds($('#quextEVIEnd').val()) : 9000;
            if (fVI <= iVI) {
                $exeDevice.showMessage($exeDevice.msgs.msgEStartEndIncorrect);
                return;
            }
            $('#quextEVIURL').val($('#quextEVideoIntro').val());
            $('#quextEVIDiv').show();
            $('#quextEVINo').hide();
            $('#quextENumQuestionDiv').hide();
            $exeDevice.startVideoIntro(idv, iVI, fVI);
        } else if ($exeDevice.isVideoIntro == 2) {
            var idv = $exeDevice.getIDYoutube($('#quextEVIURL').val()),
                iVI = $exeDevice.hourToSeconds($('#quextEVIStart').val()),
                fVI = $exeDevice.hourToSeconds($('#quextEVIEnd').val()) > 0 ? $exeDevice.hourToSeconds($('#quextEVIEnd').val()) : 9000;
            if (fVI <= iVI) {
                $exeDevice.showMessage($exeDevice.msgs.msgEStartEndIncorrect);
                return;
            }
            $exeDevice.startVideoIntro(idv, iVI, fVI);
        }
    },
    
    updateTimerDisplayVILocal: function () {
        if ($exeDevice.localPlayerIntro) {
            var currentTime = $exeDevice.localPlayerIntro.currentTime;
            if (currentTime) {
                var time = $exeDevice.secondsToHour(Math.floor(currentTime));
                $('#quextEVITime').text(time);
                if (Math.ceil(currentTime) == $exeDevice.pointEndIntro || Math.ceil(currentTime) == $exeDevice.durationVideo) {
                    $exeDevice.localPlayerIntro.pause();
                    $exeDevice.pointEndIntro = 100000;
                }
            }
        }
    },

    updateTimerDisplayLocal: function () {
        if ($exeDevice.localPlayer) {
            var currentTime = $exeDevice.localPlayer.currentTime;
            if (currentTime) {
                var time = $exeDevice.secondsToHour(Math.floor(currentTime));
                $('#quextEVideoTime').text(time);
                $exeDevice.updateSoundVideoLocal();
                if (Math.ceil(currentTime) == $exeDevice.pointEnd || Math.ceil(currentTime) == $exeDevice.durationVideo) {
                    $exeDevice.localPlayer.pause();
                    $exeDevice.pointEnd = 100000;
                }
            }
        }
    },

    updateTimerDisplay: function () {
        if ($exeDevice.player) {
            if (typeof $exeDevice.player.getCurrentTime === "function") {
                var time = $exeDevice.secondsToHour($exeDevice.player.getCurrentTime());
                $('#quextEVideoTime').text(time);
                $exeDevice.updateSoundVideo();
            }
        }
    },

    updateTimerVIDisplay: function () {
        if ($exeDevice.playerIntro) {
            if (typeof $exeDevice.playerIntro.getCurrentTime === "function") {
                var time = $exeDevice.secondsToHour($exeDevice.playerIntro.getCurrentTime());
                $('#quextEVITime').text(time);
            }
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
    updateSoundVideoLocal: function () {
        if ($exeDevice.activeSilent) {
            if ($exeDevice.localPlayer) {
                if ($exeDevice.localPlayer.currentTime) {
                    var time = Math.round($exeDevice.localPlayer.currentTime);
                    if (time == $exeDevice.silentVideo) {
                        $exeDevice.localPlayer.muted = true;
                    } else if (time == $exeDevice.endSilent) {
                        $exeDevice.localPlayer.muted = false;
                    }
                }
            }
        }
    },
    updateProgressBar: function () {
        $('#progress-bar').val((player.getCurrentTime() / player.getDuration()) * 100);
    },
    onPlayerError: function (event) {
        //$exeDevice.showMessage("El video  no está disponible")

    },
    startVideo: function (id, start, end, type) {
        var mstart = start < 1 ? 0.1 : start;
        if (type > 0) {
            if ($exeDevice.localPlayer) {
                $exeDevice.pointEnd = end;
                $exeDevice.localPlayer.src = id
                $exeDevice.localPlayer.currentTime = parseFloat(start)
                $exeDevice.localPlayer.play();
            }
            $('#quextEVideoTime').show();
            clearInterval($exeDevice.timeUpdateInterval);
            $exeDevice.timeUpdateInterval = setInterval(function () {
                $exeDevice.updateTimerDisplayLocal();
            }, 1000);
            return
        }
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
    startVideoIntro: function (id, start, end, type) {
        var mstart = start < 1 ? 0.1 : start;
        $('#quextEVI').hide();
        $('#quextEVILocal').hide();
        if (type > 0) {
            if ($exeDevice.localPlayerIntro) {
                $exeDevice.pointEndIntro = end;
                $exeDevice.localPlayerIntro.src = id
                $exeDevice.localPlayerIntro.currentTime = parseFloat(start)
                $exeDevice.localPlayerIntro.play();

            }
            clearInterval($exeDevice.timeUpdateVIInterval);
            $exeDevice.timeUpdateVIInterval = setInterval(function () {
                $exeDevice.updateTimerDisplayVILocal();
            }, 1000);
            $('#quextEVILocal').show();
            return
        }
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
            $('#quextEVI').show();
        }
    },
    stopVideoIntro: function () {
        if ($exeDevice.localPlayerIntro) {
            clearInterval($exeDevice.timeUpdateInterval);
            if (typeof $exeDevice.localPlayerIntro.pause == "function") {
                $exeDevice.localPlayerIntro.pause();
            }
        }
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
        if ($exeDevice.localPlayer) {
            clearInterval($exeDevice.timeUpdateInterval);
            if (typeof $exeDevice.localPlayer.pause == "function") {
                $exeDevice.localPlayer.pause();
            }
        }
        if ($exeDevice.player) {
            clearInterval($exeDevice.timeUpdateInterval);
            if (typeof $exeDevice.player.pauseVideo === "function") {
                $exeDevice.player.pauseVideo();
            }
        }
    },
    muteVideo: function (mute) {
        if ($exeDevice.localPlayer) {
            if (mute) {
                $exeDevice.localPlayer.muted = true;
            } else {
                $exeDevice.localPlayer.muted = false;
            }
        }
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
            $exeDevice.questionsGame.push($exeDevice.getCuestionDefault());
            $exeDevice.active = $exeDevice.questionsGame.length - 1;
            $exeDevice.typeEdit = -1;
            $('#quextEPaste').hide();
            $('#quextENumQuestions').text($exeDevice.questionsGame.length);
            $('#quextENumberQuestion').val($exeDevice.questionsGame.length);
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
            $('#quextEPaste').hide();
            $('#quextENumQuestions').text($exeDevice.questionsGame.length);
            $('#quextENumberQuestion').val($exeDevice.active + 1);
            $exeDevice.updateQuestionsNumber();
        }

    },
    copyQuestion: function () {
        if ($exeDevice.validateQuestion() != false) {
            $exeDevice.typeEdit = 0;
            $exeDevice.clipBoard = $exeDevice.questionsGame[$exeDevice.active];
            $('#quextEPaste').show();
        }

    },
    cutQuestion: function () {
        if ($exeDevice.validateQuestion() != false) {
            $exeDevice.numberCutCuestion = $exeDevice.active;
            $exeDevice.typeEdit = 1;
            $('#quextEPaste').show();

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
            $('#quextEPaste').hide();
            $exeDevice.typeEdit = -1;
            $exeDevice.arrayMove($exeDevice.questionsGame, $exeDevice.numberCutCuestion, $exeDevice.active);
            $exeDevice.showQuestion($exeDevice.active);
            $('#quextENumQuestions').text($exeDevice.questionsGame.length);
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
    updateQuestionsNumber: function () {
        var percentaje = parseInt($exeDevice.removeTags($('#quextEPercentajeQuestions').val()));
        if (isNaN(percentaje)) {
            return;
        }
        percentaje = percentaje < 1 ? 1 : percentaje;
        percentaje = percentaje > 100 ? 100 : percentaje;
        var num = Math.round((percentaje * $exeDevice.questionsGame.length) / 100);
        num = num == 0 ? 1 : num;
        $('#quextENumeroPercentaje').text(num + "/" + $exeDevice.questionsGame.length)
    },
    showQuestion: function (i) {
        var num = i < 0 ? 0 : i;
        num = num >= $exeDevice.questionsGame.length ? $exeDevice.questionsGame.length - 1 : num;
        var p = $exeDevice.questionsGame[num],
            numOptions = 0;
        $('.gameQE-EAnwersOptions').each(function (j) {
            numOptions++;
            if (p.options[j].trim() !== '') {
                p.numOptions = numOptions;
            }
            $(this).val(p.options[j]);
        });
        $exeDevice.stopVideo();
        $exeDevice.changeTypeQuestion(p.type);
        $exeDevice.showOptions(p.numberOptions);
        $('#quextEQuestion').val(p.quextion);
        $('#quextENumQuestions').text($exeDevice.questionsGame.length);
        if (p.type == 1) {
            $('#quextEURLImage').val(p.url);
            $('#quextEXImage').val(p.x);
            $('#quextEYImage').val(p.y);
            $('#quextEAuthor').val(p.author);
            $('#quextEAlt').val(p.alt);
            $exeDevice.showImage(p.url, p.x, p.y, p.alt);
        } else if (p.type == 2) {
            $('#quextECheckSoundVideo').prop('checked', p.soundVideo == 1);
            $('#quextECheckImageVideo').prop('checked', p.imageVideo == 1);
            $('#quextEURLYoutube').val(p.url);
            $('#quextEInitVideo').val($exeDevice.secondsToHour(p.iVideo));
            $('#quextEEndVideo').val($exeDevice.secondsToHour(p.fVideo));
            $('#quextESilenceVideo').val($exeDevice.secondsToHour(p.silentVideo));
            $('#quextETimeSilence').val(p.tSilentVideo);
            $exeDevice.silentVideo = p.silentVideo;
            $exeDevice.tSilentVideo = p.tSilentVideo;
            $exeDevice.activeSilent = (p.soundVideo == 1) && (p.tSilentVideo > 0) && (p.silentVideo >= p.iVideo) && (p.iVideo < p.fVideo);
            $exeDevice.endSilent = p.silentVideo + p.tSilentVideo;
            if ($exeDevice.getIDYoutube(p.url)) {
                if (typeof YT == "undefined") {
                    $exeDevice.isVideoType = true;
                    $exeDevice.loadYoutubeApi();
                } else {
                    $exeDevice.showVideoQuestion();
                }
            } else if ($exeDevice.getURLVideoMediaTeca(p.url)) {
                $exeDevice.showVideoQuestion();
            }
        } else if (p.type == 3) {
            tinyMCE.get('quextEText').setContent(unescape(p.eText));
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
        $('#quextEURLAudio').val(p.audio);

        $('#quextENumberQuestion').val(i + 1);
        $('#quextEScoreQuestion').val(1);
        if (typeof (p.customScore) != "undefined") {
            $('#quextEScoreQuestion').val(p.customScore);
        }
        $('#quextEMessageKO').val(p.msgError);
        $('#quextEMessageOK').val(p.msgHit);
        $("input.gameQE-Number[name='qxtnumber'][value='" + p.numberOptions + "']").prop("checked", true)
        $("input.gameQE-Type[name='qxtype'][value='" + p.type + "']").prop("checked", true);
        $("input.gameQE-ESolution[name='qxsolution'][value='" + p.solution + "']").prop("checked", true);
        $("input.gameQE-Times[name='qxttime'][value='" + p.time + "']").prop("checked", true);


    },
    showVideoQuestion: function () {
        var soundVideo = $('#quextECheckSoundVideo').is(':checked') ? 1 : 0,
            imageVideo = $('#quextECheckImageVideo').is(':checked') ? 1 : 0,
            iVideo = $exeDevice.hourToSeconds($('#quextEInitVideo').val()),
            fVideo = $exeDevice.hourToSeconds($('#quextEEndVideo').val()),
            url = $('#quextEURLYoutube').val().trim(),
            id = $exeDevice.getIDYoutube(url),
            idLocal = $exeDevice.getURLVideoMediaTeca(url),
            type = id ? 0 : 1;
        $exeDevice.silentVideo = $exeDevice.hourToSeconds($('#quextESilenceVideo').val().trim());
        $exeDevice.tSilentVideo = parseInt($('#quextETimeSilence').val());
        $exeDevice.activeSilent = (soundVideo == 1) && ($exeDevice.tSilentVideo > 0) && ($exeDevice.silentVideo >= iVideo) && (iVideo < fVideo);
        $exeDevice.endSilent = $exeDevice.silentVideo + $exeDevice.tSilentVideo;
        if (fVideo <= iVideo) fVideo = 36000;
        $('#quextENoImageVideo').hide();
        $('#quextENoVideo').show();
        $('#quextEVideo').hide();
        $('#quextEVideoLocal').hide();
        if (id || idLocal) {
            if (id) {
                $exeDevice.startVideo(id, iVideo, fVideo, 0);
            } else {
                $exeDevice.startVideo(idLocal, iVideo, fVideo, 1);
            }
            $('#quextENoVideo').hide();
            if (imageVideo == 0) {
                $('#quextENoImageVideo').show();
            } else {
                if (type == 0) {
                    $('#quextEVideo').show();
                } else {
                    $('#quextEVideoLocal').show();
                }
            }
            if (soundVideo == 0) {
                $exeDevice.muteVideo(true)
            } else {
                $exeDevice.muteVideo(false)
            }
        } else {
            $exeDevice.showMessage($exeDevice.msgs.msgEUnavailableVideo);
            $('#quextENoVideo').show();
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
        var $image = $('#quextEImage'),
            $cursor = $('#quextECursor');
        $image.hide();
        $cursor.hide();
        $image.attr('alt', alt);
        $('#quextENoImage').show();
        url = $exeDevice.extractURLGD(url);
        $image.prop('src', url)
            .on('load', function () {
                if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                    return false;
                } else {
                    var mData = $exeDevice.placeImageWindows(this, this.naturalWidth, this.naturalHeight);
                    $exeDevice.drawImage(this, mData);
                    $image.show();
                    $('#quextENoImage').hide();
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
        $exeDevice.changeTypeQuestion(0);
        $exeDevice.showOptions(4);
        $exeDevice.showSolution(0);
        //$("input.myclass[name='myname'][value='the_value']").prop("checked", true);
        $('.gameQE-Type')[0].checked = true;
        $('.gameQE-Times')[0].checked = true;
        $('.gameQE-Number')[2].checked = true;
        $('#quextEURLImage').val('');
        $('#quextEXImage').val('0');
        $('#quextEYImage').val('0');
        $('#quextEAuthor').val('');
        $('#quextEAlt').val('');
        $('#quextEURLYoutube').val('');
        $('#quextEURLAudio').val('');
        $('#quextEInitVideo').val('00:00:00');
        $('#quextEEndVideo').val('00:00:00');
        $('#quextECheckSoundVideo').prop('checked', true);
        $('#quextECheckImageVideo').prop('checked', true);
        tinyMCE.get('quextEText').setContent('');
        $('#quextEQuestion').val('');
        $('.gameQE-EAnwersOptions').each(function () {
            $(this).val('');
        });
        $('#quextEMessageOK').val('');
        $('#quextEMessageKO').val('');
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

        $('#quextETitleAltImage').hide();
        $('#quextEAuthorAlt').hide();
        $('#quextETitleImage').hide();
        $('#quextEInputImage').hide();
        $('#quextETitleVideo').hide();
        $('#quextEInputVideo').hide();
        $('#quextEInputAudio').show();
        $('#quextETitleAudio').show();
        $('#quextEInputOptionsVideo').hide();
        $('#quextInputOptionsImage').hide();
        if (tinyMCE.get('quextEText')) {
            tinyMCE.get('quextEText').hide();
        }
        $('#quextEText').hide();
        $('#quextEVideo').hide();
        $('#quextEVideoLocal').hide();
        $('#quextEImage').hide();
        $('#quextENoImage').hide();
        $('#quextECover').hide();
        $('#quextECursor').hide();
        $('#quextENoImageVideo').hide();
        $('#quextENoVideo').hide();
        switch (type) {
            case 0:
                $('#quextECover').show();
                break;
            case 1:
                $('#quextENoImage').show();
                $('#quextETitleImage').show();
                $('#quextEInputImage').show();
                $('#quextEAuthorAlt').show();
                $('#quextECursor').show();
                $('#quextInputOptionsImage').show();
                $exeDevice.showImage($('#quextEURLImage').val(), $('#quextEXImage').val(), $('#quextEYImage').val(), $('#quextEAlt').val(), 0)
                break;
            case 2:
                $('#quextEImageVideo').show();
                $('#quextETitleVideo').show();
                $('#quextEInputVideo').show();
                $('#quextENoVideo').show();
                $('#quextEVideo').show();
                $('#quextEInputOptionsVideo').show();
                $('#quextEInputAudio').hide();
                $('#quextETitleAudio').hide();
                break;
            case 3:
                $('#quextEText').show();
                if (tinyMCE.get('quextEText')) {
                    tinyMCE.get('quextEText').show();
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
                $exeDevice.showSolution(0);
            }

        });
        $('.gameQE-EAnwersOptions').each(function (j) {
            if (j >= number) {
                $(this).val('');
            }

        });
    },
    showSolution: function (solution) {
        $('.gameQE-ESolution')[solution].checked = true;

    },
    createForm: function () {
        var path = $exeDevice.iDevicePath,
            html = '\
			<div id="gameQEIdeviceForm">\
                <div class="exe-idevice-info">' + _("Create activities in which students see a video, image or text and they have to choose the right answer.") + ' <a href="https://youtu.be/HsN_Gaverg4" hreflang="es" rel="lightbox"  target="_blank">' + _("Use Instructions") + '</a></div>\
				<div class="exe-form-tab" title="' + _('General settings') + '">\
                ' + $exeAuthoring.iDevice.gamification.instructions.getFieldset(_("Choose the right answer")) + '\
                    <fieldset class="exe-fieldset exe-fieldset-closed">\
                        <legend><a href="#">' + _("Options") + '</a></legend>\
                        <div>\
                            <p>\
                                <label for="quextEShowMinimize"><input type="checkbox" id="quextEShowMinimize">' + _("Show minimized.") + '</label>\
                            </p>\
                            <p>\
                                <label for="quextEQuestionsRamdon"><input type="checkbox" id="quextEQuestionsRamdon">' + _("Random questions") + '</label>\
                                <label for="quextEAnswersRamdon" class="gameQE-inlineOption"><input type="checkbox" id="quextEAnswersRamdon">' + _("Random options") + '</label>\
                            </p>\
                            <p>\
                                <label for="quextECustomMessages"><input type="checkbox" id="quextECustomMessages">' + _("Custom messages") + '. </label>\
                            </p>\
                            <p>\
                                <label for="quextEShowSolution"><input type="checkbox" checked id="quextEShowSolution">' + _("Show solutions") + '. </label>\
                                <label for="quextETimeShowSolution">' + _("Show solution time (seconds)") + ' <input type="number" name="quextETimeShowSolution" id="quextETimeShowSolution" value="3" min="1" max="9" /> </label>\
                            </p>\
                            <p>\
                                <label for="quextECustomScore"><input type="checkbox" id="quextECustomScore">' + _("Custom score") + '. </label>\
                            </p>\
                            <p>\
                                <strong class="GameModeLabel"><a href="#quextEGameModeHelp" id="quextEGameModeHelpLnk" class="GameModeHelpLink" title="' + _("Help") + '"><img src="' + path + 'quextIEHelp.gif" width="16" height="16" alt="' + _("Help") + '"/></a> ' + _("Score") + ':</strong>\
                                <input class="gameQE-TypeGame" checked="checked"  id="quextETypeActivity" type="radio" name="qxtgamemode" value="1" />\
                                <label for="quextETypeActivity">' + _("0 to 10") + '</label>\
								<input class="gameQE-TypeGame"  id="quextEGameMode" type="radio" name="qxtgamemode" value="0" />\
                                <label for="quextEGameMode">' + _("Points and lives") + '</label>\
                                <input class="gameQE-TypeGame"  id="quextETypeReto" type="radio" name="qxtgamemode" value="2" />\
                                <label for="quextETypeReto">' + _("No score") + '</label>\
                            </p>\
                            <div id="quextEGameModeHelp" class="gameQE-TypeGameHelp">\
                                <ul>\
                                    <li><strong>' + _("0 to 10") + ': </strong>' + _("No lives, 0 to 10 score, right/wrong answers counter... A more educational context.") + '</li>\
                                    <li><strong>' + _("Points and lives") + ': </strong>' + _("Just like a game: Try to get a high score (thousands of points) and not to loose your lives.") + '</li>\
                                    <li><strong>' + _("No score") + ': </strong>' + _("No score and no lives. You have to answer right to get some information (a feedback).") + '</li>\
                                </ul>\
                            </div>\
                            <p>\
                                <label for="quextEUseLives"><input type="checkbox" checked id="quextEUseLives"> ' + _("Use lives") + '. </label> \
                                <label for="quextENumberLives">' + _("Number of lives") + ':\
                                <input type="number" name="quextENumberLives" id="quextENumberLives" value="3" min="1" max="5" /> </label>\
                            </p>\
                            <p>\
                                <label for="quextEHasFeedBack"><input type="checkbox"  id="quextEHasFeedBack"> ' + _("Feedback") + '. </label> \
                                <label for="quextEPercentajeFB"><input type="number" name="quextEPercentajeFB" id="quextEPercentajeFB" value="100" min="5" max="100" step="5" disabled /> ' + _("&percnt; right to see the feedback") + ' </label>\
                            </p>\
                            <p id="quextEFeedbackP" class="gameQE-EFeedbackP">\
                                <textarea id="quextEFeedBackEditor" class="exe-html-editor"\></textarea>\
                            </p>\
                            <p class="gameQE-Flex">\
                                <label>' + _("Video Intro") + ':</label><input type="text" id="quextEVideoIntro" /><a href="#" class="gameQE-ButtonLink" id="quextEVideoIntroPlay"  title="' + _("Play video intro") + '"><img src="' + path + 'quextIEPlay.png" alt="Play" class="gameQE-EButtonImage" /></a>\
                            </p>\
                            <p>\
                                <label for="quextEPercentajeQuestions">% ' + _("Questions") + ':  <input type="number" name="quextEPercentajeQuestions" id="quextEPercentajeQuestions" value="100" min="1" max="100" /> </label>\
                                <span id="quextENumeroPercentaje">1/1</span>\
                             </p>\
                             <p>\
                                <strong class="GameModeLabel"><a href="#quextEEvaluationHelp" id="quextEEvaluationHelpLnk" class="GameModeHelpLink" title="' + _("Help") + '"><img src="' + path + 'quextIEHelp.gif"  width="16" height="16" alt="' + _("Help") + '"/></a></strong>\
								<label for="quextEEvaluation"><input type="checkbox" id="quextEEvaluation"> ' + _("Progress report") + '. </label> \
								<label for="quextEEvaluationID">' + _("Identifier") + ':\
								<input type="text" id="quextEEvaluationID" disabled/> </label>\
                            </p>\
                            <div id="quextEEvaluationHelp" class="gameQE-TypeGameHelp">\
                                <p>' +_("You must indicate the ID. It can be a word, a phrase or a number of more than four characters. You will use this ID to mark the activities covered by this progress report. It must be the same in all iDevices of a report and different in each report.") + '</p>\
                            </div>\
                        </div>\
                    </fieldset>\
                    <fieldset class="exe-fieldset">\
                        <legend><a href="#">' + _("Questions") + '</a></legend>\
                        <div class="gameQE-EPanel" id="quextEPanel">\
                            <div class="gameQE-EOptionsMedia">\
                                <div class="gameQE-EOptionsGame">\
                                    <p>\
                                        <span>' + _("Multimedia Type") + ':</span>\
                                        <span class="gameQE-EInputMedias">\
                                            <input class="gameQE-Type" checked="checked" id="quextMediaNormal" type="radio" name="qxtype" value="0" disabled />\
                                            <label for="quextMediaNormal">' + _("None") + '</label>\
                                            <input class="gameQE-Type"  id="quextMediaImage" type="radio" name="qxtype" value="1" disabled />\
                                            <label for="quextMediaImage">' + _("Image") + '</label>\
                                            <input class="gameQE-Type"  id="quextMediaVideo" type="radio" name="qxtype" value="2" disabled />\
                                            <label for="quextMediaVideo">' + _("Video") + '</label>\
                                            <input class="gameQE-Type"  id="quextMediaText" type="radio" name="qxtype" value="3" disabled />\
                                            <label for="quextMediaText">' + _("Text") + '</label>\
                                        </span>\
                                    </p>\
                                    <p>\
                                        <span>' + _("Options Number") + ':</span>\
                                        <span class="gameQE-EInputNumbers">\
                                            <input class="gameQE-Number" id="numQ2" type="radio" name="qxtnumber" value="2" />\
                                            <label for="numQ2">2</label>\
                                            <input class="gameQE-Number" id="numQ3" type="radio" name="qxtnumber" value="3" />\
                                            <label for="numQ3">3</label>\
                                            <input class="gameQE-Number" id="numQ4" type="radio" name="qxtnumber" value="4" checked="checked" />\
                                            <label for="numQ4">4</label>\
                                        </span>\
                                    </p>\
                                    <p>\
                                        <span>' + _("Time per question") + ':</span>\
                                        <span class="gameQE-EInputTimes">\
                                            <input class="gameQE-Times" checked="checked" id="q15s" type="radio" name="qxttime" value="0" />\
                                            <label for="q15s">15s</label>\
                                            <input class="gameQE-Times" id="q30s" type="radio" name="qxttime" value="1" />\
                                            <label for="q30s">30s</label>\
                                            <input class="gameQE-Times" id="q1m" type="radio" name="qxttime" value="2" />\
                                            <label for="q1m">1m</label>\
                                            <input class="gameQE-Times" id="q3m" type="radio" name="qxttime" value="3" />\
                                            <label for="q3m">3m</label>\
                                            <input class="gameQE-Times" id="q5m" type="radio" name="qxttime" value="4" />\
                                            <label for="q5m">5m</label>\
                                            <input class="gameQE-Times" id="q10m" type="radio" name="qxttime" value="5" />\
                                            <label for="q10m">10m</label>\
                                        </span>\
                                    </p>\
                                    <p id="quextEScoreQuestionDiv" class="gameQE-ScoreQuestionDiv">\
                                        <label for="quextEScoreQuestion">' + _("Score") + ':</label> <input type="number" name="quextEScoreQuestion" id="quextEScoreQuestion" value="1" min="0"  max="100" step="0.05"/>\
                                    </p>\
                                    <span class="gameQE-ETitleImage" id="quextETitleImage">' + _("Image URL") + '</span>\
                                    <div class="gameQE-Flex gameQE-EInputImage" id="quextEInputImage">\
                                        <label class="sr-av" for="quextEURLImage">' + _("Image URL") + '</label>\
                                        <input type="text" class="exe-file-picker gameQE-EURLImage"  id="quextEURLImage"/>\
                                        <a href="#" id="quextEPlayImage" class="gameQE-ENavigationButton gameQE-EPlayVideo" title="' + _("Show") + '"><img src="' + path + 'quextIEPlay.png"  alt="' + _("Show") + '" class="gameQE-EButtonImage b-play" /></a>\
                                    </div>\
                                    <div class="gameQE-EInputOptionsImage" id="quextInputOptionsImage">\
                                        <div class="gameQE-ECoord">\
                                            <label for="quextEXImage">X:</label>\
                                            <input id="quextEXImage" type="text" value="0" />\
                                            <label for="quextEXImage">Y:</label>\
                                            <input id="quextEYImage" type="text" value="0" />\
                                        </div>\
                                    </div>\
                                    <span class="gameQE-ETitleVideo" id="quextETitleVideo">' + _("URL") + '</span>\
                                    <div class="gameQE-Flex gameQE-EInputVideo" id="quextEInputVideo">\
                                        <label class="sr-av" for="quextEURLYoutube">' + _("Youtube URL") + '</label>\
                                        <input id="quextEURLYoutube" type="text" />\
                                        <a href="#" id="quextEPlayVideo" class="gameQE-ENavigationButton gameQE-EPlayVideo" title="' + _("Play video") + '"><img src="' + path + 'quextIEPlay.png" alt="' + _("Play video") + '" class="gameQE-EButtonImage" /></a>\
                                    </div>\
                                    <div class="gameQE-EInputOptionsVideo" id="quextEInputOptionsVideo">\
                                        <div>\
                                            <label for="quextEInitVideo">' + _("Start") + ':</label>\
                                            <input id="quextEInitVideo" type="text" value="00:00:00"  maxlength="8"  />\
                                            <label for="quextEEndVideo">' + _("End") + ':</label>\
                                            <input id="quextEEndVideo" type="text" value="00:00:00"  maxlength="8" />\
                                            <button class="gameQE-EVideoTime" id="quextEVideoTime" type="button">00:00:00</button>\
                                        </div>\
                                        <div>\
                                            <label for="quextESilenceVideo">' + _("Silence") + ':</label>\
                                            <input id="quextESilenceVideo" type="text" value="00:00:00"  required="required"  maxlength="8" />\
                                            <label for="quextETimeSilence">' + _("Time (s)") + ':</label>\
                                            <input type="number" name="quextETimeSilence" id="quextETimeSilence" value="0" min="0" max="120" /> \
                                        </div>\
                                        <div>\
                                            <label for="quextECheckSoundVideo">' + _("Audio") + ':</label>\
                                            <input id="quextECheckSoundVideo" type="checkbox" checked="checked" />\
                                            <label for="quextECheckImageVideo">' + _("Image") + ':</label>\
                                            <input id="quextECheckImageVideo" type="checkbox" checked="checked" />\
                                        </div>\
                                    </div>\
                                    <div class="gameQE-EAuthorAlt" id="quextEAuthorAlt">\
                                        <div class="gameQE-EInputAuthor" id="quextInputAuthor">\
                                            <label for="quextEAuthor">' + _("Authorship") + '</label>\
                                            <input id="quextEAuthor" type="text" />\
                                        </div>\
                                        <div class="gameQE-EInputAlt" id="quextInputAlt">\
                                            <label for="quextEAlt">' + _("Alternative text") + '</label>\
                                            <input id="quextEAlt" type="text" />\
                                        </div>\
                                    </div>\
                                    <span id="quextETitleAudio">' + _("Audio") + '</span>\
                                    <div class="gameQE-EInputAudio" id="quextEInputAudio">\
                                        <label class="sr-av" for="quextEURLAudio">' + _("URL") + '</label>\
                                        <input type="text" class="exe-file-picker gameQE-EURLAudio"  id="quextEURLAudio"/>\
                                        <a href="#" id="quextEPlayAudio" class="gameQE-ENavigationButton gameQE-EPlayVideo" title="' + _("Play audio") + '"><img src="' + path + 'quextIEPlay.png" alt="' + _("Play audio") + '" class="gameQE-EButtonImage b-play" /></a>\
                                    </div>\
                                </div>\
                                <div class="gameQE-EMultiMediaOption">\
                                    <div class="gameQE-EMultimedia" id="quextEMultimedia">\
                                        <textarea id="quextEText"></textarea>\
                                        <img class="gameQE-EMedia" src="' + path + 'quextIEImage.png" id="quextEImage" alt="' + _("Image") + '" />\
                                        <img class="gameQE-EMedia" src="' + path + 'quextIEImage.png" id="quextENoImage" alt="' + _("No image") + '" />\
                                        <div class="gameQE-EMedia" id="quextEVideo"></div>\
                                        <video class="gameQE-EMedia" id = "quextEVideoLocal" preload="auto" controls></video>\
                                        <img class="gameQE-EMedia" src="' + path + 'quextIENoImageVideo.png" id="quextENoImageVideo" alt="" />\
                                        <img class="gameQE-EMedia" src="' + path + 'quextIENoVideo.png" id="quextENoVideo" alt="" />\
                                        <img class="gameQE-ECursor" src="' + path + 'quextIECursor.gif" id="quextECursor" alt="" />\
                                        <img class="gameQE-EMedia" src="' + path + 'quextIECoverQuExt.png" id="quextECover" alt="' + _("No image") + '" />\
                                    </div>\
                                </div>\
                            </div>\
                            <div class="gameQE-EContents">\
                                    <span>' + _("Question") + '</span>\
                                   <div class="gameQE-EQuestionDiv">\
                                        <label class="sr-av">' + _("Question") + ':</label><input type="text" class="gameQE-EQuestion" id="quextEQuestion">\
                                   </div>\
                                   <div class="gameQE-EAnswers">\
                                    <div class="gameQE-EOptionDiv">\
                                        <label class="sr-av">' + _("Solution") + ' A:</label><input type="radio" class="gameQE-ESolution" name="qxsolution" id="quextESolution0" value="0" checked="checked" />\
                                        <label class="sr-av">' + _("Option") + ' A:</label><input type="text" class="gameQE-EOption0 gameQE-EAnwersOptions" id="quextEOption0">\
                                    </div>\
                                    <div class="gameQE-EOptionDiv">\
                                        <label class="sr-av">' + _("Solution") + ' B:</label><input type="radio" class="gameQE-ESolution" name="qxsolution" id="quextESolution1" value="1" />\
                                        <label class="sr-av">' + _("Option") + ' B:</label><input type="text" class="gameQE-EOption1 gameQE-EAnwersOptions"  id="quextEOption1">\
                                    </div>\
                                    <div class="gameQE-EOptionDiv">\
                                        <label class="sr-av">' + _("Solution") + ' C:</label><input type="radio" class="gameQE-ESolution" name="qxsolution" id="quextESolution2" value="2" />\
                                        <label class="sr-av">' + _("Option") + ' C:</label><input type="text" class="gameQE-EOption2 gameQE-EAnwersOptions"  id="quextEOption2">\
                                    </div>\
                                    <div class="gameQE-EOptionDiv">\
                                        <label class="sr-av">' + _("Solution") + ' D:</label><input type="radio"  class="gameQE-ESolution" name="qxsolution" id="quextESolution3" value="3" />\
                                        <label class="sr-av">' + _("Option") + ' D:</label><input type="text" class="gameQE-EOption3 gameQE-EAnwersOptions"  id="quextEOption3">\
                                    </div>\
                                </div>\
                            </div>\
                            <div class="gameQE-EOrders" id="quextEOrder">\
                                <div class="gameQE-ECustomMessage">\
                                    <span class="sr-av">' + _("Hit") + '</span><span class="gameQE-EHit"></span>\
                                    <label for="quextEMessageOK">' + _("Message") + ':</label>\
                                    <input type="text" class=""  id="quextEMessageOK">\
                                </div>\
                                <div class="gameQE-ECustomMessage">\
                                    <span class="sr-av">' + _("Error") + '</span><span class="gameQE-EError"></span>\
                                    <label for="quextEMessageKO">' + _("Message") + ':</label>\
                                    <input type="text" class=""  id="quextEMessageKO">\
                                </div>\
                            </div>\
                            <div class="gameQE-ENavigationButtons">\
                                <a href="#" id="quextEAdd" class="gameQE-ENavigationButton" title="' + _("Add question") + '"><img src="' + path + 'quextIEAdd.png" alt="' + _("Add question") + '" class="gameQE-EButtonImage" /></a>\
                                <a href="#" id="quextEFirst" class="gameQE-ENavigationButton"  title="' + _("First question") + '"><img src="' + path + 'quextIEFirst.png"  alt="' + _("First question") + '" class="gameQE-EButtonImage" /></a>\
                                <a href="#" id="quextEPrevious" class="gameQE-ENavigationButton" title="' + _("Previous question") + '"><img src="' + path + 'quextIEPrev.png" alt="' + _("Previous question") + '" class="gameQE-EButtonImage" /></a>\
                                <label class="sr-av" for="quextENumberQuestion">' + _("Question number:") + ':</label><input type="text" class="gameQE-NumberQuestion"  id="quextENumberQuestion" value="1"/>\
                                <a href="#" id="quextENext" class="gameQE-ENavigationButton"  title="' + _("Next question") + '"><img src="' + path + 'quextIENext.png" alt="' + _("Next question") + '" class="gameQE-EButtonImage" /></a>\
                                <a href="#" id="quextELast" class="gameQE-ENavigationButton"  title="' + _("Last question") + '"><img src="' + path + 'quextIELast.png" alt="' + _("Last question") + '" class="gameQE-EButtonImage" /></a>\
                                <a href="#" id="quextEDelete" class="gameQE-ENavigationButton" title="' + _("Delete question") + '"><img src="' + path + 'quextIEDelete.png" alt="' + _("Delete question") + '" class="gameQE-EButtonImage" /></a>\
                                <a href="#" id="quextECopy" class="gameQE-ENavigationButton" title="' + _("Copy question") + '"><img src="' + path + 'quextIECopy.png" alt="' + _("Copy question") + '" class="gameQE-EButtonImage" /></a>\
                                <a href="#" id="quextECut" class="gameQE-ENavigationButton" title="' + _("Cut question") + '"><img src="' + path + 'quextIECut.png" alt="' + _("Cut question") + '"  class="gameQE-EButtonImage" /></a>\
                                <a href="#" id="quextEPaste" class="gameQE-ENavigationButton"  title="' + _("Paste question") + '"><img src="' + path + 'quextIEPaste.png" alt="' + _("Paste question") + '" class="gameQE-EButtonImage" /></a>\
                            </div>\
                            <div class="gameQE-EVIDiv" id="quextEVIDiv">\
                                <div class="gameQE-EVIV">\
                                    <div class="gameQE-EMVI">\
                                        <div class="gameQE-EVI" id="quextEVI"></div>\
                                        <video class="gameQE-EVI" id = "quextEVILocal" preload="auto" controls></video>\
                                        <img class="gameQE-ENoVI" src="' + path + 'quextIENoVideo.png" id="quextEVINo" alt="" />\
                                    </div>\
                                </div>\
                                <div class="gameQE-EVIOptions">\
                                    <label for="quextEVIURL">' + _("URL") + ':</label>\
                                    <input id="quextEVIURL" type="text" />\
                                    <a href="#" id="quextEVIPlayI" class="gameQE-ENavigationButton gameQE-EPlayVideo" title="' + _("Play video intro") + '"><img src="' + path + 'quextIEPlay.png" alt="' + _("Play") + '" class="gameQE-EButtonImage b-playintro" /></a>\
                                    <label for="quextEVIStart">' + _("Start") + ':</label>\
                                    <input id="quextEVIStart" type="text" value="00:00:00" readonly />\
                                    <label for="quextEVIEnd">' + _("End") + ':</label>\
                                    <input id="quextEVIEnd" type="text" value="00:00:00" readonly />\
                                    <button class="gameQE-EVideoTime" id="quextEVITime" type="button">00:00:00</button>\
                                </div>\
                                <input type="button" class="gameQE-EVIClose" id="quextEVIClose" value="' + _("Close") + '" />\
                            </div>\
                            <div class="gameQE-ENumQuestionDiv" id="quextENumQuestionDiv">\
                               <div class="gameQE-ENumQ"><span class="sr-av">' + _("Number of questions:") + '</span></div>\ <span class="gameQE-ENumQuestions" id="quextENumQuestions">0</span>\
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
            selector: '#quextEText',
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
        $('#quextEInputVideo').css('display', 'flex');
        $('#quextEInputImage').css('display', 'flex');
        $("#quextMediaNormal").prop("disabled", false);
        $("#quextMediaImage").prop("disabled", false);
        $("#quextMediaText").prop("disabled", false);
        $("#quextMediaVideo").prop("disabled", false);
        if ($exeDevice.questionsGame.length == 0) {
            var question = $exeDevice.getCuestionDefault();
            $exeDevice.questionsGame.push(question);
            this.changeTypeQuestion(0)
            this.showOptions(4);
            this.showSolution(0);
        }
        this.active = 0;
        this.localPlayer = document.getElementById('quextEVideoLocal');
        this.localPlayerIntro = document.getElementById('quextEVILocal');

    },
    getCuestionDefault: function () {
        var p = new Object();
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
        p.solution = 0;
        p.silentVideo = 0;
        p.tSilentVideo = 0;
        p.audio = '';
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
            var json = $('.quext-DataGame', wrapper).text(),
                version = $('.quext-version', wrapper).text();
            if (version.length == 1) {
                json = $exeDevice.Decrypt(json);
            }
            var dataGame = $exeDevice.isJsonString(json),
                $imagesLink = $('.quext-LinkImages', wrapper),
                $audiosLink = $('.quext-LinkAudios', wrapper);

            $imagesLink.each(function () {
                var iq = parseInt($(this).text());
                if (!isNaN(iq) && iq < dataGame.questionsGame.length) {
                    dataGame.questionsGame[iq].url = $(this).attr('href');
                    if (dataGame.questionsGame[iq].url.length < 4 && dataGame.questionsGame[iq].type == 1) {
                        dataGame.questionsGame[iq].url = "";
                    }
                }
            });
            var hasYoutube = false;
            for (var i = 0; i < dataGame.questionsGame.length; i++) {
                dataGame.questionsGame[i].audio = typeof dataGame.questionsGame[i].audio == "undefined" ? "" : dataGame.questionsGame[i].audio;
                if (i > 0 && dataGame.questionsGame[i].type == 2) {
                    hasYoutube = true;
                }
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
            for (var i = 0; i < dataGame.questionsGame.length; i++) {
                if (dataGame.questionsGame[i].type == 3) {
                    dataGame.questionsGame[i].eText = unescape(dataGame.questionsGame[i].eText);
                }
            }

            var instructions = $(".quext-instructions", wrapper);
            if (instructions.length == 1) {
                instructions = instructions.html() || ''
                if (tinyMCE.get('eXeGameInstructions')) {
                    tinyMCE.get('eXeGameInstructions').setContent(instructions);
                } else {
                    $("#eXeGameInstructions").val(instructions)
                }
            }

            var textFeedBack = $(".quext-feedback-game", wrapper);
            if (textFeedBack.length == 1) {
                textFeedBack = textFeedBack.html() || ''
                if (tinyMCE.get('quextEFeedBackEditor')) {
                    tinyMCE.get('quextEFeedBackEditor').setContent(textFeedBack);
                } else {
                    $("#quextEFeedBackEditor").val(textFeedBack)
                }
            }

            var textAfter = $(".quext-extra-content", wrapper);
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

        $("#quextEUseLives").prop('disabled', true);
        $("#quextENumberLives").prop('disabled', true);
        $('#quextEPercentajeFB').prop('disabled', !feedback && gamemode != 2);
        $('#quextEHasFeedBack').prop('disabled', gamemode == 2);
        $('#quextEHasFeedBack').prop('checked', feedback);
        if (gamemode == 2 || feedback) {
            $('#quextEFeedbackP').slideDown();
        }
        if (gamemode != 2 && !feedback) {
            $('#quextEFeedbackP').slideUp();
        }
        if (gamemode == 0) {
            $("#quextEUseLives").prop('disabled', false);
            $("#quextENumberLives").prop('disabled', !useLives);
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
        game.answersRamdon = game.answersRamdon || false;
        game.percentajeFB = typeof game.percentajeFB != "undefined" ? game.percentajeFB : 100;
        game.gameMode = typeof game.gameMode != "undefined" ? game.gameMode : 0;
        game.feedBack = typeof game.feedBack != "undefined" ? game.feedBack : false;
        game.customMessages = typeof game.customMessages == "undefined" ? false : game.customMessages;
        game.percentajeQuestions = typeof game.percentajeQuestions == "undefined" ? 100 : game.percentajeQuestions;
        game.evaluation = typeof game.evaluation != "undefined" ? game.evaluation : false;
        game.evaluationID = typeof game.evaluationID != "undefined" ? game.evaluationID : '';
        $exeDevice.id = typeof game.id != "undefined" ? game.id : false;
        $('#quextEShowMinimize').prop('checked', game.showMinimize);
        $('#quextEQuestionsRamdon').prop('checked', game.optionsRamdon);
        $('#quextEAnswersRamdon').prop('checked', game.answersRamdon);
        $('#quextEVideoIntro').val(game.idVideo);
        $('#quextEShowSolution').prop('checked', game.showSolution);
        $('#quextETimeShowSolution').val(game.timeShowSolution)
        $('#quextETimeShowSolution').prop('disabled', !game.showSolution);
        $('#quextENumberLives').prop('disabled', !game.useLives);
        $('#quextEVIURL').val(game.idVideo);
        $('#quextEVIEnd').val($exeDevice.secondsToHour(game.endVideo));
        $('#quextEVIStart').val($exeDevice.secondsToHour(game.startVideo));
        $('#quextECustomScore').prop('checked', game.customScore);
        $('#quextEScoreQuestionDiv').hide();
        $("#quextEHasFeedBack").prop('checked', game.feedBack);
        $("#quextEPercentajeFB").val(game.percentajeFB);
        $("input.gameQE-TypeGame[name='qxtgamemode'][value='" + game.gameMode + "']").prop("checked", true);
        $("#quextEUseLives").prop('disabled', game.gameMode == 0);
        $("#quextENumberLives").prop('disabled', (game.gameMode == 0 && game.useLives));
        $('#quextECustomMessages').prop('checked', game.customMessages);
        $('#quextEPercentajeQuestions').val(game.percentajeQuestions);
        $('#quextEEvaluation').prop('checked', game.evaluation);
        $('#quextEEvaluationID').val(game.evaluationID);
        $("#quextEEvaluationID").prop('disabled', (!game.evaluation));
        $exeDevice.updateGameMode(game.gameMode, game.feedBack, game.useLives);
        $exeDevice.showSelectOrder(game.customMessages);
        for (var i = 0; i < game.questionsGame.length; i++) {
            game.questionsGame[i].audio = typeof game.questionsGame[i].audio == "undefined" ? "" : game.questionsGame[i].audio;
            game.questionsGame[i].msgHit = typeof game.questionsGame[i].msgHit == "undefined" ? "" : game.questionsGame[i].msgHit;
            game.questionsGame[i].msgError = typeof game.questionsGame[i].msgError == "undefined" ? "" : game.questionsGame[i].msgError;
        }
        if (game.customScore) {
            $('#quextEScoreQuestionDiv').show();
        }
        $exeAuthoring.iDevice.gamification.scorm.setValues(game.isScorm, game.textButtonScorm, game.repeatActivity);
        if (game.feedBack || game.gameMode == 2) {
            $('#quextEFeedbackP').show();
        } else {
            $('#quextEFeedbackP').hide();
        }
        $('#quextEPercentajeFB').prop('disabled', !game.feedBack);
        $exeDevice.questionsGame = game.questionsGame;
        $exeDevice.updateQuestionsNumber();
        $exeDevice.showQuestion($exeDevice.active);

    },
    showSelectOrder: function (messages, custonmScore) {
        if (messages) {
            $('.gameQE-EOrders').slideDown();
        } else {
            $('.gameQE-EOrders').slideUp();
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
    getURLVideoMediaTeca: function (url) {
        if (url) {
            var matc = url.indexOf("https://mediateca.educa.madrid.org/video/") != -1;
            if (matc) {
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

    getURLAudioMediaTeca: function (url) {
        if (url) {
            var matc = url.indexOf("https://mediateca.educa.madrid.org/audio/") != -1;
            var matc1 = url.indexOf("https://mediateca.educa.madrid.org/video/") != -1;

            if (matc) {
                var id = url.split("https://mediateca.educa.madrid.org/audio/")[1].split("?")[0];
                id = 'https://mediateca.educa.madrid.org/streaming.php?id=' + id;
                return id;
            } if (matc1) {
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
        if (instructions != "") divContent = '<div class="quext-instructions gameQP-instructions">' + instructions + '</div>';
        var textFeedBack = tinyMCE.get('quextEFeedBackEditor').getContent(),
            linksImages = $exeDevice.createlinksImage(dataGame.questionsGame),
            linksAudios = $exeDevice.createlinksAudio(dataGame.questionsGame),
            html = '<div class="quext-IDevice">';
        html += divContent;
        html += '<div class="quext-version js-hidden">' + $exeDevice.version + '</div>';
        html += '<div class="quext-feedback-game">' + textFeedBack + '</div>';
        html += '<div class="quext-DataGame js-hidden" >' + $exeDevice.Encrypt(json) + '</div>';
        html += linksImages;
        html += linksAudios;
        var textAfter = tinyMCE.get('eXeIdeviceTextAfter').getContent();
        if (textAfter != "") {
            html += '<div class="quext-extra-content">' + textAfter + '</div>';
        }
        html += '<div class="quext-bns js-hidden">' + $exeDevice.msgs.msgNoSuportBrowser + '</div>';
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
        p.type = parseInt($('input[name=qxtype]:checked').val());
        p.time = parseInt($('input[name=qxttime]:checked').val());
        p.numberOptions = parseInt($('input[name=qxtnumber]:checked').val());
        p.x = parseFloat($('#quextEXImage').val());
        p.y = parseFloat($('#quextEYImage').val());;
        p.author = $('#quextEAuthor').val();
        p.alt = $('#quextEAlt').val();
        p.customScore = parseFloat($('#quextEScoreQuestion').val());
        p.url = $('#quextEURLImage').val().trim();
        p.audio = $('#quextEURLAudio').val();
        $exeDevice.stopSound();
        $exeDevice.stopVideo();
        if (p.type == 2) {
            p.url = $exeDevice.getIDYoutube($('#quextEURLYoutube').val().trim()) ? $('#quextEURLYoutube').val() : '';
            if (p.url == '') {
                p.url = $exeDevice.getURLVideoMediaTeca($('#quextEURLYoutube').val().trim()) ? $('#quextEURLYoutube').val() : '';
            }
        }
        p.soundVideo = $('#quextECheckSoundVideo').is(':checked') ? 1 : 0;
        p.imageVideo = $('#quextECheckImageVideo').is(':checked') ? 1 : 0;
        p.iVideo = $exeDevice.hourToSeconds($('#quextEInitVideo').val().trim());
        p.fVideo = $exeDevice.hourToSeconds($('#quextEEndVideo').val().trim());
        p.silentVideo = $exeDevice.hourToSeconds($('#quextESilenceVideo').val().trim());
        p.tSilentVideo = parseInt($('#quextETimeSilence').val());
        p.eText = tinyMCE.get('quextEText').getContent();
        p.quextion = $('#quextEQuestion').val().trim();
        p.options = [];
        p.solution = parseInt($('input[name=qxsolution]:checked').val());
        p.msgHit = $('#quextEMessageOK').val();
        p.msgError = $('#quextEMessageKO').val();
        var optionEmpy = false;
        $('.gameQE-EAnwersOptions').each(function (i) {
            var option = $(this).val().trim();
            if (i < p.numberOptions && option.length == 0) {
                optionEmpy = true;
            }
            p.options.push(option);
        });

        if (p.quextion.length == 0) {
            message = msgs.msgECompleteQuestion;
        } else if (optionEmpy) {
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
        } else if (p.type == 2 && !$exeDevice.validTime($('#quextEInitVideo').val()) || !$exeDevice.validTime($('#quextEEndVideo').val())) {
            message = $exeDevice.msgs.msgTimeFormat
        } else if (p.type == 2 && p.tSilentVideo > 0 && !$exeDevice.validTime($('#quextESilenceVideo').val())) {
            message = msgs.msgTimeFormat;
        } else if (p.type == 2 && p.tSilentVideo > 0 && (p.silentVideo < p.iVideo || p.silentVideo >= p.fVideo)) {
            message = msgs.msgSilentPoint;
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
            if (questionsGame[i].type == 1 && !questionsGame[i].url.indexOf('http') == 0) {
                linkImage = '<a href="' + questionsGame[i].url + '" class="js-hidden quext-LinkImages">' + i + '</a>';
            }
            html += linkImage;
        }
        return html;
    },
    createlinksAudio: function (questionsGame) {
        var html = '';
        for (var i = 0; i < questionsGame.length; i++) {
            var linkaudio = '';
            if (questionsGame[i].type != 2 && !questionsGame[i].audio.indexOf('http') == 0 && questionsGame[i].audio.length > 4) {
                linkaudio = '<a href="' + questionsGame[i].audio + '" class="js-hidden quext-LinkAudios">' + i + '</a>';
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
        link.download = _("Game") + "QuExt.json";
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
        } else if (game.typeGame !== 'QuExt') {
            $exeDevice.showMessage($exeDevice.msgs.msgESelectFile);
            return;
        }
        if ($exeDevice.questionsGame.length > 1) {
            game.questionsGame = $exeDevice.importQuExt(game)
        }
        $exeDevice.active = 0;
        $exeDevice.questionsGame = game.questionsGame;
        game.id = $exeDevice.generarID();
        for (var i = 0; i < $exeDevice.questionsGame.length; i++) {
            if (game.questionsGame[i].type == 3) {
                game.questionsGame[i].eText = unescape(game.questionsGame[i].eText);
            }
            var numOpt = 0,
                options = $exeDevice.questionsGame[i].options;
            for (var j = 0; j < options.length; j++) {
                if (options[j].trim().length == 0) {
                    $exeDevice.questionsGame[i].numberOptions = numOpt;
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
        tinyMCE.get('quextEFeedBackEditor').setContent(unescape(textFeedBack));
        $('.exe-form-tabs li:first-child a').click();
    },
    importQuExt: function (game) {
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
            textFeedBack = escape(tinyMCE.get('quextEFeedBackEditor').getContent()),
            showMinimize = $('#quextEShowMinimize').is(':checked'),
            optionsRamdon = $('#quextEQuestionsRamdon').is(':checked'),
            answersRamdon = $('#quextEAnswersRamdon').is(':checked'),
            showSolution = $('#quextEShowSolution').is(':checked'),
            timeShowSolution = parseInt(clear($('#quextETimeShowSolution').val())),
            useLives = $('#quextEUseLives').is(':checked'),
            numberLives = parseInt(clear($('#quextENumberLives').val())),
            idVideo = $('#quextEVideoIntro').val(),
            endVideo = $exeDevice.hourToSeconds($('#quextEVIEnd').val()),
            startVideo = $exeDevice.hourToSeconds($('#quextEVIStart').val()),
            itinerary = $exeAuthoring.iDevice.gamification.itinerary.getValues(),
            customScore = $('#quextECustomScore').is(':checked'),
            feedBack = $('#quextEHasFeedBack').is(':checked'),
            percentajeFB = parseInt(clear($('#quextEPercentajeFB').val())),
            gameMode = parseInt($('input[name=qxtgamemode]:checked').val()),
            customMessages = $('#quextECustomMessages').is(':checked'),
            percentajeQuestions = parseInt(clear($('#quextEPercentajeQuestions').val())),
            evaluation=$('#quextEEvaluation').is(':checked'),
            evaluationID=$('#quextEEvaluationID').val(),
            id = $exeDevice.id ? $exeDevice.id : $exeDevice.generarID();
        if (!itinerary) return false;

        if ((gameMode == 2 || feedBack) && textFeedBack.trim().length == 0) {
            eXe.app.alert($exeDevice.msgs.msgProvideFB);
            return false;
        }
        if (showSolution && timeShowSolution.length == 0) {
            $exeDevice.showMessage($exeDevice.msgs.msgEProvideTimeSolution);
            return false;
        }
        if (evaluation && evaluationID.length < 5) {
            eXe.app.alert($exeDevice.msgs.msgIDLenght);
            return false;
        }
        var questionsGame = $exeDevice.questionsGame;
        for (var i = 0; i < questionsGame.length; i++) {
            var mquestion = questionsGame[i]
            mquestion.customScore = typeof (mquestion.customScore) == "undefined" ? 1 : mquestion.customScore;
            if (mquestion.quextion.length == 0) {
                $exeDevice.showMessage($exeDevice.msgs.msgECompleteQuestion);
                return false;
            } else if ((mquestion.type == 1) && (mquestion.url.length < 10)) {
                $exeDevice.showMessage($exeDevice.msgs.msgEURLValid);
                return false;
            } else if ((mquestion.type == 2) && !($exeDevice.getIDYoutube(mquestion.url)) && !($exeDevice.getURLVideoMediaTeca(mquestion.url))) {
                $exeDevice.showMessage($exeDevice.msgs.msgECompleteURLYoutube);
                return false;
            }
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
        for (var i = 0; i < questionsGame.length; i++) {
            var qt = questionsGame[i]
            if (qt.type == 1 && qt.url.length < 8) {
                qt.x = 0
                qt.y = 0;
                qt.author = '';
                qt.alt = '';
            } else if (qt.type == 2 && qt.url.length < 8) {
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
            'typeGame': 'QuExt',
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
            'questionsGame': questionsGame,
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
            'version': 2,
            'customMessages': customMessages,
            'percentajeQuestions': percentajeQuestions,
            'evaluation':evaluation,
            'evaluationID':evaluationID,
            'id': id
        }
        return data;
    },
    removeTags: function (str) {
        var wrapper = $("<div></div>");
        wrapper.html(str);
        return wrapper.text();
    },
    addEvents: function () {
        $('#quextEPaste').hide();
        $('#quextEUseLives').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#quextENumberLives').prop('disabled', !marcado);
        });
        $('#quextEInitVideo, #quextEEndVideo, #quextESilenceVideo').on('focusout', function () {
            if (!$exeDevice.validTime(this.value)) {
                $(this).css({
                    'background-color': 'red',
                    'color': 'white'
                });
            }
        });
        $('#quextEInitVideo, #quextEEndVideo, #quextESilenceVideo').on('click', function () {
            $(this).css({
                'background-color': 'white',
                'color': '#2c6d2c'
            });

        });
        $('#quextShowCodeAccess').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#quextCodeAccess').prop('disabled', !marcado);
            $('#quextMessageCodeAccess').prop('disabled', !marcado);
        });
        $('.gameQE-EPanel').on('click', 'input.gameQE-Type', function (e) {
            var type = parseInt($(this).val());
            $exeDevice.changeTypeQuestion(type);
        });

        $('.gameQE-EPanel').on('click', 'input.gameQE-Number', function (e) {
            var number = parseInt($(this).val());
            $exeDevice.showOptions(number);
        });
        $('#quextEAdd').on('click', function (e) {
            e.preventDefault();
            $exeDevice.addQuestion()
        });
        $('#quextEFirst').on('click', function (e) {
            e.preventDefault();
            $exeDevice.firstQuestion()
        });
        $('#quextEPrevious').on('click', function (e) {
            e.preventDefault();
            $exeDevice.previousQuestion()
        });
        $('#quextENext').on('click', function (e) {
            e.preventDefault();
            $exeDevice.nextQuestion()
        });
        $('#quextELast').on('click', function (e) {
            e.preventDefault();
            $exeDevice.lastQuestion()
        });
        $('#quextEDelete').on('click', function (e) {
            e.preventDefault();
            $exeDevice.removeQuestion()
        });
        $('#quextECopy').on('click', function (e) {
            e.preventDefault();
            $exeDevice.copyQuestion()
        });
        $('#quextECut').on('click', function (e) {
            e.preventDefault();
            $exeDevice.cutQuestion()
        });
        $('#quextEPaste').on('click', function (e) {
            e.preventDefault();
            $exeDevice.pasteQuestion()
        });

        $('#quextEPlayVideo').on('click', function (e) {
            e.preventDefault();
            if ($exeDevice.getIDYoutube($('#quextEURLYoutube').val().trim())) {
                if (typeof YT == "undefined") {
                    $exeDevice.isVideoType = true;
                    $exeDevice.loadYoutubeApi();
                } else {
                    $exeDevice.showVideoQuestion();
                }
            } else if ($exeDevice.getURLVideoMediaTeca($('#quextEURLYoutube').val().trim())) {
                $exeDevice.showVideoQuestion();
            } else {
                $exeDevice.showMessage($exeDevice.msgs.msgECompleteURLYoutube);
            }
        });

        $(' #quextECheckSoundVideo').on('change', function () {
            if ($exeDevice.getIDYoutube($('#quextEURLYoutube').val().trim())) {
                if (typeof YT == "undefined") {
                    $exeDevice.isVideoType = true;
                    $exeDevice.loadYoutubeApi();
                } else {
                    $exeDevice.showVideoQuestion();
                }
            } else if ($exeDevice.getURLVideoMediaTeca($('#quextEURLYoutube').val().trim())) {
                $exeDevice.showVideoQuestion();
            } else {
                $exeDevice.showMessage($exeDevice.msgs.msgECompleteURLYoutube);
            }
        });
        $('#quextECheckImageVideo').on('change', function () {
            if ($exeDevice.getIDYoutube($('#quextEURLYoutube').val().trim())) {
                if (typeof YT == "undefined") {
                    $exeDevice.isVideoType = true;
                    $exeDevice.loadYoutubeApi();
                } else {
                    $exeDevice.showVideoQuestion();
                }
            } else if ($exeDevice.getURLVideoMediaTeca($('#quextEURLYoutube').val().trim())) {
                $exeDevice.showVideoQuestion();
            } else {
                $exeDevice.showMessage($exeDevice.msgs.msgECompleteURLYoutube);
            }
        });
        $('#gameQEIdeviceForm').on('dblclick', '#quextEImage', function () {
            $('#quextECursor').hide();
            $('#quextEXImage').val(0);
            $('#quextEYImage').val(0);
        });

        $('#quextENumberLives').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 1);
            this.value = v;
        });
        $('#quextENumberLives').on('focusout', function () {
            this.value = this.value.trim() == '' ? 3 : this.value;
            this.value = this.value > 5 ? 5 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
        });
        $('#quextETimeShowSolution').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 1);
            this.value = v;
        });

        $('#quextEScoreQuestion').on('focusout', function () {
            if (!$exeDevice.validateScoreQuestion($(this).val())) {
                $(this).val(1);
            }
        });
        $('#quextETimeShowSolution').on('focusout', function () {
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

        $('#quextEInitVideo').css('color', '#2c6d2c');
        $('#quextEInitVideo').on('click', function (e) {
            e.preventDefault();
            $exeDevice.timeVideoFocus = 0;
            $('#quextEInitVideo').css('color', '#2c6d2c');
            $('#quextEEndVideo').css('color', '#000000');
            $('#quextESilenceVideo').css('color', '#000000');
        });
        $('#quextEEndVideo').on('click', function (e) {
            e.preventDefault();
            $exeDevice.timeVideoFocus = 1;
            $('#quextEEndVideo').css('color', '#2c6d2c');
            $('#quextEInitVideo').css('color', '#000000');
            $('#quextESilenceVideo').css('color', '#000000');
        });
        $('#quextESilenceVideo').on('click', function (e) {
            e.preventDefault();
            $exeDevice.timeVideoFocus = 2;
            $('#quextESilenceVideo').css('color', '#2c6d2c');
            $('#quextEEndVideo').css('color', '#000000');
            $('#quextEInitVideo').css('color', '#000000');
        });
        $('#quextETimeSilence').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 1);
            this.value = v;
        });
        $('#quextEVideoTime').on('click', function (e) {
            e.preventDefault();
            var $timeV = '';
            switch ($exeDevice.timeVideoFocus) {
                case 0:
                    $timeV = $('#quextEInitVideo');
                    break;
                case 1:
                    $timeV = $('#quextEEndVideo');
                    break;
                case 2:
                    $timeV = $('#quextESilenceVideo');
                    break;
                default:
                    break;
            }
            $timeV.val($('#quextEVideoTime').text());
            $timeV.css({
                'background-color': 'white',
                'color': '#2c6d2c'
            });
        });
        $('#quextEVIStart').css('color', '#2c6d2c');
        $('#quextEVIStart').on('click', function (e) {
            e.preventDefault();
            $exeDevice.timeVIFocus = true;
            $('#quextEVIStart').css('color', '#2c6d2c');
            $('#quextEVIEnd').css('color', '#000000');
        });
        $('#quextEVIEnd').on('click', function (e) {
            e.preventDefault();
            $exeDevice.timeVIFocus = false;
            $('#quextEVIEnd').css('color', '#2c6d2c');
            $('#quextEVIStart').css('color', '#000000');
        });
        $('#quextEVITime').on('click', function (e) {
            e.preventDefault();
            var $timeV = $exeDevice.timeVIFocus ? $('#quextEVIStart') : $('#quextEVIEnd');
            $timeV.val($('#quextEVITime').text());
        });
        $('#quextUseLives').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#quextNumberLives').prop('disabled', !marcado);
        });
        $('#quextEShowSolution').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#quextETimeShowSolution').prop('disabled', !marcado);
        });
        $('#quextECustomScore').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#quextEScoreQuestionDiv').hide();
            if (marcado) {
                $('#quextEScoreQuestionDiv').show();
            }
        });
        $('#quextEURLImage').on('change', function () {
            var validExt = ['jpg', 'png', 'gif', 'jpeg', 'svg'],
                selectedFile = $(this).val(),
                ext = selectedFile.split('.').pop().toLowerCase();
            if ((selectedFile.indexOf('resources') == 0 || selectedFile.indexOf('/previews/') == 0) && validExt.indexOf(ext) == -1) {
                $exeDevice.showMessage(_("Supported formats") + ": jpg, jpeg, gif, png, svg");
                return false;
            }
            var url = selectedFile,
                alt = $('#quextEAlt').val(),
                x = parseFloat($('#quextEXImage').val()),
                y = parseFloat($('#quextEYImage').val());
            $exeDevice.showImage(url, x, y, alt);
        });

        $('#quextEPlayImage').on('click', function (e) {
            e.preventDefault();
            var validExt = ['jpg', 'png', 'gif', 'jpeg', 'svg'],
                selectedFile = $('#quextEURLImage').val(),
                ext = selectedFile.split('.').pop().toLowerCase();
            if ((selectedFile.indexOf('resources') == 0 || selectedFile.indexOf('/previews/') == 0) && validExt.indexOf(ext) == -1) {
                $exeDevice.showMessage(_("Supported formats") + ": jpg, jpeg, gif, png, svg");
                return false;
            }
            var url = selectedFile,
                alt = $('#quextEAlt').val(),
                x = parseFloat($('#quextEXImage').val()),
                y = parseFloat($('#quextEYImage').val());
            $exeDevice.showImage(url, x, y, alt);
        });
        $('#quextEImage').on('click', function (e) {
            $exeDevice.clickImage(this, e.pageX, e.pageY);
        });
        $('#quextEVideoIntroPlay').on('click', function (e) {
            e.preventDefault();
            $exeDevice.playVideoIntro1();
        });
        $('#quextEVIPlayI').on('click', function (e) {
            e.preventDefault();
            $exeDevice.playVideoIntro2();
        });
        $('#quextEVIClose').on('click', function (e) {
            e.preventDefault();
            $('#quextEVideoIntro').val($('#quextEVIURL').val());
            $('#quextEVIDiv').hide();
            $('#quextENumQuestionDiv').show();
            $exeDevice.stopVideoIntro();
        });

        $('#quextECursor').on('click', function (e) {
            $(this).hide();
            $('#quextEXImage').val(0);
            $('#quextEYImage').val(0);
        });
        $('#quextEPlayAudio').on('click', function (e) {
            e.preventDefault();
            var selectedFile = $('#quextEURLAudio').val().trim();
            if (selectedFile.length > 4) {
                $exeDevice.stopSound();
                $exeDevice.playSound(selectedFile);
            }
        });

        $('#quextEURLAudio').on('change', function () {
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
        $('#quextEHasFeedBack').on('change', function () {
            var marcado = $(this).is(':checked');
            if (marcado) {
                $('#quextEFeedbackP').slideDown();
            } else {
                $('#quextEFeedbackP').slideUp();
            }
            $('#quextEPercentajeFB').prop('disabled', !marcado);
        });
        $('#gameQEIdeviceForm').on('click', 'input.gameQE-TypeGame', function (e) {
            var gm = parseInt($(this).val()),
                fb = $('#quextEHasFeedBack').is(':checked'),
                ul = $('#quextEUseLives').is(':checked');
            $exeDevice.updateGameMode(gm, fb, ul);
        });
        $("#quextEGameModeHelpLnk").click(function () {
            $("#quextEGameModeHelp").toggle();
            return false;
        });

        $('#quextECustomMessages').on('change', function () {
            var messages = $(this).is(':checked');
            $exeDevice.showSelectOrder(messages);
        });
        $('#quextEPercentajeQuestions').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 3);
            this.value = v;
            if (this.value > 0 && this.value < 101) {
                $exeDevice.updateQuestionsNumber();
            }
        });
        $('#quextEPercentajeQuestions').on('click', function () {
            $exeDevice.updateQuestionsNumber();
        });
        $('#quextEPercentajeQuestions').on('focusout', function () {
            this.value = this.value.trim() == '' ? 100 : this.value;
            this.value = this.value > 100 ? 100 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
            $exeDevice.updateQuestionsNumber();
        });
        $('#quextENumberQuestion').keyup(function (e) {
            if (e.keyCode == 13) {
                var num = parseInt($(this).val());
                if (!isNaN(num) && num > 0) {
                    if ($exeDevice.validateQuestion() != false) {
                        $exeDevice.active = num < $exeDevice.questionsGame.length ? num - 1 : $exeDevice.questionsGame.length - 1;
                        $exeDevice.showQuestion($exeDevice.active);

                    } else {
                        $(this).val($exeDevice.active + 1)
                    }
                } else {
                    $(this).val($exeDevice.active + 1)
                }

            }
        });
        $('#quextEEvaluation').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#quextEEvaluationID').prop('disabled', !marcado);
        });
        $("#quextEEvaluationHelpLnk").click(function () {
            $("#quextEEvaluationHelp").toggle();
            return false;

        });

        $exeAuthoring.iDevice.gamification.itinerary.addEvents();

    },
    playVideoIntro1: function () {
        var idv = $exeDevice.getIDYoutube($('#quextEVideoIntro').val()),
            idmt = $exeDevice.getURLVideoMediaTeca($('#quextEVideoIntro').val()),
            iVI = $exeDevice.hourToSeconds($('#quextEVIStart').val()),
            fVI = $exeDevice.hourToSeconds($('#quextEVIEnd').val()) > 0 ? $exeDevice.hourToSeconds($('#quextEVIEnd').val()) : 9000;
        if (idv || idmt) {
            if (fVI <= iVI) {
                $exeDevice.showMessage($exeDevice.msgs.msgEStartEndIncorrect);
                return;
            }
            if (idv) {
                if (typeof YT == "undefined") {
                    $exeDevice.isVideoIntro = 1;
                    $exeDevice.loadYoutubeApi();
                    return;
                } else {
                    $('#quextEVI').show();
                    $exeDevice.startVideoIntro(idv, iVI, fVI, 0);
                }
            } else {
                $exeDevice.startVideoIntro(idmt, iVI, fVI, 1);
            }
            $('#quextEVIURL').val($('#quextEVideoIntro').val());
            $('#quextEVIDiv').show();
            $('#quextEVINo').hide();
            $('#quextENumQuestionDiv').hide();
        } else {
            $('#quextEVINo').show();
            $('#quextEVI').hide();
            $exeDevice.showMessage($exeDevice.msgs.msgECompleteURLYoutube);
        }
    },
    playVideoIntro2: function () {
        var idv = $exeDevice.getIDYoutube($('#quextEVIURL').val()),
            idmt = $exeDevice.getURLVideoMediaTeca($('#quextEVIURL').val()),
            iVI = $exeDevice.hourToSeconds($('#quextEVIStart').val()),
            fVI = $exeDevice.hourToSeconds($('#quextEVIEnd').val()) > 0 ? $exeDevice.hourToSeconds($('#quextEVIEnd').val()) : 9000;

        if (idv || idmt) {
            if (fVI <= iVI) {
                $exeDevice.showMessage($exeDevice.msgs.msgEStartEndIncorrect);
                return;
            }
            if (idv) {
                if (typeof YT == "undefined") {
                    $exeDevice.isVideoIntro = 1;
                    $exeDevice.loadYoutubeApi();
                    return;
                } else {
                    $exeDevice.startVideoIntro(idv, iVI, fVI, 0);
                }
            } else {
                $exeDevice.startVideoIntro(idmt, iVI, fVI, 1);
            }

        } else {
            $exeDevice.showMessage($exeDevice.msgs.msgECompleteURLYoutube);
        }

    },
    clickImage: function (img, epx, epy) {
        var $cursor = $('#quextECursor'),
            $x = $('#quextEXImage'),
            $y = $('#quextEYImage'),
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
        if (typeof urlmedia != "undefined" && urlmedia.length > 0 && urlmedia.toLowerCase().indexOf("https://drive.google.com") == 0 && urlmedia.toLowerCase().indexOf("sharing") != -1) {
            sUrl = sUrl.replace(/https:\/\/drive\.google\.com\/file\/d\/(.*?)\/.*?\?usp=sharing/g, "https://docs.google.com/uc?export=open&id=$1");
        } else if (typeof urlmedia != "undefined" && urlmedia.length > 10 && $exeDevice.getURLAudioMediaTeca(urlmedia)) {
            sUrl = $exeDevice.getURLAudioMediaTeca(urlmedia);
        }
        return sUrl;
    }
}