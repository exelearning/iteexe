/**
 * VideoQuExt Activity iDevice (edition code)
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
        name: _('VideoQuExt Activity'),
        alt: _('Fast Video Quiz') // To review
    },
    iDevicePath: "/scripts/idevices/videoquext-activity/edition/",
    msgs: {},
    active: 0,
    questionsGame: [],
    youtubeLoaded: false,
    player: '',
    timeUpdateInterval: '',
    timeVideoFocus: 0,
    durationVideo: 0,
    timeVIFocus: 0,
    changesSaved: false,
    inEdition: true,
    quextVersion: 1,
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
        "msgAuthor": _("Author"),
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
        msgs.msgECompleteURLYoutube = _("Type the right URL of a Youtube video");
        msgs.msgEStartEndVideo = _("You have to indicate the start and the end of the video that you want to show");
        msgs.msgEStartEndIncorrect = _("The video end value must be higher than the start one");
        msgs.msgWriteText = _("You have to type a text in the editor");
        msgs.msgEPoiIncorrect = _("That second is not part of the video. Please check the video duration.");
        msgs.msgEPointExist = _("There is already a question in that second.");
        msgs.msgTimeFormat = _("Please check the time format: hh:mm:ss");
        msgs.msgProvideSolution = _("Please write the solution");
        msgs.msgEDefintion = _("Please provide the word definition");
        msgs.msgProvideFB = _('Indica el mensaje que se mostrará al superar el juego, actividad o reto');
        msgs.msgDuration=_('El valor del punto de fin del vídeo no puede ser superior a la duración del vídeo')
    },
    getId: function () {
        var randomstring = Math.random().toString(36).slice(-8);
        return randomstring;
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
        if (event.data == YT.PlayerState.PLAYING || event.data == YT.PlayerState.paused ) {
            $exeDevice.durationVideo=Math.floor($exeDevice.player.getDuration());
            if ($exeDevice.hourToSeconds($('#vquextEVIEnd').val()) == 0) {
                var duration = $exeDevice.secondsToHour(Math.floor($exeDevice.player.getDuration()));
                $('#vquextEVIEnd').val(duration);
            }
        }
    },

    onPlayerReady: function (event) {
        $exeDevice.youtubeLoaded = true;
        var idV = $exeDevice.getIDYoutube($('#vquextEVIURL').val());
        if (idV) {
            $('#vquextEVideo').show();
            $('#vquextENoImageVideo').hide();
            $('#vquextECover').hide();
            $('#vquextENoVideo').hide();
            $exeDevice.startVideo(idV, 0, 1);
        }
        clearInterval($exeDevice.timeUpdateInterval);
        $exeDevice.timeUpdateInterval = setInterval(function () {
            $exeDevice.updateTimerDisplay();
        }, 1000);
    },
    updateTimerDisplay: function () {
        if ($exeDevice.player) {
            if (typeof $exeDevice.player.getCurrentTime === "function") {
                var time = $exeDevice.secondsToHour($exeDevice.player.getCurrentTime());
                $('#vquextEVITime').text(time);
            }
        }
        //$('#duration').text(formatTime( player.getDuration() ));
    },
    updateProgressBar: function () {
        $('#progress-bar').val((player.getCurrentTime() / player.getDuration()) * 100);
    },
    onPlayerError: function (event) {
        //$exeDevice.showMessage("El video vquextdo no está disponible")
    },
    startVideo: function (id, start, end) {
        start = start < 1 ? 0.1 : start;
        if ($exeDevice.player) {
            if (typeof $exeDevice.player.loadVideoById === "function") {
                $exeDevice.player.loadVideoById({
                    'videoId': id,
                    'startSeconds': start,
                    'endSeconds': end
                });
            }
            $('#vquextEVITime').show();
            //$('#vquextEProgressBar').show();
            clearInterval($exeDevice.timeUpdateInterval);
            $exeDevice.timeUpdateInterval = setInterval(function () {
                $exeDevice.updateTimerDisplay();
            }, 1000);
        }

    },
    stopVideo: function () {

        if ($exeDevice.player) {
            if (typeof $exeDevice.player.pauseVideo === "function") {
                $exeDevice.player.stopVideo();

            }
            if (typeof $exeDevice.player.clearVideo === "function") {
                $exeDevice.player.clearVideo();

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
    showMessage: function (msg) {
        eXe.app.alert(msg);
    },
    addQuestion: function () {
        if ($exeDevice.validateQuestion() != false) {
            $exeDevice.clearQuestion();
            $exeDevice.questionsGame.push($exeDevice.getCuestionDefault());
            $exeDevice.active = $exeDevice.questionsGame.length - 1;
            $exeDevice.showVideoReproductor();
            $('#vquextNumberQuestion').text($exeDevice.questionsGame.length);
            $('#vquextENumQuestions').text($exeDevice.questionsGame.length);
        }
    },
    removeQuestion: function (num) {
        if ($exeDevice.questionsGame.length < 2) {
            $exeDevice.showMessage(msgs.msgEOneQuestion);
            return;
        } else {
            $exeDevice.questionsGame.splice($exeDevice.active, 1);
            if ($exeDevice.active >= $exeDevice.questionsGame.length - 1) {
                $exeDevice.active = $exeDevice.questionsGame.length - 1;
            }
            $exeDevice.showQuestion($exeDevice.active);
            $('#vquextENumQuestions').text($exeDevice.questionsGame.length);
            $('#vquextNumberQuestion').text($exeDevice.active + 1);
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
        $exeDevice.showVideoReproductor();
        $exeDevice.stopVideo();
        $exeDevice.showOptions(p.numberOptions);
        $('#vquextENumQuestions').text($exeDevice.questionsGame.length);
        $('#vquextECheckSoundVideo').prop('checked', p.soundVideo == 1);
        $('#vquextECheckImageVideo').prop('checked', p.imageVideo == 1);
        $('#vquextPoint').val($exeDevice.secondsToHour(p.pointVideo));

        $('#vquextNumberQuestion').text(i + 1);
        $("input.gameQE-Number[name='vqxnumber'][value='" + p.numberOptions + "']").prop("checked", true)
        $("input.gameQE-ESolution[name='vqxsolution'][value='" + p.solution + "']").prop("checked", true);
        $("input.gameQE-Times[name='vqxtime'][value='" + p.time + "']").prop("checked", true);
        $("input.gameQE-TypeQuestion[name='vquexttypequestion'][value='" + p.typeQuestion + "']").prop("checked", true);

        //$exeDevice.createPointsVideo();

    },
    showVideoQuestion: function () {
        if ($exeDevice.validateQuestion()) {
            var soundVideo = $('#vquextECheckSoundVideo').is(':checked') ? 1 : 0,
                imageVideo = $('#vquextECheckImageVideo').is(':checked') ? 1 : 0,
                pointStart = $exeDevice.hourToSeconds($('#vquextEVIStart').val()),
                pointEnd = $exeDevice.hourToSeconds($('#vquextPoint').val()),
                idVideo = $exeDevice.getIDYoutube($('#vquextEVIURL').val()),
                id = $exeDevice.questionsGame[$exeDevice.active].id,
                active = $exeDevice.randomizeQuestions(id);
            $exeDevice.active = active;
            if ($exeDevice.active > 0) {
                pointStart = $exeDevice.questionsGame[$exeDevice.active - 1].pointVideo;
            }
            $('#vquextENoImageVideo').hide();
            $('#vquextECover').hide();
            $('#vquextENoVideo').hide();
            $exeDevice.startVideo(idVideo, pointStart, pointEnd);
            $('#vquextEVideo').show();
            if (imageVideo == 0) {
                $('#vquextEVideo').hide();
                $('#vquextENoImageVideo').show();
            }
            if (soundVideo == 0) {
                $exeDevice.muteVideo(true)
            } else {
                $exeDevice.muteVideo(false)
            }
        } else {
            $exeDevice.showMessage(_("This video is not currently available"));
            $('#vquextENoVideo').show();
        }
    },
    showVideo: function () {
        if ($exeDevice.validateQuestion()) {
            var soundVideo = $('#vquextECheckSoundVideo').is(':checked') ? 1 : 0,
                imageVideo = $('#vquextECheckImageVideo').is(':checked') ? 1 : 0,
                pointStart = $exeDevice.hourToSeconds($('#vquextEVIStart').val()),
                pointEnd = $exeDevice.hourToSeconds($('#vquextPoint').val()),
                idVideo = $exeDevice.getIDYoutube($('#vquextEVIURL').val()),
                id = $exeDevice.questionsGame[$exeDevice.active].id,
                active = $exeDevice.randomizeQuestions(id);
            $exeDevice.active = active;
            if ($exeDevice.active > 0) {
                pointStart = $exeDevice.questionsGame[$exeDevice.active - 1].pointVideo;
            }
            $('#vquextENoImageVideo').hide();
            $('#vquextECover').hide();
            $('#vquextENoVideo').hide();
            $exeDevice.startVideo(idVideo, pointStart, pointEnd);
            $('#vquextEVideo').show();
            if (imageVideo == 0) {
                $('#vquextEVideo').hide();
                $('#vquextENoImageVideo').show();
            }
            if (soundVideo == 0) {
                $exeDevice.muteVideo(true)
            } else {
                $exeDevice.muteVideo(false)
            }
        }
    },
    showVideoReproductor: function () {
        $('#vquextENoImageVideo').hide();
        $('#vquextECover').hide();
        $('#vquextENoVideo').hide();
        $('#vquextEVideo').show();
        $exeDevice.muteVideo(false)
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
                                <label for="vquextEShowSolution"><input type="checkbox" checked id="vquextEShowSolution">' + _("Show solutions") + '. </label>\
                                <label for="vquextETimeShowSolution">' + _("Show solution time (seconds)") + ' <input type="number" name="vquextETimeShowSolution" id="vquextETimeShowSolution" value="3" min="1" max="9" /> </label>\
                            </p>\
                            <p>\
                                <input class="gameQE-TypeGame" checked="checked" id="vquextEGameMode" type="radio" name="vqxtgamemode" value="0" />\
                                <label for="vquextEGameMode">' + _("Game") + '</label>\
                                <input class="gameQE-TypeGame"  id="vquextETypeActivity" type="radio" name="vqxtgamemode" value="1" />\
                                <label for="vquextETypeActivity">' + _("Activity") + '</label>\
                                <input class="gameQE-TypeGame"  id="vquextETypeReto" type="radio" name="vqxtgamemode" value="2" />\
                                <label for="vquextETypeReto">' + _("Challenge") + '</label>\
                            </p>\
                            <p>\
                                <label for="vquextEUseLives"><input type="checkbox" checked id="vquextEUseLives"> ' + _("Use lives") + '. </label> \
                                <label for="vquextENumberLives">' + _("Number of lives") + ':\
                                <input type="number" name="vquextENumberLives" id="vquextENumberLives" value="3" min="1" max="5" /> </label>\
                            </p>\
                            <p>\
                                <label for="vquextEHasFeedBack"><input type="checkbox"  id="vquextEHasFeedBack"> ' + _("Feedback") + '. </label> \
                                <input type="number" name="vquextEPercentajeFB" id="vquextEPercentajeFB" value="100" min="5" max="100" step="5" disabled /> </label>\
                            </p>\
                            <p id="vquextEFeedbackP" class="gameQE-EFeedbackP">\
                                <textarea id="vquextEFeedBackEditor" class="exe-html-editor"\></textarea>\
                            </p>\
                            <p class="gameQE-Flex">\
                                <label for="vquextEReloadQuestion"><input type="checkbox" id="vquextEReloadQuestion">' + _("Reload video") + '. </label>\
                                <label for="vquextEPreviewQuestions"><input type="checkbox" id="vquextEPreviewQuestions">' + _("Preview questions") + '. </label>\
                                <label for="vquextEPauseVideo"><input type="checkbox" id="vquextEPauseVideo">' + _("Pause video") + '. </label>\
                            </p>\
                        </div>\
                    </fieldset>\
                    <fieldset class="exe-fieldset">\
                        <legend><a href="#">' + _("Questions") + '</a></legend>\
                        <div class="gameQE-EPanel" id="vquextEPanel">\
                            <div class="gameQE-Flex gameQE-EVIOptionsVQ">\
                                <div class="gameQE-EVILabel">\
                                    <label for="vquextEVIURL">' + _("Youtube URL") + ':</label>\
                                    <input id="vquextEVIURL"  type="text" />\
                                </div>\
                                <a href="#" id="vquextEPlayStart" class="gameQE-ENavigationButton gameQE-EPlayVideo" title="' + _("Play video") + '"><img src="' + path + "quextIEPlay.png" + '"  alt="" class="gameQE-EButtonImage" /></a>\
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
                                    <span>' + _("Type") + ':</span>\
                                    <div class="gameQE-EInputType">\
                                        <input class="gameQE-TypeQuestion" checked id="vquextTypeTest" type="radio" name="vquexttypequestion" value="0"/>\
                                        <label for="vquextTypeTest">' + _("Test") + '</label>\
                                        <input class="gameQE-TypeQuestion"  id="vquextTypeWord" type="radio" name="vquexttypequestion" value="1"/>\
                                        <label for="vquextTypeWord">' + _("Word") + '</label>\
                                    </div>\
                                     <span>' + _("Question point") + ':</span>\
                                    <div>\
                                        <label class="sr-av" for="vquextPoint">' + _("Question point") + ' </label>\
                                        <input id="vquextPoint" type="text" value="00:00:00"  maxlength="8"  />\
                                    </div>\
                                    <span>' + _("Options Number") + ':</span>\
                                    <div class="gameQE-EInputNumbers">\
                                        <input class="gameQE-Number" id="numQ2" type="radio" name="vqxnumber" value="2" />\
                                        <label for="numQ2">2</label>\
                                        <input class="gameQE-Number" id="numQ3" type="radio" name="vqxnumber" value="3" />\
                                        <label for="numQ3">3</label>\
                                        <input class="gameQE-Number" id="numQ4" type="radio" name="vqxnumber" value="4" checked="checked" />\
                                        <label for="numQ4">4</label>\
                                    </div>\
                                    <span>' + _("Time per question") + ':</span>\
                                    <div class="gameQE-EInputTimes">\
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
                                    </div>\
                                    <div class="gameQE-EVIAudioLabel">\
                                        <label for="vquextECheckSoundVideo">' + _("Audio") + ':</label>\
                                        <input id="vquextECheckSoundVideo" type="checkbox" checked="checked" />\
                                    </div>\
                                     <div class="gameQE-EVIAudioLabel">\
                                        <label for="vquextECheckImageVideo">' + _("Image") + ':</label>\
                                        <input id="vquextECheckImageVideo" type="checkbox" checked="checked" />\
                                    </div>\
                                    <div class="gameQE-Flex">\
                                        <label>' + _("Preview question") + ':</label>\
                                        <a href="#" id="vquextEPlayVideo" class="gameQE-ENavigationButton gameQE-EPlayVideo" title="' + _("Play video") + '"><img src="' + path + "quextIEPlay.png" + '"  alt="" class="gameQE-EButtonImage" /></a>\
                                    </div>\
                                </div>\
                                <div class="gameQE-EMultiMediaOption">\
                                    <div class="gameQE-EProgressBar" id="vquextEProgressBar">\
                                        <div class="gameQE-EInterBar" id="vquextEInterBar"></div>\
                                    </div>\
                                    <div class="gameQE-EMultimedia gameQE-Flex" id="vquextEMultimedia">\
                                        <div class="gameQE-EMedia" id="vquextEVideo"></div>\
                                        <img class="gameQE-EMedia" src="' + path + "quextIENoImageVideo.png" + '" id="vquextENoImageVideo" alt="" />\
                                        <img class="gameQE-EMedia" src="' + path + "quextIENoVideo.png" + '" id="vquextENoVideo" alt="" />\
                                        <img class="gameQE-EMediar" src="' + path + "vquextECover.png" + '" id="vquextECover" alt="' + _("No image") + '" />\
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
                            <div class="gameQE-ENavigationButtons">\
                                <a href="#" id="vquextEAdd" class="gameQE-ENavigationButton" title="' + _("Add question") + '"><img src="' + path + "quextIEAdd.png" + '"  alt="" class="gameQE-EButtonImage" /></a>\
                                <a href="#" id="vquextEFirst" class="gameQE-ENavigationButton"  title="' + _("First question") + '"><img src="' + path + "quextIEFirst.png" + '"  alt="" class="gameQE-EButtonImage" /></a>\
                                <a href="#" id="vquextEPrevious" class="gameQE-ENavigationButton" title="' + _("Previous question") + '"><img src="' + path + "quextIEPrev.png" + '"  alt="" class="gameQE-EButtonImage" /></a>\
                                <span class="sr-av">' + _("Question number:") + '</span><span class="gameQE-NumberQuestion" id="vquextNumberQuestion">1</span>\
                                <a href="#" id="vquextENext" class="gameQE-ENavigationButton"  title="' + _("Next question") + '"><img src="' + path + "quextIENext.png" + '"  alt="" class="gameQE-EButtonImage" /></a>\
                                <a href="#" id="vquextELast" class="gameQE-ENavigationButton"  title="' + _("Last question") + '"><img src="' + path + "quextIELast.png" + '"  alt="" class="gameQE-EButtonImage" /></a>\
                                <a href="#" id="vquextEDelete" class="gameQE-ENavigationButton" title="' + _("Delete question") + '"><img src="' + path + "quextIEDelete.png" + '"  alt="" class="gameQE-EButtonImage" /></a>\
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
        $exeDevice.loadYoutubeApi();
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
        if ($exeDevice.questionsGame.length == 0) {
            var question = $exeDevice.getCuestionDefault();
            $exeDevice.questionsGame.push(question);
            this.showOptions(4);
            this.showSolution(0);
        }
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
        p.options = [],
            p.options.push('');
        p.options.push('');
        p.options.push('');
        p.options.push('');
        p.solution = 0;
        p.solutionWord = '';
        return p;
    },
    loadPreviousValues: function (field) {
        var originalHTML = field.val();
        if (originalHTML != '') {
            $exeDevice.active = 0;
            var wrapper = $("<div></div>");
            wrapper.html(originalHTML);
            var json = $('.vquext-DataGame', wrapper).text(),
                version = $('.vquext-version', wrapper).text();
            if (version.length == 1) {
                json = $exeDevice.Decrypt(json);
            }
            var dataGame = $exeDevice.isJsonString(json);
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
        }
    },
    validTime: function (time) {
        var reg = /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/;
        return (time.length == 8 && reg.test(time))
    },
    updateFieldGame: function (game) {
        $exeAuthoring.iDevice.gamification.itinerary.setValues(game.itinerary);
        game.answersRamdon = game.answersRamdon || false;
        game.percentajeFB = typeof game.percentajeFB != "undefined" ? game.percentajeFB : 100;
        game.gameMode = typeof game.gameMode != "undefined" ? game.gameMode : 0;
        game.feedBack = typeof game.feedBack != "undefined" ? game.feedBack : false;
        $('#vquextEShowMinimize').prop('checked', game.showMinimize);
        $('#vquextEQuestionsRamdon').prop('checked', game.optionsRamdon);
        $('#vquextEAnswersRamdon').prop('checked', game.answersRamdon);
        $('#vquextEReloadQuestion').prop('checked', game.reloadQuestion);
        $('#vquextEPreviewQuestions').prop('checked', game.previewQuestions);
        $('#vquextEPauseVideo').prop('checked', game.pauseVideo);
        $('#vquextEUseLives').prop('checked', game.useLives);
        $('#vquextENumberLives').val(game.numberLives);
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
        $("#vquextEUseLives").prop('disabled', game.gameMode == 0);
        $("#vquextENumberLives").prop('disabled', (game.gameMode == 0 && game.useLives));
        $exeDevice.updateGameMode(game.gameMode, game.feedBack, game.useLives);
        $exeAuthoring.iDevice.gamification.scorm.setValues(game.isScorm, game.textButtonScorm, game.repeatActivity);
        $exeDevice.showQuestion($exeDevice.active);
        $('#vquextENumQuestions').text($exeDevice.questionsGame.length);
        $('#vquextNumberQuestion').text($exeDevice.active + 1);


        if (game.feedBack || game.gameMode == 2) {
            $('#vquextEFeedbackP').show();
        } else {
            $('#vquextEFeedbackP').hide();
        }
        $('#vquextEPercentajeFB').prop('disabled', !game.feedBack);

    },

    updateGameMode: function (gamemode, feedback, useLives) {

        $("#vquextEUseLives").prop('disabled', true);
        $("#vquextNumberLives").prop('disabled', true);
        $('#vquextPercentajeFB').prop('disabled', !feedback && gamemode != 2);
        $('#vquextEHasFeedBack').prop('disabled', gamemode == 2);
        $('#vquextEHasFeedBack').prop('checked', feedback);
        if (gamemode == 2 || feedback) {
            $('#vquextEFeedbackP').slideDown();
        }
        if (gamemode != 2 && !feedback) {
            $('#vquextEFeedbackP').slideUp();
        }
        if (gamemode == 0) {
            $("#vquextEUseLives").prop('disabled', false);
            $("#svquextENumberLives").prop('disabled', !useLives);
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
            divContent = "";
        var instructions = tinyMCE.get('eXeGameInstructions').getContent();
        if (instructions != "") divContent = '<div class="vquext-instructions">' + instructions + '</div>';
        var html = '<div class="vquext-IDevice">';
        html += divContent;
        html += '<div class="vquext-version js-hidden">' + $exeDevice.quextVersion + '</div>';
        html += '<div class="vquext-DataGame js-hidden">' + $exeDevice.Encrypt(json) + '</div>';

        // Get the optional text
        var textAfter = tinyMCE.get('eXeIdeviceTextAfter').getContent();
        if (textAfter != "") {
            html += '<div class="vquext-extra-content">' + textAfter + '</div>';
        }
        var textFeedBack = tinyMCE.get('vquextEFeedBackEditor').getContent();
        if (textFeedBack != "") {
            html += '<div class="vquext-feedback-game">' + textFeedBack + '</div>';
        }
        html += '</div>';
        return html;
    },
    validateQuestion: function () {
        var message = '',
            msgs = $exeDevice.msgs,
            p = new Object(),
            idVideoQuExt = $('#vquextEVIURL').val(),
            startVideoQuExt = $exeDevice.hourToSeconds($('#vquextEVIStart').val()),
            endVideoQuExt = $exeDevice.hourToSeconds($('#vquextEVIEnd').val());
        if (!$exeDevice.getIDYoutube(idVideoQuExt)) {
            $exeDevice.showMessage($exeDevice.msgs.msgECompleteURLYoutube);
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
        link.download = _("Game") + "VideoQuExt.json";
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
            idVideoQuExt = $('#vquextEVIURL').val(),
            endVideoQuExt = $exeDevice.hourToSeconds($('#vquextEVIEnd').val()),
            startVideoQuExt = $exeDevice.hourToSeconds($('#vquextEVIStart').val()),
            itinerary = $exeAuthoring.iDevice.gamification.itinerary.getValues(),
            feedBack = $('#vquextEHasFeedBack').is(':checked'),
            percentajeFB = parseInt(clear($('#vquextEPercentajeFB').val())),
            gameMode = parseInt($('input[name=vqxtgamemode]:checked').val());
        if (!itinerary) return false;
        if ((gameMode == 2 || feedBack) && textFeedBack.trim().length == 0) {
            eXe.app.alert($exeDevice.msgs.msgProvideFB);
            return false;
        }
        if (showSolution && timeShowSolution.length == 0) {
            $exeDevice.showMessage($exeDevice.msgs.msgEProvideTimeSolution);
            return false;
        } else if (!$exeDevice.getIDYoutube(idVideoQuExt)) {
            $exeDevice.showMessage($exeDevice.msgs.msgECompleteURLYoutube);
            return;
        } else if (!$exeDevice.validTime($('#vquextEVIStart').val()) || !$exeDevice.validTime($('#vquextEVIEnd').val())) {
            $exeDevice.showMessage($exeDevice.msgs.msgTimeFormat);
            return;
        } else if (startVideoQuExt >= endVideoQuExt) {
            $exeDevice.showMessage($exeDevice.msgs.msgEStartEndIncorrect);
            return;
        }else if (endVideoQuExt> $exeDevice.durationVideo){
            $exeDevice.showMessage($exeDevice.msgs.msgDuration);
            return;
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
            "author": '',
            'authorVideo': '',
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
            'version': 2
        }
        return data;
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
            ostr = '';
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
            $exeDevice.showVideo();
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
            $('#vquextNumberLives').prop('disabled', !marcado);
        });
        $('#vquextEShowSolution').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#vquextETimeShowSolution').prop('disabled', !marcado);
        });
        $('#vquextEVIURL').on('change', function (e) {
            e.preventDefault();
            var id = $exeDevice.getIDYoutube($(this).val());
            if (id) {
                $('#vquextEVideo').show();
                $('#vquextENoImageVideo').hide();
                $('#vquextECover').hide();
                $('#vquextENoVideo').hide();
                $exeDevice.startVideo(id, 0, 1);
            }
        });
        $('#vquextEPlayStart').on('click', function (e) {
            e.preventDefault();
            var id = $exeDevice.getIDYoutube($('#vquextEVIURL').val());
            if (!id) {
                $exeDevice.showMessage($exeDevice.msgs.msgECompleteURLYoutube);
            } else {
                $exeDevice.startVideo(id, 0, 1000);
            }
        });

        $exeAuthoring.iDevice.gamification.itinerary.addEvents();
        $('#vquextECheckSoundVideo').on('change', function () {
            //$exeDevice.showVideo();
        });
        $('#vquextECheckImageVideo').on('change', function () {
            //$exeDevice.showVideo();
        });
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
    }
}