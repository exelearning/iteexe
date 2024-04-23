/**
 * VideoQuExt iDevice (edition code)
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Manuel Narváez Martínez
 * Graphic design: Ana María Zamora Moreno, Francisco Javier Pulido
 * Testers: Ricardo Málaga Floriano, Francisco Muñoz de la Peña
 * Translator: Antonio Juan Delgado García
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $exeDevice = {
    // i18n
    iDevicePath: "/scripts/idevices/videoquext-activity/edition/",
    msgs: {},
    active: 0,
    questionsGame: [],
    youtubeLoaded: false,
    player: '',
    localPlayer: '',
    timeUpdateInterval: '',
    timeVideoFocus: 0,
    durationVideo: 0,
    timeVIFocus: 0,
    changesSaved: false,
    inEdition: true,
    quextVersion: 2,
    videoType: 0,
    idVideoQuExt: "",
    endVideoQuExt: 0,
    pointStart: 0,
    pointEnd: 100000,
    videoLoading: false,
    id: false,
    ci18n: {
        "msgPlayStart": _("Click here to play"),
        "msgSubmit": _("Submit"),
        "msgGameOver": _("Game Over!"),
        "msgClue": _("Cool! The clue is:"),
        "msgNewGame": _("Click here for a new game"),
        "msgYouHas": _("You have got %1 hits and %2 misses"),
        "msgCodeAccess": _("Access code"),
        "msgInformationLooking": _("Cool! The information you were looking for"),
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
        "msgAnswer": _("Answer"),
        "msgOnlySaveScore": _("You can only save the score once!"),
        "msgOnlySave": _("You can only save once"),
        "msgInformation": _("Information"),
        "msgYouScore": _("Your score"),
        "msgAuthor": _("Authorship"),
        "msgOnlySaveAuto": _("Your score will be saved after each question. You can only play once."),
        "msgSaveAuto": _("Your score will be automatically saved after each question."),
        "msgSeveralScore": _("You can save the score as many times as you want"),
        "msgYouLastScore": _("The last score saved is"),
        "msgActityComply": _("You have already done this activity."),
        "msgPlaySeveralTimes": _("You can do this activity as many times as you want"),
        "msgTryAgain": _("You need at least %s&percnt; of correct answers to get the information. Please try again."),
        "msgClose": _("Close"),
        "msgOption": _("Option"),
        "msgRickText": _("Rich Text"),
        "msgUseFulInformation": _("and information that will be very useful"),
        "msgLoading": _("Loading. Please wait..."),
        "msgPoints": _("points"),
        "msgIndicateWord": _("Provide a word or phrase"),
        "msgReply": _("Reply"),
        "msgPauseVideo": _("Pause video"),
        "msgPreviewQuestions": _("Preview questions"),
        "msgReloadVideo": _("Reload video"),
        "msgQuestions": _("Questions"),
        "msgIndicateSolution": _("Please write the answer or solution"),
        "msgIndicateSolution": _("Please write the solution"),
        "msgSolution": _("Solution"),
        "msgFirstQuestion": _("First question"),
        "msgNextQuestion": _("Next question"),
        "msgPreviousQuestion": _("Previous question"),
        "msgLastQuestion": _("Last question"),
        "msgQuestionNumber": _("Question number"),
        "msgCorrect": _("Correct"),
        "msgIncorrect": _("Incorrect"),
        "msgUncompletedActivity": _("Incomplete activity"),
        "msgSuccessfulActivity": _("Activity: Passed. Score: %s"),
        "msgUnsuccessfulActivity": _("Activity: Not passed. Score: %s"),
        "msgTypeGame": _('VideoQuExt')
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
        $('.gameQE-EVILabel').find('button').hide();
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
        msgs.msgEPoiIncorrect = _("That second is not part of the video. Please check the video duration.");
        msgs.msgEPointExist = _("There is already a question in that second.");
        msgs.msgTimeFormat = _("Please check the time format: hh:mm:ss");
        msgs.msgProvideSolution = _("Please write the solution");
        msgs.msgEDefintion = _("Please provide the word definition");
        msgs.msgProvideFB = _('Write the message to be displayed when passing the game');
        msgs.msgDuration = _('Please check the video length and the end time');
        msgs.msgFormatVideo = _('Use a YouTube URL or select a file (mp4, ogg, webm, mp3, wav)');
        msgs.msgExportFileError = _("Games with local videos or audios can't be exported");
        msgs.msgNoSuportBrowser = _("Your browser is not compatible with this tool.");
        msgs.msgIDLenght = _('The report identifier must have at least 5 characters');
    },
    getId: function () {
        var randomstring = Math.random().toString(36).slice(-8);
        return randomstring;
    },
    extractURLGD: function (urlmedia) {
        var sUrl = urlmedia,
            idmtc = $exeDevice.getIDMediaTeca(urlmedia);
        if (urlmedia.toLowerCase().indexOf("https://drive.google.com") == 0 && urlmedia.toLowerCase().indexOf("sharing") != -1) {
            sUrl = sUrl.replace(/https:\/\/drive\.google\.com\/file\/d\/(.*?)\/.*?\?usp=sharing/g, "https://docs.google.com/uc?export=open&id=$1");
        } else if (idmtc) {
            sUrl = 'http://mediateca.educa.madrid.org/streaming.php?id=' + idmtc
        }
        return sUrl;
    },
    randomizeQuestions: function (id) {
        var active = 0
        if ($exeDevice.questionsGame.length > 1) {
            $exeDevice.questionsGame.sort(function (a, b) {
                return parseFloat(a.pointVideo) - parseFloat(b.pointVideo);

            });
            for (var i = 0; i < $exeDevice.questionsGame.length; i++) {
                if ($exeDevice.questionsGame[i].id == id) {
                    active = i;
                }
            }
        }
        return active;
    },
    loadYoutubeApi: function () {
        onYouTubeIframeAPIReady = $exeDevice.youTubeReady;
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    },
    youTubeReady: function () {
        $("#vquextMediaVideo").prop("disabled", false);
        $exeDevice.player = new YT.Player('vquextEVideo', {
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
                'onError': $exeDevice.onPlayerError,
                'onStateChange': $exeDevice.onPlayerStateChange
            }
        });
    },
    onPlayerStateChange(event) {
        if ($exeDevice.videoType > 0) {
            return;
        }
        var lduration = Math.floor($exeDevice.player.getDuration());
        if (!isNaN(lduration) && lduration > 0) {
            $exeDevice.durationVideo = lduration;
            if ($exeDevice.hourToSeconds($('#vquextEVIEnd').val()) == 0) {
                var duration = $exeDevice.secondsToHour(lduration);
                $('#vquextEVIEnd').val(duration);
            }
        }
    },
    onPlayerReady: function (event) {
        if ($exeDevice.videoType > 0) {
            return;
        }
        $exeDevice.youtubeLoaded = true;
        var url = $('#vquextEVIURL').val(),
            idV = $exeDevice.getIDYoutube(url);
        if (idV) {
            $exeDevice.initClock(0);
            $exeDevice.startVideo(url, $exeDevice.startVideoQuExt, $exeDevice.endVideoQuExt);
            $exeDevice.showPlayer()
        }
    },
    updateProgressBar: function () {
        if ($exeDevice.videoType > 0) {
            $exeDevice.updateProgressBarLocal();
        } else {
            $exeDevice.updateProgressBarYT();
        }
    },
    onPlayerError: function (event) {
        //$exeDevice.showMessage("El video vquextdo no está disponible")
    },
    startVideo: function (url, start, end) {
        var mstart = start < 1 ? 0.1 : start;
        if ($exeDevice.videoType == 1) {
            $exeDevice.stopVideoYT();
            $exeDevice.startVideoLocal(url, mstart, end);
        } else if ($exeDevice.videoType == 2) {
            url = $exeDevice.extractURLGD(url);
            $exeDevice.stopVideoYT();
            $exeDevice.startVideoLocal(url, mstart, end);
        } else if ($exeDevice.videoType == 3) {
            url = $exeDevice.extractURLGD(url);
            $exeDevice.stopVideoYT();
            $exeDevice.startVideoLocal(url, mstart, end);
        } else {
            var id = $exeDevice.getIDYoutube(url);
            $exeDevice.stopVideoLocal();;
            $exeDevice.startVideoYT(id, mstart, end);
        }
    },
    stopVideo: function () {
        if ($exeDevice.videoType > 0) {
            $exeDevice.stopVideoLocal();
        } else {
            $exeDevice.stopVideoYT();
        }
    },
    muteVideo: function (mute) {
        mute = $exeDevice.videoType == 2 ? false : mute;
        if ($exeDevice.videoType > 0) {
            $exeDevice.muteVideoLocal(mute);
        } else {
            $exeDevice.muteVideoYT(mute);
        }
    },
    startVideoYT: function (id, start, end) {
        if ($exeDevice.player) {
            if (typeof $exeDevice.player.loadVideoById === "function") {
                $exeDevice.player.loadVideoById({
                    'videoId': id,
                    'startSeconds': start,
                    'endSeconds': end
                });
            }
            $('#vquextEVITime').show();
        }
    },
    stopVideoYT: function () {
        if ($exeDevice.player) {
            if (typeof $exeDevice.player.pauseVideo === "function") {
                $exeDevice.player.stopVideo();
            }
            if (typeof $exeDevice.player.clearVideo === "function") {
                $exeDevice.player.clearVideo();
            }
        }
    },
    muteVideoYT: function (mute) {
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
    updateTimerDisplayYT: function () {
        if ($exeDevice.videoType == 0) {
            if ($exeDevice.player) {
                if (typeof $exeDevice.player.getCurrentTime === "function") {
                    var time = $exeDevice.secondsToHour($exeDevice.player.getCurrentTime());
                    $('#vquextEVITime').text(time);
                }
                if (typeof $exeDevice.player.getDuration === "function") {
                    var lduration = Math.floor($exeDevice.player.getDuration());
                    if (!isNaN(lduration) && lduration > 0) {
                        $exeDevice.durationVideo = lduration;
                        if ($exeDevice.endVideoQuExt < 1) {
                            $exeDevice.endVideoQuExt = $exeDevice.durationVideo;
                        }
                    }
                }
            }
        }
    },
    updateProgressBarYT: function () {
        $('#progress-bar').val(($eXeDevice.player.getCurrentTime() / $eXeDevice.player.getDuration()) * 100);
    },
    startVideoLocal: function (url, start, end) {
        if ($exeDevice.localPlayer) {
            $exeDevice.pointEnd = end;
            $exeDevice.localPlayer.src = url
            $exeDevice.localPlayer.currentTime = parseFloat(start)
            $exeDevice.localPlayer.play();
            $('#vquextEVITime').show();
        }
    },
    stopVideoLocal: function () {
        if ($exeDevice.localPlayer) {
            if (typeof $exeDevice.localPlayer.pause == "function") {
                $exeDevice.localPlayer.pause();
            }
        }
    },
    muteVideoLocal: function (mute) {
        if ($exeDevice.localPlayer) {
            $exeDevice.localPlayer.muted = mute;
        }
    },
    getDataVideoLocal: function (e) {
        if ($exeDevice.videoType > 0) {
            if (this.duration > 0) {
                $exeDevice.durationVideo = Math.floor(this.duration);
                var endVideo = $exeDevice.hourToSeconds($('#vquextEVIEnd').val()) || 0;
                if (endVideo < 1) {
                    $('#vquextEVIEnd').val($exeDevice.secondsToHour($exeDevice.durationVideo));
                }
            }
        }
    },
    updateTimerDisplayLocal: function () {
        if ($exeDevice.videoType > 0) {
            if ($exeDevice.localPlayer) {
                var currentTime = $exeDevice.localPlayer.currentTime;
                if (currentTime) {
                    var time = $exeDevice.secondsToHour(Math.floor(currentTime));
                    $('#vquextEVITime').text(time);
                    if (Math.ceil(currentTime) == $exeDevice.pointEnd || Math.ceil(currentTime) == $exeDevice.durationVideo) {
                        $exeDevice.localPlayer.pause();
                        $exeDevice.pointEnd = 100000;
                    }
                }
            }
        }
    },
    updateProgressBarLocal: function () {
        if ($exeDevice.localPlayer) {
            $('#progress-bar').val((Math.round($exeDevice.localPlayer.currentTime) / Math.round($exeDevice.localPlayer.duration)) * 100);
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
            $exeDevice.showPlayer();
            $('#vquextNumberQuestion').val($exeDevice.questionsGame.length);
            $('#vquextENumQuestions').text($exeDevice.questionsGame.length);
            $exeDevice.updateQuestionsNumber();
        }
    },
    removeQuestion: function (num) {
        if ($exeDevice.questionsGame.length < 2) {
            $exeDevice.showMessage($exeDevice.msgs.msgEOneQuestion);
            return;
        } else {
            $exeDevice.questionsGame.splice($exeDevice.active, 1);
            if ($exeDevice.active >= $exeDevice.questionsGame.length - 1) {
                $exeDevice.active = $exeDevice.questionsGame.length - 1;
            }
            $exeDevice.showQuestion($exeDevice.active);
            $('#vquextENumQuestions').text($exeDevice.questionsGame.length);
            $('#vquextNumberQuestion').val($exeDevice.active + 1);
            $exeDevice.updateQuestionsNumber();
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
    nextQuestion: function () {
        if ($exeDevice.validateQuestion()) {
            var id = $exeDevice.questionsGame[$exeDevice.active].id,
                active = $exeDevice.randomizeQuestions(id);
            $exeDevice.active = active < $exeDevice.questionsGame.length - 1 ? active + 1 : $exeDevice.questionsGame.length - 1;
            $exeDevice.showQuestion($exeDevice.active);
        }
    },
    lastQuestion: function () {
        if ($exeDevice.validateQuestion()) {
            var id = $exeDevice.questionsGame[$exeDevice.active].id;
            $exeDevice.randomizeQuestions(id);
            $exeDevice.active = $exeDevice.questionsGame.length - 1;
            $exeDevice.showQuestion($exeDevice.active);
        }
    },
    previousQuestion: function () {

        if ($exeDevice.validateQuestion()) {
            var id = $exeDevice.questionsGame[$exeDevice.active].id,
                active = $exeDevice.randomizeQuestions(id);
            $exeDevice.active = active > 0 ? active - 1 : 0;
            $exeDevice.showQuestion($exeDevice.active);
        }
    },
    firstQuestion: function () {
        if ($exeDevice.validateQuestion()) {
            var id = $exeDevice.questionsGame[$exeDevice.active].id;
            $exeDevice.randomizeQuestions(id);
            $exeDevice.active = 0;
            $exeDevice.showQuestion($exeDevice.active);
        }
    },
    updateQuestionsNumber: function () {
        var percentaje = parseInt($exeDevice.removeTags($('#vquextEPercentajeQuestions').val()));
        if (isNaN(percentaje)) {
            return;
        }
        percentaje = percentaje < 1 ? 1 : percentaje;
        percentaje = percentaje > 100 ? 100 : percentaje;
        var num = Math.round((percentaje * $exeDevice.questionsGame.length) / 100);
        num = num == 0 ? 1 : num;
        $('#vquextENumeroPercentaje').text(num + "/" + $exeDevice.questionsGame.length)
    },
    showQuestion: function (i) {
        var num = i < 0 ? 0 : i;
        num = num >= $exeDevice.questionsGame.length ? $exeDevice.questionsGame.length - 1 : num;
        var p = $exeDevice.questionsGame[num],
            numOptions = 0;
        p.typeQuestion = p.typeQuestion ? p.typeQuestion : 0;
        if (p.typeQuestion == 0) {
            $('.gameQE-EAnwersOptions').each(function (j) {
                numOptions++;
                if (p.options[j].trim() !== '') {
                    p.numOptions = numOptions;
                }
                $(this).val(p.options[j]);
            });
            $('#vquextEQuestion').val(p.quextion);
            $('.gameQE-EAnwersOptions').each(function (j) {
                var option = j < p.numOptions ? p.options[j] : '';
                $(this).val(option);
            });
        } else {
            $('#vquextESolutionWord').val(p.solutionQuestion);
            $('#vquextEDefinitionWord').val(p.quextion);
        }
        $exeDevice.showTypeQuestion(p.typeQuestion);
        $exeDevice.showPlayer();
        $exeDevice.stopVideo();
        $exeDevice.showOptions(p.numberOptions);
        $('#vquextENumQuestions').text($exeDevice.questionsGame.length);
        $('#vquextECheckSoundVideo').prop('checked', p.soundVideo == 1);
        $('#vquextECheckImageVideo').prop('checked', p.imageVideo == 1);
        $('#vquextEMessageKO').val(p.msgError);
        $('#vquextEMessageOK').val(p.msgHit);
        $('#vquextPoint').val($exeDevice.secondsToHour(p.pointVideo));
        $('#vquextNumberQuestion').val(i + 1);
        $("input.gameQE-Number[name='vqxnumber'][value='" + p.numberOptions + "']").prop("checked", true)
        $("input.gameQE-ESolution[name='vqxsolution'][value='" + p.solution + "']").prop("checked", true);
        $("input.gameQE-Times[name='vqxtime'][value='" + p.time + "']").prop("checked", true);
        $("input.gameQE-TypeQuestion[name='vquexttypequestion'][value='" + p.typeQuestion + "']").prop("checked", true);
    },
    playQuestionVideo: function () {
        if ($exeDevice.validateQuestion()) {
            $exeDevice.showPlayer();
            var pointStart = $exeDevice.hourToSeconds($('#vquextEVIStart').val()),
                pointEnd = $exeDevice.hourToSeconds($('#vquextPoint').val()),
                url = $('#vquextEVIURL').val(),
                id = $exeDevice.questionsGame[$exeDevice.active].id,
                active = $exeDevice.randomizeQuestions(id);
            $exeDevice.active = active;
            if ($exeDevice.active > 0) {
                pointStart = $exeDevice.questionsGame[$exeDevice.active - 1].pointVideo;
            }
            $exeDevice.showQuestion($exeDevice.active);
            $exeDevice.startVideo(url, pointStart, pointEnd);
            var imageVideo = $('#vquextECheckImageVideo').is(':checked'),
                soundVideo = $('#vquextECheckSoundVideo').is(':checked');
            if ($exeDevice.videoType != 2) {
                if (!imageVideo) {
                    $('#vquextEVideo').hide();
                    $('#vquextEVideoLocal').hide();
                    $('#vquextENoImageVideo').show();
                }
                if (!soundVideo) {
                    $exeDevice.muteVideo(true)
                } else {
                    $exeDevice.muteVideo(false)
                }
            }
        }
    },
    showPlayer: function () {
        $('.gameQE-EVIAudioLabel').show();
        $('#vquextENoImageVideo').hide();
        $('#vquextECover').hide();
        $('#vquextENoVideo').hide();
        if ($exeDevice.videoType == 1 || $exeDevice.videoType == 3) {
            $('#vquextEVideoLocal').show();
            $('#vquextEVideo').hide();
        } else if ($exeDevice.videoType == 2) {
            $('#vquextEVideoLocal').show();
            $('#vquextEVideo').hide();
            $('#vquextENoImageVideo').show();
            $('.gameQE-EVIAudioLabel').hide();
        } else {
            $('#vquextEVideoLocal').hide();
            $('#vquextEVideo').show();
        }
    },
    clearQuestion: function () {
        $exeDevice.showOptions(4);
        $exeDevice.showSolution(0);
        $('.gameQE-Times')[0].checked = true;
        $('.gameQE-Number')[2].checked = true;
        $('#vquextPoint').val('00:00:00');
        $('#vquextEInitVideo').val('00:00:00');
        $('#vquextEEndVideo').val('00:00:00');
        $('#vquextECheckSoundVideo').prop('checked', true);
        $('#vquextECheckImageVideo').prop('checked', true);
        $('#vquextEQuestion').val('');
        $('#vquextESolutionWord').val('');
        $('#vquextEDefinitionWord').val('');
        $('.gameQE-EAnwersOptions').each(function () {
            $(this).val('');
        });
        $('#vquextEMessageOK').val('');
        $('#vquextEMessageKO').val('');
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
    showTypeQuestion: function (type) {
        if (type == 1) {
            $('input.gameQE-Number').prop('disabled', true);
            $('#vquextEAnswers').hide();
            $('#vquextEWordDiv').show();
            $('#vquextEQuestionDiv').hide();
        } else {
            $('#vquextEAnswers').show();
            $('#vquextEQuestionDiv').show();
            $('#vquextSolutionWordDiv').hide();
            $('input.gameQE-Number').prop('disabled', false);
            $('#vquextEWordDiv').hide();
        }
    },
    showSolution: function (solution) {
        $('.gameQE-ESolution')[solution].checked = true;
    },
    createForm: function () {
        var path = $exeDevice.iDevicePath,
            html = '\
			<div id="gameQEIdeviceForm">\
                <div class="exe-idevice-info">' + _("Create activities consisting on a video with interactive questions.") + ' <a href="https://descargas.intef.es/cedec/exe_learning/Manuales/manual_exe29/vdeoquext.html" hreflang="es" target="_blank">' + _("Use Instructions") + '</a></div>\
				<div class="exe-form-tab" title="' + _('General settings') + '">\
                ' + $exeAuthoring.iDevice.gamification.instructions.getFieldset(_("Choose the right answer")) + '\
                    <fieldset class="exe-fieldset exe-fieldset-closed">\
                        <legend><a href="#">' + _("Options") + '</a></legend>\
                        <div>\
                            <p>\
                                <label for="vquextEShowMinimize"><input type="checkbox" id="vquextEShowMinimize">' + _("Show minimized.") + '</label>\
                            </p>\
                            <p>\
                                <label for="vquextEAnswersRamdon"><input type="checkbox" id="vquextEAnswersRamdon">' + _("Random options") + '</label>\
                            </p>\
                            <p>\
                                <label for="vquextECustomMessages"><input type="checkbox" id="vquextECustomMessages">' + _("Custom messages") + '. </label>\
                            </p>\
                            <p>\
                                <label for="vquextEShowSolution"><input type="checkbox" checked id="vquextEShowSolution">' + _("Show solutions") + '. </label>\
                                <label for="vquextETimeShowSolution">' + _("Show solution time (seconds)") + ' <input type="number" name="vquextETimeShowSolution" id="vquextETimeShowSolution" value="3" min="1" max="9" /> </label>\
                            </p>\
                            <p>\
                                <strong class="GameModeLabel"><a href="#vquextEGameModeHelp" id="vquextEGameModeHelpLnk" class="GameModeHelpLink" title="' + _('Help') + '"><img src="' + path + 'quextIEHelp.gif" + width="16" height="16" alt="' + _('Help') + '"/></a> ' + _("Score") + ':</strong>\
                                <input class="gameQE-TypeGame" checked="checked" id="vquextETypeActivity" type="radio" name="vqxtgamemode" value="1" />\
                                <label for="vquextETypeActivity">' + _("0 to 10") + '</label>\
                                <input class="gameQE-TypeGame" id="vquextEGameMode" type="radio" name="vqxtgamemode" value="0" />\
                                <label for="vquextEGameMode">' + _("Points and lives") + '</label>\
                                <input class="gameQE-TypeGame" id="vquextETypeReto" type="radio" name="vqxtgamemode" value="2" />\
                                <label for="vquextETypeReto">' + _("No score") + '</label>\
                            </p>\
                            <div id="vquextEGameModeHelp" class="gameQE-TypeGameHelp">\
                                <ul>\
                                    <li><strong>' + _("0 to 10") + ': </strong>' + _("No lives, 0 to 10 score, right/wrong answers counter... A more educational context.") + '</li>\
                                    <li><strong>' + _("Points and lives") + ': </strong>' + _("Just like a game: Try to get a high score (thousands of points) and not to loose your lives.") + '</li>\
                                    <li><strong>' + _("No score") + ': </strong>' + _("No score and no lives. You have to answer right to get some information (a feedback).") + '</li>\
                                </ul>\
                            </div>\
                            <p>\
                                <label for="vquextEUseLives"><input type="checkbox" checked id="vquextEUseLives"> ' + _("Use lives") + '. </label> \
                                <label for="vquextENumberLives">' + _("Number of lives") + ':\
                                <input type="number" name="vquextENumberLives" id="vquextENumberLives" value="3" min="1" max="5" /> </label>\
                            </p>\
                            <p>\
                                <label for="vquextEHasFeedBack"><input type="checkbox"  id="vquextEHasFeedBack"> ' + _("Feedback") + '. </label> \
                                <label for="vquextEPercentajeFB"><input type="number" name="vquextEPercentajeFB" id="vquextEPercentajeFB" value="100" min="5" max="100" step="5" disabled />  ' + _("&percnt; right to see the feedback") + ' </label>\
                            </p>\
                            <p id="vquextEFeedbackP" class="gameQE-EFeedbackP">\
                                <textarea id="vquextEFeedBackEditor" class="exe-html-editor"\></textarea>\
                            </p>\
                            <p>\
                                <label for="vquextENavigable"><input type="checkbox" id="vquextENavigable">' + _("Navigable") + '. </label>\
                                <label for="vquextERepeatQuestion"><input type="checkbox" id="vquextERepeatQuestion" disabled>' + _("Repeat question") + '. </label>\
                            </p>\
                            <p class="gameQE-Flex">\
                                <label for="vquextEReloadQuestion"><input type="checkbox" id="vquextEReloadQuestion">' + _("Reload video") + '. </label>\
                                <label for="vquextEPreviewQuestions"><input type="checkbox" id="vquextEPreviewQuestions">' + _("Preview questions") + '. </label>\
                                <label for="vquextEPauseVideo"><input type="checkbox" id="vquextEPauseVideo">' + _("Pause video") + '. </label>\
                            </p>\
                            <p>\
                                <label for="vquextEAuthor">' + _("Authorship") + ': </label><input id="vquextEAuthor" type="text" />\
                            </p>\
                            <p>\
                                <label for="vquextEPercentajeQuestions">% ' + _("Questions") + ':  <input type="number" name="vquextEPercentajeQuestions" id="vquextEPercentajeQuestions" value="100" min="1" max="100" /> </label>\
                                <span id="vquextENumeroPercentaje">1/1</span>\
                            </p>\
                            <p>\
                                <label for="vquextEModeBoard"><input type="checkbox" id="vquextEModeBoard"> ' + _("Digital blackboard mode") + ' </label>\
                            </p>\
                            <p>\
                                <strong class=""><a href="#vquextEEvaluationHelp" id="vquextEEvaluationHelpLnk" class="GameModeHelpLink" title="' + _("Help") + '"><img src="' + path + 'quextIEHelp.gif"  width="16" height="16" alt="' + _("Help") + '"/></a></strong>\
								<label for="vquextEEvaluation"><input type="checkbox" id="vquextEEvaluation"> ' + _("Progress report") + '. </label> \
								<label for="vquextEEvaluationID">' + _("Identifier") + ':\
								<input type="text" id="vquextEEvaluationID" disabled/> </label>\
                            </p>\
                            <div id="vquextEEvaluationHelp" class="gameQE-TypeGameHelp">\
                                <p>' +_("You must indicate the ID. It can be a word, a phrase or a number of more than four characters. You will use this ID to mark the activities covered by this progress report. It must be the same in all iDevices of a report and different in each report.") + '</p>\
                            </div>\
                        </div>\
                    </fieldset>\
                    <fieldset class="exe-fieldset">\
                        <legend><a href="#">' + _("Questions") + '</a></legend>\
                        <div class="gameQE-EPanel" id="vquextEPanel">\
                            <div class="gameQE-Flex gameQE-EVIOptionsVQ">\
                                <div class="gameQE-EVILabel">\
                                    <label for="vquextEVIURL">URL:</label>\
                                    <input type="text" id="vquextEVIURL" class="exe-file-picker gameQE-EURLAudio" />\
                                </div>\
                                <a href="#" id="vquextEPlayStart" class="gameQE-ENavigationButton gameQE-EPlayVideo" title="' + _("Play video") + '"><img src="' + path + 'quextIEPlay.png" alt="' + _("Play") + '" class="gameQE-EButtonImage" /></a>\
                                <div class="gameQE-EVILabel">\
                                    <label for="vquextEVIStart">' + _("Start") + ':</label>\
                                    <input id="vquextEVIStart" type="text" value="00:00:00" maxlength="8" />\
                                </div>\
                                <div class="gameQE-EVILabel" >\
                                    <label for="vquextEVIEnd">' + _("End") + ':</label>\
                                    <input id="vquextEVIEnd" type="text" value="00:00:00" maxlength="8"/>\
                                </div>\
                            </div>\
                            <div class="gameQE-EOptionsMedia">\
                                <div class="gameQE-EOptionsGame">\
                                    <p>\
                                        <span>' + _("Type") + ':</span>\
                                        <span class="gameQE-EInputType">\
                                            <input class="gameQE-TypeQuestion" checked id="vquextTypeTest" type="radio" name="vquexttypequestion" value="0"/>\
                                            <label for="vquextTypeTest">' + _("Test") + '</label>\
                                            <input class="gameQE-TypeQuestion"  id="vquextTypeWord" type="radio" name="vquexttypequestion" value="1"/>\
                                            <label for="vquextTypeWord">' + _("Word") + '</label>\
                                        </span>\
                                    </p>\
                                    <p>\
                                        <span>' + _("Question point") + ':</span>\
                                        <span>\
                                            <label class="sr-av" for="vquextPoint">' + _("Question point") + ' </label>\
                                            <input id="vquextPoint" type="text" value="00:00:00"  maxlength="8"  />\
                                        </span>\
                                    </p>\
                                    <p >\
                                        <span>' + _("Options Number") + ':</span>\
                                        <span class="gameQE-EInputNumbers">\
                                            <input class="gameQE-Number" id="numQ2" type="radio" name="vqxnumber" value="2" />\
                                            <label for="numQ2">2</label>\
                                            <input class="gameQE-Number" id="numQ3" type="radio" name="vqxnumber" value="3" />\
                                            <label for="numQ3">3</label>\
                                            <input class="gameQE-Number" id="numQ4" type="radio" name="vqxnumber" value="4" checked="checked" />\
                                            <label for="numQ4">4</label>\
                                        </span>\
                                    </p>\
                                    <p>\
                                        <span>' + _("Time per question") + ':</span>\
                                        <span class="gameQE-EInputTimes">\
                                            <input class="gameQE-Times" checked="checked" id="q15s" type="radio" name="vqxtime" value="0" />\
                                            <label for="q15s">15s</label>\
                                            <input class="gameQE-Times" id="q30s" type="radio" name="vqxtime" value="1" />\
                                            <label for="q30s">30s</label>\
                                            <input class="gameQE-Times" id="q1m" type="radio" name="vqxtime" value="2" />\
                                            <label for="q1m">1m</label>\
                                            <input class="gameQE-Times" id="q3m" type="radio" name="vqxtime" value="3" />\
                                            <label for="q3m">3m</label>\
                                            <input class="gameQE-Times" id="q5m" type="radio" name="vqxtime" value="4" />\
                                            <label for="q5m">5m</label>\
                                            <input class="gameQE-Times" id="q10m" type="radio" name="vqxtime" value="5" />\
                                            <label for="q10m">10m</label>\
                                        </span>\
                                    </p>\
                                    <p class="gameQE-EVIAudioLabel">\
                                        <label for="vquextECheckSoundVideo">' + _("Audio") + ':</label>\
                                        <input id="vquextECheckSoundVideo" type="checkbox" checked="checked" />\
                                    </p>\
                                    <p class="gameQE-EVIAudioLabel">\
                                        <label for="vquextECheckImageVideo">' + _("Image") + ':</label>\
                                        <input id="vquextECheckImageVideo" type="checkbox" checked="checked" />\
                                    </p>\
                                    <p class="gameQE-Flex">\
                                        <label>' + _("Preview question") + ':</label>\
                                        <a href="#" id="vquextEPlayVideo" class="gameQE-ENavigationButton gameQE-EPlayVideo" title="' + _("Play video") + '"><img src="' + path + 'quextIEPlay.png" alt="' + _("Play") + '" class="gameQE-EButtonImage" /></a>\
                                    </p>\
                                </div>\
                                <div class="gameQE-EMultiMediaOption">\
                                    <div class="gameQE-EProgressBar" id="vquextEProgressBar">\
                                        <div class="gameQE-EInterBar" id="vquextEInterBar"></div>\
                                    </div>\
                                    <div class="gameQE-EMultiVideoQuExt gameQE-Flex" id="vquextEMultimedia">\
                                        <img class="gameQE-EMedia" src="' + path + 'quextIENoImageVideo.png" id="vquextENoImageVideo" alt="" />\
                                        <div class="gameQE-EMedia" id="vquextEVideo"></div>\
                                        <video class="gameQE-EMedia" id = "vquextEVideoLocal" preload="auto" controls></video>\
                                        <img class="gameQE-EMedia" src="' + path + 'quextIENoVideo.png"  id="vquextENoVideo" alt="" />\
                                        <img class="gameQE-EMedia" src="' + path + 'quextECoverVideoQuExt.png" id="vquextECover" alt="' + _("No image") + '" />\
                                    </div>\
                                    <div class="gameQE-EMultimediaData" id="vquextEMultimediaData">\
                                        <button class="gameQE-EVideoTime" id="vquextEVITime" type="button">00:00:00</button>\
                                    </div>\
                                </div>\
                            </div>\
                            <div class="gameQE-EContents">\
                                <div class="gameQE-EQuestionDiv" id="vquextEQuestionDiv">\
                                    <label class="sr-av">' + _("Question") + ':</label><input type="text" class="gameQE-EQuestion" id="vquextEQuestion">\
                                </div>\
                                <div class="gameQE-EAnswers" id="vquextEAnswers">\
                                    <div class="gameQE-EOptionDiv">\
                                        <label class="sr-av">' + _("Solution") + ' A:</label><input type="radio" class="gameQE-ESolution" name="vqxsolution" id="vquextESolution0" value="0" checked="checked" />\
                                        <label class="sr-av">' + _("Option") + ' A:</label><input type="text" class="gameQE-EOption0 gameQE-EAnwersOptions" id="vquextEOption0">\
                                    </div>\
                                    <div class="gameQE-EOptionDiv">\
                                        <label class="sr-av">' + _("Solution") + ' B:</label><input type="radio" class="gameQE-ESolution" name="vqxsolution" id="vquextESolution1" value="1" />\
                                        <label class="sr-av">' + _("Option") + ' B:</label><input type="text" class="gameQE-EOption1 gameQE-EAnwersOptions"  id="vquextEOption1">\
                                    </div>\
                                    <div class="gameQE-EOptionDiv">\
                                        <label class="sr-av">' + _("Solution") + ' C:</label><input type="radio" class="gameQE-ESolution" name="vqxsolution" id="vquextESolution2" value="2" />\
                                        <label class="sr-av">' + _("Option") + ' C:</label><input type="text" class="gameQE-EOption2 gameQE-EAnwersOptions"  id="vquextEOption2">\
                                    </div>\
                                    <div class="gameQE-EOptionDiv">\
                                        <label class="sr-av">' + _("Solution") + ' D:</label><input type="radio"  class="gameQE-ESolution" name="vqxsolution" id="vquextESolution3" value="3" />\
                                        <label class="sr-av">' + _("Option") + ' D:</label><input type="text" class="gameQE-EOption3 gameQE-EAnwersOptions"  id="vquextEOption3">\
                                    </div>\
                                </div>\
                                <div class="gameQE-EWordDiv" id="vquextEWordDiv">\
                                    <div class="gameQE-ESolutionWord"><label for="vquextESolutionWord">' + _("Word/Phrase") + ': </label><input type="text"  id="vquextESolutionWord"/></div>\
                                    <div class="gameQE-ESolutionWord"><label for="vquextEDefinitionWord">' + _("Definition") + ': </label><input type="text"  id="vquextEDefinitionWord"/></div>\
                                </div>\
                            </div>\
                            <div class="gameQE-EOrders" id="vquextEOrder">\
                                <div class="gameQE-ECustomMessage">\
                                    <span class="sr-av">' + _("Hit") + '</span><span class="gameQE-EHit"></span>\
                                    <label for="vquextEMessageOK">' + _("Message") + ':</label>\
                                    <input type="text" class=""  id="vquextEMessageOK">\
                                </div>\
                                <div class="gameQE-ECustomMessage">\
                                    <span class="sr-av">' + _("Error") + '</span><span class="gameQE-EError"></span>\
                                    <label for="vquextEMessageKO">' + _("Message") + ':</label>\
                                    <input type="text" class=""  id="vquextEMessageKO">\
                                </div>\
                            </div>\
                            <div class="gameQE-ENavigationButtons">\
                                <a href="#" id="vquextEAdd" class="gameQE-ENavigationButton" title="' + _("Add question") + '"><img src="' + path + 'quextIEAdd.png" alt="' + _("Add question") + '" class="gameQE-EButtonImage" /></a>\
                                <a href="#" id="vquextEFirst" class="gameQE-ENavigationButton"  title="' + _("First question") + '"><img src="' + path + 'quextIEFirst.png" alt="' + _("First question") + '" class="gameQE-EButtonImage" /></a>\
                                <a href="#" id="vquextEPrevious" class="gameQE-ENavigationButton" title="' + _("Previous question") + '"><img src="' + path + 'quextIEPrev.png" alt="' + _("Previous question") + '" class="gameQE-EButtonImage" /></a>\
                                <label class="sr-av" for="vquextNumberQuestion">' + _("Question number:") + ':</label><input type="text" class="gameQE-NumberQuestion"  id="vquextNumberQuestion" value="1"/>\
                                <a href="#" id="vquextENext" class="gameQE-ENavigationButton"  title="' + _("Next question") + '"><img src="' + path + 'quextIENext.png" alt="' + _("Next question") + '" class="gameQE-EButtonImage" /></a>\
                                <a href="#" id="vquextELast" class="gameQE-ENavigationButton"  title="' + _("Last question") + '"><img src="' + path + 'quextIELast.png" alt="' + _("Last question") + '" class="gameQE-EButtonImage" /></a>\
                                <a href="#" id="vquextEDelete" class="gameQE-ENavigationButton" title="' + _("Delete question") + '"><img src="' + path + 'quextIEDelete.png" alt="' + _("Delete question") + '" class="gameQE-EButtonImage" /></a>\
                            </div>\
                            <div class="gameQE-ENumQuestionDiv" id="vquextENumQuestionDiv">\
                               <div class="gameQE-ENumQ"><span class="sr-av">' + _("Number of questions:") + '</span></div>\ <span class="gameQE-ENumQuestions" id="vquextENumQuestions">0</span>\
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
        $exeDevice.enableForm(field);
        $exeAuthoring.iDevice.tabs.init("gameQEIdeviceForm");
        $exeAuthoring.iDevice.gamification.scorm.init();
    },

    initQuestions: function () {
        $('#vquextEInputOptionsImage').css('display', 'flex');
        $('#vquextEInputVideo').css('display', 'flex');
        $('#vquextEAuthorAlt').css('display', 'flex');
        $("#vquextMediaNormal").prop("disabled", false);
        $("#vquextMediaImage").prop("disabled", false);
        $("#vquextMediaText").prop("disabled", false);
        $("#vquextSolutionWordDiv").hide();
        $("#vquextERepeatQuestion").hide();
        $('label[for=vquextERepeatQuestion').hide();
        if ($exeDevice.questionsGame.length == 0) {
            var question = $exeDevice.getCuestionDefault();
            $exeDevice.questionsGame.push(question);
            this.showOptions(4);
            this.showSolution(0);
        }
        $exeDevice.localPlayer = document.getElementById('vquextEVideoLocal');
        $exeDevice.showTypeQuestion(0);
        this.active = 0;
    },
    getCuestionDefault: function () {
        var p = new Object();
        p.id = $exeDevice.getId();
        p.typeQuestion = 0;
        p.type = 3;
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
        p.solutionWord = '';
        p.hit = -1;
        p.error = -1;
        p.msgHit = '';
        p.msgError = '';
        return p;
    },
    loadPreviousValues: function (field) {
        var originalHTML = field.val();
        if (originalHTML != '') {
            $exeDevice.active = 0;
            var wrapper = $("<div></div>");
            wrapper.html(originalHTML);
            var json = $('.vquext-DataGame', wrapper).text(),
                version = $('.vquext-version', wrapper).text(),
                videoLink = $('.vquext-LinkLocalVideo', wrapper).attr('href');
            if (version.length == 1) {
                json = $exeDevice.Decrypt(json);
            }
            var dataGame = $exeDevice.isJsonString(json);
            dataGame.modeBoard = typeof dataGame.modeBoard == "undefined" ? false : dataGame.modeBoard;
            $exeDevice.active = 0;
            $exeDevice.questionsGame = dataGame.questionsGame;
            for (var i = 0; i < $exeDevice.questionsGame.length; i++) {
                $exeDevice.questionsGame[i].id = $exeDevice.getId();
            }
            var instructions = $(".vquext-instructions", wrapper);
            if (instructions.length == 1) {
                instructions = instructions.html() || ''
                if (tinyMCE.get('eXeGameInstructions')) {
                    tinyMCE.get('eXeGameInstructions').setContent(instructions);
                } else {
                    $("#eXeGameInstructions").val(instructions)
                }
            }
            var textFeedBack = $(".vquext-feedback-game", wrapper);
            if (textFeedBack.length == 1) {
                textFeedBack = textFeedBack.html() || ''
                if (tinyMCE.get('vquextEFeedBackEditor')) {
                    tinyMCE.get('vquextEFeedBackEditor').setContent(textFeedBack);
                } else {
                    $("#vquextEFeedBackEditor").val(textFeedBack)
                }
            }
            if (dataGame.videoType > 0) {
                dataGame.idVideoQuExt = videoLink;
            }
            var textAfter = $(".vquext-extra-content", wrapper);
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
            if ($exeDevice.videoType > 0) {
                $exeDevice.initClock(dataGame.videoType);
                $exeDevice.showPlayer();
            } else {
                $exeDevice.loadYoutubeApi();
            }
        }
    },
    validTime: function (time) {
        var reg = /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/;
        return (time.length == 8 && reg.test(time))
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
        game.authorVideo = typeof game.authorVideo != "undefined" ? game.authorVideo : "";
        game.customMessages = typeof game.customMessages == "undefined" ? false : game.customMessages;
        game.videoType = typeof game.videoType == "undefined" ? 0 : game.videoType;
        game.isNavigable = typeof game.isNavigable == "undefined" ? false : game.isNavigable;
        game.repeatQuestion = typeof game.repeatQuestion == "undefined" ? false : game.repeatQuestion;
        game.percentajeQuestions = typeof game.percentajeQuestions == "undefined" ? 100 : game.percentajeQuestions
        game.evaluation = typeof game.evaluation != "undefined" ? game.evaluation : false;
        game.evaluationID = typeof game.evaluationID != "undefined" ? game.evaluationID : '';
        $exeDevice.id = typeof game.id != "undefined" ? game.id : false;
        $('#vquextEShowMinimize').prop('checked', game.showMinimize);
        $('#vquextEQuestionsRamdon').prop('checked', game.optionsRamdon);
        $('#vquextEAnswersRamdon').prop('checked', game.answersRamdon);
        $('#vquextEReloadQuestion').prop('checked', game.reloadQuestion);
        $('#vquextEPreviewQuestions').prop('checked', game.previewQuestions);
        $('#vquextEPauseVideo').prop('checked', game.pauseVideo);
        $('#vquextEUseLives').prop('checked', game.useLives);
        $('#vquextENumberLives').val(game.numberLives);
        $('#vquextEPercentajeQuestions').val(game.percentajeQuestions || 100);
        $('#vquextEVideoIntro').val(game.idVideoQuExt);
        $('#vquextEShowSolution').prop('checked', game.showSolution);
        $('#vquextETimeShowSolution').val(game.timeShowSolution)
        $('#vquextETimeShowSolution').prop('disabled', !game.showSolution);
        $('#vquextENumberLives').prop('disabled', !game.useLives);
        $('#vquextEVIURL').val(game.idVideoQuExt);
        $('#vquextEVIEnd').val($exeDevice.secondsToHour(game.endVideoQuExt));
        $('#vquextEVIStart').val($exeDevice.secondsToHour(game.startVideoQuExt));
        $("#vquextEHasFeedBack").prop('checked', game.feedBack);
        $("#vquextEPercentajeFB").val(game.percentajeFB);
        $("input.gameQE-TypeGame[name='vqxtgamemode'][value='" + game.gameMode + "']").prop("checked", true);
        $("#vquextEUseLives").prop('disabled', game.gameMode != 0);
        $("#vquextENumberLives").prop('disabled', (game.gameMode != 0 && !game.useLives));
        $('#vquextECustomMessages').prop('checked', game.customMessages);
        $('#vquextEAuthor').val(game.authorVideo);
        $('#vquextENavigable').prop('checked', game.isNavigable);
        $('#vquextERepeatQuestion').prop('checked', game.repeatQuestion);
        $('#vquextERepeatQuestion').prop('disabled', !game.isNavigable);
        $('#vquextEModeBoard').prop("checked", game.modeBoard);
        $('#vquextEEvaluation').prop('checked', game.evaluation);
        $('#vquextEEvaluationID').val(game.evaluationID);
        $("#vquextEEvaluationID").prop('disabled', (!game.evaluation));
        $exeDevice.updateGameMode(game.gameMode, game.feedBack, game.useLives);
        $exeDevice.showSelectOrder(game.customMessages);
        $exeAuthoring.iDevice.gamification.scorm.setValues(game.isScorm, game.textButtonScorm, game.repeatActivity);
        $exeDevice.showQuestion($exeDevice.active);
        $exeDevice.videoType = typeof game.videoType == "udefined" ? 0 : game.videoType;
        $exeDevice.idVideoQuExt = game.idVideoQuExt;
        $exeDevice.endVideoQuExt = game.endVideoQuExt;
        $exeDevice.startVideoQuExt = game.startVideoQuExt;
        $exeDevice.pointStart = game.startVideoQuExt;
        $exeDevice.pointEnd = game.endVideoQuExt;
        $exeDevice.videoType = game.videoType;
        for (var i = 0; i < game.questionsGame.length; i++) {
            game.questionsGame[i].msgHit = typeof game.questionsGame[i].msgHit == "undefined" ? "" : game.questionsGame[i].msgHit;
            game.questionsGame[i].msgError = typeof game.questionsGame[i].msgError == "undefined" ? "" : game.questionsGame[i].msgError;
        }
        $('#vquextENumQuestions').text($exeDevice.questionsGame.length);
        $('#vquextNumberQuestion').val($exeDevice.active + 1);
        if (game.videoType > 0) {
            $('#vquextEVideo').hide();
            $('#vquextEVideoLocal').show();

        } else {
            $('#vquextEVideo').show();
            $('#vquextEVideoLocal').hide();
        }
        $exeDevice.updateQuestionsNumber();
    },
    updateGameMode: function (gamemode, feedback, useLives) {
        $("#vquextEUseLives").prop('disabled', true);
        $("#vquextENumberLives").prop('disabled', true);
        $('#vquextEPercentajeFB').prop('disabled', true);
        $('#vquextEHasFeedBack').prop('disabled', gamemode == 2);
        $('#vquextEHasFeedBack').prop('checked', feedback);
        if (gamemode == 2 || feedback) {
            $('#vquextEFeedbackP').slideDown();
            $('#vquextEPercentajeFB').prop('disabled', false);
        }
        if (gamemode != 2 && !feedback) {
            $('#vquextEFeedbackP').slideUp();
        }
        if (gamemode == 0) {
            $("#vquextEUseLives").prop('disabled', false);
            $("#vquextENumberLives").prop('disabled', !useLives);
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

    getIDMediaTeca: function (url) {
        if (url) {
            var matc = url.indexOf("https://mediateca.educa.madrid.org/video/") != -1;
            if (matc) {
                var id = url.split("https://mediateca.educa.madrid.org/video/")[1].split("?")[0];
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
        $exeDevice.changesSaved = true;
        var fields = this.ci18n,
            i18n = fields;
        for (var i in fields) {
            var fVal = $("#ci18n_" + i).val();
            if (fVal != "") i18n[i] = fVal;
        }
        dataGame.msgs = i18n;
        var json = JSON.stringify(dataGame),
            divContent = "",
            linkVideo = $exeDevice.createLinkVideoLocal();
        var instructions = tinyMCE.get('eXeGameInstructions').getContent();
        if (instructions != "") divContent = '<div class="vquext-instructions">' + instructions + '</div>';
        var html = '<div class="vquext-IDevice">';
        html += divContent;
        html += '<div class="vquext-version js-hidden">' + $exeDevice.quextVersion + '</div>';
        html += '<div class="vquext-DataGame js-hidden">' + $exeDevice.Encrypt(json) + '</div>';
        var textAfter = tinyMCE.get('eXeIdeviceTextAfter').getContent();
        if (textAfter != "") {
            html += '<div class="vquext-extra-content">' + textAfter + '</div>';
        }
        var textFeedBack = tinyMCE.get('vquextEFeedBackEditor').getContent();
        if (textFeedBack != "") {
            html += '<div class="vquext-feedback-game">' + textFeedBack + '</div>';
        }
        html += linkVideo;
        html += '<div class="vquext-bns js-hidden">' + $exeDevice.msgs.msgNoSuportBrowser + '</div>';
        html += '</div>';
        return html;
    },
    createLinkVideoLocal: function () {
        var html = '';
        var linkVideo = '<a href="#" class="js-hidden vquext-LinkLocalVideo">0</a>'
        if ($exeDevice.videoType > 0) {
            var url = $('#vquextEVIURL').val().trim();
            linkVideo = '<a href="' + url + '" class="js-hidden vquext-LinkLocalVideo">0</a>'
        }
        html += linkVideo;
        return html;
    },
    validateQuestion: function () {
        var message = '',
            msgs = $exeDevice.msgs,
            p = new Object(),
            idVideoQuExt = $('#vquextEVIURL').val(),
            startVideoQuExt = $exeDevice.hourToSeconds($('#vquextEVIStart').val()),
            endVideoQuExt = $exeDevice.hourToSeconds($('#vquextEVIEnd').val()),
            validExtAudio = ['mp3', 'wav'],
            validExt = ['mp4', 'ogg', 'webm', 'ogv'],
            extension = idVideoQuExt.split('.').pop().toLowerCase(),
            isVideoLocal = (validExt.indexOf(extension) != -1) || (idVideoQuExt.toLowerCase().indexOf("google.com/videoplayback") != -1),
            isAudio = (validExtAudio.indexOf(extension) != -1) || (idVideoQuExt.toLowerCase().indexOf("https://drive.google.com") == 0 && idVideoQuExt.toLowerCase().indexOf('sharing') != -1);
        isMediaTeca = idVideoQuExt.indexOf("https://mediateca.educa.madrid.org/") == 0;
        if ($exeDevice.videoType == 0 && !$exeDevice.getIDYoutube(idVideoQuExt)) {
            $exeDevice.showMessage($exeDevice.msgs.msgECompleteURLYoutube);
            return false;
        } else if ($exeDevice.videoType == 1 && !isVideoLocal) {
            $exeDevice.showMessage($exeDevice.msgs.msgFormatVideo);
            return false;
        } else if ($exeDevice.videoType == 2 && !isAudio) {
            $exeDevice.showMessage($exeDevice.msgs.msgFormatVideo);
            return false;
        } else if ($exeDevice.videoType == 3 && !isMediaTeca) {
            $exeDevice.showMessage($exeDevice.msgs.msgFormatVideo);
            return false;
        } else if (!$exeDevice.validTime($('#vquextEVIStart').val()) || !$exeDevice.validTime($('#vquextEVIEnd').val())) {
            $exeDevice.showMessage($exeDevice.msgs.msgTimeFormat);
            return false;
        } else if (startVideoQuExt >= endVideoQuExt) {
            $exeDevice.showMessage($exeDevice.msgs.msgEStartEndIncorrect);
            return false;
        }
        p.id = $exeDevice.questionsGame[$exeDevice.active].id;
        p.type = 3
        p.pointVideo = $exeDevice.hourToSeconds($('#vquextPoint').val());
        p.time = parseInt($('input[name=vqxtime]:checked').val());
        p.numberOptions = parseInt($('input[name=vqxnumber]:checked').val());
        p.x = 0
        p.y = 0
        p.author = "";
        p.alt = "";
        p.url = ""
        p.msgHit = $('#vquextEMessageOK').val();
        p.msgError = $('#vquextEMessageKO').val();
        p.soundVideo = $('#vquextECheckSoundVideo').is(':checked') ? 1 : 0;
        p.imageVideo = $('#vquextECheckImageVideo').is(':checked') ? 1 : 0;
        p.iVideo = 0;
        p.fVideo = 0;
        p.eText = '';
        p.typeQuestion = parseInt($('input[name=vquexttypequestion]:checked').val());
        p.quextion = $('#vquextEQuestion').val().trim();
        if (p.typeQuestion == 1) {
            p.quextion = $('#vquextEDefinitionWord').val().trim();
        }
        p.options = [];
        p.solution = parseInt($('input[name=vqxsolution]:checked').val());
        p.solutionQuestion = $('#vquextESolutionWord').val();
        var optionEmpy = false;
        $('.gameQE-EAnwersOptions').each(function (i) {
            var option = $(this).val().trim();
            if (i < p.numberOptions && option.length == 0) {
                optionEmpy = true;
            }
            p.options.push(option);
        });
        if (!$exeDevice.validTime($('#vquextPoint').val())) {
            message = msgs.msgTimeFormat;
        } else if (p.pointVideo <= startVideoQuExt || p.pointVideo >= endVideoQuExt) {
            message = msgs.msgEPoiIncorrect;
        } else if (p.typeQuestion == 1 && $.trim(p.solutionQuestion).length == 0) {
            message = msgs.msgEProvideWord;
        } else if (p.typeQuestion == 0 && p.quextion.length == 0) {
            message = msgs.msgECompleteQuestion;
        } else if (p.typeQuestion == 1 && p.quextion.length == 0) {
            message = msgs.msgEDefintion;
        } else if (p.typeQuestion == 0 && optionEmpy) {
            message = msgs.msgECompleteAllOptions;
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
    exportGame: function () {
        if (!$exeDevice.validateQuestion()) {
            return;
        }
        var dataGame = this.validateData();
        if (!dataGame) {
            return;
        }
        if (dataGame.idVideoQuExt.indexOf('http') != 0) {
            $exeDevice.showMessage($exeDevice.msgs.msgExportFileError);
            return;
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
        link.download = _("Activity") + "-VideoQuExt.json";
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
        } else if (game.typeGame !== 'VideoQuExt') {
            $exeDevice.showMessage($exeDevice.msgs.msgESelectFile);
            return;
        }
        game.id = $exeDevice.generarID();
        $exeDevice.active = 0;
        $exeDevice.questionsGame = game.questionsGame;
        for (var i = 0; i < $exeDevice.questionsGame.length; i++) {
            var numOpt = 0,
                options = $exeDevice.questionsGame[i].options;
            $exeDevice.questionsGame[i].id = $exeDevice.getId();
            for (var j = 0; j < options.length; j++) {
                if (options[j].trim().length == 0) {
                    $exeDevice.questionsGame[i].numberOptions = numOpt;
                    break;
                }
                numOpt++;
            }
        }
        $exeDevice.updateFieldGame(game);
        if ($exeDevice.videoType > 0) {
            $exeDevice.initClock(game.videoType);
            $exeDevice.showPlayer();
            $exeDevice.startVideo(game.idVideoQuExt, game.startVideoQuExt, game.endVideoQuExt)
        } else {
            $exeDevice.initClock(game.videoType);
            $exeDevice.startVideo(game.idVideoQuExt, game.startVideoQuExt, game.endVideoQuExt)
        }
        var instructions = game.instructionsExe || game.instructions,
            tAfter = game.textAfter || "",
            textFeedBack = game.textFeedBack || "";
        tinyMCE.get('eXeGameInstructions').setContent(unescape(instructions));
        tinyMCE.get('eXeIdeviceTextAfter').setContent(unescape(tAfter));
        tinyMCE.get('vquextEFeedBackEditor').setContent(unescape(textFeedBack));
        $('.exe-form-tabs li:first-child a').click();
    },
    validateData: function () {
        var clear = $exeDevice.removeTags,
            instructions = $('#eXeGameInstructions').text(),
            instructionsExe = escape(tinyMCE.get('eXeGameInstructions').getContent()),
            textAfter = escape(tinyMCE.get('eXeIdeviceTextAfter').getContent()),
            textFeedBack = escape(tinyMCE.get('vquextEFeedBackEditor').getContent()),
            showMinimize = $('#vquextEShowMinimize').is(':checked'),
            answersRamdon = $('#vquextEAnswersRamdon').is(':checked'),
            reloadQuestion = $('#vquextEReloadQuestion').is(':checked'),
            previewQuestions = $('#vquextEPreviewQuestions').is(':checked'),
            pauseVideo = $('#vquextEPauseVideo').is(':checked'),
            optionsRamdon = false,
            showSolution = $('#vquextEShowSolution').is(':checked'),
            timeShowSolution = parseInt(clear($('#vquextETimeShowSolution').val())),
            useLives = $('#vquextEUseLives').is(':checked'),
            numberLives = parseInt(clear($('#vquextENumberLives').val())),
            idVideoQuExt = $('#vquextEVIURL').val().trim(),
            endVideoQuExt = $exeDevice.hourToSeconds($('#vquextEVIEnd').val()),
            startVideoQuExt = $exeDevice.hourToSeconds($('#vquextEVIStart').val()),
            itinerary = $exeAuthoring.iDevice.gamification.itinerary.getValues(),
            feedBack = $('#vquextEHasFeedBack').is(':checked'),
            percentajeFB = parseInt(clear($('#vquextEPercentajeFB').val())),
            gameMode = parseInt($('input[name=vqxtgamemode]:checked').val()),
            validExtAudio = ['mp3', 'wav'],
            validExt = ['mp4', 'ogg', 'webm', 'ogv'],
            extension = idVideoQuExt.split('.').pop().toLowerCase(),
            durationVideo = $exeDevice.videoType > 0 ? $exeDevice.localPlayer.duration : $exeDevice.durationVideo,
            customMessages = $('#vquextECustomMessages').is(':checked'),
            isVideoLocal = (validExt.indexOf(extension) != -1) || (idVideoQuExt.toLowerCase().indexOf("google.com/videoplayback") != -1),
            isAudio = (validExtAudio.indexOf(extension) != -1) || ((idVideoQuExt.toLowerCase().indexOf("https://drive.google.com") == 0 && idVideoQuExt.toLowerCase().indexOf('sharing') != -1)),
            isMediaTeca = idVideoQuExt.indexOf("https://mediateca.educa.madrid.org/videos") != 1,
            authorVideo = $('#vquextEAuthor').val(),
            isNavigable = $('#vquextENavigable').is(':checked'),
            repeatQuestion = $('#vquextERepeatQuestion').is(':checked'),
            percentajeQuestions = parseInt(clear($('#vquextEPercentajeQuestions').val())),
            modeBoard = $('#vquextEModeBoard').is(':checked'),
            evaluation = $('#vquextEEvaluation').is(':checked'),
            evaluationID = $('#vquextEEvaluationID').val(),
            id = $exeDevice.id ? $exeDevice.id : $exeDevice.generarID();

        if (!itinerary) return false;
        if ((gameMode == 2 || feedBack) && textFeedBack.trim().length == 0) {
            eXe.app.alert($exeDevice.msgs.msgProvideFB);
            return false;
        }
        if ($exeDevice.videoType == 0 && !$exeDevice.getIDYoutube(idVideoQuExt)) {
            $exeDevice.showMessage($exeDevice.msgs.msgECompleteURLYoutube);
            return false;
        } else if ($exeDevice.videoType == 1 && !isVideoLocal) {
            $exeDevice.showMessage($exeDevice.msgs.msgFormatVideo);
            return false;
        } else if ($exeDevice.videoType == 2 && !isAudio) {
            $exeDevice.showMessage($exeDevice.msgs.msgFormatVideo);
            return false;
        } else if ($exeDevice.videoType == 3 && !isMediaTeca) {
            $exeDevice.showMessage($exeDevice.msgs.msgFormatVideo);
            return false;
        } else if (showSolution && timeShowSolution.length == 0) {
            $exeDevice.showMessage($exeDevice.msgs.msgEProvideTimeSolution);
            return false;
        } else if (!$exeDevice.validTime($('#vquextEVIStart').val()) || !$exeDevice.validTime($('#vquextEVIEnd').val())) {
            $exeDevice.showMessage($exeDevice.msgs.msgTimeFormat);
            return;
        } else if (startVideoQuExt >= endVideoQuExt) {
            $exeDevice.showMessage($exeDevice.msgs.msgEStartEndIncorrect);
            return;
        } else if (endVideoQuExt > durationVideo + 1) {
            $exeDevice.showMessage($exeDevice.msgs.msgDuration);
            return;
        }
        if (evaluation && evaluationID.length < 5) {
            eXe.app.alert($exeDevice.msgs.msgIDLenght);
            return false;
        }
        var questionsGame = $exeDevice.questionsGame;
        for (var i = 0; i < questionsGame.length; i++) {
            var mquestion = questionsGame[i]
            if (mquestion.quextion.length == 0) {
                $exeDevice.showMessage($exeDevice.msgs.msgECompleteQuestion);
                return false;
            }
            if (mquestion.pointVideo < startVideoQuExt || mquestion.pointVideo > endVideoQuExt) {
                $exeDevice.showMessage($exeDevice.msgs.msgEPoiIncorrect);
                return false;
            }
            if (mquestion.typeQuestion == 1) {
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
        var scorm = $exeAuthoring.iDevice.gamification.scorm.getValues();
        var data = {
            'asignatura': '',
            "author": "",
            'typeGame': 'VideoQuExt',
            'endVideoQuExt': endVideoQuExt,
            'idVideoQuExt': idVideoQuExt,
            'startVideoQuExt': startVideoQuExt,
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
            'reloadQuestion': reloadQuestion,
            'previewQuestions': previewQuestions,
            'pauseVideo': pauseVideo,
            'textAfter': textAfter,
            'textFeedBack': textFeedBack,
            'gameMode': gameMode,
            'feedBack': feedBack,
            'percentajeFB': percentajeFB,
            'videoType': $exeDevice.videoType,
            'customMessages': customMessages,
            'version': 2,
            'authorVideo': authorVideo,
            'isNavigable': isNavigable,
            'repeatQuestion': repeatQuestion,
            'percentajeQuestions': percentajeQuestions,
            'modeBoard': modeBoard,
            'evaluation': evaluation,
            'evaluationID': evaluationID,
            'id': id
        }
        return data;
    },
    showSelectOrder: function (messages, custonmScore) {
        if (messages) {
            $('.gameQE-EOrders').slideDown();
        } else {
            $('.gameQE-EOrders').slideUp();
        }
    },
    removeTags: function (str) {
        var wrapper = $("<div></div>");
        wrapper.html(str);
        return wrapper.text();
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
        str = unescape(str);
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
    addEvents: function () {
        $('#vquextEUseLives').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#vquextENumberLives').prop('disabled', !marcado);
        });
        $('#vquextEShowSolution').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#vquextETimeShowSolution').prop('disabled', !marcado);
        });

        $('#vquextShowCodeAccess').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#vquextCodeAccess').prop('disabled', !marcado);
            $('#vquextMessageCodeAccess').prop('disabled', !marcado);
        });
        $('.gameQE-EPanel').on('click', 'input.gameQE-Number', function (e) {
            var number = parseInt($(this).val());
            $exeDevice.showOptions(number);
        });
        $('.gameQE-EPanel').on('click', 'input.gameQE-TypeQuestion', function (e) {
            var type = parseInt($(this).val());
            $exeDevice.showTypeQuestion(type);
        });
        $('#vquextEAdd').on('click', function (e) {
            e.preventDefault();
            $exeDevice.addQuestion()
        });
        $('#vquextEFirst').on('click', function (e) {
            e.preventDefault();
            $exeDevice.firstQuestion()
        });
        $('#vquextEPrevious').on('click', function (e) {
            e.preventDefault();
            $exeDevice.previousQuestion()
        });
        $('#vquextENext').on('click', function (e) {
            e.preventDefault();
            $exeDevice.nextQuestion()
        });
        $('#vquextELast').on('click', function (e) {
            e.preventDefault();
            $exeDevice.lastQuestion()
        });
        $('#vquextEDelete').on('click', function (e) {
            e.preventDefault();
            $exeDevice.removeQuestion()
        });
        $('#vquextEPlayVideo').on('click', function (e) {
            e.preventDefault();
            $exeDevice.playQuestionVideo();
        });
        $('#vquextENumberLives').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 1);
            this.value = v;
        });
        $('#vquextENumberLives').on('focusout', function () {
            this.value = this.value.trim() == '' ? 3 : this.value;
            this.value = this.value > 5 ? 5 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
        });
        $('#vquextEPercentajeQuestions').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 3);
            this.value = v;
            if (this.value > 0 && this.value < 101) {
                $exeDevice.updateQuestionsNumber();
            }
        });
        $('#vquextEPercentajeQuestions').on('click', function () {
            $exeDevice.updateQuestionsNumber();
        });
        $('#vquextEPercentajeQuestions').on('focusout', function () {
            this.value = this.value.trim() == '' ? 100 : this.value;
            this.value = this.value > 100 ? 100 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
            $exeDevice.updateQuestionsNumber();
        });
        $('#vquextETimeShowSolution').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 1);
            this.value = v;
        });
        $('#vquextETimeShowSolution').on('focusout', function () {
            this.value = this.value.trim() == '' ? 3 : this.value;
            this.value = this.value > 9 ? 9 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
        });
        $('#vquextPoint, #vquextEVIStart, #vquextEVIEnd').on('focusout', function () {
            if (!$exeDevice.validTime(this.value)) {
                $(this).css({
                    'background-color': 'red',
                    'color': 'white'
                });
            }
        });
        $('#vquextPoint, #vquextEVIStart, #vquextEVIEnd').on('click', function () {
            $(this).css({
                'background-color': 'white',
                'color': '#2c6d2c'
            });
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

        $('#vquextPoint').css('color', '#2c6d2c');
        $('#vquextPoint').on('click', function (e) {
            e.preventDefault();
            $exeDevice.timeVIFocus = 0;
            $('#vquextPoint').css('color', '#2c6d2c');
            $('#vquextEVIStart').css('color', '#000000');
            $('#vquextEVIEnd').css('color', '#000000');
        });
        $('#vquextEVIStart').on('click', function (e) {
            e.preventDefault();
            $exeDevice.timeVIFocus = 1;
            $('#vquextPoint').css('color', '#000000');
            $('#vquextEVIStart').css('color', '#2c6d2c');
            $('#vquextEVIEnd').css('color', '#000000');
        });
        $('#vquextEVIEnd').on('click', function (e) {
            e.preventDefault();
            $exeDevice.timeVIFocus = 2;
            $('#vquextEVIEnd').css('color', '#2c6d2c');
            $('#vquextEVIStart').css('color', '#000000');
            $('#vquextPoint').css('color', '#000000');
        });
        $('#vquextEVITime').on('click', function (e) {
            e.preventDefault();
            if ($exeDevice.timeVIFocus == 0) {
                $('#vquextPoint').val($('#vquextEVITime').text());
                $('#vquextPoint').css({
                    'background-color': 'white',
                    'color': '#2c6d2c'
                });
            } else if ($exeDevice.timeVIFocus == 1) {
                $('#vquextEVIStart').val($('#vquextEVITime').text());
                $('#vquextEVIStart').css({
                    'background-color': 'white',
                    'color': '#2c6d2c'
                });
            } else if ($exeDevice.timeVIFocus == 2) {
                $('#vquextEVIEnd').val($('#vquextEVITime').text());
                $('#vquextEVIEnd').css({
                    'background-color': 'white',
                    'color': '#2c6d2c'
                });
            }
        });
        $('#vquextUseLives').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#vquextENumberLives').prop('disabled', !marcado);
        });
        $('#vquextEShowSolution').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#vquextETimeShowSolution').prop('disabled', !marcado);
        });

        $("#vquextEVIURL").change(function () {
            var url = $(this).val().trim(),
                id = $exeDevice.getIDYoutube(url);
            $('#vquextEVIEnd').val('00:00:00');
            if (typeof YT == "undefined" && id) {
                $exeDevice.loadYoutubeApi()
            } else {
                $exeDevice.loadVideo(url);
            }
        });

        $('#vquextEPlayStart').on('click', function (e) {
            e.preventDefault();
            var url = $('#vquextEVIURL').val().trim(),
                id = $exeDevice.getIDYoutube(url);
            if (typeof YT == "undefined" && id) {
                $exeDevice.loadYoutubeApi()
            } else {
                $exeDevice.loadVideo(url);
            }

        });
        $exeAuthoring.iDevice.gamification.itinerary.addEvents();
        $('#vquextEHasFeedBack').on('change', function () {
            var marcado = $(this).is(':checked');
            if (marcado) {
                $('#vquextEFeedbackP').slideDown();
            } else {
                $('#vquextEFeedbackP').slideUp();
            }
            $('#vquextEPercentajeFB').prop('disabled', !marcado);
        });
        $('#gameQEIdeviceForm').on('click', 'input.gameQE-TypeGame', function (e) {
            var gm = parseInt($(this).val()),
                fb = $('#vquextEHasFeedBack').is(':checked'),
                ul = $('#vquextEUseLives').is(':checked');
            $exeDevice.updateGameMode(gm, fb, ul);
        });
        $("#vquextEGameModeHelpLnk").click(function () {
            $("#vquextEGameModeHelp").toggle();
            return false;

        });
        if ($exeDevice.videoType > 0) {
            $exeDevice.startVideo($exeDevice.idVideoQuExt, $exeDevice.pointStart, $exeDevice.pointEnd);
            $exeDevice.showPlayer();
        }
        $('#vquextECustomMessages').on('change', function () {
            var messages = $(this).is(':checked');
            $exeDevice.showSelectOrder(messages);
        });
        $('#vquextENavigable').on('change', function () {
            var disable = $(this).is(':checked');
            $('#vquextERepeatQuestion').prop('disabled', !disable);
        });
        $('#vquextNumberQuestion').keyup(function (e) {
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
        $('#vquextEEvaluation').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#vquextEEvaluationID').prop('disabled', !marcado);
        });
        $("#vquextEEvaluationHelpLnk").click(function () {
            $("#vquextEEvaluationHelp").toggle();
            return false;

        });


    },
    initClock: function (type) {
        $exeDevice.endVideoQuExt = 0;
        $exeDevice.localPlayer.removeEventListener("timeupdate", $exeDevice.timeUpdateVideoLocal, false);
        $exeDevice.localPlayer.removeEventListener("loadedmetadata", $exeDevice.getDataVideoLocal);
        clearInterval($exeDevice.timeUpdateInterval);
        if (type > 0) {
            $exeDevice.localPlayer.addEventListener("loadedmetadata", $exeDevice.getDataVideoLocal);
            $exeDevice.localPlayer.addEventListener("timeupdate", $exeDevice.timeUpdateVideoLocal, false);
        } else {
            $exeDevice.timeUpdateInterval = setInterval(function () {
                if ($exeDevice.videoType == 0) {
                    $exeDevice.updateTimerDisplayYT();
                }
            }, 1000);
        }
    },
    timeUpdateVideoLocal: function () {
        if ($exeDevice.videoType > 0) {
            $exeDevice.updateTimerDisplayLocal();
        }
    },
    placeImageWindows: function (img, naturalWidth, naturalHeight) {
        var wDiv = $(img).parent().width() > 0 ? $(img).parent().width() : 1,
            hDiv = $(img).parent().height() > 0 ? $(img).parent().height() : 1,
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
    loadVideo: function (url) {
        if (url.trim().length == 0 || $exeDevice.videoLoading) {
            return;
        }
        $exeDevice.videoLoading = true;
        var id = $exeDevice.getIDYoutube(url),
            validExtAudio = ['mp3', 'wav'],
            validExt = ['mp4', 'ogg', 'webm'],
            extension = url.split('.').pop().toLowerCase(),
            isVideoLocal = (validExt.indexOf(extension) != -1) || (url.toLowerCase().indexOf("google.com/videoplayback") != -1),
            isAudio = (validExtAudio.indexOf(extension) != -1) || ((url.toLowerCase().indexOf("https://drive.google.com") == 0 && url.toLowerCase().indexOf('sharing') != -1)),
            isMediaTeca = $exeDevice.getIDMediaTeca(url);
        if (!id && validExt.indexOf(extension) == -1 && !isVideoLocal &&
            validExtAudio.indexOf(extension) == -1 && !isAudio && !isMediaTeca) {
            eXe.app.alert($exeDevice.msgs.msgFormatVideo);
            return;
        }
        if (isVideoLocal) {
            $exeDevice.videoType = 1;
            $exeDevice.localPlayer.pause();
        } else if (isAudio) {
            $exeDevice.videoType = 2;
            $exeDevice.localPlayer.pause();
        } else if (isMediaTeca) {
            $exeDevice.videoType = 3;
            $exeDevice.localPlayer.pause();
        } else {
            $exeDevice.videoType = 0;
            $exeDevice.localPlayer.src == "";
        }
        $exeDevice.initClock($exeDevice.videoType);
        $exeDevice.startVideo(url, $exeDevice.pointStart, $exeDevice.pointEnd);
        $exeDevice.showPlayer();
        $exeDevice.videoLoading = false;
    }
}